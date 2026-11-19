# Page 57 Count Diagnosis: Saved-Evidence Completion

The original diagnostic completed at `2026-11-19T17:01:07.884592+00:00`,
exit **0**. Its actual stdout, stderr, exit and measurements are reused;
the measurement/counter/finalizer was not rerun after the human pause.
This completion adds only mapping, proposal and preservation records.

## Actual Native Band Mapping

The saved unchanged API returned 24 bands. The page format represented
22 main rows with no WRAP markers. Assignment is based on saved geometry and
the independent FIRST object flow plus the already observed ROI, not on
assuming that the numerical difference equals the number of braces.

| Native Band | Inclusive Source Y | Main Row / Annotation |
|---|---|---|
| 1 | 206..259 | Main 1: theorem continuation |
| 2 | 295..337 | Main 2: 得到. |
| 3 | 367..414 | Main 3: conversion paragraph |
| 4 | 446..492 | Main 4: conversion paragraph |
| 5 | 538..613 | Main 5: m/n fraction and prose |
| 6 | 657..703 | Main 6: 小数. |
| 7 | 736..776 | Main 7: smaller explanation |
| 8 | 818..871 | Main 8: repeating decimal and r=m/n |
| 9 | 872..926 | Main 9: 足不等式 |
| 10 | 960..1009 | Main 10: inequality; upper brace portion |
| 11 | 1010..1059 | Annotation of main 10: lower brace plus k 位 |
| 12 | 1081..1119 | Main 11: 但是这时，由于差 |
| 13 | 1154..1183 | Main 12: 0.24-r |
| 14 | 1213..1254 | Main 13: 是一个正数，要它小于 |
| 15 | 1285..1335 | Main 14: equality; upper brace portions |
| 16 | 1336..1386 | Annotation of main 14: lower brace plus k 位 |
| 17 | 1410..1449 | Main 15: 是不可能的. |
| 18 | 1549..1590 | Main 16: exercise heading |
| 19 | 1643..1690 | Main 17: exercise 115 stem |
| 20 | 1721..1766 | Main 18: exercise stem continuation |
| 21 | 1802..1892 | Main 19: four fractions on one shared row |
| 22 | 1993..2041 | Main 20: h3 14. 实 数 |
| 23 | 2093..2143 | Main 21: unit-14 opening, open |
| 24 | 2176..2206 | Main 22: printed footer 50 |

`band-mapping.json` records every assignment, block/line identity and
the annotation-component correspondence.

## Why Bands 11 And 16 Are Physical Annotation Rows

All 1,367 source-ink pixels in band 11 lie inside the prior observed ROI.
The overlapping components are exactly brace component 14 and label
components 15..19. The prior ROI observation identifies the glyphs as `k 位`.
`k` is at `[766,1029,18,26]`; `位` and its fragments fit
`[797,1028,32,32]`. These are below the upper decimal digits at y961..991.
The label contributes 635 pixels; the remaining 732 band pixels belong
to the lower portion of the brace, which spans y1001..1021.

All 1,184 source-ink pixels in band 16 likewise lie inside the observed ROI.
The overlapping components are brace fragments 44..49 and label components
50..52. `k` is at `[640,1350,20,31]`; `位` and its fragment fit
`[671,1350,37,37]`, below the lower decimal digits at y1285..1315.
The label contributes 864 pixels; 320 band pixels are the lower brace
strokes/fragments. The brace also overlaps main band 15.

These bands are not classified as annotation merely because there are two.
Their exact locations, complete ROI containment and measured components
tie them to the independently observed lower label glyphs and brace strokes.
The bands include brace portions, so they are not claimed to be label-only.
The diagnostic had already verified that the existing ROI is an exact
source-pixel subarray, without resampling. That test was not repeated.

## Other Ink And Limits

Saved component 20 has 13 pixels at `[680,1127,6,3]` and overlaps no native
band. Component 27 has five pixels at `[875,1215,2,3]` and coincides with
main band 14; it creates no separate row. Their physical origins remain
UNKNOWN. No source words or exclusions are proposed for them.

Outside the ROI, raw source bounding boxes can include margin marks or
adjacent fraction tails. The mapping identifies the observed main text rows;
it does not claim complete semantic attribution of every such pixel.
The tall m/n row and the four parallel exercise fractions each retain their
existing main-row representation. No blanket fraction-height rule is proposed.

## Smallest Proposed Representation

Use the page format's existing WRAP marker once immediately before `k`
inside each of the two already transcribed subscript labels:

```latex
_{k\text{ 位}}
_{↵k\text{ 位}}
```

Only block 3, lines 4 and 8 are targeted. Full exact original/proposed rows
are in `proposed-correction.json`. No word, digit, fraction, exponent `-k`,
brace coverage, punctuation, newline, heading or cont/open flag is changed.

`blocks.printed_lines` adds one represented physical row per WRAP marker.
`blocks.text_of` strips it before semantic joining. Removing the two proposed
markers restores the saved original rows byte-for-byte. Thus this proposes
metadata for real printed annotation rows, not blank-line padding or invented
label text. The label text is already present in the formulas.

The contract predicts a representation of 24 rows after the two insertions.
This is a proposal, not an executed count or a finalizer PASS. No counter API
was run against it and it has NOT been applied to canonical page 57.

## Preservation And Stop

The earlier human shutdown pause and the incomplete stopped state remain
recorded in `resume-ledger.json`. The latest authorized resume covers only
this missing mapping/proposal phase.

Original partial files and all FIRST/ROI/finalize evidence are unchanged.
The actual first-finalize **exit 1 / printed 24 / logical 22** remains history.
No source approval, mathematical proof or assembled n13 approval is claimed.
No page 56, page 58 or completed n12 artifact was read.

Images remain **2/4**, with zero new image/crop/reopen and no parent payload.
No measurement, count API, finalizer, canonical edit, exclusion, counter patch,
assembly, backend, DB, publisher, Git, browser, worker or peer action ran on
this resume. Stop for parent intake; application needs further authorization.
