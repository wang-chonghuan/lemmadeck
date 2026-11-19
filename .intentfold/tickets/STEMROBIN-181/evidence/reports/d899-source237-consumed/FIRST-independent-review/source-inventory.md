# d888 FIRST independent source inventory

Sole R: /Users/yong/.codex/worktrees/00b1/lemmadeck
T: R/.intentfold/tickets/STEMROBIN-181
Scope: original SOURCE237, RAW206/207, frozen FIRST SVG206/207.
This file was written BEFORE reading d881 FIRST/report.md, author-inspection.json,
the authored transcription, page.json, audit.json or native semantic receipts.
The input file-hashes.json and bindings.json were read only to locate and bind inputs.
No author answer key was read or involved. No SOURCE238 was read.

## Observed pixels and order

1. SOURCE237 full page: d881/work/10p/pages/0237/page.png, original resolution.
2. SOURCE237 upper text crop: d881/FIRST/pixels/source-prose-upper.png.
3. SOURCE237 lower text crop: d881/FIRST/pixels/source-prose-lower.png.
4. RAW206: d881/FIRST/outputs/work/10p/pages/0237/figures/fig-206.png.
5. RAW207: d881/FIRST/outputs/work/10p/pages/0237/figures/fig-207.png.

One batch; 5 images so far; 0 reopens. The two source text crops are unscaled
rectangles of the same full page, not OCR or edited text.

## Page inventory

Printed footer: 227 between two round dots. Physical/source page: 237.
No heading, numbered exercise, answer or new section starts on these pixels.
Top: figure 206 at left, figure 207 at right; separate caption objects share one
horizontal printed row. Then five prose lines continuing from the previous page,
four prose lines defining the grating constant and introducing figure 207, six
prose lines describing interference and triangle ABC, one displayed formula,
one condition-introducing line, and one footer row.

Independent count: 19 occupied printed text row positions:
1 shared caption row + 5 + 4 + 6 + 1 formula + 1 outgoing prose + 1 footer.
Independent typed-block inventory: 10:
fig206, fig207, cap206, cap207(samerow), p(cont,5),
p(4), p(6), p(formula,1), p(open,1), foot(1).
The incoming continuation is across the top fig/cap objects, not a new paragraph
beginning semantically with the word 在.

## Source text observed before candidate comparison

The following follows the actual printed line breaks; indentation is not encoded.
Math below uses source letters and their printed relationships, not a repaired
physical theory. Chinese punctuation is preserved outside the explanatory math.

```text
在玻璃平板上画出平行的细线制成的。细线的数目每 1 毫米
可达几千条。细线总数超过 100000 条。制作夹在两块玻璃
平板之间的白明胶光栅印痕是很简单的。所谓的反射光栅，
具有最好的质量。反射光栅的细缝交替地反射光和散射光。
散射光的条纹是用雕刻刀在磨光的金属平板上刻划出来的。

如果透明狭缝(或者反射光条纹)的宽度为 a，而不透明
间隔(或者散射光条纹)的宽度为 b，则量 d = a + b，叫做光栅
常数。我们来研究衍射光栅基本理论的主要因素。让波长为
λ 的平行单色波射入光栅(图 207)。

狭缝上的次级光源造成向各个方向传播的光波。我们来
求由狭缝发出的波彼此加强的条件。为此我们来研究由角 φ
方向上传播的波。在两个相邻狭缝的边缘处发出的波间的程
差等于线段 AC 的长度。如果线段 AC 的长是波长的整数
倍，那么由所有狭缝发出的波迭加后将彼此加强。由三角形
ABC 中可以求出直角边 AC 的长：

|AC| = |AB| sin φ = d sin φ.

当角度为 φ 时出现各最大值。角 φ 由下列条件求出：
```

Source printed parenthesis forms are round; the candidate's ASCII mathematical
encoding is to be compared later, not inferred here. The displayed formula ends
with a low Latin-style period, unlike prose full stops. Latin a,b,d are italic
variables; A,B,C are uppercase Latin. Greek wavelength is lambda; angle is phi
(not Cyrillic or a Latin replacement). Two magnitude-bar pairs surround AC and
AB; neither term is a single absolute-value bar. Two equals signs are present.
Captions are 图 206 and 图 207; no extra caption prose.

Emphasis is in the heavy source face on 反射光栅 and on 光栅常数, the latter
split over the printed lines 光栅 / 常数. No scientific erratum inferred.
The source really says reflection/scattering strips and d=a+b.

## Figure 206 source-only inventory

- A landscape rectangular glass/grating plate is behind an overlapping magnifier.
- Dense, individually visible near-vertical grating traces span the plate;
  irregular waviness, differing spacing and small breaks are scan facts.
- The magnifier sits over the plate's lower-right corner. Two complete circular
  outlines form its rim. The plate is occluded by the magnifier, not cut away.
- Enlarged near-vertical traces occupy the lens's upper/left region. A horizontal
  lower plate edge connects to a vertical right plate edge inside the lens.
- Short hatch marks form a crescent inside the lens near its lower-right perimeter.
- A joint and opaque dark handle extend from the rim toward the lower right;
  the handle has the source's blunt, slightly irregular terminal shape.
- No mathematical labels, axis, arrows, tick values or letters occur here.
- The native crop retains all visible plate/rim/handle extremities. It excludes
  caption 图206 and prose; its white padding contains no neighboring figure ink.

## Figure 207 source-only inventory

- Eight detached incoming horizontal arrows at left all point right.
- Six separated heavy near-vertical grating bars form a discontinuous column.
- Six solid rays travel up-right from the grating region toward a central vertical
  line, change slope at that line, and converge on one point at a right-hand
  heavy vertical line. Arrowheads along the rays indicate propagation rightward.
- Two dashed oblique construction/ray traces are separately visible among the
  solid rays, with corresponding dashed continuations toward the convergence.
- Central vertical line has an upward arrow at top and downward arrow at bottom.
  The heavy right vertical screen line has no corresponding top/bottom arrowheads.
- A is the lower grating-edge vertex; B is above it; C is to the right between
  their heights, at the oblique construction intersection. Source marks the
  triangle/construction, including the small right-angle feature near C.
- A vertical dimension at the left of AB is marked d and has opposed heads.
- A short horizontal reference extends right from A. An arc above it marks φ.
- Labels are exactly uppercase Latin A/B/C, lowercase italic d, and Greek φ.
  No axis name, extra point, tick, numerical measure or λ label is printed.
- The native crop retains the eight incoming arrows, six bars, construction
  labels/marks, two-ended central line and right screen. It excludes 图207 and
  all surrounding prose; no neighboring RAW206 ink or footer is present.

## Boundary facts at inventory time

The input binding supplies the preceding textual suffix
好的光栅是利用专门的刻划机. This is not a full SOURCE236 approval.
SOURCE237 begins 在玻璃平板上... and is grammatically an incoming continuation.
The last source prose line ends 求出： and requires material not present here.
Outgoing condition remains OPEN; SOURCE238 is prohibited and was not read.
Full-card approval is false. Inventory is source observation, not yet SVG approval.
