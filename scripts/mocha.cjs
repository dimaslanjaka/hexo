process.env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
  module: 'CommonJS',
  moduleResolution: 'Node',
  target: 'ES2022',
  esModuleInterop: true
});

require('ts-node').register({
  transpileOnly: true,
  experimentalResolver: true,
  compilerOptions: {
    module: 'CommonJS',
    moduleResolution: 'Node',
    target: 'ES2022',
    esModuleInterop: true
  }
});

require('./resolve-ts-require.cjs').install();

const Mocha = require('mocha');
const path = require('node:path');
const fs = require('node:fs');
const glob = require('glob');

const args = process.argv.slice(2);

const patterns = args
  .filter(arg => !arg.startsWith('--'))
  .map(arg => arg.replace(/\\/g, '/'));

const noParallel = args.includes('--no-parallel');

const files = patterns.length
  ? patterns.flatMap(pattern => glob.sync(pattern))
  : glob.sync('test/scripts/**/*.ts');

const uniqueFiles = [...new Set(files.map(file => path.resolve(file)))];

if (uniqueFiles.length === 0) {
  console.error('No test files found.');
  process.exitCode = 1;
} else {
  const mocha = new Mocha({
    parallel: noParallel ? false : undefined
  });

  const failures = [];

  // Load test files and collect errors thrown during loading.
  for (const file of uniqueFiles) {
    const absolutePath = path.resolve(file);

    try {
      mocha.suite.emit('pre-require', global, absolutePath, mocha);
      require(absolutePath);
    } catch (error) {
      failures.push({
        file: absolutePath,
        title: '(test file loading)',
        message: error?.message || String(error),
        stack: error?.stack || ''
      });
    }
  }

  mocha
    .run()
    .on('fail', (test, error) => {
      failures.push({
        file: test.file || '(unknown file)',
        title: test.fullTitle(),
        message: error?.message || String(error),
        stack: error?.stack || ''
      });
    })
    .on('end', () => {
      if (failures.length === 0) {
        console.log('\nAll tests passed. No errors collected.');
        process.exitCode = 0;
        return;
      }

      console.log('\n\n========== TEST ERROR SUMMARY ==========');
      console.log(`Total errors: ${failures.length}`);

      for (const [index, failure] of failures.entries()) {
        console.log(`\n[${index + 1}] ${failure.file}`);
        console.log(`Test: ${failure.title}`);
        console.log(`Error: ${failure.message}`);

        if (failure.stack) {
          console.log('\nStack trace:');
          console.log(failure.stack);
        }

        console.log('-'.repeat(60));
      }

      fs.mkdirSync('tmp', { recursive: true });

      const reportPath = path.resolve('tmp/test-errors.json');

      fs.writeFileSync(
        reportPath,
        JSON.stringify(failures, null, 2),
        'utf8'
      );

      console.log(`\nError report saved to: ${reportPath}`);
      process.exitCode = 1;
    });
}
