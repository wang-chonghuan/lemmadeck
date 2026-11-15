# Independent Modern Text Review: phy6-c3-s22–s25

Date: 2026-11-15. Ticket: STEMROBIN-180. Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

## Verdict and Scope

**TEXT_FIDELITY: PASS for all four bound lesson/exercise template pairs.** Complete comparison covers 42 source blocks, including all 28 `p` blocks, seven `fig` blocks and seven `cap` blocks, plus all 19 exercises. No omitted exercise, task clause, formula, group, source binding or figure reference was found. The two s23 exercise clarifications narrow/scaffold the interpretation as recorded below; they are not being described as identical unprompted tasks.

**External dependency remains BLOCKED:** s22 still refers to fig61(a). Its previously blocked status is supplied by main; this review neither rechecks nor approves that figure. s22 owns no local figure, and the cross-reference has not been deleted, replaced or silently repaired. This text PASS is not a combined text-and-image publication approval.

Banach's completion notification authorized reading the current scratch templates, not his notes/report or answers. Read only the lesson skill, applicable edition text contract, routed project instructions, the four raw lesson/exercise pairs, their current lesson/exercise templates and figure manifests, and the local paragraph helper. No author notes/report, authored answers, keys, choices, history, source pages or image pixels were opened. Original source page approvals are reused. No browser, app, DB, Git, dependency, service, rendering, finalize or publication action was performed.

## Snapshot Binding

All hashes below are SHA-256 of actual file bytes, not canonical JSON hashes. Paths are relative to the workspace. For every lesson/exercise template, `source.path` names the corresponding raw file below, `source.sha256` equals its actual byte hash, and `source.data` is structurally identical to the entire actual raw JSON. Every block/exercise `source_text` equals its actual raw text.

Raw root `R`: `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/`.

Modern scratch root `M`: `.tmp/ld-s10y-lesson/adapt/6p/modern-us-neutral/lessons/`.

| Root / Relative File | Byte SHA-256 |
| --- | --- |
| R / phy6-c3-s22/lesson.json | `de6a47b99ebdea0b7a982a4de7d061b7e5e92e951b90cb5b4a3e81e8436e218c` |
| R / phy6-c3-s22/exercises.json | `d3dfe51997d82d84cf840ec3764338b604629eef4a193fa81c5dc3471e26094c` |
| M / phy6-c3-s22/lesson.template.json | `809065c8c7ff3c763f2fe007d5713c5de3bef6e360f0e9dfcd21ad5e8a2ad913` |
| M / phy6-c3-s22/exercises.template.json | `2dbd6a24349fd4f0c44748096275edd1c0e29d0d695fee7945dee7c5480969d3` |
| M / phy6-c3-s22/figures.template.json | `75aa8865e5b9a747117eda7e8e72d0a58fe043cfd855dd0016cd433bf5118736` |
| R / phy6-c3-s23/lesson.json | `7076a4a2c4780af461e74f66e2943f1e28bcd34484fb1f3ae57e5f7ee1c41e3e` |
| R / phy6-c3-s23/exercises.json | `6079c218bb99fcaef5626bf802cf8a24564a68d107afd79e5d958db57c085bd8` |
| M / phy6-c3-s23/lesson.template.json | `01b0274797df4655d37db3dd0e15179d7addb19e88ce5f58f9170a851e8e73ea` |
| M / phy6-c3-s23/exercises.template.json | `2df5dd3ae194f06ccabd2471bd30fd3078fee93ebc2534a0b7dbf3c9f3674019` |
| M / phy6-c3-s23/figures.template.json | `88fc6f9f3dfffc62d5cbff82367fddbb0c2db8c9f1f55e316e4e4dbbbb642f3e` |
| R / phy6-c3-s24/lesson.json | `9b5094f12d4d4b588ff7bd04d8089cd0885fae32812e67ace7358f0a5e5dfedd` |
| R / phy6-c3-s24/exercises.json | `6da28034c18d9075a85abac4b8a473661c2308712452434f97f19b8761793805` |
| M / phy6-c3-s24/lesson.template.json | `abe61637a90bef1a81fce591e1cc606a1300dcb4b4aff5bc78a40b9061ebc0b3` |
| M / phy6-c3-s24/exercises.template.json | `42c92e76eb60f3bd427ef20ce77dbcee417925e476e2fac161edbcca73292c67` |
| M / phy6-c3-s24/figures.template.json | `3cacf7aeac2bac47e7666ecbdd6a47aa532ca305a5e11359fa1df63e507c2146` |
| R / phy6-c3-s25/lesson.json | `943f12e3012fb4fa364f374abb2cc0e7dcb4a7cbde8a4e3526477e88f1b75556` |
| R / phy6-c3-s25/exercises.json | `8b25925219a14f15e40527e8b542643abe52b93ed0c7973ecdc62e9eb31e7655` |
| M / phy6-c3-s25/lesson.template.json | `61244052e85a407cb5d5e37c772a21d3da6690751ee8bb7542d0e0146656af05` |
| M / phy6-c3-s25/exercises.template.json | `70192a95fa0209778b99277a601d3c24d4fb3d58b00c38ff1454d2f8c14fbc06` |
| M / phy6-c3-s25/figures.template.json | `340275423106629b87093599c68d199ceb7c012ee023b190e0cc0462db8d5c23` |

