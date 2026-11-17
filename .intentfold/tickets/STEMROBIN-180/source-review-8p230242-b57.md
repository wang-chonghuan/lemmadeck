# Batch57 Independent SOURCE Review: 8p physical 230 / 242

Date: 2026-11-17.
Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Batch root: `.tmp/ld-s10y-lesson/b57-summaries/`.
Scope: ONLY `work/8p/pages/{0230,0242}/` and `artifacts/8p/pages/{0230,0242}/`; physical 230 = printed 218, physical 242 = printed 230.

## Verdict

| Source page | Verdict | Saved line audit | Corrections requested |
| --- | --- | --- | --- |
| 8p physical 230 / printed 218 | PASS | 23/23; errors empty | None |
| 8p physical 242 / printed 230 | PASS | 19/19; errors empty | None |

Both verdicts concern faithful SOURCE extraction, not modern-edition adaptation or publication. No source glyph, punctuation, emphasis, formula, visible-content omission, or summary-boundary defect was found.

## Independence and Limits

- Read `ld-s10y-lesson/SKILL.md`, `ld-s10y-image/SKILL.md`, the project router/engineering/operations rules, and the source `soviet-cn` profile.
- For each page, opened its original `page.png` FIRST and established an independent inventory before reading that page's complete MD, JSON and audit. Used existing detail crops only after the original.
- Did not read author `page.source-first.md`, previous review reports, prior chat history, old HOLD records, other pages' content, the database or book indexes.
- Independently opened the final SOURCE portrait PNG after the original page. Did not open or rerender the SVG.
- Exactly 7 image opens, including detail crops; 0 reopens. No further image opens are required.
- Authors' once-only finalization is the supplied task premise. This reviewer did not run prepare, finalize, assemble, vectorize, rendering, publishing or correction commands.
- Saved vector result `0.252% / pass` is reused as explicitly directed; it was supplied in the task, not independently recomputed here. Its current-file binding is recorded below. The page audit itself does not contain that numeric vector result.
- Read-only structural checks confirmed complete MD/JSON metadata and block-body equality, original-page SHA equality with `meta.render.sha256`, and line counts adjusted for `cap samerow`. Rechecked the 10 core page/portrait hashes before writing; none changed during review.
- An optional raw source/crop pixel-byte comparison could not execute: the skill-local Python environment is absent, system Python lacks Pillow, and the checked existing Node dependency paths lack pngjs/sharp. No dependencies were installed. PASS relies on direct source/crop visual inspection and the recorded hashes, not an unexecuted byte-comparison check.
- The only file written by this review is this report. Existing source files and other workers' changes were left untouched.

## p0230 / Printed 218: PASS

### Original-First Inventory

The original page contains, in reading order: the heading `练习 37`; four complete exercises occupying 3, 2, 2 and 2 printed lines; the separate heading `第七章提要`; seven prose blocks occupying 2, 1, 1, 1, 2, 2 and 2 lines; and printed footer 218. There is no figure or displayed algebraic formula. Right-margin spots are not content.

The four preceding exercises are not summary objects:

| Ref | Independently checked exercise content |
| --- | --- |
| `p0230#1` | `练习 37` |
| `p0230#2` | `1. 试说明下列情况下平衡的类型：а) 体操家在单杠上拿大顶；体操家吊在吊环上；б) 走钢绳的人站在钢绳上；в) 轮子套在轴上；г) 球挂在绳上；д) 球放在桌上.` |
| `p0230#3` | `2. 用什么方法保证下列物体有良好的稳定性：а) 实验支架；б) 塔式起重机；в) 台灯？` |
| `p0230#4` | `3. 拳术家在拳斗时，水手在船摇动的时候，怎样保证自己的稳定性？` |
| `p0230#5` | `4. 卡车运输相同重量的货物：第一种情况——钢件；第二种情况——棉花；第三种情况——木材. 哪种情况卡车最稳定？` |

