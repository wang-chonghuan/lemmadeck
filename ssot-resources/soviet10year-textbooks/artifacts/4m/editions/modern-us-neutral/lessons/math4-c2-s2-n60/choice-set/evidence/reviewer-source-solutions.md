# STEMROBIN-187 N60: frozen STAGE1 source-first solutions

This is the bounded independent source-solving checkpoint, not a formal choice
review, a candidate key, or a whole-choice-set PASS. Every source exercise
1009-1019 is considered below before any candidate view or author internal
material is read. Stop after recording this file's SHA-256.

## Scope, authority and binding

- Shell cwd throughout:
  `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
- Sole written content authority:
  `.tmp/stemrobin-187/n60/choices/seed.json`.
- Seed raw-byte SHA-256:
  `d71265fdbd82da2f4be4039fb46f28ded787a1450f8b1bb0ad07df083d1b32c1`.
- Seed canonical SHA-256, using the contract's sorted-key, ASCII-escaped,
  compact JSON encoding:
  `96fbc8d7a2f6936723f7ccb8b86f0f53ab12a30b706e7531fa717af5dce00f6f`.
- Sole retained source asset, listed by the seed:
  `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-225.svg`.
- Retained SVG actual-byte SHA-256:
  `f83ab314a783706359555dc7483ed70532415ea5e560b1a2fdcd2aff61486f68`.
  This equals the seed's expected SHA-256. The SVG was hashed once.
- Sole image opened:
  `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n60/evidence/figure-author/previews/fig-225.repair1.preview.png`.
- Full preview: 640 x 640 pixels; actual-byte SHA-256:
  `df64653c2246703fa39173034c3ba562c482a88af975b9cc88b57f326a6593f2`.
- The owner explicitly supplied this complete preview as already approved and
  bound to the retained SVG. That source-fidelity/preview binding is reused,
  not newly proved or reapproved here. No spec, manifest, source page, original
  figure, render report or prior figure-review file was consulted.
- Rules read: the active choice skill, authoring, review and contract references,
  image-batch rules, and production-resume rules. These are procedural rules,
  not extra mathematical content authority.
- The only supplied lesson concept used is block 10's general rounding rule.
  No worked example or other lesson paragraph was read or used.
- No draft, candidate view/projection, author notes, prior source solutions,
  keys, answers, interaction specification, tests, earlier choices or earlier
  ticket outputs were read.
- No DB, .env, network, paid service, installation, Git command, publisher,
  source/manifest edit, stable-tool edit, new figure, new agent or chat.
- The only file written is this checkpoint. Existing work is left untouched.

## General rounding rule

For a requested place, inspect the first digit immediately to its right. Discard
all digits to the right directly from the original input. If that first digit
is 0-4, keep the retained number unchanged; if it is 5-9, increase it by one unit
of the requested place, carrying as necessary. For rounding to tens, replace
discarded integer places with zero. Do not round through an intermediate
precision. Keep one decimal place for tenths and two for hundredths.

All rounding inputs here are nonnegative. In particular, 8.5 rounds upward to
9 under block 10, not to the even integer 8. Rounding 0.23 to the units place
gives 0 without assuming whether a separate natural-number convention contains
zero. The natural-number bounds in 1009 are all positive and unambiguous.

## 1009: adjacent bounds AND nearest natural number

Source task: for 5.38, 82.71 and 121.3, identify the two adjacent natural
numbers bounding each decimal and which natural number it approximates.

| Original input | Strict adjacent bounds | Distance to lower | Distance to upper | Nearest natural number |
| --- | --- | --- | --- | --- |
| 5.38 | 5 < 5.38 < 6 | 0.38 | 0.62 | 5 |
| 82.71 | 82 < 82.71 < 83 | 0.71 | 0.29 | 83 |
| 121.3 | 121 < 121.3 < 122 | 0.3 | 0.7 | 121 |

The smaller distance decides each nearest number. Both requested outputs,
not merely the rounded value, are retained for every input. No tie occurs.

## 1010: round to units

Source inputs, in order: 7.265, 11.638, 0.23, 8.5, 300.499, 6.5108.

| Original input | First discarded digit: tenths | Rounded to units |
| --- | --- | --- |
| 7.265 | 2 | 7 |
| 11.638 | 6 | 12 |
| 0.23 | 2 | 0 |
| 8.5 | 5 | 9 |
| 300.499 | 4 | 300 |
| 6.5108 | 5 | 7 |

For 300.499, the tenths digit is 4. Digits farther right do not turn it into
300.5 before the units decision. Its direct units result is 300.

## 1011: retain both requested precisions and kilograms

Source task: one crate weighs 16.38 kg. Approximate its weight by rounding
first to units, and separately to tenths.

- Units: the tenths digit 3 is below 5, so 16.38 kg is approximately 16 kg.
- Tenths: the hundredths digit 8 is at least 5, so 16.38 kg is approximately
  16.4 kg.

These are separate approximations from the same original measurement, not
successive rounding or a unit conversion.

## 1012: all three groups at their original requested places

### a) Tenths

Source inputs: 2.781, 3.1423, 203.962, 62.35, 80.45.

| Original input | First discarded digit: hundredths | Rounded to tenths |
| --- | --- | --- |
| 2.781 | 8 | 2.8 |
| 3.1423 | 4 | 3.1 |
| 203.962 | 6 | 204.0 |
| 62.35 | 5 | 62.4 |
| 80.45 | 5 | 80.5 |

For 203.962, the retained 203.9 increases by 0.1 to 204.0; the carry and
tenths precision both matter.

### b) Hundredths

Source inputs: 0.07268, 1.35506, 10.081, 76.544, 4.455.

| Original input | First discarded digit: thousandths | Rounded to hundredths |
| --- | --- | --- |
| 0.07268 | 2 | 0.07 |
| 1.35506 | 5 | 1.36 |
| 10.081 | 1 | 10.08 |
| 76.544 | 4 | 76.54 |
| 4.455 | 5 | 4.46 |

In 1.35506 and 4.455 the first discarded digit 5 increases the hundredths
digit. No tie-to-even rule is substituted.

### c) Tens

Source inputs: 167.1, 2085.04, 444.4, 300.7.

| Original input | First discarded digit: units | Rounded to tens |
| --- | --- | --- |
| 167.1 | 7 | 170 |
| 2085.04 | 5 | 2090 |
| 444.4 | 4 | 440 |
| 300.7 | 0 | 300 |

Here the deciding digit is the integer units digit, not the tenths digit.
In particular, 300.7 rounds directly to 300 at the tens place. All discarded
integer units places are replaced by zero.

## 1013: actual figure regions AND intersection

Source task: station A covers the large circle and station B the small circle
in figure 225. Identify reception of only A, only B, both stations, and the
intersection of the two circular coverage regions.

Observation from the one complete approved preview:

- The large upper circular region contains station point A and label I.
- The smaller lower circular region contains station point B and label III.
- The circles intersect at two points. Label II is inside their shared lens,
  above B, rather than on either intersection point.
- Label IV is to the right, outside both circles.
- Both complete circular outlines, both station labels/points and all four
  Roman-numeral region labels are visible. The rightmost label IV and bottom
  of the small circle are included in the full preview.

Let C_A and C_B denote the two broadcast coverage areas, not the station
points themselves. Membership gives:

| Requested reception | Membership condition | Observed region |
| --- | --- | --- |
| a) Only A | In C_A and not in C_B: C_A \ C_B | I |
| b) Only B | In C_B and not in C_A: C_B \ C_A | III |
| c) Both A and B | In both: C_A intersection C_B | II |
| Neither, for completeness of the diagram | Outside C_A union C_B | IV |

The answer to the separate intersection question is also region II, the shared
area, not the two boundary-crossing points, either entire circle, or the union.
The word "only" excludes the overlap in a) and b).

The source does not separately stipulate reception at exact boundary points.
The labeled regions and their interior membership are settled without inventing
an on-edge convention. A later option specifically about a boundary point
would need that convention made visible; this is not a blocker for identifying
the four labeled regions requested here.

## 1014: repeated-addition form AND value

Source task: express the product 2.75 * 3 as a sum, and evaluate it.

Multiplication by the natural number 3 repeats the amount 2.75 three times:

```text
2.75 * 3 = 2.75 + 2.75 + 2.75
         = 5.50 + 2.75
         = 8.25.
