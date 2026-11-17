# Batch54 n147 FIRST Independent DISPLAY Review

Date: 2026-11-17. Ticket: STEMROBIN-180. Lesson: phy7-c2-s3-n147.
Checkout: /Users/yong/.codex/worktrees/0f12/lemmadeck.

**FIRST DISPLAY outcome: PASS.** No actionable DISPLAY finding in the current
approved modern-us-neutral snapshot. This is the first independent inspection
of the six existing full-page screenshots, not a replacement semantic review,
a new content gate, publication, or headed product acceptance.

## Evidence Boundary

Read the actual existing render/checker call receipts, complete stdout and empty
stderr. Independently hashed current HTML, ready inputs, receipts, screenshots,
and approved media. Parsed current HTML for display inventory only. No browser,
render, screenshot, checker, validator, gate or global-test replay was run.

Existing offline checker launches Chromium with `headless: true`, opens local
file HTML, blocks HTTP/HTTPS, and takes fullPage screenshots. Its script and
report are bound, not executed here. The product's headed desktop/mobile
acceptance remains **NOT PERFORMED**. Navigation, enabled interaction, scoring,
server judging, authenticated app behavior and publication are not established
by these static disabled-control previews.

Only the named ticket report and its owned scratch directory were written:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/display-review-b54-n147/`.
Other contributors' files were not edited.

## Actual Existing Once Receipts

Receipt directory:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/commands/`.
Both calls have cwd `/Users/yong/.codex/worktrees/0f12/lemmadeck`, exit 0,
signal null. The exact receipt files, their byte counts and SHA-256 values are
in `input-output-bindings.tsv`.

Render receipt: `batch54-n147-official-render.call.json`.
Started 2026-11-17T06:14:44.301Z; finished 2026-11-17T06:14:44.696Z.
Actual argv, in order:

```text
env
PYTHONDONTWRITEBYTECODE=1
/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
-B
.claude/skills/ld-s10y-lesson/tools/p2c.py
render
--book
7p
--edition
modern-us-neutral
--lesson
phy7-c2-s3-n147
--work
.tmp/ld-s10y-lesson/display-b54
```

