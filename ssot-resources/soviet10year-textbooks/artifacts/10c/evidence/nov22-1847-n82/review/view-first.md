# STEMROBIN-184-7 / n82: frozen Stage B figure and blind views

Freeze date: 2026-11-23, Europe/Dublin.
Same independent review as Stage A; not a replacement review.
Reviewer authority: delegation from the parent chat under direct user
authorization, not an invented additional direct-human approval requirement.

Stage A accepted binding:
`source-first.md`, SHA-256
`8bb8c942cacf449179bb3e05b16aa335932fd1f7b48b59dfbce0d9caba9e491c`.
It was not reread or rewritten. The original image was not reopened.
Only the new figure files and `question-views.json`'s `id/view` were inspected.
No `question-author.json`, `answer-author.json`, `author-source.md`, old key,
history, author solution, or author correct set was read.

Only workdir:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.
Only writes: this existing review directory.
No additional browser, seed preparation, installation, DB, network, `.env`,
canonical change, branch, worktree, chat, scheduler, or rollback.
Elapsed time: UNKNOWN. Reviewer model cost: UNKNOWN.

## Bindings

Candidate paths below are relative to the workdir.

| File under `.tmp/stemrobin-184-six/n82-resume/` | Actual-byte SHA-256 |
| --- | --- |
| `fig-21.spec.json` | `14c4726554b0080722ef75ada0621d7e92087fb0fe015dbc326ad5a7e4e65a70` |
| `fig-21.render.json` | `89d74fc56916a32e956ccfd5f077c3a97b25609170272a57c93ea9d122c3b469` |
| `fig-21.svg` | `55192034b90fc2a677d5a0b8bbf05794f6a5357c4d4cfc3d248bab139571a624` |
| `figure-preview-final.json` | `903cca7ae50e5ee0b97c656c83ddbee31d1364267591e4d0c004c6a0e16c9889` |
| `fig-21.browser-final.png` | `f2d87871ae32ab5a7ceb8ba5806652f2f1110b1840f4c4a54fe2f418a7953e4a` |
| `question-views.json` | `0d1314f6ea415dba01ec1ae90df8416280a7a9788912cd3fda6f989d9dc02372` |

The render report's spec/output digests match the actual spec/SVG digests.
The screenshot and preview report are separately bound, not substituted for
the output's hash.

## Image ledger

Stage A cumulative: 3.
This new batch: ONLY `fig-21.browser-final.png`, actually opened once.
Current cumulative: 4/24; this batch: 1/8.
No source, crop, screenshot reopen, other figure, or other lesson image.
Future course desktop/mobile images must add to 4, not reset the count.

## figSourceAndCandidate: PASS

This is the source/candidate mathematical and visual comparison for the bound
figure, based on Stage A's frozen source inventory plus the actual new PNG.
It is not final course desktop/mobile approval or a final promotion manifest.

Panel a has both axes, origin O, the centered radius-A circle, upper-left P0,
lower-right P(t), two outward radius arrows, and both vertical dashed projection
edges with x0 and x(t) on the same x axis. All endpoints/labels are visible.
Both source snapshot signs are preserved: x0 < 0 and x(t) > 0.
The label A remains the radius annotation, not an extra named point A.
The upper phase arc goes from Ox+ to the initial radius; the separate lower
motion sweep has a counterclockwise arrow. `phi` is the visible English
transliteration of the mathematical phase label, not a numeric angle.

Panel b has one origin and coordinate frame, three concentric circles, inner
shallow P1(t), middle steep P2(t), and outer P(t) between their rays. The
component vectors are dashed with outward heads; the result is solid with an
outward head. Exactly two thin segments connect P1(t) and P2(t) to P(t).
Those segments have no added arrowheads. There is no spurious P1--P2 edge.
No source-given numerical angles/radii or answer-bearing annotations were added.

Independent coordinate checks, NOT source measurements:

- a-P0 and a-Pt have radius 2.4 about a-O, within 5e-16 floating-point error.
  Projection x differences are exactly 0; O, x0, and x(t) have y = 0.
- The phase-arc start is (0.8,0), and its end is collinear with the initial
  radius, cross-product residual about 1.1e-16.
- The motion-direction start/end cross product is +0.1871178910, agreeing
  with the visible CCW arrow, not clockwise motion.
- Relative to b-O, v1 = (0.8,0.15), v2 = (0.6,1.7), v = (1.4,1.85).
  v - v1 - v2 and both translated-edge residuals are below 9e-16.
  All three endpoint/circle radius residuals are 0.
- Both components declare dash 2; the result has no dash. Both translated
  joining objects are `segment`, not `arrow`.

These coordinates, chosen radii, arc spacing and the added panel letters are
modern composition, not recovered source givens. The spec expressly identifies
representative coordinates as additions. A minor provenance wording note:
its a-frame description calls O "editorial origin naming", whereas Stage A
already observed O in the source. O is correctly preserved in the output;
that wording is not evidence that the source lacked its origin label.

The PNG is nonblank, neutral, and shows both complete panels including the
rightmost/bottommost geometry, without observed clipping or label overlap.
The existing render/preview reports describe the isolated 640px surface and
report 17 labels at 17.3333px, no collisions/errors, and status pass.
Actual viewing supports legibility at that supplied surface. No additional
browser or rerender was needed. Final course desktop/mobile display remains
the later authorized affected display check, not a prerequisite to preparing
the currently nonexistent seed.

