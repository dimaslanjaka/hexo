const path = require('path');
const Hexo = require('../packages/hexo/dist/hexo');

const hexo = new Hexo(path.join(__dirname, 'hexo-theme-test'));
global.hexo = hexo;

hexo.init().then(() => {
  const locals = hexo.locals; //.get('posts');
  console.log(locals);
});
