# Independent Transcription Review 005

Date: 2026-11-15.

Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Scope: **6-8g physical pages 27-30 only**, printed pages 17-20.

## Method and Boundaries

Read `.claude/skills/ld-s10y-lesson/SKILL.md` cap1. Viewed each actual full source image, then read its durable Markdown, strictly in this order:

1. `.tmp/ld-s10y-lesson/6-8g/pages/0027/page.png`, then `ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0027/page.md`.
2. `.tmp/ld-s10y-lesson/6-8g/pages/0028/page.png`, then the corresponding durable `0028/page.md`.
3. `.tmp/ld-s10y-lesson/6-8g/pages/0029/page.png`, then the corresponding durable `0029/page.md`.
4. `.tmp/ld-s10y-lesson/6-8g/pages/0030/page.png`, then the corresponding durable `0030/page.md`.

All paths in this report are relative to the root above unless explicitly absolute.

No montage, OCR, network access, pipeline run, product edit, or revert. Did not inspect modern editions, choices, answers, tests, or `.env`. Did not use another review or a generated audit as evidence.

Additional evidence consists solely of separate, direct-source PNG crops saved in `.tmp/ld-s10y-lesson/transcription-review-005/`. Cropped with `sips`, without resizing, OCR, redrawing, or cleanup. Viewed each of the seven figure-box crops separately. These are source-box checks, not claims about assembled or rendered downstream artifacts.

Only this report and those optional source crops were written.

## Findings

### F1: Confirmed Prose Substitution, Page 27

Location: durable `0027/page.md:93`, source row 16, axiom 9.

- Source: `空的子集合，使得点O在分别属于两个子集合的任意`
- Markdown: `空的子集合，使得点$O$在分别属于两个点集的任意`
- Specifically, source **`两个子集合`** became **`两个点集`**.
- The direct source crop `p0027-axiom9.png` clearly contains `子集合`; this is not an uncertain damaged character, a formula normalization, or a line-wrap difference.
- Outcome: **FAIL** for the reviewed page-27 Markdown hash. Matching row counts do not make this transcription source-faithful.

### F2: Raised Exercise Marker Glyph Not Fully Established, Page 28

Locations: durable `0028/page.md:66` and `:75`, exercises 49 and 51.

- Each source number has a baseline period and a visibly solid, raised round mark.
- Markdown retains the baseline period and adds `°` (U+00B0, degree sign): `49.°` and `51.°`.
- Direct crops `p0028-ex49.png` and `p0028-ex51.png` show the raised marks separately from the baseline punctuation.
- The presence and placement of the extra marker are preserved. Its literal visible solid-dot appearance is not the hollow-ring appearance of `°`.
- A scan can fill the interior of a printed ring. These pixels alone do **not** prove whether the original type was deliberately a solid dot or an ink-filled degree-like ring. No semantic interpretation of the marker is inferred.
- Outcome: **HOLD for literal printed-glyph fidelity**, not a claimed mathematical error or a proven intended-codepoint substitution. No unqualified source-faithful PASS for this hash.

### F3: Printed Term Underline Not Represented, Page 30

Location: durable `0030/page.md:82`, source row 14.

- Source `单位线段` has a clear wavy underline.
- Markdown contains plain `单位线段`, without marking or noting the underline.
- Direct crop `p0030-unit-segment.png` shows the entire underline under this term. This is not figure interior, scan-edge noise, or a separate prose row.
- The wording and mathematics of this passage match; this finding concerns the requested printed-mark comparison, not missing prose.
- Outcome: **HOLD for preservation of this printed emphasis mark**. No unqualified full printed-mark PASS for this hash.

No additional wording or mathematical-content discrepancies were found on pages 28-30. Neither HOLD finding is conflated with F1's confirmed prose error.

## Hash-Bound Outcomes

The following SHA-256 values were calculated from the actual files, initially during each page review and again after the four-page comparison. All eight values were unchanged. Each actual image hash also matches that page's `render.sha256`.

| Physical / Printed Page | Independent Rows | MD Logical Rows | `printed_lines` | Outcome |
|---|---:|---:|---:|---|
| 27 / 17 | 22 | 22 | 22 | FAIL: F1 |
| 28 / 18 | 22 | 22 | 22 | HOLD: F2; prose/math/rows otherwise match |
| 29 / 19 | 24 | 24 | 24 | PASS for the exact source/MD pair below |
| 30 / 20 | 20 | 20 | 20 | HOLD: F3; prose/math/rows otherwise match |
| Total | **88** | **88** | **88** | No overall PASS |

