# STEMROBIN-184: Independent T1 Affected Text Review

## Decision and scope

`T1_RESOLVED_TEXT_ONLY`. The sole prior text finding is resolved by the exact authorized layout repair in `geo910-c1-s2-n18.prose[2].text`. All four unchanged n18 concept anchors still resolve to unique, appropriate adjacent prose pairs.

This additive review does not replace or edit the accepted first report/ledger. It reuses their 39-object, 13-exercise, 158-formula fidelity results; it does not repeat that semantic comparison, source-pixel review, or n19's two-anchor review.

**n18 whole-lesson HOLD persists.** The parent reports that figure71 exhausted glyph repair and remains FAIL. That is parent-supplied figure status, not independently inspected evidence in this text-only review. Resolving T1 neither overrides that failure nor approves a figure, render, finalize, publication, counter release, or whole-lesson completion.

## Exact affected comparison

The retained pre-T1 template's SHA256 exactly equals the n18 template binding in the accepted first review. A structured before/current comparison finds exactly one changed leaf:

```text
/prose/2/text
```

The current text equals the prior text with only these two whitespace replacements:

1. After `$\vec b(M_1)=M_2$，`, replace the two newlines before the fourth mapping with one newline.
2. At the existing `（图 71）.合成` junction, insert two newlines after the unchanged period, before `合成`.

The affected object retains source refs `p0066#9,p0067#1`, `source_text`, `changes: ["layout"]`, all other metadata, and its complete source snapshot. Every other leaf in the entire n18 template is structurally unchanged, including the four `section_breaks` objects.

The affected object's 20 ordered math spans are byte-identical before/current. Its complete non-whitespace text is identical. No condition, mapping endpoint, operator, sign, figure reference, section/property reference, equation tag, or proof-ending content changed.

## Paragraph resolution

The existing pure `htmlfrag.js` paragraph functions, with the same hash as the accepted review, now return this complete mapping paragraph at outline index 3:

```text
有：
$\vec a(M)=M_1$，
$\vec a(N)=N_1$，
$\vec b(M_1)=M_2$，
$\vec b(N_1)=N_2$（图 71）.
```

Outline index 4 begins `合成 ...` and retains the complete composition statement, sufficiency statement and displacement-property statement. The previous comma-ended paragraph no longer exists, and the next sentence is no longer joined to the fourth mapping's sentence.

The repair relocates one blank-line boundary; the affected object still has five paragraphs and n18 still has 26 short prose paragraphs. Those unchanged counts are bookkeeping, not the reason T1 passes. The complete-statement boundaries are the reason.

## Unchanged Four Anchors

The authored anchor texts are structurally unchanged. Pure paragraph resolution finds each exactly once, in increasing order:

| Anchor | Before -> after outline index | Object pair | Reused semantic transition |
| --- | --- | --- | --- |
| 0 | 7 -> 8 | prose5 -> prose6 | Completed theorem proof to addition definition. |
| 1 | 14 -> 15 | prose12 paragraph1 -> prose15 | Triangle construction/result to algebraic properties. |
| 2 | 19 -> 20 | prose19 -> prose20 paragraph0 | Properties/proof comment to three-or-more-vector definition. |
| 3 | 22 -> 23 | prose21 -> prose22 paragraph0 | Regrouping/reordering principle to polygon construction. |

Resolution uses the same pure reader as the first comparison, not manually authored integer boundaries. No renderer, image loader, or finalize command ran.

## Reused Evidence and Helper Qualifiers

- The accepted first report and JSON ledger retain their exact SHA256 values below.
- All 12 other input/reader hashes in the first ledger remain stable. This is a byte-binding check only, not another full source/text review.
- All39-object/13-task/158-formula passing fidelity results are reused. Only the repaired object's 20 formula spans and text boundary were compared anew.
- The original author-helper FAIL and its affected scope/metadata disposition remain unaltered. Formula-reference tags are still literal prose references, not invented exercise subparts.
- The parent named `n18-T1-layout-affected.json` as about to be produced by `check-n18-T1-layout-once.mjs`. The report was not yet available when inspected. The reviewer did not execute, rerun, or inspect that helper's implementation, and claims no helper PASS or command exit. The T1 decision is the independent direct comparison above.
- Figure71's reported glyph FAIL is preserved independently of the text decision; `whole_lesson_complete: false`.

## SHA256 Bindings

Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`. Paths below are relative to it.

| Evidence | SHA256 / status |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-184/tmp/n18-n19-production/n18-before-T1-layout.json` | `3725d8e9959d8576b3879910fa8f098853fef40d52a377211e519dc59566f981` |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s2-n18/lesson.template.json` | `204b8d01c7aed7a4f9102639bf7b9d74f3d716bad97765dfc02b80dbf3f4d4ae` |
| `.intentfold/tickets/STEMROBIN-184/tmp/n18-n19-text-independent-review.md` | `07713aea387c7e120f42961c56eb67c29e742818bbd04c475d98c23f5b702884` |
| `.intentfold/tickets/STEMROBIN-184/tmp/n18-n19-text-independent-review.json` | `2923de038d6699c25316aed454b492a7cbad67092ade3b9c07846ab21c229869` |
| `.claude/skills/ld-s10y-lesson/tools/htmlfrag.js` (pure paragraph reader only) | `c2f0301c5ba7811336a5268a404f795ace7873b75eb93c42c10186f3d9c3f9f6` |
| `.intentfold/tickets/STEMROBIN-184/tmp/n18-n19-production/n18-T1-layout-affected.json` | Not yet available at inspection; no SHA or helper result claimed. |

Companion JSON: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/n18-T1-text-independent-affected-review.json`.

## Ledger

Unique affected comparison only: one repaired text leaf, 20 unchanged affected math spans, four unchanged resolved anchors. New images 0; existing image ledger remains 8/8 batch and 8/24 context, zero reopens. Full/source reviews repeated 0; answer/choice reads 0; helper/finalize runs 0; template/source/counter edits or authorizations 0. Only this additive report and its JSON are written. Text T1 resolved; n18 whole HOLD retained.
