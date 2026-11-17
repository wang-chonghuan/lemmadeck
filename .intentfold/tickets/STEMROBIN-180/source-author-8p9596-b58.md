# STEMROBIN-180 SOURCE AUTHORONLY: b58 / 8p physical 0095-0096

Date: 2026-11-17. Existing invocation only. Status: **PASS for both first page finalizations; target n19 source boundary CLOSED.** This is not assembly, adaptation, promotion, publication, or product acceptance. The outgoing n20 fragment remains **HOLD / OPEN / UNCLAIMED**; incoming exercises remain unclaimed as to their upstream lesson/group.

## Ownership And Method

- Initial absence of all four owned page directories and this report was recorded in `b58-author9596-006-check-owned-paths.call.json` (exit 0).
- Writes were limited to `.tmp/ld-s10y-lesson/b58-angular-speed/{artifacts,work}/8p/pages/{0095,0096}`, this newly created report, and unique `b58-author9596-` recorder receipts. Existing dirty work and HOLDs were not modified or repaired.
- All shell commands went through `node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs UNIQUE CMD ARGS`. Manual transcription and report creation used the existing `apply_patch` executable through that recorder.
- Interpreter: `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`; tool: `.claude/skills/ld-s10y-lesson/tools/p2c.py`.
- Common pipeline arguments: `--book 8p --root .tmp/ld-s10y-lesson/b58-angular-speed/artifacts --work .tmp/ld-s10y-lesson/b58-angular-speed/work`; page arguments were `--page 95` and `--page 96` respectively.
- Sequence: first prepare 0095 once; original PNG load 1; only then template/layout read; write complete page.md; first finalize 0095 once; skip vectorize (no figures). Repeat for 0096, original PNG load 2, first finalize once, skip vectorize (no figures). Stop after these two pages.
- Image loads: **2/8 total**, both complete original page PNGs at original resolution. No grid image loads, crops, reopens, other source pages, or historic HOLD reads. Text inventory and hashes were read after finalization without rerunning it.
- No new freshness/setup, code/tool changes, Git changes, backend access, app execution, DB/network access, publish, checkpoint edits, assemble, adapt, modern figures, answers, choices, or promote.
- Repository lesson cap1/cap3 rules, image-batch rules, structured authoritative TOC, manifest, and source profile were read. Sentence stops use ASCII dots with appropriate spaces; source formulas, uppercase V, footers, true headings, and the bold angular-speed definition were retained.

## Authoritative Binding

The parsed Chinese TOC has `authority: extracted`, `book: 8p`, and identifies:

| Item | Printed Number | Title | TOC Printed Start |
| --- | --- | --- | --- |
| `phy8-c1-s3-n19` | 19 | 匀速圆周运动的角速度和线速度 | 83 |
| `phy8-c1-s3-n20` | 20 | 匀速圆周运动物体的加速度 | 84 |

Ancestors are `phy8-c1` and `phy8-c1-s3`. The manifest binds catalog `8p` to source PDF `8p`, with `exerciseNumbering: lesson-group`. No ownership/group was invented for the exercises before the n19 heading.

The original pixels independently show physical 0095 footer `· 83 ·` and physical 0096 footer `· 84 ·`; these printed-page values were observed, not inferred from a presumed offset. Both renders are 1695 x 2580 at 300 dpi. Page-margin black spots were identified as scan blemishes, not figures or text.

