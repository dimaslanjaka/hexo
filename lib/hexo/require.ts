// Provide a global require for ESM environments using createRequire
import { createRequire } from 'module';

// Only define global require if it doesn't exist (for ESM)
if (typeof require === 'undefined') {
  // @ts-ignore: TypeScript does not recognize 'require' on global in ESM, but this is safe in Node.js
  global.require = createRequire(import.meta.url);
}
