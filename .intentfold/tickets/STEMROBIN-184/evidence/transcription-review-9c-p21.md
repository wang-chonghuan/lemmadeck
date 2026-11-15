# 9c Physical Page21 Independent Transcription Review

Ticket: STEMROBIN-184. Physical21 / printed14; actual clean PNG1695x2381.
The full original PNG was inspected first, individually, before reading
this page's durable MD/JSON, audit or prepared line bands. Direct source
crops were then inspected only to diagnose the extra noise bands.
No already-reviewed page image, author answer, choice, modern artifact or
other review was consulted. No source/tool edit, finalize, assemble, browser,
DB access or test was run.

**Transcription content PASS. Initial counting audit FAIL13/8, entirely
explained by five additional non-text noise bands.** The source really has
seven body/formula rows plus one folio. No missing words, figures or formulas
were found, and no extra rows should be authored to satisfy13.

## Printed Conditions, Numbers And Boundaries

- First printed row is Cyrillic `б)` (U+0431), continuing ex28:
  `9^{n+1}-8n-9` is a multiple of16. The observed exponent is `n+1`,
  and both subtractions are present. `ex 28 cont` closes this exercise;
  there is no new number28 or additional subpart on this page.
- Ex29 is exactly three printed rows: the prose requests mathematical
  induction for any natural number n; a separate formula row reads
  `2^{n+2}>2n+5`; the final row reads `成立.`. The strict greater-than
  sign, exponent `n+2`, and constant5 match. No invented restriction
  on natural numbers was added.
- Ex30 is one printed row: `当自然数 n≥10 时` and `2^n>n^3`.
  The source comparison includes equality in the condition, represented
  by the durable `\geqslant`; the formula comparison is strictly `>`.
  The threshold is10, not1 or another number.
- Ex31 is two printed rows. The first ends at `这 n 个数的平`; the
  second begins `方与这些数的所有两两乘积的两倍的和.`.
  The printed condition is `n≥2`. The actual wording says the square
  of the sum equals the sum of the numbers' squares and twice all
  pairwise products. This is a transcription of the printed statement,
  not an independently supplied proof or replacement formula.
- Ex29--31 are complete objects. There is no page-end open prose,
  section heading, source figure, caption or unnumbered diagram here.
  The source ends the exercise material after31; it does not continue
  ex31 into the next chapter.
- The sole folio row is `· 14 ·`, with visible dots on both sides.

## Independent Actual Rows

| Object | Actual printed rows |
| --- | --- |
| ex28б) continuation | 1 |
| ex29 stem + formula + 成立. | 3 |
| ex30 | 1 |
| ex31 | 2 |
| folio | 1 |
| Total | 8 |

The raw line bands corresponding to these rows are
`[178,222]`, `[251,303]`, `[334,372]`, `[425,456]`, `[491,535]`,
`[569,615]`, `[647,695]`, and folio `[2153,2186]`.
The final body row ends at y695; the large blank area below is not
missing transcription. No `↵`, `samerow` or figure ownership is needed.

## Five Non-Text Bands And Exact Candidate Exclusions

The current audit has `lines_printed=13`, `lines_md=8`, one line-mismatch
error, and no other warnings, figures, errata or count exclusions.
Prepared layout contains these five additional bands:

| Extra band | Source evidence | Candidate box |
| --- | --- | --- |
| `[806,864]` | Irregular right-margin ink blob with a short upward spur | right-noise |
| `[1639,1653]` | Small isolated right-margin ink blob | right-noise |
| `[1809,1833]` | Isolated irregular right-margin ink blob | right-noise |
| `[2316,2323]` | Small bottom-margin scan speck | bottom-noise |
| `[2346,2380]` | Irregular thick scan/page-edge black strip | bottom-noise |

The following are source-based proposals for parent only, in `[x,y,w,h]`
coordinates. They have not been added to the source metadata or tested by
rerunning finalization:

```json
[
  {
    "kind": "scan-artifact",
    "box": [1510, 760, 140, 1120],
    "reason": "Right-margin scan ink only: the three extra bands y806..864, y1639..1653 and y1809..1833 are irregular unlabelled blobs in this exact direct crop. The crop begins below the last body row y695 and ends at y1880, above the folio y2153..2186. It contains no body, formula, exercise-label, caption or folio pixels."
  },
  {
    "kind": "scan-artifact",
    "box": [0, 2290, 1695, 91],
    "reason": "Bottom scan speck and irregular page-edge strip only: the extra bands y2316..2323 and y2346..2380 fall within this exact full-width direct crop. All actual text, including the folio, ends at y2186; the crop starts at y2290 after a blank gap. It contains no body, formula, exercise-label, caption or folio pixels."
  }
]
```

Both proposed crops were actually viewed at their original resolution and
contain only scan ink on blank margins. The upper right blob at the height
of ex31 is already within an actual body-row band, so it is not needed in
these minimal counting proposals. These are not source diagrams or genuine
printed separators. The source PNG must remain untouched; only a recorded
counting-copy exclusion is justified. Whether parent finalization returns8/8
after these exclusions remains a pipeline observation, not a claimed result
of this independent review.

