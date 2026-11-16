# 7p §83 Final Answer Author Freeze

工单：STEMROBIN-180。课程：`phy7-c1-s1-n83`。日期：2026-11-16。
角色：独立答案作者；不是两键的独立审者。本会话此前只审了 TEXT，未读取任何主代理或其他作者源解。
状态：`FROZEN_FINAL_ANSWER_AUTHOR_PENDING_FIRST_INDEPENDENT_COMPARISON`。

范围：完整2题，各一条 `derived` 标准答案；`auto=0 / ungraded=2 / parts=0`。
两条均包含完整 `displayAnswer/method/conditions/notes`、官方题面、题面SHA和sourceBindings。
无新交互、无新图、无持久答案写入或独立批准。

## Exact Paths

隔离作者根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-7p-n83/`。

候选：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-7p-n83/answer-keys.author.json`。

完整输入及来源绑定：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-7p-n83/input-bindings.json`。

冻结manifest和handoff：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-7p-n83/author-freeze-manifest.json`。
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-7p-n83/author-handoff.json`。

官方 prepare 模板保持原样：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/7p/modern-us-neutral/lessons/phy7-c1-s1-n83/answer-keys.template.json`。
主代理已报告该次官方prepare exit0；作者未重跑prepare，未把这项报告写成自己的调用证据。

## Complete Inputs And Hashes

已完整读取当前 ready canonical 现代课8块、全部2题、空 figures 清单及正文内完整 source.data。
实际版本目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c1-s1-n83/`。
使用当前 ready 文件，不把之前 draft 状态的文件SHA冒充当前文件SHA。

| 输入 / 产物 | 字节 | SHA256 |
| --- | ---: | --- |
| canonical lesson.json | 13909 | `18112fe6eb78f2e0adbb6f97b45832cf0ef8bf5a082d61f2a05955a8702b893e` |
| canonical exercises.json | 2914 | `8125ae13e0ad2a83624041c704014d1e346c6c945f2cc39f91be3d6852967923` |
| canonical figures.json（0图） | 153 | `c8a7156813ea3196889ff80fcd4f6cbbe1b60ffd2163f60affce9981c898c463` |
| official answer template | 878 | `53af5bbb8c2dd3618a41fc43ada46547747f46fa2f1c3beba3d84084ad33b4fe` |
| answer-keys.author.json | 7228 | `7455238020784f33506afbb45c624f549125fc6a1933e1acb67904d33ac1f482` |
| input-bindings.json | 14294 | `1adb62bcb23ac2127bb0c899d1bfe7f23342cdfeeb99fced716944aa192ad6f2` |
| author-mechanics.json | 由manifest绑定 | `681f44c8ba25fa935db27865a251f9a6b93839c9fea51da2a55d9ac50c4c8e11` |

完整9份输入原字节快照：canonical三文件、官方template、answer skill、gate2合同、当前answer API、edition profile、实际导入assemble工具epoch。
快照路径保留原仓库相对路径，统一位于作者根 `input-snapshots/`；input-bindings逐份记录original和snapshot的完整路径、字节数及SHA。
assemble工具只做导入依赖epoch绑定，没有调用装订、读其他页或重跑source门禁。
源码原题/正文的raw来源SHA由当前现代文件的完整 `source.data` 和 `source.sha256` 绑定，不声称额外读取过原书答案文件。

## Both Independently Derived Answers

| 题号 / 来源 | 作者覆盖 |
| --- | --- |
| g1-1 / p0220#5 | 区分分子热运动/分子间相互作用能量与整体运动/位置能量；保持内部状态时内能不由宏观动能或势能决定；两类能量可并存。完整答案说明做功若改变内部状态可使能量转化，因此不是无条件“永无关系”。 |
| g1-2 / p0220#6 | 指定情境中锻锤势能较容易直接利用；解释下落、整体动能和撞击工件做功的途径，与大量分子无规则热运动的利用条件区别。保留源5吨/3米/1米³/140000焦耳近似比较，不添加g、效率、气体状态、实测数据或无条件全量转化断言。 |

两题完整理由和关键条件都在 `displayAnswer` 中，不只藏在作者notes；method/conditions用于主代理逐项比较和后续绑定。
方法与notes为作者附加元数据；当前API对这些额外字段不提供完整语义验证，本次仅补充检查非空及要求的题面绑定，不能把机械PASS当成源解正确性证明。
`sourceBindings`保存g1身份、原题号、原页块、相关完整正文来源、当前现代文件SHA和嵌入raw来源SHA；未引用其他作者解。
两题 `figureEvidence=[]` 与官方template及本课0图一致，无需图像观察，不使用任何别课图。
两条 `historical_entities=[]`：无科学史身份任务或需要文化例外的名称，不增加无来源声明。
不引用书后答案，不添加bookRaw；`derived` 是作者现场推导，不冒称已reviewed。

| 当前题面 | frozenExerciseTextSha256 |
| --- | --- |
| 问题（1） | `51b9d2533ae0991b51ff2d81a4a2bb0a34d763bb351e9b17e154bd9f06adff9a` |
| 问题（2） | `bc5aebca9dddd9655bde1ad74a338c720d9e82264e298439e0aaca66d634f1b2` |

## Actual API And One Author Check

先实际读取当前函数定义与生产finalize调用，再写隔离调用：

```python
validate_lesson(
    path: Path,
    exercise_path: Path,
    book: str,
    lesson: str,
    edition: str | None,
    forbidden_terms: list[str] | None = None,
) -> tuple[dict, list[str]]
```

实际API文件：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-answer/tools/lesson_answers.py`。
SHA：`9da87526a5c3d596687ce6c9171cf296b27b0e34126e079fc9ea7819c84946a3`。
没有调用不存在的validate_keys，也没有修改稳定工具。

