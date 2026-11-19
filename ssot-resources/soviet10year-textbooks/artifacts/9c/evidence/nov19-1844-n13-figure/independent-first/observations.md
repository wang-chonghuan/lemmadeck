# StageA Source-First Freeze

Status: SOURCE_FIRST_FREEZE, not formal PASS. Candidate StageB has not started.
This is an independent source-pixel inventory, not an author inventory, FigureSpec,
render review, figure promotion, lesson approval or answer review.

One full view of the original 382x424 PNG was loaded after the pre-view ledger.
Fresh batch: initial 0, now 1/4, no crops, no reopens, no reset after this phase.
The parent remains permanently 24/24 and receives text only.

## Bindings

- Source PNG SHA-256:
  `3e37d5b276033c4a10dff8523e63c5429805b85016f80b19f6807efdff011c5a`
- Current lesson template SHA-256:
  `20ffd453585388eac6a410e7265e8dbefd867488ed60a9450d942f4074285656`
- Current exercises template SHA-256:
  `f3a8b77823acc53fc4b3e5873506a8a0019c66d4b08d7948f9b3b1eda4ee8314`

Absolute paths and byte sizes are in FIRST.json and the manifest input bindings.
Captured text/hash/header commands, exit codes, actual stdout and actual stderr
are in checks.pre-view.json and checks.freeze.json. The text command records all
14 current modern prose entries and the complete exercise-115 text, not just the
figure-adjacent paragraph. No referenced raw source/answer files were followed.

## Independent Source Observations

One shared long-division arrangement, black on white. No separate subfigures,
grid, table lattice, axes, units, word labels or cultural symbols.

The quotient is literally `0.218`, above the horizontal division roof. The
divisor is `55`, left of a curved division hook. The dividend is literally `12`,
right of that hook and under the roof. There is no printed dividend decimal
point, appended zero, repetition parenthesis, quotient overbar or ellipsis.

All numeral rows, in descending order:

```text
                         0 . 2 1 8
       divisor 55        dividend 12
                         1 1 0
                           1 0 0
                             5 5
                             4 5 0
                             4 4 0
                               1 0
```

The sketch is textual orientation only, not scale evidence. Exact review
identifiers and column memberships below are authoritative within this freeze:

| Row | Printed Value | Columns, Left To Right |
| --- | --- | --- |
| r0 | 0.218 | C1, decimal point between C1/C2, C2, C3, C4 |
| r1 divisor | 55 | D0, D1, outside the hook |
| r1 dividend | 12 | C0, C1 |
| r2 | 110 | C0, C1, C2 |
| r3 | 100 | C1, C2, C3 |
| r4 | 55 | C2, C3 |
| r5 | 450 | C2, C3, C4 |
| r6 | 440 | C2, C3, C4 |
| r7 | 10 | C3, C4 |

The C columns are shared across the whole arithmetic frame, not separate local
alignments. C0 through C4 are approximately x=103,152,200,247,295 in the source.
D0/D1 are approximately x=22/46. These locations are visual estimates from the
single view, not instrument-measured equal-spacing or pixel-geometry claims.

Every printed digit and the one decimal point have independent IDs in
FIRST.json. There are 24 digit glyphs, one decimal point, nine number strings,
and eight horizontal levels containing numbers. Counts are only summaries,
never substitutes for per-object and relationship comparisons.

There are eight semantic stroke groups:

1. Horizontal division roof above dividend, below quotient.
2. Curved hook between divisor and dividend, next to roof's left end.
3. First subtraction rule under `110`, before `100`.
4. Second subtraction rule under lower `55`, before `450`.
5. Third subtraction rule under `440`, before final `10`.
6. Long left vertical association stroke, no arrowhead.
7. Upper right-pointing arrow: shaft and two oblique arrowhead strokes.
8. Lower right-pointing arrow: shaft and two oblique arrowhead strokes.

The roof and first subtraction rule start farther left than the latter two
subtraction rules. The latter two extend farther right than the roof and first
rule. The third rule starts approximately under the second rule's start.
No subtraction minus signs, equals signs or multiplication/division glyphs
accompany the rows. Rules and arrows are solid; print roughness is not an
intentional dash convention.

## Arrow Endpoint Freeze

The upper arrow runs from the left-side blank margin to the blank space just
before the leading `1` of `100`, at that row's height. Its head points RIGHT.
It does not point to the quotient, the divisor, a zero or a subtraction rule.

The lower arrow runs from the left-side blank margin to the blank space just
before the leading `1` of bottom `10`, at that row's height. Its head points
RIGHT. It has greater horizontal reach because bottom `10` starts in C3 while
`100` starts in C1.

Both tails are near the long left spine, with small visible gaps. The spine
runs between their levels and starts slightly above the upper shaft. It has no
arrowhead. No source arrow has its tail on bottom `10` and its head on upper
`100`; an upward-directed return loop is not a literal source-pixel fact.

## Context And Source Limits

The full current prose identifies this as the worked example `12` divided by
`55`, says a repeated remainder `10` allows stopping, and gives `12/55=0.2(18)`.
That explanation is text evidence, distinct from printed-image glyphs.

The source image stops at quotient `0.218` and final `10`. The upper row is
`100`, not a second separately printed `10`; no isolated `45` remainder or
explicit `120` row is printed. Added decimal bookkeeping, extra steps, repeat
notation or a changed arrow graph must be declared as modern additions rather
than asserted to be visible source content.

Exercise 115 concerns `7/3`, `23/30`, `-3/7`, `-29/11`. It has no figure
reference and does not replace the worked division example.

A tiny isolated upper-right speck, approximately (369,67), is outside the
arithmetic arrangement. Its origin/intention is UNKNOWN from this one view;
no mathematical role is inferred. Exact ink edges, spacings, gap topology and
stroke thickness are unmeasured. No narrow ROI is necessary to inventory the
legible mathematical content; none was opened.

## Stop Boundary

No candidate, author inventory, candidate spec, SVG, render, key, answer file,
other worker evidence, browser, backend, DB, Git/history, setup or model service
was consulted. Nothing outside this permitted directory was written.

All frozen files are mode 0444. The manifest lists each evidence file's absolute
path, byte count and SHA-256; it excludes its own bytes to avoid a circular hash.
Its separate hash is returned for parent intake.

Other workers' FIRST/FAIL/UNKNOWNs were not read or altered. This freeze does not
clear any failure or uncertainty and does not assert a formal figure PASS.
Stop here for parent intake before candidate StageB disclosure. Image usage
remains 1/4 across any later phase in this same context.
