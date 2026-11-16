# 10c physical31-34: independent changed-only source review

Reviewer: Dalton. Ticket STEMROBIN-184. Date: 2026-11-16.
Scope: the immutable Banach targeted repair only. This is NOT another
substantive source/figure review or a new original-first inventory.

## Disposition

Affected-only comparison PASS. F31/F33 are closed for their authorized
representation/typography changes. U33/U34 notes correctly preserve
provisional readings and unresolved codepoints; neither glyph is resolved.
No additional repair is requested by this changed-only comparison.

| Page | Changed-only verdict | Reused substantive limit |
| --- | --- | --- |
| 31 | PASS: only leading filled-right marker representation changed; saved repair gate9/9 exit0 | Existing definite prose/math/object/crop/boundary PASS reused; no source-font Unicode claim |
| 32 | UNCHANGED: entire durable triple and both crops byte-identical | Prior sole StageB PASS reused, not reviewed again |
| 33 | PASS: task68 superscript prefix and one provisional v/nu note only; saved repair gate13/13 exit0 | U33 remains UNKNOWN; other source/figure verdicts reused |
| 34 | PASS for uncertainty-note handling and preservation only; saved repair gate24/24 exit0 | U34 remains UNKNOWN; NO unconditional 需/须 glyph or full-text PASS |

No original/crop/grid was displayed or decoded during this check. No
concrete affected discrepancy required redisplay. All prior pixel,
geometry, content and boundary observations are reused unchanged.

## Immutable Inputs

Unchanged original-first StageA:
`tmp/source-review-10c-p31-p34-source-first.md`,
SHA-256 `8448093d5ad4901f8f7ce4bcec54a3fab9bfe57f9897f50e9d57c44b458973ca`.

Unchanged sole StageB:
`tmp/source-review-10c-p31-p34.md`,
SHA-256 `3482476fd4eae306f9c560723ac71c8a1ebb5b899e40947d25c111b7bbe5d002`.
Only its findings/limits were reread; its full source review was not repeated.

Disclosed targeted author report:
`tmp/source-10c-p31-p34-targeted-repair.md`,8569 bytes,
SHA-256 `b8875f9d0ece7530bf23ca25065fbce2054d1ca06f75e35428a93b515a0dba35`.
The evidence report copy has identical bytes/hash.

Evidence root:
`tmp/source-10c-p31-p34-targeted-repair-evidence/`.

| Evidence | Bytes | Actual raw SHA-256 |
| --- | ---: | --- |
| strict-changes.json | 8446 | `24838d0c254caa6ad5c50a66a713571fcc7436410530156ff821b5cfe0de6ceb` |
| immutable-manifest.json | 20372 | `ae0438f653e1f7b3e388218eb2f9b9a31171146a439942c86b8b7976551fd54e` |
| pre-finalize-diff.json | 2154 | `6764308e055dc5c9f36e89c648ca05b2bbc0e328a8e1783cff7bb4257506cbe8` |
| before-bindings.json | 2878 | `5d76270d7e536d99e86acf4d05d08d5a4b14b5b962dd3890cbb51f4691c3b5c5` |

The manifest records three authorized repair finalizes, actual exits0/0/0,
no32 edit/finalize, preserved initial manifest and U33/U34 UNKNOWN. The
strict-changes report's changed paths/results agree with independently read
before/current files and saved run records. Its booleans were not substituted
for independent byte/deep-equality comparison.

## Exact Affected Changes

### F31 / p0031#5

Only `/blocks/4/lines/0` changed:

```text
BEFORE: ►按照上面规定的图象变换规则第三条，由
AFTER:  $\blacktriangleright$按照上面规定的图象变换规则第三条，由
```

The same physical line, following text, marker direction/fill/role, all
four paragraph rows and following paragraph are preserved. No row, formula,
condition, closing marker on32 or figure relationship changed. This meets
the prior independently frozen printed opening-marker finding without
assigning the scan an original Unicode codepoint.

Only the corresponding audit `unknown_chars` and `errors` arrays became
empty. Every other audit field, including both complete figure records,
9/9 rows, normalizations, errata and count_exclusions, is unchanged.

### F33 / p0033#12

Only `/blocks/11/lines/0` changed in the body:

```text
BEFORE: 68.* 把函数 $y=\cos x$ 的图象进行下列变换：1) 向 $Oy$ 轴以
AFTER:  $68^{*}$. 把函数 $y=\cos x$ 的图象进行下列变换：1) 向 $Oy$ 轴以
```

Raised star and baseline separator period now match the previously frozen
roles. The `ex 68` block identity, all four stored/printed task rows,
four transformation operations, signs/fractions/vectors and BOTH requests
are identical otherwise. No source task was solved or reformulated.

One note was appended at `/meta/notes/6`; all six earlier notes are unchanged:

> Dalton首次源观察保留的未决字形：题64/65（p0033#8/#9）的同一小写v-like函数名字形，不能确定为Latin v或Greek nu。当前两题的v是暂定转写，不改变v，不依据变换计算猜定码点；此项仍UNKNOWN。

