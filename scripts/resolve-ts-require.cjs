const Module = require('module');
const fs = require('node:fs');
const path = require('node:path');

function findTsSource(request, parent) {
  if (!request.startsWith('.') || !request.endsWith('.js')) {
    return null;
  }

  const parentDir = parent?.filename ? path.dirname(parent.filename) : process.cwd();
  const base = path.resolve(parentDir, request.slice(0, -3));

  for (const candidate of [`${base}.ts`, path.join(base, 'index.ts')]) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function unwrapModuleExport(result) {
  if (
    result
    && typeof result === 'object'
    && result.__esModule
    && typeof result.default === 'function'
  ) {
    const keys = Object.keys(result).filter(key => key !== '__esModule');

    if (keys.length === 1 && keys[0] === 'default') {
      return result.default;
    }
  }

  return result;
}

function install() {
  if (Module.prototype.require.__hexoResolveTsInstalled) return;

  const previousResolveFilename = Module._resolveFilename;

  Module._resolveFilename = function(request, parent, isMain, options) {
    const tsSource = findTsSource(request, parent);

    if (tsSource) {
      return previousResolveFilename.call(this, tsSource, parent, isMain, options);
    }

    return previousResolveFilename.call(this, request, parent, isMain, options);
  };

  const originalRequire = Module.prototype.require;

  const requireWithResolvedTs = function(request) {
    return unwrapModuleExport(originalRequire.call(this, request));
  };

  requireWithResolvedTs.__hexoResolveTsInstalled = true;
  Module.prototype.require = requireWithResolvedTs;
}

module.exports = { install };
