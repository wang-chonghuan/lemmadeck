# STEMROBIN-180 n129 CHOICE BLIND

Status: **PASS for the bounded blind semantic stage**. Author keys, intent, coverage and misconception rationales have not been inspected or compared. This is not full CHOICE/key approval or a claim that the structural/freshness validator ran.

## Order and inputs

Workdir: `/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.

1. Read the necessary semantic review/order and artifact-contract paragraphs.
2. Read seed tasks and selected definitions; reuse this chat's already independently solved three original/current tasks. Write `source-checkpoint.json` before opening any visible choices.
3. First inspect only `views-only.json` question IDs and learner-facing views. Write `fidelity-checkpoint.json` covering task fidelity, redundancy and cross-question leakage before recording option truth or correct sets.
4. Independently evaluate all eight options below and record the complete sets in `blind-solutions.json`.

No `source-author`, `draft.json`, `author-manifest.json`, author `intent`/`key`/`coverage`, parent answer candidate, source-author reasoning or other ticket output was opened. The seed's `trace` was not followed. This chat did not author the choice candidate; no delegated-worker provenance is asserted.

Actually read inputs, bound by raw full-file SHA-256 and byte length:

| Input | SHA-256 | Bytes |
| --- | --- | --- |
| `n129-choice/seed.json` | `2dd4b239a76308bb1785906c536afa0fa033132bbe44a152507961d359247eec` | 3698 |
| `n129-choice/views-only.json` | `cac35041b2861fc9b6276390dd636f747af76bc6ffc0faca61359334fcfaaac0` | 2287 |
| `ld-s10y-choice/references/review.md` | `7ab367601247bece0fa05b60a9cd1555d78f1169ed581db76f18385f75aaacea` | 4670 |
| `ld-s10y-choice/references/contract.md` | `4d71a0338c4e2bb355ab99883a7693e465b0fd1501e099a8f7938bb278101b54` | 8792 |

The new manifest contains their absolute paths, actual hashes/sizes and unchanged before/after binding. These are raw-byte hashes, not the contract's canonical JSON digests or a substitute for validator execution.

## Seed/source check

Seed book/lesson: `7p / phy7-c2-s2-n129`; source tasks `1,2,3`; selected definition blocks `2,3,6`; structural figures `0`. All three seed task texts match the previously solved current tasks.

Previously independently established identities are reused, not guessed from the seed:

- Task `1`: `phy7-c2-s2-n129/g1/1`, original source number `1`, `p0326#3`.
- Task `2`: `phy7-c2-s2-n129/g1/2`, original source number `2`, `p0326#4`.
- Task `3`: `phy7-c2-s2-n129/g1/3`, original source number `3`, `p0326#5`.

The seed exposes `number`, text and figure IDs, not `g1` or page refs. Those identities inherit the completed SOURCE binding. Likewise, `views-only` does not expose `source_numbers`; the mapping of the first question to task 1 and the second to tasks 2/3 is this reviewer's justified interpretation, not an inspection or validation of author coverage.

Independent source basis, reused without reopening its file: the passed `source-audit.json` SHA-256 is `f2ffff85683302f1bf8d82e63390c20759e14d9e1a8ea48f3a5bd5cb4bf9bbea`, 6742 bytes. It previously established copper deposition at the negative-connected electrode and relocation/reversed galvanometer deflection after terminal swapping; the positive-charge convention; and negative-to-positive net electron drift in a normally powered external metal circuit.

**Seed data gap:** selected blocks 2/3/6 do not contain the two experiment-observation paragraphs. Thus a fresh reviewer with only this seed would lack task 1's specific experimental facts. This stage can check them because the direct instruction expressly permits reuse of the earlier independent SOURCE. The missing prose is not invented, attributed to seed, or recovered from a source-author artifact. Tasks 2/3 have sufficient selected definitions and no unresolved directional ambiguity.

The current task 3 and definition 6 preserve normal supply, external circuit and metal-carrier scope. The historical discussion does not imply that both charge signs freely move in every conductor. No image is required; `graph273` remains a cross-course prose reference from the already completed SOURCE, not an opened structural figure.

## Fidelity Before Option Solutions

### direction-evidence

The same apparatus and terminal swapping preserve the original task of recognizing experimental evidence for directional effects. Electrode relocation and meter reversal are physically distinct observations; heating and on/off behavior are distinct failures to establish polarity dependence, not redundant versions of the same observation.

The stem gives the manipulated variable, not the two observed outcomes. Interpreting changed versus unchanged outcomes is legitimate experimental-comparison reasoning. The other question supplies neither copper-deposition behavior nor galvanometer reversal, so no cross-question answer leakage is present.

