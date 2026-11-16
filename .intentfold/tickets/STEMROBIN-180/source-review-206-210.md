# STEMROBIN-180 Source206-210 First Independent Review

结论：**206 PASS；207 REVISE；208 PASS；209 PASS；210 PASS。整批未批准。**

作者 Bacon；本报告由未创作这五页的独立 agent 完成。这是一次完整源像素/转写审查，
不是现代图批准、题目求解或作者机械PASS转签。所有作者冻结字节保持不变。

## First Failure

唯一必要缺陷 `S207-EMPHASIS-1`：`p0207#9` 第一行原印
“气体被压缩得越厉害”及“它具有的势能就越大”均有字下圆点。
当前 MD/JSON 只有后半句加粗，前半句的原着重遗漏。
`meta.notes[1]` 也只描述后半句，须与实际原着重范围同步。
这是源强调转写缺陷，不是要改原物理观点、补答案或调整行数。
原24行仍是24行；该页其余所有文字、对象、题、数字、闭合及页脚通过。

首次拒绝已先行落盘并保持：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-206-210/first-failure.md`。
局部原像素证据：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-206-210/p0207-emphasis.png`，
从原PNG矩形 `[200,1615,1190,138]` 直接裁出，无改字、重排或重渲染。
修复单位仅该着重范围及相应说明/配对生成产物；本代理没有修复。
作者原 firstFAIL/repair 均为空、每页预算0/1，原记录不被本拒绝覆盖。

## Frozen Inputs

