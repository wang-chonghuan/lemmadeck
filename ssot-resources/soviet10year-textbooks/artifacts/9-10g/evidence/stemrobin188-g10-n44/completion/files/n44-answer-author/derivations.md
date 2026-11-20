# N44 Independent Standard-Answer Derivations

Scope: SAME188-6 / STEMROBIN-188, book `9-10g`, edition
`modern-us-neutral`, lesson `geo910-c2-s1-n44`, original exercises 16-22.
Written before the candidate. No parent, choice-author, reviewer answer, other
lesson key, answer PDF, source page or database was consulted. All seven sources
are `derived`; the book's `answers.json` is absent.

The current modern prose defines coordinates by
$\overrightarrow{OM}=x\vec i+y\vec j+z\vec k$ and vector differences by
$\overrightarrow{PQ}=Q-P$. All distance units below are the coordinate system's
length unit, not invented metres or centimetres.

## 16: Five Point Constructions

The exercise asks to **plot** points, not to repeat their supplied coordinates.
Use the lesson's concrete polygonal construction: start at $O$, move by
$x\vec i$, then $y\vec j$, then $z\vec k$. A negative component means the opposite
direction to that named basis vector; a zero component requires no movement.
Each segment is parallel to its corresponding axis, with length the absolute
value of that component in the coordinate scale.

1. $A$: $O(0,0,0)\to(2,0,0)\to(2,3,0)\to A(2,3,1)$.
   Movements are $+2\vec i,+3\vec j,+\vec k$.
2. $B$: $O(0,0,0)\to(1,0,0)\to(1,-1,0)\to B(1,-1,2)$.
   Movements are $+\vec i,-\vec j,+2\vec k$.
3. $D$: $O(0,0,0)\to(-3,0,0)\to(-3,\frac12,0)
   \to D(-3,\frac12,-1)$.
   Movements are $-3\vec i,+\frac12\vec j,-\vec k$.
4. $E$: the first segment collapses;
   $O(0,0,0)\to(0,2,0)\to E(0,2,-3)$.
   Thus $E$ lies in $Oyz$; movements are $+2\vec j,-3\vec k$.
5. $G$: both horizontal segments collapse;
   $O(0,0,0)\to G(0,0,-\frac32)$.
   Thus $G$ lies on the negative $Oz$ ray, $\frac32$ units from $O$.

The vector sum of each path is exactly the requested point's position vector,
so the construction gives every supplied coordinate, including both zero cases
and all negative and fractional components. No physical screen direction,
right-handed convention or perspective scale is imposed.

**Image observation, batch 1, two actual opens:** only `fig-g10-08` was needed.
The source PNG and locally rasterized, currently approved modern SVG both show
$O\to A\to B\to M$, basis directions $\vec i,\vec j,\vec k$, component labels
$x,y,z$, dashed $AB$, and interrupted $BM/OM$. The source and modern diagram are
symbolic schematics, not coordinate values to measure or limits on component
signs. The current FigureSpec was read. Source/spec/SVG/render/review and actual
raster paths are bound in the input and image receipts. Figures 6, 7 and 9 were
not opened: no exercise refers to them, and no further geometric data is needed.

Grading: `ungraded`, five construction subparts, `parts=[]`.

## 17: Two Directed Vectors

Subtract starting coordinates from ending coordinates; do not reverse $PQ$.

1. $Q-P=(-1-2,\,2-(-3),\,-3-0)=(-3,5,-3)$.
2. $Q-P=(-\frac35-\frac12,\,0-(-\frac43),\,\frac23-\frac56)
   =(-\frac{11}{10},\frac43,-\frac16)$.

Adding each resulting vector to its given $P$ recovers the given $Q$.
The tuple order is the explicitly supplied $(x,y,z)$ coordinate order.
Grading: `auto`, two `exact` parts, one entire ordered vector tuple per subpart.

