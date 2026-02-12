import type Hexo from '../../../hexo/index.js';

function saveDatabaseFilter(this: Hexo): Promise<void> {
  if (!this.env.init || !this._dbLoaded) return;

  return this.database.save().then(() => {
    this.log.debug('Database saved');
  });
}

// For ESM compatibility
export default saveDatabaseFilter;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = saveDatabaseFilter;
  // For ESM compatibility
  module.exports.default = saveDatabaseFilter;
}

