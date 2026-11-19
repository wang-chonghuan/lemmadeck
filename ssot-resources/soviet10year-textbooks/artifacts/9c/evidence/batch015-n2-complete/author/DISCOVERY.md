# Candidate discovery

Invocation: STEMROBIN-184, worker184-3, open-development continuation.
Workdir for every command: /Users/yong/.codex/worktrees/a07e/lemmadeck
Owned output: .tmp/s10y-choice/batch015-ana9-n2-repair/
The output directory did not exist before this invocation.

## Exact observations

- `find .tmp/s10y-choice .intentfold/tmp .intentfold/tickets/STEMROBIN-184/tmp -maxdepth 4 -type f ... -print` exited 1. Its stderr was exactly `find: .intentfold/tmp: No such file or directory`. Its filename-only stdout listed unrelated batch013/batch014 and production paths, not a batch015 or ana9-c1-s1-n2 candidate. No listed unrelated file was opened.
- Directory-name discovery under `.tmp` and the ticket's `tmp/`, first to depth 3 and then recursively with source/runtime/evidence/answer/display/image/offline/dependency directories pruned, exited 0 with empty stdout and stderr for names matching batch015, ana9, or book9c-choice.
- Filename discovery for `*ana9*` and `*batch015*`, with forbidden corpus paths excluded, exited 1 with empty stdout and stderr. This is a no-match result, not a mathematical failure.
- `.tmp/s10y-choice/` contains only batch013/batch014 directories. Their contents were not consulted.
- The top-level `.tmp/` directories were listed by name only. Source, answers, displays, images and runtime/evidence packages were not opened.
- The ticket `tmp/` has no relevant top-level choice directory; its only top-level choice-named files are unrelated retention/reordering scripts, which were not read or run.
- The official whitelist `prepare.py inspect --book 9c --lesson ana9-c1-s1-n2` exited 0. It returned written exercises 3 through 9 and an empty figure inventory.

No original ana9-c1-s1-n2 choice seed, draft, or review was located within these authorized candidate-discovery paths. No search was expanded to runtime/evidence corpora, another worktree, canonical choice sets, answer keys, or backend history.

## Consequence

This is the explicitly authorized missing-candidate fallback, not a claimed minimal delta against an available original. Original snapshot hashes, exact question text, original key/order and independent review receipts are unavailable. They cannot be reconstructed from the user's concise historical description.

The human reports an initial rejection, later q1/q5 affected passes, and q3 mathematics/coverage pass with answer_leakage revise. Those are context only, not locally available hash-bound approvals. No old repair counter is treated as an approval requirement. A fresh source-bound choice candidate will be delivered with independent semantic review pending; the already approved lesson prose, written exercises and standard answers remain untouched.

Images authorized/needed/opened/created: 0/0/0/0.

## Later shared-worktree observation

After this candidate was created, the recorded `discovery-scoped` repeat excluded
this owned output and returned new, unrelated batch015 paths created by other
workers (geo68, geo910 and ana10). It still returned no ana9-c1-s1-n2 original
candidate. Those directories were not opened or changed. The initial empty
observations above describe the earlier discovery instant, not an assumption
that the shared worktree remains static.

The exact later stdout/stderr, exit codes and closed-stream receipts are saved
in `commands/discovery-scoped.*` and `commands/discovery-intentfold-tmp.*`.
The latter exited 1 with empty stdout/stderr, confirming the missing
`.intentfold/tmp` directory; it is not a content or validation failure.
