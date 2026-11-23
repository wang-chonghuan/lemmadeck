# STEMROBIN-187 N60 STAGE2: visible-only notes

## Boundary and comparison phase

The sole candidate material read is
`.tmp/stemrobin-187/n60/choices/review-views.json`: 14 questions, 58 options,
13 native single questions and one native multiple question. Its question
objects contain only id, source_numbers and view. No author key, intent,
report, draft, answer, test or other internal artifact has been opened.

Source authority and mathematics remain the received STAGE1 checkpoint:
`reviewer-source-solutions.md`, SHA-256
`f5540bd5bd419573bafcd5b8df717112612195e72b08553e1e5a10601e434c44`.
It is not edited. Its seed binding and complete-preview observation are reused.
No full original-source re-solve, source-image reopen or rerender is performed.

Candidate projection raw SHA-256:
`9b2d3215f22ec57e2cc31d8e36c9e558dada53c6483f7cfd710a22ce1006b3ba`.
Candidate projection canonical SHA-256:
`67d96be9d6ca9742dd390a4b72bddbef978cb959ce270a7b4cbc9a90eddf1c17`.

The following task/fidelity, redundancy and leakage comparison is recorded
separately from option truth. It contains no inferred author key.

| Question | Task fidelity | Redundancy and dependence | Leakage |
| --- | --- | --- | --- |
| n60-bounds | PASS: all three original decimals retain adjacent lower/upper bounds AND nearer natural number in a complete table. | PASS: one coherent table, not three cell clicks. This input set is not reused elsewhere. | PASS: no source number or answer cue is visible; candidate tables require comparing distance and bounding relations. |
| n60-units-series | PASS: all six inputs, original order, direct units rounding, and block 10's upward-five convention remain visible. | PASS: one complete row includes small decimals, a tie and a double-rounding-sensitive input; later units questions have different inputs. | PASS: the stated tie rule is a permitted definition, not a disclosed result; all rows have the same six-entry form. |
| n60-crate-precision | PASS: 16.38 kg and both separately requested units/tenths weights remain. | PASS: a paired-precision decision is not duplicated by any other question. | PASS: all options present two labeled kg values in the same form. |
| n60-tenths-five | PASS: all five inputs of 1012(a) and tenths precision remain. | PASS: splitting 1012 by requested precision is mathematically meaningful; the hundredths/tens groups use different inputs and cannot supply this row. | PASS: every row has five comparable one-decimal-place results; the visible rule does not reveal the selected row. |
| n60-hundredths-five | PASS: all five inputs of 1012(b) and hundredths precision remain. | PASS: no individual-cell questions or cross-row answer dependency; this group is distinct from the tenths/tens groups. | PASS: all rows retain five two-decimal-place displays, including a deliberately coarser-rounding alternative in comparable notation. |
| n60-tens-four | PASS: all four inputs of 1012(c), direct tens rounding and order remain. | PASS: rounding integer places tests a different boundary from the neighboring precision groups. | PASS: all options give four integer values; no visible correct-result annotation. |
| n60-reception-regions | PASS: A-only, B-only, both and the separate intersection query all remain, with the same retained fig-225. | PASS: native multiple selection judges six independent membership statements, rather than using combination-code options or per-region yes/no questions. No other question supplies the region classification. | PASS: the intersection assertions deliberately share wording across contrasting regions; conjunction detail alone does not identify correctness. |
| n60-product-sum | PASS: both repeated-addition representation and evaluation of 2.75 x 3 remain. | PASS: one equality combines the two original tasks without splitting addends into trivial clicks. | PASS: all four options are definite equalities; more than one uses the same repeated-addition form. |
| n60-fabric-fractions | PASS: equal parts, the 3/5 allocation counts and fractions of the original whole remain. Dress/blouse pluralization does not change the mathematics. | PASS: both garment fractions are judged together, not as independent denominator guesses. | PASS: all options use the same garment order and fraction notation. |
| n60-pool-model | PASS WITH EXPLICIT CHANGE: both original times and the fraction task remain; initial emptiness, constant filling rate and no losses are NEW visible assumptions sufficient to fix the original model gap. The original unconditional HOLD persists. | PASS: this is proportional elapsed-time reasoning, not a repeat of the cloth's part-count reasoning. | PASS: the assumptions determine a model rather than revealing an answer; all options are simple exact fractions. |
| n60-units-five | PASS: all five inputs of 1017(a) and units precision remain. | PASS: the group has different inputs from 1010 and retains its own near-threshold cases. | PASS: all options have five integers and the same ordering. |
| n60-tenths-four | PASS: all four inputs of 1017(b), tenths precision and carry-sensitive input remain. | PASS: independent from 1017(a); no answer copied from another item, although the same allowed rounding rule recurs. | PASS: every row has four one-decimal-place values, so display precision alone is not a key cue. |
| n60-lines-angle-record | REVISE FOR POINT-PLACEMENT CLARITY: retains complete lines, a construction plan, the original 155-degree angle and all three other named angles. OD is explicitly opposite OB, but OC is never explicitly opposite OA. The phrase "other three angles" suggests the intended four-sector configuration; the construction instructions should state it rather than leave C's side implicit. Recognition still cannot demonstrate actually drawing either line. | PASS: construction and all three angles form one task; no other question provides either. Repeated plan text is not duplicated mathematical options because angle records differ. | PASS: several alternatives share the same intended full-line plan, so valid-plan wording is not an exclusive clue. A shared missing point-placement condition is a clarity defect, not an author-key cue. |
| n60-nested-calculation | PASS: every operand, bracket, parenthesis, multiplication, division and final subtraction remain. | PASS: the whole nested calculation is one response; no intermediate result appears as another question's answer. | PASS: ":" is openly defined as division, and all options are comparably formatted integer results. |

