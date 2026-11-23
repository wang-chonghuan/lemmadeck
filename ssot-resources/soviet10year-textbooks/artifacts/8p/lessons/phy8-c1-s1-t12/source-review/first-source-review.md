# STEMROBIN-180/180-7 Summary First Independent Source Review

Verdict: **PASS**, original-source fidelity and selected summary closure only.

Date: 2026-11-23. Target: `phy8-c1-s1-t12`, "第一章提要".
Role: sole independent source reviewer, not the author. Every shell command
used explicit cwd `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
This is the first independent original verdict for this summary. No genuine
content defect, source repair, or affected content revision was requested.

## Scope and Reused Approval

Read current lesson cap1, production-resume SOP, soviet-cn profile, and the
shared image-batch rules before the source observation. Reused page52's existing
FULL-page independent PASS from raw n10
`../phy8-c1-s1-n10/source-review/first-source-review.md` and its
`first-source-bindings.json`. Page52's current durable `page.md`, `page.json`,
and `audit.json` SHA-256 values match that prior binding exactly. No page52
image was reopened and no passed page was refinalized or independently
reviewed again.

New visual scope: FULL physical page53 / printed41 against its current durable
`pages/0053/page.md`, `page.json`, and `audit.json`, including the entire
blank lower page, margins, and footer. Read the retained first author report,
first-failure snapshots, original execution/streams, and actual parent
`finalize-counter-recovery` execution/streams. Counter report/results were
read as technical history only; no tests or source stages were rerun.

## Whole-Original Row Correspondence

References are one-based `page.json` block positions. Each row below was
independently compared with the whole original, not inferred from the counter.

| Print row | Source reference | Faithful retained text |
| --- | --- | --- |
| 1 | `p0053#1` row1 | 位置，即它的坐标，随时间而改变. |
| 2 | `p0053#2` row1 | 为了求物体在任意时刻的坐标，需要知道物体的初始坐 |
| 3 | `p0053#2` row2 | 标和位移矢量. 物体坐标的变化量等于位移矢量在坐标轴上 |
| 4 | `p0053#2` row3 | 的投影. |
| 5 | `p0053#3` row1 | 最简单的运动形式，是匀速直线运动. 在这种运动中，需 |
| 6 | `p0053#3` row2 | 要确定的只是一个坐标，这是因为可以沿着物体运动的方向 |
| 7 | `p0053#3` row3 | 作为坐标轴. 根据公式 |
| 8 | `p0053#3` row4 | `$x=x_0+vt$，` |
| 9 | `p0053#3` row5 | 可以计算物体（质点）在任意时刻的坐标$x$；式中$x_0$是物体的 |
| 10 | `p0053#3` row6 | 初始坐标，而$v$是物体速度矢量在$X$轴上的投影. 根据上式 |
| 11 | `p0053#3` row7 | 计算时，式中各量的符号由习题的条件确定. |
| 12 | `p0053#4` row1 | 任何运动都是相对的. 这就是说，物体相对于彼此作相 |
| 13 | `p0053#4` row2 | 对运动的不同坐标系的位移和速度，是不同的. |
| 14 | `p0053#5` row1 | 静止也是相对的. 如果物体相对于某个坐标系是静止的， |
| 15 | `p0053#5` row2 | 那么，还存在有物体相对于它是在运动的参照系. |
| 16 | `p0053#6` row1 | 41 |

Block row counts: **1, 3, 7, 2, 2, 1**. Actual original / Markdown /
JSON / current audit: **16 / 16 / 16 / 16**, comprising 15 prose/formula
rows and one footer. The read-only native comparison found identical
Markdown/JSON metadata, block types, continuation flags, and line arrays.
The original raster hash matches the durable render identity.

The standalone formula is `x=x_0+vt`, with subscript zero, addition, and
the product `vt`; it occupies one printed row and ends with a comma outside
the math delimiter. Checked inline `x`, `x_0`, `v`, and uppercase `X` against
the actual glyphs. The wording correctly identifies initial coordinate and
the velocity vector's projection on the X axis, and retains the statement
that problem conditions determine signs. No unit label is printed on page53;
none is missing or invented. No new source erratum was established.

Page53 has five prose blocks; headings, exercise headings, exercises,
subquestions, figures, tables, captions, and running headers are all absent.
The printed 41 is a footer, not prose. Its flanking dots are ornaments.
Left-margin ink groups, including the isolated group near y1871..1907,
are scanning debris, not an omitted row, figure, or caption. The large blank
area below the final complete paragraph contains no continuation text.
No padding row, artificial formula break, or false `samerow` is present.

