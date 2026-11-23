# FIRST-written: independent source solving, exercises 373-380

Ticket STEMROBIN-188; OFFLINE SAME188-6; lesson geo68-c2-s4-n30.
Third distinct review scope, same sole reviewer, no new agent.
This file precedes any reading of candidate keys or author derivations.
It is an independent mathematical baseline, not approval of unseen answers.

Workspace:
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`.
Only the new directory
`.intentfold/tickets/STEMROBIN-188/tmp/n30-text-and-eight-answers-independent-review-18/`
is writable.

## Source binding and preserved earlier decisions

Only this source-only bundle was read for the written-exercise derivation:
`.intentfold/tickets/STEMROBIN-188/tmp/n30-content-independent-inputs-18/source-only.json`.
Its actual SHA-256 matched
`6a8066d5f6690346c14ddd057511cb5b0df38546231c9597946f168f5cf746c4`.
It supplies eight statements, with 4+2+1+1+1+1+2+2 = 14 answer subparts.
The referenced raw exercise hash is
`af6dd36b6cdb719829a25acfdef3d43fea81ee3242bb078b2f88af4da77493ff`;
that raw file has not been opened at this source-solving stage.
The original lesson reference is
`92a311c2288f91002e758afff754cb58bbd45572bb748b0c9993ed9b119ca06e`;
the original whole lesson likewise has not been opened at this stage.

The prior worked-example c proof and the two exact source-bound errata PASS
are reused, not re-solved or reopened. Their existing bindings are
FIRST SHA-256
`8164179023d7bb42e5a70dc9d1a70778a1eab604e307a3652c0db88c15884c07`
and approval SHA-256
`cc2e3c763aa6c8f253325d5b5dca1445b2db7a9383fefda6ea69a127a07fa1cf`.
The authorized input identifies the metadata-registered source139 hash as
`8bca101c2f4174e88ce9d9eaab404abb9b37841ffcdccecaa08645dd7dc32cbd`.
Verification of native bindings and modern text belongs to the post-seal
comparison, not this derivation.

No images were opened. Literal old source C, glyph UNKNOWN, oblique/scan
damage, role UNKNOWN, prior failure records, and all unrelated holds remain.
In particular, neither this derivation nor a later text/answer verdict
approves figures 190-193 or page visuals.

## Conventions

Triangles and circles are nondegenerate unless a boundary case is explicitly
being discussed. Given segment lengths and circle radii are positive.
An altitude to a side is perpendicular to its supporting line; its foot
may lie on the side's extension for an obtuse triangle.
Mirror-image triangle placements are different placements but one congruence
class. A request to construct an object need not have a unique solution.
Coincident circles are not two circles tangent at one point.

For tangents from a point, distinguish tangent lines from lengths of tangent
segments. A point on a circle has one tangent line but zero distance to its
own contact point. If a locus requires strictly positive tangent segments,
that boundary point must be removed; if zero lengths are allowed, it remains.
No unstated endpoint convention is silently substituted for the source.

## 373.1: hypotenuse c and leg b

Source `p0141#5`, first subpart.
Choose right vertex C, known leg BC=b, and hypotenuse AB=c.
Draw BC, the perpendicular through C, and the circle centered at B of
the given radius c; choose either perpendicular/circle intersection as A.
This is the hypotenuse-leg construction already justified by the retained
worked-example proof, with the exercise's leg name b.

Existence is exactly c>b>0. The other leg is sqrt(c^2-b^2).
There are two mirrored placements for fixed BC, one congruence class.
At c=b, A=C is degenerate; at 0<c<b, there is no intersection.
Zero or negative inputs do not yield the required nondegenerate triangle.
This exercise application does not reopen the two earlier errata decisions.

## 373.2: legs a and b

