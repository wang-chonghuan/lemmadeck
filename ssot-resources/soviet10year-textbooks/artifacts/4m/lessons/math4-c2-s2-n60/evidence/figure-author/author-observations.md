# N60 figure author observations

Author-only offline work for STEMROBIN-187, 2026-11-23. No independent review,
approval, promotion, publication, answer reading, or answer annotation is
authorized by this record. All shell calls use
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`.

## Frozen pixel inventory, before any FigureSpec

The original PNGs below were each opened exactly once, in one four-image budget
batch. This inventory was written before any spec or rendering helper. No crop,
reopen, source-page image, prior modern figure, or answer image was used.

### fig-224

Original: `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-224.png`.
SHA-256: `96d4c1051ed4177811e3319074e81f55ecd16d674e8cd143dcb1969b18022985`.
The official context binds the identical file through its existing source symlink.

- One long black horizontal unarrowed line in one common frame, extending
  slightly beyond its 14 and 15 end marks. No second axis or panel.
- Eleven upright marks: left 14, nine intermediate tenths 14,1 through 14,9,
  and right 15. The nine tenths labels are above their marks; 14 and 15 are
  below. Adjacent tenths are regularly spaced. No dot markers are present.
- Two additional short marks descend from the same line, just right of 14,4
  and 14,5 respectively. Their below-line labels read 14,407 and 14,513.
  These are not extra tenths, alternative frames, or rounded answers.
- The source marks visually correspond to increasing positions
  14 < 14.1 < ... < 14.4 < 14.407 < 14.5 < 14.513 < 14.6 < ... < 15.
  Scanned line/tick roughness is not given data.
- No arrows, answer colors, shading, units, extra prose, or rounding
  destinations appear within the figure.
- Planned inventory IDs: `shared-scale`, `tenths`, `extra-decimals`.
  Planned source object IDs: `scale-14` through `scale-15` with nine
  `scale-14-N` marks, `number-line`, `extra-14-407`, `extra-14-513`, and
  explicit corresponding `*-label` text objects.
- Required executable facts: all thirteen mark anchors lie in the one frame;
  every named scale mark has a within-group displacement relationship;
  every extra mark has a within-group displacement from 14; the main segment
  uses the given end marks; numeric labels remain tied to the respective marks.
- Declared modern differences: decimal commas become dots; clean vector
  strokes replace scan roughness; labels use contemporary sans-serif type;
  the two extra labels occupy two separated lower lanes to remain readable at
  640 px. Their horizontal coordinates and numeric values do not move.
  Non-source hidden anchor/containment construction is allowed only to make
  these facts executable, never to add visible dots or answer content.

### fig-225

Original: `ssot-resources/soviet10year-textbooks/artifacts/4m/figures/fig-225.png`.
SHA-256: `1291dc46e22550713d0c788f23da7df6f798eabad81664be328d542f49c107b4`.
The official context binds the identical file through its existing source symlink.

- One large upper circle and one smaller lower circle overlap at the bottom of
  the large circle/top of the small circle. Both whole outlines are visible.
  Their two crossings bound a lens. There is no enclosing rectangle, fill,
  shading, arrow, radius, dimension, or legend.
- A filled dot in the large-only upper region has A above it. A filled dot in
  the small-only lower region has B to its right. The source dots look close
  to circle centers, but no radius ratio, exact center alignment, or metric
  distance is given by the question.
- I is in the large-only region, below/right of A and above the lens.
  II is in the overlap lens. III is in the small-only region below B.
  IV is outside both circles on the right, near the height of their lower
  crossing/lens. These are region identifiers already in the source, not an
  answer mapping.
- All six labels are required: A, B, I, II, III, IV. There are exactly two
  visible point dots, not four region dots.
- Planned inventory IDs: `two-circles`, `stations`, `region-identifiers`.
  Planned visible object IDs: `large-circle`, `small-circle`, `station-A`,
  `station-B`, `station-A-label`, `station-B-label`, and `region-I-label`
  through `region-IV-label`.
- Required executable facts: circles have two transverse crossings, neither is
  contained in the other; A dot and label are inside large and outside small;
  B dot and label are inside small and outside large; all four region labels
  have the source memberships, including IV outside both to the right.
  The station-point group must map both dots to a relationship wholly inside
  that group. Label footprints, not only anchors, need boundary clearance.
- Declared modern differences: clean exact circles replace scanned strokes;
  contemporary sans-serif letters replace scanned type; composition is
  proportionally spaced for the 640 px fixed scroll media. Circle sizes and
  station offsets are author layout choices, not new mathematical givens.
  Invisible containment constructions are mechanical supports only.

## Authoritative text read

Both official `fig-224.context.json` and `fig-225.context.json`, and the complete
modern `lesson.template.json` and `exercises.template.json` for
`math4-c2-s2-n60`, were read before the source images. No answer/key/solution,
interaction/choice specification, or test was read. The separate parent source
221 minor-break issue does not modify these figure inputs.

## Usage checkpoint before drafting

- Source images inspected: 2/2, exactly once each.
- Final preview images inspected: 0/2.
- Current image budget: 2/4 in one batch.
- Specs drafted: 0. Renderer invocations: 0. Content revisions: 0.
- Independent review records: 0. Paid calls: 0. Network calls: 0.
- Read-only path discovery initially looked for the absent
  `.tmp/ld-s10y-lesson/templates` directory. One `ls` returned exit 1 and a
  later `rg --files` pipeline printed the same missing-directory diagnostic.
  The actual templates were then located through the existing context-builder
  text at `.tmp/ld-s10y-lesson/adapt/...`. No output or source was changed.
- An initial overly broad filename listing was truncated. It was not used as
  content evidence; no listed answer files were opened.

## Preserved first failures

- fig-224 first validation returned exit 2: the redundant collinearity assertion
  used `points` rather than the official validator's `a`, `b`, `c` fields.
  No renderer ran and no image was produced. The original spec and exact
  stdout/stderr remain under `spec/fig-224.spec.json` and
  `render/fig-224.first.validation.*`.
- fig-225 first validation passed; its first renderer returned exit 2 with
  collision scores 10000 for II and III. Invisible support polygons had
  default 3 px borders; the official renderer's stroke-collision scan does not
  filter opacity-zero borders. The source circles, text anchors and 28 px
  labels did not fail mathematical or text-size validation.
  The first spec, SVG, render report and preview are retained with their
  `first` names. The failed preview was not opened.
- `repair1` specs correct only these concrete defects: valid collinearity field
  syntax for fig-224, and 1 px, still-opacity-zero supporting polygon borders
  for fig-225. No visible circle, station, label, or number-line coordinate was
  changed. First specs were not overwritten.
- fig-225 repair1 completed official validation, official rendering and the
  local exact-circle/footprint checks successfully. Its preview bytes are
  identical to the uninspected first preview, consistent with a repair confined
  to invisible support construction; that byte equality is not review approval.
- fig-224 repair1 validation passed and its renderer ran once. The official
  render reported collisions for both extra labels, again against their
  invisible default-width lane borders; all 13 labels measured 24 px.
  That failed spec, SVG, render report and uninspected preview are retained.
  fig-224 repair2 applies the same 1 px invisible-border fix to its two lane
  containers, without changing any visible object or source value.

## Final author observations

Each complete final preview was opened exactly once after its mechanical checks
completed. No failed preview was opened. No crops or reopens were made. The batch
is permanently exhausted at 4/4: two original PNGs plus two final previews.
These are substantive author observations, not independent mathematical,
visual, source-fidelity, cultural, or product acceptance approval.

### fig-224 final: repair2

The 640 x 320 preview shows one thin unarrowed baseline, the 14 and 15 labels
below its end marks, and every above-line tenth label from 14.1 through 14.9.
All eleven scale ticks rise from that same line. The 14.407 and 14.513 marks
descend immediately to the right of the 14.4 and 14.5 ticks, respectively; their
closeness to those ticks has not been widened or transferred to another scale.
The stems end before their respective text labels, with 14.407 in the first
lower lane and 14.513 in the second. The two labels are separated by 60 px.
I can read all 13 values without text collisions or clipping. There are no
point dots, rounded-result arrows, fills, answer colors, added units, or text
explaining which endpoint to choose.

The modern aspect ratio is taller than the source because the two lower lanes
need readable space. The horizontal value mapping remains exact; the visible
upright/downward glyph centers are offset only to make each stroke meet the
common baseline. The local helper checks those actual rendered stroke edges,
all numeric label-to-mark x bindings, and both stem-to-label gaps. All actual
labels measure 24 px at product media width 640. This is an isolated official
figure preview at the declared scroll-media width, not a live product or lesson
scroll-end acceptance check.

### fig-225 final: repair1

The 640 x 640 preview shows two entire unfilled circles, large above and small
below, with two clear transverse crossings and one overlap lens. A is above
its filled dot in large-only; B is to the right of its filled dot in small-only.
I remains below/right of A in the large-only portion; II is fully in the lens;
III is below B in the small-only portion; IV is outside both circles to their
right, near the lens height. All six labels are readable. There are exactly two
visible dots, not region dots. No support rectangles, shading, dimensions,
radius lines, arrows, legends or added exercise answers are visible.

The chosen circle proportions are close to the source composition but are not
presented as measured givens. The authored dot offsets are not asserted as
source center alignment. The helper checks both membership and exclusion against
the exact circles for every visible dot and text footprint; the minimum measured
boundary clearance among these requirements is 17.319985811656352 px. All actual
labels measure 28 px at 640. Invisible native containment polygons remain
conservatively within their assigned circles or outside both for the exterior
box. This is author/mechanical evidence only.

## Exact attempt usage

| Figure | Attempt | Outer official validator | Official renderer | Local footprint checks | Result |
| --- | --- | --- | --- | --- | --- |
| fig-224 | first | exit 2, invalid collinearity fields | not invoked | not run | preserved failure |
| fig-224 | repair1 | exit 0 | exit 2, both invisible lane-border collisions | not run | preserved failure |
| fig-224 | repair2 | exit 0 | exit 0 | completed | author mechanics pass |
| fig-225 | first | exit 0 | exit 2, II/III invisible support-border collisions | not run | preserved failure |
| fig-225 | repair1 | exit 0 | exit 0 | completed | author mechanics pass |

Totals: 2 initial specs, 3 genuine minimal spec revisions, 5 helper/outer-validation
attempts, 4 official JSXGraph renderer invocations (2 failed, 2 successful), and
2 final local DOM-footprint measurement runs. Each renderer also invokes the
unchanged official validator internally, giving 9 actual validator processes:
8 successful and 1 failed. Four previews were generated; only the two final
ones were inspected. The two collision repairs preserve identical preview bytes
within each figure; neither figure was rerendered to claim a determinism or
review pass. First failures and every subsequent attempt remain untouched.

Image inspections: 4/4 in one batch, exactly once per selected image.
Network calls 0; paid calls 0; new agents/chats 0; git operations 0; independent
review records 0; promotions 0; DB/.env operations 0; source/context, edition,
progress, key/solution/choice/test, tool or dependency changes 0.
The author helper and all new artifacts are confined to this figure directory.

## Final bindings

All paths in this section are absolute. SHA-256 values bind exact file bytes.

### fig-224

Spec:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/spec/fig-224.repair2.spec.json`

