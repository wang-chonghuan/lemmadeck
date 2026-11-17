# First Independent FIG Review B52: fig-36

Decision: PASS, FIG only. No blocking defects found in the current-text candidate.
Book 6p; lesson phy6-c3-s6 (inertia); review date 2026-11-17.
Fresh, bounded reviewer context, independent of the figure author.

## Scope And Rules

Read AGENTS.md, .intentfold/readme.md, engineering.md, operations.md,
ld-s10y-image/SKILL.md, quality-gate.md, figure-spec.md and record_review.py.
Reviewed the full APPROVED modern lesson/exercises templates under
.tmp/ld-s10y-lesson/text-repair-inertia-b52/, without judging or rerunning TEXT.
The given TEXT approval combines the original unaffected review and the
same-reviewer Q4 affected PASS. This review neither replaces nor re-gates it.
Read fig-36 evidence in modern-figure-author-35-36-b52.md and the original
fig-36/output-manifest.json. Fig-35 remains AUTHORBLOCKED and outside scope;
its original/candidate images were not opened and no repair was attempted.
Both original author repair budgets are exhausted. Candidate/spec/output edits: 0.
Only this report and current-text/review.json are owned by this reviewer.

## Independent Original Pixel Inventory

The first image opened was the original fig-36.png, once, before either
modern preview. This inventory was formed from those pixels, not from the
author's object list or inventory:

- Three vertically separated trials, with original letter-form panel markers.
- Each trial has a left-high, right-low straight inclined board joining a
  horizontal tabletop/track, with a vertical support at the left.
- Each trial shows an earlier cart on the slope, its body outline dashed,
  and a later solid cart on the horizontal surface. These are two states,
  not two simultaneous physical carts. Each state has two wheels:
  3 trials, 6 cart states and 12 visible wheel states.
- The upper trial has a raised, irregular sand area near the ramp foot and
  the nearest stopped cart. The middle trial has a low, flatter surface
  marking and a farther stopped cart. The bottom trial has a clear horizontal
  run and the farthest stopped cart. Original coarse pixels alone do not
  determine the exact sand thickness; the approved prose supplies heap,
  spread-flat sand and swept-clear conditions.
- Stopping distance from the ramp foot increases in top/middle/bottom order.
  Earlier states are near the upper part of each incline.
- There are no distance values, units, axes, measurement ticks, force arrows,
  numerical ratios, or explanatory answer text in the source.

Mapping checked after the independent inventory: trial-a/b/c-apparatus-and-states
cover the three apparatus groups; trial-*-ramp, trial-*-table and
trial-*-support preserve the board/table connection; trial-*-start/stop-cart-body
and trial-*-start/stop-wheel-1/2 preserve all states/wheels. The mapped
contact, slope, horizontal, upright, wheel-normal, wheelbase and wheel/body
assertions accompany these objects. three-trial-control-and-order and its
same-release-height/later-stop assertions cover the controlled comparison.
Each apparatus inventory declares pointRelationships rather than relying
on objectCount alone. The source has no instructional grid/table lattice.

Modern additions, not pixel-measured source data: identical regularized ramps,
exact wheel contact anchors/hub dots, consistent cart geometry, Latin a/b/c,
semantic neutral colors, responsive text size and cleaned linework. The
same-cart/same-release-height control is authorized by the approved prose;
no user-space coordinate is presented as a source measurement.

## Visual Findings

Opened both existing complete final repaired previews, once each:
repair-01-native-306.png and repair-01-native-640.png in the original fig-36 root.
No crop, first-failure preview, SVG visual reopen or new browser was used.

- All three complete trials are visible at both widths. Each ramp joins its
  horizontal tabletop; left supports and right endpoints remain in frame.
- All six cart bodies and twelve wheels are present. Wheels visibly meet the
  board/table and cart bodies; the earlier author-observed detached-body defect
  is absent from these final previews. A pair of wheels identifies each state.
