import { basename, extname, join } from 'path';
import { htmlTag, url_for } from 'hexo-util';
import type Hexo from '../../hexo/index.js';

const rCaptionTitleFile = /(.*)?(?:\s+|^)(\/*\S+)/;
const rLang = /\s*lang:(\w+)/i;
const rFrom = /\s*from:(\d+)/i;
const rTo = /\s*to:(\d+)/i;

/**
* Include code tag
*
* Syntax:
*   {% include_code [title] [lang:language] path/to/file %}
*/
const include_code_default = (ctx: Hexo) => function includeCodeTag(args: string[]) {
  let codeDir = ctx.config.code_dir;
  let arg = args.join(' ');

    // Add trailing slash to codeDir
    if (!codeDir.endsWith('/')) codeDir += '/';

    let lang = '';
    arg = arg.replace(rLang, (match, _lang) => {
      lang = _lang;
      return '';
    });
  }
  return `<pre><code>${code}</code></pre>`;
};

// For ESM compatibility
export default include_code_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = include_code_default;
  // For ESM compatibility
  module.exports.default = include_code_default;
}
