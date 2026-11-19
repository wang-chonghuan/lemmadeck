# STEMROBIN-180 / Batch59 / n41 / Independent FULL MODERN TEXT REVIEWONLY

## FIRST Verdict

**FIRST HOLD / REVISE. STOP.**

2026-11-17. Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
对象：`phy8-c2-s2-n41`，滑动摩擦力；首次独立审查当前冻结的现代文本，不是修改后复审。
完整覆盖源课文 14 个装订块、现代版全部 11 个正文 `p` 块、两条显式公式及两次行内 `mu`、练习 24 全部五道完整书面题。
源词、数学、数值和题量保持，不等于科学正确或八岁自学可完成。
下列 F1-F5 是实质物理或条件不足问题，不是主观风格建议。

只新增本报告及 `/Users/yong/.codex/worktrees/0f12/lemmadeck/tmp/b59-sliding-friction-text-review/`。
没有修改源课文、候选模板、其他人的文件或 Charter；没有 Git、backend、DB、publish、freshness、setup、render、official validate、source gate、候选重审、流水线 retry 或 repair。
没有调用 IntentFold capability；本次是明确限定的 review-only，不执行开发、handoff 或关闭流程。
**实际图片载荷 0；原书像素重放 0；现代图生成、打开、解码、视觉审查均为 0。**

## Bound Inputs

先完成全部输入的字节绑定，随后才解释源课文与现代候选。绑定 32 个文件：27 份文本快照；四份源图 PNG/SVG 与源 PDF 仅作不解码的字节哈希。
快照根目录为 `/Users/yong/.codex/worktrees/0f12/lemmadeck/tmp/b59-sliding-friction-text-review/frozen/`，保留原相对路径。
审查的是这些 FIRST 字节，不自动转移到并行工作者后来修改的版本。

本报告引用的绝对路径简称：

- `R = /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/lessons/phy8-c2-s2-n41/`
- `P = /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/pages/`
- `M = /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction-complete/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n41/`
- `E = /Users/yong/.codex/worktrees/0f12/lemmadeck/tmp/b59-sliding-friction-text-review/`

| 文件 | FIRST 当前 SHA-256 |
|---|---|
| R/lesson.json | `acc0a3837f8e83d19105f04c0b1f2af638ef412414fe73306082dd2eadc6e4a5` |
| R/lesson.md | `b77415fea01073f5bf981445f6417923d4d12343fc3a7269f073b793b519f336` |
| R/exercises.json | `6b344ad5fe8784371f85081f42290c1e3f3620a9c60e98802a8c9db29170f0c0` |
| M/lesson.template.json | `ccbfc68022d616738022aa32f439a397ca06489c8d08b6a6bdbca8726a4fb990` |
| M/exercises.template.json | `867f96e00e2596cab8f50e798eeb564fda25a3099cdb4d5ba2408ca66597d199` |
| M/figures.template.json | `9278be9c33d1a12cb643e97302e92fdb618d638f724af703ebb231c8bd0a71d1` |
| P/0166/page.md | `cce81fe7d3234363b5467e90d51e14a147e4505f0936e84648923a691110a358` |
| P/0166/page.json | `997506b16c745ded233e02b8525a9ebb8e032f3795b5d5603a7edc1976d175c2` |
| P/0167/page.md | `08e9de2357bc5437b54f968622cf65481f1141d4d481507edbf0935cb60b9aa7` |
| P/0167/page.json | `d44a7fa74e120e79280e38c38ad06d54a9c04e0d39be2eea09d9c060389466c1` |
| P/0168/page.md | `55cc236a12d12996f1da9c9c2deb9afa6010ae14e2eaa4b54e0a96f794366713` |
| P/0168/page.json | `7e6c52bd939659f90705ccb4a2828c70892af54b18d7405841bf9ed6353e2c52` |
| P/0169/page.md | `faf89124abc18199b2a86fa14bf6aba7e513c4afc21a6489b46add413b772a9e` |
| P/0169/page.json | `75db980a00cac26899fe11efec41a27356609c068745eea25ac49022b72625d5` |
| E/bindings.FIRST.json | `893fd88c48b563f4462175116f04e993c5253751001e17eda2dda775edff63d5` |
| E/coverage-and-binding.FIRST.json | `b11ea120a851c8ecb3dedcf14ffe913b0b7e67b9cf3436f9f34cce5233e64a1c` |
| E/diagnostic-calculations.FIRST.json | `95d6ce782d8557191516412e82ff6bb5e9a11ae426a4bf66b6674fcf3d3415bb` |

