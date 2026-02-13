import { Model, Query, Schema, Document } from 'warehouse';
import type { TagSchema } from '../../types.js';
import MyDocument from './MyDocument.js';

export default class MyQuery extends Query<TagSchema> {
  _model: Model<TagSchema>;
  _schema: Schema<TagSchema>;

  constructor(items?: Array<TagSchema | MyDocument>) {
    // Query expects an array of Document<T>, so wrap each plain item into MyDocument
    const docs = (items || []).map((it) => (it instanceof MyDocument ? it : new MyDocument(it as TagSchema)));
    super(docs as any);
  }
}