## Complete Inventory and Checks

Counts were derived from actual JSON and the existing `htmlfrag.js` `proseOutline`/`proseParagraphs` helpers, not from the author's stated paragraph count. Adjacent section anchors were resolved with `sectionBreakIndices`.

| Lesson | Source Blocks | Source p | Modern Paragraphs | Exercises | Local Figure IDs | Resolved Break Indices, Zero-Based |
| --- | --- | --- | --- | --- | --- | --- |
| s22 | 4 | 4 | 5 | 2 | none | 2 |
| s23 | 18 | 10 | 11 | 7 | fig-70, fig-71, fig-72, fig-73 | 5, 9 |
| s24 | 13 | 9 | 13 | 7 | fig-74, fig-75 | 5, 9, 11 |
| s25 | 7 | 5 | 6 | 3 | fig-76 | 3, 4 |
| Total | 42 | 28 | 35 | 19 | 7 | 8 valid boundaries |

Read-only Node assertions completed with exit 0:

- All raw top-level identities, titles, printed titles, chapter/section, page positions, figure lists and exercise counts match the corresponding modern fields.
- Every source block preserves its position, kind, id, label, printed page and ordered `source_refs`.
- Every exercise preserves its position, `number`, `source_number`, `group`, `group_id`, `pages`, `figure_refs` and `figures`. All modern `lines` joined with newlines equal actual modern `text`.
- All ordered inline math tokens match source exactly, including all numbers, `F_1`, `F_2`, `R` and the two subtraction examples. All `numeric_changes` are empty; no `math-correction` or registered erratum is present.
- Removing only the three specifically identified clarification additions below, and accounting for whitespace, broken adjacent bold delimiters and the explicit Latin panel-label mapping, reproduces every source block and exercise text. This comparison supplements, not substitutes for, the complete semantic reading.
- All eight final-paragraph boundaries resolve to unique, adjacent, strictly increasing pairs. No prose section is dropped by a break.

There are no separate enumerated internal subparts in these 19 exercise objects. Multi-clause tasks, especially s23 g2-2/g2-3 and the experimental questions, remain complete; they are not counted as invented extra exercises.

## Every Source Block

Block numbers below are one-based positions within `prose`. Each row was compared in full. `PASS` means text fidelity at that position, not approval of referenced image pixels.