`b59-friction-complete/artifacts/8p/lessons/phy8-c2-s2-n41/` 下三个原始课文/题目文件与 R 中对应文件逐字节同哈希。
两个现代模板的 `source.sha256` 均匹配 R 当前输入；完整 `source.data` 与解析后的原始 JSON 相同。
全部 14 个现代块的 `source_text/source_refs`、全部五题的 `source_text/pages` 与原始对象匹配。
全文比较只消除空白及句末 ASCII period 与中文句号的差别，并保留小数点：14/14 块、5/5 题均仅有该标点/布局差别。
所有数学片段、非公式数字、小数、单位原词、题号、分组与图引用未改；没有遗漏、重复或截短子任务。
五题的前缀均为 ASCII `1. ` 至 `5. `，每题 `lines.join("\n") === text`。
这些是只读文本绑定事实，不是官方 validate、physics PASS、生产段落计数或浏览器排版验收。

## Source Authority

源审记录的当前报告哈希：

| 已有记录 | SHA-256 / 权限边界 |
|---|---|
| source-review-8p166167-b59.md | `687da4dbf7291774bec234ce6671de4737a6cd52ad6a8eafb12177e7a52c86fa`；FIRST literal PASS |
| source-review-8p168169-b59.md | `57c4c909dabd7bcb5cfebfbe42c4763c1d1c8d1d9dff018b6eb9b0fdcd41ddb9`；原始 FIRST FAIL 保留 |
| source-review-8p168169-affected-b59.md | `b353df18875d6d9fe2ab292160bcd673768cbca31c32d7a1109edf239161d42e`；仅 F1-F5 受影响比较 PASS |

三个记录共同提供本次用户指定的已批准 literal source 前提；不得把 affected PASS 改写成原始 FIRST PASS。
源页当前 MD/JSON 及图的字节身份匹配这些记录涉及的当前版本。
源 PDF SHA-256：`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`，仅哈希，不打开。
依照已读 product Charter，以一名八岁、理解力强的孩子能独立完成为判断目的；允许既有课程概念，不凭空要求本节重教全部前置知识。
本次读了工程、操作约束及 lesson cap4/edition-text-contract；不自行登记 errata，不把源物理表述直接判作打印勘误，也不自行越过“不改源/数学”的边界。

## Essential Findings

### F1 / HOLD: 静摩擦和滑动摩擦系数被当成同一个参数

准确引用：M/lesson.template.json:27、:76；`/prose/0/text`、`/prose/3/text`；源 `p0166#8`、`p0167#3`。
[系数断言](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction-complete/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n41/lesson.template.json:76) 为“这里的比例系数 mu 和最大静摩擦力公式中的一样”。

滑动摩擦的经验模型是 `f_k = mu_k N`；静摩擦为 `0 <= f_s <= mu_s N`，最大值才是 `mu_s N`。
两种系数不是一般性的同一个参数。首段“近似等于最大静摩擦力”尚可作为特定简化，但不能把随后未加限定的“系数一样”批准为通则。
本候选未声明在哪个材料/条件范围把两者近似取同值；这会直接混淆起动、维持滑动及第 1、3、5 题的适用式。
**需要由内容责任方解决模型/系数区分，不能靠 source literal PASS 或公式字节相同放行。**

### F2 / HOLD: 10 N 从静止起动的断言在候选自己的模型下也不成立

