# Batch53 Independent SOURCE-Only Solutions: n146

2026-11-17，`STEMROBIN-180`，仅 `7p / phy7-c2-s3-n146` 的六道原题。

## Provenance And Sequence

**先 frozen TEXT verdict，后独立 SOURCE 求解，6/6 完整。** [FIRST verdict](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-n146-b53/FIRST/fulltext-verdict.json) 的 SHA-256 为 `4f407d38d9a7b88de7399c5295dcda1b4de722f8050f336804bafec21ea7c743`；写入后于 `2026-11-17T04:40:14.427Z` 观察其哈希时尚未推导六题。之后重新读取 canonical SOURCE 正文及全部题面，才进行下面的推导。

求解事实只来自以下原始文件，不使用现代题面、作者 solutions / keys / choices、书后答案或外部来源：

| canonical 文件 | SHA-256 |
| --- | --- |
| [lesson.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c2-s3-n146/lesson.json) | `764ba062f6a4b18e45ca9ecae4cc72951712455cac084a66a5ca6ebdd338dca2` |
| [lesson.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c2-s3-n146/lesson.md) | `522910eb644cbc1ef68a72c225962860583a49baa72e1edf28cd748e765c6e1d` |
| [exercises.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c2-s3-n146/exercises.json) | `dcc1208ee0cf3f1d26e74065a6cfa71f85393347293d1c722256fa9d84ebd5f8` |

下面各项 `sourceAnswerRaw` 都是本次独立推导的 SOURCE 答案文本，`source=derived`；**不是书后答案抄录，不是 `bookRaw`**。原题币种保留戈比，不在本报告换成美分或生成现代答案。现代 displayAnswer、expected、grading/interaction 由后续主流程依据其已冻结 edition 另行派生；这里没有执行 answer prepare/finalize 或 Gate2 的运行时输入验收。

## 1. 问题 (1)

稳定 ID `1`；`group_id:g1`；印刷题号 `1`；题面 `p0371#8`。

原题：`(1) 在用电器的说明书中通常都要标明哪一个量？`

**sourceAnswerRaw：通常标明用电器的电功率；电灯的额定电功率是规定工作条件下的标示功率。功率常用瓦特或千瓦表示。**

理由：`p0370#10` 直接说明电灯、电炉、电动机等用电器标明电功率；`p0371#2-3` 使用电灯的额定电功率计算。它说明每单位时间消耗多少电能，不是已经消耗的总电能：

$$P=\frac{A}{t}.$$

量的区别是 $P$ 为功率，$A$ 为电功（消耗电能），$t$ 为相应时间。根据原正文：

$$1\ \mathrm{W}=1\ \mathrm{J/s},\qquad 1\ \mathrm{kW}=1000\ \mathrm{W}.$$

后一换算也可由原千瓦小时等式消去同一小时得到。不能把标示/额定值当成电器任意工作状态下的实际功率，更不能把 W 或 kW 当成已消耗能量的单位。

## 2. 问题 (2)

稳定 ID `2`；`group_id:g1`；印刷题号 `2`；题面 `p0371#9`。

原题：`(2) 怎样用电功率及时间表示电功？`

**sourceAnswerRaw：电功等于电功率与时间的乘积，$A=Pt$；这里 $P$ 是这段时间的恒定功率，或这整段时间的平均功率。**

完整推导：原正文 `p0370#10-11` 给出 $P=A/t$。对 $t>0$，两边乘同一个 $t$：

$$Pt=\frac{A}{t}t=A,\qquad A=Pt.$$

若 $P$ 用瓦特、$t$ 用秒，则 $A$ 用焦耳；若用瓦特和小时，则得到瓦特小时；若用千瓦和小时，则得到千瓦小时：

$$
\mathrm{W}\times\mathrm{s}=\mathrm{J},\qquad
\mathrm{W}\times\mathrm{h}=\mathrm{Wh},\qquad
\mathrm{kW}\times\mathrm{h}=\mathrm{kWh}.
$$

该式不能直接把任意瞬时/额定功率乘上任意总时长。若各时间段有不同的恒定功率 $P_j$、持续时间 $t_j$，分别运用同一原式再相加：

