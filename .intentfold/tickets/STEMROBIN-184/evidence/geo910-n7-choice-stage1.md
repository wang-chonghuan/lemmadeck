# geo910 n7 Choice Stage1 - Frozen Independent Source Solutions

Date: 2026-11-16. Ticket: STEMROBIN-184.
Role: independent non-author choice reviewer under the existing parent-agent delegation, not direct human mathematical approval.
Stage: source solutions complete; official seed and learner-only views not yet supplied for review.

## Reading Boundary and Binding

This stage used only the current allowed modern written tasks44-52 and54-56, selected relevant n7 definitions, and already read n7 context. It did not read choices, options, keys, answer artifacts, parent solutions, choice author notes/drafts/internal reasoning, or the full53 worked example again. Exercise53 is explicitly excluded from this choice-source stage, not silently dropped from a selected seed.

Current allowed inputs, relative to `/Users/yong/.codex/worktrees/a07e/lemmadeck`:

| Input | Actual file SHA256 at reading |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n7/lesson.json` | `090ce96e411d57914431064281e6b526281ced5b5a7a60357e9ca897363b04cb` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n7/exercises.json` | `5f8ebbe42550de1f915e513b5de103a26cc53fb5c7480e6ad3da8c1b687243d2` |

The modern JSON currently has `status: draft`; these are the approved text bytes already reviewed, not a claim that modern finalization has run. The full exercise file has13 objects, but only the12 authorized unsolved task projections were displayed: `number`, `group`, `group_id`, `text`, `figure_refs`. Neither53 nor any `source.data` content was displayed during this stage. The selected12 all have empty `figure_refs`, so no image is an input to their independent solutions. No figure/context/spec work was done.

The selected definition projection displayed current paragraph indices9/10/11/13/17/18/19: three line-plane positions, broad parallel definition, notation, theorem2, corrected theorem3, its givens and target. Previously read source/transcription pages and the prior modern-review report were not reopened. No prepare, validator, browser/network/service/DB/Git operation was run.

The choice skill's current semantic review and artifact contracts were read. This Markdown is a pre-seed mathematical freeze, not a fabricated official seed or a schema review of an unseen draft. Parent finalization may change file-level metadata/trace; the later official seed must be compared with these selected task/definition contents before binding, without re-solving unchanged content.

## Definition Authority and Working Model

1. The course's line-line parallel relation includes coincidence. Distinct parallel lines are coplanar and disjoint; coincident lines also count as parallel.
2. N7 explicitly defines a line parallel to a plane when it is disjoint from that plane OR is contained in it. These two branches must not be replaced by strict disjointness.
3. Line-plane intersection at `a\cap\alpha=M` means one common point, using the course's geometric shorthand. Two intersecting planes have an intersection line.
4. Theorem2 uses a selected plane line parallel to the given line. The parent has explicitly authorized the later44 view to say "there exists at least one", resolving the source's "any one" wording without modifying the source. The solution below uses that existential condition, not universal parallelism to every plane line.
5. Corrected theorem3 gives `b // a` when `a // alpha`, `a` is in beta, and `beta cap alpha = b`. In the contained branch, a=b is allowed.
6. Ordinary Euclidean spatial geometry is used for constructions: three noncollinear points, or a line and an external point, determine a plane; two intersecting or distinct parallel lines determine a plane. No course-relative axiom/definition classification is inferred or keyed.
7. A tetrahedron is nondegenerate: its four vertices are not coplanar. A triangle and a regular hexagon are nondegenerate; vertices ABCDEF of the hexagon have their usual cyclic order. Length a in54 is positive because it is an edge length, not a newly assigned unit.

For independent derivations, a plane `n dot x = c` and a line `x=x0+t u` show:

- If `n dot u` is nonzero, the line has exactly one point in the plane.
- If `n dot u=0`, the line is either contained or disjoint.

Thus broad line-plane parallelism is equivalent to the line direction lying in the plane's direction space. This is a derived working criterion, not an added source hypothesis. Temporary coordinate models and point names below are reviewer derivations, not extra prompt givens or source-image labels.

