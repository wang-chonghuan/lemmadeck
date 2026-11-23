# STEMROBIN-187 N56 choice blind review

## Scope and input barrier

- Date: 2026-11-23. Fresh-context, independently delegated reviewer under the existing human production authorization.
- This phase reviews only the blind source and subsequently the learner-visible `id/view` projection. It does not approve an internal draft, key, misconception derivation, structural contract, publication, or application payload.
- Sole write: this file. No DB, env, install, paid call, Git, APP, other chat, spawn, producer, or checker rerun.
- Read first: this root's `ld-s10y-choice/SKILL.md`, `references/contract.md`, `references/review.md`, `references/authoring.md`, and the shared `ld-s10y-image/SKILL.md` image rules.
- Allowed mathematical inputs: `.tmp/stemrobin-187/n56/choices/seed.json`, then exactly the two full 640px figure PNGs below. No fig-215, draft, build script, author solutions, answer key/book, historical source/solution/comparison reports, other lessons, or modern internal specifications were read.
- **SOURCE CHECKPOINT: all 935-945 source solutions below were completed and saved before the first read of `views.json`. At this checkpoint no visible choices have been read.**

## Snapshot and actual image evidence

Seed: `.tmp/stemrobin-187/n56/choices/seed.json`.

- Raw file SHA-256: `e13d1091624fffac18189b130f26bcb630771d592f74f6eaad12c2574d3bee05`.
- Contract canonical JSON SHA-256: `255c29ec1f56bba854eb3bdac35d69874980207bdb69c3efebdfe9a3ed2ece81` (`jq -S -c -a`, newline removed).
- Seed trace entries are retained provenance only; this phase did not open the four trace source files or claim fresh reconstruction of the seed.

Actual images: **one batch of 2; each opened once; actual images 2/24**. No crop, reopen, screenshot, replacement render, or image payload is returned to the parent.

| Figure | Actual complete image | Pixels | PNG SHA-256 |
| --- | --- | --- | --- |
| fig-216 | `.tmp/stemrobin-187/n56/figures/fig-216-640.png` | 640 x 480 | `275c389e53b2ec79a865fb65a49dc350adaeaf87768f9fc40ca1bb43780b1eb0` |
| fig-217 | `.tmp/stemrobin-187/n56/figures/fig-217-640.png` | 640 x 430 | `bf0c17aa7522bcbd7d2574c819c9cd49ffd57c6345ab470bb9583c3b800c1009` |

For both figures, the current seed-declared durable SVG's computed SHA-256 equals the seed SHA and the scratch rendering-basis SVG SHA; direct `cmp` also returned exit 0. This text/byte binding supplements, not substitutes for, the actual PNG observations.

| Figure | Current seed asset | Matching scratch rendering basis | Both SVG SHA-256 |
| --- | --- | --- | --- |
| fig-216 | `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-216.svg` | `.tmp/stemrobin-187/n56/figures/fig-216.svg` | `8955d263b7cc74121f2cdb7b9233e929ee8379a0bb832e7cf66bf57f1fb4844d` |
| fig-217 | `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-217.svg` | `.tmp/stemrobin-187/n56/figures/fig-217.svg` | `ca4c0bbd7e6c3b49abb2547e4d97fb26b46a1774cd0744b0177a68e21ae50430` |

Actual fig-216 observation: O is the single common vertex at left. OA points upper-right to A; OB points horizontally right to B; OC points lower-right to C. OB lies strictly inside the smaller overall angle AOC. One arc spans OA to OB and another spans OB to OC; they delimit adjacent angles sharing OB, not competing whole-angle labels. O, A, B and the lowest/rightmost C endpoint and label are fully visible. No numerical angle labels or answer labels appear.

Actual fig-217 observation: M is the single common vertex near the bottom. MA points upper-left to A, MC upper-right to C, and MK horizontally right to K. MC lies strictly inside the overall angle AMK. The larger-radius right arc spans MC to MK; the smaller-radius arc spans MA to MK and crosses MC, so it represents the whole AMK, not just AMC. A, C, M and the rightmost K endpoint/label are fully visible. No numerical angle labels or answer labels appear. Exact degree values come from the prose, not visual measurement.

## Independent full source baseline

### Concept block 6

Use the seed's definition: right angle = 90 degrees, straight angle = 180 degrees; acute is smaller than 90 degrees, obtuse is strictly between 90 and 180 degrees. The displayed seed angles are positive, so no zero-angle convention is needed. Addition/subtraction uses the observed internal rays, not an assumption from the exercise wording alone.

