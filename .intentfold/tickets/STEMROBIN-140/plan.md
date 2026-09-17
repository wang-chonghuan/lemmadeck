# Findings

- 当前 edition 有 54 个课程单元，正文和习题实际引用 171 张独立图件：158 张
  `figure-spec@1` 分布在 34 课，13 张 `figure-spec@2` 已在 STEMROBIN-139 验收。
- 五年级第 3 课习题 39 实际展示 `fig-05`，但本课 `figures.json` 漏掉该图；现有
  edition 校验没有在适配阶段拦住“展示引用不在清单中”。
- 当前 publisher 已拒绝重新发布旧规格图；旧 SVG 推断迁移脚本已删除。迁移必须从原图和
  edition 文本建立 `source.inventory`、数学断言、显示宽度、语义颜色及独立 review，不能
  批量改版本号。
- 旧 hybrid 图的语义素材层和生成元数据仍在持久目录，旧 generated 图也有完整
  `gpt-image-2` edit 元数据。若源图对照通过，可复用这些语义素材并只重建当前分层输出，
  预计无需新的图片模型调用。
- live DB 有 41 个数学课程单元，其中 21 个属于本次受影响集合；未发现已发布物理课程。

# Route

1. 在 `ld-s10y-image` 增加从 edition 正文、习题展示对象和 `figure_refs` 反推目标的课程图
   审计命令，并用 fixture 覆盖漏清单、旧规格、缺 review、过期哈希和未引用清单项。
2. 修复 `ld-s10y-lesson` 的 edition 校验，使每个实际展示或引用的图都必须存在于本课
   `figures.json`；修正五年级第 3 课 `fig-05` 的共享图清单。
3. 按 `5m`、`6a` 第一章、第四章、第五章四批迁移 158 张旧图。每张先读取 context、原图
   和完整 edition 文本，独立列出 source inventory，再以旧规格仅作几何起点，生成当前
   FigureSpec、SVG/分层 artwork 或 PNG、render/generation 证据和 hash-bound review。
4. 更新每课 manifest 为当前模式的唯一输出契约，删除被替代且已无引用的旧 render
   metadata 或 flattened hybrid 输出；不修改原始抽取层。
5. 为每批生成原图/新图对照与全量 contact sheet 到 `.tmp/`，运行 spec、render、edition
   和离线课程检查；发现校验缺口时先补可失败测试和所属代码/技能规则，再重做受影响图。
6. 全部离线通过后，对 live DB 中原已上线的 21 课运行 publisher dry-run 和正式发布；
   其余 13 课保持未发布。若图中给定事实发生纠正，才通过 `ld-s10y-answer` 同步相应答案。
7. 在 `52140` 启动产品，对全部已发布受影响课程运行双视口产品检查，并验证正文、习题和
   浏览器打印下载使用同一当前图件。最后运行项目 mechanical defence 并进入 handoff。

# Redline Lookup

- 不改依赖、DB schema、云运行时、设计 token 或生产配置。
- 内容写入只使用现有 publisher 和 `LEMMADECK_DATABASE_URL`；不直接编辑 `sr_*`。
- 持久资源只写 `ssot-resources/`，批次预览、报告和截图只写 `.tmp/` 或 ticket `tmp/`。
- 不触碰主检出的未跟踪 `resources/`。
- 当前路线复用已有语义素材，预计无图片模型费用；若视觉门禁要求重新生成，先核算累计费用，
  任何可能超过 Charter `$5` 边界的调用在执行前停止并取得明确批准。

