# STEMROBIN-180/180-3 B83: recovered independent SOURCE review, 7p467/468

Date: 2026-11-18.
Exact checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Branch identity from existing ticket metadata: `codex/STEMROBIN-180-textbooks`; no Git command was run.
Scope: ONLY the missing independent SOURCE review, one review of the current candidate per page.
Overall verdict: **REVISE**, not PASS and not a scientific/content HOLD.

## Recovery facts and independence

The human reports prior reviewer Lorentz `01a1ef96-9999-78b1-b94d-6390ae3df12d` errored with a disconnected stream, was collectedclosed, and produced no PASS. At recovery entry both the assigned `tmp/b83-source-next-review/` directory and this durable file were absent; the scoped ticket-scratch inventory found no actual partial output in that assigned location. No prior output was deleted, replaced or silently assumed valid.

Prior failed-reviewer image/token usage remains **UNKNOWN, not zero**. A transport failure is neither human pause nor scientific verdict. This run recovered only that missing review; successful authors/prepares/finalize/vectorize were not rerun.

Original467 was read whole first and independently frozen before original468. Original468 was then read whole and independently frozen. Both full source text/object inventories existed before any candidate page.md/page.json/audit.json or author report was read. Next, all four whole PNG crops were inspected and their observations frozen. Candidate artifacts were then read in full, followed by the author report. No neighboring image, grid, SVG, SVG rasterization, modern figure or lesson rendering was inspected.

## Per-page decisions

| Physical / printed | Independent rows / candidate audit | Full source objects | Verdict / exact outstanding defects |
| --- | --- | --- | --- |
| 467 / 456 | 23 / 23, 15 blocks | ex181-189, exhead, fig397/398, two same-row caps, foot | **REVISE**: nine source halfwidth sentence stops replaced by fullwidth 。. |
| 468 / 457 | 22 / 22, 15 blocks | ex189 cont plus ex190-198, fig399/400, two caps, foot | **REVISE**: eight source halfwidth sentence stops replaced by fullwidth 。; ex194's Latin a loses source bold-italic weight. |

The existing mechanical finalize PASS23/23 and22/22 receipts are unchanged. They establish row-count/whitelist/formula checks, not complete source fidelity. Both current audits have normalizations=[], unknown_chars=[], katex_warnings=[], errors=[] and errata=0; these empty lists do not excuse the independently observed defects.

## Exact Source Defects

Candidate paths are below the absolute checkout's `.tmp/ld-s10y-lesson/b83-source-next/artifacts/7p/pages/{0467,0468}/`. Line numbers refer to current page.md; the same text is in current page.json. Block identities are one-based `pNNNN#N`. Source coordinates refer to the original 1472x2161 whole page; supplied y bands locate the ink within the full text strip x170..1350, not a newly calculated tight glyph crop.

Every listed candidate `。` must retain the source small baseline `.` instead, including the printed separation after intra-row stops. Bound profile `soviet-cn.json` line15 specifies `sentence_period: "."`; line33 explicitly rejects fullwidth sentence stops. Paired parentheses are not being assigned an invented Unicode family from identical raster glyphs.

| Page / block / current page.md line | Current token -> source token | Original-page source pixel y strip |
| --- | --- | --- |
| 467 / p0467#1 / 61 | `中子。那么` -> `中子. 那么` | 174-213 |
| 467 / p0467#3 / 71 | `$252$)。若` -> `$252$). 若` | 537-572 |
| 467 / p0467#3 / 72 | `运动的。` -> `运动的.` | 598-631 |
| 467 / p0467#7 / 85 | `一电路。试` -> `一电路. 试`; `来。` -> `来.` | 897-931 |
| 467 / p0467#12 / 102 | `灯。` -> `灯.` | 1607-1641 |
| 467 / p0467#13 / 105 | `电铃。试` -> `电铃. 试` | 1668-1703 |
| 467 / p0467#13 / 106 | `按响。` -> `按响.` | 1728-1762 |
| 467 / p0467#14 / 109 | `电路。回答` -> `电路. 回答` | 1788-1821 |
| 468 / p0468#2 / 66 | `析出。` -> `析出.` | 279-313 |
| 468 / p0468#2 / 67 | `迁移。这` -> `迁移. 这` | 340-374 |
| 468 / p0468#4 / 75 | `强度大。` -> `强度大.` | 577-612 |
| 468 / p0468#7 / 85 | `示数。` -> `示数.` | 1000-1033 |
| 468 / p0468#11 / 98 | `不同的。` -> `不同的.` | 1524-1558 |
| 468 / p0468#12 / 102 | `电阻率。口` -> `电阻率. 口` | 1643-1677 |
| 468 / p0468#13 / 107 | `电阻。` -> `电阻.` | 1823-1857 |
| 468 / p0468#14 / 111 | `小一半。问` -> `小一半. 问` | 1943-1980 |