准确引用：M/lesson.template.json:108；`/prose/5/text`；源 `p0167#5`。
[完整例句](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction-complete/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n41/lesson.template.json:108) 给定 `0.5`、`20 牛顿重`、`10 牛顿`，断言“就可以使它起动，并沿着桌面运动”。

按源图清单提供的水平桌面/水平推力前提，`N = 20 N`。
即使采纳 F1 中同值近似，最大静摩擦与滑动摩擦都算成 `0.5 * 20 = 10 N`。
从静止施加恰好 `10 N`，静摩擦仍可等大平衡，合力为零；达到阈值不保证起动。这还与首段“比最大静摩擦力大一点”矛盾。
如果 `0.5` 是滑动系数而非静系数，则连起动阈值都不能由它确定；例如审查反模型 `mu_s = 0.6` 时阈值为 `12 N`。
`10 N` 可在已滑动、且其他条件不变时平衡滑动阻力；不是保证从静止起动的证据。
这些是审查计算，不是添加新源数据或改数建议。

### F3 / HOLD: 摩擦方向被推成无条件的实际相对速度减小

准确引用：M/lesson.template.json:60；`/prose/2/text`；源 `p0167#2`。
[完整断言](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction-complete/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n41/lesson.template.json:60) 以“即滑动摩擦力总是使物体的相对速度减小”收尾。

摩擦力的加速度贡献反向于局部相对滑动，这部分正确；它不决定包括其他力及接触面运动在内的实际相对加速度。
固定地面上，持续同向推力大于摩擦力时物体可加速，正是第 4 题的第二任务。
更直接的只读反模型：接触面向右加速 `5 m/s^2`，向后相对滑动的物块受向右摩擦加速 `2 m/s^2`，相对加速度仍为 `-3 m/s^2`，向后相对速率反而增加。
候选没有固定接触面、无其他驱动力或“仅摩擦的贡献”等限定，不能把“总是减小”批准为实际运动结论。
**需要区分单个力的贡献与合力/实际相对运动；这不是要求换一种措辞风格。**

### F4 / HOLD: 第 4 题没有确定数值计算所需的接触材料/系数

准确引用：M/exercises.template.json:78、:80；`/exercises/3/text`、`/exercises/3/lines/0`；源 `p0168#11`。
[完整题目](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction-complete/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n41/exercises.template.json:78) 只给质量 `20 千克`、方木、地板、恒定速度，随后要求计算推力及更大作用力的运动。

“地板”未明确接触材料、是否涂油或采用哪项滑动系数；不是自动给出了“未涂油的木头和木头”。
按最可能的原书意图额外取木-木 `0.25`、水平推力、恒定法向力，可得到条件性推力 `20 * 0.25 * g`；取 `g = 9.8` 为 `49 N`。
仍符合木块在地板上运动的橡皮接触面，借同一源表 `0.75` 则为 `147 N`。这已经在同一 `g` 下不唯一。
按 `g = 10` 近似时上述条件性数值分别为 `50 N`、`150 N`；`g` 的课程既定约定不在本次范围内，不据此断言前置课缺失。
第二任务在固定同向水平推力、同一滑动系数/法向力下可判为加速；若力保持常量，则为匀加速。没有给力的数值，所以不要求算具体加速度。
**不能替八岁读者静默选地板材料，再把一个条件性数值当作本题唯一完成结果。**

### F5 / HOLD: 第 5 题的“最大重量”未绑定实际决定上限的运动条件

准确引用：M/exercises.template.json:99、:101；`/exercises/4/text`、`/exercises/4/lines/0`；源 `p0168#12 -> p0169#1`。
[完整跨页题](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction-complete/work/adapt/8p/modern-us-neutral/lessons/phy8-c2-s2-n41/exercises.template.json:99) 已完整保留 `600 牛顿`、`0.005`、空雪橇质量 `100 千克` 及装载的最大重量，没有漏尾句。

