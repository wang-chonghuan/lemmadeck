# STEMROBIN-182 / counter205-206 Zero-Image Binding Review

## Scope And Decisions

唯一 W = `/Users/yong/.codex/worktrees/d9b1/lemmadeck`，所有 exec 显式 workdir=W。D=`W/.intentfold/tickets/STEMROBIN-182/tmp/resume182-8/counter205-206`；P=`W/ssot-resources/soviet10year-textbooks/artifacts/7a/pages`。

本次只完整比较 205/206 的 before 与 current MD/JSON/audit、核对指定恢复及 FIRST/WRAP 回执，并独立裁决 p0205 的 n31 条件差异。零图、离线；未运行 Git、DB、pipeline、计行诊断、测试或图像操作，未编辑源码/源页。仅新增此报告；n33 数学报告不读、不改、不重审，原证据可继续供本课新 choice 语义复核。

裁决：**PASS / COUNTER_RECOVERY_BINDING_ONLY**。两次恢复 actual exit=0/0，与既有独立像素 inventory 的 205=24、206=20 一致；没有改题面迎合计数。n31 条件疑义的局部数学裁决为 **NO_CONFIRMED_ERRATUM**，理由见末节。均不构成整课科学、modern、choice、display 或发布批准，也不解除其他科学 HOLD。

## Exact Comparison

实际读取六份 `D/before/{205,206}/{page.md,page.json,audit.json}` 全文并测 hash，均匹配 `inputs.json.originals`。四份 MD/JSON 与当前文件逐字节相同；JSON 全部 meta/blocks 亦相同。因此题面、数学、`↵`、notes、errata、flags、boxes、source/render 绑定无改动。

需要精确区分：25→24、21→20 **只发生在 audit 的 `lines_printed`**。before 的 MD frontmatter / JSON meta 本来就是 24/20，恢复后仍为 24/20，并未修改这些元数据。

| Page | Before Audit printed / md | Current Audit printed / md | Only Other Difference |
| --- | --- | --- | --- |
| 0205 | 25 / 24 | 24 / 24 | 原一条行数不符 errors 变为 `[]` |
| 0206 | 21 / 20 | 20 / 20 | 原一条行数不符 errors 变为 `[]` |

对 audit 全对象作精确比较，除 `lines_printed` 和 `errors` 外无差异。before 是 WRAP 编码修复后、counter 工具恢复前的六份输出，逐份匹配原 WRAP 回执；不能误称为尚含 literal-LF 的 FIRST MD 原稿。

六份 current SHA-256，文件均位于 P：

| Current File | SHA-256 |
| --- | --- |
| `0205/page.md` | `1b64a80ee44ede54452a8482553978367ea64f16a8ab01ae55bbe28c13e3a7ce` |
| `0205/page.json` | `9bb9c09f47ad82098d9de88c427769bcb3d169e3faa0fb27808ad484003bdb30` |
| `0205/audit.json` | `afda8257adbadd1592c262c9ea2c5bc75718ac85c0a7133ddec3964f94c93d82` |
| `0206/page.md` | `8cdc002d50754e6dc5208a9070562d961233fe6b97d95d5c29f6fc11b00362f4` |
| `0206/page.json` | `756435af6d8897967138d9f16a3db8fa6a64ec96b18f94a87b60bea06714577c` |
| `0206/audit.json` | `647c259ab7e23311c9be2e6675c2416ceb4ae2a2ba2a959325d3abac64b59ce4` |

## Actual Recipe Binding

本人只读回执，未执行其中命令。两页实际 argv 均为 `.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 7a --page N`，N 分别为 205、206；cwd=W，signal/error=null。

| N | Actual Start -> Finish UTC, 2026-11-18 | Exit | `D/p0NNN.counter-recovery.json` SHA-256 |
| --- | --- | --- | --- |
| 205 | 22:16:13.152 -> 22:16:13.564 | 0 | `17fea6b9d785f123cf3270bffc1dd1fac2dfa7ff724a7e32db073d97a34cb473` |
| 206 | 22:16:13.568 -> 22:16:13.971 | 0 | `240d39bcc4b43130fa0365b6ca1be3ca2872f66faddcae0dbdcf1585abcd406e` |

start JSON 的全部字段与 final 回执同名字段相等，`recovery.json.receipts` 与两份 final 回执全对象相等。sourceMd 匹配 before，tool 匹配当前 layout.py，六个 outputs 匹配上表，audit 匹配 current。两份实际 stdout 哈希已重测并匹配回执，内容分别为 24/24、20/20 通过；stderr 均实测 0 bytes。不是从 audit 推断进程退出码。

