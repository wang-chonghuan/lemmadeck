# Independent Modern Figure Review: Fig-11 Through Fig-14

Ticket: STEMROBIN-184.
Date: 2026-11-15.
Lesson: `geo68-c1-s5`.
Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Final Findings

**No concrete defects remain in the final CURRENT snapshots inspected below.** All four receive a bounded independent image-review PASS, tied exclusively to the final source/spec/SVG/render hashes recorded in this report.

| Figure | Current Independent Result | Current Renderer Result | Qualification |
|---|---|---|---|
| fig-11 | PASS | pass | Re-inspected after explicit CENTER placement repaired the ruler-value alignment and border intersection |
| fig-12 | PASS | pass | Re-inspected after the raw road-path coordinates were corrected; complete winding road is visible |
| fig-13 | PASS | pass | Original three-point order and full baseline preserved |
| fig-14 | PASS | pass | All three structures, 11 rods, 12 points, given lengths, closed third-panel loop and AC tail preserved |

The earlier fig-11 and fig-12 snapshots were independently found defective despite their renderer reports saying `pass`. Their rejection evidence and hashes are retained below. **Neither obsolete snapshot receives approval.**

These results are image-review results for the requested candidate files, not publication or completion of the entire promotion gate.

## Method and Scope

Read:

- `.agents/skills/ld-s10y-image/SKILL.md`
- `.agents/skills/ld-s10y-image/references/quality-gate.md`

First reopened the actual original PNGs, individually and in order, at:

```text
ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-11.png
ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-12.png
ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-13.png
ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-14.png
```

Independently inventoried those pixels before reading the modern specs. Then compared each figure's full `source.authoritativeText`, inventory, objects, assertions, actual SVG, render report, and preview.

Modern candidate files are under `.tmp/s10y-image/6-8g/fig-NN/`, named `fig-NN.spec.json`, `fig-NN.svg`, `fig-NN.render.json`, and `fig-NN.preview.png`.

Used the application's already-installed Playwright and already-installed Chromium, headless and offline, with requests blocked. Embedded the actual captured SVG bytes in an in-memory HTML document and measured its screen transform. Did not judge sizing solely from previews or source-canvas font declarations.

Viewed separate actual-SVG screenshots at every declared width and at full source-canvas width. Screenshots remained in memory; no screenshot, harness, pipeline, or figure file was written in the repository.

No standard answers, author solutions, choice drafts, database, environment files, external network, model services, or installation were accessed. No resource or pipeline edits were made. This is separate from the earlier transcription review.

## Independent Source Inventory

### Fig-11

Two source panels:

- Left: one framed ruler with exactly eight equally spaced ticks and values **0,1,2,3,4,5,6,7**, letters above the top edge, numbers underneath their ticks. A is at 0, B at 2, C at 5. No unit, additional scale value, or derived measurement is printed. The source frame's right end is irregular.
- Right: triangle ABC with A lower-left, B above the base and horizontally between A and C, and C lower-right. All three edges and endpoint marks are present. No side lengths, equality marks, or right-angle marks.
- Two source panel tags, modernized as `(a)` and `(b)`.

The original unmeasured triangle pose and irregular frame do not establish further mathematical givens. Their regularization is distinguished from the source's exact ruler scale.

### Fig-12

One shared frame:

- A winding road starts at a lower left tail, rises to a left crest, crosses the horizontal baseline at A, dips below it, rises through B, reaches D at the upper crest between B and C, crosses downward through C, and ends in a lower right tail.
- A, B, C lie on the same horizontal baseline, in that order. D is above the baseline, horizontally between B and C, and lies on the road.
- Road-travel order is **A -> B -> D -> C**.
- All four labeled point marks are present. The baseline extends left of A and right of C.
- No lengths, arrows, numbers, axis labels, ticks, or grid.

### Fig-13

One straight horizontal stroke extends beyond both outer points. Three distinct point marks and labels occur in left-to-right order **A -> B -> C**. No ruler, numerical length, arrow, equality mark, or extra point is printed.

### Fig-14

Three separate hinged-rod panels:

| Source Panel | Source Points and Arrangement | All Source Rods and Printed Lengths |
|---|---|---|
| Left | A lower-left, C lower-right joint, B above/right of C; open two-rod structure | AC=5, CB=3 |
| Middle | A lower-left, C upper-left, B upper-right, D lower-right; closed A-C-B-D-A outline | AC=5, CB=3, BD=2, DA=7 |
| Right | A below C on a tail; C lower-left, D upper-left, B upper-right, E lower-right; closed C-D-B-E-C outline | AC=2, CD=3, DB=3, BE=3, EC=6 |

