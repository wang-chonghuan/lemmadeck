# n36 / 774 / Independent New-Figure FIRST Gate

**Status: PASS, both new figures. Figure-only approval, not question approval.**

Reviewer: Codex, independent of Bohr, the graph author. Sole cwd:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

Only the two final, complete 640x640 previews were opened, once each.
Image usage: 2 new images, 2 total; no old previews, crops or reopens.

## Line Pair: REPAIR1

`fig-choice-n36-774-line`

- Original written 774 and `authoredBasis` agree on `y=sqrt(x)` and `y=6-x`.
  No original image is claimed or invented.
- Full unit grid has 12 by 12 cells over `x=[-1,11], y=[-5,7]`.
  Both axes use `45.714285714285715 px/unit`. The rightmost `11`, bottommost
  `-5`, origin, legends and axis labels are all visible and legible.
- The sqrt curve uses quadratic user controls
  `(0,0), (0,sqrt(11)/2), (11,sqrt(11))`. Its parameterization is exactly
  `(11*t^2, sqrt(11)*t)` before decimal encoding, with `y>=0, y^2=x`.
  Actual encoded controls differ by at most `3.554001537509066e-10` units;
  the screen-error bound is `3.232488142567075e-8 px`.
- The line's actual endpoints `(-1,7), (11,-5)` both satisfy `x+y=6`.
  The window retains its negative values, including `x=9, y=-3`.
  The finite drawing window is not a domain restriction or the smaller
  equation-feasibility interval `[0,6]`.
- In the actual preview the solid sqrt and dashed line cross readably at
  grid location `(4,2)`, consistent with inherited source evidence.
  No dot, coordinate label, special guide or answer annotation marks it.
- All 29 SVG text labels are 20 px, exceeding 16 px at the declared 640 px
  scroll-media width. Existing validation receipt is exit 0; the current
  render is pass with no collisions. The actual raster is clear and complete.

## Reciprocal Pair: FIRST

`fig-choice-n36-774-reciprocal`

- Original written 774 and `authoredBasis` agree on `y=sqrt(x)` and `y=6/x`,
  not a transformed cubic pair.
- Full half-unit grid has 16 by 16 cells over `x=[-1,7], y=[-1,7]`.
  Both axes use `64 px/unit`; grid cells are 32 px. Rightmost `7`,
  bottommost `-1`, both curve exits, origin and legends are fully visible.
- The exact pre-encoding sqrt parameterization is
  `(7*t^2, sqrt(7)*t)`. Encoded control error is at most
  `4.677049858514692e-10` units, below the stated nine-decimal bound.
- Independently verified all **2049 exact rational samples** and all 2049
  encoded M/L vertices in the final SVG. With `N=2048`:
  `x_i=(6N+43i)/(7N)`, `y_i=42N/(6N+43i)`, and `x_i*y_i=6`.
- Positive visible branch endpoints are exactly `(6/7,7)` and `(7,6/7)`.
  The absent negative branch is outside the window: for `-1<=x<0`,
  `6/x<=-6<-1`. No epsilon cutoff or fake domain endpoint is introduced;
  reciprocal domain excludes zero and the common domain is `x>0`.
- Recomputed interpolation bound using `h=43/14336` and
  `max|f''|=343/18`: `0.0013714896308051215 px`.
  Including coordinate encoding and arithmetic allowance yields
  `0.0013715358856391173 px`, conservatively rounded to **0.001372 px**.
- The actual crossing is visually readable near `x=3.3, y=1.8`, consistent
  with inherited source evidence. There is no special tick at 3.3,
  intersection point, projection guide, cube-root value or answer label.
- All 21 SVG text elements are 20 px at width 640. Existing validation is
  exit 0 and the current render is pass without collisions; actual labels
  and curves are legible.

## Snapshot Binding

The accompanying JSON binds each figure's **spec, render, SVG and preview**
by actual byte SHA-256, plus mathematical/sample and command-receipt evidence.
All handoff hashes and the render-to-spec/SVG bindings were verified.
Existing successful spec/render stages were reused, not rerun.

Handoff SHA-256:
`f301165fec3958769effd67077faaa4b6f1b96c7c6b71d065f590babb96edf49`.

The JSON also supplies independent `new_figure_reviews` fragments bound to
the current SVG hashes for later canonical affected-only review. This is
actual-image approval against authored mathematical basis, not a claim that
object counts prove analytic SVG paths.

## Boundary

No new question view or repaired draft was read. The existing 19 approvals
and frozen source solutions are inherited, not re-solved or re-reviewed.
The original FIRST question gate remains **BLOCKED and untouched**.

Approval applies to these exact bytes and the declared **640 px scroll width**.
The parent may retain/promote the unchanged assets under its repair scope,
then notify this reviewer when only the two 774 views and corresponding
intent/coverage/new_figures are ready for canonical affected-only review.
No second image open is needed for these unchanged hashes.
