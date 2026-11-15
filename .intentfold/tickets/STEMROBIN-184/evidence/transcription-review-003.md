# STEMROBIN-184 Independent Transcription Review 003

Date: 2026-11-15. Authorized review only; reviewer did not author these pages.
Scope: physical pages 0019-0023, printed pages 9-13, book 6-8g.

Read cap1 in `.claude/skills/ld-s10y-lesson/SKILL.md`. Opened each full-resolution
1441 x 2079 source `page.png` individually, then compared its durable `page.md`.
Inspected exact declared figure-box crops and additional source crops individually.
No solutions, choices, other reviewers' files, tests, DB, environment, network,
services, or pipeline execution. No source/counter edits. Only this report and
disposable image crops were written. All ten input hashes were rechecked unchanged.

## Result

**Changes required.** One mathematical sign error, two wording/order errors,
nine inequality-glyph substitutions, six missing exercise-number periods, and
one cap1 cross-line formula-representation issue. Figures 7-12, captions,
Cyrillic labels, and the inspected cross-page boundaries pass.

Both proposed count-only separator exclusions are legitimate on the reviewed
pixels. Neither is yet present in the reviewed `page.md` frontmatter. Independent
text-row counts: p19 = 26, p20 = 26, p21 = 25, p22 = 21, p23 = 21.
These counts exclude separator rules and figure-internal labels; shared captions
count on their existing text row. No pipeline counter/audit was consulted.

## Actual SHA-256

