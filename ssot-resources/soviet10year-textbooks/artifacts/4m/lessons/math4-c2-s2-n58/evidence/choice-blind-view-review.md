# N58 blind visible-view review

Ticket: STEMROBIN-187. Freeze: `2026-11-23T03:50:40Z`.
Scope: the disclosed `views.json`, all 28 questions and all 89 options,
against the already-frozen 15 source solutions and definition block 9.

**Visible-stage status: REVISE, for the package-level positional cue below.**
All 28 source/task checks and mathematical true-set checks pass.
This is not internal-key agreement, final choice approval or a review JSON.

## Blind Boundary and Evidence

The source stage was collected at SHA-256
`3afdad6f15fd46a3d2d8149cf30f28bff9c7b689f44d1561d95d3780f210e2b6`.
The only newly disclosed choice file read was
`.tmp/stemrobin-187/n58/choices/views.json`, byte SHA-256
`d91a81137eba6d4cd0f5d03c541192f23946d54c813cf065952493a4265efa36`.

The projection contains exactly 28 `id`/`view` entries: 27 native
single-select and one native multiple-select, q03. All 89 options were
independently classified. There are no internal intent, source_solution,
key or coverage fields in this projection. No `draft.json`,
`source-solutions.md`, author report, author-solutions,
independent-solutions or answer-keys file was opened.

Task fidelity, redundancy and visible disclosure were examined against
the frozen sources before any internal comparison. Every visible task
was then solved afresh; the true sets below were calculated, not copied
from an author's key. Package positional cues were checked against those
independently derived sets.

**New image opens: 0. Cumulative actual images: 4/24 unchanged.**
The complete original/modern observations from the preceding approved
figure review are reused for the byte-identical seed SVGs. No PNG or SVG
was visually opened, decoded, cropped or rerendered. No new figure was
introduced: only q12 uses fig-222 and q27 uses tbl-p0216-01; every
option's `figure_ids` is empty.

All commands used workdir
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.
Only this new evidence file was written. Dirty edits were preserved.
No database, environment, dependency, model service, commit, push,
additional agent or other chat was used.

## Concrete REVISE Finding

**[P2] Long answer-position cycles provide a package-level shortcut.**

The independently solved single-select answers q13 through q26 are:

```text
q13 A, q14 B, q15 C, q16 A, q17 B, q18 C, q19 A,
q20 B, q21 C, q22 A, q23 B, q24 C, q25 A, q26 B
```

That is an uninterrupted `A,B,C` cycle across 14 consecutive questions
covering fractions, a bus problem, equations, compound expressions,
decimal sums and a relay problem. After solving the first three,
following the observed positional sequence answers the next eleven
without doing those different tasks. q04-q11 also repeat
`B,C,A,B,C,A,B,C` across eight consecutive single-select items.

This is a concrete cross-question cue in the disclosed package, not a
false mathematical option, duplicate answer in a single item, or a
requirement for a particular randomization algorithm or letter quota.
The affected package leakage checks are **REVISE for q04-q11 and
q13-q26**. Other questions' visible leakage checks pass. No question's
mathematical true set is changed by this finding.

Smallest repair scope: break these predictable option-position sequences
while preserving the mathematical option content and source tasks.
Any reordered/relabeled snapshot must be bound to the appropriate
internal key later. No repair or key edit was made here.

## Source Fidelity, Redundancy and Coverage

All 15 source tasks and every original written subpart remain represented:

