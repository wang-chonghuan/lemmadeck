# Phase B: Scoped Candidate Review

Same ongoing STEMROBIN-184 / 184-6 invocation, finish=review, authorized books
9c/10c only. This review concerns 10c / modern-us-neutral / ana10-c6-ex only.
One released candidate comparison has completed against the unchanged,
previously consumed independent Phase A mathematical freeze.

## Verdict

**REVISE; whole-lesson HOLD.**

Exactly 57 candidate identifiers 335-391 were reviewed in original order:
55 complete MATCH, one REVISE (350), one HOLD_PRESERVED (338).
All 56 substantive entries contain mathematically correct supplied results;
350 is incomplete relative to the retained request, not an incorrect ODE
solution. All 56 remain deliberately `grading="ungraded"` and `parts=[]`.
Those choices are not findings and must not be promoted to auto judging.
338 has empty displayAnswer, null source/grading, empty parts, explicit
HOLD/UNKNOWN notes, and belongs to the draft package. It is not answered.

`comparison.md` gives all 57 rowwise dispositions and separate display,
notes, and constraint comparisons. `comparison.json` also binds each row to
its exact candidate JSON pointer, candidate-field hashes, frozen solution
section, original number, and retained group. No candidate answer edits
or downstream checks were performed.

## Finding

### [P2] 350 Omits the Retained Analysis and Graph Request

Candidate:
`.tmp/stemrobin-184-six/c6-supplement-answer-author/answer-keys.json`.
Exercise 350 is `/answers/15`.
Affected fields are `/answers/15/displayAnswer` (line 132) and
`/answers/15/notes` (line 134).

The first and second derivatives and the affirmative ODE verdict are correct.
However, g4 retains `利用导数讨论函数并作出它的图象：`.
The candidate supplies only the explicit ODE check; neither field contains the
group's function analysis or concrete graph data. Phase A explicitly retained
both requests. The ODE correctness does not authorize silently dropping g4.

Required correction, without editing the source task:

- Preserve the existing affirmative ODE answer, y', y'', and equality y''=-4y.
- Append the already frozen domain R, range [-1,1], amplitude 1, fundamental
  period pi, and y-intercept sqrt(2)/2.
- Add decreasing intervals (pi/8+k*pi,5pi/8+k*pi) and increasing intervals
  (5pi/8+k*pi,9pi/8+k*pi), with k an integer.
- Add maxima 1 at pi/8+k*pi, minima -1 at 5pi/8+k*pi, and zeros
  3pi/8+k*pi/2, with k an integer.
- Add one period's plotting coordinates (pi/8,1), (3pi/8,0), (5pi/8,-1),
  (7pi/8,0), (9pi/8,1), and period-pi extension. No rendered diagram is required
  or authorized.
- Adjust notes so the retained graph/analysis task is no longer excluded by
  the present ODE-only explanation. If a sine phase is supplied, use the
  frozen positive-amplitude/frequency sine convention and phase pi/4.
- Keep source=derived, grading=ungraded, parts=[], the original exercise ID,
  and both request owners unchanged. Do not add initial conditions.

This is a replacement/completion requirement, not a replacement answer-key
file or authorization to edit the candidate.

## Accepted Differences and Qualified Scope

356's phase pi+arctan(2sqrt(3)) differs by 2pi from the frozen
-pi+arctan(2sqrt(3)); both coefficients and signs agree. This is accepted.
Explicitly labelled cosine phases in 346/347 and cosine/sine forms in
351/353/355 are accepted under their stated conventions.
348/349 express coordinates and interval families using x0 and T; substitution
gives the exact frozen coordinates. Amplitudes are the explicit coefficients.
Their complete graph prescriptions do not require duplicating optional
standalone sine phases or y-intercepts.
385's alternative factorization has the same complete roots.
Equivalent degree labels on principal-angle values are accepted.
All six values and both half-angle subparts in 378 match; all three t-based
representations and values in 381 match, with nonzero denominators checked for
the given t. 382-387 retain complete integer-parameter real solution families;
384 correctly keeps the 4pi half-angle family.

371-373 remain QUALIFIED for inherited g9 instruction ownership, even though
their literal equalities and principal values match. A reference to REPORT.md
in 371's candidate notes was not followed or used as evidence. No author
REPORT.md/output-manifest.json or other candidate/solution packages were read.
The frozen normalization of 364 is reused without new source-glyph inference.
338's inner-minus observation does not decide its low point; no interpretation,
derivative, alternate answer, or source approval was produced.

## Evidence and Accounting

The Phase B directory was confirmed absent before writing. All commands used
the exact assigned cwd. Writes are only new files in Phase B; Phase A, source,
candidate, canonical and retained evidence are untouched.
Actual candidate SHA-256 matched the released value
310e25715d88089e71d8637d45333ae91160723c1d0583ff0356688cab5a364e.
Phase A solutions SHA-256 remains
205d8d6564c3b8dc5625e0c75898b870b061c159f29127bb9ef1f022ed2d0c4d.
`bindings.json`, `ledger.json`, `failures.json`, and `seal.json` provide actual
text input/output hashes and command outcomes, without replaying mathematical
verification, assembly, or a whole checker gate.

The parent-consumed Phase A retention at
`ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1846-c6-supplement-math-phaseA`
and final seal f759e32b25f2cfe3f03f76ad8b2dd7f289ffee592b252ab74ee537ce00d486ef
are inherited intake facts; that retained directory was not reopened.
Its initial 479/480 exit-1 numerical check and affected 100-digit 374
exit-0 recovery, residual 1.93124E-92, remain untouched and are not replayed
or relabelled as one successful original run.

Images, ROIs, image headers/bytes/pixels/decodes/crops, render/display operations,
paid/model/external-service calls: all 0.
Parent permanent image accounting remains inherited 24/24 exhausted.
No install, freshness, backend, environment, DB, Git, publisher, finalizer,
assembly, chat, automation, peer/supervisor message, or unrelated author/folio
review occurred.

Stop for parent intake after this single Phase B comparison.
No full lesson/course PASS, closure, downstream approval, or new completion
authorization is issued. Any later candidate change requires its own affected
review authorization; the unchanged 55 matching entries need no replay here.
