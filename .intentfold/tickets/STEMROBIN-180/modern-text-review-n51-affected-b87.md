# STEMROBIN-180: n51 B87 Affected-Only Science And Anchor Review

Date: 2026-11-19. Lesson: `phy8-c2-s3-n51`. Invocation: existing `180-3`.
Decision: **PASS for candidate1's affected science, declarations and anchor sides.**
Findings: F1-F4 **4/4 PASS**; anchor sides **2/2 PASS**; **0 REVISE findings**.

`reviewer_kind: independent_agent`; `independent_agent: true`.
This assigned reviewer is separate from parent session180-3, which authored candidate1.
This reviewer did not author or alter candidate1; the parent author receipt is evidence,
not a substitute for this independent comparison and scientific assessment. No descendant
reviewer was created. Independence here describes author/reviewer separation, not image,
publication or full-source approval.

The human correction at **2026-11-18T22:05:44Z** permits ordinary source-backed repair.
Historical internal1/1 counts are not additional approval gates. The original B62
HOLD/REVISE report remains unchanged; this decision resolves its four affected findings
for the exact candidate bytes below, not for FIRST or any other edition.

## Findings

All prose and normalized paragraph indices below are zero-based. Line numbers refer
to the immutable [candidate lesson](/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b87-n51-recovery/candidate1/lesson.template.json).

| Finding | Exact locus | Decision and essential rationale |
| --- | --- | --- |
| F1 | `prose[0].text`, line 22; `prose[1].text`, line 39; recorded paragraphs 0-2 | **PASS.** The two-force treatment is explicitly approximate and neglects buoyancy rather than denying it. Stationary surrounding fluid and rest release make `$v=0$` zero relative motion in this model. Drag is tied to relative motion and opposes that motion; the wind/current qualification correctly rejects ground-frame rest as sufficient evidence of zero drag. Vertical motion and increasing drag with relative speed are stated model conditions, not universal claims about every fluid flow. |
| F2 | `prose[2].text`, line 57; recorded paragraphs 3-5 | **PASS.** Shape/fluid conditions and approximately constant gravity are specified. Approach to a possible limiting terminal speed replaces guaranteed exact finite-time attainment. Observationally negligible speed change is explicitly approximate, while exact force balance remains a valid conditional zero-acceleration statement in the buoyancy-neglecting model. Skydiver, snowflake and raindrop examples require stable conditions and sufficient fall time; release and changing conditions are excluded. |
| F3 | `prose[3].text`, line 74; recorded paragraphs 6-7 | **PASS.** Both gases and liquids exert buoyancy. Its constancy is scoped to a hydrostatic approximation with full immersion, fixed rigid-body volume, approximately fixed fluid density and local gravity. Speed independence is read within that approximation, not as denial of dynamic fluid forces. Downward approximately steady motion requires weight greater than buoyancy, and upward drag approximately balances weight minus buoyancy, not weight alone. This explicitly replaces the earlier two-force balance when buoyancy matters. |
| F4 | `prose[4].text`, line 96; recorded paragraphs 8-10 | **PASS.** The approximately 1-metre tube, water/glycerol, steel ball, coloured scale and metronome remain. Suitable ball/fluid selection and an observable interval after initial acceleration are required; tube length alone is expressly insufficient. Equal-time distance comparisons exclude release and bottom effects and establish only approximate uniformity within observation precision. Unequal distances are retained as an unsuccessful observation, not rewritten into success. No actual measurement, ball size, timing, viscosity, temperature or numerical tolerance is invented or required for this prose review. |

The recovered OpenStax *University Physics Volume 1* section 6.4 text supports
fluid-relative drag, dependence on body/fluid conditions, neglected small air buoyancy,
and the linear-drag limiting solution. Its informal finite-time wording is not treated
as a mathematical guarantee: for positive fixed mass, gravity and drag coefficient,
the displayed solution's exponential term remains positive at finite time. This is
reviewer reasoning confirming F2, not a requested child-facing formula addition.
Recovered section 14.4 supports buoyancy in any fluid, displaced-fluid weight and the
sinking condition. Under the stated fixed conditions, constant buoyancy and the
weight-minus-buoyancy balance follow. Neither reference supplies measurements for the
proposed experiment, and candidate1 claims none.

