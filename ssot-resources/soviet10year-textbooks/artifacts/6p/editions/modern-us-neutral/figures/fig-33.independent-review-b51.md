# B51 First Independent FIG Review: fig-33

Verdict: **PASS**, limited to this hash-bound figure candidate. No essential
source-reading, mathematical, visual, cultural, or answer-leakage defect
observed. This is not a TEXT approval, promotion, lesson finalization, or
publication. Ticket identity from the author manifest: STEMROBIN-180;
lesson: 6p/phy6-c3-s5. Review date: 2026-11-17.

## Independent Pixel Inventory Frozen Before Spec

Both canonical originals were opened once FIRST, before reading either candidate
spec, the author's inventory, or any modern PNG. The reviewer's inventory was
frozen in the chat at that point; this section transcribes that independent
observation, not the author's object list.

- A single shared distance-time coordinate frame contains two solid
  trajectories, not two panels. Both begin at the same lower-left origin,
  labelled 0. Horizontal positive time and vertical positive distance axes
  each end with an arrowhead beyond their last labelled tick.
- Source units: seconds horizontally, meters vertically, with t and s.
  Exactly seven horizontal ticks: [1, 2, 3, 4, 5, 6, 7]; exactly six vertical
  ticks: [2, 4, 6, 8, 10, 12]. Equal intervals within each common axis.
- I is the upper, steeper straight line; its visible source endpoint is
  approximately (5 s, 10 m), and its name is above/left of the endpoint area.
- II is the lower, less steep straight line; its visible source endpoint is
  approximately (6 s, 6 m), and its name is above its endpoint area.
- Neither line continues beyond its own source endpoint. No projections,
  endpoint coordinate captions, speed values, winner annotation, explanatory
  answer text, grid, border frame, or different color legend.
- Modern-only choices: regularized vector strokes, English unit headings,
  readable typography, whitespace, and subpixel construction anchors.

Inventory mapping after the freeze: `single-shared-distance-time-frame`,
`time-scale-seven-ticks`, `distance-scale-six-ticks`,
`trajectory-I-source-endpoint-and-label`, and
`trajectory-II-source-endpoint-and-label` cover these observations. Their
referenced axis, tick, endpoint, connects, displacement, and perpendicular IDs
resolve in the read spec and preserved author validation evidence; object
counts alone were not treated as source-fidelity proof.

## Full Text Binding

Read the complete approved modern lesson and exercises templates, including
their source data, plus the complete canonical raw lesson and exercises.
Both candidates contain the same 18 actual authoritative strings: ten prose
blocks followed by all eight exercise texts, not merely file paths or hashes.
Read-only JSON comparison confirmed exact ordered equality of every string AND
its lesson/exercise identity against those templates, including line breaks,
math escapes, and punctuation. The extra provenance preamble is not counted
among the 18 strings. Embedded raw source data and source hashes also match
the canonical raw files.

The identities checked are the ten prose sources
`p0053#3`, `p0053#4`, `p0053#5`, `p0053#6`, `p0053#7`, `p0053#8`,
`p0053#9`, `p0053#10,p0054#1`, `p0054#2`, `p0054#3`, and the eight tasks
`g1:1#p0054#5`, `g1:2#p0054#6`, `g2:g2-1#p0054#8`,
`g2:g2-2#p0054#9`, `g2:3#p0054#10`, `g2:4#p0054#11`,
`g2:5#p0054#14`, `g2:6#p0055#5`.

The actual bound fig-33 task asks the student to compare uniform motions I
and II from the graph and explain the reasoning. The output retains the one
shared scale and source endpoints needed for that comparison, with no
numerical speed, inequality, result, or explanation annotation added.

| Complete text input, absolute path | Actual SHA-256 |
| --- | --- |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-distancetime-b51/lessons/phy6-c3-s5/lesson.template.json | bc828629d4e55f090d923af8dddaeeaf94585cb7f14f78e0eda2a5778bdd1cae |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/text-author-distancetime-b51/lessons/phy6-c3-s5/exercises.template.json | b3c2cd60f882a6df86567d37e96a78fc1f72dca3b3286a4cca6c42974a3b61c6 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s5/lesson.json | fbfe15649b33ce82c2c0327730e24dd20fa86c78ca0cd83e301771d4c6c53f8f |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/lessons/phy6-c3-s5/exercises.json | 7f10b147ad619680bd9ff439e2034e51b73f4bcc7bd3c97c322c9c9b5a1d24f0 |

