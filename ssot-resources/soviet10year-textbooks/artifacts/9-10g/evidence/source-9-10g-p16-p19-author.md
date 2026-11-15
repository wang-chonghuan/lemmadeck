# 9-10g physical 16–19 source author handoff

Date: 2026-11-15. Ticket: STEMROBIN-184. Role: faithful source author, not independent source reviewer.

Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Status

All four pages were separately prepared, then their complete original PNGs viewed individually before MD authoring with `apply_patch`. Only p15 tail text was read for the initial boundary; no previous source-page scan was reopened. Each new page was finalized exactly once. The current results are:

| Physical | Actual printed folio | Blocks | Independently counted source rows | First finalize MD/counter rows | Source figures |
|---|---|---:|---:|---|---|
| 16 | · 9 · | 12 | 15 | 15/15 PASS | 8, 9 |
| 17 | · 10 · | 11 | 20 | 20/19 FAIL | 10 |
| 18 | · 11 · | 12 | 26 | 26/26 PASS | none |
| 19 | · 12 · | 10 | 25 | 25/25 PASS | none; figure 11 is a text reference |

Total: 45 typed blocks and 86 actual printed horizontal rows. The counter reports 85 because p17 combines the two printed footnote lines. All four audits retain empty `count_exclusions`, `normalizations`, `unknown_chars`, and `katex_warnings`, with `errata: 0`. P17 retains the one real count error; the other audits have empty errors.

**Not ready for unqualified promotion:** p17's first count failure remains unresolved, and the current fig-08 crop carries a few caption-top pixels at its bottom. Both issues are described below with source evidence. No exclusion, rerun, tool fix, manual crop replacement, or approval was used to hide either issue.

## Artifacts

Durable MD/JSON/audit packages:

- `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0016/`
- `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0017/`
- `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0018/`
- `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0019/`

Matching `.tmp/ld-s10y-lesson/9-10g/pages/<page>/` directories retain `page.png`, `page.grid.png`, `page.template.md`, and `layout.json`. Source crops remain in the matching temporary `figures/` directories; no assembly or global figure promotion was performed.

P17's unchanged first-finalize MD/JSON were also copied to its matching temporary directory. Its failure audit was frozen as `.tmp/ld-s10y-lesson/9-10g/pages/0017/first-finalize.audit.json`, byte-identical to the current durable failure audit.

## Exact Rows and Boundaries

**P16, printed9:** first continuation 1 row; intersecting-line definition 2; figure8 caption 1; corollary2 2; parallel-line definition 3; figure9 caption 1; corollary3 1; final paragraph 2; teaching footnote 1; folio 1 = 15.

`p0016#1` is `p cont`: “C、M．但是通过这些点不可能有两个不同的平面．” with the printed solid proof-ending square and raised footnote star, closing p15's ending “都通过点 B、”. `p0016#10` is `p open`, ending “在推论的叙述中，没有特殊地提到存在性问题．学生自己证”. Both figures are referenced in prose. Their captions are at different source heights, so neither has `samerow`.

**P17, printed10:** first continuation 1 row; numbered half-open-space paragraph 4; property1 2; property2 2; same-side/opposite-side paragraph 4; figure10 caption 1; half-closed-space definition 2; convexity sentence 1; teaching footnote 2; folio 1 = 20.

`p0017#1` is `p cont`, “明不存在通过两条已知直线的其它平面．”, closing p16's “证/明” split. The printed paragraph number “2．” stays ordinary §3 prose, not a new lesson heading. P17 ends with the complete convexity sentence and its complete two-line footnote; no final `open` block.

**P18, printed11:** exercise heading 1; exercises16–25 on this page respectively 3,2,3,2,2,2,2,4,3,1; folio1 = 26.

Exercises16–24 are complete. `p0018#11` is `ex 25 open`, stopping after the visible `$(AC)\cap(BD)$`. No equality, inequality, or extra condition was inferred before reading p19.

**P19, printed12:** exercise25 continuation3; exercise26 4; §4 heading1; first paragraph2; construction-terminology paragraph5; schematic-drawing paragraph4; printed problem1; printed solution introduction1; case-а paragraph and its first construction step3; folio1 = 25.

`p0019#1` is `ex 25 cont`, starting `$=M$．证明，已知的线段在同一个平面内．`, then subpart2, closing the source task. Together with p18 the visible condition is `(AC)\cap(BD)=M`. Exercise26 closes before the actual printed heading “§ 4．在空间里作直线平行于已知直线”, `p0019#3`, which matches TOC `geo910-c1-s1-n4`, printed12.

Thus §3's source text/task boundary is closed by exercise26 on p19, before §4. This is a textual boundary finding, **not** a claim that §3 is accepted/assembled despite p17's failed audit.

`p0019#9` is `p open`: it groups case-а's two introductory rows and the printed first construction step “1．作过点 M 和直线 a 的平面 α（§ 3，推论 1）．”. The case method continues beyond the page; unseen later steps were not supplied. §4 is incomplete. Figure11а is only a printed reference on this page: no figure/caption block or empty exercise continuation was invented.

