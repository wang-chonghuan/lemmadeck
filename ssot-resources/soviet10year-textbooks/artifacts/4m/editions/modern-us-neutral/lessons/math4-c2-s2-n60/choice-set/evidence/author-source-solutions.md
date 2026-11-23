# N60 independent source solving: frozen before option construction

Stage: complete, OFFLINE AUTHOR only. This file is the first full solving stage,
written before any candidate options. Do not edit it during option construction.
No prior answers, interactions, judging parts, tests, choices, or other authors'
or reviewers' solutions were consulted.

## Input and observation boundary

- Workdir: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187
- Seed: .tmp/stemrobin-187/n60/choices/seed.json, read-only.
- Seed canonical SHA-256:
  96fbc8d7a2f6936723f7ccb8b86f0f53ab12a30b706e7531fa717af5dce00f6f
- Seed byte SHA-256:
  d71265fdbd82da2f4be4039fb46f28ded787a1450f8b1bb0ad07df083d1b32c1
- Selected sources: all eleven written exercises 1009 through 1019.
- Selected concept: block 10 only; first discarded digit 0-4 leaves the
  retained digit unchanged, 5-9 increases it by one, with carry when necessary.
  Discarded integer positions are replaced by zeros. No solved examples supplied.
- The sole seed SVG's bytes were hashed once and match the seed:
  ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-225.svg
  f83ab314a783706359555dc7483ed70532415ea5e560b1a2fdcd2aff61486f68
- Exactly one image opened, once, complete and uncropped:
  ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n60/evidence/figure-author/previews/fig-225.repair1.preview.png
  byte SHA-256:
  df64653c2246703fa39173034c3ba562c482a88af975b9cc88b57f326a6593f2
- The caller authorizes this approved full preview as the retained rendering
  of the identically retained seed SVG. No render or binding evidence was
  reopened; this does not claim a new figure approval or production display test.
- Actual pixels: a larger upper circle contains A and region I; a smaller
  lower circle contains B and region III; their overlap lens is II. IV is
  right of both circles, outside both. The lower small-circle arc, the entire
  upper circle, and the rightmost IV label are visible. Both centers, all four
  region labels, and the complete boundaries are readable.

## 1009: bounds and nearest natural number

Determine BOTH adjacent natural-number bounds AND the nearer natural number
for every input. All bounds are positive; no convention about whether zero
belongs to the natural numbers is needed.

| Input | Bounds | Distances from lower, upper | Nearer natural number |
| --- | --- | --- | --- |
| 5.38 | 5 < 5.38 < 6 | 0.38, 0.62 | 5 |
| 82.71 | 82 < 82.71 < 83 | 0.71, 0.29 | 83 |
| 121.3 | 121 < 121.3 < 122 | 0.3, 0.7 | 121 |

The distinction is enclosing adjacent integers versus choosing the closest
one; neither request replaces the other.

## 1010: rounding to units

Inspect the tenths digit directly, not a successively rounded decimal.

| Input | First discarded digit | Rounded to units |
| --- | --- | --- |
| 7.265 | 2 | 7 |
| 11.638 | 6 | 12 |
| 0.23 | 2 | 0 |
| 8.5 | 5 | 9 |
| 300.499 | 4 | 300 |
| 6.5108 | 5 | 7 |

In particular 300.499 is less than 300.5. Rounding the hundredths first would
change the problem, and the given rule rounds the exact tie 8.5 upward.

## 1011: one weight at two precisions

For the same 16.38 kg crate:

- To units: the tenths digit is 3, so approximately 16 kg.
- To tenths: the hundredths digit is 8, so approximately 16.4 kg.

Both approximations must retain their precision labels and kg units.
The distinction is choosing the appropriate discarded digit for each request.

## 1012: three precision-dependent series

Each input is rounded directly to its requested place.

| Requested place | Input | First discarded digit | Result |
| --- | --- | --- | --- |
| Tenths | 2.781 | 8 | 2.8 |
| Tenths | 3.1423 | 4 | 3.1 |
| Tenths | 203.962 | 6 | 204.0 |
| Tenths | 62.35 | 5 | 62.4 |
| Tenths | 80.45 | 5 | 80.5 |
| Hundredths | 0.07268 | 2 | 0.07 |
| Hundredths | 1.35506 | 5 | 1.36 |
| Hundredths | 10.081 | 1 | 10.08 |
| Hundredths | 76.544 | 4 | 76.54 |
| Hundredths | 4.455 | 5 | 4.46 |
| Tens | 167.1 | 7 | 170 |
| Tens | 2085.04 | 5 | 2090 |
| Tens | 444.4 | 4 | 440 |
| Tens | 300.7 | 0 | 300 |

For 203.962, 203.9 gains one tenth and carries to 204.0; the trailing zero
records tenths precision. Tens rounding requires a terminal zero. In 2085.04
the units digit 5 increases the tens digit, regardless of the tenths digit 0.

## 1013: reception regions and intersection

