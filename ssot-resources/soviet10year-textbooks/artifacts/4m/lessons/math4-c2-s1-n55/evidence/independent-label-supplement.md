# N55 925分题标签限定补核

日期：2026-11-23。
唯一根：`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-187`。
课：`math4-c2-s1-n55`，55《小数的数位》。

## 授权范围与实际操作

本次只核925现代分题标号、改写记录和text/lines一致性，不重新读源图、不重数学、不读答案/键或其他课，不检查整课或启动choice阶段。新增图片0，累计仍 **17/24**。

首次读取时，当前模板已是Latin a)/b)及要求的changes状态，因此本审未重复编辑模板。只写本证据文件；FIRST、旧比较、补充证据及图214上一REVISE均不改。

用户报告adapt-finalize因西里尔标号exit2，并已保留失败audit。本文仅绑定并保留该历史文件，不重跑adapt-finalize，不将标签补核PASS当作该命令已成功。

## 当前文件绑定

完整路径为上述唯一根加表中相对路径。

| 文件 | 当前SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/4m/modern-us-neutral/lessons/math4-c2-s1-n55/exercises.template.json` | `91b8bdf58f01fe2950c966863a444ed28cbc5839ca692c31e79493fcd9b5393b` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/exercises.json` | `87be0451579e95373408e623da45680d94a83e63d35f936dacbbfdbd2bb7871e` |
| `ssot-resources/soviet10year-textbooks/artifacts/4m/lessons/math4-c2-s1-n55/evidence/adaptation-first-failure.json` | `51693bdfbcf8afa3bc1171f0c8ecdcd35ce977b5025f2fcf68a5260e79b409f1` |

当前模板 `source.path` 为 `lessons/math4-c2-s1-n55/exercises.json`，`source.sha256` 与该实际原课文件hash一致。模板中 `source.data` 的925对象与原课925对象完全相等；现代925的 `source_text` 与原925完整text相等。原层及源字段里的西里尔标号按源保留，不要求把它们也现代化。

## 925 affected-only核查

**限定PASS：当前现代925已准确使用Latin标号，并保持三行text/lines一致。**

- 第一分题标号为Latin `a)`，首字母码点 `U+0061`；第二分题为Latin `b)`，码点 `U+0062`。现代 `text/lines` 没有残留西里尔 `а`（U+0430）或 `б`（U+0431）。
- 当前 `changes` 精确为 `["layout","subpart-labels"]`，`numeric_changes` 为 `[]`。
- 当前 `lines` 恰有三行：完整题干、完整a分题、完整b分题。`text` 与 `lines.join("\n")` 严格相等，没有标号只改text或只改lines的情况。
- 将源text仅作西里尔 `а)`→Latin `a)`、`б)`→Latin `b)` 两项替换后，与当前三行直接拼接的文本严格相等。因此除标号和分行外，没有改变任何题干字句、数值、单位、标点或分题次序。
- a分题的15个一及3/7/9各小数单位、b分题的0个一及3/0/4/1各小数单位均保留；此处只比文字，不计算小数结果。
- `pages:["p0206#9","p0207#1"]` 与原925一致，仍是同一道跨页题。`number/source_number` 仍为925，未改源身份或增删分题。

本核查为直接读取当前925相关字段、码点及严格字符串/源绑定比较，不运行课程checker、normalizer或finalize，不批准wholeLesson或正式发布。

## 收束

925标签修复在上述模板hash上限定PASS，累计17/24。失败audit原字节保留；不据此推断下一次adapt-finalize结果。只保存本补核，choice seed/views待官方prepare及后续授权，不提前读取。未执行env/DB、paid、安装、APP、commit/push或其他聊天。
