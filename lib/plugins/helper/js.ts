import { htmlTag, url_for } from 'hexo-util';
import moize from 'moize';
import type { LocalsType } from '../../types.js';

let relative_link = true;
function jsHelper(this: LocalsType, ...args: any[]) {
  let result = '\n';

  relative_link = this.config.relative_link;

  args.flat(Infinity).forEach((item) => {
    if (typeof item === 'string' || item instanceof String) {
      let path = item;
      if (!path.endsWith('.js')) {
        path += '.js';
      }
      result += `<script src="${url_for.call(this, path)}"></script>\n`;
    } else {
      const newItem = { ...item };
      // Custom attributes
      newItem.src = url_for.call(this, newItem.src);
      if (!newItem.src.endsWith('.js')) newItem.src += '.js';
      result += htmlTag('script', newItem, '') + '\n';
    }
  });
  return result;
}

const default_export_js = moize(jsHelper, {
  maxSize: 10,
  isDeepEqual: true,
  updateCacheForKey() {
    return relative_link;
  }
});

// For ESM compatibility
export default default_export_js;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = default_export_js;
  // For ESM compatibility
  module.exports.default = default_export_js;
}
