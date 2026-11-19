# SOURCE235 FIRST Author Freeze

Native FIRST finalize and vectorize passed, each exactly once. This is an
author-only candidate, not independent SOURCE235 or RAW205 approval.
The assignment has a disclosed write-boundary deviation described below.
No source repair, repeated finalize, or dependent production followed.

## Ownership

- Scope: STEMROBIN-181/181-3; book 10p, physical source235 only.
- Sole explicit command cwd: `/Users/yong/.codex/worktrees/00b1/lemmadeck`.
- All authored files and native production outputs are below
  `/Users/yong/.codex/worktrees/00b1/lemmadeck/.intentfold/tickets/STEMROBIN-181/tmp/d845-source235-first-author/`.
- Only necessary `page.png`, `page.grid.png`, `layout.json`, and
  `page.template.md` were copied from successful d843 preparation, into own work.
  `inputs.json` binds their original/copy paths, sizes, hashes and prior receipt.
- Prepare calls: 0. No PDF, runtime, prior evidence package or prior-page image
  was copied; existing PDF and tools were read by the native pipeline.
- The shared checkout was already dirty and may have other active writers.
  No existing file was reverted, repaired, staged or committed by this author.
  This is not a claim that the whole shared checkout remained unchanged.

## Exact Boundary

The user's supplied prior234 paragraph closes at `即直线传播.`; there is no
incoming open object and its approval remains pending. No prior234 image
was opened. Its text/records were read only and not repaired or promoted.

`p0235#1 p`, one row, is independent and closed:

```text
同时，菲涅耳定量地研究了不同类型的障碍物的衍射.
```

`p0235#2 p`: seven rows, closes `奇啊！`.
`p0235#3 p`: four rows, closes `应该是很大的.`.
`p0235#4 p`: two rows, closes `细金属线的，б) 圆孔的，в) 圆形物的.`.
`p0235#5 fig` and `p0235#6 cap` follow this closed paragraph.

`p0235#7 p open`: three rows, starts
`显微镜和望远镜的分辨本领　光的波动性使得用显微镜`.
Its exact final row is:

```text
射使我们不能得到细小物体的清晰的像，因为光并不是严格
```

Outgoing object: exactly `p0235#7`, suffix `因为光并不是严格`.
Incoming open objects / cont flags / local interrupted paragraphs: 0 each.
Open flags: 1, outgoing. Source236 was not read, prepared, authored or inferred.
No cross-page assembly or lesson-closure claim was made.

## Counts And Inventory

- Physical page 235; printed page 225.
- Native reconciliation: 19 printed / 19 Markdown rows.
- 8 blocks: 5 p + 1 fig + 1 cap + 1 foot.
- Prose rows: 17 = 1 + 7 + 4 + 2 + 3; caption 1; footer 1.
- Headings, exercise headings, questions, subquestions, tables: 0 each.
- Two actual bold prose lead-ins are retained within p blocks:
  `不同障碍物的衍射图样`, `显微镜和望远镜的分辨本领`.
- Inline math spans, display formulas, formula wraps, errata: 0 each.
  No mathematics was invented from the plain year or figure number.
- `а` U+0430, `б` U+0431, `в` U+0432 are Cyrillic figure references,
  followed by ASCII `)` U+0029. The printed word `象` remains literal.
- Row 02 ends with the required ASCII join space after `情况.`.
- Native normalizations, unknown characters, KaTeX warnings, errors: 0 each.
- Exactly one local original figure: 图205 / fig-205, three source subfigures.
  No question or prior-page figure was fabricated.
- Pixel inventory: left vertical stripe/speckle field а, middle dark field with
  central bright/dark rings and dark centre б, right square-bordered concentric
  diffraction field with dark disk and tiny bright centre в.
- Author coarse box: `[250,1155,1090,480]`.
  Native snapped box: `[253,1158,1083,464]`; components: 1182.
  Default white padding: 12 px; actual PNG size: 1107 x 488.
