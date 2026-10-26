const config = require('eslint-config-hexo/ts');
const testConfig = require('eslint-config-hexo/ts-test');

/**
 * @type {import('eslint').Linter.Config[]}
 */
module.exports = [
  // Configurations applied globally
  ...config,
  {
    ignores: [
      '**/node_modules/**',
      '**/coverage/**',
      '**/public/**',
      '**/db.json'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-require-imports': 0,
      'n/no-missing-import': 0,
      'n/no-missing-require': 0,
      'n/no-extraneous-require': 0,
      '@typescript-eslint/no-unused-vars': [
        'error', {
          'varsIgnorePattern': '^_',
          'argsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ],
      // Keep allowing the triple slashes from the spaced-comment rule
      'spaced-comment': ['error', 'always', { 'line': { 'markers': ['/'] } }],

      // Ban path-based triple-slash references (forces import style)
      '@typescript-eslint/triple-slash-reference': ['error', {
        'path': 'never',
        'types': 'prefer-import',
        'lib': 'always'
      }]
    }
  },
  // Configurations applied only to test files
  ...testConfig.map(config => ({
    ...config,
    files: ['test/**/*.ts'],
    rules: {
      ...config.rules,
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-require-imports': 0,
      'n/no-missing-require': 0,
      'n/no-missing-import': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/no-unused-vars': [
        'error', {
          'varsIgnorePattern': '^_',
          'argsIgnorePattern': '^_',
          'caughtErrorsIgnorePattern': '^_'
        }
      ]
    }
  }))
];
