# Independent mathematics: N60, 1009-1019

Ticket: STEMROBIN-187. Lesson: `math4-c2-s2-n60`.
Working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.

**MATHEMATICS: PASS for the eleven complete source exercises**, with the conventional constant-rate filling assumption explicitly stated for 1016 and a complete textual construction specification for 1018. **SOURCE remains REVISE**, not retrospectively changed by obtaining correct numerical answers. Overall source/math handoff is **HOLD for source correction S1 and explicitly bound downstream treatment of the confirmed endpoint erratum**; this is not a modern-edition, answer-key, figure-production, display, or publication handoff.

## Independence and frozen basis

The source review and freeze were both persisted, and all their input/review hashes verified, before independent exercise solving. The pre-mathematics verification returned at `2026-11-23T06:31:03.587Z`; the exact-arithmetic calculation completed at `2026-11-23T06:32:09.914Z`. These are observed tool timestamps, not inferred author timestamps.

| Frozen file | SHA-256 |
| --- | --- |
| `independent-source-review.md` | `2afa30ac5aef616211a3d1fdffb919d0391e0874ff2901ca7570dd0ca78092d3` |
| `independent-source-freeze.json` | `29f8e773e4afd96e5b835ed1f0350e2008848fc9c934673bf1cc145dec774894` |

This file uses the 11 source exercises and the independently observed figure inventory in that frozen review. No author report, solution, answer key, old choice, modern lesson/exercise/figure, test expectation, or database content was consulted. The source review and freeze are not edited during mathematics.

## Rounding method and precision

All supplied decimal inputs are nonnegative. For target step h, use the printed rule

`R_h(x) = h * floor(x/h + 1/2)`.

The steps are 1 for units, 0.1 for tenths, 0.01 for hundredths, and 10 for tens. Equivalently, inspect only the first discarded digit: 0-4 keeps the last retained digit; 5-9 adds 1 with any necessary carry. Work directly from the original input, never from an intermediate rounded value.

An exact tie goes to the larger approximation. The error bound is `|x-R_h(x)| <= h/2`. A rounded result r has the cell `r-h/2 <= x < r+h/2`, intersected with the nonnegative domain if needed. Thus an upper midpoint is not included in r's cell.

Decimal precision remains visible: `204.0` and `1.0` below mean tenths, not unspecified integer precision. The following tables give every input, deciding digit, action, and result; they do not rely on binary floating-point rounding or half-to-even defaults.

## 1009: adjacent bounds and nearest natural numbers

Source ref: `p0223#1`. Two adjacent bounds and one approximation are required for each of the three numbers.

| Source number | Strict adjacent-natural-number bounds | Distances to lower / upper bound | Nearest natural number |
| --- | --- | --- | --- |
| 5.38 | `5 < 5.38 < 6` | `5.38-5=0.38`; `6-5.38=0.62` | 5, because 0.38 < 0.62 |
| 82.71 | `82 < 82.71 < 83` | `82.71-82=0.71`; `83-82.71=0.29` | 83, because 0.29 < 0.71 |
| 121.3 | `121 < 121.3 < 122` | `121.3-121=0.3`; `122-121.3=0.7` | 121, because 0.3 < 0.7 |

None is a midpoint. Each inequality supplies both bounds, rather than just the rounded answer.

## 1010: units

Source ref: `p0223#2`. The deciding digit is the tenths digit.

| Input | First discarded digit | Action on retained units | Result |
| --- | --- | --- | --- |
| 7.265 | 2 | Keep 7 | 7 |
| 11.638 | 6 | Increase 11 to 12 | 12 |
| 0.23 | 2 | Keep 0 | 0 |
| 8.5 | 5 | Exact midpoint; increase 8 to 9 | 9 |
| 300.499 | 4 | Keep 300; all later digits are discarded together | 300 |
| 6.5108 | 5 | Increase 6 to 7 | 7 |

