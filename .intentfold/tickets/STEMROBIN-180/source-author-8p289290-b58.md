# Batch58 SOURCE Author Only: 8p Physical 0289/0290

Date: 2026-11-17. Same STEMROBIN-180 invocation.
Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Target: `phy8-c4-s2-n75`, 守恒定律的意义.

## Bounded Result

| Physical | Pixel-observed printed footer | Blocks | FIRST finalize printed/body | Figures | FIRST vectorize |
|---|---|---|---|---|---|
| 0289 | `· 277 ·` | 13 | PASS, 18/18, exit 0 | 194, 195 | One page invocation, both PASS: 0.014%, 0.013%; exit 0 |
| 0290 | `· 278 ·` | 7 | PASS, 26/26, exit 0 | None | NOT RUN: no page figures |

Both audits have zero errors, normalizations, unknown characters, KaTeX warnings and errata.
These are source-author/CLI results only, not independent SOURCE approval, whole-lesson
completion, modern-edition approval or publication. No failed page occurred and no repair
or finalize/vectorize retry occurred.

Before preparing, all four owned page directories and this report were checked absent.
The `b58-author289290-` receipt prefix was checked absent in the actual `tmp/commands/`
directory as well as the ticket's immediate `tmp/` directory.
Each page was prepared exactly once. Both original full `page.png` files were read before
either template or authored page was read. The two pre-finalize drafts are retained as
`work/8p/pages/0289/page.author-first.md` and `work/8p/pages/0290/page.author-first.md`.
Finalize changed generated metadata and snapped boxes, not the transcribed block text.

## Source Identity And TOC

The live repository TOC `ssot-resources/soviet10year-textbooks/toc/8p/zh.json` records
`phy8-c4-s2-n75`, printed number 75, title 守恒定律的意义, printed start 277.
The next entry is `phy8-c4-s2-t15`, 第九章提要, printed start 279.
The actual new 0289 PNG shows the 75 heading near the bottom and footer 277;
0290 independently shows footer 278. No physical-page offset assumption was used.

Prepare records the source PDF as `8p 苏联中学课本 物理 八年级.pdf`,
SHA256 `4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`.
Both new renders are 1695 x 2580 at 300 dpi. Profile `soviet-cn` SHA256:
`dad8d974ba16880482f359073263269de8c405ccf8cb17dc4215fad11da44849`.

## Full Bounded Source Inventory

All words and printed line breaks are retained in the owned `page.md` files.
The following inventory covers every block on the two assigned pages, including
the material printed before the target heading. It does not assign that earlier
material to an unobserved previous lesson.

### Physical 0289

| Block | Type / actual body rows | Complete content inventory |
|---|---|---|
| `p0289#1` | `p cont`, 2 | Incoming fragment: figure 194 demonstrates paper rising because pressure is reduced in the air stream above the paper. Starts `如图 194 所示` and ends `的空气流中压强降低的原因。`; closes locally. |
| `p0289#2` | `fig`, 0 text rows | Figure 194, both source subfigures retained together: person blowing above hand-held paper; lower air-stream/paper-position diagram. Full visible solid/dashed structure and blow marks retained. |
| `p0289#3` | `fig`, 0 text rows | Figure 195: shaded wing section, six right-directed streamlines, three above and three below the wing; upward outlined lift arrow; labels `升力`, `P_1`, `P_2`, `P_2>P_1`. |
| `p0289#4` | `cap`, 1 | Independent printed caption `图 194`, outside the figure crop. |
| `p0289#5` | `cap samerow`, 1 | Independent printed caption `图 195`, on the same printed row as caption 194, outside the figure crop. |
| `p0289#6` | `p`, 4 | Air striking the convex upper wing surface lowers pressure; upper pressure is lower than lower pressure, producing wing lift. Preserves reference 195 and the two-character emphasis `升力`. |
| `p0289#7` | `exhead`, 1 | Actual printed group heading `练习 50`. |
| `p0289#8` | `ex 1`, 2 | Oil speed 2 米/秒; asks volume passing in 1 hour through a flow tube of diameter 1 米. Original printed number 1, no invented answer. |
| `p0289#9` | `ex 2`, 2 | Measure water emerging from a tap in time `t`; after measuring pipe diameter before the tap, determine water-stream speed. Original number 2. |
| `p0289#10` | `ex 3`, 2 | Water speed 2.5 米/秒; asks pipe diameter for 5600 米 cubed of water per hour. Cubic superscript retained as `米$^3$`. Original number 3. |
| `p0289#11` | `h3`, 1 | Actual bold numbered heading `75. 守恒定律的意义`; no chapter/section headings fabricated. |
| `p0289#12` | `p open`, 2 | Introduces the significance of momentum and energy conservation from the previous two chapters; ends exactly `物质的运动既不可能消灭，也` and continues onto assigned 0290. |
| `p0289#13` | `foot`, 1 | Literal dot-delimited footer `· 277 ·`. |

