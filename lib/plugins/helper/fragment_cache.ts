import { Cache } from 'hexo-util';
import type Hexo from '../../hexo';

export = (ctx: import('../../hexo')) => {
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
