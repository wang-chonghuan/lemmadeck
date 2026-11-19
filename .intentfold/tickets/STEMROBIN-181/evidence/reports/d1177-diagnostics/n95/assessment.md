# Affected Independent FIG221 Assessment

STEMROBIN-181 D036, n95, F221-01. Overall **HOLD: current affected visual evidence**. The transverse coordinate repair passes the independent geometric checks, but the supplied current native PNG is visually incomplete. No FIG221 native review PASS is recorded. This is not card completion or product acceptance.

## Independence And Retention

Sole cwd: `/Users/yong/.codex/worktrees/00b1/lemmadeck`. Sole write owner: `.intentfold/tickets/STEMROBIN-181/tmp/d1169-n95-fig221-transverse-affected-review/`.

Image 1 was the original `ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-221.png`, SHA-256 `221ef4d9a5be1251de0a6d42d043a438a3d77c239d949e9b6f9a9ce36a43ae9d`. Only affected frame/body placement was inspected. `source-bound-invariants.md` was written before candidate, repair report, or evaluator reads, SHA-256 `f6ca122ff2d72306eb995245238493002d46d7d9fdcc6c05e58afe15a3d33af2`.

The source requires comparison relative to each panel's ground O: clocks move horizontally only; the emission location remains above the same station C; ground O/C share one layout translation. Source art does not establish a numerical design scale.

The FIRST independent report remains **HOLD**, SHA-256 `8dd378bbb2c1b41c9fac564336795963c7cbbf7db46c61c8f50ff5ce40f2ef4d`. Its frozen complete source inventory remains unchanged, SHA-256 `0397e86a856a2ea4412024b41f4ac10f379ce89976e10ad50a245033cf4efb26`. Its assessment remains unchanged, SHA-256 `63edffae941f2a8dfe8a978339165bec910f0a5025074dde98d400be5519e7f2`.

All unaffected FIG221 source, label, cultural, longitudinal-physics, declared regularization, and approved-text conclusions are reused from FIRST, not re-reviewed. There was no FIG220 image open or re-review. Its exact FIRST independent PASS bytes were copied to this owner's `fig-220.review.json`, SHA-256 `0251cc251e5163d87a23f37762162f68db05d57ea6d723c427d61d3dafe27690`; its unchanged source/spec/render/SVG bindings were verified.

Both earlier FIRST renderer failures, the original label-repair evidence, and the original independent HOLD remain historical facts, not rewritten approvals.

## F221-01 Geometry

Current repair report SHA-256: `8b746268945060e942dac32ef0e96582f8cc5615ab67425286e5b42f21ff10e2`.

Current spec SHA-256: `28647a711be7b577f484de3ca71060414d435c15869afe0097442ff09c84cf49`.

Subtracting the respective ground origins gives:

| Object | Panel a relative to O | Panel b relative to O | Physical-layout delta |
| --- | --- | --- | --- |
| B clock | `[70,90]` | `[110,90]` | `[40,0]` |
| Emission location | `[230,90]` | `[230,90]` | `[0,0]` |
| A clock | `[390,90]` | `[430,90]` | `[40,0]` |
| C station | `[230,0]` | `[230,0]` | `[0,0]` |

Both ground O and station C translate `[0,-340]` in the stacked canvas. O1 remains on the ground x-axis at `[40,0]` relative to O. The clocks and emission now use the same transverse panel translation; no spurious -10 transverse motion remains. Values are layout units, not experimental givens.

Exact candidate comparison confirms only eight later `at.y` values increase by 10: B, A, emission, both light fronts, both c labels, and the emission-location label. The four existing affected assertions change only their required `dy`: `221-b-C-aligned` becomes 90; emission/rear/front cross-panel displacements become -340. Two new assertions bind ground-origin and C-station translation to `[0,-340]`; both are mapped in the frame inventory. The only inventory edit is that mapping plus its explanatory sentence.

Independent subtraction and all six modified/new assertions pass. The displacement evaluator checks both dx and dy, so the misleading retained ID `221-panels-emission-fixed-x` now actually covers full fixed position after removing frame translation.

