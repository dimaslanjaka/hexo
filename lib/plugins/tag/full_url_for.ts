import { full_url_for, htmlTag } from 'hexo-util';
import type Hexo from '../../hexo/index.js';

/**
 * Full url for tag
 *
 * Syntax:
 *   {% full_url_for text path %}
 */
const fullUrlFor = (ctx: Hexo) => {
  return function fullUrlForTag([text, path]) {
    const url = full_url_for.call(ctx, path);
    const attrs = {
      href: url
    };
    return htmlTag('a', attrs, text);
  };
};

export default fullUrlFor;
