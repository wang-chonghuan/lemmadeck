# B88 Power Independent ANSWER SOURCE Solutions

2026-11-19. STEMROBIN-180, SAME invocation `180-3`.
Every shell workdir: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

**12/12 original questions independently solved before any author disclosure or
modern answer comparison:** five conceptual solutions, four derived calculations
and three investigation procedures with explicit unmeasured-data boundaries.
This is SOURCE-solution evidence only, not modern answer authoring, an answer
review, gate approval, prepare, finalization or publication.

## Inputs And Conventions

Read only the raw `phy6-c5-s2` lesson JSON/Markdown and original exercises for
this solve. Existing full raw/TEXT PASS is reused, not rerun. The answer skill and
gate-2 source/derivation contract were already read in this session; the bounded
source-only request overrides their usual modern-author/publication flow.
No previous power SOURCE author/main answers, modern draft, choice key or book
answer content was inspected. Chapter worked examples were read as conventions,
not exercise keys. No new source capture or book-answer omission is claimed.

Raw root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c5-s2`.

| Input | Actual bytes | Actual SHA-256 |
| --- | ---: | --- |
| `lesson.json` | 8547 | `37502e7d831e2b2b000d3dd46870d7a6c710f0d85bfed99f62ef8111a2906645` |
| `lesson.md` | 3119 | `0845ce7a7276214e42e16c489c8d41f745ce333c2c1fd9664391ab748e1c2b75` |
| `exercises.json` | 5561 | `06be8b601117bbca2295106bb72e5957445e64720af275b5911d0c02ab83b67c` |

All 12 exercise `figure_refs` and `figures` arrays are empty. The chapter's
unrelated engine table was not opened; Markdown image links remained text.
**Images 0.** The immutable source freeze records exact original question text,
identities, hashes and references, including the inherited split emphasis.

Source conventions: `p0186#8` uses $N=A/t$; this report writes power as $P$
to distinguish a physical quantity from the unit symbol N for newtons.
For a positive finite interval, $\bar P=\Delta A/\Delta t$ is **average** power.
Instantaneous power is $P(t)=dA/dt$ where that rate exists. Constant power equals
its interval average; interval totals alone do not determine instantaneous power.

`p0187#2` declares $1$ textbook horsepower $=736\ \mathrm W$.
Use that source convention, not a universal conversion for every kind of
horsepower. `p0187#8` declares $g=9.8\ \mathrm{N/kg}=9.8\ \mathrm{m/s^2}$.
No exercise declares another $g$, so both gravity calculations use exactly
$9.8=98/10$. The worked example's rounded intermediate force is not a reason
to silently substitute $g=10$ in these questions. No raw example was repaired.

## Solution 01

**Identity:** `g1/1`, internal `1`, source number `1`, `p0188#10`.
**Original:** `（1）功率所表示的是什么？`

**独立解答：** 功率表示做功的快慢，即做功的速率。完成同样的功，所用时间
越短，平均功率越大；在同样长的时间内，做的功越多，平均功率越大。
一段时间的平均功率与某一瞬间的功率要区分，不能把功率理解成物体移动的速度，
也不能只由总功的大小比较功率。

## Solution 02

**Identity:** `g1/2`, internal `2`, source number `2`, `p0188#11`.
**Original:** `（2）已知功和时间，怎样计算功率？`

**独立解答：** 将这段时间内做的功除以完成该功的时间：
$\bar P=A/t$，其中 $t>0$。功用焦耳、时间用秒，得到的功率为瓦特。
这是该时间段的平均功率；只有在功率恒定时，它也等于各瞬间的功率。
如果要知道变化过程中的瞬时功率，仅有总功和总时间不够，还需做功随时间的变化。

## Solution 03

**Identity:** `g1/3`, internal `3`, source number `3`, `p0188#12`.
**Original:** `（3）功率的单位是什么？`

**独立解答：** 功率的国际单位制单位是瓦特，简称瓦，符号 $\mathrm W$；
$1\ \mathrm W=1\ \mathrm{J/s}$，表示每秒做 $1$ 焦耳功的功率。
$\mathrm{W\,s}$ 是能量单位，相当于焦耳，不是另一个功率单位。

## Solution 04

**Identity:** `g1/4`, internal `4`, source number `4`, `p0188#13`.
**Original:** `（4）在工程技术中常用的功率单位是什么？`

**独立解答：** 本课文列出的常用单位有千瓦、兆瓦和马力：
$1\ \mathrm{kW}=1000\ \mathrm W$，
$1\ \mathrm{MW}=1000000\ \mathrm W$；
按本教材的换算约定，$1$ 马力 $=736\ \mathrm W$。
实际设备资料中的马力须确认其定义和原单位，不能把教材的约定自动套到所有资料上。
千瓦和兆瓦是功率单位，千焦和兆焦是能量单位，二者不能混用。

## Solution 05

**Identity:** `g1/5`, internal `5`, source number `5`, `p0188#14`.
**Original:** `（5）已知发动机的功率及其工作的时间，怎样计算发动机所做的功？`

