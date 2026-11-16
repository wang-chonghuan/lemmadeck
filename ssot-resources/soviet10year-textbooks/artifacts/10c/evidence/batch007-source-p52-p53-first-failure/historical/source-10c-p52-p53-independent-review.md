# STEMROBIN-184: Independent Source Review, Stage B

## Findings And Verdicts

1. **[P1] Physical page 53 remains an actual first-finalize FAILURE.** The saved invocation exited **1**, reporting **19 printed / 20 block-body rows**, and its saved audit retains that error. The current MD and JSON additionally carry `printed_lines: 20`; this is not the official printed-line observation of 19 and must not be read as a successful reconciliation. Current files existing, `provenance.normalized: true`, empty normalization arrays, or visually complete source content do not override the failure. Targets: [0053 audit](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0053/audit.json:3), [0053 MD metadata](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0053/page.md:32), and the saved `finalize-0053.json`/stdout bound below. The failure's mechanical cause is **UNKNOWN**. No retry, count run, correction or source-row deletion was performed or recommended as an automatic action.
2. **[P2] The literal source spelling `arc cos` is collapsed in the author manuscript.** Stage A explicitly froze the visible gap between `arc` and `cos`; the authorized `53-graph-example.png` confirms it directly in the first computation. The author uses `\arccos` throughout page 53, with no explicit internal gap, while claiming literal preservation. This is a source-notation/typographic discrepancy, **not a claim that the computed mathematics is wrong**. Targets: [definition and function notation](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0053/page.md:59), [D/E notation](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0053/page.md:61), and computation rows at lines 72, 80, 84 and 88, with the same strings in `page.json`. In a future separately authorized correction, preserve the printed gap explicitly, for example with the Stage A spelling `\operatorname{arc\,cos}`, or disclose an authorized normalization instead of asserting exact visible spelling. **No correction is made by this review.**

Separate verdicts:

| Surface | Verdict |
| --- | --- |
| Full disclosed evidence/raw-byte binding | MATCH: 185/185 indexed evidence files, 138/138 snapshot raw entries, 18/18 current files |
| Physical 52, first official finalize | Recorded exit 0, 9 body / 9 printed; historical result only |
| Physical 53, first official finalize | **Recorded exit 1, 20 body / 19 printed; FAILURE preserved** |
| Four source-image objects | Table + graphs 29, 30, 31; inspected official crops match the frozen source inventory, with no confirmed missing instructional stroke, label or cell |
| Physical 52 source prose/content | Row/content match subject to the explicit Stage A accent adjudication and retained emphasis/encoding limits below; no demonstrated mathematical-content omission |
| Physical 53 source prose/content | Rows, values, case, restrictions, continuation and ownership match; literal operator-gap discrepancy remains; first relation is now independently confirmed `=` |
| Page/lesson completion or acceptance | **NOT ACCEPTED / STOP**: actual page-53 failure remains, source notation discrepancy remains, and unit 86's right boundary is unseen |

No global PASS, completed lesson, approved publication or resolved counting defect is asserted.

## Scope, Authority And Immutable Stage A

