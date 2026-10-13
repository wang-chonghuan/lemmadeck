# Authoring

## Establish the Mathematics

Use `prepare.py inspect` to see only exercise prose, referenced figure IDs and
candidate lesson paragraphs. This inventory is not the authoring seed: select
actual definitions explicitly with `--concept-block`. Indexing is zero-based in
`lesson.prose`; a paragraph is copied in full, not silently summarized.

The preparation tool reads only `<book>/book.json` and the selected modern
lesson's `lesson.json`, `exercises.json`, `figures.json`, plus referenced image
bytes for hashing. It projects known fields, never copies an object wholesale.
It neither infers concepts nor generates questions. If prose itself contains a
solution or an obsolete input instruction, stop and obtain a clean written seed;
whitelisting keys does not sanitize meaning.

Read all conditions, units, endpoint conventions and labels. Open the actual
PNG/SVG, not its spec, render log, review or filename as a substitute for seeing
it. For SVG, view a complete rendering and confirm the rightmost and bottommost
objects are visible; a cropped thumbnail or SVG text inspection is insufficient.
Record relevant observations in `intent.figure_observations`. When the lesson
uses a different convention from a familiar modern definition, use the supplied
definition consistently. Ask when it is missing or contradictory.
For example, if a source uses `N` and the available lesson definitions do not say
whether it contains zero, do not introduce a convention to make a table unique.
Record the missing convention as blocked. If authoring cannot start, retain the
seed and a concrete blocker report; do not fabricate a keyed draft for validation.

Before considering any alternatives, record:

- What the learner must determine or construct.
- An independent solution of the full selected source task, with conditions and
  any ambiguity. Use exact arithmetic where appropriate.
- The conceptual distinction the response should reveal.

Measured tables need not be exactly linear. An approximate-model question may
state an explicit error criterion as a new visible condition, retain every
measurement, and record the change from exact proof to model judgment in
coverage. Do not silently round the seed or claim unique exact parameters.
In numerical sets, equal fraction spellings denote the same element; use
unambiguous equivalent forms rather than counting representation duplicates.

## Choose the Response Unit

The number of blanks, list entries, printed letters or requested values does not
determine the number of questions. Explain the chosen unit in `unit_reason`.
Fidelity means preserving the mathematical distinctions, key relationships and
task coverage, not proving independent writing or construction through a choice
response. A complete-table or drawing-recognition question can be faithful;
reasonable elimination is normal mathematical thinking in this format. Still
record lost production ability. Block when that loss destroys the learning task,
or revise when the item becomes mere data copying, removes a key task, leaks the
answer or needs no substantive mathematical judgment.

| Written task | Useful choice unit |
| --- | --- |
| Several diagrams judged by one definition | One `multiple` question selecting all qualifying diagrams. Labels alone can be options when the shared image is fully visible. Do not replace this with per-diagram yes/no clicks or combination-code choices. |
| A table, correspondence, domain/range or pattern | A complete coherent table/result, or a meaningful segment that retains the rule, order and boundary cases. Include enough information to settle the same task. Do not turn each cell into an arithmetic click. |
| Expression, derivation or word problem | A complete result with units/conditions, or a decisive mathematical judgment. If selecting an intermediate claim, ensure it captures the essential inference rather than a minor computation. |
| Truly independent problems | Separate questions may be appropriate. Explain independence mathematically; printed subpart letters alone do not justify splitting. |
| Drawing or construction | Recognition of a completed correspondence, graph property or construction may be useful, but is not evidence of producing the drawing. Name the lost production skill internally; record the omitted task in coverage. Block if that loss defeats the intended task. |

Multiple seeds may support one question only when they form a genuinely coherent
mathematical task. One seed may yield several independent tasks, or be deferred
with a substantive reason. Account for every selected source in `coverage`.
Do not force a fixed item count or fill a quota with redundant variants.

### When New Diagrams Are Needed

For new candidate graphs, constructions or schematic distractors, load
`.agents/skills/ld-s10y-image/SKILL.md` and request its deterministic planning,
rendering and mathematical/visual review path. Supply the written seed,
independently derived geometry, intended alternative meanings, and the current
source image where one exists. Keep new facts separate from the source inventory.
Do not synthesize a missing original scan or pretend a new choice candidate is
the original diagram.
When the written task has no original diagram, request the image skill's
deterministic `source.authoredBasis` path; do not fabricate a source image.

Supply a figure request with the intended question/option IDs, mathematical
relationships and permitted differences. Use the resulting FigureSpec, rendered
asset, render report and hash-bound review when that workflow can run within
authorization. All working artifacts stay offline in ticket `tmp/` or `.tmp/`.
No generated-artwork network calls, manifest promotion, publisher or database
writes are authorized by this skill. If the image workflow requires a missing
source or another forbidden side effect, report that exact blocker.

Register each completed image in the draft's `new_figures` with a new ID, its
repo-relative scratch path, actual SHA-256 and substantive `basis`. Describe the
relationships/coordinates and intended correct or mistaken mathematical claim,
including which differences from source facts are deliberate. These are authored
alternatives, never authoritative seed facts. `view.figure_ids` and option
`figure_ids` can reference the new IDs just like seed IDs.

Obtain an independent figure review of the actual image against that basis,
including intended distractor differences and readable labels. Record it in
`new_figure_reviews` and include the actual-image observation in `figure_checks`.
An intentionally incorrect graph can pass figure review if it faithfully
represents the declared incorrect claim; the option's mathematical truth is
checked separately. Missing offline rendering prerequisites or an unavailable
independent reviewer block the affected item, not the artifact contract itself.
Recognition still does not demonstrate producing a drawing.

## Create Alternatives

Each option must be a definite mathematical assertion or complete result that
can be judged under the stem. Choose comparable notation, precision and length.
Keep necessary data in the stem or shared figure. Do not refer learners to source
exercise numbers, earlier answers, hidden intentions or the internal mapping.

Derive each incorrect option from an explicit reproducible mistake: an invalid
operation, confused correspondence direction, endpoint inclusion, reversed
quantifier, unit conversion, restricted-domain oversight, etc. Record the actual
steps yielding that option, not just a label such as "sign mistake". Reject an
arbitrary nearby value unless a plausible mistaken procedure produces it.

Keep the misconception explanation out of the visible option. For example an
option should assert a candidate value, not announce that it "treats the negative
sign as positive". Do not mark correctness through wording, greater detail,
exclusive use of lesson terminology, implausible numbers or jokes. Do not use
"all of the above", pair-combination codes or references to other options.

Record a derivation for correct options too. Check equivalence: two differently
written alternatives may be the same mathematical answer. For a `single`
question exactly one must be true; for `multiple`, specify all true options and
judge each separately. Use at least one true alternative; if none of a diagram
collection qualifies, redesign the response honestly rather than inventing a
qualifying diagram. A real multiple-choice task may have one or all alternatives
true; do not distort the source just to force a preferred correct-count pattern.

## Finish the Draft

Use the contract's visible/internal separation. Keep source solution, task intent,
losses and distractor reasoning internal. Preserve the source snapshot hash.
Run structural validation, then the independent semantic gate. Structural success
does not settle mathematical correctness, equivalence, task preservation, visual
legibility or answer leakage.