`04f7fd527593c3210c0169acaa53974d026037d7690f0600090d4a6c7e6ce5e8`

SVG:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/svg/fig-224.repair2.svg`

`d3fca6629497409643c77def5bab8ecb8f63ec97c877468ffba9e22c95aaed27`

Official render report:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/render/fig-224.repair2.render.json`

`95344dd2578333404149959e4d0f5355e7b46e722a3b89c7f691e49077a8dc0d`

Complete final preview, inspected once:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/previews/fig-224.repair2.preview.png`

`5494c9e7e9137a1faa55b1295d500412edd93141b8576203ecd72d555b64f00f`

Author mechanical report:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/render/fig-224.repair2.author-mechanics.json`

`5efbbe6dd0a6970fa3b745c50ffc35782dc0dacf645b413ff941ed9e86cc62b9`

### fig-225

Spec:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/spec/fig-225.repair1.spec.json`

`69aba19390e2b6ecc560b98616850084509980df6d5d18939f536e3a794447ef`

SVG:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/svg/fig-225.repair1.svg`

`f83ab314a783706359555dc7483ed70532415ea5e560b1a2fdcd2aff61486f68`

Official render report:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/render/fig-225.repair1.render.json`

`218fd55b12e8e7bc881395384ecd1264df428a19e9ba65a8386871037296d54e`

Complete final preview, inspected once:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/previews/fig-225.repair1.preview.png`

