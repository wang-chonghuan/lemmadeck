# N10 Table Author Handoff

Status: authored candidate complete; deterministic author checks pass. No official
independent PASS review, modern-figure promotion, lesson edit, or publication was
performed by this author.

## Current Outputs

All paths below are relative to this report's directory.

- `tbl-p0044-01.spec.json`: current draft with durable source-image binding.
- `tbl-p0044-01.svg`: deterministic JSXGraph output, 640 x 584.
- `tbl-p0044-01.render.json`: actual passing render result, mechanically rebound
  to the current draft without a redraw; provenance is in `durable-binding.json`.
- `source-inventory.json`: immutable pixel inventory frozen before drawing.
- `candidate-check.json`: executable source-membership, grid, label-footprint,
  probability, and offline desktop/mobile display evidence.
- `author-checks.json`: actual validator/renderer executions and byte-identical
  final regeneration evidence.
- `tbl-p0044-01.desktop-media640.png`, `tbl-p0044-01.mobile-scroll-start.png`,
  `tbl-p0044-01.mobile-scroll-end.png`: inspected output screenshots.

The source is
`ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0044-01.png`.
Its SHA-256 is
`7f437a89e35a22a92aca0952032470aa914d6ad494b91a00dec285cfac787dfb`.
The current draft SHA-256 is
`8dfda5dad764f8789b846b29ad8a245281baf5c3d90639f5f8acabb51054bf24`.
The SVG SHA-256 is
`3b873232d2afdb80b3a7fb665be50764907b33505b037ad1d3502de825ca15d6`.

## Author Checks

Exactly four columns headed Sum | Ordered outcomes | Count | Probability;
one header plus six data rows, sums 2 through 7, 28 cells, 31 labels, and 21
source-ordered pairs. Every count matches its pair membership, every pair sums to
its row value, and every printed reduced probability is preserved. No extra sums,
total row, or merged cell was introduced.

At desktop 1440 x 960 and mobile 390 x 844, actual media width is 640px,
minimum transformed text is 16px, and minimum measured cell-label clearance is
10.8984375px. Mobile has a 366px scroll viewport and reaches its 274px scroll end
without document overflow. Full desktop and both mobile ends were inspected:
all source cells are legible and the expected scroll clipping does not alter
membership. This is an isolated offline figure surface, not an app/lesson check.

The current top-level edition prose, including the revised p0044#4 statement
that the table lists partial sums, already matched the rendered candidate.
Changing raw-source binding to the byte-identical promoted original changed only
`source.image.path`. No mechanical rebinding remains outstanding.

## Retained Failures

`first-actual-failure.json` and `first-failure/` retain the first render collision
failure and its exact candidate. Spacing of the two-line outcome labels was
increased from 24px to 32px. `first-cell-footprint-failure.json` and
`first-cell-footprint-failure/` retain the first footprint failure: 7.671875px
instead of 8px clearance. Increasing row height from 70px to 80px fixed it
without changing source content or shrinking text. Raw-bound spec/render/check
snapshots are historical provenance only; the current draft/report use the
durable source.

`first-inventory-serialization-check-failure.json` retains a bookkeeping check
that compared equivalent JSON as raw strings. Parsed deep equality corrected the
check without changing either inventory or any figure asset.

Image opens: 4 total, comprising the original once and three final screenshots.
No source reopen, paid image call, DB/.env/dependency/app/Git/service access,
peer messaging, template edit, or canonical output edit occurred. Writes stayed
inside the two assigned figure-author directories. Independent figure review and
parent-owned modern-output promotion remain outstanding.
