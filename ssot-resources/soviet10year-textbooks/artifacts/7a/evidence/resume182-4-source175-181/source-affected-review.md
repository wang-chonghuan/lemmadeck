# STEMROBIN-182 7a 175–181：affected 字符与编码修复复核

日期：2026-11-18。
**已确认 affected diff：七页 PASS。当前页级忠实度：5 PASS、2 BLOCKED（177、178）；全批未批准。**
PASS 的范围仅为继承 FIRST 源事实后的忠实转写与所列修复，不是完整 lesson、数学、现代版、APP 或 881 批准。

## 身份、来源与零新图

- 本次实际 reviewer：Codex，`CODEX_THREAD_ID=01a1ef7c-959e-7841-b0ba-87df8d0424ee`。
- 运行时 `CODEX_SESSION_ID=01a1ef5a-c416-7a50-b5c0-434ff31a449b`。
- 继承 FIRST reviewer：同一 thread，身份与 FIRST 报告一致；不是原作者 Banach / `01a1ef73-3a79-7a71-b4e9-e00318c716a0`。
- 本轮修复由当前 parent 按 FIRST 事实完成；本 reviewer 未编写、覆写或修正候选。parent 的执行叙述不是新的源像素观察。
- soleW：`/Users/yong/.codex/worktrees/d9b1/lemmadeck`；每次 shell 都显式以此为 workdir。声明分支 `codex/STEMROBIN-182-textbooks`，未执行 Git 核验。
- 本轮只继承 FIRST 已观察的文字、印刷行、类型与边界，不重新查看任何图片或重解数学。
- **实际新图 0、重开 0、裁片 0**。未读取 PDF/grid/旧 figure 的像素，也未为本轮加载图像 payload。FIRST 七张 grid 各一次的事实只是历史继承，不是本轮重复观察。

