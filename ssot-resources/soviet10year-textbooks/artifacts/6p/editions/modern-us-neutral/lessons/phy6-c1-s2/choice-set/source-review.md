# phy6-c1-s2 独立源解

审查阶段：仅原始书写任务求解；尚未读取作者 draft、view、内部解或答案集合，未开始题面、覆盖或选项审查。
审查者：当前获授权的短时独立审查代理，与生产作者分离；未创建其他会话。
输入：本目录 seed.json 中的 exercises 和 concepts（block 0、1、2）。figures 为空；没有实际图资产需要或可以检查。
快照：seed.json 原始文件字节 SHA-256 为 `e7a2b4fbbb0acc0afe68615d4f0bf1bed0e40c6b728071efff292f27719fc17f`。此值不是 contract 所规定的 canonical JSON digest，不应直接填入后续 review.json 的 seed_sha256。

## 原始任务 1

题目：什么是物理学？

独立解：物理学是一门关于自然的科学。结合本节研究对象，可说明它研究力学、热、电、光等物理现象及其规律。
证据：block 0 直接定义“关于自然的科学”；block 1 给出所研究现象的类别。
关键任务：给出学科的含义，不能仅回答该词的希腊语词源或把物理学等同于全部自然科学。

## 原始任务 2

题目：物理学研究的是什么？

独立解：依本节列举，研究力学现象、热现象、电现象和光现象，这些统称物理现象。
证据：block 1 直接给出这四类。
关键任务：说明研究对象。“自然”这个上位概念本身不足以区分物理学与其他自然科学；本节列举也不应被解释为对现代物理分支的穷尽断言。

## 原始任务 3

题目：举出几个物理现象的例子来。

独立解：石子的下落是力学现象；冰的融化、水的沸腾是热现象；闪电涉及电现象；炽热灯丝发光涉及光现象。
证据：这些例子均明确列在 block 1；类别对应是对现象的独立识别。
关键任务：举出多个具体的变化或过程，而不是只列物体名称或学科名称。一个过程可以涉及不止一类物理现象，例如灯丝发光还涉及热；上述分类不主张类别互斥。

## 原始任务 4

题目：为什么说物理学是一门基础自然科学？

独立解：其他研究自然的科学需要利用物理规律来解释各自的现象，因此物理学为它们提供基础。例如地理学借助物理规律解释气候、河水流动和风的形成。
证据：block 2 明确列出天文学、化学、地理学、植物学、动物学及其对物理规律的利用。
关键任务：给出“其他科学利用其规律”的理由。“研究自然”不能单独解释“基础”；也不能据此断言其他学科都只是物理学或没有自己的研究对象。

## 原始任务 5：源内证据阻断

题目：是谁把“物理学”一词引入科学的？

独立结论：在当前获准读取的 seed 内，无法确定人物，不能形成可信的唯一人名答案。
证据：block 0 只说该词来源于希腊语、意思是“自然”；block 1、2 只说研究范围和学科关系。五个任务的原文也未给出人物、年代或相关历史材料。词源和词义不推出某个人首次使用该词的事实。
歧义：“引入科学”可能指古希腊术语的使用、相关著作的命名、近代学科名称的确立，或者中文名称的引入；题目未限定语言、时期和判定标准。即使补上一个惯常人名，也不能仅凭当前材料证明这些不同说法等价。
结论等级：`blocked`，原因是缺少可支持唯一历史归属的源内证据及未明确的历史口径，不是已发现某个作者选项错误。本轮不访问外部历史资料，不把记忆中的惯常答案当作源内事实。
关键任务：识别明确历史归属；不能悄悄替换为“词源是什么”，也不能无说明地遗漏本题。后续如仍要求人名判定，应先取得获授权的原始历史材料和明确口径。

## 阶段结论

任务 1 至 4 可独立求解；任务 5 记录为源内历史证据不足。尚无 draft，因此不作 coverage、question_reviews 或整包 outcome 判定，未生成 review.json。
概念中的文字可直接理解；无图检查不意味着检查过 trace 所列的原始文件，本轮未打开那些文件。

## 运行披露

日期：2026-11-15。可见身份为 Codex，开发者描述为基于 GPT-5；本次运行的确切模型 ID、版本、推理档位及总输入/输出/推理 token 计量均未暴露，未知。工具返回的输出 token 计数仅描述工具输出，不是模型用量。

## seed-v2 补充源解：原始任务 5

补充日期：2026-11-15；在读取任何 draft 的 view、内部依据或键之前完成。本段只补充新快照下的结论，不删除或改写上面的旧 seed 阻断记录。
新输入：同目录 seed-v2.json，概念 block 4 新增本课的科学史记述；exercises 未改变，figures 仍为空。
新快照 canonical JSON SHA-256：`b1bc2952d17adc0f1f10cf65cfc4dd279239bf3dfdb9ceb8dbe00fe78c2dffdc`，由 `python3 .agents/skills/ld-s10y-choice/scripts/prepare.py digest .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s2/seed-v2.json` 实际计算。

