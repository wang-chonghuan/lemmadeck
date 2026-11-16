# STEMROBIN-180: t16 Modern TEXT Author

2026-11-16。C 仅作者；单元 `phy7-c1-s1-t16`。
状态 `authorfrozen_pending_FIRST_textreview`；不是独立审查通过、自批准、现代图批准或完整 finalize。

## Scope and Source

仅写 `.tmp/ld-s10y-lesson/text-author-7p-t16/` 和本报告，保留其他会话全部改动。
workspace `/Users/yong/.codex/worktrees/0f12/lemmadeck`；
branch `codex/STEMROBIN-180-textbooks`。入口 Charter、当前 lesson modern flow、
edition text contract、实际文本 helper 与 shared image-batch 规则已读。
n-plane helper verify 和 live ticket GET 均 HTTP200，仅只读；未执行 IntentFold 能力或 backend mutation。

Main 已批准并保留 canonical 251-253 SOURCE；复用原一次 exit0 adapt-prepare，
不再次 prepare、提取、装订、原图审查或收口。
准确目录为 `.tmp/ld-s10y-lesson/text-author-7p-t16/adapt/adapt/7p/modern-us-neutral/lessons/phy7-c1-s1-t16/`，
保留 double-adapt，不重定位工具输出。
56 项完整输入、原始路径/bytes/SHA 和完整字节副本保存在 `source-input-manifest.json`：
原 lesson JSON/MD、零题 exercises、251-253 page JSON/MD/audit、227/228 PNG/SVG、
共同 PDF、TOC/source manifest、SOURCE review、Main prepare/retain/reference correction/NASA 调用，
first prepared templates 和入口/当前工具。Main prepare 历史 tool SHA 未记录，明确未知，不倒填。

原18块全部保留：14段正文、2图块、2图题；现代 prose-flow 产生23正文短段。
题数0，选择题0；`source.data`、`source_text`、`source_refs`、页/课程身份及图引用保留。
exercise/figure templates 字节不变；figure spec 路径仅 prepare 占位，不是生成或批准。
全部 `$...$` 公式逐字不变，`errata=[]`，`numeric_changes=[]`。

## Modern Text

显式现代单位纠正位于 `lesson.prose[1] / p0251#7`：
原文“每秒钟……大约2卡”留在 faithful SOURCE 和快照中；现代正文采用
平均日地距离、大气层外、垂直入射、每平方厘米**每分钟约2卡**，
并明确说明原文时间单位与现代测量换算不符。
依据 Main 已获取的 NASA 官方渲染页 Status200：1361 W/m2；
`1361 * 60 / 10000 / 4.184 = 1.9517208413001912 cal/min/cm2`，可近似为2。
这是公式外时间单位校正，`changes` 声明 `unit-correction`；
不是伪造 source erratum，不改变原近似数字2，不添加新数学表达式或练习数据。
完整来源、SHA、条件和换算见 `science-notes.json`；现有 edition.validate_text 契约允许此路径。

原15摄氏度公式只作原书平均温度概括，不当作当前固定值或太阳单因素预测；
原1%公式只作有面积、日照、可利用能量和需求假设的城市例子；
“三千万个大型发电站”只保留为未定义站功率的历史比较，不作今天精确换算。
保留太阳加热、水循环/凝结/降水/河流、风与地貌、
植物/光合作用/化学能、煤/泥炭/食物能量和核能对比的直接教学。
原植物装置只作示意，不保证任意叶片立即冒泡、不以气泡代替氧气鉴定；
原图228不冒称完整光合作用途径。保留§94原引用，并区分断键、成键和整体能量转化。
原核能“不久之前”、泥炭“广泛使用”和极地“一概不融化”等表述均有必要限定，
不添加需要完成的新操作、题目、答案或选择题。

## Commands and FIRST Preservation

layout normalization 一次；实际 `prose_flow.mjs --stdin` 一次；
4个 section_breaks 复制实际相邻最终段落对象，解析位置7/10/18/21，不手数块。
一次实际 TEXT mechanics 复用当前 source/errata/identity/text/numeric/cultural/figure-reference helpers，
一次 KaTeX：75项检查、0 errors、4个 source/modern formula 检查结果均 clean。
全部 argv/cwd/stdin SHA/stdout/stderr/exit 和前后 tool epochs 冻结在 `commands/`。
未执行 full figure gate、adapt-finalize、render、service、browser、DB、publish 或 Git/backend 写入。

保留辅助输入冻结首次 ENOENT：本 worktree 无 `.venv`，使用 Main 已成功命令中的既有 Python；
无安装、无稳定工具改动，未重复成功门禁。
**FIRST TEXT mechanics preflight exit1**：其他会话更新 `htmlfrag.js`，旧SHA
`c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6`，
新SHA `1ef2f96de83a3b2690e6660a6585c6a0d8895b6283ec7b4eaac09aa10612fc92`。
首次错误、当时三模板/脚本/flow及两版工具均保存在 `FIRST-fail/text-mechanics-preflight/`。
改动仅强调渲染和 fig/cap 配对；本次 flow 使用的
proseParagraphs/proseOutline/sectionBreakIndices 完整代码段字节一致，
段SHA `aa3984d88077fed91766b005dba295914fc130a15bc0ec765e601d9d703efa18`。
只调整作者 scratch 的明确 tool-epoch 绑定，旧输入快照不改，正文不改，flow 不重跑。
此调整保守计入唯一修复额度：**1/1已用，0剩余**，不与 SOURCE/figure 预算合并或重置。
preflight 后才实际开始唯一 TEXT mechanics/KaTeX；没有第二次成功检查或语义自审。

## Freeze and Handoff

完整上下文 `author-context.json`，输入清单 `source-input-manifest.json`，
`prose-flow-input.json` / `prose-flow.json`、`text-mechanics.json`、
science notes、两次原PNG观察、FIRST与修复绑定、完整命令和工具字节全部由
`author-manifest.json` / `author-handoff.json` 绑定。上述文件均位于作者根。
原PNG仅各打开1次：batch2/8、context2/24，无新crop/reopen或现代图。
图227/228仍待另行委托，FIRST独立文本审查待办；不得直接提升、finalize或发布。

| Template | Bytes | SHA256 |
| --- | ---: | --- |
| lesson.template.json | 25464 | `c9423737dc5e87bb32d78b2a9ea2395ae502be446b28588512a95a6e1df15765` |
| exercises.template.json | 419 | `c813dcaa6ff4806a4a560f4958495422d3afec50dda2142ba2a2cfb94845bd80` |
| figures.template.json | 1137 | `6e3a75f97e44c5ca7dd13a58ffede737154e9fff40dda1e367ff7ac91b6339e3` |

source/edition/index/app/deps/stable-tools/DB/publish/Git/backend writes 全部0。
所有作者命令已退出，无 in-flight exec、browser、service 或后台作业。
