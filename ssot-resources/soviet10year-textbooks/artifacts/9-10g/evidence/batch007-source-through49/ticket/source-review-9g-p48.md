# 9-10g physical48 独立 SOURCE StageB

## 结论先行

- 当前源作者包 **REVISE：两处源层接续空格缺失**，具体为110第二排、112第二排，详见B1。不是正文/公式漏项，也不是加行建议。
- 110–116全部源任务、117真实open片段、星号/空心圆、译注与印刷页码41的内容完整性比较 **PASS**。本判断复用披露前冻结的实际48页像素，不据作者计数倒推。
- 首次官方 finalize 实际 **exit 1 / FAIL**，`lines_printed:26 / lines_md:25` 原样保留。冻结原观察是25真实横排；未诊断额外机器带的来源，不改工具/文字凑26，不增加exclusion或override。
- 本轮只完成48的StageB。**49作者MD/JSON/audit未读、未审、未批准**；author report/manifest中的49未尝试状态或准备文件哈希不构成49源包批准。

## 角色与严格读取顺序

- STEMROBIN-184 worker B，当前受委托的唯一非作者独立 SOURCE reviewer；源作者Peirce。此为已有工单下母方委托，不冒称新的逐题人类数学批准。
- 根目录 `/Users/yong/.codex/worktrees/a07e/lemmadeck`；本报告位于该根下 `.intentfold/tickets/STEMROBIN-184/tmp`（T）。
- 披露前完整StageA：`T/source-review-9g-p48-p49-source-first.md`，最终rawSHA `51b5b00b8166ef8ffe6aa5343d1c9e597f183998fc2b35de1e9f5fc58f9b3acf`。早期48前缀7804字节的 `10af3d2e...` 是当时的阶段哈希，不误当两页最终冻结哈希。
- 本轮先读上述已有48事实，再读当前durable48 `page.md`、`page.json`；随后读 `audit.json`、首次 `finalize-run.json` 与 stdout/stderr；最后读已授权作者报告及37文件manifest。
- 全页原PNG未重新打开，未重新计行；没有新的局部像素观察。全部来源字形判断直接复用已冻结48原观察。
- 没有读取作者 `0048/source-first.md` 库存正文；其哈希仅出现在已授权报告/manifest。没有用作者自行PASS、notes计数或未披露49内容补证。
- 首次stream/当前包读取完成后，额外只做两条JSON/MD末尾字符的字节核对，以及当前48三件文件与first after-finalize快照的bytes equality；没有调用源计行器、validator或新的公式/题目求解。

## B1：源层接续空格，最小确切范围

当前lesson skill要求：印刷行末在半角句点后需有接续空格时，必须保留在行尾，因为对象跨行拼接直接首尾相接。

| 位置 | 当前实际字符串/后续行 | 具体缺失 |
| --- | --- | --- |
| `p0048#1`，110第二排；durable `page.md:42`；`page.json blocks[0].lines[1]` | 当前结束于 `求作角 $B_1$ 的平分线.`，下一排起于 `2) 三角形` | 句点后没有尾随ASCII空格，直接拼接会成为 `平分线.2)`。 |
| `p0048#3`，112第二排；durable `page.md:54`；`page.json blocks[2].lines[1]` | 当前为 `哪些性质不成立.`，下一排起于 `2) 矩形` | 忠实源句点本身正确，但句点后缺尾随ASCII空格；直接拼接会成为 `不成立.2)`。 |

只读字节核对实际输出，两处均为：

```text
lastCodePoint: 46
trailingASCIIspace: false
mdJSONexact: true
```

两处已经出现在 `0048/before-finalize/durable/page.md`，不是本次读取后产生的变化，也不是将机器26行归咎于缺空格。110第三排末尾为“直角”，不是句点；早期工作更新的临时定位“110第二、第三排”在精确核对后撤回，以本表的110/112各第二排为准。

