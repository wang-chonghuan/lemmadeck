# SOURCE167 Blind U1 Recovery

Status: PASS_U1_SOURCE_EXPONENT9, strictly localized to the authorized finding.
Reviewer remains OPEN. Author remains UNRELEASED and unread. Stage 2 has not
started. This is NOT a Stage 1 overall pass, author comparison, or closure.

## Authorization And Fixed Evidence

The direct human instruction reports FULL Stage 1 parent TEXT intake completed
with references `f9c431`, `fc0eb9`, `2f20f2`, `1bf255`, and
`source167-review-stage1-full-intake-nov21` exit 0. These are human-supplied
intake references; no parent/chat/supervisor evidence was opened.

All four original Stage 1 files were verified byte-identical and mode 0444
before this recovery. They remain untouched, including their HOLD, incorrect
R13 first-exponent transcription, conditional math, and accounting discrepancy.
Corrections live only in this addendum, not a rewritten Stage 1 freeze.

Source:
`/Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/ld-s10y-lesson/9c/pages/0167/page.png`

Encoded source: 59046 bytes; SHA-256
`b38bfbb3d75ae23022f2c714b57c1e9bf52993156bf9dbfd7587f818fffa4c22`.

## One Decode, One ROI, One View

The bounds were chosen from the earlier authorized whole-page view, without
author text or a new preview: `[568,1194,848,1258)`, meaning left 568, top 1194,
right 848 exclusive, bottom 1258 exclusive. The resulting native ROI is
280 x 64 pixels. It covers the end of R13, including the last exponent and
minimal same-row comparator symbols. The leading minus before `2x` and the
preceding `7` lie outside this crop; their pixels were not re-examined.

`u1-crop.py`, manually written with apply_patch, ran exactly once through the
existing BASE runner under the exact ROOT cwd:

```text
stage: source167-review-u1-blind-roi-nov21-01
runner: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/run-stage.mjs
command: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.claude/skills/ld-s10y-lesson/.venv/bin/python
argument: /Users/yong/.codex/worktrees/stemrobin-184-six/lemmadeck/.tmp/stemrobin-184-six/source167-review/u1-crop.py
exitCode: 0
```

The instrumented event stream records one encoded-source binding, one
`source_decode_started`, one `source_decode_completed`, one `roi_written`, and
one completion. Pillow opened the encoded source once and explicitly loaded
its pixels once. The already loaded pixels were cropped and PNG-encoded with
no resize, threshold, enhancement, OCR, alternate decoder, or second crop.
Encoded hashing of the ROI did not decode it.

Exactly one subsequent `functions.view_image` call viewed `u1-roi.png`. No full
source reopen, alternate image view, other ROI, or SOURCE168+ activity occurred.
All additional verification read encoded bytes or text only.

## Actual Pixel Read And Distinguishing Evidence

Literal visible ROI fragment: `2x^9+x^4-3x^9.`

The final superscript has a closed upper bowl with a visible white counter and
a descending right-hand stem/tail curling below it: the native glyph is `9`,
not `3`. The same-row coefficient `3` has two open lobes rather than that closed
upper counter. The preceding superscript `4` is angular and distinct. The first
superscript in the ROI has the same closed-bowl and descending-tail form as the
last superscript. These are visual shape observations from the one authorized
ROI payload, not algebraic or answer-derived preferences.

Therefore U1, the last exponent in R13, is independently resolved to `9`.
The old candidate `3` is rejected on actual visible glyph shape.

## Additional Finding Inside The Authorized Comparator

The authorized same-row comparator unexpectedly establishes another error:
the exponent attached to `2x` is also `9`. Stage 1 had recorded that exponent
as `3` without a HOLD. This is finding U2, observed entirely inside this
already authorized ROI; no new area or image was inspected for it.

Recovered R13, combining its unchanged Stage 1 prefix with the newly observed
ROI fragment, is:

```text
б) g(x)=7-2x^9+x^4-3x^9.
```

Only the cropped fragment was newly pixel-verified. The prefix, exercise label,
function name and leading sign are retained from the earlier source-only view,
not newly revalidated by this crop.

Mathematical consequence, calculated AFTER the visual reading:
`g(x)=7+x^4-5x^9`, hence `g'(x)=4x^3-45x^8` for all real x. Independently,
the two ninth-power derivatives are `-18x^8` and `-27x^8`, whose sum is
`-45x^8`. This calculation does not choose either exponent.

The old Stage 1 conditional derivatives assumed the first exponent was `3`;
neither is the derivative of this recovered actual row. They remain immutable
historical evidence, not validated answers for the actual given. U1 recovery
does not imply that the original Stage 1 source or math passed.

## Corrected Actual Accounting

Human-corrected known baseline:
164 = 6; 165 = 6; 166 = 12; 167 author = 5; total before this reviewer = 29.

- Original reviewer whole-page view: +1; Stage 1 total tracked 30; SOURCE167 6.
- This recovery: one source decode + one ROI view = +2 operations.
- Now: SOURCE167 known 8; tracked 164/165/166/167 known aggregate 32.
- This task: 3/8 conservative image operations across both stages.
- Actual image payloads in this context: 2/24, namely the original whole page
  and this single ROI. Conservative operations: 3.
- Hidden/internal operations remain UNKNOWN.
- Parent remains permanently 24/24; parent new views/decodes remain zero.

Stage 1's reported aggregate 31 is retained as an arithmetic/dispatch-provenance
discrepancy. It is NOT evidence of an extra operation. No count was reset and
no native operation or image was replayed to reconcile the discrepancy.

## Failures, Remaining Limits And Stop

Technical crop failure: none; stage exited 0; stderr is empty.
Source failure disclosed: the prior R13 first-exponent transcription and its
affected conditional math are wrong for the recovered row.
Unresolved glyphs inside this ROI: none.

The author's R13 handling, all-row/all-object author comparison, other source
rows, n46 assembly and overall source fidelity remain unevaluated here. No
author material, backend, DB, network, paid/model call, environment/credential
inspection, Git mutation, descendant, supervisor or peer message was used.

`u1-recovery.json` binds every new retained output except its own circular
self-hash, which is supplied as detached final TEXT. It also binds the existing
runner, source and unchanged Stage 1 files. New retained files are individually
sealed 0444; the reviewer directory stays writable.

STOP. Reviewer remains OPEN pending FULL recovery TEXT intake and a separate
explicit fixed-author release. No Stage 2, source reopening, assembly or closure
is authorized by this localized recovery verdict.
