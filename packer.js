const croSpawn = require("cross-spawn");
const { renameSync } = require("fs");
const { join } = require("path");

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

const buildAllPackage = croSpawn.async(
	"yarn",
	["workspaces", "foreach", "--no-private", "run", "build"],
	{ cwd: __dirname }
);

const packAllPackage = croSpawn.async(
	"yarn",
	["workspaces", "foreach", "--no-private", "pack"],
	{ cwd: __dirname }
);

Promise.all([parseWorkspaces, buildAllPackage, packAllPackage]).then(function (
	arr
) {
	const workspaces = arr[0];
	workspaces.forEach((workspace) => {
		const tarballName = workspace.name + ".tgz";
		const tarballPath = join(workspace.location, tarballName);
		croSpawn.sync("yarn", [
			"workspace",
			workspace.name,
			"exec",
			`"mv package.tgz ${tarballName}"`,
		]);
		renameSync(tarballPath, join(__dirname, "releases", tarballName));
	});
});