FIRST 原报告：
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-4/source-review.md`

继承的原始 SHA256：

- source-review.md：`aac0c2b9e1d3c92704717fc540f33b5d2879056e8f0048ad4a1ce4ab835e7c6d`
- source-author.json：`098844eee69eed130f472d4745a0bf5780cda53bf55b937ba0a24b1f96d91594`
- source-author.md：`af2a39483cf10bc5eb9d58e3cca45f439414d59fb23c0b5e3aca683f0b2287e5`

三个原报告均与 FIRST 留存哈希一致。冻结的原21文件也全部逐一匹配 source-author.json / FIRST 报告登记值。没有修改原报告。

源身份继续继承 FIRST 的 PDF SHA256 `8070c333ee46fb0dc650cb32d4d898f605ed308559b6cc430425d908dae6b052` 与 profile SHA256 `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`；本轮仅检查当前 meta/source/render/profile 与冻结原件一致，不声称重新哈希或观察了原 PDF、profile 或 grid。

## 实际差异核对

对每页的冻结原 MD 与当前 MD 做原始文本 diff。另以冻结原件为基底，只应用人授权且 FIRST 已记录的替换，核对当前 MD 原始文本完全相等；对 JSON 的核对使用结构化解析，要求只有相应 blocks[].lines 改变，其他字段与冻结原 JSON 完全一致。没有使用原流水线 gate。

七页均符合以下事实：

- MD frontmatter（含原始 JSON 文本与分隔符）的字节未改；解析的 meta 也未改。
- 当前 MD 的 meta、各块头与逐行块体和当前 JSON 一致。
- 当前 JSON 与冻结原 JSON 的差异，严格只有下列获准的块体字符/公式换行表示；无额外字段改动。
- kind、label、box、owner_exercise、open、cont、samerow、source/render/profile、printed_page、printed_lines、notes、errata、figures 均未改。
- 原数字、数学符号、小问码点未被更换；177 等式链仅合并原两个数学串并编码真实断点，不改式中数字或运算。
- 当前七页块体 U+3002 均为 0。frontmatter 中的中文句号仍原样保留，没有把块体替换扩散到 notes。

| 物理页 | 实际确认的局部修复 | U+3002→逗号 | U+3002→ASCII `.` |
| --- | --- | --- | --- |
| 175 | D175-1 情况→情形；D175-2 可靠数字后逗号；D175-3 删“有几个小数”中多余“小”，恢复“小数数位”的重复“数” | 1 | 10 |
| 176 | D176-1 两个近似式之间 `；`→`，` | 0 | 15 |
| 177 | D177-1 两行等式链合为一个含真实 `↵` 的完整数学串；D177-2 602г 末逗号 | 1 | 9 |
| 178 | D178-1 `d=4.3` 分米之后 `；`→`，` | 0 | 11 |
| 179 | D179-1 “这两个数的近似数的积”恢复原书“和” | 0 | 13 |
| 180 | 只有获准 G01 块体句末码点修复 | 0 | 12 |
| 181 | D181-1 / D181-2 两公式末尾恢复逗号 | 2 | 10 |
| 合计 | 所列局部修复之外无差异 | **4** | **80** |

原84个块体 U+3002 的处置精确为4处已确认逗号修复、80处授权 profile 编码修复。176、178 各另有一个分号改逗号，不计入这84个 U+3002。80处编码修复依据继承的 profile 契约与本次明确授权，不声称新观察了80处源点形。

### 177 的真实断点

当前 p0177#9 的唯一块体字符串是：

```text
$x+y\approx6.3\times10^3+3.26\times10^5=10^5(6.3\cdot10^{-2}+3.26)↵=10^5(0.063+3.26)$.
```

从冻结原件的两条字符串到当前一条字符串，仅去掉原断点处的闭合/开启 `$` 与文本换行，插入一个 `↵`；末尾 `。` 改为 `.`。`↵` 位置恰是 FIRST 已观察的印刷行10/11之间，未增补另一条内容。当前全页24条块体字符串 + 1个真实 `↵` = 25条源行表示，不是26条。

## 逐七页当前裁定

“源行”继承 FIRST 目读；“当前表示行”只按当前块体字符串及 `↵` 对照，并非新计数器运行。人报告七次 affected finalize 的真实 exit `[0,0,1,0,0,0,0]` 仅作为其执行事实继承，本 reviewer 没有重跑或以此替代忠实度裁定。

| 物理页 | footer | 继承源行 / 当前表示行 | affected diff | 当前忠实度 actual verdict | 仍存边界 |
| --- | --- | --- | --- | --- | --- |
| 175 | 169 | 26 / 26 | PASS | **PASS**：G01、D175-1..3 已准确修复 | 首 p cont、末 p open 均保留；不重审174 |
| 176 | 170 | 26 / 26 | PASS | **PASS**：G01、D176-1 已准确修复 | 首 p cont 衔接175，类型未变 |
| 177 | 171 | 25 / 25 | PASS | **BLOCKED**：G01、D177-1..2 已修复，602小脚注标记仍未明确确认 | 机械26/25 HOLD保留；ex603 open保留 |
| 178 | 172 | 26 / 26 | PASS | **BLOCKED**：G01、D178-1 已修复，609б指数9仍未明确确认 | 609无指令现状保留；不把它补成完整题 |
| 179 | 173 | 25 / 25 | PASS | **PASS**：G01、D179-1 已准确修复 | h3与其内容未变；非数学勘误批准 |
| 180 | 174 | 26 / 26 | PASS | **PASS**：仅G01修复，无扩改 | 末 p open到181仍保留 |
| 181 | 175 | 23 / 23 | PASS | **PASS**：G01、D181-1..2 已准确修复 | 末 p open未闭合；不是完整段落或lesson批准 |

没有发现这次修复遗漏或越界引入的新差异；因此没有本轮 REVISE 项。但未决源项并未随 affected diff PASS 自动解除。

## 未决项与保留事实

- **602小脚注标记仍 BLOCKED**：当前题首“和*：”与脚注首 `*` 的码点均与冻结原件相同。脚注只进行了获准句末码点修复。FIRST 对细小标记的识别限制继续有效；本轮没有新像素来批准星号读法。
- **609б指数9仍 BLOCKED**：当前 `б) $x\approx6.043\cdot10^9$，$y\approx5.2\cdot10^3$；` 与冻结原件完全相同。未据数学、数值规律或 notes 修改或确认指数。
- **609无额外指令**：当前仍只有“已知：”及四个数值小问，未增加求和、求差等动词；只有г行句末编码变化。继承原页状态，不声称此题对象完整。
- **178四边长**：当前606首行仍是“606. 已知四边长的边长：”，与冻结原件一致，继承 FIRST 对字形的明确观察；未改成“四边形”，未登记勘误。d行的 `=` 未动。
- **181尾未闭合**：p0181#16 仍是 p open，字符串仍精确结束于“都含有三个有效”。未补“数字”或右括号，也未读182。
- 175→176 的“近”/“似数”、177→178 的 ex603 open/cont、180→181 的“取到三个”/“有效数字”边界都保留。181首行只是获准句末编码变化，未提前闭合180。
- h3“28. 近似数的乘除”、exhead“复习题”、脚注/页码的两个 foot、七个 footer 都未改类型或归属。
- Cyrillic а/б/в/г 原码点保持；七页 errata 仍为原空数组。
- 旧物理174、旧计行、原 SOURCE、图36及其它 HOLD不动。只继承 FIRST 与人的既有文字边界，不重新核验或解除这些范围。
- **177机械26/25 HOLD不变**。当前表示仍为25行，与 FIRST 目读对应；本轮没有检查计数器/遮图行带，也没有诊断或修复其额外计行原因。

## 原/当前 raw SHA256

冻结根：
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-4/original-pages`

