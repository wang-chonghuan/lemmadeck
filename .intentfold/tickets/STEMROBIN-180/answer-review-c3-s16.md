# Batch 4 s16 Independent Key Review

2026-11-15。独立审查者：Sagan，independent_agent；不是正文或答案作者。

**首审结论：PASS，phy6-c3-s16全部4个derived/ungraded答案。**
复用 `batch-4-independent-source.md` 中先于作者键完成的s16四题独立基线，不重新求解source15/16，不倒改原独立结论。只新增本报告，不修改作者答案或其他记录；未发现需启用一次affected repair的实质缺陷。

## 实际范围与哈希

仓库 `/Users/yong/.codex/worktrees/0f12/lemmadeck`；下列路径相对该仓库。SHA256为实际完整文件字节哈希，不是推测或手造digest。

| 文件 | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/lessons/phy6-c3-s16/answer-keys.json` | `e6263c694e7bdfd72c94d3a6ec449374450eb5059f191a30ccfddc667d73d815` |
| 同一持久现代目录 `lesson.json` | `0bee2fa6cef5e418e97163a597227569a9c8f145fe0177f76acfc044adb287a3` |
| 同一持久现代目录 `exercises.json` | `5cea68fa45aeea91655cd8b51d31ef5d1344485127a6a260653a2d07177aba4c` |
| `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/phy6-c3-s16/lesson.template.json` | `55586149ddd000a348531148ce9b22c20ab2222afc7887bc737dae55f5e6dc84` |
| 同一scratch现代目录 `exercises.template.json` | `44c86db0c92128aecc39e4c7b2bab77c64313a432d33c6d2f511dd5bba16aac3` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s16/lesson.json`（仅核文件哈希） | `ad9b50688bb39125dde394427415501183f0f89e650321fe9e3449c075d364fa` |
| 同一source目录 `exercises.json`（仅核文件哈希） | `9a3bfe78cd4a4b09b3a58e9bc135797c60aeb55bd0ef8c963105a69c41202f6f` |
| `.intentfold/tickets/STEMROBIN-180/tmp/answers/batch-4-independent-source.md` | `665c0bd928cd29c4f5019a7c3a3dbe8335aba55b59e677d2192747532a1e2d0b` |
| `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md`（沿用刚完成s19时实际读取的规则） | `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` |

实际读取授权的四个完整标准答案、s16持久现代上层正文及四题；先行独立解作为判断基线。当前两个template的哈希与独立基线记录一致；持久现代prose/section_breaks及exercises数组与template逐字段一致。两份持久文件的source.sha256分别与当前source文件字节哈希相符。未重读source逐段求解或重做源像素审查。

## 四题逐项比较

| exercise / 源身份 | 独立基线与当前标准答案比较 | grading / parts / unit | 结论 |
| --- | --- | --- | --- |
| `1` / g1-1，`p0079#6` | 水平抛石仍受地球吸引，向下重力使速度向下改变，同时继续向前，因而轨迹弯曲。明确空气阻力不是弯曲的必要原因、手离开不意味着重力消失。与基线及本课正文块1/10一致，不假造抛速、时间、尺寸或要求抛物线公式。 | ungraded / 0 / 无数值单位待填 | PASS |
| `2` / g1-2，`p0079#7` | 把物体吸向地球的是地球引力即重力。静止仍受重力；支承向上作用可与之平衡，避免“重力单独阻止陷入地面”或“静止就无力”的错误。与原基线完整理由一致；平衡解释是已有独立物理推理的保留，不依赖题图或重审其他课。 | ungraded / 0 / 无数值单位待填 | PASS |
| `3` / g1-3，`p0079#8` | 地球吸引物体的力叫重力，施力/受力物体分清。明确不是质量、不是物体对支承物的压力；静止或共同自由下落仍可受重力。与正文块8/10及原独立边界一致，不以“正在下落”作为定义条件，不混淆重力与重量。 | ungraded / 0 / 无数值单位待填 | PASS |
| `4` / g1-4，`p0079#9` | 同一地点、相同重力条件下重力与质量成正比；质量的倍数对应重力的倍数，质量相同则重力相同。完整保留正文块11的比较任务，并明确不能无条件推广到不同星球/重力条件。无需追加本课未给的g数值或用数值框替代说明。 | ungraded / 0 / 无数值单位待填 | PASS |

四题都是解释或定义，存在合理同义表述；ungraded不伪造词串自动判定，同时四个displayAnswer均提供完整标准解释。没有为形式覆盖而生成numeric/exact parts，也没有漏掉实际待求数值或单位。

## 对齐与实际检查

- 实际键文件为 `ld-s10y-answer/lesson-answers@1`，book=6p、lesson=phy6-c3-s16、edition=modern-us-neutral、status=draft；持久现代lesson/exercises为ready。
- 四题四键按 `1,2,3,4` 一一对应，无漏题、重题；每个prompt逐字等于对应现代text，group_id均为g1、source_number分别为1至4、源页引用分别为p0079#6至#9。
- 全部source=derived，无bookRaw；未读取书后答案或作者解作为依据。全部parts为空、grading=ungraded，不缺少当前任务要求的可判数值部件。
- 四题figure_refs/figures及键figureEvidence实际均为空。本课正文虽含图项，但本四答案不需题图求值；不借正文图号声称完成图审或批准图。
- 标准答案未引入人名、国家、年份或新的计量数据；historical_entities均为空合理。正文牛顿历史介绍不是这四题的待答内容，不额外生成历史题。
- 实际Node只读断言退出0：schema/edition/状态、题号/栏目/页引用、prompt、derived/ungraded、空parts与图证据、模板基线哈希、持久文字一致性及source.sha256绑定均PASS。实质理由逐题由独立审查完成，断言不替代物理判断。
- 本报告不冒称答案finalize、产品输入链测试或发布PASS。没有执行prepare/finalize/publish、DB、Git或网络/模型服务操作。

既有源解与其他报告保留。未读s15答案键、choice稿/作者解或其他新答案；不自行修复作者文件。精确部署模型ID、推理设置及累计输入/输出/总token不可观察，均未知。

完成后停止，等待s15实际键及后续明确授权。
