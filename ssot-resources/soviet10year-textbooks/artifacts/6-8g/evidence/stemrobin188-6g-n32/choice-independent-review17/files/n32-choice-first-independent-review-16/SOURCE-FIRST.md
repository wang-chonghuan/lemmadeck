# SOURCE FIRST: SAME188-6 independent choice semantic review

Written before opening post-FIRST.json, any question view, any author solution,
key, rationale, grading or interaction. This is a fresh, nonfork reviewer, not
the author or the prior code/surface reviewer. Scope is offline review only.

## Bound inputs and actual observations

- source-only.json SHA256: 0cb6bb893388981cc45e14fc9974e3b23568bedeb3b7edcd4f3df0eaa9657af7.
- Unmodified formal seed raw SHA256: f4f84696ce28d72f64ced2fdcef4c4266ae2f9d0bbf68ab339c077335e4dd778.
- Supplemental definition/theorem projection SHA256: 4a9a21bc38e5e6d17200d7b467038d6552fcd2b29ecf83c3b0941fd52f09e68e.
- Actually opened original fig-208.png, SHA256 a87ef68e5938055d0d8c87753b319b64fa0cb4c19209c72135cdee15581eadfa.
- Actually opened the supplied existing complete 1280 by 1488 white raster,
  SHA256 28e6ae883786e87936176166bc0567cf4bcaba42d49b19722055c72874ba013b,
  representing current fig-208.svg, SHA256 971ee90792f601f7bcc221d92febbb8c6d95a3f2915ce310edb38544d343ada2.

The original and complete current image each show two distinct oblique parallel
lines, upper a and lower b, crossed by steeper c. At a intersect c the cyclic
sectors are 1 upper/right acute, 2 lower/right obtuse, 5 lower/left acute,
6 upper/left obtuse. At b intersect c they are 8 upper/right acute,
7 lower/right obtuse, 3 lower/left acute, 4 upper/left obtuse. The rightmost
b label and line end, upper a label and line end, both intersections, all
eight labels, and the bottom c continuation are visible in the complete
current rendering. The lower 3 and 7 are not cropped. Single arcs occupy the
acute sectors and double arcs the obtuse sectors at both crossings. No
numerical angle measurement is given. No missing ninth sector or additional
intersection is inferred. The current image preserves the observed sector
assignment and relevant parallel/transversal geometry of the original.

Only two image-loading attempts have occurred, both successful; charged=2/8,
context=2/24, parent new images=0. No crop, reopen, render, browser replay,
new figure, model call, installation or production command occurred.

## Conventions and named statements

All lines below are in the source's plane. Supplemental N31 block 0 explicitly
defines parallel as having no common point OR coinciding. Thus parallel is
reflexive and "parallel lines" alone does not assert distinctness. N31 block 3:
centrally symmetric lines are parallel. N31 block 16: lines perpendicular to
the same line are parallel. N32 block 1 gives uniqueness at most one parallel
through a point; it does not alone establish existence. N32 block 2 transfers
intersection from one parallel line to the other. N32 block 6 says a
perpendicular and an oblique to a line intersect. N32 block 8 gives parallel
transitivity. N32 block 15 says parallel lines are centrally symmetric; for
coincident lines every point on that line is a possible center, not an
arbitrary point of the plane. For distinct parallel lines the centers of
their union lie on the midway parallel line.

Half-turn about O is H_O(X)=2O-X. It preserves each unoriented line direction,
maps a line to a parallel line, and leaves a line setwise fixed exactly when
O lies on that line. These observations settle the central-symmetry tasks
without imposing a non-source spacing or distinctness condition.

## 432: existence and uniqueness at an arbitrary point

Task: prove exactly one parallel to a given line l through arbitrary planar P,
including P on l. If P is on l, l itself is parallel to l by the supplied
definition. Any other line through P intersects l at P and is neither equal
to l nor disjoint, so is not parallel. If P is off l, construct a perpendicular
n to l through P and the perpendicular m to n through P. N31 theorem 40
implies m parallel l (both perpendicular to n). N32 parallel axiom makes m
unique. This proves existence separately from the at-most-one axiom, not by
relabeling "at most one" as "exactly one." Coincidence resolves the on-line
case. The response must retain arbitrary-point scope; requiring P off l
without admitting the omitted on-line case changes that scope.

## 433: common parallel to two intersecting lines

Task: determine whether one line can be parallel to each of distinct
intersecting a,b. Impossible. If m parallel a and m parallel b, N32 corollary 3
gives a parallel b, contradicting their unique intersection and distinctness.
Equivalently at a intersect b uniqueness of the parallel through that point
would force their coincidence. Choosing m equal to a does not evade the
contradiction, since a is not parallel to the distinct intersecting b.

