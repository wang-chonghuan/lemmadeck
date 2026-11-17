# D029 n39 Independent Working Solutions

Author-only frozen work, completed before either answer-keys.json draft exists.
No answer-key, input, choice, answer-box or interaction artifact was used as a
solution source. This is not an independent review of the resulting answer keys.

Scope: six original written questions, lesson phy10-c1-s5-n39, book 10p,
edition modern-us-neutral, current native EN display-root and ZH root.
Native exercise IDs are the strings "1" through "6"; book metadata declares
lesson-scoped numbering. Both locales preserve source numbers, group g1 and the
same source-page anchors p0112#4 through p0112#9.

Native preparation ran separately with isolated author-owned --root and --work.
Canonical 10p/answers.json contains 39 captured entries and zero n39 matches.
All six solutions are derived, with no bookRaw or fabricated book-answer citation.
Every key will remain draft, grading ungraded, with an empty native-required
parts array and no judging candidates or interactions. Gate 2 semantic review,
native finalize, binding and publication are not performed by this author.

## 1. What Is a Wave?

In this mechanical-wave chapter a wave is the propagation of an oscillation or
disturbance through an elastic medium. Elastic coupling makes a displaced
particle act on its neighbor, so neighboring particles begin to oscillate in
sequence. The propagating object is the disturbance, not one particle traveling
all the way through the medium.

The approved n38 paragraphs p0108#4 and p0108#5 provide the mechanism: the first
ball deforms the spring, the next ball follows with delay, and the disturbance
passes along the chain. This definition must not be reduced to "a vibration":
one isolated oscillator need not create a propagating wave.

## 2. Transverse and Longitudinal Waves

Compare the direction of particle vibration with the direction of propagation,
not one particle's instantaneous velocity with another particle's.

A transverse wave has particle oscillations perpendicular to propagation. A
side-to-side disturbance traveling along a stretched cord is a concrete example;
the n38 ball model displaced sideways to its chain is another.

A longitudinal wave has particle oscillations parallel to propagation. Pushing
and pulling a spring along its length produces traveling compressions and
rarefactions. Sound in air is another example: air particles oscillate back and
forth along propagation while pressure disturbances travel. The n38 Figure 71
description p0108#7/p0109#3 supplies the axial spring-and-ball model.

Use these unambiguous examples rather than describing all water-surface waves
as purely transverse; surface-particle motion can include a longitudinal
component. The answer must include both orientations AND concrete examples.

## 3. Basic Characteristic of Wave Motion

An outgoing mechanical wave transports the disturbance and energy through the
medium without sustained bulk transport of the medium's mass. Each particle
oscillates about its own equilibrium position rather than following the wave
along the medium.

In the n38 elastic chain, deforming a spring stores elastic potential energy.
Its force does work on the next ball, transferring energy into that ball's
motion and the next spring's deformation. The excitation therefore reaches
successive balls, although those balls remain local oscillators.

This answer is about energy/disturbance transport, not merely the two
periodicities discussed later in n39. It must not claim particles are stationary
or that all real waves forbid every possible drift. The no-bulk-transport
statement is for the small-amplitude ideal mechanical-wave model used here.

## 4. Wavelength

Wavelength lambda is the distance along propagation between the nearest
distinct points vibrating in the same phase. In-phase particles repeat the
same vibration state together; equal displacement at a single instant is not
enough if their directions of motion differ.

For a periodic transverse profile this can be measured crest to nearest crest.
For a periodic longitudinal wave it can be measured compression to nearest
compression. In the current n39 model, balls 1/13, 2/14 and 3/15 are nearest
in-phase pairs in the reached wave region (p0110#4).

Distances here are measured along the undisturbed chain/propagation axis, not
the length of the wavy connector or a slant distance between displaced centers.
Exclude zero separation and larger integer multiples by saying nearest
distinct in-phase points.

## 5. Speed and Wavelength

During one period T, the periodic wave pattern advances by one wavelength
lambda. Hence

v = lambda/T = lambda nu, with nu = 1/T.

This is the propagation speed of the wave, not the instantaneous transverse or
longitudinal velocity of an individual particle. At a fixed frequency, speed is
proportional to wavelength. When the medium fixes the wave speed, increasing
frequency instead shortens the wavelength; do not claim wavelength alone
determines speed without fixing frequency.

Current n39 p0111#2/p0111#3 supplies both relations, applicable to transverse
and longitudinal waves.

## 6. Adjacent-Ball Phase Difference in Figure 70

First inspect actual pixels independently of any answer draft:

- Three image opens in batch 1: current approved SVG upper and lower regions,
  and the original PNG. No further opens.
- Modern SVG SHA256:
  4bae69e25800526c2b16adca5af0d6c71bb013159e240e6d4474e72cd15fba9f.
- Current FigureSpec SHA256:
  dcdf95bb6d3e4b47e184400c369efc376947e9eed77432423cd4c5f0bb4f1e36.
- Original PNG SHA256:
  8cf1965d548aad41c46aa2a6c77017789a078b1aab470306ce9ecdd96bb75d65.
- EN and ZH approved SVG/Spec are byte-identical.
- Panel e gives lambda from ball 1 to ball 13: count 13 - 1 = 12 adjacent
  equilibrium intervals, not 13 balls as 13 intervals.
- Panel f's given spans 2/14 and 3/15 independently show the same count.

The current FigureSpec's propagation-axis positions give adjacent spacing
d = 166 - 110 = 56 drawing units and lambda = 782 - 110 = 672 drawing units.
Only the ratio is physical; these are not an added metric length calibration.
Thus d/lambda = 56/672 = 1/12.

For the harmonic traveling wave, phase changes by 2 pi over a wavelength:

|Delta phi| = 2 pi d/lambda = 2 pi/12 = pi/6 radians = 30 degrees.

The same result follows from the propagation time between adjacent balls:
Delta t = d/v = (lambda/12)/(lambda/T) = T/12, so
|Delta phi| = 2 pi (Delta t/T) = pi/6.
Along propagation the next ball lags the preceding ball by this amount.

The six panels are T/4 apart in time; each such advance covers THREE adjacent
intervals, not one. A panel-to-panel time separation is not an adjacent-ball
phase difference. The initially unreached stationary tail has not yet entered
the oscillation, so do not assign its balls this steady traveling-wave phase.
State the concrete magnitude for adjacent balls once both are vibrating.

Cross-check: balls 1 and 7 span six adjacent intervals, so their phase difference
is 6 times pi/6 = pi (antiphase); balls 1 and 13 span twelve intervals, giving
2 pi (in phase). Both checks match the current approved n39 prose and pixels.

## Frozen Status

All six working solutions are complete before drafting. This document will be
hashed in solution-freeze.json before the native answer-key files are created.
It will not be edited after that freeze. The independent reviewer must review
the eventual EN and ZH draft bytes; this author's work is not self-approval.