```text
0027 source page.png
9119b0bd821031438f6a41eda3c4ea609b873d7c37c987cd093bb3e5f139c136
0027 durable page.md
c01869a17d60312aef0b1781c3d26194908b690404235997e9cbe490f823993c

0028 source page.png
a41b74af9011e8a93ba4d3fecae5e1e5ab9fbc5b3f5f70908a867ae46e3d551e
0028 durable page.md
7dfc96466b91fc900a96eae139af65d093adbaf1df388c1f1342f8cd1c6d65a6

0029 source page.png
3d1c1187cd0451e1ea6cd893ef391c90d68fe35ce07773dc4afd4188801494a7
0029 durable page.md
c9261cba3ca3b941e55d642a8aee90461768511b452187ae628dd3ceaa5e3c05

0030 source page.png
8a6724353e27b088d542c76ca0a44e0ef18a00244ff76cb7371d2fa0c8530528
0030 durable page.md
fcc6cb2ce1b85decb2c5f12ecf645e9e1aacb2c7bc9998bc5a1d73fe31577b9e
```

The PDF and profile hashes appearing in frontmatter were not independently verified; they are not the evidence hashes used for these outcomes. A changed Markdown or image hash requires a new review, not transfer of the page-29 PASS.

## Independent Source Row Ledger

Counted visible, independent printed text rows, not connected-component bands or Markdown file-line totals. Included captions and the printed-page footer. Excluded complete figure interiors and scan noise. Side-by-side captions count once; side-by-side subquestions on a single visual row count once.

Ledger text records source wording and visual row boundaries. Plain mathematical notation is used for readability; `[raised mark]` describes the observed source mark without guessing its intended Unicode character. The Markdown line references are physical file lines, not row counts.

### Physical Page 27 / Printed Page 17

| Row | Actual Source Text Row | MD Line |
|---:|---|---:|
| 01 | 点A和B叫做线段AB的端点，而距离\|AB\|称为线段 | 65 |
| 02 | \|AB\|的长度．在线段两个端点之间的点叫做线段的内点．例 | 66 |
| 03 | 如，点X和M（参看图15，а）是线段AB的内点． | 67 |
| 04 | 线段AB的所有内点都属于直线AB．因此，线段AB是 | 70 |
| 05 | 直线AB的子集，即[AB]⊂(AB)（图15，б）．也可以说，直线 | 71 |
| 06 | AB包含线段AB，或者说，线段AB在直线AB上． | 72 |
| 07 | 2. 你们知道，任一直线上的每一点都可以作为两条射线 | 75 |
| 08 | 的端点．现在，我们仅利用基本的几何概念以及已经定义的 | 76 |
| 09 | 概念来说明“射线”这一概念的意义． | 77 |
| 10 | 图16 | 83 |
| 11 | 在水平直线p上（图16），有的点在点O的右边，有的点 | 86 |
| 12 | 在它的左边．可以指出的是，如果直线p的一点在点O的右 | 87 |
| 13 | 边，而另外有一点在它的左边，那么点O在这两点之间．例 | 88 |
| 14 | 如，点O在M和N，P和Q，等等两点之间．一般地说， | 89 |
| 15 | 9 直线p上任一点O把直线上的除O以外的点分成两个非 | 92 |
| 16 | 空的子集合，使得点O在分别属于两个子集合的任意 | 93; F1 |
| 17 | 两点之间． | 94 |
| 18 | 每一个集合和点O的并集，叫做以O为始点的射线． | 97 |
| 19 | 给出一个射线时，应当指出它的始点和射线上除始点以 | 100 |
| 20 | 外的任意一点．例如，图17上的射线AB也可以叫做射线 | 101 |
| 21 | 图17 / 图18, same visual row | 110 + 113 |
| 22 | · 17 · | 116 |

Excluded: top black scan-edge strip and thin page-edge marks; all figure-16/17/18 interiors. The vertical black bar beside axiom 9 is a structural rule, not an extra text row; the `9` shares row 15. Caption rows are outside figure boxes.

Block arithmetic: `3 + 3 + 3 + 1 + 4 + 3 + 1 + 2 + 1 + 1 = 22`.

### Physical Page 28 / Printed Page 18

