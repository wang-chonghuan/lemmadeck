# Independent Source Review 131-135

Date: 2026-11-15. Reviewer: Codex, independent of the source author.
Scope: 6p physical 131-135 / printed 120-124, source layer only.
Overall result: **NOT PASS**. 131 and 133 require targeted source repairs; 132 and 134 pass this independent page-source review; 135 has faithful visible text but remains **BLOCKED** by its first character-gate failure and unresolved instructional-footnote retention.
This is not assembly, lesson-completeness, modern-edition, vector-gate rerun, or publication approval.

## Findings

### F1: 135 Actual Footnote Markers Remain Mechanically Blocked

At `p0135#3`, line 2 (`page.md:64`, source y approximately 1030), the original prints a circled `①` immediately after the emphasized term. At `p0135#7` (`page.md:77`, source y approximately 1940), the instructional footnote starts with the same actual circled marker. Both were independently seen in the complete original PNG and grid.

Current MD and JSON faithfully contain both markers. The audit records one U+2460 at `p#3` and one at `foot#7`, with `errors = ["白名单外字符 2 处: ①(U+2460), ①(U+2460)"]`. The author's first finalize exit is 1, not PASS. The 18/18 row agreement and fig-118 vector result do not override that failure.

Required handling by main: resolve the genuine character-policy blocker without deleting either source marker, changing the footnote wording, or manufacturing a clean audit. No source-character repair is proposed here.

### F2: 135 Instructional Footnote Must Survive Later Assembly

The complete original footnote is:

> ① “佯谬”一词用来称谓那种出人预料的、与通常观念不符的现象.

Its source rule lies above it, and the printed page number lies below it. It is one instructional row, not a page-number ornament. `p0135#7` preserves the definition separately from page-number block `p0135#8`, and the body reference belongs to the first paragraph of section 54, not the later open paragraph.

The author report and durable notes explicitly report that the current assembler skips `foot` blocks. That downstream mechanism was **not opened or executed** in this review, per the read whitelist. Independently verified facts are the original instructional text, its marker/reference, and its current `foot` classification. The author-declared omission risk remains a blocker for subsequent assembly; a note alone does not establish retention.

Required handling by main: preserve the definition and its reference as section-54 instructional content, while retaining the separate printed page number and the open ending. Do not remove the footnote, append it into the unfinished sentence after “底面”, or claim this batch forms a complete section.

### F3: 133 Two-Column Example Loses Column-Local Formula Continuity

`p0133#5` (`page.md:51-54`, source x approximately 280-1340 / y 750-1000) contains every printed number, but stores the two independent columns as four alternating left/right text rows in one ordinary paragraph. The scan has a vertical divider and a short horizontal rule below the left density datum.

On the source, the right-column calculation continues directly from the multiplication sign at the end of its third horizontal row to `10米` at the start of its fourth row. In the stored paragraph, the fourth row instead begins with the **left-column** `$p$—？`. Plain concatenation of the current lines therefore inserts that left-column unknown into the middle of the right-column calculation:

```text
...千克/米$^3\times$$p$—？    10米...
```

Likewise, the known-data and derivation columns have no structural identities beyond four spaces and a note. Their original divider rules are described by the note, not represented as column structure. This is a **structural/order failure, not a missing number or wrong numerical result**. The independently counted four horizontal rows are correct.

Minimum repair target: only this example unit. Preserve each column's full original content and the uninterrupted right-column calculation, its exact physical line break, and the two original divider relationships using a supported source representation. Retain the density-line period, the left `p` dash/question notation, all digits/units, and all four physical horizontal rows. Do not invent an equal-row table, alter source arithmetic, or change row counters to conceal a representation problem. No replacement source block or tool change was made by this reviewer.

### F4: 131 Missing Source Emphasis

`p0131#3`, line 1 (`page.md:52`, source x approximately 1220-1300 / y 420-460): the original question visibly emphasizes **重量**. MD and JSON currently contain plain `因气体的重量所`.

Minimum repair: mark only the source word `重量` with `**...**`; preserve the question, its two printed lines, and all other text.

### F5: 131 Period Replaced By Comma

`p0131#10`, line 6 (`page.md:82`, source y approximately 1940): the original reads `9.8牛顿. 这就是说`, but MD and JSON read `9.8牛顿，这就是说`.

Minimum repair: restore the halfwidth sentence period and following joining space, leaving the rest of that line and its final `9.8` open continuation unchanged.

### F6: 133 Period Replaces Original Comma

