# N30 independent review: SOURCE-FIRST

Date: 2026-11-23. Role: sole fresh independent choice reviewer, not an author.
Phase: independent source solution only. This is not an approval of questions,
options, keys, coverage declarations, or an author draft.

## Input and boundary

- Sole working checkout: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-188`.
- Sole mathematical input: `.intentfold/tickets/STEMROBIN-188/tmp/n30-choices7/seed.json`.
- Seed byte SHA-256: `0de89e58dc65a512b3a528f134ea4052433bd4cb6f09ce2e3f6deca44715a419`.
- Read the requested choice skill, `references/review.md`,
  `references/contract.md`, and lesson `references/production-resume.md` as
  workflow instructions only.
- The seed contains sources 373-380, concept block 16 (right-triangle
  hypotenuse-leg congruence), and no figures. Images opened: 0.
- Did not follow seed trace paths, inspect old choices, draft views, author
  notes/solutions, answer keys, interactions, tests, environment files, DB,
  network, browser, Git, or other workers. No subagents.
- All output is confined to the new `n30-choice-independent7/` directory.
  No canonical content or other worker's files were changed.

The reasoning below was completed before any visible question view or key was
made available. The actual file is to be sealed with mode `0444`; its final byte
hash is reported separately after sealing, avoiding a self-referential hash.

## Conventions and completeness

Unless a boundary case is explicitly discussed, a triangle has three distinct
noncollinear vertices, lengths are positive, and a circle has radius `r > 0`.
An altitude is perpendicular distance to the supporting line of a side; its
foot may lie on the side's extension. A nonstraight angle has
`0 < theta < pi`, and its sides are rays unless explicitly called full lines.

A tangent's finite length means the segment from the given point to its
contact point, not the length of the infinite tangent line. At a point on a
circle, the tangent line exists uniquely and that segment has length zero.
Thus boundary points remain eligible in the zero-length loci below.

The source has 14 actual written response tasks: four in 373, two in 374,
one each in 375-378, two in 379, and two in 380. Construction, classification,
and locus questions are not interchangeable. All are addressed below.

## 373: Four right-triangle constructions

### 373(1): Hypotenuse c and leg b

Take right vertex X and lay off `XY = b`. Intersect the perpendicular to XY
through X with the circle of center Y and radius c; either intersection Z
gives `YZ = c` and a right angle at X.

The intersection equation is `XZ^2 = c^2 - b^2`.

- For `0 < b < c`, there are two placements with fixed XY, reflected across
  XY, but exactly one congruence class. The other leg is
  `sqrt(c^2-b^2)`. Hypotenuse-leg congruence also proves uniqueness of shape.
- For `b = c > 0`, Z collapses to X: no nondegenerate triangle.
- For `b > c`, there is no intersection and no solution.
- Zero or negative prescribed side lengths do not give an ordinary triangle.

Natural response: construct the right angle and circle intersection, select a
noncollapsed vertex, and justify sufficiency, necessity, and uniqueness up to
reflection. Merely recognizing the third-leg formula or an HL statement loses
the independent construction and its intersection analysis.

### 373(2): Legs a and b

At X construct perpendicular rays, lay off `XY = a` and `XZ = b`, and join
Y to Z. For any `a,b > 0`, this is a nondegenerate solution with hypotenuse
`sqrt(a^2+b^2)`. The included right angle and both legs determine one congruence
class. Reversing a chosen ray gives reflected placements, not additional shapes.
If `a = b`, the extra symmetry of a right isosceles triangle does not create a
second class. A zero leg collapses two vertices.

Natural response: produce the perpendicular construction and prove the given
legs have been used. Recognition loses drawing, transfer of lengths, and the
proof that the included angle, rather than an arbitrary angle, is right.

### 373(3): Leg a and its adjacent acute angle beta

Set `XY = a`, take X as the right vertex, and copy beta at Y with YX as one
side. Its other ray meets the perpendicular to XY at X in Z. For
`a > 0` and `0 < beta < pi/2`, the intersection is unique on each selected
side of XY, and

`XZ = a tan(beta)`, `YZ = a/cos(beta)`.

The two sides of XY give mirror placements in one congruence class. The given
angle is at Y, adjacent to leg XY; it is not the opposite angle. At `beta = 0`
the construction collapses. At `beta = pi/2` the two construction lines are
parallel and there is no finite intersection. An obtuse beta is not an acute
angle of a right triangle; zero a is not a leg.

Natural response: copy the angle at the correct endpoint and intersect it with
the correct perpendicular. Recognizing a tangent or cosine formula loses
angle placement and the actual ray-intersection construction.

### 373(4): Leg a and altitude h to the hypotenuse

Let `XY = a`, with right angle at X. A candidate hypotenuse through Y must be
at distance h from X, so it is a tangent through Y to the auxiliary circle
of center X and radius h. For `0 < h < a`, construct either such tangent
and intersect it with the perpendicular to XY through X; this gives Z.

An equivalent ruler-and-compass construction locates the altitude foot H as
an intersection of the circle with diameter XY and the circle of center X,
radius h. Then YH is the hypotenuse line. The right angle XHY establishes
that XH is its altitude.

Writing `d = XZ`, the area relation gives
`h = ad/sqrt(a^2+d^2)`. Consequently

`d = ah/sqrt(a^2-h^2)`, `YZ = a^2/sqrt(a^2-h^2)`.

For `0 < h < a`, d is uniquely determined and the two constructions are
mirror placements of one congruence class. The altitude foot is on the
hypotenuse segment of the resulting right triangle.

For `h = a > 0`, the auxiliary circle has just one tangent through Y, but that
line is parallel to the perpendicular at X: it does NOT yield a triangle.
For `h > a` there is no tangent, and for `h = 0` the altitude cannot belong
to a nondegenerate triangle. Thus existence is strictly `0 < h < a`.

Natural response: derive the distance-to-hypotenuse condition, construct the
tangent/altitude foot, and justify that the intersection is finite. Recognition
must not erase the strict bound by mistaking one auxiliary tangent for one
valid triangle.

## 374: Two isosceles-triangle constructions

### 374(1): Equal side b and altitude h to the base

Take apex C and altitude segment `CD = h`. Through D draw the perpendicular
to CD. Its intersections A and B with the circle of center C and radius b
are symmetric about CD, so `CA = CB = b` and D is the midpoint of AB.

Existence is precisely `0 < h < b`. The base has length
`2 sqrt(b^2-h^2)`, giving one congruence class. Turning the altitude direction
or reflecting a placement does not change that class.

At `h = b > 0`, A and B coincide at D. At `h = 0`, the apex is on the base
line and the triangle is collinear. For `h > b`, there are no intersections.

Natural response: construct the base line and both vertices, and justify that
an apex altitude bisects the base. Recognition loses production of the
symmetric pair and the noncollapse check.

### 374(2): Base a and altitude h to an equal side

Take `AB = a`; the apex C must lie on the perpendicular bisector of AB.
If AC is the equal side receiving the altitude from B, its supporting line
must be at distance h from B. Construct the two tangents from A to the circle
of center B, radius h, and intersect each tangent line with the perpendicular
bisector of AB. These give the two reflected apex placements.

With `A = (-a/2,0)`, `B = (a/2,0)`, and `C = (0,H)`, the equal side is
`b = sqrt(a^2/4+H^2)`. Equality of area expressions gives
`h = a|H|/b`, hence

`|H| = ah/(2 sqrt(a^2-h^2))`,
`b = a^2/(2 sqrt(a^2-h^2))`.

There is one congruence class exactly when `a > 0` and `0 < h < a`;
the two signs of H are mirrors. The base angle alpha obeys
`sin(alpha) = h/a`, with alpha necessarily acute. The supplementary sine
angle would be an impossible obtuse base angle, not a second isosceles shape.

The altitude-foot location is essential:

- `0 < h < a/sqrt(2)`: the apex angle is obtuse; the perpendicular from B
  meets the extension of AC beyond C. This is a valid ordinary altitude.
- `h = a/sqrt(2)`: the apex angle is right and the altitude foot is C.
- `a/sqrt(2) < h < a`: the apex angle is acute and the foot lies inside AC.

Indeed the foot's fraction along A-to-C is `a^2/(2b^2)`, which is above,
equal to, or below 1 in those three cases.

At `h = a`, the relevant construction lines do not meet in a finite apex.
At `h > a`, the auxiliary tangents do not exist; at `h = 0`, the triangle
collapses. If a question explicitly restricts the altitude foot to the side
segment, the stricter domain is `a/sqrt(2) <= h < a`; that extra restriction
must not be silently imposed on the original.

Natural response: construct a distance-constrained side and the equal-distance
apex locus, including obtuse solutions. Recognition loses construction and
can lose the valid extension case if it presents only an acute-looking schema.

## 375: Number of tangents through A

Let `d = OA`, with the given circle's radius `r > 0`.

- `d > r`: exactly two distinct tangent lines, with contact points T1 and T2.
- `d = r`: exactly one tangent, perpendicular to OA at A.
- `d < r`, including `A = O`: no tangent.

Necessity comes from the right triangle OTA at a contact point:
`AT^2 = d^2-r^2`. Outside, the two intersections with the circle of diameter
OA give two contacts; on the boundary, the perpendicular at A is unique;
inside, the right-triangle equation is impossible.

Outside, both tangent segments have length `sqrt(d^2-r^2)`. On the circle,
the single tangent's contact is A and its segment has length zero. Counting
opposite rays along one tangent as two lines, or counting a double contact as
two distinct tangents, would be wrong.

Natural response: classify all point positions and justify each count.
Recognition can preserve the classification if the complete cases are required,
but loses the independent proof; an outside-only task omits written scope.

## 376: Construct the tangents through a given point

For `d = OA > r`, find midpoint I of OA and draw the circle with diameter OA.
Its two intersections T1,T2 with the given circle are the required contacts.
Join A to each. The diameter theorem gives `OTi perpendicular ATi`, proving
tangency. Conversely any contact satisfies that right angle and belongs to
the auxiliary circle, so these are all solutions.

For `d = r`, construct the perpendicular to OA at A directly. One must not
try to draw a line through the coincident pair A,A after the two contact
points merge. Its tangent segment has length zero.

For `d < r` there is no solution. If `A = O`, OA cannot be used as a
nonzero diameter, but the inside-point conclusion already settles the task.
The given positive-radius circle is not replaced by a point-circle.

The outside case has two actual tangent lines, not two alternative congruence
classes of triangles to choose as a single answer. Their auxiliary right
triangles are reflected across OA and congruent by the common hypotenuse and
radius. The boundary case has one line.

Natural response: produce all tangent lines, prove the contact criterion,
and handle the on-circle construction separately. A count copied from 375
does not perform 376's construction. Recognizing a complete construction can
retain its geometric logic but loses independent execution with instruments.

## 377: Locus of a prescribed tangent-segment length

For a point P admitting a tangent segment PT to the circle,
`OP^2 = r^2 + PT^2`. Therefore prescribing `PT = a >= 0` gives

`OP = R = sqrt(r^2+a^2)`.

The complete locus is the circle concentric with the given circle and of radius
R. Construct R as the hypotenuse of a right triangle with legs r,a; for
`a = 0`, simply use R = r.

For `a > 0`, every locus point is outside the given circle and its two
tangent segments both have length a. Conversely the right-triangle equation
forces any qualifying point onto that circle. For `a = 0`, the locus is the
given circumference itself, with one tangent at each point and zero segment
length. A negative prescribed length has no solutions. Points strictly inside
the given circle have no real tangent segment and are not in the locus.

The locus is uniquely determined, but it has infinitely many points; different
directions are not different locus solutions. The zero-length case is not the
center O and not an empty set under the convention stated above.

Natural response: identify the whole locus and prove both inclusions, not just
find one distance or one point. Recognition loses the independent locus proof
and construction of R unless those relationships are themselves assessed.

## 378: Explicitly conditional construction, not invented givens

The seed says to construct a circle cutting off segments of prescribed length
on the sides of a given angle. It does not specify endpoints, a center, a
radius, tangency, or uniqueness. I do not infer any of these as hidden data.
Instead the following interpretations are explicitly conditional and fully
solved here. This resolves construction under stated meanings now; it is not
a permanent deferral, nor a claim that the seed chose one meaning.

### A. If the prescribed segments are chords on the two angle rays

Assume each ray contains both endpoints of its chord, of positive prescribed
lengths p and q. If one common length is intended, specialize to `p = q = L`.
Let V be the angle vertex and its unit ray directions be u,v, with
`0 < theta < pi`.

Choose a free constructible length `t > 0`; it is a construction parameter,
not an additional given datum. Define

`x = (sqrt(p^2+4t^2)-p)/2`,
`y = (sqrt(q^2+4t^2)-q)/2`.

Both are positive and constructible by right triangles, subtraction and
bisection. On the first ray mark A,B at distances x,x+p from V. On the
second mark D,E at distances y,y+q. Construct the circumcircle of A,B,D.
These three points are noncollinear.

The products satisfy
`VA * VB = x(x+p) = t^2 = y(y+q) = VD * VE`.
The first secant gives V's power as t^2. On the second line, after the
known intersection D, the other intersection must be at distance
`t^2/y = y+q`, namely E. Thus the circle has both required ray chords.
This proves the construction rather than assuming four points are concyclic.

There is also an endpoint case `t = 0`: construct the circumcircle through
V, the point at distance p on the first ray, and the point at distance q
on the second. Its chords start at V. This is a proper circle for positive
p,q and a nonstraight angle. Use these three distinct points instead of
the degenerate triple A,B,D from the positive-t construction.

Completeness: for any circle whose entire two chords lie on the rays, their
near-endpoint distances x,y are nonnegative. Its power at V is
`P = x(x+p) = y(y+q) >= 0`. P determines those nonnegative roots uniquely.
For P > 0 the three-point construction determines exactly one circle; for
P = 0 the V-endpoint construction does. V cannot be inside such a circle,
since then each full-line chord would have an endpoint behind V. Thus
`P >= 0` parametrizes all circles in this explicitly stated interpretation.
If endpoints at V are excluded, use only `P > 0`.

For the common-length case, x = y. The center lies on the internal angle
bisector at distance
`s = (x+L/2)/cos(theta/2)` from V, and

`R^2 = s^2 sin^2(theta/2) + L^2/4`,
`s >= L/(2 cos(theta/2))`.

These formulas can also be used directly to construct the circle. The chord
midpoints have projection distance `s cos(theta/2)` on each ray; the bound
is exactly what keeps both near endpoints on the rays. At equality the
circle goes through V; above it both chords are separated from V.

Equal distances of a center from the two FULL side lines also allow the
external bisector, but its projections onto the two nonopposite rays have
opposite signs. It cannot supply two positive-length chords wholly on those
rays. Including it without checking the rays would change the task.

There are infinitely many solutions, including circles with different radii,
not just mirror copies of one size. In the common-length case each circle is
itself symmetric about the internal bisector, and R increases with s. Once P
is selected, the circle is unique. With different labelled p,q, reflection
across the internal bisector swaps the data; it need not preserve that
labelled construction.

### B. If the prescribed segments start at the angle vertex

Under an explicitly designated-endpoint reading, mark A,B on the rays with
`VA = p > 0`, `VB = q > 0`. The required circle passes through A and B.
Choose any center C on their perpendicular bisector and take radius CA.
This constructs all such circles. No third point, radius, or center was
given, so the circle is not unique.

For each chosen center there is one circle. Its minimum possible radius is
`AB/2`, at midpoint C of AB. For each larger chosen radius there are two
centers reflected across AB; equal-radius circles are congruent, while
different radii give noncongruent circles.

If the intended ray segment ends at the ONLY strictly positive intersection
on each ray, additionally choose a circle containing V in its interior.
This is still constructive: first find the center C0 of the circle through
V,A,B. Move the center along the perpendicular bisector of AB to the side
where `CA^2 > CV^2`, and take radius CA. Such a direction always exists:
for a direction n along that bisector,
`p(n dot u) = q(n dot v)`, with both dot products nonzero and of the same
sign. Choose their negative direction. Starting at C0, any positive move
in that direction makes V strictly inside the circle. Each ray then has
exactly one positive crossing, at its designated endpoint.

The V-on-circle limit is the circumcircle of V,A,B. Different rules about
whether V itself counts as an endpoint must be stated, not guessed.

### C. Tangency is an additional condition, not present in the seed

If a visible problem explicitly chooses the stronger interpretation of a
circle tangent to BOTH rays with prescribed tangent segments from V, those
segments must be equal. For common `L > 0`, construct the internal angle
bisector, mark the contact point at distance L on one ray, and intersect
its perpendicular with that bisector for the center. Then
`VC = L/cos(theta/2)` and `R = L tan(theta/2)`.
This gives one circle tangent to the actual rays. Unequal positive prescribed
tangent lengths are impossible. `L = 0` would give radius zero and no proper
circle. Treating full side lines instead of rays introduces different
branches and must not be silently substituted.

This is a solved conditional strengthening, NOT a deduction that the original
circle must be tangent or unique. In A or B, positive lengths and
`0 < theta < pi` are sufficient for existence; a zero chord is not a
positive chord. At a zero or straight angle the noncollinear constructions
and ordinary-angle classification do not apply.

Natural response: specify what segment is being prescribed, construct a
circle under that interpretation, prove the secant or endpoint conditions,
and acknowledge any free family. Recognition loses the choice and execution
of construction parameters and may conceal nonuniqueness. A visible question
must state its interpretation; no answer may assume an unstated radius,
fixed chord position, or tangency. The source-first construction is complete
conditionally; subsequent fidelity review remains a separate phase.

## 379: Circle tangent to a circle and its given tangent line

Use coordinates only for proof, not as extra input. Let the given tangent
line a be `y = 0`, the given center be `O = (0,r)`, and `r > 0`.
Write `T = (0,0)` for their contact and `U = (0,2r)` for the opposite
point of the given circle. A sought circle must have positive radius rho
and be distinct from the given circle. Coincident circumferences are not
tangent circles.

### 379(1): Prescribed contact M on the line a

Let `M = (m,0)`. A circle tangent to a at M has center
`C = (m,epsilon rho)`, where epsilon is +1 or -1.
External tangency to the given circle requires `OC = r+rho`; internal
tangency requires `OC = |r-rho|`, excluding coincidence.

Squaring these conditions yields, respectively,

`m^2 = 2r rho(1+epsilon)`,
`m^2 = 2r rho(epsilon-1)`.

For `m != 0`, only the external, same-side case is possible:

`rho = m^2/(4r)`, `C = (m,rho)`.

This is exactly one circle, not a choice of two circles on opposite sides
of a. Construct rho as the fourth proportional
`4r : |m| = |m| : rho`, mark C at distance rho from M on the
perpendicular to a toward O's side, and draw its circle. The center
distance is r+rho, so the two circles are externally tangent. Their
contact is between the centers, and their line contact is precisely M.

The case `M = T` is not covered by substituting rho = 0 into that formula:

- For every `rho > 0`, `C = (0,-rho)` gives an externally tangent circle
  on the opposite side of a, both contacts at T.
- For every `rho > 0` with `rho != r`, `C = (0,rho)` gives a genuinely
  internally tangent circle on the same side, both contacts at T.
- For `rho < r` in the latter family, the new circle is inside the old;
  for `rho > r`, it contains the old.
- `C = O, rho = r` is the given circle itself and is excluded.
  Radius zero is also excluded.

Thus M != T gives one solution, whereas M = T gives two continuous
families with the coincidence exclusion, not zero or one solution.
Reflecting m to -m gives a congruent reflected configuration, but changes
the prescribed point and is not another solution for a fixed nonzero M.
At `|m| = 2r`, rho = r is valid because C != O; equal radii alone do not
mean coincidence.

Natural response: locate the center on the contact normal, distinguish
internal/external and same/opposite-side possibilities, construct the unique
ordinary solution, and handle the shared-contact families separately.
Recognition loses constructing the proportional radius and center and may
erase the exceptional infinite family.

### 379(2): Prescribed contact M on the given circle

M must belong to the given circumference; this follows from the requested
contact, not an invented coordinate restriction. Write `M = (x,y)`, so
`x^2+y^2 = 2ry` and `0 <= y <= 2r`.

Any genuinely tangent circle has its center on OM. Write
`C = O + k(M-O)`. Its radius must be `rho = |k-1|r`.
Tangency to a requires
`|r+k(y-r)| = |k-1|r`.

Putting `u = (y-r)/r`, the squared equation is
`k[2(u+1)+k(u^2-1)] = 0`.
The root k = 0 is exactly the coincident given circle and is excluded.

For `M != T,U`, there is precisely one remaining root:

`k = 2r/(2r-y) > 1`,
`rho = ry/(2r-y) > 0`,
`C = (2rx/(2r-y), rho)`.

Thus C is beyond M on the ray OM, on O's side of a, and
`OC = kr = r+rho`: the circles are externally tangent at M.
No distinct internally tangent branch survives for such M.

A direct ruler-and-compass construction avoids needing these formulas:
draw UM and let `N = UM intersect a`; erect the perpendicular to a at N;
its intersection with OM is C. Draw the circle with center C and radius
CN. For ordinary M, x != 0 and y != 2r, so N and C are finite, distinct,
and uniquely determined. The formulas above verify `CN = CM = rho`,
which proves both required tangencies. N is the new contact with a.

The exceptional points have different conclusions:

- `M = T`: the same two families as in 379(1) occur. Centers
  `(0,-rho)`, rho > 0, are externally tangent at T; centers `(0,rho)`,
  rho > 0 and rho != r, are internally tangent at T. Each is tangent
  to a at T as well. The two construction normals coincide, so there
  is a family, not a unique intersection.
- `M = U`: there is NO distinct positive-radius solution. Its center
  must be `(0,z)`, and line tangency and contact at U force
  `|z| = |z-2r|`, hence `z = r`, rho = r. This is only the excluded
  given circle. Equivalently the ordinary radius tends to infinity
  as M approaches U; infinity is not an admissible circle.
- A point M off the given circle cannot be its prescribed tangency point.
  k = 1 would give radius zero and is never admissible.

The ordinary solution's line contact and radius also obey
`rho = TN^2/(4r)`, consistent with 379(1); this does not make the two
written tasks identical, since their prescribed contacts are different.
Reflection across OT exchanges ordinary points x and -x and their
solutions, rather than adding a solution for fixed M.

Natural response: use contact-point collinearity, construct the new line
contact and center, prove tangency, and classify T and U. Recognition loses
the actual intersection construction and can conceal the distinction between
infinite solutions at T, none at U, and a unique solution elsewhere.

## 380: Equal tangent lengths to externally tangent circles

Let `r1,r2 > 0`, `d = r1+r2`,
`O1 = (0,0)`, `O2 = (d,0)`. Their external contact is
`T = (r1,0)`. A qualifying point must be on or outside each circle so
that both tangent-segment lengths are real.

### 380(1): Find such points M

Construct the perpendicular to O1O2 at T, which is the common tangent
there, and choose M anywhere on it. The segment MT is tangent to both
circles, so it gives equal lengths. Choosing M != T supplies positive
lengths and strict exterior points. Choosing M = T gives both lengths
zero and is allowed under the stated convention.

This finds points without pretending there is a uniquely determined M.
There are infinitely many; opposite placements at the same distance from
T are mirror configurations with the same lengths.

Natural response: locate or construct a qualifying point and demonstrate
equal tangent segments. Recognition of the line alone loses choosing and
constructing a point and the sufficiency argument.

### 380(2): Complete locus, including necessity

For `M = (x,y)`, equality of the real tangent lengths implies equality
of their squares:

`x^2+y^2-r1^2 = (x-d)^2+y^2-r2^2`,
`2dx = d^2+r1^2-r2^2 = 2dr1`.

Since d > 0, this forces `x = r1`. Conversely at every point `(r1,y)`,
the squared tangent lengths are both y^2, since the squared center
distances are `r1^2+y^2` and `r2^2+y^2`. All such points are outside
both circles except T, which belongs to both circumferences. There are
no extraneous interior points from using the power equation in this
externally tangent case.

The exact locus is the ENTIRE line perpendicular to O1O2 through T,
the common tangent at their external contact. Both lengths equal `|y| = MT`.
It is not merely one ray, and it is not generally the perpendicular
bisector of O1O2; those coincide only when r1 = r2.

With the zero-length convention, T remains included. If an explicitly
different problem required strictly positive tangent lengths, its locus
would be that line with T removed, two open rays. The original is not
silently changed to that domain. Zero-radius objects, coincident circles,
and internal tangency are not cases of the two proper externally tangent
circles given here.

Natural response: prove both inclusions and the full domain, not simply
recognize a line after 380(1) supplied a sufficient example. Recognition
can retain the locus distinction and necessity reasoning, but loses an
independently written completeness proof.

## Coverage and next-phase posture

All 14 written tasks have independent constructions/classifications or locus
proofs above, including their meaningful existence boundaries, finite versus
infinite solutions, uniqueness up to congruence where relevant, reflections,
and degeneracies. Source 378 has completed explicitly conditional constructions
rather than a guessed set of givens or a permanent deferral. The source's
zero-length tangent cases and 379's T/U/coincidence exceptions are retained.

Recognition inherently loses unprompted production of drawings, instrument
execution, and independently written proofs. That alone does not make a
choice conversion fail. Next-phase review must establish whether its visible
questions still require the key mathematical relationships and complete case
distinctions, and whether any extra loss destroys a written task. Separate
construction, counting, finding a point, and proving a full locus must not
be declared covered merely because they share a formula.

No visible-question fidelity, redundancy, leakage, option truth set, author
solution, or key has been reviewed or approved in this phase. Only after this
actual source-first file is locked may the same reviewer receive the visible
views for the next blind step; keys remain for the later comparison step.
