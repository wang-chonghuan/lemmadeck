# n159 Targeted Source-Boundary Clarification

STEMROBIN-180 cap3 invocation180-3; b90; 2026-11-19.
Worktree: /Users/yong/.codex/worktrees/0f12/lemmadeck.
Status: boundary findings only; no new whole-page PASS.

## Source-First Evidence

Exactly 3 original images, opened 0400 then 0401 then 0402 once each,
1472 x 2161; no crops or reopens. FIRST was sealed mode 0444, nlink 1,
before reading structured source:

/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b90-n159-source-boundary-review/first.md

FIRST SHA-256: e2c77179d8ce35d200461edbbe5eecc92d2e2373403cacec36a089c984b14fd2.
Exact original paths and hashes are in FIRST and report.json.

## Findings

1. 0400#13 and #14 are two instructional definition footnotes owned by
   printed §159 `电话`: their circled ①/② match the opening paragraph's
   `受话器` / `送话器` markers. They sit below a footnote rule in smaller
   type. They are not the separate numeric footer `· 389 ·` (0400#15).
   The current `kind: foot` wrongly treats substantive definitions as
   pagination for the stated standard assembly path.

2. 0401#10 is physically closed, including its final `$BC$段表示.）`
   parenthetical. Its final printed line stops well before the right
   margin. 0402#1 starts indented with `这样一来` and is a separately
   printed, bold, two-line summary paragraph. Same lesson and semantic
   connection do not make one printed paragraph. The current 0402#1
   `cont: true` is incorrect. 0401#10's existing `open: false` is correct.

## Smallest Suggested Header Changes

These are recommendations only; no source file was changed:

| Block (1-based) | Current structured header | Suggested source header |
| --- | --- | --- |
| 0400#13 | kind foot, label null | `<!-- p source-footnote-1 -->` |
| 0400#14 | kind foot, label null | `<!-- p source-footnote-2 -->` |
| 0402#1 | kind p, cont true | `<!-- p -->` |

For 0400#13/#14 change only kind to `p` and label to the respective
`source-footnote-*` identity. Keep cont/open/samerow false and all other
fields and original lines unchanged. This uses the caller-declared
existing transparent-footnote p-label support; no engine change or run
was needed or authorized.

Keep 0400#11 and #12 unchanged, including #12 open true. Keep 0400#15
as foot. Keep 0401#10 as p with open false / cont false. For 0402#1 change
only cont to false, retaining label null, open false, bold markup,
printed line breaks, and every text character. Do not add 0401 open.

Retain the definitions' exact source wording, including `受话器`'s
`传送声音` and `送话器`'s `感到微弱声音`; no technical or cultural repair.
Exact existing definition strings are frozen in report.json.

## Evidence And Limits

Source JSON SHA-256 bindings:
- 0400: 1724d09f731cf769323500c4a9ff3104887760beae82ff06df3b21e80ad4fe21
- 0401: f6b33bdf0e8ad4305495de80d668fe87571f20d595e4f431840692501b16d2ac
- 0402: 880fc0e51fd45bd81a87ea1170ed8ccf1fb46b4278028734865fbafde2c27920

Only 0400#11..15, 0401#10, and 0402#1 were inspected after FIRST.
No page.md or author/candidate report was read. No whole-page replay,
n158 comparison, graph/apparatus inventory, figures, modern TEXT,
answers, choices, generation, pipeline stage, backend, DB, app,
network, browser, Git, setup, freshness, or other-chat messaging.
No failures or approvals were replaced. No technical recovery was needed.

Ready for later instructed affected-only review of these minimal author
changes, reusing the same 3 pixel observations with 0 new images.
No future candidate has been read or approved.
