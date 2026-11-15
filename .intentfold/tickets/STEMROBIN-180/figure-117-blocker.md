# Independent Figure Review: fig-117

- Ticket: STEMROBIN-180
- Date: 2026-11-15
- Role: independent reviewing agent; not the author of fig-116 or fig-117.
- Verdict: **FAIL / BLOCKED**. The sole author repair is already consumed (1/1); no further repair or approval is performed.
- First independent essential finding: **F117-DIRECTION-1**, panel b's deep upward-facing mouth and straight downward-facing mouth pressure arrows visually intersect.
- Scope: one complete source/context/output/width/theme review. Mechanical author PASS is retained but is not independent visual approval.

## First Essential Failure

Affected smallest unit:

- `source-b-deep-mouth-down-arrow`
- `source-b-straight-mouth-up-arrow`
- Their visible association with `source-b-deep-up-mouth` and `source-b-straight-down-mouth`.

The spec's intended directions are mathematically correct: the former goes down toward the upward-facing deep mouth, the latter up toward the downward-facing straight mouth. The **actual output** defeats their separate reading. At 306 px in neutral/accent/print they form one merged dark/accent slanted symbol; at 640 px the intersecting arrowheads remain visible and there is no clear separation between the two directional indications.

Evidence is not a conjecture from a scaled source or a label-only check. Inspected the existing materialized arrowhead groups in `fig-117.svg`:

- Downward head: `translate(442 468) rotate(90) scale(1.8) translate(-0.05 -5)`.
- Upward head: `translate(432 482) rotate(-90) scale(1.8) translate(-0.05 -5)`.
- Each uses the filled triangle `M 0,0 L 10,5 L 0,10 z`.
- Screen-space downward triangle vertices are approximately `(451,467.91)`, `(442,485.91)`, `(433,467.91)`.
- Screen-space upward triangle vertices are approximately `(423,482.09)`, `(432,464.09)`, `(441,482.09)`.
- For example, screen point `(437,475)` is inside both filled triangles. This is an actual positive-area intersection, not only bounding-box overlap. At 306 px the two axes are separated by only `10 * 306 / 640 = 4.78125` px.

The task explicitly asks the learner to inspect the bent tubes and explain the equal readings, including different submerged opening depths. Distinguishing the two opposite opening/pressure directions is part of that apparatus relationship. The output cannot receive PASS merely because seven arrow objects and seven connects assertions exist, or because the water readings are equal. A no-collision result for the two panel text labels does not test these arrowhead footprints.

Preserve this first substantive rejection and all author evidence. Do not widen the repair allowance, modify the SVG/spec, invent an alternative apparatus, or remove the offending source-required arrows. This report identifies the affected unit; it does not authorize another repair.

## Frozen Inputs

