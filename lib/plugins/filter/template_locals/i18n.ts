import { Pattern } from 'hexo-util';
import type Hexo from '../../../hexo';
import type { LocalsType } from '../../../types';

function i18nLocalsFilter(this: Hexo, locals: LocalsType): void {
  const { i18n } = this.theme;
  const { config } = this;
  const i18nDir = config.i18n_dir;
  const { page } = locals;
  let lang = page.lang || page.language;
  const i18nLanguages = i18n.list();
  const i18nConfigLanguages = i18n.languages;

  if (!lang) {
    const pattern = new Pattern(`${i18nDir}/*path`);
    // fix hexo-util/dist/pattern.d.ts is not object
    // fix(TS2322): Type 'unknown' is not assignable to type 'string'.
    const data = pattern.match(locals.path) as Record<string, any>;

    if (
      typeof data !== 'undefined'
      && !Array.isArray(data)
      && typeof data !== 'boolean'
      && data.lang
      && i18nLanguages.includes(data.lang)
    ) {
      lang = data.lang;
      page.canonical_path = data.path;
    } else {
      // i18n.languages is always an array with at least one argument ('default')
      lang = i18nConfigLanguages[0];
    }
  }

  page.lang = lang;
  page.canonical_path = page.canonical_path || locals.path;

  const languages = [...new Set([].concat(lang, i18nConfigLanguages, i18nLanguages).filter(Boolean))];

  locals.__ = i18n.__(languages);
  locals._p = i18n._p(languages);
}

export = i18nLocalsFilter;
