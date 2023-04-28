const croSpawn = require("cross-spawn");
const { renameSync, existsSync, rmSync, mkdirSync } = require("fs");
const { join, dirname } = require("path");

/**
 * @type {Promise<{location:string,name:string}[]>}
 */
const parseWorkspaces = croSpawn
	.async("yarn", ["workspaces", "list", "--no-private", "--json"], {
		cwd: __dirname,
	})
	.then((o) =>
		o.stdout
			.split(/\r?\n/gm)
			.filter((str) => str.length > 4)
			.map((str) => {
				const parse = JSON.parse(str.trim());
				parse.location = join(__dirname, parse.location);
				return parse;
			})
	);

parseWorkspaces
	.then((workspaces) => {
		const clean_build = (wname) =>
			croSpawn
				.async("yarn", ["workspace", wname, "run", "clean"], {
					cwd: __dirname,
				})
				.then(() =>
					croSpawn.async("yarn", ["workspace", wname, "run", "build"], {
						cwd: __dirname,
					})
				);
		return clean_build("warehouse")
			.then(() => clean_build("hexo-front-matter"))
			.then(() => clean_build("hexo-asset-link"))
			.then(() => clean_build("hexo-log"))
			.then(() =>
				croSpawn.async(
					"yarn",
					["workspaces", "foreach", "--no-private", "run", "build"],
					{ cwd: __dirname }
				)
			)
			.then(() =>
				croSpawn.async(
					"yarn",
					["workspaces", "foreach", "--no-private", "pack"],
					{ cwd: __dirname }
				)
			)
			.then(() => workspaces);
	})
	.then((workspaces) => {
		const _run = () => {
			for (let i = 0; i < workspaces.length; i++) {
				const workspace = workspaces[i];
				const tarballName = workspace.name + ".tgz";
				const tarballPath = join(workspace.location, tarballName);

				// rename package.tgz to {workspace.name}.tgz
				croSpawn.sync("yarn", [
					"workspace",
					workspace.name,
					"exec",
					`"mv package.tgz ${tarballName}"`,
				]);

				if (!existsSync(tarballPath)) {
					console.log("fail packing " + tarballPath + " not found");
					continue;
				}

				const dest = join(__dirname, "releases", tarballName);
				if (!existsSync(dirname(dest))) mkdirSync(dirname(dest));
				if (existsSync(dest)) rmSync(dest);
				renameSync(tarballPath, dest);
			}
		};

		_run();
	});
