# STEMROBIN-184: book10c physical114-117 independent StageA

Status: COMPLETE StageA. FROZEN UNCHANGED; WAIT for parent consumption and explicit exact author bytes for sole StageB.
Source-first manual observation only. Complete StageA means the authorized observations and evidence record are complete, not that unresolved glyphs or global object boundaries have been proved.
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck
Date: 2026-11-17.

## Scope and isolation

- Authorized source images only: physical0114, 0115, 0116, 0117, each `page.png` at the exact production-source10c114-117 path recorded in ledger.md.
- Each original is opened individually once with `detail: original`, only after dimensions and SHA-256 inspection.
- No grid, template body, current authorMD, earlier review, answer, choice, TOC, adjacent source image, or author artifact is an observation source.
- StageA is an independent source record, not an author comparison, production transcription, corrected edition, source edit, or publication approval.
- One permanent image batch, maximum 8 image loads for this continuing invocation; 4 StageA originals and 4 reserved new essential native crops for sole StageB. No reset or assumed history clearance.
- Parent budget is supplied as 24/24. Return text paths and hashes only, never source image payloads.
- No inferred complete object from physical113. Incoming owner and predecessor continuation are UNKNOWN until later bounded text is disclosed.
- Manual row identifiers below are this review's locators, not authoritative counter results. A stacked fraction is one formula row, not separate numerator/denominator rows.
- Chinese and mathematical Unicode are intentional source transcription. Formulas are recorded as visually read; uncertain glyphs are explicit rather than repaired using algebra.

## Physical0114 / printed108

Source SHA-256: `2980fbc008cd2659ebe3d679425d8c06fa03a3ea31de4acf72e69f73362f730f`
Source dimensions: 1695 x 2580.
Observed open: original load 1/8, once.

### Actual printed rows in reading order

```text
114.T01 [incoming prose fragment] 限。因此，
114.T02 [display] S'(x)=lim_{Δx→0} \frac{ΔS(x)}{Δx}=x^2.
114.T03 [prose] 所以，S(x)是函数 x^2 的原函数，并且由于原函数的基本性质
114.T04 [prose] 可以把它写成 \frac{x^3}{3}+C。为了确定常数 C，我们发现，S(1)=0，
114.T05 [prose] 这是因为当 x=1 时，图50中的图形变成垂直线段，它的面积
114.T06 [prose, trailing formula fragment] 等于零。因此应当这样来选取常数 C，使得 S(1)=\frac{1^3}{3}+C=
114.T07 [prose, continuation of T06] 0，由此得出
114.T08 [display] C=-\frac{1}{3}.
114.T09 [prose] 于是，
114.T10 [display] S(x)=\frac{x^3}{3}-\frac{1}{3}.
114.T11 [prose] 而所求的面积是
114.T12 [display] S(2)=\frac{2^3}{3}-\frac{1}{3}=\frac{7}{3}.
114.T13 [prose transition] 上面进行的讨论，在一般情况下也成立。
114.T14 [bold theorem start] 定理1 设 f 是在闭区间 [a, b] 上非负的连续函数，而
114.T15 [bold theorem] S 是对应曲边梯形的面积（参看图48）。如果 F 是 f 在包含
114.T16 [bold theorem] 闭区间 [a, b] 的区间上的原函数，那么
114.T17 [bold display, right equation number] S=F(b)-F(a).                                      (1)
114.T18 [proof prose] 我们来看这个曲边梯形位于 x 点左边的部分(图52)。这个图形
114.T19 [proof prose] 的面积是 x 的函数，用 S(x)表示它。我们来证明
114.T20 [display, right equation number] S'(x)=f(x).                                      (2)
114.T21 [proof prose] 如果 Δx>0，那么 ΔS(x)=S(x+Δx)-S(x) 是图53中带斜线的
114.T22 [proof prose, outgoing] 图形的面积。因为函数 f 在 x 点是连续的，那么对于任意一个数 ε>0，
114.F01 [footer] • 108 •
```

### Blocks, boundaries and owners

