# STEMROBIN-180 Batch57 SOURCE review: physical 293/294

Date: 2026-11-17. Fresh independent source reviewer; scope is physical 293/294 only. Read `.claude/skills/ld-s10y-lesson/SKILL.md` and `.agents/skills/ld-s10y-image/SKILL.md`. Conclusions below come from the original page pixels and their grids, not another reviewer's verdict.

## Decision

| Physical / printed | Source fidelity | Existing FIRST finalize | Mechanical readiness |
| --- | --- | --- | --- |
| 293 / 281 | PASS: all 22 printed lines faithful | 22 MD / 22 machine, exit 0 | PASS for this page |
| 294 / 282 | PASS: all 11 actual printed lines faithful | 11 MD / 13 machine, exit 1 | **HOLD pending corrected counter** |

No source-text correction is requested. The 294 source-fidelity PASS does not override its failed audit, authorize promotion/publication, or claim that a corrected counter has run. Parent owns the counter repair and subsequent mechanical evidence locally.

## Visual Evidence

Image count: **4/8**, one batch; no crops or reopens. Opened individually, in this order, at original resolution:

1. `S/0293/page.png`
2. `S/0293/page.grid.png`
3. `S/0294/page.png`
4. `S/0294/page.grid.png`

All four images are 1695 x 2580. The grids supplied coordinates; the ungridded originals supplied glyphs, punctuation and emphasis. No other page image, PDF rendering, browser or network surface was opened.

## Every-Line Check

The following row numbers include the title and footer where present. Each row was checked in full against both `page.md` and the corresponding JSON block line, not just the identifying text shown below. All rows PASS.

### Physical 293 / printed 281

| Printed row | MD line | Identifying text / punctuation checked |
| --- | --- | --- |
| 1 | 36 | `结束语`: actual bold heading, represented by `h3` |
| 2 | 39 | `力学是一门内容丰富的科学` ... `科学——` |
| 3 | 40 | `物理学的重要部分之一. 我们只研究了它的基本原理. 力学` |
| 4 | 41 | `的许多部分，例如刚体的转动或振动，我们还没有讨论. 力学` |
| 5 | 42 | `的一些问题还根本没有解决. 然而` ... `课程，已经` |
| 6 | 43 | `描绘了这门科学，更确切点说` ... `特点，这` |
| 7 | 44 | `部分叫做经典力学或牛顿力学，因为它是以牛顿定律为基础` |
| 8 | 45 | `的. 我们曾看到：` ... `（动量、加速度、` |
| 9 | 46 | `质量、力，等等）` ... `表示出来的. 这些` |
| 10 | 47 | `量本身可以利用仪器进行测量来得到. 这些仪器无论做得多` |
| 11 | 48 | `巧妙，测量也要有误差. 这就发生了一个问题：牛顿定律精确` |
| 12 | 49 | `到什么程度？` |
| 13 | 52 | `在上世纪末以前，谁也没有怀疑这些定律的绝对正确性.` |
| 14 | 53 | `事实上，牛顿定律是在人们开始广泛利用各种机器和工具的` |
| 15 | 54 | `时期建立起来的. 直到今天，还是根据牛顿定律来计算复杂` |
| 16 | 55 | `机器和机械的结构——从好几吨重的汽轮机和火箭，到其质` |
| 17 | 56 | `量不超过几克的精密仪器. 没有遇到牛顿定律“失败”的情况.` |
| 18 | 57 | `这些定律具有巨大的实际意义.` |
| 19 | 60 | `然而，在二十世纪发现牛顿定律毕竟不是绝对精确的. 当` |
| 20 | 61 | `物体的运动速度很大，接近于光速时，不能利用牛顿定律. 被` |
| 21 | 62 | `称为二十世纪的牛顿的爱因斯坦，总结出来了更普遍的运动` |
| 22 | 65 | Footer `281`; flanking decorative dots are page furniture |

Structure is `h3(1) + p(11) + p(6) + p open(3) + foot(1) = 22`. No figure, caption, exercise or footnote is present. The heading is the only distinct bold text; body is ordinary Song-style prose, without an omitted inline bold/italic/underlined emphasis span. Preserve the quoted `“失败”`, both long dashes, the physical-quantity list's parentheses and punctuation, and all printed period/question/colon placements. The spaced periods within lines remain `. ` in the manuscript.

### Physical 294 / printed 282

| Printed row | MD line | Identifying text / punctuation checked |
| --- | --- | --- |
| 1 | 36 | `规律，对于接近光速的运动也是正确的. 这些规律是所谓相对` |
| 2 | 37 | `论力学或相对论的基础. 牛顿定律是这些规律在物体速度远` |
| 3 | 38 | `小于光速时的推论.` |
| 4 | 41 | `牛顿定律“不能”用于研究原子内部粒子的运动. 研究这` |
| 5 | 42 | `种运动的规律叫做量子力学，从量子力学中作为特殊情况同` |
| 6 | 43 | `样可以得到经典力学. 非常出色的是，从牛顿定律导出的动` |
| 7 | 44 | `量和能量守恒定律，在量子力学和相对论中也是正确的.` |
| 8 | 47 | `我们看到：力学是所有自然科学的基础. 我们只学习了` |
| 9 | 48 | `经典力学的一小部分. 但是，在整个物理课程中，我们必须利` |
| 10 | 49 | `用这部分知识.` |
| 11 | 52 | Footer `282`; flanking decorative dots are page furniture |

Structure is `p cont(3) + p(4) + p(3) + foot(1) = 11`. No new heading, figure, caption, exercise or footnote. The original explicitly quotes `“不能”`; these are quotation marks, not a missing strong-emphasis span. Body typography has no distinct inline emphasis requiring markup. Every printed comma, colon, quotation mark and period is retained; no historical wording was modernized.