| Source | Visible units | Task evidence |
| --- | --- | --- |
| 961 | q01 | General commutative identity and both numerical substitutions retained together. |
| 962 | q02 | General associative identity and the given three-number verification retained. |
| 963 | q03 | All three place-value decompositions retained; native multiple asks for all true equalities. |
| 964 | q04-q09 | All six original additions, same addends and precision, one meaningful computation per item. |
| 965 | q10 | Four-second total, first 4.9 m and successive +9.8 m, not fourth-second distance alone. |
| 966 | q11 | Second field is 16.8 tonnes greater; asks the two-field total. |
| 967 | q12 | Same two textual bisectors, measure KAP first, then calculate approximate OAM; same figure. |
| 968 | q13-q16 | All four fraction/mixed-number sums retained separately, including the whole-unit carry. |
| 969 | q17 | All distances/speeds, opposing travel, unequal starts and which bus/how much earlier retained. |
| 970 | q18-q19 | Both original equations retained, with division typeset as a fraction without changing grouping. |
| 971 | q20-q21 | Both compound expressions preserve parentheses, multiplication/division and thousands separators. |
| 972 | q22-q25 | All four decimal additions retained at original precision. |
| 973 | q26 | All four time/distance pairs retained; one option must get both total time and distance right. |
| 974 | q27 | One complete-table recognition task, all nine interiors, fixed six givens, blank corner and adjacent recursion. |
| 975 | q28 | Second side exceeds first by 14.8 cm; third exceeds second by 8.6 cm; perimeter requested. |

**Task fidelity PASS for all 28 questions.** No original numerical given,
unit, direction, requested subpart or essential relationship is omitted.
Stems do not expose source-number mapping or internal source solutions.
The selected definition remains block 9's four-step decimal-addition rule;
no solved example was treated as a definition.

**Question redundancy PASS.** Splitting 964, 968, 970, 971 and 972 follows
their distinct written computations, rather than creating several clicks
for a single answer. The remaining bundled units require one meaningful
joint judgment. No question gives another question's needed numerical
answer or depends on solving an earlier question for its input.
The positional shortcut above is a separate package leakage defect.

q01/q02 can be eliminated using the law identity before explicitly
recomputing every verification. This is ordinary recognition/elimination,
not a disclosure of an answer in the stem; all original substitutions
are still present. Likewise q26 bundles both requested quantities.
Recognizing choices does not prove independent written verification or
show a student's working; those production losses must be recorded
in the later internal comparison, not silently treated as writing evidence.

q03 deliberately includes equivalent D/F expressions for 6.2703, one
with `0/1000` and one without. Because the unit is **native multiple**
and explicitly requests all correct equalities, both must be selected.
This tests the neutral zero term without making a single-select item
ambiguous. There is no requirement to select just one expression per
source number. It is not a duplicate-question defect or an invalid
single-answer assertion.

## All 28 Fresh Solutions and All 89 Option Checks

In the rows below, `T` means the visible option is mathematically correct
for that stem; `F` means it is not. All source/task-fidelity and mathematical
checks in this section are **PASS**. Redundancy checks are PASS throughout.
Leakage is REVISE only for the positional-cycle groups already identified.

### n58-q01 / source 961

Fresh solution: `x+y=y+x`; the sums are `7.3+2.9=10.2` and
`10.24+19.76=30`. Both reversed orders give the same respective sums.

- A **F**: `x+y=x-y` is not the commutative law; 4.4 and -9.52 are differences, not the given sums.
- B **T**: the general identity and both 10.2/30 sums are correct.
- C **F**: `x+y=xy` is not the law; 21.17/202.3424 are products, not sums.

Complete true set: **{B}**.

### n58-q02 / source 962

Fresh solution: `(a+b)+c=a+(b+c)`;
`78.41+0.95=40+39.36=79.36`.

- A **T**: correct law and both sides 79.36.
- B **F**: `a+bc=40+38.41*0.95=76.4895`, not the unchanged left side 79.36.
- C **F**: `(a+b)c=78.41*0.95=74.4895`, not the unchanged left side 79.36.

Complete true set: **{A}**.

### n58-q03 / source 963 / native multiple

Fresh solution: place-value denominators are 10, 100, 1000 and 10000.
The zero thousandths term of 6.2703 may be shown or omitted.