- All three earlier bodies retain dashed outlines with muted outline wheels;
  all three stopped bodies have solid outlines. No extra simultaneous cart
  or direction/force arrow was introduced.
- Trial a has a raised uneven sand heap around the nearby stopped wheels;
  trial b has a thin, spread-flat sand strip; trial c has no sand profile.
  The low b strip is small at 306 px but still distinguishable from the bare
  c track when read with the approved text. No granular detail is needed to
  infer an invented value.
- Stops are ordered near/farther/farthest relative to the respective ramp foot.
  Trial c still depicts a finite stopped state: a swept table is not depicted
  as the ideal no-interaction premise of approved Q4.
- Only a, b and c are visible text. All three are legible, separated from
  apparatus and adjacent rows, with no label/object collision or clipping.
  The original non-English panel forms were replaced, not copied.
- No cultural symbols, Cyrillic/Chinese visible figure text, old-book texture,
  uniforms, flags, fictional cultural wording or historical portrait appears.
- No Q4 answer, numerical stopping ratio, force explanation, zero-friction
  claim, answer key or added solved annotation appears.
- The visible output is nonblank, not a black/broken raster, with restrained
  neutral line/fill contrast. Spec object colors use only ink, muted, paper
  and accentSoft; visible SVG colors are semantic CSS variables. Renderer
  default literal colors on hidden construction nodes are not painted in
  these previews. No new theme/contact-sheet rendering was performed or claimed.

## Reused Mechanical Evidence And Provenance

These are existing successful commands, not new runs:
original commands/validate: draft validation PASS, exit 0;
commands/repair-01-render: PASS (68 objects, 3 labels), exit 0;
commands/repair-01-native: PASS at widths [306,640], exit 0.
The original validation preceded the one authorized contact repair; its
successful standalone gate was not repeated. The repaired renderer supplied
its existing embedded validation. Original author repair used 1, remaining 0.

Original repair-01-native-preview.json records actual media width/height
306 x 478.125 and 640 x 1000, not nominal viewport widths.
All three labels measure 16.25625 px at 306 and 34 px at 640, above the
16 px minimum. Both samples loaded, had no overflow, and passed existing
nonblank/not-black pixel checks. Native evidence is isolated/headless,
network-blocked, with the browser closed; this is not new app/lesson acceptance.
Repaired render/native commands exited 0; existing pixel child commands exited 0.
The retained Pillow deprecation warning did not fail those pixel commands.
Current render status PASS; collisions 0; display failures 0.
Counts: 68 objects, 89 assertions, 4 inventory groups, 3 labels, 12 circles,
6 cart bodies, 2 sand profiles, 0 arrows, 15 complete authority strings.

Read the actual ticket evidence:
.intentfold/tickets/STEMROBIN-180/tmp/commands/batch52-fig36-approved-authority-rebind.{call.json,stdout,stderr}.
Its recorded exit is 0, stderr empty, renderReruns 0. This is the author's
authority/provenance rebind, not a rendering or independent approval.
Read-only structured comparison in this review found exact equality of
all 15 authority strings with the approved templates, and unchanged objects,
assertions, source inventory, canvas, display, layout, SVG bytes and mechanical
render fields. Current render binds the current spec and current SVG correctly.
This equality permits reuse of the existing repaired native/render evidence;
source fidelity was independently judged from the original pixels above.

## Hash Bindings

All SHA-256 values below were read back from the actual files:

