# 7p n83 Modern TEXT Author Freeze

工单STEMROBIN-180；作者Sagan/Codex，不是本稿独立审者。
状态：TEXT作者机械PASS，候选待main一次独立全文审核。
只有`phy7-c1-s1-n83`（83. 内能）；未读取答案、choice、私有源解或其他课作者稿。
没有使用新服务、安装依赖、finalize、retain、canonical索引、DB或Git。

## Complete Input And Scope

已完整读取canonical raw `lesson.json`、`lesson.md`、`exercises.json`。
实际本课8块正文、2道问题、0图，课在已批准来源及带TOC装订后闭合。
没有根据最初口述图号为n83添加210/211：
两原图在用户纠正到达前曾被实际完整查看，事实记录在`scope-correction.md`；
纠正后不用于本课知识推导、不进权威context、不入figure模板，未读取n84正文。

| 输入 | SHA256 |
| --- | --- |
| raw lesson.json | `22b5a88321f6e2c959a92f7d3248d2bacd1ad1823cb4641b3c1a0f3fa161a90a` |
| raw lesson.md | `c08b48e39f7d1e1b066038c830149345e3da347044b8390201a5b84f9a2a125b` |
| raw exercises.json | `52a8658f6ed76fc081d3f4f2897ad9f11d9e2f0a0db430d40f83b1b5d74b0461` |
| prepare时raw book.json | `81225793d1a57aec0d8363b4c5e2ad28ac34fef75f33f7acaa158dbe0562eff5` |
| TOC 7p/zh.json | `b3ab95eb3e7d4b1c60b2945be162ed3c307f75b9ab39eccc53583f984430c73f` |
| sources/manifest.json | `5114f1e03c78a847555addfcaa5c6f27f5d2cb02abf3593f9c40a6f1d5cb5ed0` |

六份完整输入已独立快照。全局book/TOC/manifest保留当时真实epoch，
不把文件级hash冒称某课投影hash；冻结时仅本课原始三文件要求字节不变，
全局文件的前后实际epoch另记录，不强迫无关全局历史输入永久等于当前。

## Authored Coverage

| 完整单位 | source_refs/pages | 保留与澄清 |
| --- | --- | --- |
| prose[0] | p0219#4 | 所有分子热运动动能及分子间相互作用势能组成内能的定义完整。 |
| prose[1] | p0219#5 | 内能与整体机械运动/位置区别、飞行飞机同时有内能和动能/势能完整；明确内部状态不变。 |
| prose[2] | p0219#6 | 单分子能量小、分子大量及总量大的比较完整；不宣称任意物体内能都必然很大。 |
| prose[3] | p0219#7 | 室温、完整长小数、分数、1米³及140000焦耳完整；数值归为原书代表性估算，不冒称每分子完全相同或任意压强下同体积通用。 |
| prose[4] | p0219#8 | 5吨/3米/近似140000焦耳及1米³氢气比较，锻锤落下打工件做功完整；分子动能总和是内能中的所比较部分。 |
| prose[5] | p0219#9/p0220#1 | 跨页内能利用的困难、技术进步及重要性完整；不把不总能直接利用说成永不可利用。 |
| prose[6] | p0220#2 | 同一物体内能可变、升温增加/降温减小及分子平均速度机制完整；限定组分/物态不变，区分整体速度。 |
| prose[7] | p0220#3 | 原子能属于广义内能及本课主要讨论分子能量的范围完整。 |
| exercises[0] | p0220#5 | 原问题1、group_id=g1、原号1及能量关系任务完整；增加内部状态不变条件，不添加答案。 |
| exercises[1] | p0220#6 | 原问题2、group_id=g1、原号2及哪种能量容易利用任务完整；限定本课锻锤/氢气比较情境。 |

全source.data、source_text、身份、8块来源、两题pages/题号/分组及0图关系保留。
没有生成答案键或给开放问题限定数字答案。没有需要替换的虚构文化名称或
用于历史身份教学的特定人物/地点，因此每单位`historical_entities=[]`；
科学术语“原子能”不是另造历史人物。

四个原数学片段完全保留：
`0.000000000000000000005`、`\frac{5}{10^{21}}`及两次`^3`。
没有重新计算或改写原书140000焦耳、5吨/3米比较，也没有添加未提供的g或压强。
`numeric_changes=[]`。工具的非公式数字签名在连写中文单位的部分为空，
本报告不以空签名冒充完整数字核验；数值原字符串和每单位完整原/现代文本
均在机械证据中可实际比对。

