import type Hexo from '../../../hexo/index.js';

const beforeGenerateIndex = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('before_generate', require('./render_post.js'));
};

export default beforeGenerateIndex;