This accurately locates both originally frozen uncertain glyphs and keeps
current `v` provisional. Both complete task64/65 lines are unchanged.
There is no replacement by Greek nu, inferred mathematics or new erratum.
The33 audit is byte-identical to the old audit.

### U34 / p0034#4

Only `/meta/notes/7` was appended; all seven earlier notes remain identical:

> Dalton首次源观察保留的未决字形：p0034#4第3印刷行中当前“无需烦琐”的需/须无法确定。现写需为暂定转写，保留需，不改为须，不宣称字形已确认；此项仍UNKNOWN。

The note matches the original-first uncertainty and stable row location.
The entire34 body, all formulas/tags/commas and the one actual proof `↵`
are byte-identical to the reviewed pre-repair body. The chosen 需 remains
provisional; it was not independently confirmed or replaced.
The34 audit is byte-identical to the old audit. Mechanical `unknown_chars:[]`
does NOT settle this source-reading uncertainty.

## Independent Equality Checks

Read-only `diff -u` on the31/33/34 MD files showed exactly the changes
above; `cmp` for32 MD exited0 with no differences. Diff exit1 on the
affected MD files means the authorized differences exist, not a gate failure.

Inline Node used `fs.readFileSync`, JSON parsing, `util.isDeepStrictEqual`,
crypto SHA-256 and Buffer byte equality. Starting from the preserved old
JSON, expected content was changed ONLY at the two independently authorized
body prefixes and one appended note on each affected metadata page.
No row detector, formula parser, source validator or production tool ran.

Actual comparisons:

- Every new repair-before MD/JSON/audit file equals the original StageB
  `source-10c-p31-p34-evidence/pNNNN/after/` file, all12 files. Thus the
  preserved baseline is the exact previously reviewed source, not a
  reconstructed or altered baseline.
- The complete current JSON equals old JSON with only the explicitly
  described differences on31/33/34.32 JSON is completely unchanged.
- The MD body equals its old body with only the31/33 prefix substitutions;
 32/34 bodies are byte-identical. MD frontmatter equals current JSON meta.
- All current31/33/34 triples equal their repair `after/pNNNN/` snapshots.
  Each current affected MD also equals its saved authored-before-finalize MD.
- Both33/34 audit files and the whole32 MD/JSON/audit triple are byte-identical
  to the pre-repair and original StageB files.31 audit differs only as above.
- All remaining glyphs, prose, math token occurrences/order, line breaks,
  task labels, block kinds, flags, open/cont/samerow, captions, footers,
  source/render/profile bindings and figure metadata are unchanged.

Independent printed-row observations9/13/13/24 are reused from StageA.
No counter, expected count, extra row or count exclusion was introduced or
rerun. Any added note is frontmatter only, not an extra printed body row.

## Saved Actual Repair Results