`p0133#15`, line 2 (`page.md:86`, source x approximately 190-270 / y 1940): the original has `接，球胆和玻璃管中装上水`, whereas MD and JSON have `接. 球胆和玻璃管中装上水`.

Minimum repair: replace only `. ` after `接` with the original comma. Keep the two printed exercise lines, label 3, and its `open` boundary.

### F7: 133 First-Line Emphasis Scope

`p0133#1` (`page.md:36`, source x approximately 280-460 / y 210-250): the source distinguishes the heavy-face word `根据` from the following regular-face `公式`. The current `**根据公式**` extends emphasis through both words.

Minimum repair: `**根据**公式`, without changing text, formula order, or the `open`/`cont` chain.

## Per-Page Results And Independently Counted Rows

The original full 1472 x 2161 PNG and its full grid were opened separately for each page, never as a reduced multi-page sheet. Every text region, formula, caption, footer, and all five exact figure crops were actually viewed. Counts below were also counted from the printed horizontal rows; audit PASS was not used as a substitute for source reading.

| Physical / printed | Blocks | Original rows / MD / audit | Figures | Existing finalize | Independent result |
| --- | --- | --- | --- | --- | --- |
| 131 / 120 | 11 | 20 / 20 / 20 | 1 | PASS, author exit 0 | FAIL: F4-F5 |
| 132 / 121 | 14 | 24 / 24 / 24 | 0 | PASS, author exit 0 | PASS within page scope |
| 133 / 122 | 16 | 24 / 24 / 24 | 0 | PASS, author exit 0 | FAIL: F3, F6-F7 |
| 134 / 123 | 12 | 15 / 15 / 15 | 3 | PASS, author exit 0 | PASS within page scope |
| 135 / 124 | 8 | 18 / 18 / 18 | 1 | FIRST FAIL, author exit 1 | Text/crop checked; overall BLOCKED: F1-F2 |
| Total | 61 | 101 / 101 / 101 | 5 | Not all PASS | Not approved as a batch |

Row accounting:

- 131: question heading 1 + two questions 4 + section heading 1 + introductory paragraphs 4 + caption 1 + pressure paragraph 2 + final open paragraph 6 + page number 1 = 20.
- 132: opening continuation 2 + pressure introduction 1 + numerical formula/continuation 2 + derivation prose 3 + variable definitions 2 + three single-line identities 3 + pressure introduction 2 + fractional formula 1 + final identity 1 + emphasized conclusion 3 + direction paragraph 3 + page number 1 = 24. Each high fraction is one physical formula row, not separate numerator and denominator rows.
- 133: opening phrase/formula/unit paragraph 5 + example introduction 2 + two-column example 4 + question heading/questions 6 + exercise heading 1 + exercise rows 5 + page number 1 = 24. Four example horizontal rows are not eight independent physical rows; F3 does not authorize a counter change.
- 134: exercise continuation 2 + shared row of captions 1 + homework heading 1 + homework 1 rows 6 + homework 2 prefix 1 + fig-117 caption 1 + homework 2 continuation 2 + page number 1 = 15. `cap 图 116 samerow` correctly shares the row of `cap 图 115`.
- 135: homework continuation 10 + section heading 1 + first body paragraph 3 + final open body row 1 + figure caption 1 + instructional footnote 1 + page number 1 = 18. The footnote rule is not an extra text row.

132: the original approximately 800000 newtons, 50000 pascals / 50 kilopascals, variable identities, both fractions, the density/height proportionality emphasis, and upward/internal/wall-pressure explanation are present in source order. No source discrepancy found.

134: the 5-kilogram / 1-metre condition and exercise continuation, complete homework 1 instructions and follow-up questions, homework 2 prefix/continuation, all figure references, and the source subfigure letter are present. No source discrepancy found.

135: all ten continuation lines and all follow-up questions were checked, including the original wording `制做`, the two bent submerged tubes, and reference `图117，б`. Section 54, the emphasized term, all three body rows, the final open row, figure caption, complete footnote, and separate page number are present. No additional source transcription discrepancy found; this does not waive F1-F2.

## Object Ownership And Boundaries

