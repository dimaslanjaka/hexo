import type Hexo from '../../../hexo/index.js';

export default (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('before_post_render', require('./backtick_code_block.js')(ctx));
  filter.register('before_post_render', require('./titlecase.js'));
};
