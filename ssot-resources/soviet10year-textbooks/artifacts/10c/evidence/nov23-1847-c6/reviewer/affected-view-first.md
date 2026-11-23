# Affected View-First Freeze

STEMROBIN-184 / `10c` / `ana10-c6-ex`.
Sole root: `/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-184`.

**Affected visible outcome: revise. Internal comparison remains unauthorized.**

This is an affected continuation by the same independent reviewer, not a new
blind whole-package review. Original keys were disclosed during the completed
original internal comparison. The changed view file is key-free, but prior
knowledge is not erased. No revision1 draft, repair manifest or keys were opened.
Existing frozen source solutions and the original three review judgments were
used as context; sources were not re-solved and unrelated questions were not
replayed. The original source-first, view-first and official review files were
not changed.

## Actual Changed-View Binding

Input: `.tmp/stemrobin-184-six/c6-resume/revision1/question-views.json`.
Actual byte SHA-256:
`5ac3f99f84e99a8f11fa4a209462944e929adb0678efcc25c4d78af4e46b7ff3`.
Canonical JSON SHA-256:
`5dd5e8c069bf0437144e099d298918e9c395c5a5f366440de47211ae5cdb1d9a`.

Exactly three id/view records and nine options were read: 370, 372 and 373.
Seed identity remains
`975572b776f0d768d41ad48d2bc5f45c2c1ce80f6c6fa727171d7e39107fe5a8`.
The accompanying JSON freezes every option's truth, its calculation or
counterexample, the complete true sets, conditions and affected judgments.

## c6-370

The frozen source requires principal inverse evaluations before obtaining the
sum. Both arguments are in [-1,1]. The specified inverse ranges are [0,pi] and
[-pi/2,pi/2].

- a: False. cos(0)=1, not 0, so arccos(0) cannot be 0. The other inverse
  value pi/4 is correct. The displayed claimed pair nevertheless sums to pi/4.
- b: True. cos(pi/2)=0 and sin(pi/4)=sqrt(2)/2, with both values inside their
  principal ranges. The independently justified sum is 3pi/4.
- c: False. sin(3pi/4)=sqrt(2)/2, but 3pi/4 is outside the arcsine range.
  The arccos value is correct. The displayed claimed pair sums to 5pi/4.

**Complete true set: {b}.** Mathematical truth checking passes. Fidelity and
leakage remain revise: adding the displayed pairs gives pi/4, 3pi/4 and 5pi/4.
Only b matches the target supplied in the stem. A learner can therefore select
it by arithmetic without testing either inverse claim or its branch.
The explicit conclusion-copying clause is gone, but a complete target-matching
shortcut remains. Recognition itself is not the reason for revision.

Redundancy passes within the affected scope and existing original context:
the mixed arccos/arcsin evaluation is distinct from inverse oddness in 372 and
the different tangent/cotangent branches in 373.

## c6-372

The frozen source uses principal arcsine at two opposite arguments in [-1,1].
Sine is odd and strictly increasing on [-pi/2,pi/2], mapping that symmetric
interval bijectively to [-1,1]. Its inverse is consequently odd.

- a: False. sin(5pi/4)=-sqrt(2)/2, but 5pi/4 is outside the principal
  arcsine range. The positive inverse value pi/4 is correct. The displayed
  claimed pair sums to 3pi/2.
- b: False. Equal input magnitudes do not imply equal signed inverse values.
  sin(pi/4) is positive, so pi/4 cannot be the inverse of the negative input.
  The displayed claimed pair sums to pi/2.
- c: True. Oddness plus the bijective restriction gives an odd inverse:
  if sin(v)=u, then sin(-v)=-u, and uniqueness fixes the inverse value at
  -u to -v. Thus the two inverse values are -pi/4 and pi/4, both in range.

**Complete true set: {c}.** Mathematical truth checking passes. Fidelity and
leakage remain revise: c alone displays an opposite pair summing to the
stem's zero target; a and b display nonzero sums. Checking this visible
cancellation alone selects c without evaluating inverse oddness, injectivity
or the principal values. The presence of a valid proof in c does not make
that proof necessary for selection.

Redundancy passes within the affected scope and existing original context:
inverse oddness is a distinct intended inference, not a repetition of 370's
mixed inverse evaluation or 373's mixed tangent/cotangent branch verification.

## c6-373

The frozen source requires arctg(-1) and arcctg(1) on the respective open
principal ranges (-pi/2,pi/2) and (0,pi). Both inverse functions admit the
real inputs. No endpoint or undefined tangent/cotangent is used here.

- a: False. tan(3pi/4)=-1, but 3pi/4 is outside the arctangent range.
  The cotangent inverse pi/4 is correct. The displayed claimed pair sums
  to pi.
- b: True. tan(-pi/4)=-1 and cot(pi/4)=1; -pi/4 and pi/4 lie in the
  respective principal ranges, so uniqueness gives the stated inverse
  values. They sum to zero.
- c: False. The arctangent value -pi/4 is correct, but -pi/4 is outside
  the specified inverse-cotangent range and cot(-pi/4)=-1, not 1.
  The displayed claimed pair sums to -pi/2.

**Complete true set: {b}.** Mathematical truth checking passes. Fidelity and
leakage remain revise: the displayed pairs sum to pi, zero and -pi/2.
Only b matches the supplied zero target. Its inverse evaluations and two
different branch checks can be ignored while still selecting the answer.

Redundancy passes within the affected scope and existing original context:
the tangent/cotangent pairing has different branches and differs from the
earlier two-tangent task noted in the original review.

## Affected Requirements and Limits

All three units still need a view-level repair that makes decisive inverse
evaluation, branch validity or proof inference necessary, rather than permitting
selection solely by matching a displayed pair's arithmetic sum to the supplied
right-hand side. Do not normalize the frozen true sets to later author keys.
No alternative candidate was constructed here.

The full conditions, mathematical distinctions and substantive correct
reasoning remain available in the views, and no scientific ambiguity requires
a HOLD. The defect is their bypassability, not recognition as a response mode.
No new redundancy failure is found. This affected scope does not claim a new
audit of unchanged whole-package cross-question relationships.

The five metadata-loss revisions and the original 389/a misconception finding
remain unresolved pending explicit authorization to compare the revised
internals. Nothing in this view-only freeze waives or approves them.
There is no official revised review, changed-draft binding or semantic approval.

Images: 0. No candidate/canonical edits, validator, renderer, finalizer, Git, DB,
environment-secret read, network, dependency, keyboard, app, agent or peer
operation was performed. Model and hidden cost remain UNKNOWN.
