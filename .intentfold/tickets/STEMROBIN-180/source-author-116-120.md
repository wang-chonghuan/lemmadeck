# Source Author: 6p Physical Pages 116-120

AUTHOR COMPLETE for the requested page-level source preparation, 2026-11-15. Independent source review is pending. This is only the next source batch in progress, not self-approval, batch6 completion, assembly approval or a new book-total claim.

## Execution And Counts

Used only existing shared Python:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`, with `PYTHONDONTWRITEBYTECODE=1` and `-B` on every invocation.

Processed exact physical pages 116, 117, 118, 119, 120 in order: existing `p2c.py prepare --book 6p --page N`, actually opened that page's full `page.grid.png` alone, transcribed durable `page.md` using `apply_patch`, then exact-page finalize. Opened each complete resulting source-figure PNG before exact-page vectorize. Page 116 has no figure, so no vectorize was necessary there.

Five prepare, six finalize (117's affected heading repair included), and four vectorize invocations all exited 0. No line-count or charset gate FAIL occurred. One real author-found heading-classification FAIL was preserved and repaired once as described below.

| Physical / Printed Page | Blocks | Final Printed/MD Lines | Source Figures | Normalizations | Audit Errors |
| --- | ---: | --- | --- | ---: | ---: |
| 116 / 105 | 4 | 5/5 | None | 0 | 0 |
| 117 / 106 | 12 | 17/17 | 94, 95 | 0 | 0 |
| 118 / 107 | 12 | 17/17 | 96, 97 | 0 | 0 |
| 119 / 108 | 15 | 20/20 | 98, 99 | 0 | 0 |
| 120 / 109 | 14 | 26/26 | 100 and unnumbered Pascal portrait | 0 | 0 |

Scoped totals: 57 blocks, 85 printed lines, seven numbered figures (94-100) plus one unnumbered source portrait. Twelve `ex` blocks represent eleven newly starting questions and the continuation of section 47 question 2.

All original `page.png`, `page.grid.png`, layout, crop PNG and vector SVG artifacts are retained under `.tmp/ld-s10y-lesson/6p/pages/0116` through `0120`. Physical 119 is 1472x2167 pixels, physical 120 is 1472x2172, and the other three pages are 1472x2161, all at 300 dpi. No multi-page compressed image was used.

## Fidelity And Boundaries

- Read only the tail of physical 115 for context. Its question 2 ends `...压强大？试` as open; `p0116#1` is `ex 2 cont`, beginning `解释这是为什么？`. Questions 3 and 4 are retained in full. The large blank remainder of page 116 was not filled with invented material.
- Physical 117 opens chapter `液体和气体的压强` / `（液体与气体静力学）`, followed by original section 48, `液体和气体对压强的传递　帕斯卡定律`. Original `象`, wording, pressure/motion relationships and emphasis are preserved.
- Physical 117 ends `施力于活塞，把它向容器中推进一些，则紧靠着活塞下方` as `p open`; physical 118 begins `p cont` with `的气体受到了压缩.`.
- Physical 118 preserves all three original 1-pascal statements, the complete bold Pascal-law conclusion, the bold law name and the start of the hollow-ball experiment. Its last paragraph ends `若在球中装上水，然后向` as `p open`.
- Physical 119 begins `p cont` with `管内推活塞...`. Retains all four section 48 questions and exercise 20 question 1. Printed emphasis dots on `气体也要把加给它的压强以同样的大小向各个方向传递` are represented by Markdown emphasis, with the range documented.
- Physical 119's original caption reads `瓶子的制做`, not a modern spelling correction. Its final printed punctuation was inspected in a local enlargement and retained as a comma. Figure 99's first caption line shares figure 98's caption row; the second caption line does not. They are recorded as `cap 图99 open samerow` and `cap 图99 cont`, retaining both lines without changing the counter.
- Physical 120 preserves exercise 20 questions 2 and 3, both homework questions, original `制做`, the real historical name `帕斯卡·布列斯`, dates 1623-1662, the French identity and `托里拆利` spelling. No historical entity or physics claim was modernized.
- A pre-finalize author read-back caught a duplicate `么` at the homework 1 line boundary; corrected before the first gate so line 1 ends `什` and line 2 begins `么形状？`, matching pixels. No independent-review result or gate failure was overwritten.
- The original two circled-1 glyphs on physical 120 are preserved semantically as `$\text{\textcircled{1}}$`, using text-mode LaTeX. The complete original footnote `液压机械——利用液体的运动及平衡规律工作的机器.` remains source text, not a page-number `foot` block.
- Source footnote placement is explicitly documented: the printed footnote is at the bottom, below figure 100 and above page number 109. Its independent `p` block is recorded immediately after the referencing first paragraph of section 49 so the source footnote remains retained and does not intercept the page-end `p open`. Every actual printed text line is retained; this logical placement needs independent review, not assumed approval.
- The unnumbered original Pascal portrait has no printed caption and was not assigned a fake numbered figure. Its stable page identity is `tbl-p0120-01`, explicitly owned by TOC lesson `phy6-c4-s1`, matching the neighboring scientist biography.
- Figure 100's caption shares the line `以下的部分通常都装满了油（最常`.
- Right boundary: `p0120#11` is `p open`, ending `以下的部分通常都装满了油（最常`. Physical 121 was not read, prepared or approved.

