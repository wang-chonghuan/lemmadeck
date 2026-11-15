# STEMROBIN-184: Independent Gate2 STANDARD ANSWERS, s4-s6

2026-11-15. Scope: `geo68-c1-s4` (13), `geo68-c1-s5` (9), `geo68-c1-s6` (15): 37 exercises.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Gate contract: `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md`.
Draft author: Aristotle, separate from this reviewer, as identified by the parent.

## Independent Solution Freeze

This section was written BEFORE opening any `tmp/<lesson>-answers-authored.json`. Modern `lesson.json`, `exercises.json`, and figure manifests were read first. All referenced figures 07-20 were opened as original PNGs and actual modern SVG renders, with their FigureSpecs and SVG geometry/labels inspected. No choice drafts, choice keys, durable answer keys or book-answer keys were read. The authored-standard-answer comparison will be recorded separately below; independent solutions are not changed to fit it.

Notation: `[AB]` is the closed segment, `(AB)` the whole line, `[AB)` the ray starting at A through B. Point and line counts use the lesson's distinct-point/distinct-line convention. Metric statements that quantify over arbitrary points require explicit treatment of coincidence when relevant. All requested drawings/proofs require meaningful construction/proof explanations, not merely a number.

### s4: Distance Properties

| Exercise | Independent answer and premises |
|---|---|
| 26 | Nine ordered quantities: 1a) XY=0.5 m, AB=0.7 m, CD=0.1 m; 1b) XY=50 cm, AB=70 cm, CD=10 cm; 2) XY=500 mm, AB=700 mm, CD=100 mm. |
| 27 | Triangle/reverse-triangle bounds: 4 <= AC <= 12 cm. 1a-f: no, yes, yes, yes, no, yes. 2) Examples 5, 8, 10 cm. Endpoints 4 and 12 are attainable collinear cases, not excluded strict-triangle cases. |
| 28 | 1) 1 <= AX <= 5 cm. 2) Exactly two points of the circumference on line AB, with AC=1 or 5 cm. Put B=0, A=2, C=-3 or 3 on that line. |
| 29 | Always: a,b,e. Never: d,f,h. Contingent rather than universal: c,g,i,j when arbitrary points may coincide. c and i require equality with X between Y and Z (including degenerate equality if coincidence is allowed); g iff Y != Z; j for an equilateral triangle, or all coincident points. If all three points are explicitly assumed distinct, g joins the universal group; the other classification is unchanged. Never classify g without its premise. |
| 30 | 1) M in (AB). 2) C not in (AB). Do not use the numerical distance |AB| as a set. |
| 31 | A belongs to line TP; B does not belong to line TN; M does not belong to line AB; N belongs to line CD. Four distinct readings. |
| 32 | 1) Through one point: infinitely many lines. Containing two distinct points: exactly one. Containing all three distinct points: one if collinear, zero otherwise. 2) Exactly one through the two distinct points. |
| 33 | Distinct lines have zero common points when parallel or one when intersecting; exactly one is possible, but not mandatory. Exactly two is impossible: uniqueness of the line through two distinct points would make them coincide. Coincident lines, if allowed, have infinitely many common points. |
| 34 | Three distinct points determine one line if collinear, three otherwise. Both configurations must be described/drawn. |
| 35 | 0: three parallel lines. 1: three concurrent distinct lines. 2: two parallel lines crossed by the third. 3: pairwise intersecting nonconcurrent lines. |
| 36 | Four distinct lines, every pair intersecting: exactly 1,4,6 distinct intersection points. All concurrent -> 1; exactly three concurrent with the fourth not through their concurrence -> 4; no triple concurrence -> 6. Two separate triple-concurrence points would force their two shared lines to coincide, so there is no other count. |
| 37 | Four distinct points: 1 line if all collinear; 4 if exactly three collinear; 6 if no triple collinear. These cases exhaust all configurations. Two triple-collinear subsets on different lines would share two points, violating uniqueness; in the last case all six unordered pairs determine different lines. Fig10 matches all three configurations. |
| 38 | "Circle" here must mean the disk containing the finite set, not a circumference through arbitrary n points. Choose center A1 and R=max_i distance(A1,Ai)+1 in any chosen length unit; every point is strictly inside. A maximum-radius disk also suffices for inclusive containment. Arbitrary points need not be concyclic. |

