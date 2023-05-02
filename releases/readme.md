# HexoJS - Customized
because of HexoJS doesnt accept my PR, i bundled my improved version of hexo.
## Installation by CLI
Installation with command line interface
| production | development |
| :--- | :--- |
| <pre>npm i hexo@https://github.com/dimaslanjaka/hexo/raw/a7e09431/releases/hexo.tgz</pre> | <pre>npm i hexo@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo.tgz</pre> |
| <pre>npm i hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/4ce9acab/releases/hexo-asset-link.tgz</pre> | <pre>npm i hexo-asset-link@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-asset-link.tgz</pre> |
| <pre>npm i hexo-cli@https://github.com/dimaslanjaka/hexo/raw/b2788726/releases/hexo-cli.tgz</pre> | <pre>npm i hexo-cli@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-cli.tgz</pre> |
| <pre>npm i hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/b2788726/releases/hexo-front-matter.tgz</pre> | <pre>npm i hexo-front-matter@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-front-matter.tgz</pre> |
| <pre>npm i hexo-log@https://github.com/dimaslanjaka/hexo/raw/8a00c35d/releases/hexo-log.tgz</pre> | <pre>npm i hexo-log@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-log.tgz</pre> |
| <pre>npm i hexo-renderers@https://github.com/dimaslanjaka/hexo/raw/undefined/releases/hexo-renderers.tgz</pre> | <pre>npm i hexo-renderers@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-renderers.tgz</pre> |
| <pre>npm i hexo-shortcodes@https://github.com/dimaslanjaka/hexo/raw/undefined/releases/hexo-shortcodes.tgz</pre> | <pre>npm i hexo-shortcodes@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-shortcodes.tgz</pre> |
| <pre>npm i hexo-util@https://github.com/dimaslanjaka/hexo/raw/32eacdbf/releases/hexo-util.tgz</pre> | <pre>npm i hexo-util@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-util.tgz</pre> |
| <pre>npm i warehouse@https://github.com/dimaslanjaka/hexo/raw/806f1798/releases/warehouse.tgz</pre> | <pre>npm i warehouse@https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/warehouse.tgz</pre> |
## Installation by changing resolutions
changing module `resolutions` can changed whole source of desired package, _but only work with `yarn`_
package.json
```json
{
  "name": "your package name",
  "resolutions": {
    "hexo": "https://github.com/dimaslanjaka/hexo/raw/a7e09431/releases/hexo.tgz",
    "hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/4ce9acab/releases/hexo-asset-link.tgz",
    "hexo-cli": "https://github.com/dimaslanjaka/hexo/raw/b2788726/releases/hexo-cli.tgz",
    "hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/b2788726/releases/hexo-front-matter.tgz",
    "hexo-log": "https://github.com/dimaslanjaka/hexo/raw/8a00c35d/releases/hexo-log.tgz",
    "hexo-renderers": "https://github.com/dimaslanjaka/hexo/raw/undefined/releases/hexo-renderers.tgz",
    "hexo-shortcodes": "https://github.com/dimaslanjaka/hexo/raw/undefined/releases/hexo-shortcodes.tgz",
    "hexo-util": "https://github.com/dimaslanjaka/hexo/raw/32eacdbf/releases/hexo-util.tgz",
    "warehouse": "https://github.com/dimaslanjaka/hexo/raw/806f1798/releases/warehouse.tgz"
  }
}
```