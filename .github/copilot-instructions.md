# Repository Instructions

## Git Operation Protocol
When the user requests a git operation related to synchronizing branches, updating from a remote, or rebasing, the agent MUST use the following skills instead of executing raw git commands:
- For synchronizing local and remote branches: Use the `git-sync` skill.
- For rebasing the current branch: Use the `git-rebase` skill.

This ensures that local changes are safely stashed and conflict resolution follows the project's "preserve both" strategy.
