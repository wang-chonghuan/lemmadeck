# STEMROBIN-180 Batch57: Independent Complete TEXT Review

Date: 2026-11-17. First independent verdict on the current four scoped templates: **REVISE for all four lessons**. This is a substantive text review, not source-transcription approval, gate finalization, or publication approval.

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

Template root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/work/adapt/8p/modern-us-neutral/lessons`.

Approved raw lesson root: `/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/8p/lessons`.

Read the lesson skill, `modern-us-neutral` profile, edition text contract, and live Plane ticket. Compared each current template with its approved raw lesson, embedded source snapshot, and `source_text`; independently judged the learner-facing physics. No previous text verdicts or residual findings were imported.

**Scope:** exactly the four IDs below; all 21 raw/template prose blocks and all 23 actual final proseFlow paragraphs. Exercises: **0**. Figures within these summaries: **0**. Actual images opened: **0**. Neighboring-page exercise/figure material is not part of this review.

## First Verdict

Indices below are zero-based JSON `prose[]` and proseFlow indices; `pNNNN#N` is the exact approved source block reference.

| Lesson | Verdict | Exact affected source blocks |
| --- | --- | --- |
| `phy8-c2-s2-t13` | **REVISE** | `p0171#5`: static/sliding friction conditions, direction, and dependence are overgeneralized. `p0170#13` + `p0171#1`: unqualified Hooke-law applicability. `p0171#2`, `p0171#4`, `p0171#5`: final emphasis defects; the last also produces an isolated `*` paragraph. |
| `phy8-c2-s3-t14` | **REVISE** | `p0211#6`: “任何力学问题” lacks Newtonian applicability scope. `p0211#7`: point-particle modeling and pure-translation conditions are overstated, omitting torque and initial rotation. `p0211#8`: non-inertial-frame acceleration is categorically attributed away from real force. |
| `phy8-c3-s1-t7` | **REVISE** | `p0230#12`: denial/exclusion of unstable equilibrium is physically wrong. `p0230#10` + `p0230#11`: scalar torque sum and positive magnitude product need their common-axis/sign scope. |
| `phy8-c4-s1-t5` | **REVISE** | `p0242#9`: equal impulse gives equal **momentum change**, not equal final momentum without an initial-momentum condition; the force must be the net force, constant during the stated interval for the displayed product. |

## Substantive Findings

### phy8-c2-s2-t13: REVISE

**[P1] `prose[6]`, `p0171#5`, final paragraphs 6-7.** The paragraph introduces both static and sliding friction, then gives both the same “opposite to relative motion” rule. Static friction can be nonzero when relative velocity at the contact is zero; its direction opposes the tendency to relative slipping. “静止/运动” must refer to relative contact motion, not absolute motion in a chosen laboratory frame. The further statement that friction is unrelated to relative coordinates but related to relative velocity cannot serve as a general determination rule: the same zero relative velocity can accompany different static friction forces, and the usual sliding-friction approximation need not vary with speed. Required revision: separate these stated cases and qualify the dependence within the model being summarized. Do not replace the original subject with new friction theory.

**[P2] `prose[2]`, `p0170#13` + `p0171#1`, final paragraph 2.** Deformation as the origin of elastic force is acceptable; the text does not require deformation to keep changing while the force persists. However, “它由下列方程（胡克定律）来确定” treats the linear law as unrestricted. Its linear elastic/small-deformation applicability must be qualified. The existing `$F=-kx$` is not a sign error: it describes a signed restoring-force component against signed deformation with positive stiffness, not a negative force magnitude. Preserve the expression and Hooke identity; do not silently change it to a magnitude formula.

**[P2] `prose[3]`, `p0171#2`; `prose[5]`, `p0171#4`; `prose[6]`, `p0171#5`.** Source-wide italic intent survives as literal delimiters but not on the final learner-facing surface. Actual `proseFlow` followed by `proseInline` yields no `<em>` and visible residual `*` for final paragraphs 3, 5, 6, and 7. Paragraph 7 consists only of `*`; the friction closing delimiter was separated from its text by a blank line. For paragraphs 3 and 5, rendering the raw text through the same inline renderer also fails: newlines in the generated vector-formula HTML prevent the italic match. Those two are an existing rendering limitation, not a newly authored physics error. The friction split is a current layout regression. None may be counted as “emphasis preserved” on the final surface. This report does not edit the renderer or templates.

