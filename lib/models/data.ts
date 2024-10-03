import warehouse from 'warehouse';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export = (_ctx?: import('../hexo')) => {
  const Data = new warehouse.Schema({
    _id: { type: String, required: true },
    data: Object
  });

  return Data;
};
