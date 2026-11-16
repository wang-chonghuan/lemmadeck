# 7p §83 FIRST Independent TEXT Review

工单：STEMROBIN-180。对象：`phy7-c1-s1-n83`，83. 内能。
日期：2026-11-16。审者：本独立 Codex 会话；作者：Sagan/Codex，非本审者。

结论：**PASS / FROZEN_FIRST_FULL_TEXT_PASS**。
首次、完整、TEXT-only 独立审核已完成：8/8 正文块、2/2 原任务、13 个现有输出段落、3/3 真实 section_breaks，0 图。
必要缺陷 0；必要修正 0；未编辑作者稿。此结论不等于整课批准、图像批准、答案批准、安全认证或正式 finalize。

## Exact Frozen Authority

所有输入路径从确切 author-handoff 及其绑定读取，未采用口述的 `author-context.json`。
实际 context 是 `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n83/context.json`。

| 文件 | SHA256 |
| --- | --- |
| author-handoff.json | `97460dc23a462dd44a47fcaeb75c1b9360fbea1a5e185dfb4532e5c2b9f0fd5f` |
| context.json | `aa4eb954a679f796b44300b0cdfa42a39a0c32cea9a83f3d371fdf3a7ad1319e` |
| lesson.template.json | `bec2ef3254fab640ae6eee7e25987ba4e4cd859fb0b6810d12ec4eb67a62aaae` |
| exercises.template.json | `18834dc8fd555d93003320458338831d42b6cdbfecfe123cd6b9b6f83cc3f055` |
| figures.template.json（空） | `dc52c64da89d604c91afb5a3da950c0a63216ef03ec229619c9565aac6fc2d46` |
| author-freeze-manifest.json | `002008bf35a21013e317e30a45258914102e4ad395c78d946dd50783959ec925` |
| input-bindings.json | `3be4eea704da4c6918ca845fe06245215aa9a3f7e557098d4b2e0a5526a93ef4` |
| text-mechanics.json | `0f9fef65252931c7dacefc92c1111ae2117dd9884f4f145428cb896d30f9544c` |
| prose-flow-derived.json | `bf1f71ee8b00d43c042ba9f51a3866552ba64f36e6753de9ebb362a5a4b00b55` |
| tool-derived-boundaries.json | `9a324321bee28d51958163b4248798800354c65fb8d7d1e99a3bcb892da23591` |
| modern-text-author-7p-n83.md | `e33d39b581a852a7e4b0eedabbf5cba4d96bb5a7f87d67c279aa389bb59d9c54` |

三候选模板的完整目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n83/adapt/7p/modern-us-neutral/lessons/phy7-c1-s1-n83/`。

完整 canonical raw 目录：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c1-s1-n83/`。

| 完整 raw 输入 | 字节 | SHA256 |
| --- | ---: | --- |
| lesson.json | 3788 | `22b5a88321f6e2c959a92f7d3248d2bacd1ad1823cb4641b3c1a0f3fa161a90a` |
| lesson.md | 2217 | `c08b48e39f7d1e1b066038c830149345e3da347044b8390201a5b84f9a2a125b` |
| exercises.json | 888 | `52a8658f6ed76fc081d3f4f2897ad9f11d9e2f0a0db430d40f83b1b5d74b0461` |

当前 canonical 三文件与作者 source-snapshot 逐字节相同；两候选完整 `source.data` 与当前 raw 结构相同。
每个现代单位的 `source_text` 与 raw 原文及现有 mechanics 的 source 相同，mechanics 的 modern 与候选相同。
完整单元源/现代文本 SHA 和边界两侧 SHA 在 reviewer-handoff 中逐项绑定。

## Full Block Review

| 单位 / 来源 | 结论 | 独立语义与物理判断 |
| --- | --- | --- |
| prose[0] / p0219#4 | PASS | 全部分子的热运动动能与分子间相互作用势能两部分均保留；“本课所讨论”与末块的分子层面讨论范围一致，未用局部定义否认更广义内能。 |
| prose[1] / p0219#5 | PASS | 原“整体运动/相对位置”与内能的区别及飞机同时具有内能、宏观动能和势能均完整。“内部状态不变”避免把整体速度与分子热运动混为一谈；强调仍覆盖核心定义。 |
| prose[2] / p0219#6 | PASS | 单分子能量小、分子数量大、总和可观的论述完整。“可以很大”不再把任意物体的内能大小说成无条件定理；没有删除源比较目的。 |
| prose[3] / p0219#7 | PASS | 室温、完整长小数、等值分数、1米³及140000焦耳保留。代表性估算并不声称每个分子动能相同；源未给全气体状态条件，候选明确不能推广至任意室温/压强。未猜补温度、压强或分子数。 |
| prose[4] / p0219#8 | PASS | 5吨、举高3米、近似140000焦耳、与1米³氢气的比较及落锤对工件做功完整。140000保持为原书粗略比较口径而非精确 mgh 等式，不隐含新增 g。比较对象明确是氢气内能中的分子动能总和，未把总内能偷换成只有动能。 |
| prose[5] / p0219#9+p0220#1 | PASS | 跨页困难、并非总能利用、科学研究、技术进步和重要性均保留。限定“给定条件下直接利用”，且明确不是任何情况下都不能利用；未把内能说成永不能做功或不能转化。 |
| prose[6] / p0220#2 | PASS | 同一物体内能可变、升温/降温与分子热运动关系均保留，且说明组分/物态不变的本课情形。速度指分子热运动而非物体整体移动；未用这段取代相变、反应等其他机制的论述。按本课基本热模型阅读，不作为任意多变量过程的完整状态方程。 |
| prose[7] / p0220#3 | PASS | 原子能属于内能的源事实完整；“广义”与后续分子动能/相互作用势能的课堂范围明确区分。新增末句是范围澄清，不否认原子能，不删减源科学知识。 |

