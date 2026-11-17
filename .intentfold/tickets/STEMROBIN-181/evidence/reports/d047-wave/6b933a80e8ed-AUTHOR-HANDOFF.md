# n39 Offline Choice Author Handoff

Status: frozen author candidates, structurally valid, awaiting a fresh independent
reviewer. No semantic approval, review artifact, full-card claim, promotion,
publication, or ticket-state change.

Owned writes stayed under:
`/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d047-n39-choice-author/`.
No DB, `.env`, network, model service, dependency, app, shared tool, Git, product
index, or meter writes. No supplied answers, previous choices, interaction
configuration, or ticket histories were consulted. No n40 work was touched.

## Frozen Artifacts

For blind review, dispatch only `REVIEWER-ENTRY.md` and its stage-1 inputs first;
do not send this author's solution-bearing handoff or full drafts initially.

EN projection:
`/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d047-n39-choice-author/en/repo`.
EN seed/draft: `.tmp/choice/seed.json`, `.tmp/choice/draft.json` under that projection.

ZH projection:
`/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d047-n39-choice-author/zh/repo`.
ZH seed/draft: `.tmp/choice/seed.json`, `.tmp/choice/draft.json` under that projection.

All source relationships remain n39. Both synthetic local `book.json` files
declare book identity `10p` and only lesson identity `phy10-c1-s5-n39`.
These are disposable projection identities, not modified product indexes.
Approved n39 `lesson.json`, `exercises.json`, `figures.json`, and declared final
figure bytes are copied mechanically unchanged. Copied manifest references to
spec/review/report files were not read or used; those files were not copied.
Only Figure 70 is used in the questions.

`independent-solutions.json` contains six bilingual independently derived source
solutions. `solutions.freeze.json` bound those solutions, both seeds, selection,
image log, and both n38 contexts before any draft file existed. The pre-draft
freeze and original/projection byte bindings were checked again before and after
structural validation without changing them.

`selection.json` records explicit exercise selection 1-6 and n39 concept blocks
0, 2, 3, 4, 6, 11. Exact approved n38 prose blocks 0, 5, 6, 7, 8 are bound in
`en/n38-context.json` and `zh/n38-context.json`, with per-problem bindings for
1-3 and the figure convention for 6. No solved exercise examples were selected.

`en/learner-view.json` and `zh/learner-view.json` contain the complete key-free
learner views. Their question IDs, option IDs, modes, figure IDs, source mappings
and author keys match mechanically; semantic equivalence is not self-approved.

`snapshot-manifest.json` records absolute paths, canonical and byte hashes,
counts, validation paths and limitations. `en/draft.freeze.json` and
`zh/draft.freeze.json` retain the individual frozen candidate bindings.

## SHA-256

Seed/draft hashes below are native canonical JSON digests, not file-byte hashes.
The manifest also includes every seed/draft file-byte hash.

| Artifact | SHA-256 |
| --- | --- |
| EN seed | `2b6531b85a23a1f90b4fcef88d9e0e24702a7eaafb015f8453f2c00a3a8e6d72` |
| EN draft | `4889e58bb504ee98590466143a112d451072196613ae69a3cfba6c21b80a580e` |
| ZH seed | `78794ae8dfe8167cb33978e93e3f7e08f6db8e7dabc22de6bdc2f5e7abe7f1fb` |
| ZH draft | `62af77ce122f38ae6ba0d9c3ca06a8aa0630b7ff0bb5f519699b555df6259223` |
| Independent solutions, bytes | `9c44243233e12ac1e999b64e6d535d506c3862875ebe1d68e5757de893a567b8` |
| Approved Figure 70 SVG, bytes | `4bae69e25800526c2b16adca5af0d6c71bb013159e240e6d4474e72cd15fba9f` |
| EN n38 context, bytes | `6a362090f8c0ea916bcee8726386f177567883092df6bcd60736aed90e7bc2dd` |
| ZH n38 context, bytes | `b833116f4fa3c93d8a8c19d98936ba6b39bb70261de1fc191e4709e6bbefe72c` |

