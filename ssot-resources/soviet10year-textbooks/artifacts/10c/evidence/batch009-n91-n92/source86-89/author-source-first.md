# STEMROBIN-184: 10c physical 86-89 source-first draft

Status: SOURCE DRAFT ONLY, not sourcePASS. Frozen on 2026-11-16 after original-source reading and before any candidate comparison. Independent source-first review is still required.

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`

Authorized writes only: this `production-source10c86-89/` directory and the four durable `artifacts/10c/pages/0086..0089/page.md` files. No author, answer or choice candidate was read, including the parallel page-85 author's work. No SkillHost update, workflow restart, grill, finalize, assemble, vectorize, adaptation, publish, database, application, Charter, archive, runtime snapshot or binder expansion.

## Original Source And Preparation

Source: `ssot-resources/soviet10year-textbooks/sources/soviet10years/10c 苏联十年制学校数学教材 代数和分析初步 十年级.pdf`

PDF SHA-256: `47b0358c5781f509ce35e0e22de13c6bb539b246099ade66e8856c9288954e40`

Existing skill venv and `p2c.py prepare --book 10c --page N --work .intentfold/tickets/STEMROBIN-184/tmp/production-source10c86-89` were used, sequentially for N = 86, 87, 88, 89. `PYTHONDONTWRITEBYTECODE=1`; no installs. Each prepare succeeded and generated only `page.png`, `page.grid.png`, `layout.json`, `page.template.md` in this owned temporary directory.

## Actual Image Ledger

One batch, 8 actual image opens, 0 crops, 0 further reopens. Each page was read and its own durable draft written before preparing/reading the next page. These counts include both the grid and original rendition. This context loaded 8/24 images; batch limit reached 8/8. Parent reported 24/24: delivery is text/path/hash only, without images or embeds.

| Open | Image under this directory | Direct observation |
| --- | --- | --- |
| 1 | `10c/pages/0086/page.grid.png` | Folio 80, incoming fragment, formulas (6)/(7), example 2, exercises 266-271 |
| 2 | `10c/pages/0086/page.png` | Same source, grid-free formula/text and local 二/三 glyph inspection |
| 3 | `10c/pages/0087/page.grid.png` | Folio 81, exercises 272-293, three group prefaces |
| 4 | `10c/pages/0087/page.png` | Same source, grid-free exponents, star 283 and wrap 292 |
| 5 | `10c/pages/0088/page.grid.png` | Folio 82, actual n93 heading, example 1, figure/caption 42, boundaries |
| 6 | `10c/pages/0088/page.png` | Same source, grid-free inequalities, labels and source interval typography |
| 7 | `10c/pages/0089/page.grid.png` | Folio 83, example-1 continuation, example 2, figure/caption 43 |
| 8 | `10c/pages/0089/page.png` | Same source, grid-free inequalities, interval endpoints and final open sentence |

Hashes for all eight opened images and all four frozen drafts are in `hashes.sha256`. No source outside physical 86-89 was opened.

## Object Boundaries

Block references below are one-based parser positions, not line numbers.

| Physical / Direct Folio | Preserved source objects and boundaries |
| --- | --- |
| 86 / 80 | `#1 p cont`: “公式：” and (6); upstream owner/block identity UNKNOWN. Task identifies n92/page 85, not independently inspected here. Formula (7), example 2 and its entire printed solution retained. `#8 exhead` includes title plus printed preface. `#9..#14 ex 266..271`; 266/267 and 268/269 same-row facts retained. |
| 87 / 81 | Complete new exercises 272-293, with the continuing 266-277 group and new prefaces for 278-283, 284-289, 290 onward. Star on 283 retained. Natural numbering plus `samerow` preserves two-/three-column rows. Exercise 292 has exactly one printed formula wrap before `-sin4x`, represented by `↵`; not a page continuation. 293 remains the printed yes/no prompt, without an added solution. |
| 88 / 82 | `#1 h3`: actual n93 title. Example 1 and (1)/(2), printed explanation and periodic answer retained. `#5 p open` ends “标出”; `#6 fig 图 42`, `#7 cap 图 42`; `#8 p cont` starts “了一个”. `#10 p open` ends “而选任何一个”, continued on 89. |
| 89 / 83 | `#1 p cont` closes 88#10, retaining the alternative open interval. Example 2 and (3)/(4), full in-scope explanation and periodic answer retained. `#3 p open` ends “在图中”; `#4 fig 图 43`, `#5 cap 图 43`; `#6 p cont` starts “标出了一个”. `#9 p open` ends “而选任何一个”; successor outside scope, not invented. |

Figure 42: source object box `[110,1150,1310,300]`, separate printed caption. Sine curve, axes/arrows, horizontal 1/2 line, vertical projections, open horizontal-axis points and thick interval stroke retained by the unmodified source image. Visible labels: x, y, y=sinx, 1/2, 5π/6, 13π/6, origin oval. The other visible projection point is unlabelled; no π/6 label was added.

Figure 43: source object box `[230,945,1270,305]`, separate printed caption. Cosine curve, axes/arrows, horizontal 1/2 line, two vertical projections, endpoint marks and thick horizontal-axis interval retained by the unmodified source image. Visible labels: x, y, y=cosx, 1/2, π/3, 5π/3, origin oval. No figure extraction, redraw or supplemental figure asset was produced.

No tables, printed teaching footnotes or other figures were observed on these four pages. Folios were read directly: 80, 81, 82, 83, giving physical = printed + 6. n94/page 92 is outside scope; neither its source nor any candidate was read.

## Unknowns And Limited Checks

- 86#1: upstream n92 object/open pairing UNKNOWN; source-first independence from the parallel author preserved.
- 86#7: visible first glyph in “二角函数” is locally 二/三 UNKNOWN. Draft conservatively retains 二; do not silently replace it from mathematical context.
- Figure 42/43 origin oval: tentatively numeric 0; 0/O glyph distinction UNKNOWN.
- Figure 43 left projection endpoint: pale/hollow-looking center; filled/open distinction UNKNOWN. Right endpoint is visibly dark. Do not infer source marks from the inclusive inequality.
- 89#9: final prose remains open into the unread next page; n93 is not claimed complete.

Existing `blocks.load` parsed all four drafts. Checks asserted page identity, declared +6 folio mapping, matching final foot block and no empty non-figure blocks. These are draft-syntax checks only, not visual fidelity certification.

| Physical | Prepare raw line bands | Draft represented printed lines | Blocks |
| --- | --- | --- | --- |
| 86 | 20 | 19 | 15 |
| 87 | 21 | 21 | 26 |
| 88 | 19 | 17 | 11 |
| 89 | 18 | 17 | 10 |

Raw prepare bands are not figure-masked/finalized reconciliation. Differences are retained as observations, not explained away, not corrected by adding text/wraps/exclusions, and not reported as PASS. Durable writes used `apply_patch`; hashes bind these exact source drafts for the separate review.
