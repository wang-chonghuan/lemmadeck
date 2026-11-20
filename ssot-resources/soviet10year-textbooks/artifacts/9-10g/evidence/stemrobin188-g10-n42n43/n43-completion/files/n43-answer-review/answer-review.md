# N43 New Standard Answer Independent Review

Semantic outcome: PASS for every exercise 8-15; no required candidate repair.
This is NOT a mechanical-finalize, actual-keyboard, publish or closure approval.
Real MathLive keyboard contract: NOT RUN, pending the parent's finalize.

## Snapshot and Independence

Candidate:
`.intentfold/tickets/STEMROBIN-188/tmp/n43-answer-author/work/9-10g/modern-us-neutral/lessons/geo910-c2-s1-n43/answer-keys.template.json`.
Raw SHA-256:
`a9d4f1a7cd7fd01f17c3abe40dc987fd26ed6004880f633d7009b82a942192b7`.
The JSON report additionally binds its canonical hash and all current inputs.

The ONCE independent solutions were persisted in
`../n43-choice-review/FIRST-source.md` before any draft view, private key or
answer candidate was read. Views and all 32 option checks were also persisted
before private choice comparison. The NEW answer candidate was read only
after choice review.json had been written. It was compared LAST, not used as
authority. No book answers, old answers, old choices, interactions or history
were consulted.

The durable modern exercises.json and figures.json both have status ready.
All eight candidate prompts, exercise/source numbers and g1/习题 identities
match those modern exercises exactly; seed texts add only the group header.
Exercise 14 alone references fig-g10-05, and its figureEvidence identifies the
same original PNG, current modern SVG and current FigureSpec as the ready
manifest. The original and modern images were already opened in phase 1.

## Per-Exercise Results

| Exercise | Verdict | Concrete evidence |
| --- | --- | --- |
| 8 | PASS | Four norms sqrt(3),sqrt(14),sqrt(2),2; display derives all four and four numeric labels retain original order. |
| 9 | PASS | 3t^2=9 gives both uniform-sign triples. One exact complete-set part lists the same set in two member orders; no lone-sign or mixed-sign answers and no independent coordinate boxes. Actual exact normalization/edit gate remains pending. |
| 10 | PASS | Sums (4,2,-3) and (0,0,0) give sqrt(29),0. Both subparts and cancellation are shown. |
| 11 | PASS | Weighted sums (8,2,-2) and (6,5,-3) give 6sqrt(2),sqrt(70); coefficients, signs and both subparts are preserved. |
| 12 | PASS | Dot 12, lengths 3,9 give ANGLE arccos(4/9), not cosine 4/9. Numeric expected is that angle, label 夹角, unit rad, tolerance 1e-6. Its value is 1.1102423351135742 rad or 63.61220003875701 degrees. |
| 13 | PASS | Derived vectors (-1,3,1),(3,1,1), dot 1, norm product 11 give the requested dimensionless cosine 1/11. |
| 14 | PASS | Same-direction unit-vector proof explicitly uses positive 1/L; squared-cosine proof follows; complete gamma set 45/135 is demonstrated by two unit-vector witnesses. No acute/r>0 assumption. Entire proof exercise appropriately ungraded with parts empty. |
| 15 | PASS | All twelve ordered i,j,k cosines: (sqrt(3)/3,sqrt(3)/3,sqrt(3)/3), (0,-3/sqrt(10),-1/sqrt(10)), (-1,0,0), (0,3/5,4/5). Labels identify each vector subpart and basis, with no lost zeros or negative signs. |

Coverage is exactly 8 answers: 7 auto, 1 ungraded; 23 parts: 22 numeric and
1 exact complete-set part. Exercise 14 has all three displayed subparts even
though its proofs are not automatically judged. All eight source fields are
derived; no bookRaw or invented book-answer provenance is present. No physical
units were specified for norms/cosines; no units were invented. Radians are
explicit for the sole angle field; degree equivalents are displayed.

## Reliable Task Targets and Remaining Gate

Exercise 9 expected strings represent the whole correlated coordinate set,
not separate +/- coordinate choices. The two allowed orders contain exactly
the two complete valid triples. A mixed-sign triple violates the equal-coordinate
condition; a single uniform triple is incomplete. Neither is whitelisted.
Exact judging is intentionally representation-limited; this review does not
claim it accepts every algebraically equivalent set notation.

Exercise 12 requests an actual angle. The expected arccos value is finite and
unique on the ordinary vector-angle domain; raw cosine 4/9 is about 0.6658 rad
away, far beyond the tolerance. The shown rounded radian value differs by
3.5113574e-8 rad, within tolerance. A bare degree number is not the same radian
number; editor/parser/unit acceptance has not been executed by this reviewer.

Gate 2 still requires actual MathLive keyboard input/deletion, an input event,
unchanged mathematical content, and normalized reserialized .value for BOTH
exact alternatives. Setter caching, exact expected/self-string equality and
semantic set inspection do not establish that gate. Numeric parser execution
is likewise not claimed here. Parent finalize must establish the mechanical
contract; this review neither runs nor substitutes for it.

## Figure and Scope

Inherited N43 modern figure PASS stays inherited. Actual opens total 2:
modern fig05 full approved preview and original fig05 raw PNG, both in phase 1.
Context image count 2/24, batch count 2/8; no answer-phase reopen or crop.
No candidate repair, author PASS rerun, finalize, retention, DB, env,
installation, network/paid action, Git, other-agent contact, deploy or closure.
Writes are confined to the two explicitly owned reviewer directories.
