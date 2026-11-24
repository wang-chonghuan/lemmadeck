# plan — STEMROBIN-190

## 读代码读到的、工单里没说的

- `production-resume.md` 是**共享 SOP**:开头自称 "the binding delivery sequence for the lesson,
  image, choice and answer skills"。改它会同时影响 `ld-s10y-image`、`ld-s10y-choice`、
  `ld-s10y-answer` 三个技能的工人。grill Q2 已定:**四个技能的 SKILL.md 一起瘦身。**
- 实测:两条废止规则的原文**只出现在 `production-resume.md` 一处**,另外三个技能里没有。
  对那三个来说这次是纯瘦身。
- 实测:`.venv` 是 git-ignored,新 worktree 里没有;系统 `python3` 是 3.13.13。新工具只用标准库,
  命令用 `python3`。
- 现在**没有任何工具写 meter**。`production.py` 只有 `prepare-range` / `read-json` /
  `read-receipt` 三个子命令。`production-meter.json` 全程由 agent 手写 JSON,这就是它能长到
  2.0MB、单字段 781,244 字符的原因 —— 没有任何东西限制它。
- `production.py` 已有一套可复用的校验风格:`validate_workspace` / `validate_book` /
  `validate_output_owner` / `validate_lesson_owner`,全部 raise ValueError。新检查器沿用它。
- 既有自测:`test_production.py`、`test_recovery.py`、`test_throughput.py`,都是 stdlib unittest
  风格,直接 `python -m` 跑。新工具的测试放同一处。
- 在飞的 6 个工单(180/181/182/184/187/188)`stage` 都是 `developing`,各自带旧格式状态文件
  (181 的 `production-meter.json` 2.0MB、184 的 `plan.md` 1.2MB、`usage.json` 3.3MB)。
  grill Q1 已定:**新 schema 只对新工单生效**,这 6 个按原样停住,不转换、不续跑、不改动。
- 实测反例:Claude Code 的 project 目录 `-Users-yong-work-lemmadeck-ws-lemmadeck` 与记录里的
  cwd `/Users/yong/work/stemrobin-ws/stemrobin` **不一致**(目录改过名)。所以计量工具按 cwd
  推导转写路径时,命中不唯一或对不上就必须失败,不能猜。
- 转写记录里可能含密钥:会话 jsonl 里有工具输出。计量工具只能取数值聚合,绝不把转写内容、
  绝对路径或任何片段写进仓库 —— 对应 `operations.md` 红线 4。

## 红线查对(route,写码前)

| 条目 | 本 route 是否触及 |
|---|---|
| engineering 5 新增/变更依赖 | 不触及,新工具只用 Python 标准库 |
| engineering 11 产品资源越界 | 不触及,只写 `.claude/skills/ld-s10y-lesson/` 与本工单目录 |
| engineering 6 手改生成文件 | 不触及 |
| engineering 1 提交凭据 | 计量工具只写数值聚合,不写转写内容与绝对路径 |
| operations 4 密钥写进脚本/工单产物 | 同上,这是工具的硬约束而非注意事项 |
| ui.md 全部 | 不触及 UI |
| product.md 1 改 product.md | 不触及 |

无"禁止"命中,无需人批准的条目命中。route 可行。

## 路线

### 切片 1 — checkpoint schema 与上限检查器

新 `tools/checkpoint.py`,`production-checkpoint@2`:

```
{ "schema", "book", "updated",
  "lessons":  [ {lesson, stage, session, commit, tokens, note} ... ],
  "sessions": [ {session, started, ended, turns, input, cached, output, total, peakContext} ... ] }
```

硬约束,全部由 `checkpoint.py check` 判定并以非零退出失败:

- 顶层键集合固定;`lessons` / `sessions` 之外不得出现对象或数组
- 任一字符串字段 ≤ 200 字符(`note` 同)
- 行内键集合固定,出现未知键即失败
- 整文件 ≤ 256 KB
- `lessons[].stage` 取值闭集:`prepared|authored|retained|pushed|published|held`

子命令:`init` / `set-lesson` / `record-session` / `check`。写入前后各跑一次自检,越界直接
失败且不落盘,不截断、不静默通过。

### 切片 2 — token 计量

新 `tools/meter.py`,`production.py` 不扩成巨无霸:

```
meter.py read   --transcript <path>              # 只读聚合,打印 JSON
meter.py record --repo . --ticket <id> [--transcript <path>] [--budget <n>]
```

- 支持 Claude Code(`~/.claude/projects/<cwd-slug>/<session>.jsonl`,`message.usage` 取
  `input_tokens` / `cache_read_input_tokens` / `cache_creation_input_tokens` / `output_tokens`)
  与 Codex(`~/.codex/sessions/**/rollout-*.jsonl`,取 `total_token_usage` 末值)两种转写
- 不给 `--transcript` 时按 cwd 推导目录并取最新一份;**命中不唯一即失败**,不猜
- 输出 `turns`、`peakContext`、四个 token 数;`record` 把它写进 checkpoint 的 `sessions`
- `--budget` 超限则非零退出并打印越界量;默认预算 8,000,000(依据:一课真实内容
  25–50 万 token,一课一 session 约 30 轮、均值 10 万上下文 ≈ 300 万,8M 留 2.5 倍余量)
- 只取数字。不读、不复制、不打印转写正文

### 切片 3 — 重写 `references/production-resume.md`

整体重写,不保留历史变更记录与迁移注记。新内容:

1. 交付单位是一课,**session 边界 == 课边界**
2. 顺序:备料 → 作者/复核 → 保留 → commit → push → 入库 → 读回 → 写计量 → **结束本 session**
3. 明写:不在本 session 内开始下一课
4. 接续只读 `checkpoint.json`,它是唯一的续跑输入
5. 生产工人使用 20 万上下文的模型
6. 失败与停止边界(保留,这部分是真规则)
7. 删除:`continue the next authorized lesson without waiting`、
   `context compression is not a completion condition`

### 切片 4 — 瘦身四个技能的 `SKILL.md`(grill Q2)

| 文件 | 现状 |
|---|---|
| `.claude/skills/ld-s10y-lesson/SKILL.md` | 39,079B / 574 行 / 68 行含禁令 |
| `.claude/skills/ld-s10y-answer/SKILL.md` | 14,709B / 277 行 / 11 行含禁令 |
| `.agents/skills/ld-s10y-image/SKILL.md` | 13,894B / 260 行 / 14 行含禁令 |
| `.agents/skills/ld-s10y-choice/SKILL.md` | 5,668B / 99 行 / 10 行含禁令 |

删掉因事故逐条追加、且已由确定性检查器覆盖的散文禁令;保留各 cap 的命令合同、
"模型认对象/机器管像素"的分工、对象级对账清单、以及 profile 强制的格式规则。
每删一条,在 `handoff.md` 里给出它现在由哪个检查器执行,或为何不再需要 —— 映射表放
handoff,不在技能文档里留墓碑。

### 切片 5 — 测试与防线

`tools/test_checkpoint.py`、`tools/test_meter.py`(stdlib unittest),覆盖:超长字段失败、
超体积失败、未知键失败、闭集外 stage 失败、两种转写格式聚合正确、转写命中不唯一时失败、
预算超限非零退出。然后跑项目机械防线。

### 切片 6 — 跑完一课离线生产验 AC1(grill Q3)

人要求 AC1 必须在一课完整离线生产之后验。优先选图全为确定性渲染、无需新付费生成的课,
把付费调用压到零。若唯一可行的课确实需要新的付费图像生成,**在发出调用前单独问人**,
不自行决定。跑完后再读 checkpoint 的 `sessions[-1]`。

## 落点

| 文件 | 动作 |
|---|---|
| `.claude/skills/ld-s10y-lesson/tools/checkpoint.py` | 新增 |
| `.claude/skills/ld-s10y-lesson/tools/meter.py` | 新增 |
| `.claude/skills/ld-s10y-lesson/tools/test_checkpoint.py` | 新增 |
| `.claude/skills/ld-s10y-lesson/tools/test_meter.py` | 新增 |
| `.claude/skills/ld-s10y-lesson/references/production-resume.md` | 整体重写 |
| `.claude/skills/ld-s10y-lesson/SKILL.md` | 瘦身 + 接入两个新工具 |
| `.claude/skills/ld-s10y-answer/SKILL.md` | 瘦身 |
| `.agents/skills/ld-s10y-image/SKILL.md` | 瘦身 |
| `.agents/skills/ld-s10y-choice/SKILL.md` | 瘦身 |

每个切片单独 commit。