```

Exact check: 2.75 = 11/4, so (11/4) * 3 = 33/4 = 8.25.
The additive expression and final value are both required.

## 1015: fractions of the whole cloth

Source task: a piece of cloth is divided into equal parts; 3 parts make a dress
and the remaining 5 parts make a smock. Determine each share of the whole cloth.

There are 3 + 5 = 8 equal parts in the original whole, so each part is 1/8
of that whole.

- Dress: 3 * (1/8) = 3/8 of the whole cloth.
- Smock: 5 * (1/8) = 5/8 of the whole cloth.

The shares exhaust the cloth: 3/8 + 5/8 = 8/8 = 1. The denominator is the
total 8, not the other garment's 3 or 5. Both fractions are already reduced.

## 1016: original model-condition gap; conditional result only

Source text supplies a 6-hour total filling time and asks what fraction is
filled after 1 hour 25 minutes. It does NOT explicitly state uniform inflow,
an initially empty pool, or an absence of leakage/other outflow. In particular,
concept block 10 is a rounding rule and supplies no filling-rate model.

**HOLD: an unconditional unique fraction is not justified by the original
stated conditions.** A total filling duration alone does not fix the fraction
present at an intermediate time. Do not describe the original source as already
uniform or silently promote the following assumptions into source facts.

Conditional solution: IF filling begins with an empty pool, the inflow rate
is constant throughout, and there is no leakage or other water change, then
the filled fraction equals elapsed time divided by the total filling time.

```text
6 hours = 360 minutes.
1 hour 25 minutes = 60 + 25 = 85 minutes.
Filled fraction = 85/360 = 17/72.
```

Equivalently, 1 hour 25 minutes = 17/12 hours, and (17/12)/6 = 17/72.
This is exact; 1 hour 25 minutes is not the decimal time 1.25 hours.

Concrete nonuniqueness even with an initially empty, nonleaking pool of
capacity V: filling at V/170 per minute for the first 85 minutes supplies V/2.
Then filling at V/550 per minute for the remaining 275 minutes supplies the
other V/2. The pool still first becomes full after 85 + 275 = 360 minutes,
but its fraction at 85 minutes is 1/2, not 17/72. Both positive-rate phases
satisfy the stated 6-hour total duration. Thus an extra rate model really is
needed; the gap is not just a phrasing preference.

Full source coverage here includes both given times, exact time conversion,
the requested fraction, the conditional derivation, and the unresolved
original-model condition. No unconditional answer is frozen.

## 1017: both rounding groups, every original input

### a) Units

Source inputs: 1.69, 1.198, 37.444, 37.5444, 802.3032.

| Original input | First discarded digit: tenths | Rounded to units |
| --- | --- | --- |
| 1.69 | 6 | 2 |
| 1.198 | 1 | 1 |
| 37.444 | 4 | 37 |
| 37.5444 | 5 | 38 |
| 802.3032 | 3 | 802 |

### b) Tenths

Source inputs: 0.3691, 0.8218, 0.9702, 61.3501.

| Original input | First discarded digit: hundredths | Rounded to tenths |
| --- | --- | --- |
| 0.3691 | 6 | 0.4 |
| 0.8218 | 2 | 0.8 |
| 0.9702 | 7 | 1.0 |
| 61.3501 | 5 | 61.4 |

For 0.9702 the retained 0.9 increases by 0.1 to 1.0, keeping the requested
tenths precision. For 61.3501, hundredths digit 5 is enough to increase 61.3
to 61.4.

## 1018: construction AND all three remaining intersection angles

Source task: draw two straight lines intersecting at 155 degrees and determine
the other intersection angles. It includes a construction, not only one
complementary-angle calculation.

Text-only construction plan:

1. Choose an intersection point O and draw a straight line through O. Mark
   A on one ray and A' on its opposite ray.
2. At O use a protractor to mark a ray OB making 155 degrees with ray OA.
3. Extend OB through O in the opposite direction to B', producing the second
   complete straight line. The two lines are AA' and BB', not merely two rays.

For a precise orientation description, OA may have direction 0 degrees,
OB 155 degrees, OA' 180 degrees and OB' 335 degrees. Consecutive ray-angle
differences around O are then 155, 25, 155 and 25 degrees, summing to 360.

Independently, adjacent angles on a straight line sum to 180 degrees, so each
angle adjacent to the given one is 180 - 155 = 25 degrees. The opposite angle
is 180 - 25 = 155 degrees. Thus the three OTHER intersection angles are
25 degrees, 155 degrees and 25 degrees. There are four angles in total.

No new drawing/image is produced under this stage's authorization. The full
construction method and its mathematical result are retained; actually drawing
the lines has not been demonstrated by this text-only checkpoint. Any later
choice conversion must account for that production task, not silently reduce
the original source to a single 25-degree answer. No candidate recognition
item or construction figure is being evaluated here.

## 1019: full nested calculation

Source expression, with its original grouping:

```text
[(37.3 + 21.7) * 13 + 8688] : 31 - 196.
```

Here ":" is division. Compute inside the parentheses, then the bracket, then
division, then the subtraction outside the bracket:

```text
37.3 + 21.7 = 59.0
59.0 * 13 = 767.0
767.0 + 8688 = 9455.0
9455.0 / 31 = 305.0
305.0 - 196 = 109.
```

Exact division check: 31 * 305 = 9455. The final value is 109. In particular,
196 is subtracted after division, not inside the bracket or denominator.
Every operand and the complete nesting are retained.

## Coverage and stop

| Source | Source-solve coverage at STAGE1 | Condition or unperformed production |
| --- | --- | --- |
| 1009 | All 3 inputs: both adjacent bounds and nearest number | None |
| 1010 | All 6 inputs rounded directly to units | None |
| 1011 | 16.38 kg rounded separately to units and tenths | None |
| 1012 | All 5 tenths, 5 hundredths and 4 tens inputs | None |
| 1013 | Only A, only B, both, separate intersection query; all I-IV regions observed | No new boundary-point convention |
| 1014 | Sum representation and exact value | None |
| 1015 | Both whole-cloth fractions and total-parts reasoning | None |
| 1016 | Both times, exact conversion, conditional fraction, counterexample and model gap | HOLD on unconditional unique fraction |
| 1017 | All 5 units and 4 tenths inputs | None |
| 1018 | Complete text construction and all 3 other angles | Physical/new-image drawing not performed |
| 1019 | Every operand and every nested operation through final value | None |

Coverage: 11/11 source exercises addressed; 10 determinate mathematical
solutions and one explicitly conditional solution (1016). This is not
choice-package coverage approval and does not resolve the actual drawing
production limitation.

Actual image accounting in this bounded context: one batch, one image load,
one unique complete approved preview; zero reopens, zero crops, zero source
pages and zero other images. Preview opened once; retained SVG hashed once.
No rerender or source-fidelity reapproval. The image payload is not included
in the parent handoff; return only this text path and hashes.

Freeze this file by hashing its final saved bytes immediately after writing.
Its external SHA-256 is the STAGE1 boundary marker; do not edit it to insert
its own digest. No candidate view or key has been read before this freeze.
STAGE2 remains unopened. Author internals remain unopened. Stop here without
creating a formal review or claiming whole-choice-set PASS.