| Row | Actual Source Text Row | MD Line |
|---:|---|---:|
| 01 | AC，或者AD，等等．因此，在射线AB的图上一般不特别标 | 45 |
| 02 | 出点B（图18）． | 46 |
| 03 | 以A为始点且包含点B的射线，记作[AB)．射线AB是 | 49 |
| 04 | 直线AB的子集，即[AB)⊂(AB)． | 50 |
| 05 | 问题和习题 | 53 |
| 06 | 48. 用符号∈和∉写出图19上标出的点中哪些属于线段 | 56 |
| 07 | AB，哪些不属于线段AB． | 57 |
| 08 | 图19 | 63 |
| 09 | 49.[raised mark] 点A和C的距离等于10cm．如果1) \|AB\|=7cm，\|BC\| | 66, part 1 |
| 10 | =3cm；2) \|AB\|=2cm，\|BC\|=9cm；3) \|AB\|= | 66, part 2 |
| 11 | 6.5cm，\|BC\|=3.5cm；4) \|AB\|=\|BC\|，点B属于线段 | 66, part 3 |
| 12 | AC吗？ | 66, part 4 |
| 13 | 50. 在下列条件下A、B和C三点属于同一线段吗？ | 69 |
| 14 | 1) \|AB\|=5cm，\|AC\|=4cm，\|BC\|=6cm； | 70 |
| 15 | 2) \|AB\|=5cm，\|AC\|=3cm，\|BC\|=2cm； | 71 |
| 16 | 3) \|AB\|=5cm，\|AC\|=7cm，\|BC\|=2cm． | 72 |
| 17 | 51.[raised mark] 1) 两条线段可以只有一个公共点吗？ | 75 |
| 18 | 2) 两条线段可以只有两个公共点吗？ | 76 |
| 19 | 52. 已知A、B、C和D是四个不同的点．两个端点属于下列 | 79 |
| 20 | 图形的不同线段有多少条？ | 80 |
| 21 | 1) {A,B,C}；2) {A,B,C,D}． | 81 |
| 22 | · 18 · | 84 |

Excluded: top black scan-edge strip, thin page-edge marks and isolated right-edge scan speck; separator rule above `问题和习题`; complete figure-19 interior. The separator is not prose.

Block arithmetic: `2 + 2 + 1 + 2 + 1 + 4 + 4 + 2 + 3 + 1 = 22`.

**Exercise 49 wrap verification:** durable file line 66 is one storage line with exactly three `↵` markers, hence four logical printed rows. The markers occur at the three actual visual breaks:

```text
$|BC|↵=3\mathrm{cm}$
$|AB|=↵6.5\mathrm{cm}$
线段↵$AC$吗？
```

The first two markers keep formulas complete inside their existing `$...$` pairs while preserving splits across visual rows. The third preserves the final prose/formula boundary. All four cases, the initial 10cm distance, and the question are present. There is no missing equation, invented wrap, or one-row interpretation of this exercise.

### Physical Page 29 / Printed Page 19

| Row | Actual Source Text Row | MD Line |
|---:|---|---:|
| 01 | 53. 点X是线段AB的内点．证明： | 45 |
| 02 | 1) \|AX\|<\|AB\|；2) \|AB\|>\|BX\|． | 46 |
| 03 | 54.* 1) 说出线段中点的定义． | 49 |
| 04 | 2) 在长为18cm的线段CD上作点A，使得\|CA\|=4cm． | 50 |
| 05 | 计算下列每两条线段中点的距离： | 51 |
| 06 | а) CD和CA；б) CD和AD；в) CA和AD． | 52 |
| 07 | 55. 在图20中的直线a上标出了点M、A、B．在这个图上指 | 55 |
| 08 | 出满足下列条件的点X组成的图形： | 56 |
| 09 | 图20 | 62 |
| 10 | 1) 点A在点M和X之间； | 65 |
| 11 | 2) 点B在点M和X之间； | 66 |
| 12 | 3) 点X在点M和A之间． | 67 |
| 13 | 56. 用规定的符号写出： | 70 |
| 14 | 1) 点M属于射线OA；2) 线段OA是射线AB的子集； | 71 |
| 15 | 3) 射线OB是射线AB的子集； | 72 |
| 16 | 4) 线段CD是直线CD的子集． | 73 |
| 17 | 57. 1) 射线AB和BA的交集是什么图形？ | 76 |
| 18 | 2) 同一直线上的两条射线的交集是什么图形？ | 77 |
| 19 | 3) 同一直线上的两条射线的并集是什么图形？ | 78 |
| 20 | 58. 已知两射线AB和BA，点M在其中一条射线上而且和A | 81 |
| 21 | 与B是不同的点．就下列情况分别说出哪一条射线包含 | 82 |
| 22 | M点： | 83 |
| 23 | 1) \|AB\|+\|BM\|=\|AM\|；2) \|MA\|+\|AB\|=\|MB\|； | 84 |
| 24 | · 19 · | 87 |