Totals: **three panels, 12 labeled points, 11 rods, 11 given-length labels**. In particular, the third panel is not an open chain: **EC=6 closes the loop**, and **AC=2 remains attached as a tail**.

Source mechanical ring joints are visible at several connections. The modern specs explicitly simplify these to point dots while preserving the connections. The source contains no AB rod, AB length label, or extrema construction.

## Authoritative Context Comparison

Read every entry in each spec's `source.authoritativeText`, not only the description:

- Fig-11: the lesson contrasts collinear betweenness and the distance-sum definition in panel (a) with three noncollinear points in panel (b). Both panels and their labels are necessary.
- Fig-12: the lesson contrasts everyday road-travel betweenness, B between A and D and D between B and C along the route, with geometric betweenness. The road and off-baseline D cannot be omitted.
- Fig-13: the complete original exercise 44 gives six equalities/inequalities about the three collinear points. The figure supplies order, not a marked numerical solution. No inequality was annotated as correct or incorrect.
- Fig-14: the complete original exercise 47 asks students about maximum/minimum AB separation for all three hinged structures and intermediate separations. The figure must preserve every given rod, not draw an answer configuration.

No answer key was consulted and no extrema answer was computed or printed. Incidental regularization of unmeasured triangle/point spacing was not promoted to an extra printed equality or given length.

## Final Current Figure Checks

### Fig-11: PASS

- Both panels, all eight ruler ticks and values, A=0/B=2/C=5, all three triangle edges, six labeled points, and both English panel tags are visible.
- The final spec adds only eight `labelPlacement: {"position":"CENTER","gap":0}` entries, one for each ruler value. A field-by-field comparison against the rejected spec found no other changed fields. Source coordinates, values, canvas, ticks, and assertions are unchanged.
- In the final actual SVG, each numeric label has `text-anchor="middle"` and an x-coordinate exactly equal to its corresponding tick's x-coordinate. All eight x-differences are **0**.
- At 640px, the right side of the 7-label bounding box is about **244.794px**, while the frame's right border is at **255.385px**: approximately **10.591px** clearance.
- At full 1040px, the same clearance is **17.211px**.
- All ruler numbers are fully below the ticks and inside the frame. No label-label collision, frame intersection, canvas clipping, extra measurement, or answer annotation remains.
- The triangle remains noncollinear, with labels clear of its edges.

### Fig-12: PASS, CURRENT Corrected Road Only

- The final spec's road path uses coordinates divided by 100, and the actual SVG's existing `scale(100 100)` transforms them to the intended canvas positions.
- At full 560px, the complete road's browser-measured bounds are approximately **x=20..520, y=97.803..295**, within the 560x320 canvas.
- The curve passes through A, B, D, and C in route order. Sampling the actual transformed SVG path independently found point-to-path distances below **0.064px** at full resolution and increasing path positions in order **A, B, D, C**.
- A/B/C stay on the horizontal baseline. D is above it at the B-C crest. The left crest, A-B trough, B-D-C hump, both tails, and extended baseline are all visible at every declared width.
- No point floats away from the road, and no formula, road arrow, distance, answer, or Cyrillic label was added.
- All four labels are readable and do not collide with the road, baseline, or each other.

### Fig-13: PASS

- A/B/C and all three dots are visible in the source order on one straight baseline; the stroke extends beyond A and C.
- No tick, length, equality marker, additional point, or answer annotation was added.
- All three labels remain separated from the baseline and within the SVG at every declared width.
- The spec explicitly identifies the unmeasured spacing as regularized, not an original midpoint or length given.

### Fig-14: PASS

- All three panels remain distinct, with English `(a)`, `(b)`, `(c)` tags.
- All 12 point dots and labels, all 11 rods, and all 11 given-length labels are visible at both 640px and full 1360px.
- The third panel visibly closes **C-D-B-E-C**, including the horizontal CE rod and its 6 label, and retains the downward AC tail with its 2 label.
- No AB segment, extremum value, extra diagonal, construction overlay, or answer annotation occurs.
- Independently recomputed every given rod length from spec coordinates, then independently checked actual SVG segment lengths using its isotropic canvas scale. Maximum absolute deviation from a source given is below **4e-15** in diagram units.

