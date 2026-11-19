# B86 Bounded SCIENCE Diagnosis: s18-t1 And s22

2026-11-19, Europe/Dublin. STEMROBIN-180, existing cap3 session180-3.

**s18-t1 lesson: REVISE. s22 lesson: REVISE. Both s22 written tasks: scoped PASS, unchanged.**
These are new scientific judgments, not a repeated TEXT_FIDELITY or SOURCE gate.
Five s18-t1 paragraphs and four s22 paragraphs need conditions or clarification.
No template was edited and no answer was produced.

Reader's question: which inherited statements would teach an incorrect physical
generalization, and what is the smallest wording repair that keeps the original
experiment, historical example and questions?

## Exact Inputs And Reused Evidence

All shell calls used explicit workdir `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Only this report and `tmp/b86-6p-science/counts.json` were added. Other owners'
files were read only; no cleanup, reset, staging or shared record change.

Input aliases below denote these exact files; JSON pointers are zero-based,
while B numbers are one-based upper-level prose positions.

- S18: [final lesson](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-s18-final-static-recovery/FIRST/lesson.template.json), absolute path `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-s18-final-static-recovery/FIRST/lesson.template.json`.
- S22: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-template-recovery/template-recovery/FIRST/templates/phy6-c3-s22/lesson.template.json`.
- E18/E22 and F18/F22: `exercises.template.json` and `figures.template.json` under `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-template-recovery/template-recovery/FIRST/templates/{phy6-c3-s18-t1,phy6-c3-s22}/`.

One read-only byte-hash inventory bound these six inputs; it did not compare raw
text, run an adaptation validator or reopen source material.

| Input | SHA256 |
| --- | --- |
| S18 | `38b5179aa3d0616061458de5ac8e8511495612fb672eb69beb71a383ef84e9f5` |
| E18 | `e1cfabcdfdda63775eddefc881de26090609a9b39b9745266c762b4926bef91e` |
| F18 | `247c6fc69bca989f92828d9a55e0819d475c350454f68f1c10c2e7a65a53e227` |
| S22 | `809065c8c7ff3c763f2fe007d5713c5de3bef6e360f0e9dfcd21ad5e8a2ad913` |
| E22 | `2dbd6a24349fd4f0c44748096275edd1c0e29d0d695fee7945dee7c5480969d3` |
| F22 | `75aa8865e5b9a747117eda7e8e72d0a58fe043cfd855dd0016cd433bf5118736` |

Reused, not regenerated:

- `recovery-6p-s18t1-s22-b86.md`: exact s22 final3 and s18 exercise/figure-scaffold provenance. Its earlier missing-final-S18 statement is superseded only for those bytes by the later static recovery.
- `tmp/b86-s18-final-static-recovery/recovery.json` and its existing call/stdout record: successful exact final recovery, 18428 bytes and the specified S18 SHA. The recovery script was read, not executed; no archive was reopened or serializer replayed here.
- `modern-text-review-c3-s15-s18t1.md`: full TEXT PASS and final boundary-only addendum reused. The report expressly excludes verifying inherited scientific simplifications. Initial and final bindings remain distinct; its stated byte-diff limitation is not erased.
- `modern-text-review-c3-s22-s25.md`: full TEXT_FIDELITY PASS reused, including its previously recorded translation-model limitation.
- `answer-source-c3-s22-s25.md`: existing source-first completion and s22 interpretation limits reused, not solved again, copied into learner material or newly approved.
- `figure61-recovery-repair-author-b86.md` and `figure-61-blocker.md`: dependency history only.

No general prior SCIENCE PASS is claimed. Reasoning below uses elementary
classical mechanics and qualitative fluid behavior; no actual uncertainty
required an outside lookup. Web calls and image budget used: zero.

## s18-t1: Required Repairs

### B1: Free Flight Scope — REVISE

Pointer: S18 `/prose/0/text`, source ref `p0082#6`,
[line 27](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-s18-final-static-recovery/FIRST/lesson.template.json:27).

“一切物体” in free flight is too unconditional: thrust, drag, cabin rotation,
internal contact forces and gravity differences can prevent the stated zero-load
condition. Keep the exploration opening and both questions.

Minimal clarification after the free-flight statement:
“本节先讨论共同自由下落的理想情况：没有推力或明显阻力，忽略舱内小范围的重力差异和转动影响，也不考虑额外的推拉作用。实际飞船中通常是近似失重。”

