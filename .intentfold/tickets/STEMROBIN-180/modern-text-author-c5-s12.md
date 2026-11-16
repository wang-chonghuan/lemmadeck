# phy6-c5-s12 modern TEXT author freeze

作者交接，不是独立TEXT审查或完整现代课批准。仅本课§79《动能》，2026-11-16。

## Frozen paths and hashes

Workspace `/Users/yong/.codex/worktrees/0f12/lemmadeck`。独立根 `.tmp/ld-s10y-lesson/text-author-c5-s12`；候选目录 `adapt/6p/modern-us-neutral/lessons/phy6-c5-s12`，以下路径均相对独立根：

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `author-handoff.json` | 9411 | `fd7629b936925b99ddb94340bc426ebbd194e36491f391e2b276ef50c3aebd54` |
| `frozen-manifest.json` | 14032 | `8c1516a29d750879babe2581225349b72f1573aa14527a46a061effdd53280f4` |
| `adapt/6p/modern-us-neutral/lessons/phy6-c5-s12/lesson.template.json` | 9406 | `11c180dd9bfdfc274cc00d1f6e5073924a8ebb94e6d3b7539d6f73ae35c547ee` |
| `adapt/6p/modern-us-neutral/lessons/phy6-c5-s12/exercises.template.json` | 5584 | `dcccedcf0ee16475fc56be112b57008d0bcff0597a5dfc059bd2417617e3837a` |
| `adapt/6p/modern-us-neutral/lessons/phy6-c5-s12/figures.template.json` | 150 | `4044a4b75588730b95ed32e843cef08ea20904d1f42c01bebc1a3d5c4e79463f` |

`author-context.json` SHA `1aa0fd6d371140140b1b5f5116f51973abae0733047846b95d5aeee6202c013d`；完整可读正文/五题 `author-context.md` SHA `498329b1857a05c5c50372b1339d90fb1a46b0db4e15a9afb0c85d05d64f06b4`；输入绑定 `input-bindings.json` SHA `d0e90168b5908793858e5c79160bbd72dd8fab859e1a1c95b0b001f770983a98`。31份非循环本地文件绑定；freeze外层退出后生成的三个记录不伪装已在manifest内：

- `evidence/freeze-1.call.json`: `5c480c6b8a28c8a16109711be3f42110ddebb6b46b5d23632650ac96fb909976`
- `evidence/freeze-1.stdout`: `cc6ad7f51512d9fcfbeb74ec50b1c2152513e4433e1ad1c5340855d4d376ab19`
- `evidence/freeze-1.stderr`: 空，`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

## Complete source and boundaries

已完整读取canonical `artifacts/6p/lessons/phy6-c5-s12/{lesson.json,lesson.md,exercises.json}`及main现有三模板；全部快照复制在本根，原文件未改。

- raw lesson SHA `2b6f7b2f16aa85cf9ed4a0cfb12cd46ff4b6be06c325973821c41d046826d276`
- raw lesson.md SHA `f69211b963796a84657fabc55ca83ee98c000ced1f52fa89d30df12971abfd26`
- raw exercises SHA `d76e1a39ba802b8f7f48a43e30687d3ee192c464f135cb7b517c282e4a34b289`

全部7来源块 `p0208#9..#13,p0209#1,#2`；5原任务 `g1/1..5,p0209#4..#8`。原课身份、栏目、题号、来源引用、所有数字序列、原公式字节 `$B$` 后 `$A$`、完整嵌入raw快照不变。0 owned图及五题空figure refs/display清单不变。

实际完整打开 `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-200.png`，340x234，2660 bytes，SHA `d0f714a7674c1bd89c97e94baea0c77dcfcec5651d7556454904b2a2d5b8ce5d`。看到上方球A、下降到水平段的衔接槽、木圆柱B及运动/位移示意；没有印刷刻度或数据，不从右端圆孔形轮廓猜新球或读数。来源归前课 `phy6-c5-s10/p0206#3`，本课 `p0208#11` 的图200引用必需且完整保留。只做原PNG语义观察；不重跑源图审查，不创建/批准现代图，不声明完整跨课图依赖已闭合。

## Declared author changes

`author-notes.json`逐块逐题列出所有理由：

