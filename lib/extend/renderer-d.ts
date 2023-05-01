export interface StoreSyncFunction {
  (
    data: {
      path?: string;
      text: string;
    },
    options: object,
    // callback: (err: Error, value: string) => any
  ): any;
  output?: string;
  compile?: (local: object) => string;
  disableNunjucks?: boolean;
}
export interface StoreFunction {
  (
    data: {
      path?: string;
      text: string;
    },
    options: object,
  ): Promise<any>;
  (
    data: {
      path?: string;
      text: string;
    },
    options: object,
    callback: (err: Error, value: string) => any
  ): void;
  output?: string;
  compile?: (local: object) => string;
  disableNunjucks?: boolean;
}

export interface SyncStore {
  [key: string]: StoreSyncFunction;
}
export interface Store {
  [key: string]: StoreFunction;
}