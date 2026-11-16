# STEMROBIN-184: Physical 53 Affected-Only Review

## Decision

**R1 (affected row classification) and R2 (eight operator-spacing tokens) are resolved for the supplied corrected page-53 state. No additional actionable issue was found within these two changes.**

This is not a repeated source review, full regression certification, completed-unit certificate or publication approval. The original first-finalize failure remains a historical failure. All prior source UNKNOWNs and the unseen unit-86 boundary remain in force.

| Finding | Affected evidence | Resolution |
| --- | --- | --- |
| R1: first source finalize failed, 19 printed / 20 body | Recorded guard result changes the affected observation to 20/20; current guard ordering matches the diagnosed compact-return bypass; supplied affected audit is 20/20 with no errors | RESOLVED for affected count classification; original exit-1 / 19/20 history is not rewritten |
| R2: eight `\arccos` tokens did not preserve literal `arc cos` gap | Both supplied corrected MD and JSON contain exactly eight `\operatorname{arc\,cos}` tokens, no remaining `\arccos` tokens; reversing only those tokens reproduces both original Stage B file hashes exactly | RESOLVED, with no other MD/JSON byte changes relative to the Stage B source state |

## Scope And Evidence

Working directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

`T` below denotes `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp`.

Only these authorized evidence files were read:

- `T/source-10c-p53-row-core-guard/result.json`
- `T/source-10c-p53-affected-finalize/comparison.json`
- `T/source-10c-p53-affected-finalize/before/page.md`
- `T/source-10c-p53-affected-finalize/after/page.md`
- `T/source-10c-p53-affected-finalize/after/page.json`
- `T/source-10c-p53-affected-finalize/after/audit.json`
- The relevant current function in `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tests/test_fraction_caption_rows.py`

The guard evidence directory contains `result.json`, not a separate saved `.patch`/`.diff`. This review inspected the current affected function and the supplied diagnosis/results; it does not claim a new whole-file before/after patch audit.

Read-only operations were limited to text, metadata, byte hashing and an in-memory token comparison. No source helper, counter, synthetic test, finalize, solver, acceptance gate or other verification command was executed. No image, crop or original page was loaded or reopened. No source, tool, test, original review, Git, backend, database or production file was modified by this review.

The sole new output is this report. The original Stage B report is not rewritten:

`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p52-p53-independent-review.md`

Its previously returned immutable hash is `f5664a5e90fb2c242241fee03237d77542ba80baf1c8742faa8ab26b19fc4121`. It was not reread or rehashed in this affected-only scope.

## R1: Guard And Count

At [layout.py](/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py:231), `_single_fraction_row` sorts the retained full-glyph bounds by horizontal position and builds their central-half vertical cores. It tests neighbouring core overlap and returns `False` when that overlap fails **before** the compact-envelope `True` return at line 242.

This ordering addresses the disclosed defect: a compact envelope containing independently positioned lower caption glyphs cannot bypass the already available glyph-core test. The inspected guard uses the existing glyph bounds and core construction; it does not supply an expected page count, alter source rows or install a source-pixel exclusion. No new threshold was introduced by the inspected overlap guard.

The four inspected synthetic cases have independently stated expectations:

| Synthetic case | Expected classification |
| --- | --- |
| Fraction with separately lower right-side caption | `False`, not one fraction row |
| Fraction with caption at the same height | `True`, one row |
| Fraction without caption | `True`, one row |
| Fraction with separately lower left-side caption | `False`, not one fraction row |

The fixtures create synthetic boolean arrays; they do not derive expectations from the affected page's returned count. `result.json` records one execution, four passed, zero failed. **The reviewer read this saved result and did not rerun the tests.**

The saved affected-count result records:

- Before: machine 19, body 20.
- After: machine 20, body 20.
- Separately retained affected bands include `[1409,1455]` and `[1456,1503]`.
- Protected source/render/crop bindings were unchanged during that count-only diagnosis.
- Layout hash changed from `1fc40bd09c423c94c1497de995b43c98f497710c29c7fd753076414b9c96ed48` to `da2a05fd9e06958d11f2341876f1c5b458bcbf773cad893504c8db4b60ee9fae`.

