# phy6-c3-s7 现代正文作者交付

状态：作者完成，待独立 TEXT 复核。仅本课，沿用现有工作树与工单；未运行 Git 或新 capability setup。

## 三份模板

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertialife-b52/lesson.template.json`
  SHA-256 `a38b813cf511607500a0996e2c5916e51cdb1e0f29f75f3902dc70a7b6755087`；8920 bytes。
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertialife-b52/exercises.template.json`
  SHA-256 `fcce37f6b3bf0a16020edfb00be2c64aa1f91ce01e74021e175dbc9294667cea`；8706 bytes。
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertialife-b52/figures.template.json`
  SHA-256 `6110e97c32e4a69048e3e96b3630af95042ac3f3f4a18d5f00198ec42b6ae1cd`；1609 bytes；与官方准备模板字节一致。

官方 prepare 已存在，本次未重跑；只复制三份模板，所有手工编辑使用 apply_patch。原始产物、source.data、source_text、来源绑定、题号、分组和图引用保持不变。

## 数量与文本

5 个源块，其中 3 个正文块已改写，另 1 个正文图块、1 个图题块不变；规范化后 5 个实际短段落。6 道原始题全部改写，保持“问题”2 题和“练习 9”4 题。3 张图，正文展示 1 张、习题展示 2 张；2 个公式数值、2 处 section_breaks。

保留奔跑减速、汽车或火车从静止开动、脚与地板的摩擦、身体保持原有状态与相对于车的倾倒方向；完整解释自由滑行距离的起止，并保留柏油路、关闭发动机且不制动、`$50$` 千米/小时与 `$335$` 米这一特定例子。车轮停止转动与仍在地面滑动区分表达，不写成所有车固定滑行距离或必然抱死。锤把下端敲木板、敲刨刀与敲刨身两种动作说清，原题要求仍是解释；未补答案或编造实验结果。

## 实图读取

原图各查看一次，无裁图、重开或现代图制作；任务图片 3/8，本上下文 3/24，向父任务交付图片 0。

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-37.png`
  SHA-256 `27aa495ef396e3d6b3540e67773812059fa91ab0595e5c60f4f1105ae4930e68`。
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-38.png`
  SHA-256 `8e33d96f13edb5ddf5d646106399acd3c0daf7afe9ae5a45a7544576669472a9`。
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-39.png`
  SHA-256 `5780f90c3e158b7adc271f521f396a1cb782542aa23290adf29fdc44393798e4`。

## 命令原始证据

证据根目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertialife-b52/evidence`

每项含实际 `argv`、`cwd`、`env` 的 `command.json`，及原样 `stdout.txt`、`stderr.txt`、`exit.txt`，不是只保存摘要。所有下列退出码为 0：

- `00-copy`：`cp -n`，三个官方模板的完整绝对路径及专属目标路径见 command.json。
- `01-normalize`：指定 Python `-B` 运行本目录 `normalize-text.py`；仅调用现有 `edition.normalize_lesson_layout` 和 `edition.normalize_exercise_layout` 各一次，保存 normalized-state.json。
- `02-prose-flow`：`node /Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertialife-b52/lesson.template.json`。两处锚点直接复制 stdout 中的相邻 `{before, after}`。
- `03-text-check`：指定 Python `-B` 运行本目录 `check-text.py`；21 个文本机械单元首次通过。包括当前原始 JSON 快照绑定、元数据、全块/全题 source_text、数字及公式签名、字符与标点、题干 lines、小问排版、图引用身份和已规范化文本与锚点的证据绑定；不调用 source-page/assembly 或 FIG 门禁。
- `03-text-check/katex`：原生 `node /Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/katex_check.js`；额外保存实际 stdin.json，两处数学表达均通过。
- `04-hash-inventory`：`shasum -a 256` 保存三份最终模板及三张实际原图哈希，不是重跑门禁。

Python 均为 `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B`，环境 `PYTHONDONTWRITEBYTECODE=1`。

总修复额度 1，本次使用 0；无成功门禁重跑。没有失败的 TEXT 命令，因此没有虚构 failed snapshot。run-command.py 已实现非零退出时保存当时全部三份模板到该命令的 failed-snapshot/，供真正失败时复用。

## 独立复核入口

小清单：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertialife-b52/manifest.json`。
机械结果：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertialife-b52/text-check.json`。
作者事实与图片观察：`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-inertialife-b52/brief.md`。

独立审核仍需判断源文保真、条件/动作完整与儿童可读性；已有成功机械证据直接复用。未声称独立 TEXT 或 FIG 审核通过。只写本专属目录和本工单文件，不触碰他人产物；未做答案/键/选择题/交互/历史、FIG 生产、模型服务、finalize、retain、数据库、Git、应用、依赖或新能力初始化。
