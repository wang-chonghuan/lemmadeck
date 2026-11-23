# N33 independent source solving

Author-only work, before authoring any draft alternatives. No semantic review or
approval is claimed by this record.

## Input and scope

- Sole checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
- Sole mathematical input: the existing native `seed.json` in this directory.
- Canonical seed SHA-256: `3054db83f5626520746f912236dd975a731c6b70ef48faed34ef6d5753c34e7d`.
- Full written tasks: 441, 442, 443, 444, 445.
- Actual selected concept: block 0, including its definition of equivalence as
  implication in both directions. Its textual mention of a historical figure
  contributes no geometric data: the seed declares no figure assets.
- No answers, previous choices, interaction data, reviewer output or other
  lesson material was used. All configurations below are defined by text.

Use the usual nondegenerate school-plane conventions: parallel lines are
distinct coplanar lines having no common point; a triangle has three
noncollinear vertices; its angles are strictly positive. "Without the parallel
axiom" means that incidence, order, angle/segment construction and congruence
facts remain available. In particular, vertical angles are congruent, a
perpendicular through a point is unique, and the SAS congruence criterion does
not use the parallel axiom. A statement is not axiom-dependent merely because
someone unnecessarily cited that axiom in a proof.

## Written task 441: prove both implications

Let A mean: through any point there is at most one line parallel to a given
line. Let B mean: if a is perpendicular to c, and b meets c but is not
perpendicular to c, then a and b meet.

Neutral auxiliary fact: two distinct perpendiculars to the same line do not
meet. If they met, their feet on that line and their intersection would form a
triangle with two right angles. Extending the base at one foot would give a
right exterior angle equal to the other, nonadjacent right interior angle,
contrary to the strict exterior-angle theorem proved below. This argument
uses no triangle-angle-sum theorem and no parallel axiom.

A implies B. Put Q = b intersect c. If Q also lies on a, the required
intersection is already Q. Otherwise draw m through Q perpendicular to c.
The auxiliary fact gives m parallel to a. If a and b did not meet, b would
also be parallel to a through Q. A would give b = m, contradicting the
hypothesis that b is not perpendicular to c. Thus a and b meet.

B implies A. For a point P on a given line l, every line through P already
meets l, so none is parallel to it. For P outside l, let c be its perpendicular
to l, and let m be the perpendicular to c through P. Then m is parallel to l
by the neutral auxiliary fact. Any different line n through P is not
perpendicular to c, by perpendicular uniqueness. It meets c at P, so B,
applied with a = l and b = n, says that n meets l. Consequently only m can
be parallel to l through P. This proves the required "at most one" and does
not silently replace it by an assumed existence assertion.

Conceptual distinction: equivalence is a pair of implications, not one
implication or an inference from two Euclidean conclusions both being true.

## Written task 442: give genuine parallel-axiom examples

One example is: distinct parallel lines cut by a transversal have congruent
alternate interior angles. At the second intersection construct a line with
the alternate angle congruent to the angle at the first intersection.
The neutral equal-angle parallel criterion, proved in task 444 below using
the exterior-angle theorem, makes this constructed line parallel to the first
line. A identifies it with the originally given parallel through the second
intersection. That identification, not construction of an angle, uses A.

This dependence is genuine: if the parallel-to-angle theorem were available
without A, take a line l and an exterior point P, draw c perpendicular to l
through P, and m perpendicular to c through P. Every parallel n to l through
P would have, by that theorem and vertical angles, a right angle with c.
Perpendicular uniqueness forces n = m, yielding A. The theorem therefore
recovers A rather than merely having a proof that happens to cite A.

Another example is parallel transitivity: for three pairwise distinct lines
a, b, c, if a is parallel to c and b is parallel to c, then a is parallel to b.
If a and b met at P, A would force two parallels through P to c to be equal,
contrary to their distinctness. Conversely, transitivity rules out any two
distinct lines through the same point both parallel to a given line; this is
exactly A. This is also a genuine dependency.

A familiar further example is the theorem that every triangle has interior
angle sum 180 degrees. Draw through one vertex the line parallel to the
opposite side; the parallel-to-angle theorem identifies the two angles next
to the vertex angle with the other two interior angles. Their sum is a
straight angle. The crucial identification uses A. The universal equality
is not a neutral-geometry theorem: a geometry with more than one parallel
through an exterior point can have triangle angle sums strictly below a
straight angle. No such countermodel or its drawing is needed as source data
or as a learner-facing figure here.

These are examples, not an exhaustive list. No arbitrary quota of examples
is imposed by the source.

## Written task 443: give examples independent of the axiom

