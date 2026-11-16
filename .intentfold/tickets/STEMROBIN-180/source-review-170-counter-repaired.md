# Source170 Counter Repair And Affected Review

2026-11-16. The prior full independent166..170 content review remains
authoritative;166..169 original PASS is reused. This is affected-only review,
not a second full page/crop inspection.

The source worked example has four shared horizontal rows. Its left-column
underline made `_single_fraction_row` treat the last two right-column text rows
as a numerator/denominator pair; the final right row is the short CJK "顿.".
Main changed only that helper's body-row guard: outside candidate rule columns,
two vertically separated full-height body-glyph rows prevent fraction merging.
Disconnected parts of the last CJK glyph are combined by horizontal footprint.
No global threshold lowering, page-number branch, transcription or fake row added.
The earlier independent emphasis-dot alignment patch is unchanged.

Preserved verification history: the initial cropped-example fixture failed3
rows against4; switching to the full original-page fixture still failed24
against25. Protecting disconnected CJK body-glyph strokes resolved that defect.
The final four focused tests passed: actual page25rows, short full-height CJK
body row outside underline, disconnected CJK row, and a genuine single fraction
whose glyphs remain in the rule's columns. Earlier7/7 dot tests are reused,
not rerun. These were tool repairs, not another figure repair allowance.

The original author freeze and first170finalize failure are untouched.
Separate repair root `.tmp/ld-s10y-lesson/source-repair-170` copied exact inputs.
Official170finalize ran once there, exit0:16blocks25printed/25written,
zero figures, zero normalizations, one unchanged registered arithmetic erratum.

Affected comparison completed: original versus repaired `page.md` byte-equal
and `page.json` byte-equal (both cmp/diff exit0). The audit changes only detected
count24->25 and removal of the corresponding line-count error. Both input
page.png images, layout/grid/template provenance must remain byte-equal during
promotion. All original formula data, eight closed source questions, exercise30
open prefix and `p0170-math-1` remain unchanged. In particular the faithfully
retained printed16480/16.5kN is not rewritten to the mathematically correct
16150.4/16.2kN in the raw layer.

Verdict:170 affected mechanical PASS. Approved union is166..169 exact original
PASS plus170 repaired audit PASS,111actual rows,56blocks and four exact crops.
No new source review, vectorization or prior-through165 assembly rerun required.
