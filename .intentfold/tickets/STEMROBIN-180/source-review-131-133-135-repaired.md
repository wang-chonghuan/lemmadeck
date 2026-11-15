# Affected Source Recheck 131/133/135

Date: 2026-11-15. Reviewer: Codex, original independent reviewer, not repair author.
Result: **PASS for the authorized F1-F7 affected-only recheck**, bound to the current hashes below. No remaining defect found in these repaired units.

The complete original review is retained unchanged in `source-review-131-135.md`. Its unchanged-region conclusions are reused, not rereviewed. Pages 132/134 retain their prior independent PASS, with their six durable file hashes verified unchanged. This report is not an assembled-course, external-boundary, vector-rerun, modern-edition, or publication approval.

## Findings Rechecked

| Original finding | Result | Independent evidence |
| --- | --- | --- |
| F1: 135 two actual circled markers / character blocker | PASS | Both original markers were viewed in affected source regions. Both now use `$\text{\textcircled{1}}$`, and both visibly render as circled ones. Current audit has no unknown characters or errors. |
| F2: 135 instructional-footnote retention | PASS at source representation | Full definition is a standalone `p` immediately after the referenced definition paragraph, before the later open paragraph. Only the real page number remains `foot`. Original physical position is explicitly recorded; no assembly was run. |
| F3: 133 column-local example continuity and rules | PASS | Actual KaTeX screenshot shows two independent four-row arrays, one outer vertical divider, and the left short rule below density. Right row 3 ends in multiplication and row 4 starts directly with `10米`; no left unknown is injected. |
| F4: 131 weight emphasis | PASS | Only `重量` gains emphasis, matching actual source pixels; question wording and two source lines are otherwise unchanged. |
| F5: 131 period | PASS | Exact affected source line and repaired text both read `9.8牛顿. 这就是说`; open ending `乘以9.8` is unchanged. |
| F6: 133 continuation comma | PASS | Exact affected source region and repaired line both read `接，球胆...`; exercise label, two source lines, and open boundary are unchanged. |
| F7: 133 first-line emphasis scope | PASS | Source crop and repaired preview distinguish emphasized `根据` from regular `公式`; the display-formula continuation chain is unchanged. |

The 135 source definition and footnote were not discarded or simplified. The original wording `“佯谬”一词用来称谓那种出人预料的、与通常观念不符的现象.` remains exact. The logical footnote relocation is the explicitly authorized representation change, not a claim that the printed footnote was physically above fig-118.

## Scope And Raw Differences

Full MD diffs and structured JSON differences were compared against the retained rejected snapshots. This is a byte/scope comparison, not a repeated full-page source review.

- 131: only JSON blocks 3 and 10 change, exclusively the two authorized text edits. Metadata, all block flags/order, figures, and audit bytes are unchanged.
- 133: only blocks 1, 5, and 15 change, plus the layout explanation in `meta.notes`. Block 5 is the same original example unit represented by two nested independent arrays. All other text and flags, including the final exercise-3 open boundary, are unchanged. There is still no figure on this page.
- 135: only the body marker encoding, the original footnote's encoding/classification/logical position, and its explanatory note change. Old definition block 3 remains block 3; old footnote block 7 becomes the independent paragraph at block 4. Old open block 4 moves to block 5 without changing a single character or its flags; fig-118/caption shift to blocks 6/7 unchanged; the real page-number foot remains block 8. The ten-line exercise continuation and section heading remain unchanged.
- All three MD frontmatter objects equal their JSON metadata. Source/PDF/profile/render identities, exact figure boxes, and row totals are unchanged. No source digits, units, mathematical operation, original crop/vector bytes, counter, or extra figure changes were found.

Current persisted page audits, read without rerunning any gate:

| Page | Blocks | Printed / MD rows | Figures | Normalizations | Errors / unknown / KaTeX warnings |
| --- | --- | --- | --- | --- | --- |
| 131 | 11 | 20 / 20 | 1 | 0 | 0 / 0 / 0 |
| 133 | 16 | 24 / 24 | 0 | 0 | 0 / 0 / 0 |
| 135 | 8 | 18 / 18 | 1 | 0 | 0 / 0 / 0 |

131/133 audit bytes are exactly their original audit bytes. 135's original failure audit is preserved, while its current audit is clean. These are main's persisted official results, not reviewer finalize executions.

Within the repaired 133 example, one stored formula line plus exactly three `↵` markers accounts for the same four physical horizontal rows. Removing the markers for rendering leaves four actual rows in each inner array, not eight physical rows and not a four-row artificial shared-data table.

## Actual Math And Marker Layout

