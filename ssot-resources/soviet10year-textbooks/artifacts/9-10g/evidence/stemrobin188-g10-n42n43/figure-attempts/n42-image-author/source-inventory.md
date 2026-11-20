# N42 source-pixel inventory

Scope: author previews only for fig-g10-01 and fig-g10-02. Each original PNG
was actually opened once before this inventory. No answer material was read.
The source lesson and current modern templates supply semantic context.

## fig-g10-01

One subfigure, no frame, grid, ticks, caption, numeric values, or point names.
The white background and irregular black scan strokes are not mathematical data.

| Source item | Pixel observation | Object mapping |
| --- | --- | --- |
| Shared tail | One unlabelled junction, approximately (158, 250); no distinct dot | basis-o |
| i tip | Approximately (19, 393), down-left of the shared tail | basis-i-tip |
| j tip | Approximately (362, 247), right of the shared tail | basis-j-tip |
| k tip | Approximately (154, 46), above the shared tail | basis-k-tip |
| i vector | Solid directed segment from the shared tail to the down-left tip | basis-i |
| j vector | Solid directed segment from the shared tail to the right tip | basis-j |
| k vector | Solid directed segment from the shared tail to the upper tip | basis-k |
| i label | Latin mathematical i with a vector arrow, near the down-left arm | basis-i-label |
| j label | Latin mathematical j with a vector arrow, above the right tip | basis-j-label |
| k label | Latin mathematical k with a vector arrow, left of the upper tip | basis-k-label |

All three arrows are solid and point away from exactly one common origin.
There are no dashed strokes, right-angle markers, or equality ticks. The
authoritative prose defines three pairwise perpendicular UNIT vectors in
SPACE. Their projected screen lengths and angles do not establish those facts.
Each arrow has its own connects assertion; all four source points belong to
the same pointRelationships inventory group, wholly covered by those connects.

## fig-g10-02

One projected rectangular parallelepiped. The source has no printed vertex
names, origin label, dimensions expressed as numbers, ticks, grid, coordinate
triples, right-angle markers, or exercise answers. Internal vertex IDs below
are inventory names, NOT new visible labels.

| Source vertex | Approximate source pixel position | Meaning / object mapping |
| --- | --- | --- |
| O | (302, 357), lower front right | common tail; box-o |
| I | (439, 219), lower rear right | x-component endpoint; box-x |
| J | (20, 365), lower front left | y-component endpoint; box-y |
| K | (300, 148), upper front right | z-component endpoint; box-z |
| IJ | (149, 225), lower rear left | concealed corner; box-xy |
| IK | (435, 15), upper rear right | box-xz |
| JK | (15, 152), upper front left | box-yz |
| A | (146, 19), upper rear left | opposite diagonal endpoint; box-xyz |
| i unit tip | On O-I, approximately (370, 288) | box-i-unit |
| j unit tip | On O-J, approximately (175, 361) | box-j-unit |
| k unit tip | On O-K, approximately (301, 222) | box-k-unit |

| Source stroke | Visibility and direction | Object / assertion mapping |
| --- | --- | --- |
| O-I | Solid; component arrow toward I | box-x-component / connects-box-x-component |
| O-J | Solid; component arrow toward J | box-y-component / connects-box-y-component |
| O-K | Solid; component arrow toward K | box-z-component / connects-box-z-component |
| J-JK | Solid undirected edge | box-y-yz / connects-box-y-yz |
| JK-K | Solid undirected edge | box-yz-z / connects-box-yz-z |
| K-IK | Solid undirected edge | box-z-xz / connects-box-z-xz |
| IK-I | Solid undirected edge | box-xz-x / connects-box-xz-x |
| JK-A | Solid undirected edge | box-yz-xyz / connects-box-yz-xyz |
| A-IK | Solid undirected edge | box-xyz-xz / connects-box-xyz-xz |
| J-IJ | Dashed concealed edge | box-y-xy / connects-box-y-xy |
| IJ-I | Dashed concealed edge | box-xy-x / connects-box-xy-x |
| IJ-A | Dashed concealed edge | box-xy-xyz / connects-box-xy-xyz |
| O-A | Dashed SPACE-diagonal arrow toward A | box-a / connects-box-a |
| O-i unit tip | Solid arrow over O-I | box-i / connects-box-i |
| O-j unit tip | Solid arrow over O-J | box-j / connects-box-j |
| O-k unit tip | Solid arrow over O-K | box-k / connects-box-k |

