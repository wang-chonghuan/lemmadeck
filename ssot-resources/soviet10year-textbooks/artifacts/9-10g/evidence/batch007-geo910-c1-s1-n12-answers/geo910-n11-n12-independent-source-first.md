# Batch007: geo910 n11/n12 Independent Source-First Freeze

- Ticket: STEMROBIN-184. Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- Stage: A only, 2026-11-16. This is an independent semantic/solution baseline, NOT approval of modern text, answer keys, figures, transcription, counting or publication.
- Authority: bounded parent-agent delegation under existing human ticket authority.
- Scope: n11, physical37-41, exercises85-96; n12, physical41-43, exercises97-106. All22 numbered tasks are covered, including the source-worked exercise92. There are28 numbered-subpart/undivided task units;106 additionally requests two quantities within its single task.
- Independent derivations below are `derived`, not book-answer transcriptions. Source-provided proofs/worked answers are identified separately.
- Only this report was written. No source, modern text, answers, choices, tools, figures, indexes or other reports were changed.

## A0. Chronology and evidence boundary

1. Read the current lesson skill, answer skill and answer Gate2 before solving.
2. Opened the original full PNG for0037, then its faithful MD; continued0038,0039,0040,0041,0042,0043 in that order, one full original PNG per image invocation, at original resolution. No composite image, browser, crop creation or repeat full-page inspection.
3. After all seven originals were observed, read the faithful n11/n12 `lesson.md`, `lesson.json` and `exercises.json` to bind the independently observed statements to stable source references. These are the original layer, not modern author outputs.
4. Derived the proofs, constructions, image classifications, counterexamples and feasibility branches recorded below. No modern templates, answer keys, choice material, parent source solutions, Peirce notes or other reviewer reports were read.
5. Original figure roles below come from the full-page pixels already observed. Durable original crop files were hashed for identity, not reopened for another image review. This report does not certify crop boundaries or modern rendering.
6. No prepare, finalize, assemble, render, validator, browser, Git, DB, service, network, dependency or new-agent operation was run.

Physical37 includes the end of n10, exercises79-84 and fig32 before the n11 heading. They were not re-solved or re-reviewed. Physical41 closes96 before n12 starts. Physical43 closes106 before the n13 heading and its opening fragment; that n13 fragment is outside this freeze. Neither neighboring lesson is claimed complete by this report.

## A1. Source prose and mathematical obligations

### n11: all13 textual prose objects

The faithful lesson has21 prose-array objects:13 text paragraphs plus4 figures and4 captions. The additional exercise figures37/38 belong to89/92, not to these13 text paragraphs.

| Source reference | Complete semantic obligation |
| --- | --- |
| p0037#11 | Theorem7: two parallel planes cut by a third plane have parallel intersection lines. |
| p0038#1 | Givens are exactly $\alpha\mathbin{//}\beta$, $\gamma\cap\alpha=a$, $\gamma\cap\beta=b$. The intersections are lines, not coincident planes. |
| p0038#2 | Goal is $a\mathbin{//}b$. |
| p0038#3 | Students supply the proof, using fig33; the assigned investigation explicitly treats $\alpha\ne\beta$. The theorem itself is not restricted to distinct parallel planes. |
| p0038#8 | Theorem8 states existence AND uniqueness of a plane through an arbitrary given point parallel to a given plane. It has no point-outside restriction in its statement. |
| p0038#9 | Source proof first assumes $A\notin\alpha$. Existence of $\beta$ through $A$, parallel to $\alpha$, is recalled from section10; uniqueness remains to prove. |
| p0038#10 | Assume another $\beta_1$ through $A$, parallel to $\alpha$, distinct from $\beta$. Axiom5 gives their intersection $m$. Choose $l\subset\alpha$ skew to $m$; form $\gamma$ through $A$ and $l$. Its intersections with $\beta,\beta_1$ are $b,b_1$. Theorem7 gives $b\mathbin{//}l$ and $b_1\mathbin{//}l$, contradicting the parallel axiom. Reject the second plane. Fig34 is this contradiction apparatus. |
| p0038#11 | Separate on-plane branch: source changes the point name to $B\in\alpha$. The unique parallel plane through $B$ is $\alpha$ itself. Source does not provide a detailed proof of this branch. Preserve it and its conclusion. |
| p0039#1 | Corollary: if each of two given planes is parallel to another plane, the two given planes are parallel. No distinctness conditions are added. |
| p0039#2 | Students prove this, for example by contradiction, with fig35. |
| p0039#7 | Unnumbered construction problem: through each of two skew lines construct a plane, with the two constructed planes parallel. Both planes, not just one, must be produced. |
| p0039#8 | Source-worked construction literally says: through any $M$ on $a$ construct $a_1$ parallel to $b_1$ (fig36); construct $\alpha$ through $a,a_1$; construct $\beta$ similarly; use the plane-parallel criterion. The printed $b_1$ is retained here, not silently replaced by $b$. See A6-R1. |
| p0039#9 | Source asserts the construction problem has a unique solution. An independent justification is below. |

### n11: independent proof completion

**Theorem7.** For distinct parallel $\alpha,\beta$, $a,b$ lie in the same plane $\gamma$. An intersection point of $a,b$ would belong to both $\alpha,\beta$, impossible. Thus the coplanar lines are parallel. If $\alpha=\beta$, then $a=b$, which is parallel in the book's broad convention.

**Theorem8, existence.** Take two intersecting direction lines in $\alpha$. Through an outside point $A$, draw the respective parallel lines; their plane is parallel to $\alpha$ by the established criterion. If the point lies in $\alpha$, use $\alpha$ itself.

**Theorem8, uniqueness, source proof made explicit.** In the source's outside-point contradiction, $m$ is disjoint from $\alpha$. A line in $\alpha$ not parallel to $m$ is therefore skew to it. The plane $\gamma=(A,l)$ cuts both proposed parallel planes in lines through $A$. These two lines are distinct: otherwise their common line would be $m$, so $\gamma$ would contain both $m$ and $l$, contrary to their being skew. Theorem7 makes both distinct lines through $A$ parallel to $l$, violating uniqueness of the planar parallel. For an on-plane point $B$, any parallel plane containing $B$ shares a point with $\alpha$; distinct parallel planes are disjoint, so it must equal $\alpha$.

**Corollary.** If the two planes are distinct and intersect, choose an intersection point. Both would be parallel to the third plane through this point, contradicting Theorem8 uniqueness. Hence they are parallel; coincidence is already allowed. This also covers equality with the third plane.

**Unnumbered skew-line construction, independently and unambiguously named.** Call the two given lines $g,h$, with independent direction vectors $u,v$. Through $M\in g$, draw an auxiliary line parallel to $h$; it and $g$ determine $\pi_g$. Through $N\in h$, draw an auxiliary line parallel to $g$; it and $h$ determine $\pi_h$. Both planes have direction space $W=\operatorname{span}(u,v)$. They cannot coincide, since that would put the skew lines in one plane, and are therefore distinct parallel planes. Every possible parallel-plane pair through $g,h$ must have a common2-dimensional direction space containing both $u,v$, necessarily $W$. The plane through each given line with this direction space is unique. Thus the PAIR of planes is unique, even though $M,N$ and auxiliary drawing choices are arbitrary. This solves the abstract source problem without asserting an unregistered repair of its $b_1$ notation.

### n12: all8 textual prose objects

The faithful lesson has14 prose-array objects:8 text paragraphs,3 figures and3 captions.

| Source reference | Complete semantic obligation |
| --- | --- |
| p0041#6 | This section AND the next section introduce the drawing rules used in solid geometry; new concepts are introduced first. Do not merge the next section into this completed lesson. |
| p0041#7 | Given a plane $\alpha$ and a line $l$ meeting it, take ANY point $A_1$. Through it draw $l_1\mathbin{//}l$; its intersection with $\alpha$ is $A$. This is the point's parallel projection along $l$ onto $\alpha$. The image of a figure $\phi_1$ is the SET $\phi$ of the images of all its points. The direction is not stipulated perpendicular to $\alpha$. |
| p0042#1 | Motivation: sunlight casts shadows of cardboard or wire models on a wall, figs40/41. Source explains approximate parallel sunlight by the large Sun-Earth distance. No numerical distance, date or exact parallelism is stated. |
| p0042#4 | The SOURCE model is the regular hexagon $A_1B_1C_1D_1E_1F_1$; its shadow is the polygon $ABCDEF$. Consider various positions of the hexagon's plane relative to the wall. For the ensuing properties, projection is parallel to $l$, and $l$ is NOT parallel to the projected line or segment. The shadow is not declared a regular hexagon. |
| p0042#5 | Property1: a line's image is a line, subject to the preceding noncollapse condition. |
| p0042#6 | Property2: parallel lines have parallel images, subject to that condition and the book's broad parallel convention. |
| p0042#7 | Property3: the ratio of the lengths of two parallel segments equals the ratio of their projected lengths. The shared direction must not collapse. This is not general length preservation or preservation of ratios of nonparallel segments. |
| p0042#8 | Source explicitly omits the proofs of these properties. The independent proofs below are a review baseline, not newly claimed source prose. |

### n12: independent common model and omitted proofs

Write the projection plane as $\alpha=\{x:n\cdot x=c\}$ and the projection direction as a nonzero vector $d$ with $n\cdot d\ne0$. This nonzero condition is the unique-point intersection required by the source construction, not a perpendicularity assumption. Then

$$P(x)=x-\frac{n\cdot x-c}{n\cdot d}d,\qquad
L(v)=v-\frac{n\cdot v}{n\cdot d}d.$$

$P$ is affine, $P$ fixes every point of $\alpha$, $L$ has rank2, and its kernel is exactly $\operatorname{span}(d)$. Two source points have the same image precisely when their joining vector is parallel to $d$.

