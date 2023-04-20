'use strict';

// npx c8 --reporter=lcovonly mocha --timeout=7000000 test/yarn-theme-loader.test.js

const { join, resolve, dirname } = require('path');
const { readFileSync, writeFile, existsSync } = require('hexo-fs');
const { spawn } = require('hexo-util');
const expect = require('chai').expect;
const yaml = require('js-yaml');
const testBase = join(__dirname, 'fixtures/yarn-workspace/site'); // join(__dirname, '../../../site'); //
const configFile = join(testBase, '_config.yml');
process.cwd = () => testBase;

describe('find theme from yarn workspace', () => {
  const Hexo = require('../lib/hexo');
  const cfg = yaml.load(readFileSync(configFile).toString());
  const hexo = new Hexo(testBase, Object.assign(cfg, { silent: true }));

  before(async () => {
    console.log('installing workspace');
    if (!existsSync(join(dirname(testBase), 'yarn.lock'))) {
      await writeFile(join(dirname(testBase), 'yarn.lock'), '');
    }
    await spawn('yarn', ['install'], { cwd: testBase });
    console.log('initializing hexo');
    await hexo.init();
    // await hexo.load();
  });

  it('base must equal', async () => {
    expect(resolve(hexo.base_dir)).to.be.equal(resolve(testBase));
  });

  it('find theme from yarn workspace', async () => {
    console.log({ base: testBase.replace(__dirname, ''), theme: hexo.theme_dir.replace(__dirname, '') });
    // expect(hexo.theme_dir).to.be
  });
});
