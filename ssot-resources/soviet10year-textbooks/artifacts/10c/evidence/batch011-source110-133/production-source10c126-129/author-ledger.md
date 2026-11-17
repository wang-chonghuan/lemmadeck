# SOURCE AUTHOR Ledger: 10c 0126-0129

Status: AUTHOR COMPLETE; WAIT. This is author evidence, not independent approval,
finalization, assembly, or an acceptance-gate result.

Ticket: STEMROBIN-184, continuation of already-authorized cap3.

Workdir: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Preparation root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129`.

Durable page root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages`.

Only four previously absent durable `page.md` files, this ledger, the handoff,
and three new necessary native crops were written. Other authors' edits were
not overwritten. No workflow was initiated or changed.

## Observation Register

Before every image load, its PNG format, width, height, and SHA-256 were read
from that file. All original pages were loaded individually exactly once with
`detail: original`. Crops preserve native pixel scale, without resizing.

The image order below is permanent for this batch; it was not reset.

| Load | Image under preparation root | Native dimensions | SHA-256 | Purpose |
| --- | --- | --- | --- | --- |
| 1 | `10c/pages/0126/page.png` | 1695 x 2580, PNG | `6d3faa798961a5ec7e1212b54a178653b4703a5b6f3b94bc8736104b0ae9e98b` | Whole original, first and only load |
| 2 | `0126-sum-native.png` | 1280 x 210, PNG | `dfe0b889598c1dc5928f2306abd616ae3a37d4251010134a8bc225b92b062a54` | Resolve lowercase `s'_n` in displayed sum |
| 3 | `10c/pages/0127/page.png` | 1695 x 2580, PNG | `2ad2c49b581a9e884d2735f9b1a548c73bc8e5e6aebec01b21e2cda2b995452b` | Whole original, first and only load |
| 4 | `10c/pages/0128/page.png` | 1695 x 2580, PNG | `f74699e0b56c9b10fdaa77797ab4ba44850d09af75073a238f65116b68008a00` | Whole original, first and only load |
| 5 | `0128-second-interval-native.png` | 1380 x 260, PNG | `62cada42aee691ae7831e61a8009531b1273b92776c50a45b5a141d8d7cea2a1` | Resolve printed `x_1` at interval wrap |
| 6 | `10c/pages/0129/page.png` | 1695 x 2580, PNG | `e1195915cfcd3fa0648339e333d4b4776a86466b353f28e3e5561267a349ef98` | Whole original, first and only load |
| 7 | `0129-example2-wording-native.png` | 1320 x 115, PNG | `d3c9386a5e4e37c24901fd07c74f1a1e018bd9b33d349680ec2fa338cd2726d6` | Resolve source wording `单位点`, not editorially replace it |

Crop rectangles are `[x,y,w,h]` in their respective original pages:

| Crop | Source | Rectangle |
| --- | --- | --- |
| `0126-sum-native.png` | 0126 | `[160,980,1280,210]` |
| `0128-second-interval-native.png` | 0128 | `[110,455,1380,260]` |
| `0129-example2-wording-native.png` | 0129 | `[190,1035,1320,115]` |

Image use: 7/8 permanent batch; 7/24 author context; 3/4 new native crops.
No grid, montage, resize, original reopen, image-bearing parent return,
history reset, or subsequent image batch occurred. Parent was declared at
24/24; this ledger and handoff are text only and do not authorize it to reopen
these images.

## Preparation Identity

Source PDF name:
`10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`.

Source PDF SHA-256 supplied by the existing preparations:
`47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`.

