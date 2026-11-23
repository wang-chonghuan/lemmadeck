# SAME188-6: blind author source-solving, sources 373-380

## Authority and checkpoint

- Role: choice AUTHOR, preseed blind SOURCE-SOLVING ONLY; not an independent reviewer.
- Workspace: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`.
- Sole mathematical input: `/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n30-choice-source-solving-inputs-19/source-only.json`.
- Input byte SHA-256: `d89a27e1d74d7b8e1736dfed92a71eca60e05ac6290513151df9da73ab65c133`, checked before solving.
- Projected book / lesson: `6-8g` / `geo68-c2-s4-n30`.
- Input status: `PRESEED_BLIND_SOURCE_SOLVING_ONLY`; `notOfficialSeed=true`.
- Sources: 373, 374, 375, 376, 377, 378, 379, 380; every supplied `figure_refs` is empty.
- Selected definition: projected `templateIndex=16`, theorem 38, stating congruence of right triangles with congruent hypotenuses and one corresponding leg. This is a template selector, NOT a verified official native concept-block index.
- Supplied template path/hash bindings are provenance assertions from the input only. Neither template was opened or independently hashed.
- No answers, options, candidate drafts, interactions, judging subparts, other in-flight outputs, original pages or images were consulted. No figure is needed to interpret the supplied prose.
- All solutions below were derived from the written input before considering alternatives. There are no alternatives in this artifact.

This is immutable author reasoning, not a native seed, question draft, key, review, production approval or learner payload. Source 378 has an unresolved meaning; completing its ambiguity analysis does not resolve the source.

## Conventions and constructible operations

Use ordinary Euclidean circles of positive radius and finite, nondegenerate triangles. Side lengths are positive. A triangle's altitude is perpendicular to the supporting line of the opposite side and may meet its extension. Count reflected placements separately when discussing constructions, but identify them when discussing congruence classes.

A tangent line meets a positive-radius circle at exactly one point and is perpendicular to the radius there. From a strictly exterior point there are two tangent segments of the same positive length. At a point on a circle there is one tangent LINE. Whether the zero-length segment at that point is admitted as a "tangent length" is not specified by the supplied definition; sources 377 and 380 retain both interpretations explicitly.

Two tangent circles are distinct and meet at exactly one point. Coincident circles are not tangent. A circle may be internally or externally tangent to another, unless the prose explicitly says otherwise. Sources 379.1 and 379.2 do not restrict tangency to external tangency.

Constructions use straightedge and compass, including perpendiculars, perpendicular bisectors, angle bisectors, circles and line/circle intersections. Copy a supplied angle when needed; do not claim an arbitrary numerical angle is itself straightedge-and-compass constructible.

The following standard constructions make all formulas below executable, rather than merely algebraic recipes:

- To construct `sqrt(x^2+y^2)` for positive segments, erect perpendicular legs of lengths `x,y` and take the hypotenuse.
- To construct `sqrt(x^2-y^2)` when `x>y>=0`, lay off `UV=y`, erect a perpendicular at `V`, and intersect it with the circle of center `U` and radius `x`; the perpendicular segment has the required length.
- To construct `xy/z` for `z>0`, use two rays with common origin `P`. On the first ray mark `PA=z` and `PB=x`; on the second mark `PD=y`. Draw `AD`; its parallel through `B` meets the second ray at `E`. Similar triangles give `PE=xy/z`.
- To construct a circumcircle of three noncollinear points, intersect two perpendicular bisectors and use the distance to any of the three points as radius.

Invalid negative lengths or radii cannot be repaired by taking absolute values. Zero lengths are handled only as explicit boundary tests, not silently accepted as genuine sides or circles.

## 373: construct right triangles

### 373.1: hypotenuse c and leg b

Task: construct a right triangle whose hypotenuse is `c` and one leg is `b`.

Construction:

1. Draw `AB=c`.
2. Construct the circle with diameter `AB`.
3. Intersect it with the circle of center `A` and radius `b`; each nonendpoint intersection is a possible vertex `C`.
4. Join `AC` and `BC`.

The diameter-circle property gives `angle ACB=90 degrees`, and `AC=b`, `AB=c`. Conversely, every solution must have its third vertex on both circles. Thus this construction exhausts the solutions.

Existence is exactly `0<b<c`. There are two reflected positions of `C`, and one congruence class. The other leg is `sqrt(c^2-b^2)`. The supplied hypotenuse-leg congruence theorem independently supports uniqueness up to congruence.

Boundaries: `b=c>0` gives `C=B` and a collapsed triangle; `b=0` gives `C=A`; `b>c` has no intersection giving a right triangle. `c<=0` or `b<0` is invalid. When `b=c/sqrt(2)` the triangle is right isosceles, not a second solution class.

Conceptual distinction: a hypotenuse is strictly longer than either leg; locating a vertex on a diameter circle enforces the right angle rather than merely matching two lengths.

### 373.2: the two legs a and b

Task: construct a right triangle with perpendicular legs `a,b`.

Construction: choose a point `C`, draw two perpendicular rays from `C`, set `CA=a` and `CB=b`, and join `AB`. Every solution has the same two perpendicular leg lengths, so the construction is complete up to rigid motion and reflection.

Existence is exactly `a>0,b>0`. The hypotenuse is `sqrt(a^2+b^2)`. Interchanging the leg names does not create a different unlabeled triangle. `a=b>0` is the right-isosceles case. Either zero leg collapses the triangle; a negative leg is invalid.

Conceptual distinction: prescribed legs determine the included right angle directly; these are not the hypotenuse-and-leg data of 373.1.

### 373.3: leg a and the acute angle beta adjacent to that leg

Task: construct a right triangle with `CA=a`, right angle at `C`, and `angle CAB=beta`. "Adjacent" means the given leg is adjacent to the given acute angle, not opposite it.

Construction: draw `CA=a`; erect the perpendicular to `CA` at `C`; at `A` copy the given angle `beta` with initial ray `AC` into the chosen half-plane. Its second ray intersects the perpendicular at `B`. Join the sides. Reflecting across `AC` gives the other placement.

Existence is exactly `a>0` and `0<beta<90 degrees`. In coordinates `C=(0,0), A=(a,0)`, the copied ray meets `x=0` at distance `CB=a*tan(beta)`. Thus the other leg is `a*tan(beta)`, the hypotenuse is `a/cos(beta)`, and the other acute angle is `90 degrees-beta`. These formulas verify the construction and its uniqueness.

Boundaries: `beta=0` yields `B=C` and degeneracy. `beta=90 degrees` gives a ray parallel to the perpendicular at `C`, so no finite vertex exists; it is an unbounded limiting shape, not a finite solution. An obtuse or negative beta contradicts "acute". `a=0` collapses the prescribed leg. `beta=45 degrees` gives the right-isosceles case.

Conceptual distinction: an adjacent-leg condition uses tangent/cosine relations; treating `a` as the opposite leg would solve a different problem.

### 373.4: leg a and altitude h to the hypotenuse

Task: construct a right triangle `ACB`, right at `C`, with `AC=a` and altitude `CH=h` to hypotenuse `AB`.

Construction:

1. Draw `AC=a` and erect the perpendicular `l` to `AC` at `C`.
2. Construct the circle with diameter `AC` and the circle of center `C`, radius `h`.
3. For each intersection `H` different from `A,C`, draw `AH`; let `B=AH intersect l`.
4. Join `BC`. The diameter-circle property gives `CH perpendicular AH`, so `CH` is the prescribed altitude to `AB`.

For `0<h<a`, the two intersections give reflected triangles. The foot lies strictly inside the hypotenuse. To verify both construction and completeness, put `C=(0,0), A=(a,0)`. The two circle equations give `H_x=h^2/a` and `H_y=+/-h*sqrt(a^2-h^2)/a`. Intersecting `AH` with `x=0` gives

`b=BC=a*h/sqrt(a^2-h^2)`,

`c=AB=a^2/sqrt(a^2-h^2)`.

Independently, area equality gives `h=a*b/sqrt(a^2+b^2)`. Hence a finite positive other leg exists if and only if `0<h<a`, and is uniquely determined. This also proves that no solutions were lost by the construction.

Boundaries: `h=0` collapses the triangle. At `h=a>0` the auxiliary intersection is `H=A`; there is no well-defined noncollapsed `AH` and no finite triangle. As `h` tends to `a` from below, `b,c` grow without bound. `h>a` is impossible. `a<=0` or `h<0` is invalid. The right-isosceles case is `h=a/sqrt(2)`.

Conceptual distinction: a hypotenuse-altitude is smaller than each leg and is not itself the missing leg; the area relation and the perpendicular foot are essential.

## 374: construct isosceles triangles

### 374.1: equal side b and altitude h to the base

Task: construct equal sides `VB=VC=b` and altitude `VD=h` to base `BC`.

Construction: draw `VD=h`, erect at `D` the perpendicular line to `VD`, intersect that line with the circle of center `V`, radius `b` at `B,C`, and join the sides. The two base intersections are symmetric about `VD`.

Existence is exactly `b>h>0`. Pythagoras in the two right half-triangles gives half-base `sqrt(b^2-h^2)`, full base `2*sqrt(b^2-h^2)`, and vertex angle `2*arccos(h/b)`. Conversely any isosceles triangle's base altitude bisects its base, so every solution has this form. There is one congruence class.

Boundaries: `h=b>0` makes both base vertices equal to `D`; `h=0` makes all three vertices collinear; `h>b` gives no base intersection. Nonpositive `b` or negative `h` is invalid. The vertex angle is obtuse for `0<h<b/sqrt(2)`, right at `h=b/sqrt(2)`, and acute for `b/sqrt(2)<h<b`. At `h=sqrt(3)*b/2` the triangle is equilateral.

Conceptual distinction: the given altitude is on the base, bisects it, and is compared with the equal side, not with an unspecified full base.

### 374.2: base a and altitude h to one equal side

Task: construct `BC=a`, `AB=AC=b`, and distance `h` from `C` to the SUPPORTING LINE of `AB` (equivalently from `B` to the line of `AC`).

Construction:

1. Draw `BC=a` and its perpendicular bisector `p`.
2. Construct the circle of center `C`, radius `h`.
3. Construct the two tangents from `B` to that circle: intersect the circle with the circle of diameter `BC` to obtain the perpendicular feet `D`; draw `BD`.
4. Intersect each tangent line with `p` to obtain `A`, and join `AB,AC`.

The perpendicular bisector makes the two equal sides equal. The tangent line is at distance `h` from `C`. With `B=(0,0), C=(a,0)`, the intersections give `A=(a/2,+/-H)`. Thus there are two reflected placements and one congruence class.

For an independent necessity calculation, let `H` be the altitude to the base. Then `b=sqrt(H^2+a^2/4)` and equality of the two area expressions gives `a*H=b*h`. Solving gives

`H=a*h/(2*sqrt(a^2-h^2))`,

`b=a^2/(2*sqrt(a^2-h^2))`.

Consequently existence is exactly `0<h<a`. The tangent construction provides sufficiency and is complete because every admissible side line is a tangent from `B` to that auxiliary circle.

Foot-position cases must not be suppressed. If `D` is the foot from `C` on line `BA`, then `BD/b=2*(1-h^2/a^2)`. Therefore:

- `0<h<a/sqrt(2)`: `D` lies beyond `A` on ray `BA`; the vertex angle at `A` is obtuse.
- `h=a/sqrt(2)`: `D=A`; the vertex angle is right.
- `a/sqrt(2)<h<a`: `D` is strictly between `B,A`; the vertex angle is acute.

At `h=sqrt(3)*a/2`, the triangle is equilateral. No separate noncongruent branch arises by choosing the other equal side for the altitude.

Boundaries: `h=0` collapses `A` to the base midpoint. At `h=a>0`, the sole tangent to the auxiliary circle at `B` is perpendicular to `BC` and parallel to its perpendicular bisector; there is no finite apex. As `h` tends to `a` from below, `H,b` grow without bound. `h>a` is impossible; invalid signed or zero base data are not triangles.

If a later authorized definition explicitly requires the altitude foot to lie on the finite equal-side segment, the allowable range becomes `a/sqrt(2)<=h<a`. The supplied prose does not impose that restriction; silently imposing it would discard valid obtuse triangles.

Conceptual distinction: the prescribed altitude is NOT the base altitude. Its relation to the base uses area, and the extended-side case is mathematically necessary.

## 375: number of tangents through a given point

Task: classify the number of tangent lines to circle `(O,r)` through `A`.

Let `d=OA`, with `r>0`. A contact point `T` satisfies `OT perpendicular AT`, so `d^2=r^2+AT^2`. For `d>r`, intersect the given circle with the circle of diameter `OA`; there are exactly two contacts and hence two tangent lines. The two resulting right triangles lie on opposite sides of `OA`. For `d=r`, the sole tangent is the perpendicular to `OA` at `A`. For `d<r`, the squared-length relation is impossible, and there is no tangent.

Thus the complete classification is: exterior point, TWO; point on circle, ONE; interior point, ZERO. `A=O` is part of the interior case, not an exception with extra tangents.

On-circle tangency supplies one line even though its contact segment is zero. A zero-radius point set is not a circle in this task; the above counts cannot be extended to `r=0` by substitution. Negative radii are invalid.

Conceptual distinction: the point's position determines existence and multiplicity; counting the two radii to exterior contacts is not counting additional tangent lines.

## 376: construct the tangent lines through a given point

Task: carry out the construction, including infeasible and on-circle cases, rather than assume the point is exterior.

For `r>0` and `d=OA>r`, construct the midpoint of `OA` and the circle with diameter `OA`. Its two intersections `T1,T2` with the given circle yield lines `AT1,AT2`. The diameter property makes each `OTi` perpendicular to `ATi`, proving tangency. Conversely any tangent contact makes that same right angle and lies on the diameter circle, proving completeness.

For `d=r`, construct the perpendicular to `OA` at `A`; it is the unique tangent. Do not try to form a line through the repeated pair `A,A` from the exterior procedure. For `d<r`, report nonexistence, including `A=O`. Invalid `r<=0` is outside the circle premise.

Conceptual distinction: the auxiliary diameter circle locates the contacts; joining the external point to an arbitrary point of the given circle does not construct a tangent.

## 377: locus of points with prescribed tangent length a

Task: identify the complete locus, not only one example point.

For a genuine circle `r>0` and prescribed positive length `a`, let `T` be either tangent contact from a point `P`. The right triangle `OTP` gives `OP^2=r^2+a^2`. Thus the necessary radius is `R=sqrt(r^2+a^2)>r`.

Construction: construct a right triangle with legs `r,a`, use its hypotenuse `R`, and draw the circle of center `O`, radius `R`. Every point on that concentric circle is strictly exterior to the original circle and has tangent length `sqrt(R^2-r^2)=a`; every point off it fails. This proves both directions of the locus assertion. The two tangents from each exterior point have the same length, not two different loci.

Boundary `a=0`: if zero-length tangent segments at points of the original circle are admitted, the locus is the original circle. If "points with tangents of length a" requires strictly exterior points and positive segments, there are no points when `a=0`. The input's single supplied congruence definition does not choose this convention. Negative `a` is invalid, not a second concentric circle. Invalid `r<=0` is excluded.

Conceptual distinction: a locus fixes distance from the center via a right triangle; adding lengths `r+a` would ignore perpendicularity.

## 378: construct a circle cutting fixed-length segments on the sides of an angle

### What the text determines, and what it does not

The prose supplies an angle and says that segments cut on its two sides are of fixed length. It does NOT say that the circle passes through the angle's vertex, where the segments start, whether the two lengths coincide, the circle's radius or another uniqueness constraint.

Denote the vertex by `V` and the two rays by `u,v`, with proper angle `0<theta<180 degrees`. Use `p,q` only as symbolic names for any separately supplied fixed lengths, not as guessed amounts or a claim that the source specifies two unequal lengths. If there is one common given length, specialize to `p=q`. No numerical data are invented.

There are at least two materially different readings. They have different solution families. Neither may be silently promoted to the intended source.

### Conditional reading A: distances cut from the vertex

If an authorized clarification says the circle passes through `V` and the other intersections `P,Q` have `VP=p`, `VQ=q`, construct `P` on ray `u`, `Q` on ray `v`, then the circumcircle of `V,P,Q`.

For `p,q>0` and a proper angle these three points are noncollinear, so the circle exists uniquely. The cosine rule gives `PQ=sqrt(p^2+q^2-2*p*q*cos(theta))`; its circumradius is `PQ/(2*sin(theta))`, which verifies but is not needed to perform the construction. When `p=q`, the center is on the internal angle-bisector LINE; its position relative to the vertex is determined by the perpendicular bisectors, not by a radius guessed from the prose.

For a zero angle, the rays coincide: with distinct positive `p,q`, the three points are distinct and collinear, so no circle exists; with `p=q`, only two distinct points remain and infinitely many circles through them exist. For a straight angle and positive `p,q`, the points are distinct and collinear, so there is no circle. If either prescribed vertex-distance is zero, a repeated vertex leaves only two distinct points (infinitely many circles); if both are zero, the point constraint alone also does not determine a circle. These are degenerate readings, not ordinary positive-length constructions.

The instruction "passes through V" is EXTRA relative to the supplied prose. This construction cannot be called the unconditional answer to 378.

### Conditional reading B: full chord segments on the two sides

Suppose each side has two circle intersections and their separation is prescribed as `p,q>0`. This is a full-chord condition. Without another constraint it ordinarily leaves a continuum of circles, not a unique circumcircle.

A complete construction family is as follows:

1. Choose a free, constructible radius `R>=max(p,q)/2`, with `R>0`. This is a family parameter, not an additional given.
2. Construct `d1=sqrt(R^2-p^2/4)` and `d2=sqrt(R^2-q^2/4)`.
3. Construct both signed parallel offsets of the SUPPORTING LINE of the first ray at distance `d1`, and both of the second at distance `d2`. If an offset is zero the two nominal signed copies coincide and must be deduplicated.
4. Intersect one offset from each pair to obtain centers `C`, and draw circles `(C,R)`.
5. Retain only centers for which the ENTIRE prescribed chords lie on the actual rays: the perpendicular foot's directed distance from `V` must be at least `p/2` on the first ray and at least `q/2` on the second. If both intersections must be strictly beyond the vertex, use strict inequalities.

The half-chord right triangle gives `R^2=d_i^2+(length_i/2)^2`. Hence these offsets are necessary and sufficient on the two supporting lines. The ray filter is additionally necessary and sufficient on the angle's sides, rather than on their unbounded extensions. This construction includes every solution for this reading.

For an exact explicit filter, place `V=(0,0)`, ray `u` along the positive x-axis and ray `v` in direction `(cos(theta),sin(theta))`. Let the signed distances to the two lines be `s1*d1,s2*d2`, where `s1,s2` are independently `+1` or `-1`. Then

`C_y=s1*d1`,

`C_x=(s1*d1*cos(theta)-s2*d2)/sin(theta)`,

`C dot v=(s1*d1-s2*d2*cos(theta))/sin(theta)`.

Retain exactly those with `C_x>=p/2` and `C dot v>=q/2`. For a proper angle the linear equations have a unique center per signed pair. At a diameter boundary `R=p/2` or `R=q/2`, the relevant `d_i=0`; this is a diameter chord, not a zero-length chord.

Existence and nonuniqueness are substantive, not just an unknown-data complaint. Choose the interior signs `s1=+1,s2=-1`. As `R` increases, both foot distances are asymptotic to `R*cot(theta/2)`, which grows without bound for every proper angle. Thus all sufficiently large radii satisfy the strict ray filter; there are infinitely many admissible circles for ANY positive `p,q` and proper angle.

If `p=q=L>0`, equal chord lengths imply equal unsigned distances of the center to the two supporting lines. On the lines alone the centers lie on either angle-bisector line. Requiring BOTH full chords on the positive rays selects the positive INTERNAL bisector ray. Put the common line-distance `d>=0`; then the two foot distances are `d*cot(theta/2)`, and

`d>=(L/2)*tan(theta/2)`,

`R=sqrt(d^2+L^2/4)>=L/(2*cos(theta/2))`.

Equality is the circle through the vertex, with the other two intersections at distance `L`. Larger `d` gives a continuum with both chords strictly beyond the vertex. The external angle bisector has foot distances of opposite signs and cannot carry both positive full chords.

For coincident rays (zero angle), the full chord lengths must be equal; when equal there are infinitely many qualifying circles, when unequal there are none. For opposite rays (straight angle), a positive full chord cannot have both endpoints on each of the two opposite rays, so this full-chord reading has no solution. A zero chord-length would instead describe tangency to that side, a changed task; the offset formulas can be used conditionally with `p=0` or `q=0`, but ordinary two-point positive chord semantics must not be asserted. Negative lengths are invalid.

### Consequence for authoring

The literal text cannot choose between the vertex-distance and full-chord interpretations or justify a unique answer. An equal-length specialization does not by itself supply the missing vertex-incidence condition. No unconditional keyed unit is available here without clarification. Preserve all the conditional reasoning and record 378 as ambiguous, rather than silently adding "through the vertex" or choosing amounts.

Conceptual distinctions: endpoint-defined vertex segments versus full chords; line constraints versus ray constraints; equality of chords versus a supplied radius; unique determination versus a construction family.

## 379: construct circles tangent to a given circle and its tangent line

Let the given circle have `r>0`. Rename the given LINE `a` to `l` internally to avoid confusing it with a segment length. Let `T` be its contact with the given circle. Choose coordinates `l: y=0`, `T=(0,0)`, `O=(0,r)`. A requested circle is always distinct from the given circle and has positive radius.

### 379.1: prescribed contact M on the line

Task: construct a new circle tangent to `l` at the supplied `M` and tangent, internally or externally as allowed by the text, to `(O,r)`.

Write `M=(m,0)`. Tangency at `M` forces the new center to be `C=(m,s*R)`, where `R>0` and `s=+1` is the same side of `l` as `O`, `s=-1` the opposite side.

For external tangency, `OC=r+R` gives `m^2=2*r*R*(1+s)`. For internal tangency, `OC=abs(r-R)` gives `m^2=2*r*R*(s-1)`. These are exact necessary conditions; checking the positive-radius noncoincident solutions makes them sufficient.

If `M!=T` (`m!=0`), the only solution is SAME-SIDE and EXTERNALLY tangent, with

`R=TM^2/(4*r)`, `C=M+R*n_l`,

where `n_l` is the perpendicular unit direction pointing toward the half-plane of `O`.

Construction: obtain `T` by dropping the perpendicular from `O` to `l`; construct `TM^2/(4r)` by the fourth-proportional construction stated above; erect the perpendicular at `M` toward `O` and lay off `MC=R`; draw `(C,R)`. If the circle-circle contact is wanted, join `O,C` and take the point at distance `r` from `O` toward `C`. Since `OC=r+R`, it is also at distance `R` from `C`. No other side or internal branch can satisfy the equations when `m!=0`.

Special case `M=T`: there are infinitely many solutions, not one circle of radius zero.

- Opposite-side centers `C=(0,-R)`, ANY `R>0`, give external tangency at `T`.
- Same-side centers `C=(0,R)`, ANY `R>0` except `R=r`, give internal tangency at `T`. For `R<r` the new circle is inside the original; for `R>r` it contains the original.
- `R=r` on the same side is the given circle itself and is excluded as coincident.

If `TM=2r`, the unique nonshared-contact solution has `R=r`; it is a distinct equal-radius externally tangent circle, not coincidence. Changing the sign of `m` reflects the construction. As nonzero `m` approaches zero the unique branch's radius approaches zero; that limit does not replace the infinite family at exactly `M=T`.

If the supplied point is not on `l`, the stated contact requirement is impossible. Invalid `r<=0` is outside the premise.

Conceptual distinction: a prescribed line contact determines the center's normal line, but circle tangency determines both radius and side; the shared-contact case changes dimension.

### 379.2: prescribed contact M on the original circle

Task: construct a new circle tangent to `l` and tangent to `(O,r)` at the supplied `M`.

The input requires `M` to be on the original circle. Let `n=(M-O)/r`, `u=n_y`, so `M_y=r*(1+u)`. Tangency at `M` forces the new center onto line `OM`: write `C=M+t*n`, radius `R=abs(t)>0`. For `t>0` the new circle is externally tangent; for `t<0` it is internally tangent except when `t=-r`, which is the coincident original circle.

For `M!=T`, the contact has positive height, so a circle wholly on the opposite side of `l` cannot contain `M`. Thus `C_y=R`. If `t<0`, the equation `r*(1+u)+t*u=-t` gives `t=-r` whenever `u!=-1`: the only internal candidate is coincident and is excluded. If `t>0`, the same line-distance equation gives

`R=t=r*(1+u)/(1-u)=r*M_y/(2*r-M_y)`.

Let `U=(0,2r)` be the point of the original circle farthest from `l`.

For `M` different from BOTH `T,U`, one has `-1<u<1`. There is exactly one new circle, externally tangent at `M`, with center `C=M+R*n` beyond `M` along ray `OM`, and radius as above.

Pure geometric construction for this nonexceptional case:

1. Construct the tangent `k` to the original circle at `M` (perpendicular to `OM`).
2. Let `P=k intersect l`; these lines are nonparallel in this case.
3. Construct both angle-bisector lines of `k,l`. One contains `O`, since `O` is at distance `r` from each tangent line.
4. Intersect line `OM` with the OTHER bisector line to obtain `C`; draw radius `CM`.
5. Drop the perpendicular from `C` to `l` to locate its line contact.

Any desired center must be equidistant from the tangent lines `k,l` and lie on `OM`. The first bisector contributes only the excluded original circle; the second contributes the unique center just calculated. This proves the construction's completeness and that it is external, rather than merely asserting equal distances.

For `M=U`, there is NO distinct positive-radius solution. The tangent at `U` is parallel to `l`; the only circle tangent to both and also tangent to the original at `U` is the original itself. In the external formula the denominator tends to zero as `M` approaches `U`, giving an unbounded radius, not a finite exceptional circle.

For `M=T`, retain the full family explicitly: centers on the perpendicular to `l` through `T`, with any positive radius; opposite-side circles are externally tangent at `T`, same-side circles are internally tangent at `T` except that the original circle is excluded. The nonexceptional formula must NOT be applied at `T`; its derivation divided by `1+u`, which is zero there.

At either point with `M_y=r`, the nonexceptional solution has `R=r` and is externally tangent; the equal radii do not make the circles coincident. A point off the original circle cannot be its prescribed contact. Invalid `r<=0` is excluded.

Conceptual distinction: a prescribed circle contact fixes line `OM`, not a normal at an arbitrary line point. The shared-contact infinite family and opposite-contact nonexistence are essential parts of this source.

## 380: equal tangent lengths to two externally tangent circles

Let `r1,r2>0`, `O1O2=r1+r2`, and let `T` be their external contact. Put `T=(0,0)`, `O1=(-r1,0)`, `O2=(r2,0)`, and let a candidate point be `M=(x,y)`.

### 380.1: construct such a point

Construction: join `O1,O2` and locate their common contact `T`, at distance `r1` from `O1` toward `O2`. Erect the perpendicular line `l` to `O1O2` at `T` and choose ANY point `M` on it different from `T`.

The line `MT` is tangent to BOTH circles at `T`; both tangent segments have length `MT`. Also `MO_i^2=r_i^2+MT^2>r_i^2`, so `M` is strictly exterior to both circles, and all its tangent segments to either circle have length `MT`. This supplies actual constructible points without first assuming an entire locus or choosing a special midpoint.

If desired, construct the other tangent to either circle using its own diameter-circle procedure; its length is still `MT`. The question does not determine one unique point: the construction has a free nonzero distance from `T` on either side.

Boundary: choosing `M=T` produces only the common tangent line with zero contact segments. It qualifies only under the zero-length convention. No point inside either circle can have a real positive tangent segment to that circle.

### 380.2: construct and prove the entire locus

For a point with real tangent segments, square their lengths:

`L1^2=MO1^2-r1^2=x^2+y^2+2*r1*x`,

`L2^2=MO2^2-r2^2=x^2+y^2-2*r2*x`.

Equality gives `2*(r1+r2)*x=0`. Since the radii are positive, `x=0`. Thus every qualifying point is on the perpendicular to the center line through `T`, the common tangent at the contact.

Conversely any point `(0,y)` on that line has both powers equal to `y^2`. For `y!=0` it is strictly exterior to both circles, with positive tangent lengths exactly `abs(y)`; therefore all noncontact points of the line qualify. No extra removal for an interior-circle portion of this line is needed.

Complete locus:

- If zero-length contact segments count, the ENTIRE common tangent line at `T`.
- If tangent lengths are required to be positive from strictly exterior points, that line MINUS `T`, namely its two open rays.

External tangency makes `T` the only point on either circle that could also satisfy equal powers. Equal squared powers in general are not enough to establish real tangents, but on this derived line their common value is explicitly nonnegative.

If `r1=r2`, this line also happens to be the perpendicular bisector of `O1O2`. If `r1!=r2`, it is NOT that perpendicular bisector: it passes through the contact point at distances `r1,r2` from the centers. Equal tangent lengths are not equal center-distances when the radii differ. Zero radii or a nonexternal-tangency center distance violate the source premises and are not substituted into the classification.

Conceptual distinction: equality of tangent lengths is equality of powers, with a real-tangent domain check; the relevant line is through the external contact, not generally through the midpoint of the centers.

## Natural response units and production-skill losses

These are source-intent notes, not questions, option plans or a fixed item count. Printed markers do not dictate response units.

For 373, the four data sets pose genuinely different inverse constructions: hypotenuse/leg, two legs, adjacent acute angle/leg, and hypotenuse-altitude/leg. Their meaningful outcomes are complete construction descriptions WITH feasibility and limiting cases. Separate treatment is mathematically defensible because the determining relations differ, but a coherent cross-case construction/feasibility comparison could also retain the whole task. Splitting off each algebraic length or inequality would lose the construction reasoning. Any choice recognition loses producing perpendiculars, circles, intersections and angle copies, and writing the existence/uniqueness proof.

For 374, base-altitude data and equal-side-altitude data are independent inverse problems, not two blanks in the same calculation. A useful response unit must retain which side carries the altitude and, in 374.2, the external-foot obtuse case. Recognition cannot demonstrate actually constructing the isosceles triangle or deciding from one's own drawing when the foot lies on an extension. Treating `h` as the base altitude in both cases would erase the source's central distinction.

For 375, one complete interior/on/exterior classification is a natural unit, not three disconnected yes/no judgments. For 376, a complete case-dependent tangent construction is a natural unit. Combining these two sources could be justified if it retains both existence classification and the diameter-circle/perpendicular procedures; otherwise preserve the distinct tasks. Merely choosing the number of tangents does not cover 376's production task, and repeating that count would be redundant.

For 377, the complete locus with the right-triangle relation and converse is the mathematical unit. A radius-only arithmetic fragment would not establish the locus. Choosing a locus description does not demonstrate compass construction of its radius or producing the necessity-and-sufficiency argument. Preserve the explicit zero-length qualification if a boundary is included.

For 378, a meaningful unconditional response unit is DEFERRED because its incidence/segment meaning is missing. A later clarified task could use a complete construction plus uniqueness/family judgment, with line-versus-ray conditions retained. Choosing an added interpretation would not solve the original source. Production losses would include constructing chord offsets or a circumcircle, selecting valid ray intersections and proving the family; no such loss is currently being presented as approved coverage.

For 379, prescribed contact on the line and prescribed contact on the circle are different locus constraints on the unknown center. Each meaningful unit must keep its complete case structure: ordinary unique solution, shared-contact family, and in 379.2 opposite-contact nonexistence. Isolating one convenient generic radius loses substantive source work. Recognition loses constructing the fourth proportional or tangent/angle bisectors and validating both tangencies. A single generic "externally tangent circle" also discards the internal families allowed at the shared contact.

For 380, construction of an example point and proof of the full locus are coupled tasks deriving from one equality-of-powers relation. One coherent unit can retain both; the printed two parts do not force two questions. A response limited to naming the radical axis omits construction and real-tangent domain analysis. Recognition loses constructing the contact perpendicular and producing both directions of the locus proof. The zero-length convention changes exactly whether the contact point is included.

Across all eight sources, recognizing a valid completed construction is NOT evidence that the learner can produce that construction. Any future native choice conversion must state these concrete production losses internally, list substantive omissions in coverage, and block a unit if loss of construction ability defeats its purpose. No count quota or source-marker-based splitting has been applied.

## Handoff and reuse

Source solving is complete as a blind author checkpoint, including all supplied written clauses, their independently derived constructions, existence proofs and boundary cases. Source 378 remains an explicit missing-meaning blocker for unconditional downstream authoring. The zero-length tangent convention for 377 and 380 is retained conditionally; 374.2 uses the ordinary supporting-line altitude convention and records the alternate segment-only restriction.

The parent may later provide an OFFICIAL native seed under separate authorization. This document must be preserved and reused rather than rewritten or solved again if its mathematical projection matches:

- Same book and lesson.
- Same eight selected source numbers and EXACT exercise texts as the input; no altered or silently added source conditions.
- No added exercise figures or concept figures requiring interpretation.
- Same selected definition text, with an explicit mapping from projected `templateIndex=16` to the official native concept selector. Do not assume selector identity.
- A parent-established source/provenance match; the inherited template paths/hashes have not been opened or checked here.

Native seed/container hashes will differ from this preseed input hash by design. Do not equate them, manually fabricate a native seed, or redo unchanged mathematical solving simply because a later official container has a different digest. If genuine source facts change, preserve this sealed evidence and revise only the affected solving in a new separately authorized working artifact.

No options, draft, key, semantic review, official prepare invocation, canonical writes, finalization or spawning have occurred. The immutable seal is recorded by the adjacent manifest after actual `chmod 0444`, `stat` and byte-hash execution. This handoff is neither the other reviewer's evidence nor independent approval.