Source `p0141#5`, second subpart.
At a point C draw two perpendicular rays, mark CB=a and CA=b, and join A,B.
Every a>0,b>0 gives a nondegenerate right triangle. The hypotenuse is
sqrt(a^2+b^2). Reflecting one ray choice gives congruent placements;
the positive pair of leg lengths determines one congruence class.
A zero leg collapses vertices; negative segment lengths are invalid.
Equal positive legs give an ordinary isosceles right triangle, not a failure.

## 373.3: leg a and its adjacent acute angle beta

Source `p0141#5`, third subpart.
Set BC=a, angle C=90 degrees, and angle B=beta. Draw BC, the perpendicular
through C, and a ray from B making beta with the ray BC on either side.
Their intersection is A.

Exactly a>0 and 0<beta<90 degrees produce a finite nondegenerate triangle.
The other leg is a*tan(beta), and the hypotenuse is a/cos(beta).
Each chosen half-plane has one intersection; the two half-plane placements
are congruent. Beta=0 collapses the triangle. Beta=90 gives parallel lines
and no finite intersection. Nonacute beta is not the stated datum.
There is no need to invent an additional angle or side.

## 373.4: leg a and altitude h to the hypotenuse

Source `p0141#5`, fourth subpart.
Put C=(0,0), B=(a,0), and A=(0,x), with a,x>0.
The area identity gives
h = a*x/sqrt(a^2+x^2).
Consequently
x = a*h/sqrt(a^2-h^2),
AB = a^2/sqrt(a^2-h^2).
Thus finite nondegenerate existence is exactly 0<h<a.

Construction: draw BC=a and the perpendicular p through C. Draw the helper
circle centered at C of radius h. Construct the two tangents to this helper
circle from B, using the circle with diameter BC to obtain their contact
points H. Each tangent line BH meets p at one A.
Then CH=h is perpendicular to BA, so it is precisely the required altitude.
The two A placements are mirrored; one congruence class results.
For positive legs the altitude foot is inside the hypotenuse segment.

At h=a, the only helper-circle tangent at B is parallel to p; there is
no finite triangle. For h>a there are no tangents from B to that circle.
At h=0 the triangle is degenerate. Hence h=a must not be called a valid
tangency solution or included by a weak h<=a condition.

## 374.1: equal side b and altitude h to the base

Source `p0141#6`, first subpart.
In an isosceles triangle the altitude from the apex bisects the base.
Draw AD=h, draw the perpendicular base line through D, and intersect that
line with the circle centered at A of radius b. Its two intersections are
the base endpoints B,C, which must both be used.

Exactly 0<h<b gives a nondegenerate triangle, with base
BC = 2*sqrt(b^2-h^2).
It determines one congruence class. At h=b the base endpoints coincide;
at h>b there is no intersection; h=0 is flat/degenerate.
Choosing just one base intersection twice is not a valid isosceles triangle.

## 374.2: base a and altitude h to an equal side

Source `p0141#6`, second subpart.
Let the base be BC=a, the apex be A, the equal side length be s,
and the apex's altitude to the base be t>0.
Then s^2=t^2+(a/2)^2. Equating the two area formulas gives
a*t = s*h.
It follows that
t = a*h/(2*sqrt(a^2-h^2)),
s = a^2/(2*sqrt(a^2-h^2)).
Thus finite nondegenerate existence is exactly 0<h<a, with one congruence
class. The strict upper bound h<a cannot be replaced by h<=a.

Equivalently, if theta is either base angle, then
sin(theta)=h/a and 0<theta<90 degrees.
Construct a right triangle with hypotenuse BC=a and perpendicular
distance BH=h to a ray from C. The ray CH makes the acute angle theta
with CB. Its intersection with the perpendicular bisector of BC is A.
Joining A to B produces the required isosceles triangle. Reflection
across BC gives the other placement, not a second congruence class.

The foot H on line CA need not lie on segment CA:
CH=a*cos(theta), while CA=a/(2*cos(theta)).
H is on that side segment exactly when theta>=45 degrees, equivalently
h>=a/sqrt(2). For 0<h<a/sqrt(2), the apex angle is obtuse and H is beyond A.
Those obtuse triangles are valid under the usual supporting-line altitude
definition; their exclusion would add a restriction absent from the source.
At h=a/sqrt(2), H=A and the apex is right angled, still nondegenerate.
At h=a no finite apex exists; at h=0 the triangle collapses.

