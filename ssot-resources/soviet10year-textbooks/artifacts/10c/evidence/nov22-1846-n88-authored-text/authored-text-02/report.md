# N88 Changed-Input Text Check

Date: 2026-11-22. SAME STEMROBIN-184 /184-6 offline finish=review.
Status: TEXT CHECK EXIT 0; candidate only, no content/science/display approval.
Complete lessons: 0. Parent permanent 24/24 and charges 74 remain supplied and unchanged.
Fees remain UNKNOWN; these supplied counters are not new measurements.

## Authorized Delta

The parent changed only `lesson.prose[2].text`, bound to `p0067#4`:
`这些没有定义的输入` became `这些$x$值`.
The changed source span occurs once. The complete current lesson equals the first failed
candidate with exactly this replacement; all other prose, fields, formulas, source bindings,
figures, captions, identities, and five concept anchors are unchanged.
The exercises template is byte-identical to the first failed candidate.
This agent made no further template, source, errata, or mathematical correction.

## Actual Execution

Exactly one changed-input process ran the existing `edition.validate_text` route:
`text-check-02.execution.json`, actual exit 0, exact repository cwd, absolute venv Python,
`-B`, no bytecode writes, and no finalize, render, figure validator, or normalization writes.
All 68 relevant text objects passed; the error list and stderr are empty.
The 34 tasks remain numbered 204-237. Embedded source snapshots and identities are unchanged.
Prior valid exercise math, nonformula-number, and source-binding checks were inherited;
the previous 63-file baseline census was not repeated.
No prose-flow process was replayed. The five previously resolved anchors remain identical.

The affected block's exact source and current math arrays both contain:

1. `$x=\pi n,\ n\in\mathbf{Z}$`
2. `$x$`
3. `$-\frac{1}{\sin^2x}$`
4. `$]0,\pi[$`
5. `$\operatorname{ctg}\frac{\pi}{2}=0$`

The first failed candidate has only four spans, lacking item 2.
The new stdout ledger records all three arrays, the exact before/current text, allowed fields,
and the unchanged affected nonformula-number signature.
The inherited source totals are 127 math spans and 63 nonformula numeric tokens.

## Preserved Evidence

The exact first failed lesson/exercises snapshots, exit-2 receipt, stdout/stderr,
first authored report/ledger/manifest, and final passed prose-flow receipt/streams matched
their recorded bindings. Nothing in `authored-text-01` was rewritten.
Parent intake references remain `b7cf27`, `56705c`, and `c93100`.
New snapshots contain only the two current templates, without an old package copy.

## Current Hashes

Template paths are under `/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/n88-raw-assembly/work/adapt/10c/modern-us-neutral/lessons/ana10-c6-s3-n88/`.

- `lesson.template.json`: 35944 bytes; SHA-256 `c1712632a4ca668a7c450dd7ecf4a51315a4f8a87cdb62164a184687210a58b4`.
- `exercises.template.json`: 45245 bytes; SHA-256 `c415dabb6e8145256181b508970807808618a1856e9f994e7adfe9eea326a917`.
- Actual new receipt: SHA-256 `62e91749d3429e8bc6d434185da838cc7d89f452c3e1ca986b45d724b38a5b7e`.

`ledger.json` and `manifest.json` bind this report, current templates, snapshots,
actual receipt/streams, parent delta, and inherited first-failure evidence.

## Freeze And Holds

Parent-discovered raw D and rounding limitations remain frozen and unapplied.
The closed/open-interval wording, malformed property-4 expression, split oddness formula,
task 208 notation, table/degree-radian notation, and task 231 source reference remain unchanged.
No source-bound errata were added or used (`errata: []`).
Source/crop/vector/glyph/footer/internal-ink, math/science, modern-figure, and display HOLDs remain.
N89 remains the inherited incomplete raw candidate with `p0073#14` OPEN.
Source, modern-text, figure, math, science, and display approvals: NOTRUN.
Zero image/header opens, decodes, native image operations, model images, ROI/OCR, finalize,
render, figure validation, normalization writes, DB/Git/network/install/new-agent operations,
publication, or canonical/durable promotion. Historical usage is not reset.
All command sessions exited. No dependent production stage followed this text-only check.
