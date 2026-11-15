# Batch6 Modern Text Author: S22-S25

日期：2026-11-15。仓库：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。
角色：**TEXT AUTHOR ONLY / COMPLETE**，不是独立审查或整课门禁PASS。
范围：6p `phy6-c3-s22/s23/s24/s25`，原§36-39。
没有adapt-finalize、assemble、render、图制作/审批、晋升或发布。

## 精确准备命令

在本worktree运行一次，退出0；未使用`--force`：

```bash
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare --book 6p --edition modern-us-neutral --lesson phy6-c3-s22 --lesson phy6-c3-s23 --lesson phy6-c3-s24 --lesson phy6-c3-s25
```

读当前lesson技能、edition text contract、modern-us-neutral profile、
四课完整原lesson/exercises；没有读取答案、choice或其它作者解。
所有文本交付在：

`.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/<id>/`

准备命令按现有实现自动创建四课`figures.template.json`和
scratch `book.template.json`；作者没有编辑它们。
没有修改持久book索引或持久edition文件。

## 实际内容计数

| 课 | § | 源prose总块 | 源p块 | fig/cap块 | 当前prose_flow段落 | 书写题 | 课内图 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| phy6-c3-s22 | 36 | 4 | 4 | 0 | 5 | 2 | 0 |
| phy6-c3-s23 | 37 | 18 | 10 | 8 | 11 | 7 | 4 |
| phy6-c3-s24 | 38 | 13 | 9 | 4 | 13 | 7 | 2 |
| phy6-c3-s25 | 39 | 7 | 5 | 2 | 6 | 3 | 1 |
| 合计 | 36-39 | 42 | 28 | 14 | 35 | 19 | 7 |

所以“31?”不是本次源p块数或当前最终流段落数。
28个源p块及14个fig/cap块顺序、身份和source_refs均保持；
35是同一正文经短段落排版后的当前发布流段落数，不是新增35个源对象。
7张课内图为70-76；s22另外保留外部图61(a)文字引用。

## 实际修改

手工仅apply_patch编辑四份`lesson.template.json`和s23一份
`exercises.template.json`。其它三课习题模板沿用prepare结果，
没有为了“改过”而重写文化中性的题面。

四课没有需要替换的虚构苏联文化机构、货币或人名；
保持普通船、锯、雪橇、滑冰、自行车、火车、汽车、圆木、
木桶和实验装置语境，不制造现代地点/人物/事实。
`historical_entities`仍为空，未作全书文化豁免声明。

### S22: 力的合成与合力

prose零基索引0：完整保留锯、船及弹簧物体三个例子和全部力种，
按完整语句分行、分为两个短段；源`图 61. а`中的字母改为Latin a。
现代文字最终保留源点式格式`图 61. a`，语义仍为fig61(a)。

索引2/3：合并印刷行断开造成的相邻粗体标记，
不改合力定义、合成/求和和分力术语；定义关键词仍粗体。
两题原文和`g1`身份不改。

**外部依赖未解决：** s22源课内figures为空，但正文引用图61(a)，
绑定为`p0092#17`和`p0093#1`。本次没有删除引用、改引图70、
自行补课内图条目或动fig61资产/spec/历史阻塞项。
用户注明的fig61历史blocker仍交主会话处理，不称其已经修复，
也不以文本完成替代该依赖的后续图/整课门禁。

### S23: 同一直线上的两力合成

prose索引1：补可见文字
“本实验按每千克质量对应十牛顿重力的近似口径估算，
质量与重量仍是不同的物理量”，并把原质量→重量句限定于
“按这一近似口径”。这是源0.1kg→1N、0.2kg→2N所用的
约10N/kg口径说明，不改用9.8，也不把质量称为力。
原公式/数字仍是0.1、0.2、1、2、3，量纲和有效数字未换。
说明采用文字而非加入一个未登记的新数学公式；
`changes`明确登记`clarification`，没有假造math-correction。