| Bound Input / Tool | Measured SHA-256 |
| --- | --- |
| `D/inputs.json` | `fc3a25d3755e6bbb2220788adf36c283d7c7c6c6c18b23c7819cf95b534abdb0` |
| `D/recovery.json` | `976b2e11ae479f99e3bfb7828719f1e44aac41a9e8c6bd78b6f4d7c2f99b9ef6` |
| `W/.claude/skills/ld-s10y-lesson/tools/layout.py` | `c1bbc020c51e82f02ffb74ece09b44533ecdd3ee33b8e64ea8707497fb4c38a4` |
| `W/ssot-resources/soviet10year-textbooks/artifacts/7a/evidence/resume182-7-source203-209/source203-209-review.md` | `6283e43d61747abbac459ce1f4208c67b0bc4a1dea66d30c039432970ab47864` |

原 FIRST 与 WRAP 回执/streams 仍在 `W/.intentfold/tickets/STEMROBIN-182/tmp/resume182-7/`，本人核对了实际 exit 和保存字节绑定，未覆盖旧失败：

| Retained Receipt | Actual Exit | SHA-256 |
| --- | --- | --- |
| `p0205.first.receipt.json` | 1 | `5e310d6ffd5653b0cb3d8d2b1252871890c759a3d36919fa42e04bf1bd94dfbb` |
| `p0206.first.receipt.json` | 1 | `54336ba4997e8e630104f4de2c8e06877273d1a5b4734455377e1045b01c48eb` |
| `p0205.wrap-affected.json` | 1 | `11a7714c5071ca8953125ebe7de5e5733b95eab4b59a260e5926470b35ee22dc` |
| `p0206.wrap-affected.json` | 1 | `64c32b71cb40afcdbe4c01c213f0f724d4154cda81d0687189bba26fa63cb7bc` |

## Mechanism And Evidence Limits

使用既有独立源审的 205/206 行 inventory（该报告第228-309行），不重看图、不重新诊断：205 的多余 band 是并排方程组居中的标签/括号，206 的多余 band 是同一分式行的分母投影。该源审给出实际 24/20 且没有缺题面行。

窄读当前 layout.py：保留 `_fraction_baselines` 及相关多分式基线逻辑；新增 `_offset_system_label_band` 在计行输出中过滤已有方程组中间标签 band；`_fraction_across_split` 的线厚上限按指定修复由 0.2 放宽至 0.25 glyph_h，仍要求长横线、分子/分母支持并调用 `_single_fraction_row`。逻辑处理的是 counting-only copy，不改抽取像素或文本。旧 dirty hunks/test 历史保留以 `inputs.json.protectedPreexistingLayoutHunksAndTestPreserved=true` 为据；未凭空声称有可逐字节比较的旧工具快照。

父已实际运行六项 focused tests，以及既有 actual pixel counts 205=24、206=20、212=31、213=26、214=23，本次按 direct-user 授权及 inputs 记录引用；本人未重跑通过测试，也未打开 212/213/214。focused-test raw stream 文件=`null`；本次未得到单独保存的 pixel-run raw streams，亦记 `null`，不伪造输出路径。恢复 finalize 的 stdout/stderr 则确有保存并已核验，二者不可混淆。普通技术修复次数不是审批门槛；本裁决仅绑定当前两页恢复，不推广计行机制至全库。

## n31 Local Mathematical Decision

稳定块：p0205#3（h3）、#4（正文条件）、#5（恒等式）、#6（非负数集），分别对应 JSON `/blocks/2..5`。标题为 `31. 恒等式$(\sqrt{a})^2=a$（$a\geqslant0$）`；正文开句为 `根据算术平方根的定义，根式$\sqrt{a}$（$a>0$）的值是非负数，`，并继以平方等于 a、对任意非负 a 恒等成立。

独立短裁决：**更严格的 `$a>0$` 假设本身不是数学错误**，也未声称“只有正数才有算术平方根”。它给出的条件命题为真，但单靠正数条件句不能形式逻辑地推出零端点；零端点由定义直接补足：算术平方根是平方等于 a 的非负实数，a=0 时 `t>=0, t^2=0` 唯一给出 t=0，故 `sqrt(0)=0`，`(sqrt(0))^2=0`。标题/后文的非负条件与此一致。

所以此处属于没有单列零情形的叙述简省，不是已证实的假等式或错误定义域；无需强迫将 `$a>0$` 登记为 source erratum，也不建议更改忠实原文。此两块的数学疑义可局部判明为无确认勘误；不借此清除未审其他科学问题的 HOLD。不求解七道原题，不评价本课其他变形或完整课程。