### 935: classify all four named angles

A = 87 degrees and P = 3 degrees are acute because each is below 90. E = 175 degrees and M = 92 degrees are obtuse because 90 < 175 < 180 and 90 < 92 < 180. Neither right nor straight appears. Full classification: acute {A, P}; obtuse {E, M}. This is naturally selection of all members, not a combination-code answer or four isolated yes/no clicks.

### 936: adjacent angles in fig-216

OB is internal to AOC, so angle AOC = angle AOB + angle BOC = 37 + 19 = **56 degrees**. Both component angles use vertex O; the shared side OB is counted as the partition, not an extra angle. Subtraction 37 - 19 = 18 would apply to a different nesting arrangement and is false here.

### 937: degrees of fractions of right and straight angles

In the printed a-d order: (1/2) x 90 = **45 degrees**; (1/3) x 90 = **30 degrees**; (1/2) x 180 = **90 degrees**; (1/3) x 180 = **60 degrees**. Full ordered vector: **(45, 30, 90, 60)** degrees. Preserve which baseline is right and which is straight.

### 938: fractions of a right angle

Use angle/90, not 90/angle. In a-b order: 30/90 = **1/3**; 15/90 = **1/6**. Full ordered vector: **(1/3, 1/6)** of a right angle.

### 939: fractions of a straight angle

Use angle/180. In a-d order: 30/180 = **1/6**; 45/180 = **1/4**; 60/180 = **1/3**; 120/180 = **2/3**. Full ordered vector: **(1/6, 1/4, 1/3, 2/3)** of a straight angle. In particular 120 degrees is still less than one straight angle.

### 940: all 13 digit-place entries, including zeros

The task asks how many units of each digit's place, not the expanded numerical contribution alone. The six printed digit places in 37.0654 and the seven in 450.1207 give **13 entries**:

| Number | Place (highest to lowest) | Number of units of that place |
| --- | --- | --- |
| 37.0654 | tens | 3 |
| 37.0654 | ones | 7 |
| 37.0654 | tenths | 0 |
| 37.0654 | hundredths | 6 |
| 37.0654 | thousandths | 5 |
| 37.0654 | ten-thousandths | 4 |
| 450.1207 | hundreds | 4 |
| 450.1207 | tens | 5 |
| 450.1207 | ones | 0 |
| 450.1207 | tenths | 1 |
| 450.1207 | hundredths | 2 |
| 450.1207 | thousandths | 0 |
| 450.1207 | ten-thousandths | 7 |

Ordered digit-unit vectors: **(3, 7, 0, 6, 5, 4)** and **(4, 5, 0, 1, 2, 0, 7)**. Cross-check: 37.0654 = 30 + 7 + 0/10 + 6/100 + 5/1000 + 4/10000; 450.1207 = 400 + 50 + 0 + 1/10 + 2/100 + 0/1000 + 7/10000. Each zero fixes a place; deleting it shifts later digits.

### 941: both comparisons

In a-b order: **12.567 < 125.67**, because the integer parts satisfy 12 < 125; **7.399 < 7.4**, because 7.4 = 7.400 and 399 thousandths < 400 thousandths. Difference in the second pair is 0.001. Do not rank by digit count.

### 942: two distinct minus-before-parentheses cases

1. 14k - (8k + 3k) = 14k - 8k - 3k = 3k = 1512, so **k = 504**. Check: 7056 - (4032 + 1512) = 1512. Both inner terms acquire minus signs.
2. 11n - (5n - 3n) = 11n - 5n + 3n = 9n = 8136, so **n = 904**. Check: 9944 - (4520 - 2712) = 8136. The inner negative term becomes positive.

Full ordered vector: **(504, 904)**. The equations are mathematically independent; if split, retain both sign patterns. Neither a shared answer value nor the printed item labels justify a redundant rewrite.

### 943: contained angle subtraction in fig-217

MC is internal to AMK, so angle AMK = angle AMC + angle CMK. Hence angle AMC = 132 - 42 = **90 degrees**, a right angle under block 6. Vertex M is shared by every angle. Adding 132 + 42 double-counts CMK and contradicts the observed whole/component relation.

### 944: successive fractions with changed time baseline

