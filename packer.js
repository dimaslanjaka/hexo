const croSpawn = require('cross-spawn');
const { renameSync, existsSync, rmSync, mkdirSync } = require('fs');
const { join, dirname } = require('path');
const utility = require('sbg-utility');

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
  );

const logfile = (...args) =>
  utility.writefile(join(__dirname, 'tmp/build.log'), args.join('\n') + '\n', { append: true });

logfile('', 'Build ' + new Date(), '');

parseWorkspaces.then((workspaces) => {
  if (workspaces.length === 0) return logfile('workspaces empty');
  const runBuild = (wname, clean) => {
    // activate clean when argument -c or --clean exist and clean option is undefined
    if (typeof clean === 'undefined') clean = argv.includes('-c') || argv.includes('--clean');
    /**
     * @type {ReturnType<typeof croSpawn.async>}
     */
    let promised;
    if (clean) {
      promised = croSpawn
        .async('yarn', ['workspace', wname, 'run', 'clean'], {
          cwd: __dirname
        })
        .then(() =>
          croSpawn.async('yarn', ['workspace', wname, 'run', 'build'], {
            cwd: __dirname
          })
        );
    } else {
      promised = croSpawn.async('yarn', ['workspace', wname, 'run', 'build'], {
        cwd: __dirname
      });
    }
    return promised
      .then(() =>
        croSpawn.async('yarn', ['workspace', wname, 'pack'], {
          cwd: __dirname
        })
      )
      .then(() => {
        const workspace = workspaces.filter((o) => o.name === wname)[0];
        if (typeof workspace === 'object') {
          const tarballName = workspace.name + '.tgz';
          const tarballPath = join(workspace.location, tarballName);
          const originalTarballPath = join(workspace.location, 'package.tgz');

          // rename package.tgz to {workspace.name}.tgz
          if (existsSync(originalTarballPath)) renameSync(originalTarballPath, tarballPath);
          // move {workspace.name}.tgz to releases/{workspace.name}.tgz
          if (existsSync(tarballPath)) {
            const dest = join(__dirname, 'releases', tarballName);
            if (!existsSync(dirname(dest))) mkdirSync(dirname(dest));
            if (existsSync(dest)) rmSync(dest);
            renameSync(tarballPath, dest);
          } else {
            logfile(tarballPath + ' not found');
          }
        } else {
          logfile(wname, 'is not workspace');
        }
      })
      .then(() => console.log(wname, ((clean ? 'clean->' : '') + 'build->pack successful').trim()));
  };
  return runBuild('warehouse')
    .then(() => runBuild('hexo-front-matter'))
    .then(() => runBuild('hexo-asset-link'))
    .then(() => runBuild('hexo-log'))
    .then(() => runBuild('hexo'))
    .then(() => workspaces);
});
