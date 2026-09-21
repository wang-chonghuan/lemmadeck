# Handoff

本工单通过 open development phase 完成；本文记录实际交付和验收结果，不表示各项编辑由哪一种工具或技能产生。

## What Changed

- 在 `ld-s10y-image/figure-spec@2` 的 `display` 中加入可选语义用途
  `instructional | decorative`，并为装饰性图片增加强制的 `128–240px`
  `maxWidthPx`、inline 布局和宽度一致性校验。
- 更新 `ld-s10y-image` 的入口说明、FigureSpec 参考、路由规则、JSON Schema、
  Python 校验器和单元测试；未来新建或修复图片必须显式判断展示用途。
- 发布器把 `purpose` 和装饰性 `maxWidthPx` 写入课程内容；应用读取该元数据，只对
  `decorative` 图片应用紧凑宽度。
- 课程页面把连续装饰性肖像与同数量图注配成单张或多张图片组。桌面可并排，手机自然
  换行，打印使用相同语义结构；教学图片继续走原尺寸规则。
- 六年级物理第一章第 6 课的七张历史人物肖像标记为
  `decorative / inline / 160px`，重新生成哈希绑定的 review 记录，并通过课程发布器
  幂等重发到内容库。人物身份、图片像素、正文、题目、答案和数据库结构均未修改。

开发提交：`a0b7854f914782366d9abe398f996a469b9ba5fc`

## AC Results

### Criterion 1: 装饰性肖像紧凑呈现

通过。工单 Playwright 在桌面 `1440x960`、手机 `390x844` 和打印媒体下检查
`phy6-c1-s6`：

- 七张肖像均为 `decorative`，实际宽度在 `150–161px`；
- 七个图注全部位于对应 `<figure>` 内，组成 4 个单张/双张图片组；
- 手机双张组自然换为单列，长姓名正常换行；
- 课程滚动区域无横向溢出。

截图保存在未提交的
`.intentfold/tickets/STEMROBIN-143/tmp/screenshots/`。

### Criterion 2: 教学图片保持可读

通过。同一浏览器检查在桌面和手机打开 `phy6-c1-s3`，确认教学图片 `fig-02`
仍标记为 `instructional`，渲染宽度至少 `300px`，未被装饰性宽度规则缩小。

### Criterion 3: 图片技能固化规则

通过。

- `skill-creator` quick validation：`Skill is valid!`
- `ld-s10y-image` 校验器单测：22 项通过
- 七份肖像 FigureSpec 在 `rendered` 阶段全部通过
- 内容库查询：`figure_count=7`、`compact_count=7`、`prose_count=26`、
  `exercise_count=1`
- 发布器 dry-run 和实际幂等发布均只处理 `phy6-c1-s6`

### Criterion 4: 项目机械检查

通过。

- `python3 ssot-resources/audit.py`
- `python3 ssot-resources/soviet10year-textbooks/validate.py`
  - 16 PDFs
  - 17 catalog volumes
  - 510 lessons
  - 407 figure render records
- `cd app && npm run test`
  - 14 test files
  - 82 tests
- `cd app && npm run build`

## Deviations

无。本工单没有约定的 `draft.md`，open development 直接按 live ticket 和 `ac.md`
实施。

## Environment

- 本地服务：`http://localhost:52143`
- 新增、修改或删除的环境变量：无
- 数据库结构变更：无

## Residual

- 分支尚未合并或部署；生产内容库已包含装饰性展示元数据，但生产应用需在 cap4 合并并
  例行重新部署后才会使用该元数据。
