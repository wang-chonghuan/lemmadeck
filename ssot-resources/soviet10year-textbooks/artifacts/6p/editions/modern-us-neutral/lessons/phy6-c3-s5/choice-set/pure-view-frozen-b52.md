# Independent Pure-View Review Frozen: Batch 52

Date: 2026-11-17. Reviewer: independent-agent-b52-distance-time-first.
Stage 2 is frozen after `source-solutions-frozen-b52.md` and before any author intent, key, rationales, coverage notes or report is disclosed.

## Snapshot and Isolation

Seed canonical SHA-256: `9401583320a0d79b8d2ee3d1f5b326758947f7bb2d944d2009bdaad38f20854f`.
Draft canonical SHA-256: `6db7477a4dc26dae6c62b85f4eaf22549d9e4349e5b6bf37883c0e065ef0687c`.

The one-shot machine projection parsed the draft JSON but exposed only:
`draft.questions.map(q => ({id: q.id, view: q.view}))`.
No source mapping, author intent, source solution, key, rationale, misconception, coverage or new-figure basis was output. The image observations remain those from Stage 1: fig-32, fig-33, fig-34 each opened once; no new images or reopens. Count remains 3/8 task and 3/24 context.

Every visible stem and every option is recorded below. Truth is the truth of the complete option under its stem, not of one isolated clause. The intended correct sets below were independently fixed before key comparison.

## b52-uniform-methods

Mode: `single`. Figures: none.

Stem: 物体以恒定的正速度 $v$ 运动，经过时间 $t$，通过路程 $s$。如果速度用千米/小时、路程用千米表示，哪一组计算方法和时间单位都正确？

| Option | Visible text | Independent truth and evidence |
| --- | --- | --- |
| A | 求路程用 $s=v/t$；求时间用 $t=s/v$；时间用小时。 | Incorrect. Distance is `v*t`, not `v/t`; km/h divided by h gives km/h^2. The time clause does not rescue the conjunction. |
| B | 求路程用 $s=vt$；求时间用 $t=v/s$；时间用小时。 | Incorrect. Time is `s/v`; `v/s` has units 1/h and is the reciprocal of time. |
| C | 求路程用 $s=vt$；求时间用 $t=s/v$；时间用小时。 | Correct. Uniform distance uses multiplication; km divided by km/h yields h. |
| D | 求路程用 $s=vt$；求时间用 $t=s/v$；时间用秒。 | Incorrect. With the stated km and km/h, the formula yields hours; seconds require an additional factor 3600 or prior conversion, which is not given in this option. |

Independent intended set: `{C}`.
Independent solution: `s=vt`, `t=s/v`, time unit h; positive `v` makes division defined.

Task fidelity: PASS. Both source-1 directions survive in a single conjunctive response; the extra units check is justified and self-contained. No table conversion is required.
Capacity loss: recognition does not prove the learner can independently derive, write or explain the formulas. One whole option can be rejected because one component is wrong; this is reasonable elimination, not a removed relationship.
Redundancy: PASS. A targets forward division, B inverse division, D units; the triplets are not equivalent. The later numeric and graph questions apply the same law but do not answer these symbolic/inverse/unit alternatives.
Leakage: PASS. No key, source number or indicated correct styling. Identical true clauses are distributed among false and true alternatives; an all-components-correct judgment is still required.

## b52-average-interval

Mode: `multiple`. Figures: none.

Stem: 一个物体做变速运动。在整段30分钟的行程中，平均速度为18千米/小时。以下关于这段行程的说法，哪些正确？选择所有正确的说法。

| Option | Visible text | Independent truth and evidence |
| --- | --- | --- |
| A | 这整段行程的总路程是9千米。 | Correct. `30 min = 0.5 h`; `s=18*0.5=9 km`. |
| B | 这段行程的前15分钟必定通过4.5千米。 | Incorrect. For example, speeds 12 km/h for the first 15 min and 24 km/h for the next 15 min give first-half distance 3 km and total 9 km, with the stated whole-interval average 18 km/h. |
| C | 把这整段的总路程除以18千米/小时，得到0.5小时。 | Correct. `t=s_total/v_avg=9/18=0.5 h`; numerator and average refer to exactly the same full interval. |
| D | 这段行程中每一时刻的速度都是18千米/小时。 | Incorrect. Whole-interval average does not mean every instantaneous speed equals it; the 12/24 example disproves it and constant 18 would contradict the nonuniform-motion premise. |

