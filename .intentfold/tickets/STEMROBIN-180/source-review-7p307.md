# FIRST Source Review: 7p Physical 307

Invocation: STEMROBIN-180/C rolling OFFLINE batch31, same invocation.
Workspace base: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Verdict: **REWORK_REQUIRED**, with separately **BLOCKED** uncertain facts.
Sole FIRST completed 1/1; inflight 0. Source approval, assembly and promotion: false.

## Confirmed Corrections

1. **C1: Preserve the bold span `传递给地球`.** Source row 10, block `p0307#4`, is visibly bold on exactly these five characters in the independently observed original and own lower-prose crop. Current MD line 61 and JSON `blocks[3].lines[7]` omit that emphasis; the bound FIRST candidate and finalized FIRST MD/JSON have the same omission. Smallest correction: `传递给地球` to `**传递给地球**`, excluding the following comma. Do not bundle any text, punctuation, hierarchy, image, or other formatting change. The author's FIRST formatting inventory also omits this span. No author patch applied.

2. **C2: Preserve the slanted footer digits `296`.** Source row 19, block `p0307#10`, has slanted Arabic digits between two solid dot marks. Current MD line 82 and JSON `blocks[9].lines[0]` retain the digits but not their italic styling; the FIRST candidate and finalized FIRST outputs do the same. Smallest correction: the digits `296` to `*296*`, leaving surrounding `·` tokens and spaces unchanged. This correction is italic only, not a claim about bold weight. No author patch applied.

## Blocked Facts

- **U1: Footer digit weight.** The frozen independent inventory could not securely distinguish exact bold weight from scan ink. Do not add bold or replace the footer punctuation on this basis. Slant, addressed by C2, is separate.
- **U2: First underdot onset.** The frozen independent row-6 inventory includes `即` in its first underdot span; the candidate and author inventory begin at `接` after `即`. That one-glyph onset is not sufficiently certain to issue a source correction. The frozen inventory is not silently amended or certified on this point; no candidate backfill, image reopen, or additional crop was performed. Neither extend nor shorten the current first span from this review. Confirmed continuation: `移到它上面的那部` on row 6 and `分电荷就越多` on row 7, excluding intervening/following punctuation.
- **U3: External hierarchy and object closure.** No h1/h2/h3 is printed on 307. The incoming fragment begins `上`; `p cont` is locally supported, but an exact parent or heading origin cannot be certified from 307 alone. Author inventory claims about lesson 121, group id and prior-page origin are read as text only, not followed or accepted as independent evidence. Exercise 4 ends with a comma and remains open. No 306/308 source or body was opened, no cross-gap assembly performed, and no whole-121 completion claimed.

## Independent Evidence

Original FIRST `page.png` was observed before any candidate, template, layout, author facts or report. Four reviewer-owned crops were then created with the explicitly proven PIL Python and observed once each. Independent source facts were exclusively created as mode 0444 before the authority binding.

Frozen facts: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p307-first/sourcefacts.json`
Bytes: 12440. SHA256: `11adbdbfbc8518176e87cc57f5bb617b6879d727dca825b1284494207731b5cf`.

The facts enumerate every printed row, glyph-bearing text, numerical reference, punctuation, bold/italic/underdot span, local block hierarchy, cont/open/samerow status, footer and figure-panel inventory. U1 and U2 prevent an unconditional typography approval. Source periods and footer dot shapes are distinguished from the profile's ASCII period and `·` transcription convention; those conventions are not reported as content errors. There are no formulas, measurements or units on this page.

## Row Comparison

| Source Row | Object | Comparison With Current MD/JSON |
| --- | --- | --- |
| 1 | Figure caption | `图 257` retained, separate from image. |
| 2 | Incoming prose | Text and italic Cyrillic `б` U+0431 / `в` U+0432 retained; `cont` true, `open` false. |
| 3 | Prose | Full printed line retained. |
| 4 | Prose | Full line and reference `图 252` retained; profile period convention accepted. |
| 5 | Prose | Full printed line retained. |
| 6 | Prose | Full text retained; first underdot onset U2 BLOCKED; second span begins `移`. |
| 7 | Prose | Text, second underdot continuation, undotted terminal punctuation and bold `接地` retained. |
| 8 | Prose | Full printed line retained; profile period convention accepted. |
| 9 | Prose | Full printed line retained; profile period convention accepted. |
| 10 | Prose | Full text retained; bold `传递给地球` missing, C1. |
| 11 | Prose | Full printed line retained; profile period convention accepted. |
| 12 | Exercise heading | Bold `问题`, exhead role retained. |
| 13 | Exercise 1 | Number, complete text and terminal punctuation retained. |
| 14 | Exercise 2 | Number and first printed line retained. |
| 15 | Exercise 2 | Second line and question mark retained. |
| 16 | Exercise 3 | Number, first question and final `又` retained. |
| 17 | Exercise 3 | Second printed line and question mark retained. |
| 18 | Exercise 4 | Number, text and ending comma retained; `open` true. |
| 19 | Footer | Printed 296 and two dot tokens retained; italic digits missing, C2; exact weight U1 BLOCKED. |

There are 19 text rows and 10 blocks: one fig, one cap, incoming p, nine-row p, exhead, four exercises, foot. No samerow block. Figure-panel labels belong inside the group asset and do not add body rows.

## Figure 257

One complete group asset, not three separate assets, was inspected once after binding: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-7p307-first/bound-01-fig-257.png`.
Bytes: 10378. SHA256: `cdbf19c9abba3381ba93e11100cc78ee5b9a44c7278abe9564922f21aafd3f60`.

