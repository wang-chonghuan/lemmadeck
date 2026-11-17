# STEMROBIN-180: b58 Independent Source Solve

State: SOURCESOLVEONLY COMPLETE / FIRST / HOLD.
Lesson: phy8-c1-s3-n19, modern-us-neutral, exercise group g1 (Exercise 14).
This is a frozen independent baseline, not an author-answer review verdict,
choice review, answer artifact, acceptance gate, or publication authorization.

## Boundary and First Freeze

Repository: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.
The three authorized inputs were hashed before their content was read. The
freeze was recorded at `2026-11-17T15:59:17+00:00`. Each byte buffer was checked
against its frozen SHA-256 before parsing that same buffer.

Source directory:
`ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s3-n19/`.

| Input | Frozen SHA-256 |
| --- | --- |
| lesson.json | b005c52e350e3160689a9ecb7224cf859a626679c1c810e024afc2a9236f2996 |
| exercises.json | 06e26a9b921a11bf1e74dae0ea5c62127b50b79e60b6291c5f977127a67f97ef |
| figures.json | 0e2d6dc8d14ceb327cd367164b5180b7ab987cbb951f4d25a39d29f4963fb064 |

All three top-level objects say `status: ready`. `exercise_count`, `count`,
and the exercise array agree on four written tasks. The lesson figure list,
the edition figure list, and all four exercises' figure/reference lists are
empty. ZERO images were opened, needed, or produced.

Authority is the top-level modern-edition prose and exercise `text`, not the
nested provenance's old wording or embedded source hash. Provenance embedded
in these authorized JSON buffers was visible; no separately stored historical
file was opened.

No author answers, old answers, choices, interactions, tests, candidate choice
drafts, or text-review calculations were read. No backend, Git, DB, services,
setup, freshness capability, repair, prepare, finalize, or gate was used.
Existing work was left untouched. Writes are confined to this new report and
`.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-independent-solve/`.

## Relevant Definitions and Conditions

Use positive speed magnitudes, with angles accumulated during the elapsed
time rather than reduced modulo one revolution.

1. Uniform circular motion: equal elapsed times correspond to equal swept
   central angles. The radius to the moving point rotates at constant angular
   speed; this is also called the point's angular speed.
2. Angular speed: `omega = phi/t`, or `Delta phi/Delta t` for an interval.
   With angle in radians and time in seconds its unit is `rad/s`.
3. Arc length and radian measure: `phi = l/r`, hence `l = r phi`, for a
   circular arc of radius `r > 0`.
4. Linear speed: `V = l/t`, with unit `m/s` when length is in metres and time
   in seconds. In uniform circular motion this is the magnitude of the
   instantaneous tangential velocity, not a fixed velocity vector.
5. Relation: `V = omega r` and `omega = V/r`. The form without a conversion
   factor assumes radians and consistent length/time units.
6. One revolution sweeps `2 pi rad = 360 deg`. If `n` is revolutions per
   second, `omega = 2 pi n` in `rad/s`; `n` is frequency in `s^-1` (Hz).
   A count of turns during an arbitrary interval must first be divided by
   that interval; turns per minute must be divided by 60 for SI.
7. Period: `T` is time for one revolution. Thus `T = 1/n = 2 pi/omega`,
   `omega = 2 pi/T`, and `V = 2 pi r/T`.

Radian measure is dimensionless in dimensional analysis, so the dimensions of
angular speed are inverse time; `rad/s` retains the angular meaning. A number
in Hz normally describes cycles per second and cannot replace the same
numerical value in `rad/s`: the factor `2 pi` matters. Degrees per second are
a valid alternative angular unit if labelled, but then
`V = omega_deg (pi/180) r`, not simply `omega_deg r`.

These are circular, fixed-radius, uniform-motion results. For nonuniform
motion an interval ratio gives average angular speed, and the instantaneous
speed relation uses the instantaneous angular speed. Constant linear speed
does not mean constant velocity direction: the direction is tangent to the
circle and changes as the point moves.

## Exercise 1: Definition and Unit