Text-body rows total 19 before accounting for the two captions sharing one physical row;
actual page reconciliation is 18. The preliminary prepare estimate was 19 before figure
masking; it is not substituted for the final 18-row source reconciliation.
There are exactly three exercises under exercise 50, two figure captions, two figures,
one target heading, no tables and no independent displayed formulas on this page.
The figure inequality remains in the original figure, not converted into a prose formula.

Figure 194 contains five left-directed streamlines in its lower subfigure, above
the solid paper curve; the dashed alternative paper position remains visible.
Its upper person/paper subfigure is not split into a second figure ID.
Figure 195 has no axes, ticks, grid, table rows, measurements or extra source labels.
Neither figure contains its independent printed caption or adjacent prose in the
observed finalized crop.

### Physical 0290

| Block | Type / actual body rows | Complete content inventory |
|---|---|---|
| `p0290#1` | `p cont`, 1 | Exactly `不可能创生。`; joins the preceding assigned page's `也`. Closed after this sentence. |
| `p0290#2` | `p`, 10 | Apparent disappearance/creation of motion is explained by other-body/force action: friction replaces mechanical motion with internal-particle motion; gravity/elastic force replaces it with another mechanical motion, transfers momentum/kinetic energy to another body, or produces opposite-direction motion of the same body. Preserves both printed long dashes. |
| `p0290#3` | `p`, 5 | Motion changes form and transfers between bodies but obeys momentum/energy conservation; cost-free creation/disappearance is impossible. All nine characters of `物质的运动是守恒的` have source emphasis dots, preserved as Markdown emphasis. |
| `p0290#4` | `p`, 4 | Speed is another property but conservation does not require another body to gain an equal speed reduction; retains quotes around `安排` and the statement that only momentum/energy remain constant. |
| `p0290#5` | `p`, 2 | Conservation laws can solve mechanics problems when the acting force values are unknown. |
| `p0290#6` | `p`, 3 | Conservation's significance goes further: momentum/energy laws are described as absolutely precise, whereas Newton's second and third laws are not. Exact source wording retained without correction or invented erratum. |
| `p0290#7` | `foot`, 1 | Literal dot-delimited footer `· 278 ·`. |

Total 26 printed/body rows. This page has no new heading, exercises, figures, captions,
tables, independent displayed formulas or mathematical values. All local paragraphs
are closed after the incoming continuation; no outgoing `open` was invented.

## Actual Boundaries

Incoming at physical 0289, `p0289#1`, is retained without reading physical 0288 or
guessing previous ownership. Its exact two printed rows are:

```text
如图 194 所示，可以看到：纸向上升。这是由于在纸面上方
的空气流中压强降低的原因。
```

The target begins only at `p0289#11`. The prior prose, figures and exercise-50
questions remain page facts before that heading, not newly assigned n75 exercises.

Assigned 0289 to 0290 continuation:

```text
在前两章中我们介绍的动量守恒定律和能量守恒定律，
具有深刻的意义。它们表明：物质的运动既不可能消灭，也
```

`p0289#12` is `open`; `p0290#1` is `cont` with exactly `不可能创生。`.
This closes `也不可能创生。` without inserting any words.

Outgoing physical 0290's exact last three printed body rows, `p0290#6`:

```text
但是，守恒定律的意义不限于此。现在大家都知道，动量
和能量守恒定律是绝对精确的。而牛顿第二和第三定律，不
能说是绝对精确的。
```

This paragraph is closed: its last row ends with a sentence-ending period.
The target's subsequent lesson-level content/boundary is left for the parent to
integrate with the already SOURCE-approved old 0291/0292 if needed.
Their approval is a supplied premise only: no old original pixels, page-artifact
drafts or old approval evidence were reopened by this author.

## FIRST Crop And Vector Receipts

