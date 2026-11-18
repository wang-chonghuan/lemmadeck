# SOURCE177 / RAW135 First Independent Pixel Inventory

Recorded 2026-11-17 before reading the author's page.md/page.json prose, typography notes, figure assertions, or native receipt body.
The frozen envelope and input bindings were read only to verify identity, hashes, paths, permission, and the supplied p0176#8 tail.
The author report was parsed only for its manifest path, not its judgment or prose.
This is the existing SOURCE169 independent reviewer, not the SOURCE177 or modern134 author.

## Actual Pixel Evidence

- S177-O1: full work/10p/pages/0177/page.png from d242, 1536 x 2337, SHA256 e64ca5f045d0ea94e4afb52a62accd6f8843bdf8ac016cc1b5138f479a9bd154.
- S177-O2: source177-detail-top.png, independently cropped from that page with half-open box [170,65,1390,1090], 1220 x 1025, SHA256 e1814e670a37121ae1f0ea7894f7736d1105b3c09c2c3a56cc6324fae2648600.
- S177-O3: source177-detail-lower.png, independently cropped from that page with half-open box [170,1090,1390,1890], 1220 x 800, SHA256 902648450777be2da17bcf0e80805f87dce20069fbb7be5c189703622baba618.
- R135-O4: author's existing work/10p/pages/0177/figures/fig-135.png, 297 x 256, SHA256 ae21dadff18954314553c9f06051b0be3d76dadc613699d41c4caf9fcd5c1345.
- R135-O5: raw135-current-svg-first-preview.png, 297 x 256, SHA256 3410f302ad2504ffaed796b5ef4941141c23604223e6efa95a50bd2bed4280b1, generated once from current SVG SHA256 b70fdb7ee7237d81e08738ad8ee96b935b70de3409430f03ff846d578cc89498 with the existing svg_raster.js/Resvg.

All five were actually returned by functions.view_image(detail=original) and inspected in that order. No SVG regeneration, vectorization, finalize, image reopen, other page image, or modern figure inspection.
Inherited actual opens: 3 (SOURCE169, not reopened). New opens: 5. True lifetime total: 8/24. Remaining: 16.
This batch is within the human's stricter maximum of 6 new opens.

## Page Objects And Print Rows

- One prose column initially using full width; beside figure135, prose uses a narrower left column for five print rows.
- 25 distinct physical print rows: 24 main-text/formula rows plus footer. The separate figure caption shares physical row 18 with prose.
- Paragraph/group boundaries from pixels: continuation rows 1-2; rows 3-6; rows 7-9; display formula row 10; row 11; rows 12-13; definition rows 14-16; rows 17-18; rows 19-20; unfinished rows 21-24.
- One instructional figure135 at the right of rows 14-18. One separate caption "图 135" below it, on row 18 beside the prose.
- No chapter/section/lesson heading, exercises, tables, footnotes, additional figure, or figure136 pixels. The text references figure136 but that image is not on this page.
- Footer: slanted numeral 167 with one decorative dot on each side.
- Page has white margins and sparse scan specks; neither is additional prose or teaching structure.

## Independent Print-Line Reading

The mathematical notation below represents the glyphs read from pixels; it was not copied from author Markdown. Chinese sentence stops are shown as source-visible stops, subject to the existing soviet-cn ASCII sentence-period representation.

```text
01 跟该表面对入射光线的分布、到光源的距离 $R$ 及与光源的发
02 光强度 $I$ 的关系。
03 显然，在其它条件相同时照度与光源的发光强度成正比。
04 两个相同的位于同一处的光源，在单位时间里向某一方向发
05 出的光能要比一个光源大一倍。但是这样的两个光源可以用
06 发光强度大一倍的一个光源来代替。
07 设想把点光源放在球面的中心，就能弄清楚照度跟光源
08 距离的关系。球面的表面积 $S=4\pi R^2$，而全部光通量 $\Phi=4\pi I$
09 （见公式 6.4），所以照度可以这样表示：
10 $E=\frac{\Phi}{S}=\frac{4\pi I}{4\pi R^2}=\frac{I}{R^2}$
11 因此，表面的照度与到光源的距离的平方成反比。
12 在上述情况中，射线是垂直地射到球表面的，但射线的方
13 向不总是这样的，射在面上的光线的方向用入射角来表示。
14 入射光线和过入射点垂直于表面的
15 外垂线间的夹角 $\alpha$ 叫做光线的入射角
16 （图 135）。
17 放在球面中心上的光源射在球面上
18 的光线的入射角等于零。
19 现在我们来研究光源到被照面的距离不变，而光线入射
20 角不为零时该面上的照度如何变化。
21 为此，我们观察该球面内表面上很小的一部分。如果这
22 部分的尺寸远远小于球面的半径，就可以认为这个部分是平
23 面，而射在这平面上的光线可近似地认为是平行的。设这部
24 分面积为 $\Delta S_0$（图 136）。我们来研究另一个平面，光源以对
25 [footer] · 167 ·
```

