# fig31 deterministic author handoff

Role: sole figure author under parent delegation. This is author evidence only, not independent semantic/visual approval or promotion authorization.

## Inputs and source-first mapping

- Read complete official context before spec. Opened the complete actual original fig31 PNG once for this assignment and froze independently derived inventory in `author-source-inventory.md` before drawing.
- Original SHA-256: `f6d0b0126aa24bb926caf4c6baae377481a0a3dc23c0a87fc1ff1f987427101d`.
- Context SHA-256: `34b6d22eab5657914795713d247295fdcaa3561dfdb2df3b94537e54a318cae3`.
- Own inventory SHA-256: `cf7d2d4badfcc49b47a0e1a2923afa93547ecad86c74bc30e676c09c7ec2d708`.
- All four official context text entries copied in full, in order; exact text equality and current original-byte hash were checked once during preview work. The source inventory was independently derived, not accepted from another reviewer.
- Source has **ONE** closed plane outline explicitly labelled alpha=beta. It contains two distinct crossing-line pairs: a1/b1 at B1 on the left, a/b at B on the right.
- All seven source labels remain. Both crossings remain markerless. No c, M, hidden edge, angle, tick, unit, measurement, or second plane was added.
- A single wide polygon, additional whitespace, exact corresponding parallel directions and larger mathematical type are declared modern regularization, not literal source pixel geometry.

## Spec relationships

- One `shared-plane` polygon and one alpha=beta text label, without a dividing line or second plane.
- B1 is on a1 and b1; B is on a and b. Both points and the plane label have `inside` assertions for that single projected polygon.
- Corresponding a/a1 and b/b1 direction assertions use both B/B1 references and wholly cover the two-point source group. Four endpoint `connects` assertions preserve all full strokes.
- B1 and B remain separate in the actual coordinate construction. The two groups are not merged at a common crossing.
- Deterministic instructional, inline maximum640; actual tested widths640/240/346. No schema, renderer or source tooling changed.

## Exact call history and failure retention

1. First `render_spec.mjs` call: actual exit1 at draft validation before browser launch. Error: `assertions[0]: expected None polygon, found 1`. No SVG/render JSON/PNG was created by that failed call.
2. Full initial spec and actual error output retained in `first-render/spec.json` and `first-render/attempt.json`.
3. Sole smallest repair: `assertions[0].equals` -> `assertions[0].count`, keeping value1. Deep equality after restoring this field confirmed the entire initial spec; no other field, geometry, label, context or mathematical meaning changed.
4. Next/only actual browser render: **exit0, render status pass**, 12 objects, 7 labels, `collisions=[]`; all declared display checks pass. Isolated headless, PWDEBUG removed, no user window/profile/CDP.

The figure repair allowance is used (1). No further spec edit or renderer call was made or proposed.

## Whole-canvas previews and actual checks

| Preview | PNG dimensions | Actual media width | Minimum reported font | Text clipping |
| --- | --- | --- | --- | --- |
| preview-native.png | 640 x 380 | 640 | 44px | none in renderer |
| preview-240-neutral.png | 240 x 143 | 240 | 16.5px | none |
| preview-346-print.png | 346 x 206 | 346 | 23.7875px | none |

- Native PNG came from the sole successful renderer. Smaller previews used the exact existing SVG with its whole aspect-ratio canvas; no renderer repetition.
- Actual smaller SVG canvas heights were142.5 and205.4375; outward PNG pixel rounding did not crop any content.
- Each whole PNG was opened once. Author observation: the one shared plane, alpha=beta, all seven labels and two distinct crossing pairs are visible at all three widths; no split-plane interpretation is introduced. This is not parent approval.
- PNG nonwhite bounds/counts: native `[18,38,630,352]`/12721; neutral240 `[7,14,236,132]`/2337; print346 `[10,20,341,190]`/4557. Whole-canvas dimension/nonblank check exit0.

### Preserved preview harness false-positive

Preview-only script first exited2. `author-preview-report.json` remains unchanged with each FAIL record and all original measurements. Its sole reported error on both screenshots was a label-count mismatch caused by applying `.length` to the renderer's numeric `labels` field.

Affected-only read-only comparison of existing evidence exited0: renderer.labels is number7 and both measured arrays have length7; both original error arrays contain only that incorrect count error. No screenshot, SVG, spec, official renderer, mathematics, or preview script was changed/rerun. Size/clipping evidence is retained, not manufactured from a repaired check.

Preserved preview report SHA-256: `d87c18d4f195a9c9555cdfcc9ea85a72470fb095df8f0b837600c0490645d7f9`.

## Exact final package bytes

| File | SHA-256 |
| --- | --- |
| spec.json | `f428ca5bbd92408d35b5f1c78e7e49e5672e9e23d0afc1cd12b1c5a5fdf3ba09` |
| fig-31.svg | `bd98da921a4c293f89e6fda60c5398812f01aa00dc8aac9559ca3d6d40934b44` |
| fig-31.render.json | `16c12782b0dc471f56fa4d9d51fb149d8dc3b3d79a6d73de178e0cffbca786d1` |
| preview-native.png | `94311f7c0705dd5f9984381c361e902dde902fd858daa0c5bf85be390b299b7b` |
| preview-240-neutral.png | `41561d937f55bc333e9b5bc9ddd51b7a707104e203308ad0ebe850ab4c64a991` |
| preview-346-print.png | `8435dbc68deb6f208d4be89c349d5e5ac4189b14488659766191ce483fa194cd` |
| first-render/spec.json | `6caa45a4cac63732a7b88cebf253e037a66877ec0958700d1ac00cde96f0b0ef` |
| first-render/attempt.json | `878b4486a8e5fa154080e0157f036409b27567efcc918a903d787ea9b85688ee` |

All paths are inside `.tmp/s10y-image/9-10g/fig-31/`. The preview-only headless script is in sibling `fig-30/author-previews.mjs`. No image service, DB, source/context/tool/manifest/answer/choice edit, record_review, promotion or parent approval occurred. Parent's unique independent semantic and full visual gate is pending. Author stopped after handoff.
