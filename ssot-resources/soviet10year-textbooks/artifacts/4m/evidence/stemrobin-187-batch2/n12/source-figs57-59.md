# n12 first-four independent source inventory and graph solutions

This source inventory is frozen BEFORE any author inventory, name map, candidate
spec, candidate image, modern template, or parent graph answer is consulted.
The four original PNGs were each inspected exactly once, in the order below.
Current image count at this freeze: 4. No reopen, crop, screenshot, or fig-60.

Active root: `/Users/yong/.codex/worktrees/stemrobin-187-six/lemmadeck`.
All source paths below start with
`ssot-resources/soviet10year-textbooks/artifacts/4m/figures/`.

## Source hashes

| Source | SHA-256 |
| --- | --- |
| fig-57.png | b60f1a6518a007705143cf35ffe986a56bf8a94df652f872b8b9d83280ac67e9 |
| fig-58.png | a96c7d67468e0e8757412e9681a08fc132ad7b8c1f13d9d41d41e67c4b5e4161 |
| tbl-p0048-01.png | ff854c51ec6ab0854f6664abb93e70e0c76e72976765fd5b21e3ee2e79a160ee |
| fig-59.png | ddbd318243ecbfa246b7186abb57ba747b67122b0eb0665a972e90a158ead41b |

The original lesson/exercises hashes used for relevant prose and 171/172 prompts:

- lesson.json: `034ba2d11e980ecca27c3f434c9303bce2b3597d2f360cc5638a97d3a7e54176`
- exercises.json: `765c89755bb60c191f36f4f5e404f7d4f3bf0216ff1cd8f2a703b9fc8f916fe7`

These canonical non-edition originals are the intended raw 4m source, as already
clarified by the parent. The earlier 18 text-only PASS decisions are reused,
not re-reviewed in this task.

## fig-57: seven-part strip

- One horizontal rectangular strip, divided into seven intended equal-width
  adjacent cells by six interior vertical separators.
- One row, seven columns; continuous common upper and lower borders.
- Cells 1 and 2 from the left are shaded as the left 2/7 region.
- Cell 3 is blank/unshaded and separates the two shaded regions.
- Cells 4,5,6,7 are shaded as the right 4/7 region.
- Left shading is stippled/short-mark texture; right shading is diagonal
  hatch/short-mark texture. They are visibly distinct patterns, not a uniform
  fill over all six cells.
- No numerical, alphabetic, fraction, or comparison label is printed inside
  the source strip. No extra cells, ticks, arrows, or points.
- The associated prose supplies 2/7 < 4/7; a question figure need not add that
  comparison as an answer-bearing annotation.
- Idealizing uneven scanned strokes into a regular seven-cell rectangle is a
  justified modern regularization, not an additional source fact.

Required candidate evidence: exact 7-by-1 lattice, seven equal cells, left two
and right four shaded with blank third cell, common frame, and separately
identified texture/color modernization if the raster texture is not retained.

## fig-58: one shared number-ray frame and contextual scene

- One rightward horizontal number line on a blackboard, not separate frames
  for the fractions and whole numbers.
- Visible labeled anchors, in order: 0, 2/7, 4/7, 1, 3.
- Between 0 and 1 there are seven equal intended intervals, with ticks at
  0,1/7,2/7,3/7,4/7,5/7,6/7,1.
- There is one further unlabeled whole-unit tick between 1 and 3, at 2.
  The source does NOT print a clear "2" label at that tick.
- Whole-unit spans 0-to-1, 1-to-2 and 2-to-3 are equal; the fractional ticks
  use one seventh of that same unit. In particular 2/7 < 4/7 < 1 < 3.
- The line extends rightward past 3; its rightward direction follows the
  lesson's number-ray prose. The faint scan endpoint is not relied upon as
  proof of a particular arrowhead design.
- Source scene also contains the black rectangular board, its bottom ledge,
  and a pupil/teacher-like person standing to its right with an extended hand
  directed toward the board. These are contextual illustration, not extra
  mathematical points, ticks, or data.
- The source's dark board and old illustration style are not a requirement
  for modern mathematical rendering; any omission/replacement should be
  explicitly classified as contextual modernization.
- No comparison symbol, colored answer point, or extra queried value is drawn.

Required candidate evidence: one common ray, fractional and integer scale
relationships, labeled 0/2/7/4/7/1/3, unlabeled tick at 2, and executable
coverage of every mapped tick/anchor. Any newly labeled 2, caption, or other
label must be identified as a modern addition, not falsely attributed to the
source.

## tbl-p0048-01: complete source roster and row identity

The source has two adjacent three-column panels within one common table frame.
Each panel has one header band and three data positions. The left panel holds
pupils 1-3, the right panel holds pupils 4-6.

Repeated source headings are student number, name, and height (centimeters).
The source Chinese headings are 学号, 姓名, 身高（厘米）.
There are six column tracks total, a central panel divider, top/bottom borders,
and a horizontal line separating the header from data. Data rows are spaced
but do not have individual full horizontal separators in the source.
The number columns are narrower than the name/height columns.

Independent source row inventory (Chinese text records source pixels only):

| Source pupil number | Source name read from pixels | Height | Unit | Position |
| --- | --- | --- | --- | --- |
| 1 | 阿克谢诺夫 | 124 | cm | left panel, first data position |
| 2 | 包利索夫 | 135 | cm | left panel, second data position |
| 3 | 沃洛金娜 | 127 | cm | left panel, third data position |
| 4 | 格利申 | 123 | cm | right panel, first data position |
| 5 | 杰米娜 | 136 | cm | right panel, second data position |
| 6 | 彼得洛娃 | 141 | cm | right panel, third data position |

