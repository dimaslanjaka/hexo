import * as picocolors from 'picocolors';
import table from 'fast-text-table';
import { stringLength } from './common.js';
import type Hexo from '../../../hexo/index.js';
import type { CategorySchema } from '../../../types.js';
import type Model from 'warehouse/dist/model' with { 'resolution-mode': 'import' };
import type Document from 'warehouse/dist/document' with { 'resolution-mode': 'import' };

function listCategory(this: Hexo): void {
  const categories: Model<CategorySchema> = this.model('Category');

  const data = categories
    .sort({ name: 1 })
    .map((cate: Document<CategorySchema> & CategorySchema) => [cate.name, String(cate.length)]);

  // Table header
  const header = ['Name', 'Posts'].map(str => picocolors.underline(str));

  data.unshift(header);

  const t = table(data, {
    align: ['l', 'r'],
    stringLength
  });

  console.log(t);
  if (data.length === 1) console.log('No categories.');
}

// For ESM compatibility
export default listCategory;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = listCategory;
  // For ESM compatibility
  module.exports.default = listCategory;
}

