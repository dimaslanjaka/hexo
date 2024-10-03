import { stripIndent } from 'hexo-util';
import { cyan, magenta, red, bold } from 'picocolors';
import { Environment } from 'nunjucks';
import Promise from 'bluebird';
import type { NodeJSLikeCallback } from '../types';
import { AsyncTagFunction, RegisterOptions, TagFunction } from './tag-d';

const rSwigRawFullBlock = /{% *raw *%}/;
const rCodeTag = /<code[^<>]*>[\s\S]+?<\/code>/g;
const escapeSwigTag = (str: string) => str.replace(/{/g, '&#123;').replace(/}/g, '&#125;');

class NunjucksTag {
  public tags: string[];
  public fn: TagFunction | AsyncTagFunction;

  constructor(name: string, fn: TagFunction | AsyncTagFunction) {
    this.tags = [name];
    this.fn = fn;
  }

  parse(parser, nodes, lexer) {
    const node = this._parseArgs(parser, nodes, lexer);

    return new nodes.CallExtension(this, 'run', node, []);
  }

  _parseArgs(parser, nodes, lexer) {
    const tag = parser.nextToken();
    const node = new nodes.NodeList(tag.lineno, tag.colno);
    const argarray = new nodes.Array(tag.lineno, tag.colno);

    let token;
    let argitem = '';

    while ((token = parser.nextToken(true))) {
      if (token.type === lexer.TOKEN_WHITESPACE || token.type === lexer.TOKEN_BLOCK_END) {
        if (argitem !== '') {
          const argnode = new nodes.Literal(tag.lineno, tag.colno, argitem.trim());
          argarray.addChild(argnode);
          argitem = '';
        }

        if (token.type === lexer.TOKEN_BLOCK_END) {
          break;
        }
      } else {
        argitem += token.value;
      }
    }

    node.addChild(argarray);

    return node;
  }

  run(context: any, args: any, _body: any, _callback: any) {
    return this._run(context, args, '');
  }

  _run(context, args, body): any {
    return Reflect.apply(this.fn, context.ctx, [args, body]);
  }
}

const trimBody = (body: () => any) => {
  return stripIndent(body()).replace(/^\n?|\n?$/g, '');
};

class NunjucksBlock extends NunjucksTag {
  parse(parser, nodes, lexer) {
    const node = this._parseArgs(parser, nodes, lexer);
    const body = this._parseBody(parser, nodes, lexer);

    return new nodes.CallExtension(this, 'run', node, [body]);
  }

  _parseBody(parser, _nodes?, _lexer?) {
    const body = parser.parseUntilBlocks(`end${this.tags[0]}`);

    parser.advanceAfterBlockEnd();
    return body;
  }

  run(context, args, body, _callback?) {
    return this._run(context, args, trimBody(body));
  }
}

class NunjucksAsyncTag extends NunjucksTag {
  parse(parser, nodes, lexer) {
    const node = this._parseArgs(parser, nodes, lexer);

    return new nodes.CallExtensionAsync(this, 'run', node, []);
  }

  run(context, args, callback) {
    return this._run(context, args, '').then(result => {
      callback(null, result);
    }, callback);
  }
}

class NunjucksAsyncBlock extends NunjucksBlock {
  parse(parser, nodes, lexer) {
    const node = this._parseArgs(parser, nodes, lexer);
    const body = this._parseBody(parser, nodes, lexer);

    return new nodes.CallExtensionAsync(this, 'run', node, [body]);
  }

  run(context, args, body, callback) {
    // enable async tag nesting
    body((err, result) => {
      // wrapper for trimBody expecting
      // body to be a function
      body = () => result || '';

      this._run(context, args, trimBody(body)).then(result => {
        callback(err, result);
      });
    });
  }
}

const getContextLineNums = (min: number, max: number, center: number, amplitude: number) => {
  const result = [];
  let lbound = Math.max(min, center - amplitude);
  const hbound = Math.min(max, center + amplitude);
  while (lbound <= hbound) result.push(lbound++);
  return result;
};

const LINES_OF_CONTEXT = 5;

const getContext = (lines: string[], errLine: number, location: string, type: string) => {
  const message = [
    location + ' ' + red(type),
    cyan('    =====               Context Dump               ====='),
    cyan('    === (line number probably different from source) ===')
  ];

  message.push(
    // get LINES_OF_CONTEXT lines surrounding `errLine`
    ...getContextLineNums(1, lines.length, errLine, LINES_OF_CONTEXT).map(lnNum => {
      const line = '  ' + lnNum + ' | ' + lines[lnNum - 1];
      if (lnNum === errLine) {
        return cyan(bold(line));
      }

      return cyan(line);
    })
  );
  message.push(cyan('    =====             Context Dump Ends            ====='));

  return message;
};

