# Offline Title Emphasis: Sole Affected Repair

STEMROBIN-180/C, 2026-11-16. Dalton's unique FIRST display review found
literal single-star delimiters in n99's title on all six desktop/mobile
surfaces. All eleven prose paragraphs, both original written tasks, both
choice questions and eight options passed their existing body display review.
The FIRST report remains a failure, never replaced by the repair.

The offline renderer escaped the title directly while rendering body text
through its existing escaped inline-emphasis function. The sole repair makes
`h1` use that same function. Course wording and resource bytes do not change.

The new `--titles-only` mode requires existing headings to match the approved
plain title exactly before writing any surface. It updates only `h1`, without
body generation, figure rendering or the choice validator. A conflicting
partial mode, mismatched heading, or repeated emphasized-heading repair fails.
Full renders use the same corrected heading function.

Three focused tests passed once: safe emphasis/HTML escaping and unchanged
bodies, mismatch rejection without partial writes, and repeated-repair
rejection. Receipt: `tmp/commands/batch24-title-focused-tests.call.json`.

The original three HTML files and six full-page screenshots remain in their
FIRST locations. Exact copies in a separate repair directory were updated
once. Receipt: `tmp/commands/batch24-n99-titles-only-sole-render.call.json`.
The affected six-page browser command passed once, asserting italic title
text, clipping, title/crumb/first-body separation, and exact preservation
outside `h1`. It produced only new heading-region screenshots:
`tmp/offline-evidence-batch24-7p-n99-title-repair-01/`.

Repair unit: offline `h1` inline emphasis, budget 1/1 exhausted,
mechanical-inclusive. This does not reset any lesson, SOURCE or figure budget.
Fresh affected-only visual review is recorded separately and is required
before counting n99 as complete offline content. No source, answer or option
re-review, choice-gate rerun, application/dependency/schema change, DB write,
publication, full project checks or formal handoff.