- A **F**: RHS `6+0.2+0.07+0.003=6.273`, not 6.2703; the 3 is one place too far left.
- B **T**: RHS `8+0.6+0.04=8.64`.
- C **F**: RHS `7+0.05+0.003+0.0002=7.0532`, not 7.532.
- D **T**: RHS `6+0.2+0.07+0+0.0003=6.2703`.
- E **T**: RHS `7+0.5+0.03+0.002=7.532`.
- F **T**: RHS `6+0.2+0.07+0.0003=6.2703`, exactly equivalent to D.

Complete true set: **{B,D,E,F}**, four true assertions and two false.
D/F equivalence is included in the set, not normalized into one answer.

### n58-q04 / source 964a

Fresh solution: `0.769+42.389=43.158`, including the fractional carry
to the integer part.
A **F** 42.158; B **T** 43.158; C **F** 42.048.
Complete true set: **{B}**.

### n58-q05 / source 964b

Fresh solution: `95.381+3.219=98.600=98.6`, carrying from thousandths
through hundredths.
A **F** 98.590; B **F** 98.500; C **T** 98.600.
Complete true set: **{C}**.

### n58-q06 / source 964c

Fresh solution: `5.800+22.191=27.991`, not right-aligned digit strings.
A **T** 27.991; B **F** 22.249; C **F** 27.271.
Complete true set: **{A}**.

### n58-q07 / source 964d

Fresh solution: `8.9021+0.6800=9.5821`, retaining the whole-unit carry.
A **F** 8.9089; B **T** 9.5821; C **F** 8.5821.
Complete true set: **{B}**.

### n58-q08 / source 964e

Fresh solution: `2.70+1.35+0.80=4.85`.
A **F** 4.05 omits 0.8; B **F** 3.50 omits 1.35;
C **T** 4.85 includes all three addends.
Complete true set: **{C}**.

### n58-q09 / source 964f

Fresh solution: `13.750+8.200+0.115=22.065`.
A **T** 22.065; B **F** 21.950 omits the third addend;
C **F** 21.210 differs from the exact sum by 0.855.
Complete true set: **{A}**.

### n58-q10 / source 965

Fresh solution: successive distances are `4.9,14.7,24.5,34.3` m;
their sum is 78.4 m.
A **F** 34.3 m is only the fourth interval; B **T** 78.4 m;
C **F** 19.6 m equals four copies of the first interval and ignores increases.
Complete true set: **{B}**.

### n58-q11 / source 966

Fresh solution: second field `95.37+16.8=112.17` tonnes;
combined `95.37+112.17=207.54` tonnes.
A **F** 112.17 is only the second field; B **F** 190.74 omits the excess;
C **T** 207.54 tonnes.
Complete true set: **{C}**.

### n58-q12 / source 967

Fresh solution: measure `theta=KAP` from the same unchanged figure.
AK bisects OAP, so OAK=theta; AM bisects OAK, so OAM=theta/2.
The reviewed ordinary KAP measurement is about 49 degrees; OAM is
about 24.5 degrees. The underlying geometry gives OAM
`24.48242120336238` degrees, not an exact 25-degree theorem.

- A **F**, about 50 degrees: about 25.52 degrees from the calculated target; no required final halving.
- B **F**, about 12.5 degrees: about 11.98 degrees from the target; an extra halving.
- C **F**, about 65 degrees: about 40.52 degrees from the target.
- D **T**, about 25 degrees: only about 0.52 degrees from the geometric target and 0.5 from a normal 49/2 reading.

Complete true set: **{D}** under the visible stem's ordinary coarse
approximation. D is well separated from the other options (the next
closest is nearly 12 degrees away); it is not being certified as an
exact equality or used to replace KAP with a convenient exact 50.
The visible task explicitly retains measuring KAP before halving and
does not supply its numeric angle. No numerical grading-tolerance
contract or internal exact-50 rationale has been disclosed or approved.

Reused observation: common A, clockwise AO/AM/AK/AP, all five labels,
four solid rays, one minor KAP arc, no angle values or equality marks.
Clean O resolves the original Q-shaped glyph by the task text.
Recognition of the final approximate angle cannot prove the learner
actually used a protractor; that response-mode loss remains to be
confirmed in the later internal record.