The supplied affected `after/audit.json` agrees with the comparison record: `lines_printed: 20`, `lines_md: 20`, `errors: []`, `normalizations: []`, `count_exclusions: []`, `katex_warnings: []`, `unknown_chars: []`, and `errata: 0`. The figure-31 identity, snapped box, component count and original coarse box remain the same in that audit.

The human reports that the first affected finalize was run once, exited 0, and observed 20/20 with zero normalizations. The allowed audit/comparison corroborate its resulting 20/20 pass state. An argv/time/exit-stream record was not among the authorized follow-up files; this report therefore does not claim to have reread such a record or independently executed that finalize.

**Historical boundary:** original first source finalize was exit 1, 19 printed / 20 body. The comparison explicitly records `preservedFirstFailure: true`. The new affected pass does not retroactively convert that original invocation to success or alter the original Stage B report.

## R2: Exact Eight-Token Change

The follow-up `before/page.md` is the manuscript **before the affected finalize**, already containing the eight spacing corrections. It is byte-identical to `after/page.md`; it is not the original pre-correction Stage B manuscript.

The eight affected positions remain the same: two tokens in the definition/function row, one each in the D and E rows, and one in each of the four body computations. Each is now `\operatorname{arc\,cos}`. No new formula, source row, caption, open/cont marker, emphasis span, value, punctuation, ownership or boundary was introduced.

Independent static byte comparison:

| Comparison | Result |
| --- | --- |
| Corrected MD before affected finalize vs after | Byte-identical |
| Corrected MD new tokens / old tokens | 8 / 0 |
| Corrected JSON new tokens / old tokens | 8 / 0 |
| MD after reversing only the eight new tokens | `78d8acf0f75f7f2485267129fa8af24e154719bd33c0253892cae03bb142c562` |
| JSON after reversing only the eight new tokens | `14f3b4031a5334c35dcb98b13195d1db2d033ea8f0a4e5fcfa8d74a9cc4a7bd9` |

Those two reversed-byte hashes exactly equal the original Stage B-bound MD and JSON hashes. This establishes the narrow token-only change without reopening the source or repeating the source-content review.

The corrected MD and JSON hashes match the full hashes supplied by the human and recorded in `comparison.json`.

## Byte Bindings

| Authorized file | Bytes | SHA-256 computed from supplied bytes |
| --- | ---: | --- |
| `T/source-10c-p53-row-core-guard/result.json` | 2701 | `8499fb6aba4ef5c4e2e6bf7aaed9bba5d2f9310443c2491333b735a519c52e32` |
| `T/source-10c-p53-affected-finalize/comparison.json` | 2344 | `c9a8f27a3091b0db36cb2dbcfc5933d9ceca965e904d6c72e9937da30282e438` |
| `T/source-10c-p53-affected-finalize/before/page.md` | 3953 | `a061785aad0c61cb01b1ba7de80b289bbee3d3e348b2b945d10cf5fe4766bf56` |
| `T/source-10c-p53-affected-finalize/after/page.md` | 3953 | `a061785aad0c61cb01b1ba7de80b289bbee3d3e348b2b945d10cf5fe4766bf56` |
| `T/source-10c-p53-affected-finalize/after/page.json` | 6151 | `82b5cd3717b91a18fcfca52140c8729946164a75f3f820908415f62210251f5f` |
| `T/source-10c-p53-affected-finalize/after/audit.json` | 441 | `d33043ce7badd087b98c67b5abc9e150ed68b3a503eebdf4fb0b68ce2ccade81` |
| Current `layout.py` | Text inspected, hash computed | `da2a05fd9e06958d11f2341876f1c5b458bcbf773cad893504c8db4b60ee9fae` |
| Current `test_fraction_caption_rows.py` | Text inspected, hash computed | `1063ecb9274774096ab3b968b9a5710d1a02116f38ca6c870a07b1c8a5d9daf3` |