- The two opening questions on 131 precede section 53. No claim is made about their external preceding-section identity because page 130 was not read.
- Section 53 starts on 131. Its final body block ends open at `乘以9.8`; 132 begins `p cont` with `牛顿/千克`. The exact within-batch continuation is retained.
- 132 ends a complete paragraph. 133 begins a new `p open` phrase, then a `p cont open` formula and `p cont` unit explanation; this is an internal display-formula continuation, not a continuation from the preceding page.
- Exercise 23 no. 3 starts on 133 and ends open at `在木板上再放一`; 134 begins `ex 3 cont` with `个5千克的砝码`. The exercise closes after `触面积.`.
- Homework no. 2 on 134 uses `ex 2 open`, fig-117/caption, then `ex 2 cont open` ending `打气`; 135 begins `ex 2 cont` with `球.`. All subsequent instructions belong to that same exercise until section 54.
- Fig-114 belongs to section-53 body; fig-115 to exercise-23 no. 3; fig-116 to homework no. 1; fig-117 to homework no. 2; fig-118 to section-54 body. All five printed captions are separate `cap` blocks, not included in the crops.
- Section 54 begins on 135. Its final body block is `p open` ending exactly `但它们的底面`, with the figure/caption/footnotes transparent to continuation. Page 136 was not read, and no external closure is claimed.

There are 12 numbered exercise objects represented by 15 exercise blocks in this span, with the printed question, exercise, and homework headings kept as distinct groups. No answer-key or choice files were opened.

## Exact Crop And Vector Evidence

All five cropped PNGs were independently viewed against their own complete original page/grid. Read-only PIL comparison additionally found each crop byte-pixel equivalent to its source rectangle at threshold 180 plus 12 white pixels on each side; all five differences have an empty bounding box. This checks the crop, not a new SVG rasterization.

| Page / figure | Exact source box [x,y,w,h] | Actual padded PNG size | Independent source-crop observation | Author-recorded vector mismatch |
| --- | --- | --- | --- | --- |
| 131 / 114 | [457,990,643,349] | 667 x 373 | Tank, water marks, h arrow, 4米 dimension, bottom/right extensions complete | 0.000%, PASS |
| 134 / 115 | [345,297,228,433] | 252 x 457 | Stand/clamp, vertical tube, bladder/board, original stacked 5千克 label complete | 0.000%, PASS |
| 134 / 116 | [755,419,582,282] | 606 x 306 | Container/base, all three outlets and arrows, curved jets and receiving tray complete | 0.004%, PASS |
| 134 / 117 | [345,1396,823,402] | 847 x 426 | Both bottle states, original а/б glyphs, four-tube relationships, bent ends, air/water marks, bulbs and far-right downward arrow complete | 0.004%, PASS |
| 135 / 118 | [470,1259,621,489] | 645 x 513 | Three vessel profiles, three balances and 1/2/3, support/base, a/b/c/d and bottom-area glyphs, dashed correspondence and right vertical arrow complete | 0.017%, PASS |

The PNG/SVG hashes and byte sizes match the frozen author report. No standalone vector JSON/stdout reports were found in these five allowed page directories. The table's vector results are the persisted author-report evidence, not an independently rerun vector gate. No renderer, vectorizer, browser, or test was run here.

```text
fig-114.png 10405c879c73804cc0a5bff9f7d7bb6090ee05085414fea86071fb7a8dbbffb6
fig-114.svg c3593be043fef8d838f25060addb3043be60eb7bb5d4fe0cb0f8f9347a6575b1
fig-115.png 359dde9dac76ba26875c7073e7f93e5256954c227239157de58e9a4f48b3f912
fig-115.svg be42e14b858e93bee8260104459d33a56207d8f0c6693ee60e6622cf05ae9364
fig-116.png 9841fdbb95c89262bc5d52d85241e0bd44eb5aad7a610cd7634aaf717e0332f4
fig-116.svg b18d48ae378ee68145f19ce71fee367b68b7de0e4c361a38ad55d4f934385306
fig-117.png 4a505fab84fff7c89224cd2f8fa062b4acb3245db2435d5090a9bdd21aeb517f
fig-117.svg 1d1070cc7814e78798c3331d1057d84ba051901d63ca1bac8c8f17bb2821f7da
fig-118.png a6c2b4cc10eb2afc1a5b87d31800864077cc2c0d2fafaee1e30593063a0f3718
fig-118.svg c3232807ceed818cff7a3bebfcf8b22ae4d61158a7ba25aa18059e91eef9d8b3
```

## Reviewed Identities And Hashes

Workspace root: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Durable root: `ssot-resources/soviet10year-textbooks/artifacts/6p/pages`.
Original/grid/crop root: `.tmp/ld-s10y-lesson/6p/pages`.
All five frontmatter metadata objects equal their respective JSON `meta`; actual PNG dimensions and hashes equal their render metadata. All 15 durable hashes, five original hashes, and ten crop/vector hashes match the author report.

