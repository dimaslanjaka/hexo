import type Hexo from '../../../hexo/index.js';

function saveDatabaseFilter(this: Hexo): Promise<void> | undefined {
  if (!this.env.init || !this._dbLoaded) return;

  return this.database.save().then(() => {
    this.log.debug('Database saved');
  });
}

export default saveDatabaseFilter;