## First FAIL And One Affected Repair

The initial physical 117 chapter heading was incorrectly classified as `h2`. The first mechanical finalize passed 17/17, but the original page's large chapter heading and TOC chapter 4 establish that its correct block kind is `h1`. A mechanical pass was not treated as semantic permission.

Preserved first-failure evidence:
`.tmp/ld-s10y-lesson/6p/pages/0117/failure-01-chapter-level/{failure.md,page.md,page.json,audit.json}`.

Applied only the block `p0117#1` header change `<!-- h2 -->` to `<!-- h1 -->`, then finalized exact page 117 once. Read-only comparison verified:

- MD is byte-identical except that single header substitution.
- JSON is identical except `blocks[0].kind`.
- Metadata and audit bytes are unchanged.
- Both exact figure boxes and figure 94/95 PNG SHA256 values are unchanged.

This affected unit has consumed its one real author repair. No source-gate threshold, row deletion, normalization forcing, counter or `layout.py` modification was used.

## Actual Source Figure Inventory

Inventory was derived from the individually opened complete original grids and complete finalized PNGs, not from expected numbering or modern artifacts.

| Source Figure | Observed Pixels | Exact Final Box | Vector Mismatch |
| --- | --- | --- | --- |
| 94 | Full rectangular vessel with many particle rings/dots and a dark central piston at its top; no added force arrow or internal text. | `[216,1680,471,244]` | 0.016% |
| 95 | Full rectangular vessel and particle field, central dark piston pushed farther down, white downward arrow inside the dark piston. | `[799,1704,466,221]` | 0.024% |
| 96 | Vertical piston/rod/tube attached to a perforated hollow sphere; downward arrow, liquid-pattern region and multiple outward water jets all retained. | `[408,1359,179,573]` | 0.006% |
| 97 | Matching piston/rod/tube and perforated sphere; downward arrow, smoke-filled tube region and surrounding smoke plumes retained. | `[972,1327,188,616]` | 0.000% |
| 98 | Three adjacent vessels: wood-grain solid, granular dot texture and liquid dash texture; each has its original top load and downward-arrow marking. All vessel edges and arrow extremities retained as one numbered figure. | `[193,1579,392,280]` | 0.002% |
| 99 | Bottle/mould section, curved inlet pipe, hatched wall/base construction and all original callout lines and labels 1, 2, 3. No caption inside crop. | `[963,1506,219,390]` | 0.036% |
| Unnumbered portrait | Original rectangular halftone reproduction with a dark oval, Pascal in right-facing profile, hair and upper torso. Entire reproduced frame retained, no invented caption or number. | `[850,802,398,440]` | 0.947% |
| 100 | Connected narrow and wide pressure cylinders, liquid-region dash marks and both pistons; original labels A, B, S1, S2, F1, F2, both downward force arrows and the horizontal dotted reference line retained. | `[879,1433,441,393]` | 0.078% |

