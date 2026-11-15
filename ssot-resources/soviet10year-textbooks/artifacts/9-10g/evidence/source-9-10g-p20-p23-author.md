# 9-10g physical20–23 source author handoff

Date: 2026-11-15. Ticket: STEMROBIN-184. Role: source author, not independent reviewer.
Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Scope and First Results

Read source cap1, only p19 tail text for initial continuity, and the TOC. Prepared each of20–23 separately, viewed its complete original PNG individually, authored faithful MD with `apply_patch`, and finalized each exactly once. No original scan from earlier pages was reopened. Existing16–19 failures/crops were not repaired or rerun.

| Physical | Actual printed folio | Blocks | Independently observed source rows | First finalize MD/printed | Actual figures |
|---|---|---:|---:|---|---|
| 20 | · 13 · | 12 | 18 | 18/18 PASS | 11 |
| 21 | · 14 · | 12 | 19 | 19/19 PASS | 12,13 |
| 22 | · 15 · | 12 | 25 | 25/25 PASS | none |
| 23 | · 16 · | 13 | 25 | 25/25 PASS | 14 |

Total49 blocks,87 actual printed horizontal rows,4 source figures. Every current audit has empty `errors`, `count_exclusions`, `normalizations`, `unknown_chars`, and `katex_warnings`; `errata: 0`. No first-finalize failure occurred in this new four-page batch. These are first author results awaiting non-author source review, not independent approvals.

Durable packages: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/0020/`, `0021/`, `0022/`, `0023/`, each with `page.md`, `page.json`, `audit.json`.
Matching temporary page directories `.tmp/ld-s10y-lesson/9-10g/pages/<page>/` retain original/grid PNGs, templates, layouts, and the source crops listed below. No assembly/global figure promotion occurred.

## Printed Rows and Object Boundaries

- **P20:** step2 continuation2 rows; unique-solution introduction1; proof3; case-б2; figure11 caption1; conclusion2; exercise heading1; exercise27 2; exercise28 2; exercise29 beginning1; folio1 =18. `p0020#1` is `p cont`, finishing p19's case-а construction after its first step. The source case-б explicitly has `M\in a` and uses the known line itself. `p0020#11` is `ex 29 open`, ending “通过点 N∉α 作平”.
- **P21:** exercise29 continuation1; §5 heading1; first paragraph3; paired figure captions1; printed example problem3; first solution paragraph4; final solution paragraph3; teaching footnote2; folio1 =19. `p0021#1` is `ex 29 cont`, beginning “面 β，使得 α 和 β 的交线通过 M，并且垂直于 a．”, closing the source task. Its following actual heading is “§ 5．多面体*的截面的作图问题的解法”; the raised source star is retained as `^{*}`. `p0021#7`, caption13, has `samerow` with caption12. `p0021#10` is `p open`, ending “作直线 MK，和棱 BC 交”.
- **P22:** first continuation1; symbolic-writing introduction1; symbolic formulas3; quadrilateral conclusion1; printed note6; exercise heading1; exercise30 2; exercise31 2; exercise32 3; exercise33 3; exercise34 beginning1; folio1 =25. `p0022#1` is `p cont`, beginning “于点 Q．”, closing p21's interrupted solution paragraph. `p0022#11` is `ex 34 open`, ending “四面体 ABCD 的棱 DA、DB、DC”.
- **P23:** exercise34 continuation2; exercise35 3; §6 heading1; introduction3; definition2; existence introduction1; construction paragraph3; proof8; final theorem-introduction sentence1; folio1 =25. `p0023#1` is `ex 34 cont`, closing that source exercise. Exercise35 is complete. The subsequent actual heading is “§ 6．异面直线．异面直线的判定”.

P23's proof wraps around figure14: `p0023#8` is `p open` with five narrow left-side rows, ending “（它们都通过直线 a 和它外”; figure14 follows; `p0023#10` is `cap 图14 samerow`, sharing that fifth proof row; `p0023#11` is `p cont` with the three full-width rows starting “面的点 M）．”. This rejoins the same source paragraph, without losing a row or double-counting the caption. The last source paragraph is the complete sentence “这样就证明了如下的异面直线的判定定理．”; the following theorem itself is not on this page.