Paths are relative to `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
PNG root: `.tmp/ld-s10y-lesson/6-8g/pages/`.
MD root: `ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/`.
Every declared `render.sha256` matches its actual PNG hash. PDF/profile hashes
were not independently verified.

| Page | Actual PNG SHA-256 | Actual page.md SHA-256 |
| --- | --- | --- |
| 0019 | `35a0ecef67cda0b47ea30a957abe769f876a6cedc558e19e1a1ed4673676afa2` | `e044235556d07ae9a1f90beacca8a3ee8cd378cfb223007682ee5fd92a655e67` |
| 0020 | `3e9c4ad8e69c683a32626a7cdeae4de7d50e5b3cbac872f8b9207f75eb803ea9` | `b53b4cf589c9bd1f73461b46e9fa65493466f19b2d47666f66526bbf2881763e` |
| 0021 | `367f8dfbbeb735f65719b0a6635c9edb25eabfdb1ee0afdbd329f486aa264704` | `6b6e3fc35fb04c8d7d7cbe9df2dc8c064b575b017681f28b3eddeb8bcb7f596a` |
| 0022 | `346e0e35da01cabf793e94f472fb826bce6389cbe1e0d9224002e89e0bdfede4` | `2120047c1e5f7090d903abeaaf80f584f5f4f5cdc0aab9dc0e9f1e7f3537d822` |
| 0023 | `997285fbcb2a1ab94a1cfbcda98376bd8a482c48aead83d51c6127c85a522518` | `496d873a1535e4612f74f996158dc668469f40fc4c904f22fb9d75463669c8aa` |

## Per-Page Review

### 0019 / Printed 9

- PASS: properties 1-3, their numbers, zero/nonzero and symmetry formulas;
  both 3 cm statements; construction/comparison paragraph; names and sums;
  the basic-properties sentence, paragraph 2, and final introduction to a proof.
  No missing prose or exercise. Printed footer 9 matches. 26 text rows.
- CORRECT L93: printed inequality has a sloping lower stroke, not the horizontal
  lower stroke of `\le`. Use `$|AC|\leqslant|AB|+|BC|$`.
- PASS fig7 `[843,406,333,130]`: entire AB segment, endpoints and A/B labels.
  Caption is outside the box and shares the third row of the 3 cm paragraph;
  `cap 图 7 samerow` is correct.
- PASS fig8 `[861,676,374,495]`: all three arrangements and their A/B/C labels,
  including embedded Cyrillic а), б), в). Caption is outside the box and shares
  the final comparison-paragraph row; `cap 图 8 samerow` is correct.
- PASS boundary: “我们来证明：” is a completed introduction, followed on p20
  by distinct property 4. No dangling paragraph requiring `open/cont`.

### 0020 / Printed 10

- PASS: property 4 and all operands/sign directions; “第三条性质”;
  proof steps and concluding square/star; definition of theorem, paragraph
  on axioms, printed “距离公理就是公理”, property 5, and closing sentence.
  Both teaching footnotes are complete, including the square explanation,
  double-star marker, reference to printed page 29, and distinct-points/lines
  wording. Footer 10 matches. No figures/exercises omitted.
- CORRECT inequality glyphs: L36 and L54 `\ge` -> `\geqslant`;
  L42 and L48 `\le` -> `\leqslant`. Their quantities, minus/plus signs,
  and directions otherwise match the scan.
- PASS boundary: final sentence introduces the separately numbered theorem
  on p21; neither it nor the completed footnotes needs `open/cont`.

**Independent row enumeration, performed before reading the MD count:**

| Text rows | Visible content | Approximate row centers, source y |
| --- | --- | --- |
| 1-3 | Property 4, two prose lines and formula | 239, 309, 377 |
| 4-9 | Proof introduction, formula, subtraction sentence, formula, 即, conclusion | 446, 515, 585, 655, 719, 793 |
| 10-12 | Theorem-definition paragraph | 863, 933, 999 |
| 13-17 | Basic concepts/axioms paragraph | 1069, 1138, 1208, 1275, 1347 |
| 18-19 | Example/introduction to property 5 | 1417, 1484 |
| 20-21 | Property 5 including double-star marker | 1550, 1620 |
| 22 | 根据这个公理... sentence | 1690 |
| 23 | First teaching footnote | 1797 |
| 24-25 | Second teaching footnote | 1846, 1893 |
| 26 | Printed footer | 1960 |

**Exclusion verdict: APPROVE** `{kind:"separator-rule",box:[100,1743,1200,12]}`
for counting only, with a pixel-based reason. Box spans x100-1299/y1743-1754.
Black ink (<128) inside it is confined to x139-561/y1745-1752, forming the
thin, slightly sloping footnote separator. There are no characters in the strip;
the preceding sentence/underline and following footnote are outside it.
The rule is not a 27th printed text row. The box is wider than necessary but
legitimate, not a mask for text or a way to force an expected count.

### 0021 / Printed 11

- PASS: theorem 6; entire proof, M/N, Latin line names a/b, contradiction with
  proposition 5, and concluding square. Exercise heading and footer 11 match.
  Exercise 26's 5/7/1 dm, unit alternatives and numbering match. Exercise 27's
  8/4 cm and choices 20, 4.5, 12, 4, 3, 6 cm match. 25 text rows.
- CORRECT ex28 L76-77: source is `上一任意` / `点，...`; MD has `上任意` /
  `一点，...`. Restore the source order and line boundary: `上一任意` / `点，...`.
- CORRECT ex28 L77: source asks `可能是多大？`, not `可能是多少？`.
  Radius 3 cm, AB = 2 cm, AX and the A/B/C collinearity question otherwise pass.
- CORRECT ex29 L84, а): source clearly prints a **plus** between XY and YZ;
  MD has a minus. Faithful expression is `$|XZ|\leqslant|XY|+|YZ|$`.
  This is a transcription error, not an original-book erratum.
- CORRECT ex29 inequality glyphs: L84 а) and б) `\le` -> `\leqslant`;
  L85 в) `\ge` -> `\geqslant`. The remaining expressions г), д), е),
  operands, punctuation/row grouping, and three classification instructions pass.
- PASS Cyrillic codepoints: ex26 а/б; ex27 and ex29 а/б/в/г/д/е are respectively
  U+0430/0431/0432/0433/0434/0435, not Latin lookalikes.
- PASS fig9 `[771,427,495,129]`: both traced/dashed lines, a/b and M/N labels;
  no proof text or caption inside. `cap 图 9 samerow` correctly shares the
  proof's final “矛盾．square” row.
- PASS `ex 29 open`: p22 begins the same exercise with ж), з), и), к).

### 0022 / Printed 12

- PASS ex29 continuation: ж) `|YZ|>0`; з) `|XZ|-|YZ|>|XY|`;
  и) operands/sum/direction; к) three equal distances. `ex 29 cont` matches
  p21's `open`, with footers transparent. Cyrillic ж/з/и/к are
  U+0436/0437/0438/043A in correct order.
- CORRECT L55 и): `\le` -> `\leqslant`.
- PASS ex30: unusual printed straight-line `|AB|` in part 1 and bare `AB`
  in part 2 are faithfully retained. Ex31's membership/nonmembership symbols
  and TP/TN/AB/CD match. No silent correction to parentheses was made here.
  The metadata's external claim about printed page 462 was not verified;
  that page is outside the authorized source scope.
- PASS wording/numbers of ex32-38, including the questions about common points,
  0/1/2/3 intersections, 1/4/6 lines, n, A_1/A_2/.../A_n and printed “圆”.
  Footer 12 matches. 21 text rows.
- CORRECT exercise-number punctuation at L62/L66/L71/L81/L85/L95:
  each printed 31/32/33/36/37/38 has a baseline period as well as its raised
  circle/star. MD omits all six periods. Retain `31.°`, `32.°`, `33.°`,
  `36.*`, `37.*`, `38.*` (without changing the numeric block IDs).
- PASS fig10 `[157,1384,1062,321]`: complete three arrangements, showing
  the one-/four-/six-line situations. Single whole figure; no overlapping boxes,
  clipped strokes, exercise text or caption. Separate `cap 图 10` is correct.
- PASS boundary: ex38 closes on this page; p23 starts a new numbered title,
  not an exercise continuation.

### 0023 / Printed 13 (Additional Boundary Page)

- PASS title 5, “直线上三点的位置关系．三角形不等式”; all six opening
  prose rows, between-points wording and figure references; definition's
  A/B/X and equation characters; four following prose rows and 1)/2) cases.
  Entire six-row teaching footnote matches, including B between A/D, D between
  B/C, and the final distinction from the geometric definition. Footer 13 matches.
  No exercise or unfinished text object on this page.
- CORRECT cap1 formula representation at L72-73: one printed equation
  continues after `|AX|+` onto the next text row. MD uses two separately delimited
  fragments `$|AX|+$` and `$|XB|=|AB|$`. Record the complete expression with the
  source breakpoint, `$|AX|+↵|XB|=|AB|$`, preserving its two printed rows.
  The operands and equality themselves are not wrong.
- PASS figure-reference Cyrillic: а at L59/L61/L76/L77 is U+0430;
  б at L76/L78 is U+0431.
- PASS fig11 `[269,722,951,293]`: whole ruler and triangle, A/B/C, every
  ruler tick/number 0-7 and embedded а)/б). Caption 图11 lies below, outside
  the figure box, on its own printed row.
- PASS fig12 `[805,1698,446,143]`: complete winding road, transverse line,
  A/B/C/D labels and marked points; no adjacent footnote text or caption.
- PASS `cap 图 12 samerow`: 图12 is horizontally alongside the last footnote
  line “的定义是不一致的．”, not a separate text row. Count = 1 title + 6
  opening prose + 1 fig11 caption + 2 definition + 4 following prose + 6 footnote
  + 1 footer = **21**; fig12 caption shares footnote row 6.
- PASS boundaries: preceding p22 ex38 is complete, this h3 starts a distinct
  object, and this page's final footnote is complete; no missing `open/cont`.

**Exclusion verdict: APPROVE** `{kind:"separator-rule",box:[170,1570,450,12]}`
for counting only, with a pixel-based reason. Box spans x170-619/y1570-1581.
Actual black ink (<128) is x181-600/y1573-1579: a thin footnote separator,
slightly longer to the right than the approximate x180-590 range in the request.
The proposed box includes the entire rule and no text. Preceding “之间．”
and following starred footnote lie outside it. It is not a 22nd printed text row.
The exclusion is absent from the reviewed frontmatter.

## Cropped Source Evidence

All files below are disposable review crops, not new durable content.

![p21 exercise 28 wording](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-003/p0021-ex28.png)

![p21 exercise 29 plus sign and slanted inequalities](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-003/p0021-ex29.png)

![p22 baseline periods with circle markers](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-003/p0022-number-markers-2x.png)

![p22 baseline period with star, exercise 36](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-003/p0022-number36-3x.png)

![p20 separator between prose and footnote](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-003/p0020-rule-context.png)

![p23 separator between prose and footnote](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-003/p0023-rule-context.png)

![p23 footnote and fig12 caption share one row](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-003/p0023-footnote-caption-shared-row.png)

![p23 single equation crossing two printed rows](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-003/p0023-definition.png)

## Repair Confirmation (2026-11-15)

**PASS: all listed repairs confirmed.** This outcome supersedes the initial
“Changes required” verdict for the findings above. Checked only the repaired
lines, exclusion metadata, current MD hashes, and p21 errata against the pixels
already opened during this review. Unchanged content was not re-reviewed;
no source/counter edits or pipeline execution were performed.

| Page | Confirmed repair, current page.md line numbers |
| --- | --- |
| 0019 | L93 uses `\leqslant` in the property-3 formula. |
| 0020 | L48/L66 use `\geqslant`; L54/L60 use `\leqslant`. All four match the previously inspected slanted glyphs. |
| 0021 | L76 ends `上一任意`; L77 begins `点，` and asks `可能是多大？`. L84 а) is `$|XZ|\leqslant|XY|+|YZ|$`, with the printed plus restored; б) uses `\leqslant`, L85 в) uses `\geqslant`. Frontmatter `errata` is `[]`: no invented erratum for the restored plus. |
| 0022 | L55 и) uses `\leqslant`. L62/L66/L71/L81/L85/L95 retain `31.°`, `32.°`, `33.°`, `36.*`, `37.*`, `38.*`, restoring all six baseline periods. |
| 0023 | L84 records one complete `$|AX|+↵|XB|=|AB|$` formula with the breakpoint after the printed plus. |

- PASS p20 exclusion: exactly `separator-rule`, `[100,1743,1200,12]`;
  its reason correctly identifies only x139-561/y1745-1752 separator ink,
  excludes adjacent text, and limits the exclusion to the counting copy.
- PASS p23 exclusion: exactly `separator-rule`, `[170,1570,450,12]`;
  its reason correctly identifies only x181-600/y1573-1579 separator ink,
  excludes adjacent text, and limits the exclusion to the counting copy.
- Current `printed_lines` metadata is **26/26/25/21/21**, matching this review's
  earlier independent pixel counts. This is not a new counter run or an independent
  verification of the user's finalize execution. The earlier confirmed p23
  fig12-caption/last-footnote shared-row interpretation remains applicable.

### Current page.md SHA-256

| Page | SHA-256 |
| --- | --- |
| 0019 | `11acc32fcd83978b0db5b2255ccf148d12e01e35d6b2ce51e7c878e4a4f7e34b` |
| 0020 | `30a70364fea1e8f5e28aeacc5c6224b96663f008eca5f07ffd83c3c79d3ca399` |
| 0021 | `b602dcf2e4efa4a7c05db4ff4610d4d6617644360671dae0ca25305d5e915ab2` |
| 0022 | `f94b3ec85c883c7d5ddd0d27cda22bd80c0a702cc2eb4ac100e5639446212cbe` |
| 0023 | `f1c2e0541e3d442d8338bf90083e33515172ec64f402bc5e736200fa8e9c2eb9` |
