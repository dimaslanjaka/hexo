import warehouse from 'warehouse';
import type Hexo from '../hexo';
import { PostTagSchema } from '../types';
const post_tag_default = (ctx: Hexo) => {
  const PostTag = new warehouse.Schema<PostTagSchema>({
    post_id: {type: warehouse.Schema.Types.CUID, ref: 'Post'},
    tag_id: {type: warehouse.Schema.Types.CUID, ref: 'Tag'}
  });

  PostTag.pre('save', data => {
    ctx._binaryRelationIndex.post_tag.removeHook(data);
    return data;
  });

  PostTag.post('save', data => {
    ctx._binaryRelationIndex.post_tag.saveHook(data);
    return data;
  });

  PostTag.pre('remove', data => {
    ctx._binaryRelationIndex.post_tag.removeHook(data);
    return data;
  });

  return PostTag;
};

// For ESM compatibility
export default post_tag_default;
// For CommonJS compatibility
if (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = post_tag_default;
  // For ESM compatibility
  module.exports.default = post_tag_default;
}