Actual new headings match TOC §5 printed14 (`geo910-c1-s1-n5`) and §6 printed16 (`geo910-c1-s1-n6`). §4's source text/task boundary closes before §5 on p21, and §5's source text/task boundary closes after exercise35 before §6 on p23. These are source-boundary observations only, not assembly/acceptance claims. **§6 remains partial:** no unseen theorem or later exercise was supplied, and it must not be counted as a complete lesson.

All actual folios retain both side dots. Figures11–14 are prose figures, not unnamed exercise-owned figures; no `owner-ex` guess or empty continuation was needed.

## Literal Glyph Evidence

P22 symbolic source has these actual three rows:

```text
1）α=(MNP)；2）[NP]=α∩△ADC，[NM]=α∩△ADB；
3）(NP)∩(AC)=K；4）(KM)∩[BC]=Q；5）[MQ]
=α∩△BDC，[QP)=α∩△ABC．
```

The original right delimiter in `[QP)` is round, not a closing square bracket. It was retained, without inferring a mathematical correction. The actual break after `[MQ]` is encoded with `↵` within that formula, retaining three printed rows.

P22's printed note says “在图13上点 K 和 D，线段 MQ、QP 和其他线段不是任意…”. The local pixel enlargement clearly shows D's left vertical/right curve; it is not Q. **D remains literal**, not replaced using the figure or a solution. The source explanation and its later §12/§13 references remain intact.

Evidence under `.tmp/ld-s10y-lesson/9-10g/pages/0022/`:

- `symbolic-detail.png`: source box `[115,315,1200,205]`, nearest-neighbor resize to1800x308; confirms formulas, real break, and `[QP)`.
- `note-glyph-detail.png`: source box `[215,674,640,71]`,3x nearest-neighbor; confirms the printed D.

P21's heading star and two-line teaching footnote retain the original future tenth-grade definitions and eighth-grade basis, without modernization. P22's exercise30 raised circle is retained; no circles were added to the neighboring unmarked exercise numbers. Cyrillic source subfigure/case letters `а`, `б` are retained, as are P22 exercise31's closed `[DC]`/`[AB]` brackets. No source mathematics was corrected or independently solved.

## Source Figure Crops

Each current crop was actually viewed after its sole page finalize. Complete source groups, labels, and source solid/dashed strokes remain visible; no adjacent caption or neighboring figure is visibly included. P21's hatch lines are preserved, not converted to modern answer shading.

| Figure | Page | Author coarse box | Final ink box | Audit components | Source inventory |
|---|---|---|---|---:|---|
| 11 | 20 | `[400,745,575,465]` | `[414,759,547,436]` | 19 | Both source а/б panels; two α plane boundaries; а panel separate a/b with M on b; б panel a with M; all line/point labels and subfigure letters |
| 12 | 21 | `[135,610,410,405]` | `[148,620,381,381]` | 12 | A/B/C/D tetrahedron, full source edges and dashed AC, all four labels |
| 13 | 21 | `[620,630,650,385]` | `[630,648,603,345]` | 45 | A/B/C/D/M/N/P/Q/K, whole source hatch section, solid/dashed strokes and extensions to K, all nine labels |
| 14 | 23 | `[700,1290,555,300]` | `[718,1297,522,276]` | 14 | α/β plane outlines, a/b line names, M/N points/labels, source dashed/solid strokes; no left wrapped prose or separate caption |

Current PNG paths:

- `.tmp/ld-s10y-lesson/9-10g/pages/0020/figures/fig-11.png`
- `.tmp/ld-s10y-lesson/9-10g/pages/0021/figures/fig-12.png`
- `.tmp/ld-s10y-lesson/9-10g/pages/0021/figures/fig-13.png`
- `.tmp/ld-s10y-lesson/9-10g/pages/0023/figures/fig-14.png`

