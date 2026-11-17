# STEMROBIN-184 / SessionB / 10c n103 / Affected Internal Review

Status: FROZEN; repaired semantic outcome `pass`; one with-review validator exit `0`; WAIT.
Date: 2026-11-17 (Europe/Dublin).
Scope: four changed q01/q02 rationale/misconception pairs, exact unchanged-content assertions, and changed package relationships only.
No additional repair or global substantive review was performed.

## Additive Provenance Correction

This section explicitly supersedes inaccurate authorization wording in earlier frozen records, especially `ledger-affected-view.md` and its descriptions of a "human user" supplying authorization or mechanical findings.

All incoming task, disclosure, reuse, consumption, and run instructions in this delegated workflow came from the **parent agent**, described as acting under the existing human-authorized scope. They were not direct messages from the human to SessionB.

Therefore:

- Prior statements that a "human user" directly authorized these disclosures or directly supplied the unchanged-view finding are inaccurate. Correct attribution is parent-agent scoped disclosure/instruction.
- Assertions that complete records were consumed before disclosure are parent-reported consumption statements, not new human observations independently verified here.
- An author/parent-agent transport statement of approval is not direct human approval evidence.
- No new human approval fact is established by the parent messages, this review, or the successful validator.
- The technical reviewer outcome `pass` is an offline semantic judgment for the exact repaired snapshot, not human approval for publishing, production integration, or broader work.

This correction is additive. Every earlier frozen record remains byte-preserved; no provenance wording or failed verdict in those records was retrospectively rewritten. Mathematical independence, disclosure ordering, and exact snapshot bindings remain supported by their frozen evidence, with message origin corrected as above.

## Exact Internal Disclosure and View Binding