- `114.incoming-area-fragment`: T01-T12. T01 actually begins with the terminal character `限` followed by `。因此，`. This is not a locally observed full sentence beginning. No example number, heading, original givens, initial definition of S, or physical113 owner is supplied. Incoming owner = UNKNOWN; predecessor linkage = UNKNOWN, not proved by the word fragment.
- Within that fragment, T03-T07 are a single prose calculation with T06-T07 splitting the displayed-in-prose equality before the literal `0`. T08 closes determination of C; T09-T10 introduce the resulting S(x); T11-T12 give the requested area and end with a period.
- The suffix calculation is visibly closed at T12, but the whole incoming object is NOT localclosed because its beginning is outside the supplied observations. Do not rename it a complete numbered example or invent its original area question.
- T13 is the printed transition from the preceding discussion to the general theorem.
- `114.theorem-1-statement`: starts with explicit bold `定理1` at T14, includes its nonnegative continuous-function hypothesis, antiderivative hypothesis, interval [a,b], reference to 图48, and equation (1). The full statement closes locally at T17.
- `114.theorem-1-proof`: begins at T18, not a separately printed unsolved task. T18-T20 define the left-of-x partial area with 图52 and state the derivative identity (2). T21-T22 treat Δx>0 and reference the hatched area in 图53. The proof is OPEN at the page end after `ε>0，`; closure must be observed on the supplied next page, not inferred.
- No lesson/section heading, exercise-column heading, numbered unsolved exercise, supplied table, or figure raster appears on this page.

### Figure/table coarse inventory and semantic ownership

- Actual visible figures: none. Actual visible tables: none. Therefore no page114 figure bounding box is invented.
- Text-only 图50 reference (T05) belongs to the UNKNOWN incoming-area-fragment. Its raster is not in the allowed four-source observation yet; no appearance or geometry is inferred.
- Text-only 图48 reference (T15) belongs to theorem1's general curvilinear-trapezoid statement. It is out of this observed page; geometry beyond the printed prose is not invented.
- Text-only 图52 reference (T18) belongs to theorem1 proof's partial-area construction.
- Text-only 图53 reference (T21) belongs to theorem1 proof's positive-Δx increment.
- Footer and outer black scan rules/specks are not theorem content or figures. No neighboring-page content is claimed.

### Uncertainty and coverage

- Formula T02 numerator is observed as ΔS(x); no extra prime is transcribed in that numerator.
- Source's formulas and punctuation are retained as read; no algebraic derivation is added as evidence.
- Local statement closure is proved for theorem1; full proof closure and full incoming object closure are not yet proved.
- All 22 main printed row baselines and the footer have a manual locator. This is visual evidence, not a machine line-count acceptance result.

## Physical0115 / printed109

Source SHA-256: `f995e5700f607944bca43d5e35bb8c0fae59142dedebe0ba97755299228f4891`
Source dimensions: 1695 x 2580.
Observed open: original load 2/8, once.

### Actual printed rows in reading order

Two figures occupy the top band. Their labels are inventoried below, not counted as prose. Two separate captions share a horizontal row.

```text
115.C01 [left caption] 图 52
115.C02 [right caption, same horizontal row as C01] 图 53
115.T01 [incoming proof prose] 就可以找到这样一个数 δ>0，对于任意满足 |Δx|<δ 的 Δx，将会有
115.T02 [prose with formula] f(x)-ε<f(x+Δx)<f(x)+ε。于是，对于满足 0<Δx<δ 的所有 Δx
115.T03 [prose] （正如从图53中所看到的一样），
115.T04 [display] 面积 ABCD<ΔS(x)<面积 KMCD，
115.T05 [prose] 或
115.T06 [display] [f(x)-ε]Δx<ΔS(x)<[f(x)+ε]Δx，
115.T07 [prose] 就是
115.T08 [display, right equation number] f(x)-ε<\frac{ΔS(x)}{Δx}<f(x)+ε.                  (3)
115.T09 [proof prose] 类似地，检验所得不等式对于满足不等式 -δ<Δx<0 的所有负 Δx 也
115.T10 [proof prose] 成立。于是，等式(3)对于满足 0<|Δx|<δ 的所有 Δx 成立。根据极
115.T11 [proof prose] 限的定义，这就是说，
115.T12 [display] lim_{Δx→0} \frac{ΔS}{Δx}=f(x).
115.T13 [proof prose] 但是，根据导数的定义：
115.T14 [display] S'(x)=lim_{Δx→0} \frac{ΔS(x)}{Δx}，
115.T15 [proof prose] 于是得出(2)式。
115.T16 [proof prose] 这样一来，我们得出函数 S(x)是函数 f 的原函数，并且由于原函
115.T17 [proof prose] 数的基本性质，S(x)=F(x)+C，其中 C 是常数。为了求出常数 C，我
115.T18 [proof prose] 们发现，S(a)=0，这是因为当 x=a 时，图52中带斜线的图形变成垂直
115.T19 [proof prose] 线段，它的面积等于零。因此应当这样来选取常数 C，使得等式
115.T20 [display, outgoing proof sentence] S(a)=F(a)+C=0
115.F01 [footer] • 109 •
```

