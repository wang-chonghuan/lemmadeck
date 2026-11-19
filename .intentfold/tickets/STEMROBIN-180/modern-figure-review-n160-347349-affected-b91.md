# B91 n160: Independent Affected FIG Review 347-349

Date: 2026-11-19. Ticket: STEMROBIN-180 / 180-4.
Explicit workspace: `/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.

**fig-347: BOUNDED AFFECTED PASS. fig-348: BOUNDED AFFECTED PASS. fig-349: BOUNDED AFFECTED PASS.**

No actionable remaining affected-fix defect or repair regression was found in
the six inspected images. This verdict is bound to the exact files below.
It is not a clean FIRST pass, an official `ld-s10y-image/review@1` record,
SOURCE/TEXT reapproval, fullDISPLAY acceptance, whole-lesson/course approval,
or permission to publish/promote. Existing FIRST REVISE reports and failure
history remain intact. The parent's n161 work is outside this review.

## Scope And Method

Selected only figs347,348,349 from
`.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/FIG-FIRST-affected-final-selected.json`.
Each selected directory is
`.tmp/ld-s10y-lesson/resume-180-4-n160/modern-figures/fig-N/FIG-FIRST-affected/`.
The previous specs were read as text to identify the affected changes; no
previous candidate image was opened.

Read the workspace `ld-s10y-image/SKILL.md` and `references/quality-gate.md`,
the `ips-chrome-background` skill, and the two existing FIRST REVISE memos.
Read the complete approved edition `lesson.json` and `exercises.json` at
`.tmp/ld-s10y-lesson/resume-180-4-n160/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c2-s4-n160/`.
Their 20 nonempty prose/caption entries and six exercises exactly match each
spec's 26-entry `source.authoritativeText`. This is FIG context comparison,
not a SOURCE or TEXT gate rerun.

Image order, each exactly once: original347, original348, original349,
selected native347, selected native348, selected native349. The originals
are precisely the PNGs named by `spec.source.image.path`. Each supplied
native image contains the full640 view and actual297px app-CSS view.
No reopen, crop, candidate PNG, new screenshot, or image-bearing handoff.

Reused the existing PASS `render.json` and PASS `native.json`. SHA-256
readbacks matched the selection and every existing source/spec/SVG/render/
native-HTML/native-image/CSS binding. Inventory object/assertion identifiers
were looked up; none were unresolved. No validator, relationship assertion
executor, renderer, native browser, SOURCE, TEXT, or fullDISPLAY gate ran.
Object counts and author's descriptions were not treated as source fidelity.

## Independent Inventory And Affected Findings

### fig-347

- Original inventory: one perspective rectangular winding between S-left
  and N-right poles; A upper/front, B upper/back, C lower/back, D lower/front;
  top current B-to-A, bottom current D-to-C; one curved rotation indicator
  above B with its head at the left end; an axial mounting; separate E/F
  commutator pieces, two winding-end leads, stationary brush1 left/negative
  and brush2 right/positive, their external leads and signs. No separate
  battery, switch, grid, measured value, field/force vector, or third current
  arrow is present to restore.
- Mapping: `S-pole`, `N-pole`, `S-label`, `N-label` and their `*-inside-pole`
  assertions; `coil-A/B/C/D`, winding-edge objects and their `*-connected`
  assertions; `source-current-top/bottom`; `source-rotation-curve-s0..s11`
  and `source-rotation-head`; `upper-shaft`, `shaft-in-coil`, `lower-shaft`;
  `half-E/F-s0..s15`, `negative/positive-coil-end-s0..s2`, `brush-1/2`,
  their numerals, `negative/positive-supply-s0..s2` and polarity labels.
  These map to the three declared inventory groups. No source subfigure,
  apparatus connection, visible label, or current marker was omitted.
- Rotation repair PASS: the native arrow is now left-ended/down-left in
  both views, matching the original. `source-rotation-head` runs from
  `[383.8424873787209,524.8731800645588]` to
  `[346.4731285340971,512.9413651228665]` in user coordinates. The connected
  assertion uses these same endpoints; there is only one rotation head.
- Corner repair PASS: A, C and D have short muted identifying leaders to
  their unchanged corners. They are visibly distinguishable from thick
  winding conductors and do not join apparatus parts. B remains associated
  with the upper/back corner. No corner anchor or letter identity changed.
- Crossing/contact repair PASS: the continuous winding lead passes in
  front of the shaft, with visible paper clearance at the crossing in both
  views. `positive-coil-end-s1-insulated-underlay` is 17px paper behind the
  3px ink lead, not an electrical junction or a severed winding. The two
  half-ring gaps remain open around the shaft. Rotating winding leads meet
  exposed arcs separately from the stationary brush tangencies.
- Required invariant retained: positive supply -> brush2/F -> D -> C ->
  B -> A-side winding return -> E/brush1 -> negative supply. F-to-brush2
  and D-to-C remain correct. The separate A-side terminal is not falsely
  joined across the deliberate winding-end break.

### fig-348

- Original inventory independently differs in corner identities: D
  upper/front, C upper/back, B lower/back, A lower/front; top current C-to-D,
  bottom current A-to-B. F is the left/upper commutator piece, E the
  right/lower piece. Fixed brush1 is negative left and brush2 positive
  right. S-left/N-right, both winding leads, shaft, signs, external leads,
  and the left-ended rotation arrow are present. No planar half-turn of
  the perspective projection was assumed.
- Mapping uses the same apparatus IDs and connection assertions as347
  with `coil-D/C/B/A` and corresponding letter/edge IDs, `half-F/E` in their
  correct respective positions, and all three source-inventory groups.
  No source apparatus item, label, or current marker is missing.
- Rotation repair PASS: the same selected head endpoints as347 now give
  the original left-ended/down-left direction, without reversing either
  winding-current arrow.
- Corner repair PASS: D, B and A have short muted leaders to the unchanged
  corners; C remains clearly associated with the upper/back corner. The
  letters are readable and unambiguous in the actual297px view.
- Crossing/contact repair PASS: the same 17px paper underlay distinguishes
  the 3px winding lead from the mechanical shaft. Open commutator gaps,
  separate lead attachment points, and fixed brush contacts remain visible.
  Identifying leaders add no circuit connection.
- Required invariant retained: positive supply -> brush2/E -> A -> B ->
  C -> D-side winding return -> F/brush1 -> negative supply. E-to-brush2
  and A-to-B remain correct. The winding-current objects are byte-for-byte
  unchanged as JSON objects relative to the previous spec.

### fig-349

- Original inventory: one rectangular winding on a vertical shaft between
  S-left/N-right poles; left-ended curved rotation indication; dashed narrow
  alternate/equilibrium posture; commutator and two brushes below the
  winding; separate winding-end and supply wiring; shaft support and
  perspective base; a battery with + and -; an open knife switch; pole-side
  stubs. No visible frame letters, brush numerals, or electrical-current
  direction arrows occur. No quantitative grid or dimension is given.
- Mapping: `south/north-pole`, `S/N-label`, pole stubs and inside/connection
  assertions; `winding-A-D`, `winding-D-C`, `winding-C-B`,
  `winding-B-A-return`, `equilibrium-s0..s3`; `upper-axle`, `frame-axle`,
  `lower-axle`; rotation curve/head; `left/right-half-ring-s0..s15`,
  `left/right-winding-lead-s0..s2`, `left/right-brush`; `base`,
  `battery-negative/positive`, terminal labels, `negative-lead-s0..s3`,
  `positive-to-switch-s0..s1`, switch objects and
  `switch-to-right-brush-s0..s2`. These cover the four inventory groups.
  The modern simplified base/battery/poles retain the instructional
  apparatus, not source artistic perspective or a measured ring scale.
- Rotation repair PASS: head now runs from
  `[289.8424873787209,547.8731800645588]` to
  `[252.4731285340971,535.9413651228665]`, giving the source's left-ended/
  down-left rotation sense. No invented current arrow or frame letter.
- Shaft-end repair PASS: upper shaft and interior shaft now share
  `[295,471]`; interior and lower shaft share `[295,302]`. Both formerly
  missing end gaps are closed in the supplied native views. The deliberate
  foreground lead occlusion below the winding is visually distinct from
  those repaired mechanical end joints. Dashed posture and base remain.
- Crossing/contact repair PASS: `right-winding-lead-s1-insulated-underlay`
  provides the visible non-junction at the shaft crossing. Each winding
  end reaches a separate exposed half-ring arc; those attachments are
  distinct from brush tangencies `[252,210]` and `[338,210]`. Both insulating
  splits stay open; no full slip ring or shaft conductor was introduced.
- Circuit unchanged: negative battery terminal to left brush; positive
  terminal through the still-open switch to right brush. No bypass, merged
  terminals, or invented current with the switch open. Existing
  `open-switch-gap` remains 26.832815729997478 user units; it was read, not
  executed. Pole-side stubs remain separate from supply wires. Visible
  labels remain only S, N, + and -.

Modern additions are specifically the corner-identifying leaders, larger
schematic insulating clearances, rerouted exposed winding attachments, and
paper crossing underlays. They are not new source facts, angular values,
force vectors, current claims, or label identities. Text and source-image
fields are unchanged relative to the respective prior specs. No apparatus
object was removed. The affected geometry changes remain within the stated
rotation/label/insulation/shaft defects and their direct connection effects.

## Exact Evidence

Paths below use the selected directory convention above. Original directory:
`.tmp/ld-s10y-lesson/resume-180-4-n160/artifacts/7p/figures/`.

| File | fig-347 SHA-256 | fig-348 SHA-256 | fig-349 SHA-256 |
| --- | --- | --- | --- |
| Original `fig-N.png` | `bbd064aaf54474ce2811b3f2b16347353b00037651d2a326fb583c2dff3fc714` | `32bb495b2dcc4e9eeb75f27faa5545bbd3fcef84f7a0018ae17a8506af8db9f6` | `6c299b35332c8c1af75e55cab3b71cd011a3a111ca1a1feeb76ab3724eb9d2a8` |
| Selected `spec.json` | `435476c0058d1affcaaa0bea163d9b1886b6c23990ea10db81978ed55a22c783` | `53ba0017f822642803aa8afacaa2538000eb5094f34b2a9d56f0b95b33ff6911` | `7b46dcc345571c2a26722d6b63aa9fe2f77411171a2dc5ea4c27132c2ab16929` |
| `figure.svg` | `77f00a1144d35996430ea18da9bc8e5e2200f4fd70663ac0cdfd3e9dbaa31d15` | `06adafc6cc9b03a3b7e8c698e41c2ee74343e2e9cb681928bffaa03a1ce3e558` | `433d93859eed5912cd6edfde9afe4b9102f30098cb67ff8d434b74cebc3fa527` |
| PASS `render.json` | `82e9eb5abfa74b98205cab7e60fe8d182bcd9bcc074dbdad9fca800ec2753eb5` | `cb7ea4a1d7561dd5a8e60e37bdb3bdaf3f48d82bd11d27d4b04da4d48db9a1ca` | `cbd87ec82e959cdde4ce2a9b32b307590a1dd2fcc940ec41cb3cbffe180d9b21` |
| PASS `native.json` | `3a3a33f6e07cfb0255b4884265ea3827d50b0ca95e9c65640aacee6d8bc22af5` | `87a2f5d64597a3f4317d08bf5a54936b4ee5589c0109a3068defd0fd77065262` | `03090b0c36f5fadc25c25d63bd5aadc01651efb7795b887531deba3ec22f8a64` |
| Inspected `native.png` | `ef28e4a84596ab91a206c363cfa2e95b519ae050aa01165631beaec2e5b608ae` | `26a247c466f5a8342e5be154dbf070e5fb2788a9afa7e443edb89f9ccb28d63c` | `fc423a1f5e4487f2653df611bd405c91e63b473389a3ce2f72060138d51f82c8` |
| `native.html` | `c80a492b9ed06d7bac545b1e8ce55a7c0faae30e33653f3da38a2ebdd966cd5b` | `f976041255ebc816b0cba40aa00d1cebfe3378cbedb29d1f6b05991a43b9e711` | `0e2778b0b2761940cae165d5d953c90cdeb04180aa4cab24ed0f2f6b8772469e` |

Shared inputs:

- Selection JSON: `a3a2dc9563ddb4ee407dc1553a4c0c136d1c313fcf04ba13338dbebfac2f85b6`.
- Approved edition `lesson.json`: `0d7ee8aeee804ce571696fee2d5967abb7e7b8d1cab4b468c78b66ba1cb0ad43`.
- Approved edition `exercises.json`: `d7b6f7e903067ffb029879de583c04f8bdc353116c297d56847e443c5c1a2e64`.
- All three compact `JSON.stringify(source.authoritativeText)` arrays:
  `dc672e14ebb90f3f646c7edd9712a6780b2e78571fd27cf26eabb09666ec2860`.
- Bound `app/src/styles/app.css`: `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f`.
- Preserved `modern-figure-review-n160-347348-b91.md`:
  `15189787a42bbaf796c2dfe0fa5b70c07b8e2b07772fb931930f4617d13366c0`.
- Preserved `modern-figure-review-n160-349-b91.md`:
  `4067536a4c938b8a4af463592d774138a2b1ac52e4d124085e42d62d0a45d385`.

Native reports each retain 14 historical headless figure-fixture observations:
actual prose widths495/358/297 and exercise widths352/297, minimum actual297px
text16.70625px, labels inside, zero page overflow and reachable ends.
Renderer reports retain 640/358/297 width passes and no collisions.
These are read-only reused observations, not new browser tests or fullDISPLAY
acceptance. Pixels were inspected only for the two views in each native PNG.

## Accounting And Preservation

- Images: 6 total in one batch, maximum8/batch and24/context; 3 originals
  plus3 native images; reopens0, crops0, candidate-image opens0.
- Exact tool types: `multi_tool_use.parallel`, `functions.exec_command`
  (read-only `cat` and structured Node inspection/SHA-256), six
  `functions.view_image` calls, one `functions.apply_patch`.
- Including the final text/hash/permission readback: 14 shell executions,
  6 image-view calls, 1 apply_patch, 5 parallel wrappers; 21 leaf calls,
  26 invocations including wrappers. Some exploratory full-spec/report/diff
  text outputs were truncated; compact structured reads supplied the
  necessary complete fields. No command execution failed.
- Browser sessions, paid calls, setup/freshness, render/native/validator/
  SOURCE/TEXT/fullDISPLAY reruns, tasks/agents/chats, Git, backend, DB,
  publish and promote: 0 each. No environment or credential file was read.
- Written only this memo and own text evidence:
  `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/fig-review347349-affected/review-evidence.json`.
  Both own files are frozen at0444 by the final readback. The two historical
  FIRST REVISE memos are preserved byte-identically with their original
  permissions; no author spec, official review, or unrelated file was edited.

Disposition: bounded affected PASS for these exact selected347-349 files only.
The earlier FIRST REVISE/failure history is not reset or rewritten.
