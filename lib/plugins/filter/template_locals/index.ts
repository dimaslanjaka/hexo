import type Hexo from '../../../hexo/index.js';

export default (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('template_locals', require('./i18n.js'));
};
