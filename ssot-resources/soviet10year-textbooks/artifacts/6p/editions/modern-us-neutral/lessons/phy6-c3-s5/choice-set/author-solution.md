# Independent SOURCE solution freeze, b52

Prepared before any candidate options. This is internal author evidence, not an
answer source consulted from the textbook and not an independent review.

Authority: official seed-b52.json, canonical digest
9401583320a0d79b8d2ee3d1f5b326758947f7bb2d944d2009bdaad38f20854f.
Selected SOURCE tasks: 1, 2, g2-2, 4, 5, 6.
Selected non-example definition blocks: 1, 2, 3, 7, 8, 9.
Excluded blocks 0 and 4-6 contain or continue solved examples.

## 1: Uniform motion, distance and elapsed time

For a nonnegative elapsed time t and a constant positive speed v, each equal
time interval contributes the same distance. Summing these contributions gives
s = v*t. Inverting for elapsed time gives t = s/v. When v = 0 a positive
distance is impossible; division by zero is not a time calculation.
Distance units must match the numerator of the speed unit, and elapsed time
must match its denominator. With v in km/h and s in km, t is in hours.
With v in m/s and s in m, t is in seconds. Convert minutes before multiplying
by a speed expressed per hour.
Task: explain both methods and the consistent units, not only recite one
formula. Distinction: speed accumulates distance per time; inverse division
recovers time, not the reciprocal of time.

## 2: Variable motion, matching the average to the interval

Average speed on a specified interval is total distance s divided by the
entire elapsed time t on that interval. Therefore s = v_average*t and
t = s/v_average for that SAME interval and positive average speed, even when
instantaneous speed changes. The units follow the same rules as task 1.
An initial, final, instantaneous, or other-interval speed is not necessarily
this whole-interval average. Whole-interval average does not prescribe equal
distances in shorter equal-duration intervals.
Task: adapt both distance and time methods to variable motion. Distinction:
the formula applies to interval totals, not to an assertion of constant
instantaneous speed. No endpoint-speed arithmetic mean is assumed.

## g2-2: Flight distance

The supplied flight speed is 750 km/h and elapsed time is 6 h.
Distance = 750 km/h * 6 h = 4500 km. The hour units cancel.
This uses the given speed for the flight interval; no outside speed table,
route, wind, or airspeed/ground-speed correction is supplied or assumed.
Task: calculate one total distance with units from rate and duration.

## 4: Approximate distance-time graph reading

Opened the entire current fig-32 rendering. Vertical axis: s (km), labeled
100, 200, 300, 400, 500. Horizontal axis: t (h), labeled 0, 2, 4, 6, 8,
10, 12. A rising straight line starts at the origin and ends visually near
(12 h, 500 km). At 10 h its height lies between 400 and 500 km, near
420 km. The slope is roughly 500/12, or about 42 km/h, and s(10)/10 gives
the same coarse estimate. Tick spacing does not warrant an exact endpoint
claim, an exact fraction, or a unique exact 400 km answer.
Robust coarse bins for recognition: 350 < s(10) < 450 km and
35 < v < 45 km/h. These deliberately accept the vicinity of both a
400 km coarse reading and a roughly 420 km reading, not a unique exact value.
Task: read approximate distance and infer speed from distance/time (slope).
No pixel measurement is represented as an instrument measurement.

## 5: Shared distance-time graph comparison

Opened the entire current fig-33 rendering. Both lines start at the origin.
Axes are s (m) and t (s). I is steeper, reaching visually near (5 s, 10 m);
II reaches near (6 s, 6 m). Over any common displayed positive time interval,
I gains more distance: delta_s_I/delta_t > delta_s_II/delta_t.
Thus speed I is greater. Equivalently, I reaches the same positive distance
in less time. Approximate endpoint ratios support about 2 m/s versus
1 m/s, but exact numeric speeds are not required by the written task.
Graph height is distance, NOT speed; it compares speeds only here when the
same elapsed time and common distance origin make s/t comparable.
Both straight lines indicate constant speed, not equal speeds.
Task: choose the faster motion and justify it by slope or common-interval
distance gain, without replacing distance height by velocity.

## 6: Constant velocity-time graph and distance

Opened the entire current fig-34 rendering. Vertical axis is v (m/s),
marked 2, 4, 6, 8, 10; horizontal axis is t (s), marked 1 through 7.
The plotted horizontal line is at 10 m/s from t = 0 across t = 5 and
continues past the tick 7. Therefore the speed is 10 m/s and the distance
over 5 s is 10 m/s * 5 s = 50 m. A horizontal line on a v-t graph means
constant NONZERO speed, not zero speed; the slope is not the speed.
Task: distinguish the speed read from the vertical coordinate from the
distance accumulated over the duration.

## Actual image evidence

All three images were opened exactly once in one author batch (3 of 8
allowed in that batch; 3 of 24 in this context). No crops, reopens, parent
image relay, original scan, FigureSpec, review, or render report was opened.
Every image showed its complete axes, rightmost line endpoint and time
labels, and bottommost origin/time labels; no required object was clipped.

- fig-32 SVG SHA-256:
  85ca6483cc6291fb055f7ec4e9b632b8802397e0581faf5a015bbe4b15d4043b
  Bound matching SVG: .tmp/s10y-image/b51-fig32-33/fig-32/fig-32.svg
  Opened PNG: .tmp/s10y-image/b51-fig32-33/fig-32/native-640.png
  PNG SHA-256:
  f805210c09cbb5748d3a813a1d4987236718f447a8465a327682113984d611cd
- fig-33 SVG SHA-256:
  3ff448cb7986aee13345302b90e3a6bc918f3e3a944f1a5d5385b822b5ffcee3
  Bound matching SVG: .tmp/s10y-image/b51-fig32-33/fig-33/fig-33.svg
  Opened PNG: .tmp/s10y-image/b51-fig32-33/fig-33/native-640.png
  PNG SHA-256:
  58fa54416f8d4e541c354d5781a1f64703f9dd0074fa43dca9d1ffd838a13b3f
- fig-34 SVG SHA-256:
  7a9c9963001dbbdc8dc05c0db7c20b79068394c1b8eb44700a15405f920626ff
  Bound matching SVG: .tmp/s10y-image/b51-fig34/fig-34.svg
  Opened PNG: .tmp/s10y-image/b51-fig34/preview-640-neutral.png
  PNG SHA-256:
  38eb2631e34932a82be288c95eccc3c60e12804b5d0d656d113c11ceae461a9e

The seed retains ONLY the authoritative modern SVG paths. PNGs are viewing
evidence, not new source assets or new choice figures.

## Deferred tasks and capacity boundary

The whitelist contains all 8 written tasks: 1, 2, g2-1, g2-2, 3, 4, 5, 6.
g2-1 requires the pedestrian, skater and train speeds in the Section 17
table; 3 requires the train and airplane speeds in that same table.
The table is absent from this explicit authorized media projection.
Both choice conversions are deferred without guessing, outside reads, or
borrowing the flight speed of g2-2 for task 3. All 8 written tasks are left
untouched. This author run selects only 6; it does NOT cover all 8 in choices.

Recognizing a coherent result or valid statement cannot establish independent
formula writing, explanation composition, graph tracing, or calculation setup.
Any numerical context added for task 2 must be declared as authored transfer
conditions, not falsely attributed to the original prose.
