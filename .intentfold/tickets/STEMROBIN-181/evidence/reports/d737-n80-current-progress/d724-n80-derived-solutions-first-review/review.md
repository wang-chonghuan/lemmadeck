# d724 Independent First Text-Only Review

Ticket: STEMROBIN-181
Card: phy10-c2-s2-n80
Review date: 2026-11-18
Verdict: FAIL -- scoped mathematical/bilingual explanatory-construction review only.
Whole-card approval: NOT GIVEN.
Images opened/generated/rendered: 0/0/0.

## Scope And Independence

Sole checkout: `/Users/yong/.codex/worktrees/00b1/lemmadeck`.
Every shell invocation used that explicit working directory.
Reviewed tasks: 2-7, 9-12. Tasks 1 and 8 remain FIGURE-DEPENDENT-PENDING;
no generic answers for them were supplied or approved.

Read the answer skill, gate 2 and production-resume instructions. Independently
derived expectations from the frozen defining lesson/exercise text and d703
Chinese/English exercise prose before reading d720 solutions. No old choices,
answer-key files, source images, modern images or FigureSpecs were consulted.
Only this report was authored. No candidate edits, native finalization,
canonical writes, meter changes, Git commands, backend/DB access, paid calls,
new agents, freshness operations, other chats or whole tests were performed.

The user's offline review authorization overrides the skill's normal publishing
default. This report is not a native answer-key gate receipt or a release decision.

## Blocking Findings

### [P1] Task 11: The Proposed Chief Rays Coincide

Location: d720 `solutions.json`, lines 84-86; both display languages.

The distance calculation is correct for a real source at its source-side focal
point of a diverging lens, but the construction is not. A focal point is already
on the principal axis; it is not an optional "if" case. The axis-parallel ray
from this point and the ray through the optical center are the same axial ray.
Their backward extensions cannot locate a unique image. The focus-directed
special ray is degenerate too. The final suggestion to use a nearby non-axis ray
does not specify its refracted direction, so a child still cannot construct it.

Required correction in BOTH languages: identify the actual source-side focal
point, keep the point on the axis, explicitly explain the coincident special
rays, and specify a nondegenerate paraxial construction. With focal-length
magnitude a > 0, choose a small nonzero height y on the lens. A ray from the
source (-a,0) reaches (0,y) with slope y/a. The diverging lens adds y/a to that
slope, so the outgoing slope is 2y/a. Its backward extension meets the axis at
(-a/2,0). A second ray through a different small lens height must back-project
to the same point. Actual outgoing rays diverge; the image is virtual.

Side qualification: either physical focal point can contain a real luminous
source, but the illumination direction must then be chosen from that source
toward the lens. Mirroring the arrangement still gives a/2 on the source side.
Do not hold a left-to-right propagation convention fixed and treat a real source
on the far side as a virtual object. A virtual object at the far focal point for
that fixed direction is a different premise (collimated output), not this task.
No off-axis luminous source or numerical focal length is authorized.

### [P2] Task 4: The Requested Diagram Has No Construction Instructions

Location: d720 `solutions.json`, lines 40-42; both display languages.

The explanation, motion toward the film and ideal-model loss of portrait focus
are correct. However, the exercise expressly asks for a diagram. The display
answers only state image-plane conclusions; they do not tell the learner what
rays or intersections to draw. The private monotonicity formula does not fill
this construction gap.

Required text-only correction: describe a converging lens, its axis and fixed
film plane; take one off-axis point on the person and one on the farther forest.
For each point draw an axis-parallel ray refracting through the far focus and a
ray through the optical center. The person's pair meets on the film; the forest
pair meets between lens and film, then spreads into a spot at the film. Describe
moving the lens toward the film until the forest intersection lies on it; the
person's pair then meets beyond the film. Retain the depth-of-field qualification.
This is a requirement for prose instructions, not permission to open/create images.

### [P2] Task 12: English Side Error And Incomplete Tilted-Arrow Construction

Location: d720 `solutions.json`, lines 91-92.

The Chinese tail position is correct, but English says "on the opposite side
of the axis." The image tail is ON the axis and on the opposite side of the LENS,
not on an opposite side of the axis. This is a geometric bilingual mismatch.

Both languages also say only to use "two special rays" for the arrow's points,
without naming their paths. That is insufficient standalone construction
coverage. For the off-axis tip, name the parallel-to-axis ray refracting through
the far focus and the undeviated optical-center ray; intersect them to find its
image. The axial tail is already determined by the 2F conjugacy: mark it at 2F
on the far side of the lens. Its usual special rays coincide, so do not pretend
that those coincident rays independently locate it. Join image tail to image tip.

