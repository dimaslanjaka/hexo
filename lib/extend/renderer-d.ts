export interface StoreFunctionData {
  path?: string;
  text?: string;
  engine?: string;
  onRenderEnd?: (content: string) => string | Promise<string>;
  toString?: boolean;
}
export interface RenderCompile<T = Record<string, any>> {
  (local: T): (...args: any[]) => string; // Function that takes local parameters and returns another function
  (local: Record<string, any>): (...args: any[]) => string;
}

export interface StoreSyncFunction {
  (data: StoreFunctionData, options: Record<string, any>): any;
  (data: StoreFunctionData, options: Record<string, any>, callback: (err: any, value: string) => any): any;
  (...args: any[]): any;
  output?: string;
  compile?: RenderCompile;
  disableNunjucks?: boolean;
}
// Define the StoreFunction interface with overloads
export interface StoreFunction {
  // Overload for returning a Promise-like value
  (data: StoreFunctionData, options: Record<string, any>): PromiseLike<any> | any;

  // Overload for callback style
  (
    data: StoreFunctionData,
    options: Record<string, any>,
    callback: (err: any, value: string) => any
  ): PromiseLike<any> | any;

  // Catch-all overload for any arguments
  (...args: any[]): any | PromiseLike<any>;

  // Optional properties
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