| Original / Rule | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/sources/soviet10years/8p 苏联中学课本 物理 八年级.pdf` | `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46` |
| `ssot-resources/soviet10year-textbooks/toc/8p/zh.json` | `12799b8b9e414dc4b8ca9fc246cd146a18886a7751aca91aaf9c9618d434baa8` |
| `ssot-resources/soviet10year-textbooks/sources/manifest.json` | `904dd05c8987efef50f788c456c412616253c3082bc734c1eb0771ceda1c799a` |
| `.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json` (source/profile binding in prepared and finalized metadata) | `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849` |

The actual PDF SHA256 and size (16961276 bytes) match the manifest record, which declares 309 physical pages. Hashing the PDF did not inspect any additional source pages.

## First Receipts

All receipt basenames below are under `.intentfold/tickets/STEMROBIN-180/tmp/commands/`. Each first command ran exactly once and exited 0 with empty stderr; no failure was repaired or rerun.

| Page | First Operation / Receipt Basename | Result | `.call.json` SHA256 | `.stdout` SHA256 |
| --- | --- | --- | --- | --- |
| 0095 | `b58-author9596-012-prepare-0095-first` | 24 detected printed rows | `a825b0bd0fa28c57edd4b5d7da9b7c8c535730639b134409bb5a7ada5cde0855` | `7b8ea2e8f82757e30297b38bd1407ae371caea309eec45c758d5a9dc31e611b1` |
| 0095 | `b58-author9596-018-finalize-0095-first` | PASS: 9 blocks, 24/24 rows, 0 figures, 0 normalizations | `a590b035c7fdb583174c735f93724f9f0fec67039066f16d5d174245327b4d37` | `6400c4466e2aca44ed11acc3fb2f45230b5477c04d79972e982109e67554c233` |
| 0096 | `b58-author9596-019-prepare-0096-first` | 24 detected printed rows | `2dfd0da501e73ef9bb8d8b6163f58c33696c5038ddb465ca68d7d73a0ba50202` | `991e39bef3b07b85e8636dfa9925cff91f7759ba78c35e7b0fff44afdf4881bd` |
| 0096 | `b58-author9596-023-finalize-0096-first` | PASS: 11 blocks, 24/24 rows, 0 figures, 0 normalizations | `99a88f7ca472e3d6e6e47830aa636ec115a9941c43be1a99f0bc3ef55e06a16c` | `2ed31448660ab6d8a6d2cacf94effec210b006ad9055cccc6e4369c822b8ebeb` |

All four `.stderr` files have 0 bytes and SHA256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. Each `.call.json` preserves exact interpreter, args, cwd, timestamps, exit, and stream hashes.

Original-before-template load receipts: `b58-author9596-013-original-0095-load1` and `b58-author9596-020-original-0096-load2`. Authoring receipts: `b58-author9596-017-author-0095` and `b58-author9596-022-author-0096`. Full textual output/hash inventory: `b58-author9596-024-inventory-hashes`. Report creation: `b58-author9596-025-write-report`; the report itself is hashed externally in `b58-author9596-026-report-hash` to avoid a self-referential hash.

Both audit files have empty `errors`, `unknown_chars`, `normalizations`, `katex_warnings`, and `figures`, with `errata: 0`. No first-finalize failure occurred. Vectorize was not invoked on either page because there were no figure blocks.

## Block And Figure Inventory

References use the existing one-based page-block convention.

| Page | Ordered Blocks | Text Rows | Figures / Captions |
| --- | --- | --- | --- |
| 0095 | #1 ex 3 (2); #2 ex 4 (2); #3 h3 n19 (1); #4 p including omega=phi/t (6); #5 p (2); #6 bold-definition p (2); #7 units p (2); #8 p open (6); #9 foot (1) | 24 | 0 / 0 |
| 0096 | #1 p cont (3); #2 turns/frequency p (6); #3 period p (4); #4 exhead 练习 14 (1); #5 ex 1 (1); #6 ex 2 (1); #7 ex 3 (2); #8 ex 4 (3); #9 h3 n20 (1); #10 p open (1); #11 foot (1) | 24 | 0 / 0 |

Figure crops, SVGs, figure claims, and crop-inspection obligations: none. No figure was invented from margin blemishes or displayed formulas.

## Exact Boundaries And True Closure

Incoming material on 0095 is two whole exercises before the real n19 heading, not a fabricated continuation or new n19 exercise group. The exact retained incoming text is:

```text
3. 两个速度矢量的绝对值相等，都等于 15 米/秒，如果它们形成
$5^\circ$ 的夹角，试求这两个速度矢量之差的大小.
4. 两个绝对值相等的位移矢量之差的大小等于 2 厘米，而两个位
移矢量之间的夹角为 $2^\circ$，试求这两个位移矢量的大小.
```

These individual exercises are closed, but their upstream lesson/group remains UNCLAIMED. No preceding page or historic HOLD was consulted.

The exact 0095 outgoing tail (`p0095#8`, `open: true`) is:

```text
的关系是很简单的. 如果在角速度的表示式中，用 $\frac{l}{r}$ 代替 $\varphi$，
则我们得到：$\omega=\frac{l}{r\cdot t}$. 又因为 $l=Vt$，所以
```