**Scope and formulas:** “在力学中所讨论的力” is read as the macroscopic mechanics of this chapter, not a claim that all interactions in nature reduce to two. No additional interaction taxonomy is required. The gravitational expression has a magnitude bar around the force vector, positive masses, and the square of separation in the denominator; preserve that meaning in its usual point-mass/spherical-body model rather than extending it to arbitrary mass distributions. `$m|\vec{g}|$` is likewise a magnitude, not a signed component or an apparent-weight formula. The near-Earth constant-force statement is explicitly an approximation for fixed mass and height changes small compared with Earth's radius; that qualifier is present and correct. The internal `.在` in final paragraph 0 is still joined rather than normalized into separate sentence lines; this is a minor layout observation, not a separate physics failure.

### phy8-c2-s3-t14: REVISE

**[P2] `prose[0]`, `p0211#6`, final paragraph 0.** “利用牛顿定律解任何力学问题” overclaims the domain. The summary must retain the source's force-plus-initial-data method while restricting it to the Newtonian model and an appropriate inertial-frame formulation; knowing a force law does not make Newtonian mechanics universally applicable. No new relativity/quantum lesson or numerical threshold is requested.

The remainder of this block correctly distinguishes **net force determining acceleration** from determining instantaneous velocity. With the mass/model specified, acceleration follows the resultant force; motion need not follow that force's direction. Initial coordinates and initial velocity are explicitly supplied in the opening sentence. Final paragraph 1's emphasis on initial velocity does not delete the already stated initial coordinates, so it is not a separate missing-initial-position finding. Do not change “acceleration” to “velocity,” or infer equal accelerations for unequal masses under equal force.

**[P1] `prose[1]`, `p0211#7`, final paragraph 2.** “只有当物体平动时” is not the general criterion for a point-particle approximation: it depends on which motion/size/rotation effects the problem needs to resolve, and center-of-mass translation remains describable when a body rotates. A resultant's line through the center of mass does not alone establish pure translation. A force system may have a nonzero couple that a single resultant omits; even zero torque does not remove pre-existing rotation. “否则” also cannot universally guarantee translation plus rotation: a couple can produce rotation without center-of-mass acceleration. Required revision: distinguish center-of-mass motion from full-body motion, and make zero relevant torque and initial rotational state explicit where claiming maintained pure translation. These are defects in the retained raw assertions, not author-added changes.

**[P2] `prose[2]`, `p0211#8`, final paragraph 3.** The non-inertial-frame definition is acceptable as an accelerating frame relative to an inertial frame. But “牛顿力学定律是不正确的” needs the scope of the usual unmodified inertial-frame equations. More importantly, “物体的加速运动不是物体受力引起的” wrongly denies any contribution of real forces. In such a frame acceleration **can occur without a real net force**, but real forces can also contribute. An object can have constant velocity relative to an accelerating frame despite a nonzero real resultant; that possibility is correct. Required revision: replace the categorical denial with the appropriate possibility/applicability qualification, without adding a new inertial-force derivation.

### phy8-c3-s1-t7: REVISE

**[P1] `prose[5]`, `p0230#12`, final paragraph 5.** Exact current text:

> 物体的各种平衡实际上是不存在的，只可能存在稳定平衡或随遇平衡。

The literal “各种平衡不存在” is internally inconsistent with then allowing two kinds. Even if its intended subject were unstable equilibrium, the exclusion would remain wrong. Unstable equilibrium is a valid equilibrium configuration satisfying the equilibrium conditions; a small displacement produces a resultant force or torque that drives the body farther away. Difficulty maintaining it against perturbations is not nonexistence. The preceding building-design context supports a preference for stable equilibrium, not a prohibition on unstable equilibrium in physics. Required revision: remove the categorical denial/exclusion and preserve the distinction between equilibrium and stability. Do not silently reinterpret “各种” as an approved transcription correction or fabricate source errata.

**[P2] `prose[3]` + `prose[4]`, `p0230#10` + `p0230#11`, final paragraphs 3-4.** The scalar “力矩的代数和” is valid for a specified common axis in the planar/fixed-axis setting, with opposite rotational senses assigned opposite signs. It cannot be an unrestricted three-dimensional scalar test. The positive product of force magnitude and perpendicular moment arm gives the **magnitude** of that torque, not its algebraic sign. Required revision: make the existing axis scope and magnitude/sign distinction unambiguous. Preserve the force-vector sum, both zero conditions, and numbered order; do not add new formulas or replace a signed torque sum by a sum of positive magnitudes.

