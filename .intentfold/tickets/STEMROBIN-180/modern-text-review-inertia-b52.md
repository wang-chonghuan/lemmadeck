# Sole Independent TEXT Review: Inertia B52

Verdict: **TEXT BLOCK**. One substantive review, completed on 2026-11-17 before source-only written solving. One essential candidate defect; no candidate repair or repeat acceptance.

Scope: `6p / phy6-c3-s6 / 20. 惯性` only. Checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`. Reviewer-owned scratch: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-review-inertia-b52`.

## Finding

**B52-TEXT-01 / Blocker: question 4 adds an initial-state restriction and removes a canonical case.**

- Target: `.tmp/ld-s10y-lesson/text-author-inertia-b52/exercises.template.json`, `exercises[3].text`, source `p0057#8`.
- Canonical: `（4）假若阻碍运动的因素全都不存在，物体将怎样运动？`
- Candidate: `（4）假设一切阻碍运动的因素都不存在，物体也不受其他物体的作用。原来正在运动的物体会怎样运动？`
- The canonical question does not specify that the object is initially moving. Its supporting complete source paragraph, `p0056#6 + p0057#1`, explicitly covers both rest and uniform rectilinear motion. Adding `原来正在运动` removes the initially stationary branch from what this task asks. Keeping that branch in the lesson does not preserve the task's original conditions.
- Adding the source paragraph's ideal no-interaction condition usefully distinguishes this thought experiment from merely sweeping away sand. The defect is the additional restriction on initial motion, not that ideal-condition clarification.
- Required disposition: preserve the canonical open initial state and its two cases. This is a recommendation only; the candidate is untouched. The author's assertion that the original question already specifies a moving object is not supported by the canonical wording.

Mechanical PASS does not settle this semantic condition change. There is no second repair: author TEXT repairs/reruns remain `0/0`; the recorded entry jq-read correction conservatively consumes the overall repair allowance `1/1`, leaving `0`. No previously passed mechanics, SOURCE/FIG/math gates, or inherited failures were rerun, repaired, or retrofitted.

## Reader And Content Design

Job story, from the product charter: an independent, strong eight-year-old reader wants to understand why a body's motion changes and what happens when obstructing interactions are reduced, so they can explain inertia and complete this lesson's original questions without an adult translating the concepts.

Question the lesson should answer: what happens to a body's velocity when other bodies act on it, and when those interactions are ideally absent?

The candidate answers that question in its lesson, with a stationary-ball entry, slowing and turning examples, a controlled ramp comparison, the ideal limit, and the definition. The task-4 restriction prevents the question set from retaining the complete source demand.

The conceptual first screen, assessed from saved paragraphs rather than an app viewport, provides the ball, collision/kick, and interaction claim. It introduces the problem but does not yet give the complete inertia conclusion; that conclusion appropriately follows the experiment. No claim of rendered first-screen or child usability testing is made.

Deletion/copy audit: the physical examples each serve starting, slowing, or turning; the three sand conditions serve comparison; the ideal-condition paragraph prevents a false inference from a clean table; the later examples distinguish continuing motion from perpetual constant velocity. The historical paragraph is secondary but source-owned and kept after the physical explanation. No pipeline vocabulary, invented numerical experiment results, decorative filler section, or task-answer payload appears in the candidate. Brief orienting questions are specific to this experiment, not generic descriptions of a page.

## Full Canonical And Candidate Traversal

Read in full: canonical `lesson.json`, `lesson.md`, `exercises.json`; all three complete candidate template JSON files, including embedded `source.data` and per-item `source_text`. The source and candidate were read directly, not reconstructed from the author report. Source pixels were opened before reading the author's inventory/report.

There are `13` canonical and candidate blocks: `8 p + 3 fig + 2 cap`; `5` written tasks in `问题 / g1`. The following covers all blocks, using zero-based candidate indices.