In exercise 1 the two gymnast situations both belong to `а)`; they are not two separately labelled subquestions. Labels are source Cyrillic in natural order: `а` U+0430, `б` U+0431, `в` U+0432, `г` U+0433, `д` U+0434. Exercise 2 uses the first three of these. No Latin lookalike substitution was found.

### Complete Summary and Closed Boundary

Only `p0230#6` through `p0230#13` belong to this summary. The seven body blocks are recorded below with their source line counts; text is joined here only for readability.

| Ref | Lines | Source text |
| --- | --- | --- |
| `p0230#6` | 1 | 第七章提要 |
| `p0230#7` | 2 | 在设计永远处于静止状态的建筑物时，受力作用的物体的平衡问题，是一个很重要的问题. |
| `p0230#8` | 1 | 为了使物体平衡，必须满足两个条件： |
| `p0230#9` | 1 | 1) 作用在物体上的力的几何和等于零； |
| `p0230#10` | 1 | 2) 力矩的代数和等于零. |
| `p0230#11` | 2 | 对某个轴的力矩是表征在这个轴附近的力的转动作用的量. 它等于力的大小和力臂的乘积. |
| `p0230#12` | 2 | 物体的各种平衡实际上是不存在的，只可能存在稳定平衡或随遇平衡. |
| `p0230#13` | 2 | 当物体稍微偏离平衡位置时，如果作用在物体上的力使它回到原来的位置，物体的这种平衡就是稳定的. |

Precise checks:

- `p0230#12`, MD lines 74-75: the pixels really say `物体的各种平衡实际上是不存在的`. In particular, `各种` and `不存在的` match the MD/JSON. No inference from physics, replacement with a different equilibrium classification, or source erratum was introduced.
- `p0230#9-10`: source labels are `1)` and `2)`, not Cyrillic exercise labels. The first condition ends with `；`, the second with `.`; they remain distinct one-line prose blocks. The source does not print a summation equation, so none is invented.
- `p0230#11`: both sentence dots in `量. 它等于...乘积.` are retained. `力臂` is not replaced with a different term.
- Source question marks, colons, semicolons and the three paired long separators in exercise 4 are retained under the declared punctuation profile. Source sentence dots are ASCII `.` in the artifact.
- The heading is distinct; the summary body uses the source's consistent calligraphic typeface, without an isolated blackface emphasis passage to encode. No selective emphasis was omitted or added.
- Every summary block has `open=false`, `cont=false`. The final sentence closes after `稳定的.`; `p0230#14` is the footer, not summary prose. Exercises `#1-5` must remain outside the summary.
- Complete MD/JSON block text and metadata agree. Audit has `normalizations=[]`, `unknown_chars=[]`, `katex_warnings=[]`, `errata=0`, `errors=[]`; visual inventory independently supports 23 printed lines.

## p0242 / Printed 230: PASS

### Original-First Inventory

The page begins with the visible continuation fragment `造地球卫星.`. Next are five narrow lines about the first person flying in space on an artificial satellite, a right-side unnumbered portrait, three narrow lines about Soviet rockets, a portrait caption sharing the last of those rows, and a final full-width continuation line. Below those objects is `第八章提要`, followed by four complete paragraphs of 2, 2, 1 and 2 source lines. The last paragraph is blackface throughout. Printed footer: 230.

Preceding objects, ALL outside the summary:

| Ref | Source object / exact content |
| --- | --- |
| `p0242#1` | `p cont`: `造地球卫星.`; retain the fragment without inventing its missing beginning or a previous-unit heading. |
| `p0242#2` | `乘人造卫星在宇宙空间中飞行的第一个人，是苏联公民Ю. А. 加加林. 1961 年 4 月12日他乘《东方》号飞船飞遍全球.` |
| `p0242#3` | `p open`: `苏联的火箭第一个到达月球. 第一个完成了绕月飞行，拍照了月球看不见的“背面”.` |
| `p0242#4` | Unnumbered portrait, SOURCE id `tbl-p0242-01`; not a printed table or numbered figure despite the generated filename prefix. |
| `p0242#5` | Separate `cap samerow`: `Ю. А. 加加林(1934—1968)` |
| `p0242#6` | `p cont`: `第一个到达金星. 苏联在宇宙空间的研究中居首位.` |

