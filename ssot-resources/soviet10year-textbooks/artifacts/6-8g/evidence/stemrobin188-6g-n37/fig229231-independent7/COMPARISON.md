# N37 figures 229-231: independent comparison

Date: 2026-11-23. Reviewer: independent7. Ticket: STEMROBIN-188.
Overall status: **hold**.
Only write root: `.intentfold/tickets/STEMROBIN-188/tmp/n37-fig229231-independent7/`.
All paths in this record resolve against the sole working root
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.

This is the substantive comparison of the disclosed retained candidates, not a
native `ld-s10y-image/review@1`, promotion, publisher operation, or whole-lesson
approval. Candidate mathematical geometry, visible labels and cultural content
pass the comparison below. Full figure approval is withheld for the findings.

## Findings

1. **HOLD, all three figures: actual product media widths not evidenced.**
   Each actual spec declares instructional, inline, `maxWidthPx: 480`,
   `minTextPx: 16`, widths `[280,300,320,331,352,480]`. Each bound render report
   passes those widths, with minimum measured text approximately 19.833 px at
   280 px and 34 px at 480 px. However, the retained `author-receipt.json`
   explicitly limits `displayScope` to isolated headless previews and
   conservative widths, not the product/lesson display. No disclosed
   measurement identifies actual prose media width for 229 or exercise media
   widths for 230/231 at intended desktop/mobile surfaces. Thus the declarations
   and their mechanical checks pass, but actual-width coverage is UNKNOWN.
   Supply existing applicable, candidate-bound measurements/display evidence
   for those affected surfaces, or perform only the missing affected checks.
   Do not rerender geometry or demand a whole-lesson/product retest. The two
   remaining image slots are reserved for actual affected-surface evidence.

2. **REVISE, figure 229: source provenance overclaims an observed arrow.**
   `fig-229.spec.json`, `$.source.inventory[0].description`, calls its inventory
   source-only and includes "the O -> O1 arrow". FIRST requirement
   `f229-connector` established a connector, with source arrowhead/directed-vector
   status UNKNOWN. The actual candidate arrow from `lower-O` to `upper-O1` is
   mathematically supported by the approved prose's translation O to O_1 and
   is acceptable as a modern addition. Revise only the provenance description
   to distinguish that text-authorized addition from observed source pixels;
   do not rewrite FIRST or assert that UNKNOWN was resolved. No geometry,
   label, SVG or preview alteration is requested by this finding.

No additional mathematical, label-clearance, answer-revelation, or cultural
defect was found in the actual final previews/specs/SVGs. These findings do not
discard existing native PASS checks or the retained first clearance failure.

## Sealed independent basis

Reuse, not re-transcription, of:

- `SOURCE-FIRST.md`, SHA-256
  `07ce12237f2831327e726d4768df1cf0e99fd2858817642ddf4b133aed6b506e`.
- `source-review.json`, SHA-256
  `5b02fbc9bd8cf70c405222b478a54ac5505890e1a9104e14420db39610217ce1`.

Both remain unchanged and 0444. Originals were NOT visually reopened. Current
original-byte hashes and approved template hashes match FIRST. Top-level
approved prose and exercises 479/486 were compared with candidate authoritative
text; all candidate text entries are exact matches. No exercise was solved and
no answer/choice material was inspected.

## Disclosed retained bindings

