# Choice15 Independent Author Source Solution

## Scope And Snapshot

- Role: Codex, independent choice author, not the choice reviewer. This is a new source solve for s15, not reuse of earlier figure-review approvals.
- Book/lesson: `6p / phy6-c3-s15`; selected original questions `1, 2, 3, 4`; selected definition paragraphs `0, 12`; zero seed figures.
- Seed: `.intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s15/seed.json`.
- Seed canonical SHA-256: `c9ab2cefe4b73420dd48c17de590144bf7c7c7d517648e7eebbd072d14926845`.
- Seed byte SHA-256: `056429eaba780cb9e183843f244fbecc5aa389a5bebfe815d8ba7fa28fb2ceea`.
- Current modern lesson byte SHA-256: `ab12b5c1317d957252785505af3362813c3d9214cba141af97a1282845ab022f`.
- Current modern exercises byte SHA-256: `7faf1895ad7862e4d5fdb4a498738f894b2fb75292790dc1ad4e395b7648e9c0`.
- Current modern figures manifest byte SHA-256: `b7032fd20894e3d4c6b9c3d06fe4382a8c27bab65e4d8db906831e11ab7fb828`.
- The seed records the lesson-scoped book digest `d5717fa0b03a7a9c38f69fa69403c54f1bbf3a1c308e4b60dcc37195ca46ee62`; reconstruction is left to structural validation.

Read only the current seed, the authoring/contract skill, the structural checker, repository entry/engineering rules, and the authorized current modern s15 lesson/exercises. No standard answer, answer-key script, previous choice, interaction, peer source solution, or reviewer artifact was read.

Paragraphs 0 and 12 are the only projected definitions. The current authorized lesson additionally explains direction changes in paragraph 11 and deformation in paragraph 13; these were consulted as lesson context, not inserted into the seed as additional definitions. Paragraph 18 mentions force magnitude but supplies no numerical force task here. No figure was needed or opened in this authoring task, and none will be added. Any concrete example supplied below is the author's constructed example, not additional original-book data.

This file is written before the draft or any alternatives are constructed. It contains no candidate-option list or answer key.

## Original 1: Results Of One Body Acting On Another

Source: `（1）一个物体对另一个物体作用的结果是什么？`

The learner must describe possible physical effects, not merely repeat the name of an effect.

Independent solution: the acted-on body's velocity can change, and its shape can change. Starting from rest, speeding up, slowing down, stopping, and changing direction are forms of velocity change. Direction change counts even when speed magnitude is unchanged. Shape change is deformation: the body's parts change their relative arrangement, such as shortening, stretching, or bending. Velocity change and deformation are not mutually exclusive; a struck soft object can move differently and be compressed during the same interaction.

The word "can" matters. The presence of an interaction is not a promise that every body's whole-body velocity and visible shape must both change in every situation. Constraints and other interactions can matter. No equilibrium calculation or numerical force law is needed to answer the source. Nor does moving to another place, by itself, establish a velocity change or deformation.

Conceptual distinction: a change in motion versus a change in internal shape, and possibility versus an unwarranted universal guarantee.

Choice capacity limit: recognition of complete physical claims can assess these distinctions, but cannot prove that the learner can independently formulate a complete explanation of both effects.

## Original 2: Independently Give Velocity-Change Examples

Source: `（2）举出一些说明物体的速度由于受到其它物体的作用而发生变化的例子.`

The learner must independently construct several examples and identify the acting body, the acted-on body, and the actual velocity change. Merely naming a familiar object, force, or motion does not complete this task.

Independent constructed examples:

1. A hand gives an initially stationary toy car a forward push, and the car starts rolling. Acting body: the hand/person. Acted-on body: the car. Change: zero velocity becomes forward velocity.
2. A goalkeeper catches an incoming ball, bringing it to rest. Acting body: the goalkeeper's hands. Acted-on body: the ball. Change: the ball's nonzero incoming velocity becomes zero.
3. A taut rope acts on a small object moving around a circle. Consider an interval in which its speed magnitude is unchanged: its direction is nevertheless continually redirected by the rope. Acting body: the rope. Acted-on body: the small object. Change: direction, even at unchanged speed magnitude.

