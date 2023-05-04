import croSpawn from 'cross-spawn';
import { renameSync, existsSync, rmSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import utility from 'sbg-utility';
import pc from 'picocolors';
import git from 'git-command-helper';
import { toUnix } from 'upath';
import nunjucks from 'nunjucks';

const argv = process.argv.slice(2);
const gh = new git(__dirname, 'monorepo-v7');

const parseWorkspaces = croSpawn
  .async('yarn', ['workspaces', 'list', '--no-private', '--json'], {
    cwd: process.cwd()
  })
  .then((o) =>
    o.stdout
      .split(/\r?\n/gm)
      .filter((str) => str.length > 4)
      .map((str) => {
        const parse: { location: string; name: string } = JSON.parse(str.trim());
        parse.location = join(utility.findYarnRootWorkspace({ base_dir: process.cwd() }), parse.location);
        return parse;
      })
      .filter((o) => existsSync(o.location))
  );

async function buildPack(workspaces: Awaited<typeof parseWorkspaces>) {
  if (workspaces.length === 0) return console.log('workspaces empty');
  const runBuild = (wname: string, clean?: boolean) => {
    // activate clean when argument -c or --clean exist and clean option is undefined
    if (typeof clean === 'undefined') clean = argv.includes('-c') || argv.includes('--clean');

    // determine current workspace
    const workspace = workspaces.filter((o) => o.name === wname)[0];
    if (!workspace) throw new Error('workspace ' + wname + ' not found');

    let promised: ReturnType<typeof croSpawn.async>;
    if (clean) {
      promised = croSpawn
        .async('yarn', ['run', 'clean'], {
          cwd: workspace.location
        })
        .then(() =>
          croSpawn.async('yarn', ['run', 'build'], {
            cwd: workspace.location
          })
        );
    } else {
      promised = croSpawn.async('yarn', ['run', 'build'], {
        cwd: workspace.location
      });
    }
    return promised
      .then(() =>
        croSpawn.async('yarn', ['workspace', wname, 'pack'], {
          cwd: __dirname
        })
      )
      .then(() => {
        if (typeof workspace === 'object') {
          const tarballName = workspace.name + '.tgz';
          const tarballPath = join(workspace.location, tarballName);
          const originalTarballPath = join(workspace.location, 'package.tgz');

          // rename package.tgz to {workspace.name}.tgz
          if (existsSync(originalTarballPath)) {
            renameSync(originalTarballPath, tarballPath);
          } else {
            console.log(originalTarballPath + ' not found');
          }
          // move {workspace.name}.tgz to releases/{workspace.name}.tgz
          if (existsSync(tarballPath)) {
            const dest = join(__dirname, 'releases', tarballName);
            if (!existsSync(dirname(dest))) mkdirSync(dirname(dest));
            if (existsSync(dest)) rmSync(dest);
            renameSync(tarballPath, dest);
          } else {
            console.log(tarballPath + ' not found');
          }
        } else {
          console.log(wname, 'is not workspace');
        }
      })
      .then(() =>
        console.log(
          wname.padEnd(19),
          ((clean ? pc.red('build') + '->' : '') + pc.green('build') + '->' + pc.yellow('pack') + ' successful').trim()
        )
      );
  };

  return new Promise((res: (...args: any[]) => void) => {
    // no need any workspaces
    runBuild('hexo-log')
      // no need any workspaces
      .then(() => runBuild('hexo-front-matter'))
      // no need any workspaces
      .then(() => runBuild('hexo-util'))
      // need hexo-log
      .then(() => runBuild('warehouse'))
      // need hexo-util
      .then(() => runBuild('hexo-asset-link'))
      // need hexo-util, hexo-log
      .then(() => runBuild('hexo-cli'))
      // need hexo-cli, hexo-util, hexo-log, warehouse, hexo-front-matter
      .then(() => runBuild('hexo'))
      // need hexo
      //.then(() => runBuild('git-embed'))
      // need hexo, git-embed
      //.then(() => runBuild('hexo-shortcodes'))
      // need hexo
      .then(() => runBuild('hexo-renderers'))
      .then(res);
  }).then(() => workspaces);
}

async function createReadMe(workspaces: Awaited<typeof parseWorkspaces>) {
  if (Array.isArray(workspaces)) {
    const readme = join(__dirname, 'releases/readme.md');
    const source_readme = nunjucks.compile(readFileSync(join(__dirname, 'build-readme.md'), 'utf-8'));
    const source_vars = {
      install_prod: '',
      install_dev: '',
      resolutions: ''
    };

    const resolutions = {};
    for (let i = 0; i < workspaces.length; i++) {
      const workspace = workspaces[i];
      const tarball = join(__dirname, 'releases', workspace.name + '.tgz');
      if (!existsSync(tarball)) {
        console.log(tarball, pc.red('not found'));
        continue;
      }
      const relativeTarball = toUnix(tarball.replace(__dirname, '')).replace(/^\//, '');
      const checkIgnore = (await croSpawn.async('git', 'status --porcelain --ignored'.split(' '))).output
        .split(/\r?\n/)
        .map((str) => str.trim())
        .filter((str) => str.startsWith('!!'))
        .join('\n');
      if (checkIgnore.includes(relativeTarball)) {
        console.log(relativeTarball, pc.red('excluded by .gitignore'));
        continue;
      }
      const github = new git(workspace.location);
      const commitURL = new URL(
        (await github.getremote()).fetch.url.replace(/.git$/, '') + '/commit/' + (await github.latestCommit())
      );

      const args = ['status', '--porcelain', '--', relativeTarball, '|', 'wc', '-l'];
      const isChanged =
        parseInt(
          (
            await croSpawn.async('git', args, {
              cwd: __dirname,
              shell: true
            })
          ).output.trim()
        ) > 0;
      console.log('git', ...args, '->', relativeTarball, 'is changed', isChanged);
      if (isChanged) {
        await croSpawn.async('git', ['add', relativeTarball], { cwd: __dirname, stdio: 'inherit' });
        await croSpawn.async('git', ['commit', '-m', 'chore: update from ' + commitURL.pathname], {
          cwd: __dirname,
          stdio: 'inherit'
        });
      }

      // create installation
      const tarballRawURL = (await gh.getGithubRepoUrl(relativeTarball)).rawURL;
      const tarballProdURL = tarballRawURL.replace('monorepo-v7', await gh.latestCommit(relativeTarball));
      source_vars.install_prod += `npm i ${workspace.name}@${tarballProdURL}\n`;
      source_vars.install_dev += `npm i ${workspace.name}@${tarballRawURL}\n`;

      // create resolutions
      resolutions[workspace.name] = tarballProdURL;
    }

    source_vars.resolutions = JSON.stringify({ name: 'your package name', resolutions }, null, 2);

    source_vars.install_prod = source_vars.install_prod.trim();
    source_vars.install_dev = source_vars.install_dev.trim();

    const render = source_readme.render(source_vars);

    writeFileSync(readme, render);
    await gh.add('releases/readme.md');
    // await gh.commit('docs: update docs');
  }
}

parseWorkspaces.then(buildPack).then(createReadMe);
