# phy6-c4-s10 Independent Text Review

日期：2026-11-15。结论：**PASS，仅冻结文本与文本归属合同**。
审查者：本会话 Codex，独立 TEXT reviewer，非 Sagan 文本作者。
未发现需要 REVISE 的知识、条件、数值、身份、题意、来源绑定或分段缺陷。
结论来自完整原文与每个现代上层正文块、题干的逐项比对，不来自作者检查数量。

## 范围与冻结绑定

工作区：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。

- `RAW` = `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c4-s10`。
- `AUTHOR` = `.tmp/ld-s10y-lesson/text-author-c4-s10`。
- `CANDIDATE` = `AUTHOR/adapt/6p/modern-us-neutral/lessons/phy6-c4-s10`。

完整阅读 `RAW/lesson.json`、`lesson.md`、`exercises.json`，以及
`CANDIDATE/lesson.template.json` 的全部上层 `prose`、
`exercises.template.json` 的全部上层 `exercises` 和嵌套来源快照。
同时阅读 `figures.template.json`、`author-handoff.json`、下表作者证据。
嵌套 `source.data` 只作来源，不替代上层现代文本。
按当前 `.claude/skills/ld-s10y-lesson/SKILL.md`、
`references/edition-text-contract.md` 和 `.intentfold/charter/engineering.md` 审查。

以下 SHA-256 均以 `shasum -a 256 <文件>` 实际读取当前文件字节取得；
候选 lesson/exercises 与用户冻结值、handoff 和作者机械证据一致。

| 文件 | SHA-256 |
| --- | --- |
| CANDIDATE/lesson.template.json | `e95a07bf87a15a40221320ed95cac25703eb19d375b9c2ebf3be16a33f3cb24d` |
| CANDIDATE/exercises.template.json | `0be321f8378b3fa1e0f6715d60a73c81d3384fc605e25be5049bb5b160141e35` |
| CANDIDATE/figures.template.json | `28f4b56f321c8b4a5625af49457786dcdd3dcd97970ddb1056e3f18dd43ef11a` |
| CANDIDATE/author-handoff.json | `2c8ffef4de89ad8f32842e80d31a5877da463f00ff81961c37c14437c325ef3f` |
| RAW/lesson.json | `619917c49345fe391f3eea68fcae42629db04153cdfc018dbbb9f4a1f1dc46b4` |
| RAW/lesson.md | `f91bfa85aaa47078176d7851e2c13cbd1927f83de55de0ef43ddaf52f61e1205` |
| RAW/exercises.json | `c76895cc4783a11a3172fdc63a48baaf9657a72fe25166f081f3141f1a173d2a` |
| AUTHOR/text-bindings.json | `c71d6c6a5ab62e0dd661338ba566868b966e094e0bf55f9fc3c2e78475bc4da3` |
| AUTHOR/text-mechanics.json | `75c6956485d03e63f4b595feb97bcc64a3b135ae3ed9b6884a0d240e3edd176e` |
| AUTHOR/layout-normalization.json | `70145c369901091c13af3dbae9bd07a0b4e4c3f26992c647567bbe7cbbd05af2` |
| AUTHOR/selected-cli-boundaries.json | `45ef292c4420685bfea195539398003f3a368693daa20822934696c44fd3573e` |
| AUTHOR/prose-flow-final.json | `8857f4ffbad41ca34d41c3ee8fb843a5af8c4cde798f91fb576a9ddac277b9b1` |
| AUTHOR/author.md | `12faa81b71ef270e8a76ca0836334de2308875d3e14a24b7d35305e05f7e899a` |
| AUTHOR/prepare-attempts.json | `6261f9d3c584e50a85a4e2a9a3e982f55e9b3f0c6ec456a1f277f87922b5ee8a` |
| AUTHOR/prepared-first/manifest.json | `0db0a51c1e628088d1ba80b6cb564a7dd0b664714847b7b49ad4ffe7cc4ca86a` |

批准仅绑定上述版本；之后的文本改动不自动继承本结论。

## 全部正文

课身份保持 `phy6-c4-s10` / `57. 地球大气层的形成`；
章名、起始物理页148/印刷页137、原图清单和题量身份不变。
七块仍为五个正文块、一个 fig、一个 cap，未用数量代替内容核对。
以下索引为零基 `lesson.template.json:prose`。

