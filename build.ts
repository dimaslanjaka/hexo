import * as croSpawn from 'cross-spawn';
import { existsSync, mkdirSync, renameSync, rmSync } from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { dirname, join } from 'path';
import pc from 'picocolors';
import { createReadMe } from './build-readme';
import Bluebird from 'bluebird';

const argv = yargs(hideBin(process.argv))
  .option('clean', { alias: 'c', type: 'boolean', description: 'run clean before build' })
  .help(false)
  .parseSync() as { _: (string | number)[]; c?: boolean; clean?: boolean };

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
        parse.location = join(__dirname, parse.location);
        return parse;
      })
      .filter((o) => existsSync(o.location))
  );

async function buildPack(workspaces: Awaited<typeof parseWorkspaces>) {
  if (workspaces.length === 0) return console.log('workspaces empty');

  // 🔥 optimize lookup (avoid repeated filter)
  const workspaceMap = new Map(workspaces.map((w) => [w.name, w]));

  const runBuild = async (wname: string, clean?: boolean) => {
    // activate clean when argument -c or --clean exist and clean option is undefined
    if (typeof clean === 'undefined') clean = !!(argv.c || argv.clean);

    // determine current workspace
    const workspace = workspaceMap.get(wname);
    if (!workspace) throw new Error('workspace ' + wname + ' not found');

    const cwd = workspace.location;

    if (clean) {
      await croSpawn.async('yarn', ['run', 'clean'], { cwd });
    }

    await croSpawn.async('yarn', ['run', 'build'], { cwd });

    await croSpawn.async('yarn', ['workspace', wname, 'pack'], {
      cwd: __dirname
    });

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
      const destDir = dirname(dest);

      if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
      if (existsSync(dest)) rmSync(dest);

      renameSync(tarballPath, dest);
    } else {
      console.log(tarballPath + ' not found');
    }

    console.log(
      wname.padEnd(19),
      ((clean ? pc.red('clean') + '->' : '') + pc.green('build') + '->' + pc.yellow('pack') + ' successful').trim()
    );
  };

  const buildOrder = [
    // no need any workspaces
    'hexo-log',
    'hexo-fs',
    'hexo-front-matter',
    'hexo-util',
    // need hexo-log
    'warehouse',
    // need hexo-util
    'hexo-asset-link',
    // need hexo-util
    'hexo-server',
    // need hexo-util, hexo-log
    'hexo-cli',
    // need hexo-cli, hexo-util, hexo-log, warehouse, hexo-front-matter
    'hexo',
    // need hexo
    'hexo-is',
    'hexo-generator-category'
    // 'git-embed',
    // need hexo, git-embed
    // 'hexo-shortcodes',
    // need hexo
    // 'hexo-renderers'
  ];

  // determine build sequence based on positional targets
  const targets: string[] = (argv._ || []).map(String).filter(Boolean);

  let buildSequence: string[];

  if (targets.length === 0) {
    buildSequence = [...buildOrder];
  } else {
    const indices = targets.map((t) => buildOrder.indexOf(t)).filter((i) => i >= 0);

    if (indices.length === 0) {
      // none of the targets are listed in buildOrder: build only specified targets that exist
      buildSequence = targets.filter((t) => workspaceMap.has(t));
    } else {
      const maxIndex = Math.max(...indices);

      buildSequence = buildOrder.slice(0, maxIndex + 1);

      // append any extra targets not in buildOrder but present in workspaces
      const extras = targets.filter((t) => !buildOrder.includes(t)).filter((t) => workspaceMap.has(t));

      buildSequence.push(...extras);
    }
  }

  // ensure sequence only contains workspaces that actually exist
  buildSequence = buildSequence.filter((name) => workspaceMap.has(name));

  return Bluebird.each(buildSequence, (name) => runBuild(name)).then(() => workspaces);
}

parseWorkspaces.then(buildPack).then(createReadMe);
