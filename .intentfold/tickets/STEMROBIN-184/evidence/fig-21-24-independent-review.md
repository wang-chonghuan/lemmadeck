# Independent Source-First Figure Review: 6-8g s7, Figures 21-24

Date: 2026-11-15. Reviewer did not author these figures.

## Verdict And Scope

**PASS for the current scratch figure packages, all four figures.** No definite mathematical, source-object, tick/unit, label-placement, or cultural/texture defect requiring repair was found.

This is not promotion, a final lesson-manifest gate, or headed product-display approval. The current `figures.template.json` is still a draft with spec references, not a completed final-output manifest. No resource, figure, template, source transcription, answer, or product file was changed.

The four complete original PNGs were opened individually before inspecting author inventories/specs. The independent pixel observations below were then compared with the complete current s7 prose and exercise text, current inventories, all spec objects and assertion definitions, complete SVG XML, and full PNG previews. The author handoff was context only; its obsolete fig22 failure/hash information was not used as current evidence. No answer or choice files, other reviewer reports, or answer-derived constructions were used.

Current renderer reports were read and reused, not regenerated or rerun. The actual current fig22 240px browser PNG was opened. For figures21/23/24, there is no retained actual 240px PNG in the supplied packages: their full PNGs were additionally inspected as 240px in-memory raster reductions, with no file write or browser cycle. Such reductions are limited visual evidence, not fresh browser/SVG-transform or headed-display evidence.

## Independent Source Observations And Comparisons

### Figure 21: PASS

- Original: one upright triangle, X lower-left, Y upper-left, Z lower-right. Three solid sides; XY has three interior transverse ticks, XZ two, YZ four. These indicate four, three, and five intervals respectively. The inclined ticks are transverse to YZ, not vertical ruler marks.
- A separate lower horizontal OE segment has two short endpoint caps. There are five named endpoint locations/labels, nine triangle ticks, and two unit caps. There are no numerical side labels, arrow, right-angle square, filled region, or large independently drawn vertex circles.
- Current prose fixes OE as the unit and XZ=3, XY=4, YZ=5. Exact metric regularization is supported by that prose, not estimated from scan lengths.
- Current construction: X=(0,0.4), Y=(0,4.4), Z=(3,0.4), O=(1,-0.65), E=(2,-0.65). Thus OE=1; the three side lengths are 3,4,5 in that unit. All interior ticks occur at successive unit distances from the relevant side start. The YZ tick vectors are perpendicular to the sloping side.
- All five mapped points are covered by same-group distance/displacement relations. The 51 assertions include unit and side lengths, directions, side connections, all nine tick connections/on-side/unit-distance/transverse relations, unit segment/caps, and endpoint count. Count assertions were not substituted for relationship coverage.
- SVG/full preview retain the three sides, nine ticks and capped OE. Its five tiny coincident endpoint-ink ellipses are not new independent points or prominent extra markers. Visible SVG has 15 solid lines, five endpoint-ink ellipses, and exactly X/Y/Z/O/E text. No extra right-angle cue or numerical answer is displayed.
- Canvas400x560 uses an equal 80px/unit scale in both directions. Inline maximum320px; font32 becomes19.2px at240. All nine declared width checks pass in the existing report. The 240px raster reduction still separates all ticks, vertices, caps and labels.

### Figure 22: PASS, With An Explicit Typesetting Observation

