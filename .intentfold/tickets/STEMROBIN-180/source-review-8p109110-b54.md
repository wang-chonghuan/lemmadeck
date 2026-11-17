# Batch54 FIRST Independent SOURCE Review: 8p 109/110

**BLOCK: one source-emphasis metadata defect on page109.** This is a source-only
review of the current author freeze, not repair, pair approval, promotion,
assembly, a modern edition, or a completed course. Page110 has no independently
observed source defect and is FIRSTPASS only for its own local source facts.

Reviewer owns only
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-8p109110-b54/`
and
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-review-8p109110-b54.md`.
Shared files and author outputs were not edited or reverted.

## Exact Defect

**B54-SOURCE-109-EMPHASIS-1 (P2)**:
`artifacts/8p/pages/0109/page.md:62` and the matching
`page.json` field `meta.source_emphasis[1].punctuation_dotted` incorrectly record
`false`. In `p0109#3`, block line5 / physical printed row10, the comma after
`系` in `是一个惯性系，那么` has an under-dot. It occupies the seventh
character cell in that dotted row. Both the original whole page and the existing
source crop show this regular dot between the dots for `系` and `那`.

The row's text is present and correct; the defect is the contradictory emphasis
fact. Record the comma's dotted scope specifically. The sentence-ending period
on block line6 is **not** dotted, so blanket dotted punctuation is not an accurate
replacement either. This reviewer makes no repair and spends no repair allowance.

Evidence: image-ledger ordinals1/2, source page SHA-256
`8bc7f489ece1edd8c7c59040b03a3daeee590e983e9600136466e6ff9c99892a`,
crop SHA-256
`7386f498f1f962c7e27e10242a1d34731f8a2532fcc46760fc0f8d21d00af873`.
The crop is the existing author crop, recorded LTRB `[220,810,1530,1080]`;
no reviewer crop or rasterization ran.

## Independent Pixel Coverage

Read the AGENTS router, IntentFold readme, engineering, operations, lesson cap1,
block/profile/finalize source contracts, and image batch rules. No IntentFold
capability or backend operation was invoked.

Original pages were opened **one at a time**: 109, its crop, then 110.
All literal body rows, punctuation, headings, exercise statements, and numeric
footers were compared with the current page.md and page.json, not merely with
the author's summary or a row-count receipt.

| Physical / Printed | Blocks | Visual / MD / Recorded Tool Rows | Figures | Exercises | SOURCE |
| --- | ---: | --- | ---: | ---: | --- |
| 109 / 97 | 6 | 26 / 26 / 26 | 0 | 0 | BLOCK, defect above |
| 110 / 98 | 13 | 26 / 26 / 26 | 0 | 6 | FIRSTPASS, page-local only |

Page109 block row ranges: #1 1-3; #2 4-5; #3 6-11; #4 12-19;
#5 20-25; #6 footer26. Page110: #1 1-2; #2 3-4; #3 heading5;
#4 6-7; #5 8-9; #6 10-11; #7 12; #8 13; #9 14-16;
#10 title17-18; #11 19-21; #12 22-25; #13 footer26.
`review.json` records these independently counted ranges.

No other literal-word, punctuation, row-boundary, or block-kind defect was found.
Historical `象` and the printed `作` in exercise2 are retained, not modernized.
Exercise numbers are literally 1-6 under `练 习 16`, without Cyrillic subparts
or formulas. The page110 h3 is the two-row title
`23. 物体的相互作用 当它们相互作用时物体` / `的加速度`;
this establishes the on-page heading, not its inherited ancestors or TOC identity.
Numeric footers are 97 and 98; their flanking round ornaments were observed,
not mistaken for text rows or punctuation in the body. Margin stains are not figures.

Page109 #2 is source bold, not under-dot or italic. Page109 #3 has under-dot
scopes on block lines4-6, not source bold or italic; the metadata row texts match
the letter spans, but its punctuation flag has the defect above. Page110 #3 and
#10 are source bold. Single-star Markdown is **not** evidence of source italics;
the explicit source_emphasis types and text/line scopes were compared with pixels.

## Boundary And Holds

