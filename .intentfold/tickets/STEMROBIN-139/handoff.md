# STEMROBIN-139 Handoff

## What changed

- 将独立图片技能升级为 `ld-s10y-image/figure-spec@2`：
  - 原图清单分别绑定稳定的 object/assertion id；
  - 新增 `inside` 与 `connects` 关系断言；
  - 声明产品显示宽度并在渲染时检查最终字号不低于 16px；
  - 矢量颜色改用 `ink`、`muted`、`accent`、`accentSoft`、`grid`、`paper`
    语义角色并输出 CSS 变量；
  - 渲染报告升级为 `render@2`，目视验收拆为哈希绑定的 `review@1`。
- hybrid 改为独立的 artwork PNG 与 SVG overlay；发布器、课程校验、应用数据类型和卡片
  UI 均支持分层显示、主题换色和打印，不再交付扁平合成 PNG。
- 重新生成并验收六年级代数第 8、9 课全部 12 张图。图 34 改为四个纵向关系面板，
  48 项集合归属与 12 条箭头关系均有机器断言。
- 将 `5m` 的图 44 迁移为代表性 hybrid 样例。
- 更新 `ld-s10y-image` 与 `ld-s10y-lesson` 文档和 modern profile；删除旧
  `migrate_legacy_svg.py`、对应测试、固定青绿规则、内嵌 review 约定、迁移样图旧
  `*.svg.json` 报告，以及图 44 的扁平 PNG/元数据。
- 第 8、9 课已通过现有 publisher 写入 `LEMMADECK_DATABASE_URL` 内容库。

## AC results

- **AC1 - Real Figures: PASS**
  - 发布门禁重新校验两课通过；数据库核对为第 8 课 15 个正文块/15 道题，第 9 课
    8 个正文块/6 道题。
  - 12 张课程图和图 44 hybrid 样例均有当前 spec、render/review 证据。
  - 图 34 在浏览器中有 36 个标签、12 条箭头、四个完整关系面板；人工检查原图/新图
    contact sheet 和代表截图通过。
- **AC2 - Readability And Themes: PASS**
  - 工单 Playwright 脚本在 `1440x960` 与 `390x844` 检查两课全部图片：SVG 标签最终
    字号均不低于 16px，无不可达裁切或标签重叠。
  - neutral、accent、print 的实际计算色分别为
    `rgb(21, 32, 31)`、`rgb(14, 124, 155)`、`rgb(21, 32, 31)`；切换未改变 SVG
    结构或调用图片模型。
  - hybrid 样例的 artwork 与 vector 各有独立 DOM 层，面积相同且原点一致。
- **AC3 - Reject Known Failures: PASS**
  - 图片 skill 23 项测试通过，覆盖集合越界、清单遗漏、箭头端点错误、最终字号不足、
    review 证据过期和原始颜色值。
  - 课程 skill 38 项测试通过；发布门禁拒绝历史 FigureSpec 的测试通过。
- **AC4 - One Current Path: PASS**
  - 搜索确认旧 SVG 推断入口和扁平 hybrid 活动契约无调用。
  - `python3 ssot-resources/audit.py` 通过。
  - `python3 ssot-resources/soviet10year-textbooks/validate.py` 通过。
  - app 82 项测试通过，`npm run build` 通过。
  - `quick_validate.py` 通过；系统 Python 缺 `PyYAML`，使用
    `uv run --with pyyaml` 执行同一校验脚本。

## Deviations

无。按计划保留历史 `figure-spec@1` 的只读识别，以便现有未迁移课程仍可审计；当前
renderer 和重新发布门禁只接受 `figure-spec@2`，不存在旧生成入口。

## Environment

- 本地服务：`http://localhost:52139`
- 未新增、修改或删除环境变量。
- 使用现有 `LEMMADECK_DATABASE_URL` 通过课程 publisher 更新两课内容。

## Residual

- 本工单只迁移第 8、9 课及一个 hybrid 代表样例。其他历史 `figure-spec@1` 图保持只读，
  后续只有在课程重新生成或单独修图时才迁移。
- `5m` 图 44 所在课程的其他图片仍是历史规格，因此本工单只证明该 hybrid 图本身及
  分层 UI 契约，不重新发布整课。
