# STEMROBIN-184: Fig-56 Independent StageB Review

Date: 2026-11-16 (Europe/Dublin).
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Figure 56 limited decision: **REVISE**.
Figure 55: **existing HOLD, not approved**; no new figure-55 gate.

This is the single authorized StageB inspection of the disclosed final
figure-56 package, against the accepted, unchanged independent StageA.
It is not a promotion review file, lesson binding, product acceptance,
answer review, or independent full mathematical re-solve.

## Finding

**56b reverses the frozen source's relative vertical order of feet C and A.**

The accepted StageA inventory records C as the highest projection foot on
screen, A between C and B, and B lowest. This was recorded from the original
pixels before candidate disclosure. The final candidate instead has:

| Point ID | Candidate User Coordinates | Recorded SVG-Screen Endpoint |
| --- | --- | --- |
| `f56-b-A` | `[170, 140]` | `[170, 660]` |
| `f56-b-C` | `[425, 135]` | `[425, 665]` |
| `f56-b-B` | `[305, 75]` | `[305, 725]` |

Thus C is 5 px below A, not above it. Both actual full neutral and full print
views show this near-level A/C configuration. The quoted screen coordinates
are already recorded in the disclosed probe, not independently solved
geometry. The mobile-end view shows C but clips A by the intended scroll
viewport, so it alone cannot establish the A/C comparison.

This is a source-sample relative-position mismatch, not a claim that the
question's projection mathematics or all possible configurations require C
above A. The review does not demand source-fitted lengths, angles, or exact
raster coordinates. Regularized plane outlines, typography and vertical
panel layout are declared modern additions; they do not establish that this
reversed source point order matches the frozen inventory.

All 13 assertions address connectors, foot containment, and within-panel
parallelism. None verifies the frozen C-above-A source order. Their success,
and the matching point count, therefore do not resolve this source-fidelity
finding. The figure-56 decision is limited REVISE for the disclosed bytes,
not a request to alter source text, add an answer, restart a pipeline, or
perform a repair in this invocation.

## Input Hash Binding

All values are SHA-256 of full raw file bytes. Candidate and author-package
hashes were directly read and checked against the explicit disclosure.
Full approved lesson/exercise hashes and both contexts were also checked.
Original PNG hashes are carried from the accepted StageA; neither original
image was reopened in StageB.

