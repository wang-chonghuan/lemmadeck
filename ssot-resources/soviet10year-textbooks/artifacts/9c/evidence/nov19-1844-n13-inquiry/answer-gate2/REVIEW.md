# STEMROBIN-184 B n13: First Formal Gate2 Answer Comparison

Decision: PASS for the current hash-bound exercise115 answer only, subject to
the actual comparison result and input-stability receipt in verdict.json.
This is a distinct first formal Gate2, not a replay of the completed FIRST
mathematics or disclosed modern textual review. Stop completed for parent
intake BEFORE any answer finalizer. No finalization/publication approval.

## Authority and Scope

Gate: .claude/skills/ld-s10y-answer/references/gate-2-lesson-answers/gate.md.
Reused FIRST-findings.md, FIRST-expectations.json and FIRST-freeze.json from
ssot-resources/soviet10year-textbooks/artifacts/9c/evidence/nov19-1844-n13-inquiry/source-first/.
Reused content-review/verdict.json and content-review/REVIEW.md in the same
retained evidence root. Their actual bytes/SHA-256, together with every
disclosed input and consulted instruction file, are in verdict.json.
No independent solve, proof, negative control or prior check was rerun.
No retained evidence was copied or edited.

Compared only current modern n13 exercises.json and answer-keys.json,
official answer-keys.template.json, and n13-answer-bound.receipt.json.
The receipt binds current exercises, official template and current answer.
Its earlier candidate hash is retained as receipt metadata only: the
candidate, original correction and any old choices were NOT opened.
Modern source.data and source_text are visible within the permitted exercise
file; no raw lesson, source page, modern lesson or figure file was opened.

## Checks 1 Through 9

Each column explicitly grades the named subpart. NA is not a passed editor
transaction or a missing verification disguised as PASS.

| Gate Check | 115a | 115b | 115c | 115d | Concrete Basis |
| --- | --- | --- | --- | --- | --- |
| 1. Same exercise/prompt/figure/book-answer identity | PASS | PASS | PASS | PASS | Single number115, source_number115, g1, p0057#5; ordered modern a-d match FIRST Cyrillic-to-Latin mapping and all four signed fractions. Official template prompt equals current modern prompt. No exercise figures and no bookRaw matched. |
| 2. Actually verify bookRaw if present | NA | NA | NA | NA | No bookRaw in official template or current answer. No assertion about omitted answers across the whole book. |
| 3. Complete derived solve when no book answer | PASS | PASS | PASS | PASS | Official template and answer both say derived. Reuse frozen approved FIRST full solutions; compare current display against those expectations, do not solve again. |
| 4. Independent parts, labels and units | PASS | PASS | PASS | PASS | Explicit ungraded full-explanation exception: all four labeled representations AND written reasons are in displayAnswer; parts=[] MUST remain empty. No numeric subparts or units are requested. Do not manufacture auto parts for these explanation tasks. |
| 5. Input expected and actual MathLive exact edit | NA | NA | NA | NA | Ungraded, parts=[]; no expected, exact, numeric or expression transaction. MathLive attempts0. Editor NOT exercised; no setter/self-comparison is evidence of an editor transaction. |
| 6. Understandable standard answer/reasons | PASS | PASS | PASS | PASS | Four decimal representations, correct repeating strings and per-part remainder explanations, plus deterministic finite-remainder reason. Correct Chinese 七分之四, integer-only bar scope and negative decompositions agree with FIRST. |
| 7. Auto only when reliably determinable | PASS | PASS | PASS | PASS | No auto answer or judge is declared. Full representations AND written explanations are not reduced to scalar grading. |
| 8. Explanatory/open response ungraded | PASS | PASS | PASS | PASS | Current grading=ungraded and parts=[] preserve the explanation request without fabricated correct/incorrect judgment. |
| 9. Lesson-local completeness and provenance | PASS | PASS | PASS | PASS | This lesson's one numbered exercise has one key and four ordered explanations; no duplicate/missing lesson-local exercise or requested quantity. Derived provenance remains separate from unmatched bookRaw. No whole-book completeness claim. |

## Comparison Against Approved FIRST, Not Fresh Arithmetic

