import * as models from '../models/index.js';
import type Hexo from './index.js';
const register_models_default = (ctx: Hexo): void => {
  const db = ctx.database;

  const keys = Object.keys(models);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    db.model(key, models[key](ctx));
  }
};

// For ESM compatibility
export default register_models_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = register_models_default;
  // For ESM compatibility
  module.exports.default = register_models_default;
}
