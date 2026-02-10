import { escape } from 'hexo-front-matter';
import logger from 'hexo-log';
import yaml from 'js-yaml';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

let schema = {} as yaml.Schema;

// FIXME: workaround for https://github.com/hexojs/hexo/issues/4917
try {
  schema = yaml.DEFAULT_SCHEMA.extend(require('js-yaml-js-types').all);
} catch (e) {
  if (e instanceof yaml.YAMLException) {
    logger().warn('YAMLException: please see https://github.com/hexojs/hexo/issues/4917');
  } else {
    throw e;
  }
}

function yamlHelper<T = any>(data: { text: string }): T {
  if (!data || !data.text) return {} as T;
  return yaml.load(escape(data.text), { schema }) as T;
}

export default yamlHelper;
