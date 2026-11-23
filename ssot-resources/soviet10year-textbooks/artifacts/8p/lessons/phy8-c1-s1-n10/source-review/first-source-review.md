# STEMROBIN-180/180-7 n10 First Independent Source Review

Verdict: **PASS**, source fidelity only.

Date: 2026-11-23. Role: sole independent source reviewer, not the source
author. Checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
This is the original verdict, retained before any reviewer-requested repair.
No source repair is requested or performed.

## Scope and Evidence

Reviewed the FULL physical pages 49, 50, 51, 52, printed 37, 38, 39, 40,
against each current durable `page.md`, `page.json`, and `audit.json`.
Read current lesson cap1, production-resume SOP, shared image-batch rules,
and soviet-cn profile. Read `pages/0050/source-author.md` and the actual
per-page initial execution receipts and captured streams. Their exit-0
finalize results are mechanical evidence, not the basis of this semantic PASS.

Existing receipt locations, relative to the stated checkout:

- Page49: `.tmp/180-7-n9-source-author/p0049-first-finalize/execution.json`,
  `stdout.txt`, and `stderr.txt` in that same directory.
- Pages50..52: their durable `pages/0050`, `pages/0051`, `pages/0052` directories
  under `ssot-resources/soviet10year-textbooks/artifacts/8p/`, each containing
  `source-finalize.execution.json`, `source-finalize.stdout`,
  and `source-finalize.stderr`.
- Original author capture for 50..52: `.tmp/180-7-n10-source-author/`,
  `p0050.execution.json` / `p0050.stdout` / `p0050.stderr` and corresponding
  `p0051` / `p0052` files. Retained stream bytes match those captures.

Images opened sequentially, 49 -> 50 -> 51 -> 52:

- `.tmp/ld-s10y-lesson/8p/pages/0049/page.grid.png`
- `.tmp/ld-s10y-lesson/8p/pages/0050/page.grid.png`
- `.tmp/ld-s10y-lesson/8p/pages/0051/page.grid.png`
- `.tmp/ld-s10y-lesson/8p/pages/0052/page.grid.png`

Image use: 4 baseline, 4 total in this batch (limit 8); no reopens, crops,
new renders, or extra images. All paths above resolve in the stated checkout.
Cache paths describe observations, not durable lesson dependencies. Existing
page metadata retains PDF identity and original render hashes; the companion
bindings record the exact finalized files and observed grid hashes.

## Independent Print-Row Correspondence

Block references below are one-based `page.json` block positions. Counts were
read from the printed rows, including one separately identified footer per
page, then compared with the source block lines. A fraction's numerator and
denominator form one print row; no scanner spots or grid lines are text rows.

| Physical / printed | Rows by block, in reading order | Actual / source / audit | Figures / tables / exercises |
| --- | --- | --- | --- |
| 49 / 37 | 8, 1, 1, 1, 3, 3, 2, 3, 1, 1, 1 | 25 / 25 / 25 | 0 / 0 / 6 |
| 50 / 38 | 1, 2, 2, 3, 5, 2, 3, 1, 2, 3, 1, 1 | 26 / 26 / 26 | 0 / 0 / 0 |
| 51 / 39 | 2, 7, 2, 2, 2, 1, 3, 2, 3, 1 | 25 / 25 / 25 | 0 / 0 / 0 |
| 52 / 40 | 5, 3, 1, 2, 4, 4, 3, 1, 1, 1 | 25 / 25 / 25 | 0 / 0 / 0 |

Total: 101 print/source rows, 43 blocks, 4 footer rows. The n10 object
contains 73 non-footer rows including its heading; all six exercise objects
are preceding n9 content, not n10 exercises.

The native read-only comparison also found identical Markdown frontmatter /
JSON metadata and identical per-block Markdown / JSON line arrays on all four
pages. Each cached original `page.png` hash equals its finalized render hash.
Audits show no errors, normalizations, unknown characters, or KaTeX warnings.
These checks corroborate, but do not replace, the image comparison.

## Page Findings

### 49 / 37: PASS

Block 1 faithfully retains the preceding n9 calculation continuation:
`100/4 米/分 =25 米/分 =1.5 千米/小时`,
`v_2^2=v_1^2+v^2`,
`v_2=\sqrt{v_1^2+v^2}`,
`v_2=\sqrt{(1.5)^2+2^2} 千米/小时`,
and `=2.5 千米/小时`, with the printed punctuation and separate rows.
The reference "从图中可以看出：" is a backward prose reference, not a
missing figure on this page.

Block 2 is "练习 6"; blocks 3..8 are its six complete printed statements.
Checked wording and question punctuation, without solving any exercise:

- Block 3, exercise 1: "运动的相对性是什么？"
- Block 4, exercise 2: "在游泳的例子中，水和岸相对于游泳者是怎样运动的？"
- Block 5, exercise 3: aircraft `900 千米/小时`, wind `50 千米/小时`;
  the tail/head `千米/小` + `时.` is faithfully preserved.
- Block 6, exercise 4: perpendicular roads, `54 千米/小时` and
  `72 千米/小时`, `10 分钟`, and the requested separation after meeting.