The final raster matches the independent inventory: three left-to-right italic Cyrillic markers `а/б/в`; all three baselines, tripod feet, vertical shafts, two clamp assemblies per stand, bent arms, attached suspension lines and narrow outlined suspended bodies; two hands gripping two rods in the first two panels; no hand/rod in the third. Panel а preserves left three pluses, right three minuses, three rod-side pluses and the rod/body gap; panel б preserves left three pluses, right two pluses and contact; panel в preserves three pluses on each side and vertical suspension. No axes, ticks, grid, arrows, units or extra panel. Caption remains separate. No image repair requested.

The audited snapped box is `[194,226,1131,439]` from rough `[180,220,1160,450]`; the final crop is the byte-identical current/FIRST-finalize figure leaf. Component count is not substituted for semantic fidelity.

## Authority And Actual Proof

Sole candidate authority: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-author-7p-306307/manifests/page-307-current-files.json`.
Bytes: 15053. SHA256: `df6ce6670428bae3bc5cbe76fe2349eb7a274d41b283e15aaef29d950dc1a834`.
The object has exactly 38 `current_files` leaves with an explicit matching workspace base and absolute paths. Bound once after independent freeze. Each direct leaf's declared bytes/hash matched its actual regular file. Original modes were all 0444 and were preserved; binding copies were exclusively created 0644. No chmod. No recursive `workspace_path`, origin, source, history or declared-by path traversal.

Identity is read from `page.meta.book = "7p"` and `page.meta.page = 307`, with printed page 296 and render SHA matching the independently observed original. Current MD/JSON/audit/figure are byte-identical to their frozen FIRST finalized counterparts.

The existing actual finalize receipt is reused, not rerun: FIRST `finalize.call.json`, exit 0, `2026-11-16T18:57:34.301Z` to `2026-11-16T18:57:34.696Z`, cwd exactly the explicit workspace, proven Python, `finalize --book 7p --page 307` with isolated author root/work. Its bound stdout is 177 bytes, SHA256 `9972133a5dd227c63e2e35aa6e8ff266b7fe75fed6b230186c06f4ada591b187`; stderr is empty. Receipt stream hashes agree with the authorized bound stream leaves without following embedded relative stream paths.

Actual audit: printed 19 / MD 19, one figure, no normalizations, unknown characters, KaTeX warnings, errata or errors. Stdout reports 10 blocks / 19 rows / 1 figure. This proves mechanical finalize success, not source-typography fidelity.

Bound `p2c.py`, `blocks.py`, `layout.py`, normalization tool, recorder and profile were read as contracts, never executed. Blocks preserve line strings and markup; the profile's ASCII sentence periods, fullwidth CJK punctuation and Cyrillic markers explain accepted conventions. Finalize counts rows, normalizes text and performs character/formula checks; it does not derive missing bold/italic spans from source pixels. Bound input hashes agree with the direct bound source, tools, profile and prepare-receipt leaves; embedded paths are not additional authority. The existing prepare receipt was only read. No prepare, finalize, supplementary checker or full-review rerun was performed.

## Budgets And Boundaries

- Reviewer image loads: original 1 + own crops 4 + final group figure 1 = 6/8 in this fresh single-image batch, context 6/24; reopens 0, parent images 0, inflight 0. Only text, paths and hashes are returned.
- FIRST review 1/1, no second review or source patch. Bound repair record: total repairs 0, unused 1; source corrections actual 0. Source budget remains 0/1.
- User-supplied 306 boundary is preserved, not independently re-audited: BLOCKED, startup repair 1/1, actual finalize 0, Latin panel reference unfixed, source corrections 0. No failed-306 body/image/global report/ledger was read or incorporated.
- Permanent physical-page gaps remain 239, 242, 246, 257, 271-277, 280, 281, 288-296, 298-306. Physical-page gap 257 is distinct from figure 257 on reviewed physical page 307.
- `7p61`, `raw54/21/85` remain untouched; `n103/104/105/109/111/112` exclusions remain unchanged. No no-longer-authorized target was inferred.
- Writes are limited to the designated reviewer directory, this exact ticket review path and unique `batch31-source307-first-review-` command receipts through the existing recorder. Other writers and all author artifacts are preserved.
- No freshness/Grill restart, network, environment change, install, DB/backend, Git, service, shared tool/app/schema change, modern/answer/choice work, publish/promote/deploy, handoff, supervision or other-chat action.

Review, independent source facts, reviewer image ledger and flat current manifest are exclusively created mode 0444. The manifest lists only existing absolute direct leaves under the explicit workspace base, without recursive history pointers, and excludes itself and its own creation receipts.