### s5: Betweenness and Triangle Inequality

| Exercise | Independent answer and premises |
|---|---|
| 39 | Yes. AX+XB=AB is unchanged by reversing A and B, using symmetry of distance. |
| 40 | No. Collinear counterexample A=0, B=1, X=2: X is outside [AB] but all three are collinear. |
| 41 | Basic geometric concepts: point and distance. Addition/equality are operations/relations, not additional basic geometric concepts. |
| 42 | 1) Collinear A-C-B, AC=3, CB=2, AB=5 cm. 2) Collinear A-B-C, AB=4, BC=2, AC=6 cm. 3) A nondegenerate triangle with AB=5, AC=4, BC=6 cm: draw AB=5, intersect circles centered A (radius4) and B (radius6); either intersection is C. |
| 43 | 1) P-Q-R. 2) P-R-Q. 3) R-P-Q, since RP+PQ=RQ. Reversal of each displayed order is equivalent. Distinctness makes betweenness strict. |
| 44 | From actual source/modern Fig13, A-B-C: true 1,2,3,6; false 4,5. Write u=AB>0,v=BC>0,AC=u+v: 2 reduces 2u+v>v; 3 reduces u+2v>u; 4 and 5 contradict equality. No measured/equal spacings are premises. |
| 45 | 1) No: 9>3+5. 2) Yes: Z is midpoint of XY, with distances6,6 and XY=12 cm. 3) No: 18>5+12. 4) Yes: nondegenerate triangle with XY=7,XZ=8,YZ=12 cm; intersect radius8 and radius12 circles around endpoints of a length7 base. |
| 46 | School-station distance d satisfies 3 <= d <= 7 km. 1a-d: no, yes, yes, no. 2) Min3 with home-school-station order; max7 with school-home-station order. Construction must distinguish straight-line distance from route length. |
| 47 | Fig14 has (a) AC=5,CB=3; (b) closed chains AC=5,CB=3 and AD=7,DB=2; (c) closed C-D-B-E-C linkage CD=DB=BE=3,EC=6 plus freely hinged AC=2. End-distance ranges: (a) [2,8], (b) [5,8], (c) [1,8], in the figure's unspecified length unit. All intermediate values are attainable for ideal freely rotating hinges, permitting folded/overlapping rods. Endpoint constructions and closed-chain derivation are detailed below. |

47 independent derivation: (a) reverse/ordinary triangle inequalities; fold the 3-rod back along the 5-rod for 2, unfold for 8. (b) AB lies in [2,8] from A-C-B and in [5,9] from A-D-B, hence [5,8]; every value has triangles for both chains, so the closed linkage can realize it. Min5: A-B-D collinear; max8: A-C-B collinear, with the other chain a valid triangle. (c) t=CB lies in [0,6] from C-D-B and [3,9] from C-E-B, hence [3,6]. With AC=2, AB lies in [t-2,t+2], giving [1,8]. Min1: t=3, C-B-E collinear and C-A-B collinear; max8: t=6, C-D-B collinear and A-C-B collinear. The other chain remains feasible in each case. Continuity of chain configurations and the free AC hinge supplies every intermediate endpoint distance. There is no cm label to invent.

### s6: Segments and Rays

