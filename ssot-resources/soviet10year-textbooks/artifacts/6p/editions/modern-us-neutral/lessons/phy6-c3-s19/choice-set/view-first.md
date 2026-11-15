# Choice19 View-First 独立盲审

日期：2026-11-15。审者：Codex，独立 choice reviewer，非本选择题作者。
**纯 view 盲审 COMPLETE：本快照可见语义与数学 PASS；等待授权作者内部比较。**
不是正式整包 review，不宣称作者 key、rationale、limitations 或 coverage 已通过。

## 隔离与快照

按顺序完成：九 seed 的 `source-first.md` 已先保存并冻结；fig60
独立作者任务完成、交接保存后，才打开本目录 `view.json`。
本阶段题目材料只读纯 view 和本审者既有 source-first，另读 choice
skill/review/contract。没有读 draft、authornotes、authorplan、
作者 source_solution、key、标准答案或 answer-keys，没有运行需 draft 的检查器。
fig60 没有作为本组 choice 的图、答案或题解输入；两任务无答案交叉。

- view 字节 SHA-256：`c526a8ec808367bd299c2e24181655944a78ab711c76e324e7b6f476f2a9e09c`
- view canonical digest：`f1dcaa38d92ad8326b22fb5393b0b0d471c653596ad11b5fa59b548416562d2e`
- 冻结 source-first 字节 SHA-256：`98fd4ff54f793760f95c96094e626914bb71fc56a24a6eb622f49a95aa5218b1`
- source-first 所绑定 seed digest：`f2d02c7c784c4312e7ab78db44948bd5dcb5028ff7545ae648da2f8863da4b37`

view 顶层仅有 `questions`，每题仅有 `id/view`。共 7 题、30 个选项；
两题 multiple，五题 single。题干及全部选项的 figure_ids 为空，无图片待核。
哈希绑定所读快照，不替代以下语义求解。

## A. 先判任务、冗余与泄答

此节先于下面的逐项数学判定形成，不以作者 key 为依据。

| question_id | task_fidelity | redundancy | answer_leakage |
| --- | --- | --- | --- |
| `force-measurement-units` | PASS：合并 seed 1/2 的单位比较与力单位判断；选项同时涉及测量所得数值、力与质量单位及 N/kN 倍率，不只是辨认术语。 | PASS：同题中测量、单位种类、进位倍率、数值随单位变化是不同判断，无同义选项重复；后续计算题给 N 单位是必要题设，不替代本题整套判断。 | PASS：没有已标对错或答案文本、source 编号。后续题常用牛顿不直接给本题完整集合，a/d/e 仍需理解单位比较与倍率。 |
| `one-newton-definition` | PASS：seed 3 的 1 kg、1 s、速度变化 1 m/s 均保留，必须分清速度与速度变化，并比较质量、时间的作用。题干新增同一直线与恒定速度变化率，使“所列时段的合力”没有平均值/瞬时值歧义。 | PASS：匀速、时间翻倍、基准过程、质量翻倍分别检验不同关系，不是四个同义定义。 | PASS：没有预先写出哪一过程为 1 N；四项都含相近数字，不能仅找“1”或最长措辞确定答案。 |
| `gravity-mass-rule` | PASS：合并 seed 4/5，保留 1 kg 的重力、F=gm、kg/N 单位及先换算质量；不把重量无条件等同于重力。 | PASS：基准值、克与千克、乘法与除法分别有任务作用，与后续数值题形成规则到应用，而非相同数字的再问。 | PASS：显式 g 是计算定义，不是候选答案标记；后续具体结果不直接给本题全套真值。 |
| `weight-support-conditions` | PASS：完整保留 seed 6 的水平且相对于地球静止两项约定；明确问“课文约定”，不要求用现代情形推翻原书的支承口径。 | PASS：a/b 各放宽一项，c 同时满足，d 加入竖直加速；没有等价正确项。 | PASS：后两道重量题的水平静止条件是各题成立的必要已知，不是答案链接。那些题设只举满足约定的情形，不独立证明本题 a/b 所说“状态/方向不限”是否成立；未显示本题答案标记。 |
| `four-masses-gravity` | PASS（有明确能力损失，见下）：四个质量、顺序和单位全部在每张表中，必须判断质量换算与重力对应；没有删掉吨、克数据或改成单格点击。 | PASS：各表在克换算、吨换算或全部裸数处理上不同；允许通过某一错误行淘汰整表，不能据此自动判完整表识别失败。 | PASS：未标正确行或正确表；全部首行相同的具体局限单列，不把它伪称为已测试该行的计算能力。 |
| `two-masses-weight` | PASS：seed g2-2 两个质量及 200 g 换算均保留；明确水平静止支承和 g=9.8，使重量计算条件充分。 | PASS：未换算克、改用 g=10、把质量数值当 N、正确转换为不同成对结果，均需判断两个物体的对应关系。 | PASS：其它题没有给这两个质量的最终重量；题干条件不是答案。两结果成组，不是原数据抄录即可答对。 |
| `mass-from-weight` | PASS：seed g2-3 的 800 N 反求质量、除以 g 与单位均保留；水平静止支承显式化既有约定。新增“四舍五入保留一位小数”消除 seed 未指定精度的自由度。 | PASS：80.0、81.6、7840.0、800.0、81.7 各代表不同数值/运算/舍入判断；81.6 与 81.7 在声明精度下不等价。 | PASS：其它题未提供该反求结果；g=9.8 与舍入规则是可见条件，未混入作者内部近似或答案。 |