Let E be:
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n37/fig229231-author7`.
Only E's retained copies were read, never the author's original tmp outputs or
the edition destinations named by the producer reports. The author's FIRST and
scripts were not used as authority.

`E/manifest.json`:
`4f8f8443379626145be08a3e792750d3b911414a58b1e60b1baca7cc56491a19`.

`E/author-receipt.json`:
`4a04e648e309202c65537552817dbdc23ec4fdff2e86664a28c5049c849e8f81`.

| Retained filename under E | SHA-256 |
| --- | --- |
| `fig-229.spec.json` | `06f239526851ca2c8a57e581dfc291cf47911cd75735551c624607957f09d369` |
| `fig-229.svg` | `fbb24f5c3655702d5f5a59bf6aa38faad5db857834ba7591353fe31e61f2b971` |
| `fig-229.render.json` | `2054b1fda0db01fee847cf1327799dca49b4783a7251e48049c0538010ffbfcd` |
| `fig-229.render.producer.json` | `e7b419c2bb0d17ff0b56239b6f30826c336580bd1f09758525e4d28f894df732` |
| `fig-229.preview.png` | `31928e47dc9dc59387f944ee5d1fd08de2bb3716c0c67d8ba718c0b48613b56b` |
| `fig-230.spec.json` | `bfe939d392163a05ff2a7b3ca42e51840351f06ac25f49ab4cc346dbbd873f6a` |
| `fig-230.svg` | `a06e50e1f3d6b60b70f8f5bfb62b972c600a0c352fad35674fba73e5d72ec72a` |
| `fig-230.render.json` | `a593675a5fd745e3b492c178c31c39f79ab0b71dd652234ffca5ceee714f6bdb` |
| `fig-230.render.producer.json` | `478524e6b4fe0453600e0d1900f0d0d4ebbd459dbd7fc6e5f8b74a6ef09fd2b6` |
| `fig-230.preview.png` | `e20573c7c8b491d510d860c610d1ea57a83c738f54364648964424d9b40f914e` |
| `fig-231.spec.json` | `84eb07ea499a1e6caae62890d107acad96387742e80309163f79be478a6d5fb7` |
| `fig-231.svg` | `f5bf96cbcdb8482be898f80194e90bbdaac212cedd599a1fdfba7383f9294b8c` |
| `fig-231.render.json` | `422e35176a9dc9b3405d1766054f7b26294878ded188286f433730dd3222b936` |
| `fig-231.render.producer.json` | `8fa319de8ca458b2810870e250cc36d65b358887f5b7c09a7d7443b3415b0983` |
| `fig-231.preview.png` | `359c65735aea123532ed53caba03eef6993d533edec23f13ca800fd1adaff07a` |

## Figure 229

Mathematics: pass. Visible geometry/labels: pass. Cultural content: pass.
Source-provenance description: revise. Actual product display: hold.

All FIRST requirements were compared with actual candidate objects/assertions:

- `f229-origins` -> `upper-O1`, `lower-O`; `translation-direction` has negative
  dx, positive dy from O to O_1, preserving O_1 upper-left of O.
- `f229-upper-rays` -> `upper-O1`, `upper-A1`, `upper-B1`, both upper ray
  segments; incidence and forward displacements preserve NE and right/down.
- `f229-lower-rays` -> `lower-O`, `lower-A`, `lower-B`, both lower ray segments;
  their incidence and forward displacements preserve the same two directions.
- `f229-direction-pairs` -> both `corresponding-*-directions` parallel assertions
  plus signed forward displacements. Upper/lower A vectors `(4.6,2.3)` and
  `(4.4,2.2)` have a positive scale relation; B vectors `(4.5,-0.9)` and
  `(4.2,-0.84)` likewise. Neither pair has equal finite lengths, nor an
  `equalDistance` assertion or an assertion mapping A to A_1 or B to B_1.
  Coordinates are candidate layout constraints, not source numerical givens.
- `f229-connector` -> `translation-O-to-O1`, `translation-arrow-endpoints`,
  `translation-direction`; both origin incidences and diagonal orientation
  survive. The arrow is text-authorized, NOT a newly established source fact.
- `f229-angle-arcs` -> both actual arc objects with endpoint collinearity and
  radius assertions. Each lies between its own two forward ray sides, to the
  right of the vertex; no angle value or extra equality tick is printed.
- `f229-glyphs` -> exactly six SVG labels O_1, A_1, B_1, O, A, B, with subscript
  1 glyphs for the upper configuration. FIRST's alphabet UNKNOWN is unchanged.

The final preview is nonblank and correctly oriented. Both arcs, four sides,
connector and six labels are visible, with no clipping or label/stroke collision.
A_1 is clear above its endpoint; O is clear to the left of the lower vertex.
The lower O label has a clean W placement rather than reproducing source ink's
slight below-left placement; incidence/naming is unambiguous. Hidden point
markers do not hide the renderer-owned labels. No extra finite-length given,
numeric result, cultural inscription or answer annotation is present.

## Figure 230

Mathematics, visible geometry/labels, cultural content: pass.
Actual product display: hold.

- `f230-upper-line` -> `top-A`, `top-P`, `top-B`, `top-line-AB`;
  `top-A-P-B` and the two signed top-row displacements preserve A-P-B.
- `f230-lower-line` -> `bottom-C`, `bottom-Q`, `bottom-D`, `bottom-line-CD`;
  collinearity and the two signed bottom-row displacements preserve C-Q-D.
- `f230-transversal` -> M, Q, P, N and `transversal-MN`;
  P/Q-on-MN plus three signed forward displacements preserve M-Q-P-N.
- `f230-P-incidence` and `f230-Q-incidence` -> the same three actual carrier
  strokes and their endpoints/interior crossing relationships. At P and Q,
  all four required directions survive; P is above/right of Q.
- `f230-shared-frame` -> the single composition and `given-AB-parallel-CD`.
  Horizontal rows regularize the raster's small tilt; the transversal still
  rises rightward and remains oblique, with no perpendicularity assertion.
- `f230-glyphs` -> exactly eight visible SVG/preview labels A, P, B, C, Q, D,
  M, N in the recorded relative positions. Native alphabet remains UNKNOWN.

The preview is nonblank; the two rows and transversal form the same shared
frame. All eight labels are legible and separated from the strokes. Separate
point dots were not established for every source label and are not fabricated.
There are no angle arcs, numbers, equal-angle highlights, arrowheads, finite
length equalities or exercise-answer annotations. No cultural text is visible.

## Figure 231

Mathematics, visible geometry/labels, cultural content: pass.
Actual product display: hold.

- `f231-upper-line` -> `top-A`, `top-B`, `top-C`, `top-line-AC`;
  collinearity and positive top-row displacements preserve A-B-C.
- `f231-lower-line` -> `bottom-F`, `bottom-D`, `bottom-E`, `bottom-line-FE`;
  collinearity and positive bottom-row displacements preserve F-D-E.
- `f231-transversal` -> R, B, D, P, `transversal-RP`;
  B/D-on-RP plus signed displacements preserve R-B-D-P, descending rightward.
- `f231-B-incidence` and `f231-D-incidence` -> both crossings on those same
  carriers; BA left, BC right, BR NW, BD/P SE; DF left, DE right, DR NW through
  B, DP SE. B remains above/left of D.
- `f231-alpha-sector` -> `given-angle-CBD-arc` with endpoint-on-BD/BC and
  radius assertions, and `given-angle-alpha`. Exactly one arc and alpha label
  occur in the lower/right wedge at B; no other angle is highlighted.
- `f231-markers` -> actual visible `bottom-D` ellipse at the lower junction,
  hidden `top-B` marker with visible joined crossing, and labelled A endpoint.
  A's raster rounded dark termination becomes a clean butt-capped line end.
  FIRST did not establish a separate intentional A dot, so no additional point
  marker is required or invented from that termination. A's identity/incidence
  remain visible; D's conspicuous source marker is explicitly retained.
- `f231-C-speck` -> no speck object, prime, added label or relationship. Its
  source role remains UNKNOWN; C stays the edition-authorized C.
- `f231-glyphs` -> eight point labels plus exactly one Greek alpha in actual SVG.
  Mathematical alpha is edition-authorized; native point alphabet is UNKNOWN.
- `f231-shared-frame` -> one shared composition and `given-AC-parallel-FE`,
  with horizontal regularization and no reversal of point orders or sector.

The final preview is nonblank. D's dot, both crossings, alpha/arc and all nine
labels are visible with no collision or clipping. Source slight row tilt and
ragged stroke texture are cleanly regularized, not new geometric givens. There
are no extra dots around C, degree values, equal-angle marks, cultural symbols
or solved ray-pair results.

## Native evidence and failure reuse

All actual spec/render/SVG/preview/producer hashes match the disclosed manifest.
Each actual render report binds the actual spec and SVG hashes. Comparison of
original producer JSON with final render JSON verifies EXACTLY two path changes:
`spec.path` and `output.svg.path`, to durable edition destinations. All other
report content is identical. No path-only rerender is needed or requested.

Retained native receipts record successful final draft/rendered validations
and render executions for each figure, with zero current collisions. These
checks are reused, not rerun; native mechanical PASS is not semantic approval.

The first figure-229 clearance failure remains retained under
`E/failures/fig-229-render-native-2/`:

| Failure filename | SHA-256 |
| --- | --- |
| `fig-229.spec.json` | `581def6dc25586af1409392eee674e30af5464f054dd7cfb056fad9a4f79ad9a` |
| `fig-229.svg` | `4254609bb126fc9389b3e4f7587fc96e355f72ac0874da2d87cfb324a8c24a5f` |
| `fig-229.render.producer.json` | `86a660fda23101117ee2cf74f22e8662a0db563ec7d44c583d4b0f9c35715821` |
| `fig-229.preview.png` | `2b6cec56dd74eb5c0af5dc62072a36a47fe13ce6718c31c56d8fa7c6da4da426` |

Its actual failure report records status fail / exit 2, with upper-A1-label
and lower-O-label clearance collisions. Independent comparison of failed and
final specs finds ONLY A_1 y-offset -8 -> -20 and O x-offset 0 -> -10; all
geometry/assertions are unchanged. The final preview, not the failed preview,
was inspected. Failure-preview bytes were hash-checked only, never viewed here.

Visible SVG strokes, marker and labels use semantic ink/paper color variables.
Hidden empty JSXGraph construction elements have literal default colors but
are display:none and are not visible cultural/theme content. No embedded
image/script or untranslated cultural text appears in these SVGs.

## Counters and scope

Cumulative in THIS independent reviewer context, not the author's context:

- Original visual opens: fig-229/230/231 = 1/1/1, total 3; reopens = 0.
- Final retained preview visual opens: fig-229/230/231 = 1/1/1, total 3.
- Current image batch: 6/8. Current context: 6/24. No reset between stages.
- Actual affected-surface image loads: 0. Remaining reserved slots: 2.
- Failed-preview visual opens, crops, screenshot loads: 0/0/0.
- Candidate substantive comparisons: one per figure, total 3.
- Source inventories reused: 3; new source inventory/transcription/solving = 0.
- Reviewer rerenders, validator reruns, candidate revisions, paid/model calls,
  browser sessions, git/DB/canonical/shared/environment/dependency operations:
  all 0. Browser was never opened.
- New files: only COMPARISON.md and review.json, sealed 0444. Existing FIRST
  files remain unchanged. Native reviews recorded: 0.

Status remains hold pending the two narrowly identified matters. Preserve these
first comparison findings. Later work should reuse the completed unchanged
source/geometry/label/cultural comparisons and expand only actual display
coverage or affected changed provenance; never reopen originals or newly solve
the exercises. Parent native recording is NOT authorized by this hold record.
