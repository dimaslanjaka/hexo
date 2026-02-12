import { htmlTag } from 'hexo-util';

/**
* Iframe tag
*
* Syntax:
*   {% iframe url [width] [height] %}
*/

function iframeTag(args: string[]) {
  const src = args[0];
  const width = args[1] && args[1] !== 'default' ? args[1] : '100%';
  const height = args[2] && args[2] !== 'default' ? args[2] : '300';

  const attrs = {
    src,
    width,
    height,
    frameborder: '0',
    loading: 'lazy',
    allowfullscreen: true
  };

  return htmlTag('iframe', attrs, '');
}

// For ESM compatibility
export default iframeTag;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = iframeTag;
  // For ESM compatibility
  module.exports.default = iframeTag;
}

