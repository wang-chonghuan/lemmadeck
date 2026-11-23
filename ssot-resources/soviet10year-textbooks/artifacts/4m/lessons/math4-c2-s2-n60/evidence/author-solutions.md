# N60 independent source-author solutions

## Frozen scope and independence

This is my source-author calculation record for STEMROBIN-187 /`math4-c2-s2-n60`, not a source-review approval, modern answer key or finalized lesson. It is frozen before any exposure to choices, answer keys, judging parts, interactions, other source/solution reports, tests or modern lesson. None of those were read.

Input observations: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n60/evidence/author-source-observations.md`.
Input observations SHA256: `5d00babac585b44dd7e995a85fe9fe4621daf59e56d2d53cd53b1ff3f309df09`.

Bound source pages:

| Path | SHA256 |
| --- | --- |
| `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0221/page.md` (N60 portion only, read-only) | `f6cb9f2400de9f00317203aabd3b1773a005ca2ad5537eadca3647ac5e073644` |
| `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0222/page.md` | `2f690437f6a3e1bdc67af71b54979b7542c33140a8de199f098cd33fdc04b220` |
| `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0223/page.md` | `b2058471802f573164296868dd4875e8ffac1769ba94ecb6507b4bca21f4d8e4` |
| `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/ssot-resources/soviet10year-textbooks/artifacts/4m/pages/0224/page.md` | `5852e4056db5c40289574da9ea3f0b8f05c8d017b74782011475824535f00ddd` |

The lesson begins at`p0221#4`; written exercises begin at`p0223#1` and end at`p0224#6`. All11 complete original written exercises1009-1019 are covered, including the3 printed groups, all8 Cyrillic-labelled subparts, all unlabelled numeric inputs and compound requests. Exercise1015 includes both its source fragments. N61 begins at`p0224#7`/`#8`; its boundary prose and图VII are excluded from solving. No N59 task, answer or图223 was revisited.

Result-slot counts are explicitly defined in the bound observation report. Coverage below is51/51 result slots, including34 rounding requests. This is calculation coverage, not51 original exercises or approval of source completeness.

## Conventions and source HOLD

The source itself states at`p0222#5` that14.5 rounds to15, and at`p0222#6` that the first discarded digit5-9 causes an increment while0-4 does not. All written rounding inputs here are nonnegative. I use that explicit source rule, inspect the original first discarded digit directly, propagate carries, and replace discarded integer places with zeros. I do not round through intermediate precisions or use binary floating-point tie behavior.

Fixed requested decimal precision is retained in outputs such as204.0 and1.0. These are rounded approximations, not claims that the original number equals the rounded value exactly.

One prose-only SOURCE HOLD remains:`p0222-math-1`, at`p0222#2`. The printed sentence says that all numbers on the segment14 to15 have integer part14; the endpoint15 itself has integer part15. The original text is unchanged. I do not invent an unprinted exclusion of15 or a modern correction. This HOLD does not change the printed rounding rule or any written exercise input.

Exercise1016 has an explicit modelling qualification below: constant inflow and an initially empty pool are assumed for the standard time/proportion solution; that condition is not added to the faithful source text.

## 1009: adjacent natural numbers and approximation

Source:`p0223#1`. Each input has both a bound-pair request and a nearest-natural-number request.

| Input | Adjacent bounds | Distances to lower / upper | Rounded natural number |
| --- | --- | --- | --- |
| 5.38 | $5<5.38<6$ | $5.38-5=0.38$; $6-5.38=0.62$ | 5 |
| 82.71 | $82<82.71<83$ | $82.71-82=0.71$; $83-82.71=0.29$ | 83 |
| 121.3 | $121<121.3<122$ | $121.3-121=0.3$; $122-121.3=0.7$ | 121 |

Coverage:3 bound pairs +3 approximations =6 slots.

## 1010: round to ones

Source:`p0223#2`.

| Input | First discarded digit | Result |
| --- | --- | --- |
| 7.265 | 2 | $7.265\approx7$ |
| 11.638 | 6 | $11.638\approx12$ |
| 0.23 | 2 | $0.23\approx0$ |
| 8.5 | 5, exact tie | $8.5\approx9$ |
| 300.499 | 4 | $300.499\approx300$ |
| 6.5108 | 5 | $6.5108\approx7$ |

In particular300.499 is below300.5. Rounding it first to a tenth and then to ones would not follow the source's direct first-discarded-digit rule.
Coverage:6 slots.

## 1011: both kilogram precisions

Source:`p0223#3`; use the printed given1普特=16.38公斤 without modernizing the unit or substituting an external conversion.

- To个位: the first discarded digit is3, so16.38公斤 rounds to16公斤.
- To十分位: the first discarded digit is8, so16.38公斤 rounds to16.4公斤.

Coverage:2 slots.

## 1012: all three labelled subparts

Source:`p0223#4`. Preserve а),б),в) and the source order, including б)'s continued4.455.

а) 到十分位:

| Input | First discarded digit | Result |
| --- | --- | --- |
| 2.781 | 8 | $2.781\approx2.8$ |
| 3.1423 | 4 | $3.1423\approx3.1$ |
| 203.962 | 6 | $203.962\approx204.0$ |
| 62.35 | 5, exact tie | $62.35\approx62.4$ |
| 80.45 | 5, exact tie | $80.45\approx80.5$ |

For203.962 the retained tenths digit9 increments, carrying through the ones digit:203.9+0.1=204.0.

б) 到百分位:

| Input | First discarded digit | Result |
| --- | --- | --- |
| 0.07268 | 2 | $0.07268\approx0.07$ |
| 1.35506 | 5 | $1.35506\approx1.36$ |
| 10.081 | 1 | $10.081\approx10.08$ |
| 76.544 | 4 | $76.544\approx76.54$ |
| 4.455 | 5, exact tie | $4.455\approx4.46$ |

1.35506 is above1.355, not exactly a midpoint, but its first discarded digit still requires incrementing.

в) 到十位, not十分位:

| Input | First discarded digit (ones) | Result |
| --- | --- | --- |
| 167.1 | 7 | $167.1\approx170$ |
| 2085.04 | 5 | $2085.04\approx2090$ |
| 444.4 | 4 | $444.4\approx440$ |
| 300.7 | 0 | $300.7\approx300$ |

2085.04 is just above the midpoint2085 of2080 and2090; it rounds to2090. For300.7 the ones digit0 is the first digit discarded when rounding to tens; the tenths digit7 does not separately cause rounding to310.
Coverage:5+5+4=14 slots.

## 1013: television coverage and circle intersection

Source:`p0223#6`; actual source figure225 at`p0223#7`, caption`p0223#8`. The bound source observations record both circles, both labelled station dots and all four Roman regions. This solution uses their actual membership, not a prior figure spec or answer.

Let the interiors covered by stations A and B be denoted$S_A$ and$S_B$ solely as solution notation.

| Original request | Relationship | Source region |
| --- | --- | --- |
| а) only A's programmes | Inside large circle, outside small circle; $S_A\setminus S_B$ | I |
| б) only B's programmes | Inside small circle, outside large circle; $S_B\setminus S_A$ | III |
| в) both stations' programmes | Inside both circles; $S_A\cap S_B$ | II |
| Unlabelled: which region is the intersection? | Same shared lens-shaped region | II |

RegionIV is outside both, so it is not a receiving region for either station. The A dot is in the A-only portion and the B dot in the B-only portion; neither source dot is in the overlap. No coverage distances, radii or invented numerical measurements enter the answer.
Coverage:3 labelled requests +1 intersection request =4 slots.

## 1014: sum form and value

Source:`p0223#9`.

A product of2.75 by the natural number3 is three equal addends:

$2.75\cdot3=2.75+2.75+2.75$.

$2.75+2.75=5.50$, and$5.50+2.75=8.25$.

Exact fraction check:$2.75=\frac{11}{4}$, so$\frac{11}{4}\cdot3=\frac{33}{4}=8.25$.
Coverage:sum form +value =2 slots.

## 1015: both cloth fractions across the page boundary

Source:`p0223#10 ex open` +`p0224#1 ex cont`.

There are$3+5=8$ equal parts in the whole cloth.

- 连衣裙 occupies$\frac{3}{8}$.
- 罩衫 occupies$\frac{5}{8}$.

Check:$\frac{3}{8}+\frac{5}{8}=1$. Both are already reduced.
Coverage:2 slots.

## 1016: pool fraction with model condition stated

Source:`p0224#2`. The source gives6 hours to fill the pool and an elapsed1 hour25 minutes, but does not explicitly say that flow is uniform or that filling starts from an empty pool.

Under the time-proportion model of constant inflow from an initially empty pool:

- Total filling time:$6\cdot60=360$ minutes.
- Elapsed time:$1\cdot60+25=85$ minutes.
- Filled fraction:$\frac{85}{360}=\frac{17}{72}$, reducing numerator and denominator by5.

Equivalently1 hour25 minutes is$\frac{17}{12}$ hours and$\frac{17}{12}:6=\frac{17}{72}$.

Result:$\frac{17}{72}$ of the pool under the stated model. With arbitrary variable inflow or unspecified initial water this fraction is not determined by time alone; that caveat is not hidden or inserted into the source as though printed.
Coverage:1 qualified modelling slot.

## 1017: all homework rounding inputs

Source:`p0224#4`. The printed continuation lines802.3032 and61.3501 belong to their respective original subparts.

а) 四舍五入到个位:

| Input | First discarded digit | Result |
| --- | --- | --- |
| 1.69 | 6 | $1.69\approx2$ |
| 1.198 | 1 | $1.198\approx1$ |
| 37.444 | 4 | $37.444\approx37$ |
| 37.5444 | 5 | $37.5444\approx38$ |
| 802.3032 | 3 | $802.3032\approx802$ |

б) 四舍五入到十分位:

| Input | First discarded digit | Result |
| --- | --- | --- |
| 0.3691 | 6 | $0.3691\approx0.4$ |
| 0.8218 | 2 | $0.8218\approx0.8$ |
| 0.9702 | 7 | $0.9702\approx1.0$ |
| 61.3501 | 5 | $61.3501\approx61.4$ |

For0.9702 the retained0.9 increments by0.1, giving1.0. For61.3501 the value is just above61.35, and its first discarded digit5 requires incrementing61.3 to61.4.
Coverage:5+4=9 slots.

## 1018: construction and all remaining angles

Source:`p0224#5`. No source figure is printed for this task. The following is a textual solution construction, not a new source/modern figure asset.

1. Choose an intersection point$O$ and draw a straight line through it. Name its opposite rays$OA$ and$OC$.
2. At$O$, use a protractor to draw ray$OB$ making$\angle AOB=155^\circ$ with$OA$.
3. Extend$OB$ through$O$ to the opposite ray$OD$. Lines$AC$ and$BD$ are the required two intersecting straight lines.

Since adjacent angles on a straight line total180 degrees and vertically opposite angles are equal:

$\angle BOC=180^\circ-155^\circ=25^\circ$.

$\angle COD=\angle AOB=155^\circ$.

$\angle DOA=\angle BOC=25^\circ$.

Thus the other three angles are25 degrees,155 degrees,25 degrees in cyclic order after the given angle. Check:$155+25+155+25=360$ degrees.
Coverage:explicit construction +3 remaining angles =4 slots.

## 1019: exact compound calculation

Source:`p0224#6`. Preserve the actual source constants8688,31 and196.

$37.3+21.7=59$.

$59\cdot13=767$.

$767+8688=9455$.

$9455:31=305$, since$31\cdot305=9455$.

$305-196=109$.

Therefore$[(37.3+21.7)\cdot13+8688]:31-196=109$.
Coverage:1 slot, with every intermediate operation recorded.

## Source prose computations, not extra written exercises

These verify only the complete N60 prose and figure224 conventions. They do not add N59 or N61 tasks or inflate the51 written result slots.

| Source refs | Independent check |
| --- | --- |
| `p0221#5`-`#10` plus`p0222#1` | 1卢布48戈比=148戈比.100克 is$\frac{100}{1000}=\frac{1}{10}$公斤, so its calculated cost is$\frac{148}{10}=\frac{74}{5}=14.8$戈比. Distances to14 and15 are0.8 and0.2, respectively; payment rounded to a whole戈比 is15戈比. Currency and quantities remain verbatim source values. |
| `p0222#2` and figure224 | For14.407, distances to14 and15 are0.407 and0.593, so the nearest integer is14. For14.513 they are0.513 and0.487, so it is15. The figure's printed comma decimal labels are retained as image observations, not modernized in the source. |
| `p0222#5` | For14.5 both distances are0.5. The source's excess-approximation tie rule selects15. |
| `p0222#7`-`#9` | Directly rounding86.2759 to tenths discards first digit7, so86.2 becomes86.3. |
| `p0222#11`-`#13` | Directly rounding28 148.3 to thousands discards first digit1, retaining28 thousands and replacing smaller integer places with zeros:28 000. |

The endpoint SOURCE HOLD at`p0222#2` remains exactly as registered; checking the interior examples does not resolve or approve that endpoint sentence.

## Coverage and verification limits

| Original exercise | Complete inputs / compound requests addressed | Result slots |
| --- | --- | --- |
| 1009 | 3 inputs, each with2 adjacent bounds and nearest-natural-number choice | 6 |
| 1010 | 6 ones-rounding inputs | 6 |
| 1011 | Both requested kilogram precisions | 2 |
| 1012 | а)5,б)5,в)4 | 14 |
| 1013 | а),б),в) and unlabelled intersection, using source figure225 | 4 |
| 1014 | Repeated-addition form and exact value | 2 |
| 1015 | Both garment fractions after cross-page join | 2 |
| 1016 | Exact pool fraction under the explicitly stated uniform-flow / empty-pool model | 1 |
| 1017 | а)5,б)4, including both continuation lines | 9 |
| 1018 | Textual construction and all3 remaining angles | 4 |
| 1019 | Full exact arithmetic expression | 1 |
| Total | 11/11 exercises; all8 labelled subparts | 51/51 |

Arithmetic was additionally checked offline with standard-library exact`Decimal` using`ROUND_HALF_UP` for all34 source rounding requests and`Fraction` for the sum/product, cloth/pool fractions and compound expression. These computations used only my observed source inputs; they are not test/key exposure or an independent reviewer.

Actual source image usage remains1 batch,5 images:221/222/223/224 grids once each plus one figure225 crop. No extra solution images were opened or generated.

The sole unresolved source mathematics HOLD is the N60 endpoint wording; no correction, source-review PASS, finalized lesson, N61 completeness or publication is claimed. The bounded handoff is ready for the parent to run official finalize and commission a fresh independent source review, with this author solution record kept distinct from that reviewer's own derivation.