索引1/10：图70及图72的西里尔а/б改为Latin `(a)/(b)`。
索引11/14：完整语句分行，同向求和、反向求差及零合力例式原样保留。
索引12/17：合并断开的粗体，保留反向合力方向/差及静止或匀速直线
运动结论。索引13只补“合力 $R$”的间隔，符号仍是R/F_1/F_2。
图70-73的块、caption、顺序与source_refs全部不改。

习题`g2-1`：70kg的人、20kg箱子、原问地面压力全部保留，
另明示按本课每千克对应十牛顿重力的近似口径估算；
不在题干填算出的答案或换成9.8口径。

习题`g2-2`：保留四个人、330/380与300/400N两侧拉力，
**原问“绳将向哪个方向移动，这四个力的合力等于什么？”完整保留**。
新增一行可见说明：
“合力的方向是它使绳的速度变化（加速度）的方向；
绳当前的移动方向还取决于初始运动状态.”
没有偷偷补“起初静止”、指定某侧移动、填合力数值，
也没有把原题静默换成一个只问加速度的新题。
原题未明确初始运动状态的边界仍在；不能将合力方向当任意状态的
瞬时速度方向。该说明在`changes`登记`clarification`。

习题`g2-3`：只按完整语句分行，保留匀速下落、700N、
空气阻力问题、自选比例及两力画在作用线上同一点的要求。
无新图或答案。

所有问题1-4仍`g1`；练习17的`g2-1/g2-2/g2-3`仍`g2`，
`source_number`仍1/2/3，栏目名“练习 17”未变。

### S24: 摩擦力

prose索引0/5/9/10/11/12作完整语句分行及2-3句短段落排版。
索引5/10把图75的а/б改为Latin `(a)/(b)`。
摩擦定义保持p0096#8原无添加逗号的句子。
粗糙表面嵌合、分子引力、润滑层、冰刀/冰间薄水层的原解释，
滑动和滚动摩擦分类及原例子全部保留；没有用现代分类或理论反改源。
图74/75及caption块不改，问题1-7和`g1`全部不改。

### S25: 测量摩擦力

prose索引0：图76а改Latin `(a)`，完整保留木块匀速、
右向弹簧拉力、左向摩擦及等值反向的测量关系，分语句/短段落。
索引4：仅分行，保留放砝码或手压增大摩擦及原粗体结论。
索引5：图76б改Latin `(b)`，保留两根圆棍与原比较。
末尾“载荷相同时滚动摩擦力小于滑动摩擦力”粗体结论保持。
图76/caption和全部三题`g1`不改。

## Prose Flow 锚点

先对实际文本逐课运行现有`prose_flow.mjs`，从输出复制相邻段落
`{before,after}`对象，不手算prose块号作section_breaks。
再用`--json`只读解析确认当前锚点均可唯一解析：

| 课 | 当前resolvedBreaks | 概念切换 |
| --- | --- | --- |
| s22 | [2] | 多力例子→等效单力/合力 |
| s23 | [5,9] | 同向→反向；反向→等值反向零合力 |
| s24 | [5,9,11] | 定义→成因；成因→润滑；润滑→摩擦类别 |
| s25 | [3,4] | 测量→压向接触面的力；载荷→滚动比较 |

以上整数仅报告工具解析结果，实际模板存储完整文本锚点。

## 作者只读检查

调用现有`edition.validate_text`逐块/逐题检查，不调用
`validate_lesson`整课图门禁，也没有执行adapt-finalize。
同时结构化比较当前raw与模板的source.data/source.sha256、
source_text、所有prose身份字段/source_refs、全部习题身份/页绑定、
题数以及`lines == text.splitlines()`。
最后一次只读检查退出0，输出`TEXT_ONLY_ERRORS 0`；
四课errors数组均为空。公式签名、非公式数字签名、文化profile
及现代文本无西里尔字母的检查通过。源snapshot仍可保留西里尔原文。

