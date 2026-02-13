import Document from 'warehouse/dist/document';
import type { Schema } from 'warehouse';

export default class MyDocument<T = any> extends (Document as any) {
  _model: any;
  _schema: Schema<T> | any;

  constructor(data?: T, model?: any, schema?: Schema<T> | any) {
    super(data as any);
    if (model) this._model = model;
    if (schema) this._schema = schema;
  }

  // Optional: convenience to get plain object with deep clone behavior
  toObject(): T extends object ? T : any {
    return super.toObject();
  }
}
