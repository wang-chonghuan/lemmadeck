# Choice19 授权内部比较

日期：2026-11-15。审者：Codex，独立 choice reviewer，非选择题作者。
**语义 review outcome：PASS。** 只对下列当前 seed/draft 快照负责；
主会话负责带 review 的 validate，本审者没有重跑作者结构检查。

## 披露顺序与输入

九 seed 独立源解先保存，随后7题30项纯view盲审保存，最后用户明确授权
本目录 `draft.json`、`author-notes.md`、`source_solution.md` 才读取作者内部。
本轮没有读标准答案、旧choice、其它作者解或沿目录搜索答案。
未修改、归一化作者稿，也没有回写冻结源解或盲审。

本次已比较每个作者 source_solution、每项 derivation/misconception、
完整 correct 集合、source_numbers、coverage/omitted_tasks、
unit_reason/limitations。不是仅对比字母键或接收作者结构PASS。
当前 draft 的 `{id,view}` 投影与冻结 `view.json` 逐字段相等，
新增披露没有反向改变任何盲审判断或补入可见题面缺失条件。

fig60 作者任务此前独立收口；main 后续的图独审PASS及图review均属于
另一项图审证据，不混入本 review 的 independent_agent 身份、
figure_checks、新图审查或本 choice 完成量。本组 seed及draft新图均为空。

## 作者源解与冻结源解

| source | 比较结论 |
| --- | --- |
| 1 | 都把测量定义为与单位力比较、确定倍数及带力单位的数值，而非只报测量仪器名称。 |
| 2 | 都使用N/kN，1kN=1000N；重力/弹力皆是力，kg是质量单位。 |
| 3 | 都保留1kg、1s、Δv=1m/s，不把匀速已有速度当速度变化；当前直线恒定变化率四过程的0/0.5/1/2N一致。 |
| 4 | g=9.8分支都得1kg→9.8N。作者另外记录g≈10的约10N分支，未代替本题指定9.8。 |
| 5 | 都先换成kg再用F=gm，单位(N/kg)×kg=N；不能用克裸数或m/g。 |
| 6 | 都按本书水平且相对地球静止的支承约定计算P=F=gm，保留重量/重力的作用对象区别；作者明确不声称该约定穷尽现实全部相等情形。 |
| g2-1 | 精确9.8分支同为24.5、7.84、11760、0.49N，四质量及对应完整。作者另一系数分支25、8、12000、0.5N的运算也能按g≈10复现，但不属于当前题设。 |
| g2-2 | 9.8分支同为98、1.96N，200g=0.2kg。作者另一近似系数分支100、2N独立区分，未称源近似普遍错误。 |
| g2-3 | 同为4000/49kg≈81.632653kg；可见一位小数得81.6kg。作者明确原源未规定该小数位数，并区分g≈10时80kg的分支。 |

### 外部 gapprox 的证据边界

冻结 source-first 只用授权 seed 的 g=9.8，已声明外部 gapprox 的具体口径
不由该 seed 给出。作者新披露文件说其读取的完整现代课文允许g≈10；
这属于**作者额外完整课文的来源声明**，本轮授权仅三份内部文件，
本审者未另打开该完整课文或标准答案，因此不伪称独立像素/原文验证了
这一外部出处，也不将其追加回冻结seed源解。

可以直接独立确认的是上述g≈10各分支的算术，以及所有当前可见数值题
均指定g=9.8。作者two-masses-weight b与mass-from-weight a的误思准确为
“忽略本题指定系数而仍用另一近似”，不是“g≈10本身错误”。
其外部出处不是当前唯一键成立的前提，没有未授权系数被用于当前真值。
反求题可见四舍五入一位小数，使81.7不能以向上舍入口径并列正确。

## 完整键与全部解释

| question_id | 冻结盲审集合 | 作者完整键 | 逐项比较 |
| --- | --- | --- | --- |
| force-measurement-units | {a,c} | {a,c} | 5/5相符；b把悬挂物kg读数当弹力单位，d反向除1000生成0.001N，e只换单位不换数值，均对应实际false项。 |
| one-newton-definition | {c} | {c} | 4/4相符；a把已有速度当Δv，b漏2秒，d漏1kg定义条件，各错误步骤确实会把对应过程误认为1N。 |
| gravity-mass-rule | {a,c} | {a,c} | 4/4相符；b将1000g裸数乘9.8生成9800N，d由错误m=gF变形为F=m/g，且量纲kg²/N不对。 |
| weight-support-conditions | {c} | {c} | 4/4相符；a漏静止、b漏水平、d将重量等于重力无条件化，均产生误接纳相应条件组的判断，不用现代特殊情形反改所问课文约定。 |
| four-masses-gravity | {b} | {b} | 4表16行全部核；a错误因子100精确生78.4/1176/4.9，c裸数乘9.8精确生7840/11.76/490，d吨数除1000精确生0.01176，其余三行保持正确。 |
| two-masses-weight | {d} | {d} | 4/4相符；a漏克换算精确生98/1960，b用g=10生100/2而违本题9.8，c正确换克但漏乘g生10/0.2。 |
| mass-from-weight | {b} | {b} | 5/5相符；a用g=10生80.0，c错乘生7840.0，d只改单位生800.0，e余数非零总进一位生81.7，不是普通四舍五入。 |

