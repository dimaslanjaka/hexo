const croSpawn = require('cross-spawn');
const { renameSync, existsSync, rmSync, mkdirSync } = require('fs');
const { join, dirname } = require('path');
const utility = require('sbg-utility');
const pc = require('picocolors');
const argv = process.argv.slice(2);

const parseWorkspaces = croSpawn
  .async('yarn', ['workspaces', 'list', '--no-private', '--json'], {
    cwd: process.cwd()
  })
  .then((o) =>
    o.stdout
      .split(/\r?\n/gm)
      .filter((str) => str.length > 4)
      .map((str) => {
        /**
         * @type {{location:string,name:string}}
         */
        const parse = JSON.parse(str.trim());
        parse.location = join(utility.findYarnRootWorkspace({ base_dir: process.cwd() }), parse.location);
        return parse;
      })
      .filter((o) => existsSync(o.location))
  );

parseWorkspaces.then((workspaces) => {
  if (workspaces.length === 0) return logfile('workspaces empty');
  const runBuild = (wname, clean) => {
    // activate clean when argument -c or --clean exist and clean option is undefined
    if (typeof clean === 'undefined') clean = argv.includes('-c') || argv.includes('--clean');

    // determine current workspace
    const workspace = workspaces.filter((o) => o.name === wname)[0];
    if (!workspace) throw new Error('workspace ' + wname + ' not found');

    /**
     * @type {ReturnType<typeof croSpawn.async>}
     */
    let promised;
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
          wname,
          ((clean ? pc.red('build') + '->' : '') + pc.green('build') + '->' + pc.yellow('pack') + ' successful').trim()
        )
      );
  };
  return (
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
      .then(() => runBuild('hexo-shortcodes'))
      .then(() => workspaces)
  );
});
