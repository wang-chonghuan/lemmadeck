# n36 Independent Source Solutions

Stage: independent full-written-task solutions, recorded before any options.
Author scope: candidate only; this is not an approval or an answer-book lookup.
All commands use `/Users/yong/.codex/worktrees/d9b1/lemmadeck`, asserted.
Authority: n36 modern written exercise text and definition paragraphs only.
No answers, previous choices, previous ticket outputs, figures, DB, network,
publisher, application, Git or cap3 consulted.

## Frozen Text Binding

- Lesson template SHA-256: `a9f349530ad4fa19aebaa51a12912beb09e8c01ae277d9e32e777857613d1e13`
- Exercises template SHA-256: `e32a4957fe29e21a631ddde0cb6d313158449f3a741b54b9ac8141c28a4e9f3f`
- Unchanged lesson source SHA-256: `beeb61bc2ec0a7ef5691c74202ac3f217163a06d96cb1dc4ef7839cee819111e`
- Unchanged exercises source SHA-256: `079768886ed4820a2a9f8fa8ccdfe4b4801dca05ea053614acc8a36d76468891`
- Source figure count: 0. Authored figure count: 0.
- Modern sublabels are a,b,c,...; the immutable source labels remain Cyrillic.
- Text/layout is frozen. Formal choices await parent first-finalization notice.

## Concepts Used

Variables are real. The principal square root is nonnegative.
The lesson's definition paragraphs give
$\sqrt{u^2}=|u|$, with $|u|=u$ if $u\geq0$ and
$|u|=-u$ if $u<0$.
An even power is nonnegative; therefore
$\sqrt{v^{2k}}=|v^k|$, not automatically $v^k$.
For $r\geq0$, $|x-c|=r$ has $x=c-r,c+r$, with coincident
roots when $r=0$; $|x-c|\leq r$ has $c-r\leq x\leq c+r$.
For $r<0$, an absolute value cannot equal $r$.
Square-root equations must retain their domain and the nonnegative sign of the
root; squaring does not by itself justify all resulting candidates.

These are derivations from the definitions and elementary algebra. Worked
lesson examples are not selected as seed concepts.

## 761

Task: identify every qualifying member of each given finite set.

a) $\sqrt{x^2}=x$ means $|x|=x$, equivalent to $x\geq0$.
In $\{3,-4,0,10,-5\}$, the qualifying members are $\{3,0,10\}$.
Zero qualifies, since both sides are zero.

b) $\sqrt{a^2}=-a$ means $|a|=-a$, equivalent to $a\leq0$.
In $\{2,9,-6,1,-8\}$, the qualifying members are $\{-6,-8\}$.
The set contains no zero, but the general condition includes zero.

Distinction: principal-root nonnegativity and opposite sign branches;
selecting members should be native multiple, not pair-combination codes.

## 762

Task: evaluate all nine roots.

Every radicand is a square; take the absolute value of its base:

a) $|0.1|=0.1$.
b) $|-0.4|=0.4$.
c) $|-0.8|=0.8$.
d) $|1.7|=1.7$.
e) $|-1.9|=1.9$.
f) $|2.4|=2.4$.
g) $|-23|=23$.
h) $|52|=52$.
i) $|-61|=61$.

Full ordered result:
$(0.1,0.4,0.8,1.7,1.9,2.4,23,52,61)$.
Coherent response unit: the entire list, not nine arithmetic clicks.

## 763

Task: evaluate each expression for every supplied value, preserving input order.

a) $\sqrt{x^2}=|x|$. At $22,-35,-1\frac23,0$ the values are
$22,35,\frac53,0$, respectively.
The negative mixed number means $-(1+\frac23)=-\frac53$.

b) $2\sqrt{a^2}=2|a|$. At $-7,12$ the values are $14,24$.

c) $0.1\sqrt{y^2}=0.1|y|$. At $-15,37$ the values are $1.5,3.7$.
The coefficient stays outside the root.

The three expression-to-input correspondences form a meaningful complete
evaluation table; avoid independent items for each cell.

