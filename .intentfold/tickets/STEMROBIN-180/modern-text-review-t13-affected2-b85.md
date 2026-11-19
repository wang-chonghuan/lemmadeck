# STEMROBIN-180 B85: t13 Repair2 Affected TEXT Review

Date: 2026-11-18. Same existing cap3 invocation.
Workspace R: `/Users/yong/.codex/worktrees/0f12/lemmadeck`.

**PASS: E1 at `/prose/3/text` and `/prose/5/text`, 2/2 affected substitutions.**
This closes the prior E1 TEXT-arrangement finding for the exact frozen repair2 candidate. It is not a renderer, whole-course, SOURCE, FIG, answer, gate or publication verdict.

## Hash And Freeze

Working input:
`R/.tmp/ld-s10y-lesson/b85-zero-summary/working/phy8-c2-s2-t13/lesson.template.json`.

New independent frozen candidate:
`R/.intentfold/tickets/STEMROBIN-180/tmp/b85-zero-summary-repair2/lesson.template.json`.

- Actual byte SHA-256: `489ef0435ec258a625f8499ae6efd11c9c76de569eb6719938afeb80f8a34cbd`.
- Size: **8279 bytes**.
- The working file was read once, hashed and copied from that same byte buffer without JSON serialization. The new snapshot was created exclusively with mode **0444**. The verdict binds this snapshot, not later edits to the working file.
- Preserved REVISE candidate: `R/.tmp/ld-s10y-lesson/b85-zero-summary/candidate/phy8-c2-s2-t13/lesson.template.json`.
- Its prior binding, reused rather than rehashed: `07ca18a2ee2f2be2da7d4207218870545d33ad4d15123197741a61480a300382`.

The previous report `R/.intentfold/tickets/STEMROBIN-180/modern-text-review-zero-summary-affected-b85.md` supplies E1 and its two concrete text-only fixes. The previous candidate, FIRST and report were not changed.

## Exact Affected Judgment

Only these two before/after text fields were compared and judged:

| Pointer | Preserved source reference | Observed repair and judgment | Verdict |
| --- | --- | --- | --- |
| `/prose/3/text` | `p0171#2` | The introductory sentence now closes its own prose emphasis before the existing LF. The unchanged `$|\vec{F}|=G\frac{m_1m_2}{r^2}$` and punctuation follow outside that span. The previous formula-line closing marker is removed. This exactly implements the first E1 fix: no emphasis span crosses the vector formula. | PASS |
| `/prose/5/text` | `p0171#4` | The prose prefix closes immediately before `$m|\vec{g}|$`; a separate prose span opens immediately after that unchanged formula and closes at the original sentence end. The small-height condition and all punctuation remain. This exactly implements the second E1 fix: both spans are prose-only. | PASS |

For each field, the actual repaired text equals the exact substitution prescribed by the previous report. Removing only the emphasis asterisks makes its before/after strings byte-identical, including prose, math delimiters, formula payload, punctuation and LF. Both ordered formula payloads also match exactly. No detached closing delimiter or formula-crossing emphasis span remains in these submitted strings.

These are direct textual arrangement observations. No inline renderer, proseFlow, KaTeX, HTML, final paragraph count or image was inspected or generated. The historical B57 rendering observations remain historical evidence; this report does not claim new successful rendering.

## Reused Results

All already-PASS physics and SOURCE results are carried forward without replay. In particular, t13's Hooke and friction repairs, the gravity model/magnitude meaning and the near-Earth approximation are not scientifically reviewed again.

All other fields and unchanged units are reused under the parent's explicit unchanged-field statement and the prior bindings. No complete-object diff, source-snapshot comparison or whole-t13 TEXT review was performed. No raw/source file or FIRST template was opened.

t12 remains at the previously supplied affected TEXT PASS and cumulative author repair **1**; it was not opened or reviewed. n38 is excluded and its unchanged UNKNOWN/HOLD is not reconsidered.

## Evidence And Counts

`R/.intentfold/tickets/STEMROBIN-180/tmp/b85-zero-summary-repair2/comparison.json` records the two exact before/after strings, pointers, source references, per-string hashes, exact-fix comparisons, formula payloads and candidate binding.
`review-seal.json` in the same directory binds the new report and comparison output externally; it does not rerun candidate or approved-stage checks.

- t13 cumulative author repair rounds: **2**, including prior **1** and the parent's repair2. Reviewer content repairs: **0**. No count reset or additional round.
- Images authorized/opened: **0/0**. Renderer executions, external references, paid/model-service requests, payments and retries in this continuation: **0**.
- Writes were limited to this new report and the new ticket scratch `tmp/b85-zero-summary-repair2/`. Working input, prior candidate, FIRST, prior reports, product tools and other work were untouched.
- Every shell command explicitly used R as workdir. No setup/freshness, prepare/finalize/index, render, image, test/build, Git, environment, DB, publisher, message, ticket update or descendant operation occurred.

**Stop disposition: hash-bound affected-only TEXT PASS, E1 resolved at both requested pointers. No dependent stage or follow-on action was started.**
