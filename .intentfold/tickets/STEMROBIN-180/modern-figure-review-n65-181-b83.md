# B83 n65 FIG181 Independent Modern Figure Review

PASS

Date: 2026-11-18. Scope: NEW modern FIG181 only, `phy8-c4-s2-n65`,
ticket `STEMROBIN-180`. No blocking mathematical, visual or cultural findings.
All shell calls used `/Users/yong/.codex/worktrees/0f12/lemmadeck` explicitly.

## Independent Basis

The complete canonical original was the first image opened, once at original
resolution. Its SHA-256 matched the human-provided value. Before reading any
candidate, FigureSpec, author inventory or approved text, I wrote and froze:

`tmp/b83-n65-fig181-review/source-inventory.freeze.md`

SHA-256: `23baa4aa4b93d8ce81bb70a847405e83aab0a2c7b652bf25a7cc417f4873621d`.
The frozen inventory was not changed after inspecting the candidate.

Read `AGENTS.md`, the image skill, its complete quality-gate and figure-spec
references, and the lesson production-resume contract. Read all 28 current
approved lesson blocks and all nine exercises from the supplied templates as
context only. No TEXT verdict was reopened. No answer keys, choice artifacts or
author solutions were used. The author's source-inventory Markdown was not used.

## Source Comparison

| Requirement | Independent Result |
| --- | --- |
| Shared scene | Two positions of one rectangular body on one horizontal support, not two panels or two unrelated bodies. |
| Body geometry | Both rectangles are 72 by 68 canvas units; all four corresponding corners translate by `(260, 0)`. Lower corners remain on the same support line. |
| Force | Both arrows enter the left body faces, rightward at common height: `(58,177)` to `(140,177)` and `(318,177)` to `(400,177)`. Equal display length is consistent with the illustrated constant-force case, not a numerical force given. |
| Velocity | Initial `v_1` extends right from `(212,177)`; final `v_2` extends right from `(472,177)`. Final arrow is longer, consistent with this rightward-force illustration. No magnitude or physical length ratio is supplied. |
| Axis | X points right along the support level, parallel to force, velocity and displacement. No O/0, tick, coordinate value, secondary axis or negative direction was invented. |
| Displacement | Non-arrow split marker spans corresponding right edges, x=212 to x=472, at y=88. Vertical reference strokes align with both body right edges. It measures the translation, not distance from an invented origin. |
| Labels | Exactly F, F, v_1, v_2, X and S. Four visible rightward vector accents belong to the correct F/v labels. S retains the source glyph and denotes the displacement written as s in the prose; no second quantity is introduced. |
| Support | Horizontal top and simplified parallel thickness lines, with a descending right-side support. No instructional grid or measured lattice exists in the source. |
| Point relationships | No source point names or visible coordinate markers are missing. Four corner translations, support incidence, force/velocity connections, parallelism and displacement/reference alignment have executable assertions. |
| Directed geometry | All five main arrows and four vector accents have matching `connects` assertions. The displacement marker remains nondirectional, as in the source. |

Modern presentation changes are explicitly described rather than asserted as
source givens: regularized rectangular outlines, three light diagonal strokes
instead of irregular first-state stippling, simplified support strokes, spacing,
inline sizing and deterministic vector accents replacing an unsupported glyph.
None changes the instructional relationships. All visible geometry is intact,
within the canvas and legible in the current preview and saved screenshots.

The original supplies no numerical values or units. The current figure supplies
none either. I checked the full context's actual givens without solving anything:
the later train example uses 72/108 km/h, 1000 tonnes and 2 km; exercises include
40/20 N, 3 kg, two 3 m stages; 1000 tonnes and 108 km/h; 1300 kg and 100 km;
and 0.5 m with 10 J. None is transplanted into FIG181. There are no equations,
work/energy results, acceleration labels, exercise answers or answer annotations.

All visible text is standard mathematical notation/Latin labels. No Cyrillic,
Chinese labels, historical decoration or cultural wording leaked into the figure.
Visible strokes/text/fills use semantic ink, muted and paper CSS variables.
Hidden JSXGraph construction elements are not visible source points or colors.
Neutral saved images remain readable without depending on an accent hue.

## Saved Evidence

No renderer, browser or author checker was replayed. I reconciled existing files
and receipts read-only: 18 hash bindings matched, including all four FIRST
snapshots, the source, current render inputs/output, saved fixture/CSS, screenshots
and approved text. All 14 FigureSpec authority blocks match their current approved
lesson blocks. The saved HTML contains the current SVG verbatim.

Existing renderer status is `pass`: 29 objects, six labels, no collisions,
no display failures. Saved actual SVG/media measurements are:

| Saved Viewport | SVG/Media Width | SVG Height | Minimum Text | Labels/Overflow |
| --- | --- | --- | --- | --- |
| 1440 x 960 desktop | 640 px | 320 px | 32 px | All six fit; no horizontal overflow |
| 390 x 844 mobile | 354 px | 177 px | 17.7 px | All six fit; no horizontal overflow |
| 356 x 640 minimum-width | 320 px | 160 px | 16 px | All six fit; no horizontal overflow |