## Blind view order and verdicts

Inspected only two `id/view` objects: `projection-phase` (single, 4 options)
and `rotating-vector-sum` (multiple, 6 options).
The complete visible snapshot and structured observations are frozen in
`view-first.json`. All ten options were independently evaluated before any
author internals. Correct sets below are the reviewer's sets, NOT compared keys.

### projection-phase

Task fidelity: PASS. The question asks for the complete x-projection law and
the amplitude, angular frequency and initial phase, with A > 0 and omega > 0.
It keeps the source's CCW convention and is a general law for initial phase,
not a special numerical phase read from representative coordinates.

Independent solution:
theta(t) = omega*t + varphi, so x(t) = A*cos(theta(t)).
Initial phase is varphi modulo 2*pi.
Complete true set: **{a}**, consistent with single mode.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | true | The x component of the rotating radius is A*cos(omega*t + varphi); its amplitude/radian-rate/phase are A, omega, varphi. |
| b | false as a general law | It reverses the initial phase. For varphi = pi/2, t = pi/(2*omega), the true x is -A, but this expression is +A. At varphi = 0 it happens to agree; that special coincidence is not a universal identity. |
| c | false | It uses the y-component sine in place of the x-component cosine. At varphi = 0, t = 0, true x is A but the option gives 0. |
| d | false | It doubles the specified angular rate. At varphi = 0, t = pi/(2*omega), true x is 0 but the option gives -A. |

Redundancy: PASS. The four alternatives test phase sign, x/y projection and
angular-rate distinctions, not duplicate equivalent laws. The b/a special-phase
coincidence does not duplicate the generally applicable options.
Leakage: PASS. The figure gives initial-ray/phase/projection structure but
does not print a solution law or identify an option. Each alternative has the
same full-law/parameter format; the key is not revealed by format.

### rotating-vector-sum

Task fidelity: PASS. Under the source's fixed-length rotating-vector convention,
the question retains common positive CCW speed, rotation linearity, projection
of the resultant and the zero-sum/phase distinction. Options a and b jointly
retain the 69-to-70 vector/projection proof chain.

Independent solution:
Let u = v1(0) + v2(0). Then v1(t) + v2(t) = R(omega*t)*u.
For u != 0, write u = A*(cos(varphi), sin(varphi)); A = ||u|| > 0.
The x projection is A*cos(omega*t + varphi), with common angular speed omega.
For u = 0, the resultant and x projection remain zero; phase is arbitrary.
Complete true set: **{a,b,e}**, consistent with multiple mode.

| Option | Truth | Independent evidence |
| --- | --- | --- |
| a | true | Plane rotation is linear: R*u1 + R*u2 = R*(u1+u2). |
| b | true | For nonzero u, its length is A and its orientation is varphi modulo 2*pi; rotation then gives the stated x projection. |
| c | false | Triangle inequality is not always equality. u1=(1,0), u2=(0,1) gives resultant length sqrt(2), not 2. Equality requires special alignment. |
| d | false | Nonzero u rotates by omega*t, not 2*omega*t. For u=(1,1) and t=pi/(2*omega), actual R gives (-1,1), whereas doubling gives (-1,-1). |
| e | true | If u2=-u1, R*u1+R*(-u1)=0 at every t; the sum of x projections is identically zero. |
| f | false | At A=0, 0*cos(omega*t+varphi)=0 for every varphi; phases 0 and pi/2 already give the same zero function. There is no unique phase. |

Redundancy: PASS. a checks linearity, b the nonzero projection/amplitude, c an
incorrect length rule, d an incorrect doubled rate, e cancellation and f
phase identifiability. a/b/e form the intended linked argument but are not
identical response units; e and f separate the zero value from its nonunique
parameterization.
Leakage: PASS. The representative nonzero diagram does not reveal the zero-case
answers. q1's projection form is a shared concept that the source expressly
applies in 70; it does not alone establish common rotation of a sum, the
resultant amplitude, or cancellation/phase. No key, explanatory rationale or
selection marker occurs in the inspected views.

Zero-frequency qualification: the visible stem specifies omega > 0.
The zero resultant remains allowed; it has no determined fundamental period
or fundamental frequency. No visible option falsely attributes a definite
basic period to zero. The unique-phase claim is deliberately false option f.

## Package coverage and limitations

Blind view review: PASS for both fidelity and independently solved mathematics.
Source 69's projection law and all three requested parameters are covered by q1.
Source 70's common-rotation identity, nonzero projection and cancellation/phase
cases are covered by q2. No essential scientific task was silently omitted.
The repeated cosine/common-rate concepts are the intended application of 69
to 70, not a second unrelated copy of the same question.

Production loss: selecting complete laws and proof components does not require
the learner to write an independent derivation or construct a rotating-vector
diagram. That writing/construction ability is not assessed. The options still
require the source's mathematical distinctions and linked reasoning; this
recognition limitation does not destroy the authorized choice task.

## Remaining stage

Internals comparison: NOT STARTED, awaiting the caller's disclosure.
Author solution, correct sets, per-option rationales/misconception derivations,
answer-author content and final review.json have NOT been checked/approved.
Do not normalize this independent true set to a later author key.
No absent seed was demanded or fabricated; no additional gate was created.
Resume this same review after disclosure, retaining Stage A and these frozen
views. Final course desktop/mobile display will be checked once when supplied,
with cumulative image accounting. No additional direct-human waiting gate.