A source line $x+t v$ maps to $P(x)+tL(v)$: a line when $v\not\parallel d$, a point when $v\parallel d$. Parallel source lines have proportional nonzero image directions and may yield distinct parallel lines OR a coincident line. For two noncollapsing parallel segments with vectors $t_1v,t_2v$, both length changes have the same factor $|L(v)|/|v|$, so their length ratio is preserved. These prove all three source properties with their actual hypotheses.

The preceding property-specific condition does NOT silently restrict every exercise:98 explicitly asks about a projecting line,101 asks when the property fails, and99/103/105 require rank-loss cases.

## A2. Original figures33-41: source roles and observed content

These are semantic observations of the original full-page pixels, not a new layout gate. Projected lengths, apparent angles, plane-patch edges and dash counts do not invent metric givens.

| Figure / page / source ownership | Original observations and role |
| --- | --- |
|33 /38 / p0038#4, Theorem7 | Two separate plane patches $\alpha,\beta$ cut by a third patch $\gamma$; intersection lines $a,b$ on their respective patches. All five labels are present. Dashed portions represent hidden continuation in the spatial sketch. No perpendicular marker or measurement. The required relation is that $a,b$ are coplanar in $\gamma$ and parallel. |
|34 /38 / p0038#5, Theorem8 uniqueness | Lower $\alpha$ with line $l$; upper proposed planes $\beta,\beta_1$, their common line $m$ through $A$, and transversal plane $\gamma$ with intersections $b,b_1$. Visible labels: $\alpha,\beta,\beta_1,\gamma,l,m,A,b,b_1$. Solid/dashed spatial strokes distinguish visible/hidden portions. This is a COUNTERFACTUAL proof sketch: distinct intersecting $\beta,\beta_1$ cannot both really be parallel to $\alpha$. Do not turn all contrary assumptions into simultaneously satisfiable real-geometry assertions or infer extra right angles. |
|35 /39 / p0039#3, corollary | Plane patches $\alpha,\beta,\gamma$, with $\alpha,\beta$ depicted extending/bending toward a common point labelled $M$; a dashed hidden continuation occurs near the meeting region. The separate lower $\gamma$ is the common comparison plane. This is the suggested contradiction illustration, not a genuine pair of distinct parallel planes meeting at $M$. No invented straight intersection-line name. |
|36 /39 / p0039#4, worked construction | Two separately shown plane patches: lower $\alpha$ with crossing lines $a,a_1$ through $M$; upper $\beta$ with crossing lines $b,b_1$ through $N$. Thus eight labels are visible. The lower horizontal family is labelled $a$, lower oblique family $a_1$; upper horizontal family $b_1$, upper oblique family $b$. The prose's literal $a_1\mathbin{//}b_1$ does not naturally match those projected families. Record this identity concern; do not swap labels or silently repair prose. No numerical distances or equal-length marks. |
|37 /40 / p0040#2, exercise89 | Two distinct parallel plane patches $\alpha,\beta$. Endpoints $A,A_1$ on the upper plane, $B,B_1$ on the lower. Two parallel connecting segments are drawn with visible strokes and dashed portions hidden by the upper patch. Six labels. They are the respective upper/lower endpoints, not midpoint marks; no length or unit is printed. |
|38 /40 / p0040#9, worked exercise92 | Parallelepiped $ABCDA_1B_1C_1D_1$, $M$ on $A_1B_1$, $N$ on $B_1C_1$, hatched section $AMNC$ labelled $\alpha$. All8 vertex names, $M,N,\alpha$ are present. $AC$ is the lower-face diagonal, $MN$ the top trace; the hatching denotes the section, not an answer-dependent extra distance. Hidden rear/base strokes are dashed. Source text, not the pictured generic interior configuration alone, also gives both endpoint branches. No cubical/right-angle assumption. |
|39 /41 / p0041#8, projection definition | Plane patch $\alpha$; intersecting direction line $l$; projecting line $l_1$ through $A_1$ and its image $A$. Five labels. The source point $A_1$ is off the plane and $A$ lies on it. A hidden continuation of $l$ is dashed. No normal/perpendicular marker: oblique projection is permitted. |
|40 /41 / p0041#9, physical motivation | Unnamed wire/faceted model at left, its image on a wall-plane patch at right, linked by parallel projecting strokes. Visible and hidden model/image edges are distinguished. No point names, units or angle marks. Its role is a solid-model shadow example, not an extra exercise or a source-given regularity/length assertion. |
|41 /42 / p0042#2, regular-hexagon model | Source polygon vertices $A_1,B_1,C_1,D_1,E_1,F_1$ and center $O_1$; image vertices $A,B,C,D,E,F$ and center-image $O$ on wall plane $\alpha$. All14 point labels plus $\alpha$ appear. Parallel connecting strokes map corresponding vertices/centers; some hidden strokes are dashed. Source model regularity is asserted by prose, not transferred to the displayed shadow. Preserve center correspondence, all six vertex correspondences, the wall and the projecting direction. No numerical angle or orthogonal-projection annotation. |

## A3. n11 independent standard solutions:85-96

Coordinates used in independent counterexamples/checks below are auxiliary proof data, not source measurements. For parallelepipeds, normalized coordinates are AFFINE coordinates, not a claim of unit mutually perpendicular edges.

###85 [p0039#11]

Source: two lines lie respectively in TWO DIFFERENT parallel planes; ask all possible relative positions.

Answer: parallel or skew; they cannot intersect or coincide, since any common point would belong to both disjoint planes. In $z=0,z=1$, the lines $(t,0,0),(t,0,1)$ realize parallelism; $(t,0,0),(0,t,1)$ realize skewness. Both cases respect the explicit distinct-plane condition.

###86 [p0039#12]

Source: two intersecting planes are each cut by another plane; can the resulting lines be parallel?

Yes, including genuinely DISTINCT parallel lines. Take $\pi_1:x=0$, $\pi_2:x+z=0$, and $\gamma:z=1$. The first two intersect in $x=z=0$; their traces on $\gamma$ are $(0,t,1)$ and $(-1,t,1)$, distinct parallel lines. If the third plane contains the first two planes' intersection line, the traces coincide, an additional broadly parallel branch. Do not incorrectly apply Theorem7's converse.

###87 [p0039#13]

Source: prove that a plane intersecting one of two parallel planes also intersects the other.

If the parallel planes coincide, immediate. Otherwise call them $\alpha,\beta$, with $\gamma$ intersecting $\alpha$ in a line. If $\gamma$ did not properly intersect $\beta$, it would be parallel to $\beta$ (including the possible equality case). The corollary, with $\beta\parallel\alpha$, would give $\gamma\parallel\alpha$, contrary to their line intersection. Thus $\gamma$ also intersects $\beta$. The conclusion means a proper line intersection, not merely nonempty set intersection.

###88 [p0039#14 + p0040#1]

Source: analogous statement for a LINE intersecting one of two parallel planes; the source sentence continues across the page boundary.

Let $\alpha,\beta$ have common normal $n$ and equations $n\cdot x=c_1,c_2$. A line $x=x_0+t u$ that has a single-point intersection with $\alpha$ has $n\cdot u\ne0$. It meets $\beta$ at the unique parameter $t=(c_2-n\cdot x_0)/(n\cdot u)$. This also covers coincident planes. A line contained in $\alpha$ is NOT the source's single-point intersection premise.

Synthetic alternative: a plane through the given transversal line cuts the parallel planes in parallel lines by Theorem7; within this plane the transversal meets both.

###89(1) [p0040#2; fig37]

Source: finish AND prove the theorem about two parallel segments whose corresponding endpoints lie in two distinct parallel planes.

Completion: the segments have equal lengths, $|AB|=|A_1B_1|$, where $A,A_1\in\alpha$ and $B,B_1\in\beta$.

Proof: their supporting lines determine a plane. Its upper and lower traces $AA_1,BB_1$ are parallel by Theorem7; the two joining sides $AB,A_1B_1$ are parallel by the premise. Thus $AA_1B_1B$ is a parallelogram and these opposite sides have equal lengths. If the broad convention allows coincident supporting lines, each supporting line meets each of the distinct planes at a unique point; the segments then coincide and are equal directly.

Equivalently, orient both segment vectors from $\alpha$ to $\beta$: their common normal components are the same nonzero $c_2-c_1$. Proportional parallel vectors must therefore have proportionality factor1.

###89(2) [p0040#2]

Yes. In $z=0,z=1$, use $A=(0,0,0)$, $B=(1,0,1)$, $A_1=(0,2,0)$, $B_1=(-1,2,1)$. Both lengths are $\sqrt2$, but direction vectors $(1,0,1),(-1,0,1)$ are not parallel. Equal lengths do not give the converse of89(1). These are auxiliary dimensionless example coordinates; the source prints no unit.

###90 [p0040#7]

Source: construct a plane through a GIVEN LINE parallel to a given plane, and investigate the solutions; no initial line-plane position is specified.

Let $a$ be the line, $\alpha$ the plane.

- If $a\subset\alpha$, the unique solution is $\alpha$ itself.
- If $a$ is disjoint from and parallel to $\alpha$, choose $P\in a$ and construct the unique parallel plane through $P$ by Theorem8. It contains all of $a$, so it is the unique solution.
- If $a$ intersects $\alpha$ at one point, no solution: a plane containing $a$ has its direction; a plane parallel to $\alpha$ cannot contain that transverse direction.

Unified proof: the unique parallel plane through $P\in a$ has the direction space of $\alpha$. It contains $a$ exactly when the direction of $a$ belongs to that space. Do not exclude the containment branch or claim infinitely many parallel planes.

###91 [p0040#8]

Literal source givens:
$\alpha\parallel\alpha_1$, $\beta\parallel\beta_1$,
$\alpha\cap\beta=c$, **$\alpha_1\cap\beta=c_1$**.
Goal: $c\parallel c_1$.

