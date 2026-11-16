# STEMROBIN-184 / 9-10g physical50-55 / 独立 StageB

结论：**REVISE（仅本包忠实转录/来源裁图范围）**。下列确定缺陷尚未修复；不是数学答案、现代图、装订、数据库或发布 PASS，也不重开旧 n13/49 gate。

## 输入次序与绑定

工作区 `/Users/yong/.codex/worktrees/a07e/lemmadeck`。fresh TEXT-only 续接：先完整读现行 image8/batch、context24 规则、lesson 规则及 `/Users/yong/.agents/skills/ips-chrome-background/SKILL.md`；再完整读两份既有 StageA 原源冻结；随后完整读两份 AUTHOR 报告及 manifests，才读取六页 durable MD/JSON、已存 audit/command/stdout 和裁图。没有创建新 StageA。

以下均为实际 raw SHA-256；报告目录为 `.intentfold/tickets/STEMROBIN-184/tmp/`：

| 冻结文件 | SHA-256 |
|---|---|
| source-9g-p50-p53-independent-source-first.md | `902d3b839e84068a2dafdeab64d141e46a7de78a6ea3129ca58354f5eca89e5e` |
| source-9g-p54-p55-independent-source-first.md | `4aff2b04b38374aeddffa9d49f0c0f9d0dbcc8ae4ef5d36ee6ccae40cf3e66b3` |
| source-9g-p50-p53-author.md | `4348338d43ba3be1ccfecc30321eba052ccdabe5acea83db8d23c2d8ca3cfae5` |
| source-9g-p50-p53-author-manifest.json | `10959956c44768e5ae31e77425ca44ae99e3324463a172f28ba1ef71107f070f` |
| source-9g-p54-p55-author.md | `8b92599b8b2c5b28c80643ffbabcd5427d7db5bbe34641fcba51f3fc6ab2347b` |
| source-9g-p54-p55-author-manifest.json | `50068df0c688749ed66da437f905f26375468d96692503fc574ee6f6a8cfeee3` |

六页当前 MD/JSON/audit、原 PNG 及四张实际裁图均与对应 `author-evidence/<page>/attempt-01/after/{durable,work}/` 原字节一致，摘要匹配完整 manifests。仅绑定实际审阅输入，不重跑任何验证器。

## 精确修复引用

以下均指当前 `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/` 文件；块引用从 1 开始，JSON 数组索引从 0 开始。这里只报告，未改页。

1. **133 附解续接**：`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0051/page.md:49`，`p0051#1`，`page.json blocks[0].open` 当前为 false。块头 `<!-- ex 133 cont -->` 必须为 `<!-- ex 133 cont open -->`：50 页题干 open，51 页续题干/解/分析，52 页仍续原印作法/研究。51 末有句点不意味着整个附解对象结束；52 的 `cont` 和最终闭合保持。
2. **127/129 原词和分隔**：`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0050/page.md:77` 与 `:85`，`p0050#7/#9`，将两处“相互位置”恢复为原印“相关位置”。同文件 `:76`，`p0050#7`，`$a\subset\alpha$；` 恢复为 `$a\subset\alpha$，`，源这里是逗号。不得动 `m∩a=A` 或 `β∩b=B(A≠B)`，不得补数学假设。StageA 字面与本轮针对原页的观察一致。
3. **133 分析标点**：`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0051/page.md:54`，`p0051#1`，将“交点. 其中”恢复为“交点，其中”。原页逗号可见；保留后续 `(N_1P_1)=(ABC)↵\cap(NPD)` 的交集顺序及真实断点，不解题或改式。
4. **150 原点名无分隔**：`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0053/page.md:83`，`p0053#11`，将首处 `$A_1$、$B_1$` 恢复为 `$A_1B_1$`。原页该处未印分隔符；同句射影处实际可见 `A、B`，保留 `$A$、$B$`。这是本轮具体字形澄清，StageA 的后者有界读形不据数学习惯扩展成删两处分隔。
5. **未决来源字符的 notes**：`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0050/page.md:22` 的 notes 应显式保留图54纵线标记 `p/ρ UNKNOWN` 及125点横符号的精确宏身份未由像素决定；`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0055/page.md:22` 的 notes 应保留图57方向字形 `l/ℓ UNKNOWN` 和标题点号编码未决。本报告不把它们猜定，也不据此重画或修改源 PNG。

