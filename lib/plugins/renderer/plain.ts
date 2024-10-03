import { StoreFunctionData } from '../../extend/renderer-d';

function plainRenderer(data: StoreFunctionData): string {
  return data.text;
}

export = plainRenderer;