All paths below are relative to `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

| Input | Path | SHA-256 |
| --- | --- | --- |
| Original PNG, 847 x 426 | `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-117.png` | `4a505fab84fff7c89224cd2f8fa062b4acb3245db2435d5090a9bdd21aeb517f` |
| FigureSpec | `.tmp/s10y-image/6p/fig-117-author/fig-117.spec.json` | `c9148e3e583f1e953bb02a9c8059391fdeb962452e7d284c0e2f11edc35275b4` |
| Final SVG | `.tmp/s10y-image/6p/fig-117-author/fig-117.svg` | `1eaf1f7cd8f14a82da2883da4105ea15576883070465f6f4039ba3c1c211e294` |
| Render evidence | `.tmp/s10y-image/6p/fig-117-author/fig-117.render.json` | `d26eda68d0e4ef06ca9c78e66a89ad44dff82bd5e4c5f04b3e0a7668ef599c80` |
| Full neutral output snapshot | `.tmp/s10y-image/6p/fig-117-author/fig-117.png` | `7a5ddaa2288de1c631f70d39f32362cb91ba6bc8e2b5ab19f04287ec5d4d22f5` |
| Complete context | `.tmp/s10y-image/6p/fig-117-author/context.json` | `5c7a0d12a28daf2a66e29768d6c5f5128bd874a80237f07fc367e5d4edcbdc52` |
| Author handoff | `.tmp/s10y-image/6p/fig-117-author/author-handoff.json` | `2ed91c910dd26953133f63e2cc690019117b9256842567cf70006cc1cb768ef4` |
| Theme evidence | `.tmp/s10y-image/6p/fig-117-author/theme-evidence.json` | `3011e9fbf8cd14c9ee1d0bf0e85f8607ae45c6d71c8cceba09d7d48ef83b56d0` |
| Pixel evidence | `.tmp/s10y-image/6p/fig-117-author/pixel-evidence.json` | `f9cf5e9d832c464b88a0ffe255938d5c19b020ba66a6b73e2285e3d6d14b2c30` |

Read all frozen modern context files, with directory prefix `.tmp/ld-s10y-lesson/text-author-c4-s5-s6/adapt/6p/modern-us-neutral/lessons/`:

| File | Blocks/tasks | Current byte SHA-256 |
| --- | --- | --- |
| `phy6-c4-s5/lesson.template.json` | 20 prose/display blocks | `ba206492c4457bda2ec9add399b4c950b2238f8b57178c18154694811afeb6f9` |
| `phy6-c4-s5/exercises.template.json` | 2 tasks | `9952920ce2eada39e878670dba64c61deba0257ec5b43dd68e182f062a74dfb9` |
| `phy6-c4-s6/lesson.template.json` | 19 prose/display blocks | `d9a2adae43c22454c8f5a6f682260fd88ec410bfe38af4ed9cade6708ba8918c` |
| `phy6-c4-s6/exercises.template.json` | 10 tasks | `8d101fa8c090d6148adcbb2cc154a1e71da164fd21702c6fde4e7f96830f3870` |

All four byte hashes match the handoff. All ordered prose/task text hashes, including empty figure fields joined with two newlines, also match. Spec authoritative text equals the complete frozen context. The relevant s6 g3-2 prompt hash is `8b827bbbddb5f2e587951fa284addf467fbdd316b52b14070965c699605e1549`. No answer artifact or independent source-solver report was read.

## Complete Independent Source Inventory

Personally opened the full original and full current output. Also viewed the existing original-source crops `inspection/a-tubes.png` and `inspection/b-tubes.png` to distinguish the submerged mouths; those are source inspection evidence, not a new rendering.

1. Two complete apparatus states a and b, each with a sealed bottle, stopper, lower water region, upper air region and water/air textures. Source Cyrillic panel labels map to Latin a/b.
2. Each stopper carries **three separate immersed reading routes plus one separate air route**, not four water-reading tubes.
3. Each panel has one shallow upward-facing bent opening, one deeper upward-facing bent opening, and one straight downward-facing opening. All three water routes continue up through the stopper to separate reading columns.
4. Each fourth tube opens into the headspace above the bottle's water, bends outward above the stopper, and connects by rubber hose to one bulb. No air inlet is substituted for an immersed mouth.
5. In a the three reading levels coincide with the bottle's free surface; in b they rise together above it. The source b common reading reference is retained.
6. In b the source includes three downward headspace indications, downward indications at the two upward-facing immersed mouths, an upward indication at the downward-facing mouth, and downward bulb compression: seven arrows total.
7. Both full bottles, hoses, bulbs, stoppers, upper tube ends, lower U bend, panel labels, and the bottom compression indication require complete visible extents. There are no numerical scales, calibrated depth differences, additional experiment panels or answer labels.

Mapped these observations against both full source-inventory groups and all 80 objects. Read all 26 assertions: two reading collinearities, six submerged-mouth inside checks, two water-surface/reading parallel checks, seven connects, seven vertical-parallel checks and two object counts. All source objects are present, but the failed two-arrow visual relationship is not secured by these otherwise correct asserted directions.

## Apparatus And Remaining Semantic Findings

- Water and air routes are topologically distinct in the written paths and visibly traceable at 640 px. The shallow upward mouth is at screen `(72,426)` / `(372,426)`, the deep upward mouth at `(142,488)` / `(442,488)`, and the straight downward mouth at `(132,462)` / `(432,462)`.
- Bottle free surface is at screen y390. Air inlet mouths end at screen y332, 58 canvas px above the water, in both panels. This is a gas-entry path, not an air tube submerged in water or a siphon liquid connection. Hose and bulb connections remain complete.
- All three immersed openings are below the free surface and have the declared upward/upward/downward orientations. Their underlying paths are correct. The essential rejection is the two overlapping b directional annotations, not an invented fourth reading column or reversed tube geometry.
- At a, all three reading surfaces are at y390. At b, all three are at y150, above the bottle surface. These are the source's qualitative observed states; no absolute pressure, rise distance, density, calibrated tube spacing or result for the requested repeat experiment is added.
- The upper reading-tube outline cross-strokes were compared with the schematic rims in the full original. I do not assert a separate sealed-top/blocked-atmosphere defect from those strokes alone. No new cap interpretation or apparatus physics is imposed on ambiguous source rim notation.
- Dots and dash marks denote air/water texture, not measured molecules, a ruled scale or a counted dataset. Modern spacing and outline regularization are not source precision.
- Equal b readings are already supplied in the original prompt/image; retaining them is not newly leaking the requested explanation. There is no law name, derivation, numerical answer or repeat-experiment result in the image. The practical construction and experiment remain learner tasks, not certified by a static diagram.
- Latin a/b are the only visible text. No Cyrillic, Chinese, Soviet symbols, invented historical identity, answer key or cultural label was added.

These unaffected checks are recorded without converting the overall verdict to PASS.

## Actual Width And Theme Inspection

Personally opened every existing screenshot below at its native capture size; no browser, new preview or renderer was launched. Prefix: `.tmp/s10y-image/6p/fig-117-author/previews/`.

| Screenshot | Pixel size | SHA-256 |
| --- | --- | --- |
| `neutral-306.png` | 306 x 306 | `372cf6e537b0672fb869310cc54c583c2064100759b3ac569665e01c69b797b9` |
| `neutral-640.png` | 640 x 640 | `7a5ddaa2288de1c631f70d39f32362cb91ba6bc8e2b5ab19f04287ec5d4d22f5` |
| `accent-306.png` | 306 x 306 | `d43958ab70a6cb255849fbd6f4a57d51299a5a103673d67f7204f8dee64e68c3` |
| `accent-640.png` | 640 x 640 | `26b8950b19ce86f0d2a44facd6a0848525fd3701731542727f7c5de74b774a75` |
| `print-306.png` | 306 x 306 | `c47240a30932026a42bb00588e92e8eea137ac3e4302f58f87baf86872f5c425` |
| `print-640.png` | 640 x 640 | `065b82edda922d35b92e40bcc148da74a5b6092b7aaa40799380f4e5ad9e397b` |

Full vessel bottoms, upper tube ends, both stopper regions, rightmost hose/bulb, b compression-arrow tip, a/b labels and lower deep bends are in frame. Inline maxWidth 640 at 306/640 requires no horizontal scroll-end test. Author foreground bounds are `[21,28,285,298]` at 306 and `[46,60,594,622]` at 640; complete source/output views agree with the absence of outer clipping.

The label metrics report 17.2125 px at 306 and 36 px at 640, with no label collision. SVG uses semantic CSS variable roles, and all themes remain nonblank and recolorable. Neither grayscale/print nor accent recoloring separates the **intersecting two same-role arrowheads**. Thus the outer-extent, label-size and palette checks pass locally while F117-DIRECTION-1 remains a blocking visual failure.

## Frozen Failure Evidence And Stop

- The author first rejection was unsupported `fill:none` on 20 fields, preserved in `first-failure/`. Sole repair deleted those fields only; no source or geometry repair was made. Repair evidence SHA: `443f6f174c4a3f6867d0dae5689cd593516bb2cd12ce417c6674067010cd5937`.
- First-failure manifest SHA: `f3715088ba278b8b78b88e8072edb44cf29e4e9047623177196806d23c20d054`. All ten preserved files were verified against the manifest.
- All ten handoff-bound files, original PNG and six preview hashes were verified unchanged. Successful second draft-validation, sole canonical JSXGraph 1.13.1 render, existing theme/pixel evidence were read and reused, not rerun.
- The first independent FAIL is retained in this report and a current source/spec/render/SVG hash-bound `review.json` with `status: fail`. No PASS recorder call is made for this rejected candidate.
- No renderer, standalone validator, preview generator, app, browser, network, service, DB, Git, dependency installer, edition writer or promotion action was used. No author files or source/text fields were edited. fig-118 failures and fig-119/120 author freezes were not touched.

**Stop: BLOCKED at repair 1/1.** This rejection does not revoke unrelated text approvals or approve/reject other figures. It applies to the exact current fig-117 snapshot above.
