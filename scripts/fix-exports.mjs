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

  // Find top-level `export =` lines followed by function/class/object and replace only the `export =` with `const <name> =`
  const exportRegex = /^\s*export\s*=\s*(?=(function|class|\{))/gm;
  let match2;
  const transforms = [];

  while ((match2 = exportRegex.exec(content)) !== null) {
    const start = match2.index;
    const afterEq = exportRegex.lastIndex;

    // determine const name based on filename
    const base = path.basename(file, '.ts').replace(/[^A-Za-z0-9_$]/g, '_');
    let constName = `${base}_default`;
    let idx = 0;
    while (
      content.includes(` const ${constName}`) ||
      content.includes(` ${constName} `) ||
      transforms.some((t) => t.constName === constName)
    ) {
      idx += 1;
      constName = `${base}_default_${idx}`;
    }

    // replacement text for the export token (keep original indentation)
    const lineStart = content.lastIndexOf('\n', start) + 1;
    const indent = content.slice(lineStart, start).match(/^\s*/)[0];
    const replacement = `${indent}const ${constName} = `;

    transforms.push({ start, afterEq, replacement, constName });
  }

  if (transforms.length === 0) return;

  // apply transforms (from last to first to keep indexes valid)
  transforms.sort((a, b) => b.start - a.start);
  let fixed = content;
  const appendBlocks = [];
  for (const t of transforms) {
    // replace the `export =` (from start up to the next non-space char before the expression) with replacement
    // find end of the `export =` token region
    const exportTokenEnd = t.afterEq;
    fixed = fixed.slice(0, t.start) + t.replacement + fixed.slice(exportTokenEnd);
    appendBlocks.push(
      `// For ESM compatibility\nexport default ${t.constName};\n// For CommonJS compatibility\nif (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {\n  module.exports = ${t.constName};\n  // For ESM compatibility\n  module.exports.default = ${t.constName};\n}\n`
    );
  }

  // Append compatibility blocks at end of file
  fixed = fixed.replace(/\s+$/g, '') + '\n\n' + appendBlocks.join('\n');

  await writeFile(file, fixed, 'utf8');
  console.log(`✔ Converted export = expressions to const + compatibility block in: ${file}`);
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
