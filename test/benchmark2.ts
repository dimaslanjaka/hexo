/* eslint-disable node/no-unsupported-features/es-syntax */
'use strict';

import { PerformanceObserver, performance } from 'perf_hooks';
import { join, resolve } from 'path';
import { spawn as spawnAsyncString } from 'hexo-util';
import findYarnRootWorkspace from '../lib/hexo/findYarnRootWorkspace';
import { spawn } from 'child_process';

const cwd = findYarnRootWorkspace({ base_dir: join(__dirname, '..') });

const getWorkspaces: Promise<{ location: string; name: string }[]> = spawnAsyncString(
  'yarn',
  'workspaces list --json'.split(' '),
  {
    cwd
  }
).then(str => {
  if (str) {
    return String(str)
      .split(/\r?\n/gm)
      .filter(str => str.length > 4)
      .map(str => JSON.parse(str));
  }
});

const run_clean = function(opt: { cwd: string }) {
  return spawnAsyncString('hexo', ['clean', '--silent'], { cwd: opt.cwd });
};

const run_generate = function(opt: { cwd: string }) {
  return spawnAsyncString('hexo', ['g', '--silent'], { cwd: opt.cwd });
};

Promise.all([getWorkspaces])
  .then(promises => {
    const workspaces = promises[0];
    const hexoDir = resolve(
      cwd,
      workspaces.filter(o => o.name === 'hexo')[0].location
    );
    const siteDir = resolve(
      cwd,
      workspaces.filter(o => o.location.endsWith('hexo-theme-test'))[0]
        .location
    );
    return { workspaces, hexoDir, siteDir };
  })
  .then(promises => {
    const benchmark = async function() {
      await run_clean({ cwd: promises.siteDir });
      await run_generate({ cwd: promises.siteDir });
    };

    const wrapped = performance.timerify(benchmark);
    const result = {};

    const obs = new PerformanceObserver(list => {
      list
        .getEntries()
        // .sort((a, b) => parseInt(String(a.detail), 10) - parseInt(String(b.detail), 10))
        .forEach(entry => {
          const { name, duration: _duration } = entry;
          const duration = _duration / 1000;
          result[name] = {
            'Cost time (s)': `${duration.toFixed(2)}s`
          };
          if (duration > 20) {
            console.log('!! Performance regression detected !!');
          }
        });

      console.table(result);
      performance.clearMarks();
      performance.clearMeasures();
      obs.disconnect();
    });


    // obs.observe({ entryTypes: ['function'] });
    obs.observe({ entryTypes: ['measure'] });


    const hexo = spawn('hexo', ['generate', '--debug'], { cwd: promises.siteDir, shell: true });

    const hooks = [
      { regex: /Hexo version/, tag: 'hexo-begin' },
      { regex: /Start processing/, tag: 'processing' },
      { regex: /Rendering post/, tag: 'render-post' },
      { regex: /Files loaded/, tag: 'file-loaded' },
      { regex: /generated in/, tag: 'generated' },
      { regex: /Database saved/, tag: 'database-saved' }
    ];
    hexo.stdout.on('data', function onDataListener(data) {
      const stdout = String(data);
      console.log(stdout);

      hooks.filter(o => o.regex.test(stdout)).forEach(o => {
        performance.mark(o.tag);
        hexo.stdout.removeListener('data', onDataListener);
      });
    });

    // A performance timeline entry will be created
    wrapped();
  });