Full task (p0096#5): What is angular speed? In what unit is it measured?

Independent solution:

Angular speed in uniform circular motion is the angle swept by the radius to
the point divided by the time taken to sweep it:

```text
omega = phi/t.
[omega] = rad/s when phi is in radians and t is in seconds.
```

Both requested parts are essential: the swept-angle/time definition and the
unit. "Angle swept per unit time" is equivalent; it must not be replaced by
distance/time, which defines linear speed. `deg/s` is physically valid when
explicitly labelled and converted, but the source's stated standard answer
unit is `rad/s`. No numerical substitution is requested or possible from the
task's data.

## Exercise 2: Relation Between the Two Speeds

Full task (p0096#6): What is the relation between angular speed and linear speed?

Independent derivation:

```text
phi = l/r                 (radians; r > 0)
omega = phi/t
      = l/(r t)
      = (l/t)/r
      = V/r.
Therefore V = omega r.

Unit check:
(rad/s) * m = m/s, since rad is dimensionless.
```

Here `r` is the distance from the rotation centre to the particular moving
point, and `V` is its linear speed magnitude. Equivalent reciprocal forms
are valid. At the same radius, `V` is proportional to `omega`; at the same
angular speed, `V` is proportional to radius. Equal angular speed alone does
not imply equal linear speed. At the rotation axis the speed is zero, but
`V/r` cannot be used there. No specific numerical data are supplied.

Grading limit: merely saying "proportional" without identifying the radius or
holding it fixed loses the condition that makes the claim true. An expression
using degrees without the radian conversion factor is not the same relation.

## Exercise 3: Earth's Orbit

Full task (p0096#7): Calculate Earth's angular speed and linear speed as it
moves around the Sun. The orbital radius is 150000000 kilometres.

### Model and Ordinary Period Convention

Use the lesson's idealization: uniform circular orbital motion with the
given radius. One orbit is one year. The exercise does not state the year in
seconds or prescribe precision. For the primary solution take the ordinary
school approximation `1 year = 365 days`, with
`1 day = 24 h`, `1 h = 3600 s`, and `1 km = 1000 m`.
The day conversion defines the duration unit; it does not turn the orbital
period into one day.

### SI Substitution

```text
r = 150000000 km
  = 150000000 * 1000 m
  = 1.5 * 10^11 m.

T = 365 * 24 * 60 * 60 s
  = 31536000 s
  = 3.1536 * 10^7 s.

omega = 2 pi/T
      = 2 pi/(31536000 s)
      = 1.9923849908611068 * 10^-7 rad/s
      approximately 1.99 * 10^-7 rad/s.

V = omega r
  = (1.9923849908611068 * 10^-7 rad/s) * (1.5 * 10^11 m)
  = 29885.7748629166 m/s
  approximately 2.99 * 10^4 m/s.
```

Independent path-length cross-check:

```text
l_one_orbit = 2 pi r = 9.42477796076938 * 10^11 m.
V = l_one_orbit/T
  = (9.42477796076938 * 10^11 m)/(31536000 s)
  = 29885.7748629166 m/s.
```

Concrete equivalent units:

```text
V = 29885.7748629166 / 1000
  = 29.885774862916602 km/s
  approximately 29.9 km/s.

V = 29.885774862916602 * 3600
  = 107588.78950649977 km/h.

omega = 360 deg/(31536000 s)
      = 1.1415525114155251 * 10^-5 deg/s
      = 360/365 deg/day
      approximately 0.98630137 deg/day.
```

### Period, Rounding, and Grading Limits

A declared `365.25-day` year is also a reasonable ordinary approximation
for this exercise, not a different radius or a different type of motion.
Treat it as an explicit alternative duration convention, not an unstated
extra datum:

```text
T = 365.25 * 86400 = 31557600 s.
omega = 2 pi/31557600
      = 1.991021277657232 * 10^-7 rad/s.
V = (2 pi/31557600) * 1.5 * 10^11
  = 29865.31916485848 m/s
  = 29.86531916485848 km/s.
```

Both conventions give `1.99 * 10^-7 rad/s` and `29.9 km/s` at three
significant figures. At two significant figures the pair is
`2.0 * 10^-7 rad/s` and `3.0 * 10^4 m/s` (or `30 km/s`).
More displayed calculator digits are evidence, not precision warranted by
the word problem.

If a learner uses `pi = 3.14` consistently, the 365-day result is
`1.991374936580416 * 10^-7 rad/s` and `29870.62404870624 m/s`
(`29.87062404870624 km/s`). With 365.25 days and `pi = 3.14`, it is
`1.990011914721018 * 10^-7 rad/s` and `29850.17872081527 m/s`.
These explain small rounding differences without changing the derivation.

Do not require a single last decimal, invent a universal numeric tolerance,
or reject a correctly stated standard year/pi approximation. Exact
expressions in the chosen period are valid. If future blind options differ
only at precision not fixed by this stem, uniqueness may be unresolved;
that is a future ambiguity check, not a present choice verdict.

Do not silently use 360 days, a month, or 24 hours as the orbital period.
Do not substitute an external refined orbital radius for the supplied
150000000 km. The unit conversion is `1.5 * 10^11 m`, not
`1.5 * 10^8 m`. Both requested quantities, with their respective units,
must be given. `V` is tangential speed, not the displacement-based average
velocity over a whole orbit, which is zero in the ideal closed-circle model.
Actual variable-radius orbital dynamics and a specific calendar date are
outside the lesson's idealization and are not needed to solve the task.

## Exercise 4: Clock-Tower Minute Hand and Watch Comparison

Full task (p0096#8): A clock tower's minute hand is 3.5 metres long. Find
the linear speed of its tip. Compare this minute hand's angular speed
with that of a watch's minute hand.

### Conditions and Full Speed Calculation

Assume normally running clocks and the uniform-motion idealization of the
lesson. The length is the pivot-to-tip radius. A minute hand completes one
revolution in one hour, not one minute:

```text
r = 3.5 m.
T = 60 min = 60 * 60 s = 3600 s.
n = 1/3600 s^-1.

omega_tower = 2 pi/T
            = 2 pi/(3600 s)
            = pi/1800 rad/s
            = 1.7453292519943296 * 10^-3 rad/s.

l_one_turn = 2 pi r
           = 2 pi * 3.5 m
           = 7 pi m
           = 21.991148575128552 m.

V_tip = l_one_turn/T
      = (7 pi m)/(3600 s)
      = omega_tower * 3.5 m
      = 0.006108652381980153 m/s
      approximately 6.11 * 10^-3 m/s.
```

Unit conversions, explicitly using the same speed:

```text
V_tip = 0.006108652381980153 * 100
      = 0.6108652381980153 cm/s
      approximately 0.611 cm/s.

V_tip = 0.006108652381980153 * 1000
      = 6.1086523819801535 mm/s
      approximately 6.11 mm/s.

V_tip = 0.006108652381980153 * 60
      = 0.3665191429188092 m/min.

V_tip = 0.006108652381980153 * 3600
      = 21.991148575128552 m/h.

omega_tower = 0.10471975511965978 rad/min
            = 6 deg/min
            = 0.1 deg/s.
```

With two significant figures, matching the stated 3.5 m,
`V_tip approximately 6.1 * 10^-3 m/s = 0.61 cm/s = 6.1 mm/s`.
Using `pi = 3.14` instead gives `V_tip = 0.006105555555555556 m/s`
and `omega_tower = 0.0017444444444444445 rad/s`. The tip speed rounds
to the same two- or three-significant-figure values above. Angular speed
is `1.7 * 10^-3 rad/s` at two significant figures with either pi choice,
but at three figures it is `1.74 * 10^-3 rad/s` with pi = 3.14 and
`1.75 * 10^-3 rad/s` with full pi. This last-digit boundary must not
be mistaken for different minute-hand periods.

### Required Watch Comparison

A normally running watch's minute hand also completes exactly one turn per
hour in this model. Therefore:

```text
T_watch = T_tower = 3600 s.
omega_watch = 2 pi/3600 rad/s = omega_tower.
omega_tower/omega_watch = 1.
```

The angular speeds are equal because the periods are equal, regardless of
hand lengths. Radius affects linear speed, not angular speed when the period
is fixed. No watch length is supplied, so its tip's numeric linear speed is
not determined by this task. If its length is r_watch, then
`V_watch = (2 pi/3600) r_watch`; its tip is slower than the tower's only
under the additional condition `r_watch < 3.5 m`. Equal angular speeds
must not be presented as equality of the two tip speeds.

### Grading and Interpretation Limits

The full task requires BOTH the tower tip's linear speed with units AND the
watch/tower angular-speed comparison with the common-period reason.
Calculating the tower's angular speed is a useful intermediate and fixes
the comparison quantitatively, but it is not a substitute for the tip speed.
Accept exact `7 pi/3600 m/s` and consistent rounded or converted equivalents.

The minute hand is not a second hand: using `T = 60 s` makes both computed
speeds 60 times too large. `3.5 m` is a radius, not a diameter. `3600 s`
must accompany SI `rad/s` and `m/s`; using a denominator of 60 is valid
only if the output time unit remains minutes. Metres/second and
centimetres/second differ by 100.

For a real stepping mechanism, the computed value describes the mean
traversed-arc speed over a turn; instantaneous speed during pauses/jumps
would need extra mechanism information. That is not the intended uniform
minute-hand model and supplies no basis to claim the two devices have
different uniform angular speeds. The tangent direction changes; zero
average displacement per full turn is not zero tip speed.

## Reproduction, Seal, and Stop

The newly authored arithmetic-only script reads no repository files and
imports no third-party dependencies. Reproduce the explicit substitutions
from the repository root:

```sh
node .intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-independent-solve/solve.mjs
```

Freeze metadata is in the same directory's `input-sha256.json`.
`SHA256SUMS` seals this report, that metadata, and the arithmetic script
with SHA-256; it deliberately excludes itself to avoid a self-reference.
Verify only those newly owned artifacts from the repository root:

```sh
shasum -a 256 -c .intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-independent-solve/SHA256SUMS
```

The report, metadata, arithmetic script, and seal are made read-only after
sealing. A SHA-256 seal is tamper-evident content identity, not a claim of
unmodifiable storage or product acceptance. The seal's own hash is returned
to the parent separately. Do not rewrite this independent baseline during
later comparisons.

STOP / HOLD: independent source solve only. No author-review verdict has
been reached. No future files have been inspected. The next permissible
input is ONLY a parent-supplied blind choice view before keys, and only
after that a separately supplied new answer for comparison. No follow-on
work or proactive file discovery is authorized by this report.