Separate caption on physical row 18: "图 135". It must not be counted as an additional physical row, merged into prose, or included in the figure crop.

## Typography Read From Pixels

- Row 3: regular prefix "显然，在其它条件相同时"; bold from "照度" through "正比" and its stop.
- Row 11: regular prefix "因此，"; bold from "表面的" through "反比" and its stop.
- Row 13: only "入射角" is bold within otherwise regular prose.
- Rows 14-15: the whole two-line definition is bold, including the printed alpha. Row 16's "(图 135)" reference and stop are regular, outside the bold definition.
- R, I, S and E are visibly slanted mathematical Latin glyphs. The formula uses Greek Phi/pi, superscript 2, and fraction rules. Mathematical numerals and operators are not guessed prose bold.
- The definition's alpha is visibly emphasized with the definition; the figure's alpha label is small regular/slanted math print, not a prose definition.
- Delta S with subscript 0 occurs on row 24. No invented exponent, omitted subscript, or changed formula is permitted.
- Footer 167 is slanted. Its dots are ornaments, not emphasis dots.
- No systematic emphasis-dot sequence or additional prose italic/bold phrase is established. Random scan specks are not literal emphasis dots.

## RAW135 Independent Source Objects

Stable semantic inventory IDs below are observations, not a new FigureSpec or authored geometry.

- R135-P: one unlabeled incidence point, where three strokes meet at the top edge of the surface.
- R135-SURFACE: one thick, nearly horizontal surface line spanning both sides of P; slight print irregularity is source detail, not an axis or scale.
- R135-HATCH: a band of short oblique hatch strokes beneath that surface, extending from left to right. All of the visible band belongs to the figure and must remain; no grid/count/value interpretation is attached.
- R135-RAY: one straight oblique incident ray from upper left to P. Its single arrowhead points down/right toward P, not away from the surface.
- R135-NORMAL: one straight vertical outward normal from P upward. No arrowhead, label, tick, or right-angle square is visible on it.
- R135-ARC: one acute-angle arc above the surface, bounded by the upper-left ray and upward normal, sharing their incidence vertex P.
- R135-ALPHA: one small alpha label within/above that wedge. It is not a numerical angle value or a Latin point name.
- R135-CAPTION: "图 135" is separate page text below the diagram, excluded from the image crop.

Approximate crop-pixel locations observed visually, not replacement extraction bounds: P near (150,215); normal top near (150,14); ray starts near (29,19); arrowhead near (65,75); arc from near (106,146) to (149,136); alpha near (123,118); surface from x=14 to x=283 near y=216; hatch band extends to roughly y=244.

## RAW135 PNG And Current SVG Visual Observations

- Existing PNG includes the complete source-page ray start, single directional arrowhead, normal top, common incidence point, angle arc, alpha, surface ends and full hatch band.
- No caption, adjacent definition, following paragraph, page footer or invented annotation intrudes into the crop.
- The current SVG preview preserves those same objects, positions, orientation, common vertex, wedge and hatch-band extent at the same 297 x 256 dimensions.
- The SVG slightly smooths the print contour and omits isolated non-instructional specks visible in the PNG. No teaching line, label, arrowhead or hatch-band part is visibly removed.
- These are independent visual observations. The author's native line count and vector mismatch percentage have not yet been consumed and cannot supply a source-fidelity verdict.

## Boundaries

- Leading text "跟该表面..." grammatically continues the supplied, hash-bound p0176#8 tail ending "照度 $E$". No SOURCE176 re-review or release of an old HOLD is made here.
- Last print row before footer ends "光源以对", without closure. The object is open.
- Page178 has not been observed. No identity of a missing continuation, figure136 contents, or closure of n68 is inferred.
