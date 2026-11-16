# 10c physical35–38 独立 Stage B 源审

日期：2026-11-16。工单：STEMROBIN-184。实际审者：Worker B / Codex，父方既有工单委托下的唯一独立源审者，非 Peirce 作者。本报告不是新直接人类逐题授权或作者自批。

## 结论与受影响项

**本包不能作 whole-gate PASS：38 保持 mechanical FAIL；35 保持初读字形 UNKNOWN。** 未发现可确认的正文漏行、公式增删、对象错归或裁图缺损；不把“未发现”扩大成对所有细小字形的无条件确认。

| physical / printed | Stage A 独立表外排 | table 内另列排 | 当前 MD / 首次机器 | 本次 disposition |
| --- | --- | --- | --- | --- |
| 35 / 29 | 16 | 无 | 16 / 16，作者首次 exit0 | 已辨正文/对象/裁图及计行一致，limited PASS；69首行标点与细箭头连接 UNKNOWN 保留 |
| 36 / 30 | 13 | 8 | 13 / 13，作者首次 exit0 | 本页源忠实度、对象/表格裁图、跨页边界 PASS |
| 37 / 31 | 19 | 无 | 19 / 19，作者首次 exit0 | 本页源忠实度、六组真实断行、引用与跨页边界 PASS |
| 38 / 32 | 14 | 4 | 14 / 16，作者首次 exit1 | 正文/公式/表格裁图与冻结事实一致；机械计行 FAIL，不放行 |

1. **38 机械计行差额 +2，非已确认转录漏两排。** 冻结的表外横排为上方6排、表后说明5排、两条大分式各1排、folio1排，共14。当前 `p0038#4` / `p0038#5` 完整保留两式，各一个 Markdown 物理行、无 `↵`；没有因照抄完整公式而缺少源断行。首 audit 却为 `lines_printed=16, lines_md=14`，保留原错误：“行数对不上：印刷 16 行，块体 14 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）”。
2. **38 的低层原因仍 UNKNOWN。** 源冻结中第一条分式约 y1769–1950、中心约1875，第二条约 y1998–2213、中心约2122；内部 `π/2` 的分子/分母与外层商式属于各自同一印刷公式排。这是可能的误拆区域，不等于已证明“每式恰好多算1排”。未读取/执行计行实现、重算 bands 或做工具诊断，不能排除页边细线等机械影响。实际表裁图完整且其4排不是14排正文口径中的漏写对象；不能凭差额指控表框。保持全部14排与首失败，后续只有另行授权的精确机械定位/修复才能解除 FAIL；本报告不提出阈值、mask 或代码。
3. **35 `p0035#1` / 69首行 `$A$` 后小标点仍 UNKNOWN（逗号还是顿号）。** 初读偏向顿号，当前稿写 `、`；它与初读偏向一致，但没有新的局部源字形证据使它成为确定读法。不能从语法或作者选择反证像素。当前 notes / audit `unknown_chars: []` 不覆盖本审者已冻结的 UNKNOWN，也不作为消疑依据。
4. **图21细角弧/个别辅助箭头端连接仍 UNKNOWN。** 完整裁图足以确认相关源墨迹没有被截去，不能由此升级为精确的数学弧段起终或每条边的箭头方向判定。本次裁图 PASS 是完整性/忠实保留判断，不是重建图形关系或现代 FigureSpec 批准。

没有授权 source repair、counter repair、finalize 或后续 assembly。尤其不能给38加两个虚构 `↵`、重复文字或删公式来凑16。

## 实际顺序与冻结复用

Stage A 为原35→36→37→38逐张完整 native PNG 一次、每页先落盘再开下一页，四页源/数学/行数/图 inventory 全部先于稿件与作者信息。原冻结不改：

- `T/source-review-10c-p35-p38-source-first.md`，raw SHA256 `b62dc6950a9ddad4b7768eb94c502ddce67153af904ad0ab54cb911291076c2c`。
- 此次先复用该冻结，读 current cap1/profile 与四页 current MD/JSON，对完整文字/公式、对象及 open/cont 比较；随后逐张实际打开三张完整 generated PNG，才读四 audit，作者 handoff 最后披露。
- evidence manifest 的摘要在本阶段内容比较前已披露；它不改变 Stage A 已冻结的16/13/19/14独立计数，不冒称 Stage B 对作者计数仍盲。
- 此次没有重开任何完整原PNG/grid，没有生成字形crop，没有重新辨35的标点。原冻结中的初读简写、细部不确定性和观察顺序原样保留；本次是对冻结源事实的唯一 substantive 比对，不是假称第二次 original-first 扫描。
- 图21、表36、表38分别用 `view_image(detail=original)` 单张实际打开。表38作者在首次 FAIL 后未开其生成crop，本审者已独立看完该实际crop；不借作者的“未看”缺口作默认 PASS。

