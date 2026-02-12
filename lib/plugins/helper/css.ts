import { htmlTag, url_for } from 'hexo-util';
import moize from 'moize';
import type { LocalsType } from '../../types.js';

let relative_link = true;
function cssHelper(this: LocalsType, ...args: any[]) {
  let result = '\n';

  relative_link = this.config.relative_link;

  args.flat(Infinity).forEach((item) => {
    if (typeof item === 'string' || item instanceof String) {
      let path = item;
      if (!path.endsWith('.css')) {
        path += '.css';
      }
      result += `<link rel="stylesheet" href="${url_for.call(this, path)}">\n`;
    } else {
      const newItem = {
        rel: 'stylesheet',
        ...item
      };
      // Custom attributes
      newItem.href = url_for.call(this, newItem.href);
      if (!newItem.href.endsWith('.css')) newItem.href += '.css';
      result += htmlTag('link', newItem) + '\n';
    }
  });
  return result;
}

const default_export_css = moize(cssHelper, {
  maxSize: 10,
  isDeepEqual: true,
  updateCacheForKey() {
    return relative_link;
  }
});

// For ESM compatibility
export default default_export_css;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = default_export_css;
  // For ESM compatibility
  module.exports.default = default_export_css;
}
