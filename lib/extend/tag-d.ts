import type { NodeJSLikeCallback } from '../types';
export interface ExtendedTagProperty {

  /**
   * current absolute file source
   */
  full_source: string;
}

/**
 * asynchronous callback - shortcode tag
 * @example
 * // to get args type
 * type args = Parameters<Parameters<typeof hexo.extend.tag.register>[1]>[0];
 * // to get content type
 * type content = Parameters<Parameters<typeof hexo.extend.tag.register>[1]>[1];
 */
export type TagFunction =
  | ((this: ExtendedTagProperty, arg: string) => string)
  | ((this: ExtendedTagProperty, ...args: any[]) => string)
  | ((this: ExtendedTagProperty, args: any[], content: string) => string)
  | ((args: any[], content: string, callback?: NodeJSLikeCallback<any>) => string | PromiseLike<string>);

/**
 * asynchronous callback - shortcode tag
 * @example
 * // to get args type
 * type args = Parameters<Parameters<typeof hexo.extend.tag.register>[1]>[0];
 * // to get content type
 * type content = Parameters<Parameters<typeof hexo.extend.tag.register>[1]>[1];
 */
export type AsyncTagFunction =
  | ((this: ExtendedTagProperty, content: string) => PromiseLike<string> | Promise<string>)
  | ((this: ExtendedTagProperty, ...args: any[]) => PromiseLike<string> | Promise<string>)
  | ((this: ExtendedTagProperty, args: any[], content: string) => PromiseLike<string> | Promise<string>);
