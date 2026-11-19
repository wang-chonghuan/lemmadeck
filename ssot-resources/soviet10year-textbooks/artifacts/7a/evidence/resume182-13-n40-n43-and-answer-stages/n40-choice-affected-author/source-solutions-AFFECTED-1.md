# Independent Source Solutions

Scope: source 829-831 only, before constructing replacement options. No answer
keys, method-review answers, answer-author candidate, or Nash independent option
sets were consulted. The existing three learner views and findings S2-F1..3 were
read only to locate the lost tasks.

## Evidence

Actual Table IV cells and address/correction rules were taken from these
source-only captures, whose eight main cells and three correction cells agree:

- `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n40-table-cell-author/captures.json`
  SHA256 `ad91b77f81f4949cf6b4bdd5eda0d8690eaa6879cfa04e3e127208e0002fd2e8`.
- `/Users/yong/.codex/worktrees/d9b1/lemmadeck/.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/n40-table-cell-review/captures.json`
  SHA256 `aa31b153eef42b3b0abbe5f6407201f28c63ca0a7be68de57f0ff7f096dd048d`.

These captures identify V. M. Bradis, Four-figure Mathematical Tables, Drofa,
2010, Table IV, printed pages 35, 37 and 39. They do not establish equivalence
to the historical edition used by the original textbook.

The source-only independent capture establishes:

- For rows below 10, the main-column digit contributes 0.01 to the argument,
  and the correction-column digit contributes 0.001.
- For rows from 10 onward, those argument contributions are 0.1 and 0.01.
- A printed correction integer contributes 0.001 times that integer to the
  root. A captured printed zero is still a real correction cell.
- The source-backed normalization convention uses
  `N = a * 10^(2m)`, `1 <= a < 100`, with reported root scaled by `10^m`.
  It does not state an inclusive upper endpoint of 100.

The new items will identify their table transcription as supplementary context.
Only raw row/column cells will be supplied, not already-computed target roots.

## 829

The exact expression is `6*sqrt(1/3) = sqrt(36/3) = sqrt(12)`.
The source's first route intentionally substitutes `0.3333` for `1/3`.

For that route, `0.3333 = 33.33 * 10^-2`. The normalized argument `33.33`
uses row `33,`, main column 3: root `5,771`. Its fourth argument digit uses
correction column 3: integer 3. Add `3 * 0.001`, giving `5.774`, then scale
the root by `10^-1`: `0.5774`. Multiplying the reported root by 6 gives
`3.4644` before any final rounding.

The second route uses the exact absorbed radicand 12: row `12,`, main
column 0, root `3,464`, giving `3.464`. No correction column is required.

Both outputs become `3.464` at three decimal places. The second route needs
one main entry, no correction, no decimal root rescaling, and no final
multiplication by 6; it also avoids the initial fraction replacement. It is
therefore the more convenient route under an explicit fewer-table/scale-
operations criterion. Equality of the rounded reported outputs is not equality
of the exact expressions, and is not proof of equal total approximation errors.

## 830

Absorb each positive coefficient by squaring it, then use the source-backed
normalization convention:

| Original expression | Exact preparation | Captured main entry | Scale | Reported value |
| --- | --- | --- | --- | --- |
| `4*sqrt(5)` | `sqrt(16*5) = sqrt(80)` | Row `80,`, column 0: `8,944` | 1 | 8.944 |
| `15*sqrt(2)` | `sqrt(225*2) = sqrt(450) = 10*sqrt(4.5)` | Row `4,5`, column 0: `2,121` | 10 | 21.21 |
| `14*sqrt(1/7)` | `sqrt(196/7) = sqrt(28)` | Row `28,`, column 0: `5,292` | 1 | 5.292 |
| `12*sqrt(5/6)` | `sqrt(144*5/6) = sqrt(120) = 10*sqrt(1.2)` | Row `1,2`, column 0: `1,095` | 10 | 10.95 |

No correction is needed for these main-entry arguments. Trailing product zeros
are omitted without changing numerical values. A choice must require the exact
preparation and correct power-of-ten root scaling, not simply reproduce four
supplied cell values.

## 831

For a positive radius, `r = sqrt(S/pi)`. With the source's approximate
`pi = 3.14`, the two quotient inputs are exactly `625/157` and `412/157`
when treating the stated approximate decimal data as the computational inputs.

Their decimal quotients are:

- `625/157 = 3.9808917197452229299363057324841...`
- `412/157 = 2.6242038216560509554140127388535...`

Round these arguments to four significant figures, an explicit new condition
for this adaptation rather than a source-printed instruction:

- `3.981` selects row `3,9`, main column 8, root `1,995`, correction
  column 1, printed integer 0. Returned radius: `1.995 cm`.
- `2.624` selects row `2,6`, main column 2, root `1,619`, correction
  column 4, printed integer 1. Returned radius:
  `1.619 + 1*0.001 = 1.620 cm`.

The captures flag these guard inputs as parent-selected, not original problem
data. The inputs here have been independently derived from the source areas;
their adoption is an explicit authored four-significant-figure policy.

At fixed pi, multiplying area by 4 multiplies radius by `sqrt(4) = 2`;
multiplying area by `1/25` multiplies radius by `sqrt(1/25) = 1/5`.
These scaling conclusions do not depend on the table's rounding errors.

## Numerical Boundary

Only exact algebra, rational division, decimal rounding and arithmetic on the
captured source cells were used. No calculator square root was substituted for
the table, and no source-cell value was generated.

## Fidelity And Production Losses

The three repaired units will restore both executed lookup routes for 829,
all four table-derived numerical values for 830, and the inverse formula,
both numerical radii and both area-scaling deductions for 831.

The visible context necessarily changes the source task: it supplies a small,
faithful transcription from the identified 2010 table instead of requiring the
learner to navigate the original full table. It does not establish historical
edition equivalence. Row/column interpretation, argument normalization,
correction-unit application and rescaling remain to be performed.

830 will explicitly require coefficient absorption and normalization, fixing
one legitimate route instead of accepting every table strategy. 831 adds a
four-significant-figure quotient-input policy and a three-decimal returned-root
display policy. 829 retains the pre-final-rounding product and separately
compares reporting at three decimal places.

Choice recognition cannot prove unprompted production of derivations, long
division, table navigation, a written convenience explanation or a written
scaling argument. It also cannot establish tighter error bounds or equality
of total table errors. These losses will remain internal in intent/coverage.

No semantic PASS is asserted by this author. Parent owns affected review.