## 375: number of tangent lines through A

Source `p0142#1`.
Let d=OA and let r>0 be the given circle radius.
If d<r, no tangent line through A exists.
If d=r, exactly one exists: the perpendicular to OA at A.
If d>r, exactly two exist, with two distinct contact points.
This includes d=0 among the inside cases.
For an outside point the common tangent-segment length is sqrt(d^2-r^2);
at d=r it is zero, but the number of tangent lines is nevertheless one.
Radius zero is not a circle admitted by the problem.

## 376: construction of tangents through a given point

Source `p0142#2`.
For an external point A, construct the midpoint K of OA and the circle
with diameter OA. Its intersections T1,T2 with the given circle are
the two contact points: angle OT_iA is right by Thales. Join A to each.
This constructs both tangent lines, and no others.

For A on the circle, construct the perpendicular to OA at A directly.
The diameter-circle method has T=A in this case and cannot define a line
by joining A to itself. For an inside point there is no tangent to construct.
The complete answer must distinguish these finite cases rather than make
the outside-point construction unconditional.

## 377: locus for prescribed tangent-segment length a

Source `p0142#3`.
For a>0 and given radius r>0, the right triangle formed by the center,
contact point, and external point P yields
OP^2=r^2+a^2.
Therefore the locus is the entire concentric circle of radius
sqrt(r^2+a^2). Every point of it is outside the given circle and has two
tangent segments of the prescribed length a. Necessity and sufficiency
both hold.

If zero tangent lengths are allowed as a boundary convention, a=0 gives
the original circle. If only positive tangent segments are admitted,
there are no points for a=0. A negative length is not an admissible datum.
The ordinary fixed positive length case needs no extra source assumption.

## 378: fixed intercepted segments on the sides of an angle

Source `p0142#4`, exact statement:
"378. 求作圆周, 使在已知角两边上所截取的线段为定长."

Take a genuine angle with vertex V and rays u1,u2, with
0<theta<180 degrees. The text does not explicitly say that two fixed
lengths are equal, nor does it require the circle to pass through V.
It also does not explicitly name the intercepted endpoints.
These are genuine wording distinctions; the existence of several circles
is instead ordinary construction nonuniqueness, not source corruption.

A safe usable standard answer is available, without inventing givens.
Name the prescribed segment lengths l1,l2>0; if the intended datum is
one common length l, take l1=l2=l as the special case. Mark P on the first
ray with VP=l1 and Q on the second with VQ=l2. Construct the perpendicular
bisectors of VP and VQ, take their intersection O, and draw the circle
centered at O through V. V,P,Q are noncollinear, so this is a unique finite
circle for that deliberate construction choice.
Its full chords on the two angle rays are exactly VP and VQ.
Thus it satisfies both separately prescribed full-chord lengths and
the common-length special case, as well as the vertex-to-point reading.
Passing through V is a chosen permissible solution, not an additional
given condition and not a claim that every solution passes through V.

For completeness, all circles having prescribed full chords wholly on
both closed rays can be parameterized. Put V at the origin and set
k=|O|^2-R^2, the power of V. For intersection distances s on ray ui,
s^2-2*(O dot ui)*s+k=0.
The chord length li implies
(O dot ui)^2-k=li^2/4.
Both endpoints on the ray imply k>=0 and
O dot ui = sqrt(k+li^2/4).
Conversely, for any k>=0, these two dot-product equations determine
one finite center O because the rays are noncollinear. Define
R=sqrt(|O|^2-k)>0. The roots on each ray are
sqrt(k+li^2/4) +/- li/2, both nonnegative, so this circle has exactly
the requested full chords. This proves the whole family, not just existence.
k=0 is the V,P,Q construction. k>0 gives both chord endpoints strictly
beyond V, if such a non-vertex convention is desired. That stricter
endpoint convention is not explicitly in the source.