Stdout is the complete 283-byte JSON: ok true, selected lesson n147,
prose 20, exercises 8, choices 6, and the stated display-b54 output directory.
Its SHA-256 is `6ae4fa58d8b1ae53592a8252101ffc0d3a1bd82f8ee83a3b116dd54c174bb41c`.
Stderr is 0 bytes, SHA-256
`e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
Both actual streams match the receipt.

Checker receipt: `batch54-n147-existing-offline-desktop-mobile-check.call.json`.
Started 2026-11-17T06:14:52.798Z; finished 2026-11-17T06:14:54.759Z.
Actual argv, in order:

```text
env
S10Y_BOOK=7p
S10Y_RENDER_ROOT=.tmp/ld-s10y-lesson/display-b54/render/7p/modern-us-neutral
S10Y_CHECK_OUTPUT=.intentfold/tickets/STEMROBIN-180/tmp/offline-evidence-b54-7p
node
.intentfold/tickets/STEMROBIN-180/tmp/offline-check.mjs
phy7-c2-s3-n147
```

Stdout is exactly the following line plus newline, 83 bytes:

```text
PASS: 1 selected lessons, 6 desktop/mobile offline pages; not full-book acceptance
```

Stdout SHA-256:
`c59ea32ec4c9a6e9f0d9d605344604a83a11d1773aa99998eb265355ff2be6fd`.
Stderr is empty with the same empty-file hash above. Both actual streams match.
The existing report is pass with exactly six n147 results, three at each
viewport. Every current HTML hash matches both corresponding report entries.
These are reused once results, not new command invocations.

## Complete Display Coverage

All six full-page images were opened once with `functions.view_image`,
`detail: original`, in the exact order in `image-ledger.json`.

| Surface | Desktop 1440x960 | Mobile 390x844 | Independent observation |
| --- | --- | --- | --- |
| Text | PASS | PASS | All 16 paragraphs, two portraits and two captions; title, right edge and final bottom text complete. |
| Written exercises | PASS | PASS | Both groups and all eight prompts; final g2-4 question, teacher qualifier and safety sentence complete. |
| Choices | PASS | PASS | Six questions, all 25 options, four radio groups and two checkbox groups; final question and option E complete. |

The 17 stored prose blocks produce 20 displayed flow items. The complete
observed order is:

| Flow item | Observed content |
| --- | --- |
| 1 | Current effect, particle interaction and metal-conductor scope. |
| 2 | Stationary pure resistor and emphasized energy conversion. |
| 3 | Produced heat wording and energy transferred to surroundings. |
| 4 | Constant voltage/current premise introducing electrical work. |
| 5 | A=UIt and the four variable definitions. |
| 6 | Q=A, Q=UIt and volt/ampere/second/joule units. |
| 7 | Ohm-law substitution premise and U=IR. |
| 8 | Q=IRIt, including both current factors. |
| 9 | Q=I^2Rt with visible superscript and resistance definition. |
| 10 | Emphasized law statement and controlled-comparison sentence. |
| 11 | Constant/approximate model and temperature/resistance limitation. |
| 12 | Independent historical experiments and law name. |
| 13 | Joule/calorie units and approximate conversion introduction. |
| 14 | Both 4.2 and 0.24 conversions and approximation qualification. |
| 15 | Teacher-led low-voltage measurement, heat loss and container heat. |
| 16 | Complete final paragraph warning against equating water heat with all electrical energy. |
| 17 | Complete Joule portrait, tbl-p0374-01. |
| 18 | Complete Joule name, 1818 to 1889 and both caption sentences. |
| 19 | Complete Lenz portrait, tbl-p0374-02. |
| 20 | Complete Lenz name, 1804 to 1865 and final caption sentence. |

Both portraits are visibly nonblank and intact in the full-page images,
including crown, face and lower bust. No extra native crop was necessary.
Each spec declares decorative inline maxWidthPx 160 and widths [160].
Existing measured media boxes are 160x240 on both viewports, with no figure
scroll container. The text HTML embeds the exact two approved PNG byte hashes
listed in the binding ledger; both have intrinsic dimensions 1024x1536.
This is page-display observation plus reused offline measurements, not a new
source/candidate identity or cultural FIG review.

| Choice ID | Mode | Options | Complete final option |
| --- | --- | --- | --- |
| thermal-mechanism | multiple | 4 | D |
| law-and-derivation | single | 4 | D |
| timed-resistor-energy | single | 4 | D |
| sound-wire-joint | single | 4 | D |
| immersion-heater-fault | single | 4 | D |
| series-material-comparison | multiple | 5 | E |

The written stable IDs are 1, 2, 3, 4, g2-1, g2-2, g2-3 and g2-4.
All questions and option bodies remain separated and wrap inside their
columns. Mobile headings wrap without losing the law name or view suffix.
Long law options retain equals signs, parentheses, slash fractions, variables,
superscript 2 and final comparison clauses; no overlap with controls or
neighboring options. Omega, A and J glyphs, 20/5/30 givens, grouped numeric
option values, and 4.2/0.24 prose conversions are legible. This observes glyph
display; it does not recalculate or re-adjudicate any option.

Rightmost lines remain inside the screenshot width. The final body paragraph,
Lenz caption, g2-4 last safety sentence and question-6 option E end visibly
above the full-page bottom padding. No cut-off final line, black/blank media,
tofu, raw TeX, failed-render badge or incoherent wrapping/overlap was observed.

No answer panel, key, selected answer, correctness styling, author reasoning,
source-solution record, internal path or ticket label appears in the learner
screenshots. Current HTML has zero script elements and zero .err markers.
Display inventory has 14 text, 3 written and 61 choice KaTeX spans.
All 25 controls are disabled and unchecked, with types matching their modes.
No correctness/key attributes or source_solution, seed_sha256,
correctOptionIds, independent_solution, misconception, source_numbers,
correct_index, author-internal, STEMROBIN, .tmp/ or accept tokens occur in the
HTML. Numeric alternatives and the approved prose formulas remain ordinary
question content, not displayed solution/key leakage.

## Reused Approvals And Retained Limits

Existing reports were read as TEXT ONLY; their evidence paths/hashes are
provenance, not authority to reopen their images or repeat their judgments:

- Repaired TEXT: sole Q1 affected PASS; unchanged body/tasks inherited.
- SOURCE: repaired 372 PASS plus unchanged 373 page PASS; 374 n147 portrait
  and caption source approval. Historic 372 FIRST BLOCK remains unchanged.
  Page375 ambiguity and neighboring/HOLD boundaries are not released here.
- FIG: independent Joule FIRST_PASS and Lenz PASS, with both current durable
  media review statuses pass. No original/candidate/source image was opened.
- CHOICE: current repair1 affected PASS; retained unaffected results and the
  thermal-mechanism directional limitation remain exactly as reported.
  Original FIRST/rejected choices were not opened or semantically reviewed.
- FINAL: existing conversion/retention/finalization result reused. Current
  answers are ready, count 8, auto 1 and ungraded 7; no answer solving or
  answer publication was performed.

The current ready lesson, exercises, figures and answers each have status
ready. Current choice draft/view/review/author byte hashes match the approved
repair1 snapshot named in the CHOICE report. Semantic approvals were not
renewed by this DISPLAY PASS.

Independent written explanation/formula/derivation/law production and
numerical working are not demonstrated by recognizing options. Exact named
material ranking, full transient temperature-dependent ranking, and
teacher-led low-voltage measurement/experimental verification remain deferred.
No experiment, new interaction or experimental capacity was completed.
Existing repair budgets are not reset or consumed.

## Freeze And Exact Image Accounting

`input-output-bindings.tsv` records 58 current external files with absolute
paths, exact bytes and SHA-256: ready inputs, approved templates, eight
approved-media files, eight reused text reports, three existing receipt
triplets, existing tools/report, three HTML outputs and ten existing image
outputs. Six full-page images were opened; four checker figure-region image
outputs were hash-bound only and **NOT OPENED**. Those four are not new crops
and are not asserted to be native 160x240 media crops.

`image-ledger.json` records each of the six actual opens, exact full-page
dimensions, viewport, bytes, SHA-256 and the zero-reopen/crop/source counts.
`freeze.json` binds this report and both ledgers without a circular self-hash;
its own bytes/hash are returned textually. A final read-only byte comparison
confirms the 58 listed external inputs/outputs have not changed while this
report was written. Hash comparison is freeze accounting only, not a checker
or gate replay.

Images: **6/8 batch, 6/24 context; parent payload 0**. Originals/source images
0, approved raster image opens 0, reopens 0, extra crops 0, new captures 0.
Inherited approvals arrived as text only and debit no image load here.

New render/checker/browser/validator/gate/global-test invocations: **0**.
New course edits, source/semantic/choice re-reviews, repairs, Git, DB, backend,
app, service, dependency, publication and pipeline actions: **0**.
Only reviewer report/ledger files were authored. Stop at this FIRST DISPLAY
outcome; no new gate or downstream acceptance is approved.
