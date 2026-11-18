# n32 Independent Source Baseline

## Scope and Independence

- Worktree: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
- Phase: SOURCE-FIRST, first ordered phase of one semantic gate.
- Mathematical input: only `n32-choice/seed.json` in this resume directory, its selected definitions, and the two explicitly authorized figure images.
- No draft view, author internals, current answer keys, author solutions, previous questions, or other chats were read before establishing these solutions.
- This is an independent reasoning checkpoint, NOT an author source approval, NOT a choice PASS, and NOT another whole-figure certification.
- Seed byte SHA-256: `74b07f0760726ab6b1152dd97494ca88a38a0ab2ae12c72ecc71d55793d140b2`.
- Seed canonical SHA-256 under the choice contract: `3f518afd4927d9e90de2e494f0285dc8bbf8befa0e934c0d33d044200eff27ac`.
- Reuse these established complete written-task solutions for the later frozen-view/key comparison; do not solve the sources again.

## Mathematical Conventions

1. Every square root denotes the principal nonnegative real square root. The leading minus in `-\sqrt{r}` negates that root; it is not another choice of root.
2. Selected concept block 13 permits comparison by squaring positive numbers. Squaring is order-preserving on nonnegative numbers, not on arbitrary signed numbers. All positive-root comparisons below use this domain restriction.
3. "Between" here means strict lower and upper bounds. Consecutive integers differ by 1; consecutive one-decimal numbers differ by 0.1. Negating an inequality reverses its order.
4. Selected concept block 1 identifies real numbers with number-line points. A "better approximation" among two stated candidates means the smaller absolute error, equivalently the shorter number-line distance, not merely the smaller candidate or the smaller squared-radicand difference.
5. With candidates `a < b` and root `x` between them, compare `x` with `(a+b)/2`: below the midpoint means `a` is closer, above means `b`, equality means a tie.
6. In 739, "accurate to 0.5" is an absolute-error tolerance, ordinarily `|q-x| <= 0.5`. The supplied seed does not prescribe rounding to an integer, a half-unit grid, or a unique output. All concrete approximations supplied below have error strictly less than 0.5, so a strict-error reading would not change their validity. It would only change admissible boundary points.
7. Finite decimal givens are exact values. Displayed root decimals below are cross-checks, not substitutes for exact inequality/proof reasoning.

## 737: Compare All Six Pairs

| Part | Independent result | Exact justification |
| --- | --- | --- |
| a | `\sqrt{7} < 3` | `7 < 9 = 3^2`, with both compared numbers positive. |
| b | `7 < \sqrt{50}` | `7^2 = 49 < 50`. |
| c | `\sqrt{5} > 2.2` | `5 > 4.84 = 2.2^2`. |
| d | `3.3 < \sqrt{11}` | `3.3^2 = 10.89 < 11`. |
| e | `\sqrt{6.25} = 2.5` | `2.5 >= 0` and `2.5^2 = 6.25`. Equality must be retained. |
| f | `\sqrt{4.21} < 2.1` | `4.21 < 4.41 = 2.1^2`; this is not `\sqrt{4.41}`. |

All six comparison relations are uniquely determined.

## 738: Prove Both Bounds

- a: `3^2 = 9 < 12 < 16 = 4^2`. Since `3`, `\sqrt{12}`, and `4` are positive, comparison by squares gives `3 < \sqrt{12} < 4`.
- b: `7.1^2 = 50.41 < 51 < 51.84 = 7.2^2`. Applying the same positive-number property gives `7.1 < \sqrt{51} < 7.2`.

The written task demands a proof: the square inequalities and their order-preserving domain are part of the complete solution, not just confirmation that the displayed bounds are true.

## 739: Consecutive Integers and Accuracy 0.5

| Part | Square bounds | Unique consecutive-integer bracket | One valid midpoint approximation | Also-valid nearest integer |
| --- | --- | --- | --- | --- |
| a | `25 < 27 < 36` | `5 < \sqrt{27} < 6` | `5.5` | `5` |
| b | `9 < 9.2 < 16` | `3 < \sqrt{9.2} < 4` | `3.5` | `3` |
| c | `0 < 0.4 < 1` | `0 < \sqrt{0.4} < 1` | `0.5` | `1` |
| d | `25 < 35.4 < 36` | `5 < \sqrt{35.4} < 6` | `5.5` | `6` |
| e | `100 < 120 < 121` | `10 < \sqrt{120} < 11` | `10.5` | `11` |
| f | `144 < 148 < 169` | `12 < \sqrt{148} < 13` | `12.5` | `12` |