| Panel | Rod | Source Given | Independent Spec / Actual SVG Check |
|---|---|---:|---|
| (a) | AC | 5 | Match |
| (a) | CB | 3 | Match |
| (b) | AC | 5 | Match |
| (b) | CB | 3 | Match |
| (b) | BD | 2 | Match |
| (b) | DA | 7 | Match |
| (c) | AC | 2 | Match |
| (c) | CD | 3 | Match |
| (c) | DB | 3 | Match |
| (c) | BE | 3 | Match |
| (c) | EC | 6 | Match |

Every source rod maps to the corresponding point endpoints and distance/connects assertions. The inventory object IDs and assertion IDs resolve for all four figures.

## Actual SVG Width and Readability Evidence

Measured font size as computed SVG font size multiplied by its actual screen-transform scale. Results are screen pixels, not unscaled canvas font sizes.

| Figure | Declared Media Widths | Actual Minimum Text at Those Widths | Full Canvas Check |
|---|---|---|---|
| fig-11 | 640 | 17.2298px | 1040px width; 28px text |
| fig-12 | 280,310,343,358,560 | 16,17.7141,19.6,20.4563,32px | 560px width; 32px text |
| fig-13 | 280,310,343,358,560 | 16,17.7141,19.6,20.4563,32px | 560px width; 32px text |
| fig-14 | 640 | 16.9406px | 1360px width; 36px text |

All meet the declared **>=16px** minimum. Inspected all these actual-SVG views, separately, in addition to the full-resolution previews. Final snapshots have no visible clipping or label collision.

For scroll figures 11 and 14, tested fixed 640px media inside a 280px horizontal-scroll container: scroll width 640, client width 280, maximum scrollLeft 360. Both reached the end, with the far-right C/E label fully visible. This checks the requested media sizing, not an assumption that the large source canvas is the display width.

Visible text uses English mathematical point labels, numeric givens, and English panel tags. No Cyrillic, Chinese visible label, cultural decoration, or answer annotation appears.

Verified semantic-variable recoloring with white paper and neutral ink, accent ink, and black print ink. Visible text and strokes adopt the requested variables. Hidden JSXGraph helper elements are not counted as visible figure content.

## Rejected Snapshots: Concrete Defects Preserved

### Earlier Fig-11: FAIL, Superseded

The earlier actual SVG used default text placement for ruler values. Each value's center was about **20.389px to the right of its tick** at full 1040px, approximately **12.55px** at 640px. In particular, the 7-label bounding box spanned approximately **402.600..418.178px**, while the right frame border was at **415px**. The glyph and border visibly intersected at both inspected sizes.

The renderer nevertheless reported `collisions: []` and `status: pass`. A label-label check did not detect this label-frame problem. Rejected this snapshot independently; did not change its figure files.

After the user supplied the explicit CENTER repair and a coherent fresh render, reloaded and re-inspected the current spec, SVG, render report, preview, both display sizes, and hashes. The defect is resolved only for the final current tuple.

```text
REJECTED fig-11 spec SHA-256:
1e1e0cd2ffcf9a19861cce80147005ba060cc305434b0ecce806866cad01f856
REJECTED fig-11 SVG SHA-256:
13aa403873e158d0c8cde162bc8fd1ce470833c5ac45671bf2c08efa828250ce
REJECTED fig-11 render SHA-256:
c93534501df73226489e88bad728c4c68c0f2a6003d33ecbefc002531c3f796e
REJECTED fig-11 preview SHA-256:
4944c6a52ee197a1f152522981e58ef648d80021747ecdc1134ededfdd611216
```

### Earlier Fig-12: FAIL, Superseded

The earlier raw road path began `M20 205 ...` despite residing in a group with `transform="scale(100 100)"`. Its leftmost screen x-coordinate was 2000px at a 560px canvas width; the whole road was outside the canvas. Actual SVG inspection at all five widths and the preview showed only the baseline and four dots, with D floating above it. This defeated the authoritative road-travel context.

The renderer nevertheless reported `status: pass`. Rejected this snapshot independently.

After the user supplied the divided-by-100 path and a fresh render, reloaded all current fig-12 files and re-inspected the complete road at all five declared widths. Source PNG and authoritative context remain unchanged. The rejection is not transferred to the corrected snapshot, and the final PASS is not transferred back to the obsolete one.