把它作为已滑动、水平雪面、水平牵引且只受给定滑动摩擦限制的持久牵引题，可作条件性计算：
总重量上限 `600 / 0.005 = 120000 N`，货物重量为 `120000 N - 100 kg * g`。
`g = 9.8` 时为 `119020 N`；若按 `g = 10` 为 `119000 N`。重量应使用 N，不能把这些数值直接写成 kg；质量仅可通过除以 `g` 换算。
但候选没有说明水平路面或牵引方向，也没有区分“维持已经滑动”与“从静止起动”。若要起动，静摩擦阈值不能由一个未区分的滑动系数推出。
例如保持给定三项数据、改为沿 `1 degree` 上坡持续牵引，条件性货物重量成为约 `25744.1 N`，不是水平情形的 `119020 N`。
这个审查反模型证明遗漏条件影响上限；不是建议加入坡度题。
**需要明确所求是何种模型下的持续载重上限；不判 `0.005` 为误印，不把算出的巨大质量当作改源系数的理由。**

## Full Block Coverage

以下 B 为装订 `prose` 的一基序号；JSON `/prose/` 使用零基索引。源 14 块均覆盖，其中 11 个 `p`、两图、一图题。
每行结论覆盖整个 `text`，包括长块的所有句子，而非只检查摘句。

| B / JSON index / M 行 | 完整源引用 / 类型 | 全文判断 |
|---|---|---|
| B1 / 0 / 27 | p0166#8 / p | 已读起动阈值、起动后仍有摩擦、近似大小、相对速度方向和重要性全部五句；阈值在初静止/只有相应驱动力模型下成立，系数近似不得升为通则：F1、F2。 |
| B2 / 1 / 43 | p0166#9 + p0167#1 / p | 加粗完整跨页方向陈述保留；对存在非零局部相对滑动的滑动摩擦正确，不推广成静摩擦方向规则。 |
| B3 / 2 / 60 | p0167#2 / p | 加速度贡献与实际相对速度结论均检查：F3。 |
| B4 / 3 / 76 | p0167#3 / p | 压力比例、显式公式及其后“同一系数”均检查；幅值公式可作干滑动近似，系数混用：F1。N 是法向接触力大小，不是任意压力，也不总等于重量。 |
| B5 / 4 / 92 | p0167#4 / p | 系数定义及分式完整；在滑动且 N > 0 时无量纲比值正确，不应用成任意静摩擦的固定比值。 |
| B6 / 5 / 108 | p0167#5 / p | “通常小于1”不是绝对上界，不因可能大于1而另列缺陷；0.5、20 N、10 N 及起动/沿桌面运动均检查：F2。 |
| B7 / 6 / 129 | p0167#6 / fig | fig-114 紧随 B6，身份不丢失；仅源库存与位置前提，不看图，不批准现代图。 |
| B8 / 7 / 143 | p0167#7 / cap | 图114 图题保留，跟随相应正文图；没有重复题图或解答图。 |
| B9 / 8 / 157 | p0167#8 + p0168#1 / p | 全部接触对、材料/加工/清洁、面积、位置、均匀冰面例子、一般力比较、速度大小及两段着重方向句均读；接触对语义正确。面积/位置/低速大小独立只按均匀表面、法向力不变的干摩擦经验近似接受，不把它们判成任意材料/位置/高速的精确通律；不另提主观重写。方向反转指相对滑动，不是绝对地速。跨页尾已闭合。 |
| B10 / 9 / 174 | p0168#2 / p | 表引导句完整；与 B9 接触对语义及后随表一致；表数字的科学通用性没有因此获批。 |
| B11 / 10 / 188 | p0168#3 / fig | tbl-p0168-01 归正文，不归任一道题；仅源库存/占位。 |
| B12 / 11 / 202 | p0168#4 / p | 未涂油前提、润滑可减摩、润滑钢-钢/钢-冰比较与0.04全部检查；0.04保留为原书例示条件数值，不批准为任意油膜/速度/材料状态通用测量值，不用其他教材数值替换。 |
| B13 / 12 / 218 | p0168#5 / p | 种类尚未讲完的过渡句完整，不产生额外任务或数据。 |
| B14 / 13 / 234 | p0168#6 / p | 接触固体间无润滑的干摩擦定义完整；包含静/滑动情形，不误当成只有滑动才有干摩擦。 |

