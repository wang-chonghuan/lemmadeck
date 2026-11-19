# Independent Source Inventory

Frozen source-only batch, 2026-11-19. Root:
`/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck`.
Each original was visually opened exactly once. Total: 2 images, 0 crops,
0 reopens, 0 enhancements. No candidate spec or modern figure was read.
The three requested skill/reference files were read first.

This is not a FigureSpec, candidate approval, promotion review, or source
finalizer. Relevant n5/n6 mathematical context comes only from the user's prose.
The adjacent `inventory.json` is the complete machine-readable frozen inventory.

## Source Hashes

Both observed SHA-256 hashes match the supplied values:

- p28, `ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0028-01.png`,
  1267 x 532:
  `0b34204139b6d55244cc648681351dbc07d7c3301ebefe319bb99e42aace94af`.
- p31, `ssot-resources/soviet10year-textbooks/artifacts/9c/figures/tbl-p0031-01.png`,
  1251 x 521:
  `a7bb6fe27832d572966838281d714fe3efd0c54ce9f5b7de7684a3f86cab4d2f`.

## Counts And Headers

Both have 6 body rows (`n=0..5`), 6 coefficient columns (`m=0..5`),
and 1 header row. The corner header has `m` above/right of a descending
diagonal and `n` below/left: m indexes columns, n indexes rows.
Neither PNG prints the quantity formula, title, or any other heading.

- p28: 7 logical rows x 7 logical columns including the n stub;
  21 coefficient numerals and 15 blank coefficient positions.
- p31: 7 logical rows x 8 logical columns including the n stub and the
  separate rightmost sums column; 21 coefficient numerals, 15 blank coefficient
  positions, 6 sums, and 1 blank sums-header compartment.

These are logical alignments, not individually ruled cell grids.
Including numeric headers and row labels, p28 has 33 numeric labels;
p31 has 39. Each also has the two letter labels m and n.

## Complete Values

The Markdown rules below are reporting aids, not source border transcriptions.
Empty coefficient entries mean no intentional numeral, never a printed zero.

p28, n5 prose: `A_n^m`, all `0 <= m <= n <= 5`.

| n | m=0 | m=1 | m=2 | m=3 | m=4 | m=5 |
|---|---|---|---|---|---|---|
| 0 | 1 | | | | | |
| 1 | 1 | 1 | | | | |
| 2 | 1 | 2 | 2 | | | |
| 3 | 1 | 3 | 6 | 6 | | |
| 4 | 1 | 4 | 12 | 24 | 24 | |
| 5 | 1 | 5 | 20 | 60 | 120 | 120 |

p31, n6 prose: `C_n^m`, all `0 <= m <= n <= 5`.
The final report column below deliberately has no heading.
Its values are row sums over every valid m, according to the supplied prose;
the source itself does not name that column.

| n | m=0 | m=1 | m=2 | m=3 | m=4 | m=5 | |
|---|---|---|---|---|---|---|---|
| 0 | 1 | | | | | | 1 |
| 1 | 1 | 1 | | | | | 2 |
| 2 | 1 | 2 | 1 | | | | 4 |
| 3 | 1 | 3 | 3 | 1 | | | 8 |
| 4 | 1 | 4 | 6 | 4 | 1 | | 16 |
| 5 | 1 | 5 | 10 | 10 | 5 | 1 | 32 |

In each source the complete blank-position set is:
n=0: m=1..5; n=1: m=2..5; n=2: m=3..5;
n=3: m=4..5; n=4: m=5; n=5: none.

## Literal Borders

Neither original has a staircase perimeter or a full rectangular lattice.
Both have a nominal rectangular outer frame, one horizontal header/body rule,
and a vertical n-stub separator. The 21 populated positions form a staircase
through text placement alone. The outer frame includes the upper-right blank
area. No body-row rules or individual m-column rules are visible.

p28 therefore has 2 ruled horizontal bands and 2 vertical compartments:
the n stub and a shared coefficient field. Its stub separator is around
x=155..160; the header rule is around y=145..153. The corner diagonal runs
approximately (26,32) to (154,140), close to but apparently above the
stub/header junction. The outer frame is approximately x=24..1242,
y=28..509.

p31 has 2 ruled horizontal bands and 3 vertical compartments:
the n stub, shared coefficient field, and sums strip. The additional vertical
rule around x=1040 separates that strip through both header and body.
Its top compartment is visibly blank, and its six body sums have no individual
horizontal dividers. It is not an m=6 column. The stub is around x=202..205;
the header rule is around y=133..144. The diagonal runs approximately
(24,19) to (200,101), ending distinctly above the header/body rule rather than
at the bottom-right corner. Outer frame: approximately x=15..1236,
y=15..503. These pixel coordinates are visual estimates, not measured endpoints.

## Uncertainties

All intentional numerical entries and header labels are legible.
In p31's nominally blank n=1,m=2 region, a small slanted ink dash appears
around x=520..530,y=243..246, left of the m=2 text alignment. Its intentionality
is unknown. It is an inventoried ink mark, not an inferred coefficient,
printed zero, deliberate minus sign, or placeholder.

Both scans have uneven/sloped strokes, specks, and small border interruptions,
including broken-looking top-right joins. p31 also has interruptions in the
stub and sums separators. These do not establish intentional border gaps.

## Source Versus Regularization

Straightening/reconnecting rules, aligning type, or adding cell rules would
be modern regularization, not literal source facts. A staircase boundary,
full cell lattice, zero-filled invalid positions, or sums heading must not be
attributed to these pixels. English mathematical m/n headers are permitted;
the p31 sums header remains blank.

Only this temporary report directory was written. No network/model/DB/git,
old-chat/agent access, publishing, figure creation, canonical edits, approval,
or source finalization was performed.
