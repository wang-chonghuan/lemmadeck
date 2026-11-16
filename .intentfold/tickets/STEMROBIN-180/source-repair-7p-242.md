# SOURCE7p242 sole mechanical repair: BLOCKED

Role: Volta, scoped mechanical repair author, not source author or independent reviewer. Wegener's source text and Ramanujan's FIRST content PASS are reused. No source content, figure, prior-page review or approval is repeated.

## Frozen Input And Actual Observation

Authorized original author handoff SHA256: `f76ad441f8e5ebc66b20d28467d2f790d1c4f647a3d14e62ec9068481c1e13bf`. FIRST review report: `source-review-7p-240-244.md`, SHA256 `b7f9d07e2e22cfb37d381828aa7bd2a96e8a5cdfb32b307b3332eb44bdcf61ce`.

Before the repair, 294 files were copied and hash-bound under `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-repair-7p-242-volta/preserved`: the complete existing author/reviewer freezes, existing ticket reports, current production tool bytes/contract, plus independent242 artifact/work copies. `pre-repair-manifest.json` SHA256 is `cdab04c42020aa9efb49f82a1857675ca456a1687a1f3c6c3e38abc3ebf25099`. Copying/hashing other frozen pages is not another pixel/content review or gate run.

Only actual original242 full PNG and its already-existing detail PNG were opened:

- Original `source-author-7p-240-244/work/7p/pages/0242/page.png`, SHA256 `6e9bd9cd4db3940c3497de0100d6207285fdbe46af260f28d191c055960e914d`.
- Detail `source-author-7p-240-244/visual-details/p0242-merged-question-rows.png`, SHA256 `9d7e1dbd7ea045ae4235be8e419101102b8dc3e6a51999d902f7d57598e5bb08`.

Source-first observation confirms M242-1: q2 has one row containing two inline unit fractions, followed by an independent short `多少？` row; q3's `140` unit fraction is one printed row. Source MD/JSON preserve23 rows,13 blocks,5 exercise blocks,0 figures. Original FIRST finalize exit1 (22 counted versus23 MD) and all its input/output/call evidence remain intact.

## Proven Causal Branch

One read-only diagnostic executed the preserved prepatch counter on242, with focused local tracing, not an official source gate. It reproduced22 rows and the merged q2 band `[1012,1143]`; q3 was `[1148,1238]`.

The initial merge's `separate_tall_rows` guard calls `_single_fraction_row` for q2's first fraction row `[1012,1099]` and the combined `[1012,1143]`. Both incorrectly return true for the combined case, so the short row is not protected. The later tall-band expansion computes2 rows (`line_h=41`, glyph height40, typical gap30), then `_single_fraction_row` again returns true and compresses the result to1.

Inside `_single_fraction_row`, the existing multiple-body-row safeguards require sufficiently numerous or column-aligned near-square glyphs. The short offset row does not satisfy those proofs: `多` is a38-high/28-wide connected body and `少` is fragmented. After masking horizontal-rule columns, the final remaining-row projection uses the long row's relative `25%` ink threshold; retained rows span only offsets23..59, excluding the independent short row. Thus the undercount is not a missing MD line or a missing numerator/denominator line.

Evidence: `prepatch-diagnosis.json` contains actual bands, local values and return branches. No fake `↵`, `samerow`, blank exercise, deleted line, page-number branch, source threshold relaxation or source fiction was used.

## Sole Attempt And Failure

The only attempted stable change added19 lines in `layout.py`, `_single_fraction_row`, immediately after `outside_bounds`: use the existing `_row_fragments` thresholds and existing bounded body-glyph dimensions/1.5-line-height separation to veto a single fraction when independently supported body rows survive outside fraction columns. All existing guards/constants remained unchanged. Design came from approved pixels/contract; existing tests were read afterward only for local `unittest`/fixture style.

Attempted tool bytes:

- Prepatch/current stable `layout.py`:25877 bytes, SHA256 `c64ba63bdb73b29cf984f3d63438ab78b5f16d179b8c800c9d3917ced0bd7271`.
- Failed attempted candidate:26672 bytes, SHA256 `cc8d19ce127c4df03fbb9f0ebe14075e4c132cbcf83503c73e961a53d6d83e6c`.
- Candidate full code is preserved in `failed-attempt-01/layout.candidate.py`; no failed production patch is left active.