### n58-q13 / source 968(1)

Fresh solution: `3/10+5/10=8/10=4/5`.
A **T** 4/5; B **F** 2/5; C **F** 1/5.
Complete true set: **{A}**.

### n58-q14 / source 968(2)

Fresh solution: `2/7+1/7=3/7`, keeping the denominator.
A **F** 3/14 adds denominators; B **T** 3/7;
C **F** 1/7 is a difference, not the sum.
Complete true set: **{B}**.

### n58-q15 / source 968(3)

Fresh solution: `4+1+(3+8)/11=5+1=6`.
A **F** 5 1/2 is 11/2, not 6; B **F** 5 omits the whole unit
carried from the fractions; C **T** 6.
Complete true set: **{C}**.

### n58-q16 / source 968(4)

Fresh solution: `2/5+7 1/5=7 3/5=38/5`.
A **T** 7 3/5; B **F** 7 3/10=73/10;
C **F** 7 1/5=36/5 omits 2/5.
Complete true set: **{A}**.

### n58-q17 / source 969

Fresh solution: first bus travels `312/52=6` hours; the second travels
`(480-312)/42=4` hours. Their common meeting time requires the first
bus to have left 2 hours earlier.
A **F** reverses the bus; B **T** first bus, 2 hours earlier;
C **F** confuses the first bus's entire 6-hour journey with the departure gap.
Complete true set: **{B}**.

### n58-q18 / source 970(1)

Fresh solution: `327x=389*57+5295=27468`, hence `x=84`;
substitution gives `22173/57=389`.
A **F** x=5626/109, not 84; B **F** x=27468 is the value of 327x,
not x; C **T** x=84.
Complete true set: **{C}**.

### n58-q19 / source 970(2)

Fresh solution: `27x+11=11970/315=38`, so `x=(38-11)/27=1`.
A **T** x=1; B **F** x=49/27 adds 11 instead of subtracting it;
C **F** x=38/27 skips subtraction.
Complete true set: **{A}**.

### n58-q20 / source 971(1)

Fresh solution: `16112/304=53`, inner value `6112-53=6059`,
then `200500-39591-6059=154850`.
A **F** 154744 subtracts the 53 again instead of reversing that inner
subtraction; B **T** 154850; C **F** 154797 ignores the division term.
Complete true set: **{B}**.

### n58-q21 / source 971(2)

Fresh solution: `609*25=15225`, inner sum 18303, outer sum 94110;
`94110-18303=75807`.
A **F** 106257 adds 15225 after dropping the parenthesized subtraction;
B **F** 1935 corresponds to wrongly evaluating `(3078+609)*25`;
C **T** 75807.
Complete true set: **{C}**.

### n58-q22 / source 972a

Fresh solution: `395.486+4.580=400.066`.
A **T** 400.066; B **F** 399.066 omits the integer carry;
C **F** 399.544 corresponds to adding 4.058 rather than 4.58.
Complete true set: **{A}**.

### n58-q23 / source 972b

Fresh solution: `7.60+908.67=916.27`.
A **F** 915.73 corresponds to 7.06+908.67; B **T** 916.27;
C **F** 915.27 loses the fractional whole-unit carry.
Complete true set: **{B}**.

### n58-q24 / source 972c

Fresh solution: `0.5400+24.1789=24.7189`.
A **F** 24.1843 corresponds to adding 0.0054;
B **F** 24.7200 rounds to hundredths without being asked and is not
equal to 24.7189; C **T** 24.7189.
Complete true set: **{C}**.

### n58-q25 / source 972d

Fresh solution: `1.9679+2065.0121=2066.9800`.
A **T** 2066.9800; B **F** 2065.9800 is one whole unit short;
C **F** 2066.9790 is 0.001 short, missing the ten-thousandths carry.
Complete true set: **{A}**.

