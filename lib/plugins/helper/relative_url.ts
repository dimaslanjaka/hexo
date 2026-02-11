import { relative_url } from 'hexo-util';

export default function (from: string, to: string) {
  return relative_url(from, to);
}
