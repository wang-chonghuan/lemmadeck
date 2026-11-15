# S20 First Key Comparison

Outcome: **REVISE -- first real failure preserved.**
All four keys and all sixteen draft-option derivations agree with the frozen
blind judgments. Agreement does not clear the external author source-solution
error described below. No author repair was performed.

STEMROBIN-180, phy6-c3-s20, 2026-11-15.
Independent choice reviewer, not Feynman/the s20 author.

## First Finding

**Author-source mathematical error: newly added versus total interior lines.**
In `author-solution.md`, Source 3, line 78, the author writes:

> thirty equal intervals, twenty-nine new interior marks.

For the stated already calibrated 0, 1, 2, 3 N scale, thirty 0.1 N intervals
have thirty-one total lines. Four lines already exist, so only **27 new lines**
are needed. There are **29 interior positions** across the full 0..3 N span,
but the positions at 1 and 2 N are two of them and are already marked.
The adjective **new** therefore makes the author's count wrong under the
source/view's existing-mark condition.

The preceding author paragraph explicitly begins with already calibrated
whole-newton positions and tells the learner to repeat subdivision in
1..2 and 2..3 N. Treating line 78 as a new bare-endpoints-only task would
discard that condition. It is not silently reinterpreted to obtain approval.

Smallest affected repair unit: **the Source 3 sentence at
`author-solution.md:78` only**, distinguishing 29 total interior positions
from 27 newly inserted lines when the integer marks are retained.
The draft's own source_solution, C rationale, complete key, pure view and
coverage are correct. No option, seed or figure repair is requested.

The first `review.json` records `mathematics.verdict = revise` for
`s20-tenth-newton-scale`, with its independently correct set still `{C}`.
It is not represented as a wrong key, absent source coverage or a defect
in the approved figures. All other semantic verdicts pass on specific evidence.
Aggregate outcome remains revise until main authorizes correction and a
targeted later comparison. This first failed record must remain retained.

## Authorized Order And Hash Binding

Four independent source solutions were saved before pure-view disclosure.
The complete sixteen-option blind result was saved before this authorization.
The only new inputs were the authorized current `draft.json`,
`author-solution.md` and `author-notes.md`. No standard answer, Sagan answer,
old choice, interaction, author validation file or other lesson was opened.
No figure was reopened for approval or given a new signature.

| Record | SHA-256 |
| --- | --- |
| Seed canonical JSON | `d2f78b91fdee80f1fdc385f397ea6cbc8b898d22da45ea1958ce0bf1df31fbe9` |
| Current draft canonical JSON | `c85bc4d77a2ab5bc0b24d8148a18aad81bec870ffe81c4b4c6463de65fd5fdd5` |
| Pure view canonical JSON | `036a71c2e2efce7201d1e762b17195a1b2ec109e68e6dc5bcf9c413a2539d723` |
| Seed file bytes | `a8abefd46017ff511b088be967111b9561e55812bea36505101257b90ef82d3b` |
| Draft file bytes | `6c8328c4c16700d96b9707f57a210de4f329bff3fb59de0851bb055ac5f886bd` |
| Pure view file bytes | `fd4238dabf36798c27af7a07cc78e2b62a864c7b616952db08f194e3f0dffa85` |
| Frozen source-first bytes | `55567159569786663e7fa297382566d6003469f378b6fe8e14195572cc0e35db` |
| Frozen view-first bytes | `e7407953f0c599c36e5f33c474b50e64b4f5942f81e0dcc5678117cab3aef2ca` |
| Current author-solution bytes | `1f9ee42250a673d78d1d58cfa6a5388c430448157b4b757575a7b0ae7e0d0f5a` |
| Current author-notes bytes | `78aa45e3ea5d77b9816b19e350a835ddeb6443ef2393ac37da1b6a30d90a6a4e` |

Canonical JSON uses the contract's sorted keys, ASCII escaping and compact
comma/colon separators, UTF-8 and SHA-256. The draft's `{questions:[{id,view}]}`
projection exactly matches the frozen pure view. No options or conditions
changed between blind judgment and disclosure. Both blind documents keep
their original bytes.

The draft/seed bindings do not themselves hash the external author solution.
The latter's exact byte hash above binds this first finding; notes cannot
silently replace the arithmetic without preserving the failed snapshot.

## Source Solutions And Four-Task Coverage

