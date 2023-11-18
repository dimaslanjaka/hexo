import warehouse from 'warehouse';
import type Hexo from '../hexo';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export = (ctx: Hexo) => {
  const Data = new warehouse.Schema({
    _id: { type: String, required: true },
    data: Object
  });

  return Data;
};
