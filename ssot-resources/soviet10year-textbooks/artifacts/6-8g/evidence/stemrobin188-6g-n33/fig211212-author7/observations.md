# Author observations and bounded handoff

Status: authored candidates awaiting independent review. This is NOT a
`ld-s10y-image/review@1`, final PASS, source finalization, or promotion.

## Current candidates

- fig-211: candidate-2. Desktop 640px and mobile 358px visually inspected.
  Three distinct finite traces are present: descending b, ascending c meeting
  at P, and lower horizontal a. P has a small marker and its label now has
  clear space above the crossing. All four labels are readable; no arrows,
  infinite extensions, parallel marks, extra point labels, or values appear.
  The literal finite segments miss a. This says nothing about global
  Euclidean parallelism.
- fig-212: candidate-1. Desktop 640px and mobile 358px visually inspected.
  Both traces are curved, intersect at modern-labelled K, and continue beyond
  K to two upper tips. Two distinct feet share the baseline. Two inward-facing
  right-angle corners remain visible. Both lower tails remain, the right
  longer. The baseline ends are plain. No foot label, center, radius, value,
  equality, arrow, boundary of a model, or independent crossing dot was added.
- Both SVGs are nonblank, contained at both requested display widths, and have
  legible dark semantic-role strokes on white. The only source-derived visible
  labels are modern Latin a,b,c,P and provisional K. Exact source glyph/script
  identification remains UNKNOWN.

## Actual failure and revisions

The first fig-211 renderer exited 2: `src211-P-label` had stroke-clearance
score 10000. The label's padded footprint intersected a trace. It was NOT a
mathematical-source verdict or a discovered geometry defect. The first spec,
SVG, failing report, initial desktop screenshot, and call output are retained.
Its label sizes already met the declared thresholds.

One affected revision changed only `src211-P.labelPlacement.offset` from
`[8,-10]` to `[8,-28]`. Coordinates, incidences, input text, and other objects
were unchanged. Candidate-2 renderer reported no collision. Fig-212 had no
render failure or revision. Nothing was discarded or overwritten.

Actual totals: 1 failed figure-render attempt; 0 additional tool execution
faults; 0 source/mathematical author defects identified; 0 failed image loads.
The initial absence of the requested NEW output directory was an expected
read-only ownership check, not an execution repair.
Content revisions: fig-211 = 1 (label spacing), fig-212 = 0.
Candidates: fig-211 = 2, fig-212 = 1.

## Mathematical basis

fig-211 expresses the supplied text's non-Euclidean negation of the unique
parallel axiom: P is off a, and two distinct abstract geodesics b,c through P
do not meet a. The sketch preserves their visible meeting at P above a.
`pointOnLine` assertions bind only the displayed carrier incidence; the
author audit additionally checks P lies within BOTH finite segments and
that the finite segments miss a. There are NO `parallel` assertions.
No complete Euclidean-line extension is claimed. The finite PNG is neither
a proof of global nonintersection nor an exact model of the hypothesis.

fig-212 expresses the supplied text's non-Euclidean conceptual statement
that two geodesics perpendicular to a common geodesic can meet. The
illustration uses two circular arcs solely as a modern smooth regularization.
The hidden display centers are `(12.8,1.5)` and `(-3.6,1.5)`, with display
radii 10 and 11. The baseline has display coordinate `y=1.5`, with feet
`(2.8,1.5)` and `(7.4,1.5)`. The radii at those feet are horizontal, so the
circle tangents there are vertical and perpendicular to the baseline.
The upper intersection is computed from both circle equations, belongs to
both finite rendered arc spans, and is labelled K. The radii are deliberately
unequal, but that choice is NOT a source-given inequality or measurement.
These coordinates are renderer parameters only, not an asserted source
metric/model, and the circles are not claimed to be geodesics in any
unspecified geometry. No Euclidean perpendicularity claim is made about
the curved traces as whole straight lines or about their endpoint chords.

## Limits and image ledger

Exactly 7 image loads out of 8 for this batch and 24 for this context:

1. Original fig-211 PNG, once.
2. Original fig-212 PNG, once.
3. fig-211 candidate-1 desktop-640.png (failure snapshot).
4. fig-212 candidate-1 desktop-640.png.
5. fig-212 candidate-1 mobile-358.png.
6. fig-211 candidate-2 desktop-640.png.
7. fig-211 candidate-2 mobile-358.png.

Five screenshots generated and all five inspected. Zero crops or reopens.
No other source figure was opened. No paid image generation.
The mobile minimum measured label size is 17.9px at 358px; desktop is 32px.
The existing inline validator also requires a <=352px width, so 352px is
declared and checked by the renderer (17.6px), without another image load.

Evidence is an isolated offline headless Chromium display of the actual
renderer-produced SVG. All capture browser requests were blocked. It does
not establish headed-product placement, independent mathematical/source
fidelity review, or product integration. Source glyph/script and exact
line-dash uncertainties remain UNKNOWN. Smooth continuous strokes and
Latin typography are deliberate provisional author regularization.

The input template and originals are bound by hash without editing them.
The first A/B versus P/Q equivalence proposal is unapplied and irrelevant to
these drawings; the historical initials change has no figure effect.
The author did not access answers, old choices, interactions, tests, env,
DB, network, Git, dependencies, subagents, other chats, canonical figure
assets, assembly, indexes, or publication. Only this new owned directory
was written.