- Original has two vertically stacked panels. Upper: O/E/M/A in that order on a horizontal ray depiction, distinct O/E/M solid dots, A at the far-right termination, a full curly OM overbrace, and x with a subscript M. No upper arrowhead, intervening unit ticks or numerical coordinate is printed.
- Lower: coordinate line p, B/O/E/A/M in that order; O/E solid dots, B/A at transverse ticks, numeral1 above E, and a positive-direction arrow near M. Seven transverse ticks correspond to -3,-2,-1,2,3,4,5. No printed0,-3,5 or separate large M dot is supplied.
- Current prose explicitly assigns lower B=-3, O=0, E=1, A=5. Upper M and lower M positions are unmeasured illustration positions, not numerical source givens.
- Current upper points have x=-2.8,-1.8,-0.3,2.5 at y5.5; lower B/O/E/A/M have x=-3,0,1,5,5.9 at y1.7. OE=1 in both panels. Positive gaps and collinearity preserve every point order in its own shared frame.
- The 37 assertions cover all nine mapped points within their respective groups, lower signed positions and unit ticks, the ray endpoints, positive arrow endpoint relation, numeral1 projection, and OM brace span. The brace itself is also visibly aligned over O and M; the equal-span assertion alone was not treated as proof of correct placement.
- The final current panel text anchors are exactly `panel-a=[-1.5,3.45]`, `panel-b=[0.25,-0.6]`. Both the full and actual240px PNG show separate panels with clear labels, complete brace, all seven lower ticks, and a visible rightward arrow. The current spec/SVG hashes match current render metadata.
- **Typesetting difference:** SVG and actual240px PNG display the literal single text run `x_M`, not a visually lowered M. This is a declared plain-text spelling of the same indexed variable; the surrounding prose uses `x_M` and the brace identifies OM unambiguously. No different variable, changed numerical value, or mathematical ambiguity is introduced. This review does not misdescribe it as a rendered subscript. It is nonblocking for the bounded source-semantic/legibility review, not a claim of facsimile typography.
- There are25 spec objects and14 visible labels. No extra upper arrow, lower signed-coordinate numerals, measurement answer or proof formula is added. Canvas800x640; font56 becomes16.8px at240, with all17 declared width checks passing. Current actual240px evidence resolves CSS-variable strokes; the obsolete resvg-only preview is not evidence for this verdict.

### Figure 23: PASS

- Original has four separate horizontal coordinate frames, each containing A/B/O/E, four labels above its line, one short upward E unit tick, and a panel marker. Orders are a:A/O/E/B; b:B/O/E/A; c:O/E/A/B; d:A/B/O/E.
- E lies to the right of O in every frame. Original c-O and d-A have hollow/outline markers; the other A/B/O markers are solid. There are no numerical coordinates, arrows, extra tick sequences, grid, dimension brackets or displayed distance formulas.
- Current prose uses the two opposite-side cases a/b and the same-side cases c/d to discuss `|AB|=|x_B-x_A|`. It does not assign exact A/B coordinate values here.
- Current relative A/B positions about O are a:-2.2/+2.6; b:+2.9/-3.3; c:+3.1/+5.9; d:-3.8/-1.9. Every OE interval is1 and positive. These unprinted exact layout distances are declared regularization; only their required order/sign facts are source claims.
- The25 assertions include each row's OE displacement, both A/B signed displacements, two collinearity relations, and E tick connection, plus total point count. Each of the16 mapped points has a mapped multi-point relation wholly within its own row group.
- SVG/full preview show all four shared frames,16 point labels, four English panel labels, four E ticks, solid markers and both hollow markers. E's tiny coincident anchor ink does not replace the source tick with a large separate circle. No labels or frames are swapped.
- There are28 spec objects and20 visible labels. Canvas800x800; font56 becomes16.8px at240, with all17 declared width checks passing. The 240px raster reduction preserves every row/order and readable labels; tiny hollow-marker interiors are less prominent there, so their exact marker form is supported by full PNG/SVG rather than an invented actual-mobile observation.

### Figure 24: PASS