如实保留一次有内容输出的作者检查失败：
s22最初采用`图 61(a)`时，工具报
`prose 0 的非公式数字变化未被准确声明: want=[], got=['61']`；
其它三课当次无错误。源61后的点号使现有NUMBER签名排除它，
现代去点格式却计入61。这不是实际更改图号。
随后只把s22当前现代引用保留为源点式`图 61. a`并同步锚点，
不删依赖、不加假numeric_changes、不改源/计数器；
最终图号与分图身份不变，文本检查0错误。

四课`errata`均为空，未新增数学勘误。所有`numeric_changes`为空，
原数字、公式及单位未替换；g约十的源口径说明不是换源数字。
作者检查不自动证明独立语义或图像门禁通过。

## 当前文本快照

以下均为文件字节SHA-256，路径相对本批scratch lessons目录：

| 文件 | SHA-256 |
| --- | --- |
| phy6-c3-s22/lesson.template.json | 809065c8c7ff3c763f2fe007d5713c5de3bef6e360f0e9dfcd21ad5e8a2ad913 |
| phy6-c3-s22/exercises.template.json | 2dbd6a24349fd4f0c44748096275edd1c0e29d0d695fee7945dee7c5480969d3 |
| phy6-c3-s23/lesson.template.json | 01b0274797df4655d37db3dd0e15179d7addb19e88ce5f58f9170a851e8e73ea |
| phy6-c3-s23/exercises.template.json | 2df5dd3ae194f06ccabd2471bd30fd3078fee93ebc2534a0b7dbf3c9f3674019 |
| phy6-c3-s24/lesson.template.json | abe61637a90bef1a81fce591e1cc606a1300dcb4b4aff5bc78a40b9061ebc0b3 |
| phy6-c3-s24/exercises.template.json | 42c92e76eb60f3bd427ef20ce77dbcee417925e476e2fac161edbcca73292c67 |
| phy6-c3-s25/lesson.template.json | 61244052e85a407cb5d5e37c772a21d3da6690751ee8bb7542d0e0146656af05 |
| phy6-c3-s25/exercises.template.json | 70192a95fa0209778b99277a601d3c24d4fb3d58b00c38ff1454d2f8c14fbc06 |

## 未触碰与停止点

prepare后四份figures.template.json哈希至完成时未变：
s22 `75aa8865e5b9a747117eda7e8e72d0a58fe043cfd855dd0016cd433bf5118736`；
s23 `88fc6f9f3dfffc62d5cbff82367fddbb0c2db8c9f1f55e316e4e4dbbbb642f3e`；
s24 `3cacf7aeac2bac47e7666ecbdd6a47aa532ca305a5e11359fa1df63e507c2146`；
s25 `340275423106629b87093599c68d199ceb7c012ee023b190e0cc0462db8d5c23`。
prepare写出的scratch book.template.json随后也未编辑。

准备前/完成时四课raw lesson.json/exercises.json/lesson.md、
相关fig61及70-76源PNG/SVG、两份持久book索引哈希均一致。
raw book.json仍
`5d9e956fda833b0a3fa826f9e83919ce97aae25f15c524f0c08d98581c621d26`；
edition book.json仍
`7ce8f54d1b9634bfbf85ce293cfae25a3b913d20d9f87ece63dc8073c285af32`。
四课持久现代lesson目录完成时仍不存在，没有提前晋升文本。

没有修改图模板/输出、页源、持久课文、book索引、应用、工具、依赖，
没有访问DB、答案/choice、模型或执行Git。
本任务不需要浏览器，未开启任何浏览器/可见窗口/HTML报告，
未触碰用户profile、CDP、窗口、标签或系统输入。
共享工作区其他代理文件不回滚或清理。
交回四课scratch文本与本报告，保留fig61历史依赖，按委托到此停止。
