# HexoJS - Customized
because of HexoJS doesnt accept my PR, i bundled my improved version of hexo.

| package name | commit |
| :--- | :--- | 
| hexo | https://github.com/dimaslanjaka/hexo/commit/ff14d6ff | 
| hexo-asset-link | https://github.com/dimaslanjaka/hexo-asset-link/commit/4fad836 | 
| hexo-cli | https://github.com/dimaslanjaka/hexo-cli/commit/bd319fd | 
| hexo-front-matter | https://github.com/dimaslanjaka/hexo-front-matter/commit/4a7681e | 
| hexo-log | https://github.com/dimaslanjaka/hexo-log/commit/6494294 | 
| hexo-util | https://github.com/dimaslanjaka/hexo-util/commit/f159471 | 
| warehouse | https://github.com/dimaslanjaka/warehouse/commit/187c5d3 | 

## Installation by CLI
Installation with command line interface

### Production

using `npm`
```bash
npm i hexo@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo.tgz
npm i hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-asset-link.tgz
npm i hexo-cli@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-cli.tgz
npm i hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-front-matter.tgz
npm i hexo-log@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-log.tgz
npm i hexo-util@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-util.tgz
npm i warehouse@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/warehouse.tgz
```

using `yarn`
```bash
yarn add hexo@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo.tgz
yarn add hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-asset-link.tgz
yarn add hexo-cli@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-cli.tgz
yarn add hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-front-matter.tgz
yarn add hexo-log@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-log.tgz
yarn add hexo-util@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-util.tgz
yarn add warehouse@https://github.com/dimaslanjaka/hexo/raw/<production>/releases/warehouse.tgz

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
changing module `resolutions` can changed whole source of desired package, _but only work with `yarn`_. **and do not using development mode in resolutions, because the integrity will never updated**

package.json
```json
{
  "name": "your package name",
  "resolutions": {
    "hexo": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo.tgz",
    "hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-asset-link.tgz",
    "hexo-cli": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-cli.tgz",
    "hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-front-matter.tgz",
    "hexo-log": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-log.tgz",
    "hexo-util": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-util.tgz",
    "warehouse": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/warehouse.tgz"
  }
}
```

## Installation by changing overrides

Since NPM 8.3 the equivalent to yarn resolutions is called overrides.

Documentation: https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides

package.json
```json
{
  "name": "your package name",
  "overrides": {
    "hexo": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo.tgz",
    "hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-asset-link.tgz",
    "hexo-cli": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-cli.tgz",
    "hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-front-matter.tgz",
    "hexo-log": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-log.tgz",
    "hexo-util": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/hexo-util.tgz",
    "warehouse": "https://github.com/dimaslanjaka/hexo/raw/<production>/releases/warehouse.tgz"
  }
}
```