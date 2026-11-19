# FIRST Independent Modern-Text Review

Ticket: STEMROBIN-182. Review date: 2026-11-19. Status: FIRST, frozen before any repair.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
HEAD: `e16207d939526da0ebb2cfc528f084f0c3791afb`.
All paths below are relative to this checkout unless explicitly absolute.

## Scope and Evidence

- Reviewed only frozen authored lesson/exercise templates for n41, n42, n43.
- Input hashes are in `input-hashes.sha256`; all six template hashes and six assembled-source hashes were checked again unchanged before writing this report.
- Full embedded `source.data`, `source.sha256`, `source.path`, per-object `source_text`, identities, counts, groups, formula order, figure-reference metadata and source references match the assembled originals.
- `_authoritative_source_targets` reconstructed the page-stream ownership for each of the three lessons; its map exactly matches `_source_target_map`. This was a read-only binding check, not a second source-faithfulness review.
- Source faithfulness remains the caller's already-PASS stage. Pages 0246-0258 were hashed and used mechanically for source binding. Only p0255#8 and p0256 prose were examined for the requested printed-word adjudication.
- Exactly ONE image was viewed: `.tmp/ld-s10y-lesson/7a/pages/0256/page.grid.png`, once, without crops or reopens. The page prints "和的两倍".
- Figure 56, 57 and 58 files, FigureSpecs, figure reviews and figure templates were NOT opened. No figure semantic or visual approval is given.
- No answer files, answer keys or choices were read. Exercise-source text was used for prompt preservation and binding, never as an answer key. No exercise answers were produced or reviewed.
- No templates/pages/code were edited; no finalize, rendering, app, network, DB or Git-write commands were run. Python imports used `-B`; normalization experiments changed in-memory copies only.

## Lesson Verdicts

These verdicts cover authored modern text, not whole-lesson publication or figures.

| Lesson | Text verdict | Objects and exercises | Exact affected scope |
| --- | --- | --- | --- |
| alg7-c4-s2-n41 | PASS | 20 prose; 17 exercises, 834-850 | None |
| alg7-c4-s3-n42 | PASS | 16 objects: 14 prose, fig-58 placeholder, caption; 4 exercises, 851-854 | None in frozen authored text |
| alg7-c4-s3-n43 | FAIL: M1 | 37 prose; 3 exercises, 855-857 | `lesson.prose[15]`, source `p0256#5`, final paragraph 15 |

### n41: Unaffected PASS

All 20 instructional blocks preserve their original content and formulas. The four worked demonstrations independently retain valid radical simplification, cancellation/rationalization, table-based approximation and the nonnegative-square comparison. No denominator or inequality hypothesis was dropped. Decimal quantities and all 17 exercise prompts are unchanged.

Exercise groups remain g0 for 834-845 and g1 / 复习题 for 846-850. Latin subparts are complete, naturally ordered and separately lined; exercise prefixes remain separate. Figures remain exercise-only: 848 references/displays fig-56 and 849 references/displays fig-57. This is metadata preservation, not figure approval.

The added commas after "于是" and "由此", Chinese punctuation, whitespace and displayed-formula separation are harmless declared layout changes. There are no contextual names, currencies or cultural claims requiring a rewrite or historical exemption.

### n42: Unaffected PASS

All 16 source objects remain in order. The quadratic definition retains `a != 0`, the coefficient descriptions retain signs, and monic reduction preserves division by the nonzero leading coefficient. The graph-method proposition and its instructional numerical example are mathematically consistent as text; no plotted points, axes, labels or figure semantics were inspected.

Exercise groups remain g0 for 851-853 and g1 / 复习题 for 854. All formulas and the `x=8.4`, `y=-0.6` substitution data remain unchanged. Exercise 851 preserves six separate subparts and the whole-list follow-up question on its own line. The fig-58 placeholder remains between p0253#13/p0254#1 and p0254#3, with its source-bound caption retained.

No cultural substitution is necessary. All authored modern text is free of profile-forbidden cultural terms, fictional Russian names and Cyrillic enumeration.

### n43: Affected FAIL, Otherwise PASS