The portrait independently shows the same short-haired, clean-shaven male bust, front-facing head, jacket/lapels, shirt collar, tie and shoulder boards visible in the original. Final PNG was opened separately and preserves these visible features with a clear margin; no face, hair, shoulder or lower jacket detail is visibly clipped. It contains neither the neighboring historical prose nor the separate caption. The original caption remains below the portrait and level with `拍照了月球看不见的“背面”.`; `samerow=true` is justified.

Historical names/numbers and punctuation are SOURCE facts, not modernization candidates: `Ю` U+042E and `А` U+0410 are Cyrillic in BOTH prose and caption; the date remains 1961 / 4 / 12, caption years 1934 / 1968. The double-angle title marks around `东方`, curly quotation marks around `背面`, caption parentheses and single year-range dash are retained in the profile's representation. No factual update or historical prose removal was made.

`p0242#3` joins `p0242#6` across the transparent figure/caption objects and ends before the summary heading; the caption is not merged into the rocket paragraph. This review confirms the visible first fragment and its `cont` designation but does not inspect the preceding physical page.

### Complete Summary and Closed Boundary

Only `p0242#7` through `p0242#11` belong to this summary:

| Ref | Lines | Source text / representation |
| --- | --- | --- |
| `p0242#7` | 1 | 第八章提要 |
| `p0242#8` | 2 | 物体的动量是描写运动的一个重要物理量. 动量是矢量，它等于物体的质量和它的速度的乘积. |
| `p0242#9` | 2 | 在一定时间 `$t$` 内作用的同一个力 `$\vec{F}$`，使所有物体都产生相同的动量，它等于力的冲量 `$\vec{F}t$`. |
| `p0242#10` | 1 | 对于动量，守恒定律是成立的. |
| `p0242#11` | 2 | **在孤立系统内，当物体任意相互作用和任意运动时，该系统内物体的总动量保持不变.** |

Precise checks:

- `p0242#8`, MD lines 74-75: source `描写` and `矢量` are retained, including the physical line break `矢` / `量`; no formula is added for the verbal definition.
- `p0242#9`, MD lines 78-79: the source has ordinary italic `t`, then an arrow over uppercase `F`, then another arrow over `F` followed by ordinary italic `t`. MD/JSON correctly use `$t$`, `$\vec{F}$`, `$\vec{F}t$`; the arrow does NOT span `t`, and neither arrow is lost. The source has no separate display equation, equality sign, momentum variable or subscript to add.
- The physical line break in `#9` remains after `产生`, before `相同的动量`; the comma after the first vector and the closing sentence dot after the impulse are outside the math delimiters.
- `p0242#11`, MD lines 85-86: blackface covers the ENTIRE two-line statement, not just `总动量` or `保持不变`. The stored opening `**` on the first line and closing `**` after the final `.` preserve exactly that range. Both `任意` occurrences and the printed `该系` / `统` line break are present.
- All four summary prose blocks have `open=false`, `cont=false`; the last statement closes after `保持不变.`. `#1-6`, including the portrait/caption, precede and do not belong to the summary. `p0242#12` is the footer only.
- Complete MD/JSON block text and metadata agree. Text lines total 20 before shared-row adjustment, 19 after counting the caption's shared row once. Saved audit confirms 19/19 with `normalizations=[]`, `unknown_chars=[]`, `katex_warnings=[]`, `errata=0`, `errors=[]`.

### Saved Vector Binding

Reuse the task's saved `0.252% / pass` for `tbl-p0242-01`; do not rerun it. This is below the source-vector skill's 2% mismatch limit. The review binds that carried result to the CURRENT original `page.png`, final portrait PNG and SVG SHA-256 values in the manifest below, and independently inspected the PNG against the original. No claim is made that the numeric mismatch was remeasured, that an SVG preview was opened, or that the page audit provides a hash-bound vector report.