## 44 - Sufficient and Necessary Condition

**Independent result:** the existential condition is both sufficient and necessary for broad line-plane parallelism.

Let E mean that some line b contained in alpha is parallel to a, allowing a=b.

- E implies `a // alpha` by theorem2.
- If a is contained in alpha, choose b=a. Coincidence is allowed, so E holds.
- If a is disjoint from alpha, choose a point X in alpha. The plane beta through a and X exists and differs from alpha. Its intersection with alpha is a line b; theorem3 gives `b // a`. Hence E holds in this branch too.

In particular, `a // alpha` iff E. The statement "a is parallel to every line in alpha" is not the intended condition: a directionally different plane line intersects a in the contained branch and is skew to a in the off-plane branch. The later explicit existential wording is therefore an important quantifier clarification, not a source answer to copy.

**Task boundary:** retain sufficiency AND necessity, with both containment/disjoint branches. Mere recognition of a sufficient theorem alone would lose necessity.

## 45 - Line Parallel to the Planes' Intersection

Let c be the intersection of alpha and beta. The source's line is called a in its following question; this delayed naming is inherited, not a new missing geometric constraint.

**Independent result:** a is broadly parallel to both planes. Each plane relation is containment or disjointness, never unique-point intersection. All four joint cases are possible:

| Relation to alpha | Relation to beta | Geometric situation |
| --- | --- | --- |
| Contained | Contained | a=c |
| Contained | Disjoint | a lies in alpha, is parallel to c and differs from c |
| Disjoint | Contained | Symmetric case in beta |
| Disjoint | Disjoint | A parallel line outside both planes |

For a concrete witness, take alpha: z=0, beta: y=0 and c the x-axis. Lines `a={(t,y0,z0):t real}` realize all four cases according to whether z0/y0 are zero. If a is in both planes it lies in c and therefore equals c. Both mixed cases are valid; neither plane can be met in a single point.

**Task boundary:** retain both relations and their correlated cases. No assumption a differs from c or is outside either plane may be inserted.

## 46 - Triangle Midpoint Line and a Plane Through Its Base

Let M/N be the midpoints of AC/BC. Then `MN // AB` by the triangle midpoint theorem; AB is contained in alpha.

**Independent result:** `MN // alpha` in the broad sense, with exactly these two possible positions:

- If C is in alpha, the whole triangle and MN are in alpha.
- If C is outside alpha, the triangle's plane gamma meets alpha along AB. MN is a distinct line parallel to AB in gamma, so it cannot meet alpha.

Equivalently both midpoint endpoints have half of C's signed distance from alpha, so the line is contained when that distance is zero and disjoint otherwise.

**Task boundary:** C outside alpha is not given. A strict-disjoint-only answer loses a legitimate case.

## 47 - Four Full Lines of a Regular Hexagon

Let gamma be the hexagon plane. Both gamma and alpha contain AB. There are two joint configurations:

| Position of alpha | CF | CD | DF | DE |
| --- | --- | --- | --- | --- |
| alpha=gamma | Contained | Contained | Contained | Contained |
| alpha differs from gamma | Disjoint | Unique-point intersection | Unique-point intersection | Disjoint |

**Independent derivation:** in a normalized planar model,

```text
A=(1,0), B=(1/2,sqrt(3)/2), C=(-1/2,sqrt(3)/2),
D=(-1,0), E=(-1/2,-sqrt(3)/2), F=(1/2,-sqrt(3)/2).
```

CF and DE have AB's direction and are different from AB. CD and DF do not have AB's direction, so their full extended lines meet AB. When alpha differs from gamma, their only common line is AB; those direction/incidence facts give the second row of the table.

The normalization is only a similarity model, not an assigned source radius/unit. These are full lines, not finite segments: the intersections of CD/DF with AB can be outside the hexagon. The same-plane row is legal because the prompt never excludes it.

**Task boundary:** retain the ordered four lines CF/CD/DF/DE and the same-plane possibility. A complete table can represent the reasoning, but four independently guessed cells must not conceal incompatible joint assumptions.