| Figure | Rough box `[x,y,w,h]` | Finalize snapped box | Observed crop | FIRST vectorize |
|---|---|---|---|---|
| `fig-194` | `[290,435,420,530]` | `[299,448,391,503]` | Both complete subfigures, paper positions, person, blow marks and streamlines; no caption/prose | PASS, 0.014% mismatch |
| `fig-195` | `[800,450,725,470]` | `[809,469,699,428]` | Complete wing, all streamlines/right arrows, lift arrow, three pressure labels/inequality; no caption/prose | PASS, 0.013% mismatch |

Both crops include the tool's normal white padding. The corresponding SVGs were
created by the existing source potrace workflow, not redrawn or hand-edited.
Vectorize performed its built-in resvg comparison. No separate vector rerender,
browser, modern figure or extra image load was used.

## Recorded Commands

All operational commands used the unchanged existing recorder:
`node .intentfold/tickets/STEMROBIN-180/tmp/record-step.mjs LABEL COMMAND ARGS...`.
Labels were unique and every listed command ran exactly once.
Receipt files are beneath `.intentfold/tickets/STEMROBIN-180/tmp/commands/`,
each label with `.call.json`, `.stdout`, `.stderr`.

| Label, all beginning `b58-author289290-` | Action | Exit |
|---|---|---|
| `p289-prepare-first` | Prepare assigned physical 289 | 0 |
| `p290-prepare-first` | Prepare assigned physical 290 | 0 |
| `p289-template-read-first` | Read new 289 template after original pixels | 0 |
| `p290-template-read-first` | Read new 290 template after original pixels | 0 |
| `source-details-first` | Mechanically create three source detail crops | 0 |
| `p289-draft-snapshot-first` | Preserve pre-finalize authored 289 MD | 0 |
| `p290-draft-snapshot-first` | Preserve pre-finalize authored 290 MD | 0 |
| `p289-finalize-first` | FIRST finalize, 18/18 | 0 |
| `p290-finalize-first` | FIRST finalize, 26/26 | 0 |
| `p289-vectorize-first` | FIRST vectorize, exactly two passed-page figures | 0 |
| `result-metadata-read-first` | Read the two actual page JSON/audit results | 0 |
| `bounded-hashes-first` | Hash/list the complete four owned page trees and existing labeled receipts | 0 |

Pipeline command argument vectors are retained in the receipts. All use:

```text
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
-B .claude/skills/ld-s10y-lesson/tools/p2c.py STAGE
--book 8p
--root .tmp/ld-s10y-lesson/b58-conservation/artifacts
--work .tmp/ld-s10y-lesson/b58-conservation/work
--page 289|290
```

FIRST pipeline stdout SHA256:

| Receipt | SHA256 |
|---|---|
| 289 prepare | `134767353d66f7a06750387d2f1beecbbef9308e68a28e862bd620476d6c4e6f` |
| 290 prepare | `7936af8e1973968ccd9c294459885bfb6782fd1d0400da4a54f837e356d85715` |
| 289 finalize | `f08984cb9b103df57f4585704163bce4c4a598a59a7e43cf33a43e0f88103e92` |
| 290 finalize | `e85919e97d5e341dafdfc19b583aac6854c265be49fc9eedba85856eaf638bbb` |
| 289 vectorize | `e8bca9eca3f3d4073f304cfebfbc0830fb060f9e570d21cdeb5cb1d275909a31` |

All five pipeline stderr streams are empty; signal is null.
The bounded hash receipt does not hash itself, because its own stream is still
being recorded. Its completed `.call.json` carries its final stream hashes.
One final report/owned-path hash receipt, `b58-author289290-report-paths-first`,
is recorded after this report is created; no pipeline stage is repeated.

## Complete Owned Page File SHA256

