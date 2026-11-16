# STEMROBIN-184: Independent Figure Source-First StageA Freeze

Date: 2026-11-16 (Europe/Dublin).
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Scope: new t14 fig-55 and fig-56 only; StageA only.
State: SOURCE INVENTORY FROZEN, CANDIDATE UNDISCLOSED, NO STAGEB VERDICT.

## Independence And Read Boundary

This inventory was made directly from the two original PNGs named by the
specified contexts and the complete approved DRAFT edition text. No candidate
was disclosed before this freeze.

Read: repository entry/engineering instructions, the `ld-s10y-image` SKILL,
`references/figure-spec.md`, `references/quality-gate.md`, the two specified
contexts, the complete approved lesson JSON, and the complete approved exercise
text for all 32 exercises. The large exercise JSON's first terminal display was
truncated; all 32 current top-level `text` fields were subsequently read in an
untruncated structured JSON display. Embedded source transcriptions are not a
replacement for current approved top-level text.

Not read: new author report, candidate manifest, candidate FigureSpec/SVG,
render/probe evidence, answers, choices, derived precursor, earlier independent
math freezes, or prior gate. No independent full mathematical re-solve was
performed. The worked construction already printed in approved exercise 133
is authorized text, not an answer-key input.

No source/figure edit, pipeline command, test, browser, Git operation, database
operation, app operation, or other-chat operation was performed. The only
written artifact is this new scratch Markdown. Existing edits were preserved.
Fig-54 is outside the inventory even though the full approved text mentions it.

## Raw Input Binding

All hashes below are SHA-256 of the complete raw file bytes, not hashes of
normalized text, a JSON subset, decoded pixels, or a generated rendering.
The two authority hashes exactly match the supplied approved DRAFT hashes.
Both raw PNG hashes exactly match their respective context `sourceImage.sha256`.

| Input | Absolute Path | Raw SHA-256 |
| --- | --- | --- |
| Full approved lesson JSON | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-t14/lesson.json` | `1d3aba91bb9d4bc7afef929bc13c504deb280504b293dfb5b5457ff6d11c59ef` |
| Full approved exercises JSON | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-t14/exercises.json` | `4fe2de5b67d42e63ceb422b8da1d6d47dc68071de1cfca348ba1fe987d09b16f` |
| Fig-55 context JSON | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-55/context.json` | `b5a9e30a78fc7444c8c71720118db94ee52ea6cc2c6eb0a33e6b2910d924661a` |
| Fig-56 context JSON | `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/s10y-image/batch007/9-10g/fig-56/context.json` | `e9a36dc98abe5fa24c9703b67215b8a6b7eee7029288803f3ce29cffb3d066a0` |
| Fig-55 original PNG, 1089 x 1215 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-55.png` | `6f203be966b1afd76d7937ac2784d2663361e831eac293503d3163265375ce2e` |
| Fig-56 original PNG, 1149 x 409 | `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-56.png` | `18b6d23fc5f1cdcb5d6b233929a956854fa501315873dab8c056b70459821c93` |

## Image Ledger

| Image Load | Source | Detail | Opens |
| --- | --- | --- | --- |
| 1 | Original fig-55 PNG above | `original` | Exactly once |
| 2 | Original fig-56 PNG above | `original` | Exactly once |

Current batch image loads: 2/8. Current context image loads: 2/24.
Reopens: 0. Crops: 0. Candidate/render/probe image loads: 0.
Six batch slots are reserved for a later single StageB render/probe inspection
after explicit disclosure. A ninth batch image is forbidden. This ledger
continues across turns; waiting or returning text does not reset it.

## Authority And Request Boundary

The current edition lesson is `status: draft`; the user's approval and the
raw hashes above identify the authority for this inspection. The contexts
provide source paths and figure-linked exercises, but their excerpts do not
replace the complete approved files.

Relevant lesson note, copied from current `.prose[0].text`:

> * 在本题和以后某些习题里，作图均指作出直观图.

Relevant current exercise text is copied below without correcting punctuation,
notation, or mathematical claims. Chinese is retained here solely to freeze
the approved text; it is not proposed visible figure labeling.

