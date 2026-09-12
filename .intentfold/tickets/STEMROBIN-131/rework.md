# STEMROBIN-131 返工记录

## Human asks

- 用户要求把本次整章试产中确认有效的经验更新到技能，删除错误规则并替换为新规则，避免后续生成重复犯错。

## Changes

- `ld-s10y-lesson` 现在把无编号的章末补充习题视为正式可发布卡片，并明确整章边界、跨页闭合和扫描串页处理规则。
- edition 索引改为按原始 `book.json` 顺序重建，支持 `number: null`，不再因无编号卡片排序崩溃。
- 发布器改为从原始课程索引计算稳定的 `lesson_order`；章末补充习题不再被转换成 `0`，本章 dry-run 中 `alg6-c1-ex` 的顺序为 `8`。
- 发布器只允许 `LEMMADECK_DATABASE_URL`，删除 `EASYAPP_DATABASE_URL` 和 `DATABASE_URL` 写入回退。
- 图形质量门新增共享坐标轴、网格、数轴和坐标系必须保持为同一确定性画布的约束。
- 产品验收指导改为读取 IntentFold 工单端口，并补充平滑滚动导致末尾可达性误判的正确检查方法。
- 为无编号卡片排序、发布顺序和数据库连接边界增加回归测试。

## Rechecked criteria

- `ld-s10y-lesson` Python 测试：31 项通过。
- Node 合同测试通过。
- `ld-s10y-lesson` 与 `ld-s10y-image` 的 `quick_validate` 均通过。
- 发布器 dry-run 确认 `alg6-c1-ex lesson_order=8`。
- 按 Charter 对返工后的最终分支重新执行机械验证。

## Net effect

- 冻结的 `handoff.md` 所记录的第一章 8 个条目、179 道练习和已发布内容保持不变。
- 本次返工只把试产经验固化到生成技能、发布器和测试中，使后续整章生成能正确处理无编号补充习题、章节边界、共享图形、滚动验收和数据库写入边界。
