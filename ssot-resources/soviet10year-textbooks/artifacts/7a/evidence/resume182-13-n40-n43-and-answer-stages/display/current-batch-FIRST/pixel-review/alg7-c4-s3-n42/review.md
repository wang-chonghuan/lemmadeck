# Bounded Pixel Review

Status: blocked
Lesson: alg7-c4-s3-n42
Ticket: STEMROBIN-182
Checkout: /Users/yong/.codex/worktrees/d9b1/lemmadeck

## Scope And Provenance

Read the image-batch rules in `.agents/skills/ld-s10y-image/SKILL.md`,
the lesson `production-resume.md`, and relevant charter operations and boundaries.
This was an offline pixel observer only, not application grading or publication.

The parent `display/current-batch-FIRST/result.json` is `pass` with 18 checks.
Its SHA-256 is
`2aaf403648d8820d568cb02d38229aaababe215023cf7066e14173c3d3173485`.
Exactly the six checks for this lesson were selected. All six PNG hashes matched
the parent receipt before viewing.

One batch, six complete PNG opens, each requesting `detail=original`.
Total images opened: 6. Reopens: 0. Crops: 0.
No draft, seed, answer file, earlier screenshot or other lesson image was opened.

Source, answer, choice and two-figure semantic approvals are inherited.
The reported 4 written items, 5 choices, 22 options and passed count, 16px,
math-scroll, layout, private-field and control checks are inherited, not rerun.
No math/source/key adjudication was performed.

## Observed Pixels

- Text, 1440x960: orderly heading/prose/math flow; no observed overlap.
  Figure 58 is readable and visible through its bottom and rightmost region,
  with both point labels and graph labels. Its caption is directly below it.
  Final prose is present.
- Exercises, 1440x960: items 851-854 are visible; the review heading and full
  final item 854 expression/substitution line have bottom clearance.
  No observed clipping or overlap.
- Choices, 1440x960: all question/table blocks through question 5 are visible.
  Question 3's graph and question 4's frames A-F have visible bottom and right
  boundaries. Bottom frame F is distinct and complete in the returned image.
  Choice 5's expression, substitution line and options a-d are present.
- Text, 390x844: readable wrapped text/math, adjacent figure-58 caption and
  final prose. The graph's bottom is visible. Its rightmost region is not.
- Exercises, 390x844: readable wrapped stems/math and all written items;
  item 854's full expression and substitution line are present.
  No observed text/math collision or bottom clipping.
- Choices, 390x844: readable table/section flow in returned pixels, all six
  distinct frames A-F visible vertically, bottom F observed, and last choice 5
  complete through option d. The graphs' rightmost regions are not visible.

Both long choices images were automatically resampled by the viewing tool:
desktop 1425x8295 to 1031x6000; mobile 375x8535 to 264x6000.
The returned images include their bottoms, not repeated/cropped upper regions.
Native-pixel text/label legibility is not independently certified by these
resampled views. No retry or crop was made.

## Blocking Coverage

1. Text / 390x844 / figure 58 right edge: the image ends near the central
   y-axis. Point B, the positive-x ticks and x-axis arrow, and the right-hand
   parabola label are outside the observed pixels. Caption legibility and the
   visible bottom do not establish that unseen region.
2. Choices / 390x844 / question 3 graph and question 4 frames A-F:
   the positive-x/rightmost graph portions and right borders are outside the
   screenshot. This explicitly applies to bottom frame F, whose vertical extent
   was seen but whose right-hand extent was not.

The inherited machine checks establish reachable horizontal scrolling.
The static mobile screenshots show only the initial visible graph portions;
this review does not classify that intentional scrolling as a product defect.
Full-graph mobile pixel approval is blocked by incomplete visual coverage.
No unseen rightmost region is approved, and no bottom region is claimed unseen
when it was actually returned.

## Preservation

Only this assigned review directory was written. No fix, render, browser,
new capture, product edit, database, network, application/dependency action or
commit was performed. `result.json`, this review and `hashes.sha256` are frozen
at mode 0444. The hash manifest binds the parent receipt, six input PNGs and the
two review documents; its own hash is returned separately.
