# HexoJS - Customized
because of HexoJS doesnt accept my PR, i bundled my improved version of hexo.

| package name | commit |
| :--- | :--- | 
| hexo | [3d29aa7b](https://github.com/dimaslanjaka/hexo/commit/3d29aa7b)  [![Coverage Status](https://coveralls.io/repos/github/dimaslanjaka/hexo/badge.svg)](https://coveralls.io/github/dimaslanjaka/hexo) | 
| hexo-asset-link | [c7b30eb](https://github.com/dimaslanjaka/hexo-asset-link/commit/c7b30eb) | 
| hexo-cli | [0e23306](https://github.com/dimaslanjaka/hexo-cli/commit/0e23306) | 
| hexo-front-matter | [fec8829](https://github.com/dimaslanjaka/hexo-front-matter/commit/fec8829) | 
| hexo-log | [88cd8fe](https://github.com/dimaslanjaka/hexo-log/commit/88cd8fe) | 
| hexo-util | [e7e7f08](https://github.com/dimaslanjaka/hexo-util/commit/e7e7f08) | 
| warehouse | [3242c89](https://github.com/dimaslanjaka/warehouse/commit/3242c89) | 

## Installation by CLI
Installation with command line interface

### Production

using `npm`
```bash
npm i hexo@https://github.com/dimaslanjaka/hexo/raw/305bb849/releases/hexo.tgz
npm i hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/f220d1ee/releases/hexo-asset-link.tgz
npm i hexo-cli@https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/hexo-cli.tgz
npm i hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/88f59dc8/releases/hexo-front-matter.tgz
npm i hexo-log@https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/hexo-log.tgz
npm i hexo-util@https://github.com/dimaslanjaka/hexo/raw/88f59dc8/releases/hexo-util.tgz
npm i warehouse@https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/warehouse.tgz
```

using `yarn`
```bash
yarn add hexo@https://github.com/dimaslanjaka/hexo/raw/305bb849/releases/hexo.tgz
yarn add hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/f220d1ee/releases/hexo-asset-link.tgz
yarn add hexo-cli@https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/hexo-cli.tgz
yarn add hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/88f59dc8/releases/hexo-front-matter.tgz
yarn add hexo-log@https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/hexo-log.tgz
yarn add hexo-util@https://github.com/dimaslanjaka/hexo/raw/88f59dc8/releases/hexo-util.tgz
yarn add warehouse@https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/warehouse.tgz

```

### Development

using `npm`
```bash
npm i hexo@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo.tgz
npm i hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-asset-link.tgz
npm i hexo-cli@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-cli.tgz
npm i hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-front-matter.tgz
npm i hexo-log@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-log.tgz
npm i hexo-util@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-util.tgz
npm i warehouse@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/warehouse.tgz
```

using `yarn`
```bash
yarn add hexo@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo.tgz
yarn add hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-asset-link.tgz
yarn add hexo-cli@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-cli.tgz
yarn add hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-front-matter.tgz
yarn add hexo-log@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-log.tgz
yarn add hexo-util@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-util.tgz
yarn add warehouse@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/warehouse.tgz

```

## Installation by changing resolutions
changing module `resolutions` can changed whole source of desired package, _but only work with `yarn`_. **and do not using development mode (branch name) in resolutions, because the integrity will never updated**

package.json
```json
{
  "name": "your package name",
  "resolutions": {
    "hexo": "https://github.com/dimaslanjaka/hexo/raw/305bb849/releases/hexo.tgz",
    "hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/f220d1ee/releases/hexo-asset-link.tgz",
    "hexo-cli": "https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/hexo-cli.tgz",
    "hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/88f59dc8/releases/hexo-front-matter.tgz",
    "hexo-log": "https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/hexo-log.tgz",
    "hexo-util": "https://github.com/dimaslanjaka/hexo/raw/88f59dc8/releases/hexo-util.tgz",
    "warehouse": "https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/warehouse.tgz"
  }
}
```

## Installation by changing overrides

Since NPM 8.3 the equivalent to **yarn resolutions** is called overrides.

Documentation: https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides

package.json
```json
{
  "name": "your package name",
  "overrides": {
    "hexo": "https://github.com/dimaslanjaka/hexo/raw/305bb849/releases/hexo.tgz",
    "hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/f220d1ee/releases/hexo-asset-link.tgz",
    "hexo-cli": "https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/hexo-cli.tgz",
    "hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/88f59dc8/releases/hexo-front-matter.tgz",
    "hexo-log": "https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/hexo-log.tgz",
    "hexo-util": "https://github.com/dimaslanjaka/hexo/raw/88f59dc8/releases/hexo-util.tgz",
    "warehouse": "https://github.com/dimaslanjaka/hexo/raw/d00388b9/releases/warehouse.tgz"
  }
}
```
