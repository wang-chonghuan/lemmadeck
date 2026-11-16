# STEMROBIN-180/C: FIRST Independent SOURCE Review, Batch 26

## Decision

| Physical / Printed | SOURCE Verdict | Disposition | Approved Bindings |
| --- | --- | --- | --- |
| 272 / 261 | REVISE | BLOCKED, repair 1/1 exhausted | None |
| 273 / 262 | REVISE | BLOCKED, repair 1/1 exhausted | None |

Sole fresh independent reviewer, not author approval. No legitimate approved subset exists. Mechanical exit0 and matching row totals do not establish source fidelity. No pristine-compliance PASS is issued. All candidate SOURCE bytes remain untouched.

## Source Fidelity Findings

1. **272, p0272#5, rows 14-15: emphasis scope is wrong.** The scan's opening `这种` is regular weight; bold begins with `伴随着` and continues across the printed line break through the definition's end. The frozen MD and JSON instead start `**这种伴随着...` and make the opening two characters bold too. The wording and the two physical rows otherwise match. Evidence: source grid and `272-emphasis.png`.
2. **272, p0272#6 and #7, rows 16-17: nested italic emphasis is lost.** The scan mixes visibly slanted bold text with upright bold text. Clearly slanted `液体` is visible at the beginning of #6 and after the comma in #7. Both frozen blocks use only `**...**`, with no italic span. This disproves the author's assertion that nested bold/italic is absent. This review does not invent a complete italic-span endpoint map: the finer endpoints across these clauses are not certified from the bounded observations. That residual typography uncertainty is also not a fidelity approval.
3. **273, p0273#11, row 20: an actual printed word was replaced.** The second assignment prints `腾前要注意水变深的现象，并对它做出解释.` The frozen MD and JSON both have `腾前要注意水变浑的现象，并对它做出解释.` Source character `深` (U+6DF1) was replaced by `浑` (U+6D51). The source's wording must not be scientifically or contextually improved. Evidence: source grid and `273-assignment-footer.png`. No correction was made.

The machine-readable `review.json` records every inspected printed text row and both candidate representations, not just these failing rows. It also records the full table and figure observations. Its source observations are independently taken from the opened pixels, not accepted from the author's counts or inventory.

## Coverage

**272:** 19 visible text rows outside the figure: caption 1; incoming paragraph 5; next paragraph 7; definition 2; next two statements 1 each; table introduction 1; footer 1. Nine candidate blocks, zero tasks, one figure and one caption. Each paragraph word, sentence dot, comma, quoted `“响声”`, dash, bracketed figure reference and Cyrillic `б` was compared. The visible wording agrees apart from the typography findings. MD and JSON agree with each other, which does not cure their source defects.

The figure has two complete flask/support/spirit-lamp apparatus groups, liquid and bubbles, and source sublabels а/б. The left liquid has fewer bubbles and the right many; neither is replaced or redrawn. The exact official crop preserves the apparatus bases, upper flask mouths and both sublabels. Its bound box is `[291,257,959,411]`. Caption `图 234` lies below and outside it; the numeric caption is italic and retained as `图 *234*`. No table or missing text row is inferred inside this figure.

The first paragraph is visibly a continuation starting `看到水中...`; candidate #3 has `cont` without an invented local prefix. Its end `也有水蒸汽.` closes on this page. The final introduction `下面的表中列入了一些液体的沸点.` is complete, not `open`.

**273:** 21 visible text rows outside the table: caption 1; paragraph 6; question heading 1; numbered question rows 1+2+2+1; assignment heading 1; first unnumbered assignment 3; second unnumbered assignment 2; footer 1. Twelve candidate blocks; four printed numbered questions and two separate unnumbered assignment paragraphs. The q1/q2 block labels are internal identifiers, not printed numbers. No invented question, continuation, empty row or `samerow` was added.

The paragraph's printed values are 1 atmosphere, -183 degrees C, 2567 degrees C and 2750 degrees C. The corresponding frozen LaTeX has the same values, sign, superscript degree and C. All six paragraph rows and all four questions agree in wording, punctuation and order. The first assignment's three rows, including its parenthetical conclusion, agree. The second assignment's first row agrees; its second row contains finding 3. Its final `并对它做出解释.` is a complete ending, not `open`. No page 274 pixels were opened.

The table title is `一些液体在标准大气压下的沸点` in bold, followed by the ordinary-weight parenthesized degrees-C unit; it is separate from the table crop. The table has six columns arranged as three substance/value pairs, four visual rows without internal horizontal rules, five internal vertical separators and top/bottom rules. There are no outer vertical side rules. Source facts by row:

| Row | Left Pair | Middle Pair | Right Pair |
| --- | --- | --- | --- |
| 1 | 氢 / -253 | 氨 / -33 | 酒精 / 78 |
| 2 | 氧 / -183 | 乙醚 / 35 | 水 / 100 |
| 3 | 水银 / 357 | 铜 / 2567 | 铁 / 2750 |
| 4 | 铅 / 1740 | blank / blank | blank / blank |

The exact official crop, bound to `[185,279,1163,261]`, preserves these cells, deliberate blanks, rules and open sides; no value was modernized. Table cell text is preserved as figure pixels, not falsely counted as page-body rows.

**Footers and dots:** the scans show italic 261 and 262, each flanked by two footer ornaments. Candidate foot blocks contain only `*261*` and `*262*`; both notes explicitly disclose the excluded ornaments. This is not an undisclosed missing prose row, but it is not a glyph-for-glyph footer reproduction either. No aligned textual emphasis-dot sequence was identified; random isolated scan specks and footer ornaments were not invented into emphasis markup. The nested-italic findings above remain independent of those dots. No erratum, formula fragment, display equation or extra Cyrillic task sequence was found.