最小修复建议仅是在上述两个既有印刷排的ASCII句点后各保留一个U+0020；不删除112源句点，不换为问号，不改任何字、公式、小问顺序、块数、换行或行数。这只是报告建议，本轮没有实施；是否授权修复和后续唯一changed-only核验由母方决定。

## 全部源对象逐项比较

| 块 | 冻结源事实与当前作者包比较 | 结论 |
| --- | --- | --- |
| `p0048#1`，110，5排 | `110^{*}`保留；两三角形标识均完整，第二小问 `A_1B_1C_1` 的C1未漏；第一比 `|A_1B_1|:|B_1C_1|=2:3`、角B1平分线，第二直角边 `A_1C_1/B_1C_1` 比3:4、内切圆心，全部条件及两项请求完整，排断“内/切圆心”一致。 | 内容PASS；B1第一处空格REVISE |
| `p0048#2`，111，3排 | 上标空心圆由 `\circ` 保存，不当角度值或自造难度定义；任意四边形、梯形→平行四边形、菱形→菱形三个问题完整，同排2)/3)未人为分成新印刷排。 | PASS |
| `p0048#3`，112，3排 | 上标空心圆保存；菱形哪些性质成立/不成立与矩形射影性质两小问完整；“哪些性质不成立.”真实源句点保留；无遗漏第二请求。 | 内容PASS；B1第二处空格REVISE |
| `p0048#4`，113，3排 | `ABCD`与`ABC_1D_1`准确，A/B没有新下标；过 `(AB)` 的平面α保留；两种平行条件及中位线长度问完整。原观察的斜双线关系采用LaTeX `\parallel`表达，未换成垂直/相交条件，未把两种情况并成同一假设。 | 内容/数学关系PASS |
| `p0048#5`，114，3排 | 等腰直角三角形直观图、正方形在原三角形平面内、边为直角边或斜边两种情况全在；原“平/面”“的/直角边”排断对应。 | PASS |
| `p0048#6`，115，3排 | 正六边形边心距、一个顶角平分线、通过中心向较短对角线作垂线三任务完整，“对/角线”跨排一致；未改成长对角线或删中心条件。 | PASS |
| `p0048#7`，116，2排 | 菱形一个角45°、直观图上作高，源条件与请求完整；角上标圈与题号空心圆角色未混淆。 | PASS |
| `p0048#8`，117，1排 | 等棱四面体ABCD，K是棱BD的；真实句末只到“的”。MD `ex 117 open`、JSON `open:true,cont:false`，没有提前补中点或后续请求。 | PASS，仅此页真实片段 |
| `p0048#9`，`foot note`，1排 | 原星号说明：题号右上角有星号表示较难习题，完整“——译注”保留；独立脚注不混进110题干或当另一习题。 | PASS |
| `p0048#10`，`foot`，1排 | decorated printed41由 `· 41 ·` 保存，`printed_page:41`、physical page48一致，装饰点不是新图。 | PASS |

当前MD/JSON对象身份、顺序、对应lines、open/cont/samerow标记一致。所有10块 `samerow:false`，与此前实际观察没有横跨块共享印刷行的事实一致；没有正文新标题、exhead、fig或cap块。

人工原观察25排来自披露前事实，不是本轮重新数图：110五排；111–115各三排；116两排；117一排；译注一排；folio一排。MD25排没有漏掉真实星号脚注或页码以解释机器26。无图库存为0，也没有可比较的48figure crops。

全/半角逗号、分号和问号的文本编码与像素的语义标点对应，不据其编码差异制造新数学错误；所有原ASCII句点仍保留。B1只针对当前合同明确要求的跨排接续空格，不增加第三处任意措辞修正。

## audit与first-result：真实失败保留

当前audit真实字段：

```json
{
  "page": 48,
  "lines_printed": 26,
  "lines_md": 25,
  "figures": [],
  "normalizations": [],
  "unknown_chars": [],
  "katex_warnings": [],
  "errata": 0,
  "count_exclusions": [],
  "errors": [
    "行数对不上：印刷 26 行，块体 25 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）"
  ]
}
```

