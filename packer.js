const croSpawn = require('cross-spawn');
const { renameSync, existsSync, rmSync, mkdirSync, appendFileSync } = require('fs');
const { join, dirname } = require('path');
const utility = require('sbg-utility');

const parseWorkspaces = croSpawn
  .async('yarn', ['workspaces', 'list', '--no-private', '--json'], {
    cwd: __dirname
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
        parse.location = join(utility.findYarnRootWorkspace(__dirname), parse.location);
        return parse;
      })
  );

const logfile = (...args) => appendFileSync(join(__dirname, 'build.log'), args.join('\n') + '\n');

logfile('\n', new Date(), '\n');

parseWorkspaces.then((workspaces) => {
  if (workspaces.length === 0) return logfile('workspaces empty');
  const clean_build = (wname) =>
    croSpawn
      .async('yarn', ['workspace', wname, 'run', 'clean'], {
        cwd: __dirname
      })
      .then(() =>
        croSpawn.async('yarn', ['workspace', wname, 'run', 'build'], {
          cwd: __dirname
        })
      )
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
      .then(() => console.log(wname, 'clean->build->pack successful'));
  return clean_build('warehouse')
    .then(() => clean_build('hexo-front-matter'))
    .then(() => clean_build('hexo-asset-link'))
    .then(() => clean_build('hexo-log'))
    .then(() => clean_build('hexo'))
    .then(() => workspaces);
});
