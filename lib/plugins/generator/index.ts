import type Hexo from '../../hexo';

export default (ctx: Hexo) => {
  const { generator } = ctx.extend;

  generator.register('asset', require('./asset'));
  generator.register('page', require('./page'));
  generator.register('post', require('./post'));
};
