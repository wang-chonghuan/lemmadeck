# Choice15 Source-First Review

Stage: all four sources independently solved; awaiting explicit view delivery.
Ticket: STEMROBIN-180. Lesson: phy6-c3-s15. Date: 2026-11-15.
Reviewer: independent continuation reviewer, not Feynman/the choice15 author.

## Input And Isolation

Only `.intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s15/seed.json`
was read as task input. The current ld-s10y-choice skill, semantic review order,
and artifact contract were already read for the preceding source-first stage;
they govern this review without consulting any old choice artifacts.

The seed has four original written questions, selected definition blocks 0
and 12, and no figures. Every exercise `figure_ids`, the concept figure list,
and `figures` are empty. No previously approved image is opened or re-reviewed.
No draft, internal key, standard answer, author plan, key-filling script,
previous choice content, or learner-facing view was read. This document is
choice15-only; no choice16 document was opened, reused, or changed.

Seed byte SHA-256:
`056429eaba780cb9e183843f244fbecc5aa389a5bebfe815d8ba7fa28fb2ceea`

Seed canonical SHA-256 (`sort_keys=True`, `ensure_ascii=True`, compact separators):
`c9ab2cefe4b73420dd48c17de590144bf7c7c7d517648e7eebbd072d14926845`

Trace entries were read as seed metadata only. Their referenced lesson,
exercise, index, and figure files were not opened; trace freshness was not
reconstructed in this restricted stage. These hashes identify the exact seed
solved here, not a completed draft or a refreshed edition validation.

## Definitions And Scope

Block 0 states that an object's velocity can change only through the action
of other objects. It gives a necessary external cause, not the converse claim
that any one force invariably changes the object's overall velocity.

Block 12 describes speaking of a force acting on an object as the physics
description of another object's action, and states that force causes changes
of velocity. Force is not the velocity itself, stored motion, or energy that
an object gradually uses up. Motion does not require a continuing net force;
changing motion does.

In these solutions, a velocity change may involve magnitude, direction, or
both. A selected definition does not enumerate deformation mechanisms; the
mechanism below is independently reasoned from the written question, not
misrepresented as a quote from block 0 or 12.

## Source 1

Written task: What can result from one object acting on another?

Independent solution: The action can change the other object's velocity
(its speed, direction, or both), deform it, or produce both effects. Starting
or stopping is also a velocity change. Deformation means changing the
arrangement of its parts, hence its shape or dimensions.

Concrete examples: A hand pushes a stationary wheeled cart and it starts
moving; the cart's velocity changes. Two hands squeeze a sponge and its
shape changes. Kicking a soft ball can change its velocity while briefly
deforming it during contact.

Scope: These are possible effects, not a rule that every action must visibly
produce both. Other forces may balance the change of overall motion, and a
material's visible deformation depends on its response to the loading.
Equally, observed continued motion by itself is not proof of a net force.

Preserve later: Both motion change and deformation belong to this source
task. Reducing it to "objects start moving" loses slowing, stopping, direction
change, and the deformation distinction.

## Source 2

Written task: Give examples in which an object's velocity changes because
other objects act on it.

Independent solution: Valid examples identify the object whose velocity
changes, another acting object, and the causal before/after change.

- A person pushes a stationary wheeled cart forward. The hands act on the
  cart, which goes from rest to forward motion.
- A person catches a moving ball. The hands act on the ball, reducing its
  velocity until it is at rest relative to the catcher.
- A bat strikes an incoming ball back toward the pitcher. The bat acts on
  the ball and reverses its direction; this is a velocity change even without
  requiring a particular increase or decrease in speed.
- A moving puck slides across a rough floor and slows down. The floor acts
  on the puck through friction; slowing is not the puck spontaneously
  "running out of motion."

These are independently supplied examples, not seed-given scenes or values.
The seed asks for "some examples" but specifies no exact count or numerical
measurement. Two complete examples can satisfy plurality; the additional
examples here demonstrate a range of causal changes, not a mandatory quota.

Scope: A sponge merely changing shape is not by itself an example of the
whole object's changed velocity. Constant straight-line motion alone does
not satisfy this task. An example naming only a moving object without an
acting object and a velocity change is incomplete.

