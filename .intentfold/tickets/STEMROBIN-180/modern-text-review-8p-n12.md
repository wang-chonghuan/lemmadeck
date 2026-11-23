# Modern Text Review: 8p n12

2026-11-23. FIRST modern full-text/exercise review by the SAME sole independent
SOURCE reviewer. All commands used
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180`.

## Decision And Scope

**PASS, zero author edits requested.** No new definite content defect, REVISE
unit or HOLD unit in this modern-text scope.

| Reviewed unit | Decision | Exact scope |
| --- | --- | --- |
| `lesson.prose[0..38]` | PASS | All 39 assembled prose objects, including the original worked-example prose |
| Written questions 1-8, group `g1`, printed exercise 8 | PASS | Eight whole questions, source identity, numbers, units and wording; not their answers |
| `p0061-projection-norm-1` at `lesson.prose[20]` | PASS | Source-bound corrected phrase and explicit reader-facing original-error disclosure |
| Final text flow and section separators | PASS | 48 paragraphs, seven exact adjacent text boundaries |
| Figure manifest | PASS, empty | Zero source/modern figures; no image review implied |

This approval binds the author templates retained below, not a future
finalized edition. It does not approve display, answers, keys, choices,
interactions, finalization, rendering, publication or complete delivery.
n13 is excluded; page65 is not given whole-page PASS.

## Full-Text Comparison

Both template `source.data` objects are deeply identical to the current raw
lesson/exercises JSON; every `source_text` is exact. All raw metadata,
prose identities/source references, exercise numbers/groups/page references,
formula occurrences, numeric occurrences and contexts are preserved.

The only non-whitespace changes are four adjacent strong-wrapper joins at
prose indices 3,6,13,21, and the registered correction at index20. The joins
remove an internal `****` boundary between two already-strong runs, changing
neither wording nor intended emphasis. All other changes are declared layout.
No numeric or cultural substitutions were needed or made. Source-supported
page62 ordinary/italic/under-dot treatments remain intact, using the collected
native typography verdict without pixel replay.

The unit paragraph remains one object with references
`["p0060#9","p0061#1"]`. The four-source-row scientific footnote remains a
separate prose object at index15, label `source-footnote-p0060-1`, reference
`["p0060#10"]`, retaining its average-acceleration qualification.

The eight complete questions match raw text exactly; their printed source-row
`lines` are joined into whole question strings. Question6 retains **36
kilometres/second**, not kilometres/hour. That unusual inherited value is not
silently repaired or certified as a realistic vehicle scenario. Question8
retains acceleration 10 metres/second squared, duration 0.5 hours, and its
maximum-speed wording. No question was solved and no answer artifact was read.

The mathematical exposition retains the velocity-change/time definition,
vector-to-axis projection relation, acceleration units, stopping/reversal
conditions and reference-frame context. The decrease-of-speed statement is
read together with the following zero-speed/reversal paragraph, not as a
claim of continued decrease after reversal. No new mathematical contradiction
was found in this comparison.

## Registered Scientific Correction

The faithful raw phrase remains exactly:

`它们投影的绝对值等于矢量和的绝对值`

The modern replacement is exactly:

`它们投影的绝对值分别等于各个矢量自身的大小（原书此处把单个矢量误写为矢量和）`

For a unit axis vector `e`, a parallel vector `w = s e` has scalar projection
`s` and norm `|s|`. Thus the absolute projection equals **that vector's own
norm**, not the norm of a sum. Same-axis vectors of magnitudes1 and3 can have
sum magnitude4, which is neither individual projection magnitude. The
replacement is mathematically correct in the stated collinear setting.
The parenthetical disclosure is visible lesson text, not only hidden metadata.

The erratum is unique, targets `lesson.prose[20]`, uses source block
`p0061#6`, physical61/printed49, and declares `math-correction`. Its original,
reason and page JSON identity match the collected native62 supplement's
page61 registration binding. Page JSON SHA256:
`cf565feda71df05239e4e06c3522d1abc9467a4c256804d783835768e9e59e50`.
The inherited PDF identity is
`4ec6a3d5fafe2c5c861a5053cf8cf047a3a6bd7988a4de799859d6a4fef8cc46`;
the PDF was not reopened/rehashed. The original SOURCE scientific finding
remains historical fact; this modern correction addresses it without
retroactively turning the erroneous raw sentence into scientific PASS.

