'use strict';

const Hexo = require('../dist/hexo');
const hexo = new Hexo(__dirname, { silent: false, debug: true });

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

inline codeblock \`build-\${{ hashFiles('package-lock.json') }}\`

\`\`\`js
const varx = \`build-\${{ hashFiles('package-lock.json') }}\`
\`\`\`

\`\`\`ts
const xvar = \`build-\${{ hashFiles('package-lock.json') }}\`
\`\`\`

\`\`\`
const var = \`build-\${{ hashFiles('package-lock.json') }}\`
\`\`\`

## below is meta info

- published: {{ page.date }}
- modified: {{ page.updated }}
  `;

  const data = await hexo.post.render(null, {
    content,
    engine: 'markdown'
  });
  console.log(data.content.trim());
};

main();
