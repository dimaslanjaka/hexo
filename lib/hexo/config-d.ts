import defaultConfig from './default_config';

type DefaultConfigType = typeof defaultConfig;
export interface Config extends DefaultConfigType {
  [key: string]: any;
}
export type HexoConfig = Config;