## Declarations

**PASS.** Exactly five `changes` arrays now contain `["layout", "physics-clarification"]`
(lines 30, 48, 65, 82 and 105). Each corresponds to an actually changed scientific
prose value. All seven `numeric_changes` arrays remain empty; both original formulas
are exact and no mathematical expression is corrected, so the unchanged `errata=[]`
does not conceal a numerical or formula repair.

The source-bound Archimedes name, historical-entity term and reason remain exact in
`prose[3]`, with the same `p0201#3` binding and name present in source and modern text.
No fictional replacement or historical-identity change occurred. Figure/caption
declarations and all other metadata remain unchanged. This is declaration review,
not an execution of an edition validator or publisher.

## Recorded Anchors

Read-only evidence: [once-normalized stdout](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/tmp/b83-n65-raw-and-text/b87-n51-affected-layout.stdout).
All five candidate text values exactly equal its five `normalized_texts` entries.
The recorded flow contains **11 paragraphs**; no paragraph splitting, normalization,
layout tool, production parser or anchor resolver was rerun.

| Authored side | Exact recorded match | UTF-8 text SHA-256 | Decision |
| --- | --- | --- | --- |
| `section_breaks[0].before`, line 243 | paragraph 7, block 3, paragraphInBlock 1; 1 match | `857e90ab76eea1ca583b2e535505dbdae4099da439a3b6d064ccc2c24027132f` | **PASS** |
| `section_breaks[0].after`, line 244 | paragraph 8, block 4, paragraphInBlock 0; 1 match | `e28aef601523f8c8374ccd0e8eac23e3d614c99a3af6cf3dfe4aec3af2f3dc9b` | **PASS** |

The two complete strings occur uniquely and consecutively in the actual recorded
paragraph array, in the authored order. The boundary separates the completed
buoyancy-adjusted force balance from experimental setup, preserving the intended
concept transition. There is exactly one authored `{before, after}` pair.

Evidence limitation: the saved `flow.resolvedBreaks` and `flow.boundaries` are both
`[]`. They are **not** affirmative evidence that the authored anchor was passed to
or resolved by that call. This PASS is the independently verified exact-text,
unique-adjacency and conceptual-boundary judgment requested here, not a fabricated
parser-resolution or product-rendering PASS. No replay is required by this assignment.

## Fidelity Reuse And Byte Comparison

Read the complete original [B62 report](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/modern-text-review-falling-b62.md),
including F1-F4 and its full fidelity evidence, and the [B87 repair note](/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/modern-text-repair-n51-b87.md).
Reuse B62's untouched source-fidelity, figure/caption and empty-task evidence; no new
full SOURCE or full TEXT review was performed. Its complete 7-block/9-reference
source coverage is prior evidence, not a new coverage claim by this reviewer.

Independent read-only Node comparison used standard JSON decoding for structural
equality and literal input spans for byte equality; it imported no pipeline code.
Exactly **12 values** differ from recovered FIRST: `/prose/{0..4}/text`,
`/prose/{0..4}/changes`, `/section_breaks/0/before` and `/section_breaks/0/after`.
These match the author receipt's list exactly, with no other structural differences.
Excluding only those 12 literal values leaves **7,970 identical lesson bytes** in
each input, including formatting, source snapshots and all untouched fields.
The comparison stream replacing each excluded value by its path has SHA-256
`50d75c44c522cffe96eef4285961ceaf010c68543a9fd3dae341fa40b5aaf345`.

- Both embedded `source` objects are unchanged; all seven prose `source_text`,
  `source_refs`, kind/id/label/page and historical/numeric declarations are exact.
- Embedded raw lesson SHA-256 remains `c9e67476ef30145cf4aec14b4fca31580ce25a3a4ccdc58b3d2b5b1919db61ac`;
  embedded raw exercises SHA-256 remains `eff567d9b6b3a085328cbdfd21a2bfb2da615ea480489c8da014d10d4d9164eb`.
  Raw-file/Markdown fidelity is inherited from B62, not freshly fetched or rechecked.
