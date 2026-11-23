# N18 Stage A: independent source freeze

Status: SOURCE FROZEN for later comparison; not a publication approval.
Date: 2026-11-23.
Ticket / target: STEMROBIN-184 / ana9-c3-s1-n18.
Sole working directory: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Inputs and exposure

- First source image: `.tmp/stemrobin-184-six/n18-nov23-source71/prepared/9c/pages/0071/page.png`, original, uncropped, without a grid.
- Supplied dimensions: 1695 x 2381.
- SHA-256 independently checked before opening: `4b95e479cc416ad7ee6ec88bcb889fc6d810c4580f9f979778faef4988926cfb`; matches the supplied binding.
- Image opened exactly once, at the original file. Image batch usage: 1 of 8; context usage: 1 of 24. No crops, reopens, grids, layouts, templates, figures or screenshots loaded.
- After that opening, read only the approved prior-page N18 text envelope, `ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n18/source70-context.json`. Its recorded source is `pages/0070/page.json`, with recorded SHA-256 `6f597649f82619230e21bcd37e3072367fbe8c2e1539e6622a589e9c95cc4a03`. This is approved text context, not an independent review of page 70 pixels.
- Read the image-batch and lesson source contracts. No OCR, historical page-71 Markdown, author candidate, answer, choice, native count, count target or full ticket output was inspected.
- This file is an observation report, not a page template or a replacement source transcription.

## Object ownership and boundaries

1. The first printed text is the continuation of N18's last paragraph on page 70. Page 70 ends `全部有理数集合和全部自然数集合 N 之间建立起来的一一对`; page 71 starts `应关系表明`. The cross-page word is `对应`, not a new paragraph or new exercise.
2. That continued paragraph discusses the cardinality of rational/natural numbers, Cantor, and the impossibility of enumerating all real numbers.
3. The next indented paragraph remains N18. It recommends popular/scientific reading on infinite set theory and closes with its emergence as an independent discipline.
4. N18 closes after `学科，并引起了 19 世纪末叶数学家们的广泛兴致.` The last two characters are read as `兴致`, not silently replaced by `兴趣`.
5. Below a substantial blank gap, the centered section heading is `§ 6. 无穷数列·数列的极限`.
6. The next centered unit heading is `19. 无穷数列`. The following prose and numbered items belong to N19, not N18.
7. The visible N19 `1)`, `2)`, `3)` items enumerate associated sequences inside explanatory prose. They are not independently numbered exercises; no exercise-column heading or exercise question is visible on this page.
8. The last N19 body line ends `在这个对应关系` without completing the sentence. N19 continues beyond page 71; it must not be treated as a completed unit here.
9. The footer reads printed page `64`, with small bullet-like surrounding marks. It is not part of either unit's mathematical prose.
10. There are no instructional diagrams, tables, graph axes, figure labels/captions or illustrated objects visible on page 71. Neither N18 text context nor this page confirms an N18 exercise object.

## Printed-row freeze: N18

These are visual rows, in top-to-bottom order. LaTeX-style subscripts and `\cdots` encode the visible mathematical typography; ASCII sentence punctuation is used as a report transcription convention. They are not machine count declarations.

```text
A01 应关系表明，从某种意义上说，“有多少”有理数就“有多少”自
A02 然数. 德国数学家康托尔于 1874 年证明: 不可能用类似的方
A03 法将全部实数“编号”，因为对于任何实数数列 (x_1, x_2, x_3, \cdots,
A04 x_n, \cdots)，总可以找到一个不在数列里的实数 x.
A05     有关这方面的情况，可从专讲无穷集合论的普及读物和
A06 科学著作中得到更详细的了解. 当集合论中出现了如上所述
A07 的有趣的和意想不到的成果时，集合论开始形成一门独立的
A08 学科，并引起了 19 世纪末叶数学家们的广泛兴致.
```

Approximate vertical location: A01 starts near y=150; A08 ends near y=750. No heading, figure, exercise or footnote interrupts these two paragraphs.

## Printed-row freeze: N19 boundary material

These rows are retained to establish complete visible page content and the ownership boundary, not to expand the N18 delivery scope.

```text
H01 § 6. 无穷数列·数列的极限
H02 19. 无穷数列
B01     在八年级，我们就遇到过无穷数列，例如，首项是 1，公比
B02 是 2 的无穷等比数列:
B03                         1, 2, 4, 8, 16, \cdots.
B04 前一节，我们还讨论了数列的几个例子. 和每一个实数
B05                         \alpha = a.a_1a_2a_3\cdots
B06 有关的数列有:
B07     1) 数 \alpha 小数点后面的数字: a_1, a_2, a_3, a_4, \cdots, a_n, \cdots;
B08     2) 数 \alpha 的不足近似小数: \alpha_1=a.a_1, \alpha_2=a.a_1a_2, \cdots,
B09 \alpha_n=a.a_1a_2\cdots a_m, \cdots;
B10     3) 数 \alpha 的过剩近似小数: \alpha_1'=a.a_1+\frac{1}{10}, \alpha_2'=a.a_1a_2
B11 +\frac{1}{10^2}, \cdots, \alpha_n'=a.a_1a_2\cdots a_n+\frac{1}{10^m}, \cdots.
B12 给定一个无穷数列就是给定一个对应关系，在这个对应关系
F01 [bullet-like mark] 64 [bullet-like mark]
```

