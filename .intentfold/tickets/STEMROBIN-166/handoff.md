# STEMROBIN-166 交付

## 变更

- 完成五年级数学整册：66 张课程卡、296 页忠实来源、1305 道习题及原书 201 个编号图。
- 本单补齐 50 张卡、1020 道题，包括第一章剩余单元、第二章、补充阅读、难题及质数表。
- 产物位于 `ssot-resources/soviet10year-textbooks/artifacts/5m/`；忠实来源与 `modern-us-neutral` 层分开保存。
- 全部课程正文、答案和交互均通过现行技能真实发布到 canonical 数据库，不以 dry-run 或本地文件代替交付。
- 新增题目均有具体标准答案：773 道自动判分，247 道实践、证明等非自动判分题仍提供完整参考答案。
- 保留原有 16 课、285 道题的完整数据库内容、答案与交互，保留全部学习记录。

## 必要修复

- 课文技能：分式及短数字的扫描行计数、TOC 印刷名称认领、数字子题边界、stdin 完整读取及 hybrid 离线分层显示。
- 图片技能：将箭头标记转为实际 SVG 图元以修复打印丢失；连接断言支持线段。
- 图片复用保留原始生成记录，另以当前来源、素材和记录哈希绑定复核，不伪造新调用。
- 产品图像检查覆盖可横向滚动的绘图区域，不将标题、边框或滚动条当作有效图像。
- 最后修复 1206、1212 的长坐标串手机溢出，只将串联公式拆成独立公式，不改变数学内容或判分。

## 验收

| 条件 | 结果与证据 |
| --- | --- |
| AC1 全册可用 | PASS。由权威 TOC 导出全部 66 个 ID，数据库顺序、数量与内容逐课匹配；全部卡各有 1440x960、390x844 headed 产品证据，共 132 次观察。 |
| AC2 来源与插图 | PASS。装订记录无 error、warning 或 KaTeX warning；习题编号覆盖 1 至 1305，编号图覆盖 1 至 201。当前行计数器只读核对本单 234 页通过，来源像素未变。图像 corpus audit 覆盖五年级全部 66 课，当前全库 441 个引用无缺失或过期；各图 source/spec/output 哈希审查和数学关系证据已保存。 |
| AC3 答案与交互 | PASS。1020 份新增答案与交互逐项匹配真实数据库，无待创作交互。逐课检查输入及数学键盘、末列与图像可达、打印、公式和页面溢出。难题组两宽各 111 场景；末组 13 题共 42 次真实匿名提交、26 张标准答案截图通过。 |
| AC4 保全与交付 | 保全及项目检查 PASS。原 16 课内容和习题哈希不变；学习表数量及哈希与初始 baseline 相同。GitHub 合并和 Plane Done 由获授权的 cap4 紧接本交付执行，最终结果留在后台关单记录。 |

机械检查均实际运行并通过：

- `python3 ssot-resources/audit.py`
- `python3 ssot-resources/soviet10year-textbooks/validate.py`
- `node --test .agents/skills/lib/content-db.test.mjs`：4 项通过。
- `npm --prefix app run test`：16 个文件、113 项通过。
- `npm --prefix app run build`：成功。

技能修复的专项测试已通过：课文 Python 127 项、图片 Python 49 项，以及相应 Node 测试；未削弱有效断言。

主要证据位于本工作区：

- `.intentfold/tickets/STEMROBIN-166/tmp/book-acceptance.json`：全册、真实数据库、132 次浏览器证据及初始基线哈希。
- `.intentfold/tickets/STEMROBIN-166/tmp/source-current-check.json`：234 页当前行数和来源像素保全。
- `.tmp/s10y-166/corpus-audit-final.json`：从实际课文及习题引用导出的图片审计。
- `.tmp/s10y-166/product-check-survey/grader/grading-check.json`：最后两道换行修复的双宽验收。
- `.tmp/s10y-166/answer-ex4.handoff.md`、`answer-61.handoff.md`、`answer-s3.handoff.md`、`s2.handoff.md`：最后四组分工证据。

关单时将两处 scratch 移至主工作区 `.intentfold/tmp/STEMROBIN-166/` 保存，不提交临时证据或凭据。

## 路线与环境

沿用计划中的现行来源、装订、现代图、答案和交互发布路径。小技能修复均由实际缺陷触发；原书歧义保留在来源层，并在现代参考答案中说明，不编造唯一值。

- 实际验收端口：52166，`http://localhost:52166`。
- 环境变量新增、修改、删除：无；无需同步环境键。
- 未改 Charter、应用代码、依赖、基础设施或数据库结构。
- Finish 为 `auto-merge`，不部署网站。Render 自动部署关闭，合并不构成网站发布。

## 剩余

本单课程范围无未完成事项。教学实践题和源书歧义采用具体参考答案及明确说明，不冒充实际测量，也不强制自动判分。