| Exercise | Independent answer and premises |
|---|---|
| 48 | Actual Fig19: A,L,E,B in [AB]; C,D,M not in [AB]. Include both endpoints and both marked interior points; all seven labels must be answered. |
| 49 | 1) Yes, B internal: 7+3=10. 2) No: 2+9>10, forming a noncollinear triangle. 3) Yes, B internal: 6.5+3.5=10. 4) Equal AB,BC alone does not determine membership. If their common value is5 cm, B is the midpoint and belongs; if >5, B is off the segment; <5 is impossible. Counterexample A=(0,0), C=(10,0), B=(5,1). |
| 50 | 1) No: sides5,4,6 form a noncollinear triangle. 2) Yes, A-C-B with 3+2=5. 3) Yes, A-B-C with 5+2=7. |
| 51 | 1) Yes, crossing or sharing a single endpoint. 2) No: two distinct common points P,Q force every point of [PQ] to be common, hence infinitely many, not exactly two. |
| 52 | Three points yield3 segments AB,AC,BC; four yield6 AB,AC,AD,BC,BD,CD. Distinct endpoint pairs determine different segments even if some points are collinear. |
| 53 | X internal implies AB=AX+XB with AX,XB>0; subtract each positive summand to obtain AX<AB and BX<AB. Both claims require the strict inner-point premise. |
| 54 | 1) Unique point on the segment equidistant from its endpoints; equivalently dividing it into equal halves. 2) Set C=0,A=4,D=18 cm: midpoints of CD,CA,AD are9,2,11; requested distances a=7,b=2,c=9 cm. |
| 55 | Actual Fig20 order M-A-B. 1) Open ray right of A, A excluded: [AB) minus {A}. 2) Open ray right of B, B excluded: [AB) minus [AB]. 3) Open segment between M and A: [MA] minus {M,A}. Strict betweenness does not allow an endpoint in these sets. |
| 56 | 1) M in [OA). 2) [OA] subset [AB). 3) [OB) subset [AB). 4) [CD] subset (CD). These are requested symbolic translations, not assumed universal incidences. |
| 57 | 1) [AB) intersect [BA) = [AB]. 2) On one line, intersections can be a ray (same direction), a closed nondegenerate segment (opposite directions facing inward), one point (opposite directions, same start), or empty (facing away with separated starts). 3) Unions can be a ray, the whole line, or two disjoint rays with an open interval gap. Include starts; do not omit empty/point/disjoint cases. |
| 58 | 1) B between A,M: M only in [AB), not [BA). 2) A between M,B: M only in [BA), not [AB). 3) M between A,B: M in both. A,B,M distinct, as explicitly given. |
| 59 | Segment: point and distance, through defined betweenness. Ray: point, straight line and distance, through the two-side partition/betweenness. Betweenness is derived, not basic. |
| 60 | Take two distinct common points P,Q. Both supporting lines pass through P,Q, hence coincide by the line axiom. Therefore both segments lie on the same line. A single common point would not suffice. |
| 61 | Ideal telescoping straight antenna sections overlap along a nonzero interval of their common centerline, providing two distinct common points. Apply 60 successively: all sections have one supporting line. This is a geometric idealization, not a claim about arbitrarily bent hardware. |
| 62 | A,B are distinct, non-origin points on one ray. Orient its coordinate positively from O: a,b>0 and a!=b. If a<b, A is between O,B; if b<a, B is between O,A. Equivalently, the collinear third possible order with O between A,B is excluded by their being on the same ray. |

## Figure Evidence

Opened originals at `ssot-resources/soviet10year-textbooks/artifacts/6-8g/figures/fig-07.png` through `fig-20.png`, and specs/SVGs under `editions/modern-us-neutral/figures/`.

- 07: one A-B segment, no dimension label; 08: noncollinear A/B/C, A-B-C, A-C-B panels.
- 09: impossible two-common-point reductio sketch, including dashed tails; not evidence of real distinct lines meeting twice.
- 10: all-collinear, exactly-three-collinear and no-three-collinear configurations, with no invented labels/count annotations.
- 11: A=0,B=2,C=5 on 0..7 ruler, plus noncollinear triangle; 12: road order A-B-D-C while only A,B,C share the baseline.
- 13: A-B-C on an extended line, no lengths. 14: every rod and all given 5/3,5/3/2/7,2/3/3/3/6 values and closed-chain connections checked.
- 15: A-M-X-B segment and containing line; 16: P-M-O-N-Q on line p; 17: A-D-B-C on one continued ray; 18: marked starting A and unmarked direction B.
- 19: A-L-E-B on segment; C,D,M off it. 20: M-A-B on line a, no X or answer shading.

Temporary comparison images preserve original PNG pixels and render the actual SVG with its default color fallbacks. The static rasterizer does not handle fig12's non-scaling stroke correctly; that preview is NOT defect evidence. Fig12 was instead opened in installed Chromium with every network request blocked: `tmp/answer-review-s4-s6-fig-12-browser.png`; the actual winding curve, baseline and all four labels render correctly. No app server or product state was used or changed.

## Authored Comparison

