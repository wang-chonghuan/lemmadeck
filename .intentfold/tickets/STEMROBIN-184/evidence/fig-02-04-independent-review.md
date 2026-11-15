# fig-02 / fig-03 / fig-04 Independent Figure Review

Ticket: STEMROBIN-184. Lesson: geo68-c1-s1. Reviewer: Codex, independent of the figure author. Date: 2026-11-15.

## Outcome

| Figure | Source facts and mathematics | Actual visual output | Final |
| --- | --- | --- | --- |
| fig-02 | Complete circumference, O/A/M, OA radius, exterior M | Complete and readable at 400px, 320px, 240px; themes checked | PASS |
| fig-03 | Complete circumference, O/X/M, symbolic r, interior M | Complete and readable at 400px, 320px, 240px; themes checked | PASS |
| fig-04 | Complete closed disc, all nine points, both boundary points, unmarked radius endpoint | Complete and readable at 500px, 400px, 240px; themes checked | PASS |

No substantive source-fidelity, mathematical, answer-leakage, or visual defect found in these exact snapshots. Approval is for the scratch author packages, not asset promotion or lesson publication.

## Method and Boundary

- Opened the three complete original PNGs individually, not a montage or OCR projection. The initial source-provenance projection exposed author inventory descriptions while locating the PNGs; those descriptions were not accepted as evidence. The independent observations below were checked directly against source pixels before reading the standalone `source-inventory.md` files or inspecting modern SVG output.
- Read the complete current s1 `lesson.template.json` prose and `exercises.template.json`, including the circumference/disc distinction and exercise 4's request about every marked point. Checked every supplied `source.authoritativeText` entry against these current templates; all match exactly.
- Reviewed the complete specs and assertion mappings, then the actual complete SVGs with the existing app Playwright dependency, offline Chromium 149.0.7827.55. All browser requests were blocked. No product server, DB, lesson-level browser, answer file, model service, installation, build, or test suite was used.
- Inspected each SVG at full canvas resolution, its declared maximum product width, and 240px. Inspected neutral, accent, and print at 240px. Used the current app media CSS, color tokens, and exact `.sr-print-lesson .sr-figure-media` print rule in an isolated figure-only container. These are direct SVG inspections, not newly rendered geometry.
- Measured the actual SVG text screen transform at every declared width. Did not rerun the renderer, its automatic collision phase, or a standalone spec validator. Existing render reports are `pass`; their source/spec/output bindings were independently compared with actual byte hashes.
- Opened each supplied full-resolution preview separately as supplementary evidence, never as a substitute for inspecting actual SVG.
- Browser closed after inspection. No source, spec, render, SVG, preview, template, resource, manifest, or pipeline file was edited.

## Independent Source Inventory and Figure Findings

### fig-02: PASS

Original pixels show one unfilled circumference; three marked and named points O, A, M; O at the center; A on the upper-right boundary; M outside to the right and above O. There is one solid segment OA and no printed radius label. No other panel, point, axis, grid, tick, arrow, shading, number, unit, or answer annotation is present. Isolated scan specks are not mathematical points.

The edition specifies radius 1.5cm, `|AO|=1.5cm`, and an off-circumference M with `|MO| != 1.5cm`. The symbolic circumference definition and notation retain a planar point set at a positive fixed distance from O.

- Objects `circle`, `O`, `A`, `M`, `radius-OA` reproduce all source elements and all three labels. The actual SVG has a circular outline, three visible dot markers, and a solid OA reaching A.
- `circle.center=O`, radius 1.5; A=(0.9,1.2), so OA=sqrt(0.81+1.44)=1.5. `A-on-circle`, `radius-is-1p5`, and `radius-connects-O-A` express the relevant boundary/radius/connection facts.
- M=(2,0.5), so OM=sqrt(4.25)=2.0615528128088303 > 1.5. `M-outside-distance` supplies an executable O/M relation; its exact numerical layout distance is expressly not a new given. Each source point participates in a mapped relationship wholly within its inventory group; `three-source-points` is supplementary, not the relation evidence.
- Equal canvas-axis scale preserves a true circle. Circularization and regularized unmeasured angle/spacing are justified modern changes, not claimed source measurements.
- Actual SVG and preview retain an empty interior. No added radius value, membership answer, axis, point, or numerical distance appears. The rightmost M and its entire label remain visible at both product extremes; O/A/M are distinct and no source object is occluded.
- Defects: none.

### fig-03: PASS

Original pixels show one unfilled circumference, center O, upper-right boundary point X, and an interior M below/right of O and below the shallow OX radius. There are exactly three marked points, four labels O/X/M/r, and one solid radius OX with r above it. No extra panel, grid, axis, tick, arrow, fill, number, or measurement is present.

The edition says every circumference point X has `|XO|=r`, while off-circumference M has `|MO| != r`. An interior M is appropriate: being inside the region bounded by a circumference does not mean belonging to the circumference.