## Seam And Complete End

293 MD line 62 ends `...总结出来了更普遍的运动`, without a terminating punctuation mark, under `<!-- p open -->`. 294 MD line 36 begins `规律，对于接近光速的运动也是正确的.`, under `<!-- p cont -->`. JSON carries matching `open: true` and `cont: true`. Joining across the transparent footer produces `...更普遍的运动规律，对于接近光速的运动也是正确的.` without a missing/repeated character, inserted space, invented punctuation or spurious paragraph break. The continued paragraph closes on 294 at `小于光速时的推论.`.

The final two paragraphs are complete. The last paragraph ends `...我们必须利用这部分知识.` (MD lines 48/49 split `利` / `用`), with a printed period and no `open`. After it, the original is blank apart from scan dirt and the `282` footer. There is no continuation or omitted conclusion text below.

The actual `结束语` heading is on physical **293, printed 281**, visibly at approximately x=387-550, y=517-566. Read-only TOC lookup finds `$.contents[4]`, `id: phy8-conclusion`, `page: 280`. The source establishes the actual heading location despite that TOC discrepancy. **Do not invent or move a heading onto physical 292 / printed 280.** No 292 image was opened or its source artifact changed.

## Precise Mechanical Finding

294 `layout.json` contains ten true prose bands between y=233 and 1001 and the footer at y=2271-2301. Its extra bands **[1689,1728]** and **[1887,1923]** align with isolated irregular black stains at approximately x=1620-1660 in the otherwise blank right margin. They have no readable characters, text baseline, caption or figure identity. Both originals and grids show that these are scan dirt, not two missing content rows. Smaller right-margin stains around y=590/790 coexist with real prose rows and do not create extra source lines.

Thus visual counting independently supports 10 prose + 1 footer = **11**, while the bound current audit reports `lines_printed: 13`, `lines_md: 11`, and its sole error is the line-count mismatch. `unknown_chars`, `katex_warnings`, `normalizations`, figures and errata are empty. Do not add placeholder/duplicate lines, artificial `samerow`/`fig` blocks, empty paragraphs or `↵` to accommodate stains. Counter implementation and rerun are outside this review; **294 remains HOLD pending corrected counter**, including after this text approval.

Existing FIRST evidence was read, not rerun:

- `b57-source293294-finalize293-first.call.json`: 2026-11-17 13:37:54.647Z to 13:37:55.023Z, exit 0; stdout confirms 5 blocks, 22/22, PASS.
- `b57-source293294-finalize294-first.call.json`: 2026-11-17 13:38:55.982Z to 13:38:56.358Z, exit 1; stdout confirms 4 blocks, 11/13, sole line-count FAIL.

Both reside under `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`. No prepare, finalize, vectorize, assemble, adaptation, redundant content gate, database, publication, browser, network, commit or old-HOLD reopening was performed.

## Exact SHA-256 Bindings

All paths below resolve from these absolute bases:

- `A` = `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/artifacts/8p/pages`
- `S` = `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/work/8p/pages`

| Base | Exact relative file | SHA-256 |
| --- | --- | --- |
| A | `0293/page.md` | `1e59fc956b384cb52d842c239aa25b884f6f711a7c7850fae5e1419717992725` |
| A | `0293/page.json` | `54d975a898b3ff1ad8c7c5c985b22e4719ecbba23f72de7b2fbf11e941da50fb` |
| A | `0293/audit.json` | `9a1c0d3ca6c7685f8e5c09bef8b75a29355c4c646288d373c55856925b7d8d27` |
| S | `0293/page.png` | `e9514aa27b29c6df5550d5aef692df095f804413d71c6d52fc9fb13a4543144d` |
| S | `0293/page.grid.png` | `73eef0fda542cafd03a16bbc4fdf0274f7216f259be3f493544b4f503a0ae3f0` |
| S | `0293/layout.json` | `7711ba6102f7afd55e0ddde6c04a18b970f7e88d59ca865c6f3ad49ef6143a7e` |
| A | `0294/page.md` | `22c273553cb5bf4affaaa1662234a9116753fd051e5565de0ea66c3c5aacb3a1` |
| A | `0294/page.json` | `406a84f7f4980f2f9d1e5a1a01835055d6e0dd99c41da88baea3765c42fc8216` |
| A | `0294/audit.json` | `e93af1e3a63a528f9f1222e31a8ce56f90b14047752ddba287856a8304a7006b` |
| S | `0294/page.png` | `9e5e32a43f3c9761b2ed2b1ee2b214146665f03df79186415fcd20256d626d98` |
| S | `0294/page.grid.png` | `51b46cfd62a94e125b36668500c6a726042c510836016c0e87723d287b6f4a35` |
| S | `0294/layout.json` | `755878e7cf2c00f6d5f5138ace08414bfe083fbaa2f33b936eb7dd55b23d9ddf` |

Both MD frontmatter and JSON metadata correctly declare their physical/printed page identities, image dimensions and each original PNG hash. They declare source PDF SHA-256 `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`; this PDF declaration was read, not independently rehashed or reopened outside the authorized images.

Read-only snapshot and existing FIRST/TOC evidence are retained by the authorized recorder under the same `tmp/commands/` directory, with unique labels `source-review-8p293294-b57-snapshot-20261117-fresh1` and `source-review-8p293294-b57-evidence-20261117-fresh1` (`.call.json`, `.stdout`, `.stderr`). This report approves only the exact source-text snapshots bound above; it does not attest later changed bytes. Only this owned report was manually edited; other agents' artifacts and code were preserved.
