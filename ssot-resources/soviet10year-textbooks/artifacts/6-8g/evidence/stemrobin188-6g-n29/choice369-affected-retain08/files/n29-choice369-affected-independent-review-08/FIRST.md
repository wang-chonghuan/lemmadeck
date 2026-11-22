# FIRST: independent source solution, before candidate disclosure

Reviewer scope: sole independent affected-only N29 choice reviewer for
STEMROBIN-188. Eight original PASS records will be reused, not freshly reviewed.
This document was derived without candidate views, keys, author reasoning,
parent replacement reasoning, or prior mathematical review.

Inputs read for mathematical content:
- review-source-only.json in n29-choice369-locus-repair-08.
- Its exact seed.json in n29-choice-author-first-07, restricted to exercise 369
  and concept blocks 10 and 17.
- Exercise 369 asks for the centers of circles tangent to both sides of a
  given angle. It supplies no acute-angle or convex-angle restriction.
- Blocks 10 and 17 give the reciprocal tangent/radius perpendicularity facts.
- No source or candidate images were opened; none is needed for this exercise.

The review, contract, and lesson production-resume protocols were also read.
Seed schema keys were inspected only to select the permitted source fields.

## Tangency convention and complete equations

Let the vertex be O, put O at the origin, and write the actual rays as
R_u = {s u: s >= 0} and R_v = {s v: s >= 0}, with unit directions u and v.
Tangency means supporting-line tangency at a point belonging to the ray,
including its endpoint O. Merely having one intersection with a truncated ray
does not make a secant supporting line a tangent.

For center C and radius r > 0, the tangent contacts must be the perpendicular
feet P_u = (C dot u)u and P_v = (C dot v)v. Thus the necessary and sufficient
conditions are

    C dot u >= 0, C dot v >= 0,
    r^2 = |C|^2 - (C dot u)^2
        = |C|^2 - (C dot v)^2 > 0.

These are sufficient because a positive-radius circle at that distance from
each supporting line has exactly the indicated tangent contact on each ray.
Their equality yields (C dot u)^2 = (C dot v)^2. The nonnegative projections
force C dot u = C dot v. This excludes external-bisector centers whose contact
would be behind a ray endpoint.

## Noncollinear rays

Let c = u dot v, with -1 < c < 1. Equality says C dot (u-v) = 0, so in the
plane C = t(u+v). Each projection is t(1+c). Both contacts are on the rays
exactly when t >= 0; t = 0 has zero radius and is forbidden. For t > 0,

    r = t sqrt(1-c^2) > 0,
    P_u = t(1+c)u, P_v = t(1+c)v.

Consequently the complete locus is {t(u+v): t > 0}, the positive bisector ray
of the smaller angle between the two directions, with vertex excluded.
No nonzero noncollinear solution has endpoint contact: two zero projections
would force C = 0. The opposite bisector direction has both feet behind O;
the other angle-bisector line has projections of opposite sign.

This formula applies for every noncollinear pair, including obtuse separation
and pairs presented as the sides of a reflex angle. It uses the actual ray
directions, not a silent acute/convex convention or the whole bisector line
of an arbitrarily designated angle.

## Opposite rays

If v = -u, the inequalities require C dot u = 0. Their supporting lines
coincide, and both feet are O. Every C != 0 perpendicular to u works, with
r = |C| > 0. The complete locus is the entire perpendicular line through O
minus O, equivalently its two open perpendicular rays. Endpoint contact is
essential here. Excluding vertex contact would incorrectly remove all solutions.

## Coincident rays

If v = u, choose a perpendicular unit vector n and write C = a u + b n.
The conditions reduce exactly to a >= 0 and b != 0; r = |b| > 0.
The complete locus is the forward-projection closed half-plane with the
supporting line removed, on both sides of that line:

    {a u + b n: a >= 0, b != 0}.

The boundary a = 0, b != 0 is included because contact at O is permitted.
Forward axial centers with b = 0 are excluded because they have zero radius.
Backward centers with a < 0 are excluded because their feet are outside the ray.
This is a two-dimensional locus, not a single angle-bisector ray.

## Boundary checks and first-stage conclusion

- u=(1,0), v=(0,1): C=(t,t), t>0, r=t; (-1,-1) and (1,-1) fail the ray feet.
- u=(1,0), v=(-1/2,sqrt(3)/2): C=u+v works, so obtuse separation is included.
- Opposite horizontal rays: (0,1) and (0,-1), radius 1, both contact at O.
- Coincident rightward rays: (0,1), (0,-1), and (2,1) work;
  (-1,1) and (2,0) do not.
- O is excluded in every branch by positive radius.

Independent source verdict: these three branches are exhaustive under the
stated tangent theorem and endpoint convention. Candidate assessment must
preserve all three, the included/excluded boundaries, and actual ray contacts.
This FIRST contains no candidate verdict or inferred author key.
