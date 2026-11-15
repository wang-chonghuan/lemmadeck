# STEMROBIN-184: Independent Review of fig-07, fig-08, fig-09

Reviewed 2026-11-15. Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Reviewer did not author these figures.

## Verdicts

| Figure | Source Fidelity | Mathematics | Visual | Independent Verdict |
| --- | --- | --- | --- | --- |
| fig-07 | PASS | PASS | PASS | PASS for the hash-bound scratch artifacts below |
| fig-08 | PASS | PASS | PASS | PASS for the hash-bound scratch artifacts below |
| fig-09 | FAIL: spec path identity at N | PASS as visible reductio geometry; spec tracing is incorrect | PASS | FAIL source-inventory sign-off for the hash-bound spec below |

fig-07 and fig-08 have no source-fidelity, mathematics, or visual failures.
fig-09's visible stroke pattern passes, but its source inventory and named
path continuations are incorrect at N, as detailed below. This report is
not a promotion record or a `ld-s10y-image/review@1` file.

**Outstanding final-output gate:** all three render reports name
`.tmp/s10y-image/6-8g/fig-0N/fig-0N.svg`, not a durable final output.
They are legitimate scratch renders, but do not yet satisfy the quality gate's
durable-output-path requirement. No promotion, regeneration, or
`record_review.py` execution was performed.

## Scope and Evidence

Individually opened the complete durable original PNGs in order 07, 08, 09,
before opening any modern preview/spec/SVG/render. Read
`.agents/skills/ld-s10y-image/SKILL.md` and `references/quality-gate.md`.
Then individually opened each actual preview PNG and read each complete
FigureSpec, SVG, and render report.

Edition authority is the `text` field, not `source_text`, in:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/adapt/6-8g/modern-us-neutral/lessons/geo68-c1-s4/lesson.template.json`

Template SHA-256:
`b73ed469db79a0857b90a6462f54af4a4f5413effb7f45f9b1655ee8bae2f1d8`.

Each spec cites the complete current paragraph directly referencing its
figure. Exact comparison passes after whitespace normalization only:
fig-07 `p0019#2`; fig-08 `p0019#6`; fig-09 `p0021#2`.
This includes all three sentences for fig-07, all three for fig-08, and
the entire fig-09 proof through its contradiction with proposition 5 and
proof-ending symbol. Read the surrounding current lesson prose, including
the distance properties, straight-line axiom, and intersection theorem.
No answer or choice artifacts were used.

Executed an independent, in-memory offline HTML check using the existing
`app/node_modules/playwright`, headed Chromium, device scale factor 1.
Context was offline, service workers blocked, all URL routes aborted;
**zero attempted requests and zero page errors**. No dev server, database,
environment file, model service, network operation, tests, or other workers'
review files were used.

HTML embedded the original PNG as a data URI and the entire unchanged actual
SVG inline, using the existing app figure-media CSS and semantic tokens.
At each declared width, inspected neutral, accent, and print panels;
print panel exercised the app's scoped print rule with print media enabled.
All visible marks resolve to `rgb(21, 32, 31)` on white in these figures:
they intentionally use `ink`, not accent to convey meaning. Hidden JSXGraph
helper defaults, including hidden orange paths, do not appear in the image.
No visible non-semantic color attributes were found.

Checked every declared assertion independently, inventory references and
within-group source-point relationship coverage, actual SVG point positions,
visibility, segment endpoints and dash state against spec coordinates.
For labels, used `font-size * hypot(screenCTM.c, screenCTM.d)` for final
font pixels and transformed `getBBox()` corners for bounds. Checked all
label pairs, every label against visible point footprints and stroked line
segments, and all finite painted geometry against the SVG bounds.
All checks passed at every width/theme; no clipped labels/geometry, label
collisions, label/geometry collisions, or document horizontal overflow.

## fig-07

Independent original inventory: one continuous segment rising left to right;
two distinct endpoint dots; A below the left endpoint and B below the right
endpoint. No arrowheads, midpoint, ticks, ruler, numeric dimension, or extra
points. Actual SVG preserves all of this with only modern typography,
spacing, and straight-stroke regularization.

Actual SVG segment is `(70,200) -> (370,120)`, with the A/B ellipse centers
exactly at those endpoints. Exactly two visible point dots and labels A/B;
one line; no hidden construction points. Both executable assertions pass.
The prose's 3 cm stays in the prose; no answer-bearing length or equality
annotation was added to the drawing.

