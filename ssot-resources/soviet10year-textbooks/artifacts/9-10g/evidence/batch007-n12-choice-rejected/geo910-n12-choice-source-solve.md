# n12 choice source-solve freeze

Author: Dalton. Scope: the official n12 choice seed only, written tasks 97-106
and selected concept blocks 1/9/10/11/12. This file freezes the already completed
independent source reasoning before authoring alternatives. It does not repeat
prepare, reopen any image, consult an answer, or constitute independent review
of this author's later questions.

## Input and actual-image reuse

- Seed: `geo910-n12-choice-seed.json`.
- Seed canonical SHA-256: `e4a23600dcc57983ae486b56ef88280f79707dbe0b5a0d8ad0f0265f27facdcd`.
- Seed raw bytes: 6945; raw SHA-256: `b902a808e1fbe32a89e0060b8091f1970c717083b6d40ca3f82616029feedf17`.
- Canonical means Python JSON, sorted keys, ensure_ascii=True, separators=(",", ":"),
  UTF-8, as specified in the current contract. A preceding raw/canonical hash
  comparison was corrected after this distinction was checked. It was not an
  actual validator/input failure.
- Actual durable `fig-39.svg`: 16371 bytes;
  `e8615612dd24ab32114684e2f61af45a1c11490c98f977fc6a290e5ab9077d6e`.
- Actual durable `fig-41.svg`: 45904 bytes;
  `6352060de070f8f32ca8c98250fc82c061cf33fd5625d5b466af995a5081f272`.
- Both seed asset byte hashes equal the same SVGs whose complete corresponding
  PNGs were actually observed during this author's earlier, closed figure role.
  Those actual observations are reused, not replaced by SVG text inspection,
  and no figure quality review, original-image opening or browser was repeated.
- Reused fig39 observation: full alpha plane patch; A1 above it, A on it, a
  separate unnamed point on l at the plane, three actual dots total; oblique
  parallel l/l1, with l1 ending at A, and l solid/dashed/solid across the plane.
  Labels alpha/A1/A/l1/l. There is no right-angle or equal-length marker.
- Reused fig41 observation: A1-F1/O1 and A-F/O, 14 named points; 12 perimeter
  edges, only D1-A1 and D-A diagonals, seven projectors including the centres;
  interrupted E/C projectors and the complete alpha wall. The source model is
  intrinsically regular; its shadow is not thereby regular. The fixed 640px
  scroll-media presentation and 26px labels were already observed and reviewed.
  No metric property is inferred from screen perspective.
- These two figures supply definition context. No candidate answer diagram is
  needed for the mathematical response units below.

## Common model and source conditions

所用投影始终是定义 1 的平行投影 P: 沿一维方向 d 投到平面 alpha，
d 与 alpha 横截相交，不假设 d 垂直于 alpha。P 在 alpha 上为恒等，
每条平行于 d 的投射直线是一个完整纤维，其所有点映到同一个点。
线性部分的核为 span(d)，秩为 2。

内部证明可取仿射适配坐标 alpha: z=0、d 为 z 方向，于是
P(x,y,z)=(x,y,0)。这只是关联/平行关系的坐标模型，不宣称它是欧氏
正交坐标；涉及长度的 102 单独使用实际欧氏向量。

概念 9 明确把不平行于投影方向的条件加在后续性质前。不能把性质 1
直接套给投射直线，也不能把性质 2 无条件套给会退化或重合的像。
以下涉及“两个不同的平行像直线”时把“不同”明确说出，不靠平行
一词是否容许重合的习惯用法。

## Full selected written-task solutions

### 97: 三个不同点的像点数

任务是枚举全部可能的像点数，不是只数已落在投影平面上的原点。
答案为 1、2、3。三个点在同一投射直线上时只有一个像；其中两个在
同一纤维、第三个在另一纤维时有两个像；位于三个不同纤维时有三个像。
每个原点都有一个像，故不能是 0；映射不会从三个原点产生四个像。

关键区别是原点不同不推出像点不同，同时投影也不会丢弃平面外的点。
选择响应可完整保留数目枚举，但不能证明学生能独立给出三种配置。