These are independently derived examples rather than a copied list from the lesson. In each, the interaction and the before/after motion have to be connected. The third does not introduce a numerical orbit or assume a force formula; the stated constant-speed circular interval is an explicit constructed condition.

For contrast, displacement alone is insufficient: a body continuing along a straight line at unchanged speed and direction has changed place, not velocity. A claim of spontaneous speeding up without any other-body action conflicts with projected paragraph 0. Deformation alone likewise does not identify a whole-body velocity change.

Conceptual distinction: an example must exhibit a change in speed magnitude or direction attributable to another body, rather than merely contain a moving object or a change of position.

Choice capacity limit: assessing supplied examples and their causal explanations can preserve the actor/recipient/change reasoning. It cannot verify the source's autonomous example generation, diversity of self-chosen examples, or independently worded explanation. Those production tasks must remain explicitly omitted, not be relabeled as full coverage.

## Original 3: What Is Force?

Source: `（3）什么是力？`

The learner must state the physical meaning of force, using this lesson's definition, and distinguish the cause of a velocity change from the velocity itself.

Independent solution: in the language of projected paragraph 12, saying that a force acts on a body expresses another body's action on it; force is the cause of a change in the body's velocity. This is not a name for the body's existing speed, the distance it has traveled, its mass, or an internal supply that gets used up merely by moving. The lesson's examples also show that force can change the motion of parts and produce deformation.

The projected statement is about a cause of change, not a claim that existing motion always requires a continuing forward push. Paragraph 0 supplies a necessary condition for velocity change, not a rule that a moving body must change velocity. No unit, vector addition rule, `F = ma`, or later lesson definition is required or imported.

Conceptual distinction: cause of changing motion versus possession of motion or speed; changing direction versus only changing speed magnitude.

Choice capacity limit: a substantive causal judgment in a supplied situation is stronger than a term-to-definition click, but it still cannot demonstrate the learner's independently produced definition.

## Original 4: Why Does Force Change Shape?

Source: `（4）为什么物体在力的作用下形状发生变化？`

The learner must explain the mechanism of deformation, not only name compression or say "because there is a force."

Independent solution: a force can change the motion of different parts of a body differently. Their relative arrangement then changes, so the body is compressed, stretched, or bent. In the authorized current lesson's explanation, the rubber ball's different parts have different displacements while being struck, and a loaded board's middle moves farther than its supported ends. Those changes are not a common displacement of every point.

A precise way to express the inference is to track two material points with positions `r_A` and `r_B`. After displacements `d_A` and `d_B`, their separation vector is `(r_B - r_A) + (d_B - d_A)`. A common translation has `d_A = d_B`, so that separation does not change. If two faces approach one another along their joining direction, the distance between them decreases and the body is compressed.

Different absolute displacements alone are not a sufficient universal criterion for deformation: a rigid rotation can give different points different displacement vectors while preserving every interpoint distance and the body's shape. The source's causal explanation concerns different-part motion that changes shape, not a rule that every differing displacement or change of direction must deform the body.

Conceptual distinction: a non-rigid change of relative arrangement versus common translation or rigid reorientation. No elasticity constant, molecular model, density/temperature data, or numerical force law is assumed.

Choice capacity limit: comparing explicit part-motion observations and complete explanations can test the causal inference, but cannot establish that a learner can generate the explanatory chain unaided. The quantitative two-point notation above is the author's explanation, not projected seed data and not a new numerical exercise.

## Authoring Boundary

The four source tasks have now each been solved before options. A later draft may retain their causal and classification distinctions using complete response units, but it must explicitly report the loss of free production, especially question 2's independent examples and question 4's self-constructed explanation. No number of terminology selections or additional near-duplicate questions can recover those omitted capabilities.

Semantic approval belongs to the independent reviewer. This source solve is not a review or a PASS claim.
