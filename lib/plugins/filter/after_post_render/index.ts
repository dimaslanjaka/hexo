import type Hexo from '../../../hexo';
const index_default = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('after_post_render', require('./external_link'));
  filter.register('after_post_render', require('./excerpt'));
};

// For ESM compatibility
export default index_default;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = index_default;
  // For ESM compatibility
  module.exports.default = index_default;
}