Own scratch root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/source-review-131-133-135-repaired/`.

Seven affected original pixel regions were cropped at native resolution into this root, without rescaling or opening whole source pages again. Their original source SHA-256 and exact region coordinates are in `source-regions.json`. Each source region and all four rendered snippet screenshots were actually opened with `functions.view_image`.

The local preview reads only the repaired affected JSON blocks. It removes `↵` for KaTeX rendering, following the existing source-block convention, and does not alter stored formulas. It uses the project's existing KaTeX, its 20 embedded WOFF2 fonts, and the project's installed Playwright. `throwOnError: true`, `trust: false`, and strict-warning capture produced zero errors/warnings for the selected fragments.

Actual headless screenshot observations:

- `133-example.png`: all eight column-local text rows are visible as two four-row columns. The source known-data rows are `已知：`, `h=10米`, density with its original period, and `p—？`. The right column contains its original formula/header, full explanatory row, multiplication row, and complete fourth-row continuation through approximately 80000 pascals and 80 kilopascals. No right-column glyph is occluded, clipped, or replaced by the left unknown.
- The MathML records an outer one-row/two-cell array and two inner arrays, each with four rows. The outer `columnlines="solid"` and left `rowlines="none none solid"` agree with the actual visible vertical divider and short rule under density. The right array has no added horizontal rule.
- At the recorded 24px body-font preview size, the visible vertical separator is 2 x 142.6875px; the left horizontal rule is 247.6875 x 2px. The screenshot, not only these DOM values, was inspected. No source dimension or proportion has been invented.
- `131-text.png` and `133-text.png`: the two emphasis boundaries and both punctuation edits are visibly correct. These are logical snippet previews, not replacements for original physical printed-line storage.
- `135-footnote.png`: both circled ones are visible, the complete instructional definition follows its referenced paragraph, and the later `图118...但它们的底面` remains a separate unfinished paragraph. No extra explanation or completion is added.

Browser execution: one standalone isolated `chromium.launch({channel: "chrome", headless: true})`, one task-owned nonpersistent context, viewport 1400 x 1200 / DPR 1, self-contained `setContent` only. All network requests were blocked; recorded network requests and page errors are empty. No profile, CDP, user window/tab, system input, Inspector, headed/debug mode, or automatic report opening. The owned context and browser were both closed in `finally`; there is no live browser or command session.

## First Failures Preserved

Original independent rejected 131/133 snapshots remain at:
`.intentfold/tickets/STEMROBIN-180/tmp/source-review-131-135-rejected/0131` and `/0133`.
Their MD/JSON/audit hashes match the original independent review.

Original 135 circled-marker failure remains at:
`.tmp/ld-s10y-lesson/6p/pages/0135/failure-01-circled-footnote/`.
Its rejected durable MD/JSON/audit remain unchanged.

133's first array candidate remains at:
`.intentfold/tickets/STEMROBIN-180/tmp/source133-array-first-failure/`.
Its audit still records the actual undefined-control-sequence `\hlinep` failure. The exact candidate-to-current MD diff contains only the addition of `{}` after `\hline`, before the same third wrap marker and `p`. The empty delimiter introduces no visible glyph, extra row, figure, or source value.

```text
133 array-first-failure page.md    b48f93796e5be3f15b866911b30d94be2f7ee1d8a37f3e8384d322f766d62c85
133 array-first-failure page.json  db9c03a75f89db0aafaab339d9093b31dfe33f2fb361bb43ecbe8557c5cac348
133 array-first-failure audit.json 7d218f0bb693ca0c2f450af1c21b891774d9d622c9e04cedfa7ffeb9cf82f61c
```

The preview's before/after input-identity check found no input drift. No rejected report, author report, repair report, failure snapshot, or source artifact was modified by this reviewer.

## Hash-Bound Current Results

All nine current durable hashes exactly match the frozen main repair report:

```text
0131 page.md    b31bffa75ba00206b15cebee8b75b3f4aaec729bb60ff754aa0e0cc48f1fd7d0
0131 page.json  07144753906dba0d304c42b5b83fb5fba0940a5f9569b14af68fe957b1baa3c2
0131 audit.json 2954d327e1055228782687023e751100a9fdff2b8c65ba824b5f49a9b8174842
0133 page.md    feac953242b66ba529c7fce6168b1bc6c09e33ca1886a2eca91439283538115e
0133 page.json  0005c3aa3bc8206e1c68bc0d68803a07db6bb8f3f88de44e0acbe87d5e4f19f9
0133 audit.json f3943516d22cb7b9b27d5d4ad01864e79f8f6073716c7bd7766b05dc2b8d15cc
0135 page.md    11eeb6628e5628c1ec74275b8fa5846db2c4a366caa53df5d48faa5d7429a84e
0135 page.json  dbcf2db58026888fab922f35ad79200f52b10b21d197b0a7ad435f4dcca7f18f
0135 audit.json 4569edad20155363f764f6295cb9e9ec167ac5ffb012753058c690abfb5b15d0
```

Original PNG hashes remain:

```text
0131 ff846003ef52d16f655952b61435c1f566b9ea4bbfef12c4ab5984e345eb4c29
0133 5f194ab3c2144fa18f21c8dd50b88cb4c559df2d9a04e0c07e7c088b3d913696
0135 450725c8269e5a2de292c341ca70409336af17ee0af145bcef3077840eb47069
```

Unchanged affected figure identities:

```text
fig-114 box [457,990,643,349]
fig-114.png 10405c879c73804cc0a5bff9f7d7bb6090ee05085414fea86071fb7a8dbbffb6
fig-114.svg c3593be043fef8d838f25060addb3043be60eb7bb5d4fe0cb0f8f9347a6575b1
fig-118 box [470,1259,621,489]
fig-118.png a6c2b4cc10eb2afc1a5b87d31800864077cc2c0d2fafaee1e30593063a0f3718
fig-118.svg c3232807ceed818cff7a3bebfcf8b22ae4d61158a7ba25aa18059e91eef9d8b3
```

No crops or vectors were rerendered. Earlier whole-source crop findings and author-recorded vector evidence are reused, not relabeled as a fresh vector gate.

Frozen report identities:

```text
source-review-131-135.md   d7eb1c02ae8f98a983c84a884ea46e8eff8772f2f1ca512aa19f5236684d458e
source-author-131-135.md   757279e6eebf2296ab53c6d7a14826b60a239d71c41d8e03b2b626b671b4048f
source131-133-135-repair.md bbd4744d65b7aa5c2bdcf2db8a090e7ee7b2c5744b573390b3e21be54f61efcc
```

## Own Evidence And Commands

Within the own scratch root, `0131.diff`, `0133.diff`, and `0135.diff` preserve the full affected MD differences. `0133-array-delimiter.diff` preserves the sole delimiter correction. `evidence.json` records current/rejected identities, JSON position differences, metadata, audits, MathML/DOM relationships, screenshot hashes, zero warnings/network/page errors, no input drift, and closure status. `source-regions.json` records the seven original-pixel region identities.

```text
preview.mjs              ef83ffc7256f2bdffa73afbb98355721aa59303ce7d665e47449c976081c47be
evidence.json            a84b9e02d177071a5cd29f0f9b6612b80eae05eeef859973f6eb3204246f7b12
source-regions.json      de065b99ecf6ff643fcc9e728a53e7abe405987c167c433526a597b5a8e18fa3
affected-layout.html     86a2ff8de9069b2d53921ffb31b2eca944fbfc3ddcee4781ab67b9db78d89ca2
131-text.png             c81971a60c6860795041af4e8205d0dc395949341522e8bbc0a221ec71f87f58
133-example.png          09fcad6a94e5e373ce25131ab5c206da12b6fbb6c28710ae72ad03fc648f9db0
133-text.png             5bb473ed25ef1662a7cb31f1964f44e35117bdfef7f7a52ec40472fa5dcfebab
135-footnote.png         3c1aa8380568357092244a1579a0dd779bab853669cd2d4d9ec06e29e952f41f
```

Actual standalone preview command, exit 0:

```bash
env -u PWDEBUG PLAYWRIGHT_HTML_OPEN=never node .tmp/ld-s10y-lesson/source-review-131-133-135-repaired/preview.mjs
```

Read-only diff/hash/meta/row-marker checks and native source-region crop generation used the existing Python with:

```bash
PYTHONDONTWRITEBYTECODE=1 /Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python -B -
```

All these executions exited 0. Filename discovery also encountered guessed absent tool paths; those were read-only discovery misses, not failed source or layout gates. The existing official product checker was observed to contain a headed launcher and was **not executed or edited**; the owned standalone preview explicitly used isolated headless mode.

Only this repaired review report and its own scratch preview/evidence were written. No repair, stable tool, source/figure/audit, dependency, app, index, assembly/book/lesson, author/failure/previous-review, DB, Git, service, or user-desktop changes. No official finalize/vectorize/assemble command, full-page repeat, test suite, answer/choice/modern task, source 136+, or external-boundary inspection.

Stopped after the affected-only recheck. No in-flight session remains.
