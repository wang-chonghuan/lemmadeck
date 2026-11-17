# STEMROBIN-184: n16 figure author checkpoint

Date: 2026-11-16. Branch: `codex/STEMROBIN-184-textbooks`.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Drafts only. Independent mathematical/visual review is pending.
This report is NOT approval, a promotion record, or full lesson acceptance.
No review file was created and no assets were promoted.

## Scope and Image Budget

Writes were confined to `.tmp/s10y-image/9-10g/fig-62/` through `fig-65/`
and this temporary author report. Approved lesson/exercise/figure templates
were read without alteration. Existing and concurrent worktree changes were
left alone. No answer key was read for construction. No answers, choices,
source pipelines, application, dependencies, database, commit or push were
changed or run.

Exactly eight images were opened: the four original PNGs, once each, before
the inventory/specification; then four current 640px output views, once each.
Exactly four output PNGs were generated. No crops, contact sheets, native-size
PNG duplicates, mobile screenshots or additional image views were made.

The live Plane ticket was read via n-plane; it remains in the started group.
This is a limited authoring subtask, not a ticket handoff.

## Construction and Checks

All outputs use `ld-s10y-image/figure-spec@2`, deterministic JSXGraph SVG,
`display.purpose: instructional`, scroll layout, and declared width 640.
No `svgPath` objects, opaque path stand-ins or image assets are used.

- fig62: both source plane cases, all labels, both dividing lines, and
  same/opposite signed-half-plane relationships. Its labelled A1/A2 points
  are not falsely asserted to be central-symmetric or equidistant.
- fig63: all four source rows, their origin order/coincidence, and all
  source ray-intersection branches. Opposite-ray rows b/c/d have executable
  centralSymmetry checks covering BOTH origins and BOTH finite tips.
- fig64: A/B/M and AB/m/m1/m2 retained; m2 stays thin while AB/m1 stay bold.
  The M half-turn covers M/M, one internal opposite pair and BOTH finite
  tips. Oriented-vector checks distinguish m1 from m2.
- fig65: h3 left/rear, h2 middle/front, h1 right/rear; all three unlabelled
  source origin dots, all supporting-line extensions and every pairwise
  co-direction relationship. No rectangle, right angle, equal-length or
  spatial perpendicularity is inferred from the projection.

Arrowheads, typeset labels, polygonal plane envelopes and the stacked fig62
layout are documented modern additions, not facts attributed to source
pixels. Finite opposite-ray lengths in fig63/64 are explicit renderer
regularization; no equality marks or metric conclusions were added.
Polygonal plane envelopes are illustrative bounds, not given polygons.
All source traces are solid; their thin/bold distinctions remain.

Task167 has no figure reference in the approved template. Branch coverage
uses the existing distinct-parallel source case in fig62 and the three
opposite collinear cases in fig63. No task167 solution panel, relabelling to
its task letters, answer or choice was authored. Fig65 remains a single
co-direction illustration and must not be treated as an exhaustive relative
position restriction.

`fig-62/check-n16.mjs` verified 21 source/construction checks, including every
declared midpoint pair, actual ray-tip completeness, signed directions,
source branch coverage and approved-template bindings. Its result is
`fig-62/n16-relations.json`, not independent-review evidence.
Each current spec was validated by the unchanged renderer before rendering.
All four current render reports have machine status `pass`, no collisions,
and minimum measured text 22px at the declared 640px width.

## Attempts

Before any render, the fig63 input validator found an empty authoritative
paragraph caused by selecting a figure block, and an inappropriate
multi-point requirement on its single shared-origin dot. These draft-input
errors were corrected: the approved paragraph was selected, and that
single-point group's explicit coincidence/midpoint assertions were retained
without inventing another visible source point.

Each figure was rendered once initially. fig65 needed no repair. fig62/63
reported lower-origin label clearance; fig64 reported the m label crossing a
ray. One targeted label-only repair batch changed south-label gaps from
25px to 32px in fig62/63 and moved the m text anchor in fig64. Those three
figures were rendered once more; no geometry or authoritative text changed.
No further repair was made. The three initial failed spec/SVG/render triples
are preserved under their respective `initial/` directories, with no raster
images from those attempts.

## Display Evidence and Observations

`fig-62/preview-n16.mjs` ran headed isolated Chromium at 1440x960 and 390x844,
with network blocked, using the current app CSS and FigureMedia DOM contract.
Each figure's `display-evidence.json` binds the current spec, SVG, render,
CSS and route file; includes text sizes, SVG-boundary clipping checks,
scroll-end measurements and raster nonblank pixel checks.

The minimum-width fixture measures actual 640px media and 22px labels at
both viewports. Current prose CSS uses 40em inherited from its 16.5px font,
so the prose projection measures 660px media and 22.6875px labels at both
viewports. This is recorded, not silently relabelled as 640px. Both media
widths reach their horizontal scroll end on mobile and produce no page-wide
horizontal overflow. The four output views are the stricter 640px fixture,
not screenshots of a published lesson.