### 98: 投射直线

一条投射直线的射影是一个点。若其点写作 X+t d，则
P(X+t d)=P(X)，与 t 无关。全直线而非仅可见线段都在同一纤维上。
性质 1 的排除条件不能删除。不存在把两个不同像端点连成像直线的
步骤，因为这里两个端点的像本来重合。

任务要求识别退化像；文字选择可保留该识别，损失独立论证生产。

### 99: 平面/半平面/非平角角的全图形分类 HOLD

当前 seed 给出平行投影定义，却未给出半平面的边界归属、角是边界
两射线还是填充区域、零角/优角是否允许等所需定义。原题只排除平角，
不能自行补成现代的“非退化凸扇形”。以下是独立条件化结论，不把
缺失约定假装已经解决:

1. 完整仿射平面 pi 的方向空间记为 U。若 d 不在 U 内，P 在 pi 上
   秩 2 且为仿射同构，其像为整个 alpha。若 d 在 U 内，限制秩为 1，
   像为一条直线。秩不可能为 0，因为二维 U 不可能包含于一维核。
   这一平面子任务本身是约定无关的。
2. 若半平面 H 是 pi 中由边界直线 g 分隔的二维半平面: 秩 2 时
   像为半平面，边界是否包含保持原约定。秩 1 且 d 不平行 g 时，
   每个像纤维在 pi 中沿 d 穿过边界，必与 H 相交，故像为整条直线。
   秩 1 且 d 平行 g 时，g 缩成一点，像为包含或不包含端点的半直线，
   端点归属取决于 H 是否含边界。这是边界条件依赖，不可硬写成闭射线。
3. 对普通非退化、非平角的角: 若“角”指两边射线之并，秩 2 时像为
   两条不共线射线之并；秩 1 时可能为射线或整条直线。若“角”指
   填充的凸扇形，秩 2 时像为填充扇形，秩 1 时可能为射线或直线。
   若还允许优角区域，分类又不同；若零角允许为原对象，两边可能
   同向，且沿 d 可缩为一点。端点包含仍必须来自定义。

不能把上述条件表拼成一个无条件唯一键。整道复合分类暂不出 choice；
coverage 必须逐项说明 99(1)、99(2)、99(3) 未进入候选。即使 99(1)
可单独确定，也不声称这解决整个原任务。此核心缺项为 full-source
coverage HOLD，等待定义授权而非猜约定。

### 100: 固定点与整条固定直线

P(X)=X 当且仅当 X 属于 alpha。必要性由所有像都在 alpha 上得到，
充分性由通过 alpha 中 X 的投射直线与 alpha 的唯一交点就是 X 得到。

整条直线 a 的像集合与 a 重合，当且仅当 a 完全包含在 alpha 中。
必要性: P(a) 是 alpha 的子集，若等于 a，则 a 也必须属于 alpha。
充分性: a 上每个点都是固定点。仅仅与 alpha 平行但不在其中不够；
沿 d 的直线反而缩为一点。

两个充分必要条件是同一固定集概念的点/线层次，宜作为一个完整成对
响应而非两个微小点击。损失是独立证明两个方向。

### 101: 平行像结论的例外

取两条不同的平行原直线 a、b，共同方向 u，二者决定平面 pi。

- 若 u 平行 d，则每条原直线缩为一点，且这两个点不同。若像点相同，
  a、b 就会是同一纤维，违背原直线不同。
- 若 u 不平行 d，则两个像都是直线。若 d 在 pi 的方向空间内，
  P(pi) 是一条直线，两个像直线均为它，故重合。
- 若 d 不在 pi 的方向空间内，则 P 在 pi 上单射，两个像不同，
  且共同方向 P(u) 非零，因此它们是不同的平行直线。

所以“得到两条不同的平行直线”失效的恰是缩点和重合两种情况。
pi 平行 alpha 时 d 不在其方向空间内，不是例外。必须用
“pi 内有平行于 d 的方向”表达，避免“直线平行平面”是否排除
直线包含于平面的术语争议。判断响应损失独立证明上述分类。

### 102: 保长不推出平行于平面