Retain the valid existing qualification that all object points must lie outside
the source-side focal plane for the whole arrow to have a finite inverted real
image. Retain dependence on the actual drawn arrow; do not invent an upward,
downward, toward-lens or away-from-lens orientation. Only the tail has specified
2F conjugacy; do not infer equal size or a single 2F image plane for the whole
tilted arrow.

## Independent Task Checks

Notation here: u > 0 is real object distance; v is signed image distance
(positive for a real image); F is signed focal length. For a diverging lens,
write F = -a with a > 0. These are explanatory variables, not extra source data.
The defining frozen lesson describes angular magnification for a magnifier;
task 10 instead asks for the projected image's linear magnification.

| Task | Scoped Result | Independent Check And Bilingual Assessment |
| --- | --- | --- |
| 2 | DATA-HOLD correctly retained | Literal d = 1.25 cm, l = 2.4 cm and millimeter divisions are preserved. The imaged ruler-segment length is absent. Its missing value cannot be inferred from mark spacing. Both displays correctly explain the missing datum without supplying a numeric focal length. |
| 3 | TEXT-CONTENT-OK | In ideal lens imaging, each object point sends rays through the uncovered aperture: the whole image retains location/size but is dimmer. No unsupported exact half-brightness claim. Both languages agree and give the mechanism. |
| 4 | FAIL-CONSTRUCTION | For u > F > 0, v = Fu/(u-F); dv/du = -F^2/(u-F)^2 < 0. The forest is farther away, so its real image is nearer the lens. Move lens toward film to focus forest; person is out of exact focus. Correct calculation/qualifications in both languages, but required ray-construction instructions are absent. |
| 5 | TEXT-CONTENT-OK | Water reduces the refractive-index contrast at the cornea and hence its converging power; correct retinal focus is difficult. An air layer in the mask restores that boundary. Both languages match, with no invented numerical indices or unrelated mechanism. |
| 6 | TEXT-CONTENT-OK | 0 < u < F gives v = -Fu/(F-u), with upright magnification -v/u = F/(F-u) > 1. Virtual image is on source side and farther from lens than object. Both displays give the actual two rays and backward extensions, plus screen limitation. |
| 7 | TEXT-CONTENT-OK; readability note | A converging lens's inside-focus virtual image is enlarged, so the reduced image here is real. v/u = 1/5 gives v = 9/25 m = 0.36 m; F = uv/(u+v) = 3/10 m = 0.30 m. Both displays are numerically correct. |
| 9 | TEXT-CONTENT-OK for explicitly stated real off-axis construction | All three ray rules are correct: parallel ray back-projects through near focus; ray aimed toward far focus exits parallel; center ray is undeviated. For u > 0, v = -au/(u+a), so the virtual image lies on source side between lens and near focal plane. Both displays accurately state this general off-axis domain; no actual figure was claimed inspected. |
| 10 | TEXT-CONTENT-OK; readability note | 1/u = 1/0.25 - 1/2 = 7/2 per meter; u = 2/7 m. Linear magnification magnitude is v/u = 7, with signed transverse magnification -7. Both displays correctly distinguish magnitude and inversion; no angular-magnification substitution. |
| 11 | FAIL-CONSTRUCTION | 1/v = -1/a - 1/a = -2/a gives v = -a/2. Both numerical/symbolic conclusions agree, but both prescribe coincident chief rays and leave the needed non-axis outgoing direction unspecified. |
| 12 | FAIL-CONSTRUCTION-AND-EN-GEOMETRY | Tail: u = 2F, v = 2F, on axis on the far side of lens. For each actual off-axis point at distance u > F and height y, v = Fu/(u-F), y_image = -Fy/(u-F). Thus position and transverse scaling vary with its actual distance. Existing conditional real/inverted statement and refusal to invent tilt are sound; English side relation and standalone construction need correction. |

Task 2 algebra audit: d720 introduces h ONLY as an explicitly unknown actual
segment length, without assigning it a value. Independently, |m| = l/h = v/d
gives F = d*l/(h+l). Its expression "3/(h+2.4) cm when h is expressed in cm"
is the same relation using the unknown length's numerical measure in centimeters,
not evidence for h. The child displays correctly omit a fictitious numerical
answer. Do not replace h with one millimeter, one centimeter, a guessed count of
divisions, or a changed unit for d or l. The source-data hold is not an author
mathematics failure and does not invalidate independent tasks.

