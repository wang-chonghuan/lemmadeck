# b58 n19 Choice Author-Only Handoff

**FIRST / HOLD. Not a review, approval, integration or promotion.**
This detailed note contains author derivation summaries. Do not give it, the
draft, or the frozen author solutions to the independent reviewer before the
source-first and views-only blind stages.

## Blind Handoff Order

1. Read [seed.json](tmp/b58-angular-speed-choice/seed.json) and independently
   solve all four written tasks without any author answer material.
2. Read [views-only.json](tmp/b58-angular-speed-choice/views-only.json). Record
   blind fidelity, redundancy, leakage and mathematical judgments first.
   Only `view` is learner-facing; `source_numbers` and coverage remain internal.
3. After that blind record, compare
   [draft.json](tmp/b58-angular-speed-choice/draft.json) and
   [source-solutions-before-options.md](tmp/b58-angular-speed-choice/source-solutions-before-options.md).
   [author-binding.json](tmp/b58-angular-speed-choice/author-binding.json)
   binds the snapshots, scope, chronology, counts and FIRST receipts.

The parent independently authors the written answers. This author did not
consult those answers, any older answers, interaction specifications, prior
choices, tests, ticket answers or text-review calculations.

## Snapshot Binding

Canonical JSON SHA-256, computed by the skill's `prepare.py digest`:

- Seed: `c2a117d021bf9ab97310d46850859bcc44ff4169269a025b3874dc629e5a1fc9`
- Draft: `3d08fbb10b415f42a7b86bea3938d9bee61b99d15860efe9a7fa65d234890496`
- Views only: `4178fa7b634f3b4d0bb7b3702f3aa9fc7e659ca471c01afab4c7684737245786`
- Pre-options solution document, raw-byte SHA-256:
  `22b609369c62bd1a4b59f72cd0799aa5b9d74f4569bea867a32074cf075e65b1`

The full solution document was frozen at `2026-11-17T16:00:45.294Z`, before
draft.json and views-only.json existed. The later artifact-freeze receipt at
`2026-11-17T16:05:20.833Z` confirms the solution bytes remain unchanged and that
views-only is the exact `{questions: [{id, source_numbers, view}], coverage}`
projection with no intent, key, rationales or solution fields.

## Source Selection and Coverage

Authority: current ready modern-us-neutral lesson/exercises for
`8p/phy8-c1-s3-n19`, accessed through the skill's whitelist inventory.
Explicitly prepared written exercises `1`, `2`, `3`, `4` and definition prose
indices `2`, `3`, `4`, `5`, `6`. No solved example was selected.

| Written task | Whole-task response unit | Retained scope |
| --- | --- | --- |
| 1 | `angular-speed-definition-and-relation`, multiple | Angular-speed meaning and unit |
| 2 | Same coherent multiple question | Angular/linear-speed relationship and radius dependence |
| 3 | `earth-orbital-speeds`, single | Both orbital speeds; orbital radius stays 150000000 km |
| 4 | `clock-tower-tip-and-angular-comparison`, single | Generic clock tower, 3.5 m hand, tip linear speed, clock/watch angular-speed comparison |

Counts: four written tasks, five definition blocks, three questions,
two native single and one native multiple, thirteen alternatives.
Zero source figures, zero authored figures, zero opened images.
No fixed quota, per-blank series or combination-code answers.

## Independent Derivations

All of the following were established before constructing any alternatives:

- Task 1: angle swept divided by elapsed time gives angular speed; radians
  divided by seconds gives rad/s.
- Task 2: radian arc length is radius times angle; dividing by time gives
  linear speed as angular speed times radius.
- Task 3: one circular orbit sweeps `2*pi` and has length `2*pi*R`.
  The full source answer retains the unspecified period T:
  `omega=2*pi/T`, `v=300000000*pi/T km/s` when T is in seconds.
  The choice stem honestly adds a uniform circular approximation and a
  365-day period with 24 hours per day. Then `T=31536000 s`,
  `omega=1.9923849908611068e-7 rad/s`,
  `v=29.885774862916602 km/s`, rounded visibly to three significant figures.
- Task 4: a normal minute hand has a 3600-second period and the 3.5 m
  tower-hand tip travels `7*pi m` per revolution, giving
  `v=7*pi/3600 m/s`. Both hands have `omega=pi/1800 rad/s`,
  so their angular speeds are equal. No watch-hand radius is needed or invented.

Each alternative's exact derivation and mistaken procedure is internal to the
draft. These are author derivations, not an independent semantic review.

## Capacity Losses

Every original requested definition, relationship, numerical speed and comparison
has a response in the adapted set. Selection cannot prove independent production:
free-written definitions and explanations, algebraic derivation, unit conversion
working, numerical calculation and the clock/watch comparison proof are lost.

The source's Earth period is implicit. The numerical choice task adds its
period/model convention visibly rather than claiming it was provided in the
source. A separate response giving the general answer for unspecified T is not
tested; the complete general solution remains in the frozen author document.
There is no numerical watch-tip task in the source and none was invented.

## One Structural Check

Exactly one actual `validate.py` invocation, without a review argument:

```bash
node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs \
  b58-n19-choiceauthor-10-structural-first \
  python3 .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . \
  --seed .intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/seed.json \
  --draft .intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/draft.json
```

Exit `0`; stdout: `mechanical checks passed; semantic review still required`.
No validation failure, post-validation repair, second checker invocation,
self-review or final semantic review. Status remains HOLD for the parent.

## FIRST Receipts

All receipt bundles are under this ticket's `tmp/commands/`; each uniquely named
lowercase prefix has `.call.json`, `.stdout`, `.stderr`, preserved without reuse.

| Prefix | Meaning |
| --- | --- |
| `b58-n19-choiceauthor-01-inspect` | Whitelist inventory |
| `b58-n19-choiceauthor-02-new-paths` | All six authorized paths were absent |
| `b58-n19-choiceauthor-03-prepare` | Explicit seed preparation |
| `b58-n19-choiceauthor-04-source-arithmetic` | Numerical evaluation before alternatives |
| `b58-n19-choiceauthor-05-solutions-first-freeze` | Full solutions frozen with no draft or views yet |
| `b58-n19-choiceauthor-06-seed-digest` | Official canonical seed digest |
| `b58-n19-choiceauthor-07-draft-digest` | Official canonical draft digest |
| `b58-n19-choiceauthor-08-views-digest` | Official canonical blind-views digest |
| `b58-n19-choiceauthor-09-structural-first` | Accidental `node /dev/null` no-op; not validation evidence |
| `b58-n19-choiceauthor-10-structural-first` | Only actual structural checker |
| `b58-n19-choiceauthor-11-view-projection-first-freeze` | Exact blind projection, bound bytes, unchanged pre-options solutions |

An additional metadata-freeze receipt may bind this note and author-binding.json;
it does not rerun validation or review questions.

## Boundary

Only the five new files in `tmp/b58-angular-speed-choice/`, this new author note,
and uniquely prefixed command receipts were written. Source files, concurrent
written-answer work, prior FIRST/HOLD artifacts and existing dirty work were not
edited. No network, services, DB, Git, assembly, adaptation, promotion, backend,
freshness, setup, installation, tests or final-review actions were run.

Stop at this offline author-only handoff. Independent review and any later
promotion belong to the parent and require their own authorization.
