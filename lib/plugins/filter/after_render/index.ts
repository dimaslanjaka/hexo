import type Hexo from '../../../hexo';

export default (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('after_render:html', require('./external_link'));
  filter.register('after_render:html', require('./meta_generator'));
};
