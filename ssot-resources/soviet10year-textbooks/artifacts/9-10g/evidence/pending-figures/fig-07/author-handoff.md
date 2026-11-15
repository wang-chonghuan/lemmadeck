# fig-07 Author Handoff

STEMROBIN-184. **BLOCKED: current renderer FAIL after the single permitted targeted repair.** Preserve this result; no further edit/render or approval is claimed.

## Current Package

Directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-07/`

- `source-inventory.md`: original PNG opened individually before spec authoring.
- `fig-07.spec.json`: deterministic JSXGraph FigureSpec.
- `fig-07.svg`: current renderer output, not manually edited.
- `fig-07.render.json`: current failed report, hash-bound to this spec/SVG.
- `fig-07.preview.png`: full640x480 renderer preview.
- `fig-07.css-{640,346,240}.preview.png`: individually inspected current-CSS previews.
- `fig-07.css-preview.json`: actual media/font/footprint measurements, explicitly retaining renderer FAIL.
- `first-render-fail/`: preserved first spec/SVG/render/preview.

Source/output intent: two intersecting plane windows, alpha's two exposed hatched portions, beta's unhatched window, original exposed/hidden solid/dashed distinction, one unmarked-ended common line, exactly one filled M dot on that line, and the four original labels alpha/beta/M/a. Lowercase a remains a line name, not an extra point.

There is no source right-angle marker or quantitative angle/length; none was invented. The plane windows' projected shapes, clean hatch/dash spacing and label-clearance gaps are unmeasured regularizations. The two invisible footprints are assertion-only construction containers, not extra visible boundaries. M is checked on the common line and inside both footprints.

The complete current n2 lesson text is embedded exactly, with text-string SHA-256 `08f99e1272951e7b7bf773acabea2f25205cf2d04053ea79671b03b30dcd1a13`. The lesson template byte SHA-256 remains `b27482f669ed847457a0da47eb19062efed18937d01f6bbf95921ef28a41fa32`.

## Exact Repair And Remaining Failure

Draft validator first returned PASS. Exactly one first render and one targeted repair render were performed.

First report failed M/alpha/a label clearance. Direct first preview showed M too close to the common line/dot. The first report and output are retained unchanged.

The one targeted repair changed only:

- M's north-label gap14 ->46; M's mathematical coordinate unchanged.
- Alpha text anchor `[550,413]` -> `[541,410]`.
- Lowercase a text anchor `[408,230]` -> `[408,221]`.
- Layout `minLabelGap`8 ->5.

All point positions, line/window/hatch geometry, object identities, source/context/inventory and assertions remain unchanged. Structured comparison after removing only those label-placement/text-anchor/layout fields is exactly equal; protected-spec SHA-256 over `JSON.stringify` is `b77af774b243bae7df7abb173bde72b06db62a9053fb7717e227fe0e161da837`. Assertions are separately exactly equal.

Second/current render:50 objects,4 labels, one remaining collision:

```json
{"id":"alpha-name-label","text":"α","position":"CENTER","score":10000}
```

M and a no longer appear in the collision list. All current width/font checks pass. The renderer does not identify the hit geometry in its report; do not claim a more specific collision cause than this evidence supplies. The padded alpha clearance remains a real gate failure even though the glyph is visible in the screenshots.

The internal validator accepted the current spec before the second render. The current report's source/spec/SVG identities are consistent. **The report was not normalized to PASS, and no third repair/render was attempted.**

## CSS Preview Evidence

Existing isolated Playwright with explicit `headless:true`, fresh context and blocked requests; no profile/CDP, visible browser, desktop input or user window/tab actions. `PWDEBUG` unset; `PLAYWRIGHT_HTML_OPEN=never`; task-owned browser closed.

Applied current app figure CSS through native `CSSStyleSheet.replaceSync`, which omits imports, plus the app's inline FigureMedia width640/max-width100% contract. No external font/package requests, build, or app changes. The earlier addStyleTag import failure produced no preview and its isolated browser was closed. These are local SVG media fixtures, not parent product display acceptance.

Measured media widths640/346/240px exactly; minimum label sizes44/23.7875/16.5px. All measured label boxes are inside the SVG and no body horizontal overflow occurs. The actual previews retain one M dot, four labels, both plane outlines and both alpha hatch portions. M is now visibly separated above the line. Inline layout needs no horizontal scroll.

These successful display measurements do **not** overrule the current renderer collision failure. Parent must treat the package as blocked, with independent source/output review still pending.

## SHA-256

| Item | Current SHA-256 |
| --- | --- |
| Original PNG | `ce77f8979bf0f9b8e9fb317602a42dceaf8f75f2f2bfcf1d798dd85e5955b79f` |
| Inventory | `93664d6b024d87b2a7d3c2d83fef4e5b81d9fc46e3526b936d90fe1ca6a90d59` |
| Spec | `e911ec798e41174c590d34cedbda63a1733e4f60227d0d6ac0b44a4296fe9fb6` |
| SVG | `379d9c540ba90dfd2b109ebf41ff8003d2d2ddae5a9a106b82662282d76aafd3` |
| Render | `2f0de261b8807dfd1f85b8662ffcdcd4b75285c2970df84cef94290eff7d2349` |
| Full preview | `3d1b8968d9f1f8fca943cddb70ffc62954ce4cc0ba4635d5dda98e7522258393` |
| CSS metrics | `b9c8ecb4affe0a2654db04b46fdca66a08b7dd123a036d44c13bf57775477881` |
| CSS640 preview | `fb24434da7c03512a16f0643f35aabc708f13aaacf51f0550849b2179509e830` |
| CSS346 preview | `a170be28dab2baaafc089a13e1b1dc6702f39d9f5e419838a390f1cf1d358139` |
| CSS240 preview | `df5155253cb0ec07d3ecf937a08d4cd1e9821f4b77f198f20de3de7240e893a8` |

First-render retained spec: `b17de9d46a0a2103326471063376140b71124f9e4284c7beb736f285989189ff`; SVG: `21fccb625ae4e040cdc846abe2c21d1f8dcd3598ac6b97d104a3ed650079b7ff`; preview: `5b5f624f9c47c7f34fb27d1383d8761aa6586389f76d948c6690640fdc84f308`.

No review@1, figure-manifest edit, promotion, source change, answers/choices, tool/dependency change, model/network/DB call, or publication.