The supplied comparison records these protected bindings, without this reviewer reopening or rehashing those off-scope files:

- Figure 31: `2b05456fab7d9a0e9be3e28eb534c84d155de88166339c4b4e56e666c6c76f11`.
- Page 52 MD: `ce1025193de3768f66befb7bd565e61323a235556691784fa4f1bb26a5e2a9e8`.
- Page 52 JSON: `72b45157f659200bc32afb8c837b32edc685a4ab0ec5cdf449b30c006a6b2d1e`.
- Page 52 audit: `c906aba1f6f2b2c1aa60e8f72ba99ac99800ef9c8e2dccbd9f642c27bbd931c6`.
- Page-53 raw PNG, grid PNG, layout JSON and prepared template: unchanged bindings recorded in the comparison.

These agree with the previously reviewed bindings. They are recorded preservation evidence, not a fresh visual crop verdict or a new full current-tree audit.

## Retained Limits

The narrow count-classification uncertainty addressed by R1 is resolved by the supplied diagnosis, inspected guard and affected results. No unrelated source UNKNOWN is resolved:

- First-paragraph page-52 displacement-accent discrimination beyond the previously authorized bottom crop remains UNKNOWN.
- Additional exact emphasis-span boundaries remain UNKNOWN.
- Raster-to-Unicode punctuation/dot codepoint widths remain UNKNOWN where previously qualified.
- Graph endpoint-marker openness/closure remains UNKNOWN.
- Exact unlabelled graph-30 terminal coordinates remain UNKNOWN.
- Undeclared exercise-numbering scope remains UNKNOWN.
- The fourth page-53 computation remains open after its comma-ended row; unseen continuation text remains UNKNOWN.
- Unit 86's right boundary remains unseen and UNKNOWN; no future subject, next card or unseen page certifies completion.

The earlier pixel-based bar/equality adjudications are not re-solved or reversed. Source identity, captions and ownership continue under the original bounded review.

**Images added: 0. Existing reviewer ledger remains 8/8 batch and 8/24 context. No ninth image, crop, reopen, solver or gate.**

Only R1 and R2 are resolved for the affected state. This report does not certify complete unit 86, downstream assembly, rendering, publication, deployment or production acceptance.

## Final Affected Addendum: Compatibility Repair

This addendum preserves the preceding report verbatim. That original report's SHA-256 was `8f397d7e89a349676ca2d3cf8bf4d1ab6e9065e3dc2cb7cac2b069e1e6c6b765`. Its R1 acceptance described the intermediate `da2a05fd` guard and four-test state, was subsequently put on hold, and is superseded by the narrower final disposition below. Its R2 byte comparison, raw evidence and source UNKNOWNs are not rewritten.

**Final disposition:** R1 is RESOLVED for the affected page-53 classification and the specifically diagnosed staggered-caption regression, on the supplied final-guard evidence. The final shared 33-test compatibility result is NOT ESTABLISHED: that suite was not repeated after repair. R2 remains RESOLVED by the already completed exact eight-token comparison. Neither the original source failure nor the intermediate compatibility failure is converted to success.

### Preserved Compatibility Failure

The full saved `compatibility-tests/start.json`, `result.json` and `stderr.txt` were read. They record the original focused compatibility invocation from `2026-11-16T13:12:26.633Z` to `2026-11-16T13:12:27.844Z`, exit 1: 33 tests, one failure and four unavailable-local-source-fixture skips. The failure is `test_fraction_line_spacing.FractionLineSpacing.test_fraction_prose_and_side_caption_share_one_printed_row`, whose independently established expectation is `True`; the intermediate guard returned `False`.

The preserved `guard-before-compatibility-repair.py` hashes exactly to `da2a05fd9e06958d11f2341876f1c5b458bcbf773cad893504c8db4b60ee9fae`, binding the failed guard to the preceding report's tool state. That state did produce page-53 20/20, but this observation alone did not establish compatibility. The earlier four-case pass remains historical evidence, not sufficient acceptance of that failed guard.

