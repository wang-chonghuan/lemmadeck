# Independent source solving, before alternatives

Author: n38-choices-author7. Scope: all 18 written exercises 488--505.
No choices, answer keys, prior answers, interactions, keyboards, other workers,
standards evidence or old ticket outputs were consulted.
Canonical seed digest: 0ce7f246bc37e82a440c45a1365c209606a51cf4f8f937515bc2dbf539c8e4ed.
Book identity supplied by caller: book6-8g; actual artifact selector: 6-8g.
Seed paragraphs: 1,4,14,15,16,20,24,25. Proof paragraphs are NOT definitions.

## Source and image observations

The whitelist inspect returned exactly 488--505, not supplements 506+.
The original literal UNKNOWN tokens in 493 are retained in seed.json: they
replace printed subpart labels, not any mathematical condition.
Modern responses will order the three conditions by equals, greater, less,
and definitions separately by obtuse, right, acute.

One batch of four actual complete canonical SVG renderings was opened:

- fig-238: full 640x420; M,A,N on upper horizontal line, K,C,L on lower
  horizontal line; A and C lie to the left of B; AB and BC form a bent
  path pointing right. N and L, and bottom K,C,L, are visible.
  SVG hash 55560bd68f1f2793821ee64d449ff8ad34fb9e39f570d35d283124c2586c5df2.
- fig-232: full 640x520; shaded convex A-B-C-D-E-F, A near bottom,
  AF extended through A to G on the left. Interior BAF is shaded-side,
  exterior BAG is its adjacent supplement. E,F and bottom A,G visible.
  SVG hash 87aa5fc3a37dee5ce32e638233cd7d221a30dc19fa85fd0080114968363f2f05.
- fig-233: full 640x500; AB horizontal below C; MN horizontal through C;
  AC continues to F at upper right and BC to H at upper left. Labels
  1 at A, 2 below C, 3 at B, and 4,5,6 above C are legible. N,F and
  bottom A,B visible. This is current proof context for 491, not a definition.
  SVG hash d7a5de660494b40fb783e4c3640c2d856d73380ad4a1e381fdc0989b0621ef5d.
- fig-234: full 640x400; A,C,D collinear left to right; B above and right
  of C. Exterior BCD lies outside triangle ABC, adjacent to C; A and B
  are the nonadjacent interior angles. D and bottom A,C,D visible.
  SVG hash 0445cfdc1e507fa8141a296e366a44c369037b6910220237a6d23330c80474b1.

PNG captures are full renderings, not original scans, crops, or thumbnails.
No image spec/render/review was read as visual evidence. No new figures needed.

## Conventions derived or made explicit

Triangle angles are positive and sum to 180 degrees (paragraph 4).
An exterior angle is the nonreflex adjacent supplement (paragraph 1),
not the reflex angle. Its size is 180 minus its adjacent interior.
For counting exterior angles, select ONE at EACH DISTINCT vertex of a
convex polygon, as in paragraph 25. Selecting both exterior angles at
one obtuse triangle vertex would give two acute exteriors and makes
the unqualified literal claim in 497 false. The counting restriction
must be visible; it is not silently inferred away.

From paragraph 20 at n=3 and paragraph 4, 2d=180 degrees, hence
d=90 degrees. Paragraph 24 then gives 4d=360 degrees, also equal to
the sum of the two triangles cut by a quadrilateral diagonal.
Thus S=180(n-2), n=S/180+2, and n is an integer at least 3.
No missing angle-unit convention was assumed.

## 488: proportional angles

Task: determine all three ordered angle triples for all three ratios.
For positive ratio a:b:c, set angles ak,bk,ck and obtain
k=180/(a+b+c).
1:2:3 gives k=30 and (30,60,90) degrees.
3:7:8 gives k=10 and (30,70,80) degrees.
1:1:3 gives k=36 and (36,36,108) degrees.
Distinction: a ratio sets relative sizes, not degrees or an equal split.
Choice recognition loses independent production of the scaling calculation.

## 489: two equal corresponding angles

Let A=A' and B=B'. Then C=180-A-B and C'=180-A'-B',
so C=C'. No equality of sides or congruence of the entire triangles
is necessary. They can be different-sized similar triangles.
Task: supply a proof, not just recall that the conclusion is true.
Recognizing a complete subtractive proof loses writing that proof.

## 490: triangle made by the three parallels

C=180-25-68=87 degrees.
Define l_A through A parallel BC, l_B through B parallel AC,
l_C through C parallel AB; P=l_B intersect l_C, Q=l_C intersect
l_A, R=l_A intersect l_B. Parallel angle transfer gives the
correspondence (P,Q,R)=(A,B,C), hence (25,68,87) degrees.
For explicit existence/placement, take A=0, B=u, C=v for independent
vectors u,v. Then P=u+v, Q=v-u, R=u-v. Rays at P are -2u and
-2v, so their angle equals A; rays at Q are 2u and 2(u-v),
which are simultaneously reversed versions of the rays at B;
the third angle follows the sum. These coordinates are derived
verification, not extra facts introduced into the source.
Recognition must retain the geometric angle correspondence, not only 87.
Lost production: constructing the three parallels and deriving the transfer.

