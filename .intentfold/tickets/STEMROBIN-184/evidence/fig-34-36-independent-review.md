# STEMROBIN-184: Independent Source-First Review, Figures 34-36

Date: 2026-11-15. Role: independent replacement reviewer, not an author.
Scope: existing figures 34-36 only. No authoring, promotion, publication,
database/application/dependency/charter changes, or commits.

## Source-First Observation

The observations below were recorded after opening all three original PNGs
at their original resolution, and before reading the current FigureSpecs,
SVGs, previews, source inventories, or author handoffs.

- Figure 34: one box/cube wireframe, an extended horizontally hatched plane
  through its lower face, and an extended vertically hatched plane through
  its right face. The planes intersect along a shared projected edge.
  Rear/occluded box edges include dashed portions. There are no point labels,
  measurements, numerical givens, axes, or separate subfigures.
- Figure 35: five separate curved-surface examples in two rows. Upper left:
  an open bent sheet with a slanted secant and A on its lower/front portion,
  B on its upper/rear portion. Upper right: a T-shaped pair of cylindrical
  tubes, with A and B on the front circular cross-section's rim and a secant
  crossing that rim's interior projection. Lower left: a sphere with A at
  the right/front portion, B at the upper-left/back portion, a slanted
  secant, and dashed hidden portions. Lower middle: a cone with A lower
  left, B higher right, and a slanted secant with a hidden interior portion.
  Lower right: a cylinder pierced obliquely, with A lower/front and B
  higher/rear near the top projection; the external parts of the piercing
  line have visible thickness in the source. Every subfigure has its own
  A/B pair. The drawing depends on depth, curved-surface membership and
  hidden/visible line distinctions, not merely projected collinearity.
  Exact hidden point placement is interpreted jointly with the modern prose,
  not inferred from an unrelated answer or a previous question.
- Figure 36: a single parallelogram representing a plane, containing two
  distinct labelled points A and B on one straight line; the visible line
  extends beyond both points while staying inside the drawn patch.
  No axes, additional points, lengths, or angles are given.

## Authoritative Text

Read the complete actual ready modern-us-neutral s9 lesson template:
`.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c1-s9/lesson.template.json`.
The prose says the cube's six faces lie in six different planes; each of the
curved surfaces admits two points on the surface whose line AB is not wholly
in the surface; a line through any two points in a plane stays in that plane.
The rest of the lesson was read for context, without using answers or old
exercise references.

## Dispositions

| Figure | Independent disposition | Render/validator | Review recording |
| --- | --- | --- | --- |
| 34 | PASS for the current scratch candidate | Both pass | Written and hash-verified: `fig-34.review.json`, status pass |
| 35 | BLOCKED, not independently approved | Both pass | Written and hash-verified: `fig-35.review.json`, status fail |
| 36 | PASS for the current scratch candidate | Both pass | Written and hash-verified: `fig-36.review.json`, status pass |

These are figure-review decisions, not promotion or final lesson acceptance.

## Figure 34

The independent pixel inventory matches `source-cube-six-faces`,
`source-horizontal-plane`, and `source-vertical-plane`. The current SVG has
six face polygons with visible paper fills and separately controlled edge
strokes; polygon border opacity zero does not hide the face fills. Twelve
cube edges comprise nine solid edges and three dashed hidden edges. In the
actual SVG the hidden edges have `stroke-dasharray="5,5"`; duplicate solid
borders do not fill their gaps. Their connects assertions and the three
parallel direction families retain the cube's projected structure.

Both extended face planes, distinct hatch directions, rear hatch gaps,
right-face depth edges, and the common projected lower-right edge remain
present. This is a qualitative cube projection, not a claim that spatial
cube lengths/angles can be measured from the flattened image. Hatch spacing
is a display regularization; there is no source counted lattice to preserve.
The two depicted extended planes are examples, not a claim that the cube
has only two face planes.

Inspected existing `fig-34.preview.png` at 640x640 and
`fig-34.mobile-240.preview.png` at 240x240. All plane extensions fit, the
wireframe is legible, and the three hidden edges remain differentiated.
There are no source labels, numerical givens, cultural marks, or answers.
The report's null minimum text measurement is correctly vacuous, not a
false 16px text measurement. PASS for current candidate.

## Figure 35

Inspected the complete 800x760 renderer preview, the complete actual
640x608 media preview, and both 240x608 scrolling endpoint previews.
Read the actual current SVG, all five inventory groups, every point/label,
and all 30 assertions. The original source has five panels, not five
mathematically defined planar regions. Exactly ten point objects and ten
English labels are present, with distinct A/B ownership within each panel.

