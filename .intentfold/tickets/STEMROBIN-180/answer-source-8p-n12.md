# Blind Source Solutions: 8p n12

2026-11-23. SAME independent reviewer/solver, before any author option view,
internal draft, solution or key. Sole input:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/.tmp/180-7-n12/choice/seed.json`.
All commands used
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

## Binding And Scope

**All eight whole written questions independently solved and frozen.**
This is source-solving evidence, not approval of unseen options or keys.
Eight selected concept blocks are 3,5,6,8,15,21,22,23; figures0.
No seed trace path was followed and no other lesson/source text was reopened.

Seed bytes8001; file SHA256:
`07067994c09c0dce6709568820aa33e05a2754e4c1b03a4f9c06470a51cf6c76`.
The supplied seed digest is verified:
`00ffc6dcaaafe67c1c3b5c1ce282ddfb00d4961f49434c4d35804ddb2cb59cd4`.
It hashes the entire seed as UTF-8 JSON with recursively sorted object keys,
preserved array order, compact separators and ASCII-escaped Unicode
(`ensure_ascii=true`), rather than the formatted file bytes.

## Independent Solutions

**1. Definition and purpose.** Acceleration is the vector rate of change of
velocity. It describes how rapidly and in which direction velocity changes
and lets us determine velocity at other times. In general,
`a(t)=dv(t)/dt`; over a finite interval,
`a_avg=[v(t2)-v(t1)]/(t2-t1)`. Its unit is metres/second squared.
For constant acceleration, `v(t)=v(0)+a*t`. The finite difference is not
universally an instantaneous acceleration, and the linear formula requires
constant acceleration.

**2. How it characterizes velocity change.** Instantaneous acceleration
gives the limiting velocity-vector change per unit time; average acceleration
gives total vector change divided by elapsed time. Velocity may change in
magnitude, direction or both. Even constant speed can have nonzero
acceleration when direction changes. Acceleration points along the change
of velocity, not necessarily along velocity. The finite-interval average
does not generally describe the acceleration at every instant.

**3. Speeding up versus slowing down.** For nonzero current velocity in
one-dimensional motion, `d|v|/dt=v*a/|v|`: `v*a>0` means speed increases;
`v*a<0` means speed decreases. Thus same-direction current velocity and
acceleration speed up the body; opposite directions slow it down.
The sign of acceleration alone is insufficient: reversing the axis changes
both signs, not their product. At `v=0`, treat the instant separately.
With constant acceleration opposite the initial velocity, slowing lasts
only until the stop; continued acceleration then reverses velocity and
increases speed. The seed's broader mechanical usage of accelerated motion
includes both speeding up and slowing down.

**4. Uniform acceleration.** The acceleration vector is constant: equal
time intervals have equal vector-velocity increments. Both its magnitude and
direction remain fixed. This does not require increasing speed, positive
axis projection, or merely equal scalar-speed increments. Negative signed
acceleration and stopping/reversal can occur.

**5. Trolleybus.** Choose positive along its motion.
`54 km/h=54*1000/3600=15 m/s`.
From rest with `a=1.5 m/s^2`, `t=(15-0)/1.5=10 s`.
**Result: 10 seconds.**

**6. Braking car, literal unusual unit.** Choose positive along its initial
velocity. The seed says `36 km/s`, not `36 km/h`, hence `v0=36000 m/s`.
`a=(0-36000)/4=-9000 m/s^2=-9 km/s^2`.
**Result: magnitude9000 m/s^2, opposite the initial velocity.**
The signed value is `-9000 m/s^2` in this axis and positive in the reversed
axis. The large value follows the literal seed; no realistic-vehicle or
unit-substitution claim is made.

**7. Truck.** Over the stated increasing-speed interval, choose positive
along its motion. `Delta-v=25-15=10 m/s`.
`t=10/1.6=25/4=6.25 s`.
**Result: 6.25 seconds.**

**8. Half-hour stopping interval.** Treat the fixed stated acceleration as
constant during the given interval, and maximum speed as referring to that
interval. Choose positive along initial motion, so `a=-10 m/s^2`.
`0.5 h=1800 s`; `0=v0-10*1800`, hence `v0=18000 m/s`.
For `0<=t<=1800 s`, `v(t)=18000-10*t` is nonnegative and decreases to zero,
so maximum speed is the initial speed.
**Result: 18000 m/s = 18 km/s = 64800 km/h.**
If `+10` is instead a signed acceleration in the opposite axis convention,
the initial projection is `-18000 m/s`, with the same speed.
No conversion of half an hour to half a second or half a minute is allowed.
If acceleration were variable, or maximum meant all future motion under
indefinitely continued acceleration, a finite global maximum would not be
determined. The answer above is for the seed's stated-interval constant-
acceleration reading, not such a global claim.

## Frozen Evidence

The independently authored per-question source text, derivations, signed
conventions, quantities and qualifications are retained in
[source-solutions.json](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s2-n12/choice-review/source-solutions.json).
This JSON and this report are frozen read-only evidence, not executable
production answer-key artifacts. Their file hashes are returned after
verification. Subsequent option/key comparisons must preserve this freeze.

Two initial hash-check commands exited1: the semantic digest was first
compared to file bytes and then to non-ASCII-escaped compact JSON. These are
retained technical diagnostic failures, not source/math failures; the exact
ASCII-escaped canonical digest subsequently matched. One diagnostic labelled
its representation count48 although its `3*2*2*2` loop checked24; the later
verification and this report correct that count without erasing its history.

New images0; cumulative reviewer images **11/24**; reopens0, payloads0.
Previous failures, costs and image counts remain unchanged; unknown historical
cost remains unknown. No new paid service request was made.
No author views, `author-draft.json`, `answer-keys.json`, internal solutions
or parent source-solutions were accessed. No source/template edit, pipeline
write, DB/deploy/Git write, install, chat/timer/worker creation or promotion.
Only this report and the owned solutions JSON were written.

**Source freeze complete. Wait for the pure-view stage; only after reviewing
all views may internal drafts/keys be received for comparison.**
