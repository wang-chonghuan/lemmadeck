# FIRST Author Independent Solutions

Author-only source reasoning, frozen before any options draft or key artifact.
Authority: prepared written seed, definition blocks 0, 1, 2, 7 and actual
renderings of their necessary figures 6 and 7. No answer files or other authors'
work were read. This is author reasoning, not an independent reviewer verdict.

## Source 16: Construct All Five Points

For a point (x,y,z), its position vector is x i + y j + z k. Place a
point X at (x,0,0), then Y at (x,y,0), then the final point at (x,y,z),
using signed displacements parallel to the coordinate axes.

- A: O -> (2,0,0) -> (2,3,0) -> (2,3,1). All coordinates positive.
- B: O -> (1,0,0) -> (1,-1,0) -> (1,-1,2). The y displacement is negative.
- D: O -> (-3,0,0) -> (-3,1/2,0) -> (-3,1/2,-1).
  Its x and z displacements are negative.
- E: O -> O -> (0,2,0) -> (0,2,-3). It is on Oyz, not on an axis.
- G: O -> O -> O -> (0,0,-3/2). It is on the negative z half-axis.

These are exact spatial construction descriptions, not measurements of the
perspective drawings. Recognition of a proposed construction cannot establish
that a learner independently draws all five points.

## Source 17: Both Directed Displacements

Translation from P to Q requires Q-P, since OP + PQ = OQ.

1. (-1-2, 2-(-3), -3-0) = (-3,5,-3).
2. (-3/5-1/2, 0-(-4/3), 2/3-5/6)
   = (-11/10,4/3,-1/6).

The direction, signs and exact fractional differences all matter.

## Source 18: Projection and Distance

The coordinate plane Oyz consists of points whose x coordinate is zero.
Its normal direction is parallel to the x axis. Thus the perpendicular foot
of A(2,-3,1) is B(0,-3,1), preserving y and z.
OB has squared length 0^2+(-3)^2+1^2 = 10, so |OB| = sqrt(10).
AB has length 2 and is not the requested OB.

## Source 19: Entire Permitted Axis

Any point on Oy is T=(0,t,0), t real; no half-axis restriction is stated.

TA^2 = 4+(t+1)^2+1 = t^2+2t+6.
TB^2 = (t-1)^2+9 = t^2-2t+10.
Equality gives 4t=4, hence t=1. The unique point is (0,1,0).
Both distances are 3. Squaring is reversible here because distances are
nonnegative. Negative and zero t were not discarded in setting up the equation.

## Source 20: Every Median, Centroid and Interior Angle

The midpoint of BC is A1=(7/2,1/2,4).
AA1=(1/2,5/2,3), with squared norm 31/2=62/4.
Therefore |AA1|=sqrt(62)/2.

The midpoint of AC is B1=(7/2,-1,2).
BB1=(1/2,-2,-3), with squared norm 53/4.
Therefore |BB1|=sqrt(53)/2.

The three median intersection is T=(A+B+C)/3=(10/3,-1/3,3).
It lies two thirds along AA1 and also along BB1:
A+(2/3)(A1-A)=B+(2/3)(B1-B)=T.
Its squared distance from O is (100+1+81)/9=182/9.
Therefore OT=sqrt(182)/3.

AB=(0,3,4), AC=(1,2,2), BC=(1,-1,-2).
Their lengths are 5, 3 and sqrt(6).
At A: AB dot AC=14, so cos(A)=14/15.
At B: BA dot BC=11, so cos(B)=11/(5 sqrt(6)).
At C: CA dot CB=-5, so cos(C)=-5/(3 sqrt(6)).
Thus the interior angle sizes, in A,B,C order, are
arccos(14/15), arccos(11/(5 sqrt(6))),
arccos(-5/(3 sqrt(6))). Arccos has its usual [0,pi] range.
The angle at C is obtuse; the other two are acute. These are exact angle
sizes and do not require rounding or a diagram-based right-angle assumption.
The squared cross-product length of AB and AC is 29, so the triangle is
nondegenerate.

