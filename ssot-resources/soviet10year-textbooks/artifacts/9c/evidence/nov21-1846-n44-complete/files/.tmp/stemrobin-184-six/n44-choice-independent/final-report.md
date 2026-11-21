# Independent Choice Review: ana9-c4-s2-n44

Outcome: **PASS**. No definite defect or essential unresolved evidence.
Scope: five current choices, twenty options, four source exercises.

Reviewer: Curie 01a1fb94-7611-7652-beb1-5ebc67e072a3, staged
source-first/view-first/key-last reviewer, authored no candidate.

## Staged Evidence

Stage 1 independently solved all six derivative subparts and the proof before
any candidate view or key was disclosed. Stage 2 recorded fidelity, redundancy,
and leakage before adding twenty independent option checks, then froze them.
Stage 3 reused those records and disclosed author intent, source solutions,
keys, rationales, misconceptions, and coverage only after explicit release.

All six earlier artifacts retain their recorded raw hashes.
The author draft's reconstructed id/view projection is exactly 3739 bytes and
matches the frozen visible-input raw SHA-256:
`265ab48227f78682469e74c815c0d01ec0ebf05b905dc081e7b5edadc117d00d`.
The view-only file itself was not reopened in stage 3.

Seed canonical SHA-256:
`6c973ae2b14ffa33c58cc6df92f8af945368567753b2864b7ab533a86f7e42f1`.
Draft canonical SHA-256:
`fbe0d46b0c34ae68b4b35c335bfe7a40db9608d3e575364e23d6c4c9e8ecf710`.
Draft raw bytes: 11346; raw SHA-256:
`2f2292ff7eac3d2000b9b80b68d4f0376be027f22751af879efedfb91e24a404`.

## Keys and All Option Checks

The author's complete keys and all twenty truth declarations agree with the
frozen independent records. All seven correct options have valid derivations
and null misconceptions. All thirteen wrong-option recipes generate exactly
their displayed false alternatives; no wrong key was normalized.

| Question | Complete true set |
| --- | --- |
| linear-quadratic | A |
| constant-shift | A, C |
| reciprocal-term | B |
| square-root-term | A |
| difference-proof | A, B |

| Question/option | Truth | Independent check and author recipe check |
| --- | --- | --- |
| linear-quadratic A | Correct | Quotient limits give (1,2x); author's constant derivatives are zero. |
| linear-quadratic B | Incorrect | f' is 1, not 0; treating that x as constant produces the proposed 0. |
| linear-quadratic C | Incorrect | g'(0)=0, not 3; copying constant 3 produces 2x+3. |
| linear-quadratic D | Incorrect | At zero actual pair is (1,0), not (5,3); identity-operation copying gives the option. |
| constant-shift A | Correct | The quadratic and linear derivatives give 2x+1. |
| constant-shift B | Incorrect | At zero actual h'=1, not 0; dropping the linear contribution gives 2x. |
| constant-shift C | Correct | Adding 7 leaves the quotient unchanged; 2x+1+0 is valid. |
| constant-shift D | Incorrect | At zero actual u'=1, not 8; taking 7'=7 gives 2x+1+7=2x+8. |
| reciprocal-term A | Incorrect | At one actual v'=1, not 3; dropping the negative exponent coefficient gives +1/x^2. |
| reciprocal-term B | Correct | The reciprocal quotient limit is -1/x^2 and the constant contributes zero. |
| reciprocal-term C | Incorrect | At two actual v'=15/4, not 7/2; multiplying by -1 without lowering the exponent gives -1/x. |
| reciprocal-term D | Incorrect | At one actual v'=1, not 6; retaining constant 5 yields the candidate. |
| square-root-term A | Correct | Root rationalization yields 1/(2sqrt(x)); all three contributions agree. |
| square-root-term B | Incorrect | At one actual y'=3/2, not 2; copying sqrt(x) gives this candidate. |
| square-root-term C | Incorrect | At one actual y'=3/2, not 2; lowering the half-power but dropping 1/2 gives 1/sqrt(x). |
| square-root-term D | Incorrect | At one actual y'=3/2, not 7/2; dropping the reciprocal negative coefficient gives the option. |
| difference-proof A | Correct | Delta w=Delta u-Delta v; division by the same nonzero increment is valid. |
| difference-proof B | Correct | Finite derivative limits and the quotient identity justify the difference limit. |
| difference-proof C | Incorrect | u=0,v=x gives -1 rather than 1; replacing subtraction by addition yields this wrong conclusion. Author's u=v=x also gives 0 rather than 2. |
| difference-proof D | Incorrect | u=v=x gives 0 rather than 1; replacing the quotient difference by a product yields the stated wrong inference. |

Pointwise coincidence does not rescue a wrong derivative formula:
reciprocal-term C agrees at x=1 only, and the two root contributions in
square-root-term B coincide at x=1/2 only.

## Coverage and Capacity Losses

| Source | Current coverage | Explicit production loss |
| --- | --- | --- |
| 363a, 363b | linear-quadratic retains both full derivative results. | Independently writing two derivative computations. |
| 364a, 364b | constant-shift retains both functions and the all-real-x comparison. | Independently writing two quotients or derivative computations. |
| 365a, 365b | reciprocal-term and square-root-term retain all terms and domains x!=0 and x>0. | Independently deriving reciprocal and root quotients. |
| 366 | difference-proof retains increment decomposition and finite-limit subtraction for arbitrary differentiable functions. | Independently organizing and writing a complete proof. |

Each of the four question_ids lists exactly matches the questions citing that
source. All author source solutions agree with the frozen source solutions.
The split of 365 is mathematically justified by different summands and domains.
No source mathematical subtask is silently omitted.
All four omitted_tasks lists, coverage reasons, and all five intent.limitations
honestly acknowledge recognition versus independent production.

The frozen fidelity/redundancy/leakage conclusions are retained. Reused
elementary derivatives permit legitimate transfer, not a disclosed answer.
Each stem is self-contained; proof variables u and v are freshly arbitrary.
Proof-step recognition is accepted as retaining the two mathematical roles,
without claiming it demonstrates independent proof writing.

## Boundary and Handoff

Zero source or authored figures, image views, image decodes, or figure checks.
Inherited permanent 24/24, historical technical 4/8, and known 7/page unchanged.
No paid/model, database, Git, render, browser, native, publish, or descendant
operations. No original parent self_review, answer/interaction file, source
page, earlier package, packet binding, or other product lesson file was read.
The author draft and all earlier artifacts were not modified.

Procedural deviation: stage 3 read order 1 reread the generic contract at
`.agents/skills/ld-s10y-choice/references/contract.md`, outside the stage 3
release's stated read allowlist. Its raw SHA-256 matched the stage 1 instruction
snapshot:
`a9a44012fb526b24d8d0718c4e5e8966a49313c2a01548416cdd8699c2910083`.
It contained only the generic artifact contract, not candidate, author-answer,
or parent-review material. This does not change the mathematical findings,
but strict procedural acceptance is left to parent intake and is not claimed.

The review is exactly `s10y-choice-review-v1`, with independent reviewer identity
and the canonical seed/draft bindings. Local JSON/snapshot checks are not the
official validation gate; `validate.py` was not run.

Artifacts:
[review.json](/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n44-choice-independent/review.json),
[stage3-receipt.json](/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n44-choice-independent/stage3-receipt.json).

Stop for FULL parent intake, the parent's independent-review gate, and actual
close. No gate execution or publication is claimed by this review.
