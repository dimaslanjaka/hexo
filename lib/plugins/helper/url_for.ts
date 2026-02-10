import { url_for } from 'hexo-util';
import type { LocalsType } from '../../types.js';

interface Options {
  relative?: boolean
}

export default function(this: LocalsType, path: string, options: Options = {}) {
  return url_for.call(this, path, options);
}
