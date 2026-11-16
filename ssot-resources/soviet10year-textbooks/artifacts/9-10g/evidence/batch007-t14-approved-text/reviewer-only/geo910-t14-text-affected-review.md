# STEMROBIN-184 / geo910-c1-s1-t14 / Affected-Only Text Repair Review

Date: 2026-11-16.
Workspace: `/Users/yong/.codex/worktrees/a07e/lemmadeck`.

## Verdict

**PASS: affected adapted TEXT only, tasks 133, 135, 150, 151.**
The frozen StageB findings T1 and T2 are resolved at the exact repaired
exercises SHA-256
`4fe2de5b67d42e63ceb422b8da1d6d47dc68071de1cfca348ba1fe987d09b16f`.
No further affected-text REVISE or HOLD is identified.

Reusing the original all-32 StageB comparison, its complete-text HOLD
pending these four repairs is discharged for this repaired exercises draft
paired with the unchanged lesson TEXT draft. This is a text-input decision
only: the approved TEXT can inform later first modern-figure work, but
no such work was performed or approved here.

No new independent mathematics PASS, independent figure PASS, final-answer
approval, whole-lesson approval, publication approval, or finalization is
given. The frozen StageA and sole substantive StageB remain unchanged.

## Reused Basis And Exact Inputs

Absolute path roots:

- `W`: `/Users/yong/.codex/worktrees/a07e/lemmadeck`
- `T`: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp`
- `D`: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.tmp/ld-s10y-lesson/adapt/9-10g/modern-us-neutral/lessons/geo910-c1-s1-t14`
- `R`: `/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/geo910-t14-text-targeted-repair-evidence`
- `O`: `/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/9-10g`

Each alias below resolves only under its absolute root above.

| Input | Observed SHA-256 |
| --- | --- |
| `T/geo910-t14-math-independent-review.md` (sole frozen StageB, reused) | `e30c20739b1b8d6cf3808456caa4cfbc3e85e14d8a9df9ab0e27363cd8418411` |
| `T/geo910-t14-math-independent-source-first.md` (frozen StageA, hash only here) | `53e7f7b932279336f06f54c25a31aef824d0e6a512974f5fe9893ac4f4aa1720` |
| `R/before/exercises.template.json` | `8babaa464a64583a42111608f9ca5425a7686d4b0971131bcea0d0f1ccb93333` |
| `R/after/exercises.template.json` | `4fe2de5b67d42e63ceb422b8da1d6d47dc68071de1cfca348ba1fe987d09b16f` |
| `D/exercises.template.json` (current repaired candidate) | `4fe2de5b67d42e63ceb422b8da1d6d47dc68071de1cfca348ba1fe987d09b16f` |
| `R/repair.json` | `4eef4df761314bb596c9af451b4b12de78ea8bca36f2887e3fc09b01663e11ec` |
| `D/lesson.template.json` (unchanged paired TEXT) | `1d3aba91bb9d4bc7afef929bc13c504deb280504b293dfb5b5457ff6d11c59ef` |

The before snapshot matches the exercises identity in frozen StageB.
The after snapshot and current candidate are byte-for-byte identical, not
merely semantically equivalent JSON. The repair evidence was read as a
declaration, then checked against the actual snapshot/candidate differences.
The parent repair script was not executed or reviewed.

## Four Affected Findings

### 133 / T2 / PASS

The only adapted wording change is the known fig55 panel mapping:
source U+0430/U+0431/U+0432 to Latin `a/b/c`, respectively.
All seven panel-label occurrences are replaced: three first-panel labels,
three second-panel labels, and one third-panel label. No third-panel
transliteration to `v` remains.

The first-panel references in the nonparallel analysis and finite-K step,
the second-panel references in the parallel analysis and construction,
and the closing quadrilateral `a,b` / triangle `c` references keep their
original order and associations. Figure number 55, the five numbered
construction steps, formulas, hypotheses, wording and conclusions are
otherwise unchanged.

The same substitutions occur in `lines[0]`, `lines[2]`, `lines[3]`,
and `lines[5]`. `lines` equals the repaired `text` split at actual newlines.
Metadata changes exactly from `["layout"]` to
`["layout","culture-label"]`. Original `source_text` and embedded original
source data are unchanged. This verifies textual references only, not
the geometry or labelling of any candidate figure.

### 135 / T1 / PASS

Exactly one newline is inserted immediately before the actual `2)`
following subpart 1's closing question. The two actual subparts now
occupy separate lines, after the task-number line.

The original inner `1)` reference remains inside subpart 2, immediately
after its opening instruction; it is not split into another subpart.
The exact second-subpart words and necessary-and-sufficient-condition
request remain unchanged. There is no new hypothesis, altered parallelism
convention, or mathematical rewrite.

The `lines` array changes from two entries to three and exactly matches
`text` split at newlines. Metadata remains `["layout"]`. Original
`source_text` and embedded original source data are unchanged.

### 150 / T2 / PASS

The sole adapted wording change is fig56's first-panel U+0430 to Latin
`a`, once in `text` and once in its matching single `lines` entry.
Metadata changes exactly from `[]` to `["culture-label"]`.

