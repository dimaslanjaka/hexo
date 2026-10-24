const { createHash } = require('node:crypto');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { globSync } = require('glob');

/**
 * Hash files matching glob patterns relative to the Hexo base directory.
 *
 * @this {import('../../dist/cjs/hexo')} Hexo
 * @param {string|string[]} pattern Glob pattern or an array of glob patterns.
 * @param {string} [algorithm='sha256'] Hash algorithm supported by node:crypto.
 * @returns {string} File paths and their hashes joined by `--`, or a message if no files match.
 */
function hashFiles(pattern, algorithm = 'sha256') {
  console.log('arguments:', [...arguments]);
  console.log('pattern:', pattern);
  console.log('this.base_dir:', this.base_dir);

  if (typeof pattern !== 'string' && !Array.isArray(pattern)) {
    pattern = String(pattern);
  }

  const patterns = Array.isArray(pattern) ? pattern : [pattern];

  const files = [
    ...new Set(
      patterns.flatMap(item =>
        globSync(item, {
          cwd: this.base_dir,
          nodir: true
        })
      )
    )
  ].sort();

  if (files.length === 0) {
    return `No files found matching pattern(s): ${patterns.join(', ')} cwd=${this.base_dir}`;
  }

  return files
    .map(file => {
      const hash = createHash(algorithm)
        .update(readFileSync(path.resolve(this.base_dir, file)))
        .digest('hex');

      return `${file}:${hash}`;
    })
    .join('--');
}

module.exports = hashFiles;