Completed on 2026-11-15 after explicit human resume. This completes the existing independent review, not a second review of these artifacts. The retained solutions and figure evidence above were used to compare every authored `displayAnswer`, premise, construction/proof, grading mode and numeric key with its modern exercise. No source solving, screenshots or completed checks were repeated.

**Result: PASS, 37/37. No concrete authored-answer defect; no authored correction required.** All 37 items are `derived`, with no `bookRaw`. This is a comparison against the independently solved source notes and the authored standard-answer keys, not a claim of comparison with a printed book-answer key. No choice drafts or choice keys were accessed.

### Reviewer Erratum and Premise Refinements

The frozen exercise 29 note incorrectly names X as the middle point for both c and i. Preserve that original note as the precomparison record: c requires X between Y and Z, but i requires **Y between X and Z**, since `XY+YZ=XZ`. Aristotle's authored answer already distinguishes them correctly. This is a reviewer recording error, not an authored defect.

The initial frozen notes for 28 and 38 recorded the planar branches without stating coplanarity. The authored answers explicitly cover the missing premises, and their additional branches were mathematically checked before the pause:

- 28: coplanar A gives the closed interval `[1,5] cm` and two collinear circumference points. For off-plane A, with `d=BH` measured in cm and `0<=d<2`, the accurate range is `[sqrt(13-6d),sqrt(13+6d)] cm`; neither 1 nor 5 is attained, and there is no collinear circumference point C. The perpendicular case has the single distance `sqrt(13) cm`. Accepted, not silently treated as a planar-only universal claim.
- 38: a finite coplanar set is contained strictly inside a planar disk by taking its radius larger than the maximum center-to-point distance. A noncoplanar spatial set cannot be contained in any planar disk. The authored answer correctly distinguishes a disk from a circumference and a disk from a sphere.

### s4 Verdicts: 13/13 PASS

| Exercise | Verdict | Concrete comparison and accepted premises |
|---|---|---|
| 26 | PASS | All nine quantities, unit conversions and independent numeric keys match; order is XY, AB, CD within m, cm, mm groups. `auto` is appropriate. |
| 27 | PASS | Closed bounds `[4,12] cm`; a-f are no, yes, yes, yes, no, yes. Authored examples 5,7,10 are as valid as frozen examples 5,8,10; examples are not exclusive accepted values. Collinear endpoints included. Open examples justify `ungraded`. |
| 28 | PASS | Both subparts answered with the coplanar and off-plane branches stated above; no unstated coplanarity or invented figure. `ungraded`. |
| 29 | PASS | Distinct-point convention: always a,b,e,g; never d,f,h; contingent c,i,j. Correct equality orders for c and i. Coincidence alternative moves g to contingent. Reviewer erratum above does not alter this verdict. `ungraded`. |
| 30 | PASS | `M in (AB)` and `C notin (AB)` follow the corrected modern line notation, not the source snapshot's distance notation. Both subparts covered. `ungraded`. |
| 31 | PASS | All four incidence readings match: A on TP, B not on TN, M not on AB, N on CD. `ungraded`. |
| 32 | PASS | Simultaneous containment: infinitely many for one point, one for two distinct points, one/zero for three collinear/noncollinear points; subpart 2 is one. Distinctness explicit. `ungraded`. |
| 33 | PASS | First universal claim false; two distinct lines may share zero or one point. Exactly two impossible by uniqueness; coincident-line alternative has infinitely many. Reason included. `ungraded`. |
| 34 | PASS | Exactly 1 or 3 lines for three distinct points; both drawing constructions and exclusion of 2 supplied. `ungraded`. |
| 35 | PASS | All four constructions for 0,1,2,3 intersections use three distinct lines and realize the requested counts. Coordinate examples are constructions, not added givens. `ungraded`. |
| 36 | PASS | Exactly 1,4,6 intersections; all three four-line constructions satisfy pairwise intersection, and concurrence proof exhausts cases. `ungraded`. |
| 37 | PASS | Fig10 configurations give 1,4,6 lines; four-distinct-point collinearity classification and pair-uniqueness argument exclude other counts. `ungraded`. |
| 38 | PASS | Finite-set maximum-radius proof covers a containing disk for coplanar points; noncoplanar counterexample explicitly limits the otherwise unstated premise. Not an unsupported concyclicity claim. `ungraded`. |

