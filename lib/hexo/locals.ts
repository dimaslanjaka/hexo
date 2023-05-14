import { Cache } from 'hexo-util';
// import Cache from './cache';

type CacheType = import('../hexo')['_generateLocals'];

class Locals {
  public cache: {
    cache: Map<string, CacheType>;
    set(id: string, value: CacheType): void;
    has(id: string): boolean;
    get(id: string): CacheType;
    del(id: string): void;
    apply<T>(id: string, value: T): T;
    flush(): void;
    size(): number;
    dump(): {
      [k: string]: CacheType;
    };
  };
  public getters: Record<string, CacheType>;

  constructor() {
    this.cache = new Cache<CacheType>();
    this.getters = {};
  }

  get(name: string) {
    if (typeof name !== 'string') throw new TypeError('name must be a string!');

    return this.cache.apply(name, () => {
      const getter = this.getters[name];
      if (!getter) return;

      return getter();
    });
  }

  set(name: string, value: any) {
    if (typeof name !== 'string') throw new TypeError('name must be a string!');
    if (value == null) throw new TypeError('value is required!');

    const getter = typeof value === 'function' ? value : () => value;

    this.getters[name] = getter;
    this.cache.del(name);

    return this;
  }

  remove(name: string) {
    if (typeof name !== 'string') throw new TypeError('name must be a string!');

    this.getters[name] = null;
    this.cache.del(name);

    return this;
  }

  /**
   * invalidate cache
   * @returns
   */
  invalidate() {
    this.cache.flush();

    return this;
  }

  toObject() {
    const result = {};
    const keys = Object.keys(this.getters);

    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      const item = this.get(key);

      if (item != null) result[key] = item;
    }

    return result;
  }
}

export = Locals;
