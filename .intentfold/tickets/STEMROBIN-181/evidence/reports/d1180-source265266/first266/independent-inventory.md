# SOURCE266 FIRST Independent Inventory

Frozen before any targeted read of source266 candidate MD, JSON, audit, report,
or author inventory. This file is not subsequently revised to match a candidate.
The only image observations so far are the original page and the two existing
source crops, each opened once. No source265 or source267 pixels were opened.

## Source Binding

- Repo: `/Users/yong/.codex/worktrees/00b1/lemmadeck`
- Original: `.intentfold/tickets/STEMROBIN-181/tmp/d1124-source264266-first-preparation/work/10p/pages/0266/page.png`
- SHA256: `0662d52dec882e6164094c5751a9a32a94b7844666f7e27225b0a6883203fbd2`
- Top crop SHA256: `4d32c55653a816618ef8be47772d33817797f8d6f9ce5f69fde097a61ea7acb6`
- Bottom crop SHA256: `61988a4101fc72a92c617162d18fb11468c6c41c1db65edeeede932844c55f9a`

## Logical Rows

23 body rows plus 1 footer row = 24. Tall fractions do not become additional
logical rows. The infinity expression wraps at the original row boundary.
These are source-only visual transcriptions; spacing reflects visual separation,
not a proposed change to any authored page.

| Row | Source |
|---|---|
| 01 | 现质量随速度增大而增长的量是不可能的. 但是在当代的带 |
| 02 | 电粒子加速器中，元素的粒子可以达到巨大的速度. 如果粒子 |
| 03 | 的速度比光速小90千米/秒，则粒子的质量就增大到100倍. |
| 04 | 强大的电子加速器可以把电子这种粒子加速到其速度仅比光 |
| 05 | 速小35—40千米/秒. 在这种情况下电子质量差不多增大到 |
| 06 | 2000倍，电子的质量超过了质子. 为使这样的电子仍在圆周 |
| 07 | 轨道上运动，就应当使作用于电子上的磁场力比不考虑质量 |
| 08 | 对速度的依赖关系时所可能设想的大到2000倍. 要计算高速 |
| 09 | 粒子的轨道，利用牛顿力学定律已是不可能的了. |
| 10 | 考虑到关系式(8.9)，物体的动量等于： |
| 11 | $\vec{p}=\frac{m_0\vec{v}}{\sqrt{1-\frac{v^2}{c^2}}}$　(8.10) |
| 12 | 相对论动力学的基本定律可以写成前述形式： |
| 13 | $\frac{\Delta\vec{p}}{\Delta t}=\vec{F}$ |
| 14 | 但是物体的动量在这里是用公式(8.10)确定，而不单纯是乘 |
| 15 | 积$m_0\vec{v}$. |
| 16 | 随着运动速度的增大，决定物体惯性的质量也增大. 当 |
| 17 | $v\to c$时，根据方程式(8.9)物体的质量增大到无限大($m\to$ |
| 18 | $\infty$)；所以加速度趋于0，不论力作用多长时间，速度实际上停 |
| 19 | 止增长. |
| 20 | 在计算带电粒子加速器时，利用相对论运动方程式的必 |
| 21 | 要性表明，相对论在当代已成为工程科学. |
| 22 | 可以把牛顿力学看作是相对论力学的特殊情况，这些定 |
| 23 | 律在物体的运动速度远小于光速时是正确的. |
| 24 | • 256 • |

## Glyph, Punctuation, And Emphasis Facts

- Initial `现` is visible source text, not a new paragraph heading.
- Both prose references to `(8.9)` remain literal. They are not substituted
  with modern or recalculated numbering.
- Numbered equation has arrows over p and numerator v, subscript zero on m,
  a single outer square root over `1 - v^2/c^2`, and squared scalar v and c
  inside the nested fraction. `(8.10)` is on the same equation row.
- Second display has Delta and vector p together in the numerator, Delta t
  in the denominator, and an arrow over F. It is unnumbered.
- Inline product on row 15 has m subscript zero and vector v.
- Speed example values are 90, 100, 35—40, and 2000 (twice in the long
  paragraph). Preserve the range dash, slash units and punctuation outside math.
- Sentence stops are source dots, not hollow Chinese full stops. Chinese
  commas and colons remain outside mathematical expressions. The wrapped
  infinity expression is followed by the source semicolon.
- Clearly slanted prose includes `磁场力`, `物体的动量` in the introduction
  and contrast, `物体惯性`, and `物体的质量` in the limiting-speed discussion.
- Visually distinct emphasis occurs at `相对论动力学的基本定律` and
  `但是`. Exact source underdot-versus-heavy-type classification and any
  other point-emphasis spans must be checked explicitly in the comparison;
  the coarse full-page display alone is not sufficient to invent a span.
- Footer has two flanking solid points and bold italic 256. Points are not
  a figure or an explanatory footnote.

## Objects And Boundaries

- No figure, table, caption, exercise, section title, or explanatory footnote.
- First paragraph is a carry-in, occupies rows 01-09 and closes on row 09.
  No predecessor has been read yet; its source fidelity is not signed here.
- Formula introductions and displays occupy rows 10-13. Contrast occupies
  rows 14-15; limiting-speed paragraph rows 16-19; engineering paragraph
  rows 20-21; Newtonian special-case paragraph rows 22-23.
- Last paragraph is page-level closed at `是正确的.`. There is no visible
  outgoing incomplete sentence or paragraph.
- Page-level paragraph closure does not establish course n99 closure.
  No source267 heading or next-course boundary is inferred.

## Method Disclosure

The first tool call opened the specified original PNG. A subsequent
rule-location `rg` search was inadvertently wider than needed and returned
truncated historical ticket matches. No source266 candidate text from that
search was used to construct this inventory. Targeted candidate and author
inventory reads have not occurred. Later rule lookup used exact paths.