Saved figure geometry agrees between MD, JSON and audit: exact content box `[875,267,465,608]`; audit records original coarse box `[870,250,490,630]` and 455 components. Geometry was read, never snapped again.

## Image-Open Ledger

Paths in this ledger and the hash manifest are relative to the batch root declared above.

| Open | Image | Purpose |
| --- | --- | --- |
| 1 | `work/8p/pages/0230/page.png` | ORIGINAL FIRST; independent full-page inventory |
| 2 | `work/8p/pages/0230/page.exercises.inspect.png` | Cyrillic labels, exercise wording/punctuation; lower exercise 4 checked on original |
| 3 | `work/8p/pages/0230/page.summary.inspect.png` | Full summary, especially odd source wording |
| 4 | `work/8p/pages/0242/page.png` | ORIGINAL FIRST; independent full-page inventory |
| 5 | `work/8p/pages/0242/page.top.inspect.png` | Historical prose, portrait and caption |
| 6 | `work/8p/pages/0242/page.summary.inspect.png` | Vector arrows, line breaks and blackface range; full heading checked on original |
| 7 | `work/8p/pages/0242/figures/tbl-p0242-01.png` | Independent inspection of final SOURCE portrait crop |

Total: **7/8**. No grid, SVG preview, newly created crop or image reopen.

## SHA-256 Manifest

| Current file | SHA-256 |
| --- | --- |
| `work/8p/pages/0230/page.png` | `8a67df37cab75f4beeca91afa8b54a448fc74151cc9d7d5024c8c21c3efc4638` |
| `work/8p/pages/0230/page.exercises.inspect.png` | `c2d1dca7c7c8a1cef1d5b8429c4128df694d6a95d1e7eb9552ea7363d4759001` |
| `work/8p/pages/0230/page.summary.inspect.png` | `acdfb67fbd72e84b8a3648a32032aa26680b86c4dfb47997f37d92d831e0aaf6` |
| `artifacts/8p/pages/0230/page.md` | `237fb89b3bd2553f4c205e5dfb4866fce0d3ea3c9fa91f95970625dde7e68679` |
| `artifacts/8p/pages/0230/page.json` | `64a52c3d2eb3ee0ad23513d8b8214074005fafcfc3e6a4fa1ac393d9a9264cff` |
| `artifacts/8p/pages/0230/audit.json` | `265716e3b6b8f0cc0b246a2e14d19a982263c2a468be089bea2f26325112a104` |
| `work/8p/pages/0242/page.png` | `10d992987ee1fc3c07b1c9a0c9de3aa021e9314d30d731cc0628de4f98c50828` |
| `work/8p/pages/0242/page.top.inspect.png` | `4950dbd655fb59c468fd64a4edfcdcc8ebb1ac7106da82594906f2be36803fd6` |
| `work/8p/pages/0242/page.summary.inspect.png` | `336cf9ba0bfad5ce0b36730c1da8ff5644176100c5cc17d27ee654ec21380e1f` |
| `work/8p/pages/0242/figures/tbl-p0242-01.png` | `1095ae318f027a8a15ebe93de4f01408ef6e518a85a5f5ab06e96a7c3c3897ee` |
| `work/8p/pages/0242/figures/tbl-p0242-01.svg` | `d1aec48429bf43a87f76dadd1287cc41eb539baca8f22b50d02b43792e019b56` |
| `artifacts/8p/pages/0242/page.md` | `00214b2f740f30b612cb237369ae24c4b4cc14c565d13831fc8b21bf895137c2` |
| `artifacts/8p/pages/0242/page.json` | `5ae75c120b6a31709af37485c595603909a799004ed0c7ba7d0de54924a8137b` |
| `artifacts/8p/pages/0242/audit.json` | `775744b38a040d5be3e1b7180fa623542df641ad044de804b7502d97837c8869` |

Shared source PDF SHA declared in both current page artifacts: `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`. This review independently hashed the page PNGs and artifacts, not the full PDF.

Final disposition: **p0230 PASS; p0242 PASS. No source correction, no regeneration, no database/index update, no changes to old HOLDs.**
