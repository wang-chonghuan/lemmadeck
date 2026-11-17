# STEMROBIN-184 Narrow Counter Diagnosis

Date: 2026-11-17.
Workdir: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.
Status: **HOLD. Partial generic repair retained, not acceptance or release.**

## Result

The exact saved first-finalize mismatches were reproduced without executing
finalize. Independent printed totals are binding transported source-first /
StageB observations, including footers, not expected values inferred from tests.

| Physical page | Saved detector / MD | Reproduced before | Final detector / independent total | Disposition |
| --- | --- | --- | --- | --- |
| 110 | 23 / 22 | 23 | 23 / 22 | HOLD: lower-margin rule survives |
| 114 | 24 / 23 | 24 | 24 / 23 | HOLD: skewed lower-margin rule survives |
| 117 | 27 / 25 | 27 | 26 / 25 | Integral overcount repaired; separator still HOLD |
| 118 | 32 / 18 | 32 | 18 / 18 | Counter matches independent total |
| 121 | 22 / 20 | 22 | 21 / 20 | Labelled integral repaired; blot-sensitive integral still HOLD |

Final focused verification: **18 tests, 17 pass, 1 fail, exit 1**.
The retained failure is the independently constructed bare stacked fraction:
six ordinary rows plus one fraction must total seven, but line_bands returns
eight. It also fails on preserved baseline code; it is not a new regression.
It remains a real failing assertion, not skipped, xfailed or changed to eight.
No claim is made that all five pages or focused tests pass.

## Scope And Exact Code

Only two source files were manually changed:

- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/layout.py`
- `/Users/yong/.codex/worktrees/a07e/lemmadeck/.claude/skills/ld-s10y-lesson/tools/test_layout_carrier_rows.py` (new)

All diagnostic scripts, numerical reports, native crops, command logs and byte
snapshots are confined to:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-counter110-121`.
Python imports can refresh ignored bytecode for the owned tools; no cache
cleanup or unrelated source restoration was performed.

`layout.py` was preserved before its first edit. The final layout diff is
90 added lines, zero removed lines, with no unrelated formatting.

| Bytes | SHA-256 |
| --- | --- |
| layout before | `79b05100ef659e87d7f93b810e40370966c4b111c949f60008269cdeaa03bfa8` |
| layout after | `a461573faba4d03671a6e1ab07f28f39c4de056587265adad2ea7284e3ca495f` |
| new focused tests | `afb1d530e2c62ade3288e62c89a1f66490ab38e0037fa1b7fc35eeaf3be6e846` |

Exact preserved code and diff, under the scratch root above:
`layout.before.py`, `layout.after.py`, `layout.diff`,
`test_layout_carrier_rows.after.py`.
`manifest.json` binds these and the diagnostic records to their paths/hashes.

## Reproduction Method

All five original page PNGs are native 1695 x 2580.
The actual saved audits have no figures and no count_exclusions.
The read-only probe reproduces the finalizer's INK_THRESHOLD mask, full original
content-width measurement and line_bands call. It does not read MD to choose a
counter result. Saved before.md, page.json, audit.json and stdout.txt are hashed
and retained as inputs, never rewritten.

`before.json`, `after-candidate.json` and `after-second.json` record native
band coordinates, component rectangles/areas/row widths, intermediate stages,
line/glyph scale, source dimensions and exact saved-record hashes.
`geometry.py` and `classify.py` expose the numerical causes, not raster resizes.

Source PNG SHA-256 values:

| Page | SHA-256 |
| --- | --- |
| 110 | `6568b4f13de15cfac55dc4bd41534271e85f5cb59ea19c932af79cfecb8b77b7` |
| 114 | `2980fbc008cd2659ebe3d679425d8c06fa03a3ea31de4acf72e69f73362f730f` |
| 117 | `0cb266fa62ecab5b0d5587233b13ee77e817179dea55d252181ef3b97c4b20bb` |
| 118 | `53689746241f8962f56486fcad4c1ce011feb6d0ba9e6c89816371a06c93ec8e` |
| 121 | `82505d0db4d3bb0d2609d69938d3957b2e49563e19fd4810a240a69e49782496` |

Source paths and all twenty first-finalize record paths are absolute in
before.json and manifest.json. Current durable MD/JSON/audits and completed
review files are hashed at seal time only; no entry-time snapshot of those
current files is fabricated. The retained twenty-five input files have explicit
before/after hash comparisons in the manifest.

## Native Diagnosis

110: extra band y2479-2482, x107-544, height4, is a broken horizontal
lower-margin scan rule, not a missing line. It passes the current thin-band
filter because its width is below that filter's wide-rule cutoff.
The actual footer around y2258-2293 remains counted.

114: extra band y2474-2513, x16-1601, height40, combines a sloping
lower-margin rule and isolated marks. Skew makes its aggregate projection too
tall for the existing thin-band cutoff; native components themselves are
shallow. There is no source-text addition to make here.

117: y1395-1487 is one integral-bearing prose row. The former expansion makes
two synthetic pieces at y1395-1441 / y1442-1487 despite common body glyph cores.
The final repair leaves that row intact. Remaining band y1986-1993, x245-727,
is the independently observed footnote separator, not another footnote row.

118: before line_h=29 / glyph_h=23 while repeated actual body components are
around 44-47 pixels. Singleton integral/evaluation limits contaminate the
projection-derived scale, making ordinary roughly 49-pixel rows expand to two.
The repaired scale is line_h=47 / glyph_h=45. Several disconnected evaluation
limit fragments are attributable to their original tall narrow carrier and
one common body row. The shorter integral component x451,y491,w13,h74 needs
the same carrier principle, not a special page rule. Final count is 18.

