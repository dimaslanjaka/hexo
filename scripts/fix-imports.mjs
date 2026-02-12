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
  // handle exact current/parent directory specifiers and always add .js
  if (spec === '.' || spec === './') return './index.js';
  if (spec === '..' || spec === '../') return '../index.js';

  // if spec already has an extension, skip
  if (path.extname(spec)) return null;

  const hasTrailingSlash = /\/$/.test(spec);
  const trimmed = spec.replace(/\/$/, '');
  const resolved = path.resolve(path.dirname(file), trimmed);

  try {
    const s = await stat(resolved);
    if (s.isDirectory()) return trimmed + '/index.js';
  } catch (err) {
    // target doesn't exist — continue and append .js below
  }

  // default: append .js to the specifier
  return trimmed + '.js';
}

async function fixImportsInFile(file) {
  let content = await readFile(file, 'utf8');
  const originalContent = content;
  // Append resolution-mode clause to `import type` warehouse imports (including
  // `warehouse/dist/...`) if missing, preserving any trailing semicolon/whitespace.
  // Use a negative lookahead so already-patched imports are not matched
  // (prevents double-appending).
  content = content.replace(
    /(import\s+type\s+[\s\S]*?from\s+(['"])(warehouse(?:\/dist\/[A-Za-z0-9_\/-]*)?)\2)(?!\s*with\s*\{)(\s*;?)/g,
    (m, imp, quote, spec, trailing) => {
      return `${imp} with { "resolution-mode": "import" }${trailing || ''}`;
    }
  );
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

  if (replacements.size === 0 && content === originalContent) return;

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
