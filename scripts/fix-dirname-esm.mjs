import fs from 'fs-extra';
import path from 'upath';

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

const dirnameSnippet = `import NodePath from 'node:path';\nimport NodeUrl from 'node:url';\nconst __dirname = NodePath.dirname(NodeUrl.fileURLToPath(import.meta.url));\n\n`;

async function processFile(file) {
  const content = await fs.readFile(file, 'utf8');

  if (!content.includes('__dirname')) return;

  const hasNodePathImport = /import\s+NodePath\s+from\s+['"]node:path['"]/m.test(content);
  const hasNodeUrlImport = /import\s+NodeUrl\s+from\s+['"]node:url['"]/m.test(content);
  const hasConstDirname = /const\s+__dirname\s*=/.test(content);

  let newContent = content;

  const importsString = "import NodePath from 'node:path';\nimport NodeUrl from 'node:url';\n";
  const constString = 'const __dirname = NodePath.dirname(NodeUrl.fileURLToPath(import.meta.url));\n\n';

  // Insert imports at top (after shebang) if missing
  if (!hasNodePathImport && !hasNodeUrlImport) {
    const shebangEnd = newContent.startsWith('#!') ? newContent.indexOf('\n') + 1 : 0;
    newContent = newContent.slice(0, shebangEnd) + importsString + newContent.slice(shebangEnd);
  }

  // Insert const __dirname after the last import if missing
  if (!hasConstDirname) {
    let lastImportMatch = null;
    const importRegex = /(^import[\s\S]*?;)/gm;
    for (const m of newContent.matchAll(importRegex)) lastImportMatch = m;

    if (lastImportMatch && typeof lastImportMatch.index === 'number') {
      const insertPos = lastImportMatch.index + lastImportMatch[0].length;
      newContent = newContent.slice(0, insertPos) + '\n' + constString + newContent.slice(insertPos);
    } else {
      // No imports found — put const after shebang or at top
      const shebangEnd = newContent.startsWith('#!') ? newContent.indexOf('\n') + 1 : 0;
      newContent = newContent.slice(0, shebangEnd) + constString + newContent.slice(shebangEnd);
    }
  }

  if (newContent !== content) {
    await fs.writeFile(file, newContent, 'utf8');
    console.log(`Patched: ${file}`);
  }
}

async function run() {
  const cwd = process.cwd();
  const target = path.join(cwd, 'dist', 'esm');

  if (!(await exists(target))) {
    console.error(`Target directory not found: ${target}`);
    process.exit(1);
  }

  await walk(target, processFile);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
