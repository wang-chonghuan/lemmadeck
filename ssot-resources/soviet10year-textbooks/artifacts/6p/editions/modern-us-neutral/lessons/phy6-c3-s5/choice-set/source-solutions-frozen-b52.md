# Independent Source Solutions Frozen: Batch 52

Date: 2026-11-17. Reviewer: independent-agent-b52-distance-time-first.
Stage 1 is frozen before any learner-view output or author intent/key output.
This reviewer did not author the seed, draft, figures or their reports.

## Input Boundary

- Ticket: STEMROBIN-180; book `6p`; lesson `phy6-c3-s5`.
- Seed: `.intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s5/seed-b52.json`.
- Seed canonical SHA-256: `9401583320a0d79b8d2ee3d1f5b326758947f7bb2d944d2009bdaad38f20854f`.
- Draft canonical SHA-256, computed without exposing its content: `6db7477a4dc26dae6c62b85f4eaf22549d9e4349e5b6bf37883c0e065ef0687c`.
- Canonical hash contract: SHA-256 of UTF-8 `json.dumps(value, sort_keys=True, ensure_ascii=True, separators=(",", ":"))`.
- Selected source numbers, exactly: `1`, `2`, `g2-2`, `4`, `5`, `6`.
- Selected concept blocks, exactly: `1`, `2`, `3`, `7`, `8`, `9`.
- No original answer keys, earlier choices, interactions, author solutions, author reports, history, other-course material or missing conversion tables were consulted.

`g2-1` and `3` are explicitly deferred table-dependent speed conversions, not selected seeds. No table is supplied or recovered. All eight original written tasks remain retained and untouched outside this choice-review scope. This freeze solves six selected seeds, not all eight written tasks.

## Actual Figure Observations

Exactly three images were loaded, once each, using local Quick Look PNG renditions of the three hashed SVG assets. No crops or reopens. Task count 3/8; fresh-context count 3/24. The previews show entire axes, rightmost ticks and line endpoints, bottommost ticks and labels; no relevant object is clipped. Rendering for observation is not a FIG/native gate.

### fig-32

Asset: `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/figures/fig-32.svg`.
Byte SHA-256: `85ca6483cc6291fb055f7ec4e9b632b8802397e0581faf5a015bbe4b15d4043b`.
Opened preview: `reviewer-b52/fig-32.svg.png`.

The vertical axis is `s (km)`, with 100, 200, 300, 400, 500 ticks; the horizontal axis is `t (h)`, with 2, 4, 6, 8, 10, 12 ticks. A single rising straight line begins at the origin and ends approximately above 12 h at the 500 km level. At 10 h it is above 400 km, approximately 417 km. Neither 400 km at 10 h nor 500 km at 10 h describes the drawn line. Treat inferred quantities as graph estimates, not precision measurement.

### fig-33

Asset: `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/figures/fig-33.svg`.
Byte SHA-256: `3ff448cb7986aee13345302b90e3a6bc918f3e3a944f1a5d5385b822b5ffcee3`.
Opened preview: `reviewer-b52/fig-33.svg.png`.

The vertical axis is `s (m)`, with ticks 2 through 12; the horizontal axis is `t (s)`, with ticks 1 through 7. Two straight lines start at the same origin. I is steeper and ends approximately at (5 s, 10 m); II ends approximately at (6 s, 6 m). I lies above II for every common positive time shown. The rightmost 7 s tick, bottom labels, both endpoints and I/II identifiers are visible.

### fig-34

Asset: `ssot-resources/soviet10year-textbooks/artifacts/6p/editions/modern-us-neutral/figures/fig-34.svg`.
Byte SHA-256: `7a9c9963001dbbdc8dc05c0db7c20b79068394c1b8eb44700a15405f920626ff`.
Opened preview: `reviewer-b52/fig-34.svg.png`.

The vertical axis is `v (m/s)`, with ticks 2, 4, 6, 8, 10; the horizontal axis is `t (s)`, with ticks 1 through 7. The graph is a horizontal line at 10 m/s from zero through and beyond 7 s. The 5 s tick, entire horizontal graph, right endpoint, bottom axis and labels are visible. This is a speed-time graph, not a distance-time graph.

## Complete Independent Solutions

### Source 1

For uniform motion, distance is speed multiplied by elapsed time: `s = v t`. Speed is constant over the stated interval. Given distance and a positive speed, time is `t = s / v`. Use matching units: km/h with h gives km; m/s with s gives m; division gives the corresponding time unit. Zero speed cannot produce a positive distance in finite time, so division assumes `v > 0`. Both original questions must be preserved together; recognition cannot demonstrate independent derivation or written explanation.

### Source 2

For nonuniform motion, the same distance/time relationships hold with the average speed for that very interval: `v_avg = s_total / t_total`, hence `s_total = v_avg t_total`, and for positive average speed `t_total = s_total / v_avg`. An arbitrary instantaneous, starting, final, maximum or different-interval average speed cannot replace this average. An unweighted arithmetic mean of sampled speeds is not generally the total-distance/total-time average. The original asks both distance and time, not merely the definition of average speed.

### Source g2-2

The flight uses 750 km/h over 6 h. `s = 750 * 6 = 4500 km`. Hours cancel the denominator of km/h; the result is a distance, not km/h or h. No external conversion table is needed. Choosing an answer can retain multiplication and unit reasoning but cannot demonstrate independently setting out a calculation.

### Source 4

Read the distance-time axes and estimate the line height at 10 h: approximately 417 km, reasonably reported as about 420 km. The origin-passing straight line represents constant speed. From its approximate endpoint, `v ~= 500 km / 12 h ~= 41.7 km/h`, or about 42 km/h. Equivalently, divide the approximately 417 km at 10 h by 10 h. Both requested quantities must agree with the same line. Reading 500 km as the 10-hour distance confuses the 12-hour endpoint with the requested time. Reading 400 km exactly forces a nearby tick rather than the actual line. No finer precision than the image supports should be claimed.

### Source 5

Motion I is faster. On a distance-time graph speed is the slope, equivalently distance divided by elapsed time. For a common positive time, I covers more distance than II. For example, around 4 s the two distances are about 8 m and 4 m. The endpoint estimates give `v_I ~= 10/5 = 2 m/s`, `v_II ~= 6/6 = 1 m/s`, but a numerical ratio is not required: the source asks which motion is faster and a graph-based reason. Comparing different endpoint distances without their elapsed times is not sufficient reasoning. Recognition of a complete justified comparison preserves the mathematical comparison but loses independent prose explanation.

### Source 6

The speed-time graph is horizontal at `10 m/s`, so the speed stays constant. In 5 s, `s = 10 m/s * 5 s = 50 m`. Both speed and distance are required. A horizontal speed-time graph means nonzero constant speed here, not rest. The ordinate is speed, so 10 m is not the distance reading; distance comes from multiplying speed by the interval (equivalently the rectangle area, though no area method is required by the selected definitions).

## Frozen Capacity Expectations

Each selected seed has a distinct task: uniform forward/inverse formulas; interval-matched average forward/inverse formulas; numeric distance and units; graph-estimated distance plus speed; slope comparison with reason; speed-time reading plus numeric distance. Choice recognition may retain these relationships while losing independently produced calculations, derivations and prose. A later view must retain all requested mathematical distinctions and disclose those production losses. No verdict on unseen choices or author coverage is made at this stage.
