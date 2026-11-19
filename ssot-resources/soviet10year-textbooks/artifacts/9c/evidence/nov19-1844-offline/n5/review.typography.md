# n5 Typography Follow-Up

2026-11-19. Result: **ISSUE**, affected-only and bound to the current projections.

## Concrete Issue

At both **1440x960** and **390x844**, all 24 `.option-letter` labels in
`/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/offline/render/9c/modern-us-neutral/ana9-c2-s1-n5/choices.html`
remain **16.64px / 1.00x prose**, with computed family
`"Songti SC", "Source Han Serif SC", "Noto Serif CJK SC", SimSun, serif`.

They do not meet the requested **18.304px / 1.10x prose in `KaTeX_Main`**. The bound choices SHA-256 is
`04796a266f5ae9a5672464185419ea9b6a4ab56167a4a5af22b0df56d601652a`.
No repair or rerun was made.

## Typography That Passes

- Exercise and choice `.no` labels: **18.304px**, including actual numeric leaf text; family `KaTeX_Main, serif`. They match mainline math, equal **1.10x** the **16.64px** adjacent body prose, and exceed prose size at both widths.
- Exercise mainline math and all six ASCII spans: **18.304px / 1.10x** prose; `KaTeX_Main`.
- Choice mainline math: **18.304px / 1.10x** prose; `KaTeX_Main`. The option letters above are the only ASCII ratio/family failure.
- Text mainline math and all 33 ASCII spans: **18.656px / 1.10x** the **16.96px** prose; `KaTeX_Main`.
- No affected hidden content, overflow, clipping, text/math overlap, number/body collision or option-label/text collision at either width. Changed fonts loaded. Both new region screenshots were inspected once and showed no affected clipping or overlap.

## Identity And Bounds

For all three projections, old-snapshot and current DOM display-text hashes and ordered KaTeX annotation hashes are identical at both widths. The table is excluded from this typography comparison and was not reopened or reviewed. Old n5 HTML snapshots match the original review's HTML hashes.

Canonical lesson, exercises and retained choice-set inputs were compared by opaque SHA-256 only; all match prior bindings and stayed stable. Both renderer files and all old/current projection hashes are recorded in `review.typography.json`, with no renderer/source/math review. Original `review.mjs`, `report.md`, `checks.json`, `hashbindings.json` and `images-ledger.json` remained byte-identical.

Current projection hashes:

- `text.html`: `e4572d75f40921ca74c06c0a6d29a694f671c5599e90ac823ee17421d6d348b1`
- `exercises.html`: `717030334a8dfc8776f1aeeca78227314d95839c2d40561aac44c8750ebbd5a7`
- `choices.html`: `04796a266f5ae9a5672464185419ea9b6a4ab56167a4a5af22b0df56d601652a`

## Evidence And Limits

One typography-only run, six current `file://` page opens in isolated `headless:true` offline contexts. Old HTML was parsed inertly, never navigated. The owned browser closed in `finally`. External requests: zero.

Two new affected-region screenshots, each opened once; **8/8 images and 8 cumulative image opens**. No old screenshot reopened, no full-page screenshot, no separate figure/original opened.

- `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n5-offline-review/typography-exercises-region-390x844.png` (358x503)
- `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n5-offline-review/typography-choices-region-390x844.png` (358x325)

All prior passing radio, table, global prose, source, mathematics, glyph/error and scroll-end checks are inherited, not replayed. This is **offline typography evidence, not product acceptance**. No HTML/canonical edits, DB, network, models, Git, installs, publication, desktop/profile/CDP/PWDEBUG or workers.
