# Batch54 Independent SOURCE-Only Complete Solutions: n149

Status: **SOURCE_SOLUTIONS_COMPLETE_6_OF_6**. No blocking source ambiguity.
These are independently reasoned written solutions, not imported answer keys,
choice artifacts, official book-end answers or published interaction specs.
No modern TEXT/FIG/full-course approval is inferred from these solutions.

Checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Ticket: `STEMROBIN-180`; source lesson: `phy7-c2-s3-n149`;
title: `短路　保险器`; group: `**问题**` / `g1`.
All six numbers and source numbers are `"1"` through `"6"`.

## Ordering And Source Boundary

The substantive independent FIRST TEXT verdict was written and hashed at
`2026-11-17T05:59:48.467Z`, before independent solving and all original image
opens. It remains frozen and unchanged:

- FIRST TEXT report SHA-256:
  `7102a446de55d875d64c821a60d8a07e987fe0fad60b7e166d680cf1f250c8f3`.
- FIRST TEXT verdict JSON SHA-256:
  `a85dab031ab9606a9122fc576c1193b80f3c32ce40d8fdffd5186d6d4ea9512b`.
- FIRST TEXT freeze manifest SHA-256:
  `9c990eb729c611294329f7359cac49d2d89f2f3b5ab3da1e4af6bcabac12bce2`.

After that freeze, the source PNGs were hash-observed at
`2026-11-17T06:00:08.431Z`, independently opened at original detail, and their
unchanged hashes observed again with a SOURCE-only full prose/prompt read at
`2026-11-17T06:01:03.845Z`. Only the raw n149 lesson/exercise snapshots and
these actual original figures supply the solutions below. No modern rewritten
sentence is used as answer authority.

Raw lesson:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c2-s3-n149/lesson.json`;
5415 bytes; SHA-256
`b52345532852d07d9f27e71afe23a9392b793f27e8d84584e255e462ab13f15f`.

Raw exercises:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/lessons/phy7-c2-s3-n149/exercises.json`;
2415 bytes; SHA-256
`5b6f632e76dbc9225ce619c271f21d1d86d7c75eedf3693445ab8b088bce729f`.

No outside formula, calculation, numerical answer, engineering standard,
present-day fuse recommendation or new experimental setup is needed. The
source supplies the resistance/current explanation and the protective-wire
mechanism directly. I do not add equations from another lesson, assume zero
resistance/infinite current, assign line/neutral polarity, choose a wire size,
or derive a replacement rating.

## 1. 电流超过允许值

原题：**（1）如果导线中的电流超过允许值，导线将会怎样？**

完整解答：导线会受到过强的加热，严重发热；导线外部的绝缘层有
起火的危险，因而可能引起火灾。

推理：原书先说明每条电路有允许的电流值，接着把超过这个值与导线
受到强热、绝缘层起火联系起来。本题问的是普通电路导线的危险后果，
不是要把所有导线都当作会按规定熔断的保险丝。

题源：`p0379#3`。依据：`p0377#7`，以及 `p0378#1` 的发热/火灾说明。
必需读图：无。没有给定数值、额外小问或遗漏条件。

## 2. 电流激增的原因

原题：**（2）哪些情况可能成为电源电路中电流强度激增的原因？**

完整解答：一是同时接通一些大功率用电器，例如电炉；二是电路
发生短路。原书给出的短路情形包括两根裸线意外碰在一起，以及在
带电线路上进行原书明确禁止的修理时意外造成低电阻连接。

推理：原书列出的是两类原因，而裸线接触、违规带电修理是第二类
的例子，不应把答案缩成只说大功率用电器或只说裸线相碰。图305的
两幅火花故障场景仅帮助认出原书所说的危险，不是让人实际操作。

题源：`p0379#4`。依据：`p0377#8`。
实际原图：fig305，`p0377#9`；辅助例证，不提供新条件或数值。
不得据图猜电压、工具材质、导线极性或安全维修步骤。

## 3. 短路的定义

原题：**（3）什么是短路现象？**

完整解答：一段电路的两端被另一导体连接起来，而这根导体的电阻
远小于原来这段电路的电阻，这种现象叫做短路。

推理：定义包含两个条件：连接的是原电路一段的两端，连接导体的
电阻远小于被连接电路段的电阻。不能只回答“导线相碰”，也不能把
“远小于”改成“电阻等于零”。裸线相碰只是原书列举的一种可能情形。

题源：`p0379#5`。依据：`p0377#8` 的完整原定义。
必需读图：无。没有图中未知量或数值答案。

## 4. 短路电流为什么很大

原题：**（4）短路时电路中的电流强度可以达到相当大的值。这如何解释？**

完整解答：短路时，原来的一段电路被电阻很小的导体连接、旁路，
使电路的电阻变得很小。因此，在电源仍然接通的情况下，电路中的
电流强度会大幅增大，可能达到相当大的值。

推理：将原书的短路定义与紧接着的“电路中的电阻很小，所以电流
强度就很大”连接起来，即得到所问的原因。过热和火灾是随后可能
产生的结果，不是造成大电流的原因；也不需要假定电源电压突然升高。
原文只说电阻很小、电流很大，不给零电阻或无限电流的结论。

题源：`p0379#6`。依据：`p0377#8`、`p0378#1`。
必需读图：无。没有计算数据，不额外引用其他课的公式。

## 5. 接入保险器的目的

原题：**（5）在电源电路中接入保险器的目的是什么？**

