# STEMROBIN-184 N10 Independent Figure Review

## Scope

Bounded offline review on November 23, 2026, solely in
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Only this report is authored by the reviewer. No asset edits, rerendering,
scalar-validation replay, answer-key access, database, environment-file, Git,
dependency, app, peer, promotion, or official `record_review` operations.

## Independent Source Freeze

Frozen from the first and only opening of
`ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0044-01.png`,
before reading the authored spec, SVG, render report, or author inventory.

The original is one rectangular table with exactly four columns, one header
row, and six data rows. The second column is substantially wider than the
others. Vertical dividers separate the columns; the outer border and a
horizontal header separator frame the table. Individual data rows have no
drawn horizontal separators in the source. There are no subfigures, axes,
arrows, legends, highlighted answers, or rows for sums 8 through 12.

The visible source headers, left to right, are `点数`, `有利的结果`,
`有利的结果数`, and `概率`: score/sum, favorable outcomes, number of favorable
outcomes, and probability. Outcomes are written as ordered die values joined
by the Chinese word for "and"; the order is significant. First die values
increase from left to right within each row.

| Sum | Ordered outcomes, in visible order | Count | Probability |
| --- | --- | --- | --- |
| 2 | (1,1) | 1 | 1/36 |
| 3 | (1,2), (2,1) | 2 | 1/18 |
| 4 | (1,3), (2,2), (3,1) | 3 | 1/12 |
| 5 | (1,4), (2,3), (3,2), (4,1) | 4 | 1/9 |
| 6 | (1,5), (2,4), (3,3), (4,2), (5,1) | 5 | 5/36 |
| 7 | (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) | 6 | 1/6 |

This freezes all 21 visible ordered pairs, their row memberships, counts,
and given probabilities. These probabilities are source facts, not additions
derived from an answer key.

## Candidate Comparison

Read the complete top-level modern `.prose` in
`.tmp/stemrobin-184-six/n10-nov23-source4345/adapt/9c/modern-us-neutral/lessons/ana9-c2-s3-n10/lesson.template.json`.
No exercise or answer-key files were consulted. The relevant p0044#1-4 prose
defines distinguishable dice and 36 equiprobable ordered outcomes; p0044#4
explicitly says this table covers only some sums and that unlisted sums can
be counted by the same method. The separate worked sum-8 example in prose
does not authorize adding a sum-8 row to this source table.

The current spec, XML-parsed SVG text, passing render report, and existing
screenshots were compared with the independently frozen source:

- **Structure and membership: PASS.** Exactly four columns and one header
  plus six data rows remain, with sums 2-7 only. Every ordered pair in the
  freeze is present, in the same row and source order; reversed unequal
  pairs remain distinct. Counts and printed reduced probabilities are
  unchanged. There is no total row, merged cell, extra outcome, or row 8-12.
- **Inventory mapping: PASS.** `T44-grid-main` maps the four adjacent
  `T44-grid-col1` through `T44-grid-col4` grids. Headers map to
  `T44-r1c1` through `T44-r1c4`; source data map to `T44-r2c1` through
  `T44-r7c4`. The outcome cells in rows r5-r7 use `-line1` and `-line2`
  labels within their original cells, not additional rows.
- **English labels and meaning: PASS.** Visible headers are `Sum`,
  `Ordered outcomes`, `Count`, and `Probability`. These preserve the
  source columns' meaning in the authoritative ordered-dice context.
  Numbers, ordered-pair notation, and slash fractions are unambiguous.
  No Chinese/Cyrillic lettering or cultural decoration leaked into the output.
- **Additions and answer disclosure: PASS.** Body-row rules are explicitly
  declared modern regularization, not misidentified as original source
  lines. Outcome wrapping and English/tuple/slash notation improve display
  without changing facts. No answer-bearing row, result, formula,
  annotation, highlight, or completion beyond the source was added.
- **Desktop geometry: PASS.** The 640 x 584 desktop-media screenshot shows
  the entire table, all borders, and all 28 cells. The wide outcome column
  keeps each pair intact. Wrapped entries remain clearly grouped within
  their rows; labels do not overlap rules, each other, or neighboring cells.
  The raster is visibly intact and dark text is legible on white.
