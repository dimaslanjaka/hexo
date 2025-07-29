const { spawnSync } = require('child_process');
const pc = require('picocolors');

require('dotenv/config');

const config = {
  'submodule "packages/hexo"': {
    path: 'packages/hexo',
    origin: 'https://github.com/dimaslanjaka/hexo.git',
    branch: 'v7-yarn-v3',
    upstream: 'https://github.com/hexojs/hexo'
  },
  'submodule "packages/warehouse"': {
    path: 'packages/warehouse',
    origin: 'https://github.com/dimaslanjaka/warehouse.git',
    branch: 'monorepo'
  },
  'submodule "packages/hexo-front-matter"': {
    path: 'packages/hexo-front-matter',
    origin: 'https://github.com/dimaslanjaka/hexo-front-matter.git',
    branch: 'monorepo'
  },
  'submodule "packages/hexo-asset-link"': {
    path: 'packages/hexo-asset-link',
    origin: 'https://github.com/dimaslanjaka/hexo-asset-link.git',
    branch: 'monorepo',
    upstream: 'https://github.com/liolok/hexo-asset-link'
  },
  'submodule "test/hexo-theme-test"': {
    path: 'test/hexo-theme-test',
    origin: 'https://github.com/dimaslanjaka/hexo-theme-unit-test.git',
    branch: 'monorepo'
  },
  'submodule "packages/hexo-theme-landscape"': {
    path: 'packages/hexo-theme-landscape',
    origin: 'https://github.com/hexojs/hexo-theme-landscape.git',
    branch: 'master'
  },
  'submodule "packages/hexo-log"': {
    path: 'packages/hexo-log',
    origin: 'https://github.com/dimaslanjaka/hexo-log.git',
    branch: 'monorepo'
  },
  'submodule "packages/hexo-util"': {
    path: 'packages/hexo-util',
    origin: 'https://github.com/dimaslanjaka/hexo-util.git',
    branch: 'monorepo',
    upstream: 'https://github.com/hexojs/hexo-util'
  },
  'submodule "packages/hexo-cli"': {
    path: 'packages/hexo-cli',
    origin: 'https://github.com/dimaslanjaka/hexo-cli.git',
    branch: 'monorepo',
    upstream: 'https://github.com/hexojs/hexo-cli'
  },
  'submodule "packages/hexo-fs"': {
    path: 'packages/hexo-fs',
    origin: 'https://github.com/dimaslanjaka/hexo-fs.git',
    branch: 'monorepo',
    upstream: 'https://github.com/hexojs/hexo-fs'
  }
};

for (const key in config) {
  const submodule = config[key];
  if (submodule.upstream) {
    const remotes = spawnSync('git', ['remote', '-v'], { cwd: submodule.path, encoding: 'utf-8' });
    if (remotes.error) {
      console.error(pc.red(`Error fetching remotes for ${submodule.path}:`), remotes.error);
      continue;
    }
    const parseRemotes = remotes.stdout
      .split(/\r?\n/)
      .filter((line) => line.trim() !== '')
      .map((line) => {
        return {
          name: line.split(/\t/)[0],
          url: line.split(/\t/)[1]?.split(' ')[0]
        };
      })
      .filter((remote, index, self) => index === self.findIndex((r) => r.name === remote.name && r.url === remote.url));
    const hasUpstream = parseRemotes.some((remote) => remote.name === 'upstream');
    if (!hasUpstream) {
      console.log(pc.yellow(`Adding upstream remote for ${submodule.path}`));
      const addRemote = spawnSync('git', ['remote', 'add', 'upstream', submodule.upstream], { cwd: submodule.path });
      if (addRemote.error) {
        console.error(pc.red(`Error adding upstream remote for ${submodule.path}:`), addRemote.error);
      } else {
        console.log(pc.green(`Upstream remote added for ${submodule.path}`));
      }
    } else {
      console.log(`Upstream remote already exists for ${pc.cyan(submodule.path)}`);
      console.log(pc.bold(`Remotes for ${submodule.path}:`));
      parseRemotes.forEach((remote) => {
        const color = remote.name === 'upstream' ? pc.magenta : pc.blue;
        console.log(`  ${color(remote.name)}: ${pc.dim(remote.url)}`);
      });
    }
  }
}
