# STEMROBIN-180/C: 8p65 SOURCE FIRST offline review

## Decision

**SOURCEBLOCKED / HOLD; no SOURCE approval and no permanent rejection.**

The independent original-only inventory was frozen at
2026-11-16T21:49:09.043Z, before the candidate or author inventory excerpt was
read. It recorded 25 printed rows, nine blocks and zero figures. Comparison
identifies **nine missing explicit weight representations against that frozen
inventory**, **three unresolved source-weight occurrences**, and **one
reviewer footer-style evidence discrepancy**. The footer discrepancy is not
counted as a candidate SOURCE defect.

The nine defects concern weight, not omitted italics: ordinary math-mode
italic letters are present, but the heavier/bold italic appearances recorded
independently in the freeze are not represented explicitly. No output
renderer was run, and no rendered-output fidelity is claimed.

FIRST actual mechanical result: 25/25 rows, nine blocks, zero figures,
zero normalizations and zero audit errors, exit 0. Its successful command
proves the recorded mechanical operation, not SOURCE approval.
The frozen candidate body equals the FIRST actual MD body. Current MD, JSON
and audit are byte-identical to their FIRST actual snapshots as observed
once on 2026-11-16T21:51:01.481Z.

## Exact Independent Units

All nine defects occur in the FIRST candidate and unchanged current actual.
The line numbers below are one-based current/actual `page.md` line numbers.
Each affected printed glyph is counted once, even when multiple defects
share one encoded math span.

| ID | Printed row / block | MD line | Affected text and exact occurrence |
| --- | --- | --- | --- |
| D01 | R14 / p0065#6 | 62 | `$v=v_0+at$`: a in displayed at lacks the recorded heavy/bold italic weight |
| D02 | R14 / p0065#6 | 62 | `$v=v_0+at$`: t in displayed at independently lacks that weight |
| D03 | R15 / p0065#6 | 63 | `$v$，$v_0$ 和 $a$`: the scalar a lacks the recorded heavy/bold italic weight |
| D04 | R15 / p0065#6 | 63 | `$\vec{a}$`: the arrowed a lacks that weight; its arrow is retained |
| D05 | R19 / p0065#7 | 69 | `$t=0$`: t lacks the recorded heavy/bold italic weight |
| D06 | R21 / p0065#8 | 73 | `小线段 $ab$（图 39）`: a in the first segment ab lacks that weight; b is not part of this defect |
| D07 | R22 / p0065#8 | 74 | `分别从 $a$ 点`: the first standalone point a lacks that weight |
| D08 | R22 / p0065#8 | 74 | `往下作 $t$ 轴`: the first t-axis occurrence lacks that weight |
| D09 | R22 / p0065#8 | 74 | `垂线. $t$ 轴`: the second t-axis occurrence independently lacks that weight |

## Uncertainties

These three SOURCE uncertainty units were registered before candidate
exposure and remain unresolved. Neither the author excerpt nor agreement
between candidate and actual is allowed to settle them.

| ID | Printed row / block | MD line | Exact affected occurrence |
| --- | --- | --- | --- |
| U01 | R23 / p0065#8 | 75 | `速度从 $a$ 点的速度值`: normal-versus-bold weight of the second standalone a |
| U02 | R23 / p0065#8 | 75 | `改变到 $b$ 点的速度值`: normal-versus-bold weight of the second standalone b |
| U03 | R24 / p0065#8 | 76 | `在线段 $ab$ 的下方`: weight of a in the second segment ab |

Italic shape is readable in all three cases; exact weight is not settled.
This differs from nonblocking Unicode/glyph representation choices.

**E01, reviewer evidence discrepancy:** R25/B09. The frozen inventory
classified footer numerals as upright; candidate `*· 53 ·*` and the
excerpt's `italic: true` disagree. The frozen classification is not
sufficiently reliable to establish a candidate defect. It is retained
unchanged and is not resolved from the author claim. No image was reopened.
The count is one reviewer discrepancy, separate from the three independently
registered SOURCE uncertainties and the nine frozen-inventory weight defects.

There is no independently observed loss of prose, number, mathematical
value, operator, subscript, superscript, italic shape or vector arrow.
No underdot emphasis was observed. The unit-13 heading is represented bold.
The two footer dots are retained; midpoint-versus-bullet encoding is not a
defect. Period encoding, question-mark/parenthesis widths, section-sign
spacing and r-like arrowed-v₀ glyph shape do not prove code points and are
not counted as SOURCE failures.

## Scope and Input

Only the specified page-65 grid original was viewed. Seven owned original-only
crops were created and viewed before the independent freeze. The final
crop is a contact strip of seven rectangles from the original, enlarged 2x
with nearest-neighbor pixels, not an author image.

The clean input matches 4112 bytes and SHA-256
`b429080cb07c257921d6453bea2907210d32f34b972edb97897517b63d1d3b53`.
Its actual root is an OBJECT with `workspace_base` equal to the requested
workspace and a `files` ARRAY of 13 direct `{path, bytes, sha256}` leaves.
The output evidence manifest uses the requested `workspace` key.

Exactly 11 necessary text leaves were read once into owned snapshots:
FIRST candidate MD; FIRST actual MD/JSON/audit; its actual-call record and
full stdout/stderr; current MD/JSON/audit; and the authorized author excerpt.
The original was already viewed and bound before candidate exposure and was
not reread afterward. The unneeded FIRST seal was not opened.

