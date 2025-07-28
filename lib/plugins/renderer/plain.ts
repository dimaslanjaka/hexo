import { StoreFunctionData } from '../../types';

function plainRenderer(data: StoreFunctionData): string {
  return data.text;
}

export default plainRenderer;