| Lesson / Block / Kind | Source Refs | Semantic Check and Verdict |
| --- | --- | --- |
| s22 / 1 / p | p0092#17, p0093#1 | PASS: saw muscle/resistance/gravity; ship propulsion/water and air resistance/gravity/buoyancy; suspended body's gravity and spring force all retained. Two modern paragraphs. fig61 Cyrillic `а` becomes Latin `a`; external dependency remains. |
| s22 / 2 / p | p0093#2 | PASS: substitution by a force with the same effect retained, within the lesson's force-composition model. |
| s22 / 3 / p | p0093#3 | PASS: definition of resultant retained; only broken adjacent bold markup joined. |
| s22 / 4 / p | p0093#4 | PASS: composition, sum of forces and component-force terminology all retained. |
| s23 / 1 / p | p0093#9 | PASS: same object, same line, same/opposite direction scope retained. |
| s23 / 2 / p | p0093#10 | PASS with declared clarification: 0.1/0.2 kg, 1/2/3 N, measured spring length and replacement trial retained. Explicit local rounded mass-to-weight context; 70(a)/(b) retain roles. |
| s23 / 3 / p | p0093#11, p0094#3 | PASS: same-direction resultant has their direction and magnitude sum. |
| s23 / 4 / fig | p0094#1 | PASS: fig-70 block, position and binding retained; no image review. |
| s23 / 5 / cap | p0094#2 | PASS: caption 图70 retained. |
| s23 / 6 / p | p0094#4 | PASS: resultant R and components F1/F2 retained exactly in math. |
| s23 / 7 / fig | p0094#5 | PASS: fig-71 block retained. |
| s23 / 8 / fig | p0094#6 | PASS: fig-72 block retained. |
| s23 / 9 / cap | p0094#7 | PASS: caption 图71 retained. |
| s23 / 10 / cap | p0094#8 | PASS: caption 图72 retained, including source ordering of the two figures and captions. |
| s23 / 11 / p | p0094#9, p0095#1 | PASS: 5 N downward load, cord and 2 N upward pull retained; 72(a)/(b) preserve trial roles. |
| s23 / 12 / p | p0095#2 | PASS: indicated 3 N, component difference and source subtraction expression retained. |
| s23 / 13 / p | p0095#3 | PASS: opposite-direction resultant magnitude difference and larger-component direction retained; bold markup repaired only. |
| s23 / 14 / p | p0095#4 | PASS: fig73, opposite components F1/F2 and resultant R retained; spacing only. |
| s23 / 15 / p | p0095#5, p0095#8 | PASS: equal/opposite forces, 5 N upward trial, zero indication and 5−5=0 retained. |
| s23 / 16 / fig | p0095#6 | PASS: fig-73 block retained. |
| s23 / 17 / cap | p0095#7 | PASS: caption 图73 retained. |
| s23 / 18 / p | p0095#9 | PASS: rest OR uniform rectilinear motion retained; not replaced by “necessarily stops.” |
| s24 / 1 / p | p0096#7 | PASS: sled/skater/bicycle, inertia, slowing and force causing speed changes all retained, in three short paragraphs. |
| s24 / 2 / p | p0096#8 | PASS: source's moving-contact friction definition and fig74 reference retained; limited interpretation recorded below. |
| s24 / 3 / fig | p0096#9 | PASS: fig-74 block retained. |
| s24 / 4 / cap | p0096#10 | PASS: caption 图74 retained. |
| s24 / 5 / p | p0097#1 | PASS: distinction from gravity and elasticity retained. |
| s24 / 6 / p | p0097#2 | PASS: apparent smoothness, microscopic irregularities, enlarged 75(a), and obstruction during sliding/rolling retained. |
| s24 / 7 / fig | p0097#3 | PASS: fig-75 block retained. |
| s24 / 8 / cap | p0097#4 | PASS: caption 图75 retained. |
| s24 / 9 / p | p0097#5 | PASS: molecular attraction as another source mechanism retained. |
| s24 / 10 / p | p0097#6 | PASS: rough versus very smooth contact and close molecular spacing retained; no unsupported “smooth means no friction” addition. |
| s24 / 11 / p | p0097#7, p0098#1 | PASS: lubrication, separated surfaces, liquid layers, ice water-film explanation and engineering oil use retained; 75(b) retains role. |
| s24 / 12 / p | p0098#2 | PASS: sliding friction, sled and skis retained. |
| s24 / 13 / p | p0098#3 | PASS: rolling friction, train/car wheels, logs and barrels retained. |
| s25 / 1 / p | p0098#13, p0099#3 | PASS: dynamometer, uniform sliding, opposite horizontal pull/friction, zero horizontal resultant and equal magnitudes retained; 76(a) mapping retained. |
| s25 / 2 / fig | p0099#1 | PASS: fig-76 block retained. |
| s25 / 3 / cap | p0099#2 | PASS: caption 图76 retained. |
| s25 / 4 / p | p0099#4 | PASS: reading the pull on an uniformly moving body determines friction retained. |
| s25 / 5 / p | p0099#5 | PASS: added weight/hand pressure, remeasurement and increased pressing force/increased friction retained. |
| s25 / 6 / p | p0099#6 | PASS: two rods, rolling experiment and comparison with sliding retained; 76(b) mapping retained. |
| s25 / 7 / p | p0099#7 | PASS: equal-load condition explicitly retained in the rolling-versus-sliding conclusion. |