## 18: Orthogonal Projection and Length

$Oyz$ has equation $x=0$. Orthogonal projection removes only the $x$ component:
$B=(0,-3,1)$, so $\overrightarrow{OB}=(0,-3,1)$ and
$|\overrightarrow{OB}|=\sqrt{0^2+(-3)^2+1^2}=\sqrt{10}$.

Grading: `auto`, one `numeric` part for the length; $B$ is an intermediate result.

## 19: Equidistant Point on the Entire Axis

Every point on $Oy$ is $M=(0,t,0)$ with $t\in\mathbb R$; restricting to the
positive ray would be unjustified.

$MA^2=(0-2)^2+(t+1)^2+(0-1)^2=t^2+2t+6$.

$MB^2=(0-0)^2+(t-1)^2+(0-3)^2=t^2-2t+10$.

Equality of distances is equivalent to equality of these nonnegative squares:
$4t=4$, hence $t=1$. The unique answer is $M=(0,1,0)$.
Substitution gives $MA^2=MB^2=9$.

Grading: `auto`, one `exact` part containing the entire ordered point tuple.

## 20: Two Medians, Centroid Distance, Three Interior Angles

All three vertices are fixed. Let $A_1$ be the midpoint of $BC$ and $B_1$ the
midpoint of $AC$.

### 20(1)

$A_1=(\frac72,\frac12,4)$,
$\overrightarrow{AA_1}=(\frac12,\frac52,3)$.
Thus $AA_1^2=\frac14+\frac{25}{4}+9=\frac{62}{4}$ and
$AA_1=\frac{\sqrt{62}}2$.

$B_1=(\frac72,-1,2)$,
$\overrightarrow{BB_1}=(\frac12,-2,-3)$.
Thus $BB_1^2=\frac14+4+9=\frac{53}{4}$ and
$BB_1=\frac{\sqrt{53}}2$.

### 20(2)

The medians intersect at the centroid
$T=\frac13(A+B+C)=(\frac{10}{3},-\frac13,3)$.
Therefore $OT^2=\frac{100}{9}+\frac19+9=\frac{182}{9}$ and
$OT=\frac{\sqrt{182}}3$.

### 20(3)

$\overrightarrow{AB}=(0,3,4)$, $AB=5$;
$\overrightarrow{AC}=(1,2,2)$, $AC=3$;
$\overrightarrow{BC}=(1,-1,-2)$, $BC=\sqrt6$.
The cross product $\overrightarrow{AB}\times\overrightarrow{AC}=(-2,4,-3)$
is nonzero, so the triangle is nondegenerate.

At $A$: $AB\cdot AC=14$, so
$\angle A=\arccos(\frac{14}{15})$.

At $B$: $BA\cdot BC=11$, so
$\angle B=\arccos(\frac{11}{5\sqrt6})$.

At $C$: $CA\cdot CB=-5$, so
$\angle C=\arccos(-\frac{5}{3\sqrt6})$.

These are **angles**, not just their cosines. Each inverse cosine uses its
unique interior-angle value in $(0,\pi)$; the negative third cosine makes $C$
obtuse. Exact expressions above use radian measure. For keys explicitly labelled
in degrees, multiply each inverse cosine by $\frac{180}{\pi}$.
The independent arithmetic receipt supplies degree approximations and verifies
their sum is $180^\circ$ using the law of cosines as a second computation.

Grading: `auto`, six `numeric` parts: two distinctly labelled median lengths,
one origin-to-centroid length, three distinctly labelled angles in degrees.
Angle tolerance is $0.01$ degree; it is explicit, not a change in the exact
standard answers.

## 21: All Three Source-Permitted Parallelograms

The prose says **three vertices**, not “three consecutive vertices” or
“parallelogram $ABCD$.” Among any three vertices of a parallelogram, exactly one
pair is opposite. Enumerate that pair as $AC$, $AB$ or $BC$. Equality of diagonal
midpoints forces the fourth vertex in each case, so the following is exhaustive.

