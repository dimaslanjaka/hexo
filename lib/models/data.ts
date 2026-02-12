import warehouse from 'warehouse';
import type Hexo from '../hexo/index';
import { DataSchema } from '../types';
const data_default = (_ctx: Hexo) => {
  const Data = new warehouse.Schema<DataSchema>({
    _id: {type: String, required: true},
    data: Object
  });

  return Data;
};

// For ESM compatibility
export default data_default;
// For CommonJS compatibility
if (typeof module !== 'undefined' && typeof module.exports === 'object' && module.exports !== null) {
  module.exports = data_default;
  // For ESM compatibility
  module.exports.default = data_default;
}
