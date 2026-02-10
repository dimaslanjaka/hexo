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

  filter.register('after_post_render', load('./external_link.js'));
  filter.register('after_post_render', load('./excerpt.js'));
};