## 48 - Parallel to Every Plane Line? Possible Intersection?

**Independent results:** (1) no; (2) yes, it is possible.

- If a is contained in alpha, a plane line of another direction intersects it. A same-direction plane line is parallel; the line a itself is coincident/parallel.
- If a is disjoint from alpha, same-direction plane lines are parallel to it, while different-direction plane lines are skew to it. Coplanar nonparallel lines would intersect, which is impossible here.

So parallelism to every plane line is false in either branch. A unique-point intersection with a plane line is possible in the contained branch; for example two crossing lines in alpha. It is impossible in the off-plane branch. Coincidence is not being miscounted as the course's unique-point intersection.

**Task boundary:** retain both questions. "Can intersect" must not become "always intersects" or be answered from an unstated off-plane premise.

## 49 - Two Point-Based Constructions and All Families

Use X for the arbitrary given point in these independent descriptions.

### 49(1) Plane Through X Parallel to a Given Line l

Construct the unique line `l_X` through X with l's direction, allowing `l_X=l` when X lies on l. Choose any point Y outside `l_X` and take the plane through `l_X` and Y.

**Complete solution family:** every plane containing `l_X`, and only those planes. There are infinitely many.

- If X is on l, every valid plane contains l.
- If X is off l, exactly one plane in this pencil contains l (the plane through l and X); all other planes in the pencil are disjoint from l.

The direction criterion proves completeness: a valid plane through X must contain l's direction, and therefore must contain `l_X`.

### 49(2) Line Through X Parallel to a Given Plane Alpha

Choose any line b in alpha and draw its parallel through X, with coincidence allowed. Varying b's direction gives all solutions.

**Complete solution family:** every line through X with a nonzero direction in alpha's direction space. There are infinitely many.

- If X is in alpha, all valid lines are contained in alpha.
- If X is outside alpha, all valid lines are disjoint from alpha.

**Task boundary:** retain BOTH actual constructions and free-choice families. No point-off-line/point-off-plane restriction or uniqueness claim is supplied by the prompt. Recognition of valid construction steps loses independent execution and must declare that loss later; bare existence alone does not retain the construction task.

## 50 - Plane Through One of Two Parallel Lines

**Independent result:** every plane through a satisfies broad parallelism to b. Construct one by choosing any point X off a and taking the plane through a and X. The solution family is the entire infinite pencil of planes through a.

- If a=b, every such plane contains b.
- If a and b are distinct, their common plane is unique and contains b. All other planes through a are disjoint from b.

All these planes contain the shared direction, proving broad parallelism. A single chosen plane containing both distinct lines is a valid construction but is not the complete family; it is not the only answer.

**Task boundary:** preserve the given broad a/b relation, the construction through a and the coincident branch. Do not require b to be outside the constructed plane.

## 51 - Plane Through Points on Two Intersecting Planes

Keep source uppercase C as a LINE name. Here `A in alpha off C` and `B in beta off C`, with `alpha cap beta=C`. In particular B is not in alpha, A is not in beta, and A/B are distinct.

Construct `c_A` through A parallel to C. It lies in alpha. Since B is outside alpha, it is not on `c_A`. The unique plane pi through `c_A` and B is the required plane. Equivalently construct `c_B` through B parallel C; the distinct parallel lines `c_A,c_B` determine the same pi.

**Independent result:** exactly ONE solution plane. It is broadly parallel to C and, under these actual givens, is in fact DISJOINT from C.

- Any candidate plane through A/B parallel C contains the C-direction, hence contains `c_A`; uniqueness follows from `c_A` and the external point B.
- It cannot contain C: a plane through C and A would be alpha, which does not contain B.
- AB cannot be parallel C: that would put B on `c_A` and therefore in alpha, contradicting B off C in beta.

Its intersections with alpha/beta are `c_A,c_B`. This strict disjointness is a derived fact here, not a universal narrowing of the broad definition.

