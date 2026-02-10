import type Hexo from '../../hexo/index.js';

const rendererIndex = (ctx: Hexo) => {
  const { renderer } = ctx.extend;

  const plain = require('./plain.js');

  renderer.register('htm', 'html', plain, true);
  renderer.register('html', 'html', plain, true);
  renderer.register('css', 'css', plain, true);
  renderer.register('js', 'js', plain, true);

  renderer.register('json', 'json', require('./json.js'), true);

  const yaml = require('./yaml.js');

  renderer.register('yml', 'json', yaml, true);
  renderer.register('yaml', 'json', yaml, true);

  const nunjucks = require('./nunjucks.js');

  renderer.register('njk', 'html', nunjucks, true);
  renderer.register('j2', 'html', nunjucks, true);
};

export default rendererIndex;
