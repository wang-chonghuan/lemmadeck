# D006 independent source solutions

Status: source-only blind solving complete for n16 questions 1-5 and t17
exercises 1-10. Conditional answers and unresolved source conventions are
recorded below; this is not approval of any modern question or choice set.

Workspace: `/Users/yong/.codex/worktrees/00b1/lemmadeck`.
All input paths below are relative to that root. Hashes are SHA-256 of actual
file bytes, not canonical JSON digests.

## Input bindings

| Path | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n16/exercises.json` | `71d3b099b3f85197eab45da22192910f1fd6be75f215433a82216ba12d6a3f97` |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-t17/exercises.json` | `6541a28b750ad5764437f84ebf3ec9197da8e58e5d47261b373ebdd1859949a2` |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n16/lesson.json` | `52ac16b24115579da906cfbb0f5a3cf05ccda07e73717e78d2bb422dbf67bb52` |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n11/lesson.json` | `a620bdca5341c787c221e3a71de583ea59dd5cbc0856849f2add8eb633bb82a0` |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/lessons/phy10-c1-s2-n14/lesson.json` | `9974abbf557e63394062532d36a9acc43c769ffee98321c55f7bea26402dee76` |
| `ssot-resources/soviet10year-textbooks/artifacts/10p/figures/fig-23.png` | `90fa1c6d9b59556484fb95347a125ee440ced0b0a72c8bd82c532825df12e63e` |

Definition context, not a repeated source-fidelity review:
n11 `/prose/2`-`/prose/5` (`p0036#5`-`p0037#1`) supplies oscillator energy
and speed amplitude; n14 resonance definitions/conditions at `/prose/0`,
`/prose/5`-`/prose/6`, `/prose/9`, `/prose/12`-`/prose/13`,
`/prose/15`, `/prose/17`-`/prose/18` span `p0040#5`-`p0042#7`;
n16 `/prose/0`, `/prose/2`, `/prose/5`-`/prose/7`
(`p0044#5`-`p0045#3`) supplies energy-source, escapement and self-oscillation
definitions. Earlier passed prose/pixel evidence is retained, not re-gated.
No old choices, answer files, new author drafts or author keys were consulted.

## Models and conventions

- Spring results use a Hookean, effectively massless spring and the stated
  oscillating mass, with negligible resistance and no periodic external drive.
  A vertical spring's equilibrium shift does not change its linear frequency.
- Pendulum results use a point bob, fixed support, inextensible effectively
  massless string, constant local gravity and small angular amplitude.
  Mass independence holds in this ideal model, not for every real oscillator.
- Frequency $\nu$ counts full cycles in Hz; angular frequency is
  $\omega=2\pi\nu$ in rad/s. Amplitudes are nonnegative magnitudes.
  Signed velocity and accumulated distance are different quantities.
- Real sustained motion needs energy input to balance losses. Ideal undamped
  free motion needs no continuing input, but this is not a source of usable
  unlimited energy. Clock conclusions also require an unchanged escapement and
  unchanged counting of cycles; clock calibration is not automatic.

## Actual fig23 observation

Opened the complete original `fig-23.png` with the image tool (320 x 338 px).
It shows a concave bowl cross-section, a small solid quadrilateral block on the
left inner slope, and an upper dot with a diagonal line labelled $R$ terminating
with an arrowhead at the left bowl surface. In conjunction with the exercise,
this is the bowl's curvature-radius construction. The block is not a ball;
there is no rolling symbol, block-radius dimension, amplitude mark or separate
motion arrow. The radius arrow is not a direction-of-motion arrow. No modern
figure, geometry reconstruction or figure approval was involved.

## n16 questions

### 1. Recognize an observed resonance

Source: n16 `/exercises/0/text`, `g1`, `p0046#3`.

A possible example is a window panel whose vibration becomes particularly large
when a nearby periodic excitation approaches one of its natural frequencies.
To justify resonance, identify the vibrating system, the periodic energy source
and the frequency-selective increase in response; merely hearing a rattle or
seeing movement does not establish resonance. This is an illustrative candidate,
not a claim that I personally observed an event.

Open capacity: the original asks the learner to recall, select and explain an
observation. Recognition of a supplied example cannot demonstrate that production.

### 2. A 0.005 N force on the spring-return door

Source: n16 `/exercises/1/text`, `g1`, `p0046#4`.

