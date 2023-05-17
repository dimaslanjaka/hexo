import Promise from 'bluebird';
import { parse as yfm } from 'hexo-front-matter';
import { dirname, extname, join } from 'path';

const assignIn = (target, ...sources) => {
  const length = sources.length;

  if (length < 1 || target == null) return target;
  for (let i = 0; i < length; i++) {
    const source = sources[i];

    for (const key in source) {
      target[key] = source[key];
    }
  }
  return target;
};

class Options {
  layout?: any;
}

class View {
  public path: any;
  public source: any;
  public _theme: any;
  public data: ReturnType<typeof yfm>;
  public _compiled: any;
  public _compiledSync: any;
  public _helper: any;
  public _render: import('../hexo')['render'];
  public layout: any;
  public _content: any;

  constructor(path: string, data: string | ReturnType<typeof yfm>) {
    this.path = path;
    this.source = join(this._theme.base, 'layout', path);
    this.data = typeof data === 'string' ? yfm(data, {}) : data;

    this._precompile();
  }

  render(options: Options | ((...args: any[]) => any) = {}, callback: (...args: any[]) => any) {
    if (!callback && typeof options === 'function') {
      callback = options;
      options = {};
    }
    const { data } = this;
    // eslint-disable-next-line no-extra-parens
    const { layout = (options as Options).layout } = data;
    const locals = this._buildLocals(options);

    return this._compiled(this._bindHelpers(locals))
      .then(result => {
        if (result == null || !layout) return result;

        const layoutView = this._resolveLayout(layout);
        if (!layoutView) return result;

        const layoutLocals = {
          ...locals,
          body: result,
          layout: false
        };

        return layoutView.render(layoutLocals, callback);
      })
      .asCallback(callback);
  }

  renderSync(options: Options = {}) {
    const { data } = this;
    const { layout = options.layout } = data;
    const locals = this._buildLocals(options);
    const result = this._compiledSync(this._bindHelpers(locals));

    if (result == null || !layout) return result;

    const layoutView = this._resolveLayout(layout);
    if (!layoutView) return result;

    const layoutLocals = {
      ...locals,
      body: result,
      layout: false
    };

    return layoutView.renderSync(layoutLocals);
  }

  _buildLocals(locals: Options | ((...args: any[]) => any)) {
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { layout, _content, ...data } = this.data;
    return assignIn({}, locals, data, {
      filename: this.source
    });
  }

  _bindHelpers(locals: Record<string, any>) {
    const helpers = this._helper.list();
    const keys = Object.keys(helpers);

    for (const key of keys) {
      locals[key] = helpers[key].bind(locals);
    }

    return locals;
  }

  _resolveLayout(name: string) {
    // Relative path
    const layoutPath = join(dirname(this.path), name);
    let layoutView = this._theme.getView(layoutPath);

    if (layoutView && layoutView.source !== this.source) return layoutView;

    // Absolute path
    layoutView = this._theme.getView(name);
    if (layoutView && layoutView.source !== this.source) return layoutView;
  }

  _precompile() {
    const render = this._render;
    const ctx = render.context;
    const ext = extname(this.path);
    const renderer = render.getRenderer(ext);
    const data = {
      path: this.source,
      text: this.data._content
    };

    function buildFilterArguments(result: string) {
      const output = render.getOutput(ext) || ext;
      return [
        `after_render:${output}`,
        result,
        {
          context: ctx,
          args: [data]
        }
      ];
    }

    if (renderer && typeof renderer.compile === 'function') {
      const compiled = renderer.compile(data) as (locals: Record<string, any>) => string;

      this._compiledSync = (locals: Record<string, any>) => {
        const result = compiled(locals);
        return ctx.execFilterSync(...buildFilterArguments(result));
      };

      this._compiled = (locals: Record<string, any>) =>
        Promise.resolve(compiled(locals)).then(result => ctx.execFilter(...buildFilterArguments(result)));
    } else {
      this._compiledSync = (locals: Record<string, any>) => render.renderSync(data, locals);

      this._compiled = (locals: { (...args: any[]): any; [key: string]: any; highlight?: boolean }) =>
        render.render(data, locals);
    }
  }
}

export = View;
