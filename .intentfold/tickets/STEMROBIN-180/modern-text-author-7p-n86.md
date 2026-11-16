# phy7-c1-s1-n86 modern TEXT author freeze

## Scope And Status

作者 Feynman，只负责 `7p / phy7-c1-s1-n86`《对流》的完整现代 TEXT 候选，不是独立审核者。

- 原课完整 **18 prose entries = 8 p + 5 fig + 5 cap**，**7 original tasks**，正文图214–218。全部保留，没有新题。
- 单次全课 TEXT mechanics 首次 **FAIL / exit1**，唯一失败为题1、2、3、6、7的上层 `lines` 未同步改写后的 `text`。其余 source/identity/text/math/numeric/emphasis/flow/figure-reference facts 未报错。
- 唯一修复只同步上述5个 `lines` 数组，受影响检查一次 **PASS / exit0**；原完整 lesson 与 figures 字节、所有题文和其余 exercise 字段保持不变。复用其余首轮通过事实，**没有第二次全课 mechanics、normalization 或 proseFlow**。
- 完整原首FAIL与模板、工具/执行、流输出已字节保存。作者 mechanical-inclusive repair **1/1已用尽，remaining0**。不再自动增修。
- 实际 proseFlow **17 paragraphs**，概念边界 **`[4,6,10,11,15]`**；从实际 CLI 输出复制完整相邻段落 `{before,after}`，由首轮 canonical API 解析成功，不按 prose 块或空行手算。
- 候选冻结后等待 **FIRST independent full TEXT review**，不是作者自签 semantic PASS。五个现代图仍 **pending**，没有现代图制作、渲染、验证或批准。

## Source-First Input Freeze

隔离作者根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n86`

Canonical raw 根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c1-s1-n86`

完整读 raw `lesson.json`、`lesson.md`、`exercises.json`，批准页226–229的 MD/JSON/audit、当前 book identity 和 TOC 的§86绑定。页229中问题1–7属于§86；下一标题只作为课程边界，不改写其他课。页事实是已批准来源的语境，不是重复 source FIRST 审核。

完整原始图214–218各自实际打开后，official `adapt-prepare` 一次写入本隔离根；`source-context.json` 随即保存完整 raw lesson/exercises/MD，在任何上层现代文本改写前完成。`raw-01/`、`source-01/`保留原始字节副本，`prepared-01/`保留完整官方三模板。没有更改 raw 或 canonical。

| 输入 / 证据 | SHA-256 |
| --- | --- |
| Raw `lesson.json` | `1236562ace84bff4cac8f77178c610ee696f644ac01d31e1331ee5cd1c30512b` |
| Raw `lesson.md` | `58e93c8bd9f47900f844306fa83597b557709cbba20c3fe9d53e746e7c89bb82` |
| Raw `exercises.json` | `be54c2e27e24c433b8395eca7ff4bf8cab813ba7d2a7a1e513c0d6bbf6ce87f0` |
| Complete `input-binding.json` | `e84504cc438a11b8293184bf74682a9fa16f786ecdcce0df6ca6d63595413a07` |
| Source-first `source-context.json` | `bfee1a5050ec7a16aa57e41a205d84b69e805d0010e7bb76aab82cb34001eec4` |
| `prepare-execution.json` | `cb4ca90d40778f4cbc76e08dc761626122b89f4fb8fc3391b623601367d4a211` |

`input-binding.json`逐文件记录原 raw、批准页、五幅原PNG/SVG、book/TOC及副本/模板的绝对路径、字节和SHA。执行记录保留各次实际 tool epoch before/after；历史 book/tool 输入不被宣称为以后共享工作区的 current 文件相等。

## Every Upper Prose Entry

零基索引指上层完整现代文本，不以不可变 nested `source.data`替代。

