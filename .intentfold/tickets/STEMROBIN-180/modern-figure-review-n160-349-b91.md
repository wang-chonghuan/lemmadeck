# FIRST REVISE: FIG349 Independent Review

Date: 2026-11-19. Ticket: STEMROBIN-180 C / 180-4. Figure: fig-349 only.
Workspace: `/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.
This is a limited reviewer memo, not an official figure record, promotion,
headed-product DISPLAY acceptance, or full-course approval.
Pre-existing SOURCE/TEXT approvals are retained unchanged, not reopened or
granted anew. No author files were edited.

## Selected Candidate

Only the fig-349 entry was extracted from
`.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/selected-candidates.json`.
Its current directory is
`.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/fig-349/label-repair/`.
The previous candidate was not inspected.

Read the image skill, quality-gate and figure-spec contracts, the supplied
`modern-figure-author-n160-b91.md` inventory, the selected spec's complete
modern prose and six exercises, and the existing render/native reports.
The source-pixel inventory below was independently checked before opening
the native output. The author inventory was context, not approval evidence.

## Actionable Defects

1. **R1: Rotation arrow reverses the source direction.** In the original,
   the curved arrow above the winding points down-left at its left end.
   The native drawing points down-right at its right end. This is visible
   in both the full640 and actual297px views, not merely an arrowhead-size
   issue. `source-rotation-head` at spec line 898 runs from
   `[308.8198952859183,547.071653310765]` to
   `[340.5234085730457,532.222487630462]`.
   Repair the curve/head direction to match the original left-ended arrow,
   and update its endpoint assertion. Do not interpret this curved indicator
   as an electrical-current arrow or infer current from the open switch.

2. **R2: The shaft is visibly detached from the winding.** At x=295 the
   solid winding's top edge is y=471, but `upper-axle` ends at y=487:
   a 16px source-canvas gap, approximately 7.43px at 297px media width.
   The bottom winding edge is y=302, but `lower-axle` starts at y=291:
   an 11px gap, approximately 5.10px at 297px. The full native view shows
   a floating upper shaft and a lower interruption, rather than the
   source's winding mounted on one shaft. Relevant objects are at spec
   lines 643, 657 and 671. Join the shaft sections at the actual top and
   bottom winding intersections, with coherent foreground/background
   occlusion. For this geometry those intersections are `[295,471]`
   and `[295,302]`. Preserve the dashed alternate posture and base.
   Per-segment `connects` assertions do not establish shaft continuity.

3. **R3: A winding lead appears electrically joined to the shaft.**
   `right-winding-lead-s1` (spec line 1578), from `[236,270]` to
   `[338,253]`, crosses the continuous lower shaft at approximately
   `[295,260.166667]`. Both use uninterrupted solid ink, with no bridge,
   insulation or explicit non-junction cue. The native full view has a
   merged crossing; the 297px view provides no clearer distinction.
   This is a misleading connection cue, not a finding that the declared
   electrical graph necessarily shorts the battery. Add a clear
   non-junction/insulated crossing that remains visible at 297px, or
   change the lead's perspective routing. Keep each winding end attached
   to its own rotating half-ring; do not turn the shaft into a conductor.
   Keep those rotating attachments visually distinguishable from the
   stationary brush contacts, currently sharing the tangent coordinates
   `[252,210]` and `[338,210]`.

## Independent Apparatus Check

The original PNG shows one rectangular winding/frame on a vertical shaft,
S at the left pole and N at the right pole, a left-ended curved rotation
arrow above it, and a narrow dashed alternate/equilibrium posture.
Below the winding are the split commutator assembly, two stationary
brushes, the shaft support and a perspective base. The original's small
commutator details are schematic, not a quantitative ring scale.
The accompanying modern prose explicitly establishes two insulated
half-rings and one separate winding end attached to each.
The original also includes a separate battery with + and - terminals,
an open knife switch, exterior supply wiring, and pole-side stubs.
No A/B/C/D frame labels are legible in this source.

- S-left/N-right: retained and legible at both inspected widths.
- Rectangular winding and dashed equilibrium outline: retained; the
  narrower outline reads as another posture, not another powered winding.
  Perspective regularization is acceptable except for the shaft and
  crossing defects above; no source angles or lengths are asserted.
- Split commutator: two distinct half-ellipse strokes in one plane, with
  visible gaps at both ends of the split, not two complete slip rings.
  Separate left/right fixed brushes touch the respective halves.
- Winding ends: two distinct routes leave the winding's break and reach
  different half-rings. They are not directly joined to one another.
  Their shaft-crossing/contact presentation requires R3.
- Exterior circuit: negative battery plate to left brush; positive plate
  through the open switch to right brush. No supply-wire bypass closes
  the switch, and the two battery terminals are not externally shorted.
  The battery's long/short plates and + / - labels agree.
- Open switch: the lifted blade remains separate from the fixed contact.
  Existing `open-switch-gap` is 26.83281573 canvas units. The gap is
  visibly open in both native views.
- Base and pole stubs: present. Pole stubs do not touch supply wiring
  and are not represented as added circuit junctions.
- Labels: only S, N, + and - are visible. Internal `frame-A` through
  `frame-D` IDs have no visible letter labels; no guessed letters leaked.
  No cultural wording, force vectors or new current-direction arrows.
- Text/current claim: the spec explicitly says not to claim current flows
  with the depicted switch open. The lesson explains operation when
  current is present/after circuit closure; exercise 3 is conditional
  on current. The FIG349 sentence says the modified apparatus *can*
  rotate continuously, not that current flows at this open-switch instant.
  No new TEXT defect or text edit is requested.

## Reused Evidence

Existing `render.json` status: PASS. Existing `native.json` status: PASS.
These are unchanged technical evidence, not overrides of this visual REVISE.
Render label checks report 36px at 640px, 20.1375px at 358px and
16.70625px at 297px, with no reported label collisions. The native report
likewise reports 16.70625px labels at actual297px, no overflow, and reachable
ends. These values were read, not rerun.

Native scope remains figure-only full resolution plus existing app-CSS
fixtures, explicitly not headed-product or full-lesson DISPLAY acceptance.
The inspected native PNG contains the full640 and actual297px drawings in
one image. No separate candidate PNG was opened.

SHA-256 values below are reused verbatim from the selection/render/native
reports. They were not recomputed by a freshness or source gate:

| Artifact | SHA-256 |
| --- | --- |
| Original source PNG | `6c299b35332c8c1af75e55cab3b71cd011a3a111ca1a1feeb76ab3724eb9d2a8` |
| Selected spec.json | `c7915923fd9cb9b67ee5124da52d1c5cee6d44807bf06b482c17ed73bcef89bb` |
| figure.svg | `bce1287e6ae445ca89e5a837e871294108e9ea299878ffbe6b22d01bad33ac8c` |
| render.json | `5eb4d6921bd47051073fa7cc51dbf2fd8045d634c533d08be593a7e970163b49` |
| native.html | `e9b1b41cc87a93ac54fd3550844ec606dd4fb60520ef299829342a6aace88dc4` |
| native.png | `a8ab7998106ff0a58474db169298b504f81a5ddd56862b4a0f9c624d385d963c` |
| App CSS bound by native report | `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f` |

The native report's own file hash was not supplied and is not invented.
No existing official review or approval record was inspected or changed.
Text-only evidence: `tmp/resume-180-4/fig-review349/review-evidence.json`.

## Accounting And Boundaries

Images opened: **2**, expected 2, maximum 4. Order: original
`spec.source.image` PNG once, then existing `native.png` once.
Reopens: 0. Crops: 0. Separate candidate.png opens: 0.
Image payloads sent to other contexts or included in the response: 0.

Tool accounting for this review including the final evidence readback:
18 shell commands, each with the explicit workspace cwd; 2 image-view calls;
1 apply_patch call writing only this memo and the permitted text evidence;
5 parallel orchestration calls. Total: 21 leaf calls, or 26 tool invocations
including orchestration (11 top-level calls). Three selection queries emitted
only root field names or an empty selection before the correct fig-349-only
extraction; no other selected candidate content was displayed.
The target existence check returned missing paths and was not a gate run.

Paid calls, setup, freshness runs, render/source/display gate reruns, backend,
Git, DB, environment inspection, other session/chat/agent/branch/worker
inspection or contact: **0**. No processes or sessions were started.
Only the two named review outputs were written; all authors' work is preserved.
