# STEMROBIN-180/C: Repaired n109 Affected-Only CHOICE Review

Status: integration **BLOCKED**. Contract review outcome: **revise**.
Book: `7p`; lesson: `phy7-c1-s3-n109`; repair budget: **1/1 used,
0 remaining**. Candidate edits by this reviewer: 0. Inflight: 0.

## Independent Finding

The replacement process stem is faithful to source task 2: it requests a
complete, ordered working process and the gas's post-work change. The unchanged
options retain the working gas/steam, expansion doing work, conversion to
mechanical energy and the source-described temperature decrease.

The definition/process package still has an essential answer leak, even though
the replacement stem no longer directly names the defining conversion:

- Process options a, b and c all start with fuel energy becoming gas/steam
  internal energy and explicitly continue with internal energy becoming
  mechanical energy.
- Process option d explicitly says fuel energy first becomes mechanical energy
  directly, despite being false about the working body and subsequent process.
- Fuel energy becoming mechanical energy is therefore a visible invariant
  across the offered accounts. It identifies definition option c without first
  deciding which process is correct or independently recalling the definition.

This is not merely ordinary elimination of process alternatives using the
definition. That legitimate direction still leaves the learner to distinguish
expansion/contraction and the post-work temperature direction. The defect is the
reverse shortcut: the process alternatives provide the definition's
distinguishing conversion without requiring the process judgment. Shared
concepts alone do not fail a package; this correctness-independent cue into the
definition task does.

Both affected answer-leakage checks are `revise`; the process entry records an
outgoing leak, not a claim that the definition reveals the process key. Affected
fidelity and redundancy checks are `pass`. No additional implemented repair,
repair proposal, retention or promotion was performed.

## Blind Before Key

1. Read only the two authorized reference files and the assigned frozen Tesla
   source solve/bindings, seed and pure learner view. Reused the source solve;
   did not perform a new full source solve or option-mathematics review.
2. Wrote substantive `blind-judgment.FIRST.json`, including the exact repaired
   stem, the four-option invariant, the ordinary-elimination distinction and
   the `revise` / integration `BLOCKED` judgment.
3. Completed its hash seal at `2026-11-16T15:09:46.268Z`, with zero draft,
   key, author-intent, repair-manifest, FIRST-review or previous-verdict reads.
4. Only afterward read the assigned repaired draft/manifest and FIRST
   review/final manifest. Read the hash-bound author FIRST draft identified by
   that final manifest solely for the exact structured field comparison.
   The old blind-verdict file and author source-solve file were not opened.
5. Reused FIRST entries and transferred the already-frozen affected judgments
   into the current review without changing the blind outcome.

Blind judgment: 7174 bytes,
SHA-256 `4e12a79d15c47acfb17ecb0183c205957af25bfea0149c6437fd9de7b66cf938`.
Blind seal: 1895 bytes,
SHA-256 `d1fade8b948587fa3beb1f78ea77be60ff480545c12b61496c0e2d696af38bca`.

## Exact Scope and Reuse

Structured comparison verified exactly one author-FIRST-to-current change:
`/questions/1/view/stem`.

Before: `关于热机的工作过程，哪一项正确说明了燃料的能量如何成为机械能，以及气体做功后的温度变化？`

After: `哪一项完整、按先后顺序说明了热机的工作过程及工作后气体的变化？`

The frozen seed is byte-identical to FIRST and all four frozen source trace
bindings match. All options, keys/rationales, intents, coverage and other draft
fields are unchanged. The pure view equals the current draft's view projection.
No original source files were reopened; current-source immutability relies on
the assigned unchanged-source premise and frozen bindings. Parent owns SOURCE
approval integration, not this affected-only CHOICE review.

Reused exactly: three source reviews and their coverage entries; three
mathematics blocks containing all 15 option checks; the entire unaffected
`heat-engine-types` review; empty figure-review arrays. New judgments: the
definition/process pair's fidelity, redundancy and leakage checks, plus its
package relationship. No fresh full rereview was performed.

## Current Binding and Execution

Seed canonical SHA-256:
`340d90a6be995e0b3f036ca21221aac18fd46d5e1bf311daf9a51b4e1a1dc289`

Draft canonical SHA-256:
`5c2a79c5d7a0d233a5dbb37d13d1c96520a51babd2178691d95dbcd7800eae51`

Review canonical SHA-256:
`fa769668ad1475d4cb17fb32382f964f388e012d21ecc803c152d690b569a2bd`

`review.json`: 13291 bytes,
SHA-256 `219f08ecf8b8476505bb835c915ba7ed56f1d0268e3fea2a4891821cf7f5d068`.

Only local reads, JSON/hash comparisons, exclusive structured freezes and
authorized manual artifact writes were used. Local contract field/set/hash
checks passed; these are not shared-validator execution, source freshness
evidence or a new proof of the reused mathematics.

`validate.py` invocations: 0; with-review invocations: 0; command failures: none
observed. Images/figures: 0. No IntentFold workflow, freshness command, Grill,
backend, Git, environment inspection, DB, network, services, install, shared
tool execution, modern promotion or rendering was run. FIRST records and the
candidate remain unchanged. No retention. Work stopped at the affected review.

## Artifacts

Own root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-choice/review-7p-n109-repaired/`

- `blind-judgment.FIRST.json`
- `blind-before-key-seal.FIRST.json`
- `comparison-and-reuse.FIRST.json`
- `review.json`
- `contract-and-reuse-observation.FIRST.json`
- `final-current-bound-manifest.REPAIRED.json`

The final manifest seals the artifact leaves, this new report and the observed
input bindings. Its own bytes/SHA are returned externally, not self-included.
