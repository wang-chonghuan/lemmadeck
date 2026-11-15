# geo910 n1/n2 Modern Text Author Handoff

Ticket: STEMROBIN-184.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Status: authored scratch drafts, pending parent text review and separate figure authoring. Not finalized, reviewed, promoted, published, or complete.

## Scope And Inputs

Only the prepared n1/n2 lesson and exercise templates were edited, using `apply_patch`. The prepared templates' complete source snapshots were the content authority. Source files were read only to confirm the existing SHA bindings and snapshot equality. The source index, pages, figure pixels, tools, dependencies, answers, choices, and other reviewers' artifacts were not edited or consulted.

No repeat prepare, finalize, render, assembly, browser, service, network, model, DB, commit, or publication action was performed for this assignment. n3 and unindexed physical20-23 were outside this assignment and were not incorporated.

Template root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/`

The four authored files are:

- `geo910-c1-s1-n1/lesson.template.json`
- `geo910-c1-s1-n1/exercises.template.json`
- `geo910-c1-s1-n2/lesson.template.json`
- `geo910-c1-s1-n2/exercises.template.json`

Both `figures.template.json` files remain byte-identical to the prepared pending manifests. No figure readiness or approval is claimed.

## Exact Edit Surface

Lesson edits are limited to prose `text`, prose `changes`, and `section_breaks`. Exercise edits are limited to `text`, matching `lines`, and `changes`. All source snapshots, `source_text`, IDs, titles, hierarchy, numbering, groups, counts, source references, page bindings, figure references, figure/caption objects, empty errata lists, `numeric_changes`, `historical_entities`, and draft status remain unchanged.

All modern display-text sentence periods are ASCII `.`; immutable source snapshots and identity metadata retain their prepared bytes. Complete sentences and separately introduced formulas replace legacy print-line fragmentation. Mathematical expressions remain unchanged, including point-valued intersection notation without added braces.

### n1 Lesson

- `p0008#3`: replaced the grade-system-specific six-to-eight-year introduction with prior geometry study; retained the plane-geometry scope, all four examples, and the all-points-in-one-plane definition.
- `p0008#4`: retained space figures, both planar and nonplanar cases, all four solid examples, and continued applicability of plane geometry.
- `p0008#5`: replaced the grade-eight progress reference with prior study; retained the continuation and all four study topics: axiomatic construction, mappings, vector operations, and use of vectors in proofs/problems.
- `p0008#7`, `p0008#8` + `p0009#1`, and `p0009#2`: retained the four logical construction steps and the explicit course exceptions for omitted proofs and theorem-as-exercise presentation. Step numbers remain 1-4, attached to their sentences.
- `p0009#3`: retained all four primitive geometry concepts, the nondefined status of sets in all other mathematical branches, the definition of a figure as any point set, and line/plane examples.
- `p0009#4`, `p0009#9`, and `p0009#10`: retained all diagram representations, Greek plane notation, Latin point/line notation, incidence terminology, the space definition, and the exact subset formula.
- `p0009#13`: retained the circled oral-task convention and its symbol.

### n2 Lesson

All nine axioms and their explanatory material remain. Changes modernize wording and sentence flow only:

- `p0010#3-6`, `p0011#1-4`: primitive concepts, abstract/practical basis, five incidence axioms, nonempty proper point sets, existence outside every line/plane, unique line through two different points, and the coincidence conclusion.
- `p0011#9-13`, `p0011#16`, `p0012#1-2`: plane containment, the straightedge/light-gap method, all equivalent containment terminology, the entire line-plane single-intersection construction and contradiction proof, and the intersection definition.
- `p0012#3-4`, `p0012#9-13`, `p0013#1`: unique plane through three noncollinear points, the three-stick/cardboard model, plane notation, the coincidence consequence, different-plane intersection axiom, intersection terminology, and adjacent-wall model.
- `p0013#2-8`: all three distance axioms, nonnegativity, the exact if-and-only-if zero/coincidence clause, symmetry, the non-strict triangle inequality for arbitrary three points, all three plane-geometry axiom groups, validity in every plane, Pythagoras, and the exact 180-degree formula.
- `p0013#11` and `p0014#6`: retained both appendix references and both occurrences of printed page270.

