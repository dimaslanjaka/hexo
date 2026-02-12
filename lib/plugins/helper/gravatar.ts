import { gravatar } from 'hexo-util';
// For ESM compatibility
export default gravatar;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = gravatar;
  // For ESM compatibility
  module.exports.default = gravatar;
}