## 764

Task: replace each radical by an identity valid for all real values.

a) $\sqrt{p^2}=|p|$.
b) $\sqrt{y^2}=|y|$.
c) $3\sqrt{b^2}=3|b|$.
d) $-0.2\sqrt{x^2}=-0.2|x|$.

No unrestricted identity may discard absolute values. In d), the outside
negative coefficient is not removed by the principal-root convention.
All four form one identity-transformation task.

## 765

Task: remove absolute values under each given sign condition.

a) $c\geq0$ gives $\sqrt{c^2}=c$.
b) The actual given condition is $a>0$, so $\sqrt{a^2}=a$.
This condition is true and sufficient. It is retained; no erratum is invented.
c) $x<0$ gives $\sqrt{x^2}=-x$.
d) $a\geq0$ gives $4\sqrt{a^2}=4a$.
e) $b<0$ gives $2\sqrt{b^2}=-2b$.
f) $x<0$ gives $-1.5\sqrt{x^2}=-1.5(-x)=1.5x$.
Here the final value is negative, since the coefficient outside the root is
negative; nonnegativity applies to the root, not the whole expression.

Coherent response unit: determine all valid condition-bound transformations.
Retain all six conditions visibly; do not merely test six isolated numbers.

## 766

Task: give all-real identities, recognizing perfect-square trinomials.

a) $\sqrt{(a-1)^2}=|a-1|$.
b) $\sqrt{(c+2)^2}=|c+2|$.
c) $x^2+2x+1=(x+1)^2$, so the root is $|x+1|$.
d) $4y^2-4y+1=(2y-1)^2$, so the root is $|2y-1|$.

The two factorizations and the absolute values are both essential. A complete
four-row equivalence table retains them together.

## 767

Task: transform all shifted squares using the given threshold.

a) $x\geq4$ gives $x-4\geq0$, hence root $x-4$.
b) $a<2$ gives $a-2<0$, hence root $2-a$.
c) $m\geq3$ gives $3-m\leq0$, hence root $m-3$.
At $m=3$, both expressions are zero.
d) $y<-7$ gives $7+y<0$, hence root $-7-y$.
e) $c\geq-10$ gives $10+c\geq0$, hence root $10+c$.
At $c=-10$, the result is zero.
f) $n<-4$ gives $n+4<0$, hence root $-n-4$.

Coherent response unit: all correct threshold-dependent identities, with
the entire inner binomial negated when negative.

## 768

Task: first express every radicand as a monomial square, then compute
each whole expression, including outside coefficients.

a) $2^4=(2^2)^2$, so $\sqrt{2^4}=|2^2|=4$.
b) $3^6=(3^3)^2$, so $\sqrt{3^6}=|3^3|=27$.
c) $(-5)^4=((-5)^2)^2$, so its root is $25$.
d) $(-2)^8=((-2)^4)^2$, so its root is $16$.
e) The same radicand is $((-2)^4)^2$;
$3\sqrt{(-2)^8}=3\cdot16=48$.
f) $(-10)^4=((-10)^2)^2$;
$-2\sqrt{(-10)^4}=-2\cdot100=-200$.
g) $(-3)^8=((-3)^4)^2$;
$0.1\sqrt{(-3)^8}=0.1\cdot81=8.1$.
h) $(0.1)^{10}=((0.1)^5)^2$;
$100\sqrt{(0.1)^{10}}=100\cdot0.00001=0.001$.

Ordered whole-expression results: $(4,27,25,16,48,-200,8.1,0.001)$.
The square representation is part of the source task and must remain in
each candidate claim, rather than only a final numerical result.

## 769

Task: simplify each high-power radical under its supplied condition.

