# STEMROBIN-182 Numbering Binding Affected Review

Verdict: **REVISE**, one remaining **P2**. Original P1 answer bypass: **PASS** repaired. Original P2 numbering-only early-return: **PASS** repaired.
Offline, zero images, `finish: review`. Every command cwd: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.

## Finding

**P2: Edition authority accepts continuation-first refs with an unchanged ref set.**
At `edition.py:202`, `_authoritative_source_targets` checks numbering identity but omits the exercise start ref. At `edition.py:244`, `source_errata` compares reference sets, losing start order.

Concrete actual-candidate probe: change only 786's `pages` from `["p0231#8","p0232#1"]` to `["p0232#1","p0231#8"]`. Keep `number=786`, `source_number=736`, and the exact current authoritative record whose `block` is `p0231#8`. On current numbering-only pages231/232, `source_errata` invokes authority but returns `[]`. Its first declared ref is now an actual continuation. The answer helper rejects the same object before lookup. Rebinding the record itself to the continuation also correctly fails edition authority.

Validate the authoritative exercise start ref, or ordered refs, before the set comparison; add the continuation-first same-ref-set negative case. Keep deliberate legacy missing-ref recovery explicit. This is an edition provenance-contract defect, not a remaining demonstrated historical-answer lookup bypass.

## Pass Evidence

- Missing/null/forged/stale/unbound numbering records fail with **zero answer iterations**. The final answer binding also rejects malformed refs, meta/page/index mismatch, non-ex/cont starts, and printed mismatch. `cmd_prepare` statically passes `source_book=root`; prepare was never executed.
- Actual786/787/788 bind exactly to current ledger starts `p0231#8`, `p0232#2`, `p0232#3`. With historical736/737/738 sentinels alone they return `None`; with both identities they select only canonical786/787/788.
- Numbering-only authority cannot early-return: actual231/232 have three numbering records, zero mathematical errata, and invoke the binding check. Missing/null/stale/forged records fail there.
- 18 ordinary book/lesson/lesson-group answer/sequence cases match tracked HEAD; all 19 actual uncorrected candidate start bindings pass.
- FIRST probes: 109 PASS, 1 REVISE across 110 assertions, including receipt integrity checks, not 110 suite tests. A separate narrow probe confirms the remaining P2.

## Inheritance And Limits

Inherit prior **PASS** for source numbering metadata and isolated n37 fidelity. Current approved source/candidate hashes still match that review; no pixels, source-body or mathematical-content re-review. The current candidate remains unchanged and unpromoted.

The final seven-test PASS receipt and stream hashes were verified without rerun. Earlier assembly25/answer8/edition51 receipts predate these fixes and are not current-code coverage. Parent retains affected shared-test and promotion ownership.

Pure-helper bodies were AST-extracted without importing producer/image modules. Edition probes execute its exact binding tail with inherited candidate structure and current start-ledger identity; upstream load/merge/cut/split/figure-claim reconstruction was not run. No prepare/finalize/assembly, suite, tooling/resource edit, Git write, DB/network/app/dependency/publish/interaction, cap3/E/merge/deploy/closure, agent or chat operation. Only new reports and verification scripts were written in this directory. Prior FIRST files and failed tooling snapshots remain intact.

No mathematical answer-content approval, full lesson approval, or promotion authorization.

## Hash Binding

Summary JSON SHA256: `0a3c3eb5738142e1fd87c85c9ad42dfdfd749bd31f1f5bd34f17b60d50fad187`.
FIRST evidence SHA256: `05577dc6179d27dabf8625075ceb3e9d35228a26bcdd419e833bc3a68dcce309`.
Start-order confirmation SHA256: `82ef1d27d49542b44f1871e7f65f533edce05214a3a9d70a6d5fd0e23f44a7e3`.
Exact full-code/function/input hashes are in the summary JSON and `helper-probes-FIRST.json`; report/script hashes are in `report-hashes.json`.

Path resolution: the requested B is the prior-report directory. Its candidate, stages and snapshots are existing `B.parent` siblings resolved from prior references. All new writes stay in `B/numbering-binding-affected-review/`.
