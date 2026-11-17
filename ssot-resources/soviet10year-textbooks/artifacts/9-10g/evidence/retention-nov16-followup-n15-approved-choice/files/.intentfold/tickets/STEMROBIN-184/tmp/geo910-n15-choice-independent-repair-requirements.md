# STEMROBIN-184 n15: First Rejected Review and Minimum Repair Requirements

Date: 2026-11-16.
Review: `geo910-n15-choice-independent-review-rejected-1.json`.
Outcome: **revise**, not approval.
No author repair was performed. No validator was invoked.

## Snapshot and Evidence

- Draft bytes: `bdc8f4e9b34c6e495ad43c89f15219087351e9326a6eeb62ee3d3bc7ec9b64b1`.
- Draft canonical SHA-256: `8d6c42658eda5930563d253fd2d90d82cba9deac7b759922b685634a5c6f0bfa`.
- Seed canonical SHA-256 retained: `ae036d4c9fee63d425d062afe4d5250e052276cb72df9582f1624807c4ef7143`.
- Draft learner-view projection canonical SHA-256: `04b50374d985696ad660d2d0ffc8019795d89fb7d4cfb2d42f7b5866471cbd06`, exactly the Stage 2 view snapshot.
- Author solve checkpoint bytes: `b1e75dfa4d50f8ee3ceef83724e979de71e51e88d905148f25f6da8f69a07c75`.
- Author handoff bytes: `8b754e9d1940cb85444aea0c65ecdfdabee9999b2b13d9e824e41691b14a9faa`; canonical SHA-256: `adc1327d4bc0e347bdb97e0e91c0732e28dca2f14a94e7e4c5a4ef7454cee65d`.
- Handoff draft, view, and solve references agree with the inspected snapshots. Its reported historical mechanical pass was not rerun and is not semantic approval.
- Both original reviewer freezes remain unchanged; their hashes are in the separate Stage 3 addendum.

The authorized n14 definition at `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n14/lesson.md:35` requires only distinct points to have distinct images. The review rejects a source-definition substitution, not the mathematically valid theorem that a Euclidean isometric self-map is onto.

## Required Local Repairs

### 1. Q1: Restore the Source Definition and Separate the Extension

Affected draft: `geo910-n15-choice-draft.json:11`, and Q1 `intent` at lines 21-25; source-159 coverage at lines 251-255. Author checkpoint: line 40 and the contextual interpretation of its 159 section.

Replace the bijective definition in the stem with the textbook's injective-self-map definition. Literal 159 ends at:

`F(X)=F(Y) => |XY|=0 => X=Y`.

Correct task/source_solution/unit_reason/limitations and source-159 coverage so they do not make surjectivity necessary to being a transformation, or call its unproduced proof an omitted task explicitly requested by literal 159.

Minimum non-destructive route: the complete inverse/isometry question may remain as a clearly attributed stronger Euclidean application. Its global-inverse proof is valid and must remain justified by the orthogonal-frame argument, not by the word "transformation". State internally that the source injectivity judgment is covered and the onto/inverse component is an extension. If the author instead retargets the view directly to injectivity, that is also possible, but it is not required merely to remove the erroneous definition and attribution.

No independent mathematics requires changing the existing Q1 true set {D} for the minimum definition-only/application-attribution route. Do not silently change the frozen reviewer truth set if a larger option rewrite is chosen; obtain a new review of that new view.

### 2. Q2: Correct the Definition, Keep the Two-Property Classification

Affected draft: `geo910-n15-choice-draft.json:43` and Q2 `intent.task` at line 53, with dependent source/response-unit and rationale wording as needed.

Replace "one-to-one and onto" with the source injective definition. Make the original first demand injectivity/transformation, not a stipulated bijection. `T^2=id` validly proves injectivity and additionally onto; the latter may remain as a stronger fact without changing the definition.

Retain the perpendicular and oblique branches, midpoint construction, fixed plane points, original figure, paired response, exact isometry condition, and {C}. Q2.B's misconception must be framed as confusing non-isometry with failure of source-defined transformation; reversibility/onto can be mentioned only as additional properties of this particular involution, not universal definitional requirements.