This supplies a shared ideal-model boundary, not a claim that every part of a
real spacecraft is force-free.

### B4: Hanging Equilibrium And Cutting — REVISE

Pointer: S18 `/prose/3/text`, refs `p0082#9,p0083#1`,
[line 74](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-s18-final-static-recovery/FIRST/lesson.template.json:74).

Equal upward elastic force and downward gravity give zero acceleration at that
instant; they do not stop an already moving mass. A hanging mass can pass through
equilibrium with nonzero speed. Cutting a real stretched spring also does not
erase its deformation or stored energy instantaneously.

Replace the stretching-to-balance clause with:
“挂好物体后，弹簧可能先上下振动；待振动因阻尼衰减、物体静止时，弹簧的弹力与重力大小相等、方向相反。”

Keep burning the line and the a/b references. Replace the immediate disappearance
claim with:
“烧断线后，弹簧和物体组成的系统开始下落，弹簧先回缩，并可能振动。图 61，b 表示卸载后的理想状态，不表示断线的瞬间弹簧就没有伸长。”

No prescribed settling time or guaranteed relaxation before impact is added.

### B6: Spring Interaction Versus Zero Weight — REVISE

Pointer: S18 `/prose/5/text`, ref `p0083#3`,
[line 105](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-s18-final-static-recovery/FIRST/lesson.template.json:105).

“一起下落” alone does not remove internal spring forces during recoil. The
whole system falling does not mean every component immediately has only gravity.
The existing distinction **weight zero, gravity nonzero is correct** and must stay.

Minimal replacement for the first two sentences:
“断线后的回缩、振动过程中，弹簧和物体仍可能相互作用。在忽略阻力和弹簧质量影响、各处重力近似相同，且回缩振动已衰减的理想共同自由下落状态中，弹簧不再因支承物体而伸长，物体也不再拉悬挂物。”

Keep the gravity clause, explicitly bind its exact zero to the ideal model:
“在这种理想状态下，物体的重量为零，但重力不为零；实际实验的瞬态不能直接当作这一状态。”

Do not replace this with “没有重力” or “断线瞬间弹力为零”.

### B9: Orbital Weightlessness — REVISE

Pointer: S18 `/prose/8/text`, refs `p0083#7,p0084#1`,
[line 148](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-s18-final-static-recovery/FIRST/lesson.template.json:148).

Orbital free fall is a sound explanation; exactly identical acceleration of
all spatially separated bodies is an approximation. Rotating cabin constraints,
tidal differences, thrust and drag cannot be silently included in zero load.

Retain the satellite/astronaut example, continuous-fall analogy and fig62
reference. Narrow the consequence:
“在没有推力和明显阻力、忽略飞船转动与舱内各处重力差异，并且没有额外推拉的近似下，物体和飞船共同自由下落，物体不再因通常的重量压支架或拉伸弹簧。这就是这里讨论的近似失重；地球的引力仍在作用。”

A rotating ship frame is not automatically a locally inertial frame.

### B12: Cabin Motion And Fluids — REVISE

Pointer: S18 `/prose/11/text`, ref `p0084#2`,
[line 191](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-s18-final-static-recovery/FIRST/lesson.template.json:191).

Keep all six original examples; repair their conditions in place:

| Existing Claim | Physics Problem | Minimal Modern Wording |
| --- | --- | --- |
| All unsecured objects freely glide | Unsecured is not the same as no other force or no relative initial motion. | “没有固定且不受其他明显作用的物体可以在舱内自由漂浮或运动。” |
| Liquid does not press bottom/walls, therefore cannot leak | Near-zero effective gravity removes the usual gravitational hydrostatic gradient, not all pressure or flow. Surface tension, wetting/container geometry, imposed pressure differences and pre-existing flow remain relevant. | “液体不会因自身重量向容器底部积聚；它的分布还受表面张力、润湿情况和容器形状影响。失重不表示液体对容器底和壁的压力为零，已有流动或内外压差仍可能使它从破口流出。” |
| Pendulum stays wherever placed | Loss of gravity-driven restoring action does not stop pre-existing motion. | “原来静止的摆没有通常的重力回复作用；原来已经运动的摆不会仅因失重而自动停止。” |
| Raising limbs takes no effort | Ordinary weight is unloaded, but starting/stopping motion still requires force; mass and joint/internal resistance remain. | “抬起胳臂或腿不必克服通常的重量，但使它们开始或停止运动仍需用力。” |
| Up/down disappears | Gravity/weight cues change; cabin-defined directions remain. | “由自身重量感觉到的上下方向不再明显，但舱内仍可以规定上下方向。” |
| Relative motion is straight and uniform until collision | An orbiting, rotating ship frame is not generally inertial. Even before collision, drag and gravity differences can change relative motion. | “在很小的区域和较短时间内，以随飞船自由下落且不转动的局部参考系观察，并忽略空气阻力、重力差异及其他作用时，物体相对这个参考系近似做匀速直线运动。若飞船转动或这些影响不可忽略，相对舱体的轨迹就未必是直线。” |

