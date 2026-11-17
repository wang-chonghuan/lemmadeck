# StageA Source-First Freeze: 10c Physical 86-89

Independent raw-scan review for STEMROBIN-184. StageAready; StageB NOT begun.
Only the original page.png pixels and source-derived crops were read for content.
No author page.md, body, report, template body, answer, choice, modern artifact,
or earlier/later source page was read. No workflow restart or durable edit.

## Evidence

All paths below are relative to
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/`.

| Physical | Actual printed folio | Raw path | SHA-256 |
| --- | --- | --- | --- |
| 86 | 80 | production-source10c86-89/10c/pages/0086/page.png | 8679c62f708b2090bf2ffafbb24fb865026c7d6743fa2a939c628634ab7fb2e3 |
| 87 | 81 | production-source10c86-89/10c/pages/0087/page.png | 36cd157227303d6dfc97335bc7d65c8814de4881ea1b4960c50574a626736a12 |
| 88 | 82 | production-source10c86-89-review/10c/pages/0088/page.png | 071aa5f85d9c5c0b1356a7c8708e3ed808d5e04a47b87716cabc7cf3de3817a3 |
| 89 | 83 | production-source10c86-89-review/10c/pages/0089/page.png | 88e79850668568a5851b792536cb63cb6e5d8c6900e99b192ff38d2e3a376e0e |

Physical 88/89 were absent when needed. The existing p2c prepare was run with
`--book 10c --page 88/89 --work .intentfold/tickets/STEMROBIN-184/tmp/production-source10c86-89-review`.
It wrote only owned scratch; its grid/layout/template contents were not read.
All four original renders are 1695x2580 at the existing prepare default, 300 dpi.

Image ledger, one image per load, exactly 8 loads in this batch/context:
86 raw; 87 raw; 88 raw; 89 raw; 88 fig42 crop; 89 fig43 crop;
87 exercises crop; 88 introductory-prose crop. No further image loads.
Crops reside in this review directory:
`source-0088-fig42.png`, `source-0089-fig43.png`,
`source-0087-ex284-293.png`, `source-0088-prose.png`.

## Transcription Convention

Each line inside a transcription block is one observed printed baseline;
parallel tasks stay on the same line, separated here by ` | `.
Fractions and exponents are semantically transcribed in LaTeX on their baseline,
not split into numerator/denominator lines. Chinese punctuation/spacing is
normalized for readability, not asserted as original codepoints or font metrics.
Square interval delimiters retain their printed inward/outward directions.
Bracketed inventory/wrap notes outside the blocks are reviewer annotations.
Equation numbers are distinct from exercise and unit numbers.

## Physical 86 / Printed 80

Incoming prose fragment is `cont`, beginning exactly with “公式：”.
There is no heading identifying its preceding unit on this page. Do NOT invent
physical 85's tail, missing derivation, or an opening sentence before “公式”.

```text
公式：
$\cos\alpha\cos\beta=\frac{1}{2}[\cos(\alpha+\beta)+\cos(\alpha-\beta)]$.    (6)
由等式(5)两边分别减去等式(4)的两边，得到：
$\sin\alpha\sin\beta=\frac{1}{2}[\cos(\alpha-\beta)-\cos(\alpha+\beta)]$.    (7)
例2  把 $\cos^2x\cos3x$ 写成三角函数的和的形式。
首先用 $\frac{1+\cos2x}{2}$ 代替 $\cos^2x$，于是得到：
$\frac{1}{2}(1+\cos2x)\cos3x=\frac{1}{2}\cos3x+\frac{1}{2}\cos2x\cos3x$.
现在利用(6)式：
$\frac{1}{2}\cos3x+\frac{1}{2}\cos2x\cos3x=\frac{1}{2}\cos3x+\frac{1}{4}(\cos x+\cos5x)$.
于是，
$\cos^2x\cos3x=\frac{1}{2}\cos3x+\frac{1}{4}\cos x+\frac{1}{4}\cos5x$.
结果得到的式子中，三角函数都是一次的。
习题
把下列各式写成三角函数的和的形式：
266. $\cos40^\circ\cos50^\circ$. | 267. $\cos\frac{\pi}{12}\cos\frac{5\pi}{12}$.
268. $\sin\frac{5\pi}{24}\sin\frac{\pi}{24}$. | 269. $\sin110^\circ\sin50^\circ$.
270. $\sin(x+\frac{\pi}{4})\sin(x-\frac{\pi}{4})$.
271. $\sin(\alpha+\frac{\pi}{3})\sin(\alpha-\frac{\pi}{6})$.
• 80 •
```

No source figures, captions, tables, subtask labels, or additional headings.
Exercises 266/267 share a row; 268/269 share the next. 270 and 271 each have
their own row. The exercise instruction continues to physical 87's 272-277.
The worked example and all formulas above are visible source material, not
reviewer-generated answers.

## Physical 87 / Printed 81

Starts directly with exercise 272, continuing the prior exercise instruction;
do NOT manufacture a repeated “习题” heading.

```text
272. $\cos(x+\beta)\cos(x-\beta)$.
273. $\sin(x+\alpha)\sin(x-\alpha)$.
274. $4\sin30^\circ\sin20^\circ\sin10^\circ$.
275. $4\cos60^\circ\cos20^\circ\cos10^\circ$.
276. $4\sin25^\circ\cos15^\circ\sin5^\circ$.
277. $8\cos1^\circ\cos2^\circ\cos4^\circ\cos8^\circ$.
把下列各式写成便于不查表计算的形式并算出结果：
278. $2\sin22^\circ30'\cos7^\circ30'$. | 279. $\cos45^\circ\cos15^\circ$.
280. $\sin52^\circ30'\sin7^\circ30'$. | 281. $\sin\frac{\pi}{4}\sin\frac{\pi}{12}$.
282. $\cos\frac{\pi}{12}\cos\frac{\pi}{4}$.
283. * $8\cos10^\circ\cos50^\circ\cos70^\circ$.
降低下列各式中三角函数的次数：
284. $2\cos^2x$. | 285. $2\sin^2 2x$. | 286. $2\cos^2x\cos2x$.
287. $\cos^2x\sin^2x$. | 288. $\sin^2 6x$. | 289. $\cos^2 4x$.
证明恒等式：
290. $2\sin4x\sin2x+\cos6x=\cos2x$.
291. $\sin^3x\cos^2x=\frac{1}{8}\sin x-\frac{1}{16}\sin5x+\frac{1}{16}\sin3x$.
292. $\sin5x\cos3x\cos6x=\frac{1}{4}(\sin14x+\sin2x+\sin8x$
$-\sin4x)$.
293. 等式 $\sin20^\circ\sin40^\circ\sin60^\circ\sin80^\circ=\frac{3}{16}$ 成立吗？
• 81 •
```

Exercise 292 occupies two printed lines, with the break after `+\sin8x`;
the continuation is `-\sin4x).` and closes the same exercise/formula.
It is not a new task, an additional subtraction outside the factor, or an
incomplete mathematical condition.

Grouping under the single visible “习题” section:

| Local group position | Exact visible instruction | Tasks |
| --- | --- | --- |
| 1 | 把下列各式写成三角函数的和的形式： | 266-277 (86-87) |
| 2 | 把下列各式写成便于不查表计算的形式并算出结果： | 278-283 |
| 3 | 降低下列各式中三角函数的次数： | 284-289 |
| 4 | 证明恒等式： | 290-293 |

The asterisk belongs to 283 and must survive faithful extraction. 293 asks
whether its equality holds; do not rewrite it as “证明” merely because it is
under that instruction. Total observed tasks: 28, 266-293, with no gap or
duplicate. No figures, captions, tables or subtask sequences on physical 87.

## Physical 88 / Printed 82

New unit starts HERE: `93. 最简单的三角不等式的解法`.
“93” is a unit number, not a task number; printed folio is 82, not 88.

```text
93. 最简单的三角不等式的解法
你们已经遇到过解三角不等式。其中许多可化为解
$\sin x<a$，$\sin x>a$，$\sin x\leq a$
等等这种形式的最简单的三角不等式。
我们来看解这种不等式的例子。
例1  解不等式
$\sin x<\frac{1}{2}$.    (1)
为了解不等式(1)，在图42中引直线 $y=\frac{1}{2}$。我们发现，
这条直线与正弦曲线相交于无穷多个点。在图中用粗线标出
```

Then source figure 42 and its single caption baseline `图 42`.
The prose immediately before the figure is `open`; immediately after it is
`cont`, completing “标出” + “了”. The figure/caption do not end the sentence.

```text
了一个作为已知不等式的解的对应自变量值的区间。满足不
等式(1)的这些 $x$ 的值，可以写成：
$\frac{5}{6}\pi<x<\frac{13}{6}\pi$.    (2)
现在，为了写出完整的答案，应当利用周期性：
$\frac{5}{6}\pi+2\pi k<x<\frac{13}{6}\pi+2\pi k$，$k\in Z$.
第一次选取的区间，可以不选 $]\frac{5\pi}{6},\frac{13\pi}{6}[$，而选任何一个
• 82 •
```

Final prose line is `open` across physical 88 -> 89. The answer interval is
strict/open; preserve both `<` signs and both outward French interval brackets.
No exercise section/tasks/tables on this page.

### Figure 42 Inventory

One instructional graph, owned by n93 example 1 prose, not any exercise.
Caption is `图 42`. References occur before it in the `y=1/2` construction
sentence. Source-derived detail crop: `source-0088-fig42.png`.

- Cartesian axes: horizontal x-axis with right arrow and `x`; vertical y-axis
  with upward arrow and `y`; origin labelled `0` below/right of the crossing.
- A single solid sinusoidal curve labelled `y=sin x` above its central arch.
  It passes through the origin upward. The visible drawing has three maxima
  and two minima; its visible ends are below the x-axis.
- A thin solid horizontal reference line above the x-axis, crossing the curve
  repeatedly, with `1/2` vertically stacked beside the y-axis. No printed
  `y=1/2` graph label beyond that ordinate value.
- Three thin vertical projections from intersections with that horizontal
  line to the x-axis, each ending in a hollow/open x-axis circle.
  The first, between the origin and central maximum, is UNLABELLED.
  The second is at the central descending intersection, labelled `5π/6`;
  the third is at the next ascending intersection, labelled `13π/6`.
- The selected x-axis interval between the latter two hollow endpoints is
  visibly thick. Its middle lies beneath the sinusoid's intervening trough;
  it denotes `5π/6 < x < 13π/6`, not the central above-half arch.
- Do not invent a printed `π/6` label for the first projection, extra ordinate
  ticks, a grid, +/-1 labels, further interval labels, or endpoint inclusion.
  The mathematical location of the unlabelled first projection is derivable,
  but that value is not printed inventory.

## Physical 89 / Printed 83

First paragraph is `cont` from physical 88's “而选任何一个”:

```text
其他的区间，例如 $]\frac{17\pi}{6},\frac{25\pi}{6}[$，相应地加上 $2\pi k$ ($k\in Z$)，写
出一般答案。
例2  解不等式
$\cos x\leq\frac{1}{2}$.    (3)
为了解这个不等式，在图43中引直线 $y=\frac{1}{2}$。我们发现，
这条直线与函数 $y=\cos x$ 的图象相交于无穷多个点。在图中
```

Then source figure 43 and its single caption baseline `图 43`.
The prose before it is `open`; prose after it is `cont`, completing “在图中”
+ “标出了...”.

```text
标出了一个作为已知不等式的解的对应自变量值的区间。满
足不等式(3)的这些 $x$ 的值可以写成：
$\frac{\pi}{3}\leq x\leq\frac{5\pi}{3}$.    (4)
在图43中，由不等式(4)给出的区间在横坐标轴上用粗
线段标出。
现在，为了写出完整的答案，应当利用余弦函数的周
期性：
$\frac{\pi}{3}+2\pi k\leq x\leq\frac{5\pi}{3}+2\pi k$，$k\in Z$.
第一次选取的区间，可以不选 $[\frac{\pi}{3},\frac{5\pi}{3}]$，而选任何一个
• 83 •
```

Final prose line is `open` OUT of the requested window, toward physical 90.
Do not invent its next sentence or treat n93 as closed at physical 89.
Unlike example 1, example 2 is non-strict/closed at BOTH ends.
No exercise section/tasks/tables on this page.

### Figure 43 Inventory

One instructional graph, owned by n93 example 2 prose. Caption is `图 43`;
references occur before the figure in the construction sentence and after
equation (4) in the thick-segment explanation.
Source-derived detail crop: `source-0089-fig43.png`.

- Cartesian axes with right-pointing x arrow, upward y arrow, `x`, `y`, and `0`
  below/left of the origin.
- Single solid cosine curve labelled `y=cos x` above/right of its maximum on
  the y-axis. Two complete maxima and three minima are visible; the left
  visible end is above the axis, the right visible end is below it.
- Thin solid horizontal half-height reference line, labelled with stacked
  `1/2` beside the y-axis. It intersects the cosine repeatedly.
- Two thin, visibly interrupted vertical projection strokes from the
  half-height intersections to the x-axis: `π/3` under the descending one,
  `5π/3` under the next ascending one. Their x-axis endpoint marks are filled,
  not the hollow circles of figure 42.
- The x-axis segment from `π/3` through the intervening trough's projection
  region to `5π/3` is thick, representing the closed interval.
- No grid, +/-1 marks, additional numerical x labels, or an open-endpoint
  condition is printed. Do not conflate the half-height horizontal line with
  the selected x-axis segment.

## Boundary and Uncertainty Disposition

- IDENTIFIED: n93 begins physical 88 / printed 82. Its examples, equations
  (1)-(4), strict versus non-strict conditions, two figure owners, and all
  visible prose/wraps are identifiable. No semantic HOLD for these facts.
- IDENTIFIED: preceding exercise section continues across 86/87, tasks
  266-293 and the four visible instruction groups above. Example 2 and
  equations (6)/(7) on 86 are preceding-unit material, NOT n93 material.
- OWNER UNKNOWN / BINDING HOLD: the preceding unit's heading/card ID and
  physical 85's outgoing text are not visible in the permitted source
  window. Hold only that incoming object's upstream lesson binding/closure;
  do not invent “n92” as a scan-attested heading or fabricate an 85 tail.
  StageB may compare a verified existing boundary, when authorized.
- OPEN OUT: n93's physical 89 final paragraph is incomplete. This is an
  observed boundary, not unreadable mathematics; do not claim whole-unit
  closure from these four pages.
- TYPOGRAPHY UNKNOWN, NOT SEMANTIC HOLD: native font family, raster-to-Unicode
  identity of Latin versus historical font glyphs, exact `Z` font treatment,
  prime glyph codepoint, and the exact historical slanted less-or-equal glyph
  codepoint cannot be proved from raster pixels. Their mathematical readings
  (integers, arcminutes, non-strict inequality) are identifiable. Do not
  replace a source-supported mathematical condition with UNKNOWN solely
  because its font/codepoint is not recoverable.
- SCAN ARTIFACTS: small scattered isolated specks and fine outer-edge/book
  boundary rules are visible, especially above/below the text. They are not
  a fifth group, figure, table, task, formula, or folio. Exact physical origin
  (dust/bleed/crop/separator) is UNKNOWN from these pages alone. No exclusion
  boxes, repaired pixels, counter overrides or neighboring-page claims made.
- No unidentified mathematical condition or figure-owner ambiguity within
  n93's visible examples. No source mathematical erratum asserted here.
- StageA freeze is source-first evidence only. Author disclosure/comparison,
  finalize, assembly, modern production, publication and whole-ticket
  acceptance have not occurred and are not authorized by this review.
