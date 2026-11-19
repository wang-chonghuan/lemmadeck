# n8 Modern Text and Source Binding

**PASS: textual candidate approval only.** Figure review remains pending. This is not source glyph/count, display, Gate2, publication or whole-lesson approval.

## Candidate Hashes

- `lesson.template.json`: `56110348bc107422b187e77764814f50837e6357d01422d260841cca689ef793`.
- `exercises.template.json`: `20ec3bc77a1e765d3e3c4c62e25feb2d44944c89403e51699096f24aa053f0b1`.

Candidate root: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/ld-s10y-lesson/adapt/9c/modern-us-neutral/lessons/ana9-c2-s2-n8`.

## Findings

- **PASS, coverage and identity:** all 12 prose entries remain ordered and complete: 11 text entries and the single table marker. The title, printed title, chapter/section/card identity and page metadata match raw assembly. E70 remains one exercise with two complete subparts.
- **PASS, snapshots and source references:** embedded raw lesson/exercise data and source SHA-256 values match current raw files. Every source_text exactly matches raw text and its canonical page-block concatenation under the repository's soft-line joining rules. All prose references and E70 `p0037#8` resolve with the correct identity.
- **PASS, sole authorized mathematical change:** `p0035-recurrence-domain`, target `lesson.prose[0]`, binds to `p0035#10`, physical35/printed28, page JSON SHA-256 `43821beaa24a8b125d1e746e65b33211244d6285abd2a44f0fb16f0c2099eddc`. The exact original `$0\le m\le n$` and reason match source registration; corrected `$0\le m<n$` is present and declared `math-correction`. Faithful source/source_text retain the original; the recurrence is unchanged.
- **PASS, textual equivalence:** 34 of 35 prose mathematical spans are byte-identical; the remaining span is exactly the approved domain correction. Both E70 formulas are byte-identical. All remaining differences are authorized linebreaks/whitespace, outside-math punctuation, bold-run normalization and exact Latin `a)`/`b)` label mapping. No coefficient, index, proof text or exercise content was lost or added.
- **PASS, natural linebreaks:** E70 header and complete a)/b) occupy three separate lines. Proof classes 1)/2) are complete, separate and ordered. The aligned proof retains four rows with three TeX row separators. Change declarations are restricted to layout and the sole domain correction.
- **PASS, table identity only:** `tbl-p0036-01`, unnumbered, remains at prose[5] with `p0036#6`; E70 has no figure references. No figure content was opened.

## Official Section Boundary

The read-only official `prose_flow.mjs --json` command emitted 11 text paragraphs and `resolvedBreaks: [5]`. Its stdout SHA-256 is `aceb0fa1c83085b158f954c03073d58aba3bf6769968c745921f14f8591fb188`.

The stored boundary exactly matches the unique official pair:

- `before`: **现在列出帕斯卡三角的前 $11$ 行如下：**
- `after`: 等式(1)可以借助于下面的推理用另一种方法证明。

These are prose[4] and prose[6]; the intervening table at prose[5] is excluded from the text-only paragraph outline. This is the official emitted marker, not a guessed prose-block integer.

## Reuse and Limits

The durable inquiry/solution files are byte-identical to the earlier scratch evidence; recurrence/E70 mathematical PASS is reused without re-solving or numerical reruns. Their hashes and all current input hashes are in `review.modern.json`.

**HOLD:** separate figure approval, source glyph/alphabet/punctuation ancestry, visual layout/fonts, count evidence and full lesson approval. Source64/E59/116 HOLDs and page-local book-answer limitations remain unchanged. Latin labels do not certify source glyph ancestry.

No textual corrections required at the reviewed candidate hashes. Only these two new review files were written. No canonical/candidate/earlier inquiry edits, images, browser, source-PDF reopen, network/models, database, finalizers, renderers, publishers, installs, Git mutation or new workers/chats. No owned persistent resources remain; parent image budget stays permanently 24/24.
