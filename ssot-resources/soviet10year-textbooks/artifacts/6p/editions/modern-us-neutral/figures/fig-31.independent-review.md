# Figure 31 Independent Review

- Verdict: **PASS**, current scratch candidate only; no promotion or whole-lesson approval.
- Reviewer: Sagan, independent reviewer in this chat, not the artwork/spec author.
- Date: 2026-11-15.
- Scope: fig-31 only. No answer keys, choices, other figures or tables were inspected for this review.
- Read the image skill and cap4 quality gate. Compared the actual source pixels, complete current modern s3 lesson and all eight exercises, spec, generation provenance, rendered layers and full compositions. Render PASS was not used as a substitute for this comparison.

## Independent Source-Pixel Inventory

Actually opened `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-31.png` (1120 x 578):

1. Lower-left aircraft, complete fuselage/wings/tail, pointing upper-right. A long oblique, segmented arrow extends from its nose toward the upper-right.
2. Upper-right passenger car, facing left, with a separate short solid leftward arrow and a horizontal ground stroke below its wheels.
3. Lower-right cargo truck, facing right, with three visible wheel/axle positions, a separate shorter solid rightward arrow and a horizontal ground stroke.
4. Separate lower-left horizontal reference segment with the printed value/unit `200` kilometres per hour. Its ends have thick upward pen strokes. No printed individual vehicle speeds, point names, coordinates or time intervals.

The two ground strokes and rough reference end strokes are source presentation details, not measured roads, axes or additional given distances. Their omission in the clean modern composition does not remove a physical condition. Contemporary vehicle colors and increased vertical separation are modern presentation changes, not source facts.

## Substantive Checks

- Objects and direction: PASS. The artwork contains exactly an aircraft, left-facing passenger car and right-facing three-axle truck, with complete wings/tail/body/wheels. The deterministic arrows retain the corresponding upper-right, left and right directions. Arrow origins are beside the correct noses, not attached to another vehicle.
- Length and scale: PASS at the precision of this ungraduated hand-drawn source. Independently enlarged the reference ends and all three arrows. The reference's coarse outer ink bounding box is not its endpoint-to-endpoint centerline length. The latter is approximately 100 source pixels; the aircraft arrow is approximately 390 pixels, and the two road-vehicle arrows are roughly 60-70 and 40-45 pixels. Thus the source supports about four reference lengths for the aircraft and less than one for each road vehicle, car longer than truck.
- Current spec endpoint lengths divided by the 75-unit reference are `sqrt(247^2 + 167^2)/75 = 3.9754356854`, `49/75 = 0.6533333333` and `31/75 = 0.4133333333`. These preserve the observed source proportions; the visible arrowhead tips were checked, not merely the shortened SVG shafts. These are construction ratios, not claims that the source supplies exact individual speeds or exact measured endpoints.
- Units: PASS. The only visible text is `200 km/h`, correctly translating the source reference. It is not `200 m/s`, the different quantity appearing in the preceding worked unit conversion. No additional vehicle speed is printed or attributed to that worked example.
- Text/conditions/leakage: PASS for this figure's use in s3. Read the full current lesson, including uniform-motion definition, `v=s/t`, unit conversion and magnitude-plus-direction discussion, and all eight questions/exercises. Fig31 illustrates the last discussion; it adds no numerical solutions to the written exercises, no named route, elapsed time, inferred destination or calculated vehicle speed. The segmented aircraft vector is not rendered as a traveled route or a trail of multiple aircraft.
- Culture: PASS. Contemporary unbranded aircraft/car/truck, no flags, insignia, Cyrillic/Chinese lettering, uniforms, city names or archival texture. Vehicle illustration details are not asserted to identify a historical model.
- Hybrid layers: PASS. Opened both the generated artwork and fitted artwork layer independently. Visually opened the SVG overlay alone, then independently recomposed the actual artwork and overlay in local headed Chromium. The overlay has no image nodes and contains the three arrows, reference and one English unit label. It does not depend on hidden markings in the raster.
- Contain/alignment: PASS. Generated artwork is 1536 x 1024; fitted layer/canvas is 960 x 640, the same aspect ratio. Actual local composition used centered `object-fit: contain`; image and SVG occupied the same 300 x 200 and 480 x 320 frames. No stretching, cropped vehicle, clipped arrowhead, label overlap or layer registration error was visible.
- Readability: PASS. Actual label screen sizes were 16.25px at 300px and 26px at 480px, fully inside each frame. Author's 306px preview was also opened; the current render reports 16.575px there. The small road-vehicle arrowheads remain visibly directional at 300px.
- Print: PASS for semantic ink-on-paper rendering. Actually opened the author's print previews and independently recomposed print-media views at 300/480px with the semantic ink changed to black. Label/arrows remained legible. Author neutral/print preview pairs are byte-identical, and colored raster artwork remains colored; this is not evidence of a separate grayscale raster conversion or a production/offline print test. Understanding the diagram does not depend on vehicle color.
- Provenance: PASS. Checked actual source/spec/render/output/asset/metadata bytes against recorded hashes. Metadata records an edit generation using the actual source reference and the local prompt. The prompt includes relevant modern text, not the whole lesson; this review separately read and compared the whole current lesson/exercises. No model service was called during review.

