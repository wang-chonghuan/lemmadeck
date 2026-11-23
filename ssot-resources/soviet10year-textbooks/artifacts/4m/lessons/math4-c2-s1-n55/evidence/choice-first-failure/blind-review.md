# N55 选择题盲审冻结

日期：2026-11-23。
唯一根：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`。
课：`math4-c2-s1-n55`，55《小数的数位》。

## 盲审边界与顺序

先读当前choice技能的review.md与contract.md，以及官方seed.json、仅含source_numbers/view的views.json。原题独立解引用本审者在候选披露前冻结的 `evidence/independent-solutions.md`；没有从作者解或选项反推源数字。

先评可见题的task fidelity、redundancy、leakage及逐源实质覆盖，再独立求各view的完整true set，逐项检查全部41个选项。没有读draft.json、作者key/intent、作者解或answer-keys；没有读取内部coverage或误区推导。下面的选项证据是独立计算，不冒充已核作者rationales。

新增图片0，累计仍 **17/24**。图213及214修稿复用已有源inventory、单次预览观察及限定PASS，不重开任何原页、原PNG或现代预览。所有shell命令显式使用唯一根。只写本blind-review.md，未修改seed、views或候选，未运行validate/checker、DB/env、paid、安装、Git、APP或其他聊天。

本文是键披露前的独立盲审冻结，不是正式 `s10y-choice-review-v1`，不填未见draft的digest，不判作者键一致性已通过，也不批准wholeLesson。

## 快照绑定

路径相对于上述唯一根。

| 文件 | 文件字节SHA-256 | 契约canonical JSON SHA-256 |
| --- | --- | --- |
| `.tmp/stemrobin-187/n55/choices/seed.json` | `36b7929e96f5cbae9b32f6a96f776d44f163fcaa1d960754349fe4395b11b968` | `ef166884e4ff27a2f855c4ace217bc1fce4e9bd69aa3b25be827c7271c8cc08a` |
| `.tmp/stemrobin-187/n55/choices/views.json` | `17f3849b20dcdfe72735b554028190dd984f9ba89abfa13343dfae761930c1d0` | `6352a258d2515a441eaa706492c2f41d9f20ac9c0d56c38d128d49c0b3ac20e2` |

canonical采用契约所述 `json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))` 的UTF-8 SHA-256；views digest仅绑定本次可见投影，不是draft digest。

| 其他实际依据 | SHA-256 |
| --- | --- |
| `.agents/skills/ld-s10y-choice/references/review.md` | `7ab367601247bece0fa05b60a9cd1555d78f1169ed581db76f18385f75aaacea` |
| `.agents/skills/ld-s10y-choice/references/contract.md` | `e5443f08fb535a100e2f036f0e966d3ce67db07356031161d791b44e296ccb06` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/evidence/independent-solutions.md` | `da6fc160d5b0d7fa5550e084211dad159d121d2efb1202ad621e1157de38973c` |

seed的source确为4m/N55，包含924–934全部11源和definition block1。没有把N54、N56或源边界图加入本批。

## 复用图观察

| 使用题 | seed资产及实际当前SHA-256 | 已有实质观察与本次复用范围 |
| --- | --- | --- |
| read-ray | `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-213.svg`；`4a6b54a045b82a8bd53c6260e6b647b10e4cc9733b298f3ec7ecd8be36652d9f` | 单一共同数线，5/6间10小格，全23ticks，A/B/C/D/K在相对5的3/8/12/16/18格。K右侧末端4小格与最右tick保留，五点值未印为答案。 |
| equal-animal-counts | `ssot-resources/soviet10year-textbooks/artifacts/4m/editions/modern-us-neutral/figures/fig-214.svg`；`0fd3f7039745e4bfaf0635f911513301b4a4571b3f1dcd41ae72d0a660316033` | 当前修稿甲虫左右各3腿、蜘蛛左右各4腿，全部连身、头身搭接，两个代表个体不表示收藏数量。可见标签只有Beetle/Spider，没有22、方程或收藏数。 |

