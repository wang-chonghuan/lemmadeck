# s24 独立键比较与验证记录

审查者 Sagan，独立于作者 Feynman。只审当前组，不改作者文件。实际顺序：完成七源独立解及实际图核对，写入 `source-first.md`；只读纯 `view.json`，逐题逐项冻结 `view-first.md`；之后才读完整 `draft.json` 和 `author-solution.md`。后两文件仅用于比较，不反向改先行真集。

## 冻结快照

- seed canonical SHA256（实际 `prepare.py digest`）：`ea7b064fea0dca54a00c35f62d12b6f982ed4b7b4d7fe3334fe0f9c922120fbf`。
- draft canonical SHA256（实际同工具）：`057d7019a398fdaac6beba3fc56ea46b8706d5eeb4fbdbe24df96f57e6ef45a8`。
- 先行 `source-first.md` 字节 SHA256：`01ec7bc42db6e6caf3647e643a4102cd62c3376de7d55715e71db4dce9b5b4be`。
- 先行 `view-first.md` 字节 SHA256：`0791ee60f1dd67c2a9c345423348e8820b0e235afcb00827c6a7ef340d8e7496`。
- 纯 `view.json` 字节 SHA256：`2a820ccf37b045f6c4c17a833a7a55daef050916a2398d56f9c744dd97e6434b`。
- `author-solution.md` 字节 SHA256：`2e00616f13600b4bb54b0ca3425b0259235a344301412795726b567cb77c5a6d`。
- 持久 fig75.svg 字节 SHA256 本阶段实际复核仍为 `9e5c8ac1bf7eb81bd327291c21b255bc060419cdd577330ee5e7832dbba179b0`。实际打开依据复用 `source-first.md`，不重做已完成图审/渲染。
- jq 实际比较 `draft.questions` 的 `{id} + view` 与纯 view 完全相等，且 5 题/20 项，结果 `true`。未另跑结构验证循环。

## 实质比较结论

5 题 = 2 single、3 multiple；20 项全部审查，未抽样。独立真集为 q01 A/B、q02 C、q03 A/D、q04 B、q05 B/D，与作者逐项 truth、key 均一致。12 个错误项的 derivation/misconception 均能从具体错误步骤推出实际选项，不靠无根据的身份、数值或测量。每项证据写入 `review.json`，不是仅记录键一致。

7 源全部覆盖，q05 合并源5/6/7有共同分类任务理由，未按固定数量吞题。q01 的受控推断、q02 的相对运动参照、q03 的两成因、q04 的效应及接触替代、q05 的分类与接触条件均保留。q04 B的较小液层阻碍前提来自概念10，作者 source_solution/rationale 明示，不能把图或隔层本身当作普遍定律；自由生成完整比较与因果链的损失不隐藏。

coverage/limitations 明记自主观察举例、实验设计与身体实施、控制/记录数据、完整定义和原因文字生成、自举分类实例的损失。选择题只批准这些任务的识别/应用部分，不替代原书写题。无新图；唯一用图 fig75，fig74不作为本组用图虚记。语义结论 `PASS`，正式合同记录为 `review.json`。

## 验证

下列带 review 的正式验证实际执行一次，不使用整套测试或循环：

```text
python3 .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s24/seed.json --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s24/draft.json --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s24/review.json
```

实际 exit code：`0`。实际输出：

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

结构、当前源/资产及快照绑定检查通过；语义 PASS 来自七源先解与全部二十项实质审查，不把工具输出当自动物理证明。没有追加验证循环。choice 技能没有 `record_review.py`；本合同 JSON 使用 `apply_patch` 手工记录，未调用图件专用 review@1 工具冒充 choice 格式。

精确模型部署、推理设置、可观察 token/费用计量均未知。未调用外部模型服务、DB、Git、发布或浏览器；未改 source、seed、draft、view、author-solution、SVG 或工具。
