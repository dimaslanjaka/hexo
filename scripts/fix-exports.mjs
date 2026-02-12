import fs from 'fs';
import * as glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const { readFile, writeFile } = fs.promises;
const globP = glob.glob;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../lib');
console.log(`Source directory: ${srcDir}`);

async function fixExports(file) {
  let content = await readFile(file, 'utf8');
  const sanitizedFileBase = (() => {
    const base = path.basename(file, path.extname(file));
    if (base === 'index') return path.basename(path.dirname(file));
    return base;
  })()
    .replace(/[^a-zA-Z0-9_$]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
  const replacement = (id) =>
    `// For ESM compatibility\nexport default ${id};\n// For CommonJS compatibility\nif (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {\n  module.exports = ${id};\n  // For ESM compatibility\n  module.exports.default = ${id};\n}\n`;

  // If file already contains a top-level `export default` or `module.exports =`, skip it.
  // Use line-anchored checks to avoid matching occurrences inside comments.
  if (/^\s*export\s+default\b/m.test(content) || /^\s*module\.exports\s*=/m.test(content)) return;

  // If the file contains `export =`, replace it with const declaration and add compatibility exports
  // use non-global regex for test (global regex is stateful)
  if (/\bexport\s*=\s*/m.test(content)) {
    const id = 'default_export_' + sanitizedFileBase;
    // use global replace to change all occurrences
    content = content.replace(/\bexport\s*=\s*/g, `const ${id} = `);
    content += '\n' + replacement(id);
    await writeFile(file, content, 'utf8');
    console.log(`Fixed exports in ${file}`);
  }
}

async function run() {
  const pattern = path.join(srcDir, '**', '*.ts').replace(/\\/g, '/');
  const files = await globP(pattern, { nodir: true });
  console.log(
    `is moment.ts found in ${srcDir}?`,
    files.some((f) => f.endsWith('moment.ts'))
  );

  for (const file of files) {
    await fixExports(file);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
