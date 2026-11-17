# SOURCE 作者报告：8p physical 97/98，batch49

日期：2026-11-17。工单：STEMROBIN-180/C。仅离线 SOURCE 作者任务，不是独立 SOURCE 审查、课程批准或正式全项目交付。

Workspace：`/Users/yong/.codex/worktrees/0f12/lemmadeck`。
Owned root：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798`。
外部唯一自有报告：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-8p9798.md`。

## 当前结论

| Physical / printed page | 作者状态 | 不同印刷行 / MD / 机器 | 块 / 习题 / 图 | 原始字形未知根 | 机械 HOLD | FIRST 次数 / exit / 失败 debit | 实际修复 used / unused |
|---|---|---|---|---|---|---|---|
| 97 / 85 | AUTHORBLOCKED | 18 / 18 / 18 | 12 / 0 / 1 | 1 | false | 1 / 0 / 0 | 0 / 1 |
| 98 / 86 | AUTHORBLOCKED | 26 / 26 / 26 | 14 / 0 / 1 | 2 | false | 1 / 0 / 0 | 0 / 1 |

两次 FIRST 都只有机械收口成功；各规范化 0、白名单未知字符 0、KaTeX warnings 0、audit errors 0。机械 FIRST 不是独立 SOURCE FIRST。独立 SOURCE 审查次数 0、SOURCE 批准 0、提升 0；不能把 AUTHORBLOCKED 改写为 SOURCEPASS。

作者未知项和已确认缺陷分别记录，不互换、不合并：

- `p0097-u1`：页脚 85 的字重未独立解析。选用 bold+italic；斜体倾斜和两侧圆点已观察，bold 仍是暂定选择。HOLD。
- `p0098-u1`：页脚 86 的字重未独立解析。选用 italic-only；斜体倾斜和两侧圆点已观察，不加 bold 仍是暂定选择。HOLD。
- `p0098-u2`：图 67 图题数字选用 italic，但字体斜体与扫描倾斜的区分未独立解析。HOLD。

合计原始作者未知根 3；机械未知 0；最终裁图未查看项 0。作者观察中确认的 candidate 缺陷 0、crop 缺陷 0、inventory 缺陷 0。独立审查未执行，因此这些零值不是独立 SOURCE 无缺陷证明。

## 来源与冻结

遵循 `.claude/skills/ld-s10y-lesson/SKILL.md` 的逐页、印刷行和 open/cont/samerow 契约，并遵循 `.agents/skills/ld-s10y-image/SKILL.md` 的图片批次规则。本委托限定为 SOURCE 作者，覆盖技能默认的装订、现代版、入库和产品验收流程。

97/98 的 prepare 均为父在 batch48 已执行 once、exit=0。本作者 prepare 0；直接复用既有 `work/8p/pages/0097` 和 `0098` 的八个 prepare 叶子。没有重 prepare，也没有修改这些输入。

纯 96 结构来自 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/incoming-8p9798-structure.json`；它是 UNAPPROVED，不含输入 prose/formula/image/failed-report payload。97 第一块只按结构承接 `p0096#12`；没有追读旧正文、公式、图片或失败报告指针。

当前基线只采用父提供的 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/batch49-current-after9596-status.json`。旧嵌入状态是历史，不提升为当前事实。父的 prepare/status 元数据不是新增人类批准。

下列完整清单在任何 `page.md` 候选创建前已 chmod `0444`，其冻结 SHA/bytes 随后绑定在 FIRST-before snapshot 中；本次收口不改清单、不重新哈希已有叶子：

| 清单 | bytes | SHA256 |
|---|---|---|
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/inventory-p0097.json` | 9272 | `43173a5bba078ee120ba2c77286eb9bd3a75db4c89e42b0636d71ca08606465d` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/inventory-p0098.json` | 11141 | `4012322413a54268bf7012b11567a8b85e53d244ce6d086756cc720b4d783008` |

清单覆盖不同印刷行、完整字面与公式、标点、大小写、箭头和下标、选定字重/斜体、继承标题、空习题组/任务、图题、图内全部标签与关系、页脚、无脚注、页首/页尾边界。图内标签留在像素中，不虚增正文行；高分式仍一印刷行。98 的正文末行和图题是真实同排，27 个文字对象只对应 26 个不同印刷行。

97 保留“如众周知”，98 保留“即时加速度”“取得彼此相当地接近”“好象”；未按现代措辞改写。98 三行粗体定理仍为 `p0098#10` 正文，不新增标题。清单用每行 strong 标记描述选择；候选以跨三印刷行的单个 strong span 表达同一字重选择，包含原印标点，不改变行数或字面。

