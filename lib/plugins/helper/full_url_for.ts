import { full_url_for } from 'hexo-util';
import type { LocalsType } from '../../types.js';
const full_url_for_default = function(this: LocalsType, path?: string) {
  return full_url_for.call(this, path);
};

// For ESM compatibility
export default full_url_for_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = full_url_for_default;
  // For ESM compatibility
  module.exports.default = full_url_for_default;
}
