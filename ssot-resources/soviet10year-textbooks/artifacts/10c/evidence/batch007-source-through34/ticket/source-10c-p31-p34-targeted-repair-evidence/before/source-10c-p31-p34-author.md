# 10c physical 31-34: immutable cap1 source-author handoff

## Role and scope

STEMROBIN-184 worker B is the source author, not the independent reviewer. Only physical pages 31-34 were authored, after their already-completed parent prepare operations. Dalton owns the sole independent source-first review; no Dalton file or observation was read.

Current lesson SKILL.md and source profile were read. Each full original PNG and its grid were opened separately before writing that page with apply_patch. Each generated original crop was then opened separately. No prepare was repeated. Each page received exactly one actual official finalize. This handoff is not independent approval or a complete lesson/batch claim.

The earlier choice-author role was closed immutable before this work began and was not reopened. Pages 7-30, their unresolved issues, book/edition indices, tools, dependencies, modern text/images, answers and choices were not changed. No assemble, vectorize, index promotion, Git, network, browser, app, DB, service or other-chat operation occurred.

## Actual source and physical/printed identity

The actual uniquely located PDF is:

`ssot-resources/soviet10year-textbooks/sources/soviet10years/10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`

Actual `shasum -a 256` result: `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`, agreeing with all four prepared source bindings. Each page is 1695x2580 at prepared 300 dpi. Actual observed folios are physical31=printed25, 32=26, 33=27, 34=28; this mapping came from these scans, not another book.

| Physical page | Full original PNG raw SHA-256 |
| --- | --- |
| 31 | `b2856ca9834afd57d5601063a70542c97622853e8523509825660a09763ab925` |
| 32 | `e39cf79620b4dc3893705be0518cf6a8829dd109b2d59a99224687f31804bcce` |
| 33 | `1c33b9c2eb95900dd1077b31011517f5dbf06922371aaf2955fc1ac3c4c75c35` |
| 34 | `a222c82da6a63df836b245a25c8075fe03f5c20ec538aaa9d61f33d80e61d1de` |

All four grids, templates, layout inputs and author-before-finalize MD bytes are retained in `tmp/source-10c-p31-p34-evidence/p0031..p0034/before/`. `page-bindings.json` contains their full raw hashes; the authoritative structured object/flag inventory for this handoff is `object-boundaries.json`, derived from actual page JSON `meta`/`blocks`, not the provisional abbreviated block list in `page-bindings.json`.

## Independently observed author row facts and first actual results

These row counts were recorded after seeing the scans and before finalize. They were not inserted as manual expected counts or inferred from machine line bands. All `count_exclusions` remain empty.

| Page | Actual author row decomposition | Observed total | Actual pixel/MD | First exit | First result |
| --- | --- | --- | --- | --- | --- |
| 31 | Two prose/formula objects 4+2; captions 1+1; folio 1 | 9 | 9/9 | 1 | FAIL: one unsupported source-marker character |
| 32 | Prose/formulas 2+3+5; captions 1+1; folio 1 | 13 | 13/13 | 0 | Mechanical PASS |
| 33 | Caption 1; exercise header/common instruction 3; four paired exercise rows; ex68 four rows; folio 1 | 13 | 13/13 | 0 | Mechanical PASS |
| 34 | Title 1; prose/formula objects 4+3+8+5+2; folio 1 | 24 | 24/24 | 0 | Mechanical PASS |

All four actual finalize reports record zero normalizations. Page34's proof object has four stored MD lines plus one real `↵`, hence five printed rows. Parallel expressions in one row are not separate printed rows. High fractions are preserved within their actual rows. No text was deleted/duplicated or manually padded to satisfy counting.

### Unresolved p31 character FAIL

Actual audit error: `白名单外字符 1 处: ►(U+25BA)`. Audit identifies the fifth block as `p#5`; stable page location is `p0031#5`, its first printed line near x330/y1700. The scan has a filled right-pointing paragraph marker, retained as `►` in this first author draft. The failure is not a line-count discrepancy. Full first MD/JSON/audit/stdout are retained unchanged, and no character replacement or second finalize was attempted.

The analogous visible left-pointing end marker on page32 was authored as `$\blacktriangleleft$`, preserving its direction/fill on the same printed line. This does not repair or approve page31. Parent may coordinate the smallest source-faithful representation change after review; no profile/whitelist change is proposed or performed.