本次实际hash与seed资产字段、前次已实审PASS一致，不只接受seed记忆中的hash。实际先前开过的现代观察载体分别为 `.tmp/stemrobin-187/n55/previews/fig-213.png`（SHA-256 `70ce4c3acafc3f1f1cf20dea8896cd1c03841ec2027a5ed329d00a93495e0299`）及 `fig-214-repair.png`（SHA-256 `4fa15fe3f5eba54d6689434e36643a592d192362d679238235c4d250fbd1ff24`）。

源inventory见本课 `evidence/source-figure-supplement.md`；213限定PASS见 `evidence/independent-figure-review.md`，214当前修稿限定PASS见 `evidence/independent-figure-repair.md`。214旧REVISE仍属于旧资产，本批不改历史。这里不声称本次再次打开SVG图像或完成APP整课显示验收。views仅使用上述两个seed图，未显示其他figure_id；未读draft，不能由此推断其内部new_figures登记为空。

## 独立源解引用与实质覆盖

下列解来自先前冻结的独解，不在本批重开源图或重做源转写。

| 源 | 冻结的独立解/任务 | 当前view映射与coverage verdict |
| --- | --- | --- |
| 924 | 456.76：4百/5十/6一/7十分/6百分；24.578：2十/4一/5十分/7百分/8千分；1.878：1一/8十分/7百分/8千分；0.5211：0一/5十分/2百分/1千分/1万分。 | place-decomposition：**pass**。四个原数均进入相应完整展开式判断，仍区分整数与小数各位及重复数字处在不同单位。口述各位单位个数转为展开等式辨认的生产能力损失需随后核intent记录；不因等式省略0个一便判数学缺位。 |
| 925 | 两组分别15.379、0.3041；第二组百分位0占位，原跨0206/0207的条件齐全。 | compose-decimals：**pass**。两组全部数量同时纳入一份双结果记录，不只识别其中一个空格。 |
| 926 | 5米7分米6厘米2毫米=5.762米。 | metric-places的a/b：**pass**。完整混合量→米等式判断。 |
| 927 | 4.573米=4米5分米7厘米3毫米。 | metric-places的c/d：**pass**。米→四种单位方向仍保留；与926合并有正反数位换算理由。 |
| 928 | 每格0.1，A/B/C/D/K依次5.3/5.8/6.2/6.6/6.8。 | read-ray：**pass**。五点在同一已审数线，要求辨认完整五数记录。 |
| 929 | Casey<Drew<Alex<Ben；对应37.7<39.2<40.8<42.5公斤。 | order-weights：**pass**。四质量及三条严格比较完整；“各数只用一次”明确源四个不同测量结果的分配，并未加入新数值限制。 |
| 930 | 按A→B→C→D→E连成四段，长度2.3/3.5/4.8/1.7厘米；形状、角度非唯一。冻结样例为(0,0)、(2.3,0)、(2.3,3.5)、(7.1,3.5)、(7.1,5.2)，不作唯一形状。 | polyline-lengths：**revise**。仅四个给定长度的厘米→毫米记录，不含候选折线、坐标链或构造步骤，原折线几何构造/辨认任务没有成为需要判断的内容。题号及四个长度存在不等于该任务已覆盖。 |
| 931 | 第1式82339，第2式13。 | arithmetic-first及arithmetic-second：**pass**。按原两分题拆开，两个完整式均覆盖，无改运算或数值。 |
| 932 | 七点距原点2.5/5/9/14/13.5/20/22格，0.25与1.35是半格；纸上布局不唯一，相对位置固定。 | mark-ray：**pass**。七数均参加位置记录判断，10格单位与两半格保留。手绘/尺规精度不能由选择记录评估，需核后续limitations；精确格数关系本身未丢。 |
| 933 | 6n+8n=308，两类各22；两类合计44而不是每类44。 | equal-animal-counts：**pass**。要求据已审代表图的6/8腿与数量相等建关系，308仍为腿数。 |
| 934 | 543×97=52671；457×13=5941；和加7070为65682；除738=89；(89−89)×11=0。 | nested-arithmetic：**pass**。源543及整个括号、除法、减89、末乘11均原样使用。独解先冻543后得0，不用结果反选源数字。 |