`T` 为 `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/`。

## 全对象/文字公式比对

### 35

10个 JSON blocks 与 MD 声明/文本对应：习题标题、完整69五排、完整70及提示四排、总图21、两个caption、§17、83、末段 `p open`、folio。69保留反时针、单位时间通过 `ω` 弧度、起始向量/`Ox` 正向/`φ`、投影谐振动以及确定三个常数的全任务；70不是只留结论，保留同频率的和及完整两排提示。`OP`/起始0、`OP_1(t)`/`OP_2(t)`/`OP(t)` 的标签成分均在稿中；初读向量记法为 inventory 简写，不由箭头宏包络差别凭空报数学改动。

“提示”原波线已在 notes 记录，不另算正文排；“同样速度”未推改为“同样角速度”。69/70无星标，源 Cyrillic а/б 引图及caption保留。第二caption `samerow=true` 与两个源caption约 y1748 共排一致，不漏caption或制造第17排。图内文字不混入正文。

§17“ 三角函数的研究”及83“诱导公式”位置正确。`sin/cos` 周期 `2π`、`x=2πn+u`、`0≤u<2π`、`n∈Z` 全留；末逗号和 `p open` 承接36，不作闭合。folio两侧点保留为 `· 29 ·`。句尾用 ASCII `.` 属当前 soviet-cn profile 的源层表达，不当成源句号遗漏。首行 A 后标点限制见上。

### 36

7个 blocks 与 MD 对应。首 `p cont` 四排承接35末公式，包含任意x、先归结 `0≤u<2π`、再归结闭区间 `[0,π/2]` 的α，以及“前3行”介绍，闭合于表前冒号。高分式区间未虚拆。

表为正文 `fig 表`，不是没有 owner-ex 的练习表；本页无练习，无编号table/caption未凭空添加。表后三排奇偶性说明保留 `1—3`、代入 `-α`、得到 `5—7`。三排角度说明保留 `0°`/`90°` 两度符号与三角函数表；名称段“诱导公式”完整。末 `p open` 确止于“很”，未补“容易”或句尾，37首 `p cont` 正确续接。folio两侧点 `· 30 ·` 完整。

### 37

11个 blocks 对应 MD。首“容易推出：”与36末“很”续接。六条推导每条一个 `↵`，实际各两印刷排，总12公式排；没有以分数层再加行，也没有压成六个印刷排。

逐组比较冻结式链：第一组 `sin(π/2+α)` 加法展开、`1·cosα+0·sinα=cosα`；第二组 `cos(π/2+α)` 差式展开、`0·cosα−1·sinα=−sinα`；后四组 `sin(π+α)`、`cos(π+α)`、`sin(3π/2+α)`、`cos(3π/2+α)` 的外方括号/内圆括号、转换中的正负号与最后 `−(−sinα)=sinα` 全部保留。0/1系数、实际乘点、中间函数和逗号/句尾点均未按化简结果删掉。

两排“八年级几何教材第102小节”出处注完整闭合；不是脚注或新标题。其余正文及“然而……”的顺序一致。末公式在本页闭合、不作公式 open；folio `· 31 ·`。本页没有图表/caption或新题号，不借单段闭合宣称83已结束。

### 38

7个 blocks 对应 MD。开头六排保留 `tg/ctg`、周期π、`x=πn+u`、`0≤u<π`、`n∈Z`，并保留源印“自变量α”与闭区间 `[0,π/2]`；未根据前文u改变量，未加入源未写的定义域排除列表。表题括注与末“第1行就够了”完整。

表后奇函数三排、由sin/cos导出说明两排与冻结相符。`p0038#4` 第一商式为 `sin(π/2+α)/cos(π/2+α)=cosα/(−sinα)=−ctgα`，负号在中间分母；`p0038#5` 为 `cos(π/2+α)/sin(π/2+α)=(−sinα)/cosα=−tgα`，负号在中间分子。嵌套分式、括号、两式中间步骤全留，第一末逗号/第二末点正确；不是两/三行方程组。folio `· 32 ·`完整。保持两条单排及机械 FAIL。