总计30项，9项correct、21项incorrect。每个false项都核了作者具体错误
程序能否生成这个选项或错误的情形判断，未把“误思听起来合理”当证明；
每个true项的misconception均为null，推导及单位相符。
详细逐项证据和独立完整集合在 `review.json`，不把作者集合写回独立文档。

## Coverage 与损失

九个source_numbers的作者coverage与独立任务映射一致：
1/2共用测量单位题，4/5共用基准和一般重力关系题，
3、6及三道g2题各有自然完整响应单位。不是按数量硬并题或逐数拆题。
作者没有以规则题替代全部实际转换，也没有将条件识别替代两个重量计算；
反求质量与正向乘g在代数方向上不同，保留独立一题有依据。

以下具体局限必须随PASS保留：

- 四表共同首行都是2.5kg→24.5N，**没有判别力**。不能声称正确选择
  证明学习者自行算出或独立检查了该行。作者unit_reason明示首行相同，
  limitations/coverage承认完整表不能证明全部四值生成。
- 单看吨行即可区分四个候选表，合理淘汰允许少于逐行完整计算；
  完整表响应不等于收集四次自主运算。作者明确承认少数区别行淘汰，
  审者保留这点，没有因键匹配而归一化成“每行都被测试”。
- 两重量结果对也可利用第二项区分，不能证明两物体全部自主计算。
  作者intent及coverage不把结果对识别当书面公式、过程生成。
- 所有定义/关系/条件选择均不能证明自主措辞定义、写单位推导或受力解释。
  作者逐题limitations与逐seed omitted_tasks均记录了这些生成损失。
- g=9.8及一位小数是明确的现代选择限制，缩小原回答可取外部近似、
  精确分数或自行舍入的空间；作者特别在g2-3 coverage声明该损失。

按当前choice语义标准，整表识别和合理排除本身不自动失败。
本组仍保留F=gm、单位转换、重量支承条件、正逆向关系和源量对应，
不是仅复制原数据即可正确，也未隐去吨/克或删掉整项源任务。
所以已如实声明的生成/逐行验证损失不构成关键学习任务消失，
本快照无需revise/blocked。没有弱化源数值、false要求或distractor可复现标准。

跨题共享本课定义与计算成立条件，没有作者内部key泄入可见文本；
规则题支持应用题，但不直接给实际数值，应用题也不公开另一题完整集合。
冻结盲审的fidelity/redundancy/leakage结论保留。

## 快照绑定

canonical按contract：sort_keys=true、ensure_ascii=true、
separators=(",",":")，UTF-8后SHA-256。已用现有Python在内存复算，
不是复制作者notes中的digest，也不混用文件字节哈希。

| 文件 | 字节 SHA-256 | canonical digest |
| --- | --- | --- |
| seed.json | e2580c648d2d1c4c5230db21a1b61c299538eef32134249494aa4b6c8edc2480 | f2d02c7c784c4312e7ab78db44948bd5dcb5028ff7545ae648da2f8863da4b37 |
| draft.json | f570d1b56b8e53935abdb9bc4a318335e49da89d3eee12b5e44daabf29137c34 | 617b9bdb6815620af0e9ac5e1dc5745eec6c4b8b5ff1abe417ac3469b73d6ed4 |
| view.json | c526a8ec808367bd299c2e24181655944a78ab711c76e324e7b6f476f2a9e09c | f1dcaa38d92ad8326b22fb5393b0b0d471c653596ad11b5fa59b548416562d2e |

其它已读证据字节哈希：

- source-first.md：`98fd4ff54f793760f95c96094e626914bb71fc56a24a6eb622f49a95aa5218b1`
- view-first.md：`4d3a67a4fde1a2b447b0b4901a40d96fc13e032906d9ff272e30a218ce4da26e`
- source_solution.md：`a987a8b52637eb3fd53084469d71433460cb715c32bf2157e76642c7d28b7e1a`
- author-notes.md：`49f9ea14c15eb3fed1396df57012011c739f7a63762d049d7715012b7730c1ea`

## 结束边界

仅用apply_patch新增本目录 `review.json` 和 `key-comparison.md`。
无真实首次FAIL，无作者稿修复；既有源解、view盲审和作者文件保持原快照。
作者结构PASS不是本语义PASS依据，本审者未调用validate.py；
主会话负责带review验证及后续授权动作。
没有标准答案/旧choice读取、答案回写、源/现代/图修改、DB/Git/app/依赖操作。