## Actual SHA-256

Computed with `shasum -a 256` on current original PNGs, first-finalize durable files, crops, and glyph evidence. PDF source binding inherited from the prepared templates is `1900be5207d00404f64e5a40ab855fbfb8495bd2a06c5ce295ae0e145444578a`; no PDF modification occurred.

Original/evidence/crop files, relative to `.tmp/ld-s10y-lesson/9-10g/pages/`:

| File | Current SHA-256 |
|---|---|
| `0020/page.png` | `13298339a06b8ba477980cba4cecca5b3d2dbf2f585cb43adb0cbc2e40e404eb` |
| `0021/page.png` | `397422ede966185de079194d978e9cd3a80a767c6281e284c3670cf615bdc5aa` |
| `0022/page.png` | `997e5dc96149f7eefe4417174ae698c85298e45380bfcb81da8871a716b6d188` |
| `0023/page.png` | `b34bf3c2a0a3cfa5865cffc42ed9963d39b7b07b8f37603ff6da61cd1e9cbb38` |
| `0020/figures/fig-11.png` | `78d51e15df951d37f27e06a81d182a96e4762d7c7491e0917c5000e847843fb1` |
| `0021/figures/fig-12.png` | `b1cf458c8473fe1df78a5fa752990ad3afe8f1b3d806197a18d32215a13bacea` |
| `0021/figures/fig-13.png` | `7c41d08e6fadd7a0ee23814258335cecb8b73697c9610b195e4cacb82aece682` |
| `0023/figures/fig-14.png` | `7c71a10508fab471595a22a006bbf690166a235ebf3bdbd3693a33e06dfe365c` |
| `0022/symbolic-detail.png` | `5b54b742ba2c427da6267a13dfd7b98e953da2d034f200016c4a261eec1a463d` |
| `0022/note-glyph-detail.png` | `b7eba1ffbb6a6a5068ab4f7db052c870c8b172a8ee1e739f2f5db4272b54aa24` |

Durable files, relative to `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`:

| File | Current SHA-256 |
|---|---|
| `0020/page.md` | `d7f621c374a1359845e710ac126b8b13413619d42d5ca78609bb51c9fdc4f88e` |
| `0020/page.json` | `d5b2e9083f0fdc7607471a6b0f16364ba8f3d0ad962ded81c567387acc216afe` |
| `0020/audit.json` | `2d87bb0c196fd201cb909816ca89d495504f0a4c34a489ae68a74dd0a7f2a773` |
| `0021/page.md` | `e4f79e57d37539b9dbbabaf7cf77c388b50a2c18bb7a53f25d2e0acdedca5ef0` |
| `0021/page.json` | `b259ed4c61a0ca4a40aa5f426edfb66e32f3684c171cdac7e2e958e832319b2e` |
| `0021/audit.json` | `284b407a0a858a87d52b1f6ecc74b7be0f913d4c53293aff2813cbeab4085a26` |
| `0022/page.md` | `633a47ad11d2c6179fd50e5ac502b04c3b5da4c835a70fec3f55cba64d45f8a9` |
| `0022/page.json` | `96221415bc8634dfe2735336fa0c63aa960059dc35c606588e8309b2c9b56021` |
| `0022/audit.json` | `6d1c8d268466da5880ddcae22d55bef4f0004b58d08fcc6413f67834a3096fa5` |
| `0023/page.md` | `390bbe4d4904ddac13efae04db4cd17f482a8a4dc5ed519b9498e0d100843cc2` |
| `0023/page.json` | `be179ca4a7783f83a861454abf3f51d1e54eda34b51c258fefc770cf456f60bb` |
| `0023/audit.json` | `b805aa7a80b5974db3631d5363e458deb4833c22883a74321b57eb04e1044ec0` |

## Stop

