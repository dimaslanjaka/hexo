import type { LocalsType } from '../../types.js';

function metaGeneratorHelper(this: LocalsType) {
  return `<meta name="generator" content="Hexo ${this.env.version}">`;
}

export default metaGeneratorHelper;
