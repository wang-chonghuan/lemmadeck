# STEMROBIN-126 Handoff

## What Changed

- 删除过时数学课生成材料：
  - `resources/content/course-gen-guide-math.md`
  - `resources/content/intent.md`
  - `.codex/sr-math-lesson/` 下的旧样品
  - 只验证旧 `/lesson/:id` iframe 产物的 `app/tests/lesson-regeneration.spec.ts`
- 将 `resources/content/course-gen-guide-common.md` 收窄为物理课程专用，不再提供另一条数学课生成入口。
- 将工程 Charter、活动技能说明、应用注释和 Evodocs 模块统一到当前链路：
  `ld-s10y-lesson` → `ld-s10y-image` → `ld-s10y-answer` → `sr_lessons` → `/card/:id`。
- 清除现行 `ld-s10y-lesson` 工具中最后一个 `ld-mathpdf` 旧名称。
- 保留数据库和运行时兼容面，包括旧卡片树读取、locale overlay、ledger 表和关系型题目表；
  它们不再被描述为当前数学课生成入口，也未在本票中做数据迁移。

## AC Results

| Criterion | Result | Evidence |
|---|---|---|
| AC1 当前入口唯一 | PASS | 对 `AGENTS.md`、四文件 Charter、活动技能、Evodocs、应用和资源入口检索后，当前数学课生产均以 `ld-s10y-lesson` 为唯一新课入口，并明确委托 `ld-s10y-image` 和 `ld-s10y-answer`，发布到 `sr_lessons` 后由 `/card/:id` 读取。 |
| AC2 旧生成流程退出活动范围 | PASS | 排除冻结历史、已完成票据、构建输出和依赖目录后，`sr-math-lesson`、`ld-mathpdf`、旧 `sr-lesson` 路径、旧数学指南、旧 prompt、旧样品和 `/lesson/:id` 路由引用均无活动命中；已决定删除的文件和目录不存在。 |
| AC3 现行 S10Y 链路保持可用 | PASS | `ld-s10y-lesson` 16 项 Python 测试及 `test_htmlfrag.js` 通过；`ld-s10y-image` 14 项测试通过；`ld-s10y-answer` 11 项测试通过。应用在 `52126` 端口运行，Playwright 以 `1440x960` 和 `390x844` 打开 `/card/math5-c1-s1-n1`，两次均为 HTTP 200、标题可见、正文 6 块、无空白/缺失状态和页面异常。 |

机械防线：

```bash
cd app && npm run test && npm run build
```

结果：11 个 Vitest 文件、75 项测试全部通过，生产构建成功。构建仅报告既有的大 chunk
提示，不影响退出状态。

## Deviations

- 实施末尾的活动范围检索发现
  `.claude/skills/ld-s10y-lesson/tools/normalize.py` 模块说明仍使用 `ld-mathpdf` 旧名称；
  已在交付前改为 `ld-s10y-lesson` 并单独提交。
- 新工作树最初没有 Node 依赖，系统 Python 也没有 `pytest`。按 Charter 安装锁定的 Node
  依赖，并使用 `uv run --with pytest` 的临时环境运行 Python 测试；依赖声明和锁文件均未修改。

## Environment

- 本地验收端口：`52126`
- 验收地址：`http://localhost:52126/card/math5-c1-s1-n1`
- 未新增、修改或删除环境变量。
- `.env`、`app/.env`、票内 `tmp/` 和构建输出均未提交。

## Residual

- 旧卡片树、overlay、ledger 和关系型 quiz 兼容代码仍保留。移除它们需要先证明历史内容与
  其他课程没有消费者，并应作为独立迁移工单处理。
- 基础课程重新发布会保留 `answerKey`，但会清除 `interaction`；当前发布顺序必须保持为
  基础课程 → 答案 → 交互。
