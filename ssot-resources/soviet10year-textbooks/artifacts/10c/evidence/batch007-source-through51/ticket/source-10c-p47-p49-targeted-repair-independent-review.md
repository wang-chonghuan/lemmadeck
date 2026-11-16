# 10c physical 47-49: sole targeted independent review

2026-11-16; STEMROBIN-184; Codex, independent targeted reviewer, not the repair author.

**LIMITED PASS** for only the declared literal repairs on 47/49 and bottom scan-noise counting exclusions on 48/49. This is not a new full-source review, mathematical gate, whole-unit approval, or promotion authorization.

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Below, `T` means `.intentfold/tickets/STEMROBIN-184/tmp/`, `E` means `T/source-10c-p47-p49-targeted-repair-evidence/`, and `D` means `ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`. Resolve all paths against this workspace. JSON pointers are zero-based.

## Reused Inputs

Read the entire sole Stage B report before reading the targeted AUTHOR report. All three supplied SHA-256 bindings match:

| Input | SHA-256 |
|---|---|
| `T/source-10c-p47-p51-independent-review.md` | `95276911747d2ce7d6e60deeb465b07ee21534dfb37b894b2f19bf6576dd2043` |
| `T/source-10c-p47-p49-targeted-repair-author.md` | `24edaa291362d380acf5a93293a88da78f7f209a2854aaffab131d30e015d397` |
| `T/source-10c-p47-p49-targeted-repair-manifest.json` | `9306ab3d488192c8f0e8deb64ea9ba77ab4c9da765406456d77ba83431852111` |

Stage B's complete source observations are reused, not regenerated or revised. Its first REVISE remains historical evidence. No Stage A/full-source report or source page was newly opened to repeat that gate.

## Exact Targeted Comparison

Independently read raw before/after diffs for all three affected MD/JSON/audit triples. Those diffs contain only the following declared changes and their recorded mechanical audit consequences:

| Reference | Before -> after | Judgment |
|---|---|---|
| 47 `/blocks/2/lines/1` | U+FF0C comma -> U+002E ASCII period immediately after the expression and before tag `(3)` | PASS against reused Stage B. Expression `$x=-\arcsin a+\pi(2m+1)$`, spacing, and shared tag row are unchanged. |
| 49 `/blocks/9/lines/0` | `\sin x\geqslant0` -> `\sin x>0` | PASS, literal strict relation. Qualifier `(x\in Z)` is retained as printed, NOT changed to `n`. |
| 49 `/blocks/10/lines/0` | Qualifier `(x\in Z)` -> `(n\in Z)` | PASS. Interval endpoints, outward brackets, semicolon, strict `\sin x<0`, and source row are unchanged. |
| 49 `/meta/notes/1` | Claim that both qualifiers are `x` and property 6 has equality -> property 6 qualifier `x`, property 7 qualifier `n`, property 6 strict `>0` | PASS. The note still explicitly rejects a mathematical correction. |
| 48/49 `/meta/count_exclusions` | Add exactly one `scan-artifact` entry per page, box `[0,2470,1695,40]` | PASS on the independent native observations below; counting metadata only. |

All other MD/JSON bytes are unchanged in the saved comparisons, including property 4's colon, all other notes, body/header/flag fields, source/render/profile metadata, declared MD line counts, and empty errata/figures. Historical notes saying no exclusions were added in the original pass remain historical notes; source pixels are not edited. Page 48 has no body repair. Page 47's audit is byte-identical.

## Before/After Bindings

Every listed before and after hash was independently read from the existing file. Before triples also equal the retained `first-finalize/` triples and the original author's Stage B-bound manifest entries. Each current `D/<page>/<file>` matches its `E/<page>/after/<file>` hash. No current durable artifact was written by this reviewer.

