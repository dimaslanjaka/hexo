import type Hexo from '../../../hexo/index.js';
const index_default = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('after_render:html', require('./external_link.js'));
  filter.register('after_render:html', require('./meta_generator.js'));
};

// For ESM compatibility
export default index_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = index_default;
  // For ESM compatibility
  module.exports.default = index_default;
}
