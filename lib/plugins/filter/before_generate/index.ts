import type Hexo from '../../../hexo';

const beforeGenerateIndex = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('before_generate', require('./render_post'));
};

export default beforeGenerateIndex;
