# STEMROBIN-180 / b59 / Original-Reviewer Affected SOURCE Comparison

**Affected verdict: PASS for F1-F5 only, bound to the CURRENT hashes below.**
This separate observation does not replace or change the immutable original FIRST
SOURCE FAIL. No physical/math approval is given; full n41/n42 remain unapproved.

Date: 2026-11-17. Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Only this new report and files in the new evidence subdirectory were written:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b59-source-review168169/affected-sole-repair/`.

## Source Basis And Scope

The comparison uses this original reviewer's already-observed FIRST pixel inventory
and F1-F5 receipts. **Zero new or reopened images.** Prior FIRST image ledger stays
4; no image was decoded, cropped, rendered or visually re-reviewed here. PNG/SVG
bytes were only copied/hashed to establish unchanged identities.

The parent's before-sole-repair manifest contains exactly20 scoped inputs:
18 page/work files plus the author report and FIRST review. All20 frozen hashes
match the original reviewer's FIRST file identities. Current20 inputs were captured
in the new subdirectory and independently matched the parent's comparison hashes.
No broad source review, source repair, production-code edit, retry, finalize or
vectorization was performed.

## F1-F5 Literal Comparison

| Finding | Bound current repair | Result |
|---|---|---|
| F1, p0169#5 row4 | `察到在液体中是没有静摩擦力的.`; exactly one `力` restored in both MD/JSON | PASS |
| F2, p0169#10 row1 | `液体或气体中的阻力不同于干摩擦力. 它不仅与物体和`; `干` restored | PASS |
| F3, same row | `干摩擦力. 它不仅`; source sentence stop U+002E followed by U+0020 replaces the comma | PASS |
| F4, p0169#10 row2 | Terminal codepoints are U+002E,U+0020; direct join now gives `有关. 当速度` | PASS |
| F5, p0168#1 rows2-3 | Exact spans `当速度的方向改变时` and `摩擦力的方向也改变` are separately wrapped; comma/period remain outside | PASS |

The exact F5 wrapper is:

```html
<span style="text-emphasis: filled dot; text-emphasis-position: under;">SOURCE_SPAN</span>
```

The affected168 rows are exactly:

```html
关系不大. 摩擦力与速度的关系在于：<span style="text-emphasis: filled dot; text-emphasis-position: under;">当速度的方向改变时</span>，
<span style="text-emphasis: filled dot; text-emphasis-position: under;">摩擦力的方向也改变</span>.
```

This approves the source-bound literal span representation only, not browser
rendering. The terminal ASCII space in169 is confirmed in both representations,
not inferred from whitespace-insensitive display.

## Unchanged Fields And Files

Both complete CURRENT MD byte strings exactly equal frozen FIRST MD with only the
specified row replacements. Both parsed CURRENT JSON objects exactly equal frozen
FIRST JSON with only five specified line-array entries changed:
168 `blocks[0].lines[1:3]`;169 `blocks[4].lines[3]`,
`blocks[9].lines[0]`, `blocks[9].lines[1]`.

All other JSON fields and MD bytes are unchanged: source/profile/render identity,
notes, errata, row counts, kinds, labels, ownership, boxes, figure references,
open/cont/samerow flags, headings/captions and unaffected prose.

Exactly4 files changed: the two pages' MD and JSON. The remaining16 scoped inputs
are byte-identical: both audits, both layouts, both source PNGs/grids/templates,
table PNG/SVG, figure115 PNG/SVG, author report and original FIRST review.
No geometry, vector, image or audit drift is observed.

The previously recorded21/21 and25/25 audits remain byte-identical. The parent's
reported sole affected finalize passes were not rerun. Parent comparison/user
direction records each page's repair budget as1/1 used,0 remaining; this comparison
uses no additional repair attempt.

Only unchanged boundary flags were checked, not new source content: incoming168
remains cont; exercise5 is open on168 and cont/closed on169 before h3 number42;
the experiment remains open/cont across the unchanged figure; caption115 remains
samerow;169 tail remains open after exact `它和速`.
Incoming167 is still TEXTONLY pending its own source review; no167 inspection or
approval occurred here. Full pre-title ownership and full n41/n42 approval remain
outside this affected comparison.

## Bound CURRENT Hashes

Absolute artifact prefix:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b59-friction/artifacts/8p/pages/`.

| File | Bytes | CURRENT SHA256 |
|---|---:|---|
| 0168/page.md | 3034 | `55cc236a12d12996f1da9c9c2deb9afa6010ae14e2eaa4b54e0a96f794366713` |
| 0168/page.json | 5718 | `7e6c52bd939659f90705ccb4a2828c70892af54b18d7405841bf9ed6353e2c52` |
| 0169/page.md | 3413 | `faf89124abc18199b2a86fa14bf6aba7e513c4afc21a6489b46add413b772a9e` |
| 0169/page.json | 5774 | `75db980a00cac26899fe11efec41a27356609c068745eea25ac49022b72625d5` |

The new evidence directory contains current byte snapshots, provenance snapshots
and all20 current/before absolute paths/hashes, plus exact comparison assertions.

| Evidence | SHA256 |
|---|---|
| New current-bindings.json | `7c6ce27f501f89de0a3fe02e681f1be2474611545387c60184c53d085ec4f487` |
| New affected-comparison.json, F1-F5 and unchanged-field/file assertions all true | `e857d0c6e2d4e142a660e6fa0efae7230ac8e922d88aa63fad400bff26e784e6` |
| Parent tmp/b59-source168169-before-sole-repair/manifest.json | `05b6e28ac368d082782ec0276a8d4b02e266d331038ae46fbb78be486ccfcfec` |
| Parent tmp/b59-source168169-sole-repair-comparison.json | `594086d1d5acb92059ebf8c561cce3ba1512a81674b5b844632104a24fe98fa4` |

## FIRST Preservation And Stop

Original FIRST report remains unchanged with FAIL and SHA256
`57c4c909dabd7bcb5cfebfbe42c4763c1d1c8d1d9dff018b6eb9b0fdcd41ddb9`.
Original verdict.FIRST.json remains SHA256
`e6c6c123845505c93c4a8aa9120bd52925030ee39b00f9c5a225132ec4415e3f`.
Original crop-attempt.failed-FIRST.json remains SHA256
`390665fc8ff611e85cc75bcf45005e74f33c0189fe042e4b67648bbe796daf16`,
with exit127 and no retry. None was edited.

Affected F1-F5 comparison PASS only. Actual image ledger for this comparison:
0 new,0 reopened. No physical/math, full-lesson, modern, assembly, publication or
course-completion claim. No source/code repair, retry, finalize/vector or broad
review. Return textual hash/verdict evidence and stop.
