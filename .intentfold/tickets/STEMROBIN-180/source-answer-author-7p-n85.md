# 7p §85 热传导：SOURCE-only 答案作者冻结

## Status

作者 Feynman；这是九道原题的独立推导源解，不是现代生产答案键，不是独立审核。

新 SOURCE unit 首次结构检查 **PASS / exit0**，9原题、9源解记录、36个必需字段；`errors=[]`。SOURCE unit 修复 **0/1**，与既有 TEXT unit 格式修复 **1/1已耗尽**完全分开，后者保持不变。完整源解冻结后等待 main FIRST 比较，不自行开始后续任务。

## Allowed Inputs And Source First

只读以下完整 canonical 原始输入及技能规则：

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c1-s1-n85/lesson.json`
- 同目录 `lesson.md`、`exercises.json`。
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/figures/fig-212.png`、`fig-213.png`。
- `.claude/skills/ld-s10y-answer/SKILL.md` 与 `references/gate-2-lesson-answers/gate.md`，仅规则，不执行生产键流程。

完整原课为14条正文（含正文图和caption）、9题、2图。写答案文件前，`snapshot` 已保存上述五份原始内容的字节副本、完整 raw lesson/exercises/MD context、实际图像观察记录及 current SHA。`input-manifest.json`分别绑定 canonical 输入与副本，不把历史输入哈希当成当前输出。工具规则与作者脚本的实际执行 epoch 保存在 `evidence/*-01.json`。

本 SOURCE-only 作者单元没有读取现代 TEXT 候选、main private 源解、任何其他答案、原书答案页或 choice，没有参考其他 agent 的求解记录。

## Actual Original PNG Observation

两张完整 durable 原PNG分别实际打开，未沿用 TEXT 任务的视觉审批。

- 图212：左侧架台和夹持点、水平铜丝、铜丝沿线及下方的图钉、自由右端下方的火焰/酒精灯、灯下木质支持物。装置关系用于说明局部加热和沿铜丝传热，不推测图钉总数、落下时间或温度。
- 图213：两端架台支持两根杆，中部火焰/酒精灯及木质支持物，杆上及下方图钉；左原标签“铜”，右原标签“钢”。没有从图建立精确杆长、导热系数或实测时间比较。
- 这是求解输入观察，不是原图或现代图质量审核，不产生 figure review / approval。

## Full Coverage

每一题都有 `fullAnswer`、`method`、`conditions`、`notes`，完整原题 `sourcePrompt` 和原始身份字段；辅助 `supporting_source_refs` / `contextFigureIds` 只是本课正文依据，不改变原 exercise 的空 `figure_refs` / `figures`。

| 原身份 | 来源 | 完整回答范围 |
| --- | --- | --- |
| g1 / `1` | `p0225#6` | 铜丝蜡钉演示装置、原书预期的由近及远脱钉现象、如何由局部加热与远处蜡熔化识别固体传导。教师控制演示，非执行记录。 |
| g1 / `2` | `p0225#7` | 热端粒子热运动及温度变化、相邻部分能量传递、由热处向冷处传导，以及无物质端到端整体迁移。按本课简化粒子模型回答。 |
| g1 / `3` | `p0225#8` | 保留金属与木头等温；解释金属使手失热较快的凉感。明确物体低于手温、短暂可比接触的隐含条件，并说明同手温或高于手温不能无条件沿用结论。 |
| g1 / `4` | `p0225#9` | 三个请求全部覆盖：强导热材料、弱导热材料及各自用途。银铜/金属传热部件；气体、纤维/多孔材料、极稀薄气体区域与保温用途，含暖物体减慢散热及冷物体减慢吸热。说明液态金属例外、真空不是物质且不阻断全部传热。 |
| g2 / `g2-1`（source1） | `p0225#11` | 松软雪中冰晶与空气、弱导热覆盖减慢土壤和作物向寒冷环境散热；不是雪产热或任何条件下不冻死的保证。 |
| g2 / `g2-2`（source2） | `p0226#1` | 麦秸、稻草、干树叶的空气空隙及较少连续固体通路，解释松散干燥材料层整体导热差。 |
| g2 / `g2-3`（source3） | `p0226#2` | 两组均完整：木板/锯末 **3.7倍**、完整冰/新雪 **21.5倍**，保留细小冰晶括注；用连续固体与含空气颗粒结构解释差别。倍数是题给比较数据，不假造数值推导或当成无条件常数。 |
| g2 / `g2-4`（source4） | `p0226#3` | 皮袄减少人体向冷环境散热而非自行产热；区别产热与保温，联系冷物体保温原理，不添加实验任务。 |
| g2 / `5`（source5） | `p0226#4` | 独立完整解释等温金属剪刀与通常木质笔杆的接触失热差别；明确接触部位及低于手温条件。原稳定身份保留为 `5`，没有改成 `g2-5`。 |

全部为开放物理解释，不添加 `grading`、`parts`、`expected`、`judge` 或 `bookRaw`；没有自动判题产物。

## Actual Executions And Limits

共享 Python：`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`。

命令均为该 Python `-B /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-answer/source-author-7p-n85/source-workflow.py <stage>`：

- `snapshot` 一次 exit0：先行冻结五份白名单原始输入、完整 context 与输入 manifest；原图观察两次。
- `check` 一次 exit0：绑定/副本字节、原题身份和顺序、全部四字段、原始题文、无生产字段和无新硬数字检查；生成完整 MD 导出。这不是 independent semantic PASS。
- `freeze` 一次元数据和字节冻结，不重跑结构检查或生产门禁。

没有首失败，SOURCE repairsUsed0 / remaining1。没有声明蜡钉实验已执行，没有新温度、时间、长度、厚度、导热系数或测温任务；两组倍数只使用原题值。

官方 prepare/finalize/publish、现代 TEXT 编辑、图生成/审核、浏览器、模型/图片服务、DB、Git、安装、canonical 写入均 **0**。不自行授权下一任务。

## Exact Freeze Bindings

| 文件 | SHA-256 |
| --- | --- |
| `input-manifest.json` | `b2226876328ebc84208d385f00d72f2ed8b954e76f5b6854e82991178fabfc41` |
| 完整 `source-context.json` | `4f43efeae3eef449d6ccd8a03ae7e332ecef382f896c1ec235937a95621b0929` |
| 九题 `source-solution.json` | `fa79432b605e1c6873ed77bbdf7cfb94fc12444cb249e9cdf8db99672e617272` |
| 完整 `raw-source-solution.md` | `166edda3cf95128909ec3c7b1c46c0e6471637ec80e9250cb331b40e680cdad5` |
| 首次 `structural-check.json` | `14fef24ec029c072661e902991c2a4d736522422881e5ad8f0d7fe5747e73776` |

`author-report.json` 是元数据/实际调用账本；`frozen-01/manifest.json` 绑定全 source copies、完整源解、context、规则执行证据与报告字节。`author-handoff.json` 绑定 active 输出、输入、不可变 manifest 及实际 freeze execution。所有产物仅在本隔离 SOURCE-only 作者 root，不是生产答案或独立审批。
