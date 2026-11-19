# n40 offline author boundary

Direct assignment: STEMROBIN-182, n40 CHOICE AUTHOR, fresh source-only context.
Checkout: /Users/yong/.codex/worktrees/d9b1/lemmadeck.
Owner: .intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n40-choice-author only.
Date: 2026-11-19.

Read the current choice skill, authoring/contract/review references, and the
lesson production-resume contract. This is offline authoring, not an IntentFold
capability invocation, ticket operation, semantic approval, or integration.
No network, model calls, spend, DB, app, dependency, publishing, or Git writes.
No answer keys, interactions, existing choice content, reviewer solutions, or
historical choice content were opened.

First inspect:
python3 -B .agents/skills/ld-s10y-choice/scripts/prepare.py inspect --repo . --book 7a --lesson alg7-c4-s2-n40
Actual exit: 0. Inventory: all 14 original exercises 820-833; no figures.
Select ALL of those numbers explicitly. Select only prose blocks 6 and 7:
these name extraction and moving a factor under the radical. Their contextual
references to the introductory demonstration are retained verbatim by prepare;
no example setup, solved derivation, or example conclusion is selected.
Blocks 0-5 and 8-18 are excluded. No concept figures.

The initial directory probe `ls -ld <owned directory>` exited 1 with
"No such file or directory". This is a local output-directory condition,
not a source/content verdict. apply_patch creates files only under the owner;
prepare then creates its seed there. No unaffected stage is repeated.

Supplementary source access was needed only for the unresolved lookup tasks:
current n39 modern lesson teaching prose and its figure manifest projection.
The n39 teaching states four-significant-digit table organization and
normalization a*10^(2k), with 1<=a<100. It does not contain the required
observed Bradis cells. Its worked teaching examples are not n40 answers and
are not copied into the seed, solutions, or options.
The n39 figure manifest lists fig-55, a teaching illustration, not an observed
set of the required lookup cells. That figure was not opened or used.

Filename-only source discovery found no Bradis/table-source file under
ssot-resources/soviet10year-textbooks/sources. An initial wider filename query
also returned unrelated historical choice filenames; none of those files was
opened and no content from them was used. Subsequent discovery was confined
to the source directory. No inference of table cells from historical artifacts.
We do NOT assert that no Bradis source exists anywhere on the machine.
We assert only that the allowed, accessed source does not supply the needed
cells, and no observed table values are available to this author.

Policy: freeze the exact eight unobserved lookup tasks (829 routes 1 and 2;
830 a-d; 831 a-b) in source-solutions-FIRST.md and coverage. Retain meaningful
native method/comparison questions for 829-831. Do not replace a printed
table observation by a calculator square root, invented table value, or
unsupported rounding/correction convention.

All source solving is recorded and hash-frozen before any draft options exist.
Draft text/options/rationales are manually authored with apply_patch.
The metadata helper only runs prepare/validator, records actual receipts, and
packages hashes, coverage projections, and view-only reviewer material.
Run the structural validator once; retain actual FIRST stdout/stderr/exit.
Only an identified affected technical failure may receive a recovery run.
No semantic self-review or approval record will be created. A later separate
reviewer must read seed -> views -> keys in that order and solve independently.
