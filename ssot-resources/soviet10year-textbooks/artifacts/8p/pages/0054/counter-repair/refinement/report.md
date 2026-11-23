# PRIVATE p54 refinement: NOT READY, NO APPLY

Every command used cwd `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
All new writes are under `.tmp/180-7-p54-counter/refinement/`.
No live layout or owner-tool test was edited: the required all-control PASS
condition was not achieved. No finalize, source/page/audit/crop promotion,
assembly, source53/summary review, source55/56/57 operation, Git, DB, artwork,
install, timer, chat/message or paid call occurred.

## Preservation and base

The original first-reject report, six valid failures, candidate, diff, test
and ENTRY snapshot remain at their original paths, unchanged:

- ENTRY `baseline/layout.py`:
  `17d1ebc192fdd97d8ee4a86d4dc8b7b41afef7afd2c97ce15106d00beb1b19e5`
- First-reject `candidate/layout.py`:
  `5731af344813d13cf0a958aa08ea502b5741febd33658e7c57c511c449d15521`
- Unchanged original `test_counter.py`:
  `a19c8277f867ffe1784c2059d5fd1be899ad3819f850691c965d40e682fbd7ae`
- First-reject `report.md`:
  `9b98a8f3dd85dd1e9b970b6c12ade393765b6a5fe35cc0405412286681612d06`
- First-reject `candidate/results.json`, containing the six failures:
  `240553a081df3b1fcb8703dfa4f9caa544c8df998fa31038c2636c69985e673c`

This refinement pins CURRENT `current-base/layout.py`, including the closed
p53 fragment repair:
`9872032f001b8066dc6ce223bd8381fc0d2b50953950a26c5a9aaeae3c44b9f6`.
The live file still has exactly that hash at the final check.

## Actual refinement

`candidate-03/layout.py`:
`9c8b85d7932df0de2acab639e756d50265e737521a822a4b857d3ac012c027cd`

Exact current-base delta is `candidate-03/candidate.diff`:
`956afa3f83ddd4862b02b4b8d989819e9f6832155b22296b0431619a1dccc7d5`.
It adds 96 lines and replaces 3 lines, exclusively inside `line_bands`.
Everything outside that function is AST-identical; the existing p53
fragment-classification block is byte-identical. No n7 helper, fraction
helper, geometry, constants, source pixels or other page repair changed.

The separator rule retains the original type-transition/isolation checks
and now derives BOTH body edges, with symmetric boundary guards. Normal,
mirrored and vertically translated p54 retain all 21 real-row anchors.

The new smaller-letter path requires a nearby printed row with at least five
glyphs establishing a smaller font, a narrow/tall letter shape, size
consistent with that type, sufficient area relative to its own height, and
an otherwise isolated projection row. It allows at most 5% unrelated dust.
The original numeral path is otherwise unchanged. There are no production
page coordinates, expected counts, count masks, global trims or fake figures.

The original complete `t` sample has 226 pixels, 30 x 14 px. The old global
46-px line-height area threshold is about 254 pixels and misses it. Nearby
footnote body type is about 32 px; the sample's row contains 228 total pixels,
including two unrelated original scan pixels. Exact-zero-dust isolation
therefore failed. The bounded dust allowance admits this genuine letter
without recovering existing denominator tails inside formula rows.

## Complete bounded results

| Snapshot | p54 methods/failures | Additional typography methods/failures | Prior focused | p53 focused | Guard | Shared methods/failures/skips |
| --- | --- | --- | --- | --- | --- | --- |
| current-base-extended | 11 / 41 | 4 / 16 | 13 / 0 | 11 / 0 | 2 / 0 | 47 / 4 / 2 |
| candidate-03 | 11 / 2 | 4 / 2 | 13 / 0 | 11 / 0 | 2 / 0 | 47 / 4 / 2 |

Failure totals include subtest assertions. Errors are zero. Both full runners
exit 1. Candidate and current-base shared results are exactly equal, including
failed IDs and skip reasons: margin `1`/`7` at left 21/1549 and the unavailable
original107 skips. No introduced shared failures.

Candidate passes the unchanged original three-placement standalone `t`
controls, genuine symmetry, all 21 authored omission checks, all original
formula/numerator/body/minus positives and the original pixel-preservation
and long-fraction-rule veto controls. Nineteen of 21 actual-row deletions pass.
The scientific footnote remains two rows; no numerator or denominator is
removed from the counting pixels. Both smaller real footnote denominators
also count as added rows at three placements, normal and mirrored, with an
actual extra band containing the independent expected anchor. This is real
count evidence, not pixel preservation alone.

The extra type-absence veto passes. Other tiny-mark samples remain noise.
Vertical-position controls pass without production coordinates.

## Precise remaining valid failures

1. Delete real heading y557..605. Right-margin residue x1635..1682 /
   y606..619 becomes a row. Count is 21, expected 20.
2. Delete real prose y1930..1975. Right-margin residue x1629..1665 /
   y1902..1922 becomes a row. Count is 21, expected 20.
   Both failures persist in CURRENT p53-repaired baseline after exactly
   the genuine separator is absent. That repair does not close these gaps.
3. A 12 x 12 mark at x24..35 / y2420..2431 creates a false row.
4. An 18 x 9 mark at x24..32 / y2420..2437 creates a false row.
   These two additional negative failures also occur in CURRENT baseline
   with the separator absent: count 22, expected 21. Original dust at
   (x157,y2422) and (x156,y2423) enlarges the pooled x-span to x24..157.
   The new smaller-letter path rejects these marks; the pre-existing
   projection/filter path still counts them. They are retained failures,
   not reclassified as text or weakened/skipped.

Original first-reject six failures were not overwritten. Four are resolved
in the new candidate (mirror and three standalone-`t` placements); its two
original deletion failures remain. No matching-count candidate is approved.
Completing the condition would require conservative margin/projection
handling beyond the verified separator and isolated-letter changes; this
bounded run did not modify the protected p53/n7 logic to force those counts.
DO NOT APPLY `candidate-03` or overwrite live layout with a private copy.

## Evidence and reproduction

Final `candidate-03/results.json` SHA-256:
`0d5e856bb5201b4317404d392e27ceebcdca0e4256d55f5271daa4d5827d7eb8`.
It binds the unchanged original controls, p53/current shared tests, original
0054 durable files/pixels and first-reject evidence. All bindings stayed
unchanged. Logs are `p54.txt`, `typography.txt`, `p53.txt`, `guard.txt`,
`prior_focused.txt` and `shared.txt` beside each snapshot.

Additional test `test_typography.py` SHA-256:
`95b4bfa79a88fca2ce5731cc92c563e33af1b32e9c4b06b3d5d1e9df103e0063`.
The old eleven-control file was not edited. Failed refinement drafts and
their actual results remain in `candidate-01/` and `candidate-02/`.

From the stated cwd, using the installed environment and reused existing
bounded counter runner:

```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/180-7-p54-counter/refinement/run_checks.py current-base-extended
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/180-7-p54-counter/refinement/run_checks.py candidate-03
```

No new proof pipeline/full-book test or asset package. New images: ZERO;
no p54 or minus image reopen, no new target. Cumulative context usage remains
3/8: prior one baseline and two targets. Numerical fixture reads did not
load further image payloads. No paid calls.
