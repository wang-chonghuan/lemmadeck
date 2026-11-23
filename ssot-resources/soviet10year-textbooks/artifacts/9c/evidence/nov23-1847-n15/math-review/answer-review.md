# N15 answer-candidate review

STEMROBIN-184; ana9-c3-s1-n15; 2026-11-23; TEXT-ONLY; finish=review.
Reviewed current `answer-keys.json` and `exercises.json` in
`.tmp/stemrobin-184-six/n15-nov23-recovery/raw/9c/editions/modern-us-neutral/lessons/ana9-c3-s1-n15/`,
plus immutable `ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n15/answer-draft.json`,
against the existing independent `math-review/source-math.md` freeze.
The distinct `modern-review.md` remains saved and unchanged; this report neither replaces it nor clears its wording/provenance observations.

## Findings and disposition

**No mathematical, current-task-fidelity, display-completeness, or answer-label defect found.**
All **8 displayAnswers**, **43 parts**, and their labels were individually compared with the frozen solutions and current modern prompts. The candidate's substantive answers, parts, grading, and notes agree with the standalone author draft; its eight bound prompt texts match current exercises 118-125.
There are **7 auto-graded exercises / 1 ungraded proof**. The 43 parts comprise **41 numeric / 2 exact** keys; no exercise, subpart, approximation endpoint, precision group, or requested digit sequence is omitted.

**Verification limit: 124's real-editor exact-serialization gate has NOT run.**
The candidate remains `status: "draft"`. Its correct `exact` declarations and stored strings are not evidence of successful editor round-trip, input-event handling, normalization, or actual judging.
The skill requires a real value-preserving edit and examination of the resulting editor serialization; no such operation or checker was run for this review. Do not mark that gate PASS or claim this candidate is finalized/publish-ready.

## Coverage against the freeze

| Exercise | Parts | Display and key comparison |
|---|---:|---|
| 118 | 0 | Complete ungraded proof: \(2.6^2=6.76<7<7.29=2.7^2\), nonnegative monotone squaring, both approximation errors below \(0.1\). Empty parts is intentional, not missing grading. |
| 119 | 8 | Lower/upper labels correctly bind a **0.2 / 0.3**, b **-1.3 / -1.2**, c **1.1 / 1.2**, d **3.3 / 3.4**. Display includes all four cases and the rational/root reasoning. |
| 120 | 1 | Label requests the first four decimal digits; key **6091**, not the whole value 3.6091. Display uses the final strict interval and treats the answer as actual digits, not rounding. |
| 121 | 28 | All four subparts have three lower/upper pairs at units, tenths, hundredths, plus one fractional-tail digit key. Exact coverage is detailed below. |
| 122 | 1 | Key **90532** and its label agree with the five-digit task. Display retains the frozen enclosure \(1.9053238\le x+y<1.9053240\) and prefix \(1.90532\ldots\). |
| 123 | 1 | Key **31** and its label agree with the two-digit task. Display retains \(3.31272708\le xy<3.31309608\), prefix \(3.31\ldots\), and the warning that input prefixes are not exact factors. |
| 124 | 2 | Labels specify four significant figures; `exact` keys are precisely **"1.748" / "3.650"**. Both displays use nearest rounding; b explicitly retains the terminal zero. |
| 125 | 2 | a/b digit labels and keys are **247 / 162**, not whole truncated values 0.247 / 3.162. Displays retain the actual prefixes, \(\sqrt2\sqrt5=\sqrt{10}\), and the no-rounding convention. |

For **121**, each pair below is (不足, 过剩), with separately labeled digit key:

| Subpart | 个位 | 十分位 | 百分位 | Nonnegative fractional-tail digits |
|---|---|---|---|---|
| a | (0, 1) | (0.2, 0.3) | (0.21, 0.22) | 214 |
| b | (-4, -3) | (-3.4, -3.3) | (-3.34, -3.33) | 666 |
| c | (1, 2) | (1.7, 1.8) | (1.73, 1.74) | 732 |
| d | (-2, -1) | (-1.8, -1.7) | (-1.74, -1.73) | 267 |

All 28 labels preserve subpart, precision, and endpoint role; no accidental shift to tenths/hundredths/thousandths occurs.
The display explicitly explains \(-10/3=-4+2/3=\overline{4}.666\ldots\) and \(-\sqrt3=-2+(2-\sqrt3)=\overline{2}.267\ldots\). The bar acts on the integer characteristic alone. Ordinary \(-3.333\ldots\) / \(-1.732\ldots\) magnitude digits are correctly distinguished, not substituted into the source-convention keys.

For **124**, the displayed indicative decimals \(1.747546\ldots\) and \(3.650281\ldots\) are actual prefixes matching the freeze. Current modern instructions explicitly require nearest rounding and precision-bearing zeros, so **1.747** (the source-review truncation alternative) is not a valid answer to this current prompt.
The candidate declares singleton `exact` expectations **"1.748"** and **"3.650"**, without an alternate "3.65" that would discard the stated precision. Numeric equivalence alone cannot enforce four significant figures; exact serialization is therefore appropriate here, subject to the unrun editor gate above. Text inspection does not establish which alternate serializations the real editor/normalizer will preserve, accept, or reject.

All displayed answers are present and consistent with their keys; no code-style math syntax, approximation-as-equality of a finite answer, swapped labels, new figure dependency, or missing proof display was found. Explanations reuse the freeze; no new source solution was derived.

## Reviewed SHA-256 and limits

| File | SHA-256 |
|---|---|
| Current scratch `answer-keys.json` | `29f569010a344357375351fa73d6b05610c8065d0dc3e87192b474a81731a44f` |
| Current scratch `exercises.json` | `647e4014777a5bf9673a92507608bf401e94f3fc709e0a25ba73202299bbc4cb` |
| Immutable `answer-draft.json` | `62c3f952b9e96eb65bd8229023cc51591f3a75b3dcfa999c8a14c62a53c43f42` |
| Preserved `math-review/source-math.md` | `4b37e257aaafb965f205d7d4f6b961a8592edc4558f59e15f04ea75310ae62ef` |
| Preserved `math-review/modern-review.md` | `f6f4d0815fa0e4c8831f294360d90797e8c4aecc8114faca699b831b68e90d5a` |

Only the new `math-review/answer-review.md` is authored. No producer/checker, native-image review, new source solving, Git, DB/env/app/dependency, browser, or other-agent operations. ZERO images. This is answer text/content review only, not editor, rendering, grading-runtime, publication, or choice acceptance. Stop at review.