```text
REJECTED fig-12 spec SHA-256:
cca9aaefb876fbd0e5f45426b0721113e3f76cca6f60cbc8870888a099a06adb
REJECTED fig-12 SVG SHA-256:
0c07af8c1e12b4c6a457cf711a10da35c0d247fbb74a7790d92ecfd4f6fc0e0a
REJECTED fig-12 render SHA-256:
df45772bfc7e1c7ca9557964a788e409474f9911a9f3dd7514a65a655ff1c428
REJECTED fig-12 preview SHA-256:
c3edd214a500402ebb0d63719761332687c3bc5636548a55319e9f20a11ca9b4
```

## Final CURRENT Actual SHA-256 Values

Calculated SHA-256 over the actual file bytes using Node's crypto API. Verified source hashes against `source.image.sha256`, spec hashes against render `spec.sha256`, and SVG hashes against render `output.svg.sha256`; all match.

Re-read all 20 current files, including previews, after the final visual inspections. All were stable. Source images did not change during either repair. Fig-13 and fig-14 retained their originally inspected hashes.

### Fig-11: Current PASS Tuple

```text
source PNG:
18e0f9e3e97f01c3d467998356d475fffcc0d88eac1df34593e4862eae2d209a
spec JSON:
ac6d1e4f3fe097d8dd9254cf161cf657d404571422844d2c1c4f7e303d5e0090
SVG:
2e9e6d352d57774416dcc75e56099717bc38dfa5fa8f33673ae2d9cf90389266
render JSON:
d097aa6c6899ec24ef2884249124dcb98eedca934b34a5a39ee6e6a0efcd1cc1
preview PNG:
17c9118613b3807612f66bfbf04d90710910448baf994269718c5176fff919c9
```

### Fig-12: Current PASS Tuple

```text
source PNG:
7a9e13e720d40654915fa199e32779e4bba8bc86a8875498f368961d48f22f17
spec JSON:
a013c378aa67bee4570830fe95f86f8b7868aaed32fda8fcd0804bbdb971cd14
SVG:
eb9f4bd694490f7467ae3580f2ddf5a1dad7a0a1bb641a0bbffcdb11060a74e9
render JSON:
c203228feb723ce952667544cb6e4e66243f2c69b212e4d375d7a579ba2b537c
preview PNG:
4ae58c4a9a17cfce4dd523a31e2cbf3fe572bf936965453a2ccc928501e3efe4
```

### Fig-13: Current PASS Tuple

```text
source PNG:
af7c9f0d5b962fcfc837fe6002bf858b25e3c5e564294a2b0cc3e6803b187593
spec JSON:
d3692c673009dfc77c48f66c83acb859485ae9233347795e88567ef81c9c0845
SVG:
988da9aead64cd4f526c2db5cc30f3bdc57d6b342fd9336888f54c25afe6a970
render JSON:
d479d3f471fdf12ab5d993c5e1096339aa4bfeae55e254a84394ba94f1d4a2c0
preview PNG:
93b76e68fb2f509e14611e0ed209333678afd440223a25c7a0a2e0056ed6bf82
```

### Fig-14: Current PASS Tuple

```text
source PNG:
0ce8ae7e0ebcee48708be21104800f001d8dc35d59505f1d29b4cd1782870d71
spec JSON:
9d625b60e4deba0587dadee57f6184cf9b1b71b2e39e4c8d197f8c5dbbf12fc7
SVG:
a3fd7867a302af7f422a2caa488b2066ca24353ef1510fd6b44cef88c865f673
render JSON:
c8a9aa4449410c7ae9009953cfed0702fcb03d832a11ae6b24083f4c3e1b2a8e
preview PNG:
2bf7e7baabc75a0c2ea334489d5c2a6102efca51d8a71c88c7ee95590bd3e647
```

## Limits and Stop

The candidate render reports still name the explicitly requested `.tmp/s10y-image/...` outputs. This review does not assert that temporary output paths are already a durable promotion contract. Did not create a `review@1` metadata file, promote assets, run an edition validator, render a complete lesson, or verify a DB-backed headed product page.

The independent PASS applies to source fidelity, authoritative-task compatibility, actual SVG visibility/geometry, declared-width readability, and the exact final hash tuples above. Any changed source/spec/SVG/render invalidates that tuple's approval.

Only this report was written. Both offline browser instances were closed. All unrelated changes were preserved. Report complete; stop.
