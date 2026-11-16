# geo910 n7 modern independent semantic review

## Scope and independence

- Reviewer: independent non-author agent, under the existing STEMROBIN-184 parent delegation; not direct human mathematical approval.
- Scope: faithful n7 lesson and all 13 written exercises 44-56, followed by current modern lesson/exercises templates. No answer/choice artifacts, figure/context review, source edits, tool edits or pipeline operations.
- Sequence: full faithful lesson/exercises read and independent mathematical/task observations frozen in this section before opening modern templates. An earlier search exposed author-report summaries; they are not evidence or approval and are not used to derive these observations.
- The source-provided exercise53 analysis/construction/proof/research/note is part of the authorized exercise prose, not an external answer.

## Source-First Freeze

Inputs below are relative to the shared checkout `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

| Input | SHA256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n7/lesson.json` | `f5bbd75eec0d897de1eac552492ce0f232a621449dc68beff41a722f57da5b9a` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s1-n7/exercises.json` | `caab8cb92e3a4347b05553f6e55be83965b4f6daf30dc7f09f5dad260ef435b1` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0026/page.json` | `2be166450c6e05a4ac6292877d3ae2b654e7c67ea2d9b0a5957847b85f0a9adb` |

Read contracts: lesson skill adaptation gate and `references/edition-text-contract.md`. This is a content review, not an adapt-finalize or rendering approval.

### Lesson Mathematics

1. The complete prose covers line containment, unique-point intersection, the construction/proof of the disjoint case, the three-way classification, notation, theorem2 with both proof branches, and theorem3 with both proof branches. Seventeen paragraph objects must remain complete; figure/caption objects are outside this text review.
2. The course expressly combines containment and disjointness as line-plane parallelism. Line-line parallelism includes coincidence. Neither convention may be silently narrowed to the usual distinct/disjoint-only convention.
3. Theorem2 uses a selected line in the plane parallel to the given line. Its wording "任意一条" must not become a requirement to be parallel to every line in the plane.
4. Theorem3 concerns a line a parallel to alpha, contained in beta, and the intersection b of the two planes: b is parallel to a. Off-plane, a and b are coplanar and cannot meet; in the contained branch a=b. Both branches are valid under the course convention.
5. Faithful theorem3 at `lesson.prose[17]`, `p0026#11`, says "两个平面的交线和已知平面平行". Page26 registers `p0026-theorem3-target-line`, with exactly that original span. The required modern target is "已知直线平行", as confirmed independently by the stated goal b parallel a and its proof. The original is vacuously true under containment-inclusive parallelism, but fails to state the intended theorem conclusion.
6. Keep geometric shorthand `a\cap\alpha=A` and the registered symbol conventions. No formula correction is authorized by inference alone. The source terminal p27 punctuation remains unresolved; this review does not guess its pixels.

### Exercise Coverage and Mathematical Checks

All source numbers 44-56 form one exercise group. Only53 references fig-20; no figure pixels are inspected in this task.