cwd始终为 `/Users/yong/.codex/worktrees/0f12/lemmadeck`。

```text
node /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-7p-n83/run-author.mjs snapshot
-> exit0；9份原字节快照、官方题面及输入绑定

PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-7p-n83/check-author.py
-> exit0；validate_lesson恰一次；errors=[]；auto0/ungraded2/parts0

node /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/final-author-7p-n83/run-author.mjs freeze
-> 只核冻结字节并写manifest/handoff，不重跑答案机械
```

一次作者机械包括当前官方结构/文化词校验，以及自己的完整覆盖、官方prompt一致、每题题面SHA、required derived/ungraded/parts=[]、非空method/conditions/notes、figureEvidence不变和9输入快照/原文件不变检查。
API没有修改候选字节。空parts没有exact/numeric/expression判题候选，不启动MathLive或expression runner；没有用setter缓存冒充交互测试，也不宣称完成官方finalize。
调用argv、cwd、开始/结束、exit、环境和API epoch保留在 `call-ledger.json`，完整结果在 `author-mechanics.json`。
运行脚本SHA也由manifest绑定；不依赖临时外部工具路径或未安装库。

首FAIL：无。机械检查1次，作者修复0/1，未用修复循环；冻结不会重置预算。
前期只读路径发现提示fresh root尚不存在，不是答案机械失败，也未据此增加任何验证重试。

## Boundary And Handoff

没有读取主代理私有源解、Feynman源解、其他作者答案、choices、交互或旧answer-keys。
没有重新复审已批准TEXT/source、retain原TEXT或复看图片。
只新增本工单作者报告及隔离scratch；官方template和canonical现代三文件均逐字节保持。
official prepare作者0、retain0、finalize0、publish0、DB0、Git0、browser0、新服务0、install0、稳定工具/应用编辑0；无in-flight会话。

这是一份最终题面对应的作者候选冻结，不是两键独审PASS。
main后续FIRST全键比较和精确绑定后决定retain/finalize；作者在此停止，不自行审批或发布。
