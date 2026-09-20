# STEMROBIN-141 Handoff

## What Changed

- 完成六年级代数第 10 课「用式给出函数」和第 11 课「用图象给出函数」的忠实抽取、
  `modern-us-neutral` 现代版、答案键、交互规格和正式内容发布。
- 持久化物理页 57-66 的页级转写和审计，并以第 12 课开头作为右边界闭合第 11 课；
  第 12 课没有生成现代版，也没有发布。
- 新增并审查 `fig-41` 至 `fig-57` 以及 3 张练习表格的当前 FigureSpec、SVG、render 和
  hash-bound review 产物。
- 第 10 课包含练习 201-213，第 11 课包含练习 214-230；两课共 30 道题、20 张现代图。
- 修复 `adapt-finalize` 读取旧持久文件而不是本轮 `.tmp` 模板的问题；现在先验证模板，
  通过后才提升到持久 edition。
- 修复中文列举标点位于 KaTeX 数学区时的校验阻塞：允许仅移动数学边界标点，同时继续拒绝
  数字、变量、运算符或公式结构变化，并把规则写入 `ld-s10y-lesson`。

## AC Results

### AC1 - Complete Lesson Boundaries

- 持久产物和数据库均确认第 10 课为 7 个正文块、13 道题，第 11 课为 21 个正文块、
  17 道题。
- 数据库顺序为第 10 课 `lesson_order=1011`、第 11 课 `lesson_order=1012`。
- 数据库只返回两个目标课程；边界页上的 `alg6-c2-s2-n12` 未发布。
- `check_product.mjs` 在两个视口均确认题数、图引用和展示图与持久产物一致。

### AC2 - Readable And Faithful Figures

- 20 张现代图全部通过 FigureSpec render/review 和课程发布重验。
- 浏览器检查在 `1440x960` 和 `390x844` 覆盖两课，检查到第 10 课 2 个练习图实例、
  第 11 课 14 个练习图实例；所有媒体非空、可到达、与持久 SVG 一致，无页面错误或横向溢出。
- 黑白打印预览逐页检查通过：第 10 课 5 页、第 11 课 15 页，图表、坐标、曲线和标签无
  空白或裁切。

### AC3 - Answers And Interactions

- 第 10 课 13 份答案和 13 份交互规格，含 11 道自动判分、2 道不判分题。
- 第 11 课 17 份答案和 17 份交互规格，含 14 道自动判分、3 道不判分题。
- 第 212 题书后答案 `[1,1]` 与原图 `A(-2,4), B(4,1)` 冲突；发布正确答案 `[1,4]`，
  同时保留 `bookRaw` 和复核说明。
- 两个视口均逐框检查第 10 课 50 个、第 11 课 79 个答案输入框；每个输入框都可打开数学
  键盘并只向目标输入框写入。匿名 numeric 样本判分正确，标准答案以 KaTeX 渲染。

### AC4 - Publication And Download

- 课程发布器、答案发布器和交互发布器均真实写入 `LEMMADECK_DATABASE_URL`。
- 数据库只读核对：两课 edition 均为 `modern-us-neutral`，题目、答案和交互数量均逐题一致。
- 浏览器打印面同时包含 `read` 和 `exercises`；生成的 A4 PDF 分别为 5 页和 15 页，
  文本覆盖题号 201-213、214-230，全部内嵌图形可见。
- 管线缺陷回归测试 26 项通过；Charter mechanical defence 全部通过：
  `python3 ssot-resources/audit.py`、
  `python3 ssot-resources/soviet10year-textbooks/validate.py`、
  `cd app && npm run test && npm run build`。应用测试为 14 个文件、82 项通过。

## Deviations

- 原计划预计可能需要生成式或混合图片；实际图件均可由确定性 SVG 准确表达，因此没有调用
  图片模型，也没有新增模型费用。
- 原计划仅在发现缺陷时修改流程。本轮实际发现 finalize 模板读取错误和数学区中文标点问题，
  已修复生产代码、测试和技能说明后重新生成、发布并验收两课。

## Environment

- 本地预览：`http://localhost:52141`
- Worktree：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-141`
- Branch：`codex/STEMROBIN-141-generate-lessons`
- 环境变量新增、修改、删除：无

## Residual

- 无已知代码或内容缺陷。浏览器截图、产品检查报告和 PDF 检查文件位于工单 `tmp/` 或
  `.tmp/`，属于可删除验收证据。
