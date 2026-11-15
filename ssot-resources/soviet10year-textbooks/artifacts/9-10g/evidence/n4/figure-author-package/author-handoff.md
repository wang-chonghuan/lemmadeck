# Figure11 Author Handoff

Date: 2026-11-15. Ticket: STEMROBIN-184. Author: Codex, delegated modern-figure author, not the independent reviewer. Status: stable scratch package ready for parent source/context/mathematical/output review. No `record_review`, promotion, lesson finalize, durable edit, service, DB, dependency change or commit.

## Source And Actual Authority

The complete original `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-11.png` was opened once and inventoried before any spec or context build. That freeze remains unchanged in `source-inventory.md`; no parent source/review report or answer material was used.

After the explicit approved-text notice, existing `build_context.py --book 9-10g --edition modern-us-neutral --figure fig-11` ran once to produce `context.json`. Actual durable n4 `lesson.json`, `exercises.json` and `figures.json` were read. The spec binds the official context plus the modern top-level schematic explanation/problem/introduction paragraphs; it does not use embedded faithful `source.data` as authority. All three exercises have no figure reference, so this is a body illustration, not an exercise/answer diagram.

Durable input root: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n4/`.

| Input | Raw SHA-256 |
|---|---|
| Original fig-11.png | `78d51e15df951d37f27e06a81d182a96e4762d7c7491e0917c5000e847843fb1` |
| lesson.json | `78725b68d739504657c1e4ee3382f0dac2e1214fdf7af1d2b4bf53bcfe8ccec2` |
| exercises.json | `e92b23248c77e2bdea6942b653c77f9703d6ee41285101978911e024c73a1a85` |
| figures.json | `4d27931c1265a40e74dedc433268532417489314ca4d76caae83e5f85e8ab703` |

These current byte hashes still matched their recorded bindings at handoff. `context-binding.json` also binds the original source freeze, official context and current spec.

## Complete Realization

Two separate source configurations remain side by side, with English a)/b) markers below. Each has its own alpha window/M point; no mutual plane relationship or common spatial frame is claimed.

| Group | Exact visible source realization | Native mapping |
|---|---|---|
| Left a) | `left-alpha-outline`, `left-alpha-label`, `left-line-a`, `left-a-label`, `left-line-b`, `left-b-label`, `left-M`, `left-M-label`, `left-panel-label` | M on b; a parallel b; M and all four interior labels inside; all four unmarked line extents inside; both line depictions connected; parallelogram window structure. |
| Right b) | `right-alpha-outline`, `right-alpha-label`, `right-line-a`, `right-a-label`, `right-M`, `right-M-label`, `right-panel-label` | M on a; M and all three interior labels inside; both unmarked extents inside; sole line depiction connected; parallelogram window structure. |

The left dot lies in the lower half of b and not on a; source a/b labels are right of their strokes, M right of its dot, alpha lower-left. Right has one dot on one line, only the a line label, M to the right and alpha lower-left. All strokes are solid. No endpoints/corners acquire point dots or names; no extra grid, tick, equation, arrow, caption or mathematical value was added.

There are 16 visible authored objects: two plane windows, three finite depictions of infinite lines, two source M dots and nine labels. Inventory groups map every object and every own-panel native assertion. The 29 native assertions include 15 inside checks (points, all seven interior labels, six unmarked extents), three connects, two M-on-line, distinct-left-line parallelism, four window-edge parallelisms and four completeness counts. Counts do not replace incidence/parallelism checks. Each panel has just one source-named point; no extra visible anchors were invented to claim a multi-point inventory requirement.

## Executable Supplemental Relations

`projection-model.json` and `check-source-relations.mjs` provide scratch author evidence for native-unsupported M-off-a and b=a semantics, and infinite-line coplanarity. `source-relations-check.json` reports 10 PASS checks and binds the current spec/model/context.

Each panel uses its own local z=0 plane and affine projection:

- Left: (x,y)=(25+90u+40z, 95+15u+100v+60z).
- Right: (x,y)=(345+90u+40z, 95+15u+100v+60z).
- Model window vertices, both M points and every finite line extent project exactly to the spec. For each complete spatial line, n.p0=0 and n.d=0, proving containment for all real parameters, not only the displayed extent.
- Left a and b have parallel nonzero directions but distinct u coordinates (13/18 and 2). Direction determinant is zero while offset/M determinants are nonzero: M is on b and not on a. Display separation115 is a chosen projection distance, not a source measurement.
- Right semantic alias b resolves to the exact same complete `right-line-a` model object. Only that line and its a label render; no `right-line-b` or `right-b-label` exists. The text b) is only the panel marker. This follows approved n4 prose that explicitly permits coincident lines in its parallel convention.

The complete source relationship checks are executable, not replaced by `objectCount`. They supplement, but are not misrepresented as, native FigureSpec assertions or independent approval. Arbitrary affine coordinates, exact window regularization, font sizing and semantic fill are modern layout, not raster-measured 3D angles/distances or physical boundaries of infinite planes.

## Rendering And Actual Display

Existing `validate_spec.py --stage draft --json`: PASS once. Existing JSXGraph renderer: **first and only render PASS**, 16 objects/9 labels, zero collisions. Its internal current-spec validation passed. No repair was triggered, no SVG hand-edit or redundant rerender; there is no failure artifact to conceal.

Full `fig-11.canvas.png` was opened. The three actual current-CSS screenshots below were each opened after one isolated headless preview pass:

| Actual media width | Viewport | Measured minimum text | Dark screenshot pixels | Verdict |
|---:|---|---:|---:|---|
| 640 | 1440x960 | 44px | 10875 | PASS |
| 346 | 390x844 | 23.7875px | 3001 | PASS |
| 240 | 284x640 | 16.5px | 1664 | PASS |

Canvas640x440; `instructional`, inline, maxWidth640, declared widths640/346/240, minText16. The preview reuses current `sr-read > sr-read-fig > sr-figure-media > sr-figure-vector` CSS and exact FigureMedia width640/max-width100% behavior. Actual media/SVG widths matched, all nine labels present and unclipped, no horizontal page overflow or blank output. Alpha/line/point/subfigure labels and both entire windows remained readable; the right panel still has only a.

Current CSS `app/src/styles/app.css` SHA-256: `9fdcb8b3060e0cd0a6b97bf8a32f18c924b60a18226fa8c0d1a485221277168f`. HTML snapshots are `fig-11.display-{640,346,240}.html`. This is an offline projection through actual current CSS, not a claim of published-app acceptance.

Existing renderer and scratch `preview.mjs` launchers were inspected: explicit `headless:true`, task-isolated contexts, no persistent profile/CDP. Commands used `env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never`; preview aborted all external requests. No visible/browser-user window, user tab or OS input was touched. Both task browsers/processes closed. Old figures/previews were not overwritten or rerun.

## Current Package Hashes

All paths below are relative to `.tmp/s10y-image/9-10g/fig-11/`.

| File | Raw SHA-256 |
|---|---|
| source-inventory.md | `75819e0e7a56b2c3f0254b88f3ec5f9609da5be28ff98bcb9bf49a543a652e55` |
| context.json | `10fcf57c21027f31395a5a66215fbd47bacaa739b3bcdc45f5e95c8b028fff4a` |
| context-binding.json | `7baaae210e48e6012e2bec03a1e74baa360be8e17ed40e7eb11487ecc9a08536` |
| fig-11.spec.json | `af61abbcf705868e061d22d6521fb7a47d572176970ca0c82b90dfbad2fcf69a` |
| fig-11.svg | `1379817620a46e33ff568ab881830aa9b45a315cb4397c6693044b0edb3b793a` |
| fig-11.render.json | `157f3c9a26aba12f605922b20bcc0b53cc30360aeb312c649dc98a0fc8718d19` |
| fig-11.canvas.png | `15b3256648402a0a40b8816204f85e5eb9b47ecf4032675722cba95bfc22f9ce` |
| projection-model.json | `98c7af1eb7102ec800bb2deab36020647ab5cee930692875358e88dbb9160ad6` |
| source-relations-check.json | `658df02da3a70604c69e3f98a1dc899d3a3748f47c44335e1d8d53e67488e641` |
| display-evidence.json | `36ae81286ee201663973739186aeb2dfb4ff4514cbae8ebdfcd5a679380f7d59` |
| fig-11.display-640.png | `185ebba88a595c6228219d0ac6c93a0e837177eeab863819783509da93e35a60` |
| fig-11.display-346.png | `ab9fa7af39c5b3e9f135b86459c6651fe79b9f1a4ca4016c3bb74a1d3eef69c4` |
| fig-11.display-240.png | `e809777a3ef456a99443f83421b33c64a4970e85d0f8bc39a39dddf7da21f64b` |

Author stage complete; no known author render/display/source-relation blocker. Package remains scratch and unapproved. Parent owns the one independent source/context/mathematical/visual review, any review record, durable path rebasing/promotion and lesson acceptance. This author stops without further figure mutation.
