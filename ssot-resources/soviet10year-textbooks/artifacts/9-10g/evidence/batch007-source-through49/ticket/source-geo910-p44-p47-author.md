# 9-10g Physical44-47 Source Author Handoff

Date: 2026-11-16. Ticket STEMROBIN-184. Role: sole source transcription author for these four pages, not independent reviewer. Immutable author handoff; no author repair or second finalize after these results.

## Scope and Observation Order

Repository root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Read the current router, engineering boundaries and lesson cap1. Parent-prepared original PNG/grid/template/layout packages already existed; no prepare was run by this author. Only physical43's final source text was read for the incoming boundary. No reviewer report, answers, choices, modern assets or previous author templates were read.

For each page in order44,45,46,47: opened that page's complete native PNG alone; opened its grid alone; froze source rows, labels, figure inventory and object boundaries in `source-geo910-p44-p47-evidence/<id>/source-first.md`; then wrote that page's durable MD with apply_patch. Finalize ran once per page. Every resulting crop was opened individually in full original detail, after its page's finalize and before proceeding to the next page.

Durable page directory: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/<id>/`. Prepared originals/crops: `.tmp/ld-s10y-lesson/9-10g/pages/<id>/`. Author evidence directory: `.intentfold/tickets/STEMROBIN-184/tmp/source-geo910-p44-p47-evidence/`.

## Actual Gates

| Physical | Printed | Author rows incl. foot | MD / machine | Blocks | Source crops | Attempt | Exit |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 44 | 37 | 21 | 21 / 21 | 12 | 42,43 | first and only | 0 |
| 45 | 38 | 18 | 18 / 18 | 16 | 44,45,46,47 | first and only | 0 |
| 46 | 39 | 13 | 13 / 13 | 13 | 48,49,50,51 | first and only | 0 |
| 47 | 40 | 19 | 19 / 19 | 12 | 52,53 | first and only | 0 |

Each actual stdout reports passed row accounting, whitelist and formulas. All four audits have zero normalizations, zero errors, no count exclusions and no errata. Stderr is empty on all four runs. These mechanical results are not independent content approval. No failure was concealed or retried.

Commands actually run, once each:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 9-10g --page 44
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 9-10g --page 45
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 9-10g --page 46
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 9-10g --page 47
```

Exact command arrays/cwd/exits are retained per page in `finalize-run.json`; actual streams in `finalize.stdout.txt` and `finalize.stderr.txt`. `before-finalize/{durable,prepared}/` preserves the handwritten MD and the full parent-prepared original package. `after-finalize/{durable,prepared}/` preserves all resulting MD/JSON/audit/originals/crops. Current durable triples were checked byte-identical to those after snapshots; original page PNGs remain byte-identical to their before snapshots.

## Boundaries and Faithful Observations

- Physical44/printed37 continues physical43's last “这” with “样的图形”. Paragraphs close on this page. Triangles, unequal-side/angle/ratio discussion, medians and parallelograms are all retained. The figure44 mention is a forward reference to physical45, not an invented crop on44. Two caption42/43 blocks share their actual baseline.
- Physical45/printed38 has figure44/45 captions on one row and figure46/47 main captions on another. Figure47's additional typeset а)/б) row is a separate caption row; the hand-drawn panel designations inside the source illustration also remain. The ratio `|AB|:|CD|` splits after its colon, represented by exactly one `↵`. The last paragraph is `p open` above figures46/47, `p cont open` below, ending “连接点C和”.
- Physical45's original sentence visibly says plain `$O$` in “关于点O对称”; its subsequent rhombi use `$O_1$`. The next construction prefix is transcribed literally as `$A_1B_1C_1D_1$`, not silently converted to another quadrilateral. These source inconsistencies were not solved or corrected. The literal “为了证明后面这个结论” is preserved.
- Physical46/printed39 begins `p cont`, completing “连接点C和D、A和F…”. Both convex/concave quadrilateral cases and the explicit proof deferral remain. All eight parallelepiped point names and construction restrictions remain. The last `p open` ends “其它”.
- Physical47/printed40 begins with figures52/53, then `p cont` beginning “的棱”, completing physical46's paragraph. Source figure52 reference terminates `б):` as observed, not a guessed period. The subsequent original “不象” and figure24 reference remain. The final lesson row ends “讨论” with no visible terminal punctuation; no point was added, and the paragraph is closed by the following exercise heading.
- Physical47 exercises107-109 are fully transcribed and individually closed. The raised hollow marker of107 is `\circ`;108/109 have no marker. Exercise107 preserves the source projection direction and all angle-bisector/median/altitude objects. Exercise108 retains both numbered subparts and the wrapped “垂/线”;109 retains the original circumcenter construction task. No solutions, guessed missing conditions or new figures were added. This handoff does not assert that n13's remaining exercises on later pages are complete.

