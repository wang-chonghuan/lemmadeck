# n34 SOURCE-FIRST Frozen Checkpoint

Status: **blocked at source visual evidence**, not a semantic rejection of the
author draft. No draft, view, intent, key or author source solution was opened.

Seed canonical SHA-256:
`2379eaac29b0f067ffc5469a178c69e92fb2d4dab09b140e44eb728f362a6c73`.
The four source-trace hashes and both SVG hashes match the seed.

## Independent Source Results

- **746:** blocked. The complete fig-52 conversion shows labels but no readable
  curve. None of the four comparisons or the monotonicity sets is guessed.
- **747:** blocked for exact time boundaries. The complete fig-53 conversion
  shows rising, horizontal and falling silhouettes, but excessive stroke width
  obscures the relevant ticks and vertices.
- **748:** `17x-2` is the increasing line through `(0,-2)` and `(1,15)`, with
  x-intercept `2/17`. `-(14/5)x+1` is the decreasing line through `(0,1)` and
  `(5,-13)`, with x-intercept `5/14`. Both domains are R.
- **749:** `8x-5` and `x/100` increase; `-3x+10`, `-49x+1000`, `-x/12`
  decrease; `5` is neither under the strict definitions.
- **750:** `x^2` decreases on `(-infinity,0]` and increases on `[0,infinity)`;
  `-x^2` reverses those directions. Both have vertex `(0,0)` and symmetry
  axis `x=0`; neither is globally monotone.
- **751:** modern `-6/x` has quadrant-II/IV branches, each increasing;
  `4/x` has quadrant-III/I branches, each decreasing. Domain excludes zero;
  asymptotes are both coordinate axes. Neither function is globally monotone
  on the disconnected domain. The cross-zero pair `-1 < 1` refutes global
  increase of `-6/x` and global decrease of `4/x`.
- **752:** a complete witness has `f=-x` on `[-5,-2)` and `(4,7]`,
  `f=x` on `(-2,4)`, and `f(-2)=f(4)=0`. Both transition values exist.
  The source forces neither their heights nor continuity or extrema.
- **753:** exact results are `-3/10` and `33/5`, using principal roots.

Full reasoning, graph construction relationships and image observations are in
`source-first.json`. Construction-to-recognition limitations are identified
without judging the unseen author draft.

## Image Accounting

Exactly **2 image loads**, no crops, no reopens. Both asset and PNG hashes were
recorded in immutable receipts before their respective image openings.

| Figure | Actual SVG SHA-256 | Inspected PNG SHA-256 |
| --- | --- | --- |
| fig-52 | `8fc492d5eb6dabdb3983936fbca77e3098ccb126e7668ab15932d7f79514d1c5` | `71ee0142be0b83c277642cf76d1170a0bd8b4247bc54dd187a9180308f32a7a2` |
| fig-53 | `0837b07d3cc374b0ea8d1f906f57464775f9e9b780ddec669b58a4a9a18a9d16` | `26c425d4a4b4ebdc94c4b2c85422731d655b76a42b82df09d7d706385e2bf05c` |

`source-preopen.json` retains the original conversion receipt.
`fig53-preopen-recovery.json` records the CSS-fallback-only correction before
fig-53's first and only inspection. The original unviewed fig-53 PNG is retained,
not counted as an opening. No source asset was changed.

## Hold

The image-open limit prevents repairing and inspecting the failed source
renderings without further direct authorization. Please authorize additional
full-width inspections of repaired fig-52 and fig-53. Reuse the six solved
sources; do not repeat them.

The later draft-completion notice is acknowledged, but its conditional
view-only authorization starts after a completed source-stage freeze.
No draft was read and no `review.json` or validation verdict was fabricated.
The requested single `validate.py --review` run remains unconsumed.
