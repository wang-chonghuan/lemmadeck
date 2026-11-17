# FIRST independent complete TEXT review: interaction, batch52

- Date: 2026-11-17.
- Ticket: STEMROBIN-180. Book: 6p. Lesson/card: phy6-c3-s8, number 22, 物体的相互作用.
- Frozen verdict: **BLOCK**. One current semantic finding, T1 below. This verdict is written before independently solving the three original written tasks.
- Scope: complete canonical lesson.json, lesson.md, exercises.json; FIRST original PNGs fig-40..43; then complete candidate lesson/exercises/figures templates, including embedded source snapshots. All 15 blocks, all 11 final paragraphs, all three task identities and all four text/figure bindings reviewed.
- No candidate edits, retention, finalize, publication, replay, SOURCE/FIG gate, modern preview, app, DB, Git, dependencies, model-service call or stable-tool edit. Existing mechanical evidence was read, not rerun. This is TEXT only, not figure-production or display approval.

## Current Finding

**T1 [P2, blocking]: 第1题增加了原书没有的答案范围限制。**

Location: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52/exercises.template.json`, line 10 (`exercises[0].text`), duplicated at line 12 (`lines[0]`).

- Canonical `p0062#3`: “（1）描述几个表明物体只有在相互作用时才能产生运动的实验.”
- Candidate: “（1）描述几个教材中的实验，说明原来静止的物体只有与其他物体相互作用，才会开始运动。”
- “原来静止”“开始运动”清楚限定本题讨论的是由静到动，避免误读成维持运动也必须不断受作用，这一解释合理。
- 但“教材中的”不只是上述澄清，而是增加实验来源限制。原题允许学生描述其他能说明相互作用的实验；候选要求从教材已有实验中取例，改变开放描述任务的有效回答范围。原文、来源绑定和 `changes: ["wording"]` 没有授权这项收窄。
- 对孩子的具体影响：正确的自行举例会变成不符合“教材中的”要求的回答；从现有课文取“几个实验”也比原题的开放举例更受限。图40还是单车释放后没有运动的对照情形，不能单独当作一个“两物体都开始运动”的正例。
- 所需语义恢复：保留“原来静止”的澄清，但恢复原题开放的实验来源，不强制“教材中的”。本审查没有修改题稿，没有生成替换候选，也不授权第二次修复。

除此之外，未发现当前正文漏项、公式改写、图号错配、反冲方向反转或新增定量结论。原始 TEXT 排版失败已在唯一实际修复内处理，不作为新的当前阻断项。

## Exact Bindings

Canonical lesson directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s8/`

| File | SHA-256 |
| --- | --- |
| lesson.json | 23bbead55720f24ed372550ff53b77f1fc77fc86dc5a930723dad2989d3f54cd |
| lesson.md | f5cde46073deb8cba2312844aa50d1a21a5953d6f9c08a5917578d3b48127628 |
| exercises.json | bb4e48f5bd5d4fde9cc15c25650bce5ad3e1a22473f69ee32b7e2df97c2ddcec |

Candidate directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-interaction-b52/`

| File | SHA-256 |
| --- | --- |
| lesson.template.json | 84e05fe8d24715ce569822e148f9fd526cd5778a93e762a577de0730ff7c573b |
| exercises.template.json | 16858387129358ce40a213c114a3abcc49c470f1bc0aa9e023e623e02bf3d1eb |
| figures.template.json | d0f6f731c83fde7f8fac6e0d79f123a867d1cc69c132038c71d6c13871954d0e |

These match all three user-supplied current hashes. Embedded `source.path`, SHA and complete `source.data` agree with the canonical lesson and exercises read first. Original source_text, block identities and task page references are preserved.