The intended resonance answer is conditional: a tiny force can produce a large
opening if applied repeatedly with suitable timing so that its net work is
positive, while losses remain sufficiently small. An ideal linear undamped door
driven at its natural frequency accumulates energy; its amplitude grows rather
than approaching a finite resonant steady amplitude. The energy comes from the
agent applying the force, not from resonance itself. Force direction/timing must
follow the motion appropriately; a bidirectional door permits motion on both
sides of equilibrium.

A constant 0.005 N force is a different problem. With the same effective lever
arm in a linear restoring model, its static displacement is $10^{-4}$ of that
requiring 50 N. It cannot hold that reference opening; a small displacement can
still occur. Starting from rest, simply maintaining this constant force does not
create resonant accumulation. The force values do not specify the inertia,
opening angle, full spring law, damping or required time.

Unresolved source convention: the question does not explicitly prescribe periodic
application or define how far "open" means. Ignoring hinge friction alone does not
exclude air resistance or other losses. Preserve the resonance interpretation
with explicit assumptions; do not make an unconditional real-door guarantee.
Open capacity: propose the timing method and explain cumulative work versus
static force balance, not merely answer yes/no.

### 3. When resonance is most pronounced

Source: n16 `/exercises/2/text`, `g1`, `p0046#5`.

For comparable forcing amplitude and coupling, weak damping produces a high,
narrow response peak near the natural frequency. The excitation must couple to
the relevant mode, be appropriately tuned and persist long enough to build the
response. The weakly damped displacement peak need not be exactly at the
undamped natural frequency. At exactly zero damping and exact linear resonance,
there is no finite steady peak amplitude.

Open capacity: explain the damping/frequency/work relationship; frequency
equality alone, with no coupling or energy input, is insufficient.

### 4. New examples of self-oscillating systems

Source: n16 `/exercises/3/text`, `g1`, `p0046#6`; exclusion list:
n16 `/prose/2`, `/prose/5`, `p0044#8`-`p0045#1`.

Two admissible examples, with their operating assumptions:

- A continuously bowed string in a sustained stick-slip regime. Steady bow motion
  supplies energy; sticking and slipping depend on the string's relative motion,
  rather than on an externally prescribed periodic bow motion.
- A DC-powered LC feedback oscillator. An amplifier supplies energy from the DC
  source in a phase set by feedback from the oscillating circuit; gain limiting
  establishes an operating amplitude at which input balances resistive loss.
  An unpowered LC circuit alone would instead undergo free oscillation.

Do not reuse pendulum/balance-wheel clocks, the interrupter bell, organ pipes,
whistles, heart or lungs, which the source already lists. Examples require a
working energy source and self-regulation, not a name-only assertion that anything
periodic is self-oscillating. These are model-based examples, not newly researched
historical or experimental claims.

Open capacity: invent/select additional examples and explain both energy source
and feedback; a finite supplied list does not demonstrate generating examples.

### 5. Self, forced and free oscillation

Source: n16 `/exercises/4/text`, `g1`, `p0046#7`; definitions
`/prose/0`, `/prose/6`-`/prose/7`, `p0044#5`-`p0045#3`.

Free oscillation follows an initial disturbance without continuing driven energy
input: its ideal frequency is determined by the system, its initial amplitude
and phase by initial conditions, and real losses cause decay. An ideal lossless
free oscillator need not decay, so persistence alone does not define self-motion.

Forced oscillation has externally imposed time-dependent forcing; in the
single-frequency linear steady-state case, the response frequency is the driving
frequency and amplitude depends on forcing, frequency, coupling and damping.
Its transient also depends on initial conditions.

Self-oscillation uses a continuing energy supply and state-dependent feedback,
without an externally imposed periodic timing signal. In a stable operating
regime the sustained amplitude/frequency are selected by the system and supply
parameters; input work balances dissipation. With weak perturbation/loss its
frequency may be near the natural frequency. Independence from the initiating
impulse describes convergence within a stable regime, not all possible systems,
start-up thresholds or competing attractors. A clock's weight/spring supplies
energy and its escapement meters that energy according to the pendulum's motion.

Open capacity: compare energy supply, timing control, transients and amplitude
selection together; a universal "free decays, self never decays" contrast is wrong.

## t17 exercises

### 1. Spring stiffness

Source: t17 `/exercises/0/text`, `g0`, `p0046#9`.

