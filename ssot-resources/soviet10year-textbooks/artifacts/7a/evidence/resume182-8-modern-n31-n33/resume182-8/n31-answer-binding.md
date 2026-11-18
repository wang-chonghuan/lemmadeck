# n31 Current Answer-Output Binding

Verdict: **PASS** for the current seven standard answers and all **22 numeric parts**, independently of choice's **REVISE** verdict for one distractor explanation. This is a narrow offline mathematical/output comparison against the fresh source solutions established before reading author keys, not a pipeline or runtime approval.

W: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. Lesson: `7a/modern-us-neutral/alg7-c4-s1-n31`. Author manifest byte SHA-256 verified: `12406485f12eff1993d834ccddf8c9050a1ee7e7bcb989188b1342acdd6c14d1`. No sources were solved a second time; no old keys or prior condition/math reports were used.

## Current Input Bindings

Paths below are relative to W; key/exercise files are inside `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s1-n31/`.

| File | Byte SHA-256 |
| --- | --- |
| `answer-keys.json` | `78a6665e77ad0972f45d6170ffdbbd786af0bc1fdf0f3a31eaa34fa48c0d612d` |
| `answer-keys.audit.json` | `f09e0ac581f6caccbc4e0e0c0d6640a0b5784d3d569aa0ed12cae35c22dc6ecb` |
| `exercises.json` | `4d24fd62d73448a56faf6b1bf2e1f58079676d1cd46fbc33d14dea90454ce743` |
| `lesson.json` | `6225613f5aa0980017e11dd0b2f46bfab34fe5f05eb8e7d8fda9842a12da33d8` |
| `figures.json` | `daae66ecfc981b2efa6f723ea892742785f1a16625a10dc73921e30bc5afe15d` |

Fresh independent-solution record: `.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/n31-choice/review.json`, specifically its seven `source_reviews.independent_solution` fields. Byte SHA-256: `6c08a934a80861508feb0f6da495c9476ecc3921ac6fe63bf41daaba4980c75f`; canonical SHA-256: `e6082d6961eb11b06bfbd48aff1147e285ae1316bfcd6b13b65a80e256fd0717`. Seed canonical SHA-256: `274b45c50bb94e5cdb5ce0a33635f9b3671e73dff7520410d62586b1c30c0bd4`.

## Concrete Comparisons

| Source / current key | Independent result and comparison |
| --- | --- |
| 730, auto, 9 numeric parts | Labels `1)` through `9)` correspond exactly to ordered `25,81,2,3,4,5,6,1/2,1.3`; expected fraction `\frac{1}{2}` is the same numeric value. Display explains why negative roots square positive. |
| 731, auto, 11 numeric parts | Labels `a)` through `k)` exactly match `7,3,26,-14,45,20,2,60,3/4,1/2,2/3`. Expected fractions retain correct numerator/denominator. Display preserves external 10 versus squared coefficients, negative-sign scope and nonzero fixed denominators. |
| 732, ungraded | All eight valid square witnesses match independently: `3^2,8^2,(sqrt(6))^2,(sqrt(10))^2,(sqrt(2.5))^2,0.5^2,(sqrt(a))^2,(2sqrt(b))^2`. Original `a>0,b>0` remain; opposite bases are explicitly allowed rather than a uniqueness claim. |
| 733, ungraded | All four simplifications match `sqrt(2),-sqrt(5),sqrt(10)/3,-sqrt(a)/3`. Original last domain is correctly `a>0`; cancelling a nonzero root does not admit zero. Every displayed equality respects that domain. |
| 734, ungraded | All six answers include both square-difference and factorization steps, with base pairs `(x,3),(a,sqrt(3)),(2a,sqrt(7)),(4b,sqrt(11)),(sqrt(c),2),(sqrt(5),sqrt(a))`. Local original `c>0,a>0` remain, first four are real-variable identities, alternate factor order is valid, and no false `a<5` condition is added. |
| 735, ungraded | All four simplifications match `a-2,c+sqrt(6),sqrt(x)-sqrt(2),sqrt(a)+sqrt(b)`, with separate original domains `a!=-2,c!=sqrt(6),x>=0,a,b>=0 and a!=b`. Zero denominator holes stay excluded; third-part `x=0,x=2` are correctly allowed. Displayed factorizations/cancellations are valid on these domains. |
| 736, auto, 2 numeric parts | Labels rice per kg / wheat per kg bind expected `0.88` / `0.30` and units USD/kg, respectively. Display's 88/30 cents match; `2*0.88+3*0.30=2.66` and `0.88-0.30=0.58`. Both display equation stages and price attribution agree. Modern dollars/cents preserve 2.66/0.58 numerically, with no currency conversion. |

All seven modern exercise texts match the seed; original mathematical data/conditions and subpart order are maintained. Each current key is `source: derived`, with no copied `bookRaw`. Every exercise 730-736 has exactly one standard answer; numeric parts total `9+11+2=22`, with no missing/repeated labels or swapped price units. These are exact values, not rounded approximations.

Current audit says `status=pass,answerCount=7,auto=3,ungraded=4`, consistent with the independently inspected key structure. Audit status alone was not used as mathematical evidence. Under the cap2 gate, ungraded 732/734 avoid equating mere expression equivalence with completing a nonunique construction/two-stage task; ungraded 733/735 retain full simplification/domain explanations rather than pretending a lone equivalent formula verifies them. No `exact` parts or MathLive interaction claim is made.

Post-comparison read-only hashes reconfirmed all listed current inputs unchanged. The separately authorized choice validator ran once, label `n31-choice-semantic-FIRST`, actual exit `3` for its recorded `revise` outcome. That distractor-explanation defect does not change any source result or standard answer verified here. No answer validator/finalize/pipeline was run for this binding; its exit is not applicable, not an invented zero.

Zero images/network/Git/DB/apps/cap3/publishing; no key/source/draft/old-report edits and no answer pipeline rerun. This PASS does not approve the defective choice explanation, the original source glyphs, any earlier condition dispute, display rendering or runtime judging behavior.