Vertical angles are congruent. If x and y are the vertical angles and z is
one adjacent angle, x + z = 180 degrees and y + z = 180 degrees. Subtracting
the same z gives x = y. The proof uses straight angles and arithmetic, not
parallels or a triangle-angle-sum theorem.

The base angles of an isosceles triangle are congruent. For triangle ABC
with AB = AC, compare triangles ABC and ACB: AB corresponds to AC, AC to AB,
and the included angle at A to itself. SAS gives congruence, so the angles at
B and C are congruent. This uses neutral congruence, not A.

Through a point there is at most one perpendicular to a given line.
For a point on the line, angle construction/uniqueness gives the same
perpendicular line when either of its opposite rays is chosen. For an
exterior point P, suppose two different feet X and Y existed. Triangle PXY
would have right angles at both X and Y; the right exterior angle at one
would equal the nonadjacent right interior angle at the other, violating the
neutral exterior-angle theorem. No use of A is needed.

The distinction sought by the paired open tasks is proof dependency, not
whether the theorem is true in the Euclidean plane. Example generation and
actual writing of these proofs are separate production abilities.

## Written task 444: equal corresponding angles are sufficient

Let distinct lines a and b meet transversal c at distinct points P and Q.
Assume one pair of corresponding angles is congruent. If a and b met at R,
R could not lie on c, since otherwise the two distinct intersections P and Q
would force one of the lines to coincide with c. Thus PQR is a triangle.

In this triangle the equality of the corresponding pair, using vertical
angles and, if necessary, taking both supplementary angles, becomes an
equality between an interior angle at one of P, Q and a nonadjacent exterior
angle at the other. The strict exterior-angle theorem makes this impossible.
Therefore a and b have no common point and are parallel.

The equal-alternate-angle criterion follows from the same argument, or from
the corresponding criterion by vertical-angle congruence. Neither proof
uses A. The conclusion here is sufficiency of the congruent-angle condition.
The converse "parallel implies equal corresponding angles" is not furnished
by this proof and in general requires A, as the example in task 442 shows.
Equal supplementary corresponding angles do not constitute the same
criterion: the sum can be 180 degrees while the two angles differ.

## Written task 445: strict comparison with both remote angles

Take a nondegenerate triangle ABC. Let D lie on ray BA beyond A, and let H
lie on ray CA beyond A. The exterior angles alpha = angle DAC and
alpha' = angle HAB are vertical angles, so alpha = alpha'. We prove
alpha strictly greater than angle C and alpha' strictly greater than angle B.
The equality of the two exterior angles then gives both required comparisons
for the very same exterior angle alpha.

First comparison. Let E be the midpoint of AC, and put F on ray BE beyond E
with EF = EB. Triangles CEB and AEF have CE = EA, EB = EF and congruent
vertical included angles at E. SAS therefore gives angle EAF = angle ECB,
which means angle CAF = angle ACB.

The location of F must also be proved, not assumed from a picture. Since E
is interior to segment AC, extending BE past E puts F on the opposite side
of AC from B. D is on that same side. Also E, and the entire ray BE after B,
are on the same side of AB as C, so F is on the same side of AB as C.
These two half-plane conditions put ray AF strictly inside angle DAC.
It is not a boundary ray: B is not on AC and F is not on AB. Therefore
angle DAC = angle DAF + angle FAC strictly exceeds angle FAC = angle C.

Second comparison. Let M be the midpoint of AB, and put G on ray CM beyond M
with MG = MC. Triangles BMC and AMG have BM = MA, MC = MG and congruent
vertical included angles at M. SAS gives angle MAG = angle MBC, which means
angle BAG = angle ABC. G is on the opposite side of AB from C and on the
same side of AC as B, so ray AG lies strictly inside angle HAB. Hence
angle HAB = angle HAG + angle GAB strictly exceeds angle GAB = angle B.

Finally alpha = alpha' gives alpha strictly greater than BOTH angle B and
angle C. It is not merely greater than one unspecified remote angle,
not a non-strict inequality, and not obtained by assuming
alpha = angle B + angle C. The latter Euclidean exterior-angle-sum identity
would import the triangle-angle-sum theorem and its parallel-axiom dependency.
Only midpoint/segment extension, order, angle addition, vertical angles and
SAS were used. No original or new figure is necessary.

## Essential format losses to retain during authoring

Choosing a proof or mathematical judgment cannot demonstrate independently
writing the proofs in 441, 444 or 445. It cannot demonstrate independently
generating an open list of theorem examples in 442 and 443 or supplying their
written proofs. The auxiliary point constructions used to solve 445 do not
turn a choice response into evidence that a learner can carry out a
construction. These production losses must stay explicit in draft intent and
whole-source coverage. The original written tasks remain read-only elsewhere.