## Repair and Validation

The retained `spec-render-rejected-1.json` and `render-rejected-1.md` record the first render failure (unsupported truck arrow marker aspect ratio). A structured comparison verified that the sole render repair was `truck-arrow.strokeWidth: 6 -> 4`; endpoints, reference scale, text and artwork did not change. The thinner current truck arrow is still visible and its length/direction are preserved. This review made no further repair.

Actual `validate_spec.py --stage rendered --json` returned exit 0 and an empty error list. Current render reports PASS, 14 objects, one label, no collisions and centered contain. The official hash-bound `record_review.py` is used only after the substantive PASS above. That scratch review is not authorization to promote without the later durable-path and lesson/offline gates.

## Opened Evidence and SHA256

All paths below are relative to `/Users/yong/.codex/worktrees/0f12/lemmadeck`. Hashes are actual file-byte SHA256, not invented canonical digests.

| File | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-31.png` | `9e047ee0b94f9fe1c9cd36aab5216e6c10309a9711dc6e445872327d95a12dcd` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s3/lesson.template.json` | `ff221a628ba8b3660840423b177022a4b6be75e5462e51ca4faf37a7afb85ce1` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s3/exercises.template.json` | `8afd051e7df7fe548187467663f2c76d517c461e91d6fc50bfe01cec284562f5` |

The remaining files are in `.tmp/s10y-image/session-c-batch-2/fig-31/`:

| File | SHA256 |
| --- | --- |
| `spec.json` | `727049832c6ba1cba7431479bd2629bb38146599862736efd9b619b90b39318c` |
| `fig-31.render.json` | `1451ad9c68d4c2b5ba7028920e6d057cf62b3533b158095b50f9e335661b8d13` |
| `fig-31.svg` | `c2fd08ba6e52210ad51ee5561e17540b45f4a9b0e99ae46ee795fc57bf9b6c36` |
| `artwork-opaque.png` | `1268ecd535984bb262274b0fbc1977d6cc16d7aa044d390138bbe388ae8be01c` |
| `artwork-opaque.png.json` | `07ee7e3c32aa175cdcca3bd4820f7e410fa4e13011496bf5965fa1b0ffd52a2b` |
| `fig-31.artwork.png` | `a5c2cc7dbb19f58de4891d466e73968f4997ac97e4b2ddc9c46ac0fca419c1f8` |
| `artwork-prompt.txt` | `91cb5f07161da0224aadca37a613eedaef82109533fa5dfe58e4b711f08806f4` |
| `spec-render-rejected-1.json` | `b320f9fa62bf11b6b7877f4a5b27aee1105c33444de1dfd929c6641cbb1db409` |
| `render-rejected-1.md` | `505617d6a06bf6f4e6efdc7a2383df01103e32319bda73b51280e7083742b0a8` |
| `preview-300.png`, `preview-print-300.png` | `aefdc70ef7662914533d6048654c85425c069b8c590287ad6c7a8a967e1edbd6` |
| `preview-306.png`, `preview-print-306.png` | `7fe72b8444962dd0d88edda2aeaa78d94256ae737cad59da776ede1b44d17700` |
| `preview-480.png`, `preview-print-480.png` | `6b329eaa0f794897bce9bc300a80e77c55bccc9e2424612517316494d095e38b` |
| `preview-640.png` | `892017d9749e4c843d7cd1d123b854041ab6212e8ee6157e0a250fce8dd01943` |
| `review-source-detail.png` | `a4364fc75e072b37be6121fedbf5f9953648d11030b7603775851d332baf922e` |
| `review-overlay-960.png` | `6dc44e5ef0cd4f3e50865417d62ec2559f3040e01c07a49a3c8bfb2b2a56b925` |
| `review-composite-neutral-300.png` | `fc71803f076156909084c80ae72a63ce14e79d9d9e7d338e7170ec503019adb0` |
| `review-composite-neutral-480.png` | `1d34a0943ba824f066678c325023dc312c6a5ee7498714bda3c5719083886471` |
| `review-composite-print-300.png` | `cbaa4230bd44e0ec3b990d8f67df51b754ac5e65f55308475df9cc752c7fae4d` |
| `review-composite-print-480.png` | `72ac4bc8b303f13724334aa2cd32ec39431f1f99e13efb70a60ffa0e505b85b6` |

Reviewer-added files are this report, the six `review-*.png` evidence images above, and the official `review.json`. Author outputs and retained failure files were not modified. Browser instances were closed. No promotion, Git/DB operation, network request or service call was performed.

Exact reviewer runtime model/version, configured reasoning effort and observable input/output token counts are unknown in this tool context. The metadata's `gpt-image-2` identifies the author's artwork generator, not the reviewer. No image-context exhaustion or unchecked visual gate remains.
