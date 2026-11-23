# N35 Independent Figure Review: fig214 + fig215

Aggregate status: **pass**. Figure 214: **pass**. Figure 215: **pass**.
No current findings. This is a bounded independent figure review, not
whole-lesson acceptance, answer review, canonical promotion or publication.

Cwd: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`

Owned directory: `.intentfold/tickets/STEMROBIN-188/tmp/n35-fig214215-independent7`

## Review Basis

The original source inventory was sealed before modern disclosure and remains
byte-identical at mode `0444`. No source image was reopened. Current retained
specs, SVGs, render/relationship/validation reports, full approved text templates
and display report were read. Combined desktop and mobile screenshots were
each opened exactly once.

Manifest SHA-256 matches the direct disclosure. Its author tmp paths resolve to
the same relative files under the retained `fig214215-author7` evidence folder.
Actual retained files were inspected and hashed. Intended future edition paths
in current render metadata were not mistaken for the inspected candidate paths.

## Figure 214

Both vertically stacked source subfigures are complete: eight named point
occurrences, four A/C origin dots, four named rays, two extended AC transversals,
two distinct parallel-support pairs and two selector bands.

| Group | Independent source requirement | Current media comparison | Status |
| --- | --- | --- | --- |
| Upper / a | A above/right of C; AB and CD down-right on distinct parallel supports | Preserved in coordinates, SVG and both screenshots | pass |
| Upper / a | A/C on AC; B/D strictly in the same halfplane | Preserved; signed cross-products have the same nonzero sign | pass |
| Upper / a | A/C labels upper-left; B/D above remote right trace regions | All labels and both origin dots visible, without collisions | pass |
| Upper / a | AC extends beyond both origins; selector beneath diagram | Both extensions and a band present | pass |
| Lower / b | A above/right of C; AB down-right; CD up-left on a distinct parallel support | Preserved, not changed into two right-going rays | pass |
| Lower / b | A/C on AC; B/D in opposite halfplanes | Preserved; signed cross-products have opposite nonzero signs | pass |
| Lower / b | A upper-left, C lower-right, B below right trace, D above left trace | All transported label sides and dots preserved | pass |
| Lower / b | Extended AC and b selector below | Both extensions and b band present | pass |

Direct coordinate review uses the current spec's mathematical y values:
upper `cross(C-A,B-A) = 27236.625` and
`cross(C-A,D-A) = 33861.75`; lower values are `19535.625` and
`-19535.625`. Parallel direction determinants are zero; nonzero side tests
also distinguish the supports. These are candidate coordinate facts used to
check topology, not source measurements.

All 20 native assertions were read against their actual references:
2 parallel, 8 collinear and 10 connects. AC endpoints and continuation tails
are collinear; connections preserve their named starts/ends. All eight point
occurrences have within-group relationship coverage. The 15 bound supplemental
checks cover origin order, distinct supports, halfplanes, ray order,
continuation sense, panel order, label language and minimum size.
Existing validation has exit code 0, status pass; current render is pass
with zero label collisions. Neither tool was replayed.

Actual SVG has four origin markers and ten text labels. B/D text remains
visible on hidden marker anchors; no separate remote dots or finite endpoints
are invented. SVG coordinate inversion agrees with the spec. Shortened
continuation shafts are completed by renderer-owned arrowhead markers.
Both opened screenshots are nonblank, complete and unclipped.

## Figure 215

All three source rows remain on their respective common-line frames:
one nested row in a, followed by the two opposite-direction rows grouped
under one b selector. Twelve point-label occurrences, six A/C origin dots,
six named rays and both selector bands are present.

| Row | Current role order | Ray topology and label bands | Status |
| --- | --- | --- | --- |
| Upper / a | A at x140, C at x260, B/D transport anchors at x360; y=-65 | Both rays right-going; CD properly inside AB. Upper labels A,C,B; D below the same right-end band | pass |
| Middle / b upper | D40 < C142 < A260 < B362; y=-204 | CD goes left, AB right; disjoint. Open C-to-A gap belongs to neither ray. All labels above carrier | pass |
| Bottom / b lower | D40 < A142 < C260 < B362; y=-288 | AB goes right, CD left; intersection is closed segment AC; neither contains the other. All labels above carrier | pass |
| Selector bands | a after the upper row and its D band; b beneath both lower rows | One a row and two b rows; no extra third panel | pass |

The carrier left of upper A remains visible. The thin common carrier in the
middle origin gap does not imply ray membership. Each lower row retains its
own support, not a shared global carrier. Coincident top-row continuation
tips correctly depict the two overlapping right-going rays.

Aligned B/D transport anchors are a declared layout choice. They do not
resolve the sealed source UNKNOWN for B=D or a strict B-versus-D point order.
No equality assertion, independent remote B/D dots, numerical length or
finite endpoint is added.

All 21 native assertions were read: 12 collinear and 9 connects, seven per
row. Point roles/tails share each row's y value, and arrow/support connections
match actual object references. All twelve point occurrences have native
within-row relationship coverage. The 13 bound supplemental checks cover each
row's order, direction and topology, the split upper B/D bands, shared b
selector, label language and minimum size. Existing validation exit code is 0,
status pass; current render is pass with zero collisions. No replay occurred.

Actual SVG and both screenshots show six origin dots and fourteen labels.
Neither remote labels, any row nor either selector is missing or clipped.

## Text, Leakage And Display

Both specs losslessly bind the **complete** approved lesson and exercise
templates: decoded `fullJsonText` equals actual file text, declared SHA
matches actual bytes, and parsed JSON is equal. The binding field is
`source.authoritativeText`. Approved fig214 a/b halfplane definitions and
fig215 a/b containment definitions agree with these figures.
Other fig216-218 text remains provenance only; no other figures were opened
or unrelated theorem illustrated.

All actual SVG text nodes are only A/B/C/D and approved modern a/b tokens.
Screenshot headings are English. No source-script/cultural symbols, numbers,
computed answers, keys or solution labels appear in either media.
No answers or keys were consulted. The displayed source-authorized definition
relations are not new answer-bearing annotations.

Modern continuation arrowheads, a/b selectors, thinner neutral carrier traces,
label spacing, trace limits and transport-anchor alignment are disclosed
regularization. They do not identify original script, glyphs, printing,
dashes, exact arrowheads, metrics or upper B/D point coincidence.
All original UNKNOWNs remain unchanged in the original sealed inventory.

| Actual media width | Figure 214 minimum label px | Figure 215 minimum label px | Evidence | Status |
| --- | --- | --- | --- | --- |
| 331 | 16.5498046875 | 16.549479166666668 | Existing narrow-product display report and current renders | pass |
| 358 | 17.89990234375 | 17.899305555555557 | Mobile screenshot, display report and current renders | pass |
| 400 | 20 | 20 | Desktop screenshot, display report and current renders | pass |

Both specs declare `inline`, `instructional`, `maxWidthPx: 400`,
`minTextPx: 16`, and widths `[331,358,400]`. Existing headed evidence reports
actual media widths, not only viewport widths: desktop viewport 640,
mobile viewport 390, narrow-product viewport 363.
No extra narrow screenshot was generated/opened.

Every reported label footprint is inside its media. All three display views
report no document overflow. Opened screenshots independently show complete
geometry, clear label bands and no collision, horizontal clipping or blank
rendering. Visible SVG colors use semantic ink/muted/paper variables.
Structured XML inspection finds no scripts, foreignObject, raster image or
external resource reference. Hidden renderer placeholder paths are not
visible theme colors or instructional content.

## Preserved Evidence

Original inventory bytes, source UNKNOWNs and producer files remain untouched.
The disclosed manifest retains two read-only discovery failures, the fig214 r1
331px-width validation failure, fig214 r2 label-collision failure and fig215 r1
origin-label collision failure. The current approved-width and repaired-label
candidate passes; earlier failures were not erased or relabeled as passes.

Render/display metadata portability preceded this disclosure. Its unchanged
spec and SVG hashes agree with current actual files. Metadata-only final-path
changes are not geometry changes and did not cause renderer/validator replay.

## SHA-256 Bindings

Paths in `review.json` are exact repo-relative paths resolved from the sole cwd.
The abbreviations below are for this table only:
`E = ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n35`,
`B = ssot-resources/soviet10year-textbooks/artifacts/6-8g`,
`O = .intentfold/tickets/STEMROBIN-188/tmp/n35-fig214215-independent7`.

| Actual file | SHA-256 |
| --- | --- |
| E/fig214215-author7/manifest.json | `e0dd074bc147fc53cfa228aec656b8fd60a251d4edc777e575d954bcb472f04b` |
| O/source-inventory.json | `ca706af8c04198e5872e8e5b2ab5c9960081bc34c977fd2cc38400f86673ebb6` |
| O/source-inventory.md | `dee2a9c341d06cc6d9f8487ac19fdd158eeaaa661a71144448bff828052bb2d1` |
| B/figures/fig-214.png | `e0d8ba40c4187dbbbd0ef04ddc4e2853ea493b642454a90143f1523e50a5420d` |
| B/figures/fig-215.png | `48cb9eb30c45b7820137ab424f0b1a2b6ce956f0bc17b3a8186026b5c2fd6461` |
| B/lessons/geo68-c3-s2-n35/lesson.json | `06daaf76cd0a2915fd089b563086ffb37fc7ce8545048d4fd9a3c9c7b1247ada` |
| B/lessons/geo68-c3-s2-n35/exercises.json | `6f8fe3ef2022c0bc446bd7f3a1214ce599db37c47351c4a37c44a1e387b436c3` |
| E/text-author7/lesson.template.json | `e4adb032a0171cb919edd7204b1caa319c16a3813d21966859c39396344c038d` |
| E/text-author7/exercises.template.json | `0f103a9b9f71b52f767a31c65f0d739ade98e15314935decf84a65ccfff3ca81` |
| E/fig214215-author7/figures/fig-214.spec.json | `f5694f248dfb79090e1ab1f47ff2f39ed053b87a7d3546d8fb247e944c4894bd` |
| E/fig214215-author7/figures/fig-214.svg | `e684311b07c107faeb16a621683537a6018411eb9df154740a5a483bc18a26ef` |
| E/fig214215-author7/figures/fig-214.render.json | `f0b1be7211b8de98ab60857b52c8b22b992eec8521774ec60b9f343ce29ec471` |
| E/fig214215-author7/figures/fig-214.relationships.json | `595fbae4a0bd060fe4aa68f87fe96a381e4ff6172e5ae3d8cc91295b5c0a4801` |
| E/fig214215-author7/figures/fig-214.validation.json | `d823af2e1dc9c687366000a18c000fcd4315497fe087299d2b8aa7f34d44ca06` |
| E/fig214215-author7/figures/fig-215.spec.json | `c6e957a6bd2c4aafd770404880b76b3b9b4fffcd54cc06e2e94335827354a82d` |
| E/fig214215-author7/figures/fig-215.svg | `393c0c901873ec20b7d4c763a00f7a7700b62ea26dcbb9ec24b7dbc9be690624` |
| E/fig214215-author7/figures/fig-215.render.json | `9980caf769b1306b546effaf3193f69cc6c28dbdf8c349b7d0d4eb67923e5cf0` |
| E/fig214215-author7/figures/fig-215.relationships.json | `af88a5f3409adec2447eaffbbb6f21a9e2bb1b404cb65bf842a6a6a9d7f0991a` |
| E/fig214215-author7/figures/fig-215.validation.json | `325ff63d2ce6888f535fb07a851850360536191788157a066a7db4c998aab3ee` |
| E/fig214215-author7/desktop.png | `3d70fd698f2082244cb4bae0c4193c6ab49a165a22bd182988afb86b2e688a06` |
| E/fig214215-author7/mobile.png | `2fe23376b3962f0a42deca822d2f7b477f9f2426cb23fa7d4ff029ab565f175a` |
| E/fig214215-author7/display.report.json | `65a553935f00621c0dbf657e220af7246ded6eb11d9ed970ece32d466a94859b` |

## Actual Reviewer Counters

| Counter | Actual |
| --- | --- |
| Original image openings, cumulative | 214 once; 215 once |
| Original openings during comparison | 0 |
| Combined screenshot openings | Desktop once; mobile once |
| Batch/context image loads | 4/8; 4/24 |
| Reopens / crops / source pages / other batches | 0 / 0 / 0 / 0 |
| Native source pixel views / combined screenshot pixel views | 2 / 2 |
| Shell raster decodes / SVG image loads / native SVG display instances | 0 / 0 / 0 |
| Read-only SVG XML parses | 4 |
| Browsers opened / owned / close calls | 0 / 0 / 0 |
| Native app control / generated screenshots | 0 / 0 |
| Renderer / validator replay / record_review / finalizer | 0 / 0 / 0 / 0 |
| Whole-lesson tests / canonical reads or writes / DB | 0 / 0 / 0 |
| Environment inspection / network / install | 0 / 0 / 0 |
| Git / worktree / chat-peer-supervisor actions | 0 / 0 / 0 |
| Answers/keys / other batch reads | 0 / 0 |
| Actual bound input files | 22 |
| New review files / original inventory edits / producer file edits | 2 / 0 / 0 |

Producer image/native/browser counts in its manifest are separate historical
evidence, not reviewer actions. Its display report records `browserClosed:
true`. This reviewer created no browser and has no owned browser to close.

Both new review files are to be sealed `0444` before handoff. Original
source-inventory seals remain unchanged. Review ends here for this exact
hash-bound candidate.