## 六页完整文字/结构覆盖

逐项对照两份先冻原源的全部横排、公式、条件/下标、题号/星圈、小问、图引用、notes、页脚及 open/cont/samerow；不是只抽读发现问题的题。范围结论如下：

| physical / printed | 全页覆盖与边界 | 有限结论 |
|---|---|---|
| 50 / 43 | 123续4)/5)闭合；124-133全部25题文横排+页脚；126引用54，125不凭邻近认领54；图题54与126末排 samerow；133 open。125大写C本轮原页已辨，128不增“内”，131关系及132条件均保留。 | REVISE：上述原词/逗号、UNKNOWN notes；其余确定源流相符。 |
| 51 / 44 | 133续题干与全部解/分析7横排，图55а/б引用、跨行交集式、独立图题/页脚俱在；附解必须续52。 | REVISE：缺open及“交点，其中”；三子图裁图覆盖合格。 |
| 52 / 45 | 133全部作法1)-5)/研究11排，134-140全部14题文排及页脚；分析/作法的交集顺序分别保存，[EF]/[FE]不统一，三角形符号及134跨行M条件、139二元集合/交集式俱在；140在2)后open。 | 有限PASS：对既有原源冻结的全页字面/结构比较；本轮未重开本页像素。 |
| 53 / 46 | 140第2项cont且不重复2)；141-150全部24题文排及页脚；142的8/12/25cm和竖线/断点、145面名顺序、148五小问、149六对象俱在。146字面“和平行面[BCD]”及N∈[DM]不改。150文字闭合、图56а在54取得。 | REVISE：150首处新增分隔；其余确定源流相符。 |
| 54 / 47 | 图56两子图、独立图题，151三排/152两排/页脚；150无续文字故无空ex cont；150用56а、151用56б，共用一图。152线段括号条件保持。无章标题/新练习栏。 | 有限PASS：冻结文字+实裁图；151细小列表分隔的原码点仍UNKNOWN，未用作者分隔替代独立确认。 |
| 55 / 48 | 实际第二章/h1和§14/h3；全部18正文排、例子/定义、原“射影/象”、Φ/F/Φ₁及下标、例子“不平/行”断行、页脚；图57正文归属及图题与“同时…”samerow正确。末p open严格止于“四”。 | 有限PASS于确定正文/边界/裁图；标题 StageA 用“. 向量”、durable `:52`为“·向量”，原页仅确认低位点形及间隔，精确编码仍UNKNOWN，不强授该字符PASS。n14不完整。 |

无新exhead、无新增脚注；各页既有页边/白区噪迹 UNKNOWN 不并入正文。全部 notes 已读，六页 errata/count_exclusions 均为空；不以白名单 `unknown_chars=[]` 消除光学未决。125 C/c 已由本轮原页的大写字形澄清；图55三处G样标签在实际裁图可辨为G，未据下一页公式猜名。а形的拉丁/西里尔码点不可由像素区分，源profile的Cyrillic约束与像素观察分开记录。非平行读形、箭头宏长度及标题点号不作数学惯例修正；56页“四”后续内容未读，仍UNKNOWN。

## 完整原源与实际裁图覆盖

原 PNG 路径统一为 `.tmp/ld-s10y-lesson/9-10g/pages/<page>/page.png`；六页全页来源事实来自既有 StageA 冻结，不因本轮只针对四页加载像素而宣称六页新目视。