### s5 Verdicts: 9/9 PASS

| Exercise | Verdict | Concrete comparison and accepted premises |
|---|---|---|
| 39 | PASS | Yes, by distance symmetry and reversed endpoint order; strict betweenness retains three distinct points. `ungraded`. |
| 40 | PASS | No; collinear A-B-X at 0,1,2 is a valid counterexample. `ungraded`. |
| 41 | PASS | Point and distance define betweenness; addition/equality described as quantity relations, not extra basic geometric concepts. `ungraded`. |
| 42 | PASS | All three constructions match: A-C-B with 5,3,2; A-B-C with 4,6,2; noncollinear triangle with AB=5, AC=4, BC=6 cm. Both circle-intersection choices permitted. `ungraded`. |
| 43 | PASS | All three equations give P-Q-R, P-R-Q, R-P-Q respectively, or their reversals. Drawings specified using distinct points. `ungraded`. |
| 44 | PASS | Actual retained Fig13 order A-B-C gives true 1,2,3,6 and false 4,5. Positive u,v derivations match all six expressions without inferring equal spacing. `ungraded`. |
| 45 | PASS | Four verdicts no,yes,no,yes; 9>3+5 and 18>5+12 exclude 1,3. Constructions for X-Z-Y with 12,6,6 and triangle XY=7,XZ=8,YZ=12 cm cover both possible cases. `ungraded`. |
| 46 | PASS | `[3,7] km`; a-d no,yes,yes,no. Max7 at S-H-T; min3 at H-S-T, with given HS=2,HT=5. Geometric distance, not unprovided route length. Extreme constructions retained; `ungraded`. |
| 47 | PASS | Retained Fig14 rods and closed loops preserved. Ranges (a) `[2,8]`, (b) `[5,8]`, (c) `[1,8]`, with six endpoint constructions and all intermediate values proved. Same unspecified figure unit; ideal free hinges permit collinearity/folding/overlap, with no invented collision or fixed-angle restriction. `ungraded`. |

### s6 Verdicts: 15/15 PASS

| Exercise | Verdict | Concrete comparison and accepted premises |
|---|---|---|
| 48 | PASS | All seven Fig19 labels covered: A,L,E,B belong to `[AB]`; C,D,M do not. Endpoints included, point order retained. `ungraded`. |
| 49 | PASS | Subparts 1-3 yes,no,yes from sums 10,11,10 cm. Subpart 4 correctly conditional: common length5 gives midpoint; >5 gives an off-segment point; <5 impossible. Valid 6,6,10 counterexample; no unjustified midpoint assumption. `ungraded`. |
| 50 | PASS | All three answers no,yes,yes; strict triangle then A-C-B in `[AB]`, then A-B-C in `[AC]`. Given lengths and containing segments match. `ungraded`. |
| 51 | PASS | Exactly one common point possible; exactly two impossible since both segments then contain all of `[PQ]`. Examples and reason provided. `ungraded`. |
| 52 | PASS | Counts 3 and 6, all endpoint pairs enumerated, distinctness explicit; collinearity does not identify different segments. Both numeric keys match. `auto` appropriate for the requested counts. |
| 53 | PASS | Both strict inequalities derived by subtracting positive inner-point distances from `AB=AX+XB`; distance symmetry handles BX. Proof retained; `ungraded`. |
| 54 | PASS | Midpoint definition requires membership and equidistance. Construction C=0,A=4,D=18 gives midpoint positions 9,2,11 cm and a,b,c results 7,2,9 cm. Definition and construction are not discarded for numeric-only grading; `ungraded`. |
| 55 | PASS | Fig20 M-A-B: open ray from A toward B, open ray beyond B, open segment MA. Excluded endpoints correct; B included in subpart1. All three graph descriptions supplied; `ungraded`. |
| 56 | PASS | Four translations match `M in [OA)`, `[OA] subset [AB)`, `[OB) subset [AB)`, `[CD] subset (CD)`. These translate the given statements, not universal claims for arbitrary point placements. `ungraded`. |
| 57 | PASS | `[AB) intersect [BA)=[AB]`. All general intersection cases ray/closed segment/singleton/empty and union cases ray/whole line/disjoint rays included, with starts retained and correct interval formulas. `ungraded`. |
| 58 | PASS | Three cases give M only in `[AB)`, only in `[BA)`, in both, from A-B-M, M-A-B, A-M-B. Explicit distinct-point premise respected. `ungraded`. |
| 59 | PASS | Segment traced to point/distance; ray also to straight line, with derived betweenness and point-set operations explained. Both requested definitions addressed. `ungraded`. |
| 60 | PASS | Two distinct common points force the supporting lines to coincide by the line axiom. Not a one-common-point argument. `ungraded`. |
| 61 | PASS | Ideal telescoping antenna axis-segments overlap in positive length; apply 60 successively. Physical modeling premise clear, not a hinged-only connection or bent-hardware claim. `ungraded`. |
| 62 | PASS | Distinct A,B are non-origin points of one ray. Excludes O as middle point, establishes one of A/B between the other and O, and proves both alternatives cannot hold simultaneously. `ungraded`. |