Original PNG directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/`

| PNG | SHA-256 | Actual text binding |
| --- | --- | --- |
| fig-40.png | e1437da669c6d6c38ea366e8c6455d76365be074b49d6f4b09fc4b0715630112 | prose[1], fig prose[2] p0060#1, cap prose[3] p0060#2; original а/б becomes a/b |
| fig-41.png | 48a720f1df9e2f361e321d6f5a0606b08527a668ccaeae7fff7bf7485a00eb35 | prose[4], fig prose[5] p0060#5, cap prose[6] p0060#6; original а/б becomes a/b |
| fig-42.png | b2eeb24689ff212334955b17065003bdb372b9e455a1a082e556d2d50ccfe418 | prose[8], fig prose[9] p0061#2, cap prose[10] p0061#3 |
| fig-43.png | 1dead0683a3c0c4d84d755daa1cc106290cd505dc5f2266efdeeb52b9b5709f6 | prose[8], fig prose[11] p0061#5, cap prose[12] p0061#6 |

Candidate figures manifest binds the same four original PNG hashes, in order, and names `figures/fig-40.spec.json` through `figures/fig-43.spec.json`. These are planned modern figure references, not evidence that modern figures have passed. No modern spec, SVG, artwork or gate preview was opened. All four figures belong to lesson prose; none is an exercise-owned or shared exercise figure.

## Complete Coverage

Indices below are zero-based.

| Canonical/candidate block | Source refs | Review |
| --- | --- | --- |
| prose[0] | p0059#14 | Opening velocity-change topic retained; rest-to-motion explanation is clear. |
| prose[1] | p0059#15, p0060#3 | Single cart, bent/tied strip, release and reported no cart movement retained; table is the explicit reference frame. |
| prose[2..3] | p0060#1, p0060#2 | fig-40 and its caption retained exactly. |
| prose[4] | p0060#4 | Same second cart, contact via strip, opposite departures and `$20$` section reference retained. Contact clarification agrees with original PNG. |
| prose[5..6] | p0060#5, p0060#6 | fig-41 and its caption retained exactly. |
| prose[7] | p0060#7 | Both carts respond; mutual rather than one-sided action retained and defined explicitly. |
| prose[8] | p0060#8, p0061#1, p0061#4 | Initial table/relative rest, bullet/gun relative rest, recoil, both boats and jump/bank examples all retained. Foot contact clarification agrees with fig-43. |
| prose[9..12] | p0061#2, p0061#3, p0061#5, p0061#6 | fig-42/43 and both captions retained exactly. |
| prose[13] | p0061#7 | Interaction stated as necessary for a velocity change, not sufficient for every pair to change speed. |
| prose[14] | p0061#8, p0062#1 | Unequal or comparable resulting speeds retained; no numerical ratio or equality added. |

All three tasks retain `number == source_number` 1, 2, 3, `group: 问题`, `group_id: g1`, count 3 and lesson phy6-c3-s8.

| Task | Exact source binding | Figure fields | Semantic result |
| --- | --- | --- | --- |
| 1 | pages ["p0062#3"] | figure_refs [], figures [] | BLOCK T1; still a written descriptive task, but answer-source scope narrowed. |
| 2 | pages ["p0062#4"] | figure_refs [], figures [] | PASS: examples showing velocity changes of both interacting bodies; “怎样” requests a qualitative description, not new numbers. |
| 3 | pages ["p0062#5"] | figure_refs [], figures [] | PASS: gun firing and mutual action retained; no different apparatus or task introduced. |

The single math span is `$20$` in prose[4], a cross-reference rather than a calculation. It is unchanged. No exercise formula, quantity, unit, numeric_changes or registered target erratum is present. No unregistered correction was introduced. Published wording uses a/b rather than Cyrillic subfigure labels, and contains no answer key, choice or interaction payload.

## All 11 Final Paragraphs

This is a complete word-level reading record of the current final stream, not a new parser run. The saved initial prose-flow output provides unaffected paragraphs; saved repair-outline and affected-layout evidence provide the repaired paragraphs and the disappearance of the old marker-only paragraph.

### P0 / prose[0]
物体原来静止，后来开始运动，它的速度就发生了变化。
本节通过几个例子，研究这种变化是怎样发生的。

### P1 / prose[1], first
图 40，a 中，小车放在桌面上，车上装着一片弹簧片。
弹簧片弯曲着，用线系住，小车相对于桌面静止。
如果弹簧片伸直，小车会运动吗？

### P2 / prose[1], second
教材中的实验用烧断线的方法让弹簧片突然伸直。
结果，小车仍停在原来的位置，相对于桌面没有运动（图 40，b）。

### P3 / prose[4], first
教材接着在弯曲的弹簧片另一边放上一个相同的小车，让弹簧片与第二个小车接触（图 41，a）。
线烧断后，弹簧片伸直，两辆小车都相对于桌面运动起来，向相反的方向分开（图 41，b）。
这个结果与第 $20$ 节讲过的道理一致。

### P4 / prose[4], second
**改变一辆小车的速度，需要另一个物体对它作用，在这里，另一个物体就是第二个小车**。

### P5 / prose[7]
不只是装有弹簧片的小车运动起来，第二个小车也相对于桌面运动起来了。
一辆小车作用于另一辆小车时，另一辆小车也作用于它，不是只有一方受到作用。
**两个物体彼此作用，叫作相互作用**。

### P6 / prose[8], first
前面的两辆小车在相互作用之前，相对于桌面都静止，彼此之间也相对静止。
这是相互作用的一种简单情况。
子弹在射击前相对于枪静止。

### P7 / prose[8], second
射击时，子弹和枪相互作用，向相反的方向运动。
枪向与子弹相反的方向运动，这个现象叫反冲。
图 42 中，坐在小船里的人用手推另一只挨在旁边的小船。

### P8 / prose[8], third
另一只船被推开时，他自己的船也运动起来，两只船分开。
图 43 中，人从小船跳向岸上。
人在离船时脚蹬着船，与船相互作用，船沿着与人跳跃相反的方向离开。

### P9 / prose[13]
这些例子说明，**物体的速度要发生变化，就需要与其他物体相互作用**。

### P10 / prose[14]
原来静止的物体在相互作用后产生的运动速度，不一定彼此相同。
子弹和步枪的速度可能相差很多，人和小船的速度也可能差不多一样。

Reading assessment: explanatory paragraphs contain 2-3 complete sentences, with short standalone highlighted conclusions at P4/P9. “它”“他自己的船” have identifiable antecedents. The boat setup ends P7 and its result begins the immediately following P8; no missing step or reversed actor is introduced. “相互作用”“反冲” are explained on entry. Burning thread is narrated as the textbook's experiment, not an instruction for a child to perform it; gun and jumping examples likewise remain descriptive.

## Section Anchors

Two candidate `section_breaks` are exact adjacent final-paragraph text objects, not hand-authored integer boundaries:

- Boundary 0: P2 -> P3, separating single-cart control from the second-cart experiment. Its full before/after strings are exactly the P2/P3 texts above.
- Boundary 1: P8 -> P9, separating concrete examples from the general necessary-condition statement. Its full before/after strings are exactly the P8/P9 texts above, including repaired self-contained bold at P9.

Saved affected-layout evidence resolves these to indices [3, 9]. These integers describe evidence only; they do not replace the actual anchors. There is no marker-only paragraph and no bold span crossing a current paragraph boundary.

## Science Limits

- Fig-40 shows the textbook's reported comparison before/after strip release. The text does not claim the spring itself never moves, or that no internal interaction exists. Do not generalize this apparatus observation into “springs cannot act on carts.”
- Both carts initially rest relative to the table and each other. The gun passage states bullet rest relative to the gun; it does not substitute that for an assertion of absolute rest. Recoil descriptions are the source's ordinary initially stationary setup, not a claim about every moving reference frame.
- Fig-42 records adjacent boats and separation, not measured forces/speeds or direction arrows. Fig-43 records departure toward the bank and a boat farther away, not a numerical trajectory.
- “Only with interaction can velocity change” is necessary-condition wording. It does not say every interaction must produce an observable speed change, or that continued motion requires continued pushing.
- Final “速度可能相差很多/差不多一样” is qualitative comparison of resulting speed magnitudes, not equal vector velocities or a derived mass law. No force equality, momentum equation, measured ratio, or modern gas-mechanism requirement has been added.

## Saved Evidence And Budget

Evidence root is the candidate directory above; each named stage has its existing argv/stdout/stderr/exit record. Only saved records were consumed.

| Saved record | Actual status and SHA-256 of stdout.txt |
| --- | --- |
| commands/text-check | exit 1; 078b7a6b896fce1f4c147db959a076a8336cfa698ddca6aecec2038990d227a4 |
| commands/text-layout | exit 1; 2e719bf4484878063aab0f470f27375a1c9d5ff20ba364731c04aceb5d7350d6 |
| commands/text-katex | exit 0; 68db8f1e29b96a1b397e3929f0810f198fb6b763b8149e21984331bdff611238 |
| commands/repair-outline | exit 0; 8a762facef8ee8042be8f97cfebc83ff876886c81de2c774bfa71b5bf16efd69 |
| commands/text-layout-repair-1 | exit 0; 1915416191be17233f047103b7911a0476fc6306ace5fcfcb195d4194d555ff6 |
| commands/ticket-read-repaired | exit 0; 71db82813cbd466235c1977512bf1a871fd5652b8b81882a69c2bc46c4d2111b |

Original normalized failed lesson SHA: `490657a72d9a5918abfe0dca8503123ba00dfc557ff5ec1c9b058f355d005ac7`, still present in both `commands/text-check/failed-snapshot/lesson.template.json` and `commands/text-layout/failed-snapshot/lesson.template.json`. Original layout had 12 paragraphs, isolated marker paragraph 6, and bold failures at paragraphs 4/5/6/10. The full-TEXT report remains an actual fail, not silently rewritten as pass.

The one actual TEXT repair moved bold closers/whitespace in prose[4]/[7]/[13] and updated section_breaks[1]. Its saved affected check verifies 11 paragraphs, three `<strong>` outputs and the adjacent anchors, bound to the current L/E/F hashes. No words, math, identities or source snapshots changed in that repair.

Budget: actual author TEXT repairs 1/1, remaining 0; this reviewer repairs 0. The earlier Plane multi-document JSON read correction is an intake diagnostic correction, not a TEXT repair and not a new approval gate. Saved stale top-level manifest fields are read together with its appended `affected_layout_repair`, not used to reset the budget.

Reviewer image count: 4 original PNGs, each opened once, 0 crops, 0 reopens, 0 modern previews, 0 parent image payloads; task/context total 4. Independent written solutions are a subsequent source-only phase and will not change this frozen TEXT verdict.
