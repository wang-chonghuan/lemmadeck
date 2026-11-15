# Source Author: 6p Physical Pages 111-115

2026-11-15. AUTHOR COMPLETE for the requested page-level preparation; independent source review remains pending. This is future unapproved source preparation, not batch6 completion, assembly approval or a new book-total claim.

## Scope And Execution

Used the existing shared Python at `/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`, always with `PYTHONDONTWRITEBYTECODE=1` and `-B`.

For each exact page, in order 111, 112, 113, 114, 115:

1. Ran existing `p2c.py prepare --book 6p --page N`.
2. Actually opened that page's complete original `page.png` and `page.grid.png`; no combined multi-page image.
3. Wrote only its durable `pages/NNNN/page.md` with `apply_patch`, retaining original printed lines, words, numbers, units, questions, emphasis, figure references and captions.
4. Ran `p2c.py finalize --book 6p --page N` once.
5. Opened every resulting complete original-figure PNG, then ran `p2c.py vectorize --book 6p --page N`.

All fifteen prepare/finalize/vectorize commands exited 0. All five first finalize attempts passed. No source-gate first FAIL was encountered, no failed rows were removed, no threshold was forced and no counter/tool was edited.

| Physical / Printed Page | Blocks | Finalize Printed/MD Lines | Figures | Normalizations | Errors |
| --- | ---: | --- | --- | ---: | ---: |
| 111 / 100 | 15 | 18/18 | 88 | 0 | 0 |
| 112 / 101 | 11 | 22/22 | 89, 90 | 0 | 0 |
| 113 / 102 | 8 | 25/25 | 91 | 0 | 0 |
| 114 / 103 | 10 | 17/17 | 92 | 0 | 0 |
| 115 / 104 | 12 | 25/25 | 93 | 0 | 0 |

Scoped total: 56 page blocks, 107 printed lines, six numbered original figures. Twelve distinct questions start in these five pages: problem 1-3, exercise 19 question 1-3, homework 1-2, section 46 problem 1-2, section 47 problem 1-2. Fourteen `ex` blocks include the two additional continuations of homework 1. The final section 47 problem 2 remains incomplete/open.

## Source Fidelity And Boundaries

- Read only physical 110's final text for the left boundary. `p0110` ends `故对木头所`; `p0111#1` is `p cont` beginning `产生的压强就等于：`.
- Physical 111 retains the full original fraction: 50 newtons divided by 0.0000001 square metres, 500000000 pascals, 500000 kilopascals, and the 10000-fold comparison. The printed `千帕` / `斯卡.` line break is retained. A pre-finalize pixel enlargement settled exercise 19 question 2's verb as `耙`, not `把`.
- Physical 111's homework 1 ends `站立不动` with `open`; physical 112 continues `时对地面的压强.` and the entire shoe-area method. The one-quarter square-centimetre grid-cell area and both homework questions are retained.
- Figure 89's caption shares the seventh printed line of the shoe-area method. `ex 1 cont open` / transparent figure and `cap samerow` / `ex 1 cont` preserve the exact row and continue with `面积.`.
- Physical 112 introduces `46. 气体的压强`. The balloon-experiment paragraph ends `随着周围的空气` as `p open`; physical 113 starts `p cont` with `变得越来越稀薄...`.
- Physical 113 retains 1 second, 1 square centimetre, twenty-three-digit collision count and the historical millet/nearest-star/hundred-round-trips analogy without modern scientific rewriting. Figure 91's caption shares the row ending `比`, followed by `p cont` beginning `如`.
- Physical 113's concluding sentence has printed emphasis dots. Markdown emphasis retains its exact scope from `对各方向的压强...` to `大量分子无规则运动的结果.`; this typographic representation is explicitly noted in the page metadata.
- Physical 114 keeps both section 46 questions, `47. 气体的压强与什么有关`, the mass/volume/density/collision explanation and the compression experiment. Its last paragraph is complete, not falsely marked open.
- Physical 115 keeps both bold conclusions, the gas-cylinder paragraph and two section 47 questions. Figure 93's caption shares the oxygen line, with the final gas-cylinder sentence joined through `p open` / `p cont`.
- Right boundary: `p0115#11` is `ex 2 open`, ending `气体是在遇冷时压强大，还是在受热时压强大？试`. Physical 116 was not read or approved.

