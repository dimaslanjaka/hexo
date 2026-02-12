import { relative_url } from 'hexo-util';
const relative_url_default = function(from: string, to: string) {
  return relative_url(from, to);
}

// For ESM compatibility
export default relative_url_default;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = relative_url_default;
  // For ESM compatibility
  module.exports.default = relative_url_default;
}