$m=100\ \mathrm{g}=0.100\ \mathrm{kg}$ and $\nu=2\ \mathrm{Hz}$ give
$\omega=4\pi\ \mathrm{rad/s}$. From $m\ddot x=-kx$,
$k=m\omega^2=1.6\pi^2\ \mathrm{N/m}\approx15.8\ \mathrm{N/m}$.
Use the spring model above, not $k=m\nu^2$.
Capacity: infer the model, distinguish frequencies and convert mass units.

### 2. The source's 98 m pendulum

Source: t17 `/exercises/1/text`, `g0`, `p0046#10`.

$T\approx2\pi\sqrt{98\ \mathrm{m}/g}$. If explicitly adopting
$g=9.8\ \mathrm{m/s^2}$, $T\approx2\pi\sqrt{10}\ \mathrm{s}
\approx19.87\ \mathrm{s}$, about 20 s. Gravity is not numerically specified in
the question; another stated approximation changes the rounded answer.
The named location/clock and 98 m are source attribution, not newly validated
history. Interpret 98 m as the effective simple-pendulum length, not the size of
an arbitrary physical pendulum. Capacity: choose and state the model and gravity
convention rather than imply a context-free exact number.

### 3. Two pendulum lengths

Source: t17 `/exercises/2/text`, `g0`, `p0046#11`.

For exact complete-cycle counts over the same duration $\tau$,
$10T_1=6T_2=\tau$, hence $T_1/T_2=3/5$ and
$l_1/l_2=9/25$ under common gravity and small-angle conditions.
The faster first pendulum is shorter: $l_2-l_1=16\ \mathrm{cm}$.
Thus $l_2=25\ \mathrm{cm}$ and $l_1=9\ \mathrm{cm}$.
These labels must not be reversed. Mere integer counts of crossings over an
arbitrary interval would not establish the exact period ratio.
Capacity: combine cycle-count and length relations, identify the longer pendulum
and solve for both labelled lengths.

### 4. Move the pendulum to the Moon

Source: t17 `/exercises/3/text`, `g0`, `p0046#12`.

Using the supplied ratios and the spherical surface-gravity model $g=GM/r^2$,
$g_M/g_E=(1/81)(3.7)^2=13.69/81$. For unchanged length,
$T_M/T_E=\sqrt{g_E/g_M}=9/3.7\approx2.43$.
The period increases by a factor of about 2.43, not by 81 or 9.
Ignore rotation/altitude/tidal corrections; use the supplied approximate body
ratios rather than substitute external data. Bob mass cancels.

If extended to a pendulum clock with unchanged cycle counting and escapement,
it runs slower: indicated time per real elapsed time is $T_E/T_M=3.7/9$.
That clock consequence is conditional, not a promise that an arbitrary mechanism
continues to operate on the Moon. Capacity: derive gravity from both mass and
radius before deriving the period ratio.

### 5. First arrival: pendulum or falling ball

Source: t17 `/exercises/4/text`, `g0`, `p0046#13`.

Let the string length be $l$. Released from rest at a nonzero small angle, the
pendulum first reaches equilibrium after
$t_p=T/4\approx(\pi/2)\sqrt{l/g}$.
The other ball starts from rest at the support, falls the vertical distance $l$
and arrives after $t_f=\sqrt{2l/g}$.
Since $\sqrt2<\pi/2$, the freely falling ball arrives first;
$t_p/t_f\approx1.111$.
Use a stationary support, negligible air resistance, point-sized balls and the
same gravity. Release from rest fixes the turning-point phase; zero initial angle
would be a degenerate different problem. Do not compare the pendulum's arc length
with the falling distance as though both motions had constant acceleration.
Capacity: determine first-arrival times from two different motion laws.

### 6. Distance in 2 s

Source: t17 `/exercises/5/text`, `g0`, `p0046#14` -> `p0047#1`.

Release from rest at a 1 cm displacement gives $A=1\ \mathrm{cm}$.
There are $\nu t=5(2)=10$ complete cycles, each with path length $4A$.
Thus $s=40\ \mathrm{cm}=0.40\ \mathrm{m}$.
Net displacement after these cycles is zero, not the distance traveled.
Negligible damping keeps amplitude constant; an additional initial velocity would
change the inferred amplitude. Capacity: infer amplitude/initial phase and sum
the path through all cycles.

### 7. Velocity amplitude and signed projection

Source: t17 `/exercises/6/text`, `g0`, `p0047#2`.

