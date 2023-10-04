import nunjucks from 'nunjucks';
import { readFileSync } from 'hexo-fs';
import { dirname } from 'path';

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

function safeJsonStringify(json, spacer = undefined) {
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

const nunjucksAddFilter = (env: nunjucks.Environment) => {
  env.addFilter('toarray', toArray);
  env.addFilter('safedump', safeJsonStringify);
};

function njkCompile(data: { path?: any; text?: any }) {
  let env: nunjucks.Environment;
  if (typeof data.path === 'string') {
    env = nunjucks.configure(dirname(data.path), nunjucksCfg);
  } else {
    env = nunjucks.configure(nunjucksCfg);
  }
  nunjucksAddFilter(env);

  const text = 'text' in data ? data.text : readFileSync(data.path);

  return nunjucks.compile(text, env, data.path);
}

interface njkRenderer extends Function {
  compile: (data: { path?: any; text?: any }) => (locals: Record<string, any>) => string;
}

function njkRenderer(data: { path?: any; text?: any }, locals: Record<string, any>) {
  return njkCompile(data).render(locals);
}

njkRenderer.compile = (data: { path?: any; text?: any }) => {
  // Need a closure to keep the compiled template.
  return (locals: Record<string, any>) => njkCompile(data).render(locals);
};

export = njkRenderer;
