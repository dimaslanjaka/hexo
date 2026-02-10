import type Hexo from '../../hexo/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Normalize CJS + ESM default exports
const load = <T = any>(path: string): T => {
  const mod = require(path);
  return (mod && mod.default) || mod;
};

export default (ctx: Hexo) => {
  const { helper } = ctx.extend;

  const date = load<any>('./date.js');
  helper.register('date', date.date);
  helper.register('date_xml', date.date_xml);
  helper.register('time', date.time);
  helper.register('full_date', date.full_date);
  helper.register('relative_date', date.relative_date);
  helper.register('time_tag', date.time_tag);
  helper.register('moment', date.moment);

  helper.register('search_form', load('./search_form.js'));

  const { strip_html, trim, titlecase, word_wrap, truncate, escape_html } = load<any>('./format.js');

  helper.register('strip_html', strip_html);
  helper.register('trim', trim);
  helper.register('titlecase', titlecase);
  helper.register('word_wrap', word_wrap);
  helper.register('truncate', truncate);
  helper.register('escape_html', escape_html);

  helper.register('fragment_cache', load<any>('./fragment_cache.js')(ctx));

  helper.register('gravatar', load('./gravatar.js'));

  const is = load<any>('./is.js');
  helper.register('is_current', is.current);
  helper.register('is_home', is.home);
  helper.register('is_home_first_page', is.home_first_page);
  helper.register('is_post', is.post);
  helper.register('is_page', is.page);
  helper.register('is_archive', is.archive);
  helper.register('is_year', is.year);
  helper.register('is_month', is.month);
  helper.register('is_category', is.category);
  helper.register('is_tag', is.tag);

  helper.register('list_archives', load('./list_archives.js'));
  helper.register('list_categories', load('./list_categories.js'));
  helper.register('list_tags', load('./list_tags.js'));
  helper.register('list_posts', load('./list_posts.js'));

  helper.register('meta_generator', load('./meta_generator.js'));
  helper.register('open_graph', load('./open_graph.js'));
  helper.register('number_format', load('./number_format.js'));
  helper.register('paginator', load('./paginator.js'));

  helper.register('partial', load<any>('./partial.js')(ctx));

  helper.register('markdown', load('./markdown.js'));
  helper.register('render', load<any>('./render.js')(ctx));

  helper.register('css', load('./css.js'));
  helper.register('js', load('./js.js'));
  helper.register('link_to', load('./link_to.js'));
  helper.register('mail_to', load('./mail_to.js'));
  helper.register('image_tag', load('./image_tag.js'));
  helper.register('favicon_tag', load('./favicon_tag.js'));
  helper.register('feed_tag', load('./feed_tag.js'));

  const tagcloud = load('./tagcloud.js');
  helper.register('tagcloud', tagcloud);
  helper.register('tag_cloud', tagcloud);

  helper.register('toc', load('./toc.js'));

  helper.register('relative_url', load('./relative_url.js'));
  helper.register('url_for', load('./url_for.js'));
  helper.register('full_url_for', load('./full_url_for.js'));

  const debug = load<any>('./debug.js');
  helper.register('inspect', debug.inspectObject);
  helper.register('log', debug.log);
};
