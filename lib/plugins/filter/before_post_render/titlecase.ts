import type { RenderData } from '../../../types.js';

let titlecase;

function titlecaseFilter(data: RenderData): void {
  if (!(typeof data.titlecase !== 'undefined' ? data.titlecase : this.config.titlecase) || !data.title) return;

  if (!titlecase) titlecase = require('titlecase');
  data.title = titlecase(data.title);
}

export default titlecaseFilter;
