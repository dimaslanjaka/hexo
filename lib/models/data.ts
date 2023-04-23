import warehouse from 'warehouse';

export = (_ctx?: import('../hexo')) => {
  const Data = new warehouse.Schema({
    _id: { type: String, required: true },
    data: Object
  });

  return Data;
};