| Input | Absolute Path | SHA-256 |
| --- | --- | --- |
| Accepted StageA | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/geo910-t14-fig55-56-independent-source-first.md` | `bf514eee00b056fcb9f96e8d9f96bfbd6bece7715b685ddc5504bedc28481a04` |
| Final full author report | `/Users/yong/.codex/worktrees/a07e/lemmadeck/tmp/geo910-t14-fig55-56-author.md` | `a37383571d30f2d0cf314986430d17334ce0989ed39d313a0f693747be38f58d` |
| Final full author manifest | `/Users/yong/.codex/worktrees/a07e/lemmadeck/tmp/geo910-t14-fig55-56-author.manifest.json` | `eaf24fa870693568ec10c898e32baba5403e62c7b2f1a5bfe1440de2c19143aa` |
| Full approved lesson JSON | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-t14/lesson.json` | `1d3aba91bb9d4bc7afef929bc13c504deb280504b293dfb5b5457ff6d11c59ef` |
| Full approved exercises JSON | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-t14/exercises.json` | `4fe2de5b67d42e63ceb422b8da1d6d47dc68071de1cfca348ba1fe987d09b16f` |
| Fig-55 context | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-55/context.json` | `b5a9e30a78fc7444c8c71720118db94ee52ea6cc2c6eb0a33e6b2910d924661a` |
| Fig-56 context | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-56/context.json` | `e9a36dc98abe5fa24c9703b67215b8a6b7eee7029288803f3ce29cffb3d066a0` |
| Fig-56 original PNG, retained StageA binding | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-56.png` | `18b6d23fc5f1cdcb5d6b233929a956854fa501315873dab8c056b70459821c93` |
| Fig-55 original PNG, retained StageA binding only | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-55.png` | `6f203be966b1afd76d7937ac2784d2663361e831eac293503d3163265375ce2e` |
| Fig-56 final spec | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-56/spec.json` | `a85ca64b92f81d0df73dd42fd72d5201d3e44b8e7d5aa0524f9fc76612f212f6` |
| Fig-56 final SVG | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-56/figure.svg` | `5aecba3fe69bbb12d39fa8c6dc0299f485f74b800e0ad413097ed0afb20e7486` |
| Fig-56 final render report | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-56/figure.render.json` | `71f54353937a4a78b934ed6aaf49faa9bb1217fcb17f1c5a1a42c137d2956b67` |
| Fig-56 recorded probe | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-56/probe/attempt-02/metrics.json` | `4662bab0230e4fe5a02ea396c0f8b167e357fd31c229fb5d7a042749f843e589` |

The full report and full manifest bytes were read; the manifest was parsed
in full. The embedded current fig-56 spec, render and probe JSON equal their
directly read counterparts, and the embedded final report equals the raw
report text. Author provenance, inventory, coverage, labels, both attempt
records, sole repair record, file bindings and all 14 probe states were
examined. Large repeated snapshots were inspected through their structured
records; no extra image payload was opened.

## Approved Text Boundary

The full current lesson and all 32 current top-level exercise texts were
read. The final fig-56 spec's authoritative text exactly matches the current
lesson note and complete exercises 150 and 151. No punctuation, point
notation, premise, requested construction, or source text was edited.

Exercise 150 names two original points and their feet in alpha and asks for
the line/plane intersection. Exercise 151 gives noncollinear original
A_1/B_1/C_1 and their feet and asks for the plane/plane intersection line.
Neither question is replaced by a supplied construction or answer trace.

The sample is not proof of a universally finite intersection. Finite,
no-intersection, whole-object intersection, coincident-foot and
rank-deficient projection cases are not excluded by its drawn sample.
No new generic-position assumption, rank claim, case solution or answer
geometry was introduced by this review. Those cases were not independently
re-solved or required to be added as new figures.

Exercise-151 separator remains **UNKNOWN**, not decoded or drawn.
Fig-54 remains out of scope; no new fig-54 inspection was performed.

## Complete Fig-56 Inventory Comparison

Two source panels remain distinct, now vertically arranged: a above b
rather than side-by-side. All ten source points have visible filled dots.
Each panel has its own alpha label, closed solid rounded plane outline and
Latin panel marker. There is no shared frame, new axis, grid, tick, numerical
value, dimension, perpendicularity/equality mark or arrowhead.

| Independent StageA Requirement | Candidate Object(s) | Comparison |
| --- | --- | --- |
| `56a-A1`, `56a-A` | `f56-a-A_1`, `f56-a-A` | Both present; upper original above/left of its interior foot; correct names. |
| `56a-B1`, `56a-B` | `f56-a-B_1`, `f56-a-B` | Both present; upper original above/left of its interior foot; correct names. |
| `56a-project-A` | `f56-a-A1-A` | Solid finite A_1-A segment, ends at its dots, crosses back outline, no extension/arrow. |
| `56a-project-B` | `f56-a-B1-B` | Solid finite B_1-B segment, ends at its dots, crosses back outline, no extension/arrow. |
| 56a relative sample | Four a-panel point objects | B pair left of A pair; A_1 above B_1; A above B; connectors down/right and visually parallel. |
| 56a plane/labels | `f56-a-plane`, `f56-a-alpha`, `f56-a-panel-label` | Closed solid rounded cue; alpha left inside. Label placements/spacing are modern additions. |
| `56b-A1`, `56b-A` | `f56-b-A_1`, `f56-b-A` | Both present; original above/right of its interior foot. |
| `56b-B1`, `56b-B` | `f56-b-B_1`, `f56-b-B` | Both present; original above/right of its interior foot. |
| `56b-C1`, `56b-C` | `f56-b-C_1`, `f56-b-C` | Both present; original above/right of its interior foot. C/A foot order differs as reported above. |
| `56b-project-A` | `f56-b-A1-A` | Solid finite A_1-A connector with matching endpoints; crosses outline without dash/arrow. |
| `56b-project-B` | `f56-b-B1-B` | Solid finite B_1-B connector with matching endpoints; crosses outline without dash/arrow. |
| `56b-project-C` | `f56-b-C1-C` | Solid finite C_1-C connector with matching endpoints; crosses outline without dash/arrow. |
| 56b relative sample | Six b-panel point objects | Both x-orders A/B/C retained. Upper screen order A_1/C_1/B_1 retained; B remains lowest foot. C-above-A foot order NOT retained. |
| 56b plane/labels | `f56-b-plane`, `f56-b-alpha`, `f56-b-panel-label` | Rounded solid cue, alpha lower/right inside; labels legible and identities retained. |
| `56a-unsolved`, `56b-unsolved` | Complete object list and actual full views | No AB, A_1B_1, foot/original triangle edges, intersection point/line, separator, extended construction or answer trace. |

Plane outlines are unfilled 64-vertex rounded polygons: regularization,
not measured source ellipses or additional named vertices. Source contour
crossings remain unmarked and do not become geometric points.
Source labels have modern typography/subscripts and relocated placements;
the required identities, not archival glyph forms, are retained.

## All 13 Assertions

Each of the ten points is covered by its own within-panel connector
relationship. Both inventory groups declare `pointRelationships`; no
object-count assertion substitutes for coverage.

| Assertion ID | Type | Complete Referents |
| --- | --- | --- |
| `f56-a-A1-A-connects` | connects | `f56-a-A1-A`: `f56-a-A_1` to `f56-a-A` |
| `f56-a-A-inside-plane` | inside | `f56-a-A` in `f56-a-plane` |
| `f56-a-B1-B-connects` | connects | `f56-a-B1-B`: `f56-a-B_1` to `f56-a-B` |
| `f56-a-B-inside-plane` | inside | `f56-a-B` in `f56-a-plane` |
| `f56-a-B-projection-parallel` | parallel | A_1-A with B_1-B, all in a |
| `f56-b-A1-A-connects` | connects | `f56-b-A1-A`: `f56-b-A_1` to `f56-b-A` |
| `f56-b-A-inside-plane` | inside | `f56-b-A` in `f56-b-plane` |
| `f56-b-B1-B-connects` | connects | `f56-b-B1-B`: `f56-b-B_1` to `f56-b-B` |
| `f56-b-B-inside-plane` | inside | `f56-b-B` in `f56-b-plane` |
| `f56-b-B-projection-parallel` | parallel | A_1-A with B_1-B, all in b |
| `f56-b-C1-C-connects` | connects | `f56-b-C1-C`: `f56-b-C_1` to `f56-b-C` |
| `f56-b-C-inside-plane` | inside | `f56-b-C` in `f56-b-plane` |
| `f56-b-C-projection-parallel` | parallel | A_1-A with C_1-C, all in b |

Totals: 5 connects, 5 inside, 3 parallel. The `arrow` field of connects
references a segment here; it does not create an arrowhead. No assertion
requires a 3D intersection, measured length/angle, or universal rank.
No validation/assertion command was rerun by this reviewer.

## Existing Render And Probe Evidence

The final recorded draft validation and render exited 0. The render report
is `status: pass`: 21 objects, 14 labels, zero collisions, semantic CSS
variable roles, and minimum 20 px text at the declared 640 px media width.
This is successful recorded renderer evidence, not the overall source
comparison verdict.

The sole fig-56 repair changed only the two fixed south A-label gaps from
default 10 px to explicit 24 px after the first render's two marker
collisions. No reviewer repair, rerender, revalidation or reprobe occurred.

The probe records offline fixed-640 scroll-media evidence, explicitly not
headed-product acceptance. All 14 recorded states were examined:

| Recorded Theme | Container | Positions / Actual ScrollLeft | Maximum Scroll |
| --- | --- | --- | --- |
| neutral | 640 px | full: 0 | 0 |
| print | 640 px | full: 0 | 0 |
| neutral | 346 px | start: 0; middle: 147; end: 294 | 294 |
| print | 346 px | start: 0; middle: 147; end: 294 | 294 |
| neutral | 240 px | start: 0; middle: 200; end: 400 | 400 |
| print | 240 px | start: 0; middle: 200; end: 400 | 400 |

Every recorded state retains 640 x 800 media, 14 labels at post-CTM 20 px,
labels within the SVG canvas, ten existing visible SVG point markers,
five solid matching-endpoint connectors, and zero arrowheads/hatches.
Both measured ends reach their maxima. Page scroll widths remain 1440 px
on desktop and 390 px on mobile. The probe records zero errors, zero
network requests, and unchanged canonical before/after hashes.

SVG-visible is not a claim that all points/labels fit simultaneously in a
narrow scroll viewport. No 240 px or alternate mobile screenshot was
opened; their states are recorded measurements only.

## Actual Visual Inspection And Image Count

These three images were each directly opened once at `original` detail:

| Cumulative Reviewer Load | Absolute Image Path | Verified Raw SHA-256 |
| --- | --- | --- |
| 3 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-56/probe/attempt-02/desktop-neutral-640-full.png` | `7d2b0aaa8630c283c37d4eba2f2ee9846e04ae8b568b6f6f584273bb8ebc3d74` |
| 4 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-56/probe/attempt-02/desktop-print-640-full.png` | `47ef68600434ec69d2db6f9d0a6410f54761947cd518dad563dbb3583b5cbc30` |
| 5 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-56/probe/attempt-02/mobile-neutral-346-end.png` | `c371fad3d35a02c7f1d033ef76ef33d2b5f6af40283bdff6a1577f483a6e34d2` |

