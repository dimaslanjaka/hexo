import { extname } from 'path';
import Promise from 'bluebird';

const getExtname = (str: string) => {
  if (typeof str !== 'string') return '';

  const ext = extname(str) || str;
  return ext.startsWith('.') ? ext.slice(1) : ext;
};

/**
 * to cast `data` type look example below
 * @example
 * type rendererData = Parameters<Parameters<typeof hexo.extend.renderer.register>[2]>[0];
 * // or
 * type rendererData = Parameters<Parameters<import('hexo')['extend']['renderer']['register']>[2]>[0];
 * // or
 * type rendererData = import('hexo/extend/renderer-d.ts').StoreFunctionData;
 */
export interface StoreFunctionData {
  path?: any;
  text?: string;
  engine?: string;
  toString?: any;
  onRenderEnd?: any;
}

export interface StoreSyncFunction {
  [x: string]: any;
  (
    data: StoreFunctionData,
    options: object,
    // callback: NodeJSLikeCallback<string>
  ): any;
  output?: string;
  compile?: (local: object) => any;
}
export interface StoreFunction {
  (
    data: StoreFunctionData,
    options: object,
  ): Promise<any>;
  (
    data: StoreFunctionData,
    options: object,
    callback: NodeJSLikeCallback<string>
  ): void;
  output?: string;
  compile?: (local: object) => any;
  disableNunjucks?: boolean;
}

interface SyncStore {
  [key: string]: StoreSyncFunction;
}
interface Store {
  [key: string]: StoreFunction;
}

class Renderer {
  public store: Store;
  public storeSync: SyncStore;

  constructor() {
    this.store = {};
    this.storeSync = {};
  }

  list(sync: boolean): Store | SyncStore {
    return sync ? this.storeSync : this.store;
  }

  get(name: string, sync?: boolean): StoreSyncFunction | StoreFunction {
    const store = this[sync ? 'storeSync' : 'store'];

    return store[getExtname(name)] || store[name];
  }

  isRenderable(path: string): boolean {
    return Boolean(this.get(path));
  }

  isRenderableSync(path: string): boolean {
    return Boolean(this.get(path, true));
  }

  getOutput(path: string): string {
    const renderer = this.get(path);
    return renderer ? renderer.output : '';
  }

  /**
   * register renderer engine
   * - [hexo-renderer-nunjucks example](https://github.com/hexojs/hexo-renderer-nunjucks/blob/c71a1979535c47c3949ff6bf3a85691641841e12/lib/renderer.js#L55-L56)
   * - [typescript example](https://github.com/dimaslanjaka/hexo-renderers/blob/feed801e90920bea8a5e7000b275b912e4ef6c43/src/renderer-sass.ts#L37-L38)
   * @param name input extension name. ex: ejs
   * @param output output extension name. ex: html
   * @param fn renderer function
   */
  register(name: string, output: string, fn: StoreFunction): void;

  /**
   * register renderer engine asynchronous
   * @param name input extension name. ex: ejs
   * @param output output extension name. ex: html
   * @param fn renderer asynchronous function
   * @param sync is synchronous?
   */
  register(name: string, output: string, fn: StoreFunction, sync: false): void;

  /**
   * register renderer engine
   * @param name input extension name. ex: ejs
   * @param output output extension name. ex: html
   * @param fn renderer function
   * @param sync is synchronous?
   */
  register(name: string, output: string, fn: StoreSyncFunction, sync: true): void;

  /**
   * register renderer engine
   * @param name input extension name. ex: ejs
   * @param output output extension name. ex: html
   * @param fn renderer function
   * @param sync is synchronous?
   */
  register(name: string, output: string, fn: StoreFunction | StoreSyncFunction, sync: boolean): void;

  /**
   * register renderer engine
   * @param name input extension name. ex: ejs
   * @param output output extension name. ex: html
   * @param fn renderer function
   * @param sync is synchronous?
   */
  register(name: string, output: string, fn: StoreFunction | StoreSyncFunction, sync?: boolean) {
    if (!name) throw new TypeError('name is required');
    if (!output) throw new TypeError('output is required');
    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    name = getExtname(name);
    output = getExtname(output);

    if (sync) {
      this.storeSync[name] = fn;
      this.storeSync[name].output = output;

      this.store[name] = Promise.method(fn);
      // eslint-disable-next-line no-extra-parens
      this.store[name].disableNunjucks = (fn as StoreFunction).disableNunjucks;
    } else {
      if (fn.length > 2) fn = Promise.promisify(fn);
      this.store[name] = fn;
    }

    this.store[name].output = output;
    this.store[name].compile = fn.compile;
  }
}

export default Renderer;
