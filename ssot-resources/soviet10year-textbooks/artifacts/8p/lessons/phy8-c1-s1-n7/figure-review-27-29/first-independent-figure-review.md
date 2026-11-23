# First Independent Figure Review 27/28/29: PASS

Ticket: STEMROBIN-180/180-7 n7. Date: 2026-11-23.
Role: sole first independent FIGURE reviewer for this batch; not an author.
Workdir: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
Exact candidate: `.tmp/180-7-n7-figures-27-29/candidate-2/fig-{27,28,29}`.
Independent command/pixel capture began at `2026-11-23T03:29:32.451Z`.

## Verdict And Boundary

**PASS for all three current figures: source fidelity, mathematics, cultural fidelity, actual final pixels, and declared instructional inline widths. No actionable defects; no repair performed.**

I opened all three original PNGs first, before opening any final figure. I then independently compared those observations with the complete read-only lesson/exercises templates, source-inventory mapping, current geometry, and three full final-width/theme composites. This is substantive visual approval, not adoption of author PASS or renderer status.

The existing source and modern-text PASS are reused for their own scopes. The two template hashes still match the independent modern-text bindings, and the FigureSpecs' complete authoritative prose and referenced written exercises match those exact templates. No erratum exists or is needed. This review does not approve lesson manifest integration, finalization, answers, choices, publication, or whole-lesson desktop/mobile display; those remain with the parent.

## Independent Original-Pixel Inventory And Mapping

### Figure 27

The original has one row of five double-rim circular clock faces, twelve tick strokes per face, and two hands per clock. The longer hand remains upward throughout. The other hand points up, upper-right, lower-right, down, and lower-left in order. At the first clock the hands coincide; at the fourth they form opposite vertical directions. Neither case is an absent hand.

Below the faces are `t = 0`, `t_1`, `t_2`, `t_3`, `t_4`. Below them is one straight rising-right physical trajectory with an arrowhead and uppercase `X` at its right end. Its five transverse marks have labels `x_0` through `x_4` underneath, in the same left-to-right clock order. Intervals and columns are approximately equal/aligned in the scan. There is no coordinate-time plotting frame here, no numeric time/position labels, and no `A`, vehicle, or person.

All these objects are present in the final pixels, including every bottom position label and the rightmost `X`/arrow. `source-clock-0` through `source-clock-4` map each center, both tips, rims, ticks, hands, and time label. The `clock-*-fixed-hand-endpoints`, `clock-*-rotating-hand-endpoints`, `clock-*-up-direction`, and `clock-*-rotation-direction` assertions preserve the actual hand states. Every tick has its own endpoint assertion.

`source-inclined-trajectory` maps both trajectory ends, the directed line, all five positions, transverse strokes, and labels. `trajectory-directed-endpoints`, `trajectory-positive-direction`, `position-x*-on-trajectory`, `position-x*-stroke-endpoints`, and the four `positions-*-ordered-interval` assertions cover incidence, direction, and order. `source-clock-position-correspondence` has all five `clock-*-position-column` relations. Counts are supplementary, not substitutes for these relationships.

Declared contemporary regularization is justified: exact circles, equal face sizes, twelve evenly spaced ticks, nominal rotating angles 0/60/120/180/240 degrees, exact columns, equal position intervals, and a clean straight slope. The chosen drawing slope 1/3 is not a measured physical angle from the source. Tiny coincident endpoint nodes add no visible data. The prose's 10/20/30-second and 3/4/5-metre examples are preserved in text, not newly annotated on the trajectory.

### Figure 28

The original has one shared horizontal-time/vertical-position frame, arrows right/up, a negative-time region, and a very short vertical extension below zero. Printed time ticks are `-30,-20,-10,0,10,20,30`; printed position ticks are `1,2,3,4,5`. Units are seconds and metres. `A` sits at the vertical intercept `(0 s,3 m)`.

The positive-time branch is solid and rises to approximately `(30 s,6 m)`, above the highest printed position tick. Its backward continuation is dashed, reaches `(-30 s,0 m)`, and joins the same straight line at `A`. Neither graph branch has an arrowhead. The original does not print a sixth position label, velocity, line equation, slope triangle, or exercise answer.

The final retains every signed time label, all five position labels, both axis arrows, `A`, the solid branch, and the backward dashed extension. Chinese unit text is rendered as `t (s)` and `x (m)` without conversion. `source-time-frame` and `source-position-frame` cover origin, axis ends, arrow endpoints, units, and every tick anchor with signed origin-relative displacements and directed-endpoint assertions.

