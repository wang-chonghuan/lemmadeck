# N41 Author Derivations, Frozen Before Draft Construction

Role: author only. No semantic review has been performed. Inputs are the current modern written prose, selected statements, promoted FigureSpecs/SVGs and original PNGs. No answer source was read.

Seed canonical SHA-256: `95c9a0045c4efdf10214c888dcf652a004eab553b3ca6d8e691863336d86e903`.

## Task Decomposition and Independent Solutions

### 391

Determine realizability separately for all three proposed triples. Nondegenerate trihedral face angles must satisfy the strict triangle inequalities and sum less than 360 degrees; paragraph 12 also states sufficiency.

The triple (100,120,10) fails because 120 exceeds 100+10. The triple (80,50,30) fails because 80 equals 50+30, a flat limiting configuration, not a trihedral angle. The triple (125,120,115) satisfies strict triangle inequalities but sums to 360, another excluded limiting configuration. None can form a nondegenerate model. The response must preserve all three diagnoses, not merely the final common "no".

### 392

Find the full open interval for each independently given pair. For pair (b,c), require |b-c|<x<b+c and x<360-b-c, with x<180 automatically satisfied by the effective upper bounds here.

For (70,80), the interval is 10<x<150 degrees; the sum bound x<210 is inactive. For (100,120), it is 20<x<140 degrees; the sum bound is stronger than x<220. All endpoints are excluded. Treat both pair-specific bounds together as a complete two-case response.

### 393

Interpret "all faces are right angles" as all three face angles equal 90 degrees, not as an additional hypothesis about dihedrals. Three unit edge vectors are mutually perpendicular. At each edge, the other two directions lie in a plane perpendicular to that edge, so they themselves give the linear angle of the relevant dihedral. Thus every dihedral equals 90 degrees.

### 394

Prove acuteness for each face angle, not just for their mean. If alpha+beta+gamma=180 degrees, paragraph 0 gives alpha<beta+gamma=180-alpha, whence alpha<90. The same argument applies to beta and gamma. Positivity of nondegenerate face angles yields 0<alpha,beta,gamma<90.

### 395

Let the target sum be angle ACB + angle CBD + angle BDA + angle DAC. The two triangles ABC and ABD being in different planes makes A,B,C,D noncoplanar. In the trihedral at C, angle ACB < angle ACD + angle DCB. In the trihedral at D, angle BDA < angle BDC + angle CDA. Adding the two target's remaining terms gives

target < (angle ACD+angle CDA+angle DAC) + (angle DCB+angle BDC+angle CBD) = 180+180=360.

Both local inequalities are strict because of noncoplanarity. The response must preserve the two different vertices and the reassembly into triangles ACD and BCD.

### 396

Take the common edge of the two 45-degree faces as the z-axis. At unit length along the other edges, A=(1/sqrt(2),0,1/sqrt(2)) and B=(0,1/sqrt(2),1/sqrt(2)); the 90-degree dihedral is the orthogonality of the transverse x and y directions. Their dot product is 1/2, so the third face angle is 60 degrees. Equivalently, |AB|=1 for |SA|=|SB|=1. The response should connect this result to the spatial projection, not add 45+45.

### 397

For point A at distance a>0 on one edge, choose B and C at the same distance a on the other two. The three 60-degree face angles imply AB=AC=BC=SA=SB=SC=a. Triangle SBC is equilateral. Equal distances from A to S,B,C make its perpendicular projection H the circumcenter, hence centroid, of SBC. SH=a/sqrt(3), and AH^2=AS^2-SH^2=2a^2/3. Required plane distance is a*sqrt(2/3). The response must distinguish a plane distance from a distance to the line BC or the in-plane segment SH.

### 398

Let SA and SB be the perpendicular edges bounding the 90-degree face. Set their unit vectors to (1,0,0) and (0,1,0). A unit vector along SC makes 60 degrees with each, hence has x=y=1/2 and normal component of magnitude 1/sqrt(2). Its orthogonal projection to plane SAB has length 1/sqrt(2). The acute line-plane angle therefore has cosine 1/sqrt(2) and equals 45 degrees. The response should identify both projection length and inclination.

### 399

Determine the complete locus, including exterior points and the vertex. The available N41 theorem statements do not define whether distance to an edge is distance to its ray as a set, or the conventional distance to its supporting line. Derive both without importing an unread definition.

Let x=SP and let u,v,w be the noncoplanar unit vectors of the three positive edge rays. Write p=x.u, q=x.v, r=x.w. The map x -> (p,q,r) is invertible.

For supporting-line distance: d_u^2=|x|^2-p^2. Equality of the three distances is exactly |p|=|q|=|r|. The complete locus is four distinct full lines through S, obtained from p=q=r, p=q=-r, p=-q=r, and -p=q=r; global reversal identifies eight sign choices in pairs.

For distance to a ray as a closed set: minimizing |x-tu|^2 over t>=0 gives d_u^2=|x|^2-max(p,0)^2. Equality therefore says max(p,0)=max(q,0)=max(r,0)=c. If c=0, p,q,r<=0: the entire negative polar cone is included. If c>0, p=q=r=c, giving one positive ray whose direction solves u.z=v.z=w.z=1. Thus the complete ray-distance locus is the union {p,q,r<=0} and {p=q=r>=0}, including S. Restricting attention to the solid-angle interior, or giving four full lines under the ray interpretation, misses real source capacity.

Author response will explicitly state the ray-as-set distance convention and cover its entire locus, while retaining the supporting-line solution above. Source-convention alignment remains pending for the parent's independent review; no original-convention closure is claimed.

