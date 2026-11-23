# FIRST: independent source-only mathematical derivation

Ticket: STEMROBIN-188. Authorization: OFFLINE SAME188-6, sole independent
reviewer, fresh nonfork context. Lesson: geo68-c2-s4-n30.
Phase: source solving only, before receipt of any candidate or errata proposal.
This document is not content approval of an unseen correction or figure.

## Input and independence

Workspace:
`/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck`.
The only writable scope is the new directory
`.intentfold/tickets/STEMROBIN-188/tmp/n30-errata-first-independent-review-18/`.

The source-only input actually read is
`.intentfold/tickets/STEMROBIN-188/tmp/n30-errata-independent-inputs-18/source-only.json`.
Its observed SHA-256 equals the required value:
`2bd151fbf2309d7e969a37ede0e31585fab0d41889e643d1fb8cb9b03cfbff9e`.

No in-flight author content, answer key, choices, candidate correction, proposed
errata, modern FigureSpec, modern figure, or downstream package was opened.
The input contains references into an earlier source-artifact root; only its
explicitly authorized original figure PNGs 190 and 191 were opened there.
The referenced lesson and page JSON files were not read or rehashed.

The prior source review is retained by the input's reference and an actual
hash-only check of
`.intentfold/tickets/STEMROBIN-188/tmp/source139140-answer338-independent-review-05/report.json`:
`db4993ed051b9147c484350d675642f096ce7f4d6ebe1c702318920782ece154`.
Its contents were not opened. The already independently established literal
uppercase `C` in source139 remains source text. This phase does not redo that
fidelity review, reinterpret that glyph as lowercase `c`, or amend source files.
All prior holds and source uncertainties remain in force; no hold is cleared
by this source-only derivation.

## Given labels, inspected once

Original figure 190:
`.intentfold/tickets/STEMROBIN-188/tmp/n30-draft-first-18/artifacts/6-8g/figures/fig-190.png`,
SHA-256
`a4cd6e3b38c0c637ceafe9eb98b4791d666175e47c9405fea6d23392f28cb797`.
The separate given segments are labelled lowercase `c` and `a`. In the
triangle, the vertices are uppercase `A`, `B`, `C`, the right angle is at `C`,
`BC` is labelled `a`, and `AB` bears a damaged/faint lowercase-c marking.
The latter scan damage is retained, not repaired or treated as newly proven
typography in the prose. The separate `c` label, geometry, figure191 label,
and source-only existence statement together settle the length identities.

Original figure 191:
`.intentfold/tickets/STEMROBIN-188/tmp/n30-draft-first-18/artifacts/6-8g/figures/fig-191.png`,
SHA-256
`aeb1051884e368d536e4f99e891c92653abf06fb4b676680e30ed352e4a48f86`.
The perpendicular line is labelled `p`; `C` is its intersection with line
`BC`, `B` is the intended circle center, and the upper circle/perpendicular
intersection is labelled `A`. The base segment is labelled `a` and the
sloping `AB` segment is labelled lowercase `c`. A lower, unlabelled
circle/perpendicular intersection is visible. No second vertex name is
inferred. The scan is a schematic, not exact coordinate evidence.

Thus the source-bound given data are `|BC| = a` and `|AB| = c`, with
`angle ACB = 90 degrees`. Point `C` is not the scalar length `c`.
The problem presupposes positive given segment lengths.

## Derivation and necessary mathematical corrections

Keep the source point identities and the first two steps:
construct `BC` of length `a`, then the full perpendicular `p` through `C`.
In the analysis, a possible `A` must satisfy both
`A in p` and `|BA| = c`, because `AB` is the given hypotenuse.
Consequently its second locus is exactly
`Gamma = { X : |BX| = c }`.

For the source notation `(center, radius)`, that circle is `(B,c)`.
Independently of notation conventions, it is the circle centered at point
`B` with radius equal to the given hypotenuse length `c`.
These two affected locations must convey that same fact:

1. Analysis spanning `p0138#10` and `p0139#1`: the source-only phrase
   `circle (B,C)` must, in any mathematically corrected modern rendering,
   denote `Gamma`, not a circle determined by point `C`. The preceding
   assumed-solved relation `distance BA equals length AB` is sound;
   identifying that length explicitly as `c` is sufficient.
2. Construction step 3 at `p0139#5`: the source-only instruction
   `center B, radius C` must use the given length `c` as the radius.
   A point alone is not a radius length. Writing `radius BC` or `radius a`
   would also be wrong, even though each is a well-defined length.

