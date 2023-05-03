# HexoJS - Customized
because of HexoJS doesnt accept my PR, i bundled my improved version of hexo.

## Installation by CLI
Installation with command line interface

### Production

```bash
npm i hexo@https://github.com/dimaslanjaka/hexo/raw/a7e09431/releases/hexo.tgz
npm i hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/4ce9acab/releases/hexo-asset-link.tgz
npm i hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/b2788726/releases/hexo-front-matter.tgz
npm i hexo-log@https://github.com/dimaslanjaka/hexo/raw/8a00c35d/releases/hexo-log.tgz
npm i hexo-util@https://github.com/dimaslanjaka/hexo/raw/9476cf4b/releases/hexo-util.tgz
npm i warehouse@https://github.com/dimaslanjaka/hexo/raw/806f1798/releases/warehouse.tgz
```

### Development

```bash
npm i hexo@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo.tgz
npm i hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-asset-link.tgz
npm i hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-front-matter.tgz
npm i hexo-log@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-log.tgz
npm i hexo-util@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-util.tgz
npm i warehouse@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/warehouse.tgz
```

## Installation by changing resolutions
changing module `resolutions` can changed whole source of desired package, _but only work with `yarn`_
package.json
```json
{
  "name": "your package name",
  "resolutions": {
    "hexo": "https://github.com/dimaslanjaka/hexo/raw/a7e09431/releases/hexo.tgz",
    "hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/4ce9acab/releases/hexo-asset-link.tgz",
    "hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/b2788726/releases/hexo-front-matter.tgz",
    "hexo-log": "https://github.com/dimaslanjaka/hexo/raw/8a00c35d/releases/hexo-log.tgz",
    "hexo-util": "https://github.com/dimaslanjaka/hexo/raw/9476cf4b/releases/hexo-util.tgz",
    "warehouse": "https://github.com/dimaslanjaka/hexo/raw/806f1798/releases/warehouse.tgz"
  }
}
```