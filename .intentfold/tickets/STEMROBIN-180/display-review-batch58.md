# Batch 58 Display Review

Date: 2026-11-17. Ticket: STEMROBIN-180. Mode: same-invocation, fresh DISPLAY REVIEWONLY.
**FIRST verdict: FAIL**, first observed at image load 5, `phy8-c2-s2-n39/text`, desktop 1440x960. Final visual verdict remains FAIL. No repairs or second review.

## Findings

1. **n39 math display artifacts, desktop and mobile**: rendered prose paragraphs 1, 2, 3 and 5 contain five pale gray vertical scrollbar-like blocks beside inline formulas. Paragraph 1 has one between the acceleration formula and the following text; paragraph 2 has one after the mass formula; paragraph 3 has one after each of the two measured-value formulas; paragraph 5 has one after the final mass calculation. They visibly interrupt ordinary math/text presentation. This is a pixel observation, not a diagnosis of renderer behavior.
2. **n68 leaked emphasis delimiters, desktop and mobile**: rendered paragraph 4 displays a literal `*` immediately before "只有相互作用的物体才具有势能", and rendered paragraph 5 starts with another literal `*` before the bold interaction-energy definition. The first statement is not rendered as intended emphasis. Both belong to modern prose object 4, split across final paragraphs 4 and 5. Later italic and bold conclusions render normally. This is a formatting finding only, not a physics judgment.

Affected pages: `phy8-c2-s2-n39/text.html` (printed page 150) and `phy8-c4-s2-n68/text.html` (printed page 252), at both designated viewports. Their exact HTML and screenshot bytes are bound below.

## Observed Coverage

- **n19 text, both sizes**: all 11 final prose paragraphs are visible and readable, from the section-18 reference through the final period formula. Angular/linear-speed symbols, fractions, radian/second and meter/second units, frequency notation and the bold definition render normally. The final `T` formula and both exercise/choice links are fully visible. Mobile title and prose wrap within the page.
- **n19 choices, both sizes**: all 3 complete stems and all 13 options are visible (5 + 4 + 4), including the last question's option d and comparison subscripts. Radius `150000000`, `365` days, `24` hours, `3.5` meters and `60` minutes are readable as displayed; scientific notation, fractions, `rad/s`, `km/s` and `m/s` are legible. Mobile option formulas wrap onto separate lines without overlapping controls or clipping. All checkboxes/radio buttons appear empty. No answer-key or grading feedback is visible; answers were not solved or checked.
- **n39 text, both sizes**: all 5 final prose paragraphs and the end exercise link are present; the acceleration/mass formulas, measured constants, radius conversion and final approximate-mass expression are visible. The five gray formula-adjacent blocks are the failure; content presence does not make this a normal math-display PASS.
- **n68 text, both sizes**: all 12 final prose paragraphs are visible, including the body/Earth example, spring example, coordinate distinction, zero-level statements, final bold general definition and end exercise link. CJK text, vector signs and kinetic-energy fraction are readable; the two literal asterisks are the emphasis failure.
- Across the eight inspected full screenshots: no overlapping text, cropped text, blank/black content page, broken-image placeholder or visible internal answer key was observed. The specific artifacts above prevent an overall display PASS.
- Source-zero-figure status for all three courses is the supplied scope premise, not a new source review. Current modern lesson/figure manifests contain zero figures; every entry in the existing 14-view report has empty `media`. No source or figure images were loaded.

## Existing Automated Evidence

The designated existing single headed-browser check records **PASS for 14 automated views**: 7 HTML pages at desktop 1440x960 and mobile 390x844 (three text pages, three written-exercise pages, one choice page). This invocation performed **0 browser/check/render runs** and inspected **8 actual screenshots**, not all 14.

Preserved and reused without rerun, as explicitly designated by the user: the existing DOM check establishes completeness of the 4 read-only written exercises; 2 single-choice and 1 multiple-choice modes with empty initial selection; no horizontal overflow, `.err`, script or network errors. The six written-exercise screenshots were NOT loaded or visually approved here. n39 and n68 have zero written exercises. No interaction behavior was newly tested.

Modern lesson prose and exercise display fields and the existing full choice HTML were read only for render comparison. Existing semantic approvals remain the user's accepted premise; no physics, question-answer, source, gate or semantic replay was performed. Essential observations and binding values are embedded here, so no scratch file is needed to understand this verdict.

## Pre-View Hash Binding

Workspace: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
Existing report: `.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-b58-8p/report.json`.
Report SHA-256: `997151bbce74356cfbb9b6abf9661ffe6396bde90a9d8bddfd0b07dc8d7bd5b0`.
HTML root: `.tmp/ld-s10y-lesson/b58-display/work/render/8p/modern-us-neutral/`.
All paths below are relative to the workspace or stated root.

