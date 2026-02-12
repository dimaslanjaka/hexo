import type Hexo from '../../hexo/index.js';

/**
* Pullquote tag
*
* Syntax:
*   {% pullquote [class] %}
*   Quote string
*   {% endpullquote %}
*/
const pullquote_default = (ctx: Hexo) => function pullquoteTag(args: string[], content: string) {
  args.unshift('pullquote');

    const result = ctx.render.renderSync({ text: content, engine: 'markdown' });

  return `<blockquote class="${args.join(' ')}">${result}</blockquote>`;
};

// For ESM compatibility
export default pullquote_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = pullquote_default;
  // For ESM compatibility
  module.exports.default = pullquote_default;
}
