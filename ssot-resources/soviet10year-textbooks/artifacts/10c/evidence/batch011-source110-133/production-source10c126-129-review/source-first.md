# SOURCE-FIRST 126-129 Stage A

Status: FROZEN COMPLETE FOUR-PAGE STAGE A. WAIT FOR PARENT CONSUMPTION.
Independent source-only observation; not an author page artifact. Stage B author bytes NOT READ.
Ticket: STEMROBIN-184. Date: 2026-11-17.
Workdir: /Users/yong/.codex/worktrees/a07e/lemmadeck

## Isolation

- Only original pixels authorized: production-source10c126-129/10c/pages/0126..0129/page.png, beneath this ticket's tmp directory.
- No grids, templates, author pages, other reviews, answer material, choices, TOC, preceding/following page pixels, or other-chat content read.
- Previous physical page 0125 and its owner: UNKNOWN. No lesson ID, section ancestry, or predecessor content inferred.
- This is an observational transcript with row IDs, not cap1 page.md/page.json, a solution, or a math repair.
- Printed wraps are separate rows. Tall fractions/integral limits on one baseline remain a single printed row. Caption rows are text, figure-internal labels are figure objects.
- Coarse boxes below are observational estimates in original pixels [x,y,w,h], not executable crops or precision boundaries.
- No count exclusions, counter patches, gates, tests, Git, database, publishers, workflow updates, or other-chat messages.

## Physical 0126 / Printed 120

Source: /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/10c/pages/0126/page.png
Original dimensions before viewing: 1695 x 2580.
Original SHA-256 before viewing: 6d3faa798961a5ec7e1212b54a178653b4703a5b6f3b94bc8736104b0ae9e98b.
View: original once, detail=original; image load 1.

### Printed Rows

The following is a source-first reading. LaTeX represents visible mathematics without solving it; numbered row tags are review identifiers, not source content.

| Row | Kind / Object | Printed content |
| --- | --- | --- |
| 126-R01 | continuation prose P126-A | 余下的是当 $a\geq b$ 时，用公式 |
| 126-R02 | display, same object | $\int_a^a f(x)dx=0,\qquad \int_a^b f(x)dx=-\int_b^a f(x)dx$ |
| 126-R03 | display qualifier, true new row | （当 $a>b$ 时） |
| 126-R04 | prose, same object | 定义积分，并且根据新的定义证明（1）式．由它就不难证明牛 |
| 126-R05 | prose, same object | 顿-莱布尼兹公式．这样建立积分理论以后，牛顿-莱布尼兹 |
| 126-R06 | prose, same object | 公式在最后出现，可是按我们的教科书的讲法，实质上是简单 |
| 126-R07 | prose, same object; close | 地把它当作积分的定义． |
| 126-R08 | prose P126-B | 在不知道原函数明显的解析式的情况下，可以利用（2）式近似地计 |
| 126-R09 | prose, same object | 算积分．但最好利用下面的和式： |
| 126-R10 | display, same object | $s'_n=\frac{b-a}{n}\left[\frac12 f(x_0)+f(x_1)+f(x_2)+\cdots+f(x_{n-1})+\frac12 f(x_n)\right],$ |
| 126-R11 | prose, same object | 当 $f$ 是正值函数时，如图 57，它等于“内接于”曲边梯形且上面是由折线 |
| 126-R12 | prose, same object; close | 围成的许多曲边梯形的面积． |
| 126-R13-L | caption F57 | 图 57 |
| 126-R13-R | caption F58, same physical row as left caption | 图 58 |
| 126-R14 | exercise heading H126-E | 习题 |
| 126-R15 | exercise E444, first row | 444.* 函数 $f$ 的图象如图 58，怎样用面积 $S_1$、$S_2$ 和 $S_3$ 表示 |
| 126-R16 | exercise E444, true wrap; close | 函数 $f$ 由 $a$ 到 $b$ 的积分？ |
| 126-R17 | exercise E445, first row | 445.* 对于 $n=9$，利用和式 $S'_n$ 近似计算积分 $\int_0^{\frac{\pi}{2}}\sin x\,dx$ 并把 |
| 126-R18 | exercise E445, true wrap; close | 它与真值相比较． |
| 126-R19 | footer | · 120 · |

