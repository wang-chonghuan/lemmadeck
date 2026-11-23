# SOURCE60 Technical Counter PASS, Private Delta Only

All commands used explicit workdir
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.
All worker writes are inside `.tmp/180-7-n12-p60-counter/`.
No live layout/source/finalize, source61/62/65, installer/user diffs,
DB, Git state, budget, source FIRST or course approval was changed.
No install/update, prepare, finalize, vectorize, assembly, paid call,
schema/app/modern-data, new agent/chat, timer or outgoing message occurred.

## Exact Initial Failure

Live P54 detector SHA256:
`8cb92aec54903cec817cec5c0f4fa29502e6f16ffc3919b7052ef217ed4d9e8d`.
Source60 original PDF/render match, content width1640.
Its isolated rule has one component, rows1960..1966, columns150..632,
2267 ink pixels, line_h46 and glyph_h43.
Shape, width, component extent and both gap predicates pass.
But initial raw preceding band1917..1922 is a right-margin speck,
with ZERO body glyphs. Thus `min(len(body), len(small)) < 5` rejects
the genuine separator before the existing later cleanup removes the speck.
The following scientific-footnote row has23 qualifying smaller glyphs.
See `diagnosis.json`; no production coordinates/count/page conditions added.

## Verified Delta

Candidate: `layout.py` and identical frozen `candidate-02/layout.py`.
SHA256:
`b7c18ef0992b98a27b56ecd0437c3a5f2286f6da1ab5df02b0189ed14cc9a03a`.
Apply only `candidate-02/candidate.diff`, never the failed candidate01.

The separator block moves after existing noise cleanup, resolving context
with the existing glyph-gap factor. Its shape, single-component,
isolation-gap, five-glyph, small-type and span predicates remain unchanged.
Only body-edge component support admits half-height CJK radicals instead
of requiring three-quarter-height components; this boundary evidence does
not relax neighboring font selection. This closes the real-row deletion
that previously removed the only eligible body-edge component.

The existing small-type evidence collection moves before margin cleanup.
A conservative veto preserves disconnected full-height thin strokes
consistent with that nearby, five-glyph-supported smaller type. It fixes
the genuine small `加` glyph otherwise erased by the old legacy fragment
blot predicate. It does not add a density/count fallback or alter fraction
helpers, constants, geometry/extraction or any function outside line_bands.

`verify_delta.py` checks AST identity outside line_bands and exact original
separator AST after normalizing the single body-edge height change.

## Focused Evidence

| Snapshot | Source60 methods / failures / errors / skips | Unchanged portable P54 methods / failures / errors / skips |
| --- | --- | --- |
| baseline | 10 / 93 / 0 / 0 | 6 / 0 / 0 / 0 |
| candidate-01 | 10 / 8 / 0 / 0 | 6 / 0 / 0 / 0 |
| candidate-02 | 10 / 0 / 0 / 0 | 6 / 0 / 0 / 0 |

Failure totals include individually retained subtest assertions.
Candidate01's four real-deletion assertions and four small-glyph assertions
remain in `candidate-01/source60.txt`, with its code/diff/results.
The first diagnostic-script failure also remains; it is not a source FIRST.

Final source60 proof:25 independent real anchors in normal/mirrored scans;
all25 actual row deletions in BOTH orientations reduce count to24 and
preserve the remaining anchors, including four scientific-footnote rows
and footer; all25 authored omissions reconcile to24, not25.
The genuine rule alone is additionally absent from the counting copy;
input pixels remain intact. Actual formula, numerator, denominator,
vector/body/small-footnote glyphs and footer add standalone anchored rows;
actual fraction bars/minus/glyph strokes survive at three placements and
in both orientations. Small-type absence and genuine fraction-context
controls veto rule removal; vertical translations retain every anchor.
P54's original portable tests, including all21 deletions in both
orientations, small denominator rows and stroke/pixel guards, are unchanged.

No shared/global tests were rerun. Historical4 shared failures/2 skips
remain acknowledged, not re-proven and never represented as all-green.

## Preservation And Images

Worker source writes: ZERO.
Original source60 PNG SHA256 remains
`5513f5d64cee0b89faf73929a847d8efffa5ef4ea703d524df9fd1a29e1eac12`.
Parent explicitly changed scientific footnote p to named foot during this
run. Initial MD SHA `45b69fe3f447a294f8255e7fb599b6ec064ad69a16433ae7d6df72bea6616061`
is retained in baseline bindings; verified current MD SHA is
`7db0f7d4fc823cb9c866fe880ae9933dfd9575f4e1270faa504fcbfa4dcfe4d6`.
Final verified run's before/after protected bindings are byte-identical,
including source60 durable FIRST/finalize-source-first and live layout.
The parent's named-footnote correction does not erase initial evidence.

Actual visual image payloads viewed: ONE, source60 page.png; no grid,
new crop, second view or source61/62/65 image was opened.
Original PDF60/31/54 numerical fixtures were rendered in owned scratch
for portability and hashing, never opened as model image payloads.

Full owned paths are in `owned-paths.json`; SHA-bound handoff is
`verified.json`; logs/results are retained under each snapshot.
This is technical counter PASS only. Parent applies the exact verified
delta and performs finalization; source/course approval is not produced.

Reproduction from the explicit workdir, using the already-installed venv:

```sh
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/180-7-n12-p60-counter/run_checks.py candidate-02 candidate-02-recheck
.claude/skills/ld-s10y-lesson/.venv/bin/python -B .tmp/180-7-n12-p60-counter/verify_delta.py
```

The runner refuses to overwrite retained results: the optional second
argument names a fresh result directory inside the same owned scratch.
No live file needs changing to execute the proof.