## Paragraph Boundaries

The authoritative `htmlfrag.js` `proseOutline` and `sectionBreakIndices`,
also used by `prose_flow.mjs`, resolve 48 paragraphs and seven boundaries.
The zero-based indices of the **first paragraph after each separator** are
`[2,10,16,21,26,31,40]`; these are not prose-block counts or indices of the
paragraph before each separator.

Every authored `{before,after}` pair exactly matches adjacent final paragraphs.
The transitions are to uniform acceleration, measurement units, axis
projections after the separate footnote, speed increase/decrease, relative
motion, example1, and example2. Exact full boundary text and paragraph-to-block
mapping are retained in
[prose-flow.json](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s2-n12/text-review/prose-flow.json).
This is textual flow inspection, not browser/HTML display approval.

## Frozen Bindings

Evidence root:
`/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s2-n12/text-review/`.

The three `approved-*.snapshot.json` files are exact template byte copies with
permissions0444 and original `status: draft`. They are evidence only, not
executable production templates or finalized lesson artifacts. The durable
copies do not depend on scratch origins surviving.

| Bound file | Bytes | SHA256 |
| --- | --- | --- |
| Raw lesson JSON | 14935 | `47574075fb85cb3836e5d1aa3467fe61fdbb033748ab1127a329fe2766ef28ee` |
| Raw exercises JSON | 3919 | `4534655da4c3dce4c6509d26ac85d01c849dc9093fc27152a52f2a52402324ba` |
| `approved-lesson.snapshot.json` | 48659 | `6ee35250cb574b2f66f27e4af0a2c0c117950214291140a65ca8e0025d85e784` |
| `approved-exercises.snapshot.json` | 10280 | `e0badba167e406aa999bcc2df9337415b4c0b7e77584e59aeac4d3b67971b30d` |
| `approved-figures.snapshot.json` | 153 | `78474bccc5a58762829f89f0bee41fd990e13c482bf08a4ed2d0cdde0558e00c` |

[bindings.json](/Users/yong/work/lemmadeck-ws/lemmadeck--STEMROBIN-180/ssot-resources/soviet10year-textbooks/artifacts/8p/editions/modern-us-neutral/lessons/phy8-c1-s2-n12/text-review/bindings.json)
records absolute raw/template/snapshot paths, matching hashes, this report's
hash, per-prose and per-question checks, flow hash, erratum and reused source
evidence. Only the requested report and owned evidence in that root were
written. No production JSON, source file or author template was changed.

## History And Usage

The collected source59/60/61 fidelity approvals, native62 zero-edit typography
PASS, limited65 exercise8/boundary approval and promoted63/64 evidence are
reused, not repeated. Original source reports remain frozen, including the
earlier three typography HOLDs and the scientific finding. All previous FIRST
failures, repairs, finalize counts, technical recovery, image counts and
known/unknown costs are retained; none is reset.

Modern phase: new images0, source replay0, reopens0, returned image payloads0.
Reviewer cumulative images remain **11/24** (previous8 + native crops3 + new0).
No paid service/generation request was made; historical unknown cost remains
unknown. The earlier missing modern-directory listing exit2 and two no-match
image-rule heading searches exit1 are discovery events, not content failures;
the rules were obtained by direct local skill read.

No source/template edits, finalize/render/assemble/promote calls, DB/deploy/Git
writes, installs, chats, timers or workers. No separate solutions, keys,
answer drafts or parent source-solutions access. No pending command remains.

**Return this content result and wait for the blind source-solving phase.**