### Objects And Ownership

- P126-A (R01-R07): starts as a continuation ("余下的是"); previous owner UNKNOWN. It closes with the integral-definition discussion. Visible references "(1)" and "(2)" do not authorize reconstruction of those prior formulas.
- P126-B (R08-R12): new paragraph introducing a supplied approximation sum and its geometric interpretation. This is teaching prose plus a provided formula, not an unsolved exercise or a numbered worked example.
- F57: coarse box [125,1270,650,430], excluding its caption. One positive wavy curve above a horizontal x-axis; an upward y-axis crosses the x-axis at marked 0. Vertical partition segments, diagonal hatching, and piecewise straight top edges under/near the smooth curve are visible. Baseline labels, left to right: $x_0$, $x_1$, $0$ at the y-axis, $x_2$, $x_{n-1}$, $x_n$, and axis $x$ at the right arrow; $y$ labels the upper vertical arrow. Several unlabeled interior vertical partitions are visible; no exact n, coordinate values, or equal-spacing assertion is inferred from this drawing. Caption is separate R13-L. Ownership is explicit teaching prose P126-B, which names 图 57.
- F58: coarse box [785,1290,610,415], excluding its caption. A continuous wavy curve crosses the horizontal x-axis twice inside endpoints a and b. Three diagonal-hatched regions: $S_1$ above the axis on the left, $S_2$ below the axis in the middle, $S_3$ above the axis on the right. Vertical endpoint segments at a and b bound the displayed areas; horizontal rightward arrow is $x$, upward vertical arrow is $y$, origin label is 0. The vertical y-axis passes through the negative middle region. No intersection coordinates, area values, or symmetry asserted. Caption is R13-R. Explicit owner: unsolved E444, which names 图 58; do not place F58 in prose merely because its pixels precede the exercise heading.
- H126-E introduces the two printed unsolved exercises E444 and E445, each visibly starred; retain stars as source facts, not as new numbering.
- E444: two printed rows, complete question; owns F58 and its caption. No supplied solution appears on this page.
- E445: two printed rows, complete question; no figure association stated. The $\pi/2$ upper integral limit and its fraction are inside R17, not additional printed rows. The question's displayed letter is uppercase $S'_n$; the teaching display at R10 appears lowercase $s'_n$. Record the visible distinction; do not normalize or repair.
- Footer is a separate printed object, not teaching prose.

### Row And Boundary Notes

- Prose/display rows: 12. Caption physical rows: 1 (two captions). Heading: 1. Exercise rows: 4. Footer: 1. Independent observed physical text rows: 19, excluding figure-internal text.
- R02 is one row of two inline-integral identities. R03 is a genuine separate qualifier row. R10 is one tall-fraction formula row. R17 is one tall-integral/fraction row; R18 is a true wrap.
- P126-A cannot be assigned a previous lesson owner using this four-page evidence. P126-B and E444/E445 end locally. No bottom-open prose or exercise stem.
- Visible top/bottom border marks and right-margin specks are noted only as visible scan marks; no noise classification, neighboring-page comparison, pixel removal, or count exclusion performed.

## Physical 0127 / Printed 121

Source: /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/10c/pages/0127/page.png
Original dimensions before viewing: 1695 x 2580.
Original SHA-256 before viewing: 2ad2c49b581a9e884d2735f9b1a548c73bc8e5e6aebec01b21e2cda2b995452b.
View: original once, detail=original; image load 2.

### Printed Rows