| Block | Source binding | Independent judgment |
|---|---|---|
| 0, p | `p0055#7` | Static ball, collision and foot contact retained; the rest statement still names Earth as its observational reference. Interaction is a necessary condition for velocity change, not a claim that every interaction changes velocity. |
| 1, p | `p0055#8` | Slowing/stopping are attributed to interactions, including board and friction. The bullet example is explanatory text, not a practical child experiment. |
| 2, p | `p0055#9` | Wall/hand collisions and grasping a post retained. Replacing the source's overly exclusive collision wording with an example avoids saying that a thrown ball can turn only on impact. The grasping contact is present in the original pixels. |
| 3, fig | `p0056#1`, `fig-35` | Identity, position and source retained; figure is body-owned, not attached to a question. No modern figure is being approved. |
| 4, fig | `p0056#2`, `fig-36` | Three source scenarios remain linked to the body experiment. No task figure display is manufactured. |
| 5, cap | `p0056#3` | `图 35` retained and paired by the saved actual text-flow output. |
| 6, cap | `p0056#4` | `图 36` retained and paired by the same saved output. |
| 7, p | `p0056#5` | Inclined board, tabletop, same cart and starting height, heap near the foot, spread sand, then cleared route retained. Stopping distances increase across the three conditions. The child can follow the order; `让...滑下` describes release, not a continuing propulsive force. No measured height, speed, distance or time is supplied or invented. |
| 8, p | `p0056#6 + p0057#1` | Both initially resting and initially moving cases retained; straight line and constant velocity are explicit. Sweeping away sand is explicitly not equivalent to eliminating all interactions. This is a source-based idealization, not a claim that a real cart lacks gravity/support or that the Earth is an exact inertial frame. |
| 9, p | `p0057#2` | Source's ideal-condition definition retained. `保持速度不变` follows the preceding rest/straight-line distinction. The definition is not presented as an extra pushing force or as a property gained only by a moving body. |
| 10, p | `p0057#3` | Propelling gas ceases acting after launch, engine is turned off on an already moving car, and the stick's strike precedes the puck's continued motion. Continuing motion is explicitly distinguished from unchanged velocity forever. Gas motion is bounded by the ideal no-interaction condition and the interval between collisions. |
| 11, p | `p0057#11 + p0058#1` | Complete historical paragraph retained with source-bound person/country declarations. Source numbers `1564—1624` unchanged. This review does not certify that inherited date or historical priority claims and makes no unauthorized source erratum or history repair. |
| 12, fig | `p0057#10`, `tbl-p0057-01` | One body-owned portrait; identity comes from the source paragraph, not an invented readable portrait label. |

Force/frame reading is deliberately bounded: the source teaches a no-interaction ideal, not a full balanced-force or non-inertial-frame lesson. There is no rotating/accelerating observer introduced. Real table experiments still have other interactions; the candidate does not state otherwise. Its comparison concerns post-ramp obstruction, not uniform motion while descending the ramp. No mass ranking, terminal-speed condition, continuing push, or motor force is inserted.

| Task | Source binding | Complete condition/objective review |
|---|---|---|
| 1 | `p0057#5` | Plural examples and velocity-change objective retained; cause must be another body acting, rather than motion needing continuous propulsion. |
| 2 | `p0057#6` | Describing an experiment and stating what decreasing obstruction changes are both retained. It remains an open written explanation, not evidence of doing a physical experiment. |
| 3 | `p0057#7` | Cause of a direction change retained; no added numerical demand or answer cue. |
| 4 | `p0057#8` | BLOCK: added initially-moving restriction excludes the canonical unspecified initial state. Ideal no-interaction clarification is supported by the complete lesson, but does not justify dropping rest. |
| 5 | `p0057#9` | Definition/phenomenon demand retained, not replaced by a choice, input contract, or mass comparison. |

Identifiers `number/source_number = 1..5`, `group/group_id = 问题/g1`, source pages, and empty task `figure_refs/figures` remain intact. No subpart sequence or task regrouping exists. All figures belong in the body; the written solutions may cite those body figures without altering these exercise bindings.

## Independent Original-Pixel Observations

Each of the following actual canonical PNG files was opened exactly once with `view_image`. One batch: `3`; review-task/context loaded-image totals: `3/3`; unique originals: `3`; reopens: `0`; crops: `0`; other images: `0`; parent image payloads: `0`. Author image count `3` is a separate earlier task, not this review's evidence.

- `fig-35.png`: one person grasping a tall vertical post; bent/running legs and an oval projected path around the post, with a left-pointing arrow on the foreground part. The hand-post contact and turning path are visible. There is no numerical scale, radius, velocity value, or force-vector arrow. The projected oval is not a measured geometrical ellipse.
- `fig-36.png`: three vertically stacked ramp/table scenes. Each has an outlined/dashed cart high on the incline and a solid cart later on the tabletop. The top scene has a heap near the ramp's foot and the later cart closest to that foot; the middle has a flatter sand layer and a later cart farther right; the bottom has a clear route and the later cart farthest right. First and second panel letters are readable as the source `а` and `б`; no separate third-panel letter is readable in the supplied PNG. The third scene's `в` association is supplied by `p0056#5`, not asserted from invisible pixels. There are no measured heights, distance ticks, timings or speed values.
- `tbl-p0057-01.png`: one monochrome, bearded historical portrait with clothing against a dark rectangular background. No readable name, year, apparatus, or physical measurement is printed inside this crop. Galileo identification is supplied by `p0057#11 + p0058#1`.

