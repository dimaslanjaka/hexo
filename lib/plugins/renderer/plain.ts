import type { StoreFunctionData } from '../../extend/renderer';

function plainRenderer(data: StoreFunctionData): string {
  return data.text;
}

// For ESM compatibility
export default plainRenderer;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = plainRenderer;
  // For ESM compatibility
  module.exports.default = plainRenderer;
}