1. 定义补明参照物；保留原动能知识强调，不增计算公式。
2. 水推动水轮机做功改为动能传递表达，保留风例，不宣称能量消失。
3. 图200原槽、B、A、高度/速度/推移距离/功实验完整保留；明确同球由静止释放，同槽/圆柱/摩擦等条件。
4. 不同质量实验保留，比较时固定到达速度、可比球形状/尺寸/滚动方式和相同装置/摩擦条件，无编造观察数据。
5. 质量和速度影响分别固定另一变量，原单调结论仍强调；打印`****`连接归一为完整结论强调，中文标点置于强调外以免官方分行拆裂。
6. 区分参照物与势能零点，保留原相对地球飞机两种机械能例，明确地面零点之上；源泛称限定为不是任意物体在任意约定下都必有非零机械能。原文快照仍原样完整。
7. 动能/势能及后续电能/化学能全部保留，规范文句。

五题均保持原目的；q2补参照物，q4分别固定另一量，q5补相对地球及地面势能零点；没有题面解答、新题、数值数据或新小问。无需文化/历史例外，`historical_entities=[]`；`numeric_changes=[]`、`errata=[]`，没有math-correction。

canonical normalization一次后7来源块形成9实际短段。CLI输出逐字复制两个相邻 `{before,after}` anchors，实际边界索引2、6；不是手算段数。两侧完整文本存于候选、context、机械报告。

## Commands and evidence

共享Python，全部执行时 `PYTHONDONTWRITEBYTECODE=1` 且 `-B`。`P=/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`，`W=.tmp/ld-s10y-lesson/text-author-c5-s12`，cwd均为上述workspace。

```sh
env PYTHONDONTWRITEBYTECODE=1 "$P" -B "$W/run-recorded.py" compose-1 "$P" -B "$W/text-author.py" compose
env PYTHONDONTWRITEBYTECODE=1 "$P" -B "$W/run-recorded.py" normalize-1 "$P" -B "$W/text-author.py" normalize
env PYTHONDONTWRITEBYTECODE=1 "$P" -B "$W/run-recorded.py" prose-flow-1 node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs "$W/adapt/6p/modern-us-neutral/lessons/phy6-c5-s12/lesson.template.json"
env PYTHONDONTWRITEBYTECODE=1 "$P" -B "$W/run-recorded.py" text-mechanics-1 "$P" -B "$W/text-author.py" check
env PYTHONDONTWRITEBYTECODE=1 "$P" -B "$W/run-recorded.py" freeze-1 "$P" -B "$W/text-author.py" freeze
```

全部exit0，各原argv/UTC/stream hash存 `evidence/*.call.json`，除freeze外层三文件外均由manifest绑定。准备仅一次mkdir和5次`cp -n`：默认三模板分别复制到prepared-snapshot及候选；canonical三raw文件复制到raw-snapshot；原200复制到originals；复用自己s9的两个runner代码并仅在新根用apply_patch改为本课。未读取s9答案数据。main existing-file prepare guard exit1由main保留；作者prepare0，未获取/编造main该guard的路径或hash。前段freshroot发现用`rg --files`exit2仅因根未存在，不是机械/候选FAIL，原streams无可用记录如实注明。

唯一一次完整TEXT mechanics PASS/exit0：7+5=12单元，9短段、2真实anchor、2数学span；0 errors、0 warnings；repair0/1，无候选首次FAIL。`text-only-mechanics.json` SHA `9b434767b474bfdf9d61491d35e330a339b394b85c68d54cf32567c13ec5d31c`。使用现有 `edition` source/identity/text/numeric/layout/figure-ref/prose-flow APIs及 `mathcheck` delimiter/KaTeX，不调用完整lesson finalize/现代图门禁。

工具调用时全部当前字节绑定在normalization及mechanics的toolsAtStart/toolsAtEnd/handoff；不宣称历史prepatch SHA，不重测main已完KaTeX修复，无稳定工具修改。

## Remaining boundary

待非作者独立完整TEXT审查及main后续完整图依赖/official adapt-finalize。本作者没有self approval、retain/promote、finalize、diagram/model/service/browser/DB/Git/install/env/app/tool writes。单独授权的五原题推导在另一独立根进行，不会混入本冻结或发给图作者。