### 可见覆盖与能力损失

独立按任务匹配，而非读取作者 coverage：
seed 1/2 → `force-measurement-units`；
3 → `one-newton-definition`；
4/5 → `gravity-mass-rule`；
6 → `weight-support-conditions`；
g2-1/g2-2/g2-3 → 对应末三题。
九 seed 的主要关系均在可见题中，没有缺图或未授权源数字替换。

所有选择化都会损失独立写定义、写公式或写完整计算过程的产出证据。
这里的过程对比、整表/成对结果识别仍要求数学判断，不能因此自动判失败。
`four-masses-gravity` 的四表首行都给 `2.5 kg → 24.5 N`：
该行没有判别力，不能声称本题独立验证了学习者对这一行的自行计算能力；
还允许由吨行等单行淘汰完整候选表。因此四个结果的自行生成与逐行独立
验证能力存在损失。但剩余行仍考查 F=gm、g/kg/t 换算与对应关系，
不是仅抄源数据即可正确，无关键单位类型或原质量被删掉。
本盲审记录该损失，不把正常整表识别/合理排除直接判为 fidelity FAIL。
后续须核作者是否如实记录这些 limitations；本阶段未读该内部字段。

跨题共享本课定义与水平静止题设，没有“上一题选某项”的指令、
答案标签或以另一题答案为已知的求解依赖。规则题会支持应用题，
但不直接提供应用题的数值；应用题也不公开规则题的完整选项集合。

## B. 再独立求解全部可见选项

完全按实际 stem 求解。计算题均明确取 `g=9.8 N/kg`；
`mass-from-weight` 明确四舍五入至一位小数。
没有任何 stem 声明 g≈10。外部 gapprox 未获本 view 的授权，不能替换 g。
以下 true/false 与 complete set 均独立生成，尚未比较作者 keys。

### 1. force-measurement-units

测力数值是待测力大小与单位力大小的比值；N/kN 都是力单位，
1 kN=1000 N，质量单位 kg 不是本题的力单位。

| option | truth | 独立依据 |
| --- | --- | --- |
| a | true | 单位力比较所得倍数正是该单位下的数值。 |
| b | false | 弹力也是力，应使用 N/kN 等力单位；kg 是质量单位。 |
| c | true | 重力和弹力都可用牛顿或千牛顿表示，不依力种类更换量纲。 |
| d | false | 1 kN=1000 N，不是 0.001 N；后者把进位方向反了。 |
| e | false | 例如同一非零力 1000 N=1 kN，数值为 1000 和 1，并不相同。 |

完整 true set：`{a,c}`，与 multiple 模式一致。

### 2. one-newton-definition

按题干恒定同一直线速度变化率，合力大小为质量乘以速度变化率。
不是质量乘速度，也不是只看到质量和速度数字都是 1。

| option | truth | 独立依据 |
| --- | --- | --- |
| a | false | 匀速的速度变化为 0，合力为 0 N；已有速度 1 m/s 不代表 1 N。 |
| b | false | Δv/Δt=1/2 m/s²，1 kg 对应 0.5 N。 |
| c | true | Δv/Δt=1/1 m/s²，1 kg 对应 1 N。 |
| d | false | 同样 1 m/s² 的速度变化率作用于 2 kg，合力为 2 N。 |

完整 true set：`{c}`，满足 single 唯一性。

### 3. gravity-mass-rule

F=gm，g=9.8 N/kg；m 必须先用 kg，所得 F 用 N。