- The actual native crop was opened: all three fields and source labels are
  present, with no visible adjacent prose or separate caption contamination.
  This is author observation, not independent source approval.
- Native vectorize: 1 pass / 0 fail; displayed mismatch 0.025%;
  native threshold 2%, tolerance 1 px. No second vectorizer, extra rasterizer,
  hand-edited SVG, padding override, masking or source/tool repair was used.

Original-first row/figure/codepoint inventory: `source-first-inventory.md`.
Actual image opens and crop observation: `actual-opens.after.json`.
Normalized structured row/block inventory: `root/10p/pages/0235/page.json`.
FIRST pre-normalization input: `author-first/page.md`.

## Actual FIRST

Both commands are the existing native `p2c.py`, using absolute `--root`,
`--work`, `--books`, `--book 10p`, `--page 235` and Python `-B`.
Exact arguments, cwd, environment, timestamps, runtime hash, stdout/stderr
hashes, before/after tool hashes and actual output snapshots are in receipts:

- `FIRST/finalize/receipt.json`: exit 0, signal null, error null;
  2026-11-19T00:14:41.461Z to 2026-11-19T00:14:41.760Z, 299 ms.
- `FIRST/vectorize/receipt.json`: exit 0, signal null, error null;
  2026-11-19T00:14:52.128Z to 2026-11-19T00:14:54.824Z, 2696 ms.
- Each FIRST directory preserves `started.json`, `stdout.txt`, `stderr.txt`,
  and `receipt.json`, written once with exclusive-create semantics.
- Finalize stdout SHA-256:
  `7a3000c354a2ee32742f4cb7427292172a794666066f36a73b06d6a5758f8c5e`.
- Vectorize stdout SHA-256:
  `2f99e0a8995c86ecaed126b25db4c04662e1034c7767349f4f3e2158c9000350`.
