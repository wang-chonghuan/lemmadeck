# ana9-c1-s1-n2 choice review Stage2 freeze

## Boundary and snapshot

2026-11-15，独立 reviewer。Stage1既有独立解先核对冻结哈希；本阶段唯一新输入为父方授权的 learner-facing views。未读取draft、intent、key、作者标准答案或任何旧选择题/答案。先记录view的任务保真、冗余与泄漏观察，再列独立完整真集合及全部28项数学判断。**Stage2冻结；Stage3未授权。**

- Source Stage1: `.intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-s1-n2-choice-stage1.md`，SHA256 `88426463e40a7cd3a1616f8e2307321a0e9b68bad8101c9f3bb6738488f464a6`，未改变。
- Seed: `.intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-s1-n2-choice-seed.json`，byte SHA256 `eb6df6d284995aaa540cb1cded7b89fd9625e47ac8372cb7a25eeb7e66782024`；canonical SHA256 `76fa1d9151c016c5f57b8a2791530e05d412997f2c67930257cc3e616654ba8c`。
- Views: `.intentfold/tickets/STEMROBIN-184/tmp/ana9-c1-s1-n2-choice-views.json`，byte SHA256 `abe9458d5b65274eedcafba9e4743d1f68cee42dfc928d5ceaebcff29ed8bef8`；canonical SHA256 `f8312ecf59f76a30c2f50b8cdc7955cac1f6228a43eb52d42db0eeab2687478b`。
- 7题×4项=28项；q1/q4/q5/q7为multiple，q2/q3/q6为single。全部view和option figure_ids=[]；未见引用图，不需要浏览器。
- 作者key仍不可见。下方“有效/无效”判断针对能否构成题干所要求的完整推导，不等同于判断选项最后那个真实源命题本身是真是假。
- 父方说明seed旧trace的book hash最后由官方prepare重绑，源文字、defs及三份课程输入hash未变。本阶段保留旧seed绑定，不打开trace文件、不改seed、不重复解源题。最终review的新鲜度与draft/key绑定留给授权Stage3。

## Stage2 disposition

**REVISE：q1和q5存在可验证的非数学措辞线索；独立数学可完全判定，无数学输入阻塞。** 这是view-level结论，不是作者key一致性或最终 `s10y-choice-review-v1` 的PASS。

| Question | Reviewer-derived source mapping | Task fidelity | Redundancy | Answer leakage | Independently valid complete arguments |
| --- | --- | --- | --- | --- | --- |
| q1 | source3，两项和式归纳 | pass | pass | **revise** | {b,d} |
| q2 | source4，等差通项与和式同时归纳 | pass | pass | pass | {c} |
| q3 | source5，等比通项与和式 | pass | pass | pass | {d} |
| q4 | source6，有限裂项和 | pass | pass | pass | {a,c} |
| q5 | source7，两项乘积和式归纳 | pass | pass | **revise** | {b,c} |
| q6 | source8，n^3+11n可被6整除 | pass | pass | pass | {a} |
| q7 | source9，7^n-1可被6整除 | pass | pass | pass | {b,d} |

上述映射从可见题面数学内容独立认出，未读取内部coverage。7个源题的11项数学关系均有可见对应内容，尚不能核验作者是否诚实登记生成能力损失。

## View-first semantic findings

### q1

- 忠实：正整数域、整数和与平方和两个对象及两目标等式与source3一致。判断基步和新增项的幂/指标是源归纳证明的关键，不是只复制一个已给的公式。
- 冗余：a/d处理F，b/c处理G，虽然成对比较递推，分别对应两个必须保留的小问；没有多余同义作答单元。
- **泄漏revise：** b、d末句含“基础项…递推步骤”；a、c末句仅说“由这个递推步骤…成立”。四项第一句其实都已经给出成立的基础项。仅用“末句含基础项”这一不检查任何公式的规则，就得到恰好的完整有效集合{b,d}；它不是基步真假的数学区分。

### q2

- 忠实：必须同时证明a_n与S_n，公差d不添加正数/整数限制，S_n明确为前n项和。
- 冗余：a的新项错误、b的循环论证、d的有限样例外推，与c的合法同步归纳分别检验不同的逻辑关系，不是重复点击同一个结果。
- 泄漏：题干所给目标公式原seed本就给出；c与b均呈现正确目标式，必须辨别“从k推出k+1”和“直接假设k+1”。没有从已显示的数值或另一题得到唯一选择的非数学规则。

### q3

- 忠实：保留公比q、q≠1、通项n-1指数与部分和n指数两个任务；不引入无关条件。
- 冗余：把公比当加数、把部分和整体乘q、把部分和当末项是三种不同错误关系；不只是重复同一错误结果。
- 泄漏：基值、目标式以及末项的写法不足以直接决定有效性，必须判断递推是乘公比以及是否加入b_{k+1}。首句有表达偏斜，但本报告未仅凭一项的不同表述自动判泄漏；明确的问题仍是三个数学步骤，而不是词语附带标记。