Prepared render metadata: 300 dpi, 1695 x 2580 for each original page.
Profile: `soviet-cn`,
`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.
The PDF and profile were not regenerated or independently rehashed in this
bounded author batch.

| Physical page | Printed page observed | layout.json SHA-256 | page.template.md SHA-256 |
| --- | --- | --- | --- |
| 0126 | 120 | `417dc06c28e7b8221bca2c7f9f4879ab62cb872c590d81d62801cccca14fc35d` | `91f60664ec13b8e4f9651dcc19c476bf159eff82c379007bdd558bdb9e1dddca` |
| 0127 | 121 | `2da6dd7eca9fc0f7c9a9878db6712b80815b2d562abd9d0929ed9e634ad76318` | `a510404960ab11d2b2366a093a42c6e81c9322b29223a2b9f73e58ecd040423f` |
| 0128 | 122 | `ac3f90e63e6926aec5a18d2b6e6355b26640d3655789a6b7865a7475acdd4bc7` | `cdde82de1504df5b6dd048a08cce35d59d8ff15cd974fc8676bdb9757c795eec` |
| 0129 | 123 | `48aac0115ff5196c58211c5562b877c7ca2624339ddd126b478bb37941288dfc` | `a3f024b0363cc5d4d49f47973af999ce76edb773b42629d5cfe6bc32c7576adf` |

The existing layout bands were read as preparation metadata, not used as
authoritative row expectations. No counter or mechanical gate was run.

## Row Register

Block references below are one-based in each authored page's block sequence.
`r` identifies a visually observed printed row within that block. Full row
text is in the corresponding durable `page.md`; the entries below identify
every row, including captions and footers. Figure-internal labels belong to
the figure inventory, not additional prose/caption rows.

Two wrapped formulas in 0128 use one `↵` each, with no simultaneous literal
newline at the same break. Their two printed rows are separately identified
here. Fractions, limits, and superscripts do not manufacture extra rows.
`samerow` captions are two distinct textual blocks sharing one printed row.
This is a model-authored observation register, not a machine row-count result.

### 0126: Printed 120

| Block | Type and markers | Printed row identities |
| --- | --- | --- |
| `p0126#1` | `p cont`, closed at end | r01 `余下的是当...用公式`; r02 the two integral definitions; r03 `（当a>b时）`; r04 `定义积分...证明牛`; r05 `顿-莱布尼兹公式...牛顿-莱布尼兹`; r06 `公式在最后出现...是简单`; r07 `地把它当作积分的定义．` |
| `p0126#2` | `p`, complete supplied exposition | r01 `在不知道原函数明显的解析式...地计`; r02 `算积分...下面的和式：`; r03 full lowercase `s'_n` trapezoidal sum; r04 `当f是正值函数...是由折线`; r05 `围成的许多曲边梯形的面积．` |
| `p0126#3` | `fig 图57` | Entire figure, no prose body rows; inventory below |
| `p0126#4` | `fig 图58 owner-ex 444` | Entire figure, no prose body rows; inventory below |
| `p0126#5` | `cap 图57` | r01 `图 57` |
| `p0126#6` | `cap 图58 samerow` | r01 `图 58`, same printed row as `p0126#5/r01` |
| `p0126#7` | `exhead` | r01 `习题` |
| `p0126#8` | `ex 444`, complete | r01 `444.* 函数f的图象...S_3表示`; r02 `函数f由a到b的积分？` |
| `p0126#9` | `ex 445`, complete | r01 `445.* 对于n=9...积分...并把`; r02 `它与真值相比较．` |
| `p0126#10` | `foot` | r01 printed page `120` |

### 0127: Printed 121

| Block | Type and markers | Printed row identities |
| --- | --- | --- |
| `p0127#1` | `h3` | r01 `105*. 变力所作的功` |
| `p0127#2` | `p`, introductory context | r01 `设质点在力P...力是不变`; r02 `的...S...这个力`; r03 `所作的功A...现在我们来推`; r04 `导计算变力所作的功的公式．` |
| `p0127#3` | `p open`, supplied formula and proof stem | r01 `设质点...Ox轴上的`; r02 `投影是x的函数...假定f是`; r03 `连续函数...M(a)...M(b)`; r04 `（图59）...下面的`; r05 `公式计算：`; r06 `A=积分` and equation label `（1）` on the same row |
| `p0127#4` | `fig 图59` | Entire figure; inventory below |
| `p0127#5` | `cap 图59` | r01 `图 59` |
| `p0127#6` | `fig 图60` | Entire figure; inventory below |
| `p0127#7` | `cap 图60` | r01 `图 60` |
| `p0127#8` | `p cont open`, same whole proof | r01 `我们把区间[a,b]...Δx=(b-a)/n：`; r02 interval list, `（图60）．在整个区间[a,b]上力` |
| `p0127#9` | `foot` | r01 printed page `121` |

