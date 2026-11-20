# N47 Answer Author: Frozen First Draft

Assignment: STEMROBIN-188 / SAME188-6, answer author only.
Book: `9-10g`. Lesson: `geo910-c2-s2-n47`. Edition: `modern-us-neutral`.
This is an author submission awaiting independent answer review, not Gate 2 approval, finalization, publication, source capture approval, or whole-lesson approval.

## Bound Inputs and Source Status

- The current core modern lesson, all six exercises, and seven-entry figure manifest were read in full. Their SHA256 values match the frozen manifest. This is not the initial modern author draft.
- All 44 manifest bindings plus the two raw lesson/exercise alignment files matched on entry. Exact paths/hashes are in `evidence/input-bindings.json`; copied inputs are recorded in `evidence/copied-inputs.json`.
- The raw book index explicitly says `9-10g` and `exercise_numbering: book`. It is an index, not an authoritative captured g10 answer-page identity. Core `9-10g/answers.json` did not exist; no book answers were copied, and no ambiguous reset-number g9 answers were read. Every candidate answer has `source: derived` and no `bookRaw`.
- Exactly 11 bound files were copied into the author's isolated `artifacts/9-10g` layout: modern lesson/exercises/figures; raw lesson/exercises/book; source figure22 PNG; modern figure22 spec/SVG/render/review. Concept-figure assets and previous evidence packages were not recopied.
- The existing preparation command ran exactly once, with explicit isolated `--root` and `--work`. Its unedited template is preserved read-only before any candidate math edits. See `evidence/prepare-receipt.json` and `prepared-original/answer-keys.template.json`.
- The first successful manually authored candidate is frozen read-only as both `candidate/answer-keys.json` and `candidate/answer-keys.FIRST.json`, hash `ce30c7fc812a7f51fc27e38fb8cd782e7e6ab2031c8a5c6297e9563c7694c7f2`.

## Figure Evidence and Image Ledger

The two planned image loads were performed once each, in order:

1. Original `ssot-resources/soviet10year-textbooks/artifacts/9-10g/figures/fig-g10-22.png`, SHA256 `f65761d78aa1c3a878d39dcff144f9622e271d5cb599e2086f84efbcc7df2564`.
2. Current modern `.intentfold/tickets/STEMROBIN-188/tmp/n47-fig22-author/fig-g10-22-480.png`, SHA256 `904bf47db34c3970eb664f88c968dedc77610dd5c8f212c2fc1c4fafe8fa51b3`.

Actual independent observation from these pixels: one wireframe with six labels A-F; eight solid links DA, AB, BE, EC, CD, DF, FE, FA and one dashed CB. The two projection crossings have no labels and are not vertices. The modern figure retains every labelled junction and solid/dashed distinction, with no new measurements, angle marks, auxiliary solution lines or figures. The original and modern figures are present, not absent.

The FigureSpec, SVG, render metadata and durable review were read as text. The current durable SVG hash is `ad26011d2c0e4e1bc44f9ebc5f757986808da49cfffd47c390a003175c5fbeae`; it matches the frozen manifest and the durable render/review records. FigureSpec hash is `c19aceb8f47dbf2e52cc432314108a1377417153aa8cc8bfd0fc9b9f85e30af8`. Figure coordinates are an oblique projection for layout, not lengths or angles of the solid. No angle, scale, or metric equality was inferred from pixels.

Author image increment: 2, batch limit: 8, current-context limit: 24. Reopens, crops, screenshots, new renders, optional concept image loads, generated images, and images returned to parent: all 0. The inherited manifest says parent image loads 0; these scoped counts do not reset any earlier figure author/reviewer usage or historical repair counts.

## Per-Exercise Derivations and Capacity

### 49

Prompt: name the polyhedron with the least number of faces; count its edges, vertices and polyhedron diagonals.

Within the lesson's convex, nondegenerate polyhedron scope, a face has at least three edges and meets a different other face on each edge. Hence at least four faces are necessary. A tetrahedron (triangular pyramid) attains four. Four vertices give six pairwise edges. Every vertex pair shares a face, so there are zero polyhedron diagonals under the exact lesson definition, not a guessed polygon-diagonal definition.

Disposition: `auto`, four parts: name by supported `exact` text (`四面体` or `三棱锥`), and three independent numeric parts 6, 4, 0. The extra face count 4 is explanatory, not another requested answer. The lower-bound proof is completely displayed but not semantically auto-graded.