| Source | Frozen independent check / task boundary |
| --- | --- |
| 44 | Test sufficiency and necessity of theorem2's condition. Broad parallelism admits a plane line with the same direction, including the given line itself if contained. Do not replace the selected-line condition with universal parallelism. |
| 45 | A line parallel to the planes' intersection is broadly parallel to each plane. Source naming of a is deferred to the following sentence; do not invent a new spatial restriction. |
| 46 | Triangle midpoint line MN is parallel AB, hence broadly parallel alpha. C outside alpha is not given; triangle/line containment remains possible. |
| 47 | Four full lines CF, CD, DF, DE for a regular hexagon and a plane through AB. CF/DE have AB's direction; CD/DF meet the extended AB. If the plane is the hexagon plane all four are contained. No distinct-plane assumption may be added. |
| 48 | Two separate questions: parallel to every plane line; possible intersection with one. The first is not generally true; the second is possible in the contained branch. Both must retain the broad convention. |
| 49 | Two constructions: a plane through a given point parallel a given line; a line through a given point parallel a given plane. No point-off-object or uniqueness premise is supplied; solution families are allowed. |
| 50 | Parallel a,b may coincide. A plane through a is broadly parallel b, even if b is contained in it. |
| 51 | A in alpha and B in beta, each off their common line named uppercase C. Construct the plane through A,B parallel C. AB cannot have C's direction, otherwise B lies in alpha and therefore C. The plane is unique. C must remain a line name, not a point. |
| 52 | a intersects alpha uniquely at M, b is broadly parallel alpha. a,b cannot be parallel or coincident; they can intersect or be skew. b may be contained in alpha. |
| 53 | Preserve original prompt plus analysis, two construction steps, proof, uniqueness research, and the complete methodological note. For A=0 and B,C,D an affine basis, M=tD,N=sB with 0<t,s<1, the section is x_B/s+x_D/t=1. P=sB+(1-s)C and Q=tD+(1-t)C are interior-edge points; NMQP is the unique nondegenerate quadrilateral. Source steps `[NP] // (AC), P in [BC]` and `[MQ] // (AC), Q in [DC]`, theorem2 proof, axiom4 uniqueness, and four-stage discussion are substantive content, not removable hints. |
| 54 | Construct the section containing median CM in face ABC and parallel AD, then find its area when all edges equal a. Section C M E has E midpoint BD; ME=a/2 and CM=CE=sqrt(3)a/2, giving area sqrt(11)a^2/16. Retain both requests and the regular-tetrahedron condition for the area. |
| 55 | Construct intersection of plane ABC and a plane through AD parallel BC. The intersection is the line through A with BC's direction; tetrahedron supplies nondegeneracy. |
| 56 | Section through midpoints of AD,CD and an interior point P of BC. For P=(1-u)B+uC, 0<u<1, section x_B/(1-u)+2x_D=1 gives an interior point on AB and a unique quadrilateral. Do not add endpoint or extra placement restrictions. |

Exercise53 source spans: `p0027#12`, `p0027#13`, `p0028#1`, `p0028#4`, `p0028#5`, `p0028#6`. Its note covers planning, executing the construction, verifying conditions and counting solutions; it also says the four stages need not always be separately written, proof can be combined with construction, and research is often omitted unless requested.

Source-first conclusion: no new mathematical source correction is inferred beyond the bound theorem3 prose erratum. Inherited shorthand, "任意一条" wording, deferred a naming in45, and the unresolved terminal punctuation are limitations to preserve or explicitly report, not grounds to invent hypotheses.

## Modern Comparison

Pending at the time the source-first section was written. Modern templates have not yet been opened.

### Current Input Binding

Review completed on 2026-11-16. The source-first report prefix above was frozen before template reading with SHA256 `0b4a87d6549ab193b2359d80ef04e283f5103298a244fb0d5fb5b519c44f7788`; the prefix is retained verbatim rather than replaced by this comparison.

| Current draft input | SHA256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n7/lesson.template.json` | `090ce96e411d57914431064281e6b526281ced5b5a7a60357e9ca897363b04cb` |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n7/exercises.template.json` | `5f8ebbe42550de1f915e513b5de103a26cc53fb5c7480e6ad3da8c1b687243d2` |

Both draft hashes and all three faithful-source hashes were unchanged across reading and comparison. Both templates remain `status: draft`.

### Independent Lesson Comparison

