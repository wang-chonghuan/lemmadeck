# STEMROBIN-184 - Affected TEXT Only: Physical119

Status: COMPLETE affected-text comparison. No source/content repair performed.
Date: 2026-11-17.
Workspace: /Users/yong/.codex/worktrees/a07e/lemmadeck.

## Scope and Hashes

Only the following affected texts were compared with already consumed frozen StageB findings:

| Input | SHA-256 |
| --- | --- |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-121-supported-edits/0119-before.md | b65a1a1e553e9a739c805becbd1a44fe5dd4d8b885b2f3067850b27ba5ec7297 |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/0119/page.md | 6ba60464ecf43aa99d91f453f6d263826279d4a33543c23bdef46a44c5f7c87b |
| /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c110-121-supported-edits/disposition.md | 36c548d4fbeffe12f901b210e86e965546a198ca181a02e245ec36ff62436b06 |

Frozen comparison authority, hash-checked and unchanged:

- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/StageB.md
  SHA-256 `89d3e23003e7421d65b099f84fe9f7a31cc8e238aa97c3c2213d7b1ad4c26104`.
- /Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c118-121-review/stageB-ledger.md
  SHA-256 `88808fc32c83025ee34517a04b415e2e512df7a7297c8fa6e8731ceb8fad1ff3`.

The before-copy hash exactly matches the sole AUTHOR119 bytes reviewed in StageB. This comparison does not adopt or review another version of the other pages or author records.

## Exact Body Difference

Only the terminal punctuation of `p0119#10` changed, from U+FF0C `，` to U+3002 `。`.

Before:

```text
$S_{BAC}=\frac{1}{2}|AB|\cdot|BC|=\frac{1}{2}\cdot3\cdot3=4\frac{1}{2}$，
```

Current:

```text
$S_{BAC}=\frac{1}{2}|AB|\cdot|BC|=\frac{1}{2}\cdot3\cdot3=4\frac{1}{2}$。
```

A read-only exact string comparison established that replacing this line's last code point in the before body produces the entire current body byte-for-byte.

- All typed block headers are identical.
- `p0119#10` is still `p open`.
- All mathematical bytes, including the retained `BAC` transcription, factors, result, limits, and formula wraps, are unchanged.
- All other119 body text, figures/coarse boxes, captions/samerow, and foot113 are unchanged.
- This implements frozen F1 without treating the period as closure of the worked-example owner. The next-page continuation was not re-reviewed or edited here.

## Exact Metadata Differences

Only `notes` changed. All other parsed frontmatter fields and their values are identical; the unified text diff contains no other substantive frontmatter change.

### Note 4 Replaced

Before, exactly:

```text
例 3 末行以逗号结束，p open 接物理页 120 页首 p cont，保留整个已解例题，排除未来 blind seed。
```

Current, exactly:

```text
独立StageB原生裁图确认例3本页末行以句点结束；p open仍接物理页120页首p cont，因为整个已解例题的最终面积差尚在下一页。原作者逗号断言以原字节留存为历史，不代表当前源观察。
```

This acknowledges the frozen source-period finding and explicitly distinguishes the historical original comma claim from current repaired text. It preserves the worked-example continuation qualification.

### Note 8 Added

Before: no eighth note.

Current, exactly:

```text
独立StageB裁图中末行面积下标的最后小字符呈C/O形，尚未独立解定。保留现有BAC转写但不由正文或几何预期认证、替换该小字符；已登记的积分求值下标冲突及原式绑定完全不变。
```

This retains frozen Q1 as uncertainty, without authorizing or performing a C/O formula-index replacement. Notes1-3 and5-7 are unchanged. The preceding last note's added JSON separator comma is only the syntax needed to append note8.

## Erratum and Binding Unchanged

- The complete `errata` value is identical before/current.
- `p0119-math-1` still names `p0119#9`.
- The ninth actual typed block still has header `p`.
- Its exact registered `original` is still present in that named block.
- Integral lower-2, evaluation lower-1, and subsequent (-2) substitutions remain unchanged.
- No erratum repair, algebraic correction, formula-index approval, or mathematical approval was performed.

## Additive Disposition

The affected119 statement in `disposition.md` is:

```text
- 119: restore terminal period, retaining open/cont worked-example ownership.
  Keep triangle subscript C/O uncertainty and exact registered erratum binding.
```

Its historical-evidence treatment states that frozen reports and author records are historical rather than claims about repaired bytes, and that no original author record was rewritten to appear post-repair.

For this affected scope, the current119 note changes and additive disposition implement the frozen F1 narrative correction without rewriting the original author handoff/ledger. Q1 remains explicitly qualified, and F2's original/binding remain unchanged.

The parent states other page bodies and author records were preserved. Those files were not re-read or compared here. Other-page changes, holds, and delivery/release statements in the shared disposition are outside this affected-only comparison and are not adjudicated.

## End State

The affected119 text matches the frozen requested terminal-punctuation repair and metadata qualifications. No additional affected-text discrepancy was found.

No image was loaded or created; permanent reviewer image budget remains8/8. No reset, broad whole review, source page edit, math approval, hold/release decision, pipeline, counter, tests, Git, workflow, or other-chat action.

Only this new owned `affected-only.md` was written, via `apply_patch`. Input and authority hashes are rechecked after writing; this document's final SHA-256 is returned externally, not self-embedded.
