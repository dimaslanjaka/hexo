import type Hexo from '../../hexo/index';

module.exports = (ctx: Hexo) => {
  const { highlight } = ctx.extend;

  highlight.register('highlight.js', require('./highlight'));
  highlight.register('prismjs', require('./prism'));
};