- Original is one ruler with a damaged/jagged left end, intact right border and straight top/bottom. It must not be replaced by a restored zero-origin ruler or textured copy of scan noise.
- Independently observed printed numerals are exactly5,6,7,8,9. A aligns with5.2 and B with8.7. These are source tick projections, not readings imported from an answer. There is no additional AB dimension line, answer, subtraction, unit name or zero.
- Surviving separate ticks run from4.8 through10.4 at tenths:57 total, consisting of six long integer ticks5..10, five medium half-unit ticks5.5..9.5, and46 short ticks. The intact right border at10.5 is not a58th independent tick;10 has a long tick but no printed numeral.
- Current jagged frame retains the missing left end. Its top starts at4.78, right border is10.5, and the final separate tick is10.4. Current A=(5.2,0.64), B=(8.7,0.64), with top-edge projections at y0.5.
- All57 tick objects have x=n/10 for n=48..104. Their depths are0.38 at integers,0.28 at half units and0.18 otherwise. Every adjacent pair has a0.1 horizontal-spacing assertion. All ticks have explicit endpoint connection and vertical-depth assertions.
- The193 assertions also cover A/B parallelism and projections, offsets relative to printed major ticks, each numeral's alignment and inside-ruler relation, five full-unit intervals, and separate point/tick/numeral counts. A/B mapped relationship coverage is present. These facts are not inferred from a bare objectCount.
- Complete SVG contains57 tick lines plus nine frame-edge lines, two marked-point ellipses, the clean paper frame and seven visible labels A/B/5/6/7/8/9. Every numeral lies within the ruler under its own major tick; the half-unit hierarchy is present, not omitted. All source strokes are solid; no hatching/dash distinction or source cultural symbol is invented.
- The full PNG and240px raster reduction show readable numerals, both endpoint projections, uniform divisions, three tick lengths and a visibly broken left edge. No scan texture is reproduced. Current exercise66 explicitly asks use of a ruler damaged at one end, consistent with this construction; no distance answer was computed or added in this review.
- There are65 spec objects and seven labels. Canvas800x320 uses125px/unit equally in both directions. Numeral font56 becomes16.8px at240; A/B font64 becomes19.2px. All17 declared width checks pass.

## Package, Display And Cultural Checks

All four source image hashes in current specs and the current draft figure manifest match the actual original PNG bytes. The current spec text matches the relevant current s7 prose; figure24 additionally includes current exercise66. Figures21/22/23 are referenced in prose and figure24 in exercise66; all four are in the lesson figure list and draft figures template. There is no missing or surplus figure in this assigned package.

The source-first inventories agree with the independently observed objects and relationships. Modern additions are explicitly limited to clean geometry, regularized unmeasured spacing, mathematical label styling and English panel names; they are not misrepresented as numerical source data. No solved exercise value, coordinate formula or answer-bearing extra annotation appears in any output.

Visible SVG text is English mathematical lettering/numerals/panel names. Visible strokes/fills use semantic `--ld-figure-ink` and `--ld-figure-paper` CSS variables. Hidden JSXGraph construction scaffolding is not displayed source content. There is no copied handwriting, old-book texture, Cyrillic panel label, cultural decoration, or unsupported solid/dash/hatching addition.

Existing reports show empty collision lists and every declared display check passing. Figure21 declares240,242,272,280,287,302,310,315,320px; figures22-24 additionally declare331,343,358,360,400,480,560,640px. All observed full compositions and the available small-width evidence are nonblank and free of missing labels/objects or visible clipping.

No new headed media-width measurement, alternate-theme screenshot, scroll test, offline lesson render, or final-output manifest validator was performed. These remain outside the authorized scratch review and are not silently marked complete.

## Current Snapshot SHA-256

Paths below are relative to repository root. Figure package root is `.tmp/s10y-image/6-8g/fig-N/`; originals are `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-N.png`.

