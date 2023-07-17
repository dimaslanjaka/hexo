const croSpawn = require('cross-spawn');
const { gitCommandHelper } = require('git-command-helper');

const git = new gitCommandHelper(__dirname);

git.latestCommit().then((lastCommit) => {
  croSpawn.async('git', ['rev-list', '--parents', '-n', '1', lastCommit], { cwd: __dirname }).then((result) => {
    const commits = result.stdout.trim().split(/\s/);
    const hasCommit = commits.some((str) => str.startsWith(lastCommit));
    console.log(hasCommit, commits, lastCommit);
  });
});
