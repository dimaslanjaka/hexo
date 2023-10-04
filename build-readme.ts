import croSpawn from 'cross-spawn';
import git from 'git-command-helper';
import minimist from 'minimist';
import { findYarnRootWorkspace, path, fs, writefile } from 'sbg-utility';
import nunjucks from 'nunjucks';
import picocolors from 'picocolors';

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
        parse.location = path.join(findYarnRootWorkspace({ base_dir: process.cwd() }), parse.location);
        return parse;
      })
      .filter((o) => fs.existsSync(o.location))
  );

/**
 * is current device is Github Actions
 */
const _isCI = process.env.GITHUB_ACTION && process.env.GITHUB_ACTIONS;
const argv = minimist(process.argv.slice(2));
const gh = new git(__dirname, 'monorepo-v7');

export async function createReadMe() {
  const workspaces = await parseWorkspaces;
  if (Array.isArray(workspaces)) {
    // set username and email on CI
    if (_isCI) {
      await croSpawn.async('git', ['config', '--global', 'user.name', 'dimaslanjaka'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
      await croSpawn.async('git', ['config', '--global', 'user.email', 'dimaslanjaka@gmail.com'], {
        cwd: __dirname,
        stdio: 'inherit'
      });
    }

    const readme = path.join(__dirname, 'releases/readme.md');
    const source_readme = nunjucks.compile(fs.readFileSync(path.join(__dirname, 'build-readme.md'), 'utf-8'));
    const source_vars = {
      npm_prod: '',
      npm_dev: '',
      resolutions: '',
      overrides: '',
      yarn_prod: '',
      yarn_dev: '',
      commits: {}
    };

    const resolutions = {};
    for (let i = 0; i < workspaces.length; i++) {
      const workspace = workspaces[i];
      const tarball = path.join(__dirname, 'releases', workspace.name + '.tgz');
      if (!fs.existsSync(tarball)) {
        console.log(tarball, picocolors.red('not found'));
        continue;
      }
      const relativeTarball = path.toUnix(tarball.replace(__dirname, '')).replace(/^\//, '');
      const checkIgnore = (await croSpawn.async('git', 'status --porcelain --ignored'.split(' '))).output
        .split(/\r?\n/)
        .map((str) => str.trim())
        .filter((str) => str.startsWith('!!'))
        .join('\n');
      if (checkIgnore.includes(relativeTarball)) {
        console.log(relativeTarball, picocolors.red('excluded by .gitignore'));
        continue;
      }
      const workspaceGit = new git(workspace.location);
      const commitURL = new URL(
        (await workspaceGit.getremote()).push.url.replace(/.git$/, '') +
          '/commit/' +
          (await workspaceGit.latestCommit())
      );
      const cspl = commitURL.toString().split('/');
      source_vars.commits[workspace.name] = `[${cspl[cspl.length - 1]}](${commitURL})`;
      switch (workspace.name) {
        case 'hexo':
          source_vars.commits[workspace.name] +=
            '  [![Coverage Status](https://coveralls.io/repos/github/dimaslanjaka/hexo/badge.svg)](https://coveralls.io/github/dimaslanjaka/hexo)';
          break;

        default:
          break;
      }

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
      console.log(
        'git',
        ...args,
        '->',
        relativeTarball,
        'is changed',
        isChanged ? picocolors.green('true') : picocolors.gray('false')
      );
      /*if (isChanged) {
        await croSpawn.async('git', ['add', relativeTarball], { cwd: __dirname, stdio: 'inherit' });
        await croSpawn.async('git', ['commit', '-m', 'chore: update from ' + commitURL.pathname.replace(/^\/+/, '')], {
          cwd: __dirname,
          stdio: 'inherit'
        });
      }*/

      // create installation
      const tarballRawURL = (await gh.getGithubRepoUrl(relativeTarball)).rawURL;
      const tarballProdURL = tarballRawURL.replace(
        'monorepo-v7',
        /*<production>*/ await gh.latestCommit(relativeTarball)
      );
      source_vars.npm_prod += `npm i ${workspace.name}@${tarballProdURL}\n`;
      source_vars.npm_dev += `npm i ${workspace.name}@${tarballRawURL}\n`;
      source_vars.yarn_dev += `yarn add ${workspace.name}@${tarballRawURL}\n`;
      source_vars.yarn_prod += `yarn add ${workspace.name}@${tarballProdURL}\n`;

      // create resolutions
      resolutions[workspace.name] = tarballProdURL;
    }

    source_vars.resolutions = JSON.stringify({ name: 'your package name', resolutions }, null, 2);
    source_vars.overrides = JSON.stringify({ name: 'your package name', overrides: resolutions }, null, 2);

    source_vars.npm_prod = source_vars.npm_prod.trim();
    source_vars.npm_dev = source_vars.npm_dev.trim();

    let render = source_readme.render(source_vars);

    if (argv['commits'] || argv['commit']) {
      gh.add('releases');
      const lc = await gh.latestCommit('releases');
      const url = new URL('https://github.com/');
      url.pathname =
        new URL((await gh.getremote()).push.url.replace(/\.git$/, '')).pathname.replace(/^\//, '') + '/commit/' + lc;

      await croSpawn
        .async('git', ['commit', '-m', `chore(tarball): build ${String(url)}`], { cwd: gh.cwd })
        .catch(() => console.log('cannot commit'));
    }

    // replace <production>
    render = render.replace(/<production>/gm, await gh.latestCommit('releases'));

    // await croSpawn.async('git', ['rev-list', '--parents', '-n', '1', await gh.latestCommit()], { cwd: __dirname }).stdout.trim().split(/\s/);

    writefile(readme, render);
    //await gh.add('releases/readme.md');
    //await gh.commit('docs: update docs');
  }
}

if (require.main === module) {
  createReadMe();
}