## FIRST 证据

以下命令仅在原作者阶段各执行一次，本次补交付未重复执行：

```text
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 8p --page 97 --root /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/artifacts --work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/work
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B /Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 8p --page 98 --root /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/artifacts --work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/work
```

cwd 为上述 workspace。命令执行前的原始候选副本和命令/清单/输入/缺席 JSON-audit-crop 状态在 `first-0097-before`、`first-0098-before`；执行后的命令、exit、stdout/stderr、当前 MD/JSON/audit 和实际裁图 bytes/SHA 在对应 `first-0097-after/result.json`、`first-0098-after/result.json`。这些是执行时冻结账本，不是新增复核。

原 BEFORE MD：97 为 2317 bytes / `d5f451780f2f7c4355c6552a4ef96df3234c62e70c94e122ade09bfe1f136cb5`；98 为 2969 bytes / `5f69b2d47c368021be6f655e9e172977cd1a0402cd5b21017069f803482395b5`。

stdout 原有事实：97 为“12 块 / 18 行（印刷 18），插图 1 张，规范化 0 处”；98 为“14 块 / 26 行（印刷 26），插图 1 张，规范化 0 处”；两页 exit=0，stderr 各 0 bytes。详细 stdout/stderr 的既存哈希在 manifest，不在本次重算。

当前冻结 MD：97 为 2586 bytes / `1304566b377f75e416f5ce9d485b632f3064e7428ad06c409eba580311f00129`；98 为 3238 bytes / `5014a475062be9fac8afaa56be676e931bdd849df92e1acbff9119dfdb26ae31`。FIRST 对 MD 写入机械来源元数据和图引用；audit 的正文规范化次数仍为 0。MD、JSON、audit、FIRST 副本及实际 crop 已 `0444`，FIRST 后无作者修补。

## 图片观察

复用原任务的六次 `view_image` 结果；本次补交付打开图片 0。累计 6/8 task、6/24 context；父 TEXTONLY 0 images，inflight 0。不把 native sheet 的每个 panel 隐藏为额外载图，也不把其 scale=1 的像素证据说成新截图。

| 次序 | 已查看原任务图像 | 覆盖 |
|---|---|---|
| 1 | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/work/8p/pages/0097/page.png` | 单独查看 97 全页：全部正文、公式、图/图题、页脚和边界 |
| 2 | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/work/8p/pages/0098/page.png` | 单独查看 98 全页：全部正文、公式、粗体定理、图/图题、页脚和边界 |
| 3 | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/p0097.native-sheet.png` | 原生 1:1 六 panel：两公式、inline Delta/vector、末正文、页脚、图 66 含图题 |
| 4 | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/p0098.native-sheet.png` | 原生 1:1 六 panel：AB 弧、两公式、定理与末正文、页脚、图 67 含图题 |
| 5 | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/work/8p/pages/0097/figures/fig-66.png` | FIRST 实际最终 crop，全部对象/标签/关系和边界已查看 |
| 6 | `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/work/8p/pages/0098/figures/fig-67.png` | FIRST 实际最终 crop，全部对象/标签/关系和边界已查看 |

`native-sheet-coverage.json` 保存 native panel 坐标、scale=1、未 resize 和图像既存 SHA；其中 `not-yet-viewed` 是生成时状态，未改冻账本。上表复用后来已发生的六次图像工具观察，不能把生成时标志当成当前未查看。

| 实际 crop | 吸附 box xywh | bytes | SHA256 |
|---|---|---|---|
| fig-66.png | 590,1199,657,499 | 7280 | `6cba809b925cd94d319ba68acb937bb93d825ca2fb8ae5d939133dfabb1f82da` |
| fig-67.png | 799,1630,573,556 | 8134 | `7f491a7ceb572e27ea41fb0632750a626943e09491bfe1995dd7158443519dc0` |

图 66：一闭合圆周、未标 O 的中心、A/B、两条虚线半径、相反的初速度构造、两次 v 标签、Delta v 和两次 phi；共 9 个标签出现位置。图 67：一圆周、共用内部汇合点、三个编号位置、三条虚线半径、三对 v_i/a_i，共 6 个标签和 6 支方向箭头；a_i 径向内指，v_i 在各自圆周位置沿切线方向。完整清单保存对象与关系，未用对象总数替代关系，也未声称像素级几何精确度。两图题均作为文字保留在图框外；没有从 crop 删除原图标签或增加答案。

## 纯结构边界

输出：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/outgoing-8p98-structure.json`。

