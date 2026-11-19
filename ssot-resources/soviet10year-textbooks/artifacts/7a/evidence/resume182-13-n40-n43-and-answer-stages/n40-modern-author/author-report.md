# n40 Modern Author Report

Scope: offline authoring for STEMROBIN-182, `alg7-c4-s2-n40`, in
`/Users/yong/.codex/worktrees/d9b1/lemmadeck`, branch
`codex/STEMROBIN-182-textbooks`.

## Reader And Intent

The learner needs to follow the two radical transformations, including the
sign-dependent examples, then work the original exercises. The reviewed RAW is
the sole content source. Its mathematical wording is already culture-neutral;
the modern profile requires keeping that wording, not inventing new scenarios.
Only punctuation, sentence/formula layout, and Cyrillic subpart labels change.
The original formulas, quantities, variable domains, order, grouping, source
bindings, square-root-table instructions, and exercise intent remain unchanged.

## Evidence

`input-hashes.json` binds the reviewed isolated RAW, prepared templates,
existing successful prepare receipt, original assembly warnings, and prose-flow
implementation. Preparation is reused, not rerun.

Authoring is complete. `author-check-FIRST.json` reports PASS for authorship
preservation and section-boundary resolution only, not mathematical approval,
independent content review, or finalization.

| Item | Count |
| --- | ---: |
| Source-bound authored prose blocks | 19 |
| Final paragraphs derived by prose-flow | 19 |
| Original exercises, 820 through 833 | 14 |
| Latin-labeled subparts | 60 |
| Numeric method labels retained in exercise 829 | 2 |
| Semantic section boundaries | 5 |
| Exact preserved formula occurrences | 137 |
| Figures / images opened | 0 / 0 |

Checks confirm exact ordered formula and number equality; all wording is
unchanged after ignoring only punctuation, whitespace, and subpart labels.
Exercise identities, groups, page bindings, and empty figure references are
unchanged. Every changed text item declares only `layout`; `numeric_changes`,
`historical_entities`, and `errata` remain empty. Modern visible text has no
Cyrillic or profile-forbidden terms. Immutable source snapshots remain faithful.

The five `{before, after}` objects were copied from the actual
`prose_flow.mjs` output: first method to second method, comparison to terminology,
terminology to additional examples, example 1 to example 2, and example 2 to
example 3. `prose-flow-FIRST.json` records their successful resolution through the
shared paragraph parser. No integer boundaries or hand-counted paragraph
positions were authored.

Only `lesson.template.json` and `exercises.template.json` were edited.
`figures.template.json` remains the prepared zero-figure manifest.
The read-only first snapshots of all three templates are in `first-authored/`;
their hashes and matching editable-template hashes are in
`author-check-FIRST.json`. The input hash check confirms the isolated RAW,
book template, prepare receipt, warnings, and parser/profile inputs did not
change during authoring.

## Issues For Separate Review

1. Source-bound mathematical concern at `p0243#9`, example 3, negative case:
   the equality chain contains
   `$a\sqrt{2}=-(-a)\sqrt{2}=\sqrt{(-a)^2}\cdot\sqrt{2}=-\sqrt{a^2}\cdot\sqrt{2}=-\sqrt{2a^2}$`.
   For the stated `$a<0$`, the intermediate positive square-root product
   appears inconsistent with the negative neighboring expressions. This is
   preserved exactly, not corrected. The prepared template has no registered
   erratum. Parent/separate source review must distinguish transcription from
   printing error and use the source-bound erratum procedure if applicable.
   No answer key or source image was read by this author.
2. Existing assembly warning: `p0242#1` is `cont` without a preceding `open`.
   The orphan 819 owner is excluded from the isolated n40 input.
3. Existing assembly warning: `p0246#9` is still open. It belongs to the
   excluded n41 boundary, not this n40 authoring target.

The original warning receipt is referenced and hashed, not edited or silenced.

## Handoff Boundary

No answers, choices, images, publisher, database, application, dependency,
real-resource, ticket-progress, or other worker's files are changed. No
`adapt-finalize`, render, promotion, publication, commit, or push is performed.
Independent review and the single parent-owned finalization remain pending.