### 0128: Printed 122

| Block | Type and markers | Printed row identities |
| --- | --- | --- |
| `p0128#1` | `p cont`, closes supplied proof | r01 `所作的功等于...因为f`; r02 `是x的连续函数...力在这`; r03 `个小段...f(a)(x_1-a)...我们忽`; r04 `略了f...第二个小段[x_1,`; r05 `x_2]上...力在第n个小`; r06 `段上...f(x_{n-1})(b-x_{n-1})...近似地`; r07 `得出力在整个区间[a,b]上所作的功：`; r08 first row of `A≈A_n=...Δx`; r09 second row `=(b-a)/n[f(a)+...+f(x_{n-1})],`; r10 `并且把区间...精确度越大．`; r11 `当然...近似等式就变成精`; r12 `确等式：`; r13 displayed limit identity; r14 `因为当n→∞时...由a到b的`; r15 `定积分（参看第104小节），于是推出（1）式．` |
| `p0128#2` | `p open`, WHOLE worked example 1 | r01 `例1 拉长5cm...为了使`; r02 `弹簧伸长5cm，应当作多少功？`; r03 `根据虎克定律...可由公式`; r04 `F=kx`; r05 `算出...（图61），O点对应于弹簧的`; r06 `自由状态．由题设条件得出，`; r07 `3=k·0.05.`; r08 `于是，k=60，力F=60x，根据（1）式，功` |
| `p0128#3` | `foot` | r01 printed page `122` |

The interval row break r04/r05 and the displayed-equation break r08/r09
are the only `↵` breaks. No illustration or caption is printed on this page;
the `图61` reference is prose awaiting the already-observed next page.

### 0129: Printed 123

| Block | Type and markers | Printed row identities |
| --- | --- | --- |
| `p0129#1` | `p cont`, closes example 1 calculation | r01 complete printed integral/evaluation identity ending `0.075（焦耳）．` |
| `p0129#2` | `fig 图61` | Entire spring figure, belongs to example 1 |
| `p0129#3` | `fig 图62` | Entire axis figure, belongs to example 2 despite preceding its stem |
| `p0129#4` | `cap 图61` | r01 `图 61` |
| `p0129#5` | `cap 图62 samerow` | r01 `图 62`, same printed row as `p0129#4/r01` |
| `p0129#6` | `p`, WHOLE complete worked example 2 | r01 `例2 设质量为m...O点．按照`; r02 `牛顿定律...质量为1的质点．当把`; r03 `具有单位质量的单位点...计算引力`; r04 `所作的功（图62）．`; r05 `如果质量为1...它上面的`; r06 `引力`; r07 `F=-γ(m·1)/x^2,`; r08 `其中γ...坐标原点．所求的`; r09 `功可以用（1）式...当0<a<b时，它取负值：`; r10 complete printed integral/evaluation identity ending `γm(1/b-1/a).` |
| `p0129#7` | `exhead` | r01 `习题*` |
| `p0129#8` | `ex 446`, complete | r01 `446. 设已知压缩弹簧1cm...弹簧4cm`; r02 `应当耗费多少功？` |
| `p0129#9` | `ex 447 open`, WHOLE exercise boundary not yet observed | r01 `447. а) 设4牛顿...为了使弹簧伸长`; r02 `8cm，应当作多少功？` |
| `p0129#10` | `foot` | r01 printed page `123` |

## Whole Objects and Boundaries

