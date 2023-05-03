# HexoJS - Customized
because of HexoJS doesnt accept my PR, i bundled my improved version of hexo.

## Installation by CLI
Installation with command line interface

### Production

```bash
{{ install_prod | safe }}
```

### Development

```bash
{{ install_dev | safe }}
```

## Installation by changing resolutions
changing module `resolutions` can changed whole source of desired package, _but only work with `yarn`_
package.json
```json
{{ resolutions | safe }}
```