**Capacity loss:** recognizing supplied observations does not verify autonomous recall/explanation of both observations or actual experimental performance. The option about electrode relocation also does not independently test the more specific fact that deposition tracks the negative-connected electrode. That supplementary SOURCE detail is not falsely counted as choice-tested. The source's core task, distinguishing directional evidence from mere current-presence evidence, remains.

### convention-and-electrons

The stem explicitly retains a normally powering source and an external metal circuit. Combining the direction convention and electron polarity is justified: the four alternatives cover the two-by-two combination of sign convention and electron terminal direction. Knowing either component alone leaves two alternatives, so the joint task still requires both distinctions.

The repeated halves are deliberate contrast dimensions, not duplicate complete answers. The first question has no positive/negative convention or electron polarity, so it does not leak this answer. Definitions already present in the seed are legitimate source knowledge, not another question supplying a solution.

**Capacity loss:** joint recognition does not verify two separately written responses, autonomous definition wording, or the learner's explanation of why negative-electron drift opposes conventional current. It does not assess actual experiments. These losses are explicit and do not erase either source task's core distinction.

Fidelity, redundancy and cross-question leakage: **PASS** within these recognition limits. This does not claim all twelve explanatory SOURCE facets are independently elicited by the two choice questions.

## Independent Eight-Option Solution

“Correct” below means satisfies the question's stem. A physically plausible observation can be an incorrect answer to a question asking for directional evidence.

### direction-evidence — multiple

Complete correct set: **`{a, b}`**.

| Option | Correct for stem? | Specific reasoning |
| --- | --- | --- |
| `a` | True | Terminal swapping moves copper deposition from one electrode to the other, as already independently established. The changed deposition location under a polarity-only change is directional-effect evidence. |
| `b` | True | The galvanometer changes from one side of zero to the opposite side when terminal connections are swapped. Opposite deflection distinguishes direction, not merely current presence. |
| `c` | False | Heating before and after swapping describes persistence of an effect, not a changed effect. Heating can occur for either current direction and cannot by itself establish the requested direction dependence. The heating observation is not declared physically impossible or claimed to have been measured in the source experiment. |
| `d` | False | Deflection with a closed circuit and return to zero after opening compare current present versus absent, not the two terminal polarities of the maintained apparatus. The observation can be physically reasonable, but does not answer this stem. |

No other option meets the requested comparative-evidence criterion. The multiple-choice set contains both independent direction-sensitive observations.

### convention-and-electrons — single

Complete correct set: **`{a}`**.

| Option | Correct for stem? | Specific reasoning |
| --- | --- | --- |
| `a` | True | Positive charge moving or possibly moving defines conventional current. Under the explicitly stated normal-supply external-metal conditions, negative electrons drift from negative to positive. Both clauses are correct. |
| `b` | False | Its electron negative-to-positive clause is correct, but its negative-charge convention is wrong. A correct second clause does not make the conjunction correct. |
| `c` | False | Its positive-charge convention is correct, but positive-to-negative is the conventional external-current direction, not the negative-electron drift direction. The electron clause is wrong. |
| `d` | False | Both clauses are wrong: convention is not defined by negative-charge motion, and electron drift is not positive-to-negative under these conditions. |

The stem's “电子的定向移动” scopes the shorter option wording “移动”; it does not assert that all microscopic electron motion is unidirectional or that each electron makes an uninterrupted terminal-to-terminal journey. No claim is extended to source interiors, charging or electrolyte conduction.

All four sign/direction combinations are distinct. Only the positive-convention/negative-to-positive-electron combination satisfies both clauses; `single` is therefore appropriate.

## Verdict and Boundary

- Visible questions: `2`; options checked: `8/8`; reused original/current source tasks: `3/3`.
- Blind complete sets: `direction-evidence = {a,b}`; `convention-and-electrons = {a}`.
- No unresolved semantic ambiguity under authorized prior-SOURCE reuse; no required blind-stage revision.
- Standalone seed task-1 observation gap and recognition/production losses are retained explicitly, not hidden behind PASS.
- Author source-number coverage, correct-set agreement, intent, rationales/misconceptions, canonical snapshot matching and the structural/freshness validator remain unreviewed.
- Required images/read images: `0/0`. No candidates, SOURCE reports/manifests or previous receipts were changed.
- Existing exact errors remain untouched; their unknown text/retry-after is not reconstructed. This stage had no new rate error/retry. Inherited/cumulative cost remains **UNKNOWN**, not reset to zero.
- No DB, environment, network/paid probe, configuration, git, publication, handoff, worker dispatch or other-chat message was used.

Do not open author keys or reasoning until the parent supplies another explicit KEY-comparison stage.

Manifest:

`/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n129-CHOICE-BLIND/manifest.json`

It lists actual inputs/payload outputs with `path`, `sha256`, `bytes`; the manifest and its checksum receipt are `0444`. The receipt binds the manifest without a recursive self-hash.
