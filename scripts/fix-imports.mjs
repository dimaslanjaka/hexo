import fs from 'fs';
import * as glob from 'glob';
import path from 'path';

const { readFile, writeFile, stat } = fs.promises;
const globP = glob.glob;
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const srcDir = path.join(__dirname, '../lib');
console.log(`Source directory: ${srcDir}`);

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function computeReplacement(file, spec) {
  // handle exact current/parent directory specifiers
  if (spec === '.' || spec === './') return './index';
  if (spec === '..' || spec === '../') return '../index';

  // don't touch imports that already point to index
  if (/\/index(\.[^/]+)?$/.test(spec)) return null;

  // if spec has an extension, skip
  if (path.extname(spec)) return null;

  const trimmed = spec.replace(/\/$/, '');
  const resolved = path.resolve(path.dirname(file), trimmed);

  try {
    const s = await stat(resolved);
    if (s.isDirectory()) return (trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed) + '/index';
  } catch (err) {
    // target doesn't exist — skip
  }

  return null;
}

async function fixImportsInFile(file) {
  let content = await readFile(file, 'utf8');
  let replacements = new Map();

  // Patterns to find relative module specifiers used in imports/exports/requires
  const patterns = [/import\s+(?:[\w*{}\s,]+\s+from\s+)?(['"])(\.[^'"\)]+)\1/g];

  // include export from and require separately to reliably capture specifiers
  patterns.push(/export\s+(?:[\w*{}\s,]+\s+from\s+)?(['"])(\.[^'"\)]+)\1/g);
  patterns.push(/require\(\s*(['"])(\.[^'"\)]+)\1\s*\)/g);

  for (const pat of patterns) {
    for (const m of content.matchAll(pat)) {
      const spec = m[2];
      if (!spec || replacements.has(spec)) continue;
      const newSpec = await computeReplacement(file, spec);
      if (newSpec && newSpec !== spec) replacements.set(spec, newSpec);
    }
  }

  if (replacements.size === 0) return;

  // apply all replacements (replace quoted occurrences)
  for (const [oldSpec, newSpec] of replacements.entries()) {
    const rx = new RegExp('([\'"])' + escapeRegExp(oldSpec) + '\\1', 'g');
    content = content.replace(rx, (m, q) => `${q}${newSpec}${q}`);
  }

  await writeFile(file, content, 'utf8');
  console.log(`✔ Fixed imports in: ${file}`);
}

async function run() {
  const pattern = path.join(srcDir, '**', '*.{ts,js,mjs,cjs}').replace(/\\/g, '/');
  const files = await globP(pattern, { nodir: true });

  for (const file of files) {
    await fixImportsInFile(file);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
