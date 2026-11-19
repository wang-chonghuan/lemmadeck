# STEMROBIN-182 n36 affected-only cap2 answer gate

## Verdict: pass, aggregate content approval

Changed 768 passes. Inherit the 15 unchanged FIRST passes for 761-767 and
769-776. This approval is bound to the exact current candidate and unchanged
inputs below; it is not finalization, publication, or runtime approval.
FIRST's original `revise` report remains untouched and historically valid.

Sole cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
`B` = `.intentfold/tickets/STEMROBIN-182/tmp/resume182-11`.
`M` = `ssot-resources/soviet10year-textbooks/artifacts/7a/editions/modern-us-neutral/lessons/alg7-c4-s2-n36`.
Own receipts: `B/n36-answer-review-affected-receipts`.

## Exact change and preservation

- FIRST candidate preserved at `B/n36-answer-FIRST-failed.json`: SHA-256 `30b5d125ff674cfc4bb3246102b4da5b11311e3c3ffae1f6d9d6a6270d221372`, exactly the FIRST-reviewed candidate.
- Current `M/answer-keys.json`: SHA-256 `d1dc60fbc8d92ba67172905c0120fd28031b1655d38f0cce576f46145854a0e9`.
- The entire current file equals the preserved FIRST file with precisely one JSON string replacement: `/answers/7/displayAnswer`, exercise 768, line 68. No header, ordering, whitespace outside that string, other object, or other 768 field changed.
- All 15 inherited answer objects were deeply compared with FIRST and checked against FIRST's per-object and display SHA-256 hashes; all match. This was a preservation check, not a semantic re-review.
- 768's `grading=ungraded`, `source=derived`, `parts=[]`, and empty historical entities remain unchanged. No bookRaw or judging fields were added.
- Preservation stage receipt `B/stages/n36-answer-preserve-FIRST-failure.receipt.json` has SHA-256 `3db2a40dabcc3b647c51f7007760ad23ac6acf360e4e103c8fd12c1c6c8bb553`; cwd, successful exit, snapshot path and stream hashes were checked. Actual snapshot hash, not cp exit alone, proves preservation.

## 768 comparison to frozen FIRST solution

Read only 768's existing frozen solution section; did not solve the source again.
Compared every new subpart to that section and the original FIRST values:

| Part | Revised radicand-as-square output | Value and coefficient check | Verdict |
| --- | --- | --- | --- |
| a | $2^4=(2^2)^2=4^2$ | $4$, unchanged | pass |
| b | $3^6=(3^3)^2=27^2$ | $27$, unchanged | pass |
| c | $(-5)^4=((-5)^2)^2=25^2$ | $25$, unchanged; negative base stays inside even powers | pass |
| d | $(-2)^8=((-2)^4)^2=16^2$ | $16$, unchanged | pass |
| e | $(-2)^8=16^2$ | $3\cdot16=48$; 3 remains outside original radicand | pass |
| f | $(-10)^4=((-10)^2)^2=100^2$ | $-2\cdot100=-200$; negative external coefficient retained | pass |
| g | $(-3)^8=((-3)^4)^2=81^2$ | $0.1\cdot81=8.1$; coefficient remains outside | pass |
| h | $(0.1)^{10}=((0.1)^5)^2=(0.00001)^2$ | $100\cdot0.00001=0.001$; coefficient remains outside | pass |

All eight ORIGINAL radicands now have explicit square representations, not
merely a generic instruction. e)'s shorter `16^2` is itself the required
monomial square and matches the frozen solution; repeating its intermediate
power nesting is not required. Each label a-h appears once, in order, with
its original correct value. The closing note explicitly keeps outside
coefficients out of radicands. FIRST finding `n36-768-square-representation`
is resolved for this new candidate only.

768 display SHA-256 changed from `b991d4f319604ba18d75526132e80c2f03cfbad914c6af98464c907d12c843ae`
to `ce28ece9cf4f04c524c4e1b37c9663a42713344b28cd626bac63d03e8f8a7116`.
Its parsed object SHA-256 is now `58a44f65b493236ea5926c84bebae7b788bcce13cb4f771b4c4eac13253a0b59`.
Object hashes use `JSON.stringify` parsed object, UTF-8.

## Unchanged inputs and inherited evidence

| File | Unchanged SHA-256 |
| --- | --- |
| M/lesson.json | `9491dea5575ade5261d12d308bd3c1ce58908d35e769246761017bc5f9c92463` |
| M/exercises.json | `a2915f4c5936f022629e2c48dc3f09662b9408a33402166075c7b7673b0b1abb` |
| M/figures.json | `5cb365752bc66957456663151a6be872b1903bfb8b223e0d412ba51d6c1c8688` |
| B/answer-prepare/7a/modern-us-neutral/lessons/alg7-c4-s2-n36/answer-keys.template.json | `e6b65a05a555a54d415d49c3350e982e2b7bc8a73bc2482e9f4bf1db9f52f58d` |
| B/n36-answer-review-FIRST.md | `097cdfcb16f0832e4205ebe26bcdae36b0c638b9f6b6155b0c36648598fe3f61` |
| B/n36-answer-review-FIRST.json | `daf42c7d37c5d5b7d871205fda872a6e9f49b857adfc7c7b65019ebc6bc462ad` |
| B/n36-answer-review-FIRST-receipts/independent-solutions.md | `ed897c7a3b50481f4a6978586e39e76231190f7806d67f631d29b7a5e69024c7` |

The independent solution receipt is still 0444. Its original freeze and FIRST
mechanical/final receipts also match their recorded hashes. No source solve,
source-stage gate, graph review, or unrelated semantic review was rerun.
Thus FIRST's 765b strict-positive, raw-title spacing, bookRaw absence, domain,
graph-method and other substantive passes remain inherited, not newly claimed.

`B/n36-answer-review-affected-receipts/change-contracts.json`, recorded at
2026-11-18T23:52:57.503Z, SHA-256
`b5b7ae91e13fc81bdb6b7e08fb90e5ee6e0af195ab098638d6aec75554c11372`,
contains all 15 old/current object and display hashes, unchanged prompt hashes,
the exact changed field and the checked input/FIRST evidence bindings.

## Boundary

All authored evidence used apply_patch; the offline Node preservation checker
generated its receipt only in the owned sibling receipts directory. Zero
images, no .env, network, DB, app, Git, finalize, publish or cap3. No candidate,
FIRST evidence, parent author candidates, or another agent's file was edited.
Current candidate remains draft. Aggregate cap2 CONTENT gate passes by combining
15 hash-preserved FIRST passes with this affected 768 pass, with no new defects.
