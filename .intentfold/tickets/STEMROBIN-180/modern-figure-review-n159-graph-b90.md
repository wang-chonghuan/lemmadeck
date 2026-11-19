# B90 n159 fig-343 Independent FIG Review

First verdict: **PASS**. No actionable source-bound FIG defect was found.

Ticket STEMROBIN-180; same cap3 invocation `180-3`; B90; book `7p`;
lesson `phy7-c2-s4-n159`; figure `fig-343` only.
Explicit checkout: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
This is a fresh independent original-pixel review, not ratification of the
author conclusion, official `record_review`, promotion, or product acceptance.

## Original-Pixel Findings

The original PNG was opened first, after reading the complete approved lesson
and all four exercises. My own `original-pixel-inventory-FIRST.json` was
recorded before opening the candidate or reading the author's inventory.
The candidate PNG was opened second and the existing native screenshot third.
No source inventory was copied in place of comparing pixels.

- One shared perpendicular frame is preserved: upward current axis `I`,
  rightward time axis `t`, positive unchanging `AB`, and continuous variable
  current afterward. `A` stays beside the current-axis start; `B` stays below
  the flat-to-variable transition. There are no missing axis or landmark labels.
- `C` stays below the interior trough/transition before the tallest crest.
  It is not moved to the rightmost endpoint. The waveform continues beyond C
  and terminates at the finite, unlabeled, rising endpoint before the time arrow.
- The irregular first tall crest, following shoulder and deep trough, smaller
  crest and intervening small undulations, tallest crest after C, subsequent
  shoulder and deeper trough, next crest, and final smaller undulations remain
  recognizably source-bound. The output does not substitute a regular sine wave,
  add periods, or extrapolate the source endpoint.
- All curve portions remain above the time axis while varying above and below
  AB's height. This agrees with the approved explanation of DC magnitude
  variation, not repeated current-direction reversal.
- Original solid strokes remain solid. No ticks, units, scale, numerical data,
  extra mean-current guide, filled landmark dots, projection lines, second
  trace, or answer annotations have been added.
- Visible figure text is exactly `I`, `t`, `A`, `B`, `C`. The worn current
  glyph's clean Latin I normalization is appropriate to the approved current
  meaning. No cultural text or symbols are visible.

The source has thick, uncalibrated strokes; exact subpixel curve measurements
are not warranted. The construction coordinates locate schematic strokes,
not physical current/time values. C has no original dot or leader, so its
interior placement is source-bound but not a calibrated measurement.
All four exercises are qualitative apparatus/communication questions.
The explanatory graph does not introduce a worked exercise answer or numerical
answer leakage. No answer-key file was read.

## Legibility And Evidence

The existing screenshot visibly shows all five labels and the complete graph
at full native 640 px and mobile 297 px, with no label overlap, clipping, or
broken/black raster. The candidate's full-resolution PNG is also clean.

Existing native evidence, independently hash-bound and arithmetically checked:

| Theme | Width | Minimum Text | Contrast |
| --- | ---: | ---: | ---: |
| neutral | 297 | 16.498828125 px | 16.689496427957465 |
| neutral | 640 | 35.554492187499996 px | 16.689496427957465 |
| accent | 297 | 16.498828125 px | 7.2214979538144535 |
| accent | 640 | 35.554492187499996 px | 7.2214979538144535 |
| print | 297 | 16.498828125 px | 21 |
| print | 640 | 35.554492187499996 px | 21 |

The six existing records have identical geometry within each width across
themes, no recorded collision/clipping, and nonblank raster probes. The SVG
uses semantic ink/paper variables; hidden construction points are not visible
data. The existing HTML embeds the current SVG in all six native samples.
Accent/print were checked from the existing structured native evidence and
its helper's actual predicates, not from an additional screenshot.

`check-FIRST.mjs` is my own scoped JSON/hash/relationship check. Its one run
passed all 33 displacement, perpendicular, parallel, point-on-line, and
endpoint-binding assertions; independently parsed the actual path's 19
cubic segments; bound every hidden knot to that path; checked positive-current
control hulls and monotonicity without extra segment extrema; and checked the
full approved text and all six existing native records. It executes no
production renderer, validator, or author/native helper.

Residual limitation: the reused native evidence is explicitly an offline SVG
DOM harness, not product/app/lesson acceptance. This PASS does not authorize
any downstream stage. Earlier author native diagnostic failures remain
preserved in the author's package; no content repair or new approval is
inferred from those technical corrections.

## Exact Input Hashes

All paths below are relative to the explicit checkout above.

