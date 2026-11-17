# STEMROBIN-180 batch52 n100 FIRST 独立 FINAL 转换复核

- 日期：2026-11-17。
- 范围：仅 `7p / modern-us-neutral / phy7-c1-s2-n100` 的四条候选答案。
- 结论：**PASS**；绑定状态为 `FIRST-main-final-answer-pass`。未发现须修改候选的转换缺陷。
- 本复核仅判断冻结 SOURCE 到当前现代题面的 FINAL 转换，不重新求解或复核 SOURCE，也不宣称执行了完整生产门禁或发布。

## 权威与输入

先读 router、答案 skill 和 gate2，再读取并实际哈希指定的冻结 SOURCE；其 SHA-256 与用户指定值一致。仅以 `tasks[].answer` 及其适用范围、条件和 `source_limit` 为完整批准源解。SOURCE 的既有 TEXT/FIG/SOURCE 结论直接信任，不重跑。

随后读取指定 official template、当前持久现代 `lesson.json` / `exercises.json` 和唯一指定候选。没有读取其他答案作为参照。现代补充仅以当前现代课文为依据，不反向充当 SOURCE 解答权威。

所有文件哈希均对实际文件字节计算 SHA-256：

| 输入 | 实际 SHA-256 |
| --- | --- |
| SOURCE | `8ef43ad33438ac78210e58c18b363a8e063aea7045d12e4fb338e9f29c63b308` |
| official template | `8257fb4daab2b278e2bd03b2fba636a10b343d22950b5c045c3a1b97aeee8eaa` |
| 当前现代 lesson | `40df0c9de5b00f46684dbee04612d0f186ff4281ef65deff24cf9eecc45c98c2` |
| 当前现代 exercises | `3194a1c482f7cef6f71742005f8c6c782d1b3659b15e416e1ff227d8550f050f` |
| FINAL 候选 | `9d96cb267df7e922336524f474fae7bb9d5ee85a17e69e596c4d9e443d46abe1` |

输入绝对路径：

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-n100-b52/source-only.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/7p/modern-us-neutral/lessons/phy7-c1-s2-n100/answer-keys.template.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c1-s2-n100/lesson.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c1-s2-n100/exercises.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-n100-b52/answer-keys.json`

## 四题结论

1. **Q1 PASS**：完整 SOURCE 解是 `displayAnswer` 的逐字前缀，保留破坏结晶结构、固液转化、内能增加而温度不升、完全熔化后才继续升温的解释。补充明确压强不变、纯晶体、固液共存的平衡熔化范围，并沿用现代课文的无化学变化和可忽略对外做功近似。没有将温度不变误写为内能不变，解释能力未削减。
2. **Q2 PASS**：完整 SOURCE 解逐字保留，继续限定为燃料释放后实际传给晶体的能量。补充明确区分吸收部分与总燃料能量，否定“全部进入晶体”。容器和环境明确归属现代课文的定性说明，不冒称 SOURCE 给定或完整能量账本。候选没有比例、效率或完整分配的计算及定量结论；缺少各部分能量、损失比例和效率数据，不能由本题计算这些量。忽略体积变化对外做功的近似与熔点、固定压强、纯晶体范围均保留。
3. **Q3 PASS**：完整 SOURCE 定义、1 千克、单位质量含义及字母 λ 均逐字保留。追加条件明确纯晶体、固定压强、固体已在该压强下的熔点、完全变为同温度液体；明确不包含熔化前加热到熔点或熔化后继续升温的热量。“比熔化热”为当前现代课文已有名称，没有新任务或新数值。
4. **Q4 PASS**：完整 SOURCE 列表及顺序逐字保留：焦耳/千克、千卡/千克、卡/克，对应 `J/kg`、`kcal/kg`、`cal/g`。补充只解释能量/质量维度，没有换算常数或数值，也没有删减原三单位。

## 对应与判分

实际读取 JSON 并比较得到：SOURCE、official、当前 exercises 与候选均为顺序 `1,2,3,4`，每题恰有一个答案，无漏题、无重复；题号、栏目身份和来源块对应。候选及 official 的每条 `prompt` 均与当前持久 `exercises[].text` 完全相同。四条 `displayAnswer.startsWith(tasks[].answer)` 均成立。

四题均为 `source: derived`，与 official 一致，无 `bookRaw`，没有把书后答案和推导来源混淆。四题均为 `grading: ungraded`、`parts: []`，且有完整展示答案；这些解释、定义和自然语言单位列举不需要伪造可自动判定的数值或关键词槽。`figureEvidence` 和 `historical_entities` 均为空，未引入图像依赖或历史实体。

计数：`answers=4`，`auto=0`，`ungraded=4`，`numericParts=0`。

绑定沿用 existing `retain-authored-answers.mjs` 所需字段，不执行 retain。`promptSha256` 对当前题面字符串的 UTF-8 字节计算；`sourceSolutionPrefixSha256` 对对应完整 `tasks[].answer` 的 UTF-8 字节计算，不加分隔符、不做规范化。具体逐题哈希记录在 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/n100-b52-main-final-binding.json`。

## 边界

本复核图片打开数 **0**，`parentImageOpens=0`，`sourceGateReruns=0`。没有打开图片、原图、choices、交互、bookanswer 或旧答案；没有打开冻结记录引用的其他门禁文件。未执行 prepare/finalize/validate、Git、backend、DB、app、依赖或服务操作，也未建立新审查体系或管线。

仅新增本报告和指定绑定 JSON；候选、持久现代内容、冻结 SOURCE 和其他工作者成果均未修改。本 PASS 只绑定上述实际哈希的候选和当前题面。
