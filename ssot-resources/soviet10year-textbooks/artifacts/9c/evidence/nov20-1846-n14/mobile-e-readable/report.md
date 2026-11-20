# N14 E table: bounded mobile readability review

Verdict: **PASS**, only for the actual visual readability of the E option table
in `ana9-c3-s1-n14` at mobile 390x844. Reviewer: `self_review`.
Finish remains `review`; this is not whole-lesson or whole-course approval.

## Frozen input

- Exact input: `/Users/yong/.codex/worktrees/stemrobin-184-resume/lemmadeck/.tmp/stemrobin-184-resume/n14-choice-preview-revision1/choices.html`
- SHA-256 before browser: `3a598748a6ab0d13f5c883a2ce70769c0d311c5fe6748819d5721c99ce6a3776`
- Size: 486543 bytes. Expected hash matched; post-browser and finalization hashes
  matched too. The input was not changed.
- Historical layout report was read as text only. The earlier 16px DOM KaTeX-leaf
  assertion is adjudicated inapplicable here; no minimum-font assertion was run.
  Its historical verdict and reviewers were not edited.

## Actual visual observations

Exactly two native, unenhanced E-region screenshots were captured. Each was
visually inspected once, without zoom, enhancement, reopening, or extra crops.
The findings below come from the pixels, not CSS sizes or DOM text order.

| Body row | Number cell, left endpoint | Classification cell | Fraction-representation cell, right endpoint |
| --- | --- | --- | --- |
| 1 | -2/3: sign, upper 2, bar, lower 3 distinct | Chinese rational-number label readable | -4/6: sign, upper 4, bar, lower 6 distinct |
| 2 | 5 distinct | Chinese rational-number label readable | upper 10 and lower 2 distinct, including both digits of 10 |
| 3 | 4.2: both digits and decimal point distinct | Chinese rational-number label readable | upper 42 and lower 10 distinct, including both digits in each |
| 4 | -1.6: sign, both digits and decimal point distinct | Chinese rational-number label readable | sign, upper 16 and lower 10 distinct |
| 5 | sqrt(6): radical stroke, bar and radicand 6 distinct | Chinese irrational-number label readable | Chinese not-applicable label readable |
| 6 | sqrt(2): radical stroke, bar and radicand 2 distinct | Chinese irrational-number label readable | Chinese not-applicable label readable |
| 7 | 0 distinct | Chinese rational-number label readable | upper 0, bar and lower 2 distinct |
| 8 | italic x distinct | Chinese irrational-number label readable | Chinese not-applicable label readable |

All three column headings and all eight body rows are distinguishable across
the two captures. The bottom row is complete. No exposed cell's glyphs overlap
one another, an adjacent row, or its borders; no required fraction numerator,
denominator, sign, decimal point, radical, radicand, or letter is cut off.
There is no explicit radical index or subscript/superscript index in this E
table; no readability claim is made for an absent index.

The left capture exposes the number column and classification column; the
right capture exposes the classification and full fraction-representation
column. At the right endpoint the number column is intentionally hidden by the
horizontal scroll viewport. That is not a clipping defect. Readability is
coverage across these endpoints, not simultaneous visibility of all columns.

## Capture evidence

- Existing current-checkout `app/node_modules/playwright-core` was used, with
  its existing Chromium, one headless isolated browser and one context.
- Viewport: 390x844; device scale factor 1; `isMobile: true`; `hasTouch: true`.
  Screenshot scale was CSS/native 1x. No device preset, renderer, HTML, or
  FigureSpec was changed. This is not a real-device or cross-browser claim.
- E was identified from its observed visible `E` label: a `LABEL.option`
  containing one table, document table index 4, with a `SPAN.option-text`
  scroller. Only this table's learner-facing DOM text was recorded.
- Observed table width 340px; scroller `clientWidth` 252px; endpoints 0 and
  88px. These values only document capture positioning, not visual legibility.
- Each capture is the E label/table region, approximately 310x460 CSS pixels,
  entirely within the configured viewport. No whole-page capture was made.
- This mobile context produced a table height of 443.109375px. Historical
  screenshots/layout heights were not replayed or assumed equivalent; the
  verdict binds only these exact new captures and the settings above.
- The loopback server bound to 127.0.0.1 on an ephemeral port. It served the
  frozen bytes only for `GET /choices.html`; all other paths were denied.
  Browser page requests were restricted to that exact local URL. The recorded
  traffic contains one allowed page request, with no external page requests.
- No controls, selection, navigation, mathematical correctness, source
  fidelity, or other options were checked. Only E positioning and its required
  horizontal endpoints were used. No answer key/internal choice key was read.

## Files and counts

Left capture:
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n14-mobile-e-readable/e-mobile-390x844-left.png`

SHA-256: `e80eeda92f2b0754549f6d568144014b27bbeb75169c146fc767719b749eee57`

Right capture:
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n14-mobile-e-readable/e-mobile-390x844-right.png`

SHA-256: `4e10b35c328e1f014d3baee5ffde1cec2c8e158d6bcf531b82de4aba1f5d8fe2`

New bounded captures: **2/2**. New visual inspections: **2/2**, one per capture.
Reopens: **0**. Source images: **0**. Whole-lesson images: **0**.
Parent image budget remains permanently **24/24**; historical reviewers
remain **6/6** and **2/2**. None of those budgets were reset.

Probe exit: **0**; stdout is preserved in `stdout.log`, stderr in `stderr.log`
(empty), and process status in `exit.json`. There were no page errors.
`probe.json` intentionally retains its pre-inspection UNKNOWN/pending state;
this report and `report.json` record the later actual visual review.
`image-ledger.json` records the completed one-time inspections.
`file-manifest.json` lists absolute paths, sizes and SHA-256 hashes of every
other output file and the input. The manifest excludes itself and its checksum
sidecar to avoid a recursive hash; `file-manifest.sha256` binds the manifest.

Browser context, browser and loopback server were all closed before visual
inspection. No installs, model/paid calls, backend, DB, Git, publishing,
credential changes, agent/chat actions, source edits, or writes outside the
authorized new output directory were performed by the review scripts.

## Limits

This settles the previously UNKNOWN E-cell readability in this exact bounded
mobile rendering only. It does not settle mathematical truth, classification
correctness, distractors, answerability, accessibility, real-device touch
ergonomics, other views, source fidelity, or approval of any wider artifact.
