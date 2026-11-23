# N10 choice Stage C internal comparison

2026-11-23. Sole cwd:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

## Result

**Pass.** Six author source solutions agree with the retained original mathematics.
All nineteen author option derivations were compared with the frozen Stage B
true sets: six correct derivations match; all thirteen stated wrong procedures
actually produce their displayed alternatives and those alternatives are false
under the real conditions. Concrete evidence is in the official review's
nineteen `option_checks`; no revise or blocked finding arose.

| Question / source | Author-internal comparison |
| --- | --- |
| `letter-line` / 74 | Complete PLANET permutation reasoning agrees; first-letter-only and independent repeated-letter procedures generate their false alternatives. |
| `two-ball-order` / 75 | Ordered no-replacement reasoning agrees; replacement and consecutive-only restrictions generate their false alternatives. |
| `full-ball-order` / 76 | Unique full-order reasoning agrees; independent adjacent comparisons and first-minimal-only reasoning generate their false alternatives. The author freeze's fourth-position conditional extension statement is also mathematically consistent. |
| `four-odd-balls` / 77 | The impossible event is preserved; replacement and including only all three available odd balls are genuinely different events yielding the stated false alternatives. |
| `book-pair-value` / 78 | Dollar values and multiplicities agree; equiprobable price categories, mixed ordered/unordered counting and replacement produce the stated false alternatives. |
| `irreducible-fraction` / 79 | Actual-value gcd reasoning agrees; parity-only and both-prime restrictions produce their false alternatives. The latter correctly includes 2 among the four actual primes; the error is requiring both entries prime, not misidentifying primality. |

The parsed draft projection `{questions: [{id, view}, ...]}` exactly equals the
frozen `choice-view-only.json`. All six author keys agree with the complete
pre-key Stage B sets. Existing visible fidelity, redundancy and leakage findings
are therefore reused, not re-solved or changed to fit author internals.

Coverage binds 74 through 79 respectively to the six rows above, exactly matching
each question's `source_numbers`. All six reference selected definition block 2.
The unit reasons preserve complete probability events rather than isolated
counts, positions or pair clicks. Each intent and coverage record concretely
declares the unmeasured independent written construction/proof process; none
silently omits a mathematical event, condition or essential distinction.
Shared permutation or pair-counting concepts do not create answer dependence.
Author source solutions, mappings, keys and rationales remain outside `view`.

Review order remains independent: original mathematics and Stage A source freeze,
then Stage B blind view/true-set freeze, then this author-internal comparison.
This reviewer is separate from the authorized seed-only choice author. No source
or visible-question solve was repeated; no source image was reopened.

## Exact snapshots

Choices base: `.tmp/stemrobin-184-six/n10-nov23-source4345/choices/`.
Review evidence base:
`ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov23-1847-n10/reviewer/`.

Official `prepare.py digest` returned:

- `seed.json`: `d5ff3a99b5a540ded47eade0b4f86bca321a733eedbb6038fead4eb8ab77635d`.
- `draft.json`: `58018c5000404bd609f496764fdc3547a6983a2a772e28cfc5b66b7f38c0471e`.

Both canonical digests are bound in `review.json`. File-byte SHA-256 values:

| File | SHA-256 |
| --- | --- |
| `seed.json` | `1b387525f90b3c09dd18b0a2b578a6e7e6d0f4937de502676d8226eaeff71d3f` |
| `draft.json` | `2a3564b9e7e809af356aa7eb53733ae98940af9536428f272cfbff67d601ed46` |
| `author-source-first.md` | `8b3deda54c614208d961b61ebac1813e617a8b76429b85fa1ddddd31310e5d4e` |
| `review.json` | `08eb987249fbcb290366490f620b4570baae2197545ad31b94ddc0425ad053ce` |
| `choice-source-first.md` | `f6c0592d021385c38150fdb0c7863cb7d7c14e7ec483bf0bf6c72949b376b534` |
| `choice-view-first.md` | `00309c2554da9dca6f3335970c415adb7f08693fa56c051b7013bb7a54f0a4d0` |
| `choice-view-only.json` | `9702aa34b360f4737712d68b27ceb752cbd9d8d6bc7b8308d28818a7d989e31d` |

Before/after byte hashes confirm that the seed, draft, author freeze and Stage A/B
artifacts above are unchanged. Other valid reviewer evidence was not edited.

## Actual checker execution

Exactly one checker invocation, from the sole cwd:

```bash
python3 -B .agents/skills/ld-s10y-choice/scripts/validate.py --repo . --seed .tmp/stemrobin-184-six/n10-nov23-source4345/choices/seed.json --draft .tmp/stemrobin-184-six/n10-nov23-source4345/choices/draft.json --review .tmp/stemrobin-184-six/n10-nov23-source4345/choices/review.json
```

Actual exit: **0**. Output:

```text
mechanical checks passed; declared semantic review: pass (not automatically proved)
```

Semantic findings are the independent evidence in the review, not an inference
from structural counts or checker success. No figures are used or registered;
both official figure-review arrays are empty. Extra image opens: **0**.
Only `choices/review.json` and this comparison note were written. No candidates,
app files, DB, `.env`, dependencies or Git were changed or accessed; no peers
were started. Stop at Stage C.