Source49 text still contains the original serialized raised glyph `°`; exact source glyph identity remains **UNKNOWN**. Its original meaning is not claimed to be degrees, difficulty, or anything else. It is not used in this solution.

### 50

Prompt: can a five-faced polyhedron have a quadrilateral face or a pentagonal face?

1. Yes: a quadrilateral pyramid has one quadrilateral base and four triangular side faces, exactly five faces.
2. No: the five edges of a pentagonal face must meet five distinct other faces of a convex polyhedron, requiring at least six total faces.

Disposition: `auto`, two supported `exact` literal conclusion keys (`能`/`可以`; `不能`/`不可以`). The example and impossibility argument are specific display reasoning only, not automated proof evaluation, and no choice/interactions artifacts were authored.

Interpretive condition retained for independent review: "its face can be" means existence of such a face, not that all five faces must have that shape. The candidate explicitly answers existence. If the latter reading were intended, five quadrilateral faces would also be impossible: 4F=2E gives E=10; Euler gives V=7; vertex degree at least 3 would force 3V<=2E, i.e. 21<=20. This is not treated as a source correction and no source text is changed.

### 51

Prompt: with a hexagonal face, what is the least number of edges?

Its six vertices each require at least one edge outside that face in addition to their two face edges. Such an edge cannot join two vertices of the same face: adjacent pairs already have their face edge; nonadjacent pairs give a face diagonal, not a convex-polyhedron edge. Thus these six outside edges are distinct. Six face edges plus at least six outside edges give at least 12. A hexagonal pyramid has exactly six base and six side edges and attains 12.

Disposition: `auto`, one numeric key 12. Complete lower-bound and attainability arguments are displayed; no proof checker is claimed.

### 52

Prompt: actually construct a polyhedron with 8 edges, and one with 9 edges.

1. Construct square ABCD in z=0 at (0,0,0), (1,0,0), (1,1,0), (0,1,0). Choose S=(1/2,1/2,1) outside its plane. Join all four S-to-base segments and the four cyclic base edges. The closed square pyramid has exactly eight edges.
2. Construct nondegenerate triangle A=(0,0,0), B=(1,0,0), C=(0,1,0). Translate its vertices by the same nonzero perpendicular vector (0,0,1). Include both triangle cycles and AA', BB', CC'. The closed triangular prism has six base edges and three lateral edges, exactly nine. The candidate gives these steps and directs hidden edges to be dashed in the student's drawing.

Disposition: `ungraded`, empty `parts`, two complete constructive display answers. Current exact/numeric/expression judges cannot assess actual drawn spatial incidence, visibility or closure. Auto-checking names or the already supplied counts 8 and 9 would replace the construction task and falsely imply its correctness. No new figures were produced. This is the only omitted requested auto capacity, with the explicit domain limitation above.

### 53

Prompt: judge correctness of two statements about intersection/union of convex polyhedra.

1. Correct. For X,Y in P intersection Q, convexity puts every point on XY in P and in Q, hence in their intersection. Under the stated hypothesis that the intersection is a polyhedron, it is a convex polyhedron.
2. Incorrect. Let P=[0,2]x[0,1]x[0,1] and Q=[0,1]x[0,2]x[0,1]. They overlap in the unit cube; their union is a connected, closed L-section prism, not a disconnected or zero-volume object. X=(7/4,3/4,1/2) is inside P and Y=(3/4,7/4,1/2) inside Q, but their midpoint (5/4,5/4,1/2) is in neither, proving nonconvexity.

Disposition: `auto` only for the two correctness verdicts expressly requested, using supported exact text (`正确`/`对`; `不正确`/`错误`). Complete proof and concrete 3D counterexample remain display-only. An exact verdict is not proof certification, and no choice work was performed. Empty intersections, segments and plane fragments are outside the question's "intersection is a polyhedron" premise.

### 54

Domain: a>0. The angle between planes means the conventional smaller angle, between 0 and 90 degrees. Reflection of the solid across ABC changes signed height only; all requested unsigned angles and areas are unchanged. There is no genuine piecewise branch in this domain; a=0 is degenerate, not an allowed branch. Negative a is not a side length.

The actual figure supplies edges and the five faces ABCD, ABEF, DCEF, ADF and BCE, with CD and FE parallel. The prompt supplies ABCD square of side a, trapezoid ABEF, AF=BE=EF=a/2, and ABE perpendicular to ABC. The equal legs make the trapezoid isosceles. Its projection offsets along AB are (a-a/2)/2=a/4, so its positive height is h=sqrt((a/2)^2-(a/4)^2)=sqrt(3)a/4.