## Package-level comparison

No source exercise numbers occur in a learner-facing stem or option. The
source_numbers arrays and question IDs are internal mapping metadata, not
learner text. There are no external source references or cross-question
answer references.

Every selected source is represented. The 1012 split follows its three
different target precisions, and the 1017 split follows its two precision
groups; neither subdivides a single row into arithmetic clicks. Repeated use
of the same general rounding rule is legitimate concept practice, not leakage.
All datasets are retained with their requested precision and original order.

Complete-table recognition retains mathematical distinctions but cannot prove
that a learner independently writes every table entry. Likewise recognizing a
construction plan does not prove the physical drawing task in 1018. These are
production limitations, not silently completed capabilities.

The original 1016 statement remains underdetermined. Its candidate explicitly
adds the previously missing model assumptions, so its eventual answer may be
judged under those visible assumptions only. A mathematical result for that
candidate is not retroactive approval of the original unconditional source.

## Image accounting

STAGE2 new image loads: 0. Cumulative image loads: 1, in one STAGE1 batch.
The full approved fig-225 preview was opened once in STAGE1; zero reopens,
zero crops, zero source-page loads and zero other images. Its observations
are reused without reapproval. No image payload is returned to the parent.

Retained SVG SHA-256, checked against the seed once in STAGE1:
`f83ab314a783706359555dc7483ed70532415ea5e560b1a2fdcd2aff61486f68`.
Approved preview SHA-256, recorded in STAGE1:
`df64653c2246703fa39173034c3ba562c482a88af975b9cc88b57f326a6593f2`.

## Independent visible-option phase

Every one of the 58 visible options has a separate truth observation and
mathematical justification in reviewer-visible-checks.json. Incorrect options
also have independently reconstructed possible error procedures; these are
not claims about an unseen author's intended derivations.

| Question | Independently determined complete true set |
| --- | --- |
| n60-bounds | c |
| n60-units-series | a |
| n60-crate-precision | d |
| n60-tenths-five | b |
| n60-hundredths-five | c |
| n60-tens-four | a |
| n60-reception-regions | a, c, e |
| n60-product-sum | b |
| n60-fabric-fractions | c |
| n60-pool-model | d, under its explicit NEW model assumptions |
| n60-units-five | b |
| n60-tenths-four | c |
| n60-lines-angle-record | Conditionally a if OC is opposite OA; not unconditionally approved as written |
| n60-nested-calculation | d |

