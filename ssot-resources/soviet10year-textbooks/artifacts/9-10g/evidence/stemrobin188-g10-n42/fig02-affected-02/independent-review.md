# N42 Fig02 Affected-Only Independent Review 02

STEMROBIN-188 / 188-6, 2026-11-20. Independent reviewer, not author.
Every exec cwd: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`.

## Decision

**PASS for the exact N42-F02-01 collision-repair-02 delta only.** The moved
k notation no longer intersects the undirected horizontal hidden edge.
Actual new 480 and 300 PNG inspection found no introduced clipping or label
overlap in the affected neighborhood. No whole-figure, whole-text/math,
publication, live-product acceptance or `review@1` approval is granted.

Old content FAIL / visual HOLD, original finding and all exhausted counters
remain historical evidence. The old report is not relabelled PASS. The direct
human continuation authorizes this bounded deterministic repair review;
historical exhaustion is not a new gate and is never reset.
Content revisions remain prior 1 + author delta 1 = cumulative 2.
Reviewer content changes: zero.

## Source And Exact Delta

Opened the original `fig-g10-02.png` first, once. Inventory scope was only k
and the hidden-edge relationship: the short spatial k arrow points upward
on the front-right vertical edge; its separate rightward overarrow is notation.
The rear-lower horizontal hidden edge is dashed and undirected. The original
notation overarrow lies below it, separate from the edge.

The actual beforeSpec hash equals the old independent report's fig02 spec hash:
`116a4b670df30a73482ef60af6a6c0ce5a2a44b5908751cfc59130c4d2869c08`.
Independent recursive comparison found exactly five scalar changes:

| JSON Pointer | Before | After |
| --- | --- | --- |
| `/objects/29/from/1` | 179 | 163 |
| `/objects/29/to/1` | 179 | 163 |
| `/objects/36/at/1` | 154 | 138 |
| `/assertions/46/from/1` | 179 | 163 |
| `/assertions/46/to/1` | 179 | 163 |

These move `box-k-label` and `vector-mark-box-k-label` down 16 canvas pixels
(10 at width 300), with its matching connects assertion. Geometry, actual
vector direction, source inventory, text, font and other labels are unchanged.
Independent XML comparison checked all 122 attributed SVG elements.
Only k text, its notation shaft/head and two hidden literal endpoint ellipses
changed. The endpoints remain `display=none` and are not source vertices.

## Independent Visual And Measurement Evidence

Actually inspected the supplied 480x400 and 300x250 PNGs. Both show visible
white separation from the dashed edge. k remains beside the upward short
vector and separate from nearby i geometry/notation and zk. The affected
annotation remains inside the canvas; no new overlap or clipping was seen.

Independently extracted the actual exported SVG through `xmllint` and
transformed the filled arrowhead triangle, including the shaft stroke envelope:

- Hidden edge y=217, stroke=2.5; lower stroke boundary=218.25.
- New notation shaft y=237, stroke=1.2.
- Filled notation head top=233.40000009536743.
- Minimum separation at 480: **15.150000095367432px**.
- Minimum separation at 300: **9.468750059604645px**.
- The complete notation envelope clears the entire continuous hidden-edge
  stroke envelope, so no individual dash can intersect the filled head/shaft.

The result agrees with the author's clearance claim but does not use that
claim or machine PASS as a visual premise. The existing render PASS exactly
binds candidate spec/SVG hashes; no rerender or duplicate validation was needed.
Its unchanged font results are 28px at 480 and 17.5px at 300.

## Reused Verdicts And Bindings

The old independent report SHA-256 is
`d68d75c45dd16d278b0798005c7105e3e832dbce6fd8fb4f6e8495f68eb79335`.
Reuse only its exact fig02 source-fidelity-excluding-collision PASS,
spatial-mathematics PASS and culture/notation-content PASS, plus the direct
user's closed unchanged-other-label PASS premise. Only newly introduced overlap
from the moved k annotation was inspected. Fig01 was excluded: no image,
asset hash, new verdict or rerender.

Current lesson and exercises remain byte-identical to the old report bindings.
Semantic context is unchanged and hashes to
`9355ab588245d177b4b1b56771e3e00169050c82faa931beeec16662c3717388`.
This was an equality/hash check, not a text or mathematical re-review.
The current figures template was bound as observed; it was not integrated
or treated as a promotion receipt.

`report.json` records absolute paths, actual SHA-256 and sizes for the source,
before/candidate spec, candidate SVG/render/PNGs, all current templates,
old report/spec/SVG/counter, author context/deliverables/reports/provenance,
failed and recovered measurement receipts, skill references and diagnostics.
Author evidence and historical provenance hashes were independently asserted.

## Image Ledger And Recovery

Fresh context: exactly 3 actual image loads, within the human limit 4:
source once, new480 once, new300 once. Zero source reopens, old480 loads,
fig01 images, crops, image errors or new screenshots. The JSON ledger resolves
each actual load to its absolute path and SHA-256.

The author's failed NaN/null measurement receipt remains intact and is not
numerical evidence. The reviewer script's first call exited 1 because its
two helper-tag expectations said `circle` instead of the actual `ellipse`.
Only the reviewer-owned expectation was corrected; the second call exited 0.
The first error and recovery are preserved in the JSON report. Neither
technical recovery changes content, images, candidates or revision counters.

## Boundaries

Only this new review directory was written: `diagnostics.mjs`, `report.json`,
`report.md`. No candidate/core/template/historical edits or reverts; no
answer lookup, paid/model, DB/env/backend/Git, browser acceptance, service,
network/install, promotion, `review@1` or other-agent message.

Read-only reproduction:

```sh
node .intentfold/tickets/STEMROBIN-188/tmp/n42-fig02-affected-review-02/diagnostics.mjs
```

Use only the cwd stated above. It asserts hashes/delta and calculates SVG
separation without writing, rendering, loading image payloads or opening a browser.
