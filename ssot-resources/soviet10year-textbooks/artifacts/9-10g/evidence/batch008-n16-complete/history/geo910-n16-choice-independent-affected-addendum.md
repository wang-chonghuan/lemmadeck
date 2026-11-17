# n16 Single Affected Review Addendum

Date: 2026-11-16. Actual draft diff verified UTC:
`2026-11-16T16:49:17.484Z`.
This is the one authorized affected review of the parent's one local repair.
No second repair was attempted by the reviewer.

## Inputs And Actual Diff

Parent repair description:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-leak-repair-addendum.md`

Parent addendum byte SHA-256:
`f1aa2973d14970f7baa55f01b9dcbd8ea6bd31e2c2d9a753226cdf8a295df431`

Exact pre-repair draft:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-before-leak-repair.json`

Pre-repair byte SHA-256:
`bf2e17c144ae4595daa1721eadf93a44af337d10f6a911c22ec5a81b1c6d54e2`

Pre-repair canonical SHA-256:
`0cc38057ebd323f66ca0c06dbd8a19a4af12ed136be801cf7b17e41c863040b8`

This is exactly the snapshot bound by the preserved first rejected review.

Current draft:
`.intentfold/tickets/STEMROBIN-184/tmp/geo910-n16-choice-draft.json`

Current byte SHA-256:
`62a26133e3dc226bb6332000a5f6d96bd9c5e1c09488086e0d969c38bf1f4592`

Current canonical SHA-256:
`938283acf2521cf8012bbcb74cd3d5cef0087fd400a04adfd0f28d6ff07ee97c`

A recursive structured comparison found exactly these three changed leaves:

1. `/questions/4/view/options/3/text`
2. `/questions/4/key/rationales/3/derivation`
3. `/questions/4/key/rationales/3/misconception`

Every other field is equal. Q4 and Q5.a/b/c are unchanged; Q5.d's ID, incorrect
truth and the full key `{b}` are unchanged. Source numbers, all intent fields,
limitations, coverage, figures, literal C1D, other keys and options are unchanged.
The current seed canonical digest remains
`56ffbd384814e6b69e01c393d9a7dbe974885be694edc04f5d9c1a3856a44916`.
There was no reseeding or source/image gate.

## Affected Mathematical Judgment

The actual new Q5.d says to draw one eligible example, observe the two rays'
same direction, and infer that every eligible triple has this property.
That is an invalid general proof: one observed instance cannot establish
`for every eligible (r,s,t), r and s have the same direction`.
No argument showing why the observed property holds independently of origins,
supports or arbitrary choices is supplied.

The theorem's conclusion is true, but the response unit judges proof validity.
An invalid inference is not rescued by a separately true conclusion. No false
geometric counterexample is invented: the error is the unsupported
instance-to-universal inference, not falsity of the theorem itself.
The parent's revised derivation and misconception describe exactly this
procedure, rather than the old premise about failed transitivity.
Q5.d therefore remains `incorrect`; the inherited complete set stays `{b}`.

## Affected Leakage Judgment

The previous explicit solved nontransitivity premise has been removed.
New Q5.d contains no nontransitivity statement, h1/h2/h3 names, origins 0/1/2,
three intersections or particular counterexample. Its generic same-direction
conclusion was already the theorem in the unchanged Q5 stem and is not a new
phrase matching Q4.a's unique explicit nontransitivity conclusion.

Consequently the definite old direct V5.d -> V4 shortcut no longer operates.
Obtaining Q4's response still requires the unchanged ray/witness reasoning.
In the reverse direction, unchanged Q4 may illustrate one instance but does
not identify a valid universal proof among Q5's candidates. New d's use of one
example remains a false proof alternative, not an exposed key or valid proof.

Q4/Q5 answer_leakage passes for the affected current snapshot. Source 166's
coverage rejection arose only from this leak, so its coverage verdict changes
to pass without re-solving the source or re-reviewing unrelated coverage.

## Explicit Evidence Reuse

The new complete review starts as an exact byte copy of
`geo910-n16-choice-independent-first-review.json`, SHA-256:
`e7c7ca044054277502e807766197a8ef51376b00f01f31242e8fcc8ffdb44a67`.
Only nine one-line leaves are updated:

- `draft_sha256` and `outcome`
- Source 166 coverage `verdict` and `evidence`
- Q4 answer_leakage `verdict` and `evidence`
- Q5 answer_leakage `verdict` and `evidence`
- Q5 mathematics option d `evidence`

All other review bytes are retained, not rewritten through JSON serialization.
This includes all 47 unaffected option-check objects; all truth labels; all six
complete true sets; all mathematics verdicts and independent_solution strings;
the entire mathematics records of Q1/Q2/Q3/Q4/Q6; Q5 mathematics except d's
evidence; all task_fidelity and redundancy records; all unrelated source
coverage and independent solutions; reviewer identity; and both empty figure
review arrays. These are reused previously passing evidence, not newly audited
mathematics or newly opened images.

Two retained historical prose references are explicitly scoped:

- The copied Q4 mathematical record's final sentence about a separate leakage
  failure describes the first rejected snapshot. The updated current leakage
  record clears that defect; retaining the mathematical bytes does not assert
  that the leak persists.
- The copied Q5 redundancy record describes d's former existential
  nontransitivity premise. That is historical wording, not a claim that new d
  still contains it. The updated affected d evidence records the current
  one-observation premise and the same existential-to-universal error category;
  the unchanged passing redundancy judgment is reused, not re-audited.

The source-first, view-only, provenance-only freezes, first REVISE, first
requirements and first validation record remain unchanged. The original
learner-only projection also remains unchanged as historical evidence; this
new review is bound to the current draft, not to that old learner-array digest.
No new whole-package source solve or image evidence is claimed.

## Disposition And Verification

Affected semantic disposition: pass. New complete review:
`geo910-n16-choice-independent-repaired-review.json`.

The official validator runs exactly once on the current seed/draft and this
new snapshot-bound review. Its exact command, output, exit status and hashes are
recorded in `geo910-n16-choice-independent-repaired-validation.md`.
If that run fails, disposition is affected HOLD; do not attempt a second
repair or validator invocation.

No browser, image open, database, environment, app, dependency, model service,
Git or publisher operation occurred. Only this reviewer's own n16 review
outputs were written; no draft, seed or another worker's file was modified.
