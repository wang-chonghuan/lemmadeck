# Figure 49 Independent Review

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
`ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-49.png`
at original resolution, 1106 x 280. This judgment is based on those pixels, not
the author's inventory, a source SVG or a render-pass report.

The raw crop contains exactly four similarly sized perspective cubes in one
row. Read independently from left to right:

- Water: `1` gram per cubic centimetre; short horizontal liquid-fill strokes
  on visible faces, with the material name below.
- Mercury: `13.6` grams per cubic centimetre; heavily dark-filled visible
  faces, with the material name below.
- Iron: `7.8` grams per cubic centimetre; light front/top and dark right face,
  with the material name below.
- Air: `0.0013` grams per cubic centimetre; irregular dots on visible faces,
  with the material name below.

All four raw cubes have visible front, top and right faces. Their density
labels are above the associated cube, not mass labels. No edge length,
explicit `1 cm^3` volume, scale, dimension line, numbered vertex, axis or
separate Figure 49 caption is printed inside this crop. Liquid strokes and
air dots are qualitative material texture, not a graph, lattice or particle
count. Mercury's intentional black source fill is not a missing cube.

Compared the inventory with the actual pixels: all four materials, source
values, cube faces and source texture distinctions are covered. Translation
to English, a shared density-unit heading, 2 x 2 reading-order reflow, equal
regularized geometry and simplified shading/texture are declared modern
additions, not misrepresented as raw source content.

## Independent Mathematics And Semantics

Inspected and measured the actual final SVG in a fresh repository Chromium DOM.
All four front faces measure 88 x 88 SVG units. Each top has the same oblique
offset (26,-18) in SVG screen coordinates. Water/Mercury share baseline y=250;
Iron/Air share y=525. The four reference-volume forms have equal geometry,
not four equal masses. No source precision is inferred from hand-drawn scan
deviations.

Checked exact actual SVG strings and their visible association:
`Density (g/cm^3)` applies to Water `1`, Mercury `13.6`, Iron `7.8` and Air
`0.0013`. Each value remains immediately above its cube; the English material
name remains below. No decimal loss, value swap, kg/m^3 relabeling, mass-label
substitution or substitution of the lesson's distinct water-vapor density
occurred. No cube volume or length was invented.

The complete lesson explains density as mass per unit volume and converts
iron's 7800 kg/m^3 to 7.8 g/cm^3. The four-source-material comparison matches
that context. Its projected reference volumes do not claim that water,
mercury or air forms an unsupported solid.

The written exercise g2-2 instead concerns three equal-volume cubes of marble,
ice and brass. Those are not the image source and must not replace Water,
Mercury, Iron or Air here. No mass ranking for that task, ceramic/iron volume
answer, balsa unit conversion, soap result or answer-key annotation is added.
The given iron density is already in the source image and lesson; retaining
it is not a new exercise-solution leak. None of the nine exercises explicitly
references this figure.

## Actual Full-Figure Visual Checks

Actually opened `preview-300.png` (300 x 419), `preview-480.png` (480 x 670)
and native `preview-full.png` (480 x 670), in full without cropping. These are
the current final SVG's normal-width rasters in this author directory.
Also displayed and inspected a fresh complete neutral print-media 480 px
raster in memory.

All four complete cubes are visible in the correct reading order, including
far-right Mercury/Air faces and the bottom Iron/Air names. Density header,
all four values and all four names remain legible at 300 px. No right or
bottom omission, clipped face, overlapping label, missing object, blank image
or broken black raster was found. Water's front strokes, Mercury's dark fill,
Iron's light front/dark side and Air's sparse dots remain distinct qualitative
cues. They do not encode a measured particle count.

Visible language is English with valid ASCII mathematical notation. No raw
Chinese units/names, Cyrillic, handwriting, archival texture or cultural
symbols leaked through. Neutral semantic colors and the complete print raster
remain readable.

Fresh in-memory checks at 300/306/480 px assert exact visible strings, equal
cube dimensions/projections, all visible geometry/text inside the canvas,
no label overlap or document overflow, semantic color variables, nonblank
pixels and clear outer pixel margins. Minimum transformed text sizes are
16.875/17.2125/27 px. Fresh 300 px raster: 17,061 nonwhite pixels and 5,047
dark pixels out of 125,700. Browser raster antialiasing differs from the
author's PNG bytes; no byte equality is claimed as source-fidelity evidence.
The inspected saved previews' current hashes were verified.

Fresh rendered-stage validation passed without errors. Mechanical PASS was
supporting evidence, not a substitute for the raw-pixel and final-image review.

## Bound Inputs

- Raw PNG: `f0d7e4a78847e167040f7e5b41e2b0843b5ccfaa2df0d8e3f26e942f79d022d7`
- Full current lesson template: `17b85837320f5061d22fcd7ec0e9e5b55a877005462f790eb85dae3fec2e50d1`
- Full current exercises template: `f14f369ddaa6b77bf1e8608dfb610b316c5cfd8debf9c6bf4e3eab80f286aedc`
- FigureSpec: `ed9b2f1c81c0656cb236f94136ce0f2f5fa0bc90b49b0f709ebe91279f04ebeb`
- Render report: `7ae2a594d6c2c99f213ea909d74641a3a236a27bad8ca9b083f9fbe98746e6be`
- Final SVG: `8cee9bceaa60d28beca9b3a1ff65834e2d79d4b54f325bf5f91a7de9f9a2dcc5`
- Inspected 300 PNG: `9d71b9fc0a3f663f071dd31ea9613729ff973328e38fe4fd2aa46210e3877e4a`
- Inspected 480 PNG: `10d08b15deaeb504ce20a0b24a4b99bb84abf2ab3d40fb08fcade8238783f447`
- Inspected native PNG: `9f5c951cd3855ba3440a661e4bc30e8fd3a7e439e3cde685e07e8898471b0022`

`review.json` is recorded by the skill's `record_review.py`, binding current
source/spec/render/SVG hashes. This is approval of the scratch figure only,
not publication or final lesson acceptance. Durable path rebinding, edition
validation and complete offline/product lesson acceptance remain the owning
pipeline's separate gates. No model, DB, app, dependencies, Git state or durable
artifact was modified; only this new review and `review.json` are written.
