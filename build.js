import fs from 'fs';
import path from 'path';
import { build, defineConfig } from 'tsup';
import { fileURLToPath } from 'url';
import packageJson from './package.json' with { type: 'json' };
import { fixImportsPlugin, writeFilePlugin } from 'esbuild-fix-imports-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, 'dist');
const debugLogPath = path.join(__dirname, 'build-debug.log');

// Clear previous debug log
if (fs.existsSync(debugLogPath)) {
  fs.unlinkSync(debugLogPath);
}

// Simple logger that logs to console and appends to debug log file
const log = function (...args) {
  console.log(...args);
  fs.appendFileSync(debugLogPath, args.join(' ') + '\n');
};

/**
 * Packages that should be bundled (not marked as external)
 * @type {string[]}
 */
const bundledPackages = [];

/**
 * All dependencies except those in bundledPackages will be marked as external
 * @type {string[]}
 */
const externalDeps = [...Object.keys(packageJson.dependencies), ...Object.keys(packageJson.devDependencies)].filter(
  (pkgName) => !bundledPackages.includes(pkgName)
);

/**
 * Build the project using tsup with custom config
 * @returns {Promise<void>}
 */
function buildTsup() {
  const baseConfig = defineConfig({
    define: {
      __VERSION__: JSON.stringify(packageJson.version)
    },
    entry: ['lib/**/*.ts'],
    splitting: true,
    treeshake: true,
    bundle: false,
    shims: true,
    sourcemap: true,
    removeNodeProtocol: true,
    clean: true,
    // skipNodeModulesBundle: true,
    external: externalDeps,
    format: ['esm', 'cjs'],
    dts: true,
    outDir: 'dist',
    outExtension({ format }) {
      switch (format) {
        case 'cjs':
          return { js: '.cjs', dts: '.d.cts' };
        default:
          return { js: '.js', dts: '.d.ts' };
      }
    },
    esbuildPlugins: [
      fixImportsPlugin(), // Fix import extensions
      writeFilePlugin() // Write files to disk once the processing is done
    ],
    plugins: [
      {
        name: 'fix-import-extensions',
        renderChunk(_, chunk) {
          // add extension .js to local imports/exports in esm, and change .js to .cjs in cjs
          let code = chunk.code.replace(
            /(from|import|require\()\s*['"](.*?)(?<!\.js|\.mjs|\.cjs|\.json)['"]\s*(\)?)/g,
            (match, p1, p2, p3) => {
              // Only modify relative paths (./ or ../)
              if (p2.startsWith('.')) {
                const dirFile = path.dirname(chunk.path);
                const filename = path.basename(p2);
                const fullImportPath = path.resolve(dirFile, p2);
                // Here we would normally check if it's a directory or file
                // For simplicity, let's assume it's always a file for this example
                const isDir = fs.existsSync(fullImportPath) && fs.lstatSync(fullImportPath).isDirectory();
                const indexCandidates = ['index.js', 'index.mjs', 'index.cjs', 'index.ts', 'index.tsx'];
                log(`Processing import in ${filename} (${p2} from ${dirFile}): ${match} (isDir: ${isDir})`);
                if (isDir) {
                  // directory import -> point to index file
                  return `${p1} '${p2}/index.js' ${p3}`;
                }
                return `${p1} '${p2}.js' ${p3}`;
              }
              return match;
            }
          );
          if (this.format === 'cjs') {
            // replace `from '...js'` with `from '...cjs'` for cjs imports & exports
            code = code.replace(/from ['"](.*)\.js['"]/g, "from '$1.cjs'");
            // replace `require('...js')` with `require('...cjs')`
            code = code.replace(/require\(['"](.*)\.js['"]\)/g, "require('$1.cjs')");
            // replace `loadRequire('...js')` with `loadRequire('...cjs')`
            code = code.replace(/loadRequire\(['"](.*)\.js['"]\)/g, "loadRequire('$1.cjs')");
            return { code };
          } else {
            // for esm, just return the modified code
            return { code };
          }
        }
      }
    ]
  });
  return build(baseConfig);
}

// Run the build process
buildTsup();
