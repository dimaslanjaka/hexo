export interface StoreFunctionData {
  path?: string;
  text?: string;
  engine?: string;
  onRenderEnd?: (content: string) => string | Promise<string>;
  toString?: boolean;
}
// export type RenderCompile = (
//   local: Record<string, any>
// ) => string | ((local: Record<string, any>) => (...args: any[]) => string);
export type RenderCompile = (local: Record<string, any>) => (...args: any[]) => string;
export interface StoreSyncFunction {
  (
    data: StoreFunctionData,
    options: object
    // callback: (err: Error, value: string) => any
  ): any;
  output?: string;
  compile?: RenderCompile;
  disableNunjucks?: boolean;
}
export interface StoreFunction {
  (data: StoreFunctionData, options: object): Promise<any> | any;
  (data: StoreFunctionData, options: object, callback: (err: Error, value: string) => any): void;
  output?: string;
  compile?: RenderCompile;
  disableNunjucks?: boolean;
  priority?: number;
}

export interface SyncStore {
  [key: string]: StoreSyncFunction | StoreSyncFunction[];
}
export interface Store {
  [key: string]: StoreFunction | StoreFunction[];
}
