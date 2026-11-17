# B58 Independent SOURCE REVIEWONLY FIRST: 8p physical162/163

**FIRST verdict: FAIL, one exact source-punctuation finding in partial n40 context.** Target n39 source wording, formulas, and boundaries PASS. This is SOURCE fidelity only, not a physics endorsement, publication approval, or HOLD release.

Same existing STEMROBIN-180 invocation, 2026-11-17. Only this NEW report and NEW evidence below /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review162163/ were written. Candidate files, existing receipts, other dirty edits, and all existing HOLDs remain untouched.

## Exact Finding

**F1 [P2] Missing printed Chinese comma in physical163 / printed151, `p0163#5`, body line 3 (independent source row L13).**

Source pixels:

```text
不讲摩擦力，因为在地球上的条件下，它随着物体的任何运动
```

Candidate MD and JSON:

```text
不讲摩擦力，因为在地球上的条件下它随着物体的任何运动
```

The candidate omits exactly `，` (U+FF0C) after `下`, before `它`. The preceding comma after `摩擦力` is preserved. This finding is in the outgoing partial n40, not in the target n39. It is a source transcription defect, not a proposed correction to historical physics.

Exact input locations:

- /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/artifacts/8p/pages/0163/page.md:61
- /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/artifacts/8p/pages/0163/page.json:104 (`blocks[4].lines[2]`)

Independent original-pixel evidence:

- Original: /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/work/8p/pages/0163/page.png
- Reviewer crop: /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review162163/p0163-L13-source-comma.FIRST.png
- Crop provenance: original SHA-256 `204835c5b8fc0832dd02ba393a6e39c67ca36b9b643f61428eb97610eb9032a6`; rectangle x=230, y=1660, w=1340, h=130; `sips` crop only, no resampling. Crop SHA-256 `7f276d00af4f072246d96aab69263c37d555b26a568b32b8179ff90b520eab17`.

No other exact source discrepancy was found in either entire assigned page. No repair, normalization, erratum registration, or finalize rerun was performed.

## Independence And Coverage

Read the repo router, entry readme, project and binding charters, lesson cap1/source rules, and image batch rules. No new IntentFold capability, freshness/setup operation, backend request, network access, Git operation, tool-code edit, gate rerun, assemble/adapt/promotion, or figure workflow was invoked.

Each original page.png was opened separately before its corresponding candidate MD/JSON/audit. Both original pages and the complete independent inventory were read/written before any candidate or the author report was read. The author report was read only after that inventory. Exactly **3/8 image loads**: original162, original163, then the reviewer-owned comma crop. Author crop, grids, copied images, and other pages were not loaded. There are no figures on these pages.

Full independent wording, visual-row, formula, punctuation, emphasis, heading, footer, and boundary inventory:

/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review162163/independent-inventory.FIRST.md

Inventory SHA-256: `d5d5561aa0efc8e5c7bdb3df526e119d96a408cd17a67b7a56d967e718ef77f1`. It was frozen before candidate access and was not revised to match the candidate.

## Full Block Comparison

All block IDs below are one-based and were assigned only after the independent source inventory. Printed visual rows include the footer and count the nested substitution fraction as one row, its approximation as the next row.

| Candidate block | Independent rows | Comparison |
|---|---|---|
| `p0162#1` p cont | L01-L07 / 7 | PASS: initial vector equation, four prose rows, mass fraction, closing sentence. Incoming prior material remains unclaimed; unseen upstream unit/paragraph pairing is not certified. |
| `p0162#2` p | L08-L12 / 5 | PASS: all wording and punctuation, including source `砝码上部标明` and `因`/`为` line split. |
| `p0162#3` p | L13-L14 / 2 | PASS: balance sensitivity paragraph and final period. |
| `p0162#4` h3 | L15 / 1 | PASS: bold numbered heading `39. 地球的质量`, target starts here. |
| `p0162#5` p | L16-L19 / 4 | PASS: prose, vector-g magnitude, G M/R squared, comma after formula, concluding sentence. |
| `p0162#6` p | L20-L21 / 2 | PASS: complete mass formula paragraph and terminal period; no false paragraph open. |
| `p0162#7` foot | L22 / 1 | PASS: printed150 at left; decorative footer dots are not prose. |
| `p0163#1` p | L01-L04 / 4 | PASS: new indented paragraph, measured G and g, standalone `和`, all units/powers/punctuation; no false cont. |
| `p0163#2` p | L05-L06 / 2 | PASS: radius 6370 千米 = 6.37 times 10 to sixth power 米 and period. |
| `p0163#3` p | L07-L09 / 3 | PASS: full substitution, nested fractions, negative -11 exponent, outer square, approximation 6 times 10 to twenty-fourth power 千克, terminal period; actual formula-row split retained by `↵`. |
| `p0163#4` h3 | L10 / 1 | PASS: bold `40. 摩擦力 静摩擦力`; real next-unit boundary, not target prose. |
| `p0163#5` p | L11-L16 / 6 | FAIL F1 only: missing comma at L13. All words, long dash, sentence endings, and line splits otherwise match. |
| `p0163#6` p | L17-L18 / 2 | PASS: friction/contact direction paragraph, both rows and punctuation. |
| `p0163#7` p | L19 / 1 | PASS: complete experiment-introduction sentence; no invented experiment, continuation, or unit closure. |
| `p0163#8` foot | L20 / 1 | PASS: printed151 at right; decorative footer dots are not prose. |

