# Stage 2 Exact-Draft Comparison

**PASS** for all nine answer meanings, complete displayed response units and the declared grading-capacity split. **HOLD** for resolution/approval of the existing source notation issue and anything requiring the uninspected grading runtime. **OPEN** for actual parent intake and closure. No answer change is required by this comparison.

This is an exact parent-draft comparison against an unchanged independent freeze, not new source solving or human source-fidelity approval. Cumulative image views and decodes remain zero. The first source-proof helper was not rerun. No canonical file or earlier scratch snapshot was changed.

## Exact Bindings

- Release: `.tmp/stemrobin-184-six/n81-answer-draft-release.json`, SHA-256 `4612314de096adf2e9db3e1c88fee2323fb5671125340b618dcaf51810d5f56c`.
- Parent draft: `.tmp/stemrobin-184-six/n81-answer-draft.json`, 3232 bytes, SHA-256 `ac985aed5b846317b4a2489db22375919b30c2418359624f89e5c688907c3fe7`.
- Independent frozen baseline: `source-solutions.json`, 30147 bytes, unchanged SHA-256 `70c63a7e301a3fb1f9771455d87651cd02bbfc79215505e91af2d4a158e8f42e`.
- Stage 1 intake digest `cf268da4e2d2437d44db63b8718465493ad66afc7c0755f16e1852e4182ea1e8` is supplied by the caller and agrees with release `/intake`. Its file content was not read or independently hashed.

Draft `/answers/0` through `/answers/8` bind exactly to frozen `/solutions/0` through `/solutions/8`, exercises 60-68 and original blocks `p0033#4` through `p0033#12`. `stage2-comparison.json` records every exact displayAnswer field SHA-256, ordered math fragments, grading field, response-unit assessment and proof binding.

## All Nine Answers

`H(k)` multiplies abscissas by `k`; `V(k)` multiplies ordinates by `k`; signed `T(h,b)` translates coordinates. Each starts from the source graph `y=cos x`.

| Task / Draft Pointer | Actual Parent Chain | Verdict And Proof |
| --- | --- | --- |
| 60 `/answers/0` | `H(1/2)`, right `pi/4` | PASS. `X=t/2+pi/4`, `Y=cos t=sin(2X)`; both intermediate functions and factors are explicit. |
| 61 `/answers/1` | `H(3)` | PASS. `X=3t`, so `Y=cos(X/3)`; unchanged ordinates and horizontal stretching are explicit. |
| 62 `/answers/2` | Right `pi/2`, `V(4)` | PASS. `X=t+pi/2`, `Y=4*cos t=4*sin X`; phase conversion and ordinate factor are explicit. |
| 63 `/answers/3` | `V(2/3)` | PASS. `X=t`, `Y=(2/3)*cos X`; unchanged abscissas and the coordinate multiplier are explicit. |
| 64 `/answers/4` | Identity | PASS. The displayed identity `sin(x+pi/2)=cos x` proves no transformation is required. |
| 65 `/answers/5` | Right `3` | PASS. `X=t+3`, so `Y=cos(X-3)`; direction and starting graph are explicit. |
| 66 `/answers/6` | `H(1/3)`, right `2/3`, `V(2)` | PASS. `X=t/3+2/3`, `Y=2*cos t=2*cos(3X-2)`; all three functions are displayed in order. |
| 67 `/answers/7` | Right `pi/2`, `H(1/2)`, left `5/2`, `V(1/2)` | PASS. Four operations, but exactly the frozen final point map, not a count mismatch defect. All four intermediate functions are present. |
| 68 `/answers/8` | Source-prescribed `H(1/4)`, right `1/2`, `V(5)`, down `3` | PASS. Four ordered displayed functions and final `f(x)=5*cos(4x-2)-3` implement the source construction in full. |

The parent need not reproduce the reviewer artifact's full coordinate proof. Its written transformations and algebra satisfy the source requests; the proofs here establish their correctness.

## Exercise 67: Actual Order

The exact parent chain maps the original point as follows:

`(t,cos t)` -> `(t+pi/2,cos t)` -> `(t/2+pi/4,cos t)` -> `(t/2+pi/4-5/2,cos t)` -> `(t/2+pi/4-5/2,(1/2)*cos t)`.

Thus `X=t/2+pi/4-5/2`, `Y=(1/2)*cos t`, exactly frozen `/solutions/7/expected_point_map`. Solving for `t` gives `t=2X+5-pi/2`, hence `Y=(1/2)*sin(2X+5)`.

The pre-scale rightward shift is halved by the later abscissa scaling. This is why right `pi/2` before scaling is valid, while an unadjusted right `pi/4` before scaling would not be. The parent has four operations and the canonical freeze has three; point-map equality, not count equality, controls this judgment.

The frozen alternatives remain valid, including signed final shifts `h+m*pi`, with `h=pi/4-5/2`. The parent requires no periodic adjustment: its point map already agrees exactly.

## Exercise 68: Response And Capacity

The displayed sequence is exactly:

`cos(4x)` -> `cos(4x-2)` -> `5*cos(4x-2)` -> `5*cos(4x-2)-3`.

It demonstrates the correct interpretation of both axis-specific ratios and both vector translations in the prescribed order, even though the answer does not repeat all source instruction prose. The final function is explicitly written. This is a complete response to the specific write-the-resulting-function task.

`/answers/8/parts/0/judge` is `expression`; `/answers/8/parts/0/expected/0` is exactly `5\cos(4x-2)-3`. That is an honest final-expression target, not a claim to auto-grade the transformation narrative, proof or operation order.

All eight entries 60-67 have `grading=ungraded` and empty `parts`. This honestly avoids pretending a single-expression or exact-string checker can validate nonunique transformation narratives. The 8/1 split is PASS as a declared capacity choice.

No runtime evaluator was read or called. LaTeX parsing, actual equivalent-input acceptance and integration behavior are not certified here. Mathematically equivalent forms such as `5*cos(4*(x-1/2))-3` remain valid regardless of that untested implementation.

## Retained Source Limitation

Frozen `/limitations/0` binds both lesson `/prose/22` entries to `p0032#1`, retaining literal `k=1/A`. As the preceding defined ordinate multiplier, this cannot yield amplitude `A`: for `A=2`, it yields `1/2`, not `2`, at a peak. The explicit definition at `p0029#1` and summary at `p0032#2` support ordinate multiplier `A`.

The modern warning does not define a new ratio convention. The parent draft correctly uses actual coordinate factors and makes no source repair claim. Answer mathematics passes, while source spelling/convention resolution remains HOLD without new human authority.

The frozen compression vocabulary, radians convention, unpowered `sin2x` interpretation, zero-image transcription boundary, specific exercise 68 request and nonunique-chain policy remain unchanged.

## Evidence And Preservation

One new affected checker binds the released bytes and reviewed fields, composes the actual parent operations against frozen expected point maps, checks grading payloads and verifies all six stage 1 snapshots. It does not import or run `proof-check.mjs`, reopen original/modern source files, or call the application evaluator.

Actual stdout, stderr and exit metadata are recorded in `stage2-mechanical-receipt.json`. New evidence is listed in `stage2-manifest.json`, which excludes itself and retains the earlier manifest and snapshots as immutable entries.

This comparison is limited to the exact released draft. Remain OPEN for actual parent intake/closure; no final lesson, answer, choice, source-fidelity, publication or runtime approval is implied.
