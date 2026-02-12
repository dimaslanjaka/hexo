import type Hexo from '../../hexo/index.js';
const index_default = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  require('./after_render/index.js')(ctx);
  require('./after_post_render/index.js')(ctx);
  require('./before_post_render/index.js')(ctx);
  require('./before_exit/index.js')(ctx);
  require('./before_generate/index.js')(ctx);
  require('./template_locals/index.js')(ctx);

  filter.register('new_post_path', require('./new_post_path.js'));
  filter.register('post_permalink', require('./post_permalink.js'));
};

// For ESM compatibility
export default index_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = index_default;
  // For ESM compatibility
  module.exports.default = index_default;
}