For equal common length l, the permitted centers lie on the internal
angle-bisector ray:
O=t*e, t>=l/(2*cos(theta/2)),
R^2=t^2*sin(theta/2)^2+l^2/4.
If chord endpoints must be strictly beyond V, make the t inequality strict.
The external bisector does not give two full positive-ray chords of
positive length: its projections have opposite signs.
For supporting lines rather than rays there are additional sign branches;
they are not automatically solutions on the angle's actual sides.

If the source instead means distances measured from V to selected
intersection points P,Q, then centers of circles through P,Q form their
perpendicular-bisector line; the V,P,Q circle is one valid selection.
If V must lie strictly inside the circle so each ray has only one positive
intersection, select the part of that center line with power k<0.
This is a different convention, not a reason to force it into the source.

The finite prerequisites are positive required lengths and a noncollapsed,
nonstraight angle. Zero chord length is tangency rather than an intercepted
positive segment, and theta=0 or 180 degrees makes V,P,Q collinear.

Decision for later key review: do not leave 378 at status-only UNKNOWN.
Accept a standard construction valid for arbitrary prescribed l1,l2 with
the common-length case stated conditionally, or another rigorously valid
construction under an explicitly identified reading. Do not silently
require equal lengths as a general datum or require every circle to pass
through V. Do not reject a valid chosen solution merely because the
problem has infinitely many solutions. If a key supplies only the equal
length/bisector case without making that scope explicit or covering
separately prescribed lengths, revise that key locally rather than
invent a new constraint in the source. Arbitrarily placing four chord
endpoints and asserting they are concyclic is not a valid construction.

## 379.1: tangency to the given circle and to its tangent line at M

Source `p0142#5`, first subpart.
Let the given tangent line be y=0, original center O=(0,r), radius r>0,
and original contact point T=(0,0). Write the given line point M=(m,0).
A new circle tangent to the line at M must have center
X=(m,s*R), where R>0 and s is +1 or -1.

For external circle tangency,
|OX|=r+R,
so m^2+(s*R-r)^2=(r+R)^2, giving m^2=2*r*R*(s+1).
For internal circle tangency,
|OX|=|r-R|>0,
giving m^2=2*r*R*(s-1).
The strict positive center distance excludes coincident circles.

If M is not T, then m!=0. Only the external, same-side case s=+1
is possible, with the unique radius
R=m^2/(4*r).
Construct R by a fourth-proportional construction from r and |MT|/2,
erect the perpendicular at M on the same side as O, mark MX=R,
and draw the new circle. No circle on the opposite side or internally
tangent distinct circle satisfies the same data for m!=0.
The circle-circle contact point is on OX between the centers, not
generally M.

If M=T, there are infinitely many solutions, not none:
- Centers below the line, X=(0,-R), for every R>0: external tangency at T.
- Centers above the line, X=(0,R), for every R>0 except R=r:
  internal tangency at T, either circle containing the other.
The above-line R=r choice is the original circle and is excluded.
Radius zero is invalid. These families exhaust both line-side and
circle-tangency branches.

## 379.2: tangency to the given circle at M and to the given tangent line

Source `p0142#5`, second subpart.
Now M is a prescribed point on the original circle. Keep O=(0,r),
the line y=0, and T=(0,0). Let U=(0,2*r), the circle point opposite T.
Let n=(M-O)/r be the unit outward radial vector, with q=n_y.
Every circle tangent at M has center X=M+t*n and radius R=|t|,
where t!=0. The value t=-r gives X=O,R=r, the coincident original
circle, and is not a solution.

Tangency to y=0 requires
|r*(1+q)+t*q|=|t|.
For -1<q<1, the two algebraic possibilities are
t=r*(1+q)/(1-q)>0 and t=-r.
The latter is excluded as coincident. Hence for M different from T and U
there is exactly one distinct circle, externally tangent at M, with
R=r*(1+q)/(1-q)=r*y_M/(2*r-y_M).
Its center X lies on ray OM beyond M, and y_X=R>0, so it is on the
same side of the tangent line as the original center.
There is no additional distinct internal or opposite-side solution.