| Row | Kind / Object | Printed content |
| --- | --- | --- |
| 127-R01 | unit heading H105 | 105*. 变力所作的功 |
| 127-R02 | prose P127-A | 设质点在力 $P$ 的作用下沿直线运动．如果作用力是不变 |
| 127-R03 | prose, same object | 的，而所通过的路程等于 $S$，那么，大家由物理学知道，这个力 |
| 127-R04 | prose, same object | 所作的功 $A$ 等于力 $P$ 与所通过的路程 $S$ 的积．现在我们来推 |
| 127-R05 | prose, same object; close | 导计算变力所作的功的公式． |
| 127-R06 | supplied statement P127-B | 设质点在力的作用下沿 $Ox$ 轴运动，这个力在 $Ox$ 轴上的 |
| 127-R07 | same object | 投影是 $x$ 的函数，我们用 $f(x)$ 来表示它．同时我们假定 $f$ 是 |
| 127-R08 | same object | 连续函数．在这个力的作用下，质点由点 $M(a)$ 移动到点 $M(b)$ |
| 127-R09 | same object | （图 59）．我们来证明，在这种情况下，功 $A$ 可以按照下面的 |
| 127-R10 | same object | 公式计算： |
| 127-R11 | supplied display, same object; close | $A=\int_a^b f(x)dx.$　（1） |
| 127-R12 | caption F59 | 图 59 |
| 127-R13 | caption F60 | 图 60 |
| 127-R14 | supplied derivation P127-C | 我们把区间 $[a,b]$ 分成 $n$ 个同样长度的小段 $\Delta x=\frac{b-a}{n}$： |
| 127-R15 | same derivation; bottom-open | $[a,x_1],[x_1,x_2],\cdots,[x_{n-1},b]$（图 60）．在整个区间 $[a,b]$ 上力 |
| 127-R16 | footer | · 121 · |

### Objects And Ownership

- H105 is an explicit new unit heading. Printed star belongs to 105; it is not a new exercise marker. No chapter/section or TOC identity read.
- P127-A: complete four-row introductory paragraph contrasting constant force and variable force. This is supplied exposition, not an exercise.
- P127-B: complete five-row statement followed by supplied formula (1). It states continuity and endpoint movement, then promises a proof. Preserve the statement and formula as teaching content; do not turn it into an unanswered exercise.
- F59: coarse box [570,1380,550,140], caption excluded. Single horizontal rightward x-axis, three marked points ordered 0, a, b. Above a is $M(a)$, above b is $M(b)$; x labels the right arrow. No y-axis, force-vector arrow, numeric coordinates, or extra trajectory shown. Explicit reference at R09 binds it to P127-B / unit 105.
- F60: coarse box [545,1810,635,105], caption excluded. Single horizontal rightward x-axis with seven visible point marks in the shown span, including the origin and partition marks. Labels below, left to right: 0, $x_0=a$, $x_1$, $x_2$, $x_3$, then one unlabeled later mark, $b=x_n$, and x at the arrow. Do not infer the numeric value of n from a schematic. Explicit reference at R15 binds it to P127-C / unit 105, even though figure and caption precede the referring paragraph.
- P127-C: supplied proof/derivation of (1), starts at R14 and remains OPEN at R15 after "上力". Its text continuation must be sourced only from physical 0128, not guessed.
- Footer is independent of the open derivation and must not interrupt its object ownership.
- No exercise heading, numbered unsolved question, standalone worked example, or formal separately titled theorem appears on this page.

### Row And Boundary Notes

- Heading: 1. Prose/display: 12 (P127-A 4; P127-B 6 including display; P127-C 2). Separate captions: 2. Footer: 1. Independent observed physical text rows: 16, excluding figure-internal labels.
- R11's integral limits are one printed row. R14's fraction is one printed row. R15 is a genuine new printed row of interval text and continuing prose, not the denominator of R14.
- Top boundary is a new heading, not a continuation of E445. Bottom boundary is P127-C OPEN; F60's instructional ownership stays with this proof.
- Visible border marks and left-margin dots are only noted as visible scan marks; none are classified or excluded.

