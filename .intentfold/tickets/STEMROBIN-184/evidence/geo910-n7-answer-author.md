# geo910 n7 标准答案正文 Scratch

日期：2026-11-16。工单：STEMROBIN-184。
作者：Codex，既有父会话委托下的标准答案作者，不是本稿独立 Gate2 审阅者。
状态：pre-prepare prose scratch。**不是正式 answer-keys JSON，不是 ready/PASS。**

## 读取顺序、来源与限制

先读父方已批准并复制到 durable 的当前 n7 现代完整课文与13题题面，
再分别实际打开忠实原 PNG17、18、19、20，之后完成本稿数学推导。
首次完整 JSON 输出中部被工具截断，随后用结构化投影完整读取所有现代正文和44–56题面；
没有把被截断输出当作已经读完。
未读母方 `n7-source-first` 的 WrittenSolutions、其他答案、选择题或图作者笔记／spec。

| 当前输入 | 原字节 SHA-256 |
|---|---|
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n7/lesson.json` | `090ce96e411d57914431064281e6b526281ced5b5a7a60357e9ca897363b04cb` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n7/exercises.json` | `5f8ebbe42550de1f915e513b5de103a26cc53fb5c7480e6ad3da8c1b687243d2` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-17.png` | `0b4ffbcd3332c2a401aedde26e5584bc4e522e3cd4b66430a25ca2d4831fabb5` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-18.png` | `abda4d00e1a5bcd52763ac63a14a20c3fda3148d7a63db5b04ab6d3ed31b9a3e` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-19.png` | `d25e282b0d3e79fc8b02b529183eaf4cf0a6823a47949053134887d878c458d9` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-20.png` | `6549346703172e58778dbe241223a400d9f33854cfed34a2440fdb2a51492f37` |

现代 JSON 当前实际 status 为 `draft`；文字获批准不等于现代图及完整 edition 已收口。
图17–20的现代 scratch 尚未批准：**本次未查看现代 SVG/PNG/FigureSpec，不填写或声称检查 figureEvidence**。
官方 prepare、finalize、正式答案 JSON、交互、发布均未运行。
只写本稿，不生成新图，不修改源、现代文字、metadata、工具、代码、DB或Git。

实际忠实图观察：

- 图17：平面α内有直线b；平面外的a经过标名点M。短绘图笔画不解释为有界线段或新命名端点。
- 图18：保留α、a、b、M、N，a从M延伸到标为N的位置。这是正文反证假设示意，不能把“a平行b且过平面内N”同时当作可实现的真实空间模型，也不从投影倾斜推断精确空间关系。
- 图19：α、β两面及a、b标签完整；a画在β内，b是两面的交线，源文赋予a与b平行的关系。边界虚线不添加新的数学直线或点。
- 图20：四面体D上、A下、C左、B右；M在AD、N在AB、P在BC、Q在CD，完整截面NMQP及剖面排线、实虚线。仅用题文和明确点归属，不按栅格距离推出中点或长度相等。

本书线平行包括重合，线面平行包括直线包含在平面内。
本稿的“相交”指唯一公共点，包含／重合另行说明。
44将定理2的条件明确为**在平面内存在至少一条与该直线平行的直线**，
不把“任意一条”偷换成“所有不同方向的直线都与它平行”。
使用当前现代定理3的已登记“已知直线”修正，不重审或改动该勘误。

44–52、54–56为本次独立求解；53的完整 worked solution 已在授权题面中给出，
阅读顺序不可能称为盲解。本稿独立核验其点归属、作法、截面与唯一性，并完整保留其各阶段及源注；
没有查看书后答案，不声明 `bookRaw`。后续答案项需诚实注明53的题内既有解来源，而非冒称未见解答。
全部正文均有实质结果／作法；暂拟 ungraded，因为证明、作图与完整位置分类不能由单一公式输入可靠判定。
54虽有确定面积，仍保留第一项作图，不只返回公式。

## 44 — 判定条件也是必要条件

