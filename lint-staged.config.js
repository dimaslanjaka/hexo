'use strict';

const config = {
  '*.ts': ['prettier --write', 'eslint --fix'],
  '*.html': ['eslint --fix', 'prettier --write'],
  '*.scss': 'prettier --write'
};

module.exports = config;
