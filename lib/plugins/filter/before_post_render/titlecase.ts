import type { RenderData } from '../../../types.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let titlecase: typeof import('titlecase');

function titlecaseFilter(this: any, data: RenderData): void {
  if (!(typeof data.titlecase !== 'undefined' ? data.titlecase : this.config.titlecase) || !data.title) {
    return;
  }

  if (!titlecase) {
    const mod = require('titlecase');
    titlecase = (mod && mod.default) || mod;
  }

  data.title = titlecase(data.title);
}

export default titlecaseFilter;