Preserve later: The original asks the learner to generate and explain
examples, not merely name a force or recognize the word "motion."

## Source 3

Written task: What is force?

Independent solution: Force describes the action of one object on another;
such an action can change the object's velocity or deform it. In the
selected definition's own emphasis, force is the cause of velocity change.
It is not motion itself and is not something possessed only by moving objects.

Concrete distinction: A hand pushing a cart is an action described by a
force on the cart. The cart's velocity is its resulting state of motion,
not the force. A hand can also exert a force on a supported object without
making the object accelerate as a whole when other forces balance it.

Scope: No formula, numerical unit, or force magnitude is requested or supplied.
The everyday word "strength" alone does not identify the physical relation.
The word "interaction" does not permit mixing up forces on different objects:
an action on the cart and the corresponding action on the hand have different
recipients. No equal-and-opposite-force law is required by this source.

Preserve later: Include the acting/acted-on relation and its causal role;
do not redefine force as a requirement for maintaining a given velocity.

## Source 4

Written task: Why does an object's shape change under the action of force?

Independent solution: A deforming action changes the motion of different
parts of the object differently. The parts move relative to one another,
altering their mutual distances and arrangement. Those non-rigid changes
of arrangement are what change the object's shape or dimensions.

Mechanism example: Compress a spring between two hands. Its opposite ends
are driven toward each other; the intervening parts move and the coil
spacing/end-to-end distance decrease. The spring becomes shorter even if
its center stays approximately at rest. In a sponge pressed by fingers,
the pressed region moves inward relative to the surrounding regions,
changing the outline.

This connects force, changed motion of parts, relative displacement, and
deformation. "Because force deforms it" simply repeats the observation;
"because its speed changes" alone misses the distinction between whole-body
motion and relative motion within the object.

Scope: Pure rigid translation changes position without changing shape.
Rigid rotation changes orientation, but preserves the internal distances
and is not itself deformation. Force does not guarantee a readily visible
shape change in every object. Deformation can persist after loading stops;
its continuation does not require that all parts keep moving indefinitely.
The seed does not require microscopic forces, a material law, reversibility,
or numerical strain, and none is invented as source data.

Preserve later: A correct recognition of "deformation" must not substitute
for explaining why a non-rigid rearrangement occurs.

## Coverage And Capacity Loss

All four source tasks are solved above; none is omitted. Their distinct
demands are effects of action (1), generation of causal examples (2),
definition of force (3), and the mechanism of deformation (4).

Potential choice-conversion losses, to be checked against the future view:

- Source 2 loses free generation of examples when examples are supplied as
  options. Recognition can still test whether each contains another acting
  object and a real velocity change, but cannot prove independent invention.
- Sources 1 and 3 lose independently formulated explanation/definition and
  the learner's own identification of the acting and acted-on objects.
- Source 4 loses production of the causal chain in the learner's own words.
  Recognizing a complete mechanism may retain the conceptual distinction;
  only identifying a deformation scene or the word "force" would remove
  the essential explanatory task.
- Fixed options constrain the range and diversity of possible valid examples.
  This is a real response-capacity loss, not proof that the physics is wrong.

These are source-first risks, not findings about an unseen draft. Recognition
does not automatically fail fidelity, but losses must be explicit. Merging
sources 1/3 or 1/4 requires substantive coverage of each demand, not just shared
terminology. Separate visible questions must be checked for one question's
definition or mechanism directly revealing another question's answer.

No option set or author key has been seen, so no complete true set, option
truth, misconception derivation, redundancy judgment, or choice-package
verdict is issued here. After explicit view delivery: inspect fidelity,
redundancy and leakage first, then independently solve every visible option;
only subsequently compare author reasoning and internal keys.

No source-solving blocker or first failure has been found in the allowed
input. Later first failures must be preserved, not normalized to author keys.
This document is not choice approval or structural/freshness validation.
Only choice15 `source-first.md` was created; choice16 remains isolated.
No author artifact, image, DB, Git, application, service, or dependency action
was performed.
