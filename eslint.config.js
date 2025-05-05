
const config = require('eslint-config-hexo/ts');

module.exports = [
  ...config,
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-require-imports': 0,
      '@typescript-eslint/no-unused-expressions': 0,
      '@typescript-eslint/ban-ts-comment': 0,
      'n/no-missing-require': 0,
      'n/no-missing-import': 0,
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: false,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-this-alias': [
        // rules for `this` binding
        'error',
        {
          allowDestructuring: true, // Disallow `const { props, state } = this`; true by default
          allowedNames: ['self', 'hexo'] // Allow `const self = this`; `[]` by default
        }
      ]
    }
  }
];