Excluded: top black scan-edge strip and thin page-edge marks; complete figure-20 interior, including its small scanned speck. No prose is hidden by the box. The shared rows at 02, 06, 14, and 23 are not counted as multiple rows.

Block arithmetic: `2 + 4 + 2 + 1 + 3 + 4 + 3 + 4 + 1 = 24`.

### Physical Page 30 / Printed Page 20

| Row | Actual Source Text Row | MD Line |
|---:|---|---:|
| 01 | 3) \|AM\|+\|BM\|=\|AB\|． | 55 |
| 02 | 59. 在定义1) 线段，2) 射线时，用到哪些基本的几何概念？ | 58 |
| 03 | 60.* 证明：如果线段AB的两点属于线段CD，那么这两条线 | 61 |
| 04 | 段在同一直线上． | 62 |
| 05 | 61.* 说明为什么收音机活动天线各节在同一直线上． | 65 |
| 06 | 62.* 证明：如果两个不同的点A和B属于始点为O的一条射 | 68 |
| 07 | 线且又不同于点O，那么或者点A在点O和B之间，或者 | 69 |
| 08 | 点B在点O和A之间． | 70 |
| 09 | 7. 直线上的坐标 | 73 |
| 10 | 1. 当选定度量单位时，距离就可以表示为数．为了方便 | 76 |
| 11 | 起见，通常把这些数本身叫做距离．例如，取\|OE\|为度量单 | 77 |
| 12 | 位时（图21），距离\|XZ\|、\|XY\|和\|YZ\|分别等于3、4和5． | 78 |
| 13 | 我们取某一线段OE的长作为度量单位（这条线段叫做 | 81 |
| 14 | 单位线段）．于是，对于任一距离\|AB\|，都有一个数，即距离 | 82; F3 |
| 15 | \|AB\|在度量单位\|OE\|下的数值，与它对应．这个数也就叫 | 83 |
| 16 | 做距离\|AB\|．但是在实际应用问题中，一定要指出距离的度 | 84 |
| 17 | 量单位（依据问题的性质的不同而取米、厘米等等）． | 85 |
| 18 | 图21 / 图22, same visual row | 94 + 97 |
| 19 | 2. 在射线OA上标出任意一点M（图22，а）．选定度量 | 100 |
| 20 | · 20 · | 103 |

Excluded: top black strip and irregular downward scan-edge patch, thin page-edge marks, isolated right-edge scan speck and tiny bottom speck; separator above section 7; complete figure-21/22 interiors. Figure 22's bracket label, its two panel labels, and its `1` belong to the figure, not independent prose rows. The wavy underline belongs to row 14 and adds no row.

Block arithmetic: `1 + 1 + 2 + 1 + 3 + 1 + 3 + 5 + 1 + 1 + 1 = 20`.

## Complete Original Figures and Box Checks

Each box below is identical in the page's frontmatter and `<!-- fig ... box ... -->` header. Coordinates are source pixels in `[x,y,w,h]` order. Checked both the full original page and the separately viewed direct-source crop using this exact box.

| Page / Figure | Box | Complete Source Contents Checked | Box Result |
|---|---|---|---|
| 27 / 16 | `[478,848,551,72]` | Full straight line, all five point dots and labels P, M, O, N, Q, and lower-right line label p | Complete; caption outside |
| 27 / 17 | `[238,1702,498,167]` | Entire ascending ray drawing, A/D/B/C labels and dots, continuation beyond C | Complete; caption outside |
| 27 / 18 | `[782,1730,459,93]` | A label and start dot, full rising ray, B label at the unmarked far end | Complete; absence of a B dot is original |
| 28 / 19 | `[474,750,531,150]` | Segment A-L-E-B; above-segment C, off-segment D, below-segment M; all dots and labels | Complete; caption outside |
| 29 / 20 | `[459,781,561,103]` | Full sloping straight line, lower-left a, point dots and labels M/A/B | Complete; caption outside |
| 30 / 21 | `[236,1403,266,371]` | Triangle X/Y/Z, all side division ticks, separate OE unit segment with both labels and endpoint strokes | Complete; unit segment not omitted |
| 30 / 22 | `[588,1434,647,335]` | Both stacked panels; upper O/E/M/A ray and coordinate bracket/label; lower P-to-M line with B/O/E/A, every tick and `1`; internal а)/б) labels | Complete; one multipanel figure, caption outside |