内能与宏观机械能是不同的分类，不等于两者不能通过做功发生转化。
本稿的固定内部状态比较及整体/热运动区分没有作这种禁止断言；内能利用段反而保留利用内能做功的可能性。
因此没有必要在本节强加新转换任务或把现有第一题替换成下一节内容。

## All Original Tasks

| 原任务 / 来源 | 结论 | 完整题面审核 |
| --- | --- | --- |
| g1-1，问题（1） / p0220#5 | PASS | 原考查内能与物体自身宏观动能/势能关系的目标、分组和题号保留。内部状态不变、只变整体运动/位置是对本节比较的条件澄清，不是新增题目或否定做功转换；题面仍要求学生解释关系，没有写出答案。 |
| g1-2，问题（2） / p0220#6 | PASS | 原哪种能量较容易利用的任务完整。锻锤/氢气情境和“直接”限定防止无条件效率/可用性排序；无新增数值任务、答案键或强制自动评分。 |

两题的 `number/source_number/group/group_id/pages/figure_refs/figures` 与 raw 保持对应；没有遗漏、合并、补造子题或无题号任务。
现代 lines 为完整单题行，与印刷跨行不同属于已声明布局处理，不损失原题文字或条件。

## Numbers, Emphasis And Cultural Scope

实际逐文本核对原数学片段：`0.000000000000000000005`、`\frac{5}{10^{21}}`、两处 `^3`，字串不变。
另人工核对连写中文单位的室温、1米³、140000焦耳、5吨和3米；不把工具部分为空的非公式 numeric signature 当成这些数值已被充分检测。
没有新增精确气体状态、g、实验数据或现代实测值；`numeric_changes=[]` 与实际相符，`errata=[]`，没有未注册公式修正。

定义、室温、升降温及原子能的语义强调保留；升降温源斜体改为现代粗体仍强调同一内容。
改写、澄清和段落处理均以 `changes` 声明，没有借“clarification”改掉原核心任务。
按完整 current modern-us-neutral profile 判断：本课无须保留教学身份的特定历史人物/地点/机构；“原子能”为源科学术语，不是文化例外实体。
全部 `historical_entities=[]` 合理；没有替换真实科学史身份或虚构现代人物。

## Existing Prose Flow And Mechanics Reused

完整读取已冻结 `prose-flow-derived.json` 的13个实际段落及 `tool-derived-boundaries.json`。
未自行按正文块数推算段落，也未重新运行 normalizer、prose_flow CLI/API 或 edition gate。

| 边界（现有0-based段落） | 独立判断 |
| --- | --- |
| 1→2 | 宏观机械能区别及飞机例子结束，转入大量分子总能量；真正相邻，主题完整。 |
| 8→9 | 内能利用意义及可利用性限定结束，转入温度改变内能；真正相邻，未断开跨页论述。 |
| 10→11 | 降温/热运动与整体速度区分结束，转入原子能和本课范围；真正相邻，未把限制句留在上一主题。 |

derive stdout 当时 `resolvedBreaks=[]` 是写最终 anchors 前的真实 outline，不冒称已解析最终边界。
最终 anchors 精确字串由候选、handoff、boundaries 三方一致保存；现有 `text-mechanics.json` 记录最终内部 anchor validation PASS、errors=[]、KaTeX warnings=[]。
本独审只复用这些已完成机械证据；没有第二次机械检查。

独审的一次只读 byte-binding 比较实际 exit0：
31 个作者 manifest 文件，14 个记录的 tool/skill/profile epoch，加 handoff 直接引用去重为46路径；
再加作者 handoff 自身1及当前 canonical raw3，共 **50 个唯一当前文件字节绑定一致**。
其中 manifest 的 run-author.py 与 tool_epoch 重复计入后去重。50不是50次语义门禁。
全局 book/TOC/source-manifest只核作者冻结快照的历史 epoch，不要求无关全局当前文件仍等于旧 epoch。

## Read And Write Boundary

完整语义读取：上述 raw 三文件、两完整现代候选（含全部 source.data）、空 figures 模板、context、input-bindings、author-handoff、author-freeze-manifest、text-mechanics、完整 author report、保存的13段 outline 和精确 boundaries。
同时读取 lesson skill、edition text contract、current profile 和仓库 router/charter；manifest 其他文件与工具仅作字节绑定，不声称审核它们的整书语义。
未打开任何图片；210/211是作者记录的口述纠正排除项，独审没有复看或引入。
未读取答案、私有源解、choices、交互或邻课正文；未运行 source/flow/math/figure/full-lesson gate。

只新增本报告和独立 reviewer-handoff；作者原 freeze、原无首FAIL状态及0/1作者预算保持不变。
retain/finalize/promote/record_review、服务、浏览器、DB、Git、安装和稳定工具修改均0；无 in-flight sessions。

交接：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-7p-n83/reviewer-handoff.json`。
结论仅供 main 精确复用本次首次完整 TEXT PASS；后续官方动作仍由主代理负责。
