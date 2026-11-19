# n34-FIRST Offline Display Pixel Gate

**Status: revise.** Fresh context; six authoritative existing fullpage screenshots opened once each. Image count: 6 fullpages, 0 reopens, 0 crops, 0 source/standalone figure opens. No renderer, browser, DOM check or capture was rerun.

## Findings

1. **P1: visible footer UI controls, four surfaces.** Desktop/mobile text pages end with a filled blue `去做题 · 8道 →` navigation affordance after the final fig-51 caption. Desktop/mobile written-exercise pages end with a filled blue `← 回课文` affordance after exercise 753. Both violate the assignment's no-UI-controls gate. The existing producer asserts absence of `input,textarea,button,select`, not styled anchor navigation; its mechanical pass does not settle this visible criterion. Element tag and interactivity were not newly inspected.
2. **P2: detached figure captions, both text surfaces.** The increasing and decreasing example-1 graphs are stacked, but `图48` and `图49` appear consecutively after the second graph. The first has no adjacent caption and the second appears to have both. `图47` is separated from its graph by three prose paragraphs; `图50` by a proof-introduction sentence; `图51` by the concluding discussion. Place each caption with its own graph, especially fig-48 before fig-49 begins, without changing mathematics or unrelated prose.

## Per Surface

| Surface | Verdict | Concrete pixel observation |
|---|---|---|
| Text, 1440x960 | revise | Centered readable column; six complete nonblank graph frames; no gross visible prose/formula collision. Footer control and detached captions fail composition. |
| Written exercises, 1440x960 | revise | Eight aligned numbered blocks, review heading, two complete nonblank figures; visible subitems, fractions and radicals remain distinct. Footer return control fails. |
| Choices, 1440x960 | pass | Eight coherent stem/option sections, two complete nonblank graphs, plain lettered alternatives; formulas/long rows fit and no visible controls or marked-answer decoration. |
| Text, 390x844 | revise | Prose/sections fit and six local graph windows are nonblank. Long equations/figures continue in reachable local scroll regions. Footer and caption defects repeat. Compression limits fine-glyph assessment. |
| Written exercises, 390x844 | revise | Heading and all eight blocks wrap cleanly; visible fractions/radicals do not collide; two nonblank scroll-window figures. Footer return control fails. |
| Choices, 390x844 | pass | All eight sections and final alternatives remain distinct; option gutters and wrapped formulas fit; two nonblank local figure windows; no visible selection/submit/footer controls. |

Aggregate: **2 pass, 4 revise, 0 blocked**. The top-level JSON status is `revise`, not the existing mechanical `pass`.

## Bound Evidence

All six PNG hashes and the three corresponding HTML hashes were computed **before any image opening** and match `result.json`. Exact paths, hashes, dimensions, per-surface findings and current bindings are in `visual-review.json` and `visual-review-receipts/pre-open-hashes.json`.

Existing headed capture ran on 2026-11-19, 00:10:42.086Z through 00:10:44.556Z; the assignment supplies exit 0 and the unchanged `result.json` records pass/six checks. Its SHA-256 is `7ea82094884ffb589eae7dcfa9c89de096d24be3c33cf1375c995e61897a197e`. All six root overflows are 0; every recorded local scroll reaches its end. Scroll counts: desktop text 5, exercises 4, choices 0; mobile text 13, exercises 4, choices 2. All figure media widths are 640px; existing minimum figure text is 16–20px. These are **inherited mechanical observations**, not fresh DOM assertions.

The current eight-figure approval binding is `n34-figures-approved-binding.json`, SHA-256 `44a51557c24ee6ac66f1aaed5dc8fec5e40bbeccc8adb9e5d2516f17a6528780`. Read-only hashing verified its three report hashes and all 40 referenced source/spec/render/SVG/preview bindings. Six unchanged FIRST scopes plus affected-only fig-47/fig-51 label passes are reused. Historical FIRST revisions are preserved, not relabelled as pass. No exact grid, number, mathematical value or label claim is newly approved from these fullpages.

## Actual Limitations

- The tool delivered desktop text at 1289x6000 instead of 1425x6634, mobile text at **282x6000 instead of 375x7973**, and mobile choices at 373x6000 instead of 375x6025. The mobile text reduction prevents exhaustive small-glyph/formula-clearance and normal-width legibility certification. Its page flow, footer and caption findings are still discernible; no blanket fine-detail pass is claimed.
- Mobile screenshots show initial horizontal scroll positions only. Right-side figure annotations and ends of long formulas are not newly pixel-inspected. Their reachable scroll ends come from existing mechanical evidence; standalone mathematical/label scopes are inherited where applicable. Local cropping is not incorrectly called root overflow.
- No crop was needed for the two concrete suspected composition defects. No image-bearing parent history or standalone images entered this context.

## Parent Handoff

Repair only the offline footer controls and text-caption composition. Retain both passed choices displays and prior eight-figure mathematics/label approvals. Review only actually changed affected display outputs; do not repeat this complete six-surface batch. The reviewer made no source, candidate, app, DB, `.env`, network or Git change and did not repair anything.

Only the two requested review files and the reviewer-owned `visual-review-receipts/` directory were written. Final report/hash consistency is recorded there without browser or renderer activity.
