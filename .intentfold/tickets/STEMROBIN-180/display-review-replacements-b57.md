# STEMROBIN-180 Batch57 Final DISPLAY

Verdict: **PASS**. Screenshot inspection only, 2026-11-17, fresh context.

Only this report was written. Exactly eight existing prose screenshots were opened once each: four actual IDs, desktop 1440 and mobile 390. Image budget: 8/8 requested context maximum; no reopens, crops, extra images, browser, render, source/text re-review, code/template edits, DB, network, commit or workflow capability.

## Visible Findings

| Actual ID | Paragraphs | Desktop and mobile observations |
|---|---:|---|
| phy8-c2-s1-t1 | 5 | Introduction title and all prose readable, nonblank and contained; final dynamics definition fully visible. |
| phy8-c4-s2-t1 | 3 | Introduction title and all prose readable, nonblank and contained; final mechanical-work question fully visible. |
| phy8-c4-s2-t15 | 6 | Chapter-nine summary title and complete italic prose visible. Underword emphasis dots visible on the moving-object and kinetic/potential-energy terms; no exposed style/span markup or stars. Formulas mv^2/2, m|g|h and kx^2/2 readable and contained, including mobile line breaks. Final conversion-to-internal-energy statement fully visible. |
| phy8-conclusion | 9 | Conclusion title and complete prose visible. Explicit nineteenth-century-end wording appears in both widths, distinct from the subsequent twentieth-century discussion. Final sentence about using this knowledge throughout the physics course fully visible. |

Total: 5 + 3 + 6 + 9 = 23 paragraphs. All eight images show complete, nonblank prose with readable titles and ends, clean margins and no clipping, incoherent overlap, exposed CSS/span markup or literal emphasis stars. No exercises or figures occur in these prose bodies; the visible zero-exercise navigation is not exercise content. Exercise screenshots were not opened. This is DISPLAY acceptance only, not a new SOURCE/TEXT review or whole-book acceptance.

## Retained Command Premises

The first command, recorded in `b57-four-replacements-offline-first.call.json`, exited 1 after recording eight introduction pages (text/exercises at both widths for the first two IDs). Its obsolete expected-text normalization retained italic stars. The original `report.json` remains `in-progress`; it is not relabeled as a whole-run PASS.

The sole expectation-sync continuation for the unfinished two IDs, `b57-display-unfinished-two-continue.call.json`, exited 1 and caught actual escaped span/CSS text in the summary. Parent-reported repair reused shared `proseInline` in `render_lesson.js`; `b57-summary-display-affected-render.call.json` records one summary-only text render, exit 0, six prose paragraphs. No render was run by this reviewer.

`b57-display-summary-conclusion-affected.call.json` records exit 0 and eight selected desktop/mobile pages for the final two IDs; `affected-final.json` is `pass`. Final screenshot inspection combines the four original introduction prose results with the four affected-final prose results. It does not claim that the failed commands passed or that the whole check was rerun.

Command-record directory: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands`.

## Evidence Binding

Screenshot/report root E: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-phy8-c2-s1-t1-phy8-c4-s2-t1-phy8-c4-s2-t15-phy8-conclusion`.

HTML root H: `/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b57-summaries/work/render/8p/modern-us-neutral`.

Each screenshot below resolves under E; its HTML is H/<actual-ID>/text.html. All current HTML SHA-256 values match the corresponding retained report entries. R = original report; A = affected-final report. I = final implementation snapshot below, bound to all eight rows.

| Screenshot | Screenshot SHA-256 | HTML SHA-256 | Report / implementation |
|---|---|---|---|
| phy8-c2-s1-t1-text-1440.png | 1b9fd9eed3948ba76583e190e3382c5a79da1154e6da1f108aba89c440c6b2a9 | 73d073e37bb51c3bf63d9292dd26b9b8bd5f73b65ef622674b781cc1583cd9b1 | R / I |
| phy8-c2-s1-t1-text-390.png | 8ed27e1e22a67105ad6a298142fda1eb5ef7acbcde9ad2628a63849ad4ff89ab | 73d073e37bb51c3bf63d9292dd26b9b8bd5f73b65ef622674b781cc1583cd9b1 | R / I |
| phy8-c4-s2-t1-text-1440.png | ef9b580651a37f342790dad10a796615947c1898409dd0b0a5256589ba3a922f | 40f337e2036e522e96f606554239224dbc54fdb5061e22d7b97218d41dce5689 | R / I |
| phy8-c4-s2-t1-text-390.png | 33912f03e7726651e2aa7da7f48f61128d8be972381296a9201ba5f94115963f | 40f337e2036e522e96f606554239224dbc54fdb5061e22d7b97218d41dce5689 | R / I |
| phy8-c4-s2-t15-text-1440.png | 86fca4d38014ba1b7cf045b133bea34e7eb1f7bb0df0cec26d0400f6047046c7 | 537fdee4ea13dfdf16eae76427bcb509e61f0616aaa5e8f419b8d4ecf18485c2 | A / I |
| phy8-c4-s2-t15-text-390.png | 2a1ee851ad1b6b6edd2d01e9785b5e3a02db2f97c7c15fba7e9ee8fa895c56d4 | 537fdee4ea13dfdf16eae76427bcb509e61f0616aaa5e8f419b8d4ecf18485c2 | A / I |
| phy8-conclusion-text-1440.png | 57363b58aad7cb17090fc337f09a860e04f24ba8f83ca82ba6f43cc4fa89bb3d | 8c07f87cecdbcbd0209495ba8df79564a14b0ef9b53f45aff574bc090d8dc660 | A / I |
| phy8-conclusion-text-390.png | 2ad967024dad366c41aaf03230ef881eccba0e93d8c360d91f33f64aa1e36b64 | 8c07f87cecdbcbd0209495ba8df79564a14b0ef9b53f45aff574bc090d8dc660 | A / I |

R: E/report.json SHA-256 `33a9fa56a8051d648dff7b4888106fa10c6d1a685f247e16de150efaa84c8200`.

A: E/affected-final.json SHA-256 `ece83d1a8c4a024d21a5524e033fbaccd00e8720abaa60610124137bd0e86f0d`.

I is the current final implementation snapshot, not a claim that the original introduction screenshots were regenerated with the repaired renderer:

| Implementation file | SHA-256 |
|---|---|
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/render_lesson.js | b281febf489d97e67dd6765fc0862740b5b11851ef5d2cdc054285a58d230d8d |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.claude/skills/ld-s10y-lesson/tools/htmlfrag.js | da12c7ba1a2848e6626e527c49c41a070466bb606feb55a51930ddc5ec32488e |
| /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/offline-check.mjs | 04c44db654f14d51f1654a085ece5db4e4b4ccf46b019e6699b3733ec1793ba5 |

No DISPLAY revision requested. Existing failures and other workers' files remain untouched.
