# Distance/time b51 independent source-only solutions

**Outcome: all 8 written tasks solved, source-only.** Derived on 2026-11-17 after completing the independent TEXT review. Its verdict remains BLOCK for missing reusable mechanical evidence; this derivation does not approve or repair the text, generate final keys, or authorize promotion.

## Source Basis

Read the full raw lesson/exercises and all frozen candidate blocks/tasks. Independently opened original figs 32, 33, 34 once each during TEXT review and used those observations without reopening. Then located the explicitly referenced section-17 speed table in raw `6p/lessons/phy6-c3-s3/lesson.json`: caption `p0050#3`, figure `p0050#4`, printed page 39. Opened actual `6p/figures/tbl-p0050-02.png` once; this is source data, not an answer table.

Its caption gives metres/second. Pixels give walking 1.2-1.8, skating **可达 12.5**, train **平均 20**, and turboprop aircraft **平均 200**. No other solutions, book answers, answer keys, choices, interaction artifacts/history, or author inventories were consulted.

| Bound candidate | SHA-256 |
|---|---|
| lesson.template.json | `bc828629d4e55f090d923af8dddaeeaf94585cb7f14f78e0eda2a5778bdd1cae` |
| exercises.template.json | `b3c2cd60f882a6df86567d37e96a78fc1f72dca3b3286a4cca6c42974a3b61c6` |
| figures.template.json | `2b275ce8dd08694060b42eeb44bddc5ffe3da376a315d6259a18b2c9a9cff347` |

Raw lesson SHA `fbfe15649b33ce82c2c0327730e24dd20fa86c78ca0cd83e301771d4c6c53f8f`; raw exercises SHA `7f10b147ad619680bd9ff439e2034e51b73f4bcc7bd3c97c322c9c9b5a1d24f0`; table PNG SHA `8718af4581b71c7d6951a0f585aa44d3f72cdc3a18b51df110bd061d48667d6e`; section-17 binding lesson SHA `1919cc7166a149b7293677d5ce0006457a80e6384e83e82548033aad6f4c63db`. Original graph hashes remain bound in the TEXT report's manifest and in `source-only.json`.

## Eight Solutions

| Stable identity (group / internal / printed) | Independent answer and reasoning |
|---|---|
| g1 / 1 / 1 | Uniform motion: `s=vt`, `t=s/v`. Constant speed times elapsed time gives travelled distance; division requires positive speed for a positive journey. |
| g1 / 2 / 2 | Variable motion: `s=v平均t`, `t=s/v平均`. The average is total distance / total elapsed time for the same interval, not an arbitrary instant's speed or an unweighted average of several speeds. |
| g2 / g2-1 / 1 | In 10 s: walking **12-18 m** from `(1.2-1.8)×10`; skating **125 m when maintaining the listed attainable 12.5 m/s**; train **200 m if the table's average 20 m/s applies to these 10 s**. Neither the walking range nor “可达” is a unique unconditional fixed speed. |
| g2 / g2-2 / 2 | Aircraft: `750 km/h × 6 h = 4500 km`. Use this task's own speed over the specified six-hour interval. |
| g2 / 3 / 3 | Train: `4000 m ÷ 20 m/s = 200 s = 3 min 20 s`; aircraft: `4000 m ÷ 200 m/s = 20 s`. Use the table averages for these journeys, not the preceding task's 750 km/h. |
| g2 / 4 / 4 | Fig-32: about **420 km in 10 h**, speed about **42 km/h**. The original line ends near `(12 h,500 km)`; idealizing that approximate endpoint gives `v≈500/12≈41.7 km/h`, `s(10)≈416.7 km`. The queried point is not an exact labelled datum. |
| g2 / 5 / 5 | Fig-33: **I is faster** because its distance is greater at the same positive time, equivalently its distance/time slope is greater. Approximate endpoint checks give I `10/5≈2 m/s`, II `6/6≈1 m/s`. |
| g2 / 6 / 6 | Fig-34: horizontal speed line at **10 m/s**, hence `s=10×5=50 m`. Speed is the line's height here, not its slope. |

All times are durations, not arrival clock times. Consistent units are required. For variable motion, the supplied average must match exactly the distance/time interval being used, including any stops if those stops are included in the total duration. Distance is travelled path length, not signed displacement.

Fig-32 precision is deliberately explicit: the plotted 10-hour height lies above 400 km, and the hand-drawn line/endpoint do not support exact fractional precision. The fractions `1250/3 km` and `125/3 km/h` are only conditional endpoint interpolation values. Coarse reading to the 100-km major ticks could instead give about 400 km and about 40 km/h; these are lower-precision estimates, not a second exact source datum. No acceptance alternatives or numeric judging rules are generated.

Fig-33's lower Roman label is degraded in the original; the original task supplies the I/II pair and the upper line is clearly I. The lower line is therefore II. The comparison uses common axes and common times, not unequal endpoint distances alone. Fig-34's scan irregularity does not override the source's uniform-motion condition.

## Output And Limits

Complete answers, reasoning, interval conditions, units, source refs and original-pixel observations are in `.tmp/ld-s10y-lesson/text-review-distancetime-b51/source-only.json`. It is an offline derivation artifact, not a lesson answer-key schema and contains no grading/expected/interaction specification.

Counts: 8/8 tasks; 4 task/context images total (figs 32/33/34 once each plus the speed table once); crops/reopens 0; parent handoff images 0. No additional repair, source/text/normalization/proseFlow/FIG pipeline run, app/dependency/Git/DB/service operation, figure production, final keys, autograding, or promotion.
