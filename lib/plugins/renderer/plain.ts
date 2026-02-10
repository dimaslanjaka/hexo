import { StoreFunctionData } from '../../types.js';

function plainRenderer(data: StoreFunctionData): string {
  return data.text;
}

export default plainRenderer;