| Artifact | SHA-256 |
| --- | --- |
| original fig-36.png | bc3bddce39ec88654aab432a861064fd96d919f2363c8d8d156d8eddd143a4d1 |
| current-text/spec.json | ec83edfd2f6c6367b1531c57c20451327da455b930d364b60ae1b054526b1960 |
| current-text/render.json | 19552bbb7edbeee5c4ff89a68e661f8c0cd429e817898ac3240cec60d5771826 |
| current-text/fig-36.svg and original repaired SVG | 5ccf9beab9cfe5e4ac300e0e86c53a04e1e4ab6022a3aa795e3c5ebb4ff48e4a |
| original repaired fig-36.spec.json | 1bfe0ea6fc5939d7b61854c5aecab6aa092b3ad46071d9504f7f5e4a51ee95e3 |
| original fig-36.repair-01.render.json | daeea5006ed10aa061cc1104657ec0377650fa95823d2cb9069f9d5c1d227c66 |
| original repair-01-native-preview.json | 5abf026284499e8265e0e5304965b87719a9b81fcf8262439a4e924890196458 |
| original repair-01-native-306.png | fae701af8ff18910e1527fae06ca1ff72b10eaf369aed369b07c01852eabff7c |
| original repair-01-native-640.png | 703d0df5b08e4759a4ac1a854632cdcdd9c8963474b58460ca0eb828c66cbd34 |
| original output-manifest.json | 91068be339a72d7d1bc9e5fb5e97bb5464a096f0106bbff8156d089b99e97ef0 |
| approved lesson.template.json | 07e3c5069b4bf0c9c59ed105c45cbbba6f5bea220734a7b67352ee6f2a371986 |
| approved exercises.template.json | 7f50a7a4b5e24e7d8504f890e52a5c87319b7df12a5078e8ee15a43882080e2f |
| current-text/review.json | 33bdaec2c6b3bbeae70e0810486365181c94c8e1581b2ab62bf950242158cf9c |

## Review Writer Execution

Actual single allowed review command, cwd
/Users/yong/.codex/worktrees/0f12/lemmadeck:

```sh
env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .agents/skills/ld-s10y-image/scripts/record_review.py --spec .tmp/s10y-image/b52-fig35-36/fig-36-current-text/spec.json --render .tmp/s10y-image/b52-fig35-36/fig-36-current-text/render.json --output .tmp/s10y-image/b52-fig35-36/fig-36-current-text/review.json --status pass --notes "First independent B52 FIG-only review of fig-36, 6p phy6-c3-s6. Original PNG opened first once; both existing repaired native previews at actual media widths 306 and 640 opened once each. Three trials, six cart states and twelve wheels complete; ramps/table/body-wheel contacts, dashed initial versus solid stopped states, heap/flat/cleared sand and increasing finite stopping distances pass. Labels a/b/c legible at 16.25625/34 px, no collision/clipping, cultural or answer leakage; semantic neutral CSS colors. Full approved authority including Q4 exactly matches; unchanged objects/assertions/SVG and mechanical fields permit reuse of existing successful evidence. No repair, rerender, standalone revalidation, new browser or TEXT/SOURCE gate. Image opens 3, reopens/crops/parent image payloads 0. Details: .tmp/s10y-image/b52-fig35-36/fig-36-current-text/independent-review-b52.md."
```

Actual stdout:

```text
PASS: fig-36 -> .tmp/s10y-image/b52-fig35-36/fig-36-current-text/review.json
```

Actual stderr: empty. Actual process exit: 0. Review writer invocations: 1.
Written schema ld-s10y-image/review@1, figure fig-36, status pass,
reviewedAt 2026-11-17T02:51:21.472985+00:00.
Readback confirms source/spec/render/SVG hash bindings match actual files;
current spec/render/SVG hashes remain unchanged after the writer.
record_review.py includes its own required rendered-spec/hash validation;
no separate validation command ran, and no review-writer rerun occurred.

## Image Ledger And Boundaries

Open 1: original fig-36.png. Open 2: repaired native 306.
Open 3: repaired native 640. Image loads 3, task limit 8, context limit 24.
Reopens 0; crops 0; new screenshots 0; parent image payloads 0.
Return textual findings, counts and existing evidence paths/hashes only.
No Git, DB, app, dependency, model/service, answer/key/choice, TEXT/SOURCE
gate, finalize, promote, publishing or retention operation was performed.
PASS applies only to the hash-bound fig-36 candidate, not the whole lesson
or fig-35, and grants no finalize/promote authority.
