# n38 Independent Answer Gate

**BLOCKED**: 49/49 arithmetic references match; 18 correction-lookup tasks remain source-specific uncertainty. No demonstrated arithmetic error. Image opens: **0**.

Review is offline and read-only outside this review directory. The independent 49-task solution was frozen and hashed before the first answer-key open. No original answers, figures/images, text-fidelity review, application, network, database, git writes, pipeline/suite runs, interaction/choice authoring, publish, merge, deploy or closure was performed.

## Per-Exercise Findings

| Exercise | Verdict | Matches | Finding |
| --- | --- | --- | --- |
| 799 | BLOCKED | 19/19 | a/b (13) match exact/base-cell rounded values. c (6) match independent direct rounding and exact squares; c2 is correctly 18.71, not 18.70, as a DIRECT reference. These do not establish actual correction-column answers for the six source lookup tasks. |
| 800 | BLOCKED | 8/8 | All references and the squaring of powers-of-ten exponents are correct: a [0,2,6,-2], b [0,-2,4,8]. All eight derive from 5.243/1.315, which require corrections; no actual base/correction lookup result is established. |
| 801 | BLOCKED | 8/8 | All eight Decimal roundings correct, including 0.06452, 0.5127, 548.0 and 9.754e11. a-d are determined base-cell references. e-h need correction columns, so actual lookup last digits remain unverified. |
| 802 | PASS | 4/4 | Inputs rounded first to 3.124, 0.1006, 41.41 and 67750; exact squares 9.759376, 0.01012036, 1714.7881 and 4590062500; four-digit references match. This exercise asks round then square, not explicitly read a table. Exact intermediate answers honestly complete it; no actual lookup values are certified. |
| 803 | PASS | 2/2 | Exact 301.9796 and 55.599375, separately rounded to 302.0 and 55.60. Correct components and no exact/approximation conflation. |
| 804 | PASS | 6/6 | 10.6, 0.266, 2.28e3, 6.59e5, 2.32e11 (three significant digits), 2.6e-8 (two). Display and notes correctly describe approximate center-value references, not guaranteed exact squares of unknown x. |
| 805 | PASS | 2/2 | a (11,9), b (25,16); denominator-cleared equations correct, and substitution residuals zero for all four original equations. |

Counts: 19+8+8+4+2+6+2 = **49 primary tasks**; **51 answer scalars** if x and y are counted separately for the two systems. No missing/duplicate exercise or displayed task; all sources are derived, no bookRaw, all ungraded with parts=[] as supplied.

## Why Not PASS

799, 800 and 801 explicitly ask for lookup. The provided lesson determines the rounded base cells but describes adding a separately tabulated correction for four-digit mantissas. Correct direct rounding is not guaranteed to reproduce that procedure. The key notes honestly disclose that no actual table was read. That prevents a false provenance claim, but does not finish the six 799c, eight 800, and four 801e-h method-specific answers.

Concrete non-additivity witnesses below are HYPOTHETICAL ARITHMETIC, not reconstructed/observed correction-table entries. Even rounding the exact increment separately can differ from direct rounding. The actual table correction is UNKNOWN:

| Task | Rounded base | Exact increment | Hypothetical separately rounded increment | Hypothetical two-stage result | Direct reference |
| --- | --- | --- | --- | --- | --- |
| 799c2 | 18.66 | 0.043225 | 0.04 | 18.70 | 18.71 |
| 799c4 | 65.93 | 0.113729 | 0.11 | 66.04 | 66.05 |
| 799c5 | 43.16 | 0.013141 | 0.01 | 43.17 | 43.18 |
| 801e | 34.69 | 0.023564 | 0.02 | 0.3471 | 0.3472 |
| 801f | 5.476 | 0.004681 | 0.005 | 548.1 | 548.0 |

In particular, 799c2 directly rounds 18.705625 to **18.71**. The hypothetical 18.70 shown above must NOT be substituted as a purported table correction answer. Likewise, 801f directly rounds 548.0281 to **548.0**, not the hypothetical two-stage 548.1.

802 is materially different: it explicitly asks to round the input then square, not to report an observed lookup. Both rounded operands and exact squares are present and correct, so the direct reference honestly completes that task. 803 exact results, 804 precision-matched approximate references and 805 exact systems are complete.

All-ungraded/parts=[] is the supplied parent artifact contract, not a claim that these tasks cannot ever be auto-graded. Deterministic tasks are ordinarily auto-eligible in cap2; this review did not create expected values, execute MathLive, finalize, or certify runtime grading.

## Unblock Requirement

Obtain authoritative relevant base/correction entries for the unresolved tasks, or obtain explicit human acceptance of a direct-reference-only scope. Do not invent correction last digits or relabel calculated values as actual table readings. Parent finalization remains gated; this report performs no finalize or closure.

## Hash Evidence

| Artifact | SHA-256 |
| --- | --- |
| lesson.json | `5248e4548e1d480c1ca1654650c1a7ea39e40bff90c1a2ed489c4371ce6ff251` |
| exercises.json | `328a9a48f94de5ebe455c846c165ae86616efb9b7a06a95d8b29f9d6ffd1e190` |
| answer-keys.json | `e45cfdfeb5279022df3503a55453bf7345765e4229d1cb195ffd09d90ca8ec83` |
| Frozen independent source solutions | `a0e25ddfd1407d9b6e0d0b0d237bf560283ec3afa42fcff4c8000ccaa4596a08` |
| Freeze receipt | `98ec24eed8b1cc97c92a263438ec838d8147a0a85abbec4531b223922ab46b8f` |
| Independent solver probe | `7c48c4036c95673ffcee935db556e3e3199dd6a966d0338b9daf88d0b7b07711` |
| Comparison probe | `2f02413ea225837dc1f2c9adccde96efd53f8c1d81d547039d53b758206c3c78` |

Freeze time: 2026-11-19T02:02:20.856357+00:00. Comparison began: 2026-11-19T02:05:32.358142+00:00. Source/key/frozen hashes were rechecked unchanged at the end.

Reproducible comparison command from the sole allowed cwd (run once; output creation is exclusive to preserve existing evidence):

```sh
python3 -B .intentfold/tickets/STEMROBIN-182/tmp/resume182-12/n38-answer-review/probes/compare_frozen_to_keys.py
```

Machine evidence: reports/answer-review-evidence.json. Frozen independent working: source-solutions/source-solutions.frozen.json and .md. The solver never opens answer-keys.json.