Report, seven HTML files and eight screenshot files were byte-hashed before image load 1. All seven current HTML hashes matched the report's `htmlSha256`. Screenshot filenames derive from report entries, not a guessed filename set. The pre-view record was written before viewing at `.intentfold/tickets/STEMROBIN-180/tmp/b58-display-review/pre-view-binding.md`; this durable report repeats its essential bindings.

| HTML path below root | SHA-256 |
| --- | --- |
| phy8-c1-s3-n19/text.html | 53194b2f16fcdb453e4b76a46f55010e7ccf7cf4dd00d30fd4c230fa468ad9b4 |
| phy8-c1-s3-n19/exercises.html | 1ed521502deaaddd363f6a2ce05a427add4ad1138896748d4a752e4e1b9789bf |
| phy8-c1-s3-n19/choices.html | 6abf240b570be6e01fe1bc8a82a535f1cc15c34ecadeb4be3fd6ff9df34153c3 |
| phy8-c2-s2-n39/text.html | d01d6a82d39f738d48f3209a68f500aa4ab02e4080759d13ad77e10f210f8bbe |
| phy8-c2-s2-n39/exercises.html | 06e1e669dc1a6b3bb8dc6eddfb9d5585835131eedd72cf6d87855d7eebce720b |
| phy8-c4-s2-n68/text.html | ad3609c6b40fdf35b0fb1b3cda04c6848069555953c0d9465d39264808d165af |
| phy8-c4-s2-n68/exercises.html | dfd28834d10f600069f7464b7bfc45f74f8fea74f3d1c8ec835eacb0b77b6b44 |

## Actual Image Load Ledger

Screenshot root: `.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-b58-8p/`.
Each existing FULL screenshot below was viewed exactly once with `detail: original`, in this order. PNG dimensions are distinct from browser viewport dimensions.

| Load | Screenshot filename below root | Viewport | PNG pixels | Observation | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| 1 | phy8-c1-s3-n19-text-1440.png | 1440x960 | 1425x1367 | 11 paragraphs and both end links; no visual defect | ff5fe9ba60284d0efbf9a5003b33a4aaf3546f19df1d0b92d1e0849295b242fa |
| 2 | phy8-c1-s3-n19-choices-1440.png | 1440x960 | 1425x1229 | 3 stems, 13 options, last option fully visible | 89411dda5f75eef8e2d86d0b2258f9bfe42c248e6ed16fd7a70d2fe98aa5dd86 |
| 3 | phy8-c1-s3-n19-text-390.png | 390x844 | 375x1943 | 11 paragraphs, wrapped title, final formula and links | 098fce9e591dd13a6648e960197d8708a559b1a4ab4a17489e0a500d27891bc6 |
| 4 | phy8-c1-s3-n19-choices-390.png | 390x844 | 375x1817 | 3 stems and all 13 wrapped options; empty controls | 998feee862ae43f153fd20414a14f2e656366c9d158b40883842e32201f17117 |
| 5 | phy8-c2-s2-n39-text-1440.png | 1440x960 | 1440x960 | FIRST FAIL: five gray formula-adjacent blocks | 913c7669efda075a204399991cd03791ca2a9e46e23a1f715122973f921449f5 |
| 6 | phy8-c2-s2-n39-text-390.png | 390x844 | 390x844 | Same five gray blocks; all 5 paragraphs/end link visible | 7b84e19fcd9ea07f3d67a1afda7f63327a1f8585f500c615f1767ca2bcfb75d8 |
| 7 | phy8-c4-s2-n68-text-1440.png | 1440x960 | 1425x1182 | 12 paragraphs; literal stars in paragraphs 4/5 | d55ea6d347f2410bc75656f790ee18495605b77d3d96da581ea44a2ab6e0dcc9 |
| 8 | phy8-c4-s2-n68-text-390.png | 390x844 | 375x1551 | Same two stars; final definition/end link visible | ca11743544275806af404dde47190b4d38898ab02e0560c6f9adbe90eb136d55 |

Final local image-context loads: **8/8** (8 total in this fresh context); crops, reopens, montages and other image loads: **0**. Parent baseline supplied by the user remains **21/24**, with **0 new parent image loads**; return is text only.

## Scope And Stop

Writes are limited to this report and the new `tmp/b58-display-review/pre-view-binding.md`. No content, HTML, screenshots, existing report or check was edited. No browser, rendering, test/gate run, original-source review, semantic replay, image service, app, DB, publishing, backend access or setup was performed.

**Recorded scope deviation:** session entry inadvertently ran one read-only `git status --short`, despite the explicit no-Git instruction. No subsequent Git command or Git mutation was performed. A preliminary text-only `xmllint` extraction emitted legacy-parser warnings about HTML5/MathML tags; it was not browser evidence or a check result. Display-only text was subsequently read with a structured HTML parser, without running page scripts or inspecting answer-key files.

This is a bounded first-pass display failure report for these three courses only. It is not full-book acceptance, a handoff, publication approval or ticket completion. STOP.