Approximate vertical locations: H01 y=870; H02 y=1015; B01 y=1110; B03 y=1275; B05 y=1440; B07 y=1590; B08 y=1670; B09 y=1750; B10/B11 y=1830-2000; B12 y=2045; footer y=2130.

### Literal formula observations and uncertainty

- B03 explicitly has the geometric sequence `1, 2, 4, 8, 16, ...`, with first term 1 and ratio 2 in B01-B02.
- B05 has a decimal point between `a` and the digit string, not a multiplication instruction. The quantity being expanded is the Greek-looking `\alpha`; its component digits are the printed `a_i`.
- B08's first two terms have no added power-of-ten term.
- B10's second excess approximation continues across the print break into the beginning of B11. The `+1/10^2` belongs to `\alpha_2'`, not a separate term or question.
- G01: B09's left index is read as `n`; the terminal digit's lower index appears to be `m`. The single-original view does not justify silently replacing the latter with `n`. The displayed `a_m` is the provisional ink reading, with `m` versus `n` explicitly unresolved.
- G02: B11's general-term denominator exponent appears to be `m`, while its approximation index and last digit appear to be `n`. The displayed `10^m` is the provisional ink reading, with `m` versus `n` explicitly unresolved. Mathematical expectations are not used to settle the glyph.
- G03: The prime near the general excess approximation is visibly accompanied by a tiny adjacent ink dot/trace. This is not sufficient evidence for a second prime, punctuation inserted inside the symbol, or a new mathematical operator; the report retains one prime and records the trace here.
- G04: The decimal literal is written with Latin-looking `a`; visual resemblance alone cannot establish a historical font's Unicode code points. No Cyrillic question-label sequence is present.
- `a_n` in B07 is read as `n`; any later dispute must be compared with the original, not resolved from an author's preferred sequence formula.
- B04 visibly separates `例子` and `和每一个实数` with a period-like stop. This report does not rewrite that into a preferred sentence.
- No mathematical erratum is approved by these provisional readings. In particular, the report does not substitute the theoretically conventional `a_n` / `10^n` for G01/G02.

## Non-content ink and count-copy exclusions

These observations are independent of any counting output. Coordinates below are coarse visual bounds in the original's 1695 x 2381 coordinate system, not machine-snapped boxes. No exclusion has been applied. Any future count-copy operation must keep these boxes outside all body text, formulas, headings and footer.

| ID | Candidate kind | Approximate box [x,y,w,h] | Original-ink basis |
|---|---|---|---|
| E01 | scan-artifact | [620,30,22,20] | Tiny isolated dash in the otherwise empty extreme top margin, far above A01. Not a printed row. |
| E02 | scan-artifact | [70,775,42,28] | Small ragged mark at the outer left margin below the N18 prose. Detached from the typeset body and not a continuation character. |
| E03 | scan-artifact | [1570,650,77,46] | Irregular solid blot and detached dot at the far right, beyond A07's rightmost body ink. No typeset alignment or semantic label. |
| E04 | scan-artifact | [1605,765,17,17] | Isolated far-right speck between the right-margin blots. |
| E05 | scan-artifact | [1550,825,68,55] | Second irregular far-right blot beside the blank gap before the section heading, outside the heading's ink. |
| E06 | scan-artifact | [1550,1620,40,55] | Detached right-margin speck/blot beside B07-B08, beyond the formulas. It must not be expanded inward over the item text. |
| E07 | scan-artifact | [1545,1820,36,34] | Small irregular far-right mark beside the excess-approximation rows, separated from the last formula ink. |
| E08 | scan-artifact | [0,2315,1450,66] | Thin sloping/jagged line at the extreme bottom scan edge, well below the footer; its right portion exits the image. It is an edge-line artifact candidate, not a lesson-content separator. |

No independently confirmed **printed content separator-rule** is present. The large blank boundary before H01 is a spacing boundary, not a horizontal rule. E08 may geometrically look like a thin rule, but its extreme-edge placement and sloping scan-edge appearance support the `scan-artifact` candidate classification instead of inventing a printed section divider.

Other tiny scattered marks occur inside or close to the body column, particularly around the lower N19 formula rows. Their role is not established from this single view. They are **not eligible for broad count-copy masking here**. Printed decimal points, primes, subscript/exponent strokes, commas, ellipses and footer marks are retained. This report does not attempt to turn every speck into a new exclusion.

No expected total, count target, manual override, page-finalization result or native line count is stated or used.

## Stage A stop

The source reading above is fixed before any historical draft disclosure. The companion mathematical review may use only this freeze and the approved N18 page-70 text. No source rewrite, figure construction, application run, dependency change, Git operation, database operation, environment read or network request is authorized by this report.