## Physical 0128 / Printed 122

Source: /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/10c/pages/0128/page.png
Original dimensions before viewing: 1695 x 2580.
Original SHA-256 before viewing: f74699e0b56c9b10fdaa77797ab4ba44850d09af75073a238f65116b68008a00.
View: original once, detail=original; image load 3.

### Printed Rows

| Row | Kind / Object | Printed content |
| --- | --- | --- |
| 128-R01 | supplied derivation P128-A, continuation of P127-C | 所作的功等于这个力在所得各小段上所作的功的和．因为 $f$ |
| 128-R02 | same object | 是 $x$ 的连续函数，所以在小段 $[a,x_1]$ 相当小的情况下，力在这 |
| 128-R03 | same object | 个小段上所作的功近似地等于 $f(a)(x_1-a)$，在这里，我们忽 |
| 128-R04 | same object | 略了 $f$ 在这个小段上的变化．类似地，力在第二个小段 $[x_1,$ |
| 128-R05 | same object, true wrap in interval text | $x_2]$ 上所作的功近似地等于 $f(x_1)(x_2-x_1)$．等等．力在第 $n$ 个小 |
| 128-R06 | same object | 段上所作的功近似地等于 $f(x_{n-1})(b-x_{n-1})$．于是，近似地 |
| 128-R07 | same object | 得出力在整个区间 $[a,b]$ 上所作的功： |
| 128-R08 | display, first true printed row | $A\approx A_n=f(a)\Delta x+f(x_1)\Delta x+\cdots+f(x_{n-1})\Delta x$ |
| 128-R09 | display, second true printed row, continuation | $=\frac{b-a}{n}[f(a)+f(x_1)+\cdots+f(x_{n-1})],$ |
| 128-R10 | supplied derivation, same object | 并且把区间 $[a,b]$ 分成的小段越短，近似等式的精确度越大． |
| 128-R11 | same object | 当然，如果当 $n$ 趋向无限大时取极限，这个近似等式就变成精 |
| 128-R12 | same object, true prose wrap | 确等式： |
| 128-R13 | display, same object | $A=\lim_{n\to\infty}A_n=\lim_{n\to\infty}\left\{\frac{b-a}{n}[f(a)+f(x_1)+\cdots+f(x_{n-1})]\right\}.$ |
| 128-R14 | supplied derivation, same object | 因为当 $n\to\infty$ 时，和 $A_n$ 的极限等于所讨论的函数由 $a$ 到 $b$ 的 |
| 128-R15 | same object; proof closes | 定积分（参看第 104 小节），于是推出（1）式． |
| 128-R16 | worked example W1, supplied stem first row | 例 1 拉长 5 cm 的弹簧的弹性力等于 3 牛顿．为了使 |
| 128-R17 | worked example W1, stem second row | 弹簧伸长 5 cm，应当作多少功？ |
| 128-R18 | supplied solution W1-S | 根据虎克定律，使弹簧伸长 $x$ 所需的力，可由公式 |
| 128-R19 | supplied solution display | $F=kx$ |
| 128-R20 | supplied solution, same object | 算出，其中 $k$ 是固定的比例系数（图 61），$O$ 点对应于弹簧的 |
| 128-R21 | supplied solution, same object | 自由状态．由题设条件得出， |
| 128-R22 | supplied solution display | $3=k\cdot0.05.$ |
| 128-R23 | supplied solution, bottom-open | 于是，$k=60$，力 $F=60x$，根据（1）式，功 |
| 128-R24 | footer | · 122 · |

### Objects And Ownership