| Entry | Source refs | 全部内容与范围 |
| --- | --- | --- |
| 0 | `p0226#6` | 通常下部加热液体/气体，火焰上方水壶、窗下近地板暖气片及“偶然吗”引问完整保留。“总是”限定为通常安排，不宣称所有装置必然如此。 |
| 1 | `p0226#7` | 炉子/发热灯上方热气流、原书手感现象、小纸风车转动、图214与引出对流保留。图本身是发热电灯泡，不改成酒精灯；演示由教师控制，不将原书伸手靠热源文字变成学生操作指令。 |
| 2–3 | `p0226#8,p0226#9` | 图214 body ownership、稳定id和caption `图 214`原样保留。 |
| 4 | `p0226#10` | 原粗体完整对流定义；空气从火焰或灯表面受热膨胀、密度较小、向上、阿基米德力与重力比较、后续冷空气补充并受热上升。可自由膨胀且压强近似相同、开始上升时浮力大于自重明确为解释条件，不把力不平衡宣称为所有稳态流动的必然。 |
| 5 | `p0226#11,p0227#1` | 原完整跨页烧瓶水演示保留：火焰加热、底部高锰酸钾结晶等带色物质示踪、受热水浮升和较冷水补充、闭合循环、整瓶水受热、热量随水流传递、图215。限定本演示受热膨胀情境；“均匀”指有助于较均匀受热，不是每一时刻各处温度完全相等。教师控制试剂/火焰/热玻璃，不补剂量或测量步骤。 |
| 6–7 | `p0227#2,p0227#3` | 图215 body ownership、稳定id和caption `图 215`不变。 |
| 8 | `p0227#4` | 房间空气受热产生对流、图216完整保留，明确存在温度差的情境。 |
| 9–10 | `p0227#5,p0227#6` | 图216 body ownership、稳定id和caption `图 216`不变。 |
| 11 | `p0227#7` | 自然/自由对流名称，与泵或搅拌器迫使受热不均的液体/气体流动而形成强迫对流的区别完整保留。 |
| 12 | `p0227#8,p0228#1,p0228#6` | 原跨页、跨两图的整段全部保留：回到下部加热问题；上部水沸腾、下部仍**冷**、底部小冰块可能未融化的括注；上热下冷不形成迅速交换的循环；水导热差及较长时间；上部加热空气与图218。图217/218引用各一次；短时局部演示不推广为水永远不能传热或所有水温/加热情境都无对流。不增加原书没有的压冰器具、温度数字或学生手持热试管任务。 |
| 13–14 | `p0228#2,p0228#3` | 图217、图218两个原始稳定id、body ownership与顺序保持。 |
| 15–16 | `p0228#4,p0228#5` | 两个caption `图 217`、`图 218`和原顺序保持，未交换归属。 |
| 17 | `p0228#7` | 普通固体粒子运动自由受限、结晶粒子受约束并在位置附近振动、加热时没有整体物质流、日常经验和末句**传导**保持。限定为本课保持固态且无整体流动的情境，不主张所有固体在所有时间尺度和状态下必然如此。 |

所有原始身份、start page/printed page、原 source refs、figure list、per-entry `source_text`和完整 nested `source.data`保持不可变。原数学签名、全部 literal numeric tokens（包括API regex可能忽略的CJK相邻图号）一致；无未登记公式或数值改写，`numeric_changes=[]`，无本课 errata。

原粗体三处保持：对流完整定义、`冷`、末句`传导`。`阿基米德`在 `p0226#10`的原文和现代文字均出现，在对应上层块 `historical_entities`声明其来源绑定的科学定律人物名称；不虚构人物、地点、年份或补生平。本课不需要 profile 文化虚构姓名替换。

## All Seven Original Prompts

全部属于 g1《问题》，原稳定number/source_number `1..7`、来源、顺序和题数不变；不增加答案、测量任务或新数值。

| 原题 | Source ref | 完整请求与改写 |
| --- | --- | --- |
| 1 | `p0229#2` | 叙述能说明热灯泡上方空气发生流动的实验；保持叙述请求，明确教师控制，不提前在题面指定纸风车或给出结果。 |
| 2 | `p0229#3` | 空气如何流动 **及为什么如此流动**两请求都保留；仅把“烧热了的灯泡”改为明显发热的灯泡并规范标点。 |
| 3 | `p0229#4` | 说明火焰上方烧瓶中的水怎样变热；教师控制演示，不删除火焰、烧瓶或加热解释请求，不补示踪结果答案。 |
| 4 | `p0229#5` | “什么是对流？”原题完整不变。 |
| 5 | `p0229#6` | 自然对流与强迫对流的区别原题完整不变。 |
| 6 | `p0229#7` | 通常从下方对液体与气体加热的原因请求完整保留，仅自然措辞改写。 |
| 7 | `p0229#8` | 固体为何不会发生对流的原因请求保留，限定本课讨论的普通固体；题面不先给出粒子或不流动理由。 |

## Five Actual Original PNG Observations

源PNG各实际单独打开一次，不以作者旧图报告或行数替代。

| 图 | 完整原像素观察 / SHA-256 |
| --- | --- |
| 214 | 发热电灯泡、灯丝、灯座/底部导线，上方纸风车和侧架；不是酒精灯。`74953d9d14c57489691e594c765489f1cf1c3a83b438ee53983952c3dcbfa86e` |
| 215 | 支架/夹具、装水圆底烧瓶、下方火焰/灯、中央上升与两侧回流箭头。`3d882b0d6bfafd383b79f0820b849a956ff00ef27b4665b4c82f2d088b6d5b52` |
| 216 | 房间边界、家具/陈设、右窗窗帘/暖气片和完整循环箭头：暖气片侧上升、上方向左、左侧下降、下方向右。`fdbbed6ba5be95ba1f23c8a0a08169e757567c6e0903fa3cf5abc1c7f7a2de7b` |
| 217 | 倾斜水试管、底部冰、手部、上部加热火焰/灯/支持物、水蒸汽；水蒸汽/水/冰标签和引线。`6e26b53f9fce516b52dbb36c10e5bb54ccbe57caa8ee5cfd6deed106f03aa4b2` |
| 218 | 上部加热的倾斜空气试管，封闭上端、下方灯/木支持、下端旁手部；无新增水或测温器。`d59707b3796181be3158be8375680ff6cc5aac74c17931c817815f807f082700` |

