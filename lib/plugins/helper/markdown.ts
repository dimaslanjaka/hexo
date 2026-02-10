import type { LocalsType } from '../../types.js';

function markdownHelper(this: LocalsType, text: string, options?: any) {
  return this.render(text, 'markdown', options);
}

export default markdownHelper;