Names must be translated/replaced through the approved row-bound mapping,
not guessed from the sorted heights. A spelling discrepancy in source-name
transcription does not authorize moving a pupil between numbered rows.
Learner-visible labels must be English only; sourceName must not leak into
the candidate image.

Required candidate evidence: exactly six pupil rows preserving numbered
identity, height and cm unit, repeated three-column headings, both panels,
all original values and source-bound row relationships. No sorting,
highlighting, rank labels, or color that reveals the requested order.
New regular row separators may be modernization but must not remove a row,
merge identities, or be called an original raster feature.

## Independent 171 solution, before English name mapping

The task asks the pupil names in increasing and decreasing height order,
orally ("say their names").

- Increasing heights: 123 < 124 < 127 < 135 < 136 < 141 cm.
  Source pupil numbers: 4,1,3,2,5,6.
  Source name order: 格利申, 阿克谢诺夫, 沃洛金娜, 包利索夫, 杰米娜, 彼得洛娃.
- Decreasing heights: 141 > 136 > 135 > 127 > 124 > 123 cm.
  Source pupil numbers: 6,5,2,3,1,4.
  Source name order: 彼得洛娃, 杰米娜, 包利索夫, 沃洛金娜, 阿克谢诺夫, 格利申.
- No equal heights/ties. Preserve the a/b task order and the spoken roster
  requirement. The complete oral task is appropriately ungraded, with both
  standard name sequences displayed.

The later English answer must be obtained by applying the approved name map
to these independently frozen numbered sequences, not by deriving source
facts from the author table or answer key.

## fig-59: exact grid, all source points, shading and relationships

One axis-aligned rectangle contains three equal columns and two equal rows.
The six unit cells are uniformly hatched/shaded. There are no diagonals.
The outer shape is a 3-by-2 rectangle, not a square.

Use a source-normalized unit lattice with x increasing right and y up:

| Point | (x,y) | Source position |
| --- | --- | --- |
| A | (0,2) | upper left corner |
| B | (1,2) | top, first interior vertical |
| C | (2,2) | top, second interior vertical |
| D | (3,2) | upper right corner |
| M | (0,1) | middle, left border |
| K | (1,1) | middle, first interior vertical |
| P | (2,1) | middle, second interior vertical |
| T | (3,1) | middle, right border |
| X | (0,0) | lower left corner |
| L | (1,0) | bottom, first interior vertical |
| Y | (2,0) | bottom, second interior vertical |
| E | (3,0) | lower right corner |

Every point lies at its named lattice intersection; all 12 must remain in
the source map and be covered by mapped point-relationship assertions.

Horizontal collinear rows: A-B-C-D, M-K-P-T, X-L-Y-E.
Vertical collinear columns: A-M-X, B-K-L, C-P-Y, D-T-E.
Horizontal and vertical elementary displacements are exactly one unit.
There are nine elementary horizontal segments and eight vertical segments,
17 elementary drawn edges total, along three horizontal and four vertical
supporting lines. The seven full supporting lines include the outer border
and internal B-L, C-Y, M-T lines.

Source visible labels are these 12 Latin letters only. No cell numbers,
lengths, coordinates, square count, congruence group colors, or diagonal loops.
Uniform hatching applies to all six cells and does not distinguish answers.
The source label placement is uneven; regularizing placement for collision
clearance must not move the underlying lattice points.

Required candidate evidence: gridDimensions=3 columns,2 rows; exact same
12 named intersections; all source lines/cells; square aspect ratio for unit
cells; source-faithful uniform shading or explicitly declared neutral texture
modernization; no diagonal edges; complete within-group relationship coverage.

## Independent 172 solution and explicit drawn-edge convention

Count squares whose four sides are already drawn in fig-59. Collinear unit
edges may be joined into a larger drawn side. Do not insert diagonal sides,
and do not count rotated loops formed by mentally connecting grid points.

Six side-one squares, with cyclic perimeter labels:

1. ABKM
2. BCPK
3. CDTP
4. MKLX
5. KPYL
6. PTEY

Two side-two squares, with cyclic perimeter labels:

7. ACYX
8. BDEL

Therefore there are 8 drawn-edge squares. All six side-one squares are
congruent to one another. The two side-two squares are congruent to each
other. A side-one square is not congruent to a side-two square.

This supplies BOTH requested quantities: the total count and the complete
congruence classes. Equivalent cyclic starts or reversed perimeter orders
name the same square. An ungraded complete display answer is appropriate
for the full visual identification/congruence task; an auto count-only key
would omit the second task.

## Independence and limits at freeze

- Original images inspected exactly once: 4.
- Candidate images inspected: 0.
- Author inventory/name map/specs/render reports/parent answers consulted: 0.
- No source-solving based on parent answers or choice files.
- No image inspection outside the four specified originals.
- No browser, screenshots, crops, rendering, paid/model calls, dependencies,
  env/DB/git, agents, messages, or persistent product writes.
- Only NEW files in `.tmp/stemrobin-187/batch2/n12-review-figures-a/` are owned.
- Actual product width, scrolling endpoints, DOM, and full gate2 are outside
  this bounded review and remain parent work.

Do not revise this frozen inventory after author evidence is opened.
