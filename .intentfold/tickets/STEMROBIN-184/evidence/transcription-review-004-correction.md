# STEMROBIN-184 Review 004 Targeted Correction Confirmation

Date: 2026-11-15. Scope: **D1, D2 and D3 only**, book `6-8g`, physical pages 0025-0026.

**PASS: all three previously reported locations are corrected and source-faithful at the actual hashes below.** This is not a new whole-page review or an answer task; the initial report remains unchanged.

## Changed Locations

1. **D1 confirmed** at [page 0025, line 85](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0025/page.md:85), `ex 47 open`: current text is `47.* 图14表示的是用活动键联结的直杆及其长度．`. The printed glyph is **键**, and the previous **铰** substitution is corrected.
2. **D2 confirmed** at [page 0026, line 62](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0026/page.md:62), `ex 47 cont`, subpart 1: current text is `离和最小距离．作图表示活动键联结这两种极限情况．`. It now retains the printed **键**.
3. **D3 confirmed** at [page 0026, line 63](/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0026/page.md:63), `ex 47 cont`, subpart 2: current text is `2) 距离$|AB|$能不能取所求得的最大距离和最小距离之`. Both printed vertical distance bars are now present.

For this single targeted confirmation, reopened only the existing direct-source crops for D1, D2 and D3 and compared them with these current durable lines. The full source PNG hashes still match review 004's original source hashes. No new crops or other outputs were written.

## Unchanged Records

Read-only inspection of the current `page.md` fields confirms `printed_lines` remains **26** on 0025 and **13** on 0026. Declared figure boxes remain:

- Figure 13: `[841,793,359,43]`.
- Figure 14: `[151,221,1102,314]`, still `owner-ex 47`.
- Figure 15: `[419,1441,557,380]`.

These are unchanged-record checks only, not a repeated visual row count, figure review or pipeline/finalize run.

## Actual SHA-256

Computed directly using `shasum -a 256`, not copied from metadata.

Source root: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/6-8g/pages/`.

Durable root: `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/`.

| File | Current actual SHA-256 |
| --- | --- |
| Source `0025/page.png` | `078ce552aec6114e776077330e694193f9d1e1489080eb8b364e1d29edf7b79f` |
| Source `0026/page.png` | `14e6d05a5300e6558e67e33f6007c9dfbdd6392d15fe27fd7ca47f06ac6408e9` |
| Durable `0025/page.md` | `6c2937dca6c6985cfa0ef1a46d1c1d225176a5389f151c17e4ebdbcf946f0f3e` |
| Durable `0026/page.md` | `836a20abf726a5a623e29fc388e2477fa666460febc0cf88b6735e1c34c4dd5c` |

Initial report `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/transcription-review-004.md` was not edited. Its current actual SHA-256 is `0e44baa6e2ec9160567eb2cb63de6b4921d12ef538fc3e58e84db1c1a506922d`.

Only this correction report was created. No product/source edits, network access, answer/choice artifact reads, tool changes, tests, pipeline commands or changes to other workers' files were performed. Stop after this targeted confirmation.