No new diagram or option redesign is needed.

### 3. Q3: Internal Inverse-Provenance Correction Only

Affected draft: `geo910-n15-choice-draft.json:90`, the sentence asserting the inverse has whole-space domain by the transformation definition. Author checkpoint: its source-161 paragraph making the same inference.

An injective self-map has an inverse on its image; the definition alone does not say the image is the whole space. For this movement, use the already established orthogonal-isometry theorem `F(x)=Qx+b`, whose invertible Q gives a whole-space inverse, and then prove inverse distance preservation.

Q3's learner view, options, {A,C,E,F}, and inverse-direction response unit need no change. The review marks task/source-context fidelity revise for this internal attribution while the independently checked option mathematics passes.

### 4. Correct Dependent Author Evidence Without Erasing Rejected History

Issue a corrected author checkpoint/addendum rather than leaving its bijective source definition and definition-level inverse-domain argument current. Preserve the original inspected evidence or label its supersession explicitly. Retain the valid onto/inverse proof as an extension; it need not be discarded.

After authorized author edits, regenerate the two learner-view exports and handoff's affected snapshot/coverage references. Do not carry the old semantic-pending handoff or its old draft hash as a binding for edited content. Preserve this rejected review and both original independent freezes.

The authoritative source definition is outside the present seed's selected concept block. The parent owns any upstream source/definition registration and book-trace reconciliation; this review does not mutate the seed or authorize trace regeneration. Keep validator execution deferred until the parent resolves that prerequisite and authorizes it.

## R1/R2 After Actual Internal Comparison

R1 remains a true dependency: Q4's equality clauses yield Q5's line/plane center loci. The actual author explicitly records recognition-only limitations and source-162 proof-production loss; Q5 openly uses the equality criterion and compares finite/infinite complete loci. It does not claim these clauses are independent proof measurements. Under the semantic gate, justified theorem application and ordinary recognition are not automatic failures. **No mandatory Q4/Q5 redesign is requested.**

R2 remains a true equivalence under inversion: Q3's forward C and reverse F use the same parallelism rule. Actual `unit_reason` presents F as an inverse application, not a fourth original source relationship. With the inverse-provenance repair above, this is a legitimate added application. **No mandatory removal of Q3.F or change to its true set is requested.**

Q6's coincident case and Q7's contained case likewise reuse the single-plane theorem after genuine union simplification; they are explicit added cases, not missing original tasks or inflated original counts.

## Unchanged Passing Mathematics and Coverage

All 36 option truths and 7 exact sets agree with both the prior independent freeze and the author key:

| Question | Complete true set |
| --- | --- |
| n15-q1 | {D} |
| n15-q2 | {C} |
| n15-q3 | {A,C,E,F} |
| n15-q4 | {A,B} |
| n15-q5 | {A,B,C} |
| n15-q6 | {A,C,F} |
| n15-q7 | {A,B,C} |

Every original task relationship remains represented: 1+2+3+2+7=15 explicit source units, including all seven complete center loci. The author's authorized files do not assert the earlier requested count 13. The source-context correction changes what literal 159 requires; it does not change the count of its one judgment.

No additional option-truth, source-figure, essential-locus, ordinary-recognition, or unconditional answer-leakage defect was established. The first review remains revise because correct mathematics cannot cure the changed source definition and its dependent internal attribution.

## Verification Boundary

Reviewer-owned outputs may be checked for JSON syntax, exact local IDs/option counts, snapshot binding, and preservation of the two freezes without invoking the skill validator. Such local evidence checks are not authoritative seed freshness, book-trace reconciliation, or a validation pass.

No new image was opened; the Stage 1 actual-asset inspection is reused with its original hash and observations. The author rendering path named by the handoff was not opened. No draft, checkpoint, handoff, source, browser, database, environment, application, dependency, Git, or history change was made by this reviewer.