No distinctness, noncoincidence, outside-point, strict-parallel, or other unstated hypothesis was inserted.

### Written Task Coverage

| Lesson / Source Task | Retained Task And Display Changes |
| --- | --- |
| n1 / 1 | Say the primitive concepts; circled task marker and footnote star retained. |
| n1 / 2 | All10 axiom/theorem/definition judgments, in original order, now `a)`-`j)`. “合同” becomes modern “全等”; “交” becomes “交集”; the defined term “位移” remains. Strict polyline-length wording, arbitrary-point parallel statement, unique circumference, and rotation formula remain without added hypotheses. |
| n2 / 3 | Read all six symbol groups and draw sketches; now `a)`-`f)`. Every formula remains exactly printed, especially source3(2) `a\in\alpha` and source3(6) `C\notin(A,B)`. |
| n2 / 4 | Express all four incidence/intersection descriptions symbolically; now `a)`-`d)`. All positive and negative conditions remain. |
| n2 / 5 | All four necessary/sufficient/iff blanks; now `a)`-`d)`. No different-plane condition is added to the third item. Underline and task/footnote symbols remain. |
| n2 / 6 | Both correctness judgments and the second item's construction of the altitude intersection; now `a)`-`b)`. Original “在三角形 ABC 内” and possible coincident-point readings are not silently restricted. |
| n2 / 7 | Rectangle vertex counts exactly one/two/three; now `a)`-`c)`. |
| n2 / 8 | Both incircle/circumcircle-center cases; now `a)`-`b)`. The common third-vertex question is moved into the shared stem, not attached only to the second item. |
| n2 / 9 | Explain the source's universal three-legged-table statement and its failure for four-legged tables; no invented physical assumptions. |
| n2 / 10 | Both two/three different circular-arc-point cases; now `a)`-`b)`. The every-point question is placed in the common stem. |
| n2 / 11 | Both the platform/straightedge inspection method and its underlying principle. |
| n2 / 12 | Two different planes / two different common lines possibility question, unchanged except sentence punctuation. |
| n2 / 13 | All seven given expressions, difficulty star, and full proof request. No extra endpoint/point-distinctness assumptions. Given data and proof request occupy separate complete lines. |
| n2 / 14 | All four given expressions and proof request, separated into complete lines. |
| n2 / 15 | Given points, the exact nonincidence condition, and the strict inequality proof request, separated into complete lines. |

There are exactly2 n1 tasks and13 n2 tasks. The drawing/proof/open-reasoning tasks have not been replaced by answers or recognition-only questions.

## Prose Flow Anchors

Ran the existing `prose_flow.mjs` separately on each edited lesson, then copied its actual adjacent paragraph objects into `section_breaks`. No hand-calculated index is stored.

- n1: introductory study scope -> logical construction; course exceptions -> primitive concepts.
- n2: abstract/practical introduction -> incidence group; adjacent-wall example -> distance group; triangle inequality -> final plane-geometry axiom group.

Read-only resolution with the same `htmlfrag.js` parser succeeds for all five anchors. The resulting current flows contain14 n1 and31 n2 prose paragraphs; these counts are parser observations, not source-row or completeness substitutions.

## Read-Only Checks And Real Blocker

JSON parsing succeeds. Every current exercise `lines.join("\n")` equals its `text`. Subpart normalization leaves every current exercise text unchanged. Modern display text contains no Cyrillic letters or U+FF0E sentence periods.

All54 prepared lesson objects and all15 exercise objects are retained in order. All178 mathematical signature entries match their source sequences. All four current source-file byte hashes match their embedded bindings, and all four embedded source data objects equal the current source JSON.

The direct existing `edition.validate_text` check returned exit1 with eight nonformula-number errors. Its canonical subpart formatter retains numeric source markers, while `number_signature` still counts those marker digits. Thus the requested numeric-to-Latin marker modernization fails its number check even though no mathematical data changed.

Retained failures:

| Source Task | Existing Check Expected | Existing Check Observed |
| --- | --- | --- |
| n1 / 2 | `['1','2','3','4','5','6','7','8','9','10']` | `[]` |
| n2 / 3 | `['3','1','2','3','4','5','6']` | `['3']` |
| n2 / 4 | `['4','1','2','3','4']` | `['4']` |
| n2 / 5 | `['5','1','2','3','4']` | `['5']` |
| n2 / 6 | `['6','1','2']` | `['6']` |
| n2 / 7 | `['7','1','2','3']` | `['7']` |
| n2 / 8 | `['8','1','2']` | `['8']` |
| n2 / 10 | `['10','1','2']` | `['10']` |

A targeted read-only diagnostic used the existing complete marker-sequence detection to remove only source subpart markers before comparing nonformula numbers. All15 tasks then matched, with exact math sequences also matching. This isolates the failures to marker representation; it is diagnostic evidence, not an adaptation PASS or a replacement gate.

No numeric-change declarations were fabricated for label removal. No values were moved into math to hide them from the checker. No tool was changed. Parent review/tool ownership must resolve this marker-only contract blocker before finalization. The requested Latin display markers are preserved in the draft.

The source3(2) `a\in\alpha` remains a printed-reading limitation, not a registered correction. The empty `errata` list is unchanged, and no silent replacement with `a\subset\alpha` was made.

## Actual SHA-256

Full file byte hashes:

| Template | Prepared / Before | Authored / Current |
| --- | --- | --- |
| n1 lesson | `ccfebec76efb525a98377436859e759101c62e48b3449df1a4b1c21fab014b26` | `df3109b37d80ea76a9209f0456e86a33bc2930ecf3a125cb86caa6e58ca16ad5` |
| n1 exercises | `9d170fdc28321b1d7e02174c9133b629e168970db033ee5e4a4249490b1262e9` | `d64073372027dd0382f0f85ce7cfcfcb4159c06d0fa90c6d083469af810d4ceb` |
| n2 lesson | `75d9cd06d11d75b5d91014fe152b6713c7982f1c002fcf9ce75a6c7a9245c5bd` | `b27482f669ed847457a0da47eb19062efed18937d01f6bbf95921ef28a41fa32` |
| n2 exercises | `fda5ac40351d622277579ccd6ab34de36653ae50a025d6d9d3e3030eb4f232bf` | `42f0a1348317c44115a381f4679d54dffee66d32e50a1c14a56d8342a4282530` |

Unchanged figure-manifest byte hashes:

- n1 `figures.template.json`: `95cdb4f56814a27d280a759ceaf79745006b03fc20820b1a39b8aaf36336d1b6`
- n2 `figures.template.json`: `f2fc95cb6dcb93a7499e5cbe1e8decab2fb5714b4ae42fa05c327c0edc5fd1d1`

Unchanged source-file bindings:

- n1 lesson: `c5053b1aa9289337c0ab47d0e89cb356354aba36e83bb93efe2b83c6256515d2`
- n1 exercises: `fcad728454edd0ce6fa66cc3a3925e63dd0ae6e84cd2844cbe21900484274062`
- n2 lesson: `543f3c62fca64866e0c2615f8e0313eddf6f8a4485509863018244d54f67ded8`
- n2 exercises: `8fcb8d5a4ba36c04094e9ba304154c215e36658abadc341e0a500abb8a6578df`

Unchanged protected-structure SHA-256 values, computed before and after as `SHA256(JSON.stringify(structuredClone(document)))` after deleting only lesson `section_breaks`, item `text/changes/numeric_changes/historical_entities`, and exercise item `lines`:

- n1 lesson: `14bf3a46d14ffde678dba1973688fcd45bd5c4a06a18107bc89baa262b7df16a`
- n1 exercises: `d713d30908488cbaf5879ab520772d70215112ae7aaf49fb141f517561a3163d`
- n2 lesson: `e675d97f753fddc8378d8c0a05437c764a9e706930d4112f9ed0972b7c1e5e5c`
- n2 exercises: `aa2e30b30a7306ae17772554e9a9fab33c0b91b05fb3cf8aecde7e8130f4e563`

The snapshot, metadata, task/figure identities, and source-text fields are included in these protected-structure digests. Empty numeric/historical declaration arrays were checked separately and remain empty.

## Stop State

Authoring stops here. Parent text review is pending; figures1-7 remain a separate future assignment; the numeric-marker validation blocker is recorded, not bypassed. No claim that n1/n2 are finalizable or product-complete is made.