`source-motion-graph` maps the origin, `graph-A`, `graph-backward-end`, `graph-positive-end`, and both branches. `A-at-three-metres`, `backward-graph-data`, `positive-graph-data`, `all-graph-data-collinear`, `solid-endpoints`, and `dashed-endpoints` establish the source relationships, not merely the object count.

Declared regularization makes the slightly uneven/tilted scanned axes orthogonal and the steps equal, retaining exact `(-30,0)`, `(0,3)`, `(30,6)` on one line. Unlabelled frame margins are drawing extents, not additional measured times. The graph continues to give the original exercise-3 information, but no speed/direction answer is displayed.

### Figure 29

The original has one shared position/time frame, arrows up/right, a slight time-axis extension left of zero, and the full negative-position region through `-2`. Time has unit ticks 0..8, with printed labels `0,2,4,6,8`. Position has ticks `-2,-1,1,2,3,4,5,6,7,8`, with printed labels `-2,2,4,6,8`. The common starting position 3 is not newly labelled.

Four solid straight branches share `(0 s,3 m)`. They are numbered 1/2/3/4: steep positive, less steep positive, shallow positive, and negative respectively. The printed givens are `v_1 = 3 m/s`, `v_2 = 1.5 m/s`, `v_3 = 0.5 m/s`, and `v_4 = -1 m/s`. The negative branch crosses `(3 s,0 m)` and ends at `(5 s,-2 m)`. The shallow positive branch ends at `(6 s,6 m)`. The horizontal dashed branch starts at `(0,3)` and ends near `(8,3)`; it has no number, velocity label, or interpretation.

All four numbered branches, all four complete signed velocity labels, the full tick structure, negative region, shared intercept, and complete unlabelled dashed line survive in the final pixels. The four source velocity labels are moved to an unframed two-column bottom band and retain their subscripts and `m/s`. The line numbers remain next to their own branches; colour is not the only means of identifying them.

`source-time-frame`/`source-position-frame` cover all tick and axis points. `source-motion-line-1` through `source-motion-line-4` each include the origin, shared start, endpoint, branch, number, and velocity label, with `line-*-initial-position`, `line-*-source-displacement`, and `line-*-endpoints` assertions. `source-unlabelled-dashed-line` maps its start/end and shared time axis with constant-position displacement, connected endpoints, and parallelism. Every mapped point has a relation inside its mapped group; external relations and object counts were not used to mask missing coverage.

The first two scan strokes are approximate: their pictured endpoint times/slopes are not exactly the printed velocities. Contemporary regularization correctly uses the printed velocities as mathematical authority and retains the pictured upper endpoint levels near 9 m and 8 m, ending the clean branches at `(2,9)` and `(10/3,8)`. Those times were not printed source measurements and are not added as labels. The other endpoints stay `(6,6)`, `(5,-2)`, and `(8,3)`. No branch is extended beyond its declared source-derived endpoint.

The queried coordinates remain exact under the source givens: at `t=3 s`, branch 2 is at 7.5 m and branch 4 at 0 m. For the prose's `t=1..5 s` example, branch 3 moves from 3.5 m to 5.5 m and branch 4 from 2 m to -2 m. The resulting signed displacements are +2 m and -4 m, agreeing with the unchanged magnitude/direction text. These are reviewer reasoning only. No query-point highlight, distance annotation, line equation, `v=0`, rest label, or calculated answer was inserted.

## Actual Final Pixels, Themes And Culture

Each of the three full composites was actually opened once. Each contains the full native 480px figure, the full 358px figure, and three full 318px figures in neutral, accent, and print-role palettes. No crop, enlarged fragment, failed-candidate screenshot, or author-only visual claim was substituted. The originals were inspected at their full supplied resolution.

| Figure | Actual small-width observations |
| --- | --- |
| 27 | All five faces, ten hand states including overlap/opposition, all time subscripts, ordered position subscripts, inclined positive trajectory, and rightmost X/arrow are present and clear. |
| 28 | All negative/positive time labels, metre ticks, seconds/metres units, A at 3 m, and the continuous solid/dashed distinction are legible. The shifted origin zero remains clearly below the origin, without colliding with 10. |
| 29 | Numbers 1..4 identify their own branches, all velocity subscripts/decimals/minus signs render, and both lower velocity rows are wholly visible. Tick 4 is clear of the descending line, and its small offset still identifies that tick. The -2 tick, descending endpoint, dashed right endpoint, and t (s) are not clipped. |