- Review date: 2026-11-16.
- Working directory: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- The only file created by Stage B is this report.
- `W` below denotes `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
- `T` denotes `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp`.
- `E` denotes `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p52-p53-author-20261116T1240Z`.
- `D52` denotes `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0052`.
- `D53` denotes `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0053`.
- Alias-relative paths in tables resolve against these exact absolute roots; they are not additional files or outputs.

The human explicitly authorized FULL author disclosure and the six unique Stage B image views after consuming FULL Stage A. Stage A was not edited:

| Document | Full SHA-256, checked against disclosed value |
| --- | --- |
| `T/source-10c-p52-p53-independent-source-first.md` | `93d227274265f814a9f73b17225a68e9d6d9a834a34c2f8b6649d06c04fb655a` |
| `E/full-report.md` | `3f4d837d91bdc318dee3d5bf82d859564d669a007ae073dfb97897fb0b02f71b` |
| `E/full-manifest.json` | `097a968104a47210ae5754f3b1a36512a19ccd51ce48c09b499263a5d0adcfb9` |
| `E/raw-hashes.json` | `c26838eac136fdd2ac4a43230bf2c943621eeddd56a3648b86a57036ce75fe43` |

All four hashes matched. The complete author report was read. The complete manifest and raw-hash index were parsed, including every snapshot entry, current binding, invocation, ledger entry and recorder binding. All 185 indexed evidence files were read as raw bytes and checked for size and SHA-256. The full before-finalize manuscripts and current full MD/JSON/audits were read as text; byte-identical snapshot copies supply the same full content rather than another interpretation. All six saved crop-command records and both first-finalize records/streams were read. The recorder was read as text, not executed.

Raw tool/module copies, templates, TOC and source-manifest copies were treated as reproducibility/binding evidence, not as new mathematical source authority. No future TOC topic or unseen page supplied source facts.

This review ran only read-only text/metadata/hash operations and the six explicitly authorized image opens, then wrote this report. It did not run the recorder, a source helper, counting, finalize, prepare, repair, vectorize, assemble, adapt, tests, validation, backend, Git, database, production, publication, deployment or another-chat activity. No candidate or durable file was edited. No mathematical re-solve was used.

## Full Raw Binding

### Snapshot Coverage

Each embedded snapshot in `full-manifest.json` was structurally equal to its separately saved `E/<name>/snapshot.json`. Every snapshot file entry with `raw` was checked against its own saved bytes, full size and full hash; all matched.

| Snapshot | Start UTC | End UTC | All entries | Copied raw files checked | Binding |
| --- | --- | --- | ---: | ---: | --- |
| `before-author` | 12:41:12.851 | 12:41:12.867 | 22 | 17 | 17/17 MATCH |
| `before-finalize-0052` | 12:45:30.884 | 12:45:30.897 | 24 | 19 | 19/19 MATCH |
| `after-finalize-0052` | 12:45:31.483 | 12:45:31.496 | 30 | 24 | 24/24 MATCH |
| `before-finalize-0053` | 12:45:31.499 | 12:45:31.508 | 30 | 24 | 24/24 MATCH |
| `after-finalize-0053` | 12:45:31.952 | 12:45:31.959 | 34 | 27 | 27/27 MATCH |
| `author-frozen` | 12:46:11.373 | 12:46:11.394 | 34 | 27 | 27/27 MATCH |

All times above are 2026-11-16 UTC. The six snapshots contain 174 total entries, including directories, declared absence and PDF hash-only entries; 138 entries have copied raw files. `raw-hashes.json` indexes 185 evidence files including those raw copies, snapshot JSONs, commands, streams, ledgers and the report/manifest. There were **zero size/hash mismatches**.

The initial snapshot declares both durable page directories absent. The before-first-finalize snapshot holds both complete author manuscripts. Page 52's outputs already exist in `after-finalize-0052` / `before-finalize-0053`, while page 53 is still the unchanged pre-finalize manuscript. `after-finalize-0053`, `author-frozen` and current binding retain the failed outputs. This is evidence for the disclosed before/after sequence, not an independently recreated execution.

Every snapshot includes a PDF hash-only entry with `raw: null`: `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`, 7567970 bytes. This reviewer did not decode or open the PDF or additional source pixels.

### Current Files, All 18 Bindings

All values below were matched to current bytes, not accepted solely from the author's prose.

| Exact root-relative file | Bytes | Full SHA-256 |
| --- | ---: | --- |
| `W/.tmp/ld-s10y-lesson/10c/pages/0052/page.png` | 65955 | `12a3976d6129411537774b1f8c94d7a0b888cc1b5f17e6ff3f484896050f6736` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0052/page.grid.png` | 84369 | `964d1247b2893c53055048ba9ff932fa1f9e05b3385218dac6a8c1378e686259` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0052/layout.json` | 647 | `a8f309064f0a064d5316b97953c5d1888e7b6a91335d22d473eee94d3f48e656` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0052/page.template.md` | 1469 | `618bd8ec1226388163235f3a085d7cbe871dc8d26cf82be0d602c2844ceb2b3f` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0052/figures/tbl-p0052-01.png` | 11108 | `f3204abc7d5087643081ca3adf6aafa62ab9b4efdf111da44009d44daec54b18` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0052/figures/fig-29.png` | 6368 | `48f19879d744350c9124b35e2b67e128ed904b1aef37a384ded18effc37b3507` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0052/figures/fig-30.png` | 8370 | `99cc99b3c5a41a13d32267b7cfa51539721d20eae7e40b8c9b8fff911b0c3c78` |
| `D52/page.md` | 3923 | `ce1025193de3768f66befb7bd565e61323a235556691784fa4f1bb26a5e2a9e8` |
| `D52/page.json` | 5689 | `72b45157f659200bc32afb8c837b32edc685a4ab0ec5cdf449b30c006a6b2d1e` |
| `D52/audit.json` | 915 | `c906aba1f6f2b2c1aa60e8f72ba99ac99800ef9c8e2dccbd9f642c27bbd931c6` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0053/page.png` | 73110 | `10c637fa27f71059839822d4f579bde1cceb2f27084cbf00e14077779c1af333` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0053/page.grid.png` | 90052 | `8680f79bf3ad3b6d84cb669132007afbf4383acc21c5559567a042f4b7dce63e` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0053/layout.json` | 850 | `6a60a6678c216725daaba2f7f8724b1feb4688363c439ee8ac2b17c7ced5dc31` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0053/page.template.md` | 1469 | `73db164ae2e21805c51545b08a80c3ef635451cbfc8d7059dbad137961828425` |
| `W/.tmp/ld-s10y-lesson/10c/pages/0053/figures/fig-31.png` | 5100 | `2b05456fab7d9a0e9be3e28eb534c84d155de88166339c4b4e56e666c6c76f11` |
| `D53/page.md` | 3825 | `78d8acf0f75f7f2485267129fa8af24e154719bd33c0253892cae03bb142c562` |
| `D53/page.json` | 6015 | `14f3b4031a5334c35dcb98b13195d1db2d033ea8f0a4e5fcfa8d74a9cc4a7bd9` |
| `D53/audit.json` | 563 | `73e6e233cea7c418ccafcb132fb86de7230c1528cd9783ff9721548e9c40e1fc` |

### Before/After Manuscript Variants

| Manuscript | Before first official call | After first official call / frozen / current |
| --- | --- | --- |
| 0052 MD | 3319 bytes, `3f02951985d75adaf59fb7abfd3f671419815bb74da3ba41425ce02e7b67a271` | 3923 bytes, `ce1025193de3768f66befb7bd565e61323a235556691784fa4f1bb26a5e2a9e8` |
| 0053 MD | 3556 bytes, `c6bab76f6d47dbd95ad7ab0b28fd10d464c0adb0236a11023c2bfe1cbf241e6c` | 3825 bytes, `78d8acf0f75f7f2485267129fa8af24e154719bd33c0253892cae03bb142c562` |

The before manuscripts contain the same complete source text rows and open/cont/caption structure as the after manuscripts. The after files add generated metadata, snapped figure geometry and figure image references. Both saved audits have `normalizations: []`; no post-failure corrected prose variant is present in the disclosed snapshots. Page 53's before MD is byte-identical in `before-finalize-0052`, `after-finalize-0052` and `before-finalize-0053`.

Source binding in both MD/JSON pairs matches book `10c`, physical 52/53, printed 46/47, source PDF hash and raw page render hash. No new unit heading, exercise identity or right boundary was inserted. Profile hash: `dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.

