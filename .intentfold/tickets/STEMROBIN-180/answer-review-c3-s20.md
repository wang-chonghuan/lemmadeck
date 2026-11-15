# §34 phy6-c3-s20 独立答案审查

2026-11-15。Sagan，independent_agent，不是正文、图或答案作者。

**结论：PASS。四道完整书写题均通过本次唯一实质键比较；derived=4、ungraded=4、auto=0、四项parts均为空。**

实质审查快照的作者键status=draft；持久现代lesson/exercises为ready。只审答案，不代main执行answer-finalize或发布。

## 顺序与范围

先读取既有 `.intentfold/tickets/STEMROBIN-180/tmp/answers/batch-5-independent-source.md` 的s20四题独立解，再读当前持久现代 `answer-keys.json`、真实 `lesson.json`/`exercises.json` 及prepare空模板比较。依据ld-s10y-answer gate2，复用既有独立源解与正文审查，不倒改先行解、不重做全文。

图65唯一固定guide修复PASS及66/67批准图义复用：65的guide固定、杆活动；66是手握压椭圆弹簧及内部示数机构；67测力计串接于牵引连接。没有重新打开或审查图、生成图证据或变更图稿。其他九题答案未读取或重审。

## 四题逐项结论

### 1 / g1-1 / p0090#13：仪器名称与构造原理

**PASS。** 标准答案同时给出测力计名称和弹簧测力计的比例原理，完整保留题面两个义项。明确比较同一弹簧在适用弹性范围内、相对于未伸长零位的形变量，而不是弹簧总长度；标定已知力与形变量后按指针位置读数。不同弹簧不能直接共用标定，避免将相同伸长量无条件解释为相同力。

与现代p0089#3、制法段及先行解一致。无虚构弹簧常数、图上长度测量或只给仪器名称的漏答。说明任务使用ungraded、parts=[]合理。

### 2 / g1-2 / p0091#1：制作最简单的测力计

**PASS。** 白纸木板、固定弹簧、下端带钩细杆、杆上部指针、固定guide中上下移动及未伸长时标零，装置与步骤完整。guide不随杆/指针移动，符合65已批准的唯一修复图义；答案没有把首轮失败结构重新写回制法。

标定按本课g=9.8 N/kg、悬挂重物且待指示稳定的静态情境：1/9.8 kg标1 N，二倍、三倍质量标2/3 N。同一弹簧、同一零位、适用弹性范围及不过度拉伸条件均保留；未用未经限定的加速悬挂情境替代静态标定。

课文102/204/306 g全部明确称为圆整质量；1/9.8 kg约102.04 g，102 g产生约1 N而非精确1 N。独立数值核对：

| 质量 | g=9.8 N/kg下重力 | 本课圆整标定 |
| --- | --- | --- |
| 102 g | 0.9996 N | 约1 N |
| 204 g | 1.9992 N | 约2 N |
| 306 g | 2.9988 N | 约3 N |

三项近似关系由圆整声明覆盖，未声称整数克砝码精确产生整数N。答案继续给出相邻1 N间隔十等分的步骤，足以完成制作方法而非只答砝码质量。符合p0089#4/#7、p0090#1/#2及先行解。

### 3 / g1-3 / p0091#2：0.1 N分度

**PASS。** 先正确标定整N刻度，再把每个相邻1 N间隔十等分，每小间隔1/10 N=0.1 N；0–1、1–2、2–3 N均属此方法。答案明确不是把0–3 N整个量程十等分，并保留同一已标定弹簧在适用弹性范围内的比例前提。

与现代p0090#2及先行解一致。描述后续标定方法，不冒称现图65已绘出完整2/3或小数刻度，不猜每格厘米长度。开放方法说明维持ungraded，无局部数值auto。

### 4 / g1-4 / p0091#3：握力计与牵引测力计用途

