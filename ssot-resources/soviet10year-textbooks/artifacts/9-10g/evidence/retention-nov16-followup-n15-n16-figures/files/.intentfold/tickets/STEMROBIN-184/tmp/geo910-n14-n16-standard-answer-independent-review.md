# STEMROBIN-184: NEW Standard-Answer Prose Comparison, n14/n15/n16

Date: 2026-11-16. Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

This is a new display-prose comparison ONLY for exercises 153-167, using the approved independent mathematical reviews and derived precursors as frozen authority. It does not repeat the original full solves, source gates, or historical access audits. The subsequent coordinating instruction, issued under ticket authority, additionally authorizes a disjoint source/current-image comparison for fig60/61 and creation of their `review@1` records only if the figure review passes. It is not represented as a direct new message from the human.

Only this report and, conditionally, those two review records may be written. Other workers' files are not edited. Choices, interaction, answer boxes, other chats/history, original lesson/fullsolve files, source pipelines, formal preparation/finalization, DB, Git, application and dependency operations are excluded.

## Figure Source-Pixel Freeze

This section was written after the original60/original61 image opens and BEFORE reading fig60's spec, the current images, or the figure author's report. It precedes rereading fig61's spec.

Important access qualification: fig61's spec and render JSON had already been read under the first prose-comparison instruction, before the additional figure-review instruction. Thus fig61 is NOT certified as zero-prior-spec-exposure. The pixel inventory below is an actual subsequent original-image observation, not an inventory copied from that spec. Fig60 has no such prior spec exposure in this invocation.

### Original60

Path: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-60.png`.

SHA-256: `aae24ebf204aa8bbe9d0e7db308e94ae36e8bc15215fd511aeaf8d399c435ccb`. PNG dimensions: 562 x 417.

Five marked points: upper-left `M_1`, lower-left `N_1`, central `O`, upper-right `N`, and lower-right `M`. There is one solid left connector `M_1N_1`, one solid right connector `NM`, a straight-looking diagonal chain `M_1-O-M`, and a transverse straight-looking chain `N_1-O-N`. Both central chains have a marked point at their crossing. All five points lie inside one irregular closed plane patch; alpha is at its lower-left interior. No `M_1N` or `N_1M` side is present. No dash, arrowhead, right-angle marker, length tick, scale, or numeric metric is visible. Small isolated specks have no assigned mathematical meaning. Midpoint/equal-distance claims must come from the edition text, not scan measurements.

### Original61

Path: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-61.png`.

SHA-256: `18b2c7ab86e489cbb6b002382e324de5f84633c3ed0ea0399e3a5555f2287830`. PNG dimensions: 541 x 486.

Four named marked points: `M,N` above the patch, `M_1,N_1` below it. Three additional unnamed dots occur on the first, second, and right-hand through-carriers at the plane. The upper `MN` connector slopes downward to the right on screen; the connector joining the first two unnamed plane dots also slopes down-right, more shallowly; the lower `M_1N_1` connector is approximately horizontal. The `MM_1` span is visibly longer than `NN_1`; no common-height or congruent-span claim follows. Each of the three through-carriers is solid above its plane dot, dashed behind the patch down to its lower outline, and solid below that outline. The right-hand carrier has an upper direction label whose fine glyph is not optically resolved as a Unicode identity here; the written exercise calls it `l`. It has no marked endpoints or arrowheads. One irregular closed plane patch contains the three unnamed dots; alpha is in its left/lower interior. No `O`, perpendicular marker, length tick, numeric value, or grid is present. Parallel direction and segment bisection are written premises, not measured pixel facts; perpendicularity is not given.

New image loads at this freeze: 2. Original60 and original61 each opened once, at original detail; no crops or reopens.

## Prose Comparison: Findings

The bound draft is NOT ready for an unqualified display-prose PASS. The answer conclusions and request coverage mostly agree with the frozen authority, but the following wording and learner-facing proof issues require attention. No source/prose correction is made by this reviewer.

### P2: 153(4) Must Count Unoriented Parallel Classes, Not Oriented Directions

Candidate: `geo910-n14-n16-standard-answer-prose.json`, line 11, `/lessons/geo910-c1-s2-n14/0/displayAnswer`.

The phrases "只有两个不同的非零方向" and "有三个不同的非零方向" omit the frozen distinction between unoriented generator directions and same/opposite ray directions. Two nonzero projected generators that are parallel but opposite, together with a third nonparallel generator, still give a parallelogram. Counting the opposite directions separately can incorrectly trigger the stated hexagon branch, particularly beside n16's oriented-direction vocabulary.