| Stable author identity | Complete source grouping | Boundary and downstream classification |
| --- | --- | --- |
| `10c-104star-integral-definition-tail` | Inherited 0125 last `p open` through `p0126#1` | Left predecessor text is unapproved inherited author evidence; 0126 pixels establish actual `cont` and local closure. Preserve the definition discussion, not an unsolved seed. |
| `10c-104star-trapezoidal-exposition` | `p0126#2`, `p0126#3`, `p0126#5` | Full supplied exposition with fig57 and caption; closed in 0126; exclude all from unsolved seeds. |
| `10c-104star-ex444` | `p0126#8`, `p0126#4`, `p0126#6` | Actual complete unsolved exercise 444* with fig58 and caption; do not attach fig58 to the preceding exposition by proximity. No answer added. |
| `10c-104star-ex445` | `p0126#9` | Actual complete unsolved exercise 445*, no figure; no evaluation or comparison added. |
| `10c-105star-work-formula-proof` | Context `p0127#2`; whole proof `p0127#3` + `p0127#8` + `p0128#1`; figures `p0127#4/#6`; captions `p0127#5/#7` | Keep continuous assumptions, statement/equation(1), subdivisions, approximation, limit, conclusion, figures, and captions together. `open` at 0127#3, `cont open` at 0127#8, `cont` closes at 0128#1. Entire provided proof excluded from unsolved seeds. |
| `10c-105star-worked-example1` | `p0128#2` + `p0129#1`; fig61 `p0129#2`; caption `p0129#4` | WHOLE stem + Hooke-law solution + evaluation + figure + caption. Open from 0128, solved and fully observed in 0129. Exclude every part, including its question-shaped stem, from unsolved seeds. |
| `10c-105star-worked-example2` | `p0129#6`; fig62 `p0129#3`; caption `p0129#5` | WHOLE gravity stem + printed solution + sign explanation + complete evaluation + figure + caption. Closed before `习题*`; exclude every part from unsolved seeds. |
| `10c-105star-ex446` | `p0129#8` | Actual complete unsolved exercise; not example 1 or 2; no answer added. |
| `10c-105star-ex447` | `p0129#9` | Actual unsolved exercise; only а) observed. Whole exercise OPEN / right UNKNOWN pending 0130. A complete subpart sentence does not establish whole-exercise closure. |

Incoming evidence before observing 0126:

- Actual unit 104* begins at physical 0124, not 0125.
- The inherited 0125 last open paragraph ends with the definition
  `integral_a^b f dx = lim S_n(a,b), (2)`.
- That is text from an independent author, not independently approved pixels.
- Keep 0125 right UNKNOWN until actual 0126 observation.

After observing 0126:

- Its first words `余下的是当a≥b时，用公式` are a continuation of that
  definition-construction discussion.
- `p0126#1` ends the continuation at `地把它当作积分的定义．`.
- 0126 subsequently supplies the trapezoidal exposition and exercises 444*,445*.
- 0127 visibly starts unit 105*. Thus the unit boundary between 104* and 105*
  is locally observed, without retroactively approving 0124 or 0125.

Internal page boundaries:

- 0126 -> 0127: no open exercise crosses; a new unit 105* begins.
- 0127 -> 0128: complete proof remains open; exact textual join is
  `在整个区间[a,b]上力` + `所作的功等于...`.
- 0128 -> 0129: example 1 remains open; exact join is
  `根据（1）式，功` + the printed `A=...` calculation.
- 0129 -> 0130: exercise 447 and unit 105* right boundary UNKNOWN. No 0130
  pixels or text were read in this batch.

No standalone theorem heading is printed in these four pages. The supplied
formula-with-proof object is nevertheless retained whole as listed above.

## Figure Inventory

All boxes below are model-coarse `[x,y,w,h]` in original-page coordinates,
not precision crop boundaries or snapped geometry. Component boxes are
descriptive, may overlap, and must not be reused as finalized pixel claims.
Each numbered figure is one complete original object; captions are separate
text blocks.

### Fig57: 0126, p0126#3