### Exercise 133: Complete Approved Text

```text
133. 已知四面体$ABCD$和分别属于面$ABC$、$ABD$和$ACD$的点$M$、$N$、$P$（但不属于棱）. 作棱锥的截面$MNP$. 解. 分析. 设$(MNP)=\alpha$. 我们来说明怎样作平面$\alpha$同面$ABC$的交（图55）. 点$M$是$\alpha$和$(ABC)$的公共点. 如果$(NP)\nparallel(ABC)$（图55，a），那么平面$ABC$和$\alpha$的第二个公共点可能是直线$NP$和$N_1P_1$的交点，其中$(N_1P_1)=(ABC)\cap(NPD)$. 如果$(NP)\parallel(ABC)$（图55，b），那么平面$\alpha$和$(ABC)$的交线平行于$(NP)$（§7，定理3）.作法.
1) $(N_1P_1)=(NPD)\cap(ABC)$；
2) $K=(N_1P_1)\cap(NP)$（对于$(NP)\nparallel(ABC)$的情形，图55，a）；
3) $(KM)=\alpha\cap(ABC)$，$[EF]=\alpha\cap\triangle ABC$. 如果$(NP)\parallel(ABC)$，那么$[FE]\parallel[NP]$（图55，b）；
4) $(EN)=\alpha\cap(ABD)$，$[EH]=\alpha\cap\triangle ABD$；
5) $(FP)=\alpha\cap(ACD)$，$[FG]=\alpha\cap\triangle ACD$. 截面$EFGH$满足问题的条件.研究. 问题有唯一解（公理4）. 截面可能是四边形（图55a，b）或者是三角形（图55，c）.
```

Text givens: tetrahedron ABCD; M in face ABC, N in face ABD, P in face ACD,
none on tetrahedron edges; section plane alpha = (MNP).
The printed analysis/construction distinguishes NP not parallel to (ABC)
in 55a from NP parallel to (ABC) in 55b, and explicitly allows a triangular
section in 55c. The printed quadrilateral construction must not be treated as
the identical edge-incidence model for every possible M/N/P placement.
The figure's worked edges/hatching are permitted for exercise 133 because
they are already part of this approved worked text and original image.

### Exercise 150: Complete Approved Text

```text
$150^{\circ}$. 已知点$A_1B_1$和它们在平面$\alpha$上的射影$A$、$B$（图56，a）. 怎样作直线$A_1B_1$同平面$\alpha$的交点？
```

Text givens: the two original points A_1/B_1 and their projections A/B in
alpha. Request: construct the intersection of line A_1B_1 with alpha.
The literal adjacent point notation is preserved above, not silently edited.
No intersection point or construction method is supplied by this freeze.

### Exercise 151: Complete Approved Text

```text
151. 已知不在同一条直线上的三点$A_1$、$B_1$、$C_1$及其在平面$\alpha$上的射影$A$、$B$、$C$（图56，b）. 怎样作平面$A_1B_1C_1$和$\alpha$的交线.
```

Text givens: noncollinear A_1/B_1/C_1 and their projections A/B/C in alpha.
Request: construct the intersection line of plane A_1B_1C_1 with alpha.
Exercise-151 separator: UNKNOWN, deliberately not decoded, reconstructed,
or assigned a geometric meaning. Copying the approved literal text above
does not resolve an unidentified source separator. No answer line is added.

## Inventory Conventions

IDs below are independent source requirement IDs, not IDs copied from a
candidate or proposed FigureSpec. Each panel has its own points; identically
named points in different panels must not be merged.

Incidence and point order describe the pictured model, supported by pixels
and the approved labels/text. They are not universal claims about all
tetrahedron sections. Screen orientation, stroke endpoints, and label
placement are visual observations, not measured 3D lengths or angles.

All five panels are instructional. There are no axes, ticks, coordinate
grids, numerical givens, units, dimension arrows, equality marks, or
right-angle marks. No line in either PNG has a semantic arrowhead.
Thin diagonal section hatching in fig-55 is a region cue, not a family of
additional mathematical lines or points.

