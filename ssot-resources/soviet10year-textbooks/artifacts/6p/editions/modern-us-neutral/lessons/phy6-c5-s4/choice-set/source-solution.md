# s4 SOURCE-ONLY author reasoning

This record is written before any draft/options/view exists. It is an author's
independent solution of the allowed source, not an independent reviewer approval.
No answer keys, private solutions, old choices or other authors' answers were read.

## Authority and actual asset observations

Seven seeds: `1, 2, 3, 4, 5, 6, q1`. Definition blocks:
`0, 4, 9, 10, 11, 12, 14, 16, 17, 18`.

Official canonical seed SHA:
`588db28bb468074323ab602d30d8f7c5ad3cceb31807366de935618754b6928c`.
The selected-lesson book projection SHA is
`2935841753db60e1381afaec9fcbb413e9584e0c669763d97cacb10a2c182286`,
not the whole raw book's byte SHA. Exact modern input snapshots and their byte
hashes are in `source-asset-evidence.json` and `input-snapshots/`.

Both final SVGs were actually rendered once using an isolated headless project
Chromium with external requests blocked; both complete PNGs were opened at
original resolution with `view_image`. The task's context and browser were
closed. These are input observations, not new image approval gates.

- `fig-180`: current actual SVG SHA
  `adbf2261fdc841a5745a814da72bda43bfcff1bd23b1dd0793d99c04c7c48d9d`;
  full 640 × 640 PNG SHA
  `befe6b5296ff6bf6a901161ad75c3a8cb519624b6e519560f5dbadb4540ad976`.
  The entire horizontal perforated lever, both ends, central vertical stand,
  enclosing pivot clamp and circle O are visible. B is left of O with four
  connected hanging cylindrical weights and label F₂; A is right with two
  connected hanging weights and label F₁. Both stacks and their lower ends are
  visible. The right attachment is farther from O than the left. Counts are
  visible object counts, not a supplied mass calibration or a new N value.
- `fig-181`: current actual SVG SHA
  `7548cc22ea8ce01cc7692012f7e2d5c6c5dab0adf63a526ad6c6b2cc70fd2d5a`;
  full 640 × 480 PNG SHA
  `7c37a31ac482809056fb7479b4c700506f506f1d93d887a0840a0e41808326ca`.
  Complete B–O–A horizontal lever and triangular support are visible. B is left,
  A is right; F₂ is the longer downward arrow at B, F₁ the shorter downward arrow
  at A. Labels l₂ over OB and l₁ over OA preserve the correspondence. OA is
  longer than OB; the marks show two equal intervals on OB and four on OA, but
  no numeric length or N scale is printed. The left lower arrowhead and right
  labels are not clipped. The diagram is a qualitative/schematic relationship,
  not a measurement of the pupil's ruler experiment.

## 1: 杠杆定义

杠杆是可以绕固定支点转动的固体。“可以”是运动约束/能力，不要求它此刻已经在
转动，更不要求它必须是一根直杆、必须水平、必须只有一个特定形状。固定支点是
关键；仅能平移的物体不满足这个定义。自己组织并写出定义的能力尚未通过选择作答证明。

## 2: 力臂定义

某力的力臂是支点到该力作用线的最短距离，即垂直距离，不一般等于支点到施力点
的直线距离，也不等于杠杆全长。对于作用线通过支点的力，该距离为零。图181中
竖直力线和水平杆垂直，才使 OA、OB 分别直接等于 l₁、l₂。

## 3: 找出力臂

确定力的方向和作用点，沿力的方向画出/延长作用线。从支点 O 向这条直线作垂线，
支点到垂足的线段长度就是力臂。垂足未必在杆上，也未必在受力箭头的有限线段内；
所以应使用作用线，而不是仅连 O 与箭头端点或施力点。这是构图和量垂直距离的任务；
认出步骤不能证明亲自作图、作垂线或量取距离。

## 4: 力的作用

力可使杠杆绕支点顺时针或逆时针转动，其转动效果不仅取决于力的大小，也取决于
施力点位置和方向，等价地取决于力臂及转动趋势。图181的 F₁ 在右端 A 向下，
有顺时针趋势；F₂ 在左端 B 向下，有逆时针趋势。“两个力都向下”不表示转动
趋势相同。各力具有的转动趋势不等于杠杆必定实际转动；相反趋势可互相平衡。
支点支承力的作用线过 O，不对 O 产生转矩。

## 5: 平衡规律

本课两力杠杆模型中，转动效果相反，并且
$F_1l_1=F_2l_2$，等价于 $F_1/F_2=l_2/l_1$，则转动效果抵消。
力越大，其对应的平衡力臂应越短，而非越长。力相等只是两力臂也相等时的特例。

应用到静止实验需说明：尺子空载先在中点调平；支点摩擦和尺子自身未抵消的转矩
忽略；研究的两个外载位于两侧并竖直施力。支承力通过支点，不进入关于 O 的转矩
方程。转矩抵消保持原有静止状态，不意味着两个向下力的向量和本身为零，也不能
把这个两力关系无条件推广到存在第三个未计外载或同向转矩的情形。

## 6: 历史归属

选入的现代文本明确说“本教材介绍”这一规律由阿基米德发现。答案依本教材的
历史归属为阿基米德，保留来源限定，不把今天的验证实验当作首发现，也不以书中
描述验证步骤就否认其具名归属。此处不查询其他历史人物、年份或外部证据。

## q1: 全部尺杠实验

先把尺子中点放在支承面很小的支承物上，调整使空尺静止平衡。这是实际建立可绕
固定支点转动的尺杠，而不是略过空载平衡。为推导采用同地点、两侧竖直重力、
力臂为水平尺上到支点的距离、忽略支点摩擦和未抵消自重转矩的模型；它是明示的
理想条件，不宣称学生的实际器具自动满足它。

第一试验以 5 g、1 g 两砝码在两侧重新调整到平衡，记录 $l_5,l_1$。
同地点的 $g$ 抵消，因此 $5l_5=1l_1$，
$l_5:l_1=1:5$。先测得数据再检验力与力臂的乘积；这不是给定测量值。

第二试验使用 2 g、3 g 两砝码，重新调整平衡并记录 $l_2,l_3$。
$2l_2=3l_3$，故 $l_2:l_3=3:2$。
必须保留这第二次实验，不能把第一组的位置当成第二组天然也平衡。

火柴盒未知重量，不能猜一个数值。把已知质量 $m_k$ 的砝码和火柴盒置于两侧，
调到静止平衡，测两侧力臂 $l_k,l_b$。则
$P_b=P_k l_k/l_b$。同地点有
$m_b=m_k l_k/l_b$。若 $m_k$ 以克记，火柴盒质量也以克由此式求出；
若需火柴盒重量的牛顿值且 $g$ 以 N/kg 记，则
$P_b=g(m_k/1000)(l_k/l_b)$ N。教材没有提供当地 $g$ 或力臂实测值，
只能给方法/符号关系，不能编一个已测质量或重量。

必须实际保留并说明的能力损失：放置/调平空尺、布置两组砝码、两次重新找平衡、
测量两组力臂、记录实验误差/用测量验证规律、实际测得火柴盒重量。理论方法识别
可以覆盖关系与实验设计，但不能冒充完成这些实际操作；原实验全文仍应保留。

## Response-unit planning boundary

定义和固定支点条件构成一个单位；力臂定义与垂线构造是同一几何判断，可合并；
转动趋势与平衡关系是同一杠杆机制，可合并但必须保留两者区别；历史归属独立；
完整两次试验和未知火柴盒的求重方法组成同一实际实验方案。尚未构造任何选项。
