# Independent Standard Answer Source-Solve Freeze

Ticket: STEMROBIN-184
Date: 2026-11-16 (Europe/Dublin)
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck
Future lesson targets: geo910-c1-s2-n18 / geo910-c1-s2-n19
Scope: exactly 13 written exercises, 13writtenex179 through 13writtenex191.
State: independent source solutions frozen; NOT modern-edition Gate 2.

## Independence and Input Boundary

This document was derived directly from the permitted current faithful source
exercise text, before reading any pre-existing parent answer, answer key,
book-answer file, choice file, reviewer file, or finalized modern exercise text.
No author answer prose was disclosed or read before this freeze. No image,
FigureSpec, or rendered diagram was opened or inspected. None of these exercise
bodies references a source figure ID; figures accompanying the surrounding
source exposition were not used.

Governance read: AGENTS.md, .intentfold/readme.md, .intentfold/project.json,
.intentfold/charter/engineering.md, .intentfold/charter/operations.md,
.intentfold/charter/product.md, the intentfold skill, and
.claude/skills/ld-s10y-answer/SKILL.md with
references/gate-2-lesson-answers/gate.md. The existing continuous invocation's
freshness/setup state is retained; no initialization, grill, or update was run.

The only mathematical source inputs used were the exercise bodies in these two
files. SHA-256 was computed from the actual local file bytes, and the same hashes
were observed again immediately before writing this freeze:

| Input | Exercise Coverage | Actual File SHA-256 |
| --- | --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0069/page.md` | 179-185; physical page 69, printed page 62 | `82edff583a45c4148da8176b3fbc561b44752f7bb315b0b7fc0cbc74618e70b4` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0071/page.md` | 186-191; physical page 71, printed page 64 | `10383d652d4da0a11e887509170f93608564a37bf907da0a0afe13422e600c16` |

No additional source definitions from pages 0067, 0068, or 0070 were needed.
Source Stage B's literal verification is reported by the assigning parent, not
reperformed or claimed here. Source row-counter repair, assembly, and modern
text finalization were pending at assignment.

For algebraic checks, let $\mathbf p_X$ denote the position vector of a point
$X$ relative to any one common origin. Then
$\overrightarrow{XY}=\mathbf p_Y-\mathbf p_X$. This is a method used in this
independent solution, not an imported answer. Vector equality includes direction
and length; equality of lengths alone is not substituted for vector equality.

## 179 / 13writtenex179

**Source task:** Can the length of the sum of two vectors be less than the length
of each summand?

**Answer: Yes.** Take a vector $\vec u$ of length 1 and choose
$\vec a=2\vec u$, $\vec b=-3\vec u$. These vectors have opposite directions;
$\vec a+\vec b=-\vec u$ has length 1, which is less than both 2 and 3.
This gives a nonzero resultant, so the answer does not depend on permitting only
the zero-vector example.

Also, two equal-length nonzero opposite vectors have zero sum, whose length is
less than either summand's length. If a summand is zero, a sum cannot have length
strictly below that summand's length 0. These cases do not change the existence
answer to the question.

## 180 / 13writtenex180

**Source conditions:** $ABCD$ is a trapezoid in cyclic vertex order, with bases
$[AD]$ and $[BC]$ of lengths $a$ and $b$, where $a>b$.
Construct directed segments for all three sums and find their lengths.

The vectors $\overrightarrow{AD}$ and $\overrightarrow{BC}$ point in the same
direction along parallel bases. Put $\vec e=\overrightarrow{AD}/a$, so
$|\vec e|=1$, $\overrightarrow{AD}=a\vec e$, and
$\overrightarrow{BC}=b\vec e$.

1. **$\overrightarrow{AD}+\overrightarrow{BC}$.**
   Extend ray $AD$ beyond $D$ to a point $E$ with $DE=b$, directed from $D$
   in the direction of $\overrightarrow{BC}$. The triangle rule gives
   $\overrightarrow{AE}=\overrightarrow{AD}+\overrightarrow{DE}
   =\overrightarrow{AD}+\overrightarrow{BC}$.
   Thus the answer is $\overrightarrow{AE}=(a+b)\vec e$, of length **$a+b$**.
