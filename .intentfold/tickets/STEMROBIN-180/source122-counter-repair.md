# Source 122 Counter Repair

身份：`counter_repair_agent / Codex`。日期：2026-11-15。

结论：production 计行器最小修复完成；0122 实际检测由23变为24，与原页已正确的24条源行一致。**这不是页源内容审批，不替代官方 finalize122 或 Sagan 受影响源审。**

此前现代文本/选择题作者任务已停止，本轮没有继续作者或审查那些产物。

## 合同与实际诊断

- 先读 lesson skill 的行数合同、production layout.py、p2c.py 的真实遮图/版心宽/printed_lines 调用，以及相关 code-owned tests。
- 合同仍是遮掉模型确认图框后的印刷行数等于块体行数；高分式的分子分母同属一行，独立变量/正文行不能被删除或伪造 samerow。
- 实际打开 `.tmp/ld-s10y-lesson/6p/pages/0122/page.png` 原图及 Sagan 的 `tmp/source-review-121-125-evidence/0122-two-column-detail.png`，只诊断此计行区域，不重审整课内容。
- 左栏 S2、F1、F2 是三个独立条目。F1/F2之间的横线是已知/待求分隔，不是分式。右栏比例式及代入文字在垂直方向与左栏交错，不能简单以全宽强墨迹峰数替代独立行证据。
- 实际 production trace 确认：parent band 为 y359–512，normal band height40、glyph height39、normal gap30、pitch70；按 pitch 得3，但 strong_rows 只有 y374–388 和 y469–511，旧规则将3降为2。
- 横向归属诊断确认左栏 x267–530 的字形中心形成三组：y367.5–389.5（8个支持字形）、y441–450（7个）、y492–504.5（3个）。右栏及宽分隔线使全宽峰值不能可靠见证中间那条窄变量行。根因由 production trace 与实际列内像素共同确定，不是直接采纳此前候选推断。

## 最小代码改动

仅改 `.claude/skills/ld-s10y-lesson/tools/layout.py`：

1. 加 `_has_column_body_rows`，从当前 counting-only band 的横向墨迹簇取得分隔栏，使用已有的正常字形尺寸范围和字形中心聚类尺度，检查栏内独立正文行支持。
2. 仅约束旧 `count == 3 and len(strong_rows) == 2` 降计分支：若某栏确有足够独立正文行证据，不降为2。
3. 后续 `_single_fraction_row` 判据、pitch恢复、图框处理、像素阈值及全部现有常量原样保留。没有把左右栏行数相加，也没有将每个分子/分母计成额外行。

没有逐页 ID、0122坐标或期望总数写入 production；没有改阈值凑24，没有改源文字/页图/裁框/源审计，没有大重写。

新 code-owned focused tests：
`.claude/skills/ld-s10y-lesson/tests/test_staggered_column_rows.py`。
五个用例覆盖：三条独立变量与交错分式、左右镜像、真实两行系统带分式伸出、短分式碎片不能冒充三正文行、单高分式仍只计一行及调用不改输入。

## 实际验证

- 修改后的 focused unittest 首次运行：**46 tests，0 failures，0 errors，0 skips**；exit0，0.492s。范围仅新5例与已有 layout/inline-fraction/fraction-spacing/printed-row/standalone-quotient/compound-fraction 合成用例，未运行旧源页测试或全项目 test/build。
- 两个新双栏正例对保存的 pre-patch production module 实跑，均在行数断言上失败 `8 != 9`，没有 setup errors；原始 runner FAIL 输出保留。证明新测试确能抓旧缺陷，不是只在新实现下自证。
- 0122按真实 `ink_mask`、原图版心宽1390调用 production `line_bands`：24；按现有 `blocks.printed_lines` 读取未改源 MD：24。
- 首例的六条返回计行 band 为：223–262、290–330、359–409、410–461、462–512、537–627。中间三段是 parent band 的计量展开，不冒称它们是精密的文字裁剪边界。
- 原始输入 ink mask 在调用前后完全相等。源 page.md/page.json/audit、原 PNG、原 layout.json 和首次失败目录的逐文件哈希在回查前后不变。
- 原 audit/layout 仍保留其历史23/24 FAIL，没有为了交接而改成PASS。官方 finalize 尚未运行。

旧PASS页只读影响核查：

- 从 approved-through-120 隔离根的已PASS审计机械派生候选，严格排除108；不读正文、答案、选择题或图的语义，不重新 finalize/vectorize。
- 现存98份旧页 raster 各只做一次 baseline 分支发现：首次启动已经检查页5，续跑另外97页。遮图使用既有精确审计框，版心宽遵循 p2c production 调用。
- **98份均未命中被修改的3→2降计条件**，因此没有需要重复运行的受影响旧页前后比较；该分支外代码未改。此结论只涵盖这些现存 raster，不扩大成全书重新审查或审批。
- 0012–0022旧 raster 已不存在，11页明确未验证。未重新渲染PDF、下载或安装来补齐，也未声称这些缺失输入通过。

## 失败与修复历史保留

- 原页首 FAIL `.tmp/ld-s10y-lesson/6p/pages/0122/failure-01-two-column-line-count/` 完整原样保留；未删、改或重新生成。
- production pre-patch 文件保存为自有 scratch `layout-before.py`；本轮只有一次 production 最小代码补丁，没有阈值试凑或后续代码重修。
- 新用例对 pre-patch 的两个实际 FAIL 输出：`focused-first-fail-before-patch.txt`。
- 验证器首次因缺失0012 raster而退出1；当时0122的24/24与输入不变断言已过，页5无受影响分支。首脚本和启动失败记录均保留；续跑不重复页5或 baseline用例，不将缺失 raster 伪装成PASS。0122只为持久保存实际成功band重新计了一次，不是第二次production修复。
- 108始终排除，没有读取、修复或改变其失败历史。其他代理已有改动未撤销。

## 冻结哈希与交接

| 文件 | SHA-256 |
| --- | --- |
| production layout.py 修复前 | `1db896d4e81f41bf4557fc0a36a4c543a1cfdbc630124ba1fd8b450eaf412c2c` |
| production layout.py 修复后 | `9723a80790ee216716e4a6097c77a57cc9bf4deab78da0250f851ad6bb7d9435` |
| 新 focused test | `679c60a86f2aa6b2be180e3ec40e3142a6c528fe22a5e892cc04b67725eb69a5` |
| 原0122 page.png | `613ca4951781a6f383fe0747ee617215eecf216fae937a776b6885d916460c87` |
| diagnosis-before.json | `97a28f777a1c5f3cc1f3e693a2a7b78c19d17d0b89729430d8a39364d019f23f` |
| count-verification.json | `452451707537f986a77e746ab61998951f772c2be679755ffc34b38d763944d2` |
| focused-first-fail-before-patch.txt | `fbd058410fcb75402411aded2fec5dc1a3a9744f010277b0a1e00bd8c1367d5d` |

自有证据目录：
`.intentfold/tickets/STEMROBIN-180/tmp/source122-counter-repair/`。
包含诊断 trace、代码前态、实际0122 band、逐文件保护哈希、focused执行记录、首失败和旧页分支发现范围。

全部使用用户提供的现有共享 venv，带 `-B`；未安装依赖、开浏览器、接服务/DB、使用Git、改app/索引/页源/图。没有执行 finalize、vectorize、assemble、publish或全项目检查。

交给主代理官方 finalize122，并由 Sagan 按此独立证据做受影响源审；本代理到此停止，不自签源内容PASS。
