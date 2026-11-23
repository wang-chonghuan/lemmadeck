# Second Affected View-First Freeze

STEMROBIN-184 / `10c` / `ana10-c6-ex`.
Sole root: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

**Affected visible outcome: pass. Revised internal comparison is pending.**

This is the same independent review's affected continuation. Original keys
were previously disclosed, so this is not a fresh blind review. Only
revision2/question-views.json was opened as new input. Revision2 draft, repair
manifest and keys were not opened. The unchanged source solutions were reused
from retained context; no source was re-solved, and none of the other 51
questions or the accepted five metadata/389/a dispositions was re-reviewed.
No prior artifact was modified.

## Actual Input Binding

Input: `.tmp/stemrobin-184-six/c6-resume/revision2/question-views.json`.
Actual bytes: 2614.
Byte SHA-256:
`5bf856a8f09392660188bbf0e5c1fe466393f7512a66fcc70c5d37f1f462626a`.
Canonical JSON SHA-256:
`2ef4aa9caab29f41d84273de98903b8fd9536c6a6ab4b457f47f99a6842114fc`.

Exactly three id/view records, nine options and no figure references were read.
The retained seed identity is
`975572b776f0d768d41ad48d2bc5f45c2c1ce80f6c6fa727171d7e39107fe5a8`.
All nine option checks and complete true sets are frozen in the accompanying
JSON. No revised draft binding or whole-package approval is claimed.

## c6-370

Both source inputs are in [-1,1]. The stated ranges are [0,pi] for arccos
and [-pi/2,pi/2] for arcsin.

- a: False. cos(pi/4)=sqrt(2)/2, not 0, so arccos(0) is not pi/4.
  sin(pi/2)=1, not sqrt(2)/2, so the arcsine value is not pi/2.
  Both proposed angles are in the stated ranges; range checking alone cannot
  rescue these wrong forward-function evaluations.
- b: True. cos(pi/2)=0 and sin(pi/4)=sqrt(2)/2, with both angles in
  their corresponding principal ranges. The valid inverse values are pi/2
  and pi/4.
- c: False. cos(0)=1, not 0. Although sin(3pi/4)=sqrt(2)/2,
  3pi/4 is outside the arcsine principal range.

**Complete true set: {b}.** All three displayed pairs sum to 3pi/4:
pi/4+pi/2, pi/2+pi/4, and 0+3pi/4. Consequently the stem's target no
longer selects an option. The alternatives distinguish swapped special-angle
inverse values from the valid values and a nonprincipal inverse branch.
Fidelity, leakage and mathematics pass for the actual visible unit.

## c6-372

Both source inputs are in [-1,1]. Sine restricted to [-pi/2,pi/2] is
odd and strictly increasing onto [-1,1], so its inverse is unique and odd.

- a: False. sin(-3pi/4)=-sqrt(2)/2 and sin(3pi/4)=sqrt(2)/2,
  but both proposed inverse values are outside [-pi/2,pi/2]. The forward
  equalities do not establish principal inverse values.
- b: False. sin(pi/4)=sqrt(2)/2 has the wrong sign for the negative input,
  and sin(-pi/4)=-sqrt(2)/2 has the wrong sign for the positive input.
  Both proposed angles are in range, but both inverse claims are false.
- c: True. For sin(v)=u on the symmetric principal interval, oddness gives
  sin(-v)=-u, and uniqueness gives arcsin(-u)=-arcsin(u). The proposed
  values -pi/4 and pi/4 are in range and their sine values match the
  respective negative and positive inputs.

**Complete true set: {c}.** Every displayed pair sums to zero: -3pi/4+3pi/4,
pi/4-pi/4, and -pi/4+pi/4. Cancellation or the supplied zero conclusion
alone no longer distinguishes c. The alternatives contain substantive
principal-branch and sign errors versus a valid inverse-oddness argument.
Fidelity, leakage and mathematics pass for the actual visible unit.

## c6-373

The source real inputs are admitted by arctg and arcctg. Their explicitly
specified principal ranges are (-pi/2,pi/2) and (0,pi). All proposed
forward tangent/cotangent evaluations are defined; no singular endpoint is used.

- a: False. tan(3pi/4)=-1 and cot(-3pi/4)=1 are both true, but
  3pi/4 is outside the arctangent range and -3pi/4 is outside the
  inverse-cotangent range. Neither is the claimed principal inverse.
- b: True. tan(-pi/4)=-1 and cot(pi/4)=1, and the two angles belong
  to their corresponding principal ranges. Uniqueness on each branch
  justifies the inverse values -pi/4 and pi/4.
- c: False. tan(pi/4)=1, not -1. cot(-pi/4)=-1, not 1, and the
  proposed inverse-cotangent value is also outside (0,pi). The arctangent
  angle is in its range but has the wrong forward-function value.

**Complete true set: {b}.** The three displayed pairs all sum to zero:
3pi/4-3pi/4, -pi/4+pi/4, and pi/4-pi/4. The supplied zero target no
longer identifies b. Distinguishing periodic representatives from principal
inverse branches, and checking signs, are genuine mathematical judgments.
Fidelity, leakage and mathematics pass for the actual visible unit.

## Redundancy and Cross-Question Scope

Within these three changed units, 370 tests a mixed arccos/arcsin evaluation,
372 tests opposite arcsine inputs and a valid inverse-oddness inference, and
373 tests different tangent/cotangent principal branches. They are not
duplicates of one response task.

The positive arcsine value is shared by 370 and 372 and can be reused after
it has been established. This is not a claim that 372 independently re-tests
its discovery. No affected stem supplies that principal value as an already
given answer, and target-sum matching no longer resolves any unit.
Reusing a mathematically established value or eliminating an alternative by
a relevant range/sign check is ordinary mathematical elimination, not an
automatic failure of recognition. No fresh whole-package dependence audit
is claimed.

The correct alternatives in 372/373 contain more explicit proof language
than the wrong value-pair assertions. That asymmetry does not logically
certify correctness: all alternatives have the same numeric conclusion,
and the actual inverse, sign and range claims supply the substantive
distinctions. No unique verification-conclusion label remains.

Recognition of a valid argument does not demonstrate independent written
proof production. This view-level pass makes no such capacity claim and
does not replace the pending author-rationale/misconception comparison.

## Disposition and Limits

All three affected fidelity, redundancy, leakage and visible mathematics
checks pass. All nine truths are determinate; the complete sets are {b},
{c}, {b}, respectively. No view-level repair requirement or scientific
HOLD is found in this snapshot.

The original and revision1 failures remain preserved as historical,
snapshot-bound findings; they are not rewritten or retroactively waived.
The already accepted five metadata and 389/a procedure passes are retained
without re-review. Source 350 is unchanged; no extra graph demand is made.

No official revision2 review or semantic approval is issued. Wait for explicit
revised internal-comparison permission. Images are zero. No candidate/canonical
edit, validator, renderer, finalizer, Git, DB, environment-secret read, network,
dependency, keyboard, app, agent or peer operation was performed.
Model and hidden costs remain UNKNOWN.
