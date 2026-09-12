# STEMROBIN-127 Handoff

## What changed

- 修复 `ld-s10y-lesson` 的目录认领，使编号单元、章末补充习题和全书难题都从 TOC
  获得正式 card ID，并补充确定性测试。
- 修复首批真实转写暴露的跨行公式、连续分题、扫描行带和西里尔分题字符处理问题。
- 完成 6a 物理页 7–16 的忠实抽取，以及
  `alg6-c1-s1-n1`、`alg6-c1-s1-n2` 两个单元的 `modern-us-neutral` 版本、
  现代插图、答案键、交互规格、自包含 HTML 和数据库发布。
- 在 `app/src/styles/app.css` 中让超长不可断公式局部横向滚动，消除移动端整页溢出。

## AC results

1. **纯练习目录认领通过。**
   `python -m unittest discover` 共 23 项通过，其中目录夹具确认
   `alg6-c1-ex`、`alg6-c2-ex`、`alg6-c3-ex`、`alg6-c4-ex`、
   `alg6-c5-ex`、`alg6-hard` 均取得正式 ID；HTML 片段 Node 测试也通过。
2. **两个单元完整产出通过。**
   物理页 7–16 共 10 份页级 audit：0 error、0 行数差异、0 未知字符、0 KaTeX
   warning。书级装订得到 33 道题；现代版状态为 `ready`，单元 1 为 1 个正文块、
   12 道题、1 张图，单元 2 为 2 个正文块、21 道题、7 张图。两课 adaptation
   audit 和 answer-key audit 均为 `pass`，两课离线 render 均返回 `ok: true`。
   第 3 单元仅保留边界页带出的未闭合原始片段，没有现代版或数据库记录。
3. **本地产品可见通过。**
   `http://localhost:52127` 返回 200。headed Chromium 在 `1440x960` 和
   `390x844` 下验证目录导航、两张课程卡、正文、12/21 道练习和 1/7 张插图；
   页面及详情区无横向溢出，无控制台错误或错误态。截图保存在忽略的票据 `tmp/`。
4. **答案、交互与服务端判题通过。**
   数据库仅有两个 `alg6-%` 发布行；答案键和交互规格分别为 12/12、21/21。
   初始客户端载荷不含答案键、expected 值或判题字段。测试用户 2 提交单元 2
   第 14 题后得到服务端正确判定，验收脚本随后清理了本轮答题与错题记录。

机械防线 `cd app && npm run test && npm run build` 通过：11 个测试文件、75 项测试通过，
生产构建成功。

## Deviations

- 路线没有功能性偏离。移动端公式溢出是在产品验收中发现的阻断项，因此在既定范围内增加
  了局部 CSS 修复。
- 按计划完整转写闭合第二单元所需的边界页，因此原始装订层包含第 3 单元开头；它未进入
  现代版、答案、交互或发布范围。

## Environment

- 本地服务端口：`52127`
- 工作树：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-127`
- 分支：`STEMROBIN-127-6a-pilot-fix`
- 环境变量：未新增、修改或删除任何 key；`.env` 与 `app/.env` 未提交。

## Residual

- 第 3–55 单元、五组章末补充习题和全书难题仍需后续工单分批生产。
- `p2c.py render` 同一命令重复传入多个 `--lesson` 时只报告最后一个；本票分别调用两个
  单元完成验证，不在本次阻断修复范围内。
