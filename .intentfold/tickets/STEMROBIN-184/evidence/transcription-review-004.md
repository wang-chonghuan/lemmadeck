# STEMROBIN-184 Independent Transcription Review 004

Date: 2026-11-15. Scope: ONLY book `6-8g`, physical pages 0024-0026 (printed pages 14-16).

## Verdict

**FAIL: three source-faithfulness defects at three locations.** Page 0024 passes; page 0025 has one wrong Chinese glyph; page 0026 has that wrong glyph again and an omitted pair of distance bars. Independent visual text-row totals are **25 / 26 / 13**, matching the three `printed_lines` values. Figures 13, 14 and 15 pass the source-label, structure and declared-box review.

This is transcription review, not an answer task. No distances were solved, mathematical errata inferred, answer-key or generated-choice artifacts consulted, or modern FigureSpecs used.

## Method And Ownership

- Read `.claude/skills/ld-s10y-lesson/SKILL.md`, especially cap1. Viewed the actual full `page.png` for 0024, then its durable `page.md`; repeated sequentially for 0025 and 0026. No multi-page image montage, grid, template, OCR output, previous review or worker artifact supplied the transcription judgment.
- Compared all visible prose, formulas, strict/slanted inequalities, punctuation, exercise and subpart markers, Cyrillic references, captions and figure contents against source pixels. Enlarged crops are derived directly from these source PNGs.
- Counted actual horizontal text rows visually, excluding figure interiors (including their labels/subfigure tags), separator rules, theorem emphasis bars and scan-edge ink. Separate captions and printed footers count as text. Captions sharing a prose/formula row do not add a row.
- Changes made: this report and scratch crops under `.tmp/ld-s10y-lesson/transcription-review-004/` only. No source edits, counter changes, pipeline commands, tests, environment work, network access, answers, choices or edits to other workers' files.
- Actual SHA-256 values below were obtained with `shasum -a 256`, not copied from frontmatter. Rehashing all six inputs after visual inspection returned the same values.

## Defects

| ID | Durable location | Actual source pixels | Current transcription | Finding |
| --- | --- | --- | --- | --- |
| D1 | `pages/0025/page.md:85`, `ex 47 open` | `用活动键联结的直杆及其长度．` | `用活动铰联结的直杆及其长度．` | The source glyph is **键**, with right component **建**, not **铰**. Preserve the printed wording; do not replace it with a more familiar hinge term. |
| D2 | `pages/0026/page.md:62`, `ex 47 cont`, subpart 1 | `作图表示活动键联结这两种极限情况．` | `作图表示活动铰联结这两种极限情况．` | The same **键 → 铰** substitution recurs on the next page. The enlarged source glyph clearly has **建**, not **交**. |
| D3 | `pages/0026/page.md:63`, `ex 47 cont`, subpart 2 | `2) 距离\|AB\|能不能取所求得的最大距离和最小距离之` | `2) 距离$AB$能不能取所求得的最大距离和最小距离之` | Both vertical distance bars are visibly printed. Faithful math is `$\|AB\|$`, not `$AB$`. |

