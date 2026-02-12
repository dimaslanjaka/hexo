import Box from '../box/index.js';
import type Hexo from './index.js';

class Source extends Box {
  constructor(ctx: Hexo) {
    super(ctx, ctx.source_dir);

    this.processors = ctx.extend.processor.list();
  }
}

// For ESM compatibility
export default Source;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = Source;
  // For ESM compatibility
  module.exports.default = Source;
}

