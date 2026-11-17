# StageA Source-First: 10c Physical 82-85

Independent reviewer, STEMROBIN-184, 2026-11-16. This record was written
before any author report, durable page.md, template body, answer artifact,
modern artifact, or candidate review was opened. No StageB comparison yet.
Only original raw page.png pixels informed the transcription below.

Source readings: four single-page openings, one batch, 4/8 batch and 4/24
context images consumed; no crops, reopens, grid images, or budget reset.
Do not send these images to the parent. Paths, hashes and text only.

## Source Binding

All paths below are absolute. Pages 82-83 were already available; 84-85
were absent and prepared with the existing p2c.py in this reviewer's
`raw/` only, using 300 dpi. No dependency installation. The prepare command's
unused artifact-root argument also pointed inside this review directory.
Its generated template bodies and layout files were not read.

Source PDF:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/sources/soviet10years/10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`

| Physical | Printed Folio | Raw PNG SHA-256 |
| --- | --- | --- |
| 82 | 76, bottom left | `2d0d812237b5cefc7702ba6af5116c8b9c63aab053b114e959bd2a4b17c15037` |
| 83 | 77, bottom right | `e5c85c21c403e46f71619e6a972348712b3ad78af6e47c26de23ab40d3e534fa` |
| 84 | 78, bottom left | `a1393839982b833641b6c8ae1b8e281bba38178dd9364d6954a5cbcc0eff278b` |
| 85 | 79, bottom right | `aa49de32b2fb01034954f1d368ec55d82ee9de4ca9933ae8205dbff846c399e5` |

82:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-85/10c/pages/0082/page.png`

83:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-85/10c/pages/0083/page.png`

84:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-85-review/raw/10c/pages/0084/page.png`

85:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-85-review/raw/10c/pages/0085/page.png`

## Object Flow

- Physical 82 starts with complete printed task `260. *设谐振动`.
  It precedes the §91 heading and must not be attached to §91. Its preceding
  section heading is outside these four pages; exact predecessor ownership
  needs the already-reviewed prior source binding if 260 is in the deliverable.
- §91 is `91. 用半角的正切表示三角函数`, starting physical 82/printed 76.
  Its exposition continues to physical 83; its worked example crosses
  83 -> 84 and finishes before the exercise heading.
- Physical 84 has one exercise group, exactly `习题`, no shared group
  preface and no small-question labels. Tasks 261, 262, 263, 264, 265 each
  occupy one printed text row and are complete. No task crosses a page.
- §92 is `92*. 三角函数的积化为三角函数的和`, starting physical 85/printed 79.
  The asterisk belongs to the section number. Its worked `例1` is prose,
  not a numbered exercise. §92 continues beyond the four-page range.
- Equation tags `(1)`-`(4)` in §91 and `(1)`-`(5)` in §92 are equation
  references, not tasks or exercise-group numbering.
- No tables, illustrations, diagram labels, figure captions, or figure
  ownership objects occur anywhere in these four pages. The displayed
  mathematics remains text, including the three-row equality in §92.
- Folios have flanking printed dots. Edge lines, isolated specks and faint
  peripheral scan traces are not additional prose, figures or tasks.

## Independent Transcription

Each nonblank line in the following blocks follows a true printed text
row. Vertical numerator/denominator stacking is represented by one inline
fraction on its text row, not invented rows. Original prose wraps,
including midword and midexpression breaks, remain visible. Blank lines
separate source objects; they are not a pixel-count ledger. LaTeX represents
identifiable mathematics; `tg` and `ctg` preserve the source notation.

### Physical 82 / Printed 76

```text
260. *设谐振动
$f_1(t)=A_1\cos(\omega t+\varphi_1),\quad f_2(t)=A_2\cos(\omega t+\varphi_2)$ 的和可
以写成
$f_1(t)+f_2(t)=A\cos(\omega t+\varphi).$
证明:
$A=\sqrt{A_1^2+A_2^2+2A_1A_2\cos(\varphi_2-\varphi_1)},$
$\operatorname{tg}\frac{\varphi}{2}=\frac{A_1\sin\varphi_1+A_2\sin\varphi_2}{A+A_1\cos\varphi_1+A_2\cos\varphi_2}.$