## Actual Crop Observations and Bindings

All twelve crops were individually opened after their first finalize. Coordinates below are the exact snapped `[x,y,w,h]` recorded by the tool; final crop pixels were not manually edited. Crop paths are the page's prepared `figures/fig-NN.png`; identical copies are frozen under that page's `after-finalize/prepared/figures/`.

| Page / figure | Exact box | Full-crop observation | PNG SHA256 |
| --- | --- | --- | --- |
| 0044 / 42 | [147,735,458,321] | Both hatched triangles, A1/B1/C1 and A/B/C labels, projection connectors and entire screen outline present; no caption/text ink. | `840dda308db460541e341bcc28b92204afae8ed45ea6eb55f6653e5845c0ee21` |
| 0044 / 43 | [744,801,537,244] | Complete alpha plane, A/B/C/O, three medians and original single/double ticks retained; no caption or neighbouring figure residue. | `e037449c64215e013546c0e784ac5425aceabbf64caf9548480b5adfbfa3fdb3` |
| 0045 / 44 | [131,459,508,212] | A/B/C/D parallelogram, solid DB, alpha and complete plane border; source blob beside B retained, not named as another point. | `84f2e30929eeae0c0fc6702a86fb43f3b3d72c7d366f90723ee109196a762a03` |
| 0045 / 45 | [858,441,411,238] | Complete trapezoid A/B/C/D and alpha plane; no added right-angle tick or dimension. | `b0a93b958a118777a2cbbc10e7766732db8b901b6871c781b68f9325b13921ec` |
| 0045 / 46 | [125,1536,459,191] | All A/B/C/D/M/N/E labels, both MN exterior portions, DE and full bases; no trimmed extension or added square. | `c40873ef1e49c0c875cc961cbdd58965eae4d6e0b0e719b081e7455199d62275` |
| 0045 / 47 | [701,1412,566,315] | Both complete hexagon panels, fourteen point labels including O1/O, AD/CF-type diagonals, original internal а)/б); external typeset captions remain separate text blocks. | `a064e8a9d9eb7c35a781a7633a2de26519462941404453868550863771d0e4c4` |
| 0046 / 48 | [159,612,588,368] | Entire unlabeled wire model, shadow network, four connectors and screen outline; no names/hatching added. | `3b87fca16c3eff86a0c154d2d2be9b48d864799e33a7480219173c43f9d56846` |
| 0046 / 49 | [855,611,405,383] | All A/B/C/D, full solid exterior and DB, original dashed AC across DB; no crossing point invented. | `49c4c72bb3bb28a360e16238ebb1c15e4438e8b9044329f55d461559cbf5d514` |
| 0046 / 50 | [161,1267,387,363] | Complete triangular outer border, A/B/D and interior C, all three dashed C connections. | `ebb7e9dcf4ab9fcaa768b7aee2641a897e06ce0158fb6f3e7843f2656dced165` |
| 0046 / 51 | [741,1278,514,388] | Full eight-label parallelepiped, heavy DA1/A1B and original hidden/DC/CB/CC1/DB portions; bottom A and top C1 retained. | `f10b6b23792b7b172b25d8ec1c3fef160ca0737ce579d73513a67ba338e11b34` |
| 0047 / 52 | [134,232,525,364] | Complete three-edge panel with four labels/dots and completed eight-label solid; both internal panel markers, lower labels and hidden edges retained. | `066f2e5f4e98f11938870aa40701c124b1401bfc013b5fa10fdf74da961804ef` |
| 0047 / 53 | [671,317,605,263] | Both cube projections and alpha, all dashed parts and entire right/top protruding cube; no plane-boundary crop truncation. | `2cdd0b5f80d7716c8fe5bbd5d51475e6f1f10fb9af2b8e2763511913b70580a4` |

