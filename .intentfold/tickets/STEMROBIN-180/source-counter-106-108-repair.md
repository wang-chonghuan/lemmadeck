# Source Counter 106-108 Repair

2026-11-15, Session C, STEMROBIN-180. Mechanical counter repair, not source
approval. The subsequently authorized 107 note clarification and unresolved
108 source-unit candidate are reported separately in
`source-unit-107-108-repair.md`.

## Status

| Physical Page | Old Counter / MD | New Counter / MD | Authorized Command Result |
| --- | --- | --- | --- |
| 106 / printed 95 | 24 / 25, first FAIL | 25 / 25 | finalize exit 0; vectorize exit 0, zero figures |
| 108 / printed 97 | 26 / 26, offsetting row errors | 26 / 26 | finalize exit 0, zero figures; source structure still REVISE |
| 107 / printed 96 | 15 / 15 | 15 / 15 | read-only counter replay; later notes-only finalize exit 0 |
| 109 / printed 98 | 25 / 25 | 25 / 25 | read-only replay only |
| 110 / printed 99 | 17 / 17 | 17 / 17 | read-only replay only |

The 108 finalize used its unchanged durable source. It does not approve or
resolve Sagan's separate F108-1 calculation-object rejection.

## Actual Failure and Cause

The actual 106 and 108 source PNGs were opened individually at original
1472 x 2161 resolution. Component/projection traces were obtained before any
production counter edit or reading Sagan's report.

106's final two-glyph emphasis row has two isolated dots. The old detector
required at least three; missing dots in earlier long emphasis rows also
broke its uniform-spacing test. Unremoved dots bridged the short row and the
following paragraph into `[1003,1113]`. The fraction classifier then treated
the combined band as one row. Earlier emphasis bands were also split by
approximate pitch rather than their actual separated body rows.

108's definition fraction and following explanatory prose were merged into
`[1361,1514]`, then split into three bands instead of two. The final example
row and page number were merged into `[1958,2034]`, one band instead of two.
These +1/-1 mistakes canceled in the old 26/26 total. The small mark below
the definition fraction is still source ink; it was not erased from any PNG.

## Scoped Patch

Only `tools/layout.py` production code changed, using `apply_patch`:

- Recognize two-dot or incomplete emphasis sequences only when every dot has
  a printed body stroke directly above it in the preceding full-height row.
  Existing dot size, distance and area-dominance guards remain.
- Record detected fraction-rule vertical positions. Residual prose must be
  beside a fraction rule, not solely below it.
- Protect a confirmed tall single fraction from a following normal-height
  prose row when their union is not a single fraction.
- Do not merge two complete, normal-height, horizontally disjoint bands
  merely because their vertical gap is small; this separates the numeric foot.

No page-specific branch, target count or source text entered the counter.
Global constants, projection thresholds, scan-blemish thresholds, figure
snapping, cropping, and vectorization code remain unchanged. The original
two-tall-row protection and multiline-band expansion are retained.

## Before and After Rows

Coordinates are counting-band limits, not cropping boxes or claims that
irregular source columns have equal-height cells.

| Region | Before | After |
| --- | --- | --- |
| 106 emphasized body rows 9-11 | `[784,845]`, `[846,908]`, `[909,970]` | `[784,824]`, `[856,898]`, `[928,970]` |
| 106 short emphasis / next paragraph | `[1003,1113]` | `[1003,1040]`, `[1072,1113]` |
| 106 foot | `[2010,2040]` | `[2010,2040]` |
| 108 definition / following prose | `[1361,1411]`, `[1412,1463]`, `[1464,1514]` | `[1361,1461]`, `[1475,1514]` |
| 108 middle example bands | `[1778,1829]`, `[1830,1880]`, `[1881,1932]` | unchanged |
| 108 final example / foot | `[1958,2034]` | `[1958,1998]`, `[2008,2034]` |

`row-verification.json` contains every old/new band and separately read visual
row anchors for all 25 rows of 106 and all 26 bands of 108. After repair each
anchor has exactly one band and each band has exactly one anchor, including
the fraction and both feet. The old 108 mapping fails this one-to-one test.
This is a geometric counter check, not full source-object approval.

Nearby replay used unchanged precise figure masks. 107 bands are identical.
109 still has 25 rows; band 23 changes `[1854,1911]` to `[1854,1895]` by
excluding emphasis dots. 110 still has 17 rows; bands 12/13 change
`[1677,1732]`, `[1733,1788]` to `[1677,1717]`, `[1749,1788]`, separating the
emphasized body from the following row. Local source crops confirm these
dot-related endpoint changes. No 109/110 files were finalized or edited.

## Tests and Preserved Failures

Added `tests/test_printed_row_distinction.py`, ten synthetic cases: two dots,
missing dots, shallow/split body strokes, single-dot and unaligned-dot
negative cases, close prose below a fraction, disjoint foot, intact single
fraction, split digit, and a normal row preceding a multiline band.

