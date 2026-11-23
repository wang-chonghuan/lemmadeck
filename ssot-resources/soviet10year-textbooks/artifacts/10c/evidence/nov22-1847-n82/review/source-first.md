# STEMROBIN-184-7 / 10c n82 / fig-21: frozen blind Stage A

Freeze date: 2026-11-23 (Europe/Dublin, latest supplied environment date).
The session began under the previously supplied date 2026-11-22.
Reviewer: human-appointed independent agent in this chat; not the candidate author.
Scope: only modern `ana10-c6-s2-n82`, exercises 69 and 70, and shared `fig-21`.
Stage A: COMPLETE, with the explicitly limited uncertainties below.
Stage B: NOT STARTED / HOLD awaiting the human's actual new candidate.
This is source-solving evidence, NOT an approved figure review or choice review.
Freeze this document as the pre-candidate record; do not rewrite it from a candidate.
This is the assignment's one independent review, not a restart of earlier reviews.

## Authority and boundaries

Only workdir:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`

Only write directory:
`ssot-resources/soviet10year-textbooks/artifacts/10c/evidence/nov22-1847-n82/review/`

Read the actual local image skill, its quality gate, the choice skill, its
semantic review reference, and lesson `production-resume.md` before source viewing.
Also read local routing/engineering guidance and the choice contract.
No worktree, branch, chat, automation, DB, network, installation, `.env`, publication,
canonical modification, commit, rollback, or review of another lesson/figure.
No old author inventory, HOLD record, candidate spec, answer, or choices consulted.

Modern input authority is the current edition files' top-level `prose[].text`
and `exercises[].text` / `figure_refs`, not the top-level `source` subtree.
A projection diagnostic initially emitted the prose objects including their
mirrored `source_text` and provenance metadata. Those were not used for candidate
inference or as additional authority; a subsequent text-only projection supplied
the scientific checks below. No `source.*` subtree or faithful lesson was expanded.
No candidate object list, author reasoning, correct set, or option set was viewed.

Local elapsed time: UNKNOWN.
Reviewer model cost: UNKNOWN.
Image-generation/model-service calls made by tools: 0.

## Input bindings

Paths in this document are relative to the sole workdir unless explicitly absolute.
Digests are SHA-256 of actual file bytes. Source and modern input hashes remained
unchanged between initial binding and the pre-freeze check.

| Input | SHA-256 |
| --- | --- |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/figures/fig-21.png` | `8a5269194ff7e9f89c3ebd71dbac69a07479ecace4218e778d1e4a07cba48f84` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n82/lesson.json` | `ff53e09135906cc83a47520286940fa9d0e06cee22840d60260a1072bbd374f4` |
| `ssot-resources/soviet10year-textbooks/artifacts/10c/editions/modern-us-neutral/lessons/ana10-c6-s2-n82/exercises.json` | `1d5f63b15b4c016085c36a8abcf164eb2941b8c9fdefe899e000e2e93e5e2166` |

## Image ledger

The original was actually opened ONCE, at 1075 x 572.
Native crops were not resized, interpolated, sharpened, or redrawn.

| Load | Asset relative to the write directory, except the original | Observed coverage | SHA-256 |
| --- | --- | --- | --- |
| 1 | original `fig-21.png` above | Both complete panels, including rightmost and bottommost geometry | `8a5269194ff7e9f89c3ebd71dbac69a07479ecace4218e778d1e4a07cba48f84` |
| 2 | `source-fig21-right-roi.png`, 500 x 530 | Right-panel labels, vector heads and thin joining edges | `c83f47972008df185b470d2332bffa1aac2dbc5aea0c6f0d60b1408f1035b168` |
| 3 | `source-fig21-left-roi.png`, 510 x 572 | TECHNICAL CROP MISMATCH: actually the central strip, not the complete left panel | `948ad3f1f008d7c266176aef36f8fdb3d3cceb6f89b41e57abf975aa7b6bf154` |

The third file retains its attempted filename and original bytes as failure
evidence. Its invocation requested `--cropToHeightWidth 572 510 --cropOffset 0 0`;
the observed result was centered. It does not establish a complete left-panel
ROI check. The complete first image supplies the left-panel observations.
No replacement image was opened after this technical failure.

Stage A first batch: 3/3 loads (source 1 + native ROIs 2).
Current-context and assignment cumulative image count: 3; global ceiling: 24.
No candidate or desktop/mobile image loaded.
Future Stage B batches: at most 8 each, adding to the existing cumulative 3,
not resetting through waiting, a new message, or compression.

## Independent pixel inventory

Panel IDs `a` and `b` below are supplied by modern exercises 69/70.
No printed panel letter or caption is visible inside this crop.
The source contains two adjacent, separate coordinate frames; within each panel
the instructional objects share one origin and axes.
There are no numbered ticks, grid cells, numerical angles, numerical radii,
time values, units, or scale bars to recover.

### Panel a: rotating radius and x projection

- `a-frame`: horizontal x axis and vertical y axis intersect at the labeled `O`.
  Positive x points right and positive y points up, with arrowheads and `x`, `y`.
  Negative-axis extensions are present, without corresponding negative-end heads.
- `a-circle`: one large circular orbit centered at O, crossing both axes.
  A visible `A` is placed near its positive-y intersection. Modern exercise 69
  supplies its meaning as radius/amplitude A; the pixels alone do not establish
  a separately named point A or a separately drawn radius dimension.
- `a-p0`: labeled `P_0`, on the upper-left part of the orbit.
  `a-initial-vector`: O -> P_0, with the head directed toward P_0.
- `a-pt`: labeled `P(t)`, on the lower-right part of the same orbit.
  `a-current-vector`: O -> P(t), with the head directed toward P(t).
- `a-foot0`: unnamed x-axis foot vertically below P_0, left of O;
  coordinate label `x_0` is below the axis. A dashed vertical projection joins
  P_0 to that foot; the foot lies on the x axis, not on the circle.
- `a-foott`: unnamed x-axis foot vertically above P(t), right of O;
  coordinate label `x(t)` is above/near that part of the axis. A dashed vertical
  projection joins P(t) to that foot.
- `a-phase`: the visible inner angular marking with `varphi` on the upper-right
  side of O associates the initial radius with the positive x direction.
  Modern prose specifies the starting angle varphi from Ox+, measured for the
  counterclockwise motion; no numeric angle is given.
- `a-motion`: an inner curved sweep has a visible lower-right arrow directed
  along counterclockwise motion around O. This is not an extra labeled orbit,
  not a numerical radius, and not a third time-position vector.
- Unnamed circle/axis intersections and the two projection feet are geometric
  locations, not additional labeled problem points.

Connection topology:
O -> P_0; O -> P(t); P_0 -- foot0; P(t) -- foott;
foot0 and foott lie on the same x axis through O.
The two dashed edges are perpendicular to that axis. Both moving endpoints
lie on the same centered circle. No edge directly joins P_0 and P(t).

Visible snapshot signs: x_0 < 0, x(t) > 0.
These are the depicted instant's signs, not signs for the entire motion.

### Panel b: vector sum in a shared frame

- `b-frame`: horizontal x axis and vertical y axis meet at labeled O;
  positive x and y have arrowheads and labels.
- `b-circle1`, `b-circle2`, `b-circle-result`: three concentric circular traces
  centered at this same O: small, middle, and outer.
  They are not three independent coordinate frames.
- `b-p1`: the lower, shallow first-quadrant endpoint labeled `P_1(t)`,
  on the small circle, just above the positive x axis.
- `b-p2`: the steeper first-quadrant endpoint labeled `P_2(t)`,
  on the middle circle.
- `b-p`: the upper-right endpoint labeled `P(t)`, on the outer circle.
  Its ray is between the two component rays in the depicted snapshot.
- `b-v1`: O -> P_1(t), with outward head.
- `b-v2`: O -> P_2(t), with outward head.
- `b-result`: O -> P(t), the prominent diagonal with outward head.
- `b-edge1`: a thin joining edge from P_1(t) to P(t).
- `b-edge2`: a thin joining edge from P_2(t) to P(t).
  Together with the common-origin component vectors these show the
  parallelogram's sides; the diagonal is the result vector.
- Component shafts look broken/dashed in places; the result diagonal is
  prominent/solid, and the translated joining edges are thin. Dense overlap
  near P(t) does not warrant inventing additional arrowheads or vectors.
- No explicit x-projection feet or separately labeled projections appear here.
  No numeric angle/radius labels and no separate curved motion arrow are
  securely visible; the common rotation comes from exercise 70's text.

Connection topology:
O -> P_1(t); O -> P_2(t); O -> P(t);
P_1(t) -- P(t); P_2(t) -- P(t).
No P_1(t) -- P_2(t) edge is established.
The intended mathematical correspondence from the modern hint is:
OP = OP_1 + OP_2; P_1P = OP_2; P_2P = OP_1.
These equalities are mathematical interpretations to verify in a candidate,
not exact numerical measurements from the scan.

In this illustration only, component 1's circle is smaller than component 2's,
and the result circle is largest. That is not a general theorem about sums:
other phases can make the result smaller or zero.

## Limited uncertainties and the fidelity threshold

U1: the `A` glyph at the positive-y intersection in panel a is visible; its
radius meaning is text-authorized, but naming that intersection "point A"
would add an unsupported point identity.
U2: exact separation/endpoints of the inner phase arc and curved motion sweep
are not metrically specified. Their angle/motion roles are supported; an exact
pixel tracing or an invented numerical sweep is not.
U3: the tiny translated-edge arrowheads and some component-shaft dash details
in panel b are locally crowded. HOLD only an unsupported claim that a
particular auxiliary edge has a source-given arrowhead/dash pattern.
The two joining endpoints and three principal vectors are established.
U4: the attempted left ROI is a technical crop failure, not a source-science
failure and not approval to reopen beyond the first-batch cap.

No HOLD merely because numerical angles/radii or exact pixels are unavailable.
The original provides no such values. A clean, reasonable representative
construction is permitted. Chosen radii, phase angles, arc radii, spacing,
regularized circles, and extra explanatory labels must be identified as
modern additions, not source givens or independently recovered measurements.

Preserve the actual mathematical relationships: centered circles, common
frame, projection/perpendicular incidence, vector endpoint topology,
counterclockwise convention, equal common angular speed, and exact vector
addition. In the shown representative sum, the result is the parallelogram
diagonal, not an independent arbitrary ray or a tip-to-tip difference.
A numerical relation, a right angle, an equality of lengths, or a motion
direction may not be invented from appearance.

For later deterministic assertions, cover every identified endpoint/foot,
circle incidence, projection edge and meaningful vector/joining edge.
The tests concern these relationships, not recovery of arbitrary scan
coordinates or of nonexistent numerical givens.

## Independent solution: exercise 69

Modern task: a point moves uniformly counterclockwise on a circle of radius A
about O, advancing omega radians per time unit, with starting direction varphi
from Ox+. Prove harmonic motion of its x projection and identify the constants.

For an actual nondegenerate moving circle take A > 0, omega > 0, and an oriented
initial phase varphi modulo 2*pi. Unwrap the angular position:

theta(t) = varphi + omega*t.
P(t) = (A*cos(theta(t)), A*sin(theta(t))).
Its perpendicular projection onto Ox is (x(t), 0), where

x(t) = A*cos(omega*t + varphi).

Thus the amplitude is the given radius A, angular frequency is the given
counterclockwise speed omega, and initial phase is varphi modulo 2*pi.
Also x(0) = A*cos(varphi) = x_0, and
x''(t) = -omega^2*x(t).
For this nonzero oscillation the fundamental period is 2*pi/omega.

The distinction between angular frequency and ordinary cycles/time is important:
ordinary frequency is omega/(2*pi), not omega. The problem's omega is explicitly
radians/time; a candidate must not silently change its units.
The left snapshot's positions are compatible with counterclockwise motion after
passing through the left/bottom part of the orbit; its numeric elapsed time is
not given and cannot be read from the picture.

If A = 0 is allowed as a formal limiting case, P is O and x is identically zero.
That is not literal nonzero-radius circular motion: its phase and motion
frequency cannot be determined from the zero projection. This observation does
not forbid the zero-result case required for exercise 70.

Source mathematical gate: PASS, under the stated physical positive-speed
convention. No answer key or candidate used.
Task coverage frozen for B: circular uniform rotation -> x projection,
amplitude/radian-rate/initial-phase identification, and the cosine relation.
No option-fidelity, coverage-of-a-draft, redundancy or leakage verdict yet.

## Independent solution: exercise 70

Modern task: use 69 to prove closure of two equal-frequency harmonic terms,
with the hint that their common-speed rotating vectors have a rotating sum.

Take a common omega > 0. At time zero define
u_1 = A_1*(cos(varphi_1), sin(varphi_1)),
u_2 = A_2*(cos(varphi_2), sin(varphi_2)),
and R(theta) as the counterclockwise plane rotation matrix.
Then v_i(t) = R(omega*t)*u_i.
Linearity gives

v_1(t) + v_2(t) = R(omega*t)*(u_1 + u_2).

The vector sum therefore preserves its length and rotates by the same angle,
provided it is nonzero. It need not have either component's length or phase.
The common-origin parallelogram construction in panel b represents this sum.

Write C = A_1*cos(varphi_1) + A_2*cos(varphi_2),
D = A_1*sin(varphi_1) + A_2*sin(varphi_2).
The result's x coordinate is

f(t) = C*cos(omega*t) - D*sin(omega*t)
     = A_1*cos(omega*t + varphi_1)
       + A_2*cos(omega*t + varphi_2).

If (C,D) != (0,0), set
A = sqrt(C^2 + D^2),
varphi = atan2(D,C) modulo 2*pi.
Then C = A*cos(varphi), D = A*sin(varphi), so

f(t) = A*cos(omega*t + varphi).
A^2 = A_1^2 + A_2^2 + 2*A_1*A_2*cos(varphi_1 - varphi_2).

The sign in front of D*sin(omega*t) is negative for the problem's cosine
and counterclockwise convention. A candidate using a positive sign with the
same phase convention would change the mathematics.

Degenerate case:
If C = D = 0, the sum vector is O for all time, A = 0, and f(t) = 0.
Any varphi represents the same zero function. For example, equal positive
amplitudes with phase difference pi cancel.
Do not call this a nonzero vector with a determined direction or actual
angular speed. The rotation identity still holds and the cosine representation
with the inherited parameter omega is valid.

For A > 0 and omega > 0, the fundamental period is 2*pi/omega.
For A = 0, every T > 0 is a period of the zero function; there is no least
positive period and no determined fundamental frequency. The components'
omega is an inherited parameter, not an observable frequency of zero.
If one component has zero amplitude, its own phase is likewise unidentifiable.

If omega = 0 is explicitly allowed, the two terms are constants, and their
sum can still be represented as a constant cosine expression. There is no
genuine rotation or determined fundamental oscillation period. Moreover,
the differential equation f'' = 0 has affine solutions in general, so the
bare ODE-to-harmonic-form argument must not invoke the positive-omega general
solution theorem at omega = 0 without separating that case.

Source mathematical gate: PASS, including the allowed zero resultant.
Task coverage frozen for B: use 69, prove common-rotation sum by linearity,
project the vector sum, keep equal common angular frequency, and handle the
zero degeneracy honestly. A scalar calculation alone should not silently
erase the explicitly requested vector/projection argument.
No option truth set or author key consulted.

## Modern prose scientific check

Only current modern `prose[].text`, blocks 0 through 4, is judged here.

- Block 0: the two-term expression with possibly different omega_1, omega_2
  is valid. It makes no universal harmonic-closure claim for unequal rates.
- Block 1: equal-rate closure into A*cos(omega*t + varphi) is correct with
  A >= 0, allowing zero as the degenerate harmonic-form solution.
- Block 2: common omega and k = omega^2 are correct; "zero amplitude has
  nonunique phase" is explicitly present and correct. For nonzero A the
  phase is still determined only modulo 2*pi.
- Block 3: second differentiation and linearity yield f'' = -k*f exactly.
- Block 4: the harmonic-form conclusion follows with common omega > 0,
  including the zero solution; 70 supplies the separate vector proof.

The positive common angular-frequency convention is implicit, not expressly
written as an inequality in the modern prose. Keep that assumption explicit
in this review and in any candidate claim about a fundamental period.
Do not turn the zero solution into a counterexample to the algebraic
representation, and do not claim it has a definite fundamental period.
The inspected body text does not assert a least positive period for zero;
no such false statement was observed. Its title's same-period description
does not justify adding that stronger claim.

Scientific relationships: PASS with the above convention/degeneracy
qualification. No blanket HOLD over zero amplitude or nonunique phase.
The uninspected cross-reference to exercise 260 is not independently certified.

## Stop and resume boundary

Stage A is frozen before receiving any actual new candidate.
Hold only Stage B: actual figure/spec/output comparison, independent visible
question solving, every-option review and subsequent key comparison, and
the applicable desktop/mobile display evidence are absent and NOT APPROVED.
The local tiny-arrowhead uncertainty is not approval to guess source content.

Wait for the human's actual candidate and continue ONLY Stage B of this same
review. Reuse this source-first solution and its image ledger. Do not reopen
fig-21 or rereview unchanged completed lessons merely for handoff, packaging,
or repairing execution. Do not review the 38 completed lessons or other figures.
No choices, seed, canonical lesson or final figure was written by this reviewer.
