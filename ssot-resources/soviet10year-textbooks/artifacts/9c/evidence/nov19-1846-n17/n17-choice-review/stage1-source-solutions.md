# 184-6 / n17 choice semantic review / Stage 1

Status: full independent source solutions frozen before receiving any visible
choice draft. This is a source-solution checkpoint, not a final semantic approval.
The reviewer did not author the choices.

Only mathematical input:
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n17-choices/seed.json`

- Canonical seed SHA-256:
  `5c52594329bdf3939da6b9d4a6849fcc4e63c29a7173e16f122f89f8403150c7`
- Raw seed file SHA-256:
  `5d0b5f5edb5cebcee1256292d511e6d9ccb12003841b31494195bd9f0ae9b09e`
- Sources: all 14 exercises, 134 through 147; all 18 mathematical task parts.
- Selected definition blocks: 0, 1, 4, 6, 9, 19, 20, 21.
- Seed figures, concept figures and exercise figure references: all empty.
- Additional images observed in this stage: zero. Prior figure budget remains
  permanently exhausted at 4/4. No image, spec or render was opened.
- No author draft, visible view, author solutions/report, answer keys,
  candidate answers or sibling outputs were read.
- No draft validator, backend, DB, environment, network, model, dependency,
  app, Git or delegation operation was performed.
- The seed trace was read only as embedded seed metadata; its referenced
  files were not opened or refreshed.

## Definition Basis

All variables are real; plane points are ordered real pairs. On the horizontal
coordinate axis, the positive direction is left to right. The distance between
coordinates u and v is |v-u|, independent of endpoint order. Closed intervals
include finite endpoints; open intervals exclude them; infinite endpoints are
never included. Linear equations describe lines in the coordinate plane.
For source 134, the proof below uses coordinate-axis unit lengths and segment
additivity rather than assuming the distance formula being proved.

## 134: Complete The Distance Proof

Let O have coordinate 0. If x_A = x_B, A and B coincide and both |AB| and
|x_B-x_A| are 0. Otherwise first take x_A < x_B.

1. If 0 <= x_A < x_B, B is farther right than A on the same positive ray.
   OB = OA + AB, so |AB| = x_B-x_A.
2. If x_A < x_B <= 0, A is farther left than B on the negative ray.
   OA = OB + AB, so |AB| = (-x_A)-(-x_B) = x_B-x_A.
3. If x_A < 0 < x_B, O lies between A and B.
   |AB| = |AO|+|OB| = -x_A+x_B = x_B-x_A.

These cases also cover an endpoint at O through cases 1 or 2. Thus when
x_A <= x_B, |AB| = x_B-x_A = |x_B-x_A|. When x_A > x_B, interchange A and
B: |AB| = x_A-x_B = |x_B-x_A|. All coordinate orders and signs are covered.
The conclusion is an unsigned length, not the directed difference alone.

## 135: Distance Between 1.5 And -2

|(-2)-1.5| = |-3.5| = 3.5 coordinate units.
Equivalently the segment crosses 0 and has length 1.5+2 = 3.5.

## 136: Distance Between -10.3 And 6.2

|6.2-(-10.3)| = |16.5| = 16.5 coordinate units.
The two coordinates have opposite signs, so their distances to 0 add.

## 137: Distance Between -3.6 And 0

|0-(-3.6)| = 3.6 coordinate units.
This is the distance of -3.6 from the origin.

## 138: Distance Between -5.7 And -7.1

|(-7.1)-(-5.7)| = |-1.4| = 1.4 coordinate units.
Both points are on the negative ray; subtract their distances from 0 rather
than adding 5.7 and 7.1.

## 139: Equality And Strict Interior About 0

- a) |x| = 5 iff x = -5 or x = 5. Solution set {-5, 5}.
  This consists of two points, not the whole interval between them.
- b) |x| < 5 iff -5 < x < 5. Solution set (-5, 5), equivalently ]-5,5[.
  Both endpoints have distance exactly 5 and are excluded; 0 is included.

## 140: Equality And Closed Interior About 10

- a) |x-10| = 4 iff x-10 = -4 or 4, hence x = 6 or 14.
  Solution set {6, 14}.
- b) |x-10| <= 4 iff -4 <= x-10 <= 4, hence 6 <= x <= 14.
  Solution set [6, 14]. Both endpoints have distance 4 and are included;
  the center 10 is also included.

## 141: Closed And Strict Exterior Sets

- a) |x| >= 5 iff x <= -5 or x >= 5.
  Solution set (-infinity, -5] union [5, +infinity).
  The finite boundary points -5 and 5 are included, while 0 is excluded.
- b) |x-10| > 4 iff x-10 < -4 or x-10 > 4, hence x < 6 or x > 14.
  Solution set (-infinity, 6) union (14, +infinity).
  The finite boundary points 6 and 14 and the center 10 are excluded.
  The two rays are joined by OR/union, not by AND/intersection.

## 142: Translate A Distance Equal To 2 From 5

The equation is |x-5| = 2 (equivalently |5-x| = 2).
It gives x-5 = -2 or 2, so x = 3 or 7. Solution set {3, 7}.
Both values are exactly 2 from 5; no interior interval is part of this set.
Both the translated equation and its complete solution set are required.

## 143: Translate A Distance Less Than 3.5 From -1

The inequality is |a-(-1)| = |a+1| < 3.5.
Thus -3.5 < a+1 < 3.5, so -4.5 < a < 2.5.
Solution set for the variable a: (-4.5, 2.5).
Both endpoints are excluded because their distance from -1 equals 3.5.
The center is -1, not +1; substituting a = -1 gives distance 0.

## 144: Translate A Distance Not Greater Than 0.2 From -4.5

The inequality is |y-(-4.5)| = |y+4.5| <= 0.2.
Thus -0.2 <= y+4.5 <= 0.2, so -4.7 <= y <= -4.3.
Solution set for y: [-4.7, -4.3].
Both endpoints are included, and y = -4.5 has distance 0.
"Not greater than" includes equality.

## 145: Preserve The Negated Variable And Non-Strict Exterior

The moving point has coordinate -b, not b. Its distance from -12 is
|(-b)-(-12)| = |12-b| = |b-12|.
The requested inequality is |b-12| >= 1/48.

It is equivalent to b-12 <= -1/48 or b-12 >= 1/48, hence
b <= 12-1/48 = 575/48 or b >= 12+1/48 = 577/48.
Solution set for b:
(-infinity, 575/48] union [577/48, +infinity).

At b = 575/48, -b = -12+1/48; at b = 577/48, -b = -12-1/48.
Both have distance exactly 1/48 and belong to the set. At b = 12 the two
points coincide, so b = 12 is excluded. Negating the point coordinate makes
the center in the variable b equal to +12. "Not less than" means >=, so
the finite endpoints are closed and the solution is exterior, not interior.

## 146: Geometry And Complete Textual Plot Construction

- a) (x-2)(y+3) = 0 iff x = 2 OR y = -3 over the reals.
  The set is the union of the complete vertical line x = 2 and the complete
  horizontal line y = -3, including their intersection (2, -3).
  To represent it, draw both full solid lines in the coordinate plane,
  extending in both directions. It is not just the intersection point.
  For example (2, 0) and (0, -3) both belong; (0, 0) does not.
- b) (y-x)/(x-1) = 0 requires the expression to be defined:
  x != 1. A defined fraction is zero exactly when y-x = 0.
  Hence the set is {(x,y): y = x, x != 1}: the complete line y = x with
  the single point (1, 1) removed. To represent it, draw the line through
  (0, 0) and (2, 2), extending both ways, and leave an open hole at (1, 1).
  (0, 0) and (2, 2) satisfy the equation. At (1, 1) it is 0/0 and undefined,
  not 0. Removing the denominator without retaining x != 1 is invalid.

These are textual specifications of the source's requested planar drawings.
No drawing image was made or observed, and no visual choice coverage or
recognition-versus-construction fidelity judgment has yet been issued.

## 147: Intersection Of Two Half-Planes

The set is the intersection of the open left half-plane x < 0 with the
closed half-plane y >= -1, at or above the horizontal line y = -1.
It is an unbounded region extending left and upward.

To represent it, shade only points left of x = 0 AND at or above y = -1.
Use an excluded/dashed vertical boundary at x = 0. The horizontal boundary
ray y = -1, x < 0 is included and drawn solid on that side. The meeting
point (0, -1) is excluded because x < 0 is strict. No part of x = 0 belongs,
and no point with x >= 0 belongs even when y >= -1.

Checks: (-1, -1) and (-1, 0) belong; (0, -1), (0, 0), (1, 0) and
(-1, -2) do not. This is an intersection/AND, not the union of the two
half-planes. The whole horizontal line y = -1 is not included, only its
negative-x ray.

## Deferred Until Visible Draft Disclosure

Task fidelity, construction-capacity losses, redundancy, answer leakage,
fresh solving of each visible question, checking every option and the complete
true set, comparison with internal author reasoning/key, and package/source
coverage are all pending. No final review outcome is assigned in Stage 1.
