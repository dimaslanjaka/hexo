import fs from 'fs';
import * as glob from 'glob';
import path from 'path';

const { readFile, writeFile } = fs.promises;
const globP = glob.glob;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const srcDir = path.join(__dirname, '../lib');
console.log(`Source directory: ${srcDir}`);

async function fixExports(file) {
  let content = await readFile(file, 'utf8');
  let changed = false;

  // If file already contains an `export default`, skip it
  // If the file already contains the compatibility block (module.exports or export default), skip
  if (/\bexport\s+default\b/.test(content) || /module\.exports\s*=/.test(content)) return;

  // Find all `export = Identifier;` occurrences and replace them with an ESM + CommonJS compatibility block
  const regex = /export\s*=\s*([A-Za-z0-9_$]+)\s*;/g;
  let match;
  let newContent = '';
  let lastIndex = 0;

  while ((match = regex.exec(content)) !== null) {
    const id = match[1];

    // If file already has `export default <id>` or `module.exports = <id>`, skip this match
    const escapedId = id.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
    const defaultRegex = new RegExp(`\\bexport\\s+default\\s+${escapedId}\\s*;`);
    const cjsRegex = new RegExp(`module\\.exports\\s*=\\s*${escapedId}`);
    if (defaultRegex.test(content) || cjsRegex.test(content)) continue;

    // copy content up to the `export =` statement
    newContent += content.slice(lastIndex, match.index);

    // insert compatibility block (preserve identifier)
    const block = `// For ESM compatibility\nexport default ${id};\n// For CommonJS compatibility\nif (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {\n  module.exports = ${id};\n  // For ESM compatibility\n  module.exports.default = ${id};\n}\n`;

    newContent += block;
    changed = true;
    lastIndex = match.index + match[0].length;
  }

  if (changed) {
    newContent += content.slice(lastIndex);
    await writeFile(file, newContent, 'utf8');
    console.log(`✔ Replaced export = with compatibility block in: ${file}`);
  }
}

async function run() {
  const pattern = path.join(srcDir, '**', '*.ts').replace(/\\/g, '/');
  const files = await globP(pattern, { nodir: true });

  for (const file of files) {
    await fixExports(file);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