| 块与来源 | 实际语义核对 |
| --- | --- |
| `[0]` / `p0148#8` | 组成空气层的各种气体分子受地球吸引；对象和作用关系保留。 |
| `[1]` / `p0148#9` | 不停息无规则运动、不会全部落地、为何不会全部飞散、宇宙飞船/火箭比较、第二宇宙速度、平均速度远小于阈值、绝大多数分子保留，全部保留。 |
| `[2]` / `p0148#10+p0149#1` | 跨页同一完整结论保留：分子运动与重力共同保持地球附近空气层。原文绝对化的“只能”改为本课简化描述中的“绝大多数”，未删去机制。 |
| `[3]` / `p0149#2` | 高度增加时密度迅速减小；两个高度及两个比例逐一保留；几百/几千千米、逐渐过渡为真空、无明显界线、图142分布示意全部保留。 |
| `[4]` / `p0149#3+p0149#6` | 原被图题隔开的同一正文保持完整：有重力的静止气体模型、下部密度和压强较大、一般容器差别很小且许多情况可忽略、跨数千千米的大气不能同样忽略。 |
| `[5]` / `p0149#4` | `fig-142`、印刷标签“图 142”、原来源绑定保留，空 text 仍为图块。 |
| `[6]` / `p0149#5` | cap 文字“图 142”与原标签、来源绑定保留，没有改为另一图或练习图题。 |

科学限定逐句核对：

- `$11.2$千米/秒` 原值和单位不改；新增“靠近地表、只考虑地球引力的理想化速度比较”，避免把这个数说成任意高度、任意条件的统一逃逸阈值。保留 *第二宇宙速度* 的名称。
- 原有“平均速度远小于”与“绝大多数”均保留；明确这是简化解释，而非对每个分子都不能逃逸的断言。没有用平均速度声称速度分布不存在较快分子。
- `$5.4$`千米/`$\frac{1}{2}$`、`$11$`千米/`$\frac{1}{4}$` 的对应关系、相对地表密度和单位保持；只明确为教材近似例子，不包装成任意地点和条件下的精确测量。
- 上层渐变且无明确界线，没有新增大气突然终止高度；图142称为示意，未赋予未有的精密采样数据。
- 容器比较限定于本课重力/静止气体简化模型与一般容器；不把小差别扩展为任意尺度下严格等压，也不宣称任意温度分布的普遍定理。

全部五个数学区原式保持：`11.2`、`5.4`、`\frac{1}{2}`、`11`、`\frac{1}{4}`。
无数学修正式，`errata: []`，各块 `numeric_changes: []`。
改变的是措辞、标点、排版及明确的科学适用范围，不是数字、单位、数量关系或教学对象。
本课无须声明的历史人物身份；地球、大气、飞船/火箭及下列器具均未换为不同对象。

## 全部七题

以下索引为零基 `exercises.template.json:exercises`。
原 `number`、`source_number`、`group`、`group_id`、`pages`、图引用及唯一展示归属保留。
三个“问题”与“练习26”四题仍分栏目，不因重复印刷题号重新编号。

| 题与来源 | 保留的完整任务及条件 |
| --- | --- |
| `[0]` g1/1 / `p0149#8` | 解释受重力却不全部落到地面的原因；“全部”澄清原问法，并未给出原因。 |
| `[1]` g1/2 / `p0149#9` | 解释各方向不断运动而绝大多数仍留在地球附近的原因；不把原简化描述变为所有分子绝不逃逸。 |
| `[2]` g1/3 / `p0149#10` | 开放问密度随高度的变化；未增加计算数据或改问压强。 |
| `[3]` g2/g2-1，印刷1 / `p0150#2` | 图143移液管、提取液体试样、插入液体、手指堵上端开口、提起、打开后流出，顺序完整；“做这个实验”和“解释工作原理”两项均保留。 |
| `[4]` g2/g2-2，印刷2 / `p0150#9` | 图144胶头滴管、获得液滴、实际滴液实验和解释原理全部保留；未换成仅观察或仅术语问答。 |
| `[5]` g2/g2-3，印刷3 / `p0150#10` | 自来水笔灌墨水与所利用物理现象的开放问题保留；未替换器具或预填现象。 |
| `[6]` g2/4，印刷4 / `p0150#11` | 图145家禽自动喂水器、装水瓶倒置于槽、瓶口低于槽水面；稳定后停流原因、水位降低露出口后重新流出原因、何时再次停止，三个解释要求全部保留。 |