Task 12 construction audit: the transformation maps a straight arrow segment
to a straight segment as long as it does not cross the focal plane. Because
u differs along a tilted arrow, the 2F rule for the tail alone does not make
the entire image same-sized. If an actual point reaches u = F, its image is at
infinity; if an actual portion has u < F, that portion has a virtual image.
The word "short" supplies no numerical endpoints in this text-only evidence.
Use the actual drawn geometry and retain the outside-focus condition.

## Child Readability

Tasks 3, 5, 6 and 9 give understandable causal or construction content, although
technical vocabulary can be simplified: e.g. "water bends the rays less at the
front of the eye" alongside refractive index, and "light spreads at an aperture"
alongside diffraction. These are nonblocking editorial notes, not extra physics.

Tasks 7 and 10 have correct working in the private derivation field but mostly
results in the student-facing displays. Nonblocking recommendation in BOTH
languages: show v = 1.8/5 and F = uv/(u+v) for task 7; show
1/u = 1/F - 1/v and |m| = v/u for task 10. Define the displayed symbols.
A child should not have to infer the ratio-to-image-distance step or the
thin-lens arithmetic from a statement that the formula "gives" the result.

Blocking readability failures are the unspecified construction operations in
tasks 4, 11 and 12, not merely terminology. Task 11 especially must not tell the
child to intersect two identical lines.

## Gate 2 And Evidence Limits

Exercise identities, source numbers, group IDs, page references and figure
references for the ten reviewed tasks match the frozen source. Both d703 source
snapshots match the actual frozen `exercises.json` object and its SHA-256.
The scoped Node assertion/rational-arithmetic command exited 0. It independently
checked v7 = 9/25 m, F7 = 3/10 m, u10 = 2/7 m and |m10| = 7 exactly, unique
records for the reviewed tasks, and the retained task 2 / tasks 1 and 8 holds.

Applicable semantic gate points: identity/source separation, actual mathematical
derivation and student-facing explanation/construction. Gate 2 point 6 fails for
tasks 4, 11 and 12. No bookRaw or old key was used.

Native answer-key schema, parts, expected input, grading declarations, MathLive
editing, finalize/publish and full-lesson acceptance were NOT tested or approved.
The d720 file is a derived-solutions draft, not a finalized key. Construction
tasks must not be hard-auto-graded merely to obtain coverage. Task 2 remains
DATA-HOLD; tasks 1 and 8 remain pending actual authorized figure review.

## SHA-256 Bindings

Paths below are relative to the sole checkout stated above. Hashes bind this
review to the bytes actually read, not to a claimed newer candidate.

| Input | SHA-256 |
| --- | --- |
| `.claude/skills/ld-s10y-answer/SKILL.md` | `a825db87672032d77aef61e5ae20098a2334ef6cfe7c12d2d1d90c110c955857` |
| `.claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md` | `9f2c6e2b781b008af8141f9685c20fc7cefb2a2ef457d05ac689070c504274a9` |
| `.claude/skills/ld-s10y-lesson/references/production-resume.md` | `8d489fdcdd1a00866e951958009f6c8602e6b970108f8e7fc87368c3197b6a58` |
| `.intentfold/tickets/STEMROBIN-181/tmp/d703-n80-first-bilingual-text-author/candidates/zh/phy10-c2-s2-n80/exercises.template.json` | `3cbe2b714d27bcb4b57df8cbd35f641542179aad34eeba11404b4680c41b3801` |
| `.intentfold/tickets/STEMROBIN-181/tmp/d703-n80-first-bilingual-text-author/candidates/en/phy10-c2-s2-n80/exercises.template.json` | `e581c65d6d45d5e2a2e32f63eab709c9919023748c7fd54c0d7cf46be626fde9` |
| `.intentfold/tickets/STEMROBIN-181/tmp/d701-source217-consume-prepare80/root/10p/lessons/phy10-c2-s2-n80/lesson.json` | `aaaad5c24f029dd486c79780cc19c4c915d2d833a514e84bee6cb5e2d1dc34f9` |
| `.intentfold/tickets/STEMROBIN-181/tmp/d701-source217-consume-prepare80/root/10p/lessons/phy10-c2-s2-n80/exercises.json` | `0e7923617a619fe79f114e0445af5186da45af0362fdb4dbcf76734bfcb3d72a` |
| `.intentfold/tickets/STEMROBIN-181/tmp/d720-n80-text-only-derived-solutions/solutions.json` | `51f4a2bca863f9d560a6ba233e5a2edb8149babd44ad49e745f67973ea5299f1` |

Conclusion: first text review FAIL on tasks 4, 11 and 12. Other scoped results
remain independently usable as stated, without promotion to native/full-card
approval. No candidate was repaired during this review.
