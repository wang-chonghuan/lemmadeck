# STEMROBIN-184: fig-09 Correction Confirmation

Reviewed 2026-11-15. Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Verdict

**PASS for this targeted changed unit.** The corrected source inventory and
named a/b continuations match the original and the current durable SVG.
The previously identified tail-identity failure is resolved for the hashes
below. Durable render paths and hashes are current; changed-area visibility
passes every declared width. No remaining failure found in this scope.

This is a separate correction confirmation, not a rewrite of the initial
review, a complete product rereview, or a promotion record. Other figures
were not inspected. No product artifacts were written or regenerated.

## Source and Changed Unit

First reopened the complete original `artifacts/6-8g/figures/fig-09.png`
at original resolution, before reading the current durable spec/SVG/render.
Independently traced:

- a: upper left -> M -> lower central bend -> N -> upper-right tail.
- b: lower left -> M -> upper central bend -> N -> lower-right tail.

Compared the current spec structurally with the retained rejected spec
`.intentfold/tickets/STEMROBIN-184/tmp/fig-09-spec-rejected-001.json`.
Exactly three scalar fields changed:

1. `source.inventory[0].description`: corrected both continuations after N.
2. `objects[4].at[1]`, a-right: `0.35` -> `0.9`.
3. `objects[7].at[1]`, b-right: `0.9` -> `0.35`.

No other parsed spec field changed. Authoritative text, display widths,
crossings, central bends, labels, assertions, stroke roles, and dash styles
remain unchanged. Scratch spec is byte-identical to the current durable spec.
The sketch remains deliberately impossible reductio geometry; no global
collinearity requirement was introduced. M/N dots remain declared modern
readability additions.

## Actual Durable SVG

Directly inspected the unchanged actual durable SVG and its named elements.
The corrected right-hand chains, in 560 x 320 canvas pixels:

| Path | Approach to Shared N | Continuation After N |
| --- | --- | --- |
| a3 -> a4 | `(300,200) -> (460,150)` | `(460,150) -> (525,120)`, upper-right |
| b3 -> b4 | `(300,100) -> (460,150)` | `(460,150) -> (525,175)`, lower-right |

Thus a1/a2/a3/a4 now belong to the source's a path and b1/b2/b3/b4 to b,
without exchanging the tails at N. Both named approaches and continuations
share the actual N dot center exactly. All four right-hand segments remain
visible and dashed with `stroke-dasharray="5,5"`.

a-right and b-right helper ellipses are respectively centered at `(525,120)`
and `(525,175)` and remain hidden; no tail dots were added. The actual SVG
still has exactly two visible points and eight visible line segments.
Correcting named tail ownership does not change the combined visible stroke
set; source fidelity was confirmed by tracing the named actual elements,
not by assuming that a regenerated picture proves it.

## Offline Changed-Area Visibility

Used the existing app Playwright package, headed Chromium, device scale
factor 1, in-memory offline HTML containing the complete original PNG and
the complete current durable SVG with existing app figure-media CSS.
Context offline, service workers blocked, all URL routes aborted:
**zero attempted requests and zero page errors**.

| Measured SVG Width | Measured Height | Minimum Transformed Label Px | Upper-Tail Painted Pixels | Lower-Tail Painted Pixels |
| --- | --- | --- | --- | --- |
| 280 | 160 | 16.00000 | 34 | 29 |
| 310 | 177.140625 | 17.71406 | 42 | 35 |
| 358 | 204.5625 | 20.45625 | 49 | 40 |
| 560, declared maximum | 320 | 32.00000 | 98 | 86 |

Label pixels measured from computed font size times the actual SVG
screen-transform scale, not the canvas font alone. Tail pixel counts are
from rasterizing the actual SVG into a browser canvas and counting nonwhite
pixels in separate upper/lower regions beyond N, excluding its dot.
At every width: both mappings pass, both tails are painted, no changed-line
stroke is clipped, no label is clipped, no label pair overlaps, N's label
does not overlap its dot, both tail helpers remain hidden, and no
document-level horizontal overflow occurs.

Individually opened all four screenshots and compared the changed area
with the original. Both right-hand tails are complete and legible; the
figure is nonblank. Screenshots:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/fig-09-correction-independent-{280,310,358,560}.png`

## Current Durable Bindings

Durable directory:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/figures/`

```text
source  artifacts/6-8g/figures/fig-09.png
        896352df199e189331710e0baf01df8263da8a1e875e17371c3239bf57c81b44
spec    fig-09.spec.json, in the durable directory above
        3e2aa7f2314e8b5fc0d19e6f8e23f87ee22dcaa4051532b7938f4a0fc9111008
svg     fig-09.svg, in the durable directory above
        bd6157ff60d0346bc107bc13a3ff689098458f63c411fb61d63e2906b1840138
render  fig-09.render.json, in the durable directory above
        d05f5910160f2050ab55304ff31f7c7581cbb36131e547f87273cb6cc54b3fac
```

Source hash matches the current spec. Durable spec/SVG hashes match the
durable render metadata. `render.spec.path` and `render.output.svg.path`
exactly name the current files in the durable directory, not scratch,
preview, or ticket paths. Render reports `status: pass` and all four
declared display checks pass. The previous scratch-path limitation is
resolved for this durable render.

Rejected spec SHA-256:
`e1a7490a08602f464bad8e61ec06d603940e407487b721fc16891e6eeefce87b`.

Scratch render remains intentionally stale:
SHA-256 `427d7bb243f99d9dfd0ba238d999284b017ccbd238a7324e9d192d636e4b56cb`;
its recorded spec hash is the rejected hash above, not the corrected hash.
It was not treated as current evidence and was not changed.

Rehashed original, durable spec/SVG/render, rejected spec, and initial
report after browser inspection: unchanged. Initial report SHA-256:
`67450142c43fc428e4806f36791ef563402b0db3d9847809f303ea5b243dcd02`.
No initial-review edits, other-figure rereviews, answer/choice access,
network, database, environment, model-service, or product-write operations.
Any subsequent change to these source/spec/SVG/render hashes invalidates
this correction confirmation. Report and stop.