## Fig-55: Three Panels

Composition: 55a upper-left, 55b upper-right, 55c below, approximately centered.
Each depicts the same named tetrahedron in a separate configuration:
D above, A below/front, B left, C right. Printed subpanel markers are the
historical forms corresponding to approved a/b/c; modern labels must use
the approved a/b/c, not copy historical script. Alpha appears inside each
hatched section. There is no separate infinite-plane outline for alpha.

Common frame requirement `55*-frame`: six tetrahedron edges AB, AC, AD, BD,
CD, BC. AB/AC/AD/BD/CD are solid; BC is dashed and continues behind the
section. The six edges terminate at the named tetrahedron vertices, without
arrows or extensions beyond those vertices. Section and helper lines are
separate from this frame.

### 55a: Nonparallel Worked Quadrilateral

Named point count: 14. Complete labels: A, B, C, D, E, F, G, H, M, N, P,
N_1, P_1, K, plus plane alpha and subpanel a.

| Source ID | Point/Label | Pictured Incidence And Relative Placement |
| --- | --- | --- |
| `55a-A` | A | Lower/front vertex; joins AB, AC, AD. |
| `55a-B` | B | Left vertex; joins BA, BD, dashed BC. |
| `55a-C` | C | Right vertex; joins CA, CD, dashed CB. |
| `55a-D` | D | Upper vertex; joins DA, DB, DC and the two helper lines. |
| `55a-E` | E | On AB and quadrilateral corner; lower-left section endpoint. |
| `55a-F` | F | On AC and quadrilateral corner; lower-right section endpoint. |
| `55a-G` | G | On DC and quadrilateral corner; upper-right section endpoint. |
| `55a-H` | H | On DB and quadrilateral corner; upper-left section endpoint. |
| `55a-M` | M | Within face ABC, on section edge EF; between E and F, left of AD on screen. |
| `55a-N` | N | Within face ABD, on EH; between E and H; also on D-N_1 and K-N-P. |
| `55a-P` | P | Within face ACD, on FG; between F and G; also on D-P_1 and K-N-P. |
| `55a-N1` | N_1 | On AB, on D-N-N_1, on K-N_1-P_1; distinct from E. |
| `55a-P1` | P_1 | On AC, on D-P-P_1, on K-N_1-P_1; distinct from F. |
| `55a-K` | K | Explicit external point left/below B; shared start/intersection of the three drawn left extensions. |

Pictured orders to retain as model facts:

- `55a-order-AB`: B, N_1, E, A.
- `55a-order-AC`: A, F, P_1, C.
- `55a-order-DB`: D, H, B; `55a-order-DC`: D, G, C.
- `55a-order-cut`: E, M, F; E, N, H; F, P, G.
- `55a-order-DN`: D, N, N_1; `55a-order-DP`: D, P, P_1.
- `55a-order-KNP`: K, N, P.
- `55a-order-Kbase`: K, N_1, P_1.
- `55a-order-Kcut`: K, E, M, F.

| Line/Region Requirement | Visible Stroke And Endpoints |
| --- | --- |
| `55a-cut-EH` | Solid section side E-H, carrying N. |
| `55a-cut-FG` | Solid section side F-G, carrying P. |
| `55a-cut-HG` | Dashed upper/back section side H-G. |
| `55a-cut-EF` | Dashed lower/base section side E-F, carrying M. |
| `55a-helper-DN1` | Thin solid helper from D through N to N_1 on AB. |
| `55a-helper-DP1` | Thin solid helper from D through P to P_1 on AC. |
| `55a-helper-KNP` | Solid exterior K-to-N approach; continuation N-to-P appears dashed across the section. Stops at P, without arrow. |
| `55a-helper-KN1P1` | Solid exterior approach from K; interior/base N_1-to-P_1 span dashed. Stops at P_1, without arrow. |
| `55a-helper-KEF` | Solid exterior K-to-E approach; continues as the dashed E-M-F section trace. Stops at F, without arrow. |
| `55a-section` | Hatched quadrilateral with cyclic boundary E-F-G-H; alpha inside. |