Independent intended set: `{A,C}`.
Independent solution: full interval is 0.5 h, total distance 9 km, inverse calculation 0.5 h; neither equal half-distances nor constant instantaneous speed follows.

Task fidelity: PASS. Source 2's distance and inverse-time rules both appear, with the crucial same-interval average condition tested against subinterval and instantaneous mistakes. Values are newly supplied, not copied from another source. C recognizes the inverse even though the duration is also given; the source asks how to calculate, not an unknown-time numerical problem.
Capacity loss: general symbolic formula production and explanation are replaced by a concrete whole-interval calculation and identity check. Knowing the given duration alone does not justify C's average-speed division; the interval relationship remains.
Redundancy: PASS. A/C concern forward/inverse relationships, B concerns a subinterval necessity, D every instant. A and C are related consequences, as intended in the same multiple-response task, not independent duplicate questions.
Leakage: PASS. A can help calculate C within this one coherent task, but there is no correct-set cue. The nonuniform premise appropriately bears on D, not on the entire true set. No other question supplies the 18 km/h or 30 min result.

## b52-flight-distance

Mode: `single`. Figures: none.

Stem: 一架飞机以750千米/小时的速度飞行。飞行6小时，通过的路程是多少？

| Option | Visible text | Independent truth and evidence |
| --- | --- | --- |
| A | 125千米 | Incorrect. `750/6=125` divides where `s=vt` requires multiplication. |
| B | 4500千米 | Correct. `750*6=4500 km`. |
| C | 270000千米 | Incorrect. `750*(6*60)=270000` treats minutes as hours while retaining km/h; 6 h is not 360 h. |
| D | 750千米 | Incorrect. Copies the speed numeral as a distance, ignoring the six-hour factor; 750 km corresponds to one hour. |

Independent intended set: `{B}`.
Independent solution: `750 km/h * 6 h = 4500 km`.

Task fidelity: PASS. g2-2's numerical multiplication and distance unit remain unchanged. No conversion-table source is imported.
Capacity loss: selection does not show independently produced work, an equation or written cancellation of units.
Redundancy: PASS. All four values are distinct and represent divide/multiply/unnecessary factor/copy procedures. Another item's formula is a reusable lesson law, not a disclosed numeric answer.
Leakage: PASS. All options use km; no correct answer is visually singled out or supplied by another item. The exact multiplication must be evaluated.

## b52-distance-graph-estimate

Mode: `single`. Stem figure: `fig-32`; option figures: none.

Stem: 图中的 $s$ 轴表示路程（千米），$t$ 轴表示时间（小时），物体做匀速运动。粗略读图后，它在10小时内通过的路程和运动速度，应落在哪一组范围内？

| Option | Visible text | Independent truth and evidence |
| --- | --- | --- |
| A | 路程在350至450千米之间，速度在350至450千米/小时之间。 | Incorrect. Distance range contains about 417 km, but speed about 41.7 km/h is outside 350-450 km/h. Copying a distance-sized numeral as speed misses division by 10 h. |
| B | 路程在450至550千米之间，速度在45至55千米/小时之间。 | Incorrect. Both ranges miss the actual estimates. It fits mistakenly moving the roughly 500 km endpoint at 12 h to 10 h, producing 50 km/h. |
| C | 路程在35至45千米之间，速度在3.5至4.5千米/小时之间。 | Incorrect. Both estimates are a factor ten too small; dropping a place from the distance scale yields about 41.7 km, then 4.17 km/h. |
| D | 路程在350至450千米之间，速度在35至45千米/小时之间。 | Correct. Approximately 417 km and 41.7 km/h are strictly inside these ranges. |

Independent intended set: `{D}`.
Independent solution: line at 10 h is about 417 km; slope is about `500/12=41.7 km/h`. Do not assert an exact 400 km, 500 km, 40 km/h or 50 km/h from this rendering.

Task fidelity: PASS. Source 4's graph-read distance and calculated speed are retained together. The 100 km / 10 km/h bands intentionally relax numeric precision, consistent with "coarse reading". The correct bands also contain 400/40, so this item does not discriminate that modest estimate from about 417/41.7; that is an explicit precision loss, not an exact-value certification. It still rejects wrong endpoint, decade and axis-use procedures.
Capacity loss: independent estimated-value production and finer graph interpolation are not demonstrated.
Redundancy: PASS. B and C are internally distance/time-consistent but disagree with the graph; A isolates the missing time divisor. They are not mathematically equivalent to D.
Leakage: PASS. Internal consistency alone eliminates A but leaves B/C/D; the graph scale and requested 10-hour interval are required to distinguish these. No exact source answer or endpoint instruction is embedded in the stem.

