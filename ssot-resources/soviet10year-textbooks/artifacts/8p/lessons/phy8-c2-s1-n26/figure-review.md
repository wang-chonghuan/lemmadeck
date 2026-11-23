# n26 FIRST Independent Figure80 / Figure81 Review

Date: 2026-11-23. Ticket: STEMROBIN-180.
Sole independent semantic reviewer; not the figure or prose author.
Every command used exact cwd
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
Paths below are relative to that cwd.

## Per-Figure Verdict

**Figure80: PASS. Figure81: PASS.**
These verdicts cover the collected, repaired current SVG bytes, their complete
source inventories and executable relationships, and actual native/640 px
figure inspection. No figure reauthoring or geometry rerender is required.

Figure-only byte-preserving promotion is authorized by this PASS. Whole-lesson
edition finalization, offline lesson validation/render and full desktop/mobile
lesson display remain parent-owned and were not performed here. This is not
publication approval. The earlier FIRST wholetext/science PASS is unchanged.

## Independence and Frozen Source Inventory

Both actual canonical original PNGs were opened BEFORE author handoffs,
specs, current SVGs, previews or author inventories. Two original-only crops
then inspected the tiny inner-radius terminals. The independent inventory was
written and made read-only (`0444`) before opening any author material:

`figure-review-evidence/independent-original-inventory.md`

SHA-256:
`4b3be1a965a6a6a9530103ee8555d58182c26964a886647f897bdde9cb30e7b0`.

Only Banach's already accepted original figure-inventory sections were reused
as corroboration after the actual originals were opened. That record is
source-only PASS, not modern approval. No source page or wholetext review was
replayed; n25 and n27 were not reviewed.

The tiny Earth-radius terminal contour remains pixel-limited, not an invented
scientific graphic: Figure81 shows a darkened wedge-like end on the short
stroke, while Figure80's end merges into Earth hatching. The crops do not
certify an exact isolated arrowhead contour/direction. Both source figures
clearly retain the labelled short radius. A disclosed modern plain segment
joining P to the Earth-center dot expresses that radius correctly without
claiming a force arrow or claiming to reproduce the unresolved tiny contour.
This is not a blocking instructional uncertainty.

## Actual Source / Output Comparison

| Requirement | Figure80 | Figure81 |
| --- | --- | --- |
| Composition | One shaded geometric Earth sphere and smaller Moon disk. | One center-path schematic, NO globe or body disk. |
| P | Distinct point inside Earth, above/right of Earth center; not the Earth center. | Distinct common center of both unfilled paths. |
| Earth center | Lower-left point on the smaller dashed orbit. | Lower-left point on the smaller dashed orbit, labelled Earth center. |
| Moon | Disk on the upper-right larger solid orbit, labelled Moon. | Upper-right point on the larger solid orbit, labelled Moon center. |
| Common-center orbits | Large solid and small dashed paths centered on P. | Same shared P, large solid and small dashed paths. |
| Moon radius | Horizontal rightward arrow from P to the large circumference, NOT to the upper-right Moon disk. | Horizontal rightward arrow from P to the large circumference, NOT to the upper-right Moon-center point. |
| Earth radius | Short plain connected segment P to Earth center. | Short plain connected segment P to Earth center. |
| Motion | Two separate CCW curved arrows, each with an actual visible terminal head. | Two separate CCW curved arrows, each with an actual visible terminal head. |
| Labels | Earth, Moon, P, `r_E`, `r_M`; all readable. | Earth center, Moon center, P, `r_E`, `r_M`; all readable. |
| Prohibited additions | No numbers/distances, force/acceleration arrows, axes, grid, ticks or cultural symbols. | Same; no globe added. |

English `r_E` and `r_M` map the source/prose Earth and Moon radii respectively.
No reciprocal or endpoint mapping is reversed. The radius terminal at the
right circumference is visually part of its arrowhead, not a new physical
center or body. The physical points and the two motion arrows remain distinct.
All four modern motion-arrow construction points are hidden in each current
SVG; the first failed visible-dot artifacts were not reproduced.

Disclosed modern choices are exact circular/opposite-ray regularization,
Earth-radius alignment with Earth center, readable English/math labels, an
explicit Not to scale notice, and Figure80's smooth geometric sphere shading
instead of scan hatching. The dashed orbit remains visible through the light
sphere shading. These are declared modern choices, not claimed source pixels.
The schematic radii and body sizes are not kilometer measurements.

## Mathematical / Machine Evidence

The author handoff digests match the supplied collected records:

- Figure80: `274db7a2ae1d5cbb665fe47732d6ee7e8c08b2c824b933279498d620309646d3`.
- Figure81: `a7003d2ed630e141a6bb4ea890389130e54426076f3671ca93fdcd745f251f86`.

