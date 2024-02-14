import moize from 'moize';
import moment from 'moment-timezone';
const { isMoment } = moment;
import type { LocalsType } from '../../types';

const isDate = (value: moment.MomentInput | moment.Moment): boolean =>
  typeof value === 'object' && value instanceof Date && !isNaN(value.getTime());

function getMoment(date: moment.MomentInput | moment.Moment, lang: string, timezone: string): moment.Moment {
  if (date == null) date = moment();
  if (!isMoment(date)) date = moment(isDate(date) ? <Date>date : new Date(<string | number>date));
  lang = _toMomentLocale(lang);

  if (lang) date = date.locale(lang);
  if (timezone) date = date.tz(timezone);

  return date;
}

function toISOString(date: string | number | Date | moment.Moment) {
  if (date == null) {
    return new Date().toISOString();
  }

  if (date instanceof Date || isMoment(date)) {
    return date.toISOString();
  }

  return new Date(date as (string | number)).toISOString();
}

function dateHelper(this: LocalsType, date: moment.Moment | moment.MomentInput, format?: string) {
  const { config } = this;
  const moment = getMoment(date, getLanguage(this), config.timezone);
  return moment.format(format || config.date_format);
}

function timeHelper(this: LocalsType, date: moment.Moment | moment.MomentInput, format?: string) {
  const { config } = this;
  const moment = getMoment(date, getLanguage(this), config.timezone);
  return moment.format(format || config.time_format);
}

function fullDateHelper(this: LocalsType, date: moment.Moment | moment.MomentInput, format: string) {
  if (format) {
    const moment = getMoment(date, getLanguage(this), this.config.timezone);
    return moment.format(format);
  }

  return `${this.date(date)} ${this.time(date)}`;
}

function relativeDateHelper(this: LocalsType, date: moment.Moment | moment.MomentInput) {
  const { config } = this;
  const moment = getMoment(date, getLanguage(this), config.timezone);
  return moment.fromNow();
}

function timeTagHelper(this: LocalsType, date: string | number | Date | moment.Moment, format: string) {
  return `<time datetime="${toISOString(date)}">${this.date(date, format)}</time>`;
}

function getLanguage(ctx: LocalsType) {
  let configLang = Array.isArray(ctx.config.language) ? ctx.config.language[0] : 'en';
  if (!configLang || configLang.length === 0) configLang = 'en';
  return ctx.page.lang || ctx.page.language || configLang;
}

/**
 * Convert Hexo language code to Moment locale code.
 * examples:
 *   default => en
 *   zh-CN => zh-cn
 *
 * Moment defined locales: https://github.com/moment/moment/tree/master/locale
 */
function _toMomentLocale(lang: string) {
  if (lang === undefined) {
    return undefined;
  }

  // moment.locale('') equals moment.locale('en')
  // moment.locale(null) equals moment.locale('en')
  if (!lang || lang === 'en' || lang === 'default') {
    return 'en';
  }
  return lang.toLowerCase().replace('_', '-');
}

export { dateHelper as date, toISOString as date_xml, fullDateHelper as full_date, moment, relativeDateHelper as relative_date, timeHelper as time, timeTagHelper as time_tag };
export const toMomentLocale = moize.shallow(_toMomentLocale);