The opening design context, force geometric/vector sum, and small-displacement restoring-force definition of stable equilibrium are otherwise acceptable. “使它回到” describes a restoring tendency; it need not mean asymptotic settling without damping. The two balance conditions are necessary, as the text says; maintained static rest additionally presupposes initial rest and is consistent with the opening building context. This is not a separate demand to add dynamics.

### phy8-c4-s1-t5: REVISE

**[P1] `prose[1]`, `p0242#9`, final paragraph 1.** Exact current text:

> 在一定时间 $t$ 内作用的同一个力 $\vec{F}$，使所有物体都产生相同的动量，它等于力的冲量 $\vec{F}t$。

Equal vector impulse gives equal **change** in vector momentum. Final momentum also contains initial momentum. Symbolically, for the stated constant-resultant model, the diagnostic relation is `p_final = p_initial + F t`, with all momentum/force quantities understood as vectors. Different initial momenta therefore remain different after the same impulse. Equal final momenta require equal initial momenta; equality of final momentum to impulse requires zero initial momentum. The current sentence states neither condition. “产生” does not adequately distinguish a change from the total, because “它等于” then equates momentum itself to impulse.

The force in the total momentum-change statement must be the **net external force** on the selected object/system, not merely one common applied force while other forces differ. The existing `F t` product also assumes a force constant throughout the stated duration, or an explicitly identified average force; do not silently treat a varying instantaneous force as constant. Required revision: state equal momentum change and the force/time conditions, or explicitly restore the initial-rest case if that is the author-approved intention. Preserve `$t$`, `$\vec{F}$`, `$\vec{F}t$`, their vector character, and all source quantities; no new numerical example or calculus formula is requested.

`prose[0]`, `p0242#8` correctly defines momentum as a vector equal to mass times velocity in the chapter's classical model. `prose[2]`, `p0242#10` is introductory rather than a stand-alone promise that every object's momentum is conserved. `prose[3]`, `p0242#11` supplies the isolated-system condition and correctly refers to the **system total**, not each object's momentum. Its bold emphasis is correctly rendered. Keep that condition attached to the conservation statement; do not remove it while fixing the impulse sentence.

## Complete Block Coverage

PASS below means that block's reviewed statement is acceptable in its stated chapter/model context, not that its containing lesson passes.

| Lesson | `prose[]` | Exact source | Block judgment |
| --- | --- | --- | --- |
| `phy8-c2-s2-t13` | 0 | `p0170#11` | PASS physics with chapter-mechanics scope; minor joined sentence layout noted above. |
| `phy8-c2-s2-t13` | 1 | `p0170#12` | PASS: elastic/contact friction forces have electromagnetic origin. |
| `phy8-c2-s2-t13` | 2 | `p0170#13`, `p0171#1` | REVISE applicability qualifier; restoring-force sign, formula and Hooke identity preserved. |
| `phy8-c2-s2-t13` | 3 | `p0171#2` | PASS formula/model meaning; REVISE final emphasis surface. |
| `phy8-c2-s2-t13` | 4 | `p0171#3` | PASS: dependence on relative configuration within the models discussed. |
| `phy8-c2-s2-t13` | 5 | `p0171#4` | PASS near-Earth approximation and magnitude; REVISE final emphasis surface. |
| `phy8-c2-s2-t13` | 6 | `p0171#5` | REVISE friction qualifications and split emphasis/isolated delimiter. |
| `phy8-c2-s3-t14` | 0 | `p0211#6` | REVISE universal applicability claim; PASS initial data, resultant/acceleration distinction, trajectory explanation and four emphasis spans. |
| `phy8-c2-s3-t14` | 1 | `p0211#7` | REVISE point-particle/pure-translation/rotation claims. |
| `phy8-c2-s3-t14` | 2 | `p0211#8` | REVISE categorical non-inertial claims; retain valid frame-relative-motion possibility. |
| `phy8-c3-s1-t7` | 0 | `p0230#7` | PASS building/static-equilibrium context. |
| `phy8-c3-s1-t7` | 1 | `p0230#8` | PASS statement that two conditions are necessary. |
| `phy8-c3-s1-t7` | 2 | `p0230#9` | PASS force geometric/vector sum equals zero; first numbered condition preserved. |
| `phy8-c3-s1-t7` | 3 | `p0230#10` | REVISE common-axis/planar scope for algebraic torque sum; second condition and zero preserved. |
| `phy8-c3-s1-t7` | 4 | `p0230#11` | REVISE magnitude versus signed torque; retain perpendicular moment-arm meaning. |
| `phy8-c3-s1-t7` | 5 | `p0230#12` | REVISE denial/exclusion of unstable equilibrium. |
| `phy8-c3-s1-t7` | 6 | `p0230#13` | PASS stable-equilibrium restoring tendency for a small displacement. |
| `phy8-c4-s1-t5` | 0 | `p0242#8` | PASS classical vector momentum definition. |
| `phy8-c4-s1-t5` | 1 | `p0242#9` | REVISE total versus changed momentum, initial data, net/constant-force conditions. |
| `phy8-c4-s1-t5` | 2 | `p0242#10` | PASS introductory conservation statement when read with the immediately following isolated-system condition. |
| `phy8-c4-s1-t5` | 3 | `p0242#11` | PASS isolated-system total-momentum statement and final bold emphasis. |

