import Module from 'node:module';
import * as models from '../models/index.js';
import type Hexo from './index.js';

const RegisterModel = (ctx: Hexo) => {
  const db = ctx.database;

  const keys = Object.keys(models);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    let model: CallableFunction;
    if (models[key] && typeof models[key] === 'object' && 'default' in models[key]) {
      model = (models[key] as any).default;
    } else {
      model = models[key] as unknown as CallableFunction;
    }
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