The only verified local cross-page edge is `p0109#5 open -> p0110#1 cont`.
The actual terminal `伽` and initial `利略` continue the same paragraph, which
ends on page110. This is a source observation; no assembler ran.

`p0110#12` ends with `改` and stays open; #13 is its footer, not a closure.
111/112 are unread and unprepared by this reviewer. There is no actual next-block
claim, inferred continuation text, or course-closure claim.

Inherited 105/106 HOLD remains **unapproved**. Only incoming structural references
were read: no prior body, inherited title text, formulas, images, failed reports,
or prior review reports. No cross-gap approval or assembly is implied.

`outgoing-8p111112-structure.json` in the reviewer root retains the author's pure,
unapproved structural record: refs/kinds/flags and literal task numbers only,
no prose, title text, formulas, image payload, or failed-report payload.

## FIRST And Current Bindings

Author root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-8p-109110-b53/`.
Its b53 suffix is unchanged; this review is batch54.

Author-freeze/manifest.json SHA-256:
`271e4e25f2230864ea45e232db56c8a1b1578d2d8ebbafe13383146a4bcf9e9a`.
FIRST-inputs manifest:
`3d9b39ec993925284582737b06990141484d331330471383ebe3c4f879f14c2a`.
FIRST-results manifests:
109 `7966ffe75929170b08a2cd3de0fbcd8b6c63cef24ee5527b6142a3ff24b7d4a4`;
110 `13a8beeea420bf8d40da3b74dd24e33935e6bf4d876fa545a6b338a8a4e40bc5`.

Current page.md hashes:
109 `2fa2b89ff7c16a3da734407b3cf851cebca5c2399e1a2a7cfd7be5502d86d4bd`;
110 `2e7bfd23cdd9cb2336e213c260b7c0c304e055101b2cbdff20ed7c41134b93e0`.
Current page.json hashes:
109 `27fa1371d5c19aea74e4424509e54052b7b0bfaa03a6a53aa27b98b92fcccb84`;
110 `b097e31550e10970ba0cd9673fbe974bcd8dc49d9d124b6c80e4f81e49c7472b`.
Source PDF:
`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`.

One FIRST finalize receipt per page records exit0, with actual argv, cwd,
PYTHONDONTWRITEBYTECODE, timestamps, and both stream hashes. 109:
`2026-11-17T05:02:51.521Z` to `.857Z`; 110:
`2026-11-17T05:02:51.523Z` to `.853Z`. The receipts and their frozen copies are
read, **not executed**. Both audits record 26/26 and no mechanical errors.
These passes do not detect the visual emphasis defect.

Each author's repair budget is used0 / remaining1, FIRST failure debit0.
The review adds no finalize, failure debit, repair, or replay.
The 8p catalog's numbering override is unset; the existing tool default is book.
This does not authorize assembly or invent group-qualified exercise identities.

The one-shot `bind-current.mjs` hashes current actual files, checks the existing
freeze/input/result/receipt bindings, and records exact command, times and streams
in `binding.call.json` and `bindings.json`. It writes only reviewer evidence and
the pure outgoing copy, imports no application dependencies and invokes no source
pipeline. `review-freeze/manifest.json` binds the final report, review findings,
image ledger, outgoing structure, binding results and binding command.
File-binding failures, if any, are authoritative in `bindings.json`; successful
hashes cannot turn this visual BLOCK into PASS.

## Limits And Stop

Exact image ledger: 3 opens = 2 whole pages + 1 existing crop; 0 reopens;
3/8 batch, 3/24 context; 0 simultaneous page opens; 0 inflight;
0 parent image payloads. Final return is text, paths and hashes only.

Uncertainties are bounded: 111/112 and ancestor titles are deliberately unknown;
existing PDF/prepare bindings are not an independent rerender; receipts do not
prove unrecorded process history. Image wall-clock times and attributable
model/token/cost measurements are unavailable and remain null. No other
unresolved literal-reading uncertainty was identified.

No prepare/finalize/vectorize/assemble/render/test/replay, source edit or repair,
promotion, modern/answer/choice work, Git/backend/DB, app dependency or model
service operation, global check, or new content pipeline ran.
**Stop at frozen FIRST SOURCE BLOCK.**