91. 用半角的正切表示三角函数

在第89小节里已经证明,怎样由一个三角函数的已知值
计算同角的其他三角函数的值. 但是,所得结果通常不是唯
一的. 同时,在解三角方程、证明不等式等等情况下,常常希
望将
$\sin x,\ \cos x,\ \operatorname{tg}x$ 和 $\operatorname{ctg}x$
所有这四个函数都能用某一个函数 $f(x)$ 的有理式表示出来.

在这一小节里将要说明,怎样用函数 $f(x)=\operatorname{tg}\frac{x}{2}$ 来表示
所有三角函数的值. 这时,我们要利用倍角的三角函数. 因
为 $\sin x=2\sin\frac{x}{2}\cos\frac{x}{2},\quad\cos x=\cos^2\frac{x}{2}-\sin^2\frac{x}{2},$ 所以为了得
到只含有 $\operatorname{tg}\frac{x}{2}$ 的式子,只要用 $\sin^2\frac{x}{2}+\cos^2\frac{x}{2}=1$ 除上列两
式的右边就行了. 于是得到:
$\sin x=\frac{2\sin\frac{x}{2}\cos\frac{x}{2}}{\sin^2\frac{x}{2}+\cos^2\frac{x}{2}},\quad\cos x=\frac{\cos^2\frac{x}{2}-\sin^2\frac{x}{2}}{\sin^2\frac{x}{2}+\cos^2\frac{x}{2}}.$

• 76 •
```

The final fraction display is complete on 82; the explanatory paragraph
continues on 83. Both displayed fractions share a horizontal text row.

### Physical 83 / Printed 77

```text
现在我们用 $\cos^2\frac{x}{2}$ 来除分子和分母,得到:
$\sin x=\frac{2\operatorname{tg}\frac{x}{2}}{1+\operatorname{tg}^2\frac{x}{2}},$                                      (1)
$\cos x=\frac{1-\operatorname{tg}^2\frac{x}{2}}{1+\operatorname{tg}^2\frac{x}{2}}.$                                     (2)

这时应当考虑所讨论的函数和分式的定义域. 在这种情况
下,$x\ne(2k+1)\pi,\ k\in Z.$

如果利用倍角的正切公式,就可以用 $\operatorname{tg}\frac{x}{2}$ 表示其他三角
函数:
$\operatorname{tg}x=\frac{2\operatorname{tg}\frac{x}{2}}{1-\operatorname{tg}^2\frac{x}{2}},$                          (3)
$\operatorname{ctg}x=\frac{1-\operatorname{tg}^2\frac{x}{2}}{2\operatorname{tg}\frac{x}{2}}.$                         (4)

同时应当考虑所讨论的函数和分式的定义域. 当 $x=\frac{\pi}{2}+$
$\pi k\ (k\in Z)$ 和 $x=\pi+2\pi l\ (l\in Z)$ 时,(3)式失去意义,而当 $x=$
$\pi k\ (k\in Z)$ 时,(4)式失去意义.

