import type Hexo from '../../../hexo/index.js';

export default (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('after_render:html', require('./external_link.js'));
  filter.register('after_render:html', require('./meta_generator.js'));
};
