# Fig-163 Author Freeze: BLOCKED

Ticket: STEMROBIN-180. Figure author only; not an independent review or approval.
Final scratch root: `.tmp/s10y-image/6p/fig-163-author/repair-01`.
State: `author-frozen-blocked`. Sole total repair used: 1/1; remaining: 0.

## Authoritative Inputs

The original durable `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-163.png`
was opened before inventory/spec authoring. Source SHA256:
`8af56a39d1b2c8a1a43d32b429be4cd14f56b610f0892413721d0c06a1d3eee7`.
Its existing nearest-neighbour 2x enlargement was also inspected, not treated as a new source.

The complete frozen s16 lesson (16 prose blocks), all four exercise prompts and
the figure templates were read from
`.tmp/ld-s10y-lesson/text-author-c4-s16/adapt/6p/modern-us-neutral/lessons/phy6-c4-s16`.
Lesson SHA256: `90f4a80d0204ef4a296b6f1e84c48be39c239e1ab01d442306032868cd297812`.
Exercises SHA256: `44d8501c3b2b07bc31c0e3b812002b3d393be14cccf47ad5c71942dc9cb9e4e6`.
Figures-template SHA256: `eb6318fb5d79a8b809c60f3b36a3435aeb7ca7e94da4fbc8ccece5539fb1065e`.
`input-bindings.json` records every original and copied input, author handoff and
numeric-expectations affected evidence. Main TEXT PASS is reused from explicit
authorization; the baseline failed text evidence remains unchanged. No text gate was rerun.

`context.json` includes the complete frozen lesson/exercises. The official nearby
context is separately retained as `context-nearby.json`, not substituted for the full text.

## Source Inventory And Interpretation

Panel a: upright stand, clamp, arm, upper spring link, extended spring, lower stem,
leftward pointer and corresponding stand reference mark, hook, freely suspended block,
base and feet. Panel b: the same apparatus/object, shorter spring, higher pointer,
open water vessel and water surface; the entire block is below the surface and does
not rest on the vessel bottom. Panel order and the spring/pointer/object relationships
are retained. All visible source requirements and relationship IDs are listed in
`fig-163.spec.json` source.inventory and `source-observations.json`.

No printed force value, numerical graduation or unit was inferred. Dense original
spring ink does not specify a calibrated turn count. The 14 clean coil periods per
panel are expressly schematic, not source-given data. Latin a/b follow the approved
modern text; clean contours/water fill and layout distances are declared regularization.
No answer-bearing value or annotation was added.

Counts: 57 objects (31 visible, 26 hidden construction anchors), 32 assertions,
2 labels, 3 source-inventory groups. Mode: deterministic/instructional.
Canvas: 640 x 700; inline maximum 640; requested actual widths: 306 and 640.

## Calls, Sole Repair And Remaining Failure

Each original stage ran once: official context exit 0, scratch spec authoring exit 0,
official draft validator exit 2. Its 37 error entries comprise one empty-authoritative-
text contract error and 36 hidden-anchor inventory entries, including repeated anchors
across inventory groups. The complete rejected bytes and streams remain in
`../first-failure`; its manifest SHA256 is
`d1777f3ac402e5c5098863b4e2c73a25c0eb12660b7c25575b1338cae35501ac`.

The sole repair was applied only in this new repair-01 root. It removed three empty
figure-block text entries from the text-only projection and removed hidden construction
anchors from visible inventory lists, retaining all anchor objects and assertion
references. Full frozen lesson bytes and all geometry/object values were unchanged.
`repair-diff.json` records the encoding delta. Scratch runner root selection was updated
for repair-01; initial helper bytes remain in the first-failure snapshot.

The repaired official draft validator ran once, exit 0/PASS, errors 0. The first
canonical renderer then ran once, exit 2/FAIL: `a-panel-label-label` and
`b-panel-label-label` each have collision score 10000. No label was moved and no
renderer was rerun. The remaining failure snapshot is `first-failure`; manifest SHA256:
`595f0d8d52cf10c1dc2fef77a49364979157a790ea74bcf5da3af4eab9b45f3b`.

The exact five timestamped subprocess calls, argv, env, exits and stream hashes
are retained in `call-ledger.json`: context 1, spec authoring 1, validator 2, renderer 1.
Input copying and the encoding repair are documented by their helpers, input bindings
and repair delta; they do not have separate timestamped records in that stage ledger.
No extra calls are inferred or reported as executed.

## Display Evidence And Incomplete Boundary

Render font-size checks alone pass at 306 (17.2125 px) and 640 (36 px). The renderer
created the SVG and a 640 x 700 native PNG despite FAIL. That existing native snapshot
was opened in full for author observation; it does not override the collision failure.
There is no final display PASS or independent source-fidelity claim.

Requested six theme/width samples: 0/6. Theme preview calls: 0. Pixel-check calls: 0.
No scroll layout or hybrid layers apply. No new preview/browser session was started
after the render failure. No image-service call, independent review, official review
record, promotion, durable write, answer/choice read or author self-approval occurred.

The current spec/SVG/render/native PNG, all helpers, complete original/copy input
bindings, reports, both failure snapshots and call streams are hash-bound in
`author-manifest.json`; `author-handoff.json` and `freeze-receipt.json` bind the frozen
delivery. This is a blocked author handoff, not a ready/promotable figure.
