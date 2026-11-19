# n40 Affected Table METHOD/ANSWER Review

**PASS: all eight affected routes. Zero actionable discrepancies.**

Approve only 829-1, 829-2, 830-a through 830-d, and 831-a/b in the candidate bound by the verified SHA-256. Their missing table method/answer stages are now PASS. Reuse the existing 59 non-table PASS tasks without re-review. The earlier source-cell approval remains unchanged.

## Binding And Independence

Exact checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`. OFFLINE; all new files are under `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n40-table-cell-review`.

Independent stages were frozen at `2026-11-19T04:13:49.348Z`, before the new candidate/binding/override disclosure at `2026-11-19T04:14:05.353Z`. Calculations use exact rational arithmetic on the reviewer’s own frozen cells; no direct square-root function, new images, crops, reopens or renders.

- Actual exercise authority: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n40/exercises.json`; SHA-256 `7dff757538b97cf3af354046d545838bdf150113a13ec2b32e2c4f7cf38ffd8d`.
- Candidate: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n40-answer-author/answer-keys.table-frozen.json`; SHA-256 `6d37ba2c5bf235afd560a80c44e359f44bbd268bf56703c30cd3d20a2a288451`.
- Binding: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n40-answer-author/table-candidate-binding.json`; SHA-256 `e9a64ed5b5106f856447308a17833dbfa2c9e56efd66b63ee5ea7de9e86df6ab`.
- FIRST overrides: `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n40-answer-author/table-overrides-FIRST.json`; SHA-256 `e3119f20062b085c38e9aba7cef7abe7ce905ec41e767e1d7afc02cc59df7174`.
- Independent solve: `method-independent-solve.json`; SHA-256 `89c31571f229eef9132f9f6e61a94e441f83f0200a03ad24b2d822576beaf462`.
- Independent freeze: `method-independent-freeze.json`; SHA-256 `e1f44460ae81254f5b6417004dbcbebd6fd0abe874d5bb2555053c86c8b6f7b4`.

## Eight Route Verdicts

| Route | Independent Table Stage | Final Display | Figures | Verdict |
| --- | --- | --- | --- | --- |
| 829-1 | 0.3333=33.33×10^-2; T(33.33)=5.771+0.003=5.774; root 0.5774; ×6 gives 3.4644 | 3.464 | 4 | PASS |
| 829-2 | Exact rewrite 6√(1/3)=√12; T(12)=3.464 | 3.464 | 4 | PASS |
| 830-a | Exact rewrite 4√5=√80; T(80)=8.944 | 8.944 | 4 | PASS |
| 830-b | Exact rewrite 15√2=√450=10√4.5; T(4.5)=2.121 | 21.21 | 4 | PASS |
| 830-c | Exact rewrite 14√(1/7)=√28; T(28)=5.292 | 5.292 | 4 | PASS |
| 830-d | Exact rewrite 12√(5/6)=√120=10√1.2; T(1.2)=1.095 | 10.95 | 4 | PASS |
| 831-a | Approximate-input quotient model 625/157; guard 3.981; T=1.995+0×0.001=1.995 | 2.00 cm | 3 | PASS |
| 831-b | Approximate-input quotient model 412/157; guard 2.624; T=1.619+1×0.001=1.620 | 1.62 cm | 3 | PASS |

`T` is this selected Table IV lower-main-plus-ready-correction procedure. The equalities between table decimals describe exact arithmetic on approximate table values, never equality to exact roots.

## Methods And Precision

- 829 never identifies 0.3333 with 1/3: their difference is 1/30000. Normalization of the terminating decimal 0.3333 is exact; using it in place of 1/3 is approximate. The candidate expressly separates the table product 3.4644 from the exact expression.
- The exact absorbed-positive-factor rewrites precede lookup. For 450 and 120, even-power normalization is respectively 4.5×10^2 and 1.2×10^2; root scaling is exactly ×10, with no loss of the table’s four significant figures.
- At row 33, the main argument step is 0.1 and the correction-argument unit is 0.01: correction column 3 represents argument increment 0.03. Below 10, correction-argument units are 0.001. In both regimes, correction integers change the root in units 0.001. The candidate has the correct root correction 0.003, not 0.03.
- 831 uses the prescribed approximate S/pi models: 12.5/3.14=625/157 and 8.24/3.14=412/157 within that computational model, not exact physical data. The quotients round to the directly authorized four-significant guard arguments 3.981 and 2.624. Each given approximate datum has three significant figures; retain the fourth reserve digit through lookup and round the final radius to three.
- Half-up is an explicit final calculation/display convention, not a Bradis or textbook tie policy. Exact rational rounding confirms the real table-intermediate tie 1.995 goes to 2.00; its trailing zeros are necessary for three significant figures. The other seven final rounding cases are not ties. The candidate labels this convention explicitly in 831 and does not assert a sourced tie rule.
- The source supports four-significant Table IV values and even-power scaling. Four-significant final 829/830 output is the explicitly selected scoped convention; the allowed general rules do not create a universal post-product or four-significant argument rule. General G3-G7 precision/reserve context remains labeled secondary-only; G8/G9 are conditional context.
- No physical true-value, measurement-error interval, last-digit guarantee, or historical-edition equivalence is claimed. Guard digits do not create additional accuracy in the given approximate measurements; corrected roots do not inherit the direct-main-entry half-unit guarantee.

## Reuse And Preservation

The original `n40-answer-review/stage2-review.json` remains hash-bound at `aa17fce80e49b9c4422441eae2a4a8c2a43e1b8bcafeb37d9dc160f916d78ae2`, and its .md remains at `ae182e54ef0db8577b6a0c7bc1b0ee52c9bd322b86377a8873cc30464c14f1c0`.

55 tasks in 11 unaffected whole exercises are preserved by unchanged-entry hashes against the bound original snapshot, not re-solved. The existing four PASS statements within 829/831 retain their already-reviewed preference, nonnegative inverse and two area-scale conclusions. Thus 59 non-table PASS tasks are reused; together with these eight newly approved table routes, answer-task coverage is 67/67.

The new source facts support the existing method-2 preference: both methods require one root lookup, but method 2 reads a single main entry without correction, prior decimal approximation to 1/3 or post-lookup multiplication. This is not a second review of the passed comparison task.

The existing SOURCE_CELLS_APPROVED receipt remains unchanged, SHA-256 `a6b08652794c55f6358bc4fba1c31283d24825aacd1b71ee09ea16356366277b`. All files bound by that receipt and the original solve freeze remain byte-identical. The prior reports are historical immutable evidence, not rewritten to erase their former missing-stage state.

## Findings And Stop

No repair is prescribed. Precise candidate approval is limited to the eight routes and declared conventions above. All unaffected PASS results and the source-cell approval remain usable.

No physical true-radius or last-digit guarantee; no historical equivalence claim or new human gate. This is an affected method/answer report, not a finalizer, render, app/prose review, publication or any unperformed product criterion.

No author edits, finalizer, database, app, publish, network or commit actions. No author table-derivation arithmetic is used. Detailed per-route comparison is in `method-review.json`; exact new-file hashes and input bindings are in `method-review-receipt.json`. Stop.
