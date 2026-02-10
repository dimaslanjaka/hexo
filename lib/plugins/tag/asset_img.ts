import img from './img.js';
import { encodeURL } from 'hexo-util';
import type Hexo from '../../hexo/index.js';

/**
 * Asset image tag
 *
 * Syntax:
 *   {% asset_img [class names] slug [width] [height] [title text [alt text]]%}
 */
const assetImg = (ctx: Hexo) => {
  const PostAsset = ctx.model('PostAsset');

  return function assetImgTag(args: string[]) {
    const len = args.length;

    // Find image URL
    for (let i = 0; i < len; i++) {
      const asset = PostAsset.findOne({ post: this._id, slug: args[i] });
      if (asset) {
        // img tag will call url_for so no need to call it here
        args[i] = encodeURL(new URL(asset.path, ctx.config.url).pathname);
        return img(ctx)(args);
      }
    }
  };
};

export default assetImg;