Sole newly disclosed mathematical artifact:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-repair/draft.json`

| Binding | SHA-256 |
| --- | --- |
| Repaired draft raw bytes, supplied/computed | `99c86c2632881662d62d013f0d46ac668ea344605c2dd9c1e64f9c252d0fb836` |
| Repaired draft canonical JSON, supplied/computed | `ce35f566b5bf75b3a5cad497d3aa54e236f7f621c9d94098a0f28bcf79ff731e` |
| Repaired draft's computed view projection canonical | `1ae65291bbb1ca133608fdaba9e5a5e3db14ce9f9702843fae5bda4770c9a362` |
| Frozen repaired view canonical | `1ae65291bbb1ca133608fdaba9e5a5e3db14ce9f9702843fae5bda4770c9a362` |
| Repaired view raw bytes | `f9a83d4b0a8ba3a2e0c9247f887cd87eb0ef2acf11261fda8b74f07d1d4e1a34` |
| Seed canonical, unchanged binding | `02950a8ca7ca60681040fff0150972ef34adfb328918bdaeeedd9911934640cf` |
| Frozen affected view report bytes | `ef9186ed9f9f646c42742882f28a78ea979aaa0744743290d1b84e75ca0230c6` |
| Frozen affected view ledger bytes | `f46e9f4877da389196b6ae245a771c5e235c131a9cf22035fde0fcf77c44edf7` |
| Exact original draft canonical | `a7149030c0401f0f187092b2182ef1d0c1e6d6ed4e5752b4d1b89aa2c5febffb` |
| Exact original draft raw bytes | `6bcd7db62f42c47fff24ea3cbc7e558a53a5da60ed2855545936720050301058` |
| Original failed review raw bytes | `cc16389c615e4a1f32435cdce99d8e5bc280fe5c751501995ee303a752073677` |

The repaired draft's raw/canonical bindings and its view projection matched before comparison. The latter binds these internals to the entire affected view report that the parent reported consuming and freezing before disclosure.

The previously disclosed exact original draft and original failed review were read only for the explicitly requested deep-equality and review-reuse assertions. No source lesson, standard answer, author report/ledger, verify file, parent projection, or other candidate artifact was read.

## Exact Unchanged-Content Assertions

Structured deep equality, rather than visual impressions or ad hoc string comparison, established:

| Requested comparison | Result |
| --- | --- |
| q03 entire question, including view/intent/key/rationales | Deep unchanged |
| q04 entire question, including view/intent/key/rationales | Deep unchanged |
| All four stems | Deep unchanged |
| All four complete intent objects | Deep unchanged |
| All four limitations lists | Deep unchanged |
| Whole coverage array | Deep unchanged |
| All four `key.correct` sets | Deep unchanged |
| q03/q04 entire key objects | Deep unchanged |
| q01/q02 entire key objects | **Not** unchanged: their disclosed rationales changed |
| Whole draft excluding only affected options/rationales | Deep unchanged |

The distinction between correct sets and complete key objects is necessary. It would be false to claim q01/q02 entire `key` objects are unchanged when their rationale/misconception fields were repaired.

Only these internal rationale entries changed:

```text
q01: A, B, D
q02: C
q03: none
q04: none
```

Each of the four changed entries has changes to its derivation and misconception, not to its incorrect truth classification. q01 C and q02 A/B/D rationales are unchanged. Together with unchanged q03/q04, fourteen rationale entries are reused, not freshly re-reviewed.

The draft equality assertion removed only q01/q02 `view.options` and `key.rationales` before comparison. Equality of the remaining entire drafts proves no covert stem, intent, mapping, limitation, coverage, figure, schema, or correct-set change.

These scoped equality assertions are requested reuse evidence, not a structural-validator rerun or a new mathematical solve.

## Four Changed Rationale/Misconception Comparisons

The complete affected true sets `{C}` and `{B}`, all eight affected options, and all twenty component entries were already independently solved and frozen before this repaired internal disclosure. The comparisons below do not replace that source-first/view-first evidence with author reasoning.

### q01 A

Frozen repaired truth: correct rise, wrong apex velocity, wrong ground time; whole tuple false.

The changed derivation first computes the correct rise at `t_peak=v0/9.8`, giving `H=v0^2/19.6`.

Its first mistaken operation uses return-to-launch-height time `2v0/9.8` instead of peak time. Substituting into `v_y=v0-9.8t` gives exactly `-v0`, the displayed false apex component.

Its second mistaken operation selects the nonpositive ground root

```text
(v0-sqrt(v0^2+19.6h0))/9.8
```

and takes its absolute value, giving exactly the displayed

```text
T_bad=(sqrt(v0^2+19.6h0)-v0)/9.8.
```

The independently required descending root is larger by `2v0/9.8>0`. At `h0=0`, the wrong time is launch zero; at `h0>0`, the frozen substitution gave height `2v0*T_bad>0`, not ground.

The misconception explicitly names both operations. It reproduces both wrong components and preserves the correct height, rather than merely attaching a broad label to an incorrect tuple.

Comparison: **pass**.

### q01 B

Frozen repaired truth: doubled rise, correct zero apex component, wrong ground time; whole tuple false.

The changed derivation uses initial velocity as constant over the correctly found ascent duration:

```text
H_wrong=v0*(v0/9.8)=v0^2/9.8,
```

exactly twice the independently integrated rise. This is a concrete rectangle-versus-declining-velocity error for allowed `v0>0`.

The second operation takes the magnitude of the nonpositive quadratic root, reproducing the same displayed `T_bad` and the same false landing event as in A. Its apex component zero remains correct.

The compound misconception explicitly accounts for both false fields and yields exactly the repaired tuple.

Comparison: **pass**.

### q01 D

Frozen repaired truth: doubled rise, wrong `-v0` at the peak, correct plus-root landing time; whole tuple false.

The derivation's first error again uses constant initial velocity over `t_peak`, giving exactly `v0^2/9.8`. Its second error puts the return-to-launch velocity `-v0` at the peak. Both are strictly false under the view's `v0>0` condition.

The plus-root ground time is correctly retained. The named compound misconception reproduces both wrong fields without falsely rejecting its correct time.

Comparison: **pass**.

### q02 C

Frozen repaired truth: wrong distance and wrong acceleration; whole pair false.

The first mistaken operation keeps the first antiderivative term correct but omits division by the new exponent in the quadratic term:

```text
4.9*25-0.003*125
  =122.5-0.375
  =122.125
  =977/8.
```

This is exactly the displayed distance and is `1/4` below the independently frozen integral `979/8`.

The second operation evaluates velocity itself at the endpoint instead of differentiating:

```text
v(5)=9.8*5-0.003*25=48.925=1957/40.
```

This produces exactly the displayed false acceleration entry; the true derivative is `977/100=9.77`.

The misconception explicitly lists both missing-division and missing-derivative operations. It reproduces the full changed pair, not the original C option that no longer appears.

Comparison: **pass**.

## Retained True Sets and Reuse

| Question | Frozen independent set | Disclosed repaired set | Basis |
| --- | --- | --- | --- |
| q01 | `{C}` | `{C}` | Frozen affected view plus changed internal comparisons |
| q02 | `{B}` | `{B}` | Frozen affected view plus changed internal comparison |
| q03 | `{A,D,E}` | `{A,D,E}` | Exact entire-question equality; passing substantive records reused |
| q04 | `{D}` | `{D}` | Exact entire-question equality; passing substantive records and recognition qualification reused |

No new source solve or q03/q04 substantive option review occurred.

All four `source_reviews` and both q03/q04 `question_reviews` in the new review are deep equal to their counterparts in the original failed review. A separate structured assertion verified this after authoring the new review.

The reused source coverage evidence includes historical sentences about q01/q02's original leakage failures. Those sentences and q04's historical contrast refer to the preserved original snapshot; they are not a new assertion that the repaired balanced view still has the old cue. The current repaired q01/q02 answer-leakage checks and this report provide the necessary new-snapshot evidence. Exact reuse does not erase the original failure.

Only q01/q02 question checks, the new draft binding, and the aggregate outcome were changed in the new review. Reviewer identity, seed binding, source reviews, figure fields, and q03/q04 question reviews were retained.

## Changed Package Relationships

The frozen affected view report established balanced component frequencies:

- q01: each height, apex component, and time value occurs twice; every two-component combination occurs once.
- q02: each distance/acceleration value occurs twice; every pair in the complete Cartesian product occurs once.

Thus the two original unique-modal-component routes are actually removed. The changed internal rationales do not appear in learner-facing views and do not create a new visible key or cross-question input.

Exact unchanged stems, intent, coverage, and q03/q04 entire questions support reusing their prior dependence/qualification evidence. The option changes do not make any answer in another question a necessary input.

Mathematical partial elimination in q01 and q04's retained table-recognition limitation remain acknowledged. No criterion was weakened, and correct mathematics alone was not used to excuse the original leakage.

Changed-package check: **pass**. No additional defect was established within this bounded repair.

## New Review and Counts

New artifact:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/review-repaired.json`