As printed, apply Theorem7 directly to $\alpha,\alpha_1$, cut by the SAME plane $\beta$. If $\alpha=\alpha_1$, the lines coincide and are broadly parallel. The condition $\beta\parallel\beta_1$ is redundant but must remain in faithful/modern coverage unless an authorized source change is supplied. No need to infer or replace the second $\beta$ by $\beta_1$.

###92 [p0040#9; fig38; SOURCE-WORKED]

Source task AND its complete supplied answer must remain: plane through $A,C$ and $M\in[A_1B_1]$ in a parallelepiped; draw $AC$, the top trace $MN\parallel AC$, and $NC$; section $AMNC$; if $M=B_1$, triangle $AB_1C$; if $M=A_1$, parallelogram $AA_1C_1C$; uniqueness by Axiom4. Source references Theorem7 in section11. It does not call $M$ an interior point.

Independent completion: for interior $M$, draw through $M$ in the top face a line parallel to $AC$; let it meet $B_1C_1$ at $N$. Join $AM,MN,NC,CA$. This is the section's complete boundary, a trapezoid with $MN\parallel AC$.

Check in affine coordinates $A=(0,0,0),B=(1,0,0),D=(0,1,0),C=(1,1,0)$ and upper vertices at third coordinate1. With $M=(t,0,1)$, $0<t\le1$, the plane is $x-y=t z$; the top endpoint is $N=(1,1-t,1)$. For $0<t<1$, its boundary is exactly $A,M,N,C$. At $t=1$, $M=N=B_1$, giving the source triangle. At $t=0$, the plane is $x=y$, giving $A,A_1,C_1,C$. The three given points are noncollinear in every allowed branch; uniqueness is justified. No extra right angles, dimensions or isosceles-trapezoid assumption.

###93 [p0040#10 + p0041#1]

Source: tetrahedron $ABCD$, $M$ STRICTLY INSIDE edge $AB$, plane through $M$ parallel to face $DBC$; construct the section.

In face $ABC$, draw through $M$ a parallel to $BC$, meeting $AC$ at $U$. In face $ABD$, draw through $M$ a parallel to $BD$, meeting $AD$ at $V$. Join $UV$. The section is triangle $MUV$, with $MU\parallel BC$, $MV\parallel BD$, $UV\parallel CD$. The two intersecting directions give the required parallel plane; Theorem8 gives uniqueness. Writing $t=|AM|/|AB|\in(0,1)$, the same fraction gives $|AU|/|AC|=|AV|/|AD|=t$. Thus no collapse occurs. $M$ is not assumed a midpoint.

###94 [p0041#2]

Source: through a tetrahedron vertex construct a plane parallel to the opposite face; construct its intersections with the PLANES CONTAINING the other faces.

Name the vertex $A$ and opposite face $BCD$. Through $A$, draw in $(ABC)$ a line parallel to $BC$, and in $(ABD)$ a line parallel to $BD$. Their plane $\pi$ is the unique plane through $A$ parallel to $(BCD)$. Its three requested intersection lines are:

$$\pi\cap(ABC)=\text{the line through }A\parallel BC,$$
$$\pi\cap(ABD)=\text{the line through }A\parallel BD,$$
$$\pi\cap(ACD)=\text{the line through }A\parallel CD.$$

The third follows from Theorem7. They are complete extended lines, not edges of a new finite section triangle. The actual triangular side faces touch this plane only at $A$; replacing their containing planes by their finite faces would lose the task.

###95 [p0041#3]

Source: parallelepiped; $M$ interior to $AD$, $N$ interior to $B_1C_1$; section through $M,N$ parallel to edge $AB$. No equal division fractions are given.

Through $M$ draw a parallel to $AB$ in the bottom face, meeting $BC$ at $P$. Through $N$ draw a parallel to $AB$ in the top face, meeting $A_1D_1$ at $Q$. Join $MQ,PN$. The section is parallelogram $MPNQ$, with opposite edges $MP\parallel QN\parallel AB$ and $MQ\parallel PN$.

Complete check: let $M=(0,s,0)$, $N=(1,t,1)$ with $0<s,t<1$ in the affine coordinates above. The section plane is $y=s+(t-s)z$, independent of $x$. It cuts exactly $M=(0,s,0),P=(1,s,0),N=(1,t,1),Q=(0,t,1)$. This proves the construction, boundary and uniqueness. The allowed $s=t$ branch remains a parallelogram, not a degeneracy; no rectangle or midpoint condition is added.

###96 [p0041#4]

Source: CUBE $ABCDA_1B_1C_1D_1$; plane through $B$, midpoint $X$ of $CC_1$, midpoint $Y$ of $A_1D_1$; construct the section.

Answer: pentagon $BXZYP$, where $Z\in D_1C_1$ satisfies $|D_1Z|=\frac13|D_1C_1|$, and $P\in AA_1$ satisfies $|AP|=\frac34|AA_1|$.

Construction without requiring those fractions as initial measurements:

1. Extend $BX$ in the right-face plane until it meets the line $(B_1C_1)$ at an auxiliary point $T$ beyond $C_1$.
2. Draw $TY$ in the top-face plane; it meets edge $D_1C_1$ at $Z$.
3. In the left-face plane draw through $Y$ a line parallel to $BX$; it meets $AA_1$ at $P$.
4. Join $B,X,Z,Y,P,B$ in order.

Proof/check in unit cube coordinates: $B=(1,0,0)$, $X=(1,1,\tfrac12)$, $Y=(0,\tfrac12,1)$. Their plane is $3x-2y+4z=3$. Its remaining edge intersections are $Z=(\tfrac13,1,1)$ and $P=(0,0,\tfrac34)$. On the cube it has no other boundary vertices. The vertex $B$ is a single section vertex despite being incident to several cube edges. $T=(1,2,1)$ confirms the extension construction. The three givens are noncollinear, so the plane and section are unique. None of the auxiliary names/fractions is a printed figure datum.

## A4. n12 independent standard solutions:97-106

Use the affine projection model in A1 throughout, retaining all collapse and coincidence branches.

###97 [p0042#10]

Source: THREE DISTINCT source points, with no collinearity restriction; ask the possible number of image points.

Answer over the permitted configurations:1,2 or3, never0.

-1 precisely when all three lie on one projecting line (three distinct collinear points parallel to $d$).
-2 precisely when exactly one pair shares a projecting line and the third has another image.
-3 when no pair has a joining direction parallel to $d$.

For a fixed NONCOLLINEAR triple,1 is impossible and2/3 are the possible counts. For a fixed COLLINEAR triple, only1 or3 is possible; collapsing a pair collapses the whole source line. With vertical projection onto $z=0$, respective examples are $\{(0,0,0),(0,0,1),(0,0,2)\}$, $\{(0,0,0),(0,0,1),(1,0,0)\}$, and $\{(0,0,0),(1,0,0),(0,1,0)\}$.

###98 [p0043#1]

Source: the image of a PROJECTING LINE.

It is one point, namely its intersection with the projection plane. Every point on this line has the same image because its direction is $d$. Do not apply the preceding noncollapse property to this explicitly excluded direction.

###99(1) [p0043#2]

A source plane $\pi$ projects to:

- The whole projection plane $\alpha$, if its direction space does not contain $d$.
- A line, if its direction space contains $d$.

Reason: the restriction has rank2 or rank1, respectively; a2-dimensional plane cannot collapse to a point through a1-dimensional kernel. In the second case the image is the line $\pi\cap\alpha$. Containment/equality of planes remains allowed.

###99(2) [p0043#2]

A half-plane in $\pi$ projects to:

- A half-plane when the restriction to $\pi$ has rank2.
- A line when $d$ lies in the direction space of $\pi$ but is NOT parallel to its boundary line: the boundary-direction image already spans a line, and every interior parallel translate does too.
- A half-line when $d$ is parallel to the boundary line: the boundary collapses to the endpoint and the transverse half-plane direction maps to a single side.

It cannot become a point or the whole2-dimensional plane. Endpoint ownership in the last branch follows the inherited half-plane definition: if the boundary is included, include the half-line endpoint; if excluded, exclude it. These seven pages do not restate that ownership, so this report does not invent a new closed-half-plane premise.

###99(3) [p0043#2]

For a nonstraight angle formed by two distinct, nonopposite rays, the image can be:

- A nonstraight angle, if their direction plane has rank2.
- A straight angle (the complete line through the image vertex), if rank1 gives two opposite nonzero projected ray directions.
- One ray, if rank1 gives the same projected orientation, or one side collapses to the common vertex.

Both independent side directions cannot simultaneously lie in the1-dimensional kernel, so a genuine nonstraight, nonzero angle cannot collapse to one point. This describes the boundary-ray union; a sector interpretation has the same shape types under the ordinary nonreflex-angle convention. The local source does not define whether a zero angle is included in its phrase “不等于平角”; if an inherited definition admits coincident sides, that extra case is a ray and may collapse to a point. No zero-angle exclusion or erratum is silently added here.

###100(1) [p0043#3]

A point equals its own image if and only if it belongs to $\alpha$. Necessity follows because every image belongs to $\alpha$; sufficiency because $P$ fixes $\alpha$.

###100(2) [p0043#3]

A line equals its image as a set if and only if the whole line lies in $\alpha$. Necessity: the image lies in $\alpha$. Sufficiency: all its points are fixed. A disjoint line parallel to $\alpha$ has a translated line image, not the original line; a projecting line collapses to a point, not itself.

###101 [p0043#4]

The “parallel lines have parallel images” assertion fails as an assertion ABOUT LINES when the source lines are parallel to the projecting direction: their images are points, not lines.