No new count/crop blocker observed in this author batch; the literal P22 glyph/bracket facts above require faithful retention, not silent correction. Existing prior failures are outside this batch and have not been repaired or hidden. No assembly/adaptation/vectorization, modern figure generation, answers/choices, interactions, tool/dependency changes, masks/exclusions, service/browser/DB/publisher operations, chat messages, commit, or push. All earlier and parallel artifacts were preserved. No command remains active. Stop for non-author source review; do not treat partial §6 as complete.

## Parent-Requested Metadata Rebind Only

Date: 2026-11-15. Appended by Codex in the delegated metadata-editor role under STEMROBIN-184. This is not a new source review, author-content repair or independent whole-gate approval.

Original report preserved byte-for-byte as `.intentfold/tickets/STEMROBIN-184/tmp/source-9-10g-p20-p23-author-before-metadata-rebind.md`, SHA-256 `a136bfca54b412b087a802bc7b56615a576cb060abeab1df061f703438ec6fc5`. The original report and this copy matched that hash before this appendix. Earlier declarations above remain historical and unchanged.

Finding reused from `.intentfold/tickets/STEMROBIN-184/tmp/transcription-review-9-10g-p20-p23.md`, SHA-256 `265631e4d4b7bbe3ddfcefa7160b6e2f16d9e5a76e8d15f2823c2c9d5dff3a33`: its independently reviewed current MD/JSON snapshots differ from all eight MD/JSON hash declarations in the initial author handoff. No reason for the old/current differences has been established in this bounded task; none is asserted here. The earlier hashes must not certify the current files.

The following supersedes **only** those eight stale MD/JSON declarations. These are SHA-256 of actual current raw file bytes computed with `shasum -a 256`, not canonicalized JSON or reconstructed text. Every value matches the existing independent report's “对照时 MD / JSON SHA-256” table exactly.

Root: `ssot-resources/soviet10year-textbooks/artifacts/9-10g/pages/`.

| Current file | Actual raw SHA-256 |
|---|---|
| `0020/page.md` | `431cc069bce2a4daf17598abea08fb3f72824a53b451265c410cfa4978b5b061` |
| `0020/page.json` | `5e2c7b6e011fbfadd21bfecf4a11d970a6d67f78cf998fedb72038bd11c0f072` |
| `0021/page.md` | `49768ea24d8d59ec75877379276d6fbcb7a8f1b05fc8dc8e8a1666d419a7ca65` |
| `0021/page.json` | `89bb8d9848253ac1347517abddfb4f3070992fcdc7f22471034d15f6ef67517e` |
| `0022/page.md` | `32dd19f08c0e3f08364ad0786359fe21995578ecb6a0d5f48108e2706f8cbf40` |
| `0022/page.json` | `428d1cdf944c423fdf0f7a990ef6d880061d32e521fa74477ae42ef617e51681` |
| `0023/page.md` | `b64af0029a0d79a1d791b13348dbd699c59b0a2412b79e410b33dbe367b67019` |
| `0023/page.json` | `73c8877c5145a156a118c904f3b6e58523082ce9915006ddf12e7f1c20bad810` |

Accordingly, the current files are the byte-identical MD/JSON snapshots already independently reviewed in that report: content PASS with independent printed-row inventories 18/19/25/25, and figures11–14 crop PASS. Those results are reused, not repeated; this appendix does not claim a new scan, crop observation, count run or finalize. Audit/source/crop values were not recalculated or rebound here.

All existing review limitations remain explicit: p22's two root-level glyph-detail crops were encountered after MD, not frozen before it; p21's footnote punctuation confirmation was a localized post-MD observation; p20's incoming pairing with unviewed p19 was not independently certified. The complete source/crop observations do not erase those order limitations. §6 remains partial beyond p23, and no unconditional source whole-gate PASS or lesson-completion claim is made.

Only this appendix and the original-report preservation were written. No source MD/JSON, audit, crop, figure package, tool or dependency was edited; no source review, finalize, assemble, browser, answers/choices, DB, publication, commit or cross-chat message was performed. Parent owns any subsequent assembly of8–21. Metadata task stopped; awaiting n4 figure11 context, with no additional figure work started.