Source image, full authoritative bilingual text, canvas, display, layout, all other objects/assertions, and FIG220 are unchanged. There is no repair-induced geometry/text finding.

## Dependent Output And Labels

Existing current SVG SHA-256: `adaf2660180bfd1abb84bc004780cf9dddd3309a7b33718b2ba6a672fa0d6562`.

The structured XML comparison has identical 157-node structure and text, with exactly 17 changed elements. Every change is affected geometry or a linked label. No stroke, fill, font, clipping, or theme attribute changes.

Both clock circles follow their reference centers to screen y=530 with radius 16. Both light-front dots, light shafts, and materialized arrowheads follow to y=530. The emission cross has path `M 323 530 L 337 530 M 330 523 L 330 537`. The C guide retains its ground endpoint `[330,620]` and moves its emission endpoint to `[330,530]`. The B/A labels, both c labels, and location label move up 10 screen pixels without changed text or placement rules.

Current render SHA-256 `3fd239b15a4c8289173992ece0f42c9cf4b0b0c9bfbc26c18eee01bc24cf1a8e` binds the exact current spec/SVG. Its already executed native PASS reports 53 objects, 29 labels, zero collisions, and 20 px minimum text at fixed 640 px media width. These results and the one changed-render receipt were reused, not replayed. Visible labels in the supplied PNG are clear and not clipped or colliding. This does not prove the missing strokes are visible.

Original product scroll-width/reachability evidence is retained only as unchanged-display evidence. No current browser acceptance, current theme screenshot, lesson render, or mobile-end visual approval is claimed.

## F221-PREVIEW-01: Incomplete Current Raster Evidence

Image 2 was the supplied `d1168-n95-fig221-transverse-repair/fig-221.native.png`, SHA-256 `84037306143adc12b0dcc87f24052c568da6e7ca6b7856acc86ca58c7b91d43d`, at its native 640x800 size.

**HOLD, P2, technical visual-evidence failure:** in the affected later panel, B/A clock outlines, the emission cross, C projection guide, and light-arrow shafts are absent from the PNG. B/A/front point dots, labels, and light arrowheads are visible. In particular there is no visible mark at the repaired emission position `[330,530]`. Therefore this image cannot visually establish the repaired fixed-emission and complete linked-shape placement.

Those elements exist at the correct coordinates in the hash-bound SVG; the repair did not delete geometry or change styling. The preview receipt directly invokes `svg_raster.js` on the semantic CSS-variable SVG, exits 0, and reports 640x800. That tool's saved code simply passes raw SVG to Resvg and does not materialize CSS-variable colors. The observed loss of stroked objects is consistent with this preview path, but the exact engine cause was not experimentally tested. This is not a new scientific objection to retained unaffected content.

The native renderer's PASS and a rasterizer's successful exit are not sufficient visual-fidelity evidence under the quality gate. The old product screenshot cannot prove changed current coordinates. Current FIG221 visual approval is withheld.

Closure needs usable, current hash-bound visual evidence at 640 px showing the affected clock outlines, emission cross, C guide, and connected light shafts/arrowheads. Retain the current geometry and native PASS; do not infer a need to revise physics, replay FIG220, or reset content usage. This review grants no rerender, browser, tool/dependency edit, or production authority.

## Execution

`affected-audit.mjs` ran once successfully and produced `affected-audit.json`, SHA-256 `ff4057a632bb323a85b2bd602f5aa95aac132de966021c93c562d2735789097e`. It verifies current/retained bindings, exact candidate changes, independent frame-relative invariants, modified/new assertion operands, referenced dependent shapes, and existing SVG structure. XML parsing uses Python `-B`; no native validator, renderer, raster producer, or browser is launched.

Only two image opens occurred, in one batch: 2/8 batch, 2/24 fresh context. No crops, reopens, extra images, or parent image payloads. Parent remains at its stated 24/24.

Only this review directory was written. No candidate, source, app, skill, tool, dependency, charter, Git, progress, consumption, database, publisher, deployment, server, new worktree, chat, capability, update, or paid call was touched or started. `completeCard:false`. No FIG221 native review file or PASS was created.
