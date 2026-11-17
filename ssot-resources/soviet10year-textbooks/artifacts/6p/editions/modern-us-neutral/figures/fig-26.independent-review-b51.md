# FIRST Independent FIG Review: fig-26

Scope: 6p, phy6-c3-s1 (mechanical motion), fig-26 only. Frozen candidate.
Reviewer owns this report and the adjacent review.json only. No candidate
changes, repair, promotion, validation/render replay, browser, or other-figure
inspection is permitted. Author repair 1/1 is exhausted; FIRSTFAIL is retained.

## Source Inventory Recorded Before Reading Candidate Spec

Image 1/3 was opened once, in full, at its original resolution:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-26.png`.
The inventory below was recorded before reading spec.json or author evidence.

- One black continuous angular trajectory on a white scanned background.
- Two unnamed, filled black endpoint marks: a lower-left mark with scan damage
  and an upper-left solid mark. There are no separate intermediate point marks.
- Starting at the lower-left marked endpoint, the stroke runs up-left to the
  far-left corner, up-right to a left shoulder, down-right to an inward corner,
  up-left to the top-left corner, right across the top, down slightly left to
  the upper-middle inward corner, up-left to the short upper-left shelf,
  approximately right along that shelf, down-right to the upper-right corner,
  down the right edge, up-left to the right inward notch, down along the short
  notch edge, left across the middle-low shelf, down to the bottom-left corner,
  right across the bottom, then up-left to the upper-left marked endpoint.
- The trajectory is open between those two marked endpoints, not a closed
  perimeter. Its short bends and inward notches are essential to its topology.
- Four apparent non-vertex self-crossings: the rising upper-left slant crosses
  the short upper shelf and the upper inward diagonal; the descending
  top-right slant crosses the long diagonal toward the right edge; the final
  diagonal from the bottom crosses the middle-low shelf.
- Crossings are ordinary stroke intersections without dots, bridge gaps, or
  arrowheads. No path traversal direction is explicitly indicated.
- No visible letters, words, numbers, units, axes, ticks, grid, panel labels,
  caption, object illustration, or cultural insignia. Small isolated specks
  and holes in the lower marker are scan artifacts, not instructional content.
- Approximate source-pixel locations orient this inventory, not measured
  physics data: lower marker (80,184), far left (18,141), left shoulder (57,81),
  inward corner (129,114), top-left (95,20), top-right (181,18),
  upper inward corner (174,111), shelf-left (78,62), shelf-right (151,59),
  right-upper (221,110), right-lower (222,193), notch-upper (174,153),
  notch-lower (175,195), middle-low left (114,190), bottom-left (116,256),
  bottom-right (174,257), upper marker (86,127).

## Verdict

PASS, first independent visual review of this frozen candidate on 2026-11-17.
No remaining figure defect was found. This approves only the inspected fig-26
bytes, not promotion, publishing, lesson assembly, or another figure.

## Authoritative Text and Exact Source Mapping

Read in full, not just the fig-26 paragraph:

- Canonical raw `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s1/lesson.json`.
- Canonical raw `ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s1/exercises.json`.
- Approved `.tmp/ld-s10y-lesson/text-author-motion-b51/candidate/lesson.template.json`.
- Approved `.tmp/ld-s10y-lesson/text-author-motion-b51/candidate/exercises.template.json`.
- Image skill SKILL.md, references/quality-gate.md, and references/figure-spec.md.

The two templates' source SHA-256 values equal the current canonical raw file
hashes; their embedded source.data equals those raw JSON documents exactly.
All 23 ordered source.authoritativeText entries in fig-26 spec.json match the
approved templates exactly, including every per-text SHA-256 tag: one printed
title, 14 nonempty prose/caption items, and all eight exercises.

The figure's direct raw prose is `p0043#9`:
"气体分子的运动轨迹是一条折线（图 26）."
Its approved modern text is:
"气体分子的运动轨迹是一条折线（图 26）。"
The definition immediately preceding it is `p0043#8`. The figure insertion is
`p0044#3`, its external caption is `p0044#5`, and its manifest page is 44
(printed page 33). No exercise references fig-26; all eight question texts and
their empty figure_refs were read. Thus the image is an instructional example
of a gas molecule's broken-line trajectory, not a quantitative exercise,
clock-hand diagram, skier's OA route, apparatus diagram, or answer panel.
Neighboring prose/caption text was read only because full approved context was
required; no other figure asset, spec, author output, or review was inspected.

The source/spec binding is the canonical 6p PNG opened first, not a substitute
scratch copy. Its current SHA-256 equals source.image.sha256. The initial
independent pixel inventory above matches the spec's inventory groups; source
facts and modern cleanup are explicitly separated.

