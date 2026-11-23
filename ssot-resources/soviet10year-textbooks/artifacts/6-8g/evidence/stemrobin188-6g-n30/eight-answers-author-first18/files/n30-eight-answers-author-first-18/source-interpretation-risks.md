# N30 source-interpretation risks

Status: draft author notes for parent integration and review, not a gate verdict.

## UNKNOWN: exercise 378

The retained raw sentence and initial prepared sentence agree:
"求作圆周, 使在已知角两边上所截取的线段为定长."
There are no length symbols, no equation saying the lengths are equal,
no separate named lengths, no fixed radius, and no figure references.

The candidate explicitly adopts full chords with both endpoints on each
angle ray only as a conditional interpretation. It does not infer a
shared prescribed length or two separately prescribed lengths from the
unqualified wording. Symbols p,q and ell in the candidate are conditional
placeholders, not transcribed givens.

Under that full-chord interpretation, even prescribed positive lengths
leave a one-parameter family of circles. This mathematical nonuniqueness
is not itself an error in a construction problem. The UNKNOWN is the
unresolved source data and endpoint convention, not a claim that a
construction task must have exactly one solution.

The candidate covers separately supplied lengths and the equal-length
specialization, with the latter explicitly contingent on confirmation.
It covers strict-ray endpoints versus the shared-vertex boundary.
No authoritative endpoint/length interpretation is asserted.
The parent should decide the source wording before making this key
authoritative. No additional scan or figure access is requested here.

## 374.2: altitude to a leg or its supporting line

The conventional altitude to a side is the perpendicular distance to
its supporting line, including an extension. This admits every 0<h<a.
For h<a/sqrt(2), the isosceles triangle is obtuse at its apex and the
perpendicular foot is beyond that apex on the leg's extension.
If the curriculum requires a foot on the actual leg segment, the valid
range changes to a/sqrt(2)<=h<a; strict interior excludes equality too.
The source does not explicitly impose that stricter condition.
Both branches are stated rather than hiding an extra restriction.

## 377 and 380: zero-length tangent segments

"切线为定长" and "切线等长" are interpreted as finite tangent segments
from the point to the tangent contact, not infinite tangent lines.
The source does not explicitly resolve whether a contact point with
length zero is included in a locus. Both conventions are reported:
377 at a=0 is the original circle or empty; 380 includes or excludes T.
For the ordinary positive external tangent-segment convention, exclude
the zero-length contact boundary.

## 379: unspecified distinctness and tangency type

The candidate does not assume the prescribed M differs from the
original tangent point T. M=T yields infinite families, including both
internal and external tangency. Identical circles are not "tangent"
distinct circles, and radius-zero objects are excluded.

Part 2 implies M is on the known circle; otherwise there is no solution.
The point diametrically opposite T gives no distinct circle, even though
the original circle satisfies the equal-distance center equations.
Generic M gives one external solution, not an internal/external pair.

## Provenance and schema limits

No retained `answers.json` was available at the exact checked locations
recorded in the manifest. No other lesson answer keys or choices were
read. All eight entries use `source: derived`, omit `bookRaw`, and keep
`status: draft`. The initial prepared text, not a later mutable canonical
lesson, is the answer authority for this candidate.

All eight entries are ungraded. Each requested subpart is individually
labeled in `displayAnswer`; `parts` stays empty because the current
schema implementation rejects nonempty parts for an ungraded answer.
No guessed judge or expected string is used to conceal a source ambiguity.