已保留的首次命令：

```text
[".claude/skills/ld-s10y-lesson/.venv/bin/python",
 ".claude/skills/ld-s10y-lesson/tools/p2c.py",
 "finalize","--book","9-10g","--page","48"]
cwd: /Users/yong/.codex/worktrees/a07e/lemmadeck
exit: 1; signal: null; error: null
```

真实stdout：

```text
[finalize] 9-10g p0048: 10 块 / 25 行（印刷 26）, 插图 0 张, 规范化 0 处
  ✗ 失败 1 项:
    - 行数对不上：印刷 26 行，块体 25 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

stderr为零字节。上述是首次实际运行证据，不是本审者的新运行；本轮未重跑任何finalize/counter。

**未决项**：额外机器带对应哪一处源噪迹或分隔线尚未诊断；冻结源曾记录脚注分隔线和边缘墨迹，但不能据26/25直接把它们指定为计数根因或给mask。没有新的确定源字形UNKNOWN；题号空心圆的课程意义不自行定义。`unknown_chars:[]`只报告工具事实，不替代独立像素判断。

## 实际哈希与不可变绑定

durable48根：
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0048/`

| 当前/已授权输入 | 实际rawSHA256 |
| --- | --- |
| 当前 `page.md` | `6c081534bbf89b7a783ea6578d5f054628e3f5821f8ab76b6fb1acad4e31caec` |
| 当前 `page.json` | `efb49e350283a849031f19fde07cc4660df6bae0606850329adf75aab4209f9b` |
| 当前 `audit.json` | `7f901b47f5159e97d2618728007cb2f9af6512e982aa77f60cd698f24dce9197` |
| 披露作者报告 `T/source-9g-p48-p49-author.md` | `5092b70148fc0713313f7c41497a4f7fa178eb24a275578955ab559cf9f3173a` |
| 37文件manifest `T/source-9g-p48-p49-evidence/hashes.json` | `c7b025dbc85f2bbe5e6bcab169ddf370e66b6d2ae34eae136d0d86291dc1bc95` |
| 首次 `0048/finalize-run.json` | `9f66558e112515269dad13611df762e816087b6b3ecc30db5f5d1022cff699ac` |
| 首次 `0048/finalize.stdout.txt` | `55c1f96634eb0ea660fa3279b1006cd19dab25f62527863a0829281214f8da01` |
| 首次 `0048/finalize.stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| 完整 `0048/before-finalize/durable/page.md` | `c600d84d35165ecab4e2ca2a13646fc5811c48f47e0661062f1e4645dbabffcf` |

上表manifest/streams/snapshot相对目录均在 `T/source-9g-p48-p49-evidence/`。本轮实际核哈希与已授权manifest/报告相符；当前48三件文件与 `0048/after-finalize/durable/` 三件的实际bytes equality均true，后三件哈希逐项与当前完全相同。不是仅采信作者“相等”宣称。

manifest中其他prepared/grid与49未尝试文件仅是名字/哈希记录，本轮没有打开那些grid、layout、template或49作者正文，也不宣称重新验证37文件全部内容。

此前StageA原48PNG哈希 `da3df874a53f44755c010140615c32d0981cc8cde74540269fa76c6bfb8cd76a` 与当前MD/JSON render.sha256及author manifest一致；本轮无需重开源图。

## 停止

只新增本报告，原StageA最终字节与作者所有初稿/FAIL/manifest均未覆盖。没有修空格、条件或count，没有新图/题解、工具写入、prepare/finalize/validator/Git/DB/browser/network。

StageB保持真实有限结论：48内容完整性PASS，B1格式REVISE，机器计行FAIL及根因未决；不是整页收口PASS。49等待单独作者包授权，本轮不涉及。报告冻结后停止，自身SHA256在文件外取得。