## 三张实际裁图：完整视觉比对

所有路径下的实际PNG均在本阶段逐张打开，不以文件名/hash代替视觉检查。bbox与MD/JSON/audit一致；PNG画布实测各维比bbox大24像素，此处只记录尺寸，不宣称重新验证padding实现。

| 原对象 | 当前prepared路径（相对workspace） | bbox `[x,y,w,h]` | PNG实际尺寸 | 本次视觉判断 |
| --- | --- | --- | --- | --- |
| 图21，а/б两面板 | `.tmp/ld-s10y-lesson/10c/pages/0035/figures/fig-21.png` | `[341,1150,1051,548]` | 1075×572 | 完整性 limited PASS；精细箭头连接 UNKNOWN保留 |
| 无编号sin/cos正文表 | `.tmp/ld-s10y-lesson/10c/pages/0036/figures/tbl-p0036-01.png` | `[234,658,1122,940]` | 1146×964 | 源表全部列/公式/实际分隔/外框 PASS |
| 无编号tg/ctg正文表 | `.tmp/ld-s10y-lesson/10c/pages/0038/figures/tbl-p0038-01.png` | `[231,775,1117,556]` | 1141×580 | 源表全部列/公式/实际分隔/外框 PASS；不解除页计行FAIL |

图21实际crop：左完整圆、伸出圆的x/y轴和两正向箭头、O、顶部A、左上P₀及右下P(t)、径向箭头、两竖直断线投影及x₀/x(t)、φ与角/转动弧墨迹均在；右三完整同心圆、x/y/O、P₁(t)/P₂(t)/P(t)、三个径向箭头与向量相加辅助斜边均在。底部圆/轴末端、两上方y箭头、外缘x箭头未被截去。源所在象限/标签未被替换；未见caption/邻文混入，少量孤立污点不命名为数学点。左角弧和右个别箭头连接不据题意补释。

表36实际crop：四列、左header空白、u/sin u/cos u完整，序号1–7与全部21个数据公式对应冻结：

| 行 | u | sin u | cos u |
| --- | --- | --- | --- |
| 1 | π/2+α | cosα | −sinα |
| 2 | π+α | −sinα | −cosα |
| 3 | 3π/2+α | −cosα | sinα |
| 4 | −α | −sinα | cosα |
| 5 | π/2−α | cosα | sinα |
| 6 | π−α | sinα | −cosα |
| 7 | 3π/2−α | −cosα | −sinα |

外框与全部竖列分隔保留；横线位于header后、3/4之间、4/5之间及外框，1/2/3和5/6/7内部没有凭空补逐排格线。磨损/断续仍是源像素样式，不“修美”表。无邻文、folio或caption污染。

表38实际crop：同样四列，空白左header、u/tg u/ctg u；三数据排为 `π/2+α | −ctgα | −tgα`、`−α | −tgα | −ctgα`、`π/2−α | ctgα | tgα`。分式/负号/序号完整，每排实际横线及外框/竖线都保留，包括源的局部断续；不拿36的格线模式替换。无正文/folio混入。这是本审者对失败结果实际生成crop的确认，不是新render或作者自行审批。

## 审计、边界与不扩大批准

四份 audit 现有值与manifest页摘要一致：normalizations、unknown_chars、katex_warnings及count_exclusions均为空，errata=0；35/36/37 errors空，38仅上述行数失败。本审者只读现有结果，不声称执行了其中finalize、计行、KaTeX或任何focused tests。audit空unknown不取消本审者UNKNOWN。

69/70及提示在35完整；图21总对象与两个同排caption正确。35开始§17/83；36承接35，37承接36，两张无编号表均为83正文。38虽末式句点闭合，没有观察后一单元或83剩余边界，**不批准83或§17完整，不授权装订/现代化/发布**。未读39或重看34；无新题号/星标/补充习题范围可批准。

已读作者handoff的源顺序/计数/裁图自述只是作者记录，不替代独立冻结及本次实际看图；作者结尾旧角色名不改变这里记录的实际 Codex 审者身份。

## 当前 raw SHA256 绑定

只对原始文件字节计算SHA，不运行内容或计数pipeline。manifest全部98条文件实际长度与raw SHA均匹配，mismatches为空；其中 current MD/JSON/audit/crop 与各 `after-finalize` 副本字节一致，原PNG与 `before-finalize` 副本字节一致。未覆盖任何首失败或作者记录。

