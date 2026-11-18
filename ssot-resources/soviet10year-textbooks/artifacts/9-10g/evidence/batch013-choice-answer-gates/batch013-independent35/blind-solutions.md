# Same184-3 n35 independent blind seed solutions

Phase: completed before opening any draft projection, draft key, answer key,
author solution or author report. Only seeds 324-329 and concept block 5 are
choice inputs. Whole exercise 330 is excluded, including its solved tasks.
Reviewer: fresh authorized independent agent, not an author of these artifacts.

## Actual assets observed (2 images, no reopens)

- fig-129 durable SVG SHA-256:
  `63d77196152757221fc09a25473b14903af8c297dc5b1b730298dc27dde09e7f`.
  Opened the complete
  `.tmp/s10y-image/batch012-n35-129130/fig-129/initial/full-preview.png`,
  SHA-256 `d10297b9d010db5259538476476c7d0812d80ccdbce80f14e0cdecfb5756105b`.
  Its generating SVG matches the durable SVG byte-for-byte; its generating spec
  matches the durable spec byte-for-byte, SHA-256
  `4b34509317b34548e53a28ccbb8f9bb459590ec685acf9b26fb666787d001ef1`.
  The complete cuboid has front A,B,A1,B1 and back D,C,D1,C1; bottom
  AB,BC,CD,DA; corresponding vertical edges. The rightmost B/B1 and bottom
  A/B are present, as are the dashed hidden DC,CC1,CB edges.
- fig-128 durable SVG SHA-256:
  `13c4a74211ecd858085024e3c3124e45732b4b495a0e296aeb08c105570c7d0b`.
  Independently rendered directly from that SVG into
  `.tmp/s10y-choice/batch013-independent35/fig-128.current.png`,
  SHA-256 `19a65789e36298c0b1253f896ea8c949512915ff30a52994e758280b1b122555`.
  Complete 640 by 500 bounds: lower plane alpha contains intersecting a and b1
  at M; upper parallel plane beta contains b and N,D; MN is perpendicular to
  b at N and to a at M; DD1 is another perpendicular between planes; CD is an
  oblique connector. D1,M and the bottom alpha boundary are visible.

## 324

Set A=(0,0,0), B=(x,0,0), C=(x,y,0), D=(0,y,0), and append
height z>0 for each indexed vertex. All x,y,z are positive.

1. A1D1 is y-directed and BB1 is z-directed. A1B1 is x-directed,
   joins A1 to B1 on the respective lines, and is perpendicular to both.
2. DC is x-directed and B1C1 is y-directed. CC1 is z-directed,
   meets DC at C and B1C1 at C1, and is perpendicular to both.
3. CC1 is z-directed and AB is x-directed. BC is y-directed,
   meets CC1 at C and AB at B, and is perpendicular to both.

The requested common perpendiculars are the segments A1B1, CC1, BC,
or their supporting lines where the terminology asks for a line. Mere
directional perpendicularity without meeting the two given lines is insufficient.

## 325

Let the line perpendicular to alpha meet alpha at P. Skewness implies P
is not on the line l contained in alpha. In alpha drop PQ perpendicular to l.
Since PQ lies in alpha it is also perpendicular to the other line at P.
Thus the common perpendicular lies in alpha, not merely parallel to alpha.
Conversely a common perpendicular to the alpha-normal line has alpha-parallel
direction and meets l in alpha, so the entire common perpendicular is in alpha.

## 326

For a cube with side a>0 use A=(0,0,0), B=(a,0,0), D=(0,a,0).
The base diagonal BD has x+y=a,z=0. Its closest point to A is
O=(a/2,a/2,0), the intersection AC intersect BD. AO is perpendicular
to BD (directions (1,1,0) and (-1,1,0)) and perpendicular to AA1.
Construction: draw both base diagonals, mark O, and join A to O.
Distance |AO|=sqrt((a/2)^2+(a/2)^2)=a/sqrt(2)=a sqrt(2)/2.
The endpoints are A and the base center O, not A1 and a top-face center.

## 327

A1D is parametrized by (0,ta,a(1-t)); BC1 by (a,sa,sa).
Let P be the midpoint of A1D and Q the midpoint of BC1. Then
P=(0,a/2,a/2), Q=(a,a/2,a/2).
PQ has direction (1,0,0), meets both given lines at their midpoints, and
is perpendicular to their directions (0,1,-1) and (0,1,1).
Construction: bisect those two face diagonals and join their midpoints.
Distance |PQ|=a. If a face has area 2 cm^2, a=sqrt(2) cm and the
distance is sqrt(2) cm, not sqrt(2) cm^2 or a face-diagonal length.

## 328

Let M,N be the midpoints of opposite edges AB,CD in the regular
tetrahedron, a>0. In equilateral ABC and ABD,
MC=MD=sqrt(3)a/2 and CM,DM are perpendicular to AB. Therefore the
plane CMD is perpendicular to AB, so MN is perpendicular to AB.
In isosceles CMD its median MN is perpendicular to CD.
Hence MN is the common perpendicular with endpoints M,N.
MN^2=MC^2-CN^2=3a^2/4-a^2/4=a^2/2, so distance=a/sqrt(2).

## 329

Let d=|MN|>0 and O=(M+N)/2. Let n=(N-M)/d be a unit normal
to gamma. Since both skew-line directions are perpendicular to MN,
every X on the first line has signed height (X-O).n=-d/2, and
every Y on the second has height (Y-O).n=d/2.
For Z(t)=(1-t)X+tY, its height is d(t-1/2).
It vanishes uniquely at t=1/2, so gamma intersects every such segment
XY at its midpoint. This proves the universal statement, not just that
gamma bisects the particular common perpendicular MN.

## Concept block 5

MN meets each given line and is perpendicular to it, rather than merely
having a direction perpendicular to both. In fig-128 the parallel planes
through a and b have separation |MN|. Every connector has normal
component of this magnitude; its length is at least |MN|, strictly larger
unless its tangential component vanishes. For skew lines there is a unique
common-perpendicular connector, which realizes the minimum distance.
