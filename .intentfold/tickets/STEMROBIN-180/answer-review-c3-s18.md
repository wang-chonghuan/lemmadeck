# §32 phy6-c3-s18 独立答案审查

2026-11-15。审查者 Sagan，independent_agent，不是正文、图或答案作者。

**结论：PASS。两道完整书写题均通过本次唯一实质键比较；derived=2、ungraded=2、auto=0、两项parts均为空。**

作者键当前status仍为draft；本报告不是answer-finalize、图件审批或发布证明。

## 顺序与范围

先读取既有 `.intentfold/tickets/STEMROBIN-180/tmp/answers/batch-5-independent-source.md` 的s18两题独立解，再读取持久现代s18 `answer-keys.json` 及真实 `lesson.json`、`exercises.json` 比较。没有重做源解、全文审查或图审，没有倒改先行解来迎合作者键。

执行依据为 `ld-s10y-answer/SKILL.md` 与 `references/gate-2-lesson-answers/gate.md`。另读取本课prepare空模板，进行只读身份、题面及来源一致性核对。未读取s20/s21键、choice、作者计划或其他答案；未提前复审fig65。

## 逐题结论

### 1 / g1-1：什么叫做物体的重量？

**PASS。** 当前题面对应现代问题1、source_number=1、group_id=g1、p0082#3，与prepare及先行解一致。

作者完整定义为物体由于受到地球吸引而作用于支承物或悬挂物的力，准确保留重量的施力对象是物体、受力对象是支承物/悬挂物。放置时是物体对支承物的压力，悬挂时是物体对悬挂物的拉力；不把支承物对物体的支持力当作重量。与现代定义段p0081#11/#14及压缩/拉伸说明p0081#10一致。

答案明确重量是力而非质量，也不把它仅当作重力的另一个名称。没有用P=gm或单一数值取代开放定义；本题不要求计算、单位换算或一般动态情境公式。derived来源合理，displayAnswer完整；ungraded及parts=[]适合此说理任务，不存在auto误判。

### 2 / g1-2：物体的重量和作用在物体上的重力有什么区别？

**PASS。** 当前题面对应现代问题2、source_number=2、group_id=g1、p0082#4，与prepare及先行解一致。

答案分别写明地球对物体施加重力、物体对支承物/悬挂物施加重量，正确区分施力物体、受力物体和作用位置；与现代区别段p0081#15、p0082#1一致。没有把两力画在同一个受力对象上，也没有把它们误说为一对作用力与反作用力。

图69的袋内向下重力与接触处向下重量说明，符合先行源解已实际看图所得的位置区别；向上支持力明确不是重量。此处复用既有原图证据和课文引用，不声称本次打开或批准了新现代图69。

“大小相等、方向都向下”被明确限定到本课水平静止支承例子，未泛化为所有加速、失重或额外受力情境。核心区别完整，不因未推导一般动态公式而漏答。derived、ungraded、parts=[]合理，无需用一个术语或数值机械裁定整题。

## Prepared / Current绑定与只读检查

- 当前持久lesson/exercises均为ready，book/lesson/edition身份正确，exercise_count与实际题数均为2；题号1、2各有且仅有一个键，无遗漏或重复。
- prepare模板的exercise、prompt、source及figureEvidence逐项等于当前键；其prompt也逐字等于当前现代题面。prepare的grading=null、displayAnswer为空是待填槽，不当成作者答案或实质依据。
- 两题均保留source_number、group_id、栏目和原page refs；没有把不同课重启的题号错误串接。
- 当前持久上层prose、section_breaks和exercises，与先行解所用现代模板对应字段逐字段相等。只为本次键比较核对延续性，不重复批准完整正文。
- 当前lesson/exercises的source.path均解析到本课assembled source；实际完整字节SHA256等于source.sha256，也等于先行源解记录。两份source.data均与当前对应原source JSON结构相等；现代语义判断仍只使用上层字段。
- 两题figure_refs、figures及键figureEvidence均为空，与prepare一致。正文仍引用图60/69，不能由空figureEvidence宣称整课无图或已解除图门禁。
- 实际Node只读assert全部通过：prepared/current身份及题面、source/figureEvidence、现代字段延续性、两条完整derived/ungraded键、空parts和无auto。
- 无bookRaw，不冒充书后抄录；不为derived解读写书后答案。两个notes是通用流程说明，不是额外题面要求；没有据此要求本课制作或作图。
- 本批无exact/numeric/expression parts，MathLive输入或数值判分检查不适用。未运行prepare、finalize、publish或产品测试；不以本报告替代main的收口。

## 实际SHA256

以下路径相对仓库 `/Users/yong/.codex/worktrees/0f12/lemmadeck`。哈希均由Node crypto对实际完整文件字节计算，不是手猜或canonical重编码。

| 文件 | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s18/answer-keys.json` | `0c547704ea5bae51b8832147b7512634b8d29390d77cf6d9429f9e95dfd5fb70` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s18/lesson.json` | `6446471a2741d90554a80ceeacb30e6e1df1e89ec67ca88dba01736bf05969aa` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s18/exercises.json` | `dfe48af1eb034abf95a418449ea7896d80269f07e60bb9dfc5fa8177b2e9c0d5` |
| `.intentfold/tickets/STEMROBIN-180/tmp/answers/batch-5-independent-source.md` | `430e914454b2387a5191ba68137db323009b30840910aa1acd77ef51802d48b2` |
| `.tmp/ld-s10y-answer/6p/modern-us-neutral/lessons/phy6-c3-s18/answer-keys.template.json` | `2f50ba7063e03385b4ff92041ee9f50ed2660d6ae0c9e7ecea3b1b7c044dce9f` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s18/lesson.json` | `320ee195e434f53f0e65603e4e99ee594273e628da33e178746fcfa314597061` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s18/exercises.json` | `2517c0acb65a3a147bfd42a58467ec4eb891a1f2816b9a41b3dbe7f13d6b25ef` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s18/lesson.template.json` | `10e86dd05f3e829a2b225bf2e79e5dc1261c94009de0a779355618fb4523c956` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s18/exercises.template.json` | `ac8fb24421155a7a45e6645edcfba7359a3a4e3b2b20a04d81a576d2c4c53b7a` |

本次只新增此报告，未修改答案、先行解、源、模板、图或工具；未finalize、发布、访问DB/Git/.env/外部服务或消息其他会话。精确部署模型、推理设置和累计输入/输出/总token不可观察，均未知。审查完成后停止。