完整解答：为了在电流超过允许值时迅速切断电路，保护导线，避免
导线因过载或短路而严重发热、使绝缘层起火甚至引发火灾。
原书的熔断式保险器中，规定规格的易熔导线是电路的一部分；电流
超过允许值时，这根导线熔化，电路便被切断。

推理：保护的目标是避免超负载危险，动作是切断电路，熔断导线是
原书所述的实现方式。原书图307和正文说明它串在供电导线上，不能
把目的误写成增加负载、持续让短路电流流过，或把保险器当作任意
金属丝。这里说明原书原理，不提出今天住宅电路的安装规则。

题源：`p0379#7`。依据：`p0378#1`、`p0378#2`、`p0378#4`、
`p0378#5`、`p0378#6`。
实际原图：fig307，`p0378#7`，辅助核对原书的串接安排。
没有选型题，不把原书示例 5/10 安培指定为某个住宅的所需额定值。

## 6. 原书住宅用保险器的完整构造

原题：**（6）普通住宅用的保险器的构造是怎样的？**

完整解答：原书的这种住宅用保险器有瓷塞 $1$，瓷塞内穿着铅丝
$2$；瓷塞上有螺纹 $3$ 和中心接触点 $4$。螺纹 $3$ 通过铅丝
$2$ 与中心接触点 $4$ 相连，构成导电通路。瓷塞以螺纹与装在瓷盒
里的底座相配合，使铅丝成为整个电路的一部分。

铅丝的粗细有规定，用来承受一定的电流；原书举出的例子是 $5$
安培、$10$ 安培。电流超过允许值时铅丝熔化，电路断开，所以它
属于熔断式保险器。原书还说明保险器装在专用托板上，位于电源线
进入住宅的地方，图307中的每根电线上各串入一个保险器。这是该
源教材所介绍的旧式安排，不是供人照做的现代住宅安装说明。

推理：实际打开的图306能读到完整的 $1$、$2$、$3$、$4$ 标号，
与 `p0378#3` 的瓷塞、铅丝、螺纹、中心接触点一一对应。构造回答
不仅要列出四个部件，还要说明螺纹经铅丝连接中心接触点，以及瓷塞
与底座的机械配合。`p0378#4` 补充铅丝处于总电路中的位置与熔断
作用，`p0378#6` 和实际图307补充原书的托板/串接安排。

图308的玻璃管、两端金属帽、轴向细丝和专用支架属于原书的收音机
保险器；它不是本题的瓷塞式住宅保险器，不能用它替换上述四个编号
部件。没有引入实际拆装、维修或替换铅丝的操作。

题源：`p0379#8`。依据：`p0378#3`、`p0378#4`、`p0378#5`、
`p0378#6`。必需实际原图：fig306，`p0377#10`。
辅助原图：fig307，`p0378#7`。范围排除：fig308，`p0378#8`，
以及其正文 `p0378#11` / `p0379#1`。
没有丢失部件、连接、题源或未解的小问。

## Actual Original-Image Batch And Hashes

All paths below are under
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7p/figures/`.
All four actual PNG hashes match the whitelisted figure template's source
bindings and remain identical before/after inspection.

| Original PNG | Bytes | Dimensions | Opens | SHA-256 |
| --- | ---: | --- | ---: | --- |
| fig-305.png | 86655 | 274 x 546 | 1 | `6549f654e596938d91c371837137ed8135667814a3895992b947068fc4ab3aaf` |
| fig-306.png | 56877 | 300 x 305 | 2 | `ab8ef0797b6108d6c840df7c1c8a349fe985dde2cc07d6700044f2ecd0b55ce6` |
| fig-307.png | 5189 | 233 x 439 | 1 | `fd30d58353107d77cc1b39761d820b5c338606367cfcf6f602769e804b14218f` |
| fig-308.png | 2494 | 346 x 216 | 1 | `ceaa71734aec50ea8cf19008718672f63c96fc7a38142d0600a6d9593f7fbb5d` |

One completed batch: **5 opens**, four distinct originals, one duplicate
fig306 reopen fully counted. Sequence: 305, 306, 306, 307, 308.
Batch budget 5/8; current-context budget 5/24; parent image payload **0**.
Source page images 0, new crops 0, modern figure opens 0, browser/native
renders 0. No additional image load follows this batch.
The owned `source-image-observations.json` records independent textual
observations; no image payload is returned to the parent.

## Completion Boundary And Zero Replays

Complete solutions: **6/6**; unaddressed parts 0; invented tasks 0; imported
answer/choice artifacts 0; answer-key/schema/interaction production 0.
No blocking source ambiguity remains for these six qualitative tasks.
Absence of image voltage/polarity labels is explicitly not filled by guessing.
Source-page acceptance and modern figure approval are not certified here.

Official gate replays: **0**. Reviewer normalization, layout, prose-flow,
TEXT-field, prepare, finalize, vectorize, adapt-finalize, render and publishing
invocations: **0 each**. No repair, replay, replacement pass, new pipeline or
global check. The historical author runtime failure and parent-only runtime
correction stay retained: repair1 used, remaining0.

Only `.tmp/ld-s10y-lesson/text-review-n149-b54/`,
`modern-text-review-n149-b54.md` and this `answer-source-n149-b54.md` were
written. No candidate/raw source/other worker's file was edited or reverted.
No IntentFold setup/update, live backend, Git, DB, publishing, dependencies,
app change, service, approval or promotion action. Parent decides next steps;
these solutions do not retroactively alter the frozen FIRST TEXT verdict.
