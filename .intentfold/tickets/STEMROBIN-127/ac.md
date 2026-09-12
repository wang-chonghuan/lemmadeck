# AC1：纯练习目录认领

检查：运行装订器的确定性测试，并用覆盖 6a TOC 三种条目形态的夹具调用目录认领逻辑。

通过条件：`alg6-c1-ex`、`alg6-c2-ex`、`alg6-c3-ex`、`alg6-c4-ex`、
`alg6-c5-ex` 和 `alg6-hard` 都获得对应正式 ID；无临时 ID、回退 ID 或按标题硬编码。

# AC2：两个单元完整产出

检查：运行目标物理页的 page finalize、带 6a TOC 的 assemble、vectorize、第二次
assemble、两个目标 lesson 的 adapt-finalize 和 render，并读取各级 audit。

通过条件：两个目标 ID 的页级、书级、edition 和离线渲染检查均通过；产物完整且发布命令
只选择这两个 ID，第三单元没有被部分发布。

# AC3：本地产品可见

检查：查询 `sr_lessons` 的两个目标行；启动 `http://localhost:52127`，用 headed Chromium
分别在 `1440x960` 和 `390x844` 打开目录及两个 `/card/:id` 页面。

通过条件：目录中的两项均可点击；每张卡片无错误态，正文或练习非空，显示题数与数据库一致，
插图可读，页面无整页横向溢出和控制台错误。

# AC4：答案、交互与服务端判题

检查：读取两个 lesson 的答案和交互审计，查询数据库逐题核对 `answerKey` 与 `interaction`；
在本地浏览器初始载荷中检索敏感答案字段，并以测试用户提交至少一道 `grading: auto` 的题，
随后查询并清理该测试产生的 `sr_answer_events`。

通过条件：每道题恰有一个答案键和一个交互规格；初始客户端响应不含 `correct_index`、
`answer`、`accept` 或答案键中的 expected 值；提交由服务端返回正确判定，且只写测试用户
`user_id = 2` 的可清理事件。