条件“平面α内存在至少一条直线b，使 $a\mathbin{//}b$”是**充分必要条件**。

充分性就是定理2：这样的b在α内，由 $a\mathbin{//}b$ 得到 $a\mathbin{//}\alpha$。

必要性分两种情况。
若 $a\subset\alpha$，可选 $b=a$；本书允许重合直线视为平行。
也可在α内作另一条与a平行的直线。

若 $a\cap\alpha=\varnothing$，在α内取一点P，作由直线a与P确定的平面β。
β与α相交于经过P的直线b。
由定理3，$b\mathbin{//}a$，且 $b\subset\alpha$，
故至少一条这样的平面内直线确实存在。

这里不是说a平行于α内所有直线。
在α内可以选两条不同方向的直线，a不可能同时具有这两种方向；
例如当a本来在α内时，还存在与a相交的平面内直线。

## 45 — 与两个平面均广义平行

记两个平面的交线为 $c=\alpha\cap\beta$。
已知 $a\mathbin{//}c$，而c分别在α、β内，
由定理2得到 $a\mathbin{//}\alpha$、$a\mathbin{//}\beta$。
这两处“平行”都包括包含。

全部细分情况是：

- $a=c$：a同时包含在两个平面内。
- a在α内但不是c：a与β没有公共点。
- a在β内但不是c：a与α没有公共点。
- a不在两个平面中的任何一个内：a与两个平面均没有公共点。

不可能出现与α或β仅交于一点的情况。
若a与其中一个平面有公共点P，平面内经过P的c的平行线就在该平面内，
而它就是a，因此a必完全在该平面内。
若a同时在两面内，它必为c。

## 46 — 中位线与平面的位置

设M、N分别是AC、BC的中点。
三角形的中位线给出 $MN\mathbin{//}AB$。
又因 $AB\subset\alpha$，由定理2得 $(MN)\mathbin{//}\alpha$。

若 $C\in\alpha$，整个三角形在α内，故 $(MN)\subset\alpha$。
若 $C\notin\alpha$，三角形所在平面与α的交线为AB，
而MN与AB是不同的平行直线，所以 $(MN)\cap\alpha=\varnothing$。
因此可能是包含或无公共点，不能仅相交于一点。
不在题面之外假定C一定在α外。

## 47 — 正六边形所在平面相同／不同的两种分支

记正六边形所在平面为γ。
在γ内，CF、DE均与AB平行；
CD、DF均不与AB平行，延长后各与直线AB有一个交点。
这里研究的是直线，不限于它们的有限边或对角线段。

若 $\alpha=\gamma$，四条直线CF、CD、DF、DE都在α内，
按本书定义，它们都与α平行。

若 $\alpha\ne\gamma$，则 $\alpha\cap\gamma=(AB)$，分别有：

1) CF与α没有公共点，与α平行。
2) CD与α相交，交点是 $(CD)\cap(AB)$。
3) DF与α相交，交点是 $(DF)\cap(AB)$。
4) DE与α没有公共点，与α平行。

为独立确定上述平面内关系，令正六边形边长为s，在γ内取
$A=(0,0)$、$B=(s,0)$、$C=(\frac{3s}{2},\frac{\sqrt3s}{2})$、
$D=(s,\sqrt3s)$、$E=(0,\sqrt3s)$、
$F=(-\frac s2,\frac{\sqrt3s}{2})$。
CF、DE均水平；CD与直线AB相交于 $(2s,0)$，
DF与直线AB相交于 $(-2s,0)$。
后两个交点在AB的延长线上，不应因线段不接触而误说直线不相交。
这些是解析推导，不是新图或从像素测量得到的坐标。

## 48 — 不是所有方向都平行；包含分支允许相交

1) **不一定。**
条件 $a\mathbin{//}\alpha$ 只保证α内存在与a平行的一种方向，
不是说a平行于α内的每条直线。
若a在α内，取α内一条与a相交的直线即为反例。
若a在α外且与α无公共点，α内方向不与a平行的直线与a异面，也不平行。

2) **可能，但只发生在a包含于α的分支。**
若 $a\subset\alpha$，在α内选一条与a方向不同的直线，它与a交于一点。
若 $a\cap\alpha=\varnothing$，a不可能与α内任何直线有公共点。
与a重合的平面内直线具有无限多个公共点，不用它冒充“相交于一点”的例子。

## 49 — 任意给定点都可作，保留全部解族

记给定点为P。

1) 已知直线l，先经过P作 $r\mathbin{//}l$。
若 $P\in l$，这里取 $r=l$。
在r外任取一点Q，由r与Q确定平面γ。
因为 $r\subset\gamma$ 且 $l\mathbin{//}r$，所以 $l\mathbin{//}\gamma$。

全部解是**包含直线r的所有平面**，有无穷多个。
若 $P\in l$，它们都包含l。
若 $P\notin l$，其中经过l与P的唯一平面包含l；
其他包含r的平面与l没有公共点。
反过来，任何经过P且与l平行的平面都含经过P、与l同方向的直线r，
所以以上解族没有遗漏。

2) 已知平面α，在α内任取直线b，
经过P作 $r\mathbin{//}b$，则由定理2有 $r\mathbin{//}\alpha$。

若 $P\in\alpha$，全部解是α内经过P的所有直线；
经过P而不在α内的直线仅在P与α相交，不符合平行条件。
若 $P\notin\alpha$，让b遍取α内各种方向，再经过P作对应平行线，
所得全部直线均与α无公共点。
它们就是经过P且方向属于α的全部直线，亦有无穷多个。

两个分题都不要求给定点在直线外或平面外，也不暗加这个条件。

## 50 — 包含a的任意平面都是解

在a外任取一点Q，作由a和Q确定的平面γ。
因为 $a\subset\gamma$ 且 $b\mathbin{//}a$，所以 $b\mathbin{//}\gamma$。
因此**经过a的所有平面**都是所求平面，解有无穷多个。

若 $a=b$，每个这样的平面均包含b。
若a、b是两条不同平行线，则有且仅有一个平面同时包含a、b；
其余经过a的平面都与b没有公共点。
没有把“平行”理解为必须不同，也不擅自添加 $a\ne b$。

## 51 — 大写C为交线，所求平面唯一

题目的大写C是直线 $\alpha\cap\beta$，不是一个点。
在α内经过A作直线 $u\mathbin{//}C$，
在β内经过B作直线 $v\mathbin{//}C$。
两条直线u、v平行且不同，因此确定唯一平面γ。
这个γ经过A、B，又因包含u而与C平行。

u、v不会重合，否则它们同时在α、β内，就应为C，
与 $A,B\notin C$ 矛盾。
同样，A、B自动互异：若相同，该点就属于 $\alpha\cap\beta=C$。

γ实际上与C没有公共点。
若γ包含C，则由C及α内C外的点A得到 $\gamma=\alpha$；
这会使B同时属于α、β，从而落在C上，矛盾。

为说明唯一性，直线AB与C不能平行或相交：
若它们共面，该平面因经过C和A必为α，又将含B，产生同一矛盾。
所以AB与C异面。
任一经过A、B且与C平行的平面都必须包含经过A的C的平行线u，
因此由相交且不同方向的AB和u唯一确定为γ。
不存在需排除的重复点情形或任意平面族。

## 52 — 相交或异面，不可能平行或重合

$a\cap\alpha=M$ 表示a与α只有一个公共点，
所以a的方向不属于α。
$b\mathbin{//}\alpha$ 表示b的方向属于α，包含b在α内的情况。
因此a、b不可能有相同方向，既不能平行，也不能重合。
它们可能相交，也可能异面。

若 $b\subset\alpha$，当 $M\in b$ 时，a与b交于M；
当 $M\notin b$ 时，两线异面。
若 $b\cap\alpha=\varnothing$，两线仍可能在M以外的一点相交，也可能异面。

例如令 $\alpha$ 为 $z=0$，a为z轴：
$b=\{(t,0,0):t\in\mathbb R\}$ 在α内并与a交于M；
$b=\{(t,1,0):t\in\mathbb R\}$ 在α内并与a异面；
$b=\{(t,0,1):t\in\mathbb R\}$ 在α外并与a相交；
$b=\{(t,1,1):t\in\mathbb R\}$ 在α外并与a异面。
四个例子覆盖b的两个平行分支，不假定b必在α外。

## 53 — 完整保留题内Worked Solution并核验

本题原题面已经附有完整解及作图方法说明。
标准答案不以“见题面”或仅给“四边形NMQP”代替完整解。

**分析：**
连接M、N，线段MN是截平面与面ADB的交线段。
因为截平面平行于AC，
它与面ABC、ADC的交线分别平行于AC（定理3）。
所以在这两面内应分别作过N、过M且平行于AC的线段。

**作法：**
1) 在面ABC内经过N作AC的平行线，交BC于P，即
$[NP]\mathbin{//}(AC)$、$P\in[BC]$。
2) 在面ADC内经过M作AC的平行线，交DC于Q，即
$[MQ]\mathbin{//}(AC)$、$Q\in[DC]$。
3) 连接N、M、Q、P、N，得到四边形NMQP。

**证明：**
由 $(MQ)\mathbin{//}(AC)$ 得到平面NMQ与AC平行（定理2）。
该平面经过N，因此也包含经过N且平行于MQ的直线NP，
从而包含P。
四条截面边MN、MQ、QP、PN分别位于面ABD、ADC、BCD、ABC中。
四边形NMQP就是满足题目要求的截面。

**研究：**
M、N均为题目明确给定的内点；
过N作AC的平行线与BC有唯一交点P，
过M作AC的平行线与DC有唯一交点Q。
N、M、P不共线，经过这三点的平面唯一。
因此所求截面有唯一解。

为独立核验而不是照抄题内结果，取A为原点，并以
$B-A$、$C-A$、$D-A$ 作为三个仿射坐标方向。
设 $N=(n,0,0)$、$M=(0,0,m)$，其中 $0<n,m<1$。
经过M、N并平行于AC方向的唯一平面为

$$\frac{x}{n}+\frac{z}{m}=1.$$

与四面体的交的另外两个顶点为
$P=(n,1-n,0)$、$Q=(0,1-m,m)$。
它们分别是BC、CD的内点；
$NP=(1-n)(C-A)$、$MQ=(1-m)(C-A)$，
验证两条构造边均与AC平行。
四个面内的截线围成NMQP；给定严格内点条件下没有额外顶点或退化解。
这些坐标仅作独立数学核验，不来自原图量测，也不修改图。

**源注的完整方法含义：**
分析、作法、证明、研究，是立体几何及平面几何解作图题的一般步骤。
分析是制订作图计划；之后完成作图，再证明所作图形满足题目的全部条件；
最后通过研究说明有多少个不同的解。
但并不是每道题都必须依次完成这四个步骤。
有时可以直接开始作图，有时证明与作图同时进行，
研究也常常省略。
如果题目要求进行研究，应当在条件中说明。

## 54 — 过中线且平行AD的截面与面积

1) 已知CM为面ABC的中线，所以M是AB的中点。
在三角形ABD内经过M作AD的平行线，与BD交于N。
由三角形中位线性质，N是BD的中点，$MN\mathbin{//}AD$。
连接CN、CM，截面为**三角形CMN**。

其三边CM、MN、NC分别是截平面与面ABC、ABD、BCD的交线段；
与面ACD只交于C。
平面CMN含有中线CM，又包含AD的平行线MN，所以与AD平行。
CM与AD的方向不同，给定中线及平行方向确定唯一截平面。
本题不是过AD本身作截面，也不把N误放到AD上。

2) 当四面体各棱长均为 $a>0$ 时，
$MN=\frac a2$。
CM、CN分别为等边三角形ABC、CBD中的中线，
因此 $CM=CN=\frac{\sqrt3}{2}a$。

从C向底边MN作高，其长度为

$$h=\sqrt{\left(\frac{\sqrt3}{2}a\right)^2-\left(\frac a4\right)^2}
=\frac{\sqrt{11}}4a.$$

所以截面面积为

$$S=\frac12\cdot\frac a2\cdot\frac{\sqrt{11}}4a
=\boxed{\frac{\sqrt{11}}{16}a^2}.$$

答案同时保留作图与面积，不只提供第二项。
面积使用与a对应的平方单位；没有运行公式判分检查或填写正式expected。

## 55 — 两平面的交线

在平面ABC内经过A作直线 $r\mathbin{//}(BC)$。
作由相交的AD和r确定的平面γ。
它包含AD，并由定理2与BC平行，正是题目所需的那个平面。
它与平面ABC的交线就是**r，即经过A且平行于BC的整条直线**。

两平面不同，因为D不属于平面ABC。
AD的方向不平行于BC，否则四面体的两条对棱就会共面，
与四面体非退化矛盾。
所以经过AD并具有BC方向的平面唯一，交线也唯一。
本题求的是直线，不是截面边或有限线段。

## 56 — 两棱中点与任意BC内点的完整截面

记AD、CD的中点分别为U、V。
三角形ADC的中位线给出 $UV\mathbin{//}AC$。
在面ABC内经过给定内点P作AC的平行线，与AB交于Q。
连接U、Q、P、V、U，得到截面**四边形UQPV**。

说明：U、V都在面ADC中，P是BC的内点而不在平面ADC内，
所以三点不共线，截平面唯一。
它包含UV，因而平行于AC；又经过P，故包含过P平行于AC的直线PQ，
所以Q也在截平面内。
四条截面边UQ、QP、PV、VU分别属于面ABD、ABC、BCD、ADC。

P不是预设中点。
设 $t=\frac{BP}{BC}$，则 $0<t<1$，
由三角形BCA内平行线的比例关系有
$\frac{BQ}{BA}=t$。
因此Q也是AB的内点，四个截面顶点在整个给定参数范围内都保留，
不会产生空截面、三角形截面或其他分支。

其中两条相对边UV、QP始终平行，
$UV=\frac12 AC$、$QP=t\,AC$。
若P恰为BC中点，即 $t=\frac12$，两条相对边平行且相等，
截面是平行四边形；其余位置无需假定这个特殊形状。
这是对允许点位的说明，不向题面添加P为中点、正四面体或面积请求。

## 完成范围与等待条件

13个源题44–56全部有完整标准结果、理由／作法及每个印刷分题；
53的题内完整解与源注没有省略，54面积为本次自行计算。
44的存在量词、线平行含重合、线面平行含包含，
47的六边形共面分支、49的任意给定点、51的大写交线C均显式保留。

这是作者源解／正文冻结，不是独立数学批准。
等待官方获批准现代图及其真实figureEvidence，之后只补该证据与官方模板JSON；
不把未查看的现代图写成已检查，不为等待而自行prepare/finalize，
也不重新求解已获独立批准的部分。

## 正式模板绑定作者追加记录

日期：2026-11-16。依既有 STEMROBIN-184 工单权限下父方委托，当前获准
**n7 scratch 正式答案候选 authoring**。本节接续上方 pre-prepare 历史记录；
上方冻结正文原样保留，不把当时尚未看现代图的状态改写成已经检查。
本作者不是本候选的独立 Gate2 审阅者，不自行批准、提升或 finalize。
n3 仍等待其最终图，不操作其答案模板。

输出：`.intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n7-answer-draft.json`。
候选 `status=draft`，44–56 共13项，全部 `grading=ungraded`、
`source=derived`、`parts=[]`，没有 `bookRaw`，没有伪造确定性判题键。
`displayAnswer` 复用上述冻结求解，按当前批准现代题面排成可见标准答案；
未变的数学没有重新求解。53继续保留完整分析、作法、证明、研究与方法注，
并在 `notes` 如实说明原题自带 worked solution，不称盲解或书后抄答；
冻结中的额外仿射验算仍留在本报告。54同时保留作图、唯一性理由和
面积 \(\sqrt{11}a^2/16\)，不以仅面积输入键代替整题。

### 当前文字与模板绑定

| 输入/输出 | 实际原字节 SHA-256 |
|---|---|
| 原冻结正文（本追加之前） | `7e9b0db1ff556f88069ed1885ebee1a2420b13dbf9471512373cf3da892ee41a` |
| `.tmp/ld-s10y-answer/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n7/answer-keys.template.json` | `b43d76721a19017517e195dc5133bf5bdb5e5728c1c2b7b2d4023975d29ccb9f` |
| 当前durable现代 `lesson.json` | `3004de8a2a612bc26ce705c99bb112c636c4daee3b4efc66d5e936c950cbe1c9` |
| 当前durable现代 `exercises.json` | `4348d791c5b8931a7ed25d5a96cce2c7e6af5f20fa0cfed8f4b6085793ffd386` |
| 本次候选 `geo910-c1-s1-n7-answer-draft.json` | `b6350897395dd4c908e03a813151a56703f54e686872622c70e8220fa8613a8a` |

当前现代lesson/exercises实际均为 `ready`。官方模板由父方prepare一次产生，
本作者只读取，不重复prepare。模板13项 `prompt` 与当前13道现代题面逐值相同；
候选保留全部模板 `prompt`、`figureEvidence`、`source`、`parts`、
`historical_entities` 及各标识值。相对模板仅写入各项
`grading`、`displayAnswer`，并对53/54加入上述诚实的来源/整题判分说明 `notes`。
44保留“至少一条”的存在量词；47保留六边形平面重合分支；
49不要求给定点在已知对象之外；50保留重合线；
51的大写C仍为交线；52包含b在平面内和在平面外两分支；
56没有将BC内点P改成中点。

### 当前图证据的实际查看及复用

模板只有53带图证据：`fig-20` 的忠实PNG、durable现代SVG及FigureSpec，
候选对这三个路径逐值保留。17–19是正文图，不向其他答案擅自新增
exercise figureEvidence。

本次先核对四张忠实PNG当前哈希，全部等于上方已实际打开的原图观察绑定，
所以未重开旧原图。随后实际读当前durable四份spec、SVG，
并分别打开下列指定snapshot中640、346、240宽的12张完整预览：

- 图17：`.tmp/s10y-image/9-10g/fig-17/repair/`。
- 图18：`.tmp/s10y-image/9-10g/fig-18/initial/`。
- 图19：`.tmp/s10y-image/9-10g/fig-19/repair/`。
- 图20：`.tmp/s10y-image/9-10g/fig-20/initial/`。

每张图的spec/SVG均已原字节比对，与对应durable提升文件完全相同。
没有查看旧initial图17/19，没有重新渲染、截图或启动浏览器。
SVG19/20第一次终端单行输出发生截断；随后使用标准XML解析器完整抽取
其实际命名绘制元素与标签，未把截断内容称为已读完。

实际观察与本次答案的关系：

- 17的α、a、b、M完整，M在a上且示意于平面外，b在平面内；
  不从有限画笔长度添加端点。
- 18的α、a、b、M、N完整。spec明确它是反证中被否定的假设图，
  不是实现“a平行b又通过平面内N”的真实空间模型，不能把示意投影当额外数学已知。
- 19的α、β、a、b及完整实/虚边界可见；a在β内，b是两面的共同线，
  文字给出a与b平行，不添加垂直关系或额外命名交点。
- 20的A、B、C、D、M、N、P、Q八个标注和六条四面体边完整，
  M∈AD、N∈AB、P∈BC、Q∈DC，截面顺序N–M–Q–P–N；
  BC、NP为虚线，截面排线完整。spec中的相应点归属及平行断言对应上述冻结解。
  投影AD与截面笔画的交叉不增添空间交点；
  图中布局比例不把给定M/N改成中点。
  640、346、240完整预览中上述标签均可辨，没有裁掉四面体端点或截面边。

| 图 | durable spec SHA-256 | durable SVG SHA-256 |
|---|---|---|
|17|`c600734f63f2b292b4d8d3d99a0626b00a9361617d0b3691fdb5f94993e51b51`|`64592b506fbdca07f3f5439f081d31c09d7fb738d0a870fae6a5cbf62bb664c0`|
|18|`61ae8c4cfc0dd759937a5ed20907047bee6d3115314c85188cd071a41cc0d09b`|`d9e086619150971f8a7da069b796f954c68cdca36b31b655c06b93ba9010e2fc`|
|19|`afa227c32e03d6dd43b77b7bdc2faecc53f4c2f7bf17e689aff7f1adaeab6c2b`|`ea4423fa1f9ff308cccd91ac9aa2187635904f32125fa14095adff16e3264433`|
|20|`edd0060c1e3a0a9daf32c0f528da716085a8120cc501a0c81dc1e0d39df6f95c`|`2845341e9a1e9e2b68f9a3a301c125261377ba0a8930accaaab4996572a5e596`|

以下均为这次实际打开的**既有**PNG原字节哈希；不是新生成的显示证据。

| 图/指定snapshot | 640 SHA-256 | 346 SHA-256 | 240 SHA-256 |
|---|---|---|---|
|17/repair|`1af9dd27c2786a0c1c849de4ff1bca0b988e9377f978fb677306c152ccef6b8e`|`9683f521280ace4312751f6bcda627bb54b457aec45785f08e7dad1820abbfdf`|`7156e2cad29e23682e5edecb42a90fafd8da0b48ebc3fb4982725f69e580dc1d`|
|18/initial|`7a627e491138f4d4ae22f629e21ca754f7de83cb2f89842d1a2f6a191fe7d8ec`|`3009045318e21949cafebe3b48d61e0bbb8357f021204a12a34479709d8c08a0`|`126ff7a7e307d2f465280e1bb4738e42f772c7a0b18b927e697c3340a3ebc953`|
|19/repair|`113e59c255eb184fb3b3371328ccb90d6acc6d4c44c371e23a2a143109e64bf8`|`8193c22ebf2f57b49da5f6b334c867dbd4887778c5eee39c5579d34720ab6195`|`06a57fd103f28ffcbbeb971358e46e651bc3f945946b7325ae68a4c87a8758f9`|
|20/initial|`8f4e8f0dc50d00113cdf419dd30c9711b59c2a3924db97e0116e8fe6ade6c9d5`|`d08f5986a699c7f99a87072a20f020b33178deb0a9e3291d2b196b3119e5838d`|`4ce270e480678daaa4787466982cc9d98905b84aff96b45e3901912de375d7b3`|

已读的既有 `preview.json` 中spec/SVG及输出哈希与当前文件相符；
记录的标签最终字号在240/346/640宽分别为18/25.95/48px，
标签矩形均在画布内，`pageErrors=[]`。
这是复用既有测量，不声称本作者重新执行了字号测量或产品显示验证。
这些preview记录仍写着生成时的 `independentReview=pending`，
因此不以该历史字段冒充批准；当前批准状态来自父方的明确交接。
本作者不重跑父方已通过的现代finalize/render。

### 本次只读作者检查与交接边界

一次只读候选序列化/绑定检查 exit0：
`AUTHOR_SERIALIZATION_BINDING_PASS 13 answers, 13 ungraded, auto=0`。
检查实际JSON可解析、源号44–56顺序一一对应、展示答案非空、
模板不变字段相等、当前lesson/exercises及模板哈希不漂移。
53的原PNG哈希等于spec source.image，且spec authoritativeText
逐值等于当前现代53题面。未发现本次模板绑定或图证据不一致。

上述是作者机械检查，不是新的非作者数学审批或Gate2 PASS。
本次没有运行答案prepare/finalize、测试、交互、发布、网络服务或DB，
没有改动helper、源、现代正文、图、依赖或Git。
唯一变更为本scratch候选JSON与本报告尾部。
交父方进行候选JSON及figure/sourcebinding的独立比较，再决定提升/finalize。