| Actual Media Width | Minimum Transformed Font Px | Minimum Label Box Height Px | Nonwhite Raster Pixels |
| --- | --- | --- | --- |
| 280 | 17.18152 | 19.0 | 817 |
| 310 | 19.02261 | 21.0 | 946 |
| 358 | 21.96782 | 24.5 | 1213 |
| 440, spec maximum | 27.00000 | 30.0 | 1730 |

## fig-08

Independent original inventory: three vertically stacked configurations,
each containing all three labeled points A/B/C, **nine points total**.
Top: isolated A lower left, B above and horizontally between A/C, C lower
right; no edges. Middle: A-B-C on one segment, B closer to A. Bottom:
A-C-B on one segment, C closer to B. All three printed sublabels belong to
their panels; source Cyrillic sublabels normalize to `(a)`, `(b)`, `(c)`.
No measurements, numerical values, or answer annotations occur in the source.

Actual SVG has all nine visible dots, nine point labels and three sublabels,
in the same single vertical composition. Top centers:
`A(70,130), B(220,40), C(390,130)`; middle:
`A(70,300), B(160,300), C(390,300)`; bottom:
`A(70,460), C(300,460), B(390,460)`.
The middle and bottom segments run exactly from `(70,300)` to `(390,300)`
and `(70,460)` to `(390,460)`, respectively, through each interior point.
No top joining edges, hidden points, panel rearrangement, or added givens.
All 11 executable assertions pass: noncollinear top configuration,
middle/bottom collinearity and ordering, and segment endpoint connections.
These configurations preserve the strict/equality distance relationships
without adding a visible answer.

| Actual Media Width | Minimum Transformed Font Px | Minimum Label Box Height Px | Nonwhite Raster Pixels |
| --- | --- | --- | --- |
| 280 | 16.43462 | 18.5 | 2753 |
| 310 | 18.19539 | 20.5 | 3024 |
| 358 | 21.01271 | 23.5 | 4264 |
| 460, spec maximum | 27.00000 | 30.0 | 6793 |

## fig-09

Independent original inventory: two deliberately bent paths, a above left
and b below left, shared crossings M left and N right. Path a descends from
upper left through M to the lower central bend, then rises through N
and continues to the upper-right tail. Path b rises from lower left through
M to the upper central bend, then descends through N and continues to the
lower-right tail. Left halves solid; right halves
dashed from the central bends onward. Only a/b/M/N labels; no measurements,
arrowheads, or other mathematical points.

This is the **impossible hypothetical picture in a reductio**, not a valid
construction of two distinct straight lines meeting twice. It must not be
failed for noncollinear bends or repaired into straight coincident lines.
The spec explicitly states that interpretation. M/N dots are expressly
declared modern readability additions at the source crossings, not source
givens. Bottom-edge scan remnants are not instructional objects.

**Failure: swapped named continuations at N in the FigureSpec.**
Reopened the original at original resolution for the final path trace.
Its a path follows lower bend -> N -> upper-right tail; b follows upper
bend -> N -> lower-right tail. The spec inventory instead says a "then
descends right" and b "then rises right". Its a4 ends at the lower-right
helper `[4.45,0.35]`, and b4 at the upper-right helper `[4.45,0.9]`,
which implements that incorrect continuation identity.

Actual SVG's **internally named** path chains, in canvas pixels:

- a: `(35,115) -> M(140,150) -> (300,200) -> N(460,150) -> (525,175)`.
- b: `(35,185) -> M(140,150) -> (300,100) -> N(460,150) -> (525,120)`.

Tracing the visible source paths through the actual SVG requires
`a1,a2,a3,b4` for a and `b1,b2,b3,a4` for b. Thus the combined visible stroke
set matches the original, but the spec's a/b object associations exchange
the tails and introduce a turn at N in each named path that is not the
source's traced continuation. This is a metadata/source-relationship
failure, not a claim that the reductio's central bends must be collinear.
The mechanical `connects` assertions pass the incorrect spec associations
and cannot themselves establish source fidelity.