| Current paragraph objects / source | Result and substantive observation |
| --- | --- |
| `prose[0]`, `p0025#8` | PASS. Two different points and exactly one common point remain separate premises, with axiom3 and section2 references intact. |
| `prose[1-2]`, `p0025#9-10` | PASS. Empty intersection, M outside alpha, b in alpha and a through M parallel b remain explicit; no proof premise is removed. |
| `prose[5,8]`, `p0025#11/#14+p0026#1-2` | PASS. Assumed N, distinctness of a/b, N not on b, section6 criterion and the contradiction are all retained. This remains a reductio, not an assertion that the incompatible relations actually coexist. |
| `prose[9-11]`, `p0026#3-5` | PASS. All three cases and both parallel notation orders remain. The definition explicitly includes the contained-line case; no disjoint-only replacement occurs. `a\cap\alpha=A` remains the inherited geometric shorthand. |
| `prose[12-16]`, `p0026#6-10` | PASS. Theorem2 keeps a selected plane line, its source wording "任意一条", two proof cases, preceding argument, contained-case conclusion and black square. No "所有直线" hypothesis is introduced. |
| `prose[17]`, `p0026#11` | PASS. Modern target is exactly "两个平面的交线和已知直线平行". The bound erratum is correct; see below. |
| `prose[18-20]`, `p0026#12-14+p0027#1` | PASS. All three givens and b parallel a target remain literal. Noncontained and contained proof branches both survive, including the latter's "定理显然成立". The contained branch is justified by a=b under the broad convention, not by silently removing it. |

Seventeen source paragraph objects are retained in order. All 23 prose objects preserve their kind/id/label/printed-page/source-ref metadata. Mathematical spans match source after whitespace normalization, including subset/not-subset, empty-set, parallel signs and the proof-ending square. No new formula, missing formula, numerical premise or domain restriction was found.

Theorem3 binding was checked against actual page26 metadata, not inferred from author approval:

- Exactly one registered erratum, `p0026-theorem3-target-line`, targets `lesson.prose[17]`.
- `p0026#11`, physical26/printed19, current page JSON SHA and PDF SHA all agree with the actual source record.
- The original span occurs exactly once in the faithful target and remains unchanged in `source_text` and `source.data`.
- The corrected span occurs exactly once in modern prose, the original span is absent there, and the target declares `math-correction`.
- The correction changes the conclusion's noun, not any formula or parallelism definition. No tooling fix is reviewed or approved by this content report.

### Independent Exercise Comparison

| Source number | Verdict | Comparison with the frozen task |
| --- | --- | --- |
| 44 | PASS | Sufficiency versus simultaneous necessity remains the entire question; no answer or universal-line condition is added. |
| 45 | PASS | Both a/alpha and a/beta questions remain; "分别可能有哪些" faithfully permits the inherited cases. The source's delayed a naming remains a disclosed limitation. |
| 46 | PASS | AB containment, AC/BC midpoints and full line MN remain; "可能有哪些" does not exclude C in alpha or MN contained in alpha. |
| 47 | PASS | Regular hexagon, plane through AB, and ordered CF/CD/DF/DE all remain. Four subparts each have their own line. No plane-distinctness or segment-only reading is inserted. |
| 48 | PASS | Both universal-line question and possible-intersection question remain separately; broad parallelism is not narrowed. |
| 49 | PASS | Both plane/line constructions are retained as separate subparts. No outside-point assumption, unique solution claim or extra construction target is added. |
| 50 | PASS | Plane through a parallel b remains a construction, not a request for a plane avoiding b. Coincident a/b remain allowed by the course. |
| 51 | PASS | Both points are explicitly off the intersection line C, with their respective plane membership intact. Uppercase C remains the line name. |
| 52 | PASS | The exact two mathematical givens and the request for all possible a/b positions are preserved. Contained b is not excluded. |
| 53 | PASS, text semantics | The prompt, ordered M/N edge assignment, interior-point condition, all five worked/discussion components and both construction formulas are retained. No portion is replaced by a new answer or discarded as a hint. The separate helper-layout issue is not a semantic failure of these current bytes. |
| 54 | PASS | Both construction and conditional area requests remain, including median CM and all-edge-length a premise. It does not assert a regular tetrahedron in subpart1. |
| 55 | PASS | Four vertices, plane ABC, full AD/BC lines and the requested intersection construction are unchanged. |
| 56 | PASS | Both midpoint conditions, interior BC point P and the section-construction request remain. No added assumption restricts P. |