Constructively, draw the tangent b to the original circle at M,
perpendicular to OM. If b and the given line meet, construct both
angle-bisector lines. Their intersections with line OM give the original
center O and the distinct new center X; use the latter and radius XM.
The radius/proportional formula gives an alternative explicit
straightedge-and-compass construction.

If M=T, the tangent lines coincide and the solution families are exactly
the two infinite families in 379.1 at T.
If M=U, the two tangent lines are parallel, y=0 and y=2*r. A circle tangent
at U with center on OU and also tangent to y=0 can only be the original
circle. Therefore no distinct finite circle solves this case.
An infinite limiting radius is not a circle solution.
The prescribed point must actually lie on the original circle; radius
zero and coincident circles remain inadmissible.

## 380.1: find a point with equal tangent-segment lengths to two circles

Source `p0142#6`, first subpart.
Let r1,r2>0 and the externally tangent circles have centers O1,O2
with d=O1O2=r1+r2. Let T be their shared contact point.
Construct the line L through T perpendicular to O1O2; it is their
common tangent at T. Choose any M on L with M!=T.
The segment MT is tangent to each circle and has the same positive
length for both. All tangent segments to each circle from that M
have that same length, so this gives a valid requested point.
There are infinitely many such points, not one distinguished point.

If zero contact lengths are allowed, T itself is also a boundary solution.
If both tangent segments must be strictly positive, T must not be chosen.
This convention affects only that point, not the rest of L.

## 380.2: full equal-tangent-length locus

Source `p0142#6`, second subpart.
Take O1=(0,0), O2=(d,0), T=(r1,0), and M=(x,y).
For real tangent segments the squared lengths are the powers
x^2+y^2-r1^2 and (x-d)^2+y^2-r2^2.
Equality gives
2*d*x=d^2+r1^2-r2^2=2*r1*d,
so x=r1. On this line both powers equal y^2.

Therefore every point on L has real nonnegative equal tangent lengths,
equal to |y|=MT, and there are no other points. The locus is the entire
common tangent L if zero tangent lengths are permitted.
For strictly positive tangent segments, the locus is L without T,
equivalently its two open rays starting at T.
It is not generally the perpendicular bisector of O1O2 when r1!=r2;
it is the radical axis through the external contact point.
The externally tangent hypothesis makes every non-T point of L strictly
outside both circles, so no other portions need to be cut out.
Coincident circles, radius zero, and non-external tangency are different
problems and must not be smuggled into this source.

## Completeness ledger and post-seal scope

Independent subparts:
373.1, 373.2, 373.3, 373.4;
374.1, 374.2;
375, 376, 377, 378;
379.1, 379.2;
380.1, 380.2.
Total eight written supports and fourteen subparts.
No key, current modern candidate, author solution, post-FIRST bundle,
answer support, renderer output, original image, or source page visual
has been opened for this derivation.

After chmod 0444 and actual stat/SHA sealing, the authorized post-FIRST
bundle may be read. The later comparison must test each answer against
this baseline and its current modern statement, not derive a new baseline
from the candidate. Modern 28-entry prose, formula fidelity, the already
approved two corrections, native source139 metadata, Latin subfigure
labels, and boundary anchors are separate post-seal text checks.
No whole-text, answer, or figure approval is claimed at this point.

Image counts remain: 2 charged attempts of 8 in the retained batch,
2 context loads of 24, 2 successful opens, 0 image failures, 0 crops,
0 reopens. New attempts/loads in this third scope: 0.
Parent remains permanently 24/24; no image payload is returned.
Prior non-image exit-1 failures: 2, retained unchanged by reference.
Prior phase2 index/newline exploratory false negatives remain recorded
as recovered probes, not rewritten into content verdicts.
All command executions so far in this third scope have exit code 0.
