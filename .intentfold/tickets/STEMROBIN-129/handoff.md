# STEMROBIN-129 Handoff

## What Changed

- 修复 `ld-s10y-image` 图稿渲染器的 SVG ID 冲突：JSXGraph 画板、裁切路径和附加图层现在按
  FigureSpec ID 命名，不同图稿内联到同一课时不会再互相引用裁切区域。
- 新增渲染器回归测试，同时生成两张图并验证 SVG ID 集合互不重叠、所有 URL 引用均指向各自图内
  的元素。
- 通过现有 S10Y 图稿和课程发布流程重新生成 `fig-03`、第二课离线练习页，并且只重新发布
  `alg6-c1-s1-n2`。
- 发布前后该课的 21 道题、21 份答案和 21 份交互规格均保持不变；元数据哈希未变化。

## AC Results

| Criterion | Result | Evidence |
|---|---|---|
| 棋盘完整显示为 8×8 | PASS | 在练习 21 中检测到 32 个深色格和 18 条横纵网格边界，完整构成 8 行 × 8 列；原先被裁掉的下四行全部可见。 |
| 行列标完整且对齐 | PASS | `a`–`h` 与 `1`–`8` 共 16 个标记全部可见，列标位于对应列下方，行标位于对应行侧边。 |
| 桌面与手机可用 | PASS | headed Chromium 分别在 `1440x960` 和 `390x844` 验证；棋盘未裁切、未溢出练习容器，页面无横向溢出，数学答案输入框可用。 |

验收截图：

- `.intentfold/tickets/STEMROBIN-129/tmp/exercise-21-desktop.png`
- `.intentfold/tickets/STEMROBIN-129/tmp/exercise-21-mobile.png`

机械防线通过：应用 77 项测试全部通过，生产构建成功。`ld-s10y-image` 15 项测试全部通过；
FigureSpec 校验、图稿渲染报告、课程 finalize 和离线渲染均通过。

## Deviations

- 计划原本聚焦棋盘图，但排查确认棋盘 FigureSpec 本身已经完整。根因是同一课内多张 SVG 使用
  `board_ClipFull` 等重复 ID，浏览器把 800px 高棋盘错误套用了前面 320px 高表格的裁切路径。
  因此修复落在共享渲染器，并用回归测试覆盖多图内联场景。
- 未修改原教材提取层，也未手工修改生成 SVG 的路径数据。

## Environment

- 本地验收端口：`52129`
- 验收地址：
  `http://localhost:52129/card/alg6-c1-s1-n2?tab=ex&exercise=21`
- 未新增、修改或删除环境变量。

## Residual

无。本次修复作用于所有后续由 `ld-s10y-image` 生成并内联的图稿，可避免同类 SVG ID 冲突再次发生。
