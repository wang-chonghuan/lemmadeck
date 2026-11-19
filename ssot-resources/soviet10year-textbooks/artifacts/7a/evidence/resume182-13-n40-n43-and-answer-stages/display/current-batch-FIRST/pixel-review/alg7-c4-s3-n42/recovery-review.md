# Affected Pixel Coverage Recovery

Affected display: PASS
Lesson: alg7-c4-s3-n42
Ticket: STEMROBIN-182
Viewport: headed 390x844, as recorded by RECOVERY2
Checkout: /Users/yong/.codex/worktrees/d9b1/lemmadeck

## Evidence Binding

RECOVERY2 `result.json` is command PASS with three checks. SHA-256:
`c0d3693f3640fcc447e1217a2689b0e72210e8559611bd072b90f5ffcbef7fa0`.
All three screenshot hashes were verified. Bound text and choices HTML bytes
were hashed only, not read for semantic review. Both hashes match FIRST:

- Text HTML: `3c406ee9a08c7082ab9ef37f63f95571078eddebdadf1a1a4f127d2e706bf4f6`.
- Choices HTML: `dfd2b88f8a9ae0ad7e8134751db157ba0b9f26e3ac68290bbee30ba78b5b0a6b`.

The receipt binds the unchanged parent command result. No figure/content
revision is indicated. The failed RECOVERY1 attempt remains untouched;
its files/images were not opened.

Exactly three newly authorized PNGs were opened once in one batch, all with
`detail=original`: 343x1356, 343x402 and 343x2352. All were returned complete
without a tool resize notice. Reopens: 0. Additional crops: 0.
FIRST's six screenshots were not reopened.

## Affected Observations

1. Text / figure 58 / right side: B, its projection, positive-x ticks, x label
   and arrow, rising parabola and its label are readable. The right plot/grid
   boundary and bottom are visible. Caption 58 is readable and adjacent below.
   No observed collision obscures the affected labels or plotted region.
2. Choices / choice 3 / right side: positive-x ticks 1-4, x label, solid curve,
   dashed line and the right/bottom frame boundaries are visible and readable.
   The right-end scroll thumb is visible. No observed missing rightmost plotted
   region or label-obscuring overlap.
3. Choices / choice 4 / frames A-F / right sides: all six distinct panels have
   readable positive-x ticks 1-4 and x labels, visible solid/dashed right-hand
   graph regions, and right/bottom panel borders. Bottom frame F was inspected
   to its bottom border and rightmost plotted region. It is not truncated or
   a repeat of an upper panel.

Clipped left-edge labels and absent left-side frame titles in these right-scroll
slices belong to the already-observed overlapping FIRST views. Those headings
and left-side pixels remain inherited; no single right slice is represented as
a standalone full-width figure.

## Current Scroll End

The locator screenshots change available client width for the long figures.
For figure 58 and the six-panel figure, the receipt records clientWidth
343 -> 358 and scrollLeft 297 -> 282. With unchanged scrollWidth/mediaWidth 640,
the actual current maximum is 640 - 358 = 282, which matches afterScreenshot.
For the choice-3 graph, clientWidth remains 343 and the current maximum remains
640 - 343 = 297, also matched.

This recovery checked the current maximum, not a stale required value of 297.
The left and right evidence regions overlap, and the newly observed plot/frame
right boundaries close the specific FIRST coverage gaps.

## Verdict And Limits

Affected display PASS: the two FIRST missing-right-region blockers are resolved
by these supplementary pixels. No remaining blocker was observed within the
authorized affected scope. FIRST remains frozen with its original blocked
verdict; this separate receipt supplements rather than edits that history.

FIRST's long choices images were tool-resampled from 1425x8295 to 1031x6000 and
375x8535 to 264x6000. Native-pixel legibility across those whole pages remains
uncertified. This limitation is retained honestly; unresized recovery pixels
certify only the affected graph regions, not unrelated prose/options elsewhere.

Passed FIRST text/layout observations, captions/headings outside these slices,
last written item 854 and last choice 5 presence, and machine count/16px/math
scroll/layout/private-field/control checks are inherited. Source, answer,
choice and two-figure semantic approvals are inherited. No math, source,
coordinate, equation, option-key or application-grading review was performed.

Only the three separate recovery artifacts in the assigned review directory
were written and frozen 0444. FIRST files and RECOVERY1/RECOVERY2 inputs were
preserved. No fix, render, browser, capture, network, application, product,
database, dependency or commit action was performed.