- P128-A (R01-R15): continuous supplied proof from P127-C. The boundary reads "...在整个区间 [a,b] 上力 / 所作的功等于...", without inserting a new question or omitting either half. Proof ends explicitly with "于是推出（1）式".
- The proof includes supplied approximate work sums, a two-printed-row display R08-R09, the limiting display R13, and an explicit retrospective reference to 第 104 小节. That reference is only transcribed, not used to inspect a TOC, predecessor, or other lesson.
- W1 starts at R16 with an explicit "例 1". Its two-row question is followed immediately by a supplied Hooke-law solution beginning R18, including $F=kx$, $3=k\cdot0.05$, $k=60$, and $F=60x$ as source-provided bytes. These are observations of the book, not newly solved results.
- W1 / W1-S remains OPEN at R23 after "功"; its calculation continues on physical 0129. Whole-stem exclusion: both the example question R16-R17 and all of its solution are one worked-example object, not an unsolved exercise candidate.
- The 图 61 reference at R20 belongs to this supplied W1 solution. No figure or caption pixels are present on physical 0128. Do not fabricate a figure here or guess its appearance before reading 0129.
- No new heading, exercise heading, numbered unsolved exercise, formal separately titled theorem, figure, or caption on this page.
- Footer is independent of the open worked-example solution.

### Row And Boundary Notes

- Supplied proof: 15 printed rows. Worked-example stem/solution: 8 printed rows. Footer: 1. Independent observed physical text rows: 24.
- R08-R09 are genuinely two rows of the same mathematical equality chain; neither may be dropped. R09's numerator/denominator are one tall-fraction row. R13's limit subscripts and fraction are on one printed row, not additional rows.
- R04-R05 contain a real printed interval wrap at $[x_1,$ / $x_2]$; record the break without guessing or repairing mathematical content.
- R16-R17 are two actual stem rows. R22 is a one-row supplied equation. R23 is prose with inline formulas, not a completed bottom formula.
- Top-open supplied proof closes at R15; W1 begins immediately after it and remains bottom-open. No ownership from outside the four original pages used.
- Border marks and margin marks are noted only as visible scan marks; no exclusion, pixel modification, or noise conclusion.

## Physical 0129 / Printed 123

Source: /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129/10c/pages/0129/page.png
Original dimensions before viewing: 1695 x 2580.
Original SHA-256 before viewing: e1195915cfcd3fa0648339e333d4b4776a86466b353f28e3e5561267a349ef98.
View: original once, detail=original; image load 4.

One genuinely necessary new native crop was used for R01's operator after dx:
/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c126-129-review/p0129-top-worked-example-formula-native.png
Native box [400,225,930,165], dimensions 930 x 165, no resize/montage.
Original dimensions and original hash were checked again BEFORE loading this crop, still 1695 x 2580 and e1195915cfcd3fa0648339e333d4b4776a86466b353f28e3e5561267a349ef98.
Crop SHA-256 before viewing: 08303ef2a2c565f1c7102e8c0e4fad51ffcb421afdf4baf7a4f8c669e8f7d4b5.
Crop view: once, detail=original; image load 5. It visibly confirms the equals sign after dx; no mathematical repair made.

### Printed Rows

