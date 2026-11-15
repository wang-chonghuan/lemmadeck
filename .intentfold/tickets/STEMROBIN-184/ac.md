# 验收执行

## AC1 完整性

从四册 live TOC 派生课程集合，比较持久 book.json 与现代 edition，不手填第二份目录。
逐页 finalize 行数对账及 assemble 题号、图号、引用、TOC、KaTeX 对账均通过；
跨页开放对象未闭合的课程不算完成。章末、书末和附录按实际对象检查。

## AC2 图的数学及显示

每张引用图核对原图 inventory 与给定数值、点线关系；FigureSpec、断言、渲染报告及
哈希绑定独立审查通过。用现有离线 render 在桌面 1440x960 与手机 390x844 检查所有
图，完整边界、文字、横向滚动末端可达且无遮挡；截图和可失败的断言保存在 tmp。

## AC3 任务覆盖

有原始书写任务的课程由 prepare whitelist 派生 seed；draft.coverage 对所有种子
负责。作图、证明保留原书写任务，intent.limitations/omitted_tasks 如实记录识别题
无法验证的独立生产能力；无练习的材料不编题。

## AC4 独立审查

每份 seed/draft/review 用 choice validate 核对新鲜度、全体题、全体选项、覆盖和
哈希；review.kind 必须真实 independent_agent。新候选图有独立数学/视觉审查，
拒绝机械拆空、同义选项、无推导干扰项和答案泄漏。失败证据保留，修改只重验受影响项。

## AC5 离线交付

所有现代课程运行现有 p2c render 和 validate_publish 的只读结构检查，
桌面/手机检查全部课程，不用抽样代表全量。本单不做生产写库或 app 集成判分、
分页、保存恢复验收，这些由 E 承担。必要工具补丁保留真实复现与受影响测试结果。
按 engineering.md 的机械 defence 运行；交付记录准确 commit、分支和可复用证据。

## AC6 阶段与用量

每批记录起止 UTC、实际耗时、有效阶段、调用和重试；模型、推理、输入/缓存/输出
token、费用仅用可观察证据，缺失标 unknown。缺源或条件不明只停对应对象并列出，
不虚报解决；365 是调查基线，不以数字代替实际目录覆盖。
