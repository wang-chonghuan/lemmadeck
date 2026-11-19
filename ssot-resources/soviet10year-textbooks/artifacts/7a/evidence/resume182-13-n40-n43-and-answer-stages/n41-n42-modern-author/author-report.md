# n41 And n42 Modern Text Author

Date: 2026-11-19.
Ticket: STEMROBIN-182.
Checkout: `/Users/yong/.codex/worktrees/d9b1/lemmadeck`.
Branch: `codex/STEMROBIN-182-textbooks`.
Scope: offline text authoring only.

## Reader And Source

The learner follows n41's four worked radical-transformation examples before
attempting the original exercises. In n42, the learner identifies a quadratic
equation, its coefficients and simplified form, then follows the original
graph-solving explanation. The reviewed isolated RAW determines all content and
ordering; no new explanations, scenarios, domains, or exercise solutions are
introduced.

Read the local product, engineering and operations Charters, lesson cap4,
edition-text contract, production-resume rules, modern profile, image ownership
and batch rules, and both existing source-review reports. The existing successful
adapt-prepare is reused without running it again. The author does not access
the ticket backend, network, database, environment, application, source pixels,
old answer keys, or modern figures.

The source mathematical wording is culture-neutral and stays unchanged.
Changes are limited to punctuation, spacing, sentence/formula paragraph layout,
and Cyrillic-to-Latin subpart labels. Every changed item declares `layout`;
unchanged items retain empty `changes`. All `numeric_changes`,
`historical_entities` and `errata` remain empty.

## Authored Counts

| Lesson | Source-bound prose objects | Text paragraphs | Exercises | Latin subparts | Section breaks | Pending figures |
| --- | ---: | ---: | --- | ---: | ---: | --- |
| alg7-c4-s2-n41 | 20 | 36 | 17, 834-850 | 69 | 3 | fig-56, fig-57 |
| alg7-c4-s3-n42 | 16, including fig/caption | 14 | 4, 851-854 | 12 | 2 | fig-58 |

The 16 n42 source objects include 14 prose objects, one figure placeholder,
and one caption; their identities, source refs, labels and original order are
preserved. n41 figures remain exercise-only: 848 references/displays fig-56,
849 references/displays fig-57. Fig-58 remains n42 prose, not an exercise figure.
These are textual ownership facts, not approval of graph semantics or pixels.

n44, the preceding exercise 833 and n43 are excluded. The 21 authored exercises
retain their original numbers, source numbers, groups, group ids, source page
bindings, figure references and display ownership.

## Boundaries And Preservation

The five `{before, after}` objects were copied from actual non-JSON
`prose_flow.mjs` output after text authoring. n41 separates examples 1/2, 2/3
and 3/4. n42 separates the general coefficient examples from simplified
quadratics, then simplified quadratics from graph solving. No integer boundaries
or independently counted layout positions were authored.

`input-bindings-FIRST.json` binds the isolated RAW, prepared text templates,
source reviews, successful prepare receipt, rules, profile and paragraph parser.
It also records each original prose/exercise binding and read-only
`first-prepared/` snapshots of all four owned templates.

The original `collect-evidence.mjs outputs` invocation completed all assertions
for ordered exact formulas and numbers, unchanged wording/domains after ignoring
only layout and labels, source snapshots/hashes, identities/groups/figure refs,
line consistency, natural Latin label order, absent modern Cyrillic/forbidden
terms, empty numeric/history/errata declarations, and both section-anchor
resolutions. It wrote both immutable `*-prose-flow-FIRST.json` files and all four
read-only `first-authored/` snapshots.

That invocation exited 1 during final report packaging: the collector passed
file-record objects, rather than their `path` strings, into the hash function.
`preservation-check-FIRST.failure.json` retains the failed call and diagnosis;
the original executed collector is preserved read-only, not patched to hide
the first failure.

`recover-report.mjs` recovered only packaging from the already valid first
outputs, checking frozen/current byte identity and unchanged read-only inputs.
It did not rerun the text assertions, prose-flow commands or prepare, and did
not change any candidate text. Its actual exit is 0.
`preservation-check-RECOVERED.json` records **PASS for structured preservation
and anchor resolution only**, with 186 exact ordered formula occurrences.
This is not independent text, mathematical, image, finalization or production
approval.

## Issues And Stop

No actual mathematical concern was identified in the authored n41/n42 text.
No source evidence supports adding an erratum, so none is added. The table
instructions in n41 example 3 and exercises 835/843 remain intact; this author
does not provide or approve table values. No external source claims are added.

All figures remain pending the image worker. No figure was opened or generated;
`figures.template.json` was not edited. Original graph formulas and the fig-58
A/B/root wording are preserved for separate graph-semantic comparison.

Only the four owned lesson/exercise templates and new files below this author
directory were written. No other worker's changes were reverted. No RAW source
edit, answers, choices, dependency change, render, adapt-finalize, promotion,
publisher, DB write, application run, commit or push occurred.

Text authoring stops here. Independent text review, figure work and any later
parent-owned finalization remain pending.
