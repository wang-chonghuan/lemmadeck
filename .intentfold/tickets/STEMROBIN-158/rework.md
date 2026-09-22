# STEMROBIN-158 Rework

## 审查要求

- Plane 审查评论 `e0d1f3c0-4b46-4069-a11e-84b4e480a34a` 指出两个 P2：
  离线课程渲染器未消费图片 `display` 契约，导致 `fig-67` 在桌面和手机上实际只有约
  8px，却被旧验收按缩放前字号判为 28px；隔离样本的 `source.inventory` 又是从旧重画
  结果反推，错误声明坐标轴、刻度、25 个文字和 21 条线，并把原图 9 列 7 行重画成
  9 列 8 行。
- 本轮只返工这两项，保留首次 `handoff.md` 冻结；不改已发布 `5m` 正式成果，不扩展为
  全库重做，不发布课程、不合并、不关闭、不部署。

## 修改

- 课程离线渲染器读取 FigureSpec 的 `display.layout`、`display.purpose` 和
  `display.maxWidthPx`，为 inline / scroll 输出与产品一致的媒体容器。scroll 图保持
  640px 实际媒体宽度并允许横向滚动，删除原先把正文图和习题图固定压到 `26em` /
  `18em` 的过时规则。
- 新增课程渲染器回归测试，证明 inline 最大宽度和 scroll 固定宽度来自显示契约，并
  证明旧缩图 CSS 已被移除。
- FigureSpec schema 和 validator 新增 `gridDimensions`、`displacement` 可执行断言；
  `source.inventory[].requires` 可显式要求网格尺寸或点关系门禁。旧 `figure-spec@2`
  不被无条件迁移，但声明这些来源事实的当前 spec 不能再用 `objectCount` 冒充关系验证。
- 图片与课程 skill 原位替换复用说明：新建或复用现代图都必须重新打开
  `source.image` 原 PNG；旧 spec、旧 SVG 和字节一致重建只能证明实现确定性，不能证明
  来源保真；现代规整或增补必须与原图事实分开记录。离线验收改为按 SVG screen
  transform 计算实际字号，并检查滚动末端可达。
- 仅在本票可删除的隔离样本中重建 `fig-67`：原图事实为 9 列、7 行网格，只有
  `O/M/K/P/N` 五个标签，无坐标轴和刻度；相对 `O` 的位移为
  `M=(3,5)`、`K=(4,1)`、`P=(1,3)`、`N=(5,4)`。正式
  `ssot-resources/.../artifacts/5m` 保持无差异。

## 正反例与复验

- FigureSpec validator 26 项通过。新增正例验证 9×7 网格和四个位移；反例分别证明
  错误行数、错误位移，以及只提供 `objectCount` 时都会失败。
- 图片 renderer 5 项通过；课程 renderer 新回归 1 项通过；课程 Python suite 71 项
  通过；HTML fragment 检查通过。
- 隔离 `fig-67` spec 校验和 `validate_publish.py` 通过。headed Chromium 在
  `1440x960` 与 `390x844` 下均得到 640px SVG、20px 最小实际字号、5 个来源标签、
  无裁切、无页面溢出，且横向滚动末端可达。
- 原审查脚本 `tmp/reviewer/check-figure-font.mjs` 已由失败转为通过：离线桌面/手机均为
  640px、20px；现有产品桌面/手机仍为 640px、17.5px，四个结果都满足 16px 下限。
- 资源审计通过；教材校验通过（16 个 PDF、17 册、510 课、407 条图片渲染记录）。
- 图片技能全量 discover 的 37 项中，36 项执行通过；唯一错误是环境缺少既有
  `PIL`，导致与本轮无关的 `test_remove_background` 无法导入。未新增依赖；本轮涉及的
  validator 与 renderer 测试已分别全绿。

## 沿用证据

- 审查评论明确确认两课 `validate_publish.py`、第 12/13 页来源绑定勘误、六类真实
  MathLive 正反例、26 道练习、语义分隔和既有项目检查未受本轮修改影响，因此不重复
  运行全部 `7a` 或应用测试/构建。
- 两节 `7a` 课程仍未发布，首次 handoff 中的待发布边界不变。

## 当前状态

- 分支：`codex/STEMROBIN-158-7a-skill-fix`
- PR：GitHub #60
- 预览：`http://localhost:52158/`
- 状态：已验证，等待批准；未合并、未关闭、未部署、未发布课程。