## Selected Summary Closure

The unchanged, already approved `p0052#8` is the heading "第一章提要".
Its `p0052#9` opening row is
"物体（质点）机械运动的现象，是物体相对于其他物体的", marked `p open`.
Newly verified `p0053#1`, marked `p cont` and not `open`, completes this as:

"物体（质点）机械运动的现象，是物体相对于其他物体的位置，即它的坐标，随时间而改变."

The summary then includes `p0053#2..5`, ending exactly with
"那么，还存在有物体相对于它是在运动的参照系." All those paragraphs
are complete; the final block has no trailing `open`. Exclude page52
blocks1..7 (n10), both page footers, and all next-chapter content.
Selected summary rows: 1 heading + 1 page52 opening row + 15 page53
prose/formula rows = **17 non-footer rows**, yielding five complete prose
paragraphs after joining the opening continuation.

The current TOC assigns this summary printed40 and the next same-level section
`phy8-c1-s2`, "第二章　变速直线运动", printed42, with its introduction also
printed42. Together with the reviewed printed41 ending and the established
physical/printed offset, this agrees with the caller's boundary before
physical54#1. The source author's earlier intended printed40..42 /
physical52..54 span is historical planning, not a reason to include page54
in this summary. That report remains unchanged.

Page54 was not opened, inspected, reviewed, approved, finalized, or hashed
here. Its caller-reported 22/21 counter failure belongs to the next chapter
and does not leave an unresolved continuation in this selected summary.
No approval of the unread next chapter or its heading glyphs is claimed.
No assembly or raw-summary promotion was performed or approved.

## Failure and Recovery Remain Distinct

Page53's original first failure is retained unchanged:

- `pages/0053/finalize-first-failure/{page.md,page.json,audit.json}`;
- `pages/0053/source-finalize.execution.json`, `.stdout`, and `.stderr`;
- `pages/0053/source-author-report.md`.

The original execution reports exit1, 17 counted / 16 authored rows,
zero normalizations, and the single row-count error. The failed audit
remains 17/16. Current `page.md` and `page.json` are byte-identical to their
first-failure snapshots, including metadata and block content. Only the
current audit differs. This is **zero content revisions**, not a repaired
or second content verdict.

The parent recovery evidence at
`pages/0053/finalize-counter-recovery/{execution.json,stdout.txt,stderr.txt}`
reports the actual page53 child argv and the authorized absolute cwd,
exit0, 16 counted / 16 authored rows, and zero normalizations. Both original
and recovery stderr streams are empty. Current audit errors,
normalizations, unknown characters, KaTeX warnings, and errata are empty.
These execution facts corroborate but do not establish this independent PASS.

The existing p53-only technical report/current-final results preserve focused
11/11 PASS, empty-core guard2/2 PASS, and prior-focused13/13 PASS.
The shared original run still has 4 failures and 2 skips across 47 tests,
and the combined runner exit is 1. Neither the narrow Planck fragment
repair nor those focused counter results approve source content, clear the
shared failures, or approve unrelated pages. All original counter failures
and candidate history remain untouched.

## Images, Binding, and Limits

Opened exactly once:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/.tmp/ld-s10y-lesson/8p/pages/0053/page.grid.png`.

Actual image use: **1 baseline, 1 total**, batch allowance <=8; 1 image in
this fresh context. Reopens0, crops0, page52 opens0, page54 opens0, other
images0. No raster was regenerated. Grid and raster hashes in the companion
`first-source-bindings.json` describe the observation; cache paths are not
durable lesson dependencies. The durable page supplies original PDF identity.

Writes are limited to the target raw summary's `source-review/` report and
binding. No candidate, source, shared-tool, app, schema, environment, Git,
DB, install/update, model-call, publish, answer, choice, figure-generation,
display, new-chat, timer, or inter-chat-message action was taken.
No additional reviewer was activated. New paid calls0.
Caller-reported parent completion32, n10 push, paid69, and image23/24
remain caller history, not new executions or usage in this review.

This PASS covers only the newly reviewed original page53 plus selected-summary
closure using unchanged page52 approval and the TOC. It grants no downstream
assembly, edition, answer, choice, figure, display, Git, or DB approval.
If source bytes genuinely change, preserve this original verdict and perform
affected-only followup; a counter-only change does not constitute a content
revision or invalidate unchanged content findings.