- Objects `circle`, `O`, `X`, `M`, `radius-OX` retain all three points, all four labels, and the solid radius. In actual SVG, r is above OX; M is visibly inside the circle and below the segment.
- The circle has center O and undisplayed layout radius 3. X=(2.8,sqrt(1.16)), so OX=3; `X-on-circle`, `OX-is-radius`, and `radius-connects-O-X` cover the equality and endpoints.
- M=(1.65,-1.2), so OM=sqrt(4.1625)=2.0402205763103165 < 3. `M-inside-distance` covers its O/M relationship with a margin far exceeding 1e-6 tolerance. All three source points are covered within the inventory group.
- Radius 3 and exact point coordinates are declared as undisplayed layout regularization, not source numerical givens. No numerical 3, coordinate, distance, or membership conclusion is printed.
- The actual SVG retains an unfilled interior and a circular outline. X at the right edge and its complete label, the lower-right M marker, and r are present and readable at 240px and 320px. No overlap or clipping observed in the actual visual inspection.
- Defects: none.

### fig-04: PASS

Original pixels show one circumference with diagonal hatching throughout its interior, representing a closed disc. There are exactly nine marked points and ten labels: O at the center; A upper-left interior, B lower-left interior, Y upper-right interior; C on the right boundary slightly below O, D on the lower-right boundary; M outside at the left, P outside upper-left, Q outside upper-right; plus r. The radius runs from O toward the upper boundary, with r to its left. Its boundary endpoint has neither a marker nor a name. There are no other panels, axes, ticks, grids, or arrows.

The complete edition defines the disc by planar distance no greater than r, including equality. Exercise 4 asks membership for every marked point, so preserving O, the three strictly interior points, both boundary points, and all three exterior points is essential.

- `disc`, all nine named point objects, and `radius` preserve the complete structure. All ten actual SVG labels are O/A/B/Y/C/D/M/P/Q/r. The radius's coordinate-literal endpoint exists only as a hidden construction point (`display=none; visibility=hidden`); the actual output does not add a tenth visible point or an endpoint name.
- The circle center is O=(0,0), undisplayed radius 3, with equal-axis screen scale. `O-at-center` and `disc.center=O` agree.
- OA=2.1633307652783937, OB=1.9137659209004638, OY=1.8439088914585775, all strictly below 3. The three corresponding distance assertions preserve interior relations and state these are unmeasured layout values, not givens.
- C=(2.94,-sqrt(0.3564)) and D=(1.875,-sqrt(5.484375)) each have distance 3 from O. `C-on-boundary` and `D-on-boundary` preserve the two equality cases rather than moving them slightly inside or outside.
- OM=4.037635446644484, OP=4.049691346263317, OQ=3.8242646351945884, all strictly above 3. The three exterior-distance assertions cover M/P/Q with ample tolerance margin.
- Radius endpoint (0.75,sqrt(8.4375)) has distance 3; `radius-end-on-boundary` and `radius-connects-center-boundary` express its endpoint and connection. All nine source points have mapped mathematical relations inside the inventory group; the point count is supplementary.
- Replacing whole-disc hatching with uniform `accentSoft` fill at opacity 0.18 is explicitly recorded modernization. It retains the entire included region and a solid boundary. It does not add partial answer-bearing shading or color-code membership cases.
- Actual SVG at 500/400/240px retains leftmost M, upper P/Q, rightmost C, bottommost D, all interior markers, and the complete circular boundary. C and D visibly sit on that boundary. Labels remain attributable to their markers; r remains associated with the only radius segment.
- No membership symbols, inside/outside wording, distance numbers, coordinates, answer color coding, Cyrillic, Chinese labels, or cultural symbols appear.
- Defects: none.

## Display, Font, and Theme Evidence

fig-02/03 are instructional inline figures with maxWidthPx=320 and 400x400 canvases. fig-04 is instructional inline with maxWidthPx=400 and a 500x500 canvas. All declare minTextPx=16. Actual text uses Arial/Helvetica/sans-serif, weight 600, SVG fontSize 32 for fig-02/03 and 36 for fig-04. Equal horizontal/vertical transforms preserve circles and point relations.

The following values were measured from `fontSize * hypot(getScreenCTM().a, getScreenCTM().b)` in the isolated app-CSS figure surface, not assumed from preview dimensions.

| Actual CSS width | fig-02/03 minimum text px | fig-04 minimum text px |
| --- | --- | --- |
| 240 | 19.2 | 17.28 |
| 242 | 19.36 | 17.424 |
| 272 | 21.76 | 19.584 |
| 280 | 22.4 | 20.16 |
| 287 | 22.96 | 20.664 |
| 302 | 24.16 | 21.744 |
| 310 | 24.8 | 22.32 |
| 315 | 25.2 | 22.68 |
| 320 | 25.6 | 23.04 |
| 343 | not declared | 24.696 |
| 358 | not declared | 25.776 |
| 360 | not declared | 25.92 |
| 400 | full-resolution check only | 28.8 |