a) $y^6=(y^3)^2$ and $y\geq0$ gives $|y^3|=y^3$.
b) $m^4=(m^2)^2$ and $m^2\geq0$ for every real $m$;
the result is $m^2$ without needing $m\geq0$.
c) $x^{10}=(x^5)^2$ and $x<0$ gives $x^5<0$;
the result is $-x^5$.
d) $a^8=(a^4)^2$ and $a^4\geq0$ even when $a<0$;
the whole result is $5a^4$, not $-5a^4$.
e) $c^{12}=(c^6)^2$ and $c^6\geq0$;
the whole result is $\frac13c^6$.
f) $z^{18}=(z^9)^2$ and $z<0$ gives $z^9<0$;
the whole result is $-1.5z^9$, which is positive.

Distinction: parity of the halved exponent, not just the sign of the original
variable. Keep these six sign-and-parity judgments as a coherent task.

## 770

Task: simplify all four roots by comparing the inner terms.

a) $\sqrt2>1$, so $|\sqrt2-1|=\sqrt2-1$.
b) $\sqrt3>1$, so $|1-\sqrt3|=\sqrt3-1$.
c) $11>10\geq0$ implies $\sqrt{11}>\sqrt{10}$,
so the result is $\sqrt{11}-\sqrt{10}$.
d) $8>5\geq0$ implies $\sqrt8>\sqrt5$,
so the result is $\sqrt8-\sqrt5=2\sqrt2-\sqrt5$.

A four-row complete simplified-result table preserves the required ordering
comparison and change of sign.

## 771

Task: solve all four absolute-value equations completely.

a) $|x|=4$ gives $x=-4,4$.
b) $|x|+1=0$ would require $|x|=-1$, impossible;
the real solution set is empty.
c) $|x-1|=1$ gives $x-1=-1,1$, hence $x=0,2$.
d) $|x+7|=3$ gives $x+7=-3,3$, hence $x=-10,-4$.

Each equation is a separate complete solution-set problem. A single response
must include both roots when appropriate, not one item per root; the
impossible equation tests the sign constraint.

## 772

Task: solve all four non-strict distance inequalities with endpoints.

a) $|x-2|\leq4$ gives $-4\leq x-2\leq4$, hence $x\in[-2,6]$.
b) $|5-x|=|x-5|\leq2.5$ gives
$-2.5\leq x-5\leq2.5$, hence $x\in[2.5,7.5]$.
c) $|x+15|\leq1$ gives $-1\leq x+15\leq1$,
hence $x\in[-16,-14]$.
d) $|x+7|\leq6$ gives $-6\leq x+7\leq6$,
hence $x\in[-13,-1]$.

All endpoints are included, because the source uses $\leq$.
One complete interval-correspondence table can cover all four without
turning each endpoint into a choice click.

## 773

Task: produce the graph of $y=\sqrt{x^2}$ and determine where it increases.

The function is $y=|x|$ on all real numbers:
$y=-x$ for $x\leq0$ and $y=x$ for $x\geq0$.
To draw it, plot $(-2,2),(-1,1),(0,0),(1,1),(2,2)$.
Join into two rays with vertex $(0,0)$, left ray slope $-1$,
right ray slope $1$; both rays extend without endpoints at infinity.
The range is $[0,\infty)$.
It decreases on $(-\infty,0]$ and increases on $[0,\infty)$.
For any $0\leq x_1<x_2$, $|x_1|=x_1<x_2=|x_2|$,
so zero is included in the maximal increasing interval.

No figure is created under the ZERO-images constraint. The complete construction
is specified mathematically but is not visually executed. A future choice
question can test a full piecewise graph description and the increasing interval.
It cannot demonstrate that the learner produced the graph. This production
capacity must be explicitly omitted in coverage, not marked fully preserved.

## 774

Task: draw the pairs of graphs and solve by their intersection readings,
including approximate graphical inference.

a) Draw $y=\sqrt{x}$ for $x\geq0$ and $y=6-x$.
Useful root-curve points are $(0,0),(1,1),(4,2),(9,3)$;
use $(0,6),(6,0)$ for the line. The increasing root curve and decreasing
line have exactly one intersection, $(4,2)$, so the graphical solution is
$x\approx4$. The listed points locate an exact crossing; a real drawing
still involves choosing scales, plotting and reading.

