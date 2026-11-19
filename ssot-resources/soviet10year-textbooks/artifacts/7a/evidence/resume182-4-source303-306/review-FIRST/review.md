# FIRST Independent Source Review: NEW303-306

STEMROBIN-182 / chat182-4, 2026-11-19.
Workspace for every command: `/Users/yong/.codex/worktrees/stemrobin-182-resume/lemmadeck`.
Scope: the four NEW source-recovery candidates only. This is neither byte-restoration of lost
ignored drafts, replacement of old review histories, nor a production assignment.

## Verdict

**Overall content: REVISE. Mechanical state: PASS, reused from existing receipts/audits.**

| Physical / Printed Page | Content | Mechanical | Reviewed Rows | Figures |
|---|---|---|---:|---:|
| 0303 / 297 | PASS | PASS | 25 | 0 |
| 0304 / 298 | REVISE | PASS | 28 | 0 |
| 0305 / 299 | PASS | PASS | 28 | 0 |
| 0306 / 300 | PASS | PASS | 28 | 0 |

All 109 printed rows were independently compared, including 105 exercise rows and four page
numbers. One row has a confirmed two-character transcription difference; the other 108 match.
No unresolved source ambiguity or execution fault remains, so no HOLD is imposed.
PASS means faithful content within this scope, not publication permission.

## Confirmed Difference

**F1: 0304, exercise 1021б, printed row 24, candidate Markdown line 67,
JSON `/blocks/3/lines/6`.**

- Source: `流而上和它对开，摩托艇和木排在离A16公里处相遇。`
- Candidate: `流而上和它赶并，摩托艇和木排在离$A$ $16$公里处相遇。`
- Required affected-only revision: `赶并` -> `对开`, on the same row. Do not change the values,
  punctuation, labels, row layout or neighboring text.
- The same erroneous source-observation phrase occurs in candidate Markdown line 24 and JSON
  `/meta/notes/1`; align that candidate note with the corrected observation as part of the same
  affected revision. The historical author report remains untouched.

This is a direct glyph observation, not an inference from solving or wording plausibility.
The initial grid view did not settle the two characters; one indispensable native-resolution
crop settled them. No second crop was needed.

## Row Inventory

Ranges below are inclusive, numbered from the first printed text row, including the final foot.
Every row inside every range was compared with its candidate body, not sampled.

| Page | Block / JSON Index | Printed Rows | MD Lines | Result |
|---|---|---|---|---|
| 0303 | 1015 cont / 0 | 1 | 37 | PASS |
| 0303 | 1016 / 1 | 2-9 | 40-47 | PASS |
| 0303 | 1017 / 2 | 10-18 | 50-58 | PASS |
| 0303 | 1018 open / 3 | 19-24 | 61-66 | PASS |
| 0303 | foot / 4 | 25 | 69 | PASS |
| 0304 | 1018 cont / 0 | 1-3 | 38-40 | PASS |
| 0304 | 1019 / 1 | 4-9 | 43-48 | PASS |
| 0304 | 1020 / 2 | 10-17 | 51-58 | PASS |
| 0304 | 1021 / 3 | 18-26 | 61-69 | REVISE: F1 at row 24 only |
| 0304 | 1022 open / 4 | 27 | 72 | PASS |
| 0304 | foot / 5 | 28 | 75 | PASS |
| 0305 | 1022 cont / 0 | 1-13 | 37-49 | PASS |
| 0305 | 1023 / 1 | 14-24 | 52-62 | PASS |
| 0305 | 1024 open / 2 | 25-27 | 65-67 | PASS |
| 0305 | foot / 3 | 28 | 70 | PASS |
| 0306 | 1024 cont / 0 | 1 | 38 | PASS |
| 0306 | 1025 / 1 | 2-10 | 41-49 | PASS |
| 0306 | 1026 / 2 | 11-16 | 52-57 | PASS |
| 0306 | 1027 / 3 | 17-25 | 60-68 | PASS |
| 0306 | 1028 open / 4 | 26-27 | 71-72 | PASS |
| 0306 | foot / 5 | 28 | 75 | PASS |

Focused source checks, independently observed:

- 0303 1015в: `3/(x^2-9) - 1/(9-6x+x^2) = 3/(2x^2+6x)`; ex 1016
  retains `拦路竿`; ex 1017 fractions are 4/7 and 2/3.
- 0304 1021а prints `他划行6公里` with no preceding 1; its following rows print
  `后停桨，于是按照从N地出发的时间起算，经过4小时30分钟后`,
  `船随着河水又回到N地`, and `90米/分`.
- 0304 1021б prints `木排开出经过3小时20分钟后`, the crop-confirmed `和它对开`,
  `在离A16公里处相遇` with a distinct 1 before 6, and `15公里/小时`.
  Values 6 and 16 are separate source facts and both already correct in the candidate.