| Row | Kind / Object | Printed content |
| --- | --- | --- |
| 129-R01 | supplied W1-S continuation display; close | $A=\int_0^{0.05}60x\,dx=\left.30x^2\right|_0^{0.05}=0.075$（焦耳）． |
| 129-R02-L | caption F61 | 图 61 |
| 129-R02-R | caption F62, same physical row as left caption | 图 62 |
| 129-R03 | worked example W2, supplied stem | 例 2 设质量为 $m$ 的质点固定在 $Ox$ 轴上的 $O$ 点．按照 |
| 129-R04 | same stem | 牛顿定律它吸引处于同一 $Ox$ 轴上、质量为 1 的质点．当把 |
| 129-R05 | same stem | 具有单位质量的单位点由位置 $a$ 移动到位置 $b$ 时，计算引力 |
| 129-R06 | same stem; locally complete | 所作的功（图 62）． |
| 129-R07 | supplied solution W2-S | 如果质量为 1 的质点位于 $x$ 点时，那么作用在它上面的 |
| 129-R08 | supplied solution, true prose wrap | 引力 |
| 129-R09 | supplied solution display | $F=-\gamma\frac{m\cdot1}{x^2},$ |
| 129-R10 | supplied solution | 其中 $\gamma$ 是固定的系数，负号表示引力指向坐标原点．所求的 |
| 129-R11 | supplied solution | 功可以用（1）式计算，并且当 $0<a<b$ 时，它取负值： |
| 129-R12 | supplied solution display; W2 closes | $A=\int_a^b\left(-\gamma\frac{m}{x^2}\right)dx=\left.\frac{\gamma m}{x}\right|_a^b=\frac{\gamma m}{b}-\frac{\gamma m}{a}=\gamma m\left(\frac1b-\frac1a\right).$ |
| 129-R13 | exercise heading H129-E | 习题* |
| 129-R14 | exercise E446, first row | 446. 设已知压缩弹簧 1 cm 需力 2 牛顿，压缩这个弹簧 4 cm |
| 129-R15 | exercise E446, true wrap; close | 应当耗费多少功？ |
| 129-R16 | exercise E447, subpart а), first row | 447. а) 设 4 牛顿的力可伸长弹簧 8 cm．为了使弹簧伸长 |
| 129-R17 | exercise E447-а, true wrap; subpart closes locally | 8 cm，应当作多少功？ |
| 129-R18 | footer | · 123 · |

### Objects And Ownership

- W1-S R01 is a one-row supplied calculation continuing physical 0128's "...根据（1）式，功". It closes worked example 1; no new solution was computed.
- F61: coarse box [245,525,490,260], caption excluded. Left fixed vertical wall with diagonal hatching; horizontal coiled spring attached to it; rightward force arrow at the spring's right end, labelled F above. A dashed vertical connector drops from that end to a marked x-position on the lower rightward x-axis. A separate origin/rest-position mark (glyph reads 0 in the drawing; preceding prose calls the point O) lies on that axis to the left of the marked x-position, not at the wall. x also labels the far-right axis arrow. No numeric length, scale, or wall-origin identification added. Caption is R02-L. Explicit owner: W1, by the reference on physical 0128 R20. It must not be reassigned to W2 or an unsolved spring question due to proximity.
- F62: coarse box [790,620,680,85], caption excluded. Single horizontal rightward x-axis; four marked points ordered 0, a, x, b, with x also labelling the right arrow. No y-axis, numeric distances, masses pictured, or force arrow shown. Caption is R02-R. Explicit owner: W2, whose stem names 图 62 at R06. It is not an exercise figure.
- W2: explicit "例 2", four-row supplied question R03-R06 followed by six-row supplied solution R07-R12, ending in a full evaluated expression. Whole-stem exclusion applies to the entire stem and solution, not just the answer-bearing rows. The visible phrase "单位点" in R05 is recorded as printed, not repaired.
- W2-S includes the source's negative-force expression and explanatory sign statement; no independent derivation, validity check, or correction undertaken.
- H129-E has the printed star after the exercise heading. E446 and E447 themselves have no additional printed star on their visible numbers; do not distribute the heading star into invented per-exercise markers.
- E446 is a complete two-row unsolved question; E447 visibly starts the next exercise, so E446's right boundary is confirmed locally.
- E447 has one visible а) subpart, complete in two printed rows. The source glyph is visually indistinguishable from Latin a; the lesson cap1 Cyrillic convention is represented by Cyrillic а (U+0430), not a newly inferred extra subpart. Entire E447 closure remains UNKNOWN at this four-page range's bottom: no following exercise marker or adjacent page was read. Do not assert another subpart exists, and do not promote this visible subpart as a source-confirmed whole exercise.
- Footer is independent of E447's unresolved whole-object right boundary.

### Row And Boundary Notes