Final focused run: **30 tests, exit 0**. It includes those ten cases, existing
inline-fraction/spacing/short-numeric tests, and six selected enumerator,
nested-fraction and brace/parallel-system tests. No corpus or whole-suite run.

All initial evidence remains:

- `before-focused-tests.json`: original eight-case run, five failures. One
  negative fixture had a 9px-wide fragment below the unchanged 14px minimum;
  the fixture was corrected to enter the intended path, not the threshold.
- `after-focused-tests.json`: first implementation, remaining fraction failure.
- `after-2-focused-tests.json`: eight cases passed before the final ten-case
  contextual run in `focused-context-tests.json`.
- A provisional broad tall-band guard reduced the real 108 replay to 25;
  it was narrowed to a confirmed preceding single fraction. No source edit
  or finalize used that provisional result.
- Exact old/new nearby-band equality initially failed for 109. Its structured
  re-observation is `nearby-stability-first-fail.json`; endpoint differences
  are explicitly reported above, not labeled identical.

106's original author FAIL and 108's original aggregate cancellation remain
in their original `author-evidence/finalize-1/`, original author report and
the immutable `counter-repair/before/` copies. Old `layout.json` is preserved
in place; new bands are in `after/<page>/repaired-layout.json`.

## Commands and Evidence

Existing interpreter only:
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`.
Every invocation uses `PYTHONDONTWRITEBYTECODE=1`; no environment was created.

Evidence root:
`.tmp/ld-s10y-lesson/6p/pages/0106/counter-repair/`.

```text
inspect_rows.py snapshot                         exit 0
inspect_rows.py before 106                       exit 0
inspect_rows.py before 108                       exit 0
inspect_rows.py tests before                     exit 1, retained
inspect_rows.py tests after                      exit 1, retained
inspect_rows.py tests after-2                    exit 0
verify_repair.py tests                           exit 0, 30 focused tests
verify_repair.py verify                          initial exit 1; diagnostic retained
verify_repair.py verify                          exit 0, reported endpoint differences
verify_repair.py finalize 106                    exit 0, 25/25
verify_repair.py vectorize 106                   exit 0, zero figures
verify_repair.py finalize 107                    exit 0, 15/15, later note authorization
verify_repair.py finalize 108                    exit 0, 26/26, unchanged source structure
verify_repair.py seal                            exit 0, hash invariants
```

The finalize/vectorize wrapper invokes only existing `p2c.py <action>
--book 6p --page N`. Each command directory contains its exact argument
array, exit status, stdout/stderr, pre-command MD and post-command artifacts.
`after/hashes.json` binds all five pages, templates and scratch figure files.
Row overlays are local full-resolution PNGs; no browser was used.

## Hashes and Boundaries

| File | SHA-256 |
| --- | --- |
| old layout.py | `efedf93fcd931bb71eb454ede6316a14a25967a0aa32f65fe3a4b6e8eebfed9d` |
| repaired layout.py | `1db896d4e81f41bf4557fc0a36a4c543a1cfdbc630124ba1fd8b450eaf412c2c` |
| focused test file | `3ab1d761317b1e95823e559563507d40e81dbe08755af136f4c333ffc9adecd0` |
| 106 source PNG | `6861429ac7e9dfcdd02f189dc74ffb885760e8a5b6925a345ed4eb9d66824ea1` |
| 108 source PNG | `c95e2e48c92f52c3895dba2393e1f76d0e106800f6c22447f9147a99cf24752e` |
| 106 page.md, unchanged | `cb07d8b0d0a1b3b126bda95e91db70d9d4ace31ea02e99b3697ad49e6459511c` |
| 106 page.json, unchanged | `b4019e6531321ba7790fef460c6ba59731d434b5c876c45086a85f5bf94d2492` |
| 106 first-fail audit | `5ab7f83c0f8190972c446365a467c46bd2271538821eb33449421426cf6f8391` |
| 106 repaired audit | `7b9b792d6bf16b373eac01ad7b1f0d8512fe85da62d60fad3be41e6a9d6903cf` |
| 108 page.md, unchanged | `5a9f3a6fa19d824521f40a325dfda9e25786cd735a1acc3f9a4b138618b2fc02` |
| 108 page.json, unchanged | `187f01a6de51300db77266bdc0d354acd77bcf14ac8cde8a1dfaadd731b3e130` |
| 108 audit, unchanged | `80467751a244f553fac572e3ec147ad6049abef254c67caf18fa6218944ce3f1` |

106/108 have no figure boxes. All source PNGs and 107/110 precise boxes and
PNG/SVG figure bytes are unchanged. 107's durable change is notes only.
109/110 durable artifacts and all original prepare layouts/templates are
unchanged. No source facts, units, body line breaks or approved figures were
altered by the counter repair.

No assemble, book/lesson/app/dependency/DB/publication/Git actions, browser,
answer-key or choice work occurred. Original author/reviewer reports were
not overwritten. No in-flight exec session remains. Counter work stops here;
independent affected review remains with main/Sagan.
