'use strict';

import Tag from '../../../lib/extend/tag';
import { htmlTag } from 'hexo-util';

/**
 * Vimeo tag
 *
 * Syntax:
 *   {% vimeo video_id %}
 */
export function vimeoTag(id: string) {
  const src = 'https://player.vimeo.com/video/' + id;

  const iframeTag = htmlTag(
    'iframe',
    {
      src,
      frameborder: '0',
      loading: 'lazy',
      allowfullscreen: true
    },
    ''
  );

  return htmlTag('div', { class: 'video-container' }, iframeTag, false);
}

const classTag = new Tag();
// vimeoTag function type must valid
classTag.register('vimeo', vimeoTag);
