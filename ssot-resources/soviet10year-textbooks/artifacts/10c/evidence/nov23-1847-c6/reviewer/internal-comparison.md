# Final Internal Comparison

STEMROBIN-184 / `10c` / `ana10-c6-ex`, sole root
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

**Outcome: revise. No semantic approval. No candidate edits.**

Disclosed draft canonical SHA-256:
`9970fb0f5e16f21722e747eeb20f5085f854deed3d615f0886a6001d21be9640`.
Actual file-byte SHA-256:
`14627b30781aaa8843513c96eb406699c8fef9276fc5c8176c99556d0d09ed04`.
Its view projection is exactly the accepted Stage B snapshot, canonical
`765bf6d6e96d05b455c04575505897b1d6ec85de2f4b8c010f84f77fd370e536`.
Its seed binding remains
`975572b776f0d768d41ad48d2bc5f45c2c1ce80f6c6fa727171d7e39107fe5a8`.

## Findings and Requirements

1. **Preserved Stage B defect: c6-370, c6-372, c6-373.** Only one option in
   each claims the supplied equality's requested verification conclusion.
   Matching that conclusion uniquely identifies the correct alternative without
   judging the inverse values, range or proof inference. The author's assertions
   that the unit checks a derivation do not remove this visible shortcut.
   Declaring loss of independent proof writing also does not waive loss of
   proof judgment. Revise only these affected views to make the decisive
   inference necessary and obtain affected review of the changed snapshot.
   Their current true sets remain unchanged.

2. **Missing explicit capacity losses: c6-346b, c6-352, c6-356, c6-381,
   c6-387.** In 346b every option supplies correct amplitude and period, but
   the sole limitation names only a phase convention. In 352 the phase-ratio
   delta is supplied. In 356 both delta and the common correct amplitude are
   supplied. In 381 displayed rational formulas replace independent derivation,
   and several alternatives can be rejected by attached numeric values. In 387
   theta supplies the normalized principal-angle parameter. The latter four
   intent and coverage loss lists are empty.
   Name each actual loss in the affected `intent.limitations` and corresponding
   `coverage.omitted_tasks`; make `coverage.reason` consistent. These are
   documentation/claim defects, not blanket rejection of recognition or of the
   substantive mathematical distinctions that remain.

3. **Misconception does not generate c6-389/a.** This alternative is
   `(cos4alpha-cos2beta)/2`. The author calls it application of the sine-sine
   difference-of-cosines formula to a cosine-cosine product. But for the original
   `A=2alpha-beta`, `B=2alpha+beta`, that formula gives
   `(cos2beta-cos4alpha)/2`, the reverse expression. The option's false truth
   label and its counterexample at alpha=beta=0 are correct; the named wrong
   procedure is not a valid derivation of the displayed distractor.
   Correct `key.rationales[a].misconception` so the stated mistake actually
   generates that option, or explicitly change the affected view and review it.
   Do not change the independent true set or claim the current procedure passes.

## Complete Comparison

All 57 source coverage relationships match their actual question references.
The only split sources are 346,347,378, each into its independent a/b conditions.
No source is unmapped.

All 60 author `intent.source_solution` claims are mathematically consistent
with the unchanged source freeze. All 60 keys and all 215 author truth labels
agree with the unchanged Stage B sets/checks. No key or truth label was
normalized to author internals.

All 215 rationale/procedure records were read and compared. The detailed
option-level evidence is in `internal-comparison.json`: 214 pass, one revise
at 389/a. Wrong distractors were checked for actual generation by the named
mistaken procedure, not merely for falsehood. Conditions, signs, quadrants,
periods and excluded/extra/missing roots were included.

The official `review.json` reuses the frozen independent source solutions,
independent visible solutions, true sets and all 215 truth judgments. It appends
the internal-comparison evidence and preserves the three leakage revisions.
Its source coverage results are 49 pass and 8 revise:
346,352,356,370,372,373,381,387. No scientific HOLD remains.
Eight question fidelity checks revise, three leakage checks revise, and the
389 mathematics check revises for the failed distractor procedure. Other
mathematical truth sets remain determinate and unchanged.

## Settled Notes

- **350:** The specific exercise is global differential-equation verification.
  Author source text explicitly places it under a shared derivative/graph
  heading and calls graph facts ancillary, matching the freeze's conservative
  ancillary treatment. Both derivatives and the global comparison are complete.
  Loss of independent written verification is declared. No additional graph
  task or HOLD is invented.
- **348/349:** Both derivatives AND full graph investigations are covered:
  monotonicity, curvature, extrema, zeros/inflections, intercept, complete
  reflection axes, parity, central symmetry and period landmarks. Drawing and
  discovery of the supplied translated coordinate are explicitly declared lost.
  These graph-recognition units pass source coverage.
- **381:** All three specifically requested rational formulas AND values are
  actually present and correct, including the negative t branch and denominator
  conditions. The missing limitation is formula production, not missing formulas.
- **346/347:** The positive-amplitude/positive-frequency sine convention is
  explicit and mathematically consistent. Equivalent cosine phases are not
  errors. 346b's undeclared common amplitude/period loss is a separate issue.
- The accepted multiple-option position regularity remains advisory; no new
  leakage gate or blanket recognition failure is added.

## Operation Boundary

The seed was not reread. Source/visible mathematics were not re-solved or
re-reviewed. Frozen records were reused only to compare disclosed claims and
compose the official schema; their bytes are unchanged. No additional author
source-solving file was needed because every claim was present in the draft.
No old answers, interactions, historical math or display history was read.

No validator, render, finalizer, candidate repair, canonical replacement or
changed-candidate approval was performed. Images: 0. No DB, environment secrets,
app, dependencies, network, keyboard, Git, agents or peer messages were used.
The requested bounded operation/cost ledger is `operations-cost.json`.
Model, hidden cost, elapsed runtime and monetary total are UNKNOWN; auxiliary
paid calls are zero.

Return the non-passing review. Repair and any affected subsequent review require
caller authorization; unchanged source/view work is not to be rerun for packaging.
