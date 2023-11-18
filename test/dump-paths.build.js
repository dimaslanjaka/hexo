process.cwd = () => __dirname + '/hexo-theme-test';

const Hexo = require('../packages/hexo/dist/hexo');

const hexo = new Hexo(process.cwd(), { debug: true });
hexo.init().then(function () {
  hexo.log.i('base directory', hexo.base_dir);
  hexo.log.i('theme directory', hexo.theme_dir);
  hexo.log.i('theme script directory', hexo.theme_script_dir);
});