作者根目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-206-210`。

作者 `author-handoff.json` SHA256：
`71c4c80e39eee707564e018a94d16dde42bbd9a15d64d3b222fe4c36a61694c8`。
作者 `source-manifest.json` SHA256：
`05fc8912264d5349c355a5ef48c918f274d2be6feee85a4daeb3c432127e8f7d`。
PDF身份 SHA256：
`46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`。
五张原PNG均1472x2161、300dpi，来源/页号/profile与正式prepare事实一致。

| PDF / 印刷页 | 块 | 亲见源行 / MD / audit | 完整题对象 | 图 | 结论 |
| --- | ---: | --- | ---: | --- | --- |
| 206 / 195 | 16 | 19 / 19 / 19 | 4 | 199,200 | PASS |
| 207 / 196 | 12 | 24 / 24 / 24 | 1 | 无 | REVISE，仅上述着重 |
| 208 / 197 | 14 | 25 / 25 / 25 | 6 | 无 | PASS |
| 209 / 198 | 15 | 24 / 24 / 24 | 5 | 201 | PASS |
| 210 / 199 | 10 | 25 / 25 / 25 | 0 | 202 | PASS |

合计67块、117独立印刷行、16完整题对象、4图。逐页完整原PNG先于其网格观察，
所有MD/JSON块、layout行带、audit、prepare模板和全部15调用记录已读。
独立逐块行数分解保存在 `evidence.json`，真实共享图题行只计一次。
五页页脚实际两侧圆点及195/196/197/198/199均忠实保留。

## Complete Content Findings

- 206：仅授权的205最后文字块“……例如，从斜面上”接206
  “滚下来的钢球A……”；两图/图题对 `p open/cont` 透明。
  完整能量定义、重物/弹簧/钢球例子、焦耳单位、做功能力与能量关系及
  原“功等于能量变化”着重范围均保留，问题1-4独立、末题closed。
- 207：§78完整定义、地面零值、引力/相对位置、落地做功量度、
  水坝/水轮机、打桩机、弹簧门、撞针/手表/玩具、压缩气体/风镐
  全部保留。“一切发生了弹性形变的物体都具有势能”着重完整。
  问题1完整closed，不以栏目延续伪造题open。仅上述气体前半句着重失败。
- 208：§78问题2-5并非问题1续句；练习39另起栏目、题1-2独立。
  全部100千克、10米、500千克、10米、4米及两道数值题的全部问句保留，
  未自行求解或给定g。§79定义、流水/风、图200斜槽/水平槽、
  A球不同释放高度/B圆柱位移、不同质量球比较、质量/速度结论完整closed。
- 209：§79两末段的零值语境、飞机两种能量、电能/化学能后续范围及
  五题完整。§80势能/动能转化、水坝例子和圆轮卷绳升高/下降/再升过程
  完整；图201打断的单段正确 `p open -> fig/cap -> p cont open`。
  页尾仅到“几乎和原来相同”，未猜补210或211。
- 210：从“的高度①.”准确续209；两圆号对应正文与页底脚注，
  圆轮向下/向上能量转化、橡皮球/地板与钢球/钢板、举高放手、
  下落加速、球/板压缩、弹力恢复、向上减速、近原高度及完整粗体结论
  全部保留原表述。碰撞段的 `p open -> fig/cap -> p cont` 完整。
  原脚注为规则线下两行说明，独立p保留，规则线不伪造文字行，foot仅页码。
  正文结论和脚注closed不等于对未知211内容或整节完成的证明。

## Figures And Native Vectors

原页、完整source crop及现成nativeSVG完整并排图均亲见，未运行新的vectorize或SVG预览。
下列框为收口墨迹框；PNG/SVG包含工具原生12px边距，尺寸大24px是事实，不是裁框漂移。

| 图 | 收口框 x,y,w,h | PNG及SVG尺寸 | 归属/完整像素 | 既有vector mismatch |
| --- | --- | --- | --- | --- |
| 199 | 378,270,149,267 | 173x291 | §77正文；重物/竖弹簧/上下横件/原侧线残断均保真 | 0.000% |
| 200 | 876,319,316,210 | 340x234 | §77正文；完整斜槽/水平底边/A球/B圆柱/运动箭头 | 0.000% |
| 201 | 1002,1447,278,321 | 302x345 | §80正文；完整框架/底座/两吊点/两绳/横轴/圆轮 | 0.018% |
| 202 | 1005,640,256,408 | 280x432 | §80正文；四球位/h双端箭头/完整钢板 | 0.000% |

四图图内标签/两端/底边无遗漏，未现代重画或修复原墨迹。
199/200两个独立cap确实同排，仅第二cap `samerow`。
201的cap与“它就会边转动边下降……”同排；202的cap与
“了的钢板和球的势能. 然后，在弹力”同排，均不烙入图框。
四图均为正文所有，不错误挂给题。206对199裁图批准不包含205全页批准。
207/208无新图；208图200引用未伪造重复图对象。

## Math And Mechanical Evidence

本批无独立计算公式；A/B行内符号及图202的h均保留，两个正文/脚注圈号
用既有 `\textcircled{1}` 表示。210 audit实际有两条
`mathVsTextAccents` 警告（p#1、p#9），**不是无警告**；errors为空，
官方finalize退出0。圈号内容完整，现有非致命警告未造成源信息遗漏，
不偷偷换公式、删脚注或补科学勘误。五页unknown_chars/errors/errata均为空。

复用prepare5/finalize5/vectorize5，15次exit0，未重跑。
206 prepare的23行包含未挖图行带；正式挖图后19行才是页级对账，
不将其描述为失败/修复。四次已有nativeSVG观察exit0亦非新的官方门禁。
所有调用argv、时间、流、历史输入与工具前后SHA已绑定。
五份保留的finalize-input MD与current MD的完整diff仅为正式frontmatter
事实补充及四个粗框吸附；正文/字重/换行/notes未被工具改写。
因此历史input SHA不应强求等于current output SHA；`diff`退出1仅表示这些已解释差异。

独立绑定脚本只读作者文件/官方证据，写本review root；不是prepare/finalize/validator。
124个冻结文件绑定匹配，15次调用的当次before/after工具字节一致，
当前13项工具也恰与作者freeze一致。记录历史工具epochs而非声称未来必相同；
未因哈希一致要求重跑任何门禁。

## Approved Union And Stop

`approved-union.json`仅批准206、208、209、210当前精确字节，明确排除207，
不批准整批、装订/发布或任何未闭合课程。其余207内容的上述PASS可供授权后affected-only复核复用。

证据路径：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-206-210/evidence.json`
SHA256 `58e9ae680609a2b47d20ffbdedf1f0df029fee636ea33e84ad27b4e5e422d52a`。

批准集合路径：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-206-210/approved-union.json`
SHA256 `cba8795dfda7fffe97337e41122a377dbf39611013c8bedcb4f7d16615edc1a8`。

205仅最后授权文字块与绑定hash使用；未观察205全页，未读211+、现代文本、
答案/choices/私有源解。无候选修复、推广、assembly、Git、DB、app、浏览器、
服务/网络/安装/工具或环境改动。180/181既有作者冻结未动。本轮停在首次独审交接。
