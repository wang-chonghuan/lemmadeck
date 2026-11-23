# PRIVATE p54 counter candidate: REJECTED FOR INTEGRATION

All commands used cwd `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
Writes were confined to `.tmp/180-7-p54-counter/`.
This is an independent technical image/counter check, not source semantic PASS.
No live edits, source/audit/page/crop promotion, lesson/index/Git/DB/app/schema
operation, install, timer, chat/message, finalize, paid call or full-book test.
Source54 remains locally held; source53/n11 were not operated on.

## Bound evidence and exact delta

- Entry/current-at-snapshot layout SHA-256:
  `17d1ebc192fdd97d8ee4a86d4dc8b7b41afef7afd2c97ce15106d00beb1b19e5`.
- Private candidate SHA-256:
  `5731af344813d13cf0a958aa08ea502b5741febd33658e7c57c511c449d15521`.
- Live layout advanced concurrently; last observed SHA-256:
  `9872032f001b8066dc6ce223bd8381fc0d2b50953950a26c5a9aaeae3c44b9f6`.
  The live writer was not stopped or messaged. Tests below pin the ENTRY
  snapshot, not the subsequently changed live file.
- Exact `candidate.diff`: one 58-line insertion in `line_bands`, after its
  glyph-height estimate. No existing code, constants, fraction helper,
  margin classifier, figure geometry or fragment repair was changed.
  Diff SHA-256:
  `ad49ec905e55d0da9f71649f99a02098a6297730e578112aaded827ec8cca8d4`.
- Final test SHA-256:
  `a19c8277f867ffe1784c2059d5fd1be899ad3819f850691c965d40e682fbd7ae`.

Read current lesson cap1, production-resume SOP, image-batch rules, durable
0054 source-author-report, first-finalize execution/streams and first-failure
page/audit. The actual first failure remains 22 counted / 21 authored, exit 1.
All bound 0054 durable bytes and original pixels were unchanged by these runs.
Original PNG SHA-256:
`094fc0f6b63da572c908110155b9fc56e638995d6febaf612ad8280dc09d9e02`.

## Independent technical observation

The source has 21 real rows, including TWO explanatory footnote text rows and
the footer. The standalone body formula has a fraction; the footnote's second
row has two fractions. Numerators/denominators are not extra text rows.
The only extra standalone rule is y2095..2101, x178..662, one connected
component, 485 x 7 px, 1802 ink pixels. Nearby body type is about 44 px high;
footnote type is about 31..32 px high. The rule is left-aligned with body ink,
with full-projection blank space above/below. It is not a figure or prose.

The private rule requires long thin single-component ink PLUS full-row
isolation, at least five neighboring glyphs on each side, a smaller-type
transition, nearby same-type body alignment and broad following text.
No page coordinates, expected counts or global trims occur in the candidate.
Shape alone does not approve removal. The operation changes only the internal
counting mask and clears the corresponding recovery component.

On the original, candidate output is 21 one-to-one real-row anchors.
The returned counting mask equals the mask obtained with exactly that
separator's 1802 pixels absent. All original body/footnote formula pixels,
including full denominator tails, remain in the internal counting mask.
This does NOT prove every isolated mathematical glyph is counted correctly.

## Tests and valid outstanding gaps

| Pinned snapshot | p54 | Focused methods/failures/errors | Prior focused | Shared methods/failures/skips |
| --- | --- | --- | --- | --- |
| baseline | 22 | 11 / 41 / 0 | 13 / 0 | 47 / 4 / 2 |
| candidate | 21 | 11 / 6 / 0 | 13 / 0 | 47 / 4 / 2 |

Failures count unittest subtest assertions. Both runners exit 1.
The four shared failures are unchanged margin `1`/`7` subtests at left
21/1549. The two skips require unavailable original107.
All 21 authored omission controls pass on the candidate. Nineteen of 21
actual-row deletion controls pass. Complete real formula, numerator, body
glyph and `(-b)` samples survive as added rows at three horizontal placements.
Real minus/bar strokes in text, both scientific footnote rows, same-shape
non-footnote typography and a long fraction-rule veto pass.

Six valid candidate failures remain:

1. Complete REAL denominator `t`, source bbox x855..868 / y1857..1886,
   30 x 14 px / 226 ink pixels, is not counted as an independent added row at
   left 24, 600 or 1400. The full sample is `[1855:1889, 849:877]`.
   With the separator absent, BOTH entry baseline and candidate still count
   21 rather than 22 after adding it at y2420. This is an existing narrow-glyph
   projection/recovery gap, not new separator masking. It is still a valid
   failed positive and prevents approval.
2. Delete actual heading y557..605: residual margin ink y606..619 becomes a
   row; candidate counts 21, expected 20.
3. Delete actual prose y1930..1975: residual margin ink y1902..1922 becomes
   a row; candidate counts 21, expected 20. BOTH deletion failures also occur
   on the entry baseline after exactly the separator is absent.
4. Mirroring the source counts 22: this draft derives a left body rail only.
   It is not a general symmetric separator implementation.

The initial denominator fixture clipped its lower tail. That fixture and its
original results are preserved under `first-controls/`; the final fixture
contains the full glyph, unchanged expected counts, and still fails.
No positive was weakened or changed to a skip. Actual margin-removal controls
use four bounded observed-mark boxes, not a strip/global trim.

These constraints cannot be declared satisfied by a separator-only delta.
DO NOT APPLY this matching-count candidate. Do not copy the private layout
over the concurrently updated live layout. No integration delta is approved.

## Reproduce and image usage

Use the existing Python environment and private runner from the stated cwd:

```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/180-7-p54-counter/run_checks.py baseline
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/180-7-p54-counter/run_checks.py candidate
```

Final fixture-only runs used `--focused-only`, reusing the hash-identical
13-method prior and 47-method shared evidence. Original full-run facts remain
in `first-controls/*/results.json`; shared/prior logs remain in each snapshot.
The runner reuses the pre-existing bounded counter runner; no new proof
pipeline or asset package was introduced.

Exactly THREE images loaded into context: one original p54 baseline, once;
one p54 footnote target; one narrow p31 `(-b)` target for a real minus control.
No baseline reopen, other source baseline, figure or screenshot was loaded.
Private targets are `footnote-target.png` and `real-minus-target.png`.
Image batch 3/8, baseline 1/1, targets 2/2, paid calls 0.
Numerical pixel/test reads are not additional image payloads.