- **2/2 whole auxiliary templates** are byte-identical to FIRST; the lesson's
  **2/2 figure/caption objects** are exact. No image bytes were read or hashed.
- **2/2 formula tokens** remain `$v=0$` and `$m\vec{g}$`; **4/4 prose numeric
  tokens**, in block order, remain `42`, `0`, `1`, `136`, with no additions.
- Lesson exercise count, modern exercise count and source exercise count remain
  **0/0/0**, with both exercise arrays `[]`. No answer or choice work was performed.

## Hash Bindings

Template root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.tmp/ld-s10y-lesson/b87-n51-recovery/`.
The three FIRST documents and exact three immutable candidate1 documents were read.

| Root-relative document | Bytes | SHA-256 |
| --- | ---: | --- |
| `FIRST/lesson.template.json` | 10107 | `59657de434f7c3d69f860d94a5cd12284f698da0f50f77d3c73da578ffdba9b9` |
| `candidate1/lesson.template.json` | 11912 | `efe1abe0e9b43f79c62b1c2be702763890ff71d36a072408d83e4f9457ff3782` |
| `FIRST/exercises.template.json` = `candidate1/exercises.template.json` | 419 each | `e7577b86f72ffd6a3a9a93ec748d1d1587e207391f827be079d195f47e338314` |
| `FIRST/figures.template.json` = `candidate1/figures.template.json` | 646 each | `8649c0727d4bc0dd12966d1962493446ff54e0e7e6ec21c570aef64f66cabcac` |

Ticket evidence root:
`/Users/yong/.codex/worktrees/0f12/lemmadeck/.intentfold/tickets/STEMROBIN-180/`.

| Root-relative evidence | SHA-256 |
| --- | --- |
| `modern-text-review-falling-b62.md` | `481c4b48de9d12ca14eca1871d02585b6512fc6b3cb33059d997bca2b50a24d6` |
| `modern-text-repair-n51-b87.md` | `0a5bd634f5b649a3d721cf31b89fad1f8992be20ea339aeb2baaa9ab5b7e6a48` |
| `tmp/b87-n51-recovery/receipt.json` | `d87494927a830bd0aacd6a6a590caeb73c0d013758decd307796f2bda10725a4` |
| `tmp/b87-n51-recovery/author-receipt.json` | `a7c2d3e3d5e5c03bcafbb86e36181c907aabda1877a47097ae549c431c1fd67f` |
| `tmp/b83-n65-raw-and-text/b87-n51-affected-layout.stdout` | `72f54d57d404f86ece6ac755b4805c09f656a30d18326a5c9daf11e515cfc80f` |
| `tmp/b87-n51-recovery/primary-drag.stdout` | `6f3cbd3af0aa8ac8aece94e8319b51be04b5789e047e16ef628fcd0636080413` |
| `tmp/b87-n51-recovery/primary-buoyancy.stdout` | `ac1e613228303ef3cc8b8227584440287cb01a4e2455b0ea48523e5cb351b57a` |
| `tmp/b87-n51-recovery/original-closure.stdout` | `56f3d884be444da4acb00afa3f025447096c11baa235852531f3c157c71da4ef` |

The supplied candidate lesson hash and all three author-receipt candidate hashes
and byte counts match independently. Recovered primary captures were read locally;
their archived call metadata was inspected, not executed. No web fetch was made.

## Boundary And Stop

This report is the sole output. Images **0**, new normalization/proseFlow/pipeline
calls **0**, paid/model calls **0**, database/publisher calls **0**, descendant or
other-task messages **0**. No candidate, canonical, index, ledger, app, source,
charter, dependency or other agent's artifact was edited; no Git, setup or freshness
operation was performed. No numerical experiment or visual/product check is claimed.

Figure 136 creation, image fidelity/readability and product display remain outside
this verdict; its unchanged `modernized` declaration does not imply approval.
The PASS applies only to the bound candidate1 bytes and affected relationships.
**Review complete; stop after this report.**