2. **$\overrightarrow{AD}+\overrightarrow{CB}$.**
   From $D$, lay off length $b$ toward $A$, obtaining $F$ on $[AD]$ with
   $DF=b$. Since $a>b$, $F$ lies strictly between $A$ and $D$.
   Here $\overrightarrow{DF}=\overrightarrow{CB}$, so the answer is
   $\overrightarrow{AF}=(a-b)\vec e$, of length **$a-b$**.
3. **$\overrightarrow{AB}+\overrightarrow{CD}$.**
   The polygonal path $A\to B\to C\to D$ gives
   $\overrightarrow{AB}+\overrightarrow{BC}+\overrightarrow{CD}
   =\overrightarrow{AD}$. Subtracting $\overrightarrow{BC}$ gives
   $\overrightarrow{AB}+\overrightarrow{CD}
   =\overrightarrow{AD}-\overrightarrow{BC}
   =\overrightarrow{AF}$, with the same $F$ as in part 2.
   Its length is **$a-b$**, and its direction is $A\to D$.
   Equivalently, translate $\overrightarrow{CD}$ to start at $B$; its endpoint
   is $F$, giving the construction $A\to B\to F$.

No isosceles or right-trapezoid assumption is needed. The ordinary trapezoid
conditions supply positive base lengths and distinct parallel base lines. If
one extends the identity to $a=b$, parts 2 and 3 become zero vectors; that case
is outside the source's strict $a>b$ hypothesis.

## 181 / 13writtenex181

**Source task:** In triangle $ABC$, $AM$ is a median. Prove
$\overrightarrow{AM}+\overrightarrow{AM}
=\overrightarrow{AB}+\overrightarrow{AC}$.

Because $M$ is the midpoint of $BC$,
$\overrightarrow{MB}+\overrightarrow{MC}=\vec 0$. Apply the triangle rule:

$$
\begin{aligned}
\overrightarrow{AB}+\overrightarrow{AC}
&=(\overrightarrow{AM}+\overrightarrow{MB})
 +(\overrightarrow{AM}+\overrightarrow{MC})\\
&=\overrightarrow{AM}+\overrightarrow{AM}.
\end{aligned}
$$

This proves the requested equality, not merely a length relation. The midpoint
identity also remains valid for collinear or coincident points when the midpoint
is defined, although the stated task uses a genuine triangle.

## 182 / 13writtenex182

**Source task:** Prove
$\overrightarrow{AB}+\overrightarrow{DA}=\overrightarrow{DB}$.

By commutativity and the path $D\to A\to B$,

$$
\overrightarrow{AB}+\overrightarrow{DA}
=\overrightarrow{DA}+\overrightarrow{AB}
=\overrightarrow{DB}.
$$

No noncollinearity or distinctness assumption is required. If points coincide,
the same path identity includes the corresponding zero vectors.

## 183 / 13writtenex183

**Source task:** Find
$\overrightarrow{AB}+\overrightarrow{BC}+\overrightarrow{CA}$.

**Answer: $\vec 0$.** Indeed,

$$
\overrightarrow{AB}+\overrightarrow{BC}+\overrightarrow{CA}
=\overrightarrow{AC}+\overrightarrow{CA}
=\vec 0.
$$

This is a closed path and remains true for any three points, including
collinear or coincident points.

## 184 / 13writtenex184

**Source conditions:** $ABCD$ is a tetrahedron. Find all three sums.

1. **$\overrightarrow{AB}+\overrightarrow{BD}+\overrightarrow{DC}
   =\overrightarrow{AC}$.**
   Follow the path $A\to B\to D\to C$.
