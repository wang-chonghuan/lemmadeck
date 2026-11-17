# Modern TEXT Author: Interaction B52

状态：`TEXT-author-incomplete / layout-failure / repair-budget-exhausted`。仅 `6p / phy6-c3-s8`；不是独立审查 pass，不可 finalize、retain 或 publish。

## Ownership

沿用 `/Users/yong/.codex/worktrees/0f12/lemmadeck` 和 ticket.json 记录的 `codex/STEMROBIN-180-textbooks`，未运行 Git。只写本记录及 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52`（OWN）。

已读项目入口、engineering、operations、product、lesson SKILL、edition-text-contract、profile、完整 canonical lesson.json/lesson.md/exercises.json，并通过 n-plane 实时读取 STEMROBIN-180。未运行 IntentFold capability 或 capsetup。现有 official prepare 三模板 COPYFILE_EXCL 精确复制到 OWN；没有重跑 prepare，未写 official 模板、原始层、持久 edition 或他人产物。

## Exact Templates

| 文件（全部位于 OWN 根） | 完整字节 SHA-256 |
|---|---|
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52/lesson.template.json` | `490657a72d9a5918abfe0dca8503123ba00dfc557ff5ec1c9b058f355d005ac7` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52/exercises.template.json` | `16858387129358ce40a213c114a3abcc49c470f1bc0aa9e023e623e02bf3d1eb` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52/figures.template.json` | `d0f6f731c83fde7f8fac6e0d79f123a867d1cc69c132038c71d6c13871954d0e` |

保留 15 blocks = 7 p + 4 fig + 4 cap；7 p 与 3 道原始问题全部改写。题号/source_number 1..3、`问题/g1`、pages、图引用与展示归属未改。模板内 source.data/source.sha256/source_text 未改；图模板与 official 字节一致。唯一公式 `$20$` 保留，numeric_changes 0，目标已登记 errata 0；源文没有数值单位，不添加单位或测量值。

## Source And Images

canonical 完整字节副本保存在 OWN/source-snapshots/；初始三模板在 OWN/supplied/。来源路径、三份 canonical 哈希和四张 PNG 哈希均在 OWN/intake.json；完整 TEXT 检查已核对输入未变。

原 PNG 位于 `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/`，fig-40/41/42/43 各打开一次，仅用于正文语义。batch/task/context 4/4/4，重开、裁图、现代图制作、parent image payload 均为 0。

- 图 40：一车、桌面、弯曲系住与伸直的弹簧片两幅状态，车相对于桌面原位置不变。
- 图 41：弹簧片接触第二辆相同小车，随后两车向相反方向分开；子图标记在现代正文用 a/b。
- 图 42：两船挨近、手接触推船，随后两船分开；没有速度值或运动箭头。
- 图 43：人离船时后脚接触船沿，随后人在岸上、船离开；没有速度值或运动箭头。

正文保留小车相对于桌面及彼此静止、子弹相对于枪静止、子弹/枪反向运动与反冲、推船时两船都运动、脚蹬船与反向离开，以及原书速度可能相差很多/差不多一样的例子。不添加质量、动量、合力、无外力或测量前提。源实验改为教材叙述，原题仍为描述和举例，不要求实际烧线、射击或跳船；没有填答案或生产图稿。

## Commands And Failure

OWN/commands/<stage>/ 保存实际 `argv.json`、`stdout.txt`、`stderr.txt`、`exit.json`。Python 均为 `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`，环境 `PYTHONDONTWRITEBYTECODE=1`。

| stage | 次数 | exit |
|---|---|---|
| intake | 1 | 0 |
| plane-verify / plane-list | 各 1 | 0 / 0 |
| ticket-read | 1 | 1 |
| plane-resolve / plane-item / ticket-read-repaired | 各 1 | 0 / 0 / 0 |
| normalize / prose-flow | 各 1 | 0 / 0 |
| text-katex（完整检查内） | 1 | 0 |
| text-layout（完整检查内） | 1 | 1 |
| text-check（完整 TEXT source/math/layout） | 1 | 1 |

入场机械失败：Plane paginate 返回连续两份 JSON，HTTP 均 200，JSON.parse 失败。只修复该解析一次，使用 `jq -s` 读取已保存 stdout，不重跑已成功的 verify/list。保守计入总修复 1/1，剩余 0；TEXT 修复与重跑均为 0。

正文规范化使用现有 normalize_lesson_layout/normalize_exercise_layout 各一次。section_breaks 复制唯一一次 prose_flow 的实际相邻锚点，解析位置 3、10。实际流为 12 paragraphs，其中 paragraph 6 仅含 `**`；prose blocks 4/7/13 的粗体闭合符被规范化拆到独立行，paragraph 5/6 的粗体跨实际段落边界。没有擅自第二次修复，也未改稳定技能。