## Preserved Source Issue

Physical 115's outward-pulled-piston passage actually prints `图92，б`, confirmed by the enlarged original glyph at `.tmp/ld-s10y-lesson/6p/pages/0115/fig92-label-detail.png`. Figure 92's third arrangement has the upward arrow and label `в`, so this appears to be an original subfigure misreference. Retained the printed Cyrillic `б` verbatim and recorded the discrepancy in source notes; did not silently correct it or fabricate an erratum/change to the source.

## Figures

Standalone actual-pixel inventory:
`.tmp/ld-s10y-lesson/6p/source-figure-inventory-111-115.md`.

It records the observed objects, source labels, relations, complete edges, caption separation, exact finalized boxes and PNG SHA256 values for all six figures. Inventory comes from actual page/crop observations, not inferred numbering or modern figures.

| Figure | Exact Finalized Box | Vector Mismatch | Result |
| --- | --- | --- | --- |
| 88 | `[453,1194,653,342]` | 0.012% | PASS |
| 89 | `[1026,250,253,382]` | 0.003% | PASS |
| 90 | `[323,1589,898,357]` | 0.015% | PASS |
| 91 | `[921,544,354,323]` | 0.004% | PASS |
| 92 | `[519,1352,512,547]` | 0.011% | PASS |
| 93 | `[1024,1157,229,349]` | 0.000% | PASS |

PNG/SVG remain page-level scratch artifacts; no durable-gallery promotion was performed.

## Read-Only Synchronization Check

The first auxiliary check exited 1 at `assert meta == data["meta"] and blocks == data["blocks"]`: the MD parser does not produce the derived `fig.id`, whereas finalized page JSON does. Diagnostic comparison for page 111 showed metadata identical and the sole difference was figure 88's JSON `id: "fig-88"`.

Preserving that first check failure here. No source or gate was changed. A subsequent read-only check used existing `blocks.fig_id(label,page,seq)` exactly as finalize does to derive figure identities, then compared all metadata and complete block objects, including all text lines and flags. All five pages matched; all audits had empty errors and normalizations and equal printed/MD line counts. This was a serialization-check premise error, not a source/counter defect or a waived gate.

## Snapshot Hashes

SHA256, after finalize:

| Page | page.md | page.json | audit.json |
| --- | --- | --- | --- |
| 111 | `d4a7c9f253005d7f426fcd1f70611bca9437de355bcd58789ed4db6ab324d917` | `9812f50bfa24d186158857012220ed06f170acc50da350d9048d9d66962f5d4d` | `be5bb82383af4c31e46492a8d15c6153349bf4daa40293ec920aed4e5c7de9f4` |
| 112 | `40c7a04cbc68d80e332314ebdc5768f104e62ee0992f3baea39f48bffe7e5394` | `fa0a1757f0136840a9583c3e98b02c9ad0687594f3a997844bac95bcb6528a44` | `b8b10adb759e364f80105dcc243aab3d9ca19b5f4731d7dd655d2593b53aeef6` |
| 113 | `84497d3415d0ef094a65cb102df925b6fc8491abb4bce98658d35985c849dbdc` | `07072f3088d69612bb5da8f234f0bc492315a15706751e74b47ef52f1d61c348` | `20613b2c481828a7a590d13a0d01b7918679ff51cd5bb7800bde8566f70d8e03` |
| 114 | `bf38d4f05cbddc729e1b888e1acfe05b6fee7f21cc69ecd8c726bb1c05ffaeeb` | `d72146b1e3a0d51c5c633482f5e9bd7a625c2e5883f67b0c01ea5458143c0009` | `475126d9bc7bb4fbc595fc4cfb91837efcc35d0b3fc64dc189dfbdc257f128eb` |
| 115 | `3b5ded631f90b9d9fa41e395e1b1053a3169e6ff0ab37c35485d77c697ccff7d` | `a018029c1e8df36cdbe40b401511f5d2b7ecab090973931a09491724014f051a` | `86560a7baf8a84cbac50c3618248d1bb82b0d2db18234c6d2cce459af497e53f` |

## Stop Boundary

No assemble, TOC/index write, durable lesson/edition write, modern artwork, app, browser, DB, publication, Git, dependency installation, answer/choice inspection or counter/layout change. Other agents' work was left untouched. Stop here for independent source review.
