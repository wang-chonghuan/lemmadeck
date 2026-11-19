# n38 Stage2: Fidelity, Coverage And Leakage FIRST

Date: 2026-11-19. Ticket: STEMROBIN-182.
Reviewer: fresh independent CHOICE reviewer n38.
Checkout: /Users/yong/.codex/worktrees/d9b1/lemmadeck.
Scope: authorized Stage2 view-only, no canonical keys.
Write ownership: this n38-choice-review directory only.

## Order And Binding

This file is frozen BEFORE the separate every-option truth assessment.
No complete true sets, author key, intent, solution, coverage or rationale was
consulted in preparing it. Source Stage1 is reused, not solved again.
No image was opened; all13 views and all55 options have empty figure_ids.

Only author file read:
`.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n38-choice-author/views.json`.
Its byte SHA-256:
`301520f0972263e8482557407567782391bd37ade7d913e5d84d9ac3eb59b3be`.
This JSON is13 entries containing only question_id and view.
The sibling views.md was not needed or read.

Frozen Stage1 source-solves SHA-256:
`1642034ff8a92968da4916d691e8d6f5adaa71f26e9637bc1a15074176532452`.
Frozen Stage1 provenance SHA-256:
`c4432e5e2897e50ef643387063dd07b34733cd08f5ef3c762fdcd06a4da9caa8`.
Original seed identity is reused from that evidence; its author-side file was
not reopened in Stage2. Stage2 supplements are NOT additions to the source seed.

## Finding: Cross-Question Leakage REVISE

F-L1, affected `n38-squared-estimate-report` and
`n38-estimate-error-distinction`:

The six-value report asks the learner to calculate the square report for812,
one of six original804 tasks. The later error-model stem explicitly supplies
that report, `6.59*10^5`, before asking any question about its error. Its options
also repeatedly expose659000. This is the requested804d output, not merely an
uncomputed common input or a shared main cell.

The six-value report's first alternative uses `6.593*10^5` at this position,
whereas three other alternatives use `6.59*10^5`. Reading the error-model
stem therefore supplies one original task's result and discriminates the
report alternatives without that task's significant-figure calculation.
It does not settle all six tasks or the complete question, but that narrower
leakage is still real and must not be weakened to "no leakage".

Minimal repair: keep the independent uncertainty judgment but avoid printing
another question's requested report, for example by using a distinct, explicitly
supplemental approximate datum outside the six-source report. Update the
affected model and assertions together. Do not edit unrelated questions or
claim the original812 input came with this new error model.

## Per-Question Assessment

Fidelity and mathematical truth are different checks. A fidelity pass here does
not authenticate new reference cells or imply correct options.

| Question | Source Tasks Mapped Independently From Visible Stem | Fidelity | Redundancy | Leakage | Concrete Evidence |
| --- | --- | --- | --- | --- | --- |
| n38-direct-tenths | 799.a1-a7 | pass | pass | pass | Seven original bases and order preserved; row/column lookup remains, with a simultaneous squared-factor judgment that prevents pure transcription from being the whole response. |
| n38-direct-hundredths | 799.b1-b6 | pass | pass | pass | Six original bases and order preserved; the added half-last-place bound asks for precision judgment beyond selecting six main cells. |
| n38-correction-blocks | 799.c1-c6 | pass | pass | pass | Both three-result groups preserve all six bases; units and the above5 next-entry SUBTRACT route are explicitly stated; complete group recognition still requires corrections, not copied main cells. |
| n38-scale-family-five | 800.a1-a4 | pass | pass | pass | Four original bases preserved; one common normalized coefficient plus four distinct squared-scale exponents is a substantive shared response unit. |
| n38-scale-family-one | 800.b1-b4 | pass | pass | pass | Original order and four scales retained; the thousandth correction unit differs meaningfully from the preceding family's hundredth unit. |
| n38-direct-scaled-values | 801.a-d | pass | pass | pass | Four original expressions preserved; displayed raw main cells must be normalized and rescaled, not copied as the final output. |
| n38-corrected-scaled-values | 801.e-h | pass | pass | pass | Four original expressions preserved; view explicitly requires table correction rather than direct exact-square rounding, including high-digit next-main subtraction. |
| n38-round-before-square | 802.a-d | pass | pass | pass | Both required rounded bases and their squares are the response unit; visible positive half-up tie rule is consistent with the original explicit preprocessing task; new mathematical cells are labelled non-transcriptions. |
| n38-square-arithmetic | 803.a-b | pass | pass | pass | Exact originals and plus/minus preserved; view expressly requests exact values without intermediate rounding, resolving Stage1's contextual staging gap without pretending table-rounded numbers are exact. |
| n38-squared-estimate-report | 804.a-f | pass | pass | REVISE | All six approximate inputs and digit counts retained; visibly authored exact-square-then-single-final-round convention preserves approximate reporting and separates single/double rounding; later error-model stem leaks804d. |
| n38-estimate-error-distinction | supplemental804.d model; no new original task | pass | pass | REVISE | It explicitly adds a positive half-up nearest-integer model, rather than inferring a guaranteed interval from significant digits; interval/universal-error reasoning differs from reporting precision, but its supplied report leaks another unit. |
| n38-system-sum | 805.a | pass | pass | pass | Both equations, denominators, ordered variables and simultaneous satisfaction retained; recognizing a complete solution pair can require both equations, not independent coordinate clicks. |
| n38-system-difference | 805.b | pass | pass | pass | Both original equations and ordered pair retained; distinct from the other system rather than a duplicate of its work. |