### Final Guard Inspection

A read-only whole-file diff of the preserved failed guard against the current authorized `layout.py` contains one hunk, confined to `_single_fraction_row`'s return logic. Final tool SHA-256 is `734e2e31b457009fe1454964bd874776b65127b2ac6b7941bf31476b6cf07479`, matching `overlap-repair/start.json`.

The existing retained glyph bounds, horizontal sort and central-half cores are computed before the compact return. For a compact envelope, the final branch requires positive overlap between adjacent FULL vertical glyph slices:

```python
max(first.start, second.start) < min(first.stop, second.stop)
```

These are half-open slice bounds, so touching without shared rows is not overlap. The compact branch no longer requires central-half overlap. For a tall envelope, the final expression is `len(cores) >= 3 and overlapping`, logically retaining the previous tall-branch requirement and its original central-half `<=` overlap predicate. The diff changes no thresholds, fraction recognition, glyph selection, pixel masking, exclusions or source/content rows.

The existing legitimate synthetic case supplies full glyph envelopes `[60,100)` and `[98,138)`. They share two rows, although their central-half envelopes `[70,90]` and `[108,128]` do not overlap. This explains the intermediate rejection and final acceptance without deriving an expectation from a page count.

The affected lower-caption fixture instead supplies upper glyph envelopes `[11,53)` and `[13,48)` and lower-caption envelopes `[60,95)` and `[65,91)`: the transition is separated even using full bounds, and its independent expectation remains `False`. The new compact-staggered fixture uses `[45,80)` and `[46,81)` beside the existing upper glyphs and independently expects `True`. These are inspected synthetic coordinates, not a new source-pixel observation or mathematical re-solve.

### Saved Final Focused Evidence

The full authorized `overlap-repair/start.json`, `tests.txt`, `result.json` and `verify-fraction-caption-overlap-repair-once.py` were read, together with the affected final function, complete `test_fraction_caption_rows.py`, and relevant existing legitimate-case fixture/helpers.

The saved test stream records six successful cases: the previously failing established case plus the five caption/fraction cases. `result.json` agrees: `testsRun: 6`, `failures: 0`, `errors: 0`; the stream ends `Ran 6 tests` and `OK`, with no skipped case reported. This is the supplied single focused execution, not a reviewer rerun or a final full-suite pass.

The script guards its output directory against an existing run, executes the named six cases, then mechanically counts the existing finalized page using its existing audit figure masks and metadata. It contains no finalize invocation. Its saved result records `machineRows: 20`, `bodyRows: 20`, including separate affected bands `[1409,1455]` and `[1456,1503]`. It asserts all enumerated protected byte hashes before writing `sourceCropAuditUnchanged: true`. The recorded before/after maps match for all eight protected page-53 files:

- MD: `a061785aad0c61cb01b1ba7de80b289bbee3d3e348b2b945d10cf5fe4766bf56`.
- JSON: `82b5cd3717b91a18fcfca52140c8729946164a75f3f820908415f62210251f5f`.
- Audit: `d33043ce7badd087b98c67b5abc9e150ed68b3a503eebdf4fb0b68ce2ccade81`.
- Raw page PNG: `10c637fa27f71059839822d4f579bde1cceb2f27084cbf00e14077779c1af333`.
- Grid PNG: `8680f79bf3ad3b6d84cb669132007afbf4383acc21c5559567a042f4b7dce63e`.
- Prepared template: `73db164ae2e21805c51545b08a80c3ef635451cbfc8d7059dbad137961828425`.
- Prepared layout JSON: `6a60a6678c216725daaba2f7f8724b1feb4688363c439ee8ac2b17c7ced5dc31`.
- Figure 31 PNG: `2b05456fab7d9a0e9be3e28eb534c84d155de88166339c4b4e56e666c6c76f11`.

These are supplied preservation records; the reviewer did not reopen or rehash those protected source/image files in this addendum. The parent's mechanical-count script explicitly uses `Image.open` internally; its limits string is not treated as proof that no machine decode occurred. No reviewer image payload, visual open, crop or reopen occurred.

