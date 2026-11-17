# Distance/time b51 independent TEXT review

**Verdict: BLOCK (reused mechanical evidence missing); independent semantic review: PASS.**
Reviewed on 2026-11-17 before deriving any written-task solutions. Scope: offline, same checkout, text only; no candidate edits, inherited answer review, or promotion.

## Bound Inputs

Read the complete raw `6p/lessons/phy6-c3-s5/{lesson.md,lesson.json,exercises.json}`, all 10 candidate prose blocks, all 8 candidate tasks, and the full figure template. Independently opened the actual original `6p/figures/fig-{32,33,34}.png` once each, not the author's inventory. SHA-256 values:

| Frozen candidate | Current SHA-256 |
|---|---|
| lesson.template.json | `bc828629d4e55f090d923af8dddaeeaf94585cb7f14f78e0eda2a5778bdd1cae` |
| exercises.template.json | `b3c2cd60f882a6df86567d37e96a78fc1f72dca3b3286a4cca6c42974a3b61c6` |
| figures.template.json | `2b275ce8dd08694060b42eeb44bddc5ffe3da376a315d6259a18b2c9a9cff347` |

Candidate root: `.tmp/ld-s10y-lesson/text-author-distancetime-b51/lessons/phy6-c3-s5/`. All three hashes match the author report. Raw and original-PNG hashes are in the reviewer's small `manifest.json`.

## Finding

**Blocker: missing reusable command evidence.** A recursive listing of the supplied author root found only the three read-only templates. There is no focused-check command/output/exit record, failed candidate, affected-block validation output, normalization record, or saved prose-flow output. The durable author report states first focused check exit 1, one adjacency repair, affected `validate_text` PASS/exit 0, and initial success for the remaining checks. Those are author declarations, not inspectable command evidence. Therefore their mechanics cannot be independently reused as a proved pass here. This is an evidence block, not a request for a second repair or a full-check rerun.

Inspected the existing `edition.py` implementation without executing it: `number_signature` excludes formulas and uses `(?<![\w.])-?\d+(?:\.\d+)?(?![\w.])`. Chinese adjacency in `即3000米` prevents that token being counted; separating `3000` exposes it. The current `也就是3000米` preserves the actual value and source-style adjacency, so the reported failure/repair mechanism is plausible. The reported failed lesson hash is `b7b516c8541f438ab430702a0e4a4c21630e71feaa6043047362e3c73ad85e63`; its bytes and delta PASS are unavailable. Repair allowance remains author-used 1/1, reviewer-used 0.

## Complete Semantic Review

Reader: the charter's young self-learner calculating distance or duration. The intended and actual question is how to use speed relations for the relevant movement interval. Every block serves that question; no added scenario, solution leakage, machine-process copy, or unsupported claim was found.

| Prose block, source binding | Independent result |
|---|---|
| 0, p0053#3 | PASS: constant 20 m/s; each 1 s covers 20 m; 5 s gives 100 m and 10 s gives 200 m. Both literal formulas retained. |
| 1, p0053#4 | PASS: distance equals constant speed times elapsed movement time. |
| 2, p0053#5 | PASS: `s=vt` unchanged; Chinese punctuation is outside math. |
| 3, p0053#6 | PASS: distance and uniform speed determine duration. |
| 4, p0053#7 | PASS: 1.5 m/s and 3 km = 3000 m retained; adjacency repair changes no quantity or condition. |
| 5, p0053#8 | PASS: `t=s/v` retained and introduced after `s=vt`; division requires positive speed for positive travel distance. |
| 6, p0053#9 | PASS: 3000 m / (1.5 m/s) = 2000 s, not 2000 minutes or a clock time. |
| 7, p0053#10 + p0054#1 | PASS: source-equivalent treatment of variable motion using its average speed; does not replace average speed with an arbitrary instantaneous speed. |
| 8, p0054#2 | PASS: `s=v_{\text{平均}}t` unchanged. Average speed and duration must describe the same interval. |
| 9, p0054#3 | PASS: duration is this distance divided by this interval's average speed, not an arithmetic mean of unrelated speeds. |

| Task identity | Independent result |
|---|---|
| g1 / 1 / source 1 | PASS: both uniform-motion requests retained. |
| g1 / 2 / source 2 | PASS: explicitly refers to the previous two requests for variable motion. |
| g2 / g2-1 / source 1 | PASS: all three objects, 10 seconds, and the original section-17 speed-table dependency retained. |
| g2 / g2-2 / source 2 | PASS: 750 km/h and 6 hours retained; no seconds/hours mismatch. |
| g2 / 3 / source 3 | PASS: both vehicles, 4000 m, and the section-17 table retained; the preceding 750 km/h must not substitute for the table's aircraft speed. |
| g2 / 4 / source 4 | PASS: original distance/time axes, uniform motion, 10 hours, and fig-32 binding retained. |
| g2 / 5 / source 5 | PASS: both I/II motions and comparison with a reason retained; distance/time graph, not speed/time. |
| g2 / 6 / source 6 | PASS: speed/time graph, speed request, 5 seconds, and fig-34 retained. |

Original-pixel observations: fig-32 has `s` in kilometres and `t` in hours, ticks 100..500 and 2..12, with a rising line from the origin to approximately (12 h, 500 km); the 10-hour value is not a labelled exact datum. Fig-33 has distance in metres and time in seconds, two origin-based rising lines; the upper I reaches approximately (5 s, 10 m), the lower line approximately (6 s, 6 m). The lower Roman numeral is degraded; the task supplies the pair I/II. Fig-34 has speed in m/s and time in seconds, with a nominal horizontal line at 10 m/s; slight scan irregularity is not evidence of acceleration.

Raw snapshots equal the candidate embedded `source.data` objects exactly. All 18 `source_text` values match their raw targets; source hashes match current raw bytes. Lesson identity, source refs, all eight `(number, source_number, group_id, group)` tuples, task page bindings, figure refs and unique exercise figure placements agree with the raw files. The numbering is g1: 1,2 and g2: 1..6, not one eight-number sequence. All `numeric_changes` and `historical_entities` are correctly empty; no fictional names, scientific-history entities, or registered errata require declarations. Changes are confined to declared wording/layout; literal mathematical contents and actual quantities are retained.

Flow inspection, not a rerun: read `htmlfrag.js`'s shared paragraph/adjacent-anchor resolver. The candidate contains 11 paragraphs (the first source block has two; the other nine have one each), sentence/formula line breaks, no full-width column padding, and two exact unique adjacent anchors: `s=vt` to the time calculation; 2000-second calculation to average-speed treatment. Both transitions are conceptually correct. No `prose_flow.mjs`, normalization, source-page gate, KaTeX gate, FIG gate, or full TEXT checker was executed here; their missing saved outputs remain covered by the blocker above.

## Boundary

This completes the independent first TEXT review. Source-only derivation follows separately, without reading any other solutions, book answers, answer keys, choices, or interaction artifacts/history. Reviewer images: task 3, context 3, crops/reopens 0, parent handoff 0. No app, dependencies, Git, DB, services, source/figure production, finalize, autograding, or promotion actions.
