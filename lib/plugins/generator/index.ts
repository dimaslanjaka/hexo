import type Hexo from '../../hexo/index.js';
const index_default = (ctx: Hexo) => {
  const { generator } = ctx.extend;

  generator.register('asset', require('./asset.js'));
  generator.register('page', require('./page.js'));
  generator.register('post', require('./post.js'));
};

// For ESM compatibility
export default index_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = index_default;
  // For ESM compatibility
  module.exports.default = index_default;
}