1. **Instrument and principle:** Both author and reviewer identify a
   dynamometer and spring deformation proportional to force, using an
   unloaded baseline rather than total length or changing baselines.
   The new 12/14/16 cm example gives extensions 2/4 cm at 1/2 N.
   Its explicit model range means application of a given linear model,
   not independent empirical proof of suitability.
   Only `s20-deformation-principle` cites source 1, exactly as coverage lists.
2. **Construction/calibration:** Both require fixed support, moving rod/hook
   and pointer, unloaded zero, known settled calibration loads and force
   units. The fixed lower guide is not a fixed reading pointer.
   The source's 102/204/306 g are approximate total reference masses; at
   9.8 N/kg they give 0.9996/1.9992/2.9988 N. The view uses stated actual
   known 1/2/3 N references, not guessed pixel distances or exact integer
   grams. Only `s20-build-and-calibrate` cites source 2 and matches coverage.
3. **0.1 N graduation:** Author draft and reviewer agree on nine new lines
   per adjacent integer interval, ten equal gaps and thirty gaps overall.
   Only `s20-tenth-newton-scale` cites source 3 and matches coverage.
   The external author-source line-count error is retained separately;
   correct draft coverage and correct C cannot excuse it.
4. **Two purposes:** Both retain hand squeeze measured by a grip instrument
   and large pulling force measured by suitable-range traction equipment
   in the load path. Same angle does not mean same force across instruments;
   unitless dial numbers and co-motion do not provide a force unit or speed.
   Only `s20-grip-traction-judgments` cites source 4 and matches coverage.

Every selected source has exactly one explicit matching coverage record;
no source is silently omitted. Definitions remain the prepared
0/1/4/5/6/7/10 blocks. No new figure is registered.

## Complete Keys And Every Rationale

No frozen set changed after key disclosure:

| Question | Frozen set | Author set |
| --- | --- | --- |
| s20-deformation-principle | {B} | {B} |
| s20-build-and-calibrate | {D} | {D} |
| s20-tenth-newton-scale | {C} | {C} |
| s20-grip-traction-judgments | {A,D} | {A,D} |

| Unit / Option | Frozen truth | Author derivation or actual error-process comparison |
| --- | --- | --- |
| deformation A | false | Substitute loaded total length for extension, double 14 to 28, and reject the observed 16. This actually generates A, but the model concerns baseline extension. |
| deformation B | true | Subtract 12 to obtain 2/4 cm; force and extension ratios agree and F/x=0.5 N/cm. Correct misconception is null. |
| deformation C | false | Use 14-12 for the first deformation but 16-14 for the second, then mistake equal increments for equal total deformations/forces. This exactly generates C's baseline error. |
| build A | false | Confuse fixed scale backing with movable pointer, fix the pointer and assign different forces to the same position. Generates an instrument without a responding indication. |
| build B | false | Start zero at the first actual 1 N load, then count later increments as 1/2. Produces F-1 N, not absolute F. No preload-tare task was supplied. |
| build C | false | Infer that arbitrary equal distances can stand for 1 N just because response is linear. Unknown spring coefficient is never calibrated; the wrong procedure yields the asserted arbitrary scale. |
| build D | true | Moving pointer, unloaded zero and settled actual known force references establish the force scale. Correct misconception is null. |
| tenth A | false | Desired ten gaps are confused with ten total lines including endpoints, creating nine gaps of 1/9 N. The author procedure generates this option. |
| tenth B | false | Apply tenfold division to the entire 3 N span instead of each 1 N span. Base spacing is 0.3 N; original 1/2 N lines only split some gaps, leaving a nonuniform scale. |
| tenth C | true | Nine new interior lines plus two endpoints give ten 0.1 N gaps per 1 N. Draft rationale correctly states thirty total gaps. Correct misconception is null; external source error is not imported into this true alternative. |
| tenth D | false | Tenfold division is mistaken for inserting ten new interior lines, producing eleven 1/11 N gaps. The explicit false process actually yields D. |
| purposes A | true | The same normally functioning grip instrument/calibration compares the forces exerted in the two trials. It is not proof of maximum grip ability. Correct misconception is null. |
| purposes B | false | Assume a one-newton-per-numeral scale that is not shown and convert the 2..3 sector to less than 3 N. The wrong inference is false even though the actual force value remains unknown. |
| purposes C | false | Treat equal geometric deflection as a universal force unit, ignoring individual spring/mechanism/calibration differences. This generates the false necessary equality claim. |
| purposes D | true | Appropriate range, load-path connection and actual calibration are the correct traction method. Correct misconception is null. |
| purposes E | false | Infer the measured physical quantity from the instrument's co-motion and relabel force as speed. The error actually yields E, without any speed calibration. |