### Blocks, boundaries and owners

- All T01-T20 and both figures/captions belong to `114.theorem-1-proof`, whose locally observed start is physical114.T18. No new heading or exercise owner intervenes.
- T01 completes the incoming continuity sentence from physical114.T22. The cross-page prose splice is `...任意一个数 ε>0，` -> `就可以找到这样一个数 δ>0，...`.
- T01-T08 constitute the positive-increment bounding argument. T04 is the area comparison using ABCD and KMCD; T06 converts it to products; T08 is numbered (3).
- T09-T15 treat negative increments, give the two-sided limit, recall the derivative definition, and explicitly conclude equation (2).
- T16-T20 then return to the constant in S(x)=F(x)+C and the condition S(a)=0. T20 is not the proof end: it has no visible completion `成立` or theorem conclusion on this page, and the preceding prose `使得等式` remains syntactically open.
- No unsolved task, supplied example heading, exercise heading, table, new theorem statement, or lesson/section heading is printed on physical115.

### Figure/table coarse inventory and semantic ownership

Coarse boxes use native [x,y,width,height] estimates from the single original observation. They are semantic inventory boxes, not exact crop/snapping geometry.

`图52`: coarse box approximately [220,270,620,380]; caption approximately [525,680,120,45].

- Left of two side-by-side graphs; horizontal x axis with right arrow and x label; vertical y axis with upward arrow and y label; origin mark read as 0.
- A single nonnegative wavy curve rises from near the y axis, has a local hump, then a dip, then rises rightward. Printed curve label `y=f(x)`.
- A vertical boundary at a and another at x bound the diagonally hatched partial area under the curve and above the horizontal axis. Printed interior area label `S(x)`.
- Printed x-axis labels visibly include `a` and `x`. A farther-right vertical line descends from the curve toward the horizontal axis. No `b` label is confidently visible under that farther-right line in this observation; do not manufacture it from 图53 or the theorem.
- The farther-right boundary line appears lighter/broken in its lower portion; exact solid/dashed classification of that full line is not established at StageA.
- Semantic owner: theorem1 proof, partial area to the left of x. This is the raster referred to at physical114.T18 and physical115.T18, not an independent exercise.

`图53`: coarse box approximately [845,265,675,370]; caption approximately [1085,680,120,45].

- Right graph; horizontal x axis with right arrow/x label; vertical y axis with upward arrow/y label; origin mark read as 0.
- A nonnegative wavy curve with a hump and dip, then rising toward the right boundary. x-axis labels: `a`, `x`, `x+Δx`, `b`.
- Vertical construction at x and at x+Δx; strip between them under the curve and above the axis is diagonally hatched.
- Three horizontal dashed guide levels, labeled at the left `f(x)+ε`, `f(x)`, `f(x)-ε`. The top guide passes through K and M; the lower guide passes through A and B; the middle guide meets the curve at the left strip boundary.
- Printed point labels: K top-left, M top-right; A lower-left, B lower-right; D bottom-left at x, C bottom-right at x+Δx.
- Lower rectangle ABCD and larger upper rectangle KMCD use those named corners. The strip is the proof's ΔS(x); do not add an unprinted `ΔS(x)` label to the diagram.
- Additional vertical boundaries at a and b meet the curve and axis. No numeric ticks, numerical values, table lattice, or independent exercise markers.
- Semantic owner: theorem1 proof, positive increment squeezed between the two rectangle areas. References at physical114.T21 and physical115.T03/T04.

Actual tables: none.

### Uncertainty and coverage

- Physical115.T10 visibly calls (3) `等式(3)` despite T09 saying `不等式`; retained literally. No terminology repair.
- T12 visibly has ΔS without `(x)` in its numerator; T14 has ΔS(x). These are recorded separately, not normalized.
- No graph-derived algebra or missing-label repair is used.
- All 20 main row baselines, both printed caption objects (one shared caption baseline), both graph objects and the footer are represented.
- Theorem1 statement is localclosed on physical114; proof remains OPEN at physical115.T20 pending observed physical116 text. Global predecessor of physical114 remains UNKNOWN.

