# 9-10g 物理50–53页忠实转录作者包

状态：AUTHOR-FROZEN，等待母方唯一StageB。仅报告真实首次finalize结果，不作为独立原文、数学、图像或出版门禁PASS。

## 范围与方法

- 同一STEMROBIN-184授权，仅处理物理0050–0053，印刷43–46页。没有再次prepare。
- 已读现有lesson技能、AGENTS/readme和当前charter；逐页独立打开现有完整原生`page.grid.png`并读取本页template。
- 前界仅使用已批准物理49页第123题尾文字，快照在`source-9g-p50-p53-author-evidence/boundary-49-ex123.md`。未重新阅读48/49数学、n13、n84或独立Banach稿。
- durable正文位于`ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0050..0053/page.md`。原书已有“解/分析/作法/研究”和“答案”字样属于扫描正文，保留但不另生成答案。
- 保留Cyrillic分图字母、印刷换行、必要行末ASCII空格、公式实际断点`↵`、`cont/open/samerow`、图题和页码。未知边缘墨迹在notes登记UNKNOWN，不据答案或数学期望补改。四页均无errata、count_exclusions。
- 未手改任何源像素或裁图。没有prepare重放、修工具、索引、vectorize、assemble、adapt、现代图、答案/choice生成、DB、Git、网络或其他chat操作。

## 真实尝试

| 物理页 | 印刷页 | 首finalize次数 | exit | 块 | md/印刷行 | 图 | retry/repair |
|---|---:|---:|---:|---:|---:|---|---:|
| 0050 | 43 | 1 | 0 | 14 | 26/26 | fig-54 | 0 |
| 0051 | 44 | 1 | 0 | 4 | 9/9 | fig-55 | 0 |
| 0052 | 45 | 1 | 0 | 9 | 26/26 | 无 | 0 |
| 0053 | 46 | 1 | 0 | 12 | 26/26 | 无 | 0 |

每页准确argv：

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python
.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 9-10g --page <50|51|52|53>
```

四页audit均为`errors=[]`、`normalizations=[]`、`unknown_chars=[]`、`katex_warnings=[]`。机器白名单无未知字符不等于光学阅读无不确定性；notes中的UNKNOWN保持有效。没有首FAIL，因而没有FAIL修复或重试。

## 转录边界与待审点

- 0050以`ex 123 cont`接批准49尾，含124–132，以`ex 133 open`结尾。125的可见点横符号保留`a\dot{-}b`、可见直线名保留大写C，不按图m替换；127不补假设。fig-54单图块，图题`samerow`与126末行同排。
- 0051以`ex 133 cont`保留原书分析；fig-55三个分图整体一个粗框。交集式在`(ABC)`后的印刷断点用`↵`；分图引用а、б为Cyrillic。
- 0052继续133原印作法/研究，保留图55а、б位置与原式；含134–139，以140的第二小问`open`结束。139交集式使用真实跨行断点，不作数学判断。
- 0053以`ex 140 cont`补第二小问公式，含141–150。142长度式实际跨行用`↵`；146原印`面[BCD]`不改括号；150保留“射影”与图56，а引用。本页题150问句可见完整，不凭分图引用添加续文。图56像素不在本四页包内，需母方后续边界处理。
- 0053首次命令前曾再次打开同一完整原生grid，校对150首句点名分隔；这是命令前光学校对，不是finalize修复或数学反推。manifest中的`before/durable/page.md`是首次finalize准确输入。
- 第133题真实跨0050–0052；0051首次稿块头仅写`cont`而未另写`open`。页级命令成功不证明跨页装订语义，母方StageB需核对这一标记，本轮未再编辑已收口页或执行assemble。
- 图54/55均由唯一首次finalize吸附裁出，作者没有重裁、手动改像素或独立宣称图源完整性。

## 冻结原始SHA-256

所有哈希均针对文件原字节，无JSON重排或文字规范化后再哈希。PDF身份哈希来自既有template，此轮没有重新读取PDF；下列page.png、durable及裁图哈希为本地直接取值。

| 物理页 | 原始page.png SHA-256 | 最终durable page.md SHA-256 |
|---|---|---|
| 0050 | `661d31731609533caac57acb92caf25725a23a76b4202cf83db710471754b397` | `25b514bddc1c8c0e1471ca381a48781b66c89dcdd0b6e5923d2c9fa004990a5e` |
| 0051 | `8c0b9576f4244c602ae4f856ff612e85c7d2f5fccb5fe2eef48a357b68afd5d6` | `20f6d4db638aab960b213464b795e8f24425f498a355dd8a6d304756c0573bda` |
| 0052 | `dacfd7ee49f099bc2f3db302225dc009b53927e7a608aa545574e9b9ed49324d` | `6a4a5efdfd9284d0423cbe3c864f767803fb8764b73d04115c5463a089be6295` |
| 0053 | `de36259ced7959164414109b3d7f92aa3189ec40af43f381ab51829e23f79e07` | `7fa7b9159c90a33ea69578e4291bb4f099b575f69de7fcd5330ffc227a2270af` |

- fig-54：精确框`[841,551,373,424]`，PNG SHA-256 `73f9540d57e421709a2c2c04e594ec8ed48ef8dfc3c08e2f537be96d7b0e51b9`。
- fig-55：精确框`[151,686,1065,1191]`，PNG SHA-256 `6f203be966b1afd76d7937ac2784d2663361e831eac293503d3163265375ce2e`。

## 完整证据

`source-9g-p50-p53-author-evidence/<0050..0053>/attempt-01/`各含：

- `before/work/`完整prepared page.png、page.grid.png、layout.json、template。
- `before/durable/`完整首次finalize输入草稿。
- `stdout.txt`、`stderr.txt`与`command.json`准确executable/argv/cwd/exit/signal/时间/原字节哈希。
- `after/work/`完整工作目录，包括实际生成的原PNG裁图。
- `after/durable/`完整首次收口page.md、page.json、audit.json。

`source-9g-p50-p53-author-manifest.json`逐文件记录bytes及raw SHA-256，包含上述所有文件、边界文字、scratch捕获/冻结脚本、报告、当前四页prepared输入及durable输出。manifest不自包含哈希；报告与manifest写完后由独立`shasum -a 256`外取最终摘要。

停止条件：本包已冻结，不再改写或重放。新增54–55授权仅能使用独立证据包；本包仍等待母方StageB，不据机械成功自行提升为文本或数学PASS。
