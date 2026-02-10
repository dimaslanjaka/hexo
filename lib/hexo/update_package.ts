import { join } from 'path';
import { writeFile, exists, readFile } from 'hexo-fs';
import type Hexo from './index.js';
import type Promise from 'bluebird';

const updatePackage = (ctx: Hexo): Promise<void> => {
  const pkgPath = join(ctx.base_dir, 'package.json');

  return readPkg(pkgPath).then(pkg => {
    if (!pkg) return;

    ctx.env.init = true;

    if (pkg.hexo.version === ctx.version) return;

    pkg.hexo.version = ctx.version;

    ctx.log.debug('Updating package.json');
    return writeFile(pkgPath, JSON.stringify(pkg, null, '  '));
  });
};

export default updatePackage;

function readPkg(path: string): Promise<any> {
  return exists(path).then(exist => {
    if (!exist) return;

    return readFile(path).then(content => {
      const pkg = JSON.parse(content);
      if (typeof pkg.hexo !== 'object') return;

      return pkg;
    });
  });
}
