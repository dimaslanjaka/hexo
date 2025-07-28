import type Hexo from '../../hexo';

const processorIndex = (ctx: Hexo) => {
  const { processor } = ctx.extend;

  function register(name: string) {
    const obj = require(`./${name}`)(ctx);
    processor.register(obj.pattern, obj.process);
  }

  register('asset');
  register('data');
  register('post');
};

export default processorIndex;