Independent algebra verifies the crossing without replacing the drawing task:
the equality requires $0\leq x\leq6$.
Squaring gives $x=(6-x)^2$, hence
$x^2-13x+36=(x-4)(x-9)=0$.
The candidate $9$ fails $x\leq6$ and gives $3\ne-3$;
only $x=4$ is valid.

b) Draw $y=\sqrt{x}$ and $y=6/x$ on the common domain $x>0$.
The negative branch of the hyperbola cannot intersect the root curve,
which is undefined for negative $x$; $x=0$ is also forbidden.
Useful hyperbola points are $(1,6),(2,3),(3,2),(4,1.5),(6,1)$.
The root curve increases and the positive hyperbola decreases, so there
is exactly one intersection. It lies between $x=3$ and $x=4$.
More finely, at $x=3.30$ we have $x^3=35.937<36$,
so $\sqrt{x}<6/x$; at $x=3.31$, $x^3=36.264691>36$,
so $\sqrt{x}>6/x$. Therefore the intersection is in $(3.30,3.31)$,
and a suitable drawing reads approximately $x=3.3$, $y=1.82$.

Algebraic cross-check: multiply by positive $x$ to obtain
$x^{3/2}=6$, then square to obtain $x^3=36$.
Thus the exact root is $\sqrt[3]{36}\approx3.3019272489$,
and the ordinate is $\sqrt[3]{6}\approx1.8171205928$.
The exact form is verification, not evidence of graph production or graphical
approximate reading.

No source or authored image exists. Future text-only choices may judge
which curve pair, common domain, intersection uniqueness and approximate
abscissa characterize each graphical solution. They cannot prove graph
production, scale selection, or an actual visual approximate reading.
Record all three losses substantively; do not relabel algebraic solving
as complete preservation of the source's graphical method.

## 775

Task: solve every root equation, retaining the domain and sign checks.

a) $\sqrt{x}=9$ requires $x\geq0$; squaring gives $x=81$,
and $\sqrt{81}=9$ checks.
b) $\sqrt{x}=\frac13$ requires $x\geq0$; squaring gives
$x=\frac19$, which checks.
c) $\sqrt{x+1}=-2$ has domain $x\geq-1$ but is impossible
because the left side is nonnegative. Squaring to obtain $x=3$
would introduce a false root: $\sqrt4=2\ne-2$.
d) $\sqrt{x+1}=1$ has domain $x\geq-1$; squaring gives
$x+1=1$, hence $x=0$, which checks.
e) $\sqrt{6x-3}=5$ has domain $x\geq\frac12$;
$6x-3=25$ gives $x=\frac{28}{6}=\frac{14}{3}$, which checks.
f) $\sqrt{10x+7}=0$ has domain $x\geq-\frac7{10}$;
$10x+7=0$ gives $x=-\frac7{10}$, the included domain boundary,
which checks.

Meaningful source units: complete solution sets, retaining the no-solution
case and the zero-root domain endpoint. Do not create items per equation step.

## 776

Task: find the entire preimage of the closed interval $[-1,1]$.

$-1\leq\frac13x-8\leq1$.
Add $8$ throughout: $7\leq\frac13x\leq9$.
Multiply by positive $3$: $21\leq x\leq27$.
The solution is $[21,27]$. At the left endpoint $y=-1$,
and at the right endpoint $y=1$, so both endpoints belong.
The complete interval is the response unit, not two endpoint questions.

## Capacity Record

All 16 original exercises and all their written subparts have independent
solutions above. No original task is silently dropped from this evidence.
773 graph production and 774 graph production plus graphical approximate
reading are not executed under ZERO images. They must be named in any
choice draft's limitations and coverage.

Any choice response also loses free-form production of expressions,
calculations, factorizations or proof steps. Meaningful complete results and
native mathematical selection can retain their substantive distinctions;
the artifact must not claim an independent written derivation was observed.
No options or keyed alternatives existed at the time this record was written.
