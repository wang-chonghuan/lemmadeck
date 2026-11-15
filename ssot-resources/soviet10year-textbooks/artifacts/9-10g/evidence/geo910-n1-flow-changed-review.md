# geo910 n1 Flow Repair: Changed-Only Independent Review

Result: **PASS for the bounded prose-layout repair**. Reviewed 2026-11-15 under STEMROBIN-184. This is not a new whole-source, exercise, figure, display, or promotion review.

## Actual Inputs and SHA256

Paths below are relative to `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

| Input | Actual SHA256 |
| --- | --- |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n1-flow-initial/lesson.template.json` | `df3109b37d80ea76a9209f0456e86a33bc2930ecf3a125cb86caa6e58ca16ad5` |
| `.intentfold/tickets/STEMROBIN-184/tmp/geo910-n1-flow-initial/repair.json` | `32fd96f5fd560da18f208abf7ad7e29b4163e9a40aeaa06ccca7936bf485acf7` |
| `.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-n1/lesson.template.json` | `b0474bdd7f947d2f688fa9fe61595af0ea0846322cf0da3ebd9de28c0486e87f` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n1/lesson.json` | `6a985dde9e37c386bf81a9489a8a0bc71fe1c3197d4c58a29918f097bc351ded` |
| `ssot-resources/soviet10year-textbooks/artifacts/9-10g/editions/modern-us-neutral/lessons/geo910-c1-s1-n1/adaptation.audit.json` | `6ac28caf0d8c7d9901eb89887da1bfd4dcfc24c63f4c372ed4d27ac6a48a9a13` |

Filename clarification: the requested durable `lesson.template.json` does not exist. The actual durable document is `lesson.json`; the repaired template remains in the matching adaptation scratch directory. `repair.json` before/after hashes match the actual initial and scratch template bytes. Scratch versus durable differs only in `status`, from `draft` to `ready`.

## Exact Changes and Protected Equality

Initial versus durable has exactly four structured difference paths:

- `$.prose[4].text`, bound to `p0008#8` + `p0009#1`: the extra blank line moves from before item 3 to before item 4. Item wording, punctuation, and numeric order `1, 2, 3, 4` are identical.
- `$.prose[6].text`, bound to `p0009#3`: the extra blank line moves from before “在几何中，任何点的集合都称为图形.” to before “直线和平面都是图形的例子.” No characters other than whitespace change.
- `$.section_breaks[1].after`: the anchor now includes the third sentence “在几何中，任何点的集合都称为图形.” because it belongs to the current official first paragraph of this block.
- `$.status`: `draft` to `ready`.

Applied the existing `edition.normalize_lesson_layout` only to an in-memory deep copy of the initial document, using the existing lesson Python runtime with `-B`. It changes exactly the two listed text fields, and its complete resulting `prose` equals current durable `prose` structurally.

For both changed blocks, deleting whitespace produces exactly equal character sequences, including words and punctuation. Number signatures are unchanged; all 15 prose objects retain identical math signatures. Both changed blocks contain no inline math, so this check is supplemented by exact non-whitespace equality rather than treated as sufficient alone.

After allowing only official normalization, current section anchors, and the explicit status transition, the entire initial/current documents are structurally equal. In particular, source references, source text, embedded source data and SHA binding, object order/kinds, figure/caption entries, title/identity fields, change declarations, numeric-change fields, and errata are unchanged. Source binding remains `c5053b1aa9289337c0ab47d0e89cb356354aba36e83bb93efe2b83c6256515d2`. No figure assets or exercise documents were inspected or changed for this check.

## Conceptual Boundaries

The existing official `prose_flow_contract` resolves current anchors without errors at paragraph indices `[4, 8]`; its exact boundary objects equal the current audit's `resolvedSectionBreaks` and the anchors recorded in `repair.json`.

- Boundary 4 remains the transition from prior study/course scope (`p0008#5`) to the logical organization of the geometry course (`p0008#7`). Neither anchor changed.
- Boundary 8 remains the transition from qualifications about omitted proofs and theorem exercises (`p0009#2`) to basic concepts and the set/figure terminology (`p0009#3`). The before anchor is identical. The after anchor is the complete current adjacent paragraph: the four basic concepts, the undefined concept of a set, then a figure as any set of points. Extending the anchor to that paragraph does not move the conceptual transition or alter a definition.

The course's four-step sequence remains basic concepts, axioms, definitions, then theorem proofs. The basic-concepts block still proceeds from the four concepts to sets, figures, and examples. The internal whitespace regrouping does not insert, delete, reorder, or change these statements.

## Failure Evidence and Scope

`repair.json` retains the initial `adapt-finalize exit2` failure: `section_breaks[1] matched0 after official prose layout normalization`. A read-only parser check of the initial anchors against officially normalized prose reproduces `section_breaks[1] must identify exactly one adjacent paragraph pair; matched 0`. This is not a rerun of finalize. The repaired current anchors resolve successfully, and the existing durable audit reports `status: pass`, two section breaks, and no errors.

Only this report was written. No template/spec edits, scans, source re-solving, renderer, browser, finalize, promotion, or other reviews were performed. The previously reported fig07 second-render **FAIL remains STOP**; this layout PASS does not approve or reopen it. Awaiting the next assignment.
