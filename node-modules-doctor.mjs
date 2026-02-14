import fs from 'fs-extra';
import path from 'upath';
import { fileURLToPath } from 'url';
import * as glob from 'glob';
import { exec } from 'child_process';
import { spawnAsync } from 'cross-spawn';

// Ensure the console supports UTF-8 encoding
exec('chcp 65001');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDirectoryPath = path.resolve(__dirname, 'packages');
const repoRoot = path.resolve(__dirname);

const packages = fs.readdirSync(packageDirectoryPath);
const ignores = [
  '**/.git',
  '**/node_modules/.cache',
  '**/node_modules/.pnpm',
  '**/node_modules/.yarn',
  '**/node_modules/.yarn-cache'
];
const shortPath = (p) => {
  try {
    const rel = path.relative(process.cwd(), p) || '.';
    return path.toUnix(rel);
  } catch {
    return p;
  }
};

/**
 * Recursively finds and optionally processes all node_modules directories in the given root directory.
 * @param {string} rootDir - The root directory to search from.
 * @param {(file: string) => void} [callback] - Optional callback for each found file.
 * @returns {Promise<void>} Resolves when search is complete.
 */
export async function deleteNodeModulesDirs(rootDir, callback) {
  return new Promise((resolve, reject) => {
    let pattern = '**/node_modules/**/*';
    if (packages.length > 0) {
      pattern = packages.map((p) => `**/node_modules/${p}/**/*`);
    }
    glob
      .stream(pattern, { absolute: true, nocase: true, nodir: false, dot: true, ignore: ignores, cwd: rootDir })
      .on('data', async (f) => {
        // Skip non node_modules directories
        if (!f.includes('node_modules')) {
          return;
        }
        // console.log(`🔍 ${f}`);
        if (typeof callback === 'function') {
          callback(f);
        }
      })
      .on('end', () => resolve(undefined))
      .on('error', (err) => reject(err));
  });
}

/**
 * Finds workspace dependencies by searching for installed workspace packages in node_modules.
 * @param {string} rootDir - The root directory to search from.
 * @returns {Promise<void>} Resolves when search is complete.
 */
export async function findWorkspaceDeps(rootDir) {
  const parseWorkspaces = () =>
    spawnAsync('yarn', ['workspaces', 'list', '--no-private', '--json'], {
      cwd: process.cwd()
    }).then((o) =>
      o.stdout
        .split(/\r?\n/gm)
        .filter((str) => str.length > 4)
        .map((str) => {
          /** @type {{ location: string; name: string }} */
          const parse = JSON.parse(str.trim());
          parse.location = path.join(__dirname, parse.location);
          return parse;
        })
        .filter((o) => fs.existsSync(o.location))
    );
  const find = (packageName, callback) =>
    new Promise((resolve, reject) => {
      const pattern = `**/node_modules/${packageName}`;
      glob
        .stream(pattern, { absolute: true, nocase: true, nodir: false, dot: true, cwd: rootDir })
        .on('data', (f) => {
          callback?.(f);
        })
        .on('end', () => resolve(undefined))
        .on('error', (err) => reject(err));
    });
  for (const pkg of await parseWorkspaces()) {
    console.log(`🚀 Scanning for ${pkg.name} symlinked to ${shortPath(pkg.location)}`);
    // Remove lockfiles in workspace packages (but do not touch the repo root)
    try {
      const pkgDir = path.resolve(pkg.location);
      if (pkgDir !== repoRoot && pkgDir !== process.cwd()) {
        const yarnLock = path.join(pkgDir, 'yarn.lock');
        const pkgLock = path.join(pkgDir, 'package-lock.json');
        [yarnLock, pkgLock].forEach((lockfile) => {
          if (fs.existsSync(lockfile)) {
            console.log(`🧹\tRemoving lockfile: ${shortPath(lockfile)}`);
            deletePathSync(lockfile);
          }
        });
      }
    } catch (err) {
      console.error('❌\tFailed to remove workspace lockfiles for', shortPath(pkg.location), err);
    }
    const callback = (f) => {
      f = path.toUnix(f);
      if (f.includes('node_modules')) {
        let isSymlink = false;
        try {
          isSymlink = fs.lstatSync(f).isSymbolicLink();
        } catch {
          // ignore error, treat as not symlink
        }
        // console.log(`🔗 Dependency found: ${f}${isSymlink ? ' (symlink)' : ''}`);
        if (!isSymlink) {
          console.warn(`⚠️\t${shortPath(f)} is not symlinked to ${shortPath(pkg.location)}`);
          // remove the non-symlinked node_modules directory
          deletePathSync(f);
          // replace it with a symlink
          try {
            fs.ensureSymlinkSync(pkg.location, f, 'junction');
            console.log(`✅\tCreated symlink for ${pkg.name} at ${shortPath(f)}`);
          } catch (err) {
            console.error(`❌\tFailed to create symlink for ${pkg.name} at ${shortPath(f)}:`, err);
          }
        }
      }
    };
    await find(pkg.name, callback);
  }
}

/** Sequential deletion queue for deletePath */
const deleteQueueArr = [];
let processingQueue = false;

/**
 * A no-operation function.
 * @returns {void}
 */
function noop() {
  // No operation performed
}

/**
 * Processes the deletion queue sequentially, removing files/directories listed in deleteQueueArr.
 * @returns {Promise<void>} Resolves when the queue is empty.
 */
async function processDeleteQueue() {
  if (processingQueue) return;
  processingQueue = true;
  while (deleteQueueArr.length > 0) {
    const file = deleteQueueArr.shift();
    if (!file || !fs.existsSync(file)) {
      console.warn(`⚠️\t${shortPath(file)} does not exist or is not a valid path.`);
      continue;
    }
    if (fs.existsSync(file)) {
      console.log(`🗑️\t${shortPath(file)}`);
      await fs.remove(file).catch(noop);
      console.log(`✅\t${shortPath(file)}`);
    }
  }
  processingQueue = false;
}

/**
 * Adds a file or directory to the deletion queue and starts processing.
 * @param {string} file - The file or directory path to delete.
 * @returns {void}
 */
export function deletePath(file) {
  deleteQueueArr.push(file);
  processDeleteQueue();
}

export function deletePathSync(file) {
  if (!file || !fs.existsSync(file)) {
    console.warn(`⚠️\t${shortPath(file)} does not exist or is not a valid path.`);
    return;
  }
  if (fs.existsSync(file)) {
    console.log(`🗑️\t${shortPath(file)}`);
    fs.removeSync(file);
    console.log(`✅\t${shortPath(file)}`);
  }
}

(async () => {
  try {
    // console.log(`🚀 Scanning for node_modules in: ${root}`);
    // await deleteNodeModulesDirs(root, deletePath);
    // console.log('🏁 All node_modules folders deleted.');
    await findWorkspaceDeps(packageDirectoryPath);
  } catch (err) {
    console.error('💥\tError:', err);
  }
})();
