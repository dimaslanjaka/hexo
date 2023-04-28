const { readdirSync, writeFileSync } = require('fs');
const { basename, join } = require('path');
const pkg = require('./package.json');

const tarballs = readdirSync(__dirname).filter((str) => str.endsWith('.tgz'));

for (let i = 0; i < tarballs.length; i++) {
  const tgz = tarballs[i];
  const filename = basename(tgz, '.tgz');
  pkg.dependencies[filename] = `file:./${tgz}`;
}

writeFileSync(join(__dirname, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
