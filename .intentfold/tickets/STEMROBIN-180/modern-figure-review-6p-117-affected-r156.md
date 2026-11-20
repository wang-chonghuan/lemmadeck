# FIG117 Independent Affected-Only Review

Date: 2026-11-20. Ticket: STEMROBIN-180.
Exact status: **PASS_AFFECTED_ONLY**. No actionable affected visual finding.

Workspace: `/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck`.
Reviewer scope is only F117-DIRECTION-1's two b pressure arrows and their
association with the respective opposite-facing immersed mouths. This is not a
new whole-figure semantic review, lesson/course approval, or canonical promotion.

## Scope And Preserved Baseline

Reused the complete original source, mathematical, cultural, and unaffected
visual PASS conclusions in:
`/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/figure-117-blocker.md`.
Its original overall FAIL remains a FAIL for its original snapshot.
Baseline SHA-256: `7bcb0acc358af69a5cdc7520c879db66a28b146d9b67dacabcd6b7d1a4cd33e1`.

Read the complete current authoritative text in the candidate spec, including
s5 context and all s6 prose/tasks. Read the recovered s6 lesson/exercise
templates: 19 prose/display blocks and 10 tasks. Exact ordered text equality to
the spec and the original approved template byte hashes passed. Relevant g3-2
prompt SHA-256 remains
`8b827bbbddb5f2e587951fa284addf467fbdd316b52b14070965c699605e1549`.
No answer key or answer artifact was read, constructed, or changed.

Independent structured comparison of the complete candidate and old frozen spec
passed after normalizing only the original-source path relocation and these
two `strokeWidth` changes from 3 to 1.5:

- `source-b-deep-mouth-down-arrow`
- `source-b-straight-mouth-up-arrow`

All 80 objects' positions/directions, mouth paths, reading levels, the other
78 objects, 26 assertions, source inventory, and authoritative text are unchanged.
Existing render PASS was reused; no renderer or standalone validator was rerun.

## Personal Pixel Observation

Opened the full original PNG FIRST, once, at 847 x 426. The source's deep bent
opening faces upward and receives a downward indication; the straight opening
faces downward and receives an upward indication. Only this affected direction
association was reconsidered against the source pixels.

Then opened each of the SIX existing native PNGs once, without resizing,
cropping, reopening, or launching a browser. Screenshot directory:
`/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/s6-fig117-arrow-footprints-r156/native-affected-offline/`.

| Open | File | Native Pixels | Affected Observation |
| --- | --- | --- | --- |
| 2 | fig-117-306-neutral.png | 306 x 306 | Two small but distinct heads and shafts; left up, right down; neither merges into the old slanted symbol. |
| 3 | fig-117-306-accent.png | 306 x 306 | Colored arrows remain separate and visible against the water fill and texture; same correct mouth association. |
| 4 | fig-117-306-print.png | 306 x 306 | Grayscale retains the separation and opposite directions; no color dependence. |
| 5 | fig-117-640-neutral.png | 640 x 640 | Clearly separate vertical arrows; left tip points to straight downward mouth, right tip to deep upward mouth. |
| 6 | fig-117-640-accent.png | 640 x 640 | Both distinct colored heads/shafts remain traceable to their own mouths, not to each other. |
| 7 | fig-117-640-print.png | 640 x 640 | Both indications remain independently readable in grayscale and point toward the respective mouths. |

At 306 the affected heads are smaller than the five unchanged arrows, but both
opposite indications remain visible and distinguishable at the captured native
size. This is not a claim based only on arrow object counts or label metrics.
The left upward tip sits just below the straight tube's downward mouth; the
right downward tip sits just above the deep U tube's upward mouth.

Reused, hash-verified native transformed filled-triangle metrics corroborate
these observations: separating-axis gap 1.8694687472926432 px at 306 and
3.909999994337568 px at 640, in every theme. Seven arrowheads are retained;
minimum label size is 17.2125 px at 306 and 36 px at 640. These are existing
headed-capture measurements, not newly executed browser checks or a second
unaffected visual approval.

Image accounting: original 1 + saved native screenshots 6 = **7 opens**;
reopens 0; crops 0; extra full-SVG image opens 0; new screenshots 0.
No images are embedded in this textual handoff.

## Current Binding

| Artifact | Full SHA-256 |
| --- | --- |
| Original PNG | 4a505fab84fff7c89224cd2f8fa062b4acb3245db2435d5090a9bdd21aeb517f |
| Old frozen spec | c9148e3e583f1e953bb02a9c8059391fdeb962452e7d284c0e2f11edc35275b4 |
| Current spec | a0c7b508ebd6ac2726691b6b289f2fe4449266d1a9e12a58cfb34d39fc83017d |
| Current SVG | a84b8c50f62e0de5871755f5f7da0138502911226c0c3eda146fd294594ad16a |
| Existing render | df3980496c68a32eb09ebfcc8b17be62a7ded2c0cf6819735d8a7e2f53fecb55 |
| Delta contract | 97b3a82bcff44981edf3a38d02521f3a6b9a120afa38037566f1a5ea72c892c5 |
| Existing native record | 2cd8a3aed694164407425ec4ad0e11805d4f039cd0cd6eb9212520e557110489 |
| Unique PASS-recorder receipt | 073252a43f8fd408c5593fd0be56be40cc2430218ca7907d3bd14d0d6c8bcbd4 |

Own output root:
`/Users/yong/.codex/worktrees/stemrobin-180-six-7161/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6-7161/s6-fig117-affected-independent-r156/`.
`fig-117.review.json` was produced by existing `record_review.py` ONCE with the
current spec/render and `--status pass`. Notes explicitly identify affected-only
baseline reuse and `originalFAIL1of1+authorizedlayout1`.
`manifest.json` binds full SHA-256, byte counts and absolute paths for all actual
inputs, outputs, native PNGs, and unique command receipts; only own outputs are
frozen 0444. The unchanged existing W recorder is invoked through an owned
symlink with `--preserve-symlinks-main`, keeping its receipt sink within ownership.
Bootstrap reads, symlink creation, and final output-only sealing are direct
local operations; no retrospective command receipts are fabricated.

## History And Limits

Original author FAIL 1, original independent FAIL F117-DIRECTION-1, and original
correction usage **1/1 consumed** are retained. The latest direct human
authorization permits the parent's separate reversible layout repair:
authorized layout repairs 1, cumulative correction events 2. This review adds
zero repairs and resets no history, budget, failure, or cost. Recovery and
candidate existence were not treated as approval.

The existing native unit-parser and offline-import failure receipts remain
hash-bound and unchanged. No paid call, DB/publisher action, tests, dependency,
network, manual environment, Git, new worktree, attach, old-chat access, reviewer
wake, canonical edit, usage edit, or checkpoint edit occurred.

**PASS_AFFECTED_ONLY** applies to the exact current FIG117 snapshot above.
Full lesson validation, offline lesson closure, answer/choice/display approval,
canonical retention, publication, and whole-course claims remain outside this
review. Finish: review.