Read the supplied equation with its units as
$x(t)=(5\ \mathrm{cm})\cos[(2\pi\ \mathrm{s^{-1}})t]$.
Differentiating gives $v_x(t)=-(10\pi\ \mathrm{cm/s})\sin(2\pi t)$.
Therefore the velocity amplitude is $10\pi\ \mathrm{cm/s}\approx31.4\
\mathrm{cm/s}$. At displacement phase $5\pi/6$,
$v_x=-10\pi\sin(5\pi/6)=-5\pi\ \mathrm{cm/s}\approx-15.7\ \mathrm{cm/s}$.
This phase is the cosine displacement phase, not the shifted velocity phase.
The amplitude is positive; the projection is negative.
Capacity: differentiate with units, extract a magnitude and evaluate a signed
projection at the stated phase; all three operations must survive adaptation.

### 8. Angular frequency, energy and speed amplitude

Source: t17 `/exercises/7/text`, `g0`, `p0047#3`.

$m=0.200\ \mathrm{kg}$, $k=16\ \mathrm{N/m}$,
$A=0.020\ \mathrm{m}$.
$\omega=\sqrt{k/m}=\sqrt{80}\ \mathrm{rad/s}\approx8.94\ \mathrm{rad/s}$;
$E=\tfrac12 kA^2=0.0032\ \mathrm{J}$;
$v_{\max}=\omega A\approx0.1789\ \mathrm{m/s}$.
The same energy equals $\tfrac12 m v_{\max}^2$.
Assume the stated spring-mass system is Hookean and lossless on the horizontal
surface; the source gives no friction coefficient or driving force.
Capacity: retain all three requested quantities, convert both mass and amplitude,
and connect force-law dynamics with conserved mechanical energy.

### 9. Sliding block in the spherical bowl

Source: t17 `/exercises/8/text`, `g0`, `p0047#4`; actual fig23 inspected above.

In the small-block point-sliding idealization, let $\theta$ be displacement from
the bowl bottom. Tangential gravity gives
$mR\ddot\theta=-mg\sin\theta$. For $|\theta|\ll1$,
$\ddot\theta+(g/R)\theta\approx0$, hence
$T\approx2\pi\sqrt{R/g}$.
Mass cancels; the bowl's normal force constrains the path and does no work in this
ideal model. There is no rolling moment-of-inertia correction.

Unresolved source convention: frictionlessness alone does not imply small
amplitude. With arbitrary amplitude, the $\sin\theta$ equation is nonlinear and
the period depends on the turning angle, which the question does not supply.
The finite block's center-of-mass path/contact geometry is also not dimensioned;
using $R$ for its path radius assumes its size can be neglected. Do not promote
the approximate period to an exact arbitrary-amplitude or finite-block law.
Capacity: translate the actual curved sliding constraint into a restoring-force
model and state the approximation; do not silently replace the block with a
rolling ball or use an invented object radius.

### 10. Repeated bumps and suspension resonance

Source: t17 `/exercises/9/text`, `g0`, `p0047#6` + `p0047#8`.

With spacing $d\approx8\ \mathrm{m}$ and steady speed $v$, the bump encounter
period is $d/v$. Matching it approximately to the suspension's free period
$T_0=1.5\ \mathrm{s}$ gives
$v\approx d/T_0=5.33\ \mathrm{m/s}=19.2\ \mathrm{km/h}$.
This is the intended weak-damping, dominant repeated-bump-frequency resonance
estimate. It assumes approximately regular spacing, adequate coupling and enough
successive bumps for a response to develop. Real damping, bump shape/harmonics
and multiple vehicle modes can shift or add peaks; spacing and one free period
do not determine an exact real-vehicle maximum.
The energy is supplied through vehicle/road interaction, not created by
resonance. This is a textbook estimate, not a driving or safety recommendation.
Capacity: construct the driving frequency from speed/spacing, match periods and
retain the approximation and unit conversion.

## Retained limits for later blind review

The source-only starting point covers all 15 tasks without options or author
keys. The door's forcing protocol and the bowl's small-amplitude/point-block
convention require explicit handling in later written/visible questions; the
98 m numerical period requires a stated gravity convention. Open observation,
example generation and explanatory comparison in n16 cannot be certified by a
numerical key or silently reduced to factual recognition. No modern written
text, visible choices, author rationale, answer key, pipeline or publication
gate has been reviewed in this stage.
