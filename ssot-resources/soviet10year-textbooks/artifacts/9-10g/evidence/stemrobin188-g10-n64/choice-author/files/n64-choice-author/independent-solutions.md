# N64 source independent solutions

Role: STEMROBIN-188 / SAME188-6 offline choice author, not the independent reviewer.
This record was written before constructing candidate options.

## Input boundary

- Only mathematical source: the supplied `seed.json` in this directory.
- Seed raw SHA-256: `e9d4003196accc240f86973b87b04cf93c8820057b4aa9b9948dd298eaff1dbb`.
- Seed canonical SHA-256: `d4e6f9112c995fd2d07cdc7508f537bf8383a49139bb7968e089f6744fa86f6d`.
- Seed bytes / mode: 4420 / 0644. Do not alter either content or permissions.
- Selected paragraphs: 0 (one common point), 2 (diameter-normal criterion), 6 (a tangent line through the contact point in its tangent plane). No solved example.
- All seven exercises have empty figure references. Paragraph 6 mentions figure 96, but its prose already states the full line definition; no image is needed or opened.
- No answer key, interaction, old choice, other author's solution, review evidence, answer-author directory, database, `.env`, Git, network, installation, or model call is used.
- A sphere below is nondegenerate: its radius is positive. This follows the supplied geometric task, not an assumed zero-radius sphere convention.

## 229: counts of tangent planes

Let C be the centre and r > 0 the radius.
For A on the sphere, the supplied diameter-normal criterion forces the tangent plane to pass through A and have normal CA. A point and a nonzero normal determine exactly one plane.

For P outside the sphere, put C at the origin and P = (0,0,d), d > r.
A plane n dot X = r with unit normal n passes through P precisely when n_z = r/d.
The remaining normal components range over the circle n_x^2 + n_y^2 = 1 - r^2/d^2 > 0.
Each normal gives a different plane at distance r from C, hence a tangent plane. There are infinitely many.
The positive constant r fixes the normal orientation, so antipodal normals do not duplicate the same plane in this parametrization.

Result: one tangent plane at a sphere point, infinitely many through an exterior point.

## 230: counts of tangent lines in space

At a sphere point A, every line through A inside its unique tangent plane is perpendicular to CA.
For a nonzero direction v with CA dot v = 0,
|CA + t v|^2 = r^2 + t^2 |v|^2, so the only intersection is t = 0.
There are infinitely many unoriented directions in that plane, hence infinitely many lines, not one.

For exterior P, take each plane through the line CP. Its intersection with the sphere is a great circle.
The planar circle admits two tangents through P. As this section plane varies, infinitely many distinct spatial lines result.
The tangency point T satisfies |CT| = r and (P - T) dot CT = 0, equivalently P dot CT = r^2 after setting C = 0.
Thus the contact points form a nondegenerate circle. Distinct contacts cannot belong to the same tangent line, because a tangent line has exactly one sphere point.

Result: infinitely many tangent lines in both cases. A fixed planar section's one/two-line result is not the full spatial count.

## 231: two centre loci

1. Tangency to the given plane pi at O implies O belongs to pi and CO is a normal to pi.
The radius is not prescribed. With a chosen unit normal n, C = O + t n for any t != 0, radius |t|.
Conversely, each such positive-radius sphere has pi as its tangent plane at O.
The complete locus is the normal line through O with O removed, including both sides of pi.
Including O would require radius zero; choosing one side or fixing a radius would change the task.

2. For fixed radius R > 0, tangency to pi is equivalent to dist(C,pi) = R.
The complete locus is the union of the two planes parallel to pi at signed distances +R and -R.
There is no source restriction to one half-space.

These are different tasks: fixed contact / unrestricted radius versus unrestricted contact / fixed radius.

## 232: independent subproblems

### 232(1): unresolved dihedral-angle convention

Intersect by a plane perpendicular to the common edge L. The two tangent planes become two intersecting tangent lines, and H = L intersect section is their vertex.
The sphere centre C has perpendicular distance R to each line and lies on one of their angle-bisector lines.
If the sector containing C has angle theta, 0 < theta < pi, the right triangle gives
CH sin(theta/2) = R, hence dist(C,L) = R / sin(theta/2).

The seed specifies a dihedral angle phi of the planes but does not say that the chosen sector contains C or the sphere.
If C lies in that sector, theta = phi and d = R / sin(phi/2).
If C lies in its adjacent supplementary sector, theta = pi - phi and d = R / cos(phi/2).
Both are geometrically possible. They agree only at phi = pi/2.
At phi = 0 or pi the two distinct intersecting planes / finite edge hypothesis fails; no such edge can be silently supplied.

