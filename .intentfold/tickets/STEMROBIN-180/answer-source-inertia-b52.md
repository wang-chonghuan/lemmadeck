# Independent SOURCE-First Written Solutions: Inertia B52

Status: **source-only complete; NOT FINAL-approved**. All five canonical written tasks of `6p / phy6-c3-s6` were solved after completing the sole independent TEXT verdict, on 2026-11-17.

TEXT remains **BLOCK** because candidate question 4 removes the initially stationary case left open by the canonical task. No candidate repair or FINAL comparison was performed.

## Frozen Bindings

- Checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
- Source-only file: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-inertia-b52/source-only.json`.
- Source-only SHA-256: `ad52f08807bdabf159022009839211b26d70c9d0d0fec143fe0c9496da99e2ae`.
- Preceding sole TEXT report: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/modern-text-review-inertia-b52.md`.
- TEXT report SHA-256: `cf7ed7b0c5e3761a66cdc86a08c6a374dba1a17259548e28576cc937a4ca4983`.
- Reviewer TEXT record SHA-256: `21555311ef7538987e15ccb17de71f3c85d0bd017987b1503b4519c7700246ca`.

The frozen JSON contains complete original questions, conditions, reasoning, written solutions, unit/value limitations, exact canonical file paths/hashes, and independent original-pixel observations. Its schema is ordinary report data, not a new pipeline, answer-key contract, or grading payload.

## Independence And Source Evidence

Solving used the full canonical `lesson.json`, `lesson.md`, `exercises.json` and my earlier direct observations of the three original PNGs. No author/prior/book written answers, answer keys, choices, interactions or answer history were opened. The mandated author TEXT report was read in the preceding review for command evidence only, not as a solution authority. The candidate does not replace canonical task conditions.

| Canonical input, below `ssot-resources/soviet10year-textbooks/artifacts/6p/` | SHA-256 |
|---|---|
| `lessons/phy6-c3-s6/lesson.json` | `6d44c56b0f401bbf4431c03b8aca571ef0c0a320bfd0c42a4dd38f3422c15a37` |
| `lessons/phy6-c3-s6/lesson.md` | `4d88a542630164e6cb5f272a57a0925f1691f75a326783d0bf78f752dfb4d4b8` |
| `lessons/phy6-c3-s6/exercises.json` | `d8a171dbfdf36f71f3c628b3feabf9320d032494c670bcb43b0d2b4a1fe64bf8` |
| `figures/fig-35.png` | `a9e7465c3cd393af1b224bf173c3ce19bef2771c21a1f29de4064d3f9154dc6b` |
| `figures/fig-36.png` | `bc3bddce39ec88654aab432a861064fd96d919f2363c8d8d156d8eddd143a4d1` |
| `figures/tbl-p0057-01.png` | `8f52380c650cbc884441fc25a040a263e9ec7d7ede1634966edb7a7336487d8e` |

Image counts for this combined review/solve task: one batch `3`, task `3`, context `3`; three unique originals, each opened once; reopens/crops/additional solving opens/parent image payloads all `0`.

Direct pixels show a hand grasping a post and a turning path in figure 35, not a labelled force vector. Figure 36 shows three ramp/table panels, heap/flatter sand/clear route, and progressively farther-right later cart positions; it does not supply measured distances, speeds or times. First two panel letters are readable; the third-panel `в` association comes from source prose, not a visible third label. The portrait has no readable name/date or physics data; its identity comes from prose and it is not used to answer any task.

## 1. Examples Of Velocity Change

Canonical `p0057#5`: `（1）举出几个说明物体只有受到其它物体的作用才会改变运动速度的例子.`

Conditions and reasoning: compare motion in the same observational reference; identify the initial state and acting body. Starting from rest, slowing, and turning all change velocity. An interaction being necessary for a change does not mean every interaction necessarily changes velocity.

Written solution:

例如，地上原来静止的球被脚踢或被另一个球撞到后开始运动，是脚或另一个球的作用改变了它的速度。正在滚动的球受到摩擦的阻碍，速度减小，最后停下来。运动的球碰到墙，墙对球的作用使球改变运动方向。图 35 中，奔跑的人用手抓住柱子，柱子的作用使他转向。这些例子都指出了使速度改变的其他物体；快慢改变和方向改变都属于速度改变。并不是说只要受到其他物体的作用，速度就一定改变。

Source: `p0055#7/#8/#9`, `p0056#1`, actual figure 35 contact/path. No numerical result; velocity may be expressed in `m/s`, but no speed value is given.

## 2. Experiment With Reduced Obstruction