Read `runs/p0031`, `runs/p0033`, `runs/p0034` command/stdout/stderr files.
Each command record names:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python -B
.claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page N
```

All three have `exit:0`, `signal:null`, `error:null`,
`repair_finalize_run_count:1`, and the stated workspace cwd.
These are saved AUTHOR command results, not commands rerun by the reviewer.

| Page | Actual saved result | stdout bytes / SHA-256 | command.json SHA-256 |
| --- | --- | --- | --- |
| 31 | 7 blocks,9/9,2 figures,0 normalizations,exit0 | 217 / `cb934ca7a84de86b46341f5591821253003427085b84c5f501f8088c28f5e94e` | `e9c8b0241a8c1d4c2230b144ca57405fcd8f3ac51886cc2c2d4d43230d9c907f` |
| 33 | 13 blocks,13/13,1 figure,0 normalizations,exit0 | 176 / `70d8df860eb90c56212a25a4f981d49b76c31b54db8ef89d3ff89fcef84c1544` | `8db34869f3e66ac43c7dfd5fc49f24cb7722f787af523323d7d9022ad5dd6452` |
| 34 | 7 blocks,24/24,0 figures,0 normalizations,exit0 | 130 / `2b122d7d0ea0c06ea9169903b7cd66d0d8acf87e9e360c0d916d6a5b996774bc` | `8ee0cfdef719a66d891b56fd54db7d269eedc240515e2e29e4d1bb946b2a9567` |

All three saved stderr files are0 bytes, SHA-256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
Current audits have empty errors/unknown_chars/count_exclusions and retain
empty normalizations/KaTeX warnings and errata0.
No new32 repair run is claimed; its existing first13/13 result is reused.

## FirstFAIL Preservation

The original31 exit1/9/9 unsupported-U+25BA failure remains in the original
author evidence and the repair-before copy. Original initial-command hash:
`f23aac0f96506779af72447a6523d64fb54c983aecdb32fea7a60899265654eb`.

Repair-before `initial-finalize.stdout.txt` is byte-identical to original
`p0031/finalize.stdout.txt`:234 bytes,
`40e7e7f6bdee1d09a8a94ea7e03abf7a9fae3f12f212d41f0187a6ad3c0e6c12`.
Repair-before failed audit is byte-identical to original31 after audit:
870 bytes,
`1ba56035250e597c150143a6a10d9345bbf91aa6d67c7d2e8f4b95f9eb68e062`.

The first failure was not overwritten, reclassified as PASS, removed or
replaced by the successful repair evidence.

## Current Durable Binding

Paths are under
`ssot-resources/soviet10year-textbooks/artifacts/10c/pages/NNNN/`.

| Page | File | Current bytes | Current raw SHA-256 |
| --- | --- | ---: | --- |
| 31 | page.md | 2713 | `971135934382d3175467bc80de13ee0fb6ca66e9eaf6bd00bb553ed8930bf5af` |
| 31 | page.json | 4254 | `6b6a11822ef98166a6326fc6d64500050f2069dfc54df544703bb40e8f0aad81` |
| 31 | audit.json | 673 | `1a68dc3d5c65512b74bcc0448de2a884631be9df8571bf6e5653cb900db87a2e` |
| 32 | page.md | 3107 | `587f2780ace9f893e11c231c92de84bf0a806fff10d79f32756e02f41bb4b903` |
| 32 | page.json | 4871 | `76d68f1c9e19cb7f59b0e2533c90337fe00ba596eba25abd476ffd93a04765b6` |
| 32 | audit.json | 681 | `af2bc4f80101fb2bcc395257380819a53eb3f3ad9677dd8fb491adc3c3089d39` |
| 33 | page.md | 3103 | `d7168b97252d852d1e3ce02f282b621c47bf5b569ce1a9e0eff29cc64fe2b34e` |
| 33 | page.json | 5726 | `aafdc6520498b03a861d01bf366f1d8852578a567a1aceaf1efeb53fe8aba40c` |
| 33 | audit.json | 441 | `7bfd1c95d2569330993b7b69ed30b783b774a5aae33e8e794a4536c046e67ccd` |
| 34 | page.md | 3482 | `f83c9d61d1784f34b0b37eb2aa4a30581af632bfea43d7659f03f37effb2188e` |
| 34 | page.json | 5120 | `fd0cf2c5527b25410865c22bb647da5d1c97e42627e3652770e51e2b2d5530a6` |
| 34 | audit.json | 203 | `9efc1a89d59c7c26d55d31693e920ef885e412b4e1a6e3d12a83af3ad44bde6a` |

## Unchanged Original PNG and Five Crops

Hashed bytes only, no display/decoding/new crop/geometry inspection.
Every current original PNG equals both targeted repair-before and original
author-before bytes and the frozen StageA raw hash.

| Page | Unchanged raw original PNG SHA-256 |
| --- | --- |
| 31 | `b2856ca9834afd57d5601063a70542c97622853e8523509825660a09763ab925` |
| 32 | `e39cf79620b4dc3893705be0518cf6a8829dd109b2d59a99224687f31804bcce` |
| 33 | `1c33b9c2eb95900dd1077b31011517f5dbf06922371aaf2955fc1ac3c4c75c35` |
| 34 | `a222c82da6a63df836b245a25c8075fe03f5c20ec538aaa9d61f33d80e61d1de` |

Every current crop equals targeted repair-before and original StageB-after
bytes. Affected31/33 crops also equal repair-after bytes. No32 after snapshot
is required or claimed:32 was not changed/finalized.

| Figure | Unchanged audit ink box | PNG bytes | Unchanged raw crop SHA-256 |
| --- | --- | ---: | --- |
| 16 | [240,294,1212,321] | 8804 | `31a56cd4f038577c8d24ce43ce1c2888c2e1aecd45183008cda39cdbe79577bd` |
| 17 | [477,731,780,841] | 15210 | `2635c2d39c0b80b6e232ce9716e668a6a7d28f0ec5d1e94ac489bb7e4a7b148b` |
| 18 | [217,1306,1096,268] | 8827 | `128bc913f07c26f427d77d931f0810df6ac01b908f6701372c868e53e973118e` |
| 19 | [142,1799,1238,317] | 10825 | `0cbcd58f36f0eb90c458e5cb63da16c16e20e1d32f2ce7b9bc17994530641cdc` |
| 20 | [274,302,1167,620] | 14764 | `458541c1db6511f9532eeccd1692304e9027c082eb89aab00b85d8a8c167321a` |

All rough/snapped boxes, component counts and figure records are deeply
unchanged through the audit comparison. Prior whole-crop PASS, pixel hashes,
padding dimensions, O/0 uncertainty and absence of invented fig20 -2 are
reused without a second figure review.

## Stop and Closure Limit

This changed-only PASS closes F31/F33 and the requested UNKNOWN-note
handling, not U33/U34 identification. In particular it does NOT certify
需 rather than 须. All former math/source unknowns remain unchanged.
The observed31->32 explanation,32->33 fig20 and33->34 new82 boundaries
remain the prior reviewed facts; unit82 beyond34 remains unobserved.

Only this new scratch report was written with apply_patch. No source,
author evidence, prior review, tool/index/modern/answer/figure/DB/Git write,
validator, counter, prepare/finalize, vectorize, assemble, browser/network
operation or substantive review repeat occurred. No current product/lesson
release or official review-record promotion is claimed.

STOP after the immutable changed-only handoff. Parent owns subsequent
strict source closure and any future authorization.
