# SAME188-6 continuation12: affected-answer independent review

OFFLINE, sole fresh nonfork reviewer, zero images. Only the full changed answer
objects 437, 438 and 440 were substantively reviewed. The other six objects were
compared for identity, not solved again. This is focused scratch evidence, not
full Gate 2, full-nine finalization, figure/text review or whole-N32 approval.

## Finding

**[P2] 440: the displayed half-turn proof identifies the wrong intersection.**
In the bound changed
[answer-keys.json](/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n32-threeanswers-affected-repair-12/answer-keys.json:69),
the first paragraph correctly maps line AB to CD and line AD to CB, but then
states that B is the intersection of "these two lines" and maps to D. The source
lines AB and AD intersect at A, not B; their image lines CD and CB intersect at C,
not D. Consequently this stated intersection argument proves A maps to C,
which was already known, and does not establish the asserted B-to-D mapping.

That mapping is needed for the subsequent opposite-side and opposite-angle
derivation. It is recoverable from the selected construction: explicitly use
the half-turn's involution to infer that CB maps to AD, and then apply incidence
to B = AB intersect BC and D = CD intersect AD. This describes the missing
dependency, not an edit to the candidate or authorization for another revision.
The candidate's correct numeric results and valid 438 supplementary reference
do not repair its false intersection sentence. **440 proof approval remains
FAIL at revision1.** No other affected-object defect was found.

## Bound evidence

The sole entry input
[inputs.json](/Users/yong/.codex/worktrees/stemrobin-188-six/lemmadeck/.intentfold/tickets/STEMROBIN-188/tmp/n32-threeanswers-affected-inputs-12/inputs.json)
matched SHA256
`cfef1e57ef1448f7c90c913cd50f8f3014d9273edde599fa78a077dedce62e60`.
All ten directly named path/hash bindings matched, including:

- Changed keys: `3aec1b0c5ee4adf31d9f7cf73c553f0cb8064d80f182c43642a9157f1a480a0e`.
- Original keys: `2e9f43b12a3aac9d0b9c7dd439e1988fb93ef432727baf8e38ce8f50e8e50f07`.
- Frozen independent FIRST: `291b66c5da1ba8f43b1795b0018327acdf68201f1941e0ec05f92b391a2ad541`.
- Prior independent report: `89251af2153a316cbb3855f77fa34fbe814828f4febaf762707197e71b833a85`.
- Prior independent manifest: `2b4b6ebd485133eea4f402a68cd7eb39dd5ac64aab2ea2ba23f98be0889528b7`.
- Bound raw lesson: `acc7868d23f46e6a6f74ab194145a0fc86b21064e38df2d326127afd63821279`.
- Bound raw tasks: `2454f9398c397ac5d39363fc8ce8ea81d7c3d206142a95853e0c8f972b464a8e`.

The existing FIRST and report were read and reused, never recreated or changed.
FIRST remains mode0444, size16439, inode163324017, mtime1795371779. The raw
N32 prose and the three affected source task objects were actually inspected;
no source163164 repair or other reviewer root was read.

## 437: PASS, elementary actual-ray proof

The candidate preserves the essential condition that the perpendicular foot P
lies on the actual first ray. P=V is handled separately. For P different from V,
corollary2 establishes the supporting-line intersection. The perpendicular at
V is parallel to the perpendicular at P by the earlier same-perpendicular
result explicitly used in N32. The acute second ray and P lie in the same
half-plane of the perpendicular at V; the opposite ray lies in the other.
The perpendicular through P remains wholly in P's half-plane, placing the
intersection on the actual second ray. This is an elementary angle/half-plane
argument, without trigonometry, coordinates or an assumed parallel-angle theorem.
The warning about a foot on the first ray's reverse extension remains intact.
`source=derived`, `grading=ungraded`, `parts=[]` are appropriate for this proof.

## 438: PASS, ten noncircular proofs and source footnote

The midpoint half-turn maps P to Q. Theorem39 plus the parallel axiom identifies
the image of a with b; c passes through the center and maps to itself.
The resulting sector pairs (1,3), (2,4), (5,8), (6,7) agree with the frozen
independent original208 inventory. This construction, not a corresponding-angle
equality assumption or arc appearance, establishes cross-intersection equality.