Whole coarse box: `[120,1265,650,435]`.
Text ownership: `p0126#2`, caption `p0126#5`.

- Right-pointing horizontal x-axis, coarse `[125,1535,645,90]`; labels
  `x_0`, `x_1`, `0`, `x_2`, `x_{n-1}`, `x_n`, and axis `x`.
- Upward y-axis crossing x-axis at printed origin `0`, coarse
  `[250,1270,60,425]`, label `y`.
- Continuous positive wave-shaped top curve, coarse `[145,1350,580,160]`,
  with a left local high part, lower middle, and rising right part.
- Piecewise straight inscribed top boundary, multiple vertical subdivision
  lines, and diagonal hatching down to the horizontal axis, coarse
  `[165,1360,510,205]`.
- Labeled x positions are ordered left-to-right as printed. Intermediate
  subdivisions are visible but unnumbered; no numerical n or queried values
  are invented. Preserve curve versus straight-chord distinction.
- Complete printed caption `图 57` lies below the box and shares its row
  with fig58's caption.

### Fig58: 0126, p0126#4

Whole coarse box: `[790,1280,590,430]`.
Exercise ownership: 444*, `p0126#8`; caption `p0126#6`.

- Right-pointing x-axis, coarse `[795,1550,580,70]`, label `x`.
- Upward y-axis and origin `0`, coarse `[1040,1290,60,415]`, label `y`.
- Continuous curve with left positive lobe, middle negative lobe, right
  positive lobe, coarse `[800,1395,535,275]`.
- Left vertical boundary at `a`, coarse `[835,1400,45,210]`; right boundary
  at `b`, coarse `[1260,1440,50,185]`.
- Three diagonally hatched curve/axis regions with printed labels:
  `S_1` left above axis (coarse `[850,1405,170,165]`),
  `S_2` middle below axis (coarse `[1010,1560,185,105]`),
  `S_3` right above axis (coarse `[1180,1450,110,130]`).
- Curve crosses the x-axis between the first and second regions, and
  between the second and third; no coordinates are printed for those
  crossings. Do not infer or add their values.
- Complete printed caption `图 58`, `samerow` with fig57 caption.
- No signed-area answer or equivalent integral identity was authored.

### Fig59: 0127, p0127#4

Whole coarse box: `[570,1375,550,150]`.
Whole proof ownership: `10c-105star-work-formula-proof`;
caption `p0127#5`.

- Horizontal right-pointing x-axis, coarse `[575,1430,540,85]`.
- Three collinear indicated points: origin `0` (coarse `[630,1435,50,75]`),
  `a` (coarse `[720,1435,50,75]`), `b`
  (coarse `[925,1430,50,75]`), ordered `0,a,b`.
- Point a labeled `M(a)` above the axis, coarse `[715,1380,95,60]`;
  point b labeled `M(b)` above, coarse `[915,1380,95,60]`.
- Axis endpoint label `x`; no scale, distances, force arrow, or additional
  numeric values printed.
- Complete printed caption `图 59`.

### Fig60: 0127, p0127#6

Whole coarse box: `[540,1810,645,110]`.
Whole proof ownership: `10c-105star-work-formula-proof`;
caption `p0127#7`.

- Horizontal right-pointing x-axis, coarse `[545,1820,630,90]`,
  endpoint label `x`.
- Printed points/labels: origin `0` near x580; `x_0=a` near x660;
  `x_1` near x740; `x_2` near x820; `x_3` near x895;
  one unlabelled intermediate point near x975; `b=x_n` near x1055.
  Labels sit below their corresponding indicated positions.
- All points lie on one axis. Equal-length subdivision is supplied by
  the proof, not an exact pixel-spacing assertion or a claim of n=5.
- No physical apparatus, y-axis, force arrows, or values occur.
- Complete printed caption `图 60`.

### Fig61: 0129, p0129#2

Whole coarse box: `[245,520,495,260]`.
Whole worked-example-1 ownership: `p0128#2` + `p0129#1`;
caption `p0129#4`.

