# STEMROBIN-180 源页 96 受影响修复独立复核

结论：**PASS，仅 `p0096#8` 第二行删逗号修复及指定 assembled 段落传播。**
主会话首次 `source-review-94-96.md` 的 FAIL 原样保留，本报告关闭其唯一发现。
94/95 及 96 其余单位沿用该报告的 PASS，不重新全页审查；
不审查或批准 97+、整个 §38、全书装订、现代图或发布。

日期：2026-11-15。审查者：Codex，本复核非源作者 Nash，也非首次报告及修复作者主会话。
仓库：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。
本次只新增本报告；原物料、失败备份、首次报告和他稿均只读。

## 原像素与最小修复

实际重新打开原 `S/page.png` 的 `[200,1780,670,225]` 定义三行局部。
该局部在内存直接裁取，没有新增 PNG，未以作者保存的 crop 替代原 page.png。
第二印刷行清楚是“表面上运动时所产生的与运动方”，时与所之间无逗号。
第一、三行完整，定义末的图 74 引用与句点仍在。
删除的是源像素没有的 U+FF0C，不是同形字、规范化或物理勘误。

失败备份与当前 `D/pages/0096/page.md:83`、
`page.json:153`（`blocks[7].lines[1]`）的实际差分为：

```diff
-表面上运动时，所产生的与运动方
+表面上运动时所产生的与运动方
```

分别对 MD 和 JSON 原始字节断言：失败文件仅替换一次
“运动时，所产生”为“运动时所产生”，结果逐字节等于当前文件；
各减少 3 个 UTF-8 字节。结构化 JSON 比较也仅该叶节点变化。
全部其它行、frontmatter/meta、notes、标记、caption、图 id 和精确图框未变。
没有将删这一逗号扩大为全局标点清理。

现有 blocks.py 解析前后 MD，派生图 id 后分别精确等于前后 JSON，
全部 11 块一致。audit 与失败备份逐字节相等，25/25，
errors、unknown_chars、normalizations、katex_warnings 均为空。
这些结构证据与实际原像素判断分别记录，不以 finalize PASS 代替源忠实性。

## 图 74 未变

原 page.png 和页级 fig-74.png 的 SHA-256 均匹配首次报告。
前后 MD/JSON/meta/audit 的精确框均为 `[915,1654,432,286]`；
PNG 仍为 456 × 310。
其全部 RGB 像素逐像素等于原页精确框加现有 layout.crop 的 12 px 白边，
持久全书图库 fig-74.png 与页级 PNG 逐字节相同。
`p0096#10 cap samerow` 未变；首次报告中完整人物、雪橇及摩擦箭头
的目视 PASS 沿用，本次不重新审整图、不批准 SVG 或现代重绘。

## 指定传播

只核 `D/lessons/phy6-c3-s24/lesson.{json,md}` 对应受影响段落。
JSON 为 `prose[1]`，kind=p、printed_page=85，
source_refs 精确为 `["p0096#8"]`。
全文逐字等于当前源块经 blocks.text_of 拼接：

```text
**当一个物体在另一个物体的表面上运动时所产生的与运动方向相反的力叫做摩擦力**（图 74）.
```

该全文在 lesson.md 第 7 行独立成段，恰出现一次；JSON text 位于第 37 行。
“运动时，所产生”不再残留，定义其余文字、粗体边界、图 74 引用与最终句点
均未变。现有 htmlfrag.inline 的只读片段检查也确认粗体闭合且无裸 `**`。
源块 open=false、cont=false、三印刷行未变，不新增跨页接续。

没有检查该 lesson 其它源段落或 97+ 的像素/题目；完整 lesson 文件哈希仅绑定
本次所检查段落的载体，不代表批准文件内未审内容。
主会话 assemble 汇总的页数/课数/题数/图数不作本次独审或全书通过依据。

## 快照绑定

以下路径相对于上述仓库：
`R` = `.intentfold/tickets/STEMROBIN-180/`；
`S` = `.tmp/ld-s10y-lesson/6p/pages/0096/`；
`F` = `S/failure-01-added-comma/`；
`D` = `ssot-resources/soviet10year-textbooks/artifacts/6p/`；
`L` = `D/lessons/phy6-c3-s24/`。

| 文件 | SHA-256 |
|---|---|
| `R/source-review-94-96.md`，保留首次 FAIL | `13f55349377a37c676bcb9bd6c367a5d0ca54ac444be038cc8799275cc543dc3` |
| `F/page.md` | `eef4924cbf125bb9032e135dfa8a558b03d9b67bd7dfe98d8e45ad91f51627ce` |
| `F/page.json` | `b7e2132d5b12afb6bb77a328d9646906e43304ccf4930030734eb10da108cc4e` |
| `F/audit.json` | `834dd0706b141c143351fb987ef40bdc9d194dc55b128cf4beda00c16fcff32f` |
| `D/pages/0096/page.md` | `fbfae10328e2ac8bfb1ae45555ea870fa8db4d7bc0491085f66e6776d03310ce` |
| `D/pages/0096/page.json` | `64ba28bb1ce48ab8deeffab145ba789a0a95b38fafb780b876a6257a09c29afe` |
| `D/pages/0096/audit.json` | `834dd0706b141c143351fb987ef40bdc9d194dc55b128cf4beda00c16fcff32f` |
| `S/page.png` | `ae027ece18698e585081a9cd5e097b1a841e2c5f67b54fdd2d03e6f8e51104f5` |
| `S/page.grid.png`，仅当前载体哈希，未重开 | `aa63690ee75f418cf41b1b644958904c2a48ee8ff1e80c666e78f990e43d6500` |
| `S/figures/fig-74.png` | `65255ee854934d5a8b7e9ed24c1e4475bd1090084581abb66fb737133181e972` |
| `D/figures/fig-74.png` | `65255ee854934d5a8b7e9ed24c1e4475bd1090084581abb66fb737133181e972` |
| `D/pages/0094/page.json`，只核既有哈希，不重审 | `8d35e4a8d2fd422e9d65976e6100522400346c376840944ae545a3d3fae4ae44` |
| `D/pages/0095/page.json`，只核既有哈希，不重审 | `07b956eabed5b41c138aaeb0c7be8cfe9b1708d0e38bc213f2276a406d73aa3a` |
| `L/lesson.json`，仅上述段落传播 | `9b5094f12d4d4b588ff7bd04d8089cd0885fae32812e67ace7358f0a5e5dfedd` |
| `L/lesson.md`，仅上述段落传播 | `20e0452e209f4cb167d8565ff457e85ebfa3928eaeab981d245131ec1e6e8402` |

失败源 MD/JSON/audit 哈希逐一匹配首次报告；94/95 JSON 也仅核哈希与其原 PASS
快照相同，不读取或重审其全页。既有 Python 使用 -B/禁字节码与 Pillow，
无依赖安装；写后再次核上述绑定及首次 FAIL 未变。
无源/现代/他稿修改、重裁、finalize/assemble、晋升、DB、Git 或应用操作。
