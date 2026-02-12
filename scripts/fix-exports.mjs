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

  // Find all `export = ...;` occurrences (identifier, function/class expression, or other expressions)
  const regex = /export\s*=\s*(?:([A-Za-z0-9_$]+)\s*;|((?:function|class)[\s\S]*?\})\s*;|(.+?)\s*;)/g;
  let match;
  let newContent = '';
  let lastIndex = 0;

  while ((match = regex.exec(content)) !== null) {
    const identifier = match[1];
    const funcOrClass = match[2];
    const otherExpr = match[3];

    // Determine whether we captured a simple identifier or an expression
    let isIdentifier = false;
    let id = null;
    let expr = null;

    if (identifier) {
      isIdentifier = true;
      id = identifier;
    } else if (funcOrClass) {
      expr = funcOrClass.trim();
    } else if (otherExpr) {
      expr = otherExpr.trim();
    } else {
      continue;
    }

    // For identifier case, skip if already exported
    if (isIdentifier) {
      const escapedId = id.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
      const defaultRegex = new RegExp(`\\bexport\\s+default\\s+${escapedId}\\s*;`);
      const cjsRegex = new RegExp(`module\\.exports\\s*=\\s*${escapedId}`);
      if (defaultRegex.test(content) || cjsRegex.test(content)) {
        lastIndex = match.index + match[0].length;
        continue;
      }

      // copy content up to the `export =` statement
      newContent += content.slice(lastIndex, match.index);

      // insert compatibility block (preserve identifier)
      const block = `// For ESM compatibility\nexport default ${id};\n// For CommonJS compatibility\nif (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {\n  module.exports = ${id};\n  // For ESM compatibility\n  module.exports.default = ${id};\n}\n`;

      newContent += block;
      changed = true;
      lastIndex = match.index + match[0].length;
      continue;
    }

    // For expression case (anonymous function/class or other expressions), generate a unique const name
    const base = path.basename(file, '.ts').replace(/[^A-Za-z0-9_$]/g, '_');
    let constName = `${base}_default`;
    let i = 0;
    while (
      content.includes(` ${constName} `) ||
      content.includes(`const ${constName}`) ||
      newContent.includes(constName)
    ) {
      i += 1;
      constName = `${base}_default_${i}`;
    }

    // copy content up to the `export =` statement
    newContent += content.slice(lastIndex, match.index);

    // create a const for the expression and insert compatibility block
    const expression = expr;
    const block = `const ${constName} = ${expression};\n// For ESM compatibility\nexport default ${constName};\n// For CommonJS compatibility\nif (typeof module != 'undefined' && typeof module.exports === 'object' && module.exports !== null) {\n  module.exports = ${constName};\n  // For ESM compatibility\n  module.exports.default = ${constName};\n}\n`;

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