## Physical0116 / printed110

Source SHA-256: `8ccddcb95f5df74bf631aa8bb34274b6a0fca5fcd39b51158094395dfd3d1ac4`
Source dimensions: 1695 x 2580.
Observed open: original load 3/8, once.

### Actual printed rows in reading order

```text
116.T01 [proof prose at left; formula on same baseline] 成立。由此得                 C=-F(a).
116.T02 [proof prose] 于是，
116.T03 [display, right equation number] S(x)=F(x)-F(a)                                  (4)
116.T04 [proof prose] 因为在图48中带斜线的曲边梯形的面积是 S(b)，也就是 S=S(b)，那
116.T05 [proof prose, closing] 么当 x=b 时，由(4)式得到(1)式。
116.T06 [prose] 我们看到，在大多数情况下，求函数的导数只是遇到计算性质的
116.T07 [prose] 困难，而求原函数就会遇到更多的困难。尤其是不能立刻明白给定的
116.T08 [prose] 函数有没有原函数。由于这个缘故，我们要指出，在区间 I 上任何连续
116.T09 [prose] 函数都有原函数。但是可能出现这种情况，即形式相当简单的某些函
116.T10 [prose] 数的原函数并不能用中学里所学习的函数组合到一起的形式表示出
116.T11 [prose; one unresolved nested exponent glyph] 来。例如，函数 [read as y=2^{x^2}; nested exponent glyph unresolved] 就是这种情况。
116.T12 [bold exercise-column heading] 习题
116.T13 [shared task instruction] 计算由下列直线和曲线所围成的图形的面积：
116.T14 [exercise419] 419. y=x^2，y=0，x=3.
116.T15 [exercise420] 420. y=\frac{1}{x^2}，y=0，x=1，x=2.
116.T16 [exercise421] 421. y=sin x，y=0，0⩽x⩽π.
116.T17 [exercise422] 422. y=\frac{1}{cos^2 x}，y=0，x=0，x=\frac{π}{4}.
116.T18 [exercise423] 423. y=2x-x^2，y=0.
116.T19 [exercise424] 424. y=(x+2)^2，y=0，x=0.
116.T20 [section heading] §20. 积 分
116.T21 [numbered instructional-unit heading] 101. 牛顿-莱布尼茨公式
116.T22 [new-unit prose, outgoing] 在上一小节里我们看到，计算曲边梯形的面积可归结如
116.F01 [footer] • 110 •
```

### Blocks, boundaries and owners

- T01 is the exact observed continuation of physical115.T20: `S(a)=F(a)+C=0` -> `成立。由此得 ...`. The formula C=-F(a) shares that prose baseline; do not count a second display baseline for it.
- T02-T03 supply the numbered identity (4). T04-T05 conclude the theorem1 proof by x=b and explicit reference back to (1).
- `114.theorem-1-proof` is now LOCALCLOSED as a complete supplied proof spanning physical114.T18-physical116.T05, with both supplied figures52/53 and captions. The proof's reference to 图48 remains external; local text completeness does not prove the unseen external raster or global section completeness.
- T06-T11 are a complete post-proof explanatory paragraph: relative difficulty of finding antiderivatives, existence for continuous functions on I, and possible nonrepresentation using school-learned functions. This is instructional prose, not a solved example or an exercise.
- T12 opens an explicitly printed `习题` column/group. T13 supplies one shared instruction for 419-424. Each task's own line is locally complete. Preserve that shared instruction for every eligible task; do not treat these lines as unsupported standalone formulas.
- No locally visible title/number identifies the instructional unit to which this `习题` group belongs. Owner = preceding pre-§20 instructional unit, unit identifier/title UNKNOWN. Do not use TOC or guess a unit number.
- T20 closes the preceding exercise group and starts `§20. 积分`. T21 explicitly opens numbered unit `101. 牛顿-莱布尼茨公式`.
- `101.intro`: locally observed start at T22, OPEN after `如`; its continuation is to be checked on the supplied physical117. No implied full phrase is inserted here.

### Eligible unsolved-task inventory