| Order | Actual source target | Candidate dependency | Verdict |
|---|---|---|---|
| 1 | 1=3 | Direct half-turn pair | PASS |
| 2 | 1=8 | Item1, then lower vertical 3=8 | PASS |
| 3 | 6=7 | Direct half-turn pair | PASS |
| 4 | 3=5 | Item1, then upper vertical 1=5 | PASS |
| 5 | 4=6 | Lower vertical 4=7, then item3 | PASS |
| 6 | 7=2 | Item3, then upper vertical 6=2 | PASS |
| 7 | 5=8 | Direct half-turn pair | PASS |
| 8 | 2=4 | Direct half-turn pair | PASS |
| 9 | 2+8=180 degrees | Upper local 2+1=180, then item2 | PASS |
| 10 | 7+1=180 degrees | Item6, then upper local 2+1=180 | PASS |

The source footnote's corresponding pairs (1,8), (7,2) and alternate-interior
pairs (2,4), (8,5) are retained and correctly explained. Additional corresponding
examples (5,3), (6,4) are correct explanatory content. Local vertical and linear
pairs are not confused with the different-intersection supplementary pairs.
P,Q,M are explicitly analytical names, not added figure annotations.
`source=derived`, `grading=ungraded`, `parts=[]` remain appropriate. The historical
author-only notes retain the old rejection and pending approval honestly.

## 440: proof FAIL; numeric mapping and supplementary reference PASS

The raw task gives A=30 degrees, AB=2cm, BC=4cm and requests every angle and
side. All eight distinct auto/numeric parts match these given/requested quantities
and the frozen independent conclusions, with units in the labels:

| Part | Label | Expected | Verdict |
|---|---|---|---|
| 1 | Angle A, degrees | 30 | PASS |
| 2 | Angle B, degrees | 150 | PASS |
| 3 | Angle C, degrees | 30 | PASS |
| 4 | Angle D, degrees | 150 | PASS |
| 5 | Side AB, cm | 2 | PASS |
| 6 | Side BC, cm | 4 | PASS |
| 7 | Side CD, cm | 2 | PASS |
| 8 | Side DA, cm | 4 | PASS |

The displayed values agree with these keys. The supplementary-angle step uses
AD parallel BC with AB as transversal and explicitly cites the now-proved438
same-side interior relation; that dependency passes. The midpoint/theorem39/
parallel-uniqueness approach is available in N32 and avoids assuming a later
parallelogram theorem, but its written intersection step is false as detailed
above. The opposite-side/opposite-angle derivation cannot receive PASS as written.

## Unchanged evidence and mechanical receipts

432,433,434,435,436,439 are structurally identical full answer objects before
and after; their serialized-object hashes also match. Answer order and top-level
metadata, including status=draft, are unchanged. Their prior substantive PASS,
inclusive-parallelism qualification and existing grading notes are reused, not
upgraded into a full Gate2 verdict.

The parent's existing eight-numeric440 and changed115-formula execution
receipts and their stdout/stderr hashes matched. Both record exit0, null signal
and completed timestamps; stdout reports eight numeric checks and 115 successful
formula results. The formula stdin hash also matches. These receipts were only
read/bound, never executed again, and are not proof approval. No old65/44 sanity,
numeric geometry check, renderer, width producer or full-nine finalizer ran.

Original/current207208 source/math/cultural/native/mobile PASS is reused by the
unchanged prior independent report/manifest hashes only. No image or figure file
was opened, hashed anew, rerendered or reviewed here. Original207 revision0,
original208 revision1, the prior reviewer6/24, original author8/8 with one failed
image load, recovery3 images and parent permanent24/24 remain historical.

All three affected answers remain revision1. Original FIRSTs, failures, counters,
modern438-label presentation HOLD, source155/printing-role UNKNOWN holds and other
out-of-scope holds remain preserved. Source163164 repairs belong to the parent
and were neither inspected nor judged.

Only report.md and manifest.json in the assigned review root were created.
No network, DB, .env, paid calls, app, dependencies, Charter, canonical, Git,
commit or deploy actions occurred. No children, browser or persistent exec
sessions were created. `activeExecSessions=[]`.

**Disposition: AFFECTED_REVIEW_COMPLETE_440_PROOF_FAIL.**
437 and438 receive focused proof PASS;440 numeric mapping passes, but its proof
remains rejected. No full Gate2 or whole-N32 approval is issued.
