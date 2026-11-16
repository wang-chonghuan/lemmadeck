# fig-10 Frozen Author Handoff

Current candidate frozen. Mechanical draft validation and renderer are **PASS**. This is an author handoff, not an independent review or approval. Parent reports independent source/math/visual PASS and owns `record_review.py` and promotion. No candidate change or rerender after the freeze instruction.

## Inputs And Spatial Boundary

The already frozen, individually observed raw source inventory was reused unchanged. Complete official `context.json` and complete approved n3 prose were read before authoring. The approved point-set erratum is bound exactly; this author did not edit the source or modern text. No answers, choices, parent source solutions, or prior specs were used.

- Original PNG SHA: `af7868831a26152a6c06806d3aedb57098d7e0e5298cb71e4ffd68c10fad3145`.
- Official context SHA: `d637ab5220475d8d084b431f0bdf81578d79c10b6ea946d5f301d4ad49f4866d`.
- Approved n3 `lesson.json` SHA: `96c55e5e7ef97d49ae2610ac7823fe83602685e437642d4fdb942ac838913f10`.
- Approved n3 `exercises.json` SHA: `251aaa5219b796eafde40d37df0ba5ad2906e277cb0fd085c508578966864d9d`.

All five source point markers and all nine label occurrences remain. Left same-side A/B have one solid AB outside the drawn patch. Right opposite-side A/O/B are exactly collinear and ordered A-O-B, with solid AO, dashed hidden continuation from O, then solid continuation to B. Only the source-named O is the true spatial segment/plane intersection. Neither contour crossing nor the anonymous visibility break is an extra spatial point; the break is a coordinate literal with no marker or label.

The author's illustrative spatial witness uses alpha:z=0 and projection `(x,y,z) -> (x,y+z)`. Left A=(2,5.5,3.5), B=(5,6.5,3.5) project to (2,9), (5,10); every point of their segment has z=3.5, so AB misses alpha. Right A=(9.1,6.1,3.9), B=(14.9,6.1,-3.9) project to (9.1,10), (14.9,2.2). The segment has z=0 only at O=(12,6.1,0), whose projection is (12,6.1). These coordinates and representative parameter are unlabelled modern display choices, not source measurements or a source midpoint condition.

The displayed hidden/visible break (13.704826733,3.80730198) is the projected line's intersection with the chosen schematic patch's lower-right edge. That intersection controls occlusion only. It does not create a second spatial intersection with alpha. `inside` assertions for O/alpha check display placement, not space semantics. Rounded source plane outlines are regularized irregular polygonal patches, not measured rectangles or bounded mathematical planes. No axes, lengths, ticks, arrowheads or half-space answer labels were added. Source panel order and modern ASCII a)/b) are preserved.

## Actual Attempts And Preview Scope

1. Explicit draft validation: PASS.
2. First and only renderer: PASS, 15 objects / 9 labels, empty collisions.
3. No repair. Exact first spec/SVG/report/native PNG are retained byte-identically in `initial-render/`. No successful renderer rerun.

Native640 PNG is reused from the renderer output. One isolated preview batch created neutral240 and print346 from the current SVG, with actual print-media emulation. Measured widths/heights: 640x480, 240x180, 346x259.5; minimum text sizes: 44, 16.5, 23.7875px respectively. The hidden OB SVG has `stroke-dasharray="5,5"`; AO and visible OB remain solid.

The author opened current native640 and neutral240. Before the author's print346 opening, parent reported its own completed independent opening of every native/neutral240/print346 preview and instructed immediate candidate freeze. This handoff does not claim an additional author opening or repeat that successful check.

All browser launches were isolated official Playwright with explicit `headless:true` and `env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never`; preview network requests were aborted. No user window/profile/CDP/OS input, Azure/model call, service, DB, git, source/helper/text edit, review, or promotion. Owned browsers are closed.

## Current Files

Base directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-10/`.

| File | SHA-256 |
| --- | --- |
| `source-inventory.md` | `97cee71a71f02d7900e5e56d7388d95764a5f7abc5dca3e84cd767f76dd23c2d` |
| `spec.json` | `f13cc1ff146f3b8d65af1cd6706cb7bc4b9eb0d7c696d1ab21ff4ef111407605` |
| `fig-10.svg` | `b9b3cff105c0a8b777fcd6de19999832a15784cc130dba56307d571417f7b81a` |
| `fig-10.render.json` | `5a326c0741326ae268ea8f353197b1cae5268505fc976a3fa0bf682b3f5a6f30` |
| `fig-10.native.preview.png` | `1f0c296219ada3450f776af400f1347e31cee7d0f0e188629b4af854719a0af1` |
| `fig-10.neutral-240.preview.png` | `9094ec011d4f014e17aa894ea352d7700b7e4542a8c33f38de83c55a4add145f` |
| `fig-10.print-346.preview.png` | `b0b9968a229ae481efadb02fbee2edb44af399d57231a0952192f95853faf07c` |
| `fig-10.display.json` | `e96e7fa4cc1fa7d27f10128aa6cf708a96cea6a0fb721eecfee068c1018209eb` |

## Preserved Initial Success

`initial-render/spec.json`, `initial-render/fig-10.svg`, `initial-render/fig-10.render.json`, and `initial-render/fig-10.native.preview.png` have exactly the corresponding current hashes above; no initial failure exists for this figure.

`fig-10.display.json` binds source, inventory, official context, modern lesson/exercises, current spec/SVG/report, every preview, and every initial snapshot by hash. Parent records the separate independent gate and promotion; this author did neither. Existing fig12/13 blocked packages were not revisited or changed.