例 解方程
$3\cos x+4\sin x=5.$
我们用带有半角正切的式子代替正弦和余弦,得到(当

• 77 •
```

The domain sentence genuinely splits `x=pi/2+` -> `pi k` and
`x=` -> `pi k`; the last prose row's `得到(当` is an open parenthesis
completed at the beginning of 84. Do not close it on 83 or attach its
continuation to an exercise.

### Physical 84 / Printed 78

```text
$x\ne(2k+1)\pi,\ k\in Z$ 时):
$\frac{3(1-\operatorname{tg}^2\frac{x}{2})}{1+\operatorname{tg}^2\frac{x}{2}}+\frac{4(2\operatorname{tg}\frac{x}{2})}{1+\operatorname{tg}^2\frac{x}{2}}=5.$

用 $y$ 表示 $\operatorname{tg}\frac{x}{2}$ 并化简方程后,得到:
$4y^2-4y+1=0,$
$y=\frac{1}{2},\ \operatorname{tg}\frac{x}{2}=\frac{1}{2},$
$\frac{x}{2}=\operatorname{arctg}0.5+\pi n,\ n\in Z,$
$x=2\operatorname{arctg}0.5+2\pi n,\ n\in Z,$
$x\approx2\cdot0.464+2\pi n,\ n\in Z,$
$x\approx0.928+2\pi n,\ n\in Z.$

在解中除去了 $(2k+1)\pi$ (其中 $k\in Z$)这种形式的数. 对
于这样的 $x$,得 $\cos x=-1,\ \sin x=0,$ 而 $3\cos x+4\sin x=-3$
$\ne5.$ 因此,在解题过程中使用(1)式和(2)式,没有失掉根.
答: $x\approx0.928+2\pi n,\ n\in Z.$

习题

261. 如果 $\operatorname{tg}\frac{\alpha}{2}=3,$ 求 $\sin\alpha,\ \cos\alpha,\ \operatorname{tg}\alpha$ 和 $\operatorname{ctg}\alpha.$
262. 已知 $\operatorname{tg}\frac{x}{2}=-2,$ 求 $\sin\alpha,\ \cos\alpha,\ \operatorname{tg}\alpha$ 和 $\operatorname{ctg}\alpha.$
263. 如果 $\operatorname{tg}\alpha=\frac{1}{7},$ 求 $\sin2\alpha,\ \cos2\alpha,\ \operatorname{tg}2\alpha$ 和 $\operatorname{ctg}2\alpha.$
264. 如果 $\operatorname{tg}2\alpha=8,$ 求 $\sin4\alpha$ 和 $\cos4\alpha$ 的值.
265. 如果 $\operatorname{tg}\alpha=3,$ 求 $\sin4\alpha.$

• 78 •
```

The second row of the excluded-root explanation ends with `=-3`;
`\ne5` begins the following printed row. Do not separate that into
another mathematical claim. `答` is the worked example's printed answer,
not an externally consulted answer key.

### Physical 85 / Printed 79

```text
92*. 三角函数的积化为三角函数的和

在证明三角恒等式、解方程、化简式子以及求原函数(参
看第98小节)时,把给定的三角函数的积写成三角函数的和
的形式,通常是有益的. 对于三角函数的积化为三角函数的
和的公式,可由加法公式(和角与差角的余弦与正弦)得出(参
看第71小节).

我们写出角 $\alpha$ 与 $\beta$ 的和的正弦以及差的正弦:
$\sin(\alpha+\beta)=\sin\alpha\cos\beta+\sin\beta\cos\alpha,$              (1)
$\sin(\alpha-\beta)=\sin\alpha\cos\beta-\sin\beta\cos\alpha.$              (2)

把等式(1)与(2)两边分别相加并用2除所得等式的两边,得
出公式:
$\sin\alpha\cos\beta=\frac{1}{2}[\sin(\alpha+\beta)+\sin(\alpha-\beta)].$  (3)

例1 把积 $\sin75^\circ\cos15^\circ$ 写成三角函数的和的形式.
根据(3)式得:
$\sin75^\circ\cos15^\circ=\frac{1}{2}[\sin(75^\circ+15^\circ)+\sin(75^\circ-15^\circ)]$
$=\frac{1}{2}(\sin90^\circ+\sin60^\circ)$
$=\frac{1}{2}(1+\frac{\sqrt{3}}{2})=\frac{2+\sqrt{3}}{4}.$

我们写出角 $\alpha$ 与 $\beta$ 的和的余弦以及差的余弦:
$\cos(\alpha+\beta)=\cos\alpha\cos\beta-\sin\alpha\sin\beta,$              (4)
$\cos(\alpha-\beta)=\cos\alpha\cos\beta+\sin\alpha\sin\beta.$              (5)
把等式(4)与(5)两边分别相加并用2除所得等式,得出

• 79 •
```

The equality in `例1` is exactly three printed rows, two beginning with
`=`. The final sentence `得出` remains open to physical 86; no subsequent
product-to-sum formula is present on 85 and none has been inferred here.

## Substantive Source Observations

1. **Identifiable source mismatch, task 262.** Its given variable is `x`
   in `tg(x/2)=-2`; each requested function uses `alpha`. This is visibly
   different from the alpha in 261 and from the four alpha requests in
   262 itself. No relation between x and alpha is stated. As printed,
   this does not determine those requested values. A faithful layer
   must retain the mismatch and identify it as an erratum; a usable
   modern problem requires an explicit source-bound correction rather
   than a silent substitution. The likely intended correction is
   `tg(alpha/2)=-2`, but that is an inference, not what the pixels print.
   Relevant object 262 is held for that mathematical decision, not
   because its glyphs are unreadable.
2. **Problem 260's phase relation is half-angle.** The printed left
   side is `tg(phi/2)`, not `tg(phi)`, and the denominator starts with
   the resultant amplitude `A`, not `A_1`. No extra phase, positivity,
   nonzero-amplitude, or denominator condition is printed. Do not
   invent source conditions; zero-resultant degeneracy is a separate
   mathematical qualification if this predecessor task is adapted.
3. **Domain restrictions are part of §91.** Formulas (1)-(2) use
   `x != (2k+1)pi`. Formula (3) loses meaning both for
   `x=pi/2+pi k` and `x=pi+2pi l`; formula (4) loses meaning for
   `x=pi k`. Preserve the distinct k/l variables and every stated
   exclusion. The example explicitly checks the excluded odd-pi values.
4. **Printed approximation remains an approximation.** The example
   prints `arctg 0.5`, then `2*0.464`, then `0.928`, and the final
   answer uses `approx`, not equality. Neither 0.464 nor 0.928 is an
   exact angle substituted into an identity.
5. **No figure work exists in this source range.** Figure specs,
   new diagrams, table extraction, rendering and image-review claims
   would not follow from any source object seen here.

## UNKNOWNs and Boundaries

- **Font-family UNKNOWN:** The exact historical typeface family of
  Chinese prose and mathematical printing cannot be identified from
  these scans. It does not prevent identifying the text or mathematics
  and does not create a sourceHOLD.
- **Exact codepoint UNKNOWN:** A scan cannot prove the original digital
  codepoint of punctuation, integer-set Z, phi's typographic variant,
  or decorative folio dots. The displayed set is the integers, phi is
  the phase variable, and the folios are 76-79. The transcription uses
  ASCII prose punctuation, `Z`, and LaTeX phi/alpha/beta representations
  without claiming historical font/codepoint identification. There
  are no Cyrillic/Latin small-question labels in these pages.
- **Scan-origin UNKNOWN:** Exact causes of faint edge traces and specks
  are unknown. No mathematical condition, task, table or figure is
  hidden by an unresolved scan defect in the reviewed content.
- **Mathematical UNKNOWN:** No unreadable mathematical condition.
  Task 262 is a legible but underdetermined source statement as noted
  above. Do not replace this substantive issue with a font-family hold.
- **Owner boundary:** 261-265 unambiguously belong to §91's `习题`.
  §92's prose and example unambiguously belong to §92. Task 260 belongs
  before §91, but its exact predecessor section identity is not visible
  in these four pages; inclusion requires the prior-source owner binding.
  Missing binding holds that object only, not the complete §91 review.
- **Completeness boundary:** §91 is complete within 82-84; §92 is not
  complete within 85. StageA-ready means source inspection is recorded,
  not permission to publish the unfinished §92 or advance any workflow.

## Disclosure Gate

StageA-ready. Keep this file as the pre-disclosure baseline. Its SHA-256
is returned separately after writing, avoiding a self-referential hash.
Await parent authorization for one complete StageB comparison after
author completion. Preserve rejected findings. After repairs, compare
only changed units. No author material was read in StageA.