| Part | FIRST Reference | Current Prose and Identity |
| --- | --- | --- |
| a | FIRST "115a: 7/3"; expectations.exercise115[0] | 2.333333...=2.(3), integer2, initial remainder1, recurring digit3 and remainder1. The full per-part reason is present. Approved N=1,p=1; these are supporting FIRST facts, not separately requested answer fields. |
| b | FIRST "115b: 23/30"; expectations.exercise115[1] | 0.766666...=0.7(6), initial integer0 and pre-digit remainder23 are implicit in the given fraction/decimal, not falsely stated as20. Prose explicitly gives first digit7 with outgoing remainder20, then digit6 and remainder20 recurring. Prefix7 and tail6 agree with approved N=2,p=1. No demand to list every intermediate division quantity was added. |
| c | FIRST "115c: -3/7"; expectations.exercise115[2] | overline{1}.571428571428...=overline{1}.(571428), with explicit -3/7=-1+4/7 and corrected 七分之四. Initial remainder4 and chain4->5->1->3->2->6->4; digits5,7,1,4,2,8; six-digit return. Bar encloses only1, not the fractional tail. Approved N=1,p=6. |
| d | FIRST "115d: -29/11"; expectations.exercise115[3] | overline{3}.363636...=overline{3}.(36), with explicit -29/11=-3+4/11; initial remainder4, chain4->7->4 and digits3,6. Bar encloses only3. Approved N=1,p=2. |

The modern prompt retains "use infinite decimals AND explain why recurring".
Each answer supplies both; no asked-for quantity or explanation is omitted.
The concluding finite-state/deterministic-remainder prose supports all four.
N,p and shortest-period proofs are already approved FIRST evidence; they
were not recomputed, nor added as new demands on the student's answer.
The source floor-integer/bar convention remains consistent with the modern
textual review. A whole-number minus is not silently substituted with the
same tail. No persons, units, cultural replacements or historical entities
are introduced; historical_entities=[] matches the official template.

## Native Evidence and Failure Retention

compare.mjs is a NEW small JSON/hash/lexical comparison against retained
FIRST and official bindings. It performs no fraction arithmetic, long
division, rendering, browser edit, prior PASS-check or source solve.
run.mjs launches it ONCE with the current native Node executable. Its actual
argv, cwd, Node version, timestamps, exit/signal, stdout/stderr file hashes
and execution_count appear in native.receipt.json. Each failed comparison is
kept in native.stdout.txt and verdict.json; no mutation, retry or rerun.
Inputs are rehashed for concurrency stability only, not re-reviewed.

This invocation's preliminary rg returned exit2 because the NEW authorized
output directory did not yet exist. Its actual error is preserved in
verdict.json under failure_retention.preparatory_failures. Its stdout was
only a filename inventory, not a passed content check. All other preparatory
read/hash commands returned exit0. The comparison's native exit is recorded
separately and does not erase the preliminary failure.

FIRST-findings.md retains: its initial rg exit2; first runner exit1 for
literal heading whitespace mismatch BEFORE mathematics ran; three deliberate
negative controls exiting1. These remain references, not current defects
and not replayed runs. The receipt retains priorAuthorContentRevisions=1;
current answer notes retain the initial Chinese-reading correction.
The old candidate/correction was not disclosed here; its original erroneous
wording/severity is not reconstructed. Nothing in prior failure evidence is
deleted, rewritten or converted into a fresh PASS.

## Unchanged Limitations and UNKNOWNs

- Physical 象/像 glyph remains UNKNOWN.
- Exact printed repetition counts remain UNKNOWN.
- Figure pixels/internal long-division chain remain UNKNOWN; figure visual
  and mathematical approval remain PENDING in the reused textual evidence.
  They are not dependencies of figure-free exercise115: figureEvidence=[].
- Text review's whole-lesson/figure/choice/publishing limits stay unchanged.
  Only its previously pending answer Gate2 is settled for this exact key;
  the input notes/receipt still say pending because they are untouched
  pre-Gate2 records, not rewritten by the reviewer.
- No rendered/editor/runtime behavior, answer finalization, publication,
  DB state, live backend status, ticket handoff/closure or deployment is
  certified. No entire-book answer-omission inference.
- Tokens and monetary cost remain UNKNOWN. No paid calls were made.

Worker image_usage=0, allocation cap0; parent permanent24/24 unchanged.
No images/payloads, browsers, prepare/finalize/render, setup, .env, Git,
backend, DB, publish, E, app, main, merge, deploy, handoff, closure, history,
other chats, descendants or paid calls were accessed or invoked.
Writes are confined to .tmp/stemrobin-184-resume/n13-answer-gate2/.
One freeze.json inventories every other package file as {path,bytes,sha256};
it does not embed a self-referential hash. No answer finalizer follows.
