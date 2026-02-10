import type { StoreFunctionData } from '../../types.js';

function jsonRenderer(data: StoreFunctionData): any {
  return JSON.parse(data.text);
}

export default jsonRenderer;
