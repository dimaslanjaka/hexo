import type Hexo from '../../../hexo/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Normalize CJS + ESM default exports
const load = <T = any>(path: string): T => {
  const mod = require(path);
  return (mod && mod.default) || mod;
};

export default (ctx: Hexo) => {
  const { filter } = ctx.extend;

  // module returns a function that needs ctx
  filter.register('before_post_render', load('./backtick_code_block.js')(ctx));

  // module itself is the handler
  filter.register('before_post_render', load('./titlecase.js'));
};