K is not inside the tetrahedron or finite section. Its three left extensions
are not interchangeable: they carry respectively N/P, N_1/P_1, and E/M/F.
The pictured N_1/P_1 incidences are tied to this source construction; they
must not be replaced by arbitrary extra points with the same names.

### 55b: Parallel Worked Quadrilateral

Named point count: 11. Complete labels: A, B, C, D, E, F, G, H, M, N, P,
plus plane alpha and subpanel b. No K, N_1, or P_1 label/point is drawn.

| Source ID | Point/Label | Pictured Incidence And Relative Placement |
| --- | --- | --- |
| `55b-A` | A | Lower/front vertex; joins AB, AC, AD. |
| `55b-B` | B | Left vertex; joins BA, BD, dashed BC. |
| `55b-C` | C | Right vertex; joins CA, CD, dashed CB. |
| `55b-D` | D | Upper vertex; solid DA runs through the section's projected footprint. |
| `55b-E` | E | On AB; lower-left quadrilateral corner. |
| `55b-F` | F | On AC; lower-right quadrilateral corner. |
| `55b-G` | G | On DC; upper-right quadrilateral corner. |
| `55b-H` | H | On DB; upper-left quadrilateral corner. |
| `55b-M` | M | Within ABC on E-F, between its endpoints and left of AD on screen. |
| `55b-N` | N | Within ABD on E-H, between its endpoints. |
| `55b-P` | P | Within ACD on F-G, between its endpoints. |

Pictured orders: B-E-A; A-F-C; D-H-B; D-G-C; E-M-F; E-N-H; F-P-G.
N-P is inside the section and is visually parallel to E-F in the oblique
picture. The exact NP parallel (ABC), and EF parallel NP, are approved
text requirements, not merely an inference from similar screen slopes.

| Line/Region Requirement | Visible Stroke And Endpoints |
| --- | --- |
| `55b-cut-EH` | Solid side E-H, carrying N. |
| `55b-cut-FG` | Solid side F-G, carrying P. |
| `55b-cut-HG` | Dashed upper/back side H-G. |
| `55b-cut-EF` | Dashed lower/base side E-F, carrying M. |
| `55b-NP` | Dashed segment N-P across the hatched section; no outward extension or arrows. |
| `55b-section` | Hatched quadrilateral E-F-G-H, alpha inside. |

No D-N_1/D-P_1 construction helpers, finite K intersection, or external
K-to-section extensions are printed here. Do not import them from 55a.

### 55c: Triangular Section With A Different Edge-Incidence Model

Named point count: 13. Complete labels: A, B, C, D, E, F, G, M, N, P,
N_1, P_1, K, plus plane alpha and subpanel c. No H label/point is drawn.

| Source ID | Point/Label | Pictured Incidence And Relative Placement |
| --- | --- | --- |
| `55c-A` | A | Lower/front vertex; joins AB, AC, AD. |
| `55c-B` | B | Left vertex; joins BA, BD, dashed BC. |
| `55c-C` | C | Right vertex; joins CA, CD, dashed CB. |
| `55c-D` | D | Upper vertex; joins DA, DB, DC and two helper lines. |
| `55c-E` | E | On AB; left/lower triangle corner. |
| `55c-F` | F | On AC; right/lower triangle corner. |
| `55c-G` | G | On AD, below D; upper triangle corner, NOT on DC as in 55a/b. |
| `55c-M` | M | Within ABC on E-F, between its endpoints; left of AD on screen. |
| `55c-N` | N | Within ABD on E-G, between its endpoints; also on D-N_1 and K-N-P. |
| `55c-P` | P | Within ACD on G-F, between its endpoints; also on D-P_1 and K-N-P. |
| `55c-N1` | N_1 | On AB, on D-N-N_1, on K-N_1-P_1; here lies between E and A. |
| `55c-P1` | P_1 | On AC, on D-P-P_1, on K-N_1-P_1; here lies between A and F. |
| `55c-K` | K | Explicit external point left/below B; intersection/start of the three exterior extensions. |

