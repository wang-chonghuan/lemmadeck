# S21 Key Comparison 独立键比较

日期：2026-11-15。审者：Codex，非s21作者会话。
**语义结论 PASS；带review验证实际一次，退出0。**
本结论只审批保留数学判断的离线choice，不声称完成源题自主作图能力。

## 顺序与当前快照

source-first完整独立源解先冻结，view-first再完成7题29项盲审；
main明确授权后，本阶段才读s21完整draft.json、
author-solution.md、author-notes.md。未重解源题或重做盲审，
不按作者键回写先行结论。本轮没有读取或重审s18及其它choice、
标准答案、Sagan答案解或作者旧版本。

当前draft投影`{questions:[{id,view}]}`与冻结view.json逐字段相等。
七个完整true set及29项truth全部与冻结盲审一致。
作者所述先于选项的源解顺序及预交接改善是其自述；
本审查不以这些自述替代独立源解/盲审，也不越权读旧稿核历史。

| 文件 | 字节SHA-256 |
| --- | --- |
| seed.json | dd792600e192c68fac2b80e4272e22317ec38040e7d25f92736365ab97398d3d |
| draft.json | cea2220d652e759d2ca224beeb771c415f88ca2ba4e7771ea733f314571f3d19 |
| view.json | 3a8f04cd137fdb642008098eb9111bedddf32f3c29c687e216fc92b2b0551529 |
| source-first.md | 3ca3cf2cf863927ee38a77d3a02da1b6fb5af5c545f281ec5570b75562045444 |
| view-first.md | c2de8ecf23929ee684c35f5a19c578a98caf73e431e668d5afe97e651815d4eb |
| author-solution.md | 309dab57c444d6e85a93f8ad2fa8a1319cc515721e6d0c93205492243310b22b |
| author-notes.md | 44b5e70b178bc1a545c29ddd6fc908e0ecd4a5c2bbfaa6b219416599d796b40c |

review按contract绑定canonical JSON SHA-256：

- seed：`aabb4ebd892f77255cc1245ae3d2f60958480a8adebaf67d5191a7b604c77d66`
- draft：`709c63100b6880c8381c76dfeaf57cf561764243349dcbee565428682a57b80d`
- 冻结view：`847b007bc05680a73240110779cb5e880c7b3c2251853d990f62b3e9bfc0ba55`

canonical使用sort_keys=true、ensure_ascii=true、紧凑逗号/冒号分隔、
UTF-8后SHA-256，不用文件字节hash代替。

## 作者源解与七源覆盖

作者源解与冻结独立源解的关系、公式和未指定量边界一致。
作者原源解的10N相反力只是自行举例，源2没有固定数值；
可见题的12N是另一明确例子，不是改错某个源数值。
3吨箱子的未补充源解仍是3000g N；只有实际view明示
g=9.8N/kg后才得到29400N=29.4kN，没有偷用g≈10或舍成30kN。

| 源 | 当前question_id | 保留的判断与实质损失 |
| --- | --- | --- |
| 1 | s21-controlled-effects | 大小、方向、作用点三个控制比较均保留；作者coverage及limitations明确自主举例、选装置/条件和解释生成未测。 |
| 2 | s21-vector-reason | 大小与方向的矢量定义、等大小不等矢量均保留；自主表述和超出该例的迁移未由选择证明。 |
| 3 | s21-force-diagram-rule | 箭头方向、长度比例及无标度不能读N保留；A始端为共同已给句，不独立辨析它。作者记录定位、选比例、画线/标注的生产损失，审者进一步明确公共首句无判别力。 |
| 4 | s21-gravity-weight-recipients | 重力作用于袋、重量作用于支承物及不同始端保留；作者明示已有图给位置/方向提示，不冒称无提示画图或所有悬挂情境迁移。 |
| g2-1 | s21-two-force-plans | 400N重量、50N水平击球两个子任务均保留，含同/异尺度、长度和方向；独立选比例、实际作两图、原未指定几何情境的自主选择未测。 |
| g2-2 | s21-tractor-scaled-traction | K-700、60000N、1cm/10kN、6cm及受力工具/方向保留；显式选择达到该力值的向右牵引场景，不把最大值称永恒工作值。实际用尺和自主选场景未测。 |
| g2-3 | s21-crate-gravity-weight-plans | 3t→3000kg、显式g、两力大小/对象、同与异尺度方案均保留；未补充源的g参数族、自主选比例和实际两图生产不由该数值实例证明。 |

七条coverage与七个source_numbers对应一一一致，没有静默漏源，
没有漏g2-1第二种力，三个multiple均承认全部合法方案而非唯一比例。
每条omitted_tasks和intent.limitations均实质记录相关生产/迁移损失。
这叫**保留判断的覆盖**，不是七个原任务的自主产出能力全完成。

## 公共首句与生产能力边界

