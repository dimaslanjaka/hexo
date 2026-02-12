import type { LocalsType } from '../../types.js';

function markdownHelper(this: LocalsType, text: string, options?: any) {
  return this.render(text, 'markdown', options);
}

// For ESM compatibility
export default markdownHelper;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = markdownHelper;
  // For ESM compatibility
  module.exports.default = markdownHelper;
}