### Numeric Parts and Existing Check Evidence

Only 26 and 52 are `auto`; every numeric input is a bare finite value with its quantity/unit in the label. No explanation text is embedded in `expected`.

| Exercise / part | Label quantity and unit | Authored expected | Independent value | Verdict |
|---|---|---|---|---|
| 26 / 1a XY | XY, m | `0.5` | `0.5` | PASS |
| 26 / 1a AB | AB, m | `0.7` | `0.7` | PASS |
| 26 / 1a CD | CD, m | `0.1` | `0.1` | PASS |
| 26 / 1b XY | XY, cm | `50` | `50` | PASS |
| 26 / 1b AB | AB, cm | `70` | `70` | PASS |
| 26 / 1b CD | CD, cm | `10` | `10` | PASS |
| 26 / 2 XY | XY, mm | `500` | `500` | PASS |
| 26 / 2 AB | AB, mm | `700` | `700` | PASS |
| 26 / 2 CD | CD, mm | `100` | `100` | PASS |
| 52 / 1 | Segment count, no length unit | `3` | `3` | PASS |
| 52 / 2 | Segment count, no length unit | `6` | `6` | PASS |

Carried forward from the completed pre-pause checks, not rerun on resume:

- Readonly `lesson_answers.validate_lesson` passed all three authored drafts against their modern exercises: s4 1 auto/12 ungraded; s5 0 auto/9 ungraded; s6 1 auto/14 ungraded. No missing or duplicate exercise; all 37 sources `derived`, no `bookRaw`.
- Existing `check_math_expressions.mjs` passed: `checked: 11`, `failures: []`. This structural/parse evidence supplements, not substitutes for, the independent numeric comparison above.
- No `exact` or `expression` parts exist, so exact-editor MathLive keyboard transactions are not applicable; zero such transactions attempted. No extra validation, test, build or browser pipeline was started.

### Input Identity

SHA-256. Paths below are relative to the workspace stated at the top. The retained precomparison report hash was `df929659b730f79671bbcdc191a47c487cc148b3ac25c288463d2020c5d08ad9`; this is the earlier frozen report, not the hash of this now-completed file.

Authored drafts under `.intentfold/tickets/STEMROBIN-184/tmp/`:

| File | SHA-256 |
|---|---|
| geo68-c1-s4-answers-authored.json | `64a7fb4dab5180fb60acdc5141a6ac3412a57a8e8d1823613aa0173bc690939d` |
| geo68-c1-s5-answers-authored.json | `a7ef96e1cd02cbb94ea798cf6570de8de3101e1f806df6370a79ad4c744cb665` |
| geo68-c1-s6-answers-authored.json | `2a78b5d626f3b149d5b864d7b1c0f2901cb3bb52dcd8b369d4ba3841488a53f1` |

Modern source files under `ssot-resources/soviet10year-textbooks/artifacts/6-8g/editions/modern-us-neutral/lessons/`:

| File | SHA-256 |
|---|---|
| geo68-c1-s4/lesson.json | `949a889f05787774f0ab30537bc6fea79c3e85714a0b98fd0d4bdd5e3b7be031` |
| geo68-c1-s4/exercises.json | `c65764c61bedf591cf1a400efbacf69c6cdf10b7d8e5be3ca0006417fc0a4ff7` |
| geo68-c1-s4/figures.json | `a507b46a7e5399c2e6c645d788cfcfa3bb7b00501cb1b50bd73176ae9ca69e23` |
| geo68-c1-s5/lesson.json | `e8bbeccdd2046c9f15044e0520a95c87f9ce24c3773ee3f6542bc54112b2c7b9` |
| geo68-c1-s5/exercises.json | `1901090275ae38146b6dbb430b510a543e29ab7bc02d7334dbb8809a9d9fec27` |
| geo68-c1-s5/figures.json | `94e6e7b22532a6a412647062b00c018a5f035bf2f3937fbaf5741be8f056580f` |
| geo68-c1-s6/lesson.json | `76def3a60b848d29c172cdf456750a38beef867728c4fb7f742e8776800ddd08` |
| geo68-c1-s6/exercises.json | `ec05e401eeece34ce40fe1a8dc97d9e54db950dbfdad48ce9e058817e4603e86` |
| geo68-c1-s6/figures.json | `714de9d605c9b98a33967e6ac389c0a99fadaf76f74b72af5a76769704ffb799` |

Exercise-referenced figure identities: PNGs under the book's `figures/`; specs and SVGs under `editions/modern-us-neutral/figures/`. Their visual evidence was already inspected before the pause; hashes record input identity without rerendering.

| File | SHA-256 |
|---|---|
| fig-10.png | `b7673802d63aaac2195e1281a00eadbe2492529e40105fa056b924411f8c16eb` |
| fig-10.spec.json | `c911c860f1f1f29a36622d6d81305b999a707538c8565cd9b8079e5e50e7abe4` |
| fig-10.svg | `e39bb131032a0460f61de31a46cc0064779d458ab148a48a3c06270d8f6c3504` |
| fig-13.png | `af7c9f0d5b962fcfc837fe6002bf858b25e3c5e564294a2b0cc3e6803b187593` |
| fig-13.spec.json | `d3692c673009dfc77c48f66c83acb859485ae9233347795e88567ef81c9c0845` |
| fig-13.svg | `988da9aead64cd4f526c2db5cc30f3bdc57d6b342fd9336888f54c25afe6a970` |
| fig-14.png | `0ce8ae7e0ebcee48708be21104800f001d8dc35d59505f1d29b4cd1782870d71` |
| fig-14.spec.json | `9d625b60e4deba0587dadee57f6184cf9b1b71b2e39e4c8d197f8c5dbbf12fc7` |
| fig-14.svg | `a3fd7867a302af7f422a2caa488b2066ca24353ef1510fd6b44cef88c865f673` |
| fig-19.png | `144c1092b8af4f1f557018af98b518d0a8fa902f20e26d6a72e7db4ce991f311` |
| fig-19.spec.json | `45f8edb29ceb888ad7f90b3801723a96099bb01a62fb8d44d4b0b8fa9c56a336` |
| fig-19.svg | `6235bf38626343febc1c2feeb07898851dbcd094467150f19a639799f4acde12` |
| fig-20.png | `562f869cea3d07eb3c4d693c4a1cc9dc846d3f5e7e4e122c0f6bc67951916efa` |
| fig-20.spec.json | `546655737a0e05b11b8a919941fccbd4dc47dc9676dc687634756b8e84722b69` |
| fig-20.svg | `a5d147d219ded67279b06be6028f2afb93180e181b4875964635bc2701813ad6` |

### Scoped Promotion Decision

Independent STANDARD ANSWERS Gate2 review is complete and **PASS** for s4 (13/13), s5 (9/9) and s6 (15/15), bound to the authored hashes above. s4 and s5 have no review blocker for the parent's first four-lesson batch s2-s5; this report does not assess s2 or s3. The parent may promote these reviewed standard-answer drafts without an authored repair. The explicit conditional premises in 28,29,38,47,49,55,57,60-62 must be preserved.

This decision covers standard-answer content and the carried-forward local structural evidence only, not choices, interaction keys, publication or app acceptance. This reviewer changed only this scratch report on resume; authored drafts, durable resources, DB and app state were not changed. No finalization, publishing, full tests, builds, new screenshots or messages to other chats were performed. Stop after report.
