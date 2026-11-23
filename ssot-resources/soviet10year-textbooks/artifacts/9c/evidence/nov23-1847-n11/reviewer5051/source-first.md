# STEMROBIN-184: independent source-first freeze, final N11 pages 0050-0051

Status: INITIAL SOURCE FREEZE ONLY. No author, transcription, modern-edition,
answer, choice, FigureSpec or other reviewer candidate was consulted. This is
not candidate approval, page-finalization evidence, a line-count audit or a
whole-N11 review.

Date: 2026-11-23.

Sole command working directory:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Inputs and image budget

Original pixels inspected, in this order, exactly one image-tool opening each:

1. `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0050/page.png`
2. `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n11-nov23-source4651/prepared/9c/pages/0051/page.png`

Actual images inspected: 2. No reopens, crops, grids, screenshots, OCR,
additional source pixels or derived image files. The existing original PNGs
remain the image evidence; this report does not copy or modify them.

Approved boundary text only:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0052/page.md`.
No page-0052 pixels were opened. Its text starts with
`第三章 实数 无穷数列和它的极限`, `§ 5. 实数`, `12. 引言`.
Its recorded printed page is 45. Only that chapter boundary is used here;
its prose and metadata are not independent pixel evidence.

Required lesson SKILL.md, production-resume.md and image SKILL.md, including
image-batch rules, were read before these images. The explicit bounded offline
assignment overrides their ordinary production workflow. No Git, backend,
database, .env, browser, finalizer, counting helper, application, dependency,
publication or other-agent operation was performed.

## Reading convention

The following inventories were formed directly from the two original images
before any candidate comparison. Each line in a source code block follows a
physical printed text/formula row; horizontal spacing is indicative, not a
measured pixel coordinate or machine line-count claim. Fractions and radicals
occupy one formula row despite their vertically separated glyphs.

Math is represented in TeX with the original notation `C_N^r`, not silently
converted to a different formula. The visible small-question sequence is
represented as Cyrillic `а), б), в), г)` according to the book profile.
Pixels alone cannot establish the Unicode identity of a Latin-looking `а`.
This is an encoding convention, not a glyph claim.

The page-0051 exercise-112 formula is physically split after `(1+`; that
split is shown literally below and identified separately. The potentially
ambiguous raised dot in exercise 109 is recorded as `[raised dot]`, not
silently normalized to multiplication or a decimal.

## Page 0050: printed page 43

### p0050-tail: inbound continuation

```text
数之和.
```

This is a top-of-page fragment, not a standalone new exercise or prose
paragraph. Its owner, missing values and preceding wording cannot be
established from the authorized pixels. The next complete visible number is
94; assigning this tail to exercise 93 would remain an inference, not a
frozen source fact. Its request is incomplete and cannot independently be
solved in this review.

### p0050-ex94: sum, not number of permutations

```text
94. 求可以用数字1、3、5、7组成的、没有重复数字的一切四
    位数之和.
```

Closed on this page. Four given digits, four places, no repeated digit.

### p0050-ex95: four prefix/suffix restrictions

```text
95. 数字1、2、3、4、5、6和7的所有全排列中，
    а) 以123开始的全排列有多少个？
    б) 以123结尾的全排列有多少个？
    в) 以数字1、2、3开始，并按任意顺序占据前三个位置
       的全排列有多少个？
    г) 以数字1和2组成的排列开始的全排列有多少个？
```

Closed. Subquestion в has a within-subquestion line wrap. Subquestion г
allows an initial permutation formed by 1 and 2, not only the fixed prefix 12.

### p0050-ex96: volumes and adjacency

```text
96. 30卷书摆在书架上，使第一卷和第二卷 а) 不挨着，б)
    挨着，各有多少种摆法？
```

Closed. The subquestion marker б is at the end of the first physical line;
its condition continues on the next line. A shelf row, not a circular order.

### p0050-ex97: equations, two parallel formula rows

```text
97. 解方程：
    а) C_n^3=\frac{1}{5}C_{n+2}^4;          б) 3C_{2n}^{n-1}=5C_{2n-1}^{n};
    в) \frac{C_{2n}^{n+1}}{C_{2n+1}^{n-1}}=\frac{7}{13};    г) \frac{C_{2n-1}^{n}}{C_{2n}^{n-1}}=\frac{9}{17}.
