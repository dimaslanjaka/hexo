import { StoreFunctionData } from '../../types';
import type Hexo from '../../hexo';

/**
* Pullquote tag
*
* @example
* ```markdown
*   {% pullquote [class] %}
*   Quote string
*   {% endpullquote %}
* ```
*/
const pullquote = (ctx: Hexo) => function pullquoteTag(args: string[], content: string) {
  args.unshift('pullquote');

  const result = ctx.render.renderSync({text: content, engine: 'markdown'} as StoreFunctionData);

  return `<blockquote class="${args.join(' ')}">${result}</blockquote>`;
};

export default pullquote;