### q4

- 忠实：source6只要求求有限和，没有要求只准归纳法；裂项相消与归纳都应接受。
- 冗余：a与c虽得相同值，推导分别依赖相消边界和归纳新项，multiple检查两种独立合法论证；相同结果不使两种推导自动成为冗余。
- 泄漏：stem未显示和的值，需识别相消符号、末端n+1以及新项(k+1)(k+2)。正确方法得相同值本身是数学一致性，不等同于泄露作者key。

### q5

- 忠实：P、Q两乘积和及各自正整数域/目标式完整保留，对应source7两个归纳任务。
- 冗余：两个源和式须分别考虑，错误项对新项不同因子的错位是实质差别；与q1同为归纳识别但不是可静默删去的源覆盖。
- **泄漏revise：** b、c末句都写“这给出了…基础项与递推证明”；a、d末句只写“由这个递推步骤…归纳成立”。四项仍均给出有效基值。重复q1的“末句含基础项”措辞规则，不用判断新项或展开，就完整取得{b,c}。

### q6

- 忠实：保留对全部正整数的6整除命题，而不将原任务降为只证明偶数。
- 冗余：仅证因子2、有限样例、只覆盖偶指标的递推都是独立的证明缺口；识别全称k的有效步骤是学习任务。
- 泄漏：a与d都给出同一个正确差式；需辨别是否覆盖所有k及缺失的基础桥接。不能仅凭差式复制答案，也没有显式key标签。

### q7

- 忠实：原source9写“证明”，没有强制只使用归纳法；整数因式分解和合法归纳都完整证明相同命题，故b与d都有效。
- 冗余：b的因式分解与d的递推体现不同推理；a/c是不同指数运算错法。不是重复要求选择相同数字。
- 泄漏：7、6及给定目标皆来自源题；需检验等号链与整数因子，不能把所有含6的表达式都当有效。

### Shared wording defect and minimal repair boundary

q1、q5跨题采用完全相同的措辞编码：有效项末句点名“基础项”，无效项末句不点名，但所有项实际都有基础项。数学关系尚未验证的学习者可按此规则完整答对这两题。

最小修订前提：中和这两题的结语措辞，使有效与无效项不再由“基础项”是否出现区分；数学内容、基值、任务和真假判断不需改动。报告仅指出缺陷，不改views、不猜作者key、不自动修复。改变后仅复核受影响view与跨题线索。

## Independent mathematics: all 28 options

### q1 — complete true set {b,d}

| Option | Complete argument valid? | Independent evidence |
| --- | --- | --- |
| a | no | F_{k+1}新增的是k+1，不是k。k=1时真实F_2=3，选项F_1+1=2；k(k+3)/2虽正确等于F_k+k，却不是下一和 |
| b | yes | 基值G_1=1；G_k+(k+1)^2=(k+1)[k(2k+1)+6(k+1)]/6=(k+1)(k+2)(2k+3)/6，正是k+1目标 |
| c | no | 平方和应加(k+1)^2。k=1时真实G_2=5，但G_1+2=3；所列表达式对应错误新增项，不完成归纳 |
| d | yes | 基值F_1=1；F_k+(k+1)=[k(k+1)+2(k+1)]/2=(k+1)(k+2)/2，基步及任意k步骤完整 |

### q2 — complete true set {c}

| Option | Complete argument valid? | Independent evidence |
| --- | --- | --- |
| a | no | 通项递推正确，和式却再加a_k而非a_{k+1}；给出的和比目标少d。a_1=1,d=1,k=1时真实S_2=3，所列S_1+a_1=2。d=0偶然无差不能证明任意公差 |
| b | no | 在应从k推出k+1的步骤中先假设两个k+1目标式，代回只得到同义等式；未由k的归纳假设导出，循环论证 |
| c | yes | a_{k+1}=a_1+kd；S_k+a_{k+1}=k[2a_1+(k-1)d]/2+a_1+kd=(k+1)(2a_1+kd)/2。两基值及两推进完整 |
| d | no | a_1到a_3、S_1到S_3的列值均正确；“所以全部n”缺少任意k的递推或其他一般推导。不是源公式为假，而是有限核验不是完整证明 |

### q3 — complete true set {d}

| Option | Complete argument valid? | Independent evidence |
| --- | --- | --- |
| a | no | 公比需乘q，不能加q。b_1=1,q=2,k=1时实际b_2=2，选项给3；实际S_2=3，选项S_1+b_1+q=4 |
| b | no | 通项正确；qS_k=b_2+...+b_{k+1}=S_{k+1}-b_1。b_1=1,q=2,k=1时qS_1=2，而S_2=3；式中q^{k+1}-q缺少基项修补 |
| c | no | (q^k-1)/(q-1)不一般等于q^{k-1}。q=2,k=2时分别3和2；部分和不是末项。后续乘q不能恢复缺少的项 |
| d | yes | 首项/首项和成立；b_{k+1}=qb_k=b_1q^k；S_k+b_1q^k=b_1[q^k-1+q^k(q-1)]/(q-1)=b_1(q^{k+1}-1)/(q-1)，q≠1保障分母合法 |