Pictured orders to retain:

- `55c-order-AB`: B, E, N_1, A, unlike 55a.
- `55c-order-AC`: A, P_1, F, C, unlike 55a.
- `55c-order-AD`: D, G, A.
- `55c-order-cut`: E, M, F; E, N, G; G, P, F.
- `55c-order-DN`: D, N, N_1; `55c-order-DP`: D, P, P_1.
- `55c-order-KNP`: K, N, P.
- `55c-order-Kbase`: K, N_1, P_1.
- `55c-order-Kcut`: K, E, M, F.

| Line/Region Requirement | Visible Stroke And Endpoints |
| --- | --- |
| `55c-cut-EG` | Solid triangle side E-G, carrying N. |
| `55c-cut-GF` | Solid triangle side G-F, carrying P. |
| `55c-cut-EF` | Dashed base side E-F, carrying M. |
| `55c-helper-DN1` | Thin solid helper D-N-N_1, ending on AB. |
| `55c-helper-DP1` | Thin solid helper D-P-P_1, ending on AC. |
| `55c-helper-KNP` | Solid exterior K-to-N approach; N-to-P appears dashed across the section. Ends at P, without arrow. |
| `55c-helper-KN1P1` | Solid exterior approach from K; N_1-to-P_1 base span dashed. Ends at P_1, without arrow. |
| `55c-helper-KEF` | Solid K-to-E exterior approach, continuing as dashed E-M-F. Ends at F, without arrow. |
| `55c-section` | Hatched triangle E-F-G, alpha inside. No fourth corner or H-G side. |

The source therefore shows a triangular section cutting AB/AC/AD, not a
quadrilateral with a suppressed label. Do not move G onto DC, add H, or
reuse 55a's AB/AC point orders to regularize this panel. No generalized
classification or independent construction proof is claimed here.

## Fig-56: Two Unsolved Given-Data Panels

Composition: 56a left, 56b right. Each has a closed, irregular rounded
plane silhouette, named alpha. The silhouette is a plane cue, not a circle,
ellipse, measured boundary, polygon with named vertices, or coordinate grid.
It is drawn solid throughout. The upper/back contour visibly crosses the
projection segments; those crossings are NOT marked/labeled new points.
No projection segment becomes dashed at the contour.

### 56a: Two Original Points And Their Projections

Named point count: 4. All four points have visible filled round dots.
Complete labels: A_1, B_1, A, B, plus alpha and subpanel a.

| Source ID | Point/Label | Visible Placement And Incidence |
| --- | --- | --- |
| `56a-A1` | A_1 | Upper/right pair's original point, above and left of A; above the back contour. |
| `56a-A` | A | Interior of plane silhouette, right of B and slightly above B on screen. |
| `56a-B1` | B_1 | Left pair's original point, above and left of B; above the back contour, lower on screen than A_1. |
| `56a-B` | B | Interior of plane silhouette, left of A and lower on screen. |

`56a-project-A`: one solid finite segment from A_1 to A, connecting their
dots, sloping down/right and crossing the back contour. No extension beyond
either dot; no arrow or perpendicular mark.

`56a-project-B`: one solid finite segment from B_1 to B, similarly sloping
down/right and crossing the back contour. No extension beyond either dot;
no arrow or perpendicular mark.

The two segments are visually parallel but have unequal pictured lengths;
no exact lengths, equality, or measured projection angle is given. Alpha is
near the left interior. Original-point labels are above their dots; A/B
labels are to the right of their dots. The whole B pair lies left of the A
pair.

Required negative inventory `56a-unsolved`: NO A-B edge, NO A_1-B_1 edge,
NO extended A_1B_1 line, NO intersection point, NO answer trace, NO extra
auxiliary plane, NO triangle, and NO line joining the two projection feet.
The text names the line to be constructed with, but pixels do not draw it.

### 56b: Three Original Points And Their Projections

Named point count: 6. All six points have visible filled round dots.
Complete labels: A_1, B_1, C_1, A, B, C, plus alpha and subpanel b.

