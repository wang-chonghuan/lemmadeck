# S5历史声明唯一修复独立受影响复核

2026-11-15。审查者Sagan，非修复作者。**受影响结论PASS：S5-HISTORY-1已解决。** 复用Wegener首报告中的未变全文、题目、分段与源模型结论；没有重做完整TEXT审查、机械检查或现代图审批。

```text
R = /Users/yong/.codex/worktrees/0f12/lemmadeck
B = R/.tmp/ld-s10y-lesson/text-author-c4-s5-s6
O = B/adapt/6p/modern-us-neutral/lessons/phy6-c4-s5
C = B/history-repair-candidate/phy6-c4-s5
```

完整读取首拒绝及修复报告/handoff，只对O/C进行只读结构和字节比较，并读取源p0128#3/#6及对应合并块：

- `diff -u`只有`prose[1].historical_entities`一个hunk。将候选此字段恢复为原空数组后，整个JSON深比较等于原稿；没有其它字段变化。
- 候选仅一个声明：`term: 帕斯卡`，reason绑定`p0128#3、p0128#6`，没有新增人物、传记、历史断言或文化豁免。
- 原页#3为跨图之前的液柱分层说明；#6为续接段，实际两次出现“根据帕斯卡定律”。对应合并块的source_refs包含两片段，source_text和现代text均保留同一名称。因此reason绑定到该完整源块成立；不声称#3单独含有姓名。
- 原稿与候选的exercises/figures模板逐字节相同。唯一字段差异之外，包括所有prose、source.data、source_text、公式、数字、单位、anchors、来源引用与题目均结构相同。
- 首拒绝文件与候选保存的`first-REVISE.md`逐字节相同；原handoff与保存副本也相同。没有覆盖首失败或把首结论倒改为PASS。

声明修复可以使原s5的TEXT结论在此候选上收口；原报告中的简化模型、安全性及现代图未审批边界仍保留。没有重审s6，也不重新声明其PASS。

## 实际SHA-256

以下为本次读取实际字节计算：

| 文件 | SHA-256 |
| --- | --- |
| O/lesson.template.json | ba206492c4457bda2ec9add399b4c950b2238f8b57178c18154694811afeb6f9 |
| C/lesson.template.json | 56e9fa2deffddc6bebfc10c140a74b8d85adbb5fcd1efc4c4aa7ef1482f2c161 |
| O及C/exercises.template.json | 9952920ce2eada39e878670dba64c61deba0257ec5b43dd68e182f062a74dfb9 |
| O及C/figures.template.json | be66c2ce8f5b3d18a873e772626625d60f20c2072493095c015e537fa57c85a0 |
| O/author-handoff.json及保存副本 | 16ea0baa9f2996f0db4bc1f9e6063414d8b142264469026a615d83f13c1c830e |
| B/history-repair-candidate/author-handoff.json | e50fd70477d5dc0188ac3ce78413be5285dd3dc4b1c78452847ec5e864f6d5ef |
| 首拒绝及B/history-repair-candidate/first-REVISE.md | a5c634cce9d89df17cffe5f06121d9f0c494b4109a0e24d380b5a2b667953311 |
| R/.intentfold/tickets/STEMROBIN-180/modern-text-author-c4-s5-history-repair.md | 59e6649579fa161010f2eef58668f12b436e6f35fe73cea0d81e47eaef6975f8 |
| 原pages/0128/page.json | ad94695088b59a54b3917827aa2e005aba59a3f99d4cc081b6be234cdbbbaac0 |
| 原lessons/phy6-c4-s5/lesson.json | a58723ce6993efd6ea5968d54942c22bc30176805affc0191885ffd09ff93143 |

原pages/lessons路径均在R/ssot-resources/soviet10year-textbooks/artifacts/6p。首拒绝路径是R/.intentfold/tickets/STEMROBIN-180/modern-text-review-c4-s5-s6.md。

本受影响阶段只新增本报告；未改候选/源/题/图/答案，没有重跑门禁/规范化/渲染/finalize，没有DB/Git/服务或浏览器操作。精确部署模型、推理档位、任务总token/费用未暴露，未知。后续121/122图作者任务另行留证，不由本声明PASS替代图审。
