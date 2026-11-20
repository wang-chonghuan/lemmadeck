# n17 Final Offline Visual Review

Date: 2026-11-20. Lesson: `ana9-c3-s1-n17`. Assignment: 184-6.

**PASS, static visual display only.** Six complete faithful sheets were inspected
once each with `functions.view_image`. Actual observations: **6/8**. Originals
visually opened: 0. Reopens: 0. Extra crops: 0.

No blocking legibility, visible overflow, occlusion, clipping, blank figure/table
row, or control-alignment defect was observed. This is not source, figure,
content, or mathematical approval and cannot clear a source-glyph HOLD.

## Evidence

All paths below are under:
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/`.

Source directory: `.tmp/stemrobin-184-six/n17-offline/`.
Review directory: `.tmp/stemrobin-184-six/n17-visual-review/`.

The existing `n17-offline/results.json` reports `headless: true`, six native PASS
views, `closed: true`, no errors, and `database: false`. No browser was started
or upstream stage repeated.

| Order | Source PNG | Original W x H | Sheet W x H | Columns | Visual Result |
| --- | --- | --- | --- | --- | --- |
| 1 | text-1440.png | 1440 x 3311 | 2896 x 1656 | 2 | PASS |
| 2 | exercises-1440.png | 1440 x 1729 | 1440 x 1729 | 1 | PASS |
| 3 | choices-1440.png | 1440 x 4334 | 2896 x 2167 | 2 | PASS |
| 4 | text-390.png | 390 x 4205 | 796 x 2103 | 2 | PASS |
| 5 | exercises-390.png | 390 x 2034 | 390 x 2034 | 1 | PASS |
| 6 | choices-390.png | 390 x 6212 | 1202 x 2071 | 3 | PASS |

Each observed sheet is named `<source-stem>-sheet.png` in the review directory.
The review JSON binds each observation to both actual PNG hashes and dimensions.

## Observations

- Text, desktop: heading, both prose sections, formulas, both nonblank number
  lines, labels, captions and final navigation control are legible and separate.
- Exercises, desktop: all fourteen rows 134-147 visibly contain text, including
  subparts and compact fractions; row numbers, separators and return button align.
- Choices, desktop: questions 1-12 and their visible A-D options fit; question 2
  has a two-column table with a header and four populated rows. Radios and
  question 11 checkboxes align without obscuring option starts.
- Text, mobile: title fits, prose/formulas wrap within the column, both number
  lines and labels remain visible, and the final button has bottom clearance.
- Exercises, mobile: all rows remain readable; long prompts and the row 145
  fraction wrap visibly without lost text. Final subparts and button are complete.
- Choices, mobile: all three columns were inspected. The table remains complete,
  long option paragraphs fit, and radio/checkbox markers remain distinct. Compact
  fractions are distinguishable. Some terminal punctuation wraps onto its own
  line, but remains visible rather than overflowing or being omitted.

## Faithful Transformation

`transform.py`, created with `apply_patch`, uses existing Pillow 12.3.0 from the
lesson virtual environment. No installation or environment change was made.

The transform uses contiguous vertical RGB tiles, with a maximum height of 2400
pixels, reflowed into columns. Read each column top-to-bottom, then left-to-right.
Every tile is copied at scale 1 without resampling or altering source content.
Only 16px neutral-gray column gaps and unused bottom padding are added; there
are no outer margins or overlaid labels.

`transform-receipt.json` records every half-open source and sheet rectangle,
tile order, gaps, dimensions, original PNG SHA256, sheet PNG SHA256 and raw RGB
hash. The saved sheets were decoded, each tile compared byte-for-byte against
its original, and originals reconstructed with exactly identical RGB bytes.
All original pixels are included exactly once and all source file hashes remain
unchanged.

Mechanical boundaries sometimes divide glyphs: desktop choices at y=2167
(question 6 option A), mobile text at y=2103 (second caption), and mobile choices
at y=2071/y=4142 (question 3 option B/question 8 option C). Both continuations
are present in adjacent columns. These are reversible sheet cuts, not clipping
in the actual screenshots. No additional observations were needed.

## Limits And Recovery

This review establishes visible static display quality at the supplied 1440px
and 390px widths, not interactions, focus, accessibility, intermediate widths,
live navigation, independently measured font sizes, source fidelity or math.
Visible selected inputs are not an endorsement of those choices. Existing
source-glyph HOLDs and other content/source/figure gates remain unchanged.

`initial-failures.json` preserves the absent review-directory probe, missing
system-Python Pillow and missing local sharp errors. Recovery used the already
available lesson Pillow and only the authorized output directory. Those setup
failures did not constitute image observations or content verdicts.

No browser, rerender, regeneration, new screenshot, network, model request,
dependency change, delegation, content repair, Git, backend or DB action occurred.
All writes were confined to `n17-visual-review/`.

## Integration Files

- `review.json`: per-page/view verdicts, hashes, coverage, observations and limits.
- `report.md`: this textual report.
- `transform.py` and `transform-receipt.json`: transformation code and exact
  pixel-preservation receipt.
- `initial-failures.json`: retained technical setup failures.
- `output-hashes.json`: final file SHA256 manifest; excludes its own self-hash.

Parent integration should consume the textual review and existing evidence
paths/hashes without reopening the complete six-image batch.
