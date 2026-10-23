import warehouse from 'warehouse';
import type Hexo from '../hexo/index.js';
import { DataSchema } from '../types.js';

export default (_ctx: Hexo) => {
  const Data = new warehouse.Schema<DataSchema>({
    _id: { type: String, required: true },
    data: Object
  });

  return Data;
};
