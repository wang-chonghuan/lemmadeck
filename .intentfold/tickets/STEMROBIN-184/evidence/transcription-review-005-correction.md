# Transcription Review 005: Targeted Repair Confirmation

Date: 2026-11-15.

Root: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

Scope: **F1 and F3 repair confirmation only**, with explicit preservation of F2's page-28 literal-glyph uncertainty. This supplements, and does not edit or replace, `transcription-review-005.md`.

## Targeted Findings

### F1: Page 27 Word Repair Confirmed

Current durable file:
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0027/page.md:93`

```text
空的子集合，使得点$O$在分别属于两个子集合的任意
```

The previously incorrect `两个点集` at this location is now `两个子集合`, matching the independently inspected source wording recorded in the initial report.

**Targeted repair PASS: F1 closed for the current page-27 Markdown hash below.** This is not a new whole-page review.

### F3: Page 30 Emphasis and Explanation Confirmed

Current durable file:
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0030/page.md:84`

```text
**单位线段**）．于是，对于任一距离$|AB|$，都有一个数，即距离
```

Current frontmatter `notes` at line 23:

```text
原书术语“单位线段”带波浪下划线；文本层以Markdown强调保存，不重绘印刷波浪形。
```

The term is now Markdown bold. The note explicitly preserves the fact that the printed source uses a wavy underline and explains that the text layer represents it as emphasis rather than a facsimile of the printed wave.

**Targeted repair PASS: F3 closed for the current page-30 Markdown hash below, under the requested emphasis-plus-provenance representation.** The actual printed wave is not claimed to have been recreated; no rendering or whole-page review was performed.

### F2: Page 28 Literal Glyph Remains Unresolved

Current durable file:
`ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0028/page.md`

Frontmatter `notes` at line 23:

```text
第49、51题题号后的升高圆标在扫描中呈实心，无法仅据此确定是印刷实点或墨填圆环；沿用度号转写，字形待核，已保留升高标存在这一事实。
```

The exercise prefixes remain `49.°` at line 68 and `51.°` at line 77. The note accurately retains the uncertainty: the raised mark looks solid in the scan, but these pixels do not establish whether it was a printed solid point or an ink-filled ring. The degree-like transcription remains provisional and explicitly needs source verification.

**HOLD remains: F2 is not closed.** Recording the uncertainty is not proof that `°` is the literal original glyph. No page-28 literal-glyph PASS is issued.

## Counts and Boxes

Current Markdown frontmatter records `printed_lines` **22 / 22 / 20** for physical pages **27 / 28 / 30**, respectively. These match the user's reported re-finalization counts and the initial independent row ledger. No new source-row count or pipeline execution was performed.

Current frontmatter figure boxes and block-header boxes agree and match the initial review:

| Physical Page | Figure | Unchanged `[x,y,w,h]` |
|---|---|---|
| 27 | 16 | `[478,848,551,72]` |
| 27 | 17 | `[238,1702,498,167]` |
| 27 | 18 | `[782,1730,459,93]` |
| 28 | 19 | `[474,750,531,150]` |
| 30 | 21 | `[236,1403,266,371]` |
| 30 | 22 | `[588,1434,647,335]` |

This is a metadata comparison with the earlier evidence, not another visual figure review.

## Actual SHA-256 Hashes

Calculated from the actual files with `shasum -a 256`; not copied from frontmatter. The three source PNG hashes are unchanged from the initial review, permitting reuse of that review's source observations for these targeted confirmations.

```text
Physical page 27 source:
.tmp/ld-s10y-lesson/6-8g/pages/0027/page.png
9119b0bd821031438f6a41eda3c4ea609b873d7c37c987cd093bb3e5f139c136

Physical page 27 corrected Markdown:
ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0027/page.md
b224f91e280462497339b9ef7181de59a6f839a65086080b6bd5a926e0404f5f

Physical page 28 source:
.tmp/ld-s10y-lesson/6-8g/pages/0028/page.png
a41b74af9011e8a93ba4d3fecae5e1e5ab9fbc5b3f5f70908a867ae46e3d551e

Physical page 28 annotated Markdown, glyph still provisional:
ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0028/page.md
a22e26b753ffe13047629da85c3104ded2fe0a1117a34a47af380784ec8a3f4d

Physical page 30 source:
.tmp/ld-s10y-lesson/6-8g/pages/0030/page.png
8a6724353e27b088d542c76ca0a44e0ef18a00244ff76cb7371d2fa0c8530528

Physical page 30 corrected Markdown:
ssot-resources/soviet10year-textbooks/artifacts/6-8g/pages/0030/page.md
4c1f4f64e499bc8835ea580bd2384ce1e180d067de20940daccc33100ae3a466

Unmodified initial report:
.intentfold/tickets/STEMROBIN-184/tmp/transcription-review-005.md
ab5dd8ec26c1b245d18f03188e1bed7711a94b655e0332fca04cee2f5738ad2e
```

## Stop

Only this correction report was written. No source images were reopened, no whole pages were re-reviewed, no product artifacts were edited, no pipeline was run, and the initial report was left unchanged.

F1 and F3 repairs are confirmed at the exact current hashes above. Page 28's literal-glyph uncertainty remains open. No new blanket page or batch PASS is asserted.