| option | truth | 独立依据 |
| --- | --- | --- |
| a | true | 9.8 N/kg × 1 kg=9.8 N。 |
| b | false | m 若用克，牛顿数应为克数×0.0098；例如 1000 g 所受重力为 9.8 N，不是 9800 N。 |
| c | true | kg 与 N/kg 相乘得到 N；公式与单位同时成立。 |
| d | false | 把应有乘法写成除法；m/g 的量纲为 kg²/N，也不是 N。 |

完整 true set：`{a,c}`，与 multiple 模式一致。

### 4. weight-support-conditions

按冻结源解与实际 stem 的本书约定，要同时满足支承物水平、
相对于地球静止。不是声称这两项是现代物理中 P=mg 的全部可能情形。

| option | truth | 独立依据 |
| --- | --- | --- |
| a | false | 状态不限，缺少相对于地球静止这一约定；可含加速支承。 |
| b | false | 方向不限，缺少水平放置这一约定；不完整满足本题所问约定。 |
| c | true | 同时满足水平与相对于地球静止两项。 |
| d | false | 竖直向上加速不属于静止约定；通常支承载荷还含加速所需部分，不能直接用原静止口径。 |

完整 true set：`{c}`，满足 single 唯一性。

### 5. four-masses-gravity

按题干次序：
2.5 kg → 24.5 N；
800 g=0.8 kg → 7.84 N；
1.2 t=1200 kg → 11760 N；
50 g=0.05 kg → 0.49 N。
逐一计算四行，不只核能淘汰候选表的某一行。

| option | truth | 四行完整检查 |
| --- | --- | --- |
| a | false | 24.5 对；78.4 错（应 7.84）；1176 错（应 11760）；4.9 错（应 0.49）。后三行倍率错误，故整表 false。 |
| b | true | 24.5、7.84、11760、0.49 四行全对，质量与重力顺序对应无错。 |
| c | false | 24.5 对；7840、11.76、490 均错，分别把 800、1.2、50 的裸数直接当 kg 后乘 9.8，没有 g/t 换算。 |
| d | false | 24.5、7.84、0.49 对；1.2 t 的 0.01176 错，对应错误地将 1.2 除以 1000 当 kg，实际应乘 1000。 |

完整 true set：`{b}`，满足 single 唯一性。

### 6. two-masses-weight

水平静止支承下 P=gm，10 kg → 98 N；
200 g=0.2 kg → 1.96 N。两项都必须正确。

| option | truth | 独立依据 |
| --- | --- | --- |
| a | false | 98 对；1960 错，把 200 g 的裸数当 200 kg，第二项应 1.96 N。 |
| b | false | 100、2 是改取 g=10 的结果；实际 stem 明确 9.8，没有近似许可。 |
| c | false | 10、0.2 是 kg 下的质量数值，不是乘 g 后的重量 N 数值。 |
| d | true | 9.8×10=98；9.8×(200/1000)=1.96，顺序和单位都正确。 |

完整 true set：`{d}`，满足 single 唯一性。

### 7. mass-from-weight

m=P/g=800/(49/5)=4000/49 kg≈81.6326530612 kg；
按 stem 四舍五入保留一位小数得 81.6 kg，百分位为 3，不进位。

| option | truth | 独立依据 |
| --- | --- | --- |
| a | false | 80.0 来自 800/10；与显式 g=9.8 不一致，不是本题允许的近似。 |
| b | true | 精确商按指定精度四舍五入为 81.6 kg。 |
| c | false | 7840.0 是 800×9.8，反求质量应除以 g。 |
| d | false | 800.0 把牛顿数直接当千克数，未除以 9.8。 |
| e | false | 81.7 是向上取到下一十分位，不是对 81.632653... 四舍五入。 |

完整 true set：`{b}`，满足 single 唯一性。

## 结论与等待点

7 题 30 个 visible options 已全部核 true/false，无未解项、
不充分条件或真实首 FAIL。独立 complete sets 按 view 顺序为：
`{a,c}; {c}; {a,c}; {c}; {b}; {d}; {b}`。
算术以冻结源解的精确结果为基准，并用现有 Python 在内存复算，
没有补入外部近似或读取作者 keys。source-first 的源解未回写。

纯 view 的 task_fidelity/redundancy/answer_leakage 及独立可见数学 PASS。
四质量题共同首行及选择化的产出能力损失已具体记录，不虚报独立写解能力。
作者 correct set、逐项 derivation/misconception、源覆盖和能力损失声明
仍待用户授权读取 draft internal 后比较；本文件不代替正式 hash-bound
整包 review，不凭作者“结构检查 PASS”作语义审批。

本阶段仅新增 `view-first.md`。没有改题、回写源解、源/现代模板/图、
工具、他稿，未使用 DB/Git/app/依赖。盲审证据保存后停在等待授权点。
