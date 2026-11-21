# n81 cold source-science: OPEN

Independent solutions for the nine written exercises 60-68 were frozen before receipt of any parent answer draft. Zero images were viewed, reopened, cropped, screenshotted, or decoded. This report is not final lesson, answer, or choice approval.

## Substantive transformations

Every chain starts with `y=cos x`. `H(k)` multiplies point abscissas by `k`, producing `f(x/k)`. `V(k)` multiplies point ordinates by `k`, producing `k*f(x)`. `T(h,b)` is the signed vector translation, producing `f(x-h)+b`.

| Task | Ordered chain and resulting function | Exact graph proof, with base point `(t,cos t)` |
| --- | --- | --- |
| 60 | `H(1/2)`, then right `pi/4`: `cos(2x)` -> `cos(2x-pi/2)=sin(2x)` | `X=t/2+pi/4`, so `t=2X-pi/2`, `Y=sin(2X)` |
| 61 | `H(3)`: `cos(x/3)`; no translation | `X=3t`, so `Y=cos(X/3)` |
| 62 | Right `pi/2`, then `V(4)`: `sin x` -> `4*sin x` | `X=t+pi/2`, `Y=4*cos t=4*sin X` |
| 63 | `V(2/3)`: `(2/3)*cos x` | `X=t`, `Y=(2/3)*cos X` |
| 64 | Identity; no transformation: `sin(x+pi/2)=cos x` | Sine addition identity, for all real `x` |
| 65 | Right `3`: `cos(x-3)` | `X=t+3`, so `Y=cos(X-3)` |
| 66 | `H(1/3)`, right `2/3`, then `V(2)`: `cos(3x)` -> `cos(3x-2)` -> `2*cos(3x-2)` | `X=t/3+2/3`, `Y=2*cos t=2*cos(3X-2)` |
| 67 | `H(1/2)`, left `5/2-pi/4`, then `V(1/2)`: `cos(2x)` -> `cos(2x+5-pi/2)` -> `(1/2)*sin(2x+5)` | `X=t/2+pi/4-5/2`, `Y=(1/2)*cos t=(1/2)*sin(2X+5)` |
| 68 | In the specified order: `H(1/4)`, right `1/2`, `V(5)`, down `3`: `cos(4x)` -> `cos(4x-2)` -> `5*cos(4x-2)` -> **`y=5*cos(4x-2)-3`** | `(t,cos t)` -> `(t/4,cos t)` -> `(t/4+1/2,cos t)` -> `(t/4+1/2,5*cos t)` -> `(t/4+1/2,5*cos t-3)` |

All nonidentity abscissa maps are invertible. These substitutions therefore prove equality of whole graphs, not merely agreement at test points.

## Equivalence Versus Mistakes

A post-scale signed shift can change by an integer multiple of the graph period. In 67, left `5/2-pi/4` and right `5*pi/4-5/2` are equivalent because the signed shifts differ by `pi`, the period. The cosine phases `5-pi/2` and `5+3*pi/2` also differ by `2*pi`.

Reordering a horizontal scale and translation requires adjustment: `H(k)` then `T(h,0)` is the same point map as `T(h/k,0)` then `H(k)`. Thus 60 can first shift right `pi/2` and then scale by `1/2`; 66 can first shift right `2` and then scale by `1/3`. Reusing the unadjusted post-scale translation before scaling is generally incorrect.

In 68, interchanging the first two operations without adjustment gives `5*cos(4x-1/2)-3`, not the target. Interchanging the last two with their original vector gives `5*cos(4x-2)-15`. At `x=1/2`, the correct ordinate is `2`, while the latter is `-10`. An equivalent final graph is not sufficient evidence that the specified four operations were followed.

## Source Limitations

Both lessons at `/prose/22`, `p0032#1`, retain the literal reciprocal `k=1/A`. Read as the previously defined ordinate multiplier, this gives amplitude `1/A`, not `A`; at a peak for `A=2`, it gives `1/2` rather than `2`. The definition at `/prose/5`, `p0029#1`, the summary at `/prose/23`, `p0032#2`, and example 3 at `/prose/24`, `p0032#3`, support actual ordinate multiplier `A`. The modern text adds a warning not to use that reciprocal directly as the coordinate multiplier, but does not define a different ratio convention. This limitation is retained, not silently rewritten or declared a verified source typo.

The source deliberately calls stretching and shrinking by the common term compression. Its axis-specific `1:k` point maps control the mathematics. The literal unpowered `sin2x` is read as `sin(2x)`; pi-based phases are in radians. No unseen scan or image was used to confirm transcription.

## Exact Bindings And Evidence

Original and modern exercise array positions `/exercises/0` through `/exercises/8` bind tasks 60-68 to blocks `p0033#4` through `p0033#12`. The shared transformation request is bound to each task's `group`. Exercise 68's explicit request takes precedence over its repeated general group label. All nine original and modern `figure_refs` are empty.

`source-solutions.json` preserves the five source-file SHA-256 bindings, literal original prompts, relevant lesson pointer/block bindings, complete response units, operation maps, proofs, valid alternatives, and per-task counterexamples. It is the unchanged independent baseline.

`proof-check.mjs` is a scratch-only, once-executed, read-only helper. It checks source hashes and exact prompt bindings, rational/symbolic-pi affine composition, prescribed order, and periodic alternatives. Its direct trigonometric evaluations are explicitly finite sanity checks, not proofs. Actual stdout, stderr, and exit status are in `mechanical-receipt.json`. The earlier nonexistent-scratch-directory result is retained in `access-receipt.json`.

`manifest.json` inventories only this owned scratch directory and excludes itself from its file list and hashes. Nothing outside this directory was written.

OPEN for parent intake and a later explicitly released exact-draft comparison. No parent draft has been pre-read.