## Objects and real boundaries

### Physical31 / printed25

Seven objects: fig16/caption, fig17/caption, two complete prose objects, folio. Both figures are the illustrations explicitly referenced by the preserved physical30 example2 text; no empty `p cont` was invented. The first prose object retains the right-pointing marker, the third transformation rule, y=cos x, the 1:(1/omega) compression, and cos(omega x). The second retains right/left directions under phi<0/phi>0 and displacement |phi|/omega, with both original printed lines.

Both prose objects end with actual source sentence periods; there is no textual open/cont fragment at this page edge. This continues n81 but is not by itself its closure.

### Physical32 / printed26

Eight objects: three complete prose objects, fig18/caption, fig19/caption, folio. The first retains k=1/A and the left-pointing completion marker. The three-row summary retains all three transformations, including r=(-phi/omega,0); the third step's Ox continuation starts the next real row. The full five-row example3 retains 3cos(2x+4), all three operations and references to figures18/19/20.

The example text ends on this page. Figure20's pixels are on page33, already explicitly referenced here; no empty text open/cont is needed.

### Physical33 / printed27

Thirteen objects: fig20/caption, one three-line exercise heading including the complete common request, nine separate exercises60-68, folio. The right-column exercises61/63/65/67 have `samerow=true`, preserving four actual horizontal rows rather than eight. Source variable identities f/g/v/F, exact fractions, trigonometric arguments and original periods remain.

Exercise68's star is retained as `68.*`; its four real rows retain all four transformations and both requests. The physical vertical placement of the star is a pixel fact; no new mathematical meaning or answer was assigned. This page ends all shown exercises with their actual source punctuation. None is marked open.

### Physical34 / printed28

Seven objects: title `82. 同周期的谐振动的合成`, five prose/formula objects, folio. No figure or exercise block is present. The source's general two-term expression, same-frequency condition, A/phi discussion, numbered formulas(1)/(2), f1/f2, k=omega² and complete differential-equation sum proof remain. The long proof equality breaks after -kf2(t) with one `↵`; the next printed row begins the next equality.

Source references to exercises260 and70 are retained as prose; those tasks/answers were not opened or solved. The final paragraph ends with a sentence period, so no textual `open` remains. However n82 is only started, not complete; no source or modern index was expanded.

## Original figure crops: whole apparatus opened

All crops are official finalize outputs under `.tmp/ld-s10y-lesson/10c/pages/NNNN/figures/`. Complete bytes also remain in the corresponding evidence `after/crops/`; no crop was edited or promoted.

| Figure / page | Author rough box [x,y,w,h] | Actual snapped ink box | Crop raw SHA-256 |
| --- | --- | --- | --- |
| 16 / 31 | [230,280,1250,350] | [240,294,1212,321] | `31a56cd4f038577c8d24ce43ce1c2888c2e1aecd45183008cda39cdbe79577bd` |
| 17 / 31 | [470,720,790,865] | [477,731,780,841] | `2635c2d39c0b80b6e232ce9716e668a6a7d28f0ec5d1e94ac489bb7e4a7b148b` |
| 18 / 32 | [200,1295,1135,300] | [217,1306,1096,268] | `128bc913f07c26f427d77d931f0810df6ac01b908f6701372c868e53e973118e` |
| 19 / 32 | [130,1790,1280,345] | [142,1799,1238,317] | `0cbcd58f36f0eb90c458e5cb63da16c16e20e1d32f2ce7b9bc17994530641cdc` |
| 20 / 33 | [270,290,1180,650] | [274,302,1167,620] | `458541c1db6511f9532eeccd1692304e9027c082eb89aab00b85d8a8c167321a` |

- Fig16: both complete solid/dashed cosine curves, both axes/arrows, x/y, circular origin glyph, -pi/pi/2pi, and both function labels remain.
- Fig17: complete dense solid oscillation and dashed reference, both axes/arrows, x/y, circular origin glyph, -1, pi/10, pi/5, both function labels remain. No new claim about physical measured amplitudes or exact source stroke count is made.
- Fig18: complete solid/dashed curves, axes/arrows, y, circular origin glyph, pi/2pi and y=cos2x remain. The original crop has no invented x label.
- Fig19: complete solid/dashed curves, axes/arrows, x/y, circular origin glyph, -2 and its vertical dashed guide, y=cos(2x+4) remain.
- Fig20: complete solid/dashed curves, axes/arrows, x/y, circular origin glyph, 3 and its short horizontal dashed mark, left peak's vertical dashed guide, y=3cos(2x+4) remain.

