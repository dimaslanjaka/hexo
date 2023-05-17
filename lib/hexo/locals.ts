import { Cache } from 'hexo-util';
import { HexoLocalsData } from './locals-d';

class Locals {
  public cache: Cache<HexoLocalsData>;
  public getters: Record<string, HexoLocalsData>;

  constructor() {
    this.cache = new Cache<HexoLocalsData>();
    this.getters = {};
  }

  get(name: 'posts'): HexoLocalsData;
  get(name: 'pages'): HexoLocalsData;
  get(name: 'categories'): HexoLocalsData;
  get(name: 'data'): HexoLocalsData;
  get(name: 'tags'): HexoLocalsData;
  get(name: string): HexoLocalsData;
  get(name: string) {
    if (typeof name !== 'string') throw new TypeError('name must be a string!');

    return this.cache.apply(name, () => {
      // This expression is not callable.
      // Type 'HexoLocalsData' has no call signatures
      // solution cast to `any`
      const getter = this.getters[name] as any;
      if (!getter) return;

      return getter() as HexoLocalsData;
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
