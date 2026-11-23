# N38 seventeen no-figure exercises: independent source solving

Author: author7. Ticket: STEMROBIN-188. Date: 2026-11-23.
Book: 6-8g. Lesson: geo68-c3-s2-n38. Edition: modern-us-neutral.
Status: author derivations only; independent mathematics review and final
approved-modern-prompt binding are pending. This is not approval or publication.

This document is completed and sealed read-only before constructing the candidate.
No answer candidate, previous standard, old book answer, or other author's
solution was read. All solutions below were derived from the assigned prompts.

## Authority and scope

Sole execution cwd:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.

Input root P:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188/ssot-resources/soviet10year-textbooks/artifacts/6-8g/evidence/stemrobin188-6g-n38/preparation7`.

Initial semantic authority:

- `P/work/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38/exercises.template.json`
  SHA256 `553657620946230b46afee28cded79f2e404b1a4b82c80e43b7df5ccb285f01d`.
- `P/work/adapt/6-8g/modern-us-neutral/lessons/geo68-c3-s2-n38/lesson.template.json`
  SHA256 `d812a65d82ae5db02acd635e6b3e7ba0f38f1a1987345100184666ca13049caf`.
- `P/manifest.json` SHA256
  `d81564cf41d32e54238525797e153b05c4de3e990c612937d305f078c81c2109`,
  equal to the user-supplied manifest digest. Only its digest was inspected.

Raw selected-lesson prose was read only for provenance/current-prose
clarification, not as an answer source. Its Markdown digest is
`d07149535eda3a18fd4d4234c0e392cf82a0e02e631088251c71205fa160319d`.

The assigned IDs, in prompt order, are 488-498 and 500-505: exactly 17.
All have source_number equal to their decimal ID, group_id `g1`, group
`问题和习题`, and empty figure_refs/figures. Exercise 499 is excluded; there
will be no answer, slot, or placeholder for it.

There are no explicit construction requests in these 17 initial prompts.
Auxiliary constructions below are stated verbally and need no supplied figure.
No image was opened, authored, generated, or required.

## Source-local interpretation

1. Nondegenerate triangles have positive interior angles summing to
   $180^\circ$. A triangle exterior angle is the adjacent supplementary
   angle, as the current prose defines it, not a reflex angle.
2. The current prose first proves the triangle sum as $180^\circ$ and later
   explicitly says that each triangle sum is $2d$. Equating these statements
   gives $2d=180^\circ$, hence $d=90^\circ$ and $4d=360^\circ$. This inference
   uses the current prose; no glyph repair or prior identity for $d$ is assumed.
3. For external-angle counting, the current prose's theorem 49 discusses
   convex polygons with one exterior angle at each vertex. The two exterior
   angles counted in 497 are at different vertices under this convention.
   Exercise 503 is interpreted in the same convex, one-per-vertex setting;
   unsigned exterior-angle assertions for nonconvex polygons are not inferred.
4. Ordinary polygons have integer $n\geq3$, no self-intersection and no holes.
   For sums the prose also explicitly extends the interior-angle formula to
   nonconvex polygons; convex examples suffice for all existence claims here.
5. Exercise 493 preserves the source labels
   `[UNKNOWN:493-2-1]`, `[UNKNOWN:493-2-2]`, `[UNKNOWN:493-2-3]`.
   Their statements are readable, and their order is known. Solutions refer
   to canonical positions 2)(1), 2)(2), 2)(3); the unknown printed labels are
   not reconstructed.
6. In 493(2)(3), "one interior angle" does not say "largest interior angle".
   No such condition is added. Non-uniqueness of classification is an actual
   mathematical answer, not an unresolved given.
7. Angle-bisector lines in 495 are those of the triangle's interior angles.
   Each requested line angle is the smaller one, not the obtuse angle of two
   bisector rays at their intersection.
8. Auxiliary vertex names in solutions are author-local definitions. They are
   not claimed to be recovered labels from a missing source figure.

No assigned exercise has a missing figure or an unreadable mathematical given.
No mathematical HOLD is asserted by the author. These source-local
interpretations remain visible for the independent reviewer; author completion
does not accept them on the parent's behalf.

## 488: all three proportional-angle triples

For a ratio $r:s:t$, write the angles as $kr,ks,kt$.
Then $k=180^\circ/(r+s+t)$; all angles must be positive.

1) $1:2:3$: $k=30^\circ$; ordered angles
   $30^\circ,60^\circ,90^\circ$.
2) $3:7:8$: $k=10^\circ$; ordered angles
   $30^\circ,70^\circ,80^\circ$.
3) $1:1:3$: $k=36^\circ$; ordered angles
   $36^\circ,36^\circ,108^\circ$.

Each triple is positive and sums to $180^\circ$, so each is admissible.

## 489: equality of the remaining corresponding angles

Let the corresponding equal pairs be $A=A'$ and $B=B'$.
Then $C=180^\circ-A-B=180^\circ-A'-B'=C'$.
Thus the remaining angles have equal measures and are congruent.
This asserts angle congruence only, not congruence of the whole triangles.

## 490: all three angles of the outer triangle

Given $A=25^\circ$, $B=68^\circ$,
$C=180^\circ-25^\circ-68^\circ=87^\circ$.

Define $l_A$ through A parallel to BC, $l_B$ through B parallel to CA,
and $l_C$ through C parallel to AB. Let
$X=l_B\cap l_C$, $Y=l_C\cap l_A$, $Z=l_A\cap l_B$.
Nondegeneracy of ABC ensures pairwise nonparallel directions and finite
intersections.

Parallelism gives parallelograms ABXC and AB CY (with cyclic order A,B,C,Y),
and likewise their cyclic counterparts. Thus C is between X and Y with
$CX=CY=AB$; B is between Z and X with $BZ=BX=AC$; A is between Y and Z
with $AY=AZ=BC$. A, B, C are the respective side midpoints of XYZ.
Consequently AB is parallel to XY, AC to XZ and BC to YZ, with the inward
ray pairs corresponding to the interior angles of the two triangles.
Hence $X=A=25^\circ$, $Y=B=68^\circ$, $Z=C=87^\circ$.

For an explicit direction check, take A as origin and let B have vector b,
C vector c. Then $X=b+c$, $Y=c-b$, $Z=b-c$.
At X the ray directions are $-2b,-2c$, opposite to both directions at A;
at Y they are $2b,2(b-c)$, opposite to both directions at B;
at Z they are $2c,2(c-b)$, opposite to both directions at C.
Reversing both rays preserves the angle. This also excludes confusing an
exterior supplementary angle with any requested interior angle.

## 491: dependencies of the actual current-prose proof

The prose's construction is a parallel line through C and extensions of
AC and BC. It explicitly proves angle 1 = angle 4 and angle 3 = angle 6
by the same-directed-ray angle theorem cited as section 37, and angle
2 = angle 5 by vertical-angle equality. Angles 4, 5, 6 form a straight angle.

The required axiom/basic facts are:

- Through a point off a given line a parallel line can be drawn (existence
  portion of the parallel axiom; uniqueness is not needed for this sum).
- Straight lines/rays may be extended for the stated construction.
- Adjacent nonoverlapping angle measures add; a straight angle measures
  $180^\circ$; equal quantities can be substituted in sums.

The already-proved angle facts explicitly used are:

- Two angles with respectively same-directed ray sides have equal measures,
  cited in this prose as section 37.
- Vertical angles have equal measures.

Thus $1+2+3=4+5+6=180^\circ$. No invented axiom/theorem serial numbers are
assigned, and the requested identification is not replaced by another proof.
The triangle-sum theorem itself is not used as a premise in its own proof.

## 492: whether an exterior angle can be smaller than an interior angle

Let E be the exterior angle adjacent to A. Then
$E=180^\circ-A=B+C$, so $E>B$ and $E>C$ because B and C are positive.
However $E<A$ exactly when $A>90^\circ$.

For example, a triangle with angles
$120^\circ,30^\circ,30^\circ$ has an exterior angle $60^\circ$
adjacent to the $120^\circ$ angle. Thus the answer is yes for the adjacent
obtuse interior angle, and never for either nonadjacent interior angle.

## 493: three definitions and all three relation cases

1) An obtuse triangle has one interior angle strictly greater than
$90^\circ$; its other two are acute. A right triangle has one interior
angle equal to $90^\circ$; its other two are acute. An acute triangle has
all three interior angles strictly below $90^\circ$. Positivity and sum
$180^\circ$ preclude two right/obtuse interior angles.

2) Let the specified angle be A, and let $A+B+C=180^\circ$.

- Canonical 2)(1), source `[UNKNOWN:493-2-1]`: $A=B+C$ gives
  $2A=180^\circ$, hence $A=90^\circ$. The triangle is right.
- Canonical 2)(2), source `[UNKNOWN:493-2-2]`: $A>B+C=180^\circ-A$
  gives $A>90^\circ$. The triangle is obtuse.
- Canonical 2)(3), source `[UNKNOWN:493-2-3]`: $A<B+C=180^\circ-A$
  gives $0<A<90^\circ$, but imposes no maximum-angle condition.
  All three triangle types are possible:
  $(A,B,C)=(60^\circ,60^\circ,60^\circ)$ is acute;
  $(30^\circ,60^\circ,90^\circ)$ is right;
  $(20^\circ,40^\circ,120^\circ)$ is obtuse.
  Each satisfies the given strict inequality. Therefore classification
  cannot be unique from the actual prompt.

For completeness, fixing $0<A<90^\circ$ gives $0<B<180^\circ-A$
and $C=180^\circ-A-B>0$. The acute cases have
$90^\circ-A<B<90^\circ$; right cases have
$B=90^\circ-A$ or $B=90^\circ$; obtuse cases occupy the two remaining
open intervals. No range or possible type is silently excluded.

## 494: any two angles have sum greater than 90 degrees

$B+C>90^\circ$ gives $A=180^\circ-(B+C)<90^\circ$.
Applying the same argument to the other two angle pairs gives B and C
also below $90^\circ$. Thus the triangle is acute.
The condition says every pair, not merely one selected pair.

## 495*: all three altitude-line pairs and all three bisector-line pairs

Assign the given angles to A and B:
$A=60^\circ$, $B=72^\circ$, $C=48^\circ$.
All three are acute.

1) The altitude lines $h_A,h_B,h_C$ are perpendicular to BC, CA, AB,
respectively. Simultaneously rotating two line directions by $90^\circ$
preserves their smaller angle. Since ABC is acute, the smaller angles
between its side lines equal its interior angles. Thus:

- $(h_A,h_B)$: $C=48^\circ$.
- $(h_B,h_C)$: $A=60^\circ$.
- $(h_C,h_A)$: $B=72^\circ$.

2) For any chosen pair of vertices, their interior bisector rays meet
inside ABC. This intersection can be considered pair by pair; no prior
concurrency theorem is needed to compute the angles.
For the A,B pair at I, triangle AIB gives
$\angle AIB=180^\circ-A/2-B/2=90^\circ+C/2=114^\circ$.
The smaller angle between the complete bisector lines is the supplementary
$66^\circ$. The other pairs similarly give:

- $(l_A,l_B)$: ray angle $114^\circ$, smaller line angle $66^\circ$.
- $(l_B,l_C)$: ray angle $120^\circ$, smaller line angle $60^\circ$.
- $(l_C,l_A)$: ray angle $126^\circ$, smaller line angle $54^\circ$.

Equivalently the smaller line angle for each pair is
$90^\circ$ minus half the remaining vertex angle. The obtuse ray angles
are intermediate values, not the requested answers.

## 496: both possible positions of the given exterior angle

An exterior angle of $100^\circ$ has adjacent interior angle
$80^\circ$.

- If that $80^\circ$ angle is the apex, equal base angles are
  $(180^\circ-80^\circ)/2=50^\circ$. Triple:
  $80^\circ,50^\circ,50^\circ$.
- If it is a base angle, the other base angle is also $80^\circ$ and the
  apex is $20^\circ$. Triple: $80^\circ,80^\circ,20^\circ$.

These exhaust the apex/base alternatives. Both are positive triangles
with the specified exterior angle; the prompt gives no reason to choose
only one.

## 497: impossibility of two acute exterior angles

Under the current prose's one-exterior-angle-per-vertex convention, two
acute exterior angles at different vertices would have two adjacent
interior angles exceeding $90^\circ$. Their sum would already exceed
$180^\circ$, contrary to the positive third angle and triangle sum.
Thus there is at most one acute exterior angle in that selection.

Counting both supplementary angles at the same vertex is a different
convention and is not silently used: an obtuse interior angle would make
both such same-vertex exterior angles acute.

## 498: both cases and the possible position of the equal interior angle

1) If an exterior angle E is acute, its adjacent interior angle
$A=180^\circ-E$ is obtuse. The triangle is obtuse.

2) $E=B+C>B,C$, so an exterior angle cannot equal either nonadjacent
interior angle. If it equals some interior angle, that angle must be
its adjacent A. Then $E=A$ and $E+A=180^\circ$ imply
$A=E=90^\circ$. The triangle is right.

## 500: all four interior-angle sums

For integer $n\geq3$, $S=180^\circ(n-2)$.

1) $n=10$: $S=8\cdot180^\circ=1440^\circ$.
2) $n=12$: $S=10\cdot180^\circ=1800^\circ$.
3) $n=30$: $S=28\cdot180^\circ=5040^\circ$.
4) $n=96$: $S=94\cdot180^\circ=16920^\circ$.

## 501: all four edge counts

$n=S/180^\circ+2$; it must be an integer at least 3.

1) $1080^\circ$: $n=6+2=8$.
2) $1620^\circ$: $n=9+2=11$.
3) $3960^\circ$: $n=22+2=24$.
4) $1800^\circ$: $n=10+2=12$.

All counts are admissible; convex polygons with these numbers of edges exist.

## 502: all four equiangular edge counts

With every interior angle equal to a,
$na=180^\circ(n-2)$ and $n=360^\circ/(180^\circ-a)$.
Admissibility requires an integer $n\geq3$; equivalently
$a=180^\circ-360^\circ/n$ and $60^\circ\leq a<180^\circ$.

1) $a=144^\circ$: exterior angle $36^\circ$, $n=10$.
2) $a=150^\circ$: exterior angle $30^\circ$, $n=12$.
3) $a=170^\circ$: exterior angle $10^\circ$, $n=36$.
4) $a=171^\circ$: exterior angle $9^\circ$, $n=40$.

Each is realized by a regular polygon of the resulting edge count.
Equiangular does not require equal side lengths; regular polygons are
existence witnesses only.

## 503: both impossibility proofs and sharp bounds

In the current prose's convex, one-exterior-angle-per-vertex setting,
all selected exterior angles are positive and their sum is $360^\circ$.

1) More than four right exterior angles would contribute at least
$5\cdot90^\circ=450^\circ>360^\circ$, impossible.
The bound four is attainable by a rectangle. If there are exactly four
right exterior angles, no further vertex can have a positive exterior
angle; such a strictly convex polygon has exactly four vertices.

2) Four obtuse exterior angles already sum to more than
$4\cdot90^\circ=360^\circ$, impossible. Thus at most three occur.
Three are attainable: an equilateral triangle has exterior angles
$120^\circ,120^\circ,120^\circ$.

This proof does not generalize the positive exterior-angle sum to a
nonconvex polygon or count two exterior angles at one vertex.

## 504: all five existence/impossibility decisions

The necessary and sufficient sum condition is
$n=S/180^\circ+2$ integer and $n\geq3$. Sufficiency is witnessed by
a convex regular n-gon. In d units this is $S=2d(n-2)$, with $d=90^\circ$
derived from the current prose as above.

1) $S=9180^\circ$: $n=51+2=53$, so yes, a 53-gon.
2) $S=3600^\circ$: $n=20+2=22$, so yes, a 22-gon.
3) $S=2040^\circ$: $n=34/3+2=40/3$, not an integer, so no.
4) $S=11d=990^\circ$: $n=11/2+2=15/2$, not an integer, so no.
5) $S=18d=1620^\circ$: $n=9+2=11$, so yes, an 11-gon.

There is no rounding of an impossible edge count to a neighboring integer.

## 505*: two proofs different from the current prose

The current triangle proof uses a parallel through C, extensions of both
sides, same-directed-ray angles and a vertical angle to assemble a straight
angle. The current convex-polygon proof joins an interior point O to every
vertex, sums n triangle sums, then subtracts the full angle around O.
Neither construction is reused as the general proof below.

### 505(1): perpendicular-foot decomposition, including exterior-foot cases

First establish an elementary perpendicular-direction lemma without using
the triangle-sum theorem: the two acute angles a transversal makes with
two perpendicular line directions are complementary. Move those directions
to one point without changing their angles (the current prose permits the
same-directed-ray angle fact). They partition a right angle, so their sum
is $90^\circ$ by angle addition. In a right triangle the two acute angles
are exactly these two line-direction angles, so they sum to $90^\circ$.
This lemma uses perpendicularity and angle addition, not theorem 47 or
the exterior-sum theorem 49.

For any nondegenerate ABC, draw the perpendicular CH to the line AB.
The foot H exists uniquely. Cover all possible placements:

- H strictly between A and B: let
  $p=\angle ACH$ and $q=\angle HCB$. The two right triangles give
  $A+p=90^\circ$ and $B+q=90^\circ$. Because CH lies inside angle C,
  $C=p+q$. Adding gives $A+B+C=180^\circ$.
- H=A: A is right and the perpendicular-direction lemma gives
  $B+C=90^\circ$, hence the total is $180^\circ$.
- H=B: interchange A and B in the preceding case.
- H beyond A, in the order H,A,B: set
  $x=\angle CAH$, $p=\angle ACH$, $q=\angle BCH$.
  The right triangles give $x+p=90^\circ$ and $B+q=90^\circ$.
  The original angles satisfy $A=180^\circ-x$ and $C=q-p$;
  the latter follows from the order of the rays CH, CA, CB at C.
  Therefore
  $A+B+C=(180^\circ-x)+(90^\circ-q)+(q-p)
  =270^\circ-(x+p)=180^\circ$.
- H beyond B: interchange A and B in the exterior-foot argument.

These five placements exhaust the line AB and do not assume that the
triangle is acute. No supplied or newly authored figure is required.

### 505(2): a fan from one polygon vertex, not an interior point

List the convex n-gon's vertices in cyclic order as $V_1,\ldots,V_n$,
with integer $n\geq3$. From $V_1$ draw all diagonals to
$V_3,\ldots,V_{n-1}$; when $n=3$ there are no diagonals.
Convexity puts each diagonal inside the polygon, and the diagonals
partition its interior without overlap into the $n-2$ triangles
$V_1V_2V_3, V_1V_3V_4,\ldots,V_1V_{n-1}V_n$.

At every polygon vertex the angles of these triangles partition exactly
the polygon's interior angle. There is no extra interior vertex and no
full angle to subtract. Summing the triangle theorem just proved yields
$S=(n-2)180^\circ=2d(n-2)$, including $n=3$.
This is distinct from the prose's n-triangle, interior-O construction.

## Coverage and author boundary

All original requests in the assigned 17 prompts have been solved before
candidate construction: the three ratios; two-triangle proof; three outer
triangle angles; actual proof dependencies; exterior/interior comparison;
three definitions and three relation cases; every-pair classification;
six smaller line angles; both isosceles cases; acute-exterior impossibility;
both exterior classification cases; four sums, four inverse sums, four
equiangular counts; both polygon impossibilities; all five possible sums;
and both starred alternative proofs.

All candidate entries will be source `derived`, grading `ungraded`,
parts `[]`, including arithmetic. No judging or input contract is authored.
No source wording, figure, app, dependency, shared tool or native final is
changed. Images 0; paid calls 0; DB operations 0; Git operations 0.
Independent comparison against the eventual approved modern native prompts
and independent mathematical review are explicitly still required.
