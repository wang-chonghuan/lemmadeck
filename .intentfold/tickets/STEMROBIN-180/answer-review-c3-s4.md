# §18 phy6-c3-s4 答案独立 Gate 2 审查

2026-11-15，STEMROBIN-180既有短时独立审查者，非答案作者。结论：**PASS，四答案全部通过本轮内容及判分合同审查**。仅针对当前 modern-us-neutral lesson/exercises/answer-keys，复用此前盲解 source-review.md；不重做已关闭的choice审查。

## 四题结论

1. **问题1 PASS**：lesson.prose[2]限定本课变速运动中给定路程或时间间隔的平均速度。答案保留范围及整体快慢，不扩张成所有汽车速度说法都只能指平均速度。平均与某一时刻速度是定义不同的量；这里不作两者数值永远不可能相同的推论。定义和解释用ungraded、空parts合理。
2. **问题2 PASS**：prose[2]/[7]的路程/时间算法完整；答案明示同一范围、总路程/总时间、t>0、相容单位及连续两段( s1+s2 )/( t1+t2 )。否定不加权算术平均作为通用算法，不遗漏研究范围，也不偷换为位移/时间。开放定义与说明用ungraded合理。
3. **g2-1 PASS**：Alex为500/39.5=1000/79≈12.66米/秒；Morgan为500/37.0=500/37≈13.51米/秒。同为500米、37.0<39.5，所以Morgan平均更快，但不推出每一时刻更快。原问所需Alex计算和Morgan比较理由都在displayAnswer，额外Morgan数值正确；整题ungraded避免仅一个数字判整个解释任务。英文姓名与现代题面逐人一致；1963/1975仍是题给情境，答案未改年份、未伪称核实历史纪录，也未用年份先后判断快慢。
4. **g2-2 PASS**：坡段50米/6秒=25/3米/秒；随后30米/15秒直到停止，全程(50+30)/(6+15)=80/21米/秒。两待求量按原顺序独立成parts，标签区分坡段与全程，单位均为米/秒。没有漏第二段时间、混用分母或把终点停止误作平均为零；不假设匀减速或增加停留时间。两量都可确定性数值判定，auto合理。

## 覆盖与实际检查

- 当前lesson.exercise_count、exercises.count均为4；题号/答案顺序严格为1、2、g2-1、g2-2，无漏题、重题或栏目混号。四项均source=derived，无bookRaw；本轮没有读取书后答案。lesson及四题均无图。
- 三项ungraded的parts为空，但展示包含所有所求内容；g2-2有且仅有两个numeric parts。精确分数LaTeX为`\frac{25}{3}`、`\frac{80}{21}`，不含解释文字或单位，单位另存字段。
- 实际运行现有`check_math_expressions.mjs`仅检查本answer-keys：退出0，status=pass，checked=2，failures=[]。
- 本地结构断言及ComputeEngine数值探测：退出0，20/20预期一致。坡段接受25/3、50/6、8.33、8.3333，拒绝8.3、8.34、80/21、0；全程接受80/21、80/(6+15)、3.81、3.8095，拒绝3.8、3.82、31/6、80/15、80/6、25/3、0、2。
- 两个tolerance均为0.005；两位近似误差分别为0.0033333333333338544、0.00047619047619074095，小于容差。静态核对当前`textbook-answer.ts`：numeric使用有限实数的绝对差<=tolerance，auto要求全部parts且每项通过。本地探测复现这一数值条件，不冒充实际提交API或浏览器验证；它允许容差范围内其他数值，并非只允许两位小数。
- 辅助隔离判分函数的首次尝试因本地typescript未提供AST API而中止，未调用判分函数；随后采用上述现有检查器、ComputeEngine探测及产品代码静态核对。没有把失败尝试称为通过，也未导入server/DB模块。
- 本组没有exact判分项，Gate 2的MathLive exact真实编辑检查不适用。本轮不运行finalize/publish，answer-keys仍为draft；PASS不表示已发布或已做端到端提交检查。

## 实际读取文件与字节 SHA-256

所有路径以下列工作树为根：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。lesson/exercises/answer-keys及既有source-review的末次哈希与首次读取时一致。

| 路径 | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s4/lesson.json` | `35c563a5e5124d3f80a39527d830787be3c2a9dfba9df90e55c070565ff52481` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s4/exercises.json` | `48642a1bac6defe8c509784bc2740ee2e5f6fec2a1874ec98fe0b939f6a7151d` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s4/answer-keys.json` | `65c004d8f16bf9af29b6b56929f635545f5db64fa842a3dfdbe2820a61426736` |
| `.intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s4/source-review.md` | `303375c6a6cf9335052ffd1e8d458dff19f2964018209114271864b73e4ceaa0` |
| `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md` | `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` |
| `.claude/skills/ld-s10y-answer/tools/check_math_expressions.mjs` | `2b9e236faf57a5ff2860c5ea2961ad57dfb99b5fc3218eb5e12bcb5404f9a281` |
| `app/src/lib/textbook-answer.ts` | `bee990b6367f8111ab30a4409c28d5e9387a01068c0bf27376326dfe4fe8ff8f` |

只新增本报告；既有独立源解、choice和作者文件均未修改。0新交互、0实际提交；未读取.env、DB或其他课答案，未调用网络/模型服务，未发布、finalize或Git操作。精确模型ID、推理设置、运行agent ID及完整token计量未知；可观察审查量为4答案、2个numeric expected、20项数值探测，工具输出计数不代表模型总token。任务到此停止。