```

Closed. First row contains а and б; second row contains в and г.
The upper/lower indices are source facts: especially `n+1` over `2n` and
`n-1` over `2n+1` in в, and `n` over `2n-1` in г.
Neither row is a multi-equation brace/system.

### p0050-ex98: two opposite strict comparisons

```text
98. n取什么值时，下列不等式成立？
    а) C_n^5<C_n^4;          б) C_n^5>C_n^4.
```

Closed; both subquestions share one physical formula row.
The equality boundary is not included in either printed inequality.

### p0050-ex99: four strict inequalities, two parallel rows

```text
99. 解不等式：
    а) C_n^5<C_n^3;          б) C_{2n}^7>C_{2n}^5;
    в) C_{19}^{k-1}<C_{19}^{k};          г) C_{15}^{k-2}>C_{15}^{k}.
```

Closed. The fixed lower indices are 19 and 15. The last upper index on the
left is `k-2`, not `k-1`. First formula row is а/б; second is в/г.

### p0050-ex100: point conditions and distinct circles

```text
100. 平面上有10个点，每三个点不共线，每四个点不共圆。如
     果通过其中的每三个点作一个圆，这样的圆可以作多
     少个？
```

Closed. Both restrictions are essential printed givens:
no three collinear and no four concyclic. There is no accompanying diagram.

### p0050-ex101-star: identity

```text
101*. 证明下列等式成立：
      C_9^9+C_{10}^9+C_{11}^9+\cdots+C_{20}^9=C_{21}^{10}.
```

Closed. The difficulty star is printed. This is a sum from lower index 9
through 20 with fixed upper index 9; the right-hand upper index is 10 and
lower index is 21.

### p0050-footer and non-content pixels

Footer: printed `43` between two ornamental dots. There are irregular
ink/scan marks at the left margin and page edges. They are not numbered
figures, labels or exercise givens; no exclusion boxes or pixel edits are
created by this review.

## Page 0051: printed page 44

### p0051-ex102: simultaneous key subsets

```text
102. 从钢琴的10个音键中选择3到10个键，同时按下发出
     曲子的尾声. 这样构成的尾声一共有多少种？
```

Closed. Key count is inclusive from 3 through 10. Simultaneous pressing is
printed, so this is not an ordered sequence of notes.

### p0051-ex103: office selection

```text
103. 从参加会议的40个人中选出一位主席、一位秘书和三位
     编辑. 一共有多少种选法？
```

Closed. Chair and secretary are different offices; three editors are
specified but no separate editor positions or order are printed.

### p0051-ex104: sentry assignment

```text
104. 一个小分队有60名士兵和5名军官，指派其中三个士
     兵、一个军官去放哨. 一共有多少种指派法？
```

Closed. The word 士兵 itself is split across physical lines after 士.
No separate sentry posts or ordering are specified.

### p0051-ex105: chess-team composition

```text
105. 从10个少年、8个男人和5个女人中，选出4个少年、1
     个男人、2个女人组成一个象棋小队. 一共有多少种
     选法？
```

Closed. The number 1 and its noun are split across lines; the final request
also wraps. Category sizes and selections are respectively (10,8,5) and
(4,1,2). No team-board order is printed.

### p0051-ex106: nonadjacent black balls

```text
106. 有m个白球和n个黑球，而且m>n. 能用多少种方法
     把所有的球排成一行，使得每两个黑球都互不挨着？
```

Closed. The printed condition is strict `m>n`, not `m>=n`.
The source does not explicitly state whether balls of the same color are
individually distinguishable. Do not freeze either interpretation as a
source fact.

### p0051-ex107: flower selection

```text
107. 从10朵蔷薇花和8朵牡丹花中取出2朵蔷薇和3朵牡
     丹，扎成一花束，一共有多少种扎法？
```

Closed. 牡丹 wraps after 牡. Counts are (10,8) selecting (2,3).
No ordering of flowers within a bouquet is given. Treating individual
flowers as distinguishable selectable objects is a mathematical assumption,
not an extra printed condition.

### p0051-ex108: symmetry of coefficients

```text
108. 证明：二项展开式里，与两端等距的二项的系数彼此
     相等.
