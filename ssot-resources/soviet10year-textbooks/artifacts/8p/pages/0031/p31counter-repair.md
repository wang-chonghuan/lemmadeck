# p0031 Bounded Counter Diagnosis and Recovery

2026-11-23; STEMROBIN-180 / 180-7. Every command used explicit workdir
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
This is affected-counter recovery only, not independent substantive source,
mathematics, erratum, or modern-figure approval.

## Independently Observed Rows and Cause

Opened only the original p31 page and one original-pixel offending crop.
The source has 12 body rows, two caption rows and one footer row: total 15.
The first two actual body rows end with "方向" and consist of "相反." respectively.
No candidate omission was found for this counter discrepancy.

HEAD `29a7f8c88b23b1599843c1b81f709f5d3c4e04a9` and current-before-repair both
count 14, with exactly the same bands and counting-mask removals. HEAD's layout
blob is `d37fac432a2933679cbfd1ab56fbbe6155af548b`, SHA256
`33c4211baf7c18f14503678d02a8ddd7ea4c28910e608bd0f54109b277abcc5e`.
Current-before-repair SHA256 is
`069bcbc63553fdd554925b0f13ea7cb3aa9ca6fa42523cf835817cb330d5fe26`.
The only HEAD/current difference is the existing p29 solid-core morphology.
It is not a new p29 regression, an erratum-induced text change, a caption-mask
defect, or a figure-box defect.

Existing counter logic merges the first two body rows into `718-849`.
At this boundary the body-only first projection is `718-778`; retained margin
ink extends it to `718-791`, reducing the apparent gap to the next projection
`808-849` to 17 pixels (merge gap 17.6; glyph height 44).
The fraction predicate mistakes horizontal strokes in body glyphs for fraction
rules, including columns `324-364`. Its half-glyph rule-column clearance then
destroys the two full-sized, adjacent continuation glyphs at
`[275,806,41,42]` and `[323,807,43,44]`.
The original pre-mask body-row guard requires at least three glyphs per row;
it sees 14 on the first row, only two on the second. The later outside-column
and pooled-ink guards cannot recover those masked glyphs and falsely classify
the entire two-row band as one fraction.

## Guarded Change

Only `tools/layout.py` and new
`tools/test_line_bands_short_continuation.py` were authored as production code.
The fraction predicate retains its existing three-glyph body-row rule. Before
rule-column masking, an exactly two-glyph row can veto fraction recognition
only when both glyphs satisfy the existing full-sized CJK shape bounds, are
adjacent, are at least 1.5 glyph heights from a proven body row, and each
aligns horizontally with that row's body glyphs.
A centered two-glyph fraction denominator remains recognized as a fraction.
No global threshold, expected count, page identity, page mask, caption hack,
profile change, candidate prose, or figure geometry was introduced.
The p29 morphology and p158 integer-cutoff guard remain unchanged.

## Verification and Retained Failures

`.tmp/180-7-n5-counter31/` holds the reproducible scripts, HEAD/before code,
HEAD/current diff, source and boundary traces, two verification matrices,
test transcripts and hashes. HEAD was read from stored objects with SHA1
validation, without invoking Git or altering Git state.

After implementation, existing p29/p158 tests plus four focused continuation
tests pass 15/15. Actual repaired counts: p31 15, p29 13, p158 27.
Deleting each of 12 independently observed p31 body rows gives 14;
deleting each of the ten previously documented p29 body rows gives 12.
These are counting-mask-only whole-projection deletions; source pixels are
unchanged and no other page was visually loaded.
p158's first five bands and both documented true-two-body-row controls match.
Historical comparison failures remain failures, not repaired-code passes.