### Opposite Pair AC

$D=A+C-B=(0,-6,0)$.
$\overrightarrow{AC}=(-4,4,1)$ and
$\overrightarrow{BD}=(2,-10,-1)$.
The two diagonal lengths are
$(AC,BD)=(\sqrt{33},\sqrt{105})$.

### Opposite Pair AB

$D=A+B-C=(2,0,0)$.
$\overrightarrow{AB}=(-3,7,1)$ and
$\overrightarrow{CD}=(5,-1,-1)$.
The two diagonal lengths are
$(AB,CD)=(\sqrt{59},3\sqrt3)$.

### Opposite Pair BC

$D=B+C-A=(-6,8,2)$.
$\overrightarrow{BC}=(-1,-3,0)$ and
$\overrightarrow{AD}=(-7,11,2)$.
The two diagonal lengths are
$(BC,AD)=(\sqrt{10},\sqrt{174})$.

The given points are noncollinear:
$(B-A)\times(C-A)=(3,-1,16)\ne0$.
All three resulting parallelograms are consequently nondegenerate.
As an unordered collection of unordered length pairs the full answer is
$\{\{\sqrt{33},\sqrt{105}\},\{\sqrt{59},3\sqrt3\},
\{\sqrt{10},\sqrt{174}\}\}$, not six independently interchangeable lengths.

Grading: `ungraded`, one prose task with three case branches, `parts=[]`.
The runtime exact judge is lexical and does not compare this unordered
case-associated collection semantically. No isolated length pair is accepted
as the entire answer, and no missing consecutive-vertex premise is added.
The finite ambiguity is resolved by complete enumeration; no local HOLD is needed.

## 22: Concrete Proof and Both Diagonal Intersection Angles

$\overrightarrow{AB}=(-1,-3,1)=\overrightarrow{DC}$ and
$\overrightarrow{AD}=(-3,-1,8)=\overrightarrow{BC}$.
Also
$\overrightarrow{AB}\times\overrightarrow{AD}=(-23,5,-8)\ne0$.
The two nonparallel pairs of opposite sides are equal and parallel, so the
four supplied points form a nondegenerate parallelogram with boundary order
$A,B,C,D$ **deduced**, not presumed.

Its diagonals $AC$ and $BD$ have the same midpoint
$X=(0,2,\frac12)$.
The other two pairings of the supplied points have unequal midpoints, so this
diagonal identification does not rely on alphabetical order.

$u=\overrightarrow{AC}=(-4,-4,9)$,
$v=\overrightarrow{BD}=(-2,2,7)$.
$u\cdot v=63$, $|u|^2=113$, $|v|^2=57$.
The acute angle is
$\theta=\arccos(\frac{63}{\sqrt{6441}})$.
The supplementary angle is
$\pi-\theta=\arccos(-\frac{63}{\sqrt{6441}})$.

More explicitly,
$\angle AXB=\angle CXD=\theta$ and
$\angle BXC=\angle DXA=\pi-\theta$.
Thus all four intersection angles are specified without an unstated acute-only
or oriented-vector convention. If “the angle between lines” means the smaller
angle, it is the first value; the second is the other actual intersection angle.
The independent arithmetic receipt gives both in degrees.

Grading: `ungraded`, the requested proof and angle calculation are both
completed in `displayAnswer`, `parts=[]`.

## Authoring Boundary

These are independent **author derivations**, not an independent semantic-review
PASS. The supplied ready adaptation/render prerequisite is not answer approval.
Structure/KaTeX/numeric-expression checks are bounded technical checks only.
Real MathLive keyboard serialization, semantic review and `lesson_answers.py
finalize` remain pending with the parent. No production `answer-keys.json`,
interaction specification, choice, source page, DB, environment, installation,
Git, backend, publication, deployment or closure is modified.
