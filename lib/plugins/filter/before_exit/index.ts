import type Hexo from '../../../hexo/index.js';

export default (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('before_exit', require('./save_database.js'));
};