2. **$\overrightarrow{AD}+\overrightarrow{CB}+\overrightarrow{DC}
   =\overrightarrow{AB}$.**
   Reorder to follow $A\to D\to C\to B$:
   $(\overrightarrow{AD}+\overrightarrow{DC})+\overrightarrow{CB}
   =\overrightarrow{AC}+\overrightarrow{CB}=\overrightarrow{AB}$.
3. **$\overrightarrow{AB}+\overrightarrow{CD}
   +\overrightarrow{BC}+\overrightarrow{DA}=\vec 0$.**
   Reorder to the closed path $A\to B\to C\to D\to A$.

The tetrahedron supplies the stated setting but is not needed for these
identities. They hold for any four points, even coplanar, collinear, or
coincident ones.

## 185 / 13writtenex185

**Source conditions:** $ABCDA_1B_1C_1D_1$ is a parallelepiped, with the
usual corresponding vertices. Find all four sums. No rectangular,
orthogonal-edge, or cube assumption is made.

For an independent component check, set
$\vec u=\overrightarrow{AB}$, $\vec v=\overrightarrow{AD}$,
$\vec w=\overrightarrow{AA_1}$. Taking $A$ as origin gives

$$
\begin{array}{c|cccccccc}
X&A&B&C&D&A_1&B_1&C_1&D_1\\ \hline
\mathbf p_X&0&\vec u&\vec u+\vec v&\vec v&
\vec w&\vec u+\vec w&\vec u+\vec v+\vec w&\vec v+\vec w
\end{array}
$$

1. **$\overrightarrow{AB}+\overrightarrow{BB_1}
   +\overrightarrow{B_1C_1}=\overrightarrow{AC_1}$.**
   The path is $A\to B\to B_1\to C_1$.
   The component sum is $\vec u+\vec w+\vec v
   =\vec u+\vec v+\vec w$.
2. **$\overrightarrow{CB}+\overrightarrow{B_1A_1}
   +\overrightarrow{AD_1}=\overrightarrow{BA_1}$.**
   Corresponding edges give
   $\overrightarrow{B_1A_1}=\overrightarrow{BA}$ and
   $\overrightarrow{CB}=\overrightarrow{DA}$. Following the path
   $D\to A\to D_1$ gives
   $\overrightarrow{CB}+\overrightarrow{AD_1}
   =\overrightarrow{DA}+\overrightarrow{AD_1}
   =\overrightarrow{DD_1}=\overrightarrow{AA_1}$.
   Adding $\overrightarrow{B_1A_1}=\overrightarrow{BA}$ therefore gives
   $\overrightarrow{BA}+\overrightarrow{AA_1}
   =\overrightarrow{BA_1}$.
   The full component check is
   $-\vec v-\vec u+(\vec v+\vec w)=\vec w-\vec u$.
   An equivalent answer is $\overrightarrow{CD_1}$.
3. **$\overrightarrow{AC_1}+\overrightarrow{D_1A}
   +\overrightarrow{BD_1}=\overrightarrow{AD_1}$.**
   Reorder to the path $B\to D_1\to A\to C_1$, whose resultant is
   $\overrightarrow{BC_1}$. Corresponding face diagonals give
   $\overrightarrow{BC_1}=\overrightarrow{AD_1}$.
   The component check is
   $(\vec u+\vec v+\vec w)-(\vec v+\vec w)
   +(\vec v+\vec w-\vec u)=\vec v+\vec w$.
4. **Literal source expression:
   $\overrightarrow{D_1C}+\overrightarrow{AA_1}
   +\overrightarrow{CB}+\overrightarrow{C_1C}$.**
   Its answer is **$\overrightarrow{D_1B}$**.
   Since $\overrightarrow{AA_1}=\overrightarrow{CC_1}$,
   $\overrightarrow{AA_1}+\overrightarrow{C_1C}=\vec 0$.
   The remaining path $D_1\to C\to B$ gives
   $\overrightarrow{D_1C}+\overrightarrow{CB}
   =\overrightarrow{D_1B}$.
   The component check, retaining every literal endpoint, is
   $(\vec u-\vec w)+\vec w-\vec v-\vec w
   =\vec u-\vec v-\vec w=\overrightarrow{D_1B}$.
   In particular, $\overrightarrow{D_1C}$ must not be silently changed
   into $\overrightarrow{D_1C_1}$.