The author excerpt matches 4358 bytes and SHA-256
`baf006fdea0d5dd27fa21d31f8d47d134931d6a9d7c688aed118c32708de7002`.
Only `pageInventory` is a comparison claim. It agrees on rows, blocks,
zero figures, three vector arrows, zero underdots, and figure references
38/39. It supplies no per-glyph bold-body-weight inventory.
Its source binding, group-origin reference, frozen-before-candidate claim
and source-approval flags are inert, not authority to follow or approve.

Main's 124 bindings were not revalidated: zero. No whole-leaf inventory
rehash occurred; only the 11 necessary snapshot bodies and the pre-freeze
selected original were bound. No authority manifest, helper/aggregate,
mixed author inventory, historical report, PDF, author crop, page-66 body
or image, other-page current file or current metadata was opened.
Any neighboring-page mention inside the authorized page-65 notes remains
an unverified claim, not independent page-66 evidence.

## Operations, Failures and Budgets

The authoritative actual argv/cwd/start/end/exit are preserved once in
`snapshots/first-actual-call.json`, with complete actual stdout and stderr
in the two adjacent stream snapshots. Stream pointers inside the call
record were not followed. The operation occurred at
2026-11-16T21:34:50.395Z through 2026-11-16T21:34:51.097Z, exit 0.
It was read, not replayed. Selected FIRST evidence contains no startup failure.

Reviewer crop operations used only
`/Users/yong/work/lemmadeck-ws/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python`
with `-B`. No external runtime file is hashed or included in the manifest.
No prepare, finalize, render, checker, replacement, repair or success replay
was executed by the reviewer.

Page repair budget: total actual repair limit 1, including environment and
mechanical repairs; used 0, unused 1. FIRST actual operation count 1 is not
a repair count. Reviewer author operations 0, reviewer page repairs 0.
No additional allowance is granted and no repair is attempted here.
Startup failure alone would be HOLD, never independent SOURCE rejection.

Image budget: batch 8/8, context 8/24, reopens 0, post-candidate opens 0,
parent image delivery 0. SOURCE-weight uncertainties 3; separate reviewer
footer-style discrepancy 1. No image payload is returned.

Two reviewer command nonzero exits are preserved separately:

- Initial `ls` exited 1 because the two owned destinations did not yet exist;
  the specified original existed. This is not an author or source failure.
- The first clean-input inspection passed byte/SHA validation but exited 1
  on the reviewer's incorrect assumption that the input key was `workspace`
  rather than `workspace_base`. This is a reviewer evidence-script failure,
  not an author startup or repair operation. The original buffer had not
  been persisted, so the same human-bound input was read a second time solely
  to preserve it and inspect its real shape. Both command streams and the
  reconstructed failed script revision are retained. The failed inspection
  was not replayed as a success.

Post-bootstrap command records contain actual argv/cwd/start/end/exit and
full stdout/stderr. Bootstrap command clocks were not captured and are null.
Bootstrap rule stdout is reconstructed from the identical rule-file line
selections and explicitly labeled as reconstructed, not falsely described
as originally captured streams. No nonzero result was deleted or relabeled.
All requested operations have completed; no in-flight command remains.

## Unchanged Rolling Baseline

These are human-supplied offline baseline facts, not newly opened metadata:
approved 7p pages 64; approved 8p pages 13; raw pages/entries/tasks 54/21/85;
8p entries 0, modern 0, numbering UNSET. Main's local critical work
batch39 completion/commit was not queried or changed.

63/64 SOURCE PASS promoted. 61 SOURCEBLOCKED with three uncertainties,
actual repair used 1 / unused 0. 62 permanently SOURCEBLOCKED with three
italic defects, used 0 / unused 1. 66 AUTHORBLOCKED for 17 versus 19 rows,
no actual repair and no independent SOURCE defect established here.
326 has one italic repair pending, no approval. 327 permanently
SOURCEBLOCKED with three defects. The genuine SOURCEBLOCKED HOLD cases
322/323 had their environment HOLD resolved with one actual environment
repair each; no additional repair allowance is inferred.

Cross-gap assembly false; full course false. No promotion, assembly,
modern edition, app, profile, dependency, schema, database, Git, supervision,
other-chat message, live-ticket restart, freshness/Grill or formal handoff
action was performed.

## Evidence and Ownership

The immutable independent inventory is
`.tmp/ld-s10y-lesson/source-review-8p65-first/independent-source-inventory.md`:
10782 bytes, SHA-256
`adbcd9dcf6f9a84b7029790e9024d7ea6f6c63b2d9e717e3c53ba2d5cafac4aa`.
Its source freeze binds the 126881-byte original at SHA-256
`55547121517792ee6eedc19bb9ce3adc80c070d2e760cbf4777692a3e2bdd94a`.

The flat `manifest.json` is an OBJECT with `workspace` and `files` ARRAY;
each file is one current direct `{path, bytes, sha256}` leaf.
It includes all owned scripts/revisions, command records and complete
streams, freeze, inventory, comparison, report, selected original/crops,
authorized excerpt, current and FIRST snapshots, and necessary observed
external leaves. It excludes its own hash, external runtime, unneeded seal,
mixed inventory, authority manifest and recursive aggregate traversal.
Its own path still appears in `changed-paths.txt`.

All changed paths are listed exactly in
`.tmp/ld-s10y-lesson/source-review-8p65-first/changed-paths.txt`.
Every change is confined to that owned directory or this report. No
author-owned artifact or other worker's output was modified.
