# STEMROBIN-192 — 验收检查计划

验收标准的权威在后端工单；本文件只是怎么跑、看什么算过。
全部命令在 worktree `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-192` 里执行。

## AC1 一条命令做成一课并入库，只在三处介入

**怎么查** 对 `math3-c1-ex5`（3m，印刷页 40–42 = PDF 44–46）跑新路径：

```bash
P=.claude/skills/ld-s10y-lesson/.venv/bin/python
$P .claude/skills/pages2lesson/tools/p2l.py run --book 3m --lesson math3-c1-ex5
```

反复调用同一条命令直到它报 `done`；中间只允许三类人/模型动作：
写 `pages/<page>/page.md`、写 edition 的 `lesson/exercises` 模板、写插图的 FigureSpec。

**算过** 全程只出现这三类介入（驱动自己打印 gate 名，报告里逐条记下）；
`p2l.py` 最后一次调用输出 `done` 且 `sr_lessons` 里出现 `math3-c1-ex5` 一行，
`edition = modern-us-neutral`，题数与 `exercises.json` 一致。
读回用 `tmp/db-baseline.json` 同一支脚本。

## AC2 该次生产会话 ≤ 500 万 token、≤ 60 turns

**怎么查** 生产跑在一个**独立会话**里（见 grill Q1），对那个会话的 transcript 读表：

```bash
python3 .claude/skills/ld-s10y-lesson/tools/meter.py read \
  --repo . --transcript <那个会话的 jsonl> --budget 5000000
```

**算过** 退出码 0（未超预算），且打印的 turns ≤ 60。读数连同会话 id 抄进 handoff。

## AC3 任何一次校验失败，一次调用报出全部不通过项

**怎么查** 构造多类同时存在的失败，一次调用看是否全报：

1. `edition.py`：在 edition 模板里同时制造「来源绑定不一致」+「仍含西里尔字母」+
   「图缺 review 证据」，跑一次 `adapt-finalize`，数报出的类别数。
2. `validate_spec.py`：一张 spec 同时制造 schema、display、assertion 三类错误，跑一次。
3. 驱动：两张图各坏一处，跑一次 `p2l.py`，看报告里是否两张都在。
4. 回归：对照改造前的行为（`git stash` 或主 checkout）同样的坏输入只报第一类。

**算过** 每一项里**改造后一次调用报出全部类别**，且第 4 项确认改造前确实只报第一类。
用 `tmp/all-errors-*.json` 留证。

## AC4 标签布局不再因碰撞失败，失败时报出试过什么

**怎么查**
1. 取一张本课实际渲出的图，`render_spec.mjs` 的报告里 `collisions` 为空且
   `layout.resolution` 记下解出来的方位 / gap 系数 / 边距。
2. 构造一张**标签必然互撞**的 spec（多个点挤在一处、都带长标签），跑一次：
   渲染器自己解开（`collisions` 空），或失败且报告里 `layout.attempts` 列出
   试过的边距与每个标签每个方位的得分。
3. 回归：同一张「指定了 position、没写 fallback、该位置撞」的 spec，改造前失败、改造后通过。

**算过** 1、2、3 全部如上；且 `displayChecks` 在接受的布局下仍全绿（`minTextPx ≥ 16`）。

## AC5 末页没被下一课标题收口时会警告

**怎么查**
1. 现状复现：在**只有 PDF 44** 的状态下（改造前的仓库状态）跑一次新检查，
   它必须把 `math3-c1-ex5` 报成 `unclosed_card`。
2. 补齐 PDF 45–46 之后再跑，`unclosed_card` 消失，`math3-c2` 因为是下一张未抽的卡而被报。
3. 驱动对本次交付的卡把 `unclosed_card` 当硬失败：带着它不允许进 P4 入库。

**算过** 1 报出、2 消失、3 拦住（人为保留末页缺口时 `p2l.py` 非零退出且不写库）。

## AC6 已发布四课的条目数、版次与插图数量不变

**怎么查** 入库前后各跑一次基线脚本并比对：

```bash
cd app && node ../.intentfold/tickets/STEMROBIN-192/tmp/baseline.mjs
```

并对 `ssot-resources/soviet10year-textbooks/artifacts/3m/` 做 `git diff --stat`，
确认 `editions/.../math3-c1-{ex1,s2,s3,s4}/` 与 `lessons/math3-c1-{ex1,s2,s3,s4}/` 零改动。

**算过** 四课的 `exercise_items`、`edition`、`svg_tags`、`img_tags` 与
`tmp/db-baseline.json` 逐字段相等；上述目录 `git diff` 为空。

## 机械防线（charter engineering.md `## Tools`，交付前跑一次）

```bash
python3 ssot-resources/audit.py
python3 ssot-resources/soviet10year-textbooks/validate.py
node --test .agents/skills/lib/content-db.test.mjs
cd app && npm run test && npm run build
```

另外跑两套被改动工具自己的测试：
`.claude/skills/ld-s10y-lesson/tests/` 与 `.agents/skills/ld-s10y-image/tests/`。