class NunjucksError extends Error {
  line?: number;
  location?: string;
  type?: string;
}

/**
 * Provide context for Nunjucks error
 * @param  {Error}    err Nunjucks error
 * @param  {string}   input string input for Nunjucks
 * @return {Error}    New error object with embedded context
 */
const formatNunjucksError = (err: Error, input: string, source = ''): Error => {
  err.message = err.message.replace('(unknown path)', source ? magenta(source) : '');

  const match = err.message.match(/Line (\d+), Column \d+/);
  if (!match) return err;
  const errLine = parseInt(match[1], 10);
  if (isNaN(errLine)) return err;

  // trim useless info from Nunjucks Error
  const splitted = err.message.split('\n');

  const e = new NunjucksError();
  e.name = 'Nunjucks Error';
  e.line = errLine;
  e.location = splitted[0];
  e.type = splitted[1].trim();
  e.message = getContext(input.split(/\r?\n/), errLine, e.location, e.type).join('\n');
  return e;
};

class Tag {
  public env: Environment;
  public source: string;

  constructor() {
    this.env = new Environment(null, {
      autoescape: false
    });
  }

  /**
   * register shortcode tag
   * @param name shortcode tag name
   * @param fn shortcode tag function (synchronous or asynchronous)
   */
  register(name: string, fn: TagFunction | AsyncTagFunction): void;

  /**
   * register shortcode tag with synchronous function callback
   * @param name shortcode tag name
   * @param fn synchronous function callback
   * @param endsOrOptions register options or use endblock
   */
  register(name: string, fn: TagFunction, endsOrOptions: RegisterOptions | boolean): void;

  /**
   * register shortcode tag with asynchronous function callback
   * @param name shortcode tag name
   * @param fn asynchronous function callback
   * @param endsOrOptions register options
   */
  register(name: string, fn: AsyncTagFunction, endsOrOptions: RegisterOptions | boolean): void;

  /**
   * register shortcode tag with synchronous function callback
   * @param name shortcode tag name
   * @param fn synchronous function callback
   * @param endsOrOptions register options
   */
  register(name: string, fn: TagFunction | AsyncTagFunction, endsOrOptions?: RegisterOptions | boolean): void {
    if (!name) throw new TypeError('name is required');
    if (typeof fn !== 'function') throw new TypeError('fn must be a function');

    if (endsOrOptions == null || typeof endsOrOptions === 'boolean') {
      endsOrOptions = { ends: endsOrOptions as boolean };
    }

    let tag: NunjucksTag;

    if (endsOrOptions.async) {
      let asyncFn: AsyncTagFunction;
      if (fn.length > 2) {
        asyncFn = Promise.promisify(fn);
      } else {
        asyncFn = Promise.method(fn);
      }

      if (endsOrOptions.ends) {
        tag = new NunjucksAsyncBlock(name, asyncFn);
      } else {
        tag = new NunjucksAsyncTag(name, asyncFn);
      }
    } else if (endsOrOptions.ends) {
      tag = new NunjucksBlock(name, fn);
    } else {
      tag = new NunjucksTag(name, fn);
    }

    this.env.addExtension(name, tag);
  }

  unregister(name: string): void {
    if (!name) throw new TypeError('name is required');

    const { env } = this;

    if (env.hasExtension(name)) env.removeExtension(name);
  }

  render(str: string): Promise<any>;
  render(str: string, callback: NodeJSLikeCallback<any>): Promise<any>;
  render(
    str: string,
    options: { source?: string; [key: string]: any },
    callback?: NodeJSLikeCallback<any>
  ): Promise<any>;
  render(
    str: string,
    options: { source?: string; [key: string]: any } | NodeJSLikeCallback<any> = {},
    callback?: NodeJSLikeCallback<any>
  ): Promise<any> {
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }

    // Get path of post from source
    const { source = '' } = options as { source?: string };

    return Promise.fromCallback(cb => {
      this.env.renderString(
        str.replace(rCodeTag, s => {
          // https://hexo.io/docs/tag-plugins#Raw
          // https://mozilla.github.io/nunjucks/templating.html#raw
          // Only escape code block when there is no raw tag included
          return s.match(rSwigRawFullBlock) ? s : escapeSwigTag(s);
        }),
        options,
        cb
      );
    })
      .catch(err => {
        return Promise.reject(formatNunjucksError(err, str, source));
      })
      .asCallback(callback);
  }
}

export = Tag;