## Current Durable Raw Hashes

| Page | page.md | page.json | audit.json |
| --- | --- | --- | --- |
| 0044 | `dfc083028dd2b54d32654ac98b2cfed47d87b434657eced0059fc7dc83917e5a` | `1d7efd8480a0b3902fe94c1608038d8a34d479427985a21bf9aa1ae47f8e33cf` | `c6c9f7f73b6c8163b57003abc344eaba632e8e8dc224f688047e51db93537895` |
| 0045 | `2e5ce060297e397091d6739b975ee0993728bac42ec528bd8453c94e2f7e5601` | `d6248d998531d15e5c33ab1f99f2728212ba190ef3cb2badc6e0eca0d414e82c` | `157d7abd6991250cd133805fb4a0b5b9e34436baf0ad2164128a137e162b8b75` |
| 0046 | `a007d557ab77bbb0cef70291075efb498acb9cad9f27210732addb9b3213a88b` | `8d38cf66f126505a896372fcac18816473d28092eebf4ef06cdc80f55d81e08b` | `017229fa40d1d6d0dd7dae7264c1d555c6d99a5675d9dbfcd2d5e6760dcb56e5` |
| 0047 | `4845c513b4cdc4d23c55058dce98c55d0c3067c441a2424224d79a3d944c296a` | `8e5d7e0c1e0be39498a92eda82ea5ab0d60745f614fd3799456803fe9985de73` | `46d4a0e62e82a171f7b0dcd4dd5e8ec0db2ffcce432eb0d0a1b2a03177379861` |

Original page PNG raw hashes:

- 0044: `4c250ed6feaebf9a9f241bd7c40ec414cab621b0ec2db7b47aac0c51bbcfeb5f`.
- 0045: `e7cf29af729553b90d17e4edbab030181bf0dc74a2011833693c26214d144c8a`.
- 0046: `0f9998f699da0487e77c26d168fa3750e86e7b462acaf81ef385caa5e09fe77b`.
- 0047: `7b59b0eac45959921e83dd602b7c0a4080b2a0b4e37a0c9d2ad8044ddb185bfd`.

Source PDF binding remains `1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a`. Physical minus printed offset7 is confirmed separately by the actual four printed page numbers, not guessed.

Complete evidence hash manifest: `source-geo910-p44-p47-evidence/hashes.json`, raw SHA256 `d88732e7ae383569ce5bafd76f525c6d52caff9f25dd18cd578dc64f57f1da7d`. It binds all116 retained/current files, including original/grid/template/layout, source-first notes, initial/final snapshots, commands, stdout/stderr, current triples and all twelve crops. No manifest is used in place of the recorded actual image observations.

## Stop

Only these four durable MDs were manually authored; each authorized finalize generated its own scoped JSON/audit/crops. No source/index/assembly changes outside these pages, no count-tool/schema edits, no mathematical errata, no vectorization, modern production, answers, choices, browser, network services, DB, Git or publishing. Author work stopped at immutable handoff for Aristotle's separate source-first review.
