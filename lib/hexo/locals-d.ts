import type { Config } from './index-d';
export type HexoLocalsFunc = import('../hexo')['_generateLocals'];
export type HexoLocalsData = {
  [key: string]: any;
  page: {
    [key: string]: any;
    path: string;
  };
  path: string;
  url: string;
  config: Config;
  theme: Record<string, any>;
  layout: string;
  env: any;
  view_dir: string;
  site: Record<string, any>;
  cache?:
    | boolean
    | {
        cache: Map<string, HexoLocalsData>;
        set(id: string, value: HexoLocalsData): void;
        has(id: string): boolean;
        get(id: string): HexoLocalsData;
        del(id: string): void;
        apply<T>(id: string, value: T): T;
        flush(): void;
        size(): number;
        dump(): {
          [k: string]: HexoLocalsData;
        };
      };

  /** absolute path source post markdown */
  full_source?: string;
};