Total time = 1 hour 40 minutes = **100 minutes**. Application problems take 100/5 = **20 minutes**. Remaining time is 100 - 20 = **80 minutes**; equations take 80/4 = **20 minutes**, not 100/4. Combined time = 20 + 20 = **40 minutes** (2/5 of the total). The unasked remainder after both is 60 minutes; it is not the requested answer.

### 945: both quotients and their subtraction

First numerator: 59942 - 14989 - 4000 = 44953 - 4000 = **40953**; 40953/51 = **803**, verified by 803 x 51 = 40953. Second numerator: 49387 + 24489 = **73876**; 73876/92 = **803**, verified by 803 x 92 = 73876. Entire expression = 803 - 803 = **0**. Both divisions must be evaluated before subtraction; equal quotients are the result, not an assumption.

## Source checkpoint conclusion

All eleven selected source problems are determinate from the allowed prose, concept block 6 and the two actual images. No source-solving blocker was found. Recognition/selection can preserve these mathematical distinctions but cannot establish unaided production of classifications, a place-value table, computations or derivations; assess the actual choices and account for those losses after this checkpoint.

This is not a PASS decision for visible choices or an internal draft. Visible review is still pending at the saved source checkpoint.

## First visible-input checkpoint

The source-only file existed with SHA-256 `9f36b8c8c60136c3e77418010afce8216425d8b73c37059bd9be1c6628f97d11` before the first `jq` read of `.tmp/stemrobin-187/n56/choices/views.json`. The following sections are appended after that barrier; the baseline above was not rewritten from choices.

- Views raw SHA-256: `6c1f55ea60f59a1e57bd103ac5e9a15c073134ee68cf109164cfb7da58848c2c`.
- Views canonical JSON SHA-256: `cdc57e29797f7095c2ea7eccad8867e50d8c61930346f2159cb412e1e1171a1f`.
- Actual projection: root `questions`; eleven wrappers contain only `id` and `view`; each view contains only `mode`, `stem`, `figure_ids`, and `options`; 46 alternatives total. No author solution, intent, coverage, rationale, misconception, or key was exposed.
- Referenced images are exactly fig-216 and fig-217, already actually viewed once each. No further image read was needed or made.

## Visible gates before option mathematics

These are blind visible-content findings, not agreement with any internal author record. "Supported" below means the observed view supports that particular gate; it is not an overall approval.

| Question | Task fidelity | Redundancy | Answer leakage |
| --- | --- | --- | --- |
| q-935 | Supported: all A/E/M/P values remain; selecting all correct classifications covers both acute and obtuse groups under block 6. Native `multiple`, not yes/no splitting or pair-combination codes. | P-acute/P-obtuse and M-obtuse/M-right are competing classifications, not two equivalent true answers. No second item repeats the same classification task. | No correct-count hint, key, rationale, source-number text, or explanation of a wrong procedure appears. Complementary classifications require the angle definition. |
| q-936 | Supported: 37 and 19, vertex O, requested AOC and actual fig-216 preserve adjacent-angle addition. | Different whole/component operations, not duplicate synonymous answers. | The drawing shows the internal OB and two arcs but no numerical result. The stem does not announce addition or a correct option. |
| q-937 | Supported: all four fractions and right/straight baselines remain in the original order as one complete result vector. | No equivalent vectors; common entries allow normal elimination but not copying the full result from the stem. | No printed result or marked correct row. Its 30/60-degree relations overlap the inverse tasks below, as they do in the source; no keyed feedback or option reference is present. |
| q-938 | Supported: both 30 and 15 must be judged as fractions of 90, in order, not fractions of 180 or reciprocal ratios. | Both entries distinguish the surviving complete candidates; not two isolated arithmetic clicks. | Shares the concept and the 30-degree inverse fact with q-937, but another unsolved choice list supplies no certified result or unique keyed cue for this pair. Record correlated evidence, not independent mastery. |
| q-939 | Supported: all four angles, including 120, and the 180-degree baseline remain in order. | Complete vectors are distinct. Last-entry-only elimination is possible and is a recorded recognition limitation, not automatic failure of complete-vector recognition. | The 60-degree inverse relation overlaps q-937 conceptually; no hidden key, answer annotation, or instruction to use another answer is visible. |
| q-940 | Supported: complete two-number table retains six plus seven printed digit places, including every zero. The extra hundreds cell for 37.0654 is explicitly not applicable, not a fourteenth source digit. | All four tables differ mathematically; matching a few cells can eliminate rows, which limits diagnostic evidence but does not remove the full displayed task. | Headers, number order and not-applicable treatment are identical across options; no uniquely explanatory correct option or answer-bearing label. |
| q-941 | Supported: both original comparisons remain with the same direction and order. | The full 2 x 2 set of sign pairs means either comparison alone leaves two possibilities; both distinctions matter. | No answer text, padding hint such as 7.400, or correct-pair clue is supplied in the stem. |
| q-942 | Supported: both entire equations remain. Their two minus-before-parentheses sign patterns form a meaningful paired comparison, not a split dictated by printed labels. | The full 2 x 2 set of root pairs means either root alone leaves two possibilities. Both equations are still tested. | No expanded equation, intermediate coefficient, solution or misconception label is supplied. |
| q-943 | Supported: CMK = 42, AMK = 132 and requested AMC preserve the actual MC-inside-AMK subtraction relationship. | Whole angle, component, sum and remaining angle are distinct values. | Fig-217 has no 90-degree text or right-angle square. Its approximate perpendicular appearance permits a visual guess, but exact proof still uses both given angles. Source geometry, not an added answer annotation, supplies the appearance. |
| q-944 | Supported: 1h40m, one fifth of total, one quarter of the remainder, and combined time all remain. | Total, partial-task and remainder interpretations are distinct, not synonymous results. | "余下时间" is the essential source condition, not a hint explaining which option is wrong. No intermediate 100/80/20-minute answer is exposed. |
| q-945 | Supported: both complete numerators, both divisors, their parentheses and subtraction remain. | Four signed results are distinct; no rewritten duplicate or option-combination answer. | Stem contains no computed quotient, equality annotation or simplification to zero. |

