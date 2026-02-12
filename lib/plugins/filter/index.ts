import type Hexo from '../../hexo/index';
const index_default = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  require('./after_render/index')(ctx);
  require('./after_post_render/index')(ctx);
  require('./before_post_render/index')(ctx);
  require('./before_exit/index')(ctx);
  require('./before_generate/index')(ctx);
  require('./template_locals/index')(ctx);

  filter.register('new_post_path', require('./new_post_path'));
  filter.register('post_permalink', require('./post_permalink'));
};

// For ESM compatibility
export default index_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = index_default;
  // For ESM compatibility
  module.exports.default = index_default;
}