| Figure | Artifact | SHA-256 |
| --- | --- | --- |
| 21 | original PNG | `c2e6c0f32b9fd4aae71346e37c45c6f2411acb7ec7a0eb45add713d7d5abf34b` |
| 21 | fig-21.spec.json | `46e09ace4f6754eb4386c9db48aed8d99d872e87e35604a7fe7afb30ee5162a0` |
| 21 | fig-21.render.json | `aef3873cd04a8d243ee2e24b884afd89adecd00a6425a23e92bfcefb87448ea2` |
| 21 | fig-21.svg | `34c04da7fa9dd45820396acd6b1c9a4c80a495252e6010ea4e7e7dc280c6d83b` |
| 21 | fig-21.preview.png | `4e4c192aa9dbe750e10d6d5f78e90855a0519a974c70d8848a61541f25ee0167` |
| 22 | original PNG | `fb0145cbd22dab9925d91430cc3fae9148a9248b3641a4c3d1081db524234476` |
| 22 | fig-22.spec.json | `b1100b4f793565aaec800d28ffad56081519c77f9dba73de9d31ae5ab0b775ae` |
| 22 | fig-22.render.json | `b63d0ee2f42c86dd2d2920f9d398470dfcdb4b8fb09d31ab11cb78d02257875b` |
| 22 | fig-22.svg | `837e0a34f910a467950c904af77d53adeaa5cba9fb7b54ee059e49fd7bcd045a` |
| 22 | fig-22.preview.png | `fd4b0ba2e2cc0e0c18dff21afdc60946b1ea1fbf5b73b0dc68bb951bd30871fa` |
| 22 | fig-22.mobile-240.preview.png | `babf159318f6703e70bd6444b6eab30699410c7105166858598f3bdffa31f707` |
| 23 | original PNG | `caa9d18f7a01c7195f738640b0731bbd2a0f93a1d09fda08b08703435234612d` |
| 23 | fig-23.spec.json | `2af0e757ac995578f9f04511780dd43ee401bc23114e63c49bb6c98e30ddcac4` |
| 23 | fig-23.render.json | `7b204b43c9dc85df87c5a270bc266212032ae9270deaa1b524e06b3ddb9081dd` |
| 23 | fig-23.svg | `124721314492b66a507d576d2c4517ff5a3b39f8c1d2ffbef2f06bbb35c4a7ea` |
| 23 | fig-23.preview.png | `737e45692c8f31bb81f78450dc579e8d598cfdbc67923045a8357d15b15ffb1d` |
| 24 | original PNG | `d678155ec1ecdcd3573c24eeb8b28c787982cc90cdf3a674eee0bd5deba436f2` |
| 24 | fig-24.spec.json | `86343e96000524ff858c742e08d94bd717b84d8c6846c9bccc65c882b4c85add` |
| 24 | fig-24.render.json | `6c66f660de0ec3b1dd18363ee67966166c070211369d4e747319dd66f8927d2c` |
| 24 | fig-24.svg | `84bc742e95c07f19debdbebf8a8ddaddc71bacaa7233835f58bb01add61b9231` |
| 24 | fig-24.preview.png | `e6fac3f2f7add649121b67f4b6daf475a8e16fcc8cc0f0a41cf035b34c18904a` |

Current text/manifest root: `.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c1-s7/`.

| Artifact | SHA-256 |
| --- | --- |
| lesson.template.json | `e6c1e491b1b2522eaf9af6c1bc741f86770fdecc636fe73fa73c665bb8917136` |
| exercises.template.json | `075750b6ab321d449e3ed344c5b9bcd26d9b7c6bdc2c3360bb7c1d995a7df6fb` |
| figures.template.json | `c23e1c6d0e44d1fc50592b03f2c48a08f467b778e885c088edf18c18e254c4a6` |

## Scratch Review Receipts

Completed: `record_review.py` was invoked once for each approved figure, with its current spec/render, `--status pass`, and scope/limitations in notes. All four commands exited0 and returned `PASS`. The separate `ld-s10y-image/review@1` files were read back; their source/spec/render/SVG digests match the snapshot above.

| Scratch Review Path | Status | Review File SHA-256 |
| --- | --- | --- |
| `.tmp/s10y-image/6-8g/fig-21/fig-21.review.json` | PASS | `1e1ddbfef5263e6434381e935aea918af7a82a0015996ffdd57656d9abc7adb3` |
| `.tmp/s10y-image/6-8g/fig-22/fig-22.review.json` | PASS | `c16fddfa8f3373ccb0a2cc2439d59b93c39f22454215b6a6930cb7c693e1adc5` |
| `.tmp/s10y-image/6-8g/fig-23/fig-23.review.json` | PASS | `f79d66a546ddbc7d53b09247a1fe338b7dc2b54ac6aebccfef973203892d8d8d` |
| `.tmp/s10y-image/6-8g/fig-24/fig-24.review.json` | PASS | `02a40c9e1639ea5e44dd37e6b8a045a9402d0edcf731a16f26d1bab7b7b04568` |

The recording helper's own current-spec/output checks were part of authorized recording; no standalone validator, renderer, browser cycle, lesson display or full test was run. Only this report and the four scratch review records were written. No promotion occurred. Stop here; a changed fig05 package has not yet been authorized as ready for its queued changed-only review.
