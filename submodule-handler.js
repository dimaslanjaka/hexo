const dotenv = require('dotenv');
dotenv().config({});

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
    branch: 'monorepo'
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
    branch: 'monorepo'
  }
};
