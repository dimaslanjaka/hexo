import { Cache } from 'hexo-util';
import type Hexo from '../../hexo/index';
const fragment_cache_default = (ctx: Hexo) => {
  const cache = new Cache();

  // reset cache for watch mode
  ctx.on('generateBefore', () => { cache.flush(); });

  return function fragmentCache(id: string, fn: () => any) {
    if (this.cache) return cache.apply(id, fn);

    const result = fn();

    cache.set(id, result);
    return result;
  };
};

// For ESM compatibility
export default fragment_cache_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = fragment_cache_default;
  // For ESM compatibility
  module.exports.default = fragment_cache_default;
}
