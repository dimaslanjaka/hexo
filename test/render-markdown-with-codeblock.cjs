const Hexo = require('../dist/cjs/hexo');
const hashFiles = require('./util/hashFiles.cjs');
const fs = require('fs');

const hexo = new Hexo(__dirname, { silent: false, debug: true });

// Expose helper to Hexo's Nunjucks tag environment
// hexo.extend.helper.register('hashFiles', hashFiles.bind(hexo));
// Expose helper to Hexo's Nunjucks tag environment
hexo.extend.tag.env.addGlobal('hashFiles', hashFiles.bind(hexo));

hexo.extend.tag.env.addGlobal('debugArgs', (...args) => {
  return JSON.stringify(args);
});

const main = async () => {
  await hexo.init();
  // await hexo.loadPlugin(require.resolve('hexo-renderer-marked')); // <-- without this will caught error
  await hexo.scaffold.set('post', [
    '---',
    'title: {{ title }}',
    'date: {{ date }}',
    'tags:',
    '---'
  ].join('\n'));
  await hexo.scaffold.set('draft', [
    '---',
    'title: {{ title }}',
    'tags:',
    '---'
  ].join('\n'));

  const defaultCfg = JSON.parse(JSON.stringify(hexo.config));
  hexo.config = JSON.parse(JSON.stringify(defaultCfg));

  const content = `
---
title: nunjucks in markdown
date: 2023-10-04T09:26:26+07:00
updated: 2023-10-04T09:26:26+07:00
---
## below is pretext

inline codeblock \`build-{{ hashFiles('render-markdown-with-codeblock.cjs') }}\`
{{ debugArgs('render-markdown-with-codeblock.cjs') }}

\`\`\`js
const varx = \`build-\${{ hashFiles('fixtures') }}\`
\`\`\`

\`\`\`ts
const xvar = \`build-\${{ hashFiles('fixtures') }}\`
\`\`\`

\`\`\`
const var = \`build-\${{ hashFiles('fixtures') }}\`
\`\`\`

## below is meta info

- published: {{ page.date }}
- modified: {{ page.updated }}
  `;

  const data = await hexo.post.render(null, {
    content,
    engine: 'markdown'
  });
  const file = 'tmp/test/render-markdown-with-codeblock.md';
  fs.mkdirSync('tmp/test', { recursive: true });
  fs.writeFileSync(file, data.content.trim(), 'utf-8');
  console.log(`Rendered content:\n${data.content.trim()}`);
  console.log(`Rendered content written to ${file}`);
};

main();
