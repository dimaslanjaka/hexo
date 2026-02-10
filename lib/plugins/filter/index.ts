import type Hexo from '../../hexo/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Normalize CJS + ESM default exports
const load = <T = any>(path: string): T => {
  const mod = require(path);
  return (mod && mod.default) || mod;
};

const filterIndex = (ctx: Hexo) => {
  const { filter } = ctx.extend;

  load('./after_render/index.js')(ctx);
  load('./after_post_render/index.js')(ctx);
  load('./before_post_render/index.js')(ctx);
  load('./before_exit/index.js')(ctx);
  load('./before_generate/index.js')(ctx);
  load('./template_locals/index.js')(ctx);

  filter.register('new_post_path', load('./new_post_path.js'));
  filter.register('post_permalink', load('./post_permalink.js'));
};

export default filterIndex;
