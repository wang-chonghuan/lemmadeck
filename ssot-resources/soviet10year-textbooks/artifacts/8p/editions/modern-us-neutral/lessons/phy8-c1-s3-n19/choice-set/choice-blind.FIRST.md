# b58 Angular-Speed Choice Review: Immutable FIRST

Ticket: STEMROBIN-180.
Lesson: phy8-c1-s3-n19 (8p, modern-us-neutral).
Phase: BLIND VIEWS ONLY / FIRST / HOLD.
Review snapshot recorded: 2026-11-17T16:10:57+00:00.

## Blind Result

Visible-question semantics: PASS, with the explicit recognition/production
limitations below. All 3 questions and all 13 options have determinate truth
values under their stated conditions. No actionable mathematical, coverage,
redundancy, or answer-leakage defect was found in this visible snapshot.

This is NOT a full-draft approval, author-key agreement, answer-draft review,
schema validation, publication decision, or product acceptance result.
Author keys, rationales, binding, and full-draft limitations remain undisclosed.

## Read Order and Snapshot Identity

The first review input read was
`.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/seed.json`.
Only after that read completed was
`.intentfold/tickets/STEMROBIN-180/tmp/b58-angular-speed-choice/views-only.json`
read. The already sealed independent original-task report was then reused:
`.intentfold/tickets/STEMROBIN-180/answer-source-angular-speed-b58.md`.

| Authorized content | File-byte SHA-256 |
| --- | --- |
| seed.json | 25634f22c4777f12fa7e4c190370f4eb2a30e40c5e650648bf3a598a81661184 |
| views-only.json | 4031abb9ddb1f661d04587dd112be5564447087f55d3b8d222287a388dc9801e |
| Sealed original-task report | 8454b4f8548459c1748c0ef5a5f5a7b12594145460650fc751cd26cc1ed70824 |

These are byte hashes, not the skill contract's canonical draft digests.
The original-task report hash matches the previous seal exactly; that file
was not edited. The seed's lesson/exercises/figures trace hashes equal the
three hashes recorded in that report. The traced `book.json` was NOT opened,
nor was any source lesson file reopened or its tasks re-solved.

A structured read of the two authorized review files confirmed this same
byte-hash snapshot, exercise numbers 1-4, the question modes and option IDs,
3 visible questions, 13 visible options, and zero image references.

No `draft.json`, `source-solutions-before-options.md`, `author-binding.json`,
modern `answer-keys.json`, answer drafts, old choices/interactions/tests,
or other author's solution/calculation output was opened.
Only the relevant choice-review skill instructions were additionally read.
No image was loaded. No source-solving script, gate, validator, backend, Git,
DB, publisher, service, setup, app change, or dependency operation was used.
The only newly written artifact in this phase is this report.

## Complete Independent Truth Sets

These sets were determined from the sealed original solutions and the visible
stems/options, before any author key or rationale was disclosed.
An option containing a tuple/conjunction is true only if EVERY component is
true; a partly true tuple remains an incorrect whole option.

```json
{
  "angular-speed-definition-and-relation": {
    "mode": "multiple",
    "true": ["a", "b"],
    "false": ["c", "d", "e"]
  },
  "earth-orbital-speeds": {
    "mode": "single",
    "true": ["c"],
    "false": ["a", "b", "d"]
  },
  "clock-tower-tip-and-angular-comparison": {
    "mode": "single",
    "true": ["a"],
    "false": ["b", "c", "d"]
  }
}
```

Thus there are 4 true options and 9 false options in the 13-option package.
Neither single-choice question has a second semantically equivalent correct
option. The multiple-choice question has exactly two independently required
true statements.

## Question 1: Definition and Relation

ID: `angular-speed-definition-and-relation`.
Written-task mapping: 1 and 2. Mode: multiple. Options: a-e.

The stem specifies uniform circular motion, radius r, swept angle phi during
time t, radians, seconds, and metres. It asks for all correct statements.
This supplies the consistency conditions needed for the sealed report's
`omega = phi/t` and `v = omega r`. Interpret this as actual circular motion
with positive radius and nonzero speed, not a stationary point at the axis.
The swept-angle wording is compatible with accumulated angle, not a
modulo-one-turn position angle.

### All Five Option Checks

| Option | Independent whole truth | Evidence from sealed baseline |
| --- | --- | --- |
| a | True | `omega = phi/t` is swept angle per elapsed time. Radians divided by seconds give rad/s. Definition, formula, meaning, and unit all agree with original task 1. |
| b | True | `v = omega r` is the original task 2 relation. Holding a common positive angular speed fixed, greater radius gives greater linear speed. Both clauses are true. |
| c | False | Circular path length divided by time is LINEAR speed, in m/s. It is not angular speed. Both the identified quantity and its claimed angular-speed unit are wrong. |
| d | False | The correct relation multiplies by radius rather than dividing. `omega/r` has dimensions inverse length per time, not m/s. The claimed decrease with radius also reverses the actual fixed-omega dependence. |
| e | False | For distinct positive radii at the same nonzero omega, `v_1/v_2 = r_1/r_2`, so the linear speeds differ. Equal omega does not erase the radius factor. |