身份文件：

- Stage A冻结：`b62dc6950a9ddad4b7768eb94c502ddce67153af904ad0ab54cb911291076c2c`。
- `T/source-10c-p35-p38-author.md`：`74631153d13efeee3daa1223f1985c24ca985bfe754fde299a951a5f04c18675`。
- `T/source-10c-p35-p38-evidence/hashes.json`：`0cfe3e930f67a92a95a52781bce26cade51d65da203bbc31e5033ca70a67774a`。
- 实读 `.claude/skills/ld-s10y-lesson/profiles/soviet-cn.json`：`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`，与四页绑定相同。

current durable triples 位于 `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/<id>/`：

| id | page.md | page.json | audit.json |
| --- | --- | --- | --- |
| 0035 | `f64ae5a54db07b4247d706b5516e49fce5cf54e31bcd22f12e744ac744db8016` | `c45d3f94ddb84b503e6babe5ce04c90271899264a22daad12e190dc0c369a5bd` | `642cf49e7afeff016567660bbe64cbf04d3bec799e60fdd2b4d1592f9f9e2035` |
| 0036 | `0dec3c1f054f58461bd7d28a3d8f085208466ca02eecc2d848ea85a7fa637d59` | `d56f1522dace9e542eecaa89e727dcfc7494b86b533aca219af169119a6f2ab5` | `83c66b0b5ae74cb858c9c5d57e58ab77e38a45d2a81ff0ad46ed36bc601c4d94` |
| 0037 | `9c09a6dcce033a2f6c8c0563fd3f47c233540ec286bc55689e217b1f062d92d6` | `78bab0ba3f43531c88c6a594496b488a5e7c102a40e64397050753cbb3a4fda6` | `4c947c6d8519af46faf3c5bf274405c44227a7a892486e576de112db1a63263e` |
| 0038 | `42c1e2bef45a048e65436f60789ee3f6deb3c420741cebbd00fa4932acd0ce69` | `1b8ddae67b63ec0335fb919fdb5d3f2ba20587a44df5e9cda592dd818a0a8f62` | `38b507026dbdaa7ae478b150a1c848b04da3001c7846572b65f65127bc85efd0` |

prepared原PNG及既有layout只作字节绑定，layout内容没有用于本次计行判定：

| id | page.png | layout.json |
| --- | --- | --- |
| 0035 | `c525f938f126f8acc3bea2b4b676cea7c74ac953a901d9f89dc8ec6ba3263f7c` | `641ba6061af814b4ce5cf83466556af48c5eafb136963894d9f277a4369cab1b` |
| 0036 | `b9240fdea2d995f590ae6b73f39292f61c4258be2aefeedc96417f204313fc30` | `69c89f7facec835a54748c69d8b0a9b0fcd15aacad8056596efa046e22f459bc` |
| 0037 | `1b4d0456fa48d27e1888367920905e7db29bea283e0ecca336318b7d4f3fa1e7` | `fbf425da9a68ca05ad3aabf087064fbcacbdc334febd80e870069b77c2bf09f8` |
| 0038 | `240b9f30df2c58441a0811d79caa6028f646cf571bebaddd0061a46ccc90b199` | `2e60fadccd7a5e191776748c4e3006cb85b8b9fac9a8df3b6a3ca405ade73431` |

实际看过的current裁图：

- 图21：`8a5269194ff7e9f89c3ebd71dbac69a07479ecace4218e778d1e4a07cba48f84`。
- 表36：`ab6f1b14ae9b98c981eb337d5c0b55bd692b1661fa45716c9c8132ff42f978a4`。
- 表38：`5efbd8da9ee3dcbaa1f50bd9b40315d4647f8c0a3705f15185b959a1cd301ba9`。

## 不可变交接与停止

本阶段只新写此报告；Stage A和所有98项作者/源/首结果证据未改。没有 source/tool/layout edits、prepare/finalize/render、counter calls、测试、排除框、数学改写、assembly/index/modern/答案/choice读取、Git、DB、网络/服务、浏览器或其他聊天操作。没有运行中进程。

本次唯一 substantive Stage B 完成，保持35 UNKNOWN与38 mechanical FAIL，停止等待后续明确授权；不自动修复、不重新做完整源审、不自行批准整包。
