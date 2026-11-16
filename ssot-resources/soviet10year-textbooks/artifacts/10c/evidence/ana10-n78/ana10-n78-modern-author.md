# 10c n78 Modern Text Author Handoff

Date: 2026-11-16. Ticket: STEMROBIN-184. Lesson: `ana10-c6-s1-n78`.

本次为既有工单内母方委托的现代文字作者任务，不是新的直接逐题授权。仅编辑以下两模板及本报告；两模板保持 `status: draft`，等待父方唯一全文审查。

## Files And Hashes

工作树根：`/Users/yong/.codex/worktrees/a07e/lemmadeck`。下列 SHA-256 均来自实际文件原字节。

| 文件（相对工作树根） | 编辑前 SHA-256 | 当前 SHA-256 |
| --- | --- | --- |
| `.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s1-n78/lesson.template.json` | `03bf7579656db5522ca04ced0c968807edb33d5656911c70c025d0eb326e53f6` | `205e49b506dbc72c95f1acc1377a13e24f189f1602b17f444c7d554c4feb4998` |
| `.tmp/ld-s10y-lesson/adapt/10c/modern-us-neutral/lessons/ana10-c6-s1-n78/exercises.template.json` | `5eaddef56f247872cacc06494e2ab0cd53acee30ac673e9a4ffc74f397e9f42f` | `022f97dd9802ab130872d442e89c689336b027d7dc36b179e0ffbb1ab721d765` |

先前已依次完整读取 faithful `lesson.md`、`lesson.json`、`exercises.json`，之后才读取两个官方模板。忠实目录为 `ssot-resources/soviet10year-textbooks/artifacts/10c/lessons/ana10-c6-s1-n78/`，编辑前后哈希相同：

| 忠实文件 | 当前 SHA-256 |
| --- | --- |
| `lesson.md` | `26f09192053828fef864ef1993b2977805b39f7105ee547e3ffecef78bf87c50` |
| `lesson.json` | `3dd5de0eb546c97641d79b4a64be8c4a1deafd0e4314d1bd5765e28af9ba9b1a` |
| `exercises.json` | `e4d7c8ca038a00c78d46d605cea837b29b06f35e850a5bec59e3d0e38a03eb57` |

两模板的 `source.path`、`source.sha256`、完整 `source.data` 及各项 `source_text` 不改。身份、原题号、来源引用、图引用、分组、页码不改。未读或写 figure template/spec/manifest。

## Exact Changes

- 文化中性的中文原文逐句保留，公式外 ASCII 句点改为中文句号；证明、定理与例题标签和引出的完整公式自然分行。移除印刷对齐空格，使用现有 `normalize_prose_layout` 的完整公式与短段落布局，不拆公式链、不新增数学前提或结论。
- 仅原注释对象 `lesson.prose[7]` 的五处 `\sin_{\text{г}}` 改为 `\sin_{\text{ang}}`：等式（2）一处、记号说明一处、等式（3）一处、`f(x)` 定义两处。仍用 `\text` 的语言 literal，未改成 `\mathrm` 变量；同一来源对象内增加如下说明：

  > 这里的语言标签 ang 表示以带单位的角度值为自变量的同一个正弦函数，适用于弧度与度这两种角度单位。

- 注释的式号仍为（2）、（3），位于对应完整公式之后、中文句号之前；后文等式（2）引用保留。原文“当用弧度制度量角度时”照留，未根据公式含 `^\circ` 而修正原措辞。`\text{ 弧度}`、角度符号、两项转换因子、`f'(0)` 和 `\sin'(0)` 全部保持。
- 本次不宣称原扫描下标码点已恢复，也不制造 erratum。`errata` 仍为空。注释声明 `changes: ["layout", "language"]`，其余实际改动项只声明 `layout`；所有 `numeric_changes` 与 `historical_entities` 仍为空。
- 四道书写题仅将各完整公式末尾句点改为中文句号，同步 `text` 与 `lines` 并声明 `layout`。题号后的 ASCII dot、全部上标星号、公式、编号顺序及题量保持。

## Preserved Objects

全部 15 个来源对象保留原顺序，没有以排版段落取代来源对象：