## All 19 Exercise Units

Exercise group `g1` is `问题` throughout. Only s23 also has `g2`, printed `练习 17`; its stable IDs are `g2-1`, `g2-2`, `g2-3`, while printed numbers remain 1, 2, 3. No cross-group collision was flattened. Every exercise has empty source and modern `figure_refs`/`figures`; neither a figure nor an answer diagram was added to a prompt.

| Lesson / Stable Number / Group | Source Pages | Retained Complete Task and Verdict |
| --- | --- | --- |
| s22 / 1 / g1 | p0093#6 | PASS: define a resultant by equivalence of simultaneous effects. |
| s22 / 2 / g1 | p0093#7 | PASS: define force composition. |
| s23 / 1 / g1 | p0095#11 | PASS: independently supply a same-line, same-direction example, not merely name the formula. |
| s23 / 2 / g1 | p0095#12 | PASS: describe the determining experiment AND state the resultant. |
| s23 / 3 / g1 | p0095#13 | PASS: opposite-direction resultant, including its direction and equal-force boundary. |
| s23 / 4 / g1 | p0096#1 | PASS: motion under equal/opposite forces; source does not specify initial rest. |
| s23 / g2-1 / g2 | p0096#3 | PASS with interpretation limit: 70 kg person, 20 kg box and force on ground retained; modern prompt explicitly selects the local 10 N/kg approximation. General source solution remains 90g, not silently overwritten. |
| s23 / g2-2 / g2 | p0096#4 | PASS with scaffold limit: all four forces 330/380 versus 300/400 N, motion question and complete resultant question retained. Added explanation distinguishes acceleration from instantaneous velocity but supplies neither arithmetic result nor winning-side identification. |
| s23 / g2-3 / g2 | p0096#5 | PASS: uniform descent, combined 700 N gravity, air resistance magnitude, chosen scale, both vectors and common point on their line of action all retained. |
| s24 / 1 / g1 | p0098#5 | PASS: observations AND experiments demonstrating friction, with open examples retained. |
| s24 / 2 / g1 | p0098#6 | PASS: define friction in the lesson's contact-motion context. |
| s24 / 3 / g1 | p0098#7 | PASS: explain causes, not merely list examples. |
| s24 / 4 / g1 | p0098#8 | PASS: effect of lubrication AND mechanism retained. |
| s24 / 5 / g1 | p0098#9 | PASS: identify friction categories; no new forced taxonomy. |
| s24 / 6 / g1 | p0098#10 | PASS: circumstances for sliding friction retained. |
| s24 / 7 / g1 | p0098#11 | PASS: rolling-friction definition retained. |
| s25 / 1 / g1 | p0099#9 | PASS: describe how to measure friction, with uniform-motion condition from the lesson retained. |
| s25 / 2 / g1 | p0100#1 | PASS: experimental demonstration of dependence on pressing force retained. |
| s25 / 3 / g1 | p0100#2 | PASS: experimental comparison of sliding/rolling under equal load retained. |

## Clarifications, Fidelity and Leakage

Only three units contain substantive additions beyond layout and panel-label conversion:

