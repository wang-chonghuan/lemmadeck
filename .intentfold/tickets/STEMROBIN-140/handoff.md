# STEMROBIN-140 Handoff

## What Changed

- 新增从课文图块、习题展示图和 `figure_refs` 反推实际在用图件的 corpus auditor，并检查
  manifest、当前 FigureSpec、render/generation、review 及其哈希绑定。
- 修复 edition 校验遗漏共享习题图的问题，并把五年级第 3 课实际使用的 `fig-05` 纳入
  manifest。
- 将 34 个课程单元中的 158 张旧图迁移到 `figure-spec@2`：153 张 deterministic、
  4 张 hybrid、1 张 generated；保留 STEMROBIN-139 已合格的 13 张当前图。
- 为 grid 增加局部 `bounds`、`xOffset`、`yOffset` 支持和验证，恢复 `fig-62`、
  `fig-64`、`fig-65` 中遗漏的网格、方格与街区结构。
- 更新 `ld-s10y-image` 规则，明确教材中的网格、表格线和街区阵列属于不可省略的教学结构；
  删除已替代的旧 `.svg.json` 及扁平 hybrid 输出。
- 仅重新发布原已上线的 21 课；其余 13 个离线课程仍未发布。未发现需要同步修改答案的题图事实。

## AC Results

### AC1 - Complete Reference-Derived Inventory

- 迁移前报告：54 课、171 张实际引用图、158 张旧规格、13 张当前规格、34 个受影响单元。
- 迁移后 `.tmp/s10y-image/corpus-audit.json`：54 课、171 张当前规格图、0 张旧规格图、
  0 个缺 manifest/spec/evidence/review/hash 问题。
- live DB 只读核对：34 个受影响单元中预期上线 21，实际上线 21；错误 edition 0，
  意外新增发布 0，漏发布 0。

### AC2 - Figure Fidelity, Readability And Themes

- 158 张迁移图均生成当前 spec、输出、render/generation 证据和 hash-bound review。
- 全量原图/新图对照已在 `.tmp/s10y-image/contact-5m-01..07.jpg` 与
  `.tmp/s10y-image/contact-6a-01..07.jpg` 检查。
- renderer/validator 验证数学断言、边界、碰撞、声明宽度下至少 16px 字号及语义颜色角色；
  edition validator 验证全部课程引用和持久产物。SVG 使用 CSS 变量，强调色和黑白打印不
  改变图形结构。
- 资源总验证通过：16 个 PDF、17 册目录、510 课、341 份图形渲染记录。

### AC3 - Publication And Product Consistency

- 21 个原已上线课程完成 publisher dry-run 和发布，课程 ID 与
  `modern-us-neutral` edition 保持不变；13 个原离线课程没有新增发布。
- `1440x960` 与 `390x844` 共 42 次产品检查通过：所有展示图非空、可到达且与持久化
  SVG/PNG 一致；全部 3706 个输入实例都有可操作数学键盘；无页面错误或横向溢出。
- 工单打印检查共 42 次通过：下载按钮每次调用一次 `window.print()`；普通课打印区同时
  包含课文和习题，章节总练习页打印其实际习题内容；课文和习题图与屏幕显示逐项一致。
  证据在 `.intentfold/tickets/STEMROBIN-140/tmp/print-check.json`。

### AC4 - Bugs And Regression Gates

- 图片技能 31 项测试通过，覆盖引用漏 manifest、旧规格、缺 review、过期哈希、越界对象、
  缺关系、字号不足及 bounded/offset grid。
- 课程技能 41 项测试通过，覆盖展示图/共享图必须存在于本课 manifest。
- Charter mechanical defence 全部通过：
  `python3 ssot-resources/audit.py`、
  `python3 ssot-resources/soviet10year-textbooks/validate.py`、
  `cd app && npm run test && npm run build`；应用测试为 14 个文件、82 项通过。

## Deviations

- 未调用图片模型；现有 generated/hybrid 语义素材足以分层迁移，没有产生新模型费用。
- 原计划中的迁移检查发现三张图遗漏了教学网格，因此补充了通用 grid 局部边界和相位支持，
  而不是为单图手写 SVG。

## Environment

- 本地预览：`http://localhost:52140`
- Worktree：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-140`
- Branch：`codex/STEMROBIN-140-migrate-legacy-figures`
- 环境变量新增、修改、删除：无

## Residual

- 无已知代码或内容缺陷。迁移脚本、修复脚本、contact sheets、截图和验收报告均为
  `.tmp/` 或工单 `tmp/` 下的可删除证据，不是持久产物。
