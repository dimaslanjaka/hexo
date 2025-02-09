import { extname } from 'path';
import Promise from 'bluebird';
import { Store, SyncStore, StoreSyncFunction, StoreFunction, StoreFunctionWithCallback } from './renderer-d';

const getExtname = (str: string) => {
  if (typeof str !== 'string') return '';

  const ext = extname(str) || str;
  return ext.startsWith('.') ? ext.slice(1) : ext;
};

/**
 * A renderer is used to render content.
 */
class Renderer {
  public store: Store | StoreSyncFunction;
  public storeSync: SyncStore | StoreFunction;

  constructor() {
    this.store = {};
    this.storeSync = {};
  }

  list(sync = false): Store | SyncStore | StoreSyncFunction | StoreFunction {
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

  register(name: string, output: string, fn: StoreFunctionWithCallback): void;
  register(name: string, output: string, fn: StoreFunctionWithCallback, sync: false): void;
  register(name: string, output: string, fn: StoreSyncFunction, sync: true): void;
  register(name: string, output: string, fn: StoreFunctionWithCallback | StoreSyncFunction, sync: boolean): void;
  register(name: string, output: string, fn: StoreFunctionWithCallback | StoreSyncFunction, sync?: boolean) {
    if (!name) throw new TypeError('name is required');
    if (!output) throw new TypeError('output is required');
    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    name = getExtname(name);
    output = getExtname(output);

    if (sync) {
      this.storeSync[name] = fn;
      this.storeSync[name].output = output;

      this.store[name] = Promise.method(fn);
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
