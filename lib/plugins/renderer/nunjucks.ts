import { readFileSync } from 'hexo-fs';
import nunjucks from 'nunjucks';
import path, { dirname } from 'path';
import type { StoreFunctionData } from '../../types.js';

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

const nunjucksCfg: nunjucks.ConfigureOptions = {
  autoescape: false,
  throwOnUndefined: false,
  trimBlocks: false,
  lstripBlocks: false
};

const nunjucksAddFilter = (env: nunjucks.Environment): void => {
  env.addFilter('toarray', toArray);
  env.addFilter('safedump', safeJsonStringify);
};

function njkCompile(data: StoreFunctionData): nunjucks.Template {
  try {
    const paths = [] as string[];
    if (typeof hexo !== 'undefined') {
      paths.push(path.join(hexo.base_dir, 'themes', hexo.config.theme));
      paths.push(path.join(hexo.base_dir, 'themes', hexo.config.theme, 'layout'));
    }
    if (data.path) {
      paths.push(dirname(data.path));
    }
    const env = nunjucks.configure(paths, nunjucksCfg);

    nunjucksAddFilter(env);

    let text = '';
    if ('text' in data && typeof data.text === 'string') {
      text = data.text;
    } else if (data.path) {
      text = readFileSync(data.path).toString();
    }

    // return nunjucks.compile(text, env, data.path);
    return nunjucks.compile(text, env);
  } catch (error) {
    const msg = `Source: ${data.path ? data.path : data.text.substring(0, 150)}
Error:

${error}`;
    console.log(msg);
    throw error;
  }
}

// function with internal exported function needs interface to detect from IDE
// fix(TS2344): Type 'Function' provides no match for the signature 'new (...args: any): any'.
// change to FunctionConstructor
interface njkRenderer extends FunctionConstructor {
  compile: (data: { path?: any; text?: any }) => (locals: Record<string, any>) => string;
}

function njkRenderer(data: StoreFunctionData, locals?: any): string {
  return njkCompile(data).render(locals);
}

njkRenderer.compile = (data: StoreFunctionData): ((locals: any) => string) => {
  // Need a closure to keep the compiled template.
  return locals => njkCompile(data).render(locals);
};

export default njkRenderer;