Under the book's broad parallel convention, two coincident noncollapsed image lines are still parallel; coincidence alone is not a counterexample. If an expressly strict/distinct image-line convention is adopted in a future learner view, a second exception must be stated: two distinct noncollapsing parallel source lines in one projecting plane have coincident images. Example for the latter: $(t,0,0),(t,0,1)$ projected vertically onto $z=0$ both become the $x$-axis. Keep the source convention separate from such a new strict wording.

###102 [p0043#5]

Source only gives equality between a segment length and its projected length; projection is NOT declared orthogonal.

A segment whose direction is parallel to $\alpha$ preserves length (contained or disjoint parallel branches). This condition is sufficient but NOT necessary under oblique projection. A transverse segment can also have the same length.

Concrete counterexample to necessity: project onto $z=0$ along $d=(1,0,1)$. Segment from $(0,0,0)$ to $(0,0,1)$ has length1 and image from $(0,0,0)$ to $(-1,0,0)$ also has length1, despite its line meeting the plane transversely. Translating this segment vertically gives an oblique segment disjoint from the plane; translating by $-\tfrac12$ in $z$ puts a unique intersection inside the segment. Thus mere equality does not determine containment, disjointness or a transverse intersection.

Complete direction criterion: normalize $\alpha$ to $z=0$, $d=(s,1)$ with horizontal vector $s$, and segment vector $v=(w,h)$. Then $L(v)=(w-hs,0)$, and equality is exactly

$$h\bigl(h(|s|^2-1)-2w\cdot s\bigr)=0.$$

For orthogonal projection $s=0$, this forces $h=0$. For any oblique $s\ne0$, there are also $h\ne0$ solutions. A nonzero segment parallel to $d$ cannot meet the equal-positive-length premise because its image has length0. This task needs a condition-aware explanation, not an unjustified universal “must be parallel.”

###103(1) [p0043#6]

The projected UNION of two distinct intersecting lines is either:

- Two distinct intersecting lines, if their source plane does not contain the projecting direction.
- One line, if that plane contains the projecting direction. The two line images then coincide, or one line collapses to the common image point on the other line.

It cannot be two distinct parallel lines (the intersection point has one image), a point plus an external line, or one point (the two independent directions cannot both collapse).

###103(2) [p0043#6]

For two SKEW lines the image union can be:

- Two intersecting lines.
- Two distinct parallel lines.
- One line and a point OUTSIDE that line, when one source line is a projecting line.

Coincident line images are impossible: the inverse image of an image line is a plane containing both source lines, contradicting skewness. In the point-plus-line case, putting the point on the line would give the same contradiction. Both lines cannot collapse, since two projecting lines are parallel, not skew.

Examples onto $z=0$ along $d=(0,0,1)$:
$(t,0,0),(0,t,1)$ give intersecting axes;
$(t,0,0),(t,1,t)$ give distinct parallel lines;
$(0,0,t),(t,1,0)$ give the origin and the line $y=1$, with the point external.
All three examples satisfy the source skew condition.

###104(1) [p0043#7]

The converse is false. The preceding skew pair $(t,0,0),(t,1,t)$ projects to distinct parallel lines, yet the source lines are skew.

If the image lines are explicitly DISTINCT and parallel, intersecting source lines are excluded because their common point would have an image on both lines; sources may be parallel or skew. With the book's broad convention allowing coincident image lines, intersecting source lines are also possible: $(t,0,0),(t,0,t)$ intersect at the origin and project to the same line. This extra branch reinforces, rather than rescues, the false converse.

###104(2) [p0043#7]

Source: GIVEN arbitrary skew $a,b$ and projection plane $\alpha$, construct a line $l$ making their images parallel. No feasibility condition is printed.

Let $u,v$ be their independent directions, $W=\operatorname{span}(u,v)$, and $H$ the direction space of $\alpha$. There is a valid noncollapsing parallel-image projection exactly when

$$d\in W,\qquad d\notin\operatorname{span}(u)\cup\operatorname{span}(v),
\qquad d\notin H.$$

Necessity: parallel nonzero images give $L(u)=\lambda L(v)$ with $\lambda\ne0$, so $u-\lambda v$ is a nonzero kernel vector; consequently $d\in W$. The other exclusions enforce noncollapse and a well-defined projection. Conversely such a $d$ makes the rank of $L|_W$ equal1 and both line directions nonzero. The two image lines are distinct by the skew argument in103(2).

- If $W=H$, there is NO SOLUTION. Explicit allowed source configuration: $\alpha:z=0$, $a=(t,0,0)$, $b=(0,t,1)$. They are skew, but every valid projection direction leaves their independent horizontal directions independent. No line $l$ can make the two images parallel.
- If $W\ne H$, there are infinitely many direction choices. Through $P\in a$ draw a parallel to $b$; these determine a plane $\pi$ with direction $W$. It cuts $\alpha$ in a line $r$. Choose in $\pi$ a line $l$ whose direction is parallel to neither $a$ nor $b$ nor $r$. This excludes only finitely many directions in the plane. Its direction is transverse to $\alpha$ and yields the required distinct parallel images. The location of $l$ itself is arbitrary; only its direction matters.

The book's broad containment-as-parallel convention does not remove the impossibility when $W=H$. This is a real missing-feasibility branch, not a conjectural notation repair. A standard answer must investigate it rather than add an unprinted hypothesis or claim unconditional construction.

###105 [p0043#8]

Literal source: “从一个点引三条不在同一个平面上的射线. 这些射线的并集和射影可能是怎样的图形？”

The word is printed **和**, not a silently inferred **的**. Cover both the source union and its projection: the source union is three rays with one vertex and three linearly independent direction vectors; it is not a filled trihedral region.

Write their projected direction vectors as $U,V,W'$. They span a2-dimensional space because the three source directions span space and $L$ has rank2. At most one can be zero.

- If one ray collapses, the other two projected directions are independent: their union is a nonstraight angle.
- If none collapses but two projected rays have the same orientation, those two coincide and the union is again a nonstraight angle with the third ray.
- If two projected rays are opposite, the union is a complete line and a third ray from a point on it, not contained in that line.
- Otherwise there are three distinct rays from one vertex, not all in one line, with no opposite pair. Their cyclic gaps need not be equal; no120-degree or angle-bisector fact is given.

No image consisting of a single ray, a single line, or one point is possible, since its direction span would have rank at most1. Under vertical-target coordinates, take source directions $e_1,e_2,e_3$ and $d=(s_1,s_2,1)$. Their projected directions are $(1,0),(0,1),(-s_1,-s_2)$: choosing the third as $0$, $(1,0)$, $(-1,0)$, or $(1,1)$ realizes the collapse, same-ray, opposite-ray and three-distinct-ray cases, respectively. These are unmeasured independent examples, not new figures.

###106 [p0043#9]

Source: SEGMENT $AB$ meets the projection plane at $M$; its image is SEGMENT $A_1B_1$; $|AB|=m$, $|A_1M|:|MB_1|=p:q$; find BOTH $|AM|$ and $|MB|$.

For a defined nondegenerate ratio,

$$|AM|=\frac{mp}{p+q},\qquad |MB|=\frac{mq}{p+q}.$$

Proof: $M$ lies on the segment, so put $M=(1-t)A+tB$, $0\le t\le1$. Since it lies in the projection plane it is fixed, giving $M=(1-t)A_1+tB_1$. On a noncollapsed image segment, $|A_1M|:|MB_1|=t:(1-t)$, hence $t=p/(p+q)$. The two lengths add to $m$. This uses preservation of division ratios along ONE source direction, not length preservation.

For the usual positive-length ratio $p,q>0$, $M$ is interior. If endpoint ratios are admitted as nonnegative ratio weights, $p=0,q>0$ yields $M=A$ and lengths $0,m$, and $q=0,p>0$ yields $M=B$ and lengths $m,0$; whether a zero denominator is admitted in ratio notation belongs to the inherited notation. The pair $p=q=0$ is not a defined ratio. If $AB$ is parallel to the projecting direction, $A_1=B_1=M$ and both displayed ratio lengths vanish; no determinate numeric ratio is then supplied. Do not invent an external-division branch using $p-q$: the source says the SEGMENT intersects the plane.

## A5. Gate2 obligations frozen for later StageB

- Check one answer per85-106, all explicit subparts in89,99,100,103,104, and BOTH quantities in106. No duplicate or omitted number;92 is source-worked but still a numbered task.
- Book-source working is not automatically a verified standard answer. Preserve92's full method, both endpoint sections and uniqueness; independently verified source proofs/methods are separated above from literal source wording.
- Proof, construction and open classification answers must contain the proof/method/case reasoning, not only a final name or a generic instruction to apply a theorem.
- In particular:90 must handle zero/one solution;94 must intersect containing planes, not finite faces;95 cannot assume midpoint/equal fractions;96 must give the complete pentagon;104(2) must retain the genuine no-solution configuration.
- “平行” retains the book's broad coincidence/containment conventions where applicable. Do not introduce a modern strict convention without a visible, source-accounted declaration.
- Projection is general parallel/possibly oblique projection, not orthogonal projection. Do not add right-angle symbols, preserved lengths, preserved nonparallel ratios or regularity of the hexagon's shadow.
- All construction/proof/open reasoning is `ungraded`, with an adequate full `displayAnswer` and no fabricated automatic proof judgement. Any later deterministic grading for106 must independently respect the defined ratio/domain and provide two clear quantities. StageA writes no answer-key schema and performs no input/browser conversion.
- Future StageB must separately inspect immutable modern/answer output identities, source bindings, declared changes/errata, language, formula punctuation and actual prose-flow anchors. None of these output checks has been performed or approved here.

## A6. Source concerns and genuine unresolved premises

**R1 - p0039#8 / fig36 auxiliary identity.** The source body actually prints $a_1$ parallel to $b_1$; the figure visibly groups $a$ with $b_1$ in one drawn family and $a_1$ with $b$ in the other. The abstract construction is mathematically solvable and its pair is unique, as independently proved. The given-line names are not explicitly declared in the problem sentence. This report therefore records a source prose/figure naming concern, NOT an approved replacement of $b_1$ by $b$. A later rewrite must make its given/auxiliary identities explicit and account for any changed bound span.

