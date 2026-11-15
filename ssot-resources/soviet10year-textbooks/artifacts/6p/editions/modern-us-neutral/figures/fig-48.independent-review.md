# Figure 48 Independent Review

Status: **PASS** for independent source, mathematical, visual and cultural review.
Ticket: STEMROBIN-180. Reviewed: 2026-11-15.
Reviewer: Codex, independent of the Faraday author. No figure repair or promotion.

## Authoritative Context And Direct Observation

Read the full `ld-s10y-image/SKILL.md`, `references/quality-gate.md` and FigureSpec
contract. Independently read the complete current modern s12
`lesson.template.json`, `exercises.template.json` and `figures.template.json`,
including all nine exercises and nested historical source data. No answer key
was opened.

Actually reopened the raw
`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-48.png`
at original resolution, 945 x 380. This judgment is not copied from the author's
inventory, notes, validation report or a source SVG.

- Source (a): two complete block-like solids on one perspective platform; large
  left block and small right block, each with front, top and hatched right face.
  One source subfigure mark below. No material, mass, volume, dimension or unit
  is printed inside this raw subfigure.
- Source (b): one complete equal-arm balance, level beam, central mast/pivot,
  two suspension frames and occupied pans, broad base and two feet. Left pan
  has one short squat cylinder; right pan one tall cylinder. Elliptical rims
  and lower curves are visible. One source subfigure mark below. No material
  words, numerical cylinder mass, loose weight or calibrated scale is printed.
- The current lesson identifies (a) as equal-mass ice/iron, each 1 metric tonne:
  ice 1.1 cubic metres and iron 0.13 cubic metres. It identifies (b) as
  equal-mass lead/aluminum, with aluminum volume approximately four times lead.
  This is not an equal-volume comparison. The hydrogen example is separate;
  it does not justify adding a hydrogen object.

Compared the inventory to those actual pixels: both complete subfigures and
their memberships are covered. English labels, Latin a/b, numeric block labels,
stacked layout, regularized proportions and neutral shading are explicitly
modern additions, not claimed source-pixel labels. The raw block/cylinder
outlines are schematic, not a calibrated physical scale. Regularization follows
the authoritative prose rather than treating the raw drawn width ratio as data.

## Independent Mathematics And Semantics

Checked the actual final SVG in a fresh repository Chromium DOM, not just the
spec's assertions. Polygons were read through SVGPointList; curved cylinder and
pan paths were inspected through browser SVG geometry APIs and their actual
path data. Anonymous paths were matched to their spec path data, then measured.

- Ice remains left and larger; iron remains right and smaller. Both front
  faces are square with the same baseline and proportional oblique projections.
  SVG DOM measurements give edges 122.26467895507812 and 60, implying volume
  ratio 8.461537515535412. The printed volumes give 1.1 / 0.13 =
  8.461538461538462. Difference is below 0.00001, allowing SVGPointList's
  single-precision readback, and is far below a displayed pixel. The geometric
  model uses a cube-edge ratio, not an erroneous eightfold length ratio.
- Both labels say `1 t`; `t` represents the metric tonne from the lesson, not
  a US short ton. `1.1 m^3` belongs to Ice and `0.13 m^3` to Iron. Cubic units
  and decimal places are intact.
- Lead remains the left short cylinder and Aluminum the right tall cylinder.
  Actual SVG diameters are both 46; axial heights are 40 and 160. The first
  vertical sides run (92,740) to (92,780) and (342,620) to (342,780).
  Therefore the represented volume ratio is 4, matching the prose's approximate
  comparison. The projected ellipse thickness is not mistaken for cylinder
  height. No exact experimental density or cylinder mass is invented.
- Suspension points are (115,540) and (365,540), centered about mast x=240;
  the beam is horizontal at y=540, both pan paths start at y=778, and both
  cylinder baselines are y=780. The two occupied level pans communicate equal
  mass, not equal volume. `V(Al) ~ 4 V(Pb)` is a prose-given approximation.

No answer key, choice index, worked exercise solution, marble/ice/brass ranking,
ceramic/iron answer, balsa conversion or soap result is added. These are lesson
examples; none of the nine exercises explicitly references this figure.

## Actual Full-Figure Visual Checks

Actually opened `preview-300.png` (300 x 588), `preview-480.png` (480 x 940)
and native `preview-full.png` (480 x 940), without cropping. These are the
current final SVG's normal-width rasters in this author directory. The native
and 480 PNGs are byte-identical. Also opened a fresh in-memory 300 px raster
and a complete settled neutral print-media 480 px raster.

Both (a)/(b) headings, two complete blocks, two complete cylinders, both pans,
mast, base, right foot, far-right Aluminum label and bottom volume relation are
visible. No right or bottom omission, label overlap, clipped outline, blank
render or broken black raster was found. The smallest normal-width labels
remain readable, with English words and valid ASCII mathematical notation.
No Chinese/Cyrillic labels, source handwriting, archival texture or cultural
symbols leaked into the modern output.

Fresh in-memory checks at 300/306/480 px assert exact visible strings, all
visible geometry/text within the canvas, no label overlap or document overflow,
semantic color variables, nonblank pixels and clear outer pixel margins.
Minimum transformed text sizes are 16.875/17.2125/27 px. Fresh 300 px raster:
31,383 nonwhite pixels and 6,483 dark pixels out of 176,400. Browser raster
antialiasing differs from the author's PNG bytes; no raster equality is claimed
as semantic evidence. The inspected saved previews' current hashes were verified.
Screen accent recoloring and settled neutral print recoloring were checked;
the complete print raster was actually displayed and inspected.

Fresh rendered-stage validation passed without errors. This complements the
pixel and geometric review; mechanical PASS alone was not used as approval.

## Bound Inputs

- Raw PNG: `bb42774a0670fed9514ae9ba359003d7301cd4b08a8fb5190e30abd521eeb3ce`
- Full current lesson template: `17b85837320f5061d22fcd7ec0e9e5b55a877005462f790eb85dae3fec2e50d1`
- Full current exercises template: `f14f369ddaa6b77bf1e8608dfb610b316c5cfd8debf9c6bf4e3eab80f286aedc`
- FigureSpec: `137010932f936c902f0dc9cd1a6196c504d6f1587eeeae74fbc7225f88f0a6e2`
- Render report: `2ea6e26b3dda15bfbd748c045d31ffdab72a7214dbd0a7a3f8987c043f87b711`
- Final SVG: `06b509d2baf3337a63147b96a22c227d09bc4617539a1441d46bdef74a33e703`
- Inspected 300 PNG: `933a0b05f8f2ca5465e54a1647d55922f2b55f8428783790108dd801526b8cb9`
- Inspected 480/native PNG: `3b8db451b7a86adaf8ed3c3179e3a255a3b24b3a9dad7daa18954ff92fbac79c`

`review.json` is recorded by the skill's `record_review.py`, binding current
source/spec/render/SVG hashes. This is approval of the scratch figure only,
not publication or final lesson acceptance. Durable path rebinding, edition
validation and complete offline/product lesson acceptance remain the owning
pipeline's separate gates. No model, DB, app, dependencies, Git state or durable
artifact was modified; only this new review and `review.json` are written.