**Task boundary:** retain off-intersection-line membership, the plane construction, and C's line identity. General "parallel may mean containment" does not authorize containment of C in this specific problem.

## 52 - A Transverse Line and a Plane-Parallel Line

The unique-point condition `a cap alpha=M` makes a's direction transverse to alpha. The broad condition `b // alpha` makes b's direction lie in alpha's direction space. Thus the two directions are different.

**Complete possible relation set:** a and b can intersect in exactly one point OR be skew. They cannot be parallel, coincident, or coplanar-disjoint.

Witnesses with alpha: z=0 and a the z-axis:

- b the x-axis meets a at M=(0,0,0).
- b=`{(t,0,1)}` is outside alpha and meets a at (0,0,1), not M.
- b=`{(t,1,0)}` is contained in alpha and is skew to a.
- b=`{(t,1,1)}` is outside alpha and is skew to a.

**Task boundary:** retain the COMPLETE relation set. If intersection occurs it need not be at M; b need not be outside alpha. Merely eliminating parallelism is not the whole task.

## 54 - Median Section Construction and Area

Let M be the midpoint of AB, as implied by median CM.

### 54(1) Construction and Uniqueness

In face ABD draw through M a line parallel AD. It meets BD at its midpoint E. Connect C,M,E; triangle CME is the required section.

The section plane contains CM and the line ME parallel AD. Hence it is parallel AD. CM and the AD-direction are independent because D is outside plane ABC, so this plane is unique.

To verify the complete section, set A=0 and use B,C,D as an affine basis. The plane through C and M parallel AD is

```text
2*x_B + x_C = 1.
```

Its only edge-intersection vertices are C, M on AB, and E on BD. It therefore cuts out triangle CME, not a quadrilateral. This construction works for an arbitrary nondegenerate tetrahedron; regularity is not given for part1.

### 54(2) Area When Every Edge Has Length a

The edge-length premise applies here. In the regular tetrahedron:

```text
ME = a/2,
CM = CE = sqrt(3)*a/2,
h from C to ME = sqrt((3*a^2/4) - (a^2/16)) = sqrt(11)*a/4,
area(CME) = (1/2)*(a/2)*(sqrt(11)*a/4) = sqrt(11)*a^2/16.
```

ME is a midpoint segment in ABD; CM/CE are medians of equilateral faces ABC/CBD. The section is isosceles, not equilateral. No unit absent from the prompt is introduced.

**Task boundary:** retain BOTH the actual section construction/identification and the conditional area calculation. A standalone area response with no geometric relation to the constructed section loses part1.

## 55 - Intersection With a Plane Through AD Parallel BC

In plane ABC construct the full line l through A parallel BC. Let pi be the plane through intersecting lines AD and l.

**Independent result:** the required intersection is exactly l, the full line through A parallel BC. Pi is the unique plane through AD with BC's direction.

Pi is broadly parallel BC because it contains l. It differs from plane ABC since it contains D, which is outside ABC. Since l lies in both planes, it is their intersection line. Any other candidate plane through AD parallel BC must contain the same direction through A, hence the same l, and therefore equals pi.

The two skew opposite-edge lines AD/BC cannot both be contained in one plane of a nondegenerate tetrahedron; containment of BC is not a second solution branch.

**Task boundary:** retain construction of the intersection line with full-line semantics and the defining plane relationship, not just a label or a finite segment.

## 56 - Complete Section Through Two Midpoints and an Interior Point

Use temporary independent names U for the midpoint of AD, V for the midpoint of CD, and W for the fourth section vertex on AB. These names do not claim source-image labels.

The midpoint line UV in face ACD is parallel AC. Draw through the given P in face ABC a line parallel UV; it meets AB at W. Connect U,V,P,W in that boundary order.

**Independent result:** exactly ONE section, quadrilateral UVPW. Opposite sides UV and PW are parallel. All four vertices remain distinct for every allowed interior P.

For explicit completeness set A=0 and use B,C,D as an affine basis. Write

```text
P=(1-t)*B+t*C, 0<t<1,
U=D/2, V=(C+D)/2, W=(1-t)*B.
```

