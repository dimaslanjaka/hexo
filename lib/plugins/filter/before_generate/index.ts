import type Hexo from '../../../hexo/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Normalize CJS + ESM default exports
const load = <T = any>(path: string): T => {
  const mod = require(path);
  return (mod && mod.default) || mod;
};

const beforeGenerateIndex = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  filter.register('before_generate', load('./render_post.js'));
};

export default beforeGenerateIndex;
