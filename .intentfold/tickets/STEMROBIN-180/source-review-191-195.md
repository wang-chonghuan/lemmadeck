# SOURCE 191–195 独立全文审查

日期：2026-11-16。身份：`independent_agent`，不是本批源作者。
结论：**整批 FAIL，未签发整批 approved manifest。191、192、194 单页 PASS；193、195 各一处源标点 FAIL。**

## Findings

### F193-1：193 页 p0193#7 第二印刷行，句号误写逗号

- 当前 [page.md:60](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-191-195/artifacts/6p/pages/0193/page.md:60)：`力平衡甚至克服较大的力，而为此只需选择适当长度的力臂.`
- 原扫描：`力平衡甚至克服较大的力. 而为此只需选择适当长度的力臂.`
- 当前 JSON `blocks[6].lines[1]` 与错误 MD 完全一致。原图该位置为清楚的基线圆点，不是下伸逗号，也不是公式符号；源句界被合并。
- 实际原像素诊断证据：[p0193-force-punctuation.png](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-191-195/evidence/p0193-force-punctuation.png)，原页坐标 `xyxy=[165,975,1350,1042]`。
- 受影响单位仅此行的标点表示；其余本页原字、粗体、公式、24 印刷行、跨页续接与页脚已完成全文审查，无其他缺陷。不能由机械 exit0 覆盖此 FAIL。

### F195-1：195 页 p0195#1 第四印刷行，句号误写逗号

- 当前 [page.md:62](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-191-195/artifacts/6p/pages/0195/page.md:62)：`得整齐. 剪金属片用的剪刀（图183）的柄要比锋刃长得多，这`
- 原扫描：`得整齐. 剪金属片用的剪刀（图183）的柄要比锋刃长得多. 这`
- 当前 JSON `blocks[0].lines[3]` 同样错误。原扫描在“多”后是清楚的基线句号；“这”开始下一句，不能替成逗号。
- 实际原像素诊断证据：[p0195-shears-punctuation.png](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-191-195/evidence/p0195-shears-punctuation.png)，原页坐标 `xyxy=[175,430,1350,505]`。
- 受影响单位仅该标点；其余七行续段、图183/184、图题同排、全部三题、枚举字母、末尾闭合与22行已全文核验通过。

未修候选、未 rerun finalize/vectorize、未改稳定工具。作者当前记录 repair0；任何唯一最小修复需 main 另行授权作者执行，再对两处改变做 affected-only 审查。首轮 FAIL 不得覆盖。

## 冻结与实际覆盖