Use the actual approved figure, not imagined circle containment. Let S_A
denote the large circular coverage area and S_B the small one.

- A only: S_A minus S_B, region I.
- B only: S_B minus S_A, region III.
- Both stations: S_A intersect S_B, region II.
- The intersection of the two coverage areas is region II.
- Region IV is outside their union and receives neither station.

The small circle is not wholly inside the large circle. Size alone does not
give a subset relationship. The same overlap must answer both the reception
question and the intersection question. The source names areas rather than
individual boundary points; no boundary-point convention is invented here.

## 1014: repeated addition and value

The product 2.75 * 3 is three equal addends:

2.75 + 2.75 + 2.75 = 5.50 + 2.75 = 8.25.

The sum form AND its value are requested. A numeric result alone omits the
representation task.

## 1015: equal parts and the common whole

There are 3 + 5 = 8 equal parts in the whole piece of fabric.

- Dresses use 3/8 of the whole.
- Blouses use 5/8 of the whole.
- 3/8 + 5/8 = 1, so both allocations exhaust the same whole.

The distinction is each allocation as a fraction of the original fabric,
not the ratio of the two allocations to each other.

## 1016: underspecified printed model and conditional solution

Printed data: filling takes 6 hours, and the question asks how much water is
in the pool after 1 hour 25 minutes. Neither uniform inflow nor an initially
empty pool is explicitly stated. Therefore the fraction is not uniquely
determined by the written data alone.

Even with an empty initial pool and no losses, nonuniform inflow can yield
different answers: a filled fraction f(t) = (t/6)^2 for 0 <= t <= 6 hours
also reaches 1 at 6 hours. At t = 17/12 hours it gives 289/5184 rather than
17/72. Thus reaching capacity at 6 hours alone does not prove linear filling.

Under NEW EXPLICIT VISIBLE CONDITIONS of an initially empty pool, constant
inflow, no outflow or loss, and capacity reached after 6 hours:

- Total fill time: 6 * 60 = 360 minutes.
- Elapsed time: 1 * 60 + 25 = 85 minutes = 17/12 hours.
- Fraction of capacity: 85/360 = 17/72.
- 17 and 72 share no factor, so the fraction is reduced.

The candidate may use this conditioned model but must not attribute these
added assumptions to the printed exercise. Capacity loss: judging under
explicit model assumptions replaces interpreting the underspecified original.

## 1017: further direct rounding, units and tenths

| Requested place | Input | First discarded digit | Result |
| --- | --- | --- | --- |
| Units | 1.69 | 6 | 2 |
| Units | 1.198 | 1 | 1 |
| Units | 37.444 | 4 | 37 |
| Units | 37.5444 | 5 | 38 |
| Units | 802.3032 | 3 | 802 |
| Tenths | 0.3691 | 6 | 0.4 |
| Tenths | 0.8218 | 2 | 0.8 |
| Tenths | 0.9702 | 7 | 1.0 |
| Tenths | 61.3501 | 5 | 61.4 |

0.9702 requires a carry from 0.9 to 1.0, still at tenths precision.
1.198 does not become 2 merely because later discarded digits are large.

## 1018: construction and the other three angles

Construct two complete intersecting lines AC and BD with intersection O:
OA and OC are opposite rays; OB and OD are opposite rays. Draw AC, position
OB so angle AOB is 155 degrees, then extend OB through O in the opposite
direction to D. This gives the required two straight lines, not four
independently chosen rays.

- angle BOC = 180 - 155 = 25 degrees (adjacent linear pair).
- angle COD = 155 degrees (vertical to angle AOB).
- angle DOA = 25 degrees (adjacent linear pair, vertical to BOC).
- In cyclic order AOB, BOC, COD, DOA: 155, 25, 155, 25 degrees; sum 360.

The other three angles are 25, 155, 25 degrees, with their positions
specified. A text construction/angle-record recognition task can retain
the opposite-ray, straight-line and vertical-angle reasoning without a
new diagram. It cannot establish the ability to draw or use a protractor.
That actual drawing capability must be recorded as lost, not claimed as
production or visual evidence.

## 1019: nested expression

The colon means division:

[(37.3 + 21.7) * 13 + 8688] / 31 - 196

1. Parentheses: 37.3 + 21.7 = 59.
2. Multiplication: 59 * 13 = 767.
3. Bracket addition: 767 + 8688 = 9455.
4. Division: 9455 / 31 = 305, since 31 * 305 = 9455.
5. Final subtraction: 305 - 196 = 109.

The distinction is retaining the full nesting and operation precedence,
not rounding intermediate values or moving the subtraction into a divisor.

## Solving-stage completion

All 11 complete written sources have been solved or, for the unconditioned
1016, explicitly shown to be nonidentifiable and solved under stated
additional conditions. Every rounding input, requested precision, bounds
request, fraction allocation, sum representation, region/intersection
request, construction and three remaining angles is accounted for above.
No options were constructed in this stage. No new image was created.
