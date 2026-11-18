# Figure 37 CAP1: SOURCE / Measurement HOLD

Status: bounded CAP1 complete with unresolved source geometry and measurement
meaning. This is a local draft planning result, not modern-edition approval,
a failed renderer result, or a ticket-wide stop.

Workspace: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch supplied by the human: `codex/STEMROBIN-182-textbooks`; no Git operation.
The human reports the RAW lesson narrowly committed/pushed; no remote check was
made and no authority was transferred to the modern drafts.

## Inputs and Observation

`candidate-context.json` freezes all three proposed modern templates, the actual
RAW n28 lesson/exercises, RAW page 183 metadata, and the source PNG. The templates
are draft proposals, not finalized edition text. The complete relevant 624 text
is preserved there, unchanged from RAW, with its actual `pages` reference
`p0183#9`. The page figure and caption metadata are `p0183#10` and `p0183#12`.
RAW and draft each contain 21 source exercises, 611 through 631.

The original `fig-37.png` was displayed exactly once, with `detail: original`.
Its SHA-256 is
`3cae2f4d6f6705d9ec4f959580fcb98d85edab197068313dad9954e6a32fed95`;
its PNG header reports 367 x 260 pixels. No crop, reopen, alternate image,
source-page grid, modern output, or parent image payload was inspected or emitted.

The independent `source.inventory` in `source-inventory.json` records the
trapezoid-like outer boundary, one nearly circular unhatched interior, diagonal
hatching outside that interior, and the absence of labels, points, given values,
or a scale. Rough ink contacts do not establish exact circle tangencies. Future
object IDs and assertion goals are explicitly unresolved, not fabricated
executable mappings.

## HOLD Reason

Exercise 624 asks the learner to make the necessary measurements before finding
the hatched area. Its draft text supplies neither dimensions nor a replacement
measurement policy. Resizing the diagram changes those measurements; snapping
the outer shape or inner curve to convenient exact geometry can also change the
task. No area, solution, or numerical geometric fit was calculated.

RAW page 183 records render DPI 300, but its figure box is explicitly a rough
estimate. The recorded box is 343 x 236 pixels whereas this PNG is 367 x 260;
the exact crop transform was not confirmed. No metric pixel calibration,
original-print-size fidelity, physical display scale, measurement units,
precision, product media widths, or source-to-product metric transform is
established. Unknowns remain `null`, not inferred from DPI.

The existing skill routes measured geometry to deterministic construction.
Its FigureSpec and quality gate support exact objects, executable assertions,
aspect preservation, and display-width legibility checks. Those checks do not
establish a physical measurement contract or approve idealizing scanned
boundaries. A successful or byte-identical render would not resolve this HOLD.
Therefore no renderable FigureSpec, metric coordinates, SVG, or source fallback
was created. `source.authoritativeText` was not populated as if drafts were final.

## Justified Draft Plan

Route: `deterministic`, conditional on resolving the HOLD.
Display purpose: `instructional`, independent of route.
Keep the outer boundary, excluded inner hole, and clipped diagonal hatching
inspectable. Use the existing FigureSpec objects/assertions and semantic color
roles after geometry confirmation; introduce no dependencies. No modern
annotations or regularization are justified now.

Layout, maximum width, actual product widths, canvas, dimensions, geometry
objects, assertions, and calibration remain `null`. Future visible text must
meet the existing 16 px minimum at actual product widths; labels being absent
does not prove the measurable boundary is legible or scale-correct.

## Required Future Stage

On separate explicit authorization, first resolve source geometry/contact
uncertainty and obtain a measurement-preserving edition/display policy with
calibration provenance and tolerances. Do not silently invent that policy,
rewrite 624, or add a ruler or dimensions. Confirm the modern draft text through
the lesson-owned approval stage.

Only then complete a valid draft FigureSpec with resolved inventory mappings and
source-bound assertions. CAP2 validation/rendering and CAP4 source, visual,
cultural, and actual-width/offline review remain future stages. None is approved
or started here; the offline pause remains in effect.

## Execution Receipt

Actual scope usage: 1 image view, 1/8 of the bounded image batch and 1/24 in this
fresh context; 0 reopens/crops/other images; 0 paid image calls; 0 renderer runs.
Shell command invocations: 30 including the final local binding verification.
One discovery `rg` exited 2 because this new output directory did not yet exist;
that is a discovery outcome, not a source, mathematics, or rendering failure.
All shell calls used the exact workspace explicitly.

One manual `apply_patch` created these three new candidate/report files. The
last shell command only verifies frozen bindings and mechanically writes a new
exclusive-create `verification.json` receipt under this same allowed directory.
That receipt is not FigureSpec validation, acceptance, or figure approval.

No DB, publishing, app execution, Git, network, old-chat lookup, agent
delegation, modern finalization, production-counter update, answer/key read,
math-solution work, renderer, or active-edition write was performed. No next
figure was started and no other worker's files were modified.
