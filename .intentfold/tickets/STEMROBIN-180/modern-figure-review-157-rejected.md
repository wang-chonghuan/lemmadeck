# Fig157 Independent Full Review

Verdict: **FAIL / BLOCKED**, 2026-11-16. This is the single substantive independent source-first review of Bacon's immutable repair-01 candidate, not author approval or a full lesson gate.

## Findings

**F157-TICKS-1 (essential source-fidelity failure): the upper source ruler strokes are not fully retained.** The original complete PNG and existing source-only 2x detail sheet show scale strokes above the upper `2` in all three source gauges. The candidate's full SVG and six native samples omit the leading recorded source bands, visibly shortening the upper scale region. Tube fasteners and the board boundary do not supply those missing central strokes.

The exact frozen observation-to-object deficit is:

| Panel | Original PNG tick lane (x1,y1,x2,y2) | Recorded merged ink runs | Mapped run indices | Unmapped indices and original y bands |
| --- | --- | --- | --- | --- |
| 1 | (338,63,357,375) | 22 | 1..21, 21 distinct indices | 0:66..69 |
| 2 | (754,52,777,375) | 32 | 4..31, 28 distinct indices | 0:53..56; 1:60..63; 2:65..68; 3:71..74 |
| 3 | (1136,53,1158,375) | 29 | 1..28, 28 distinct indices | 0:56..76 |

Thus 77 of 83 recorded merged ink runs have mapped minor objects; six recorded runs do not. This is an exact **merged-ink mapping deficit**, not a claim of six known subdivisions. Panel 1's separate 66..69 top stroke and panel 2's separate 60..63, 65..68 and 71..74 strokes are sufficient definite examples. Panel 2's top boundary-adjacent band and panel 3's dense 56..76 cluster are retained as such; no exact number of hidden strokes within the merged cluster is guessed.

The candidate's first central minor strokes are `panel-1-observed-minor-1` at SVG y=97.0322580645161, `panel-2-observed-minor-4` at y=101.22033898305085 and `panel-3-observed-minor-1` at y=102.57627118644064. The full current SVG has no replacement central strokes for the omitted upper bands. The frozen inventory permits schematic resizing and numeral-clearance splitting, but does not justify dropping visible source scale marks. All fifteen numerals being present is not complete source-scale fidelity.

**Admission limitation, not an additional observed physics failure:** the depth, meniscus and opening assertions predominantly compare literal coordinates. Cross-panel equalDistance assertions use those literals rather than the liquid-path endpoints, and the selected major-spacing checks do not assert complete source tick coverage. Actual endpoints and pixels do support equal depth/levels in this candidate, but mechanical PASS cannot supply the missing source scale structure. No checker/spec patch was made.

## Complete Review Coverage

- Original complete fig157 PNG opened before candidate interpretation: 1232x471 pixels, all three source apparatus panels. The existing source-only 2x detail sheet was also opened for the scale and membrane profiles.
- Read the complete frozen approved s14 text through `context.json`: all 20 lesson blocks, all three original prompts, full liquid/metal apparatus explanation, Pascal attribution and all seven figure anchors. No nearby-only substitution, answer key, choice or private solution was read.
- Read all 199 spec objects in bounded, nontruncated segments, all 25 assertions and all seven inventory groups; read the entire source inventory and source-scale observations.
- Parsed the full current SVG XML and examined every visible geometry/text element and raw path in order. Painted geometry contains 165 lines, 35 raw paths, six polygons, two membrane ellipses and fifteen labels. Another two paths and 308 helper ellipses are hidden renderer internals. Canvas/viewBox is 640x640.
- Opened all six existing native PNGs individually at actual widths 306 and 640, neutral/accent/print. No sheet-only review, new screenshot, preview, rendering or standalone validator run.
- Verified all 91 freeze-manifest file hashes and byte sizes, with zero discrepancies; all four complete-context bindings match. The earlier recursive handoff/context comparison matched all 34 bound records.

## Source, Physics And Visual Judgments

Each complete apparatus retains the hand, held rod, offset support, separate rim support, water vessel, membrane box, hose, U passage, ruler board, fasteners and base. The repaired hand/rod interfaces are visibly connected at both widths.

Source left-to-right membrane order remains SIDE/front circular face, DOWN/underside profile and UP/upper-face profile. This agrees with the actual original panels. The text's up->side->down rotation sequence does not require reordering these views. The three membrane planes are at SVG y=510, with a common water surface at y=310.

Every hose reaches its left connected limb, while the right reference limb remains open to atmosphere. The boxes and hose couplings remain visibly joined, without a stray open reference branch; the layered glass/lumen/liquid paths preserve the U bottom. In all three panels the corresponding liquid endpoints are SVG y=343 on the left and y=273 on the right. Thus the connected side is lower, the atmospheric side higher, and both corresponding levels and their separation remain unchanged across the rotation. Schematic equality is not invented pressure/depth data.

All fifteen unsigned numerals retain top-to-bottom `2,1,0,1,2`. No scale unit, negative sign, numerical pressure, h annotation, orientation caption, equation or task answer was added. Broken source water marks are uncalibrated texture and can be regularized as fill. The upper source scale omissions are the essential exception to otherwise retained ruler/apparatus structure.