没有按块数量推算最终生产 paragraph；未调用 proseFlow、渲染器、排版器或发布器。
数学、数值及布局完整性的通过不能覆盖 F1-F5。

## All Five Full Questions

每题全文及全部任务如下。这里仅记录完成性/歧义诊断，不制作学生答案键、标准解答、choice group、交互规格或评分数据。

**Q1 / p0168#8 / M:10 / `/exercises/0/text`**

> 1. 放在房间里的桌子，受不受静摩擦力的作用？

一项定性任务，无给定数值/单位/图。检查的是静摩擦是否存在，不是套 `mu N` 求数。
仅“静止”不必有静摩擦；无切向外力时可为零，有未超阈值的切向外力时可非零。
默认普通室内水平地面、无人推拉可完成；允许说明条件的回答也完整。不把所有隐藏外力都升为新缺陷，不额外 HOLD Q1；但 F1 的固定系数混用不可用于替代此判断。

**Q2 / p0168#9 / M:31 / `/exercises/1/text`**

> 2. 根据牛顿第二定律，受到力作用的物体应得到加速度。小孩用他最大的劲推书柜，但没能使它移动。这破坏没破坏牛顿第二定律？

检查了开头定律描述、孩子最大推力、未移动及是否违背定律的完整提问，无需数值。
正确完成路径是识别第二定律中的合力，并核对书柜所受推力/静摩擦平衡，不能拿孩子与书柜之间的第三定律力对在书柜上相消。
首句作为待辨析的粗略说法可在该题中被纠正，不单独判成题目无法解；不是把错误说法批准成定律。**定性可完成。**

**Q3 / p0168#10 / M:57 / `/exercises/2/text`**

> 3. 为了使放在水平面上的物体在这个水平面上移动，应当对它作用多大的力？

一项定性阈值任务，给水平面、初放置物体；无质量/系数数据，因此不要求某个 N 数值。
按从静止开始沿面滑动理解，需要相关平行作用力超过最大静摩擦；只有临界值而不是等于临界值必动。已滑动时维持匀速是另一问题。
此解释与“放在”及首段起动语境相符，可独立作条件性定性回答；不把未给数值误判为计算题缺数据。**任务可完成，但课文 F1/F2 会给错阈值规则。**

**Q4 / p0168#11 / M:78 / `/exercises/3/text`**

> 4. 质量为 20 千克的方木，沿着地板以恒定的速度运动。试计算需要用多大的力推它。如果对方木的作用力大于计算的数值，则方木将如何运动？

两项任务均覆盖：恒速推力数值；更大作用力的运动判断。20 是质量 kg，不是20 N；恒定速度不是起动状态；第二任务没有给具体更大力数值，不擅自添加。
F4 使第一项不能唯一确定。第二项在固定同向水平力、法向力及系数下有可完成的加速判断；不能服从 B3 的无条件减速说法。
**整题 HOLD，原因是确定计算条件不足及所依赖的错误模型，不是漏题或排版。**

**Q5 / p0168#12 + p0169#1 / M:99 / `/exercises/4/text`**

> 5. 马在持久工作时可施力 600 牛顿。如果雪橇的滑铁和雪之间的摩擦系数等于 0.005，那么马拉质量为 100 千克的雪橇，雪橇里能装载的最大重量是多少？

检查了持久工作而非峰值推力、600 N、滑铁/雪这对接触物、0.005、空雪橇100 kg、最大货物而非雪橇加货物总量，以及跨页完整问句。
F5 记录全部条件性计算与反模型；系数极小使理想模型容量很大并非数学错误，不能据直觉改成另一系数。
**整题 HOLD：需要指定持续滑动/起动、路径和牵引的模型条件；不是截断或缺原数字。**