- Fixed wall with diagonal hatch on its left, coarse `[245,525,60,250]`.
- One horizontal coiled spring attached to wall, coarse
  `[295,580,255,55]`.
- Right-pointing force arrow at spring's right end, coarse
  `[535,545,150,80]`, printed `F` above it.
- Horizontal right-pointing x-axis starting beside wall, coarse
  `[290,660,445,75]`, axis-end label `x`.
- Free-state position printed `0` below axis, coarse `[445,660,40,80]`;
  stretched endpoint position printed `x`, coarse `[515,655,50,80]`.
  Prose names the free-state point `O`; the wall is left of both
  positions and is not asserted to be the coordinate origin.
- Vertical dashed guide from spring's right endpoint to its axis
  projection at x, coarse `[530,620,20,70]`, with a dot at the axis.
- Complete caption `图 61`, same printed row as fig62 caption.
- Do not import the exercise446/447 values into this example figure.

### Fig62: 0129, p0129#3

Whole coarse box: `[785,620,685,90]`.
Whole worked-example-2 ownership: `p0129#6`;
caption `p0129#5`.

- Horizontal right-pointing x-axis, coarse `[790,625,675,75]`,
  axis endpoint label `x`.
- Four collinear point dots with below-axis labels, ordered
  `0` near x880, `a` near x1005, `x` near x1170, `b` near x1340.
- The prose fixes the mass-m point at `O` and locates the unit-mass
  point at x; its printed condition is `0<a<b`. No mass text or force
  arrow is added to the source image inventory.
- No y-axis, scale, numeric values, or extra points occur.
- Complete caption `图 62`, `samerow` with fig61 caption.
- Preserve attribution to example 2 despite the image/caption appearing
  above its stem.

## Fidelity Notes and Exclusions

- Cyrillic subpart `а)` in 447 is U+0430, not Latin `a)`. No other
  lettered subpart appears in this batch.
- Preserve all printed closed intervals and integral limits. There is no
  open French-style interval in these four pages; none was converted.
- 0126 printed lowercase `s'_n` in the exposition and uppercase `S'_n`
  in exercise445* are preserved separately.
- 0128 interval endpoint `x_1` was resolved from a necessary native crop;
  it is not an erratum.
- 0129 source phrase `具有单位质量的单位点` was confirmed from a necessary
  native crop and preserved without editorial correction.
- No confirmed mathematical erratum was identified; all four `errata`
  arrays remain empty. No mathematics was solved, repaired, or replaced.
- Scan-edge rules and isolated margin spots were observed as non-content.
  No `count_exclusions`, exact exclusion boxes, counter overrides, or
  expected-row-count claims were created.
- Exclude the integral-definition/exposition, whole work-formula proof,
  example1, and example2 (stems, solutions, figures, captions, sign and
  evaluation rows included) from later unsolved seeds.
- Actual unsolved items are 444*,445*,446 and incomplete WHOLE 447 only.
  No answers, interactions, or choice alternatives were produced.

## Durable Author Hashes

SHA-256 read after authoring the four durable files:

| Durable file under page root | SHA-256 |
| --- | --- |
| `0126/page.md` | `d839b623397ee979f075527b1afd9159f483e7a7abafe3c1be26a9a0b64822f9` |
| `0127/page.md` | `2136c995a492741899fc427ed0e8eefa1b89a2d4a3d70b4e6512fc2ae3afde9a` |
| `0128/page.md` | `0e57a6f1446dd19e2536e440c850950e1c2fb2958b202dd4185b1c481adf2091` |
| `0129/page.md` | `91966cb7658bff0df2b28bea717d17d9a53aca3622fb87bd5df8771732e1f9c1` |

No finalize, assemble, vectorize, counter, gate, test, Git, database,
publisher, modern edition, answer/choice, or workflow command was run.
The parent can integrate independently approved earlier pages separately;
this ledger does not claim approval for this batch or its predecessor.

AUTHOR COMPLETE; WAIT for parent integration/review direction.
