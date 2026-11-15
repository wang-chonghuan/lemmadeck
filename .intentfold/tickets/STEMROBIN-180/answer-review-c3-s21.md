# §35 phy6-c3-s21 独立答案审查

2026-11-15。Sagan，independent_agent，不是正文、图或答案作者。

**结论：PASS。四道问题及练习16三道作图题，共七题，全部通过本次唯一实质键比较。derived=7、ungraded=7、auto=0，七项parts均为空。**

首次实质比较时键status=draft；收尾时main并行收口为ready，只有status/count元数据改变，见下方附记。本报告仅为答案审阅，不是本审查者执行answer-finalize、发布或新的图审批。

## 审查顺序与依据

先复用 `.intentfold/tickets/STEMROBIN-180/tmp/answers/batch-5-independent-source.md` 的s21七题独立解，再读取本课持久现代 `answer-keys.json`、真实 `lesson.json`/`exercises.json` 及prepare空模板比较。遵循ld-s10y-answer gate2；未重做源解、全文或整图审查，未修改先行解迎合键。

按main已确认的图68/69独立PASS晋升状态，复用既有源解与批准图义：图68始端A、右上方向；图69分别以物体内部和支承接触处表示重力与重量。没有重新打开或批准整图，也未把图像像素比例当作厘米测量。未读取s20键、choice、作者计划或其他答案。

## 七题逐项结论

### 1 / g1-1 / p0092#8：三因素举例

**PASS。** 大小用同一弹簧在适用弹性范围内受较大拉力、伸长较多说明；方向用拉伸/压缩及同一扇门开/关说明；作用点用完成相同开门任务时近门轴与远把手的费力程度说明。三因素均覆盖，不把材料、任务或方向同时改变的结果简单归给一个变量。符合现代p0091#5/#7/#8及先行解，不无限泛化弹簧比例关系。

### 2 / g1-2 / p0092#9：为什么力是矢量

**PASS。** 明确力有大小和方向，同样大小、不同方向可能产生不同效果；作用点影响具体效果，但不能用“只有作用点”替代矢量特征。符合现代p0091#6及先行解，义项完整。

### 3 / g1-3 / p0092#10：在图上表示力

**PASS。** 单箭头线段、始端在作用点、箭头表示方向、按注明比例用长度表示大小，四项均给出。A在始端而非尖端；1 N对应0.5 cm时，5 N对应2.5 cm，复算正确。右上方向不冒称45°，2.5 cm来自正文示例而非截图测量。符合现代p0091#9和批准图义。

### 4 / g1-4 / p0092#11：重力与重量画法

**PASS。** 重力作用在物体本身，从内部代表性位置向下；重量作用于支承物/悬挂物，在相应作用处起画。水平静止面粉袋例子中，两者同向、等大而作用对象/始端不同；向上支持力不是重量。5 kg × 9.8 N/kg = 49 N，正文约50 N的口径说明准确，不把约数当精确值，也不外推任意运动中始终等大。符合p0091#10、p0092#5/#6及图69批准图义。

### g2-1 / 练习16原题1 / p0092#13：400 N重量与50 N水平击球力

**PASS。** 两项任务均完整。示例1 cm代表100 N，分别画4 cm和0.5 cm，长度比8:1，数值与单位正确。

重量明确声明采用水平支承示意，从物体对支承物的接触处向下；击球力从球的受击作用点、按声明的水平向右方向画。左右方向及支承是解答选择，不冒充题面给定图；合适的向左示意也有效。其他正确自选比例有效，分别采用不同比例时各自注明。两项均要求标力、比例、始端和方向，未退化为只给两个线长。圈号两项均有对应答案，ungraded不会用示例长度误拒其他有效作图。

### g2-2 / 练习16原题2 / p0092#14：60000 N牵引力、指定比例

**PASS。** 60000 N = 60 kN；1 cm代表10 kN，线长60 ÷ 10 = 6 cm，复算正确。答案还要求从示意被牵引物体的连接处起画，沿声明牵引方向画单箭头，标F=60000 N或60 kN及指定比例。

水平向右只是明确的示意选择；题面没有规定左右方向，不借图67的车向或附图坐标限制答案。K-700只保留现代题面已有的模型编号，不新增国家、历史身份或性能数据。**6 cm仅为完整作图的一部分，本键没有因此设置auto或numeric part。**

### g2-3 / 练习16原题3 / p0092#15：3吨箱子在静止板车上

**PASS。** 3公制吨=3000 kg；在本课水平静止支承且无额外竖直外力的简化情境，取g=9.8 N/kg，F=P=29400 N=29.4 kN。示例1 cm代表10 kN，两箭头各长2.94 cm，复算正确。

