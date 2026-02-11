import type Hexo from '../../../hexo';

export default (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('before_generate', require('./render_post'));
};
