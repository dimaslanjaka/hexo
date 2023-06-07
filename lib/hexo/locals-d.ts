import { Config } from './index-d';
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
  cache?: boolean;

  /** absolute path source post markdown */
  full_source?: string;
};