### n58-q26 / source 973

Fresh solution: last time `1 min 42.7 s=102.7 s`;
`10.2+20.5+46.7+102.7=180.1 s=3 min 0.1 s`.
Distance `100+200+400+800=1500 m`.

- A **F**: 2 min 0.1 s=120.1 s omits the last runner's full minute, although distance 1500 m is right.
- B **T**: both 3 min 0.1 s and 1500 m are right.
- C **F**: time is right, but 800 m is only the last leg.
- D **F**: 3 min 40.1 s=220.1 s treats a minute as 100 seconds, although distance 1500 m is right.

Complete true set: **{B}**.

### n58-q27 / source 974

Fresh solution uses each immediately adjacent upper/left pair,
including newly calculated internal values. The completed interiors are:

```text
5.78   6.50   7.64
6.46  12.96  20.60
8.17  21.13  41.73
```

Every option is a full 4x4 Markdown table, including header/corner.
All preserve exactly the six givens and a blank upper-left corner.
No cell-level clicks, plus/corner zero or changed givens are introduced.

- A **F**: its interiors are independent sums of the top and left headers. Only (2,2) passes the actual local recurrence; eight of nine local conditions fail.
- B **T**: all nine local conditions and the unique completed source table pass.
- C **F**: local recurrence fails at (3,3), (3,4), (4,3); its four downstream source values differ from the correct completed table.

Coordinates are one-based, including headers. Complete local-condition
audit for A lists actual -> required from that option's own neighbours:

```text
(2,2) 5.78 -> 5.78 PASS
(2,3) 6.15 -> 6.50 FAIL
(2,4) 6.57 -> 7.29 FAIL
(3,2) 1.03 -> 6.46 FAIL
(3,3) 1.40 -> 7.18 FAIL
(3,4) 1.82 -> 7.97 FAIL
(4,2) 2.06 -> 2.74 FAIL
(4,3) 2.43 -> 3.46 FAIL
(4,4) 2.85 -> 4.25 FAIL
```

B's nine values exactly satisfy their own adjacent neighbours:
`5.43+0.35`, `5.78+0.72`, `6.50+1.14`,
`0.68+5.78`, `6.46+6.50`, `12.96+7.64`,
`1.71+6.46`, `8.17+12.96`, `21.13+20.60`.

Complete local-condition audit for C:

```text
(2,2) 5.78 -> 5.78 PASS
(2,3) 6.50 -> 6.50 PASS
(2,4) 7.64 -> 7.64 PASS
(3,2) 6.46 -> 6.46 PASS
(3,3) 2.96 -> 12.96 FAIL
(3,4) 0.60 -> 10.60 FAIL
(4,2) 8.17 -> 8.17 PASS
(4,3) 1.13 -> 11.13 FAIL
(4,4) 1.73 -> 1.73 PASS
```

C's bottom-right local condition passes using its already-wrong
neighbours; that does not make 1.73 the correct source-table result
41.73. All nine conditions, not a single selected cell, were checked.
Complete true set: **{B}**.

Task fidelity **PASS**: full-table recognition retains the essential
recursive mathematical judgment. A student may reasonably eliminate
tables from a diagnostic cell without filling all nine; this is not a
cell-click conversion or automatic gate failure. The lost capacity is
independent production/entry of nine answers and visibility of the
student's filling order, not the recursive relation itself. The later
internal record must disclose that response-mode loss.

Reused figure observation: complete 4x4 including all right/bottom
borders, top 0.35/0.72/1.14 and left 5.43/0.68/1.71 in exact cells,
nine blank interiors and blank corner; all were already inspected.

### n58-q28 / source 975

Fresh solution: sides 83.6, `83.6+14.8=98.4`,
`98.4+8.6=107.0` cm; perimeter 289.0 cm.
A **F** 274.2 results from incorrectly making the third side
83.6+8.6 instead of 98.4+8.6; B **F** 303.8 is 14.8 cm too large;
C **T** 289.0 cm.
Complete true set: **{C}**.