Collected spec/render/output bindings match; current authored validation is
PASS with exit 0 and the current spec digest for each figure. These valid
checks were reused rather than rerunning geometry production.

The complete `source.authoritativeText` arrays match the live lesson's four
prose-text objects exactly. Live lesson SHA-256 remains
`7729148053ce9efe403c0fc87b51c4129be2ce446eb2693c0d09d2ac7e01c4c4`.
This is binding confirmation, not a second wholetext/science review.

Point relationships map all physical points inside each main inventory
group. Actual coordinates give common P `(310,310)`, Earth center `(270,270)`
and Moon center `(483.2411613907041,483.2411613907041)`, with inner radius
`56.568542494923804` and outer radius `245`. Earth and Moon centers lie on
opposite rays; the horizontal outer-radius endpoint is `(555,310)`.
`pointOnCircle`, `displacement`, `collinear`, and `connects` assertions express
the required source relationships, rather than substituting object counts.
Figure80's `inside` assertions retain P and Earth center inside the sphere.
All arrow/segment endpoints have executable connection assertions.

Motion arcs are supplemented by connected terminal heads and perpendicular
tangent assertions. New headless inspection sampled the actual SVG paths:
both motion arcs advance approximately `+0.5759587` radians in mathematical
coordinates and each has a visible explicit arrowhead. The small path is
unfilled with dash pattern `10,10`, centered on P; browser path sampling gives
maximum radius deviation approximately `0.0148181` px. Large path is solid and
unfilled. Source-required relationships and styles therefore agree with
actual pixels, not just spec descriptions.

## New Headless Inspection and Image Ledger

No author headed browser was reopened or replayed. The new inspection launched
an isolated Chromium with `headless: true`, aborted every network request,
inserted only the current collected SVGs, and closed the browser after
inspection. It never called the geometry renderer.

`figure-review-evidence/headless-inspection.json.snapshot.txt` preserves the
actual execution metrics and original temporary output references as historical
text. It reports both figures at native 640 x 640 and actual CSS media width
640, with minimum text 18 px (labels 20/22 px). At viewport 390 x 844 the
fixture host is 331 px wide, media remains 640 px, and horizontal scroll reaches
309/309 px with the right edge reachable. This is figure-only fixture evidence,
not whole-lesson display approval.

Each new 1280 x 640 composite shows native current SVG at left and actual
640 px media at right. Detailed inner-label crops confirmed that nearby dash
segments do not intersect the `r_E` glyphs; no label collision/clipping or
broken/black figure rendering was found.

Actual images loaded, in order:

1. Canonical original Figure80 PNG.
2. Canonical original Figure81 PNG.
3. `figure-review-evidence/original-fig-80-radius-terminal.png`.
4. `figure-review-evidence/original-fig-81-radius-terminal.png`.
5. `figure-review-evidence/fig-80-current-native-and-640-headless.png`.
6. `figure-review-evidence/fig-81-current-native-and-640-headless.png`.
7. `figure-review-evidence/fig-80-current-inner-label-detail.png`.
8. `figure-review-evidence/fig-81-current-inner-label-detail.png`.

**8/8 images this phase; 8/24 cumulative in this reviewer context.**
The earlier wholetext phase loaded zero. Author's separate 8/8 image use is
retained truthfully and is not reset or added as images reopened by this reviewer.
No further image was opened after the eighth load; no image payload is returned.

| Actual image | SHA-256 |
| --- | --- |
| Source Figure80 | `473666ae7fd8c653dae3103a82284fb7c5d799cc1e2e73da35a76b8118ecd61b` |
| Source Figure81 | `6307dd1e524b7943f6f74664711bebe6f3404f7f0d4bbd15677860d473b622d0` |
| Original Figure80 terminal crop | `a7ded7995f00fc7f00a5a4b7aab649efd2f9d0511e9b4287619bcee432786704` |
| Original Figure81 terminal crop | `03e1537b2eef55f343c92591995fa3cee7726918d032ea0ef523add53792378e` |
| Current Figure80 composite | `a1c9a2fcdb86d54d415f175be1364b584f16cca1a4795307137d48f82c3ccfda` |
| Current Figure81 composite | `ad84fb102723e60d3c624945c03675ea16e2169d858880b2f97ee7f37d5000b3` |
| Current Figure80 label crop | `fd6f60756870206c6693d64ac1cebf59d123acba9e76c051f275d844abc3e989` |
| Current Figure81 label crop | `f90df2d1ce6eefcff0e40572c0b0289e51d75bcf60872af0552236e755566c26` |

## Original Failure / Repair History

Author's first visual failure affected BOTH figures: unintended visible motion
construction dots could be mistaken for physical points, despite machine
render PASS. Original failure reports, first specs/SVGs/render metadata and
first preview pixels are retained, not overwritten or relabelled:

- Figure80 first failure report digest:
  `b2d540a010468d8c30506eb591a858edfc227abb28151376e920d95491c724d2`.