## Actual SHA-256

- `.tmp/ld-s10y-lesson/9c/pages/0021/page.png`:
  `806ffcac6a2c487939c8ed63e9884b6435a093f07b878195e9c71ce036476a8a`
- The same scratch page's `layout.json`:
  `3536a6131bd0f794757f4c336759271dbf332bbce71ff4071472be5f19f45eb6`
- Durable `ssot-resources/soviet10year-textbooks/artifacts/9c/pages/0021/page.md`:
  `8af6f432e8f62199a1544ad881b1fc91921a57f0c4152ee32741785b7b773a08`
- The same durable page's `page.json`:
  `0eab39ca89c7a2144704f25b34a9d6ffdcf3a0a916d06b34aefd4cc134fbe7a6`
- The same durable page's failed `audit.json`:
  `dfa54dd576650f8a2b910fbc33f5d7f4d58dc2e3e357ad5d5e6cc313233395d5`

Unmodified-pixel crops retained under ticket
`tmp/transcription-review-9c-p21-crops/`:

- `right-noise.png`, `[1510,760,140,1120]`:
  `018063de4ec7a82f4987f5b4b69bdcb66bddf933ab827757da4016eccf7ae8f5`
- `bottom-noise.png`, `[0,2290,1695,91]`:
  `3a9027d5255a0ffbe25424d923c6630098889f4c08e7123c36c2a9cc7059a720`

Only this report and direct-source evidence crops were written.

## Changed-Boundary Follow-Up: Current PASS8/8

This follow-up inspected only current page metadata/JSON/audit and the
existing `right-noise.png` pixels at the narrowed boundary. No original
p21 scan was reopened, no evidence crop was regenerated, and no finalize,
assemble, pipeline edit or source edit was performed here.

**Current boundary/content/audit conclusion: PASS.** Current audit has
`lines_printed=8`, `lines_md=8`, the two exclusions below, and empty errors,
normalizations, unknown characters and KaTeX warnings. The original
FAIL13/8 and its hash above remain the historical source-count evidence.

### Failure And Narrowing Path

1. The independently reviewed initial source had eight real printed rows
   and a FAIL13/8 audit, with the five non-text bands identified above.
2. Parent reports that the first exclusion attempt using the proposed
   `[1510,760,140,1120]` right box was rejected because its x origin1510
   was less than the tool's right-margin boundary
   `0.90 * 1695 = 1525.5`. This was a box-legality failure, not evidence
   of missing source text. That candidate was not a finalized PASS.
   No rejected-attempt file or tool code was read in this follow-up;
   this intermediate rejection is attributed to the parent's report.
3. Current metadata narrows only the box's left edge to1526, leaving
   its right edge1650 and vertical extent y760..1880 unchanged:
   `[1526,760,124,1120]`. The bottom box remains
   `[0,2290,1695,91]`. The new x origin is beyond1525.5.
4. Current durable audit independently confirms the parent-run finalization
   result8/8, with no errors. No tool or expected-line override was used
   by this reviewer.

### Existing-Crop Pixel Evidence

The original right crop remains140x1120 at source origin `[1510,760]`,
with the unchanged hash recorded above. Reading that already-reviewed
crop with Pillow, without saving another image, shows:

- The removed left strip is local x0..15, corresponding to source
  x1510..1525. It contains exactly one non-white pixel: local `(9,737)`,
  source `(1519,1497)`, grayscale0. Every other pixel in that strip is
  white255. This is the isolated scan speck, not a glyph or body mark.
- The retained local x16..139 corresponds exactly to the new124px-wide
  box. It contains2783 black pixels; their bounding rectangle within
  the narrowed crop is `[20,37,100,1075]` in Pillow's
  `[left,top,right,bottom)` coordinates.
- Thus all remaining ink in the old right crop is inside the new box.
  The new box is a subset of the previously inspected no-body-pixels
  crop, so narrowing cannot introduce body/formula/folio pixels.
- The bottom box and its existing evidence crop are unchanged.

### Exact Unchanged-Content Verification

Remove only `count_exclusions` from current MD front matter, serialize
with its existing formatting, and leave its body bytes intact: the
in-memory result hashes to
`8af6f432e8f62199a1544ad881b1fc91921a57f0c4152ee32741785b7b773a08`,
exactly the initial reviewed MD hash. Likewise, removing only
`meta.count_exclusions` from current JSON reconstructs
`0eab39ca89c7a2144704f25b34a9d6ffdcf3a0a916d06b34aefd4cc134fbe7a6`,
exactly its initial reviewed hash. No reconstructed file was written.
All body/formula bytes, block boundaries and other metadata are therefore
unchanged. Source PNG and prepared layout hashes are also unchanged.

### Metadata Wording Caveat

