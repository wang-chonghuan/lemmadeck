# N21 independent source-first freeze

Date: 2026-11-23. Ticket: STEMROBIN-184. Phase A only; finish=review.
ROOT: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

This inventory and the companion mathematics were derived before disclosure of
any candidate, author draft, answer key, choices, interaction specification or
historical review. Phase A stops at this freeze. No source edits, finalizers,
Git/staging operations, DB/environment access, network/browser/app operations,
dependency work, paid calls, keyboard interactions or application tests occurred.
The two freeze files are the only owned writes.

## Input and image accounting

Exactly four original `page.png` images were loaded, once each, in four separate
view calls, in physical order 79, 80, 81, 82. One batch: 4/8; current-context
image total: 4/24. No crops, grids, other images or reopens. SHA-256 was computed
from file bytes without decoding/reopening images.

All page paths share this absolute prefix:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n21-nov23-source7982/prepared/9c/pages/`.

| Physical page | Suffix | SHA-256 | Inspection |
| --- | --- | --- | --- |
| 79 | `0079/page.png` | `b2c718cb070ea09ca0ad8b1c67ef9184cf13aaf790561fed5d3eb7502d1073f7` | All N21 content |
| 80 | `0080/page.png` | `bd19338ddae3fa3c9891d6725d49f1ed76c08accbb4b37f205fce1eed2c3e213` | All N21 content |
| 81 | `0081/page.png` | `19c84168ff0718a3de9f7c037f218022b583a6bf825f7bdf76982f913428895f` | All N21 content, exercises and Figure12 |
| 82 | `0082/page.png` | `67db120051442916d43f8cb2e4a8ebf722d33594c69a00d26769d9d84c4ac39e` | Heading only |

Upstream TEXT-only input:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n21-nov23-source7982/source78-n21-context.json`
SHA-256: `289a3d8280f85560727f477a518dee1720ee03378f6169692e0af099a6e0ac9f`.
The caller identifies source78 blocks4-7 as independently approved by Dalton.
That approval is reused only for the supplied N21 text. No source78 pixels or
N20 material were inspected, and no prior review was independently repeated.

Chinese below preserves the source wording with line wraps joined. Mathematical
notation is normalized for readability, not a certification of original
codepoints, fonts or typesetting. `\varepsilon` denotes the visible epsilon
glyph. Formula structure and strict/non-strict relationships are optical
observations; their mathematical validity is a separate review.

## Upstream source78 N21 text

1. Heading: **21．数列的极限的定义**.
2. “我们来比较详细地研究一下前一小节中的第三个例子．‘当
   \(n\)充分大时，表达式\(y_n=\frac{n-1}{3n}\)的值与\(\frac13\)的差任意小’，
   这个论断的确切含意是什么呢？”
3. “先提出这样的问题：\(n\)应当等于多大时，差\(y_n-\frac13\)的绝对值小于
   0.001？因为”
   \[
   \left|y_n-\frac13\right|=\left|-\frac1{3n}\right|=\frac1{3n},
   \]
4. “因此，问题就归结为，求满足不等式”
   \[
   \frac1{3n}<0.001
   \]
   “的自然数\(n\)．”

This is upstream text reuse, not new optical evidence.

## Physical source79, printed page72

1. Continuation of the preceding inequality: “但是，这个不等式等价于不等式”
   \(3n>1000\)， “或者不等式” \(n>333\frac13\).
2. “因此，对于任意\(n>n_0=333\)，不等式”
   \[
   \left|y_n-\frac13\right|<0.001
   \]
   “成立．”
3. “假如我们用0.000001代替0.001，那么，经过同样的计算，可以证实：
   对于任意\(n>n_1=333333\)，有”
   \[
   \left|y_n-\frac13\right|<0.000001.
   \]
4. “任意取一个正数\(\varepsilon\)，然后自问：怎样的\(n\)满足不等式”
   \[
   \left|y_n-\frac13\right|=\frac1{3n}<\varepsilon? \tag{1}
   \]
5. “这个不等式等价于不等式” \(n>\frac1{3\varepsilon}\).
6. “因为我们只对\(n\)取整数的情况感兴趣，因此，我们的问题的答案是：
   对于一切\(n>N\)，其中\(N\)是数\(\frac1{3\varepsilon}\)的整数部分，
   不等式(1)成立．”