当前根：
`/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/pages`

下表每个文件路径为对应根 + `/NNNN/page.md` 或 `/NNNN/page.json`，均按原始文件字节取哈希，不是规范化后的JSON哈希。

| 物理页 | 冻结原 page.md | 当前 page.md | 冻结原 page.json | 当前 page.json |
| --- | --- | --- | --- | --- |
| 175 | `949afe657e4e880dc21863f61b6562a96881fa889c0fba0d4040b99dcb93d373` | `3796b6bb210071f615748aabbf43e8a9cfca7aeb7ef198f07e5fc1f5014d15fe` | `05b11b90be62b7007ea33e32a9f337b02bd3e1080d5eb4a83f8115e39810acaf` | `52fc83479e06d2ccb26fcb66aadee4a119810b015fa5625e6fbef9a0635902fe` |
| 176 | `6c8a1e737e31d25d65a90c43f1b11025359e617aee93abd9b006eb3e12b67ba5` | `23204218f62296be752c2af822e1a39d295085c1eeb90c1c1d3a0a68b2f4d06e` | `d3e8b8e0931a6a789c4317462a8dbf51c80fb8f2f23b69d0857ce569b52df222` | `ed5e74b6427d25fadf553368e94e7773bc1ac8415208a06821eaadf16770fc9b` |
| 177 | `b796932611eabe95527589de9e6d46c18839a97e635949301e3cd521355676e5` | `89b553aaa9658cebca07eaa6c54c59297d8ef7e78b2506d3d0448d4a224a7844` | `41c354f73d30c4414bbc833c712e93146c1d397a8856972e0ca0e6dfe0ef6855` | `9b19675057a8bbe9bb1cc751490642909467ed48ea067b13703424769a0a3ae5` |
| 178 | `2e0ed5ed2791c4d0367c92f882a0797cdcfa39955815428e66bea557710d3af6` | `466da52c22426c7e209950d18a4a678859da6ad0041c0a760b275f1dac633676` | `5bbe19c4524ad290062a96674f8e4b1b226f32450e73a29a12589d111f533d3b` | `791a58bdea302454bd3292b6df1e032ad8c60c4551faa8aad63d078c591ff0f8` |
| 179 | `c2612617f359cced174d57fb4d6805f95e0c5a457dc3b0dc718d25370c549a6c` | `4074a744464c98270f07642c6070605004158cdd7bef1f7a47ad5bd2555faf56` | `255fbadcdf790663e5ac9f382e90dbb9472ad15c83a3f01039382b1bee7efece` | `0d23273f425dbdd402facefdecd7c758fcfdd85be137fe8cc6d890444c767d7f` |
| 180 | `68242b36b8fa88319735884bcfd95e22b0f52593545db4ada464d4a0e2cd7a11` | `0ff16c2b146b25745924ce13307437b7b1537493812d21527fde5c6213d9a207` | `2d9cfcfda3afada5944887e35320c995c6b2dd926c5c17aa75882caf5cd30af0` | `e2e5fee9dd2344e9f96b241e535a0c446160ed44be47f9fce9f7aa4e9efdaa34` |
| 181 | `24923c1db055e090634cbc63cdd96ec98dd86b15a9a1bb457c4488c7f4ad43a1` | `9df2dedf9db358c54b0200b38c7bcbeb69daffc632b472b6b588cadec9bb69b9` | `35fa780cde39864b554b84e5fa72cf334b67c3fb2c4a396374d56ea65fad85de` | `2927e03caf6ad9f9a7a12ed1afa00648846aca9949f1994a45ddb275edc99344` |