| Binding/count | Value |
| --- | --- |
| Schema | `s10y-choice-review-v1` |
| Seed canonical binding | `02950a8ca7ca60681040fff0150972ef34adfb328918bdaeeedd9911934640cf` |
| Repaired draft canonical binding | `ce35f566b5bf75b3a5cad497d3aa54e236f7f621c9d94098a0f28bcf79ff731e` |
| Review canonical SHA-256 | `cd72aa87b662352c456ea691bb75979c7868408a6fcc00f1260b7bbb4e57e074` |
| Review raw-byte SHA-256 | `7d234b8c2098355adc41e7d9ac24f035df865a458fb2fb4093dc6d2e818e4c2b` |
| Source reviews | 4, exactly reused |
| q03/q04 question reviews | 2, exactly reused |
| q01/q02 question reviews | 2, affected checks replaced from frozen repaired view/internal evidence |
| Verdict-bearing checks | 20 pass, 0 revise, 0 blocked |
| Option records | 18: 6 correct, 12 incorrect |
| Fresh changed internal comparisons | 4 incorrect rationale/misconception pairs |
| Unchanged rationale entries reused | 14 |
| Source/new figures | ZERO |
| Aggregate semantic outcome | `pass` for this exact repaired snapshot |

This is not an eighteen-option fresh internal re-review. Eight affected options were freshly solved in the preceding frozen view-only phase; ten options are substantively reused. Only four changed internal pairs were newly compared now.

The original `review.json` retains outcome `revise` at its original hash.

## One Authorized With-Review Validator Run

Exactly one invocation was made for the repaired snapshot, always with the new review:

```sh
node /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-run-once.mjs /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/first-validate-repaired-review python3 /Users/yong/.codex/worktrees/a07e/lemmadeck/.agents/skills/ld-s10y-choice/scripts/validate.py --repo /Users/yong/.codex/worktrees/a07e/lemmadeck --seed /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103/seed.json --draft /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-repair/draft.json --review /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/review-repaired.json
```

Working directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

The generated execution record reports:

```text
started:  2026-11-17T03:56:03.957Z
finished: 2026-11-17T03:56:03.993Z
exitCode: 0
signal:   null
error:    null
stdout:   mechanical checks passed; declared semantic review: pass (not automatically proved)
stderr:   empty
```

| Execution file | Raw-byte SHA-256 |
| --- | --- |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/first-validate-repaired-review/command.json` | `4788e4791b7c7a6d43c39400e26330d1388a619da1b54b579db032cb084acb74` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/first-validate-repaired-review/stdout.txt` | `4d6e19d8819a643ffffe3767f827ec9c4ef89649dc6c78b83a0d8d8e789adc09` |
| `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-choice10c103-review/first-validate-repaired-review/stderr.txt` | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

The validator confirms mechanical/schema consistency and the declared pass, not automatic mathematical proof or new human approval. Independent reasoning and scoped reuse remain the semantic basis.

No no-review structural rerun, retry, test, browser, image operation, source reread for new reasoning, or additional repair occurred.

## Preservation and Freeze

Post-run raw hashes of the original failed review, frozen affected view report/ledger, original draft, repaired draft, and repaired view matched their existing bindings. Every old record and original validator directory was left untouched. Only the three named new artifacts and the new one-run directory were written.

The provenance correction is additive only. No candidate/source/edition/app edit, Git operation, DB/publisher action, or workflow transition occurred. ZERO images or image payloads.

This report, the new ledger, new review, and execution records are frozen at their returned hashes.

Next action: **WAIT**. No new human approval is asserted; no further repair, run, publication, or integration is authorized by this technical handoff.