| Page/file | `E/<page>/before/<file>` SHA-256 | `E/<page>/after/<file>` and current durable SHA-256 |
|---|---|---|
| `0047/page.md` | `8e0c392bc4157c7330f0ad52a48cbec1132eb3fa984038c89a336abc41ac5eae` | `ce70bd02f30b078cabc1b66590f4185d300fd3d9c3b73c95cf494feffe2a40e9` |
| `0047/page.json` | `412b6927625a654a1c34f3f4fef1a5128388d2389ce74fca6e92e8b5f639ff85` | `6a756a0e797c997b6aa39cf646feaf5b84210cccd6be5e478c7372c80dcddcbf` |
| `0047/audit.json` | `bdf9400e394d0e550df46e576d6d2728b33ad5ab66631352159c95deba54f94e` | `bdf9400e394d0e550df46e576d6d2728b33ad5ab66631352159c95deba54f94e` |
| `0048/page.md` | `09125599832b5431e1ca50d6d09090fa9173dfa649ff703f206cd046ba81e43f` | `439b5e76d5133d2149eef92eb507fc08bdc0b802ccb4c65cdc3ca889a0122030` |
| `0048/page.json` | `4f9793dbb39c2f3881b197ed290ea565b72f848067c2c9b7600aef021e04c6e6` | `fb13611816d968f20daec23f6676c95d024f157c677e520055261f73ef87adb8` |
| `0048/audit.json` | `74fc8682b079a4ef39e17a9d755e92b0701682e77fde6ec638b5eea616ba048b` | `dff326fee675e3f74e993b9a195ee903760139ddab43bb3607239ae0b862972a` |
| `0049/page.md` | `171f6e32bb2a6ba19c97db2b643b38f6a00628772c578af08784d44a59ea3b1f` | `c9832e51fa5c26010ac7664ca8a3c5ca9f6909f5b965b693a03e478e292d8dee` |
| `0049/page.json` | `80f0d39d4050b988e917996cc6f3acd8bd44c470690ed5d82449a1d55e616a89` | `c8daca0b911b3bd1aa93fd8c34220480e68ad2aa0f97b86a9c793050567c0e00` |
| `0049/audit.json` | `00d11f49ef546b1ef49151b302d0594cc2fabd9ffdd41749903c0034e8f809f1` | `fb7a5315c09da1cbbc262d417163b091122271e5ebb72786b02e21f333cdc76d` |

Existing `E/before.manifest.json`, SHA-256 `6feae229b594661b58c5a5516cdc6bb4d7bcfe68eb86451ea5b209818d3be26d`, binds the saved before/first evidence to its original paths. Existing `E/before-finalize.assertions.json`, SHA-256 `4eb96ced51aceea74be6fceb5dbcc4e22ab4de18414c722f23ce4f6c2af0480e`, and `E/after.assertions.json`, SHA-256 `6f9a9ffd65308bbd5c56d895d26ae676711d82157d6485dc4d152d8ade98264b`, were read as existing author evidence. Their 154 protected-file/40 snapshot assertions are not a fresh reviewer validator run or a new broad certification.

## Four Native Observations

Exactly four ORIGINAL NATIVE images were opened sequentially with `detail: original`, once each, in the order below. One batch: 4/8 images; total context: 4/24. Reopens, new crops, full pages, enhancements, annotations, and literal-repair glyph images: zero.

| Existing path | Source box `[x,y,w,h]` | Independently checked SHA-256 |
|---|---|---|
| `E/0048/bottom-noise-native.png` | `[0,2440,1695,100]` | `f66fee1c5cb08fa7f670d490f820398e62d1797b5162e790f1dd1f9cfbf96d58` |
| `E/0048/folio-native.png` | `[130,2240,200,90]` | `23c8d52a4da82d93a5a387473eb4389a8bab13bb315902d207d257d583b24c2e` |
| `E/0049/bottom-noise-native.png` | `[0,2440,1695,100]` | `929cb177af5cf10a67485761a918531579b730549697d98b2ff32d243b7472b7` |
| `E/0049/folio-native.png` | `[1320,2260,190,90]` | `e3698daa03cf7a5faffeca7604de42484c3e235e47c80d4b53c10851aa8801ea` |

Pixel-source binding reuses `E/native-strips.json`, SHA-256 `23aec8658d87ab983332afc338555fe9c4b43701f7d704d418fc38b172aa00a7`. Its existing `pixel_slice_exact: true`, `scaled: false`, `enhanced: false`, and `annotated: false` records come from the saved `strips.py` pixel-array equality check, whose source was read but NOT executed. This review independently matched the four strip hashes and both prepared source hashes to those records and to the first author manifest:

- `.tmp/ld-s10y-lesson/10c/pages/0048/page.png`: `8eb1aa42e0cc786c71103372aa2386eeb2ef830b9fe1620dd4c4fe84cc1bdd62`.
- `.tmp/ld-s10y-lesson/10c/pages/0049/page.png`: `cb49d65d37cc51ad24cafec30694929870870932aaef83bc92bb3fbd662d3fc7`.

The sources were read as file bytes for hashes, not opened as additional images. No fresh pixel-slice generation or equality validator was run.

**48:** The bottom strip contains a ragged, variably thick, interrupted edge trace that drifts downward toward the right, with tapering fragments and isolated specks. There are no glyph groups, formula components, labels, or meaningful printed separator in the exclusion rectangle. This is bottom-margin scan-boundary noise, not a body row. The separate folio strip visibly contains the complete `42` and both flanking dots.

**49:** The bottom strip contains a ragged thicker run through the left/central region that rises and thins into broken fragments toward the right. Its irregular edge/taper and position below the complete folio support scan-boundary noise, not a meaningful separator. There are no body glyphs, formula components, or folio marks in the exclusion rectangle. The separate folio strip visibly contains the complete `43` and both flanking dots.

For BOTH pages, `[0,2470,1695,40]` means half-open source coordinates `x=[0,1695)`, `y=[2470,2510)`, or inclusive pixels x0-1694/y2470-2509. Inside each bottom strip it is local x0-1694/y30-69. Thus the entire excluded rectangle was actually visible, with surrounding margin above/below. The isolated specks around source y2456 are above the box and remain outside it.

The saved counting diagnosis records 48's removed band at inclusive y2478-2498/x18-1645 and retained folio band y2263-2294; 49's removed band is y2484-2504/x86-1649 and retained folio band y2280-2310. These are existing count-band bounds, NOT newly measured all-ink pixel bounding boxes. The exclusion covers the trace and stays wholly below both folios and all body bands. Existing candidate evidence records the last body band ending at y2209 on 48 and y2235 on 49, unchanged prior body/folio bands, unchanged counting width/source ink, and no count override. The recorded margin guard boundary y2451 is also above the box; guard acceptance alone is not the visual reason for PASS.

## Recorded Results, Not Reruns

Read the existing first and targeted command/result/output/audit records; no command was replayed. First FAILs remain FAILs in `E/0048/first-finalize/` and `E/0049/first-finalize/`, with the same hashes as the preserved original records. Current successful audits are separate after artifacts.

| Page | Preserved first exit/status, MD/printed | Existing single targeted exit/status, MD/printed |
|---|---|---|
| 47 | `0 / PASS, 23/23` | `0 / PASS, 23/23` |
| 48 | `1 / FAIL, 19/20` | `0 / PASS, 19/19` |
| 49 | `1 / FAIL, 24/25` | `0 / PASS, 24/24` |

All three saved targeted commands declare `targeted_attempt: 1`; their results have exit 0, null signal/error, and empty stderr. After audits retain empty errors, normalizations, unknown characters, KaTeX warnings, and figures, with errata 0. These are existing mechanical results, not independent mathematical validation. No rows, formula breaks, expected counts, thresholds, counting tools, or source pixels were repaired by this reviewer.

## Remaining Limits And Stop

Targeted literal/exclusion UNKNOWN = 0 within this limited decision. Reused Stage B's current-range substantive literal UNKNOWN = 0 is not freshly recertified. Inherited physical 46's argument UNKNOWN = 1 remains untouched. Raster R/Z font and literal Unicode encoding remain uncertified; the historical source name is preserved, not externally verified. Unit 86, its absent future apparatus/figure 29, and material beyond physical 51 remain unreviewed. No mathematical erratum is inferred from the literal property 6 qualifier `x`.

Only this independent review file was created. No prepare/finalize/recount, validator, fresh gate, tool patch, override, source/authoring change, full-page view, new crop, browser/app action, Git, DB, other-chat action, downstream regeneration, promotion, or reversal of another agent's work occurred. Stop after this sole targeted limited PASS.
