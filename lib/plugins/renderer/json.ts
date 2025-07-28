import type { StoreFunctionData } from '../../types';

function jsonRenderer(data: StoreFunctionData): any {
  return JSON.parse(data.text);
}

export default jsonRenderer;