## Frozen Bindings

All paths below are rooted at `/Users/yong/.codex/worktrees/0f12/lemmadeck/`.

- Author handoff: `.tmp/ld-s10y-lesson/source-author-7p-272273/author-handoff.json`, 12605 bytes, SHA256 `5c84f9c69598a51f89e80d61fd4ee12934f3897e0eda321c49203f18586aaac8`.
- Author final manifest: `.tmp/ld-s10y-lesson/source-author-7p-272273/final-manifest.json`, 22503 bytes, SHA256 `4ada76752fd1a19dccbca3f18068e9559ecb299f0323a3843b2e8e9754b39b31`.
- Current review freeze: `.tmp/ld-s10y-lesson/source-author-7p-272273/source-review-input-freeze-mechanical1.json`, 6674 bytes, SHA256 `aff0fee8ad9f59f5249a8ba36547251069f64de2922ed136f59b1416a1dc7b6a`.
- Author report: `.intentfold/tickets/STEMROBIN-180/source-7p-272273.md`, 11881 bytes, SHA256 `50e6e19eccfdbb2112fdbdae698578b4a6e3866c360ce06c5d446a784e63ac50`.

The supplied three hashes match. The 80 final-manifest file bindings and 16 current-freeze file bindings match actual bytes. Each inspected MD/JSON/audit/crop binding is recorded as **inspected, not approved** in `review.json`. Final reviewer report/evidence bindings are in `final-manifest.json`; `reviewer-handoff.json` binds that manifest without a circular self-hash. Files were absent at entry and created only in the explicitly authorized review directory and this report path.

## Actual Image Ledger

Eight image loads, one batch, context 8/24, parent 0; official crops 2, targeted crops 4, reopens 0, neighboring pages 0. The authoritative ledger with exact absolute paths, byte sizes, SHA256 values and crop geometries is `image-ledger.json` in the review directory.

1. Author `work/7p/pages/0272/page.grid.png`.
2. Author `work/7p/pages/0272/figures/fig-234.png`.
3. Author `work/7p/pages/0273/page.grid.png`.
4. Author `work/7p/pages/0273/figures/tbl-p0273-01.png`.
5. Review `272-emphasis.png`: source-page rectangle `[170,1615,1370,1985]`.
6. Review `273-prose.png`: `[170,550,1370,980]`.
7. Review `273-questions.png`: `[170,1040,1370,1560]`.
8. Review `273-assignment-footer.png`: `[170,1620,1370,2060]`.

Each image was opened individually. Targeted crops are lossless, unresized excerpts of the hash-bound `page.png` inputs, written only into the review directory. Neither full raw page PNG was additionally opened. No image payload is returned in the handoff.

## Mechanical Reuse and Capture Caveat

No prepare, finalize, sealing check repair or official mechanical rerun was performed by this reviewer. Existing official finalize receipts are reused exactly once as evidence, not as visual approval:

- 272: `batch26-source272-author-finalize.call.json`, 1293 bytes, SHA256 `8c7f150cc033a6943d6b5a69efc79a5b6fbd6f7172c5dbc939ad71a3455ce0df`; original exit0; stdout175 bytes; stderr0 bytes.
- 273: `batch26-source273-author-finalize.call.json`, 1293 bytes, SHA256 `d0ae115f5c8426abe107bea8691fb0c9f657863c4d69d174406bd7861bac1888`; original exit0; stdout178 bytes; stderr0 bytes.

Both original audits report matching rows, zero normalizations, no unknown characters, no KaTeX warnings and no errors. Their bound FIRST-output snapshots match current candidate bytes. These facts do not detect the word substitution or emphasis loss.

The subsequent first seal failed with observed exit1 before seal writes: it compared the initial MD input hash with the live MD normally rewritten by finalize. Exactly one mechanical repair corrected the check's list while preserving the initial-input snapshot check. That repaired seal receipt has exit0. Both pages' current ledger remains 1/1 used, zero remaining; SOURCE repairs and finalize reruns are zero.

**The failed first seal did not independently save raw stdout/stderr.** Its exact argv source, tool-observed error/exit and hashes are preserved, but that archive is not a complete raw-stream recorder receipt. The official finalize streams and successful mechanical-repair streams exist and are bound; they do not retroactively fill the failed seal's raw-capture gap. This disclosed FIRST limitation is preserved, never reset, repaired, reconstructed or described as pristine compliance.

## Boundary and Activity

271 remains permanently BLOCKED 1/1. Only the supplied opaque boundary `p0271#9 **106.沸腾**` and `p0271#10 open` tail `我们` are acknowledged; no rejected 271 pixels or content approval is imported. Incoming partial 106 cannot be assembled through that gap. Prior blocked pages 239, 242, 246 and 257 remain unchanged.

Read AGENTS/router/readme, project configuration, all four charter files and relevant Redlines, IntentFold routing only, lesson SOURCE cap1 and image-batch rules. The explicit offline-review scope did not authorize an IntentFold capability or backend request.

No author/canonical/index/vectorize/assemble/modern/native/answer/choice/DB/Git/env/backend/chat/app/dependency/schema/full-test/browser/model-service/publication operation occurred. No candidate or other person's file was edited. Reviewer-owned local crop/evidence scripts completed synchronously. Zero inflight: 0. External service calls: 0; inference usage/cost unknown.