1. **s23 prose block 2:** adds “本实验按每千克质量对应十牛顿重力的近似口径估算，质量与重量仍是不同的物理量.” and “按这一近似口径，” before the 1 N/2 N statement. Both belong to `changes: clarification`. The raw example already uses 0.1 kg → 1 N and 0.2 kg → 2 N, so the addition makes the local rounded convention explicit without changing those source values or asserting mass equals force. At g=9.8 N/kg the corresponding exact model values would be 0.98/1.96/2.94 N; 1/2/3 N are the rounded-context values, not exact consequences of 9.8.
2. **s23 g2-1:** adds “按本课每千克质量对应十牛顿重力的近似口径估算.” with `clarification`. This deliberately specifies a convention that the isolated raw exercise does not state: modern requested result is approximately 900 N, whereas the general static source expression is 90g N, giving 882 N for g=9.8 N/kg. Acceptance of this source-supported local approximation does not turn 9.8 into 10 everywhere, nor authorize discarding the 882 N branch from the independent source solution. This removes the learner's choice/recognition of gravitational convention and is a recorded task limitation.
3. **s23 g2-2:** adds “合力的方向是它使绳的速度变化（加速度）的方向；绳当前的移动方向还取决于初始运动状态.” with `clarification`. This is a correct warning about underdetermination in the original motion wording, not an invented initial-rest condition. It leaves the 710 versus 700 N calculation, resultant magnitude and direction, and conditional motion answer to the learner. It does give the conceptual distinction as scaffolding, so independent discovery of that distinction is no longer fully tested.

No prompt contains a newly inserted numerical answer, completed vector drawing, measured experiment result or fixed scale. Definitions and worked experiments in lesson prose are source teaching content, not new answer-key leakage. All other additions are line/paragraph/bold layout or Cyrillic-to-Latin figure-panel labels. No names or historical entities needed replacement, and the current learner-facing text has no remaining Cyrillic panel letters.

## Specific Limits and Dependencies

- **fig61(a):** s22 first source block keeps the suspended spring-body reference. Modern Latin `a` denotes the same source panel. Both s22 figure manifests are empty as to local ownership; this external, previously BLOCKED figure cannot be approved by text fidelity, reused as a newly approved illustration or solved by removal.
- **Other figures:** s23/s24/s25 manifests retain fig70–76 identities. This report reads manifests only; it does not certify their modern geometry, themes, mobile rendering or independent image-review status.
- **Effect equivalence:** s22's “one force replaces several” is the source's resultant/translation model, not a claim that arbitrary force systems on extended rigid bodies, including couples, always have full rotational equivalence to one force.
- **Support and instrument scope:** pressure here is a force in N, not stress in Pa. The 70+20 kg exercise uses normal standing/no vertical acceleration and no other vertical support. s23's 3 N instrument indication is the remaining support needed against the specified 5 N down/2 N up components, not a nonzero total net force on a statically supported load. The source demonstrations tacitly neglect or tare apparatus weight.
- **Motion:** zero resultant does not imply rest, and a 10 N resultant does not determine instantaneous velocity. Neither source nor modern g2-2 supplies an initial velocity; any unconditional “the rope is currently moving toward the stronger team” would be incorrect.
- **Source-inherited friction scope:** s24 describes sliding/rolling contact resistance in its examples. Its “opposite motion” language must not be generalized to every static-friction situation or to every object's laboratory-frame velocity. Smooth surfaces can still have contact attraction; the source's microscopic account is an elementary model, not a complete theory of rolling loss or ice-film formation.
- **Source-inherited force-inventory shorthand:** s25 says the block has two forces while immediately listing rightward pull and leftward friction. This is valid only as a horizontal force analysis; the actual supported block also has downward gravity and upward normal force. Those vertical forces must not disappear from later full free-body inventories. The unchanged shorthand is recorded, not endorsed as a literal total-two-forces claim.
- **Experimental and numerical limits:** equal speed, horizontal pull, common surfaces, controlled load and zeroed instrument are necessary for the proposed friction comparisons. An observed “larger/smaller” relation does not determine a coefficient, exact ratio, instrument precision or universal law for every contact pair. No measured numbers or visual tick-to-force multipliers are fabricated.
- **Production coverage:** textual solutions can provide experiment protocols, examples and a vector-construction specification. They cannot claim a learner has actually generated an example, drawn and measured the scaled vectors, operated the apparatus or collected repeated data. s23 g2-3's selected scale and full drawing requirement, s24's observations/experiments and s25's practical demonstrations remain live tasks.

## Closure

Independent full text comparison is COMPLETE for this snapshot; no text repair unit is requested. s22 retains its external BLOCKED fig61(a) dependency. Source-first solutions for all 19 exercises are separately frozen in `answer-source-c3-s22-s25.md`; no author-key comparison has occurred. No approval of images or publication is implied.
