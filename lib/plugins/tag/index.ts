import moize from 'moize';
import type Hexo from '../../hexo/index.js';

export default (ctx: Hexo) => {
  const { tag } = ctx.extend;

  const blockquote = require('./blockquote.js')(ctx);

  tag.register('quote', blockquote, true);
  tag.register('blockquote', blockquote, true);

  const code = require('./code.js')(ctx);

  tag.register('code', code, true);
  tag.register('codeblock', code, true);

  tag.register('iframe', require('./iframe.js'));

  const img = require('./img.js')(ctx);

  tag.register('img', img);
  tag.register('image', img);

  const includeCode = require('./include_code.js')(ctx);

  tag.register('include_code', includeCode, {async: true});
  tag.register('include-code', includeCode, {async: true});

  const link = require('./link.js');

  tag.register('a', link);
  tag.register('link', link);
  tag.register('anchor', link);

  tag.register('post_path', require('./post_path.js')(ctx));
  tag.register('post_link', require('./post_link.js')(ctx));

  tag.register('asset_path', require('./asset_path.js')(ctx));
  tag.register('asset_link', require('./asset_link.js')(ctx));

  const assetImg = require('./asset_img.js')(ctx);

  tag.register('asset_img', assetImg);
  tag.register('asset_image', assetImg);

  tag.register('pullquote', require('./pullquote.js')(ctx), true);

  tag.register('url_for', require('./url_for.js')(ctx));
  tag.register('full_url_for', require('./full_url_for.js')(ctx));
};

// Use WeakMap to track different ctx (in case there is any)
const moized = new WeakMap();

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
