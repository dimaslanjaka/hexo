import { StoreFunctionData } from '../../types.js';
import type Hexo from '../../hexo/index.js';

export default (ctx: Hexo) =>
  function render(text: string, engine: string, options: object = {}) {
    return ctx.render.renderSync(
      {
        text,
        engine
      } as StoreFunctionData,
      options
    );
  };