## Source 21: No Unstated Vertex Order

The prose gives three vertices, not a cyclic name ABCD, and does not identify
the common adjacent vertex. A,B,C are noncollinear:
AB=(-3,7,1), AC=(-4,4,1), AB cross AC=(3,-1,16).
There are exactly three parallelograms, determined by which of A,B,C is the
common adjacent vertex. The two other known points form one diagonal.

- Common adjacent vertex B: fourth point A+C-B=(0,-6,0).
  AC=(-4,4,1), length sqrt(33).
  The other diagonal joins B to (0,-6,0), vector (2,-10,-1),
  length sqrt(105). Unordered length pair {sqrt(33),sqrt(105)}.
- Common adjacent vertex A: fourth point B+C-A=(-6,8,2).
  BC=(-1,-3,0), length sqrt(10).
  The other diagonal from A has vector (-7,11,2),
  length sqrt(174). Pair {sqrt(10),sqrt(174)}.
- Common adjacent vertex C: fourth point A+B-C=(2,0,0).
  AB=(-3,7,1), length sqrt(59).
  The other diagonal from C has vector (5,-1,-1),
  length sqrt(27)=3 sqrt(3). Pair {sqrt(59),3 sqrt(3)}.

These exhaust the permitted cases: each known vertex can be the point incident
to the two known adjacent sides, and a fourth point is then uniquely fixed.
A unique single pair cannot be asserted from the supplied prose.

## Source 22: Proof and Angle Convention

A+C=B+D=(0,4,1), so AC and BD have the same midpoint (0,2,1/2).
AC=(-4,-4,9), BD=(-2,2,7), and these vectors are not parallel.
Therefore the distinct, noncollinear four vertices in order A-B-C-D form a
parallelogram: the diagonals bisect each other.

An alternative complete proof is AB=DC=(-1,-3,1) and
BC=AD=(-3,-1,8). The two adjacent directions are not parallel,
since AB cross BC=(-23,5,-8), a nonzero vector.
In particular, checking only a vector triangle identity would not prove
the parallelogram property.

AC dot BD=63; |AC|^2=113; |BD|^2=57.
Let alpha=arccos(63/sqrt(6441)), with 0<alpha<pi/2.
The angles formed at the crossing of the two diagonal segments have exactly
two distinct sizes, alpha and pi-alpha.
At the midpoint, the rays towards A and B have dot product 63/4,
so that angle has size alpha. Reversing exactly one ray gives pi-alpha.

The selected definitions do not state whether the singular phrase "angle
between the diagonals" requests the smaller undirected-line angle or a chosen
directed-vector angle. Do not invent that convention. A native question can
legitimately request all distinct intersection-angle sizes and preserve both.
If a single unique numeric angle is required by integration, HOLD that demand
pending an explicit source convention. Choice proof-validity recognition does
not establish independent proof writing.

## Actual Figure Observations

Batch 1 contains two actual-image opens, context total 2 of 24; no crops or
reopens. Full-element PNG renders of the actual SVG bytes were opened.

- fig-g10-06: the entire O origin, lower-left i arrow, rightward j arrow,
  upward k arrow and upper-right OM arrow with its M endpoint are visible.
  Labels and arrowheads are uncropped. This is a perspective basis schematic;
  no lengths, coordinates of M or screen angles are inferred.
- fig-g10-07: the complete x/y/z coordinate-axis drawing is visible, with
  O, A on positive x, B on positive y, C on positive z, basis-vector labels,
  M and OM. Dashed negative-axis portions and all extreme labels remain inside
  the image. A/B/C here are generic axis labels, not numerical exercise points.
  No vertex-order or numerical premise is supplied by this illustration.

No new figure is necessary for text-based mathematical construction validity.
No source spec, solved-example figure, answer or review output was used.
