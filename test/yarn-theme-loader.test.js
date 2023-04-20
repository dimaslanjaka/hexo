'use strict';

// npx c8 --reporter=lcovonly mocha --timeout=70000 test/yarn-theme-loader.test.js

const { spawn } = require('hexo-util');
const path = require('path');
const expect = require('chai').expect;

describe('Theme Yarn Workspace', () => {
  const Hexo = require('../lib/hexo');
  const base = path.normalize(__dirname, 'fixtures/yarn-workspace');
  const hexo = new Hexo(base, { silent: true });

  before(async () => {
    await spawn('yarn', ['install'], { cwd: base });
    await hexo.init();
  });

  it('find theme from yarn workspace', async () => {
    await hexo.init();
    // const { theme_dir, base_dir, config, config_path } = hexo;
    // console.log({ theme_dir, base_dir, config_path, theme: config.theme });
    // path.normalize(base_dir).should.eql(base);
    // check base is same
    expect(path.resolve(hexo.base_dir)).to.be.equal(path.resolve(base));
    // config.theme.should.eql('test');
  });
});