$$A=\sum_j P_jt_j,\qquad t=\sum_jt_j,\qquad \overline P=\frac{A}{t},\qquad A=\overline P t.$$

这里平均功率必须覆盖计算所用的整段时间。关机或待机属于对应实际功率的时间段，不能默认一直以额定功率运行。分段式是原乘积关系的推导说明，不是新增原题已给的数值。

## 3. 问题 (3)

稳定 ID `3`；`group_id:g1`；印刷题号 `3`；题面 `p0371#10`。

原题：`(3) 在实践中经常使用哪些电功的单位？`

**sourceAnswerRaw：原书介绍的实用电功单位是瓦特小时、百瓦小时和千瓦小时。电功的 SI 单位是焦耳。**

理由：`p0370#14-15 + p0371#1` 完整列出这三种实用单位，不能遗漏百瓦小时。由原式中的一小时换算：

$$1\ \mathrm{Wh}=1\ \mathrm{W}\times1\ \mathrm{h}=3600\ \mathrm{J}.$$

百瓦小时表示 100 瓦特持续一小时所消耗的电能：

$$
1\text{ 百瓦小时}
=100\ \mathrm{W}\times1\ \mathrm{h}
=100\ \mathrm{Wh}
=360000\ \mathrm{J}.
$$

千瓦小时表示 1000 瓦特持续一小时所消耗的电能：

$$
1\ \mathrm{kWh}
=1000\ \mathrm{W}\times1\ \mathrm{h}
=1000\ \mathrm{Wh}
=3600000\ \mathrm{J}.
$$

百瓦小时是原书单位例子；不能因为如今题目语境可能更常用 kWh 就从 SOURCE 答案删除。Wh、百瓦小时、kWh 都是能量单位，不是功率单位，也不是“千瓦每小时”。

## 4. 练习 68 (1)

稳定 ID `g2-1`；`group_id:g2`；印刷题号 `1`；题面 `p0371#12`。

原题：`(1) 电熨斗的功率是 0.6 千瓦，算一算它在 1.5 小时内消耗多少能量？`

**sourceAnswerRaw：按题给功率在所给时段内不变（或为该时段平均功率）计算，消耗 $0.9$ 千瓦小时，即 $900$ 瓦特小时或 $3240000$ 焦耳。**

已知 $P=0.6\ \mathrm{kW}$，$t=1.5\ \mathrm{h}$。依据原正文的 $A=Pt$：

$$A=0.6\ \mathrm{kW}\times1.5\ \mathrm{h}=0.9\ \mathrm{kWh}.$$

换算为焦耳：

$$A=0.9\times3600000\ \mathrm{J}=3240000\ \mathrm{J}.$$

同量使用 W/s 表示可独立验算乘积与单位：

$$P=600\ \mathrm{W},\qquad t=1.5\times3600\ \mathrm{s}=5400\ \mathrm{s},$$

$$A=600\ \mathrm{W}\times5400\ \mathrm{s}=3240000\ \mathrm{J}=900\ \mathrm{Wh}.$$

结论是题给条件下的消耗电能，不是热效率或有用热量。如果 0.6 kW 仅是实际恒温熨斗的铭牌值，且 1.5 h 内间歇加热，原给数据不能确定真实消耗；必须另有实际各段功率/加热时间或整段平均功率。不能擅自补一个占空比，也不能要求孩子实际通电试验。

## 5. 练习 68 (2)

稳定 ID `g2-2`；`group_id:g2`；印刷题号 `2`；题面 `p0371#13`。

原题：`(2) 一所住宅中有 60 瓦特及 40 瓦特的电灯各两盏. 每盏灯每天大约点燃 3 小时. 如果每耗费 1 千瓦小时的电能需交费 4 戈比，问一个月 (30 天) 的电费是多少？`

**sourceAnswerRaw：这些电灯一个月约消耗 $18$ 千瓦小时电能；按原题每千瓦小时 $4$ 戈比，电能费用约为 $72$ 戈比。**

“各两盏”是两盏 60 W 与两盏 40 W，共四盏，不是两盏灯。每盏的月点亮时间：

