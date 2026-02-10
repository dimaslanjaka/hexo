import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const { readFile, writeFile } = fs.promises;
const globP = glob;

function addJsExtToSpecifier(spec) {
  if (!spec.startsWith('./') && !spec.startsWith('../')) return spec;
  // ignore if already ends with .js or other assets
  if (/\.(js|mjs|cjs|json|css|png|jpg|svg|node)$/.test(spec)) return spec;
  // replace .ts extension with .js or append .js
  if (spec.endsWith('.ts')) return spec.slice(0, -3) + '.js';
  return spec + '.js';
}

function replaceInContent(content) {
  let changed = false;

  // import ... from '...'
  content = content.replace(
    /((?:^|[\n\r])\s*(?:import|export)[^'"\n\r]*?\sfrom\s*)(['"])(\.\.?(?:\/[\w@\-\.\/]*?))(?:\.ts)?\2/gm,
    (m, p1, q, spec) => {
      const ns = addJsExtToSpecifier(spec);
      if (ns !== spec) {
        changed = true;
        return `${p1}${q}${ns}${q}`;
      }
      return m;
    }
  );

  // import '...'
  content = content.replace(
    /((?:^|[\n\r])\s*import\s*)(['"])(\.\.?(?:\/[\w@\-\.\/]*?))(?:\.ts)?\2/gm,
    (m, p1, q, spec) => {
      const ns = addJsExtToSpecifier(spec);
      if (ns !== spec) {
        changed = true;
        return `${p1}${q}${ns}${q}`;
      }
      return m;
    }
  );

  // require('...')
  content = content.replace(
    /(require\(\s*)(['"])(\.\.?(?:\/[\w@\-\.\/]*?))(?:\.ts)?\2(\s*\))/gm,
    (m, p1, q, spec, p4) => {
      const ns = addJsExtToSpecifier(spec);
      if (ns !== spec) {
        changed = true;
        return `${p1}${q}${ns}${q}${p4}`;
      }
      return m;
    }
  );

  // dynamic import('...')
  content = content.replace(
    /(import\(\s*)(['"])(\.\.?(?:\/[\w@\-\.\/]*?))(?:\.ts)?\2(\s*\))/gm,
    (m, p1, q, spec, p4) => {
      const ns = addJsExtToSpecifier(spec);
      if (ns !== spec) {
        changed = true;
        return `${p1}${q}${ns}${q}${p4}`;
      }
      return m;
    }
  );

  return { content, changed };
}

async function run() {
  const root = path.resolve(new URL(import.meta.url).pathname, '..', '..');
  const pattern = path.join(root, 'lib', '**', '*.ts').replace(/\\/g, '/');
  const files = await globP(pattern, { nodir: true });
  let count = 0;

  for (const file of files) {
    const str = await readFile(file, 'utf8');
    const { content, changed } = replaceInContent(str);
    if (changed) {
      await writeFile(file, content, 'utf8');
      console.log('Updated', file.replace(root + path.sep, ''));
      count++;
    }
  }

  console.log(`Done. Updated ${count} file(s).`);
}

run().catch((err) => {
  console.error(err);
  process.exit(2);
});