Independent true set: `{a,b}`.

### Fidelity, Redundancy, and Leakage

Task fidelity: PASS. The original definition/unit task and the
angular/linear-speed relation are both present. Merging them is coherent:
the same motion and variables connect the two concepts. It is not a series
of answer-box clicks or a substitute unrelated fact.

Redundancy: PASS. Option c distinguishes angular from linear speed; d tests
the inverse-radius mistake; e tests omission of radius entirely. They are
not duplicate correct formulations or interchangeable false propositions.
The numerical applications in questions 2 and 3 are not repetitions of this
concept-only response.

Answer leakage: PASS. The unit convention in the stem scaffolds dimensional
reasoning, but it does not state `omega = phi/t` or `v = omega r`, identify
true option IDs, or mark a correct set. The learner must still distinguish
the quantities and the radius dependence. The source mapping is outside
`view`; it is not presented as learner-facing source-number instructions.

Capacity limit: this recognizes the definition/unit and relation rather than
eliciting their free production. The stem also supplies the input units.
These are real but non-blocking losses, not proof of independent writing.

## Question 2: Earth's Two Orbital Speeds

ID: `earth-orbital-speeds`.
Written-task mapping: 3. Mode: single. Options: a-d.

The visible stem retains the given radius `150000000 km` and BOTH requested
quantities. It transparently adds the uniform-circle model, one revolution
in 365 days, 24 hours per day, and three significant figures.
The sealed 365-day baseline gives
`omega = 1.9923849908611068e-7 rad/s` and
`v = 29.885774862916602 km/s`, hence
`1.99e-7 rad/s` and `29.9 km/s`.
These values are reused, not newly source-solved here.

### All Four Option Checks

Component order below is `(angular speed, linear speed)`.

| Option | Components | Independent whole truth | Evidence |
| --- | --- | --- | --- |
| a | False, False | False | `3.98e-7 rad/s` and `59.8 km/s` are approximately twice the sealed values. The pair is internally compatible with the radius but not with the stipulated 365-day revolution. |
| b | True, False | False | `1.99e-7 rad/s` is correct; `0.0299 km/s` is approximately one thousandth of `29.9 km/s`. The distance-unit conversion is wrong. Correct omega alone does not make the pair true. |
| c | True, True | True | `1.99e-7 rad/s` and `29.9 km/s` are exactly the sealed 365-day results at the requested three significant figures. |
| d | False, False | False | `3.17e-8 rad/s` and `4.76 km/s` omit the common factor `2 pi`. They correspond to using inverse period as angular speed and radius rather than circumference as distance per orbit. They are not the orbital speeds. |

Independent true set: `{c}`.

### Fidelity, Redundancy, and Leakage

Task fidelity: PASS. Radius and both outputs survive. The added period and
precision are clearly framed as conventions for THIS question; the stem
does not falsely attribute them to the original wording. This resolves the
original period/rounding latitude identified in the sealed report.
Using pi = 3.14 with the stipulated 365 days still gives option c at three
significant figures; none of the other options is a rounding alternative.

Redundancy: PASS. One paired response evaluates the joint result. The three
false pairs distinguish scale error, km/m conversion, and missing `2 pi`.
They are materially distinct and false for the specified motion.

Answer leakage: PASS. The stem contains data and conventions, not the result
or a worked substitution. Question 1's option b offers the general relation
as an unkeyed claim, not the Earth's numerical answer. Even if that relation
is known, options a, c, and d are each approximately consistent with the
radius; the period-to-angular-speed judgment is still needed to choose c.
No other visible question supplies Earth's target pair.

Capacity limit: a learner can identify the right pair without freely
displaying the full SI conversion and two computations. The fixed year
also removes choosing/expressing the otherwise implicit orbital period or
giving the general-T solution. The coverage text explicitly records these
losses; no essential requested physical quantity is silently omitted.

## Question 3: Clock Tip and Watch Angular-Speed Comparison

ID: `clock-tower-tip-and-angular-comparison`.
Written-task mapping: 4. Mode: single. Options: a-d.

The stem preserves the generic clock tower, minute-hand length `3.5 m`,
tip linear speed, and comparison with a watch's minute hand. It explicitly
states normal timing, uniform rotation, and 60 minutes per revolution for
both. The sealed baseline is:
`v = 7 pi/3600 m/s`, `omega_tower = pi/1800 rad/s`,
and `omega_tower = omega_watch`.
Exact expressions avoid the last-digit pi-rounding boundary in that report.

### All Four Option Checks

Component order is `(tip speed, tower angular speed, watch comparison)`.

| Option | Components | Independent whole truth | Evidence |
| --- | --- | --- | --- |
| a | True, True, True | True | Both exact expressions match the sealed 3.5 m, 3600 s solution. Equal periods imply equal `2 pi/T`, hence equal angular speeds. |
| b | False, False, True | False | Denominators `43200` and `21600` encode a 12-hour period and make both speeds one twelfth of the required minute-hand speeds. Equality is true, but the numeric components describe the wrong period. |
| c | False, False, True | False | Denominators `60` and `30` encode a 60-second revolution and make both speeds 60 times too large. With the printed m/s and rad/s units this cannot be rescued as per-minute notation. Equality alone is insufficient. |
| d | True, True, False | False | The two tower speeds are correct, but `omega_tower > omega_watch` contradicts the explicitly equal revolution periods. Greater hand length does not increase omega at fixed period. |