Both chains use exactly the same M/N ellipse centers. Eight visible line
segments: a1/a2/b1/b2 solid; a3/a4/b3/b4 `stroke-dasharray="5,5"`.
All eight actual endpoint pairs match the spec and all nine executable
assertions pass against the spec, subject to the identity failure above.
Exactly two visible crossing dots and four visible labels.
All six unlabelled endpoint/bend helper ellipses are present but
`display="none"` and `visibility:hidden`; no extra dots leak into any theme.
No global straightness assertion, diagram dimension, or answer annotation.
No change to the source or SVG was made; owner must correct the source
inventory/path mapping and obtain review of the changed hash-bound spec.

| Actual Media Width | Minimum Transformed Font Px | Minimum Label Box Height Px | Nonwhite Raster Pixels |
| --- | --- | --- | --- |
| 280 | 16.00000 | 18.0 | 1283 |
| 310 | 17.71406 | 20.0 | 1524 |
| 358 | 20.45703 | 23.0 | 1917 |
| 560, spec maximum | 32.00000 | 36.0 | 4274 |

The 280 px font passes exactly at 16 px, without spare margin.

## Visual Evidence

Individually opened and visually compared all 12 complete source/theme
screenshots, not only the previews. All panels remain nonblank, with all
labels, points, stroke distinctions and outer geometry visible.
Screenshots are under:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/`

- `fig-07-independent-{280,310,358,440}-themes.png`
- `fig-08-independent-{280,310,358,460}-themes.png`
- `fig-09-independent-{280,310,358,560}-themes.png`

At native size, preview dimensions agree with SVG canvases and the visual
content agrees. Browser canvas raster comparisons are **not pixel-identical**:
946 / 2817 / 2305 differing pixels for 07 / 08 / 09, respectively;
mean channel differences 0.03712 / 0.02125 / 0.13879 on a 0-255 scale.
No visible geometry or label discrepancy was found; these comparisons do not
substitute for the source/endpoint review. The render metadata hashes the SVG,
not the PNG preview. No deterministic regeneration was used as fidelity proof.

## SHA-256 Bindings

Source paths:
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-0N.png`.
Spec/SVG/render/preview paths:
`.tmp/s10y-image/6-8g/fig-0N/fig-0N.{spec.json,svg,render.json,preview.png}`.
All paths are relative to the absolute root stated above.

### fig-07

```text
source  dfdd929f6561f6b43975e2faf4acec4af25b804c75cbc8c552d61907d7123a60
spec    32146e664ae5c0fbe4f3453e60039463942eef7ad6667f817f71a999d78676cb
svg     840828d70dbb6784c6bac90c2451dbc4a02515d5f4ebcfa6f97f5baa0ad1284f
render  24371d57bedae0428b4a5d7e62aba721c8d25621532eb2ee03c5ac381fdf9700
preview a3cd4bd0f4fd8ee6a6251274b38d09309f6599c9ac2520dfa642db74d1f00fca
```

### fig-08

```text
source  c119e72292ce994a0d71ec427412b74050bf6627d461bf725c3dfa08841e5972
spec    ef3d21d2ba6f776d1821b1fe4be73ac03c1a1d76f6455088cdc599645ff68a90
svg     2eb246319e72538a4383571b2827213f3a9a2aca76268aa78a45c6a53eb76503
render  c11a6f2e5d184394fc6baeee73bf3ea7bd2f4c7e3737c45dead2ffef68abbacc
preview 8f8bb72a91eb065e4aa66a644069bf8cd54ccd97358976e8e7c69a187a68081f
```

### fig-09

```text
source  896352df199e189331710e0baf01df8263da8a1e875e17371c3239bf57c81b44
spec    e1a7490a08602f464bad8e61ec06d603940e407487b721fc16891e6eeefce87b
svg     0fb346e6d778a6b32d5b4902d5caf4dde7f46bbfc05a07922530fa75047b10a7
render  427d7bb243f99d9dfd0ba238d999284b017ccbd238a7324e9d192d636e4b56cb
preview 04d09c4e3d5ff23bd63927dcdb7d2bce5ceecfc894a72e7830d47ee57c2b0205
```

All source hashes match their specs; all spec and SVG hashes match their
render metadata; all render reports have `status: pass`.
Rehashed all five inputs per figure after browser inspection: unchanged.
Any subsequent source/spec/SVG/render/preview change invalidates this report
for that figure. The broader live product/manifest and final promotion gates
were not inspected or certified by this deliberately offline review.