| Printed task | Source rows | Required shared prompt and givens | Local closure | Figure/table |
| --- | --- | --- | --- | --- |
| 419 | 116.T13-T14 | Calculate area enclosed by listed lines/curves: y=x^2, y=0, x=3 | localclosed | none printed/referenced |
| 420 | 116.T13,T15 | Same shared area instruction: y=1/x^2, y=0, x=1, x=2 | localclosed | none printed/referenced |
| 421 | 116.T13,T16 | Same shared area instruction: y=sin x, y=0, 0⩽x⩽π | localclosed | none printed/referenced |
| 422 | 116.T13,T17 | Same shared area instruction: y=1/cos^2 x, y=0, x=0, x=π/4 | localclosed | none printed/referenced |
| 423 | 116.T13,T18 | Same shared area instruction: y=2x-x^2, y=0 | localclosed | none printed/referenced |
| 424 | 116.T13,T19 | Same shared area instruction: y=(x+2)^2, y=0, x=0 | localclosed | none printed/referenced |

- Exactly six visible unsolved task objects, printed419-424, each one part; no extra axis boundaries, intersections, solutions, numerical areas or adapted variants are added.
- The tasks' source numbering within this visible group is observed, but global book/lesson numbering policy is not established from these four pages.
- The existence assertion and sample function in T08-T11 are not an additional unsolved task.

### Figure/table coarse inventory and semantic ownership

- Actual figures and tables on physical116: none.
- Text-only 图48 reference in T04 belongs to the ending theorem1 proof. No 图48 raster is supplied by the four observed originals so far; no missing raster is replaced.
- No figures are attributed to tasks419-424. Footer and outer scan rules/specks are not instructional diagrams.

### Uncertainty and coverage

- In T11 the visible function is tentatively read as `y=2^{x^2}`. The small raised glyph nested after x is not treated as conclusively decoded from this whole-page observation. It is a narrow unresolved source-pixel item, not an invitation to change the function using mathematical plausibility. An essential native crop may be considered ONLY in the reserved StageB after the exact author bytes are disclosed.
- T16 has printed less-than-with-lower-stroke signs; visual transcription here uses `⩽`, not a conversion to strict `<`. Exact font-glyph encoding is a potential narrow comparison item if the disclosed author representation differs.
- `116.T03` has equation number (4) and no additional full stop transcribed after F(a).
- All 22 main row baselines and the footer are represented. T01's same-row prose/formula, section heading, unit heading, exercise heading and shared instruction are separately identified without artificial row inflation.
- Theorem1 proof and each of 419-424 are localclosed. Preceding instructional unit's start/title and the leading physical113 object's ownership remain globally UNPROVED/UNKNOWN.

## Physical0117 / printed111

Source SHA-256: `0cb266fa62ecab5b0d5587233b13ee77e817179dea55d252181ef3b97c4b20bb`
Source dimensions: 1695 x 2580.
Observed open: original load 4/8, once.

### Actual printed rows in reading order

```text
117.T01 [incoming unit101 prose] 下：写出已知函数的原函数并计算原函数的改变量。以后你们
117.T02 [prose] 将看到，其他许多问题的解答也会归结为这种计算。因为函
117.T03 [prose] 数的原函数有无穷多个，那么很自然地出现一个问题，这种计
117.T04 [prose] 算结果是否与原函数的选取有关呢？实际上是没有关系的。
117.T05 [prose argument] 事实上，设 F 和 Φ 是函数 f 在区间 I 上的两个原函数，那么，
117.T06 [prose argument] 由于原函数的基本性质，就有一个常数 C，使得对于所有的
117.T07 [prose with formula] x∈I，Φ(x)=F(x)+C。于是，如果数 a 和 b 属于区间 I，那么
117.T08 [prose with formula] Φ(b)-Φ(a)=F(b)+C-F(a)-C=F(b)-F(a)，就是说，
117.T09 [prose, closing] 这两个原函数的改变量相等。
117.T10 [new paragraph] 因此，原函数的改变量只决定于已知函数 f 与数 a 和 b。
117.T11 [prose] 因为许多问题的解答归结为计算原函数的改变量，因此
117.T12 [prose] 这种改变量具有专门的名称和符号。
117.T13 [definition start, emphasized/underlined] 定义 函数 f 的原函数的改变量 F(b)-F(a) 叫做函数
117.T14 [definition continuation, emphasized/underlined] f 由 a 到 b 的积分。
117.T15 [notation prose with inline definite integral] 函数 f 由 a 到 b 的积分记作 \int_a^b f(x)dx。数 a 和 b 叫做积
117.T16 [prose, bold terms/inline integral symbol] 分限，a 叫做下限，b 叫做上限。符号 \int 叫做积分号。函数 f 叫
117.T17 [prose, bold terms] 做被积函数。而变量 x 叫做积分变量。端点为 a 和 b 的闭区
117.T18 [prose, bold term] 间叫做积分区间。应当着重指出，积分上限 b 不一定大于积
117.T19 [prose, closing] 分下限 a，既可能 a>b，也可能 a=b。
117.T20 [prose, footnote marker, outgoing] 于是，根据积分的定义*，如果 F'=f 那么
117.N01 [teaching footnote, after separator] * 在许多教材里，把具有给定积分限 a 和 b 的积分叫做“定积分”。因为
117.N02 [teaching footnote] 在这些教材里，原函数或原函数的普遍形式 F(x)+C 叫做“不定积分”。于是，
117.N03 [teaching footnote] 为了区别于“不定积分”，必须给予在我们通常意义下的积分以特殊的名称，也
117.N04 [teaching footnote, closing] 就是“定积分”。我们将不采用这个专门名词。
117.F01 [footer] • 111 •
```

