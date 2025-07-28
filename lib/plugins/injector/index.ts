import type Hexo from '../../hexo';

const injectorIndex = (ctx: Hexo) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { injector } = ctx.extend;
};

export default injectorIndex;