`df64653c2246703fa39173034c3ba562c482a88af975b9cc88b57f326a6593f2`

Author mechanical report:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187/.tmp/stemrobin-187/n60/figures/render/fig-225.repair1.author-mechanics.json`

`e1171761e05b0c011cddbd48bb0232c4dd3c1ecbf47a2d7a937b22d8816e37d2`

### Preserved earlier bindings

Paths below are relative to this document's figure directory; no first-attempt
file was overwritten. Command argv, exact cwd, exit codes, stream paths/hashes,
and helper hash are in each corresponding `*.author-mechanics.json`.

| Artifact | SHA-256 |
| --- | --- |
| `spec/fig-224.spec.json` | `e4a23f777cd40c1830fb3823f0a7d45cf3c5868469861bcc93ca4ab84801acff` |
| `render/fig-224.first.author-mechanics.json` | `6cdc267fbba34a3ea320625419e93497820d0fe2eeb8bee6e182fb7d4f06dcdd` |
| `spec/fig-224.repair1.spec.json` | `96554b136dfe699a4732679a85d4920f430b491d858995a3e9fba00cdc0be685` |
| `svg/fig-224.repair1.svg` | `be27dce1f412b0aa21df6a52eb2a3c42fd676fae112941b5cc70b1935faec703` |
| `render/fig-224.repair1.render.json` | `010a65c3c9d0e3339973ccc66ce16f9a9cfe6abce5b6bea700299f95f58ab237` |
| `render/fig-224.repair1.author-mechanics.json` | `69eb41b0c94fa493410933b7850bd4eb967d8b7efc24ef74805af4287d48aa62` |
| `previews/fig-224.repair1.preview.png` | `5494c9e7e9137a1faa55b1295d500412edd93141b8576203ecd72d555b64f00f` |
| `spec/fig-225.spec.json` | `279d8aadddd2372a8102366a748a762c26d48fb817985b91ee9c10757883513e` |
| `svg/fig-225.first.svg` | `4ab82e4ce105518ea230beb35352e9eb172900fa932fba326ba5bc1ac0f39aaf` |
| `render/fig-225.first.render.json` | `f9c5bb25b5cd0d8b39c2f33d4cccd0e9fc49ed78377170cca6afc422e2610833` |
| `render/fig-225.first.author-mechanics.json` | `e0cb453b575ba2e7ca0216ffec47a5b6447240644fb11a3fd57bbdb60aec210a` |
| `previews/fig-225.first.preview.png` | `df64653c2246703fa39173034c3ba562c482a88af975b9cc88b57f326a6593f2` |
| `render-local.mjs` | `dfabb4a50e5d56b4d288932530158d858af78b32b5b2b50fd84d372747df0053` |

Final status: authoring complete; official and local mechanical checks completed
successfully for the two final candidates. Independent review is pending.
No `ld-s10y-image/review@1` was created and nothing was promoted.
