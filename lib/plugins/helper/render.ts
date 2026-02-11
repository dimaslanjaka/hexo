import type Hexo from '../../hexo';

export default (ctx: Hexo) =>
  function render(text: string, engine: string, options: object = {}) {
    return ctx.render.renderSync(
      {
        text,
        engine
      },
      options
    );
  };