$$t=3\ \mathrm{h/day}\times30\ \mathrm{day}=90\ \mathrm{h}.$$

两组灯分别计算，不需要假定四盏灯每天同时点亮：

$$A_{60}=2\times60\ \mathrm{W}\times90\ \mathrm{h}=10800\ \mathrm{Wh}=10.8\ \mathrm{kWh},$$

$$A_{40}=2\times40\ \mathrm{W}\times90\ \mathrm{h}=7200\ \mathrm{Wh}=7.2\ \mathrm{kWh}.$$

相加得到：

$$A=A_{60}+A_{40}=18\ \mathrm{kWh}.$$

等价地，总功率的代数和为 $2\times60+2\times40=200\ \mathrm{W}=0.2\ \mathrm{kW}$，各灯点亮时数相同，所以 $0.2\ \mathrm{kW}\times90\ \mathrm{h}=18\ \mathrm{kWh}$。这里合并乘积不是新增“同时开灯”的条件。

原题费率 $r=4\text{ 戈比}/\mathrm{kWh}$，故：

$$C=rA=4\frac{\text{戈比}}{\mathrm{kWh}}\times18\ \mathrm{kWh}=72\text{ 戈比}.$$

时间是“大约”3小时，所以保留约值性质；将题给时间恰取为3小时计算时，模型数值就是72戈比。这里只算四盏灯按题给费率产生的电能费用，不是整个住宅的全部实际账单，不另加固定费或别的电器费用。灯在点亮时按题给功率运行；实际功率若不同，结果也随之改变。

原题 `4 戈比` 与答案 `72 戈比` 均保留，不作货币换算、不引入实际电价。虽然数值总电能恰与正文教学例题相同，这里的18 kWh是由本题四盏灯及90小时独立相加推导的，不挪用正文的单灯答案。

## 6. 无编号作业

稳定 ID `q1`；`group_id:g3`；`source_number:null`；题面 `p0371#15`。

原题：`弄清你家中所用的各种电器的电功率以及它们在一周内的大约使用时间. 计算出这些电器在一周内所消耗的电能的费用，并把你算得的钱数与根据电度表所得的钱数加以比较.`

**sourceAnswerRaw：对同一周每台电器以相应运行功率乘对应使用时间，再把电能相加并按实际计价规则算费用；以同一周电度表终读数减初读数求实测电能，按相同计价规则求费用，再比较两者。原题没有给家庭功率、时长、费率或表读数，不能确定一个统一数值答案。**

这是要求真实调查、计算与解释的完整方法解，不是遗漏具体答案。原题确实没有家庭数据，不能移用上一题的4戈比费率或编一套家庭电器、时间、表读数。

### 收集同一周的数据

选定起止时刻 $T_0,T_1$，间隔一周。列出家中本次调查覆盖的所有电器，每台记录：

| 电器标识 | 功率依据及运行状态 | 该状态功率 $P_{ij}$（W） | 同周该状态累计时间 $t_{ij}$（h） | 估算电能（kWh） |
| --- | --- | --- | --- | --- |
| 实际电器 $i$、状态 $j$ | 安全可读说明书/标牌；实际适用状态与假设 | $P_{ij}$ | $t_{ij}$ | $(P_{ij}/1000)t_{ij}$ |

表格是变量模板，没有填入虚构家庭值。还需取得实际计价资料、同周电度表初读数 $M_0$ 和终读数 $M_1$，两次读数都用 kWh，并核对计量范围相同、表无换表/复位等导致不能直接相减的情况。数据取得不了时明确缺失，保留条件式，不伪造测量。

### 求估算电能与费用

如果每台电器在使用时间内功率近似不变，使用原正文的乘积公式：

$$A_{i,\mathrm{est}}=\frac{P_i}{1000}t_i\ \mathrm{kWh},\qquad A_{\mathrm{est}}=\sum_i A_{i,\mathrm{est}}.$$

如果同一台电器会改变功率、停热或待机，把该周按实际状态分段；同一台的状态时间不能重叠计入：

$$A_{\mathrm{est}}=\sum_i\sum_j\frac{P_{ij}}{1000}t_{ij}\ \mathrm{kWh}.$$