Do not say surface tension always prevents leakage, all fluids form one sphere,
all pressure vanishes, or long-term relative orbital motion must be straight.
The local-frame wording is not an exact, unlimited cabin-motion law.

## s18-t1: Scoped PASS And Nonphysical Entries

| Object / Pointer | Source Ref | Scientific Judgment |
| --- | --- | --- |
| B2, `/prose/1/text`, S18 line44 | p0082#7 | PASS: the explicitly recalled course convention defines weight as force on support/suspension. Do not substitute gravitational force for that convention. |
| B3, `/prose/2/text`, S18 line58 | p0082#8 | PASS: body and support both experience gravity; both questions remain unanswered prompts. B1 supplies the ideal joint-fall context. |
| B7, `/prose/6/text`, S18 line119 | p0083#4,p0083#6 | PASS within the ideal local joint-free-fall boundary: an unforced body does not need a support load. This is not proof that recoil, unequal drag, tidal acceleration or active pushing never produce contact force. No separate wording repair beyond B1 is necessary. |
| B13, `/prose/12/text`, S18 line205 | p0084#3 | PASS in scientific scope: a freely moving camera can collide painfully; weightlessness does not remove mass/inertia. Keep 格·斯·季托夫 and the historical collision account. Its historical attribution is reused, not newly verified. |
| B5/B8/B10/B11, `/prose/4`, `/prose/7`, `/prose/9`, `/prose/10` | p0083#2,#5,#8,#9 | NONPHYSICAL ENTRY: two figure markers and two captions retained as scope positions only. No scientific artwork or FIG PASS assigned. |

E18 has zero written tasks. Rhetorical prose questions are not new exercise IDs.

## s22: Required Repairs

| Object / Exact Pointer | Diagnosis And Minimal Repair |
| --- | --- |
| B1, `/prose/0/text`, refs `p0092#17,p0093#1`, [line16](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-template-recovery/template-recovery/FIRST/templates/phy6-c3-s22/lesson.template.json:16) | **REVISE:** keep saw, moving ship and hanging spring-body examples and `图 61. a`. Clarify force inventory with “这里列出的是主要外力，忽略空气浮力等较小作用。” Clarify ship propulsion with “船的牵引力是螺旋桨推水时，水对螺旋桨及船的反作用力。” Narrow spring “受两个力” to “在忽略其他作用时，主要受到重力和弹簧弹力。” These two forces need not be equal merely because a spring is stretched; rest requires a separate equilibrium condition. |
| B2, `/prose/1/text`, ref `p0093#2`, [line31](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-template-recovery/template-recovery/FIRST/templates/phy6-c3-s22/lesson.template.json:31) | **REVISE:** “每一种”“作用效果相同” cannot promise full equivalence of arbitrary extended-body force systems. Replace with “这里先把物体看作质点，或只研究它整体的平动；几个外力对这一运动的合成效果，可以用它们的合力来表示。物体的转动和形变不一定能用一个力完整代替。” Equal/opposite forces with separated lines of action can still turn an object. No new worked example or formula is needed. |
| B3, `/prose/2/text`, ref `p0093#3`, [line45](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-template-recovery/template-recovery/FIRST/templates/phy6-c3-s22/lesson.template.json:45) | **REVISE:** the definition must retain B2's scope even when read independently. Prefix its definition with “在上述只研究整体平动的范围内，” and replace “作用效果” with “对物体整体平动的作用效果”. No task answer is appended. |
| B4, `/prose/3/text`, ref `p0093#4`, [line59](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-template-recovery/template-recovery/FIRST/templates/phy6-c3-s22/lesson.template.json:59) | **REVISE:** force “和” is not an unconditional scalar sum. Keep the original composition/component terminology and add “这里的和要同时考虑力的大小和方向，不能不问方向就把大小相加；所合成的是作用在同一物体上的力，合力不是再加上的一个额外力。” No new equation or numerical result. |