Both full views actually show all ten points, five solid finite connectors,
two alpha outlines and Latin a/b labels. They are nonblank, legible and
free of the previous A-label/marker collisions. Neutral ink and black
print remain clear on white; no cultural wording or answer geometry appears.
They also reveal the C/A source-order mismatch.

The 346 px end view shows the right-hand portions of both panels at
unchanged scale, including a-panel A_1/A and b-panel B_1/B and C_1/C.
The left portions are intentionally outside the viewport at that scroll
position. The right plane ends and shown labels are legible, not squeezed
to 346 px. The recorded maximum scroll is 294 px.

Actual reviewer image total: **5/8 for this batch, 5/24 for this context**:
two originals already opened once in StageA, plus exactly these three
StageB images. StageB new loads: 3. Source reopens: 0. Crops: 0.
Extra output views: 0. Fig-55 output image loads: 0.
The author's separate image ledger is not added to the reviewer's count.
No complete eight-image batch approval is claimed; no ninth image was read.

## Figure 55: Existing Disposition Only

The disclosed report/manifest record:

- Attempt 01 validation failed on three hatch-path `fill: "none"` values.
- The sole targeted fix omitted precisely those fill properties.
- Attempt 02 validation passed, but render failed with eight label-marker
  collisions: a-A, a-D, a-K, b-A, b-D, c-A, c-D, c-K.
- The single repair allowance was exhausted. The recorded probe did not run;
  no neutral full, print full or mobile-end fig-55 output views were produced.

Existing recorded fig-55 render hash:
`51c1f9409504c2fef372e11993c459b9aef605fea985c4a2d9ab493bcfa10698`.
Existing sole-fix record hash:
`b56bc3d73a6c5b429bf37f200e9c1303e8d2ba09536dae4343a0f6c2936a8cf2`.
These are disposition bindings read from the frozen author manifest,
not new independent fig-55 approvals or visual results.

**Fig-55 remains existing HOLD, not approved.** This review neither restarts
that HOLD nor grants another attempt, repair, visual gate, or candidate PASS.

## Action Boundary

Only this new absolute-path Markdown was written. The accepted StageA,
author package, candidates, source PNGs, contexts, approved text, answers
and choices were not modified. No shell/process command, pipeline, test,
browser/app operation, record_review, promotion, binding, finalization,
Git/database/backend operation or other-chat action was performed.
File reading/hashing and structured inspection used filesystem APIs only;
no recorded command or probe was executed.

Final limited decision for the exact disclosed fig-56 bytes: **REVISE**.
Fig-55 disposition: **existing HOLD, not approved**.