In particular, `300.499 < 300.5`, so rounding it directly to units gives 300. Rounding first to tenths would change the task and could incorrectly give 301. Rounding 0.23 to units gives 0 irrespective of whether a separate course convention calls zero a natural number: this question requests units, not membership in the natural-number set.

## 1011: kilograms, separately to units and tenths

Source ref: `p0223#3`. The source conversion is **1 pood = 16.38 kg**; no external conversion value replaces it.

To units, the tenths digit is 3, so `16.38 kg` approximately equals **16 kg**. The bounds are `16 < 16.38 < 17`; the distances are 0.38 and 0.62 kg.

To tenths, the hundredths digit is 8, so `16.38 kg` approximately equals **16.4 kg**. The bounding tenth values are 16.3 and 16.4 kg, at distances 0.08 and 0.02 kg. These are two independent approximations of 16.38, not sequential rounding.

## 1012: all three precisions

Source ref: `p0223#4`. Printed Cyrillic parts а), б), в) are preserved as reference labels. There are 5 + 5 + 4 = 14 results.

### а) Tenths

Inspect the hundredths digit.

| Input | First discarded digit | Reason | Result to tenths |
| --- | --- | --- | --- |
| 2.781 | 8 | Increase retained tenth 7 to 8 | 2.8 |
| 3.1423 | 4 | Keep retained tenth 1 | 3.1 |
| 203.962 | 6 | Increase tenth 9; carry into units | 204.0 |
| 62.35 | 5 | Exact tie at 62.35; choose the larger tenth | 62.4 |
| 80.45 | 5 | Exact tie at 80.45; choose the larger tenth | 80.5 |

For the carry case, the bounding tenths are 203.9 and 204.0; their midpoint is 203.95. Since 203.962 exceeds it, 204.0 is correct. The terminal zero records the requested tenth place.

### б) Hundredths

Inspect the thousandths digit. The final 4.455 belongs to this part despite its separate printed row.

| Input | First discarded digit | Reason | Result to hundredths |
| --- | --- | --- | --- |
| 0.07268 | 2 | Keep hundredths 7 | 0.07 |
| 1.35506 | 5 | Increase hundredths 5 to 6 | 1.36 |
| 10.081 | 1 | Keep hundredths 8 | 10.08 |
| 76.544 | 4 | Keep hundredths 4 | 76.54 |
| 4.455 | 5 | Exact tie; increase hundredths 5 to 6 | 4.46 |

`1.35506 > 1.355`: its first discarded digit is 5 but it is not an exact midpoint, because later digits are nonzero. This still rounds upward by the source rule. `4.455` is the actual exact half-hundredth tie.

### в) Tens, not tenths

Inspect the units digit. Replace the discarded units position with zero and discard all decimal positions.

| Input | First discarded digit | Reason | Result to tens |
| --- | --- | --- | --- |
| 167.1 | 7 | Increase the retained tens, then zero units | 170 |
| 2085.04 | 5 | Increase the retained tens, then zero units | 2090 |
| 444.4 | 4 | Keep retained tens, then zero units | 440 |
| 300.7 | 0 | Keep retained tens, then zero units | 300 |

For 2085.04, bounding multiples of ten are 2080 and 2090 with midpoint 2085. It is above that midpoint, not exactly tied. The errors of these four approximations are respectively 2.9, 4.96, 4.4, and 0.7, each no larger than 5.

## 1013: reception regions and intersection

Source refs: `p0223#6-8`. Use the figure inventory observed before mathematics: large upper circle with station A, smaller lower circle with station B, and labels I, II, III, IV.

Let `C_A` and `C_B` denote the two coverage disks, not only their circumference strokes. The following membership table accounts for all four printed region labels:

| Region | In A coverage? | In B coverage? | Reception |
| --- | --- | --- | --- |
| I | Yes | No | A only |
| II | Yes | Yes | Both stations |
| III | No | Yes | B only |
| IV | No | No | Neither station |

Therefore the requested answers are:

- а) **I**, `C_A \ C_B`, for reception only from station A.
- б) **III**, `C_B \ C_A`, for reception only from station B.
- в) **II**, `C_A ∩ C_B`, for reception from both stations.
- The circles' intersection is also **II**, the overlap lens.

For completeness of the region reasoning, total A coverage is I plus II, total B coverage is II plus III, and reception from at least one station is I plus II plus III. Do not confuse that union with simultaneous reception from both. These statements also make explicit that the question is about station reception, not an unstated distinction between shared and exclusive program content.

The source asks about labeled regions, not the reception of a specified point exactly on an outline. Its absent boundary-point convention therefore does not change these region answers. No numerical radius, point coordinate, shading, new circle, or invented point is needed.

## 1014: product as a sum and its value

Source ref: `p0223#9`. Multiplication by the natural number 3 is repeated addition of three equal summands:

`2.75 * 3 = 2.75 + 2.75 + 2.75`.

Then `2.75+2.75=5.50` and `5.50+2.75=8.25`. Thus the requested sum and value are **`2.75+2.75+2.75=8.25`**. Giving just 8.25 would omit part of the task.

## 1015: both fractions of the whole cloth

Source refs: `p0223#10 + p0224#1`. Three equal parts are used for dresses, and the remaining five for blouses. The total is `3+5=8` equal parts.

The dresses use **3/8** of the entire cloth; the blouses use **5/8**. Both are in lowest terms, and `3/8+5/8=8/8=1` checks that no cloth is unaccounted for. The answer is not 3/5: that compares the two allocations rather than either allocation to the whole.

## 1016: pool fraction after 1 hour 25 minutes

Source ref: `p0224#2`.

Use the standard proportional filling model: the pool begins empty, filling proceeds at the same constant rate, and there is no simultaneous loss. These are textbook modelling assumptions, not separately printed measurements or newly observed facts.

Full filling takes `6 * 60 = 360` minutes. The elapsed time is `60+25=85` minutes. The fraction filled is therefore

`85/360 = (85/5)/(360/5) = 17/72`.

Equivalently, `1 hour 25 minutes = 1+25/60 = 17/12` hours, and `(17/12)/6 = 17/72`. The fraction is proper and reduced because 17 shares no prime factor with 72. Answer: **17/72 of the pool**.

The source says the pool is filled, so this is not a draining problem, and 1 hour 25 minutes is not 1.25 hours. Without the stated constant-rate/empty-pool model, the single full-fill time would not determine an arbitrary varying-flow or initially-partly-filled case; do not silently claim that stronger conclusion.

## 1017: homework rounding

Source ref: `p0224#4`. There are 5 unit results and 4 tenth results.

### а) Units

Inspect the tenths digit.

| Input | First discarded digit | Reason | Result |
| --- | --- | --- | --- |
| 1.69 | 6 | Increase units 1 to 2 | 2 |
| 1.198 | 1 | Keep units 1 | 1 |
| 37.444 | 4 | Keep units 37 | 37 |
| 37.5444 | 5 | Increase units 37 to 38 | 38 |
| 802.3032 | 3 | Keep units 802 | 802 |

### б) Tenths

Inspect the hundredths digit.

| Input | First discarded digit | Reason | Result to tenths |
| --- | --- | --- | --- |
| 0.3691 | 6 | Increase retained tenth 3 to 4 | 0.4 |
| 0.8218 | 2 | Keep retained tenth 8 | 0.8 |
| 0.9702 | 7 | Increase tenth 9 with a carry | 1.0 |
| 61.3501 | 5 | Increase retained tenth 3 to 4 | 61.4 |

`0.9702` lies between 0.9 and 1.0 and above their midpoint 0.95; its rounded error is 0.0298. `61.3501` is above the 61.35 midpoint, with error 0.0499. Neither is an exact tie. The former result retains its terminal zero to show tenths.

## 1018: construction and all other angles

Source ref: `p0224#5`. The source requests **two full straight lines** meeting at 155 degrees, not just one angle drawn as two terminated rays.

