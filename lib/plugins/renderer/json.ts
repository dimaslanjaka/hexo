import type { StoreFunctionData } from '../../extend/renderer-d';

function jsonRenderer(data: StoreFunctionData): any {
  return JSON.parse(data.text);
}

export = jsonRenderer;
