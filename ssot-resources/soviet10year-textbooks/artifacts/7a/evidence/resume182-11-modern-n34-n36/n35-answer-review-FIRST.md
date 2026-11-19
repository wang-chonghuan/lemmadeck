# STEMROBIN-182: n35 Independent Cap2 Gate FIRST

**Verdict: PASS.** Exercises 754-760: 7 pass, 0 revise, 0 blocked; all 36 requested subanswers checked. This is an offline mathematical/display-answer gate for `alg7-c4-s1-n35` only. The candidate remains `draft`, unchanged and unfinalized. No app, `.env`, network, DB, Git, publish or cap3 operation was performed.

## Independence and Hash Binding

All shell operations used `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. Only this report, its JSON counterpart and `n35-answer-review-FIRST-receipts/` were written. No other worker's files were changed.

The current modern lesson/exercises were read first. The two specified images were hashed before either open, opened **exactly once each**, and used for concrete graph observations. Total image loads: 2; reopens, crops, table images and extra screenshots: 0.

All seven independent solutions were frozen before the first candidate/template read. Parent answer reasoning and prior reviews were never read. The explicitly requested FigureSpec was read as figure context, not used instead of visual evidence.

- Independent solve froze at `2026-11-18T23:47:49.923Z`; candidate/template first read at `2026-11-18T23:48:16.119Z`.
- Independent solve SHA-256: `000b93caf8397b48f3477c752a8e7448fd9bc75e04949a056bf51331575f3312`.
- Freeze receipt SHA-256: `59de999a2158250b9042a6936258de175b1072f1f602067e0a1831dbdd117066`.
- Candidate `answer-keys.json`: `8ebe24dafd5a1e71180cd8fbb44a139bf5b3de195c263d815d4100a3ef863f4c` (3113 bytes).
- Specified `answer-prepare/.../answer-keys.template.json`: `8681e57031e78c040d3a51a2d13c03bde0c432e65860925be7876b3caa2b57f5` (2945 bytes).
- Modern lesson: `df6652172df2ab79a9b44be04b22923c49d51fa7934d43e2f4f2c72466d11f28`.
- Modern exercises: `d6eb768bf560af64e213d0b6760dfc3026f60efaae5619c74bacace7fb2bf077`.
- Source `artifacts/7a/figures/fig-54.png`: `480bb2e509e6e900b0d620376a1ddf4932fe3ae98fdbff66ca893696f27be46d`.
- Current `n35-figures/fig-54/complete-preview.png`: `8c039a4a34d3a0907232252da287db8f395b402ce4d070769c947fc4cb587a49`.
- Durable `editions/modern-us-neutral/figures/fig-54.svg`: `473153e455c3d9f177108177ed14f526f38a8528d2317275e653e888925daaad`.
- Durable/scratch FigureSpec: `8877e313eae964fde67f712221ea5e1567e731b33c85f7c09c88ff83552540ad`; both specs and both SVG counterparts match byte-for-byte.

All original input hashes, candidate/template hashes and independent receipt hashes remained unchanged at the read-only verification at `2026-11-18T23:49:38.321Z`. File hashes are exact-byte SHA-256. The per-exercise candidate/template/exercise hashes in the JSON report hash `JSON.stringify` of the complete parsed object, preserving property order.

## Figure 54 Evidence

The source has a dense black lattice with visible positive-axis units, an origin and one increasing, flattening square-root curve. Scan/pen marks obscure some details. The completed 640 by 360 preview has a clean light lattice, readable numbered units and the same rising concave-down curve; neither image contains queried-coordinate answer annotations.

For 754a), vertical graph projections give roughly `1.6`, `2.3`, `2.9`; the modern second ordinate lies around `2.3-2.4`. For 754b), horizontal graph projections give roughly `1.4`, `2.9`, `6.2-6.3`. These are real visual observations, with honest coarse precision, not calculated hundredths relabelled as graph reads.

Both images put the `y=2` crossing near `(4,2)`. The origin is visible and must be included in the answer to `sqrt(x)<2`. The spec declares tenths grid spacing and a curve ending at the source border `x=11`. Matching SVG/spec bytes bind the modern counterpart; they do not replace pixel inspection. Full-domain statements beyond that finite window follow the formula and monotonicity, not unseen pixels.

## Per-Exercise Decisions

### 754: PASS

Independent graph answer: a) approximately `1.6, 2.3, 2.9`; b) approximately `1.4, 2.9, 6.2-6.3`. Independent formula checks give `1.581138830..., 2.345207879..., 2.898275349...` and exact inverse values `1.44, 2.89, 6.25`.

The candidate covers all six quantities in order and gives the actual projection constructions: vertical-to-curve then horizontal-to-axis for a), and horizontal-to-curve then vertical-to-axis for b). Its coarse inverse `6.3` agrees with the observed region. It explicitly labels forward `1.58, 2.35, 2.90` as formula checks and denies exact graph precision; exact inverse squares are also labelled calculation checks. No false pixel precision or domain violation.

### 755: PASS

`A` and `B` belong; `C` and `D` do not. Verify `sqrt(64)=8`, `sqrt(10000)=100`; reject `C` because `x=-81` is outside the real domain, and `D` because the principal value at `x=25` is `5`, not `-5`. All four decisions and reasons match. B is verified by formula, not falsely read beyond the finite figure.

### 756: PASS

All four comparisons match: `sqrt(68)<sqrt(72)`, `sqrt(0.12)>sqrt(0.015)`, `sqrt(24.7)<5`, `8>sqrt(60)`. Strict increase on nonnegative reals applies; compare the last two radicands against `25` and `64`. No approximations are required.

### 757: PASS

a) `0 <= sqrt(x) <= 2`; b1) `[0,3]`; b2) `[10,20]`; b3) `(0.1,1)`. Candidate `]0.1,1[` is the equivalent open-interval notation. Closed endpoints remain included; both open endpoints remain excluded. Zero is retained where appropriate. All four subanswers match exactly.

### 758: PASS

a) `x=4`; b) `x>4`; c) `0 <= x < 4`. The candidate gives concrete graphical reasoning through the horizontal line `y=2`, the crossing `(4,2)` and above/below behavior on either side. The visual crossing is near `(4,2)`; `2^2=4` confirms its exact coordinate. The strict inequalities exclude 4, c) includes 0, and the full right-hand interval follows the lesson's monotonicity beyond the finite picture.

### 759: PASS

All nine answers match in prompt order: a) `x=100`, `x>=100`, `0<=x<=100`; b) `x=7`, `x>7`, `0<=x<7`; c) `x=4`, `x>4`, `0<=x<4`.

Squaring is order-preserving because both sides are nonnegative. Candidate preserves the lower-domain bound, includes the non-strict upper endpoint 100, and excludes the strict upper endpoints 7 and 4. None of the six inequalities is omitted.

### 760: PASS

All six domains match: a) real `y != 0`; b) real `x != 4/15`; c) real `x != -3,3`; d) all real x; e) `x<=3`; f) `x<=5`.

The candidate preserves variable y in a), excludes both absolute-value poles in c), and correctly explains that d)'s denominator is at least 8 and f)'s denominator `x^2+1` is always positive. Root-zero endpoints 3 and 5 are included. No false numerator-zero exclusion or restriction on negative x.

## Source and Grading Checks

Every preparation prompt exactly equals the current modern exercise text; both candidate and template contain exactly the seven target IDs. For each of 754-760, `source=derived` agrees and `bookRaw` is **absent in both files**, not changed or silently omitted from a supplied raw value.

There is no local `artifacts/7a/answers.json`. Thus no unseen printed-book answer is claimed to have been checked, and the absence of that capture is not a claim that the printed book has no answers. The frozen independent solve supplies the mathematical evidence.

All seven answers intentionally remain `grading=ungraded`, `parts=[]`, read-only. All 36 requested subanswers are covered in `displayAnswer`. No automatic grading was introduced. MathLive/exact-input checks are inapplicable here and were not run; no runtime/finalization approval is implied.

The read-only check verified coverage, prompt/source alignment, unchanged hashes and 12 independent algebra/boundary test groups. Those sanity checks supplement, not replace, the manual mathematical and visual gate.

## FIRST Findings and Handoff

No answer-content defect was found in the reviewed candidate bytes; no parent repair is required. The initial lesson wording `x>0` is followed by explicit nonnegative-domain and origin statements; the answers correctly use `x>=0`. Empty per-exercise figure evidence was not mistaken for an absent graph: the lesson-level Figure 54 and the direct user-specified images were used.

Preserve this FIRST report and its freeze receipts. Later changed answers or dependent lesson/figure content require a separate affected-only gate against new hashes. This pass does not authorize candidate edits, finalize, publish or cap3.
