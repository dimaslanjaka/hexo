const fs = require('node:fs');
const path = require('node:path');
const { fileURLToPath, pathToFileURL } = require('node:url');
// eslint-disable-next-line n/no-unsupported-features/node-builtins
const { registerHooks } = require('node:module');
const pc = require('picocolors');

// assign global __dirname for tsx to work properly
// globalThis.__dirname ??= path.join(process.cwd(), 'tmp/test');

const log = {
  info: message => console.error(
    `${pc.gray(new Date().toISOString())} ${pc.green('[resolve-ts]')} ${message}`
  ),
  warn: message => console.error(
    `${pc.gray(new Date().toISOString())} ${pc.yellow('[resolve-ts]')} ${message}`
  ),
  error: (message, error) => {
    console.error(
      `${pc.gray(new Date().toISOString())} ${pc.red('[resolve-ts]')} ${pc.red(message)}`
    );

    if (error) {
      console.error(pc.red(error.stack || error.message || String(error)));
    }
  }
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (
      !specifier.startsWith('.')
      || !specifier.endsWith('.js')
      || !context.parentURL?.startsWith('file:')
    ) {
      return nextResolve(specifier, context);
    }

    try {
      const parentPath = fileURLToPath(context.parentURL);
      const basePath = path.resolve(path.dirname(parentPath), specifier.slice(0, -3));
      const candidates = [
        `${basePath}.ts`,
        path.join(basePath, 'index.ts')
      ];

      for (const tsPath of candidates) {
        if (fs.existsSync(tsPath)) {
          log.info(`${specifier} -> ${tsPath}`);

          return {
            url: pathToFileURL(tsPath).href,
            shortCircuit: true
          };
        }
      }

      return nextResolve(specifier, context);
    } catch (error) {
      log.error(
        `Failed to resolve "${specifier}" from "${context.parentURL}"`,
        error
      );
      throw error;
    }
  }
});
