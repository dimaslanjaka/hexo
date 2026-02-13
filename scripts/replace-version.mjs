import fs from 'fs-extra';
import path from 'upath';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

async function exists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, cb) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, cb);
    else if (e.isFile() && p.endsWith('.js')) await cb(p);
  }
}

async function run() {
  const cwd = process.cwd();
  const target = path.join(__dirname, '../dist');

  if (!(await exists(target))) {
    console.error(`Target directory not found: ${target}`);
    process.exit(1);
  }

  // Read package.json from current package to get version
  const pkgPath = path.join(cwd, 'package.json');
  if (!(await exists(pkgPath))) {
    console.error(`package.json not found in cwd: ${cwd}`);
    process.exit(1);
  }

  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  const version = String(pkg.version || '');

  async function processFile(file) {
    const content = await fs.readFile(file, 'utf8');
    if (!content.includes('__HEXO_VERSION__')) return;
    const newContent = content.split('__HEXO_VERSION__').join(version);
    if (newContent !== content) {
      await fs.writeFile(file, newContent, 'utf8');
      console.log(`Patched: ${path.relative(cwd, file)} (replaced __HEXO_VERSION__ -> ${version})`);
    }
  }

  await walk(target, processFile);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