The authority explicitly includes one zero generator OR two nonzero parallel generators, including oppositely directed generators, in the parallelogram branch. The hexagon branch requires all three generators nonzero and pairwise nonparallel. Express those exact alternatives, or explicitly say that parallel and opposite projected directions belong to one unoriented class. Do not impose an additional general-position or same-orientation assumption.

### P2: Proof Vocabulary Is Not Adequately Scaffolded for the Learner

Candidates: 160 line 41; 162 line 49; 164 line 59; also the algebraic supplements in 157 line 27, 165 line 63, 166 line 67, and 167 line 71.

The frozen precursors legitimately use author-level vector machinery. That does not automatically make it a self-contained student explanation. The main proof of 160 introduces a unit normal, a normal/tangential vector decomposition, point/vector subtraction, and a squared vector norm without explaining the machinery. Both requested proofs in 162 use a parametric line and a normal equation of a plane. The exclusion proofs in 164/165 rely on "线性无关" without explaining how noncoplanarity supplies the needed geometric exclusion; 166/167 invoke direction vectors and scalar multiples.

These expressions are mathematically consistent with the frozen authority, not wrong proofs. The grade-suitability concern is transferring unintroduced proof prerequisites into the learner-facing standard answer. Supply elementary midpoint/parallelism/geometric reasoning as the main route, or explicit prerequisite scaffolding; an optional algebraic supplement can remain. 157 already gives an elementary explanation before its supplement. This is a judgment of the supplied answers' self-contained explanation, not a claim that an unread earlier curriculum contains no vectors.

### P3: 158(2) "返回原点" Is Ambiguous Mathematical Chinese

Candidate: line 31, `/lessons/geo910-c1-s2-n14/5/displayAnswer`.

The intended statement is that the inverse returns each image to its own original point. "原点" also conventionally means the coordinate origin and could be read as a constant output, contradicting the adjacent identity formula. Use "返回原来的点" or equivalent. The formula and image-domain qualification themselves are correct.

## Complete Request Ledger

The candidate contains exactly the expected 15 exercise records, in order 153-167, allocated 6/5/4 to n14/n15/n16. All current written prompts were read. Coverage is 33 printed request units, including the five single requests, and 38 semantic leaves after expanding 155's four vertices and 156's three object types. Internal case alternatives were compared as well; a matching count alone is not the evidence.

