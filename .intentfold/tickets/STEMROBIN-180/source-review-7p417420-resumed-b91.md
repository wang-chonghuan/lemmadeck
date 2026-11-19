# Independent SOURCE Review: Resumed B91 7p417-420

**REVISE.** Exactly STEMROBIN-180 / 180-4 physical 417-420. Page 420 is the next-lab boundary only. This review neither delivers n160 nor approves downstream stages.

## Findings

1. **[P1] Physical 418 drops a source unit glyph.** `p0418#6`, row 1: original pixels read `400万千瓦`; frozen MD line 82 and corresponding JSON read `400万瓦`. The permitted source-only detail crop confirms `千`. Restore that glyph only, preserving the printed row, punctuation and surrounding historical prose. This is a factor-of-1000 unit change, not source normalization.
2. **[P2] Physical 420 omits slanted 物体 spans.** Source title/purpose/apparatus and supplement pixels show five occurrences: `p0420#2` row 1, `#3` row 1, `#4` row 1, `#11` rows 2 and 4. Frozen MD lines 123/126/129/153/155 and JSON preserve characters but omit the slanted style; `meta.source_typography` has no equivalent span records. Restore only those spans, retaining bold title weight. Do not extend italics, rewrite text or regenerate the table.

The parent owns affected repair. Candidate/source files were not edited. No unresolved ambiguous glyph remains; ambiguous BLOCKED count is zero. Historical FIRSTREVISE/HOLD evidence was not re-evaluated or changed.

## Substantive Comparison

Four full original pages were independently read and their row observations frozen at 0444 before any candidate prose. All 40 blocks, 80 text rows and the one full table were then compared, not merely hashed. Author notes and historical reports were not used as pixel truth. `independent-comparison.md` was frozen before the author report was read.

| Physical / Printed | Blocks / Rows | Current Verdict |
| --- | --- | --- |
| 417 / 406 | 11 / 26 | PASS |
| 418 / 407 | 8 / 26 | REVISE: missing 千 |
| 419 / 408 | 9 / 12 | PASS |
| 420 / 409 | 12 / 16 | REVISE: slanted spans; boundary only |

417 retains a closed first `p cont`, all glyphs/names/numbers/punctuation/printed row breaks, no invented heading, and exact quote under-dots: 17 first-row characters through 电气 plus second-row 化 only. Introduction, quotation marks and final stop are outside the span. Slanted 406 and two footer dots are retained.

418 retains all other glyphs and row breaks, first 原子能-only bold scope, printed 冈 (not 坎), short name hyphen, historical claims, and slanted/dotted 407. No figure or task is invented. Equal 26-row audits cannot detect its missing 千.

419 retains the concluding political prose/double dash, bold 问题, four separately numbered questions, bold 练习74 and one unsplit two-row smaller/heavier task, with no invented map. Slanted/dotted 408 agrees.

420 retains the actual 实验作业 and 一、用天平测量物体的质量 headings, bold purpose/apparatus prefixes and procedure/supplement headings, three procedure items, 0.1克 precision, and three-character 替换法 under-dot metadata. Slanted/dotted 409 agrees. Last paragraph is `p0420#11 open`, ending exactly `使天平再次`. No 421 reading or tail inference; no invented 164 heading/global course identity.

## Table Subset

**PASS: unchanged SOURCE table PNG/SVG only.** Full PNG compared to original-page inventory: two headers 实验次数 / 物体的质量（克）; trial numbers 1/2/3; all three mass entries blank; heavy top/bottom rules, thin header rule, central partition and source scan gaps; no outer side borders or internal trial-row rules. No added data.

Exact box `[200,1288,1153,323]`; existing integrity records 12 blank-padding pixels and crop equality. Existing vector receipt records 0.036% mismatch and exit 0. SVG was not re-rendered or previewed; this review reuses that exact receipt and binds its unchanged output. Table PASS is not physical 420 prose, lab completeness or downstream approval.

- PNG SHA256: `589721e2f7316fdc64787d9daf7ab461baa87c9b3e99f32e3e6333f0785b3ac8`.
- SVG SHA256: `b40e7aa6b6d6471a215a05cd8f176bedffa20fde4dbe0fa1446a6f91f31434d1`.

## Exact Evidence

Working directory for all 23 exec calls: `/Users/yong/.codex/worktrees/stemrobin-180-resume/lemmadeck`.
Review evidence: `.intentfold/tickets/STEMROBIN-180/tmp/resume-180-4/n164-source-review/`. All notes, review, generated evidence and manifests are 0444; original inputs remain unchanged. `manifest.json` binds every newly written review artifact except itself. No input package/PDF/runtime was copied.

Actual delivery manifest SHA256 `95fd87c7c9e1520060a6b5777daa407401cdbea20c94cc897ce63d2d601ccec4`, 34384 bytes, 0444. All 14 exact delivery entries were bound using actual `.files[].source` and `.copy` path/bytes/sha256/mode objects. Four MD/JSON pairs agree; source PNG hashes agree with their render metadata.

`approval-subset.json` SHA256 `1d266771a3f0dddea78355559243760319cb321dcebc48c599b98f4cfdf61d8d`: exactly six page files (417/419 MD/JSON/audit), plus two separately approved table assets. All six 418/420 page files are explicitly withheld as REVISE, not silently approved. Existing frozen paths are referenced, not copied.

`verification.json` SHA256 `4e719575fa43c81c523ebdab8b97223fb15660782ca17b7bc84dced21f14f5c4` records all 80 independent-transcript comparisons, MD/JSON agreement, per-block coverage, exact source/copy bindings and reused receipts.

Reused, never rerun: four actual `b91-n164-source-finalize-0417/0418/0419/0420-1` exit-0 receipt trios; one `b91-n164-source-vectorize-0420-1` exit-0 trio; one `b91-n164-source-integrity-1` exit-0 trio and frozen integrity JSON. All selected by exact actual receipt paths. Gate success is mechanical evidence, not source approval.

Author report SHA256 `47690e5773b265dac9f447b2a2c9b4db80460b930146606364f84d6df27a1876` was read only after independent source observations and frozen candidate comparison. Its authority remains `AUTHORED_NOT_INDEPENDENTLY_APPROVED`; its claim that values/typography were retained does not override the two current pixel findings.

## Usage And Boundary

One batch: **8/8 images**, context **8/24**. Four full originals once, one full frozen table PNG once, three specific source-only detail crops once. No other reopen, preview, screenshot, grid image or image-bearing delivery. Tool ledger: 23 exec, 8 view_image, 6 apply_patch, 3 parallel wrappers (10 exec children); 37 leaf operations / 40 including wrappers / 30 top-level calls. No retries or execution failures.

New prepare/finalize/vectorize/assemble/integrity-producer/model/dependency/web/backend/env/DB/Git/app/test/modern/answer/choice/production calls: zero. No shared main, old worktree, chat/agent access or delegation. Original historical 417/418 FIRSTREVISE and 419/420 evidence HOLD remain immutable and do not count as current failures or successes. Parent receives text/hash-only result and handles affected repair.
