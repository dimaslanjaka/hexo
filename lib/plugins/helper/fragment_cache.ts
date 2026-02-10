import { Cache } from 'hexo-util';
import type Hexo from '../../hexo/index.js';

export default (ctx: Hexo) => {
  const cache = new Cache();

  // reset cache for watch mode
  ctx.on('generateBefore', () => {
    cache.flush();
  });

  return function fragmentCache(id: string, fn: (...args: any[]) => any) {
    if (this.cache) return cache.apply(id, fn);

    const result = fn();

    cache.set(id, result);
    return result;
  };
};