## Provenance And Context Labels

- New mathematical-reference tables: direct-tenths, direct-hundredths and
  direct-scaled-values say they are supplemental mathematical references
  with four-significant rounded-square relationships. They do NOT claim unseen
  historical main cells were transcribed. Every new visible cell, including
  unused distractor columns, remains due for independent Stage2 mathematics.
- Bradis excerpts: correction-blocks, both scale families and corrected-scaled
  values call their tables III excerpts. All their supplied addresses/strings
  are within Stage1's captured printed-cell inventory, including the unused
  high-digit correction alternatives. That classification is preserved;
  corrected values need not equal rounded exact squares.
- Round-before-square: expressly labels its main and linear-correction cells
  newly mathematical, NOT transcriptions of unseen original cells. Those new
  context cells can be judged as mathematics. Their historical counterparts
  remain missing source facts; labels do not fill original evidence.
- The row3.1 main table in round-before-square spans values below and above10,
  while its correction table supplies one row3.1 integer. Stage1 already
  records the physical-line/unit split. The mathematical phase must check the
  range of the new correction rule; fidelity passage for the four requested
  bases does not waive consistency of unused visible context.
- 803: exact evaluation is explicitly requested in the visible stem. The
  original803 wording was "calculate", not an express table lookup. Its
  contextual missing historical correction C(3.2,5) is not required for this
  newly explicit exact task, and stays historically unavailable.
- 804 report: new positive half-up, no-intermediate-rounding, one-final-round
  convention is visibly declared, not retroactively labelled a captured Bradis
  instruction. It still reports the given approximation's square rather than
  declaring that unknown true x equals its approximation.
- 804 error model: visibly introduced as additional, scoped to812 and positive
  nearest-integer rounding. It must not be generalized as an original error
  premise for the other approximate inputs.

## Package Coverage And Capacity

Independent mapping gives49 distinct originals, with no silent prompt omission:
799=7+6+6=19;800=4+4=8;801=4+4=8;802=4;803=2;804=6;805=2.
The supplemental error-model question adds an uncertainty distinction, not a
fiftieth original source task. No author coverage field was read.

The18 fully captured correction occurrences from Stage1 remain represented:
six in correction-blocks, eight across the scale families, and four in
corrected-scaled-values. Four new802 context corrections retain the prescribed
input rounding, unit choice and the high-digit next-main subtraction for1.006.
The exact803 view does not owe a table correction as an extra original task.

Complete-record recognition cannot establish that the learner independently
wrote every intermediate step. It can nevertheless require the source's
relations and the skill does not automatically fail complete-table recognition,
solution-pair substitution or reasonable elimination. Source numbers and
internal mapping are absent from the learner-facing stems.

Shared uncomputed main cells are not automatically leaked answers:
the2.34 square main value appears both as a direct lookup and as a correction
base for23.41, but the latter still needs its fourth-digit correction and scale.
The6.17 main value similarly appears in more than one table, but61.7 needs a
squared-scale transformation. No entire correction or scaling result vector,
exact803 pair or805 solution pair is given by a different stem.
These differ from the explicit final804d report in the error-model stem.

## Frozen Fidelity Outcome

Outcome: REVISE for genuine F-L1 cross-question answer leakage.
No every-option truths or complete true sets are recorded in this first file.
The subsequent mathematical phase may identify further independent defects.
No canonical author key, draft, solve, intent, coverage, supplementary-context
or author notes read; no source re-solve; no images; no DB/app/paid/network,
promotion, finalizer, commit or writes outside this owned directory.