| 页 | 原 PNG SHA-256 | 本轮图片用途 |
|---|---|---|
| 0050 | `661d31731609533caac57acb92caf25725a23a76b4202cf83db710471754b397` | 第5张：125 C/点横符号、127/129原词/分隔的具体原页疑点。 |
| 0051 | `8c0b9576f4244c602ae4f856ff612e85c7d2f5fccb5fe2eef48a357b68afd5d6` | 第6张：“交点，其中”及图55分图标排布疑点。 |
| 0052 | `dacfd7ee49f099bc2f3db302225dc009b53927e7a608aa545574e9b9ed49324d` | 不加载；全页按先冻原源文字比较。无实际裁图。 |
| 0053 | `de36259ced7959164414109b3d7f92aa3189ec40af43f381ab51829e23f79e07` | 第7张：150点名分隔的具体原页疑点。无实际裁图。 |
| 0054 | `ce052ec65d5e0b98f9fd8155895a9952ccab637a0ad3ab28638653a00c3e99e4` | 不加载；全页冻结文字及本轮实裁图比较。 |
| 0055 | `ac58fef44c9d05ec4f8e2ac68a0d028816ef0c650d897df44e4b7351ddc56244` | 第8张：章标题点号/间隔的具体原页疑点。 |

在加载前由两个完整 manifests、六页 JSON figure块及实际目录导出唯一裁图清单；全部且仅四张，均 `detail: original` 各一次。路径统一为 `.tmp/ld-s10y-lesson/9-10g/pages/<page>/figures/<id>.png`：

| 加载序 / 页 / 图 / 实际框 | 裁图 SHA-256 | 对先冻原源的全图覆盖 |
|---|---|---|
| 1 / 0050 / fig-54 / [841,551,373,424] | `73f9540d57e421709a2c2c04e594ec8ed48ef8dfc3c08e2f537be96d7b0e51b9` | 双平面α/β、共线M/P/N、m/n、全部虚实延伸及纵线p样标俱在；p/ρ UNKNOWN；无图题烙入或确定缺笔。 |
| 2 / 0051 / fig-55 / [151,686,1065,1191] | `6f203be966b1afd76d7937ac2784d2663361e831eac293503d3163265375ce2e` | а/б/в三图和分图标完整；各A/B/C/D、M/N/P、α/阴影俱在；上两图E/F/G/H四边，а与в有K/N₁/P₁及外伸/虚线，б无这些新增点；в仅E/G/F三边且无H。不从交叉添点；图题55独立。 |
| 3 / 0054 / fig-56 / [158,264,1125,385] | `18b6d23fc5f1cdcb5d6b233929a956854fa501315873dab8c056b70459821c93` | 两平面轮廓及α、а/б标完整；а两投影段/四端点、б三投影段/六端点全部对应；没有原/像连接边或所求答案线。150图边界实际闭合至此，不能全图只认给151或重复两张56。 |
| 4 / 0055 / fig-57 / [735,1083,497,409] | `bd34fe188dae7839256bb265a7cbe43853fb867bf9fb53da26a2477cec97d0c1` | 原ABC、像A₁B₁C₁两组三边，三顶点投影段、M/M₁及方向延伸/虚线、独立l样方向线、α轮廓完整；l/ℓ UNKNOWN；没有数值/直角/答案增补，图题独立。 |

当前图片累计 **8/8**：4实际裁图+4具体疑点原页；每次加载均计入，包含重复出现的源图像素。没有重复打开已加载文件，没有额外裁图、grid、49/旧n13、56页或其他图像；未依靠等待/缩图清除上下文。

## 机械证据与停止

仅读取各已存 `author-evidence/<page>/attempt-01/command.json`、stdout 与匹配的 after audit。六页均首finalize一次、exit0、repair/retry0；实际结果依页序为 **26/26、9/9、26/26、26/26、7/7、21/21**，块数14/4/9/12/5/10，audit errors/normalizations/unknown_chars/katex_warnings/count_exclusions为空、errata0。这些只是已存机械结果，不是本轮运行或忠实PASS。

51的9行是7正文+图题+页脚；54的7行是5题文+图题+页脚。StageA 含分图标的11-12/8行与它们不是同一口径：实际裁图保留55的а/б/в及56的а/б，未在MD再重复计行。55上а/б同排界仍UNKNOWN，不为凑数强定；无需据这一区别改counter、排除或删除分图标。50/55主图题samerow、52/53的↵实断点均保持。

本轮唯一写入为本报告；未修改页、图像、计数、排除、工具、其他人的文件或冻结证据；未prepare/finalize/assemble/vectorize/render/求解/生成答案，未DB/Git/browser/网络操作，未运行附加检查。批次到此停止，仅返回本报告路径及外取raw SHA-256。
