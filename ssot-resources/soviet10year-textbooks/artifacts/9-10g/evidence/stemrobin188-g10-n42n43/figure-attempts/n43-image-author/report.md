# N43 bounded figure-author report

**Outcome: AUTHOR VISUAL HOLD, not independent approval.**

Only fig-g10-03/04/05 were authored. Their second machine render reports say
`pass`, but actual 480px and 300px SVG previews show U+20D7 vector-arrow glyphs
as squares beside i/j/k/a/b. This is a real quality-gate failure, not waived by
the label-size checks. The single allowed content repair was already spent on
label spacing. No further spec repair, renderer rerun, review pass, promotion,
or whole-lesson approval was performed.

## Authority and inventory

- [Current bound context](context.json) contains the complete relevant current
  prose, Exercise 14 question text, boundary and template hashes.
- Current stable lesson template SHA:
  `7a68b45b3f468865cdb2f15632b420f868d6f2bf0bc90c62e8c738183a002e58`.
- Current exercises template SHA:
  `5973edcdfb60977c46205bd785bd0b32273a629fbfa677f38835556cc06dadca`.
- Current figures template SHA:
  `fcbf2c6949f0db27d3fe718aa5d736fd6f1801a67e4cee48910dbe580901c5d2`.
- Earlier observed lesson-template SHA is superseded, not final authority.
  No source PNG was reopened after the parent's stability message.
- [Full pixel-first inventory and mapping](source-inventory.md) identifies
  every shared tail, tip, arrow, label, angle trace, solid/dashed distinction,
  absent given, source relationship, and deliberate regularization.
- 03/04 belong to teaching prose; 05 belongs only to Exercise 14. No answer key
  was accessed. The question's 60-degree premise and cosine/unit-vector results
  were not added as figure annotations.

## Specs and outputs

| Figure | Current FigureSpec | Current preview evidence | Machine result | Author result |
| --- | --- | --- | --- | --- |
| 03 | [spec](fig-g10-03.spec.json) | [SVG](runs/fig-g10-03-render-repair/fig-g10-03.svg), [PNG](runs/fig-g10-03-render-repair/fig-g10-03.png), [render](runs/fig-g10-03-render-repair/fig-g10-03.render.json) | draft/render pass | visual HOLD |
| 04 | [spec](fig-g10-04.spec.json) | [SVG](runs/fig-g10-04-render-repair/fig-g10-04.svg), [PNG](runs/fig-g10-04-render-repair/fig-g10-04.png), [render](runs/fig-g10-04-render-repair/fig-g10-04.render.json) | draft/render pass | visual HOLD |
| 05 | [spec](fig-g10-05.spec.json) | [SVG](runs/fig-g10-05-render-repair/fig-g10-05.svg), [PNG](runs/fig-g10-05-render-repair/fig-g10-05.png), [render](runs/fig-g10-05-render-repair/fig-g10-05.render.json) | draft/render pass | visual HOLD |

[Machine-readable report](report.json) contains complete SHA-256 references for
source, context, text bindings, specs, original failed snapshots, repaired
snapshots, SVG/PNG/render outputs and command receipts. It also records the
inventory-to-assertion coverage and actual display checks, separately from
author visual HOLD.

All geometries use the repository's deterministic JSXGraph renderer 1.13.1.
No SVG was hand-authored or hand-edited. All rays have `connects` assertions.
Every mapped labelled point has an intra-group relationship assertion; each
angle's start/end is bound to the intended forward ray, independently of counts.
03: four arrows/no arcs. 04: five arrows/one phi arc.
05: four arrows/three alpha(i,a), beta(j,a), gamma(k,a) traces.
The screen-layout displacements and circular schematic glyphs do not assert
actual three-dimensional angle sizes, perpendicularity or basis lengths.

## Verification and truthful failure

First draft: one explicit call per spec, all passed.
First render: one call per spec, all failed with label/stroke collisions.
Every `runs/*-first/` directory retains stdout/stderr, command receipt and
spec/context snapshots; the render directories also retain failed SVG/PNG/report.

One targeted content-repair round changed only `labelPlacement` for i/j and
04's b; no coordinate, arrow, arc, source, text, label or assertion changed.
One affected draft check and one render per spec then passed. The renderer
also invokes its draft validator once internally per render; these calls are
counted, not hidden.

All three display contracts are instructional inline, maxWidthPx 480,
widths 300/358/480, minTextPx 16, with no scroll fallback.
Measured minimum text: 17.5 / 20.883333333333333 / 28 px respectively.
The repaired reports have zero collisions. These are automatic checks only.

[300px actual-width evidence](normal-width-evidence.json) replays the existing,
hash-verified SVGs without invoking JSXGraph again or rewriting them.
[The screenshot](normal-width-300.png) confirms the persistent glyph defect.
This preview verification is not a product/offline-lesson acceptance check.

## Ledgers and boundaries

- [Image ledger](image-ledger.json): 7 actual context opens in one batch,
  source 3 + modern preview 3 + necessary 300px screenshot 1; no crops or
  source reopens. Batch <=8 and context <=24; one of two extra-width opens used.
- [Repair ledger](repair-ledger.json): one content repair round, affecting
  the three figures; zero technical tool recovery calls.
- Explicit draft-validator calls: 6. Renderer calls: 6, containing 6 additional
  embedded draft validations. Existing-SVG normal-width replay: 1.
- Image/API generation calls: 0. Incremental paid external calls: 0; paid
  image/API spend USD 0. Host/Codex inference billing is not measured here.
- All persistent writes stay under `n43-image-author/`. No setup, freshness,
  Grill, backend, .env, API/DB, install, publication, Git modification, other
  chat, answer, old-exercise work or N42 figure work was performed.
- No `record_review`, independent pass, core edition asset write, promotion,
  lesson validator, product write or whole-lesson approval was performed.

The preview metadata truthfully keeps its preview paths. An independent reviewer
must resolve/reject the vector-glyph HOLD before approval. Only after independent
approval may the parent mechanically migrate authorized outputs/metadata paths,
preserving these original snapshots; these SVGs must not be silently redrawn
or treated as approved solely because the render status is pass.