## 491: dependencies of the actual current proof

Only this task uses the whitelist's current proof prose, blocks
8,10,11,12, as TASK CONTEXT. They were not selected as definitions.
Current sequence: through C construct MN parallel AB; extend AC
and BC; use same-direction ray pairs for 1=4 and 3=6; use vertical
angles for 2=5; add the equalities and use straight angle MCN.

Needed dependency families:
1. The parallel-through-an-exterior-point axiom licenses construction
   of MN. The proof needs existence; uniqueness is part of the usual
   axiom but is not a separate equality step used here.
2. Angles whose corresponding rays have the same directions are equal
   (the current proof explicitly cites section 37).
3. Vertical angles are equal, for 2=5.
4. Additivity of adjacent angle measures and straight-angle measure
   180 degrees, for 4+5+6.
Extending rays is a basic construction, not an application of triangle
congruence. The exterior-angle theorem and polygon-angle-sum theorem
are not upstream dependencies; deriving this theorem from those later
results would be circular.
Lost production: recalling and explaining dependencies without a supplied list.

## 492: can an exterior be smaller than an interior?

For adjacent interior A, e=180-A. Thus e<A iff A>90.
Example triangle (120,30,30): the exterior adjacent to 120 is 60,
which is smaller than 120. However e=B+C is strictly larger than
each of its two nonadjacent interiors B and C, since both are positive.
Task requires the existential answer and the adjacent/nonadjacent distinction.
Recognizing an example loses independently constructing one.

## 493: definitions and three relation cases

Definitions, in original first-part order:
obtuse triangle: one interior angle is greater than 90 degrees;
right triangle: one interior angle equals 90 degrees;
acute triangle: every interior angle is less than 90 degrees.
Paragraph 14 precludes a second right/obtuse angle.

Let the specified interior be A and the other two B,C.
A=B+C with A+B+C=180 gives 2A=180, A=90: right triangle.
A>B+C gives 2A>180, A>90: obtuse triangle.
A<B+C gives 2A<180, A<90: ONLY A is forced acute.
Triangle type is not determined: (A,B,C)=(60,60,60),
(40,90,50), (40,100,40) give acute, right, obtuse examples,
all satisfying the less-than relation.
UNKNOWN label tokens are a glyph transcription issue; no condition is missing.
Lost production: independently wording definitions and producing counterexamples.

## 494: every pair sums to more than 90

For each complementary third angle C, C=180-(A+B)<90.
Applying the hypothesis to all three pairs gives A,B,C<90,
so the triangle is acute. Conversely an acute triangle has every
two-angle sum greater than 90. One pair alone would not suffice.
Lost production: independently writing the quantified complement argument.

## 495: all pairwise smaller angles of altitude and bisector lines

Set A=60, B=72, C=48 degrees. Name altitude lines h_A,h_B,h_C
and internal bisector lines b_A,b_B,b_C.
Rotating two side directions by 90 degrees preserves the smaller
line angle. Because all original angles are acute:
h_A/h_B -> C=48; h_B/h_C -> A=60; h_C/h_A -> B=72.

For intersection I of internal bisectors at A,B, triangle AIB has
angles A/2,B/2,180-(A+B)/2=90+C/2 at I. The *smaller*
angle between the complete bisector lines is its supplement,
90-C/2. Repeat cyclically:
b_A/b_B -> 66; b_B/b_C -> 60; b_C/b_A -> 54 degrees.
Complete ordered table: (48,66), (60,60), (72,54), where each
row is (altitude smaller angle, bisector smaller angle).
Lost production: constructing six lines, deriving both angle rules,
and computing all values without candidate tables.

## 496: isosceles exterior 100, all cases

Its adjacent interior is 80 degrees.
If it is the apex, the other two are (180-80)/2=50:
unordered interior triple {80,50,50}.
If it is a base angle, the other base angle is 80 and apex
180-160=20: unordered triple {20,80,80}.
Both are positive and satisfy the supplied exterior condition.
The vertex is unspecified, so neither case can be discarded.
Lost production: independently discovering and solving the case split.

## 497: two acute exteriors at distinct vertices

Take one exterior at each vertex. Acute exteriors e_A,e_B<90
would force A=180-e_A>90 and B=180-e_B>90, hence
A+B>180, contradicting positive C and A+B+C=180.
Important qualification: if two exteriors at the SAME vertex count
as two, the literal statement fails for (120,30,30), whose two
exteriors at the 120-degree vertex both measure 60.
A faithful choice must explicitly state the distinct-vertex convention
and record inability to endorse the unrestricted reading.
Lost production: creating the contradiction argument; unrestricted
same-vertex multiplicity claim is NOT asserted as proved.

