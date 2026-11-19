# Independent Affected-Only Counter And Source Binding Review

Decision: PASS for the exact RECOVERY2 candidate delta and affected source
261/264 bindings. No actionable defect found. This is not whole-source,
lesson, assembly, modern-edition, publication or production approval.

Date: 2026-11-19. Exact checkout:
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
HEAD: `bf7d8a1cc29d492b89cce112e090d0f21d265083`.
Paths below resolve against that checkout; evidence root is
`.intentfold/tickets/STEMROBIN-182/tmp/resume182-13/`.

## Ownership And Counter Delta

Reviewed `counter-supported-owned-RECOVERY2/{layout.py,head-layout.py,own.patch,binding.json,test-result-FIRST.json}`.
The saved HEAD file equals the actual Git blob; regenerating its candidate
diff reproduces `own.patch` byte for byte. The producer's hashes match.
Candidate SHA-256:
`459d9eb3a9eea0fc0adb7617da0930d99d80f2b69a1af6820dd6cb6781e1414e`.
The working file equals this candidate plus only the excluded user helper
and guard. Both regions remain byte-identical to the original
`counter-affected/` layout snapshot and `layout-first-candidate.py`.
Helper SHA-256:
`cda274fb7796748dc6381f4d0fb9f6b6b5946a04349ba07088e83321347e840d`.
Guard SHA-256:
`09e2eb5cf20cd94f97427e6aa3bfb2a3f070cdb10c5db95cd4566e4f86333bfe`.
Neither excluded region's correctness is reviewed or credited to this delta.

The patch has three geometry-only changes. Candidate lines 151-181 distinguish
vertically separated outer fraction rules from horizontally contained,
materially narrower nested rules, using glyph-relative widths and centres.
Lines 485-503 protect a thin long rule from residual-streak removal only when
normal glyph components support it above and below within its horizontal span.
Lines 636-663 reuse `_fraction_across_split` at the gap midpoint to join a
supported numerator/rule/denominator split, with a 0.75 scaled gap bound and
fraction-start tracking. Existing separate-full-row and stacked-arithmetic
checks remain. `_fraction_across_split` still requires an actual thin connected
rule, numerator/denominator support and no unrelated substantial wrapped glyphs.
All changes stay within `_single_fraction_row` and `line_bands`; no page
identity, absolute source coordinate, expected count, source text, parser,
profile, normalization or finalization exception is added. Counting retains
private mask copies. This is not a universal guarantee for every possible
nested or horizontally overlapping arrangement.

## Reused Execution And Diagnosis

`stages/verify-supported-counter-owned-RECOVERY2` is exit 0 and its streams
match their recorded hashes and `test-result-FIRST.json`: 71 tests, four
skipped source subtests (268/269/270/275), zero failures/errors. The runner
binds imports to the helper-free candidate and excludes the user helper tests.
The 261/264 source-count and following-row separation tests are recorded `ok`,
not skipped; mask preservation, unsupported streaks, independent full text
and separate fraction rows are covered. No test was rerun here.

The retained `diagnose-next-fraction-gaps.py` stage outputs locate C261 at
[1542,1574]/[1590,1629] with a supported split but no previous join alternative.
C264 at [238,268]/[293,316] lacked retained rule support; the mask-delta output
records removed ink at [273,292]. The later patch diagnostic records 20/25
rows. Its different historical layout hash is not treated as RECOVERY2
candidate evidence. FIRST's empty target observations are not a diagnosis;
the corrected trace and mask-delta outputs supply it.

## Affected Source Binding

Reused `source259-266-review/report.md`, hash
`cbbf96f56c65a33eefa82e9ba1a57e0ac3881f8c16fa912e3a9bea1b7a237653`.
Its source observations establish C261/C264 as single physical fraction rows,
with following prose/formula separate, and F264 as an added trailing comma.
Its frozen report/ledger/manifest hashes are intact. No image bytes were
opened, decoded, hashed or displayed here, and no mathematics was re-solved.

| Page | Current MD / detected rows | Reused RECOVERY2 finalize | Content delta from first snapshot |
| --- | --- | --- | --- |
| 0261 | 20 / 20 | exit 0 | MD and JSON byte unchanged |
| 0264 | 25 / 25 | exit 0 | Only U+FF0C removed after the opening fraction |

The 264 removal is exactly Markdown line 38 and JSON `/blocks/0/lines/0`;
the complete files equal their original snapshots after that sole deletion.
No formula, other punctuation, prose, labels, continuations or metadata changed.
Both original-authored bodies equal the first-finalize bodies before that
repair. Original snapshots and receipts match their historical hash bindings.
Both current audits differ only in `lines_printed` and `errors`; all other
fields are identical and current errors, normalizations, unknown characters
and KaTeX warnings are empty. Reused finalize stdout reports zero normalizations.

## Preservation And Stop

First source receipts remain exit 1 at detected/MD 21/20 and 26/25:
`aec003c83fd1f9de77883f4d3ed47b680b757de758f52db3d23e5935f6d9e684`
and `498ceea763c7346f8b1821f0df9e6bd9e84393fdf0ead3ca5456b58f5b9902c5`.
Their failed audits are intact. Earlier helper-free FIRST and RECOVERY1
candidate results remain failures (five and one), and the first focused
test receipt remains exit 1. The older same-column probe returned true;
RECOVERY2 records false for that exact probe only, not general source approval.
No failure is erased, reclassified as success or used as a retry-count gate.

Read router, project entry, relevant product/engineering/operations charters
and production-resume. Direct offline scope controls this review; no capability,
network, DB/env/app/dependency/tool edit, image load, test/finalize, commit,
branch operation or worker dispatch was performed. Other people's changes
were left alone. Only this review directory was written.

`binding.json` records text hashes, byte comparisons and reused execution
receipts; `bind-review.cjs` is its local text-only binder, not a production
tool or behavioral check. Outputs are frozen 0444. Stop after reporting the
paths and hashes; no further retry, finalization or production is authorized.
