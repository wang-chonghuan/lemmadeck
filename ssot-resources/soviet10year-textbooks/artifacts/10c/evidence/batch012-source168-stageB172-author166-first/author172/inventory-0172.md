# Pixel-first inventory: physical 172, printed 166

Status: source-author observation, not independent review or PASS.
Original: ../production-source10c172-175/10c/pages/0172/page.png
SHA256: 78cf4b41abb36ba8a6c703ea8d9b04e9d494311eb7e5a71469827ccbcfd4ddab
Bytes/WH: 93472 / 1695 x 2580. Preload: preload-0172.json.
Viewed once via functions.view_image, detail original. No crop needed or viewed.
This inventory is saved BEFORE the durable page.md is created.
Row IDs below are visual positions, not layout-band targets or a counter result.

## Printed text rows and object ownership

| Row | Approximate y | Object | Source transcription / ink |
| --- | --- | --- | --- |
| R01 | 230-283 | B1 p cont | 定数 $x^p$。在区间$]0,\infty[$上，用它定义函数 $f(x)=x^p$。这个函 |
| R02 | 309-366 | B1 | 数叫做幂指数为 $p$ 的幂函数。如果数 $p>0$，那么幂函数有定 |
| R03 | 392-443 | B1 end | 义，当 $x=0$ 时，幂函数也有定义，因为 $0^p=0$。 |
| R04 | 472-528 | B2 p | 在本书的前面几节里，你们仅仅熟悉了对于某些幂指数 |
| R05 | 558-646 | B2 | （整数，$p=\frac{1}{2}$，$p=\frac{1}{3}$等等）的幂函数和它的导函数。现在我 |
| R06 | 686-744 | B2 | 们还要推出当幂指数 $p$ 是任意实数时幂函数的导函数公式。 |
| R07 | 768-824 | B2 | 以前所得到的公式仍然成立。就是当 $x$ 是任何正数时， |
| R08 | 831-903 | B2 end, displayed formula | $(x^p)'=p\cdot x^{p-1}$。 Right annotation （1） belongs to this same row. |
| R09 | 929-987 | B3 p | 为了证明它，我们利用基本对数恒等式：$x=e^{\ln x}$，由此得 |
| R10 | 1006-1066 | B3 | 出，$x^p=e^{p\ln x}$。因此根据复合函数的导函数计算法则，得到： |
| R11 | about 1102-1191 | B3 formula | $(x^p)'=(e^{p\ln x})'=e^{p\ln x}(p\ln x)'=x^p\cdot p\cdot\frac{1}{x}=p\cdot x^{p-1}$。 The numerator 1 and denominator x are a single tall fraction in one row, not separate rows. |
| R12 | about 1197-1241 | B3 end | 公式（1）得证。 |
| R13 | 1276-1335 | B4 p | 当 $p>0$ 时，幂函数在区间$]0,\infty[$上上升，因为在这个区 |
| R14 | 1354-1404 | B4 end | 间上，它的导函数 $px^{p-1}>0$。 |
| R15 | 1435-1495 | B5 p | 当 $p<0$ 时，幂函数在区间$]0,\infty[$上下降，因为在这个区 |
| R16 | 1516-1574 | B5 | 间上，它的导函数 $px^{p-1}<0$。在图76а，76б和图77中，作为 |
| R17 | 1594-1652 | B5 end | 举例，画出了当 $p$ 取不同的值时幂函数的图象。 |
| C01 left/middle | about 2176-2223 | B8 cap 图76 | 图 76а and 图 76б, same horizontal printed caption row. |
| C01 right | about 2176-2223 | B9 cap 图77 samerow | 图 77, horizontally beside the two 图76 captions. |
| F01 | about 2252-2281 | B10 foot | Flanking solid dot, 166, flanking solid dot. |

## Figure objects from pixels

B6: 图76, two subfigures as a single semantic figure; coarse union box
[130,1710,800,440]. No caption inside the coarse box.

- Left subfigure 76а: perpendicular x/y axes, positive-direction arrowheads;
  origin marked 0, x and y labels; horizontal/vertical dashed projections at
  x=1 and y=1; labels 1 on both axes. An increasing convex curve from the origin,
  through the dashed intersection (1,1), rising steeply. Printed labels
  $y=x^p$ and $p>1$.
- Middle subfigure 76б: corresponding axes, arrows, origin 0, x/y and both 1
  labels; dashed projections to (1,1). Increasing concave curve from the origin
  through (1,1), flattening to the right. Printed labels $y=x^p$ and $0<p<1$.
- The plotted curves are solid. The dashed reference segments are not curves.
  No ticks, extra coordinates, or additional cases are invented.

B7: 图77, coarse box [965,1725,440,425]. Positive x/y arrows; origin 0,
x/y labels and 1 on both axes; dashed projections to (1,1). Solid decreasing
convex curve on the right of the y axis, through (1,1), approaching but not
touching the x axis within the drawing. Printed labels $y=x^p$ and $p<0$.

No exercises, unit heading, footnote, table, or wrapped displayed formula on this page.
Paragraph B1 actually starts 定数, closing the supplied preceding 可以确. The actual
source here uses p throughout; no replacement with the supplied previous-page r.
Prose and inline mathematics wrap as ordinary printed rows; no U+21B5 needed.

## TYPE UNKNOWN margin inventory

- Thin irregular dark ink along the top edge, extending across most of the width.
- Isolated small ink flecks in the outer top/left/right margins; conspicuous right
  specks beside the prose near y640, y835, y1370, and y1565.
- Isolated bottom-margin flecks and a short faint horizontal mark near y2483.
- Tiny scattered pinpoints in blank spaces have no readable labels or mathematical
  relationships on this observation.

These marks are unclassified, not declared scanning artifacts or independent
exclusions. They remain TYPE UNKNOWN, noted in page frontmatter; count_exclusions
is absent. Geometry is only a source-author coarse proposal, not snapped or audited.

## Authored projection, unverified

Intended blocks: B1-B5 prose, B6-B7 figures, B8-B9 captions (B9 samerow), B10 foot.
Visible text positions: R01-R17, one caption horizontal row C01, one foot row F01.
The earlier prepare/layout results are not proof of this projection. No count,
finalize, figure extraction, math validator, or independent review ran.