## 434: five implications, including counterexamples

1. a parallel a: true by the coincidence branch of the definition.
2. a parallel b implies b parallel a: true because disjointness and coincidence
   are symmetric.
3. a parallel b and a parallel c implies b parallel c: true by corollary 3,
   including coincidences.
4. a perpendicular b and b perpendicular c implies a perpendicular c: false.
   Both a and c are perpendicular to b, so they are parallel, not perpendicular.
   Explicit counterexample: a is y=0, b is x=0, c is y=1.
5. a intersects b and b intersects c implies a intersects c: false.
   The same three lines provide a counterexample: the first and third are
   disjoint parallel horizontals, each intersecting the vertical.

True statement indices are exactly {1,2,3}; {4,5} are false. All five are
meaningful relationship checks; isolated per-statement questions would risk
fragmentation. The mathematical mistakes for 4 and 5 are distinct.

## 435: relation properties

Parallel on the planar set of lines is reflexive, symmetric and transitive,
by the three arguments in 434(1)-(3). Consequently it is an equivalence
relation partitioning lines by unoriented direction. Reflexivity depends
essentially on the supplied convention. Under the distinct-disjoint-only
definition reflexivity would fail, but that is not this source's definition.
This task overlaps exactly with the first three positive statements of 434;
splitting those into a second equivalent recognition question could duplicate
the tested judgment. The overlap must be assessed from the later views, not
presumed to require nine separate questions.

## 436: transfer of intersection

Given a parallel b and b intersects c, a intersects c, by N32 corollary 1.
If a coincides with b the conclusion is immediate. Otherwise c cannot have
their common direction, hence has a unique intersection with each. Neither
parallelism nor perpendicularity of a,c follows; the conclusion is
intersection, without a guaranteed right angle. Example y=0, y=1, c:y=x
exhibits an oblique intersection. A perpendicular transversal is also allowed.

## 437: acute-angle sides and their supporting lines

Let the acute angle at V have 0<theta<90 degrees, and let r,s be the full
supporting lines of its two sides. Let m be perpendicular to r. If m were
parallel to s, then a line parallel to a perpendicular to r would itself be
perpendicular to r, making the angle between r and s 90 degrees, a
contradiction. Thus m and s are not parallel and meet at exactly one point.
This is also N32 corollary 2: s is an oblique to r, m a perpendicular to r.
It does not guarantee m perpendicular to s.

Scope must be explicit. Treating a side as its supporting line gives the
unconditional conclusion above. If the original statement is instead read
literally as rays, and "perpendicular to one side" includes that the foot
actually lies on that ray, choose the first ray x>=0,y=0 and the other
(u cos theta,u sin theta), u>=0. Then m:x=t with t>=0 meets the other ray at
(t,t tan theta), so the literal ray conclusion also holds, including t=0.
If perpendicularity refers only to the first supporting line and t may be
negative, intersection with the second RAY is not guaranteed: x=-1 crosses
the second supporting line behind V. A question must not mix that weak
supporting-line premise with a guaranteed ray conclusion. Explicit
supporting-line language is a mathematically justified disambiguation of
the line-relations theorem, not a reason by itself to fail a choice question.
It does not test ray-position/foot restrictions unless these are added.

## 438: all ten relationships and positional names

Let U=a intersect c and W=b intersect c. Half-turn about the midpoint of UW
swaps a,b and preserves c. It maps sectors (1,3), (2,4), (5,8), (6,7);
these pairs have equal measures. Vertical-angle equalities at U are
1=5 and 2=6; at W they are 8=3 and 7=4. Adjacent linear pairs sum to 180.
Set alpha=angle 1. Then the complete sector assignment is

angle 1=angle 3=angle 5=angle 8=alpha;
angle 2=angle 4=angle 6=angle 7=180-alpha.

The observed source is acute/obtuse, but no exact alpha follows from pixels.
For a general parallel-transversal theorem alpha need not be a fixed
measurement and might be 90 in a perpendicular case; no false alternative
should rely on excluding 90 unless the visible question does so.

Full independent proofs of each printed request:

1. 1=3: half-turn swaps their sectors (alternate exterior).
2. 1=8: 1=3 from (1), and 3=8 are vertical; corresponding.
3. 6=7: direct half-turn equality (alternate exterior).
4. 3=5: 3=1 from (1), and 1=5 are vertical; corresponding.
5. 4=6: 4=7 are vertical, and 7=6 from (3); corresponding.
6. 7=2: 7=6 from (3), and 6=2 are vertical; corresponding.
7. 5=8: direct half-turn equality (alternate interior).
8. 2=4: direct half-turn equality (alternate interior).
9. 2+8=180 degrees: 8=1 from (2), and 2+1 is a linear pair;
   same-side interior.
