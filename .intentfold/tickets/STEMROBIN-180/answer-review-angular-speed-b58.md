# STEMROBIN-180: b58 Written-Answer Review

Phase: independent post-choice written-answer comparison, 2026-11-17.
Lesson: 8p / phy8-c1-s3-n19 / modern-us-neutral.
Semantic outcome: PASS for the exact disclosed draft below.
Concrete defects requiring revision: NONE.

## Exact Snapshot and Review Order

Repository: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

Reviewed candidate:
`ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s3-n19/answer-keys.json`.

```text
Candidate file-byte SHA-256:
0e93bce39806916d68dd8f29a77e6daa621148134ed469f13f8477f811f3e5a6

Independent original-task baseline:
.intentfold/tickets/STEMROBIN-180/answer-source-angular-speed-b58.md
8454b4f8548459c1748c0ef5a5f5a7b12594145460650fc751cd26cc1ed70824

Immutable blind FIRST:
.intentfold/tickets/STEMROBIN-180/tmp/choice-blind-angular-speed-b58.md
3ef6d8b9c4cee13f2be4345b18dc13532b219509838285b6a289993cdfe2e556

Frozen seed used only for exact prompt comparison:
.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/seed.json
25634f22c4777f12fa7e4c190370f4eb2a30e40c5e650648bf3a598a81661184
```

The answer candidate was first opened ONLY after the formal choice review
and durable choice-review record had been created and set read-only.
Its bytes were hashed and compared to the parent's explicitly disclosed
SHA-256 before the same buffer was parsed and its answer text displayed.
The candidate remained at that hash during the subsequent comparison.

Both independent baselines are reused unchanged. No original source file
was reopened, no source-solving script was rerun, and no image was loaded.
This is a comparison against the previously sealed solution, not a solve
derived from the newly disclosed answer.

## Completeness and Data Fidelity

The candidate identifies the correct book, lesson, and edition and contains
exactly the four answers for exercises 1, 2, 3, and 4. Each prompt exactly
matches its frozen seed exercise text. This establishes which tasks are
being reviewed, not semantic correctness by structure alone.

All four `displayAnswer` texts and their notes were read in full.
The actual answers supply every original ask. `grading: ungraded` and empty
`parts` do not omit work here: the explanatory display answers contain the
definition, derivation, numeric results, and requested comparison.
No automatic grading capability is claimed.

All `figureEvidence` arrays are empty. The original task and choice
snapshot have zero figures. `historical_entities` arrays are empty and the
clock-tower prompt is generic; no historical building name is restored.

## Exercise 1: Angular Speed and Unit

Result: PASS.

The display answer defines angular speed as swept angle divided by the
time taken in uniform circular motion, explicitly supplies
`omega = phi/t`, and states radians per second when angle is in radians
and time is in seconds. Both requested parts are answered.

This agrees with the sealed definition and does not confuse angular speed
with path length/time or an angular-velocity vector. The note correctly
rejects substituting a bare formula or number for the complete explanation.
No numeric substitution is requested by this conceptual task.

## Exercise 2: Relation of Angular and Linear Speed

Result: PASS.

The display answer explicitly requires radian measure, uses
`l = r phi`, and gives the full same-interval derivation:

```text
V = l/t = r*(phi/t) = omega*r,
omega = V/r.
```

It identifies r as the circular radius and V as linear-speed magnitude.
Its units are consistent: rad/s times metres gives m/s, with radian measure
dimensionless for the length calculation. The circular-motion context
supplies a positive radius, so the reciprocal form is applicable.

The result and conditions agree with the sealed original solution.
The explanatory note retains the derivation/unit context rather than
reducing the task to matching an isolated symbol string.

## Exercise 3: Earth's Orbital Speeds

Result: PASS; both explicitly declared ordinary year conventions are valid.

### Data and Primary 365.25-Day Convention

The candidate retains the supplied radius:

```text
r = 150000000 km = 1.5e11 m.
```

It openly approximates the orbit as a circle within this uniform-circular-
motion lesson and chooses one year approximately equal to 365.25 days.
The corresponding duration is correctly stated as 31557600 seconds.
It does not claim the original question specified this numerical period.

The sealed 365.25-day baseline and the candidate's displayed rounding agree:

| Quantity | Previously sealed value | Candidate display | Comparison |
| --- | --- | --- | --- |
| Period | 31557600 s | approximately 31557600 s | Correct stated convention |
| Angular speed | 1.991021277657232e-7 rad/s | approximately 1.991e-7 rad/s | Correct four-significant-figure rounding |
| Linear speed, SI | 29865.31916485848 m/s | approximately 2.987e4 m/s | Correct four-significant-figure rounding |
| Linear speed, km/s | 29.86531916485848 km/s | approximately 29.87 km/s | Correct four-significant-figure rounding |

The candidate supplies `omega = 2 pi/T` and both equivalent speed forms
`V = omega*r = 2 pi*r/T`; both requested quantities and the common-period
reasoning are therefore present. The metre-to-kilometre speed conversion is
division by 1000. The displayed SI and km/s numbers represent the same speed.

### Explicit 365-Day Alternative

The candidate also states that estimating one year as approximately 365 days
gives approximately `1.992e-7 rad/s` and `29.89 km/s`. Against the already
sealed 365-day baseline:

```text
T = 31536000 s.
omega = 1.9923849908611068e-7 rad/s -> 1.992e-7 rad/s.
V = 29885.7748629166 m/s
  = 29.885774862916602 km/s -> 29.89 km/s.
```

Both rounded alternative values are correct. The original task prescribes
neither a numerical year length nor result precision, so this declared
convention is not a disagreement or a grading failure.

The choice stem explicitly fixes 365 days and three significant figures,
where its unique pair is `1.99e-7 rad/s` and `29.9 km/s`.
The written answer explicitly selects 365.25 days and shows four figures,
while retaining the valid 365-day alternative. These are consistent
adaptations of the original task, not candidates requiring normalization to
one hidden exact numerical key. At three significant figures, both ordinary
year conventions give the same choice pair.

The candidate's note correctly preserves this rounding/convention latitude.
No refined external orbital radius, actual dated orbit calculation, or
displacement-based zero average velocity is substituted for the requested
orbital speed magnitude.

## Exercise 4: Clock Tip and Watch Comparison

Result: PASS.

The answer preserves the generic clock tower and the given 3.5 m
pivot-to-tip radius. It uses the ordinary normally running minute-hand period:

```text
T = 1 h = 3600 s.
One tip revolution traverses 2 pi*3.5 = 7 pi m.
```

The exact expression, SI result, conversion, and angular speed all agree
with the sealed original solution:

| Quantity | Previously sealed value | Candidate display | Comparison |
| --- | --- | --- | --- |
| Tip speed, exact | 7 pi/3600 m/s | 7 pi/3600 m/s | Identical |
| Tip speed, SI | 0.006108652381980153 m/s | approximately 0.006109 m/s | Correct four-significant-figure rounding |
| Tip speed, mm/s | 6.1086523819801535 mm/s | approximately 6.109 mm/s | Correct multiplication by 1000 and rounding |
| Angular speed, exact | pi/1800 rad/s | 2 pi/3600 = pi/1800 rad/s | Identical |
| Angular speed, decimal | 0.0017453292519943296 rad/s | approximately 0.001745 rad/s | Correct four-significant-figure rounding |

The answer explicitly reasons that both normally running minute hands sweep
`2 pi` in the same hour, hence their angular speeds are equal. This answers
the second original ask rather than merely supplying the tower tip's speed.
Its final sentence correctly distinguishes the effects of different hand
lengths: linear tip speeds differ at fixed omega, but angular speeds do not.
No watch radius or numeric watch-tip speed is fabricated.

The note correctly warns that the tip-speed number alone is insufficient
for the original full task. The source does not prescribe a significant-
figure rule; the consistent four-figure approximations are not a defect
merely because the given radius is printed as 3.5 m.

## Findings and Boundary

Actionable defects: NONE.
Unresolved task/data/unit/arithmetic/reasoning issues: NONE.
Necessary candidate edits: NONE.

This judgment rests on the actual four explanatory answers and comparison
with the independent sealed SI/arithmetic/reasoning baseline, not on JSON
shape, grading labels, or a successful structural tool.
It is scoped to the exact draft SHA above, with declared approximations.
No automated grader, learner-facing payload, deployment, or publication has
been evaluated or authorized.

Only the three requested review outputs were newly written in this phase:
formal choice `review.json`, durable choice review, and this durable answer
review. No candidate or existing source/blind artifact was edited.
No validate/finalize/prepare/gate, source solve replay, image, Git, shared DB,
publisher, app, service, or dependency operation was used.

This report is sealed read-only after writing, with its SHA-256 returned
outside the file. The original independent solve and blind FIRST retain
their original exact bytes.