七个 audit.json 只取原始哈希作为保护证据，冻结原与当前均相同；未用它们的机械结果代替忠实源审：

| 页目录 / audit.json | 冻结原与当前共有 SHA256 |
| --- | --- |
| 0175 | `f94547019db87bdadac3314d11332e80d35022dc8a5845b5b85a08faa282a0f5` |
| 0176 | `fae4ded6900da716f80285e224a9ddae24ca08507b5faac4fe9987eea8743bb8` |
| 0177 | `2e35158ad37bb161d69ebf0d604297c3abbfbc9ef451b7d2444743c0483ff944` |
| 0178 | `19049af028d3a0e3b262dc04e25a2901670bec15624062cda23607e56c73c45d` |
| 0179 | `b085ed52b1703938fed28d2a021e347d4eb9324d5e45071bd116e2a961963ca9` |
| 0180 | `857878813041f40efa76b8d7d424e9b887ee8c5257c3434c09259ba6e3fa0848` |
| 0181 | `5fec3472625726a0ff09a4b0c289527b7d0a112e50094b9e1fc0d7655b21602b` |

21文件清单指纹：

- 冻结原21：`cbd3b3fc3e7737772b13aca94e97735d41f0eff3e2b34bc5a94ebb47d42a5fec`
- 当前21：`452beb290d38f72004e357ee142214ecdde2b4486a66f32cfd11ad08906de68f`

定义：页序0175..0181，每页依次page.md/page.json/audit.json，条目为 `NNNN/name + TAB + raw SHA256 + LF`，连接UTF-8后取SHA256。这样哈希描述同一批内容，不依赖冻结副本的搬移路径。

本轮45文件保护清单指纹：
`4d0ece3fcd369d8f170bcf4d36bdedd998440e6e962d9845c6e73292c017343b`

定义：冻结原21 + 当前21 + source-author.json/md + FIRST source-review.md，共45个绝对路径，按路径字典序排列，每项 `absolute path + TAB + raw SHA256 + LF`，连接UTF-8后取SHA256。本报告不在该保护清单内。报告创建前计算，创建后再只读核对，用于确认本 reviewer 没有改变任何原件、候选或原报告。

## 执行范围

唯一写入为本 `source-affected-review.md`，用 apply_patch 新建；创建前该路径不存在。没有可选JSON、修复脚本或图像副本。

未执行 gate、finalize、render、assemble、vectorize、现代版、数学求解、APP、881、旧figure读取、网络、Git或DB。`diff -u` 的 exit 1 表示正常发现文本差异，不是流水线失败或177的新机械结果。辅助Node仅在内存中构造获准差异并只读核对，不写候选。

目录中的同名 finalize-receipt.json 不属于这七页源转写，已排除，不引用它给7a的七次调用背书；七次 affected finalize 的真实exit与一次性执行叙述来自本轮人的直接报告，未被冒充为本 reviewer 的新运行证据。

当前修复的确认严格继承 FIRST 已观察源事实。602小标记、609б指数9、177机械26/25与全部旧范围HOLD仍未解除；181保留未闭合的正确页尾，不扩成对象完整或下游批准。