题号映射覆盖全部11源，没有遗漏某个编号。实质覆盖不是全pass：930有上述关键任务缺口。931拆分/926与927合并都具有数学任务理由。其余识别替代书写的能力损失不自动构成失败，但后续须与作者真实limitations/coverage比较，不能在未披露时假称作者已登记。

definition block1是小数点后第一/第二/第三位的名称与位置说明，不含这11题的具体解；支持924/925的数位判断。它不是把0.444完整求和样例冒称新definition，也不要求每个选定definition单独再生一题。

## 键披露前的题目语义判断

共11个views、41个选项，8题single、3题multiple。以下判断先于作者键披露，且与后面的数学枚举分开。

| question_id | task_fidelity | redundancy | answer_leakage | 具体依据 |
| --- | --- | --- | --- | --- |
| place-decomposition | pass | pass | pass | 完整展开式须判每个数位单位；与925“单位组成小数”方向相反，不是同一结果重复。definition只给名称，无四原数的解。 |
| compose-decimals | pass | pass | pass | 15个一、第二组占位0及万分位均在两组任务内；整份双结果是合理response unit，不能靠孤立cell点击作答。其他题未给15.379/0.3041。 |
| metric-places | pass | pass | pass | 源926/927正反长度表示均在whole equality层面判断；合并不删除方向。毫米到米须换成千分之一，不是抄题干数字。 |
| read-ray | pass | pass | pass | 同一轴读五点及5/6单位，非五独立轴。mark-ray虽明说10格=1可提示共同单位知识，却不给本图五点格索引或结果，仍须看图；不是点值答案泄漏。 |
| order-weights | pass | pass | pass | 每份四人记录须满足三不等式及一次分配；原数字顺序不是已排答案，其他题也无姓名重量对应。 |
| polyline-lengths | **revise** | pass | pass | 只有顺序长度换算，无折线连接或几何构造判断。与metric的换算虽相关，单位方向/数据不同，未据“同知识点”机械判重复；无答案直接暴露，但不泄漏也不能补回缺失任务。 |
| arithmetic-first | pass | pass | pass | 完整第1源式，须处理括号内除法、减法及末加；与第2式不是等价重复，别题未给结果。 |
| arithmetic-second | pass | pass | pass | 完整第2源式，乘法先行、整和除427、末减119都保留；不能借第1式结果求它。 |
| mark-ray | pass | pass | pass | 从数推精确格数与read-ray从图读数方向不同。七数都有判断项，尤其两半格不能舍入；不因完整记录可合理排除一个错误值就机械判失真。 |
| equal-animal-counts | pass | pass | pass | 图仅提供两代表个体的腿数，不给实收集数。要求数量相等与308腿同时成立；不是只按总动物数二分。 |
| nested-arithmetic | pass | pass | pass | 543原式与嵌套运算不变；其他两求值题数据不同，没有给此题89或0，图亦不泄漏结果。 |

### 930真实任务缺口

本REVISE不是因为“选择题不能证明学生亲手画图”，也不是将一种冻结样例当唯一图形。构造转为合理的完整图形/构造辨认可以保留数学任务。

当前visible却只问四个厘米给定量换成毫米后的记录，四个段名和“由四段组成”已经由题干直接告知，没有任何连接、端点或实际段长几何对象供判断。即使某人只会乘10、不知道怎样从B续画BC并依次连成ABCDE，也能答对；四条彼此分离但同长的测量片段同样产生该记录，不能完成源折线任务。这是原关键作图/几何任务被新换算题替代，不是单纯response mode的能力损失。

可在随后授权的修订中改为判断完整A→B→C→D→E的构造方案、坐标链或经独审的折线图，使连接关系与四段长度实际进入判断；允许任意合法转角，不强制唯一轮廓。本审不编辑候选。仅在内部limitations写“不能手画”不能把当前未出现的几何判断补回来。