- Block 7, exercise 5: both help/obstruction questions and "沿着最短路"
  + "程游泳过河时" are preserved.
- Block 8, exercise 6: 莫斯科, north from compass, `8 千米` altitude,
  `v=720 千米/小时`, west wind, **`10 米/分`**, `2 小时`, and coordinates
  relative to 航空站. The actual print breaks `米/` + `分.`, not `米/秒`.

Block 9 exactly carries the n10 heading words
"10. 长度和时间的测量单位  单位制的概念". The two-part title's visual
spacing is not a new heading or a missing punctuation mark. Block 10 begins
"根据迄今所谈到的运动，很明显，当研究运动时，至少必" and is `p open`.
Block 11 is the printed 37 footer, not prose.

### 50 / 38: PASS

Block 1, `p cont`, begins "须确定两个量：位移和时间.", correctly completing
49's "至少必" as "至少必须". All subsequent sentences and print breaks match.
The definition "测量一个量" and the metre-prototype definition are retained
with emphasis, not mistaken for figures or extra rows.

Blocks 4..7 retain the corridor/step example; human foot length, elbow to
middle fingertip, a day's walking distance; A. C. 格里鲍叶多夫,
"智能带来的悲伤", the two quotation rows, 法穆索夫, and artillery range.
Blocks 8..10 retain "目前，所有的国家", 米（m）, 铂和铱, 米原器,
the two engraved transverse lines, France's 国际度量衡局 and copies.
These are faithfully captured historical statements, not rewritten modern
definitions. Block 11 ends "除了长度的基本单位——米以外，还广泛地利用了比米"
and is correctly `p open`; block 12 is footer 38.

### 51 / 39: PASS

Block 1 is `p cont`, completing the preceding "比米" with
"大或小 10，100，1000 等倍的其他单位（千米，厘米，毫米，" + "微米）."
Block 2 preserves the repeating-process explanation, Earth/Sun wording,
**`1 年=31556925.9747 秒`**, and the explicitly rough
**`1 年=π·10^7 秒`**, including exponent 7, multiplication dot and parentheses.
No modern time-standard substitution is made.

Block 3 retains `1 分=60 秒` and `1 小时=3600 秒`.
Blocks 5..6 retain the connected introduction and `v=\frac{s}{t}.`;
their `open` / `cont` pairing closes on this page.
Blocks 7..8 retain `1 秒`, `1 米`, `1 个单位（1 米/秒）`,
and the explicit "匀速直线运动" definition. Block 9 retains 立方米 and both
measurement-unit questions. This is prose, not a numbered exercise object.
The paragraph ends completely; block 10 is footer 39.

### 52 / 40: PASS

Blocks 1..7 faithfully capture every printed sentence about quantities,
数学公式, 基本量, 导出量, 单位制, 国际单位制, and 厘米·克·秒单位制.
The unit name contains the printed two middle dots and "克", not another
unit name. The parenthetical reference to the book's 扉页 is retained;
it is not a figure on page 52. The final velocity sentence ends
"于国际单位制. 在厘米·克·秒单位制中，速度的单位是 1 厘" + "米/秒."

Block 8 is the actual next heading **"第一章提要"**, not part of n10.
Block 9 faithfully retains its sole printed opening row
"物体（质点）机械运动的现象，是物体相对于其他物体的".
It remains `p open`; neither completion of the summary nor review of page 53
is claimed. Block 10 is footer 40.

## Object Boundary and Errata

n10 starts at `p0049#9`, with its first prose at `p0049#10`. It includes
50's and 51's non-footer blocks and `p0052#1..7`, and ends after "米/秒."
before `p0052#8` ("第一章提要"). Existing continuation markers correctly
join 49 -> 50 and 50 -> 51; no false cross-page continuation joins 51 -> 52.
Page49's preceding n9 exercise statements do not enter n10.

No actual source mathematical/wording error requiring a new errata finding
was established in this review. Historical standards, claims, translation
choices and old units are not silently corrected or treated as current-science
approval. No unreadable glyph, missing row, missing figure or unresolved
source boundary remains within these four pages.

Scanner-margin spots on the left of 49/51 and right of 50/52, isolated specks,
the artificial grid, and page-number ornaments are not body content.
There are no running headers to insert into the lesson.

## Retention and Limits

Companion binding: `first-source-bindings.json` in this directory. It binds
the full finalized files for 49..52, the author declaration, actual initial
receipt/stream evidence, rules read, and observed image hashes. No duplicate
PDF, runtime, candidate package or source snapshot was necessary for this PASS.

Writes are confined to this n10 raw `source-review/` directory. No source,
shared tools, Git, DB, environment, install/update, model, publish, application,
schema, branch/worktree, chat, timer or inter-chat message actions were taken.
No exercises were solved and no answer/choice keys were inspected.

This PASS grants no assembly, modern-edition, answer, choice, figure-generation
or display approval. It does not resolve unrelated p44/p47 technical repair
or n8 paid-figure HOLD. Changed source bytes require affected-only followup by
the same independent reviewer, preserving this original verdict and binding.
