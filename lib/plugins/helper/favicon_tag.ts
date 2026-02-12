import { url_for } from 'hexo-util';
import type { LocalsType } from '../../types.js';

function faviconTagHelper(this: LocalsType, path: string) {
  return `<link rel="shortcut icon" href="${url_for.call(this, path)}">`;
}

// For ESM compatibility
export default faviconTagHelper;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = faviconTagHelper;
  // For ESM compatibility
  module.exports.default = faviconTagHelper;
}

