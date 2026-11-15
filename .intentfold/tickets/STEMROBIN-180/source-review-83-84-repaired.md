# STEMROBIN-180 源页修复独立复核：83 / 84

结论：**PASS（仅 83/84 本地源页，三个受影响单位首修复核）**。
`p0083#7`、`p0084#2`、`p0084#3` 的首审缺陷均已消除，未发现其它源内容或结构改动。
首报告 `source-review-83-84.md` 的 FAIL 保留不改；其它已核对项目复用该报告的 PASS 证据。
**82→83 边界仍待 upstream 独审**，不把本地 PASS 称为装订、传播或发布通过。

日期：2026-11-15。审查者：Codex，独立复核，非作者。
仓库：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。
本次只新增本报告；不修源、不执行 finalize/vectorize/assemble、不晋升。

## 三个单位

| 单位 | 位置 | 精确变化与复核 |
|---|---|---|
| `p0083#7` 第一行 | `D/0083/page.md:85`、`page.json:150` | 行末 `.` 后仅新增一个 U+0020；当前末两码点为 U+002E、U+0020，MD/JSON 一致。内存拼接得到“同样的现象. 卫星本身以及……”，不再粘连。PASS。 |
| `p0084#2` 第一行 | `D/0084/page.md:41`、`page.json:57` | 行末 `.` 后仅新增一个 U+0020；没有重复空格或改成其它空白。内存拼接得到“自由地“滑翔”. 装在容器中的……”。PASS。 |
| `p0084#3` 第一行 | `D/0084/page.md:50`、`page.json:75` | “讲过”后 U+FF1A `：` 改为 U+FF0C `，`；姓名、其它标点及全部后文不变。源逗号匹配。PASS。 |

`D` 指 `ssot-resources/soviet10year-textbooks/artifacts/6p/pages/`。
两处空格按技能 cap1 的显式行尾分隔符契约检查，不把像素误称为 Unicode 空格依据。
使用现有 `blocks.text_of()` 仅在内存核对拼接结果，没有运行装订。

本次实际重开 `S/0084/page.png` 的 `[835,935,140,55]` 局部并在内存放大，
包含“讲过”及后续标点。下部逗号拖尾明确，右上细小孤立墨点不能构成冒号。
与首审已经核对的原 PDF 600 dpi 局部和当前 U+FF0C 一致。
没有重新输入整页或相邻页图片，也没有生成局部图片文件。
`S` 指 `.tmp/ld-s10y-lesson/6p/pages/`。

## 前后快照差分

首 FAIL 报告 SHA-256 保持为：
`24479b3ed70203af6a06b802e88370a5bcb6deb065999f8b084d673717591e18`。

没有依赖作者的“只改三处”声明。分别读取当前 MD/JSON，在内存中仅逆向撤去上述
三个变化，得到候选旧字节；四份候选全部精确匹配首 FAIL 报告保存的原文件哈希。
候选没有写回磁盘，不是回滚源文件。以哈希匹配的候选与当前字节作 unified diff：
83 MD/JSON 各一行变化，84 MD/JSON 各两行变化，除此之外没有差异。

| 文件 | 首 FAIL 哈希，内存逆向候选匹配 | 当前修复后哈希 |
|---|---|---|
| `D/0083/page.md` | `a83b5ac0d1a4ffc739170dd31fce9aef98739864290fa27fdc001cc772de180a` | `b23f82603f188553bc3c75adc8995328e60a165c454282242db4fb604d13eb1b` |
| `D/0083/page.json` | `b705fb2cf34c6733033f4acf449b58b54a820a695ef27daedefe5d12b1b22cab` | `37ce53c0568f872022cb0f2946148c822bb86c77263aa47e12827f0dfac24e0e` |
| `D/0084/page.md` | `fc938add429f826ffccad9f36e8524d18027207d9f53bb5c00a5c8f08c1b69f8` | `0d4569363457facb26dcb0ecfc19e1d60af04c05686c03b36c8124520662fa7a` |
| `D/0084/page.json` | `6ff81d6848c4f0ff72dd987c7ee99cd5dd53a12aaa669fc88e8814631e37bef1` | `ad8191417a3cd9f38091018e874d8affd15c6d9caab1a5b96fc4c9d262af5945` |