All twelve box edges are accounted for: nine solid, three dashed. The dashed
space diagonal is a thirteenth geometric connection; the three unit-arrow
overlays are distinct directed objects, not extra box edges.

| Printed mathematical label | Source placement | Object mapping |
| --- | --- | --- |
| vector i | beside the shorter O-I arrow, lower right | box-i-label |
| vector j | below the shorter O-J arrow | box-j-label |
| vector k | right of the shorter O-K arrow | box-k-label |
| x times vector i | near I, beside the long component arrow | box-x-label |
| y times vector j | near J, below the left component endpoint | box-y-label |
| z times vector k | near K, right of the top component endpoint | box-z-label |
| vector a | beside the dashed interior diagonal | box-a-label |

The three components, three unit vectors, and diagonal share O. Each shorter
unit-vector endpoint is collinear with its corresponding component endpoints.
Opposite edges occur in three parallel families. A is reached by the sum of
the three directed components. Screen crossings inside a projected face
(for example the diagonal crossing a concealed edge) are NOT extra vertices.
The diagram has three visible projected face loops (front, right, top), and
the rear lower corner is reached by the three dashed edges.

All eleven source points belong to one pointRelationships group. Every one
is covered by a wholly internal connects assertion; collinear assertions
cover each unit/component alignment, and parallel + displacement assertions
cover all translated edge families and the summed diagonal endpoint.

## Modern regularization, separate from source facts

- Rebuild every stroke using the existing JSXGraph renderer, never hand SVG.
- Use a clean affine oblique projection with the same directional arrangement,
  exactly common tails and corners, and consistent parallel edge families.
  Smooth scan skew is regularized; approximate scan coordinates are not exact
  three-dimensional measurements.
- Internal unlabelled construction points use sub-stroke markers (0.1px size
  and stroke), overdrawn by their incident edges. They do not introduce visible
  named points, isolated dot annotations, or numerical data.
- Label anchors are explicit, with preserved Latin vector letters and vector
  over-arrows. No translated cultural wording or extra explanatory text is
  added inside the figure.
- Projection-only box parameters x=2, y=3, z=3 select a readable illustrative
  pose. These are NOT source given values and are NOT printed. Unit vectors
  are genuinely unit length and mutually orthogonal in the separate 3D model;
  no 2D perpendicular/equal-length assertions pretend to check that.
- Both figures use instructional inline media, maxWidthPx 480, with actual
  declared test widths 300, 358, 480 and minimum text 16px. No scroll fallback
  is preselected.

This is an author inventory and draft basis, not an independent review or
authorization to promote either figure or approve the lesson.

## First-render defect and one targeted label repair

The initial PNG inspection showed that Arial did not render the combining
vector-overarrow character: all vector labels had a missing-glyph square.
The fig-g10-01 renderer receipt nevertheless had machine status pass.
That is NOT visual approval. The fig-g10-02 receipt also reported k/a
label-stroke collisions. Both initial specs, SVGs, PNGs and receipts remain
unchanged as the original attempt snapshots.

The sole content repair uses plain Latin letter text PLUS a separately
JSXGraph-rendered short arrow over the vector letter. Thus the source vector
notation is retained, not dropped or replaced by unsupported font glyphs.
Each notation arrow also receives a connects assertion. Only fig-g10-02's
k/a label positions move to clear space. Geometry, source hashes, mathematics,
current-template context binding and all original connects assertions stay
unchanged. The new files use the distinct label-repair prefix.
