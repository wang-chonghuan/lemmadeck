# STEMROBIN-184 n15: Stage 3 Source-Context Addendum

Date: 2026-11-16.
Authorization: the parent consumed both full freezes and explicitly authorized internal comparison of the n15 draft, author solve checkpoint, and handoff, plus the one authoritative n14 definition. No repair or validator run is authorized.

## Preserved Prior Evidence

- `geo910-n15-choice-independent-source-first.md`, byte SHA-256: `7b5cab1757d90eab76407653412602f54e1b490c8327a92e8feda508e50f0d6d`.
- `geo910-n15-choice-independent-view-only.md`, byte SHA-256: `ee3d2a187fffe8b4cc0baccc065f1a73b1ee05e56c60ae693529851a957c8f87`.
- Both hashes were rechecked at Stage 3 entry. Neither file is edited, superseded silently, or normalized to the author.

## Newly Authorized Authoritative Definition

Path: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/lessons/geo910-c1-s2-n14/lesson.md:35`.

The original definition says that, for a mapping of space to itself, any two different points have different images. Thus a space transformation is an **injective self-map**, not necessarily a bijection.

SHA-256 of the exact UTF-8 definition line including its terminating newline, obtained with `sed -n '35p' ... | shasum -a 256`: `18ba6ef2ae2715c96c33f50b6c46cd7db654ad61368597ac923df744f17f893a`.

Only this definition and its immediate surrounding context were displayed; no answer source was read. The parent additionally reports that the registered modern inverse correction retains this definition. That registration was not independently opened and is not required for the conclusion: the directly read authoritative line already resolves it.

## Explicit Correction of My Earlier Source Assumption

Stage 1 assumed the ordinary bijective convention because the restricted seed did not include a transformation definition. That assumption was wrong for this textbook. Its assertions that surjectivity is essential to literal 159, and Stage 2's treatment of Q1/Q2's bijective definition as source-faithful, are withdrawn by this separate addendum.

Literal source 159 is answered by injectivity alone:

`F(X)=F(Y) => |XY|=|F(X)F(Y)|=0 => X=Y`.

The independent orthonormal-basis proof that an isometric self-map of entire Euclidean three-space is also onto remains mathematically true. It is an additional theorem, not a requirement imposed by the original definition or literal 159.

For source 160, the involution argument remains valid and even proves bijectivity, but only injectivity is required for its "space transformation" judgment. The distance-preservation condition remains exactly `l perpendicular to alpha`. The separate meanings of transformation and movement must use the source's injective definition.

## Immediate Visible Consequences

- Q1's definition "one-to-one and onto" is definite source drift, regardless of its mathematically true answer D.
- Q2 repeats the same incorrect bijective definition, so it independently has the same source-context defect, even though its true option remains C.
- These are definition/fidelity defects, not reasons to alter the frozen option truths. A correct Euclidean onto result cannot rescue a changed textbook definition.
- Author task/solution/unit/coverage claims must no longer describe surjectivity as necessary to literal 159 or to the definition of transformation in 160.
- Whether Q1's inverse-isometry application can remain as a clearly identified extension, or must be retargeted to the literal injectivity judgment, will be evaluated against the authorized author intent. No author artifact is repaired by this addendum.

## Other Prior Findings and Remaining Boundaries

The 15-unit source inventory, oblique/perpendicular distinction, equality exceptions for central symmetry, all seven center loci, and all 36 frozen option truths remain unchanged.

R1/R2 are concrete dependence/redundancy observations, not automatic failure rules. Their gate significance must be evaluated against actual author intent, limitations, and coverage, recognizing that ordinary recognition, elimination, or justified application of an earlier theorem is allowed. No final conclusion about those author claims is made in this pre-comparison addendum.

No new image is opened. No author repair, source mutation, application change, database/environment operation, or Git/history lookup is performed. Validator execution remains withheld until the parent reconciles the book trace. The next evidence is a hash-bound first rejected/revise review and concrete minimum repair requirements.
