import { NodeJSLikeCallback, PageSchema, SiteLocals } from '../types';

export interface StoreFunctionData {
  path?: string;
  text?: string;
  engine?: string;
  onRenderEnd?: (content: string) => string | Promise<string>;
  toString?: any;
}

export interface RenderCompile<T = Record<string, any>> {
  // Function that takes local parameters and returns another function
  (local: T): (...args: any[]) => string;
  (local: Record<string, any>): (...args: any[]) => string;
  // Original function from upstream/master
  (data: StoreFunctionData): (local: any) => any;
}

export interface StoreSyncFunction {
  [key: string]: any;
  (data: StoreFunctionData, options?: Record<string, any>): any;
  (data: StoreFunctionData, options?: Record<string, any>, callback?: (err: any, value: string) => any): any;
  (...args: any[]): any;
  output?: string;
  compile?: RenderCompile;
  disableNunjucks?: boolean;
  page?: PageSchema & SiteLocals;
}

// Define the StoreFunction interface with overloads
export interface StoreFunction {
  [key: string]: any;
  // Overload for returning a Promise-like value
  (data: StoreFunctionData, options?: Record<string, any>): PromiseLike<any> | any;

  // Overload for callback style
  (
    data: StoreFunctionData,
    options?: Record<string, any>,
    callback?: (err: any, value: string) => any
  ): PromiseLike<any> | any;

  // Catch-all overload for any arguments
  (...args: any[]): any | PromiseLike<any>;

  // Optional properties
  output?: string;
  compile?: RenderCompile;
  disableNunjucks?: boolean;
  priority?: number;
  page?: PageSchema & SiteLocals;
}

export interface SyncStore {
  [key: string]: StoreSyncFunction | StoreSyncFunction[];
}
export interface Store {
  [key: string]: StoreFunction | StoreFunction[];
}

export interface StoreFunctionWithCallback {
  (data: StoreFunctionData, options: object, callback?: NodeJSLikeCallback<any>): Promise<any>;
  output?: string;
  compile?: (data: StoreFunctionData) => (local: any) => any;
  disableNunjucks?: boolean;
  [key: string]: any;
}
