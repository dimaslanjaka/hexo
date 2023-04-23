import * as models from '../models';

const RegisterModel = (ctx: import('../hexo')) => {
  const db = ctx.database;

  const keys = Object.keys(models);

  for (let i = 0, len = keys.length; i < len; i++) {
    const key = keys[i];
    db.model(key, models[key](ctx));
  }
};

export = RegisterModel;
