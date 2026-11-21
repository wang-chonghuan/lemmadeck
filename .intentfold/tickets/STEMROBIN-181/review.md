# STEMROBIN-181 Review

已交付成果可复用；整单正式 handoff 仍受内容 HOLD 和资源机械检查阻断。工单保持 In Progress，finish=review，未合并、发布或关闭。

## 可查看成果

2026-11-21 检查点沿用现有计量：146 门已推送完整课程、577 页已消费源页。D500 新增 1 门双语实验作业课程和 2 页本地新源页；D482 的 6 页未重复计数。这不是全库完整性统计。

| 材料 | 中文 | English | 交付边界 |
| --- | --- | --- | --- |
| 10p 实验作业，10 个实验 | [课程](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d500-laboratory-complete-course/offline/zh/text.html) | [Course](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d500-laboratory-complete-course/offline/en/text.html) | 已提交 c2a90ab、检查点 d66fa86e；既有必要门禁及 DISPLAY PASS 复用 |
| N153 已批准子集 | [书写题](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d474-n153-approved-subset/display/zh-mobile-written.html) · [只读答案](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d474-n153-approved-subset/display/zh-mobile-answers.html) · [选择题](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d474-n153-approved-subset/display/zh-mobile-choices.html) | [书写题](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d474-n153-approved-subset/display/en-mobile-written.html) · [只读答案](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d474-n153-approved-subset/display/en-mobile-answers.html) · [选择题](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d482-current-approved-progress/display/en-mobile-choices.html) | 每语言 59 条只读答案、55 题／220 选项；整课未交付 |

[N153 最终路径与 SHA 绑定](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d508-n153-final-bindings/final-bindings.json) · [既有计量及未决记录](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/production-meter.json) · [本轮 review 包](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d512-review-preparation/review-package.json)

## 必须保留的未交付项

| 范围 | HOLD |
| --- | --- |
| N153 | 第 2 题模型、第 10 题字形及 fig08 依赖；不得强行全课 finalize |
| 9p N75 | 第 187 页 q 下标后的低墨迹符号仍无法确定 |
| 10p N75 | 原图内部标记、科学语义及既有终止图门禁 |
| 10p N78 | fig181 缺付费输出；fig182 既有终止失败；不重购 |
| exercise14 及其他旧 HOLD | 保持原记录，不因路径修复或实验课交付而批准 |
| 两册概率 | 缺合法完整可用源，不编造、不记为完成 |
| 正式机械门禁 | fig04 的历史批准字节已恢复并修正路径；其余旧资源／溯源引用和其他脏稿重复图尚未全部解决 |

[HOLD 清单及当前未决课程记录](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d512-review-preparation/hold-register.json)。该清单不把未调查材料写成已经完整验收。

## 本轮实际续作

- 修正 currentContinuation 的 145／575 旧描述，沿用 146／577 既有计量，不重数。
- 绑定 N153 的 8 个源快照别名和 12 个既有页面，使用修正后的英文手机页面。
- 修复 24 条 FigureSpec 路径及 111 条独立审查资源路径，仅在原 SHA 匹配时改路径；保留原 JSON。
- 备份并移出实验页下 2 份未跟踪、字节相同的重复图；其他脏稿不动。

## 资源续修

D515：恢复 fig04 的原批准 FigureSpec（115a011…），历史审查仅改路径，批准 SHA 不变；现存上下文版（bccf68e…）、源图、SVG 和审批均未覆盖。现有校验器只检查受影响绑定，通过。D512 的 HOLD 清单是当时记录，其中 fig04 路径项由本次证据更新，不代表其他 HOLD 已解除。

[fig04 原批准字节与受影响检查](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d515-fig04-approved-history/repair.json)

D518：另修复 47 份 9p／10p 审查记录中的 249 条路径，均指向已经保留且与原 SHA 一致的历史证据。审批、失败状态和语义不变。受影响图 metadata 校验通过；这 47 份记录仍有 100 条未修改的临时引用，因此资源门禁尚未全部通过，不能据此正式 handoff。

[本批精确路径修复](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d517-retained-provenance/repair.json) · [受影响检查与剩余引用](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d517-retained-provenance/affected-check.json)

