# fig-74 Independent Review

Date: 2026-11-15. Ticket: STEMROBIN-180. Verdict: **PASS** for the current hybrid candidate. No affected repair unit.

## Independent Source Inventory

Opened the actual complete `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-74.png`, not a thumbnail or an author reconstruction.

- One rider lies forward on a low sled, head toward the left and legs toward the right. The sled has a curved/upturned front runner and a supported body above snow.
- Snow, hill/mountain, evergreen silhouettes and cloud strokes provide the winter setting. They are not a measured botanical inventory.
- One horizontal force arrow begins under the sled near its snow-contact level and points right. Its source label is F with Chinese friction wording.
- There is no source block, separate velocity/motion arrow, mass, force value, speed, tick scale or numerical relationship.

The final artwork preserves the rider, low sled, complete runner, snow and winter setting. It does not substitute a block for the source sled. The source force maps to `sled-friction-start`, `sled-friction-end`, `sled-friction` and `sled-friction-label`; natural content maps to `semantic-scene`. `source-friction-right` and `source-friction-connected` describe the actual overlay direction/endpoints.

## Frozen Text and Interpretation

Reopened the complete current s24 lesson/exercise templates, including all nine p blocks and seven exercises. Their actual bytes match the handoff and exact context-input snapshots:

| Input | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s24/lesson.template.json` | `abe61637a90bef1a81fce591e1cc606a1300dcb4b4aff5bc78a40b9061ebc0b3` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s24/exercises.template.json` | `42c92e76eb60f3bd427ef20ce77dbcee417925e476e2fac161edbcca73292c67` |

The entire 16-unit `source.authoritativeText` array equals the actual frozen p/exercise text. The actual generation metadata prompt embeds the same complete array as JSON; parsing that JSON confirms equality, including escaped paragraph newlines.

The modern leftward `Motion` arrow is explicitly declared as an addition, not source printing or measured velocity. It correctly illustrates the supplied sliding-friction direction relative to snow: motion left, friction right. Its direction is covered by `source-motion-left`/`source-motion-connected`, despite those IDs containing the word source; inventory prose makes the modern provenance explicit.

Both arrows have schematic 295-unit lengths. Equal drawn lengths do not compare force with speed or supply a physical scale. The diagram is not a full free-body inventory: absence of weight and normal arrows is not a claim those forces vanish.

## Actual Output and Visual Evidence

Read the complete spec, all objects/assertions, actual SVG/XML, render report, generation metadata, author report and handoff. Actually viewed:

- The original PNG once in full.
- Raw `artwork.png` and the separate final `fig-74.artwork.png`.
- Separate `preview-overlay-640.png`.
- All six existing `preview-{neutral,accent,print}-{306,640}.png` at their native bitmap dimensions in `independent-preview-sheet.png`; neutral306 was also opened directly.

The sheet is only a native-size composition of existing PNG screenshots, not a figure regeneration. Sheet SHA-256: `7f9e4cc6ff097ff81c61d9c91370385230952c417c8c9c095b853f1a7eec7749`.

**Visual PASS evidence:** the rightward F arrow originates at the sled-runner/snow level rather than at the rider's head or a nonexistent block. The entire rider, curved runner, rear sled structure and snow remain visible. The top Motion arrow and lower Friction (F) label are separated from each other and the subject; neither right tip nor bottom text is clipped. All three themes preserve clear direction and readable English labels. No Cyrillic, Chinese, Soviet symbols, uniform, flag, watermark, unlabeled extra diagram or answer equation appears in the modern output.

All actual PNG dimensions agree with the bound preview records: 306x253 and 640x530. Existing headless DOM evidence reports actual minimum font 17.18490566037736 px at306 and36 px at640; the render's ideal-width value is17.2125 px at306. The rounded-height difference does not cross the16 px gate. Both labels are visibly readable. Preview evidence reports loaded images, no overflow and zero nonwhite edge pixels, consistent with the full visual observation.

Hybrid layers have identical640x530 canvas alignment; the SVG is transparent and contains zero embedded images. The raw1536x1024 artwork is centered-contain fitted without stretching. Transparent margins in the separate final PNG are not a black-raster defect; all actual composed theme screenshots have the intended white background. Only the separate artwork and overlay are final candidates, not the flattened preview PNGs.

## Bound Candidate

These actual byte hashes match `author-handoff.json`, render output records and current files:

| Record | SHA-256 |
| --- | --- |
| Source PNG | `65255ee854934d5a8b7e9ed24c1e4475bd1090084581abb66fb737133181e972` |
| `spec.json` | `4310935082500f435639dabf3d88a706631a18e78a2ce523c55fdfe01f5c6ec7` |
| `fig-74.render.json` | `2483e18b94e28438536500512bd87f841e2739283f1434fe266ec8a292a200a5` |
| `fig-74.svg` | `9a0dab7e111880e92b4ecb3374ef209b7536d5c2f6572e269b4ecb1c7fbf06de` |
| `fig-74.artwork.png` | `c8e8c72de508dba3cd171c6e991f29894fc72389aecfeedfc395027eb1eb1e22` |
| Raw `artwork.png` | `c5ae9bd5bd80d64c22ed4534b5999a19dd20165f1e4bc126c93a04c22c353fdf` |
| `artwork.png.json` | `1a8ce72dc1c65be85f218fc3fa00bf49c3a772b183f6974950a760e659d59e8a` |
| `author-preview.json` | `ae7dcf08b019f36a958ce5a02834ef2ddfac2353f3f6c5ae58cb3cd7e3c1aa58` |

The stored generation prompt's historical sentence about a later block schematic is acknowledged; its artwork-only instruction forbids a block, and neither actual raw artwork nor final candidate contains one. That retained historical prompt is not evidence of a block in the final image. The source-correction snapshot is retained by the author and not relabeled as a fabricated quality FAIL. Repair budget recorded by handoff is0/1 used; no repair is requested here.

## Closure and Boundary

`review.json` is recorded with `record_review.py --spec spec.json --render fig-74.render.json --status pass`, binding actual source/spec/render and both outputs. Its notes point to this independent report. Author mechanical/visual PASS was not treated as independent semantic approval.

No answers/keys/choices were read. No source page/corpus or previously reviewed image was reopened. No author asset, spec, SVG, text or existing preview was changed; no author render, standalone validation, Azure/model call, browser/app/window, DB, Git, dependency or promotion action was performed. Existing isolated-headless preview evidence was inspected and reused; no headed/product-window claim is made. The record command's required internal contract/binding check is not a rerun of the author render workflow.
