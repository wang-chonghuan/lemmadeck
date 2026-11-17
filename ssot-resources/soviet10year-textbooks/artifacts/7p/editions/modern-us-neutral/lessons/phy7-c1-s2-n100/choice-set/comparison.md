# FIRST Independent CHOICE Review: Author Comparison

Date: 2026-11-17. Ticket: STEMROBIN-180. Batch: 52.
Scope: 7p / phy7-c1-s2-n100 only.

## Exposure Sequence and Hash Binding

1. Read skill/review/contract rules and seed.json, independently solve all
   four source exercises, and write source-first.md before any view or author
   materials. Seed canonical SHA-256:
   0f89f9e6644c5169f345c30536bbda57a9179b0529a9b94fad4a66d4cfbb64d2.
   source-first.md byte SHA-256:
   ec7d1b9d7488b10fcbfc918a2e97976878e3e3a7d377e12a202b633b3650426c.
2. Open only pure-view.json as candidate input, judge fidelity/redundancy/
   leakage before mathematics for each question, solve all 18 options,
   and write pure-view-review.md before opening author material.
   Pure-view canonical SHA-256:
   8fde72b4bf192f81d26df7303b84793dabb72dd7613e791763ab25e63d905c6e.
   pure-view-review.md byte SHA-256:
   9b2a215c1443154d0fb6461d6708f32c1b4799d2d94c3512364b75df20940556.
3. Only after those freezes, open draft.json and the author's
   source-solutions.md in this same directory for comparison.
   Draft canonical SHA-256:
   8661af467f0b8f23e0dcf8951414087b8119c9463bcab7b7224126278eb59158.
   It matches the user-specified snapshot. The four IDs, modes, stems,
   option IDs/text and empty figure lists read from draft.view match
   the exposed pure view.
   Author source-solutions.md byte SHA-256, observed after disclosure:
   3218260490d21e925c42f1a14d4131c0139228ca51abefb4e69923d33204e7a2.

All stage files are under
.intentfold/tickets/STEMROBIN-180/tmp/choices/phy7-c1-s2-n100/.
Canonical hashes use the contract's Python JSON canonicalization; Markdown
freeze hashes are hashes of bytes, not canonical JSON.
Both freezes remain unchanged after author exposure.

## Independent Sets Versus Author Keys

| Question | Frozen independent set | Author set | All options |
| --- | --- | --- | --- |
| n100-q1 | B | B | A false, B true, C false, D false |
| n100-q2 | A, C | A, C | A true, B false, C true, D false, E false |
| n100-q3 | C | C | A false, B false, C true, D false |
| n100-q4 | A, C, D | A, C, D | A true, B false, C true, D true, E false |

All four mathematics checks pass, with all 18 option truths accounted for.
The author's per-option derivations/misconceptions match the actual wrong
procedures: temperature-only internal energy, kinetic-energy-only absorption,
invented hot/cold cancellation, omission of heater losses, zero-rise/zero-heat
confusion, energy deletion, incomplete fusion, sensible preheating,
missing mass normalization and addition of a temperature denominator.
No option-math or author-key defect was found.

## Source Solutions, Intent and Coverage

Source 1: The author agrees that fixed-pressure pure-solid/liquid coexistence
holds at the melting point; absorption changes arrangement/interactions and,
under negligible work/no chemical change, increases internal energy.
Post-melting heating can raise temperature, so the stage boundary is not
generalized. The candidate retains this source's explanation task.

Source 2: The author agrees with the independent two-level accounting:
total fuel energy is not necessarily crystal absorption; container and
surroundings receive energy too, and the absorbed portion supports melting/
internal energy without raising the coexistence temperature. No numeric
efficiency or loss fraction is invented. The wording "a part" in q2-A does
not by itself assert an unsupported alternate use of the absorbed portion.
The source's total-energy task has not been silently replaced by an
absorbed-heat-only question.

Source 3: The author agrees on the unit-mass, specified-pressure,
initially-at-melting-point, complete, same-temperature solid/liquid definition.
The 1 kg convention is not arbitrary-mass total heat and does not include
sensible preheating. This is a legitimate definition-recognition task.

Source 4: The author agrees on J/kg, kcal/kg and cal/g, and the distinct
total-energy and specific-heat-capacity distractors. No value, conversion or
table reading is required. Four source coverage records correctly map 1->q1,
2->q2, 3->q3 and 4->q4. All declared losses of independent writing/unaided
listing were inspected rather than converted into an automatic BLOCK.
The declared omission of independently expanding the stage boundary does
not remove the source's stated coexistence-stage task.

There are no used source figures and no new_figures: both image review arrays
are empty, with 0 images opened and 0 reopens. No figure-229 slot is required.
No table-261 reading requirement is absent from these four source tasks.

## Candidate Finding Retained From Blind Review

Outcome: revise, not pass and not blocked.

Concrete defect: q1-B and q2-A score the same assertion that heat absorbed in
melting increases internal energy under the same approximation. Once the
learner solves either question, that result supplies the shared answer clause
in the other. q2's distinct total-fuel, container/environment and conservation
judgments remain valid; the finding concerns a duplicated response unit and
cross-question answer cue, not deletion of the entire energy-allocation task.
This was identified from the visible propositions before either key was read.
Accordingly q1.answer_leakage and q2.answer_leakage are revise, and
q2.redundancy is revise.

The author's q2 unit_reason says internal energy is included only as the final
use and no new microscopic question is split off. That explains why a second
microscopic mechanism is not asked, but it does not remove the repeated scored
internal-energy assertion. Key agreement cannot resolve this package defect.

The q3->q4 link was also inspected: a per-mass definition helps dimensional
reasoning, but does not supply J/kg, kcal/kg and cal/g as a visible answer list.
Classifying the five units still requires a meaningful distinction. That
relationship and natural definition recognition are not additional failures.
No ability-to-write limitation is treated as blanket evidence of BLOCK.

Only report this candidate defect; do not edit questions. Any author repair
needs a new snapshot-bound review while retaining the four source tasks.
The existing failed/rejected evidence must not be replaced by an approval.

## Mechanical Evidence Reuse

The original first structural run was read, not rerun:
.intentfold/tickets/STEMROBIN-180/tmp/commands/b52-phy7-c1-s2-n100-first-structural-validate.call.json.
It recorded exit 0 on 2026-11-17T04:00:06.377Z, with stdout
"mechanical checks passed; semantic review still required" and empty stderr.
That is structural evidence, not semantic approval.

The only newly authorized validation is the existing record-step.mjs wrapper
with label batch52-n100-choice-reviewed-validate and --review review.json.
It was executed exactly once and actually exited 3:
"mechanical checks passed; semantic review outcome: revise".
The record ended at 2026-11-17T04:07:47.077Z; stdout was empty and stderr
contained the 58-byte non-passing semantic result. This is not a structural
error or a failed attempt to obtain a review.
Its call/streams are retained under the exact label in tmp/commands/.
Review canonical SHA-256:
84847f349f70e240f2c192c83542bf56d6221d7ae5049fc933e0d2b38fdaa4b1.
Post-run hashes show seed, pure view, draft and both frozen Markdown files
unchanged. Full actual-command evidence is recorded in
choice-review-n100-b52.md.
No prepare, additional validator, browser, image tool, model service, database,
Git, backend, app, dependency installation or new pipeline is part of this review.
