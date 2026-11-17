# Modern TEXT Author: Inertia B52

状态：`TEXT-author-complete / awaiting-sole-independent-review`。仅 `6p / phy6-c3-s6`（20. 惯性）；不是独立审查、现代图验收或最终交付。

## Ownership

- Checkout：`/Users/yong/.codex/worktrees/0f12/lemmadeck`；沿用 ticket.json 记录的 `codex/STEMROBIN-180-textbooks`，未执行 Git 操作。
- OWN：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertia-b52`。
- 仅复制已有 official adapt-prepare 的三份模板到 OWN；没有重跑 prepare，没有写回 official 模板、原始层或 edition。
- 读取入口、engineering、operations、lesson SKILL、edition-text-contract、profile、完整 canonical lesson.json/lesson.md/exercises.json；通过 n-plane 读取 live STEMROBIN-180。未运行 capsetup。

## Exact Templates

以下三份是待审作者稿，SHA-256 为完整文件字节哈希。

| OWN 文件 | SHA-256 |
|---|---|
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertia-b52/lesson.template.json` | `07e3c5069b4bf0c9c59ed105c45cbbba6f5bea220734a7b67352ee6f2a371986` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertia-b52/exercises.template.json` | `cb7a9cdd57527063dda93efbce917f3656dc284f7523973a03e7ad483e2df8db` |
| `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertia-b52/figures.template.json` | `86ff4a5b8b41cec5e56a7cfacaaad561fc1433f29fb241f381394675af3be44d` |

保留 13 blocks = 8 p + 3 fig + 2 cap；8 个 p 全部改写，5 道原始问题全部改写。题号/source_number 为 1..5，栏目 `问题 / g1`、pages、引用、展示图均不变。公式 0，numeric_changes 0，registered target errata 0。规范化后的真实正文为 17 paragraphs；section_breaks 从 prose_flow 实际输出复制，解析位置为 6、10、15，不以块号猜测。

## Source And Images

canonical 文件的完整字节副本在 OWN/source-snapshots/；模板内 source.data/source.sha256/source_text 均未改。

| canonical 文件 | SHA-256 |
|---|---|
| lesson.json | `6d44c56b0f401bbf4431c03b8aca571ef0c0a320bfd0c42a4dd38f3422c15a37` |
| lesson.md | `4d88a542630164e6cb5f272a57a0925f1691f75a326783d0bf78f752dfb4d4b8` |
| exercises.json | `d8a171dbfdf36f71f3c628b3feabf9320d032494c670bcb43b0d2b4a1fe64bf8` |

原始 PNG 均在 `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/`，各打开一次；batch/task/context 共 3 images，重开/裁图/现代图/家长接收图像载荷均为 0。

| PNG | SHA-256 | 仅文本作者观察 |
|---|---|---|
| fig-35.png | `a9e7465c3cd393af1b224bf173c3ce19bef2771c21a1f29de4064d3f9154dc6b` | 一人手抓立柱，带箭头的环形路径；无测量值。保留转向示例，不改为自由绕柱运动。 |
| fig-36.png | `bc3bddce39ec88654aab432a861064fd96d919f2363c8d8d156d8eddd143a4d1` | 三幅竖排斜板/小车/桌面对比，原标 а/б/в；无数值距离。现代正文对应 a/b/c，保留堆沙、摊平、扫净与停止前距离递增。 |
| tbl-p0057-01.png | `8f52380c650cbc884441fc25a040a263e9ec7d7ede1634966edb7a7336487d8e` | 无图内文字的历史人物肖像。按完整源文绑定伽利略身份，不生产或评审肖像。 |

完整初始 copy 路径/哈希见 OWN/intake.json；文本检查同时确认 official 三模板、canonical 三文件、原 PNG 三文件与 intake 哈希一致。

## Text Decisions

- 保留静止球、球/脚作用、子弹/木板、滚动球摩擦、墙/手转向、抓柱转向全部例子；不保留“球只有撞墙或手才会转向”这种过窄措辞。
- 小车条件保留同一车、同一斜板起始高度、桌面和三种沙面；只写源文已有的停止及距离关系，不添加测量值、重复实验数据或新实验结果。
- 根据完整 p0056#6 + p0057#1 区分“扫净沙子”和“不受其他物体作用”的理想条件；第 4 题补明后者并保持原题讨论已运动物体。不植入合力、受力平衡、参考系、质量比较或实验新任务。
- 保留惯性定义、发动机关闭/冰球/枪膛后继续运动、两次碰撞之间的气体分子例子；用前文已有阻碍作用区分继续运动与速度恒定。
- 科学史人物、国别与源文数值保留，填写 source-bound historical_entities。`1564—1624` 仍是原书快照数值；本阶段没有史实校订，也没有把机械检查当作该日期的史实认证。

## Commands And Repair

工作目录均为上述 checkout；Python 均使用 `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`、`-B` 和 `PYTHONDONTWRITEBYTECODE=1`。

在 OWN/commands/ 的每个成功执行目录保存实际 `argv.json`、`stdout.txt`、`stderr.txt`、`exit.json`，由 OWN/record.mjs 在执行时捕获，不以转述替代原始输出。

| stage | 次数 | exit | 内容 |
|---|---|---|---|
| intake | 1 | 0 | COPYFILE_EXCL 精确复制三模板及 canonical 文本快照；初始路径/哈希。 |
| ticket-read | 1 corrected invocation | 0 | n-plane live 读取 STEMROBIN-180，无写操作。 |
| normalize | 1 | 0 | 现有 edition.normalize_lesson_layout 与 normalize_exercise_layout 各一次；仅写 OWN 文本模板。 |
| prose-flow | 1 | 0 | 现有 prose_flow.mjs 的完整最终段落与候选相邻锚点。 |
| text-check | 1 | 0 | 完整 TEXT source/math/layout focused check，报告 OWN/text-check-report.json。 |
| text-layout | 1，text-check 内部 | 0 | 同一 htmlfrag.js 检查实际锚点唯一相邻、图题配对；不是第二轮 review 或 FIG gate。 |

完整检查的实际 argv：

```text
["/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python","-B",".tmp/ld-s10y-lesson/text-author-inertia-b52/text-check.py"]
```

检查输入保存于 OWN/commands/text-check/input-snapshot/，与以上最终三模板哈希对应。该检查没有失败，因此不存在/不伪造 failed-snapshot；record.mjs 在非零退出时会保留该次 failed-snapshot。公式与数学分隔符/原数值签名检查通过；源文及现代文公式均为 0，KaTeX 子进程未调用，不宣称跑过零公式之外的渲染门禁。

TEXT 修复 0、TEXT 重跑 0。入场 live-ticket 读取时 jq 把分页对象误当数组，HTTP 两次均为 200，命令 exit 5；只修正只读 `.results[]?` 选择器一次。原始 tool-call/观察到的 stdout/stderr 在 OWN/commands/ticket-read-failed/，不伪称有事后重建的底层 argv。保守计入总修复预算：1/1 已用，剩余 0；没有重跑任何已通过门禁。

## Next Boundary

只等待唯一独立 TEXT reviewer，复用本次三模板、检查输入和原始命令证据。没有做 source gate/review、答案/键/选择题、历史阶段、模型生成、FIG 生产、finalize/retain、DB、Git、app、依赖安装或 capsetup；没有修改其他会话产物。模板仍为 draft，不可把本记录作为独立审查 pass 或发布许可。