The circular origin marks are retained in pixels; no 0/O codepoint is assigned by familiarity. Captions remain outside each crop. The first attempted lookup of a p31 crop in durable `pages/0031/figures/` was absent; the actual official scratch crop was subsequently located and opened in full. This was not treated as a missing source image.

## Noise / uncertainty

Source notes retain the observed page-edge facts without exclusions: page31 upper/bottom fine traces and left-margin specks; page32 the prominent right-edge trace approximately x1640-1680/y2090-2320 and boundary lines; page33 upper/bottom fine lines and left-edge specks; page34 right-edge dots near x1590-1608/y635,830,1367,1564 and lower trace near y2480. None was rewritten into source prose or used to override counting.

No new confirmed mathematical erratum was registered. Source26's unresolved notation/signs and previous source uncertainties remain out of scope. No next-page formula was used to guess them. No literal Cyrillic subpart marker appears on these four scans; exercise68's four numeric subparts were preserved rather than converted to an invented alphabetic sequence.

## Exact durable output hashes

Files are under `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/NNNN/`.

| Page | page.md raw SHA-256 | page.json raw SHA-256 | audit.json raw SHA-256 |
| --- | --- | --- | --- |
| 31 | `2bdfd23268db2c253d5e103b5cad5ca635bff5b0988381677c8f921befd5ffc3` | `d20b1080f9ff06bfdb5d52e4a41d2e33f56dbf7781aef24db15604d07cd2db2e` | `1ba56035250e597c150143a6a10d9345bbf91aa6d67c7d2e8f4b95f9eb68e062` |
| 32 | `587f2780ace9f893e11c231c92de84bf0a806fff10d79f32756e02f41bb4b903` | `76d68f1c9e19cb7f59b0e2533c90337fe00ba596eba25abd476ffd93a04765b6` | `af2bc4f80101fb2bcc395257380819a53eb3f3ad9677dd8fb491adc3c3089d39` |
| 33 | `4158fecf2ce0c793338a273d6a431252e88842382b5b6fc76cf395c09b6d5620` | `8aa6a23f1f73281e81890fc3671a2624b0693662acb7064a70c9e8bbea1439b7` | `7bfd1c95d2569330993b7b69ed30b783b774a5aae33e8e794a4536c046e67ccd` |
| 34 | `0defdfb0204d514223fc5aedf979b4371dd0569d424d879a55ab579a31c7d21e` | `e6a1fa4c5e0817d657cddd0d7c9d2d0d5e83b9fa8b4faa873299313ddef48081` | `9efc1a89d59c7c26d55d31693e920ef885e412b4e1a6e3d12a83af3ad44bde6a` |

All current durable page bytes and crop bytes were compared to their complete retained first-output snapshots. This is a hash/byte binding check, not another finalize, row-counter run or independent source review.

## Actual commands and retained first stdout

Each command below ran once, sequentially after authoring its own page; no flag supplying an expected count or exclusion was used:

```bash
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 31
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 32
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 33
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 10c --page 34
```

The wrappers captured the real child status, stdout, empty stderr and exact argv/cwd in each `pNNNN/command.json`, and refused a repeated run if the evidence directory existed. Page31's actual first failure is preserved, not relabelled PASS.

| Page | First stdout raw SHA-256 |
| --- | --- |
| 31 | `40e7e7f6bdee1d09a8a94ea7e03abf7a9fae3f12f212d41f0187a6ad3c0e6c12` |
| 32 | `300ab2b7ba6b25dd2c52f05b5a00ad55b77d7a46e0c28f1137657fb3e925c829` |
| 33 | `70d8df860eb90c56212a25a4f981d49b76c31b54db8ef89d3ff89fcef84c1544` |
| 34 | `2b122d7d0ea0c06ea9169903b7cd66d0d8acf87e9e360c0d916d6a5b996774bc` |

All stderr files hash to `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. Complete prepared inputs, initial author drafts, first output MD/JSON/audit/crops and first stdout/stderr are retained, not merely hashes.

## Stop

This source-author batch is stopped immutable. The p31 character FAIL and Dalton's independent source gate remain outstanding; p32-34 mechanical success is not independent approval. No additional source batch or closure/promotion action is authorized by this report.
