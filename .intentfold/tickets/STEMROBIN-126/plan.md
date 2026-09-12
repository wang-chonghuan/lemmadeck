# 现状

- 当前数学课程生产事实已经集中在 `.claude/skills/ld-s10y-lesson`：扫描页视觉转写、跨页装订、原图矢量化、现代 edition 改写、离线渲染和 `sr_lessons` 发布都由该技能编排；现代图委托 `ld-s10y-image`，答案与交互规格由 `ld-s10y-answer` 补齐。
- 旧的 `sr-math-lesson`、`sr-lesson`、`ld-mathpdf` 和 math ledger 已在提交 `ee8ad69` 删除，但 charter、Evodocs、相邻技能说明和旧资源仍把它们描述成当前入口。
- `resources/content/course-gen-guide-math.md` 仍提供一套 AI 从主题直接撰写数学课的提示词，与基于扫描教材的现行路线冲突；`.codex/sr-math-lesson/` 仍保留旧流程样品。
- 应用和数据库仍包含旧 JSONB 卡片树、overlay 与 ledger 的兼容读取或历史表结构。这些是运行时兼容面，不是现行生成入口；是否移除它们涉及产品数据迁移，不应在本票中顺带决定。
- 人已确认：删除数学旧指南和旧样品，把共用生成指南收窄为物理专用；保留数据库与应用的
  旧卡片树、overlay 和 ledger 兼容读取，不在本票做数据迁移。

# 路线

1. 删除数学专用旧生成指南、无消费者的旧通用数学 prompt 提案、旧流程样品，以及只验证
   已移除 `/lesson/:id` iframe 产物的浏览器用例；处理共用指南对数学的旧入口，同时保持
   物理指南自洽。
2. 更新人拥有的工程/运行 charter，以及仍引用已删数学技能的活动技能说明，使数学内容生产只路由到 `ld-s10y-lesson`，并写清 `ld-s10y-image`、`ld-s10y-answer`、`sr_lessons` 与 `/card/:id` 的职责链。
3. 使用 n-evodocs 的受控流程重建内容生成模块边界和受影响模块文档，使机器事实来自当前技能、发布器、应用读取代码和数据库 schema。
4. 用仓库检索证明旧入口已从活动范围消失；运行 S10Y 技能的现有测试，并启动应用检查一个已发布课程单元仍可访问。
