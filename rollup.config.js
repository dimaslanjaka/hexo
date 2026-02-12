import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import * as glob from 'glob';
import url from 'node:url';
import path from 'path';
import {
  chunkFileNamesWithExt,
  entryFileNamesWithExt,
  externalPackagesFilter,
  packageJson,
  tsconfig
} from './rollup.utils.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { author, version } = packageJson;

const year = new Date().getFullYear();

/**
 * @type {import('rollup').RollupOptions['input']}
 */
const nodeInputs = glob.globSync('tmp/dist/**/*.{js,cjs,mjs}', {
  posix: true,
  ignore: tsconfig.exclude.concat(
    '**/*.runner.*',
    '**/*.explicit.*',
    '**/*.test.*',
    '**/*.builder.*',
    '**/*.spec.*',
    '*browser*'
  )
});

const basePlugins = [
  // Resolve node_modules packages
  resolve({ preferBuiltins: true }),
  // Support importing JSON files
  json(),
  // Ensure Rollup converts CommonJS compiled files (e.g. tmp/) and
  // correctly handles mixed ESM/CJS so `default` imports work.
  commonjs({
    include: ['**/node_modules/**', '**/tmp/**'],
    transformMixedEsModules: true,
    requireReturnsDefault: 'namespace', // or 'auto'
    extensions: ['.js', '.cjs', '.mjs', '.ts']
  })
];

/**
 * @type {import('rollup').RollupOptions}
 */
const _partials = {
  input: nodeInputs,
  output: [
    // bundle mjs as ESM (only)
    {
      dir: 'dist/esm',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      preserveModulesRoot: 'tmp/dist',
      entryFileNames: entryFileNamesWithExt('mjs'),
      chunkFileNames: chunkFileNamesWithExt('mjs')
    }
  ],
  plugins: basePlugins,
  external: externalPackagesFilter // External dependencies package name to exclude from bundle
  // external(id) {
  //   const bundledPackages = ['hexo-fs', 'hexo-util', 'hexo-log', 'warehouse'];
  //   if (bundledPackages.some((not) => id.startsWith(not))) {
  //     return false; // Not external, so it will be bundled
  //   }
  //   return externalPackagesFilter(id);
  // }
};

export default _partials;
