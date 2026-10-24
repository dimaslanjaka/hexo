import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['lib/**/*.ts'],
    format: ['esm'],
    outDir: 'dist/esm',
    tsconfig: 'tsconfig.build.json',
    bundle: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: true
  },
  {
    entry: ['lib/**/*.ts'],
    format: ['cjs'],
    outDir: 'dist/cjs',
    tsconfig: 'tsconfig.build.json',
    bundle: false,
    splitting: false,
    sourcemap: true,
    clean: true,
    dts: false
  }
]);
