# FIRST independent SOURCE-answer solve

Ticket: STEMROBIN-180. Book: 8p. Lesson: phy8-c2-s2-n42.
Reviewer: same chat, fresh bounded FIRST independent reviewer r180.
This is a newly derived solution of all three WHOLE questions, not a review of
an old transcription, a textbook answer, or somebody else's answer key.
It was written before reading any figure-author solution, inventory, report,
specification, or native evidence, and before opening any image.

## Authority and scope

Original tasks: `n42-inputs/raw/exercises.json` (three exercises, group g1).
Semantic authority: `n42-inputs/exercises.template.json` (the three approved
modern questions). Current approved prose: `n42-inputs/lesson.template.json`.
These paths are relative to the parent evidence root, not publication paths.
The original question 2 is underspecified; its approved prompt supplies the
vacuum-only versus atmospheric-stage distinction. That distinction is used,
not changed or submitted for another text review.

Each answer below is an open explanatory reference solution: `source: derived`,
`grading: ungraded`. There are no numeric expected values, invented coefficients,
speed thresholds, universal drag laws, or automatic grading rules.
All three original and modern exercise figure references are empty. No answer
image is necessary; zero answer images were read or produced.

## Question 1: bicycle pedal force at a greater steady speed

**Reference solution.** The additional resistance is air drag. In still air,
the bicycle and rider moving faster relative to the ground also move faster
relative to the air. For the same rider, bicycle, posture and the comparison
range in the question, the opposing air drag increases with relative speed.
Rolling resistance and transmission mechanical resistance are approximated as
unchanged here, not asserted to be constants under all conditions.

At each maintained steady speed the bicycle is not accelerating, so the drive
must balance the resistances. Pedal force has an effective tangential component
that creates crank torque; the fixed gearing transmits that torque to the driven
wheel. Expressed as equivalent resisting forces at the wheel, the drive must
supply the air-drag resistance, rolling resistance and the equivalent mechanical
loss. Since the last two are approximately unchanged and air drag is larger,
the required driving torque is larger. With the same gear and crank geometry,
the required effective pedal force is therefore larger.

Here "effective pedal force" means the useful torque-producing component,
averaged over pedaling as appropriate, not every instantaneous foot-force
component. Mechanical losses are accounted for in the drive torque; they are
not misidentified as an extra external horizontal force on the complete rider
and bicycle system. At the whole-system level, the horizontal road-contact
traction balances external drag and rolling resistance at steady speed.

The tire does not normally slide on the road. Its static contact friction
provides traction and adjusts to the demand, within the available grip. It is
not a fixed-magnitude sliding-friction force that must be overcome. Thus the
original informal statement about wheel-ground friction must not be read as
fixing static tire friction.

Force is not power: a rider can deliver more power merely by pedaling faster
at the same effective force. That observation alone cannot explain why a
greater force is required. The answer here is the greater opposing air drag
and the resulting steady-state drive-torque balance. No particular linear or
square-law dependence is required to answer the question.

**Limits and convention.** Horizontal road, still air, unchanged posture and
gearing, steady rather than accelerating motion, and the stated approximation
for rolling/mechanical resistance are essential to this comparison. A changed
gear, wind, slope, posture, tire condition or acceleration can change the
required pedal force; those are not the comparison in this question.

## Question 2: vacuum-only spacecraft AND atmospheric launch rocket/fairing

### Spacecraft flying only in airless space

**Reference solution.** No: it does not need to be streamlined *for reducing
air resistance*. In the stipulated vacuum there is no surrounding air to
produce aerodynamic drag, so that reason for streamlining is absent. Merely
moving fast through vacuum does not create air drag.

This does not say that the craft has no forces, that it cannot accelerate,
or that every shape is equally useful. Thrust, gravity, structural integrity,
thermal control, instruments and other mission requirements can constrain its
shape. A craft contained within a launch fairing is a different exposure
condition from the exterior of that fairing.

### Exposed launch rocket and fairing crossing the atmosphere

**Reference solution.** Yes, aerodynamic shaping is useful during their
atmospheric stage. The exposed rocket and fairing move relative to air and
therefore encounter air drag. A suitably streamlined external shape, oriented
for the intended oncoming flow, can reduce drag and associated aerodynamic
loads compared with an unsuitable shape. The propulsion then has less drag
to overcome under otherwise comparable conditions.

The exterior is not designed for drag alone: payload enclosure, strength,
flight stability/control, heating, and the changing flow regime also matter.
The answer is not a claim that one shape minimizes drag in every atmospheric
condition or in all phases of flight. Once outside appreciable atmosphere,
the air-drag reason no longer applies. A spacecraft that enters or re-enters
the atmosphere must be considered separately; aerodynamic and heat-protection
requirements can favor a blunt protective shape rather than a universally
pointed "streamlined" craft.

**Coverage.** These are the two requested cases in one whole exercise, with
the vacuum condition explicitly not extended to atmospheric entry or launch.

## Question 3: ordinary tractor doing low-speed field work

**Reference solution.** At the stipulated low working speed and modest
relative wind, air drag is normally a comparatively small part of the
tractor's resistance and work demands. Reducing it by making the whole tractor
streamlined usually offers less practical benefit than meeting the principal
requirements of the job.

The tractor needs adequate traction to pull implements and overcome soil/work
loads, stable operation on uneven ground, cooling airflow for its engine and
systems, and a practical arrangement for implements, visibility, access and
maintenance. Its form is therefore chiefly chosen for those duties rather
than making reduction of air drag the foremost styling objective.

This is a priority comparison, not an assertion that air drag is zero, that
tractors cannot have aerodynamic detailing, or that streamlining has no effect
on them. High travel speed or strong relative wind could make aerodynamic
considerations more important. Neither such case establishes the claim for
the ordinary low-speed field tractor specified here.

## FIRST SOURCE-answer solve approval

PASS for completeness and physical reasoning of these independent reference
solutions: all three whole questions, including both cases of question 2.
This approves this FIRST solve only. It does not approve any downstream final
answer-key file, interaction file, course gate, edition text, official figure
review, promotion, publication or producer finalization. Existing HOLDs,
failures, corrections, technical bootstrap/missing-document errors and all
prior revision/image/paid-call usage remain in force without reset.
