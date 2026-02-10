import type { HighlightOptions } from '../../extend/syntax_highlight.js';
import type Hexo from '../../hexo/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Lazy-loaded prism highlight
let prismHighlight: typeof import('hexo-util').prismHighlight;
let escapeHTML: typeof import('hexo-util').escapeHTML;

// Normalize CJS + ESM default exports
const load = <T = any>(id: string): T => {
  const mod = require(id);
  return (mod && mod.default) || mod;
};

export default function (this: Hexo, code: string, options: HighlightOptions) {
  const prismjsCfg = this.config.prismjs || ({} as any);
  const line_threshold = options.line_threshold || prismjsCfg.line_threshold || 0;

  const shouldUseLineNumbers =
    typeof options.line_number === 'undefined' ? prismjsCfg.line_number : options.line_number;

  const surpassesLineThreshold = options.lines_length > line_threshold;
  const lineNumber = shouldUseLineNumbers && surpassesLineThreshold;

  const prismjsOptions = {
    caption: options.caption,
    firstLine: options.firstLine as number,
    isPreprocess: prismjsCfg.preprocess,
    lang: options.lang,
    lineNumber,
    mark: Array.isArray(options.mark) ? String(options.mark) : options.mark,
    tab: prismjsCfg.tab_replace,
    stripIndent: prismjsCfg.strip_indent
  };

  if (!prismHighlight || !escapeHTML) {
    const util = load<typeof import('hexo-util')>('hexo-util');
    prismHighlight = util.prismHighlight;
    escapeHTML = util.escapeHTML;
  }

  if (Array.isArray(prismjsCfg.exclude_languages) && prismjsCfg.exclude_languages.includes(prismjsOptions.lang)) {
    // Only wrap with <pre><code class="lang"></code></pre>
    return `<pre><code class="${prismjsOptions.lang}">${escapeHTML(code)}</code></pre>`;
  }

  return prismHighlight(code, prismjsOptions);
}
