# STEMROBIN-180/C: FIRST Independent SOURCE Review, 8p 31/32

2026-11-16. Offline batch29. Verdict: **FAIL_SOURCE_FIDELITY**.
Page31 SOURCE_APPROVED; page32 SOURCE_REVIEW_FAILED. No batch approval or promotion.

## Finding

**[P2] p0032#12 loses the definition continuation's source emphasis.**
`current/artifacts/8p/pages/0032/page.md:91` and
`current/artifacts/8p/pages/0032/page.json blocks[11].lines[1]` retain
`做匀速直线运动.` as unmarked regular text. The independent original-page reading,
frozen before candidate/template/layout/author facts, records this printed second row as bold.
The current local note at MD line25 / JSON `meta.notes[2]` asserts first-row-only emphasis.
Scope is this one definition continuation and its conflicting note, not a page-wide style rewrite.
No patch was applied.

The already-viewed source crop also supplies supporting ink measurements: repeated glyph
`直` has 1055 black pixels in the continuation versus 717 in the regular introduction
(widths 42 and 43 px); `速` has 1089 versus 857 (both 44 px).
This is corroboration of the independent visual reading, not an automatic font classifier.
FIRST source observations and this FIRST failure remain immutable.

## Source Comparison

| Physical / Printed | Rows: Independent / MD / Printed | Current Blocks | Figures | FIRST Finalize | Review |
| --- | --- | --- | --- | --- | --- |
| 31 / 19 | 15 / 15 / 15 | 12 | fig-21, fig-22 | once, exit0 | SOURCE_APPROVED |
| 32 / 20 | 19 / 19 / 19 | 14 | fig-23 | once, exit0 | SOURCE_REVIEW_FAILED |

Words, mathematical expressions, punctuation, caption identities, source Cyrillic panel
glyphs, arrows, signs, modulus bars, subscripts, squares and radical scope match.
Page31's under-dot emphasis covers exactly 23 characters across two rows, excluding the
period. The inline heading 3 is not a new h3. Both italic dotted footers are retained.
All three raw PNG figures match the independent inventories: no missing labels, arrowheads,
subfigure glyphs, projection braces or source solid/dashed strokes. Figure23 starts away
from O and has two occurrences each of a_x and a_y.

The current separate prose blocks for displayed formulas retain every source row.
The initial page31 sentence is closed, not a required mid-sentence continuation; the FIRST
contextual incoming label does not create a new `cont` obligation.
`p0031#11 open` -> `p0032#1 cont` is correct; `p0032#13 open` remains unfinished.
The page32 `h3` kind carries heading emphasis; no redundant bold wrapper is requested.

## Authority

The sole root is
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-3132/review-freeze/`.
All following source paths resolve directly against that root.
Main `manifest.json`: **87397 bytes**, SHA256
`34c8f573d34596f168a4350e8f95285bd161337aeaff5435a1da06c04e1de147`.
Its OBJECT `files` array has 206 entries; Main-inclusive total 207.
One flat binding verified all 207, exit0. No origin or nested historical-manifest recursion.

| Source Path | Bytes | SHA256 |
| --- | --- | --- |
| current/artifacts/8p/pages/0031/page.md | 2806 | 4ba2285adaf9419e0c44223d306a4ac7883ff3f95cd9ee3a89c24aa777d170f1 |
| current/artifacts/8p/pages/0031/page.json | 5311 | 6bd18a159e57792efe2786ce53cc8f569d14d8ace4086ba199a6bf355737824e |
| current/artifacts/8p/pages/0031/audit.json | 647 | b5806860fe67ee08f7b582e11b21254fcc58efb8dae8e3b1dbb8a8c3ea7e2336 |
| current/work/8p/pages/0031/page.png | 74646 | 113a8c265f65849b8a1a8e8cb8b3f9ddcc72ec0e0df7e948520c8e4500f10646 |
| current/artifacts/8p/pages/0032/page.md | 2656 | d0c2531c4f5d95d5e47cc6ceff9d73c11036b5c813f1118d6a4761b0ba8796d2 |
| current/artifacts/8p/pages/0032/page.json | 5508 | 3ae0548ead14a1fc4201c6428bd7fbe42100abacb4de9b2e6e890e06bd665dd0 |
| current/artifacts/8p/pages/0032/audit.json | 413 | a5ef8af45f89338198c1f1267decb4d34f5d1f51cf4f176c09c23417b23633c9 |
| current/work/8p/pages/0032/page.png | 83957 | bda1f1493862f75a494012f4f313288b583cc75cae52b986ed0fabc18e0d9917 |
| current/work/8p/pages/0031/figures/fig-21.png | 5976 | a4605a9d47afdab96eee5c6a2330da42f9ea7f6b818b0bd7105e5e95ac3b7842 |
| current/work/8p/pages/0031/figures/fig-22.png | 8994 | 1761ff0407f2b5b08d8395bdbe7198d145a4f9d2433495de0a40d861bcf83b33 |
| current/work/8p/pages/0032/figures/fig-23.png | 7296 | 2865e54b151a8865f048a7dec699cd4338810a092092e371c558fdf3dfbab69d |

## Receipts And Budgets

Existing official success was reused. Reviewer prepare/finalize/validator reruns: **0**.
The supplementary command `receipts/batch29-8p32-author-contract.call.json` first exited1
while checking page31. Its immutable failure manifest
`FIRST/contract-failure/manifest.json` is 15418 bytes, SHA256
`1e2bdc2ada55ad5ea1346b92cef84697a74b9de8955b5c3894d548f3f8837a08`.
The single mechanical repair changed only the crop test's bare-bbox expectation to the existing
clipped 12px white-padding contract. Its corrected call
`receipts/batch29-8p31-author-contract-repair-once.call.json` exited0.
Existing stdout reports FIRST body equality and all three padded pixel-crop equalities;
source candidates, crops, tools and profile were not changed.

Authoritative current ledger: `current/artifacts/batch29-budgets.json`, 2817 bytes, SHA256
`11583817e0a3b7fd21ec91b6659f522672554981c79b141d48bff742daff0067`.
**31 used1/1, unused0; 32 used0/1, unused1.** No reset and no review repair.
Static 0/1 values in FIRST facts and repaired raw stdout are historical, not current totals.
All supplied command receipts and the opaque failure manifest/command are preserved in owned evidence.

## Boundaries And Owned Evidence

Permanent 8p gaps: **17,18,20,23,24,25,26,27,29,30**.
Page28 is SOURCE_APPROVED after exact encoding repair by current human authority.
Its pending fields in this older packet are metadata history only; no page28 body/image was read.
Numbering remains **UNSET**. n5 is prefix-only; n6 has heading/prefix and an open tail.
No assembly, catalog-identity guess, source patch, promotion, modern edition, answers, choices,
Git, backend/freshness, Grill, env/DB/network/services/install, shared-tool/app-dependency/schema
change, supervision or other-chat message.

Owned evidence root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p3132-first/`.
It contains `FIRST/0031-independent-source.json`, `FIRST/0032-independent-source.json`,
`FIRST/independent-review.json`, the immutable report copy, `flat-current-manifest.json`,
`image-ledger.json`, actual receipts and selected byte-identical source/current evidence.
The main report is this explicitly authorized new file:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-8p3132.md`.
Its actual bytes/SHA are recorded at sealing in the owned receipt/result manifest.

Fresh image batch: **8/8**, context **8/24** (originals2 + source crops3 + raw figures3).
Reopens0; parent payload0. **Inflight0.** Stopped after FIRST independent review.
