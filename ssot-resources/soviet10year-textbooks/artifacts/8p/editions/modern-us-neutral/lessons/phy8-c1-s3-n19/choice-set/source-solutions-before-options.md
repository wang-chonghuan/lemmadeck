# Source Solutions Frozen Before Options

Author-only, offline, first snapshot. This document contains no options or choice
keys. The author independently solved the four selected written tasks from the
current whitelist projection, not from any answer artifact, interaction,
previous choice, test, ticket answer, or text-review calculation.

Seed canonical SHA-256:
`c2a117d021bf9ab97310d46850859bcc44ff4169269a025b3874dc629e5a1fc9`

Source: `8p`, `phy8-c1-s3-n19`, modern-us-neutral edition.
Selected written exercises: `1`, `2`, `3`, `4`.
Selected definition prose indices: `2`, `3`, `4`, `5`, `6` (zero-based).
There are zero source figures. No images were read or created.

## Source 1: Angular Speed and Its Unit

The learner must state what angular speed measures and the unit used to measure
it. In the lesson's uniform circular motion setting, let a radius sweep an angle
phi during an elapsed time t > 0. Angular speed is the angle swept divided by
the elapsed time:

`omega = phi / t`.

When phi is in radians and t is in seconds, the unit is radians per second,
`rad/s`. It measures angular progress per unit time, not distance per unit time.
It is a speed magnitude in this lesson, not an angular-velocity vector or a
signed coordinate derivative. One complete revolution corresponds to `2*pi`
radians. The distinction to reveal is angle/time versus path length/time, with
the corresponding units.

## Source 2: Angular and Linear Speed

The learner must relate the two speeds for a point moving uniformly on a circle
of radius r > 0. Radian measure gives the arc length
`s = r*phi`. Dividing by the same elapsed time yields
`v = s/t = r*(phi/t) = r*omega`, equivalently `omega = v/r`.

With r in metres and omega in rad/s, v is in m/s. If r is in kilometres, v is in
km/s instead. The identity `s = r*phi` requires phi in radians; inserting a
numerical angle measured in degrees into the same identity would need a
conversion factor. Equal angular speed does not generally mean equal linear
speed: at a common omega, v is proportional to r. The distinction is between
rate of turning and rate of travel along the circumference.

## Source 3: Earth's Orbital Angular and Linear Speeds

The learner must calculate both angular speed and linear speed for Earth's
motion around the Sun, with the given orbital radius retained exactly:

`R = 150000000 km = 150000000000 m`.

This is the orbital radius around the Sun, not Earth's physical radius. The
written exercise gives no numerical orbital period. Its complete answer without
inventing a year-length convention is parameterized by the orbital period T.
For the circular, uniform-motion model used in this lesson, one orbit sweeps
`2*pi` radians and covers `2*pi*R`:

`omega = 2*pi/T rad/s`,

`v = (2*pi*150000000)/T km/s = 300000000*pi/T km/s`,

where T is measured in seconds. These are speed magnitudes, not the average
velocity vector over a closed orbit, which would be zero.

For a determinate numerical choice task, declare the added convention visibly:
approximate the orbit as a circle traversed uniformly, take one orbit to last
365 days, and take each day as 24 hours. This is not a period stated by the
source and is not an exact assertion about Earth's real orbit.

Under that convention:

`T = 365*24*60*60 = 31536000 s`.

Therefore:

`omega = 2*pi/31536000 = pi/15768000 rad/s`
`= 1.9923849908611068e-7 rad/s`,

`v = 300000000*pi/31536000 km/s`
`= 29.885774862916602 km/s`
`= 29885.7748629166 m/s`.

To three significant figures these are
`omega ~= 1.99e-7 rad/s` and `v ~= 29.9 km/s`.
Computing circumference divided by T and computing omega times R agree.
Without the visible period convention, the exact parametric result remains
available but a unique numerical answer is not determined by the written data.

## Source 4: Clock-Tower Minute Hand and Watch Comparison

The learner must calculate the linear speed of the tip of a clock-tower minute
hand of length `3.5 m`, then compare its angular speed with that of a watch's
minute hand. Keep the generic clock-tower context; no particular building or
watch radius is needed.

The source relies on the ordinary meaning of a correctly running minute hand.
Declare this visibly for a determinate task: both minute hands turn uniformly,
each making one complete revolution in 60 minutes.

`T_clock = T_watch = 60*60 = 3600 s`.

The clock tip's circumference is
`2*pi*3.5 = 7*pi m`.
Thus its linear speed is

`v_tip = 7*pi/3600 m/s`
`= 0.006108652381980153 m/s`,

or equivalently `7*pi/60 m/min = 0.3665191429188092 m/min`.
To three significant figures the m/s value is `0.00611 m/s`.

Both minute hands sweep the same complete angle in the same time:

`omega_clock = omega_watch = 2*pi/3600 = pi/1800 rad/s`
`= 0.0017453292519943296 rad/s`.

Their angular-speed ratio is exactly `1:1`. Radius affects the tip's linear
speed, not the angular speed fixed by the period. No watch-hand length is given,
so no numerical watch-tip linear speed is determined or requested. The whole
task couples a linear-speed calculation with a radius-independent angular-speed
comparison; neither requested part is deferred.

## Capacity and Scope

All four written tasks have independent solutions above. A choice adaptation
can preserve the definition, unit, radius relationship, both orbital speeds,
the clock tip's linear speed, and the clock/watch angular-speed comparison.
It cannot establish that the learner independently produced the definitions,
algebra, numerical working, or comparison explanation in free writing. Those
production losses must remain explicit internally.

The numerical Earth task adds a disclosed 365-day uniform-circle convention.
The original unspecified-period answer above is not replaced or claimed to have
become uniquely numerical. No numerical watch-tip task is invented.

Next action: record this document's raw SHA-256 and the absence of draft.json
and views-only.json in a uniquely named command receipt. After that receipt,
preserve this first document without amendment and only then construct options.