| Input | SHA-256 |
| --- | --- |
| `.tmp/ld-s10y-lesson/b90-n159-figure-context/artifacts/7p/figures/fig-343.png` | `a296e963eb7f170f24b2d95264951c18f4ec47a515e9e7647fc3b981c0cbc59a` |
| `.tmp/ld-s10y-lesson/b90-n159-figure-context/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c2-s4-n159/lesson.json` | `7d10aa5f77ab675cc06463d1eba9df647207cc1c43f56766569718b406b1d7eb` |
| `.tmp/ld-s10y-lesson/b90-n159-figure-context/artifacts/7p/editions/modern-us-neutral/lessons/phy7-c2-s4-n159/exercises.json` | `ac627477efe274c2dfbafd77c81f3468c2c8d052c18196d0783c11bff8a51cda` |
| `.intentfold/tickets/STEMROBIN-180/tmp/b90-n159-graph-author/hash-manifest.json` | `70a373aaf895942c2a89769843bf137a7a93c95e78ca550d77978afa1c7febfa` |
| `.tmp/s10y-image/7p/b90-n159/fig-343/spec-FIRST.json` | `3e60a27039661c403b8c69082cb4c121b4f02cc0760d78ba9298b2016a947f36` |
| `.tmp/s10y-image/7p/b90-n159/fig-343/fig-343-FIRST.svg` | `7bc312bd7f26262e0305cea9dc156a0cdbcd9c99eb54093c8b65a4ed3f81fd1a` |
| `.tmp/s10y-image/7p/b90-n159/fig-343/fig-343-FIRST.png` | `9120fdefce0721ee2508dc677f62fd2c3c67deb9c34694ef5a2e0da8b9769339` |
| `.tmp/s10y-image/7p/b90-n159/fig-343/render-FIRST.json` | `4b0d45efb6733c02be5c1503f28bef7dc89eda8d67752058ef51f395df13cef9` |
| `.intentfold/tickets/STEMROBIN-180/tmp/b90-n159-graph-author/native-640-and-mobile297-FIRST.png` | `0d6d498a6fa7de8660c4cfaac98c516dc258ca58a608fb2662687c778c8ac36c` |
| `.intentfold/tickets/STEMROBIN-180/tmp/b90-n159-graph-author/native-FIRST.json` | `a12e9334b260b56f48574f071bf1c7faf3b32ad3c02a86817ed0dcc4344823cc` |
| `.intentfold/tickets/STEMROBIN-180/tmp/b90-n159-graph-author/geometry-FIRST.json` | `4ad9373b5518c5dc826ed716c17aefd02a894c164c6f111028be50115e6ed325` |
| `.intentfold/tickets/STEMROBIN-180/tmp/b90-n159-graph-author/source-inventory-FIRST.json` | `63b073952cff07645ec08ede5f636e55d1394d79a33b117dbd118bb6cc53d42e` |
| `.intentfold/tickets/STEMROBIN-180/tmp/b90-n159-graph-review/relationship-check-FIRST.json` | `6ba948f56c0287202cf4ae755d6a965e197cd28395aa4d9864bf18a1e5afa752` |

The review `hash-manifest.json` additionally records exact hashes for all
review outputs, additional bound author evidence, instructions, recorder,
and completed review-command receipts. Its own hash and final command receipts
are non-recursive, returned by sealing/final verification rather than invented.

## Usage And Scope

Images: **3/4** total; original 1, candidate 1, existing native screenshot 1;
reopens 0, crops 0, new screenshots 0, browser runs 0, generated rasters 0.

Bootstrap shell calls: exactly 2, both read-only, cwd W: `pwd`; then
`sed -n '1,240p' /Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text/record-command.mjs`.
They remain in tool history and are not represented by fabricated receipts.

After bootstrap every shell call uses the existing recorder at
`T/tmp/b83-n65-raw-and-text/record-command.mjs` with a unique lowercase
`b90-n159-graph-review-*` label. There are 18 completed recorder calls before
sealing, followed by sealing and final verification: 20 total recorder calls,
22 total shell calls. Exact command/argument arrays and stdout/stderr hashes
are in the ancillary common-path receipts. Manual edits used apply_patch only.

The one nonzero call is `b90-n159-graph-review-input-paths-first` (exit 2):
read-only rg listed valid inputs but the not-yet-created review directory was
absent. Its FIRST stdout, stderr, and call receipt are preserved. No input was
missing, no content failed, and no production rerun or content repair followed.
The independent relationship check passed on its first and only run.

Only the assigned review directory, this report, and own ancillary recorder
receipts were written/frozen. Other edits, checkpoint, figs 342/344, and
author/candidate/context files are unchanged. No setup/freshness, Git,
backend, DB/publishers, paid generation, answer-key reads, app/dependency edits,
SOURCE/TEXT replay, author renderer/native rerun, official review, promotion,
or downstream stage was performed. Report, status, and hash manifest freeze
at mode 0444. No repair is requested; review stops here.