五题 `number/source_number = 1..5`、`group = 练习 24`、`group_id = g1` 均保持；没有实际另列的 a/b 子题。
Q4 两个完整任务都已覆盖，Q5 三行跨页源题全部覆盖。
五题 `figure_refs/figures` 均空：表只可作为正文给定的数据前提，不能暗中新增题图或从现代图补齐材料/条件。

## Mathematics And Hash Coverage

完整显式公式，按源顺序原样保留：

```latex
|\vec{F}_{\text{摩}}|=\mu|\vec{N}|
\mu=\frac{|\vec{F}_{\text{摩}}|}{|\vec{N}|}
```

两个式子都是幅值关系，矢量箭头、模长竖线、中文下标及分子分母正确；不是把摩擦矢量与法向矢量设成同方向。
mu 无量纲；第一个式子的适用系数须是滑动模型的 mu，第二个需 N > 0。
两处公式外行内 `$\mu$` 也已逐个覆盖；五题无 `$...$` 数学片段。
没有除零、错号、漏项或单位换算的未登记公式变更；F1/F2 是物理适用语义问题，不能由 KaTeX 或字节比较证明通过。

源数学 SHA-256 = 当前数学 SHA-256：
`6a1a3c070e6802b4539672b2b343037e1b00dc794783bf70df826d542125800e`。
算法：对全部14块按序构成 `{index0, refs, math:[逐个 dollar-delimited LaTeX 内串]}` 数组，SHA-256 作用于 UTF-8 `JSON.stringify(array)`，无尾换行。
原文/当前的每块全文 SHA 与完整源行、当前全文、数学/数字数组均保存在 E/coverage-and-binding.FIRST.json；报告内当前全文 SHA 如下。

| 块 / 题 | 当前 `text` UTF-8 SHA-256 |
|---|---|
| B1 | `6fd5bf94c1eac3a6bcdb352b83245bb61251ba9539c4e3c46a5c5b65b35ba84c` |
| B2 | `189ca5bdbfabf34a82e5bf82a1d7984b3bc62814819b0d90119948b1581d3e5c` |
| B3 | `9eda9709216c85a208a90e145b8f065e13fb40fd9a407e448413b4c13ca11023` |
| B4 | `2e320363613f10f3043e4cf90d5f450178f30f669ca1827860f26e62173e11f4` |
| B5 | `192044e6c339ce2351d889ef115580756344c21017a6bc520f62e2124aeae8a6` |
| B6 | `8e46bb518700a37d953dc2ef5d31d3c851cf851a61f84bef3fe86230f6da40f6` |
| B7 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| B8 | `5ab047f38d26ea0f45b0dcafb704b610073dfbbc344a08ec22ccd955168857df` |
| B9 | `4b296e7192f65cafa2be70d094448dab7d83c1364c34f4637c9381688fbc7ead` |
| B10 | `ee87b4e152de51e8eccb37af8c2604dd07bcbabc751eb1fac6deeacff9e552b4` |
| B11 | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |
| B12 | `b2b5ebc30953c0b2bff9e501bdfc805b5de8e94f0bb81dade0a6eb571eb6c8af` |
| B13 | `178fb108f82feb33665065d194a6e0ab733cd140f6b56d67f8129d2349b0c1d0` |
| B14 | `aab69376fb5dc3141ce1afefdf7f66d0713351cb954c6b152c2516f34844c365` |
| Q1 | `c3cd726c9ff6fa74e77212a644b74e98d268a01504bd95b651c50a4db61140a8` |
| Q2 | `2ef2518cd75482501fb8e6786b3069ca953e1b7c7c9aba5f1213dbf12af67c74` |
| Q3 | `94324c40f180c24f2a412f231f37f4904c71e390a969a7b3d830c27b5105e5e8` |
| Q4 | `6ea4cb1f79cfa327209dc91092d93542e3c271b72eac4939349fb57b95b9da1d` |
| Q5 | `f4b9184d89cb113de8e960be4ce779c9831f82900bd954348761441079da29d5` |

## Figure And Table Premises Only

