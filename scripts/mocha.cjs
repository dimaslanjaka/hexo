
process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: 'CommonJS',
  moduleResolution: 'Node',
  target: 'ES2022',
  esModuleInterop: true
});

require('ts-node').register({
  transpileOnly: true,
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'Node',
    target: 'ES2022',
    esModuleInterop: true
  }
});

const Mocha = require('mocha');
const path = require('node:path');
const glob = require('glob');

const mocha = new Mocha({
  parallel: process.argv.includes('--no-parallel') ? false : undefined
});

for (const file of glob.sync('test/scripts/**/*.ts')) {
  mocha.suite.emit('pre-require', global, file, mocha);
  require(path.resolve(file));
}

mocha.run(failures => {
  process.exitCode = failures ? 1 : 0;
});
