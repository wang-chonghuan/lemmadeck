# AI Agent Session Bootstrap

Use this file as a lightweight entry point for a new AI-agent session in this repository.

## 1. Load Repository Instructions

Read `AGENTS.md` first. Active system and developer instructions take precedence.

## 2. Load IntentFold Context

Read `.intentfold/readme.md`, then follow its order:

1. `.intentfold/project.json`
2. `.intentfold/charter/product.md`
3. `.intentfold/charter/engineering.md`
4. `.intentfold/charter/ui.md` when the task touches UI
5. `.intentfold/charter/operations.md` when running, testing, querying, migrating, deploying, or
   operating the product
6. The live ticket and its artifacts

The Charter is human-owned. An agent edits it only when the human explicitly requests a Charter
change.

## 3. Load Current Module Knowledge

Read `.evodocs/modules/module-index.json`, then the relevant module documents. Evodocs describes
reverse-engineered current state, not product intent; verify task-critical facts against source.

## 4. Select the Workflow

Load the current `intentfold` skill and use its routing table. Product changes require a ticket in
the backend named by `.intentfold/project.json`.

Before acting, inspect the current branch, upstream, dirty status, existing ticket artifacts, and
relevant source. Never discard or overwrite pre-existing workspace changes without explicit human
authorization.
