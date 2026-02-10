import type Hexo from '../../hexo/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Normalize CJS + ESM default exports
const load = <T = any>(path: string): T => {
  const mod = require(path);
  return (mod && mod.default) || mod;
};

const rendererIndex = (ctx: Hexo) => {
  const { renderer } = ctx.extend;

  const plain = load('./plain.js');

  renderer.register('htm', 'html', plain, true);
  renderer.register('html', 'html', plain, true);
  renderer.register('css', 'css', plain, true);
  renderer.register('js', 'js', plain, true);

  renderer.register('json', 'json', load('./json.js'), true);

  const yaml = load('./yaml.js');

  renderer.register('yml', 'json', yaml, true);
  renderer.register('yaml', 'json', yaml, true);

  const nunjucks = load('./nunjucks.js');

  renderer.register('njk', 'html', nunjucks, true);
  renderer.register('j2', 'html', nunjucks, true);
};

export default rendererIndex;