## Current Hashes and Counts

SHA-256 is over each file's actual bytes, not reformatted JSON. `L`, `E`, `F` mean `lesson.template.json`, `exercises.template.json`, `figures.template.json` under the template root and named lesson ID.

| Lesson | File | SHA-256 | Bytes |
| --- | --- | --- | ---: |
| `phy8-c2-s2-t13` | L | `81d93825c7f52a1bfc9cd7264e5ba6a89da47758d7937426a67bb04fe54b8c51` | 7817 |
| `phy8-c2-s2-t13` | E | `3367a7ef8e6486355b5472cfa9d8648b040740c8e89b7576f08ca23b646c092f` | 419 |
| `phy8-c2-s2-t13` | F | `fbd79ea734d088db396d8b444cc947a3faff52e56e42f3d9ebe165a0e8273801` | 153 |
| `phy8-c2-s3-t14` | L | `9ba22f3fa61b41c7c7692b4cd744d676ada35b5e61c20d486d9f1f0e25fa84a1` | 5837 |
| `phy8-c2-s3-t14` | E | `44e8d280a69c9d6653155bb63f53244c0f9d65b86eb17962e83174af008368c4` | 419 |
| `phy8-c2-s3-t14` | F | `5ee22c33449b303f5253e3e465c454b4dfbd4f9ffe366736177c9973b249d616` | 153 |
| `phy8-c3-s1-t7` | L | `615f0e24e919f99d95b21fafb999161a9379c057a598cce6f4ce7e8a5fb22c2d` | 6200 |
| `phy8-c3-s1-t7` | E | `768f6607c7954e0a4d039f8c99a311d3846576a967fc59b5b582b3d4b8cbb28d` | 416 |
| `phy8-c3-s1-t7` | F | `c56e1e22e5ca5404f47ebcdb7d0f1267053087d998267734568ca93b7e25dba1` | 152 |
| `phy8-c4-s1-t5` | L | `4d7dfccabc6890f21d7597a56e4e732348919ebddc0b675fd154a263d220d4ae` | 4192 |
| `phy8-c4-s1-t5` | E | `08b38ae6608fc07608d842115b66f5cccd96745f1f0d3599d7bb0298357bc8ef` | 416 |
| `phy8-c4-s1-t5` | F | `3b973d58e1bf492eae16b48dfd83435427bb87a01577f4a165a42030b892a578` | 152 |

| Lesson | Raw/template prose blocks | Final proseFlow paragraphs | Exercises | Lesson/figure-list figures | Section breaks | Errata |
| --- | ---: | ---: | ---: | --- | ---: | ---: |
| `phy8-c2-s2-t13` | 7 / 7 | 8, including one isolated delimiter | 0 | 0 / 0 | 0 | 0 |
| `phy8-c2-s3-t14` | 3 / 3 | 4 | 0 | 0 / 0 | 0 | 0 |
| `phy8-c3-s1-t7` | 7 / 7 | 7 | 0 | 0 / 0 | 0 | 0 |
| `phy8-c4-s1-t5` | 4 / 4 | 4 | 0 | 0 / 0 | 0 | 0 |
| Total | 21 / 21 | 23: 22 text-bearing, 1 delimiter-only | 0 | 0 / 0 | 0 | 0 |

