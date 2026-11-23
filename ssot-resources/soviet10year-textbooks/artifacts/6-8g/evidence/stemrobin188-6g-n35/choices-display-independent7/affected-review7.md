# N35 Affected Table Access Review

Verdict: **PASS** for `N35-DISPLAY7-001` through existing horizontal scrolling. The original `review.json` FAIL and `review.md` remain unchanged and sealed `0444`; the original cutoff observation remains valid historical evidence.

Opened only `choices-table-scroll7-390.png`, once. All four tables show complete union/intersection headers and four right-column data rows. A's first max/min intervals, B/C/D's first min/max intervals, all real-line entries, and A-C's final separated-interval unions retain their closing notation. Intersection intervals, braces and empty-set entries are readable. Final rows, right-side expressions, and the bottom separator/margin are intact, without incoherent overlap. These are display observations, not mathematical correctness judgments.

| Option | Window / scroll width | Endpoint reached | Table-right minus window-right | Inner formula overflow |
| --- | --- | --- | --- | --- |
| A | 314 / 484px | 170 / 170px | -0.015625px | 0 |
| B | 315 / 488px | 173 / 173px | 0.0625px | 0 |
| C | 314 / 488px | 174 / 174px | -0.703125px | 0 |
| D | 314 / 466px | 152 / 152px | 0.4375px | 0 |

The supplied measurements record `overflow-x:auto`, all endpoints reached exactly, and 19 zero-overflow formula measurements per table. The endpoint intentionally cuts some left-column content; the unchanged original left-window review covers that content. This fills access evidence, not simultaneous four-column fit in one mobile frame. No new browser, keyboard, touch or scroll-discoverability test was performed.

Aggregate accessible coverage per viewport: **9 complete stems, 39 complete options, 25 complete tables, 58 complete data rows**. Desktop reuses its original complete review. Mobile combines the original 35 options/21 tables/42 rows with these four accessible tables and their 16 rows. No new finding remains in this affected scope.

## Bindings

Original review SHA-256: `d21dde78ce16a01ede72a3f81a68e935b0621da165bc191b31705407609bdbbb`.

Endpoint PNG SHA-256: `ac183b276297e283cd1efa640801f8831fd1bb157135a13e910a21ee82861ecc`.

Endpoint measurements SHA-256: `28dc56dcec72c2550e0a68d75dd1c9b691d9779172e752e9e21bf6d5ff0cc449`.

Exact absolute paths, original report/PNG hashes and current canonical/draft hashes are in `affected-review7.json`. Original reports, all four original PNGs, capture manifest, learner-only coverage and canonical inputs match their prior bindings. Canonical inputs were hashed only; no draft keys/intents or written answers were consulted.

Actual image counters: **1 additional open, cumulative 5/8 batch and 5/24 context; 0 reopens/crops/new captures/rerenders/diagnostics; browser 0**. No canonical, capture, shared, CSS or original-report edits. Both new affected review files sealed `0444`.
