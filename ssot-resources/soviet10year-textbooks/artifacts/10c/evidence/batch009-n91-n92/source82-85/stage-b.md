# StageB: 10c Physical 82-85

One complete authorized comparison, 2026-11-16. Read the full frozen
source-handoff.md and all four durable page.md files. StageA unchanged.
Only this review directory was written; no durable edits or downstream work.

- StageA SHA-256: `74807deb75df0d475510670290b45a35c0336c60ed3c11292bba404bea24a797`
- Frozen handoff SHA-256 verified: `a68b144875a085716acad67917b608fa29ebe0b9cc21e1daee39acf2ad7c045e`
- All four durable page hashes match that handoff; all four author raw PNG hashes match StageA, including the independently prepared 84-85.
- StageB used three targeted native crops, no scaling or broad reopens: reviewer total 7/8 batch, 7/24 context. One of the four additionally authorized images remains unused; no budget reset.

## Supported Source Repairs

Durable page root:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/ssot-resources/soviet10year-textbooks/artifacts/10c/pages/`

1. **0082/page.md:49, §91 four-function list.** The two printed separators
   after `sin x` and `cos x` are commas, not `、`. Replace those two
   `、` with comma-family punctuation (`，` in the draft's convention).
2. **0082/page.md:58, final paired fraction display.** Keep the comma
   between the sin/cos formulas; replace the terminal `，` after the cos
   fraction with a full stop (`。` in the draft's convention). Native
   pixels show a terminal dot with no comma tail. Do not change formulas,
   line count, or cross-page ownership/continuation markers.
3. **0084/page.md:57,60,63, tasks 261-263.** In each requested-function
   list, the two separators after the first and second functions are
   printed commas, not `、`; replace those six `、` with comma-family
   punctuation. Keep each task on its one printed row. In 262 keep
   `tg(x/2)=-2`, all four alpha requests, and `errata: []` unchanged.

These are punctuation-family repairs, not inferred historical codepoints.
No supported repair to any word, mathematical symbol/value, equation tag,
true wrap, exercise numbering/group preface, example, or owner marker.

## Per-Object Verdicts

PASS/HOLD below describe the frozen drafts, before those small repairs.

| Object | Source Fidelity | Owner / Completeness / Mathematical Decision |
| --- | --- | --- |
| Task 260, p0082#1 | PASS: complete statement, star and both requested conclusions retained | HOLD locally for exact predecessor owner; definitely not §91. Any zero-resultant qualification remains a separate mathematical decision, not a source omission. |
| §91 heading and exposition, p0082#2-#4 -> p0083#1-#4 | HOLD only for repairs 1-2; all prose, formulas (1)-(4), domain exclusions and wraps otherwise PASS | PASS: correct §91 ownership and continuation; no font-based hold. |
| §91 worked example, p0083#5-#6 -> p0084#1-#4 | PASS | PASS: original equation, substitution, six calculation rows, approximation signs, excluded-root check and printed answer complete. |
| §91 exercise heading, p0084#5 | PASS | PASS: exactly `习题`, no shared preface, no subquestion sequence. |
| Task 261, p0084#6 | HOLD only for repair 3; all mathematical content PASS | PASS: §91, complete, no missing condition identified. |
| Task 262, p0084#7 | HOLD only for repair 3; literal x/alpha mismatch PASS | PASS for retaining the faithful underdetermined statement; HOLD for a numerical-calculation interpretation. Parent's explicit insufficient-information response is supported, but no answer artifact was reviewed. |
| Task 263, p0084#8 | HOLD only for repair 3; all mathematical content PASS | PASS: §91, complete. |
| Tasks 264-265, p0084#9-#10 | PASS individually | PASS individually: §91, complete. |
| §91 right boundary | PASS | PASS exactly after complete task 265 on physical 84/printed 78; 84 has no open block, 85 contributes nothing to §91. |
| §92 heading, introduction, formulas (1)-(3), p0085#1-#4 | PASS | PASS for §92 ownership and this page's content. |
| §92 worked example 1, p0085#5-#6 | PASS | PASS: full task and three-row equality, not an exercise-group task. |
| §92 cosine formulas (4)-(5) and final sentence, p0085#7-#8 | PASS for visible text and open ending `得出` | HOLD for complete §92 beyond this range; no absent next-page conclusion has been invented. |
| Folios and visual-object inventory | PASS: 76-79, correct physical correspondence; no figures/tables/captions/teaching footnotes | Flanking folio dots are decorative, not missing instructional objects or grounds for HOLD. |

## Retained and Rejected Findings

- Retain StageA's exact-family/codepoint/scan UNKNOWN qualifications unchanged. No unreadable mathematical condition was exposed; identifiable comma/full-stop families do not identify historical Unicode or fonts.
- Retain task 260's predecessor-owner HOLD and §92's out-of-range completeness HOLD. Neither extends to §91's proven right boundary.
- **Reject as a required repair** StageA's recommendation that 262 must acquire an erratum/correction. The now-selected faithful task plus explicit insufficient-information disposition needs no guessed intended calculation. Preserve that earlier recommendation in StageA, with this disposition; do not silently substitute alpha for x.
- No missing source row was found. The author's 82/83 machine-line discrepancies alone do not support invented rows, exclusions or altered wraps. Existing five `↵` locations match the source: 83 twice, 84 once, 85 twice.

## Targeted Evidence

All crops live in:
`/Users/yong/.codex/worktrees/a07e/lemmadeck/.intentfold/tickets/STEMROBIN-184/tmp/production-source10c82-85-review/`

- `p0082-list-native.png`, native box `(450,1310,1070,1410)`; SHA-256 `84ad8084a604974ae8bef77528800b7838621be802f89d456e854d52868ec253`.
- `p0082-final-display-native.png`, native box `(205,2010,1335,2240)`; SHA-256 `6d201960b309f234e637dd779550e63eb83e650d7caddbb7ae4cdf311098d151`.
- `p0084-task-lists-native.png`, native box `(100,1730,1280,2080)`; SHA-256 `2383197452af865ddf1a92216bbbe809eedd94766dfd9f1fdd15d77344a3862c`.

StageB complete; source-only text handoff. Repairs, if made, require comparison
only of these changed units, not a second whole-range review. No runtime,
archives, binder, gates, finalize/assemble, modern artifacts, DB, Git or tests.