### Whole-package leakage and response-unit observations

- No learner-facing stem/option contains the original exercise numbers 935-945 or instructions to look up those exercises. The wrappers are named `q-935` through `q-945`, so they numerically encode the source mapping. Under the supplied contract only `view` is learner-facing: **keep these wrapper IDs internal and never display them as learner labels**. This phase did not read APP code and does not certify that boundary in an application payload.
- Figure IDs identify shared source images; neither visible figure contains a numerical answer. The same letters M and A in separate tasks do not establish cross-task angle equality.
- q-937/938/939 deliberately exercise overlapping forward/inverse facts already present in the seed. Treat success as correlated evidence rather than three independent measurements of those shared facts. No visible answer from another question can simply be copied as a keyed complete answer. This observation does not authorize exposing previous correctness feedback or answers.
- Single-mode complete tables/vectors are legitimate units, not native multi-select collections disguised as combination codes. q-935 alone asks for all true member classifications and correctly uses native `multiple`.
- No mathematical source task has disappeared at the visible level. Selection still loses unaided production and, in some aggregate candidates, cannot show that every entry was independently computed. These specific losses are listed after option mathematics and must later be compared to the undisclosed internal limitations/coverage.

## Independent visible mathematics: complete true sets

The visible questions were solved against their own complete conditions after the preceding fidelity/redundancy/leakage gate. The following sets are the reviewer's determinations, not imported keys. Every alternative is checked, including correct partial entries inside a false aggregate.

### q-935

Independent solution: acute means below 90; obtuse means strictly between 90 and 180. Classify 87, 175, 92 and 3 directly. **Complete true set: {a, b, c, e}**; mode `multiple` is appropriate.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: A acute | true | 87 < 90. |
| b: E obtuse | true | 90 < 175 < 180. |
| c: M obtuse | true | 90 < 92 < 180. |
| d: P obtuse | false | P = 3 < 90, so it does not satisfy 90 < P < 180. |
| e: P acute | true | 3 < 90. |
| f: M right | false | M = 92, not the defining 90 degrees. |

### q-936

Independent solution: the actually observed OB partitions AOC into AOB and BOC, so AOC = 37 + 19 = 56 degrees. **Complete true set: {c}**.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: 18 degrees | false | 37 - 19 = 18 subtracts adjacent components instead of adding them; the overall AOC exceeds 37. |
| b: 124 degrees | false | 180 - (37 + 19) = 124 is a supplementary value; the figure/prose does not make the requested AOC that supplement. |
| c: 56 degrees | true | 37 + 19 = 56 by the shared vertex O and internal ray OB. |
| d: 37 degrees | false | This is AOB alone and omits the positive 19-degree BOC. |

