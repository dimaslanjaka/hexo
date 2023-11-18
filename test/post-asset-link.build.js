process.cwd = () => __dirname + '/hexo-theme-test';

const Hexo = require('../packages/hexo/dist/hexo');

const hexo = new Hexo(process.cwd(), { debug: true });
hexo.init().then(function () {
  hexo.load().then(function () {
    hexo.call('clean', {}, function () {
      hexo.post.render('source/_posts/post-asset-link.md').then(function (rendered) {
        console.log(rendered.content);
      });
      hexo.post.render('source/_posts/post-asset-link.md', {}, function (err, rendered) {
        console.log(rendered.content);
      });
    });
  });
});