## Frozen Complete Correct Sets

These are independently derived visible-stage sets, not disclosed keys:

```text
n58-q01={B}
n58-q02={A}
n58-q03={B,D,E,F}
n58-q04={B}
n58-q05={C}
n58-q06={A}
n58-q07={B}
n58-q08={C}
n58-q09={A}
n58-q10={B}
n58-q11={C}
n58-q12={D}
n58-q13={A}
n58-q14={B}
n58-q15={C}
n58-q16={A}
n58-q17={B}
n58-q18={C}
n58-q19={A}
n58-q20={B}
n58-q21={C}
n58-q22={A}
n58-q23={B}
n58-q24={C}
n58-q25={A}
n58-q26={B}
n58-q27={B}
n58-q28={C}
```

There are 31 true and 58 false options: exactly one true option for
each of the 27 single items, four true options for q03.
No single-select item contains two equivalent true alternatives.

## Actual Command Evidence

Read-only JSON projection check exited **0**: 28 ordered unique IDs,
27 single/1 multiple, 89 options, exact allowed visible fields,
two known seed figures, no new option figures, current SVG byte hashes.
No internal choice artifact was opened.

A fresh standard-library Decimal/Fraction computation exited **0**.
It evaluated each visible numerical/equality alternative, checked both
law-verification RHSs, the buses' two travel times, both equations,
both relay quantities, all nine recurrence conditions in each of the
three complete tables, and the full true sets. It generated no file,
image or producer output. The angle used the preceding reviewed
measurement, not a new SVG or source-image reading.

The calculation also verified the exact q13-q26 and q04-q11 position
sequences behind the REVISE finding. It did not consult an author's
key or infer a pass from a structural validator. The official
choice validator was not run because its draft/internal-review inputs
have not been authorized for this stage.

## Frozen File Bindings

All paths below are relative to
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.

| Input | SHA-256 |
| --- | --- |
| `.tmp/stemrobin-187/n58/choices/views.json` | `d91a81137eba6d4cd0f5d03c541192f23946d54c813cf065952493a4265efa36` |
| `.tmp/stemrobin-187/n58/choices/seed.json` | `02b8003a18d4b38505b9294dea354fdcb398d91c603c16d21f21539be7f6f8af` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n58/evidence/choice-blind-source.md` | `3afdad6f15fd46a3d2d8149cf30f28bff9c7b689f44d1561d95d3780f210e2b6` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s2-n58/evidence/independent-modern-figures.md` | `1ad8a23893f6afedc2a2137f734311173ecada3ee7ed7ece78c2d8ba3882f965` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-222.svg` | `918f4468d646d845a72c107e4942e6a109851195d73d9b161d84c00b0811fb75` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/tbl-p0216-01.svg` | `b3e8d061c7413bc08aa72ab0f245c853908f33e18cf7be4cbc52c156bbd2070e` |
| `.agents/skills/ld-s10y-choice/references/review.md` | `7ab367601247bece0fa05b60a9cd1555d78f1169ed581db76f18385f75aaacea` |
| `.agents/skills/ld-s10y-choice/references/contract.md` | `e5443f08fb535a100e2f036f0e966d3ce67db07356031161d791b44e296ccb06` |

Seed canonical digest retained from the source stage:
`7505b326fa87ad0f8b9e209bd5a68ed7fd8c772eca671eef4659a4ff9aca0cfe`.
The retained fig-222 SVG still matches approved repair1, not the first
failed candidate; the retained table SVG remains identical.

## Handoff State

28/28 source/task checks and 89/89 option truth checks complete.
Visible-stage **REVISE** solely for the concrete cross-question
position cycles; no mathematical true-set defect found.
ZERO new images; cumulative **4/24 unchanged**.
No internal comparison, author-rationale approval, final review JSON,
repair, promotion or final choice approval. Await parent disclosure
for the later internal-comparison stage.