- **Mobile ends: PASS.** The start screenshot shows the left border, every
  sum, and all 21 ordered outcomes including both lines of sums 5-7.
  The end screenshot shows the complete Count and Probability columns,
  all six values in each, and the right border. Partial outcome text at the
  left of the end view is expected horizontal viewport clipping, not lost
  figure content. Both views expose the full table height and bottom border.
  Together with the existing measured endpoint evidence, they substantiate
  actual horizontal end reachability rather than a canvas-width assumption.

## Reused Mechanical Evidence

No validator, renderer, browser, or scalar-check script was rerun.
`durable-binding.json` records an actual current-draft validation PASS,
exit code 0, with no errors. Its sole spec change was the byte-identical
source-image path binding; objects, assertions, SVG bytes, and screenshots
were unchanged. `author-checks.json` retains the actual successful renderer
executions and determinism evidence; determinism is not used as proof of
source fidelity.

The current `tbl-p0044-01.render.json` is PASS, names the exact reviewed
spec/SVG hashes, records no collisions, and passes the declared 640px
display check. The authored `gridDimensions` and cell `inside` checks are
reused. `candidate-check.json` supplies the existing desktop 1440 x 960
and mobile 390 x 844 measurements: actual media width 640px on both,
minimum transformed text 16px, and minimum measured cell-label clearance
10.8984375px. Its mobile scroll viewport is 366px, content width 640px,
and measured/expected end both 274px, with document width equal to the
390px viewport. These are author measurements, not new reviewer measurements.

## Hash Bindings

SHA-256 values below were independently read from the current local files.
The supplied spec and SVG hashes match exactly. Author evidence bindings
also match the current source, render, prose file, and three screenshots.
Figure-author filenames in this table are relative to
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/figure-author/`.

| Artifact | SHA-256 |
| --- | --- |
| Source: `artifacts/9c/figures/tbl-p0044-01.png` | `7f437a89e35a22a92aca0952032470aa914d6ad494b91a00dec285cfac787dfb` |
| `tbl-p0044-01.spec.json` | `8dfda5dad764f8789b846b29ad8a245281baf5c3d90639f5f8acabb51054bf24` |
| `tbl-p0044-01.svg` | `3b873232d2afdb80b3a7fb665be50764907b33505b037ad1d3502de825ca15d6` |
| `tbl-p0044-01.render.json` | `c3c8d7ea8ca5e696de8304e4e164bbe2db7275651c2bcfc048298397bfbd65b3` |
| `candidate-check.json` | `b761ad71f198a793c70d44f359c0269b0da9e9f746e9e80a792d89e1b7612667` |
| `author-checks.json` | `4454e3f1453415c22591a3ca442278a088b3404ffca18d5ce298d4a7e7386e03` |
| `durable-binding.json` | `cd81e8af0036cbe27bc6de96bc89fd8df0e8526b65cd49d95c85ce484c7628ae` |
| `tbl-p0044-01.desktop-media640.png` | `631d3677eb69ebcff6a94c23b87a2ed52fbef8025c5a81abb04efc6796529a80` |
| `tbl-p0044-01.mobile-scroll-start.png` | `fe608bad7279179533c562a11b434ff4066581a814c95e0f2a102dce872c8a8e` |
| `tbl-p0044-01.mobile-scroll-end.png` | `4e2dcdc7579748389f2309e44669e0ee646c49fce26be9f05f21bd5d1391d58f` |
| Authoritative `lesson.template.json` at the prose path above | `61b7a8d07288e45f2700cab75d2d6d9079e5c5c9f09d5c505b1f043e5b96a4cd` |

## Verdict

**PASS: independent source-fidelity, mathematical, English-label/cultural,
table-geometry, and existing desktop/mobile-display review of this exact
candidate. Concrete failures found: none.**

Image count: **4 total** in this review, opened once each in order:
original source, desktop-media640, mobile-scroll-start, mobile-scroll-end.
No source reopen, crop, additional raster, or SVG image viewing occurred;
SVG inspection was textual XML inspection only.

Only `figure-review.md` was created/edited. Authored assets and other dirty
files were untouched. This report is not an official `ld-s10y-image/review@1`
record and does not claim app/lesson acceptance or publication. Parent-owned
exact-asset promotion, consequent mechanical metadata rebinding, and official
review recording remain unperformed, as requested.
