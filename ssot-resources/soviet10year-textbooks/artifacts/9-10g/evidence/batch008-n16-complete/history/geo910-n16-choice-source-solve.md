# n16 Source-Solve Checkpoint

Author-only independent mathematics. Written before any option artifact.
Seed canonical SHA-256: `59d912e291e3e89f3d965d408a680d9dbb0627c6f34575c070e4ed2f05f7b43d`.
Authority: the official prepare projection of finalized modern lesson
`9-10g/geo910-c1-s2-n16`, exercises 164-167, definition blocks 1, 4, 10, 12.
No answers, earlier choices, interactions, precursor lessons, worked examples,
source solutions, services, environment files or database were consulted.

## Definition and Image Checkpoint

Block 1: rays on distinct parallel supporting lines are same-direction when
they enter the same half-plane cut by the line through their origins, and
opposite-direction when they enter different half-planes.
Block 4: on one supporting line, a ray intersection means same-direction;
an intersection that is not a ray means opposite-direction.
Block 10: at any specified origin there is exactly one ray in each of the two
directions determined by a given ray.
Block 12: same-direction is reflexive, symmetric and transitive.
Blocks 9 and 11 were not selected: they contain a construction/proof rather
than a needed definition. Figure 65 is not needed to use block 12's stated
relation, and figure 64's construction is not needed here.

Figure 62 actual SVG SHA-256:
`8a354c8ddb5eaa82fa378ce195a2da624145278f4c0e3b7a1e357c9b72a43d2c`.
The complete Quick Look rendering of the unchanged SVG, through a padded
HTML image wrapper, is `geo910-n16-choice-images/fig-62-complete.html.png`.
Panel a shows two distinct parallel supports, origins O1/O2 on a transversal,
h1/h2 pointing into the same half-plane alpha1, and endpoints A1/A2 at right.
Panel b shows distinct parallel supports with opposite arrow orientations,
origins on the transversal, h1 in alpha1 and h2 in alpha2. Both panel captions,
all right-hand labels and the bottom boundary are visible in the complete
rendering. The first direct thumbnail cropped the bottom b caption and is not
the complete-image evidence. The AppKit rendering mishandled CSS variables
and is not mathematical/visual evidence.

Figure 63 actual SVG SHA-256:
`a9df63a0b977d008267baf7697e070ff9e7288bba0941d5c61a7021b9d24f7ea`.
Complete rendering: `geo910-n16-choice-images/fig-63.svg.png`.
Four rows a-d, all visible. Row a has different origins and both arrows right:
the intersection is the right-hand ray. Row b has the left origin's ray going
left and the right origin's ray going right: empty intersection. Row c points
inward from the two distinct origins: the intersection is their closed
segment. Row d has coincident origins and opposite arrows: intersection is
the common point. The rightmost arrows, labels, left row letters and bottom
origin label are all visible.

One image batch, four loaded images total (including the cropped and
incompatible attempts); no image-bearing delegation or reopens. Only figures
62 and 63 were selected. Exercises 164/165 have no source figure. No original
was fabricated; no new candidate diagram is needed.

## 164: Nondegenerate Tetrahedron

Given A, B, C, D noncoplanar, hence distinct, no face triangle is degenerate.
The objects are the entire rays [AB), [AC), [AD), [CD), not finite edges.
Determine whether any two distinct listed rays have either direction relation.

There are exactly six unordered pairs:

| Pair | Supporting-line argument | Direction result |
| --- | --- | --- |
| AB, AC | Distinct lines intersect at A | Neither |
| AB, AD | Distinct lines intersect at A | Neither |
| AC, AD | Distinct lines intersect at A | Neither |
| AC, CD | Distinct lines intersect at C | Neither |
| AD, CD | Distinct lines intersect at D | Neither |
| AB, CD | They cannot intersect or be parallel: either would place A,B,C,D in one plane | Neither |

Same/opposite directions require coincident or parallel supports. A common
origin or an intersection at an edge endpoint is not such a relation.
Conclusion: no same-direction pair and no opposite-direction pair.
Response unit: one complete proof judgment, not two unreasoned yes/no clicks.
Recognition cannot demonstrate independently discovering or writing this proof.

## 165: General Oblique Parallelepiped

Use the conventional cyclic face ABCD with corresponding face A1B1C1D1.
Let A=0, B=u, D=v, A1=w, where u,v,w are linearly independent.
Thus C=u+v, B1=u+w, D1=v+w, C1=u+v+w.
Do not assume perpendicular axes, equal lengths, or a rectangular solid.

Direction displacements for the full literal list:

| Ray | Displacement |
| --- | --- |
| AB | u |
| AD | v |
| AA1 | w |
| BC | v |
| C1D | -u-w |
| BB1 | w |
| C1C | -w |
| A1D1 | v |

In particular C1D means origin C1 and endpoint D, NOT endpoint D1.
Independence makes -u-w neither a positive nor a negative scalar multiple
of u, v or w. Its visible slope in a projection is irrelevant.

