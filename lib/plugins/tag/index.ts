import moize from 'moize';
import type Hexo from '../../hexo/index.js';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Normalize CJS + ESM default exports
const load = <T = any>(path: string): T => {
  const mod = require(path);
  return (mod && mod.default) || mod;
};

export default (ctx: Hexo) => {
  const { tag } = ctx.extend;

  const blockquote = load<any>('./blockquote.js')(ctx);
  tag.register('quote', blockquote, true);
  tag.register('blockquote', blockquote, true);

  const code = load<any>('./code.js')(ctx);
  tag.register('code', code, true);
  tag.register('codeblock', code, true);

  tag.register('iframe', load('./iframe.js'));

  const img = load<any>('./img.js')(ctx);
  tag.register('img', img);
  tag.register('image', img);

  const includeCode = load<any>('./include_code.js')(ctx);
  tag.register('include_code', includeCode, { async: true });
  tag.register('include-code', includeCode, { async: true });

  const link = load('./link.js');
  tag.register('a', link);
  tag.register('link', link);
  tag.register('anchor', link);

  tag.register('post_path', load<any>('./post_path.js')(ctx));
  tag.register('post_link', load<any>('./post_link.js')(ctx));

  tag.register('asset_path', load<any>('./asset_path.js')(ctx));
  tag.register('asset_link', load<any>('./asset_link.js')(ctx));

  const assetImg = load<any>('./asset_img.js')(ctx);
  tag.register('asset_img', assetImg);
  tag.register('asset_image', assetImg);

  tag.register('pullquote', load<any>('./pullquote.js')(ctx), true);

  tag.register('url_for', load<any>('./url_for.js')(ctx));
  tag.register('full_url_for', load<any>('./full_url_for.js')(ctx));
};

// Use WeakMap to track different ctx (in case there is any)
const moized = new WeakMap<Hexo, any>();

export function postFindOneFactory(ctx: Hexo) {
  if (moized.has(ctx)) {
    return moized.get(ctx);
  }

  const moizedPostFindOne = moize(createPostFindOne(ctx), {
    isDeepEqual: true,
    maxSize: 20
  });

  moized.set(ctx, moizedPostFindOne);
  return moizedPostFindOne;
}

function createPostFindOne(ctx: Hexo) {
  const Post = ctx.model('Post');
  return Post.findOne.bind(Post);
}