**Wall/contact-reaction boundary:** no explicit wall example, wall-force law or
spring force-extension linearity claim occurs in these four target blocks.
Do not manufacture a new wall task or report a missing wall sentence as a defect.
The requested limitation is covered by B1/B2/B4: a wall or wooden board reaction
must be a force on the chosen body; the opposite force on the wall/board belongs
to another body's force inventory. They cannot cancel as two forces on one body.
Magnitude, distribution and rotational effects of a constrained contact reaction
are not determined by the resultant definition. Vector addition is not a claim
of linear material response, arbitrary wall response or full deformation
equivalence. No force-extension law, wall measurement or new datum is added.

## s22 Written Tasks

| Exact Object | Verdict / Repair |
| --- | --- |
| E22 `/exercises/0/text` and `/exercises/0/lines/0`, stable `g1 / number1 / source_number1`, ref `p0093#6`, [line10](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-template-recovery/template-recovery/FIRST/templates/phy6-c3-s22/exercises.template.json:10) | **PASS in the lesson's stated scope.** Keep the question unchanged; B2/B3 repair the teaching definition and prevent overgeneralization. No standalone new premise, formula or solution is inserted into this task. |
| E22 `/exercises/1/text` and `/exercises/1/lines/0`, stable `g1 / number2 / source_number2`, ref `p0093#7`, [line29](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b86-6p-template-recovery/template-recovery/FIRST/templates/phy6-c3-s22/exercises.template.json:29) | **PASS.** Keep the question unchanged; B4 clarifies the directional operation in the prose. No answer or task-ID change. |

Task PASS is not an approval of the unrepaired lesson or any answer key.

## UNKNOWN Versus REVISE

The source-bound prose does not state the actual spring recoil duration,
damping, time of observation or whether relaxation completes before landing;
nor does it specify cabin attitude/rotation, relative initial motions, container
wetting/shape, pressure difference or pre-existing flow. Those actual experimental
or intended source-model details are **UNKNOWN**, not inferred measurements or
proven editorial mistakes. In particular, whether the source meant panel b as
an instantaneous observation is UNKNOWN; no source figure was opened to decide.

These omissions do not make the nine repairable modern paragraphs unjudgeable.
**REVISE** means the unrestricted physical wording needs the explicit conditions
above; **UNKNOWN** means unavailable source/apparatus facts remain unresolved.
No prose or written task is assigned an UNKNOWN-only verdict, and no source
re-review/solve is requested to establish the elementary conditional repairs.

**Separate FIG61 dependency, Volta:** exact old spec/authoritativeText remains
missing, expected spec SHA
`f9c754ea8039bf8bb00bcafbb14fe6c082ca80a0222c5765fe835cbe825623c5`.
The historical FAIL and technical recovery history are unchanged. Text repair
proposals do not create that spec or approve its physics/artwork. Keep S18
ownership and s22's external a-panel reference. **FIG62 PASS is reused exactly
as instructed, untouched; no new FIG review or approval.**

## Counts And STOP

| Bounded Object Set | PASS | REVISE | Nonphysical / No FIG Verdict |
| --- | ---: | ---: | ---: |
| s18-t1 upper-level prose, 13 positions | 4 | 5 | 4 |
| s22 upper-level prose, 4 positions | 0 | 4 | 0 |
| s18-t1 written tasks, 0 | 0 | 0 | 0 |
| s22 written tasks, 2 | 2 | 0 | 0 |
| Total, 17 prose positions + 2 tasks | 6 | 9 | 4 |

New bounded SCIENCE diagnosis: **1**, 13 textual `p` blocks and 2 written tasks;
4 figure/caption positions excluded from physical approval. Nine paragraph
repair units, zero task repair units, zero UNKNOWN-only object verdicts.
Source/apparatus UNKNOWN details and the separate FIG61 dependency remain.

New TEXT/raw comparison/source solve/source gate/validators/prepares/finalizers/
renders/author edits/formula-data-ID changes/answers/canonical/index/Git/DB/
services/paid/browser/web/images/messages/descendants/setup/freshness: **all zero**.
Only diagnostic files were written. No producer, service or session was started.
No downstream integration, authoring or renewed approval is authorized here.

**STOP.**