- Figure81 first failure report digest:
  `89a54ebf8a72b14c90ab42b924783865d5e5cee1243d7b47c1544367132cda13`.

**One shared content-repair round**, applied to both figures: hide the four
modern motion construction points. No source relationship, prose, physical
point, orbit or formula change. Zero author render-execution failures; one
reported initial missing-source image open loaded zero images before parent
retained the canonical sources. Author paid calls: 0. Reviewer repairs: 0;
reviewer paid calls: 0.

The author used a HEADed offline fixture, contrary to the current isolated
headless scope, and it was already closed when this phase began. The retained
author verification script explicitly contains `headless: false`; its
screenshots/display evidence remain headed history, not headless evidence.
This procedural deviation is not hidden or used as the reviewer's new
headless evidence. The independently inspected corrected SVGs pass.

## Promotion

The approved spec/SVG byte digests to preserve are:

| Figure | FigureSpec SHA-256 | SVG SHA-256 |
| --- | --- | --- |
| 80 | `41d54df646c9df032f32dadb8fd4eab34d3e3d48627d745b86595b61af759be0` | `4209e73fc2a450487fbe55b216502ceb0cde9a58df44c71c98da410deeb3f49e` |
| 81 | `a67fc6cb6307ff295d0ea5d53fd81b1aeb313ce4a9a331ef58529d1b7f0c0cd9` | `f31f6bdc899959f40ff6d848ac81f9c35a6b3a33ba8c584d69674c9355e73b50` |

**Figure-only promotion COMPLETED for both figures.** Canonical directory:
`ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/figures/`.
Each figure has exactly its `fig-N.spec.json`, `fig-N.svg`, `fig-N.render.json`
and `fig-N.review.json` output contract.

Both specs/SVGs were copied byte-identically; no coordinate, label, assertion,
SVG byte, source binding or authoritative-text change. Each render report was
copied structurally, changing ONLY `spec.path` and `output.svg.path` to canonical
paths. Replacing those two fields with their originals reproduces the original
report exactly. All other render evidence and hashes remain unchanged.

Official `record_review.py` completed with PASS for both canonical pairs and
created current `ld-s10y-image/review@1` records binding the canonical source,
spec, render evidence and SVG output. Required file digests:

| Figure | Canonical render SHA-256 | Canonical review SHA-256 |
| --- | --- | --- |
| 80 | `f2fee76ae3b227e1ec0b2b96a4c53c8dc8acbf5ed5a28b6ef937b1264d4ecb33` | `e08b33d99cf9de64b3640ba83eb2eb9d509587c1ac0f6e81f28a55ffb212c989` |
| 81 | `78371ac2722cc3edc342827a42eb7a114a7654771ec0cbc4d75826758a7861e1` | `7966a4ef0aedd79d195a5b0ade97f23c3e4e600805274c7532ab56dcbfbbf99b` |

Original author figure-only history is retained under
`.intentfold/tickets/STEMROBIN-180/raw/n26/figure-author-evidence/fig-80/`
and `fig-81/`, including first failures and headed screenshots. All original
JSONs are exact `.json.snapshot.txt` copies, including their historical
temporary references; author scripts are retained as `.mjs.snapshot.txt`.
TRANSIENT_NAMES would likewise receive snapshot names. Nothing was copied from
the shared runtime, Node/Python dependencies or a full PDF. Original author
files, original frozen ticket/raw source evidence and earlier wholetext
snapshots/reports remain untouched. The reviewer headless inspection script
is also retained as `figure-review-evidence/inspect-current.mjs.snapshot.txt`.

Only the two figure entries in
`.tmp/ld-s10y-lesson/adapt/8p/modern-us-neutral/lessons/phy8-c2-s1-n26/figures.template.json`
were updated: `mode: deterministic`, exact `spec`/`svg`/`render`/`review` fields,
and canonical original PNG path/hash bindings. No generated/hybrid-only fields
are present. The persisted lesson figure manifest was NOT finalized or rewritten.
Current `figures.template.json` SHA-256:
`fd1d85abc96e84f277484863554814433b4d4f528938b4886ccbd7647fb289ff`.

No canonical durable JSON depends on `.tmp/`; historical exact JSON snapshots
are text evidence, not live dependencies. Finalization, lesson validation/render
and full lesson desktop/mobile display remain parent-owned and outstanding.
A final scoped binding check passed for the two canonical review chains,
byte-identical spec/SVG copies, path-only render changes, exact retained handoff
and original-failure bytes, template output/source fields, and read-only inventory.
It was not a whole-package hash, suite, image reopen or semantic-review replay.
Live lesson bytes still match the unchanged wholetext snapshot digest above.
No source or prose edits, installation, Git, DB, paid calls, full suite,
new chat/worktree, messaging or polling was performed.