7. “自己分析前一小节的例1，例2，并加以证实：在这些情况下，对于任意
   正数\(\varepsilon\)，存在这样的自然数\(N\)，使得对于一切”
   **continues physically onto source80**.

## Physical source80, printed page73

1. Completes source79's last sentence: “\(n>N\)，不等式”
   \[
   |y_n-0|<\varepsilon
   \]
   “成立．” The referenced earlier examples are not supplied or re-reviewed.
2. “现在我们给出数列的极限的定义．”
3. **定义**：“如果对于任意正数\(\varepsilon\)，存在这样的自然数\(N\)，
   使得对于一切\(n>N\)，不等式”
   \[
   |x_n-a|<\varepsilon, \tag{2}
   \]
   “成立，那么数\(a\)叫做数列\((x_n)\)的极限．”
4. “这时，称‘数列\((x_n)\)有极限\(a\)’，并写成”
   \[
   \lim_{n\to\infty}x_n=a.
   \]
   “对于有极限的数列，我们说这个数列收敛．”
5. “数\(N\)（数列极限定义中的）既依赖于所讨论的数列，又依赖于所取的
   正数\(\varepsilon\)．”
6. “我们来证明：数\(\alpha\)的近似小数数列\((\alpha_n)\)和
   \((\alpha'_n)\)收敛于\(\alpha\)本身，即”
   \[
   \lim_{n\to\infty}\alpha_n
   =\lim_{n\to\infty}\alpha'_n=\alpha.
   \]
7. “如果\(\alpha\)是任意实数，而且\((\alpha_n)\)和\((\alpha'_n)\)
   分别是它的不足和过剩近似小数数列，那么”
   \[
   |\alpha_n-\alpha|\leq\frac1{10^n},\qquad
   |\alpha'_n-\alpha|\leq\frac1{10^n}.
   \]
   Both displayed error bounds are non-strict.
8. “因为，对于每一个正数\(\varepsilon\)，有这样的自然数\(N\)，使得当
   \(n>N\)时，有\(\frac1{10^n}<\varepsilon\)，因而也有”
   \[
   |\alpha_n-\alpha|<\varepsilon,\qquad
   |\alpha'_n-\alpha|<\varepsilon.
   \]
   **The concluding “因此” and limits continue on source81**.

## Physical source81, printed page74

1. Completes source80's proof: “因此”
   \[
   \lim_{n\to\infty}\alpha_n=\alpha,\qquad
   \lim_{n\to\infty}\alpha'_n=\alpha.
   \]
2. “我们来阐明数列的极限的几何意义．不等式(2)等价于双不等式”
   \[
   -\varepsilon<x_n-a<\varepsilon,
   \]
   “或者”
   \[
   a-\varepsilon<x_n<a+\varepsilon. \tag{3}
   \]
3. “不等式(3)说明，收敛于\(a\)的数列\((x_n)\)中，所有序号\(n>N\)的
   项，即\(x_{N+1},x_{N+2},\ldots\)，均落到开区间
   \(]a-\varepsilon,a+\varepsilon[\)内（图12）．这个区间叫做点\(a\)的
   \(\varepsilon\)邻域．” The reversed bracket notation denotes an open interval.
4. “因此，如果数\(a\)是数列\((x_n)\)的极限，那么该数列的项，除了有限项外，
   全都落到点\(a\)的任意一个（不管怎样小的）邻域内．”
   The finite exceptional set is interpreted separately for each neighborhood.
5. Heading: **习题**. Complete exercise/formula order follows.

### Figure12 independent optical inventory

- One ungraduated horizontal number-line-like stroke, extending left of the
  leftmost marked point and right of the rightmost marked point.
- Exactly three visible filled point marks on that stroke, left to right.
  Labels beneath them, respectively: \(a-\varepsilon\), \(a\),
  \(a+\varepsilon\).
- One right-facing arrowhead at the far right. The far left stroke end is
  unmarked and has no visible left-facing arrowhead.
- Caption beneath: “图 12”.
- The three marked positions are collinear and in the stated left-to-right order.
  The two gaps look approximately comparable; exact equality or coordinates
  were not measured and are not certified.
- No visible \(x_n\) point, origin/zero, numeric scale, additional point labels,
  interval-end circles, bracket marks or shaded interval.
- The filled points are labelled reference locations, not a visual claim that
  the neighborhood includes its endpoints. The prose and strict inequalities
  explicitly exclude \(a-\varepsilon\) and \(a+\varepsilon\).
- The stroke's left end and right arrow tip lie beyond the three reference
  points; neither is a neighborhood endpoint. These optical observations
  must not be replaced by algebraically inferred drawing details.

### Exercises159-162: complete original order

Subpart glyphs are recorded by visible shape. The first is a-shaped; its
Latin/Cyrillic codepoint is not recoverable from print. Subsequent shapes are
normalized as б, в, г. Row/column order is independent of encoding.

**159．证明：** Four subparts, two columns, two rows. Reading order:

1. Top left, a-shaped:
   \(\displaystyle\lim_{n\to\infty}\frac{n+1}{n}=1\).
2. Top right, б-shaped:
   \(\displaystyle\lim_{n\to\infty}\frac{5n-2}{n}=5\).
3. Bottom left, в-shaped:
   \(\displaystyle\lim_{n\to\infty}\frac{3n-2}{2n}=1.5\).
4. Bottom right, г-shaped:
   \(\displaystyle\lim_{n\to\infty}\frac1{n^2+1}=0\).

**160．求下列各数列的极限（加以证明）：** Two subparts in one row:

1. Left, a-shaped: \(\displaystyle a_n=\frac{5n-1}{2n}\).
2. Right, б-shaped: \(\displaystyle b_n=\frac{3n^2+1}{n^2}\).

**161．** “假设\(x_n=c\)，这里\(c\)是某一个常数．证明：
\(\displaystyle\lim_{n\to\infty}x_n=c\)．” No subparts.

**162．** “证明：数1不是数列
\(\displaystyle a_n=\frac{n+1}{2n}\)的极限．” No subparts.

Exercise162 ends on source81. There is no unfinished N21 exercise or sentence
to carry onto source82.

## Source82 boundary only

The inspected heading is **22．极限的唯一性．收敛数列和发散数列**.
It establishes the next-topic boundary: N21 ends on physical source81.
No N22 prose, mathematics, proof or exercise is transcribed, reviewed or solved.
Loading the whole original image does not enlarge this heading-only scope.

## Independent mathematical findings and limits

All seven original exercise subparts/tasks (159:4, 160:2, 161:1), plus the
non-limit task162, have independently derived proofs in:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n21-source7982/reviewer/exercise-math-first.json`.

The source's 333 and 333333 cutoffs are correct for strict `n > cutoff`;
the first passing indices are 334 and 333334. Decimal convergence follows
rigorously from the displayed error bounds. The limit definition, strict
interval equivalence and finite-exceptions interpretation are valid.
Exercise162 is disproved directly with epsilon=1/4: for every natural N,
n=max(N+1,2) lies beyond N and has error at least 1/4. Its actual limit is 1/2,
proved directly without using an N22 theorem.

One read-only exact BigInt rational-arithmetic audit completed 246 finite
checks with zero failures: 4 numeric tolerance boundaries, 40 error identities,
168 epsilon-tail instances, 5 non-limit tail witnesses, 5 demonstrations that
epsilon=1/2 is inadequate to disprove162, and 24 independently authored decimal
rounding-bound instances. These corroborate, but do not replace, the universal
symbolic proofs. No further checks or application tests are required for Phase A.

UNKNOWN/limited findings:

- The source79/80 reference to the preceding examples1/2 cannot be independently
  validated without excluded N20 material. Only its visible claim is inventoried.
- Earlier exact definitions of the decimal approximation sequences are excluded.
  The displayed bounds imply convergence; independent floor/ceiling constructions
  demonstrate valid approximations for arbitrary real numbers, but are not
  asserted to be the source's earlier definitions.
- The book's convention for whether zero is natural is not established here.
  `floor(1/(3*epsilon))` can be zero; if N must be positive, replace it in a
  derived witness by `max(1,floor(1/(3*epsilon)))`. This does not alter the limit.
- Printed homographs and exact epsilon/inequality font codepoints are not
  certified. Exact Figure12 coordinates/equal spacing are unmeasured.
- Candidate fidelity, proposed answers/options and downstream behavior are
  undisclosed and NOT REVIEWED.

Phase A is frozen. Await parent-specific candidate disclosure for a later
TEXT-only comparison in this same context; do not load additional images.