**R2 -91 redundant $\beta_1$.** Its literal second intersection uses $\beta$, not $\beta_1$. The printed theorem is true as it stands; $\beta_1$ is unused. Redundancy is not proof of a printing error or permission to change/remove a given.

**R3 -102 oblique equal-length branch.** No perpendicularity is printed, and the counterexample is exact. A claim that equal length necessarily means line-plane parallelism would be a modern/answer error, not a source theorem established by this task.

**R4 -104(2) genuine no-solution branch.** The missing feasibility condition is necessary, with a concrete allowed counterexample. No guessed erratum is registered or applied; condition-aware construction analysis is frozen.

**R5 -105 conjunction.** The actual word “和” is preserved. Both literal objects are addressed above. No source-body correction to “的” is inferred.

**R6 -99 inherited boundary/angle definitions.** These pages do not restate half-plane boundary ownership or whether zero angles are admitted. The main genuine-angle classifications are complete; endpoint/zero-angle exceptions are explicitly conditional, not manufactured source givens.

**R7 -106 ratio degeneracy.** The formula requires a defined ratio and noncollapsed image. The source states no explicit positivity restrictions for $p,q$; ordinary positive-length ratio and potential endpoint readings are distinguished. $0:0$ does not determine division.

**R8 - properties versus exercise domain.** The nonparallel-to-$l$ clause is introduced “在叙述这些性质时”. Extending it to erase the collapse cases asked in the exercises would lose source task content.

No source/transcription repair, counting recommendation or new erratum was authored. These are source-first semantic facts and conditional-answer obligations for the one later comparison.

## A7. Actual input identities

All values below are SHA-256 of the bytes actually present when frozen. Paths are relative to the workspace root stated above.

### Original full-page pixels and faithful MD

PNG prefix: `.tmp/ld-s10y-lesson/9-10g/pages/`.
MD prefix: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`.

| Physical page / printed page | `page.png` SHA-256 | `page.md` SHA-256 |
| --- | --- | --- |
|0037 /30 | `56d10d78cc4359ec4519f22300795321388c916f30e8a069c58db5446d27b7c8` | `9aa04fc687c8acf3dfc7abf8998dea3c15ba60a77b652c8707282a384f7a31c3` |
|0038 /31 | `e4cdac471f0143c862e1b33a0bfdc768f1b0f8edde978047538a5b80606f3015` | `fe5d2cfe0560aff10a9a9927c1ebc70d96812caecd36c7dc560d9188bb60f5a2` |
|0039 /32 | `4b589ccdde8513a2bcdb80d0f77f19207ec91903a7d49d23fe575a291b29a87f` | `968fe21705b36c8ad2b9cae1cb16d647ac2be8b5979a8d014b6737605a9e0516` |
|0040 /33 | `4faeb1d79b5bac72a0620552f538d417215e7f56ba757315b8e705eb07f64d26` | `fc527b561f321043196cf303b367787fe22d4afd0c864c2faada38f3e27e27c5` |
|0041 /34 | `aef2b99c21a0ba0a5a05cff7ec800ea6f47598027f6db324d477932ec6b87540` | `ecb1ca355832e43544f51cda138d268b22e174270a0a42059d30afd73ff7ad49` |
|0042 /35 | `5decda241f22b66f9f56892f2b399019f768d4ad0c3939b379abfe11ade72dd3` | `5bc728457ca46edbc357ea2483f86b2c770629623433dac484fff84860a362e7` |
|0043 /36 | `09e565cf57b583c774408e95d78620d43549233cfbbed0a4260c07de29f66e44` | `eaa38ab1722b74f07cbe932df430948afc596def6c143a1a10a55088167ad564` |

### Faithful assembled lesson/exercise inputs

Prefix: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/`.

| Input | SHA-256 |
| --- | --- |
| `geo910-c1-s1-n11/lesson.md` | `560dbbe47aff800c063c7544c7fbfeaa5c529b511cf8f7e173a1d52ea60fd448` |
| `geo910-c1-s1-n11/lesson.json` | `3d716cc9fdc9e8712e2051f2d02162c5832efc6cd15957a4884c3bd518b720c0` |
| `geo910-c1-s1-n11/exercises.json` | `6913f0379ba9cd3e63da1c95ebee00a63b3951aeafe427fafce6dfa2bb42763d` |
| `geo910-c1-s1-n12/lesson.md` | `4fbce3c61250ce954f83f3bad778eb2e8bd3b82aac7358fa8a137172adf5f60a` |
| `geo910-c1-s1-n12/lesson.json` | `e585e773b7145ed2a3a2a31e3adade9a6f0038bce6f6cf309d195ab9c6538458` |
| `geo910-c1-s1-n12/exercises.json` | `0c59f155288c31ae750e671f9e9bccd28f500edbf6dd78cb54924f4088656acd` |

### Original crop identities, observed within their full pages