121: q-plus-integral / equation-(2), y2120-2216, is one common body row;
that overcount is repaired. Integral y742-835 still expands into two because
the original component at x17,y823,w15,h15 is a distant compact blot, not a
locally attached limit. The last native crop confirms the blot. The safe
carrier predicate deliberately rejects such distant off-core glyph-sized
evidence instead of silently deleting it.

## Generic Repair And Guards

One body-supported row principle is implemented at two stages:

- `_body_supported_heights`: prefer spans supported by at least three repeated
  full-body components when estimating row scale; singleton limits do not set it.
- `_single_carrier_row`: a narrow carrier 1.5-3.2 body heights tall may extend
  one row only when at least three body components share a central-half
  intersection. Small off-core limits must be close to the carrier; full-size
  extra glyphs, distant small groups and excessive limit groups reject it.

The predicate uses original connected-component bounds for attribution; it
does not erase the carrier, alter extraction pixels, crop text, read a page
number, read MD or choose an expected total. It is used to join carrier limit
fragments and to avoid height-only expansion of a proved single body row.
Existing noise/exclusion filters and source wrapping are unchanged.

Independent fixtures cover integral hooks, plain evaluation stems, shorter
integrals, side-by-side integrals, distant same-row equation numbers,
limit-heavy pages, doubled-scale geometry and inline fractions.
Negative guards preserve two independent full rows, an ordinary preceding row,
two ordinary rows, repeated small independent text, distant small printed rows,
standalone quotient glyphs and a standalone short horizontal stroke.
Public-count fixture checks also assert that the input ink array is unchanged.

The bare-fraction count guard remains failing. Its recognizer check passes,
which proves that recognizer agreement cannot substitute for the count result.

## Why The Remaining Cases Stay HOLD

A free rule-only band can geometrically represent a separator, standalone
printed dash or scan rule. Deleting all such bands, trimming a bottom region,
or overriding a total would need semantic/source exclusion policy outside this
authorization and risks dropping real text. No such filter was added.

Likewise, accepting every carrier band despite a distant small component would
hide the independently expected small printed-row negative fixture. No
margin-coordinate exception or singleton bypass was added for 121.

The preserved baseline also fails the bare fraction merge despite a valid
single-fraction recognizer result. Solving that separate join mechanism would
expand this bounded carrier repair. It is recorded, not concealed or repaired.
Further changes, source re-finalization and release are left to the parent.

## All Command Failures And Verification History

All logged command directories below are relative to the scratch root.
Each contains command.json with cwd/argv/exit/timestamps plus stdout.txt and
stderr.txt. Numerical probe success means execution success, not all totals pass.

| Command record | Exit | Observed result |
| --- | --- | --- |
| initial direct diagnose --label before --preserve | 0 | All five exact saved mismatches reproduced |
| commands/focused-first | 1 | 14 new fixtures, 7 failures |
| commands/five-after-candidate | 0 | 23,24,26,19,21; not all independent totals |
| commands/classify-remaining | 0 | Shorter integral rejected; distant 121 component rejected |
| commands/focused-second | 0 | 16 fixtures pass, intermediate test set |
| commands/five-after-second | 0 | Final unchanged code counts 23,24,26,18,21 |
| commands/focused-final | 0 | 17 fixtures pass, before restoring bare-fraction count guard |
| commands/focused-preserved-baseline | 1 | 15 applicable new fixtures, 6 failures on preserved baseline |
| commands/focused-final-with-retained-failure | 1 | FINAL: 18 fixtures, 17 pass, bare fraction fails 8 != 7 |
| commands/focused-baseline-with-retained-failure | 1 | FINAL baseline: 16 applicable fixtures, 7 failures |
| commands/crop-eighth | 0 | Eighth and final native diagnostic crop produced |
| commands/final-diff-check | 0 | git diff --check passed for the two owned source paths |

One earlier read command also failed with exit2:
`rg -n 'lines_printed|line_bands|count_exclusions|mask_figures|content_w'`
against p2c.py, layout.py and the guessed tools/extract.py. That guessed file
does not exist. Relevant finalizer code was subsequently read in p2c.py.
No missing module was created and no dependency installed.

In focused-first, the drawn synthetic hook exceeded the proposed thin-carrier
width bound; it was corrected to native-consistent narrow geometry without
changing its independent row expectation. The bare-fraction count check was
temporarily represented by a recognizer-only check, then explicitly restored
as a separate failing public-count assertion. Intermediate green results are
not final acceptance and are not used to hide this failure.

Entry/engineering/product/operations/lesson-cap1/image-batch rules were read.
Live Plane verify, ticket collection read and comment-page read returned
HTTP200. That comment page contained old entries, not a newly verified latest
authorization; the user's explicit continuing authorization governs this turn.
No ticket status/comment, plan, Charter or workflow record was modified.
This was a continuation, not a new capability setup.

## Images And Boundaries

Exactly eight NEW native rectangular crops were individually opened once with
detail=original. No full original, old crop, grid, montage or resized image was
opened. crop-ledger.json records events1-7; crop-08.json records event8.
Both ledgers contain absolute source/crop paths, XYWH, dimensions and SHA-256.
The parent receives this text and paths/hashes only, no image payload.

No finalize, prepare, assembly, adaptation, publication, broad unit suite,
previously passed source gate, app build, dependency install, DB write,
commit/push, merge/deploy, other-chat message or new workflow was executed.
Source MD, audits, figures and immutable reviews were not edited.
Parent's 111 dash, 119 erratum and 126 work remain outside scope.

WAIT after returning the textual result. The ticket is not marked complete.