A concrete coordinate realization derived from these facts, not from SVG coordinates, is A=(0,0,0), B=(a,0,0), C=(a,a,0), D=(0,a,0), F=(a/4,0,h), E=(3a/4,0,h). Both trapezoids and both side triangles match every figure22 edge.

1. AF's projection onto ABC has length a/4; sin(alpha)=h/(a/2)=sqrt(3)/2. Thus alpha=60 degrees.
2. The planes meet on CD. For H below F, take L on CD with HL perpendicular CD. HL=a, FH=h, and FL perpendicular CD. Therefore tan(beta)=h/a=sqrt(3)/4; beta=arctan(sqrt(3)/4)=arccos(4/sqrt(19)) radians, or (180/pi)arctan(sqrt(3)/4) degrees, approximately 23.41322444637054 degrees. The line-angle is at L: angle FLH, not at F.
3. Square area a^2. ABEF area 3sqrt(3)a^2/16. DCEF's in-plane height is sqrt(a^2+h^2)=sqrt(19)a/4, giving area 3sqrt(19)a^2/16. Since AD and BC are perpendicular to plane ABE, ADF and BCE are right triangles with areas a^2/4 each. Cutting/unfolding preserves area, so S=a^2+3sqrt(3)a^2/16+3sqrt(19)a^2/16+a^2/2=3a^2(8+sqrt(3)+sqrt(19))/16.

Disposition: `auto`, three distinct parts: numeric inclination in degrees; numeric plane angle in degrees, with exact LaTeX degree expression and explicit absolute tolerance 0.01 degree to allow two-decimal approximations; symbolic area by `expression`. The coordinate derivation and surface proof are display-only, not automated geometric proof grading. Area is in the square of the unspecified unit of a; no unit is invented. No new drawing/net was needed or produced.

## Author Checks, Not Approval

`evidence/structure-receipt.json` invokes existing `validate_lesson` directly, without calling finalize. It verifies exact 49-54 ordering, six complete display answers, key structure, grading/judge legality and edition cultural terms.

`evidence/expected-receipt.json` records the single existing `check_math_expressions.mjs` call: seven numeric/expression expected strings, all passed.

`evidence/exact-receipt.json` and `evidence/mathlive-exact.json` retain the real existing MathLive keyboard-insert/delete check for all ten exact expected forms. Each candidate is in an independent document; actual emitted values, input-event counts, restoration/preservation and attempts are retained. This is not setter-cache comparison. It creates no screenshot or figure and performs no product backend or database request.

`evidence/author-arithmetic.json` contains assertions against this already frozen manual candidate: counted edges, opposite literal rejection using the product pure normalizer, the specific 3D union midpoint, stated metric lengths, unsigned angles, tolerance disposition, all five independently triangulated face areas, alternate expanded expression equivalence and rejection of an omitted triangular face. It generates no answer keys and does not claim independent review.

All counters, check exit codes, output hashes and per-exercise dispositions are aggregated in `report.json`. The machine index is `output-index.json`.

## Holds, Recovery and Boundaries

- Source49 exact raised glyph remains UNKNOWN/HOLD.
- Source all-ink HOLDs remain HOLD; this author did not inspect new source-page images, resolve them, or substitute generic geometry for source glyph evidence.
- All seven modern figures were independently approved before this assignment, per frozen inputs. This answer submission does not repeat that stage or infer whole-lesson/source/answer approval from it.
- Technical recovery: the copied candidate inherited read-only mode from the preserved template. The first manual patch failed with "Failed to write file". Only the candidate was made owner-writable; one successful manual math patch followed, then the candidate was frozen. Preparation and passed stages were not repeated. The failed attempt was not a content revision or approval.
- Exploratory read failures are retained as limitations in `report.json`: absent `app/src/lib/answer-checker.ts`, absent `app/src/server`, and absent optional `tsx`. Actual existing paths were subsequently located; Node 24 supports the used TypeScript import, so no dependency was installed or changed.
- No core, plan, charter, git, database, credentials, backend, model, paid service, dependency, interaction, choice, thread or peer/supervisor messaging writes/actions. All author filesystem outputs are inside the sole authorized root.
- No finalize, publisher, or Gate2 PASS was run or fabricated. Stop here for collection and independent approval.