**独立解答：** 若发动机以给定的恒定功率 $P$ 工作，或给定的功率就是
该时间段的平均功率，则 $A=Pt$。功率用瓦、时间用秒，功的单位为焦耳。
若实际功率随时间变化，应把各时间段的功相加；用连续表达式就是
$A=\int P(t)\,dt$。不能把铭牌额定功率或某一瞬间功率直接当成任意运行时间
的实际平均功率；计算实际所做的功需要相应的运行条件。

## Solution 06

**Identity:** `g2/1`, internal `g2-1`, source number `1`, `p0189#2`.
**Original:** `**（1）水从22 米高的坝顶上落下，每10 分钟内落下500 吨. 问落****下的水的功率是多少？**`

**独立计算：** $m=500\times1000=500000\ \mathrm{kg}$，
$h=22\ \mathrm m$，$t=10\times60=600\ \mathrm s$。
按重力势能变化计算这批水下降时重力所做的功：

$$
A=mgh=500000\times9.8\times22=107800000\ \mathrm J,
\qquad
\bar P=\frac{A}{600}
=\frac{539000}{3}\ \mathrm W
=\frac{539}{3}\ \mathrm{kW}
\approx179.667\ \mathrm{kW}.
$$

因此该区间的平均重力功率约为 $180\ \mathrm{kW}$。
每十分钟的质量总量不能给出区间内每一瞬间的流量或功率。
此结果是下降水流的重力功率，不是未经效率换算的水轮机或发电机电功率。
未另取 $g=10$，也没有虚构效率或实际流量记录。

## Solution 07

**Identity:** `g2/2`, internal `g2-2`, source number `2`, `p0189#3`.
**Original:** `**（2）若行路的人在2 小时内走了10000 步，而每走一步要做40 焦****耳的功，试求人的功率.**`

**独立计算：** 按题给每步的功相加：
$A=10000\times40=400000\ \mathrm J$，
$t=2\times3600=7200\ \mathrm s$。

$$
\bar P=\frac{400000}{7200}
=\frac{500}{9}\ \mathrm W
\approx55.556\ \mathrm W.
$$

即这两小时内按题给做功模型计算的平均功率约为 $55.6\ \mathrm W$。
这不是每一步每个瞬间都相同的功率，也不是由题面测得的全部人体代谢功率。
题目已给每步做功，不需额外猜测步长、体重或效率。

## Solution 08

**Identity:** `g2/3`, internal `g2-3`, source number `3`, `p0189#4`.
**Original:** `**（3）功率为100 千瓦的发动机在20 分钟内能做多少功？**`

**独立计算：** $P=100000\ \mathrm W$，
$t=20\times60=1200\ \mathrm s$，故

$$
A=Pt=100000\times1200=120000000\ \mathrm J=120\ \mathrm{MJ}.
$$

这是以 $100\ \mathrm{kW}$ 持续工作，或该区间平均功率为 $100\ \mathrm{kW}$
时所做的功。若仅知道铭牌额定功率，而实际负载和功率未知，就不能据此认定
真实运行二十分钟必定做这么多功。不要把 $120\ \mathrm{MJ}$ 写成功率单位。

## Solution 09

**Identity:** `g2/4`, internal `g2-4`, source number `4`, `p0189#5`.
**Original:** `**（4）传送带在1 小时内把30 米$^3$的沙子输送到6 米高处. 试求为****完成这一工作传送带发动机所需的功率. 沙子的密度是1500 千克/****米$^3$.**`

**独立计算：** $m=\rho V=1500\times30=45000\ \mathrm{kg}$，
$h=6\ \mathrm m$，$t=3600\ \mathrm s$。
忽略损耗、只计这批沙子的重力势能增加，且不计净动能变化：

$$
A_{\mathrm{useful}}=mgh
=45000\times9.8\times6=2646000\ \mathrm J,
\qquad
\bar P_{\mathrm{useful}}=\frac{2646000}{3600}
=735\ \mathrm W=0.735\ \mathrm{kW}.
$$

所以教材理想提升模型要求的平均有用功率为 $735\ \mathrm W$。
它不是已知的实际电动机输入功率或安装额定功率。传送带自身的运动、摩擦、
传动及电动机损耗等需要另计。若把从选定输入端到沙子提升的总效率定义为
$\eta$，相同时间段有
$\bar P_{\mathrm{input}}=735/\eta\ \mathrm W$；
但题面未给 $\eta$ 或损耗，不能得到唯一的实际输入值。
轴端输出功率和电功率还属于不同的能量边界，不能不加区分地互称。
区间平均提升功率也不能确定启动或间歇输送的峰值功率、从而完成真实电机选型。

## Solution 10

**Identity:** `g3/1`, internal `g3-1`, source number `1`, `p0189#7`.
**Original:** `**（1）试分别计算出你缓慢地及快速地从学校教室楼的一层上到二****层或三层时的功率. 所需的全部数据由你自己设法取得.**`