Figure number 56, the marked original task number, point/line notation,
projection data and the intersection-construction request are unchanged.
Original `source_text` and embedded original source data are unchanged.
Nothing adds a unique-intersection or generic-position assumption.

### 151 / T2 / PASS

The sole adapted wording change is fig56's second-panel U+0431 to Latin
`b`, once in `text` and once in its matching single `lines` entry.
Metadata changes exactly from `[]` to `["culture-label"]`.

Figure number 56, noncollinearity hypothesis, original point-list wording,
projection data, plane notation and intersection-line request are
unchanged. Original `source_text` and embedded original source data are
unchanged. This known panel label is not the UNKNOWN source point-list
separator; no separator identity is inferred or newly decoded.
Nothing adds an unconditional proper intersection-line assumption.

## Structural Preservation Evidence

Read-only structured comparison, without re-reviewing other tasks'
mathematics, established:

- Both snapshots contain 32 exercise objects, with unchanged count and
  unchanged original-task order.
- Exactly four objects differ: 133, 135, 150, 151.
- All other 28 complete exercise objects are deeply equal:
  121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132,
  134, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146,
  147, 148, 149, 152.
- All top-level fields outside `exercises` are deeply equal, including
  the complete `source` object and its embedded original data.
- In each affected object, all fields other than `text`, `lines`,
  and `changes` are deeply equal. This includes `source_text`,
  task/source numbers, groups, pages, figure references, figure metadata,
  numeric-change metadata and historical-entity metadata.
- Each affected repaired `text` equals its exact permitted transformation
  of the before text: only the ordered known Cyrillic panel substitutions,
  or, for 135, the single actual-subpart newline.
- Every affected repaired `lines` array equals `text.split("\n")`.

No group, mathematical token, source snapshot, number, figure-reference
record, source binding, hypothesis or request was repaired beyond the
four permitted presentation changes. Neutrality and the lesson footnote
are inherited from StageB at unchanged lesson bytes, not newly reviewed.

## Protected Input Hashes

All protected paths in `repair.json` were rehashed and matched its declared
hashes. StageA, StageB and the paired lesson are bound above; the remaining
protected identities are:

| Protected input | Observed SHA-256 |
| --- | --- |
| `O/book.json` | `09b7503438ca530df95ef569c48d762e1f8fb8e8fc8ceb384995074008065e24` |
| `O/lessons/geo910-c1-s1-t14/lesson.json` | `d745acfd4fc4d3301a1181ba99013b5e6fccf2c67744ff2178e590d5f5d299e5` |
| `O/lessons/geo910-c1-s1-t14/lesson.md` | `cfd4cecff8c432c522bb9391ef8edc07f695dcac4fe190d3ae46a4ab3a0ca0fd` |
| `O/lessons/geo910-c1-s1-t14/exercises.json` | `c811e940438f1c989491ec61612c7ba322cce9cd38170935ff8f78e24dadf859` |
| `T/geo910-t14-math-author.md` | `5d5291bebcbdae975cc0985957f2c6982cab356e4d0b14e3bb1be012bf36b995` |
| `T/geo910-t14-math-author.manifest.json` | `cbeb9f20b9ae4f104b82cac696120792ce1e78b8ec0952498e4b619ee52cac1e` |
| `T/geo910-t14-derived-answer-precursor.json` | `994d8e991aa390421df65004f00c6f3fd6a5a5c9f16ecf31a9a782712046f9d2` |
| `D/figures.template.json` (hash only; contents not inspected or approved) | `0adaa56c57fd518a50ff465e21d2c28e9f5b62586dc0f24678b5a09582e28aad` |

Hash equality for the figures draft is preservation evidence only.
No image was opened, cropped, rendered, re-solved from, or inspected.
The three actual-original-image inventories and their image hashes
remain the frozen basis recorded in StageA/StageB; this check does not
renew their optical review or approve a modern figure.

## Binding Limits And Stop

All StageA/StageB source-interpretation and conditional-case limits remain
binding without alteration. In particular:

- Task 125's source relation-macro identity remains UNKNOWN.
- Fig54's p/rho optical identity remains UNKNOWN.
- Task 151's source separator identity remains UNKNOWN.
- Task 149's angle convention remains conditional, not forcibly proper.
- Task 146 retains literal `[BCD]`, including its face brackets.
- Inclusive-parallel conventions, general-parallelepiped rather than
  geometric-cube interpretations, nonunique/degenerate configurations,
  no-intersection/coincident cases and all previously retained
  multiple-model branches remain in force.

No new math solve, all-32 substantive review, old n13 gate, source erratum,
answer/choice revision, candidate-figure approval, or new pipeline occurred.
Only this new affected-review Markdown artifact was written. No source,
author mathematics, draft, page, tool, index, database, app or production
input was edited; no gates/tests, prepare/finalize, assemble/render, Git,
other-chat or publication actions were performed.

Disposition: **T1 RESOLVED; T2 RESOLVED; AFFECTED TEXT PASS.**
The original sole StageB is reused, not replaced. Stop after returning
this artifact's path, SHA-256 and narrow verdict.
