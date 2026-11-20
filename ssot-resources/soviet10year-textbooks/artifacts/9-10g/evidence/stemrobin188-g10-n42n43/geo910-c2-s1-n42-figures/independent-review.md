# N42 Independent FIRST Modern-Figure Review

STEMROBIN-188, same188-6, 2026-11-20. Review-only, current label-repair candidates.
Every exec cwd: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`.

## Decisions

| Figure | Decision | Finding |
| --- | --- | --- |
| fig-g10-01 | **PASS** | Source-faithful spatial basis; readable at 480 and 300; no blocking visual finding. |
| fig-g10-02 | **HOLD** | N42-F02-01: k notation overarrow intersects the horizontal dashed hidden edge. |

This is an internal independent per-candidate decision, not `review@1`, promotion,
publication readiness, whole-lesson acceptance or ticket closure. Both figures
already used their one content repair; this review performs none and resets none.

## Blocking Finding

**N42-F02-01, fig-g10-02:** the short arrow above k crowds/touches the concealed
horizontal edge in both the actual 480 preview and the current combined 300
snapshot. This can make the notation arrow look like an arrow on an undirected
hidden cuboid edge. Font-size compliance and machine PASS do not settle it.

Independent inspection of the exported SVG confirms more than BBox adjacency:
the filled `vector-mark-box-k-label` triangle intersects an actual dash of
`box-xy-x`. At native canvas size that dash occupies x=325..330, y=215.75..218.25.
The triangle starts at (329.763987793386, 217.40000009536743); clipping its filled
polygon against the dash gives positive area 0.18668491269636434 canvas px^2,
or 0.07292379402201732 px^2 at 300. The vertical footprint overlap is
0.5312499403953552px at 300, independently supporting the author's reported
approximately 0.53125px concern. That overlap is not a uniform penetration depth.
**HOLD retained; no waiver, repair, redraw, rerender or promotion.**

## Source-First Comparison

Both originals were opened before reading candidate specs or author inventory.
The source structure was independently inventoried from those pixels.

**01:** one unlabelled common junction and three tips, mapped to `basis-o`,
`basis-i-tip`, `basis-j-tip`, `basis-k-tip`. Solid actual vectors point down-left
(i), right (j), and up (k), all away from the shared tail. Exactly i/j/k labels,
each with a separate notation overarrow, survive. No source dashes, printed
point names, grid, numeric lengths, angle marks or answers are invented.
At 480 and 300 all three arrowheads and notation marks are distinct and unclipped;
no missing-glyph square, collision, cultural wording or decorative leak is seen.

**02:** eight unlabelled cuboid vertices map to `box-o/x/y/z/xy/xz/yz/xyz`;
three shorter vector tips map to `box-i-unit/j-unit/k-unit`. The twelve-edge
topology is intact: nine solid and three hidden dashed edges, all hidden edges
incident to `box-xy`. Every cuboid vertex has degree three before diagonal/unit
overlays. The dashed space diagonal points from `box-o` to `box-xyz`. Three
solid component arrows and three solid shorter unit arrows share `box-o`;
unit tips lie on their corresponding components. Exactly i/j/k/xi/yj/zk/a
labels and seven separate notation arrows remain, with the collision above.
Source crossings do not become extra vertices. No numeric dimensions, printed
vertex names, coordinate triples, angle marks, exercise answers or culture leak
was added. Source fidelity and mathematical content otherwise pass.

## Spatial And Mechanical Evidence

The authoritative figure context is an orthonormal **spatial** unit basis and
the component-sum cuboid space diagonal, not perpendicular/equal-length screen
vectors. The independently recomputed 3D Gram matrix is identity. All eleven
box points match the recorded affine projection with zero residual. Figure 01
also admits a linear projection of that 3D basis; no false 2D metric assertion
is present. Internal 2/3/3 box parameters are construction choices, not source
givens or visible measurements.

All 9/51 candidate relationship assertions evaluate successfully; every source
point has wholly internal mapped relationship coverage. Current source/spec/SVG
hashes match their receipts. Text scales from 28px to 17.5px at 300, exceeding
16px, but the independently observed collision remains blocking. Both existing
render receipts say machine `pass`; neither was used as visual approval.
Visible strokes/text use semantic ink/paper variables. Alternate theme rasters
were not newly rendered or claimed verified.

## Current Text Binding

Current lesson SHA-256: `e1fc3a3a0d7ac2ec40fd19eed7bd47758007daf345dde676e50ca67b8c200377`.
Author-bound lesson SHA-256: `11058459b1f1c04bf85be90c32773e0fefeec3790a49441135085894b7fb296e`.
Current exercises SHA-256: `d4df1a3d39000be2b6d4027b3e303641e8df9c7d8a5f014ce05fe5f6b7b17fbf`.
The exact current prose/caption/exercise semantic array still hashes to
`9355ab588245d177b4b1b56771e3e00169050c82faa931beeec16662c3717388`
and equals both specs and author context. `/prose/8/changes` is now `["layout"]`.
The metadata-only difference and independently closed text PASS are accepted
as supplied; prior template bytes, full modern text and source transcription
were not independently re-reviewed.

## Image Ledger

Every actual `functions.view_image` load, in order; full absolute paths and hashes
are in `report.json` bindings, not inherited from the author's image ledger.

| Load | Binding | Purpose |
| --- | --- | --- |
| 1 | f01Source | Original 01, source-first inventory |
| 2 | f02Source | Original 02, source-first inventory |
| 3 | f01Preview | Current 01 at 480 |
| 4 | f02Preview | Current 02 at 480 |
| 5 | display300 | Current combined snapshot, 300 media width per figure |

Five loads in this fresh context, within batch limit 8/context limit 24.
Two source opens, zero source reopens, crops, image mistakes or extra snapshots.
The separate figure-02 300 PNG was not opened. No image payload is returned.

## Reproduction And Boundaries

`report.json` binds current text, source PNGs, specs, SVGs, render receipts,
screenshots, author evidence and this review's diagnostic script with full paths,
SHA-256 and byte counts. `diagnostics.mjs` is read-only and reproduces bindings,
relationship checks, 3D checks and exact exported-SVG collision geometry:

```sh
node .intentfold/tickets/STEMROBIN-188/tmp/n42-modern-figure-review/diagnostics.mjs
```

Run only with the cwd stated above. Its integrity check exits nonzero on failed
bindings/relationships; output is diagnostic, never automatic approval.
Only this authorized review directory was written. No spec/template/renderer
edits, content repair, geometry rendering, Git/backend/DB/env/install/network,
paid/publish/deploy/closure/setup/freshness/Grill operation or other-agent/thread/
supervisor contact occurred. Existing edits and candidate files are preserved.
One unavailable exploratory XML-library import was handled with existing
`xmllint`, without installation. No product or durable-output check is claimed.