Source emphasis is preserved by h3 for the two bold unit headings and LaTeX for italic mathematical variables, meaningful vector arrows and magnitude bars. No independent prose emphasis, underline, caption, exercise heading, exercise, table, figure, or figure reference was identified or omitted. Both JSON figure inventories are empty.

MD frontmatter equals JSON meta on both frozen pages; every MD block's body lines equal its JSON counterpart. The existing audits therefore agree with the candidate, but cannot prove its punctuation matches source pixels.

## Independently Proved Boundaries

The observed pixels place n39 at physical162 L15 (`p0162#4`), then prose `p0162#5-6` and `p0163#1-3`, ending with the approximate result and period before physical163 L10 (`p0163#4`). The frozen structured TOC independently resolves `phy8-c2-s2-n39` to printed150/title 地球的质量 and `phy8-c2-s2-n40` to printed151/title 摩擦力 静摩擦力. The supplied boundaries are corroborated, not treated as proof.

`p0162#1-3` remain preceding, unclaimed material. `p0163#4-7` are only partial n40 context. Paragraph completion is not unit completion: page163's last sentence has a real period, while n40 remains partial. No physical161/164 or other original page was opened. n39 is SOURCE-closed within these two pages; this review makes no physics, modern-edition, answer, or learner-product correctness claim.

## Exact Input Binding

All 20 files from the author's FIRST source/output hash inventory and the final author report matched their recorded SHA-256 exactly. There were no changed candidate bytes in this packet. Exact original and frozen absolute paths, byte sizes, all additional inputs (PDF, manifest, TOC, profile, layouts, templates, unopened grids/crop), and 47 existing author receipt files are preserved in:

/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review162163/input-bindings.FIRST.json

Input binding SHA-256: `24a96f0a653b44b29855ea668a40f793e04ed5900a7f33958a71d923675065fa`. Snapshots were written exclusively to NEW paths below the owned evidence directory.

| Exact input path | SHA-256 |
|---|---|
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/work/8p/pages/0162/page.png | `7ff26dea28b13330d5312f8be4f34e6b255ff7035d2ae250d4175d39d526a93a` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/artifacts/8p/pages/0162/page.md | `3cf497b19f496d86f2ffaf02166ac5894518c493c0436ef50dbc66f940037b80` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/artifacts/8p/pages/0162/page.json | `18c39581dccb7458123195a5b7fc615d1a06c0f87c43bf41eb30b394e7c7b4e1` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/artifacts/8p/pages/0162/audit.json | `3844fc036b18c1ffaa8d9738fba6d6bcea0d496849eec60eb9b9b34e0aa95ba7` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/work/8p/pages/0163/page.png | `204835c5b8fc0832dd02ba393a6e39c67ca36b9b643f61428eb97610eb9032a6` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/artifacts/8p/pages/0163/page.md | `6e860de4d57c7bfc60c7a9818ab085f4ab44f9832e5d9f2bdeae4d89425cd6a8` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/artifacts/8p/pages/0163/page.json | `d134c5a408d18971878248fa14dbc93236d080e575f2a53d52112189d0160b9b` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b58-earth-mass/artifacts/8p/pages/0163/audit.json | `bde518b8bf80e9aa0909251c701d0f479228215d2669b488265ab71d438648b9` |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/source-author-8p162163-b58.md | `fe09188ce669bd8bfcb85249a66af106df6f9bb074e4363001863506bf6ad3fe` |

The author's broad claim that punctuation is retained is contradicted by F1. Its reported page-finalize PASS results are accurately represented as mechanical results; they are not independent source-review PASS.

## Existing FIRST Finalize Receipts

These exact existing receipts were read, byte/hash-bound, and copied, **never rerun**:

| Existing absolute receipt path | Call SHA-256 | Recorded result |
|---|---|---|
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/b58-author162163-finalize-0162-first.call.json | `b4100fa77ca16a7de6fa01e35d1a86768c70f96406ca46a6311aa1b0aaec77c0` | exit0, 2026-11-17T15:14:56.641Z to 15:14:57.251Z; 7 blocks, 22/22 rows, 0 figures, 0 normalizations. |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/b58-author162163-finalize-0163-first.call.json | `06fce0464bccce60b94ec58b2389ad44c0282540471a0d953dcd9c0c71b891a6` | exit0, 2026-11-17T15:14:56.711Z to 15:14:57.258Z; 8 blocks, 20/20 rows, 0 figures, 0 normalizations. |

Exact stdout hashes are `97144fda28837729321c548117eb658c540ecccc651703c87384ce2cc52f7da0` (162) and `40201a1d77e9e7a877e935a52c4f2bb32bb10d54c7a5d14a20b387927a98b7ec` (163). Both stderr streams are empty, SHA-256 `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`. Stream sizes and hashes match the call receipts. Both retained audits have empty errors, unknown_chars, katex_warnings, normalizations, figures, and zero errata. The independent row inventory also totals 22/20.

The author's auxiliary FIRST manifest-selector exit1 is preserved among the snapshots, not repaired, rerun, or relabeled PASS; it is not a failed finalize.

## FIRST Freeze And Stop

The final exact report bytes, report SHA-256, machine-readable one-finding verdict, input-binding SHA-256, inventory, and crop are sealed in:

/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review162163/review-seal.FIRST.json

Frozen report copy:

/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b58-source-review162163/report.FIRST.md

Freeze this **FIRST FAIL**, retain n39's bounded SOURCE PASS separately, and stop. No candidate repair, repeated review, gate rerun, new assembly, adaptation, promotion, publication, or existing HOLD change is authorized or performed.