```

Closed. This is a proof request about binomial coefficients at symmetric
positions, not a request for equality of the complete powered monomials.

### p0051-ex109: exponent and even-position coefficient sum

```text
109. (\sqrt[3]{y}+\sqrt[5]{y^3})^n的展开式中，位于偶数位置的二项式系数
     的和等于32. 求含有y^{2[raised dot]8}的那一项.
```

Closed. The first radical is a cube root of y; the second is a fifth root
of y^3. The even-position coefficient sum is 32. The target exponent
visually consists of 2, a small raised/interior dot, and 8.

Preferred reading: decimal exponent `2.8`. Residual pixel-level uncertainty:
the printed dot is not strong enough in this one permitted viewing to
certify its typographic meaning by itself. Multiplication `2*8` is not
silently substituted. The independent arithmetic consequences of both
readings are recorded in source-math.md; arithmetic does not erase this
source-glyph uncertainty.

### p0051-ex110: coefficient sum

```text
110. 求(5x^2-4y^3)^7的展开式的系数的和.
```

Closed. Given powers are x^2, y^3 and outer exponent 7; minus sign between
the two terms. The request is a coefficient sum, not the full expansion.

### p0051-ex111-star: largest expanded term

```text
111*. 下列式子的展开式中，第几项最大？
      а) (\frac{1}{2}+\frac{1}{2})^{100};    б) (\frac{2}{3}+\frac{1}{3})^{100};    в) (\frac{9}{10}+\frac{1}{10})^{100}.
```

Closed. Printed star retained. All three share one physical formula row.
The summands are ordered as shown; largest term is not merely largest
binomial coefficient. No tie is precluded by the wording alone.

### p0051-ex112-star: required expansion truncation

```text
112*. 要计算(1+0.01)^{10}的值精确到0.001和0.000001，(1+
      0.01)^{10}的展开式每次应该取多少项？
```

Closed. The second occurrence of `(1+0.01)^{10}` crosses a physical line,
with the break immediately after `(1+`. Its joined mathematical expression
is `(1+0.01)^{10}`; a faithful complete formula with an explicit wrap is
`$(1+↵0.01)^{10}$`. This is an intra-formula physical wrap, not a missing
formula or a continuation to page 0052.

Both requested precisions are printed, and the question asks how many
terms to take each time. The scan alone does not define a formal absolute
error versus correct-rounding convention; source-math.md states the
interpretation used and checks the usual rounding interpretation too.

### p0051-footer and non-content pixels

Footer: printed `44` between two ornamental dots. Irregular right-margin
black marks and bottom/side scan traces are present, but there is no printed
instructional illustration, table, diagram, figure number, caption or
source image reference.

## Scope, numbering and closure freeze

- The visible complete exercises run 94-101* on 0050 and 102-112* on 0051
  without a reset or an exercise-column heading in these two pages.
  Stars are printed on 101, 111 and 112, and not on the other visible numbers.
- There is no visible worked-example label, new lesson heading, numbered
  figure, unnumbered instructional figure, table, caption, footnote or
  shared-request paragraph independent of the numbered exercises.
- The only inbound nonclosed object is `p0050-tail`. No attempt was made to
  reconstruct its owner or missing request from earlier pages.
- Every complete numbered exercise seen here ends locally; none continues
  across 0050/0051 or onward to 0052. In particular 112* ends with a complete
  question mark, followed by blank lower-page space and footer 44.
- Combined with the specifically approved chapter-start text on physical
  page 0052 / printed page 45, this establishes the right-hand closure of
  the final N11 material at 112*. It does not independently establish N11's
  title, start page, earlier exercise ownership or full prior-page content.

## Source uncertainty versus source error

Uncertainties retained: inbound tail ownership/missing request; exercise-109
dot meaning; small-question encoding convention; exercise-106 object
distinguishability; ordinary selection assumptions for people/flowers;
and the precise numerical-error convention in 112.

No definite mathematical source misprint is established by these two
images. In particular, a possible exponent-dot ambiguity is not an erratum,
and an unstated counting convention is not proof of a printed error.
The source is frozen without emendation.

Only source-first.md and source-math.md are authorized report outputs.
Candidate comparison remains NOT PERFORMED and requires a later explicit
request.