Independently enumerate ALL 28 unordered pairs, not selected answer targets:

| Pair | Result |
| --- | --- |
| AB, AD | Neither |
| AB, AA1 | Neither |
| AB, BC | Neither |
| AB, C1D | Neither |
| AB, BB1 | Neither |
| AB, C1C | Neither |
| AB, A1D1 | Neither |
| AD, AA1 | Neither |
| AD, BC | Same |
| AD, C1D | Neither |
| AD, BB1 | Neither |
| AD, C1C | Neither |
| AD, A1D1 | Same |
| AA1, BC | Neither |
| AA1, C1D | Neither |
| AA1, BB1 | Same |
| AA1, C1C | Opposite |
| AA1, A1D1 | Neither |
| BC, C1D | Neither |
| BC, BB1 | Neither |
| BC, C1C | Neither |
| BC, A1D1 | Same |
| C1D, BB1 | Neither |
| C1D, C1C | Neither |
| C1D, A1D1 | Neither |
| BB1, C1C | Opposite |
| BB1, A1D1 | Neither |
| C1C, A1D1 | Neither |

Same-direction equivalence groups in the list: {AB}, {AD,BC,A1D1},
{AA1,BB1}, {C1C}, {C1D}. Their internal unordered pairs give exactly four
same-direction pairs: AD/BC, AD/A1D1, BC/A1D1, AA1/BB1.
The +w group versus the -w singleton gives exactly two opposite-direction
pairs: AA1/C1C and BB1/C1C. There are no others.

Response units: two native multiple selections, one for same-direction
enumeration and one for opposite-direction enumeration. Every qualifying
pair must be offered; false pair candidates can be partitioned between the
two units so all 28 unordered pairs are considered once. This is not an
anchored request to find a mate for a preselected target.
Loss: recognizing offered pairs does not demonstrate freely generating the
complete pair list; a neither-direction pair is tested against one nominated
relation, not through a learner-written proof excluding both.

## 166: Nontransitivity and Two-Opposite Proof

These are two mathematical tasks: refute a universal relation law with a
specific witness, then prove the relation between two rays opposite a third.

Three DISTINCT witness rays on the x-axis:
h1={(x,0,0): x>=0}, h2={(x,0,0): x<=1},
h3={(x,0,0): x>=2}; origins 0, 1, 2 respectively.
The intersection h1 cap h2 is the closed segment 0<=x<=1, not a ray.
h2 cap h3 is empty, not a ray.
h1 cap h3 is x>=2, a ray.
Hence h1 is opposite h2 and h2 is opposite h3, but h1 is same-direction
with h3, not opposite. Opposite-direction is not transitive. This witness
does not reuse h1 as h3 or rely on reflexivity alone.

For arbitrary rays r,s opposite a ray t, parallel-transport their directions
to one specified origin O. The transported r and s are both the unique ray
at O opposite the transported t (block 10). They coincide there, so the
original rays have the same direction. Equivalently, if d is a nonzero
direction vector for t, r and s have positive scalar multiples of -d.
The claim concerns same direction, not equality of original ray sets;
origins can differ and supports can be distinct parallel lines.
Response units: one full witness/relationship judgment and one full proof
judgment. Recognition cannot demonstrate inventing the witness or composing
the proof.

## 167: Complete Support/Origin Classification

AB and MN are same-direction; CD and MN are opposite-direction. Thus
AB and CD are opposite-direction. Each ray has two distinct defining points;
between the two rays, shared origins A=C are allowed.
Their supports have parallel direction vectors, so they are either the
same line or distinct parallel lines. Skew supports and distinct intersecting
supports are impossible.

For distinct parallel supports: they are coplanar, have different origins,
and the rays are disjoint.

For a common support, choose its increasing coordinate in the AB direction,
write A=a, C=c. Then AB={x>=a}, CD={x<=c}.

| Support/origin case | Intersection |
| --- | --- |
| Distinct parallel supports | Empty; coplanar |
| Same support, c<a (rays point away from the intervening gap) | Empty |
| Same support, c=a (common origin) | Exactly {A}={C} |
| Same support, c>a (rays point into the intervening interval) | Nondegenerate closed segment [A,C] |

These cases are exhaustive. In the last case C lies on AB beyond A, and
A lies on CD beyond C. In the disjoint same-line case each origin is
outside the other ray. An intersection ray, identical ray sets, a noncoplanar
parallel pair, and a crossing of nonparallel supports are excluded.
Response unit: one native multiple selection of realizable complete
support/origin descriptions, retaining all four cases.
Loss: no independently drawn spatial configurations or independently written
exhaustiveness proof is assessed.

## Boundary at This Checkpoint

This is author reasoning, NOT a semantic review or an approval. Learner-only
views and the internal draft will be separate later artifacts. The user
authorized exactly one structural validator invocation after the draft and
explicitly prohibited self-semantic review, durable approval and publishing.