All six actual samples are nonblank; apparatus, liquid surfaces and membrane directions remain distinguishable in neutral, accent and print. Existing measurements give minimum text size 16.25625px at 306 and 34px at 640; numerals are readable without overlap or clipping. Inline instructional maxWidthPx=640 applies; no scroll-end or hybrid artwork-layer gate is applicable. No source cultural symbol, Chinese figure label or fictional identity was introduced.

## Frozen Evidence

All paths below are absolute. Let R be `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-157-author/repair-01`.

| File | SHA-256 |
| --- | --- |
| R/author-handoff.json | c79552330279088175e4186b47981c4f046a2c2ec337d80c2e19522d073d0d67 |
| R/context.json | b61c3ad313166605a9c26910141f178c233c4a51be48a54d080430dcad5a3a12 |
| R/fig-157.spec.json | 00912109d8dd573072839142a256d20685b18870da8fa120a3c9ceffe0a99b6c |
| R/fig-157.svg | 240dc8d8ce94db8b7a19e40f742e007c5ea4713ffa7bbbaea8925122e585464b |
| R/fig-157.render.json | 9522e14a07b6930f66dad154fc77ae4cf114535d40ef1211fec4368bee0237f8 |
| R/author-preview-report.json | 800495b34721033e2d08b942b6d538707126d662b31fddf3393342b98c305e71 |
| R/native-pixel-evidence.json | 929460563bb24c242a9c1c82b457b43bef5fcd924dc2b60ebec161acd5e2c3b8 |
| R/source-inventory.md | 7f89408065752fb5a5e80ca7c81a9cf28be2c966fee5e44a2b4a6abfcaabacce |
| R/source-scale-observations.json | 0993820e2a133107e4a1a58e951a6751bef46a49ea9c8add51476cfd82f43755 |
| R/author-freeze-manifest.json | 192a101636c75607ef629f276dd0c77e43d2ab798aefab37661230098cf56ff4 |
| R/repair-authorization-and-diff.json | d2a55213d2916a4b6117504e36218bb1b1dbe96b7114b6ee1f733d32f8a85123 |

Actual opened original: `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-157.png`, SHA-256 `8d6b192883509837344bab0364e0de91c3fcdc1ac9b2dc8b0a3200c3897dbba4`.

Actual opened source-only detail: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-157-author/source-details-2x.png`, SHA-256 `7d38d941f3a31bdfd6e4cfc27fb8f56cf57a7975cb93e102d5cabcb058a802e9`.

Full approved text bindings: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-c4-s14/adapt/6p/modern-us-neutral/lessons/phy6-c4-s14/lesson.template.json`, SHA-256 `0c67880c0f4e795067c4ff2547b3f2bf3519e8eeefc5fd18466b0e07bf918974`; adjacent `exercises.template.json`, SHA-256 `11e6ec7e11f8278562ced757da847aa9b0bd28db3e656079615a72462805dd08`.

All six actual opened samples are under the absolute R/previews directory:

| Filename | SHA-256 |
| --- | --- |
| fig-157-306-neutral.png | d7af2a2dd72d66fc7a28885027dc9730a136c264b46072b5c030c70b2d80c9ea |
| fig-157-306-accent.png | 2703d97a524e555447853802db38b4c69ebcf12072b26ae6242abf7761aae9fe |
| fig-157-306-print.png | 950313cf5e9fdb3f7060bf763e325c3fa403262139790955dbd529fef9182c9a |
| fig-157-640-neutral.png | a71855cba3b083bfb1c8afdc14a60b5a621dda23f95f82280c63fecff3c2c4ae |
| fig-157-640-accent.png | b3d136824595d6b242728519b7493da905e3afa13ceb266a1e72d92517b51e51 |
| fig-157-640-print.png | 31445310b61c234d6703bacbae4e50c1e5ca8cc6e931850b60395fb0967fb010 |

## Failure Preservation And Boundaries

First author visual FAIL `AUTHOR-VISUAL-HAND-ROD-1` remains under `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/6p/fig-157-author/failure-01`; `first-failure.json` SHA-256 is `6def175ba8100a7fff432d7c7a04f5c14d23e0b6c53b659f453cefffdaacbfda`. Its complete rejected files remain in the verified manifest.

The actual initial-to-current spec diff contains only six scalar changes: the three held-rod `from.y` values 426->437 and their matching assertion endpoints. Source/text, scales, fluid levels, membrane directions and all other geometry remain unchanged. Repair used=1, maximum=1, remaining=0; the remaining source-scale failure does not reset the budget.

Existing author calls are reused: build_context=1, dedicated validations=2, renders=2 (including two renderer validations), six-theme preview runs=2, theme screenshots=12, native renderer screenshots=2, isolated browsers=4, closed contexts=14, model/image service calls=0. Reviewer render/preview/standalone gate/browser/service/repair/promotion calls are all zero; one official `record_review.py --status fail` is required to record this completed judgment in R/review.json. Its embedded spec/hash checks are the official writer's checks, not a second visual review.

The two shared read-only command incidents are retained in the companion fig156 report: jq received a Markdown argument (exit 5), and shasum received two nonexistent guessed filenames (exit 1). Correct actual text-template bindings match; neither incident changed files or ran a content gate.

No candidate/source/tool edits, second review, repair, new evidence generation, service, Git, DB, answer/choice access or promotion. This figure remains blocked after its exhausted sole repair. This is neither full lesson approval nor product/safety certification, and it does not revoke the separate frozen s14 TEXT PASS.
