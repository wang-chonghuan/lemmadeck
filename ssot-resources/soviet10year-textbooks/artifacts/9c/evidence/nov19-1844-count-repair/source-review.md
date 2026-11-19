# STEMROBIN-184 B: independent source-ink review

Date: 2026-11-19.
Root: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck`.
All paths below are relative to that exact root.

This is a bounded source review, not production work or acceptance/finalization.
No network, external model, DB, publishing, commit, or finalize call was made.
No canonical artifact or tool was changed. Only this report was written.
The supplied independent observations p23=26 and p24=24 were retained as
references, not counter targets. Their approved prose was not re-reviewed.
P33 was counted from source pixels before its MD/layout was read.

## Coordinates and method

Every source is 1695 x 2381 pixels. Boxes are native, zero-based `[x,y,w,h]`,
covering `x <= column < x+w`, `y <= row < y+h`.
Visual classification came first: three clean full PNGs, then one native crop
per page. No grid, resize, enhancement, composite, screenshot, or visual reopen.
Subsequent numeric checks used the unchanged ink threshold `<128` and
four-connected components. Numeric reads did not display additional images.
Component separation supplements visual classification; it cannot by itself
prove that an object is nonprinted.

## P23: source-safe handwriting box; contract HOLD

Source-supported nonprinted-ink candidate: **[666,1129,747,103]**.
This is a geometry candidate only, not a valid current count_exclusions entry.

The freehand recurrence annotation occupies x=666..1412, y=1129..1231:
an upper, uneven formula-like run with long descending P-like strokes, followed
by a shorter lower run beginning around x=954. The first upper stem at x=666
extends through y=1214; a later tall stem begins at x=1165, y=1129. Lower-run
stems at x=1303 and x=1324 reach y=1231.
These irregular strokes are additions, not another typeset formula.

The printed recurrence with label (1) is above the box. The printed short
sentence at the annotation's upper-run height is wholly to its left.
The following full-width proof row begins below the handwriting envelope.
The native crop shows all ink inside the proposed rectangle as handwriting,
including its descending strokes, and no printed glyph inside that rectangle.
The exact threshold-ink envelope equals the box: 11,604 ink pixels.
No component touched by the box crosses its boundary.

The stored machine layout assigns y=1078..1181 and y=1182..1285 to only two
bands across the printed formula, short sentence, and next proof row. The
handwritten stems and lower continuation occupy the intervening whitespace
and contaminate that vertical projection. This supports handwritten
row-connection/interference, not a missing printed sentence.
No handwritten-mask recount or count override was performed for p23.

HOLD for use by current tooling: counting_ink only accepts `scan-artifact`
in specified page margins, or a thin `separator-rule`. This interior box
fails the former's margin test and is not a separator. An in-memory contract
check returned `scan-artifact must be in the page-edge area without body text`
(translated diagnostic). No alternate kind was invented and no tool changed.

## P24: genuine HOLD; no exclusion box

The freehand working beside exercises 33/34 forms several uneven rows beneath
exercise 33's first printed row and above exercise 34's printed product.
Its lower strokes reach y=2062, around x=827. The annotation spreads roughly
across x=756..1194 and produces both extra projection material and row bridges.
The stored layout divides y=1809..2143 into five adjacent bands; handwriting
occupies the otherwise unprinted spaces among the lower exercise rows.

The native crop also reveals an upper pen stroke joined to a printed glyph
in exercise 33's first row. The unchanged four-connected ink component spans
x=1097..1153, y=1824..1921 (1,180 ink pixels), combining printed upper glyph
ink with the descending handwritten addition.
Another tall freehand component spans x=899..945, y=1846..1922 and lies
immediately beside the preceding printed material.

A rectangle enclosing the entire annotation would erase printed content.
The joined upper tip cannot be separated confidently within this image
budget. Therefore **candidate exclusions are empty**. No partial rectangle
is represented as a complete correction, no printed glyph is removed, and no
mask/count workaround is proposed. The supplied p24=24 observation is retained;
it is not used to justify an unsafe exclusion.

## P33: 24 actual printed rows; extra band is scan-edge ink

Source-supported nonprinted-ink candidate: **[0,2304,1564,66]**.
It covers the bottom-edge irregular scan/debris band, not a handwritten answer.
Its physical cause is UNKNOWN; its nonprinted status is clear from the source.

Source-first printed-row inventory, in page order:

1. Continued exercise 60: option b, twelve-sided polygon.
2. Option v, twenty-five-sided polygon.
3. Option g, n-sided polygon, n >= 3.
4. Exercise 61: first printed question row.
5. Exercise 61: second printed question row.
6. Exercise 62: first printed question row.
7. Exercise 62: second printed question row.
8. Section 7 heading.
9. Previous section's combination-value table: first prose row.
10. Row numbering by nonnegative integers: second prose row.
11. Row n has n+1 entries: third prose row.
12. Single displayed sequence of combination coefficients.
13. Pascal-triangle naming paragraph: first prose row.
14. French mathematician/name/dates and footnote marker: second prose row.
15. Symmetry paragraph referring to printed page 24: first prose row.
16. Equal-distance entries and example introduction: second prose row.
17. Single displayed numerical symmetry example.
18. General rule for n and m: first prose row.
19. Second prose row introducing the equation.
20. Single displayed symmetry identity with label (1).
21. Proof-introduction sentence.
22. Translator footnote: first printed row.
23. Translator footnote: second printed row.
24. Decorated printed folio 26.

The independently counted 24 rows all have corresponding MD rows.
No printed-row omission was found in the inspected p33 MD. Superscripts,
subscripts, the printed footnote separator, and handwritten/debris marks are
not additional printed text rows.

The footnote-right native crop shows an isolated freehand vertical stroke
at x=1610..1621, y=2015..2059, plus a tiny dot at x=1617..1621, y=2095..2101.
These marks are well right of the printed footnote endpoint (the last printed
component in this crop ends at x=1378). They are nonprinted, but the stored
layout does not assign them a separate band. They are not the 25th-row cause
and no removal of them is needed for this candidate.

The bottom candidate has 17,701 threshold-ink pixels; its exact ink envelope
is [0,2304,1564,66]. It contains disconnected debris and an irregular, broad,
edge-following dark strip rising/falling across the page bottom. There is no
text, folio, diagram, or printed rule inside it. The last printed row ends
around y=2171, leaving more than 130 source-pixel rows before this box.
No component touched by the original broader y>=2300 investigation rectangle
crossed that rectangle; tightening to the exact ink envelope removes no other
ink. The bottom box is within the counting contract's bottom 5% margin.
The printed footnote separator is retained, not proposed as NONPRINTED ink.

Read-only diagnostic using the hash-bound, unchanged counting_ink/line_bands:
original content_width=1622; 25 bands before, 24 after excluding this box.
The only removed band is **[2330,2368]**; no band was added or otherwise changed.
This was an in-memory test, not a finalize run, canonical edit, or manual count
override. The source-derived count preceded and agrees with this diagnostic.

Valid current-contract candidate, not applied:

```json
{
  "kind": "scan-artifact",
  "box": [0, 2304, 1564, 66],
  "reason": "Source-inspected nonprinted bottom-edge debris/scan strip; below the printed folio and all footnote text; contains no printed content."
}
```

## Image ledger and SHA bindings

Exactly **6 images total**, one batch: 3 full sources + 3 native crops.
All sources were displayed once; every crop was displayed once, in memory
only. Crops were produced by Pillow crop/save with no geometric or tonal
change. They were not saved to disk. Crop PNG byte hashes below bind the
displayed payloads; parent SHA plus box also binds their source pixels.

| Read | Image / native crop box | SHA-256 |
|---|---|---|
| 1 | `.tmp/ld-s10y-lesson/9c/pages/0023/page.png`, full | `ad028bd06fb23c0a994b1ed92c5516141c1ffe7b2b126c912be91e7c2c7a9b91` |
| 2 | `.tmp/ld-s10y-lesson/9c/pages/0024/page.png`, full | `f49f7f171441b5a813428e80703e7dd67ef0ebd4842ed98aae65d2311d48aa6c` |
| 3 | `.tmp/ld-s10y-lesson/9c/pages/0033/page.png`, full | `c28bb5974ca47250d2a2dc546abad5bc94844dc8c4e26893dbf7579f020e207b` |
| 4 | p23 crop [620,1100,830,210] | `86d31c81f981eef998419e7e658a9271fc3d4a8c45e5a6d61e351451a8e24093` |
| 5 | p24 crop [720,1820,510,330] | `429569fd58114ecc3a9a1d8f40c16fb21e792df135cd179ef52d840725e66bc2` |
| 6 | p33 crop [1310,1960,340,180] | `a84a70016385a05f5848d3fe37c9bd7f4b80603d6dd268aa8ab6aa1a27cb3c39` |

All three source hashes matched the user's expected hashes.

Text/tool bindings at inspection:

| Path | SHA-256 |
|---|---|
| `.agents/skills/ld-s10y-image/SKILL.md` | `d31ecbea164b4c5c0ac781146976f50381466ae4a8931486bdb2e92e29015747` |
| `.claude/skills/ld-s10y-lesson/tools/layout.py` | `d455a186573f41026425eb66317ee3d79c5370bde9bd312e8e2b8a795b9abb03` |
| `.claude/skills/ld-s10y-lesson/tools/p2c.py` | `4fbc5398925171d4b0d56e15c1c5ed8d3dbc13f74b5116018a134391f952d9f0` |
| `.tmp/ld-s10y-lesson/9c/pages/0023/layout.json` | `27b5920089df897472715efb8ff608ddc0ff2bf4717b6d76a17893cdfb71e64f` |
| `.tmp/ld-s10y-lesson/9c/pages/0024/layout.json` | `9793dc983ba092f2f3d66c9c1adb3e60be8b6d692227958fc0560b1357978f29` |
| `.tmp/ld-s10y-lesson/9c/pages/0033/layout.json` | `81112c4ad3f0e131801bfb558b3b85452a5df1e8e1d8d743d6c28453470f5c5d` |
| `ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0033/page.md` | `b97ae0a54e387ae24c44e6104747c813079e301762cb3ece958fd10052a30ef0` |

Conclusions are bound to these bytes. They do not authorize editing the
counting contract, masking printed ink, or accepting/publishing a page.