### Blocks, boundaries and owners

- All T01-T20 and N01-N04 belong to locally identified `101. 牛顿-莱布尼茨公式` under `§20. 积分`; its heading was actually supplied on physical116.
- `101.intro-and-independence-argument`: starts at physical116.T22, continues with `...可归结如` -> `下：写出...` at physical117.T01, and closes at T09. It includes a question answered in printed instructional prose, not an eligible unsolved exercise.
- The whole supplied independence argument is locally complete: two antiderivatives F and Φ on I, constant C, equality Φ(x)=F(x)+C, the endpoint increment calculation, and equality of the two increments. It is not labeled `定理` or `例` on the source; do not invent such a heading or number.
- T10 is a complete separate conclusion paragraph. T11-T12 give a complete rationale for naming the increment.
- `101.integral-definition`: explicitly begins with `定义` at T13 and closes at T14. Full supplied definition: the antiderivative increment F(b)-F(a) is the integral of f from a to b.
- `101.notation-and-terminology`: T15-T19 is locally complete. Integral notation has lower a and upper b; terms include integration limits, lower limit, upper limit, integral sign, integrand, integration variable and integration interval. The closing text explicitly permits a>b and a=b; it does not merely assume a<b.
- `101.definition-to-formula-transition`: T20 starts a new sentence and is OPEN at the final main-text word `那么`. The actual resulting formula/theorem body is not supplied here; do not import it from the unit title or general calculus knowledge.
- N01-N04 is one whole locally complete teaching footnote attached to T20's `定义*`. It explains why other textbooks use `定积分` versus `不定积分` and that this source does not adopt the special name. The footnote is transparent to the unfinished main-text continuation, not its completion.
- No numbered unsolved task, exercise-column heading, example heading, new theorem heading, or explicit theorem statement is printed on physical117.

### Figure/table coarse inventory and semantic ownership

- Actual figures: none. Actual tables: none. Figure references: none.
- The two wavy underline segments below the definition's text emphasize the definition; they are not graphs, diagrams, or figure captions.
- A short horizontal footnote separator precedes N01; it is a printed separator rule, not a geometric figure. Coarse location approximately [245,1980,485,15], solely for inventory.
- The bold terms, inline integral signs and integral with bounds are textual/math content, not isolated figure objects.
- Outer scan lines, specks and footer are not lesson content. No adjacent original has been observed.

### Uncertainty and coverage

- Greek antiderivative symbol is recorded as uppercase Φ, distinct from Latin F. No lowercase φ is substituted.
- T15's bounds are visually read as lower a / upper b, and its f(x)dx is retained as printed. No successor formula is guessed.
- Footnote T02/N02 uses the visually read wording `普遍形式`; this observation is not replaced with a modern terminology paraphrase.
- All 20 main row baselines, four teaching-footnote baselines, the actual separator, both underline segments and the footer are represented.
- Unit101 has a proved local start at physical116.T21, several complete supplied subobjects, and an UNPROVED global end beyond physical117.T20.

## Cross-page ownership and closure register