Each midpoint is certified directly: if `n < x < n+1`, then `-0.5 < x-(n+0.5) < 0.5`, hence `|x-(n+0.5)| < 0.5`.

For the alternate nearest-integer witnesses, compare with the interval midpoint:

- a: `27 < 5.5^2 = 30.25`, so the root is closer to 5.
- b: `9.2 < 3.5^2 = 12.25`, so it is closer to 3.
- c: `0.4 > 0.5^2 = 0.25`, so it is closer to 1.
- d: `35.4 > 5.5^2 = 30.25`, so it is closer to 6.
- e: `120 > 10.5^2 = 110.25`, so it is closer to 11.
- f: `148 < 12.5^2 = 156.25`, so it is closer to 12.

Numerical cross-checks, in part order:

| Part | Root approximately | Error of the stated nearest integer approximately |
| --- | --- | --- |
| a | `5.1961524227` | `0.1961524227` |
| b | `3.0331501776` | `0.0331501776` |
| c | `0.6324555320` | `0.3675444680` |
| d | `5.9497899123` | `0.0502100877` |
| e | `10.9544511501` | `0.0455488499` |
| f | `12.1655250606` | `0.1655250606` |

Nonuniqueness is genuine: for each root `x`, every real `q` in `[x-0.5,x+0.5]` meets the weak tolerance. The integer bracket is unique, but the approximation need not be. Neither the midpoint list nor the nearest-integer list is the sole answer prescribed by the seed. "Accurate to 0.5" is not the same as "round to the nearest multiple of 0.5."

## 740: Consecutive One-Decimal Bounds, Including Negatives

| Part | Complete result | Derivation |
| --- | --- | --- |
| a | `1.7 < \sqrt{3} < 1.8` | `1.7^2 = 2.89 < 3 < 3.24 = 1.8^2`. |
| b | `-1.8 < -\sqrt{3} < -1.7` | Negate both bounds in a and reverse the inequalities/order. |
| c | `4.2 < \sqrt{18} < 4.3` | `4.2^2 = 17.64 < 18 < 18.49 = 4.3^2`. |
| d | `-4.3 < -\sqrt{18} < -4.2` | Negate both bounds in c and reverse the inequalities/order. |

These brackets are unique. The task does not ask for a rounded root or for the closer endpoint.

## 741: Figure 45 and Better Approximation to Square Root of 5

- a: **2**, not 3. The figure places `\sqrt{5}` between 2 and 3, visibly nearer 2. Precisely, `5 < 2.5^2 = 6.25`, so `\sqrt{5} < 2.5`; therefore `\sqrt{5}-2 < 3-\sqrt{5}`.
- b: **2.2**, not 2.3. The figure places the root between 2.2 and 2.3, visibly nearer 2.2. Precisely, `5 < 2.25^2 = 5.0625`, so `\sqrt{5} < 2.25`; therefore `\sqrt{5}-2.2 < 2.3-\sqrt{5}`.
- Decimal cross-check: `\sqrt{5} = 2.2360679...`; candidate errors are approximately `0.2360679` versus `0.7639321`, and `0.0360679` versus `0.0639321`.
- Both requested selections are unique; no midpoint tie occurs. The number-line distance explanation is essential to "better," not an optional replacement by a smaller-value rule.
- The third figure row further displays `2.23 < \sqrt{5} < 2.24`, consistent with `2.23^2 = 4.9729 < 5 < 5.0176 = 2.24^2`. It supports the visual interpretation but is not an extra written subtask in 741.

## 742: Bound Square Root of 2 and Choose the Closer Endpoint

`1.4^2 = 1.96 < 2 < 2.25 = 1.5^2`, hence `1.4 < \sqrt{2} < 1.5`; these are the unique consecutive one-decimal bounds.

Their midpoint is 1.45. Since `2 < 1.45^2 = 2.1025`, `\sqrt{2} < 1.45`, so `\sqrt{2}-1.4 < 1.5-\sqrt{2}`. Thus **1.4** is the better approximation. Cross-check: `\sqrt{2} = 1.41421356...`, with errors about `0.01421356` and `0.08578644`. No tie occurs.

## 743: Compare Both Radical Sums

