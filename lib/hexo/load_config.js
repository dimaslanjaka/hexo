'use strict';

const { sep, resolve, join, parse, normalize, relative, dirname } = require('path');
const tildify = require('tildify');
const Theme = require('../theme');
const Source = require('./source');
const { exists, readdir, existsSync, readFileSync } = require('hexo-fs');
const { magenta } = require('picocolors');
const { deepMerge } = require('hexo-util');
const validateConfig = require('./validate_config');
const micromatch = require('micromatch');

module.exports = async ctx => {
  if (!ctx.env.init) return;

  const baseDir = ctx.base_dir;
  let configPath = ctx.config_path;

  const path = await exists(configPath) ? configPath : await findConfigPath(configPath);
  if (!path) return;
  configPath = path;

  let config = await ctx.render.render({ path });
  if (!config || typeof config !== 'object') return;

  ctx.log.debug('Config loaded: %s', magenta(tildify(configPath)));

  ctx.config = deepMerge(ctx.config, config);
  // If root is not exist, create it by config.url
  if (!config.root) {
    let { pathname } = new URL(ctx.config.url);
    if (!pathname.endsWith('/')) pathname += '/';
    ctx.config.root = pathname;
  }
  config = ctx.config;

  validateConfig(ctx);

  ctx.config_path = configPath;
  // Trim multiple trailing '/'
  config.root = config.root.replace(/\/*$/, '/');
  // Remove any trailing '/'
  config.url = config.url.replace(/\/+$/, '');

  ctx.public_dir = resolve(baseDir, config.public_dir) + sep;
  ctx.source_dir = resolve(baseDir, config.source_dir) + sep;
  ctx.source = new Source(ctx);

  if (!config.theme) return;

  const theme = config.theme.toString();
  config.theme = theme;

  const themeDirFromThemes = join(baseDir, 'themes', theme) + sep; // base_dir/themes/[config.theme]/
  const themeDirFromNodeModules = join(ctx.plugin_dir, 'hexo-theme-' + theme) + sep; // base_dir/node_modules/hexo-theme-[config.theme]/
  const yarnRootWorkspace = findYarnRootWorkspace(ctx);
  const themeDirFromYarnNodeModules = yarnRootWorkspace !== null && join(yarnRootWorkspace, 'hexo-theme-' + theme);

  // themeDirFromThemes has higher priority than themeDirFromNodeModules
  let ignored = [];
  if (await exists(themeDirFromThemes)) {
    ctx.theme_dir = themeDirFromThemes;
    ignored = ['**/themes/*/node_modules/**', '**/themes/*/.git/**'];
  } else if (await exists(themeDirFromNodeModules)) {
    ctx.theme_dir = themeDirFromNodeModules;
    ignored = ['**/node_modules/hexo-theme-*/node_modules/**', '**/node_modules/hexo-theme-*/.git/**'];
  } else if (yarnRootWorkspace !== null && await exists(themeDirFromYarnNodeModules)) {
    ctx.theme_dir = themeDirFromYarnNodeModules;
    ignored = ['**/node_modules/hexo-theme-*/node_modules/**', '**/node_modules/hexo-theme-*/.git/**'];
  }
  ctx.theme_script_dir = join(ctx.theme_dir, 'scripts') + sep;
  ctx.theme = new Theme(ctx, { ignored });
};

async function findConfigPath(path) {
  const { dir, name } = parse(path);

  const files = await readdir(dir);
  const item = files.find(item => item.startsWith(name));
  if (item != null) return join(dir, item);
}

/**
 * search yarn root workspace folder
 * @param {import('hexo')} ctx
 */
function findYarnRootWorkspace(ctx) {
  const baseDir = ctx.base_dir;

  /**
   * extract workspaces from package.json
   * @param {Record<string,any>} manifest
   * @returns
   */
  const extractWorkspaces = function(manifest) {
    const workspaces = (manifest || {}).workspaces;
    return (workspaces && workspaces.packages) || (Array.isArray(workspaces) ? workspaces : null);
  };

  /**
   * read package.json from given folder
   * @param {string} dir
   * @returns {Record<string,any>}
   */
  const readPackageJSON = function(dir) {
    const file = join(dir, 'package.json');
    if (existsSync(file)) {
      return JSON.parse(readFileSync(file).toString());
    }
    return null;
  };

  let previous = null;
  let current = normalize(baseDir);
  // loop searching
  do {
    const manifest = readPackageJSON(current);
    const workspaces = extractWorkspaces(manifest);

    if (workspaces) {
      const relativePath = relative(current, baseDir);
      if (relativePath === '' || micromatch([relativePath], workspaces).length > 0) {
        return current;
      }
      return null;
    }

    previous = current;
    current = dirname(current);
  } while (current !== previous);

  return null;
}
