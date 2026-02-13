import hexo from 'hexo';

console.log('import succeeded:', typeof hexo);
try {
  console.log('export keys:', Object.keys(hexo).slice(0, 20));
} catch (e) {
  console.error('failed to inspect exports:', e && e.message);
}