- Both stderr streams are empty, SHA-256:
  `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
- Actual Python executable SHA-256:
  `7fc33c67b5d5d91b3ce9ab16d2a354ad623f438c24eed3f543a57fc635aea683`.
- FIRST recording runner SHA-256:
  `dccef28baa625fa72a08cbb8c30cf7ad915c5799160686399fbeab8f26d954e2`.
- Python bytecode was disabled; native temporary writes were directed to
  own `runtime-tmp` via TMPDIR/TMP/TEMP.

## Paths And Hashes

Every relative path below is beneath the absolute author directory above.
`freeze.json` records absolute paths, byte counts and hashes of every retained
file, including the input manifests, this report, observations and usage.

| File | SHA-256 |
| --- | --- |
| `source-first-inventory.md` | `9ff37b371e4b28a374085a4d9d41777a3fb5e8bda4ec170236450aefff7037e7` |
| `author-first/page.md` | `896c3910de18c2a8779a6a06a535469646b2c86211deb8cbe476cc948fe7956f` |
| `root/10p/pages/0235/page.md` | `5e9f8809e1d6c78115f7c553e98f9f2cebf6bcb85f7d1ff142ffcc85fe6a6ed5` |
| `root/10p/pages/0235/page.json` | `ad179e277291e7a87a23909ab51fd99f58971a7e60c78cc6a46d7cebaf674d45` |
| `root/10p/pages/0235/audit.json` | `59a1ed0012949c4e9adb9b9a9d6ec98f349afdbfc8c30bf93d659a7de13a69f7` |
| `work/10p/pages/0235/figures/fig-205.png` | `f5e9a0dea51f55f80ad0c1c80e2bc08daa4540573208ef008e0436adbd23854a` |
| `work/10p/pages/0235/figures/fig-205.svg` | `0b680698bb64008a297800d8ce4b68d2f24cfafed25f0cb08a9f3ba4cfe4bf20` |
| `FIRST/finalize/receipt.json` | `dccf1f08b4424a461ae0c6eb6b02da786ab19b4e3b4962a92fc60be270862a38` |
| `FIRST/vectorize/receipt.json` | `0164e621c7f0163798dc415d873718828ac27b5ec065a3725debf12f2f6322a8` |
| `tool-hashes.before.json` | `c2b0f5155d2e8204ce88bf50672139ea943fdb440016355735af88188ba113b5` |

Source page PNG SHA-256:
`eb468dd93d626681de05163b5339ae1fd40aa015747d0b10fcaac3951f503c6e`.
Native source PDF binding SHA-256:
`7190041b66182e5f6c5a4ef7ae0b04ee3f1afa0df1f5b3ff6317b2c2d1cb8f40`.

## Actual Tool Hashes

These were freshly read before execution and before/after each native call,
not inferred from past source234 receipts. Absolute tool paths and the final
comparison are retained in `tool-hashes.before.json`, both actual FIRST
receipts, `tool-hashes.after.json` and `freeze.json`.
Tool prefix: `/Users/yong/.codex/worktrees/00b1/lemmadeck/.claude/skills/ld-s10y-lesson/`.

| Tool | SHA-256 |
| --- | --- |
| `tools/p2c.py` | `6e6bb3912b4a14e3be11eebf3a35577c06420ddd9f27150f9dd1376a61a925da` |
| `tools/layout.py` | `8c72157a7305d7f7be8e5f0657b40ed648805a0ed7afab7087e4d8a3cf722c73` |
| `tools/blocks.py` | `1b6540373067b80cdc34ab7973a26ccfc1b21b62f655139731f16408ea072b66` |
| `tools/normalize.py` | `65db6b013806f0dd9de0a739e09714c8cdfaebd8f9cb41c4edcb5e242beae29f` |
| `tools/mathcheck.py` | `8f703e723234c3ccc4d9b329d8e2f7b0053d0af261d0526169c31110a53fa8f7` |
| `tools/katex_check.js` | `59c500172eca6dd76baea669aa0d92f67c28512253a751018782a5006a619b56` |
| `tools/vectorize.py` | `95e672e3646a0d77deb136e4a0427acef5d0d3543138c242f9ae3dfe83b48e8e` |
| `tools/svg_raster.js` | `bc37462e28d5b44e574505c03ed062441185a7ba747a0f9af1702d4d67656db8` |
| `profiles/soviet-cn.json` | `c364d68442cfccc9920d3e23932d418c3d7b123cf4a47408e6535dcb19f7104a` |

## Usage And Deviation

`usage.json` preserves actual counts: author 1; content revisions 0;
prepare 0; finalize 1; vectorize 1; retries 0; native KaTeX subprocesses 0
(no math spans); native resvg subprocesses 1.
Images: 3 in one batch / 3 in context; limits 8 / 24.
Paid API/image calls and image generation: 0. Host model tokens/billing
are not exposed by these local tools and remain unknown, not invented.

No assemble, adapt, modern/core/canonical/index/meter mutation, Git mutation,
content DB, publish/deploy, new branch/worktree, subagent/chat or other-chat
message was performed.

**Write-boundary deviation:** the required live Plane ticket read used
`n-plane/scripts/plane.sh` without an own-root TMPDIR override. Its four
successful GET requests each wrote then deleted a temporary response file in
the default `/var/folders/09/c1clz19n2d9clmd00ndn3r100000gn/T/`.
Exact deleted filenames were not logged and are unavailable. No backend
mutation occurred. This violates the sole write-root instruction; it is not
waived, erased or mislabeled as compliant. The helper hash and request list
are preserved in `boundary-deviation.json`. After discovery there were no
further external requests or native producer calls.

## Page-Level Follow-Up Only

Independent SOURCE235 text and RAW205 figure review remain ungranted.
The outgoing `p0235#7` is a recorded page boundary, not a lesson closure.
Prior234 approval remains pending. No repair or other action is authorized
by this report. Freeze own files to 0444 and directories to 0555; stop.