Canonical `p0057#6`: `（2）叙述一个能表明当物体所受的阻碍作用减小时，它的运动将如何变化的实验.`

Conditions and reasoning: same cart, fixed ramp and horizontal table, same release height. Place and release from rest without an extra push each time; this states a fair comparison procedure, not a claim that the source explicitly prints every control or that an experiment was actually performed. Change the sand condition only. Compare the post-ramp motion, not uniformity during the descent.

Written solution:

可描述图 36 的小车实验。把同一块斜板固定在水平桌面上，每次把同一辆小车放在斜板上的同一高度，从静止松开，不再额外推它。先在斜板下端附近放一小堆沙子，小车到桌面后陷进沙堆，很快停下。把沙子摊平，再按同样条件松开小车，它在桌面上运动较长的距离才停下。最后把路线上的沙子扫净，再按同样条件松开，停止前的距离又更长。三次保持小车、斜板和起始高度一致，只改变沙子的阻碍情况。按照课文报告，阻碍越小，小车的运动保持得越久，减速越缓慢，越接近匀速运动。这里是在叙述来源实验，不是报告本次实际操作或测量；扫净沙子也不代表所有作用都消失。

Source: `p0056#2/#5/#6`, `p0057#1`, actual figure 36. The stop-distance/time comparison is reported by prose, not measured from the static PNG. No distance, height or time value is supplied; do not invent meters or seconds. Actual measurement could use `m`, `s`, and `m/s`, but none occurred here.

## 3. Cause Of Direction Change

Canonical `p0057#7`: `（3）运动方向的变化是由什么引起的？`

Conditions and reasoning: a body is already moving and turns in the same reference. Direction is part of velocity. Identify another body's action; do not make inertia the turning force or treat only wall/hand collisions as possible causes.

Written solution:

运动方向的变化是由其他物体对运动物体的作用引起的。例如，运动的球碰到墙或手时，墙或手的作用能使它转向。图 35 中的人抓住柱子，柱子对他的作用使他绕柱转向。方向改变也是速度改变；惯性本身不是让物体转弯的力。这里是在列举作用的例子，不是说只有撞墙或碰手才能转向。

Source: `p0055#9`, `p0056#1`, actual figure 35. No angle, force or velocity value is given or calculated.

## 4. Ideal Absence Of Interactions

Canonical `p0057#8`: `（4）假若阻碍运动的因素全都不存在，物体将怎样运动？`

Conditions and reasoning: interpret the question through the complete source's no-other-body-interaction ideal, not merely a clean route. The question specifies no initial state, so keep both cases. Use the same reference; everyday Earth-relative observation is an approximation, not a claim that the Earth is an exact inertial frame. Constant velocity retains both speed and direction.

Written solution:

按本课所说的不受其他物体作用的理想情况，在同一观察基准下，物体的速度保持不变。原来静止的物体继续静止；原来运动的物体沿原来的运动方向做匀速直线运动，速度的快慢和方向都不改变。没有阻碍不会使它自己停下，也不会使静止物体自己动起来。原题没有限定物体原来一定在运动，所以两种初始状态都要保留。这里不能只把扫净沙子当作满足了理想条件；若仍有其他作用改变运动，不能仅凭没有阻碍就断言匀速直线运动。

Source: `p0055#7`, `p0056#5/#6`, `p0057#1/#2`. Figure 36 supplies only the real comparison, not a measurement or proof of the ideal limit. Initial rest means `0 m/s`; for initial motion the original velocity is unspecified and retained, so there is no numeric speed to invent.

## 5. Inertia Definition

Canonical `p0057#9`: `（5）什么叫惯性？`

Conditions and reasoning: preserve the source definition's ideal absence of other-body action and unchanged velocity. Rest is included. Continuing after propulsion stops does not mean all real interactions have vanished.

Written solution:

物体在不受其他物体作用时保持速度不变的现象，叫作惯性。按本课的理想情况，原来静止的物体继续静止，原来运动的物体做匀速直线运动。惯性不是另一个向前推它的力；现实中其他物体的作用仍可使物体减速或转向。

Source: `p0055#7`, `p0056#6`, `p0057#1/#2/#3`. Definition only; no numerical value or unit is requested. Inertia is not a force to report in `N`.

## Stop

The five solutions are complete and frozen for later FINAL comparison by exact source-only file bytes/SHA. JSON parsing of this new report data succeeded; that is a file-format check, not repeated candidate acceptance or autograding.

No FIG production/promotion, source or math gate rerun, candidate repair, inherited-failure alteration, finalize, DB operation, publication, Git operation, service/app/dependency change, or new pipeline occurred. Other work and the author report were preserved. The sole TEXT BLOCK remains effective.
