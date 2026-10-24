/* eslint-disable n/no-process-exit */
const fs = require('node:fs/promises');
const path = require('node:path');
const { glob } = require('glob');

const { readFile, writeFile } = fs;

function replaceInContent(content) {
  let changed = false;

  // Match relative module specifiers ending in .js.
  // Supports import/export, require(), and dynamic import().
  const pattern
    = /((?:\bfrom\s*|\bimport\s*|\brequire\s*\(\s*))(['"])((?:\.\.?\/)[^'"]+)\.js\2/g;

  content = content.replace(pattern, (match, prefix, quote, specifier) => {
    changed = true;
    return `${prefix}${quote}${specifier}${quote}`;
  });

  return { content, changed };
}

async function run() {
  const root = path.resolve(__dirname, '..');
  const pattern = path.join(root, 'lib', '**', '*.ts').replace(/\\/g, '/');
  const files = await glob(pattern, { nodir: true });

  let count = 0;

  for (const file of files) {
    const original = await readFile(file, 'utf8');
    const { content, changed } = replaceInContent(original);

    if (changed) {
      await writeFile(file, content, 'utf8');
      console.log('Updated', path.relative(root, file));
      count++;
    }
  }

  console.log(`Done. Updated ${count} file(s).`);
}

run().catch(err => {
  console.error(err);
  process.exit(2);
});