10. 7+1=180 degrees: 7=2 from (6), and 2+1 is a linear pair;
    same-side exterior.

The four corresponding pairs are {1,8}, {6,4}, {2,7}, {5,3}.
Alternate interior pairs are {2,4}, {5,8}; alternate exterior pairs
{1,3}, {6,7}. Same-side interior pairs {2,8}, {5,4}; same-side exterior
{1,7}, {6,3}. Interior sectors are upper-crossing {2,5} and
lower-crossing {4,8}; exterior sectors {1,6,3,7}. Corresponding is positional,
not "any equal acute angles"; 1 and 5 are vertical, not corresponding.
The source footnote explicitly names corresponding and alternate interior
angles, so preserving only numerical relations without these positional
distinctions would lose a selected source task.

## 439: full numbers AND loci, without unconditional count invention

For parallel lines written n dot X=t_i, a half-turn changes the offset to
2(n dot O)-t_i. The union is centrally symmetric exactly when its SET of
distinct offsets S satisfies 2(n dot O)-S=S. Repeated named lines do not
create extra geometric components. This both gives centers and proves their
exhaustiveness.

1. Two parallel lines: if distinct with offsets u<v, every point of the
   midway line n dot O=(u+v)/2 is a center, and no other point is. Count:
   infinitely many. If coincident at u, the union is one line and the
   centers are precisely that line (again infinitely many). One selected
   midpoint of two points is not the complete locus.

2. Three lines with at least two parallel:
   - Three distinct, with a,b parallel and c transverse: the center must
     lie on c (its direction is unique and it must map to itself) and on
     the midway line of a,b (they must swap). Their intersection is the
     unique center. Count one.
   - Three distinct all parallel: after sorting offsets u<v<w, a center
     must swap the outer two and preserve the middle. This requires
     v=(u+w)/2, exactly equal adjacent gaps. If equally spaced, every
     point on the middle line is a center, count infinitely many.
     If gaps differ, there is no center, count zero.
   - If names are allowed to coincide, reduce to the set of distinct
     lines. One distinct line: all its points, infinitely many. Two
     distinct parallel lines: the midway line, infinitely many. Two
     distinct intersecting lines (the stipulated parallel pair is a
     coincident pair): their intersection alone, count one.
   Therefore the premise alone does NOT imply an unconditional one,
   zero, or infinitely-many answer. Both third-line direction and
   spacing/possible coincidence must be handled or visibly conditioned.

3. Two arbitrary lines:
   - Distinct intersecting: unique center, their intersection. Because
     half-turn preserves direction, the two lines cannot swap and must
     each contain the center.
   - Distinct parallel: infinitely many, exactly the midway parallel line.
   - Coincident: infinitely many, exactly the common line.
   Two distinct lines in this plane never give zero centers. Treating
   parallel coincident lines as two separate geometric lines is unsound.

These cases fully answer the original scope and center loci. A restricted
question may be defensible if it explicitly conditions the case and records
the other omitted cases; it may not claim to settle the unqualified original.

## 440: full parallelogram result

For the nondegenerate quadrilateral with opposite sides parallel, consecutive
angles are supplementary and opposite angles equal. Therefore
A=30 degrees, B=150 degrees, C=30 degrees, D=150 degrees.
Opposite sides are equal (e.g. diagonal AC produces equal alternate interior
angles in triangles ABC and CDA, and their common side AC gives congruence).
Thus AB=CD=2 cm and BC=DA=4 cm. The full answer in vertex/side order is
(30,150,30,150) degrees and (2,4,2,4) cm.
No right-angle or equal-all-four-sides conclusion follows; perimeter is
12 cm but was not requested. A complete coherent table can test the coupled
angle/side rule, though recognizing one does not demonstrate constructing
the written derivation.

## Source-first coverage criteria fixed before views

Account for all nine sources; merged 434/435 can be appropriate. Check exact
arbitrary-point scope in 432, impossibility in 433, counterexamples in 434,
relation properties in 435, intersection without right-angle inflation in
436/437, all ten proofs and the named positional classes in 438, conditional
center counts and complete loci in 439, and all four angles and sides in 440.
Recognition and loss of independent written proof production are not automatic
failures. Essential omitted reasoning, data copying, equivalent repeated
questions, visible inter-question answer transmission, and false
unconditional conclusions are failures. No question/key judgment has yet
been made; no author internals have been read.
