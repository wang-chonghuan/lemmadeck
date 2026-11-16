# STEMROBIN-184: Independent Source-First Freeze, Stage A Only

## Scope And Independence

- Invocation date: 2026-11-16.
- Working directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- Sole output: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p52-p53-independent-source-first.md`.
- Source image set: book `10c`, physical pages 52 and 53, previously prepared directories `0052` and `0053`.
- Each `page.grid.png` was opened exactly once, separately, using `detail: original`. Neither `page.png` was opened as an image. No crops, reopens, OCR, other-page pixels, author materials, candidate pages, old freezes/reviews, answers, choices, modern material, templates, FigureSpecs or SVGs were inspected.
- Read-only instruction context: `.intentfold/readme.md`; charter `engineering.md`, `operations.md`, `product.md`; source lesson skill `.claude/skills/ld-s10y-lesson/SKILL.md`; image/batch skill `.agents/skills/ld-s10y-image/SKILL.md`; general IntentFold routing, without invoking a capability.
- No initialization, Grill, backend, Git, database, production, publication, deployment, merge, closure, other-chat activity, pipeline, preparation, finalization, counting, tests, validation or assembly was performed.
- The literal transcription and inventories below were made before any author disclosure. They are not comparisons with a candidate and are not reconstructed from mathematical expectations.
- `UNKNOWN` is an unresolved source observation, not permission to repair or complete the source.

## Source Binding And Image Budget

All four files are PNG, 1695 x 2580 pixels. Hashes are SHA-256 of the existing file bytes.

| Physical page | File, relative to working directory | Bytes | SHA-256 | Visual opens |
| --- | --- | ---: | --- | ---: |
| 52 | `.tmp/ld-s10y-lesson/10c/pages/0052/page.png` | 65955 | `12a3976d6129411537774b1f8c94d7a0b888cc1b5f17e6ff3f484896050f6736` | 0 |
| 52 | `.tmp/ld-s10y-lesson/10c/pages/0052/page.grid.png` | 84369 | `964d1247b2893c53055048ba9ff932fa1f9e05b3385218dac6a8c1378e686259` | 1, original detail |
| 53 | `.tmp/ld-s10y-lesson/10c/pages/0053/page.png` | 73110 | `10c637fa27f71059839822d4f579bde1cceb2f27084cbf00e14077779c1af333` | 0 |
| 53 | `.tmp/ld-s10y-lesson/10c/pages/0053/page.grid.png` | 90052 | `8680f79bf3ad3b6d84cb669132007afbf4383acc21c5559567a042f4b7dce63e` | 1, original detail |

Metadata read before the visual opens: page-52 files have mtime `2026-11-16T12:38:19+0000`; page-53 files have mtime `2026-11-16T12:38:20+0000`.

- Stage A image loads: **2**.
- This batch: **2 / 8** images used; **6** slots remain.
- Current image-bearing context: **2 / 24** images used.
- Actual crops loaded: **0**.
- The six remaining batch slots are reserved for future explicitly authorized, unique Stage B crops. No Stage B action has occurred, and no next-batch authorization is inferred.
- No image payload is included in this report or sent to another chat.

## Identity And Boundary Evidence

The only TOC object retrieved was the exact ordinary card with `printedNumber: 86`, from `ssot-resources/soviet10year-textbooks/toc/10c/zh.json`:

```json
{
  "id": "ana10-c6-s3-n86",
  "printedNumber": 86,
  "title": "余弦函数的性质和图象．反余弦函数和方程 cos x = a 的解",
  "page": 45
}
```

This identifies the already-open ordinary lesson/card only. Its title does not prove the presence, wording or completion of any future subject. No next-card object was retrieved.

The source manifest identifies catalog book `10c` and source PDF `10c`. Its matching PDF entry names `10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`, 369 physical pages. The matching catalog/PDF entries inspected do not declare an `exerciseNumbering` scope. That scope remains `UNKNOWN`; it is not imported from another book.

Observed printed page numbers: **46** on physical page 52 and **47** on physical page 53. There is no new printed unit heading on either observed page.

User-supplied prior-page text, not obtained by opening prior-page pixels:

```text
求驻点. 因为在闭区间$[-\pi,\pi]$上，只有在$x=-\pi$，$x=0$
和$x=\pi$这些点，$\sin x=0$，所以这些点是驻点（因为它们是余
弦定义域内部的点）. 函数的上升和下降情况表示在下面的
表里.
```

That prior paragraph is explicitly closed. The heading for unit 86 was already on physical page 51. The prior text mentioned the next graph 29 and table without showing their pixels; the present inventories come exclusively from page 52. The last prior exercise number, 146, is not an expected new range.

Unit 86 is still open after physical page 53. Its right boundary is unseen. No completion is inferred from the TOC title, a next unit, or another page.

## Transcription Conventions

- Inside each `text` fence, one physical source text row occupies one line; large fractions still occupy their one source row. Blank lines outside fences separate observations and are not source rows.
- `$...$` and LaTeX delimiters encode visible mathematics, not editorial changes. Chinese text uses the source spelling `图象`, not `图像`.
- The visibly printed function spelling is `arc cos`, with a gap between `arc` and `cos`; it is encoded as `\operatorname{arc\,cos}`, not silently changed to a different visible spelling.
- Formula letter case is retained: `x`, `y`, `n`, `D`, `E`, `Z`. In particular the range letter is `E`, not a substituted `R`.
- Printed intervals `[a,b]` and `]a,b[` are retained as seen.
- Full stops are transcribed as `.`; commas within mathematics are `,`. Prose comma glyphs are recorded as `，`. Exact original encoded Unicode codepoints do not exist as recoverable facts in these raster pages.
- Mathematical-minus strokes are encoded as `-`. The upward/downward table arrows are additionally described geometrically below.
- No word spacing is inferred to establish a new mathematical token. Explicit horizontal positioning, emphasis and ambiguous glyph arrangements are discussed separately.

## Physical Page 52 / Printed Page 46

### Object Order, Coarse Boxes And Ownership

Coordinates below are coarse `[x,y,width,height]` estimates from the 100-pixel overlay, not snapped crops or exact geometry.

| Order / local ID | Kind | Coarse box | Ownership / source state |
| --- | --- | --- | --- |
| 52-T | Unnumbered variation table, including three lower tabs | `[165,245,1220,425]` | Unit 86 body; referenced by the supplied closed prior paragraph; not an exercise; no printed caption |
| 52-G29 | One coordinate graph | `[345,715,865,405]` | Unit 86 body; graph number supplied by its own caption |
| 52-C29 | Caption | `[725,1145,135,55]` | `图 29`; belongs to 52-G29 |
| 52-P1 | Body paragraph, four text rows | `[130,1230,1285,295]` | Unit 86; closed paragraph; references graphs 29 and 30 |
| 52-G30 | One extended coordinate graph | `[120,1590,1285,310]` | Unit 86 body; graph number supplied by its own caption |
| 52-C30 | Caption | `[720,1925,130,55]` | `图 30`; belongs to 52-G30 |
| 52-P2 | Body paragraph, two text rows | `[130,2010,1280,215]` | Unit 86; **open** across page boundary, ending with `曲` |
| 52-F | Printed footer | `[145,2250,155,55]` | Two flanking solid dots and page number 46; not body/task text |

The table comes first on this page. Do not invent a leading continuation prose block: the supplied preceding paragraph already ended at `表里.`.

### Complete Non-Figure Text, Literal Row Ends

52-C29:

```text
图 29
```

52-P1:

```text
由于余弦函数的周期等于$2\pi$，当平移$\vec r(2\pi,0)$时，它的
图象变成它自身. 于是，在区间$[-\pi+2\pi n,\pi+2\pi n]$上，余
弦函数的图象可以由画在图$29$中的图象平移$\vec r(2\pi n,0)$，$n\in Z$
得出(图$30$).
```

52-C30:

```text
图 30
```

52-P2, `open`:

```text
由等式$\sin\left(x+\frac{\pi}{2}\right)=\cos x$可以看出，余弦函数的图象可由正弦
函数的图象平移$\vec r\left(-\frac{\pi}{2},0\right)$得出. 因此，余弦函数的图象就是正弦曲
```

52-F: visible numeral `46`, flanked by one solid dot on each side.

Emphasis observation: the concluding assertion starting `因此，余弦函数的图象就是正弦曲` is visibly heavier than the adjacent explanation. It continues into the heavy opening row on page 53. The precise weight classification of every preceding glyph is `UNKNOWN` from this single scan view; no additional bold span is invented.

Displacement-letter observation: the page prints a small arrow above the lowercase displacement letter, read as `r`. No uppercase `R`, scalar substitution or replacement displacement is introduced.

### 52-T: Every Cell And Table Stroke Inventory

Main lattice: **3 rows x 6 columns**, with an additional individually boxed label below columns 2, 4 and 6. These lower boxes are not a full six-cell fourth row.

| Source row | Column 1 | Column 2 | Column 3 | Column 4 | Column 5 | Column 6 |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `$x$` | `$-\pi$` | `$]-\pi,0[$` | `$0$` | `$]0,\pi[$` | `$\pi$` |
| 2 | `$\cos' x$` | `$0$` | `$+$` | `$0$` | `$-$` | `$0$` |
| 3 | `$\cos x$` | `$-1$` | Rising arrow, lower-left to upper-right (`↗`) | `$1$` | Falling arrow, upper-left to lower-right (`↘`) | `$-1$` |

The prime in row 2 appears immediately after `cos`, before `x`: `cos' x`. This is not silently rewritten as a different arrangement of the derivative notation.

Lower tab cells, in left-to-right order:

| Tab | Attached below main column | Exact visible text | Other cells below row 3 |
| --- | ---: | --- | --- |
| T-low-left | 2 | `极小值` | No boxed cells under columns 1 or 3 |
| T-low-middle | 4 | `极大值` | No boxed cell under column 5 |
| T-low-right | 6 | `极小值` | No continuation beyond the right tab |

Approximate source stroke inventory:

- Main outer left at `x≈173`, from `y≈249` to `y≈558`; outer right at `x≈1375`, from `y≈258` to `y≈570`.
- Top border from approximately `(174,249)` to `(1372,259)`, not perfectly horizontal.
- First row divider approximately `y≈380..389`, across all six columns.
- Second row divider approximately `y≈469..480`, across all six columns.
- Main bottom border approximately `y≈557..570`, across all six columns.
- Five internal column boundaries approximately `x≈347,520,777,950,1203`; they divide all three main rows. Column widths are unequal.
- Left lower box: approximately `x≈343..519`, `y≈560..651`, with left/right/bottom strokes, joined to the main bottom border.
- Middle lower box: approximately `x≈774..950`, `y≈563..654`, with left/right/bottom strokes, joined to the main bottom border.
- Right lower box: approximately `x≈1200..1372`, `y≈568..660`, with left/right/bottom strokes, joined to the main bottom border.
- No dashed table border, omitted middle value, empty answer cell, additional column, named point or printed table number was observed.
- The main rows contain 18 populated cells; the three tabs contain three more populated cells. Inter-tab paper is outside cells, not blank cells to be filled.
- Red vertical and blue horizontal 100-pixel lines belong to the prepared grid overlay. They are not source table rules.

### 52-G29: Labels, Coordinates, Extrema, Endpoints And Strokes

One subfigure. It contains a single thick solid arch-shaped curve and two thinner coordinate axes. There is **no source ruled grid**, second curve, reflection line, named point or separate point-marker series.

Visible labels:

- Horizontal axis: `x`.
- Vertical axis: `y`.
- Horizontal values, left to right: `$-\pi$`, `$-\frac{\pi}{2}$`, `$0$`, `$\frac{\pi}{2}$`, `$\pi$`.
- Vertical values: `$1$` near the top of the arch and `$-1$` near the lower axis tick.
- Caption: `图 29`.

Axes/strokes:

- Horizontal axis approximately `(355,929)` to `(1196,938)`, with a right arrowhead. It extends beyond both ends of the curve.
- Vertical axis approximately `x≈734`, from `y≈725` to `y≈1110`, with an upward arrowhead and an unarrowed lower tail.
- Small axis ticks are visible near the horizontal values and the lower ordinate. Some tick/curve registrations are imprecise in the drawing; exact alignment is not repaired.
- Curve is solid, not dashed. It rises from its lower-left end to one interior summit, then falls to its lower-right end.

Independent pixel observations of landmarks:

| Landmark | Coarse pixel location | Source-labelled coordinate reading | Qualification |
| --- | --- | --- | --- |
| Left visible curve end | `(≈394,≈1043)` | Near `$(-\pi,-1)$` | Both coordinate labels exist on the axes; curve/tick registration is approximate |
| Left horizontal crossing | `(≈560,≈932)` | Near `$(-\pi/2,0)$` | The `-π/2` label/tick lies somewhat to its right; do not enforce exact analytic alignment |
| Interior summit | `(≈733,≈812)` | Near `$(0,1)$` | Visually the unique interior maximum; intersects the vertical-axis neighbourhood |
| Right horizontal crossing | `(≈900,≈935)` | Near `$(\pi/2,0)$` | Label/tick/curve are close but not pixel-perfect |
| Right visible curve end | `(≈1074,≈1050)` | Near `$(\pi,-1)$` | Horizontal `π` tick is near `x≈1080`; no extrapolation beyond the curve end |

Endpoint marker status: neither end has a clearly distinguishable separate hollow circle or separately drawn filled point. There are thick curve termination strokes. Open/closed endpoint semantics are **`UNKNOWN` from the graph markers**; do not equate dark stroke caps with explicit closed-dot notation. The table's interval symbols remain a separate source fact.

There are two low visible terminal ends and one interior high summit. These are the observed landmarks, not an assertion about an unobserved mathematical continuation.

### 52-G30: Labels, Coordinates, Extrema, Endpoints And Strokes

One subfigure. It contains one thick solid wave-like curve, two axes, labels and ticks. **No original graph-paper grid** is printed. The curve is not built from numbered points and has no separate point names.

Visible labels:

- Axes `x` and `y`.
- Horizontal values, left to right: `$-2\pi$`, negative three-halves pi, `$-\pi$`, `$-\frac{\pi}{2}$`, `$0$`, `$\frac{\pi}{2}$`, `$\pi$`, positive three-halves pi, `$2\pi$`, positive five-halves pi.
- The readable values of the three compound labels are `$-\frac{3\pi}{2}$`, `$\frac{3\pi}{2}$`, `$\frac{5\pi}{2}$`. Exact typesetting placement of `π` relative to each small fraction bar is `UNKNOWN` at this Stage A resolution; these encodings record their visible values, not a claimed rearrangement of glyph geometry.
- Vertical values `$1$` and `$-1$`.
- Caption `图 30`.

Axes/strokes:

- Horizontal axis approximately `(127,1773)` to `(1393,1767)`, with right arrowhead.
- Vertical axis approximately `x≈677`, from `y≈1603` to `y≈1895`, upward arrowhead, plain lower tail.
- Curve extends from approximately `(150,1719)` to `(1360,1843)`. Both curve ends occur inside the visible image region, not at an observed labelled domain boundary.
- Curve solid throughout; no dashed curve or guide lines.

Visible extrema and crossings, recorded from the drawing:

| Landmark | Coarse pixel location | Nearest visible axis-labelled coordinate | Qualification |
| --- | --- | --- | --- |
| First summit | `(≈216,≈1694)` | `$(-2\pi,1)$` | Near first `-2π` label |
| First crossing | `(≈320,≈1771)` | `$(-3\pi/2,0)$` | Near negative three-halves-pi label |
| First trough | `(≈437,≈1847)` | `$(-\pi,-1)$` | Near `-π` label |
| Second crossing | `(≈554,≈1769)` | `$(-\pi/2,0)$` | Fraction label/tick is slightly right of curve crossing |
| Middle summit | `(≈677,≈1689)` | `$(0,1)$` | In vertical-axis neighbourhood |
| Third crossing | `(≈795,≈1769)` | `$(\pi/2,0)$` | Near positive half-pi label |
| Second trough | `(≈917,≈1848)` | `$(\pi,-1)$` | Near `π` label |
| Fourth crossing | `(≈1022,≈1768)` | `$(3\pi/2,0)$` | Three-halves-pi label is somewhat right of curve crossing |
| Third summit | `(≈1144,≈1690)` | `$(2\pi,1)$` | Near `2π` label |
| Fifth crossing | `(≈1257,≈1769)` | `$(5\pi/2,0)$` | Near five-halves-pi label |

Observed totals: three upper summits, two lower troughs, five horizontal-axis crossings, two terminal curve strokes. The axis-labelled coordinate readings above are approximate registrations of the visible source drawing, not values computed from a cosine formula.

Endpoint inventory:

- Left end: roughly `(150,1719)`, left of the `-2π` labelled summit, above the horizontal axis. Exact mathematical horizontal/vertical coordinates are **`UNKNOWN`**.
- Right end: roughly `(1360,1843)`, right of the five-halves-pi crossing, below the horizontal axis. Exact mathematical horizontal/vertical coordinates are **`UNKNOWN`**.
- Neither end carries a clearly separate hollow or solid circular endpoint marker. Endpoint openness/closure is **`UNKNOWN`**.
- No left endpoint value such as `-5π/2`, and no right endpoint value such as `3π`, is supplied by these pixels. Do not invent either value or extend the curve to it.

## Physical Page 53 / Printed Page 47

### Object Order, Coarse Boxes And Ownership

| Order / local ID | Kind | Coarse box | Ownership / source state |
| --- | --- | --- | --- |
| 53-P0 | One opening continuation row | `[220,250,285,80]` | `cont` of 52-P2; closes that assertion |
| 53-P1 | Definition/explanation paragraph, eight text rows | `[220,370,1285,615]` | Unit 86 body; closed paragraph; refers to graph 31 |
| 53-P2 | Introductory body row | `[320,1010,610,65]` | Unit 86 body; leads into computed examples |
| 53-P3 | First computed example, three text/formula rows | `[220,1095,565,400]` | Unit 86 body; no exercise number |
| 53-G31 | Single coordinate graph beside body/examples | `[1005,930,455,515]` | Unit 86 body; do not assign by nearest formula as an exercise image |
| 53-C31 | Caption | `[1185,1460,135,55]` | `图 31`; belongs to 53-G31 |
| 53-P4 | Second computed example, two rows | `[215,1530,940,235]` | Unit 86 body; no exercise number |
| 53-P5 | Third computed example, two rows | `[215,1810,1030,245]` | Unit 86 body; no exercise number |
| 53-P6 | Fourth computed example, one visible row | `[410,2125,680,95]` | Unit 86 body; **open**, final comma |
| 53-F | Printed footer | `[1310,2250,160,55]` | Two flanking solid dots and page number 47 |

Graph 31 sits to the right of the short final row of 53-P1, the introduction and first example. Its caption is not part of a mathematical formula row or an example's statement. There is no table on this page.

### Complete Non-Figure Text, Literal Row Ends

53-P0, `cont` of 52-P2:

```text
线向左移动$\frac{\pi}{2}$.
```

The source joins page-52 terminal `曲` and page-53 initial `线` into `曲线`. There is no intervening new heading, task number or omitted complete sentence.

53-P1:

```text
余弦函数在闭区间$[0,\pi]$上是下降的，并且由于连续性，
它取闭区间$[-1,1]$里所有的值. 因此，函数$y=\cos x$在闭区
间$[0,\pi]$上是可逆函数. 在闭区间$[0,\pi]$上余弦的反函数叫做
反余弦，记作$\operatorname{arc\,cos}$. 函数$y=\operatorname{arc\,cos}x$的图象表示在图$31$
中. 这个图象和函数$y=\cos x\ (x\in[0,\pi])$的图象关于直线
$y=x$是对称的. 由反函数的定义得出，$D(\operatorname{arc\,cos})=[-1,1]$，
$E(\operatorname{arc\,cos})=[0,\pi]$，而且反余弦是
减函数.
```

53-P2:

```text
我们来计算几个反余弦的值:
```

53-P3, first body computation, three separate physical rows:

```text
$\operatorname{arc\,cos}\frac{\sqrt{3}}{2}$ [UNKNOWN: 关系符位置可见短横] $\frac{\pi}{6}$，
因为$\cos\frac{\pi}{6}=\frac{\sqrt{3}}{2}$，
而且$\frac{\pi}{6}\in[0,\pi]$；
```

53-C31:

```text
图 31
```

53-P3 first-row relation: at the relation position, a short horizontal stroke is visible. Whether the source contains a second equality stroke that is faint/lost, or prints only one stroke, is **`UNKNOWN`** in this single original-detail view. The bracketed marker above is an uncertainty annotation, not printed source wording. It must not be silently replaced by `=` or treated as a confirmed minus sign.

53-P4, second body computation:

```text
$\operatorname{arc\,cos}\frac{1}{2}=\frac{\pi}{3}$，因为$\cos\frac{\pi}{3}=\frac{1}{2}$，
而且$\frac{\pi}{3}\in[0,\pi]$；
```

53-P5, third body computation:

```text
$\operatorname{arc\,cos}\frac{\sqrt{2}}{2}=\frac{\pi}{4}$，因为$\cos\frac{\pi}{4}=\frac{\sqrt{2}}{2}$，
而且$\frac{\pi}{4}\in[0,\pi]$；
```

53-P6, fourth body computation, `open`:

```text
$\operatorname{arc\,cos}0=\frac{\pi}{2}$，因为$\cos\frac{\pi}{2}=0$，
```

The final visible punctuation is a comma, not a semicolon or full stop. The remaining text of this computation is **`UNKNOWN`**; no interval-membership row is fabricated.

53-F: visible numeral `47`, flanked by one solid dot on each side.

Emphasis inventory:

- 53-P0 is visibly heavy and continues the heavy terminal assertion of 52-P2.
- The defined term `反余弦` at the start of 53-P1's fourth row is visibly heavy.
- The exact start/end of any longer emphasized definition span around the preceding `反函数叫做` wording is **`UNKNOWN`** from this single image view. The text itself is preserved above; no confidently unsupported bold extent is imposed.
- No underline, colored emphasis or italic Chinese explanatory span was observed. Mathematical letter styles are distinct from Chinese body type.

### 53-G31: Every Label, Coordinate, Endpoint And Stroke

One subfigure, one thick solid descending curve. The source graph includes two coordinate axes and **two dashed guides**, not a full grid. There is no second cosine curve, diagonal `y=x` line, reflection construction, named point or interior marked-dot series, although `y=x` is mentioned in the prose.

Labels:

| Label | Approximate position | Source role |
| --- | --- | --- |
| `$y$` | `(≈1180,≈956)` | Vertical-axis label, left of arrow tip |
| `$x$` | `(≈1390,≈1412)` | Horizontal-axis label, below rightward axis |
| `$-1$` | `(≈1087,≈1410)` | Horizontal coordinate at left guide foot |
| `$0$` | `(≈1184,≈1410)` | Origin label, left/below axes intersection |
| `$1$` | `(≈1318,≈1414)` | Horizontal coordinate at lower-right curve termination |
| `$\pi$` | `(≈1240,≈1018)` | Upper ordinate, to right of vertical axis |
| `$\frac{\pi}{2}$` | `(≈1173,≈1207)` | Middle ordinate, to left of vertical axis |
| `图 31` | `(≈1198,≈1490)` | Printed caption |

Stroke inventory:

- Horizontal axis from approximately `(1018,1379)` to `(1444,1384)`, with right arrowhead.
- Vertical axis near `x≈1209..1215`, from `y≈943` to `y≈1439`, with upward arrowhead and a short lower unarrowed tail.
- Horizontal **dashed** guide from approximately `(1103,1016)` to `(1213,1018)`, connecting the upper-left curve region to the vertical axis at the labelled ordinate `π`.
- Vertical **dashed** guide near `x≈1095..1102`, from `y≈1019` to `y≈1380`, down from the upper-left curve region to the horizontal-axis value `-1`. It is not a solid edge or a full-height graph-grid line.
- Thick curve descends from approximately `(1105,1018)` through the vertical-axis neighbourhood `(1210,1201)` to approximately `(1317,1382)`.
- No other guide row/column, source background grid, bounding rectangle or table cell.
- The visible 100-pixel red/blue overlay is preparation metadata, not source instructional structure.

Coordinate/landmark inventory, from visible labels and registrations:

| Landmark | Coarse pixel location | Visible labelled coordinate reading | Endpoint/point status |
| --- | --- | --- | --- |
| Upper-left curve termination | `(≈1105,≈1018)` | `$(-1,\pi)$` | At the two-guide corner region; separate open/closed marker `UNKNOWN` |
| Vertical-axis curve crossing | `(≈1210,≈1201)` | `$(0,\pi/2)$` | Curve crossing, not a separately marked point |
| Lower-right curve termination | `(≈1317,≈1382)` | `$(1,0)$` | At horizontal axis; separate open/closed marker `UNKNOWN` |
| Axes origin | `(≈1208,≈1382)` | `$(0,0)$` | Axes intersection only; not on the curve |
| Upper dashed-guide/vertical-axis meeting | `(≈1213,≈1018)` | `$(0,\pi)$` | Guide meeting, not a curve point |
| Left dashed-guide/horizontal-axis meeting | `(≈1095,≈1380)` | `$(-1,0)$` | Guide foot, not a curve point |

The visibly highest curve position is its upper-left terminal region; the visibly lowest is its lower-right terminal region. No interior extremum was observed.

Neither endpoint has a clearly separable hollow ring or independent solid circular dot. Thick termination ink is present, but **graph-marker openness/closure remains `UNKNOWN`**. The closed prose intervals are preserved independently and are not used to redraw a marker.

Do not extend the source curve beyond either end. Do not add calculated sample points, an unprinted symmetry line, a second curve or a background grid.

## Task-Number Roles And Prose Ownership

- No independent exercise heading or printed exercise number was observed on physical page 52 or 53.
- `29`, `30`, `31` are graph numbers: body references and captions. They are not task numbers.
- `46`, `47` are printed footer page numbers.
- `86` is the already-open ordinary lesson's printed unit number, identified by the authorized TOC lookup and prior-page context; it is not a new heading on either page.
- `146` is prior text context supplied by the user, not a visible task on these pages and not evidence that a new exercise range starts here.
- All four `arc cos` calculations on page 53 are **lesson-body worked computations**, with printed `因为` / `而且` reasoning. They are not separately numbered exercises, imported answers, choices, or new cards.
- The variation table and graphs 29, 30 and 31 belong to lesson prose. They are not exercise-owned images and have no `owner-ex` identity to invent.
- The first three computations end at visible semicolons after their interval-membership rows. The fourth computation is open after its one visible comma-ended row.

## Continuation And Unknown Ledger

| Item | Frozen source fact | State / prohibition |
| --- | --- | --- |
| Prior paragraph -> 52-T | Prior text ends `表里.`; complete table is visible on page 52 | Prior paragraph closed; no empty continuation text |
| 52-P1 | Four rows ending `得出(图30).` | Closed |
| 52-P2 -> 53-P0 | Page 52 ends `正弦曲`; page 53 starts `线向左移动π/2.` | `open` -> `cont`, then closed; preserve actual split inside `曲线` |
| 53-P1 | Eight rows ending `减函数.` | Closed; graph 31 is body-owned |
| 53-P3 / P4 / P5 | Three / two / two visible rows, last punctuation semicolon | Closed computations within body |
| 53-P6 | One row, final comma | Open computation; next row `UNKNOWN` |
| Unit 86 right boundary | No next unit heading or lesson end observed | Open; no completion from TOC/future pages |
| Exercise numbering scope | Matching manifest entries inspected lack declaration | `UNKNOWN`; no book-wide inference |
| Fig. 29 endpoint circles | No clearly separate hollow/filled circles | Marker semantics `UNKNOWN`; preserve termination ink |
| Fig. 29 crossing registration | Labels and thick curve are not exactly registered | Retain coarse observations; do not repair using expected cosine zeros |
| Fig. 30 terminal coordinates | Curve ends have no exact coordinate labels | Both exact terminal coordinates `UNKNOWN` |
| Fig. 30 endpoint circles | No clearly separate hollow/filled circles | Marker semantics `UNKNOWN` |
| Fig. 30 small fraction glyph layout | Compound half-pi labels readable in value | Exact `π`/fraction-bar placement `UNKNOWN` |
| Fig. 31 endpoint circles | Thick curve ends, no clearly separate marker rings/dots | Marker semantics `UNKNOWN`; closed domain text is a distinct fact |
| 53-P3 first relation glyph | A short horizontal stroke is discernible between the two fractions | Full relation glyph `UNKNOWN`; no expected-equality repair |
| Emphasis extent | Heavy concluding assertion and defined term observed | Other exact span boundaries `UNKNOWN`; no expanded emphasis guess |

These are the unresolved Stage A observations. They must not be silently regularized, filled from known function mathematics or turned into presumed candidate errors.

## Stage A Freeze And Handoff Boundary

Stage A source-first transcription, table-cell inventory, graph-label/stroke/landmark inventories, coarse boxes, prose ownership, captions, continuation state and task-number roles are frozen above.

Only textual evidence, existing image paths and their hashes are handed off. Image budget remains **2 / 8 batch, 2 / 24 context, zero crops, six batch slots reserved**.

**WAIT FOR FULL, EXPLICIT PARENT AUTHOR DISCLOSURE BEFORE STAGE B.** Stage B additionally needs explicit authorization for the particular unique crops. Do not peek at author materials, reopen either full page, inspect another page, re-solve the mathematics or proceed to candidate comparison under this Stage A invocation.
