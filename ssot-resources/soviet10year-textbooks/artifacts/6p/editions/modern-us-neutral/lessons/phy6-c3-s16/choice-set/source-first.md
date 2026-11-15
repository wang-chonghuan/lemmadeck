# Choice16 Source-First Review

Stage: independent source solving complete; awaiting explicit pureview authorization.
Ticket: STEMROBIN-180. Lesson: phy6-c3-s16. Date: 2026-11-15.
Reviewer: independent continuation reviewer, not the choice author/Feynman.

## Input And Blindness

Only the active seed and these current normative files were read in this stage:

- `.intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s16/seed.json`
- `.agents/skills/ld-s10y-choice/SKILL.md`
- `.agents/skills/ld-s10y-choice/references/review.md`
- `.agents/skills/ld-s10y-choice/references/contract.md`

The seed contains exactly four written questions, definition blocks 9 and 10,
and no figures. All exercise `figure_ids`, `source.concept_figure_ids`, and
`figures` are empty. No figure review is repeated or required for this seed.
The reviewer previously saw this lesson's physics prose during independent
figure review; that prior exposure is disclosed, not claimed absent. No choice
draft, author plan, internal key, key-filling script, answer key, previous
choice content, or pureview has been read. A path-only seed lookup exposed
other seed filenames, not their contents.

Seed byte SHA-256:
`258d21c0fb97324fab537112650b49d9e6e724d2682342625b8c783ceae0603b`

Seed canonical SHA-256 (`sort_keys=True`, `ensure_ascii=True`, compact separators):
`5f877357574fc2c0999202755751b0460e0ae29d992fa2602ee3b2ede79dae59`

The seed's trace records were read only as metadata. Their referenced edition
files were not opened and freshness reconstruction has not been run in this
restricted stage. The hashes above bind the actual seed solved here, not a
claim that its trace was independently refreshed.

## Selected Definitions

Block 9 defines gravity as the force with which Earth attracts an object.
The definition identifies the attracting body and the attracted object; it
does not define gravity as mass, pressure on a support, or friction.

Block 10 states direct proportionality between an object's gravitational force
and its mass: a mass ratio of n gives the same force ratio; equal masses have
equal gravitational forces. Comparisons are understood in the same local
gravitational conditions. This is not a claim that the proportionality
coefficient is identical at all locations, altitudes, or celestial bodies.

## Source 1

Written task: Why does a horizontally thrown stone not move along a straight line?

Independent solution: After release, Earth continues to attract the stone.
That downward gravitational force changes its velocity, giving it an increasing
downward component while it continues moving horizontally. Its direction
therefore changes and its trajectory curves downward instead of remaining a
straight horizontal line. The causal point is Earth's attraction changing the
motion, not the continuing action of the thrower's hand.

Scope: This is the ordinary near-Earth throw described by the seed, not a
measured trajectory. No launch speed, flight time, range, or equation is given.
In the idealized negligible-air-resistance case, horizontal velocity is
constant and the downward component increases; an exact parabola is not
required to answer the written task. Merely saying "the stone slows down" or
"it runs out of the throwing force" does not establish the downward curvature.

Preserve for later review: Require the relation between downward attraction
and change of direction, not simply recognition of the word "curve."

## Source 2

Written task: What force keeps objects at Earth's surface?

Independent solution: Earth's gravitational attraction draws objects toward
Earth and accounts for their remaining near its surface rather than departing
freely from it. By block 9, this force is called gravity.

Scope: Gravity is the requested attracting force. This answer does not assert
that gravity is the only force on an object resting on a surface or that the
net force on such an object must point downward. A resting supported object's
upward support force can balance gravity. Nor does gravity alone guarantee
that every object stays motionless at the surface under arbitrary conditions.

Preserve for later review: Distinguish attraction toward Earth from support,
friction, air pressure, or an undefined "force of the ground." A support force
explains why an object does not pass through its support, not Earth's attraction.

## Source 3

Written task: What force is called gravity?

Independent solution: The force with which Earth attracts an object is called
gravity. This is exactly definition block 9, including the roles of Earth and
the object.

Scope: In this lesson, the requested term denotes Earth's attraction on the
object. The object's reciprocal attraction on Earth is not the same force
acting on the object. Mass is not a force, and an object's force on a support
is not this definition. No numerical value or formula is needed.

Preserve for later review: Retain the definition's attracting agent and target;
do not silently substitute a broader ambiguous force description.

## Source 4

Written task: What relation holds between the gravitational force on an object
and its mass?

Independent solution: In the same local gravitational conditions, the
gravitational force is directly proportional to mass. Write `G = k*m` with
the same positive coefficient `k` for the compared objects. For positive
masses, `G1/G2 = m1/m2`. Doubling the mass doubles the force; halving the mass
halves the force; equal masses have equal gravitational forces in those
conditions. These are deductions from block 10, not extra given measurements.

Scope: Direct proportionality means a constant force-to-mass ratio, not merely
"larger mass usually means larger force." It is neither inverse proportionality
nor dependence on the object's shape/material at fixed mass and conditions.
The seed supplies no numerical coefficient, units, object masses, or force
values, so none should be invented as original data. This relation is not a
free-fall speed comparison and does not imply heavier objects accelerate more.

Preserve for later review: Retain the same-factor comparison and equal-mass
consequence, with the same-gravitational-conditions assumption.

## Package Baseline

All four source tasks have independent solutions above; no task is omitted.
Source 1 asks for a cause of curved motion; source 2 identifies attraction in
a surface phenomenon; source 3 defines gravity; source 4 states proportionality.
Sources 2 and 3 naturally share a force name but ask different questions.
A later split or merge needs a task-based justification, and separately
displayed questions must be checked for direct cross-question answer leakage.
Definitions 9/10 and rationale revealed by another question can become cues;
their mere presence in the internal seed is not learner-facing leakage.

Choice conversion may assess explanation recognition without demonstrating
independent written production. That capacity loss must be recorded; it does
not automatically invalidate a faithful recognition task. No judgment about
actual redundancy, coverage, option truth, or leakage is possible before views.

Next authorized sequence: explicit pureview delivery, then source/view fidelity,
redundancy and leakage checks plus blind solving of every visible option and
the complete true sets; only after that, author-internal-key comparison.
No option IDs, correct sets, author misconception claims, or choice verdicts
are recorded at this source-only stage.

No failure has been observed in the allowed source-solving input. This is not
a choice-package PASS or a structural-validation result. Any first failure
found later must be retained, not overwritten to agree with an author key.
Only this `source-first.md` was created; no author artifact, DB, Git, application,
service, dependency, or figure was changed.