- 0305 1023а prints `行驶前24公里`; all three 1022 subquestions and both 1023
  subquestions retain their source order and actual row breaks.
- 0306 1026 retains 50cm, 450m, 75周, 400周 and 0.2秒; 1027 prints `定货`.
  1028 row 27 visibly ends `但仍`, without punctuation or an additional character.
- Candidate sublabels use Cyrillic а U+0430, б U+0431 and в U+0432; formula notation,
  minus signs, punctuation and printed page numbers were checked. No figure, table,
  caption, diagram panel or figure association is present on any of these four source pages.

## Boundaries

All five boundary structures PASS; foot blocks are separate and transparent.

1. **302 -> 303, 1015:** only existing 302 tail TEXT was inspected. Its `ex 1015 open`
   ends with б) and a semicolon; new 303 `ex 1015 cont` supplies в) and closes.
   No 302 image was opened and no passed 302 source review was repeated.
2. **303 -> 304, 1018:** `open` ends `停车$18$`; `cont` begins `分钟。为了按照时刻表`.
   The continued object closes before 1019.
3. **304 -> 305, 1022:** `open` ends `公共汽车`; `cont` begins
   `由$A$城向$B$城开出$2$小时后`. It closes before 1023.
4. **305 -> 306, 1024:** `open` ends `如果河水的`; `cont` begins
   `流速等于$2$公里/小时`. It closes before 1025.
5. **306 -> existing 307, 1028:** new 306 `ex 1028 open` visibly ends `但仍`;
   existing durable 307 TEXT starts `ex 1028 cont` and
   `甲比乙队提前 $2$ 天完成生产任务。甲、乙两拖拉机队每`.
   The referenced 307-FIRST record separately marks the six 1028 continuation rows PASS.
   Its historical overall HOLD concerns 1030, not this boundary; it was not treated as a
   blanket page PASS or replaced. No 307 image or passed 307 review was reopened.

The literal right-hand concatenation includes:
`甲队比乙队每天少耕地3公顷，但仍甲比乙队提前2天完成生产任务。`
This record preserves both source-bound sides. The wording is not a transcription finding
against new 306 and is not silently deleted, rewritten, solved or classified as an erratum.
Boundary PASS proves object identity, flags and literal concatenation, not a new semantic edit.

## Frozen Evidence

The full absolute-path SHA-256 inventory is in `review.json`: four viewed grids, four
native source PNGs, all twelve current candidate files, four receipt records/stdout files,
the author report, and the two external text sources plus the 307-FIRST record.
Source/candidate hashes were measured before review and unchanged after visual review.
The PDF hash is retained metadata, not an independently rehashed PDF.
Author observations and its pre-finalize draft hashes are not the authority for current
finalized candidate bytes.

| Page | Current page.md SHA-256 |
|---|---|
| 0303 | `72c467c0fe3983cebfbf1ed64f2146885c79203ef9a92f56316a4dd59f5319e8` |
| 0304 | `8620a0783c45dbc358daf3e147f080dd1833dfbbffc7c121efe3a46031d6a578` |
| 0305 | `c67027e180dd9b30f558d8909e0d00e4d2d601be05fef93e515da77fd242ef36` |
| 0306 | `c4f3434d33397c842199f93cdfd0ed835ab37711525ab5b8dc31249bfa878eb6` |

## Image Accounting

One bounded batch; sequential full-page views, each exactly once:
0303 grid, 0304 grid, narrow 0304 crop, 0305 grid, 0306 grid.
Actual batch/context images: **5/5**, limits **8/24**.
Four full-page views, zero full-page reopens, one native crop, zero neighboring images.
The crop was held in memory only; no crop file was written.

Crop: native 0304 `page.png`, XYXY `[260,1738,1300,1803]`, 1040 x 65,
no resize; PNG SHA-256
`b990992357b3e7790bea9a82d88ed39a11303d13a0eedb158a6065dd5be44d05`.
Only text, report paths and hashes are returned to the caller; no image payload.

## Execution And Stop

Read the requested readme, engineering, operations, lesson skill, production-resume reference
and image-batch rules. Reused the four already completed normal FIRST finalize receipts,
each exit 0 and 25/28/28/28 rows. Did not execute finalize, a producer or tests.
Read-only structured inspection confirms Markdown/JSON metadata and body consistency on all
four pages; stored audits have zero errors, figures, normalizations, unknown characters,
KaTeX warnings and errata. Mechanical PASS does not override F1.

No browser, network, database, paid call, dependency change, Git command, worktree operation,
thread/agent/contact operation, answer, choice, solve or errata work occurred.
No candidate, source, author report, existing review history or other edit was changed.
Only this `review.md` and sibling `review.json` were written, with `apply_patch`.
Stop here. A separate affected-only followup owns F1; no rerun or further stage is authorized.
