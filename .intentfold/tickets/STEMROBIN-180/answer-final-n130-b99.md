# n130 ANSWER FINAL / b99

结论：REVISE，仅 `answers[0].notes`（q1 出处表述）。五题实质内容 PASS，19/19 SOURCE facets PASS，5 derived / 5 ungraded，有完整标准答案，0 bookRaw / 0 自动判分键 / 0 HOLD。

q1 notes 的 `没有书后答案，不提供 bookRaw。` 声称书后答案不存在。可用证据仅为父官方 prepare exit0、实际模板五项 derived 且没有 bookRaw；未获准查书后答案，不能据此断言书中没有。建议仅改这一出处句为：`本题官方 prepare 未提供 bookRaw，答案按课内定义独立推导。` 审者没有改作者候选。

逐题候选对自身已封存 SOURCE 的比较：

| 题 | 实质 | facets | 已覆盖关系 |
| --- | --- | --- | --- |
| 1 | PASS | 4/4 | 效应强弱、电流强度、单位时间电量、同条件比较；累计电解产物质量对应总电量并与单位时间效应区别。 |
| 2 | PASS | 3/3 | 电量名称、总电荷量，不是载流粒子个数或单位时间电量。 |
| 3 | PASS | 4/4 | 截面单位时间定义、I=q/t、I/q/t 含义与 t>0、明确本课稳定电流；不引入 n131 单位。 |
| 4 | PASS | 3/3 | 强弱分别对应单位时间电量多/少，同时间或比值比较；延长同一稳态观察不增大电流。 |
| 5 | PASS | 5/5 | 本课稳态串联不持续积存电荷，同时间各截面电量相等，除以相同时间得电流相等；不推广为各支路电流相等。 |

每个 facet 的候选证据保存在 `n130-answer-final/candidate-comparison.json`。以上复用原 5 题 19 facets SOURCE，不重推、不查作者 CHOICE 作为答案依据。格式全部 derived/ungraded、parts 空，开放说明仍有标准答案，不以关键词或虚构自动键替代。

首次比较对象为 `n130-answer-author/candidate-for-first-review.json`：3316 bytes，SHA `60f7f5b0a7116d91a9169829bbe26abccd6857c93f3957d34845c920bb084e94`。原 `candidate.json` 保留；q1 累计化学效应/q3 稳定与变量澄清在首次比较前已冻结，不计为审者修稿。输入 manifest：1522 bytes / 0444，SHA `3ffd4c4108a9298c11c197c32d2d622e1fcf2ae3b1ad97c6e98e27d3b7292a94`。

父实际 prepare 收据：`tmp/resume-180-4/commands/n130-answer-prepare-1.json`，cwd 为授权 worktree，returncode 0，stdout/stderr hash 已绑定；实际 prepared template 为 1514 bytes，五项 derived、无 bookRaw。没有重跑 prepare 或 ANSWER finalize。模板没有 bookRaw 这一事实与纸书是否有书后答案分别记录，后者未判定。

本轮读取/必要结构投影执行均 exit0；新证据封存的 metadata/hash 检查 exit0。必要输入输出 bytes/hash/mode 见 `n130-answer-final/manifest.json`，不重打包旧阶段。图片新开 0，继承记录图批 8/8、context 8/24，剩余 0/16；历史 FAIL/费用/额度不重置，旧 sealed 不改。父工具收据及转发不写成新人类观测或额外批准。不执行 finalize/retain/render/browser/DB/Git，不联系其他聊天，不预取。完成本候选比较后停止，等父窄修订。