### q4 — complete true set {a,c}

| Option | Complete argument valid? | Independent evidence |
| --- | --- | --- |
| a | yes | 1/j-1/(j+1)=1/[j(j+1)]；相消后仅1与-1/(n+1)保留，得n/(n+1)，包含n=1 |
| b | no | 加号裂项等于(2j+1)/[j(j+1)]而非原项。j=1时原项1/2，错误裂项3/2；n=1空和处理仍给3/2，不能救原等式 |
| c | yes | T_1=1/2；T_k+1/[(k+1)(k+2)]=[k(k+2)+1]/[(k+1)(k+2)]=(k+1)/(k+2)，完整归纳 |
| d | no | 新项应为1/[(k+1)(k+2)]，不是1/[k(k+1)]。k=1时真实T_2=2/3，选项给1；其分式只是错误重加末项的和 |

### q5 — complete true set {b,c}

| Option | Complete argument valid? | Independent evidence |
| --- | --- | --- |
| a | no | P的新项是(k+1)(k+2)。k=1时P_2=8，选项P_1+1×2=4；给出的k(k+1)(k+5)/3是重加旧末项，不是目标 |
| b | yes | Q_1=4；新项(k+1)[3(k+1)+1]=(k+1)(3k+4)，加k(k+1)^2得(k+1)(k+2)^2 |
| c | yes | P_1=2；P_k+(k+1)(k+2)=(k+1)(k+2)(k+3)/3，基步与任意k步骤完整 |
| d | no | 第二因子必须3(k+1)+1=3k+4，不是3k+1。k=1时真实Q_2=18，选项给12；少了3(k+1) |

### q6 — complete true set {a}

| Option | Complete argument valid? | Independent evidence |
| --- | --- | --- |
| a | yes | R_1=12；R_{k+1}-R_k=3k(k+1)+12。任意相邻整数乘积为偶数，乘3后是6倍数，故任意k的步骤成立 |
| b | no | 奇偶论述正确，只证因子2；“2整除⇒6整除”不成立，例如4是2倍数而非6倍数。源R_n本身仍总为6倍数，此处不得偷补尚未证明的因子3 |
| c | no | 12、30、60、108四个值都正确；未给一般递推或因式论证，四次核验不能证明全称命题 |
| d | no | 所列差式及偶k条件下可整除均正确，但归纳步骤仅覆盖偶k。基点k=1为奇，连1→2也未证明，后续所有奇→偶步骤同样缺失；不能将真实但受限的步骤当完整证明 |

### q7 — complete true set {b,d}

| Option | Complete argument valid? | Independent evidence |
| --- | --- | --- |
| a | no | V_{k+1}=7V_k+6，不是V_k+6。k=1时V_2=48，错误递推给12；V_n=6n也因此为假 |
| b | yes | 7^n-1=(7-1)sum(j=0..n-1)7^j，有限和为整数且外因子6；对全部正整数有效，源题未排除直接因式证明 |
| c | no | 幂不对差分配。n=2时7^2-1=48，(7-1)^2=36；由错误等式得到6因子不是原量的证明 |
| d | yes | V_1=6；V_{k+1}=7(7^k-1)+6=7V_k+6，若6整除V_k则6整除下一项，完整归纳 |

## Whole-package observations and pending Stage3

- 28项均逐项判断，完整有效集合共11项、无效论证17项。single题各一个有效论证，multiple题各两个，没有选项域内真假不可判定问题。
- q2/q3同时要求通项和部分和，保留原两任务；q1/q5保留两小问；q4/q7以两种合法方法作同一任务的multiple比较。没有把一个结果的等价写法误当不同源任务。
- 可见能力损失：从独立书写/组织归纳证明改为辨认已给完整证明；多项代数因式分解也在选项中已给出，不测试自行展开。关键新项、逻辑结构、全称范围仍要判断，所以没有仅因“识别而非生成”自动判保真失败。Stage3必须检查作者是否诚实登记这些limitations；目前未读取内部声明，不能声称已核验。
- 不因题干或另一题显示相同源恒等式自动判泄漏：原seed本就给出这些目标；q4/q7完整方法是否成立仍需数学判断。真正需要改的是q1/q5跨题重复的非数学结语编码。
- 本文件的独立集合不是读取作者key后的结果；不得据此改作者key或标准答案。作者数学/派生误区/coverage/draft digest一致性均等待Stage3授权。
- 保留本次REVISE理由和快照；父方交回修订view时只复核改变的题与受影响跨题线索，不重解冻结源任务。