The plane equation is

```text
x_B/(1-t) + 2*x_D = 1.
```

It meets AD at U, CD at V, BC at P, and AB at W. It does not meet AC or BD. P is outside face plane ACD, so U,V,P are noncollinear and determine this unique plane.

Further derived shape facts, useful to prevent an unjustified restricted branch:

- `length(UV)=length(AC)/2`.
- `length(PW)=t*length(AC)`.
- If t=1/2, P is the midpoint of BC and the section is a parallelogram.
- Otherwise the second opposite-side pair is not parallel. Calling it a trapezoid depends on the intended planar naming convention; the exact incidence/direction facts above do not depend on that taxonomy.

Endpoints t=0 or1 are excluded by the source's interior-point condition; no endpoint degeneracy is a legitimate extra solution here. The midpoint t=1/2 is INCLUDED and must not be excluded merely to force a non-parallelogram.

**Task boundary:** retain the fourth edge vertex, the full polygon, its uniqueness and all allowed positions of P. Recognition of a complete construction/polygon can be evaluated later, but independent drawing is a separate capacity loss to declare.

## Frozen Coverage and Capacity Baseline

The selected source set is exactly `44,45,46,47,48,49,50,51,52,54,55,56`. There are12 source objects; no required source task among those is left unsolved. The full53 source-worked example is intentionally outside the authorized selection.

Any later source-to-choice grouping/splitting must preserve:

- The existential sufficient/necessary distinction in44.
- Both plane relations and legal joint cases in45.
- Both possible plane positions in46 and both joint hexagon configurations/full-line semantics in47.
- Both separate judgments, with proper quantifiers, in48.
- BOTH construction families in49 and the nonunique/coincident branches in50.
- The unique constructed plane and actual off-C consequence in51.
- The complete intersecting/skew alternative in52, including intersection away from M.
- BOTH section construction and area in54.
- The actual intersection construction in55 and complete four-vertex construction/all interior P in56.

No fixed choice-question count or single/multiple mode is inferred. Complete-table recognition or coherent elimination is not automatically rejected. However replacing a construction with mere existence, dropping a required branch, copying definition data without the source judgment, leaking a result into a conclusion, or silently omitting the geometry behind54's area would require a substantive adverse finding later.

Construction-to-recognition cannot establish independent pencil-and-paper execution, and proof recognition cannot establish independent proof writing. These are genuine capacity losses to check in the later author's declarations; they do not by themselves predetermine PASS or failure before seeing a view. No proof, graph or drawing ability is claimed to have been tested by an unseen option set.

## Freeze and Wait

All12 independent source solutions and their domains/task boundaries are frozen before any choice view/internal disclosure. No learner options have been solved or approved yet; no draft key has been compared.

Next allowed step requires the parent's official seed and later explicit learner-only view authorization. Stage2 must independently check task fidelity/redundancy/leakage and EVERY option's complete true set before any Stage3 internal key/rationale access. Stopped at this Stage1 handoff.

## Official Seed Binding - After Modern Finalization

Date: 2026-11-16. The parent supplied the official seed after its reported modern-finalize PASS. This appendix binds the existing solutions without re-solving unchanged mathematics. All preceding Stage1 bytes, including the provisional draft-status observation, are preserved as historical evidence.

