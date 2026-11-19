# Batch55 Independent SOURCE-only Solutions: n150

Status: **SOURCE_COMPLETE**, all **4/4 original tasks** independently solved. Concrete solution blockers 0. This is source-solution evidence, not an answer-key publication, modern-answer review, figure approval or whole-course approval.

## Ordering And Inputs

FIRST independent TEXT verdict `PASS_TEXT_ONLY` was written and frozen before this solution stage.
[FIRST-text-freeze.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-n150-b55/FIRST-text-freeze.json) SHA-256:
`2d032c58307e40da084ee7ac1273e314c02a8cc582791e23f9a03ae1424a41d5`.
Freeze observed at `2026-11-17T06:22:20.545Z`, monotonic ns `462429794954875`, with solution work not started and images opened 0.

This stage used only the original four questions, the original assembled n150 lesson, its local source blocks on physical 380/381 and actual original fig-309 pixels. The approved SOURCE reports were permitted provenance; no answer artifact, choices, candidate solution, predecessor/HOLD body or failed-history answer was read. Modern wording, the reviewer's pre-freeze physics reference and author reasoning are not premises of the solutions below. No external reading occurred in this solution stage.

Original [lesson.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c2-s4-n150/lesson.json):
SHA-256 `7b1372a7b5e3628bf3fa2c1a58f91f77aee3323345078c47e7c286ed588fe658`.
Original [exercises.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c2-s4-n150/exercises.json):
SHA-256 `249318b7cd2ed767a2a464946c3e3fc7bbd23d980663a8dd8c1892fa58230019`.

Question identities: `phy7-c2-s4-n150`, numbers/source numbers 1,2,3,4, group 问题, `group_id: g1`, source refs p0381#11 through p0381#14 respectively. All original question `figure_refs`/`figures` arrays are empty. Nevertheless task 3 requires the lesson's original apparatus figure for the requested source-only explanation; its empty question reference array was not used to skip that image.

## Original Figure

Resolved the actual raw path with:

```text
rg --files ssot-resources/soviet10year-textbooks/artifacts/7p/figures -g 'fig-309.png' -g 'fig-309.svg'
```

Opened `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/figures/fig-309.png` with `functions.view_image`, original detail, once.
PNG SHA-256 `3ee1c7b1d979b950d459f237d26b1691794da9783e71e9f2f101e3d6662ada29`, 6779 bytes, 279 x 541 pixels. Hash observation before open: `2026-11-17T06:22:35.095Z`, monotonic ns `462444344739791`; completed-open observation: `06:23:09.288Z`, monotonic ns `462478538646500`. Both follow the TEXT freeze.

Independent pixel observations: magnetic needle and support/base at top, a wire above it, broken original-orientation marks contrasted with the solid needle, battery with plus sign, slide-resistance apparatus, bottom lever switch and their connecting wires. The source text, not a guessed interpretation of the mark angle, identifies the broken line as the original needle position.

There is no printed voltage, current magnitude, deflection angle or north/south label in this crop. No quantitative value, polarity-dependent rotation direction, current arrow or modern-candidate detail is needed or inferred. The source image is not reproduced in this report or sent to the parent.

[image-ledger.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-n150-b55/image-ledger.json) records the single open, source hash and observations.

## Full Solutions

### 1. 电路中的现象

Original task, p0381#11:

> （1）在电流流过的电路中能观察到哪些现象？

**解答：** 电流通过电路时，可以观察到热现象、化学现象和磁现象等。

**依据与推理：** 原课文 p0380#4 明确回顾了这三类现象。题目询问现象类别，因此列出三类即可；不需要数值计算，也不要求它们在每一个电路中同时出现。

**完整性：** 三个源文明确列出的类别均已覆盖；原文的“等”保留其非排他性，没有擅自把三类说成唯一可能的全部现象。

### 2. 磁现象的例子

Original task, p0381#12:

> （2）你知道哪些磁现象？

**解答：** 例如，两个有电流通过的导体之间会有相互作用力；通电导线附近的磁针会偏离原来的方向。这两种现象都是磁现象。

**依据与推理：** p0380#4 明确指出两个通电导体之间的相互作用力称为磁力。p0380#7 与 p0381#1 的完整实验描述给出通电时磁针偏转的第二个例子，p0381#6 说明磁场作用于磁针。因此两个例子均直接来自本课，而不是从未读的 §131 正文、别课答案或现代候选补入。

**完整性：** 原题是开放举例题，不指定例数或唯一例子；这两个不同的、由本课支持的例子已经构成完整回答。未擅自增加同向/反向电流的吸引排斥规律、磁极配对规律或电子束实例。

### 3. 奥斯特实验

Original task, p0381#13:

> （3）奥斯特实验的内容是什么？

**解答：** 把接入电源电路的一根导线放在磁针轴线的上方。接通电路时，磁针偏离原来的位置；断开电路时，磁针转回原来的位置。这个实验表明电流与磁针相互作用；通电导体周围的磁场作用于磁针，使它偏转。

**依据与推理：** p0380#7 开头规定导线和磁针的相对位置，p0381#1 续完接通/断开时的对照观察。原始图 309 实际显示电池、上方导线、磁针及其支架、变阻器、开关和连接导线；磁针是被观察的装置，不被画成串入导线的电路元件。p0381#6 给出观察的磁场解释。

**完整性：** 装置安排、接通变化、断开变化、相互作用的结论全部包含。虚线对应原位置的依据是原课文；不把虚线误认成额外导线。题目不问偏转角、极性或电流方向，图也不给这些量，所以不编造它们。答案是对原实验的描述，不是让学生接线或重复操作的指令。

### 4. 电流与磁场

Original task, p0381#14:

> （4）电流与磁场之间有什么关系？

**解答：** 电流周围存在着它产生的磁场，所以电流是磁场的源。电流与它产生的磁场相联系，不能分开看；“电流的磁场”就是“电流所产生的磁场”。

**依据与推理：** p0381#7 将电流与运动电荷周围的磁场联系起来，并明确说电流和磁场不能分开。p0381#9 直接提出应把电流看做磁场的源，随后解释两种说法的意义。p0381#6 的磁针偏转提供本课的实验支持。

**完整性：** 回答了存在关系、产生关系和“源”的意义。没有把“电流是磁场的源”改成“任何磁场只能由这个电路产生”，也没有要求整个中性电路各点一定有非零电场。无需引用现代补充句或引入超出原题的公式来完成本题。

## Completion And Limits

Four source questions, four complete solutions; all task numbers and original prompts are preserved. There are no numerical exercises or formulas to calculate in this set, no missing subparts and no ambiguous source datum preventing completion.

Status **SOURCE_COMPLETE** does not mean an official answer key was read or validated. These are independent source-based solutions; no answer/choice generator, publisher, backend, DB, app or whole-course gate was run.

Image opens **1**, reopens **0**, crops **0**, one batch **1 <= 8**, current context **1 <= 24**, parent image payload **0**. TEXT-stage images were 0. Modern candidate figures opened 0. Concrete failures **none**.

[source-complete-freeze.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-n150-b55/source-complete-freeze.json) binds this complete solution report, image ledger, prior TEXT freeze and the exact source inputs. The prior TEXT report is not revised after solving.

Writes are confined to the owned review scratch directory and the two named ticket reports. No source/candidate edit, FIRST repair, Git, backend, setup, DB, app, dependency work, figure production, publication, promotion, global checks or new pipeline. All other-agent files remain untouched.