All durable locations above are relative to:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/`.

Direct source-crop evidence (coordinates are `[x,y,w,h]` in the original 1441 x 2079 PNG; enlargements do not alter source files):

- D1: `[525,1860,265,50]`, nearest-neighbor 6x, [source wording](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0025-joint-word-confirm.png).
- D2: `[540,735,590,55]`, 3x, [source phrase](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-joint-word.png); `[780,737,57,46]`, nearest-neighbor 10x, [individual source glyph](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-joint-glyph.png).
- D3: `[230,795,380,61]`, 4x, [both printed bars](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-ex47-distance-bars.png).

## Page Review

### Physical 0024 / Printed 14

**PASS.** Opening prose, the two printed rows of proposition 7, transition to theorem 8, two theorem rows, complete proof, exercise heading, exercises 39-41 and exercise 42's opening/subpart 1 all match.

- The short `之间．` row is independent of the preceding proposition row; it was not merged or omitted from the visual count.
- The first displayed inequality visibly has a slanted lower stroke and is faithfully `|AC|\leqslant|AB|+|BC|`, not a strict `<` or horizontal-bottom `\leq`.
- Both subsequent strict `<` occurrences, the alternative equality, all distance bars, and the terminal black proof square match.
- The alternative equality breaks after its final `+`; `↵` in `page.md:56` correctly represents the separate `|BC|．` printed row.
- The proof reference is Cyrillic `б` (U+0431), not digit 6 or Latin b. Exercise markers `39.°`, `40.°`, `41.°`, quotation marks and the six-dot ellipsis are retained.
- Exercise 42 is correctly `open`; the visible first subpart has AB/AC/BC lengths 5/3/2 cm and a terminal semicolon. No figure is printed on this page.

### Physical 0025 / Printed 15

**FAIL only at D1.** Otherwise all prose, formulas, units, punctuation and markers match.

- `ex 42 cont` correctly resumes with AB/AC/BC triples 4/6/2 and 5/4/6 cm, with semicolon then period.
- Exercise 43 retains all three formulas, including source `|RP|=|RQ|-|PQ|`; subparts 1 and 2 share one printed row.
- Exercise 44 retains its degree marker, two-row stem and six exact relations: `|AB|+|BC|=|AC|`; `|AC|+|AB|>|BC|`; `|BC|+|AC|>|AB|`; `|AB|+|BC|>|AC|`; `|AC|-|BC|>|AB|`; `|AC|-|AB|=|BC|`. The four printed strict `>` signs in subparts 2-5 are not non-strict signs.
- Exercise 45 retains XY/XZ/YZ triples 9/3/5, 12/6/6, 5/18/12 and 7/8/12 cm, all subpart endings and the following drawing instruction.
- Exercise 46 retains the 2/5 km stem, the four alternatives 2/3/6/8 km, and both numerical subparts. Actual code points in `page.md:79-80` are Cyrillic `а` U+0430, `б` U+0431, `в` U+0432 and `г` U+0433.
- Exercise 47 retains the star and correctly remains `open`; its source word must remain **键** (D1).

### Physical 0026 / Printed 16

**FAIL at D2 and D3.** Otherwise all prose, punctuation, labels and boundary ownership match.

- Figure 14 precedes the continuation and is explicitly bound to exercise 47 by `owner-ex 47`. Its caption does not interrupt the `open`/`cont` pairing.
- Both exercise 47 subparts occupy two rows each. The period after `间的一切中间值．` is actually printed and is correctly preserved, not editorially changed to a question mark.
- New unit `6. 线段和射线` is correctly a separate `h3`, not part of exercise 47.
- The new unit's numbered prose, the printed `象` in `可以象下面这样来定义`, quotation marks, final colon, two-row definition and all AB/A/B references match.
- The reference `图15，а` uses Cyrillic `а` U+0430. Figure 15 and its separate caption belong to the new unit, not exercise 47.

## Original Figures

The following verifies crops from the actual source at the boxes declared in `page.md`, not modern reconstructions or generated answer diagrams. Linked durable figure-image bytes and downstream assembled outputs were not separately audited.

| Figure | Source box `[x,y,w,h]` | Pixel review |
| --- | --- | --- |
| 13, physical 0025 | `[841,793,359,43]` | Complete horizontal line, three point dots and labels **A, B, C**, left to right. Caption `图 13` is outside the box and shares the text row with exercise 44 subpart 4. |
| 14, physical 0026 | `[151,221,1102,314]` | A single box includes **all three** original structures, their point labels, every length and Cyrillic tags **а), б), в)**. Caption `图 14` is below and outside the box. |
| 15, physical 0026 | `[419,1441,557,380]` | Both original panels and tags **а), б)** are included. Upper oblique segment labels are **A, M, X, B** in order; lower horizontal line labels are **A, B**. Caption `图 15` is outside the box. |

Figure 14's full source structures, without solving them:

| Original panel | Visible connections and printed lengths | Labels |
| --- | --- | --- |
| а) | Open two-rod chain: **AC = 5**, **CB = 3**. | A at left endpoint, C at the joint, B at upper endpoint. |
| б) | Closed four-rod outline: **AC = 5**, **CB = 3**, **BD = 2**, **DA = 7**. | A lower left, C upper left, B upper right, D lower right. |
| в) | Tail **AC = 2**, attached to closed outline **CD = 3**, **DB = 3**, **BE = 3**, **EC = 6**. The lower member CE is present; this is not just a three-rod open chain. | A below C, C lower left, D upper left, B upper right, E lower right. |

Source evidence: [figure 13 context](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0025-fig13-context.png), [figure 13 exact box](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0025-fig13-box.png), [figure 14 all three](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-fig14-all-context.png), [figure 14 exact box](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-fig14-box.png), [panel а](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-fig14-a.png), [panel б](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-fig14-be.png), [panel в](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-fig14-ve.png), [figure 15 context](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-fig15-context.png), [figure 15 exact box](/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/transcription-review-004/p0026-fig15-box.png).

## Independent Text-Row Ledger

Row numbering is independently assigned from the pixels, not from a counter or frontmatter. Approximate vertical centers below locate rows in the full source PNG; fractions/formula components are not counted as separate rows.

### Physical 0024: 25 Rows

| Rows | Approximate y centers | Source text group |
| --- | --- | --- |
| 1-2 | 220, 290 | Opening `这两个命题...` / `单地叙述成：` |
| 3-4 | 355, 422 | Proposition 7 main row / separate short `之间．` row |
| 5 | 490 | `利用命题7...` |
| 6-7 | 560, 633 | Theorem 8 / `线，那么距离...` |
| 8-9 | 700, 770 | `证明．设点...` / `由距离的第三条性质得` |
| 10 | 835 | Displayed slanted non-strict inequality |
| 11-12 | 905, 972 | `也就是说...+` / separate `\|BC\|．` |
| 13-16 | 1045, 1115, 1210, 1285 | `但是等式...` / `式成立意味着...` / `B和C...` / final inequality and proof square |
| 17 | 1395 | `问题和习题` |
| 18 | 1465 | Exercise 39 |
| 19-20 | 1535, 1605 | Exercise 40 |
| 21-22 | 1675, 1745 | Exercise 41 |
| 23-24 | 1810, 1875 | Exercise 42 stem / subpart 1 |
| 25 | 1948 | Printed footer 14 |

Exclude the separator around y1345 and the top/edge scan ink. Total: **24 non-footer text rows + 1 footer = 25**.

### Physical 0025: 26 Rows

| Rows | Approximate y centers | Source text group |
| --- | --- | --- |
| 1-2 | 225, 296 | Exercise 42 continuation, subparts 2 and 3 |
| 3-5 | 365, 435, 503 | Exercise 43 stem / subparts 1+2 together / subpart 3 |
| 6-7 | 574, 642 | Exercise 44 stem |
| 8-13 | 711, 781, 847, 916, 985, 1054 | Exercise 44 subparts 1-6; **caption 13 shares row 11 (subpart 4)** |
| 14-19 | 1125, 1194, 1264, 1333, 1403, 1474 | Exercise 45 stem, four subparts, final drawing instruction |
| 20-24 | 1543, 1613, 1680, 1751, 1819 | Exercise 46 stem, two rows for subpart 1, two rows for subpart 2 |
| 25 | 1890 | Exercise 47 opening |
| 26 | 1951 | Printed footer 15 |

Figure 13's internal line/labels do not count. Its separately typed caption adds no row because it occupies row 11. Total: **25 non-footer text rows + 1 footer = 26**.

### Physical 0026: 13 Rows

| Rows | Approximate y centers | Source text group |
| --- | --- | --- |
| 1 | 600 | Caption `图 14` |
| 2-3 | 690, 760 | Exercise 47 subpart 1 |
| 4-5 | 829, 897 | Exercise 47 subpart 2 |
| 6 | 1024 | New title `6. 线段和射线` |
| 7-9 | 1094, 1163, 1232 | Numbered paragraph beginning `1. 图15，а...` |
| 10-11 | 1303, 1371 | Definition / `线段AB．` |
| 12 | 1890 | Caption `图 15` |
| 13 | 1958 | Printed footer 16 |

Exclude both figure interiors, the separator around y946 and scan-edge artifacts. Total: **12 non-footer text rows + 1 footer = 13**.

## Actual Input SHA-256

Source root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/6-8g/pages/`

Durable root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/`

| Physical page | Actual source `page.png` SHA-256 | Actual durable `page.md` SHA-256 |
| --- | --- | --- |
| 0024 | `f165caba9657fbe40b2b536a45e8551bbd5fa8d015908e3515d2d0b40c7129bc` | `6be0d7cf541e1cfd8a36020c6313cdc55468f06b4d99a501390f1091d6dedaa1` |
| 0025 | `078ce552aec6114e776077330e694193f9d1e1489080eb8b364e1d29edf7b79f` | `4ae223f7588f5c6b3d5dbce853d87cad32bc4583a7abfbe68bb60772aea7b3ea` |
| 0026 | `14e6d05a5300e6558e67e33f6007c9dfbdd6392d15fe27fd7ca47f06ac6408e9` | `102bbdbb095d154a90eab56dc2ce3cfa5bb58e27cad12f7808f0e78e968bb68d` |

The three actual PNG hashes match their respective `render.sha256` fields. This verdict applies to these exact six input files.
