# phy6-c5-s12 source-only five-task author freeze

独立作者推导，不是现代最终答案键、独立批准或完整s12 ready。2026-11-16，scope仅§79《动能》五道原题。

## Exact frozen paths

Workspace `/Users/yong/.codex/worktrees/0f12/lemmadeck`；独立根 `.tmp/ld-s10y-answer/source-author-c5-s12`。以下文件路径相对本根：

| File | Bytes | SHA-256 |
| --- | ---: | --- |
| `author-handoff.json` | 2244 | `6b4ec513cfeb0b43428919a5ad5da71fd174a8d86375e81725f283a3f19391bc` |
| `frozen-manifest.json` | 5837 | `db69d36de0526d871709435ce8893167da34f5a131a47c3dc43b209a1c451143` |
| `source-only.json` | 16743 | `da8bf346b612dd1ec816fd7c289f39bebe7f99342fedadaa9319290a6502769c` |
| `input-bindings.json` | 12572 | `bad108cb57873f2e02336925a0238ea3c552a743cb424fb0ef8868a16b938caa` |
| `author-report.md` | 9079 | `b2dae45e4bf555077476212b1e557201689318ccd0e5e5b1d9b32ef9f5320d3e` |

11份非循环文件绑定，包括独立raw/PNG副本、手写solution-draft、冻结脚本、报告和ledger。外层call由执行退出后才生成，未伪装已在manifest内：

- `evidence/source-freeze-1.call.json` SHA `7187576fe74ea2e3fcd8f446b38b9e2c9735f817f32859e35de7be1c9f523543`
- stdout SHA `788163a449f8f36ee3bb387a055aa8bf7fc2038cf570250156df31b186144930`
- stderr空，SHA `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`

## Inputs and complete derivations

完整canonical raw `artifacts/6p/lessons/phy6-c5-s12/{lesson.json,lesson.md,exercises.json}`分别SHA：

- `2b6f7b2f16aa85cf9ed4a0cfb12cd46ff4b6be06c325973821c41d046826d276`
- `f69211b963796a84657fabc55ca83ee98c000ced1f52fa89d30df12971abfd26`
- `d76e1a39ba802b8f7f48a43e30687d3ee192c464f135cb7b517c282e4a34b289`

7原块/5原题完整保留并逐块逐题文本hash绑定；解答以canonical raw为独立求解依据，不以现代作者文本或main私有源解作依据。原任务身份 `g1/1..5`、来源 `p0209#4..#8`，无习题自有图；原题文本、group/source_number/pages/figure refs完整保存，不改源。

完整原图 `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-200.png` 已在同一s12任务实际打开；当前重新hash绑定仍为 `d0f714a7674c1bd89c97e94baea0c77dcfcec5651d7556454904b2a2d5b8ce5d`，340x234/2660 bytes。复用该作者实际完整观察：A在下降槽上方，衔接向右水平槽，B木圆柱及运动/位移示意，没有刻度/数值。图由前课s10拥有；此处只作源语义依据，不新增题图，不重跑源/图门禁，不批准现代图或跨课closure。

全部五份完整displayAnswer、reasoning、conditions、notes、原题/答案/notes文本hash存 `source-only.json`及完整`author-report.md`：

1. 动能定义、运动参照物、球A对B做功的具体理由。
2. 相对选定参照物静止/速度为零；区分平动与全宏观动能，以及势能零点/内能，不给绝对零动能断言。
3. 地面参照下水流、风、球、车的开放例子及共同条件，不把示例当唯一清单。
4. 同速比较质量、同质量比较速率；同球释放实验/不同质量同到达速度实验和可比装置、摩擦、滚动条件完整说明。不从源定性增长推速度正比，不编经验倍数。
5. 源相对地球的飞机同时有动能/重力势能，地面零点之上；换参照系与零点另说，不杜撰高度/速度/质量/能量数值。

精确计数：derived5，ungraded5，auto0，parts0，source tasks5，无漏/重题。定性/开放说理，不为了覆盖率强制数值键；没有增计算公式或捏造实验测量。

## Execution and limits

读取answer skill cap2/gate2语义合同，但此阶段不执行官方answer prepare/finalize/门禁。一次mkdir、3次`cp -n`复制canonical三raw、原200及自己的无解答数据runner；手写草稿用apply_patch，唯一source freeze命令：

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-answer/source-author-c5-s12/run-recorded.py source-freeze-1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-answer/source-author-c5-s12/freeze-source.py
```

exit0；只检查完整输入字节绑定和任务覆盖后冻结，不是独立语义审查。未发生失败/修复；首次FAIL无。工具当前hash绑定于ledger；services/browser/DB/Git/install/env/tool/app修改全部0。

未读取已有/其他作者答案、choices、main private source solutions。现代TEXT独立冻结仍原样，Wegener首审另行进行；本报告不含最终现代键，无retain/promote/finalize/selfapproval。s12图200跨课闭合保持独立待办，不能宣称完整课ready。后续最终答案需要完整现代题面/所需现代图独立批准及另外授权。
