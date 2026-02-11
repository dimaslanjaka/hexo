import type Hexo from '../../hexo';

export default (ctx: Hexo) => {
  const { processor } = ctx.extend;

  function register(name: string) {
    const obj = require(`./${name}.js`)(ctx);
    processor.register(obj.pattern, obj.process);
  }

  register('asset');
  register('data');
  register('post');
};