独立解：只按本课科学史所说，把“物理学”一词引入科学的是亚里士多德；把这一词引入俄语的是罗蒙诺索夫。block 4 的“正是他”承接前句的亚里士多德，而后半句另行明确俄语传播者，两个身份不能交换，也不能合并成同一人。
证据：block 4 同时明确了人物和对应行为，不再需要从词源推测人名。block 0 的希腊语词源与这一课内回答相容，但它本身仍不提供历史归属证据。
边界：这是课程文本归属辨认，不是对普遍科学史“最早”“首次”的独立考证；未查证古希腊术语的历史起点、近代学科命名或中文名称。后续题干须保留“本课科学史所说”这类范围限定，不能扩张成普遍最早史实。
新快照下的源解状态：历史任务可以按上述限定作确定回答；旧 seed 缺少历史证据的 `blocked` 记录仍成立于旧快照。其余四个任务的独立源解不变；题稿审查尚未开始。

## 题稿审查与共享源快照阻断

后续先只读五课的 `{id, view}` 投影并独立求解，再读完整 draft 比较作者依据与键。共 12 道选择题、52 个选项；全部物理或课内文本归属真值与作者键一致，无实际引用图，新图为空。
s2 的 history.answer_leakage 记录为 `revise`：题干额外指定“古希腊学者”，而四个人物中只有亚里士多德符合，学生可按身份而不是“引入科学”与“引入俄语”两个动作作答。该拒绝保留在 review.json，未因物理真集一致而改成 pass。其余逐题语义维度没有发现需要修正的缺陷。

使用现有 validate.py 验证五个 seed/draft/review 组合，全部返回 exit 2：`contract error: seed projection/source/asset changed; prepare again`，没有进入可确认的最终通过结果。逐文件实际哈希核对发现：

- 五个 seed 共用的 `ssot-resources/soviet10year-textbooks/artifacts/6p/book.json`：trace 记录 `73968f2ad84b697043d193068aa580b13b4ebd3ffdec3006fc5c812a04bef93d`，当前原始字节为 `f4e709e1181a239bf86ba1296acbe37a26698e2fcc93fbfabb4e189eef1fd053`。
- 五课各自 lesson.json、exercises.json、figures.json 的共 15 个 trace 哈希均仍匹配。
- 本次只核对这些源文件字节哈希，没有打开其正文；不推测 book.json 的变动原因或语义影响，不修改别人的变动，不自行修补 seed。

因此五份 review.json 的来源覆盖门禁及总 outcome 最终均为 `blocked`。这是当前源快照绑定未通过，不是把已经完成的独立物理判断说成无法求解；s2 的真实题面 revise 和原始旧 seed 的历史证据 blocked 都保留。
review 中 seed_sha256、draft_sha256 全由 `prepare.py digest` 实际计算，不使用原始字节哈希冒充 canonical digest。

验证命令在仓库根目录执行，五次完整参数如下：

```bash
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s2/seed-v2.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s2/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s2/review.json
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s3/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s3/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s3/review.json
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s4/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s4/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s4/review.json
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s5/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s5/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s5/review.json
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s6/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s6/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s6/review.json
```

## 冻结 book 后的当前快照复审

本轮先将五课原 review.json 原样复制为各自 review-rejected-1.json，逐文件 cmp 确认字节一致，再修改当前 review.json；旧来源阻断、history 的身份提示 revise 和此前旧 seed 的历史证据拒绝均未丢失。

核对五课 seed-current.json：s2 以 seed-v2.json 为基准，其余以各自 seed.json 为基准；仅 trace 中共享 book.json 的哈希变化，其余字段、顺序和文本完全相同。其他 15 个源哈希未变，当前 20 个 trace 条目全部与实际文件匹配。没有改源、seed 或作者 draft。

核对当前 draft：s3 至 s6 只更新 seed_sha256；s2 还删除 history 题干的“古希腊”，修改 B 的依据及 C/D 的依据、C 的误解描述。将这些已知变动在内存中还原后，由 prepare.digest 得到的旧快照摘要与归档 review 的 draft_sha256 一致，证明其余题面和内部依据未变。因此复用未变部分的有效实质审查，并用 prepare.py digest 实际计算的 seed-current/draft 摘要重新绑定。

history 先只看修复后的 view，再检查新内部依据。题干不再提供国籍、年代等身份筛选，仍限定“本课科学史所说”；根据未变的 block 4，A 亚里士多德是课内引入科学者，B 罗蒙诺索夫是引入俄语者，C/D 不是课内指定人物。真集仍为 A，新 C/D 依据不再诉诸普遍最早史实；本快照的泄漏检查为 pass，旧 revise 只保留在拒绝归档，不被改写成从未发现。

五课当前 review 的总 outcome 均为 pass。下列命令在本仓库根目录执行，每课均返回 exit 0 和 `mechanical checks passed; declared semantic review: pass (not automatically proved)`；这是源新鲜度与机械契约通过，并不声称校验器自动证明语义判断。

```bash
for s in 2 3 4 5 6; do
  folder=".intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c1-s${s}"
  python3 -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed "$folder/seed-current.json" --draft "$folder/draft.json" --review "$folder/review.json"
done
```