There is no overlap between figure boxes on the same page. All seven numbered figures have their proper separate caption blocks. Page 27's figure-17/18 captions share one source row and correctly use `cap 图 18 samerow`. Page 30's figure-21/22 captions likewise use `cap 图 22 samerow`. No additional original unnumbered table or diagram was visible on these four pages.

## Prose, Mathematics, and Structural Markers

- Page 27's opening text is present, including the source's unusual second-line `|AB|` in the segment-length wording. It was not silently changed to `AB`.
- Page 27's `[AB]⊂(AB)` and page 28's `[AB)⊂(AB)` preserve the distinct segment/ray brackets and the printed strict-subset glyph. Membership and nonmembership symbols in exercise 48 are both present.
- Page 27's final `p open` correctly ends mid-object after `射线`; page 28 begins `p cont` with `AC，或者AD`. The observed continuation across these two reviewed pages matches.
- Exercise 49's four conditions and all units are preserved, with the exact visual breaks documented above. Exercises 50-52 retain all values, both questions in 51, and both sets in 52; both sets occupy one actual printed row.
- Page 29 exercise 54 preserves its asterisk, 18cm and 4cm values, and all three same-row subparts. Its subpart markers in Markdown are Cyrillic `а` U+0430, `б` U+0431, and `в` U+0432, as required by cap1.
- Exercise 55 correctly uses `ex 55 open` before figure 20 and `ex 55 cont` after its caption. All three subquestions remain with exercise 55.
- Exercises 53 and 56-58 preserve the inequality directions, point/segment/ray distinction, ordered endpoint names, intersections versus unions, and both printed sum formulas on page 29.
- Page 29's `ex 58 open` matches page 30's `ex 58 cont`, including its third formula `|AM|+|BM|=|AB|`. No blank or invented continuation block occurs.
- Page 30 preserves exercises 59-62 and their asterisks where printed, then the `h3` section-7 heading. The OE, XZ, XY, YZ notation and values 3/4/5 in its prose are unchanged.
- Page 30's final `p open` ends after the actual unfinished phrase `选定度量`. No page 31 was inspected or approved.
- Printed-page numbers 17, 18, 19, and 20 agree with their `foot` blocks. Ordinary font weight, spacing, and facsimile positioning are not treated as separately encoded text; F3 calls out the distinct visible underline rather than attempting to reconstruct font weight.

## Direct Source Crop Provenance

Finding-crop boxes, again in `[x,y,w,h]` order:

| File | Source Physical Page | Crop Box | Actual Crop SHA-256 |
|---|---:|---|---|
| `p0027-axiom9.png` | 27 | `[180,1280,1120,200]` | `7615055c614e42711ecae919eb5900ce32268af28e40a8a56e4f0f4331c6bdc7` |
| `p0028-ex49.png` | 28 | `[145,1020,1150,260]` | `5f46197c05da0e58536b4b6604c133f01a7a86098a3089221622697ea5fbb7c2` |
| `p0028-ex51.png` | 28 | `[145,1565,820,125]` | `686569f0af0d463d1fbe4d29fda7285ab8db4efaaf5b2afab9099a13d2db4a77` |
| `p0030-unit-segment.png` | 30 | `[145,1050,1130,345]` | `5655ba494268ba1989269f287e1d013d5ffc2f0d4af99a87556293e7108094e8` |

Figure-box crop files are `p0027-fig16-box.png`, `p0027-fig17-box.png`, `p0027-fig18-box.png`, `p0028-fig19-box.png`, `p0029-fig20-box.png`, `p0030-fig21-box.png`, and `p0030-fig22-box.png`. Their exact source geometry is recorded in the figure table above.

## Stop

Review complete. No corrections were applied, no broader acceptance was asserted, and no pipeline or downstream work was performed. Only page 29 receives a source-faithful transcription PASS, bound to the exact source and durable Markdown hashes recorded above.