## Native Visual Comparison

Opened the exact manifest-named full native PNGs at 306 and 640 once each,
with original-detail viewing, no crops or reopens. Both retain the complete
tick arrays, correct s (m)/t (s) headings, one zero, two arrowheads, shared
origin, two solid lines, I above the upper line, and II above the lower line.
I stops at the source's upper endpoint neighborhood; II stops at the lower
one. They are not extended to the time-axis arrow or split into frames.
Labels remain aligned to their ticks and distinct from strokes. No black
rendering, clipping, collisions, missing data, added answer guides, or
source-cultural text is visible.

Reused native evidence reports actual transformed minimum text 16.25625 px
at media width 306 and 34 px at 640, all 18 labels measured, no overflow,
no errors, status PASS. Reused repair render confirms no collisions and
both display checks PASS. No browser, renderer, native capture, standalone
validation, TEXT gate, or separate math gate was rerun.

## Repair Evidence Reused

Author manifest records one standalone validation PASS, first render FAIL
(exit 2, 14 collision entries), and the sole affected repair render PASS.
Read-only structural comparison with the preserved failed spec confirms only
`labelPlacement.offset` components on 14 objects changed: origin and all
13 tick labels. Coordinates, both curve endpoints, shared frame, tick arrays,
units, assertions, font sizes, strokes, gap threshold, and authoritative text
are unchanged. Repair budget is exhausted: used 1/1, remaining 0.
No exhausted-repair waiver was applied, and no candidate repair was made.

All identities below were independently SHA-256 checked against the manifest.
Preview/native identities additionally agree with the native evidence.

| Evidence, absolute path | Actual SHA-256 |
| --- | --- |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-33.png | 63db1941519c0fde7c332aaf60f67d82909a9cd505dc0d9f248c48f32005dfc6 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/fig-33.spec.json | c59f68c67898e3208664297c5494d5c29c9b289ee96540b01fb074cda240c6fa |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/fig-33.svg | 3ff448cb7986aee13345302b90e3a6bc918f3e3a944f1a5d5385b822b5ffcee3 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/repair-01-render.json | 76deb18fd7010a4bce568495173803c23821205be0656169b9ef5c1b9b858c62 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/native-preview.json | 848378606c6c3448236aa1f725f90e27be681c06af671bc3d1f7da90e54778f7 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/native-306.png | 4003559028f03cf4d6254bcf0078ea91647ba1266417f2ac049d6cd2b4f59e6c |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/native-640.png | 58fa54416f8d4e541c354d5781a1f64703f9dd0074fa43dca9d1ffd838a13b3f |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/output-manifest.json | 39a02a64a4e73b5b7d0a7079a3f7298f0d79d33ad31a5f635c1e40674d731806 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/source-inventory.md | 2b12c8a6db520aca7b080e8408e7f294321340a3a73fe6267e23c458a43f4b1c |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/first-validate.json | 4553d6f89459f795b9744c29ec9d13411c71e7d20dc393dcab3331a2799fe0cb |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/first-failure/fig-33.spec.json | f77f6fa224d53c0afb2efd54c9a62239a6d41100f94ed0ff62f450c5d0f335a2 |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/first-failure/fig-33.svg | 14e9d234df84389b4a7854464a9aa580f301f4ba5ceaedd198c7c53eec1f0abe |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/first-failure/first-render.json | 8bbdec7faf3950660a8b0c1014222dc4a4bcafb37b753c1d20b51c73c51db3fb |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/s10y-image/b51-fig32-33/fig-33/first-failure/failure.md | 5665112bbe190329a6a3df9a9234dd4880ec8a3c990ee752f815f6da3a677a22 |

## Scope And Recording

Record `review.json` once using the existing `record_review.py`, the exact
current spec and repair render, status pass, and this report's path/hash in
notes. Its mandatory embedded rendered-spec/provenance checks are not an extra
standalone author-validation run.

Image ledger for this review task: fig-32 original 1 + native 2 = 3;
fig-33 original 1 + native 2 = 3; total 6, maximum batch 6 <= 8,
context 6 <= 24, crops 0, reopens 0, parent image loads 0. No speedtable image
was opened. Only the two independent reports and two requested review files
are written; other workers' candidate/evidence files remain unchanged.
No answers, keys, choice artifacts, service, DB, Git, app, or dependencies
were accessed for modification. No promotion or finalization is authorized.