All four lesson and exercise source SHA fields match the current approved raw file bytes; all embedded `source.data` objects match those raw JSON objects. Raw lesson SHA-256 values:

```text
phy8-c2-s2-t13 0304038ec6cc47a69f22088e5296941e86354730042fcb2a92eafc2b0d1cb095
phy8-c2-s3-t14 e54dd2832a58ff0d503d560174034a724532a83b2f5abc83bff281447c06ad5f
phy8-c3-s1-t7  9a4d8fa7b70c40f359300954b08604692b0d04b9f2dc589b9b7c8e96ceb6ca5a
phy8-c4-s1-t5  12ca6cc376c3125173fb6eb024034faba296ef22a6d2d08d9287559bec99a782
```

Every `source_text` and ordered `source_refs` matches its raw prose block. All source words, quantities, formulas, signs, vector arrows and magnitude bars remain unchanged after allowing whitespace and period normalization. This proves fidelity, **not** scientific correctness. All `numeric_changes` are empty. Changed text blocks declare only `layout`; unchanged statics introduction/first numbered condition declare no change.

The exact ordered math payloads remain `F=-kx`, `|\vec{F}|=G\frac{m_1m_2}{r^2}`, `m|\vec{g}|`, and, in the impulse block, `t`, `\vec{F}`, `\vec{F}t`. All parse through the installed KaTeX with `throwOnError: true`. Their force/impulse dimensions are consistent; the incorrect momentum sentence is a physical-meaning defect, not a malformed formula. The numbered equilibrium conditions retain `1)`/`2)` and both zero values.

Hooke is declared at `phy8-c2-s2-t13.prose[2].historical_entities`; Newton is declared at `phy8-c2-s3-t14.prose[0]` and `[2]`. Each retained term occurs in both its source text and modern text, with the law-specific reason and the surrounding source reference. No fictional names, institutions, currency conversions, forbidden cultural terms, or Cyrillic enumeration occur. Titles and source instructional context are preserved.

## Exact Final ProseFlow

Observed with the repository's read-only `prose_flow.mjs --json <lesson.template.json>`. The following strings are the exact paragraph texts, in final order; JSON `\n` denotes an actual line break. All resolved section-break lists are empty. No paragraph count was inferred from raw block counts.

### phy8-c2-s2-t13

```json
[
  "*自然界中所有已知的力，都是几种相互作用形式的表现.在力学中所讨论的力，总共是两种相互作用形式（电磁的和引力的）的表现。\n*",
  "*弹性力和摩擦力是电磁相互作用的表现。\n*",
  "*弹性力是由于物体的一部分相对于另一部分运动使物体形变时产生的，它由下列方程（胡克定律）来确定：\n$F=-kx$。\n*",
  "*万有引力是引力的相互作用的表现。\n$|\\vec{F}|=G\\frac{m_1m_2}{r^2}$。\n*",
  "*弹性力和引力都与相互作用物体的相互位置有关，即与坐标有关。\n*",
  "*在地球表面附近，地球对物体的吸引力等于$m|\\vec{g}|$，如果物体离地球表面的距离远小于地球的半径，则可以认为吸引力是一个恒量。\n*",
  "*摩擦力是在静止的接触物体（静摩擦）或运动的接触物体（滑动摩擦）之间产生的。\n摩擦力的方向是沿着接触物体的表面、与接触物体相对运动的方向相反。\n摩擦力与一个物体相对于另一个物体的坐标无关，而与它们的相对速度有关。",
  "*"
]
```

Mapping to source/template blocks: `0,1,2,3,4,5,6,6`. Final paragraphs 0, 1, 2, and 4 render as italic; 3, 5, 6, and 7 do not. Paragraph 7 has no instructional content.

### phy8-c2-s3-t14

```json
[
  "如果除了已知初始坐标和初速度之外，还知道物体所受的力，即如果知道力与坐标或速度的关系，则可以利用牛顿定律解任何力学问题。\n此时，必须注意：*力或几个力的合力*，*确定的不是物体的速度*（*大小和方向*），*而是物体的加速度*。\n因此，物体不一定是沿力的方向运动。",
  "物体运动的轨迹不仅决定于物体所受的力，而且还决定于初始条件——物体初速度的大小和方向。",
  "只有当物体平动时，才可以把物体的运动看作是质点的运动。\n只有在所有力的合力的作用线通过物体的质心这个条件下，物体才作平动。\n否则，物体除作平动之外，还要绕某个轴转动。",
  "如果相对于非惯性系（相对于某个惯性系做加速运动的参照系）来讨论物体的运动，则牛顿力学定律是不正确的。\n相对于非惯性系来说，物体的加速运动不是物体受力引起的，而当有力存在时，物体可以做匀速运动。"
]
```

