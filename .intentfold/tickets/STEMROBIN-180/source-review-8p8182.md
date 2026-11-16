# STEMROBIN-180/C: Sole Independent SOURCE FIRST, Physical 8p 81 Then 82

OFFLINE. **81 SOURCEBLOCKED; 82 SOURCEBLOCKED. No SOURCE approval.**
This is the sole current independent review, not a repair, restart, replacement review, validator run, assembly, or promotion.

## Decision

| Physical / Printed | Independent Finding | Confirmed Candidate / Figure-Crop / Author-Inventory Defects | Independent Meaningful Uncertainties | Rows | Budget Used / Unused | FIRST / FIRSTdebit |
| --- | --- | --- | --- | --- | --- | --- |
| 81 / 69 | SOURCEBLOCKED: footer weight unresolved | 0 / 0 / 0 | 1 | 24 = 23 body + 1 footer | 0 / 1 | 0 / 0 |
| 82 / 70 | SOURCEBLOCKED: comma changed to period; footer weight unresolved | 1 / 0 / 1 | 1 | 23 = 22 body + 1 footer | 0 / 1 | 0 / 0 |

Page 82's candidate and author-inventory counts describe **the same single source punctuation issue**, not two unique source defects. There are no confirmed omitted rows. The original, candidate metadata, and existing audit counts agree at 24/23; count agreement is not semantic or typographic approval.

### 82-D1: Confirmed Punctuation Defect

Original row 14 reads `20 米高，试求石块落`: the mark after `高` has a visible comma tail. The frozen original-only inventory recorded that comma **before** the candidate or author inventory was read. Candidate `page.md` line 58 and `page.json` `/blocks/3/lines/1` instead read `20 米高. 试求石块落`. The later-read author inventory `/rows/13/text` repeats the same period. This changes sentence punctuation and is a genuine candidate defect and a genuine author-inventory transcription defect.

Evidence: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/source-first-8p8182/0082-middle-detail.png`, source crop `[155,1100,1480,1645]`, 2x. No solution-derived inference, author-uncertainty inference, candidate repair, or image reopen was used.

### Reviewer Confidence Limits, Not Confirmed Defects

- **81-U1, original row 24 / candidate block p0081#10 / MD line 80:** slant of footer `69` and its two round dots is clear. The exact bold component of candidate `· ***69*** ·` cannot be certified from the original and detail crop.
- **82-U1, original row 23 / candidate block p0082#7 / MD line 73:** the same distinction applies to footer `70` and candidate `· ***70*** ·`.

Both limits were recorded in the original-only inventories before candidate reads. They block exact-typography certification but are **not** proofs that the selected weight is wrong. The author inventories select bold italic footers; reviewer inability to certify those selections is not counted as a genuine author-inventory defect.

The author reported 3/2 uncertainties concerning inline example/solution-label weights and page 81's quoted horizontal sign. Those counts are not independent SOURCE failures. The frozen review found upright Chinese body without an independently distinguishable localized extra-weight span at either inline label; no missing-bold or spurious-bold label defect is inferred. The page-81 quoted sign is visibly one horizontal stroke between double quotes, consistent in meaning with the candidate's math minus. Pixels do not uniquely establish a Unicode dash code point, and no candidate render was authorized. Neither the author notes nor mechanical count agreement creates fabricated certainty about exact font weight or dash encoding.

## Source-First Evidence

Order: read lesson/image-batch instructions and clean input; open original 81 once; load three original-only 81 details; complete and bytehash-freeze all 24 rows; open original 82 once with only 81's frozen tail as textual context; load three original-only 82 details; complete and bytehash-freeze all 23 rows; compare the six candidate `page.md/page.json/audit.json` leaves; only then read `inventory-0081.json` and `inventory-0082.json`. Neither page inventory was changed after its freeze.

| Frozen Inventory | Bytes | SHA-256 |
| --- | --- | --- |
| [inventory-0081.frozen.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/source-first-8p8182/inventory-0081.frozen.json) | 9139 | `cf0a014b147bf66ec0141bde18372e5c7c21a503edd8b16d5b80656e4178629f` |
| [inventory-0082.frozen.json](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/source-first-8p8182/inventory-0082.frozen.json) | 9639 | `96f7fe5efc4b8733d137936d3a1dd85ca25549e7c4b7f1f74b2e2e5965e723fc` |

Freeze records:

- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/source-first-8p8182/freeze-0081.json`
- `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/source-first-8p8182/freeze-0082.json`