## b52-shared-graph-comparison

Mode: `single`. Stem figure: `fig-33`; option figures: none.

Stem: 图中的两条线分别表示匀速运动 I 和 II 的路程随时间的变化，二者都从路程为0处开始。哪一个关于速度大小及理由的判断正确？

| Option | Visible text | Independent truth and evidence |
| --- | --- | --- |
| A | II 更快，因为通过相同路程时，II 花的时间更多。 | Incorrect. At the same positive distance II indeed takes longer, which means slower, not faster. |
| B | 两者一样快，因为两条图线都是经过原点的直线。 | Incorrect. Both origin-passing lines describe constant speeds, but different slopes, not equal speed magnitudes. |
| C | I 更快，因为相同时间内 I 通过的路程更多。 | Correct. At a common positive time I is above II; about 4 s gives about 8 m versus 4 m. |
| D | I 更快，因为 I 图线终点的纵坐标为10，其速度就是10米/秒。 | Incorrect. I is faster, but the ordinate is distance 10 m at about 5 s; its speed is about 2 m/s, not 10 m/s. |

Independent intended set: `{C}`.
Independent solution: I has greater distance-time slope, so I is faster; compare at a common positive time rather than copy an endpoint height.

Task fidelity: PASS. Source 5's comparative judgment and graph-based reason remain in the same response. Selecting a valid distance/time explanation may allow elimination of logically invalid explanations before reading a precise ordinate; reasonable elimination preserves the key relationship rather than failing the task.
Capacity loss: independent graph-based prose and calculation are not demonstrated; no exact numerical speed ratio is assessed.
Redundancy: PASS. A reverses equal-distance timing, B confuses constant with equal, D copies a distance as speed. C and D share I as faster but differ materially in the reason.
Leakage: PASS. Faster-I occurs in two options, so merely identifying I does not determine the answer. All alternatives have explanatory clauses; length or source numbering supplies no key.

## b52-velocity-graph-distance

Mode: `single`. Stem figure: `fig-34`; option figures: none.

Stem: 图中的 $v$ 轴表示速度（米/秒），$t$ 轴表示时间（秒）。这个做匀速运动的物体，速度是多少？它在前5秒内通过多少路程？

| Option | Visible text | Independent truth and evidence |
| --- | --- | --- |
| A | 速度为0米/秒，路程为0米。 | Incorrect. A horizontal speed-time line at 10 means constant nonzero speed, not rest. |
| B | 速度为10米/秒，路程为50米。 | Correct. Read `v=10 m/s`, then multiply by 5 s to get 50 m. |
| C | 速度为50米/秒，路程为10米。 | Incorrect. Swaps the calculated distance numeral 50 and read speed numeral 10 into incompatible roles/units. |
| D | 速度为10米/秒，路程为2米。 | Incorrect. Speed clause is correct, but `10/5=2` uses division instead of multiplication; the quotient does not have distance units. |

Independent intended set: `{B}`.
Independent solution: `v=10 m/s`; `s=10*5=50 m`.

Task fidelity: PASS. Source 6's speed reading and five-second distance calculation are both present, with speed-time axes explicitly identified.
Capacity loss: independent reading/calculation and explanation are replaced by paired-value recognition.
Redundancy: PASS. A tests horizontal/rest confusion, C quantity interchange, D a wrong operator; none equals B.
Leakage: PASS. B and D share the correct speed, so copying the ordinate alone cannot select the right complete answer. No distance answer is given in the stem or in another item's data.

## Package Freeze

Independent sets in draft order: `C`; `A,C`; `B`; `D`; `C`; `B`.
Modes observed: five `single`, one `multiple`; six stems and 24 options, all inspected.
Visible source-task capacity: all six selected tasks retain their forward/inverse, units, interval, comparison/reason or graph/calculation distinctions, subject to the explicit recognition and precision losses above.
No new drawing appears in any view; only the three Stage-1 source figures are referenced.
Cross-question check: common laws are reusable curriculum knowledge, but no item's numeric answer, choice ID or interval-specific data answers a different item. No duplicated full task or hidden correct-set disclosure is observed.
Scope exclusion remains `g2-1` and `3`, table-dependent conversions; all eight written tasks are untouched. This is not six-of-eight full written-task production coverage.
Provisional semantic verdict on learner views: PASS for the six-item choice scope. Author key, derivations and capacity notes remain unexamined at this freeze.