The position identities require the parallelepiped's corresponding-edge
relations, not edge perpendicularity. They still hold in a collapsed affine
configuration satisfying those relations, but such a configuration is not the
nondegenerate solid stated in the source.

## 186 / 13writtenex186

**Source conditions:** $ABCD$ is a tetrahedron. Starting at $A$, construct
vectors opposite to each of $\overrightarrow{DB}$,
$\overrightarrow{CD}$, and $\overrightarrow{BC}$.

1. **Opposite to $\overrightarrow{DB}$:** construct a point $X_1$ such that
   $\overrightarrow{AX_1}=\overrightarrow{BD}=-\overrightarrow{DB}$.
   Through $A$ draw a line parallel to $BD$, choose the sense $B\to D$,
   and copy length $BD$ along that ray.
2. **Opposite to $\overrightarrow{CD}$:** construct $X_2$ with
   $\overrightarrow{AX_2}=\overrightarrow{DC}=-\overrightarrow{CD}$.
   Through $A$ draw a parallel to $DC$, choose the sense $D\to C$,
   and copy length $DC$.
3. **Opposite to $\overrightarrow{BC}$:** construct $X_3$ with
   $\overrightarrow{AX_3}=\overrightarrow{CB}=-\overrightarrow{BC}$.
   Through $A$ draw a parallel to $CB$, choose the sense $C\to B$,
   and copy length $CB$.

A straightedge-and-compass realization uses the corresponding parallelograms
$BDX_1A$, $DCX_2A$, and $CBX_3A$: intersect the two appropriate parallels
through the given endpoints. Tetrahedron nondegeneracy makes the defining
adjacent sides nonparallel. The algebraic endpoints are

$$
\mathbf p_{X_1}=\mathbf p_A+\mathbf p_D-\mathbf p_B,\qquad
\mathbf p_{X_2}=\mathbf p_A+\mathbf p_C-\mathbf p_D,\qquad
\mathbf p_{X_3}=\mathbf p_A+\mathbf p_B-\mathbf p_C.
$$

Thus each constructed vector has the original vector's length and its reversed
direction, with the required initial point $A$. If extending the construction
to a zero input vector, its opposite is zero and its endpoint is $A$; no
direction needs to be assigned to that zero vector.

## 187 / 13writtenex187

**Source conditions:** $O,A,B$ are noncollinear and
$\overrightarrow{OC}=\overrightarrow{OA}-\overrightarrow{OB}$.
Prove that the quadrilateral in the exact order **$OBAC$** is a parallelogram.

The given relation gives

$$
\overrightarrow{OC}
=\overrightarrow{OA}-\overrightarrow{OB}
=\overrightarrow{BA}.
$$

It also gives

$$
\overrightarrow{CA}
=\overrightarrow{OA}-\overrightarrow{OC}
=\overrightarrow{OB}.
$$

Consequently the opposite sides of $OBAC$ satisfy
$\overrightarrow{OB}=\overrightarrow{CA}$ and
$\overrightarrow{BA}=\overrightarrow{OC}$: they are parallel and equal
with the appropriate orientations.

To verify that this is a genuine, nondegenerate quadrilateral, take $O$ as
origin and write $\mathbf p_B=\vec b$, $\mathbf p_A=\vec a$.
Then $\mathbf p_C=\vec a-\vec b$ and the consecutive vertices are
$0,\vec b,\vec a,\vec a-\vec b$. Its adjacent side vectors are
$\vec b$ and $\vec a-\vec b$. Noncollinearity of $O,A,B$ makes these vectors
linearly independent, so this is an ordinary parallelogram, not a collapsed
four-point chain. Its diagonals are $OA$ and $BC$, sharing midpoint
$\vec a/2$.

