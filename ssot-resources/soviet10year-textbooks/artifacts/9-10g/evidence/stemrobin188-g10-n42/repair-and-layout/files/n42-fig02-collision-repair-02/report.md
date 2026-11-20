# N42 Fig02 Collision Repair 02

- Ticket/session: STEMROBIN-188 / SAME188-6. AUTHOR only.
- Result: bounded author repair complete; affected-only independent review remains pending.
- Original N42-F02-01 remains historical content FAIL / visual HOLD. No approval, promotion, publication, waiver, or whole-review PASS is granted here.
- The latest direct continuation authorizes a changed deterministic layout approach. Historical exhausted/1/1 counters remain evidence, not an extra approval gate.

## Exact Change

The writable candidate copies the current `fig-g10-02.label-repair.spec.json`.
Only `box-k-label` and `vector-mark-box-k-label` move down by 16 canvas/screen pixels:

- Text anchor: `[328,154]` to `[328,138]` in user coordinates.
- Overarrow endpoints: `[319,179]` / `[337,179]` to `[319,163]` / `[337,163]`.
- Its `connects-vector-mark-box-k-label` assertion receives the same endpoint changes.
- Five scalar y values change. Source/inventory/mappings, prose, spatial points, actual vectors, all twelve edges, other labels, text, and font remain unchanged.
- The notation overarrow remains rightward. The authentic spatial k unit vector remains upward from the common tail. Font remains 28px at 480 and 17.5px at 300.

The generated SVG changes only the k text, notation shaft/head, and two invisible
renderer-created endpoints belonging to that notation arrow. All other compared
geometry and label nodes retain their attributes. No generated SVG was edited.

## Source and Inherited Evidence

Opened the actual `source.image` PNG once. It shows one oblique cuboid, eight
unlabelled junctions, nine solid and three hidden dashed edges, dashed space
diagonal a, three common-tail unit vectors, and seven notation groups
i/j/k/xi/yj/zk/a. k points upward along the front-right vertical component;
the concealed horizontal edge is undirected. No source pixels or source facts
were changed.

The FIRST independent report supplies the inherited, unchanged PASS evidence:
fig01 PASS; fig02 source fidelity excluding the collision PASS; spatial
mathematics PASS; culture/notation content and other labels unchanged. These are
scoped inherited premises, not a new whole-review PASS. Fig01 was neither opened
as an image nor repaired/rerendered.

## Observed Clearance

Actually viewed the new 480px render and the fresh 300px screenshot. Both show
visible white separation between k's overarrow and the hidden horizontal edge.
The k notation remains adjacent to the upward short unit vector; no remaining
content defect was observed in this affected region.

- Hidden edge center: y=217; stroke width=2.5; lower stroke boundary=218.25.
- New notation shaft: y=237; stroke width=1.2.
- Filled notation arrowhead top: y=233.40000009536743.
- Minimum complete-arrow-footprint clearance: 15.150000095367432px at 480.
- Same clearance at 300: 9.468750059604645px.
- Exact transformed filled head and shaft clear the entire continuous hidden-edge stroke envelope, hence cannot intersect any individual hidden dash.

The 300px screenshot reuses the existing approved white, unframed presentation
CSS, with fig02 alone. Its measured media is 300x250 and every label is 17.5px.
It is an offline headless author observation, not live-product acceptance or
independent visual approval.

## Execution and Recovery

One renderer call, including its one internal draft validation, exited 0.
Render status is pass; 300/358/480 display checks pass; label collisions are empty.
Raw renderer stdout/stderr, exit receipt, before/after specs, and provenance hashes
are retained.

The first screenshot/measurement command exited 1 after successfully producing
the screenshot. `Number("2.5px")` / `Number("1.2px")` caused NaN clearance values;
its original numerical collision fields are not valid evidence. The old receipt
and screenshot remain intact. A separate XML-only recovery uses `parseFloat`
and the exact arrowhead transform, and checks the two hidden notation endpoints
and actual `data-label-id`. Recovery exited 0 with no content change, rerender,
or additional screenshot. Use `display-measurements.recovered.json` for clearance.

Initial input lookup used repo-root `tmp/`, then resolved the user's ticket-relative
paths correctly. One 300px image-open request had a duplicated path and loaded
no image; the corrected request loaded the already-created screenshot.

## Images and Counters

One fresh batch; actual image payloads loaded: 3, within the authorized 4.
Context image total: 3, below 24. Four image-open requests: source once, new480,
one missing-path request with no payload, new300. No old480, fig01, crop, or
source reopen. The JSON ledger binds every successful load to its exact hash.

Fig02 content modifications: prior 1 + new delta 1 = cumulative 2; reset=false.
Technical measurement recovery adds zero content revisions. Paid/model/service
calls, installs, DB/env/backend/Git operations, promotions, review approvals,
and other-agent contacts: zero.

## Deliverables

All new files are inside the new ticket directory
`.intentfold/tickets/STEMROBIN-188/tmp/n42-fig02-collision-repair-02/`.
All old artifacts are preserved and rehashed. `report.json` lists absolute paths
and SHA-256 bindings; `deliverables.json` also binds both final reports.

- `fig-g10-02.before.spec.json`
- `fig-g10-02.candidate.spec.json`
- `fig-g10-02.candidate.svg`
- `fig-g10-02.candidate.render.json`
- `fig-g10-02.candidate.width-480.png`
- `fig-g10-02.candidate.width-300.png`
- `provenance.json`, command receipts, raw logs, and recovered measurements

Parent integration and affected-only independent review are the next stages;
neither was performed or authorized for this author patch.