### q-937

Independent solution in the explicitly requested order: (90/2, 90/3, 180/2, 180/3) = (45, 30, 90, 60) degrees. **Complete true set: {b}**.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: (90, 60, 45, 30) | false | Entries 1/2 incorrectly use 180; entries 3/4 incorrectly use 90. All four disagree with their specified baselines. |
| b: (45, 30, 90, 60) | true | Each entry equals the specified fraction times 90 or 180, in order. |
| c: (180, 270, 360, 540) | false | These equal baseline divided by the fraction, not multiplied by it. Each exceeds its baseline although every requested fraction is below 1. |
| d: (45, 30, 45, 30) | false | First two entries are correct; last two wrongly use 90 rather than 180, so they should be 90 and 60. |

### q-938

Independent solution: (30/90, 15/90) = (1/3, 1/6). **Complete true set: {d}**.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: (1/6, 1/12) | false | Both equal angle/180, not angle/90: 30/90 = 1/3 and 15/90 = 1/6. |
| b: (3, 6) | false | Both are reciprocal ratios 90/30 and 90/15; the two angles are smaller than a right angle, so their requested fractions are below 1. |
| c: (1/3, 1/3) | false | First entry is correct; second asserts 15 = 90/3 = 30, which is false. |
| d: (1/3, 1/6) | true | 90/3 = 30 and 90/6 = 15 in the given order. |

### q-939

Independent solution: divide each of (30, 45, 60, 120) by 180, yielding (1/6, 1/4, 1/3, 2/3). **Complete true set: {a}**.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: (1/6, 1/4, 1/3, 2/3) | true | Multiplication by 180 reproduces all four angles in order: 30, 45, 60, 120. |
| b: (1/3, 1/2, 2/3, 4/3) | false | All entries use angle/90; each is twice the requested straight-angle fraction. |
| c: (6, 4, 3, 3/2) | false | All entries use 180/angle, reversing the ratio. In particular 120/180 = 2/3, not 3/2. |
| d: (1/6, 1/4, 1/3, 1/3) | false | First three are correct; the last denotes 60 degrees, whereas the fourth angle is 120 degrees and requires 2/3. |

### q-940

Independent solution: align each printed digit with its column. The six actual places of 37.0654 give (3, 7, 0, 6, 5, 4); the seven of 450.1207 give (4, 5, 0, 1, 2, 0, 7). The unprinted hundreds cell of the first number is consistently "not applicable" in every candidate and excluded from the thirteen checks. **Complete true set: {c}**.

Below, T/F compares **every one of the 13 actual mathematical cells** against its own place, not just the cells sufficient to eliminate an option.

| Option | 37.0654: tens, ones, tenths, hundredths, thousandths, ten-thousandths | 450.1207: hundreds, tens, ones, tenths, hundredths, thousandths, ten-thousandths | Aggregate truth |
| --- | --- | --- | --- |
| a | T, T, F, F, F, F | T, T, T, T, T, F, F | false |
| b | T, T, F, F, F, F | T, T, T, F, F, F, F | false |
| c | T, T, T, T, T, T | T, T, T, T, T, T, T | true |
| d | F, F, T, T, T, T | F, T, F, T, T, T, T | false |

- a: first number's decimal vector is (6, 5, 4, 0), but the printed digits require (0, 6, 5, 4). Second number's last two values are (7, 0), but they must be (0, 7). The zeros cannot be shifted or deleted.
- b: first number's decimal vector is (4, 5, 6, 0), not (0, 6, 5, 4); second number's is (7, 0, 2, 1), not (1, 2, 0, 7). Decimal places are read left-to-right from the decimal point, not reversed.
- c: both complete vectors match all thirteen digits, including 37.0654's zero tenths and 450.1207's zero ones and zero thousandths.
- d: first number records seven tens and three ones, producing integer part 73 rather than 37; second records zero hundreds and four ones, producing integer part 54 rather than 450. Its decimal entries are all correct, but the four incorrect integer-place cells make the table false.

### q-941

Independent solution: 12 < 125 decides the first comparison; 7.399 < 7.400 decides the second. **Complete true set: {b}**.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: (>, <) | false | First claim contradicts 12.567 < 125.67; second claim is true. |
| b: (<, <) | true | Both comparisons follow the integer-part and thousandths comparisons respectively. |
| c: (<, >) | false | First claim is true; second contradicts 7.4 - 7.399 = 0.001 > 0. |
| d: (>, >) | false | Both claims reverse the true inequalities. |