If the noncollinearity condition is removed, the same vector equalities can
describe a collinear or collapsed configuration; they would not ensure a
nondegenerate parallelogram. The source's condition is therefore material.

The source transcription contains an isolated `U+21B5` layout glyph between
the $\overrightarrow{OC}$ token and the equality sign. It was not treated as
a mathematical operation, and no source file was changed. The mathematical
condition above retains the source's points, equality, and subtraction.

## 188 / 13writtenex188

**Source conditions:** $O$ is outside the plane of triangle $ABC$.
Construct all three vectors with initial point $O$.
For the checks below use $O$ as origin and put
$\vec a=\overrightarrow{OA}$, $\vec b=\overrightarrow{OB}$,
$\vec c=\overrightarrow{OC}$.

1. **$\overrightarrow{OA}-\overrightarrow{OB}$.**
   Since this equals $\overrightarrow{BA}$, translate
   $\overrightarrow{BA}$ to start at $O$. Through $O$ draw a parallel to
   $BA$ in the sense $B\to A$ and copy length $BA$, ending at $P_1$.
   Then $\overrightarrow{OP_1}=\overrightarrow{BA}=\vec a-\vec b$.
   Equivalently, complete the parallelogram $BAP_1O$.
   In a common arbitrary position frame,
   $\mathbf p_{P_1}=\mathbf p_O+\mathbf p_A-\mathbf p_B$.
2. **Literal source expression:
   $-\overrightarrow{OA}-\overrightarrow{OC}$.**
   Both summands have minus signs; this is not
   $\overrightarrow{OC}-\overrightarrow{OA}$.
   Let $M$ be the midpoint of $AC$. The midpoint identity gives
   $\overrightarrow{OA}+\overrightarrow{OC}
   =\overrightarrow{OM}+\overrightarrow{OM}$.
   On the ray from $O$ opposite to $O\to M$, choose $P_2$ with
   $OP_2=2\,OM$. Thus
   $\overrightarrow{OP_2}
   =-\overrightarrow{OM}-\overrightarrow{OM}
   =-\overrightarrow{OA}-\overrightarrow{OC}$.
   One can construct this length by copying segment $OM$ twice in the
   selected direction. In positions,
   $\mathbf p_{P_2}=3\mathbf p_O-\mathbf p_A-\mathbf p_C$.
   Another direct construction reflects $A$ and $C$ in $O$, then adds the
   resulting two vectors from $O$ by the triangle rule.
3. **$\overrightarrow{OA}+\overrightarrow{OB}
   -\overrightarrow{OC}$.**
   Use $\overrightarrow{OB}-\overrightarrow{OC}=\overrightarrow{CB}$.
   From $A$, copy $\overrightarrow{CB}$ to get $P_3$ with
   $\overrightarrow{AP_3}=\overrightarrow{CB}$; then join $O$ to $P_3$.
   The triangle rule gives
   $\overrightarrow{OP_3}=\overrightarrow{OA}+\overrightarrow{AP_3}
   =\overrightarrow{OA}+\overrightarrow{OB}-\overrightarrow{OC}$.
   Equivalently, take the midpoint $N$ of $AB$ and reflect $C$ in $N$.
   This gives
   $\mathbf p_{P_3}=\mathbf p_A+\mathbf p_B-\mathbf p_C$.
   Thus $P_3$ is in the plane of $ABC$, and $CAP_3B$ is a parallelogram;
   the required answer is still the vector starting at $O$, namely
   $\overrightarrow{OP_3}$, not the auxiliary vector
   $\overrightarrow{AP_3}$.

All three constructions specify both direction and magnitude and determine
unique endpoints. Under the source conditions, $P_1\ne O$ because $A\ne B$,
$P_2\ne O$ because $M$ lies in the triangle's plane while $O$ does not,
and $P_3\ne O$ because $P_3$ lies in that plane. Thus there is no zero-vector
exception in this source exercise. The vector identities themselves also
extend to less restrictive point configurations, with a zero result represented
by its endpoint equal to $O$.