完整库存 `source-figure-inventory.json` SHA `8708c1b020bd13cdf0c70793cec255c6561c9e524d23a5216675174655de4129`。原SVG仅字节复制和来源绑定，没有新的 native 渲染/审核。官方 figures template 的预置 `changes=["modernized"]`不代表图已制作或通过；所有spec目标仍只是pending占位。

## First Failure, Sole Repair And Actual Calls

首轮 `text-only-mechanics.json` 保持原 **FAIL**，SHA `899fb1fea0b47f715673c860c757afdad14b11da3096224fe1f764bb12880c45`。具体5个leaf为 `exercises[0].lines`、`[1].lines`、`[2].lines`、`[5].lines`、`[6].lines`，旧数组仍是旧题文；不是 source、physics、source identity 或数值错误，也未把它归咎为稳定工具 defect。

原FAIL全文、3模板、原作者脚本、原执行tool epochs、input binding、layout与实际flow完整保存在 `failure-01-text-mechanics/`，manifest SHA `9da73d8495112ab69b38881074e3f89f3864b5f8485ba04951473260198a6195`。

唯一修复仅将5个 `lines`同步为各自原已写好的完整现代题文。受影响检查验证五处 parity，并把修前五数组恢复到修后对象后，与拒绝版完整 exercises 相等；完整 lesson 和 figures字节同时与拒绝版相等。这个 equality证明其他题文、source.data、身份、声明、数字和锚点没有被修复改动。首轮其他通过事实复用，**没有重跑完整 gate、normalizer、flow 或数学检查**。

`affected-lines-check.json` SHA `bef302575eaf18f36c96752cca792c7a8d2f1c852d5cb124d0fc9a8d7ea87e70`，一次PASS/exit0，errors[]，repairsUsed1/remaining0。`text-only-mechanics-repaired.json`是首轮通过事实加唯一受影响通过结果的清楚绑定记录，不是第二次全课mechanics运行；SHA `ecdf05af0efe65487e9b85a1dcfa33dcb0a625ebe00deceab517787ba4273e3b`。

共享 Python：
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`

各次实际命令是上述 Python `-B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n86/author-workflow.py <stage>`：

- `prepare`一次exit0，调用 official `p2c.py adapt-prepare --book 7p --edition modern-us-neutral --lesson phy7-c1-s1-n86 --root /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts --work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n86`。
- `normalize`一次exit0，canonical author formatting。
- `flow`一次exit0，actual `node prose_flow.mjs --json <lesson.template.json>`，随后从实际输出填锚点。
- `mechanics`完整一次exit1；实际调用 canonical source/identity/text/errata/layout/flow/reference与math collection APIs；0公式、0KaTeX subprocesses。失败按上面5个真实leaf保留。
- `affected-lines`一次exit0，只检查唯一五数组修复与unchanged equality；不重跑全课API。
- `freeze`一次metadata/byte freeze，完整作者context、ledger与immutable manifest/handoff，不是semantic复审。

实际模型/图片服务、浏览器、现代图render、prepare之外的official生产gate、retain/finalize/publish、assembly、DB、Git、依赖安装、canonical/index/charter修改均0。只本scratch与本工单报告有新增/修改。并发他人文件未撤销，未读private源解、答案或choice。其他课、未授权图210/211均未开始审核。

## Exact Active Freeze

三模板位于：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n86/adapt/7p/modern-us-neutral/lessons/phy7-c1-s1-n86`

| Active file | SHA-256 |
| --- | --- |
| `lesson.template.json` | `0d2c9835e0bdb7aa8b64b86c3d744732a2220c1407e2af1e6c581e82c2559a6c` |
| `exercises.template.json` | `6e5df5f34b9545efe29667778699b29fe3e2745a62bc9ae2f313efce473ac2c7` |
| `figures.template.json` (pending, prepared bytes unchanged) | `2e84a79047cb47fdc87965f52efc846dbd5e9cc678414bd32de8e01166828474` |
| Unchanged actual `prose-flow-final.json` | `b40fb8847e5f887c04e79b20929c5e47df7ec8c34aee1e1edbb613d948db8f4e` |

`author-context.json`保存全部18上层条目、7完整题文/lines、五图占位、声明/来源和anchors；`author-ledger.json`保存真实calls及修复1/1。`frozen-01/manifest.json`绑定完整source/prepared/active模板、第一次失败不可变字节和执行证据。`author-handoff.json`绑定该manifest、本报告、完整context、输入/source-first、active模板、首轮及受影响结果、freeze execution，等待另一agent首次全文独审。