也可以用覆盖相同时间的平均功率与时长相乘。不能把加热额定功率乘上包括停热/关机时间在内的整周；待机若有耗电，需要计入其相应功率和时长。这里只说明模型条件，不补实际占空比。

若实际是统一单位费率 $r$，则：

$$C_{\mathrm{est}}=rA_{\mathrm{est}}.$$

$r$ 的单位是实际货币/kWh，结果为同种货币。采用原题币种资料时可写戈比/kWh和戈比，但该作业自身没有给出币种或费率数值，不能把上一题的价钱自动当作本题已知。

若实际按不同时间段费率 $r_k$ 收费，且有对应分段电能，则：

$$C_{\mathrm{est}}=\sum_k r_k A_{\mathrm{est},k}.$$

若有阶梯或其他计价规则，按同一真实规则及其所需的账期背景计算本周消费费用，不能随意设一个平均价格。缺少分时/阶梯所需数据时，只能给条件估算及其限制，不能给出假装精确的账单结果。

### 求电度表对应费用

对于同一周、同一计量范围且可直接相减的累计读数：

$$A_{\mathrm{meter}}=M_1-M_0\quad(\mathrm{kWh}).$$

统一费率时：

$$C_{\mathrm{meter}}=r(M_1-M_0).$$

若实际分时计价，则用各时段寄存器/记录所得电能 $A_{\mathrm{meter},k}$：

$$C_{\mathrm{meter}}=\sum_k r_k A_{\mathrm{meter},k}.$$

阶梯价需沿同一账期背景计算这一周增加的消费费用，而不是把整月阶梯从零重新应用到周用量。估算侧与表计侧必须采用同一计价口径。无条件时不以 $rA$ 冒充所有计价规则。

### 比较并解释

同时列出估算与表计能量、对应费用及差值：

$$\Delta A=A_{\mathrm{est}}-A_{\mathrm{meter}},\qquad \Delta C=C_{\mathrm{est}}-C_{\mathrm{meter}}.$$

统一同费率下，$\Delta C=r\Delta A$。$\Delta C>0$ 表示估算费用比表计高，$\Delta C<0$ 表示估算费用比表计低；相等只表示本周两种算数吻合，不能证明每台电器或每个假设都准确。

解释差异时依据真实调查，检查近似使用时间、额定与实际功率差异、停热/调档/待机、漏列电器以及两边起止时刻和计量范围是否一致。电度表一般对应调查范围内全部用电；若只列部分电器，必须承认覆盖不完整，不把差异全归为测量错误。

只比较同周电能消费费用；账单含有固定费用或其他非电能收费时分开列出，不把它们当成电器消耗的电能。原题没有这些收费的具体值，不得自行增减一个数字。

实施安全边界来自本次授权，不冒充原题逐字内容：由成人帮助查看能够安全读到的说明书、铭牌和表读数；不拆卸电器、不碰电线、不打开表箱、不自行接线或运行熨斗来取得数据。资料不足就说明条件，不用危险实验填空。

## Coverage And Limits

六个稳定 ID `1, 2, 3, g2-1, g2-2, q1` 各一份完整 SOURCE 解答；重复栏目题号与无编号状态保留。概念题有量、公式、单位和理由，数值题有全部运算/换算及工作条件，家庭题有可执行条件方法、两类费用计算和比较而没有虚构实测结果。

采用 answer Gate2 的完整性与“不得伪造可判正误”原则，但本文件只是 SOURCE 推导证据，不宣称生产 answer key、MathLive 输入检查、finalize/publish 或完整 Gate2 PASS。本报告没有现代 displayAnswer/expected/interaction，没有读书后答案、作者解答或外部材料。

实际 images **batch 0 / context 0**（限 8 / 24）；无源页重审、图片加载、模板或工具修复、pipeline/prepare/finalize/render/browser、code/unit/full checks、服务请求、Git/backend/DB/app/deps。现有模板布局预算 **used 1 / remaining 0**，既有工具修复1及其首次失败不变。模型 tokens 与实际账单费用 unknown。仅写指定证据文件，其他人工作保持原样。
