import type Hexo from '../../hexo/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Normalize CJS + ESM default exports
const load = <T = any>(path: string): T => {
  const mod = require(path);
  return (mod && mod.default) || mod;
};

export default (ctx: Hexo) => {
  const { highlight } = ctx.extend;

  highlight.register('highlight.js', load('./highlight.js'));
  highlight.register('prismjs', load('./prism.js'));
};
