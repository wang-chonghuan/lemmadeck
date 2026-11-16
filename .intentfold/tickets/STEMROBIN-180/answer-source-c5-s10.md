# phy6-c5-s10 四题 source-only 解作者报告

## 范围与输入

新独立source解作者根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s10`

仅作者四道原问题的完整源推导，不是finalmodern答案键、选择题或独立审查。完整原lesson.json/lesson.md/exercises.json、已批准TEXT三模板/source.data和原TEXT作者handoff均纳入source-inputs.json快照与SHA。TEXT批准依据main/用户明确FIRST全21块4题PASS、114绑定通知；没有读取main私有解、keys、choices或答案比较报告。

批准TEXT lesson SHA为`a0a22551e103b1a46061807ce72c51f4e3c6577c1d6171eea683c697e7b6bcbd`。原图197–200当前PNG SHA仍与本作者此前真实完整观察记录一致，复制并哈希绑定既有观察；新image view为0，未重复源图视觉门禁。

旧TEXT首FAIL/唯一1/1修复、final11及其他作者文件均不修改。新的source解单元机械/修复预算最多1次，包括机械；不把旧TEXT已耗尽预算重置。

## 完整四题

第1题给三个完整本课例证：落重经滑轮绳索驱动车轴和小车；压缩弹簧恢复举高重物或驱动小车；钢球A滚下并推动木圆柱B。说明每个例子的供能系统与受能对象、做功传能、具有能量不等于当前正在做功，以及不能把局部储能变化无条件认作全系统能量消失或单一有用功。电动机和水轮机的课文实例作为同类联系补充，不设计新实验或测量。

第2题完整说明物体/物体系能做功即本课意义的具有能量，区分能力与正在做功、静止与无能量、日常生活用语与物理量。

第3题回答焦耳（J）、与功同单位及以做功能力量度的理由；1 J=1 N·m只解释单位，不是原題测量或新增數据，不混淆做功快慢。

第4题用通过力作用及作用点位移转移能量的量度解释功，先明确同一物体/物体系。只有做功跨边界传能时，外界净功对应能量增加，系统对外净功对应减少；同时说明其他传能途径、系统内部做功、局部能量变化和实际有用功的范围。全部符号是作者解释用，不回写原文或TEXT，不把无条件等式或符号混淆保留为唯一答案。

每题source-solutions.json包含完整fullAnswer、method、conditions、notes、coverage和reasoning_source_refs；原四题身份/顺序/g1栏目/pages/原图归属不变。原prompt与批准TEXT prompt分别SHA绑定，source-only仍不冒充finalmodern key绑定。四题覆盖4/4，遗漏0。

## 检查与冻结

先capture冻结白名单，再写解、执行一次作者机械，最后freeze。机械只核输入与原题身份、完整字段/理由来源、数学分隔与KaTeX语法，不是语义独审；不执行正式answer prepare/retain/finalize。新的首FAIL如发生会保留全字节，最多只做一总修复，不能以改题或源事实凑过门禁。

实际argv、exit和工具SHA在commands/、author-mechanics.json；源原文件/复制件在source-inputs.json；完整解在source-solutions.json；source-manifest.json枚举全部作者文件；author-handoff.json绑定全部SHA。实际次数、预算、状态和输出SHA在下方冻结记录。

无新实验、质量/高度/速度/效率/损耗率/g等测量或参数。没有automatic grading、formal answer-key或interaction字段，没有私有主控答案输入。无canonical/source/TEXT/旧freeze/tool/app/schema/依赖写入、browser/Azure/service、DB、Git、assemble、publish或promotion。作者不自审批；完成source-only freeze后交主控独立比较。

下一图197另行使用TEXT和原PNG白名单；本源解不会成为图构图、context或服务prompt输入。新增model服务调用0，服务费用0，token未独立计量。冻结时无在途session。

## 实际冻结记录

```json
{
  "source_inputs": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s10/source-inputs.json",
    "bytes": 7048,
    "sha256": "b2006fd13ef8d6a241fa49e0a828ada84f40f18b3f1b90f0ea6957b08c99c47f"
  },
  "solutions": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s10/source-solutions.json",
    "bytes": 15079,
    "sha256": "ac06cc4129775c6cec1e5f4e3dbe6a014716aea63cb4882d4fc1c7aacc454e68"
  },
  "mechanics": {
    "path": "/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-c5-s10/author-mechanics.json",
    "bytes": 1729,
    "sha256": "3b63f205ed8ad4a1e88ae1653b4914a076946d1da1acc2989b701c6b5b44b78a"
  },
  "tasks": 4,
  "task_capacity": {
    "source_tasks": 4,
    "complete_solutions": 4,
    "omissions": [],
    "formal_answer_keys": false,
    "automatic_grading_authored": false
  },
  "repair_budget": {
    "maximum": 1,
    "used": 0,
    "first_failure": null,
    "includes_mechanics": true
  },
  "inherited_TEXT_repair_used": 1,
  "source_only": true,
  "final_answer_keys": false,
  "independent_approval": false,
  "inflight_sessions": []
}
```