All four actual folios retain both side dots. No unnumbered figure requiring `owner-ex` occurs in these pages; figures8–10 belong to source prose.

## Literal Source Decisions

- P16's parallel-line definition actually includes “且没有公共点或重合”; the source fig9б also prints `a=b`. Neither the coincidence case nor its source drawing was modernized away.
- P16's source proof-ending black square is encoded as `\blacksquare`, with its raised star and the printed explanation “符号■表示‘证明完毕’” retained. The footnote separator remains in the original PNG; no counting exclusion was added.
- P16's definition prints the figure reference tightly as “图8б”, not a supplied comma-separated reference. It stays “图8б” in the transcription.
- The p16 intersection point's elliptical printed glyph resembles digit0. The text and fig8б use the same glyph; MD records point name `O` and explicitly flags the O/0 glyph reading for the non-author reviewer. Source crop `0016/top-detail.png` preserves the evidence; no solution was used to add or change a condition.
- P17 literally prints “平面 α 将这个平面分成两个非空的子集”. The second “平面” is retained, not replaced with “空间” by mathematical reasoning. No author mathematical erratum was registered.
- P18's raised exercise-number circles occur on16,18,19,21,22; absent circles were not added to17,20,23,24,25. P19 prints a raised circle at exercise25 subpart2, and a raised circle on exercise26. All are retained as source `^{\circ}` marks.
- P19 exercise26(2)б literally prints `P\cup Q=P\cap Q`. It is retained without replacing either set-operation symbol.
- P19 exercise25's printed punctuation after “证明” is a comma; it was not silently changed to a colon.
- Source subfigure/subpart letters are Cyrillic `а`, `б`. No interval expression occurs in these four pages; none was introduced or normalized.

## First Failure: P17 Footnote Row Merger

The first finalize exited1 with exactly:

```text
行数对不上：印刷 19 行，块体 20 行（块体一行 = 印刷一行；公式跨行用 ↵ 标断点）
```

The source footnote is genuinely two printed lines:

```text
* 凸图形的定义是平面几何中的定义在空间图形中的推广：如果一个图
形包含连结它任意两点的线段，这个图形叫做凸图形．
```

The prepared `0017/layout.json` has a single band `[1877,1954]` for these two lines, while it separately records the immediately preceding convexity sentence `[1772,1813]` and folio `[1989,2015]`. Its first13 bands cover the first13 actual text rows; after removing the six figure bands, the two footnote lines still occupy only this one recorded band. This accounts for the one-row undercount.

Direct source evidence: `.tmp/ld-s10y-lesson/9-10g/pages/0017/footnote-detail.png`, source box `[100,1820,1200,150]`, 1.5x nearest-neighbor. It includes the source separator and both distinct printed footnote rows. No body row is removable; this is not a safe page-margin exclusion or extra separator-count case. No source/metadata/tool fix was attempted, and first-failure evidence remains intact.

## Source Crops and Fig8 Caption-Boundary Finding

| Source figure | Author coarse box | Current finalized ink box | Audit components | Observed package limitation |
|---|---|---|---:|---|
| 8 | `[155,420,1130,355]` | `[162,426,1115,354]` | 26 | Whole а/б source groups preserved, but bottom carries top fragments of caption |
| 9 | `[150,1205,1150,393]` | `[156,1213,1132,383]` | 27 | Complete two-panel source group and subfigure letters; no visible caption/body inclusion |
| 10 | `[115,1135,1175,410]` | `[125,1144,1152,388]` | 38 | Complete two-panel source group, source dots, labels, solid/dashed line, subfigure letters; no visible caption/body inclusion |

Actual current PNG paths:

- `.tmp/ld-s10y-lesson/9-10g/pages/0016/figures/fig-08.png`
- `.tmp/ld-s10y-lesson/9-10g/pages/0016/figures/fig-09.png`
- `.tmp/ld-s10y-lesson/9-10g/pages/0017/figures/fig-10.png`

Fig8а shows source B/C on line a, M off that line within boundary α; fig8б shows crossing source lines a/b and the elliptical intersection label. Fig9 preserves both the distinct parallel-line panel and the `a=b` panel. Fig10а retains A/B above the drawn plane boundary, and fig10б retains A/B on opposite depicted sides with O, α, and the dashed continuation. Source irregular boundary contours and stray scan specks were not geometrically corrected.

**Fig8 crop defect:** actual current crop inspection found caption-top strokes at the bottom. Source-only `0016/fig08-caption-boundary.png`, source box `[420,730,430,110]`, 3x nearest-neighbor, shows why a plain bottom cut is unsafe. At grayscale threshold160, isolated local source regions give these ink bounds (right/bottom exclusive):

```text
subfigure а), region [450,730,85,95]: ink [468,743,504,780]
caption 图8, region [670,730,130,95]: ink [689,776,781,809]
```

