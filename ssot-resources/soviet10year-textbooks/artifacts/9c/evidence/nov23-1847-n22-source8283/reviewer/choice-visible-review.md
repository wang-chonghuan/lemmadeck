# N22 visible-only choice review

STEMROBIN-184; `9c` / `ana9-c3-s2-n22`; 2026-11-23T12:18:46+0000.
Sole ROOT: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

**VISIBLE-ONLY PASS:** 3 questions, 13 options, 2 single / 1 multiple,
0 figures. Independent complete true sets: **common-tail {d},
persistent-oscillation {b,e}, unbounded-tail {c}**.
All 13 arguments checked: 4 true, 9 false, 0 unknown. No blocking visible
task-fidelity, mode or leakage defect. **U1 remains UNKNOWN.**

## Bindings

Only these two inputs were read this stage:

- Seed: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/.tmp/stemrobin-184-six/n22-nov23-source8283/choices/seed.json`
  SHA-256 `21bbcb5881fd5d2c21dce3f82a48c2672fb57caf85bfb1c2fb9be0754c8095eb`.
- Views: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n22-source8283/reviewer/choice-views.json`
  SHA-256 `f0c6b7f892f6d1f78589b90cac2adbd1b523bf3ed6a26ac0fb2ed02e275e88b4`.

Immutable [independent freeze](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184/ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n22-source8283/reviewer/choice-visible-freeze.json):
SHA-256 `05dffd48a20b1d8ed10bdfa4dcc7eb955a37f8a47c8cce7b18d35395d7aca9cf`.
It contains full per-option evidence and prior evidence references.
The views declare draft hash `8af771c3f25d1291ccb3ceef2ab5284f29b3c1674da4bb73385075761bf2b709`;
that draft was not opened and its projection binding is not yet verified.

## Per-Option Evidence

| Question / option | Truth | Independent argument check |
| --- | --- | --- |
| common-tail / a | False | Both errors are `1/n`, but `N>epsilon` is insufficient: epsilon `1/2`, `N=1`, `n=2` obey the stated cutoffs and give error equal to epsilon, not strictly less. |
| common-tail / b | False | For odd `n`, the actual `v_n` absolute error is `1/n`, not the claimed negative `(-1)^n/n`; a valid reciprocal cutoff cannot repair that false equality. |
| common-tail / c | False | The displayed bounds are valid; boundedness does not imply convergence. Frozen `(-1)^n+1` is a bounded counterexample, and a constant term alone does not determine the limit. |
| common-tail / d | True | Correct nonnegative errors `1/n`; for every epsilon choose positive integer `N>1/epsilon`; every `n>N` then satisfies the strict error bound for both sequences. |
| persistent-oscillation / a | False | Boundedness is true, but every original term has distance exactly 1 from proposed limit 1; epsilon 1 defeats every strict tail bound. |
| persistent-oscillation / b | True | For every real `a`, triangle inequality forces at least one of the two errors to be `>=1`; its parity occurs in every tail. Fixed epsilon 1 excludes every candidate, including `a=1`, where equality suffices. |
| persistent-oscillation / c | False | The two subsequences are constant, not the whole sequence. Candidate 0 has distance-2 even terms in every tail; candidate 2 has distance-2 odd terms. There are not two whole-sequence limits. |
| persistent-oscillation / d | False | Pair averages equal 1, but original terms retain error 1 from 1. Average convergence is not individual-term convergence; epsilon 1 again fails strictness. |
| persistent-oscillation / e | True | Each assumed epsilon-tail contains both parities, giving both fixed errors `<epsilon` for every epsilon; they must both vanish, forcing `a=0` and `a=2`. Thresholds may depend on epsilon. |
| unbounded-tail / a | False | Positive increment and a lower bound are true; they do not supply an upper bound or finite convergence. The frozen `2n-1` sequence itself refutes this inference. |
| unbounded-tail / b | False | The valid error proof concerns `y_n/n`, not `y_n`. For the original candidate 2 and epsilon 1, every `n>=2` has error `2n-3>=1`. |
| unbounded-tail / c | True | For every real `a` and every `N`, an integer above `max{N,(a+2)/2}` exists and gives error `>1`; this is the frozen all-candidate exclusion witness. |
| unbounded-tail / d | False | The asserted arbitrary-choice implication is false: `a=3,N=1,n=2` obeys the weakened cutoff but gives signed and absolute error 0. A better witness cannot silently repair the written argument. |

## Fidelity, Redundancy And Leakage

The stems reproduce 163a,b under explicit aliases, then 163c and 163d;
all four source tasks retain their formulas and finite-real/positive-index
domains. Seed concepts 1 and 5 match the frozen theorem/definitions.
The seed's three modern trace hashes match prior observed values; trace
files and the book index were not opened. No title resolves U1.

Nonblocking overlap is explicit: common-tail/c and oscillation/a both
misuse boundedness; oscillation/b,e prove the same parity obstruction
through different quantified arguments. Oscillation/a,d use different
faulty inferences despite the same false limit. No identical stem or
literal duplicate option was found. No visible correct markers, key,
hidden rationale or intent was exposed; target conclusions are legitimate
proof-selection instructions, not accidental key leakage.

No source/images/solving replay; lifetime images remain 2 originals once
each. No full draft, author report/intent/keys/rationales/coverage reads;
no checker/browser/model/DB/env/Git/peer calls or input edits.
Only these two reviewer snapshots were created and made read-only/`uchg`.
Wait for explicit full-draft authorization; compare later disclosure in
separate evidence without overwriting this independent freeze.
