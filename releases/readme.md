# HexoJS - Customized
because of HexoJS doesnt accept my PR, i bundled my improved version of hexo.

| package name | commit |
| :--- | :--- | 
| hexo | [5b3621a5](https://github.com/dimaslanjaka/hexo/commit/5b3621a5)  [![Coverage Status](https://coveralls.io/repos/github/dimaslanjaka/hexo/badge.svg)](https://coveralls.io/github/dimaslanjaka/hexo) | 
| hexo-asset-link | [1957ca7](https://github.com/dimaslanjaka/hexo-asset-link/commit/1957ca7) | 
| hexo-cli | [a59adc9](https://github.com/dimaslanjaka/hexo-cli/commit/a59adc9) | 
| hexo-front-matter | [04c79bf](https://github.com/dimaslanjaka/hexo-front-matter/commit/04c79bf) | 
| hexo-log | [bf0d2a9](https://github.com/dimaslanjaka/hexo-log/commit/bf0d2a9) | 
| hexo-server | [ed96edf](https://github.com/dimaslanjaka/hexo-server/commit/ed96edf) | 
| hexo-util | [8dfbd62](https://github.com/dimaslanjaka/hexo-util/commit/8dfbd62) | 
| warehouse | [999c8e2](https://github.com/dimaslanjaka/warehouse/commit/999c8e2) | 

## Installation by CLI
Installation with command line interface

### Production

using `npm`
```bash
npm i hexo@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo.tgz
npm i hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/e9138f9e/releases/hexo-asset-link.tgz
npm i hexo-cli@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-cli.tgz
npm i hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-front-matter.tgz
npm i hexo-log@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-log.tgz
npm i hexo-server@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-server.tgz
npm i hexo-util@https://github.com/dimaslanjaka/hexo/raw/ac85edfd/releases/hexo-util.tgz
npm i warehouse@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/warehouse.tgz
```

using `yarn`
```bash
yarn add hexo@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo.tgz
yarn add hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/e9138f9e/releases/hexo-asset-link.tgz
yarn add hexo-cli@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-cli.tgz
yarn add hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-front-matter.tgz
yarn add hexo-log@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-log.tgz
yarn add hexo-server@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-server.tgz
yarn add hexo-util@https://github.com/dimaslanjaka/hexo/raw/ac85edfd/releases/hexo-util.tgz
yarn add warehouse@https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/warehouse.tgz

```

### Development

using `npm`
```bash
npm i hexo@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo.tgz
npm i hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-asset-link.tgz
npm i hexo-cli@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-cli.tgz
npm i hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-front-matter.tgz
npm i hexo-log@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-log.tgz
npm i hexo-server@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-server.tgz
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
yarn add hexo-server@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-server.tgz
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
    "hexo": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo.tgz",
    "hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/e9138f9e/releases/hexo-asset-link.tgz",
    "hexo-cli": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-cli.tgz",
    "hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-front-matter.tgz",
    "hexo-log": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-log.tgz",
    "hexo-server": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-server.tgz",
    "hexo-util": "https://github.com/dimaslanjaka/hexo/raw/ac85edfd/releases/hexo-util.tgz",
    "warehouse": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/warehouse.tgz"
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
    "hexo": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo.tgz",
    "hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/e9138f9e/releases/hexo-asset-link.tgz",
    "hexo-cli": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-cli.tgz",
    "hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-front-matter.tgz",
    "hexo-log": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-log.tgz",
    "hexo-server": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/hexo-server.tgz",
    "hexo-util": "https://github.com/dimaslanjaka/hexo/raw/ac85edfd/releases/hexo-util.tgz",
    "warehouse": "https://github.com/dimaslanjaka/hexo/raw/6adae4a3/releases/warehouse.tgz"
  }
}
```