| Review owner | Observed start/end | Supplied local closure | Global claim permitted |
| --- | --- | --- | --- |
| Incoming physical114 area-calculation fragment | 114.T01 terminal `限。因此，` through 114.T12 | ending suffix closes; full object NOT localclosed | physical113 owner, start and exact predecessor linkage UNKNOWN |
| General transition to theorem | 114.T13 | localclosed printed sentence | no missing prior object inferred |
| Theorem1 statement | 114.T14-T17, equation(1) | LOCALCLOSED | no global lesson start/title claim; external 图48 raster unproved |
| Theorem1 proof | 114.T18 through 116.T05 | LOCALCLOSED; figures52/53 and captions supplied | text closure proved, external 图48 existence/geometry not visually verified |
| Post-proof antiderivative discussion | 116.T06-T11 | LOCALCLOSED paragraph; nested exponent unresolved | preceding instructional-unit identity UNKNOWN |
| `习题` shared prompt | 116.T12-T13 | fully supplied | preceding unit identifier/title UNKNOWN |
| Unsolved419-424 | 116.T14-T19, each with T13 | six LOCALCLOSED unsolved tasks | no global numbering-policy assertion, no added boundaries/answers |
| §20 / numbered101 start | 116.T20-T21 | heading objects fully supplied | local start proved, no TOC needed or read |
| Unit101 introductory/independence argument | 116.T22 through 117.T09 | LOCALCLOSED | not a numbered example/theorem/task |
| Increment conclusion | 117.T10 | LOCALCLOSED | no successor content inferred |
| Naming rationale | 117.T11-T12 | LOCALCLOSED | instructional prose |
| Integral definition | 117.T13-T14 | LOCALCLOSED | no missing formula added |
| Integral notation/terminology | 117.T15-T19 | LOCALCLOSED | preserves reversed/equal limits discussion |
| Transition after definition | 117.T20 ends `那么` | OPEN | successor formula and unit101 global end UNPROVED |
| Teaching footnote to definition marker | 117.N01-N04 | LOCALCLOSED | does not close the open main-text sentence |

### Complete supplied owners versus incomplete boundaries

- Complete supplied theorem: theorem1 statement plus its whole locally observed proof; source reference to 图48 is external and unverified.
- Complete supplied example owners explicitly labeled `例`: NONE in these four originals. The incoming S(x)/S(2) calculation is only an ending fragment with UNKNOWN predecessor; the sample function in explanatory prose is not promoted to a numbered example.
- Complete eligible unsolved objects: six, printed419-424, with their shared area instruction. No tasks are extracted from the theorem proof, worked incoming calculation, independence argument, definition or footnote.
- Actual figure inventory: 图52 and 图53 only, both theorem1-proof owned, both on physical115. No tables. No invisible 图48 or 图50 raster is claimed.
- Printed page numbers directly observed: physical114=108, physical115=109, physical116=110, physical117=111. This does not infer any adjacent page's content.

## Frozen StageA uncertainty register

1. Leading physical114 boundary: observed literal `限。因此，`; original physical113 owner, complete prior object and exact predecessor text remain UNKNOWN.
2. Physical116.T11: tentatively `y=2^{x^2}`, with the small nested exponent glyph not conclusively decoded. No algebraic repair.
3. Physical116.T16: non-strict less-than signs are observed; precise encoded glyph representation is not proved by the printed font alone.
4. 图52 farther-right boundary: no b label confidently visible; full solid/broken line classification unresolved. No borrowed 图53 label or geometric regularization.
5. External 图48/图50 references: owners are recorded from printed prose, but those original rasters are outside supplied observations; no adjacent original opened.
6. Physical117 ends main text with `如果 F'=f 那么`. Successor formula and full unit101 end are globally unproved.

## Completion and hold

- COMPLETE StageA: all four authorized originals individually opened exactly once after dimension/hash checks; manual source-first row/block/formula/boundary/owner inventory recorded.
- Source pixels and all other work remain untouched. No image payload is returned to parent.
- Permanent usage now 4/8; sole StageB reserve remains 4/4 NEW essential native crop opens. No reset and no original reopen.
- Both StageA text outputs are FROZEN UNCHANGED. Their exact final hashes are returned externally with the paths; this file does not self-embed its own hash.
- WAIT: parent must consume this frozen StageA and explicitly disclose exact author bytes for the sole StageB. No proactive artifact discovery or author comparison occurs before that disclosure.