## Actual Commands And Mechanics

准确共享Python：
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`。
使用现有依赖，不使用bundled Python或安装缺失依赖。
所有实际命令在repo工作目录运行。

```text
<shared-python> -B .tmp/ld-s10y-lesson/text-author-7p-n83/run-author.py prepare
  -> <shared-python> -B .claude/skills/ld-s10y-lesson/tools/p2c.py adapt-prepare
     --book 7p --edition modern-us-neutral --lesson phy7-c1-s1-n83
     --root /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts
     --work /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n83
<shared-python> -B .tmp/ld-s10y-lesson/text-author-7p-n83/run-author.py compose
  -> current edition.normalize_lesson_layout / normalize_exercise_layout, each once
  -> node .claude/skills/ld-s10y-lesson/tools/prose_flow.mjs --json <candidate lesson>
<shared-python> -B .tmp/ld-s10y-lesson/text-author-7p-n83/run-author.py check
  -> <shared-python> -B .tmp/ld-s10y-lesson/text-author-7p-n83/run-author.py check-worker
  -> current edition.validate_lesson(candidate_paths=...), once
  -> current mathcheck.collect_and_check(source+modern), one batch
<shared-python> -B .tmp/ld-s10y-lesson/text-author-7p-n83/run-author.py freeze
```

prepare、compose、明确CLI outline和作者check实际exit0。
exact argv/cwd/start/end/stdout/stderr与14项工具/skill/profile前后SHA保留于
`evidence/{adapt-prepare-1,prose-flow-derive-1,text-mechanics-1}.call.json`。
三命令的before/after工具epoch一致，没有跨main稳定工具修改强迫重跑。
compose的明确normalizer结果保存在`normalization.json`；freeze只整理hash与快照，
不再运行normalize、prose_flow或任何门禁。

作者机械为PASS、errors=[]、KaTeX warnings=[]。
实际验证schema、edition、当前source快照/哈希、权威errata重建、身份、
source_text、逐单位数学与非公式数字、文化声明、题目分题布局、图引用和图清单。
实际用KaTeX一次批验全部source/modern公式，未改写数学片段。
只读检查没有改变候选字节，返回的normalized document与已保存候选完全相同。
本课0图，没有调用现代图门禁或制作英文图标签。

## Actual Section Boundaries

明确`prose_flow.mjs --json`实际输出13段。先从这份最终布局outline选择
真实相邻段落，再只写三个`{before,after}`锚点，不按8块或换行手算索引。

| 切换 | 实际CLI相邻0-based段落 | 来源语义 |
| --- | --- | --- |
| 机械能区别→大量分子总能量 | 1→2 | p0219#5→p0219#6 |
| 内能利用→温度改变内能 | 8→9 | p0219#9/p0220#1→p0220#2 |
| 升降温→原子能及本课范围 | 10→11 | p0220#2→p0220#3 |

`tool-derived-boundaries.json`保存精确两侧字串、来源块选择及真实CLI输出SHA。
最后的一次`edition.validate_lesson`内部调用同一`prose_flow_contract`检验
三个最终锚点，errors=[]；没有为记录final outline额外重跑CLI。
单句定义或剩余单句段落保持语义完整，不为凑段落跨主题拼接。

## Frozen Candidate

workroot：
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-7p-n83/`

三模板目录：
`adapt/7p/modern-us-neutral/lessons/phy7-c1-s1-n83/`

| 候选 | SHA256 |
| --- | --- |
| lesson.template.json | `bec2ef3254fab640ae6eee7e25987ba4e4cd859fb0b6810d12ec4eb67a62aaae` |
| exercises.template.json | `18834dc8fd555d93003320458338831d42b6cdbfecfe123cd6b9b6f83cc3f055` |
| figures.template.json（空清单） | `dc52c64da89d604c91afb5a3da950c0a63216ef03ec229619c9565aac6fc2d46` |

完整context、source输入快照、prepared原模板、改写草案、全部最终模板、
normalization/outline/锚点、机械和真实命令流由`author-freeze-manifest.json`
及`author-handoff.json`绑定。此为作者冻结，不是独立TEXT PASS。

首FAIL：无。作者mechanical-inclusive修复预算仍0/1。
后续只有main授权的唯一受影响修复，不能自行增加检查循环。
没有浏览器/窗口/CDP/系统输入、新服务、figure author/gate、official adapt-finalize、
retain、promote、发布、canonical索引、DB或Git操作；无in-flight会话。
主代理接手非作者完整TEXT审核。