The earlier affected-finalize 20/20 audit is unchanged, not regenerated under the final guard. No second finalize is represented by these repair records. The original first source finalize remains exit 1 / 19 printed versus 20 body; the intermediate compatibility run remains exit 1 / one failure / four skips.

### R2 And Final Bindings

R2's completed independent comparison is retained without repetition: corrected MD and JSON each contain exactly eight `\operatorname{arc\,cos}` tokens and zero `\arccos`; reversing only those tokens reproduces the two original Stage B hashes recorded above. The repair's protected MD/JSON hashes equal those corrected bindings. No further token change or fresh source verdict is inferred.

The following hashes were computed from authorized evidence bytes in this addendum:

| Evidence | Bytes | SHA-256 |
| --- | ---: | --- |
| `T/source-10c-p53-row-core-guard/compatibility-tests/start.json` | 507 | `df6a5f4eb306cc6b3ed7d6412b98a08ce0de221aa24e3e45a88560d62230d876` |
| `T/source-10c-p53-row-core-guard/compatibility-tests/result.json` | 606 | `beaefdd3cb028ded53d7acce58dda2e231801aa543ac9ede0f0408fbfaa98be0` |
| `T/source-10c-p53-row-core-guard/compatibility-tests/stderr.txt` | 7034 | `f3b178c60cd997cbebb136f55832488579650f9fa2eda9a7ac531b77ced082c1` |
| `T/source-10c-p53-row-core-guard/guard-before-compatibility-repair.py` | 33744 | `da2a05fd9e06958d11f2341876f1c5b458bcbf773cad893504c8db4b60ee9fae` |
| `T/source-10c-p53-row-core-guard/overlap-repair/start.json` | 1804 | `db0b2aec1335ec60a4c64e55218061521c8d461a848d2798613483cb6d678f59` |
| `T/source-10c-p53-row-core-guard/overlap-repair/tests.txt` | 994 | `481f79b60604ec8c0ce145f18f68ab9f9b6677b832d9d971e12979911ab5d726` |
| `T/source-10c-p53-row-core-guard/overlap-repair/result.json` | 2429 | `949a4cf7c8bc92dbc1526de02c31e9655a288f60174da5677ec9fc9977ee0abc` |
| `T/verify-fraction-caption-overlap-repair-once.py` | 2626 | `bcf129f0882a0a5fc7d9f281cfec2857e116ca2932e19b34bf09ae6f0f4aea6c` |
| Final authorized `layout.py` | 33953 | `734e2e31b457009fe1454964bd874776b65127b2ac6b7941bf31476b6cf07479` |
| Final authorized `test_fraction_caption_rows.py` | 1608 | `5fdbf0e0c2215e3248be5311caa86f45207d2936e7543dd815d013088af6786c` |
| Existing `test_fraction_line_spacing.py` (relevant fixture/helpers read) | 2908 | `30e0ccc0d88f84085683745252785d3bc1ae6125ce53b9d40e1633ab03907f0b` |

### Stop And Limits

Only this final affected addendum was written. Original Stage A, original Stage B, the preceding affected-report text, saved failure/success logs, source/tool/test files and unrelated work remain unchanged. The reviewer executed no tests, counter, helper, finalize, solver, gate, Git, backend, database, production or other-chat operation.

No full 33-test final compatibility pass is certified, and its four unavailable-source-fixture gaps remain. No additional actionable issue was found in the inspected final return-logic repair, but this does not broaden shared-counter acceptance beyond the six supplied cases and affected count.

All prior visual UNKNOWNs, endpoint/coordinate qualifications, emphasis/glyph qualifications, ownership/numbering limits and the open fourth computation remain. Unit 86's right boundary is still unseen and UNKNOWN. No complete-unit, downstream assembly, publication or production approval is given.

**Final image ledger: 0 added; unchanged 8/8 batch and 8/24 context. STOP.**
