# STEMROBIN-180: b61 SOURCE author, physical 201/202

Completed only the two new owned source pages in the existing production invocation. This is SOURCE author evidence, not assembly, publication, a modern edition, or an independent parent review. STOP after physical202.

## FIRST Results

| Physical / Printed | Full Frozen Coverage | FIRST Finalize | New Figures, Traced Once |
| --- | --- | --- | --- |
| 201 / 189 | 10/10 blocks; 25/25 distinct printed rows | PASS, exit 0; 0 normalizations; 0 errors | fig-136 PASS; mismatch 0.00114 |
| 202 / 190 | 9/9 blocks; 19/19 distinct printed rows | PASS, exit 0; 0 normalizations; 0 errors | fig-137 and fig-138 PASS; mismatch 0.00022 each |

Each page was prepared once. Its full printed lines, punctuation/spaces, formulas, true emphasis and whole-figure inventory were frozen from that page's pixels before any page.md draft. MD/template/layout/source/profile hashes and FIRST snapshots were frozen before that page's sole finalize. Parsed finalized text and cont/open/samerow flags exactly match the frozen inventories. There were no FIRST failures, repairs or retries.

Physical201 pixels independently show **52. 在转弯处的运动**, consistent with the supplied TOC n52 boundary; no TOC title or old draft supplied the transcription. Only this heading has true bold weight. Neither page has underdots, so no source-dotspan or invented body bold was added. Raw printed science, history, numbers, vector v, A and r were preserved; errata remain empty. Every MD body line represents one printed line.

Figure136 is one complete tube/ball/down-arrow/metronome/table illustration. Figure137 is one complete curved-track/train/radius-arrow/signals/landscape/buildings scene. Figure138 is one complete wheel/flange/leader/轮缘/rail/base profile. No subpanels were split. Captions are separate cap blocks; captions136/138 have true ink boxes and samerow with adjacent prose. Actual dotted page-number footers are foot blocks.

| Figure | Frozen Rough Box [x,y,w,h] | Sole Snapped Box [x,y,w,h] |
| --- | --- | --- |
| fig-136 | [1100,840,470,895] | [1123,855,331,861] |
| fig-137 | [250,410,1160,560] | [264,419,1133,545] |
| fig-138 | [1040,1615,370,565] | [1060,1628,319,536] |

## Named Hash Bindings

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Source/artifact root: `.tmp/ld-s10y-lesson/b60-elastic/artifacts/8p/pages/`.
Rendered-source/figure root: `.tmp/ld-s10y-lesson/b60-elastic/work/8p/pages/`.
Evidence root: `.intentfold/tickets/STEMROBIN-180/tmp/b61-author201202/`.

All names below resolve under those roots. SHA-256 values bind exact bytes, not descriptive names.

| Named File | SHA-256 |
| --- | --- |
| source PDF: 8p 苏联中学课本 物理 八年级.pdf | `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46` |
| work/0201/page.png | `d4b411524a704744ff35540cd58a6e82d860179867d34a4c952710935cc7e8ff` |
| work/0202/page.png | `1b73b815e0a5534266b72615d6c714db890eba470f925c6bf22c172d4737abd6` |
| artifacts/0201/page.md | `35394b2cf3e1b8145ea60b625e88da3bd025cf463b4a0b2088813450a409c195` |
| artifacts/0202/page.md | `8502fe4771b63b21b7f57b2fb01238a87d9850458742b4f23d8af5299c4c8985` |
| artifacts/0201/audit.json | `26f5acc25a219aa16d5793c7d893fbe8f4c993cad9b6de8b5e82347a8632b270` |
| artifacts/0202/audit.json | `43386f44ee6bc20412a4ce9fa9d5efbbe4a48eec9bc724a348467c94ac9d9f4d` |
| evidence/p0201.source.expected.json | `b57871cd8e5231675a0f3c58fb162973a8d9f67a778fe34e3793a83f1caf9c4d` |
| evidence/p0202.source.expected.json | `ebf2d496b6a93bb0cf2bf776c71f3fb120ed649e8dc9313c7ff5969f9cef082c` |
| evidence/p0201.FIRST.json | `3c5fcdabbd6ff7fef37ceffb9fbe16b785261e04688076a4c58622c9c4aaf684` |
| evidence/p0202.FIRST.json | `458841e3886c7327e497e2203060831a2307367184bee30a3f475e561ef3631c` |
| evidence/p0201.receipt.json | `85747bce59199d2c249b48d4ec036172b1b24e6db01410eb0590670950d18d7d` |
| evidence/p0202.receipt.json | `ea3f94ec9fe216ab46b4f6a2f097ecbbe256a12a0299241188b9bf6bd710b5ec` |
| evidence/package.hashes.json | `0071d3072ac58a68fde3ae8434e9f51106e3fcaf5da488ff6b4bb6aeca3566f9` |

`package.hashes.json` additionally names/hashes both page.json files, every source render/crop, complete figure PNG/SVG outputs, vectorize.report.json files, independent source-freeze records, FIRST MD/template/layout/profile snapshots, the image ledger, evidence helper and recorded command streams/calls through packaging. Sole-finalize calls are `tmp/commands/b61-author201202-finalize0201.call.json` and `tmp/commands/b61-author201202-finalize0202.call.json`. `report.receipt.json` binds this report and the package plus the later report-input command.

## Budget And Boundaries

Exactly 8 images loaded in one batch and this context: page201 full + two native crops + its finalized figure136 crop = 4; page202 full + figure137/middle/lower native crops = 4. Budget 8/8 batch, 8/24 context; 0 reopens and 0 OCR. The image ledger names all eight and hashes are in the package. Deterministic prepare/finalize/vectorize pixel processing did not add model image payloads. Page202 finalized crops/SVG previews were not reopened; their tracing checks are machine evidence, not an additional visual review.

Incoming physical200 is UNKNOWN and unread. Page201's opening fragment is locally marked cont; its antecedent/ownership is not established. Page201's textual tail is `的合力应当指向圆心.`; page202 starts a new example paragraph in n52. Outgoing physical203 is UNKNOWN and unread. Current tail, left open with no added completion/punctuation: `本身也发生形变）. 此时，产生了弹性力，其方向垂直于钢轨`. The prose reference to 图139 remains pending; its source pixels/location and n52 completion are UNKNOWN. N52 is not assembled or promotable.

Residual uncertainties are preserved: faint tube marks and unnumbered railway sleepers/landscape strokes have no invented quantitative count; physical200/203 were not corroborated; page202 generated crops lack a post-finalize visual reopen. No affected-coordinate repair was attempted; any future repair belongs to the parent. No shared tools/profile/charter/index/others were changed. No freshness/setup/old-PASS/gate replay, assemble/modern/answers/choices/DB/backend/Git operation was run. All shell commands after the sole unwrapped record-step read used unique b61-author201202 labels through record-step.mjs and the specified Python with -B.