### q-942

Independent solution: 14k - 8k - 3k = 3k gives k = 504; 11n - 5n + 3n = 9n gives n = 904. **Complete true set: {d}**.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: (k=168, n=904) | false | At k=168 the first LHS is 3 x 168 = 504, not 1512. n=904 does satisfy 9 x 904 = 8136. |
| b: (k=504, n=2712) | false | k=504 satisfies 3 x 504 = 1512. At n=2712 the second LHS is 9 x 2712 = 24408, not 8136. |
| c: (k=168, n=2712) | false | Both substitution failures above occur. |
| d: (k=504, n=904) | true | Both substitutions satisfy their original equations. The outside minus negates each inner term, so the first inner plus becomes minus and the second inner minus becomes plus. |

### q-943

Independent solution: the actual MC divides AMK, giving AMC = AMK - CMK = 132 - 42 = 90 degrees. **Complete true set: {a}**.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: 90 degrees | true | 90 + 42 = 132, matching the observed whole/component partition. |
| b: 174 degrees | false | 132 + 42 = 174 double-counts the contained CMK; the requested component AMC must be less than the 132-degree whole. |
| c: 42 degrees | false | This is the other component CMK; it would make the whole only 42 + 42 = 84, not 132. |
| d: 132 degrees | false | This is the entire AMK; adding CMK would give 174, not the given whole. |

### q-944

Independent solution: total 100 minutes, application problems 20, remainder 80, equations 20; combined 40 minutes. **Complete true set: {c}**.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: 45 minutes | false | 100/5 + 100/4 = 45 uses the total as the second baseline; the stem specifies 80 remaining minutes, whose quarter is 20. |
| b: 25 minutes | false | The required sum is 20 + 20, not 25. In particular neither the single quarter of total time (25) nor 20 + 20/4 (25) follows the specified quarter-of-remainder condition. |
| c: 40 minutes | true | 100/5 + (100 - 100/5)/4 = 20 + 20 = 40. |
| d: 60 minutes | false | 100 - 40 = 60 is time left after both tasks, not their combined duration. |

### q-945

Independent solution: (59942 - 14989 - 4000)/51 = 40953/51 = 803; (49387 + 24489)/92 = 73876/92 = 803; subtract to obtain 0. **Complete true set: {b}**.

| Option | Truth | Mathematical evidence |
| --- | --- | --- |
| a: 1606 | false | 803 + 803 = 1606 adds the quotients; the expression subtracts them. |
| b: 0 | true | Both exact quotients are 803, so 803 - 803 = 0. |
| c: 803 | false | This is either single quotient, not their difference. |
| d: -1606 | false | -(803 + 803) = -1606 negates their sum; it is not 803 - 803. |

## Complete coverage and actual recognition losses

This is a blind source-to-visible comparison derived here, not the undisclosed draft's coverage declaration. All original mathematical requests are represented; **no substantive source task omission was detected in views**. The listed production/diagnostic losses remain real even though they do not by themselves defeat the chosen recognition tasks.

