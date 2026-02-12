import { url_for } from 'hexo-util';
import type { LocalsType } from '../../types';

interface Options {
  relative?: boolean
}
const url_for_default = function(this: LocalsType, path: string, options: Options = {}) {
  return url_for.call(this, path, options);
}

// For ESM compatibility
export default url_for_default;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = url_for_default;
  // For ESM compatibility
  module.exports.default = url_for_default;
}
