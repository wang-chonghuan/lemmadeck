# STEMROBIN-184 Physical 111 Affected-Only Comparison

Status: COMPLETE. The affected text matches the two frozen StageB proposals.
This is not a source re-review, mathematical approval or modern-delivery release.
**n99modern remains HOLD.**

## Scope And Exact Identities

Only the following three authorized text inputs were read/compared. No image,
source-first, old report, other page, pipeline or Git operation was opened/run.

| Input | Absolute path | SHA256 |
| --- | --- | --- |
| Preserved before bytes | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-121-supported-edits/0111-before.md | 2781e5d4199c3ef4760029463919381209f162ae485111566136abb912b50329 |
| Current durable page | /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0111/page.md | fb78572c28f6196f43bbf6ea78c47c0af23dc67323efa990bf589ccad8e8e897 |
| Supported-edit disposition | /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-121-supported-edits/disposition.md | 36c548d4fbeffe12f901b210e86e965546a198ca181a02e245ec36ff62436b06 |

The before-file SHA256 exactly matches the original 0111 author bytes disclosed
for the sole StageB. The current page is a new byte identity, not a rewrite of
historical author approval.

Frozen findings are referenced from this chat's already consumed outcome, not
reopened files:

- StageB.md SHA256: f3c53231cbf4fa83dc35bc6318da251d88ee464b2873d0aa2a96c69c56d4ecc0
- stageB-ledger.md SHA256: 68cb1b3b21cc4b1d7e2a292c349ef83069f916f9d98cbecbab0423bae57aa04a

## All Body Differences

There are exactly two character substitutions on two existing body rows.
All other body bytes, including block markers, row boundaries, math delimiters,
whitespace, captions/footers and punctuation elsewhere, are unchanged.

### F2: Example 2 Line-Final Punctuation

Location: p0111#2, second body row; before file line 40, current file line 42.

```text
BEFORE
因为函数$\cos x$的一个原函数是$\sin x$，那么根据定理2，

AFTER
因为函数$\cos x$的一个原函数是$\sin x$，那么根据定理2．
```

Only the final `，` (U+FF0C) changes to `．` (U+FF0E).
The comma after `sin x` and the following separate result row are unchanged.
This implements frozen F2 exactly at the affected-text level.

### F1: First Explanatory Denominator Exponent

Location: p0111#4, second body row; before file line 50, current file line 52.

```text
BEFORE
因为函数$\frac{1}{x^5}$的原函数是$-\frac{1}{4x^4}$，那么根据定理3，所求的原

AFTER
因为函数$\frac{1}{x^5}$的原函数是$-\frac{1}{4x^1}$，那么根据定理3，所求的原
```

Only the first explanatory denominator's superscript ASCII `4` changes to `1`.
The initial `1/x^5`, all following prose and the next row remain unchanged.
The next row still contains both later `(7-3x)^4` exponents:

```text
函数是$\frac{1}{-3}\cdot\frac{-1}{4(7-3x)^4}=\frac{1}{12(7-3x)^4}$．
```

No simplification of `x^1` to `x`, worked-calculation rewrite or mathematical
erratum was introduced. Together with the new uncertainty note below, this
implements frozen F1's qualified visible-glyph proposal. The intended original
glyph versus missing print/scan strokes remains unresolved.

## All Metadata Differences

The sole semantic frontmatter change is appending two strings to `notes`.
The previous four note strings are exactly unchanged and retain their order.
For JSON syntax, a comma is added after the old fourth string; this does not
change that note's content.

New fifth note, exact current bytes:

```text
独立StageB原生裁图显示例4解答首个原函数分母上标呈细1形，同页下一行两个4形上标的斜笔和横笔可辨。忠实记可见x^1，不由数学预期认定为4；原意或印刷、扫描缺笔未能确定，不登记确定数学勘误，不批准现代整课。
```

New sixth note, exact current bytes:

```text
独立StageB确认例2在sin x后为逗号、定理2后为句点；仅恢复后者。原作者稿和记录已原字节保留，作者阶段断言不代表修后独立批准。
```

Every other metadata field and formatting outside that notes append is
unchanged:

- `schema`, `book`, `page`, `printed_page`.
- Entire `source` object: PDF name, PDF SHA256 and physical page binding.
- Entire `render` object: dpi, native dimensions and original PNG SHA256.
- Entire `profile` object: profile ID and SHA256.
- `errata` remains exactly `[]`; no confirmed mathematical erratum registered.
- No `count_exclusions`, expected-count field, wrap marker or new metadata
  property is introduced.

These are comparisons of metadata text, not fresh verification of source
pixels, PDF bytes, profile implementation or line-counter behavior.

## Disposition Comparison

The authorized disposition's 111 entry calls for:

- First explanatory exponent 4 to visible 1, with unresolved intended-glyph /
  missing-ink qualification.
- Retaining the following two clear exponent-4 tokens.
- Restoring the full stop after theorem 2 while retaining the sin-x comma.

The current 111 body and two new notes match all three points. Its explicit
statements that no confirmed mathematical erratum or modern whole-lesson
approval follows also match the frozen findings. No further affected-text
change is required to implement those proposals.

The disposition also discusses other source pages and historical file
preservation. Those statements were read only as part of the authorized text;
no other page or preserved author record was inspected or independently
certified. The user's statement that 110/112/113 bodies are untouched remains
a supplied assertion, not a broadened comparison performed here.

## Boundaries And Stop

- F2's proposed character correction is implemented.
- F1's proposed qualified visible-glyph transcription and uncertainty note
  are implemented; intended-glyph / missing-ink uncertainty remains.
- No additional 111 body or metadata difference was found beyond the two
  substitutions, two appended notes and the required JSON comma.
- No page, disposition, frozen StageA/StageB report or old ledger was edited
  by this affected-only comparison. Only this new affected-only.md was created.
- Zero new image loads; permanent reviewer image budget remains 8/8, with no
  reset and no remaining allowance. No image payload delivered to parent.
- No source re-review, broader approval, mathematical approval, pipeline,
  counter, tests, assembly/finalize or Git action occurred.
- **n99modern remains HOLD. WAIT.**

This report's SHA256 is computed externally after its final write and returned
as text, avoiding a self-referential hash.
