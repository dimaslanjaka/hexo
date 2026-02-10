import Box from '../box/index.js';
import type Hexo from './index.js';

class Source extends Box {
  constructor(ctx: Hexo) {
    super(ctx, ctx.source_dir);

    this.processors = ctx.extend.processor.list();
  }
}

export default Source;
