# Bradis Affected Binding Review

**PASS_AFFECTED_BINDINGS**, STEMROBIN-182 OFFLINE, 2026-11-19.
Exact cwd `/Users/yong/.codex/worktrees/d9b1/lemmadeck`, branch
`codex/STEMROBIN-182-textbooks`. This is a zero-image repair-binding check,
not another source/content gate.

## Affected Results

| Binding | Corrected Working Snapshot | Frozen Independent Evidence | Result |
|---|---|---|---|
| III 799.c2, row `4,3`, correction `5` | `5`; both result strings `18.71` | `5`; existing base/unit give 18.66 + 0.05 = 18.71 | PASS |
| IV r60.37, row `60,`, correction `7` | `4`; add-result string `7.769` | `4`; existing base/unit give 7.765 + 0.004 = 7.769 | PASS |
| IV r6.52, row `6,5`, main `2` | `2,553` | `2,553`; existing scale exponents 0/1 imply 2.553/25.53 | PASS |
| III correction-column prose | Nine columns, not an alleged source discrepancy | `девять столбцов поправок` | PASS |
| III final scaling example | Argument `0.01507`, coefficient `1.507`, square exponent `2` | `0,01507²`, `1,507`, exponent `²` | PASS |
| IV actual printed scaling error | First right radical retains `886.3*10^2`; next coefficient `8.863`; error labelled | Frozen tokens `886,3`, `10²`, then `8,863` | PASS |

The corrected transcription has exactly **6 changed scalar paths**:
**3 cell strings** and **3 dependent result strings**. The corrected rules have
exactly **5 changed scalar paths**, confined to the two rule corrections and
faithful footer-error expression/note. No emitted delta is outside that scope.
No root or square was computed to supply a cell. The footer note's statement
about affected answers was not checked; answer keys are outside authorization.

The unchanged **136 unique source-cell / 139 matching-occurrence** set was not
re-reviewed. Frozen supporting base/unit bindings were reused only for the
affected derived strings. **0 new images, 0 new full content gates, 0 remaining
affected discrepancies, 0 blurry HOLDs.**

## Current Hash Bindings

- `transcriptions.corrected.json`:
  `248d2961eb1f272fe2a047103f4fb154c9e5bef070589670e605bdc10523e953`
- `source-rules.corrected.json`:
  `41a84bf4ad20217b9eb056bdaebcf5417d5d72d08820119b63bbf05308611f46`
- `bradis-transcription-repair.json`:
  `7ad55e4c7c9b35e82bd4835bae821ab3886c67da2feeaca0cb313b4938dd6cb8`

Both corrected hashes match the repair receipt. FIRST transcription/rules
hashes, the independent freeze hash, the Stage2 verdict hash, and the five
affected capture-file hashes match their original frozen bindings. FIRST and
independent evidence remain untouched. Full absolute paths, hashes, affected
JSON pointers and counts are in `affected-binding-review.json`.

Reviewer writes are limited to `bradis-cell-review/affected-binding*` reports.
No answer-key, durable, tool, corrected-snapshot or pipeline-state modification;
no new image, OCR, render, browser, network, DB, app, test or paid call.
The original Stage2 verdict is preserved as FIRST history; this PASS applies
only to the two specifically hash-bound corrected working snapshots. Stop.