Concrete missing-condition witness at phi = pi/3:
take the planes y = 0 and y = sqrt(3) x, with common edge the z-axis.
Both C1 = (sqrt(3) R, R, 0) and C2 = (-R/sqrt(3), R, 0) have distance R from each plane.
Their distances to the edge are respectively 2R and 2R/sqrt(3).
The chosen 60-degree sector contains C1; its adjacent 120-degree sector contains C2.
Thus the original words plus selected paragraphs do not justify a unique distance.

Disposition: BLOCKED for the original numerical/formula task. No keyed item is authored for this subproblem.
The author does not add a sphere-containing-sector condition or redefine phi to disguise this gap.
This is missing source convention, not a failure of structural execution and not an independent-review verdict.

### 232(2): fixed-radius coordinate-plane tangency

Write the centre as (a,b,c). Distances from it to the three coordinate planes are |a|, |b|, |c|.
All equal R; the explicitly supplied positive-coordinate condition implies a = b = c = R.
The sphere equation is (x-R)^2 + (y-R)^2 + (z-R)^2 = R^2.
Without that condition there would be eight sign choices, but the seed does contain it.
This subproblem is independently determined and does not inherit the blocker of 232(1).

## 233: section area through the contact point

Let C be the centre, A the contact point, tau the tangent plane, and sigma a plane through A making angle phi with tau.
The plane normals make angle phi or its supplement. Since CA is normal to tau and |CA| = R,
the unsigned distance from C to sigma is d = R |cos(phi)|.
The section-circle radius rho obeys rho^2 = R^2 - d^2 = R^2 sin^2(phi).
The area of the solid-ball section is therefore pi R^2 sin^2(phi).
Changing from phi to its supplement does not change this area, unlike the half-angle ambiguity in 232(1).

For the visible question, state R > 0 and use the smaller, unoriented plane angle 0 <= phi <= pi/2.
Also explicitly assign area 0 when sigma = tau (phi = 0), where the intersection is the singleton A rather than a two-dimensional disk.
The source does not explicitly give a parameter interval or that degenerate-area convention.
This is a disclosed boundary completion, not evidence that the original wording required a singleton to be called a section.
For all nondegenerate sections no mathematical result changes; phi = pi/2 gives the great disk of area pi R^2.

## 234: three complete tangent-plane equations

All three given points lie on the sphere:
0^2 + 3^2 + 0^2 = 9;
0^2 + 2^2 + (-sqrt(5))^2 = 9;
2^2 + (-2)^2 + (-1)^2 = 9.

Using the selected diameter-normal criterion directly (not a previously read answer or exercise 235),
the tangent plane at A has normal OA and passes through A:
A dot (X-A) = 0.

1. (0,3,0): 3(y-3)=0, hence y = 3.
2. (0,2,-sqrt(5)): 2(y-2)-sqrt(5)(z+sqrt(5))=0, hence 2y-sqrt(5)z = 9.
3. (2,-2,-1): 2(x-2)-2(y+2)-(z+1)=0, hence 2x-2y-z = 9.

In each case the point lies in its plane; the normal is its radius direction; and distance to the origin is 9/3 = 3 (or 3 directly for y=3).
Each plane therefore meets the sphere only at its prescribed point.
Equivalent rescalings of an equation are not different wrong answers.

## 235: proof, not copying the already printed target

The premise A = (m,p,q) lies on x^2+y^2+z^2 = R^2 gives |A|^2 = R^2 and A != 0 for R > 0.
To establish necessity from the one-common-point definition, let Pi be any tangent plane at A and v any nonzero direction in Pi.
Points of that line are A+t v. Intersections with the sphere satisfy
t(2 A dot v + t |v|^2) = 0.
If A dot v != 0, then t = -2 A dot v / |v|^2 != 0 yields a second sphere point.
Tangency therefore requires A dot v = 0 for every in-plane direction.
Consequently the unique plane through A is normal to A and satisfies A dot (X-A) = 0.
Expanding and using |A|^2 = R^2 produces mx+py+qz = R^2.

For sufficiency, every X in this plane has X = A+w with A dot w = 0, so
|X|^2 = R^2 + |w|^2.
It lies on the sphere only if w = 0, i.e. X = A.
Thus the plane is tangent, and necessity + sufficiency prove both its equation and uniqueness.

This solves the original proof independently. The later choice question must make a learner judge this logical chain, not merely select the target formula already printed by the source.
Recognizing a valid chain will not demonstrate writing an independent proof or producing its algebraic expansion; record those capacity losses.

## Planned response boundaries

- Joint spatial count result for 229 and 230; no per-blank single-choice items.
- Joint centre-locus result for both parts of 231 and the coordinate-plane application 232(2), so a separate general-locus question does not directly supply another item's coordinate conclusion.
- No item for unresolved 232(1).
- One full parameter-dependent area formula for 233, not a fixed-angle numerical coincidence.
- One ordered triple of plane equations for 234.
- One full necessity-and-sufficiency proof-chain judgment for 235, without printing the target formula as the keyed alternative.

These are author planning notes only. No semantic PASS or review artifact exists.
