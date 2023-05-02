export interface StoreSyncFunction {
  (
    data: {
      path?: string;
      text: string;
    },
    options: Record<string, any>,
    // callback: (err: Error, value: string) => any
  ): any;
  output?: string;
  compile?: (local: Record<string, any>) => string;
  disableNunjucks?: boolean;
}
export interface StoreFunction {
  (
    data: {
      path?: string;
      text: string;
    },
    options: Record<string, any>,
  ): Promise<any>;
  (
    data: {
      path?: string;
      text: string;
    },
    options: Record<string, any>,
    callback: (err: Error, value: string) => any
  ): void;
  output?: string;
  compile?: (local: Record<string, any>) => string;
  disableNunjucks?: boolean;
}

export interface SyncStore {
  [key: string]: StoreSyncFunction;
}
export interface Store {
  [key: string]: StoreFunction;
}