Independent true set: `{a}`.

### Fidelity, Redundancy, and Leakage

Task fidelity: PASS. Both original asks are evaluated in one complete
calculation/comparison response. Including the tower's angular speed is a
relevant intermediate, not an invented task about the watch's tip speed.
No watch length is fabricated, and no historic setting is restored.

Redundancy: PASS. The wrong-hour-hand period and wrong-second-hand period are
different errors despite both preserving the true equality clause.
Option d isolates the radius-versus-angular-speed confusion while preserving
the two correct tower numbers. The complete tuples are distinct.

Answer leakage: PASS. Equal period is meaningful input, not an explicit
answer-key disclosure. Inferring equal omega still requires the period
relationship; moreover equality alone leaves a, b, and c. A learner must
also distinguish the one-hour period and consistent SI quantities.
The general relation in question 1 likewise does not select a on its own:
a, b, and c all satisfy `v = omega * 3.5 m`. No sibling question prints
the clock's answer.

Capacity limit: the learner is not required to write the tip-speed derivation
or argue the comparison in free text. The normal minute-hand period is
supplied rather than inferred from the device. The coverage explanation
openly notes the explicit 60-minute model; this is scaffolding, not
undisclosed replacement of the requested comparison.

## Whole-Package Source Coverage

| Original written task | Visible coverage | Retained mathematical demand | Capacity loss / limit |
| --- | --- | --- | --- |
| 1: Define angular speed and name its measurement unit | Question 1, especially a versus c | Distinguish swept angle/time from path length/time and rad/s from m/s | No free definition/unit production; input-unit convention is supplied |
| 2: State relation of angular and linear speed | Question 1, b versus d/e | Correct radius factor and fixed-omega dependence | No free statement or derivation |
| 3: Calculate Earth's angular AND linear speed for the given radius | Question 2, every complete pair | Judge both speeds, unit scale, and `2 pi`/period meaning | No written working; explicit year/precision removes convention selection and general-T response |
| 4: Calculate tower-tip speed AND compare tower/watch angular speeds | Question 3, every complete tuple | Judge tip speed and period-independent-of-length comparison | No written computation/proof; minute-hand period is supplied |

All four source numbers occur exactly in the visible package's coverage
mapping: `{1,2}` -> question 1, `{3}` -> question 2, `{4}` -> question 3.
All explicit requested quantities/conceptual distinctions are retained.
The multiple/single response units are meaningful complete propositions or
paired/triple judgments, not a separate click per written answer slot.

The visible `coverage.omitted_tasks` records the production losses for all
four sources and the general-T/convention loss for source 3. Its statement
about lost free derivation for source 2 is conservative: the original task
asks for the relation, not explicitly for a mandatory derivation.
Recognizing a correct expression does NOT prove the original free-writing
capacity. Reasonable elimination is possible but still requires relevant
mathematical distinctions; it is not mere data copying.

## Immutable FIRST Findings

Actionable defects in this blind snapshot: NONE.
Unresolved visible truth sets: NONE.

Non-blocking findings, fixed before disclosure:

1. FIRST-L1 -- Production loss: all four written tasks are now recognition
   tasks. Coverage records this; no claim of preserved free writing,
   derivation, or displayed numerical working is justified.
2. FIRST-L2 -- Scaffolding: question 1 supplies input units; question 2 fixes
   year/precision; question 3 supplies the common minute-hand period.
   These reduce unit/convention/period production demands while retaining
   the substantive judgments. They are transparent and not key leakage.
3. FIRST-L3 -- Shared concept, not copied answer: the speed-radius relation
   appears in question 1 and is applicable to both numeric questions.
   Knowing it does not uniquely resolve either numeric question; additional
   period/angle reasoning remains. No duplicate or cross-question target
   answer disclosure was observed.
4. FIRST-L4 -- Scope of evidence: only the supplied view projection was
   inspected. No assertion about runtime client payload safety, hidden
   rationale correctness, full-draft schema, author-key agreement, or answer
   draft completeness is possible yet. The `coverage.reason` reference to
   an author's frozen general solution is NOT evidence that such a solution
   exists or is correct; that file remained unread.

These are blind-phase findings, not a revised-after-keys account.

## Seal and Handoff Boundary

This complete report and its independent truth sets are made read-only after
creation. Its file-byte SHA-256 is returned outside the file as the immutable
FIRST content identity. Do not append later author comparisons to this file
or alter the already sealed original-task report.
A hash is tamper-evident identity, not an assertion of unmodifiable storage.

STOP / HOLD after this blind result. Full-draft, author-key/rationale, and
answer-draft comparison must await explicit disclosure in a later request.
No next-phase file discovery, shared DB, publication, app/dependency change,
or image loading is authorized by this result.