If `(B,C)` were instead interpreted as a circle centered at `B` passing
through point `C`, its radius would be `|BC| = a`. Since `p` is perpendicular
to `BC` at `C`, it would be tangent to that circle at `C`. Its sole
intersection would be `A = C`, never a nondegenerate triangle. Thus the
problem cannot be fixed by just adding the segment `BC` to the radius
wording while retaining the wrong circle.

In the assumed-solved analysis, `AB` can name the hypotenuse. In an executable
construction, however, `A` has not yet been found; the radius must be the
already given segment length `c`, not a demand to measure the unknown `AB`.
The supplied `c` segment can be transferred with a compass.

No alteration to `BC=a`, the right-angle vertex `C`, line `p`, center `B`,
the given-length labels, or the theorem38 statement is mathematically
required. No source typography is changed by this document. Correction of
only one of the two radius/notation locations would leave inconsistent
analysis and construction.

## Conditional existence and uniqueness

Take `C=(0,0)` and `B=(a,0)`, where `a>0`, so that `p` is `x=0`.
For a candidate `A=(0,y)`, the correct circle equation gives
`a^2 + y^2 = c^2`. Therefore:

- If `c>a>0`, there are exactly two intersections with the full line:
  `A_plus=(0,sqrt(c^2-a^2))` and
  `A_minus=(0,-sqrt(c^2-a^2))`. Each is distinct from `B,C`, has `BA=c`
  and `BC=a`, and gives a right angle at `C`. Hence the construction
  is sufficient as well as necessary.
- If `c=a>0`, the line is tangent and the only intersection is `C`.
  Taking it as `A` is degenerate, not a solution of the triangle problem.
- If `0<c<a`, the circle does not meet `p`, so there is no solution.
- Zero or negative segment lengths are not admissible triangle inputs.
  In particular, `a=0` makes `B=C` and does not determine the line `BC`
  required by step 2; it is not an extra valid case.

Thus a nondegenerate solution exists if and only if `c>a>0`.
Under the ordinary assumption of positive given segments, the existing
source condition `c>a` is correct and needs no mathematical replacement.

Step 4 at `p0139#8` is usable only in that existence case: choose either
intersection as `A`. The source's single named point and figure's chosen
upper branch do not establish a unique intersection with the full line.
An affected proposal may clarify this selection, but merely leaving the
other intersection unlabelled is not itself a proven figure error.
A specified open half-plane bounded by `BC` (or the corresponding ray of
`p` starting at `C`) gives exactly one admissible intersection when `c>a`.

For fixed labelled `B,C` and the full line `p`, the two triangles are
different placements. Reflection in `BC` fixes `B,C` and exchanges their
two vertices `A`; therefore they are congruent. Conversely, every solution
must occur at one of these intersections after fixing `B,C`. There is
exactly one congruence class when congruent figures, including mirror
images, count as the same. This proves the source's stated conditional
uniqueness; it does not assert a single point `A` in the plane.

The remaining leg is necessarily `sqrt(c^2-a^2)`. Both right triangles
with these given hypotenuse/leg lengths have the same three side lengths,
which also proves theorem38 by SSS without relying on theorem38 itself.
The existing theorem and congruence qualification require no correction.

## Scope, uncertainties, counts, and next phase

This is an independently derived mathematical requirement, not a claim that
the original printed uppercase `C` was lowercase `c`, and not approval of
any unseen editorial implementation. A modern-only correction still needs
its exact source-hash/block/original-form bindings and affected candidate
review. No errata registration, content promotion, source rewrite, figure
approval, choice approval, DB access, app operation, network access, paid
call, model call, dependency change, git operation, or new agent occurred.

Keep the literal source139 `C`, the faint/damaged figure190 side marking,
and all earlier source/content/approval holds. The prior review's body was
deliberately not read and no unenumerated hold is assumed resolved.
No conclusion here extends to the rest of the lesson or any answer key.

Image ledger: one batch; 2 charged attempts; 2 successful opens;
0 failed image attempts; 0 crops created or opened; 0 reopens;
2 images loaded in this context; 0 images received from the parent;
0 image payloads returned to the parent. Batch ceiling 8; context ceiling 24.
The parent's exhausted allowance stays 24/24 and is not reset.

Two non-image commands returned exit 1: an initial `rg --files` discovery
found no visible paths, and the precreation `stat` confirmed this new
owned directory was absent. Neither is an image failure or content verdict.
There were no retries of image reads.

Stop after sealing and reporting this first phase. Later review, only after
the exact candidate/errata proposals are supplied in this same context,
must compare them against this sealed derivation without source re-solving
or image reopening. All mathematical correction and downstream approval
statuses remain pending that affected review.