- a: **`\sqrt{10}+\sqrt{19}` is greater than `\sqrt{29}`**. Both expressions are positive, and `(\sqrt{10}+\sqrt{19})^2 = 10+19+2\sqrt{190} = 29+2\sqrt{190} > 29 = (\sqrt{29})^2`.
- b: **`\sqrt{20}+\sqrt{7}` is greater than `\sqrt{27}`**. Both expressions are positive, and `(\sqrt{20}+\sqrt{7})^2 = 20+7+2\sqrt{140} = 27+2\sqrt{140} > 27 = (\sqrt{27})^2`.

The strict positive cross term is the reason; square root does not distribute over addition. Both outcomes are unique.

## 744: Determine Both Linear Coefficients

Substitute both points into `y=kx+l`:

`12k+l=2` and `-6k+l=-4`.

Subtract the second equation from the first: `18k=6`, so `k=1/3`. Then `l=2-12(1/3)=-2`.

Thus **`k=1/3`, `l=-2`, and `y=x/3-2`**. Direct checks give `y(12)=4-2=2` and `y(-6)=-2-2=-4`. The two distinct x-coordinates make the coefficients unique.

## Actual Image Observations and Hash Binding

Exactly **2 images total** were opened, each individually with `detail: original`, once. There were zero reopens, crops, other figure batches, or additional image loads.

1. Original image:
   `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/figures/fig-45.png`
   SHA-256: `b840613b41a3f84fa29c1105cfe2a9b0120856a71734b164ec5bc6852813cbaa`.
   Observed three complete horizontal right-pointing number lines. Top row has endpoints 2 and 3 and a square-root-of-5 marker noticeably nearer 2. Middle row has tenth divisions labeled 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, with the root between 2.2 and 2.3 and nearer 2.2. Bottom row has dense hundredth divisions, endpoint labels 2 and 3, reference labels 2.2 and 2.3, and leader annotations for 2.23 and 2.24 bracketing the root. All three arrowheads, the rightmost 3 labels, and bottommost decimal annotations were visible. The source row letters are localized in the modern image.
2. Complete modern preview:
   `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n32-figures/fig-45/complete-preview.png`
   SHA-256: `2f9ed189ecc49cfcab26d157611d7dcb8039c3ecdfacd5948c9c12289af85611`.
   Observed complete rows a), b), c), each from 2 through 3 with a right arrow and the root marked at the same relative position. Row b has every tenth label through 3; row c retains the dense hundredth subdivision and distinct 2.23/2.24 leaders below the line. Relevant labels, root markers, rightmost endpoints, arrowheads, and bottom annotations are visible and legible. The root is left of the 2-to-3 midpoint and of the 2.2-to-2.3 midpoint, providing the distance reasoning used in 741.

Existing render-evidence binding, checked without rerendering or repeating whole-figure certification:

- Durable SVG:
  `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/figures/fig-45.svg`
  SHA-256: `ff1c0fd831ef867db2a38eed4d04fbe8f06dddf15d4d8a1484f2c5be4888db37`, matching the seed.
- Scratch SVG at `n32-figures/fig-45/fig-45.svg` has that same actual SHA-256.
- Existing `n32-figures/fig-45/fig-45.render.json` has actual SHA-256 `a2b29a08396d1b2ca16294d86bce872a0b8ffcb5b32ad677f5c6bfae2d13de64`, schema `ld-s10y-image/render@2`, recorded status `pass`, and binds its SVG output to the same SVG hash.
- Existing `n32-figures/fig-45/offline-preview.result.json` has actual SHA-256 `1734b362fe9be00aab4a44f2f2396cc42429ea180a25aeab9ea719ffe2e8de34`, schema `n32-offline-preview-result@1`, recorded status `pass`, and binds the scratch SVG, render report, and complete-preview PNG to their current hashes.
- All three checked existing-evidence file hashes match current bytes. The preview PNG and durable SVG are different formats and do not have equal hashes; the existing render/evidence chain establishes their relationship.
- Those are existing recorded execution results, not a new mathematical/visual certification or an author source approval by this reviewer.

## Ambiguity and Continuation Boundary

The sole genuine underdetermination found in the written tasks is the unrestricted approximation output in 739. Its tolerance permits multiple answers; a later question or standard answer must not silently present a single allowable witness as the only mathematically valid approximation. The other requested bounds, comparisons, closer-endpoint decisions, and coefficients are determined.

Source proof production in 738 and written explanations in the other tasks must remain visible as learning-task coverage; a later recognition question may lose independent proof production, but that loss must be judged and recorded rather than inferred away.

This file freezes the SOURCE-FIRST reasoning. Candidate fidelity, redundancy, leakage, option truth, current standard-answer binding, and any semantic verdict remain for the later ordered phase. No author source report or key has yet been compared.
