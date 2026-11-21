# Stage 1 Source Freeze

Status: FROZEN_OPEN. Independent source-only review of STEMROBIN-184/184-6,
lesson ana10-c6-s2-n81, originals 60-68. All nine source tasks are solved.
No candidate, key, author solution, answer file, interaction, prior review or
parent mathematical proof was accessed. This is not candidate approval and
not the final s10y-choice-review-v1 review.

## Source Findings

1. The official seed is authentic to its stated canonical digest but omits
   `exercise.group`. Every one of the nine complete modern exercise objects
   explicitly repeats group g1: obtain the following graphs from `y=cos x`.
   `source-group.json` freezes the exact full Chinese request, all nine
   associations and the actual modern `exercises.json` byte hash. Treating
   60, 62 or 67 as a transformation from an already available sine graph
   would drop the cosine-to-sine phase task.

2. The explicit definitions resolve coordinate factors without figures:
   block 5 sends `(x,y)` to `(x,ky)` and block 12 sends it to `(kx,y)`.
   The textbook's umbrella word "compression" includes factors greater
   than one. Consequently 61 requires an x-coordinate multiplier of 3,
   62 a y-coordinate multiplier of 4, and 68 step 3 a y-coordinate
   multiplier of 5. Reciprocal factors are not interchangeable.

3. Modern prose block 22 retains literal `k=1/A` with the qualification
   that it cannot directly be the earlier map's coordinate multiplier.
   This paragraph remains HOLD_NOT_USED. No ratio convention or erratum
   has been invented. Applying the unqualified literal as a multiplier
   would give amplitude `1/A`, conflicting with the target amplitude A
   except when A=1. Blocks 5/12 and the block 23 summary suffice for all
   nine solutions, so the quarantined paragraph does not block them.

4. Source 64 is an identity task: `sin(x+pi/2)=cos x`. No transformation
   is required from the specified starting graph. A single left shift
   pi/2 of cosine instead gives `-sin x`. Identity, full-period shifts,
   and valid cancelling chains must not be rejected merely because the
   formula is written with sine.

5. Sources 60-67 do not prescribe a unique chain or minimal order.
   Period-equivalent translations remain valid. Horizontal translation
   and scaling cannot simply be swapped with the same displacement.
   For 60, right pi/4 after x-factor 1/2 is equivalent to right pi/2
   before it. For 66, right 2/3 after x-factor 1/3 is equivalent to
   right 2 before it. Vertical scaling commutes with these horizontal
   operations. The frozen solutions retain these alternatives.

6. Source 67 has both a frequency/phase task and a sine/cosine conversion:
   `(1/2)*sin(2x+5)=(1/2)*cos(2x+5-pi/2)`. After x-factor 1/2, the
   combined translation is right `pi/4-5/2`, equivalently left
   `5/2-pi/4`. Before that scaling it is right `pi/2-5`.
   An equally valid longer chain is cosine -> sine by right pi/2,
   x-factor 1/2, left 5/2, then y-factor 1/2. Merely scaling cosine
   and shifting left 5/2 produces the wrong trigonometric function.

7. Source 68 is a different response task: its own prose fixes four
   ordered maps and requests the resulting function. Intermediate
   functions are `cos(4x)`, `cos(4x-2)`, `5*cos(4x-2)` and finally
   `5*cos(4x-2)-3`. The composite point map is
   `(u,v)->(u/4+1/2,5v-3)`. Swapping the first two steps unchanged
   would produce phase -1/2; swapping the last two unchanged would
   produce vertical offset -15. Neither preserves the source task.

## Frozen Coverage Obligations

- 60: cosine-to-sine conversion together with horizontal factor 1/2.
- 61: horizontal factor 3, not a reciprocal coordinate factor.
- 62: cosine-to-sine conversion and vertical factor 4.
- 63: vertical factor 2/3.
- 64: equality with the original graph and identity/nonunique chains.
- 65: rightward displacement 3, with periodic equivalents allowed.
- 66: horizontal factor 1/3, phase/order-adjusted shift, vertical factor 2.
- 67: horizontal factor 1/2, cosine-to-sine phase, order-adjusted shift,
  vertical factor 1/2.
- 68: forward composition of all four ordered maps and resulting function.

The written task asks learners to produce transformations in 60-67 and a
function in 68; it does not explicitly require drawing a new diagram.
A later choice view can replace discovery/production with recognition.
That capacity loss must be recorded, but recognition is not an automatic
failure. The eventual visible-only review must establish actual mathematical
judgment, complete coverage, fidelity, redundancy and leakage before any key
comparison. No such judgment is claimed at Stage 1.

## Zero-Image And Execution Ledger

Seed `figures`: 0. Seed exercise `figure_ids`: 0. Modern exercise
`figure_refs`: 0. Modern exercise `figures`: 0. Images opened: 0.
Decodes: 0. Screenshots: 0. Diagrams generated: 0.
Lesson figure metadata/captions were encountered as JSON text only.

The complete allowed seed, modern lesson and modern exercises were read.
Worked examples encountered in the complete lesson were not selected as
definitions, used as answer authority, or accompanied by asset access.
The only local Python helper verifies hashes, source/group associations
and empty figure arrays; it executes no mathematical proof. Its actual
cwd/argv/exit/output are recorded in `stage1-execution.json`.

An initial `rg --files` inventory of the owned reviewer directory returned
exit 2 because it did not yet exist. `apply_patch` created only that owned
directory's files. This was a technical inventory result, not a semantic
failure. No other worker's files were changed or reverted.

Network, installation, bootstrap, freshness checks, DB, publication, app,
Git, spawn and messages: all zero.

## Release Boundary

Stage 1 only. The source solutions, group binding and this finding record
are frozen before any candidate access. Their byte bindings and source
input bindings are in the self-excluded `STAGE1-MANIFEST.json`.
Remain OPEN for parent intake. Stage 2 may begin only after explicit
release and receipt of the parent's visible-only projection. Do not locate
or produce that projection, access candidates, or self-advance.