重力从箱内代表性作用点向下，重量从箱子作用于板车的接触处向下；不同受力对象和作用位置均保留，P不是板车对箱子的向上支持力。沿本课圆整估算口径，可以注明约30000 N及约3 cm，但不把2.94 cm写成精确等于3 cm。其他正确且注明的自选比例有效；标准答案不只给29.4 kN而遗漏两个箭头。

## 全包覆盖、来源及判题边界

- 实际七题与七键一一对应：问题1–4为g1、source_number=1–4；练习16为g2、原号1–3对应g2-1/g2-2/g2-3，page refs逐题一致，无漏题、重复或跨栏目串号。
- prepare模板和当前键的exercise/prompt/source/figureEvidence逐项相等，prompt逐字对应当前现代题面。prepare空displayAnswer和null grading不是实质依据。
- 当前持久上层prose、section_breaks、exercises与先行解所用模板字段逐字段相等；本次只核答案依赖延续性，不重复正文审批。
- 当前两份source.path解析到本课assembled source；完整字节哈希等于各自source.sha256及先行解的源哈希，source.data与当前source JSON结构一致。source.data只作绑定核验，不当作现代题面。
- 七条都是derived，无bookRaw；没有把先行现场解伪装为书后答案。标准答案完整覆盖举例、矢量解释、表示方法、画法区别及全部三个作图任务。
- 所有题面figure_refs/figures、prepare与当前键figureEvidence均为空；正文仍有图68/69。空引用不等于无正文图，不伪造本次新增图审或figureEvidence。
- 全部ungraded、parts=[]恰当：开放说明、自选比例、作用点/方向和作图结构不能只靠exact/numeric/expression可靠判断。没有将6 cm、2.94 cm或示例4/0.5 cm硬设为整题auto。
- 通用notes不增设题面义务，也不替代displayAnswer的完整理由。无exact/numeric/expression parts，MathLive自动判分链不适用。
- 实际Node只读assert通过身份、七条prompt、栏目/原号、source哈希/快照、模板延续性、derived/ungraded/空parts及无重复检查；局部数值复算通过。未运行prepare、finalize、publish、产品或整套测试。

## 当前实际SHA256

路径相对 `/Users/yong/.codex/worktrees/0f12/lemmadeck`。均为Node crypto计算的完整文件字节哈希。

| 文件 | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s21/answer-keys.json` | `56b2a91f51e197982ce90f223decdb5db0a4c4f68a8d7d06fa33eaac35740cc7` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s21/lesson.json` | `c89f62a961618e1e5fa11060e03c0c6211f24ba62b471e61d2a4ce0746300d43` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s21/exercises.json` | `991d8124fd84cbdde48a7a7b3c2544967f4d434909a4bd95971773d44b6b111a` |
| `.intentfold/tickets/STEMROBIN-180/tmp/answers/batch-5-independent-source.md` | `430e914454b2387a5191ba68137db323009b30840910aa1acd77ef51802d48b2` |
| `.tmp/ld-s10y-answer/6p/modern-us-neutral/lessons/phy6-c3-s21/answer-keys.template.json` | `18a4a24af6445b9540be24c04985b97540a71ff2d1457ebf884845150ff59b25` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s21/lesson.json` | `4ec8309756d54a472a468ae92fe9a0653d9b1f5c3ac1027039cada4f3b79154f` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s21/exercises.json` | `6e0da1ceca2bd3ba0d58758053be44bd2a46fc78be2f36dbae6548ef77aa7f61` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s21/lesson.template.json` | `2c606df09eece61650ad678c11d340a4d2cc55cc16bf610b8215a9e5a0b1e953` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s21/exercises.template.json` | `3eda9387f883b2d3a6c18d09edac1ea326bf10b622aa67aefbe874002869f89d` |

## 并行收口的最小绑定附记

首次已审draft SHA256为 `ffa257dba2aebda4ba957099b10ca78aa729a202332db42264ecaa3797f5d8fb`，不删除这一审查事实。最终freshness核对发现main并行将status改为ready并增加count=7，现键SHA256为上表的 `56b2a91f51e197982ce90f223decdb5db0a4c4f68a8d7d06fa33eaac35740cc7`。

只读结构检查：将当前JSON在内存中恢复status=draft并移除count，按原缩进及末尾换行序列化，其字节SHA256精确等于上述首次已审draft hash。故除这两个元数据字段外，七项answers及全包内容未改；本次仅绑定当前ready快照，七题独立实质结论不变，也没有再次求解或修改作者键。

本答案任务只新增此报告，未改键、先行源解、源、模板、图、工具或其他报告。无DB/Git/.env/服务/外部模型调用，不finalize、不发布、不消息其他会话。精确部署模型、推理设置及累计输入/输出/总token不可观察，均未知。
