import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

/** @type {Record<string, string | {import: string, require: string, types: string}>} */
const defaultExports = {
  '.': {
    import: './dist/esm/hexo/index.js',
    require: './dist/cjs/hexo/index.js',
    types: './dist/esm/hexo/index.d.ts'
  },
  './package.json': './package.json'
};

const libDir = path.join(__dirname, '../lib');

/**
 * Add export entry for a file
 * @param {string} relPath
 */
function addExport(relPath) {
  const normalized = relPath.split(path.sep).join('/');
  const key = `./dist/${normalized.replace(/\.(ts|js)$/, '')}`;
  const imp = `./dist/esm/${normalized.replace(/\.ts$/, '.js')}`;
  const req = `./dist/cjs/${normalized.replace(/\.(ts|js)$/, '.js')}`;
  const types = `./dist/esm/${normalized.replace(/\.(ts|js)$/, '.d.ts')}`;

  defaultExports[key] = {
    import: imp,
    require: req,
    types: types
  };
}

/**
 * Add export entry for a directory
 * @param {string} relDir
 */
function addDirExport(relDir) {
  const normalized = relDir.split(path.sep).join('/');
  const key = `./dist/${normalized}`;
  const imp = `./dist/esm/${normalized}/index.js`;
  const req = `./dist/cjs/${normalized}/index.js`;
  const types = `./dist/esm/${normalized}/index.d.ts`;

  defaultExports[key] = {
    import: imp,
    require: req,
    types
  };
}

/**
 * Process a file or directory entry
 * @param {string} rel
 * @returns
 */
function processEntry(rel) {
  const full = path.join(libDir, rel);
  const stat = fs.statSync(full);
  const isDir = stat.isDirectory();

  if (isDir) {
    console.log(`Processing directory: lib/${rel} (contains ${fs.readdirSync(full).length} items)`);
  }

  if (isDir) {
    if (!path.basename(rel).startsWith('_') && !rel.includes('highlight_esm')) {
      fs.readdirSync(full).forEach((sub) => {
        processEntry(path.join(rel, sub));
      });

      // If the directory contains an index file, add a folder export pointing to it
      const indexTs = path.join(full, 'index.ts');
      const indexJs = path.join(full, 'index.js');
      if (fs.existsSync(indexTs) || fs.existsSync(indexJs)) {
        addDirExport(rel);
      }
    }
    return;
  }

  const base = path.basename(rel);
  if (!base.startsWith('_') && !rel.includes('highlight_esm')) {
    addExport(rel);
  }
}

fs.readdirSync(libDir).forEach((file) => {
  processEntry(file);
});

// Sort the exports to ensure consistent output
const sortedExports = Object.keys(defaultExports)
  .sort()
  .reduce((obj, key) => {
    obj[key] = defaultExports[key];
    return obj;
  }, /** @type {Record<string, string | {import: string, require: string, types: string}>} */ ({}));

packageJson.exports = sortedExports;

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