**独立方案和结果形式：** 实际测得上楼者的质量 $m$、同一起终点的总竖直高度差
$H$、慢速用时 $t_{\mathrm{slow}}$ 和快速用时 $t_{\mathrm{fast}}$。
高度是全部楼梯的竖直升高量，不是沿楼梯走过的路程；可用实际台阶数乘每级
高度等测量方法取得。若计算中包含携带物品，应明确计入相应被提升的质量。
在安全、获准的条件下进行，由他人帮助计时，不为取得数据冒险。

在起终点速度变化可忽略、只计重力势能增加的模型中：

$$
\bar P_{\mathrm{slow}}=\frac{mgH}{t_{\mathrm{slow}}},
\qquad
\bar P_{\mathrm{fast}}=\frac{mgH}{t_{\mathrm{fast}}}.
$$

对同一质量和高度，若实测 $t_{\mathrm{fast}}<t_{\mathrm{slow}}$，则
$\bar P_{\mathrm{fast}}>\bar P_{\mathrm{slow}}$；
两次有用功相同，都为 $mgH$。用实际测量数据及单位分别代入，报告每次测量
和计算结果；不能代入编造的体重、楼高或时间。
所得是克服重力的平均有用机械功率，不是全部人体代谢功率。
本次没有进行上楼实验，具体两项实测功率尚不可报出；这不是漏掉题目。

## Solution 11

**Identity:** `g3/2`, internal `g3-2`, source number `2`, `p0189#8`.
**Original:** `**（2）试根据铭牌查明学校车间中各台车床及钻床上的电动机的功****率是多少.**`

**独立方案和结果形式：** 在获准并有教师指导的条件下，逐台辨认学校实际
车床和钻床，读取各电动机铭牌，记录设备与电动机的身份、型号、功率数值、
单位以及该功率的铭牌含义。若有多个电动机，分别记录，避免把一个电机的数据
当成整台机床或另一台设备的数据。

铭牌列千瓦时可用 $P(\mathrm W)=1000P(\mathrm{kW})$ 换算；
应保留原始单位和读数，并说明是否为额定轴端输出或其他已标明的功率。
铭牌额定功率不等于每一时刻的实际消耗或输出；只有电压、电流等数据而没有
足够的功率因数、效率及供电信息时，不能直接推定电机输出功率。
看不清或未标明的数据应如实记为未确认，不编造数值。

本次未接触学校设备或铭牌，没有可声明的真实设备清单或功率观测值。
完整结果须来自实际逐台调查，而不是教材的无关发动机功率表。

## Solution 12

**Identity:** `g3/3`, internal `g3-3`, source number `3`, `p0189#9`.
**Original:** `**（3）查明你所知道的或见到过的各种型号的汽车及拖拉机发动机****的功率各是多少.**`

**独立方案和结果形式：** 先确定实际调查到的汽车和拖拉机的型号、发动机版本
及必要的年份等身份信息，再查对应发动机铭牌、使用说明书或生产者资料。
逐项记录准确型号、功率数值、原单位、数据来源和标明的测试/额定条件；
不同发动机配置的同名车型不能互相代替。

需要比较时换成一致的功率单位。资料为千瓦时乘 $1000$ 得瓦；
资料为马力时先确认其定义和换算依据，不未经确认一概套用本教材的
$736\ \mathrm{W/马力}$。应区别发动机额定或最大功率、实际运行功率以及车轮端
可用功率，不能把不同意义的数据当成同一个量。

本次没有进行实车调查或外部资料查证，因此不列出虚构车型、铭牌或功率。
这是一道要求学习者取得真实资料的调查题，不存在由题面给定的唯一数值清单。

## Coverage And Immutable Stop

Actual coverage: **12/12** in original order and identity: `g1/1..5`,
`g2/1..4`, `g3/1..3`. The four numerical results are independently derived above;
all three investigations include what to collect, how to interpret it and why
actual observations cannot be invented. No original question or required
quantity was skipped; no answer candidate was inspected.

The initial read-only arithmetic observation exited 1 because strict floating-point
comparison produced `735.0000000000001` rather than `735`. Its tool output `e209f0`
is preserved. The failed observation alone resumed with exact integer fractions
using $g=98/10$ and succeeded as `0928a8`. No source, scientific solution,
candidate or completed review/production stage changed or repeated.

Only this report and `T/tmp/b88-power-source-solve/{source-freeze,receipt}.json`
are written; all three new outputs are set to **0444**. The receipt seals report,
manifest, individual solution sections and actual source hashes before any author
disclosure. Existing n43 freeze, receipt and source-solution report retain their
exact hashes and remain untouched. Raw and TEXT PASS are inherited, not renewed.

No images, paid calls, DB, code, Git, other-chat action, SOURCE repair/rereview,
modern authoring, prepare, parser, review, finalization, publish or new fetch ran.
No actual learner investigation was performed or fabricated.

**STOP at immutable original SOURCE solutions. Retain this exact freeze for a
later FINAL request; no modern candidate comparison or downstream approval now.**