Original 81: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-8182/work/8p/pages/0081/page.png`, 76037 bytes, SHA-256 `320833dde4437e76551e3d7457397da7694e6d7a0d270e9b5cec154039c34250`.

Original 82: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-8182/work/8p/pages/0082/page.png`, 75028 bytes, SHA-256 `b61001d07d703c05778ce221c3947c4884da969c1639a65703ae279f3caceac7`.

The supplied clean input's alreadyMain81-bound candidate/author leaf records were reused, not rehashed or rebound. No prior full report, historical review, prior-page payload, author detail image, or neighboring figure was opened.

## Exhaustive Row Comparison

Each original row's exact transcription, typography, punctuation, math and object boundary is retained in its frozen inventory. The following mapping accounts for **every** row against both candidate representations and the later-read author inventory. `Match` means no confirmed difference in observable content; it does not silently resolve font-confidence limits. `↵` in a candidate formula accounts for a real printed continuation row, not an added empty line.

### Physical 81

| Original Row | Candidate Block / MD Line | Comparison |
| --- | --- | --- |
| 1 | p0081#1 / 41 | Match: incoming unit, superscript 2, closing parenthesis and filled stop; `cont` appropriate. |
| 2 | p0081#2 / 44 | Match: h with upright Chinese 最大 subscript; filled stop after 下落. |
| 3 | p0081#2 / 45 | Match: nested parentheses and literal references (1), (2); comma after (2), final 当. |
| 4 | p0081#2 / 46 | Match: `t > -v_0/g`, actual stacked fraction; final stop. |
| 5 | p0081#3 / 49 | Match content: inline 例题 3., 25 米/秒 and 4 秒钟; no independently proven extra label emphasis. |
| 6 | p0081#3 / 50 | Match: first question mark, comma, final 路. |
| 7 | p0081#3 / 51 | Match: 程 continues 路; final question mark. |
| 8 | p0081#4 / 54 | Match content: 解 and colon, upward axis, comma, final 坐标; no proven extra label emphasis. |
| 9 | p0081#4 / 55 | Match: 原点 and filled stop. |
| 10 | p0081#5 / 58 | Match: prose introduces display, no terminal punctuation. |
| 11 | p0081#5 / 59 | Match: `v=v_0+gt`, italic variables, no formula label or punctuation. |
| 12 | p0081#5 / 60 | Match: 来计算 and stop close the display-bearing sentence. |
| 13 | p0081#6 / 63 | Match: 经过 4 秒 and comma. |
| 14 | p0081#6 / 64 before ↵ | Match: 25, subtraction 9.8, 秒 squared, multiplication by 4 秒. |
| 15 | p0081#6 / 64 after ↵ | Match: approximation, negative 14.2 米/秒 and stop. |
| 16 | p0081#7 / 67 | Match observable sign/content: one quoted horizontal negative stroke; commas after 相反 and 末. Unique Unicode dash encoding not claimed. |
| 17 | p0081#7 / 68 | Match: final downward-motion sentence and stop. |
| 18 | p0081#8 / 71 | Match: prose introduction to display. |
| 19 | p0081#8 / 72 | Match: `s=h=v_0t+1/2 gt^2`; visible plus retained literally; final comma outside math. |
| 20 | p0081#8 / 73 | Match: 位移的量值 and stop. |
| 21 | p0081#8 / 74 before ↵ | Match: 25 × 4 minus fraction with numerator 9.8 × 16, both 秒 exponents 2, denominator 2. |
| 22 | p0081#8 / 74 after ↵ | Match: positive approximately 21.6 米 and stop. |
| 23 | p0081#9 / 77 | Match: filled stop after 算起的; `t=4`, final comma; `open` appropriate. |
| 24 | p0081#10 / 80 | Footer value/dots/slant match; exact bold weight unresolved, reviewer 81-U1. |

### Physical 82

