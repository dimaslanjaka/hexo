
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

const args = process.argv.slice(2);
const noParallel = args.includes('--no-parallel');

const patterns = args
  .filter(arg => !arg.startsWith('--'))
  .map(arg => arg.replace(/\\/g, '/'));

const files = patterns.length
  ? patterns.flatMap(pattern => glob.sync(pattern))
  : glob.sync('test/scripts/**/*.ts');

const mocha = new Mocha({
  parallel: noParallel ? false : undefined
});

if (files.length === 0) {
  console.error('No test files found.');
  process.exitCode = 1;
} else {
  for (const file of [...new Set(files)]) {
    const absolutePath = path.resolve(file);

    mocha.suite.emit('pre-require', global, absolutePath, mocha);
    require(absolutePath);
  }

  mocha.run(failures => {
    process.exitCode = failures ? 1 : 0;
  });
}