The four output views were inspected once. Observed: retained point labels
and subparts in fig62/63, the single common origin in fig63d, the thin m2
trace in fig64, and the three unlabelled origins/supporting lines in fig65.
Independent review must decide source fidelity and instructional suitability;
the renderer and these author observations do not decide those gates.

## Limitations

No assembled offline lesson or running DB-backed application acceptance was
performed; that remains with the separate batch owner/reviewer. The approved
figure manifest has not been updated to reference these drafts. No promotion,
review approval, publishing or database operation occurred.

No extra byte-identical rerender was attempted under the render budget.
Deterministic construction and hash-bound current outputs are supplied;
regeneration alone would not prove source fidelity in any event.

No centrally symmetric object is claimed by fig62 or fig65. Their absent
centralSymmetry assertions are intentional, avoiding an unsupported
A1/A2 equality or a symmetry/metric claim about an oblique 3D schematic.

## Current Output Hashes

All paths below are relative to the absolute output root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/`.

| Current Path | SHA-256 |
| --- | --- |
| fig-62/fig-62.spec.json | 891b8422f06aee20fb1d0dd45955d3786ce480f3f258dda5d673504be8be9b32 |
| fig-62/fig-62.svg | 8a354c8ddb5eaa82fa378ce195a2da624145278f4c0e3b7a1e357c9b72a43d2c |
| fig-62/fig-62.render.json | 72cc8b14e47fd7fccccdd6efdea4c1f5bf82e2c0e687e71f54f64a7980e92c73 |
| fig-62/fig-62.view-640.png | 9e5042ea81c445747866c13349fcd52fa52dde878a700c4ec8ee8d2526dc4f10 |
| fig-62/display-evidence.json | ef4432a112cf4229a21340e11e90540be2ededb53251c2df65b39aa00ef73277 |
| fig-62/n16-relations.json | 035d7a550b97bb9878bb7dcb39f2c8136ec427b30befd7d2b35c4c28389a26e1 |
| fig-63/fig-63.spec.json | 129d2be5cc377462d5264e8e8df0a82a29ae02b8d0e5ace581200b4c2d72f1e2 |
| fig-63/fig-63.svg | a9df63a0b977d008267baf7697e070ff9e7288bba0941d5c61a7021b9d24f7ea |
| fig-63/fig-63.render.json | ff79fcb18f64f07158912546bc90ddc06527817542d795685f6d8156d8454713 |
| fig-63/fig-63.view-640.png | dbf8bc818ecaee7e9faf88051e12b2c1dc97913f1adbb6a16c28b0cfbabb4224 |
| fig-63/display-evidence.json | d02902811f2f51efab526a924a5e53c56aaad91065b2859faa351e4e9a4f6a65 |
| fig-64/fig-64.spec.json | 9cddf83305ced4f606ce685b418ac0e38725582f10a25efc322fdbea857a3983 |
| fig-64/fig-64.svg | 271ed5d9bc84b3ffcebbfa4d28c4802466c22d1fafc96edea65b6d9709e35afd |
| fig-64/fig-64.render.json | 122f1cc8fced351c381a405f25827ce02842b6a7e3630097af3a00f2e87cdac7 |
| fig-64/fig-64.view-640.png | 5bcffc7395553bace17fc9128f786e1051e205845ceb22ee42af1ab53febae4c |
| fig-64/display-evidence.json | 9985c6efe6d1c4bc48053803d0bf62c4af272be0f171eada10eaa3e3d232c1ec |
| fig-65/fig-65.spec.json | 7d6ab9d5a6e240e11e5f5dccb44ad6471273db7b7a8750a654461f6e3eecec88 |
| fig-65/fig-65.svg | a679ca21a4016973a69a1b8dd96c2362dc8fc55d37c306b153103fa03cfbcfec |
| fig-65/fig-65.render.json | 8eafc565fc5892b987e4d7f9062134931bef054b8babf1d9786985befbbb7524 |
| fig-65/fig-65.view-640.png | 9be5645a7fdf9a2164d3775e0de7d3d9cfd9cc4c0d8d1dc6860f73c4662fb500 |
| fig-65/display-evidence.json | b45e4fd8db41fb4a500d5836d49890dec3367487b6b8cd972a350d569c18d492 |

Original PNG hashes: each FigureSpec's `source.image` and its pre-spec
`source-inventory.md` bind the inspected pixels.
Approved template hashes remained unchanged at the final checkpoint:

- lesson.template.json: 03a194601450544f3bb1a60870b79b16198706b3ccc651e9cf1451f92d5245f7
- exercises.template.json: 158ffe88994d67c6ffc40b072c20d71af37da479ed4603be24e1ddd50ec41bdc
- figures.template.json: 8b7029831803d72c73f81161c40b82363a495d7479092b45b1b9f0778ff99de7
