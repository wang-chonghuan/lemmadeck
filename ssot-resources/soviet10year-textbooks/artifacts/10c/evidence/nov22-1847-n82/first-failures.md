# N82 Local Execution Failures

All calls used
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
No source or mathematical approval was inferred from a tool exit.

1. The first FigureSpec validator exited2:
   `assertions[18].a`, `.b`, `.c`: expected coordinate or point id.
   The author used `points` for a collinear assertion. Only that assertion
   was corrected to `a/b/c`; validation then exited0.
2. The first renderer exited2 with three label collisions: the two top
   y labels and A. Its report records 17.3333px minimum text at640px,
   with no display-size failure. Only label positions changed.
3. The second renderer exited2 with one residual A-label collision
   (score9.331365775084123). Only the A label moved; the third renderer
   exited0. Subsequent source-first comparison justified restoring dashed
   component vectors in panel b; the fourth renderer exited0.
   All point, radius, projection and vector-sum coordinates were unchanged.
4. Resvg produced a black PNG because this preview path did not resolve
   semantic SVG CSS variables. The PNG is retained as the failed preview,
   not a passed figure. Isolated headless Chromium with the renderer's
   semantic color variables produced the actual readable preview. The SVG
   itself was not recolored or replaced to make Resvg appear to pass.

The first candidate, both failed render reports and their bound candidate
specs, first failed SVG and black preview are retained beside this note.
The first author's generating script is retained without replaying it.
Render calls:4; validator calls:2; direct image-generation service calls:0.
Parent images at this point: source1 + black preview1 + readable preview1.
Model fees and uncollected per-call wall time: UNKNOWN.
The source observer's independent first ROI failure is retained in its own
frozen `review/source-first.md`; it did not invalidate the full original view.