| Original Row | Candidate Block / MD Line | Comparison |
| --- | --- | --- |
| 1 | p0082#1 / 42 | Match: incoming downward-motion explanation; commas after 运动 and 所以. |
| 2 | p0082#1 / 43 | Match: 大 completes 最; final colon. |
| 3 | p0082#1 / 44 before ↵ | Match: literal `l`, not digit 1; two h最大 terms, plus and parenthesized subtraction. |
| 4 | p0082#1 / 44 after ↵ | Match: `=2h最大-h`, final stop. |
| 5 | p0082#2 / 47 | Match: 根据公式, no punctuation. |
| 6 | p0082#2 / 48 | Match: h最大, external minus, v subscript 0 squared, denominator 2g; no stop. |
| 7 | p0082#2 / 49 | Match: h最大, stop after 数值, no stop after 得出. |
| 8 | p0082#2 / 50 before ↵ | Match: external `-2` coefficient, fraction v0 squared / 2g, subtraction of h. |
| 9 | p0082#2 / 50 after ↵ | Match: negative v0 squared / g minus h; stop. |
| 10 | p0082#3 / 53 | Match: v0=25 米/秒, h=21.6 米, comma after 中. |
| 11 | p0082#3 / 54 before ↵ | Match: squared parenthesized 25 米/秒 numerator, visible negative denominator -9.8 米/秒 squared, subtraction 21.6 米. |
| 12 | p0082#3 / 54 after ↵ | Match: positive approximately 42.2 米 and stop; worked example 3 ends. |
| 13 | p0082#4 / 57 | Match content: inline 例题 4., lowering 集装箱, falling 石块; no proven extra label emphasis. |
| 14 | p0082#4 / 58 | **82-D1:** original comma after 20 米高 becomes period in MD, JSON and author inventory. |
| 15 | p0082#4 / 59 | Match: question ends with question mark. |
| 16 | p0082#5 / 62 | Match content: 解 and colon, moving box reference; no proven extra label emphasis. |
| 17 | p0082#5 / 63 | Match: 不选地球 / 而选箱子, filled stop then 取坐标轴的. |
| 18 | p0082#5 / 64 | Match: downward axis, `(图 51)` followed by stop; italic x; text reference only. |
| 19 | p0082#5 / 65 | Match: 下式来确定 and colon. |
| 20 | p0082#5 / 66 | Match: `x=x_0+v_0t+1/2 gt^2`, two plus signs, terminal filled stop. |
| 21 | p0082#6 / 69 | Match: new paragraph, comma after 开始运动; source literally says 相对地球. |
| 22 | p0082#6 / 70 | Match: x0=0 and v0=0, stop after second equation, final 因此 comma; `open` appropriate. |
| 23 | p0082#7 / 73 | Footer value/dots/slant match; exact bold weight unresolved, reviewer 82-U1. |

## Objects And Boundaries

Both pages have **zero figures, captions, tasks, footnotes, and section headings**. Inline `例题 3.` and `例题 4.` introduce worked examples, not numbered exercises. Formula fractions and continued displays remain text; numerator/denominator heights do not add semantic rows. No figure crop is required or approved. No confirmed figure-crop defect is observed because this pair has no figure object; author text-detail crops were not opened or separately certified.

The independent frozen tail on 81 and original first rows on 82 establish `p0081#9 open -> p0082#1 cont`, ending at the distance expression. Worked example 3 then ends at `p0082#3`, before inline example 4. Page 82's last paragraph `p0082#6` ends in `因此，` and remains open. Page 81's first row is an incoming unit/closing-parenthesis fragment and supports `cont`; the supplied specific prior identity `p0080#3` was **not independently reverified** because no prior payload or source page was authorized.

Page 81's literal references to formulas (1) and (2) and page 82's literal text reference to figure 51 are preserved. Figure 51 is not drawn on either page; its target page, objects, relationships, or caption are not inferred. No neighboring figure, prior formula definition, later-page formula, or solution was opened. All numeric constants and signs above are pixel transcriptions, not recalculated results or corrected errata.

## Budget And Preservation

Images loaded: **8/8 batch, 8/24 context = 2 originals + 6 necessary original-only detail crops**. Original full-page opens: one each. Reopens 0; parent image payloads 0; figure images 0; author-crop images 0.

Per page: repair limit 1, used 0, unused 1, actual source repairs 0, actual mechanical repairs 0, supplied FIRST 0, FIRSTdebit 0 separately. Uncertainty and a SOURCE rejection are not actual repairs. No new FIRST, checker or validator was invoked. Two terminated crop-launch attempts encountered a missing lesson Python path and unavailable system Pillow; existing bundled Python was then used, without installation or environment repair.

Only the new owned evidence directory and this new report were written. Source PNGs, candidate files, author inventories, clean input, and all other existing files were left unchanged. No review restart, repair, prepare, finalize, assembly, promotion, database/backend, app, publish, Git, automation, deploy, handoff, or full-project checks occurred. Inflight exec sessions: **0**.

Approved baseline unchanged: **7p 68; 8p 14; raw 54 pages / 21 entries / 85 tasks; 8p assembled 0; modern 0; numbering UNSET**. New approvals, assembled entries and modern entries: 0. No 8p numbering or scope is inferred from 7p.

Decision record: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/source-first-8p8182/decision.json`.

Manifest: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/source-first-8p8182/manifest.json`; exactly `{workspaceW, files:[{path,bytes,sha256}]}`, containing only this review's new current owned leaves, excluding itself. No recursive history hashing or candidate/author rebinding.
