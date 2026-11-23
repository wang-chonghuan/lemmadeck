# N34 Source-First Independent Figure Inventory

Reviewer role: sole independent FIGURE reviewer, not author.
Date: 2026-11-23.
Sole cwd: /Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188.
Owned output: .intentfold/tickets/STEMROBIN-188/tmp/n34-figures-independent7/.

This record was written after opening exactly the two original PNGs, and BEFORE
opening any author spec, inventory, manifest, SVG, report, or final PNG.
One continuous bounded batch: 2/8 loaded images; current context 2/24.
No source reopens, crops, other images, or extra batches.

## Authority and bindings checked once

All paths below are relative to the sole cwd.

- Source table: ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n34/preparation7/artifacts/6-8g/figures/tbl-p0160-01.png
  SHA-256 c5a719f4420f6800c092eecfe888fa23f37417dc8ed3aea0739fadd2e68b749f.
- Source fig-213: ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n34/preparation7/artifacts/6-8g/figures/fig-213.png
  SHA-256 e42e4ea9ff4bffc89c4597620d977411cb82c7b86bdc973272f6d64505279bb9.
- Full approved edition lesson: ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n34/resume7/lesson.approved-template7.json
  SHA-256 b5d59fd5138f20eb015e380a0e5e378b5ba1833b003aba0604967fa543a59269.
- Complete exercise text: ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n34/text-author7/exercises.template.json
  SHA-256 3f269c0542abfcc7dfbd3f4535a20d0ef714c0fff1df744db83eda9efefb670e.

The full top-level approved prose and all four exercise texts (446-449) were read.
The edition explicitly discusses ALL lines in ONE plane and includes coincidence
in the prose/table parallel relation. Exercise 449 deliberately excludes
coincidence and does not supply the table's definition. All exercise figure_refs
are empty. These figures illustrate prose, not exercise answers.

## Table: independently observed pixels

Stable independent requirement IDs, not author object IDs:

- T-GRID: Four rows total (one header plus three property rows), six columns total
  (one property column plus five relation columns): 24 logical cells. Five
  horizontal boundaries are visible, including top/bottom; five internal vertical
  separators form the six columns. Source has no drawn outer left/right vertical
  border. The property column is substantially wider than each relation column.
  The source's scan breaks/uneven thickness are not mathematical gaps.
- T-HEADER: Blank top-left cell. From left to right, relation headers are parallel
  (two slanted parallel marks), perpendicular (an upright meeting a baseline),
  congruence (a loop/infinity-like mark over two horizontal equals strokes), strict
  less-than, and non-strict less-than-or-equal. Five headers, no quantities/units.
  The third header is the historical shape of the congruence relation identified
  by authoritative prose, not a claim to know the historical glyph's role.
- T-ROWS: Top-to-bottom properties are reflexivity, symmetry, transitivity.
  Original Chinese row labels have trailing ellipsis-like dots. Those dots and
  original glyph identities are not required English labels in the modern image.
- T-REFLEXIVE: Across the five relation columns: +, -, +, -, +.
- T-SYMMETRIC: Across the five relation columns: +, +, +, -, -.
- T-TRANSITIVE: Across the five relation columns: +, -, +, +, +.
- T-SIGNS: Fifteen signs total: ten plus and five minus, each in its corresponding
  property/relation cell. No numerical answers, annotation arrows, points,
  measurements, extra relation columns, or extra property rows.

## Independent table mathematics

Property order is reflexive, symmetric, transitive.

| Relation | Independent result | Reason |
| --- | --- | --- |
| Coincidence-inclusive parallel, one plane | + + + | Every line has its own direction; direction equality is reflexive, symmetric, and transitive, including identical lines. |
| Perpendicular lines | - + - | A line is not perpendicular to itself. Perpendicularity is symmetric. Let a and c be horizontal and b vertical: a perpendicular b and b perpendicular c, but a is not perpendicular c. |
| Congruent figures | + + + | Identity, inverse, and composition of rigid motions establish the three properties. |
| Strict numerical less-than | - - + | x < x is false; 0 < 1 does not imply 1 < 0; strict order is transitive. |
| Numerical less-than-or-equal | + - + | x <= x; 0 <= 1 does not imply 1 <= 0; non-strict order is transitive. |

All fifteen independently derived entries agree with the source pixels.
For scope separation only: exercise 449's strict parallel relation would be
- + -, not + + +: a line is not disjoint from itself, and setting a = c with a
different parallel b refutes transitivity. That result must not replace the table
or be added visibly as a solved exercise.

## Fig-213: independently observed pixels

- F-UPPER: Four distinct finite black strokes in an upper oblique bundle, all
  rising toward the right in screen space and mutually visually parallel. Their
  left endpoints step down/right; their right endpoints likewise step down/right.
  The uppermost starts furthest left and ends first; the lowest starts furthest
  right and ends last. Scan roughness is not a deliberate dash pattern.
- F-LOWER: Four distinct near-horizontal black strokes below the upper bundle.
  All run left-to-right and are mutually visually parallel. Approximate length
  and interval regularization is allowed, but no fifth line is present.
- F-TOTAL: Exactly eight strokes, separated into two four-line bundles with a
  clear vertical gap. No crossings within either displayed finite bundle.
- F-LABELS: No letter, number, axis, point, arrowhead, angle mark, equality mark,
  or in-image caption. The edition's external caption is "Figure 213" in context;
  it is not an original in-image label.
- F-RELATION: Each stroke must be covered by executable within-bundle parallel
  assertions, not just objectCount. There is no cross-bundle perpendicularity
  assertion in the source or prose. The illustrated directions are different.
  These are two examples of parallel-line classes, not an exhaustive assertion
  that all plane lines have only two equivalence classes.

The full prose defines equivalence by the three axioms, relates equivalence
relations to disjoint classes, and says each illustrated parallel-line bundle is
one class. A deterministic redraw may regularize stroke placement/length/spacing;
its modern coordinates are not measured source givens.

## Historical notation and modern-label boundary

The historical infinity-over-equals, script-style notation, and downmarker roles
remain UNKNOWN. No semantic role is guessed, no human-gate request is inferred,
and no whole-page glyph-fidelity review is added. Source-bound mathematical
relation shapes are preserved separately from modern typography/coordinates.
Authoritative prose supplies the congruence relationship; it does not resolve
the historical notation's typographic/proof-marker role.

Binding quality-gate rules require English visible property labels. The expected
translations are Reflexivity, Symmetry, Transitivity in that order. English
mapping, not identity to original Chinese glyphs, is the review criterion.

## Seal

Source phase complete. This document is to be chmod 0444 before any author-package
read or final-image open. Subsequent mapping/verdicts belong in separate files;
this source-first inventory is not to be revised from author observations.
No DB, Git, app, native finalize, paid model, network, peer messages, delegation,
canonical edits, or math/source/text/key edits were performed.
