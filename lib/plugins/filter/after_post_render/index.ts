import type Hexo from '../../../hexo';

export default (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('after_post_render', require('./external_link'));
  filter.register('after_post_render', require('./excerpt'));
};