| Exercise | Printed / semantic | Comparison with current prompt and frozen authority |
| --- | --- | --- |
| 153 | 4 / 4 | Triangle and trapezoid both retain nonzero-segment degeneracy and their nondegenerate image class; a genuine planar figure is not reduced to a point. Trapezoid convention is not tightened. Tetrahedron: triangular/quadrilateral convex hull, including interior, edge and coincident fourth projection. Parallelepiped: correct top-level parallelogram/centrally symmetric hexagon alternatives, but the full orientation-sensitive degeneracy condition needs the P2 repair above. Whole solid/full surface is separated from the six-edge/twelve-edge frame. No genuine 3D whole-solid segment/point collapse, cube, normal projection, or generic-position assumption. |
| 154 | 1 / 1 | Not a transformation: two distinct points of one projection fiber have the same image. Uses injectivity, not a new onto requirement. |
| 155 | 1 / 4 | All four vertices explicitly covered. A fixed; B,C,D constructed separately on opposite rays with equal distances and midpoint verification. No zero-length construction at A. |
| 156 | 1 / 3 | Exactly the center point, all and only lines through it, all and only planes through it. Setwise invariance is not pointwise fixation. "一般" in the last sentence is weaker than necessary, but does not assert an extra fixed noncenter point. |
| 157 | 2 / 2 | Same symmetry is its own inverse; same-center composition is E, center included. Global inverse justified by this particular involution, not generic injectivity. Elementary explanation is present. |
| 158 | 2 / 2 | Correct rightmost-first composition. E after f gives f. Inverse on f(S) after f gives E on the entire original space. Explicitly refuses to infer onto or call an image-domain inverse a global spatial inverse without the additional condition. Agrees with current corrected `/prose/19`; terminology finding above remains. |
| 159 | 1 / 1 | Equal images imply zero original distance and equal original points. Yes under the actual injective-transformation definition; does not assume every transformation onto. |
| 160 | 2 / 2 | Text: unique transversal construction; plane points fixed; involution gives injectivity and onto for this particular map. Isometry iff perpendicular; oblique normal difference changes length and the explicit counterexample agrees. Contained-line direction makes the off-plane construction undefined. Disjoint-parallel/zero-direction data are outside the stated genuine intersecting-line premise, not extra valid answers. No image-only perpendicularity. Figure comparison initially pending; the later authorized current PNG is handled separately below. Grade finding remains. |
| 161 | 3 / 3 | All yes. Coincident lines, contained line-plane and coincident planes explicitly retained. Full line/plane images, coplanarity and incidence prevent treating skew lines as parallel. No strictly-disjoint-only convention is added. |
| 162 | 2 / 2 | Both requested proofs preserve the direction span/normal. Center on line or in plane gives coincident image, counted as parallel. Off-object centers give distinct parallel images. No extra metric assumption. Grade finding remains. |
| 163 | 7 / 7 | All seven counts AND complete center loci retained: midpoint including singleton; line; plane; distinct parallel planes' midplane or coincident plane; distinct intersecting planes' intersection line or broad coincident-plane reading; proper line-plane intersection point or contained-line plane; disjoint parallel line-plane has no centers or contained-line plane. Entire unions, not selected components or points, are tested for invariance. No perpendicularity or invented halfway center. |
| 164 | 2 / 2 | All six distinct pairs excluded from both relations for a genuine tetrahedron, with no regularity/orthogonality premise. Self-comparison explicitly separated. Grade finding remains. |
| 165 | 2 / 2 | All 28 unordered distinct pairs accounted for: same pairs AD/BC, AD/A1D1, BC/A1D1, AA1/BB1; opposite pairs AA1/C1C and BB1/C1C; remaining 22 neither. Ordered direction list matches u,v,w,v,-u-w,w,-w,v. Literal C1D is not replaced by C1D1; general oblique parallelepiped explicitly allowed. Grade finding remains. |
| 166 | 2 / 2 | Correct nontransitivity witness and positive-ratio proof for two rays opposite a third. Distinct first/third rays asserted, though their separate origins could be made more explicit. Origin/support coincidence does not change the result. Zero directions cannot be valid rays, not an omitted in-premise case. |
| 167 | 1 / 1 | Negative proportionality gives opposition. Distinct parallel supports: disjoint rays. Coincident supports: positive-order A<C gives closed nonzero segment AC; A=C gives singleton; A>C gives empty. Skew/nonparallel crossing supports excluded; same ray or ray-shaped intersection cannot arise. No origin ordering or mandatory intersection invented. Genuine ray notation already excludes A=B, C=D or M=N. Grade finding remains. |

## Chinese and KaTeX Scope

Read-only standard-library checks parsed the JSON and verified all 15 ordered unique records, balanced inline math delimiters, and balanced braces. Manual syntax review found the standard commands `\circ`, `\alpha`, `\perp`, `\ne`, `\sqrt`, `\cdot`, and `\overrightarrow`; subscripts, exponents and `\sqrt5` are syntactically ordinary. No demonstrated KaTeX syntax defect was found.

This is a static text/syntax finding, NOT a KaTeX runtime, HTML rendering, mobile layout, assembled lesson or application PASS. No application/dependency code or render engine was invoked. Chinese terminology precision and unexplained proof apparatus have the findings above.

## Bound Prose Inputs

Paths in this section are relative to the absolute workspace stated at the top. Hashes bind complete raw files, not just selected strings.

