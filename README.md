<img src="https://raw.githubusercontent.com/hexojs/logo/master/hexo-logo-avatar.png" alt="Hexo logo" width="100" height="100" align="right" />

# Hexo Monorepo
My customized hexo library

## sync

```bash
yarn workspace hexo exec "git remote add upstream https://github.com/hexojs/hexo"
yarn workspace hexo-front-matter exec "git remote add upstream https://github.com/hexojs/hexo-front-matter"
yarn workspace warehouse exec "git remote add upstream https://github.com/hexojs/warehouse"
yarn workspace hexo-asset-link exec "git remote add upstream https://github.com/liolok/hexo-asset-link"
yarn workspace hexo-site exec "git remote add upstream https://github.com/hexojs/hexo-theme-unit-test"
yarn workspace hexo-util exec "git remote add upstream https://github.com/hexojs/hexo-util"
yarn workspace hexo-log exec "git remote add upstream https://github.com/hexojs/hexo-log"
```

## Pull request document

## hexo-cli
- [#479](https://github.com/hexojs/hexo-cli/pull/479)
- [#483](https://github.com/hexojs/hexo-cli/pull/483)

## hexo-log
https://github.com/hexojs/hexo-log/pull/148

## hexo-util
https://github.com/hexojs/hexo-util/pull/301

## hexo-front-matter
- [#70](https://github.com/hexojs/hexo-front-matter/pull/70) closed due refactoring code style
- [#71](https://github.com/hexojs/hexo-front-matter/pull/71)

## hexo
## What does it do?
### feat(lint): add rule unused vars
affects: `.eslintrc`
-  turn error all unused vars, except start with `underscore` (`_`)

### chore(deps-dev): update types, fix missing types
affects: `package.json`
- add `@types/mocha`, `@types/chai`
- add `@types/sinon`. `@types/micromatch`
- update `@types/bluebird`

## Pull request tasks

- [ ] Add test cases for the changes.
- [ ] Passed the CI test.