### Reproduction Bytes, Not Re-executed

Every snapshot's copied tool bytes were hash-bound. Principal reproducibility hashes:

| Saved source-relative component | Full SHA-256 |
| --- | --- |
| `.claude/skills/ld-s10y-lesson/tools/p2c.py` | `691f50adcd8e3e8b72f035ef0f3521c943b03e30f6d57daa099d40d3b16725e1` |
| `.claude/skills/ld-s10y-lesson/tools/layout.py` | `1fc40bd09c423c94c1497de995b43c98f497710c29c7fd753076414b9c96ed48` |
| `.claude/skills/ld-s10y-lesson/tools/blocks.py` | `1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66` |
| `.claude/skills/ld-s10y-lesson/tools/normalize.py` | `65db6b013806f0dd9de0a739e09714c8cdfaebd8f9cb41c4edcb5e242beae29f` |
| `.claude/skills/ld-s10y-lesson/tools/mathcheck.py` | `8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7` |
| `.claude/skills/ld-s10y-lesson/tools/katex_check.js` | `59c500172eca6dd76baea669aa0d92f67c28512253a751018782a5006a619b56` |
| `ssot-resources/soviet10year-textbooks/sources/manifest.json` | `5114f1e03c78a847555addfcaa5c6f27f5d2cb02abf3593f9c40a6f1d5cb5ed0` |
| `ssot-resources/soviet10year-textbooks/toc/10c/zh.json` | `431d02aa2d293778d0f55083ea5c1ea210839bfcea28ff9134ed8ed76d735230` |
| `E/record.mjs` | `c6333aea007b398f6cb44435685c5be61d6abd14ccb34a8c9f8bd75fd02ff010` |

The layout hash equals the parent's disclosed authoritative layout hash. No new counter or module execution was used to turn these reproducibility bytes into acceptance.

## First Official Commands And Actual Failure

These are **saved author invocations**, not commands run by the reviewer:

```text
cwd /Users/yong/.codex/worktrees/a07e/lemmadeck
argv[0] /Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
argv[1] /Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/p2c.py
argv[2..] finalize --book 10c --page 52
argv[2..] finalize --book 10c --page 53
```

| Page | Start UTC | End UTC | Exit | Saved observation |
| --- | --- | --- | ---: | --- |
| 52 | 2026-11-16T12:45:30.897Z | 2026-11-16T12:45:31.482Z | 0 | 8 blocks, 9 body / 9 printed, 3 figures, 0 normalizations |
| 53 | 2026-11-16T12:45:31.509Z | 2026-11-16T12:45:31.952Z | **1** | 10 blocks, 20 body / 19 printed, 1 figure, 0 normalizations |

The page-53 raw stdout says:

```text
[finalize] 10c p0053: 10 块 / 20 行（印刷 19）, 插图 1 张, 规范化 0 处
    fig-31(图 31) → [1017, 939, 435, 512]
  ✗ 失败 1 项:
    - 行数对不上：印刷 19 行，块体 20 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

| Saved command evidence | Bytes | Full SHA-256 |
| --- | ---: | --- |
| `E/finalize-0052.json` | 1456 | `7845b9a43b530a616fcfc1517d75474e79c87b5c8e3a67d2663209888622cf70` |
| `E/finalize-0052.stdout.bin` | 266 | `1618bfd6b4905696e411b4cf9eb3ee97c1750d31634b21ee6f687fed27d02482` |
| `E/finalize-0053.json` | 1457 | `05ea79e74df7cc9362cd5646451ac83c0a010977219af8517417bdcd986dc8af` |
| `E/finalize-0053.stdout.bin` | 268 | `6c36f50db19a423f5ee80af134b26387a9901263985b880fe6ce58a03bef771b` |
| Both respective stderr `.bin` files | 0 each | `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` |

The recorder's saved logic guards first-only invocation files and stops at nonzero exit; the disclosed record has one invocation per page. Frozen/current bytes agree with the first failed state. That supports the disclosed no-retry sequence; it does not claim access to an unrecorded global process history.

The saved page-52 audit has no errors. The saved page-53 audit has the one row mismatch. Both audits have empty `normalizations`, `unknown_chars`, `katex_warnings`, `count_exclusions`, and `errata: 0`. Empty `unknown_chars` is a tooling field, **not** proof that independent visual ambiguities are resolved.

The author also disclosed two earlier read-only shell failures: a directory listing reporting absent new durable pages, and a malformed inline manifest read ending in a syntax error. These were not successful checks, not first-finalize substitutes, and not the terminal page-53 processing failure.

## Explicit Stage A Adjudication

Stage A remains byte-identical. The following adjudications are new Stage B conclusions, not retroactive edits.

| Frozen Stage A item | Authorized new evidence | Stage B adjudication |
| --- | --- | --- |
| Page-52 displacement encoded `\vec r` with confidently reported arrow | `E/cropviews/52-bottom.png`, one original-detail open | The overhead mark on the bottom occurrence is a short horizontal bar, with no arrowhead. **Stage A's arrow reading at this occurrence was wrong.** Author `\bar r` matches the directly inspected mark; do not replace it with `\vec r` to satisfy Stage A. |
| First two page-52 displacement accents | Stage A original-only observation; no new first-paragraph crop authorized | The fresh crop directly settles the bottom occurrence, not additional unviewed local pixels. Discrimination of the first two overhead marks beyond the original coarse observation remains **UNKNOWN**; Stage A's blanket arrow assertion is not a valid author-error proof. |
| First page-53 computation relation `UNKNOWN` after a visible short horizontal stroke | `E/cropviews/53-graph-example.png`, one original-detail open | Two equality strokes are clearly visible. Relation is **`=`**. Author equality matches source. Stage A uncertainty is resolved by pixels, not mathematics. |
| Graph-30 half-pi label layout `UNKNOWN` | Official `fig-30.png`, one original-detail open | The compound labels place `π` to the right of the fraction: `-\frac{3}{2}\pi`, `\frac{3}{2}\pi`, `\frac{5}{2}\pi`. Stage A's value encodings were not assertions of that glyph layout. Original crop retains the actual layout. |
| Stage A perceived heavy page-52 conclusion / page-53 opening | Bottom text crop plus retained Stage A observation | Dark/heavy ink is visible, but the precise typographic bold-span boundary cannot be established reliably from scan weight alone. **UNKNOWN** remains for an additional full assertion-wide emphasis span. No confident missing-bold author defect is inferred from Stage A's perceived heaviness. |
| Visible gap in `arc cos` | First-example text crop and Stage A source transcription | Gap remains directly visible. Author `\arccos` differs from the literal gap-preserving notation; finding P2 above. |
| Graph-31 caption row | `53-graph-example.png` | `图 31` is separate, lower-right caption text, below the main `而且 ... ∈[0,π];` text baseline. The tall fraction reaches lower than that baseline. Do not convert the caption to a formula fragment or assert same-row solely to obtain 19. Mechanical row-band cause remains **UNKNOWN**. |
| Figure endpoint-marker ambiguity | Each official graph crop | No clearly separate hollow ring or independent filled circular endpoint marker is exposed. Keep endpoint-marker openness/closure **UNKNOWN**; preserve actual thick termination strokes. |
| Unit 86 right boundary | No further source page authorized or opened | Still **UNKNOWN / open**. No future-subject proof from its TOC title. |

## Every Source Object And Row

Row references below are the actual current MD line numbers. Each row was compared to the immutable Stage A full literal body. Dollar delimiters, formula grouping and parentheses/codepoint-width conventions are distinguished from missing visible content. There is no new mechanical count in this section.

### Physical 52 / Printed 46

| Stage A object | Author block / MD line | Comparison |
| --- | --- | --- |
| 52-T, unnumbered table | `fig 表`, line 72, `tbl-p0052-01` | Same first object; no invented leading `p cont`, no table caption, no exercise owner |
| 52-G29 | `fig 图 29`, line 75 | Same body figure before its own caption |
| 52-C29 | `cap 图 29`, line 79: `图 29` | Exact caption text, one separate row |
| 52-P1 row 1 | Line 82, ends `它的` | All text and `$2\pi$`, displacement tuple `(2π,0)` retained; `\bar r` versus Stage A `\vec r` adjudication above |
| 52-P1 row 2 | Line 83, ends `余` | Exact text/row split after `余`; closed interval `[-π+2πn,π+2πn]`, signs, lowercase `n` retained |
| 52-P1 row 3 | Line 84, ends `$n\in Z$` within author math span | All text, reference 29, displacement `(2πn,0)`, separator comma, lowercase `n`, membership and uppercase `Z` retained; accent qualification above; math-span grouping differs, no missing visible comma/value |
| 52-P1 row 4 | Line 85, `得出（图30）.` | Reference 30, parentheses and terminal full stop retained; fullwidth/ASCII parenthesis encoding differs from Stage A, not evidence of another word or punctuation mark |
| 52-G30 | `fig 图 30`, line 87 | Same body figure between closed first paragraph and next paragraph |
| 52-C30 | `cap 图 30`, line 91: `图 30` | Exact caption text, one separate row |
| 52-P2 row 1 | Line 94, ends `正弦` | Exact text and `sin(x+π/2)=cos x`, plus sign, equality, `x` case and fraction retained |
| 52-P2 row 2 | Line 95, ends `正弦曲` | Exact text, negative displacement `(-π/2,0)`, full stop before `因此` and terminal incomplete word retained; bottom `\bar r` pixel-confirmed |
| 52-F | Line 98: `· 46 ·` | Footer number and two flanking dots retained; not body, task or caption |

Author page JSON has the same eight blocks, literal row arrays, captions and figure identities. Figure blocks have empty text rows and `owner_exercise: null`; caption/prose/footer rows are not duplicated into them. The table, G29 and G30 have `cont/open/samerow: false`. P1 is closed. P2 has `open: true`, `cont: false`. The footer is transparent page metadata, not an artificial paragraph closer.

### Physical 53 / Printed 47

| Stage A object / row | Author block / MD line | Comparison |
| --- | --- | --- |
| 53-P0 | Line 53: `线向左移动π/2.` | Exact text, fraction and period; `p cont`, closed after joining page-52 terminal `曲` to `线` |
| 53-P1 row 1 | Line 56, ends `连续性，` | Text, `[0,π]`, comma and row end match |
| 53-P1 row 2 | Line 57, ends `闭区` | Text, `[-1,1]`, signs, period, `y=cos x`, and word split match |
| 53-P1 row 3 | Line 58, ends `叫做` | Text, both `[0,π]` restrictions, punctuation and row end match |
| 53-P1 row 4 | Line 59, ends `图31` | Defined `**反余弦**` emphasis preserved; text, `y`, `x`, equality and reference 31 match; both `arc cos` tokens collapsed to `\arccos` |
| 53-P1 row 5 | Line 60, ends `直线` | Text, `y=cos x`, parenthetical `x∈[0,π]`, comma/period and row end match; author splits the math spans and uses fullwidth parentheses, no lost restriction |
| 53-P1 row 6 | Line 61, ends `，` | Text, `y=x`, capital `D`, `[-1,1]`, equality and comma match; `arc cos` gap discrepancy |
| 53-P1 row 7 | Line 62, ends `是` | Capital `E`, `[0,π]`, equality, comma and row-end `而且反余弦是` match; `arc cos` gap discrepancy |
| 53-G31 insertion | `fig 图 31`, line 64 | Same prose-owned figure; no exercise identity; transparent between `p open` and `p cont` |
| 53-P1 row 8 | Line 68: `减函数.` | Exact closing row; `p cont`; author 7+1 split preserves Stage A's eight source rows |
| 53-P2 | Line 71: `我们来计算几个反余弦的值：` | Exact words and colon mark; author's fullwidth colon versus Stage A ASCII encoding is not missing punctuation |
| 53-P3 row 1 | Line 72: first result, comma-ended | `√3/2`, `π/6`, case, fractions, comma retained; `=` now independently pixel-confirmed; `arc cos` gap discrepancy |
| 53-P3 row 2 | Line 73: `因为cos(π/6)=√3/2，` | Exact prose/formula row, cosine, fractions, equality and comma |
| 53-P3 row 3 | Line 74: `而且π/6∈[0,π]；` | Exact text, fraction, membership, closed brackets and semicolon |
| 53-C31 | Line 77: `图 31` | Exact separate caption; retained after first computation, not inside graph or formula |
| 53-P4 row 1 | Line 80: second result plus `因为`, comma-ended | `1/2`, `π/3`, both equalities, cosine and comma match; `arc cos` gap discrepancy |
| 53-P4 row 2 | Line 81: membership, semicolon-ended | `π/3∈[0,π]` and `而且` match; no synthetic additional row |
| 53-P5 row 1 | Line 84: third result plus `因为`, comma-ended | `√2/2`, `π/4`, both equalities, cosine and comma match; `arc cos` gap discrepancy |
| 53-P5 row 2 | Line 85: membership, semicolon-ended | `π/4∈[0,π]` and `而且` match |
| 53-P6 | Line 88: fourth result plus `因为`, comma-ended | `0`, `π/2`, both equalities, cosine and final comma match; `p open`; no invented next membership row; `arc cos` gap discrepancy |
| 53-F | Line 91: `· 47 ·` | Footer and both flanking dots retained; no task identity |

Author page JSON has the same ten blocks and matching literal arrays. The introduction and first computation are one closed `p` with four physical rows, whereas Stage A described the introduction and computation separately; this semantic grouping does not delete, duplicate or shift their source rows. The definition paragraph is `p open` for its seven rows, then figure, then `p cont` for `减函数.`. The first cross-page continuation and the final `p open` are distinct and correctly retained.

No denominator was split into an additional source row. No blank body row, fabricated `↵`, duplicate example, empty exercise block, new task number or candidate-only source paragraph appears. The 20 author literal rows correspond to the complete Stage A row inventory including the separate caption and footer; this content observation does **not** supersede the saved official printed-line observation of 19.

### Glyph, Punctuation And Emphasis Limits

- Mathematical signs, fractions, radical contents, memberships, `x/y/n` case, `D/E/Z` case, `cos` versus `sin`, all visible closed intervals, and all table half-open brackets were checked. No mathematical replacement was needed to reconcile them.
- The first source computation's `=` is read from its two visible horizontal strokes, not inferred from the known values.
- Displacement accent: directly observed bottom mark is a bar; first-paragraph accent discrimination has the limited evidence stated above.
- `arc cos` spacing is a genuine visible spelling distinction in this strict literal review. The eight author occurrences use the collapsed token: two at MD line 59, one each at 61, 62, 72, 80, 84 and 88.
- Stage A's mathematical delimiters around graph-reference numerals and author's ordinary-text numerals are encoding choices; the same visible numerals are present.
- Chinese/ASCII parentheses, comma and colon codepoint widths cannot be authenticated from raster bytes as original encoded characters. Their visible punctuation roles are preserved; no false source error is invented solely from the chosen Unicode codepoint.
- Source flanking page dots are retained. Their precise typographic dot codepoint is not inferred from raster pixels.
- `反余弦` is preserved as the known emphasized defined term. Precise additional emphasis around `反函数叫做`, the page-52 closing assertion and the page-53 opening row remains **UNKNOWN** where scan weight does not settle it. No additional full bold span is demanded from an overconfident Stage A reading.

## Complete Table And Figure Comparison

The four official PNGs were opened individually, once each, at original detail. Their byte bindings are in the current-files table. Each is a single source object, not a reconstructed diagram.

### Coarse/Snapped Geometry And Actual PNG Dimensions

| Object | Stage A coarse box | Author pre-finalize box | Saved official snapped box | Actual PNG dimensions |
| --- | --- | --- | --- | --- |
| Table 52-T | `[165,245,1220,425]` | `[160,240,1230,435]` | `[169,246,1215,419]` | 1239 x 443 |
| Graph 29 | `[345,715,865,405]` | `[345,715,865,405]` | `[354,714,845,406]` | 869 x 430 |
| Graph 30 | `[120,1590,1285,310]` | `[115,1590,1290,315]` | `[122,1599,1272,297]` | 1296 x 321 |
| Graph 31 | `[1005,930,455,515]` | `[1000,925,460,530]` | `[1017,939,435,512]` | 459 x 536 |

The author boxes are reasonable coarse envelopes of the same frozen objects, not different content boundaries. Actual PNG width/height exceed the respective recorded snapped width/height by 24 pixels each; visible surrounding margins are present. Do not assume a snapped-box dimension is the saved PNG's full canvas dimension. This metadata difference did not reveal missing source strokes.

### 52-T: Every Main Cell And Attached Cell

| Source row | C1 | C2 | C3 | C4 | C5 | C6 | Official crop comparison |
| --- | --- | --- | --- | --- | --- | --- | --- |
| R1 | `x` | `-π` | `]-π,0[` | `0` | `]0,π[` | `π` | All six cells and interval end brackets present |
| R2 | `cos' x` | `0` | `+` | `0` | `-` | `0` | All six present; prime after `cos`, before `x`, not silently relocated |
| R3 | `cos x` | `-1` | Up-right arrow | `1` | Down-right arrow | `-1` | All six present; both directed arrows and values retained |
| Lower attachments | No cell | `极小值` | No cell | `极大值` | No cell | `极小值` | Three individually boxed cells only; no invented blank fourth-row cells |

The main lattice is exactly three rows by six columns: 18 populated cells plus three populated attached boxes. Unequal column widths remain. All four main exterior sides, two row dividers, five column boundaries and three attached left/right/bottom box outlines are present. Uneven seams/border strokes remain the source drawing, not tidied geometry. No dashed table border, removed tab, manufactured empty answer cell, source grid background or table caption was added. The author note inventory agrees cell by cell.

### Graph 29

- One thick **solid** arch-shaped curve; one horizontal and one vertical axis.
- Horizontal axis has its right arrow, vertical axis its upper arrow and plain lower tail.
- Labels `x`, `y`, `-π`, `-π/2`, `0`, `π/2`, `π`, `1`, `-1` all retained with their original offsets.
- Single central high position near labelled `(0,1)`, two lower terminal regions near `(-π,-1)` and `(π,-1)`, and two horizontal crossings near the labelled half-pi positions.
- The left crossing remains to the left of its nearby `-π/2` label/tick; right-side registration is also preserved. No analytic alignment correction.
- Both actual curve ends, all visible ticks, arrowheads and axis tails remain in the crop.
- No source background lattice, extra curve, reflection line, named point or separate series of point dots.
- No clearly separate hollow/filled endpoint circles. Endpoint-marker closure **UNKNOWN**; thick terminal ink must not be reclassified as an invented closed dot.
- Caption `图 29` is separate MD/JSON text and absent from the official figure PNG.

Every label, stroke type, extremum/end region and crossing from Stage A's inventory is accounted for. No confirmed clipping or instructional omission.

### Graph 30

- One thick **solid** extended wave trace; two coordinate axes, upper/right arrowheads and plain lower vertical tail.
- Horizontal labels, left to right: `-2π`, `-\frac{3}{2}π`, `-π`, `-π/2`, `0`, `π/2`, `π`, `\frac{3}{2}π`, `2π`, `\frac{5}{2}π`.
- Vertical labels `1`, `-1` and axis names `x`, `y` retained.
- Exactly the frozen visible landmarks: three summits near the `-2π`, `0`, `2π` labels; two troughs near `-π`, `π`; five horizontal crossings near the five half-pi labels. Original crossing/label offsets remain.
- Both outer trace terminations remain: left of the `-2π` summit and right of the five-halves-pi crossing. Neither exact terminal coordinate is printed; both exact coordinate pairs remain **UNKNOWN**.
- No extension to an imagined `-5π/2` or `3π`, no manufactured endpoint marker, sampled point series, dashed replacement curve or background grid.
- Fraction glyph layout is resolved by this official crop: `π` lies to the right of the small `3/2` or `5/2` fraction, rather than being part of its numerator.
- Caption `图 30` remains separate and is absent from the official figure PNG.

All Stage A instructional labels/strokes/landmarks are present. Source coordinate labels are not a warrant to replace the imperfect drawn registrations.

### Graph 31

- One thick **solid** descending trace, from the labelled upper-left `(-1,π)` region, through the vertical-axis neighbourhood `(0,π/2)`, to lower-right `(1,0)`.
- Axes and labels `x`, `y`, `-1`, `0`, `1`, `π`, `π/2` retained.
- Exactly two **dashed** guides: horizontal from the upper-left region to the vertical axis at `π`; vertical down to the horizontal axis at `-1`.
- All six frozen landmarks accounted for: the three curve landmarks, axes origin `(0,0)`, upper guide/axis meeting `(0,π)`, and left guide foot `(-1,0)`. The latter three are not converted to curve points.
- Upper-left and lower-right terminal regions are the highest/lowest visible curve positions; no interior extremum or extra sample point was introduced.
- Vertical axis upward arrow and lower plain tail; horizontal axis right arrow retained.
- No clearly separate hollow endpoint ring or independent filled endpoint dot; graph-marker closure remains **UNKNOWN**.
- No diagonal `y=x`, mirrored cosine curve, frame, source grid or unprinted coordinate label was added.
- `图 31` remains separate caption text outside the official figure PNG. The authorized text crop confirms its lower-right position relative to the example.

Author figure notes and the actual PNG agree with the frozen source inventory; no confirmed clipping or added instructional geometry.

## Ownership, Number Roles And Continuation

| Item | Independent comparison |
| --- | --- |
| Ordinary lesson/card | `ana10-c6-s3-n86`, already started on physical 51; no title repeated on these pages |
| TOC title | Identity only; not proof that future equation material appears or that the lesson is complete |
| Prior paragraph | Supplied closed text ends `表里.`; page 52 correctly begins with the table, not invented continuation prose |
| Table and graphs | All four prose-owned; figure JSON `owner_exercise: null`; no inferred nearest-example owner |
| Graph numbers | 29, 30, 31 are references/captions, not exercise numbers |
| Footer numbers | 46, 47 are printed pages, not tasks |
| Prior 146 | Not present as a new task here; not used to infer a new exercise range |
| Exercise numbering scope | Not declared in the matching source-manifest entries inspected for identity; remains **UNKNOWN** |
| Page 52 P1 | Closed four-row paragraph |
| Page 52 P2 -> page 53 P0 | `open` -> `cont`; `正弦曲` + `线向左移动π/2.` joins and closes correctly |
| Page 53 definition | Seven rows `open`, figure transparent, one row `cont`; no text omitted |
| First three computations | Body computations, not standalone exercises/cards; complete visible semicolon endings retained |
| Fourth computation | One visible comma-ended row remains `open`; next interval condition **UNKNOWN**, not fabricated |
| Unit 86 boundary | Right boundary still unseen and **UNKNOWN**; no later subject or next-card/page used to complete it |

Caption/prose physical positioning is preserved as source facts without forcing the caption into a formula or exercise. The review does not assemble or publish any object.

## Crop Commands And Evidence Limits

The six author crop records were fully read as evidence. They describe the same read-and-save operation, not an operation executed by this reviewer:

```text
argv[0] W/.claude/skills/ld-s10y-lesson/.venv/bin/python
argv[1] -c
argv[2] from PIL import Image; import json,sys; b=json.loads(sys.argv[3]); Image.open(sys.argv[1]).crop((b[0],b[1],b[0]+b[2],b[1]+b[3])).save(sys.argv[2])
argv[3] W/.tmp/ld-s10y-lesson/10c/pages/<0052 or 0053>/page.png
argv[4] E/cropviews/<name>.png
argv[5] JSON [x,y,width,height] from the table below
cwd W
```

Each saved command has exit 0, no signal/spawn error, and zero-byte stdout/stderr. Their streams' bytes were included in the 185-file binding checks. Source hashes equal the respective raw page hash in the current-files table.

| Saved crop command | Source box | Start UTC | End UTC | Record SHA-256 |
| --- | --- | --- | --- | --- |
| `52-table.json` | `[150,230,1260,450]` | 12:41:49.225 | 12:41:49.282 | `9737cb44fc909bf41a55f93dfbe1c199bd5094007d5c06f86b7ab59c9e57bbe4` |
| `52-middle.json` | `[120,1200,1290,795]` | 12:41:49.233 | 12:41:49.290 | `920c39e71fb9961f1586b285c8cf119ed4b9217041920dc24e23c38b4e97c886` |
| `52-bottom.json` | `[120,2000,1290,235]` | 12:41:49.349 | 12:41:49.395 | `eac0e4e5c3a36b9b45b5084d94f421ed5f3c21258e3ca2157e8d4a5f30f1e515` |
| `53-top.json` | `[210,245,1300,760]` | 12:42:49.141 | 12:42:49.224 | `65f0f893f23ea92f9fcc9d37fa2468c355f1ac12c69bd7177ca9131b97221865` |
| `53-graph-example.json` | `[210,925,1250,595]` | 12:42:49.152 | 12:42:49.220 | `bf18db48402c12da8afb32560cd36793c0eed7168212a2e20d335ac4af9b851e` |
| `53-bottom.json` | `[210,1530,1050,690]` | 12:42:49.148 | 12:42:49.219 | `c46c7622096479ab60068c124f3e82896d8579f3aa0704048adba30825ea962a` |

All times in this table are 2026-11-16 UTC. This reviewer opened only the two text PNGs explicitly authorized for Stage B, not the other four author text crops.

The author reports its own 8/8 image batch closed. That ledger was read as text; it was not imported as eight images into the reviewer context. No author image payload was received from or sent to another chat.

## Reviewer Image Ledger And Stop

This ledger combines the immutable two Stage A original opens with exactly six unique Stage B opens. All were requested separately at `detail: original`. Hash-only reads of PNG bytes are not visual opens.

| Reviewer index | Stage | Exact image path | Dimensions | Full SHA-256 | Opens |
| --- | --- | --- | --- | --- | ---: |
| 1 | A | `W/.tmp/ld-s10y-lesson/10c/pages/0052/page.grid.png` | 1695 x 2580 | `964d1247b2893c53055048ba9ff932fa1f9e05b3385218dac6a8c1378e686259` | 1 |
| 2 | A | `W/.tmp/ld-s10y-lesson/10c/pages/0053/page.grid.png` | 1695 x 2580 | `8680f79bf3ad3b6d84cb669132007afbf4383acc21c5559567a042f4b7dce63e` | 1 |
| 3 | B | `W/.tmp/ld-s10y-lesson/10c/pages/0052/figures/tbl-p0052-01.png` | 1239 x 443 | `f3204abc7d5087643081ca3adf6aafa62ab9b4efdf111da44009d44daec54b18` | 1 |
| 4 | B | `W/.tmp/ld-s10y-lesson/10c/pages/0052/figures/fig-29.png` | 869 x 430 | `48f19879d744350c9124b35e2b67e128ed904b1aef37a384ded18effc37b3507` | 1 |
| 5 | B | `W/.tmp/ld-s10y-lesson/10c/pages/0052/figures/fig-30.png` | 1296 x 321 | `99cc99b3c5a41a13d32267b7cfa51539721d20eae7e40b8c9b8fff911b0c3c78` | 1 |
| 6 | B | `W/.tmp/ld-s10y-lesson/10c/pages/0053/figures/fig-31.png` | 459 x 536 | `2b05456fab7d9a0e9be3e28eb534c84d155de88166339c4b4e56e666c6c76f11` | 1 |
| 7 | B | `E/cropviews/52-bottom.png` | 1290 x 235 | `bbc7585ab72020d734f9dc8fe0c8689f1c001f44ccf6bacb086b59a0b4448fd7` | 1 |
| 8 | B | `E/cropviews/53-graph-example.png` | 1250 x 595 | `8c7fc9d0101270a613f84ae900b077f449efd0aa0304117b2db5300fd8c3e4e8` | 1 |

**Final budget: 8/8 batch, 8/24 context. No ninth image.** Stage B used exactly four official figure PNGs and two existing text crops. Neither original page was reopened. No new crop was created. No remaining context capacity is treated as permission for a ninth batch image.

Remaining limits are explicit: first-paragraph accent discrimination where the new crop does not reach; uncertain additional emphasis spans; exact raster-to-Unicode punctuation widths; endpoint-marker closure; unlabelled graph-30 terminal coordinates; mechanical cause of the 19/20 mismatch; and unit 86's right boundary. None is filled from mathematical expectations.

This report is textual evidence only. It contains no image payload, edits, counter result, retry result, repair, downstream artifact or claim of publication. **STOP after returning this report's path, SHA-256 and budget.**
