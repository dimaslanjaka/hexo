import type Hexo from '../../hexo/index';
const render_default = (ctx: Hexo) => function render(text: string, engine: string, options:object = {}) {
  return ctx.render.renderSync({
    text,
    engine
  }, options);
};

// For ESM compatibility
export default render_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = render_default;
  // For ESM compatibility
  module.exports.default = render_default;
}