The current right-box reason says it excludes four extra noise bands,
and the bottom-box reason says one. Those per-box quantities do not
match the already-reviewed raw layout: three extra bands are in the
right box, and two are in the bottom box, as the table above records.
Current audit reports the correct total8/8, not a per-box attribution.
The reasons should omit those numeric claims or say right-three /
bottom-two. This is a metadata wording correction only; it does not
invalidate either no-body-pixels box or the actual passing count.
No reason string was changed here.

### Current Actual SHA-256

- Source PNG, unchanged:
  `806ffcac6a2c487939c8ed63e9884b6435a093f07b878195e9c71ce036476a8a`
- Scratch `layout.json`, unchanged:
  `3536a6131bd0f794757f4c336759271dbf332bbce71ff4071472be5f19f45eb6`
- Durable `page.md`:
  `47df4fa9b0f074a236d511575eb1ddea2f23c8aeded8faebfaee68dc02b0b3cb`
- Durable `page.json`:
  `ad153663f936002b326c480a0e3ece1eaec3fa002329848d678a17064a7505f4`
- Durable passing `audit.json`:
  `fee0982547fe890af8d1336739c5a13251d89ba215c4eb79d340711665cbb9eb`
- Existing `right-noise.png`, unchanged:
  `018063de4ec7a82f4987f5b4b69bdcb66bddf933ab827757da4016eccf7ae8f5`
- Existing `bottom-noise.png`, unchanged:
  `3a9027d5255a0ffbe25424d923c6630098889f4c08e7123c36c2a9cc7059a720`

Only this report was updated. No already-reviewed page was reinspected
and no assembly/book trace was read or changed.

## Metadata Wording Repair: Completed

Following parent-agent delegation under existing human ticket authority, this reviewer made the two narrow
metadata wording corrections and ran the existing single-page finalize.
The preceding review, initial failure evidence, boundary-rejection history
and changed-boundary assessment remain preserved verbatim.

Only `page.md`'s two `count_exclusions[].reason` strings were manually
edited with `apply_patch`:

- Right reason: `排除四个额外噪迹行带` became `排除额外噪迹行带`.
- Bottom reason: `排除一个额外噪迹行带` became `排除额外噪迹行带`.

Both complete safe-exclusion reasons otherwise remain unchanged. The
boxes remain exactly `[1526,760,124,1120]` and `[0,2290,1695,91]`.
No source words, formulas, boundaries, notes, other metadata or tools
were manually changed. The existing body and no-body-pixels evidence
was reused without reopening any scan or crop.

Existing-flow command actually executed:

```text
.claude/skills/ld-s10y-lesson/.venv/bin/python .claude/skills/ld-s10y-lesson/tools/p2c.py finalize --book 9c --page 21
```

The command exited0 and reported five blocks, eight MD rows / eight
printed rows, zero figures, zero normalizations, and PASS for row count,
character whitelist and formulas. Current audit is8/8 with empty errors,
normalizations, unknown characters and KaTeX warnings. Finalize propagated
only the reason-text changes into `page.json` and `audit.json`.

### Exact Change Verification And Hashes

For each of current MD, JSON and audit, replacing only the two new reason
strings with their original strings in memory exactly reconstructs its
pre-edit SHA-256. Each new reason occurs once per file. This verifies
that no other bytes changed, including body/formulas, both boxes,
all other metadata, and audit counts/warnings. No reconstructed file
was written.

| File | Before this wording repair | Current after finalize |
| --- | --- | --- |
| `page.md` | `47df4fa9b0f074a236d511575eb1ddea2f23c8aeded8faebfaee68dc02b0b3cb` | `b7a17e5c7d6f1ddc2f49cdc82f13d783c79dc3b0c91a0e6f241411b3c770eae0` |
| `page.json` | `ad153663f936002b326c480a0e3ece1eaec3fa002329848d678a17064a7505f4` | `4686d754f549b7002294ece412f0596985f1d4840e2bdc3b7439ad5f6dd503d7` |
| `audit.json` | `fee0982547fe890af8d1336739c5a13251d89ba215c4eb79d340711665cbb9eb` | `92248d3ece0f7ea45b8bc4785b310089e4d90ef0c28fcc9cbd907e88ab950553` |

Rechecked unchanged evidence hashes:

- Source PNG:
  `806ffcac6a2c487939c8ed63e9884b6435a093f07b878195e9c71ce036476a8a`
- Prepared `layout.json`:
  `3536a6131bd0f794757f4c336759271dbf332bbce71ff4071472be5f19f45eb6`
- Existing `right-noise.png`:
  `018063de4ec7a82f4987f5b4b69bdcb66bddf933ab827757da4016eccf7ae8f5`
- Existing `bottom-noise.png`:
  `3a9027d5255a0ffbe25424d923c6630098889f4c08e7123c36c2a9cc7059a720`

The pre-append report SHA-256 was
`f89e3a3b83f7c53d82229066cba831c5abc1c7dca9174c31db001ebf8cd04160`.
Only this completion record was appended to it; the prior review remains
unchanged. The metadata wording caveat is now resolved. No assemble,
book-trace change, browser, tool edit, DB operation or mathematical
re-evaluation was performed.