不将一般平行投影偷换成正投影。用真实欧氏单位法向量 n，写非零线段
向量 v=u+h n，其中 u 平行 alpha。令 e=d_T/d_n，其中 d_n 非零，
则像向量为 u-h e。保长条件是

|u-h e|^2=|u|^2+h^2，
即 -2h(u dot e)+h^2(|e|^2-1)=0。

当 h=0，线段平行 alpha，总保长，包括包含在 alpha 中以及位于平面外
且平行的情况。h 非零也可能满足: 在实际欧氏坐标 alpha:z=0 下，
取 d=(1,0,1)、v=(0,0,1)，则 P(v)=(-1,0,0)，两长度相等，原线段
所在直线却垂直 alpha。把同一线段平移，可使它跨过 alpha、以端点
接触 alpha，或整个线段在平面外且支持直线不平行 alpha；长度不变。
斜交也可能，例如同一 d 下 v=(0,1,1) 的原/像长度同为 sqrt(2)。

因此可能位置包括: 包含于平面；在外且平行；与平面交于一点；
有限线段不相交但支持直线不平行平面；其中垂直支持直线也可能。
若非零原线段平行 d，则像长为 0，不能保长。

这里“可能”是对一般允许的平行投影的存在性判断，并非对每一个固定
投影方向都能实现所有情况。正投影额外限制 e=0 时才推出 h=0，当前
seed 没有这条限制。候选须显式说一般平行投影、非零线段，不能让读者
从图 41 的屏幕轮廓读出原/像长度。

### 103(1): 相交直线的并集

两条不同原直线交于 X，其像均含 P(X)。两条方向独立，不能同时在
一维核中，所以不可能两条都缩点。若一条缩点，那个点属于另一条
像直线，故并集只有一条直线。若都不缩点，像可以重合为一条直线，
也可以是两条不同的相交直线。故完整像类型只有这两种。

不可能是两条不同平行直线、直线加外点或单独一点。适配坐标中的
x 轴/z 轴给出一条直线；x 轴/y 轴给出两个相交像。示例用于内部
证明存在性，不冒称源图或新候选图。

### 103(2): 异面直线的并集

原直线异面，其方向独立。若一条沿 d 缩点，另一条不会同时缩点。
缩点不能落在另一像直线上，否则该原纤维与另一原直线落在同一
由 d 和后者方向张成的平面内，原直线就不是异面。此时得到
“一条直线加一个不在该直线上的点”。

若都不缩点，两个像直线可以相交或为不同平行线，但不能重合。
若重合，则其完整逆像是一个平面，包含两条原直线，矛盾。
也不可能只得到一点。因此完整类型为:

- 两条不同的相交直线;
- 两条不同的平行直线;
- 一条直线和一个外点。

适配坐标下可实现的异面原直线例:
a=(t,0,0)，b=(0,s,1) 给出相交像；
a=(t,0,0)，b=(s,1,s) 给出不同平行像；
a=(0,0,t)，b=(s,1,0) 给出直线加外点。
这些是关联模型证明，不隐含角度或长度。

相交与异面两类的约束不同，故 103 的两个响应单元并非按印刷分项
机械切割，也不是重复。识别图形类型不能代替学生独立构造实例。

### 104(1): 平行像的逆命题

逆命题不正确。103(2) 中 a=(t,0,0)、b=(s,1,s) 的原直线异面，
但沿 z 方向投影到 z=0 后，像为 y=0、y=1 的不同平行直线。
所以平行像不能推出原直线平行。与 103(2) 的完整像类型同属
“异面原直线能否有平行像”的数学判断，可以合并为一个响应，
但必须有显式逆命题判断，不能只在内部声称它已经覆盖。

### 104(2): 作投影方向的条件化构造 HOLD

给定异面 a、b 和固定 alpha，原任务要求作 l，不能把总能作出当作
已知条件。令 a、b 的方向向量为 u、v，U=span(u,v)。异面使 u、v
独立。要得到两条非退化平行像，必需且只需投影方向 d 属于 U、
不平行 u 或 v，并与 alpha 横截。