Result counts: all 14 questions and all 58 options checked; 13 determinate
question true sets and one conditional question true set. Option counts:
15 true, 42 false and one conditional (geometry option a). The multiple
question has exactly three true statements, a/c/e; its six statements were
checked separately, including both clauses of e and f.

No equivalent option pair or random-neighbor distractor was found. Examples
that need more than a label to justify their incorrect value:

- Product 6.225 can result from computing 2 x 3 = 6 and 75 x 3 = 225, then
  concatenating those results as 6.225 rather than adding 6 + 2.25.
- Hundredths row b's 0.08 can result from wrongly checking any discarded
  digit in tail 268, rather than just its first digit 2. That same procedure
  reproduces its other four entries.
- Units row d for 1017 can result from using the retained integer units
  digit 1,1,7,7,2 as the rounding trigger instead of the tenths digit.
- Three angles of 68 1/3 degrees can result from (360 - 155)/3, wrongly
  splitting the remaining total equally instead of respecting straight-line
  and opposite-angle relations.

These errors produce definite false options, not mathematically equivalent
forms of a true result. Comparable notation and length are retained within
each item. Successful elimination by substantive mathematics is not leakage.

## REVISE: 1018 point-placement clarity

The geometry item asks for the angles BOC, COD, DOA of two complete lines
AC and BD. Options a/b/d explicitly extend OB to the opposite ray OD.
They never explicitly place C opposite A across O.

If OC is opposite OA, the intended four-sector geometry gives BOC=25,
COD=155 and DOA=25 degrees. Then a is the complete true set. This intended
calculation is correct; the finding is NOT a claim of a wrong numerical
answer or an invalid opposite-OB extension.

But "draw line AC through O" by itself does not construct C's side. For a
literal point-placement counterexample, take O=(0,0), A=(1,0), C=(2,0),
OB at 155 degrees and OD at 335 degrees. AC is still a complete straight
line through O, BD is still another complete straight line through O,
OB/OD are opposite, and AOB is 155 degrees. The named tuple BOC,COD,DOA
is now 155,25,25, not 25,155,25.

The phrase "the other three angles" suggests that four distinct sectors and
opposite A/C rays are intended; treating that phrase as a configuration axiom
would yield a. Rather than silently relying on that reading in a construction
recognition item, make it explicit: choose A and C on opposite sides of O,
or state that OA and OC are opposite rays. Keep the explicit OB/OD opposite-ray
extension and the request for all three named angles.

Options b/c/d fail independently of approving a: b incorrectly gives DOA
as 155 despite the opposite-OB extension; c uses B and D on the same ray and
does not construct the required full BD line through O; d incorrectly
assigns equal thirds of the 205-degree remainder. Option a alone remains
conditional on the missing C-placement instruction.

This is an affected-only visible clarity REVISE. No draft or option is edited.
The other 13 visible questions have supported complete true sets. Actual
physical drawing is still not demonstrated by choosing any written plan.

## Freeze and stop

STAGE2 outcome: REVISE for the one geometry clarity finding. This is not a
whole-choice-set PASS or a formal review. All other per-question fidelity,
redundancy, leakage and mathematics evidence is retained without normalizing
to an author key. The original unconditional 1016 HOLD remains, while its
newly conditioned visible candidate is mathematically determinate.

Hash the final saved bytes of reviewer-visible-checks.json and this file.
Record the received source-solutions hash as unchanged. Do not append the
files' own hashes inside them or edit their bytes after this freeze.

Author keys, intent, reports, full drafts, answers and tests remain unread.
No formal review, validator, draft edit, new figure or STAGE3 comparison
was performed. STAGE2 added zero images; cumulative count remains one.
Return text paths, current hashes, this finding and the condition boundaries,
then STOP for the owner's explicit STAGE3 authorization.
