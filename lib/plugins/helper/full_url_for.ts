
import { full_url_for } from 'hexo-util';
import type { LocalsType } from '../../types.js';

export default function(this: LocalsType, path?: string) {
  return full_url_for.call(this, path);
}