Complete construction specification:

1. Draw a straight line through a point O. Choose B on one side of O and A on the other, so OA and OB are opposite rays.
2. Place a protractor with center O and its zero direction along OB. On one chosen side of the first line, mark C in the 155-degree direction.
3. Draw the straight line through C and O, extending it beyond O to a point D. OC and OD are opposite rays. The two full lines are AOB and COD.

The labels O, A, B, C, D are independent construction labels introduced here, not labels claimed to exist in a source figure. A protractor is used; no unsupported claim of a compass-and-unmarked-straightedge-only exact 155-degree construction is made.

With the rays in cyclic order OB, OC, OA, OD:

| Angle | Derivation | Measure |
| --- | --- | --- |
| BOC | Constructed given angle | 155 degrees |
| COA | Supplement to BOC on straight line AOB: `180-155` | **25 degrees** |
| AOD | Vertically opposite to BOC | **155 degrees** |
| DOB | Supplement to BOC on straight line COD: `180-155` | **25 degrees** |

Thus all three other angles are **25 degrees, 155 degrees, 25 degrees**. The check is `155+25+155+25=360`.

An exact mathematical construction witness, independent of any hand-drawn accuracy, is:

`O=(0,0)`, `B=(1,0)`, `A=(-1,0)`, `C=(cos 155°, sin 155°)`, `D=(-cos 155°, -sin 155°)`.

The first line has direction (1,0), the second direction `(cos 155°, sin 155°)`; the opposite endpoint vectors prove both are full straight lines. The angle between OB and OC is exactly 155 degrees. This is a complete textual geometric specification and proof, not a new modern figure. No raster, SVG, plot, screenshot, or learner answer image was produced.

## 1019: complete operation order

Source ref: `p0224#6`. The printed colon denotes division:

`[(37.3+21.7)*13+8688]/31-196`.

Proceed inside out:

1. `37.3+21.7=59.0`.
2. `59*13=767`.
3. `767+8688=9455`.
4. `9455/31=305`, checked by `31*305=9455`.
5. `305-196=109`.

Answer: **109**. The entire bracket is divided by 31; the subtraction of 196 occurs after that division.

## Verification, corrections and stopping point

The local calculation used Node built-ins only, with decimal inputs converted to exact integer numerators and powers-of-ten denominators. It independently recomputed all **34 rounding results**, the three 1009 bound pairs/distances, and the arithmetic for 1014-1016 and 1018-1019. The semantic region proof and straight-line construction above are independent reasoning, not results inferred from a renderer or an existing test.

The exact-arithmetic result count is `3+6+2+14+9=34`. All eleven exercises have all requested parts: three bound pairs, all prescribed rounding precisions, four region/intersection answers, the repeated-addition expression and its value, three requested fractions, a two-line construction and its three other angles, and the final bracketed calculation. There is no author-key comparison and no claim that such a comparison occurred.

Concrete remaining source actions:

- S1: move the original p0221#10 formula break before `=`; re-finalize the affected original page and refresh only its actual downstream bindings.
- `p0222-math-1`: retain the faithful original and registered erratum; any instructional reuse must explicitly exclude right endpoint 15 with a correction bound to its actual source block/hash.

These actions were not performed by this reviewer. Correct solutions do not waive them. N61 remains boundary-only, with its final prose block open and its literal figure VII reference uninspected; N61 is not solved, complete, or published.

Final bounded usage for this handoff, including one final checksum/consistency command: **24 shell commands**, every workdir exactly `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`; **3 manual write operations**, creating only the three permitted evidence files. Exactly **6 image opens in one batch**, each once; reopens 0, additional crops 0, other images 0. The parent remains 24/24 and receives text only. Network 0, paid services 0, installs 0, Git writes 0, DB/.env reads 0, author report/key reads 0, tests read/run 0, progress/index writes 0, new chats/agents 0.

Stop at this source/math handoff. No modern figure, answer/choice production, assembly, render, publication, or expanded intake is authorized or performed.
