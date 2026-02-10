import * as models from '../models/index.js';
import type Hexo from './index.js';

const RegisterModel = (ctx: Hexo) => {
  const db = ctx.database;

  const keys = Object.keys(models);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    db.model(key, models[key](ctx));
  }
};

export default RegisterModel;