最后一题仅加“在装置稳定后”，区别摆放瞬间与题目讨论的稳定状态；
没有增加密封结构、额外尺寸、压强数值或答案推导。
所有题仍需原书规定的实验/解释或知识回答；未增造题、删题、拆并成伪任务，也未插入答案。
正文中原有教学解释不被误判为新增答案；本审查未读任何答案键、私有源解、选择题或他人解答。

## 来源与图归属

实际比对原文、上层 `source_text`、`source_refs/pages` 与嵌套来源快照，
未发现错误引用或将另一课内容投影进本课；两组跨页/跨图正文引用均保持。
作者 `text-bindings.json` 的每块/每题文本和来源记录与本次阅读的上层字段相符。

| 稳定图身份 | 文本合同内归属 |
| --- | --- |
| fig-142 / 图 142 | 正文 `[3]` 引用、`[5]` 图块及 `[6]` cap；分子分布示意，不是精密密度数据。 |
| fig-143 / 图 143 | 练习26印刷1，稳定题标识 `g2-1`；不混入正文展示。 |
| fig-144 / 图 144 | 练习26印刷2，稳定题标识 `g2-2`。 |
| fig-145 / 图 145 | 练习26印刷4，稳定题标识 `4`。 |

各题 `figure_refs` 与展示 `figures` 对应，原清单142--145无身份/所有权变更。
`figures.template.json` 的哈希与 prepared-first manifest 相同，是 prepare 占位合同，
不是已完成或已批准的现代图。作者记录的原 PNG/SVG 哈希也不构成像素保真批准。
本任务不打开或独审图像，不批准任何图件、FigureSpec 或渲染输出。

## 排版与机械证据

按授权复用作者 `text-mechanics.json`：
一次机械批次，作者记录 exit0、100 checks PASS、0 errors、五个 KaTeX 数学区通过。
它绑定当前候选哈希；本 reviewer 阅读结果与绑定，但没有重跑机械批次、门禁或最终收口。
工具哈希是该证据中的作者记录，本任务未重新运行对应工具。

阅读作者最终共享解析结果 `prose-flow-final.json`，九个实际文字段落按
`prose[0]`、`prose[1]`三个段、`prose[2]`、
`prose[3]`两个段、`prose[4]`两个段映射。
这不是用 prose 块数自行推算发布段落。

- 边界5：大气保持总结之后，密度随高度变化及教材比例例子之前。
- 边界7：上层渐变/无明确界线/图142示意之后，一般容器静止气体比较之前。

上层 `section_breaks` 两侧文本与 `selected-cli-boundaries.json`、
`prose-flow-final.json` 中相邻段落逐字一致，且两处确为内容转折，
未截断速度比较、密度例子或一道练习。未自行写入整型锚点或重跑 CLI。
排版规范化记录的中间 lesson 哈希不是最终哈希：其后加入分段锚点，
最终哈希由 handoff、mechanics 与本次实测共同绑定；不将这个阶段差异误报为漂移。
作者两次 prepare import 失败在候选生成前，记录保留；随后一次 prepare 成功。
这些准备失败不是文本语义拒绝，也没有被本报告抹去。

## 边界与交接

本次唯一新增文件为本报告，以 `apply_patch` 写入；未修改候选、作者证据、原始层、
持久 edition、工具、schema、app、依赖或 charter，未撤销其他代理改动。
未运行 finalize/assemble/render/测试，未访问 DB、Git、网络、浏览器或模型服务。

**TEXT PASS 不等于图件 PASS、整课 adapt-finalize PASS 或发布完成。**
后续图件仍须按完整冻结上下文独立核源像素及现代输出，本报告不代替该审查。
140/141 不重开、不重查。125/126 作者任务等待 main 给出明确冻结 sea-context，
本报告写完即停止，不提前备图或生成。
