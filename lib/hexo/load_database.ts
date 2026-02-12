import { exists, unlink } from 'hexo-fs';
import Promise from 'bluebird';
import type Hexo from './index.js';
const load_database_default = (ctx: Hexo): Promise<void> => {
  if (ctx._dbLoaded) return Promise.resolve();

  const db = ctx.database;
  const { path } = db.options;
  const { log } = ctx;

  return exists(path).then(exist => {
    if (!exist) return;

    log.debug('Loading database.');
    return db.load();
  }).then(() => {
    ctx._dbLoaded = true;
  }).catch(() => {
    log.error('Database load failed. Deleting database.');
    return unlink(path);
  });
};

// For ESM compatibility
export default load_database_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = load_database_default;
  // For ESM compatibility
  module.exports.default = load_database_default;
}