All 13 exercise identities, source numbers, groups/group ids, source refs, figure refs and figure labels match faithful objects exactly. All `source_text` fields match their faithful text exactly, and each modern `lines` array joins to its `text` exactly. Mathematical spans match after whitespace normalization. The comparisons cover original mathematical requests, not independent answer-key approval.

Exercise53 specifically retains, in order:

1. Analysis: assume the section exists, connect M/N, identify the face ADB intersection, and invoke theorem3 for NP/MQ parallel AC in the other two faces.
2. Construction: both `[NP] // (AC), P in [BC]` and `[MQ] // (AC), Q in [DC]`, followed by the NMQP conclusion.
3. Proof: MQ parallel AC implies plane NMQ parallel AC by theorem2.
4. Research: one solution, unique P on BC, then unique MNP plane by axiom4.
5. Note: analysis plans; construction executes; proof checks every condition; research counts distinct solutions. Its qualification that not every problem needs four separately written stages, proof can accompany construction, and research is often omitted unless requested is complete.

The current53 authored text has 27 lines, including blank paragraph separators. The conclusion after construction step2 is present even though it immediately follows that step without a blank separator; subsequent proof/research/note paragraphs remain in the current text. This review neither invokes the subpart-normalization helper nor certifies its output. The parent-owned flatten issue must not turn the worked suffix into a missing-content diagnosis or permission to delete it.

### Actual Prose Flow and Scope Limits

One read-only run of official `prose_flow.mjs` on the current lesson returned exit0 and 19 final text paragraphs. The four stored section anchors match actual adjacent final paragraphs at indices1/7/9/14:

- Known containment/intersection cases -> introduction of the disjoint case.
- Three-case classification and merging statement -> broad parallel definition.
- Parallel notation -> criterion introduction.
- Theorem2 contained-case conclusion -> corrected theorem3.

The three-case list is split into final paragraphs5/6 by its existing blank line, with case3 and the merging sentence together in paragraph6. The stored definition boundary is therefore after that complete classification, not after case2. No stored break interrupts the two-case reductio proof or separates theorem2's hypothesis from its statement. Final theorem3 proof branches remain separate paragraphs17/18. No visible-layout/browser approval is claimed.

Inherited limits remain disclosed, not silently repaired:

- The source's "任意一条" wording is not a universal requirement to be parallel to every plane line; current adjacent proof and exercise44 retain its selected-line meaning.
- Exercise45 does not name a in its first sentence, but the following question does. No unregistered mathematical span was inserted.
- `a\cap\alpha=A` and uppercase C as a line name remain literal source conventions.
- Modern sentence-final punctuation in the theorem3 proof is editorial punctuation, not a new claim about unresolved p27 pixels.
- Fig17-20 metadata/references are retained only. Figure construction, visual incidence and figure20 readability remain outside this assignment.

### Draft Record Read Last

After completing the independent content comparison, the author report `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n7-modern-author.md` was read only as a draft record. Its actual SHA256 is `85bd5e1efb4138c968e9c0279013aae7e05589606c8c93ea32ecae561d7179ab`.

Its current lesson/exercises hashes equal this review's observed bytes. Its reported 17 paragraph objects, 19 final text paragraphs, 13 exercises, source refs and erratum identity agree with independent observations. Its own read-only check exit1 and exercise53 helper flatten conflict are retained as author-reported evidence, not re-run and not converted into independent overall structural PASS. No claim is made that a historical tool failure or its repair was independently reproduced here.

## Final Verdict

**PASS for the current n7 modern lesson and all 13 written exercises in the authorized independent text-semantic scope.** No substantive modern mathematical/request-coverage defect was found. The sole registered theorem3 prose correction is correctly bound; broad parallelism and the complete source-worked exercise53 are preserved.

This verdict is not figure approval, answer/choice approval, adapt-finalize approval or publication approval. The separately assigned53 helper conflict and unresolved source punctuation remain explicitly outside certification. Only this report was written; no source/template/tool/figure/index/application/database/Git artifact was modified.