| Source | Visible question | All source tasks covered | Actual selection/recognition loss |
| --- | --- | --- | --- |
| 935 | q-935 | Classify all four A/E/M/P into acute/obtuse; definition boundary 90 and exclusion of right-angle M retained. | Selection does not demonstrate unaided production of both complete named groups or written justifications. Paired P statements are mutually exclusive; their exclusion narrows choices but still requires classification. |
| 936 | q-936 | Determine AOC from both adjacent components, common vertex O and internal OB. | Final-angle recognition does not prove the learner can independently draw/describe the partition or write the addition equation. |
| 937 | q-937 | All a-d degree values in order, using both 90 and 180. | First entry eliminates a/c; third distinguishes b/d, so selecting the complete vector can succeed after checking only entries 1 and 3. It does not prove separate computation of entries 2 and 4. |
| 938 | q-938 | Both a-b fractions of a right angle, in order; ratio direction preserved. | Correct complete-pair recognition is not unaided ratio production/reduction. Both entries are needed to resolve the remaining candidates, but the 30-degree fact overlaps q-937. |
| 939 | q-939 | All a-d straight-angle fractions, including 120/180, in order. | The unique last entry 2/3 suffices to identify a after evaluating only 120/180; success does not establish independent solutions of the first three fractions. A complete-vector task remains displayed, not omitted. |
| 940 | q-940 | Both full digit-place records; all 13 printed entries and all three zero digits checked in this review. | Checking 37.0654's tenths eliminates a/b; checking its tens distinguishes c/d. Thus two checked cells can identify the correct whole table without establishing all thirteen place interpretations. Selection does not prove unaided table construction. This is permitted complete-table recognition with bounded diagnostic evidence, not automatic failure. |
| 941 | q-941 | Both original comparisons with their distinct integer/decimal mechanisms. | Pair selection does not establish a written comparison procedure or explicit zero padding; either comparison alone leaves two options, so neither task is silently dropped. |
| 942 | q-942 | Both original equations and both minus-before-parentheses sign rules; roots in order. | Selecting or substituting candidate roots does not prove independent removal of parentheses and full equation-solving derivations. The 2 x 2 choices force both roots to be settled; neither equation is omitted. |
| 943 | q-943 | Find AMC by subtracting CMK from AMK with shared vertex M and internal MC. | Source geometry looks approximately perpendicular; visual recognition/guessing can select 90 without showing the exact subtraction. No numerical answer or square was added. Exact computation/justification is not demonstrated by selection alone. |
| 944 | q-944 | Convert 1h40m, apply 1/5 to total, apply 1/4 to remaining time, combine both durations. | Recognizing 40 does not establish independent organization or written intermediate baselines 100/80/20/20, although every condition needed for that reasoning remains visible. |
| 945 | q-945 | Both numerator calculations, both quotients, and their final subtraction. | A final-value choice cannot demonstrate each intermediate integer operation; estimation/elimination may avoid exact long division. The complete expression is retained, and this review verified both quotients exactly. |

## Global audit and staged outcome

- Concept block 6 consistently gives 90/180, strict acute/obtuse bounds, q-935 classifications, and the right-angle interpretation of q-943. No alternate convention was imported.
- Both actual figures have fully visible endpoints/labels, the required common vertex and internal side, and the correct component/whole arc relationships. fig-216 supports addition; fig-217 supports subtraction. Neither contains a numerical answer label. fig-215 was neither opened nor used.
- q-940 contains all **13** digit-unit entries, including zero tenths in 37.0654 and zero ones/thousandths in 450.1207. Its extra not-applicable cell is not confused with a printed zero digit.
- All ordered subparts are intact: 937 (45,30,90,60); 938 (1/3,1/6); 939 (1/6,1/4,1/3,2/3); 940 the two full vectors; 941 (<,<); 942 (504,904).
- q-935 uses native `multiple` with exact true set {a,b,c,e}; the remaining ten views have one true alternative each. No equivalent true alternatives invalidate a `single`.
- Both parenthesis patterns in q-942, the changed remaining-time baseline in q-944, and both exact quotients plus subtraction in q-945 have been independently checked, not inferred from a single selected number.
- Full true sets: q-935 {a,b,c,e}; q-936 {c}; q-937 {b}; q-938 {d}; q-939 {a}; q-940 {c}; q-941 {b}; q-942 {d}; q-943 {a}; q-944 {c}; q-945 {b}. All **46 alternatives** have explicit mathematical evidence above.

**Phase decision: HOLD, not internal-draft approval.** There is no definite visible mathematical/fidelity/redundancy/leakage defect requiring REVISE in the inspected `view` subtrees. HOLD is the intentional disclosure boundary requested for this phase: the internal draft has not been read, so author-set agreement, per-option derivations and actual misconception generation, declared limitations/coverage/unit reasons, full contract and draft snapshot binding are **unreviewed**, not implicitly accepted.

Concrete conditions for the next disclosed-draft comparison: bind the exact draft to this seed and views; compare all eleven independent solutions and all 46 option truths; check its stated wrong procedures really generate its false alternatives; verify every listed recognition loss is honestly represented in limitations/coverage and the paired/table units have substantive reasons. Do not normalize this blind evidence to an author's key. If wrapper IDs are intended as learner-visible labels, that is a concrete **REVISE** for source-number leakage; keeping them internal is required by the supplied view boundary. No APP/payload boundary was certified here.

This Markdown is the requested staged blind evidence, not a completed `s10y-choice-review-v1` or a validator result. No producer/checker was rerun, no other file was written, and no approval/publication/DB claim is made. Final actual image usage remains **2/24, one batch of two, each once**.