The printed а) descender extends to y779; caption-top pixels start at y776. The current finalized rectangle ends at y780, so its lower rows contain both. Merely trimming everything below y776 would lose actual subfigure-letter pixels. Necessary follow-up is a source-semantic crop ownership repair that excludes caption ink while preserving the complete а) glyph, not a global page-image edit or a counting exclusion. No such repair/rerun was performed in this once-per-page author task; retain the current crop as the first result for independent confirmation.

## Actual Hashes

SHA-256 computed on current file bytes after each page's sole finalize. Source PDF identity from prepared templates is `1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a`; the source PDF was not modified.

Original page PNGs, relative to `.tmp/ld-s10y-lesson/9-10g/pages/`:

| File | Actual SHA-256 |
|---|---|
| `0016/page.png` | `4a15955c5aab7aaab85c186c2af70d3b894f8d3862b26cf2bb73d5a6030eecd3` |
| `0017/page.png` | `94b1cf93eed74e3c9124f3a22d7b321725588e53f3d640227ca5e5671a379387` |
| `0018/page.png` | `ae91a6d3e378427cb5966db3e37276bbf6d27e39094eee54dffa56b5d73982da` |
| `0019/page.png` | `90560e6efc1724c072ab293931482f28a8a66fe918013950255c0c98e707af09` |

Durable files, relative to `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`:

| File | Actual SHA-256 |
|---|---|
| `0016/page.md` | `b9fcd625302c5a900d7ca9349577eec0235acdaa597355ff6bfc5bdbc21dd4e4` |
| `0016/page.json` | `a6c45196dd4683b821063299a8abc34e400bcc7650fbc3e48e28ea4ad12bb555` |
| `0016/audit.json` | `112146b7fbb74be05c1b77a9476b68c494ecc399f40cf19355f190c972167568` |
| `0017/page.md` | `8e8846bf1f1dc024fc46882f51301d4e0e5bfe157af6d74e843481f6699f735d` |
| `0017/page.json` | `bc239df28acedb8eead79d119178db3b830dbc011611b1ccf118b8d09b7e1a2a` |
| `0017/audit.json` | `5827395c02738502e1a74b22388ef666d6e5dfdab7fe38d272d669ca827f85ef` |
| `0018/page.md` | `0f9ff362ac93d653fc526c82d78a4ba5e8fb6c227b1d5b23d469efd9c2c24059` |
| `0018/page.json` | `c6cbea9347f50ac4c2f3f46c7e384e40f2e98dca7f87cbe32c1bdaf1c816678d` |
| `0018/audit.json` | `13940e1ffc1d2278b523677832abf8e99599569054fca86de340eecfd2adb782` |
| `0019/page.md` | `31583a68ff2e6b72e34cbc6e275369eaab98e762a658e6001082442b7ff38a2d` |
| `0019/page.json` | `ddf77e13bbabf8de94d3d3998041764168c30e62741bb89b7b37ca089bb6c1cc` |
| `0019/audit.json` | `6f789dac7b91abcfd8dc1ffc29a995bb315a24642290548f92195b6e96d83f77` |

Current source crops/evidence, relative to `.tmp/ld-s10y-lesson/9-10g/pages/`:

| File | Actual SHA-256 |
|---|---|
| `0016/figures/fig-08.png` | `cff6f1f549cfe57669fafad8b751cfa8524205b66438bcb84d63604a5e5b9648` |
| `0016/figures/fig-09.png` | `5642c00bef1baf62b3617a0644a9acc805c4e99a07d83a1a39cc3edd79bafe48` |
| `0017/figures/fig-10.png` | `af7868831a26152a6c06806d3aedb57098d7e0e5298cb71e4ffd68c10fad3145` |
| `0016/top-detail.png` | `c88187e9666c02417a3b9f1933bb1f1f1c9c2674e63eb81304668376631dc6fe` |
| `0016/fig08-caption-boundary.png` | `c7a3805afcf1b58072a9b1a12771f6deb2f161b1c41ea402477c3b2c11dbd69e` |
| `0017/footnote-detail.png` | `886bedae751bf837e38984dcaa8ccaadf42f7bf7a7f212e0c39325d0d8b1943b` |
| `0017/layout.json` | `50b4b6393a7afcfd835f043bc5dc537c75e43972740ce71bdd72acd08dfbf670` |
| `0017/first-finalize.audit.json` | `5827395c02738502e1a74b22388ef666d6e5dfdab7fe38d272d669ca827f85ef` |
| `0017/page.md` first-result copy | `8e8846bf1f1dc024fc46882f51301d4e0e5bfe157af6d74e843481f6699f735d` |
| `0017/page.json` first-result copy | `bc239df28acedb8eead79d119178db3b830dbc011611b1ccf118b8d09b7e1a2a` |

`0016/top-detail.png` is a source-only crop `[135,185,1185,200]` resized1.6x with nearest-neighbor.

## Stop

No assembly/adaptation/vectorization, mathematical correction or solving, answer/choice/review-draft consultation, interaction authoring, exclusion registration, dependency/tool change, browser/service/DB/publisher call, chat message, commit, or push. Existing parallel work and old page artifacts were preserved. No command is still active. Stop here for parent/non-author source review of the first author results and their explicit blockers.