| Source panel / current group | Point ownership and visible spatial cues | Independent observation |
| --- | --- | --- |
| Open sheet / `source-rolled-sheet` | `sheet-A` lower/front, `sheet-B` higher/right; curved rims, front flap and upright hatching; solid AB followed by a dashed upper continuation | Source panel is retained, not replaced by a flat rectangle. Both labels are readable. The curved paths have no point-to-surface binding. |
| T tubes / `source-T-cylinders` | `T-A` and `T-B` at the two endpoints of the front rim path; slanted line crosses its opening; upright paper fill masks horizontal hatching | This is one panel with a T junction, not two separate panels. Rim endpoints are visibly associated with A/B. The rim chord must not be misread as belonging to a filled planar end face or to the cylindrical wall. |
| Sphere / `source-sphere-surface` | `sphere-B` upper left, `sphere-A` upper right; visible/hidden curved contours; dashed BA and solid external portions | The round outline plus meridian/latitude cues reads as a sphere, not a flat disk. Both point projections lie inside its silhouette, which by itself does not identify their surface depths. Their labels are separated; B's longer downward offset does not attach it to another marked point. |
| Cone / `source-cone-surface` | `cone-A` lower left, `cone-B` higher right; apex, generators, curved front rim and dashed rear rim; dashed AB | No named apex, dimension or extra point is invented. Labels remain distinct. Projected positions and hidden AB are plausible surface/secant cues, but there is no binding of either dot to a particular generator/depth. |
| Cylinder and rod / `source-cylinder-and-rod` | `rod-A` at screen (613,581), `rod-B` at (658,510); vertical wall hatching, top ellipse, solid rod outlines, dashed axial passage and solid exterior continuation | A is projected over the side wall. B is on the rod axis inside the top-opening projection, not at an explicitly modelled wall/rim intersection. The source also uses a rod and depth-dependent passage. This is an unresolved surface identity/depth ambiguity, not proof that an interior projected point is off a spatial surface. |

The source-first front/back descriptions above record visual interpretation,
not a certified spatial coordinate model. No conclusion here equates
"inside the projected silhouette" with "on the curved surface."

The current SVG preserves actual solid/dashed distinctions: sphere/cone AB
and the rod's passage are dashed; the sheet's upper continuation is dashed;
surface back contours are dashed; T-front AB is solid as in the source.
There is no black or broken raster, clipped whole-media panel, added
measurement, source-language label leakage, or answer disclosure.
At the actual fixed 640px media width, 30px canvas labels scale to 24px.
The mobile screenshots are viewport crops of the 640px media, not a 240px
shrunken five-panel figure. Partial neighboring panels at the two endpoints
are expected. The middle cone is visible in the full-media preview.

### Contract Decision

The actual quality gate requires **"every required mathematical
relationship has an assertion"**, not merely complete point counts.
The FigureSpec contract likewise requires ID-addressable machine-checkable
mathematical facts and source-bound point-relationship coverage.
Every one of these ten points has an in-group connects assertion, and all
line extensions have projected collinearity/connects coverage. This meets
the validator's generic point-relationship completeness test.

It does not cover the prose's essential additional relationship: for each
panel, A and B belong to the stated curved surface, while the spatial line
AB is not wholly contained in it. The assertions here are only
`objectCount`, `connects`, and `collinear`; none refers to a surface object
or verifies that surface-membership/line-containment claim. A reviewer
cannot silently treat the broad mathematical gate as satisfied by these
strictly weaker assertions. This conclusion comes from the current
contract and actual candidate, not from the author's historical blocker
or renderer PASS.

**BLOCKED under the current contract.** No definite false spatial coordinate
claim is asserted, because the candidate supplies no such coordinates.
The cylinder B ambiguity makes especially clear why projected dots and
collinearity are insufficient for mathematical approval.

### Minimum Missing Prerequisite

Before an independent PASS is possible, the responsible parent/author needs
an explicit source-bound mapping of each panel's A/B to its intended
curved surface, entry/exit or generator/rim positions, and visible/hidden
line sections, together with a contract-conforming assertion/evidence
route for the required surface relationship. In particular, identify
whether cylinder B is on the top surface, rear curved wall, or another
intended part, rather than leaving it merely on a rod's projected axis.

The alternative is a human-approved, scoped clarification of the skill's
gate allowing these particular qualitative spatial claims to be
independently reviewed manually, with that mapping supplied. No such
exception is present in the current skill. Neither remedy is performed
by this reviewer. A new 3D renderer/system is **not** demanded, and flattening
the sphere into a circle or applying `inside` to its silhouette is not a
valid substitute. Relabelling the figure decorative would also be invalid.

## Figure 36

The source four-border plane patch, two distinct A/B points, single straight
stroke and both unmarked continuations are all preserved. Opposite-border
parallel assertions, connects/collinearity/point-on-line assertions and the
two inside assertions cover the actual represented relationships.
Both points and both displayed stroke ends are safely inside the convex
plane patch; their connecting strokes stay inside it. Finite drawn
boundaries represent the unbounded plane/line, not new task endpoints.

Inspected existing 640x320 and 240x120 previews. A remains above/right of
its own point and B above its point, with no overlap, clipping or
reassignment. The current SVG text layer uses 48px text, giving 18px
at 240px and 26.85px at 358px; the prior A-label collision is no longer
present in this candidate. No coordinates or labels were changed by this
review. PASS for current candidate.

## Evidence And Hashes