First verification exited 1: all 22 actual-page deletion controls and all
11 existing tests passed, but a new synthetic first-row deletion removed only
body glyphs, leaving a separate margin blemish outside that deletion. That
test did not implement the claimed whole-projection deletion. Its deletion
now covers the full first projection including the blemish, without changing
the expected result. The failed implementation, original test, test transcript
and matrix are retained durably as
`layout-first-repair-control-failure.snapshot.py`,
`test-first-repair-control-failure.snapshot.py`,
`tests-first-repair-control-failure.snapshot.txt` and
`verification-first-repair-control-failure.snapshot.json`.
The second verification exited 0; production guard bytes did not change.

An initial file search exited 2 because the diagnostic directory did not yet
exist. The first HEAD probe exited 1 because the object is packed, not loose;
its receipt is `first-diagnostic-command-failure.txt`. Read-only pack/index
decoding resolved it without installation or Git commands.

## Finalize Status

Ran `p2c.py finalize --book 8p --page 31` exactly once after repair, exit 0:
12 blocks, printed 15 / Markdown 15, two figures, zero errors and zero
normalizations. The registered erratum remains present.
No other finalize was performed.
Source Markdown, JSON, PNG, both precise figure boxes and both PNG/SVG crop
sets are byte-identical to the pre-repair inputs. Protected p29/p158 durable
files and existing fraction/margin tests are unchanged.
AST comparison confirms `_single_fraction_row` is the only changed production
function; `line_bands`, including both prior margin guards, is unchanged.
Do not infer source-review approval from counter recovery.

SHA256 receipts:

| Artifact | SHA256 |
| --- | --- |
| Repaired `tools/layout.py` | `38ed6436c192d3277b34308a98d893951c15c49b73f86c15d5ea29d539c0c742` |
| New focused test | `3e30026839a9982c3e185dcc996064ca23393924f285f846413b00ebb5defb07` |
| Final `audit.json` | `1d6925462b6cc2eafb9407bc47c2dcf6af53f7a55d850e5152ff5fface3dbbfe` |
| Unchanged `page.md` | `5407d9433b36f6b4564864756f05c323bb63a26b59de37245cf01804b413c0ff` |
| Unchanged `page.json` | `3a557cfa5dbc9c627c0493626dec9f0c64545f8fecff2a12ba82ccc9b1880e83` |
| Unchanged first failed audit snapshot | `3e9698f10d55fea41d4552a518ee045ed620f13d0930e592cb6c56de5d21651b` |
| Unchanged first failed page snapshot | `5407d9433b36f6b4564864756f05c323bb63a26b59de37245cf01804b413c0ff` |
| Unchanged pre-erratum Markdown snapshot | `4ba2285adaf9419e0c44223d306a4ac7883ff3f95cd9ee3a89c24aa777d170f1` |
| Unchanged pre-erratum JSON snapshot | `6bd18a159e57792efe2786ce53cc8f569d14d8ace4086ba199a6bf355737824e` |
| Unchanged fig-21 PNG | `a4605a9d47afdab96eee5c6a2330da42f9ea7f6b818b0bd7105e5e95ac3b7842` |
| Unchanged fig-22 PNG | `1761ff0407f2b5b08d8395bdbe7198d145a4f9d2433495de0a40d861bcf83b33` |

Finalize stdout/stderr and the full before/after hash manifest are recorded
in `.tmp/180-7-n5-counter31/finalize.stdout`, `finalize.stderr` and
`post-finalize-check.json`. An exclusive attempt receipt prevents a second
finalize by the diagnostic runner. All eight post-finalize checks passed.

## Source and Image Budget

Original p31 SHA256:
`113a8c265f65849b8a1a8e8cb8b3f9ddcc72ec0e0df7e948520c8e4500f10646`.
Offending original-pixel crop `[0,700,1580,170]` SHA256:
`e7be3287820a354c4898eb7a318b319e16b4f6ca1b2c1f0e0296562b6f84d60f`.
Image loads: exactly two, full source plus offending crop; no reopens or
other pixels. Numerical image reads are not visual loads.

No database, Git command or mutation, install, paid call, other-page finalize,
assembly, modern-figure work, new agent, or source review was performed.
Unrelated and installer edits were not reverted or overwritten.