The exact 0096 incoming continuation (`p0096#1`, `cont: true`, `open: false`) is:

```text
$\omega=\frac{V}{r}$，
或
$V=\omega r$.
```

This closes the carried n19 paragraph. The remaining n19 prose reaches the exact final formula:

```text
$T=\frac{1}{n}=\frac{2\pi}{\omega}$.
```

Its real `练习 14` contains four complete questions. The exact final n19 exercise (`p0096#8`) is:

```text
4. 如果克里姆林宫钟楼自鸣钟的分针长度为 3.5 米，那么，分针
针尖的线速度等于多少？试把这个分针的角速度与手表的分针角速度
进行比较.
```

The following real heading is `20. 匀速圆周运动物体的加速度`. Thus n19 is **source-complete within these two pages**, including its four exercises. No target n19 block remains open after matching the 0095 tail to the 0096 continuation. This is a textual source-boundary conclusion, not an assemble or publish result.

The exact outgoing unclaimed n20 fragment (`p0096#10`, `open: true`) is:

```text
现在回到我们的任务——求做匀速圆周运动的物体（我
```

That fragment is truly incomplete, including its unclosed source parenthesis. Status: **HOLD / OPEN / UNCLAIMED**, not success or a completed n20 lesson. No closing text was invented and no next page was read.

## Exact Page Outputs

All paths below are relative to `.tmp/ld-s10y-lesson/b58-angular-speed/`. Original renders, untouched prepared companions, and finalized page files are all included; there are no figure files.

| Path | Bytes | SHA256 |
| --- | --- | --- |
| `work/8p/pages/0095/page.png` | 105971 | `f48152d38d48ebb6cd43d3b73ef1ce4b0ef90ebf38eb0db244473906fa30796d` |
| `work/8p/pages/0095/page.grid.png` | 129114 | `c8373db6199097298c63ff7a49f577dc130b33c7a178f63012c6a091970d1ad7` |
| `work/8p/pages/0095/layout.json` | 922 | `cbc1f9f0d75743c7d5087c2e048598d21c58fd611d38a207eccdae67cdd2dc5e` |
| `work/8p/pages/0095/page.template.md` | 1437 | `4c6229c17dc10378573ad0693c4907769e07b28d370ffc980042c162760250fe` |
| `artifacts/8p/pages/0095/page.md` | 2727 | `7ff758aa9c13dacabd9e4159497742629e168ad6b0fcfaf445b854903c948550` |
| `artifacts/8p/pages/0095/page.json` | 4704 | `210432e296b8e8efbc69c27faf95f0ab84df4e50465928f0db6cc29160221798` |
| `artifacts/8p/pages/0095/audit.json` | 177 | `13ebdc5afe506e3942d1f5892020e52803fdbf726be20fbe576a1c85cbd7fbdf` |
| `work/8p/pages/0096/page.png` | 84825 | `860834a3ce3b5d577260dd2ab6923ebee2614d4ef6c8afe5f0af78307e0ba954` |
| `work/8p/pages/0096/page.grid.png` | 105195 | `0a9ca3157b0ed0abeb961ec4449f6ab1959276fc7727e10b91d8fc486a30b57a` |
| `work/8p/pages/0096/layout.json` | 922 | `cc3f34e83e61aa2ef0cb849b8fd67ceb9bd5e74b0c9af370dfb638057738476d` |
| `work/8p/pages/0096/page.template.md` | 1437 | `29e2f4be76ebf57cfdf7572b2fecba0175f1e5724bfeb80a8800e863aa225576` |
| `artifacts/8p/pages/0096/page.md` | 2445 | `78f4c3504cbdff0fbeb2e21ae5a0a8d0464f110fdcb7dc3fd6e3750383ffc0f6` |
| `artifacts/8p/pages/0096/page.json` | 4767 | `bccfe0ca0709ab790ec8c5a846fd9340e79ba264ba148cf9cba0d9388cd6dce0` |
| `artifacts/8p/pages/0096/audit.json` | 177 | `1b2470cfdcc8f39ce6472297e76e6d4249889759f7180e922bbcae5c4344325e` |

Stop condition met: only physical pages 0095 and 0096 were processed, without repair/rerun or downstream work.
