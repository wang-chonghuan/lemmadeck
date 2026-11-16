# Fig156 Independent Full Review

Verdict: **FAIL / BLOCKED**, 2026-11-16. This is the single substantive independent source-first review of Bacon's immutable repair-01 candidate, not author approval or a full lesson gate.

## Findings

**F156-TICKS-1 (essential source-fidelity failure): both rulers omit visible upper source scale strokes.** The original PNG shows short horizontal scale strokes above the upper `2`, distinct from the tube walls and mounting fasteners. The current full SVG and all six native samples shorten this upper scale region. This is missing instructional scale structure, not a necessary removal of paper texture.

The author's frozen source observations and current object mapping make the location reproducible:

| Panel | Original PNG tick lane (x1,y1,x2,y2) | Recorded merged ink runs | Mapped run indices | Unmapped indices and original y bands |
| --- | --- | --- | --- | --- |
| 1 | (301,125,322,450) | 30 | 3..29, 27 distinct indices | 0:125..126; 1:129..133; 2:137..141 |
| 2 | (780,115,800,447) | 27 | 4..26, 23 distinct indices | 0:115..116; 1:120..123; 2:125..129; 3:131..135 |

Thus 50 of 57 recorded merged ink runs have mapped minor objects; seven recorded runs have no minor object. These are **ink-run counts**, not a claim of seven exact calibrated subdivisions. The definite omission does not depend on classifying either index-0 boundary stroke as a minor tick: panel 1's separate 129..133 and 137..141 strokes, and panel 2's separate 120..123, 125..129 and 131..135 strokes, are visible source scale marks and absent from the candidate. No hidden subdivision value is inferred.

The first remaining central minor line is `panel-1-observed-minor-3` at SVG y=99.5151515151515; panel 2 begins with `panel-2-observed-minor-4` at y=99.47540983606564. The full SVG contains no substitute central scale strokes above these lines. The y=100 tube fasteners cross the tube walls, not the central ruler lane, and the board edge is not a replacement tick. The inventory declares numeral-clearance splitting and readable interpolation, but no authorized deletion of these visible upper source marks. Preserving the five numerals alone does not preserve the complete scale.

**Admission limitation, not an additional observed physics failure:** most depth, liquid-separation and open-reference assertions use literal coordinates rather than object references. The major-spacing assertion checks selected equal distances, not completeness of the source minor-stroke set. The existing mechanical PASS therefore cannot establish the missing source inventory. Actual paths and pixels were examined independently; no tool or spec patch was made.

## Complete Review Coverage

- Original complete fig156 PNG opened before candidate interpretation: 869x545 pixels, two complete apparatus panels. The existing source-only 2x detail sheet was also opened to distinguish scale marks and membrane profiles.
- Read the complete frozen approved s14 text through `context.json`: all 20 lesson blocks, all three original prompts, definitions, liquid/metal apparatus descriptions, Pascal attribution and all seven figure anchors. No nearby-only substitution, answer key, choice or private solution was read.
- Read the complete spec: all 132 objects, all 15 assertions and all five inventory groups. Read the full source inventory and source-scale observations.
- Parsed the entire current SVG XML; examined every visible geometry/text element and raw path in order. Its painted geometry contains 110 lines, 24 raw paths, four polygons and ten labels. Another two paths and all 204 helper ellipses are hidden renderer internals, not source objects or cultural additions. Canvas/viewBox is 640x640.
- Opened each of the six existing native PNG samples individually, at actual widths 306 and 640, neutral/accent/print. No sheet-only review, new screenshot, preview, rendering or standalone validator run.
- Verified all 95 freeze-manifest file hashes and byte sizes, with zero discrepancies; all four complete-context bindings also match. The earlier recursive handoff/context comparison matched all 34 bound records.

## Source, Physics And Visual Judgments

Both panels retain the gripping hand, held vertical rod, lower offset support, separate rim support, open water vessel, horizontal upward-facing membrane box, hose, U passage, ruler board, fasteners and base. Both repaired grips now touch their rods in the actual mobile and full-width samples.

The hose is continuous from each box to the left connected limb. There is no visible atmosphere branch at that junction; the right limb remains the distinct open reference. The ink-wall/paper-lumen/liquid layers retain a continuous U bottom. The connected liquid surface is lower than the atmospheric surface in each panel.

The common water surface is SVG y=310. The membrane faces are at y=506 and y=540, so the right one is deeper. Liquid endpoints are y=327/298 on the left and y=383/268 on the right: the right separation is larger. These are schematic drawing coordinates, not newly calibrated depths or pressure data; no numerical proportionality or pressure reading is claimed.

All ten visible numerals retain the unsigned top-to-bottom sequence `2,1,0,1,2`; no unit, negative sign, h label, pressure equation or solution annotation was invented. The missing upper strokes remain the essential exception to ruler completeness. Broken source water marks are texture, not a measured grid; semantic fill is an acceptable declared regularization.

All six samples are nonblank and distinguish vessel water, apparatus and gauge liquid in neutral, accent and print. Existing evidence reports minimum text size 16.25625px at 306 and 34px at 640. The numerals are readable and not clipped. This is inline instructional output with maxWidthPx=640, not scroll or hybrid output; scroll-end and separate raster-artwork checks are inapplicable. No source cultural symbols, Chinese labels or fictional identity were introduced into the figure.