## 498: classification from two exterior conditions

1. Acute exterior e<90 gives adjacent A=180-e>90: obtuse.
2. e equals an interior angle. It cannot equal B or C, since
   e=B+C>B,C. Therefore it equals its adjacent A, so
   180-A=A, A=90: right.
Task needs to exhaust which interior could equal the exterior,
not assume without explanation that equality is adjacent.
Lost production: independently eliminating the nonadjacent possibilities.

## 499: bent transversal across parallel lines

Use the actual fig-238. Through B introduce the left-pointing
ray BX parallel MN and KL. It lies strictly inside angle ABC.
Parallel angle transfer gives angle ABX=angle NAB and
angle XBC=angle BCL. Angle addition then gives
angle ABC=angle ABX+angle XBC=angle NAB+angle BCL.
A numerical check is not proof; taking a supplement at B would
use the outside sector and be wrong for this figure.
Lost production: finding/drawing the auxiliary ray and writing the proof.

## 500: four polygon sums

S=180(n-2). In n-order 10,12,30,96:
180*8=1440; 180*10=1800; 180*28=5040;
180*94=16920 degrees.
Task is a coherent complete forward map, not four independent clicks.
Lost production: executing the four forward computations without choices.

## 501: invert four sums

n=S/180+2. In supplied order 1080,1620,3960,1800:
6+2=8; 9+2=11; 22+2=24; 10+2=12.
All are integers >=3.
Lost production: deriving and applying the inverse equation.

## 502: equal interior angles

If every interior is a, na=180(n-2), hence
n(180-a)=360 and n=360/(180-a).
For 144,150,170,171 degrees, exterior increments are
36,30,10,9 degrees, giving n=10,12,36,40.
Equal angles do not require assuming equal sides; regular polygons
provide existence examples for each n.
Lost production: deriving the equation and calculating the complete map.

## 503: exterior counting, convex and one per vertex

All chosen exteriors are positive and sum to 360 degrees.
Five right exteriors alone total 5*90=450>360, so more than
four is impossible. Four right exteriors can occur (rectangle).
Four obtuse exteriors total strictly more than 4*90=360,
so more than three is impossible. Three obtuse exteriors can
occur (equilateral triangle: each exterior 120).
These are statements about distinct vertices, not both choices at each
vertex or arbitrary nonconvex signed/reflex exterior conventions.
Lost production: independently constructing both strict-sum contradictions.
The unrestricted polygon/multiplicity interpretation is not claimed.

## 504: feasibility including d

Use d=90 derived above, not an assumed convention.
S/180 must be a positive integer, n=S/180+2.
9180: 51+2=53, possible.
3600: 20+2=22, possible.
2040: 34/3+2=40/3, impossible integer side count.
11d=990: 11/2+2=15/2, impossible.
18d=1620: 9+2=11, possible.
Existence: for each integer n>=3, a convex regular n-gon has
sum 180(n-2); no individual-angle or perimeter condition is added.
Lost production: independently deriving the unit, integrality and existence.

## 505: alternate proofs, both theorems

Triangle alternative: complete a parallelogram, rather than extend
two sides through C and invoke vertical angles as the current proof does.
Through B draw a parallel to AC; through C draw a parallel to AB;
let D be their intersection, giving convex quadrilateral A-B-D-C.
At A the corner is original A. By parallel lines cut by AB, the
interior corner ABD is 180-A. Ray BC is inside that corner.
Angle CBD equals original C by parallelism BD||AC.
Thus angle ABD=B+C and 180-A=B+C, hence A+B+C=180.
The parallelogram angle sum theorem is NOT invoked, nor a result
depending on the triangle sum. Only parallel angle transfer,
supplementary angles and addition are used. This is a two-parallel
completion/corner-splitting argument, not the current
same-direction-plus-vertical-angle proof on fig-233.

Polygon alternative: from one vertex V_1 of a convex n-gon draw
diagonals to V_3,...,V_(n-1). Convexity keeps them within it;
they partition it without overlap into n-2 triangles.
Their corner angles partition precisely the polygon's interior
angles; no new interior point and no full-turn subtraction occur.
Sum=(n-2)*180=2d(n-2).
This is vertex triangulation, not an interior-point fan with n
triangles and a subtraction of the angles at O.

Both independent proofs are completely solved here. Choice recognition
can check complete alternative arguments but cannot establish that a
learner invents, constructs or writes a new proof. That production
task remains a named capacity loss, never claimed performed.

## Completion boundary

All 18 mathematical source tasks have independent solutions above,
including both proofs in 505 and all subcases. No alternatives or keys
had been drafted when this file was created. This file is sealed 0444
before draft.json is authored. Semantic review and retention belong
to the parent, not this author.
