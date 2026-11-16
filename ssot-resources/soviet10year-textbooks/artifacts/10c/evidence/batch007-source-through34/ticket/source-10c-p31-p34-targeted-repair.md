# 10c p31-34: authorized smallest affected source-author repair

## Role and disposition

STEMROBIN-184 worker B is the source author, not Dalton's independent reviewer. This implements only the parent's authorized representation repairs F31/F33 and uncertainty-note additions U33/U34 after Dalton's sole StageB report. No whole-page/source/image review was repeated. Current author outputs are stopped immutable for the same Dalton changed-only review.

The authorized reviewer report was read; its frozen observations are reused. No original page, grid or crop was visually reopened. No mathematics, source glyph or image relationship was re-solved. Mechanical exit0 below is not independent source approval, and U33/U34 remain UNKNOWN.

## Complete old evidence preserved before editing

New complete pre-repair copies are under:

`.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p31-p34-targeted-repair-evidence/before/`

They include all four current durable MD/JSON/audit triples, all five crops, prepared full PNG/grid/template/layout bytes, first author-before-finalize MD, all first stdout/stderr/command records, the immutable author report, Dalton's StageB report and the initial output manifest. Page32 was copied solely as an unchanged-byte guard; it was not edited/finalized.

The original full evidence directory `source-10c-p31-p34-evidence/` and original author/reviewer reports remain untouched. Original p31 FAIL still exists there and in the new before copy: exit1, 9/9, `白名单外字符 1 处: ►(U+25BA)`. Its stdout raw SHA is `40e7e7f6bdee1d09a8a94ea7e03abf7a9fae3f12f212d41f0187a6ad3c0e6c12`; its audit raw SHA is `1ba56035250e597c150143a6a10d9345bbf91aa6d67c7d2e8f4b95f9eb68e062`. No failure file was overwritten or relabelled PASS.

## Exact manual changes

1. `p0031#5`, first existing row: only leading `►` became `$\blacktriangleright$`. Following prose and all row breaks are unchanged. This preserves the frozen filled-right-marker role and mirrors the already accepted closing `$\blacktriangleleft$` on32, without assigning the scan a recoverable Unicode font codepoint.
2. `p0033#12`, first existing row: only prefix `68.* ` became `$68^{*}$. `. The source superscript star and baseline separator period now have separate roles. `<!-- ex 68 -->`, four rows, all four transformations and both requests are unchanged.
3. Only one note appended to33: tasks64/65, `p0033#8/#9`, have a frozen v-like lowercase function name unresolved between Latin v and Greek nu. Current `v` is explicitly provisional and unchanged.
4. Only one note appended to34: `p0034#4`, third printed row, has the unresolved 需/须 in current “无需烦琐”. Current 需 is explicitly provisional and unchanged.

All previous notes remain verbatim. No erratum, count exclusion, expected-line override, new row, formula correction, image/crop repair, source wrapper or boundary change was added.

## Strict affected-only binding

Before finalize, the failing-capable MD comparison allowed exactly two body-line substitutions and two notes appended. All other frontmatter/body content was equal; physical body line counts were equal; original JSON/audit bytes were still unchanged. Exact diff is retained in `pre-finalize-diff.json`; complete edited MD before the command is under `authored/p0031`, `authored/p0033`, `authored/p0034`.

After finalize, the full current page JSON was deeply equal to the old page JSON after applying exactly these expected differences:

| Page | Exact JSON paths changed | Audit difference |
| --- | --- | --- |
| 31 | `/blocks/4/lines/0` | `unknown_chars` and `errors` become empty |
| 33 | `/blocks/11/lines/0`, append `/meta/notes/6` | Byte-identical to before |
| 34 | append `/meta/notes/7` | Byte-identical to before |
| 32 | None | Entire MD/JSON/audit triple byte-identical |

Each finalized MD is byte-identical to its edited-before-finalize MD, and MD frontmatter matches JSON meta. All other blocks, task identities, source bindings, formulas, conditions, tags, existing notes, flags, open/cont/samerow, image links and figure metadata are deeply unchanged.

Original full PNGs/grids/templates/layouts remain byte-identical. Every figure audit record, snapped/rough box and complete crop byte sequence remains identical. This is a scoped byte/metadata assertion, not a new image or counting review.

Complete before/after strings, changed paths, current hashes, stdout hashes and crop bindings are retained in:

`.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p31-p34-targeted-repair-evidence/strict-changes.json`

## Actual commands and results

Only the following three actual official commands ran, each once for this affected repair:

```bash
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 31
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 33
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 34
```

| Page | Current pixel/MD rows | Actual repair exit | Other actual result | New stdout raw SHA-256 |
| --- | --- | --- | --- | --- |
| 31 | 9/9 | 0 | 7 blocks, 2 crops, 0 normalizations | `cb934ca7a84de86b46341f5591821253003427085b84c5f501f8088c28f5e94e` |
| 33 | 13/13 | 0 | 13 blocks, 1 crop, 0 normalizations | `70d8df860eb90c56212a25a4f981d49b76c31b54db8ef89d3ff89fcef84c1544` |
| 34 | 24/24 | 0 | 7 blocks, 0 crops, 0 normalizations | `2b122d7d0ea0c06ea9169903b7cd66d0d8acf87e9e360c0d916d6a5b996774bc` |

Each current audit has `errors=[]`, `unknown_chars=[]`, `count_exclusions=[]`. Empty unknown_chars means the chosen representation passes the mechanical character gate; it does not resolve source-font identity or U33/U34. All stderr files are empty, raw SHA `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.

New stdout/stderr/exact argv/cwd/actual exit are in `runs/pNNNN/`. The command wrapper refuses an already-existing run directory. No finalize retry or second source repair followed these results.

## Current durable raw hashes

Paths are under `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/NNNN/`.

| Page | page.md | page.json | audit.json |
| --- | --- | --- | --- |
| 31 | `971135934382d3175467bc80de13ee0fb6ca66e9eaf6bd00bb553ed8930bf5af` | `6b6a11822ef98166a6326fc6d64500050f2069dfc54df544703bb40e8f0aad81` | `1a68dc3d5c65512b74bcc0448de2a884631be9df8571bf6e5653cb900db87a2e` |
| 33 | `d7168b97252d852d1e3ce02f282b621c47bf5b569ce1a9e0eff29cc64fe2b34e` | `aafdc6520498b03a861d01bf366f1d8852578a567a1aceaf1efeb53fe8aba40c` | `7bfd1c95d2569330993b7b69ed30b783b774a5aae33e8e794a4536c046e67ccd` |
| 34 | `f83c9d61d1784f34b0b37eb2aa4a30581af632bfea43d7659f03f37effb2188e` | `fd0cf2c5527b25410865c22bb647da5d1c97e42627e3652770e51e2b2d5530a6` | `9efc1a89d59c7c26d55d31693e920ef885e412b4e1a6e3d12a83af3ad44bde6a` |

Untouched32 retains MD `587f2780ace9f893e11c231c92de84bf0a806fff10d79f32756e02f41bb4b903`, JSON `76d68f1c9e19cb7f59b0e2533c90337fe00ba596eba25abd476ffd93a04765b6`, audit `af2bc4f80101fb2bcc395257380819a53eb3f3ad9677dd8fb491adc3c3089d39`.

## Unchanged crop bindings

The five full crops were hashed only, not visually reopened. All exact boxes below, the original rough boxes and entire audit figure records are unchanged:

| Figure | Exact ink box [x,y,w,h] | Unchanged raw PNG SHA-256 |
| --- | --- | --- |
| 16 | [240,294,1212,321] | `31a56cd4f038577c8d24ce43ce1c2888c2e1aecd45183008cda39cdbe79577bd` |
| 17 | [477,731,780,841] | `2635c2d39c0b80b6e232ce9716e668a6a7d28f0ec5d1e94ac489bb7e4a7b148b` |
| 18 | [217,1306,1096,268] | `128bc913f07c26f427d77d931f0810df6ac01b908f6701372c868e53e973118e` |
| 19 | [142,1799,1238,317] | `0cbcd58f36f0eb90c458e5cb63da16c16e20e1d32f2ce7b9bc17994530641cdc` |
| 20 | [274,302,1167,620] | `458541c1db6511f9532eeccd1692304e9027c082eb89aab00b85d8a8c167321a` |

## Stop and remaining gate

Current triples/crops are copied in `after/p0031`, `after/p0033`, `after/p0034`; all initial files and complete old before bytes remain retained. No whitelist, tool, dependency, counter, exclusion, image/spec, source index, modern artifact, vectorize, assemble, Git, DB, browser, service or network change occurred.

Author repair is stopped immutable. F31/F33 await Dalton's same-scope changed-only review; U33's Latin-v/Greek-nu and U34's 需/须 remain honest UNKNOWN, not guessed away or represented as unconditional source PASS. This report does not authorize another repair or a whole-page review.