All eleven false procedures can produce their actual alternatives. This is
not a claim of empirically measured prevalence. All five true alternatives
have null misconceptions. A method can fail as a calibration guarantee even
if an arbitrary chosen mark happens accidentally to coincide with 1 N.

## Preserved Limits And Package Gate

**Supplied public instrument name:** Names occur in options/stems and the
grip picture caption. Source 1's unaided recall is not assessed. Author
limitations and coverage explicitly admit it. The retained task still
requires the correct proportional-deformation explanation, not just a term.

**Common making structure is supplied:** The stem and teaching picture give
backing, fixed spring top, hook/rod and guide. Choosing D does not show that
the learner designed those parts, assembled a device or placed a pointer.
Moving indication, unloaded zero and known-force reference remain separate
substantive judgments within the complete plan.

**Actual manufacture and independent expression:** Physical assembly,
loading, settled observation, mass selection/error control, precision marking,
ruler use and unaided causal explanations remain omitted. Recognizing the
plans is useful partial coverage under the current semantic gate, not full
making or graduation ability. These losses are explicitly present in author
intent and coverage rather than normalized away.

**Precision and new data:** The 12/14/16 cm data are expressly authored
conditions. The seed's approximate gram masses are not turned into exact
newtons; known force references and accurate integer lines are stipulated
in the view. The approved picture contains only 0/1 force marks, not the
view's assumed complete 0/1/2/3 N scale. No arbitrary spring constant or
physical centimetre inference is taken from screen geometry.

**Ten gaps and total/new marks:** The frozen contextual reading of uniformly
adding internal marks includes endpoint gaps. Correct answer C remains
unchanged. The distinction between existing lines and new lines is essential
to this task, which is why the author's external sentence cannot be waived.

**No dial multiplier:** Fig-66 has no numeric calibration. Fig-67's 0..5
numbers have no N/kN or multiplier; the class's large-force capacity statement
does not set that dial's multiplier. B is a false claim of numeric entailment,
not proof that the unknown actual force must be at least 3 N. No exact
reading or illustrated-device capacity is invented.

**Trials versus abilities:** Same calibrated grip-device readings compare
measured squeeze forces under ordinary functioning/range conditions, not
each person's maximum capability. Equal-angle comparisons across different
instruments have no common force calibration.

**Package redundancy/leakage:** All four tasks share calibrated force
measurement, but test baseline deformation, establishing the scale, refining
it, and instrument purposes respectively. Unmarked teaching diagrams provide
legitimate local cues; no complete key is exposed, and the later linear-range
assumptions do not settle changing-baseline or mark-count errors.
The source solutions do not become learner-facing fields.

The three `figure_checks` reuse the actual full-figure observations and seed
asset hashes frozen during source-first. They record inspection, not a new
figure approval. `new_figure_reviews` is empty because there are no new images.

## Review-Backed Validation

Exactly one review-inclusive validation is authorized for this snapshot:

```bash
env PYTHONDONTWRITEBYTECODE=1 python3 -B \
  .agents/skills/ld-s10y-choice/scripts/validate.py \
  --repo . \
  --seed .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s20/seed.json \
  --draft .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s20/draft.json \
  --review .intentfold/tickets/STEMROBIN-180/tmp/choices/phy6-c3-s20/review.json
```

Actual single invocation: **exit 3**.
Actual output: `mechanical checks passed; semantic review outcome: revise`.
The review-inclusive command accepted the structure, current seed/draft/image
binding and recorded option sets, then reported the preserved non-passing
semantic result. It was not rerun. The checker cannot inspect the external
prose arithmetic; the concrete finding and its author-file digest supply
that semantic evidence.

Only `key-comparison.md` and the new first `review.json` are written in this
stage. Frozen source-first/view-first, seed/view, author files and figures
remain unchanged. No new image, rendering, publisher, application, DB,
dependency, service or Git action is taken. No repair is attempted.
