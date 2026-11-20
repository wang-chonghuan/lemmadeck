# N64 conditional-region adaptation: author record

This is ordinary offline choice authoring, not independent review or semantic approval.
No review file or reviewer dispatch is authorized or performed.

## Source-first sequence

1. Reused this author's earlier independently solved 232, without reading answers, interactions, reviewer material, or other authors.
2. Copied the exact seven-exercise seed to this new root.
3. Manually wrote `independent-solutions.FIRST.md`, then actually chmod 0444 and inspected stat/hash before creating the additional question.
4. Copied the earlier complete draft, manually appended one question with apply_patch, and changed only source 232 coverage.
5. Retained all five earlier question objects, including views, keys, intents and rationales, without any edit.

Source-first evidence: 6537 bytes, mode 0444, SHA-256
`379d2a0b763b58ea39e72e0f9a6f70ab80b6bf8a5e71d23379bb70f7c4aee9e4`.
The original unique-distance ambiguity is still recorded in that sealed solution.

## Adapted response unit

One new native `single` question covers both centre-location cases and the conclusion when location is omitted.
Each alternative is a complete pair of right-triangle relations, solved distances, and determinacy statement.
No per-distance single-choice slots or separate answer-leaking sibling questions are added.

Visible conditions added by the author:

- R>0 and two distinct planes intersecting in a finite edge.
- The selected region D has angle phi with 0<phi<pi.
- D' is its explicitly defined adjacent supplementary region with angle pi-phi.
- Case I places the centre inside D; case II places it inside D'.

These are conditions of the new native task, not a reconstruction of the frozen source's convention.
The adapted task asks for a complete conditional comparison, rather than the original single-distance request with missing region information.
The original five questions' inherited source-blocker wording is retained unchanged; it describes the source and those original questions, not a denial that a separately conditioned new question is now authored.

## New options: actual author derivations

Let theta be the angle of the region actually containing C.
Equal distances R from both boundary lines imply that C is on the internal angle bisector.
The perpendicular-foot right triangle has hypotenuse d and opposite side R, hence R=d sin(theta/2).

### A: incorrect

Declared wrong procedure: keep the actual region angle theta, but treat R as the adjacent side of the half-angle triangle.
This changes the projection equation to R=d cos(theta/2).
For I, theta=phi, giving R/cos(phi/2).
For II, theta=pi-phi, giving R/sin(phi/2).
Thus the procedure really produces the displayed swapped pair.

At phi=pi/3 the actual distances are I=2R, II=2R/sqrt(3).
This option instead gives I=2R/sqrt(3), II=2R, so its region correspondence is false.
Its statement about two possible values except at the right angle is still true because swapping retains the unordered set.
A partially true final clause cannot make the complete conditional conclusion correct.

### B: correct

I uses theta=phi and R=d_I sin(phi/2).
II uses theta=pi-phi and R=d_II sin((pi-phi)/2)=d_II cos(phi/2).
Both denominators are positive throughout the stated interval.
The distances coincide only if sin(phi/2)=cos(phi/2), hence only phi=pi/2, giving sqrt(2)R.
Both centre regions admit genuine tangent spheres, so omitting the region leaves two different distances at every other allowed phi.
All relations, branch assignments, solved distances and determinacy statements are correct.

### C: incorrect

Declared wrong procedure: omit angle bisection and substitute the full region angle theta into R=d sin(theta).
I gives R/sin(phi); II gives R/sin(pi-phi)=R/sin(phi).
The incorrect procedure therefore produces both displayed equal values and its false location-independent conclusion.

At phi=pi/2 it predicts R, whereas the real distance is sqrt(2)R in both regions.
At phi=pi/3 it also makes I=2R/sqrt(3), whereas the actual I distance is 2R.
No arbitrary nearby numerical result or unsupported wrong-procedure label is used.

### D: incorrect

Declared wrong procedure: solve I correctly, then erase the visible change to the adjacent supplementary region in II.
Using theta=phi in both cases gives the displayed pair R/sin(phi/2) and the claimed unique value without centre-region information.

At phi=pi/3 its I value 2R is correct, but its II value 2R is false: II has angle 2pi/3 and distance 2R/sqrt(3).
This directly reproduces the source-convention mistake the adapted task is intended to test.
The formula happens to agree in both regions at phi=pi/2; the stem asks for a statement valid for all phi, so this isolated coincidence does not create another true option.

Complete author true set: B.
All four alternatives have comparable mathematical units and are not merely equivalent spellings.
At least one explicit admissible angle falsifies each wrong complete conclusion.
The learner-facing options do not label the errors or reference other options.

## Package relationship and unchanged bytes

- The original five questions and their original 20 option rationales are reused, not reconstructed or re-reviewed.
- Only one new question is added, and only the 232 coverage entry changes.
- The old centre-loci item tests 232(2), not the centre-to-edge half-angle task. Its visible view does not print the new half-angle formulas.
- The contact-section item involves a cut plane through one contact point, not a pair of tangent-plane dihedral regions. Its sin-squared area expression is not either new half-angle distance.
- The other retained views do not state the region-distance pair or the missing-convention conclusion.
- The new visible task does not reveal the old count tuple, centre loci and coordinate sphere, section area, ordered three-plane equations, or proof-chain key.
- Shared tangency and perpendicular-radius concepts are unavoidable mathematical prerequisites, not a formal assurance against every cross-question aid. The full candidate's fidelity, redundancy and leakage remain for separate independent review.

`preservation.json` records the actual mechanical comparison: all five earlier objects have identical raw JSON object bytes and logical equality; all six other coverage entries are unchanged; all 10 predecessor files including its index match their byte/hash/mode baseline.
No predecessor file or permission is ever written.

## Limits, counts, and pending work

- New 232(1) task adaptations: 1.
- New draft attempt: 1; new content repairs: 0. Previous content repairs: 0.
- Previous five objects unchanged; full candidate: six native single questions and 24 options.
- Actual source ambiguity retained: original general unique-distance task still blocked, except for the determinate right-angle special case.
- Capacity loss: recognizing the conditional chain cannot establish independent perpendicular-section construction, angle-bisector proof, half-angle derivation, or proof writing.
- Original-source conditions are not rewritten; the new task is openly conditional.
- New images, image requests, paid model calls, installs, database/application/publisher writes, other-chat or other-agent calls: 0.
- The new full candidate received exactly one structure-only validation invocation: exit 0, stdout `mechanical checks passed; semantic review still required` with its newline, stderr empty. `validation.json` retains the actual command/argv/timestamps and streams; no semantic review is supplied.
- No semantic PASS is claimed. The parent's sole independent reviewer remains separately assigned; this author does not launch or contact a reviewer.