Paths below are relative to
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-conservation/`.
These are all 23 actual files created in the four initially absent page directories.

| File | SHA256 |
|---|---|
| `artifacts/8p/pages/0289/audit.json` | `bbf8aef05ba3f975d4eb6d3a72f0385586819d5921caf3c51ac39ee1dd84f43a` |
| `artifacts/8p/pages/0289/page.json` | `27631ce0c01ea3cdf4971776107667ef1413bb341b3888c466331105889ad909` |
| `artifacts/8p/pages/0289/page.md` | `b68a784357854782ee80ef590212574751c017c7c2e46bc9e9a8ea168d3196fa` |
| `artifacts/8p/pages/0290/audit.json` | `46b4220d42eeb4bece368761d5a1f9af6af8b3ae17697a110fd0d7adbabf3b35` |
| `artifacts/8p/pages/0290/page.json` | `732e7dcbda767a2926df6cd0d194994657b9648a3fed12274f4dfa0ff68e96b9` |
| `artifacts/8p/pages/0290/page.md` | `809c0527b9206706d803d8ae9055c60a6a7f1bff2daae541ce5f11aeba1a0830` |
| `work/8p/pages/0289/figures/fig-194.png` | `40a730d78fc0b604e22fa58a082861df9d603519212386b1c298b0d0a8dd4971` |
| `work/8p/pages/0289/figures/fig-194.svg` | `574cb03a2d8bd6a79b33a461623e34be917f28e8bcb361ab522d696df411c74d` |
| `work/8p/pages/0289/figures/fig-195.png` | `aba4d57c53b8490fcac710ac1316c399cb529e8959e3fa870295c1dbc9f49084` |
| `work/8p/pages/0289/figures/fig-195.svg` | `073376ca05ce8849410229f4521c44164f378e7ae11a8f78870c392307cfb023` |
| `work/8p/pages/0289/layout.json` | `289d68219cdb69f244a23f20f041876435aa4938596be14e26a5a9533e4f1d43` |
| `work/8p/pages/0289/page.author-first.md` | `3da683293cdd8666f751303b0e8bf48feec942023584d57736bdeaf8463e4542` |
| `work/8p/pages/0289/page.grid.png` | `e1c411520b309d8dcfc7c3fdce5c6a0beef69184f27378717fe9628c8c1c1807` |
| `work/8p/pages/0289/page.png` | `afc290474e35b9aad941bf1c0a654faa812740cb5eb41a7efab74630d862368d` |
| `work/8p/pages/0289/page.template.md` | `66dccef907723eab4c67a52e86e1258d6189194bb3203e77b503b98a32e14726` |
| `work/8p/pages/0289/source-lower-detail.png` | `12030c3dbd73b4e78a2c84d5e3dc0380b11271b03be20caba281aca517d9a07b` |
| `work/8p/pages/0290/layout.json` | `e2009b11c1b3b4a407626cf56d2a6f3f4d9286e839fb9ba546e78db4549e0db9` |
| `work/8p/pages/0290/page.author-first.md` | `692caf5ce6efecbc35aa189298d7c34f0d6ae4559502cd7ec93cde2a8542dd3b` |
| `work/8p/pages/0290/page.grid.png` | `74c4cf1f016f48fe334a069f854746efaa5bea087893688002e50757cd9874e9` |
| `work/8p/pages/0290/page.png` | `62c11153159dbda663302b467dbf5deb1699dcbc74944634916118404718bd69` |
| `work/8p/pages/0290/page.template.md` | `275deeeecf86eb152d11a80b7fdabd65346a02e667406345d3fd872aa2bb3e22` |
| `work/8p/pages/0290/source-lower-detail.png` | `8a44cce6f190a2de0ddcfbaa5ba91a0b29488fca99b8c19eaaf0fd252f9e6b57` |
| `work/8p/pages/0290/source-upper-detail.png` | `8b011bbe392035fad0e256f374741ed40d9c0c5473c0e50589855b10500bd340` |

## Image Loads And Stop

Exactly 7/8 total image loads, in this order:

1. `work/8p/pages/0289/page.png`, original full PNG.
2. `work/8p/pages/0290/page.png`, original full PNG.
3. `work/8p/pages/0289/source-lower-detail.png`.
4. `work/8p/pages/0290/source-upper-detail.png`.
5. `work/8p/pages/0290/source-lower-detail.png`.
6. `work/8p/pages/0289/figures/fig-194.png`, actual finalized crop.
7. `work/8p/pages/0289/figures/fig-195.png`, actual finalized crop.

Zero reopens, grid loads, SVG-preview loads or other original-page loads.
No further images are loaded. Return is text only.

## Owned Changed Paths

Only the 23 files enumerated above, this report
`.intentfold/tickets/STEMROBIN-180/source-author-8p289290-b58.md`, and the 13
uniquely labeled receipt triplets were created. All receipt files are under
`.intentfold/tickets/STEMROBIN-180/tmp/commands/b58-author289290-*`.
The final `report-paths-first.stdout` enumerates their actual paths.
No pre-existing file was manually changed. Existing dirty work and HOLDs are
preserved; none is resolved or superseded by this author result.

No fresh IntentFold capability, freshness update, setup, backend, assembly,
adaptation, promotion, modern figures, answers, choices, services, network,
browser, database, publication, Git, tool-code edits, checkpoint or usage writes
were performed. Source-page/crop views are the only pixel observations.