Focused tests ran ONCE:8 tests,7 PASS,1 FAIL, exit1. Actual q2 combined-fraction detection, actual q2 first row, actual single140 fraction, synthetic offset body, denominator-only, single-fraction and scattered-mark safeguards passed. The full242 test reached23 total rows, but its independent affected-band expectation failed:

```text
expected: (1012,1099), (1113,1143), (1148,1238)
actual:   (1012,1099), (1106,1171), (1172,1238)
```

The attempted guard separated q2 initially, but later the short row and q3 numerator rejoined and were evenly split. The next full single-fraction band was not retained. This is an essential remaining geometry/counting defect, not a safe23/23 closure. No assertion or source was relaxed to turn it green.

`failed-attempt-01/candidate-freeze.json` SHA256 `61e9c2c46c0ecb3a51f535391a89eaf0aeb7cc8867129bb05cc027cf5eb0debb` binds the failed tool, all tests/source fixture, exact stdout/stderr/call, old/new epoch and expected/actual bands. Focused call record SHA256 `7a04704b3f21789e20d54c6195ae65e00f790c7d5fed0ad70d35070e233b6c49`.

Budget is exhausted **1/1 inclusive of mechanical failures**. No second fix or test rerun was attempted. After preserving failed bytes, only our additive19-line production patch was withdrawn with apply_patch, restoring the prepatch tool exactly; this is rollback of our failed change, not a new repair or budget reset. The new targeted regression test and frozen original242 fixture remain, bound in the final handoff; they were not rerun against the restored tool.

## Exact Commands

Working directory: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

1. `node .tmp/ld-s10y-lesson/source-repair-7p-242-volta/preserve-inputs.mjs` — exit0.
2. `env PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/ld-s10y-lesson/source-repair-7p-242-volta/diagnose-counter.py` — exit0, one prepatch diagnosis.
3. Two read-only connected-component inspections of the same affected short-row region, using the same shared Python with `-B` and `PYTHONDONTWRITEBYTECODE=1`; no gate, file/source edit or repair.
4. `cp -n .tmp/ld-s10y-lesson/source-repair-7p-242-volta/preserved/author-freeze/work/7p/pages/0242/page.png .claude/skills/ld-s10y-lesson/tests/fixtures/7p-0242.png` — exit0, exact binary regression fixture copy.
5. `node .tmp/ld-s10y-lesson/source-repair-7p-242-volta/run-once.mjs focused-tests /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B -m unittest discover -s .claude/skills/ld-s10y-lesson/tests -p test_short_body_after_fraction.py -v` — exit1,8 tests/7 PASS/1 FAIL.
6. `node .tmp/ld-s10y-lesson/source-repair-7p-242-volta/freeze-failed-attempt.mjs` — exit0, failed bytes preserved before apply_patch rollback.
7. `node .tmp/ld-s10y-lesson/source-repair-7p-242-volta/finish-blocked.mjs` — final read-only byte-binding/manifest freeze, not a gate rerun.

## Source Bytes And Stop Boundary

Independent working242 copies remain identical to the author freeze:

- MD: SHA256 `ac71df7ab652be051d342a2511248b722e17288ab49f6ad237d1a854e24aa0bf`.
- JSON: SHA256 `385b381b81b2a25a68a074b5782151879d9b33f9573f5542d155221ae5491117`.
- Original audit: SHA256 `b90af76f003f496154f65d97566c5a445a3dbf2fd9b483ac7801024a82da1544`,22/23/errors1.
- Original layout: SHA256 `b54827c832455b5cdfaf4e534e09d5e796ae1aec3a3e282b6764810a638ac728`.
- Original FIRST failure: SHA256 `78ea17f483b09bc87be4f6050b10061f85ab37e469ff470adc8fe5cc8a67fa36`.

There is **no new official finalize242 call or audit**: prerequisites failed, so the allowed at-most-once call was not spent. Prepare/vectorize/render/assemble/promote/DB/Git/browser/service/install/app/full-suite/build calls0. No214/215 or any other source MD/JSON was modified.

Output: `byte-delta.json`, `call-ledger.json`, `manifest.json`, `author-handoff.json` in the isolated root. They bind all preserved original/failed candidate bytes, source/artifact/work deltas, current restored tool and regression files. Status is **BLOCKED**, not approved or promotable. Main controls any later authorization; no independent affected PASS is claimed.