Independent SVG screen-transform measurements reproduce the renderer's minima: 17.224773px for figure 27 at 318px, 17.225px for figures 28/29; about 19.391px at 358px and 26px at 480px. All exceed 16px. All 11/15/20 labels respectively have nonempty visible bounds inside each complete SVG. Canvas checks find 4,896/3,947/6,571 nonblank dark pixels at neutral 318px.

The theme roles match the existing app CSS, not an invented palette. Accent produces visible teal-blue branch pixels for figures 28/29; figure 27 deliberately remains ink-only. Print remaps accent to ink, preserving all numbered branches and dash distinctions. These isolated final-SVG checks use the existing installed browser headlessly; they are not represented as headed whole-product acceptance or a new measurement of product container width. The supplied 318px media-width contract is explicitly covered.

There are no glyph blanks/replacement boxes, label/geometry collisions, black/blank renders, missing bottom/right objects, answer annotations, or cultural-symbol leaks. English unit abbreviations and mathematical notation replace source Chinese unit words without changing physical units or facts. No Cyrillic, decorative Soviet imagery, flag, uniform, handwriting, or archival texture is reproduced. No source-bound historical identity is involved.

## Exact Candidate And Durable Evidence

| Figure | Current spec SHA-256 | Current SVG SHA-256 |
| --- | --- | --- |
| 27 | 89d7238201aabcacfee0c5f36635117daee0e544b574b14ea2c948bd8f9e51a1 | eb394b3f79ac0ebd5209096e268673be5d682d95d060fa0b3f5e5f9581d355e8 |
| 28 | b7f947f9d0308c7d60001f85770894b255cff2f44c2c763b702a204529ee34ce | d2d5a9cab5774077f8eaee1177533e0eba8fb5ac93848ce145b7afab1d1b403d |
| 29 | c65cac35fe17f8a669fd119004dab6b459685be18711718b26c2f9035c45839e | d9063ca4fe08bcdf827ffc79d797494f26ac3d00fee0c895cbc00142cfc25aa3 |

`inspections.json` binds these exact inputs, original source hashes, all three newly inspected composites, the independent inspection script, complete inventory mappings, actual pixel/label measurements, and rendered-spec validation results. `fig-*.author-render.snapshot.json` preserves the exact pre-promotion renderer bytes. Candidate paths inside these receipts are historical provenance; approval can be verified from the durable canonical spec/SVG plus these retained renderer snapshots, not by requiring disposable scratch.

Lesson/exercises template hashes remain `a5986e949ace9639c7633bf2d579e4622b2a7246dc192d031cef7bb0dc1283f8` and `a108f745dddf0051e04839b409b3f4697c599a0faa522ddfbdb3197c755c7e20`. The existing independent modern-text snapshots retain those complete bytes. The durable author directory, its source inventories, supplemental checks, first failure diagnosis, and first failure receipts are retained unchanged; `protected-author-bindings.json` enumerates their 60 hashes.

## Promotion Contract

All twelve canonical targets were absent before review writes and are checked again immediately before promotion. This actual PASS permits only new canonical `fig-{27,28,29}.{spec.json,svg,render.json,review.json}`. Spec/SVG promotion is byte-identical. The copied render reports may change only `spec.path` and `output.svg.path`; all hashes, status, geometry, counts, collision checks, and display measurements remain unchanged.

The existing `record_review.py` creates the independent canonical hash-bound `ld-s10y-image/review@1` records with PASS notes referencing this report and `inspections.json`, both by path and SHA-256. `promotion-bindings.json` records completed copies, path-only render rebinding, review hashes, preserved inputs, and the six actual image loads. Promotion does not rerender or perform a content repair.

**Image loads: 6/8 in one fresh batch, 6 total in this chat: 3 originals + 3 full final-width/theme composites. Reopens/crops: 0.** The author's separate image usage and one content repair remain unchanged. Only this raw lesson's `figure-review-27-29/` evidence and the twelve newly approved canonical files are writable. No author, source, template, manifest, shared code, app, or schema edits; no DB/Git writes, installs, paid calls, agents/chats/trees/branches/timers, or deployment.
