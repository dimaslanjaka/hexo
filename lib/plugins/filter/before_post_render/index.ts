import type Hexo from '../../../hexo/index';
const index_default = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('before_post_render', require('./backtick_code_block')(ctx));
  filter.register('before_post_render', require('./titlecase'));
};

// For ESM compatibility
export default index_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = index_default;
  // For ESM compatibility
  module.exports.default = index_default;
}
