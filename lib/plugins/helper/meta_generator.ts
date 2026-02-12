import type { LocalsType } from '../../types';

function metaGeneratorHelper(this: LocalsType) {
  return `<meta name="generator" content="Hexo ${this.env.version}">`;
}

// For ESM compatibility
export default metaGeneratorHelper;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = metaGeneratorHelper;
  // For ESM compatibility
  module.exports.default = metaGeneratorHelper;
}

