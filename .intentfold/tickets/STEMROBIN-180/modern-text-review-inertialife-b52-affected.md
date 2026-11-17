# phy6-c3-s7 因果句受影响续审

2026-11-17，STEMROBIN-180，同一独立审查者、同一 `/Users/yong/.codex/worktrees/0f12/lemmadeck`。

**合并后的完整 TEXT 结论：PASS，覆盖原审查的五块正文与六道书面题，仅适用于下面绑定的修复副本。** 原全文审查未受影响部分的 PASS 继续复用，唯一缺陷 TEXT-01 在本次受影响续审中关闭；不是第二次全文审查或全套门禁重跑。

## 唯一受影响内容

修复副本根：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-repair-inertialife-b52/`。

`lesson.template.json` 的 `prose[3].text` 最后一句现在为：

> 汽车由于惯性仍会继续运动一小段时间，这时车轮可能在地面上滑动。

本次直接读取该句、所在段的支持语境和 `section_breaks[1].before`。对应 `before` 含同一修复句，仍是该块第二个完整段落；下一段 `after` 与原稿相同，原段落边界没有另行移动。

来源 `p0058#6` 的 canonical 原文末句是“甚至对汽车的车轮制动，使其不能旋转，汽车靠车轮在地面上滑动，也仍将继续运动一小段时间。”它表述锁轮后整车仍继续运动，轮胎可以以滑动方式接触地面，并不把滑动写成继续运动的原因。本次修复把“由于惯性仍继续运动”与“这时轮胎可能滑动”分开，消除了旧句“滑动，使汽车继续运动”的错误因果，也没有把惯性命名为外力。

复读的是本审查者已冻结的 SOURCE 解，不重新求解：`reasoning_contract.inertia` 将惯性明确为保持原状态的性质；问题 2 的 `written_solution` 明确车辆有原先的运动、关闭发动机不瞬间归零、阻力逐渐减速，且不能把滑动解释成车轮在推动汽车。修复句与这些既有推理一致。前文的不制动滑行示例、锁轮条件及“一小段时间”语境未改，不承诺无阻力永远运动，也不引入新数值或图像事实。**TEXT-01：受影响语义 PASS。**

## 未受影响部分复用

- 原报告对 `prose[0]/[1]/[2]/[4]` 的语义 PASS，以及 `prose[3]` 中除末句之外的条件、定义、数值、单位和措辞审查结论全部复用。
- 六题 `1,2,g2-1,g2-2,3,4`、两栏目、来源引用、接触对象、初态、相对方向、图归属等沿用原审查 PASS；exercises 与 figures 修复副本的字节 SHA 均与原作者副本完全一致。
- 原 FIRST PASS focused TEXT 记录、规范化结果、KaTeX 结果和段落流中未受影响的证据继续复用；本次未重做 normalize、prose_flow、KaTeX、全文 TEXT 检查或 SOURCE/FIG 门禁。
- 唯一实际内容修复是最后一句与其同文 `before` 锚点同步，累计 **1/1**，剩余 **0**；既往诊断不算内容修复。审查者没有实施修复，不增加修复次数或新增人工批准门禁。

## 当前精确绑定

| 当前修复副本文件 | SHA-256 |
| --- | --- |
| `lesson.template.json` | `ccaa81776333db58b42cfac68df783a8bd47ad595bfcfe1c8afe33a42cd61a52` |
| `exercises.template.json` | `fcce37f6b3bf0a16020edfb00be2c64aa1f91ce01e74021e175dbc9294667cea` |
| `figures.template.json` | `6110e97c32e4a69048e3e96b3630af95042ac3f3f4a18d5f00198ec42b6ae1cd` |

本次仅只读计算字节哈希，当前 lesson SHA 与提供值及已录检查 stdout 的 `new_sha256` 一致。

原作者副本根仍为 `.tmp/ld-s10y-lesson/text-author-inertialife-b52/`，lesson SHA 仍是 `a38b813cf511607500a0996e2c5916e51cdb1e0f29f75f3902dc70a7b6755087`；其 exercises/figures SHA 与上表一致。原报告的 **BLOCK** 继续如实绑定旧 lesson，不追溯改成 PASS。

| 未修改、复用的文件 | SHA-256 |
| --- | --- |
| [原 BLOCK 报告](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/modern-text-review-inertialife-b52.md) | `b2e187bdfdabdd6fe895b03812beaf75f2d027ad0a9e91c3589b992c51a56d32` |
| [冻结 SOURCE 解](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-inertialife-b52/source-only.json) | `5c8bb67cd30b1377478aa0b9bcdcef5c621b77d264c90ed54fc6ed107fb2c42b` |
| 作者原 `text-check.json` | `f1ed1ed6ed8ca56b89c731f9c47275d543dacb95f772467fa23dab0590bb9032` |
| canonical `artifacts/6p/lessons/phy6-c3-s7/lesson.json` | `0f0be92a61ed527e7a81fa0e68e6fe2630bc400528197ca6b1660076ae6a97cc` |

原报告及 source-only 内的历史 BLOCK/修复计数快照保持原样；当前合并结论和累计修复数只记录在本续审报告。

## 复用已记录的受影响检查

只读取已有记录，不执行其中命令。以下路径根为 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`：

| 既有记录 | call.json SHA-256 | stdout SHA-256 / 字节 | 实际结果 |
| --- | --- | --- | --- |
| `batch52-inertialife-repair-copy` | `bbf664fd08756437517043c90b6ec748dd8cf1432de092431faec6cf33e5b7c3` | `84b93d355ad9873d38ede206c634241b35c20533041fd512ffe70f3e4dd9df37` / 132 | 02:46:07Z，三副本拷贝一次，exit 0 |
| `batch52-inertialife-causal-affected-check` | `f5e895ee2ba3dd1c64c4ba68d54a47aedb302a0da3b70056c358be70d1fe54e4` | `0b80b537c4e8719bb9dd9bc321740b4df7c40b926a27cd1f9ee5f5f06c8913cd` / 207 | 02:47:00Z，受影响 `validate_text`、锚点及未变比较一次，`errors=[]`，exit 0，`text_repairs=1`，`unchanged_gates_rerun=0` |

两份 stderr 都实际为空，0 字节，SHA 为 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`；实际 stdout 与 call.json 中记录的流哈希一致。

既有受影响命令检查了其他 prose 块相等、source 快照相等、首个 section break 相等、第二个 before 等于修复段且 after 未变，以及 exercises/figures 字节不变。本次没有复跑这些比较，也没有把既有机械检查当成语义判断的替代：TEXT-01 的关闭来自对实际修复句与 canonical 支持文本、冻结源推理的本次直接续审。

## 边界

本次仅新增本报告。无作者/修复副本、原 BLOCK 报告、source-only、manifest 或任何他人文件修改；无新 machinery、源题求解、服务、app、依赖、DB、Git、渲染、finalize、promote、retain 或新人工门禁。

新图片打开 **0**，新增裁图/重开 **0**；沿用此前 task **3/8**、context **3/24**、parent **0** 的图片观察记录，未再打开任何图片。未做或声称做实物试验。完整 TEXT PASS 不外推为 FIG、答案键或发布验收 PASS。