M1 is the only authored-content failure: the printed false word "和" is carried into modern `lesson.prose[15]`; both authoritative-page and modern `errata` arrays are empty. The rest of that block, its identity and its formulas are preserved correctly.

The other 36 prose blocks PASS preservation, mathematical instructional content, cultural neutrality, source binding and boundaries. Introductory completing-the-square identities, equivalent equations and the remaining worked examples are consistent in the real-number setting. All three exercises PASS prompt preservation only; no answer adjudication was performed. Groups remain g0 for 855-856 and g1 / 复习题 for 857.

## M1: Exact Mathematical Adjudication

Source: physical p0256, printed page 250, block `p0256#5`.
Assembled owner: `alg7-c4-s3-n43`, `lesson.prose[15]`.
Frozen page JSON SHA-256: `0f90ab96a395f8e94cb7d4523ace8d5fc98d2316244559943a24688921e69a93`.
Inspected grid SHA-256: `b3c25ef1a9151627b0a969ed2e0a02aebb85dff2ddd0c359ba1bea32c8b7f143`.

The sentence claims that `5x` is twice the SUM of the first and second terms, while giving the identity `5x = 2*x*(5/2)`. With the named quantities `x` and `5/2`, the sum claim would be `5x = 2*(x+5/2)`, which is not an identity: at `x=0` it asserts `0=5`. Twice the PRODUCT is identically `2*x*(5/2)=5x`.

This is confirmed by p0255#8's correct parallel statement "积的两倍" and `6x=2*x*3`; p0256#6 then correctly uses subtraction and `(x-5/2)^2`. Thus `5/2` is the magnitude in the difference, and no sign, coefficient or displayed formula needs changing. The p0257#9 explanation also uses twice the product.

Prescribe exactly `和` -> `积`, inside the math-anchored substring recorded in `prescribed-erratum.json`. The substring occurs exactly once in the faithful page block, assembled raw target and frozen modern target. It includes mathematical expressions, so it meets the existing erratum validator's formula/number requirement; a bare Chinese-word-only record would not.

Keep faithful page/block text and assembled original text unchanged. A later authorized repair should register the source-page erratum metadata, refresh its actual page-JSON hash and generated bindings, carry the registered record into modern text, and mark only this target with `math-correction` in addition to `layout`. This report's page hash identifies the pre-registration evidence, not a future page after metadata registration. No human approval gate is invented; this is a confirmed mathematical erratum requiring the normal source-bound repair.

## Prose Flow and Boundaries: PASS

Ran `node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs --json <lesson.template.json>` for each lesson. All anchors resolved to exactly one adjacent final-paragraph pair in strictly increasing order. The reported paragraph counts are not source-block counts.

- n41: 36 final prose paragraphs; breaks `[8,16,27]`, separating examples 1/2, 2/3 and 3/4.
- n42: 14 final prose paragraphs; breaks `[6,9]`, separating general coefficients from monic equations, then monic examples from the graphical method. `proseFlow` retains one figure placeholder and one caption in addition to prose.
- n43: 39 final prose paragraphs; breaks `[12,21,27]`, separating the introductory worked derivation from method transfer, example 1 from 2, and example 2 from 3. M1 is paragraph 15 inside example 1; no existing section anchor depends on the erroneous word.

Exact resolved anchors:

- n41 / 8: `$2.3\sqrt{5}-\sqrt{20}-\sqrt{\frac{1}{5}}=2.3\sqrt{5}-2\sqrt{5}-0.2\sqrt{5}=\sqrt{5}(2.3-2-0.2)=0.1\sqrt{5}$。` -> `2. 约分：`
- n41 / 16: `$\frac{\sqrt{15}+2\sqrt{5}}{3+2\sqrt{3}}=\frac{1}{3}\sqrt{15}$。` -> `3. 查平方根表求表示式 $\frac{3\sqrt{2}+4}{\sqrt{2}-1}$ 的近似值。`
- n41 / 27: `$10+7\sqrt{2}\approx10+7\times1.414=19.898$。` -> `4. 证明：对于任何 $a\geq0$ 和 $b\geq0$，不等式`
- n42 / 6: `方程 $3x^2-x-2=0$ 和 $x^2+2x-8=0$ 都是二次方程，因为它们都具有 $ax^2+bx+c=0$ 的形式。\n第一个方程中，$a=3$，$b=-1$，$c=-2$，而第二个方程中，$a=1$，$b=2$，$c=-8$。` -> `首项系数等于 1 的二次方程叫做简化的二次方程。`
- n42 / 9: `$x^2+2x-8=0$，\n$v^2-0.7v+5.6=0$。` -> `我们已经学过用图解法解二次方程。\n用图解法解方程 $ax^2+bx+c=0$（$a\neq0$）时，最好把它写成 $ax^2=-bx-c$ 的形式。\n抛物线 $y=ax^2$ 和直线 $y=-bx-c$ 的交点的横坐标就是方程的根。`
- n43 / 12: `方程（3）的根的集合，也就是和它同解的方程（1）根的集合，是 $\{-5,-1\}$。` -> `我们利用在方程的左边配一个二项式的平方的方法（简称：配方法），再解几个 $ax^2+bx+c=0$（$a\neq0$）这种形式的方程。`
- n43 / 21: `因为当 $x$ 是任何数时，表示式 $\left(x-\frac{5}{2}\right)^2+\frac{7}{4}$ 是正的，于是所得到的方程的解集合是空集，因此方程 $x^2-5x+8=0$ 的解集合是空集。` -> `例 2 解方程：`
- n43 / 27: `方程 $x^2-18x+81=0$ 只有唯一的根 9。` -> `例 3 解方程：`

Here `\n` in an anchor denotes the literal newline returned by the tool; indices are zero-based.

## Separate Tool Receipts

### T1: Actual Number-Token False Positives, Not Authored Number Changes

Read-only `edition.validate_text` calls using the caller's raw source and source lines returned no errors for n41 or n42. For n43, before AND after in-memory normalization, they returned exactly:

```text
lesson.prose[3] 的非公式数字变化未被准确声明: want=[], got=['3']
lesson.prose[25] 的非公式数字变化未被准确声明: want=[], got=['9']
exercises[2] 的非公式数字变化未被准确声明: want=[], got=['1']
```

Bindings: `p0255#8`, `p0257#4`, and exercise 857 / `p0258#5`, respectively. Values 3, 9 and 1 appear identically in source and modern text. `edition.py`'s NUMBER/ERRATA_NUMBER pattern excludes a token followed by ASCII period; it misses source `3.`, `9.`, `1.` but counts modern `3。`, `9。`, `1。`. Restoring ASCII periods in an in-memory modern comparison reproduced the empty raw signatures. These are technical validation failures, not cultural numeric changes or mathematical errors. Do not fabricate `numeric_changes`, wrap these numbers in new formulas, or alter authored values to accommodate the checker. This report does not claim full pipeline validation PASS.

### O1: Exercise 851 Normalization Observation

Direct subpart-layout checking of the frozen authored 851 reports the generic layout error, because `normalize_numbered_subparts` folds its final whole-list question into the f) line:

```text
f) $x^2-81=0$。 其中哪几个方程是简化的二次方程？
```

The frozen author instead keeps the whole-list question on its own line after f), which preserves its scope and passes independent text review. The actual caller normalizes first; after that in-memory step both the text and subpart checks PASS, with 851 the sole changed exercise. This is a tool normalization observation, not an authored defect, omitted question or authorization to finalize. No normalized candidate was written.

### Mechanical PASS and Recovery Notes

Strict local KaTeX parsing: n41 123 formula occurrences, n42 63, n43 58; zero syntax errors. This checks syntax, not exercise answers. Exact formula strings/order, nonpunctuation wording, exercise line arrays, complete Latin enumeration and profile-cultural checks passed, except the independently adjudicated M1 meaning.

An initial combined JSON display exceeded the output limit; compact per-object reads recovered the omitted display without rerunning authors or viewing extra images. A lookup for nonexistent `tools/adapt.py` was corrected to the existing `tools/edition.py`. Initial punctuation-sensitive comparison differences were inspected and confirmed as the declared comma/colon layout changes, not additional content failures.

## Stop Condition

This bounded independent modern-text review is complete. Reports only; no repair, source re-review, figure approval, answer review, publication or continuation is authorized by this receipt. Preserve this FIRST result and review only affected changes after a real repair.