Source PDF identity from the five durable metadata objects: `6-7p 苏联中学课本 物理 六-七年级.pdf`.
PDF SHA-256: `46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0`.
Profile SHA-256 from all five: `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.
The PDF and profile files were not opened or independently rehashed outside the whitelist.
Author report SHA-256: `757279e6eebf2296ab53c6d7a14826b60a239d71c41d8e03b2b626b671b4048f`.

```text
0131 page.md       a910d4894fc49bec4fd2fea4497437146943eab730551295a12e19e2820f98b4
0131 page.json     8e1f2c2159ac2c262e4bef6839c2caa2842dee7d92bf5e88655e6c22a0799d5f
0131 audit.json    2954d327e1055228782687023e751100a9fdff2b8c65ba824b5f49a9b8174842
0131 page.png      ff846003ef52d16f655952b61435c1f566b9ea4bbfef12c4ab5984e345eb4c29
0131 page.grid.png b0dc540073c8caffbf67ded29aec1e7c66997d873ee36ec55b0e1b30ee790188
0132 page.md       1be26f9fae410f0755ae36c5c91c0f9d1f389718f795ff70b6203ab769fc986e
0132 page.json     5969d81c57cb42b72cbf36dccbe0b6ee683e111e236ef4b7be8d2e0ff945c297
0132 audit.json    120565bac1e6d3477e0744d4e2119784d8505b58a91ef5790b8d4bd581ecebc5
0132 page.png      2c5f25c5c1fc4deadecfe934eaaee7fd10f6b79f1ce5218fa8cb18eca187fc2d
0132 page.grid.png 0a05566d0694cc750ac3d694012dd230d66cb89a0d91b9eab8d8f9a3e5ad8811
0133 page.md       9cdda261f0f31ac5baf8bef19ab9bb7787db6c5290c02c9d16af31488434eddd
0133 page.json     74d57c43076ba882b50dbf7ff32b58010661914038168a5b6825d8a5987f2438
0133 audit.json    f3943516d22cb7b9b27d5d4ad01864e79f8f6073716c7bd7766b05dc2b8d15cc
0133 page.png      5f194ab3c2144fa18f21c8dd50b88cb4c559df2d9a04e0c07e7c088b3d913696
0133 page.grid.png 82e418a54820dbb3abe273afc3e1ca6176287b3698cc65d7ddf193c610d2db62
0134 page.md       fef070eb1e50dd30784a673bc7666b64ec6d8d6e3ba3897cadecfbef721bcd12
0134 page.json     c66be088a068b4b1003081c11f4f512e8d0e187035355befa8faa9208c3a5550
0134 audit.json    4da1ed1f5f62d2a4d688f9582dcd9a8a744def7f551335422baa65f8a0fbb05e
0134 page.png      47c20a1ad3898c263f78f45ec65a4b9309e858447c9ceea6f25fd7e0557d5781
0134 page.grid.png 02eebbf3174c5d8ff35eb1aebfb48d9b464cb99ab7acffbb78c6de7c99f96e52
0135 page.md       91029e2b050584db51c9da56829a2e64cf32dcd19f05351fba5849c78b585e5c
0135 page.json     8db1064f9079f5b321d1b1c96e735036239143762e3a23e0a80e4122a187eb46
0135 audit.json    9f917a4d249bd723089a6f79f57efc54b78b69deca0bf5328bb63575e7b7515e
0135 page.png      450725c8269e5a2de292c341ca70409336af17ee0af145bcef3077840eb47069
0135 page.grid.png 52bc089a0224e0fb6ab0f1e3d72c19f9a1aa915323b08aa98385e0cf2845cecd
```

## Failure Preservation And Execution Boundary

135 first-failure directory remains `.tmp/ld-s10y-lesson/6p/pages/0135/failure-01-circled-footnote/`. Its durable MD/JSON/audit and original page/grid/first fig-118 PNG are byte-identical to the reviewed current artifacts. The snapshot and its README were not modified. This report records the first independent source findings; no repair has been performed.

Read-only work used `cat`, `nl`, scoped `rg --files`, `functions.view_image`, and the existing shared Python with `PYTHONDONTWRITEBYTECODE=1` and `-B` for SHA-256, metadata, and PIL crop comparisons. No new environment or dependencies. No tool gates or tests were rerun.

Only this report was written, using `apply_patch`. No source/layout/audit/crop/vector/author/failure files, stable tools, other authored figures, indices, book/lesson artifacts, or source reviews were changed. No pages 126-130 or 136+, answers, choices, modern authoring, Git, DB, services, browsers, user desktop, finalize, vectorize, or assembly actions.

No in-flight command session or task browser/context remains. Stopped for main's smallest authorized repairs and subsequent affected-only recheck.
