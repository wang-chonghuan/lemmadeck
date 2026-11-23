# N30 Offline Text Candidate

Status: author candidate ready; mathematical correction approval and source registration pending.
Scope: SAME188-6 / STEMROBIN-188, geo68-c2-s4-n30 only.
All writes are under this new disjoint root. Shared preparation, raw extraction, canonical lessons,
Charter, app, DB, environment and unrelated edits are not modified.

## Text

The candidate retains all 28 source prose entries: 20 text blocks, 4 figure placeholders and
4 captions. Exercises 373-380 retain their numbers, starred printed forms, group g1, references,
source snapshots, formulas and data. Edits are layout only, including Cyrillic-to-Latin labels.
No images, answer keys, choices, cultural scenarios or historical entities are added.

The sole retained prose_flow invocation returned 32 actual paragraphs. The four boundary objects
were copied from its stdout. Only section_breaks was populated after that invocation; its input
snapshot is retained separately. The final anchor validator does not invoke prose_flow again.

## Proposed Corrections

Both faithful errors remain in the candidate, and candidate errata remains the prepared empty list.
The separate errata-proposals.json is not a registered native erratum.

For the first worked construction, use coordinates B=(0,0), C=(a,0), A=(a,t).
The prescribed leg is BC=a and the prescribed hypotenuse is AB=c. Therefore
a^2+t^2=c^2. The locus enforcing the hypotenuse is the circle centered at B of radius c.
The strict condition c>a gives two nonzero opposite values of t, yielding congruent mirror
triangles, consistent with the source's convention of counting congruent figures as one solution.
If the radius were BC=a, t=0 and the triangle would degenerate.

Exact proposals, with all other wording preserved:

- p0139#1, in the assembled target bound to p0138#10+p0139#1: `$(B,C)$` -> `$(B,c)$`.
- p0139#5: `以$C$为半径` -> `以$c$为半径`.

This derives the mathematical correction; it does not establish print-versus-recognition cause,
human approval, registered source errata or source-image fidelity. The parent must verify the
unique original span in the authoritative page block, approve/register there, and obtain native
prepare bindings before changing candidate math or adding math-correction.

## Other Uncertainties

The separate proposal file distinguishes ten additional source/interpretation records from the
two correction proposals. It preserves the implicit intersection choices, reflected-point side,
exercise domains and feasibility cases, ambiguous exercise 378 wording, and unverified figures
and cross-references. These are not asserted printing errors and are not silently resolved.

The external tangent construction is algebraically consistent when d=|OA|>r>0:
the auxiliary circles have radii 2r and d and center distance d, satisfying
|d-2r|<d<d+2r. Taking the intended M_i as the midpoint of OB_i gives
OM_i=r. With O as origin, |B_i-A|^2=|A|^2 and |B_i|^2=4r^2 imply
A dot B_i=2r^2, hence (A-M_i) dot M_i=0, the required tangency.
This explains why the intended midpoint/ray selection matters, without replacing source wording
or consulting another lesson.

## Evidence

manifest.json binds the original raw files, all three prepared templates, candidate files,
proposal file, mechanical checks, actual execution receipt, stdout/stderr and sole flow input.
No independent review or native finalize is performed. The parent owns those stages.

One failed inspection (`ls` of the not-yet-created owned root) is retained in
inspection-failures.json. No prose_flow failure occurred.
The original preflight counter mistakenly counted closing-parenthesis subfigure labels as list
labels too; the manifest records the correction from 8 to 2 list labels, plus 6 subfigure labels.
That successful original output is retained unchanged; no candidate content changed for it.
The first attempted counter repair still included four whitespace-prefixed subfigure labels.
Its intermediate manifest is retained as manifest.initial-counter-attempt.json. The final counter
removes all six subfigure references before counting the two remaining list labels.
One apply_patch move attempt failed with an empty-hunk error before applying changes; the failed
input and returned error are retained in counter-repair.failed.patch and counter-repair.failed-call.json.

One read-only p0139 page JSON metadata inspection occurred during initial source-binding
exploration. It is explicitly reported, not claimed as source verification. Source-page visual
loads and PNG/image loads were zero. No further page inspection was performed.