## 189 / 13writtenex189

**Source task:** If $\angle ACB$ is a right angle in triangle $ABC$, prove
$|\overrightarrow{CA}+\overrightarrow{CB}|
=|\overrightarrow{CA}-\overrightarrow{CB}|$. Is the converse true?

Construct $D$ by $\overrightarrow{AD}=\overrightarrow{CB}$, so $CADB$ is
a parallelogram. Its diagonal vectors include

$$
\overrightarrow{CD}=\overrightarrow{CA}+\overrightarrow{CB},
\qquad
\overrightarrow{BA}=\overrightarrow{CA}-\overrightarrow{CB}.
$$

**Forward proof.** If $\angle ACB=90^\circ$, this parallelogram is a rectangle.
Writing $CA=p$, $CB=q$, both its diagonals have length
$\sqrt{p^2+q^2}$ by the Pythagorean theorem. Therefore the two requested vector
lengths are equal; both equal the triangle's hypotenuse length $AB$.

**Converse: Yes, for the stated nondegenerate triangle.** Suppose the requested
lengths are equal. Then the parallelogram diagonals satisfy $CD=AB$.
Triangles $ACB$ and $DBC$ have
$AC=DB$ (opposite parallelogram sides), $CB=BC$ (common length), and
$AB=DC$ (the hypothesis). By SSS they are congruent, so
$\angle ACB=\angle DBC$. These are adjacent interior angles of the
parallelogram $CADB$, hence their sum is $180^\circ$.
Both are therefore $90^\circ$, proving the converse.

**Degenerate boundary.** If $A=C$ or $B=C$, one of the two vectors is zero;
the length equality holds automatically but the triangle's angle is undefined,
so one must not assert a right-angle converse for arbitrary coincident points.
If both vectors are nonzero and collinear, their sum and difference have lengths
$p+q$ and $|p-q|$ in one order or the other. These are unequal for $p,q>0$.
Thus a collinear nonzero case does not furnish a counterexample inside the
triangle's domain.

## 190 / 13writtenex190

**Source conditions:** $ABCD$ is a parallelogram and $O$ is any point in space.
Prove
$\overrightarrow{OA}+\overrightarrow{OC}
=\overrightarrow{OB}+\overrightarrow{OD}$.

Let $M$ be the common midpoint of the parallelogram's diagonals $AC$ and $BD$.
Then $\overrightarrow{MA}+\overrightarrow{MC}=\vec 0$ and
$\overrightarrow{MB}+\overrightarrow{MD}=\vec 0$. Hence

$$
\begin{aligned}
\overrightarrow{OA}+\overrightarrow{OC}
&=(\overrightarrow{OM}+\overrightarrow{MA})
 +(\overrightarrow{OM}+\overrightarrow{MC})
 =\overrightarrow{OM}+\overrightarrow{OM},\\
\overrightarrow{OB}+\overrightarrow{OD}
&=(\overrightarrow{OM}+\overrightarrow{MB})
 +(\overrightarrow{OM}+\overrightarrow{MD})
 =\overrightarrow{OM}+\overrightarrow{OM}.
\end{aligned}
$$

The two sums are equal. There is no assumption that $O$ is outside the plane;
$O$ may lie in the plane, be a vertex, or be $M$. For $O=M$ both sums are zero.
The midpoint proof also works for a collapsed configuration that retains the
parallelogram midpoint relation, without claiming that it is a genuine
parallelogram.

## 191 / 13writtenex191

