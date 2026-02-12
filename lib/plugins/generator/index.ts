import type Hexo from '../../hexo';
const index_default = (ctx: Hexo) => {
  const { generator } = ctx.extend;

  generator.register('asset', require('./asset'));
  generator.register('page', require('./page'));
  generator.register('post', require('./post'));
};

// For ESM compatibility
export default index_default;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = index_default;
  // For ESM compatibility
  module.exports.default = index_default;
}
