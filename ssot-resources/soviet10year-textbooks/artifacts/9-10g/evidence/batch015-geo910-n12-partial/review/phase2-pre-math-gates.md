# STEMROBIN-184 / worker184-3: Phase2 Pre-Math Gates

Date: 2026-11-19.
Every command workdir: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Owned outputs: `.tmp/s10y-choice/batch015-geo910-n12-independent/` only.

This file is frozen **before independently solving the q10/q11 options**.
It follows the completed Phase1 source derivations, not author reasoning.
No author correct sets, intents, coverage, repair internals, or prior Stage3
have been read. No q01-q09 option set is recomputed.

## Snapshot and Disclosure Boundary

Read only the new disclosed learner-view input:
`.tmp/s10y-choice/batch015-geo910-n12-repair/view-only.json`.

- File-byte SHA-256:
  `a1cfdef76cea0e6a45275d2fbe85090554235ece59d683d0643454ed85651d2f`.
- Contract-method canonical SHA-256 of the **entire view-only object**:
  `36bdfb73dcf65c945241b1bbcf9f350cd7c2348fbf542c47fca1b1ac47f23b4b`.
- Exactly eleven entries; each exposes only `id` and `view`.
- `new_figures` is empty. Every view/option `figure_ids` list is empty.

Phase1 proof baseline, unchanged file-byte SHA-256:
`8dcd8366f6fb103c8687971de62da2d0a0e041c04023460c92dfe4bddac87d0a`.
Its seed canonical digest is
`e4a23600dcc57983ae486b56ef88280f79707dbe0b5a0d8ad0f0265f27facdcd`.

q04/q07 content is treated as unchanged on the direct human instruction.
No previous view package is searched or diffed to repeat that completed stage.

## q10: Source Fidelity, Redundancy, and Leakage

**Task fidelity: pass for source99(1) only.** The whole source plane, target
plane, transverse projection direction, and possible-image question are
preserved. The option units are complete figures, not isolated cells or
coordinates. Selecting figure types still requires distinguishing full-plane
projection from dimension collapse. Recognition replaces generating a written
classification; that response-production loss needs acknowledgement later.
Nothing here represents the omitted 99(2)/(3) definitions as resolved.

**Redundancy: pass locally, with conceptual overlap recorded.** q02 concerns a
single projecting line, not a whole plane. q03 supplies fixed-point/fixed-line
conditions, and therefore offers a legitimate special-case idea for a plane
contained in alpha, not the complete plane-image classification. q04 describes
parallel lines in a source plane; q10 instead asks for the image of that entire
plane. Their shared dimension-collapse principle is related mathematical work,
not identical response units.

**Answer leakage: pass locally.** No visible source numbers, mapping commands,
author answers, worked projection, or correctness flags occur. The plane/line/
point/half-plane alternatives do not give a keyed explanation. The fact that a
whole plane differs from a proper half-plane is a mathematical set distinction,
not a definition of the latter's boundary. The unresolved boundary convention
of source99(2) does not by itself make this complete-plane question ambiguous.

## q11: Source Fidelity, Redundancy, and Leakage

**Task fidelity: pass locally for the conditional source104(2) task.** The
source skewness and fixed target plane are retained. Providing beta through a
with b's direction gives the learner the auxiliary-plane step, but each option
is a whole conditional scheme rather than a direction label alone. Judging
existence, permissible direction, noncollapse, and the no-solution branch
remains necessary. The wording does not assert that every given configuration
has a construction.

The visible production losses are concrete: the learner need not originate
beta, physically construct l, or write the necessity/sufficiency proof.
Scheme recognition still tests the principal geometry; these losses require
explicit internal documentation later, which this view-only phase cannot
verify. The phrase "direction l" makes its relation to alpha a directional
condition, not a choice about the location of an affine line.

**Redundancy: pass locally, with partial cross-support recorded.** q07 asks
about possible images and a converse implication. q11 requires a complete
construction/existence scheme for the supplied pair and supplied alpha;
general possibility alone does not determine that scheme. q10 asks an entire
plane's image, not restrictions that keep both skew-line images noncollapsed.
q04 starts from parallel source lines, unlike q11's independent directions.

**Answer leakage: pass locally.** beta's construction is an overt given step,
not a hidden correct-set disclosure. No option is marked as right. Three
alternatives share a branch condition but disagree on the actual direction;
majority phrasing cannot choose a complete scheme without geometric judgment.
Length and number of restrictions in a proposed scheme are not independently
sufficient evidence of correctness.

## Directly Affected Relationships with Unchanged q01-q09

**q04 relative to source101.** q04 explicitly asks which configurations cannot
produce **two different parallel image lines**. The Phase1 source101 result,
under the confirmed book convention, instead asks when parallelism fails:
noncollapsed coincident images are still parallel, while point collapse is the
exception. Thus q04 deliberately elicits a stronger separation distinction.
Its coincidence scenario is a failure of distinctness, not a failure of the
book's broad parallelism. The wording is clear as its own task, but **q04 alone
is not an equivalent replacement for source101's convention-sensitive task**.
This is an affected source-target alignment finding, not a recheck of q04's
passed mathematics. Whether the internal mapping/limitations acknowledges it
is deferred until the human discloses those fields.

**q07 relative to source101 and q11.** Its different-parallel-image inverse
clause explicitly excludes coincidence; it does not silently use strict
terminology as the definition of the book's forward property. It neither asks
nor answers the source101 collapse-versus-coincident-parallel distinction.
For q11's skew sources, Phase1 already proved that noncollapsed parallel images
cannot coincide, so "different" adds clarity without excluding a valid
construction outcome. q07's possibility claim about skew parallel images and
its inverse-implication clause have genuine conceptual overlap with q11.
Solving a valid q11 scheme can supply a witness relevant to those old clauses,
reducing their independent diagnostic value. The old clauses, presented only
as unkeyed alternatives, do not themselves disclose q11's correct scheme.
This is mathematical transfer, not direct extraction of a marked answer.

**q02/q03/q06.** Collapse of one projecting line, fixed images in alpha, and
images of intersecting-line unions are nearby prerequisites or special cases.
They provide no complete q10 classification or q11 conditional construction
without applying the geometry anew.

**q01/q05/q08/q09.** Their visible targets are finite-point cardinality,
length/position, noncoplanar-ray unions, and division ratios. No newly introduced
given or complete answer unit directly duplicates them. No option truth or
correct set from these unchanged items is recomputed here.

**q10/q11 together.** Understanding when a plane's image loses a dimension may
support choosing directions in beta; it does not alone exclude collapse of a
particular source line or establish distinctness of both skew-line images.
The items are not equivalent questions and neither contains a keyed solution
to the other. Their common projection principle is recorded, not mistaken
for complete independence.

## Local Status Before Option Mathematics

q10: fidelity/redundancy/leakage locally pass, restricted to source99(1).
q11: fidelity/redundancy/leakage locally pass, with the production losses above.
q04: its visible strict-distinctness target is clear, but source101 equivalence
is **not established and would need revision if asserted without qualification**.
q07: the different-image wording is explicit; it supplies no missing
source101 forward-property distinction. Its prior math stage stays reusable.

Source99(2)/(3) remain genuinely unresolved. No full-source coverage, package
pass, author-key agreement, or contract-complete review is inferred.
Proceed only to fresh option mathematics for q10/q11 in this Phase2 scope.
