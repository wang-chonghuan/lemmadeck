# STEMROBIN-173

本工单通过开放开发阶段完成；本文记录实际交付及验证结果。

## What Changed

- 从共享生产数据库的 `sr_lessons.exercises` 硬删除全部 15 套旧选择题，
  合计 972 道；连同答案、题源映射及内嵌图像一起移除。
- 按用户追加要求清空全部学习活动：`sr_content_answer_events` 的 61 条、
  `sr_textbook_mistakes` 的 18 条。其余作答、练习、测验、复习活动表
  原本为空，清理后七张活动表均为零。
- 当前分支删除 211 个旧题产物文件，包括五套题包及选择题专用图像。
- 清理旧生成工单 169 工作区的 989 个旧题产物文件，以及主工作区和
  旧工单中的 365 个临时文件、实验题、截图与旧技能副本，共删除 1565
  个文件实例。未删除原始教材或修改新重写的技能。
- 无产品代码、数据库结构、依赖或 Charter 变更；一次性清理与验证脚本
  位于本工单忽略的 `tmp/`，没有新增系统机制。

## AC Results

1. **当前文件清理通过。** 按题包路径和 `choice-figures/` 目录导出数量，
   删除前确认无原课文、书写题引用专用资产。清理后两个工作区的旧题包、
   专用资产及指定临时目录均为零，其他已存在的工作区未发现旧题包。
2. **活跃数据库清理通过。** 使用现有 `content-db.mjs` 入口执行简单事务，
   删除前只输出数量，不导出题目或学生答案。15 套 / 972 道归零；
   七张活动表全部归零。事务内比较去掉 `choices` 键后的全课文记录哈希，
   原始内容未变。浏览器验收后复查仍为零；所有 JSON 列扫描未发现旧题
   标记，旧 `sr_questions` 表亦为空。
3. **产品与必要检查通过。** 本地有头 Chromium 检查第二章全部 15 课，
   桌面 1440x960、手机 390x844 共 30 项通过：旧习题选项卡消失，
   `?tab=choices` 不显示旧题，课文和书写题仍可阅读，不提供答案输入框。
   检查使用测试用户 2，未创建学习活动记录。

必要检查结果：

- `python3 ssot-resources/audit.py`：通过。
- 教材 `validate.py`：通过，16 PDFs、17 catalog volumes、510 lessons。
- `node --test .agents/skills/lib/content-db.test.mjs`：4 项通过。
- `npm run test`：18 文件、127 项通过。
- `npm run build`：通过；原有大 bundle 提示不影响构建。

复现只读验证：在当前工作区运行 `tmp/purge-db.mjs` 和
`tmp/purge-files.mjs`，不传 `--apply`；从 `app/` 运行
`node ../.intentfold/tickets/STEMROBIN-173/tmp/ac-check.mjs`。
桌面与手机课文、书写题截图位于本工单 `tmp/`。

## Deviations

用户在执行前追加要求清空全部练习数据，因此删除所有学习活动而非仅匹配
旧选择题的作答记录。已同步到实时工单及 `ac.md`。未为残留数据开发任何
兼容、补偿或迁移机制。

## Environment

- Preview: `http://localhost:52173/card/alg6-c2-s4-n20`
- Checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-173`
- Branch: `codex/STEMROBIN-173-purge-choices`
- 无环境键变更。将已有锁定依赖复制到本工单忽略的 `app/node_modules`，
  解决跨工作区符号链接被开发服务拒绝的问题，未更改依赖清单。
- 共享数据库变更已经生效；无部署操作。Finish 为 review。

## Residual

旧题的活跃数据与当前可控文件已清理，不保留新备份。
Git 历史、历史分支及托管数据库的日志/备份没有被重写，不宣称物理不可恢复。
旧工单 169 分支未合并；其工作区中旧题和旧技能副本已删除，但历史提交保留。
