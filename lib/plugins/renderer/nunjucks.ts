import nunjucks, { Environment } from 'nunjucks';
import { readFileSync } from 'hexo-fs';
import { dirname } from 'path';
import type { StoreFunctionData } from '../../extend/renderer';

function toArray(value: any) {
  if (Array.isArray(value)) {
    // Return if given value is an Array
    return value;
  } else if (typeof value.toArray === 'function') {
    return value.toArray();
  } else if (value instanceof Map) {
    const arr = [];
    value.forEach(v => arr.push(v));
    return arr;
  } else if (value instanceof Set || typeof value === 'string') {
    return [...value];
  } else if (typeof value === 'object' && value instanceof Object && Boolean(value)) {
    return Object.values(value);
  }

  return [];
}

function safeJsonStringify(json: any, spacer = undefined): string {
  if (typeof json !== 'undefined' && json !== null) {
    return JSON.stringify(json, null, spacer);
  }

  return '""';
}

const nunjucksCfg = {
  autoescape: false,
  throwOnUndefined: false,
  trimBlocks: false,
  lstripBlocks: false
};

const nunjucksAddFilter = (env: Environment): void => {
  env.addFilter('toarray', toArray);
  env.addFilter('safedump', safeJsonStringify);
};

function njkCompile(data: StoreFunctionData): nunjucks.Template {
  let env: Environment;
  if (data.path) {
    env = nunjucks.configure(dirname(data.path), nunjucksCfg);
  } else {
    env = nunjucks.configure(nunjucksCfg);
  }
  nunjucksAddFilter(env);

  const text = 'text' in data ? data.text : readFileSync(data.path);

  return nunjucks.compile(text as string, env, data.path);
}

// function with internal exported function needs interface to detect from IDE
// fix(TS2344): Type 'Function' provides no match for the signature 'new (...args: any): any'.
// change to FunctionConstructor
interface njkRenderer extends FunctionConstructor {
  compile: (data: { path?: any; text?: any }) => (locals: Record<string, any>) => string;
}

function njkRenderer(data: StoreFunctionData, locals: object): string {
  return njkCompile(data).render(locals);
}

njkRenderer.compile = (data: StoreFunctionData): (locals: any) => string => {
  // Need a closure to keep the compiled template.
  return (locals: Record<string, any>) => njkCompile(data).render(locals);
};

export = njkRenderer;
