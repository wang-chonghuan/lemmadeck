# N37 figures 229-231: independent SOURCE-FIRST

Date: 2026-11-23.
Stage: SOURCE-FIRST complete; HOLD for candidate disclosure.
Reviewer: independent7, STEMROBIN-188.
Sole working root: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
Write ownership: only `.intentfold/tickets/STEMROBIN-188/tmp/n37-fig229231-independent7/`.

This is an independent, one-pass source inventory, NOT a native figure review,
candidate approval, source-transcription approval, exercise solution, or whole
lesson approval. No candidate spec, SVG, output, author inventory, previous
figure review, answer material, or choice material was inspected. Nothing is
mathematically, visually, or culturally approved for publication by this record.

## Input bindings

All paths below are relative to the sole working root. SHA-256 binds whole input
files, including the templates; only text was used as edition authority. Embedded
source text appeared in the first text-only projection, but the subsequent
top-level edition-text projection, not `source.data`, supplies the authority
references below. No modern candidate image/spec/render or answer/choice
payload was disclosed.

| Input | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n37/lesson.template.json` | `c5837502d8984364b97b4b77272519144d1dddf15f36c887572047e7ed098a83` |
| `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n37/exercises.template.json` | `afb2e2ffebcd00204877c5bc65858a18be901d94baa0ddd1a76585b89d2c2cd2` |
| `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-229.png` | `d12430595d34eddd92ad4f9aa3d8036549397e98460929fe4ccd3fb02002fa3c` |
| `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-230.png` | `c15026fd061594260867f8ce83a2fc33a0ba8de472ebda87b34e57569870d27f` |
| `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-231.png` | `e8e8b389d51b21ddab9d8b53b3f560a05b69931e406ef8deead5b5789da04dba` |

Read-only governing references:

| Reference | SHA-256 |
| --- | --- |
| `.agents/skills/ld-s10y-image/SKILL.md` | `c0f7f9b7ab9203195a54fd35f812db4313dd242c31e47ef6ece4b38f46197f32` |
| `.agents/skills/ld-s10y-image/references/quality-gate.md` | `36ec37ff120139309ade57b4aa315b1595490311aa50bb974f7401201ef84b29` |
| `.agents/skills/ld-s10y-image/references/figure-spec.md` | `0de03f32aa271aed552d51d41c326911cc1137c17d9217a8f74c0c4b7f7bc3a9` |
| `.claude/skills/ld-s10y-lesson/references/production-resume.md` | `13b89b436d595d08af0d5d5408a74bba552807d025973de5cb5857d3b25bb9a9` |
| `.intentfold/readme.md` | `f8dd29bc96c49c08a668dfece3de3fee85dab43f49460ecf3fffe0cb605b1e76` |
| `.intentfold/charter/engineering.md` | `d4b38ea7ed61f21c70da56d600500f113f9eab8987b9267be6baf905c924977c` |

## Authority boundary

Figure 229 belongs to the prose. Relevant top-level text: `$.prose[0].text`,
`$.prose[3].text`, `$.prose[4].text`, and `$.prose[5].text`. It names O, A, B,
O_1, A_1, B_1; rays OA and OB and same-direction rays O_1A_1 and O_1B_1;
translation taking origin O to O_1; and equality of the convex angle sizes.
The text does NOT say that the labelled points A and B individually translate to
A_1 and B_1, or give equality of finite OA/O_1A_1 or OB/O_1B_1 lengths.

Figure 230 belongs to exercise 479, `$.exercises[0].text`. Given: two parallel
lines intersected by another line. Task: identify angles whose sides have
correspondingly the same directions. This inventory does not supply that answer.

Figure 231 belongs to exercise 486, `$.exercises[7].text`. Given:
`(AC) parallel (FE)`, and an alpha-marked angle. Tasks ask for angles equal to
alpha and angles between the ray pairs BC/DE, BC/DF, BA/DR, BR/DE. These task
names are context, not solved relationships or answer annotations.

## Figure 229: observations before any candidate

One shared composition contains two angle configurations, not separately
lettered subfigures. The O_1 configuration is upper-left of the O configuration.
There are four solid straight outgoing strokes, one solid diagonal joining the
two origins, and two small unnumbered angle arcs. No grid, axes, units, degree
value, length marking, parallel-arrow marking, or confidently identifiable
ray/translation arrowhead is visible.

Stable source requirements:

- `f229-origins`: O_1 is upper-left and O is lower-right. Each is the common
  origin of its own two rays. Both also meet the diagonal connector.
- `f229-upper-rays`: from O_1, the A_1 stroke rises to the right; the B_1 stroke
  runs to the right and slightly down. A_1 is near the upper ray's far end,
  above it; B_1 is near the other far end, above it.
- `f229-lower-rays`: from O, the A stroke rises to the right; the B stroke runs
  right and slightly down. A is above the far upper end; B is above the far
  lower end. The O label is to the left/below its vertex; O_1 is left of its
  vertex.
- `f229-direction-pairs`: OA and O_1A_1 have matching NE direction; OB and
  O_1B_1 have matching right/slightly-down direction. Same direction and ray
  incidence are the relevant source/text relationships, NOT equality of
  labelled finite lengths or point-to-point displacement for A/A_1 or B/B_1.
- `f229-connector`: a solid diagonal runs down-right from O_1 to O. Preserve
  this visible connector as distinct from the four angle sides. Its
  arrowhead/directed-vector status is UNKNOWN; do not claim one from the pixels.
- `f229-angle-arcs`: one small arc inside each convex wedge, to the right of
  its origin, between that configuration's two outgoing strokes. Neither arc
  has a number, Greek label, or a distinctive equality tick.
- `f229-glyphs`: six labels, visually O_1, A_1, B_1, O, A, B. Three upper labels
  carry small lowered 1 glyphs. These are visual shape descriptions and edition
  mappings, not a verified native-alphabet identification. Alphabet: UNKNOWN.

The drawn straight strokes stop on the raster, but the edition calls the four
sides rays. Their raster endpoints and label anchors do not encode finite
length givens. No candidate object IDs or assertion IDs have yet been seen.

## Figure 230: observations before any candidate

One shared frame, no lettered subfigures: two nearly horizontal solid lines and
one steep solid transversal rising to the right. Both nearly horizontal lines
have a slight down-right raster tilt. The transversal crosses the upper line
at P and the lower line at Q; P is above/right of Q. No angle arcs, degrees,
equal-length ticks, parallel-arrow marks, grid, or explicit arrowheads appear.
The parallelism is an edition-text given, not a printed parallel symbol.

Stable source requirements:

- `f230-upper-line`: left-to-right visual order A, P, B. A is above the left
  end; P is above/left of the upper crossing; B is above the right portion.
- `f230-lower-line`: left-to-right visual order C, Q, D. C is above the left
  end; Q is above/left of the lower crossing; D is above the right end.
- `f230-transversal`: bottom-left to top-right order M, Q, P, N. M is left of
  the lower endpoint and N is left of the upper endpoint.
- `f230-P-incidence`: four sides incident at P: left toward A, right toward B,
  down-left through Q toward M, and up-right toward N.
- `f230-Q-incidence`: four sides incident at Q: left toward C, right toward D,
  down-left toward M, and up-right through P toward N.
- `f230-shared-frame`: preserve both crossings on the same transversal and both
  near-horizontal carriers in the same composition. The text gives their
  parallelism. Do not replace the composition with disconnected angle icons.
- `f230-glyphs`: eight visual labels A, P, B, C, Q, D, M, N. No angle-number
  labels. Native alphabet is UNKNOWN; use the approved edition nomenclature
  rather than asserting Latin/Cyrillic provenance from letter shape.

There are no unambiguous separate round point markers for all eight labelled
positions. Stroke ends, crossings, and occasional scan flecks do not establish
additional named points. This is an incidence/direction inventory, not the
angle-pair solution to 479.

## Figure 231: observations before any candidate

One shared frame, no lettered subfigures. Two near-horizontal solid lines are
crossed by a solid transversal descending to the right. The upper carrier rises
slightly rightward in the raster; the lower carrier is approximately horizontal
with a slight rightward rise. Their parallelism is the explicit text given.
The upper crossing is B, the lower crossing D; B is above/left of D.

Stable source requirements:

- `f231-upper-line`: left-to-right order A, B, C. A is above the left end, B is
  above/right of the upper crossing, C is above the right end.
- `f231-lower-line`: left-to-right order F, D, E. F is below the left end, D is
  above/right of the lower crossing, E is below the right end.
- `f231-transversal`: top-left to bottom-right order R, B, D, P. R is left of
  its upper endpoint; P is below/left of its lower endpoint.
- `f231-B-incidence`: rays BA left, BC right, BR up-left, and the continuation
  through D toward P down-right.
- `f231-D-incidence`: rays DF left, DE right, DR up-left through B toward R,
  and the continuation toward P down-right.
- `f231-alpha-sector`: exactly one small curved angle arc at B, on the
  lower/right side of that crossing, between the rightward upper-line side
  toward C and the descending transversal side toward D/P. The alpha glyph
  sits in that lower/right wedge, right of the arc. There is no numeric angle
  value and no other equal-angle annotation.
- `f231-markers`: the upper left line end at A has a visible rounded dark
  termination; D has a conspicuous dark crossing/spot. B is a joined dark
  crossing, but a separately printed dot there is not confidently separable
  from the strokes. Small bumps/flecks are not new source points.
- `f231-C-speck`: a tiny isolated dark speck occurs above/right of the C-shaped
  label, away from the upper carrier endpoint. Its role is UNKNOWN: scan
  artifact, punctuation, or intentional mark cannot be established. Do not
  silently make it a point, prime, extra glyph, or geometric given.
- `f231-glyphs`: eight point/direction labels, visually A, B, C, R, D, F, E, P,
  and one alpha-shaped mathematical label. Point-label native alphabet is
  UNKNOWN. Alpha maps to the explicit alpha of the approved exercise text.
- `f231-shared-frame`: preserve A-B-C and F-D-E collinear orders and the
  R-B-D-P transversal in one frame, with AC parallel FE as given. Preserve the
  top/bottom and left/right orientation; do not reverse the marked sector.

No arrowheads, grid, measuring marks, degree numbers, equality ticks, axes, or
cultural/political emblems were identified. The absence of identified emblems
is an observation, not cultural approval of an unseen modern candidate.
No equal-alpha angle list or result for the four ray-pair tasks was derived.

## Unknowns and non-inferences

Native alphabet remains UNKNOWN for the point-label glyphs in all three scans.
The C-adjacent speck's role in figure 231 remains UNKNOWN. Figure 229's connector
has no confidently identified arrowhead. Do not resolve these by opening
answers, authors' inventories, old modern figures, or candidate geometry.
Any candidate-added ray arrowheads, explicit point dots, or regularization
must be distinguished from source facts and justified against the approved text.
No asserted lengths, angles in degrees, coordinates, or answers are introduced.

## Stage counters and later comparison

- Source visual opens: 3 total; fig-229 = 1, fig-230 = 1, fig-231 = 1.
- Independent source inventory passes: 1 per figure; source visual reopens = 0.
- Current image batch = 3/8; current-context image loads = 3/24.
- Modern candidate/output images loaded = 0; actual-surface images loaded = 0.
- Reserved later: 3 output images plus 2 actual affected-surface images.
- Remaining reservation fits this same batch: 3 + 3 + 2 = 8. Do not reset usage.
- Crops = 0; screenshots = 0; browser sessions = 0; browser remains closed.
- Model/generation/paid calls = 0; generation/revision attempts = 0.
- Candidate comparisons = 0; native pass reviews recorded = 0.
- New exercise solving = 0; source transcription review repeated = 0.
- Product/shared/canonical/git/DB/environment/dependency writes = 0.
- Stage-owned outputs = only SOURCE-FIRST.md and source-review.json, sealed 0444.

After authorized disclosure, reuse THIS inventory and its sealed hash; do not
reopen source pixels, redo source transcription, or solve the exercises anew.
Compare the actual source-bound requirements against the actual candidate spec,
SVG and outputs, not an author's checklist. Review mathematics, visual fidelity,
and cultural content substantively. Check the intended ACTUAL media widths on
the affected prose/exercise surfaces, including final label size of at least
16 px; nominal viewport, canvas, or containing-column width is not evidence.
Actual intended widths and all candidate hashes are UNKNOWN at this stage.

No native `ld-s10y-image/review@1` PASS may be recorded until that comparison and
the applicable affected display checks actually occur. Approval, if later
earned, is figure-only and hash-bound, never approval of the whole lesson.
Use the reserved image budget and close any browser immediately after its work.