## Bends, Endpoints, and Self-Crossing Topology

The independent trace yields 17 successive positions: two marked endpoints
and 15 unmarked bends, joined by 16 straight segments. Candidate source-screen
estimates differ slightly from my rough pixel estimates within the thick
scanned stroke; they preserve every bend and all side/order relationships.
There are no source measured coordinates, angle values, lengths, or equal-step
requirements to alter.

| Independent source portion | Current object and assertion mapping |
| --- | --- |
| Lower endpoint to far-left corner | src26-segment-01; src26-connect-01; src26-vector-01 |
| Far-left corner to left shoulder | src26-segment-02; src26-connect-02; src26-vector-02 |
| Left shoulder to inward corner | src26-segment-03; src26-connect-03; src26-vector-03 |
| Inward corner to top-left | src26-segment-04; src26-connect-04; src26-vector-04 |
| Top-left to top-right | src26-segment-05; src26-connect-05; src26-vector-05 |
| Top-right to upper inward corner | src26-segment-06; src26-connect-06; src26-vector-06 |
| Upper inward corner to shelf-left | src26-segment-07; src26-connect-07; src26-vector-07 |
| Shelf-left to shelf-right | src26-segment-08; src26-connect-08; src26-vector-08 |
| Shelf-right to right-upper | src26-segment-09; src26-connect-09; src26-vector-09 |
| Right-upper to right-lower | src26-segment-10; src26-connect-10; src26-vector-10 |
| Right-lower to notch-upper | src26-segment-11; src26-connect-11; src26-vector-11 |
| Notch-upper to notch-lower | src26-segment-12; src26-connect-12; src26-vector-12 |
| Notch-lower to middle-low left | src26-segment-13; src26-connect-13; src26-vector-13 |
| Middle-low left to bottom-left | src26-segment-14; src26-connect-14; src26-vector-14 |
| Bottom-left to bottom-right | src26-segment-15; src26-connect-15; src26-vector-15 |
| Bottom-right to upper endpoint | src26-segment-16; src26-connect-16; src26-vector-16 |
| Two endpoint discs | src26-molecule-lower, src26-molecule-upper; src26-count-molecules; src26-endpoint-distance |
| Complete segment inventory | src26-count-segments, count 16; all connects/vector assertions above |

The endpoint assertion is a displacement, despite its ID containing "distance":
dx=6, dy=61 in construction space. Both circles are centered on the corresponding
ends of segments 01 and 16. No additional point marker is visible. All segment
connections and displacement assertions use explicit deterministic coordinates;
there is no opaque freehand svgPath substituted for the trajectory.

The four visible non-vertex crossings are segment pairs 04/08, 04/07, 06/09,
and 13/16. Their order and locations match the independently inventoried
source folds. None becomes an extra molecule, marked branch, bridge gap, or
shortcut. The path remains one open ordered trajectory; regions enclosed by
its self-crossings do not turn it into a closed polygon object.

## Three Image Observations

Exactly three images were loaded, once each in full, in this order. No crop,
reopen, thumbnail, browser screenshot, or newly rendered image was made.
Task/context usage is 3 images, below the 8/task-batch and 24/context limits;
no image payload was sent to another chat.

1. Canonical original PNG, 237x274: irregular solid stroke, 15 angular bends,
   16 segments, four unmarked crossings, and two endpoint discs; damaged scan
   flecks inside the lower disc are not text or separate objects. No labels,
   arrowheads, dimensions, scales, grid, or culture-bearing content.
2. Frozen native-306.png, 306x354: the full trajectory is readable at native
   mobile media width. The short shelf, sharp upper fold, right inward notch,
   lower fold, and all four crossings remain distinguishable. Two clean discs
   are separate, and their incident segments reach them without an exposed
   gap. No clipping, extra label, arrow, or construction point is visible.
3. Frozen native-640.png, 640x740: all 16 segments and 15 bends retain the same
   shape and crossing topology at desktop media width. Sharp corners have
   small butt-cap projections where separate strokes meet, but no detached
   segment, added point, missing turn, or misleading rounded corner. Both
   discs are filled and circular, and the entire composition has clear white
   margins. There is no raster blackout or unintended visible annotation.

## Sizing, Semantics, and Cultural Rules

Display is correctly instructional, inline, maximum width 640; declared media
widths are 306 and 640 with minTextPx=16. The source canvas is 640x740 with
keepAspectRatio=true. The existing author's native-preview.json reports complete
media bounds of 306x353.8125 and 640x740 at device scale factor 1, consistent
with the two inspected PNGs. I did not claim a new headed-product measurement.