Official file:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-c1-s1-n7-choice-seed.json`.

- Actual seed raw-byte SHA256: `b1b9d8ed264f172738b2c0f463e22fd67dac5ade0ea6459dd2937938d2a75011`.
- Official canonical seed digest: `eb09c490432b67ad1d6e8eef9072c245f2e19cde81898ed2a80f5168cbca01a0`.
- The digest was obtained read-only with `python3 .agents/skills/ld-s10y-choice/scripts/prepare.py digest <seed-path>`; this was not a prepare operation.
- Original complete Stage1 report SHA256 before appending: `8e1bf120f198f4e7514e37ff6501aa322973139b834f924711f70e67ee546894`.

### Content Comparison

The official schema is `s10y-choice-seed-v1`; source selectors are exactly book `9-10g`, lesson `geo910-c1-s1-n7`, and `concept_figure_ids: []`.

The actual selected tasks, in order, are exactly:
`44,45,46,47,48,49,50,51,52,54,55,56`.

For every selected task, the seed text is literal-equal to the current ready modern written text AND to the retained pre-final template whose hash equals the original Stage1 input hash. The current/template number, source number, group, group id, page refs, figure refs and figure records are also equal. The comparison did not display53 or the full source snapshot.

All12 frozen source solutions therefore remain bound without new mathematical work. The official seed excludes53. Both current modern lesson/exercises now report `status: ready`; their file hashes differ from the Stage1 draft-status observation, but all selected task/definition contents are unchanged. No assertion is made about unselected53's normalization or other unselected content.

Official concept indices are exactly `0,9,10,11,13,17`, and each seed text is literal-equal to both the current ready paragraph and the retained Stage1-input template paragraph:

| Concept block | Bound content / relation to earlier freeze |
| --- | --- |
| 0 | Two distinct line points in a plane imply line containment; a unique common point means intersection. This was already read in the earlier n7 context; it is now explicitly seed-bound, not a new mathematical premise. |
| 9 | Three positions and the merge of containment/disjointness into broad parallelism. |
| 10 | Explicit broad line-plane parallel definition, including containment. |
| 11 | Both orders of line-plane parallel notation. |
| 13 | Theorem2's source wording and its selected-plane-line condition. |
| 17 | Corrected theorem3 conclusion comparing the intersection line with the given line. |

The earlier independently read theorem3 givens/target paragraphs18/19 are not separate official seed concept entries. The selected full statement17 supplies the corresponding relation already used in the frozen reasoning. No seed change or extra concept field was invented.

Exercise44 and concept13 retain the original written wording in the official seed. The parent's authorization for a later new44 view to state the existential condition remains recorded above; that is not an assertion that this seed was rewritten, or that an unseen view has been approved. No view/options/internal notes or draft key was opened.

### Source and Asset Binding

The official seed has `figures: []`, every selected task has `figure_ids: []`, and `concept_figure_ids: []`. Current selected modern exercise refs/figure records are likewise empty. Consequently there is no selected source image to open, no missing task-image premise, and no figure inventory/review to repeat. Unselected body/exercise53 artwork in the lesson manifest is not a seed input.

All four actual trace entries were hash-checked against existing local bytes:

| Trace path | Actual matching SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/book.json` | `75d822127fae91470f63034cefa8bcad20833a75f67e96ef28ecc273caf6d69f` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n7/lesson.json` | `3004de8a2a612bc26ce705c99bb112c636c4daee3b4efc66d5e936c950cbe1c9` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n7/exercises.json` | `4348d791c5b8931a7ed25d5a96cce2c7e6af5f20fa0cfed8f4b6085793ffd386` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n7/figures.json` | `ffc462c5fc840f03fa374f5f284b6f675d5d4eaf40f6855ce0bed839427403c3` |

The book and figure manifest were used only for the authorized trace hash checks, not to inspect unrelated content or figure reviews.

### Actual Result and Wait

One read-only structured binding comparison returned exit0 with:

```json
{
  "binding": "PASS",
  "exercise_texts_exact_to_frozen_inputs": true,
  "exercise_identity_and_refs_exact_to_frozen_inputs": true,
  "concept_blocks": [0, 9, 10, 11, 13, 17],
  "concept_texts_exact_to_frozen_input_context": true,
  "excluded53": true,
  "source_assets": [],
  "no_selected_figure_inputs": true,
  "current_status": {"lesson": "ready", "exercises": "ready"},
  "all_four_trace_hashes_verified": true
}
```

The original frozen independent mathematics is reused unchanged for this official seed digest. This is complete Stage1 input binding, not a semantic verdict on unseen choices. Only this appendix was written; no seed/template/source/helper/manifest/answer/choice was changed, and no new solve or pipeline validation was run. Stopped, waiting for separate learner-only view authorization before Stage2.