All declared widths are covered and all actual minima exceed 16px. This review does not independently remeasure the full lesson's responsive container widths: no lesson-level browser was authorized. It verifies exactly the supplied product-width contract with the current app figure CSS.

All visible strokes, point fills, and text use `--ld-figure-ink`; paper uses `--ld-figure-paper`; disc fill uses `--ld-figure-accent-soft`. Hidden JSXGraph construction nodes retain unused literal default colors; they are not visible source elements or theme failures. In neutral/print, ink is rgb(21,32,31), paper white, and disc fill rgb(138,151,149) at opacity 0.18; in accent, the disc fill becomes rgb(21,160,106) at the same opacity. Both render the whole included region visibly and preserve all points and labels. fig-02/03 retain empty interiors in all three themes.

## Exact Snapshot SHA-256

All values below hash actual file bytes. Source hashes match `spec.source.image.sha256`; spec and SVG hashes match their current render reports. Every supplied authoritative-text entry matches the current template exactly. No approval attaches to a future changed file.

Common template directory: `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c1-s1/`.

| Context file | SHA-256 |
| --- | --- |
| lesson.template.json | `afd177bc831c2e39d8eed3f7ba4431d6bef2c8d18487d405151fcc101961f321` |
| exercises.template.json | `76e454a43bb0d01c2df3bea5086fa21a1fa37a26b42bbb43d5414373c03c7ea5` |

Source directory: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/`. Each author package is `.tmp/s10y-image/6-8g/fig-XX/`.

| Figure | File | SHA-256 |
| --- | --- | --- |
| fig-02 | source fig-02.png | `b0442a982d80f646508d6adfa2455f9148453e70025336a513c0ffcff43b10cb` |
| fig-02 | source-inventory.md | `87d35a73eaab40fd807c931aa0d2b5cedc4313964a72efb6251b42a837b2d63a` |
| fig-02 | fig-02.spec.json | `6f23c0eff13b354fe8b6d3463c6a6cf839f022dfcc50d72d5fb77912c7a9bcfe` |
| fig-02 | fig-02.render.json | `369b7a8128dacc2c7fbcd5c82299ab08ec75c16c4e1fe108a86e22b754952593` |
| fig-02 | fig-02.svg | `eb6e47bbb0cdac7bef2f7e4ffa2dbbe4db74535b3eca809c6dfe90472cc503fb` |
| fig-02 | fig-02.preview.png | `e8fe0ad704c9dd53ee9c7773daa6a805e483ba698cad1a975c4dce3746ef8b97` |
| fig-03 | source fig-03.png | `56afbfc8c1957dfbdbfb2aa01d1f8052790a5b8ff618bef121777ed1a95cfe6e` |
| fig-03 | source-inventory.md | `e8d807810fec69640d32c52eab55bf4b9052d658da3da40ac1c4bd5400363a94` |
| fig-03 | fig-03.spec.json | `9dd48ac9115a8247a1a5e38773ff893d17b7d694678eb92ad1f2a97d68445622` |
| fig-03 | fig-03.render.json | `e80b0c14402c91b48dcff646c5bec58e7bd99f9fb92a551668d23c9cde71c172` |
| fig-03 | fig-03.svg | `cb84ba8d53f42899a51c96ebbca38f014365db77234c92480b61a4f596528da7` |
| fig-03 | fig-03.preview.png | `2e70d8e2dbd3fa6657eedb54ac08ba1fc9823a4842e09da77d489138c5bd5d45` |
| fig-04 | source fig-04.png | `27be354e6caace98f8b84740f23921be1384941e20836eca63cbfc9962612b1e` |
| fig-04 | source-inventory.md | `97ee48945baac8193b092117b8b228f4a3c4d2bdfe3193f651e7dee240dd3e05` |
| fig-04 | fig-04.spec.json | `b938cb2f0849b4bffb6aa6f21a6206919787844f05d4d30a113c3ab6fda68454` |
| fig-04 | fig-04.render.json | `65912d1619b8fd5cf96691150a7bf6ee5983febde204ad87533a10522aa9e0c2` |
| fig-04 | fig-04.svg | `d3943d6e76920b93fa4d01149db727069c1b7842b48380d05315573724d82365` |
| fig-04 | fig-04.preview.png | `f1c8c1528f82610a78170beacc352a6ba9497c5cd67a1f9aaedc639c94b8dc8f` |

## Scratch Review Recording

After this substantive PASS, `record_review.py` wrote each package's `fig-XX.review.json` with status `pass`, using its current spec and render evidence and referencing this report in notes. All three recording commands exited 0. Its built-in binding/spec preconditions were part of that recorder, not a separately repeated renderer/validator stage.

The current render output paths identify scratch SVGs, not previews or promoted durable resources. These review records remain scratch-bound and are not evidence that durable-path promotion, manifest integration, lesson rendering, or publication has occurred. Any spec, render, source, or output change requires appropriate changed-snapshot evidence before relying on the corresponding record.
