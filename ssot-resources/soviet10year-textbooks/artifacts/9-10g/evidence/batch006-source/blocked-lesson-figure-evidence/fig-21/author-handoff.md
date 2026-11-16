# Figure21 author handoff: STOP, renderer FAIL

STEMROBIN-184; 2026-11-16; parent-agent delegation within existing human ticket
authority. Author scratch only. No independent approval/review file,
manifest update or promotion.

## Current result and bounded attempt history

1. Initial standalone draft validation exited2. Exact failure:
   `assertions[11]: point [490, 205] is outside 'plane-alpha'`.
   The coordinate is on alpha's drawn boundary; this draft incorrectly used
   inside for a boundary-incidence requirement.
2. The one targeted repair replaced the two c-end inside assertions with
   pointOnLine assertions on the actual alpha side edges. Every object,
   coordinate, canvas/display field and complete authoritative-text entry
   stayed byte-equivalent structurally. Initial spec and exact failure payload
   are retained.
3. The existing JSXGraph renderer was invoked once for the corrected spec.
   Its internal spec validation succeeded, then render exited2 with
   `status: fail`, collision `b-label`, placement `N`, score10000.
   No further layout repair or renderer invocation for figure21 was made.

The renderer's failure is not waived by the actual PNG looking legible.
The b label sits in the upper patch below its top boundary; a separately
authorized future label-clearance correction is needed before a pass package.
No exact corrective offset is claimed tested.

## Source fidelity and author display observations

The source image was reopened once, targeted only to previously unrecorded
hidden-edge topology. Lower alpha / upper beta, interior a/b and common c
remain correct; a,b,c have exact parallel projected directions. The lower
patch's rear edge behind beta and rear-right portion are dashed, all named
lines and visible boundaries solid. Exactly five labels and no source named
points/dots remain.

The tiny left wing's alpha label was moved into the same foreground patch's
left interior for clearance. Straight coherent patch geometry and faint
neutral patch tone are declared unmeasured display additions, not given
lengths, angles or answer shading. Full official context text array equals
source.authoritativeText exactly; the actual original PNG hash still matches.

Native640x400, 240-neutral and346-print PNGs were all actually opened.
Static previews are snapshots of the current SVG, not a second geometry render.
At240 the measured minimum label size is16.5 px; at346 it is23.7875 px;
native is44 px. Static CSS metrics report no clipped labels, label-to-label
overlap or horizontal overflow: document widths240/346 equal viewport widths.
These facts do not clear the native geometry collision. Preview evidence
truthfully retains renderStatus fail and overall status fail.

All browser execution used existing Playwright, isolated headless:true
launches, `env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never`; static previews were
offline with requests aborted. No desktop/profile/CDP/window/tab/system-input
operation, network/model/install, answer or choice input was used.

## Current package and actual SHA-256

Directory:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/9-10g/fig-21/`.

| File | Current SHA-256 |
| --- | --- |
| `context.json` | `6de5703b789be5cad00e4e292858b48f9d3c617adb4ffe7f528ce9d8337dc2fd` |
| `source-inventory.md` | `11d594ff0060b9aed7e5cbeeedd48da441e70085f6572b2a0bcb6e976ef7bc09` |
| `fig-21.spec.json` | `c450514a008ba4ac0a88cade20be5b3fc978b799745083448d72bd4f44d48f47` |
| `fig-21.svg` | `6b0f212b28a80e8ba0e280c41522d934d0d36bbcb2f0a3932c61e2999d348387` |
| `fig-21.render.json` | `cb35b2c9c13b1c8a466dccd7fdf9fad849a2eb96695a9cf6ff7cc890d472e4ca` |
| `fig-21.preview.png` | `f1016b8b53503ee0fa4aeff1013a674e6cefa40cc07b83f82bcbc598ad3f063b` |
| `fig-21.preview-240-neutral.png` | `5186738116f02c2cfbf517ab04e57b56f8c964a27a2729280b28cc6172e4e92e` |
| `fig-21.preview-346-print.png` | `305e7a0b6cca09c7d27bdd7dae4e15ce2814d633409c2bb0a78f94c7ab914ca1` |
| `fig-21.preview-metrics.json` | `205569e4411aa62600e983c6de0d6f692b6f8cd380b86876beb5094abaf72f17` |
| `preview-static-svg.mjs` | `7a06781fd857c42c59b8da54295990e00a60e37110154020b5d1896f6dd0819f` |

Original durable source:
`ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-21.png`,
SHA-256 `cbaaf26f655d74f75f48d29ab0e181d8a62afb5b8a976ad7ba0777fc7d462a53`.

## Failure snapshots preserved

| File | SHA-256 |
| --- | --- |
| `fig-21.rejected-first.spec.json` | `64337ba78835b8e65c0e96e42ea52453f0d5c2d565ea6ad61cd30e3404e57062` |
| `fig-21.first-validation.json` | `5587ec1c7159fa081e4ac3b5e6f03a67d9d0d32fed4ca9d074b8c1eec214a111` |
| `fig-21.rejected-render-first.spec.json` | `c450514a008ba4ac0a88cade20be5b3fc978b799745083448d72bd4f44d48f47` |
| `fig-21.rejected-render-first.svg` | `6b0f212b28a80e8ba0e280c41522d934d0d36bbcb2f0a3932c61e2999d348387` |
| `fig-21.rejected-render-first.render.json` | `cb35b2c9c13b1c8a466dccd7fdf9fad849a2eb96695a9cf6ff7cc890d472e4ca` |
| `fig-21.rejected-render-first.preview.png` | `f1016b8b53503ee0fa4aeff1013a674e6cefa40cc07b83f82bcbc598ad3f063b` |

Renderer-failure snapshot spec/SVG/render/native PNG hashes exactly equal the
current files. Nothing was overwritten to conceal failure.

## Three-figure batch close

Figure21 is blocked as above. Figure22's first renderer exited0, no repair.
Figure23's first renderer exited0; one m-label E-to-W clearance repair was
performed and its second renderer exited0. Their independent visual approval
is pending; author status does not replace it.

Writes were limited to the figure21/22/23 scratch directories. Figure24-26,
official contexts, durable source/modern text, manifests, tools and app were
not edited. Existing n8/n9 solution freezes remain byte-identical:

| Existing ticket-tmp report | SHA-256 |
| --- | --- |
| `geo910-n8-choice-source-first.md` | `cc63693d2fac2cb19f8a49d4074ffda3fd7461a06f666f9b6ca25a9280a37617` |
| `geo910-n9-choice-source-first.md` | `6ba64352b6542d9e6679e939e764be2e6e2473d9c021b95e47dee4215aacbd33` |

All task-owned browser/process sessions have closed. Stop and await parent
delegation; no options, keys, formal seed, promotion or self-review.
