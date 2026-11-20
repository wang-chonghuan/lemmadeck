# Independent source solutions, before alternatives

Scope: current final modern `9-10g/geo910-c2-s2-n47`, written seeds 49--54 only.
These are author derivations, not imported answers or a semantic review. No
alternatives or correct-option identifiers existed when this file was written.

## Conventions and holds

Use the selected lesson definitions: a polyhedron includes its closed boundary
and interior; an edge belongs to two faces; a spatial diagonal joins vertices
not sharing a face. Block 18 restricts the subsequent study to convex polyhedra.
When reasoning about convexity, use its usual segment characterization, stated
explicitly in the authored question rather than claiming a missing definition
paragraph was in this lesson.

The current text prints `49°`. Its historical circle-marker meaning remains
UNKNOWN. It is not a regularity condition, angle, difficulty label, or permission
to modify the task. Existing source-glyph and source all-ink HOLDs are preserved;
no exact-label recovery or source-wide certification is attempted.

## 49: smallest number of faces

In a convex polyhedron, each edge of a chosen face meets a different neighboring
face: two different supporting face planes intersect on at most one straight
line, so one neighbor cannot supply two different sides of the chosen polygon.
A face has at least three sides, hence at least three other faces are necessary:
the total number of faces is at least four. A tetrahedron attains four.
Its four vertices give six vertex-pair edges; every vertex pair shares a face.
The requested result is tetrahedron, six edges, four vertices, zero spatial
diagonals. This does not require equal edge lengths or a regular tetrahedron.

## 50: quadrilateral or pentagonal face in a five-face solid

A pyramid over a convex quadrilateral has one quadrilateral base and four
triangular lateral faces, for five faces; this is an explicit existence witness.
A pentagonal face would have five edges, requiring five distinct adjacent faces
in addition to itself, hence at least six faces. Thus a five-face convex
polyhedron can have a quadrilateral face, but cannot have a pentagonal face.
No completeness classification of all five-face polyhedra is needed.

## 51: minimal number of edges with a hexagonal face

The hexagonal face supplies six boundary edges and six vertices. At each such
vertex, at least three edges meet in a nondegenerate convex polyhedron. Its two
boundary edges are in the face plane; an additional edge must leave that plane.
This is not a face diagonal. An additional edge cannot join two base vertices,
because then it would lie in the supporting face plane. Thus at least six
distinct non-base edges are required, so the total is at least twelve.
A pyramid over a convex hexagon has exactly six base edges and six apex edges,
attaining twelve. The lower bound plus an attaining solid settles minimality.

## 52: construct solids with eight and nine edges

An explicit eight-edge construction is a convex quadrilateral in a plane and
an apex outside that plane; join the apex to all four vertices, include the
quadrilateral face and all four triangular faces. There are four base plus four
apex edges, total eight.

For nine edges, translate a nondegenerate triangle to a parallel plane, joining
corresponding vertices and including two triangular and three lateral faces.
The triangular prism has three plus three triangle edges and three connectors,
total nine. Another construction places two apices on opposite sides of a
triangle, with the line between apices passing through its interior, and takes
the convex hull. Its six triangular faces, three equatorial edges and six apex
edges give a triangular bipyramid with nine edges. The equatorial triangle is
internal, not an additional exterior face.

Textual construction specifications and counts are supplied independently.
No actual drawing, material model, or newly generated diagram is produced.
Recognition of these specifications cannot certify that the learner drew them.

## 53: intersection and union

Let P and Q be convex and suppose P intersection Q is a polyhedron. For any
points x,y in the intersection, both points belong to P and Q, so the entire
segment [x,y] belongs to each. It therefore belongs to their intersection.
The first proposition is true.

For the second, take P=[0,2]x[0,1]x[0,1] and
Q=[0,1]x[0,2]x[0,1]. Each is a convex rectangular box; their union is a solid
L-shaped prism with a closed polygonal boundary, hence a polyhedron. Points
x=(2,1,1/2) and y=(1,2,1/2) belong to the union, while their midpoint
(3/2,3/2,1/2) belongs to neither box. The union is not convex; the second
proposition is false. Merely intersecting in a face or an edge is irrelevant
to the first proposition, whose hypothesis already requires a polyhedron.

## 54: two inclinations and the area of a net

Pixel inventory, original first: A lower right, B right middle, C left upper,
D lower left, E top, F between A and E. Eight solid links are AD, DC, CE, EB,
BA, AF, FE, FD; CB is dashed. Thus the boundary faces are ABCD, ABEF, ADF,
BCE and CDEF. The current 480 PNG shows the same six labels and nine links,
with all extremities and labels visible. No angle or answer markings occur.
Exact lengths and perpendicularity come from the current written task, not
from measuring the perspective image.

ABEF has cyclic order A-B-E-F and parallel bases AB and EF. Since AB=a,
EF=a/2 and BE=FA=a/2, it is an isosceles trapezoid. Each horizontal offset is
(a-a/2)/2=a/4; its height h satisfies
h^2=(a/2)^2-(a/4)^2=3a^2/16, so h=sqrt(3)a/4.

Use A=(0,0,0), B=(a,0,0), D=(0,a,0), C=(a,a,0),
F=(a/4,0,h), E=(3a/4,0,h). The trapezoid plane is perpendicular to the
square plane along AB. The angle of AF to ABC is arctan(h/(a/4))=60 degrees.

The common line of planes ABC and CDF is CD. In a perpendicular cross-section
the horizontal distance from CD to EF is a, not a/4 or a/2. Therefore the
acute plane angle theta satisfies tan(theta)=h/a=sqrt(3)/4, equivalently
cos(theta)=4/sqrt(19).

Area ABCD=a^2. Area ABEF=3sqrt(3)a^2/16.
The distance of F from AD is |AF|=a/2, since AF is perpendicular to AD;
area ADF=a^2/4. Similarly area BCE=a^2/4.
The slant height between CD and EF in plane CDEF is sqrt(a^2+h^2)
=sqrt(19)a/4, so area CDEF=3sqrt(19)a^2/16.
All five faces contribute. Cutting a net does not stretch the faces; its area
is their sum, S=3a^2(8+sqrt(3)+sqrt(19))/16.

No net is drawn and no independent proof-writing ability is certified.