All eight existing vectorizer fidelity checks passed. Every crop was opened in full, including its right and lower edges. Captions remain outside the crop, and these source PNG/SVG files remain page-level scratch; no durable gallery promotion occurred.

Figure PNG SHA256:

| Figure | SHA256 |
| --- | --- |
| 94 | `ca617211d4afc9faa5d04b908556e3c3b3e1c3874eb1384e486d173a07db2582` |
| 95 | `565732d480e1b45e62308d104606a58c0c816182c0efac7e352da88ba931baa0` |
| 96 | `3efe4fab5ea697383eb58d5b4fd6fe746b83d135737492972187dbfccc6161d2` |
| 97 | `0ab8ce46687a0f3a4c6285600da539e25cf2ff848504dc70eab3afd1c1048f05` |
| 98 | `039a07c0373c90b89158478881ca4c1e2cf0861755688c51fb6c5fc52072907b` |
| 99 | `b758237abb14c8bd8ecd908dba3c6accec82c687d3cd0a309496edb0d6956396` |
| 100 | `b084c7cb7596084c85e551fde2d8f32e555764db6e76277c81f12f61bf61df6b` |
| Portrait | `490561c882a3e22a5c1a42714e18390bd44da8461ad4007b0c8ce3bfd81af2c9` |

## Final Snapshot Checks

Read-only comparison parsed each MD and derived figure IDs with the existing `blocks.fig_id` convention, then compared complete metadata and all block fields/text against durable JSON. All five matched. Current audits have no errors or normalizations, and printed/MD counts agree. This is author synchronization evidence, not independent pixel review.

Final SHA256:

| Physical Page | page.md | page.json | audit.json |
| --- | --- | --- | --- |
| 116 | `0e0709bb6af826d30d4a482096c01e9cd131df7c5d93b72ccc91979ee70f979e` | `e7c02e1c44c0cbc4a653ebabf61af8035f3912e03085f4917e4498f1c185a322` | `2f5b539ba3a154ffce6352345763581bf4c11339299e4ed045de81a120bca65d` |
| 117 | `316cc021160c013742903ff39e60ecf448731c1bf2e268c9dc914205692781d1` | `7784c1a1d784b16d364d23bfc5bad42f384a4b201ac2a8a0ca8d27f48cd09b5e` | `c4cf2564bab574e9775d623ac010da867625b2596dcc681a9294e024a5652bd0` |
| 118 | `ff9b10c75265bb177a599fc24d61d6f93c826f6e16527dd5b2b2674311676ea1` | `1d8842896946e8cb710f3f56b87183b0732b2f721e5065d700e037333c602325` | `1c736a3453c3dc6e7ea503b89df85a87d8586920bfcc9882c94f4d5da96f3f19` |
| 119 | `09fe866f221a3fdffc26cc76256e1d81945c97b126b279502a1f17aed2fce633` | `819ac3f71f4e67079406e6fa5f86553a220c9efdb09b57e857041d95c64270d5` | `7ecb5699ae79d1b0f1d3a6a59716e9cd708fc78f902a5ebb0c09765582819480` |
| 120 | `cf216da184b8948d205afd1c21306298afbb8eef49635db42d0b88f9e2cc4d5c` | `ee72d34da3056326939bfbf2f36e4d575a5d3aa16156ae9ea196e2323133a8c5` | `c247012baee44d44906347e0a962216dccd870dcae994cc129a8828214c03661` |

## Stop Boundary

No independent-review approval, assemble, TOC/index edit, durable lesson/edition write, modernization, DB, publication, Git, app, dependency installation, model or browser operation. No answer or choice artifacts were inspected. Physical 107/108 blockers and every other agent's pages/files were left untouched. Stop for independent review.
