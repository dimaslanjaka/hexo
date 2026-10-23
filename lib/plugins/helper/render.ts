import { StoreFunctionData } from '../../extend/renderer-d.js';
import type Hexo from '../../hexo/index.js';

export default (ctx: Hexo) =>
  function render(text: string, engine: string, options: Record<string, any> = {}) {
    return ctx.render.renderSync(
      {
        text,
        engine
      } as StoreFunctionData,
      options
    );
  };
