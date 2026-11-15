# fig-65 Independent Review

Reviewer: Sagan; independent_agent; not the figure author.
Date: 2026-11-15. Verdict: **FAIL / revise**. Render PASS does not establish source fidelity.

## Scope And Actual Viewing

- Reopened `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-65.png` at original resolution, independently inventoried its pixels before comparing the candidate.
- Read the complete upper-level modern s20 `lesson.template.json` and `exercises.template.json`, current `spec.json`, `fig-65.render.json`, author report and inventory. No answer keys or choices were read.
- Actually viewed complete `fig-65/preview-sheet-306.png` and `preview-sheet-640.png`, including the support, entire backing, empty hook, loaded hook, weight and bottom loop. These sheets also contain 66/67; each figure was judged separately.
- Loaded the byte-current SVG into an isolated local Chromium document in memory, applied semantic accent and black/white print CSS, and inspected the full 306 px image in both themes. All network requests were blocked. No author renderer, product app, or on-disk preview generation was run.
- Existing per-figure preview metadata binds the current SVG at actual media widths 306 and 640 px. Local theme viewing independently measured 306 px and minimum text 17.2125 px; current 640 px evidence reports 36 px.

## Independent Original-Pixel Inventory

1. Two vertical constructions: left unloaded, right loaded. The original right drawing starts higher; this is not a shared numerical plotting frame.
2. Each includes a horizontal upper support, suspension hook, tall backing, suspended spring, downward thin rod, lateral pointer at the spring/rod junction, a lower transverse guide near the backing bottom, and an external bottom hook.
3. Left spring is shorter; pointer meets the only mark, `0`; bottom hook is empty.
4. Right spring is longer; `0` lies above `1`; the pointer meets `1`. The lower hook carries one rectangular weight with a further lower loop/hook.
5. Original lower guides stay at essentially the same position relative to their respective backings. Visually, they are both just above the backing bottom, despite the different top positions and spring elongation.
6. No legible Latin subfigure letters, `N`, mass inscription, values `2`/`3`, or decimal ticks occur in these source pixels. Exact coil count is not recoverable from the merged dark winding.

## Substantive Finding F65-1

**The candidate makes the lower guide move with the rod instead of retaining the source's backing-relative guide position.**

- Original raster identification, approximate pixels only: left guide is near y304 with backing bottom near y317; right guide near y272 with backing bottom near y286. Both guides are near their own backing bottoms. These are image-location observations, not physical measurements.
- Candidate backings are deliberately aligned and have identical limits, user y760..240 (SVG screen y140..660).
- `a-lower-guide` is at user y330 (screen y570), whereas `b-lower-guide` is at user y270 (screen y630). Thus the guide moves down 60 drawing units along with the pointer and hook, while the backing remains fixed.
- The author's inventory explicitly describes moving the guide with the pointer. Declaring this a modern regularization does not justify changing the fixed/moving apparatus relationship visible in the original.
- Both 306 and 640 px previews make the different guide-to-backing-bottom distances visible. This is not a label collision or missing pixel, and the current spring/rod assertions do not test the guide's backing-relative position.
- It can teach that the guide is another part attached to the moving rod, rather than the fixed lower guide through which the rod travels. This fails source apparatus fidelity even though the principal pointer/scale relationship is correct.

Minimum affected repair to request from main: keep both lower guides at the same backing-relative level near the bottom; move only spring end, rod, pointer and load hook with the load. Correct the corresponding inventory claim and bind the fixed-guide relationship. I did not edit the candidate. Repairs used by the author: 0/1; any repair requires main's authorization and a bounded affected recheck.

## Other Checks

- Both subfigures, support/suspension, spring-to-rod junction, pointer, hooks, weight attachment and final lower loop remain visible; the loaded hook and attachment meet visually, without a detached weight.
- Same schematic coil count, longer loaded spring, unchanged rod length, zero-above-one order and pointer-to-one alignment are retained. The 60-unit interval is drawing geometry, not a physical length.
- Latin `a/b`, `N` and `102 g` are declared modern annotations supported by the full lesson; they are not source-pixel inscriptions. The lesson's rounded classroom calibration is not treated as exact metrology.
- No completed decimal scale, extra calibration state, numerical answer or multiplier has been added. Figure identification and the already-given calibration data are not new answer-key content.
- Eight English/symbol/numeric labels are legible and unclipped. Entire right and bottom edges are present; current render reports zero collisions and both preview records report zero ink in the outer two-pixel border.
- Visible strokes/fills use semantic CSS variables. Accent and monochrome print retain the apparatus, weight and labels; hard-coded renderer helper colors occur only on nonvisible elements, not visible figure content.
- No Chinese/Cyrillic inscription, flag, uniform, national identity or decorative historical texture survives.
- All three specs' authoritativeText arrays were compared exactly against all seven modern paragraph blocks and four written prompts; fig65's comparison passes. The six figure/caption blocks were also read in the complete 13-block prose array. This is contextual text checking, not renewed approval of the already-reviewed lesson.

## SHA256 Bindings

Paths below are relative to `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

| Input / Evidence | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-65.png` | `e9d2d6384e359cfe54b18ef0092c621b11b08409661182293fdefe3eada063a4` |
| `.tmp/s10y-image/6p/fig-65/spec.json` | `5760745a460d4d1520d8270707af1e2a9a7bec883e89212ff87176ca0f562c68` |
| `.tmp/s10y-image/6p/fig-65/fig-65.svg` | `cb9932608e84db3f0c895ae8d0ec774124ad524e66f967467ee26fd822d97657` |
| `.tmp/s10y-image/6p/fig-65/fig-65.render.json` | `68fda9cf7ff7cb6a6fae20a12ef179cc639e40431ae3d7ded193e9a2bfb34a2c` |
| `.tmp/s10y-image/6p/fig-65/preview-306.png` | `18039dda509cee98fb7c23b99159d348ba2d3bb572297cd6cf9dcdb0cdec7df1` |
| `.tmp/s10y-image/6p/fig-65/preview-306.json` | `2dd16642801b99e7f3234bce61ec6fb45fa91050408fa6dcc6d66027bc0886e9` |
| `.tmp/s10y-image/6p/fig-65/preview-640.png` | `75606ce27d1f7c37e29415b120cc23fbc9ac10b82975a442807080166c3ae155` |
| `.tmp/s10y-image/6p/fig-65/preview-640.json` | `059fe3275435a9c61ca546656bfac0d307efe9f82c7692824a0ae6b745285340` |
| `.tmp/s10y-image/6p/fig-65/preview-sheet-306.png` | `a85a0fbcfec143273e838e6cd9f3d50b0113b954a11a9e7ad7a5d8c6b715e6c9` |
| `.tmp/s10y-image/6p/fig-65/preview-sheet-640.png` | `5d6ffb4bfabd78da16c743525e2ac7ad4e4806c983bf29f062a1eb05f3f087f5` |
| `.tmp/s10y-image/6p/fig-65/author-report.md` | `04dd01e03d03b5c7b66f484f5d0a280509921c43e4a6830d001dc62028b3db3e` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s20/lesson.template.json` | `154731b18ac6f73c87af461fe38488c2abdb90bfbfb3fe9d99d53fa98e50dc35` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s20/exercises.template.json` | `dfb3f54e334ef086316ec946da06eb77d532f9edf5b0e4f370aa175e056010ea` |

Hash-bound `review.json` is recorded with status `fail` by the existing recorder. Scratch review only; no promotion or whole-lesson/offline approval. Exact deployed model, reasoning setting and observable token count are not exposed to this reviewer: unknown. No external model call was made.
