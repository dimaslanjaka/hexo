import { StoreFunctionData } from '../../extend/renderer-d';
import type Hexo from '../../hexo';

/**
* Pullquote tag
*
* Syntax:
*   {% pullquote [class] %}
*   Quote string
*   {% endpullquote %}
*/
export = (ctx: Hexo) => function pullquoteTag(args: string[], content: string) {
  args.unshift('pullquote');

  const result = ctx.render.renderSync({text: content, engine: 'markdown'} as StoreFunctionData);

  return `<blockquote class="${args.join(' ')}">${result}</blockquote>`;
};
