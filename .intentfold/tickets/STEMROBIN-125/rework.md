# STEMROBIN-125 Rework

## Human Ask

- After cap4 stopped because the Charter did not define pull-request landing commands, the human
  explicitly authorized the agent to update the human-owned Charter and instructed it to finish
  and close the ticket directly.

## Changes

- Added exact GitHub CLI commands to `charter/engineering.md` for finding, creating, inspecting,
  merging, and confirming the pull request.
- Recorded the repository's current landing configuration: merge commits are supported; no required
  checks, branch protection, rulesets, overlap detector, or cap4 takeover gate are configured.
- Kept branch deletion in IntentFold cap4 cleanup rather than the merge command.
- No product code, runtime configuration, database content, environment key, or deployment state
  changed.

## Rechecked Criteria

- The four-file Charter structural check passed all four acceptance criteria.
- The mechanical defence passed: 11 test files and 75 tests passed, and the production build
  completed successfully.

## Net Effect

The frozen handoff remains accurate for the Charter migration. Relative to that handoff, the final
branch additionally contains the human-authorized pull-request landing commands required to execute
cap4 without inventing repository policy.
