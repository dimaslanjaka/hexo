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

type DefaultConfigType = typeof defaultConfig;
export interface Config extends DefaultConfigType {
  [key: string]: any;
}
export type HexoConfig = Config;

export interface Args {
  debug?: any;
  safe?: any;
  silent?: any;
  _?: any[];
  output?: any;
  config?: any;
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