| `prose` 索引 | 来源引用 | 保留内容 | 数学片段数 |
| --- | --- | --- | --- |
| 0 | `p0016#15` | 从第 75 小节假设 6 开始的引言 | 0 |
| 1 | `p0016#16` | 定理 1 与完整极限公式 | 1 |
| 2 | `p0016#17`, `p0017#1` | 完整夹逼证明，包括两侧区间、绝对值不等式、正号条件、余弦估计、epsilon/delta 与最终绝对值链 | 18 |
| 3 | `p0017#2` | 应用定理 1 计算极限的引言 | 0 |
| 4 | `p0017#3` | 例 1，完整嵌套分式与极限链 | 1 |
| 5 | `p0017#4` | 例 2，完整极限链 | 1 |
| 6 | `p0017#5` | 例 3，完整 `tg` 与乘积极限链 | 1 |
| 7 | `p0017#6`, `p0018#1` | 完整角度函数注释、式（2）（3）、替代函数和导数比较；仅上述获准语言标签与单位说明改变 | 10 |
| 8 | `p0018#2` | 定理 2，弦长／弧长极限及图 4 引用 | 0 |
| 9 | `p0018#3` | 正文图对象 `fig-04`，未删改 | 0 |
| 10 | `p0018#4` | 图 4 图题对象，未删改 | 0 |
| 11 | `p0018#5` | 完整弦弧证明；`r`、`AB`、`x`、`xr`、`l` 和分式原样保持 | 8 |
| 12 | `p0019#1` | 最后导函数段：由定理 1 证明正弦导数、继而证明基本三角函数导数 | 0 |
| 13 | `p0019#2` | “第一个重要极限”段 | 2 |
| 14 | `p0019#4` | “求极限：”正文对象 | 0 |

弦弧证明末链第一、第二项仍为 `l\to0`，第三项仍为 `x\to0`，没有把极限自变量统一或更正。

书写题保持四件，来源中的 43、44 各为一条完整题式，并无额外分题标号；保留其完整任务，不删减或另造小问：

| 原题 | 来源 | 完整任务 |
| --- | --- | --- |
| 42，星号保留 | `p0019#5` | `\lim_{x\to0}\frac{\sin8x}{2x}` |
| 43，星号保留 | `p0019#6` | `\lim_{x\to0}\frac{5x}{\sin4x}` |
| 44，星号保留 | `p0019#7` | `\lim_{x\to\pi}\frac{\sin(\pi-x)}{\pi-x}` |
| 45，星号保留 | `p0019#8` | `\lim_{x\to0}\frac{\cos\left(\frac{\pi}{2}-6x\right)}{5x}` |

## Actual Flow Anchors

先用现有 helper 获得完整公式／短段落布局，手工 `apply_patch`；再实际运行现有 `prose_flow.mjs`，从其相邻段落 `{before, after}` 输出复制五个概念切换对象。不是手算整数或根据来源块编号猜边界。

一次合同检查实际得到 22 个文字段落，锚点解析到以下位置。位置仅记录工具结果，模板存储的仍是完整文本锚点：

| 工具实际解析位置 | 概念切换 |
| --- | --- |
| 7 | 夹逼证明的“这就是说”及极限 1 → “根据定理 1，可以计算某些极限。” |
| 11 | 完整例 3 → 注释第一段 |
| 17 | 注释的简单导数公式及不方便说明 → 定理 2 |
| 19 | 完整弦弧证明 → 最后导函数说明段 |
| 21 | “第一个重要极限”段 → “求极限：” |

没有在同一个证明内部、例题之间或注释推导内部增加概念横线。正文仍为中文，`ang` 是语言标签；图内英文规范不变，本次不写图中文字或图稿。

## One Author Contract Check

结果：**作者合同检查 PASS**，不是独立全文或视觉 PASS，也不是现代 finalize PASS。

仅对这两个模板执行一次只读作者检查，调用既有 `edition.validate_source`、`validate_identity_fields`、`validate_text`、`validate_numbered_subpart_layout`、`normalize_prose_layout`、`prose_flow_contract` 及 `mathcheck` 的分隔符／KaTeX 解析检查；未调用整课 `validate_lesson`，避免读图包或权威页流。

实际结果：

- 两份 JSON 解析成功；schema、edition、draft 状态及嵌入快照与当前忠实文件哈希／内容相符。
- 十五对象、四题 42–45、来源文字、身份、页／块引用、图 4 列表与正文／图题对象保持。
- 逐项精确比较有序数学片段，而非只依赖会忽略语言 literal 的数学 signature：仅注释五处获准 replacement，其他片段完全相同。
- 去掉公式后比较原文与现代正文的字词序列，只忽略排版空白／标点，并从注释移除上述唯一新增句；其余原文字词保持。
- 共 **50 个数学片段**，其中正文 42、习题 8（含四个题号星标公式）；KaTeX 解析 **50/50**，错误 0、警告 0；分隔符／括号完整，数学区无中文标点。
- 各正文文本与既有规范化排版一致；四题 `lines == text.splitlines()`，无缺失或新增小问。
- 五个完整文本锚点实际解析有效，解析位置为 `[7, 11, 17, 19, 21]`。
- 首次检查即通过，无失败字段修复或第二轮检查。

## Limits And Stop

未读父方独立源审、答案或 choices。未改来源页、durable、book/index、figure/spec/manifest、工具或依赖；未 prepare、finalize、assemble、render、浏览器、model/API、DB、Git 或网络调用。KaTeX 仅做瞬时公式解析，无 HTML／预览产物。

本稿不替代父方唯一全文审查；未完成图 4、整体视觉、最终排版或发布验收。原下标诊断的源码点不确定性仍保持，本次语言标签路由不解除该来源限制。

两模板和本报告交接后停止本次文字作者任务，不开始后续任务。