Existing render.json reports 18 objects, zero labels, no collisions, and PASS
at both widths; measuredMinPx=null is appropriate because there is no rendered
text. Direct XML inspection confirms 16 visible source lines, two visible
source ellipses, zero text nodes, zero marker definitions, and an empty label
layer. There is no hidden answer-bearing visible content.

Every visible source object uses var(--ld-figure-ink, #15201f); the background
uses var(--ld-figure-paper, #ffffff). Renderer construction ellipses and default
color paths are display:none/visibility:hidden, not extra visible objects or
theme-colored source content. The screenshot's clean neutral ink on white is
legible. No theme-browser or print-browser replay was performed.

No Cyrillic, Chinese, Soviet symbol, uniform, flag, handwriting, fictional
cultural wording, archival texture, or historical identity appears in the
modern output. English-visible-label policy is satisfied vacuously: there
are no visible labels. The external Chinese caption remains edition prose,
not text in the figure. Equal-radius endpoint cleanup and scan-speck removal
are explicit modern adaptations, not fabricated source physics facts.
No names, motion direction, collision partner, elapsed time, numerical angle,
scale, or solved answer has been invented.

## Reused Evidence and Review Boundary

Author validation: PASS once, as supplied in the frozen handoff. There is no
separate validation transcript in this fig-26 directory; I did not create one
or replay validate_spec.py. Existing render.json and native-preview.json are
both PASS and were read without rerendering. Current spec/SVG hashes equal
render.json's references. Native PNGs and metadata are additionally inventoried
by hash below because the render report binds the SVG, not preview PNGs.

FIRSTFAIL.md explains the failed patch-context match and value-to-count
correction; FIRSTFAIL.spec.json remains present and unchanged. Repair 1/1 is
exhausted. No new repair was attempted. Any remaining or subsequently discovered
defect blocks promotion; this PASS gives no authority to modify the candidate.

Only the required record_review.py invocation is authorized to create adjacent
review.json, with --spec, --render, --output, --status pass, and notes binding
this completed report's SHA-256. Its built-in recording preconditions are not
a separate reviewer validation/render/gate replay. No answers, keys, choice
work, DB, publishing, Git, services, app, or dependency operations were used.

## Frozen File SHA-256 Inventory

Paths in this table are relative to
`/Users/yong/.codex/worktrees/0f12/lemmadeck`.

| File | SHA-256 |
| --- | --- |
| ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-26.png | f1b7bc38028e55b9c54694e2f16a0df2e3f9466268c8bf9755733625f97c02db |
| .tmp/s10y-image/b51-fig25-26/fig-26/spec.json | 90c6d3c866dcae3e5898299450130ee277bdae2ad5e68093f3cf902946481103 |
| .tmp/s10y-image/b51-fig25-26/fig-26/render.json | 4399f52604bc6c9cf39f9d40d90e9f3777b4d21b16bf73de2fbf530563c6a5b4 |
| .tmp/s10y-image/b51-fig25-26/fig-26/fig-26.svg | a4f31927ea010fa26ca11fb34b0f5650f3c57691ccb0a177c8bd6ed3d238172c |
| .tmp/s10y-image/b51-fig25-26/fig-26/native-306.png | fdf200a53dd80060f1fb67231f3ee023cbb07935c1e36b367f4db121de5bbce0 |
| .tmp/s10y-image/b51-fig25-26/fig-26/native-640.png | 546d3eac3f4abf12c0c2cbe975f49ef67b00aee8b1af0d17c10bda0f19fd30e5 |
| .tmp/s10y-image/b51-fig25-26/fig-26/native-preview.json | 028eee435090fa6d72b9b1373f0d643417ca4af0cd028988d9a14f1c7fa465cb |
| .tmp/s10y-image/b51-fig25-26/fig-26/FIRSTFAIL.md | e2843c343cf8feff45f80a9c216e3e12e81ccad88a220e8a5c8f988b695c5ac4 |
| .tmp/s10y-image/b51-fig25-26/fig-26/FIRSTFAIL.spec.json | 8cb5e54e5ca98313664d211df7851bee0e606717d8636987420bf4eb00fce5ce |
| .tmp/ld-s10y-lesson/text-author-motion-b51/candidate/lesson.template.json | 376eb2a93b85758ebca1434d014323d9d1371ccb50040c9b50a9529265340c3f |
| .tmp/ld-s10y-lesson/text-author-motion-b51/candidate/exercises.template.json | 8a817e764d196570de530e74c28d9f1945e45a2e563e707f8fa9402e7c8668cf |
| ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s1/lesson.json | a813c9f785438aafc4f85da46e5b6b55aa4cd09138b03b12721229983de131f4 |
| ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s1/exercises.json | 2a4d6ba47da3005c33ef76af89be39ad6aee8581217e6ef93c7b62d5df8bf34a |
