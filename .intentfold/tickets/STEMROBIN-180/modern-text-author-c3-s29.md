# phy6-c3-s29 Modern Text Author

## Scope And Authority

- Only §43 浸润现象; source root `.tmp/ld-s10y-lesson/approved-through-107/artifacts/6p`.
- Read complete raw `lessons/phy6-c3-s29/lesson.json`, `lesson.md`, `exercises.json`. Source refs cover p0105#7..10 and p0106#1..5. No blocked108 material used.
- User-reported approved assembly scope is 97 pages / 47 items / 193 exercises / 85 figures, with §44 open. This author did not rerun or independently certify that assembly.
- Original exercise count is zero; retained empty exercise list, no invented exercises or choices.

## Preservation And Editing

- All 8 source blocks remain in order, including fig83 and its caption, with source snapshots and bindings unchanged.
- Complete experiment retained: horizontal glass plate on a fine spring; container raised from below until the plate meets the water surface; additional spring extension before separation; extension indicates molecular attraction; separation leaves a water film; separation within water rather than at the glass-water interface.
- All material relations retained: water wets glass, wood and leather; does not wet wax, paraffin or oily surfaces; mercury does not wet cast iron and does wet gold and zinc. Original cast-iron-bottle parenthesis remains.
- Both molecular-attraction inequalities retained, with the correct opposite comparisons for wetting and nonwetting.
- All applications retained: towel knit fabric, ink on paper and metal nibs, and oil-gland secretion applied to waterbird feathers and its contribution to floating.
- Changes are layout and label-language only. Cyrillic a/b/v references become fig83(a)/(b)/(c); print-line bold seams are joined without changing words.
- Existing `edition.normalize_prose_layout` produced idempotent sentence/paragraph layout. `prose_flow.mjs` emitted the exact adjacent paragraph anchors copied into `section_breaks`; resolved boundaries are [4,6,7] in 9 final paragraphs.

## Actual Commands And Evidence

`p2c.py adapt-prepare --book 6p --edition modern-us-neutral --lesson phy6-c3-s29 --root .tmp/ld-s10y-lesson/approved-through-107/artifacts --work .tmp/ld-s10y-lesson/text-author-c3-s29` ran once, exit0: 8 prose blocks, 0 exercises, 1 figure. Shared existing Python environment used with bytecode disabled.

Scratch evidence: `.tmp/ld-s10y-lesson/text-author-c3-s29/text-author-check.json`, `prose-flow.json`, `text-freeze.json`. Author preservation check confirms identical source snapshots, all words/punctuation preserved after the declared label/typography/layout transformations, zero exercises and idempotent normalization. This is an author check, not independent review.

## Frozen Hashes Before Figure Authoring

Freeze time: 2026-11-15T19:56:56Z. This report and text-freeze record were written before opening fig83 PNG or starting its author workflow.

| File | SHA-256 |
|---|---|
| raw lesson.json | `e3e0d85c51eaf79ff61d461c1f43c3d1e17e77b03a193927059eb1c403b0e01a` |
| raw exercises.json | `8652c3d3fa7ba43e75df8edc602544013be78ad9a2b43a09b7b28f5e6c76cfcc` |
| lesson.template.json | `14863231e07755d6d705c36dff7912016d307c380a983b71543e94ed49337e4f` |
| exercises.template.json | `51e330931746ee77f740c6de09b700c9fc797f1cb2ffa100e04768059f76ddbd` |

Template directory: `.tmp/ld-s10y-lesson/text-author-c3-s29/adapt/6p/modern-us-neutral/lessons/phy6-c3-s29/`.

Text and exercises are frozen author candidates, independent review pending. Figure template at this freeze is source-bound but not yet drawn or approved. Figure authoring is delegated next to the ld-s10y-image workflow, exclusively under `.tmp/s10y-image/6p/fig-83/`; lesson/exercise hashes must remain fixed.

No finalize, publication, promotion, database, Git, app, index or charter operation was performed. The prepare tool created its normal isolated book template; the author did not edit that file.

## Figure Handoff

User subsequently reported s29 independent text PASS with unchanged frozen hashes; no further text review or edit was performed.

Figure83 author workflow is now BLOCKED: first headless renderer rejected label-protection rectangles at the bottom boundary; one7px label-anchor repair was used, then the second renderer rejected label-protection rectangles intersecting the vessel-bottom strokes. No further repair.

Full report: `.tmp/s10y-image/6p/fig-83/author-report.md`. Failed candidate `fig-83.svg`, `spec.json`, `fig-83.render.json`; six306/640 theme captures and actually viewed theme sheets are bound by `author-preview.json`. Original first failure is byte-preserved in `failure-01-label-clearance/`. Azure calls0, generation retries0, renderer invocations2, repairsUsed1/1. No self-review or promotion.

Text/exercises remain independent-PASS frozen candidates. Figure template remains draft and cannot be finalized or promoted with the rejected figure83 output.