97 第一块 `p0097#1 cont` 承接未批准的 `p0096#12 open`，在第一印刷行闭合传入括号；97 最后正文 `p0097#11 open`，最后块/页脚 `p0097#12 closed`。98 第一块 `p0098#1 cont` 承接 `p0097#11`；98 最后正文 `p0098#12 open`，不是末尾页脚 `p0098#14 closed`。98 图为 `p0098#11`，图题 `p0098#13 samerow` 与最后正文的最后印刷行同排。

没有 97/98 新标题、习题栏或任务。最后继承 h3 仅保留结构 ID `p0096#11`，不传标题或认领 TOC；96 的早先 exhead `p0096#6` 已被该标题闭合，当前 group/task 均 null，脚注集合为空。末正文没有未闭括号。向 99/100 只传稳定结构 IDs/flags；prose_payload、formula_payload、image_payload、failed_report_payload 均 false，不推测下一字、下一题号或下一页实际块。

## 基线与限制

父给定现状保持：approved7p=68、approved8p=14；raw pages/entries/tasks=54/21/85；committed7pModernCourses=9、t8Committed=true；batch modernAdded=0；8p entries=0、modern=0、exerciseNumbering=UNSET。原有全部 HOLD 不变，没有从这两页发现完整可批准课程的声明。

prepare 0；post-FIRST repair/rerun/checker/vectorize/assembly/promotion 各 0；99/100 读取/prepare 各 0；DB、backend、Git、app、browser、publish、automation、install、freshness、全项目检查、正式 handoff 各 0。未改 frozen inputs、冻稿、旧报告或其他人的产物。保留输入使用的是执行时既存记录，本次不新增“已重哈希验证未变”的声明。

## 扁平 Manifest

路径：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-9798/current-products-manifest.json`。

形状严格为 `{workspace, files:[{path:absolute, bytes, sha256}]}`，逐项列当前待交付内容叶子、FIRST 前后内容副本、stdout/stderr、清单、原生 sheet、最终 crop、纯结构和本外部报告。已有叶子数值复用执行时记录；FIRST 内容副本复用其创建时对应原文件的相同字节身份，不重新读图或重哈希。

范围不是全 root 文件树：排除每页四个 pre-existing prepare 叶子共 8 个、旧 incoming/current-status/history、manifest 自身；自哈希账本 `inputs.before.json`、`native-sheet-coverage.json`、`first-*-before/snapshot.json`、`first-*-after/result.json` 和执行脚本 `evidence.py` 是支持证据，不是内容交付叶子，仍原位保留。本次不为这些既有账本/脚本补算哈希，也不把 manifest 说成它们的完整文件树证明。新报告与纯结构作为本次新建交付首次计算身份，manifest 本身身份只在返回文本中给出，避免自哈希循环。