## Counts and Coverage

Each language: 6 selected source problems, 6 selected n39 concept paragraphs,
5 separately bound n38 paragraphs, 5 questions, 4 single + 1 multiple, 21 options,
1 source figure used, 0 new figures, 0 entirely deferred source problems.
The two language drafts represent 5 mathematical items, not 10 distinct tasks.

Problems 1 and 3 are merged into one multiple-selection response: define
propagation of vibrational disturbance and distinguish local material motion
from disturbance/energy transfer. Problem 2 retains both direction comparisons
and both examples in every complete alternative. Problems 4-6 each retain their
complete definition, relationship, or figure-based calculation task.

## Exact Structural Runs

EN:

```bash
env PYTHONDONTWRITEBYTECODE=1 python3 /Users/yong/.codex/worktrees/00b1/lemmadeck/.agents/skills/ld-s10y-choice/scripts/validate.py --repo /Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d047-n39-choice-author/en/repo --seed /Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d047-n39-choice-author/en/repo/.tmp/choice/seed.json --draft /Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d047-n39-choice-author/en/repo/.tmp/choice/draft.json
```

ZH:

```bash
env PYTHONDONTWRITEBYTECODE=1 python3 /Users/yong/.codex/worktrees/00b1/lemmadeck/.agents/skills/ld-s10y-choice/scripts/validate.py --repo /Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d047-n39-choice-author/zh/repo --seed /Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d047-n39-choice-author/zh/repo/.tmp/choice/seed.json --draft /Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d047-n39-choice-author/zh/repo/.tmp/choice/draft.json
```

Each command ran exactly once on its frozen candidate. Each returned exit `0`,
stdout `mechanical checks passed; semantic review still required` followed by
a newline, and empty stderr. No `--review` was supplied.
Exact argument arrays and outputs are retained in `en/validation-result.json`
and `zh/validation-result.json`. No validator rerun or self-approved gate occurred.

The first projection `inspect` attempt failed because the scratch script resolved
the tool path one directory too high. It returned exit `2` without source
inventory. The failure is retained in `en/inspect-result.json`, together with the
empty initial inventory. After correcting only the owned projection script, both
successful whitelist inspections and both prepares returned exit `0`. This was
not a candidate structural-validation failure or extra validation run.

## Images Opened

Exactly 3 this batch and 3 this context, within the limits of 8 and 24. No crops,
later reopens, additional figure images, or screenshots were loaded.

1. `en/fig-70.full.png`: complete transparent-paper rasterization; poor contrast
   on the viewer's dark background; counted and retained, not the sole evidence.
2. `en/fig-70.on-white.full.png`: full approved EN SVG on white paper, uncropped.
3. `zh/fig-70.on-white.full.png`: full approved ZH SVG on white paper, uncropped.

`image-open-log.json` records every absolute path, image and source byte hash,
tool/detail, sequence and textual observation. Both white renderings are
1280x3060 with all panels a-f, balls 1-18, rightmost time labels and bottommost
wavelength markers visible. They are inspection derivatives, not new figures.

## Limitations and Review Boundary

Choice recognition cannot demonstrate unaided definitions/explanations, free
example generation, or production of the calculation. These production losses
are named per question and per source in both drafts; semantic coverage still
requires independent judgment.

The native schema cannot bind cross-lesson context directly. Exact n38 prose and
its source hashes are separately bound; native structural success alone does not
certify that supplement. The scratch wrapper checked those bindings and the
approved source bytes, but this is not a semantic review.

The Figure 70 task explicitly requests the smallest unsigned phase magnitude
after both neighbors have been reached. This resolves the otherwise implicit
phase-sign and undisturbed-tail conventions without leaking the interval count.

No app/card or responsive rendering was authorized or performed. Full intrinsic
figure inspection does not establish app-scale legibility. Structural validation
does not prove task fidelity, nonredundancy, lack of leakage, correctness or
plausibility of every option, or bilingual semantic equivalence.

Ready for a fresh independent reviewer following `REVIEWER-ENTRY.md`. Do not
claim review pass or promote these candidates based on this author handoff.