**PASS。** 两者均回答：握力计测手的握力，手压缩椭圆弹簧，经示数机构使指针偏转；牵引测力计测较大牵引力，例如牵引载物车，仪器位于两车的连接处，可测几万N量级。

符合现代p0090#5/#8/#9及66/67批准图义；没有将握力计当质量秤或把牵引测力计限为测重力。几万N是正文能力范围，不是图67当前读数。答案明确没有可确认的表盘单位倍率，不将0至5杜撰为某个N/kN结果。两种完整用途及边界保留。

## 全包覆盖与只读绑定检查

- 实际题数、exercise_count、四题与四键均一致。题号1–4各恰有一个键；group_id=g1、source_number=1–4、栏目及pages对应原问题，无漏题、重复或跨课错号。
- 当前键与prepare的exercise、prompt、source、figureEvidence逐项相等；prompt逐字对应当前现代题面。prepare的空答案/null grading是待填槽，不当成作者解或正确性依据。
- 当前持久上层prose、section_breaks、exercises与先行解所用现代模板对应字段逐字段相等，仅核答案依赖延续性，不重复全文审批。
- 当前lesson/exercises的source.path解析到本课assembled source；完整字节SHA256等于各自source.sha256及先行解记录，source.data与对应当前source JSON结构一致。内嵌source.data只用于绑定，不替代现代上层语义。
- 四条都是derived，无bookRaw，不冒充书后抄录。四题figure_refs/figures及prepare/键figureEvidence实际为空；正文有65/66/67，不把空题面引用宣称为整课无图，也不伪造本次新图审批。
- 定义、原理、制作方法和用途均属完整解释任务；全部ungraded、parts=[]适当。未用一个仪器名、质量或0.1 N局部结果机械判整题正确。
- 实际Node只读assert通过身份、四题完整prompt、来源、栏目/原号、source快照、模板延续性、derived/ungraded/空parts及无重复检查；近似标定和1 N十等分数值核对通过。
- 通用notes不增设额外题面义务。没有exact/numeric/expression parts，MathLive判分链不适用。未运行prepare、finalize、publish或产品/整套测试。

## 当前实际SHA256

路径相对 `/Users/yong/.codex/worktrees/0f12/lemmadeck`。均为Node crypto实测完整文件字节哈希。

| 文件 | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s20/answer-keys.json` | `401663cef9941f8342b2b556afb6701c6b7b701765458099b14f0194843f1dcd` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s20/lesson.json` | `30d0dd0d6d3cab56352467b5f5e38a1e6b134d90c58905f6280d5c65383b9e8c` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s20/exercises.json` | `d272e4e50073b18ae36216d1969f05bfcd74b9ad075f0d2f3202cc0d866a51de` |
| `.intentfold/tickets/STEMROBIN-180/tmp/answers/batch-5-independent-source.md` | `430e914454b2387a5191ba68137db323009b30840910aa1acd77ef51802d48b2` |
| `.tmp/ld-s10y-answer/6p/modern-us-neutral/lessons/phy6-c3-s20/answer-keys.template.json` | `ec192647337935c54afecfdb67cae84d99369d460e525e1cada09767a8428512` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s20/lesson.json` | `d1c53703b3e18a2a5eb8ce22df25a2f7252a7ea03b7f220941906670d866dc2e` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s20/exercises.json` | `749b62c247cecc8a9f01eea1348e7af3e220c2681745b35e995f68460a257782` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s20/lesson.template.json` | `154731b18ac6f73c87af461fe38488c2abdb90bfbfb3fe9d99d53fa98e50dc35` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s20/exercises.template.json` | `dfb3f54e334ef086316ec946da06eb77d532f9edf5b0e4f370aa175e056010ea` |

本次仅新增此报告。未修改键、先行源解、图、模板、源或工具；未finalize、发布、访问DB/Git/.env/外部服务、调用外部模型或消息其他会话。精确模型、推理设置及累计输入/输出/总token不可观察，均未知。完成后停止，main负责finalize。
