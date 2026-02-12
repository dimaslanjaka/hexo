import { htmlTag, url_for } from 'hexo-util';
import type { LocalsType } from '../../types';

interface Options {
  src?: string;
  alt?: string;
  class?: string | string[];
}

interface Attrs {
  src?: string;
  class?: string;
  [key: string]: string | undefined;
}

function imageTagHelper(this: LocalsType, path: string, options: Options = {}) {
  const attrs = Object.assign({
    src: url_for.call(this, path) as string
  }, options);

  if (attrs.class && Array.isArray(attrs.class)) {
    attrs.class = attrs.class.join(' ');
  }

  return htmlTag('img', attrs as Attrs);
}

// For ESM compatibility
export default imageTagHelper;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = imageTagHelper;
  // For ESM compatibility
  module.exports.default = imageTagHelper;
}

