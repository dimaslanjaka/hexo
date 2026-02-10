import * as models from '../models/index.js';
import type Hexo from './index.js';

const RegisterModel = (ctx: Hexo) => {
  const db = ctx.database;

  const keys = Object.keys(models);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    const model = models[key];
    if (!model) continue;
    if (typeof model !== 'function') {
      console.warn(`Model "${key}" is ${typeof model} and will be skipped.`);
      continue;
    }
    db.model(key, model(ctx));
    // db.model(key, models[key](ctx)); --- IGNORE ---
  }
};

export default RegisterModel;
