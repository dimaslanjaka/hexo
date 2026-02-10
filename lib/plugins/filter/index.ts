import type Hexo from '../../hexo/index.js';

const filterIndex = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  require('./after_render.js')(ctx);
  require('./after_post_render.js')(ctx);
  require('./before_post_render.js')(ctx);
  require('./before_exit.js')(ctx);
  require('./before_generate.js')(ctx);
  require('./template_locals.js')(ctx);

  filter.register('new_post_path', require('./new_post_path.js'));
  filter.register('post_permalink', require('./post_permalink.js'));
};

export default filterIndex;
