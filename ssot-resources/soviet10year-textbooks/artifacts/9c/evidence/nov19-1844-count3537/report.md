# 9c physical 35-37: short source-count review

Date: 2026-11-19. Exact checkout:
`/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck`.

## Scope and verdict

Count diagnosis only, not production or page/content acceptance. All three new
original PNGs were viewed FIRST, in order 0035, 0036, 0037, before reading the
canonical page artifacts. Three necessary NEW native crops were then viewed
once each. Total: six images, one bounded batch; no enhancements or reopens.
No old/frozen ROI or N20 batch was read, and no earlier failed 2D ink-support
helper was replayed. No parent receives image payloads or should reopen them.

The true printed counted-row map is **24 / 13 / 26**. Those totals include the
printed folio: body/headings/exercises **23 / 12 / 25**, plus one folio each.
The eleven table rows on 0036 belong to the retained figure, not the body count.
Every printed counted row maps to an existing canonical logical row; none is
missing. `rowmap.json` records all 63 rows, their source windows and exact
canonical block/logical-line references, without repeating the transcript.

The unchanged live counter reproduces the existing **25/24, 15/13, 28/26**
failures. Its surplus is explained by inspected edge ink, not an omitted
printed body row. The fixed, pixel-selected rectangles below produce 24, 13,
26 on counting copies only. No expected-count input, threshold change, glyph
correction, transcript edit, new formula break or figure-box change was used.
This is a bounded count remedy, **not a canonical PASS**.

## Concrete diagnoses

### 0035: bottom edge adds one row

Original machine rows 1-24 correspond to the 24 actual counted rows.
Machine row 25 is y=2358..2380, below the folio y=2178..2208:
the sloping left scan edge and low right scanner strip, not printed type.
The new native bottom crop directly shows both separate from all glyphs.
Exclude `[0,2350,1695,31]` on the counting copy. Result: 24 rows.

Existing non-surplus distortion is not hidden: edge spots join the E64 prompt
and formula into y=599..720 before expansion recovers two rows; another edge
spot joins the subsection title and first prose row into y=1753..1904 before
expansion recovers two rows. The actual E64 formula occupies one source window,
not multiple printed lines. No text or mathematical edit follows from this.

### 0036: two left-edge blobs survive beside the masked table

Machine rows 1-12 are the twelve actual non-figure body rows; row 15 is the
folio. Extra rows 13 and 14 are y=1647..1672 and y=1824..1856, respectively.
The new native left-margin crop shows two isolated blobs with sparse specks,
not glyphs or table contents. The table begins at x=223; these marks are in the
left edge and outside its exact approved box `[223,1486,1228,651]`.
The counter's automatic 16-pixel side trim does not remove the blobs' remaining
width, so each retains a countable row.

Exclude `[0,1640,60,40]` and `[0,1815,75,50]`. Result: 13 rows. All six
display-fraction rows remain single printed rows (two initial fractions and
four calculation rows). The four calculation rows are already represented by
the existing aligned string and its three break markers. No break is added.
The exact figure box remains unchanged; its historical `from` box is not used
as a new counting envelope.

### 0037: one heading is split, plus one bottom-edge row

The original right-edge blob below the section-4 heading extends the joined
projection to y=1746..1838. The tall-band expansion turns it into machine rows
22 and 23, y=1746..1791 and y=1792..1838, although the native crop shows only
ONE printed section-heading row. The blob is separated horizontally from all
title glyphs, at the extreme right margin.

The baseline scale is line_h=44, glyph_h=37, pitch=70; the 93-pixel joined band
exceeds the tall-band gate `2 * min(44,37)=74` and expands to two. Removing the
fixed edge rectangle `[1540,1800,65,45]` leaves the heading band y=1746..1811,
one row. Separately, original machine row 28 at y=2331..2376 is the bottom
scan edge, below the folio y=2147..2179. Exclude `[0,2325,1695,56]` for that
edge. Combined counting-copy result: 26.

The interior curved mark near x=1150..1227, below the folio and above the bottom
edge, remains entirely untouched. Its exact origin is UNKNOWN/HOLD. It is not
declared a scan-artifact or separator. The existing counter sees a short raw/
expanded fragment y=2279..2284 and drops it with its existing thin-decoration
filter in both baseline and candidate. This review adds NO interior exclusion.

## Legal bounded remedy

All rectangles use original pixel coordinates `[x,y,w,h]`, with half-open
boundaries, and kind `scan-artifact`. None intersects a row window in the map.
For the 1695x2381 source, the contract allows left edges ending at x<=84.75,
right edges starting at x>=1525.5, and bottom edges starting at y>=2261.95.
The proposed left boxes end at 60 and 75; the right box starts at 1540;
the bottom boxes start at 2350 and 2325. Their pixels show non-type edge ink.
No `separator-rule` is proposed and no uncertain interior ink is masked.

Only a separately authorized production owner may add these specific
count-only exclusions and run affected-page verification. Do not change
`printed_lines` to force equality, modify the body, enlarge the figure, change
counter constants, or replace the old failed receipts with this report.
Preserve the old failure receipts before any authorized canonical rerun.

## Preserved HOLDs and limits

- E64 retains the literal final `C_6^5` and `2^6`, including its scientific
  upper-5 HOLD. This is not an erratum judgment or mathematical review.
- Every other prior HOLD remains, including glyph/Unicode ancestry,
  punctuation, emphasis/display, scientific/source semantics, joins,
  full-lesson completeness and unapproved figure implementation.
- The exact approved 0036 figure box remains `[223,1486,1228,651]`.
- Canonical `page.md`, `page.json`, `audit.json` and the three originals are
  byte-identical to the initial hash snapshot. Old FAILs remain canonical.
- No finalizer, renderer, DB, model, network, Git, worker or chat action ran.
  No browser was opened or owned; there is no browser to close.

`measurements.json` retains the exact counter bands and the bounded-copy
receipt. `ledger.json` binds sources, native crop coordinates, canonical
inputs, helper/source code and review outputs to SHA-256. Native crops remain
local evidence only; downstream delivery is textual.
