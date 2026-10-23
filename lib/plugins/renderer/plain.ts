import { StoreFunctionData } from '../../extend/renderer-d.js';

function plainRenderer(data: StoreFunctionData): string {
  return data.text;
}

export default plainRenderer;