完整检查的实际 Python argv 记录在 OWN/commands/text-check/argv.json。来源/身份/数字/数学、图题引用配对未报错，唯一 `$20$` 的真实 KaTeX 调用 exit 0；这些机械结果不代表科学独立复核或儿童可读性通过。最终布局子命令 exit 1，故完整 TEXT 检查 exit 1。报告见 OWN/text-check-report.json 和 OWN/layout-report.json。

## Reuse Boundary

最终失败三模板保存在 OWN/commands/text-check/failed-snapshot/ 和 OWN/commands/text-layout/failed-snapshot/，哈希与上表一致；入场失败候选在 OWN/commands/ticket-read/failed-snapshot/。规范化前的完整作者稿在 OWN/commands/normalize/input-snapshot/；原始命令流全部保留。

小清单：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52/manifest.json`。已停止正文工作，剩余事项是受影响粗体排版修复及其布局检查，需要新的修复授权；不得重放已通过来源/数学检查。本轮没有 SOURCE gate、FIG production、独立审查、答案/键/选择题/交互、历史阶段、模型服务、finalize/retain/publish、DB、Git、app、依赖或 capsetup 操作。

## Sole Affected TEXT Repair

接续结果：`TEXT-author-layout-repaired / awaiting-independent-review`，不是自批、独立审查 pass 或发布许可。上文为冻结的首轮失败记录，保留其状态、哈希、命令、失败结论及原保守计数，不改写历史。

计数澄清：按当前 lesson 工作流和用户接续指令，只读入场 Plane JSON 解析修正不属于 TEXT/spec 修复；原“需要新的修复授权”不是工作流的人类审批门禁。接续前实际 TEXT 修复为 0，本次仅使用第 1 次且唯一一次受影响 TEXT 布局修复。入场原失败及修正调用完整保留。

只改 OWN/lesson.template.json 的 prose blocks 4/7/13：把每句粗体的闭合 `**` 移到同句句号前，消除独立闭合行及跨段配对；相同文字、标点、数字和公式未变。没有改写身份或来源快照，exercises/figures 两模板未编辑，稳定 normalizer、app、deps 未动。

使用已有 OWN/layout-check.cjs 的受影响模式，通过现有 `proseOutline` 取得实际新段落字符串。只从该次 stdout 复制 section_breaks[1] 的新 after；section_breaks[0] 和第二处 before 保持不变。随后仅检查修复布局/相邻锚点，用 `proseInline` 验证三个无公式的强调句生成完整 `<strong>`；没有调用数学渲染，没有重跑来源、KaTeX、数学、完整 TEXT 或成功的 normalize/prose_flow 命令。

| 本次实际命令 stage | 次数 | exit | 结果 |
|---|---|---|---|
| repair-outline | 1 | 0 | 现有解析器观察；新段落及相邻锚点候选，不是门禁 |
| text-layout-repair-1 | 1 | 0 | 唯一受影响布局复检；三句完整强调，11 段，锚点 3、9 |

实际 argv：

```text
["node",".tmp/ld-s10y-lesson/text-author-interaction-b52/layout-check.cjs","--repair-outline"]
["node",".tmp/ld-s10y-lesson/text-author-interaction-b52/layout-check.cjs","--affected-repair"]
```

两个调用由已有 record.mjs 捕获，实际 cwd、argv、stdout、stderr、exit 及输入三模板在 OWN/commands/repair-outline/ 与 OWN/commands/text-layout-repair-1/。现有 OWN/layout-report.json 保留原 `status: fail` 和 errors，仅追加 `affected_layout_repair` 的实际结果；原 full-TEXT fail 报告未改。manifest.json 仅追加同名接续字段，原失败候选清单与原哈希不覆盖。

| 当前文件 | 完整字节 SHA-256 |
|---|---|
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52/lesson.template.json` | `84e05fe8d24715ce569822e148f9fd526cd5778a93e762a577de0730ff7c573b` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52/exercises.template.json` | `16858387129358ce40a213c114a3abcc49c470f1bc0aa9e023e623e02bf3d1eb` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52/figures.template.json` | `d0f6f731c83fde7f8fac6e0d79f123a867d1cc69c132038c71d6c13871954d0e` |

原最终失败三模板的 lesson 哈希仍为 `490657a72d9a5918abfe0dca8503123ba00dfc557ff5ec1c9b058f355d005ac7`，两个最终 failed-snapshot 均完整保留；入场失败快照也未动。修复检查只做局部编辑范围及失败候选字节保全核对，不重启来源/身份或数学门禁。

实际 TEXT 修复累计 1/1，受影响块 3，锚点更新 1，受影响布局复检 1；只读入场解析修正另计 1。初始 normalize、prose_flow、full-TEXT、KaTeX 均仍各 1 次，已通过门禁 replay 0。本次图片读取/重开、FIG 工作、DB、Git、app、依赖、SOURCE 门禁、模型服务、finalize/retain/publish 均为 0；总图片仍 4、parent payload 0。正文修复工作已停止，只等待独立 TEXT 审查。