These are this reviewer's observations. The author inventory was read afterwards and does not replace them. This is semantic source-pixel context for TEXT and later source-only reasoning, not a rerun of SOURCE acceptance or any modern FIG gate.

## Reused Actual Evidence

Read the author report and saved `argv.json`, `exit.json`, `stdout.txt`, `stderr.txt` for normalization, prose-flow, the focused checker, and its inner text-layout check. All four actual commands ended `0`; stderr files were empty. Nothing was rerun.

- Normalization: `normalize_lesson_layout` and `normalize_exercise_layout` each called once; no figure-template write.
- `prose_flow.mjs`: complete saved output gives `17` final paragraphs. The three authored breaks match actual adjacent paragraphs at indices `6`, `10`, `15`: turning to experiment, experiment to ideal limit, and physical examples to biography.
- Focused checker: recorded `status: pass`, `errors: []`, counts `13/5`, source identity/binding and zero-formula mechanics passed. Saved checker input snapshots hash identically to the reviewed candidates.
- Inner text-layout output: `17` paragraphs, the same three boundary objects, and text-only figure/caption pairing pass. This is not rendered image readability evidence.
- Formula spans: `0` in source and candidate. Numeric changes and registered target errata: `0`. KaTeX was explicitly not invoked; no zero-formula engine/render gate is claimed.

Entry/engineering/operations, lesson SKILL, edition text contract, edition profile, image-batch instructions, and applicable `ips-content-design` cap2/cap3 were read. `n-plane` verification and the live ticket read succeeded on 2026-11-17; ticket UUID `5d849725-dbba-4fa6-9233-9967f86bad69`. This narrow human request authorizes review/solving only, not the ticket's broad downstream delivery.

## Byte Bindings

Paths are rooted at the checkout above; each SHA-256 was read from current file bytes once, not copied as proof from the author report.

| File | SHA-256 |
|---|---|
| `.tmp/ld-s10y-lesson/text-author-inertia-b52/lesson.template.json` | `07e3c5069b4bf0c9c59ed105c45cbbba6f5bea220734a7b67352ee6f2a371986` |
| `.tmp/ld-s10y-lesson/text-author-inertia-b52/exercises.template.json` | `cb7a9cdd57527063dda93efbce917f3656dc284f7523973a03e7ad483e2df8db` |
| `.tmp/ld-s10y-lesson/text-author-inertia-b52/figures.template.json` | `86ff4a5b8b41cec5e56a7cfacaaad561fc1433f29fb241f381394675af3be44d` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s6/lesson.json` | `6d44c56b0f401bbf4431c03b8aca571ef0c0a320bfd0c42a4dd38f3422c15a37` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s6/lesson.md` | `4d88a542630164e6cb5f272a57a0925f1691f75a326783d0bf78f752dfb4d4b8` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s6/exercises.json` | `d8a171dbfdf36f71f3c628b3feabf9320d032494c670bcb43b0d2b4a1fe64bf8` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-35.png` | `a9e7465c3cd393af1b224bf173c3ce19bef2771c21a1f29de4064d3f9154dc6b` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-36.png` | `bc3bddce39ec88654aab432a861064fd96d919f2363c8d8d156d8eddd143a4d1` |
| `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/tbl-p0057-01.png` | `8f52380c650cbc884441fc25a040a263e9ec7d7ede1634966edb7a7336487d8e` |
| `.intentfold/tickets/STEMROBIN-180/modern-text-author-inertia-b52.md` | `ddd3043f827f52390a07e754856a59fc7a06bc26be0412f62b5e1a57dce85359` |
| `.tmp/ld-s10y-lesson/text-author-inertia-b52/text-check-report.json` | `753f7603dcffb328b2027891a52b147977b3f9147d725214382af4416162f288` |
| `.tmp/ld-s10y-lesson/text-author-inertia-b52/commands/normalize/stdout.txt` | `44163db1fce9231d8a358a422b38f9db2dff3965b7da40f27ae935eeeec71c3a` |
| `.tmp/ld-s10y-lesson/text-author-inertia-b52/commands/prose-flow/stdout.txt` | `2157c7843e86532641f157046544b2f46c61e8aee88fd06a7e135c0354f790b2` |
| `.tmp/ld-s10y-lesson/text-author-inertia-b52/commands/text-layout/stdout.txt` | `c35d8a9da4ecbb5e65ba37250f4a149e7a950db8909e6ec4e38853dca3b8468d` |

## Closed Boundary

This sole TEXT verdict is complete. Source-first written solving may now proceed despite BLOCK, but cannot be called FINAL-approved. No candidate, source, author report, inherited failure, official edition, FIG output, acceptance checker, Git state, service, app, dependency, DB or published content was changed. No new pipeline was created.