Executed the existing `validate_spec.py --stage rendered` once per figure:
all three returned PASS. Reused the three existing PASS render reports
without invoking any renderer. Current source/spec/report/output hashes
match. A structured comparison verified that every spec contains exactly
all 22 nonempty text blocks from the ready modern s9 template, whose full
file SHA-256 is:
`405aad569b70e60dbde903145dfcf989e89cdb81088b61c00a30b2f759982a63`.

For figures 34/36, compared `canvas`, `display`, `objects`, `assertions` and
`layout` with `before-modern-text-binding/spec.json`: they are unchanged.
The cached measurement reuse is legitimate for this text-only rebinding;
it is not described as a new render. Read and parsed actual SVG output;
all visible stroke/fill colors use semantic CSS variables. Theme
rerendering and final lesson/product acceptance were not performed here.

All paths in the tables are relative to the shared checkout.

| Figure | Original PNG SHA-256 | FigureSpec SHA-256 |
| --- | --- | --- |
| 34 | `3343c82af45ea520c311a93798dfd0a624beb2c8350749b220609b8df6859e66` | `9edd49ff80bb1423e8115ba29cd048ff2d333067d013670cc483d7bebe7f07bf` |
| 35 | `5e9fdde97844feb07059a45a11333b79f5a52cb7ed3dd8ed707b8df26af354e8` | `ff445ba4469b5e597741db37453d89ae2b3a393020e4668741a6750688d5ed8c` |
| 36 | `258c35e229e178da1845be82c9bb2c43fa961a83a095e52af87ed2b94b5db985` | `3c946d096062aee2cc53596f0d79e00097df6bd7f66e5d2e93ea65ab241a816f` |

| Figure | Render report SHA-256 | Current SVG SHA-256 |
| --- | --- | --- |
| 34 | `553398a578e0c7e3b6e7881faca322bf38b83974611dbd8f762e3b502dcd2c93` | `8a5db077179b1a0de072766b13bb07ade91b32dc7213562f118e9172c8683035` |
| 35 | `893b833adf800ce1a5998274743e871bf265a889b326de01cefcf442ee7b737a` | `401732a5957de24ca45e21a60d062219a4f76ee914f56895d364a8033c39eeaa` |
| 36 | `fbdaf29b6dd0f75080594dc37e83a55ff4d184aea58353aebb70a96e2c6dd64a` | `dd1072c81d5ead8af47a051f1e9b1307f737bcecdeffc25c749995d5833c5680` |

| Existing preview under `.tmp/s10y-image/6-8g/` | SHA-256 |
| --- | --- |
| `fig-34/fig-34.preview.png` | `8327962f2c0e7b0cb8853c1bf8f2184cf5dfe8c812177fc8a078f0456620a2de` |
| `fig-34/fig-34.mobile-240.preview.png` | `2af66085a757f1f2d6f3fa913579f1872dbcdf80ef409dd78ac249549e0840c1` |
| `fig-35/fig-35.preview.png` | `afaf8224cfc9862d30c3aa126f0bf1723c36334eb2f3ea0b9558eac0e74ec2b3` |
| `fig-35/fig-35.media-640.preview.png` | `96c709004878c8e8515336572a165f51d47a2ffb3743c7fff8e22ec966b1bf8a` |
| `fig-35/fig-35.mobile-240-left.preview.png` | `a86a3d30d7a2b44e601229c9c384aaf6cfc27170ca27e1dc01172b71cbe17b5c` |
| `fig-35/fig-35.mobile-240-right.preview.png` | `1bb930cad5797095618743c567b3a9583a22728cf0ef24346800a5fc4bbcdd98` |
| `fig-36/fig-36.preview.png` | `5d77e62300d139edc46f56f2cafeb73771b82facf8f4df03965a54a6fc4694d2` |
| `fig-36/fig-36.mobile-240.preview.png` | `b14bb665c7efbc02bf6233cef7752aa5d750b86b35f14aa16137239b6796acbe` |

Existing author evidence reports mobile scroll reach:
`clientWidth=240`, `scrollWidth=640`, `scrollLeft=400`.
The endpoint PNGs were independently opened; that browser interaction was
not rerun, and the metrics are explicitly reused author evidence, not an
interaction newly executed by this reviewer. Final actual lesson sizing,
scroll affordances, durable-path rebinding and lesson-validator/offline
acceptance remain the parent's separate integration work.

## Recording And Boundaries

All three reviews were written by the existing `record_review.py` and
their recorded hashes/statuses were checked against the inspected inputs.
An additional guard before and after each invocation required the exact
inspected original/spec/report/SVG and full modern-template hashes.
No existing review was overwritten. The filenames are
`.tmp/s10y-image/6-8g/fig-34/fig-34.review.json`,
`.tmp/s10y-image/6-8g/fig-35/fig-35.review.json`, and
`.tmp/s10y-image/6-8g/fig-36/fig-36.review.json`.
The review schema has only pass/fail; figure 35's fail explicitly records
the BLOCKED prerequisite, not a failing render or a proven false spatial
model.

No browser was launched, no user window/tab or input device was touched,
and no renderer, API image generation, answer pipeline, old-question
reference, product runtime, database, dependency installation, publication,
promotion or commit was used. Shared existing changes and author files
were preserved. Only this ticket-temp report and the separate scratch
review records are written.
