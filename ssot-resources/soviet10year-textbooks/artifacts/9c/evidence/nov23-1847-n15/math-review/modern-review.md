# N15 modern-candidate text review

STEMROBIN-184; ana9-c3-s1-n15; 2026-11-23; finish=review.
Reviewed the first finalized `lesson.json`, `exercises.json`, and `adaptation.audit.json` in
`.tmp/stemrobin-184-six/n15-nov23-recovery/raw/9c/editions/modern-us-neutral/lessons/ana9-c3-s1-n15/`
against the collected, unchanged `source-math.md` freeze.
No new source solving, images, answer/choice-directory exposure, producer or revalidation commands, Git, DB, app/env/dependency access, or agent actions. Only this new evidence file is authored.

## Findings

**[P2] Minor comparison-reference ambiguity, not an algebraic error.**
`lesson.json:82`, `prose[4]`, ends: “不足近似值可以等于原数；过剩近似值仍高出最后一个所保留数位的单位。”
“高出” does not identify its reference value. It should explicitly say **higher than the lower approximation by one retained-place unit**, not imply that its error relative to the original number is always that unit.
The formula in `prose[3]` is correct and resolves the intended interpretation, but the added sentence should not require that inference. The freeze's 119(a) already distinguishes upper-minus-lower \(0.1\) from upper-minus-original \(0.0336\).
Suggested wording: “过剩近似值比不足近似值高出最后一个所保留数位的单位。”
This same sentence is part of `section_breaks[0].before` and the audit's resolved index-7 anchor; any later producer edit must keep those exact anchors consistent.

**[P3] Substantive clarifications are incompletely classified.**
`lesson.prose[4]` (canonical expansion / endpoint qualification), `lesson.prose[13]` (midpoint interpretation), and exercises **121, 124, 125** all declare only `["layout"]`, despite adding mathematical or task-convention explanations.
These explanations are appropriate, not unauthorized formula changes; record `clarification` as well to make their provenance honest. In particular, 124 explicitly selects nearest rounding where the reviewed source did not state the rule. This is a traceability observation, not a demonstrated failure of the passed adaptation gate.

**Disposition:** mathematical content, exercise fidelity, and erratum bindings PASS; the minor wording clarification above remains recommended before treating the text as ambiguity-free. No candidate was edited or re-finalized.

## Substantive comparison with the freeze

- All 19 current prose blocks were reviewed. Their formulas, operands, comparison signs, and examples match the frozen source mathematics except the one registered full-formula repair. No additional formula-span changes were found after accounting for that repair.
- `prose[1]` correctly distinguishes a negative integer characteristic plus a nonnegative fractional tail from a minus acting on the entire ordinary decimal. Exercise 121 explicitly requests precisions \(1,0.1,0.01\), then the first three fractional-tail digits without rounding. This matches the freeze, including **214, 666, 732, 267**, not ordinary negative-magnitude digits 333/732. The added instructions do not reveal those answers.
- `prose[4]` explicitly adopts the no-eventually-all-nine canonical expansion convention **for this lesson**, rather than claiming every arbitrary digit tail has a strict upper bound. The non-strict lower endpoint and terminating-decimal case are preserved. The reference to section 12 does not claim its separate digit-bound issue has been repaired or reviewed.
- `prose[9]` separates shrinking-interval uniqueness from completeness/decimal-construction existence. `prose[13]` treats \(1.00000\pm0.00001\) as an error enclosure, not equality, fixed digits, or a guaranteed rounded result. These agree with the freeze and preserve the source's undetermined integer part.
- `prose[14-16]` limits direct product bounds to nonnegative factors, explains that product-interval width is not generally the single-factor precision unit, and uses absolute values plus the sign rule for negatives. It does not falsely promise width at most \(10^{-n}\). `prose[17-18]` retains the checked square enclosure and distinguishes choosing a suitable tail from asserting that every prefix-compatible number squares to 2.
- All eight exercises **118-125**, their source numbers, order, grouping, page/block references, operands, subpart counts, and the 125 star are retained. The five strict inequalities in 120 remain strict; its added no-rounding instruction is faithful. 122/123 still ask for actual digits of sums/products with unspecified tails, not arithmetic on exact truncated factors.
- 124 explicitly says nearest rounding to **four significant figures** and requires precision-bearing terminal zeros. It therefore selects the freeze's **1.748 / 3.650**, not four decimal places or an unstated truncation convention. 125 explicitly requests actual first digits without rounding, consistent with the frozen **0.247 / 3.162** prefixes; those outputs are not inserted in the candidate.
- No new exercise solutions, answer-key fields, options, or choices occur in the reviewed learner prose/exercise objects. Source snapshots and the erratum's teaching-example explanation are provenance, not new exercise-answer leakage. This is a text/payload review only, not a claim about unseen publication/runtime behavior.

