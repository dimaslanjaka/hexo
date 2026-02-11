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
    // Might be an object containing multiple models
    if (typeof model === 'object') {
      for (const keyModel in model) {
        if (Object.prototype.hasOwnProperty.call(model, keyModel)) {
          const valueModel = (model as any)[keyModel];
          if (typeof valueModel !== 'function') {
            console.log(valueModel);
            console.warn(`Value model "${keyModel}" is ${typeof valueModel} and will be skipped.`);
            continue;
          }
          db.model(keyModel, valueModel(ctx));
        }
      }
      continue;
    }
    if (typeof model !== 'function') {
      console.log(model);
      console.warn(`Model "${key}" is ${typeof model} and will be skipped.`);
      continue;
    }
    db.model(key, model(ctx));
    // db.model(key, models[key](ctx)); --- IGNORE ---
  }
};

export default RegisterModel;
