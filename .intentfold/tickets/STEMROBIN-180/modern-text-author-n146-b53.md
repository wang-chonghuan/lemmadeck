# Batch53 FIRST Modern TEXT: 146

`phy7-c2-s3-n146`, 7p, FIRST author frozen; awaiting independent full TEXT
review. Not a complete modern course or SOURCE approval.

The existing assembler ran once on exact approved370/371 copies with the
official TOC: exit0, 11 prose blocks and6 tasks in146. Only146's three
generated SOURCE files were exactly retained; the seven-task upstream orphan
was excluded. No369 HOLD bridge, synthetic chapter/section header, or older
course rewrite. The additive raw index is56 assembled pages/22 entries/91
tasks; actual approved page totals are74 for7p and16 for8p.

Official adapt-prepare ran once, exit0. All11 blocks, six task identities,
groups, page/source references, original source.data/source_text, formula
order and quantities remain. No figures, original images, SOURCE solutions,
final answer keys or choices were authored here.

## Text And Tasks

The text distinguishes rated, constant and interval-average power; matches
power/time units; retains watt-hour, hundred-watt-hour and kilowatt-hour
conversions; and retains the100W/6hours/30days worked example. The6hours
quantity was not invented or changed. All23 original math spans remain.

Six tasks remain: identify specified appliance power; express work using
power/time; name energy units; calculate the0.6kW iron's1.5hours consumption;
calculate the four lamps' monthly energy fee; and survey actual household
appliances for one week and compare estimated fees with the same week's
meter-based fees. The price is now explicitly hypothetical4 cents per kWh,
not a current tariff; source currency remains only in source_text/data.
Home investigation is adult-assisted and limited to safe readable labels,
not dismantling or wiring. Actual duty cycles and fixed charges are separated
from consumption estimates. No numeric or answer payload was added to tasks.

## Actual Failures And Repairs

The first official normalization and prose_flow both exited0, but actual flow
paragraphs7/8 split a bold span. Its three templates and flow output were
frozen in `text-author-n146-b53/FIRST-layout-rejected/`. The sole template
layout repair moved closing bold markers before punctuation in blocks3/5.
Only those blocks were re-normalized; all other blocks and source snapshots
were deep-identical. Affected flow and anchor/bold checks passed,13 paragraphs
and section-break indices4/6/9 copied from actual flow output.
Template repair **used1/remaining0**; no further template changes authorized.

FIRST official validate_lesson exited1 because the old NUMBER regex treated
Chinese letters as identifier characters: source `6小时` had no numeric token,
while spacing it as `6 小时` created token6. This was a real existing-tool
defect, not a changed textbook quantity. The original edition.py/test and all
three templates were frozen in `number-parser-FIRST/`; the failed receipt is
`tmp/commands/batch53-n146-first-official-text-validation.call.json`.

One tool-only correction uses ASCII identifier boundaries. Four new focused
tests passed once: CJK spacing, preserved negative/decimal quantities,
math/ASCII-identifier exclusion, rejected actual quantity changes and math
text-literal spacing. Existing assertions were not changed. The affected
official validation passed with all three templates byte-identical to its
FIRST rejected input. Tool repair1 is separate from template repair1;
neither original failure nor exhausted budget is reset.

## Verification And Freeze

Actual command records under ticket `tmp/commands/`:

- `batch53-n146-first-text-normalize`: exit0.
- `batch53-n146-first-prose-flow`: exit0, semantic bold-layout rejection retained.
- `batch53-n146-sole-affected-layout-normalize`: exit0.
- `batch53-n146-sole-affected-prose-flow`: exit0.
- `batch53-n146-first-official-text-validation`: exit1, NUMBER boundary defect.
- `batch53-number-boundary-focused-tests`: exit0,4 tests.
- `batch53-n146-number-parser-affected-official-text-validation`: exit0, identical templates.
- `batch53-n146-first-text-katex`: exit0,23 spans/no warnings.
- `batch53-n146-affected-layout-and-anchor-check`: exit0,13 paragraphs/4,6,9.

The freeze manifest is
`.tmp/ld-s10y-lesson/text-author-n146-b53/FIRST/manifest.json`; it binds actual
current template bytes, SOURCE files, changed tool/test and completed receipts.
Shared Python runtime was reused with `-B` and `PYTHONDONTWRITEBYTECODE=1`.
Parent/author images0, service requests0; model tokens and actual billed cost
unknown. No app/dependency, DB/publication, full-project check, new pipeline,
formal handoff, merge or deploy. This report is retained with a future complete
product batch, never a report-only commit.