D521：归档索引与实际文件再确定 17 条原 SHA 引用，已修正路径，包含 source264 的前页候选上下文和 N77 的原 seed。前页候选仍未批准；未重生成或批准课程。本批无顶层 spec 绑定，metadataChecked=0，不能称为完整 metadata 认证；精确路径检查完成，20 条未修改的临时引用仍保留。索引声称保留但实际缺失的 69 个路径已单列，不能据索引猜造资源。

[本批索引路径修复及剩余项](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d520-indexed-provenance/repair.json) · [候选存在性与缺失记录](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d520-indexed-provenance/plan.json)

已有“终止”或 repair1/1 记录不是永久审批限制：有确定性源和现有审查支持时，可继续普通局部修复。真实来源／字形不明及缺付费输出仍不得猜造、重购；本轮路径修复不替代这些缺失阶段。

D523：仅核实 D521 剩余 20 条记录的有限候选：18 条原 SHA 文件缺失，2 条是应保留的历史 originalPath 字符串，未改写或伪造。10p fig17 的遮挡已在 D050 修复；两语言现存 spec／SVG／render／review 与既有批准 SHA 一致，复用独立及 DISPLAY PASS，不重复修图。

[20 条引用的局部分类](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d523-finite-references/remaining-references.json) · [fig17 既有批准复用](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d523-finite-references/fig17-reused-approval.json)

D524／D525：10p fig182 仅移动 d 子图标签，并把源图路径绑定到原 SHA 的保留文件。213 个对象、21 个标签、全部光路几何不变；原唯一碰撞消除。既有渲染器通过，SVG 仅该标签 x/y 改变，331／342／640 px 局部 DOM／像素检查通过。本人查看源图、旧失败预览、新原尺寸及两手机宽度共 5 张图；这是作者局部检查，不是独立审批。原 FAIL、repair1、光圈前后位置语义 HOLD、fig181 缺付费输出均保留，未促进整图或课程；计量仍为 146／577。

[fig182 局部修改和保留失败](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d524-fig182-label-repair/repair.json) · [受影响显示检查](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d524-fig182-label-repair/width-check.json)

D526：上述有限引用判断及 fig182 局部候选已提交并非强制推送 d74b6923；随后继续 fig164，未停在一次 push。

D527／D528：10p fig164 只下移 Principal axis 标题，消除与 O1 的原唯一碰撞。20 个对象、9 个标签、全部曲面／点／半径／厚度几何及源 SHA 不变；现有渲染器和 331／342／640 px 局部 DOM／像素检查通过，SVG 仅该标题 y 改变。新查看源图、原尺寸候选和 331 px 候选 3 张；本次续作累计 8 张，停止开图。作者检查不是独立批准；原 FAIL、repair1 和 N75 其他科学／细节 HOLD 均保留，未批准整图、促进课程或记为新交付。应用测试、构建、全库审计和旧 PASS 显示检查未重复。

[fig164 局部修改](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d527-fig164-label-repair/repair.json) · [受影响显示检查](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d527-fig164-label-repair/width-check.json)

## 机械检查

| 检查 | 结果 |
| --- | --- |
| 应用单测 | 131 项通过 |
| 数据库配置单测 | 4 项通过；未连接或写入共享数据库 |
| 应用构建 | 通过 |
| 资源边界审计 | 初次失败保留，未重复全库执行 |
| 教材清单／图 metadata 校验 | 初次失败保留，未重复全库执行 |
| 本轮修改的绑定 | 现有校验器受影响范围通过；不代表全库通过 |

[受影响绑定检查](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d512-review-preparation/affected-bindings-check.json) · [原检查回执与失败输出](/Users/yong/.codex/worktrees/stemrobin-181-six/lemmadeck/.intentfold/tickets/STEMROBIN-181/evidence/reports/d1816-d512-review-preparation/review-package.json)

正式 handoff 未完成，全部 AC 未通过。既有有效分支、内容、独立审查、费用及备份均保留；本轮未开启新工人、未重跑内容或显示审查，未发消息给监督或同伴。