必要性: 两个非零像方向平行意味着某个非零组合 u-cv 落在核中，
所以 d 属于 U。反过来 d 属于 U 且避开两原方向时，商空间 U/span(d)
是一维，两个像方向非零且平行。

作法（仅可行时）: 过 a 作平面 beta，使其平行 b，其方向空间就是 U。
若 beta 不平行 alpha，选择 beta 内与 alpha 横截、且不平行 a/b 的
方向作 l。可选方向不空: 二维 U 中只需避开与 alpha 平行的一维方向
及 u/v 两条方向。两个像不同，因为异面线的相对偏移 w 不属于 U；
重合会使 w 属于 U，造成共面。

但如果 a、b 的方向都平行 alpha，则 U 是 alpha 的方向空间，
所有 d 属于 U 都不与 alpha 横截。此时没有符合定义 1 的投影，
可以使它们成为两条非退化平行像。等价可行条件是 beta 不平行 alpha。

seed 未给出这条条件。不能自行添加、把“可能”改成“总能”，或把
无法作图默默当作生产能力损失。完整无条件构造为核心缺项 HOLD；
本候选只覆盖 104(1)，104(2) 连同条件化解法/无解情形明确留在
coverage/source-solve/author 报告中等待母方决定。

### 105: 三条非共面共端点射线

原并集就是三条共端点但不在同一平面的射线之并，不能自动填成
实体三面角或平面角区域。令三个正向方向为独立向量 v1/v2/v3。
P 的秩为 2，所以三个像方向张成二维；至多一条原射线缩点，
全部像不可能落在一条直线上。

完整像类型:

1. 两条不共线射线之并（第三条缩为共同端点，或与另一像射线同向重合）;
2. 三条两两不共线的共端点射线之并;
3. 一条整直线与一条不在该直线上的射线之并，射线端点在该直线上
   （两个非零像方向相反，第三个不共线）。

不存在只剩一个点、一条射线或一条直线的情形。有限三条射线的并
不变成填充二维区域。存在性: 对张成二维的任意上述像方向配置，
可给三个原方向赋不同的沿 d 分量，使它们在三维独立；共同原端点
映为共同像端点。这里明确描述射线及其并，不依赖 99 的角区域约定。

原题“并集和射影”的措辞原样保留在 seed；源解分别交代原并集和
其像，不擅改成填充角。选择类型不证明学生能画出空间三射线配置。

### 106: 分点比与长度

原条件: AB 与 alpha 交于 M；像为线段 A1B1；
|AB|=m，|A1M|:|MB1|=p:q。M 属于 alpha，故 P(M)=M，且 M 在 AB 上。
给定比有意义、像线段非退化时，同一支持直线上的两个方向段有同一
正长度缩放因子 k。因此 |AM|:|MB|=p:q，而
|AM|+|MB|=m，得到

|AM|=p m/(p+q)，|MB|=q m/(p+q)。

单位继承 m，不补 cm 或新数据。所用边界仅是原比有意义、p+q 非零；
不借空缺定义另加“严格内部点”作为秘密条件。若允许端点且所给比
仍有意义，公式保持相应零长度；双方为零的比本来不成立。只在某个
特例 p=q 下巧合相等的交换公式不是关于任意有意义 p:q 的通用公式。

本任务要求两个长度及顺序，是一个完整有序响应。其选择化损失为
独立推出比值保持、解比例式并说明单位的生产能力。

## Freeze and coverage readiness

97/98/100/101/102/103(1)/103(2)+104(1)/105/106 可形成自然数学响应单元。
不以十个 seed 强迫十道题；103 两类独立，103(2) 与 104(1) 则能合并。
99 全复合分类与 104(2) 无条件构造仍为 HOLD，不能声称十个原任务
已经全部解决并可提升。任何后续 draft 是有这些显式不足的离线部分
候选，等待 Aristotle 独立审者由母方先披露 view、再披露内稿/key。

本文件首次写成后保留不变。未读取其他作者或审者的 scratch、freeze、
答案、choice、历史，也未发送其他 chat 消息。没有新图、源/现代修改、
prepare/finalize、DB、Git、网络或浏览器操作。
