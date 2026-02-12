import type Hexo from '../../hexo';
const index_default = (ctx: Hexo) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { injector } = ctx.extend;
};

// For ESM compatibility
export default index_default;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = index_default;
  // For ESM compatibility
  module.exports.default = index_default;
}
