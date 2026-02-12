import type { RenderData } from '../../../types';

let titlecase;

function titlecaseFilter(data: RenderData): void {
  if (!(typeof data.titlecase !== 'undefined' ? data.titlecase : this.config.titlecase) || !data.title) return;

  if (!titlecase) titlecase = require('titlecase');
  data.title = titlecase(data.title);
}

// For ESM compatibility
export default titlecaseFilter;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = titlecaseFilter;
  // For ESM compatibility
  module.exports.default = titlecaseFilter;
}