## Frozen Evidence

All paths below are absolute. Let R be `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-156-author/repair-01`.

| File | SHA-256 |
| --- | --- |
| R/author-handoff.json | 2006d724f132e25d6d5992939f1e6eb9604e3ce35e9a6653f26ae5911dbeaf4f |
| R/context.json | 26c0d02541e856644f775951c3be785091eafda9f97e135d0a4da427836bbe8b |
| R/fig-156.spec.json | 2132f8b3c812f6661ceb707dffb812d04f25090d3991ba512c00293f38fe5012 |
| R/fig-156.svg | 9440312edb4e97e1ada4760b25c572e03e18d660df49ecefc25cde3a74ef4411 |
| R/fig-156.render.json | 777edec00ce96cc233f8685b7cf357bf25ab4787d2d09a2893b448235dc76121 |
| R/author-preview-report.json | b7d3d2f35c5a03bc75e7386e1df94dd6f46c0fd35634b9bd1b903ad505abb19e |
| R/native-pixel-evidence.json | 47e68d5a16c3f56df26e3c284c8435be332960b8203c023eb0d8c38b354f54e5 |
| R/source-inventory.md | 04526c638fbe3cd9e357257905dd82af264697a1870f9f3782e5c89ca3f75ab7 |
| R/source-scale-observations.json | 1976fdfabac8fbe06434a4dc3ad4d24ed4f32d549aef6b8126d750a531af5b1f |
| R/author-freeze-manifest.json | 8d9c99353bb117d9fbd281860103d1c1f2fc66b3335ab652cb132ffb6d5ba598 |
| R/repair-authorization-and-diff.json | b07b0d9e270a34ffee40dbe01ae20a62b5a3a441ecd61f5cb1732eb16d7d1ab7 |

Actual opened original: `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-156.png`, SHA-256 `41434d4720ffa30b93424696dd15cf85a7be6ae4904918958b5c426212490d31`.

Actual opened source-only detail: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-156-author/source-details-2x.png`, SHA-256 `f476965529aaf0c2049d99d2f4fe1147565541c3c827d386cdf36ddf1325fa1b`.

Full approved text bindings: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s14/adapt/6p/modern-us-neutral/lessons/phy6-c4-s14/lesson.template.json`, SHA-256 `0c67880c0f4e795067c4ff2547b3f2bf3519e8eeefc5fd18466b0e07bf918974`; adjacent `exercises.template.json`, SHA-256 `11e6ec7e11f8278562ced757da847aa9b0bd28db3e656079615a72462805dd08`.

All six actual opened samples are under the absolute R/previews directory:

| Filename | SHA-256 |
| --- | --- |
| fig-156-306-neutral.png | c797a5ed76dbe5f929c5783a110a58c12a3b7f1f5b85380c6812f2d919956236 |
| fig-156-306-accent.png | 01cb203b4741e00dad23cece26fdeb9850e59619f625e5e65d56247029b133c9 |
| fig-156-306-print.png | d61d43035128ed30610293360cf01b78661b7e8b1e8e176b132f36b7a48b0931 |
| fig-156-640-neutral.png | 26e390b165023e0837adebfa9c7f962bcda080ce80b774a921d8ca38988801b9 |
| fig-156-640-accent.png | 9e42c8e618934c650203872c38b593e834af1d2def891bc545e325ad4cb5f2d2 |
| fig-156-640-print.png | feb266e8ce7ae23f59586852cb34d008fa8227a1969a77c71485c8852a094688 |

## Failure Preservation And Boundaries

First author visual FAIL `AUTHOR-VISUAL-HAND-ROD-1` remains under `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-156-author/failure-01`; `first-failure.json` SHA-256 is `b4443d9769b785545abfb759dc452c73d15bab7abfb7936043f5dabc272be6b5`. Its complete rejected files are included in the verified manifest.

The actual initial-to-current spec diff contains only four scalar changes: held-rod `from.y` 418->429 and 384->395, and the two corresponding assertion endpoints. Source/text, all scales, fluid levels and remaining geometry are unchanged. Repair used=1, maximum=1, remaining=0. The newly found scale failure does not reset that budget.

Existing author calls are reused, not repeated: build_context=1, dedicated validations=2, renders=2 (including two renderer validations), six-theme preview runs=2, theme screenshots=12, native renderer screenshots=2, isolated browsers=4, closed contexts=14, model/image service calls=0. Current reviewer calls: render=0, preview=0, standalone gate=0, browser/service=0, repairs=0, promotion=0; one official `record_review.py --status fail` is required to record this completed judgment in R/review.json. That official writer performs its own embedded spec/hash checks; it is not a new visual review.

Read-only command incidents retained: one combined jq invocation accidentally included Markdown and exited 5 after reading the two JSON pixel-evidence files; one shasum invocation used nonexistent lesson.json/exercises.json names and exited 1. The actual template names were resolved from the frozen context bindings and verified. Neither incident ran a content gate or changed files.

No author, source, text, figure or stable tool edits; no second review, repair, new evidence generation, service, Git, DB, answer/choice access or promotion. This FAIL blocks this figure's promotion. It does not revoke s14's separate frozen TEXT PASS, approve other figures, or certify full lesson/product/safety behavior.
