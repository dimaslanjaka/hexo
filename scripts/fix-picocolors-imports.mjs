import fs from 'fs';
import * as glob from 'glob';
import path from 'path';

const { readFile, writeFile } = fs.promises;
const globP = glob.glob;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const srcDir = path.join(__dirname, '../lib');
console.log(`Source directory: ${srcDir}`);

async function fixPicocolorsImports(file) {
  let content = await readFile(file, 'utf8');
  let changed = false;

  const usedImports = new Set();

  // default import → namespace import
  content = content.replace(/import\s+picocolors\s+from\s+(['"])picocolors\1/g, () => {
    changed = true;
    return `import * as picocolors from 'picocolors'`;
  });

  // named imports → namespace import
  content = content.replace(/import\s+\{\s*([^}]+)\s*\}\s+from\s+(['"])picocolors\2/g, (_, imports) => {
    changed = true;
    imports
      .split(',')
      .map((i) => i.trim())
      .forEach((i) => usedImports.add(i));

    return `import * as picocolors from 'picocolors'`;
  });

  // rewrite usages AFTER imports are handled
  if (usedImports.size) {
    for (const imp of usedImports) {
      const escaped = imp.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escaped}\\s*\\(`, 'g');

      const matches = content.match(regex);
      if (matches) {
        console.log(`Found ${matches.length} usage(s) of ${imp} in ${file}`);
        content = content.replace(regex, `picocolors.${imp}(`);
        changed = true;
      }
    }
  }

  if (changed) {
    await writeFile(file, content, 'utf8');
    console.log(`✔ Fixed picocolors import in: ${file}`);
  }
}

async function run() {
  const pattern = path.join(srcDir, '**', '*.ts').replace(/\\/g, '/');
  const files = await globP(pattern, { nodir: true });

  for (const file of files) {
    await fixPicocolorsImports(file);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
