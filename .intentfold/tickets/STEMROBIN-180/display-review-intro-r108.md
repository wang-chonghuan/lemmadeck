# Independent DISPLAY Review: Introduction R108

STEMROBIN-180; `phy8-c1-s1-t1`; November 20, 2026.
Sole current independent reviewer for the genuinely new DISPLAY phase.
Same invocation; freshness already passed; no update/setup.

## Verdict

**DISPLAY: REVISE.** Actual pixels reveal two remaining display defects despite
the native report's automated `pass`. This is the FIRST independent display
judgment for these new surfaces; both failures and the original native report
are preserved. The previously parent-bound affected TEXT PASS is not reopened.

## Findings

### D1 [P1]: Formatting syntax is printed in headings and prose

All four screenshots show literal `<strong>` and `</strong>` in the lesson
title and breadcrumb. Both text screenshots also expose the full
`<span style="text-emphasis:filled dot;text-emphasis-position:under">` syntax
and closing tags around the space/time concepts and the main mechanics question.
The inserted Latin CSS strings interrupt otherwise readable Chinese sentences
instead of supplying the intended emphasis.

On the mobile exercise surface, exposed title markup consumes enough width to
split `习题` across the two heading lines. This is not a clean zero-task title.
Render the intended safe emphasis or clean display text, not visible formatting
syntax, without rewriting accepted content.

### D2 [P1]: Footnote marker and note grouping are broken

Both text screenshots place literal `<sup>&#9312;` and `</sup>` on separate
body-text lines after the historical example, rather than a real raised circled
reference attached to its sentence. The retained separator displays as `---`.
The note then begins with literal `<small>&#9312;`, occupies ordinary body-size
paragraphs, leaves the closing quotation mark on its own line, and ends with a
standalone literal `</small>`.

The quotation and correction remain readable, but the required small-footnote
hierarchy, coherent grouping and reference positioning do not. Restore the real
reference, readable small-note presentation and separator while retaining the
accepted quote/correction. No new historical or scientific TEXT review is needed
to establish this pixel-level display failure.

## Four Actual Surfaces

Each full saved PNG was opened exactly once with `view_image`; no crops/reopens.
The image-batch rule was read before the first open. Four is the correct surface
count: text/exercises at two viewports, with zero choices.

| Surface | Viewport | Full PNG | Independent result |
| --- | --- | --- | --- |
| Text desktop | 1440 x 960 | 1440 x 2602 | REVISE: D1, D2 |
| Exercises desktop | 1440 x 960 | 1440 x 960 | REVISE: D1 |
| Text mobile | 390 x 844 | 390 x 3678 | REVISE: D1, D2 |
| Exercises mobile | 390 x 844 | 390 x 844 | REVISE: D1 |

Chinese body text and genuine Latin-number date/quantity tokens are legible and
coherently sized. No visible text overlap, edge clipping or horizontal overflow
was observed in these four full images. Both text captures include the complete
terminal course-preview paragraph and the complete zero-task navigation control,
with bottom margin. This establishes visible end content, not tested scrolling
or navigation behavior.

Both exercise captures contain the title, breadcrumb and return control, with
no invented tasks, choices, answers or figures. They are not error-only pages.
Their blank body is appropriate for zero original written tasks; the exposed
title markup is the defect, not the absence of questions.

The shared parser's **21 actual rendered prose paragraphs** are distinguished
from the original **14 semantic blocks**; no content gate was repeated. The
observed marker-only/tag-only paragraphs and detached quotation mark are display
symptoms, not a new count of source knowledge blocks.

## Binding And Scope

Before the first image open, 13 inputs were byte/SHA-256/mode bound: the image
rule, existing retained-text record, canonical modern lesson/exercises/figures/
adaptation audit, native report, two HTML files and four screenshots. Canonical
file hashes match the existing retention record; HTML/screenshot hashes match
the native report. The same identities are checked unchanged after inspection.
External original/source paths mentioned in the retained record were not opened.

The immutable `0444` manifest is:
`/Users/yong/.codex/worktrees/stemrobin-180-six/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/resume-180-6/intro-display-review-r108/manifest.json`.
It externally binds this report's final bytes/SHA-256, all inputs/outputs,
surface-level observations and before/after identities, avoiding self-reference.

Only this durable report and the owned `intro-display-review-r108/` evidence
were written. No source/TEXT/ANSWER/CHOICE replay, original-tree access, app or
candidate change, browser, rerender, DB, paid call, tool install, Git, ticket
operation, other-chat access, finalization, retention, merge/deploy, or live
product acceptance was performed. No product repair attempt was made and no old
failure or budget was reset.

Actual image opens: **4 reviewer, 0 parent**; each PNG once; reopens/crops **0**.
Actual new paid calls: **0**. Cost/token totals are unmeasured (`null`), not
estimated. Native headless status remains recorded as supplied.