## 每个visible question的独立数学与全部选项

这里“真/假”是本审独立结论，不是作者key字段。全部选项均核，不只定位一个可选答案；下面的false算式/反例不冒充作者的具体misconception。

### place-decomposition

Mode：multiple。独立结果为 **{a,c}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 真 | 400+50+6+0.7+0.06=456.76，百/十/一/十分/百分全对应。 |
| b | 假 | 20+4+0.5+0.07+0.0008=24.5708，不是24.578；原最后8在千分位，应为0.008。 |
| c | 真 | 1+0.8+0.07+0.008=1.878；两个8分别在十分/千分位。 |
| d | 假 | 0.5+0.02+0.01+0.001=0.531，不是0.5211；后两个1应为0.001及0.0001。 |

### compose-decimals

Mode：single。先分别得到15+0.3+0.07+0.009=15.379及0.3+0+0.004+0.0001=0.3041。完整true set为 **{b}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 假 | 第二组0.3041正确，但第一组15.739把十分/百分的3、7换位；第一组必须15.379。 |
| b | 真 | 两组分别15.379和0.3041，全部给定单位和百分位占位0均满足。 |
| c | 假 | 第一组正确，第二组0.0341只有3个百分之一而非3个十分之一。 |
| d | 假 | 1.5379和0.03041分别是正确两数的十分之一；15个一和3个十分之一均被错误缩小。 |

### metric-places

Mode：multiple。独立完整true set为 **{a,d}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 真 | 5+7/10+6/100+2/1000=5.762米。 |
| b | 假 | 同一完整混合长度是5.762米而非5.0762米；7分米须为0.7米，不是0.07米。 |
| c | 假 | 4+5/10+7/100+30/1000=4.600米，不是4.573米；末项多27毫米。 |
| d | 真 | 4+0.5+0.07+0.003=4.573米，末项准确为3毫米。 |

### read-ray

Mode：single。已冻结基准每格(6−5)/10=0.1；依格索引3/8/12/16/18得5.3/5.8/6.2/6.6/6.8。完整true set为 **{c}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 假 | 5.03/5.08/5.12/5.16/5.18把每格取0.01，连5至6的第10格也只会到5.10，不满足图上6。 |
| b | 假 | 0.3/0.8/1.2/1.6/1.8是相对5的位移，遗漏基准5，非五点坐标。 |
| c | 真 | 5加3/8/12/16/18个0.1，逐点为5.3/5.8/6.2/6.6/6.8，与源位置全对应。 |
| d | 假 | 5.6/6.6/7.4/8.2/8.6等于每格取0.2；5到6将只能5格，与10格单位矛盾。 |

### order-weights

Mode：single。独立条件Casey<Drew<Alex<Ben，故顺序为37.7/39.2/40.8/42.5公斤。完整true set为 **{d}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 假 | Alex=39.2、Drew=40.8，违背Alex比Drew重；另外两比较并不能救该记录。 |
| b | 假 | Casey=39.2、Drew=37.7，违背Casey比Drew轻。 |
| c | 假 | Alex=42.5、Ben=40.8，违背Alex比Ben轻。 |
| d | 真 | 37.7(Casey)<39.2(Drew)<40.8(Alex)<42.5(Ben)，四值各用一次，三条比较全成立。 |

### polyline-lengths

Mode：single。仅就当前visible的毫米记录问题，2.3/3.5/4.8/1.7厘米各乘10得23/35/48/17毫米。完整true set为 **{b}**；这项数学可判不抵消前述task_fidelity/coverage REVISE。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 假 | 23/48/35/17毫米对应2.3/4.8/3.5/1.7厘米，BC与CD的长度对调。 |
| b | 真 | 23/35/48/17毫米依次对应四个给定厘米长度。 |
| c | 假 | 2.3/3.5/4.8/1.7毫米是所需长度的十分之一，不能仅换单位名不换数。 |
| d | 假 | 230/350/480/170毫米是所需长度的10倍，厘米到毫米只需乘10而非100。 |

