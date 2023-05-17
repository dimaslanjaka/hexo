import { Config } from './index-d';
export type HexoLocalsFunc = import('../hexo')['_generateLocals'];
export type HexoLocalsData = {
  page: {
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
};
