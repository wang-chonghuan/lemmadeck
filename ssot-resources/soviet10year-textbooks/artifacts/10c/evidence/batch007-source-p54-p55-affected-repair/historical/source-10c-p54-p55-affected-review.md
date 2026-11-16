# Physical54/55 Affected F1/G1 Review

## Limited Disposition

**F1: ACCEPTED for the nine specified text substitutions only.**

**G1: ACCEPTED for the two previously supported counting-only margin
allocations and their disclosed affected-finalize records only.**

No additional discrepancy was found in the bounded before/after text and
metadata comparison. This is ONE affected comparison, not another StageA,
StageB, source review, pixel PASS, complete-unit disposition, or publication
approval. The original physical55 FIRST failure is not retroactively passed.

## Evidence Consumed and Method

Evidence root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/source-10c-p54-p55-affected-repair`.

All 23 supplied text records were consumed in full, without truncated output:

- `before/0054/page.md`, `page.json`, `audit.json`.
- `before/0055/page.md`, `page.json`, `audit.json`.
- `after/0054/page.md`, `page.json`, `audit.json`.
- `after/0055/page.md`, `page.json`, `audit.json`.
- `expected.json`, `comparison.json`, `protected.json`.
- `0054-start.json`, `0054-result.json`, `0054-stdout.txt`, `0054-stderr.txt`.
- `0055-start.json`, `0055-result.json`, `0055-stdout.txt`, `0055-stderr.txt`.

Both stderr files are empty, with recorded file size zero. Read-only unified
diffs compared all six before/after page-record pairs. Their exit1 results
indicate the displayed text differences, not a pipeline failure; the unchanged
physical54 audit comparison exited0. SHA-256 was independently computed only
for the four bounded after-page MD/JSON files, not for protected sources or the
author package.

No source image, figure image, source grid, original review, later page, or
protected file was reopened. No counter, finalize, test, helper, solver, or
pipeline was run by this reviewer. The supplied finalize command records were
read as evidence, not executed.

## F1 Text Comparison

The full MD and JSON diffs agree: precisely six physical54 occurrences and
three physical55 occurrences changed from `\arccos` to
`\operatorname{arc\,cos}`. The internal gap is explicit. This disposes the
previously accepted spacing finding at the serialization level; there is no
new rendering or pixel adjudication.

The following row numbering is derived from the existing serialized line
inventory, including caption/footer rows and excluding empty figure blocks.
It is not a fresh source-coordinate observation.

| Page | Row | Specified Occurrence After Repair |
| --- | --- | --- |
| 54 | 2 | `\operatorname{arc\,cos}\left(-\frac{\sqrt{2}}{2}\right)` |
| 54 | 4 | `\operatorname{arc\,cos}` in the four-decimal function-value paragraph |
| 54 | 6 | `\operatorname{arc\,cos} x` in the angle-finding paragraph |
| 54 | 12 | `\operatorname{arc\,cos} x=y` after `\cos y=x` |
| 54 | 13 | `\operatorname{arc\,cos} 0.8746` in example 1 |
| 54 | 16 | `\operatorname{arc\,cos}0.8746\approx0.5061` |
| 55 | 11 | `\operatorname{arc\,cos} a` |
| 55 | 12 | `-\operatorname{arc\,cos} a` |
| 55 | 13 | `\pm\operatorname{arc\,cos} a` |

No other body text, mathematical operand, sign, value, delimiter, punctuation,
space, emphasis command, line break, block order, caption, or footer changes
appear in the full diffs. In particular:

- Physical54 retains `当 $a=1$ 时，方程（1）有解.` with its author-correct period,
  not the original StageA colon interpretation.
- Physical55 retains `它的每一个值一次. 而在闭区间` with its author-correct period,
  not the original StageA comma interpretation.
- Both solution rows retain `\boldsymbol{Z}`. No blackboard-bold replacement
  or ordinary-weight substitution is introduced.
- Physical54 retains `\leqslant` and its existing mathematical notation.
- No mathematical solution or convention was used to supply unclear source
  material, and no extra row or forced-break marker was inserted.

Physical54 has the same nine blocks and 23 serialized rows; physical55 has the
same seven blocks and 15 serialized rows. The opening physical54 paragraph
retains `cont: true`. Body worked examples remain prose rather than tasks.
All ownership, `cont`, `open`, and `samerow` fields are unchanged.

## G1 Counting Metadata Comparison

Physical54 metadata is unchanged. Its audit is byte-identical before/after,
with 23/23 lines and no count exclusions.

Physical55 MD frontmatter and JSON metadata add exactly:

1. One appended explanatory note, identical to `expected.json`'s `note`.
2. Two `count_exclusions`, identical to `expected.json`'s entries, including
   their `kind`, boxes, order, and complete reason strings.

| Kind | Exact Box `[x,y,width,height]` | Limited Allocation |
| --- | --- | --- |
| `scan-artifact` | `[797,0,898,19]` | Previously supported TOP edge no-body margin region |
| `scan-artifact` | `[230,2479,1377,33]` | Previously supported BOTTOM edge no-body margin region |

Both boxes exactly match the prior separate allocation clarification. The
schema kind denotes a NON-CONTENT edge area for counting only; it does not
identify a physical cause. Both complete reason strings expressly retain
exact physical origin **UNKNOWN** and unchanged original PNG/extracted figures.
No new exclusion geometry or source-content allocation is approved here.

The original seven notes remain intact. The appended note explicitly locates
the old "No count exclusions are supplied" statement in the retained
FIRST-author state, explains the affected counting-only additions, preserves
origin UNKNOWN, and states that original FIRST finalize17/15 exit1 remains
retained history. This is an explicit historical qualification, not an
undisclosed removal or rewrite of the old note.

`printed_lines: 15` remains unchanged in physical55 MD/JSON metadata. It was
not changed from17 to15 as an override. The affected audit instead records
`lines_printed` changing from17 to15, adds the two exact exclusions, and changes
the prior mismatch error array to empty. `lines_md` remains15. All other audit
fields, including the entire figures array, remain unchanged.

Both after audits have empty `normalizations`, `unknown_chars`,
`katex_warnings`, and `errors` arrays and `errata: 0`. The pre-existing
`provenance.normalized: true` is unchanged metadata, not evidence of new
normalizations. The recorded affected runs report zero normalizations.

## Figures and Boundaries Preserved

The full figure audit substructure is exactly unchanged before/after:

- Figure32: ID `fig-32`, label `图 32`, box `[223,272,1277,406]`,
  components61, `from: [210,270,1300,420]`.
- Figure33: ID `fig-33`, label `图 33`, box `[180,1809,1327,341]`,
  components57, `from: [170,1810,1340,350]`.
- Figure33 ownership retains method `snapped-components`, no neighbours,
  ink_pixels36540, and ink SHA-256
  `f3ef12e1519658cd9719d4d873661c845ae0451b15d33e7fc7a8c813de0ca2b6`.

MD figure references, figure blocks, labels, boxes, caption rows, and all
ownership fields are unchanged. Figures remain body illustrations, with
separate captions and no invented exercise ownership or caption sharing.

Existing notes preserving repeated upper/lower `a` labels, no invented minus,
broken figure strokes, sloped baselines, uneven ink, and uncertainty about
their intent/origin remain unchanged. The parent's protected-byte evidence
reports both figure PNGs unchanged. This preserves the frozen disposition of
all gaps, guide line types, endpoints, and the light-centered lower y-axis
mark; none is newly inspected or certified as a pixel PASS here.

Physical55 still has `<!-- p open -->` and JSON `open: true` for its final
paragraph. Its final literal fragment remains exactly `现在，为了写出方`,
without invented continuation or terminal punctuation.
`ana10-c6-s3-n86` remains **OPEN**; its right boundary remains **UNKNOWN**.
No heading, later source content, or unit closure is inferred.

## Recorded Affected Finalize

| Page | Recorded Start UTC, 2026-11-16 | Recorded End UTC | Exit / Signal | Recorded Lines | Recorded Normalizations |
| --- | --- | --- | --- | --- | --- |
| 54 | 13:36:04.249 | 13:36:04.683 | 0 / null | 23 printed / 23 MD | 0 |
| 55 | 13:36:04.685 | 13:36:05.093 | 0 / null | 15 printed / 15 MD | 0 |

Each supplied start record identifies the local venv Python executable with
`-B`, the lesson `p2c.py finalize` command, book10c, and its respective page.
Each result and stdout agrees with the corresponding after audit and
`comparison.json`. There is one disclosed affected run per page, separate from
the original FIRST-author finalize.

Both start records contain observed layout SHA-256
`734e2e31b457009fe1454964bd874776b65127b2ac6b7941bf31476b6cf07479`
and expressly limit it to a before/after filesystem hash, not a
subprocess-loaded-module certificate. That limit is retained. Historical tool
snapshots are not promoted to execution-time byte certificates.

The original physical55 FIRST audit is still present in
`before/0055/audit.json`: 17 printed versus15 MD, no exclusions, and the
original mismatch error. Its historical exit1 remains retained as disclosed;
the affected exit0 does not erase it or alter the unique StageB's conclusions.

## Final File Bindings

These four SHA-256 values were independently computed from the bounded
after files and match `comparison.json`:

| File Under Evidence Root | SHA-256 |
| --- | --- |
| `after/0054/page.md` | `2d3fe005a152f2d3fdb6db802326c1f200c437f9dfd63805614d3fb93302678c` |
| `after/0054/page.json` | `2dd5c3e93921e56771c173c38c033dc00e1aad14c5fa0dc4781eeb19dd3ab4ef` |
| `after/0055/page.md` | `9fb2f57c72f4418d0640864122a3b823e2dde873a4460f643277d0017e09380a` |
| `after/0055/page.json` | `b7d43a9559d4993c7e0513004126376c940342240015cd59d9f33c4c5e7a5c7a` |

`protected.json` was consumed fully: its 21 bindings cover physical54/55
source raw/grid/layout/template records, both figure PNGs, frozen StageA,
unique StageB, margin clarification, author report/manifest, and the
physical52/53 MD/JSON/audit triples. `comparison.json` reports those protected
files unchanged. Their files were not opened or independently rehashed here;
this is consumed parent protection evidence, not a newly performed 21-file
verification.

The protected records retain StageA SHA-256
`6a1bbcd5af9d206ce72ca2e46dd609066a79ef57c7f113082fe2292b445228a4`,
unique StageB SHA-256
`a2584f13da56a1b86dab4e00d92de195e4ac5e8ee7ff421994e9cadadea890e0`,
and margin clarification SHA-256
`1ca03fb4ac18ff227e96fa4bcd046454438c1c43945b7a7a9b22e89b9bcb0ed1`.
The parent's additional durable-retention identifiers `f18b9c00` and
`040a2eb9` are disclosed context only; they were not resolved, inspected, or
expanded by this reviewer. No whole author-package rehash was performed.

## Stop and Scope

The affected text/metadata comparison supports limited F1/G1 acceptance as
stated above. It does not approve further exclusions, retries, repairs,
source interpretation, complete-unit assembly, promotion, publication, or
other downstream work.

Original StageA, unique StageB, and the separate allocation clarification are
not rewritten. Physical origin UNKNOWN, source defects and gaps, body/figure
ownership, author-correct periods, bold inclined Z, repeated `a` labels, and
all OPEN/UNKNOWN boundaries remain preserved.

Image budget remains **8/8 batch, 8/24 context**, with zero added images.
Only this separate affected-review file is written. No Git, backend, DB,
production, or other-chat operation is performed. Review stopped.
