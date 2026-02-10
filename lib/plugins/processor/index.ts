import type Hexo from '../../hexo/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Normalize CJS + ESM default exports
const load = <T = any>(path: string): T => {
  const mod = require(path);
  return (mod && mod.default) || mod;
};

const processorIndex = (ctx: Hexo) => {
  const { processor } = ctx.extend;

  function register(name: string) {
    const obj = load<any>(`./${name}.js`)(ctx);
    processor.register(obj.pattern, obj.process);
  }

  register('asset');
  register('data');
  register('post');
};

export default processorIndex;
