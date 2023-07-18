# HexoJS - Customized
because of HexoJS doesnt accept my PR, i bundled my improved version of hexo.

| package name | commit |
| :--- | :--- | {% for name, item in commits %}
| {{ name }} | {{ item }} | {% endfor %}

## Installation by CLI
Installation with command line interface

### Production

using `npm`
```bash
{{ npm_prod | safe }}
```

using `yarn`
```bash
{{ yarn_prod | safe }}
```

### Development

using `npm`
```bash
{{ npm_dev | safe }}
```

using `yarn`
```bash
{{ yarn_dev | safe }}
```

## Installation by changing resolutions
changing module `resolutions` can changed whole source of desired package, _but only work with `yarn`_. **and do not using development mode (branch name) in resolutions, because the integrity will never updated**

package.json
```json
{{ resolutions | safe }}
```

## Installation by changing overrides

Since NPM 8.3 the equivalent to yarn resolutions is called overrides.

Documentation: https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides

package.json
```json
{{ overrides | safe }}
```