Q3四项共同写“A是线段始端和力的作用点”，没有判别力；
选A可能主要靠方向/标度部分，因此不能证明独立认定该作用点。
Q5的接触始端、Q7的大部分起点描述也基本共同；
不把各选项复述位置当作多个独立作用点测试。
作者已有“位置/方向由图提供”“定位/构造未测”等限制，
但未逐字写出Q3四项相同；此精确边界已在冻结view-first及本报告
明记，不替作者增加字段，也不将其“完整说明”解释为独立定位证明。

Q4实际辨析受力对象/始端，Q6的同6cm错对象反向项真实辨关系；
这不补称Q3已检验自主定位A，也不补称Q5/Q7已画两图。
三个绘图转换是完整**文字方案**，无新候选图，也无实际作图操作。
作者没有把独立选比例、用尺、放置点/箭头、标注或解释生成
冒称已经验证；本审查同样不把长度局部正确称全覆盖。

Q5-C、Q6-D、Q7-D各有正确长度却因物理关系错误而为假；
Q7-C的长度/比例内部相容却质量与力单位错1000倍。
Q5-B允许较大力画得更短，Q7-E允许等力不同图长，
都须同时看明确尺度，不能凭裸长度排列或相等性淘汰。
因此仍有实质比例、单位、方向和受力对象判断，
按当前choice标准，记录的生产损失没有使学习任务只剩抄数字。

## 29项推导与误思比较

T=correct，F=incorrect；以下truth同时是冻结盲审与作者truth。
所有12个正确项的misconception均为null；17个错误项均有
可复现错步骤并在当前条件真实为假，不以“常见”代替推导依据。

### Q1 s21-controlled-effects

完整集合：盲审/作者均`{A,B,C}`。

| 项 | truth | 作者derivation/misconception比较 |
| --- | --- | --- |
| A | T | 同一弹簧、弹性静止且同向拉，较大力产生较大伸长，隔离大小变化；不需要普遍线性定律。推导成立，misconception=null。 |
| B | T | 同车同点等大小，从静止受东/西力开始运动方向不同；推导保留方向变量而控制其它条件，misconception=null。 |
| C | T | 同门同大小垂直同向推，离铰链远力臂更大，转动效果不同；推导符合作用点比较，misconception=null。 |
| D | F | 作者删去方向、只比大小和位置→推断同一转动方向，确实生成本项。实际上反向力在非零把手力臂下产生反向转动趋势；错误真实为假。 |

### Q2 s21-vector-reason

完整集合：盲审/作者均`{A}`。

| 项 | truth | 作者derivation/misconception比较 |
| --- | --- | --- |
| A | T | 12N只定大小，东/西方向不同，完整矢量不同；大小与方向都须给定，推导成立，misconception=null。 |
| B | F | 把两力化为正标量12N再仅比较数值/单位→称同矢量，正好生成本项；舍掉方向不能使反向矢量相同。 |
| C | F | 把影响作用效果的作用点提升为整个矢量定义→删除大小和方向，生成该项；一个位置不能提供未给的矢量信息。 |
| D | F | 认力为可见运动再把力分量认作速度→声称有力必运动且速度就是力。静止受力可以平衡，速度也非力，程序匹配而命题真实为假。 |

### Q3 s21-force-diagram-rule

完整集合：盲审/作者均`{A}`。

| 项 | truth | 作者derivation/misconception比较 |
| --- | --- | --- |
| A | T | 图68实见A处起、右上尖端；大小由声明比例下的长度给出，当前无数值尺不能读N，推导成立，misconception=null。公共作用点句本身没有选项判别力。 |
| B | F | 从箭头尖端往始端读→反转方向，同时保留真位置/标度句，确实生成本项；图向右上，不向A返回。 |
| C | F | 把视觉粗细当大小编码→丢弃长度比例，同粗即同力，生成该项；定标情况下长度才对应大小。 |
| D | F | 偷设未声明1N/长度单位→量图长就转N，产生不需尺度的说法；同图长可依不同尺度表示不同N数，当前缺比例使该项为假。 |

### Q4 s21-gravity-weight-recipients

完整集合：盲审/作者均`{A}`。

| 项 | truth | 作者derivation/misconception比较 |
| --- | --- | --- |
| A | T | F作用于袋，P是袋作用于支承物，分别从内部/接触处向下，完整对应成立，misconception=null。 |
| B | F | 只记两向下箭头并交换重力/重量名称→给内部F支承对象、接触P袋重力，恰好生成本项；交换后两个关系都错误。 |
| C | F | 见接触就当支承物对袋，再不反转直接抄向下箭头→生成错误的向下支持力。真实支持力作用于袋向上；P是袋对支承物向下，不能互代。 |
| D | F | 仅按相等大小认同一力→把两受力对象合为袋并准许起点互换，生成该项；同大小不改变施受对象，命题真实为假。 |

### Q5 s21-two-force-plans

