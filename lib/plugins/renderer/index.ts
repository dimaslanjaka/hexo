import type Hexo from '../../hexo/index.js';
const index_default = (ctx: Hexo) => {
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

// For ESM compatibility
export default index_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = index_default;
  // For ESM compatibility
  module.exports.default = index_default;
}