被审作者根：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-191-195`

| 冻结输入 | SHA256 |
| --- | --- |
| author-handoff.json | `89aabd89c03c7b7b1fe3f62875fe497752cd8459035d62d3f32588219e0f8a17` |
| source-manifest.json | `839ee28c4adf82ceb0b15c46638fe0d7d6a019ab5489b4ab0cca6bff2a70d550` |
| source-author-191-195.md | `b1ae6606c806fcdf5c47e2e9334eb036bdf822d7ca1dbe6653579bd7dd0eba54` |
| source-inventory.md | `72c931ca09ab5af7b0296af38c3b66172c8cbe7721c484952456af56d8d591db` |

handoff 的112项拥有文件绑定逐项核对 bytes/SHA，全部匹配。完整 MD 与 JSON 的 meta/全部块字段/每条印刷行逐项一致；唯一被移除用于比较的 JSON 附加字段是 fig 的派生 `id`，该 id 又与元数据、audit、PNG/SVG文件名独立对应。

本次依序实际打开五张完整无网格原页 PNG，各自对应网格也完整查看一次；不是依据计数或代码想象文字。每页全体块、逐字/标点/粗体或着重点、小问、公式、符号、单位、栏目、页脚、原文化内容、open/cont/samerow、图框均已审。五张 PNG 裁图各自实际查看一次，五张已有 native SVG raster 各自完整查看一次，并完整 XML 解析五份 SVG。未执行任何 renderer 或门禁。

| 物理页 / 印刷页 | 块 | 实际印刷行 / MD / 既有 finalize | 题块 | 图 | 单页结论 |
| --- | ---: | --- | ---: | --- | --- |
| 191 / 180 | 13 | 23 / 23 / 23 | 3 | 0 | PASS |
| 192 / 181 | 11 | 18 / 18 / 18 | 0 | 180、181 | PASS |
| 193 / 182 | 13 | 24 / 24 / 24 | 0 | 0 | FAIL：F193-1 |
| 194 / 183 | 17 | 23 / 23 / 23 | 7 | 182 | PASS |
| 195 / 184 | 13 | 22 / 22 / 22 | 3 | 183、184 | FAIL：F195-1 |
| 总计 | 67 | 110 / 110 / 110 | 13 | 5 | 不批准整批 |

13题块＝191三道问题＋194六道编号问题及一道完整作业＋195两道问题及练习37第1题。正文的杠杆算例没有被另编成题。以上印刷行来自实际全文观察与已有审核结果；脚本只核对声明行数一致，没有再次运行像素计行器。

## 各页全文结论

### 191：PASS

仅使用已批准 durable190的最后 open 块作边界文字输入，末尾“人造纤维丝的机器，甚至在现代的结构”与191首 `p cont`“复杂的自动化机械中…”正确连接；未看190像素或重审其余正文。

首句“在印刷机、计算机中”的顿号确为原印，不是缺陷；诊断小图保留在审查 evidence。简单机械例子、三问题、§71标题、整段粗体杠杆定义、原图176的西里尔 а/б 引用及力/支点字母均保留。末段 `open` 止于“作用在杠杆”，正确接192。`·180·`页脚两点真实。

### 192：PASS

11块全查。前四块为两幅完整原编号图和同一物理排的两图题，第二图题标 `samerow`；首正文 `cont` 接191“作用在杠杆上的两个力…”。力臂定义两行粗体正确。下一段“要找出力臂，须从支点向力的作用线做垂线”原是字下着重点，MD强调跨度及物理位置 note 区分于粗体，后续文字未误扩范围。

OA/OB、l1/l2与F1/F2、垂线距离、方向/作用点/大小、顺时针与逆时针叙述全保留。末段 `open`“2 牛顿的”正确接193。两图归杠杆正文，未伪归问题。页脚 `·181·`正确。

### 193：仅 F193-1 FAIL，其余全文 PASS

首行接192的“2 牛顿的”与随后4牛顿条件完整。平衡条件粗体、`F_1/F_2=l_2/l_1`、阿基米德史述及原文化内容、176а 的二倍力臂、400N/800N/80kg全部真实。

算例240kg、2.4m/0.6m及“若不考虑摩擦”限定粗体保留，公式比值/变形、P=gm、`9.8 牛顿/千克 × 240 千克 ≈ 2400 牛顿`按原近似写法记录，未偷偷“算正”为新源字。三条高公式分别算一物理行；“于是”与右方公式同排真实，非人为计数凑数。末“顿.”关闭；194“所以”为新段，不假设段落 cont。`·182·`页脚正确。

### 194：PASS

“所以”与600N公式实际同一行，正确声明 `samerow`。六问题完整；作业六印刷行包含尺、中点窄支承、5/1戈比与2/3戈比试验、测力臂/平衡及火柴盒重量。附注1/2/3/5戈比对应1/2/3/5g的源说明保留在所引用作业内，不误作页码 foot。

§72完整。剪刀说明第13块 `open`，图182及图题不切断连续正文；图題与“联结在一起的剪”位于同一物理排，caption区域及 `samerow`正确。第16块 `cont open`止于“阻力F2就”，接195。原“（图182），杠杆的”确为逗号，另存原像素诊断，不报假 defect。`·183·`页脚两点保留，数字的微小下伸墨迹不另造字符。

### 195：仅 F195-1 FAIL，其余全文 PASS

首 `cont`完整七行，承接阻力、纸剪刀、金属剪刀和钢丝钳说明，除“多. 这”的句界外全部逐字一致。两图题同排，184的caption `samerow`正确。

自行车踏板/手闸、汽车拖拉机制动踏板、打字机/钢琴键、台钳/钻床进给全部源例保留。两道问题及练习37第1题完整三行复合要求、西里尔 а…и 枚举与 д/е 两种挑重方式都在，没有缩题。原小字/粗体/斜体标号记录与notes吻合。195末“为什么？”为 closed；只有题面引用图185，没有读取185或196及以后页像素。页脚 `·184·`真实。

## 五图完整源与向量审查

裁图 interior逐像素等于原页所声明 box；外12px padding确为纯空白，不偷带邻图题。完整 SVG 均只有一个 svg 和一个非空 path，无 image/text/外链/脚本；fill为currentColor、evenodd，viewBox和已有 preview尺寸与完整原crop相等。轮廓、内部白隙、箭头和字母均是路径组成，不因无独立 text元素而漏审。

| 图 / 所在页 | 源框 xywh | 完整PNG/已有SVG preview尺寸 | 已有vector mismatch | 源语义审查 |
| --- | --- | --- | --- | --- |
| 180 / 192 | 224,249,492,502 | 516×526 | 0.014% | PASS：立柱/支点、水平穿孔杆11孔含中心、B侧4重物/A侧2重物、挂接、F2左/F1右完整 |
| 181 / 192 | 921,370,415,328 | 439×352 | 0.016% | PASS：B/O/A、l2左/l1右、杆刻线、三角支点、两向下箭头、左三/右一横记号；无捏造读数单位 |
| 182 / 194 | 984,1672,338,181 | 362×205 | 0.000% | PASS：交叉剪刀、指孔/转轴、材料遮挡、柄处F1与切点F2向下，所有内外轮廓完整 |
| 183 / 195 | 335,757,301,131 | 325×155 | 0.000% | PASS：金属剪刀短左刃/白隙、中段、右侧双弯曲开柄及内部白色标记完整 |
| 184 / 195 | 893,742,307,144 | 331×168 | 0.000% | PASS：左钳口、转轴、双长右柄、内外轮廓/间隙完整 |

| 图 | 原crop PNG SHA256 | 完整SVG SHA256 |
| --- | --- | --- |
| 180 | `2e4e439322dd71e17943a64aa28e3b0e15ed3e54d16e1833ed4a6a53514d333d` | `b57b8d2ad81edc8a92da7a4e2b69bb48edad1c7eea74a5a10e8a443d0278ae77` |
| 181 | `5ff76d068fe06f9c9ab0fcb13f84b4fcad63ce8a88a24dfcf45d858c079b838a` | `1206463a32d786244dedd7960584bea2943953f05d53ca4c13dd4867659ddca6` |
| 182 | `d3b36b8d44179216475330e5c26d06e8879df4f0361685e667b449d257038f15` | `88e6df195c87af50e73fd0fb68e2bfab4fa67b5608282c451dc99e1a388c59a7` |
| 183 | `6276ef5c0d1598304385e50d431a94e86c7298bab25ab6d1bca7aa7856c5f949` | `9affe9450dc411be9dee8f554278e0872fb99457ee1f80f2d4511929cd0470d3` |
| 184 | `b9944c7ab5a616400db42a800288bc5f53f731d4fdbc1e3a8d16f4972f741d66` | `312a8eadaa135bf781859d86c5f55b239f2edb77a708dcd119c86af3d37a2522` |

五crop字节分别6472/3433/3476/1876/2262；完整SVG及已有preview的字节/哈希/绝对路径全部另列 binding-audit与review-manifest。图审查不依赖任何答案或选择题，也未按正文算例向图添加数值。

## 当前逐页绑定

| 页 | page.md SHA256 | page.json SHA256 | audit.json SHA256 |
| --- | --- | --- | --- |
| 191 PASS | `543bf67115e407b5554f9911037d09a4e60581e770b20e5ae1c0b0d184117012` | `8a969970759884d3eed61b588ccf0536ef4ceeaebe6a40d1ff513decf1b3b612` | `5facbd809ddfaf867d674c1058d55e2e83d4c9474a79024ca6416b887a3bdc82` |
| 192 PASS | `90cf3e83de659db5a39440a6c1e66c695b83fe2a5ecf33582756397fd4958309` | `04799fa5e7230d053878421c6330551a9d3fd0460cec2d53086f65d416172f4c` | `7b0b18618de64d412b192fa29da2eab1b72a3550ea4250f79671dc6b7d4aa2b9` |
| 193 FAIL | `d6122dc7dd29996ea7053821a7e36e65cd8959bf5aca0534e985a90b71ac77da` | `af4228f2cf4156b3cd38162164c1d12dd2df7a6a8a77e994974c0f3e3f8e99e0` | `e96a7b8e493c24d100d240900c165767f0bf193744c8556126182373bd053680` |
| 194 PASS | `4a58b5101b09f680950fd52ca8edc3ce1b964293e254b45f3f2f2e721b967e8d` | `0e95ff011a1021d1042dcd3754e031ce6d7d44e31fe2f8edb3864c43f7c91e86` | `3dd6ca65af9f015274143198390aa95bbf0a900f3fdac8266358f48ffca84416` |
| 195 FAIL | `391bd253b25803c805fc29766b320b5d422b242509a50b591975f10ff117a30d` | `56e6f35517fda2961c7db41e99460ebfbd9d030f562807ec331393411d9a6d0c` | `aa13ef8dea05aa10b45d7ca472b530928b924cb556d1b993caddfebb58254f12` |

源PDF实际文件字节SHA核对为 `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`，各页metadata指向该共享6–7p PDF的物理191…195。五原PNG均1472×2161@300dpi，各自SHA与render一致。当前lesson-group profile实际SHA `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`匹配。

## 机械证据复用与诚实边界

已有prepare/finalize/vectorize各五次exit0，15份调用JSON与stdout/stderr完整读取；所有调用内 before/after工具字节一致。finalize和vectorize输出绑定均仍为当前候选字节，0规范化/0unknown/0KaTeX警告/0errors；这不消除两处逐字保真错误。

191 prepare处于较早工具epoch，p2c SHA `483ebed7d79146af36e547a3d8c88ac4fdca06944fb46c759f83e2cb14a6b06b`；其余14调用为 `acda64449af5a9c043a8502e7840f6391c95cf01a63458bbf005011b773fa8ac`。其他工具的历史before/after也完整保留在原调用，不虚称所有调用共用同一个全套工具快照。此已明示的跨调用epoch不是本次内容缺陷，本审查未改任何工具。

192 prepare初始未按最终图框遮罩报19行，195初始报24行；最终图框/图题归属及实际原行完整复核为18/22，已有finalize一致。没有重跑或删行凑数，未把prepare的未遮罩计数误报成已完成内容验证。

本次新增执行仅审查scratch里的读取/哈希/XML与MDJSON一致性脚本，以及已读原图的局部诊断裁剪。official prepare/finalize/vectorize/renderer/gates均0次；browser/network/modelservice/DB/Git/assemble/promotion均0。未创建新题、答案、现代图、源erratum或改作者freeze。195以后的原页未读。

## 拒绝冻结与交接

- 报告：[source-review-191-195.md](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-191-195.md)。
- 完整绑定审计：[binding-audit.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-191-195/binding-audit.json)，SHA `36b53bc5a4601b3ad94b6617f4e83efaba556b5401cd88288931846ebd5e5791`。
- 当前审查清单：[review-manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-191-195/review-manifest.json)：明确 `approved_manifest:false`、PASS191/192/194、FAIL193/195，全部当前文件绝对路径/bytes/SHA。不是整批批准或晋升授权。
- 首轮拒绝副本与清单：[first-failure-01/manifest.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-191-195/first-failure-01/manifest.json)。完整作者scratch、作者报告、首轮独审报告、局部原像素证据和绑定审计复制保存；原作者目录及其handoff均未动。

单次完整源审查已结束。后续若 main 分配作者唯一最小修复，只需对 F193-1/F195-1原像素、修复MD/JSON/audit与字节差异做受影响审查；绑定不变的其余67块/110行/13题/5图结论应复用，不重复全文或已通过门禁。本报告不批准193/195当前字节，不批准整批191–195。