### arithmetic-first

Mode：single。104040÷2312=45；(1070−45)×74=75850；加6489=82339。完整true set为 **{b}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 假 | 75850只是括号后乘74的中间值，遗漏末加6489。 |
| b | 真 | 75850+6489=82339，完整处理全式。 |
| c | 假 | 85624=1070×74+6489−45，错误地令45未随整个括号乘74；原式应减45×74。 |

### arithmetic-second

Mode：single。205×87=17835；38529+17835=56364；÷427=132；−119=13。完整true set为 **{a}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 真 | 132−119=13，先乘、整和相除、末减的顺序完整。 |
| b | 假 | 132仅是除427后的中间商，遗漏减119。 |
| c | 假 | 251=132+119，把末减误成加，不是原式值。 |

### mark-ray

Mode：multiple。10格=1单位，距原点格数为数×10；七个数应对应2.5/5/9/14/13.5/20/22格。完整true set为 **{a,c}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 真 | 0.25×10=2.5格，1.35×10=13.5格，两半格都精确保留。 |
| b | 假 | 1.4/2/2.2必须在14/20/22格，而不是1.4/2/2.2格；所列位置实际表示0.14/0.2/0.22。 |
| c | 真 | 0.5×10=5格，0.9×10=9格。 |
| d | 假 | 3格代表0.3、14格代表1.4，分别不是0.25、1.35；不得把半格位置向上舍入。 |

### equal-animal-counts

Mode：single。已审代表图给甲虫6腿、蜘蛛8腿，每类n只则14n=308，n=22。完整true set为 **{c}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 假 | 各154只将有14×154=2156腿；308÷2只把腿总数误作两类动物总数。 |
| b | 假 | 各11只只有14×11=154腿，少于308。 |
| c | 真 | 各22只，甲虫132腿、蜘蛛176腿，合计308且两类数量相等。 |
| d | 假 | 各44只会有14×44=616腿；44是正确两类动物合计数，不是每类数。 |

### nested-arithmetic

Mode：single。543×97+457×13+7070=65682；÷738=89；(89−89)×11=0。完整true set为 **{b}**。

| 选项 | 真伪 | 独立证据 |
| --- | --- | --- |
| a | 假 | 979=89×11，遗漏除法之后、乘11之前的减89。 |
| b | 真 | 完整中括号为89−89=0，末乘11仍为0。 |
| c | 假 | −890=89−89×11，把末乘11只作用在减数89；原乘数作用于整个中括号。 |

## 完整true sets冻结

```json
{
  "place-decomposition": ["a", "c"],
  "compose-decimals": ["b"],
  "metric-places": ["a", "d"],
  "read-ray": ["c"],
  "order-weights": ["d"],
  "polyline-lengths": ["b"],
  "arithmetic-first": ["b"],
  "arithmetic-second": ["a"],
  "mark-ray": ["a", "c"],
  "equal-animal-counts": ["c"],
  "nested-arithmetic": ["b"]
}
```

全部41个选项均已独立判定；8道single各恰有一个真选项，3道multiple各有两个真选项。没有源不清或图未审导致的数学blocked。只为核本次选项中的实际值作一次本机Node算术核算，不运行数学/choice检查器，不从作者键取结果。

## 盲审结论与后续披露边界

**本可见快照的盲审语义结论：REVISE，原因是polyline-lengths对源930关键任务的忠实性/实质覆盖缺口。** 其当前换算选项的独立true set仍为{b}，没有把语义失败伪装成算术失败。其余可见题task fidelity、redundancy、leakage及源覆盖如表；作图/口述生成转识别的合理能力损失明确保留，待核内部记录。

尚未与作者key、source_solution、misconception、limitations或内部coverage比较，不宣称其已通过；正式review待直接授权披露内部comparison后处理，不为了匹配未见键改变上述true sets。本文、源独解、图PASS/旧REVISE均保留，不批准wholeLesson，不执行其他阶段。图片计数仍17/24。
