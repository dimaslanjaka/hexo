import type Hexo from '../../hexo/index.js';

export default (ctx: Hexo) => {
  const { generator } = ctx.extend;

  generator.register('asset', require('./asset.js'));
  generator.register('page', require('./page.js'));
  generator.register('post', require('./post.js'));
};
