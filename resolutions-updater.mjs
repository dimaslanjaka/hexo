import * as croSpawn from 'cross-spawn';
import 'dotenv/config';
import fs from 'fs-extra';
import picocolors from 'picocolors';
import path from 'upath';

const __dirname = path.dirname(
  process.platform === 'win32' ? new URL(import.meta.url).pathname.slice(1) : new URL(import.meta.url).pathname
);

const parseWorkspaces = () =>
  croSpawn
    .async('yarn', ['workspaces', 'list', '--no-private', '--json'], {
      cwd: process.cwd()
    })
    .then((o) =>
      o.stdout
        .split(/\r?\n/gm)
        .filter((str) => str.length > 4)
        .map((str) => {
          /** @type {{ location: string; name: string }} */
          const parse = JSON.parse(str.trim());
          // Use path.resolve to get correct absolute path for workspace
          parse.location = path.resolve(process.cwd(), parse.location);
          return parse;
        })
    );

const resolutionsUpdaterScript = path.join(
  __dirname,
  'node_modules/binary-collections/lib/package-resolutions-updater.cjs'
);

if (!fs.existsSync(resolutionsUpdaterScript)) {
  console.error(
    picocolors.red(
      `The script ${picocolors.bold('package-resolutions-updater.cjs')} does not exist. Please run 'yarn install' first.`
    )
  );
  process.exit(1);
}

(async () => {
  const workspaces = await parseWorkspaces();
  for (const workspace of workspaces) {
    const pkg = await fs.readJSON(path.join(workspace.location, 'package.json')).catch(() => ({}));
    if (pkg.scripts) {
      if (pkg.resolutions) {
        await croSpawn.async('node', [resolutionsUpdaterScript, workspace.location], {
          cwd: workspace.location,
          stdio: 'inherit',
          shell: true,
          env: {
            ...process.env
          }
        });
      }
    }
  }
})();
