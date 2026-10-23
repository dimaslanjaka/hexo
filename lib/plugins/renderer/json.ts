import type { StoreFunctionData } from '../../extend/renderer-d.js';

function jsonRenderer(data: StoreFunctionData): any {
  return JSON.parse(data.text);
}

export default jsonRenderer;
