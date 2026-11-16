# Fig-164 Author Freeze: BLOCKED

Ticket: STEMROBIN-180. Figure author only; not an independent review or approval.
Final scratch root: `.tmp/s10y-image/6p/fig-164-author/repair-01`.
State: `author-frozen-blocked`. Sole total repair used: 1/1; remaining: 0.

## Authoritative Inputs

The original durable `ssot-resources/soviet10year-textbooks/artifacts/6p/figures/fig-164.png`
was opened before inventory/spec authoring. Source SHA256:
`92115e0ba16f2cd5b48eebc964f9811f2df31bd1201e7b9f5e3046abd1a08636`.
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

One complete apparatus: trussed balance beam, central pivot/support and indicator,
shortened empty left pan with underside hook/thread suspending a tilted sealed flask,
long right pan with one visibly knobbed weight, common base and feet. The flask-side
beam and pan are raised; the weight side is lower. An open surrounding vessel contains
the entire flask/stopper and surrounding carbon dioxide. The external bent inlet ends
near that vessel's bottom, not inside the sealed flask. Source connections and relative
positions are mapped in `fig-164.spec.json` source.inventory and `source-observations.json`.

The original indicator lane yielded 11 isolated inner ink runs; the two edge bands
merge with the outer frame. The candidate maps those 11 inner marks separately and
does not invent numerical values or units for the edge/frame. No source-printed mass
or scale unit exists. `CO2` is explicitly a modern text-bound chemical identification,
not a printed source label or calculation. Clean truss/glass/wires, uncalibrated same-
width pans and sparse semantic gas texture are regularization, not measured source data.
The gas fill is not a liquid-level annotation.

Counts: 88 objects (68 visible, 20 hidden construction anchors), 31 assertions,
1 label, 1 complete source-inventory group. Mode: deterministic/instructional.
Canvas: 640 x 700; inline maximum 640; requested actual widths: 306 and 640.

## Calls, Sole Repair And Remaining Failure

Each original stage ran once: official context exit 0, scratch spec authoring exit 0,
official draft validator exit 2. Its 24 error entries comprise one empty-authoritative-
text contract error, three noncanonical collinear fields and 20 hidden-anchor inventory
entries. The complete rejected bytes and streams remain in `../first-failure`;
its manifest SHA256 is
`c26c86a38ab8ffe31875166b4859016d9ad9a872611ff0c5d45f5c0d4c2554a6`.

The sole repair was applied only in this new repair-01 root. It removed three empty
figure-block text entries from the text-only projection, removed hidden construction
anchors from visible inventory lists while retaining their objects/references, and
encoded the same three collinear point IDs as canonical a/b/c. Full frozen lesson
bytes and all geometry/object values were unchanged. `repair-diff.json` records the
encoding delta. Scratch runner root selection was updated for repair-01; initial
shared helper bytes remain in fig-163's first-failure snapshot.

The repaired official draft validator ran once, exit 0/PASS, errors 0. The first
canonical renderer then ran once, exit 2/FAIL: `co2-text-context-label-label` has
collision score 10000. No label was moved and no renderer was rerun. The remaining
failure snapshot is `first-failure`; manifest SHA256:
`679164a39003c893e04335172bbb1bbf455f7de5f188798c3c72ce9a26bf4dcd`.

The exact five timestamped subprocess calls, argv, env, exits and stream hashes
are retained in `call-ledger.json`: context 1, spec authoring 1, validator 2, renderer 1.
Input copying and the encoding repair are documented by their helpers, input bindings
and repair delta; they do not have separate timestamped records in that stage ledger.
No extra calls are inferred or reported as executed.

## Display Evidence And Incomplete Boundary

Render font-size checks alone pass at 306 (17.2125 px) and 640 (36 px). The renderer
created the SVG and a 640 x 700 native PNG despite FAIL. That existing snapshot was
opened in full for author observation. Its indicator window appears blank: the required
mapped inner ticks and central indicator are not legibly visible there. This additional
essential display concern is retained, not repaired or diagnosed by another render.
It is not a substitute for an independent review, nor a claim that the spec omits the ticks.

Requested six theme/width samples: 0/6. Theme preview calls: 0. Pixel-check calls: 0.
No scroll layout or hybrid layers apply. No new preview/browser session was started
after the render failure. No image-service call, independent review, official review
record, promotion, durable write, answer/choice read or author self-approval occurred.

The current spec/SVG/render/native PNG, all helpers, complete original/copy input
bindings, reports, both failure snapshots and call streams are hash-bound in
`author-manifest.json`; `author-handoff.json` and `freeze-receipt.json` bind the frozen
delivery. This is a blocked author handoff, not a ready/promotable figure.