| Source ID | Point/Label | Visible Placement And Incidence |
| --- | --- | --- |
| `56b-A1` | A_1 | Left upper original point, above/right of A; highest original point on screen. |
| `56b-A` | A | Left interior projection foot; above B and below C on screen. |
| `56b-B1` | B_1 | Middle original point, above/right of B; lowest original point on screen. |
| `56b-B` | B | Middle interior projection foot; lowest foot on screen. |
| `56b-C1` | C_1 | Right upper original point, above/right of C; slightly below A_1, above B_1 on screen. |
| `56b-C` | C | Right interior projection foot; highest foot on screen. |

`56b-project-A`, `56b-project-B`, `56b-project-C`: three separate solid
finite segments A_1-A, B_1-B, C_1-C, each ending at its two dots and
crossing the back contour. They lean slightly right toward the upper
endpoint and are visually approximately parallel. No arrows, dashes,
extensions, perpendicular marks, or length/equality annotations.

Both original-point x-order and projection-foot x-order are A, B, C from
left to right, with subscripts distinguishing the originals. The pictured
upper points are noncollinear, consistent with the explicit text given.
The three feet also occupy a visibly noncollinear screen configuration;
this is recorded as the pictured configuration, not an additional universal
noncollinearity theorem for projection. No triangle edges are drawn.

Alpha is near the lower/right plane interior. Original-point labels are
above their dots. A is below/left of its foot, B below its foot, C below
its foot. The rounded silhouette has no named corners or filled-area
hatching.

Required negative inventory `56b-unsolved`: NO AB/BC/CA edges, NO
A_1B_1/B_1C_1/C_1A_1 edges, NO drawn triangle, NO outline for the original
points' plane, NO intersection line, NO constructed intersection points,
NO answer-trace edges, and NO extra projection directions/auxiliary planes.
Do not connect the six given dots merely because their planes/lines are
mentioned in the question.

## Counts, Limits, And Unresolved Details

Fig-55 totals: three independent panels; 14 + 11 + 13 = 38 named point
instances, three alpha labels, three panel markers. Fig-56 totals: two
independent panels; 4 + 6 = 10 named point instances, two alpha labels,
two panel markers. Silhouette/stroke intersections and scan specks are not
additional named source points.

Fig-55 has clear explicit M/N/P dots and external K dots where applicable;
tetrahedron vertices and section corners often appear as dark joined
strokes rather than isolated circular markers. N_1/P_1 are labeled helper
intersections; an independent round dot cannot be cleanly separated from
every crossing's ink. Marker-size uniformity must not be claimed as a source
fact or used to hide a clearly printed dot.

The source is a thick, scanned oblique drawing. Exact helper dash transition
pixels, hatch interruptions at crossings, isolated endpoint dot shapes,
3D depths, angles, lengths, equal ratios, and exact raster coordinates are
not certified by this single original-detail inspection. Solid exterior
approaches versus dashed interior/base/back spans are inventoried above;
the word "appears" flags local scan ambiguity rather than a license to
invent a uniform stroke style. No crop or reopen was used to resolve it.

Oblique screen crossings such as solid AD through the hatched section or
projection segments through a plane silhouette are not automatically
additional spatial incidences. No unnamed crossing was promoted into a
point or an answer annotation.

Exercise-151 separator remains UNKNOWN. Fig-54 remains outside scope.
No missing source facts were filled using an answer, candidate, derived
precursor, previous math freeze, or prior gate.

## Frozen Comparison Boundary

This file is a source inventory, not a FigureSpec, render validation,
mathematical proof, cultural review pass, or promotion approval.
Later comparison must keep source facts distinct from justified modern
layout changes, preserve every panel and named point relationship, and
not substitute object counts for point-incidence/relationship coverage.

Candidate identities, object/assertion mappings, render/probe hashes,
display-width checks, and a StageB verdict are intentionally absent.
Explicit candidate disclosure is required before the reserved single
StageB inspection. StageA ends here; wait without opening more evidence.