fig-114：从已批准源审清单继承方木、水平桌面、向右 `F=10牛`、向下 `P=20牛`；
没有原图左摩擦箭头、上法向箭头或 mu 标签。没有新看像素或补解答标注。
tbl-p0168-01：继承两列、表头、四项数据与行序：
木头/木头0.25，橡皮/木头0.75，钢/冰0.04，钢/钢0.20。
这些是**原始源前提**，不是重新实测的普适系数，不是现代图标签/列布局批准，也不是凭另一本教材的表推翻源值。
源表没有分别列 static/kinetic 两列；不能靠表代替 F1 所需的系数含义说明。

| 不解码的源文件 | SHA-256 |
|---|---|
| artifacts/8p/figures/fig-114.png | `d158a8de1097461f392fdb1e93afb4421196903c16d5208fbddf3e313e2a8f7c` |
| artifacts/8p/figures/fig-114.svg | `213347d72e2c1bd6b20ffcdb462a35c4e46cb7916b6bc725df09e00930e5ef4f` |
| artifacts/8p/figures/tbl-p0168-01.png | `b9fd67d38d1a35112958c4e4cccc2be04b5fc4fc307dc0affacf1f9c63c4827c` |
| artifacts/8p/figures/tbl-p0168-01.svg | `04ebbae5b7206c05c959d509e0b3f39f0669c2a80520a220548e912479dad64c` |

figures.template.json 两个源 PNG/SVG 哈希匹配上述字节，图引用/顺序匹配 lesson。
`spec` 字段及 `changes:["modernized"]` 只是计划声明，不代表图已生成、审过或获批。
现代图未生成是本次用户指定边界；不将缺图作为 text FIRST HOLD 的新增图审失败，不运行任何图流程。

## Primary References And Limits

只在已有全文绑定及首次阅读后，为 static/kinetic 模型和合力做外部核对。
通过 search 找一级资料地址，再用 `cloak-fetch` 获取文本；两次均返回页面 HTTP 200、命令 exit0，没有 screenshot 或图片载荷。

- Rice University / OpenStax，University Physics Volume 1，6.2 Friction。地址 `https://openstax.org/books/university-physics-volume-1/pages/6-2-friction`。本次仅用其分别定义静/滑动系数、静摩擦响应上限、经验模型边界及相对运动讨论；没有用其不同系数表改原表。[已取文本](/Users/yong/.codex/worktrees/0f12/lemmadeck/tmp/b59-sliding-friction-text-review/primary-openstax-friction.stdout.txt)
- NASA Glenn Research Center，Newton's Laws of Motion。地址 `https://www1.grc.nasa.gov/beginners-guide-to-aeronautics/newtons-laws-of-motion/`。仅核对无合力保持恒速度及恒质量第二定律，不使用历史叙事。[已取文本](/Users/yong/.codex/worktrees/0f12/lemmadeck/tmp/b59-sliding-friction-text-review/primary-nasa-newton.stdout.txt)

完整获取命令、exit、stdout/stderr SHA 在 E/primary-*.receipt.json。
反模型、题目计算及条件性结论是本审查者独立分析，不是把外部教材例题当本课答案。
一次 `nl` 同传两文件的 shell 阅读命令因本机参数格式 exit1，未输出题目内容；随后对两个已冻结文件分别首次成功读取。没有产生候选失败、重新判分或流水线重试。
没有正式运行产品、验证浏览器排版、检查现代图可读性或测试学生学习效果；这些不在授权范围内，不能记成 PASS。

## Stop

**FIRST HOLD / REVISE 固定于上述哈希；五项实质问题已完整记录，未修复，未复审。**
文字/来源/数学绑定完整，并不覆盖科学与可解性 HOLD。
不创建答案键、选择题组，不改 code/content/source/模板/Git/backend/DB，不进行下一个管线阶段。
报告外部 SHA-256 由 E/seal.FIRST.json 记录，避免报告自引用哈希。
**返回 text/path/hashes、FIRST verdict，然后 STOP。**