Additional formatting defect: physical468 p0468#10/ex194, page.md line94, page.json `blocks[9].lines[0]`, `由图 $286$，$a$ 所示`. Original a near x765..805/y1404..1439 is visibly bold italic. Plain `$a$` preserves Latin/slant but has no source-bold marking. Preserve the bold-italic source math letter without changing figure286, the letter identity or its reference role.

## Full Coverage and Boundaries

Every source row, word, quantity, character sequence, stop/question/colon/comma/parenthesis position, bold/italic role, figure-caption identity, type and continuation was compared. Full 15-block row-by-row tables with exact source bands and candidate locations are in the two hash-bound comparison files below.

467: ex181 is new/complete; all nine exercises retain their wording, 8/8, external252,397/398, two-lamp/three-room/two-minute quantities and footer456. `183.-` retains its actual extra horizontal mark. Bold `电流强度、电压和电阻` is correctly typed exhead, not h3 or prose; existing assembly/group-style semantics represent its heading weight, with no render claim. Both captions occupy the same source row and398 correctly has samerow=true. Ex189's Latin italic a/b/c sequence and all three question parts are retained. Only189 is open, ending `在两分钟内通过安培计的`.

468: exact incoming `电量是多少？` is ex189 cont, closes189(c), and adds no new exercise. Ex190-198 are new and complete. Ex191 correctly keeps `纯银 问在` with no discernible source dot; no stop is invented. Ex194 retains10 minutes/external286/Latin a, subject to the bold-weight defect. Ex196 retains the external table,1 square millimeter,2/10/100 meters and Latin italic a/b/c. Ex197 retains1 meter,2/4/0.5/0.01 square millimeters and complete Latin italic a/b/c/d, with distinct c/d. All five square-unit exponents use `$^2$` outside CJK text. No displayed formula or scientific erratum exists. Ex198 retains `拉长一倍而粗细则减小一半`, ends complete in a question mark, and has no outgoing open. Footer457 is retained.

Whole-course owner and external figure252/286/table availability remain UNKNOWN. No local missing figure, extra page object, owner or modern/scientific claim is invented from those references.

## Actual Whole-Crop Coverage

| Actual PNG / existing box x,y,w,h | SOURCE whole-crop verdict |
| --- | --- |
| 467 fig397 / [337,1051,269,387] | **PASS coverage**: complete battery/top-terminal contours, intermediate tilted rectangular device, upright circular-top object, switch, all wires and lower bases. White beyond each outer extreme; no diagram part is cut. |
| 467 fig398 / [876,1051,318,386] | **PASS coverage**: battery plus/minus, analog meter0/2/right-end4-like contour, needle/ticks/frame/bottom terminals, upright object, switch, complete wire return and all bases. |
| 468 fig399 / [484,647,596,208] | **PASS coverage**: both complete circuits in one group, both A/scales/ticks/needles/pivots/contacts, both crossed-circle lamps, all wires and cell plates. |
| 468 fig400 / [290,1079,941,231] | **PASS coverage**: all three full meter panels, complete frames/lower corners, scales/ticks/needles/numeric contours and original spacing. |

Fig399's small terminal digits remain4/10-like unresolved contours; fig400 middle-left has a5-like contour with possible minus. Whole originals and actual PNG crops preserve all of those source strokes faithfully. Raw-crop coverage may PASS without converting ambiguous embedded ink into a guessed label. Fig397's heavy top/terminal ink is likewise not authority to add an independently labeled minus. No crop defect or modern geometry claim was found.

Separate vector-only review is **pending**. Existing author receipts report once-per-page vectorize PASS (3970.000%,3980.006%,3990.004%,4000.000%), but no SVG was inspected, reprocessed or independently approved by this run.

## Actual Usage and Unchanged Stages

Current recovery actual image loads=**6**, current/peak image-bearing context=6, <=8 batch and<=24 context; no reopens:

1. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-source-next/7p/pages/0467/page.png`
2. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-source-next/7p/pages/0468/page.png`
3. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-source-next/7p/pages/0467/figures/fig-397.png`
4. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-source-next/7p/pages/0467/figures/fig-398.png`
5. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-source-next/7p/pages/0468/figures/fig-399.png`
6. `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b83-source-next/7p/pages/0468/figures/fig-400.png`

Author's existing reported image usage=6 in its separate context; prior failed reviewer usage=UNKNOWN. Across these named roles, known image usage is12 plus UNKNOWN, not a reset/zero or a claimed whole-ticket total. Current actual token total is not exposed to this reviewer and is UNKNOWN, not zero; prior tokens likewise UNKNOWN. No image-generation or paid tool call was made.

Current recovery calls: prepare0, finalize0, vectorize0, render0, source candidate edits0, automatic re-reviews0. No descendants/chats/Git/DB/publish/tests/build/toolpatch operations. Every shell command used the exact checkout as explicit workdir. Only the assigned review directory and this durable file were written. All existing stages, candidate bytes, figures, author files and unrelated work remain unchanged.

## Current Input / Report Hashes

Full current reviewed-input manifest (31 entries, all SHA256 rechecked OK; no SVG input):

`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-source-next-review/input-sha256.txt`

SHA256: `9ce2dea9a07c7ee7360824e01ce23c3cad1e849d153cabbbc9130724b1cefab4`.

Core current input bindings, all measured from actual files:

| File under the named checkout | SHA256 |
| --- | --- |
| source467/page.png | 01132a8516471adb656b0a9e46a3706dc5adfdf6142b8d805c23607f4a6db7e9 |
| source468/page.png | ba0eb1b9b95961221489431f45424ec11b16aff0d46563fc63f555c9123f71e3 |
| source467/figures/fig-397.png | e0ebd77548f0e64f484e9bb281e4741b6b22c8c310d4e926631712c7de1a1e52 |
| source467/figures/fig-398.png | 00986309223f8393f53cc6fdcd7eb5e2e7efaae881c2ab154c181a05da267cca |
| source468/figures/fig-399.png | b73b024e750a1dfa3c8114512acff361c68071603822d91d8c0596b7fd10b5d0 |
| source468/figures/fig-400.png | 58a6568d59a507c0e3ec50950cf398e8672c2ca782a70a9cd386f4d1fbbbdfc9 |
| candidate467/page.md | 6183048ccba0cfbba9efb126081b994ed0da8b10019b185ce2c875ac66c0d8f2 |
| candidate467/page.json | 267aefbeb4a3be5f7470f6f07114f2b5223ce130c784999094f6c03461b54101 |
| candidate467/audit.json | fd425b66558da770d701735004ff53c971bfb17aae6c725a40eebff02d69602f |
| candidate468/page.md | 8fcf39d812834c7fb9e495a95bce9dbcfa39cfcc88e655ef71f0217f58745a2e |
| candidate468/page.json | ebaac76638057b9a6c0b67debc35197514aa8ad03868caa3a27c6f933dc5ef41 |
| candidate468/audit.json | dca12e48189f07b124f5fed398cd9b892f0ab87a1f0d9de4ed91b3079861331c |
| author/report.md | 8ba9e709840564790b2260e2a4cf9953e5f145933e353454573f5cb9a748888a |
| author/changed-paths.sha256 | 9ca0f4053ae4de4f0043a9eda8e44dc59e02bcad725f94027ff481266f3e8a42 |

Here sourceNNN expands to `.tmp/ld-s10y-lesson/b83-source-next/7p/pages/0NNN/`, candidateNNN to `.tmp/ld-s10y-lesson/b83-source-next/artifacts/7p/pages/0NNN/`, and author to `.intentfold/tickets/STEMROBIN-180/tmp/b83-source-next-author/`; the manifest has every full absolute path. Original-page measured SHA matches each candidate render.sha256; profile measured SHA matches both candidate profiles. PDF SHA46e2b2e4a92b7c00fab9adfc6a8a9b5340a9519fa90f1b82e79bc1e1432fcbb0 is existing source metadata only, not a fresh PDF read.

New independent evidence under `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-source-next-review/`:

| Evidence file | SHA256 |
| --- | --- |
| expected-0467.md | 005fd2ce6c8d28fcf8303a119b02a8713d8de1a2c4900edd00b5b974a6a5bee3 |
| expected-0468.md | 788d4f703eb83574f1b17cb11710b26f70b7938dcc45b24b158295ee7821455b |
| crop-observations.md | ce47d647174a09e1fe002ea8cc17325f6c2b2ee517a5d6d83b3ced9187963cfb |
| comparison-0467.md | d8f8eedc5154f76c2437c3cadb03adec957b5a99d0a105cd8dc5880218fac65d |
| comparison-0468.md | 13057f05f896c9ac5498e7db2bb6125c5091fbe9af3bad622f413c6ff98e76c6 |

The external `report-sha256.txt` in the assigned review directory binds these files, the input manifest and this final durable report; this report intentionally does not embed its own self-hash. The external manifest hash is returned with the review result.

No affected correction or re-review is authorized by this report. Both page verdicts remain REVISE on these exact candidate hashes; four raw-crop coverage PASS decisions are limited to the reviewed PNGs and do not authorize vector review, assembly, retention or publication.
