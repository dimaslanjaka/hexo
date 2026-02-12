import { url_for } from 'hexo-util';
import type Hexo from '../../hexo/index';

/**
 * Asset path tag
 *
 * Syntax:
 *   {% asset_path slug %}
 */
const asset_path_default = (ctx: Hexo) => {
  const PostAsset = ctx.model('PostAsset');

  return function assetPathTag(args: string[]) {
    const slug = args.shift();
    if (!slug) return;

    const asset = PostAsset.findOne({post: this._id, slug});
    if (!asset) return;

    const path = url_for.call(ctx, asset.path);

    return path;
  };
};

// For ESM compatibility
export default asset_path_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = asset_path_default;
  // For ESM compatibility
  module.exports.default = asset_path_default;
}