Prefix: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/`.

| Original | SHA-256 |
| --- | --- |
| `fig-33.png` | `1ca3076d3b1b20fbb51ba3d659ca801dad700909e91be26e142d8bf101dd8e49` |
| `fig-34.png` | `09f1be159a33d71a18464ca64a1b47a4c42fcd04ce2e025b2533646de7d281bf` |
| `fig-35.png` | `aac2989eda9da0f3b285b0b137930b11166b218338c33e4339d99db03e63f864` |
| `fig-36.png` | `ffe0ea1da293252f0a624531370a67e36078ff2218d4b4eef34dd202bf5c3ed7` |
| `fig-37.png` | `920faa61b922f2201fc7c1365685f8303aed56fc2590df814b65fc618fdac988` |
| `fig-38.png` | `92ec64480888b3a67b21679dc81dad02914572978f145218e2bdd19b033e4665` |
| `fig-39.png` | `15eef343db5d6ea852b928e6f6297a913b82cba9904224c8d7abb54acdb769f6` |
| `fig-40.png` | `81e0533f9970ea0b8a2fa101d98d2274756c37734a7a35dd596fb338e7b9428d` |
| `fig-41.png` | `4c7a690d52fce2fa48ef27eb13322a42b91d3259346d81c6628362dc82b9ebe0` |

### Read contracts

| Input | SHA-256 |
| --- | --- |
| `.claude/skills/ld-s10y-lesson/SKILL.md` | `13381a5bdd0b6342dae7af217cfbdced2f3a0c71629d3ee90b4c945a9e721c49` |
| `.claude/skills/ld-s10y-answer/SKILL.md` | `afc242003e5bc2f3165dfc5bee60e2e684ed85e2627c7d57ce3501cdd76bfc83` |
| `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md` | `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` |

## A8. Immutable handoff state

StageA is complete:7 original full pages individually observed;35 source prose-array objects accounted for, including21 textual paragraphs;9 original figure roles;all22 numbered tasks and28 explicit/undivided units independently covered;source-worked92 and the unnumbered construction/proof branches retained.

Modern/answer author outputs remain unread. No StageB comparison or semantic approval is claimed. Stop here; wait for immutable modern text/answer disclosure. The handoff message supplies the SHA-256 of this complete report, avoiding an impossible self-hash embedded in its own bytes.

---

## B0. Subsequent authorized StageB: MODERN TEXT ONLY

- Date:2026-11-16. Independent substantive reviewer; one complete modern-text/exercise comparison, after the immutable StageA freeze.
- StageA above is a historical source-only record, retained without amendment. Its original46423-byte prefix had SHA-256 `bb062ffaffc3228a9c900c5311aa2ba6ab0eccfebdcfcb6f7b3da0b5e382d656`. This appendix changes only the subsequent review state.
- Disclosure order: first read `T/tmp/geo910-n11-n12-modern-author.md`, then all four current n11/n12 lesson/exercises templates. `T` is `.intentfold/tickets/STEMROBIN-184`.
- Reviewed actual learner text, every staged object/field, declarations, source bindings and official prose-flow output. Reused StageA's independently frozen source observations/solutions; did not reopen original images/crops or repeat source solving.
- Answer-prose author outputs are NOT yet disclosed and were NOT read. No answer-key, choice, image-spec or other reviewer material was read. Exercise92's source-worked solution remains part of the disclosed exercise text, not a separately consulted answer artifact.
- The author report is provenance, not semantic approval. Its declared four hashes were independently matched to current file bytes before comparison.

## B1. Verdict

**PASS - both current n11/n12 modern lesson and written-exercise templates, for this text/source-fidelity scope.**

No new semantic discrepancy, dropped hypothesis, changed mathematical span, omitted task/subpart, lost source-worked proof branch, covert strict-parallel convention or unsupported orthogonal-projection assumption was found.

All35 prose-array objects are retained: n11's21 and n12's14, including21 textual paragraphs and14 figure/caption objects. All22 exercises85-106 and their28 explicit/undivided task units are retained.106 still asks for both quantities. No new solution was inserted into an originally unsolved task; original self-proof/omitted-proof statuses remain.

This PASS does not declare the unresolved source notation correct, does not resolve104(2)'s source feasibility problem, and does not approve answer prose, image content, rendered display, finalization or publication. The unchanged source concerns in A6 remain binding for the eventual answer comparison.

## B2. n11 complete object-level comparison

The indices below identify actual template objects, not hand-calculated prose-flow boundaries.

| Template object / source | Difference checked against StageA | Result |
| --- | --- | --- |
|0 / p0037#11 | “和” becomes “与”; “所得的交线” makes the same theorem statement explicit. No distinct-plane premise is added to Theorem7. | PASS |
|1 / p0038#1 | Three given relations become separate formula lines; all plane/line names and intersections unchanged. | PASS |
|2 / p0038#2 | Given goal becomes a formula line with punctuation outside the math span. | PASS |
|3 / p0038#3 | Self-proof instruction is modernized; only the assigned investigation is limited to distinct $\alpha,\beta$. No proof is supplied or theorem-domain restriction substituted. | PASS |
|4-7 / p0038#4-7 | Fig33, fig34 and both captions are unchanged in order, IDs, label/text, source refs and all original core fields. | PASS |
|8 / p0038#8 | “可以且只可以” retains BOTH existence and uniqueness through an unrestricted known point. | PASS |
|9 / p0038#9 | Short-paragraph layout retains $A\notin\alpha$, fig34, existence from section10 and the transition to uniqueness. Moving the section10 reference earlier does not change its referent. | PASS |
|10 / p0038#10 | Full source contradiction retained: second $\beta_1$ through $A$, parallel to $\alpha$ but distinct from $\beta$; Axiom5; intersection $m$; skew $l$ in $\alpha$; plane $\gamma$ through $A,l$; traces $b,b_1$; BOTH parallels to $l$; parallel-axiom contradiction; rejection of the second plane. Paragraph breaks do not omit or detach any step. | PASS |
|11 / p0038#11 | Separate $B\in\alpha$ branch remains, including the same plane $\alpha$ as the unique parallel plane and the source proof-ending square. No “outside the plane” condition is generalized to all points. | PASS |
|12 / p0039#1 | Corollary's “每一个” becomes “都”, preserving the common comparison plane and permitting coincidence. | PASS |
|13 / p0039#2 | Self-proof remains; contradiction is a suggested method with fig35, not a supplied proof. | PASS |
|14-17 / p0039#3-6 | Fig35, fig36 and both captions remain exact core objects in their original positions. No figure naming repair was made by text authoring. | PASS |
|18 / p0039#7 | “分别过” preserves construction of one plane through EACH skew line, with the constructed pair parallel. | PASS |
|19 / p0039#8 | Complete source-worked method retained, including arbitrary $M\in a$, literal $a_1$ parallel to $b_1$, plane $\alpha$ through $a,a_1$, analogous $\beta$, and the parallel-plane criterion. This does not silently replace $b_1$ or resolve A6-R1. | PASS, source concern retained |
|20 / p0039#9 | Source assertion of a unique solution is unchanged in meaning. | PASS |

The theorem8 source proof remains a contradiction argument; template wording does not present fig34's incompatible hypothetical planes as a newly verified spatial configuration. The corollary and unnumbered construction remain complete distinct conceptual sections.

## B3. n12 complete object-level comparison

| Template object / source | Difference checked against StageA | Result |
| --- | --- | --- |
|0 / p0041#6 | Modern introduction still covers THIS and NEXT section's drawing rules, then introduces concepts. It does not include the incomplete n13 opening as n12 content. | PASS |
|1 / p0041#7 | Full definition retained: $\alpha$ and intersecting $l$, arbitrary $A_1$, $l_1$ parallel to $l$, image point $A$ on $\alpha$, projection direction, point-image terminology, and the image SET $\phi$ of all points of $\phi_1$. Sentence/paragraph flow does not restrict $A_1$ to a pictured off-plane case or replace oblique projection with perpendicular projection. | PASS |
|2-5 / p0041#8-11 | Fig39, fig40 and both captions remain exact core objects and source refs, in order after the definition. | PASS |
|6 / p0042#1 | Paperboard/wire models, wall shadows and figs40/41 remain. The Sun-distance explanation remains an APPROXIMATION to parallel rays, without new distance/date/history assertions. | PASS |
|7-8 / p0042#2-3 | Fig41 and its caption remain exact core objects and source refs. | PASS |
|9 / p0042#4 | Regularity belongs to the SOURCE hexagon, while its image is merely a polygon. Varying its plane relative to the wall remains. The clause limiting the ensuing properties to $l$ not parallel to the projected line/segment is complete and immediately precedes them. | PASS |
|10 / p0042#5 | Property1 unchanged except external sentence punctuation; no universal noncollapse claim is invented. | PASS |
|11 / p0042#6 | Property2 unchanged except external sentence punctuation; no distinct-image restriction is inserted. | PASS |
|12 / p0042#7 | Demonstrative “这两条” preserves the ratio of projected/original lengths of the SAME two parallel segments. No absolute-length or nonparallel-ratio preservation is substituted. | PASS |
|13 / p0042#8 | Source proof omission remains. StageA's independent proofs were not added to modern learner prose. | PASS |

The guard is explicitly “叙述以下性质时”, not an added assumption imposed on all later exercises. Thus the collapse/exception tasks remain meaningful. No new numerical, historical or cultural declarations are needed for these source-bound scenarios.

## B4. Complete22-task/subpart comparison

| Task / source | Retained learner task and changed wording | Result |
| --- | --- | --- |
|85 / p0039#11 | Actual text unchanged; two DIFFERENT parallel planes and ALL possible line positions retained. | PASS |
|86 / p0039#12 | Actual text unchanged; two intersecting planes cut by another plane and the possibility question retained. No converse supplied. | PASS |
|87 / p0039#13 | Modern connective/punctuation only; entire plane-intersection proof task retained. Coincident comparison planes not excluded. | PASS |
|88 / p0039#14+p0040#1 | Original punctuation regularized to “88. 证明：”; complete cross-page LINE-intersection proof task retained without confusing it with87. | PASS |
|89(1)/(2) / p0040#2 | Numbered sequence and both tasks retained: complete AND prove the parallel-segment theorem; separately investigate equal-length NONparallel segments. Two distinct parallel planes and fig37 remain in both applicable contexts. No theorem conclusion is filled in. | PASS |
|90 / p0040#7 | Construction through the given line AND investigation of solutions retained. “作一个” identifies the requested plane, not a promise of existence/uniqueness for every input; no initial line-plane position is added. | PASS |
|91 / p0040#8 | All FOUR givens and the goal remain. Literal second intersection is $\alpha_1\cap\beta=c_1$, NOT $\alpha_1\cap\beta_1=c_1$. The unused $\beta\parallel\beta_1$ premise is neither removed nor reinterpreted. | PASS |
|92 / p0040#9 | Full source-worked task/answer retained: parallelepiped, $A,C,M\in A_1B_1$, fig38, $AC/MN$ face traces, top trace parallel to $(AC)$, section11/Theorem7 reference, $[MN]\parallel[AC]$, $NC$, trapezoid $AMNC$, BOTH endpoint cases and Axiom4 uniqueness. $M$ is not changed to an interior-only point. Blank lines separate task, method and endpoint branches without deleting source content. | PASS |
|93 / p0040#10+p0041#1 | Full cross-page section construction retained: tetrahedron $ABCD$, $M$ INTERIOR to $AB$, plane parallel to face $DBC$. No midpoint condition added. | PASS |
|94 / p0041#2 | “一个顶点” is the source's arbitrary vertex, not a named/restricted vertex. Plane parallel to the opposite face AND intersection lines with the PLANES CONTAINING all other faces retained. No finite-face substitution. | PASS |
|95 / p0041#3 | “分别为” makes the original ordered attribution explicit: $M$ interior to $AD$, $N$ interior to $B_1C_1$. Both section points and direction parallel to $AB$ retained. No equal fractions or midpoint data added. | PASS |
|96 / p0041#4 | Cube, vertex $B$ and midpoints of BOTH $CC_1$ and $A_1D_1$ retained; spacing/punctuation only. No independently derived section/lengths leaked into the task. | PASS |
|97 / p0042#10 | Three DIFFERENT points and all possible projected point counts retained. No noncollinearity assumption added. | PASS |
|98 / p0043#1 | Actual text and filled raised marker unchanged; projection of a PROJECTING line retained, not an arbitrary noncollapsing line. | PASS |
|99(1)/(2)/(3) / p0043#2 | All three source objects retained in natural numeric order: plane, half-plane, angle not equal to a straight angle. The image-possibility predicate applies to this shared list. Filled raised99 marker retained. No boundary-ownership, zero-angle or new angle-interval premise is inserted. | PASS |
|100(1)/(2) / p0043#3 | Shared “在什么情况下” stem and BOTH point/line fixed-image questions retained. Hollow raised100 marker preserved. “与” for “同” changes no equality condition. | PASS |
|101 / p0043#4 | Actual exception question and hollow raised marker unchanged. No strict/distinct-image convention silently imposed. | PASS |
|102 / p0043#5 | Equal source/image length and possible segment-plane relationships remain an open question. No perpendicularity or necessary-parallel conclusion added; A6-R3 still applies to a later answer. | PASS |
|103(1)/(2) / p0043#6 | BOTH UNION-image questions retained, separately for intersecting and skew source lines. “投影到” changes no set or condition; no noncollapse restriction is added. | PASS |
|104(1)/(2) / p0043#7 | Decorated first-subpart assertion/converse question and second direction construction both retained. $a,b,\alpha,l$ unchanged; no feasibility, point-location, noncollapse or perpendicularity premise invented to remove A6-R4. | PASS, source feasibility concern retained |
|105 / p0043#8 | “引” becomes “引出”; three noncoplanar rays from ONE point remain. Literal “并集和射影” retained, not replaced by “并集的射影” or a filled region. | PASS, source wording concern retained |
|106 / p0043#9 | SEGMENT $AB$ meets the plane at $M$; image SEGMENT $A_1B_1$; $m$, $p:q$ and BOTH requested lengths unchanged. Data and request split into readable lines. No positivity, endpoint, external-division or orthogonal-projection assumption added. | PASS |

The task/subpart sequence remains85-106, with no omission, duplication or artificial decomposition into new exercises. Raised filled/hollow source markers and104's decorated first subpart are preserved. Numerical subpart sequences remain naturally ordered; no forced Latin relabelling is introduced.

## B5. Figure ownership and placement: text-level check only

- n11 prose indices4/5 retain figs33/34, followed by their captions6/7, between the source's Theorem7 self-proof instruction and Theorem8 statement. Indices14/15 retain figs35/36 with captions16/17 between the corollary self-proof and the construction problem. This is source placement, not an image-review judgment.
- n11's source figure metadata still lists33-38. Exercise89 alone retains fig37;92 retains fig38. Other written tasks have no invented figure reference.
- n12 indices2/3 retain figs39/40 with captions4/5 after the definition. Fig41/caption indices7/8 remain between physical motivation and the regular-hexagon observation/properties guard.
- All14 figure/caption core objects, their original text/labels, IDs, printed pages and source refs match the frozen faithful objects exactly. Their staging change/numeric/history arrays are empty.
- Figure templates, specs, original crops, modern assets and rendered previews were not opened or approved in StageB. Prepared placeholders remain placeholders; this report does not declare any image workflow complete.

## B6. Actual official prose-flow evidence

Ran the existing read-only `prose_flow.mjs --json` once for each current lesson template. Both processes exited0. These counts/indices are actual helper output, NOT manually counted paragraphs. No render/finalize or repeated author text-validator run.

| Template | Actual final paragraphs | Actual resolved breaks | Concept boundaries |
| --- | --- | --- | --- |
|n11 lesson |17 | `[4,11,13]` | Theorem7 self-proof to Theorem8; complete Theorem8 proof INCLUDING the on-plane branch to corollary; corollary self-proof to skew-line construction. |
|n12 lesson |9 | `[3,5]` | Complete point/figure projection definition to physical motivation; complete hexagon observation AND nonparallel guard to property1. No split inside the guard or between related properties. |

All FIVE stored `{before,after}` pairs match the actual adjacent final-paragraph texts. Exact helper-returned boundaries:

```json
{
  "n11": [
    {
      "index": 4,
      "before": "请自行证明（图 33），只需研究平面 $\\alpha$ 和 $\\beta$ 不相同的情形。",
      "after": "定理8. 过一个已知点，可以且只可以作一个平面与已知平面平行。"
    },
    {
      "index": 11,
      "before": "当点 $B$ 属于 $\\alpha$ 时，无须详细证明。\n此时，过点 $B$ 且与 $\\alpha$ 平行的唯一平面就是平面 $\\alpha$ 本身。\n$\\blacksquare$",
      "after": "推论。\n如果两个已知平面都与另一个平面平行，那么这两个已知平面平行。"
    },
    {
      "index": 13,
      "before": "请自行证明，可以尝试用反证法（图 35）。",
      "after": "问题。\n分别过两条异面直线作平面，使这两个平面平行。"
    }
  ],
  "n12": [
    {
      "index": 3,
      "before": "这样得到的点 $A$，叫作平行于直线 $l$ 投影时，点 $A_1$ 在平面 $\\alpha$ 上的射影，简单地说，点 $A$ 是点 $A_1$ 的平行射影。\n已知图形 $\\phi_1$ 的所有点的平行投影组成的集合 $\\phi$，叫作图形 $\\phi_1$ 的平行射影。",
      "after": "图形的平行射影这一概念，来自对阳光下纸板或铁丝模型投在墙上影子的观察（图 40 和 41）。\n由于太阳距离地球十分遥远，可以近似地把太阳光线看作平行的。"
    },
    {
      "index": 5,
      "before": "正六边形 $A_1B_1C_1D_1E_1F_1$ 的模型投在墙上，形成多边形 $ABCDEF$ 的影子（图 41）。\n改变六边形所在平面相对于墙面的位置，观察影子的变化，可以猜想平行投影的几个性质。\n叙述以下性质时，假设沿平行于直线 $l$ 的方向进行投影，而且直线 $l$ 与被投影的直线或线段不平行。",
      "after": "性质1. 直线的射影是直线。"
    }
  ]
}
```

The actual normalized paragraphs retain each complete sentence/formula context. Theorem8's contradictory hypothesis, deduction and rejection are separated for reading but remain sequential; its on-plane branch remains before the next concept. The projection-definition set sentence remains in the same definition before physical motivation. The properties remain conditional on the immediately preceding guard. This is a text/anchor check, not a screenshot or visual-display test.

## B7. Independently checked binding/declaration evidence

A bounded read-only in-memory comparison of the four disclosed JSON files and the frozen faithful source identities exited0. This was an equality/hash/span inspection, not a second run of `edition.validate_text` or a substitute for the substantive comparison above.

- All four live original-layer JSON byte hashes still equal StageA A7. Each template's `source.path` identifies the correct original lesson/exercises file; `source.sha256` equals that frozen file hash; `source.data` is structurally equal to the WHOLE corresponding source JSON.
- Every modern object's `source_text` exactly equals its original counterpart's text. All original core fields other than permitted text/lines layout remain equal, including kind, ID, label, number/source_number, group/group_id, pages/source_refs, figures/figure_refs and printed-page metadata.
- Every ordered `$...$` mathematical-span sequence equals its source counterpart after removal of internal whitespace only. No formula substitution, deleted math expression, altered marker or new mathematical premise was found. In particular91's literal $\beta$ and the n11 worked-construction $b_1$ are unchanged.
- All22 exercise `lines` arrays exactly equal `text.split("\n")`, including the blank paragraphs in source-worked92. The lesson prose does not use an exercise `lines` field.
- All change flags are from `modernized`/`layout`; unchanged figure/caption objects have no change flags. All checked `numeric_changes` and `historical_entities` arrays remain empty. Both lesson `errata` arrays are empty, consistent with no source math correction being attempted.
- Chinese sentence punctuation in the actual rewritten text remains outside the math spans. Formula names and naturally ordered source numerical/decorated markers retain their meaning; no unsupported cultural entity, measured datum, angle range or new endpoint convention appears.

Original preparation snapshots were not separately disclosed/read. Accordingly, this review does not claim independently to have reproduced the author's before/after preparation-projection hashes; it establishes current binding and protected-field equality directly against the already frozen authoritative source.

## B8. Immutable StageB text input hashes

SHA-256 of actual file bytes; all four match the author handoff's frozen values.

| Input | SHA-256 |
| --- | --- |
| `T/tmp/geo910-n11-n12-modern-author.md` | `54bb542f665d12192406cfd40c707bb986909ee55467f5e35c734522ea8c213c` |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n11/lesson.template.json` | `8d212df4cac2fbd5339d047c8ae2d30a9af218df5aecc954e1fe389bbdf1e961` |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n11/exercises.template.json` | `14c318a65cfe6cd7711541b71dee6dcc7889b17e2e1d59e9f79e6f4673242ea4` |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n12/lesson.template.json` | `53c17f107bcbeeec890dff9d4ee5ce9ef28ce3d65aa801b8fefd35380debb335` |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n12/exercises.template.json` | `5c98eaf3a164c86b2767356f6dd2134a3030f6f2f8e9d51c1f1e357806f172b0` |
| `.claude/skills/ld-s10y-lesson/tools/prose_flow.mjs` | `f2a16357e2a0d5f8541b0cb401c5193c9cb10f6333dc16f92d5c7a18a5bee309` |
| `.claude/skills/ld-s10y-lesson/tools/htmlfrag.js` | `c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6` |

## B9. Source concerns retained; answer comparison pending

- A6-R1's unnumbered construction identity concern remains literally in the modern prose. Text fidelity PASS is not certification that this source label concern has been repaired.
- A6-R2's redundant91 premise remains unchanged and its true literal theorem is not silently rewritten.
- A6-R3/R4 remain available to the later answer review:102 cannot presume orthogonal projection;104(2) must address its allowed no-solution input configuration. Current modern task prose preserves, rather than resolves, the source questions.
- A6-R5's105 conjunction, R6's inherited boundary/angle definitions, R7's106 ratio degeneracy and R8's property-specific scope remain as frozen. No guessed erratum or extra mathematical assumption was inserted.
- Standard-answer author outputs remain unread. The independent StageA full solutions are reserved for their eventual single comparison; this text verdict gives no answer-prose approval.

Only this appendix was written. No author template, source, answer, choice, image, tool or index was changed; no finalize/render/browser/Git/DB/network operation was performed. Stop at this immutable modern-text review. The handoff supplies the current report hash and confirms unchanged StageA prefix bytes.

## C0. Subsequent authorized StageC: sole ANSWER-PROSE comparison

Chronology: after freezing the separate n79 original-only inventory, reused the existing independent A1/A3/A4/A6 mathematics and wrote the isolated A6-R1 construction decision. Only then opened the disclosed immutable answer prose. No original image, source task, modern template, figure-author material, other reviewer, choice or parent solution was reopened/read for this comparison.

The preceding COMPLETE StageA/B record is retained as a68553-byte prefix, SHA256 `acdbaa657fd5e70a55203864a398371903d2fa504304e91fef8d8444c8075fab`. Original StageA remains its46423-byte prefix, SHA256 `bb062ffaffc3228a9c900c5311aa2ba6ab0eccfebdcfcb6f7b3da0b5e382d656`. Statements in A8/B9 that answer output was unread describe those earlier chronology points; they are not overwritten.

Disclosed/read answer input:

- Path: `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n11-n12-source-answer-prose.md`.
- Actual bytes31698;485 lines.
- Actual SHA256 `1f802a1ef610090215d39d0dfb448c96a04c5d23714f15b5af16ac6c310a32e1`, matching the disclosed immutable identity.
- Author: Peirce; reviewer here is independent of that authorship.
- Scope: one full substantive comparison of all22 tasks85-106, all28 explicit-subpart/undivided task units and both quantities in106. This is prose-stage mathematics/coverage review only, not a formal answer-key JSON/prompt/display gate.

## C1. Verdict

**PASS: no substantive answer-prose finding.** Every source request is answered with a specific result and appropriate proof, construction or full case analysis. The independent frozen results and the author's results agree; different auxiliary names and valid coordinates are not disagreements.

The source-defined broad parallel/coincidence convention and general oblique parallel projection are preserved. Genuine missing definitions are not guessed; condition-aware answers explicitly retain them. No theorem recognition or method slogan substitutes for required proof/construction.

## C2. Complete n11 answer comparison

| Task / source binding | Comparison against frozen independent answer | Verdict |
| --- | --- | --- |
|85 / p0039#11 | Exactly different parallel OR skew lines, excluding intersection/coincidence because the two source planes are explicitly different. Both existence examples satisfy the hypothesis. | PASS |
|86 / p0039#12 | Valid different-parallel trace example using x=0,y=0,x+y=1; complete third-plane relation to the original common line also covers coincident traces. Assumes actual line intersections, not whole-plane equality. No false converse of Theorem7. | PASS |
|87 / p0039#13 | Coincident source planes are handled first; otherwise corollary contradiction proves the second proper line intersection. Equality of the transverse plane with the second plane is excluded consistently. | PASS |
|88 / p0039#14+p0040#1 | Complete synthetic transversal-plane proof matches frozen analytic/synthetic alternatives. Starts with a unique-point line-plane intersection, not containment, and proves the second intersection unique. | PASS |
|89(1)/(2) / p0040#2 | Completes equal lengths, proves the parallelogram case AND coincident-support case; second subpart supplies equal-length nonparallel segments between the same distinct parallel planes. All endpoints and length/direction checks are correct. | PASS |
|90 / p0040#7 | Explicit construction and uniqueness for the disjoint-parallel branch, same-plane unique solution for containment, and no-solution proof for a transverse line. Complete0/1 solution investigation; no unprinted outside-line condition. | PASS |
|91 / p0040#8 | Uses literal alpha1 intersect beta=c1 with SAME cutting plane beta. The extra beta parallel beta1 remains as an unused given. Coincident alpha/alpha1 gives coincident, broadly parallel traces. No guessed beta1 correction. | PASS |
|92 / p0040#9 | Full original worked method retained: AC, upper trace through M parallel AC, N on B1C1, complete AMNC boundary and Theorem7 reason, plus Axiom4 uniqueness. Affine calculation x-y=tz proves general trapezoid and BOTH endpoints M=B1 (triangle AB1C), M=A1 (parallelogram AA1C1C). No interior-only restriction, perpendicularity or equal-edge assumption. | PASS |
|93 / p0040#10+p0041#1 | P/Q correspond to independent U/V; all three section edges constructed/proved parallel to opposite-face edges. Common fraction t strictly between0/1 proves interior positions and complete triangle. Endpoint limits are explicitly not original allowed inputs. | PASS |
|94 / p0041#2 | Concrete unique plane and ALL THREE extended intersection lines with the other face-containing PLANES. Third line follows Theorem7; finite tetrahedron contact only at A is distinguished from requested infinite traces. | PASS |
|95 / p0041#3 | Complete parallelogram MPNQ construction; independent s/t retained. Equation y=s+(t-s)z proves the full boundary, uniqueness and allowed s=t branch. No rectangle/midpoint/equal-fraction invention. | PASS |
|96 / p0041#4 | Author U/V/W/T match independent X/Y/Z/P. Complete five-edge boundary, fractions1/3 and3/4, plane3x-2y+4z=3 and noncollinearity match. Alternate valid construction extends BU to R on B1C1, then RV to S on A1B1, then BS to T. Here R=(1,2,1), S=(-1/3,0,1), so T=(0,0,3/4); these are construction checks, not new source data. All five face incidences/order are correct. | PASS |

## C3. Complete n12 answer comparison

| Task / source binding | Comparison against frozen independent answer | Verdict |
| --- | --- | --- |
|97 / p0042#10 | All possible counts1/2/3 with exact fiber conditions and valid examples. Fixed-triple restrictions are honestly separated: collinear triple cannot yield2; noncollinear cannot yield1. Additional source-plane/direction restrictions stated by author are consistent with the affine model. | PASS |
|98 / p0043#1 | Projecting line collapses to its one intersection point with alpha, with full fiber proof. Does not misuse the preceding noncollapse property. | PASS |
|99(1) / p0043#2 | Entire alpha or a line according to rank2/rank1; never a point. Correct direction and intersection explanation, including allowed containment/equality cases. | PASS |
|99(2) / p0043#2 | Half-plane, line or half-line according to projection direction versus source plane/boundary. Includes boundaryless versions when the inherited source definition excludes the boundary. No false point or whole-plane branch; no invented closed-half-plane given. | PASS, definition-dependent endpoint retained |
|99(3) / p0043#2 | For two distinct nonopposite boundary rays: nonstraight angle, ray or whole line, with full rank/side-case reasoning and valid examples. Zero-angle permission could add a point; filled angle-domain interpretation is separately conditional. The author explicitly records absent inherited definition, not an unconditional unique answer list. | PASS, genuine definition gap retained |
|100(1)/(2) / p0043#3 | Point fixed iff it belongs to alpha; whole line fixed as set iff contained in alpha. Both directions proved. Collapsed line does not masquerade as equality with its full source line. | PASS |
|101 / p0043#4 | Exact exception to a LINE-image claim is projecting-direction collapse. Distinct projecting source lines give distinct points; coincident noncollapsed image lines remain broadly parallel. Strict-parallel alternative expressly separated. | PASS |
|102 / p0043#5 | Parallel-to-alpha sufficient, NOT necessary for oblique projection. Author's perpendicular and oblique examples are valid; finite-segment intersection is separated from supporting-line intersection. Exact criterion k=0 OR k|d|^2=2(v dot d) agrees with frozen h-form criterion. Orthogonal-only necessity is conditional, not invented. | PASS |
|103(1) / p0043#6 | Union is two intersecting lines or one line; common image vertex/rank reasoning rules out all false types and covers a collapsed side. | PASS |
|103(2) / p0043#6 | Exactly intersecting lines, different parallel lines, or one line plus an EXTERNAL point. Complete fiber-plane proof excludes coincident images and on-line collapsed point. All three source-skew existence examples are valid. | PASS |
|104(1) / p0043#7 | Explicit skew-source/different-parallel-image counterexample refutes converse even under a strict image-parallel reading. Source independence and skewness are justified; broader coincidence only strengthens falsity, not required for this counterexample. | PASS |
|104(2) / p0043#7 | Concrete construction avoids all three forbidden directions in delta when its direction plane differs from alpha's. Necessity and sufficiency match frozen W/H criterion. Infinitely many valid directions in feasible branch; genuine NO SOLUTION if W=H, with exact allowed countercase. No unprinted feasibility condition silently added. | PASS |
|105 / p0043#8 | Both literal source UNION and its IMAGE addressed; no replacement of “和” by “的”. Source is three independent common-vertex rays, not a filled solid angle. All image types, collapse/same/opposite/three-distinct cases, rank exclusion and valid independent examples match StageA. | PASS |
|106 / p0043#9 | BOTH lengths mp/(p+q), mq/(p+q), with affine/internal-division proof. Positive-ratio case, admitted endpoint weights and undefined0:0/collapsed image all retained. Valid signed representatives are allowed only when resulting normalized weights are nonnegative. No external-division p-q formula or invented unconditional positive-domain source premise. | PASS |

## C4. Proof/construction and presentation fitness

At this prose stage all proof/construction/open classifications contain full reasoning.90 and104(2) investigate feasibility and solution count;92-96 give usable constructions and complete section boundaries, rather than named answers alone.92's source-worked method is preserved and independently checked, not taken on trust from a book-answer page.

For later formal delivery, construction/proof/open responses should remain ungraded with full displayAnswer and parts=[] as frozen in A5. No automatic theorem/proof scoring is approved by this PASS.106's two quantities may only receive deterministic grading under the represented valid ratio/domain. This file contains no answer-key fields, prompt staging, interaction conversion or actual grading record to validate.

Definition gap99 is a real future display-binding issue: endpoint ownership and angle point-set/zero-angle conventions need an authoritative definition or an expressly conditional display. The current author's conditional prose is adequate and does not guess one. It is not necessary to invent a source correction to pass this prose comparison.

## C5. Input bindings and separation from the isolated construction decision

The author's declared six faithful lesson/exercise/image families were compared to the already frozen A7 identities, without reopening those sources. All four faithful JSON hashes match A7; all nine declared original33-41 hashes match A7. All four declared edition-template hashes match frozen B8. This is equality to the reviewed immutable inputs, not a new inspection of whatever later files may exist.

All22 task/source bindings used above match the frozen A3/A4/B4 references. No task was omitted or duplicated; all explicit subparts in89/99/100/103/104 and both requested lengths in106 are covered.

The separate report `geo910-n11-construction-math-decision.md` has SHA256 `b0bd472d69bd552f5aa59b9b3301238ca2fe8a46e575667970f19bdbb30825ca`. It confirms the local mathematical defect of p0039#8 under fixed a/b/b1 roles and support for a1 parallel b; it is NOT an erratum registration or evidence that source/modern prose changed. The unnumbered construction is not secretly added as a23rd written task. A6-R1 and the historical B2 literal-text assessment remain untouched.

## C6. Handoff/stop

Sole answer-prose comparison completed: PASS all22 requests,28 explicit/undivided task units,106's two quantities, with99's real definition dependencies retained. No formal JSON/template/prompt gate has occurred or is implied.

Only this appendix was added to this existing independent report. No author prose/template/source/image/spec/tool/index was edited. No validators, render, source/text gates, browser, network, Git, DB or other-chat actions were used. StageA/B bytes are retained; handoff includes current appended-report SHA256 and prefix identities. The newly authorized n79 figure StageB is a separate subsequent assignment, not part of this verdict.
