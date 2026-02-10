import moment from 'moment';
import Hexo from '../../lib/hexo/index.js';
import postPermalinkFilter from '../../lib/plugins/filter/post_permalink.js';
import path from 'node:path';
import picocolors from 'picocolors';
import * as hexoUtil from 'hexo-util';

type PostPermalinkFilterParams = Parameters<typeof postPermalinkFilter>;
type PostPermalinkFilterReturn = ReturnType<typeof postPermalinkFilter>;

const hexo = new Hexo(path.resolve(hexoUtil.getDirname(), '../fixtures'));
const postPermalink: (...args: PostPermalinkFilterParams) => PostPermalinkFilterReturn = postPermalinkFilter.bind(hexo);
const permalinkPatterns = [':filepath.html'];
const permalinkDefaults = [{}, { lang: 'en' }];

(async () => {
  await hexo.init();
  const Post = hexo.model('Post');

  const testDate = moment('2014-01-02');

  for (const permalinkPattern of permalinkPatterns) {
    for (const permalinkDefault of permalinkDefaults) {
      hexo.config.permalink = permalinkPattern;
      hexo.config.permalink_defaults = permalinkDefault;

      const inserted = await Post.insert([
        {
          source: 'my-new-post.md',
          slug: 'my-new-post',
          title: 'My New Post1'
        },
        {
          source: 'my-new-fr-post.md',
          slug: 'my-new-fr-post',
          title: 'My New Post2',
          lang: 'fr'
        },
        {
          source: 'post-file-name.md',
          slug: 'post-file-name',
          date: testDate
        }
      ]);

      const colors = [picocolors.green, picocolors.blue, picocolors.yellow, picocolors.magenta, picocolors.cyan];

      for (let i = 0; i < inserted.length; i++) {
        const post = inserted[i]; // Ensure post is defined for each iteration
        if (!post) {
          console.log(picocolors.red(`Post at index ${i} is undefined or null`));
          continue; // Skip to the next iteration if post is not valid
        }

        const colorFn = colors[i % colors.length]; // Cycle through the colors array

        console.log(`Permalink Pattern: ${colorFn(permalinkPattern)}`);
        console.log(`Permalink Defaults: ${colorFn(JSON.stringify(permalinkDefault))}`);
        console.log(`Post Source: ${colorFn(post.source)}`);
        console.log(`Permalink: ${colorFn(postPermalink(post as any))}`);
        console.log('---------------------');
      }
    }
  }
})();