完整集合：盲审/作者均`{A,B}`，没有遗漏合法分图比例方案。

| 项 | truth | 作者derivation/misconception比较 |
| --- | --- | --- |
| A | T | 100N/cm下400/100=4cm、50/100=0.5cm；重量向下，击球向右且接触始端正确，misconception=null。 |
| B | T | 分图200N/cm与10N/cm分别得2cm、5cm；明确不同比例使较大力更短合法，不能套同尺度8:1淘汰。推导成立，misconception=null。 |
| C | F | 正确标度不变，把重量误作向上反作用力→反转重量箭头，生成该项。重量向下，即使长度正确整项仍假。 |
| D | F | 倒算100/400=0.25、100/50=2并错标cm，完全生成给定长度。真应为4、0.5cm；给定长度实际代表25、200N，均不符源力值。 |

### Q6 s21-tractor-scaled-traction

完整集合：盲审/作者均`{A}`。

| 项 | truth | 作者derivation/misconception比较 |
| --- | --- | --- |
| A | T | 60000N=60kN，60/10=6cm，工具连接处始端向右，完整推导成立，misconception=null。 |
| B | F | 记1kN=1000N却丢10kN的10，错用1000N/cm→60000/1000=60cm，精确生成候选。真尺度10000N/cm；60cm会表示600000N。 |
| C | F | 已换60kN却倒除10/60=1/6并认作cm，生成候选；应60/10=6cm，反商单位/长度不正确。 |
| D | F | 交换施受对象，始端移到拖拉机且向左，保留同大小→生成工具对拖拉机的反向力。题面要的是工具收到的向右力，6cm局部正确不能救错对象。 |

### Q7 s21-crate-gravity-weight-plans

完整集合：盲审/作者均`{A,B,E}`，同尺度两方案及异尺度方案全保留。

| 项 | truth | 作者derivation/misconception比较 |
| --- | --- | --- |
| A | T | 3000×9.8=29400N=29.4kN；10kN/cm下2.94cm，两受力对象/起点分别正确且均向下，misconception=null。 |
| B | T | 同29.4kN换合法共同5kN/cm→5.88cm，物理对象/方向未变；不强求唯一图长，misconception=null。 |
| C | F | 把3t当3kg→3×9.8=29.4N，再10N/cm得2.94cm，错步骤精确生成整项。长度内部相容，但力值少1000倍，真实为假。 |
| D | F | 把板车对箱的向上力方向复制给重量，仍保留“作用在板车”对象，生成该混合错方案。作者明确是只错拷方向而未同步改受力对象，不是声称真反作用力作用于板车；方向错误真实为假。 |
| E | T | 同29.4kN在各自明示10、5kN/cm下分别2.94、5.88cm，等力异图长合法，始端对象和向下方向正确，misconception=null。 |

## 整包与图证据

七题4single/3multiple，共12真17假。三个multiple完整集合分别
ABC、AB、ABE，与先行独立判定一致，不把其中某一个真项当完整键。
Q3的图示规则、Q4的受力关系可用于后续题，是知识应用而非泄露
它题完整集合；Q5/Q6/Q7仍各须核不同力值、比例/单位及对象。
完整说明/方案识别和合理淘汰按当前标准不自动失败，
但生产能力损失和共同句非判别维度均保持明确。

new_figures为空，故无新图审批。复用源阶段已实际完整打开的图：

- fig68完整640×640：A在物体/箭头始端，向右上，最右尖端和
  物体底部完整，无数值尺；当前资产hash
  `26f8b596c233d0468cf5c190e10e71c87312b88332946d004b6fb408b0829f18`。
- fig69完整640×560：左F内部起向下，右P接触处起向下，
  10N尺及右端/底部完整；当前资产hash
  `a9c32beeb29aa87c1782b61554aed93b495330b6b9a7d3aeb4dc44a821bfcee9`。

没有重审/重画图，不沿作者预览打开辅助图替代先行像素证据。
图69的10N尺没有移植为任何自选比例题的强制比例。

## 验证与结束

仅新增本key-comparison.md和当前snapshot绑定的review.json。
不改seed/draft/view、作者解/notes、先行source-first/view-first、
任何图或其它代理文件。本轮未发现真实首次FAIL；
未消耗作者修复额度，也未隐藏或规范化一个失败以迎合key。

报告写入后实际运行一次：

```bash
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s21/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s21/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s21/review.json
```

上述命令实际运行一次，退出0，输出：
`mechanical checks passed; declared semantic review: pass (not automatically proved)`。
验证确认结构、源新鲜度、资产及seed/draft/review绑定一致，
不自动证明语义；29项独立语义依据及实际图观察另如上记录。
未另跑无review作者检查，未修作者稿，未改冻结判断。完成后停止。
无DB/Git/app、依赖、模型、源/现代编辑、assemble、发布或晋升。