1. **Source conditions:** $ABCD$ is a tetrahedron. Prove
   $\overrightarrow{AD}+\overrightarrow{BC}
   =\overrightarrow{BD}+\overrightarrow{AC}$.
   By the triangle rule,
   $\overrightarrow{AD}=\overrightarrow{AB}+\overrightarrow{BD}$ and
   $\overrightarrow{BC}=\overrightarrow{BA}+\overrightarrow{AC}$.
   Therefore

   $$
   \begin{aligned}
   \overrightarrow{AD}+\overrightarrow{BC}
   &=\overrightarrow{AB}+\overrightarrow{BD}
    +\overrightarrow{BA}+\overrightarrow{AC}\\
   &=\overrightarrow{BD}+\overrightarrow{AC},
   \end{aligned}
   $$

   because $\overrightarrow{AB}+\overrightarrow{BA}=\vec 0$.
2. **For four arbitrary points: Yes.**
   The proof in part 1 uses only the triangle rule and opposite-vector
   cancellation. It does not use the existence, volume, faces, or edges of a
   nondegenerate tetrahedron. An independent position check is

   $$
   (\mathbf p_D-\mathbf p_A)+(\mathbf p_C-\mathbf p_B)
   =(\mathbf p_D-\mathbf p_B)+(\mathbf p_C-\mathbf p_A).
   $$

   This is valid for every four points, including coplanar, collinear, or
   coincident points and even when all four points coincide. There is no
   division, angle, or nonzero-vector condition to fail in those cases.

## Coverage and Pending Comparison

| Source Number / Stable ID | Complete Independent Coverage |
| --- | --- |
| 179 / 13writtenex179 | Existence answer; nonzero example; zero-summand boundary |
| 180 / 13writtenex180 | Three directed-segment constructions; all three lengths and directions |
| 181 / 13writtenex181 | Median vector equality with proof |
| 182 / 13writtenex182 | Vector equality with proof |
| 183 / 13writtenex183 | Closed-path sum with derivation |
| 184 / 13writtenex184 | All three tetrahedron sums with paths |
| 185 / 13writtenex185 | All four literal sums with derivations and independent component checks |
| 186 / 13writtenex186 | All three opposite vectors constructed from A; lengths, senses, endpoints |
| 187 / 13writtenex187 | Exact OBAC order; both opposite-side vector relations; nondegeneracy |
| 188 / 13writtenex188 | All three constructions from O; both minus signs in part 2 retained |
| 189 / 13writtenex189 | Forward proof; affirmative converse with proof; degenerate limits |
| 190 / 13writtenex190 | Parallelogram proof valid for any spatial O, including in-plane and vertex cases |
| 191 / 13writtenex191 | Tetrahedron proof; arbitrary-point extension, including coincidences |

All 13 source numbers occur once as solution sections; none was split into
new exercise numbers or omitted. Every explicitly numbered subpart is solved.
There is no unresolved mathematical result within the two source exercise
bodies. The layout glyph in 187 is recorded above rather than silently edited.

The current source files' hashes include transcription metadata. Later
row-counter-only changes can change file hashes without changing any mathematical
input. The parent must establish that distinction when disclosing final text;
this freeze is bound to the exact byte versions listed above.

**Explicitly not modern Gate 2 yet.** This freeze does not establish finalized
modern exercise/lesson identity, modern wording fidelity, author-answer
agreement, answer-key schema/parts, grading reliability, MathLive edit-chain
acceptance, finalize status, or publication. No pipeline, Git, database, browser,
dependency, or source-edit operation was run. The only write is this ticket TMP
document; other workers' files were left untouched.

Construction and proof tasks require complete displayed methods, not bare keys.
Under the answer skill's Gate 2 rules, such tasks should not be made automatically
graded merely to obtain coverage. No production grading configuration is authored
or approved by this freeze.

Await the parent's disclosure of finalized modern written exercise text and
author answer prose for one full Gate 2 comparison. When mathematical conditions
are unchanged, reuse these frozen independent derivations rather than repeat
source-solving. Any material mathematical change requires a specifically
identified affected-item update, not retroactive replacement of this freeze.

The parent's image ledger is reported as 24/24; it is outside this text-only
worker's evidence and is neither opened nor independently certified here.