These are media widths, not nominal viewport/column widths. Preview and all three
saved images visually confirm intact body outlines, aligned displacement guides,
readable subscripts, no clipping/collision and visible arrowheads.

Evidence caveat, not a candidate defect: the saved `arrowHeads: 0` field queries
`data-arrow-owner`; the current SVG actually uses `data-arrowhead-for`. Direct XML
inspection found all nine rendered arrowhead groups with rightward transforms,
and the preview/screenshots show them. The zero counter was not treated as arrow
absence or successful arrow verification. No checker or receipt was edited.

Surface limit: the saved evidence is an isolated headless author fixture using
offline figure markup/CSS and controlled 18 px surrounding type. It is not headed
product acceptance, a finalized/offline lesson pass, integration or promotion.
Alternate product/theme surfaces were not replayed. This PASS is the independent
figure review of the current draft hashes only, not authorization to publish.

## Hashes

Paths below are relative to the explicitly named checkout root.

| File | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/8p/figures/fig-181.png` | `a359e42e0869f9c94c186bac4aec5e4051a9ff855a761d105307d71b023b9269` |
| `.tmp/ld-s10y-lesson/b83-n65-figures/fig-181.spec.json` | `32592f2d611a7fa8ce53440e82cc95565f1d0168a6a8ae11ae83798ce36ad136` |
| `.tmp/ld-s10y-lesson/b83-n65-figures/fig-181.svg` | `6ed32f0af1caec9a14acd474ff90e64ece4501005c58db5acb83fe3701eb6c4c` |
| `.tmp/ld-s10y-lesson/b83-n65-figures/fig-181.render.json` | `885eb4bb301ba5019f0f1be2939a5a549adc657dca0fa2f66ade9ae48e2ac445` |
| `.tmp/ld-s10y-lesson/b83-n65-figures/fig-181.preview.png` | `abcd9475ecf2b576e4c94e5dc8f505530bf870199b0f4df84152776760fb6475` |
| `tmp/b83-n65-fig181-author/viewport-evidence.json` | `a57c3e7a525d5cb3bd2827cce40b023a7869c15aff66789ddfb497b767156cf1` |
| `tmp/b83-n65-fig181-author/fig181-author-preview.html` | `41e0b550e16bcb5b12b94792d6b2bfd0de6239123b387489aa856c6b245e783f` |
| `tmp/b83-n65-fig181-author/fig181-desktop.png` | `5ca682dc362a12ff8d805cf450c275a1fd56898fc928cbe1d3fd5ef1a4d1c967` |
| `tmp/b83-n65-fig181-author/fig181-mobile.png` | `6f1ba916378cbc22b2066bd4340c46d90f20e1cda7ed9f3219725e13c84b3fc4` |
| `tmp/b83-n65-fig181-author/fig181-minimum-width.png` | `585470f78c55976a287fd90fc6628f243f4947ff9ee1f0011e3dcacef650da0c` |
| Approved `lesson.template.json` | `296103be2a4d4bd0a64d7d1bcdafcba21f2a6f46c4ef3b5a896d2b54a0413a6f` |
| Approved `exercises.template.json` | `dc64981d360e4f9da9832ffb515a182b408631aed8c8fefd1fbb371faebab28f` |

`tmp/` rows in this table are relative to `.intentfold/tickets/STEMROBIN-180/`.
Approved templates are under the exact `b83-n65-source/adapt/8p/modern-us-neutral/
lessons/phy8-c4-s2-n65/` scratch path supplied by the human.

## Recording And Usage

Called the standard `record_review.py` exactly once, status pass; exit code 0:
`PASS: fig-181 -> .tmp/ld-s10y-lesson/b83-n65-figures/fig-181.review.json`.
Its normal internal rendered-stage/schema/hash validation passed. No separate
validator replay was performed. Read back the generated record and confirmed
source/spec/render/SVG bindings and the explanatory scope/limit/image-count notes.

Review schema: `ld-s10y-image/review@1`.
Reviewed at: `2026-11-18T22:04:06.221230+00:00`.
Review SHA-256: `64362edab965778767c39d31fa43414036340f2d1765837e422680c5a81e00b9`.
Candidate spec/SVG/render/preview and frozen inventory remained unchanged.

Reviewer image opens: **5 of 8**, each exactly once: complete original, current
preview, desktop screenshot, mobile screenshot, minimum-width screenshot.
No crops, reopens, new captures or FIRST-image opens.
Author usage remains **6 images, 1 consumed content repair, 0 repairs remaining**.
All four FIRST artifacts remain present with the recorded hashes. No usage reset.

Writes were limited to the independent frozen inventory, this report and the
explicitly permitted standard review JSON. Other work was preserved. No candidate
edits, answer/choice work, dependency/tool/app changes, Git operations, database or
model calls, publishing, finalization, promotion, other chats or descendants.
