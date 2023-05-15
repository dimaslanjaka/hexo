const path = require('path');
const Hexo = require('../packages/hexo');

const hexo = new Hexo(path.join(__dirname, 'hexo-theme-test'));
hexo.init().then(() => {
  const locals = hexo.locals;
  console.log(locals);
});