- W1 closing display: 1. Caption physical rows: 1 (two captions). W2 stem/solution: 10. Exercise heading: 1. Unsolved exercise rows: 4. Footer: 1. Independent observed physical text rows: 18, excluding figure-internal labels.
- R01's integral limits and evaluation-bar limits are one printed row. R09's fraction is one printed row. R12 is one long equality-chain row despite several tall fractions/integral limits.
- R07-R08 is a genuine prose wrap before the formula, not part of its numerator. R14-R15 and R16-R17 are genuine exercise wraps.
- Top boundary closes W1 from 0128. W2 is wholly present and solved. Bottom boundary: E447-а is locally complete, but the whole E447 boundary is UNKNOWN without forbidden outside pixels.
- Visible border/margin marks and the small mark near the exercise heading are only noted as visible marks; no noise diagnosis, counter operation, or count exclusion performed.

## Four-Page Frozen Boundary Map

| Object | Start / End Within Authorized Sources | Ownership / Disposition |
| --- | --- | --- |
| P126-A | 0126 R01-R07; incoming continuation | Predecessor 0125 owner UNKNOWN; supplied prose closes locally; no outside lesson assignment |
| P126-B | 0126 R08-R12 | Supplied approximation prose/formula; owns F57/caption |
| E444 | 0126 R15-R16 | Whole unsolved exercise confirmed; explicit F58/caption owner |
| E445 | 0126 R17-R18 | Whole unsolved exercise confirmed; no stated figure |
| H105 | 0127 R01 | New visible unit 105*, no TOC-derived identity |
| P127-A | 0127 R02-R05 | Complete introductory teaching prose under H105 |
| P127-B | 0127 R06-R11 | Supplied statement/formula (1), owns F59/caption; not an exercise |
| P127-C / P128-A | 0127 R14-R15 -> 0128 R01-R15 | Complete supplied proof/derivation under H105; owns F60/caption; not an exercise |
| W1 / W1-S | 0128 R16-R23 -> 0129 R01 | Complete worked-example 1, entire stem plus supplied solution excluded from unsolved exercises; owns F61/caption |
| W2 / W2-S | 0129 R03-R12 | Complete worked-example 2, entire stem plus supplied solution excluded from unsolved exercises; owns F62/caption |
| E446 | 0129 R14-R15 | Whole unsolved exercise confirmed; closes before E447; no stated figure |
| E447 | 0129 R16-R17 | Only а) subpart locally complete; whole-exercise right boundary UNKNOWN; not a confirmed whole-exercise candidate |

### Figure Caption And Row Summary

| Physical page | Printed footer | Observed physical text rows | Figure objects | Caption text objects / physical rows |
| --- | --- | --- | --- | --- |
| 0126 | 120 | 19 | F57, F58 | 2 / 1 |
| 0127 | 121 | 16 | F59, F60 | 2 / 2 |
| 0128 | 122 | 24 | none | 0 / 0 |
| 0129 | 123 | 18 | F61, F62 | 2 / 1 |

These are independent observational row totals, not a desired counter output, gate assertion, count override, or noise-exclusion request. Figure-internal marks are described separately and not added to the text-row totals.

### Frozen Conclusions And Wait

- All four authorized originals independently observed once; every printed text row, supplied display, object boundary, figure/caption, heading, unsolved question portion, and footer recorded.
- Complete whole unsolved objects confirmed here: E444, E445, E446 only. E447's visible а) is not proof of whole-exercise completeness.
- Supplied proof and both whole worked-example stems/solutions remain teaching content. No solve/repair or answer/choice generation.
- No author artifact or Stage B source bytes read; no author conformity verdict made.
- Permanent image loads: 5/24; this batch 5/8; native essential crops 1/4. Originals never reopened; crop never reopened; no montage, resize, or reset.
- This Stage A and its ledger are frozen before any parent consumption. External SHA-256 is emitted in the textual completion response, not embedded in either self-hashed file.
- WAIT FOR PARENT CONSUMPTION. No Stage B access, downstream operation, workflow update, or other-chat communication.