结构化复核还确认只变更 JSON 三个 `blocks[*].lines[0]` 字符串；
全部 meta、其余行、块数 10/9、open/cont/samerow、图号、图框及图归属完全不变。
当前 MD 解析结果与 JSON 全部一致，没有把空格只加在 MD 而遗失于 JSON。

## 未变证据与复用范围

| 文件 | 与首 FAIL 相同的 SHA-256 |
|---|---|
| `S/0083/page.png` | `6ba4e0817643db81bcc3db7b69d2b1f9bb8c83f214b8a5cdb8c536ec9ebe0e59` |
| `S/0083/page.grid.png` | `a16ca465e2daea47d106f1454b174b9ddf54034892f2e2c3d904ba3e80ff8b05` |
| `S/0083/figures/fig-61.png` | `6ca227cd72cb618462f96c751101e1c9cb32666b57677c7bf6bfa8a3bfdb0e9b` |
| `S/0083/figures/fig-62.png` | `376ba6a5ab8ea83aab35b611dc8649fb28ad14d7bf428d4688fec9073c3900ca` |
| `D/0083/audit.json` | `468e267609c6aa7de54c02039a0b20b5a5957d3db9f78823dc2aba29cae56ad6` |
| `S/0084/page.png` | `5856dee38d8de8b0f0c8faf17e7a14ea4453545920acc76a454c79afbc1a7b22` |
| `S/0084/page.grid.png` | `c8278017fa2d55340447bb287c1d4407f2eca939ed8ddb8557a66bffd2168fdc` |
| `D/0084/audit.json` | `5b0027206bd2369974f564996bfb0e8ba4dcf389c28bc45cbfb279462b113089` |

原 PDF 及 profile 当前哈希也分别保持：
`46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`、
`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`。
原 PDF 为 `ssot-resources/soviet10year-textbooks/sources/soviet10years/6-7p 苏联中学课本 物理 六-七年级.pdf`；
profile 为 `.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json`。

因此复用首审对图 61/62 全对象、最右/底部、精确裁图像素和不混入图题的核对，
以及其余逐字、原始重量/重力、人物身份、§33 单位、图 61 第三行同排 cap、
页内 open/cont 和 83→84 接续的 PASS；没有重做全页或两图目视审查。
本次也不审批 SVG：首报告未绑定其字节，不能把 PNG 字节不变扩展为 SVG 保真声明。

当前 audit 为 18/18、25/25，errors 均为空且字节未变；
现有 `blocks.printed_lines()` 复算块体仍为 18/25。
首审独立遮图行带 18/25 的证据沿用，本次不重跑全页行带。
作者 finalize 两次退出 0 为用户提供的执行事实；本次没有重跑或直接观察其进程，
不把该声明当作三处语义复核的替代。

## 82 上游边界

用户已告知 Nash 的 82 全部收口，Feynman 正独审 79-82。
截至本次查看工单目录，尚未见该范围的独立 source-review 报告。
本次没有重新读取或审查 79-82 的正文/图片，不替代 Feynman 的四页工作。
沿用首报告已核对的当前尾“然后将”与 83 首“拴弹簧的线烧断”的接续兼容性，
但 **82→83 完成确认仍待 upstream 报告**。
后续可以复用 Feynman 对 82 的哈希绑定通过证据；本报告本地 PASS 不授权整节传播。

只读检查使用现有 lesson Python，`-B`、`PYTHONDONTWRITEBYTECODE=1`，无依赖安装。
写后再核对本报告绑定的当前快照。最终写集仅
`.intentfold/tickets/STEMROBIN-180/source-review-83-84-repaired.md`。
首 FAIL 报告保留；无源、图、模型、DB、应用、依赖或 Git 修改，
无 finalize/vectorize/assemble/晋升/发布，未撤销任何他人改动。