| File | Observed SHA-256 | Status / reading scope |
| --- | --- | --- |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n14-math-independent-review.md` | `05fef5b7ec1db4ebe6ee94966f279a9c713bad08bfbfead54f945b261b01e86a` | Frozen approved review, complete read; inherited qualifications remain. |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-n16-math-independent-review.md` | `427c44a87b366b57d1a683513b9334dec3d8a4a85d86e786edbd3123f4e3f858` | Frozen approved review, complete read; inherited qualifications remain. |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n14-derived-answer-precursor.json` | `6edd3e7ca1c9d1dd291e7f8dbf3d177da8b5e846e6972265eaa318e0656a601d` | Frozen approved mathematical precursor; complete read. Its historic author status is not edited. |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n15-n16-derived-answer-precursor.json` | `bc41d4039e9b49e563cf01d3adc4a9f43a524f9434a0ba2a037f8307918fb384` | Frozen approved mathematical precursor; complete read. Its historic author status is not edited. |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n14-n16-standard-answer-prose.json` | `b66a858c74974ef73437757ea7e95aa005782b35c44211184b9af2743225f55f` | `draft_for_independent_display_comparison`; complete read, findings apply to these bytes. |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n14/exercises.template.json` | `fd93d0075f2c6d21d092ba87323b2db8141db1c7307984ae7c8cd8fff1f64dd3` | Draft; all six current written prompts and figure refs read. |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n15/exercises.template.json` | `8c24be15a1a878d3946937f78649aa6f98c7835b0edadd556064a23cabd0445d` | Draft; all five current written prompts and figure refs read. |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n16/exercises.template.json` | `158ffe88994d67c6ffc40b072c20d71af37da479ed4603be24e1ddd50ec41bdc` | Draft; all four current written prompts and figure refs read. |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n14/lesson.template.json` | `8c6216fbf488f5fa3337c205b23a282015b43b081d3e203a7843ea3e2e63cddd` | Draft; selected corrected inverse paragraph at `/prose/19` read, not the whole lesson. Index 19 is the twentieth object, source ref p0057#2. |

The exact UTF-8 text hash of corrected `/prose/19/text` is `4e7d991852a69d42565fd9ef36e69aa0ec03b4f1748d4947da7e50f16d02d238`. A lookup initially exposed adjacent `/prose/18`, the point/set-image notation paragraph; this was not an inverse correction and was not substituted as one.

## Additional Figure Comparison

Status at source-pixel freeze: CURRENT-IMAGE COMPARISON PENDING, not yet a figure PASS. Review records have not been written.

The first instruction's `preview.png` was absent. The subsequent ticket-authorized coordinating instruction identified `fig-61.png` as the current preview and authorized original/current60 as an additional pair. The corrected path is used; no figure is marked passing on spec/render presence alone.

The only authorized browser mode is headless/background. No headed browser, Chrome activation, user profile, CDP, OS input or assembled acceptance operation has been run by this reviewer. The author report and full surface limitations will be compared after this pixel freeze.

## Figure Comparison Completion

The preceding pending statement records the earlier source-pixel-freeze checkpoint. The comparison is now complete: **fig60 and fig61 PASS for source/current-image fidelity and the declared/native 640 px surface ONLY**. Exercise 160's image comparison is no longer pending. Its first-candidate prose findings remain unchanged.

Original60, original61, current60 and current61 were each opened exactly once at original detail. Total new image loads: **4/8 batch, 4/24 context**. There were no crops, reopens, screenshots, extra images or returned image payloads. No browser was run.

### Fig60

Current PNG: `.tmp/s10y-image/9-10g/fig-60/fig-60.png`, 640 x 460.

All five named dots, the two crossing chains through O, both outer connections, and the shared alpha patch match the frozen source inventory. The repaired M1 and N labels are clearly separated from the border; no remaining visible text/point/edge collision or clipping was found in the native PNG. There are no added arrows, dashes, perpendicularity or numerical metrics. Latin point labels and mathematical alpha have no cultural leakage.

The spec contains both complete opposite pairs in `centralSymmetry`, collinearity and midpoint assertions, the corresponding length/parallel assertions, four `connects` assertions, and point/alpha containment assertions. Its clean paired border is explicitly a nonmetric modern patch, not a claim that the finite original outline was centrally symmetric. The two `authoritativeText` strings exactly match current n15 `/prose/0` and `/prose/1`.

### Fig61

Current PNG: `.tmp/s10y-image/9-10g/fig-61/fig-61.png`, 640 x 560.

All four named points, three unnamed plane dots, upper/middle/lower transverse connections, and all three solid/dashed/solid spans match the frozen source inventory. The repaired solid middle connector is present. The first span remains longer than the second; upper and lower transverse directions are not made parallel. The right direction line retains its unnamed intersection dot and hidden portion. There is no new O, equal-height condition, right-angle box, grid, tick, or classification answer.

Script ell is a declared modern rendering of the text's direction label, not a retrospective optical decoding of the original glyph. Labels are legible and no collision/clipping was found at native 640 px. The spec maps all seven points to group-local relationship assertions, includes both midpoint/parallel conditions, all twelve `connects` assertions, and containment of plane dots/alpha. Its full authoritative exercise160 string exactly matches the current written template.

### Width and Acceptance Limits

Both current render reports say `pass`, declare 640 px, and report minimum text 28 px against the required 16 px. Current source/spec/SVG hashes were independently checked, and the authorized `record_review.py` invocation validated the rendered specs and current output bindings before writing each record. No renderer was rerun.

The author report was read AFTER the pixel freeze. It discloses a headed local-Chrome figure-only fragment, not an assembled lesson. That headed operation was not authorized by the current browser restriction, is not repeated, and is NOT accepted as user-approved headed acceptance. Its reported prose/exercise media widths of 660/640 px and container/scroll measurements remain **author-reported limited-fragment facts**, not this reviewer's actual product measurements.

The declared conservative 640 px is accepted for this scoped figure review under the coordinating instruction. Actual assembled media width, full offline lesson/product placement, mobile scroll reach, and accent/print themes remain unverified until the integrator's offline check. Neither the author fragment nor these `review@1` passes authorize promotion or resolve a later assembled-width issue. A change to source/spec/render/output invalidates the bound figure review. The prior-spec-exposure qualification for fig61 remains explicit.

### Figure Bindings and Recorded Outputs

| File | Observed SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n15/lesson.template.json` | `a089ee985c5f397f2d48ca1fe5acc5aaebf5f4346e8089ee71b4d5e79d8bd171` |
| `.tmp/s10y-image/9-10g/fig-60-61.author-report.md` | `be76b0fd96ab3b68080dc16ab01f22b5bd9b5586439bb2ef1c6333cfca4d2722` |
| `.tmp/s10y-image/9-10g/fig-60/spec.json` | `2b9000b90b878758827543d9e4333d1f0f1873fe78fd259e05b8a9e4b5ae33c2` |
| `.tmp/s10y-image/9-10g/fig-60/fig-60.render.json` | `42fa2b7c4ae082670b0c348a3139f988a45c609d9ceec0661e9370716ecba2c0` |
| `.tmp/s10y-image/9-10g/fig-60/fig-60.svg` | `f373916fd7871fbab87c3e32cc9ebf5b90a993309432dabd8736c65e5d5980db` |
| `.tmp/s10y-image/9-10g/fig-60/fig-60.png` | `c2355404bf32817529574c3bb6f2f44302bbf0b3984002f6a53fddfb5c438dce` |
| `.tmp/s10y-image/9-10g/fig-61/spec.json` | `d9b0786078fb12d7cd8d28f1297ed64727a985f2bec515b36eee7545af7efee1` |
| `.tmp/s10y-image/9-10g/fig-61/fig-61.render.json` | `046d4f620d12ee6c2c413261c30282f368273f102d28006fcbf7b47d6e19fb3e` |
| `.tmp/s10y-image/9-10g/fig-61/fig-61.svg` | `12931945b0b68256968b9893a0f0b6020661a59c92d812dbe744d29428b4343c` |
| `.tmp/s10y-image/9-10g/fig-61/fig-61.png` | `afd5a33307826a973605cd5a565a22867e617d35d773117a68d974bafc661c48` |
| `.tmp/s10y-image/9-10g/fig-60/fig-60.review.json` | `c01dcf0067466b6ef18d6c7c1deaf5297d6eb025c8550e6c46931b9777053ea3` |
| `.tmp/s10y-image/9-10g/fig-61/fig-61.review.json` | `4897cd6a047e40b8817d81ca889515e60d6ef1e54c91dbf1037bce62d0a8e8a2` |

Both review outputs have schema `ld-s10y-image/review@1`, status `pass`, and current source/spec/render/SVG bindings. Their notes bind the actual PNG preview hash, the restricted surface, pending assembled checks, and the fig61 exposure qualification. Existing files were not overwritten.

## First-Candidate Closure

The coordinating agent froze the initially reviewed candidate as:

`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n14-n16-standard-answer-prose-first.json`

Its observed SHA-256 is `b66a858c74974ef73437757ea7e95aa005782b35c44211184b9af2743225f55f`, exactly the original candidate binding above. The same-named current prose file has since received a targeted repair. This first report's mathematical findings and request comparison remain those of the frozen first candidate; they are NOT silently upgraded to pass. The new affected-explanation comparison belongs in a separate addendum.

This report is now complete. Its own hash is returned externally. Writes in this invocation are limited to this report and the two authorized figure review records; no source, candidate, spec, render, SVG or PNG was changed. Only the explicitly authorized figure recorder's rendered-spec validation was run; no original math gate, fullsolve, source pipeline, formal template preparation/finalization, application, dependency, DB, Git, browser or promotion operation was performed. Formal-template binding remains a later coordination step, not a new substantive review.
