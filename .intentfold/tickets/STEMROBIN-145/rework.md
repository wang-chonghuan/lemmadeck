# STEMROBIN-145 Rework

## 人工要求

- Plane 复验评论 `065c5088-80ee-4229-8523-2aa809c747f4` 要求保持旧课程原始
  `exercises.json` 字节、source hash 和完整快照稳定，同时纠正技能中把题号默认视为
  全书连续的旧说明。用户随后授权继续修复。
- Plane 定向复验评论 `61b2b4e5-06f7-4498-afe4-287314574301` 要求贯通旧物理课缺失
  `group_id` 时的新格式答案捕获与 cap2 prepare，并继续严格拒绝错误栏目。用户随后授权
  继续修复。
- Plane 评论 `7d7d2865-11bf-42af-93e1-c2afc8594ae0` 明确批准关闭工单，并将本单有效
  finish 从 `review` 改为 `auto-merge`；不包含部署授权。

## 修改

- 无内容变化的 assemble 会先比较旧产物与新装订对象；只有实质字段完全一致、差异仅为
  旧文件缺少可选 `source_number` / `group_id` 时，才原样复用旧 `exercises.json` 字节。
  题号、正文、栏目、图引用或既有身份变化仍会写出新产物。
- 课文技能和 assemble 成功信息改为按 manifest 的 `book`、`lesson`、`lesson-group`
  编号范围表述，并要求新书先核对 PDF、TOC 和编号范围。
- `lesson_answers prepare` 对缺少可选身份字段的旧 `lesson-group` 课程，从持久
  `page.json` 和规范 TOC 在内存中重建栏目身份；只有旧原书与重建对象除可选字段外完全
  一致、edition 稳定身份也逐题一致时才用于匹配。没有改写旧原书或 edition，没有默认
  `g1` / `g0`，捕获答案的错误栏目仍被拒绝。
- 增加真实 6p、旧 6a 的无内容重装订兼容回归，以及
  `phy6-c1-s2` 的旧课程 → assemble → 新格式答案捕获 → cap2 prepare 回归和错误栏目
  拒绝用例。

## 复验

- 真实 6p 与旧 6a 无内容 assemble 后，目标原始 `exercises.json` 字节保持不变，同一
  `modern-us-neutral` edition 继续通过 `edition.validate_lesson`；6a 用例包含现代图。
- 原定向复现脚本
  `.intentfold/tickets/STEMROBIN-145/tmp/review-legacy-answer-join.py` 原样通过。
- `ld-s10y-answer` 14 项测试、`ld-s10y-lesson` 61 项测试、app 87 项测试通过。
- `python3 ssot-resources/audit.py` 与
  `python3 ssot-resources/soviet10year-textbooks/validate.py` 通过，生产构建通过。
- UI 未受返工影响，沿用首次 handoff 已通过的桌面和移动端证据。

## 相对首次交付的净变化

冻结 handoff 中的课程地址、题目 ID、内容、答案、交互、学习数据和 UI 行为不变。
返工只补齐旧产物重复装订时的 source 稳定性，以及旧物理课后续答案生产时的确定性
栏目身份解析。没有发布课程、写生产内容、部署或启动十本书生产。
