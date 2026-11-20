# Affected DISPLAY Review: Introduction R108 R1

STEMROBIN-180; `phy8-c1-s1-t1`; November 20, 2026.
Sole current independent reviewer; same invocation, D1/D2 only.
No freshness/setup/update replay.

## Verdict

**AFFECTED DISPLAY: PASS for D1/D2. No remaining affected defect found.**

This verdict comes from actual inspection of all four new complete saved PNGs,
not automatic adoption of the native report's `pass`. The FIRST DISPLAY REVISE
report/manifest remain unchanged. Accepted TEXT and source/content stages were
not reopened.

## D1: Resolved

All four new images show clean Chinese titles and readable breadcrumbs, with no
literal strong tags. The mobile `引言 · 习题` heading now fits coherently on one
line. Both text surfaces render the space/time and principal mechanics-question
under-dot emphasis as actual emphasis, including natural mobile wrapping, without
printed span tags or CSS strings. Chinese prose and genuine date/quantity tokens
are legible and coherently sized.

## D2: Resolved

Both new text images show a real raised circled-one reference attached to the
historical paragraph's concluding sentence. A horizontal border after the
spacecraft paragraph introduces the retained footnote, rather than literal
three-hyphen text.

The quote and correction occupy three consistently smaller, readable paragraphs.
The closing quotation mark stays with its quoted sentence rather than on a
standalone line. The note marker, quotation and corrective framing are visually
coherent on desktop and mobile. No sup/small tags, numeric entity syntax or
marker-only/tag-only paragraphs remain visible. This is a presentation judgment,
not a fresh scientific-history review.

## Four New Surfaces

The image-batch rule was read before these opens. Each full PNG was opened
exactly once via `view_image`; no old PNG, crop or image reopen was used.

| Surface | Viewport | Full PNG | Affected result |
| --- | --- | --- | --- |
| Text desktop | 1440 x 960 | 1440 x 2224 | PASS: D1/D2 |
| Exercises desktop | 1440 x 960 | 1440 x 960 | PASS: D1 |
| Text mobile | 390 x 844 | 390 x 3223 | PASS: D1/D2 |
| Exercises mobile | 390 x 844 | 390 x 844 | PASS: D1 |

No visible overlap, clipping or horizontal overflow was observed. Both full text
captures show the complete terminal course-preview paragraph and the complete
zero-task navigation control before the bottom margin. Both exercise captures
have a clean title/breadcrumb and readable return control, with correctly empty
bodies: zero tasks, choices, answers and figures, not error-only pages.
End visibility is observed; scrolling or navigation behavior was not exercised.

## Binding And Preservation

Candidate manifest:
`/Users/yong/.codex/worktrees/stemrobin-180-six/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/intro-display-affected-candidate.json`

SHA-256:
`ba98e67988a8c29acdd9b9bc48f55b5fa7752fd761c011df14d6fd569efc2463`,
mode `0444`.

Before the first new image open, 52 inputs were bound by actual bytes/SHA-256/
mode. They include the candidate; native report; two current HTML files and four
new PNGs; declared current renderer/test files; preserved FIRST HTML/renderer
snapshots, report and manifest; unchanged retained content; and existing command
receipts. All candidate-declared identities and native HTML/PNG digests match.
After inspection, every bound input is checked unchanged. Byte hashing retained
source/content files is identity checking, not source or TEXT acceptance replay.

The exact FIRST DISPLAY manifest remains SHA-256
`5be1ce80f68df094d3de254934c62c3f821e7f852f8f0c042cf9a4458eaa98a8`;
the FIRST report remains SHA-256
`d570a5f871eb955e0aeb3bd67388fab404625c070834eb9e414eb6c19beafbe0`.
Old PNGs were neither opened nor rebound.

The existing emphasis-test exit-1 receipt and its stdout/stderr remain bound and
unchanged. The candidate records the corrected obsolete assertion and affected
test exit-0 receipt; neither test was rerun by this reviewer. These receipts are
provenance, not a reset of content failures or budgets and not the basis of visual
PASS.

New immutable `0444` manifest:
`/Users/yong/.codex/worktrees/stemrobin-180-six/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/intro-display-review-r108/affected-r1/manifest.json`.
It binds this final report, all review outputs, native report/two HTML/four PNGs,
candidate and before/after identities. Report hashing is external, avoiding
self-reference.

## Actions And Accounting

Only this new durable report and owned `affected-r1/` evidence were written.
No candidate/code edit, browser, rerender, source/TEXT/ANSWER/CHOICE replay, test
rerun, other-chat access, DB, Git, paid call, ticket operation, finalization,
retention, merge/deploy or parent binding was performed.

Actual image opens: **4 new + 4 prior = 8 total in this invocation; parent 0**.
Reopens/crops/old-image opens: **0**. Actual new paid calls: **0**.
Cost/token totals are unmeasured (`null`); no estimates supplied.
Stop here for the parent's independent binding.
