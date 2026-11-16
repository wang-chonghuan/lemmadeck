# 7p84 F84-1 Affected Author Repair

作者 Ramanujan，身份 `author`。仅修复 Sagan FIRST 的 F84-1；
当前状态为作者修复冻结、待 Sagan affected-only 独审，不是独立 PASS。

## 唯一修复

新根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n84/repair-01/`

仅 `exercises[5]`（`q1`，无原印刷题号，`g2`，`p0223#8`）的 `text/lines`
发生题面变化。删除强制记录初始温度的步骤，改为教师指导的安全升温观察。
温度计或温度传感器仅为教师可选的安全观察支持，明确不要求初温或温度读数。
两个安全升温阶段的实际累计摩擦次数、统一往返计数、安全停止条件、
实际观察后的做功与内能结论、禁止编造数据均保留；没有提供答案或测量结果。

其余五题与练习文档所有其他字段深度相等；q1 身份、来源原文、数字变更声明、
历史声明与图引用不变。完整 source.data 不变。
lesson/figures 模板、来源 bindings、实际已保存 prose_flow 与 anchors 均字节不变。
复用 FIRST 已批准的17条正文、其他五题、22段与7/12/17/20锚点，不重复内容审查。

## 机械证据

一次受影响作者检查，exit0、errors0；只调用当前 production 的 q1 identity/text
验证和 q1 layout normalization，以及受影响 delta/未变字节比对。
没有重新执行正文、数学、prose_flow、原图或完整作者 check。
修复总预算由0/1变为1/1，已耗尽，含本次机械检查；无重试。

实际命令：

```text
node .tmp/ld-s10y-lesson/text-author-7p-n84/repair-01/prepare-repair.mjs
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/text-author-7p-n84/repair-01/affected-text-check.py
node .tmp/ld-s10y-lesson/text-author-7p-n84/repair-01/freeze-repair.mjs
```

首条仅制作隔离副本，不是官方 prepare。末条仅绑定与冻结，不是再跑 check。
无新的 prepare/retain/finalize、图门禁、浏览器、服务、Git、DB或安装。

## 冻结绑定

- 原 author-handoff：`874d2f72e69feb48e674e10148abbd8ede476d55b947edc1f776294531131381`
- Sagan FIRST handoff：`faf610b977d800f50859944b7050a5319cc126f05f2ef5bad84bf5cb0503333e`
- 修复 exercises：`cd3b496bdbc6f4bfcf8ac864b63f43913c1bebd6cb64d898ad61377b1b64c237`
- 未变 lesson：`f72be94126220904b8cba826564efb4265428a6669773a6ef171dc06cf5415bb`
- 未变 figures：`b52686b3ab219edbefb832a3d041f5092921858d2012e00115b3041bc0801577`
- affected check report：`78234907c379b647549e42aa873c4a90322705019a3a6638eb8e5594d3418976`

修复完整 context、delta、ledger、当前工具 epoch、不可变 snapshot 与精确 SHA
由本根 `author-handoff.json` 和 `frozen-01/manifest.json` 绑定。
原 author、FIRST handoff/report 和原 manifest/context 保留原字节；
本根 `first-failure/` 另存证据副本。没有覆盖原 FIRST 或原作者冻结。
图210/211仍需独立委托与审批；不声称整课 ready，不晋升。
