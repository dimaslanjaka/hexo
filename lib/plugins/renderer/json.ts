import type { StoreFunctionData } from '../../extend/renderer';

function jsonRenderer(data: StoreFunctionData): any {
  return JSON.parse(data.text);
}

// For ESM compatibility
export default jsonRenderer;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = jsonRenderer;
  // For ESM compatibility
  module.exports.default = jsonRenderer;
}

