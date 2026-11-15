# fig-06 Author Handoff

STEMROBIN-184. Author scratch only; independent source/output review remains with parent. No review@1, promotion, figure-manifest edit, or DB action.

## Current Package

Directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-06/`

- `source-inventory.md`: original PNG was opened individually before spec authoring.
- `fig-06.spec.json`: deterministic JSXGraph FigureSpec.
- `fig-06.svg`: current renderer output, not manually edited.
- `fig-06.render.json`: current `status=pass`, zero collisions.
- `fig-06.preview.png`: full640x560 renderer preview.
- `fig-06.css-{640,346,240}.preview.png`: individually inspected current-CSS media-width previews.
- `fig-06.css-preview.json`: actual SVG-transform/font and footprint measurements.
- `first-render-fail/`: preserved initial spec/SVG/render/preview.

All three source dots and their labels A/B/C remain on the card. The source alpha label remains a mathematical plane name, not a point. Three visible support silhouettes, sheet occlusion, and one unfilled oval base remain. No additional edge joining the exposed rods to the sheet dots is added through the sheet.

This is an unmeasured apparatus schematic: clean rod silhouettes replace the irregular paired/thick scan ink, and the oval is a deterministic smooth path. Projection coordinates and label spacing are not source dimensions, equal-length data, or numerical labels. The two displacement assertions bind a noncollinear modern projection; they do not claim printed measured displacements.

Both specs contain the complete current n2 lesson text, including captions and source appendix notes. Its text-string SHA-256 is `08f99e1272951e7b7bf773acabea2f25205cf2d04053ea79671b03b30dcd1a13`; the current lesson template byte SHA-256 is `b27482f669ed847457a0da47eb19062efed18937d01f6bbf95921ef28a41fa32`.

## Bounded Rendering

Draft validator first returned PASS. Exactly one first render and one targeted repair render were performed.

The initial render failed on A/B/C label clearance, including C's padded footprint near the sheet edge. All three width/font checks already passed. The initial files remain unchanged in `first-render-fail/`.

Only repair:

- A and B label east gaps14 ->24.
- C label placement east/gap14 -> southeast/gap24.
- No point, rod, card, base, source inventory, context, or assertion changed.

Structured equality after removing only the three point objects' `labelPlacement` fields is exact before/after; protected-spec SHA-256 over `JSON.stringify` is `4ef97cefb4d1244805e5b8b2d31696619b150c7e8f8a30995826d60b80b133e3`. Assertions are also separately exactly equal.

Current render PASS:9 objects,4 labels, zero collisions. Its internal current-spec validator succeeded before rendering. The current report's spec/SVG hashes match actual files.

## CSS Preview Evidence

Existing isolated Playwright, explicit `headless:true`, fresh context, all requests blocked, no user profile/CDP/windows/input. `PWDEBUG` was unset and `PLAYWRIGHT_HTML_OPEN=never`.

The fixture applies current `app/src/styles/app.css` figure rules and the app's inline FigureMedia width640/max-width100% contract. A native constructable CSS stylesheet omits imports, so no external font or package stylesheet is requested; no CSS build/edit occurred. An earlier addStyleTag attempt failed on blocked imports, closed its isolated browser, and produced no preview. This is local media evidence, not published-lesson acceptance.

Measured media widths640/346/240px are exact. Minimum screen label sizes44/23.7875/16.5px all exceed16px. All label boxes remain inside the SVG, and body/figure scroll widths do not exceed each requested width. At all three actual previews, the three points, four labels, three rods and oval remain visible; C has clear local association with its source dot. Inline layout requires no horizontal scroll.

## SHA-256

| Item | Current SHA-256 |
| --- | --- |
| Original PNG | `6f7be851915a2e924b4127a2f7b3fb2f38f17061c05ebd271ef85e5205964406` |
| Inventory | `794a7dcb400faa98f0ae0da8eef5c0e1c06354caa40e37c1da47960c63e51b40` |
| Spec | `1f5042c2b81ad23d5522a09a774ee4cfa92debb485bc3d4e6e2ab8affb03df92` |
| SVG | `996e1f359590945834a4dee13077b2fa99eed725e1970e6a0969f9ec721a02dd` |
| Render | `346453cd4df100e836c0fb326517cd0b62f030a34d33ab462d2c03ee8f1ac052` |
| Full preview | `2ae9fa379faabe8c729f07374ff6bd9191fc790907a7d8c558ec6a10042fa2e2` |
| CSS metrics | `79c4e3a149075d0b7525f7fbd8b45faa7bcf04d2637d2928f531f26469c97415` |
| CSS640 preview | `45dc5cbbacfd0a64d4523cd86abf9e7560e7a6c138d8893979e8f34740210aea` |
| CSS346 preview | `556bf807059d585c4a1aa80489618f8e49b46b3f3cc55d47db622c81ac212a98` |
| CSS240 preview | `0035378f04f0bd4fed946832e2be560e3e2d96401532e1c1654729cf87d10276` |

First-render retained spec: `53cf0bde9b5ac24dce411901567c679dd56f2e2f91fa515aab3fa581ad62c4b9`; SVG: `b0fdd17b6f49a9865b12e88a437c73263e676112e64fc5db88dd7206637d27db`; preview: `fa678af28170ea30711f3acbbe2fe9855c2da0e7d30c9a4264d254346fdf8c9a`.

Ready for parent's independent review, not approved or promoted.
