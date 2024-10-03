import defaultConfig from './default_config';
import {
  Console,
  Deployer,
  Filter,
  Generator,
  Helper,
  Highlight,
  Injector,
  Migrator,
  Processor,
  Renderer,
  Tag
} from '../extend';

export type DefaultConfigType = typeof defaultConfig;
export interface Config extends DefaultConfigType {
  [key: string]: any;
}
export type HexoConfig = Config;


// Node.js internal APIs used in Hexo.loadPlugin
export interface Args {
  debug?: boolean;
  safe?: boolean;
  silent?: boolean;
  draft?: boolean;
  drafts?: boolean;
  _?: string[];
  output?: string;
  config?: string;
  [key: string]: any;
}

export interface Query {
  date?: any;
  published?: boolean;
}

export interface Extend {
  console: Console;
  deployer: Deployer;
  filter: Filter;
  generator: Generator;
  helper: Helper;
  highlight: Highlight;
  injector: Injector;
  migrator: Migrator;
  processor: Processor;
  renderer: Renderer;
  tag: Tag;
}

export interface Env {
  args: Args;
  debug: boolean;
  safe: boolean;
  silent: boolean;
  env: string;
  version: string;
  cmd: string;
  init: boolean;
}