Mapping: `0,0,1,2`. Four source emphasis spans in paragraph 0 render correctly; no residual delimiters. The trajectory paragraph remains after, not detached from, the initial-data statement.

### phy8-c3-s1-t7

```json
[
  "在设计永远处于静止状态的建筑物时，受力作用的物体的平衡问题，是一个很重要的问题。",
  "为了使物体平衡，必须满足两个条件：",
  "1) 作用在物体上的力的几何和等于零；",
  "2) 力矩的代数和等于零。",
  "对某个轴的力矩是表征在这个轴附近的力的转动作用的量。\n它等于力的大小和力臂的乘积。",
  "物体的各种平衡实际上是不存在的，只可能存在稳定平衡或随遇平衡。",
  "当物体稍微偏离平衡位置时，如果作用在物体上的力使它回到原来的位置，物体的这种平衡就是稳定的。"
]
```

Mapping: `0,1,2,3,4,5,6`. Conditions remain in natural numbered order and on separate paragraphs. No source emphasis was removed.

### phy8-c4-s1-t5

```json
[
  "物体的动量是描写运动的一个重要物理量。\n动量是矢量，它等于物体的质量和它的速度的乘积。",
  "在一定时间 $t$ 内作用的同一个力 $\\vec{F}$，使所有物体都产生相同的动量，它等于力的冲量 $\\vec{F}t$。",
  "对于动量，守恒定律是成立的。",
  "**在孤立系统内，当物体任意相互作用和任意运动时，该系统内物体的总动量保持不变。\n**"
]
```

Mapping: `0,1,2,3`. Final paragraph 3 renders as one `<strong>` span with no residual asterisks; the isolated-system qualifier is preserved.

## Physics Reference Basis

Public textbook text was read with `cloak-fetch`, without opening images. These references support the physics judgments, not additions to the lessons or amendments to approved source transcriptions:

- OpenStax, *College Physics*, 9.3 Stability: equilibrium versus stability; valid unstable equilibrium and small-displacement restoring/destabilizing force or torque.
- OpenStax, *University Physics Volume 1*, 9.2 Impulse and Collisions: vector impulse equals momentum change; constant/average force and net-force formulation.
- OpenStax, *University Physics Volume 1*, 6.2 Friction: relative contact motion, impending slip, responsive static friction, and empirical model qualifications.
- OpenStax, *College Physics*, 5.3 Elasticity: Stress and Strain: linear versus nonlinear elastic response; elasticity alone does not guarantee Hooke's law.
- OpenStax, *University Physics Volume 1*, 5.1 Forces and 5.2 Newton's First Law: Newtonian applicability domain, external resultant, and inertial-frame scope.
- OpenStax, *University Physics Volume 1*, 11.1 Rolling Motion: separate center-of-mass translation and rotation, with force and torque equations.
- Caltech, *The Feynman Lectures on Physics*, I-10, sections 10-2 and 10-5: total-system momentum conservation under no net external force and the scope of classical momentum definitions.

```text
https://openstax.org/books/college-physics/pages/9-3-stability
https://openstax.org/books/university-physics-volume-1/pages/9-2-impulse-and-collisions
https://openstax.org/books/university-physics-volume-1/pages/6-2-friction
https://openstax.org/books/college-physics/pages/5-3-elasticity-stress-and-strain
https://openstax.org/books/university-physics-volume-1/pages/5-1-forces
https://openstax.org/books/university-physics-volume-1/pages/5-2-newtons-first-law
https://openstax.org/books/university-physics-volume-1/pages/11-1-rolling-motion
https://www.feynmanlectures.caltech.edu/I_10.html
```

## Review Boundary

Only this report was written. No raw source, template, source errata, gate status, finalized edition, database row, unrelated work, ticket status, or commit was changed. Existing source approval proves faithful extraction; it cannot make the retained physics errors correct. All findings above are first-verdict findings on the hash-bound current text.