## Current erratum and source bindings

`p0061-upper-sum-missing-base` occurs once in current page-61 metadata and once in the modern errata list.
Its physical/printed page is **61/54**, block **p0061#4**, target **lesson.prose[12]**; source references agree with the embedded raw snapshot.

```latex
original: $x_5+y_5=0.99999,\quad x'_5+{}'_5=1.00001$
corrected: $x_5+y_5=0.99999,\quad x'_5+y'_5=1.00001$
```

The original occurs once in the current raw page block and raw lesson target, zero times in the modern target; the corrected span occurs once in that target, which declares `math-correction`.
The current raw block still preserves the empty primed base exactly as frozen. The registered reason explicitly says the physical cause is UNKNOWN and that supplying `y` is mathematical repair, not a claim that pixels show the letter.
The bound page JSON hash is the **current registered** hash below, not the pre-registration hash in the source freeze. Its PDF identity matches the frozen PDF SHA-256 `622f972014ce83a76a36b3174ce6d6995e77b86efa0f8dbaba7f5497729a8aec`.
Both current raw lesson/exercise file hashes equal the modern source hashes and the audit hashes; their parsed contents equal the embedded snapshots. All current prose/exercise `source_text` values and prose block references agree with those snapshots.

The retained adaptation audit says PASS, 19 prose blocks, 8 exercises, 0 figures, one erratum, and no errors. Its four resolved anchor pairs **7/12/18/22** exactly match the authored pairs and make sensible semantic transitions in current text. The supplied **25 normalized paragraphs** and native-61 **26/26 PASS** are retained producer evidence, not newly rerun counts or image review.

## Reviewed SHA-256

Candidate directory is the path stated above; raw paths are relative to its recovered `raw/9c` root.

| File | SHA-256 |
|---|---|
| Modern `lesson.json` | `2ecbc1ae142133e57b10061068aea34b59dd86ed9f1184a429e4d0d38a26cd20` |
| Modern `exercises.json` | `647e4014777a5bf9673a92507608bf401e94f3fc709e0a25ba73202299bbc4cb` |
| Modern `adaptation.audit.json` | `ef3b6a75f9755f1b1754081e83ce912c2f1f94d7dfd0f7fcaacf7b1e48e62697` |
| Raw `lessons/ana9-c3-s1-n15/lesson.json` | `f18f22d1d366efbed290fc939786504847c190fdc26abf83e56ee5897a018b3a` |
| Raw `lessons/ana9-c3-s1-n15/exercises.json` | `2d30e9319a3f1afc0e31fefb754d83c3da6c8acf97f71f895daafda35df51737` |
| Raw `pages/0061/page.json` | `b24537136d47cfd5558577d11a66e3555e969f0398b28100a3073ea32dc49a59` |
| Unchanged `math-review/source-math.md` | `4b37e257aaafb965f205d7d4f6b961a8592edc4558f59e15f04ea75310ae62ef` |

Review stops here; no answer/choice or display acceptance is implied.