Needed genuine extract, if the parent wants source-convention closure: the chapter's definition of a polyhedral edge and its definition/convention of "point-to-edge distance", sufficient to decide whether nearest-point minimization is over a ray or the entire supporting line. Exact target occurrence is current lesson `geo910-c1-s3-n41`, exercise `399`, phrase "与三面角所有的棱的距离相等的全部点的集合". The preceding definition's lesson ID and paragraph number have not been supplied and were not looked up; they are not invented here.

### 400

Take unit vectors u,v,w along the edges. With C=cos(alpha)+cos(beta)+cos(gamma), the squared norm identity is |u+v+w|^2=3+2C. The edge vectors of a nondegenerate trihedral are linearly independent, so u+v+w cannot vanish. Thus 3+2C>0 and C>-3/2. Equality would require a zero sum and coplanar directions, hence is excluded. This proves the stated strict bound for all three face angles simultaneously.

### 401

Use any two internal face-angle bisectors with shared edge. To match fig-161, set u along SA, v along SB, w along SC, all unit. The internal bisector directions of ASB and BSC are b1=u+v and b2=v+w. The adjacent supplementary angle of ASC can be taken as A1SC, with SA1 opposite SA, so its internal bisector direction is b3=w-u. Exactly b2-b1=b3. The vectors are nonzero, and u,v,w independent implies b1,b2 are not parallel; their span is a plane through S containing all three bisector rays. Choosing the other adjacent supplementary angle reverses b3 and leaves the plane unchanged. Unit normalization is essential.

### 402

Diagnose both proposed face-angle lists independently using the convex scope introduced by paragraph 13 and carried into paragraphs 14-15.

For (80,130,70,100), the total is 380 degrees, violating the convex sum bound; checking the largest-angle inequality alone would be insufficient. For (10,20,40,80,160), the total is 310 but 160 exceeds 10+20+40+80=150, violating the largest-face inequality. Neither list is realizable for the convex multihedral angles discussed in the selected prose.

The exercise itself says "multihedral", not explicitly "convex". The response will make the surrounding convex scope visible. No claim is made that the 360-degree bound excludes every nonconvex multihedral angle. If an unrestricted nonconvex interpretation is intended, the parent needs the actual chapter convention; that was not read or fabricated.

### 403

Determine all four dihedrals by their edges. Use unit vectors a=(sqrt(3)/2,-1/2,0), c=(sqrt(3)/2,1/2,0), b=(1/sqrt(3),0,sqrt(2/3)), d=(1/sqrt(3),0,-sqrt(2/3)). Their adjacent dot products and a.c are all 1/2, realizing the five specified 60-degree face/diagonal angles with B and D on opposite sides of plane SAC.

For each equilateral trihedral SABC or SACD, the dihedral along any edge has cos(phi)=(1/2-(1/2)^2)/(sin(60)^2)=1/3; phi=arccos(1/3), approximately 70.528779 degrees. Plane SAC splits the dihedrals at SA and SC into two such angles. The remaining edges SB and SD each have one phi. Ordered by SA,SB,SC,SD the full result is (2phi,phi,2phi,phi), with 2phi approximately 141.057559 degrees and cos(2phi)=-7/9. Equal face angles do not make all four dihedrals equal.

### 404

Construct and prove existence of a parallelogram section, not a special-case equal-length cut. Take any initial bounded convex section of the convex four-edge cone. Its diagonals meet at an interior point T, so ST is the common interior ray of the diagonal planes SAC and SBD. For positive edge vectors a,b,c,d, this supplies positive p,q,r,s with T=pa+qc=rb+sd, taking S as origin.

Choose A'=2pa, C'=2qc, B'=2rb, D'=2sd. Then (A'+C')/2=(B'+D')/2=T. The two diagonal lines A'C' and B'D' are distinct, intersecting at T; they define a plane. Their endpoints are on all four positive edge rays. The plane cannot contain S because that would force all four rays into one plane. Since it meets each extremal ray at a positive point, it cuts a bounded convex quadrilateral in cyclic order A',B',C',D'. Its diagonals bisect each other, so it is a parallelogram. All positive decompositions and the proof that the cut is nondegenerate are part of the source task.

## Frozen Capacity Statement

Choices can assess realizability, exact ranges, spatial projection, proof steps, vector identities, locus components and recognition of a universal construction. They cannot demonstrate independently writing a proof, physically building a trihedral model, drawing perpendiculars/bisectors or executing a plane construction. Each relevant loss will appear in the draft's limitations and coverage omissions. No complete solvable numeric or proof task is placed on silent HOLD. The two source-scope/convention qualifications above remain explicit.

## Actual Image Observations

One batch, six image opens total, no crops or reopens. Raw fig-160 shows S at top; SA,SB,SC rays; D on SC; dashed A-N-B and S-N-M, a filled diamond at N; solid AD and DB; alpha,beta,gamma sectors. The modern fallback-color raster shows the entire corresponding composition, including rightmost B and bottom C/continuation. Greek labels and N/M are readable. It supplies geometry identification, not numerical angle measurement.

Raw fig-161 shows opposite rays SA1 and SA, plus SB and SC; dashed AB; curved cut boundaries AC and BC; original alpha,beta,gamma; supplementary labels 180-gamma and 180-beta with leaders. The complete modern fallback-color raster retains A1, S, A, B, C and both supplementary labels, including right/bottom endpoints. Curved cut boundaries are illustrative outlines, not metric chords.

The first two resvg raster outputs were blank because CSS var() color values were unresolved; they are retained as failure evidence and are not mathematical observations. Successful rasters use only the original SVG's fallback ink/paper colors, replaced in memory. Neither SVG nor FigureSpec was edited, and no figure gate was rerun.
